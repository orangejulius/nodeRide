exports.upload = require('./upload').index;
exports.flush = require('./flush').index;
exports.view = require('./view').index;

/*
 * GET home page.
 */
exports.index = function(req, res){
	var redis = require('../core/redis.js').index;
	redis.keys('*', function(err, result) {
		if (err) {
			console.log("Error: "+err);
		} else {
			console.log(result);
			res.render('index', { title: 'NodeRide', data: result})
		}
	});
};
