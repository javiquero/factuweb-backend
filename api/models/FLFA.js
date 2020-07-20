
/**
*
* FLFA.js
*
* @description :: F_LFA model imported from Access factusol database at 29/5/2020 12:23:55.
* @docs        :: http://sailsjs.org/#!documentation/models
*
*/

module.exports = {
	tableName: 'F_LFA',
	description: 'Facturas emitidas (líneas)[F_ART.CODART = F_LFA.ARTLFA]',
	attributes: {
    "YEAR": {
        "columnName": "YEAR",
        "description": "Año de la db factusol",
        "allowNull": false,
        "type": "string",
		"autoMigrations": { index: true }
    },
    "TIPLFA": {
        "columnName": "TIPLFA",
        "defaultsTo": "0",
        "description": "Nº de serie",
        "allowNull": false,
        "type": "string",
		"autoMigrations": { index: true }
    },
    "CODLFA": {
        "columnName": "CODLFA",
        "defaultsTo": 0,
        "description": "[F=000000]Código",
        "allowNull": false,
        "type": "number",
		"autoMigrations": { index: true }
    },
    "POSLFA": {
        "columnName": "POSLFA",
        "defaultsTo": 0,
        "description": "[E]Posicion",
        "allowNull": false,
        "type": "number",
		"autoMigrations": { index: true }
    },
    "ARTLFA": {
        "columnName": "ARTLFA",
        "defaultsTo": "",
        "description": "Articulo",
        "allowNull": true,
        "type": "string"
    },
    "DESLFA": {
        "columnName": "DESLFA",
        "defaultsTo": "",
        "description": "Descripción",
        "allowNull": true,
        "type": "string"
    },
    "CANLFA": {
        "columnName": "CANLFA",
        "defaultsTo": 0,
        "description": "Cantidad",
        "allowNull": true,
        "type": "number"
    },
    "DT1LFA": {
        "columnName": "DT1LFA",
        "defaultsTo": 0,
        "description": "Descuento 1",
        "allowNull": true,
        "type": "number"
    },
    "DT2LFA": {
        "columnName": "DT2LFA",
        "defaultsTo": 0,
        "description": "Descuento 2",
        "allowNull": true,
        "type": "number"
    },
    "DT3LFA": {
        "columnName": "DT3LFA",
        "defaultsTo": 0,
        "description": "Descuento 3",
        "allowNull": true,
        "type": "number"
    },
    "PRELFA": {
        "columnName": "PRELFA",
        "defaultsTo": 0,
        "description": "Precio",
        "allowNull": true,
        "type": "number"
    },
    "TOTLFA": {
        "columnName": "TOTLFA",
        "defaultsTo": 0,
        "description": "Total",
        "allowNull": true,
        "type": "number"
    },
    "IVALFA": {
        "columnName": "IVALFA",
        "defaultsTo": 0,
        "description": "[L=#0;IVA1AUT#1;IVA2AUT#2;IVA3AUT#3;Exento]Porcentaje de IVA",
        "allowNull": true,
        "type": "number"
    },
    "DOCLFA": {
        "columnName": "DOCLFA",
        "defaultsTo": "",
        "description": "[E]documento que la creo P:presupuesto, C:cliente,A:Albaran",
        "allowNull": true,
        "type": "string"
    },
    "DTPLFA": {
        "columnName": "DTPLFA",
        "defaultsTo": "",
        "description": "[E]Tipo del documento que lo creo",
        "allowNull": true,
        "type": "string"
    },
    "DCOLFA": {
        "columnName": "DCOLFA",
        "defaultsTo": 0,
        "description": "[E]Código del documento que lo creo",
        "allowNull": true,
        "type": "number"
    },
    "COSLFA": {
        "columnName": "COSLFA",
        "defaultsTo": 0,
        "description": "[E]Precio de costo cuando se crea la línea",
        "allowNull": true,
        "type": "number"
    },
    "BULLFA": {
        "columnName": "BULLFA",
        "defaultsTo": 0,
        "description": "Bultos",
        "allowNull": true,
        "type": "number"
    },
    "COMLFA": {
        "columnName": "COMLFA",
        "defaultsTo": 0,
        "description": "Comisión del agente",
        "allowNull": true,
        "type": "number"
    },
    "MEMLFA": {
        "columnName": "MEMLFA",
        "defaultsTo": "",
        "description": "Comentarios",
        "allowNull": true,
        "type": "string"
    },
    "EJELFA": {
        "columnName": "EJELFA",
        "defaultsTo": "",
        "description": "[E]Ejercicio desde el que se valida",
        "allowNull": true,
        "type": "string"
    },
    "ALTLFA": {
        "columnName": "ALTLFA",
        "defaultsTo": 0,
        "description": "Alto",
        "allowNull": true,
        "type": "number"
    },
    "ANCLFA": {
        "columnName": "ANCLFA",
        "defaultsTo": 0,
        "description": "Ancho",
        "allowNull": true,
        "type": "number"
    },
    "FONLFA": {
        "columnName": "FONLFA",
        "defaultsTo": 0,
        "description": "Fondo",
        "allowNull": true,
        "type": "number"
    },
    "FFALFA": {
        "columnName": "FFALFA",
        "defaultsTo": "#1/1/1900#",
        "description": "[E]Fecha de fabricación",
        "allowNull": true,
        "type": "string",
        // "columnType": "DateTime"
    },
    "FCOLFA": {
        "columnName": "FCOLFA",
        "defaultsTo": "#1/1/1900#",
        "description": "[E]Fecha de consumo preferente",
        "allowNull": true,
        "type": "string",
        // "columnType": "DateTime"
    },
    "IINLFA": {
        "columnName": "IINLFA",
        "defaultsTo": 0,
        "description": "[E]IVA INCLUIDO EN LA LÍNEA",
        "allowNull": true,
        "type": "number"
    },
    "PIVLFA": {
        "columnName": "PIVLFA",
        "defaultsTo": 0,
        "description": "[E]PRECIO IVA INCLUIDO EN LA LÍNEA",
        "allowNull": true,
        "type": "number"
    },
    "TIVLFA": {
        "columnName": "TIVLFA",
        "defaultsTo": 0,
        "description": "[E]TOTAL IVA INCLUIDO EN LA LÍNEA",
        "allowNull": true,
        "type": "number"
    },
    "FIMLFA": {
        "columnName": "FIMLFA",
        "defaultsTo": 0,
        "description": "[E]FORMATO DE IMPRESIÓN DE LA LÍNEA DE DETALLE (0 = SIN FORMATO, 1 = NEGRITA, 3 = CURSIVA, 5 = SUBRAYADO, SUMAS = COMBINACIÓN DE OPCIONES)",
        "allowNull": true,
        "type": "number"
    },
    "CE1LFA": {
        "columnName": "CE1LFA",
        "defaultsTo": "",
        "description": "Talla",
        "allowNull": true,
        "type": "string"
    },
    "CE2LFA": {
        "columnName": "CE2LFA",
        "defaultsTo": "",
        "description": "Color",
        "allowNull": true,
        "type": "string"
    },
    "IMALFA": {
        "columnName": "IMALFA",
        "defaultsTo": "",
        "description": "Imagen asociada a la línea",
        "allowNull": true,
        "type": "string"
    },
    "SUMLFA": {
        "columnName": "SUMLFA",
        "defaultsTo": "",
        "description": "Sumatorio donde se debe acumular el valor",
        "allowNull": true,
        "type": "string"
    },
    "NIMLFA": {
        "columnName": "NIMLFA",
        "defaultsTo": 0,
        "description": "[L=#0;Imprimir#1;No imprimir]No imprimir la línea",
        "allowNull": true,
        "type": "number"
    },
    "TCOLFA": {
        "columnName": "TCOLFA",
        "defaultsTo": 0,
        "description": "",
        "allowNull": true,
        "type": "number"
    }
}}
