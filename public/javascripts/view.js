var map = null;
var flightPath = null;

function isValidCoord(value) {
	if (value == 0)
		return false;
	if (value == null)
		return false;
	return true;
}

function updateRide(rideId) {
	$.getJSON('/get/ride/'+rideId, function(data) {
		var pathCoordinates = [];
		var bounds = new google.maps.LatLngBounds();
		data.laps.forEach(function(lap) {
			lap.tracks.forEach(function(track) {
				track.forEach(function(trackpoint) {
					var newLatLng = new google.maps.LatLng(trackpoint.lat, trackpoint.lon);
					if (isValidCoord(trackpoint.lat) && isValidCoord(trackpoint.lon)) {
						pathCoordinates.push(newLatLng);
						bounds.extend(newLatLng);
					}
				});
			});
		});

		flightPath.setPath(pathCoordinates);

		flightPath.setMap(map);
		map.fitBounds(bounds);
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

$(initializeMap);
