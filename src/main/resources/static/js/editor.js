var $ = layui.$;
function JsonProperty(object){
	this.object = object || {};
}
JsonProperty.prototype.set = function(key,value){
	this.object[key] = value;
}
JsonProperty.prototype.remove = function(key,value){
	delete this.object[key];
}
JsonProperty.prototype.get = function(key){
	return this.object[key];
}
$(function(){
	var resize = $('.resize-container')[0]
	resize.onmousedown = function(e){
	    var startX = e.clientX;
	    resize.left = resize.offsetLeft;
	    var box = $("body")[0];
	    document.onmousemove = function(e){
	      var endX = e.clientX;
	      var moveLen = resize.left + (endX - startX);
	      var maxT = box.clientWidth - resize.offsetWidth;
	      if(moveLen<150) moveLen = 150; 
	      if(moveLen>maxT-150) moveLen = maxT-150;
	      if(box.clientWidth - moveLen < 400 || box.clientWidth - moveLen > 800){
	      	return;
	      }
	      resize.style.left = moveLen + 'px';
	      $(".editor-container").css('right',($('body').width() - moveLen) + 'px')
	      $(".properties-container").width(box.clientWidth - moveLen - 5);
	    }
	    document.onmouseup = function(evt){
	    	document.onmousemove = null;
	    	document.onmouseup = null; 
	    	resize.releaseCapture && resize.releaseCapture();
	    }
	    resize.setCapture && resize.setCapture();
	    return false;
	  }
	var templateCache = {};
	function loadTemplate(template,cell,graph){
		var cells = graph.getModel().cells;
		var datasources = [];
		for(var index in cells){
			var data = cells[index].data;
			if(data && data.get('shape') == 'datasource'){
				datasources.push({
					id : index,
					name : cells[index].value
				});
			}
		}
		cell.data = cell.data || new JsonProperty();
		var render = function(){
			layui.laytpl(templateCache[template]).render({
				data : cell.data,
				value : cell.value,
				datasources : datasources
			},function(html){
				$(".properties-container").html(html);
				layui.form.render();
				processSelectValue(graph);
			})
		}
		if(templateCache[template]){
			render();
			return;
		}
		$.get('resources/templates/' + template +".html",function(content){
			templateCache[template] = content;
			render();
		});
	}
	if (!mxClient.isBrowserSupported()){
		layui.layer.msg('浏览器不支持!!');
	}else{
		var editor = new mxEditor();
		editor.setGraphContainer($('.editor-container')[0]);
		var graph = editor.graph;
		graph.setConnectable(true);
		graph.isHtmlLabel = function(cell){
			return !this.isSwimlane(cell);
		}
		window.editor = editor;
		//注册JSON编解码器
		registerJsonCodec();
		//设置样式
		configureStylesheet(graph);
		//绑定快捷键事件
		bindKeyAction(editor);
		//绑定工具条点击事件
		bindToolbarClickAction(editor);
		//加载图形
		loadShapes(editor,$('.sidebar-container')[0]);

		//选择节点事件
		graph.getSelectionModel().addListener(mxEvent.CHANGE, function(sender, evt){
			processCellEvent(graph.getSelectionCell(),graph);
		});
		//节点名称输入框事件
		$("body").on("mousewheel",".layui-tab .layui-tab-title",function(e,delta){
			var $dom = $(this);
			var wheel = e.originalEvent.wheelDelta || -e.originalEvent.detail;
		    var delta = Math.max(-1, Math.min(1, wheel) );
		    e.preventDefault = function(){}
		    if(delta > 0){
		        $dom.scrollLeft($dom.scrollLeft()-60);
			}else{
				$dom.scrollLeft($dom.scrollLeft()+60);
			}
			return false;
		}).on("keyup",".editor-form-node .layui-form-item input[name=value]",function(){
			var cell = graph.getSelectionCell();
			if(cell != null){
				var $input = $(this);
				var newValue = $(this).val();
				var oldValue = undefined;
				var inputName = $input.attr("name");
				oldValue = cell.getAttribute('value');
				if(newValue != oldValue){
					graph.getModel().beginUpdate();
					try{
						graph.getModel().execute(new mxCellAttributeChange(cell,'value',newValue));
						cell.setValue(newValue);
					}finally{
						graph.getModel().endUpdate();
					}
				}
			}
		}).on("keyup",".editor-form-node .layui-form-item input.input-default",function(){
			var cell = graph.getModel().getRoot();
			if(cell != null){
				cell.data = cell.data || new JsonProperty();
				cell.data.set($(this).attr('name'),$(this).val())
			}
		}).on("keyup",".editor-form-node .layui-form-item input[name^=variable-]",function(){	//变量操作
			resetFormArray(graph,'variable','variables');
		}).on("click",".editor-form-node .variable-remove",function(){	//移除单个变量
			var $dom = $(this).parent();
			$dom.prev().remove();
			$dom.next().remove();
			$dom.remove();
			resetFormArray(graph,'variable','variables');
		}).on("click",".editor-form-node .variable-add",function(){
			$(this).parent().parent().before('<div class="layui-form-item layui-form-relative"><i class="layui-icon layui-icon-close variable-remove"></i><label class="layui-form-label">变量名</label><div class="layui-input-block"><input type="text" name="variable-name" placeholder="变量名称" autocomplete="off" class="layui-input"></div></div><div class="layui-form-item"><label class="layui-form-label">变量值</label><div class="layui-input-block"><input type="text" name="variable-value" placeholder="请输入变量值" autocomplete="off" class="layui-input"></div></div><hr>');
		}).on("keyup",".editor-form-node .layui-form-item input[name^=header-]",function(e){	//Header操作
			resetFormArray(graph,'header','headers');
			e.stopPropagation();
		}).on("click",".editor-form-node .header-remove",function(){	//移除单个Header
			var $dom = $(this).parent();
			$dom.prev().remove();
			$dom.next().remove();
			$dom.remove();
			resetFormArray(graph,'header','headers');
		}).on("click",".editor-form-node .header-add",function(){
			$(this).parent().parent().before('<div class="layui-form-item layui-form-relative"><i class="layui-icon layui-icon-close header-remove"></i><label class="layui-form-label">Header名</label><div class="layui-input-block"><input type="text" name="header-name" placeholder="header key" autocomplete="off" class="layui-input"></div></div><div class="layui-form-item"><label class="layui-form-label">header值</label><div class="layui-input-block"><input type="text" name="header-value" placeholder="请输入header value" autocomplete="off" class="layui-input"></div></div><hr>');
		}).on("keyup",".editor-form-node .layui-form-item input[name^=parameter-]",function(e){	//参数操作
			resetFormArray(graph,'parameter','parameters');
			e.stopPropagation();
		}).on("click",".editor-form-node .parameter-remove",function(){	//移除单个参数
			var $dom = $(this).parent();
			$dom.prev().remove();
			$dom.next().remove();
			$dom.remove();
			resetFormArray(graph,'parameter','parameters');
		}).on("click",".editor-form-node .parameter-add",function(){
			$(this).parent().parent().before('<div class="layui-form-item layui-form-relative"><i class="layui-icon layui-icon-close parameter-remove"></i><label class="layui-form-label">参数名</label><div class="layui-input-block"><input type="text" name="parameter-name" placeholder="请输入参数名" autocomplete="off" class="layui-input"></div></div><div class="layui-form-item"><label class="layui-form-label">参数值</label><div class="layui-input-block"><input type="text" name="parameter-value" placeholder="请输入参数值" autocomplete="off" class="layui-input"></div></div><hr>');
		}).on("keyup",".editor-form-node .layui-form-item input[name^=output-]",function(e){	//输出项操作
			resetFormArray(graph,'output','outputs');
			e.stopPropagation();
		}).on("click",".editor-form-node .output-remove",function(){	//移除单个输出项
			var $dom = $(this).parent();
			$dom.prev().remove();
			$dom.next().remove();
			$dom.remove();
			resetFormArray(graph,'output','outputs');
		}).on("click",".editor-form-node .output-add",function(){
			$(this).parent().parent().before('<div class="layui-form-item layui-form-relative"><i class="layui-icon layui-icon-close output-remove"></i><label class="layui-form-label">输出项</label><div class="layui-input-block"><input type="text" name="output-name" placeholder="请输入输出项" autocomplete="off" class="layui-input"></div></div><div class="layui-form-item"><label class="layui-form-label">输出值</label><div class="layui-input-block"><input type="text" name="output-value" placeholder="请输入输出值" autocomplete="off" class="layui-input"></div></div><hr>');
		}).on("keyup",".editor-form-node input,.editor-form-node textarea",function(){
			var inputName = $(this).attr("name");
			if(inputName.indexOf('parameter-') != -1 || inputName.indexOf('header-') != -1 || inputName.indexOf('variable-') != -1 || inputName.indexOf('output-') != -1 || inputName=='value'){
				return;	
			}
			var cell = graph.getSelectionCell();
			if(cell != null){
				graph.getModel().beginUpdate();
				try{
					cell.data.set(inputName,$(this).val());
				}finally{
					graph.getModel().endUpdate();
				}
			}
		}).on('click','.btn-datasource-test',function(){
			var type = $("select[name=datasourceType]").val();
			var url = $("input[name=datasourceUrl]").val();
			var username = $("input[name=datasourceUsername]").val();
			var password = $("input[name=datasourcePassword]").val();
			console.log(type,url,username,password);
			var socket = createWebSocket({
				onopen : function(){
					socket.send(JSON.stringify({
						eventType : 'testDatasource',
						message : {
							type : type,
							url : url,
							username : username,
							password : password
						}
					}))
				},
				onmessage : function(e){
					var event = JSON.parse(e.data);
					var eventType = event.eventType;
					var message = event.message;
					if(eventType == 'error'){
						layui.layer.alert(message,{
							icon : 2
						})
					}else if(eventType == 'success'){
						layui.layer.msg(message)
					}
				}
			});
		})
		layui.form.on('select', function(data){
			processSelectValue(graph);
		});
		loadTemplate('root',graph.getModel().getRoot(),graph);
		var id = getQueryString('id');
		if(id != null){
			loadXML('spider/xml?id=' +  id,graph);
			processCellEvent(graph.getSelectionCell(),graph);
		}
	}
	
	function processSelectValue(graph){
		var cell = graph.getSelectionCell() || graph.getModel().getRoot();
		if(cell.data){
			$(".editor-form-node").find("select").each(function(){
				var $select = $(this);
				cell.data.set($select.attr('name'),$select.val());
			});
		}
		
	}
	/**
	 * 处理选择事件
	 */
	function processCellEvent(cell,graph){
		if(cell != null){
			if(cell.isEdge()){
				cell.data = cell.data || new JsonProperty();
				loadTemplate('edge',cell,graph);
			}else{
				cell.data = cell.data || new JsonProperty();
				if(cell.data.shape != 'start'){
					loadTemplate(cell.data.object.shape,cell,graph);	
				}
				
			}
		}else{
			loadTemplate('root',graph.getModel().getRoot(),graph);
		}
	}
	
	
	/**
	 * 重置已设表单array（参数、变量、Headers）
	 */
	function resetFormArray(graph,prefix,key){
		var cell = graph.getSelectionCell() || graph.getModel().getRoot();
		var array = [];
		var names = [];
		var values = [];
		$(".editor-form-node input[name="+prefix+"-name]").each(function(){
			names.push(this.value);
		});
		$(".editor-form-node input[name="+prefix+"-value]").each(function(){
			values.push(this.value);
		});
		for(var i=0,len = names.length;i<len;i++){
			array.push({
				name : names[i],
				value : values[i]
			});
		}
		cell.data.set(key,array)
	}
	/**
	 * 加载已保存的流程图
	 */
	function loadXML(xml,graph){
		var req = mxUtils.load(xml);
		var root = req.getDocumentElement();
		var dec = new mxCodec(root.ownerDocument);
		dec.decode(root, graph.getModel());
	}
	/**
	 * 添加JSON编解码器
	 */
	function registerJsonCodec(){
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
	/**
	 * 加载各种图形
	 */
	function loadShapes(editor,container){
		var createSVG =function(title,width,height,sw,sh,d,stroke,fill){
			var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
			var span = document.createElement('span');
			span.title = title;
			svg.setAttribute('width',width);
			svg.setAttribute('height',height);
			svg.setAttribute('viewBox','0 0 ' + sw +' ' + sh);
			var pathEl = document.createElementNS("http://www.w3.org/2000/svg",'path');
			pathEl.setAttribute('d',d);
			pathEl.setAttribute('stroke',stroke);
			pathEl.setAttribute('stroke-width',4);
			pathEl.setAttribute('fill',fill);
			svg.appendChild(pathEl);
			span.appendChild(svg);
			return span;
		}
		var root = mxUtils.load('resources/shapes.xml').getDocumentElement();
		var shape = root.firstChild;
		var graph = editor.graph;
		var parent = graph.getDefaultParent();
		var model = graph.getModel();
		var x = 50;
		var y = 50;
		while (shape != null){
			if (shape.nodeType == mxConstants.NODETYPE_ELEMENT){
				var shapeName = shape.getAttribute('name');
				mxStencilRegistry.addStencil(shapeName, new mxStencil(shape));
				if(shape.getAttribute('hidden') != '1'){
					var svg = createSVG(shape.getAttribute('title'),36,36,shape.getAttribute("w"),shape.getAttribute("h"),shape.getAttribute("d"),'#333','none');
					container.appendChild(svg);
					addSidebarShape(editor,graph,container,shape.getAttribute('title') || 'Label',svg,shapeName);
				}
				if(shape.getAttribute('default') == '1'){
					model.beginUpdate();
					var cell;
					try{
						cell = graph.insertVertex(parent, null, shape.getAttribute('title'), x, y, 80, 80,'shape=' + shapeName);
						cell.data = new JsonProperty();
						cell.data.set('shape',shapeName);
						x+=30;
						y+=30;
					}finally{
						model.endUpdate();
					}
				}
			}
			shape = shape.nextSibling;
		}
	}
	function insertShape(graph,label,x,y){
		
	}
	/**
	 * 设置拖拽事件
	 */
	function addSidebarShape(editor,graph, sidebar, label,svg,shape){
		var funct = function(graph, evt, cell, x, y){
			var parent = graph.getDefaultParent();
			var model = graph.getModel();
			model.beginUpdate();
			var cell;
			try{
				cell = graph.insertVertex(parent, null, label, x, y, 80, 80,'shape=' + shape);
				cell.data = new JsonProperty();
				cell.data.set('shape',shape);
			}finally{
				model.endUpdate();
			}
			editor.graph.setSelectionCell(cell);
		}
		var ds = mxUtils.makeDraggable(svg, graph, funct, null, 0, 0, true, true);
		ds.setGuidesEnabled(true);
	};	
	/**
	 * 设置全局样式
	 */
	function configureStylesheet(graph){
		var style = new Object();
		style = graph.getStylesheet().getDefaultEdgeStyle();
		style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
		style[mxConstants.STYLE_STROKECOLOR] = 'black';
		style[mxConstants.STYLE_STROKEWIDTH] = '2';
		style = graph.getStylesheet().getDefaultVertexStyle();
		style[mxConstants.STYLE_STROKECOLOR] = 'black';
		style[mxConstants.STYLE_FONTSIZE] = 14;
		graph.alternateEdgeStyle = 'elbow=vertical';
	};
	
	/**
	 * 删除所选
	 */
	function deleteSelectCells(graph){
		graph.escape();
		var selectCells = graph.getDeletableCells(graph.getSelectionCells());
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
			var parents = (graph.selectParentAfterDelete) ? graph.model.getParents(cells) : null;
			graph.removeCells(cells, true);
			if (parents != null){
				var select = [];
				for (var i = 0; i < parents.length; i++){
					if (graph.model.contains(parents[i]) &&
						(graph.model.isVertex(parents[i]) ||
						graph.model.isEdge(parents[i]))){
						select.push(parents[i]);
					}
				}
				graph.setSelectionCells(select);
			}
		}
	}
	
	/**
	 * 绑定工具条点击事件
	 */
	function bindToolbarClickAction(editor){
		var graph = editor.graph;
		$(".toolbar-container").on('click','.btn-delete',function(){
			deleteSelectCells(graph);
		}).on("click",".btn-selectAll",function(){
			editor.execute('selectAll');
		}).on('click',".btn-undo",function(){
			editor.execute('undo');
		}).on('click',".btn-redo",function(){
			editor.execute('redo');
		}).on('click',".btn-cut",function(){
			editor.execute('cut');
		}).on('click',".btn-copy",function(){
			editor.execute('copy');
		}).on('click',".btn-paste",function(){
			editor.execute('paste');
		}).on('click',".btn-console-xml",function(){
			console.log(mxUtils.getPrettyXml(new mxCodec(mxUtils.createXmlDocument()).encode(graph.getModel())));
		}).on('click','.btn-test',function(){
			layui.layer.open({
				id : 'test-window',
				content : '<div class="test-window-container"><div class="output-container"></div><div class="log-container"><textarea class="layui-input" resize="no"></textarea></div></div>',
				area : ["1000px","600px"],
				shade : 0,
				title : '测试窗口',
				success : function(){
					var tableMap = {};
					var $textarea = $(".test-window-container .log-container textarea")
					var socket = createWebSocket({
						onopen : function(){
							socket.send(JSON.stringify({
								eventType : 'test',
								message : getXML(editor)
							}));
						},
						onmessage : function(e){
							var event = JSON.parse(e.data);
							var eventType = event.eventType;
							var message = event.message;
							if(eventType == 'output'){
								var tableId = 'output-' + message.nodeId;
								var $table = $('#' + tableId);
								if($table.length == 0){
									$table = $('<table/>').appendTo($(".test-window-container .output-container"));
									$table.attr('id',tableId).attr("class","layui-table").attr("size","mini");
									var cols = [];
									for(var i =0,len = message.outputNames.length;i<len;i++){
										cols.push({
											field : message.outputNames[i],
											title : message.outputNames[i]
										})
									}
									tableMap[tableId] = {
										cols : [cols],
										data : []
									};
								}
								var row = {};
								for(var i =0,len = message.outputNames.length;i<len;i++){
									row[message.outputNames[i]] = message.values[i];
								}
								tableMap[tableId].data.unshift(row);
								if(tableMap[tableId].instance){
									tableMap[tableId].instance.reload({
										data : tableMap[tableId].data
									})
								}else{
									tableMap[tableId].instance = layui.table.render({
										elem : '#' + tableId,
										cols : tableMap[tableId].cols,
										data : tableMap[tableId].data,
										page : true,
										limit : 5,
										limits : [5]
									})
								}
							}else if(eventType == 'log'){
								var dom = $textarea[0];
								$textarea.append(message +'\r\n');
								dom.scrollTop = dom.scrollHeight;
							}
						}
					});
				}
			})
		}).on('click',".btn-return",function(){
			location.href="spiderList.html"
		}).on('click','.btn-save',function(){
			Save();
		})
	}
	
	function getXML(editor){
		return mxUtils.getPrettyXml(new mxCodec(mxUtils.createXmlDocument()).encode(editor.graph.getModel()));
	}
	/**
	 * 绑定快捷键事件
	 */
	function bindKeyAction(editor){
		var graph = editor.graph;
		var keyHandler = new mxKeyHandler(graph);
		keyHandler.getFunction = function(evt) {
			if (evt != null)
			{
				return (mxEvent.isControlDown(evt) || (mxClient.IS_MAC && evt.metaKey)) ? this.controlKeys[evt.keyCode] : this.normalKeys[evt.keyCode];
			}
			return null;
		};
		keyHandler.bindKey(46,function(e){	//按Delete
			deleteSelectCells(graph);
		})
		keyHandler.bindControlKey(90,function(){	//Ctrl+Z
			editor.execute('undo');
		})
		keyHandler.bindControlKey(89,function(){	//Ctrl+Y
			editor.execute('redo');
		})
		keyHandler.bindControlKey(88,function(){ // Ctrl+X
			editor.execute('cut');
		});
		keyHandler.bindControlKey(67, function(){	// Ctrl+C
			editor.execute('copy');
		});
		keyHandler.bindControlKey(86,function(){	// Ctrl+V
			editor.execute('paste');
		});
		keyHandler.bindControlKey(83,function(){	// Ctrl+S
			Save();
		});
		keyHandler.bindControlKey(81,function(){	// Ctrl+S
			$(".btn-test").click();
		});
		keyHandler.bindControlKey(65,function(){	// Ctrl+A
			editor.execute('selectAll');
		});
	}
	
	function createWebSocket(options){
		options = options || {};
		var socket = new WebSocket(options.url || (location.origin.replace("http",'ws') + '/ws'));
		socket.onopen = options.onopen;
		socket.onmessage = options.onmessage;
		socket.onerror = options.onerror || function(){
			layer.layer.msg('WebSocket错误');
		}
		return socket;
	}
	var flowId;
	function Save(){
		$.ajax({
			url : 'spider/save',
			type : 'post',
			data : {
				id : getQueryString('id') || flowId,
				xml : getXML(editor),
				name : $("[name=spiderName]").val(),
			},
			success : function(id) {
				flowId = id;
				layui.layer.msg('保存成功', {
					time : 800
				}, function() {
					// location.href = "spiderList.html";
				})
			}
		})
	}
	
});
