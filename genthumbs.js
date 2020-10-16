const fs = require('fs');
const thumb = require('node-thumbnail').thumb;



function AsyncForEach(array, fn, callback) {
	if (array.length > 1) array = array.reverse();
	array = array.slice(0);
	var counter = -1;

	function processOne() {
		var item = array.pop();
		counter++;
		fn(item, counter, function(result) {
			if (array.length > 0) {
				setTimeout(processOne, 0);
			} else {
				callback();
			}
		});
	}
	if (array.length > 0) {
		setTimeout(processOne, 0);
	} else {
		callback();
	}
}

async function start() {
	let files = fs.readdirSync(process.cwd() + "/photos/");

	AsyncForEach(files, (file, index, next) => {
		let md5 = file.split('.')[0];
		let extension = file.split('.')[1];
		console.log( "150 Procesando "+ index + "/"+ files.length, md5, extension)
		if (!fs.existsSync(process.cwd() + "/thumbs/150/" + md5 + "." + extension)) {
			// await new Promise(resolve => {
			thumb({
				source: process.cwd() + "/photos/" + md5 + "." + extension,
				destination: process.cwd() + "/thumbs/150/",
				// basename: md5 + "." + extension,
				quiet: true,
				suffix: '',
				width: 150
			}).then(() => {
				return next();
			});
		} else {
			return next();
		}
	 }, () => {
		console.log("150 Proceso terminado");
	})

	AsyncForEach(files, (file, index, next) => {
		let md5 = file.split('.')[0];
		let extension = file.split('.')[1];
		console.log( "1024 Procesando "+ index + "/"+ files.length, md5, extension)
		if (!fs.existsSync(process.cwd() + "/thumbs/1024/" + md5 + "." + extension)) {
			// await new Promise(resolve => {
			thumb({
				source: process.cwd() + "/photos/" + md5 + "." + extension,
				destination: process.cwd() + "/thumbs/1024/",
				// basename: md5 + "." + extension,
				quiet: true,
				suffix: '',
				width: 1024
			}).then(() => {
				return next();
			});
		} else {
			return next();
		}
	 }, () => {
		console.log("1024 Proceso terminado");
	})
}

start();
