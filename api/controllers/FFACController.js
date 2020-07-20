
/**
* FFAC.js
*
* @description :: F_FAC controller imported from Access factusol database at 29/5/2020 12:23:55.
* @docs        :: http://sailsjs.org/#!documentation/controllers
*/


/**
* FFAC.js
*
* @description :: F_FAC controller imported from Access factusol database at 29/5/2020 12:23:55.
* @docs        :: http://sailsjs.org/#!documentation/controllers
*/


let FFACController = {
	async find(req, res) {
		if (!req.session.cookie.token) return res.forbidden();

		let limit = req.param("limit", 1000);
		let sort = req.param("sort", 'id');
		let skip = req.param("skip", 0);

		let where = { CLIFAC: req.session.cookie.client };


		let i = await FFAC.find(where).sort([{ YEAR: "DESC" }, { CODFAC: "DESC" }]).limit(limit).skip(skip);;
		await Promise.all(
			i.map(async invoice => {

				// delete invoice.createdAt;
				// delete invoice.updatedAt;

				invoice.lines = await FLFA.find({YEAR: invoice["YEAR"], TIPLFA: invoice["TIPFAC"], CODLFA: invoice["CODFAC"]}).sort([{ POSLFA: "ASC" }]);
				invoice.PEND = 0;
				await Promise.all(
					invoice.lines.map(async line => {

						// delete line.createdAt;
						// delete line.updatedAt;

						// if (line["PENLFA"] > 0) invoice.PEND += 1;
					})
				);
			})
		);
		return res.send(i);
	},
	async findOne(req, res) {
		if (!req.session.cookie.token) return res.forbidden();

		let id = req.param("id", undefined);
		if (!id) return res.badRequest();

		let where = { id: id, CLIFAC: req.session.cookie.client };

		let i = await FFAC.find(where).sort([{ YEAR: "DESC" }, { CODFAC: "DESC" }]);
		if (i && i.length > 0) {
			invoice = i[0];

			// delete invoice.createdAt;
			// delete invoice.updatedAt;

			invoice.lines = await FLFA.find({ YEAR: invoice["YEAR"], TIPLFA: invoice["TIPFAC"], CODLFA: invoice["CODFAC"] }).sort([{ POSLFA: "ASC" }]);
			invoice.PEND = 0;
			await Promise.all(
				invoice.lines.map(async line => {

					// delete line.createdAt;
					// delete line.updatedAt;

					let arts = await FART.find({ CODART: line.ARTLFA });
					if (arts && arts.length > 0) {

						// delete arts[0].createdAt;
						// delete arts[0].updatedAt;

						if (req.session.cookie.client != undefined) {
							arts[0].price = await sails.controllers.FART._getPrice(req.session.cookie.client, arts[0]['CODART']);
						}
						line.info = arts[0];
					}
					// if (line["PENLFA"] > 0) invoice.PEND += 1;
				})
			);

			return res.json(invoice);
		} else {
			return res.notFound();
		}
	}
}
if (!sails.controllers) sails.controllers = {};
sails.controllers.FFAC = FFACController;
module.exports = FFACController;
