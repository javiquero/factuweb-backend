
const fs = require('fs')
const thumb = require('node-thumbnail').thumb;
const AdmZip = require('adm-zip');

module.exports = {
	_config: {
		actions: false,
		shortcuts: false,
		rest: false
	},
	clear: async function (path) {

		let files = fs.readdirSync(path);
		let imgs = await Image.find();

		for (i = 0; i < files.length; i++) {
			let file = files[i];
			let MD5 = file.split('.')[0];
			let extension = file.split('.')[1];

			const found = imgs.find(element => element.MD5 == MD5);
			if (found == undefined) {
				fs.unlink(path + file, (err) => {
					if (err) {
					  console.error(err)
					  return
					}
					sails.log.debug("Image " + file + " has been removed.");
					//file removed
				  })
			}
			// await Promise.all(files.map( f => f.MD5==MD5 ));
			// Image.find({ "MD5": MD5 }).then(images => {
			// 	if (images.length < 1) {
			// 		fs.unlink(path + file, (err) => {
			// 			if (err) {
			// 			  console.error(err)
			// 			  return
			// 			}
			// 			sails.log.debug("Image " + file + " has been removed.");
			// 			//file removed
			// 		  })

			// 		// try {
			// 		// 	fs.unlinkSync(path + file);
			// 		// 	sails.log.debug("Image " + file + " has been removed.");
			// 		// } catch (err) {
			// 		// 	console.error(err)
			// 		// }
			// 	}
			// })
			// do things with file
		}
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
			await Image.destroy({ "CODART": codart });
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

	getDownloadPhoto: async function (req, res) {
		let codart = req.param("codart", undefined);
		let images = await Image.find({ "CODART": codart  });
		if (images.length > 0) {
			let image = images[0];
			if (fs.existsSync(process.cwd() + "/photos/" + image.MD5 + "." + image.extension)) {
				return res.download(process.cwd() + "/photos/" + image.MD5 + "." + image.extension, codart + "." + image.extension);
			}
		} else {
			// sails.log.error(images);
			return res.notFound();
		}
	},
	getDownloadSection: async function (req, res) {
		let codfam = req.param("codfam", undefined);
		let zip = new AdmZip();
		let section = "Section_images"
		let FAM = await FFAM.find({ "CODFAM": codfam });
		if (FAM.length > 0) {
			section = FAM[0].DESFAM.split(' ').join('_');//.substring(0, 7);
			section.charAt(0).toUpperCase() + section.toLocaleLowerCase().slice(1);
		} else {
			return res.notFound();
		}
		let Items = await FART.find({ "FAMART": codfam });
		if (Items.length > 0) {
			await Promise.all(Items.map(async item => {
				let images = await Image.find({ "CODART": item.CODART });
				if (images.length > 0) {
					let img = images[0];
					if (fs.existsSync(process.cwd() + "/photos/" + img.MD5 + "." + img.extension)) {
						zip.addLocalFile(process.cwd() + "/photos/" + img.MD5 + "." + img.extension, undefined,  item.CODART + "." + img.extension );
					}
				}
			}));
			res.setHeader('Content-disposition', 'attachment; filename=' + section + ".zip");
			return res.send(zip.toBuffer());
		} else {
			return res.notFound();
		}
	},

	getDownloadOrder: async function (req, res) {
		let tippcl = req.param("tippcl", undefined);
		let codpcl = req.param("codpcl", undefined);
		let year = req.param("year", undefined);
		let zip = new AdmZip();
		let filename = "Order_" + year + "_" + tippcl + "_" + codpcl + "_images"

		let Items = await FLPC.find({ "YEAR": year, "TIPLPC": tiplpc, "CODLPC": codpcl });
		if (Items.length > 0) {
			await Promise.all(Items.map(async item => {
				let images = await Image.find({ "CODART": item.ARTLPC });
				if (images.length > 0) {
					let img = images[0];
					if (fs.existsSync(process.cwd() + "/photos/" + img.MD5 + "." + img.extension)) {
						zip.addLocalFile(process.cwd() + "/photos/" + img.MD5 + "." + img.extension, undefined,  item.ARTLPC + "." + img.extension );
					}
				}
			}));
			res.setHeader('Content-disposition', 'attachment; filename=' + filename + ".zip");
			return res.send(zip.toBuffer());
		} else {
			return res.notFound();
		}
	}

}
