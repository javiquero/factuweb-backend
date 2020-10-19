
const pdf = require("html-pdf");

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
	},



	async getPdfOrder(req, res) {
		let YEAR = req.param("YEAR", undefined);
		let TIPPCL = req.param("TIPPCL", undefined);
		let CODPCL = req.param("CODPCL", undefined);

		if (YEAR == undefined|| TIPPCL==undefined || CODPCL==undefined) return res.notFound();
		if (!req.session.cookie && req.session.cookie.client == undefined) return res.forbidden();

		let order = await Db.findOne("SELECT * FROM F_PCL LEFT JOIN F_AGE ON F_PCL.AGEPCL=F_AGE.CODAGE WHERE CLIPCL=? AND YEAR=? AND TIPPCL=? AND CODPCL=?;", [req.session.cookie.client, YEAR, TIPPCL,CODPCL]);
		if (order != undefined) {
			order.lines = await Db.find("SELECT * FROM F_LPC LEFT JOIN F_ART ON F_LPC.ARTLPC = F_ART.CODART WHERE CODLPC=? AND TIPLPC=? AND YEAR=? ORDER BY POSLPC ASC;", [order["CODPCL"], order["TIPPCL"], order["YEAR"]]);

			// sails.hooks.views.render("reports/invoice/invoice", { layout: "",  invoice: invoice , baseUrl: req.baseUrl} , function (err, html) {
			// 	res.set("Content-Type", "text/html; charset=utf-8");
			// 	return res.send(html);
			// });
			// // return res.view("reports/invoice/invoice", { layout: "", invoice: invoice });

			orderController._getBufferPdfOrder(order, req.baseUrl).then(buffer => {
				res.set("Content-Type", "application/pdf");
				return res.send(buffer);
			})
			.catch(err => {
				sails.log.error(err);
				return res.badRequest(err.message);
			});
		} else {
			return res.notFound();
		}
	},
	_getBufferPdfOrder: function(order, baseUrl) {
		return new Promise((resolve, reject) => {
			if (!order) reject(new Error("Invalid order"));
			sails.hooks.views.render("reports/order/order", { layout: "", order: order, baseUrl: baseUrl }, function(err, html) {
				if (err) {
					console.log(err);
					reject(err);
				}
				// sails.log.debug(invoice.lines.length);
				let options = {
					format: "A4",
					orientation: "portrait"
				};
				pdf.create(html, options).toBuffer(function(err, buffer) {
					if (err) {
						console.log(err);
						reject(err);
					}
					resolve(buffer);
				});
			});
		});
	},

}
if (!sails.controllers) sails.controllers = {};
sails.controllers.order = orderController;
module.exports = orderController
