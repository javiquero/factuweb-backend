
/**
*
* FLPC.js
*
* @description :: F_LPC model imported from Access factusol database at 3/7/2020 10:0:50.
* @docs        :: http://sailsjs.org/#!documentation/models
*
*/

module.exports = {
	tableName: 'F_LPC',
	description: 'Pedidos de cliente (líneas)[F_ART.CODART = F_LPC.ARTLPC]',
	attributes: {
    "YEAR": {
        "columnName": "YEAR",
        "description": "Año de la db factusol",
        "allowNull": false,
        "type": "string",
		"autoMigrations": { index: true }
    },
    "TIPLPC": {
        "columnName": "TIPLPC",
        "defaultsTo": "0",
        "description": "Nº de serie",
        "allowNull": false,
        "type": "string",
		"autoMigrations": { index: true }
    },
    "CODLPC": {
        "columnName": "CODLPC",
        "defaultsTo": 0,
        "description": "[F=000000]Código",
        "allowNull": false,
        "type": "number",
		"autoMigrations": { index: true }
    },
    "POSLPC": {
        "columnName": "POSLPC",
        "defaultsTo": 0,
        "description": "[E]Posicion de la línea del ped. de cliente",
        "allowNull": false,
        "type": "number",
		"autoMigrations": { index: true }
    },
    "ARTLPC": {
        "columnName": "ARTLPC",
        "defaultsTo": "",
        "description": "Artículo",
        "allowNull": true,
        "type": "string"
    },
    "DESLPC": {
        "columnName": "DESLPC",
        "defaultsTo": "",
        "description": "Descripción",
        "allowNull": true,
        "type": "string"
    },
    "CANLPC": {
        "columnName": "CANLPC",
        "defaultsTo": 0,
        "description": "Cantidad",
        "allowNull": true,
        "type": "number"
    },
    "DT1LPC": {
        "columnName": "DT1LPC",
        "defaultsTo": 0,
        "description": "Descuento 1",
        "allowNull": true,
        "type": "number"
    },
    "DT2LPC": {
        "columnName": "DT2LPC",
        "defaultsTo": 0,
        "description": "Descuento 2",
        "allowNull": true,
        "type": "number"
    },
    "DT3LPC": {
        "columnName": "DT3LPC",
        "defaultsTo": 0,
        "description": "Descuento 3",
        "allowNull": true,
        "type": "number"
    },
    "PRELPC": {
        "columnName": "PRELPC",
        "defaultsTo": 0,
        "description": "Precio",
        "allowNull": true,
        "type": "number"
    },
    "TOTLPC": {
        "columnName": "TOTLPC",
        "defaultsTo": 0,
        "description": "Total",
        "allowNull": true,
        "type": "number"
    },
    "PENLPC": {
        "columnName": "PENLPC",
        "defaultsTo": 0,
        "description": "Pendiente",
        "allowNull": true,
        "type": "number"
    },
    "IVALPC": {
        "columnName": "IVALPC",
        "defaultsTo": 0,
        "description": "[L=#0;IVA1AUT#1;IVA2AUT#2;IVA3AUT#3;Exento]Porcentaje de IVA",
        "allowNull": true,
        "type": "number"
    },
    "DOCLPC": {
        "columnName": "DOCLPC",
        "defaultsTo": "",
        "description": "[E]Documento que lo creo P: presupuesto",
        "allowNull": true,
        "type": "string"
    },
    "DTPLPC": {
        "columnName": "DTPLPC",
        "defaultsTo": "",
        "description": "[E]Tipo del documento que lo creo",
        "allowNull": true,
        "type": "string"
    },
    "DCOLPC": {
        "columnName": "DCOLPC",
        "defaultsTo": 0,
        "description": "[E]Código del documento que lo creo",
        "allowNull": true,
        "type": "number"
    },
    "MEMLPC": {
        "columnName": "MEMLPC",
        "defaultsTo": "",
        "description": "Comentarios",
        "allowNull": true,
        "type": "string"
    },
    "PIVLPC": {
        "columnName": "PIVLPC",
        "defaultsTo": 0,
        "description": "[E]PRECIO IVA INCLUIDO EN LA LÍNEA",
        "allowNull": true,
        "type": "number"
    },
    "TIVLPC": {
        "columnName": "TIVLPC",
        "defaultsTo": 0,
        "description": "[E]TOTAL IVA INCLUIDO EN LA LÍNEA",
        "allowNull": true,
        "type": "number"
    },
    "CE1LPC": {
        "columnName": "CE1LPC",
        "defaultsTo": "",
        "description": "Talla",
        "allowNull": true,
        "type": "string"
    },
    "CE2LPC": {
        "columnName": "CE2LPC",
        "defaultsTo": "",
        "description": "Color",
        "allowNull": true,
        "type": "string"
    },
    "IMALPC": {
        "columnName": "IMALPC",
        "defaultsTo": "",
        "description": "Imagen asociada a la línea",
        "allowNull": true,
        "type": "string"
    },
    "SUMLPC": {
        "columnName": "SUMLPC",
        "defaultsTo": "",
        "description": "Sumatorio donde se debe acumular el valor",
        "allowNull": true,
        "type": "string"
    },
    "ANULPC": {
        "columnName": "ANULPC",
        "defaultsTo": 0,
        "description": "",
        "allowNull": true,
        "type": "number"
    }
}}
