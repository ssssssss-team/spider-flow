function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
Date.prototype.format = function(b) {
	var a = this;
	var c = {
		"M+": a.getMonth() + 1,
		"d+": a.getDate(),
		"h+": a.getHours(),
		"m+": a.getMinutes(),
		"s+": a.getSeconds(),
		"q+": Math.floor((a.getMonth() + 3) / 3),
		S: a.getMilliseconds()
	};
	/(y+)/.test(b) && (b = b.replace(RegExp.$1, (a.getFullYear() + "").substr(4 - RegExp.$1.length)));
	for(var d in c) new RegExp("(" + d + ")").test(b) && (b = b.replace(RegExp.$1, 1 == RegExp.$1.length ? c[d] : ("00" + c[d]).substr(("" + c[d]).length)));
	return b
}
var sf = {};
sf.ajax = function(options){
	var loading;
	var loadingInterval;
	var closeClear = function(){
		layui.layer.close(loading);
		clearInterval(loadingInterval);
	}
	var beginTime = +new Date();
	var url = options.url;
	var type = options.type;
	var data = options.data;
	var success = options.success;
	var error = options.error;
	$.ajax({
		url:url,
		type:type,
		data:data,
		success:function(result){
			closeClear();
			success && success(result);
		},
		error:function(errorInfo){
			closeClear();
			error && error(errorInfo);
		},
		beforeSend:function(){
			loadingInterval = setInterval(function(){
				var endTime = +new Date();
				if((endTime-beginTime) > 500){
					loading = layui.layer.load(1, {
						shade: [0.1,'#fff']
					});
					clearInterval(loadingInterval);
				}
			},100);
		}
	})
}