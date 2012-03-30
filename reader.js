var parser = require('xml2json');
var fs = require('fs');
var redis = require('redis');
var client = redis.createClient();
var filename = '2012-03-10-16-53-22.tcx'

fs.readFile(filename, 'ascii', function(err, data){
	if(err) {
		console.error("Could not open file: %s", err);
		process.exit(1);
	}

	client.set("clientTest", "foo", redis.print);
	var json = parser.toJson(data);
	var object = parser.toJson(data, {object: true});
//	console.log(json);
	var trackPoint = object.TrainingCenterDatabase.Activities.Activity.Lap[0].Track[1].Trackpoint;
	//console.log(trackPoint);
	var point = 0;
	trackPoint.forEach(function(val, index) {
		console.log(val);
		//console.log(val.AltitudeMeters);
		client.hmset(filename + '-' + point.toString(), val);
		point++;
	});
});
