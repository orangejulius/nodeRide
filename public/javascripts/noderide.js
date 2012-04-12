function updateRideList() {
	$.getJSON('/get/rideList', function(data) {
		$('#rideList').empty();
		$("<li class=\"nav-header\">existing rides</li>").appendTo('#rideList');
		data.sort();
		$.each(data, function(i,item) {
			$("<li><a href=\"/view/#"+item+"\">"+item+"</a></li>").appendTo('#rideList');
		});
	});
}

function initializeNodeRide() {
	updateRideList();

	setInterval("updateRideList()", 2000);

	$(':button').click(function() {
		var formData = new FormData($('form')[0]);
		$.ajax({
			url: '/upload',
			type: 'POST',
			error: function(err) { console.log('error: '); console.log(err);},
			data: formData,
			cache: false,
			contentType: false,
			processData: false
		});
	});
}

$(initializeNodeRide);
