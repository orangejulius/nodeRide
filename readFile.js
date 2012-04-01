process.argv.slice(2).forEach(function(filename, index) {
	var readTCX = require('./core/readTCX.js').index;
	console.log("arg "+filename);
	readTCX(filename);
});
