const nodemailer = require('nodemailer');
const htmlToText = require("html-to-text");

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
				// console.log(response);
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
	async sendEmail(req, res) {
		if (!req.session.cookie && req.session.cookie.client == undefined) return res.forbidden();

		let body = req.param("body", undefined);
		let subject = req.param("subject", undefined);

		let inf = await clientController._getInfoClient(req.session.cookie.client);
		let age = await clientController._getAgentClient(inf.AGECLI);

		let email_from = await Data.getSettings('email.from');
		let email_host = await Data.getSettings('email.host');
		let email_port = await Data.getSettings('email.port');
		let email_secure = await Data.getSettings('email.secure'); // true for 465, false for other ports
		let email_auth_user = await Data.getSettings('email.auth.user');
		let email_auth_pass = await Data.getSettings('email.auth.pass');
		let email_bcc = await Data.getSettings('email.bcc');
		let transporter = nodemailer.createTransport({
			host: email_host,
			port: email_port,
			secure: email_secure.toLowerCase()=="true"?true:false, //TLS
			auth: {
			  user: email_auth_user,
			  pass: email_auth_pass,
			},
			// requireTLS: true,
			tls: {
				rejectUnauthorized: false
			  }
		});

		let today = new Date();
		let date =  today.getDate()+"/"+ (today.getMonth() + 1) + "/" + today.getFullYear();
		let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		body = `<body style="word-wrap: break-word; -webkit-nbsp-mode: space; line-break: after-white-space;">
					<div style="width: 75%; margin-left: 12%; padding: 40px 0px; margin-top: 20px; background-color: white; ">
						<div style="margin: 0px 40px; font: 18px Helvetica;text-align: justify;">
							<table>
								<tbody>
									<tr>
										<td>Fecha del envío: </td>
										<td>${date}</td>
									</tr>
									<tr>
										<td>Hora del envío: </td>
										<td>${time}</td>
									</tr>
									<tr>
										<td>Cliente: </td>
										<td>${inf.CODCLI} - ${inf.NOFCLI}</td>
									</tr>
									<tr>
										<td>Nombre comercial: </td>
										<td>${inf.NOCCLI}</td>
									</tr>
									<tr>
										<td>Teléfono: </td>
										<td><a href="tel:${inf.TELCLI}">${inf.TELCLI}</a></td>
									</tr>
									<tr>
										<td>Email: </td>
										<td><a href="mailto:${inf.EMACLI}">${inf.EMACLI}</a></td>
									</tr>
								</tbody>
							</table>
							<br/>
							${body}
						</div>
					</div>
				</body>`;

		let email = inf.EMACLI != undefined && inf.EMACLI != "" ? inf.EMACLI : "web@factuweb.com";
		let ageemail = age.EMAAGE != undefined && age.EMAAGE != "" ? age.EMAAGE : email_bcc;
		 // send mail with defined transport object

		let info = await transporter.sendMail({
			replyTo:  inf.NOCCLI + "<" + email + ">",
			from: inf.NOCCLI + "<" + email_from + ">", // sender address
			to: age.NOMAGE + "<" + ageemail + ">", // list of receivers
			bcc: email_bcc,
			subject: "🔔 Mensaje desde la web: " + subject, // Subject line
			text: htmlToText.fromString(body, { wordwrap: 130 }), // plain text body
			html: body, // html body
		});
		return res.ok();
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
