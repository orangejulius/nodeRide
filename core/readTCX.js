exports.index = function(fileName, callback) {
	var parser = require('xml2json');
	var redis = require('./redis.js').index;
	var fs = require('fs');

	fs.readFile(fileName, 'ascii', function(err, data){
		if(err) {
			console.error("Could not open file: %s", err);
			process.exit(1);
		}

		var object = parser.toJson(data, {object: true});
		var activity = object.TrainingCenterDatabase.Activities.Activity;
		var key = new Object();
		key.id = activity.Id;
		//console.log(activity);
		key.laps = new Array();
		console.log("Lap size: "+activity.Lap.length);
		var tempArray = new Array();
		if (activity.Lap.size > 1) {
			activity.Lap.forEach(function(lap, index) {
				tempArray.push(lap);
			});
		} else {
			tempArray.push(activity.Lap);
		}
		tempArray.forEach(function(lap, index) {
			//console.log("printing lap "+index);
			var lapObject = new Object();
			lapObject.distance = lap.DistanceMeters;
			lapObject.time = lap.TotalTimeSeconds;
			lapObject.calories = lap.Calories;
			console.log("printing lap");
			console.log(lap);
			//var track0 = lap.Track;
			lapObject.trackpoints = [];
			lap.Track.forEach(function(trackpoint, index) {
				console.log("printing Track child");
				//console.log(trackpoint);
				console.log("Printing Trackpoint");
				//console.log(trackpoint.Trackpoint);
				var tempTrackpointArray = [];
				console.log("Trackpoint size is "+trackpoint.Trackpoint.size);
				if (trackpoint.Trackpoint.size > 1) {
					trackpoint.Trackpoint.foreach(function(trackpointItem) {
						tempTrackpointArray.push(trackpointItem);
					});
				} else {
					tempTrackpointArray.push(trackpoint.Trackpoint);
				}
				tempTrackpointArray.forEach(function(trackpoint, index) {
					var point = {};
					point.time = trackpoint.Time;
					if (trackpoint.Position) {
						point.lat = trackpoint.Position.LatitudeDegrees;
						point.lon = trackpoint.Position.LongitudeDegrees;
					}
					point.alt = trackpoint.AltitudeMeters;
					point.dist = trackpoint.DistanceMeters;
					console.log(point);
					console.log(trackpoint);
					lapObject.trackpoints.push(point);
					});
				});
			key.laps.push(lapObject);

		});
		redis.hmset(key.id.toString(), key);
		callback(true);
		/*

		var pointNum = 0;
		track0.Trackpoint.forEach(function(val, index) {
			pointNum++;
		});
		redis.hmset(key.id.toString(), point);
		console.log("set key eta-"+key.id);
		*/
	});
};
