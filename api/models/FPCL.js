
/**
*
* FPCL.js
*
* @description :: F_PCL model imported from Access factusol database at 29/5/2020 12:23:55.
* @docs        :: http://sailsjs.org/#!documentation/models
*
*/

module.exports = {
	tableName: 'F_PCL',
	description: 'Pedidos de cliente[F_LPC.TIPLPC = F_PCL.TIPPCL AND F_LPC.CODLPC = F_PCL.CODPCL][F_CLI.CODCLI = F_PCL.CLIPCL][F_FPA.CODFPA = F_PCL.FOPPCL][F_ALM.CODALM = F_PCL.ALMPCL][F_AGE.CODAGE = F_PCL.AGEPCL]',
	attributes: {
    "YEAR": {
        "columnName": "YEAR",
        "description": "Año de la db factusol",
        "allowNull": false,
        "type": "string",
		"autoMigrations": { index: true }
    },
    "TIPPCL": {
        "columnName": "TIPPCL",
        "defaultsTo": "",
        "description": "Nº de serie",
        "allowNull": false,
        "type": "string",
		"autoMigrations": { index: true }
    },
    "CODPCL": {
        "columnName": "CODPCL",
        "defaultsTo": 0,
        "description": "[F=000000]Código",
        "allowNull": false,
        "type": "number",
		"autoMigrations": { index: true }
    },
    "REFPCL": {
        "columnName": "REFPCL",
        "defaultsTo": "",
        "description": "Referencia",
        "allowNull": true,
        "type": "string"
    },
    "FECPCL": {
        "columnName": "FECPCL",
        "defaultsTo": "",
        "description": "Fecha",
        "allowNull": true,
        "type": "string",
        // "columnType": "DateTime"
    },
    "AGEPCL": {
        "columnName": "AGEPCL",
        "defaultsTo": 0,
        "description": "[F=00000]Agente",
        "allowNull": true,
        "type": "number"
    },
    "PROPCL": {
        "columnName": "PROPCL",
        "defaultsTo": "",
        "description": "Proveedor del cliente",
        "allowNull": true,
        "type": "string"
    },
    "CLIPCL": {
        "columnName": "CLIPCL",
        "defaultsTo": 0,
        "description": "[F=00000]Cliente",
        "allowNull": true,
        "type": "number"
    },
    "CNOPCL": {
        "columnName": "CNOPCL",
        "defaultsTo": "",
        "description": "Nombre",
        "allowNull": true,
        "type": "string"
    },
    "CDOPCL": {
        "columnName": "CDOPCL",
        "defaultsTo": "",
        "description": "Domicilio",
        "allowNull": true,
        "type": "string"
    },
    "CPOPCL": {
        "columnName": "CPOPCL",
        "defaultsTo": "",
        "description": "Población",
        "allowNull": true,
        "type": "string"
    },
    "CCPPCL": {
        "columnName": "CCPPCL",
        "defaultsTo": "",
        "description": "Cód. Postal",
        "allowNull": true,
        "type": "string"
    },
    "CPRPCL": {
        "columnName": "CPRPCL",
        "defaultsTo": "",
        "description": "Provincia",
        "allowNull": true,
        "type": "string"
    },
    "CNIPCL": {
        "columnName": "CNIPCL",
        "defaultsTo": "",
        "description": "N.I.F.",
        "allowNull": true,
        "type": "string"
    },
    "TIVPCL": {
        "columnName": "TIVPCL",
        "defaultsTo": 0,
        "description": "[L=#0;Con IVA#1;Sin IVA#2;Intracomunitario#3;Importación]Tipo de IVA",
        "allowNull": true,
        "type": "number"
    },
    "REQPCL": {
        "columnName": "REQPCL",
        "defaultsTo": 0,
        "description": "[L=#No#1;Sí]Recargo de equivalencia",
        "allowNull": true,
        "type": "number"
    },
    "TELPCL": {
        "columnName": "TELPCL",
        "defaultsTo": "",
        "description": "Teléfono",
        "allowNull": true,
        "type": "string"
    },
    "ESTPCL": {
        "columnName": "ESTPCL",
        "defaultsTo": 0,
        "description": "[L=#0;Pte.#1;Pte. Parcial#2;Enviado#3;En almacén]Estado",
        "allowNull": true,
        "type": "number"
    },
    "ALMPCL": {
        "columnName": "ALMPCL",
        "defaultsTo": "",
        "description": "Almacén",
        "allowNull": true,
        "type": "string"
    },
    "NET1PCL": {
        "columnName": "NET1PCL",
        "defaultsTo": 0,
        "description": "Neto 1",
        "allowNull": true,
        "type": "number"
    },
    "NET2PCL": {
        "columnName": "NET2PCL",
        "defaultsTo": 0,
        "description": "Neto 2",
        "allowNull": true,
        "type": "number"
    },
    "NET3PCL": {
        "columnName": "NET3PCL",
        "defaultsTo": 0,
        "description": "Neto 3",
        "allowNull": true,
        "type": "number"
    },
    "PDTO1PCL": {
        "columnName": "PDTO1PCL",
        "defaultsTo": 0,
        "description": "Porcentaje de descuento 1",
        "allowNull": true,
        "type": "number"
    },
    "PDTO2PCL": {
        "columnName": "PDTO2PCL",
        "defaultsTo": 0,
        "description": "Porcentaje de descuento 2",
        "allowNull": true,
        "type": "number"
    },
    "PDTO3PCL": {
        "columnName": "PDTO3PCL",
        "defaultsTo": 0,
        "description": "Porcentaje de descuento 3",
        "allowNull": true,
        "type": "number"
    },
    "IDTO1PCL": {
        "columnName": "IDTO1PCL",
        "defaultsTo": 0,
        "description": "Importe de descuento 1",
        "allowNull": true,
        "type": "number"
    },
    "IDTO2PCL": {
        "columnName": "IDTO2PCL",
        "defaultsTo": 0,
        "description": "Importe de descuento 2",
        "allowNull": true,
        "type": "number"
    },
    "IDTO3PCL": {
        "columnName": "IDTO3PCL",
        "defaultsTo": 0,
        "description": "Importe de descuento 3",
        "allowNull": true,
        "type": "number"
    },
    "PPPA1PCL": {
        "columnName": "PPPA1PCL",
        "defaultsTo": 0,
        "description": "Porcentaje de pronto pago 1",
        "allowNull": true,
        "type": "number"
    },
    "PPPA2PCL": {
        "columnName": "PPPA2PCL",
        "defaultsTo": 0,
        "description": "Porcentaje de pronto pago 2",
        "allowNull": true,
        "type": "number"
    },
    "PPPA3PCL": {
        "columnName": "PPPA3PCL",
        "defaultsTo": 0,
        "description": "Porcentaje de pronto pago 3",
        "allowNull": true,
        "type": "number"
    },
    "IPPA1PCL": {
        "columnName": "IPPA1PCL",
        "defaultsTo": 0,
        "description": "Importe de pronto pago 1",
        "allowNull": true,
        "type": "number"
    },
    "IPPA2PCL": {
        "columnName": "IPPA2PCL",
        "defaultsTo": 0,
        "description": "Importe de pronto pago 2",
        "allowNull": true,
        "type": "number"
    },
    "IPPA3PCL": {
        "columnName": "IPPA3PCL",
        "defaultsTo": 0,
        "description": "Importe de pronto pago 3",
        "allowNull": true,
        "type": "number"
    },
    "PPOR1PCL": {
        "columnName": "PPOR1PCL",
        "defaultsTo": 0,
        "description": "Porcentaje de portes 1",
        "allowNull": true,
        "type": "number"
    },
    "PPOR2PCL": {
        "columnName": "PPOR2PCL",
        "defaultsTo": 0,
        "description": "Porcentaje de portes 2",
        "allowNull": true,
        "type": "number"
    },
    "PPOR3PCL": {
        "columnName": "PPOR3PCL",
        "defaultsTo": 0,
        "description": "Porcentaje de portes 3",
        "allowNull": true,
        "type": "number"
    },
    "IPOR1PCL": {
        "columnName": "IPOR1PCL",
        "defaultsTo": 0,
        "description": "Importe de portes 1",
        "allowNull": true,
        "type": "number"
    },
    "IPOR2PCL": {
        "columnName": "IPOR2PCL",
        "defaultsTo": 0,
        "description": "Importe de portes 2",
        "allowNull": true,
        "type": "number"
    },
    "IPOR3PCL": {
        "columnName": "IPOR3PCL",
        "defaultsTo": 0,
        "description": "Importe de portes 3",
        "allowNull": true,
        "type": "number"
    },
    "PFIN1PCL": {
        "columnName": "PFIN1PCL",
        "defaultsTo": 0,
        "description": "Porcentaje de financiación 1",
        "allowNull": true,
        "type": "number"
    },
    "PFIN2PCL": {
        "columnName": "PFIN2PCL",
        "defaultsTo": 0,
        "description": "Porcentaje de financiación 2",
        "allowNull": true,
        "type": "number"
    },
    "PFIN3PCL": {
        "columnName": "PFIN3PCL",
        "defaultsTo": 0,
        "description": "Porcentaje de financiación 3",
        "allowNull": true,
        "type": "number"
    },
    "IFIN1PCL": {
        "columnName": "IFIN1PCL",
        "defaultsTo": 0,
        "description": "Importe de financiación 1",
        "allowNull": true,
        "type": "number"
    },
    "IFIN2PCL": {
        "columnName": "IFIN2PCL",
        "defaultsTo": 0,
        "description": "Importe de financiación 2",
        "allowNull": true,
        "type": "number"
    },
    "IFIN3PCL": {
        "columnName": "IFIN3PCL",
        "defaultsTo": 0,
        "description": "Importe de financiación 3",
        "allowNull": true,
        "type": "number"
    },
    "BAS1PCL": {
        "columnName": "BAS1PCL",
        "defaultsTo": 0,
        "description": "Base imponible 1",
        "allowNull": true,
        "type": "number"
    },
    "BAS2PCL": {
        "columnName": "BAS2PCL",
        "defaultsTo": 0,
        "description": "Base imponible 2",
        "allowNull": true,
        "type": "number"
    },
    "BAS3PCL": {
        "columnName": "BAS3PCL",
        "defaultsTo": 0,
        "description": "Base imponible 3",
        "allowNull": true,
        "type": "number"
    },
    "PIVA1PCL": {
        "columnName": "PIVA1PCL",
        "defaultsTo": 0,
        "description": "Porcentaje de impuestos 1",
        "allowNull": true,
        "type": "number"
    },
    "PIVA2PCL": {
        "columnName": "PIVA2PCL",
        "defaultsTo": 0,
        "description": "Porcentaje de impuestos 2",
        "allowNull": true,
        "type": "number"
    },
    "PIVA3PCL": {
        "columnName": "PIVA3PCL",
        "defaultsTo": 0,
        "description": "Porcentaje de impuestos 3",
        "allowNull": true,
        "type": "number"
    },
    "IIVA1PCL": {
        "columnName": "IIVA1PCL",
        "defaultsTo": 0,
        "description": "Importe de impuestos 1",
        "allowNull": true,
        "type": "number"
    },
    "IIVA2PCL": {
        "columnName": "IIVA2PCL",
        "defaultsTo": 0,
        "description": "Importe de impuestos 2",
        "allowNull": true,
        "type": "number"
    },
    "IIVA3PCL": {
        "columnName": "IIVA3PCL",
        "defaultsTo": 0,
        "description": "Importe de impuestos 3",
        "allowNull": true,
        "type": "number"
    },
    "PREC1PCL": {
        "columnName": "PREC1PCL",
        "defaultsTo": 0,
        "description": "Porcentaje de recargo de equivalencia 1",
        "allowNull": true,
        "type": "number"
    },
    "PREC2PCL": {
        "columnName": "PREC2PCL",
        "defaultsTo": 0,
        "description": "Porcentaje de recargo de equivalencia 2",
        "allowNull": true,
        "type": "number"
    },
    "PREC3PCL": {
        "columnName": "PREC3PCL",
        "defaultsTo": 0,
        "description": "Porcentaje de recargo de equivalencia 3",
        "allowNull": true,
        "type": "number"
    },
    "IREC1PCL": {
        "columnName": "IREC1PCL",
        "defaultsTo": 0,
        "description": "Importe de recargo de equivalencia 1",
        "allowNull": true,
        "type": "number"
    },
    "IREC2PCL": {
        "columnName": "IREC2PCL",
        "defaultsTo": 0,
        "description": "Importe de recargo de equivalencia 2",
        "allowNull": true,
        "type": "number"
    },
    "IREC3PCL": {
        "columnName": "IREC3PCL",
        "defaultsTo": 0,
        "description": "Importe de recargo de equivalencia 3",
        "allowNull": true,
        "type": "number"
    },
    "PRET1PCL": {
        "columnName": "PRET1PCL",
        "defaultsTo": 0,
        "description": "Porcentaje de retención",
        "allowNull": true,
        "type": "number"
    },
    "IRET1PCL": {
        "columnName": "IRET1PCL",
        "defaultsTo": 0,
        "description": "Importe de retención",
        "allowNull": true,
        "type": "number"
    },
    "TOTPCL": {
        "columnName": "TOTPCL",
        "defaultsTo": 0,
        "description": "Total",
        "allowNull": true,
        "type": "number"
    },
    "FOPPCL": {
        "columnName": "FOPPCL",
        "defaultsTo": "",
        "description": "Forma de pago",
        "allowNull": true,
        "type": "string"
    },
    "PENPCL": {
        "columnName": "PENPCL",
        "defaultsTo": "",
        "description": "Plazo de entrega",
        "allowNull": true,
        "type": "string"
    },
    "PRTPCL": {
        "columnName": "PRTPCL",
        "defaultsTo": 0,
        "description": "[L=#0;Pagados#1;Debidos]Portes",
        "allowNull": true,
        "type": "number"
    },
    "TPOPCL": {
        "columnName": "TPOPCL",
        "defaultsTo": "",
        "description": "Portes (texto)",
        "allowNull": true,
        "type": "string"
    },
    "OB1PCL": {
        "columnName": "OB1PCL",
        "defaultsTo": "",
        "description": "Línea 1 de observaciones",
        "allowNull": true,
        "type": "string"
    },
    "OB2PCL": {
        "columnName": "OB2PCL",
        "defaultsTo": "",
        "description": "Línea 2 de observaciones",
        "allowNull": true,
        "type": "string"
    },
    "OBRPCL": {
        "columnName": "OBRPCL",
        "defaultsTo": 0,
        "description": "Código de la dirección de entrega",
        "allowNull": true,
        "type": "number"
    },
    "PPOPCL": {
        "columnName": "PPOPCL",
        "defaultsTo": "",
        "description": "Pedido por",
        "allowNull": true,
        "type": "string"
    },
    "PRIPCL": {
        "columnName": "PRIPCL",
        "defaultsTo": "",
        "description": "[E]CAMPO PARA ANOTACIONES PRIVADAS DEL DOCUMENTO",
        "allowNull": true,
        "type": "string"
    },
    "ASOPCL": {
        "columnName": "ASOPCL",
        "defaultsTo": "",
        "description": "[E]DOCUMENTOS EXTERNOS ASOCIADOS AL DOCUMENTO.",
        "allowNull": true,
        "type": "string"
    },
    "COMPCL": {
        "columnName": "COMPCL",
        "defaultsTo": "",
        "description": "[E]COMENTARIOS DESPUES DE LÍNEAS DE DETALLE",
        "allowNull": true,
        "type": "string"
    },
    "USUPCL": {
        "columnName": "USUPCL",
        "defaultsTo": 0,
        "description": "Código del usuario que creó el documento",
        "allowNull": true,
        "type": "number"
    },
    "USMPCL": {
        "columnName": "USMPCL",
        "defaultsTo": 0,
        "description": "Código del último usuario que creó el documento",
        "allowNull": true,
        "type": "number"
    },
    "FAXPCL": {
        "columnName": "FAXPCL",
        "defaultsTo": "",
        "description": "Fax",
        "allowNull": true,
        "type": "string"
    },
    "NET4PCL": {
        "columnName": "NET4PCL",
        "defaultsTo": 0,
        "description": "Neto (Exento de impuestos)",
        "allowNull": true,
        "type": "number"
    },
    "PDTO4PCL": {
        "columnName": "PDTO4PCL",
        "defaultsTo": 0,
        "description": "Porcentaje de descuento (Exento de impuestos)",
        "allowNull": true,
        "type": "number"
    },
    "IDTO4PCL": {
        "columnName": "IDTO4PCL",
        "defaultsTo": 0,
        "description": "Importe de descuento (Exento de impuestos)",
        "allowNull": true,
        "type": "number"
    },
    "PPPA4PCL": {
        "columnName": "PPPA4PCL",
        "defaultsTo": 0,
        "description": "Porcentaje de pronto pago (Exento de impuestos)",
        "allowNull": true,
        "type": "number"
    },
    "IPPA4PCL": {
        "columnName": "IPPA4PCL",
        "defaultsTo": 0,
        "description": "Importe de pronto pago (Exento de impuestos)",
        "allowNull": true,
        "type": "number"
    },
    "PPOR4PCL": {
        "columnName": "PPOR4PCL",
        "defaultsTo": 0,
        "description": "Porcentaje de portes (Exento de impuestos)",
        "allowNull": true,
        "type": "number"
    },
    "IPOR4PCL": {
        "columnName": "IPOR4PCL",
        "defaultsTo": 0,
        "description": "Importe de portes (Exento de impuestos)",
        "allowNull": true,
        "type": "number"
    },
    "PFIN4PCL": {
        "columnName": "PFIN4PCL",
        "defaultsTo": 0,
        "description": "Porcentaje de financiación (Exento de impuestos)",
        "allowNull": true,
        "type": "number"
    },
    "IFIN4PCL": {
        "columnName": "IFIN4PCL",
        "defaultsTo": 0,
        "description": "Importe de financiación (Exento de impuestos)",
        "allowNull": true,
        "type": "number"
    },
    "BAS4PCL": {
        "columnName": "BAS4PCL",
        "defaultsTo": 0,
        "description": "Base imponible (Exento de impuestos)",
        "allowNull": true,
        "type": "number"
    },
    "EMAPCL": {
        "columnName": "EMAPCL",
        "defaultsTo": 0,
        "description": "[E]Enviado por e-mail",
        "allowNull": true,
        "type": "number"
    },
    "PASPCL": {
        "columnName": "PASPCL",
        "defaultsTo": "",
        "description": "[E]Permisos y contraseña del documento",
        "allowNull": true,
        "type": "string"
    },
    "HORPCL": {
        "columnName": "HORPCL",
        "defaultsTo": "",
        "description": "[F=hh:mm]Hora",
        "allowNull": true,
        "type": "string",
        // "columnType": "DateTime"
    },
    "CEMPCL": {
        "columnName": "CEMPCL",
        "defaultsTo": "",
        "description": "E-mail de destino",
        "allowNull": true,
        "type": "string"
    },
    "CPAPCL": {
        "columnName": "CPAPCL",
        "defaultsTo": "",
        "description": "País del cliente",
        "allowNull": true,
        "type": "string"
    },
    "INCPCL": {
        "columnName": "INCPCL",
        "defaultsTo": 0,
        "description": "[L=#0;No#1;Sí]Pedido con incidencia",
        "allowNull": true,
        "type": "number"
    },
    "TIVA1PCL": {
        "columnName": "TIVA1PCL",
        "defaultsTo": 0,
        "description": "[E]Tipo de iva al que pertenece el neto 1 (0 a 6)",
        "allowNull": true,
        "type": "number"
    },
    "TIVA2PCL": {
        "columnName": "TIVA2PCL",
        "defaultsTo": 0,
        "description": "[E]Tipo de iva al que pertenece el neto 2 (0 a 6)",
        "allowNull": true,
        "type": "number"
    },
    "TIVA3PCL": {
        "columnName": "TIVA3PCL",
        "defaultsTo": 0,
        "description": "[E]Tipo de iva al que pertenece el neto 3 (0 a 6)",
        "allowNull": true,
        "type": "number"
    },
    "TRNPCL": {
        "columnName": "TRNPCL",
        "defaultsTo": 0,
        "description": "[F=000]Código del transportista",
        "allowNull": true,
        "type": "number"
    },
    "TPVIDPCL": {
        "columnName": "TPVIDPCL",
        "defaultsTo": "''",
        "description": "",
        "allowNull": true,
        "type": "string"
    },
    "TERPCL": {
        "columnName": "TERPCL",
        "defaultsTo": 0,
        "description": "",
        "allowNull": true,
        "type": "number"
    },
    "IMPPCL": {
        "columnName": "IMPPCL",
        "defaultsTo": "",
        "description": "",
        "allowNull": true,
        "type": "string"
    }
}}
