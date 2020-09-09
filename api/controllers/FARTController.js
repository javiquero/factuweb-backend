
/**
* FART.js
*
* @description :: F_ART controller imported from Access factusol database at 29/5/2020 12:23:54.
* @docs        :: http://sailsjs.org/#!documentation/controllers
*/

const { find } = require('./FFACController');

var actionUtil = require('sails/lib/hooks/blueprints/actionUtil'),
  _ = sails.lodash;

let FARTController = {
	 _getPrice(codcli, codart, infclient) {
		return new Promise(async (resolve, reject) => {

			let response = { dto:0, price: 0, clientPrice: 0 }

			let infcli = infclient || await FCLI.findOne({ CODCLI: codcli });
			if (infcli) {

				let preart = await FLTA.find({ ARTLTA: codart }).sort('TARLTA ASC');
				let t = 0;
				if (preart && preart.length > 0) {
					while (preart[t]['PRELTA'] >= 100000 && t<preart.length ) {
						t++;
					}

					response.price = preart[t]['PRELTA']
					response.clientPrice = preart[t]['PRELTA']

					if (infcli["TARCLI"] != preart[t]['TARLTA']) {
						// Tarifa Cliente
						let ind = preart.findIndex((element) => element['TARLTA'] == infcli["TARCLI"]);
						response.clientPrice = ind > -1 ? preart[ind]["PRELTA"] : preart[t]['PRELTA'];
						if (response.clientPrice >= 100000) response.clientPrice = preart[t]['PRELTA']

					} else {
						// Tarifa defecto
						response.clientPrice = preart[t]['PRELTA']
					}
				}

				// Descuentos ficha cliente
				if (infcli["DP1CLI"] && infcli["DP1CLI"] != 0) response.clientPrice -= (infcli['DP1CLI'] / 100) * response.clientPrice;
				if (infcli["DP2CLI"] && infcli["DP2CLI"] != 0) response.clientPrice -= (infcli['DP2CLI'] / 100) * response.clientPrice;
				if (infcli["DP3CLI"] && infcli["DP3CLI"] != 0) response.clientPrice -= (infcli['DP3CLI'] / 100) * response.clientPrice;

				let prc = await FPRC.findOne({ CLIPRC: codcli, ARTPRC: codart });
				if (prc) {
					// Precios/Descuentos especiales
					if (prc['TIPPRC'] == 0) {
						response.clientPrice = prc['PREPRC'];
					} else {
						response.clientPrice -= (prc['PREPRC'] / 100) * response.clientPrice;
					}
				}

				if ((response.clientPrice - response.price)!=0)
				response.dto = Math.ceil(((response.price - response.clientPrice) / response.price) * 100);

				return resolve(response);
			} else {
				return reject("Inválid codcli");
			}
		});
	},
	async findOne(req, res) {
		if (!req.session.cookie.token) return res.forbidden();

		let codart = req.param("id", undefined);
		if (!codart) return res.badRequest();

		let art = await FART.find({ CODART: codart });
		if (!art || art.length < 1) return res.json({});

		let response = art[0];
		if (req.session.cookie.client!=undefined) {
			response.price = await FARTController._getPrice(req.session.cookie.client, codart);
		}
		return res.json(response);
	},
	async find(req, res) {
		if (!req.session.cookie.token) return res.forbidden();

		let where = req.param("where", req.allParams());

		let limit = req.param("limit", 10000);
		let sort = req.param("sort", 'id');
		let skip = req.param("skip", 0);

		delete where.limit;
		delete where.sort;
		delete where.skip;

		if (typeof where === 'string') where = JSON.parse(where);

		let arts = await FART.find(where).limit(limit).sort(sort).skip(skip);

		if (req.session.cookie.token == sails.config.custom.token) {
			return res.send(arts);
		 } else {
			if (req.session.cookie.client != undefined) {
				let infcli = await FCLI.findOne({ CODCLI: req.session.cookie.client });
				await Promise.all(arts.map(async (item) => {
					item.price = await FARTController._getPrice(req.session.cookie.client, item['CODART'], infcli);
				}));
				return res.send(arts);
			} else {
				return res.forbidden()
			}
		}
	},


	findPRuebas (req, res) {
		if (!req.session.cookie.token) return res.forbidden();

		var Model = actionUtil.parseModel(req);
		if (actionUtil.parsePk(req)) {
			return require('sails/lib/hooks/blueprints/actions/findOne')(req, res);
		}

		var queryData = Model.find()
			.where(actionUtil.parseCriteria(req))
			.limit(actionUtil.parseLimit(req))
			.skip(actionUtil.parseSkip(req))
			.sort(actionUtil.parseSort(req));

		// queryData = actionUtil.populateEach(queryData, req);

		var queryCount = Model.count().where(actionUtil.parseCriteria(req));

		// Expose header to the client
		res.set('Access-Control-Expose-Headers', 'X-Total-Count');



		let getTotalCount= new Promise((resolve, reject) =>{
				queryCount.exec(function (err, count) {
					return resolve(count);
				});
			});


		let getData = new Promise((resolve, reject) =>{
				queryData.exec(function found(err, matchingRecords) {
					if (err) return res.serverError(err);
					// Only `.watch()` for new instances of the model if
					// `autoWatch` is enabled.
					if (req._sails.hooks.pubsub && req.isSocket) {
						Model.subscribe(req, matchingRecords);
						if (req.options.autoWatch) {
							Model.watch(req);
						}
						// Also subscribe to instances of all associated models
						_.each(matchingRecords, function (record) {
							actionUtil.subscribeDeep(req, record);
						});
					}

					return resolve( matchingRecords);
				});
			})


		Promise.all([getData, getTotalCount]).then(values => {
			res.set('X-Total-Count', values[0]);
			res.ok(values[1]);
		  }, reason => {
			console.log(reason)
		  });

	}







}
if (!sails.controllers) sails.controllers = {};
sails.controllers.FART = FARTController;
module.exports = FARTController;
