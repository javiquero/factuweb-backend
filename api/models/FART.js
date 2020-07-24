
/**
*
* FART.js
*
* @description :: F_ART model imported from Access factusol database at 29/5/2020 12:23:54.
* @docs        :: http://sailsjs.org/#!documentation/models
*
*/

module.exports = {
	tableName: 'F_ART',
	description: 'Artículos[F_PRO.CODPRO = F_ART.PHAART][F_FAM.CODFAM  = F_ART.FAMART][F_FTE.CODFTE = F_ART.FTEART][F_LTA.ARTLTA=F_ART.CODART][F_STO.ARTSTO=F_ART.CODART][F_LPA.ARTLPA=F_ART.CODART][F_COM.CODCOM=F_ART.CODART][F_EAN.ARTEAN=F_ART.CODART]',
	attributes: {
		"CODART": {
			"columnName": "CODART",
			"defaultsTo": "",
			"description": "Código",
			"allowNull": false,
			"type": "string",
			"autoMigrations": { index: true }
		},
		"EQUART": {
			"columnName": "EQUART",
			"defaultsTo": "",
			"description": "Equivalente",
			"allowNull": true,
			"type": "string"
		},
		"FAMART": {
			"columnName": "FAMART",
			"defaultsTo": "",
			"description": "Familia",
			"allowNull": true,
			"type": "string"
		},
		"DESART": {
			"columnName": "DESART",
			"defaultsTo": "",
			"description": "Descripcion general",
			"allowNull": true,
			"type": "string"
		},
		"TIVART": {
			"columnName": "TIVART",
			"defaultsTo": 0,
			"description": "[L=#0;IVA1AUT#1;IVA2AUT#2;IVA3AUT#3;Exento]Tipo de IVA",
			"allowNull": true,
			"type": "number"
		},
		"UELART": {
			"columnName": "UELART",
			"defaultsTo": 0,
			"description": "Unidades en línea",
			"allowNull": true,
			"type": "number"
		},
		"UPPART": {
			"columnName": "UPPART",
			"defaultsTo": 0,
			"description": "Unidades por palets",
			"allowNull": true,
			"type": "number"
		},
		"DIMART": {
			"columnName": "DIMART",
			"defaultsTo": "",
			"description": "Dimensiones",
			"allowNull": true,
			"type": "string"
		},
		"OBSART": {
			"columnName": "OBSART",
			"defaultsTo": "",
			"description": "Observaciones",
			"allowNull": true,
			"type": "string",
			"columnType": "text"
		},
		"DLAART": {
			"columnName": "DLAART",
			"defaultsTo": "",
			"description": "Descripción larga",
			"allowNull": true,
			"type": "string"
		},
		"IPUART": {
			"columnName": "IPUART",
			"defaultsTo": 0,
			"description": "Importe de portes por unidad",
			"allowNull": true,
			"type": "number"
		},
		"CANART": {
			"columnName": "CANART",
			"defaultsTo": 0,
			"description": "Cantidad por defecto en las salidas",
			"allowNull": true,
			"type": "number"
		},
		"IMGART": {
			"columnName": "IMGART",
			"defaultsTo": "",
			"description": "[E]Imagen",
			"allowNull": true,
			"type": "string"
		},
		"SUWART": {
			"columnName": "SUWART",
			"defaultsTo": 0,
			"description": "[E]Subir a internet",
			"allowNull": true,
			"type": "number"
		},
		"DEWART": {
			"columnName": "DEWART",
			"defaultsTo": "",
			"description": "[E]Descripción web",
			"allowNull": true,
			"type": "string",
			"columnType": "text"
		},
		"IMWART": {
			"columnName": "IMWART",
			"defaultsTo": "",
			"description": "[E]Imagen web",
			"allowNull": true,
			"type": "string"
		},
		"PESART": {
			"columnName": "PESART",
			"defaultsTo": 0,
			"description": "Peso",
			"allowNull": true,
			"type": "number"
		},
		"UMEART": {
			"columnName": "UMEART",
			"defaultsTo": 0,
			"description": "Unidad de medida",
			"allowNull": true,
			"type": "number"
		},
		"DE1ART": {
			"columnName": "DE1ART",
			"defaultsTo": "",
			"description": "Primera descripción auxiliar",
			"allowNull": true,
			"type": "string"
		},
		"DE2ART": {
			"columnName": "DE2ART",
			"defaultsTo": "",
			"description": "Segunda descripción auxiliar",
			"allowNull": true,
			"type": "string"
		},
		"DE3ART": {
			"columnName": "DE3ART",
			"defaultsTo": "",
			"description": "Tercera descripción auxiliar",
			"allowNull": true,
			"type": "string"
		},
		"DFIART": {
			"columnName": "DFIART",
			"defaultsTo": 0,
			"description": "% Descuento fijo en ventas",
			"allowNull": true,
			"type": "number"
		},
		"DSCART": {
			"columnName": "DSCART",
			"defaultsTo": 0,
			"description": "",
			"allowNull": true,
			"type": "number"
		},
		"EANART": {
			"columnName": "EANART",
			"defaultsTo": "",
			"description": "",
			"allowNull": true,
			"type": "string"
		},
		"ORDART": {
			"columnName": "ORDART",
			"defaultsTo": 999999,
			"description": "",
			"allowNull": true,
			"type": "number"
		},
	},
	customToJSON: function() {
		return _.omit(this, ['createdAt', 'updatedAt'])
	  }

	// customToJSON: function() {
	// 	let ind = sails.config.custom.tables.findIndex(el => el.name == "F_ART");
	// 	if (ind > -1) {
	// 		if (typeof sails.config.custom.tables(ind).customToJSON === "function") {
	// 			return sails.config.custom.tables(ind).customToJSON(this);
	// 		}
	// 	}
	// 	return this;
	//   }

}
