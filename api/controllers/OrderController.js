

let orderController = {
	async getListOrders(req, res) {
		let LIMIT = req.param("LIMIT", 1000);
		if (!req.session.cookie && req.session.cookie.client == undefined) return res.forbidden();

		let rows = await Db.find("SELECT * FROM F_PCL WHERE CLIPCL=? ORDER BY FECPCL DESC LIMIT ?;", [req.session.cookie.client, LIMIT]);
		await Promise.all(rows.map(async (row) => {
			row.lines = await Db.find("SELECT * FROM F_LPC WHERE CODLPC=? AND TIPLPC=? AND YEAR=? ORDER BY POSLPC ASC;",[row["CODPCL"],row["TIPPCL"],row["YEAR"]] );
		}));
		return res.json(rows);
	},


	async getOrder(req, res) {
		let YEAR = req.param("YEAR", undefined);
		let TIPPCL = req.param("TIPPCL", undefined);
		let CODPCL = req.param("CODPCL", undefined);

		if (YEAR == undefined|| TIPPCL==undefined || CODPCL==undefined) return res.notFound();
		if (!req.session.cookie && req.session.cookie.client == undefined) return res.forbidden();

		let order = await Db.findOne("SELECT * FROM F_PCL WHERE CLIPCL=? AND YEAR=? AND TIPPCL=? AND CODPCL=?;", [req.session.cookie.client, YEAR, TIPPCL,CODPCL]);
		if (order != undefined) {
			order.lines = await Db.find("SELECT * FROM F_LPC WHERE CODLPC=? AND TIPLPC=? AND YEAR=? ORDER BY POSLPC ASC;", [ order["CODPCL"],order["TIPPCL"],order["YEAR"]]);
			await Promise.all(order.lines.map(async (line) => {
				line.info = await sails.controllers.product._getItemInfo(line["ARTLPC"], req.session);
			}));
			return res.json(order);
		} else {
			return res.notFound();
		}
	}

}
if (!sails.controllers) sails.controllers = {};
sails.controllers.order = orderController;
module.exports = orderController
