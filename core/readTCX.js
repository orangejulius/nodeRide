var dummyObj = {};

var returnNull = function() {
	return null;
}

dummyObj.get = dummyObj.find = dummyObj.text = returnNull;

function getNode(element, name) {
	if (element)
		var newElem = element.get('./*[local-name() = \''+name+'\']');
		if (newElem)
			return newElem;
	return dummyObj;
}

function findNode(element, name) {
	if (element)
		var newElem = element.find('./*[local-name() = \''+name+'\']');
		if (newElem)
			return newElem;
	return dummyObj;
}

exports.index = function(fileName, callback) {
	var libxmljs = require('libxmljs');
	var redis = require('./redis.js').index;
	var fs = require('fs');
	var tcxNs='http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2'

	fs.readFile(fileName, 'ascii', function(err, data){
		if(err) {
			console.error("Could not open file: %s", err);
			process.exit(1);
		}

		console.log(data.length);
		var xmldoc = libxmljs.parseXmlString(data);

		var ns = xmldoc.root().namespace();
		console.log("root node ns href: "+ns.href());
		console.log("root node name: "+xmldoc.root().name());

		var activitiesNode = xmldoc.root().find('//*[local-name() = \'Activity\']', tcxNs);
		console.log(activitiesNode);
		activitiesNode.forEach(function(activityNode) {
			//debug section printing xml structure
			console.log("Activity node children: ");
			activityNode.childNodes().forEach(function (val, index) {
				console.log("-"+val.name());
			});

			var lapNode = getNode(activityNode, 'Lap');
			console.log("Lap node children");
			lapNode.childNodes().forEach(function(val, index) {
				console.log("-"+val.name());
			});


			var trackNode = getNode(lapNode, 'Track');
			console.log("Track node children");
			trackNode.childNodes().forEach(function(val) {
				console.log("-"+val.name());
			});

			var trackpoint = trackNode.childNodes()[0];
			console.log("Trackpoint node children");
			trackpoint.childNodes().forEach(function(val) {
				console.log('-'+val.name());
			});
			//end debug printing

			var key = {};
			key.laps = [];
			key.id = getNode(activityNode, 'Id').text();
			findNode(activityNode, 'Lap').forEach(function(lapNode) {
				var lap = {};
				lap.tracks = []

				lap.time = getNode(lapNode, 'TotalTimeSeconds').text();
				lap.dist = getNode(lapNode, 'DistanceMeters').text();
				lap.calories = getNode(lapNode, 'Calories').text();
				lap.cadence = getNode(lapNode, 'Cadence').text();

				findNode(lapNode, 'Track').forEach(function(trackNode) {
					var track = [];

					findNode(trackNode, 'Trackpoint').forEach(function(trackpointNode) {
						var trackpoint = {};

						trackpoint.time = getNode(trackpointNode, 'Time').text();

						var position = getNode(trackpointNode, 'Position');
						trackpoint.lat = getNode(position, 'LatitudeDegrees').text();
						trackpoint.lon = getNode(position, 'LongitudeDegrees').text();

						trackpoint.alt = getNode(trackpointNode, 'AltitudeMeters').text();
						trackpoint.dist = getNode(trackpointNode, 'DistanceMeters').text();
						trackpoint.cadence = getNode(trackpointNode, 'Cadence').text();

						var extensions = getNode(trackpointNode, 'Extensions');
						var tpx = getNode(extensions, 'TPX');
						trackpoint.power = getNode(tpx, 'Watts').text();

						console.log(trackpoint);
						track.push(trackpoint);
					});
					lap.tracks.push(track);
				});

				console.log(lap)
				key.laps.push(lap);
			});

			console.log(key);
			var string = JSON.stringify(key);
			console.log("storing stringified JSON with length "+string.length);
			redis.set(key.id.toString(),string);
		});
		callback(true);
	});
};
