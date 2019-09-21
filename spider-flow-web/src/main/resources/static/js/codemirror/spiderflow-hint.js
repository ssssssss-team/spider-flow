var grammers = [];
$.ajax({
	url : 'spider/grammers',
	type : 'post',
	dataType : 'json',
	success : function(json){
		if(json.code == 1){
			grammers = json.data;
			for(var i =0,len = grammers.length;i<len;i++){
				var grammer = grammers[i];
				if(grammer&&grammer.method&&grammer.method.length > 3&&grammer.method.indexOf("get") == 0){
					grammer.method = grammer.method.substring(3,4).toLowerCase() + grammer.method.substring(4); 
				}else if(grammer&&grammer.method){
					grammer.method = grammer.method + '()';
				}
			}
		}
		grammers = grammers || [];
	}
})
function searchGrammer(keyword,isClass){
	var list1 = [];
	var list2 = {};
	for(var i =0,len = grammers.length;i<len;i++){
		var grammer = grammers[i];
		if((!isClass) && (keyword==null||(grammer.method!=null&&grammer.method.indexOf(keyword) > -1))){
			list1.push(grammer.method);
			list2[grammer.method] = list2[grammer.method] || [];
			list2[grammer.method].push(grammer);
		}else if(keyword == null || (grammer['function']&&grammer['function'].indexOf(keyword) > -1)){
			if(grammer['function']&&grammer.method == null){
				list1.push(grammer['function']);
				list2[grammer['function']] = list2[grammer['function']] || [];
				list2[grammer['function']][0] = {owner:grammer.owner,comment : grammer.comment};
			}
		}
	}
	list1 = list1.sort();
	var set = [];
	if(list1.length > 0){
		set.push(list1[0]);
	}
	for (var i=1, len=list1.length; i<len; i++) {
		list1[i] !== list1[i-1] && set.push(list1[i]);
    }
	for (var key in list2){
		var arr = list2[key];
		var html = '';
		for(var i =0,len = arr.length;i<len;i++){
			var grammer = arr[i];
			html+= '<div class="hint-grammer">'
				if(grammer.owner){
					html+= '<div class="hint-owner">所属类：<span>'+grammer.owner.replace('<','&lt;')+'</span></div>';					
				}
				if(grammer.comment){
					html+= '<div class="hint-comment">说明：<span>'+grammer.comment.replace('<','&lt;')+'</span></div>';	
				}
				if(grammer.example){
					html+= '<div class="hint-example">'+grammer.example.replace('<','&lt;')+'</span></div>';
				}
				if(grammer.returns){
					html+= '<div class="hint-return">返回值：<span>'+grammer.returns.join("/").replace('<','&lt;')+'</span></div>';
				}
			html+= '</div>';
		}
		list2[key] = html;
	}
	return [set,list2];
}
function initHint(cm){
	cm.on('keyup',function(cm,e){
		if(e.keyCode ==38 || e.keyCode ==40 || e.keyCode == 13){
			return;
		}
		var cur = cm.getCursor();
		var ch = cur.ch;
		var token = cm.getTokenAt(cur);
		var curLine = cm.getLine(cur.line);
		var str1 = curLine.charAt(cur.ch - 1);
		var str2 = curLine.charAt(cur.ch - 2);
		if((str1=='{' &&str2=='$')){
			var ret = searchGrammer(null,true);
			var datas = {};
			datas.list = ret[0];
            datas.from = {};
            datas.from.line = cur.line;
            datas.from.ch = ch;
            datas.to = {};
            datas.to.line = cur.line;
            datas.to.ch = ch;
            datas.showList = ret[0];
            datas.key = '.';
            cm.showHint1({completeSingle: false,comments : {'.':ret[1]}},datas);
		}if(str1 == '.'){
			var ret = searchGrammer(null);
			var datas = {};
			datas.list = ret[0];
            datas.from = {};
            datas.from.line = cur.line;
            datas.from.ch = ch;
            datas.to = {};
            datas.to.line = cur.line;
            datas.to.ch = ch;
            datas.showList = ret[0];
            datas.key = '.';
            cm.showHint1({completeSingle: false,comments : {'.':ret[1]}},datas);
		}else{
			var regx = /(\w+)$/g;
			var line = curLine.substring(0,cur.ch);
			var keyword = regx.exec(line);
			if(keyword&&keyword[1]){
				keyword = keyword[1];
				var ret = searchGrammer(keyword);
				var datas = {};
				datas.list = ret[0];
	            datas.from = {};
	            datas.from.line = cur.line;
	            datas.from.ch = token.start;
	            datas.to = {};
	            datas.to.line = cur.line;
	            datas.to.ch = token.end;
	            datas.showList = ret[0];
	            datas.key = keyword;
	            var comments = {};
	            comments[keyword] = ret[1];
	            cm.showHint1({completeSingle: false,comments : comments},datas);
			}
			
		}
	})
}