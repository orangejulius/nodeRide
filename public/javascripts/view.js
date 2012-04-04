function isValidCoord(value) {
	if (value == 0)
		return false;
	if (value == null)
		return false;
	return true;
}

function initialize() {
	$.getJSON('/get/rideList', function(data) {
		$.each(data, function(i,item) {
			$("<li><a href=\"/view/"+item+"\">"+item+"</a></li>").appendTo('#rideList');
		});
	});

	if (typeof data == "string") {
		data = JSON.parse(data);
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

		var myOptions = {
			mapTypeId: google.maps.MapTypeId.TERRAIN
		};
		var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

		var flightPath = new google.maps.Polyline({
			path: pathCoordinates,
			strokeColor: "#FF0000",
			strokeOpacity: 1.0,
			strokeWeight: 2
		});

		flightPath.setMap(map);
		map.fitBounds(bounds);
	}
}
