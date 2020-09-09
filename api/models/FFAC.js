
/**
*
* FFAC.js
*
* @description :: F_FAC model imported from Access factusol database at 29/5/2020 12:23:55.
* @docs        :: http://sailsjs.org/#!documentation/models
*
*/

module.exports = {
	tableName: 'F_FAC',
	description: 'Facturas emitidas[F_LFA.TIPLFA=F_FAC.TIPFAC AND F_LFA.CODLFA=F_FAC.CODFAC][F_CLI.CODCLI=F_FAC.CLIFAC][F_ALM.CODALM=F_FAC.ALMFAC][F_FPA.CODFPA=F_FAC.FOPFAC][F_AGE.CODAGE=F_FAC.AGEFAC]',
	attributes: {
    "YEAR": {
        "columnName": "YEAR",
        "description": "Año de la db factusol",
        "allowNull": false,
        "type": "string",
		"autoMigrations": { index: true }
    },
    "TIPFAC": {
        "columnName": "TIPFAC",
        "defaultsTo": "",
        "description": "Nº de serie",
        "allowNull": false,
        "type": "string",
		"autoMigrations": { index: true }
    },
    "CODFAC": {
        "columnName": "CODFAC",
        "defaultsTo": 0,
        "description": "[F=000000]Código",
        "allowNull": false,
        "type": "number",
		"autoMigrations": { index: true }
    },
    "REFFAC": {
        "columnName": "REFFAC",
        "defaultsTo": "",
        "description": "Referencia",
        "allowNull": true,
        "type": "string"
    },
    "FECFAC": {
        "columnName": "FECFAC",
        "defaultsTo": "",
        "description": "Fecha",
        "allowNull": true,
        "type": "string",
        // "columnType": "DateTime"
    },
    "ESTFAC": {
        "columnName": "ESTFAC",
        "defaultsTo": 0,
        "description": "[L=#0;Pte.#1;Pte. Parcial#2;Cobrada#3;Devuelta#4;Anulada]Estado",
        "allowNull": true,
        "type": "number"
    },
    "ALMFAC": {
        "columnName": "ALMFAC",
        "defaultsTo": "",
        "description": "Almacén",
        "allowNull": true,
        "type": "string"
    },
    "AGEFAC": {
        "columnName": "AGEFAC",
        "defaultsTo": 0,
        "description": "[F=00000]Agente",
        "allowNull": true,
        "type": "number"
    },
    "PROFAC": {
        "columnName": "PROFAC",
        "defaultsTo": "",
        "description": "Proveedor del cliente",
        "allowNull": true,
        "type": "string"
    },
    "CLIFAC": {
        "columnName": "CLIFAC",
        "defaultsTo": 0,
        "description": "[F=00000]Cliente",
        "allowNull": true,
        "type": "number",
		"autoMigrations": { index: true }
    },
    "CNOFAC": {
        "columnName": "CNOFAC",
        "defaultsTo": "",
        "description": "Nombre",
        "allowNull": true,
        "type": "string"
    },
    "CDOFAC": {
        "columnName": "CDOFAC",
        "defaultsTo": "",
        "description": "Domicilio",
        "allowNull": true,
        "type": "string"
    },
    "CPOFAC": {
        "columnName": "CPOFAC",
        "defaultsTo": "",
        "description": "Población",
        "allowNull": true,
        "type": "string"
    },
    "CCPFAC": {
        "columnName": "CCPFAC",
        "defaultsTo": "",
        "description": "Cód. Postal",
        "allowNull": true,
        "type": "string"
    },
    "CPRFAC": {
        "columnName": "CPRFAC",
        "defaultsTo": "",
        "description": "Provincia",
        "allowNull": true,
        "type": "string"
    },
    "CNIFAC": {
        "columnName": "CNIFAC",
        "defaultsTo": "",
        "description": "N.I.F.",
        "allowNull": true,
        "type": "string"
    },
    "TIVFAC": {
        "columnName": "TIVFAC",
        "defaultsTo": 0,
        "description": "[L=#0;Con IVA#1;Sin IVA#2;Intracomunitario#3;Importación]Tipo de IVA",
        "allowNull": true,
        "type": "number"
    },
    "REQFAC": {
        "columnName": "REQFAC",
        "defaultsTo": 0,
        "description": "[L=#No#1;Sí]Recargo de equivalencia",
        "allowNull": true,
        "type": "number"
    },
    "TELFAC": {
        "columnName": "TELFAC",
        "defaultsTo": "",
        "description": "Teléfono",
        "allowNull": true,
        "type": "string"
    },
    "NET1FAC": {
        "columnName": "NET1FAC",
        "defaultsTo": 0,
        "description": "Neto 1",
        "allowNull": true,
        "type": "number"
    },
    "NET2FAC": {
        "columnName": "NET2FAC",
        "defaultsTo": 0,
        "description": "Neto 2",
        "allowNull": true,
        "type": "number"
    },
    "NET3FAC": {
        "columnName": "NET3FAC",
        "defaultsTo": 0,
        "description": "Neto 3",
        "allowNull": true,
        "type": "number"
    },
    "PDTO1FAC": {
        "columnName": "PDTO1FAC",
        "defaultsTo": 0,
        "description": "Porcentaje de descuento 1",
        "allowNull": true,
        "type": "number"
    },
    "PDTO2FAC": {
        "columnName": "PDTO2FAC",
        "defaultsTo": 0,
        "description": "Porcentaje de descuento 2",
        "allowNull": true,
        "type": "number"
    },
    "PDTO3FAC": {
        "columnName": "PDTO3FAC",
        "defaultsTo": 0,
        "description": "Porcentaje de descuento 3",
        "allowNull": true,
        "type": "number"
    },
    "IDTO1FAC": {
        "columnName": "IDTO1FAC",
        "defaultsTo": 0,
        "description": "Importe de descuento 1",
        "allowNull": true,
        "type": "number"
    },
    "IDTO2FAC": {
        "columnName": "IDTO2FAC",
        "defaultsTo": 0,
        "description": "Importe de descuento 2",
        "allowNull": true,
        "type": "number"
    },
    "IDTO3FAC": {
        "columnName": "IDTO3FAC",
        "defaultsTo": 0,
        "description": "Importe de descuento 3",
        "allowNull": true,
        "type": "number"
    },
    "PPPA1FAC": {
        "columnName": "PPPA1FAC",
        "defaultsTo": 0,
        "description": "Porcentaje de pronto pago 1",
        "allowNull": true,
        "type": "number"
    },
    "PPPA2FAC": {
        "columnName": "PPPA2FAC",
        "defaultsTo": 0,
        "description": "Porcentaje de pronto pago 2",
        "allowNull": true,
        "type": "number"
    },
    "PPPA3FAC": {
        "columnName": "PPPA3FAC",
        "defaultsTo": 0,
        "description": "Porcentaje de pronto pago 3",
        "allowNull": true,
        "type": "number"
    },
    "IPPA1FAC": {
        "columnName": "IPPA1FAC",
        "defaultsTo": 0,
        "description": "Importe de pronto pago 1",
        "allowNull": true,
        "type": "number"
    },
    "IPPA2FAC": {
        "columnName": "IPPA2FAC",
        "defaultsTo": 0,
        "description": "Importe de pronto pago 2",
        "allowNull": true,
        "type": "number"
    },
    "IPPA3FAC": {
        "columnName": "IPPA3FAC",
        "defaultsTo": 0,
        "description": "Importe de pronto pago 3",
        "allowNull": true,
        "type": "number"
    },
    "PPOR1FAC": {
        "columnName": "PPOR1FAC",
        "defaultsTo": 0,
        "description": "Porcentaje de portes 1",
        "allowNull": true,
        "type": "number"
    },
    "PPOR2FAC": {
        "columnName": "PPOR2FAC",
        "defaultsTo": 0,
        "description": "Porcentaje de portes 2",
        "allowNull": true,
        "type": "number"
    },
    "PPOR3FAC": {
        "columnName": "PPOR3FAC",
        "defaultsTo": 0,
        "description": "Porcentaje de portes 3",
        "allowNull": true,
        "type": "number"
    },
    "IPOR1FAC": {
        "columnName": "IPOR1FAC",
        "defaultsTo": 0,
        "description": "Importe de portes 1",
        "allowNull": true,
        "type": "number"
    },
    "IPOR2FAC": {
        "columnName": "IPOR2FAC",
        "defaultsTo": 0,
        "description": "Importe de portes 2",
        "allowNull": true,
        "type": "number"
    },
    "IPOR3FAC": {
        "columnName": "IPOR3FAC",
        "defaultsTo": 0,
        "description": "Importe de portes 3",
        "allowNull": true,
        "type": "number"
    },
    "PFIN1FAC": {
        "columnName": "PFIN1FAC",
        "defaultsTo": 0,
        "description": "Porcentaje de financiación 1",
        "allowNull": true,
        "type": "number"
    },
    "PFIN2FAC": {
        "columnName": "PFIN2FAC",
        "defaultsTo": 0,
        "description": "Porcentaje de financiación 2",
        "allowNull": true,
        "type": "number"
    },
    "PFIN3FAC": {
        "columnName": "PFIN3FAC",
        "defaultsTo": 0,
        "description": "Porcentaje de financiación 3",
        "allowNull": true,
        "type": "number"
    },
    "IFIN1FAC": {
        "columnName": "IFIN1FAC",
        "defaultsTo": 0,
        "description": "Importe de financiación 1",
        "allowNull": true,
        "type": "number"
    },
    "IFIN2FAC": {
        "columnName": "IFIN2FAC",
        "defaultsTo": 0,
        "description": "Importe de financiación 2",
        "allowNull": true,
        "type": "number"
    },
    "IFIN3FAC": {
        "columnName": "IFIN3FAC",
        "defaultsTo": 0,
        "description": "Importe de financiación 3",
        "allowNull": true,
        "type": "number"
    },
    "BAS1FAC": {
        "columnName": "BAS1FAC",
        "defaultsTo": 0,
        "description": "Base imponible 1",
        "allowNull": true,
        "type": "number"
    },
    "BAS2FAC": {
        "columnName": "BAS2FAC",
        "defaultsTo": 0,
        "description": "Base imponible 2",
        "allowNull": true,
        "type": "number"
    },
    "BAS3FAC": {
        "columnName": "BAS3FAC",
        "defaultsTo": 0,
        "description": "Base imponible 3",
        "allowNull": true,
        "type": "number"
    },
    "PIVA1FAC": {
        "columnName": "PIVA1FAC",
        "defaultsTo": 0,
        "description": "Porcentaje de impuestos 1",
        "allowNull": true,
        "type": "number"
    },
    "PIVA2FAC": {
        "columnName": "PIVA2FAC",
        "defaultsTo": 0,
        "description": "Porcentaje de impuestos 2",
        "allowNull": true,
        "type": "number"
    },
    "PIVA3FAC": {
        "columnName": "PIVA3FAC",
        "defaultsTo": 0,
        "description": "Porcentaje de impuestos 3",
        "allowNull": true,
        "type": "number"
    },
    "IIVA1FAC": {
        "columnName": "IIVA1FAC",
        "defaultsTo": 0,
        "description": "Importe de impuestos 1",
        "allowNull": true,
        "type": "number"
    },
    "IIVA2FAC": {
        "columnName": "IIVA2FAC",
        "defaultsTo": 0,
        "description": "Importe de impuestos 2",
        "allowNull": true,
        "type": "number"
    },
    "IIVA3FAC": {
        "columnName": "IIVA3FAC",
        "defaultsTo": 0,
        "description": "Importe de impuestos 3",
        "allowNull": true,
        "type": "number"
    },
    "PREC1FAC": {
        "columnName": "PREC1FAC",
        "defaultsTo": 0,
        "description": "Porcentaje de recargo de equivalencia 1",
        "allowNull": true,
        "type": "number"
    },
    "PREC2FAC": {
        "columnName": "PREC2FAC",
        "defaultsTo": 0,
        "description": "Porcentaje de recargo de equivalencia 2",
        "allowNull": true,
        "type": "number"
    },
    "PREC3FAC": {
        "columnName": "PREC3FAC",
        "defaultsTo": 0,
        "description": "Porcentaje de recargo de equivalencia 3",
        "allowNull": true,
        "type": "number"
    },
    "IREC1FAC": {
        "columnName": "IREC1FAC",
        "defaultsTo": 0,
        "description": "Importe de recargo de equivalencia 1",
        "allowNull": true,
        "type": "number"
    },
    "IREC2FAC": {
        "columnName": "IREC2FAC",
        "defaultsTo": 0,
        "description": "Importe de recargo de equivalencia 2",
        "allowNull": true,
        "type": "number"
    },
    "IREC3FAC": {
        "columnName": "IREC3FAC",
        "defaultsTo": 0,
        "description": "Importe de recargo de equivalencia 3",
        "allowNull": true,
        "type": "number"
    },
    "PRET1FAC": {
        "columnName": "PRET1FAC",
        "defaultsTo": 0,
        "description": "Porcentaje de retención",
        "allowNull": true,
        "type": "number"
    },
    "IRET1FAC": {
        "columnName": "IRET1FAC",
        "defaultsTo": 0,
        "description": "Importe de retención",
        "allowNull": true,
        "type": "number"
    },
    "TOTFAC": {
        "columnName": "TOTFAC",
        "defaultsTo": 0,
        "description": "Total",
        "allowNull": true,
        "type": "number"
    },
    "FOPFAC": {
        "columnName": "FOPFAC",
        "defaultsTo": "",
        "description": "Forma de pago",
        "allowNull": true,
        "type": "string"
    },
    "PRTFAC": {
        "columnName": "PRTFAC",
        "defaultsTo": 0,
        "description": "[L=#0;Pagados#1;Debidos]Portes",
        "allowNull": true,
        "type": "number"
    },
    "TPOFAC": {
        "columnName": "TPOFAC",
        "defaultsTo": "",
        "description": "Portes (texto)",
        "allowNull": true,
        "type": "string"
    },
    "OB1FAC": {
        "columnName": "OB1FAC",
        "defaultsTo": "",
        "description": "Línea 1 de observaciones",
        "allowNull": true,
        "type": "string"
    },
    "OB2FAC": {
        "columnName": "OB2FAC",
        "defaultsTo": "",
        "description": "Línea 2 de observaciones",
        "allowNull": true,
        "type": "string"
    },
    "TDRFAC": {
        "columnName": "TDRFAC",
        "defaultsTo": "",
        "description": "Nº de serie documento rectificado",
        "allowNull": true,
        "type": "string"
    },
    "CDRFAC": {
        "columnName": "CDRFAC",
        "defaultsTo": 0,
        "description": "[F=000000]Código del documento rectificado",
        "allowNull": true,
        "type": "number"
    },
    "OBRFAC": {
        "columnName": "OBRFAC",
        "defaultsTo": 0,
        "description": "Código de la dirección de entrega",
        "allowNull": true,
        "type": "number"
    },
    "REPFAC": {
        "columnName": "REPFAC",
        "defaultsTo": "",
        "description": "Remitido por",
        "allowNull": true,
        "type": "string"
    },
    "EMBFAC": {
        "columnName": "EMBFAC",
        "defaultsTo": "",
        "description": "Embalado por",
        "allowNull": true,
        "type": "string"
    },
    "AATFAC": {
        "columnName": "AATFAC",
        "defaultsTo": "",
        "description": "A la antención de",
        "allowNull": true,
        "type": "string"
    },
    "REAFAC": {
        "columnName": "REAFAC",
        "defaultsTo": "",
        "description": "Referencia",
        "allowNull": true,
        "type": "string"
    },
    "PEDFAC": {
        "columnName": "PEDFAC",
        "defaultsTo": "",
        "description": "Nº de su pedido",
        "allowNull": true,
        "type": "string"
    },
    "FPEFAC": {
        "columnName": "FPEFAC",
        "defaultsTo": "#1/1/1900#",
        "description": "Fecha de su pedido",
        "allowNull": true,
        "type": "string",
        // "columnType": "DateTime"
    },
    "COBFAC": {
        "columnName": "COBFAC",
        "defaultsTo": 0,
        "description": "[L=#0;Pendiente#1;Girado]Recibo",
        "allowNull": true,
        "type": "number"
    },
    "CREFAC": {
        "columnName": "CREFAC",
        "defaultsTo": 0,
        "description": "[E]Tipo de creacion",
        "allowNull": true,
        "type": "number"
    },
    "TIRFAC": {
        "columnName": "TIRFAC",
        "defaultsTo": "",
        "description": "[E]Tipo del recibo que se crea a partir de esta factura",
        "allowNull": true,
        "type": "string"
    },
    "CORFAC": {
        "columnName": "CORFAC",
        "defaultsTo": 0,
        "description": "[E]Codigo del recibo que se crea a partir de esta factura",
        "allowNull": true,
        "type": "number"
    },
    "TRAFAC": {
        "columnName": "TRAFAC",
        "defaultsTo": 0,
        "description": "[L=#0;No traspasado#1;Traspasado]Traspasado a contabilidad",
        "allowNull": true,
        "type": "number"
    },
    "VENFAC": {
        "columnName": "VENFAC",
        "defaultsTo": "",
        "description": "[E]Vencimientos de la factura",
        "allowNull": true,
        "type": "string"
    },
    "PRIFAC": {
        "columnName": "PRIFAC",
        "defaultsTo": "",
        "description": "[E]CAMPO PARA ANOTACIONES PRIVADAS DEL DOCUMENTO",
        "allowNull": true,
        "type": "string"
    },
    "ASOFAC": {
        "columnName": "ASOFAC",
        "defaultsTo": "",
        "description": "[E]DOCUMENTOS EXTERNOS ASOCIADOS AL DOCUMENTO.",
        "allowNull": true,
        "type": "string"
    },
    "IMPFAC": {
        "columnName": "IMPFAC",
        "defaultsTo": "''",
        "description": "[E]Impresa",
        "allowNull": true,
        "type": "string"
    },
    "CBAFAC": {
        "columnName": "CBAFAC",
        "defaultsTo": 0,
        "description": "Código del banco auxiliar del cliente",
        "allowNull": true,
        "type": "number"
    },
    "HORFAC": {
        "columnName": "HORFAC",
        "defaultsTo": "",
        "description": "[F=hh:mm]Hora",
        "allowNull": true,
        "type": "string",
        // "columnType": "DateTime"
    },
    "COMFAC": {
        "columnName": "COMFAC",
        "defaultsTo": "",
        "description": "[E]COMENTARIOS PARA IMPRIMIR AL FINAL DE LAS LÍNEAS DE DETALLE",
		"allowNull": true,
		"columnType": "text",
        "type": "string"
    },
    "USUFAC": {
        "columnName": "USUFAC",
        "defaultsTo": 0,
        "description": "Código del usuario que creó el documento",
        "allowNull": true,
        "type": "number"
    },
    "USMFAC": {
        "columnName": "USMFAC",
        "defaultsTo": 0,
        "description": "Código del último usuario que modificó el documento",
        "allowNull": true,
        "type": "number"
    },
    "FAXFAC": {
        "columnName": "FAXFAC",
        "defaultsTo": "",
        "description": "Fax",
        "allowNull": true,
        "type": "string"
    },
    "IMGFAC": {
        "columnName": "IMGFAC",
        "defaultsTo": "",
        "description": "[E]IMAGEN DE LA FACTURA",
        "allowNull": true,
        "type": "string"
    },
    "EFEFAC": {
        "columnName": "EFEFAC",
        "defaultsTo": 0,
        "description": "[E]EFECTIVO COBRADO DE LA FACTURA (PARA TPV)",
        "allowNull": true,
        "type": "number"
    },
    "CAMFAC": {
        "columnName": "CAMFAC",
        "defaultsTo": 0,
        "description": "[E]CAMBIO  DE LA FACTURA",
        "allowNull": true,
        "type": "number"
    },
    "TRNFAC": {
        "columnName": "TRNFAC",
        "defaultsTo": 0,
        "description": "[F=000]Código del transportista",
        "allowNull": true,
        "type": "number"
    },
    "CISFAC": {
        "columnName": "CISFAC",
        "defaultsTo": "",
        "description": "Nº de expedición 1 (transporte)",
        "allowNull": true,
        "type": "string"
    },
    "TRCFAC": {
        "columnName": "TRCFAC",
        "defaultsTo": "",
        "description": "Nº de expedición 2 (transporte)",
        "allowNull": true,
        "type": "string"
    },
    "NET4FAC": {
        "columnName": "NET4FAC",
        "defaultsTo": 0,
        "description": "Neto (Exento de impuestos)",
        "allowNull": true,
        "type": "number"
    },
    "PDTO4FAC": {
        "columnName": "PDTO4FAC",
        "defaultsTo": 0,
        "description": "Porcentaje de descuento (Exento de impuestos)",
        "allowNull": true,
        "type": "number"
    },
    "IDTO4FAC": {
        "columnName": "IDTO4FAC",
        "defaultsTo": 0,
        "description": "Importe de descuento (Exento de impuestos)",
        "allowNull": true,
        "type": "number"
    },
    "PPPA4FAC": {
        "columnName": "PPPA4FAC",
        "defaultsTo": 0,
        "description": "Porcentaje de pronto pago (Exento de impuestos)",
        "allowNull": true,
        "type": "number"
    },
    "IPPA4FAC": {
        "columnName": "IPPA4FAC",
        "defaultsTo": 0,
        "description": "Importe de pronto pago (Exento de impuestos)",
        "allowNull": true,
        "type": "number"
    },
    "PPOR4FAC": {
        "columnName": "PPOR4FAC",
        "defaultsTo": 0,
        "description": "Porcentaje de portes (Exento de impuestos)",
        "allowNull": true,
        "type": "number"
    },
    "IPOR4FAC": {
        "columnName": "IPOR4FAC",
        "defaultsTo": 0,
        "description": "Importe de portes (Exento de impuestos)",
        "allowNull": true,
        "type": "number"
    },
    "PFIN4FAC": {
        "columnName": "PFIN4FAC",
        "defaultsTo": 0,
        "description": "Porcentaje de financiación (Exento de impuestos)",
        "allowNull": true,
        "type": "number"
    },
    "IFIN4FAC": {
        "columnName": "IFIN4FAC",
        "defaultsTo": 0,
        "description": "Importe de financiación (Exento de impuestos)",
        "allowNull": true,
        "type": "number"
    },
    "BAS4FAC": {
        "columnName": "BAS4FAC",
        "defaultsTo": 0,
        "description": "Base (Exenta de impuestos)",
        "allowNull": true,
        "type": "number"
    },
    "EMAFAC": {
        "columnName": "EMAFAC",
        "defaultsTo": 0,
        "description": "[E]Enviado por e-mail",
        "allowNull": true,
        "type": "number"
    },
    "PASFAC": {
        "columnName": "PASFAC",
        "defaultsTo": "",
        "description": "[E]Permisos y contraseña del documento",
        "allowNull": true,
        "type": "string"
    },
    "TPDFAC": {
        "columnName": "TPDFAC",
        "defaultsTo": 0,
        "description": "[E]Ticket, porcentaje de descuento",
        "allowNull": true,
        "type": "number"
    },
    "TIDFAC": {
        "columnName": "TIDFAC",
        "defaultsTo": 0,
        "description": "[E]Ticket, importe de descuento",
        "allowNull": true,
        "type": "number"
    },
    "A1KFAC": {
        "columnName": "A1KFAC",
        "defaultsTo": 0,
        "description": "Código 1KB: Actividad de la factura",
        "allowNull": true,
        "type": "number"
    },
    "CEMFAC": {
        "columnName": "CEMFAC",
        "defaultsTo": "",
        "description": "E-mail de destino",
        "allowNull": true,
        "type": "string"
    },
    "CPAFAC": {
        "columnName": "CPAFAC",
        "defaultsTo": "",
        "description": "País del cliente",
        "allowNull": true,
        "type": "string"
    },
    "BNOFAC": {
        "columnName": "BNOFAC",
        "defaultsTo": "",
        "description": "Nombre del banco",
        "allowNull": true,
        "type": "string"
    },
    "BENFAC": {
        "columnName": "BENFAC",
        "defaultsTo": "",
        "description": "Banco: Entidad",
        "allowNull": true,
        "type": "string"
    },
    "BOFFAC": {
        "columnName": "BOFFAC",
        "defaultsTo": "",
        "description": "Banco: Oficina",
        "allowNull": true,
        "type": "string"
    },
    "BDCFAC": {
        "columnName": "BDCFAC",
        "defaultsTo": "",
        "description": "Banco: DC",
        "allowNull": true,
        "type": "string"
    },
    "BNUFAC": {
        "columnName": "BNUFAC",
        "defaultsTo": "",
        "description": "Banco: Cuenta",
        "allowNull": true,
        "type": "string"
    },
    "TIVA1FAC": {
        "columnName": "TIVA1FAC",
        "defaultsTo": 0,
        "description": "[E]Tipo de iva al que pertenece el neto 1 (0 a 6)",
        "allowNull": true,
        "type": "number"
    },
    "TIVA2FAC": {
        "columnName": "TIVA2FAC",
        "defaultsTo": 0,
        "description": "[E]Tipo de iva al que pertenece el neto 2 (0 a 6)",
        "allowNull": true,
        "type": "number"
    },
    "TIVA3FAC": {
        "columnName": "TIVA3FAC",
        "defaultsTo": 0,
        "description": "[E]Tipo de iva al que pertenece el neto 3 (0 a 6)",
        "allowNull": true,
        "type": "number"
    },
    "RCCFAC": {
        "columnName": "RCCFAC",
        "defaultsTo": 0,
        "description": "Régimen especial del criterio de caja",
        "allowNull": true,
        "type": "number"
    },
    "BIBFAC": {
        "columnName": "BIBFAC",
        "defaultsTo": "",
        "description": "Banco: Código IBAN",
        "allowNull": true,
        "type": "string"
    },
    "BICFAC": {
        "columnName": "BICFAC",
        "defaultsTo": "",
        "description": "Banco: Código BIC",
        "allowNull": true,
        "type": "string"
    },
    "EFSFAC": {
        "columnName": "EFSFAC",
        "defaultsTo": 0,
        "description": "Entregado en segunda forma de pago (para TPV)",
        "allowNull": true,
        "type": "number"
    },
    "EFVFAC": {
        "columnName": "EFVFAC",
        "defaultsTo": 0,
        "description": "Entregado en vales (para TPV)",
        "allowNull": true,
        "type": "number"
    },
    "CIEFAC": {
        "columnName": "CIEFAC",
        "defaultsTo": 0,
        "description": "Factura con impuestos en país de residencia",
        "allowNull": true,
        "type": "number"
    },
    "GFEFAC": {
        "columnName": "GFEFAC",
        "defaultsTo": 0,
        "description": "",
        "allowNull": true,
        "type": "number"
    },
    "TIFFAC": {
        "columnName": "TIFFAC",
        "defaultsTo": 0,
        "description": "",
        "allowNull": true,
        "type": "number"
    },
    "TPVIDFAC": {
        "columnName": "TPVIDFAC",
        "defaultsTo": "''",
        "description": "",
        "allowNull": true,
        "type": "string"
    },
    "TERFAC": {
        "columnName": "TERFAC",
        "defaultsTo": 0,
        "description": "",
        "allowNull": true,
        "type": "number"
    },
    "COPFAC": {
        "columnName": "COPFAC",
        "defaultsTo": 0,
        "description": "",
        "allowNull": true,
        "type": "number"
    },
    "TFIFAC": {
        "columnName": "TFIFAC",
        "defaultsTo": 0,
        "description": "",
        "allowNull": true,
        "type": "number"
    },
    "TFAFAC": {
        "columnName": "TFAFAC",
        "defaultsTo": 0,
        "description": "",
        "allowNull": true,
        "type": "number"
    },
    "TREFAC": {
        "columnName": "TREFAC",
        "defaultsTo": 0,
        "description": "",
        "allowNull": true,
        "type": "number"
    },
    "CVIFAC": {
        "columnName": "CVIFAC",
        "defaultsTo": 0,
        "description": "",
        "allowNull": true,
        "type": "number"
    },
    "DEPFAC": {
        "columnName": "DEPFAC",
        "defaultsTo": 0,
        "description": "",
        "allowNull": true,
        "type": "number"
    },
    "FROFAC": {
        "columnName": "FROFAC",
        "defaultsTo": "#01/01/1900#",
        "description": "",
        "allowNull": true,
        "type": "string",
        // "columnType": "DateTime"
    }
}}
