var readTCX = require('../core/readTCX.js').index;

exports.index = function(req, res){
	var format = require('util').format;
	//req.files.complete(function(err, fields, files) {
	//	if (err) {
	//		next(err);
	//	} else {
	//		console.log('will read from '+files.upload.path);
	//	}
	//});
	res.send(format('\nuploaded %s (%d Kb) to %s as %s'
	  , req.files.upload.name
	  , req.files.upload.size / 1024 | 0
	  , req.files.upload.path
	  , req.body.title));
	readTCX(req.files.upload.path);
};
