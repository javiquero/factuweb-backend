
/**
*
* FAGE.js
*
* @description :: F_AGE model imported from Access factusol database at 5/6/2020 13:32:38.
* @docs        :: http://sailsjs.org/#!documentation/models
*
*/

module.exports = {
	tableName: 'F_AGE',
	description: '',
	attributes: {
    "CODAGE": {
        "columnName": "CODAGE",
        "defaultsTo": 0,
        "description": "Código de agente",
        "allowNull": false,
		"type": "number",
		"autoMigrations": { index: true }
    },
    "TEMAGE": {
        "columnName": "TEMAGE",
        "defaultsTo": "",
        "description": "Movil",
        "allowNull": true,
        "type": "string"
    },
    "EMAAGE": {
        "columnName": "EMAAGE",
        "defaultsTo": "",
        "description": "E-Mail",
        "allowNull": true,
        "type": "string"
    },
    "TEPAGE": {
        "columnName": "TEPAGE",
        "defaultsTo": "",
        "description": "Teléfono particular",
        "allowNull": true,
        "type": "string"
    },
    "NOMAGE": {
        "columnName": "NOMAGE",
        "defaultsTo": "",
        "description": "Nombre",
        "allowNull": true,
        "type": "string"
    }
	},
	customToJSON: function() {
		return _.omit(this, ['createdAt', 'updatedAt'])
	  }
}

