
const fs = require('fs')
const thumb = require('node-thumbnail').thumb;
const AdmZip = require('adm-zip');
const Data = require('../services/Data');

imageController = {
	clear: async function (path) {

		let files = fs.readdirSync(path);
		let imgs = await Data.find("SELECT * FROM images;")// Image.find();

		for (i = 0; i < files.length; i++) {
			let file = files[i];
			let MD5 = file.split('.')[0];
			// let extension = file.split('.')[1];

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
		}
	},
	exists: async function (req, res) {
		let codart = req.param("codart", undefined);
		let md5 = req.param("md5", undefined);
		if (!md5) return res.badRequest();
		if (fs.existsSync(process.cwd() + "/photos/" + md5)) {
			let extension = md5.split('.').pop();
			let MD5 = md5.split('.')[0];
			let images = await Data.find("SELECT * FROM images WHERE CODART=?", [codart]);// Image.find({ "CODART": codart  });
			if (images.length == 1) {
				if (images[0].MD5 != MD5)
					await Data.execute("UPDATE images SET MD5=? WHERE CODART=?;", [MD5, codart]);
				return res.ok();
			}else if (images.length > 1) {
				await Data.execute("DELETE from images WHERE CODART=?;", [codart]);
				await Data.execute("INSERT INTO images (CODART, MD5, extension) VALUES (?,?,?);", [codart, MD5, extension]);
				return res.ok();
			} else if (images.length < 1) {
				await Data.execute("INSERT INTO images (CODART, MD5, extension) VALUES (?,?,?);", [codart, MD5, extension]);
				return res.ok();
			}
		} else {
			await Data.execute("DELETE from images WHERE CODART=?;", [codart]);
			return res.json({});
		}
	},
	upload: async function (req, res) {
		let codart = req.param("codart", undefined);
		if (!codart) return res.badRequest();
		let photosPath = './../../photos';

		let fileName = req.file('file')._files[0].stream.filename;
		let extension = fileName.split('.').pop();
		let md5 = req.headers.md5;

		try {
			if (fs.existsSync(process.cwd()+"/photos/" + md5 + "." + extension)) {
				let result = await Data.find("SELECT * FROM images WHERE CODART=?", [codart]);
				if (result && result.length > 1) {
					await Data.execute("DELETE from images WHERE CODART=?;", [codart]);
					await Data.execute("INSERT INTO images (CODART, MD5, extension) VALUES (?,?,?);", [codart, md5, extension]);
				}
				if (!result || result.length < 1)
					await Data.execute("INSERT INTO images (CODART, MD5, extension) VALUES (?,?,?);", [codart, md5, extension]);

				if (result.length == 1)
					if (result[0].MD5 != md5)
						await Data.execute("UPDATE images SET MD5=? WHERE CODART=?;", [md5, codart]);

				return res.ok();
			} else {
				req.file('file').upload({
					dirname: photosPath,
					saveAs: md5 + "." + extension
				}, async function (err, uploadedFiles) {
					if (err) return res.serverError(err);
					await Promise.all([imageController._generateThumb(md5, extension, 150), imageController._generateThumb(md5, extension, 1024)]);
					await Data.execute("DELETE from images WHERE CODART=?;", [codart]);
					await Data.execute("INSERT INTO images (CODART, MD5, extension) VALUES (?,?,?);", [codart, md5, extension])
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

		// let images = await Image.find({ "CODART": codart })
		let images = await Data.find("SELECT * FROM images WHERE CODART=?", [codart]);
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
	_generateThumb(md5, extension, size) {
		return new Promise( (resolve, reject) => {
			if (fs.existsSync(process.cwd() + "/photos/" + md5 + "." + extension)) {
				if (fs.existsSync(process.cwd() + "/thumbs/" + size + "/" + md5 + "." + extension)) {
					return resolve(process.cwd() + "/thumbs/" + size + "/" + md5 + "." + extension);
				} else {
					thumb({
						source: process.cwd() + "/photos/" + md5 + "." + extension,
						destination: process.cwd() + "/thumbs/" + size + "/",
						suffix: '',
						quiet:true,
						width: size
					}).then(function () {
						return resolve(process.cwd() + "/thumbs/" + size + "/" + md5 + "." + extension);
					}).catch(function (e) {
						console.log('Error', e.toString());
						return reject(e);
					});
				}
			}
		})
	},
	getThumb150: async function (req, res){
		let codart = req.param("codart", undefined);
		if (!codart) return res.badRequest();

		// let images = await Image.find({ "CODART": codart })
		let images = await Data.find("SELECT * FROM images WHERE CODART=?", [codart]);
		if (images && images.length > 0) {
			let md5 = images[0].MD5;
			let extension = images[0].extension || "jpg";
			try {
				return res.sendFile(await imageController._generateThumb(md5, extension, 150));
			} catch (error) {
				sails.log.error(error);
				return res.sendFile(process.cwd()+"/assets/images/image-not-found.png");
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

		// let images = await Image.find({ "CODART": codart })
		let images = await Data.find("SELECT * FROM images WHERE CODART=?", [codart]);
		if (images && images.length > 0) {
			let md5 = images[0].MD5;
			let extension = images[0].extension || "jpg";
			try {
				return res.sendFile(await imageController._generateThumb(md5, extension, 1024));
			} catch (error) {
				sails.log.error(error);
				return res.sendFile(process.cwd()+"/assets/images/image-not-found.png");
			}
		} else {
			// sails.log.error("No se ha encontrado el código en la base de datos o bien no contiene imagen.")
			return res.sendFile(process.cwd()+"/assets/images/image-not-found.png");
			res.notFound();
		}
	},
	getDownloadPhoto: async function (req, res) {
		let codart = req.param("codart", undefined);
		// let images = await Image.find({ "CODART": codart  });
		let images = await Data.find("SELECT * FROM images WHERE CODART=?", [codart]);
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

		let sectionData = await sails.controllers.catalog._getSection(codfam);
		if (sectionData) {
			section = sectionData.DESFAM.split(' ').join('_');//.substring(0, 7);
			section.charAt(0).toUpperCase() + section.toLocaleLowerCase().slice(1);
		} else {
			return res.notFound();
		}

		let Items = await sails.controllers.catalog._getItemsInFamily(codfam);
		if (Items.length > 0) {
			await Promise.all(Items.map(async item => {
				let images = await Data.find("SELECT * FROM images WHERE CODART=?", [item.IMGART]);
				// let images = await Image.find({ "CODART": item.CODART });
				if (images.length > 0) {
					let img = images[0];
					if (fs.existsSync(process.cwd() + "/photos/" + img.MD5 + "." + img.extension)) {
						let name = item.CE1ART == "" ? item.CODART :  item.CODART + "_" + item.CE1ART;
						zip.addLocalFile(process.cwd() + "/photos/" + img.MD5 + "." + img.extension, undefined, name  + "." + img.extension );
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
		if (year == undefined|| tippcl==undefined || codpcl==undefined) return res.notFound();
		let Items = await Db.find("SELECT DISTINCT ARTLPC FROM F_LPC WHERE CODLPC=? AND TIPLPC=? AND YEAR=? ORDER BY POSLPC ASC;", [codpcl, tippcl, year]);
		if (Items.length > 0) {
			await Promise.all(Items.map(async item => {
				// let images = await Image.find({ "CODART": item.ARTLPC });
				let images = await Data.find("SELECT * FROM images WHERE CODART=?", [item.ARTLPC]);
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
	},
	getDownloadInvoice: async function (req, res) {
		let tipfac = req.param("tipfac", undefined);
		let codfac = req.param("codfac", undefined);
		let year = req.param("year", undefined);
		let zip = new AdmZip();
		let filename = "Invoice_" + year + "_" + tipfac + "_" + codfac + "_images"
		if (year == undefined || tipfac == undefined || codfac == undefined) return res.notFound();

		let Items = await Db.find("SELECT DISTINCT ARTLFA FROM F_LFA WHERE CODLFA=? AND TIPLFA=? AND YEAR=? ORDER BY POSLFA ASC;", [codfac, tipfac, year]);
		if (Items.length > 0) {
			await Promise.all(Items.map(async item => {
				// let images = await Image.find({ "CODART": item.ARTLFA });
				let images = await Data.find("SELECT * FROM images WHERE CODART=?", [item.ARTLFA]);
				if (images.length > 0) {
					let img = images[0];
					if (fs.existsSync(process.cwd() + "/photos/" + img.MD5 + "." + img.extension)) {
						zip.addLocalFile(process.cwd() + "/photos/" + img.MD5 + "." + img.extension, undefined,  item.ARTLFA + "." + img.extension );
					}
				}
			}));
			res.setHeader('Content-disposition', 'attachment; filename=' + filename + ".zip");
			return res.send(zip.toBuffer());
		} else {
			return res.notFound();
		}
	},
	getDownloadCart: async function (req, res) {
		if (!req.session.cookie && req.session.cookie.client == undefined) return res.forbidden();
		let _cart = await sails.controllers.cart._getCart(req.session.cookie.client);
		let zip = new AdmZip();
		let filename = "Exclusivas2R_items"

		let Items = _cart.items;
		if (Items.length > 0) {
			await Promise.all(Items.map(async item => {
				// let images = await Image.find({ "CODART": item.CODART });
				let images = await Data.find("SELECT * FROM images WHERE CODART=?", [item.IMGART]);

				if (images.length > 0) {
					let img = images[0];
					if (fs.existsSync(process.cwd() + "/photos/" + img.MD5 + "." + img.extension)) {
						let name = item.CE1ART == "" ? item.CODART :  item.CODART + "_" + item.CE1ART;
						zip.addLocalFile(process.cwd() + "/photos/" + img.MD5 + "." + img.extension, undefined,  name + "." + img.extension );
					}
				}
			}));
			res.setHeader('Content-disposition', 'attachment; filename=' + filename + ".zip");
			return res.send(zip.toBuffer());
		} else {
			return res.notFound();
		}
	},
	getDownloadPurchasedItems: async function (req, res) {
		if (!req.session.cookie && req.session.cookie.client == undefined) return res.forbidden();
		let zip = new AdmZip();
		let filename = "Exclusivas2R_items"

		let Items = await Db.find("Select DISTINCT CODART, DESART, DIMART, OBSART, IMGART, PESART, EANART, UELART, UPPART,DEWART, DLAART, FAMART, SUWART  FROM F_ART INNER JOIN (SELECT ARTLFA, DESLFA FROM F_FAC INNER JOIN F_LFA ON F_FAC.YEAR=F_LFA.YEAR AND F_FAC.TIPFAC=F_LFA.TIPLFA AND F_FAC.CODFAC=F_LFA.CODLFA WHERE CLIFAC=? GROUP BY ARTLFA) on ARTLFA = CODART AND DESLFA=DESART WHERE  SUWART=1 AND FAMART<>'';", [req.session.cookie.client]);
		if (Items.length > 0) {
			await Promise.all(Items.map(async item => {
				let images = await Data.find("SELECT * FROM images WHERE CODART=?", [item.CODART]);
				// let images = await Image.find({ "CODART": item.CODART });
				if (images.length > 0) {
					let img = images[0];
					if (fs.existsSync(process.cwd() + "/photos/" + img.MD5 + "." + img.extension)) {
						zip.addLocalFile(process.cwd() + "/photos/" + img.MD5 + "." + img.extension, undefined,  item.CODART + "." + img.extension );
					}
				}
			}));
			res.setHeader('Content-disposition', 'attachment; filename=' + filename + ".zip");
			return res.send(zip.toBuffer());
		} else {
			return res.notFound();
		}
	},
	getDownloadSearchItems: async function (req, res) {
		let text = req.param("q", undefined);
		let LIMIT = 1000;

		let zip = new AdmZip();
		let filename = "Exclusivas2R_items"

		let t = `%${text}%`;
		let query = "SELECT DISTINCT * FROM (SELECT CODART, DESART, DIMART, OBSART, CODART AS IMGART, PESART, EANART, UELART, UPPART,DEWART, DLAART, FAMART, SUWART, CAST(ORDART As INTEGER) AS ORD, IFNULL(CODCE1, '') as CODCE1, IFNULL(DESCE1, '') as CE1ART FROM F_ART LEFT JOIN F_ARC ON F_ART.CODART = F_ARC.ARTARC LEFT JOIN (SELECT * FROM F_CE1 WHERE CODCE1 NOT IN ( Select CE1IMG from F_IMG) )AS F_CE1 ON F_ARC.CE1ARC=F_CE1.CODCE1 WHERE CODART NOT IN ( Select ARTIMG from F_IMG) AND  (CODART LIKE ? OR DESART LIKE ? OR EANART LIKE ? OR DEWART LIKE ? ) UNION SELECT ARTIMG AS CODART, DESART, DIMART, OBSART, CODIMG AS IMGART, PESART, EANART, UELART, UPPART,DEWART, DLAART, FAMIMG AS FAMART, SUWIMG AS SUWART, ORDIMG AS ORD, CODCE1, DESCE1 as CE1ART FROM F_IMG INNER JOIN F_ART ON ARTIMG=CODART LEFT JOIN F_CE1 ON CE1IMG=CODCE1 WHERE (ARTIMG LIKE ? OR DESART LIKE ? OR EANART LIKE ? OR DEWART LIKE ? )  ) as a WHERE SUWART=1 AND FAMART<>'' ORDER BY FAMART, CAST(ORD As INTEGER) ASC LIMIT ?;";
		let Items = await Db.find(query, [t,t,t,t,t,t,t,t, LIMIT]);

		if (Items.length > 0) {
			await Promise.all(Items.map(async item => {
				// let images = await Image.find({ "CODART": item.CODART });
				let images = await Data.find("SELECT * FROM images WHERE CODART=?", [item.IMGART]);
				if (images.length > 0) {
					let img = images[0];
					if (fs.existsSync(process.cwd() + "/photos/" + img.MD5 + "." + img.extension)) {
						let name = item.CE1ART == "" ? item.CODART :  item.CODART + "_" + item.CE1ART;
						zip.addLocalFile(process.cwd() + "/photos/" + img.MD5 + "." + img.extension, undefined,  name + "." + img.extension );
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

if (!sails.controllers) sails.controllers = {};
sails.controllers.image = imageController;
module.exports = imageController
