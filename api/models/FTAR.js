
/**
*
* FTAR.js
*
* @description :: F_TAR model imported from Access factusol database at 29/5/2020 12:23:56.
* @docs        :: http://sailsjs.org/#!documentation/models
*
*/

module.exports = {
	tableName: 'F_TAR',
	description: 'Tarifas de precios[F_LTA.TARLTA=F_TAR.CODTAR]',
	attributes: {
    "CODTAR": {
        "columnName": "CODTAR",
        "defaultsTo": 0,
        "description": "Código",
        "allowNull": false,
        "type": "number"
    },
    "DESTAR": {
        "columnName": "DESTAR",
        "defaultsTo": "",
        "description": "Descripción",
        "allowNull": true,
        "type": "string"
    }
}}