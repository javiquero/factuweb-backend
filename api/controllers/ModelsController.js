/**
    * ModelsController
    *
    * @description :: Server-side actions for handling incoming requests.
    * @help        :: See https://sailsjs.com/docs/concepts/actions
    */

const fs = require('fs');
const AdmZip = require('adm-zip');
const Database = require('sqlite-async')

let modelsController = {
	_config: {
		actions: false,
		shortcuts: false,
		rest: false
	},
	destroyModel (req, res) {
		let model = req.param("model", undefined);
		sails.models[model.toLowerCase()].destroy({}).then(() => {
			res.ok();
		}).catch((e) => {
			sails.log.error(e);
			res.badRequest();
		});
	},
	async destroyAll (req,res)  {
		for (const model of sails.config.custom.tables) {
			await sails.models[model.toLowerCase()].destroy({});
		}
		res.ok();
	},
	getModelsForImport(req, res) {
		return res.json(sails.config.custom.tables);
	},
	uploadJSON: async function (req, res) {
		let fileName = req.file('file')._files[0].stream.filename;
		let dataPath = './../../';
		// let extension = fileName.split('.').pop();
		try {
			if (fs.existsSync(process.cwd()+"/data.json")) {
				//  sails.log.debug("File exists!");
				await fs.unlinkSync(process.cwd()+"/data.json")
			}
			// sails.log.debug("NOT File exists! " + photosPath + "/" + md5 + "." + extension);
			req.file('file').upload({
				dirname: dataPath,
				saveAs: fileName
			}, async function (err, uploadedFiles) {
				if (err) return res.serverError(err);
				modelsController.updateFromJSON();
				return res.ok();
			});
		  } catch(err) {
			sails.log.error(err)
			return res.serverError(err);
		  }

	},
	uploadSQLITE: async function (req, res) {
		let fileName = req.file('file')._files[0].stream.filename;
		// let extension = fileName.split('.').pop();
		try {
			if (fs.existsSync(process.cwd()+"/db.zip"))
				await fs.unlinkSync(process.cwd()+"/db.zip")

			req.file('file').upload({
				maxBytes: 0,
				dirname: process.cwd(),
				saveAs: fileName
			}, async function (err, uploadedFiles) {
				if (err) return res.serverError(err);
				// if (fs.existsSync(process.cwd()+"/db.sqlite3"))
				// 	await fs.unlinkSync(process.cwd()+"/db.sqlite3")
				let zip = new AdmZip(process.cwd() +"/"+ fileName);
				zip.extractAllToAsync(/*target path*/process.cwd() + "/", /*overwrite*/true, (err) => {
					if (err) return res.serverError(err);

					modelsController.updateFromSQLITE(true);
					return res.ok();
				});
			});
		} catch(err) {
			sails.log.error(err)
			return res.serverError(err);
		}
	},
	updateFromSQLITE(total) {
		return new Promise((resolve, reject) => {
			resolve();
			fs.access('./db.sqlite', fs.constants.F_OK || fs.constants.R_OK, (err) => {
				if (err) {
					sails.log.error(`db.sqlite ${err.code === 'ENOENT' ? 'does not exist' : 'is not readable'} `);
					return reject(err);
				} else {

					Database.open(process.cwd()+"/db.sqlite")
					.then(async db => {
						sails.log.debug('Connected to the SQlite database.');

						try {

							let tables = await db.all(`SELECT name FROM main.sqlite_master WHERE type='table' ORDER BY name ASC;`);

							for (let ind = 0; ind < tables.length - 1; ind++) {
								let table = tables[ind];
								let modelName = table.name.split("_").join("").toLowerCase();

								sails.log.debug("Init update " + table.name);

								if (Object.keys(sails.models).includes(modelName)) {
									let info = sails.config.custom.tables.find(e => { return e.name == table.name });

									if (total) {
										try {
											await sails.models[modelName].destroy({});
										} catch (error) {
											sails.log.error(error);
											total = false;
										}
									}

									let count = await db.all(`SELECT COUNT(*) AS C FROM main.${table.name};`);
									count = count ? count[0]['C'] : 0;

									let from = 0;
									let qty = 1000;
									let rows = await db.all(`SELECT * FROM main.${table.name} LIMIT ${from},${qty};`);
									do {

										if (total) {
											await sails.models[modelName].createEach(rows);
										} else {
											for (let inde = 0; inde < rows.length - 1; inde++) {
												let row = rows[inde];
												let percent = ((inde + 1) / count) * 100;
												process.stdout.write(`Update element ${table.name} ${percent.toFixed(2)}% \r`);
												// await db.each(`SELECT * FROM main.${table.name} ;`, async (err, row) => {
												// count++;
												// if (err) return reject(err);
												try {

													if (total) {
														await sails.models[modelName].create(row);
													} else {
														let condition = info.index.reduce((a, b) => (a[b] = row[b], a), {});
														if (row["YEAR"] != undefined) condition.YEAR = row["YEAR"];

														let item = await sails.models[modelName].findOne(condition);
														if (!item) {
															await sails.models[modelName].create(row);
														} else {
															let t = item;
															Object.keys(sails.config.models.attributes).forEach(o => {
																delete t[o];
															})
															if (t != row) {
																await sails.models[modelName].update(condition, row);
															}
														}
													}
													// await sails.models[modelName].findOrCreate(condition, row).exec(function (err, newOrExistingRecord, wasCreated) {
													// 	if (err) {
													// 		sails.log.debug(condition);
													// 		sails.log.debug(row);
													// 		sails.log.error(err);
													// 	}else{
													// 	if (wasCreated) {
													// 		sails.log.debug(newOrExistingRecord);
													// 	}
													// 	}
													// });
													// process.stdout.write(`Update element ${table.name} ${count} \r`);
													//await sails.models[modelName.toLowerCase()].create(row);
												} catch (error) {
													sails.log.error("Error on insert element in " + modelName, error);
													return reject(error);
												}
											}
										}

										from += qty;
										rows = await db.all(`SELECT * FROM main.${table.name} LIMIT ${from},${qty};`);
									} while (rows.length == 1000)


									// });
									sails.log.debug(table.name + " " + " elements has been updated.");
								}
							}

							// await db.each(`SELECT name FROM main.sqlite_master WHERE type='table' ORDER BY name ASC;`, async (err, table) => {
							// 	if (err) return reject(err);
							// 	let modelName = table.name.split("_").join("").toLowerCase();
							// 	let t = Object.keys(sails.models);
							// 	if (t.includes(modelName)) {
							// 		// try {
							// 		// 	// await sails.models[modelName.toLowerCase()].destroy({});
							// 		// } catch (error) {
							// 		// 	sails.log.error("Error on destroy all element of " + modelName);
							// 		// 	return reject(error);
							// 		// }
							// 		try {
							// 			let count = 0;
							// 			let i = sails.config.custom.tables.find(e => { return e.name == table.name });


							// 			 await db.each(`SELECT * FROM main.${table.name} ;`, async (err, row) => {
							// 				count++;
							// 				if (err) return reject(err);
							// 				try {
							// 					let condition = i.index.reduce((a, b) => (a[b] = row[b], a), {});
							// 					if (row["YEAR"] != undefined) condition.YEAR = row["YEAR"];
							// 					await sails.models[modelName].findOrCreate(condition, row).exec(function(err, newOrExistingRecord, wasCreated) {
							// 						if (wasCreated) sails.log.info(`Inserted new element in ${table.name}`);
							// 					});
							// 					// process.stdout.write(`Update element ${table.name} ${count} \r`);
							// 					//await sails.models[modelName.toLowerCase()].create(row);
							// 				} catch (error) {
							// 					sails.log.error("Error on insert element in " + modelName, error);
							// 					return reject(error);
							// 				}
							// 			});
							// 			// console.log("");
							// 			sails.log.info(table.name + " " + " elements has been updated.");
							// 		} catch (error) {
							// 			sails.log.error("Error on get all SQLITE elements of " + modelName);
							// 			return reject(error);
							// 		}
							// 	}
							// });
							sails.log.info("All tables updated.");
						} catch (error) {
							sails.log.error("Error on UPDATE FROM SQLITE PROCESS");
							sails.log.error(error);
							return reject(error);
						}

					})
					.catch(err => {
						return reject(err);
					})


					// let db = new sqlite3.Database(process.cwd()+"/db.sqlite", sqlite3.OPEN_READONLY,  (err) => {
					// 	if (err)  return reject(err);
					// 	console.log('Connected to the SQlite database.');
					// });
					// sails.log.info(sails.models);
					// db.serialize(() => {
					// 	db.each(`SELECT name FROM main.sqlite_master WHERE type='table' ORDER BY name ASC;`, async (err, table) => {
					// 		if (err) return reject(err);
					// 		let modelName = table.name.split("_").join("");
					// 		await sails.models[modelName.toLowerCase()].destroy({});
					// 		// db.each(`SELECT * FROM main.${table.name} ;`, async (err, row) => {
					// 		// 	if (err) return reject(err);
					// 		// 	// await sails.models[modelName.toLowerCase()].create(row).fetch();
					// 		// }, (err, count) => {
					// 		// 	if (err) return reject(err);
					// 		// 	sails.log.info( table.name + " " + count +  " updated." )
					// 		// });


					// 		db.all(`SELECT * FROM main.${table.name} ;`, [], (err, rows) => {
					// 			if (err) {
					// 				return reject(err);
					// 			}
					// 			rows.forEach((row) => {
					// 			  console.log(row.name);
					// 			});
					// 		  });

					// 		db.each(`SELECT * FROM main.${table.name} ;`, async (err, row) => {
					// 			if (err) return reject(err);
					// 			// await sails.models[modelName.toLowerCase()].create(row).fetch();
					// 		}, (err, count) => {
					// 			if (err) return reject(err);
					// 			sails.log.info( table.name + " " + count +  " updated." )
					// 		});



					// 	}, (err, count) => {
					// 		if (err) return reject(err);
					// 		sails.log.info(count + " tables updated.");
					// 		return resolve();
					// 	});
					// });
				}
			});
		});

	},
	updateFromJSON() {
		fs.access('./data.json', fs.constants.F_OK || fs.constants.R_OK, (err) => {
			if (err) {
				sails.log.error(`data.json ${err.code === 'ENOENT' ? 'does not exist': 'is not readable'} `);
			} else {

				fs.readFile('./data.json', 'utf8', async (err, contents) => {
					sails.log.info("finish read file")
					if (err) return sails.log.error(err);
					sails.log.info("init parse file")
					let dta = JSON.parse(contents.replace(/F_/g, "F"));
					sails.log.info("finish parse file")
					for (const model of sails.config.custom.tables) {
						let modelName = model.name.split("_").join("");
						sails.log.info("Checking " + modelName)
						let c = await sails.models[modelName.toLowerCase()].count({});
						if (dta[modelName] && dta[modelName].length > c) {
							sails.log.info("Updating " + modelName)
							await sails.models[modelName.toLowerCase()].destroy({});
							await sails.models[modelName.toLowerCase()].createEach(dta[modelName]);
							sails.log.info(" - Updated " + modelName)
						}
					}
					sails.log.info("All data has been updated correctly.")
				})
			}
		});
	}
};

module.exports = modelsController;
