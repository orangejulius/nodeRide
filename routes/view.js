exports.index = function(req, res) {
	var redis = require('../core/redis.js').index;
	res.render('view', { id: req.params.id, title: "Viewing ride "+req.params.id});
};
