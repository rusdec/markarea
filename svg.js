$(document).ready(function() {

	clearCheckbox();	
	createSVG($('#work_img'));
	var path;

	$('#new_area').click(function() {
		if ($(this).prop('checked')) {
			path = new Path();
			path.createPath($('svg'));
		} else {
			console.log('unchecked');
			path.removeIfEmpty();
		}
		
	});

	$('svg').click(function(e) {
		if ($('#new_area').prop('checked')) {
			path.newPoint([e.pageX, e.pageY], $('svg').offset());
		}
	});

	$(document).on('click', 'path', function() {
		if ($('#edit').prop('checked')) {
			path = new Path;
			path.usePath(this);
			console.log("status: ",path.getStatus());
			switch(path.getStatus()) {
				case 'free':
					path.setStatusBusy();
					break;
				case 'busy':
					path.setStatusFree();
					break;
			}
		}
	});
});

function clearCheckbox() {
	$.each($('input[type="checkbox"]'), function() {
		$(this).prop('checked', false);
	});
}

function createSVG(e) {
	var width	= e[0].width;
	var height	= e[0].height;
	var src		= e.attr("src");
	
	var svg	= $('<svg width="'+width+'" height="'+height+'"xmlns="http://www.w3.org/2000/svg" version="1.1">');
	e.remove(); 
	$('#work_area').append(svg);
	$('svg').css('background', 'url("'+src+'")');
	console.log($('svg').offset());
}
