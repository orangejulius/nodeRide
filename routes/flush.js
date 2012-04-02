var redis = require('../core/redis.js').index;

exports.index = function(req, res) {
	redis.flushdb(function(result) {
		console.log("flushed redis db");
		res.redirect('/');
	});
};
