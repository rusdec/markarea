$(document).ready(function() {

	clearCheckbox();	
	createSVG($('#work_img'));
	var path;
	var down = false;
	var circle;
	var overCircleNow = false;


	$('#new_area').click(function() {
		if ($(this).prop('checked')) {
			path = new Path($('svg'));
			path.createPath();
		} else {
			path.removeIfEmpty();
		}
		
	});
	/*
	$(document).on('mouseover', '.tooltip', function() {
		$(this).tooltipster({
			theme: 'tooltipster-noir',
			interactive: true,
		});
	});
	*/
	$('svg').click(function(e) {
		if ($('#new_area').prop('checked') && (!overCircleNow)) {
			path.newPoint([e.pageX, e.pageY], $('svg').offset());
		}
	});
	
	$(document).on('mouseover', 'circle', function(e) {
		if (! down) {
			$(this).attr('r', '5')
			overCircleNow = true; 
		}
	});
	$(document).on('mouseleave', 'circle', function(e) {
		$(this).attr('r', '3')
		overCircleNow = false; 
	});

	$(document).on('mousedown', 'circle', function(e) {
		if ( ($('#edit').prop('checked')) && (! $('#new_area').prop('checked')) ) {
			path = new Path($('svg'));
			path.useThisPath($('#'+$(this).attr('path_id')));
			circle = $(this);
			down = true;
		}
		console.log('down(md): '+down);
	});
	
	$(document).on('mousemove', function(e) {
		if (down) {	
			path.newPointCoordinate(circle, [e.pageX, e.pageY], $('svg').offset(), $(circle).attr('count'));
		}
	});

	$(document).on('mouseup', function() {
		if (down) {
			down = false;
			circle = '';
		}
		console.log('down(mu): '+down);
	});

	$(document).on('click', '#edit', function() {
		if ($('#edit').prop('checked')) {
			var d = document.createElement('div');
			d.setAttribute('id', 'area_properties');
			$(d).insertAfter('#work_area');
			var statuses = new Path($('svg'));
			statuses = statuses.getAllStatuses()[0];
			$.each(statuses, function(k,s) {
				var color = document.createElement('div');
				color.setAttribute('title',s.description);
				color.setAttribute('status',s.name);
				$(d).append(color)
				$(color).css('background-color', s.color);
				$(color).addClass('color_brick');
				$(color).append('<span>'+s.description+'</span>');
			});

		} else {
			$('#area_properties').remove();
			path.removeActiveValue();
		}
	});
	$(document).on('click', '.color_brick', function() {
		if (path != undefined) {
			path.setStatus($(this).attr('status'));
		}
	});

	$(document).on('click', 'path', function() {
		if ( ($('#edit').prop('checked')) && (! $('#new_area').prop('checked')) ) {
			path = new Path($('svg'));
			path.useThisPath(this);
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
