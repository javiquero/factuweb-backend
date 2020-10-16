var jwt = require("jsonwebtoken");
var moment = require('moment');
const Data = require("./Data");

module.exports = {
	decode: function(token) {
		return new Promise(function (resolve, reject) {
			jwt.verify(token, sails.config.custom.secret, function(err, decoded) {
				if (err) {
					sails.log.error("TokenService.decode",err);
					return reject({
						error: true,
						message: "Ocurrio un error al decodificar el token ",
						status: 500
					});
				}
				return resolve(decoded);
			});
		});
	},
	create : function(data){
		return new Promise( async function (resolve, reject) {
			let expire = moment().add(30, "days").unix();
			let token = jwt.sign({ client: data, expire: expire }, sails.config.custom.secret, { expiresIn: "30d" });

			try {
				await Data.execute("INSERT INTO session (token, data, expire) VALUES (?,?,?);", [token, data, expire]);
				return resolve(token);
			} catch (error) {
				return reject (error)
			}
			// Session.create({ token: token, data: data, expire:expire })
			// .then(function(row) {
			// 	return resolve(token);
			// })
			// .catch(function(e) {
			// 	return reject(e);
			// });
		})
	}
}
