var $ = layui.$;
var editor;
$(function(){
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
		cell.data.set('shape',shape);
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
				datasources : datasources
			},function(html){
				$(".properties-container").html(html);
				layui.form.render();
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
			$(this).parent().parent().before('<div class="layui-form-item layui-form-relative"><i class="layui-icon layui-icon-close variable-remove"></i><label class="layui-form-label">变量名</label><div class="layui-input-block"><input type="text" name="variable-name" placeholder="变量名称" autocomplete="off" class="layui-input array"></div></div><div class="layui-form-item"><label class="layui-form-label">变量值</label><div class="layui-input-block"><input type="text" name="variable-value" placeholder="请输入变量值" autocomplete="off" class="layui-input array"></div></div><hr>');
		}).on("click",".editor-form-node .header-remove,.editor-form-node .parameter-remove,.editor-form-node .variable-remove,.editor-form-node .output-remove",function(){	//移除多行
			var $dom = $(this).parent();
			$dom.prev().remove();
			$dom.next().remove();
			$dom.remove();
			serializeForm();
		}).on("click",".editor-form-node .header-add",function(){
			$(this).parent().parent().before('<div class="layui-form-item layui-form-relative"><i class="layui-icon layui-icon-close header-remove"></i><label class="layui-form-label">header名</label><div class="layui-input-block"><input type="text" name="header-name" placeholder="header key" autocomplete="off" class="layui-input array"></div></div><div class="layui-form-item"><label class="layui-form-label">header值</label><div class="layui-input-block"><input type="text" name="header-value" placeholder="请输入header value" autocomplete="off" class="layui-input array"></div></div><hr>');
		}).on("click",".editor-form-node .parameter-add",function(){
			$(this).parent().parent().before('<div class="layui-form-item layui-form-relative"><i class="layui-icon layui-icon-close parameter-remove"></i><label class="layui-form-label">参数名</label><div class="layui-input-block"><input type="text" name="parameter-name" placeholder="请输入参数名" autocomplete="off" class="layui-input array"></div></div><div class="layui-form-item"><label class="layui-form-label">参数值</label><div class="layui-input-block"><input type="text" name="parameter-value" placeholder="请输入参数值" autocomplete="off" class="layui-input array"></div></div><hr>');
		}).on("click",".editor-form-node .output-add",function(){
			$(this).parent().parent().before('<div class="layui-form-item layui-form-relative"><i class="layui-icon layui-icon-close output-remove"></i><label class="layui-form-label">输出项</label><div class="layui-input-block"><input type="text" name="output-name" placeholder="请输入输出项" autocomplete="off" class="layui-input array"></div></div><div class="layui-form-item"><label class="layui-form-label">输出值</label><div class="layui-input-block"><input type="text" name="output-value" placeholder="请输入输出值" autocomplete="off" class="layui-input array"></div></div><hr>');
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
			title : '子流程',
			disabled : true
		},{
			name : 'redis',
			image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAEMUlEQVRIS5VWS28bVRT+zp0ZO48676RtoMRIdR6tlBqpRSAWpGFPIrFBQojsaBHQZI2Euq1AciqxY2OrqtQNwvyBPhZQQUGkG5QQFu4ixiFJG+I87bn3oDPxjJ2x3YYrWX7de875HufMJfyP9TA5GmfQFKCmAUwAuA+YbCv2Mq8t5DaPE4qOs+lh8twMA1MATbeNjGB3ack7Fh0cxEE+731mcBpA9q2FP354XsymCQ/RWNcYmCGgyw9y+oMPcebjq9jP57H75xL++vKLUHzOEZAGTObNhcVcOPmRhL8n4137aJ8y4FkCJcObey5Pon1kFD2X30Hb8Ai2fnuEp/fu4u/bt5qA4iwD6VrUXsIfk+ck+DWhTNAIbT0Tk+i8eMkLtLO0iKf372Hr10fedysWw5krnyD31Q3vu2bGlgE2tMHKfglRxTjfGkXMsvz/CxbRHYK+SXfHx35uUep1v0RJduHOdw0rzn19ow7NujZYcw00DskqHBwgd1BGhIA3TrRguCUaxNo1vEmZsREechQiSgV/iE4+fdaJmEedoMvfvgVdLNYVs2cMNjSwZQy23TK6LIWhiINoJWbJGKxpRr5sQDeHh1kidFmEU7ZCzKomro0sjoyeHvQ0lM/yDiIszn3esAg5u2sYq2WNde2l8BbNJxKbRNTp/yBUSOI+W8Giqqc6Ll6Ch3xiMjj8+P33ghapLW7dNVh3NYombGDOUObVl8fLTuu3O6BAR88YYHRbCicdC22qmljQDbw7DbdYPKKnGKfgJTIoVQF5GWMK6LdppddWn9KD8bFtR6n2A08HRqGsAwP49cmBPtvyUIeX6LNSNnimq8apLXjQUYGWK2UN+mY4wa9EbHRbFFC45mpsuKaOEqFbknYogsuMTc1H9JFEsqffVhiwFeyKJIJagOwxqqYRCiWY6Oc7dscY/NOg+kY9Iyz02gr9dtB7DSkWly4AuFAbRBzbZxG6K4cFjSAWjcL6yD5J1FFxdzOKwbxtgM/op+TYbKFkrq9q7gwHa+RY0WrPHLqi16JAn2euxmoTGXyK9xm/0PfnR1mcKGtLG++QaBNegiTsWNkj+ogZGjmzluKiNnhS0ocaCpKXHCswzoscK8NB2kCS+SPNL1AKG3AU2itTJtyTwaTxrRw2TjPH1jIghjvlWIEzn9OTjymVSMjzbr522vjNetJWgXF8x9aOKWFG+sx3ZjPDMPO/BGRNuTzrjZBUPN4Fx5lWRNcBDNVW7/eetIuMOnGszEhZvjNFH9GxbpQBTwCkTak0P5c7vILUPfFTZ89OKKIZEH30IuM0MwyYHxggPbe8LNeOI6vpFSMVj8dVJDIDQF5HUDdqfO835owB5ueWl6W3G65jXaJEZyWJid4OR/H0IZo3pVJ6Lperu8McG2Gj8lKJRFIBsyCaAHOOmLPadSXRsa6IEvM/0FkPMhbAf00AAAAASUVORK5CYII=',
			title : 'redis',
			disabled : true
		},{
			name : 'mongodb',
			image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAB/klEQVRIS2NkIAHMPjO9nYmBbWuySfIRYrUxEqtw4YV54Refn5vP9JfzY49PtySx+oiyYOm1pfJ7bm69//33N8aPn38xGEob3mnzaFUlxhKiLCjanv392eenHCADQRaAgKua29wi24IUQpYQtGDyyf71Rx8eDIAZBLOAi43rv5empx2h+MBrAXLQwCwQ45BluP36LpirLa71vMenRwqfL/BaMOP05DkH7u9NRjYA2QKQeIh+sC0+X+C1oHJ38Yf77+/y47PAUMrwbptnqwouX+C1IGJVwH90jeg+EOYW/rMkYjEryRbMPz+7YOftrf2ELADJ++sGRmSYpa7EZglOH5Biga+mT2GWVdaEEWYBqOzZfmvTCmLigKwgAhmcuD7q//ff31DsUOLTZDj/9CKK2PbkbTjjEm8ybT3QcOfyqwvKyKapC+oynHp0Fi6kLa79Al/pitcCbMHExyLG8Pj9E7gFhAo9goVd/b7K5zffXJdAL+xAfBl+mR+zQ2Zxkl0WgTRCC7wHsLiAlaaEMhjMUoI+ACkEBdWB+3tWcLFwMbD95Wa48fY29eoDmEvWnF+Uff3trSmSPwUYmPh4bybZpmsQqmxA8kT5AGbQ8WNb5nz/9snBySUKZ+mJbilJFpw9vaPg2/dvAbZ2QQ7EuJ5kH4A0HDu8Yb2VbUAgsRYAADh/9hka9HGsAAAAAElFTkSuQmCC',
			title : 'mongodb',
			disabled : true
		},{
			name : 'oss',
			image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABrklEQVRIS+WVzVEbQRBG3yfKJW7IB5u9oQwQERgi8BIBZGAmAkQEQwZABIgIrAzAEVi6LeaAuMkH1NSshGqFVjsLVVRRxRx3pvv1z9e94p2P3tk/nwyQeDs08VPQAdoGN8BAopf90kVZuWuV6Ju3zpq4DE4rejZ4NPbvnAJ0fqKA795SiTNBKyYIg9HE2CtCKgGJt7aJ6zrOn+EBImMncxqEbzHAOeIgFvnSvXGROR1WAlreWuvi/tXOZwZj4+vIabSQQXDabHAgIzXolJXGjAeJjSjY2Muc+nNA7lz8nkmw1N6MP/9htwl9ie1KiHGSOXXngMRbH/FjlVEeOXRC88I8IM5qA2Y6v44Y5CmHN3m20wFbXapiiTa9HUn4iujdrdNp8T7xVqmwhSYn3rqI45UA6EncMMnlF0q0O4FWYzrdy+elTGuVCAhRfYH2mlhZzmKvFuagRpOvbp3SWLYTY/+fU+85raKKwiILStoqmczheLpBaYq/pavDGD5CWrnsZuoI2k1zkDEEzsdwGqYyLL4GHBXlbMZVCOylCJYyiE7mGx9E1/Ub/db/H3x4wBPCkrQZHDvXGwAAAABJRU5ErkJggg==',
			title : 'oss',
			disabled : true
		}]
		for(var i =0,len = shapes.length;i<len;i++){
			var shape = shapes[i];
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