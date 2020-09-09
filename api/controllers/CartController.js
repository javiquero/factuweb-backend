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
				_cart = await Cart.find({ CODCLI: codcli });
				if (_cart && _cart.length > 0) return resolve({ items: _cart[0].items });
				return resolve(cartController._emptyCart())
			} catch (error) {
				return resolve(cartController._emptyCart())
			}
		});
	},
	_itemInCart(_cart, codart, type=0) {
		return new Promise((resolve) => {
			for (const [index, element] of _cart.items.entries()) {
				if (element.CODART == codart && element.type == type) return resolve( index );
			}
			return resolve( -1 )
			// let found = _cart.items.findIndex(element => (element.CODART == codart && element.type == type));
			// return resolve( found )
		});
	},
	getCart: async (req, res)=> {
		if (!req.session.cookie.token) return res.notFound();

		_cart = await cartController._getCart(req.session.cookie.client);
		return res.json(_cart);
	},

	async setCart(req, res) {
		if (!req.session.cookie.token) return res.notFound();

		let item = req.param("item", undefined);
		let qty = req.param("qty", 0);

		if (!item) return res.badRequest();
		_cart = await cartController._getCart(req.session.cookie.client);

		let foundIndex = await cartController._itemInCart(_cart, item.CODART, item.type || 0);
		if ( foundIndex > -1) {
			if (qty > 0) {
				// UPDATE ELEMENT
				 sails.log.debug("ITEM CART UPDATE");
				_cart.items[foundIndex].qty = qty;
			} else {
				// REMOVE ELEMENT QTY=0
				sails.log.debug("ITEM CART REMOVE", qty);
				_cart.items.splice(foundIndex, 1);
			}
		} else {
			//INSERT ELEMENT
			if (qty > 0) {
				sails.log.debug("ITEM CART INSERT");
				item.qty = qty;
				_cart.items.push(item);
			}
		}
		await Cart.destroy({ CODCLI: req.session.cookie.client });
		await Cart.create({ CODCLI: req.session.cookie.client, items: _cart.items });
		return res.json(_cart);
	},

	async delCart(req, res) {
		if (!req.session.cookie.token) return res.notFound();

		await Cart.destroy({ CODCLI: req.session.cookie.client });
		return res.json(cartController._emptyCart())
	},
	editCart(req, res) {
		if (!req.session.cookie.token) return res.notFound();

	},


}
module.exports = cartController;
