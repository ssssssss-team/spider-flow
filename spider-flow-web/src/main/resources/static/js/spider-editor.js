function JsonProperty(object){
	this.object = object || {};
}
JsonProperty.prototype.reset = function(object){
	return this.object = object;
}
JsonProperty.prototype.set = function(key,value){
	return this.object[key] = value;
}
JsonProperty.prototype.get = function(key){
	return this.object[key]
}
function SpiderEditor(options){
	options = options || {};
	var emptyFunction = function(){}
	this.selectedCellListener = options.selectedCellListener || emptyFunction;
	if(mxClient.isBrowserSupported()){
		this.editor = new mxEditor();
		this.editor.setGraphContainer(options.element);
		this.graph = this.editor.graph;
		this.graph.setConnectable(true);
		this.graph.setMultigraph(false);	//禁止重复连接
		this.graph.setAllowLoops(true);		//允许自己连自己
		this.graph.isHtmlLabel = function(cell){
			return !this.isSwimlane(cell);
		}
		mxConstants.MIN_HOTSPOT_SIZE = 16;
		mxGraphHandler.prototype.guidesEnabled = true
		//注册json编码器
		this.registerJsonCodec();
		//配置样式
		this.configureStylesheet();
		this.keyHandler = new mxKeyHandler(this.graph);
		this.keyHandler.getFunction = function(evt) {
			if (evt != null)
			{
				return (mxEvent.isControlDown(evt) || (mxClient.IS_MAC && evt.metaKey)) ? this.controlKeys[evt.keyCode] : this.normalKeys[evt.keyCode];
			}
			return null;
		}
		this.bindKeyAction();
		var _this = this;
		//选择节点事件
		this.graph.getSelectionModel().addListener(mxEvent.CHANGE,function(sender,evt){
			_this.onSelectedCell(sender,evt);
		});
	}
}
SpiderEditor.prototype.bindKeyAction = function(){
	var _this = this;
	this.keyHandler.bindKey(46,function(){	//按Delete
		_this.deleteSelectCells();
	});
	this.keyHandler.bindControlKey(90,function(){	//Ctrl+Z
		_this.execute('undo');
	})
	this.keyHandler.bindControlKey(89,function(){	//Ctrl+Y
		_this.execute('redo');
	})
	this.keyHandler.bindControlKey(88,function(){ // Ctrl+X
		_this.execute('cut');
	});
	this.keyHandler.bindControlKey(67, function(){	// Ctrl+C
		_this.execute('copy');
	});
	this.keyHandler.bindControlKey(86,function(){	// Ctrl+V
		_this.execute('paste');
	});
	/*keyHandler.bindControlKey(83,function(){	// Ctrl+S
		Save();
	});
	keyHandler.bindControlKey(81,function(){	// Ctrl+S
		$(".btn-test").click();
	});*/
	this.keyHandler.bindControlKey(65,function(){	// Ctrl+A
		editor.execute('selectAll');
	});
}
SpiderEditor.prototype.configureStylesheet = function(){
	var style = new Object();
	style = this.graph.getStylesheet().getDefaultEdgeStyle();
	//style[mxConstants.STYLE_EDGE] = mxEdgeStyle.OrthConnector;
	style[mxConstants.STYLE_STROKECOLOR] = 'black';
	style[mxConstants.STYLE_STROKEWIDTH] = '2';
	style = this.graph.getStylesheet().getDefaultVertexStyle();
	style[mxConstants.STYLE_STROKECOLOR] = 'black';
	style[mxConstants.STYLE_FONTSIZE] = 12;
	this.graph.alternateEdgeStyle = 'elbow=vertical';
}
SpiderEditor.prototype.deleteSelectCells = function(){
	this.graph.escape();
	var selectCells = this.graph.getDeletableCells(this.graph.getSelectionCells());
	if (selectCells != null && selectCells.length > 0){
		var cells = [];
		for(var i =0,len = selectCells.length;i<len;i++){
			var cell = selectCells[i];
			if((!cell.isVertex())||(cell.data&&cell.data.get('shape') != 'start')){
				cells.push(cell);
			}
		}
		if(cells.length == 0){
			return;
		}
		var parents = (this.graph.selectParentAfterDelete) ? this.graph.model.getParents(cells) : null;
		this.graph.removeCells(cells, true);
		if (parents != null){
			var select = [];
			for (var i = 0; i < parents.length; i++){
				if (this.graph.model.contains(parents[i]) &&
					(this.graph.model.isVertex(parents[i]) ||
					this.graph.model.isEdge(parents[i]))){
					select.push(parents[i]);
				}
			}
			this.graph.setSelectionCells(select);
		}
	}
}
SpiderEditor.prototype.addShape = function(shape,label,element,defaultAdd){
	var style = new Object();
	style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
	style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
	style[mxConstants.STYLE_IMAGE_WIDTH] = 32;
	style[mxConstants.STYLE_IMAGE_HEIGHT] = 32;
	style[mxConstants.STYLE_IMAGE] = element.src;
	style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
	style[mxConstants.STYLE_FONTCOLOR] = '#000000';
	style[mxConstants.STYLE_SPACING_TOP] = -26;
	this.graph.getStylesheet().putCellStyle(shape,style);
	var _this = this;
	var funct = function(graph, evt, cell, x, y){
		var parent = _this.graph.getDefaultParent();
		var model = _this.graph.getModel();
		model.beginUpdate();
		var cell;
		try{
			cell = _this.graph.insertVertex(parent, null, label, x, y, 32, 32,shape);
			cell.data = new JsonProperty();
			cell.data.set('shape',shape);
		}finally{
			model.endUpdate();
		}
		_this.graph.setSelectionCell(cell);
	}
	var dragElt = document.createElement('div');
	dragElt.style.border = 'dashed black 1px';
	dragElt.style.width = '32px';
	dragElt.style.height = '32px';
	var ds = mxUtils.makeDraggable(element, this.graph, funct, dragElt, 0, 0, true, true);
	ds.setGuidesEnabled(true);
	if(defaultAdd){
		var parent = this.graph.getDefaultParent();
		var model = this.graph.getModel();
		model.beginUpdate();
		try{
			cell = this.graph.insertVertex(parent, null, label, 80, 80, 32, 32,shape);
			cell.data = new JsonProperty();
			cell.data.set('shape',shape);
		}finally{
			model.endUpdate();
		}
	}
}
SpiderEditor.prototype.registerJsonCodec = function(){
	var codec = new mxObjectCodec(new JsonProperty());
	codec.encode = function(enc,obj){
		var node = enc.document.createElement('JsonProperty');
		mxUtils.setTextContent(node, JSON.stringify(obj.object));
		return node;
	}
	codec.decode = function(dec, node, into){
		return new JsonProperty(JSON.parse(mxUtils.getTextContent(node)));
	}
	mxCodecRegistry.register(codec);
}
SpiderEditor.prototype.onSelectedCell = function(sender,evt){
	this.selectedCellListener(this.getSelectedCell());
}
SpiderEditor.prototype.getModel = function(){
	return this.graph.getModel();
}
SpiderEditor.prototype.execute = function(action){
	this.editor.execute(action);
}
SpiderEditor.prototype.getSelectedCell = function(){
	var cell = this.graph.getSelectionCell() || this.graph.getModel().getRoot();
	cell.data = cell.data || new JsonProperty();
	return cell;
}
SpiderEditor.prototype.getXML = function(){
	return mxUtils.getPrettyXml(new mxCodec(mxUtils.createXmlDocument()).encode(this.graph.getModel()));
}
SpiderEditor.prototype.setXML = function(xml){
	var doc = mxUtils.parseXml(xml);
	var root = doc.documentElement;
	var dec = new mxCodec(root.ownerDocument);
	dec.decode(root,this.getModel());
}
SpiderEditor.prototype.importFromUrl = function(url){
	var req = mxUtils.load(url);
	var root = req.getDocumentElement();
	var dec = new mxCodec(root.ownerDocument);
	dec.decode(root, this.getModel());
}