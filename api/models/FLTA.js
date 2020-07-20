
/**
*
* FLTA.js
*
* @description :: F_LTA model imported from Access factusol database at 5/6/2020 13:52:53.
* @docs        :: http://sailsjs.org/#!documentation/models
*
*/

module.exports = {
	tableName: 'F_LTA',
	description: 'Artículos, precios[F_TAR.CODTAR = F_LTA.TARLTA] [F_ART.CODART = F_LTA.ARTLTA]',
	attributes: {
    "TARLTA": {
        "columnName": "TARLTA",
        "defaultsTo": 0,
        "description": "Código",
        "allowNull": false,
        "type": "number"
    },
    "ARTLTA": {
        "columnName": "ARTLTA",
        "defaultsTo": "",
        "description": "Artículo",
        "allowNull": false,
        "type": "string"
    },
    "MARLTA": {
        "columnName": "MARLTA",
        "defaultsTo": 0,
        "description": "Margen",
        "allowNull": true,
        "type": "number"
    },
    "PRELTA": {
        "columnName": "PRELTA",
        "defaultsTo": 0,
        "description": "Precio",
        "allowNull": true,
        "type": "number"
    }
}}