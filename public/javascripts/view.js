var hello = 'hello';
console.log(data);
console.log(typeof data);
data = JSON.parse(data);
console.log(typeof data);

function isValidCoord(value) {
	if (value == 0)
		return false;
	if (value == null)
		return false;
	return true;
}

function initialize() {

	var center = null;

	var pathCoordinates = [];
	data.laps.forEach(function(lap) {
		lap.tracks.forEach(function(track) {
			track.forEach(function(trackpoint) {
				var newLatLng = new google.maps.LatLng(trackpoint.lat, trackpoint.lon);
				if (!center)
					center = newLatLng;
				if (isValidCoord(trackpoint.lat) && isValidCoord(trackpoint.lon))
					pathCoordinates.push(newLatLng);
			});
		});
	});

	var myOptions = {
		center: center,
		zoom: 8,
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
}
