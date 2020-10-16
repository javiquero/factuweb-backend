
let clientController = {
	_config: {
		actions: false,
		shortcuts: false,
		rest: false
	},
	_getInfoClient(CODCLI) {
		return new Promise(async (resolve, reject) => {
			try {
				let row = await Db.findOne("SELECT * FROM F_CLI WHERE CODCLI=?;",[CODCLI]);
				return resolve(row);
			} catch (error) {
				sails.log.error(error);
				return reject(error)
			}
		});
	},
	_getAddressesClient(CODCLI) {
		return new Promise(async (resolve, reject) => {
			try {
				let rows = await Db.find("SELECT * FROM F_OBR WHERE CLIOBR=?;", [CODCLI]);
				return resolve(rows);
			} catch (error) {
				sails.log.error(error);
				return reject(error)
			}
		});
	},_getAgentClient(CODAGE) {
		return new Promise(async (resolve, reject) => {
			try {
				if (CODAGE == undefined) CODAGE=1000
				let rows = await Db.findOne("SELECT * FROM F_AGE WHERE CODAGE=?;", [CODAGE]);
				return resolve(rows);
			} catch (error) {
				sails.log.error(error);
				return reject(error)
			}
		});
	},
	_getSpecialPricesFromClient(CLIPRC, ARTPRC) {
		return new Promise(async (resolve, reject) => {
			try {
				let row = await Db.findOne("SELECT * FROM F_PRC WHERE CLIPRC=? AND ARTPRC=?;", [CLIPRC, ARTPRC]);
				return resolve(row);
			} catch (error) {
				sails.log.error(error);
				return reject(error)
			}
		});
	},
	_getPriceClient(codart, session) {
		return new Promise(async (resolve, reject) => {

			let response = { dto:0, price: 0, clientPrice: 0 }

			if (session.cookie.infclient == undefined) session.cookie.infclient = await this._getInfoClient(session.cookie.client);
			let infcli = session.cookie.infclient;
			if (!infcli ) return reject("Inválid codcli");

			let preart = await sails.controllers.product._getPricesProduct(codart);
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

			let prc = await this._getSpecialPricesFromClient(session.cookie.client, codart);
			if (prc) {
				console.log(response);
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

	async getAddresses(req, res) {
		if (!req.session.cookie && req.session.cookie.client == undefined) return res.forbidden();
		try {
			let cli = await clientController._getInfoClient(req.session.cookie.client);
			cli.address = await clientController._getAddressesClient(req.session.cookie.client);
			return res.json(cli);
		} catch (error) {
			sails.log.error(error);
			return res.serverError(error);
		}
	},

	async getAgentInfo(req, res) {
		if (!req.session.cookie && req.session.cookie.client == undefined) return res.forbidden();
		try {
			let cli = await clientController._getInfoClient(req.session.cookie.client);
			cli.agent = await clientController._getAgentClient(cli.AGECLI);
			return res.json(cli);
		} catch (error) {
			sails.log.error(error);
			return res.serverError(error);
		}
	}


}

if (!sails.controllers) sails.controllers = {};
sails.controllers.client = clientController;
module.exports = clientController
