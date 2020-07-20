/**
 * Settings.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {

		"KEY": {
			"allowNull": false,
			"type": "string",
			"autoMigrations": { index: true }
		},
		"VALUE": {
			"defaultsTo": "",
			"allowNull": false,
			"type": "string"
		},
	}

};

