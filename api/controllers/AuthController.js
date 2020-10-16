/**
    * AuthController
    *
    * @description :: Server-side actions for handling incoming requests.
    * @help        :: See https://sailsjs.com/docs/concepts/actions
    */

module.exports = {
	_config: {
		actions: false,
		shortcuts: false,
		rest: false
	},
   async login(req, res) {
        let client = req.param("client", undefined);
        let nif = req.param("nif", undefined);

        if (!client || !nif)
            return res.status(401).send("Código de cliente y nif son obligatorios ó no son válidos");

			c = await Db.findOne("SELECT * FROM F_CLI WHERE CODCLI="+client+";")
            if (!c) return res.status(401).send("Código de cliente y nif son obligatorios ó no son válidos");
            if (c["NIFCLI"].replace(/[^A-Za-z0-9\s]+/, '').toLowerCase() != nif.replace(/[^A-Za-z0-9\s]+/, '').toLowerCase()) return res.status(401).send("Código de cliente y nif son obligatorios ó no son válidos");

            TokenService.create(c.CODCLI).then(token => {
                return res.json({
                    token: token,
                    user: {
						CODCLI: c.CODCLI,
						NOFCLI: c.NOFCLI,
                        NOCCLI: c.NOCCLI
                    }
                });
            }).catch(err => {
                sails.log.error("AuthController.login", err);
                return res.status(500).send("Internal server error");
            })


    },
	relogin(req, res) {
		if (!req.session.cookie.token) return res.forbidden();
        FCLI.findOne({
            CODCLI: req.session.cookie.client
        }).then(c => {
            if (!c) return res.forbidden();
            return res.json({
                token: req.session.cookie.token,
                user: {
					CODCLI: c.CODCLI,
					NOFCLI: c.NOFCLI,
                    NOCCLI: c.NOCCLI
                }
            });
        }).catch(err => {
            sails.log.error("AuthController.relogin", err);
            return res.status(500).send("Internal server error");
        })
    }

};
