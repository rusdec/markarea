'use strict';
function dump(arr,level) {
	var dumped_text = "";
	if(!level) level = 0;
	
	//The padding given at the beginning of the line.
	var level_padding = "";
	for(var j=0;j<level+1;j++) level_padding += "    ";
	
	if(typeof(arr) == 'object') { //Array/Hashes/Objects 
		for(var item in arr) {
			var value = arr[item];
			
			if(typeof(value) == 'object') { //If it is an array,
				dumped_text += level_padding + "'" + item + "' ...\n";
				dumped_text += dump(value,level+1);
			} else {
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} else { //Stings/Chars/Numbers etc.
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	return dumped_text;
}

class Path {
	
	constructor(p) {
		this.params = {
			pathActiveValue: 'active_path',
			pathStatus: {
				free: {
					name: 'free',
					color: 'green',
				},
				busy: {
					name: 'busy',
					color: 'red',
				}		
			},
			circle: {
				radius: '3',
				stroke: 'white',
				strokeWidth: '1',
				fill: 'black',
			},
		};
		this.g = {
			name: '',
			id: '',
			circles: [{}],
			path: {
				name: '',
				d: ''
			}	
		};
		var e; //Элемент <path>
		var d = []; //Свойство <path d="">
		this.parentE = p;
		
	};
	
	setActiveValue(e) {
		$(e).attr('value', this.params.pathActiveValue);
	};
	
	removeActiveValue() {
		var e = this.findActivePath();
		$(e).removeAttr('value')
	};

	findActivePath() {
		return $('[value='+this.params.pathActiveValue+']');
	}

	setStatusBusy() {
		this.setStatus('busy')
	};

	setStatusFree() {
		this.setStatus('free')
	}
	
	getPathID() {
		return $(this.e).attr('id');
	}

	setStatus(s) {
		var p = this.params;
		$(this.e).removeAttr('class');
		$(this.e).addClass(p.pathStatus[s].color);
		$(this.e).attr('status', p.pathStatus[s].name);
	};

	getStatus() {
		return $(this.e).attr("status");
	}
	
	removeIfEmpty() {
		console.log("Длина: ", this.getPoints().length);
		if (this.getPoints().length <= 2)
			$(this.e).remove();
	};

	newPoint(points, offset) {
		//Регулировка x,y в зависимости от смещения изображения
		var point = {
			x: points[0] - offset.top,
			y: points[1] - offset.left
		}
		points = this.getPoints();
		points.push(point);
		this.drawPath(points)
		this.createHost(point);
		console.log(dump(this.getPoints()));
	};
	
	newPointCoordinate(circle, points, offset, i) {
		console.log('newPC: '+circle+' | '+points+' | '+offset+' | '+i);
		var point = {
			x: points[0] - offset.top,
			y: points[1] - offset.left
		}
		$(circle).attr('cx', point.x);
		$(circle).attr('cy', point.y);
		points = this.getPoints();	
		
		points[i].x = point.x;
		points[i].y = point.y;
		this.drawPath(points);
	}

	getPointsCount() {
		var p = this.getPoints();
		return p.length-1;
	}

	getPoints() {
		var points = [];
		console.log($(this.e).attributes);
		var p = $(this.e).attr('d');
		console.log(p);
		p = p.replace(/(M|Z)/g, '').split(' ');
		for (var i = 0; i < p.length-1; i+=2) {
			points.push({
				x: p[i],
				y: p[i+1]
			});
		}
		
		return points;
	};

	useThisPath(e) {
		this.e = e;
		this.setActiveValue(this.e);
		this.d = this.getPoints();
	};

	getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}

	drawPath(p) {
		var d = '';
		$.each(p, function(i,point) {
			d += ''+point.x+' '+point.y+' ';
		});	
		$(this.e).attr('d', 'M'+d+'Z');
	};

	createHosts(p) {
		$.each(p, function(i, point) {
			this.createHost(point);
		});
	};
	
	createHost(point) {
		console.log('x: ', point.x, ' | y: ', point.y);
		var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		circle.setAttribute('cx', point.x);
		circle.setAttribute('cy', point.y);
		circle.setAttribute('r',		this.params.circle.radius);
		circle.setAttribute('stroke',	this.params.circle.stroke);
		circle.setAttribute('stroke-width',	this.params.circle.strokeWidth);
		circle.setAttribute('fill',		this.params.circle.fill);
		circle.setAttribute('class', 'tooltip');
		circle.setAttribute('title','x');
		circle.setAttribute('path_id', this.getPathID());
		circle.setAttribute('count', this.getPointsCount());
		$(this.parentE).append(circle);
	};
	
	createPath() {
		this.removeActiveValue();
		this.e = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		this.e.setAttribute('value', this.params.pathActiveValue);
		this.e.setAttribute('d', 'MZ');
		this.e.setAttribute('id', this.getRandomInt(10,10000));
		$(this.parentE).append(this.e);
		this.e = this.findActivePath();
		this.setActiveValue(this.e);
		this.setStatusFree(this.e);
	};		

}
