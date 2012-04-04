var logule = require('logule');
var redis = require('../core/redis.js');

// get the list of all ride ids
exports.rideList = function(req, res){
	redis.keys('*', function(err, result) {
		if (err) {
			logule.error("Error getting ride ids: "+err);
		} else {
			logule.debug(result);
			res.send(result);
		}
	});
};
