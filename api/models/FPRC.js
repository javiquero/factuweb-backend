
/**
*
* FPRC.js
*
* @description :: F_PRC model imported from Access factusol database at 29/5/2020 12:23:55.
* @docs        :: http://sailsjs.org/#!documentation/models
*
*/

module.exports = {
	tableName: 'F_PRC',
	description: 'Condiciones especiales de venta[F_CLI.CODCLI = F_PRC.CLIPRC][F_ART.CODART = F_PRC.ARTPRC]',
	attributes: {
    "CLIPRC": {
        "columnName": "CLIPRC",
        "defaultsTo": 0,
        "description": "[F=00000]Cliente",
        "allowNull": true,
        "type": "number",
		"autoMigrations": { index: true }
    },
    "ARTPRC": {
        "columnName": "ARTPRC",
        "defaultsTo": "",
        "description": "Artículo",
        "allowNull": true,
        "type": "string",
		"autoMigrations": { index: true }
    },
    "PREPRC": {
        "columnName": "PREPRC",
        "defaultsTo": 0,
        "description": "Precio/Descuento",
        "allowNull": true,
        "type": "number"
    },
    "TIPPRC": {
        "columnName": "TIPPRC",
        "defaultsTo": 0,
        "description": "[L=#0;Importe de venta#1;% Descuento]Tipo",
        "allowNull": true,
        "type": "number"
    },
    "AOFPRC": {
        "columnName": "AOFPRC",
        "defaultsTo": 0,
        "description": "[L=#0;Artículo#1;Familia]Aplicar descuento sobre artículo o familia",
        "allowNull": true,
        "type": "number"
    }
}}
