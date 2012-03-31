exports.upload = require('./upload').index;

/*
 * GET home page.
 */
exports.index = function(req, res){
	if (process.env.REDISTOGO_URL) {
		var redis = require('redis-url').connect(process.env.REDISTOGO_URL);

		redis.auth(rtg.auth.split(":")[1]);
	} else {
		var redis = require('redis').createClient();
	}
	redis.hgetall('2', function(err, result) {
  	if (err) {
		console.log("Error: "+err);
	} else {
		console.log(result);
		res.render('index', { title: 'NodeRide', data: result})
		}
	});
};
