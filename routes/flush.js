var redis = require('../core/redis.js');

module.exports = function(req, res) {
	redis.flushdb(function(result) {
		console.log("flushed redis db");
		res.redirect('/');
	});
};
