var readTCX = require('../core/readTCX.js');
var logule = require('logule');

module.exports = function(req, res){
	var format = require('util').format;
	readTCX(req.files.upload.path, function(result) {
		res.send(format('\nuploaded %s (%d Kb) to %s as %s'
		  , req.files.upload.name
		  , req.files.upload.size / 1024 | 0
		  , req.files.upload.path
		  , req.body.title));
		logule.info("result for upload of file "+req.files.upload.name + ": "+result);
	});
};
