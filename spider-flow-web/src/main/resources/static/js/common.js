function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
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