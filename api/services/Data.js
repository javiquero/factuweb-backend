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
				let r = await db.run(query, params);
				let insertid = r.lastID;
				db.close();
				return resolve(insertid);
			} catch (error) {
				db.close();
				sails.log.error(query,params, error);
				return reject(error)
			}
		});
	},
	getSettings(KEY, DefaultValue) {
		return new Promise(async (resolve, reject) => {
			try {
				let item = await this.findOne("SELECT * FROM settings WHERE KEY=?", [KEY]);
				if (item) return resolve(item.VALUE)
			} catch (error) {
				sails.log.error("Settings.findOne");
				sails.log.error(error);
				return reject(error);
			}
			let cfg = sails.config.custom[KEY];
			if (cfg != undefined && DefaultValue == undefined) DefaultValue = cfg;

			if (DefaultValue != undefined) {
				try {
					await this.execute("INSERT INTO settings ('KEY', 'VALUE') VALUES (?,?)", [KEY, DefaultValue]);
					return resolve(DefaultValue);
				} catch (error) {
					sails.log.error("Settings.create");
					sails.log.error(error);
					return reject(error);
				}
			}
			return resolve("")
		});




	}

}

