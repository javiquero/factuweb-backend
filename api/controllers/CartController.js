const Data = require("../services/Data");

let cartController = {
	_config: {
		actions: false,
		shortcuts: false,
		rest: false
	},
	_emptyCart() {
		return { items: [] };
	},
	_getCart: async function  (codcli){
		return new Promise(async (resolve) =>{
			try {
				_cart = await Data.find("SELECT * from cart WHERE CODCLI=?;", [codcli]);
				if (_cart && _cart.length > 0) return resolve({ items: JSON.parse(_cart[0].items) });
				return resolve(cartController._emptyCart())
			} catch (error) {
				return resolve(cartController._emptyCart())
			}
		});
	},
	_itemInCart(_cart, codart, ce1art, type=0) {
		return new Promise((resolve) => {
			// for (const [index, element] of _cart.items.entries()) {
			// 	if (element.CODART == codart && element.type == type) return resolve( index );
			// }
			// return resolve( -1 )
			let found = _cart.items.findIndex(element => (element.CODART == codart && element.CE1ART == ce1art && element.type == type));
			return resolve( found )
		});
	},
	getCart: async (req, res)=> {
		if (!req.session.cookie.token) return res.notFound();
		_cart = await cartController._getCart(req.session.cookie.client);
		_cart = await cartController._testCart(_cart);
		await Data.execute("REPLACE INTO cart (CODCLI, items) VALUES (?,?)", [req.session.cookie.client, JSON.stringify(_cart.items)]);
		return res.json(_cart);
	},
	async _testCart(_cart) {
		return new Promise(async (resolve, reject) => {
			let cart = { items: [], outOfCart: [] };
			await Promise.all(_cart.items.map(async item => {
				let info = await Db.findOne("SELECT CODART, DESART, DIMART, OBSART, CODART AS IMGART, PESART, EANART, UELART, UPPART, DEWART, DLAART, FAMART, SUWART, '' as CODCE1, '' as CE1ART FROM F_ART WHERE CODART=? AND SUWART=1;", [item.CODART]);
				if (info != undefined) {
					cart.items.push(item);
				} else {
					cart.outOfCart.push(item);
				};
			}))
			return resolve(cart);
		});
	},
	async setCart(req, res) {
		if (!req.session.cookie.token) return res.notFound();

		let item = req.param("item", undefined);
		let add = req.param("add", undefined);
		let qty = req.param("qty", 0);

		if (!item) return res.badRequest();
		_cart = await cartController._getCart(req.session.cookie.client);

		let foundIndex = await cartController._itemInCart(_cart, item.CODART, item.CE1ART,item.type || 0);
		if ( foundIndex > -1) {
			if (qty > 0) {
				// UPDATE ELEMENT
				// sails.log.debug("ITEM CART UPDATE");
				if (add != undefined) {
					_cart.items[foundIndex].qty += qty;
				} else {
					_cart.items[foundIndex].qty = qty;
				}
			} else {
				// REMOVE ELEMENT QTY=0
				// sails.log.debug("ITEM CART REMOVE", qty);
				_cart.items.splice(foundIndex, 1);
			}
		} else {
			//INSERT ELEMENT
			if (qty > 0) {
				// sails.log.debug("ITEM CART INSERT");
				item.qty = qty;
				_cart.items.push(item);
			}
		}
		// await Data.execute("DELETE FROM cart WHERE CODCLI=?", [req.session.cookie.client])
		// await Cart.destroy({ CODCLI: req.session.cookie.client });
		// await Data.execute("INSERT INTO cart (CODCLI, items) VALUES (?,?)", [req.session.cookie.client, JSON.stringify(_cart.items)])

		await Data.execute("REPLACE INTO cart (CODCLI, items) VALUES (?,?)", [req.session.cookie.client, JSON.stringify(_cart.items)])
		return res.json(_cart);
	},

	async delCart(req, res) {
		if (!req.session.cookie.token) return res.notFound();

		await Data.execute("DELETE FROM cart WHERE CODCLI=?;", [req.session.cookie.client]);
		return res.json(cartController._emptyCart())
	},
	editCart(req, res) {
		if (!req.session.cookie.token) return res.notFound();

	},


}

if (!sails.controllers) sails.controllers = {};
sails.controllers.cart = cartController;
module.exports = cartController
