
/**
* FAGE.js
*
* @description :: F_AGE controller imported from Access factusol database at 29/5/2020 12:23:54.
* @docs        :: http://sailsjs.org/#!documentation/controllers
*/
let FAGEController = {
	async find(req, res) {
		if (!req.session.cookie.token) return res.forbidden();

		let where = { CODCLI: req.session.cookie.client };
		// if (req.session.cookie.token == sails.config.custom.APIToken) {
		// 	where = req.allParams();
		// 	let agent = await FAGE.find(where);
		// 	return res.send(agent);
		// } else {
			let c = await FCLI.find(where);
			if (c && c.length > 0) {
				let client = c[0];
				let agent = await FAGE.find({ CODAGE: client["AGECLI"] });
				if (agent && agent.length > 0) {
					return res.json(agent[0]);
				}
			}
			return res.notFound();
		// }
	},
}
if (!sails.controllers) sails.controllers = {};
sails.controllers.FAGE = FAGEController;
module.exports = FAGEController;
