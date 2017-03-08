$(document).ready(function() {

	clearCheckbox();	
	createSVG($('#work_img'));
	var path;
	var down = false;
	var circle;

	$('.tooltip').tooltipster();

	$('#new_area').click(function() {
		if ($(this).prop('checked')) {
			path = new Path($('svg'));
			path.createPath();
		} else {
			path.removeIfEmpty();
		}
		
	});

	$('svg').click(function(e) {
		if ($('#new_area').prop('checked')) {
			path.newPoint([e.pageX, e.pageY], $('svg').offset());
		}
	});

	$(document).on('mousedown', 'circle', function(e) {
		if ( ($('#edit').prop('checked')) && (! $('#new_area').prop('checked')) ) {
			path = new Path($('svg'));
			path.useThisPath($('#'+$(this).attr('path_id')));
			circle = $(this);
			down = true;
		}
	});
	
	$(document).on('mousemove', function(e) {
		if (down) {	
			path.newPointCoordinate(circle, [e.pageX, e.pageY], $('svg').offset(), $(circle).attr('count'));
			console.log(path.getPathID()+': ['+e.pageX+','+e.pageY+']');
		}
	});

	$(document).on('mouseup', function() {
		if (down) {
			down = false;
			circle = '';
		}
	});

	$(document).on('click', 'path', function() {
		if ( ($('#edit').prop('checked')) && (! $('#new_area').prop('checked')) ) {
			path = new Path($('svg'));
			path.useThisPath(this);
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
}
