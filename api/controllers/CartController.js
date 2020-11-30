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
	_sendEmailOrder(_order, comments, infoClient, orderId) {
		return new Promise(async (resolve, reject) =>{
			let body = `<style>
			* {
				font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
			}
			table tfoot tr:last-child td:first-child {
				border-bottom-left-radius: 5px;
			}
			table tfoot tr:last-child td:last-child {
				border-bottom-right-radius: 5px;
			}
			table thead tr:first-child td:first-child {
				border-top-left-radius: 3px;
			}
			table thead tr:first-child td:last-child {
				border-top-right-radius: 3px;
			}
			#table-order {
				border-collapse:collapse;
				border: none;
				width:100%;
			}
			#table-order thead td{
				padding: 10px 20px;
			}
			#table-order thead tr, #table-order tfoot tr{
				width:100%; background-color: rgba(0, 0, 0, 0.7); color:white; font-weight: bold;
			}
			#table-order tbody tr   {
				border-left: 1px solid rgba(0, 0, 0, 0.3);
				border-right: 1px solid rgba(0, 0, 0, 0.3);
			}
			#table-order  td{
				padding: 5px 10px;
			}
			#table-order tbody tr:nth-child(even) td{
				background-color:  rgba(0, 0, 0, 0.05);
			}
		</style>
		<table id="table-order">
			<thead>
				<tr >
					<td >
						Código
					</td>
					<td>
						Cant.
					</td>
					<td>
						Descripción
					</td>
					<td>
						Modelo
					</td>
				</tr>
			</thead>
			<tbody>`;
			for (let i = 0; i < _order.length; i++) {
				let orderLine = _order[i];
				body += `<tr>
					<td>
						${orderLine.CODART}
					</td>
					<td>
						${orderLine.qty}
					</td>
					<td>
						${orderLine.DESART}
					</td>
					<td>
						${orderLine.CE1ART}
					</td>
				</tr>`;

			}

			body += `</tbody>
				<tfoot>
					<tr>
						<td colspan=4>
							Comentarios: <br>
							<div style="padding: 10px;">
								${comments}
							</div>
						</td>
					</tr>
				</tfoot>
			</table>`;

			body = await sails.controllers.client.formatEmail(body, infoClient);
			try {
				let smail = await sails.controllers.client._sendEmail(body, undefined, 'jquero@exclusivas2r.com', "🛒 Pedido desde la web. (" + orderId + ")");
				return resolve(smail);
			} catch (error) {
				sails.log.error(error)
				return reject(error);
			}
		});
	},
	async finalize(req, res) {
		let comments = req.param("comments", '');
		if (!req.session.cookie.token) return res.notFound();

		try {
			let _cart = await cartController._getCart(req.session.cookie.client);
			let today = new Date();
			let date =  today.getDate()+"/"+ (today.getMonth() + 1) + "/" + today.getFullYear();
			let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
			let ID = await Data.execute("INSERT INTO orders ('CODCLI', 'DATA', 'FECHA', 'HORA', 'STATUS', 'COMENTARIOS') VALUES (?,?,?,?,?,?);", [req.session.cookie.client, JSON.stringify(_cart.items), date, time, 1, comments]);

			let inf = await sails.controllers.client._getInfoClient(req.session.cookie.client);
			await cartController._sendEmailOrder(_cart.items, comments, inf, ID);
			await Data.execute("DELETE FROM cart WHERE CODCLI=?;", [req.session.cookie.client]);
			return res.json(cartController._emptyCart())
		} catch (error) {
			sails.log.error(error);
			return res.serverError(error);
		}
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
