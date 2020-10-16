const fs = require('fs');
const Database = require('sqlite-async')

module.exports = {
	connect(mode=Database.OPEN_READONLY) {
		return new Promise((resolve, reject) => {
			fs.access(process.cwd() + "/data.sqlite", fs.constants.F_OK || fs.constants.R_OK, async (err) => {
				if (err) {
					sails.log.error(err);
					return resolve(await this.create())
				} else {
					Database.open(process.cwd() + "/data.sqlite", mode).then(db => {
						return resolve(db);
					})
				 }
			})
		});
	},
	create() {
		return new Promise((resolve, reject) => {
			Database.open(process.cwd() + "/data.sqlite").then(db => {
				return resolve(db);
			}).catch(err => {
				sails.log.error(err);
			})
		});
	},
	existsTable(tableName) {
		return new Promise(async(resolve, reject) =>{
			let r = await this.findOne("SELECT name FROM sqlite_master WHERE type='table' AND name=?;", [tableName]);
			if (r == undefined) return resolve(false);
			return resolve(true);
		});
	},
	find(query, params) {
		return new Promise(async (resolve, reject) => {
			if (!query || query == "") return reject(new Error("The query parameter is required"))
			let db = undefined;
			try {
				db = await this.connect(Database.OPEN_READONLY);
				let rows = await db.all(query, params);
				db.close();
				return resolve(rows);
			} catch (error) {
				db.close();
				sails.log.error(query, params, error);
				return reject(error)
			}
		});
	}, findOne(query, params) {
		return new Promise(async (resolve, reject) => {
			if (!query || query == "") return reject(new Error("The query parameter is required"))
			try {
				let rows = await this.find(query, params);
				if (rows.length > 0) return resolve(rows[0]);
				return resolve(undefined);
			} catch (error) {
				sails.log.error(error);
				return reject(error)
			}
		});
	},
	execute(query, params) {
		return new Promise(async (resolve, reject) =>{
			let db = undefined;
			try {
				db = await this.connect(Database.OPEN_READWRITE);
				await db.run(query, params);
				db.close();
				return resolve();
			} catch (error) {
				db.close();
				sails.log.error(query,params, error);
				return reject(error)
			}
		});
	},

}

