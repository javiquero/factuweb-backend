
/**
*
* FCLI.js
*
* @description :: F_CLI model imported from Access factusol database at 29/5/2020 12:23:54.
* @docs        :: http://sailsjs.org/#!documentation/models
*
*/

module.exports = {
	tableName: 'F_CLI',
	description: 'Clientes[F_AGE.CODAGE = F_CLI.AGECLI][F_ACT.CODACT = F_CLI.ACTCLI][F_TCL.CODTCL = F_CLI.TCLCLI][F_FPA.CODFPA = F_CLI.FPACLI][F_ACL.CLIACL=F_CLI.CODCLI][F_CCC.CLICCC=F_CLI.CODCLI][F_OBR.CLIOBR=F_CLI.CODCLI][F_RIE.CLIRIE=F_CLI.CODCLI]',
	attributes: {
    "CODCLI": {
        "columnName": "CODCLI",
        "defaultsTo": 0,
        "description": "Código",
        "allowNull": false,
        "type": "number",
		"autoMigrations": { index: true }
    },
    "NIFCLI": {
        "columnName": "NIFCLI",
        "defaultsTo": "",
        "description": "N.I.F.",
        "allowNull": true,
        "type": "string"
    },
    "NOFCLI": {
        "columnName": "NOFCLI",
        "defaultsTo": "",
        "description": "Nombre fiscal",
        "allowNull": true,
        "type": "string"
    },
    "NOCCLI": {
        "columnName": "NOCCLI",
        "defaultsTo": "",
        "description": "Nombre comercial",
        "allowNull": true,
        "type": "string"
    },
    "DOMCLI": {
        "columnName": "DOMCLI",
        "defaultsTo": "",
        "description": "Domicilio",
        "allowNull": true,
        "type": "string"
    },
    "POBCLI": {
        "columnName": "POBCLI",
        "defaultsTo": "",
        "description": "Población",
        "allowNull": true,
        "type": "string"
    },
    "PROCLI": {
        "columnName": "PROCLI",
        "defaultsTo": "",
        "description": "Provincia",
        "allowNull": true,
        "type": "string"
    },
    "TELCLI": {
        "columnName": "TELCLI",
        "defaultsTo": "",
        "description": "Teléfono",
        "allowNull": true,
        "type": "string"
    },
    "FAXCLI": {
        "columnName": "FAXCLI",
        "defaultsTo": "",
        "description": "Fax",
        "allowNull": true,
        "type": "string"
    },
    "PCOCLI": {
        "columnName": "PCOCLI",
        "defaultsTo": "",
        "description": "Persona de contacto",
        "allowNull": true,
        "type": "string"
    },
    "AGECLI": {
        "columnName": "AGECLI",
        "defaultsTo": 0,
        "description": "[F=00000]Agente comercial",
        "allowNull": true,
        "type": "number"
    },
    "BANCLI": {
        "columnName": "BANCLI",
        "defaultsTo": "",
        "description": "Banco",
        "allowNull": true,
        "type": "string"
    },
    "ENTCLI": {
        "columnName": "ENTCLI",
        "defaultsTo": "",
        "description": "Entidad",
        "allowNull": true,
        "type": "string"
    },
    "OFICLI": {
        "columnName": "OFICLI",
        "defaultsTo": "",
        "description": "Oficina",
        "allowNull": true,
        "type": "string"
    },
    "DCOCLI": {
        "columnName": "DCOCLI",
        "defaultsTo": "",
        "description": "Dígito de control",
        "allowNull": true,
        "type": "string"
    },
    "CUECLI": {
        "columnName": "CUECLI",
        "defaultsTo": "",
        "description": "Nº de cuenta",
        "allowNull": true,
        "type": "string"
    },
    "FPACLI": {
        "columnName": "FPACLI",
        "defaultsTo": "",
        "description": "Forma de pago",
        "allowNull": true,
        "type": "string"
    },
    "TARCLI": {
        "columnName": "TARCLI",
        "defaultsTo": 0,
        "description": "[E]Tarifa",
        "allowNull": true,
        "type": "number"
    },
    "DT1CLI": {
        "columnName": "DT1CLI",
        "defaultsTo": 0,
        "description": "Descuento 1",
        "allowNull": true,
        "type": "number"
    },
    "DT2CLI": {
        "columnName": "DT2CLI",
        "defaultsTo": 0,
        "description": "Descuento 2",
        "allowNull": true,
        "type": "number"
    },
    "DT3CLI": {
        "columnName": "DT3CLI",
        "defaultsTo": 0,
        "description": "Descuento 3",
        "allowNull": true,
        "type": "number"
    },
    "TPOCLI": {
        "columnName": "TPOCLI",
        "defaultsTo": 0,
        "description": "[L=#Pagados#1;Debidos]Portes",
        "allowNull": true,
        "type": "number"
    },
    "IVACLI": {
        "columnName": "IVACLI",
        "defaultsTo": 0,
        "description": "[L=#0;Con IVA#1;Sin IVA#2;Intracomunitario#3;Importación]Tipo de IVA",
        "allowNull": true,
        "type": "number"
    },
    "TIVCLI": {
        "columnName": "TIVCLI",
        "defaultsTo": 0,
        "description": "[L=#0;IVA1AUT#1;IVA2AUT#2;IVA3AUT#3;Exento]Porcentaje de IVA",
        "allowNull": true,
        "type": "number"
    },
    "REQCLI": {
        "columnName": "REQCLI",
        "defaultsTo": 0,
        "description": "[L=#No#1;Sí]Recargo de equivalencia",
        "allowNull": true,
        "type": "number"
    },
    "EMACLI": {
        "columnName": "EMACLI",
        "defaultsTo": "",
        "description": "E-mail",
        "allowNull": true,
        "type": "string"
    },
    "PAICLI": {
        "columnName": "PAICLI",
        "defaultsTo": "",
        "description": "País",
        "allowNull": true,
        "type": "string"
    },
    "SWICLI": {
        "columnName": "SWICLI",
        "defaultsTo": "",
        "description": "SWIFT del banco",
        "allowNull": true,
        "type": "string"
    },
    "SUWCLI": {
        "columnName": "SUWCLI",
        "defaultsTo": 0,
        "description": "[E]Permitir su utilización en internet",
        "allowNull": true,
        "type": "number"
    },
    "MEWCLI": {
        "columnName": "MEWCLI",
        "defaultsTo": "",
        "description": "[E]Mensaje emergente web",
        "allowNull": true,
        "type": "string"
    }
}}
