var $ = layui.$;
var editor;
var flows;
var codeMirrorInstances = {};
function renderCodeMirror(){
	codeMirrorInstances = {};
	$('[codemirror]').each(function(){
		var $dom = $(this);
		if($dom.attr("rendered") == 'true'){
			return;
		}
		$dom.attr("rendered",true)
		var cm = CodeMirror(this,{
			mode : 'spiderflow',	//语法
			theme : 'idea',	//设置样式
			placeholder : $dom.attr("placeholder"),
			value : $dom.attr('data-value') || '',
			scrollbarStyle : 'null',	//隐藏滚动条
		});
		initHint(cm);
		codeMirrorInstances[$(this).attr('codemirror')] = cm;
		cm.on('change',function(){
			$dom.attr('data-value',cm.getValue());
			if($dom.attr('codemirror') == 'condition'){
				var $select = $('select[name="exception-flow"]');
				$select.siblings("div.layui-form-select").find('dl dd[lay-value=' + $select.val() + ']').click();
			}
			serializeForm();
		});
		codeMirrorInstances[$(this).attr('codemirror')] = cm;
	});
}
function getCellData(cellId,keys){
	var cell = editor.getModel().getCell(cellId);
	var data = [];
	var object = cell.data.object;
	for(var k in keys){
		var key = keys[k];
		if(Array.isArray(object[key])){
			var array = object[key];
			for(var i =0,len = array.length;i<len;i++){
				data[i] = data[i] || {};
				data[i][key] = array[i];
			}
		}
	}
	return data;
}
function serializeForm(){
	var cellId = $(".properties-container").attr('data-cellid');
	var model = editor.getModel();
	var cell = model.getCell(cellId);
	if(!cell){
		return;
	}
	var shape = cell.data.get('shape');
	cell.data.reset({});
	$.each($(".properties-container form").serializeArray(),function(index,item){
		var name = item.name;
		var value = item.value;
		if($(".properties-container form *[name="+name+"].array").length > 0){
			var array = cell.data.get(name) || [];
			array.push(value);
			cell.data.set(name,array);
		}else{
			if(name == 'value'){
				if(cell.getValue() != value){
					model.beginUpdate();
					try{
						cell.setValue(value);
						model.execute(new mxValueChange(model,cell,value));
					}finally{
						model.endUpdate();
					}
				}
			}
			if(name == 'lineWidth'){
				editor.graph.setCellStyles('strokeWidth',value,[cell]);
			}
			if(name == 'line-style'){
				editor.graph.setCellStyles('sharp',undefined,[cell]);
				editor.graph.setCellStyles('rounded',undefined,[cell]);
				editor.graph.setCellStyles('curved',undefined,[cell]);
				editor.graph.setCellStyles(value,1,[cell]);
			}
			cell.data.set(name,value);
		}
	});
	$(".properties-container form [codemirror]").each(function(){
		var $dom = $(this);
		var name = $dom.attr('codemirror');
		var value = $dom.attr('data-value');
		if($dom.hasClass("array")){
			var array = cell.data.get(name) || [];
			array.push(value);
			cell.data.set(name,array);
		}else{
			cell.data.set(name,value);
		}
	});
	$(".properties-container form input[type=checkbox]").each(function(){
		if(this.value == 'transmit-variable'){
			if($(this).is(":checked")){
				editor.graph.setCellStyles('dashed',undefined,[cell]);
			}else{
				editor.graph.setCellStyles('dashed',1,[cell]);
			}
		}
		cell.data.set(this.value,$(this).is(":checked") ? '1': '0');
	});
	cell.data.set('shape',shape);
}
function resizeSlideBar(){
	var $dom = $(".sidebar-container");
	var height = $dom.height();
	var len = $dom.find("img").length;
	var totalHeight = len * 46;
	var w = Math.ceil(totalHeight / height);
	$dom.width(w * 50);
	$(".editor-container,.xml-container").css("left",w * 50 + "px");
}

function validXML(callback){
	var cell = editor.valid();
	if(cell){
		layui.layer.confirm("检测到有箭头未连接到节点上，是否处理？",{
			title : '异常处理',
			btn : ['处理','忽略'],
		},function(index){
			layui.layer.close(index);
			editor.selectCell(cell);
		},function(){
			callback&&callback();
		})
	}else{
		callback&&callback();
	}
}
$(function(){
	$.ajax({
		url : 'spider/other',
		type : 'post',
		data : {
			id : getQueryString('id')
		},
		dataType : 'json',
		success : function(others){
			flows = others;
		}
	})
	$.ctrl = function(key, callback, args) {
	    var isCtrl = false;
	    $(document).keydown(function(e) {
	        if(!args) args=[];
	        if(e.keyCode == 17) isCtrl = true;
	        if(e.keyCode == key.charCodeAt(0) && isCtrl) {
	            callback.apply(this, args);
	            isCtrl = false;
	            return false;
	        }
	    }).keyup(function(e) {
	        if(e.keyCode == 17) isCtrl = false;
	    });        
	};
	$.ctrl('S', function() {
		$('input,textarea').blur();
		Save();
	});
	$.ctrl('Q', function() {
		$('input,textarea').blur();
		$(".btn-test").click();
	});
	var resize = $('.resize-container')[0]
	resize.onmousedown = function(e){
	    var startY = e.clientY;
	    resize.top = resize.offsetTop;
	    var box = $("body")[0];
		var maxT = box.clientHeight;
	    document.onmousemove = function(e){
	      var moveLen = e.clientY;
	      if(moveLen<250) moveLen = 250;
	      if(moveLen>maxT-150) moveLen = maxT-150;
	      resize.style.top = moveLen + 'px';
	      resizeSlideBar();
	      $(".editor-container,.sidebar-container,.xml-container").css('bottom',($('body').height() - moveLen) + 'px');
	      $(".properties-container").height(box.clientHeight - moveLen - 5);
	    }
	    document.onmouseup = function(evt){
	    	document.onmousemove = null;
	    	document.onmouseup = null; 
	    	resize.releaseCapture && resize.releaseCapture();
	    }
	    resize.setCapture && resize.setCapture();
	    return false;
	}
	resizeSlideBar();
	var templateCache = {};
	function loadTemplate(cell,model,callback){
		serializeForm();
		var cells = model.cells;
		var template = cell.data.get('shape') || 'root';
		if(cell.isEdge()){
			template = 'edge';
		}
		var render = function(){
			layui.laytpl(templateCache[template]).render({
				data : cell.data,
				value : cell.value,
				flows : flows || [],
				model : model,
				cell : cell
			},function(html){
				$(".properties-container").html(html).attr('data-cellid',cell.id);
				layui.form.render();
				renderCodeMirror();
				resizeSlideBar();
				callback&&callback();
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
		editor = new SpiderEditor({
			element : $('.editor-container')[0],
			selectedCellListener : function(cell){	//选中节点后打开属性面板
				loadTemplate(cell,editor.getModel(),serializeForm);
			}
		});
		//绑定工具条点击事件
		bindToolbarClickAction(editor);
		//加载图形
		loadShapes(editor,$('.sidebar-container')[0]);
		layui.form.on('checkbox',function(e){
			serializeForm();
		});
		layui.table.on('tool',function(obj){
			layui.layer.confirm('您确定要删除吗？',{
				title : '删除'
			},function(index) {
				obj.del();
				serializeForm();
				renderCodeMirror();
				layui.layer.close(index);
			});
		})
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
		}).on("dblclick",".layui-input-block[codemirror]",function(){
			if($(this).parent().hasClass("layui-layer-content")){
				return;
			}
			layui.layer.open({
				type : 1,
				title : '请输入'+$(this).prev().html()+'表达式',
				content : $(this),
				skin : 'codemirror',
				area : '800px'
			})
		}).on("blur","input,textarea",function(){
			serializeForm();
		}).on("click",".table-row-add",function(){	//添加一行
			serializeForm();
			var tableId = $(this).attr('for');
			var $table = $('#' + tableId);
			var cellId = $table.data('cell');
			var data = getCellData(cellId,$table.data('keys').split(","));
			data.push({});
			layui.table.reload(tableId,{
				data : data
			});
			renderCodeMirror();
		}).on("click",".table-row-up",function(){	//上移
			var current = $(this).parent().parent().parent(); //获取当前<tr>
			var prev = current.prev();  //获取当前<tr>前一个元素
			if (current.index() > 0) {
				current.insertBefore(prev); //插入到当前<tr>前一个元素前
				serializeForm();
			}
			renderCodeMirror();
		}).on("click",".table-row-down",function(){	//下移
			var current = $(this).parent().parent().parent(); //获取当前<tr>
			var next = current.next(); //获取当前<tr>后面一个元素
			if (next) {
				current.insertAfter(next);  //插入到当前<tr>后面一个元素后面
				serializeForm();
			}
			renderCodeMirror();
		}).on("click",".editor-form-node .function-remove,.editor-form-node .cmd-remove",function () {
			var $dom = $(this).parents(".draggable");
			$dom.remove();
			serializeForm();
		}).on("click",".editor-form-node .cookie-batch",function(){
			var tableId = $(this).attr('for');
			var $table = $('#' + tableId);
			var cellId = $table.data('cell');
			var data = getCellData(cellId,$table.data('keys').split(","));
			layui.layer.open({
				type : 1,
				title : '请输入Cookie',
				content : `<textarea id="cookies" name="cookies" placeholder="请输入Cookies，分号( ; )分隔Cookie，等于号( = )分隔name和value" autocomplete="off" class="layui-textarea"  lay-verify="required" style="height:250px"></textarea>`,
				area : '800px',
				btn : ['关闭','设置'],
				btn2 : function(){
					var cookieStr = $("#cookies").val();
					var cookieArr = cookieStr.split(";");
					var length = $(".draggable").length;
					serializeForm();
					for (var i = 0; i < cookieArr.length; i++) {
						var cookieItem = cookieArr[i];
						var index = cookieItem.indexOf("=");
						if (index < 0) {
							layer.alert('cookie数据格式错误');
							appendFlag = false;
							return;
						} else {
							data.push({
								'cookie-name' : $.trim(cookieItem.substring(0, index)),
								'cookie-value' : $.trim(cookieItem.substring(index + 1))
							})
						}
					}
					layui.table.reload(tableId,{
						data : data
					});
					renderCodeMirror();
					serializeForm();
				}
			})
		}).on("click",".editor-form-node .header-batch",function(){
			var tableId = $(this).attr('for');
			var $table = $('#' + tableId);
			var cellId = $table.data('cell');
			var data = getCellData(cellId,$table.data('keys').split(","));
			layui.layer.open({
				type : 1,
				title : '请输入Header',
				content : `<textarea id="headers" name="headers" placeholder="请输入Headers，一行一个，冒号( : )分割name和value" autocomplete="off" class="layui-textarea"  lay-verify="required" style="height:250px"></textarea>`,
				area : '800px',
				btn : ['关闭','设置'],
				btn2 : function(){
					var headerStr = $("#headers").val();
					var headerArr = headerStr.split("\n");
					var length = $(".draggable").length;
					for (var i = 0; i < headerArr.length; i++) {
						var headerItem = headerArr[i];
						var index = headerItem.indexOf(":");
						if (index < 0) {
							layer.alert('header数据格式错误');
							return;
						} else {
							data.push({
								'header-name' : $.trim(headerItem.substring(0, index)),
								'header-value' : $.trim(headerItem.substring(index + 1))
							})
						}
					}
					layui.table.reload(tableId,{
						data : data
					});
					renderCodeMirror();
					serializeForm();
				}
			})
		}).on("click",".editor-form-node .parameter-batch",function () {
			var tableId = $(this).attr('for');
			var $table = $('#' + tableId);
			var cellId = $table.data('cell');
			var data = getCellData(cellId,$table.data('keys').split(","));
			layui.layer.open({
				type : 1,
				title : '请输入参数',
				content : `<textarea id="paramters" name="paramters" placeholder="请输入参数，一行一个，冒号( : )、等号（ = ）、空格（  ）或tab（ \t ）分割name和value" autocomplete="off" class="layui-textarea"  lay-verify="required" style="height:250px"></textarea>`,
				area : '800px',
				btn : ['关闭','设置'],
				btn2 : function(){
					var paramterStr = $("#paramters").val();
					var paramterArr = paramterStr.split("\n");
					var length = $(".draggable").length;
					for (var i = 0; i < paramterArr.length; i++) {
						var paramterItem = paramterArr[i];
						var index = -1;
						var indexArr = [];
						indexArr.push(paramterItem.indexOf(":"));
						indexArr.push(paramterItem.indexOf("="));
						indexArr.push(paramterItem.indexOf(" "));
						indexArr.push(paramterItem.indexOf("\t"));
						for (var j = 0; j < indexArr.length; j++) {
							if (indexArr[j] >= 0) {
								if (index < 0) {
									index = indexArr[j];
								}
								index = Math.min(index, indexArr[j]);
							}
						}
						if (index < 0) {
							layer.alert('参数数据格式错误');
							return;
						} else {
							data.push({
								'parameter-name' : $.trim(paramterItem.substring(0, index)),
								'parameter-value' : $.trim(paramterItem.substring(index + 1))
							})
						}
					}
					layui.table.reload(tableId,{
						data : data
					});
					renderCodeMirror();
					serializeForm();
				}
			})
		}).on("click",".editor-form-node .function-add",function(){
			var index = $(".draggable").length;
			$(this).parent().parent().before('<div id="function' + index + '" class="draggable" draggable="true" ondragstart="drag(event)" ondrop="drop(event)" ondragover="allowDrop(event)"><div class="layui-form-item layui-form-relative"><i class="layui-icon layui-icon-close function-remove"></i><label class="layui-form-label">执行函数</label><div class="layui-input-block array" codemirror="function" placeholder="执行函数"></div></div></div>');
			renderCodeMirror();
		}).on("click",".editor-form-node .cmd-add",function(){
			var index = $(".draggable").length;
			$(this).parent().parent().before('<div id="' + index + '" class="draggable" draggable="true" ondragstart="drag(event)" ondrop="drop(event)" ondragover="allowDrop(event)"><div class="layui-form-item layui-form-relative"><i class="layui-icon layui-icon-close cmd-remove"></i><label class="layui-form-label">执行命令</label><div class="layui-input-block array" codemirror="cmd" placeholder="执行命令"></div></div></div>');
			renderCodeMirror();
		});
		layui.form.on('select(bodyType)',function(e){
			var bodyType = $(e.elem).val();
			$(".form-body-raw,.form-body-form-data").hide();
			if(bodyType == 'raw'){
				$(".form-body-raw").show();
			}
			if(bodyType == 'form-data'){
				$(".form-body-form-data").show();
			}
			renderCodeMirror();
			serializeForm();
		});
		layui.form.on('checkbox(targetCheck)', function (data) {
			var targetDiv = $(data.elem).attr('target-div');
			console.log(targetDiv);
			if (targetDiv != null) {
				if (data.elem.checked) {
					$("." + targetDiv).show();
				} else {
					$("." + targetDiv).hide();
				}
			}
		});
		layui.element.on('tab',function(){
			for(var key in codeMirrorInstances){
				codeMirrorInstances[key].refresh();
			}
		})
		layui.form.on('select',serializeForm);
		//loadTemplate('root',graph.getModel().getRoot(),graph);
		var id = getQueryString('id');
		if(id != null){
			$.ajax({
				url : 'spider/xml',
				async : false,
				data : {
					id : id
				},
				success : function(xml){
					editor.setXML(xml);
				}
			})
			//editor.importFromUrl('spider/xml?id=' +  id);
		}
		editor.onSelectedCell();
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
	 * 加载各种图形
	 */
	function loadShapes(editor,container){
		//定义图形
		var shapes = [{
			name : 'start',
			title : '开始',
			image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABwUlEQVRYR9WXz1XCQBDGv9GD3sSDkpvYAR2IHWAF0oFsBUIFGyoQK1ArECpQK8BjcsMbnj7fRsN7hPDcCRt87nl25jez828FinNq2d0TWAINAR4XhJkbmStUrImK7+WGZeNAMBOgkd8hMUqN9H11lMl5A/x4/1BUsiCOt4mCN0BkOYDgds0L4jIxMqkahX8EEHMGoFX0NOmLtxOVcyCy7EDwXFRA4iM1skzKKs/gRd+M+SJAuwTgKTXSrWI4v/MrQBTzDkCvzAgJkxqJawOILHsQOIDyQ5wnRt5rAWiOeCPEZu+I+8RIaWQ0QGtP4DreocBuCvtSeQDvna4VgGjEaxCDsnLTeOUpO3azJAM4sWzvf3vd8bwcRowYZgBRTFfjuzXuDBNTiSxbELgut/vjIrCpy9VNk4/y0ABZYmnGc2gA966q/lAHwDQx4p3QwQG0a1owADeaAYw/gcFf5cBkQVxpjGetOGQZklDvB6EB1BtSaAD1PyEIAIk3AeLEyFjbQYMAAKiUgHkSBhlG2vpfWUojywkEF9rwrcgTqg5YBGgReBXBUWUIYpgYcduU6ixXsmwXRLaEuk/Ima+WbRLQ2fgC+RzXgT1bPk8AAAAASUVORK5CYII=',
			hidden : true,
			defaultAdd : true
		},{
			name : 'request',
			image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACbUlEQVRYR+2XTXLTQBCFX5sF7DALsHaYE+AbxD4ByQlITmDrBCQnGHMClBMkOUHMCRAnIOwU2JhdssCPamnkkmRJM5KTKqpgqryxpqe/7unpH0HHFRhOIXhPYCLARMUJxALEIM6TUFZdjhTfzS8NJ08EBsDUIbP6TYQ/Q4l9zvYCUKspuBBg6HMogbUQRz7ecAKo5QPBta/yHFAhNsTM5QknQLDkNwBjH8tr9twkC3nTJtsKEBgeQ/Cpp/JMjDhJQomazmgFGBleiuDdPgAkrm5DOewFECzJfZTnsslCGg1NPwSGYwqMCOJkLme54GMAvDI8HAjmG+Ljj1AuUwD754VVHCULORkaDp/ZRLOvF+6AeB3KuhRTWdI63rqmct8RBmgMnD5AJCZCLNO4JL7eA1OF2gKoxU+BlQje9lHgK1NUrjKl4OgMQcxsLVj6gFeV7wDYgDyF4IOPRXl0B4YrCA6cMsRZEsppcd/O8wgM/wP8Yx4YGWqiLOZ7rXxe1a9zEAI3yH5ZnSKuZJ902wNg56FImobLKVd7PveTAtAZgPgMYNszbrJesrz+hmeoHrh2JpUeHtgQR1oBXYno0QBAzKqNam2jMDJci+C5ywtdY+COeKEVsNUD+nFkqMVl/pAATa1ZrQfsEPLlIQHq7r+2GqYlOZsD0rGrbXW5Ah3f7olZ6xVUlWv9bqvzXgDEdwhe275hB6LcERUtt/18YBjpMFrnCSeA7fuKvWDVE1uAkqLKMJEeAGiVTC3JVxMAiV8CLIoDSV1DWooBLUqqpCpYVGjTtg4ZY03XJYBsTF8TiKrJJj8jhyAR3oaSNqh/AKendd/nwfiIAAAAAElFTkSuQmCC',
			title : '开始抓取',
			desc : '抓取静态HTML页面或者API接口，抓取结果存为resp变量中。<br/>支持方法参考命令提示。'
		},{
			name : 'variable',
			image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAgCAYAAACYTcH3AAACe0lEQVRYR+2WMW5TQRCGv0mEoMMUKK80J0joKJBITgCUVAkniLehjQ+A9GwugLlBboA5QZITYLpnaEwXkZhBs+xu1s8vkhMDMpItudh9szP//PPP7Aor9JMVwsLqgmmV2roD7W9OTpsYe1jqzgWMJk4m9e/FO30W986nnDXZ1P2bPzsT480ws9XTE4EdlNeVk0EesCj1AOE9MKw6smffzPk9oQQOGsAPz5WXOajcP4KB9+cUTrng6SyYUici3M8DxiDRkSpnYyc+o+TcHCpnAhOFlgjb4VwCbuuipxr2R0A7T0DhSR1MT4RDb6Q8qpzYIYpS2wif/bbixk56Ram7CB+D7QyTRanDkDlVR1KMDIz5/wAMfhp4aJvPGTBNQT0DpSaQ58oDo95KdBeslKOxk06eZW6Pslc5GdaYIfrJz811U8zK6jjuyOPgxFhpWzaVkxl9eN1sso2ya3+FHYFWCtIERvlUOdmt66wJTBSqL5UHcVWOlKUH2dcjVToxuCrfTW9+/Vug5mOemUXBhLJ4IavSD473Ub5UTpLosu7y9Z9CL7ZoUWoX4ehPgYkaGfnugFYUbuquUo9FeG7rXKQhmfRtaWZyIadBFoQb10WpA4T9vJu8fjY4ROlmmkmdlrrpJmUK7Zzas0m4Nj03hZO6CEP797MRkUSfgZlrBDt37d1kwTZgYIPMJmWcOXnwYNP1UxtsJtm/a7amKYWOQverk+OQoDF2MIUXTVfO6l6UTZT/y701M9exvWZmzcxNO3F1NbPV18OZt8hNU1vCXn/w9upJmD0tl/B566MqvKo/O+3umHuB3TrC4gdHesmb1dXM4on8Hcs1M//FBP4FX81QGwO29kEAAAAASUVORK5CYII=',
			title : '定义变量',
			desc : '定义流程变量。<br/>定义变量有先后顺序，先定义变量后续可以使用，拖动可以交换变量顺序。'
		},{
			name : 'loop',
			image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADO0lEQVRYR9WWS2hTURCGvwnVlVjpzgdWxQeo0IWP7rQuRBQVFayLSlUQH5V2UWhzo4takOTGCF1UlOJCKyJiFxUFSwWxioguRBEV31qhVXeKSI3ajJybGxPTJDdpCtUDIeFmZv7vzpmZc4RxXjLO+vzHAH4tZZhySihzsih8JCTPCs1o/hlo0UlE2QlsA2YD0zOI3QV68dFBUD7kA+MN0KIT+U4zwg5gbkrQn8ArYELac2MyCJzClsNeELkB/DoT4SJQ6QZ6AZzFRw8TeEyr/HCeH9YyhqhEWAzUAbNc+26GaSIir7OBZAcIaCXKbaAEGAIaidJJm5jf2ZelRrwFnO0y6wlCNSF5mskpM0CdTmIyX12HAWLs4Khc90rnX/9bagBO/4FQ1hGW9+kxMgNYesEpNuUtw2zimDwqSDxhbOlupxbMUjoIyz5vAEuN0UnXqYawnB+VeBKiCTjqxjNZ6EmNNzIDlt4AqhDaCUlDUeJJiHNATaaYIwECuhClOp8WyhsuoOtRrjhta8u83BnIO2qBhpaq67EUW+4nvP/OgKWm55cBzdjSVaBEZnOzpcoUBDMlTX3tdVs0ii2rkgBx8a0pUcw2FA9h6QAwzZkHsCjlexBbpscBRoonOIqHCOhGlLNAacrLfUGoJSSXBUurAFP55kTrRylH+YwwBegzaSp6K/y6AnGG0hzgDcouwnIrLmmWXyP4uIk6J912FNP7gwjfxqwbDupiYrTjo56gPM5WhHuADicDMZYTkZdFv71HgPQuMMdtXFRpICztYwJgqSnuOpRDhOWO1yS8CqwFerBlXdEAAZ2PYg6yGUBr+paOnIR+rUXodIXbsKWxKIhkhw3gYwlB+eQ9Cf16HOGAa1iPLcdHBWHpEeCQ67sGW66lx8l+IUmdDUITITlWEERAT6Dsd326sWVLJv/cV7Lk/Da+ffiwCUpvTpD4wWO6aYNr14Ut1dl8vC+lliaKMh5DuYQP08cP8HEP5RcxKlAWIKxOETbWFraEcwF7Azhh1LyR+Szx3AYzQ+AMMTqJyEMv+/wAElEs3QxUACvdA2YqEAWeu/Oj3xG35Z2XcOZJmK/XGNoVloExFP5nMvAbItf8IXnK1DcAAAAASUVORK5CYII=',
			title : '循环',
			desc : ''
		},{
			name : 'forkJoin',
			image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADWElEQVRYR8WX34sVZRjHP9+tqJtA+uHMuY2gOwkSgugfCLopSLMNE6tNVDwzq6hYrLvBlhvovCNsucUWhiYaeBV40z8Q1E13UXQVnjlh3XQZ7TdGz7F1d+bMnEPie3ne93m+n3eeX+8R93jpHuszMcDjmZ++Tzwn85f+4dr1I7oxyWUmAoiCdwLnBGvAA8B11pgrZnVlXIixATqZpy0uYBaKVPNbMm95SJwDdlpM97v6ahyIsQDi4N3A+aH4eqEo9wWZaeCNItGXbSFaA0RnvVdrrFaJD8Xi4PPAbps3+6k+bwPRCqCTe8ZmZZT4bYjMq4i9Eu/0uvq0CaIRIA7eDyy3ER+KRZlXJGaAA0Wij0dBjASIgg8J8nHE14VjGdhv6PYTna2DqAXoZJ61OD2J+FCsE5wbDkkc7nV1pgqiEiDOfRSzVCceZU40xS7Mkzedil+8xqV+qrBRJM5dXmIWcazo6qON+5sAOsEnDIt14nHmecTJcl/wY+nQsG34W9kbNkFkXkIcFbzbS/TB+v07AOLgOWChVjz4FeBKkaj6ywUb2FEk+nojRBS8KDgBnCwSvT/cv+2ok/sZm+8b6rzc/6bqlqXDwdd5sUi0vSrecfACMCexvdfVD7eiN1hR5rJ2TxWJttZlbBz8p82BfqpLVWeizLsklotEj1TtP7bkh+9/kN+Bw8PyHBfgD5m3e6muVgl0Mr9s8VmR6NHaS2T+GZFtAmgVgtzfsca1kSGY4oWiq2crQ3DGO5jicmUIbsawKQkHFTAqCW3SynL8b5DNF6nKXBhU8AbUpjKMgq8KXiqT1fDTIJGeGlWGw1ki814v1WJtGd5uow2NKM68B3EQeGJg8yuwVFl+ubsyZYM6XiRaamxEwwP/RyuOg48Bp4AjRaLTVXlx94bRIF8skn5XeV1V3JVx3An+0HAcc7BIVU7F2tUIUFp2Ms9Y7R4kUXAmSAT7eolWRonf0QmbDg46ZdOT7BNgn+GtfqLVJp9jAQz6RO2jNA7+AiirY0/RVfk2bLVahWC9pyj3azIX1w+tOLicDa/KvN5LdbGVcl0jamMc32qp5TPrt0E769jM9hNdbmPf2IjaONkavG0Kni//mv0N395I1Wtj17oRTeJsEpuxc2ASkVE2/wK1YaYwksZPTgAAAABJRU5ErkJggg==',
			title : '执行结束',
			desc : ''
		},{
			name : 'output',
			image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAByUlEQVRYR+WXwVHDMBBF/4YD3AgHwEd3QKiA0IE7IOnAqoCkAqWDmAqACggVJJTAzRku4UYOmWVWloMZgi17bGcGdNGMrZWeVtrdL4JtXc3dI8I9gH76rWIfxSENXW0pHehpHoAwdTXMHccYx4pGLnNlAUYg3BojxtjFODPGB+Hmmw1jGCuKiubZCRCHtP1eNIH89zT3QXgy7IwXIlzYjRRC1A7wwTg5BGauELUDiPfkQrtCNAIg7neFaAzAFaJRAIE41dzrJHfieNfFrB2gMGoYz7GibbL7GwAmjQO9vN0zMDGh2YQHCt2eJKsZCFf/F+A3L9VyCV2OQMLxgKA3DPWmaJHatAbgaTbVloHFmnG9UrQSiDYBfFlcEpL0y5AuWwWQxc40B51EdUkzyqmUB6xs0wB8l3PfNYaBHgFdqx1UKYCs8KgKkLVjYFUKwJbYKN1BFQjjga/CNC4FUGXBrI0NxbmtinexokFrAJ5mnwlz8Z7oxjXQl1BsEyDJA4z3NeC3ngeM+4HJBgj3kgn3XgvONRs9IOe/VBTuoxa46wEQnN51pcKSMTAZNEcR1fc4zSFjxuNSUfDjCKyuezCyqanGeN0AQTYKPgFOSUMAph/CYQAAAABJRU5ErkJggg==',
			title : '输出',
			desc : '输出流程中的变量结果（仅测试下有用）'
		},{
			name : 'executeSql',
			image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAD1ElEQVRYR7WXUXIaRxCGv4YqR2+WH2zxZukEUU5gdAKjExhfILAnMD7BohMYn8D4BEYnsHQCobfd5CHkDVIFnerZmc0sLAJjMlVUSbszPX93//13r7DnOk319JcGb0TpAOfRzyxMw0+F8WLF7SyR2T6mZdemVqrnCB+A7sZe5dE9E17X2BmhfMwSMXBb11YAzmPhg0DfnVYeFcYKkz8SGddZfJVqR6At0ClBCYP5ipttEakF4C//JnCpyt/AIE9kuCta8fuzVA34QITnCncL5aoOxAaAl6leNgS7/FSVrwvo7pvPdYDOERiJ8FZhtlKu/kzkLt5XAeA9f/CX3+SJFOH/yXWW6lCEnoFYKBexQyWAtbAf7fKAPQJRSUcJoNygfM0TsVI7+jpLdWzp8NUxKAoI8KX2YIRbwPmhOd+F2HNiasREubASDQBGCO9USdbZ3kq1TRPNfpfb9Qsc8CavWfIY17sRudnk+XzJ/bozrVQHTleUz1kiXTFUJ8JfVudZIqZwbjkjwhevePZoulSuA4tLQ36/wjDvS+IjOkF4g3KVJTKpAT41nZgrL8TEoyF8UaVCvFaqbpOVooEQ4Ver57wvv7moCN8sZVKIU8eH9X2WyKiV6i4ALuIr5VpaqZb/BIWLOHGfJ3LpvXKAsr7YGRdGM2Bn1p3YBSDstzSYMYfWDIdQBQ9RbrNE2h6A9YLzLJFBlEcX4vX9uwA4e0NVs28ASs/iXLkN1uWKPFYayrEAWErFI6kQ0IAEXbC/rQmJchMIdRQA3nEHIJCrhq0mFt2ysxXt9TgpKAFsSUElHakaiE+m5XlfXhwlAua4cl9LwjpFi8l6LACBhBtl6EUo9Wo1isUlLkMj6BJmTaHnUuWrZlcVVMqwTog8gO+BG14tv7syjHTApNuGFhMVF7X/OLK/EJVSDNOsLxdR+7wz9aukw+u3CZUrIWsq0QqTzwmMnRRXX8aaUpb+1mbkgMHQZNa3zfEc+qG5mPiY/juJLuR6YvPjEjoN6LrIrIGzAWejGfn82uT7UDex1BHy0GfxxFVpxx6E03cTnbwv14de8tS5iJxOT3xkiyN+WJj4kP5/I5lyv4B2SOXmUApuYon7+89GIxr3Niau+rHcCFWAGC+U94eOaD7nn+xDxWaHFbSfHMuDp5V0wAxhkPfk5kciYWxXoedH/ErYYztPfpqd2GdZ8V1oa2oRQZjkPbGy21he1N4CNkMU453ycQ7DH/o0iy276QisQgq1q64wJ5SzZPla+WznDv44Xb/J0vIM2o1CmEwJT4NSuq5mqYLpCsb/wGRf3vwLgODoY+vqQ1gAAAAASUVORK5CYII=',
			title : '执行SQL',
			desc : '执行sql，需配置数据源，sql执行结果存于变量rs中。<br/>语句类型为：select，返回:List&lt;Map&lt;String,Object&gt;&gt;<br/>语句类型为：selectOne，返回:Map&lt;String,Object&gt;<br/>语句类型为：selectInt，返回:Integer<br/>语句类型为：insert、update、delete，返回:int，批量操作返回int数组<br/>sql中变量必须用 # # 包裹，如：#${title}#'
		},{
			name : 'function',
			image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAgCAYAAACPb1E+AAAC9UlEQVRYR+2YP0zUUBjAf9+RKJPgQK6THptxERPiZOTUxEUj/tlMjCS62xoT3YARl5bJTXByBGcHISQmxhjQ6A6TPRg8JrnE62de6Z0Htne9XhMw4W1N3/u+X7//rwJgzeokygRQMs+HYSksBsr0liNrYrk6gTB3GMBiGNZ9W4al6OqiCOOqfFGYKkD1oIEVRkRwQw5l2FhyCWEMZdp3ZOqgARv6LU/1CDIPbxxZMg8rhmUxj5gcdHWw6khiJSh6+lVgAGXMd2S90/79H9czpOXpd+CsKk7FEe8fBab2whwCdeF6n/ISOFUPuLT1RFbSWLsnSMvTOVUmREJVM74tz1uVGov1C6tR9/rs2zJqefoL6FfYDpSy6SKdQDNDGkAI2yeqvKk4ci/GilMIk40aZ1w95OpIQVgWOKFQDZTLnUAzQbYCorz2HQlhW5flakmFVYFBVWYrjtiN9yEoLIkwkAa0a0jL0x8m4SLrxAKGGenqPMIDVbZrUNqfWE1Qk1AFqAc83HLkVZzrs0AGgKhQDwJG41xluVpGeB99SGKLtTx9i3LTJFUAC5u23MkFcsjTZwWYFjie5CrLUwNYRtnwHYkd+fbENHyr/eZG9als5AJphLSLqdZxL1BubzqyGFP3mkmXFNN74jtrMW8FRdgB7u4EfGiWHGXZd6QcA7iCcBEz1yQkXa7F3ID2wUeEY0HATJ9wRoVxo6SunI+N18gqCu8qtlzrVCNzaYtFVx8BVwJ4UYB5Ec4pfKrYciEOoOiqjXC1ptxv10pzcXccQBQC5VqdhaQkSGO5XN2dRWGWM13XySxKej1zBNmrBRvnYy25fyDIS1kWOdG49zNqseG92xPhcSRsqWuhgoXSn3jOFH3F71Kuaatha91RTpp7d0lhzYxQXQra3W66yO4AHL86vW+nNOpOofgI9JaZAzOAmt80p9tAmgFivlu5Aaw1ZoB2Nkglt/kHJNmSsf08lfBoU2pIy9W/14JuNCTs9e3olpRC1n8B+Qd0Dhp9ddQMugAAAABJRU5ErkJggg==',
			title : '执行函数',
			desc : '单独执行函数方法，结果不保存为变量'
		},{
			name : 'process',
			image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACMklEQVRYR+2WwXHTQBSGv+fMkNwIB7BvMRVgV0DoIFRAUoGlCpJUsKICnApCB4QKcCrAvslwwEebGfyYp2g1QgmytBmPOaCjtLv/t+/9+neFHT+yY31aAxw6PdwXzgVOgH5lA1OEcTqSy6Ybaw3QdZqIMKoTUOX9PJaoCUQIwEKEp7+U4fdYJmWR504He8IXYJpG8tK+9RJVP0ZhIkKSjuTKv9sOgDJLY8naUwYog6yUN4tYFq0Bek4vEM5ry6tcprFclMeYd57AcQcShCOrxjySYWsAWzTzgZlQOPoDRJkB46p4FeQAJtlc5SwIoIm56sa8cHrSEa4zTzx2sZD51o4D4YfN3QlAz2kf4evOAIoWKLetKxCShD2np2ksY9txXn7Lin6QCdsmoYkjfFgqz/Y7vBYlMXFVbuexDB6sQNdphPBOYOBNlkaSje06bZyEXrxqVBNfwfG9IMrL+6ksHASQJ2EVwIQFEt+OeybsOrWsfoUyW0P0E26MsryDtknoIXwFq9UoWmBlF8GZ+BIGVeHyxLZJWDZhHUC2+7Xy9lssH0MCJmROUQF/aplb63YfIlI3598B8AbcWQsKE8J0qQx9G3pO7Xg99WUMScJGLchD5u43hKkK0WrN5/zUGqeRnBV3gW3dCbPdwU0OUQXPINokYRPDPhjF9t8qWC5YNe4e5cpa0QigdCfcBLHxNMx+z1zcFmubhI8HqJiw8EHgnfCvSbiJdFvfN7ZgW8J+3f8AvwFIqFFyobd5IgAAAABJRU5ErkJggg==',
			title : '子流程',
			desc : '执行其他spiderFlow流程，父子流程变量共享'
		}];
		var addShape = function(shape){
			var image = new Image();
			image.src = shape.image;
			image.title = shape.title;
			image.id = shape.name;
			image.onclick = function (ev) {
				if(shape.desc){
					layer.tips("(" + shape.name + ")" + shape.title + "<hr/>" + shape.desc, '#' + shape.name,{
						tips: [1, '#3595CC'],
						area: ['auto', 'auto'],
						time: 4000
					});
				}
			}
			if(!shape.hidden){
				container.appendChild(image);
			}
			
			if(!shape.disabled){
				editor.addShape(shape.name,shape.title || 'Label',image,shape.defaultAdd);
			}
		}
		for(var i =0,len = shapes.length;i<len;i++){
			addShape(shapes[i]);
		}
		$.ajax({
			url : 'spider/shapes',
			type : 'post',
			dataType : 'json',
			async :false,
			success : function(shapeExts){
				for(var i =0,len = shapeExts.length;i<len;i++){
					var shape = shapeExts[i];
					addShape(shape);
					var image = new Image();
					image.src = shape.image;
					image.title = shape.title;
					editor.addShape(shape.name,shape.title || 'Label',image,false);
					resizeSlideBar();
				}
			}
		})
	}
});

/**
 * 绑定工具条点击事件
 */
function bindToolbarClickAction(editor){
	$(".xml-container textarea").bind('input propertychange',function(){
		editor.setXML($(this).val());
		editor.onSelectedCell();
	})
	$(".toolbar-container").on('click','.btn-delete',function(){
		editor.deleteSelectCells();
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
		console.log(editor.getXML());
	}).on('click',".btn-edit-xml",function(){
		$(".editor-container").hide();
		$(".xml-container textarea").val(editor.getXML());
		$(".xml-container").show();
	}).on('click',".btn-graphical-xml",function(){
		$(".editor-container").show();
		$(".xml-container").hide();
//		editor.setXML($(".xml-container textarea").val());
//		editor.onSelectedCell();
	}).on('click','.btn-test',function(){
		validXML(function(){
			var LogViewer;
			var tableMap = {};
			var socket;
			var first = true;
			var filterText = '';
			var testWindowIndex = layui.layer.open({
				id : 'test-window',
				type : 1,
				content : '<div class="test-window-container"><div class="output-container"><div class="layui-tab layui-tab-fixed layui-tab-brief"><ul class="layui-tab-title"></ul><div class="layui-tab-content"></div></div></div><canvas class="log-container" width="960" height="100"></canvas></div>',
				area : ["980px","500px"],
				shade : 0,
				maxmin : true,
				maxWidth : 700,
				maxHeight : 400,
				title : '测试窗口',
				btn : ['关闭','显示/隐藏输出','显示/隐藏日志','停止'],
				btn2 : function(){
					var $output = $(".test-window-container .output-container");
					var $log = $(".test-window-container .log-container");
					if($output.is(":hidden")){
						$output.show();
						$output.find("canvas").each(function(){
							if($log.is(":hidden")){
								this.height = 320;
							}else{
								this.height = 200;
							}
						})
						$log.attr('height',100)
						LogViewer.resize();
						for(var tableId in tableMap){
							tableMap[tableId].instance.resize();
						}
					}else{
						$output.hide();
						$log.attr('height',400);
						LogViewer.resize();
						for(var tableId in tableMap){
							tableMap[tableId].instance.resize();
						}
					}
					return false;
				},
				btn3 : function(){
					var $output = $(".test-window-container .output-container");
					var $log = $(".test-window-container .log-container");
					if($log.is(":hidden")){
						$log.show();
						$log.attr('height',$output.is(":hidden") ? 400 : 100)
						$output.find("canvas").each(function(){
							this.height = 200;
						});
						LogViewer.resize();
						for(var tableId in tableMap){
							tableMap[tableId].instance.resize();
						}
					}else{
						$log.hide();
						$output.find("canvas").each(function(){
							this.height = 320;
						});
						LogViewer.resize();
						for(var tableId in tableMap){
							tableMap[tableId].instance.resize();
						}
					}
					return false;
				},
				btn4 : function(){
					var $btn = $("#layui-layer" + testWindowIndex).find('.layui-layer-btn3');
					if($btn.html() == '停止'){
						socket.send(JSON.stringify({
							eventType : 'stop'
						}));
					}else{
						socket.send(JSON.stringify({
							eventType : 'test',
							message : editor.getXML()
						}));
						$btn.html('停止');
					}
					return false;
				},
				end : function(){
					if(socket){
						socket.close();
					}
					if(LogViewer){
						LogViewer.destory();
					}
					for(var tableId in tableMap){
						tableMap[tableId].instance.destory();
					}
				},
				success : function(layero,index){
					var logElement = $(".test-window-container .log-container")[0];
					var colors = {
						'array' : '#2a00ff',
						'object' : '#2a00ff',
						'boolean' : '#600100',
						'number' : '#000E59'
					}
					LogViewer = new CanvasViewer({
						element : logElement,
						onClick : function(e){
							onCanvasViewerClick(e,'日志');
						}
					});
					$(layero).find(".layui-layer-btn")
						.append('<div class="layui-inline"><input type="text" class="layui-input" placeholder="输入关键字过滤日志"/></div>')
						.on("keyup","input",function(){
							LogViewer.filter(this.value);
						});
					socket = createWebSocket({
						onopen : function(){
							socket.send(JSON.stringify({
								eventType : 'test',
								message : editor.getXML()
							}));
						},
						onmessage : function(e){
							var event = JSON.parse(e.data);
							var eventType = event.eventType;
							var message = event.message;
							if(eventType == 'finish'){
								$("#layui-layer" + testWindowIndex).find('.layui-layer-btn3').html('重新开始');
							}else if(eventType == 'output'){
								var tableId = 'output-' + message.nodeId;
								var $table = $('#' + tableId);
								if($table.length == 0){
									tableMap[tableId] = {
										index : 0
									};
									var $tab = $(".test-window-container .output-container .layui-tab")
									var outputTitle = '输出-'+tableId;
									var cell = editor.getModel().cells[message.nodeId];
									if(cell){
										outputTitle = cell.value;
									}
									if(first){
										$tab.find(".layui-tab-title").append('<li  class="layui-this">' + outputTitle + '</li>');
										$tab.find(".layui-tab-content").append('<div class="layui-tab-item layui-show" data-output="'+tableId+'"></div>');
										first = false;
									}else{
										$tab.find(".layui-tab-title").append('<li>' + outputTitle + '</li>');
										$tab.find(".layui-tab-content").append('<div class="layui-tab-item" data-output="'+tableId+'"></div>');
									}
									$table = $('<canvas width="960" height="200"/>').appendTo($(".test-window-container .output-container .layui-tab-item[data-output="+tableId+"]"));
									$table.attr('id',tableId);
									tableMap[tableId].instance = new CanvasViewer({
										element : document.getElementById(tableId),
										grid : true,
										header : true,
										style : {
											font : 'bold 13px Consolas'
										},
										onClick : function(e){
											onCanvasViewerClick(e,'表格');
										}
									})
									var cols = [];
									var texts = [new CanvasText({
										text : '序号',
										maxWidth : 100
									})];
									for(var i =0,len = message.outputNames.length;i<len;i++){
										texts.push(new CanvasText({
											text : message.outputNames[i],
											maxWidth : 200,
											click : true
										}));
									}
									tableMap[tableId].instance.append(texts);
								}
								var texts = [new CanvasText({
									text : ++tableMap[tableId].index,
									maxWidth : 200,
									click : true
								})];
								for(var i =0,len = message.outputNames.length;i<len;i++){
									var displayText = message.values[i];
									var variableType = 'string';
									if(Array.isArray(displayText)){
										variableType = 'array';
										displayText = JSON.stringify(displayText);
									}else{
										variableType = typeof displayText;
										if(variableType == 'object'){
											displayText = JSON.stringify(displayText);
										}
									}
									texts.push(new CanvasText({
										text : displayText,
										maxWidth : 200,
										color : colors[variableType] || 'black',
										click : true
									}));
								}
								tableMap[tableId].instance.append(texts);
								tableMap[tableId].instance.scrollTo(-1);
							}else if(eventType == 'log'){
								var texts = [];
								var defaultColor = message.level == 'error' ? 'red' : '';
								texts.push(new CanvasText({
									text : message.level,
									color : defaultColor
								}));
								texts.push(new CanvasText({
									text : event.timestamp,
									color : defaultColor
								}));
								var temp = message.message.split("{}");
								message.variables = message.variables || [];
								for(var i=0,len=temp.length;i<len;i++){
									if(temp[i]!=''){
										texts.push(new CanvasText({
											text : temp[i],
											color : defaultColor
										}))
									}
									var object = message.variables[i];
									if(object != undefined){
										var variableType = '';
										var displayText = object;
										if(Array.isArray(object)){
											variableType = 'array';
											displayText = JSON.stringify(displayText);
										}else{
											variableType = typeof object;
											if(variableType == 'object'){
												displayText = JSON.stringify(displayText);
											}
										}
										texts.push(new CanvasText({
											text : displayText,
											maxWidth : 330,
											color : colors[variableType] || '#025900',
											click : true
										}))
									}
								}
								LogViewer.append(texts);
								LogViewer.scrollTo(-1);
							}
						}
					});
				}
			})
		});
	}).on('click',".btn-return",function(){
		location.href="spiderList.html"
	}).on('click','.btn-save',function(){
		Save();
	})
}
//最近点击打开的弹窗
var index;
function onCanvasViewerClick(e,source){
	var msg = e.text;
	var json;
	try{
		json = JSON.parse(msg);
		if(!(Array.isArray(json) || typeof json == 'object')){
			json = null;
		}
	}catch(e){
		
	}
	if(!json){
		var temp = document.createElement("div");
		(temp.textContent != null) ? (temp.textContent = msg) : (temp.innerText = msg);
		msg = temp.innerHTML;
		temp = null;
	}
	layer.close(index);
	index = layer.open({
	  type : 1,
	  title : source +'内容',
	  content: '<div class="message-content" style="padding:10px;'+(json ? '':'font-weight: bold;font-family:Consolas;font-size:12px;')+'">'+(json ? '' : msg.replace(/\n/g,'<br>')).replace(/ /g,'&nbsp;').replace(/\t/g,'&nbsp;&nbsp;&nbsp;&nbsp;')+'</div>',
	  shade : 0,
	  area : json ? ['700px','500px'] : 'auto',
	  maxmin : true,
	  maxWidth : (json ? undefined : 700),
	  maxHeight : (json ? undefined : 400),
	  success : function(dom,index){
		 var $dom = $(dom).find(".message-content");
		 if(json){
			 jsonTree.create(json,$dom[0]);
		 }
	  }
	}); 
}
function createWebSocket(options){
	options = options || {};
	var socket;
	if(location.host === 'demo.spiderflow.org'){
		socket = new WebSocket(options.url || 'ws://49.233.182.130:8088/ws');
	}else{
		socket = new WebSocket(options.url || (location.origin.replace("http",'ws') + '/ws'));
	}
	socket.onopen = options.onopen;
	socket.onmessage = options.onmessage;
	socket.onerror = options.onerror || function(){
		layer.layer.msg('WebSocket错误');
	}
	return socket;
}

var flowId;
function Save(){
	validXML(function(){
		$.ajax({
			url : 'spider/save',
			type : 'post',
			data : {
				id : getQueryString('id') || flowId,
				xml : editor.getXML(),
				name : editor.graph.getModel().getRoot().data.get('spiderName') || '未定义名称',
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
	});
}

function allowDrop(ev){
	ev.preventDefault();
}

function drag(ev){
	ev.dataTransfer.setData("moverTarget", ev.target.id);
}

function drop(ev){
	var moverTargetId = ev.dataTransfer.getData("moverTarget");
	$(ev.target).parents(".draggable").before($("#" + moverTargetId));
	ev.preventDefault();
	serializeForm();
}