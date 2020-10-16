const fs = require('fs');
const Database = require('sqlite-async')

module.exports = {
	connect(mode=Database.OPEN_READONLY) {
		return new Promise((resolve, reject) => {
			fs.access(process.cwd() + "/db.sqlite", fs.constants.F_OK || fs.constants.R_OK, (err) => {
				if (err) {
					sails.log.error(`db.sqlite ${err.code === 'ENOENT' ? 'does not exist' : 'is not readable'} `);
					return reject(err);
				} else {
					Database.open(process.cwd() + "/db.sqlite", mode).then(db => {
						return resolve(db);
					})
				}
			})
		});
	}, find(query, params) {
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
	},execute(query, params) {
		return new Promise(async (resolve, reject) =>{
			let db = undefined;
			try {
				db = await this.connect(Database.OPEN_READWRITE);
				await db.run(query, params);
				db.close();
				return resolve();
			} catch (error) {
				db.close();
				sails.log.error(table,condition, error);
				return reject(error)
			}
		});
	},
}

