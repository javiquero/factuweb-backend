
/**
* FLFA.js
*
* @description :: F_LFA controller imported from Access factusol database at 29/5/2020 12:23:55.
* @docs        :: http://sailsjs.org/#!documentation/controllers
*/

module.exports = {}



/**
* FAGE.js
*
* @description :: F_AGE controller imported from Access factusol database at 29/5/2020 12:23:54.
* @docs        :: http://sailsjs.org/#!documentation/controllers
*/
let FLFAController = {
	async find(req, res) {
		if (!req.session.cookie.token) return res.forbidden();
		if (req.session.cookie.token != sails.config.custom.APIToken) {

			let from = req.param("from", 0);
			let numitems = req.param("items", 100000);
			let count = req.param("count", undefined);

			// let _cli = FCLI.findOne({ CODCLI: req.session.cookie.client });
			let _fac = await FFAC.find({ CLIFAC: req.session.cookie.client }).sort(["YEAR", "CODFAC"]);

			let items = []
			await Promise.all(_fac.map(async (f) => {
				try {
					let lines = await FLFA.find({ TIPLFA: f.TIPFAC, CODLFA: f.CODFAC }).sort("POSLFA");
					items = items.concat(lines);
				} catch (error) {
					sails.log.error(error);
				}
			}));

			let cods = [];
			await Promise.all(items.map(async (item) => {
				if (!cods.includes(item['ARTLFA']) && item['CANLFA']>0) cods.push(item['ARTLFA'])
			}));

			if (count) return res.json(cods.length);

			// let response = [];
			cods = cods.slice(from, from + numitems);
			// await Promise.all(cods.map(async (item) => {
			// 	let a = await FART.findOne({ CODART: item });
			// 	if (a) {
			// 		try {
			// 			a.price = await sails.controllers.FART._getPrice(req.session.cookie.client, a['CODART'], _cli);
			// 			response.push(a)
			// 		} catch (error) {
			// 			sails.log.error(error);
			// 		}
			// 	}
			// }));

			return res.send(cods);
			// return res.send(response);

		} else {
			let where = req.param("where", req.allParams());

			let limit = req.param("limit", 1000);
			let sort = req.param("sort", 'id');
			let skip = req.param("skip", 0);

			delete where.limit;
			delete where.sort;
			delete where.skip;

			if (typeof where === 'string') where = JSON.parse(where);

			let arts = await FLFA.find(where).limit(limit).sort(sort).skip(skip);
			return res.send(arts);
		}
	},
}
if (!sails.controllers) sails.controllers = {};
sails.controllers.FLFA = FLFAController;
module.exports = FLFAController;
