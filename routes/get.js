var logule = require('logule').init(module);
var redis = require('../core/redis.js');

// get the list of all ride ids
exports.rideList = function(req, res){
	redis.keys('*', function(err, result) {
		if (err) {
			logule.error("Error getting ride ids: "+err);
		} else {
			logule.debug(result);
			res.header('Content-Type', 'application/json');
			res.send(result);
		}
	});
};

// get a specific ride by id
exports.ride = function(req, res){
	redis.get(req.params.id, function(err, result) {
		if (err) {
			logule.error("Error getting ride with id "+req.params.id+": "+err);
		} else {
			logule.debug(result);
			res.header('Content-Type', 'application/json');
			res.send(result);
		}
	});
};
