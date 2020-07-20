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
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
	}

	// sails.log.info("-------- Public mode -----");
	// sails.log.info("(" + req.method + " " + req.protocol + ") " + req.url + " - " + ip);
	// sails.log.info("Token: " + token);
    // sails.log.info("Params: ", req.allParams());
	return next();

}
