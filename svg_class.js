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
	
	constructor() {
		this.params = {
			pathActiveID: 'active_path',
			pathStatus: {
				free: {
					name: 'free',
					color: 'green',
				},
				busy: {
					name: 'busy',
					color: 'red',
				}		
			}
		};
		
		var e; //Элемент <path>
		var d = []; //Свойство <path d="">
		
	};
	
	setActiveID(e) {
		var p = this.params;
		$(e).attr('id', p.pathActiveID);
	};
	
	removeActiveID() {
		var e = this.findActivePath();
		$(e).removeAttr('id')
	};

	findActivePath() {
		return $('#'+this.params.pathActiveID);
	}

	setStatusBusy() {
		this.setStatus('busy')
	};

	setStatusFree() {
		this.setStatus('free')
	}

	setStatus(s) {
		var p = this.params;
		$(this.e).removeAttr('class');
		$(this.e).addClass(p.pathStatus[s].color);
		$(this.e).attr('text', p.pathStatus[s].name);
	};

	getStatus() {
		return $(this.e).attr("text");
	}
	
	removeIfEmpty() {
		console.log(this.getPoints().length);
		if (this.getPoints().length < 2)
			$(this.e).remove();
	};

	newPoint(points, offset) {
		//Регулировка x,y в зависимости
		//от смещения изображения
		var point = {
			x: points[0] - offset.top,
			y: points[1] - offset.left
		}
		points = this.getPoints();
		points.push(point);
		this.drawPath(points)
	};

	getPoints() {
		var points = [];
		var p = $(this.e).attr('d');
		p = p.replace(/(M|Z)/g, '').split(' ');
		for (var i = 0; i < p.length-1; i+=2) {
			points.push({
				x: p[i],
				y: p[i+1]
			});
		}
		
		return points;
	};

	usePath(e) {
		this.e = e;
	};

	drawPath(p) {
		console.log(dump(p));
		var d = '';
		$.each(p, function(i,point) {
			console.log("each: ",point.x, point.y);
			d += ''+point.x+' '+point.y+' ';
		});	
		console.log("d: ", d);
		$(this.e).attr('d', 'M'+d+'Z');
	};

	createPath(parentE, imgE) {
		this.removeActiveID();
		this.e = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		this.e.setAttribute('id', this.params.pathActiveID);
		this.e.setAttribute('d', 'MZ');
		$(parentE).append(this.e);
		this.e = this.findActivePath();
		this.setActiveID(this.e);
		this.setStatusFree(this.e);
	};		

	getThisPath(e) {
		this.e = e;
		this.setActiveID(this.e);
	}

	
}
