window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback,element){
	window.setTimeout(callback, 1000 / 60);
}
window.cancelAnimationFrame=window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame || window.oCancelAnimationFrame || function( id ){
	window.clearTimeout( id );
}
var canvas = document.getElementById('logviewer');
function CanvasText(options){
	options = options || {};
	this.maxWidth = options.maxWidth || 2147483648;
	this.color = options.color;
	this.text = options.text.toString();
	this.click = options.click;
	this.startX = 0;
	this.endX = 0;
}
function CanvasViewer(options){
	options = options || {};
	this.canvas = options.element;
	this.context = this.canvas.getContext('2d');
	this.style = options.style || {};
	this.context.font = this.style.font || 'bold 14px Consolas';
	this.context.textBaseline = this.style.textBaseLine || 'middle';
	this.lines = [];
	this.sourceLines = [];
	this.lineHeight = 24;
	this.maxRows = Math.ceil(this.canvas.height  / this.lineHeight);
	this.scrollHeight = this.canvas.height;
	this.scrollTop = 0;
	var _this = this;
	this.mouseEvent = 0;
	this.mouseDownX = 0;
	this.mouseDownY = 0;
	this.startIndex = 0;
	this.startX = 5;
	this.mouseX = 0;
	this.mouseY = 0;
	this.colsOffsetX = [0];
	this.filterText = '';
	this.maxWidth = this.canvas.width - 8;
	this.onClick = options.onClick || function(){};
	this.grid = options.grid;
	this.header = options.header;
	this.canvas.onmousemove = function(e){
		var x = e.offsetX;
		var y = e.offsetY;
		_this.mouseX = x;
		_this.mouseY = y;
		var _hover = false;
		if(x < _this.canvas.width - 8 && y < _this.canvas.height - 8){
			var row = _this.startIndex + parseInt(y / _this.lineHeight) + (y % _this.lineHeight == 0 ? 0 : 1) - 1;
			var texts = _this.lines[row];
			if(texts){
				for(var i =0,len = texts.length;i<len;i++){
					var text = texts[i];
					if(text.click&&text.startX < x && text.endX > x){
						_hover = true;
						break;
					}
				}
			}
		}
		if(_hover){
			_this.canvas.style.cursor = 'pointer';
		}else{
			_this.canvas.style.cursor = 'default';
		}
		//鼠标按下且有纵向滚动条
		if(_this.mouseEvent == 1 && _this.hasScroll){
			_this.scrollTo(Math.max(Math.min(Math.floor((y / (_this.canvas.height - 8)) * _this.lines.length - _this.maxRows / 2),_this.lines.length - _this.maxRows),0));
		}
		//鼠标按下且有横向滚动条
		if(_this.mouseEvent == 2 && _this.hasXScroll){
			var delta = e.offsetX - _this.mouseDownX;
			_this.mouseDownX = e.offsetX;
			var canvasWidth = _this.canvas.width - 8;
			_this.startX = Math.max(Math.min(_this.startX - (canvasWidth / _this.slideWidth) * delta,_this.grid ? 5 : 0),canvasWidth - _this.maxWidth)
		}
		
	}
	this.canvas.onmousewheel = function(e){
		if(e.wheelDelta > 0){	//向上滚动
			_this.scrollTo(Math.max(_this.startIndex - 2,0));
		}else{
			_this.scrollTo(Math.max(Math.min(_this.startIndex + 1,_this.lines.length - _this.maxRows),0));
		}
	}
	this.canvas.onmousedown = function(e){
		if(e.offsetX > _this.canvas.width - 8 && e.offsetY < _this.canvas.height - 8){
			_this.mouseEvent = 1;
			_this.mouseDownX = e.offsetX;
			_this.mouseDownY = e.offsetY;
		}
		if(e.offsetX < _this.canvas.width - 8 && e.offsetY > _this.canvas.height - 8){
			_this.mouseEvent = 2;
			_this.mouseDownX = e.offsetX;
			_this.mouseDownY = e.offsetY;
		}
	}
	this.canvas.onmouseup = this.canvas.onmouseout = function(){
		_this.mouseEvent = 0;
		_this.mouseDownX = 0;
		_this.mouseDownY = 0;
	}
	this.canvas.onclick = function(e){
		var x = e.offsetX;
		var y = e.offsetY;
		if(x < _this.canvas.width - 8 && y < _this.canvas.height - 8){
			var row = _this.startIndex + parseInt(y / _this.lineHeight) + (y % _this.lineHeight == 0 ? 0 : 1) - 1;
			var _hover = false;
			var texts = _this.lines[row];
			if(texts){
				for(var i =0,len = texts.length;i<len;i++){
					var text = texts[i];
					if(text.click&&text.startX < x && text.endX > x){
						_this.onClick(text);
						break;
					}
				}
			}
		}
		
	}
	var animate = function(){
		_this.animateIndex = requestAnimFrame(animate);
		_this.redraw();
	}
	animate();
}
CanvasViewer.prototype.destory = function(){
	cancelAnimationFrame(this.animateIndex);
	this.texts = null;
}
CanvasViewer.prototype.append = function(texts){
	this.sourceLines.push(texts);
	if(this.filterLine(texts)){
		this.calcMaxWidth(texts);
		this.lines.push(texts);
	}
}
CanvasViewer.prototype.calcMaxWidth = function(texts){
	var width = texts.length * 10 - 10;
	for(var i =0,len = texts.length;i<len;i++){
		var text = texts[i];
		var w = 0;
		if(text.maxWidth > 0){
			w = this._drawLongText(text.text,0,0,text.maxWidth,true);
		}else{
			w = this.context.measureText(content).width;
		}
		this.colsOffsetX[i] = Math.max(this.colsOffsetX[i] || 0,w);
		width += ((this.grid ? this.colsOffsetX[i] : 0) ||  w);
	}
	this.maxWidth = Math.max(this.maxWidth,width);
}
CanvasViewer.prototype.filter = function(content){
	this.filterText = content;
	var nLines = [];
	for(var i=0,len = this.sourceLines.length;i<len;i++){
		var sourceLine = this.sourceLines[i];
		if(this.filterLine(this.sourceLines[i],content)){
			this.calcMaxWidth(sourceLine);
			nLines.push(sourceLine);
		}
	}
	this.lines = nLines;
	this.scrollTo(-1);
}
CanvasViewer.prototype.filterLine = function(line){
	if(!this.filterText){
		return true;
	}
	var text = [];
	for(var j=0,l = line.length;j<l;j++){
		text.push(line[j].text);
	}
	return text.join('').indexOf(this.filterText) > -1;
}
CanvasViewer.prototype.resize = function(){
	var prevMaxRows = this.maxRows;
	this.maxRows = Math.ceil(this.canvas.height  / this.lineHeight);
	this.context = this.canvas.getContext('2d');
	this.context.font = 'bold 14px Consolas';
	this.context.textBaseline = 'middle';
	this.scrollTo(this.startIndex + (prevMaxRows - this.maxRows));
	this.redraw();
}
CanvasViewer.prototype._drawScroll = function(){
	var surplus = this.lines.length - this.maxRows;
	this.hasScroll = surplus > 0;
	
	this.context.clearRect(x,canvasHeight,8,8);
	if(this.hasScroll){
		var canvasHeight = this.canvas.height - 8;
		this.scrollHeight = canvasHeight + this.lineHeight * surplus;
		this.slideHeight = Math.max(canvasHeight * (canvasHeight / this.scrollHeight),10);
		this.scrollTop = Math.min(this.startIndex / this.lines.length * canvasHeight,canvasHeight - this.slideHeight);
		this.context.save(); 
		this.context.beginPath();
		var x = this.canvas.width - 8;
		var y = this.scrollTop;
		var r = 4;
		var width = 8;
		var height = this.slideHeight;
		this.context.fillStyle = '#f1f1f1';
		this.context.fillRect(x,0,8,canvasHeight);
	
		
		this.context.moveTo(x + r, y);
		this.context.arcTo(x + width, y, x + width, y + r, r);  
		this.context.arcTo(x + width, y + height, x + width - r, y + height, r); 
		this.context.arcTo(x, y + height, x, y + height - r, r);
		this.context.arcTo(x, y, x + r, y, r);
		if(this.mouseEvent == 1){
			this.context.fillStyle = '#787878';
		}else if(this.mouseX > x && this.mouseY > y &&this.mouseY < y + height){
			this.context.fillStyle = '#a8a8a8';
		}else{
			this.context.fillStyle = '#c1c1c1';
		}
		this.context.fill();
		this.context.restore(); 
	}
	//
	this.hasXScroll = this.maxWidth > this.canvas.width - 8;
	if(this.hasXScroll){
		var canvasWidth = this.canvas.width - 8;
		this.scrollWidth = this.maxWidth;
		this.slideWidth = Math.max(canvasWidth * (canvasWidth / this.scrollWidth),10);
		
		this.scrollLeft = Math.min(-this.startX / this.maxWidth * canvasWidth,canvasWidth - this.slideWidth);
		this.context.save(); 
		this.context.beginPath();
		var x = this.scrollLeft;
		var y = this.canvas.height - 8;
		var r = 4;
		var width = this.slideWidth;
		var height = 8;
		this.context.fillStyle = '#f1f1f1';
		this.context.fillRect(0,this.canvas.height - 8,canvasWidth,8);
		
		this.context.moveTo(x + r, y);
		this.context.arcTo(x + width, y, x + width, y + r, r);  
		this.context.arcTo(x + width, y + height, x + width - r, y + height, r); 
		this.context.arcTo(x, y + height, x, y + height - r, r);
		this.context.arcTo(x, y, x + r, y, r);
		if(this.mouseEvent == 2){
			this.context.fillStyle = '#787878';
		}else if(this.mouseX > x && this.mouseY > y &&this.mouseX < x + width){
			this.context.fillStyle = '#a8a8a8';
		}else{
			this.context.fillStyle = '#c1c1c1';
		}
		this.context.fill();
		this.context.restore(); 
	}
}
CanvasViewer.prototype.scrollTo = function(index){
	if(index < 0){
		index = this.lines.length - 1;
	}
	this.startIndex = Math.max(Math.min(Math.max(index,0),this.lines.length - this.maxRows),0);
	if(this.startIndex > 0){
		this.startIndex = this.startIndex + 1;
	}
}
CanvasViewer.prototype.redraw = function(){
	var lines = this.lines.slice(this.startIndex,this.startIndex + this.maxRows);
	this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	this.context.lineWidth = 1;
	this.context.strokeStyle = '#e6e6e6';
	this.context.font = this.style.font || 'bold 14px Consolas';
	this.context.textBaseline = this.style.textBaseLine || 'middle';
	var cols = [0];
	var maxY = 0;
	var maxX = 0;
	for(var i=0,l =lines.length;i<l;i++){
		var texts = i==0&&this.grid&&this.header ? this.lines[0]: lines[i];
		var x = this.startX;
		var y = i * this.lineHeight + this.lineHeight / 2;
		maxY = y + this.lineHeight / 2;
		for(var j =0,t = texts.length;j < t;j++){
			var text = texts[j];
			var content = text.text;
			this.context.fillStyle = text.color || 'black';
			var width = this.context.measureText(content).width;
			if(text.maxWidth > 0){
				width = this._drawLongText(content,x,y,text.maxWidth);
			}else{
				this.context.fillText(content,x,y);
			}
			text.startX = x;
			text.endX = x + width;
			x = x + ((this.grid ? this.colsOffsetX[j] : 0) ||  width) + 10;
			maxX = x - 5;
			if(this.grid){
				cols[j + 1] = Math.max(cols[j + 1] || 0,maxX);
			}
		}
	}
	if(this.grid && lines.length > 0){
		for(var i=0;i<=lines.length;i++){
			if(this.grid){
				this.context.save();
				this.context.beginPath();
				this.context.moveTo(2.5,i * 24 + 0.5);
				this.context.lineTo(maxX + 0.5, i * 24 + 0.5);
				this.context.stroke();
				this.context.restore();
			}
		}
		for(var i=0;i < cols.length;i++){
			var x = cols[i];
			this.context.save();
			this.context.beginPath();
			this.context.moveTo(x + 0.5,0.5);
			this.context.lineTo(x + 0.5, maxY);
			this.context.stroke();
			this.context.restore();
		}
	}
	this._drawScroll();
}
CanvasViewer.prototype._drawLongText = function(text,x,y,maxWidth,calcWidth){
	var length = text.length;
	var index = 0;
	var width = 0;
	while(index < length){
		var str = text.substr(index,1);
		var w = this.context.measureText(str).width;
		width+= w;
		if(width > maxWidth){
			width-=w;
			break;
		}
		if(calcWidth === undefined){
			this.context.fillText(str,x + width - w,y);
		}
		index++;
	}
	if(index < length){
		var w = this.context.measureText('...').width;
		width+=w;
		if(calcWidth === undefined){
			this.context.fillText('...',x + width - w,y);
		}
		
	}
	return width;
}