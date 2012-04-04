exports.upload = require('./upload');
exports.flush = require('./flush');
exports.view = require('./view');

var logule = require('logule');
/*
 * GET home page.
 */
exports.index = function(req, res){
	var redis = require('../core/redis.js');
	redis.keys('*', function(err, result) {
		if (err) {
			console.log("Error: "+err);
		} else {
			logule.debug(result);
			res.render('index', { title: 'NodeRide', data: result})
		}
	});
};
