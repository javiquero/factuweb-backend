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
	    let token = req.param("token", undefined);
		if (token != undefined) req.headers.authorization = "Bearer " + token;
		// console.log(req.headers.authorization);
		if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
			token = req.headers.authorization.split(' ')[1];

			if (token == sails.config.custom.token) {
				req.session.cookie.token = token;
				sails.log.info("API FactuWebUpdater (" + req.method + " " + req.protocol + ") " + req.url + " - " + ip);
				// sails.log.info("Params: ", JSON.stringify(req.allParams()));
				return next();
			}

			TokenService.decode(token).then(data => {
				if (token != sails.config.custom.token) {
					sails.log.info("-------- Auth ---------");
					sails.log.info("(" + req.method + " " + req.protocol + ") " + req.url + " - " + ip);
					sails.log.info("Token: " + token.substring(0, 10) + "..." + token.substring(token.length - 10, token.length));
					if (  Object.keys(req.allParams()).length != 0 && req.allParams().constructor === Object ) sails.log.info("Params: ", JSON.stringify(req.allParams()));
				}
				// sails.log.info("Policie/Auth",req.headers);
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
		} else {
			sails.log.error("-------- NO Auth ---------");
			sails.log.error("(" + req.method + " " + req.protocol + ") " + req.url + " - " + ip);

			sails.log.error("Policie/Auth",req.headers);
			return res.forbidden();
		}
	}


	//module.exports = async function(req, res, next) {
	// 	var token = req.headers.authorization;
	// 	// si no viene el token mandamos el error 401
	// 	if(!token)
	// 		return res.send(401,{ error : true, message : "token is required", status : 401 })
	// 	TokenService
	// 		.decode(token)
	// 		.then(function(decoded) {
	// 			// RedisService.get("TOKEN::" + decoded.userId)
	// 			// 	.then(function(result) {
	// 			// 		if(!result){
	// 			// 			//el token no existe en redis ya expiro
	// 			// 			//lo idea es mandar un error 403 para que en nuestra app se cierre en automatico cada vez que un en point
	// 			// 			// conteste el status 403
	// 			// 			return res.send(403,{ error : true, message : "La sesion ya expirto", status : 403 });
	// 			// 		}
	// 			// 		//si los datos del token son iguales a los que estan en redis entonces
	// 			// 		// el token es valido
	// 			// 		// si es diferente entonces el usuario inicio sesion en otro dispotivo y se anulo el token actual
	// 			// 		if( result.create == decoded.create &&
	// 			// 			result.expire == decoded.expire &&
	// 			// 			decoded.userId == result.userId){
	// 			// 			//aqui esta la magia a nuestro req le agregamos el userId que hizo la petición ya mostrare en el controller
	// 			// 			// como utilizar esta variable
	// 			// 			req.userId = result.userId.toString();
	// 			// 			//mandamos la peticion a nuestro controller
	// 			// 			return next();
	// 			// 		}else
	// 			// 			return res.send(403,{ error : true, message : "La sesion ya expirto", status : 403 });
	// 			// 	}).catch(function(err){
	// 			// 		return res.send(500,{ error : true, message : "Internal server error", status : 500 });
	// 			// 	});
	// 		})
	// 		.catch(function(err){
	// 			//ocurrio un error al decodificar o alguien genero un token con el key incorrecto.
	// 			return res.send(500,{ error : true, message : "Internal server error", status : 500 });
	// 		});
	// }
