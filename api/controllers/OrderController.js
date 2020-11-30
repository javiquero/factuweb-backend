
const pdf = require("html-pdf");
const Data = require("../services/Data");

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
	async getPreOrder(req, res) {
		let ID = req.param("ID", undefined);
		if (req.session.cookie.token != sails.config.custom.token)  return res.notFound();
		let order = await Data.findOne("SELECT * FROM orders WHERE ID=" + ID + ";");
		if (!order)  return res.notFound();
		let cli = await sails.controllers.client._getInfoClient(order.CODCLI);
		if (!cli)  return res.notFound();
		let age = await sails.controllers.client._getAgentClient(cli.AGECLI);
		let nomage = '';
		if (age) nomage = age.NOMAGE;

		let o = {
			TIPPCL: '',
			CODPCL: order.ID,
			FECPCL: order.FECHA,
			CLIPCL: order.CODCLI,
			AGEPCL: cli.AGECLI,
			NOMAGE: nomage,
			CNOPCL: cli.NOCCLI,
			CNIPCL:cli.NIFCLI,
			CPOPCL:cli.POBCLI,
			CDOPCL:cli.DOMCLI,
			TELPCL:cli.TELCLI,
			CPRPCL:cli.PROCLI,
			COMPCL: order.COMENTARIOS,
			lines:[]
		};
		let lines = JSON.parse(order.DATA);
		for (let i = 0; i < lines.length; i++) {
			let line = {
				TOTLPC: lines[i].price.price*lines[i].qty,
				CANLPC: lines[i].qty,
				DESLPC: lines[i].DESART,
				POSLPC: i+1,
				ARTLPC: lines[i].CODART,
				EANART: lines[i].EANART
			}
			o.lines.push(line);
		}
		orderController._getBufferPdfOrder(o, req.baseUrl).then(buffer => {
			res.set("Content-Type", "application/pdf");
			res.set("Content-Disposition", "filename=Order_" + ID + ".pdf");
			return res.send(buffer);
		})
		.catch(err => {
			sails.log.error(err);
			return res.badRequest(err.message);
		});

	},
	async getOrders(req, res) {
		if (req.session.cookie.token == sails.config.custom.token) {
			let orders = await Data.find("SELECT * FROM orders WHERE STATUS=1;");
			await Promise.all(orders.map(async (order) => {
				order.DATA = JSON.parse(order.DATA);
				// await Promise.all(order.DATA.map(async (line) => {
				// 	line.dto = line.price.dto;
				// 	line.clientPrice = line.price.clientPrice;
				// 	line.price = line.price.price;
				// }));
			}));
			res.json(orders);
		} else {
			return res.forbidden();
		}
	},
	async setOrderDownloaded(req, res) {
		let ID = req.param("ID", undefined);
		if (req.session.cookie.token != sails.config.custom.token) return res.notFound();
		await Data.execute("UPDATE FROM orders SET STATUS=2 WHERE ID=" + ID + ";");
		res.ok();
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
				res.set("Content-Disposition", "filename="+ YEAR + "_" + TIPPCL + "_" + CODPCL + ".pdf");
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
