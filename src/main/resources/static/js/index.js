var $ = layui.$;
$(function(){
	var openTab = function(title,href){
		if($(".layui-tab[lay-filter=admin-tab]").find("[lay-id="+title+"]").length > 0){	//判断是否已打开
			var $dom =  $(".layui-tab[lay-filter=admin-tab]");
			var index = $dom.find("[lay-id="+title+"]").index();
			$dom.find(".layui-tab-content .layui-tab-item").eq(index).find("iframe").attr("src",href);
		}else{
			var html  = '<iframe src="'+href+'" width="100%" height="100%" scrolling="yes" frameborder="0"></iframe>';
			layui.element.tabAdd('admin-tab',{
				title:title,
				content:html,
				id:title,
			});
		}
		layui.element.tabChange("admin-tab",title);
	}
	layui.element.init();
	$("body").on('click','.menu-list li a',function(){
		$(this).parents("ul").siblings().find("li.layui-this,dd.layui-this").removeClass('layui-this')
	}).on('click','.menu-list > ul',function(){
		$(this).siblings().find('.layui-nav-itemed').removeClass('layui-nav-itemed')
	}).on('click','.menu-list a',function(){
		var href = $(this).data('link');
		if(href){
			var title = $(this).html();
			openTab(title,href);
			return false;
		}
	})
});