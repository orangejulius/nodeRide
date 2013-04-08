var map = null;
var flightPath = null;

function isValidCoord(value) {
	if (value == 0)
		return false;
	if (value == null)
		return false;
	return true;
}

function parseRide(data) {
	var ride = {};
	ride.elevation = [];
	ride.path = [];

	data.laps.forEach(function(lap) {
		lap.tracks.forEach(function(track) {
			track.forEach(function(trackpoint) {
				var newLatLng = new google.maps.LatLng(trackpoint.lat, trackpoint.lon);
				if (isValidCoord(trackpoint.lat) && isValidCoord(trackpoint.lon)) {
					ride.path.push(newLatLng);
				}
				var date = new Date(trackpoint.time);

				ride.elevation.push([date.getTime(), trackpoint.alt]);
			});
		});
	});

	return ride;
}

function updateRide(rideId) {
	$.getJSON('/get/ride/'+rideId, function(data) {
		var ride = parseRide(data);
		var bounds = new google.maps.LatLngBounds();

		ride.path.forEach(function(latLng) {
			bounds.extend(latLng);
		});

		flightPath.setPath(ride.path);

		flightPath.setMap(map);
		map.fitBounds(bounds);

		updatePlot(ride);
	});
}

function onHashChange() {
	var rideId = location.hash.substring(1);

	document.title = "NodeRide - Viewing Ride "+rideId;
	$('#ride-name').text("Ride "+rideId);

	updateRide(rideId);
}

function initializeMap() {
	//only initialize the map if the map div exists
	var canvas = $('#map_canvas');
	if (canvas.length) {
		var myOptions = {
			mapTypeId: google.maps.MapTypeId.TERRAIN
		};
		//be sure to pass a normal DOM element to the google maps API
		map = new google.maps.Map(canvas.get(0), myOptions);

		flightPath = new google.maps.Polyline({strokeColor: "#F00", strokeWeight: 2});

		onHashChange();

		$(window).bind('hashchange', onHashChange);
	}
}

function updatePlot(rideData) {
	var options = {
		xaxis: { mode: "time" }
	}
	$.plot($("#plot"), [ rideData.elevation ], options);
}

$(initializeMap);
