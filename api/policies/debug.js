/**
    * sessionAuth
    *
    * @module      :: Policy
    * @description :: Simple policy to allow any authenticated user
    *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
    * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
    *
    */

module.exports = async function(req, res, next) {
    let ip = req.headers['x-real-ip'] || req.ip;
	let token = undefined;
	// sails.log.info("(" + req.method + " " + req.protocol + ") " + req.url + " - " + ip);
	if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
		token = req.headers.authorization.split(' ')[1];
		if (token == sails.config.custom.token) {
			req.session.cookie.token = token;
			sails.log.info("API FactuWebUpdater (" + req.method + " " + req.protocol + ") " + req.url + " - " + ip);
			return next();
		} else {
			TokenService.decode(token).then(data => {
				// if (token != sails.config.custom.token) {
					// sails.log.info("-------- Auth ---------");
					// sails.log.info("(" + req.method + " " + req.protocol + ") " + req.url + " - " + ip);
					// sails.log.info("Token: " + token.substring(0, 10) + "..." + token.substring(token.length - 10, token.length));
					// if (  Object.keys(req.allParams()).length != 0 && req.allParams().constructor === Object ) sails.log.info("Params: ", JSON.stringify(req.allParams()));
				// }
				req.session.cookie = data;
				req.session.cookie.token = token;
				// sails.log.debug(req.session.cookie);
				return next();
			}).catch(err => {
				sails.log.error("Incorrect Token (" + token + ")");
				sails.log.error("...........(" + req.method + " " + req.protocol + ") " + req.url + " - " + ip);
				sails.log.error(err.message);
				return res.forbidden();
			})
		}
	} else {
		return next();
	}

	// sails.log.debug("-------- Public mode -----");
	// sails.log.debug("(" + req.method + " " + req.protocol + ") " + req.url + " - " + ip);
	// sails.log.debug("Token: " + token);
    // sails.log.debug("Params: ", req.allParams());


}
