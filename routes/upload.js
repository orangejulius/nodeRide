exports.index = function(req, res){
	var parser = require('xml2json');

	console.log("in /upload");
	res.writeHead('200');
	res.end('got file' + req.body.upload);
	res.send('foo!');
};
