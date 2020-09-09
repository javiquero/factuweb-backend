/**
    * Route Mappings
    * (sails.config.routes)
    *
    * Your routes tell Sails what to do each time it receives a request.
    *
    * For more information on configuring custom routes, check out:
    * https://sailsjs.com/anatomy/config/routes-js
    */

module.exports.routes = {

    /***************************************************************************
        *                                                                          *
        * Make the view located at `views/homepage.ejs` your home page.            *
        *                                                                          *
        * (Alternatively, remove this and add an `index.html` file in your         *
        * `assets` directory)                                                      *
        *                                                                          *
        ***************************************************************************/

    // '/': { view: 'pages/homepage' },
    // "get /api/users/me": "testController.getuser",
    // "post /api/auth/user": "testController.authuser",
    // "get /api/cart": "testController.getcart",
    // "get /api/settings": "testController.getsettings",

    // "get /api/orders/last": "testController.getLastOrders",


    "post /api/auth/login": "AuthController.login",
    "post /api/auth/relogin": "AuthController.relogin",

    "get /api/models/:model/destroy": "ModelsController.destroyModel",
    "get /api/models/destroy": "ModelsController.destroyAll",
    "get /api/models/list": "ModelsController.getModelsForImport",
    "post /api/db/upload": "ModelsController.uploadSQLITE",



    "post /api/image/upload/:codart": "ImageController.upload",
    "get /api/image/upload/exists": "ImageController.exists",
    "get /api/image/:codart": "ImageController.getImage",
    "get /api/image/150/:codart": "ImageController.getThumb150",
    "get /api/image/1024/:codart": "ImageController.getThumb1024",
    "get /api/image/download/section/:codfam": "ImageController.getDownloadSection",
    "get /api/image/download/photo/:codart": "ImageController.getDownloadPhoto",
	"get /api/image/download/order/:year/:tiplpc/:codlpc": "ImageController.getDownloadOrder",




    "get /api/cart": "CartController.getCart",
    // "post /api/cart/add": "CartController.addCart",
    "post /api/cart/set": "CartController.setCart",
    "post /api/cart/del": "CartController.delCart",
    // "post /api/cart/edit": "CartController.editCart",

	"get /api/catalog": "SqliteController.getCatalog",
	"get /api/catalog/:CODFAM": "SqliteController.getItemsFamily",


    	/***************************************************************************
        *                                                                          *
        * More custom routes here...                                               *
        * (See https://sailsjs.com/config/routes for examples.)                    *
        *                                                                          *
        * If a request to a URL doesn't match any of the routes in this file, it   *
        * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
        * not match any of those, it is matched against static assets.             *
        *                                                                          *
        ***************************************************************************/

};
