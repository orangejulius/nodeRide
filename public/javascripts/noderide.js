var rideList = null;

//compare two arrays
//return true if they are the same (same # of elements, all elements equal)
//false if not
function compare(array1, array2) {
	if (array1.length != array2.length) {
		return false;
	}
	for (var i = 0; i < array1.length; i++) {
		if (array1[i] != array2[i]) {
			return false;
		}
	}
	return true;
}

//check if new rides are available, and if they are, update the DOM with updateRideList
function checkRideList() {
	$.getJSON('/get/rideList', function(data) {
		if (rideList && compare(data, rideList) == false) {
			updateRideList(data);
		} else {
			updateRideList(data);
		}
		rideList = data;
	});
}

//given a json object with a list of rides, update the DOM with new elements
function updateRideList(data) {
	$('#rideList').empty();
	$("<li class=\"nav-header\">existing rides</li>").appendTo('#rideList');
	data.sort();
	$.each(data, function(i,item) {
		$("<li><a href=\"/view/#"+item+"\">"+item+"</a></li>").appendTo('#rideList');
	});
}

function initializeNodeRide() {
	checkRideList();

	$(':button').click(function() {
		var formData = new FormData($('form')[0]);
		$.ajax({
			url: '/upload',
			type: 'POST',
			error: function(err) { console.log('error: '); console.log(err);},
			success: function() {checkRideList();},
			data: formData,
			cache: false,
			contentType: false,
			processData: false
		});
	});
}

$(initializeNodeRide);
