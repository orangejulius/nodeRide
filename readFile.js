process.argv.slice(2).forEach(function(filename, index) {
	var readTCX = require('./core/readTCX.js').index;
	console.log("arg "+filename);
	readTCX(filename, function(result) {
		if (result == true) {
			console.log("read file successfully");
			process.exit(0);
		}
	});
});
