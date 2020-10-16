

let productController = {
	_config: {
		actions: false,
		shortcuts: false,
		rest: false
	},
	_getPricesProduct(ARTLTA) {
		return new Promise(async (resolve, reject) => {
			try {
				let rows = await Db.find("SELECT * FROM F_LTA WHERE ARTLTA=? ORDER BY TARLTA ASC;", [ARTLTA]);
				return resolve(rows);
			} catch (error) {
				sails.log.error(error);
				return reject(error)
			}
		});
	},
	_getItemInfo(CODART, session) {
		return new Promise(async (resolve, reject) => {
			try {
				let info = await Db.findOne("SELECT * FROM F_ART WHERE CODART=?;", [CODART]);
				if (session.cookie.client != undefined) {
					if (session.cookie.infclient == undefined) session.cookie.infclient = await sails.controllers.client._getInfoClient(session.cookie.client);
					info.price = await sails.controllers.client._getPriceClient(info['CODART'], session);
				}
				return resolve(info);
			} catch (error) {
				sails.log.error(error);
				return reject(error)
			}
		});
	},
	// _getCountPurchasedItems(session) {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			if (session.cookie.client == undefined) return resolve(0);

	// 			let rowsArt = await Db.find("Select CODART, DESART, DIMART, OBSART, IMGART, PESART, EANART, UELART, UPPART,DEWART, DLAART FROM F_ART INNER JOIN (SELECT ARTLFA FROM F_FAC INNER JOIN F_LFA ON F_FAC.YEAR=F_LFA.YEAR AND F_FAC.TIPFAC=F_LFA.TIPLFA AND F_FAC.CODFAC=F_LFA.CODLFA WHERE CLIFAC=" + session.cookie.client + " GROUP BY ARTLFA) on ARTLFA = CODART WHERE  SUWART=1;");
	// 			return resolve(rowsArt.length);
	// 		} catch (error) {
	// 			sails.log.error(error);
	// 			return reject(error)
	// 		}
	// 	});
	// },
	_getPurchasedItems(session, limit=1000, from=1) {
		return new Promise(async (resolve, reject) => {
			try {
				if (session.cookie.client == undefined) return resolve([]);

				let rowsArt = await Db.find("Select CODART, DESART, DIMART, OBSART, IMGART, PESART, EANART, UELART, UPPART,DEWART, DLAART, FAMART, SUWART  FROM F_ART INNER JOIN (SELECT ARTLFA, DESLFA FROM F_FAC INNER JOIN F_LFA ON F_FAC.YEAR=F_LFA.YEAR AND F_FAC.TIPFAC=F_LFA.TIPLFA AND F_FAC.CODFAC=F_LFA.CODLFA WHERE CLIFAC=? GROUP BY ARTLFA) on ARTLFA = CODART AND DESLFA=DESART WHERE  SUWART=1 AND FAMART<>'' LIMIT ?,? ;", [session.cookie.client, from, limit]);
				// console.log(rowsArt.length);
				if (session.cookie.infclient == undefined) session.cookie.infclient = await sails.controllers.client._getInfoClient(session.cookie.client);

					await Promise.all(rowsArt.map(async (rowArt) => {
						rowArt.price = await sails.controllers.client._getPriceClient(rowArt['CODART'], session);
					}));
				return resolve(rowsArt);
			} catch (error) {
				sails.log.error(error);
				return reject(error)
			}
		});
	},





	// async getCountPurchasedItems(req, res) {

	// 	try {
	// 		let resp = await productController._getCountPurchasedItems(req.session);
	// 		return res.json(resp)
	// 	} catch (error) {
	// 		sails.log.error(error);
	// 		return res.serverError(error);
	// 	}
	// },
	async getSearchResults(req, res) {
		let q = req.param("q", undefined);
		if (!q) return res.json({});

		try {
			let resp = await sails.controllers.catalog._getItemsInSearch(q, req.session);
			return res.json(resp)
		} catch (error) {
			sails.log.error(error);
			return res.serverError(error);
		}

	},
	async getPurchasedItems(req, res) {

		try {
			let resp = await productController._getPurchasedItems(req.session);
			return res.json(resp)
		} catch (error) {
			sails.log.error(error);
			return res.serverError(error);
		}
	}

}
if (!sails.controllers) sails.controllers = {};
sails.controllers.product = productController;
module.exports = productController
