
const pdf = require("html-pdf");
// const excel = require('exceljs');


let invoiceController = {
	async getListInvoices(req, res) {
		let LIMIT = req.param("LIMIT", 1000);

		if (!req.session.cookie && req.session.cookie.client == undefined) return res.forbidden();

		let invoices = await Db.find("SELECT CLIFAC, YEAR, CODFAC, TIPFAC, VENFAC, FECFAC, TOTFAC FROM F_FAC WHERE CLIFAC=? ORDER BY FECFAC DESC LIMIT ?;", [req.session.cookie.client, LIMIT]);
		await Promise.all(invoices.map(async (invoice) => {
			invoice.lines = await Db.find("SELECT * FROM F_LFA WHERE CODLFA=? AND TIPLFA=? AND YEAR=? ORDER BY POSLFA ASC;", [invoice["CODFAC"],invoice["TIPFAC"],invoice["YEAR"]]);
		}));
		return res.json(invoices);
	},
	async getInvoice(req, res) {
		let YEAR = req.param("YEAR", undefined);
		let TIPFAC = req.param("TIPFAC", undefined);
		let CODFAC = req.param("CODFAC", undefined);

		if (YEAR == undefined|| TIPFAC==undefined || CODFAC==undefined) return res.notFound();
		if (!req.session.cookie && req.session.cookie.client == undefined) return res.forbidden();

		let invoice = await Db.findOne("SELECT CLIFAC, YEAR, CODFAC, TIPFAC, VENFAC, FECFAC, TOTFAC FROM F_FAC WHERE CLIFAC=? AND YEAR=? AND TIPFAC=? AND CODFAC=?;", [req.session.cookie.client, YEAR, TIPFAC, CODFAC] );
		if (invoice != undefined) {
			invoice.lines = await Db.find("SELECT * FROM F_LFA WHERE CODLFA=? AND TIPLFA=? AND YEAR=? ORDER BY POSLFA ASC;",  [invoice["CODFAC"],invoice["TIPFAC"],invoice["YEAR"]]);
			await Promise.all(invoice.lines.map(async (line) => {
				line.info = await sails.controllers.product._getItemInfo(line["ARTLFA"], req.session);
			}));
			return res.json(invoice);
		} else {
			return res.notFound();
		}
	},
	async getPdfInvoice(req, res) {
		let YEAR = req.param("YEAR", undefined);
		let TIPFAC = req.param("TIPFAC", undefined);
		let CODFAC = req.param("CODFAC", undefined);

		if (YEAR == undefined|| TIPFAC==undefined || CODFAC==undefined) return res.notFound();
		if (!req.session.cookie && req.session.cookie.client == undefined) return res.forbidden();

		let invoice = await Db.findOne("SELECT F_FAC.*, NOCCLI, DESFPA, BNOFAC AS BANCLI FROM ((F_FAC INNER JOIN F_FPA ON F_FAC.FOPFAC= F_FPA.CODFPA ) INNER JOIN F_CLI ON F_FAC.CLIFAC=F_CLI.CODCLI )  FROM F_FAC WHERE CLIFAC=? AND YEAR=? AND TIPFAC=? AND CODFAC=?;", [req.session.cookie.client, YEAR, TIPFAC, CODFAC] );
		if (invoice != undefined) {
			invoice.lines = await Db.find("SELECT * FROM F_LFA WHERE CODLFA=? AND TIPLFA=? AND YEAR=? ORDER BY POSLFA ASC;", [invoice["CODFAC"], invoice["TIPFAC"], invoice["YEAR"]]);

			invoiceController._getBufferPdfInvoice(invoice).then(buffer => {
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
	_getBufferPdfInvoice: function(invoice) {
		return new Promise((resolve, reject) => {
			if (!invoice) reject(new Error("Invalid invoice"));
			sails.hooks.views.render("reports/invoice/invoice", { layout: "", invoice: invoice }, function(err, html) {
				if (err) {
					console.log(err);
					reject(err);
				}
				sails.log.debug(invoice.lines.length);
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
sails.controllers.invoice = invoiceController;
module.exports = invoiceController
