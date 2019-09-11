var $ = layui.$;
var editor;
var flows;
var cms = [];
var grammers = {};
var grammerVariables = [];
function initGrammers(){
	$.ajax({
		url : 'spider/grammers',
		dataType : 'json',
		success : function(gms){
			grammers = gms;
			for(var key in grammers){
				grammerVariables.push(key);
				grammers[key].functions = (grammers[key].functions || []).sort();
				grammers[key].attributes = (grammers[key].attributes || []).sort();
			}
		}
	})
}
function renderCodeMirror(){
	cms = [];
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
			hintOptions : {
				completeSingle : false,
				hint : function(codeeditor){
					var cur = codeeditor.getCursor();
					var curLine = codeeditor.getLine(cur.line);
					var token = cm.getTokenAt(cur);
					var end = cur.ch;
					var start = end;
					var list = [];
					var str1 = curLine.charAt(start - 2);
					var str2 = curLine.charAt(start - 1);
					if(token.type=='string'){
						return {
							list: [], 
							from: CodeMirror.Pos(cur.line, start), 
							to: CodeMirror.Pos(cur.line, end)
						}
					}
					if(str1 == '$' && str2 == '{'){
						return {
							list: grammerVariables || [], 
							from: CodeMirror.Pos(cur.line, start), 
							to: CodeMirror.Pos(cur.line, end)
						}
					}else{
						var prefix = curLine.substring(0,end);
						var regx = /[^\w]([\w]+?)[\.]/g;
						var keyword = null;
						var tmp = null;
						while((tmp = regx.exec(prefix)) !== null){
							keyword = tmp[1];
						}
						if(str2 == '.'){
							return {
								list: grammers[keyword]&&grammers[keyword].functions.concat(grammers[keyword].attributes).sort()||[], 
								from: CodeMirror.Pos(cur.line, start), 
								to: CodeMirror.Pos(cur.line, end)
							}
						}else{
							var arr = prefix.split(/[^\w]/);
							if(arr.length > 0){
								var str = arr[arr.length - 1];
								if(str){
									regx = new RegExp('[^\\w]+([\\w]+?)[\\.]['+str+']','g');
									var keyword = null;
									var tmp = null;
									while((tmp = regx.exec(prefix)) != null){
										keyword = tmp[1];
									}
									var array = grammerVariables;
									if(keyword != null&&grammers[keyword]){
										array = grammers[keyword].functions.concat(grammers[keyword].attributes);
									}
									for(var i =0,len = array.length;i<len;i++){
										var s = array[i];
										if(s!=str&&s.indexOf(str) === 0){
											list.push(array[i]);
										}
									}
								}
							}
						}
						return {
							list: list, 
							from: CodeMirror.Pos(cur.line, token.start), 
							to: CodeMirror.Pos(cur.line, token.end)
						}
					}
				}
			}
		});
		cm.on('change',function(){
			cm.closeHint();
			cm.showHint();
			$dom.attr('data-value',cm.getValue());
			serializeForm();
		});
		cms.push(cm);
	});
}
function serializeForm(){
	var cell = editor.getSelectedCell();
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
	$(".properties-container form [lay-skin=switch]").each(function(){
		cell.data.set(this.value,$(this).is(":checked") ? '1': '0');
	});
	cell.data.set('shape',shape);
}
$(function(){
	initGrammers();
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
		Save();
	});
	$.ctrl('Q', function() {
		$(".btn-test").click();
	});
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
	function loadTemplate(cell,model,callback){
		var cells = model.cells;
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
		var template = cell.data.get('shape') || 'root';
		if(cell.isEdge()){
			template = 'edge';
		}
		var render = function(){
			layui.laytpl(templateCache[template]).render({
				data : cell.data,
				value : cell.value,
				datasources : datasources,
				flows : flows || [],
				model : model
			},function(html){
				$(".properties-container").html(html);
				layui.form.render();
				renderCodeMirror();
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
		
		layui.form.on('switch',function(e){
			serializeForm();
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
		}).on("keyup","input,textarea",function(){
			var $input = $(this);
			if($input.attr('name') == 'value'){
				var cell = editor.getSelectedCell();
				var model = editor.getModel();
				model.beginUpdate();
				try{
					model.execute(new mxCellAttributeChange(cell,'value',$input.val()));
					cell.setValue($input.val());
				}finally{
					model.endUpdate();
				}
			}else{
				serializeForm();
			}
		}).on("click",".editor-form-node .variable-add",function(){
			$(this).parent().parent().before('<div class="layui-form-item layui-form-relative"><i class="layui-icon layui-icon-close variable-remove"></i><label class="layui-form-label">变量名</label><div class="layui-input-block"><input type="text" name="variable-name" placeholder="变量名称" autocomplete="off" class="layui-input array"></div></div><div class="layui-form-item"><label class="layui-form-label">变量值</label><div class="layui-input-block array" codemirror="variable-value" placeholder="请输入变量值"></div></div><hr>');
			renderCodeMirror();
		}).on("click",".editor-form-node .header-remove,.editor-form-node .parameter-remove,.editor-form-node .variable-remove,.editor-form-node .output-remove",function(){	//移除多行
			var $dom = $(this).parent();
			$dom.prev().remove();
			$dom.next().remove();
			$dom.remove();
			serializeForm();
		}).on("click",".editor-form-node .header-add",function(){
			$(this).parent().parent().before('<div class="layui-form-item layui-form-relative"><i class="layui-icon layui-icon-close header-remove"></i><label class="layui-form-label">header名</label><div class="layui-input-block"><input type="text" name="header-name" placeholder="header key" autocomplete="off" class="layui-input array"></div></div><div class="layui-form-item"><label class="layui-form-label">header值</label><div class="layui-input-block array" codemirror="header-value" placeholder="请输入header value"></div></div><hr>');
			renderCodeMirror();
		}).on("click",".editor-form-node .parameter-add",function(){
			$(this).parent().parent().before('<div class="layui-form-item layui-form-relative"><i class="layui-icon layui-icon-close parameter-remove"></i><label class="layui-form-label">参数名</label><div class="layui-input-block"><input type="text" name="parameter-name" placeholder="请输入参数名" autocomplete="off" class="layui-input array"></div></div><div class="layui-form-item"><label class="layui-form-label">参数值</label><div class="layui-input-block array" codemirror="parameter-value" placeholder="请输入参数值"></div></div><hr>');
			renderCodeMirror();
		}).on("click",".editor-form-node .output-add",function(){
			$(this).parent().parent().before('<div class="layui-form-item layui-form-relative"><i class="layui-icon layui-icon-close output-remove"></i><label class="layui-form-label">输出项</label><div class="layui-input-block"><input type="text" name="output-name" placeholder="请输入输出项" autocomplete="off" class="layui-input array"></div></div><div class="layui-form-item"><label class="layui-form-label">输出值</label><div class="layui-input-block array" codemirror="output-value" placeholder="请输入输出值"></div></div><hr>');
			renderCodeMirror();
		}).on('click','.btn-datasource-test',function(){
			var type = $("select[name=datasourceType]").val();
			var url = $("input[name=datasourceUrl]").val();
			var username = $("input[name=datasourceUsername]").val();
			var password = $("input[name=datasourcePassword]").val();
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
		}).on("click",".parameter-form-add",function(){
			var html = '';
			html+='<div class="layui-form-item layui-form-relative">';
			html+=	'<i class="layui-icon layui-icon-close parameter-form-remove"></i>';
			html+=	'<label class="layui-form-label">参数名</label>';
			html+=	'<div class="layui-input-block">';
			html+=		'<input type="text" name="parameter-form-name" placeholder="请输入参数名" autocomplete="off" class="layui-input array">';
			html+=	'</div>';
			html+='</div>';
			html+='<div class="layui-form-item">';
			html+=	'<label class="layui-form-label">参数类型</label>';
			html+=	'<div class="layui-input-block">';
			html+=		'<select name="parameter-form-type" lay-filter="formType" class="array">';
			html+=			'<option value="text">text</option>';
			html+=			'<option value="file">file</option>';
			html+=		'</select>';
			html+=	'</div>';
			html+='</div>';
			html+='<div class="layui-form-item" style="display:none;">';
			html+=	'<label class="layui-form-label">文件名</label>';
			html+=	'<div class="layui-input-block array" codemirror="parameter-form-filename" placeholder="请输入文件名">';
			html+=	'</div>';
			html+='</div>';
			html+='<div class="layui-form-item">';
			html+=	'<label class="layui-form-label">参数值</label>';
			html+=	'<div class="layui-input-block array" codemirror="parameter-form-value" placeholder="请输入参数值">';
			html+=	'</div>';
			html+='</div>';
			html+='<hr>';
			$(this).parent().parent().before(html);
			renderCodeMirror();
			layui.form.render();
		}).on("click",".parameter-form-remove",function(){
			var $dom = $(this).parent();
			$dom.next().remove();
			$dom.next().remove();
			$dom.next().remove();
			$dom.next().remove();
			$dom.remove();
			serializeForm();
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
		layui.form.on('select(formType)',function(e){
			var $select = $(e.elem);
			if($select.val() == 'file'){
				$select.parents(".layui-form-item").next().show();
			}else{
				$select.parents(".layui-form-item").next().hide();
			}
			renderCodeMirror();
			serializeForm();
		})
		layui.element.on('tab',function(){
			for(var i=0;i<cms.length;i++){
				cms[i].refresh();
			}
		})
		layui.form.on('select',serializeForm);
		//loadTemplate('root',graph.getModel().getRoot(),graph);
		var id = getQueryString('id');
		if(id != null){
			editor.importFromUrl('spider/xml?id=' +  id);
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
			title : '开始抓取'
		},{
			name : 'variable',
			image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAgCAYAAACYTcH3AAACe0lEQVRYR+2WMW5TQRCGv0mEoMMUKK80J0joKJBITgCUVAkniLehjQ+A9GwugLlBboA5QZITYLpnaEwXkZhBs+xu1s8vkhMDMpItudh9szP//PPP7Aor9JMVwsLqgmmV2roD7W9OTpsYe1jqzgWMJk4m9e/FO30W986nnDXZ1P2bPzsT480ws9XTE4EdlNeVk0EesCj1AOE9MKw6smffzPk9oQQOGsAPz5WXOajcP4KB9+cUTrng6SyYUici3M8DxiDRkSpnYyc+o+TcHCpnAhOFlgjb4VwCbuuipxr2R0A7T0DhSR1MT4RDb6Q8qpzYIYpS2wif/bbixk56Ram7CB+D7QyTRanDkDlVR1KMDIz5/wAMfhp4aJvPGTBNQT0DpSaQ58oDo95KdBeslKOxk06eZW6Pslc5GdaYIfrJz811U8zK6jjuyOPgxFhpWzaVkxl9eN1sso2ya3+FHYFWCtIERvlUOdmt66wJTBSqL5UHcVWOlKUH2dcjVToxuCrfTW9+/Vug5mOemUXBhLJ4IavSD473Ub5UTpLosu7y9Z9CL7ZoUWoX4ehPgYkaGfnugFYUbuquUo9FeG7rXKQhmfRtaWZyIadBFoQb10WpA4T9vJu8fjY4ROlmmkmdlrrpJmUK7Zzas0m4Nj03hZO6CEP797MRkUSfgZlrBDt37d1kwTZgYIPMJmWcOXnwYNP1UxtsJtm/a7amKYWOQverk+OQoDF2MIUXTVfO6l6UTZT/y701M9exvWZmzcxNO3F1NbPV18OZt8hNU1vCXn/w9upJmD0tl/B566MqvKo/O+3umHuB3TrC4gdHesmb1dXM4on8Hcs1M//FBP4FX81QGwO29kEAAAAASUVORK5CYII=',
			title : '定义变量'
		},{
			name : 'output',
			image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAByUlEQVRYR+WXwVHDMBBF/4YD3AgHwEd3QKiA0IE7IOnAqoCkAqWDmAqACggVJJTAzRku4UYOmWVWloMZgi17bGcGdNGMrZWeVtrdL4JtXc3dI8I9gH76rWIfxSENXW0pHehpHoAwdTXMHccYx4pGLnNlAUYg3BojxtjFODPGB+Hmmw1jGCuKiubZCRCHtP1eNIH89zT3QXgy7IwXIlzYjRRC1A7wwTg5BGauELUDiPfkQrtCNAIg7neFaAzAFaJRAIE41dzrJHfieNfFrB2gMGoYz7GibbL7GwAmjQO9vN0zMDGh2YQHCt2eJKsZCFf/F+A3L9VyCV2OQMLxgKA3DPWmaJHatAbgaTbVloHFmnG9UrQSiDYBfFlcEpL0y5AuWwWQxc40B51EdUkzyqmUB6xs0wB8l3PfNYaBHgFdqx1UKYCs8KgKkLVjYFUKwJbYKN1BFQjjga/CNC4FUGXBrI0NxbmtinexokFrAJ5mnwlz8Z7oxjXQl1BsEyDJA4z3NeC3ngeM+4HJBgj3kgn3XgvONRs9IOe/VBTuoxa46wEQnN51pcKSMTAZNEcR1fc4zSFjxuNSUfDjCKyuezCyqanGeN0AQTYKPgFOSUMAph/CYQAAAABJRU5ErkJggg==',
			title : '输出'
		},{
			name : 'datasource',
			image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACDklEQVRYR+2XwW3bQBBF39CX3MxLAN3iDqIOQlcQd6AOErOCOBUw6cDuQK4gdAdKB8pNQC70TRdyglnvJmuKK0uKHMlABBAihN35f2fn/xkJB/7IgfF5OQReVzo+OeFUlbFAPpQ5hUaEWdty/7OU2SbZTWbAAWa8V+VCYLxJsIE1NULddtymCK0QGFVaIHwCih1BU9vqVin7RB4R8ODf9gz8O5xdUaecxyT6BK786Z+LAyifF6VcBYD/BI4rAya9DGoRTp+jCFS5N0kvSpkP1oD9OKr0DLBinOyVhHJjcWNwi//oCiwDQSJ5pfkruDA/UBiL8HYbQqp8FzA3rJcwbUppbH+MsUJgVKmd/M1SKcOGGNS5o7dhR+rPe+PBaKEZcj13IKFC+fGkDJ2nw5SM68UHudvm5P213twmirP0fFcfqIE5wjw0nMFmFBqVYnVkz6qdH7UR/QsZdlAke0Ekw2uEd39z9/29qtwKXK6VoXlAWGDvVjj+HottzclMxyRojxV0HDdpRE6GGbrs+NqXofeFMJikZgUDZAmzwf0ZH+mQJ2VoFa8w7ZSbTUer1HW5uhIm8pDNs61l6D1hZqOVAwnfKUSlUCU3z4/NKppKjngeOAoZer//sm8Zoty1cLl2KB1oPA8y3NUTFOsjdQvTjcfyddXsO2Hw+ZWloWBTHXEo9sv5a7ZPW45jHTwDvwD6pR4w+W6OXgAAAABJRU5ErkJggg==',
			title : '定义数据源'
		},{
			name : 'executeSql',
			image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAD1ElEQVRYR7WXUXIaRxCGv4YqR2+WH2zxZukEUU5gdAKjExhfILAnMD7BohMYn8D4BEYnsHQCobfd5CHkDVIFnerZmc0sLAJjMlVUSbszPX93//13r7DnOk319JcGb0TpAOfRzyxMw0+F8WLF7SyR2T6mZdemVqrnCB+A7sZe5dE9E17X2BmhfMwSMXBb11YAzmPhg0DfnVYeFcYKkz8SGddZfJVqR6At0ClBCYP5ipttEakF4C//JnCpyt/AIE9kuCta8fuzVA34QITnCncL5aoOxAaAl6leNgS7/FSVrwvo7pvPdYDOERiJ8FZhtlKu/kzkLt5XAeA9f/CX3+SJFOH/yXWW6lCEnoFYKBexQyWAtbAf7fKAPQJRSUcJoNygfM0TsVI7+jpLdWzp8NUxKAoI8KX2YIRbwPmhOd+F2HNiasREubASDQBGCO9USdbZ3kq1TRPNfpfb9Qsc8CavWfIY17sRudnk+XzJ/bozrVQHTleUz1kiXTFUJ8JfVudZIqZwbjkjwhevePZoulSuA4tLQ36/wjDvS+IjOkF4g3KVJTKpAT41nZgrL8TEoyF8UaVCvFaqbpOVooEQ4Ver57wvv7moCN8sZVKIU8eH9X2WyKiV6i4ALuIr5VpaqZb/BIWLOHGfJ3LpvXKAsr7YGRdGM2Bn1p3YBSDstzSYMYfWDIdQBQ9RbrNE2h6A9YLzLJFBlEcX4vX9uwA4e0NVs28ASs/iXLkN1uWKPFYayrEAWErFI6kQ0IAEXbC/rQmJchMIdRQA3nEHIJCrhq0mFt2ysxXt9TgpKAFsSUElHakaiE+m5XlfXhwlAua4cl9LwjpFi8l6LACBhBtl6EUo9Wo1isUlLkMj6BJmTaHnUuWrZlcVVMqwTog8gO+BG14tv7syjHTApNuGFhMVF7X/OLK/EJVSDNOsLxdR+7wz9aukw+u3CZUrIWsq0QqTzwmMnRRXX8aaUpb+1mbkgMHQZNa3zfEc+qG5mPiY/juJLuR6YvPjEjoN6LrIrIGzAWejGfn82uT7UDex1BHy0GfxxFVpxx6E03cTnbwv14de8tS5iJxOT3xkiyN+WJj4kP5/I5lyv4B2SOXmUApuYon7+89GIxr3Niau+rHcCFWAGC+U94eOaD7nn+xDxWaHFbSfHMuDp5V0wAxhkPfk5kciYWxXoedH/ErYYztPfpqd2GdZ8V1oa2oRQZjkPbGy21he1N4CNkMU453ycQ7DH/o0iy276QisQgq1q64wJ5SzZPla+WznDv44Xb/J0vIM2o1CmEwJT4NSuq5mqYLpCsb/wGRf3vwLgODoY+vqQ1gAAAAASUVORK5CYII=',
			title : '执行SQL'
		},{
			name : 'function',
			image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAgCAYAAACPb1E+AAAC9UlEQVRYR+2YP0zUUBjAf9+RKJPgQK6THptxERPiZOTUxEUj/tlMjCS62xoT3YARl5bJTXByBGcHISQmxhjQ6A6TPRg8JrnE62de6Z0Htne9XhMw4W1N3/u+X7//rwJgzeokygRQMs+HYSksBsr0liNrYrk6gTB3GMBiGNZ9W4al6OqiCOOqfFGYKkD1oIEVRkRwQw5l2FhyCWEMZdp3ZOqgARv6LU/1CDIPbxxZMg8rhmUxj5gcdHWw6khiJSh6+lVgAGXMd2S90/79H9czpOXpd+CsKk7FEe8fBab2whwCdeF6n/ISOFUPuLT1RFbSWLsnSMvTOVUmREJVM74tz1uVGov1C6tR9/rs2zJqefoL6FfYDpSy6SKdQDNDGkAI2yeqvKk4ci/GilMIk40aZ1w95OpIQVgWOKFQDZTLnUAzQbYCorz2HQlhW5flakmFVYFBVWYrjtiN9yEoLIkwkAa0a0jL0x8m4SLrxAKGGenqPMIDVbZrUNqfWE1Qk1AFqAc83HLkVZzrs0AGgKhQDwJG41xluVpGeB99SGKLtTx9i3LTJFUAC5u23MkFcsjTZwWYFjie5CrLUwNYRtnwHYkd+fbENHyr/eZG9als5AJphLSLqdZxL1BubzqyGFP3mkmXFNN74jtrMW8FRdgB7u4EfGiWHGXZd6QcA7iCcBEz1yQkXa7F3ID2wUeEY0HATJ9wRoVxo6SunI+N18gqCu8qtlzrVCNzaYtFVx8BVwJ4UYB5Ec4pfKrYciEOoOiqjXC1ptxv10pzcXccQBQC5VqdhaQkSGO5XN2dRWGWM13XySxKej1zBNmrBRvnYy25fyDIS1kWOdG49zNqseG92xPhcSRsqWuhgoXSn3jOFH3F71Kuaatha91RTpp7d0lhzYxQXQra3W66yO4AHL86vW+nNOpOofgI9JaZAzOAmt80p9tAmgFivlu5Aaw1ZoB2Nkglt/kHJNmSsf08lfBoU2pIy9W/14JuNCTs9e3olpRC1n8B+Qd0Dhp9ddQMugAAAABJRU5ErkJggg==',
			title : '执行函数'
		},{
			name : 'process',
			image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACMklEQVRYR+2WwXHTQBSGv+fMkNwIB7BvMRVgV0DoIFRAUoGlCpJUsKICnApCB4QKcCrAvslwwEebGfyYp2g1QgmytBmPOaCjtLv/t+/9+neFHT+yY31aAxw6PdwXzgVOgH5lA1OEcTqSy6Ybaw3QdZqIMKoTUOX9PJaoCUQIwEKEp7+U4fdYJmWR504He8IXYJpG8tK+9RJVP0ZhIkKSjuTKv9sOgDJLY8naUwYog6yUN4tYFq0Bek4vEM5ry6tcprFclMeYd57AcQcShCOrxjySYWsAWzTzgZlQOPoDRJkB46p4FeQAJtlc5SwIoIm56sa8cHrSEa4zTzx2sZD51o4D4YfN3QlAz2kf4evOAIoWKLetKxCShD2np2ksY9txXn7Lin6QCdsmoYkjfFgqz/Y7vBYlMXFVbuexDB6sQNdphPBOYOBNlkaSje06bZyEXrxqVBNfwfG9IMrL+6ksHASQJ2EVwIQFEt+OeybsOrWsfoUyW0P0E26MsryDtknoIXwFq9UoWmBlF8GZ+BIGVeHyxLZJWDZhHUC2+7Xy9lssH0MCJmROUQF/aplb63YfIlI3598B8AbcWQsKE8J0qQx9G3pO7Xg99WUMScJGLchD5u43hKkK0WrN5/zUGqeRnBV3gW3dCbPdwU0OUQXPINokYRPDPhjF9t8qWC5YNe4e5cpa0QigdCfcBLHxNMx+z1zcFmubhI8HqJiw8EHgnfCvSbiJdFvfN7ZgW8J+3f8AvwFIqFFyobd5IgAAAABJRU5ErkJggg==',
			title : '子流程'
		}]
		var addShape = function(shape){
			var image = new Image();
			image.src = shape.image;
			image.title = shape.title;
			if(shape.hidden){
				
			}else{
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
		var LogViewer;
		var tableMap = {};
		var socket;
		var first = true;
		var testWindowIndex = layui.layer.open({
			id : 'test-window',
			content : '<div class="test-window-container"><div class="output-container"><div class="layui-tab layui-tab-fixed layui-tab-brief"><ul class="layui-tab-title"></ul><div class="layui-tab-content"></div></div></div><canvas class="log-container" width="960" height="100"></canvas></div>',
			area : ["980px","600px"],
			shade : 0,
			title : '测试窗口',
			btn : ['关闭','显示/隐藏输出','显示/隐藏日志','停止'],
			btn2 : function(){
				var $output = $(".test-window-container .output-container");
				var $log = $(".test-window-container .log-container");
				if($output.is(":hidden")){
					$output.show();
					$output.find("canvas").each(function(){
						if($log.is(":hidden")){
							this.height = 420;
						}else{
							this.height = 300;
						}
					})
					$log.attr('height',100)
					LogViewer.resize();
					for(var tableId in tableMap){
						tableMap[tableId].instance.resize();
					}
				}else{
					$output.hide();
					$log.attr('height',500);
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
					$log.attr('height',$output.is(":hidden") ? 500 : 100)
					$output.find("canvas").each(function(){
						this.height = 300;
					});
					LogViewer.resize();
					for(var tableId in tableMap){
						tableMap[tableId].instance.resize();
					}
				}else{
					$log.hide();
					$output.find("canvas").each(function(){
						this.height = 420;
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
			success : function(){
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
								if(first){
									$tab.find(".layui-tab-title").append('<li  class="layui-this">输出-'+tableId+'</li>');
									$tab.find(".layui-tab-content").append('<div class="layui-tab-item layui-show" data-output="'+tableId+'"></div>');
									first = false;
								}else{
									$tab.find(".layui-tab-title").append('<li>输出-'+tableId+'</li>');
									$tab.find(".layui-tab-content").append('<div class="layui-tab-item" data-output="'+tableId+'"></div>');
								}
								$table = $('<canvas width="960" height="300"/>').appendTo($(".test-window-container .output-container .layui-tab-item[data-output="+tableId+"]"));
								$table.attr('id',tableId);
								tableMap[tableId].instance = new CanvasViewer({
									element : document.getElementById(tableId),
									grid : true,
									header : true,
									style : {
										font : '12px Arial'
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
								texts.push(new CanvasText({
									text : message.values[i],
									maxWidth : 200,
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
										maxWidth : 230,
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
	}).on('click',".btn-return",function(){
		location.href="spiderList.html"
	}).on('click','.btn-save',function(){
		Save();
	})
}
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
	layer.open({
	  type : 1,
	  title : source +'内容',
	  content: '<div class="message-content" style="padding:10px;'+(json ? '':'font-weight:bold;')+'">'+(json ? '' : msg.replace(/\n/g,'<br>'))+'</div>',
	  shade : 0,
	  area : json ? ['700px','500px'] : 'auto',
	  maxmin : true,
	  maxWidth : (json ? undefined : 700),
	  maxHeight : (json ? undefined : 500),
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
}