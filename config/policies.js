/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/
	'*': 'auth',
	'auth/login': 'debug',
  	'image/getImage': 'debug',
  	'image/getThumb150': 'debug',
	'image/getThumb1024': 'debug',
	'image/getDownloadPhoto': 'debug',
	'image/getDownloadSection': 'debug',
	'image/getDownloadOrder': 'debug',
	'catalog/getCatalog': 'debug',
	'catalog/getItemsFamily': 'debug',
	'catalog/getCatalogSummary': 'debug',
	'product/getSearchResults': 'debug',
	'company/getInfo': 'debug',
	'navicat/request': 'debug',
};
