/**
    * ModelsController
    *
    * @description :: Server-side actions for handling incoming requests.
    * @help        :: See https://sailsjs.com/docs/concepts/actions
    */

const fs = require('fs');
const AdmZip = require('adm-zip');
// const Database = require('sqlite-async');
const Db = require('../services/Db');

let modelsController = {
	_config: {
		actions: false,
		shortcuts: false,
		rest: false
	},

	getModelsForImport(req, res) {
		return res.json(sails.config.custom.tables);
	},

	uploadSQLITE: async function (req, res) {
		let fileName = req.file('file')._files[0].stream.filename;
		// let extension = fileName.split('.').pop();
		try {
			if (fs.existsSync(process.cwd() + "/db.zip"))
				await fs.unlinkSync(process.cwd() + "/db.zip");
			req.file('file').upload({
				maxBytes: 0,
				dirname: process.cwd(),
				saveAs: fileName
			}, async function (err, uploadedFiles) {
				if (err) return res.serverError(err);
				let zip = new AdmZip(process.cwd() +"/"+ fileName);
				zip.extractAllToAsync(/*target path*/process.cwd() + "/", /*overwrite*/true, (err) => {
					if (err) return res.serverError(err);;
					return res.ok();
				});
			});
		} catch(err) {
			sails.log.error(err)
			return res.serverError(err);
		}
	},

	async photosJson(req, res) {
		let data = req.allParams();
		if (!data || !data.data) return res.serverError();
		sails.log("data.data");
		res.json("{resp: 'ok'}");
	},

	async insertOrReplace(req, res) {
		let data = req.allParams();
		if (!data || !data.model) return res.serverError();
		try {
			await Db.execute(`REPLACE INTO ${data.model} (${Object.keys(data.data).join(", ")}) VALUES (${"?,".repeat(Object.values(data.data).length).slice(0, -1)});`, Object.values(data.data) );
			return res.ok();
		} catch (error) {
			sails.log.error(error);
			return res.serverError(error);
		}
	},

	async create(req, res) {
		let data = req.allParams();

		if (!data || !data.query) return res.serverError();
		try {
			await Db.execute(`${data.query}`);
			return res.ok();
		} catch (error) {
			sails.log.error(error);
			return res.serverError(error);
		}
	},

	async delete(req, res) {
		let data = req.allParams();
		if (!data || !data.model) return res.serverError();
		try {
			await Db.execute(`DELETE FROM ${data.model} WHERE ${data.data};`);
			return res.ok();
		} catch (error) {
			sails.log.error(error);
			return res.serverError(error);
		}
	}
};
module.exports = modelsController;
