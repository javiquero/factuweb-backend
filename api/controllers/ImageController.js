
const fs = require('fs')
const thumb = require('node-thumbnail').thumb;

module.exports = {
	_config: {
		actions: false,
		shortcuts: false,
		rest: false
	},
	exists: async function (req, res) {
		let codart = req.param("codart", undefined);
		let md5 = req.param("md5", undefined);
		if (!md5) return res.badRequest();
		if (fs.existsSync(process.cwd() + "/photos/" + md5)) {
			let extension = md5.split('.').pop();
			let MD5 = md5.split('.')[0];
			let images = await Image.find({ "CODART": codart  });
			if (images.length > 1) {
				await Image.destroy({ "CODART": codart });
				await Image.create({ "CODART": codart, "MD5": MD5, "extension": extension })
				return res.ok();
			}else if (images.length<1){
				await Image.create({ "CODART": codart, "MD5": MD5, "extension": extension })
				return res.ok();
			} else {
				return res.ok();
			}
		} else {
			return res.json({});
		}
	},
	upload: function (req, res) {
		let codart = req.param("codart", undefined);
		if (!codart) return res.badRequest();
		let photosPath = './../../photos';

		let fileName = req.file('file')._files[0].stream.filename;
		let extension = fileName.split('.').pop();
		let md5 = req.headers.md5;

		try {
			if (fs.existsSync(process.cwd()+"/photos/" + md5 + "." + extension)) {
				//  sails.log.debug("File exists!");
				Image.find({ "CODART": codart }).then(async result => {
					if (result && result.length > 1) {
						await Image.destroy({ "CODART": codart });
						await Image.create({ "CODART": codart, "MD5": md5, "extension": extension });
					}
					if (!result || result.length < 1) {
						await Image.create({"CODART": codart, "MD5": md5, "extension": extension})
					}
				})
				return res.ok();
			} else {
				// sails.log.debug("NOT File exists! " + photosPath + "/" + md5 + "." + extension);
				req.file('file').upload({
					dirname: photosPath,
					saveAs: md5 + "." + extension
				}, async function (err, uploadedFiles) {
					if (err) return res.serverError(err);
					await Image.destroy({ "CODART": codart });
					await Image.create({"CODART": codart, "MD5": md5, "extension": extension})
					return res.json({
						message: uploadedFiles.length + ' file(s) uploaded successfully!'
					});
				});

			}
		  } catch(err) {
			sails.log.error(err)
			return res.serverError(err);
		  }

	},
	getImage:async function (req, res) {
		let codart = req.param("codart", undefined);
		if (!codart) return res.badRequest();

		let images = await Image.find({ "CODART": codart })
		if (images && images.length > 0) {
			let md5 = images[0].MD5;
			let extension = images[0].extension || "jpg";
			if (fs.existsSync(process.cwd()+"/photos/" + md5 + "." + extension)) {
				return res.sendFile(process.cwd()+"/photos/" + md5 + "." + extension);
			} else {
				return res.sendFile(process.cwd()+"/assets/images/image-not-found.png");
				return res.notFound();
			}
		} else {
			return res.sendFile(process.cwd()+"/assets/images/image-not-found.png");
			return res.notFound();
		}
	},
	getThumb150: async function (req, res){
		let codart = req.param("codart", undefined);
		if (!codart) return res.badRequest();


		let images = await Image.find({ "CODART": codart })
		if (images && images.length > 0) {
			let md5 = images[0].MD5;
			let extension = images[0].extension || "jpg";
			if (fs.existsSync(process.cwd()+"/thumbs/150/" + md5 + "." + extension)) {
				return res.sendFile(process.cwd()+"/thumbs/150/" + md5 + "." + extension);
			}else{
				if (fs.existsSync(process.cwd()+"/photos/" + md5 + "." + extension)) {
					thumb({
						source: process.cwd()+"/photos/" + md5 + "." + extension,
						destination: process.cwd()+"/thumbs/150/",
						// basename: md5 + "." + extension,
						suffix: '',
						width:150
					}).then(function() {
						return res.sendFile(process.cwd()+"/thumbs/150/" + md5 + "." + extension);
					}).catch(function(e) {
						console.log('Error', e.toString());
					});
				}else{
					sails.log.error("No existe la imagen original, no se puede crear la miniatura.")
					return res.sendFile(process.cwd()+"/assets/images/image-not-found.png");
					return res.notFound();
				}
			}
		} else {
			sails.log.error("No se ha encontrado el código en la base de datos o bien no contiene imagen.")
			return res.sendFile(process.cwd()+"/assets/images/image-not-found.png");
			res.notFound();
		}
	},
	getThumb1024: async function (req, res){
		let codart = req.param("codart", undefined);
		if (!codart) return res.badRequest();


		let images = await Image.find({ "CODART": codart })
		if (images && images.length > 0) {
			let md5 = images[0].MD5;
			let extension = images[0].extension || "jpg";
			if (fs.existsSync(process.cwd() + "/thumbs/1024/" + md5 + "." + extension)) {
				return res.sendFile(process.cwd() + "/thumbs/1024/" + md5 + "." + extension);
			}else{
				if (fs.existsSync(process.cwd() + "/photos/" + md5 + "." + extension)) {
					thumb({
						source: process.cwd() + "/photos/" + md5 + "." + extension,
						destination: process.cwd() + "/thumbs/1024/",
						// basename: md5 + "." + extension,
						suffix: '',
						width:1024
					}).then(function() {
						return res.sendFile(process.cwd() + "/thumbs/1024/" + md5 + "." + extension);
					}).catch(function(e) {
						console.log('Error', e.toString());
					});
				}else{
					sails.log.error("No existe la imagen original, no se puede crear la miniatura.")
					return res.sendFile(process.cwd()+"/assets/images/image-not-found.png");
					return res.notFound();
				}
			}
		} else {
			sails.log.error("No se ha encontrado el código en la base de datos o bien no contiene imagen.")
			return res.sendFile(process.cwd()+"/assets/images/image-not-found.png");
			res.notFound();
		}
	},

	getDownloadPhoto: function (req, res) {

	},
	getDownloadSection: function (req, res) {

	}

}
