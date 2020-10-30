
const fs = require('fs');
const Database = require('sqlite-async');

let navicatController = {
	async request(req, res) {
		let q = req.param("q[]", []);
		let actn = req.param("actn", '');
		let dbfile = req.param("dbfile", '');
		let encodeBase64 = req.param("encodeBase64", undefined);
		// sails.log.debug(req.allParams());
		if (!Array.isArray(q)) {
			let temp = [];
			temp.push(q);
			q = temp;
		}

		res.set('Content-Type', 'text/plain; charset=x-user-defined');
		// res.set('Transfer-Encoding', 'chunked');
		res.charset="x-user-defined";

		if (actn == '' || dbfile == '') {
			let r = await navicatController.EchoHeader(202);
			r += await navicatController.GetBlock("invalid parameters");
			res.write(Buffer.from(r, 'binary'))
			return res.end();
		}

		if (encodeBase64) {
			let new_q = [];
			for (let i = 0; i < q.length; i++) {
				var buf = Buffer.from(q[i], 'base64');
				new_q.push( buf.toString('ascii') );
			}
			q = new_q;
		}

		let status = "FileDoesNotExist";
		try {
			if (fs.existsSync(process.cwd() + "/" + dbfile)) {
				status = "FileExist";
			}
		} catch(err) {
			console.error(err)
			status = "FileCannotBeOpened";
		}

		if (actn == "2" || actn == "3") {
			if (status == "FileDoesNotExist") {
				if (actn == "3")
					navicatController.SQLite3(actn, dbfile, q).then(async r => {
						res.write(Buffer.from(r, 'binary'))
						return res.end();
					}).catch(async err => {
						let h = await navicatController.EchoHeader(202);
						res.write(Buffer.from(h + await navicatController.GetBlock(err), 'binary'))
						return res.end();
					})
			} else {
				let h = await navicatController.EchoHeader(202);
				res.write(Buffer.from(h+await navicatController.GetBlock('Datbase file exists already'), 'binary'))
				return res.end();
			}
		} else {
			let _h;
			switch (status) {
				case "FileDoesNotExist":
					_h = await navicatController.EchoHeader(202);
					res.write(Buffer.from(_h + await navicatController.GetBlock('Database file does not exist'), 'binary'))
					return res.end();
					break;
				case "FileCannotBeOpened":
					_h = await navicatController.EchoHeader(202);
					res.write(Buffer.from(_h + await navicatController.GetBlock('Database file cannot be opened'), 'binary'))
					return res.end();
					break;
				case "FileExist":
					navicatController.SQLite3(actn, dbfile, q).then(r => {
						res.write(Buffer.from(r, 'binary'));
						return res.end();
					}).catch(async err => {
						_h = await navicatController.EchoHeader(202);
						res.write(Buffer.from(_h + await navicatController.GetBlock(err), 'binary'))
						return res.end();
					})
					break;
			}
		}
	},
	SQLite3(action, path, queries) {
		return new Promise((resolve, reject) =>{
			Database.open(process.cwd() + "/" + path, Database.OPEN_READWRITE).then(async db => {
				if (action == "C") {
					let c = await navicatController.EchoHeader(0) + await navicatController.EchoConnInfo3(db);
					return resolve(c);
				} else if (action == "3") {
					db.run("VACUUM");
					let c = await navicatController.EchoHeader(0) + await navicatController.EchoConnInfo3(db);
					return resolve(c);
				} else if (action == "Q") {
					let resp = "";
					for (let i = 0; i < queries.length; i++) {
						let query = queries[i];
						if (query == "") continue;
						// sails.log.info("Query", query);

						let errno = 0;
						let affectedrows = 0;
						let insertid = 0;
						let numfields = 0;
						let numrows = 0;

						let rows
						try {
							rows = await db.run(query);
							insertid = rows.lastID;
							affectedrows = rows.changes;
							if (insertid == 0 && affectedrows == 0) {
								rows = await db.all(query);
								numrows = rows.length;
								if (rows.length > 0) {
									numfields = Object.keys(rows[0]).length;
								}
							}

						} catch (error) {
							sails.log.error(error);
							errno = "999";
						}

						resp += await navicatController.EchoResultSetHeader(errno, affectedrows, insertid, numfields, numrows);

						if (errno != 0) {
							resp += await navicatController.GetBlock("Error en la query");
						}else {
							if (numfields > 0) {
								resp += await navicatController.EchoFieldsHeader3(rows, numfields);
								resp += await navicatController.EchoData3(rows);
							} else {
								resp += await navicatController.GetBlock("");
							}
						}

						if (i < queries.length - 1) {
							resp += "\x01";
						} else {
							resp += "\x00";
						}
					}

					 resp = await navicatController.EchoHeader(0) + resp;
					return resolve(resp)
				}
			}).catch(err => {
				sails.log.error(err)
				return reject(err);
			})
		});
	},
	show(str) {
		asciiKeys = [];
		for (var i = 0; i < str.length; i ++)
			asciiKeys.push(str[i].charCodeAt(0));

		for (const key of  asciiKeys.keys()) {
			console.log((key+1) + " => " + asciiKeys[key]);
		}
	},
	EchoData3(rows) {
		 return new Promise(async (resolve, reject) =>{
			 let str = "";
			 for (let i = 0; i < rows.length; i++) {
				 for (var col in rows[i]) {
					if (rows[i][col] == null) {
						sails.log.error("OJO VALOR NULL")
						str += "\xFF";
					} else {
						if (rows[i][col] == "C:\\Users\\jquero\\Desktop\\factuweb\\backend\\data.sqlite") {
							rows[i][col] = "/var/www/data.sqlite";
						}
						str += await navicatController.GetBlock(rows[i][col].toString());
					}
					let t;
					if (typeof rows[i][col] === 'number') {
						// sails.log.debug("num");
						str+= await navicatController.GetLongBinary(1);
					} else {
						// sails.log.debug("string");
						str += await navicatController.GetLongBinary(3);
					}


				 }
			 }
			return resolve(str);
		 });

	},
	EchoFieldsHeader3(rows, numfields) {
		return new Promise(async (resolve, reject) =>{
			str = "";
			clNames = Object.keys(rows[0]);
			for ( let i = 0; i < numfields; i++ ) {
				str += await navicatController.GetBlock(clNames[i]);
				str += await navicatController.GetBlock("");

				type = 5;
				length = 0;
				flag = 0;

				str += await navicatController.GetLongBinary(type);
				str += await navicatController.GetLongBinary(flag);
				str += await navicatController.GetLongBinary(length);
			}

			return resolve(str);
		});
	},
	EchoResultSetHeader(errno, affectrows, insertid, numfields, numrows) {
		return new Promise(async (resolve, reject) =>{
			let str = await navicatController.GetLongBinary(errno);
			str += await navicatController.GetLongBinary(affectrows);
			str += await navicatController.GetLongBinary(insertid);
			str += await navicatController.GetLongBinary(numfields);
			str += await navicatController. GetLongBinary(numrows);
			str += await navicatController.GetDummy(12);
			// 	asciiKeys = [];
			// for (var i = 0; i < str.length; i ++)
			// 	asciiKeys.push(str[i].charCodeAt(0));
			// console.log(asciiKeys);

			return resolve(str);
		});
	},
	EchoConnInfo3(db) {
		return new Promise((resolve, reject) =>{
			db.all("SELECT SQLITE_VERSION() as v;").then(async item => {
				let version = item.length > 0 ? item[0].v : "3.0.0";
				let r = await navicatController.GetBlock(version);
					r += await navicatController.GetBlock(version);
					r += await navicatController.GetBlock(version);
				return resolve(r);
			});
		});
	},
	EchoHeader(errno) {
		return new Promise(async (resolve, reject) =>{
			let str = await navicatController.GetLongBinary(1111);
			 str += await navicatController.GetShortBinary(202);
			str += await navicatController.GetLongBinary(errno);
			str += await navicatController.GetDummy(6);

			return resolve(str);
		});
	},
	GetBlock(val) {
		return new Promise(async(resolve, reject) =>{
			let len = val.length;
		if( len < 254 )
			return resolve(String.fromCharCode(len) + val);
		else
			return resolve("\xFE" + await navicatController.GetLongBinary(len) + val);
		});
	},
	GetDummy(count) {
		return new Promise((resolve, reject) =>{
			let str = "";
			for(let i=0;i<count;i++)
				str += "\x00";
			return resolve(str);
		});
	},
	async GetShortBinary(num)	{
		return await navicatController.pack("n",num);
	},
	async GetLongBinary(num){
		return await navicatController.pack("N",num);
	},
	pack(format) {
		return new Promise((resolve, reject) =>{
			//  discuss at: https://locutus.io/php/pack/
		// original by: Tim de Koning (https://www.kingsquare.nl)
		//    parts by: Jonas Raoni Soares Silva (https://www.jsfromhell.com)
		// bugfixed by: Tim de Koning (https://www.kingsquare.nl)
		//      note 1: Float encoding by: Jonas Raoni Soares Silva
		//      note 1: Home: https://www.kingsquare.nl/blog/12-12-2009/13507444
		//      note 1: Feedback: phpjs-pack@kingsquare.nl
		//      note 1: "machine dependent byte order and size" aren't
		//      note 1: applicable for JavaScript; pack works as on a 32bit,
		//      note 1: little endian machine.
		//   example 1: pack('nvc*', 0x1234, 0x5678, 65, 66)
		//   returns 1: '\u00124xVAB'
		//   example 2: pack('H4', '2345')
		//   returns 2: '#E'
		//   example 3: pack('H*', 'D5')
		//   returns 3: 'Õ'
		//   example 4: pack('d', -100.876)
		//   returns 4: "\u0000\u0000\u0000\u0000\u00008YÀ"
		//        test: skip-1

		var formatPointer = 0
		var argumentPointer = 1
		var result = ''
		var argument = ''
		var i = 0
		var r = []
		var instruction, quantifier, word, precisionBits, exponentBits, extraNullCount

		// vars used by float encoding
		var bias
		var minExp
		var maxExp
		var minUnnormExp
		var status
		var exp
		var len
		var bin
		var signal
		var n
		var intPart
		var floatPart
		var lastBit
		var rounded
		var j
		var k
		var tmpResult

		while (formatPointer < format.length) {
		  instruction = format.charAt(formatPointer)
		  quantifier = ''
		  formatPointer++
		  while ((formatPointer < format.length) && (format.charAt(formatPointer)
			  .match(/[\d*]/) !== null)) {
			quantifier += format.charAt(formatPointer)
			formatPointer++
		  }
		  if (quantifier === '') {
			quantifier = '1'
		  }

		  // Now pack variables: 'quantifier' times 'instruction'
		  switch (instruction) {
			case 'a':
			case 'A':
			  // NUL-padded string
			  // SPACE-padded string
			  if (typeof arguments[argumentPointer] === 'undefined') {
				throw new Error('Warning:  pack() Type ' + instruction + ': not enough arguments')
			  } else {
				argument = String(arguments[argumentPointer])
			  }
			  if (quantifier === '*') {
				quantifier = argument.length
			  }
			  for (i = 0; i < quantifier; i++) {
				if (typeof argument[i] === 'undefined') {
				  if (instruction === 'a') {
					result += String.fromCharCode(0)
				  } else {
					result += ' '
				  }
				} else {
				  result += argument[i]
				}
			  }
			  argumentPointer++
			  break
			case 'h':
			case 'H':
			  // Hex string, low nibble first
			  // Hex string, high nibble first
			  if (typeof arguments[argumentPointer] === 'undefined') {
				throw new Error('Warning: pack() Type ' + instruction + ': not enough arguments')
			  } else {
				argument = arguments[argumentPointer]
			  }
			  if (quantifier === '*') {
				quantifier = argument.length
			  }
			  if (quantifier > argument.length) {
				var msg = 'Warning: pack() Type ' + instruction + ': not enough characters in string'
				throw new Error(msg)
			  }

			  for (i = 0; i < quantifier; i += 2) {
				// Always get per 2 bytes...
				word = argument[i]
				if (((i + 1) >= quantifier) || typeof argument[i + 1] === 'undefined') {
				  word += '0'
				} else {
				  word += argument[i + 1]
				}
				// The fastest way to reverse?
				if (instruction === 'h') {
				  word = word[1] + word[0]
				}
				result += String.fromCharCode(parseInt(word, 16))
			  }
			  argumentPointer++
			  break

			case 'c':
			case 'C':
			  // signed char
			  // unsigned char
			  // c and C is the same in pack
			  if (quantifier === '*') {
				quantifier = arguments.length - argumentPointer
			  }
			  if (quantifier > (arguments.length - argumentPointer)) {
				throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments')
			  }

			  for (i = 0; i < quantifier; i++) {
				result += String.fromCharCode(arguments[argumentPointer])
				argumentPointer++
			  }
			  break

			case 's':
			case 'S':
			case 'v':
			  // signed short (always 16 bit, machine byte order)
			  // unsigned short (always 16 bit, machine byte order)
			  // s and S is the same in pack
			  if (quantifier === '*') {
				quantifier = arguments.length - argumentPointer
			  }
			  if (quantifier > (arguments.length - argumentPointer)) {
				throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments')
			  }

			  for (i = 0; i < quantifier; i++) {
				result += String.fromCharCode(arguments[argumentPointer] & 0xFF)
				result += String.fromCharCode(arguments[argumentPointer] >> 8 & 0xFF)
				argumentPointer++
			  }
			  break

			case 'n':
			  // unsigned short (always 16 bit, big endian byte order)
			  if (quantifier === '*') {
				quantifier = arguments.length - argumentPointer
			  }
			  if (quantifier > (arguments.length - argumentPointer)) {
				throw new Error('Warning: pack() Type ' + instruction + ': too few arguments')
			  }

			  for (i = 0; i < quantifier; i++) {
				result += String.fromCharCode(arguments[argumentPointer] >> 8 & 0xFF)
				result += String.fromCharCode(arguments[argumentPointer] & 0xFF)
				argumentPointer++
			  }
			  break

			case 'i':
			case 'I':
			case 'l':
			case 'L':
			case 'V':
			  // signed integer (machine dependent size and byte order)
			  // unsigned integer (machine dependent size and byte order)
			  // signed long (always 32 bit, machine byte order)
			  // unsigned long (always 32 bit, machine byte order)
			  // unsigned long (always 32 bit, little endian byte order)
			  if (quantifier === '*') {
				quantifier = arguments.length - argumentPointer
			  }
			  if (quantifier > (arguments.length - argumentPointer)) {
				throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments')
			  }

			  for (i = 0; i < quantifier; i++) {
				result += String.fromCharCode(arguments[argumentPointer] & 0xFF)
				result += String.fromCharCode(arguments[argumentPointer] >> 8 & 0xFF)
				result += String.fromCharCode(arguments[argumentPointer] >> 16 & 0xFF)
				result += String.fromCharCode(arguments[argumentPointer] >> 24 & 0xFF)
				argumentPointer++
			  }

			  break
			case 'N':
			  // unsigned long (always 32 bit, big endian byte order)
			  if (quantifier === '*') {
				quantifier = arguments.length - argumentPointer
			  }
			  if (quantifier > (arguments.length - argumentPointer)) {
				throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments')
			  }

			  for (i = 0; i < quantifier; i++) {
				result += String.fromCharCode(arguments[argumentPointer] >> 24 & 0xFF)
				result += String.fromCharCode(arguments[argumentPointer] >> 16 & 0xFF)
				result += String.fromCharCode(arguments[argumentPointer] >> 8 & 0xFF)
				result += String.fromCharCode(arguments[argumentPointer] & 0xFF)
				argumentPointer++
			  }
			  break

			case 'f':
			case 'd':
			  // float (machine dependent size and representation)
			  // double (machine dependent size and representation)
			  // version based on IEEE754
			  precisionBits = 23
			  exponentBits = 8
			  if (instruction === 'd') {
				precisionBits = 52
				exponentBits = 11
			  }

			  if (quantifier === '*') {
				quantifier = arguments.length - argumentPointer
			  }
			  if (quantifier > (arguments.length - argumentPointer)) {
				throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments')
			  }
			  for (i = 0; i < quantifier; i++) {
				argument = arguments[argumentPointer]
				bias = Math.pow(2, exponentBits - 1) - 1
				minExp = -bias + 1
				maxExp = bias
				minUnnormExp = minExp - precisionBits
				status = isNaN(n = parseFloat(argument)) || n === -Infinity || n === +Infinity ? n : 0
				exp = 0
				len = 2 * bias + 1 + precisionBits + 3
				bin = new Array(len)
				signal = (n = status !== 0 ? 0 : n) < 0
				n = Math.abs(n)
				intPart = Math.floor(n)
				floatPart = n - intPart

				for (k = len; k;) {
				  bin[--k] = 0
				}
				for (k = bias + 2; intPart && k;) {
				  bin[--k] = intPart % 2
				  intPart = Math.floor(intPart / 2)
				}
				for (k = bias + 1; floatPart > 0 && k; --floatPart) {
				  (bin[++k] = ((floatPart *= 2) >= 1) - 0)
				}
				for (k = -1; ++k < len && !bin[k];) {}

				// @todo: Make this more readable:
				var key = (lastBit = precisionBits - 1 +
				  (k =
					(exp = bias + 1 - k) >= minExp &&
					exp <= maxExp ? k + 1 : bias + 1 - (exp = minExp - 1))) + 1

				if (bin[key]) {
				  if (!(rounded = bin[lastBit])) {
					for (j = lastBit + 2; !rounded && j < len; rounded = bin[j++]) {}
				  }
				  for (j = lastBit + 1; rounded && --j >= 0;
				  (bin[j] = !bin[j] - 0) && (rounded = 0)) {}
				}

				for (k = k - 2 < 0 ? -1 : k - 3; ++k < len && !bin[k];) {}

				if ((exp = bias + 1 - k) >= minExp && exp <= maxExp) {
				  ++k
				} else {
				  if (exp < minExp) {
					if (exp !== bias + 1 - len && exp < minUnnormExp) {
					  // "encodeFloat::float underflow"
					}
					k = bias + 1 - (exp = minExp - 1)
				  }
				}

				if (intPart || status !== 0) {
				  exp = maxExp + 1
				  k = bias + 2
				  if (status === -Infinity) {
					signal = 1
				  } else if (isNaN(status)) {
					bin[k] = 1
				  }
				}

				n = Math.abs(exp + bias)
				tmpResult = ''

				for (j = exponentBits + 1; --j;) {
				  tmpResult = (n % 2) + tmpResult
				  n = n >>= 1
				}

				n = 0
				j = 0
				k = (tmpResult = (signal ? '1' : '0') + tmpResult + (bin
				  .slice(k, k + precisionBits)
				  .join(''))
				).length
				r = []

				for (; k;) {
				  n += (1 << j) * tmpResult.charAt(--k)
				  if (j === 7) {
					r[r.length] = String.fromCharCode(n)
					n = 0
				  }
				  j = (j + 1) % 8
				}

				r[r.length] = n ? String.fromCharCode(n) : ''
				result += r.join('')
				argumentPointer++
			  }
			  break

			case 'x':
			  // NUL byte
			  if (quantifier === '*') {
				throw new Error('Warning: pack(): Type x: \'*\' ignored')
			  }
			  for (i = 0; i < quantifier; i++) {
				result += String.fromCharCode(0)
			  }
			  break

			case 'X':
			  // Back up one byte
			  if (quantifier === '*') {
				throw new Error('Warning: pack(): Type X: \'*\' ignored')
			  }
			  for (i = 0; i < quantifier; i++) {
				if (result.length === 0) {
				  throw new Error('Warning: pack(): Type X:' + ' outside of string')
				} else {
				  result = result.substring(0, result.length - 1)
				}
			  }
			  break

			case '@':
			  // NUL-fill to absolute position
			  if (quantifier === '*') {
				throw new Error('Warning: pack(): Type X: \'*\' ignored')
			  }
			  if (quantifier > result.length) {
				extraNullCount = quantifier - result.length
				for (i = 0; i < extraNullCount; i++) {
				  result += String.fromCharCode(0)
				}
			  }
			  if (quantifier < result.length) {
				result = result.substring(0, quantifier)
			  }
			  break

			default:
			  throw new Error('Warning: pack() Type ' + instruction + ': unknown format code')
		  }
		}
		if (argumentPointer < arguments.length) {
		  var msg2 = 'Warning: pack(): ' + (arguments.length - argumentPointer) + ' arguments unused'
		  throw new Error(msg2)
		}

			return resolve(result);
		});

	}
}
if (!sails.controllers) sails.controllers = {};
sails.controllers.navicat = navicatController;
module.exports = navicatController
