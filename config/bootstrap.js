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
const Data = require('../api/services/Data');

module.exports.bootstrap = async function () {


	if (! await Data.existsTable("cart"))
		await Data.execute('CREATE TABLE "cart" ( "CODCLI" TEXT, "items" TEXT, PRIMARY KEY ("CODCLI"), CONSTRAINT "ipx_cart" UNIQUE ("CODCLI" ASC) );');
	if (! await Data.existsTable("images"))
		await Data.execute('CREATE TABLE "images" ( "CODART" TEXT, "MD5" TEXT, "extension" TEXT, PRIMARY KEY ("CODART"), CONSTRAINT "ipx_images" UNIQUE ("CODART" ASC) );');
	if (! await Data.existsTable("session"))
		await Data.execute('CREATE TABLE "session" ( "token" TEXT, "data" TEXT, "expire" INTEGER, PRIMARY KEY ("token"), CONSTRAINT "ipx_session" UNIQUE ("token" ASC) );');
	if (! await Data.existsTable("settings"))
		await Data.execute('CREATE TABLE "settings" ( "KEY" TEXT, "VALUE" TEXT, PRIMARY KEY ("KEY"), CONSTRAINT "ipx_settings" UNIQUE ("KEY" ASC) );');

	// if (sails.config.models.migrate == 'drop') {
	// 	sails.config.models.migrate = "safe";
	// 	let data = "module.exports.models = " + JSON.stringify(sails.config.models, null,4);
	// 	fs.writeFileSync(process.cwd() + "/config/models.js", data);
	// }

	// Comprueba que existan los directorios de imagenes y , de ser necesario, los crea.
	if (!fs.existsSync(process.cwd() + "/photos"))
		fs.mkdirSync(process.cwd() + "/photos");

	if (!fs.existsSync(process.cwd() + "/thumbs"))
		fs.mkdirSync(process.cwd() + "/thumbs");

	if (!fs.existsSync(process.cwd() + "/thumbs/1024"))
		fs.mkdirSync(process.cwd() + "/thumbs/1024");

	if (!fs.existsSync(process.cwd() + "/thumbs/150"))
		fs.mkdirSync(process.cwd() + "/thumbs/150")

	let imageController = require("../api/controllers/ImageController");
	// Elimina las imagenes que no existan en la base de datos.
	imageController.clear(process.cwd() + "/photos/");
	imageController.clear(process.cwd() + "/thumbs/1024/");
	imageController.clear(process.cwd() + "/thumbs/150/");

	// Elimina las imagenes de la base de datos que no existan en la carpeta de imagenes.
 	async function genThumbs() {
		let images = await Data.find("SELECT * FROM images;");
		if (images && images.length > 0) {

			for (let i = 0; i < images.length; i++) {
				let image = images[i];
				let md5 = image.MD5;
				let extension = image.extension || "jpg";
				if (!fs.existsSync(process.cwd() + "/photos/" + md5 + "." + extension)) {
					try {
						await Data.execute("DELETE from images WHERE MD5=? ;", [md5]);
						// await Image.destroy({ "MD5": md5 })
					} catch (error) {
						sails.log.error("Image.destroy");
						sails.log.error(error);
					}
				} else {
					try {
						await Promise.all([imageController._generateThumb(md5, extension, 150), imageController._generateThumb(md5, extension, 1024)]);
					} catch (error) {
						sails.log.error(error);
					}

				}
			};
		}
	};
	genThumbs();

	// Configuración
	let secret = await Data.findOne("SELECT * FROM settings WHERE KEY=?", ['secret']);
		if (!secret) {
			secret = sails.config.custom.secret;
			if (!secret) {
				require('crypto').randomBytes(48, async function (err, buffer) {
					secret = buffer.toString('hex');
					try {
						await Data.execute("INSERT INTO settings ('KEY', 'VALUE') VALUES (?,?)", ['secret', secret]);
					} catch (error) {
						sails.log.error("Settings.create");
						sails.log.error(error);
					}
				});
			} else {
				try {
					await Data.execute("INSERT INTO settings ('KEY', 'VALUE') VALUES (?,?)", ['secret', secret]);
				} catch (error) {
					sails.log.error("Settings.create");
					sails.log.error(error);
				}
			}
		}

		let token = undefined;
		try {
			token = await Data.findOne("SELECT * FROM settings WHERE KEY=?", ['token']);
		} catch (error) {
			sails.log.error("Settings.findOne");
			sails.log.error(error);
		}
		if (!token) {
			let num = moment().add(Math.random(30), "days").unix();
			token = sails.config.custom.token || jwt.sign({ rndnum: num }, secret);
			try {
				await Data.execute("INSERT INTO settings ('KEY', 'VALUE') VALUES (?,?)", ['token', token]);
			} catch (error) {
				sails.log.error("Settings.create");
				sails.log.error(error);
			}
		}

		let conf = undefined;
		try {
			conf = await Data.find("SELECT * FROM settings;");
			console.log('--------------------------------------------------------------------------------');
			await Promise.all(conf.map(item => { sails.config.custom[item.KEY] = item.VALUE; sails.log.debug("CONFIG - " + item.KEY + " - " + item.VALUE) }))
			console.log('--------------------------------------------------------------------------------');
		} catch (error) {
			sails.log.error("Settings.find");
			sails.log.error(error);
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
