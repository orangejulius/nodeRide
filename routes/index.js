exports.upload = require('./upload').index;

/*
 * GET home page.
 */
exports.index = function(req, res){
	if (process.env.REDISTOGO_URL) {
		var rtg = require('url').parse(process.env.REDISTOGO_URL);
		var client = require('redis').createClient(rtg.port, rtg.hostname);

		client.auth(rtg.auth.split(":")[1]);
	} else {
		var redis = require('redis');
		var client = redis.createClient();
	}
	client.hgetall('2', function(err, result) {
  	if (err) {
		console.log("Error: "+err);
	} else {
		console.log(result);
		res.render('index', { title: 'NodeRide', data: result})
		}
	});
};
