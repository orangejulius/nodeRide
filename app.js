
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var connect = require('connect');

var app = express();//module.exports = express.createServer();

// Configuration

//function to filter which responses have compression enabled
//currently only enabled for json and html
var filter = function (req, res) {
	if (!process.env.ENABLE_COMPRESSION) {
		return false;
	}
	var type = res.getHeader('Content-Type') || '';
	return type.match(/json|html/) !== null;
};

app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', { layout: false});
    app.use(connect.compress({filter: filter}));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.post('/upload', routes.upload);
app.get('/flush', routes.flush);
app.get('/view/', routes.view);
app.get('/get/rideList', routes.get.rideList);
app.get('/get/ride/:id', routes.get.ride);

var port = process.env.PORT || 3000;
if (process.env.isHeroku) {
	app.listen(port);
} else {
	app.listen(port, '127.0.0.1');
}
console.log("Express server listening on port %d in %s mode", port, app.settings.env);
