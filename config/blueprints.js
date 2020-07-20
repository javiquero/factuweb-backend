/**
 * Blueprint API Configuration
 * (sails.config.blueprints)
 *
 * For background on the blueprint API in Sails, check out:
 * https://sailsjs.com/docs/reference/blueprint-api
 *
 * For details and more available options, see:
 * https://sailsjs.com/config/blueprints
 */
let tablesForSync = require('./custom.js').custom.tables;

module.exports.blueprints = {

  /***************************************************************************
  *                                                                          *
  * Automatically expose implicit routes for every action in your app?       *
  *                                                                          *
  ***************************************************************************/
 prefix: '/api',
  // restPrefix: '/api/',
//   actions: true,
	actions: true,

  /***************************************************************************
  *                                                                          *
  * Automatically expose RESTful routes for your models?                     *
  *                                                                          *
  ***************************************************************************/

   rest: true,


  /***************************************************************************
  *                                                                          *
  * Automatically expose CRUD "shortcut" routes to GET requests?             *
  * (These are enabled by default in development only.)                      *
  *                                                                          *
  ***************************************************************************/

	shortcuts: true,

	parseBlueprintOptions:  function (req) {
		let queryOptions = req._sails.hooks.blueprints.parseBlueprintOptions(req);
		let found = false;
		for (let x = 0; x < tablesForSync.length; x++) {
			if (tablesForSync[x].name.toLowerCase().split("_").join("") == queryOptions.using) {
				found = tablesForSync[x];
				break;
			}
		}
		// tablesForSync.find(element => element.name.toLowerCase().split("_").join("") == queryOptions.using);
		if (found) {
			if (found.client != undefined && req.session.cookie.token != sails.config.custom.APIToken) {
				queryOptions.criteria.where[found.client] = req.session.cookie.client;
			}

			// if (found.index != undefined && req.options.blueprintAction == 'create') {
			// 	let where = {};
			// 	if (found.byYears != undefined && req.body["YEAR"] != undefined) where["YEAR"] = req.body["YEAR"];
			// 	found.index.map(val => where[val] = req.body[val]);
			// 	// for (x = 0; x < found.index.length; x++) {
			// 	// 	where[found.index[x]] = req.body[found.index[x]];
			// 	// }
			// 	// console.log(where);
			// 	await sails.models[queryOptions.using].destroy(where).then(() => {

			// 	}).catch(e => {
			// 		sails.log.error("---ERROR parseBlueprintOptions---")
			// 		sails.log.error(e);
			// 	});
			// 	return queryOptions;

			// } else {
				return queryOptions;
			// }
		} else {
			return queryOptions;
		}
	}

};
