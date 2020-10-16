/**
    * Custom configuration
    * (sails.config.custom)
    *
    * One-off settings specific to your application.
    *
    * For more information on custom configuration, visit:
    * https://sailsjs.com/config/custom
    */

module.exports.custom = {

    /***************************************************************************
        *                                                                          *
        * Any other custom config this Sails app should use during development.    *
        *                                                                          *
        ***************************************************************************/
    tables: [{
		name: "F_ART",
		cols: ["CODART", "EQUART", "FAMART", "DESART", "TIVART", "UELART", "UPPART", "DIMART", "OBSART", "DLAART", "IPUART", "CANART", "IMGART", "SUWART", "DSCART", "DEWART", "IMWART", "PESART", "UMEART", "DE1ART", "DE2ART", "DE3ART", "DFIART", "EANART", "ORDART"],
		index: ["CODART"]
	}, {
		name: "F_FPA",
		cols:["CODFPA", "DESFPA"],
		index: ["CODFPA"]
	}, {
		name: "F_TAR",
		cols:["CODTAR", "DESTAR"],
		index: ["CODTAR"]
    }, {
		name: "F_LTA",
		index: ["TARLTA", "ARTLTA"]
	}, {
		name: "F_ARC",
		index: ["ARTARC", "CE1ARC"]
		}, {

		name: "F_CE1",
		index: ["CODCE1", "DESCE1"]
	}, {
		name: "F_IMG",
		index: ["CODIMG", "ARTIMG", "IMGIMG", "SUWIMG", "FAMIMG", "ORDIMG", "CE1IMG"]
	}, {
		name: "F_SEC",
		cols: ["CODSEC", "DESSEC", "SUWSEC", "IMASEC", "ORDSEC"],
		index: ["CODSEC"]
    }, {
		name: "F_FAM",
		cols: ["CODFAM", "DESFAM", "SECFAM", "TEXFAM", "SUWFAM", "IMAFAM", "ORDFAM"],
		index: ["CODFAM"]
    }, {
		name: "F_PRC",
			client: "CLIPRC",
			index: ["CLIPRC" , "ARTPRC"]
    }, {
		name: "F_OBR",
		cols: ["CLIOBR", "CODOBR", "NOMOBR","DIROBR", "POBOBR", "CPOOBR", "PROOBR", "TELOBR", "PCOOBR", "EMAOBR"],
		index: ["CLIOBR, CODOBR"],
		client: "CLIOBR"
    }, {
		name: "F_CLI",
		cols:["CODCLI","NIFCLI","NOFCLI","NOCCLI","CPOCLI", "DOMCLI","POBCLI","PROCLI","TELCLI","FAXCLI","PCOCLI","AGECLI","BANCLI","ENTCLI","OFICLI","DCOCLI","CUECLI","FPACLI","TARCLI","DT1CLI","DT2CLI","DT3CLI", "TPOCLI", "IVACLI", "TIVCLI", "REQCLI", "EMACLI", "PAICLI", "SWICLI", "SUWCLI", "MEWCLI"],
		index: ["CODCLI"],
		client: "CODCLI"
    }, {
		name: "F_STO",
		cols :["ARTSTO", "ALMSTO", "ACTSTO", "DISSTO", "MINSTO"],
		index: ["ARTSTO", "ALMSTO"]
    }, {
		name: "F_AGE",
		cols:["CODAGE", "TEMAGE", "EMAAGE", "NOMAGE"],
		index: ["CODAGE"]
    }, {
        name: "F_PCL",
		index: ["TIPPCL","CODPCL"],
		byYears: 1,
		client: "CLIPCL"
	}, {
		name: "F_LPC",
		cols:["TIPLPC", "CODLPC","POSLPC","ARTLPC", "DESLPC", "CANLPC", "DT1LPC", "DT2LPC", "DT3LPC", "PRELPC", "TOTLPC", "PENLPC", "IVALPC", "DOCLPC", "DTPLPC", "DCOLPC", "MEMLPC", "PIVLPC", "TIVLPC", "CE1LPC", "CE2LPC", "IMALPC", "SUMLPC", "ANULPC"],
		index: ["TIPLPC", "CODLPC", "POSLPC"],
        byYears: 1
	}, {
		name: "F_FAC",
		index: ["TIPFAC","CODFAC"],
		byYears: 1,
		client: "CLIFAC"
	}, {
		name: "F_LFA",
		index: ["TIPLFA", "CODLFA", "POSLFA"],
		byYears: 1
	}]

};


