

let catalogController = {
	_config: {
		actions: false,
		shortcuts: false,
		rest: false
	},
	_getNextAndPreviousFamilies(CODFAM) {
		return new Promise(async (resolve, reject) =>{
			try {

				let response = {};
				let rowsArt = await Db.find("SELECT CODSEC, DESSEC, CODFAM, DESFAM FROM F_SEC LEFT JOIN F_FAM ON SECFAM=CODSEC WHERE SUWSEC=1 AND SUWFAM=1 ORDER BY ORDSEC, ORDFAM ASC;");
				response.first = rowsArt[0].CODFAM;
				response.last = rowsArt[rowsArt.length-1].CODFAM;

				let i = rowsArt.findIndex(el => el.CODFAM == CODFAM);
				response.previous = i > 0 ? rowsArt[i - 1].CODFAM : response.last
				response.next = i < rowsArt.length-1?  rowsArt[i + 1].CODFAM:  response.first
				return resolve(response);
			} catch (error) {
				sails.log.error(error);
				return reject(error);
			}
		});
	},
	_getItemsInFamily(CODFAM, session) {
		return new Promise(async (resolve, reject) =>{
			try {
				// let rowsArt = await Db.find("SELECT CODART, DESART, DIMART, OBSART, IMGART, PESART, EANART, UELART, UPPART,DEWART, DLAART, FAMART, SUWART  FROM F_ART WHERE SUWART=1 AND FAMART=? ORDER BY ORDART;", [CODFAM]);

				let rowsArt = await Db.find("SELECT CODART, DESART, DIMART, OBSART, IFNULL(CODIMG, CODART) AS IMGART, PESART, EANART, UELART, UPPART,DEWART, DLAART, FAMART, SUWART, IFNULL(ORDIMG,ORDART) AS ORD, IFNULL(CODCE1, '') as CODCE1, IFNULL(DESCE1, '') as CE1ART FROM F_ART LEFT JOIN F_ARC ON F_ART.CODART = F_ARC.ARTARC LEFT JOIN F_CE1 ON F_ARC.CE1ARC=F_CE1.CODCE1 LEFT JOIN F_IMG ON ARTIMG=CODART AND CODCE1=CE1IMG WHERE SUWART=1 AND FAMART=? ORDER BY CAST(ORD As INTEGER) ASC;", [CODFAM]);
				if (session && session.cookie.client != undefined) {
					if (session.cookie.infclient == undefined) session.cookie.infclient = await sails.controllers.client._getInfoClient(session.cookie.client);
					await Promise.all(rowsArt.map(async (rowArt) => {
						rowArt.price = await sails.controllers.client._getPriceClient(rowArt['CODART'], session);
					}));
				}
				return resolve(rowsArt);
			} catch (error) {
				sails.log.error(error);
				return reject(error);
			}
		});
	},
	_getItemsInSearch(text, session) {
		return new Promise(async (resolve, reject) =>{
			try {
				let LIMIT = 1000;
				let t = `%${text}%`;
				let rowsArt = await Db.find("SELECT CODART, DESART, DIMART, OBSART, IMGART, PESART, EANART, UELART, UPPART,DEWART, DLAART, FAMART, SUWART  FROM F_ART WHERE (CODART LIKE ? OR DESART LIKE ? OR EANART LIKE ? OR DEWART LIKE ? ) AND SUWART=1 AND FAMART<>'' ORDER BY FAMART,ORDART LIMIT ?;", [t,t,t,t, LIMIT]);
				if (session && session.cookie.client != undefined) {
					if (session.cookie.infclient == undefined) session.cookie.infclient = await sails.controllers.client._getInfoClient(session.cookie.client);
					await Promise.all(rowsArt.map(async (rowArt) => {
						rowArt.price = await sails.controllers.client._getPriceClient(rowArt['CODART'], session);
					}));
				}
				return resolve(rowsArt);
			} catch (error) {
				sails.log.error(error);
				return reject(error);
			}
		});
	},
	_getSection(CODFAM) {
		return new Promise(async (resolve, reject) =>{
			try {
				let row = await Db.findOne("SELECT CODFAM, DESFAM FROM F_FAM WHERE SUWFAM=1 AND CODFAM=?;",[CODFAM]);
				return resolve(row);
			} catch (error) {
				sails.log.error(error);
				return reject(error)
			}
		});
	},
	_getSections() {
		return new Promise(async (resolve, reject) =>{
			try {
				let rowsSec = await Db.find("SELECT CODSEC, DESSEC FROM F_SEC WHERE SUWSEC=1 ORDER BY ORDSEC ASC;");
				await Promise.all(rowsSec.map(async (rowSec) => {
					let rowsFam = await Db.find("SELECT CODFAM, DESFAM FROM F_FAM WHERE SUWFAM=1 AND SECFAM=? ORDER BY ORDFAM ASC;", [ rowSec.CODSEC ]);
					rowSec.fam = rowsFam;
				}));
				return resolve(rowsSec);
			} catch (error) {
				sails.log.error(error);
				return reject(error)
			}
		});
	},

	async getItemsFamily(req, res) {
		let CODFAM = req.param("CODFAM", undefined);
		if (!CODFAM) return res.serverError(new Error("Es necesario el parámetro CODFAM"));

		if (req.session.cookie.client != undefined)
			if (req.session.cookie.infclient == undefined)
				req.session.cookie.infclient = await sails.controllers.client._getInfoClient(req.session.cookie.client);
				// let start = new Date().valueOf();
		try {
			Promise.all([
				catalogController._getSection(CODFAM),
				catalogController._getNextAndPreviousFamilies(CODFAM),
				catalogController._getItemsInFamily(CODFAM, req.session)
			])
			.then(function (response) {
				// console.log("All Done!", parseInt(new Date().valueOf() - start));

				response[0].inf = response[1];
				response[0].items = response[2];
				return res.json(response[0]);
			});
		} catch (error) {
			sails.log.error(error);
			return res.serverError(error);
		}
	},

	getCatalog(req, res) {
		catalogController._getSections().then(data => {
			return res.json(data);
		}).catch(err => {
			sails.log.error(err);
			return res.serverError(err);
		})
	},

	// async getSearch(req, res) {
	// 	let text = req.param("text", undefined);
	// 	if (!text) return res.serverError(new Error("Es necesario el parámetro text"));

	// 	if (req.session.cookie.client != undefined)
	// 		if (req.session.cookie.infclient == undefined)
	// 			req.session.cookie.infclient = await sails.controllers.client._getInfoClient(req.session.cookie.client);


	// 	catalogController._getItemsInSearch(text, session).then(data => {
	// 		return res.json(data);
	// 	}).catch(err => {
	// 		sails.log.error(err);
	// 		return res.serverError(err);
	// 	})
	// }

}
if (!sails.controllers) sails.controllers = {};
sails.controllers.catalog = catalogController;
module.exports = catalogController
