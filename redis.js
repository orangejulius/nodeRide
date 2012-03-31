if (process.env.REDISTOGO_URL) {
	var redis = require('redis-url').connect(process.env.REDISTOGO_URL);

	redis.auth(rtg.auth.split(":")[1]);
} else {
	var redis = require('redis').createClient();
}

exports.index = redis;
