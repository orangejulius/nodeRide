exports.upload = require('./upload');
exports.flush = require('./flush');
exports.view = require('./view');
exports.get = require('./get');

var logule = require('logule');
/*
 * GET home page.
 */
exports.index = function(req, res){
	res.render('index', { title: 'NodeRide'})
};
