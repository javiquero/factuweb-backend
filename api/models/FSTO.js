
/**
*
* FSTO.js
*
* @description :: F_STO model imported from Access factusol database at 29/5/2020 12:23:56.
* @docs        :: http://sailsjs.org/#!documentation/models
*
*/

module.exports = {
	tableName: 'F_STO',
	description: 'Artículos, stock[F_ART.CODART = F_STO.ARTSTO][F_ALM.CODALM = F_STO.ALMSTO]',
	attributes: {
    "ARTSTO": {
        "columnName": "ARTSTO",
        "defaultsTo": "",
        "description": "Artículo",
        "allowNull": false,
        "type": "string",
		"autoMigrations": { index: true }
    },
    "ALMSTO": {
        "columnName": "ALMSTO",
        "defaultsTo": "",
        "description": "Almacén",
        "allowNull": false,
        "type": "string"
    },
    "MINSTO": {
        "columnName": "MINSTO",
        "defaultsTo": 0,
        "description": "Stock mínimo",
        "allowNull": true,
        "type": "number"
    },
    "ACTSTO": {
        "columnName": "ACTSTO",
        "defaultsTo": 0,
        "description": "Stock actual",
        "allowNull": true,
        "type": "number"
    },
    "DISSTO": {
        "columnName": "DISSTO",
        "defaultsTo": 0,
        "description": "Stock disponible",
        "allowNull": true,
        "type": "number"
    }
}}
