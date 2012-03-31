exports.index = function(req, res){
	var parser = require('xml2json');
	var redis = require('../redis.js').index;
	var format = require('util').format;
	var fs = require('fs');
	//req.files.complete(function(err, fields, files) {
	//	if (err) {
	//		next(err);
	//	} else {
	//		console.log('will read from '+files.upload.path);
	//	}
	//});
	res.send(format('\nuploaded %s (%d Kb) to %s as %s'
	  , req.files.upload.name
	  , req.files.upload.size / 1024 | 0
	  , req.files.upload.path
	  , req.body.title));
	fs.readFile(req.files.upload.path, 'ascii', function(err, data){
		if(err) {
			console.error("Could not open file: %s", err);
			process.exit(1);
		}

		var object = parser.toJson(data, {object: true});
		var activity = object.TrainingCenterDatabase.Activities.Activity;
		var metadata = new Object();
		metadata.id = activity.Id;
		var lap0 = activity.Lap;
		metadata.distance = lap0.DistanceMeters;
		metadata.time = lap0.TotalTimeSeconds;
		metadata.calories = lap0.Calories;
		//console.log(lap0);
		var track0 = lap0.Track;
		//console.log(track0);
		console.log("set key meta-"+metadata.id);
		redis.hmset("meta-"+metadata.id, metadata);

		var pointNum = 0;
		track0.Trackpoint.forEach(function(val, index) {
			var point = new Object();
			point.time = val.Time;
			point.lat = val.Position.LatitudeDegrees;
			point.lon = val.Position.LongitudeDegrees;
			point.alt = val.AltitudeMeters;
			point.dist = val.DistanceMeters;
			console.log(point);
			redis.hmset(metadata.id.toString() + "-" + pointNum,point);
			pointNum++;
		});
	});
};
