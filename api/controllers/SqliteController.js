
const fs = require('fs');
const Database = require('sqlite-async')
let _request = null;

let sqliteController = {
	getConnection() {
		return new Promise((resolve, reject) =>{
			fs.access(process.cwd() + "/db.sqlite", fs.constants.F_OK || fs.constants.R_OK, (err) => {
				if (err) {
					sails.log.error(`db.sqlite ${err.code === 'ENOENT' ? 'does not exist' : 'is not readable'} `);
					return reject(err);
				} else {
					Database.open(process.cwd() + "/db.sqlite").then(db => {
						return resolve(db);
					})
				}
			})
		});
	},
	_getInfoClient(CODCLI) {
		return new Promise(async (resolve, reject) =>{
			sqliteController.getConnection().then(async db => {
				let rows = await db.all("SELECT * FROM F_CLI WHERE CODCLI='" + CODCLI + "';");
				if (rows.length > 0) return resolve(rows[0]);
				return resolve(undefined);
			}).catch((err) => {
				sails.log.error(err);
				return reject(err)
			})
		});
	},
	_getBoughtProduct(ARTLTA) {
		return new Promise((resolve, reject) =>{
			sqliteController.getConnection().then(async db => {
				let rows = await db.all("SELECT * FROM F_LTA WHERE ARTLTA='" + ARTLTA + "' ORDER BY TARLTA ASC;");
				return resolve(rows);
			}).catch((err) => {
				sails.log.error(err);
				return reject(err)
			})
		});
	},
	_getSpecialPricesFromCLient(CLIPRC, ARTPRC) {
		return new Promise((resolve, reject) =>{
			sqliteController.getConnection().then(async db => {
				let rows = await db.all("SELECT * FROM F_PRC WHERE CLIPRC=" + CLIPRC + " AND ARTPRC='" + ARTPRC + "';");
				if (rows.length > 0) return resolve(rows[0]);
				return resolve(undefined);
			}).catch((err) => {
				sails.log.error(err);
				return reject(err)
			})
		});
	},
	_getPriceClient(codart, session) {
		return new Promise(async (resolve, reject) => {

			let response = { dto:0, price: 0, clientPrice: 0 }

			if (session.cookie.infclient == undefined) session.cookie.infclient = await sqliteController._getInfoClient(session.cookie.client);
			let infcli = session.cookie.infclient;
			if (!infcli ) return reject("Inválid codcli");

			let preart = await sqliteController._getBoughtProduct(codart);
			let t = 0;
			if (preart && preart.length > 0) {
				while (preart[t]['PRELTA'] >= 100000 && t<preart.length ) {
					t++;
				}

				response.price = preart[t]['PRELTA']
				response.clientPrice = preart[t]['PRELTA']

				if (infcli["TARCLI"] != preart[t]['TARLTA']) {
					// Tarifa Cliente
					let ind = preart.findIndex((element) => element['TARLTA'] == infcli["TARCLI"]);
					response.clientPrice = ind > -1 ? preart[ind]["PRELTA"] : preart[t]['PRELTA'];
					if (response.clientPrice >= 100000) response.clientPrice = preart[t]['PRELTA']

				} else {
					// Tarifa defecto
					response.clientPrice = preart[t]['PRELTA']
				}
			}

			// Descuentos ficha cliente
			if (infcli["DP1CLI"] && infcli["DP1CLI"] != 0) response.clientPrice -= (infcli['DP1CLI'] / 100) * response.clientPrice;
			if (infcli["DP2CLI"] && infcli["DP2CLI"] != 0) response.clientPrice -= (infcli['DP2CLI'] / 100) * response.clientPrice;
			if (infcli["DP3CLI"] && infcli["DP3CLI"] != 0) response.clientPrice -= (infcli['DP3CLI'] / 100) * response.clientPrice;

			let prc = await sqliteController._getSpecialPricesFromCLient(session.cookie.client, codart);
			if (prc) {
				// Precios/Descuentos especiales
				if (prc['TIPPRC'] == 0) {
					response.clientPrice = prc['PREPRC'];
				} else {
					response.clientPrice -= (prc['PREPRC'] / 100) * response.clientPrice;
				}
			}

			if ((response.clientPrice - response.price)!=0)
			response.dto = Math.ceil(((response.price - response.clientPrice) / response.price) * 100);

			return resolve(response);

		});
	},
	_getItemsInFamily(CODFAM, session) {
		return new Promise(async (resolve, reject) =>{
			sqliteController.getConnection().then(async db => {
				try {
					let rowsArt = await db.all("SELECT CODART, DESART, DIMART, OBSART, IMGART, PESART, EANART FROM F_ART WHERE SUWART=1 AND FAMART='" + CODFAM + "' ORDER BY ORDART;");
					if (session.cookie.client != undefined) {
						if (session.cookie.infclient == undefined) session.cookie.infclient = await sqliteController._getInfoClient(session.cookie.client);
						await Promise.all(rowsArt.map(async (rowArt) => {
							rowArt.price = await sqliteController._getPriceClient(rowArt['CODART'], session);
						}));
					}
					return resolve(rowsArt);
				} catch (error) {
					return reject(error);
				}

			}).catch((err) => {
				sails.log.error(err);
				return reject(err)
			})
		});
	},

	_getSections() {
		return new Promise(async (resolve, reject) =>{
			sqliteController.getConnection().then(async db => {
				let resp = [];
				let rowsSec = await db.all("SELECT CODSEC, DESSEC FROM F_SEC WHERE SUWSEC=1 ORDER BY ORDSEC;");
				await Promise.all(rowsSec.map(async (rowSec) => {
					let rowsFam = await db.all("SELECT CODFAM, DESFAM FROM F_FAM WHERE SUWFAM=1 AND SECFAM='" + rowSec.CODSEC + "' ORDER BY ORDFAM;");
					rowSec.fam = rowsFam;
					resp.push(rowSec);
				}));
				return resolve(resp);
			}).catch((err) => {
				sails.log.error(err);
				return reject(err)
			})
		});
	},


	async getItemsFamily(req, res) {
		let CODFAM = req.param("CODFAM", undefined);
		if (!CODFAM) return res.serverError(new Error("Es necesario el parámetro CODFAM"));

		if (req.session.cookie.client != undefined)
			if (req.session.cookie.infclient == undefined)
				req.session.cookie.infclient = await sqliteController._getInfoClient(req.session.cookie.client);

		sqliteController._getItemsInFamily(CODFAM, req.session).then(data => {
			try {
				return res.send(data);
			} catch (error) {
				sails.log.error(error);
			}
		}).catch(err => {
			sails.log.error(err);
			return res.serverError(err);
		})
	},
	getCatalog(req, res) {
		sqliteController._getSections().then(data => {
			return res.json(data);
		}).catch(err => {
			sails.log.error(err);
			return res.serverError(err);
		})
	},

}
if (!sails.controllers) sails.controllers = {};
sails.controllers.sqlite = sqliteController;
module.exports = sqliteController
