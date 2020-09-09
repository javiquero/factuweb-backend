/**
    * Seed Function
    * (sails.config.bootstrap)
    *
    * A function that runs just before your Sails app gets lifted.
    * > Need more flexibility?  You can also create a hook.
    *
    * For more information on seeding your app with fake data, check out:
    * https://sailsjs.com/config/bootstrap
    */
const fs = require('fs');
const jwt = require("jsonwebtoken");
const moment = require('moment');

module.exports.bootstrap = async function () {
	// if (!fs.existsSync(process.cwd() + "/config/local.js"))
	// 	sails.log.error("No existe");

	if (sails.config.models.migrate == 'drop') {
		sails.config.models.migrate = "safe";
		let data = "module.exports.models = " + JSON.stringify(sails.config.models, null,4);
		fs.writeFileSync(process.cwd() + "/config/models.js", data);
	}



	// Comprueba que existan los directorios de imagenes y , de ser necesario, los crea.
	if (!fs.existsSync(process.cwd() + "/photos"))
		fs.mkdirSync(process.cwd() + "/photos");

	if (!fs.existsSync(process.cwd() + "/thumbs"))
		fs.mkdirSync(process.cwd() + "/thumbs");

	if (!fs.existsSync(process.cwd() + "/thumbs/1024"))
		fs.mkdirSync(process.cwd() + "/thumbs/1024");

	if (!fs.existsSync(process.cwd() + "/thumbs/150"))
		fs.mkdirSync(process.cwd() + "/thumbs/150")

	// Elimina las imagenes de la base de datos que no existan en la carpeta de imagenes.
	if (Object.keys(sails.models).includes('image'))
		Image.find().then(images => {
			if (images && images.length > 0) {
				images.forEach(async image => {
					let md5 = image.MD5;
					let extension = image.extension || "jpg";
					if (!fs.existsSync(process.cwd() + "/photos/" + md5 + "." + extension)) {
						Image.destroy({ "MD5": md5 })
					}
				});
			}
		});

	// Elimina las imagenes que no existan en la base de datos.
	require("../api/controllers/ImageController").clear(process.cwd() + "/photos/");
	require("../api/controllers/ImageController").clear(process.cwd() + "/thumbs/1024/");
	require("../api/controllers/ImageController").clear(process.cwd() + "/thumbs/150/");

	// Configuración
	if (Object.keys(sails.models).includes('settings')) {
		let secret = await Settings.findOne({ KEY: 'secret' });
		if (!secret) {
			secret = sails.config.custom.secret;
			if (!secret) {
				require('crypto').randomBytes(48, async function (err, buffer) {
					secret = buffer.toString('hex');
					await Settings.create({ KEY: 'secret', VALUE: secret });
				});
			} else {
				await Settings.create({ KEY: 'secret', VALUE: secret });
			}
		}

		let token = await Settings.findOne({ KEY: 'token' });
		if (!token) {
			let num = moment().add(Math.random(30), "days").unix();
			token = sails.config.custom.token || jwt.sign({ rndnum: num }, secret);
			await Settings.create({ KEY: 'token', VALUE: token });
		}

		let conf = await Settings.find({})
		console.log('--------------------------------------------------------------------------------');
		await Promise.all(conf.map(item => { sails.config.custom[item.KEY] = item.VALUE; sails.log.debug("CONFIG - " + item.KEY + " - " + item.VALUE) }))
		console.log('--------------------------------------------------------------------------------');
	}

	// sails.log.debug(process.argv);
	if (process.argv.includes('restore'))
	if (process.env.NODE_ENV != 'production') {
		if (fs.existsSync(process.cwd() + "/db.zip")) {
			console.log('--------------------------------------------------------------------------------');
			console.log("Ok!,  Se procederá a importar todos los datos.\n");
			require("../api/controllers/ModelsController").updateFromSQLITE(true);
			console.log('--------------------------------------------------------------------------------');
		}
	}



};
