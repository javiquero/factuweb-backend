
/**
*
* FOBR.js
*
* @description :: F_OBR model imported from Access factusol database at 29/5/2020 12:23:55.
* @docs        :: http://sailsjs.org/#!documentation/models
*
*/

module.exports = {
	tableName: 'F_OBR',
	description: 'Clientes, direcciones de entrega[F_CLI.CODCLI = F_OBR.CLIOBR]',
	attributes: {
    "CLIOBR": {
        "columnName": "CLIOBR",
        "defaultsTo": 0,
        "description": "[F=00000]Cliente",
        "allowNull": false,
        "type": "number"
    },
    "CODOBR": {
        "columnName": "CODOBR",
        "defaultsTo": 0,
        "description": "Código",
        "allowNull": false,
        "type": "number"
    },
    "NOMOBR": {
        "columnName": "NOMOBR",
        "defaultsTo": "",
        "description": "Nombre",
        "allowNull": true,
        "type": "string"
    },
    "DIROBR": {
        "columnName": "DIROBR",
        "defaultsTo": "",
        "description": "Dirección",
        "allowNull": true,
        "type": "string"
    },
    "POBOBR": {
        "columnName": "POBOBR",
        "defaultsTo": "",
        "description": "Población",
        "allowNull": true,
        "type": "string"
    },
    "CPOOBR": {
        "columnName": "CPOOBR",
        "defaultsTo": "",
        "description": "Cód. Postal",
        "allowNull": true,
        "type": "string"
    },
    "PROOBR": {
        "columnName": "PROOBR",
        "defaultsTo": "",
        "description": "Provincia",
        "allowNull": true,
        "type": "string"
    },
    "TELOBR": {
        "columnName": "TELOBR",
        "defaultsTo": "",
        "description": "Teléfono",
        "allowNull": true,
        "type": "string"
    },
    "PCOOBR": {
        "columnName": "PCOOBR",
        "defaultsTo": "",
        "description": "Persona de contacto",
        "allowNull": true,
        "type": "string"
    },
    "EMAOBR": {
        "columnName": "EMAOBR",
        "defaultsTo": "",
        "description": "E-mail",
        "allowNull": true,
        "type": "string"
    }
}}