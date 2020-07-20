
/**
*
* FSEC.js
*
* @description :: F_SEC model imported from Access factusol database at 29/5/2020 12:23:56.
* @docs        :: http://sailsjs.org/#!documentation/models
*
*/

module.exports = {
	tableName: 'F_SEC',
	description: 'Secciones',
	attributes: {
    "CODSEC": {
        "columnName": "CODSEC",
        "defaultsTo": "",
        "description": "Código",
        "allowNull": false,
        "type": "string",
		"autoMigrations": { index: true }
    },
    "DESSEC": {
        "columnName": "DESSEC",
        "defaultsTo": "",
        "description": "Descripción",
        "allowNull": true,
        "type": "string"
    },
    "SUWSEC": {
        "columnName": "SUWSEC",
        "defaultsTo": 0,
        "description": "[E]Permitir subir a internet",
        "allowNull": true,
        "type": "number"
    },
    "IMASEC": {
        "columnName": "IMASEC",
        "defaultsTo": "",
        "description": "[E]Imagen de la sección",
        "allowNull": true,
        "type": "string"
    },
    "ORDSEC": {
        "columnName": "ORDSEC",
        "defaultsTo": 999999,
        "description": "",
        "allowNull": true,
        "type": "number"
    }
},
customToJSON: function() {
	return _.omit(this, ['createdAt', 'updatedAt'])
  }
}

