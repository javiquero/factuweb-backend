
/**
* FPCL.js
*
* @description :: F_PCL controller imported from Access factusol database at 29/5/2020 12:23:55.
* @docs        :: http://sailsjs.org/#!documentation/controllers
*/


let FPCLController = {
	async find(req, res) {
		if (!req.session.cookie.token) return res.forbidden();

		let limit = req.param("limit", 1000);
		let sort = req.param("sort", 'id');
		let skip = req.param("skip", 0);

		let where = { CLIPCL: req.session.cookie.client };


		let o = await FPCL.find(where).sort([{ YEAR: "DESC" }, { CODPCL: "DESC" }]).limit(limit).skip(skip);;
		await Promise.all(
			o.map(async order => {

				// delete order.createdAt;
				// delete order.updatedAt;

				order.lines = await FLPC.find({YEAR: order["YEAR"], TIPLPC: order["TIPPCL"], CODLPC: order["CODPCL"]}).sort([{ POSLPC: "ASC" }]);
				order.PEND = 0;
				await Promise.all(
					order.lines.map(async line => {

						// delete line.createdAt;
						// delete line.updatedAt;

						if (line["PENLPC"] > 0) order.PEND += 1;
					})
				);
			})
		);
		return res.json(o);
	},
	async findOne(req, res) {
		if (!req.session.cookie.token) return res.forbidden();

		let id = req.param("id", undefined);
		if (!id) return res.badRequest();

		let where = { id: id, CLIPCL: req.session.cookie.client };

		let o = await FPCL.find(where).sort([{ YEAR: "DESC" }, { CODPCL: "DESC" }]);
		if (o && o.length > 0) {
			order = o[0];

			// delete order.createdAt;
			// delete order.updatedAt;

			order.lines = await FLPC.find({ YEAR: order["YEAR"], TIPLPC: order["TIPPCL"], CODLPC: order["CODPCL"] }).sort([{ POSLPC: "ASC" }]);
			order.PEND = 0;
			await Promise.all(
				order.lines.map(async line => {

					// delete line.createdAt;
					// delete line.updatedAt;

					let arts = await FART.find({ CODART: line.ARTLPC });
					if (arts && arts.length > 0) {

						// delete arts[0].createdAt;
						// delete arts[0].updatedAt;

						if (req.session.cookie.client != undefined) {
							arts[0].price = await sails.controllers.FART._getPrice(req.session.cookie.client, arts[0]['CODART']);
						}
						line.info = arts[0];
					}
					if (line["PENLPC"] > 0) order.PEND += 1;
				})
			);

			return res.json(order);
		} else {
			return res.notFound();
		}
	}
}
if (!sails.controllers) sails.controllers = {};
sails.controllers.FPCL = FPCLController;
module.exports = FPCLController;
