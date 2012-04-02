exports.index = function(req, res) {
	var redis = require('../core/redis.js').index;
	redis.get(req.params.id, function(err, result) {
		res.render('view', { id: req.params.id, title: "Viewing ride "+req.params.id, data: result});
	});
};
