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
			image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABc0lEQVRIS7VWzVnCUBCc8aI34SK5KRWoHUgHUIHaQV4F2sHDCsQKlArQCsQOckz0Em5cYPweH+QLInn50Vzf7szu7O58ITzfiVWfxCOBdCEMvgynvpz8O33BgVUE4nQdF8Uhu76cagRDKZ+wEC6rdFHYQWB1BWKSJ5gL7dQwLduFj+AexF0eLA7plbWURIHVmYh3Aq1NgoSPxPCibPUubm81HaspifM8mISHxDBsTBBYjUBc7wAJ3dgwqk3QsmodEhMCuzIIT7HhTRXwLYk6VqEbaF7zqmBbcgLpUuitZvCb3k3As1zhjc4KDojnPwH8ASJhzMBqZ9fLkLmVdf5UEBvNgbA+AZBSGMSGr0UF1SZwoGXuohHBUhh8Gr78eQcCUgm3PvDVHTQY8jgx7PsWognBLDHMjHAfUS0CCTMCYWw4+p8OhJ5vPTfEtS7ZDTkJ2fZVn5ldVS9yEpXRPyNwNn0EDAW4X5TjosrWFuH0L7zgDcY3PV6kVbP/TTwAAAAASUVORK5CYII=',
			hidden : true,
			defaultAdd : true
		},{
			name : 'request',
			image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAB9UlEQVRIS92VzXETQRCFv5YPcEMX0N4wEViOACsCRATIEVgTASaCcQZeZ2AisIgAEQHitiou8o09SI/qZVclmf2Ry1UcmKq97HT369fd89roOP2o/vMeFxJjg6GbC+YYab7hZhVs1RbC2i5fRY3NuDbo19kJVibeZ8FmTXEaAZKoM4y7LobFvRg1gdQCeFmeGd+bMq8BXfwSp3XlqgUYRE3NiAdlXxmJ8yxY+tCnCeDWjHePAZD4vAw2rgVIoi5lnOTi3GkOoq6qiTkUxCdrGWzq9oW/cZJNbVQwKH9cuFEuRl2j1waaRKUYHyS+LYMNtyUaRD26LE1AHjyHM090C1BMDsycWotjsD+PrHF8d4N7nL0mey8wPjaWoJz35EpqsfmUBbus7v8DgCTqmCNeF5Q2TKD46s8hJYKUHsWDW6+5tyRqgZUAXUN/GMA2SiGGhaiBf35c4N4+iYH4AlTqOvu3Te4UuUNKJJrH9GXU8Mj4+pQSrcXpz2Dz2nfgP5OoWWMfuhiIH1mw490E93rgDHrGXeOi6QDwqdmIUS2DveDixhXxr1K1AZQ+D0EKBnsrstxMSdRE4Lr+Ymewi927q0US9wZT32bug3HtILl4s1VTf82+CyrDKmCpsBODscC1fewAgyiX4bngNod0d39sE4NhFmzxG8akO3b6LIRZAAAAAElFTkSuQmCC',
			title : '开始抓取'
		},{
			name : 'variable',
			image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAYCAYAAADkgu3FAAAByklEQVRIS+2VwXHUQBBF318u3LAPIN1YR4CIABMBzgATATsZmAjGRIAdASYCNgPWEbBHbXFAvtkH3FTPalSySgbKVasTc5vSdP/+v3+3xERHE+HQAe1F23PQJqjpg5fR5nXQelhQGe0QWN/zLcX0c3ZARbQLxKsb4yCDOQjiO8Z5HXT8NFr1SETAQdIxaGSEOujM72W0M8RbM4K2bzHjYweUH2C8y0FFtFOJ9x60CTotoq0kXmB8AJYGlSdzsM1C+y3Q0gtuqzgH5s68D3SI+GrGl03QURu0Rjy/NvadZSpmK9dJZlREaySeYLyug5ZltC1Qq0J+d8cMZbSUGOPgFqqZ+DwMeBbtaDZLrFy+TsIhUFZhFKiItkhSuL5QudY5gQdk6cy4FFy4fMBJy2DIKN1Hgdwlj8VPg5VrK+OqDnKNvclZ2stNUPUP0t0P1HdN28zOGK3jvnnjEccSjd2yEKR+ZhP1evRXoFz51Q3M+3OVXdhZe2vbFeJT7kl27y/j5Y8gVyad0c3g83MNzXB4PSDJC1Vff2fbTzo25NOvoF3vvP+MHqzw9NK16+fNg0v+Q6Bvmv7/aPsL2MFpd+MOMo+knL5Hu+Y1GaPfdk8ITcs+6hQAAAAASUVORK5CYII=',
			title : '定义变量'
		},{
			name : 'output',
			image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABeklEQVRIS62WwVHCQBSGv9+L3uQkOdqBUoFYgViB2gGpAKxgtQLpQDoAO8AK5Aie4g0P+pzNsJkMMEnA3VMy+zLfvn3/+18EcOasJzEQXPr3Rst4WKQa1cWq5ax1LD4Erbrgrf0GECXOuoiJGe/LVLUZJM6GiEEBq4EUAIy3RapuXRYB4A8kcZHHV0AOBmA8AnPESxXkX4BFqmHi7L4KsjfAK+5IvBpkwEgiM6MXFPhr3H6mGoer3hvgP0ycTRFXO+u1UcuDAGvItiDEZFMsBwN2nb7tLBPMymqMCvBNm6XytSlWVEDi7HwFWRkSDRAsx/fGt3EdINEA/k7azma+uw1mAVIJaDvrS9zU2UfYN2iFfgiQSkCl3htQf4xOJcDf68k+MwK8bdyVvSl2DTKJ07K7xgY8rRutmHRRAbvKEhXgrQKYLlP1ttzUy2rZV6eBOHaGhNG7ZXZ5B8I8L06EZcbzMlW/yMA/5L8tMCxm7AEgM74E4xX0y170B6ZBG6nQfIvRAAAAAElFTkSuQmCC',
			title : '输出'
		},{
			name : 'datasource',
			image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABwUlEQVRIS72VzVECQRCFv4aLN7mo3DQEMmDNACMQE1AnAjWCNQSMQM1gyYAQ8LboBW5csK0eZld+Flj5sasopmpn+k33e69HOHDIgfOzEaAea0QVVaUhULMLKQxF6Nk6vZXuuksuAfiEwjUQARclK+wDCcpL6iSZPZMD1GKtHQmvIXHJvIXbkrFyNXQytK85wFms9yLEu2TOzyo3qZPOHEA91keEhz0BPKVOHv8d4EKhJ8LxLlWoMhJopE6M+F8OPMlTGVqrTEV/ipD4zc6PYVhI8jckX068vr1cIVKo2Y2K0HzFYGpJMnmexNqoQDRw8ryKgw4VOpsMtAg44582SmmSzTR9BN/PpVBvRPtZtb9RBHAaa6syNdruoVxmLZsbFWY2I2lbJQWi7zOTzXFgFXw6MRVga4HIyFVorAIMCXtGtkIyez5b5xUEJzdVeB7cyfs2ffIXEx5EeV/rZBvHJj0bycF8fnBNJozsv1qdmlF1KmEb5UZ0Ns4LVbTPYaeKW/JBcPIbQnOb9uRnlO4YWktOzjYEB7e9toXzUmDKh39woLPywVmVKADa58xUtjbjefMtJlzMs/FNLlXBmk0HB/gB82jJGd1frj0AAAAASUVORK5CYII=',
			title : '定义数据源'
		},{
			name : 'executeSql',
			image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAACrElEQVRIS6VWQVYTQRD9Pyt3hIUyO8kJDCcgnMBwAsIJMn0CwgmaGxBOQDyB8QTACcTdRBfGnS6kfL+mBzskxBBnO9VV9X/9+t3Emq+Itm8tvKehb0CbQFfhBtwSmBsx4QM+VIH3z6Xhqh9KDOIMwMAMPwBMCdzmsVYX65HYATCG4XxVoaUCb6L1SVyyTjyqAsf/QDlQnBE7Zjj9GjjJ4xcKFNEGIC5huKoCdXDjr4g2BnECw2ne1GOBLLmgjjbOnAUW0Uai9sFw3CDxAj5M4obmA3tR508bERKjC+NAM2kKiOdeFbi/Tef5mXa09qtaEFM1y6SYzzl3GnSLGEqOvwzn88C5H2xhCEMPxLga8iqhF53jXEEZ3R3uRSulgllgWwdS8msz3AHYJ3FTlTxy6EDf5UocmiHMAi+KCzMYjqrAaY5kL9pceYVgasB8FthPHSlRdxbYbTqpSjIlcgHojGKrwN6aAhNqOYto2kJBdOXsRbtQh7OSB4nPrrp7aQEpyoedH8wp0pAWuK6p2BhBI9mlAommnvgTEleDZrB1gScUPRlUSSJuMwOnSKJYMWRfNK17EU2S/JgXECIjorxqoyG7TImzWcndRkVOTQsDPLibHkvCEoNvOyA59xq/EnVGCKm77c/fuNPe5DKVNT8umi9ePeC3TlcyL3dZYOz2bPji/w0dP7vo40fan2Sanb9WQRxWJTtNrNMD3Ocbmsv2dbTut8DbFJeXuBetMHxyq3g0O91SxHVV8vR//CjbeO1PbXYL+idG1ZDn2xTRkpIYLtl1Rkt94WizX4DEqSOirthnL5wcSRrmd9Ro3DWf+5JfnZlh14DB2iszQyIlaZNPZIR+6ScZNjFm6dKXbA1qQvf30uti5asiL5Qsun62EO9cuYY7f7YAcszJumfLH1Az6uCb1oXeAAAAAElFTkSuQmCC',
			title : '执行SQL'
		},{
			name : 'function',
			image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABsklEQVRIS92WzXXTQBSFvxsWsNQGrKWpIKYClA7cQUIFYSrAVDCmApwO0kGUCggVxEsZNmKHF+Rxnm3piDnCPzle5GR20szcO+/d9+6M8mgTE5eCjCMOg1rGFw2i1YI7oDwivkMVJk6VT80wPldBk2MSeGYQn54xQRYtewVZFTRPU/cm2thg/jPItesdW1Pk4C/FjYxfVVDRRcijDU18c90WQdNBtKkXSRU0S9b1a9CAY7x9gCI9ZR5tZjBewrAOqlcE4hLjQ5ekN4I9wAvETQ/YDHHe/d9LsArfe0LcL40zP2ESdmmQLYJGaeLzaCXi/R/jnUf9Xw1eRxudeNMlJHm0C8RXjLMq6J+m7MxdVUEXTr5V5JYEykXQeJO6e4xb/06iaohb8J0EvsBJBMMfQdeDaB+BiWCUlu1G9HoR5GvacVAnd8n2tZODCPYFfXQET5tgEO1O4vQxp9y1x4zv2pial95wywb3I59v/MZr3U1w2yU1/w3X2nWKtqahaIxv1bVQ7nNJPVOClTWccN6+NIy1BtpoYKw10FoDf0EsH7hKzdHnelPknfvCL5UDRuOi6Za/tnZbwIu057IAAAAASUVORK5CYII=',
			title : '执行函数'
		},{
			name : 'process',
			image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAACQElEQVRIS7WVwXEaQRBF3+di3YwPNtwEEZgMJEUgMhCOQLsRSIpgIAKjCIwjEGQgR2B0W+wLvsEB2tXDLrVg5MWuYqqoLXan+0///7tHnHjpmPzNYC2rcS2oF/tXa77+TPVcFV8J8CFYtya+HExkfMpSDf8GUgnQDDY26Ai6e4mGCMsStZvBeoib/PsU4zFLNfb/lQCNYCPEBaInMfcgM+oy+mb8mqXqRADwn2e8iM+8ukqA98E6NRhLvC1X4MkNej9Sjcrvo14wkviIcVUJUAQ3g12WExUUHOLfQRDfnaqjAarcsv/dtTtKg39NXOxvBHsWzI+qIIpY43xHA5jPbjUo3tWD1c+gnqWaRjrFE8ZDJUAjWCIRDlVixmCWKvHkb8STjBRome83tITWFsAbSuJO0Mlt9pClus+5bC2gM08VberLKUCczxK9i3S4a4plvKyg650eAfJG+YzxArg4U3+6U7wPJK4N+kUf5L2QyPiWpbosxT+uYVS2rkqWmiygWz6lJ8q53TTbrgiTFSTFPMqbbbpvXzWC+cluMdou0P+65rU4r2Dsp8tcyhMsB/ChdXNKAJ+ELnB0TSF6eQw3g93/oYEYL9YM9jXbJ6FwUaQJGFJjaGtGa+PKBcyT3x1kbzOWN1P0lRUBcqf0SzMdg/nSaJ/ByKDuY7mco7BvFbU7wrpl19CJN1g+z7cu8+oU+yPeB3H+G5NZqv2LaKeWg85xTxcabKsDny9xHvld4I24hN5RGpzAnduUJ/F++cC/AZxmDfR5GHMZAAAAAElFTkSuQmCC',
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
		layui.layer.open({
			id : 'test-window',
			content : '<div class="test-window-container"><div class="output-container"></div><canvas class="log-container" width="960" height="100"></canvas></div>',
			area : ["1000px","600px"],
			shade : 0,
			title : '测试窗口',
			btn : ['关闭','显示/隐藏输出','显示/隐藏日志'],
			btn2 : function(){
				var $output = $(".test-window-container .output-container");
				var $log = $(".test-window-container .log-container");
				if($output.is(":hidden")){
					$output.show();
					$output.find("canvas").css('height', $log.is(":hidden") ? 460 : 320)
					$log.attr('height',100)
					LogViewer.resize();
					for(var tableId in tableMap){
						tableMap[tableId].instance.resize();
					}
				}else{
					$output.hide();
					$log.attr('height',460);
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
					$log.attr('height',$output.is(":hidden") ? 460 : 100)
					$output.find("canvas").attr('height',320);
					LogViewer.resize();
					for(var tableId in tableMap){
						tableMap[tableId].instance.resize();
					}
				}else{
					$log.hide();
					$output.find("canvas").attr('height',460);
					LogViewer.resize();
					for(var tableId in tableMap){
						tableMap[tableId].instance.resize();
					}
				}
				return false;
			},
			end : function(){
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
				var socket = createWebSocket({
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
						if(eventType == 'output'){
							var tableId = 'output-' + message.nodeId;
							var $table = $('#' + tableId);
							if($table.length == 0){
								tableMap[tableId] = {
									index : 0
								};
								$table = $('<canvas width="960" height="320"/>').appendTo($(".test-window-container .output-container"));
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
							texts.push(new CanvasText({
								text : message.level
							}));
							texts.push(new CanvasText({
								text : event.timestamp
							}));
							var temp = message.message.split("{}");
							message.variables = message.variables || [];
							for(var i=0,len=temp.length;i<len;i++){
								if(temp[i]!=''){
									texts.push(new CanvasText({
										text : temp[i]
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
	layer.open({
	  type : 1,
	  title : source +'内容',
	  content: '<div class="message-content" style="padding:10px;'+(json ? '':'font-weight:bold;')+'">'+(json ? '' : msg.replace(/\n/g,'<br>'))+'</div>',
	  shade : 0,
	  area : json ? ['700px','500px'] : 'auto',
	  maxmin : true,
	  maxWidth : json ? undefined : 700,
	  maxHeight : json ? undefined : 500,
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