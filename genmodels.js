const ADODB = require('node-adodb');
let fs = require('fs');
let modelsPath = "./api/models/";
let controllersPath = "./api/controllers/";
let dbname = "XD12019.accdb"
// const connection = ADODB.open('Provider=Microsoft.ACE.OLEDB.14.0;Data Source=' + dbname + ';Persist Security Info=False;');
const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=' + dbname + ';Persist Security Info=False;');

let tablesForSync = require('./config/custom.js').custom.tables;

getTables().then(async tables => {
	for (const t of tables) {
		const found = tablesForSync.find(element => element.name == t.TABLE_NAME);
		if (found) {
			let data = await getSchemaTable(t.TABLE_NAME)
			data.sort((a, b) => a.ORDINAL_POSITION - b.ORDINAL_POSITION);
			await genModel(data, t);
			await genController(data);
		 }
	}
})

function getSchemaTable(tableName) {
    return new Promise((resolve, reject) => {
        connection
            .schema(4, [undefined, undefined, tableName])
            .then(async schema => {
                return resolve(schema);
			}).catch(err => {
				console.error(tableName)
                return reject(err);
            })
    });
}

function getTables() {
    return new Promise((resolve, reject) => {
		connection
			//28 -index
			//22 types
            .schema(20, undefined)
			.then(async schema => {
				console.log(schema);
				return resolve(schema.filter(it => it.TABLE_TYPE == "TABLE"));// && it.TABLE_NAME.substring(0, 4) != "MSys"));
            }).catch(err => {
                reject(err);
            })
    });
}

function genModel(schema,table) {
    return new Promise( async (resolve, reject) => {

		if (schema.length < 1) return reject(new Error("Invalid model"));

		let modelname = schema[0].TABLE_NAME;
		let filename = modelname.capitalize().split("_").join("");
        let d = new Date();
        let now = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

		let modelFileContent = `
/**
*
* ${filename + '.js'}
*
* @description :: ${modelname} model imported from Access factusol database at ${now}.
* @docs        :: http://sailsjs.org/#!documentation/models
*
*/

module.exports = {
	tableName: '${modelname}',
	description: '${table && table.DESCRIPTION ? table.DESCRIPTION : ""}',
	attributes: `;
		let attributes = {};
		const found = tablesForSync.find(element => element.name == table.TABLE_NAME);
		if (found && found.byYears == 1) attributes = { "YEAR": { columnName: 'YEAR', description: "Año de la db factusol", allowNull: false, type: "string" } };
		await new Promise((res) => {
			schema.forEach(async (item) => {
				let u = await new Promise((resolve) => {
					if (found.cols) {
						const f = found.cols.find(element => element == item.COLUMN_NAME);
						if (f) return resolve(true);
						return resolve(false)
					}
					return resolve(true)
				 })
				if (u == true) {
					attributes[item.COLUMN_NAME] = {
						columnName: item.COLUMN_NAME,
						defaultsTo: item.COLUMN_DEFAULT != undefined ? item.COLUMN_DEFAULT.split('"').join('') : item.COLUMN_DEFAULT,
						description: item.DESCRIPTION != undefined ? item.DESCRIPTION.split("'").join("`") : '',
						allowNull: item.IS_NULLABLE
					};
					switch (item.DATA_TYPE) {
						case 128:
						case 130:
							attributes[item.COLUMN_NAME].type = "string";
							attributes[item.COLUMN_NAME].defaultsTo = item.COLUMN_DEFAULT == null ? '' : item.COLUMN_DEFAULT.split('"').join('');
							break;
						case 3:
						case 2:
						case 17:
							attributes[item.COLUMN_NAME].type = "number";
							// attributes[item.COLUMN_NAME].columnType = 'Int16';
							attributes[item.COLUMN_NAME].defaultsTo = parseInt(item.COLUMN_DEFAULT == null ? 0 : item.COLUMN_DEFAULT);
							break;
						case 4:
							attributes[item.COLUMN_NAME].type = "number";
							// attributes[item.COLUMN_NAME].columnType = 'Decimal';
							attributes[item.COLUMN_NAME].defaultsTo = parseFloat(item.COLUMN_DEFAULT == null ? 0 : item.COLUMN_DEFAULT);
							break;
						case 6:
							attributes[item.COLUMN_NAME].type = "number";
							// attributes[item.COLUMN_NAME].columnType = 'Float';
							attributes[item.COLUMN_NAME].defaultsTo = parseFloat(item.COLUMN_DEFAULT == null ? 0 : item.COLUMN_DEFAULT);
							break;
						case 5:
							attributes[item.COLUMN_NAME].type = "number";
							// attributes[item.COLUMN_NAME].columnType = 'Double';
							attributes[item.COLUMN_NAME].defaultsTo = parseInt(item.COLUMN_DEFAULT == null ? 0 : item.COLUMN_DEFAULT);
							break;
						case 7:
							attributes[item.COLUMN_NAME].type = "string";
							attributes[item.COLUMN_NAME].columnType = 'DateTime';
							attributes[item.COLUMN_NAME].defaultsTo = item.COLUMN_DEFAULT == null ? '' : item.COLUMN_DEFAULT.split('"').join('');
							break;
						default:
							attributes[item.COLUMN_NAME].type = "string";
							attributes[item.COLUMN_NAME].defaultsTo = item.COLUMN_DEFAULT == null ? '' : item.COLUMN_DEFAULT.split('"').join('');
							break;
					}
					if (attributes[item.COLUMN_NAME].defaultsTo == null && attributes[item.COLUMN_NAME].allowNull == true) delete attributes[item.COLUMN_NAME].defaultsTo
				}
			})
			return res();
		})

		modelFileContent += JSON.stringify(attributes, null, 4) + "}";

		// try {
		// 	fs.unlinkSync(modelsPath + filename + ".js");
		// } catch (error) {
		// }
		if (!fs.existsSync(modelsPath + filename + ".js")) {
			fs.writeFile(modelsPath + filename + ".js", modelFileContent, function (err) {
				if (err) {
					console.log(err);
					return reject(err)
				} else {
					return resolve();
				}
			});
		} else {
			return resolve();
		}
    });
}

function genController(schema) {
    return new Promise((resolve, reject) => {
		if (schema.length < 1) return reject(new Error("Invalid model"));

		let modelname = schema[0].TABLE_NAME;
		let filename = modelname.capitalize().split("_").join("");
        let d = new Date();
        let now = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

		let controllerFileContent = `
/**
* ${filename + '.js'}
*
* @description :: ${modelname} controller imported from Access factusol database at ${now}.
* @docs        :: http://sailsjs.org/#!documentation/controllers
*/

module.exports = {}`;

		// try {
		// 	fs.unlinkSync(controllersPath + filename + "Controller.js");
		// } catch (error) {
		// }
		if (!fs.existsSync(controllersPath + filename + "Controller.js")) {
			fs.writeFile(controllersPath + filename + "Controller.js", controllerFileContent, function (err) {
				if (err) {
					console.log(err);
					return reject(err)
				} else {
					return resolve();
				}
			});
		} else {
			return resolve();
		}
    });
}

if (typeof String.prototype.capitalize != 'function') {
    String.prototype.capitalize = function (){
        var response = this.charAt(0).toUpperCase() + this.slice(1);
        return response;
    };
}
