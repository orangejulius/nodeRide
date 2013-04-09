var NodeRide = {
	RideList: function() {
		this.initialize();
	},
};

NodeRide.RideList.prototype = {
	rideList: null,
	//compare two arrays
	//return true if they are the same (same # of elements, all elements equal)
	//false if not
	compare: function(array1, array2) {
		if (array1.length != array2.length) {
			return false;
		}
		for (var i = 0; i < array1.length; i++) {
			if (array1[i] != array2[i]) {
				return false;
			}
		}
		return true;
	},

	//check if new rides are available, and if they are, update the DOM with updateRideList
	checkRideList: function() {
		var that = this;
		$.getJSON('/get/rideList', function(data) {
			if (that.rideList == null || that.compare(data, that.rideList) == false) {
				that.updateRideList(data);
				that.rideList = data;
			}
		});
	},

	//given a json object with a list of rides, update the DOM with new elements
	updateRideList: function(data) {
		$('#rideList').empty();
		$("<li class=\"nav-header\">existing rides</li>").appendTo('#rideList');
		data.sort();
		$.each(data, function(i,item) {
			$("<li><a href=\"/view/#"+item+"\">"+item+"</a></li>").appendTo('#rideList');
		});
	},

	initialize: function() {
		this.checkRideList();

		$('#uploadLink').click(function() {
			$('input[type=file]').click();
		});

		var that = this;
		$('input[type=file]').change(function() {
			var formData = new FormData($('form')[0]);
			$.ajax({
				url: '/upload',
				type: 'POST',
				error: function(err) { console.log('error: '); console.log(err);},
				success: function() {that.checkRideList();},
				data: formData,
				cache: false,
				contentType: false,
				processData: false
			});
		});
	}
}

$(document).ready(function() {
	NodeRide.ridelist = new NodeRide.RideList();
});
