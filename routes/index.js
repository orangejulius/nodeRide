
/*
 * GET home page.
 */
exports.index = function(req, res){
	var redis = require('redis');
	var client = redis.createClient();
	client.hgetall('2', function(err, result) {
  	if (err) {
		console.log("Error: "+err);
	} else {
		console.log(result);
		res.render('index', { title: 'NodeRide', data: result})
		}
	});
};
