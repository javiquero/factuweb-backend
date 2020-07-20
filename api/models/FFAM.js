
/**
*
* FFAM.js
*
* @description :: F_FAM model imported from Access factusol database at 29/5/2020 12:23:55.
* @docs        :: http://sailsjs.org/#!documentation/models
*
*/

module.exports = {
	tableName: 'F_FAM',
	description: 'Familias[F_SEC.CODSEC = F_FAM.SECFAM]',
	attributes: {
    "CODFAM": {
        "columnName": "CODFAM",
        "defaultsTo": "",
        "description": "Código",
        "allowNull": false,
        "type": "string",
		"autoMigrations": { index: true }
    },
    "DESFAM": {
        "columnName": "DESFAM",
        "defaultsTo": "",
        "description": "Descripción",
        "allowNull": true,
        "type": "string"
    },
    "SECFAM": {
        "columnName": "SECFAM",
        "defaultsTo": "",
        "description": "Sección",
        "allowNull": true,
        "type": "string",
		"autoMigrations": { index: true }
    },
    "TEXFAM": {
        "columnName": "TEXFAM",
        "defaultsTo": "",
        "description": "Texto predefinido",
        "allowNull": true,
        "type": "string"
    },
    "SUWFAM": {
        "columnName": "SUWFAM",
        "defaultsTo": 0,
        "description": "[E]Permitir subida a internet",
        "allowNull": true,
        "type": "number"
    },
    "IMAFAM": {
        "columnName": "IMAFAM",
        "defaultsTo": "",
        "description": "[E]Imagen de la familia",
        "allowNull": true,
        "type": "string"
    },
    "ORDFAM": {
        "columnName": "ORDFAM",
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

