var $;
layui.use(['jquery'], function(){
	$ = jQuery = layui.$;
	// 你可以在下面的 js 代码中使用你熟悉的 $, jQuery
});
/**
 * 每周期
 */
function everyTime(dom) {
	var item = $("input[name=v_" + dom.name + "]");
	item.val("*");
	item.change();
}

/**
 * 不指定
 */
function unAppoint(dom) {
	var name = dom.name;
	var val = "?";
	if (name === "year")
		val = "";
	var item = $("input[name=v_" + name + "]");
	item.val(val);
	item.change();
}

function appoint(dom) {

}

/**
 * 周期 从什么时候，到什么时候
 */
function cycle(dom) {
	var name = dom.name;
	var ns = $(dom).parent().find(".numberspinner");
	var start = ns.eq(0).val();
	var end = ns.eq(1).val();
	var item = $("input[name=v_" + name + "]");
	item.val(start + "-" + end);
	item.change();
}

/**
 * 从开始 从什么时候，几秒执行一次
 */
function startOn(dom) {
	var name = dom.name;
	var ns = $(dom).parent().find(".numberspinner");
	var start = ns.eq(0).val();
	var end = ns.eq(1).val();
	var item = $("input[name=v_" + name + "]");
	item.val(start + "/" + end);
	item.change();
}

function lastDay(dom){
	var item = $("input[name=v_" + dom.name + "]");
	item.val("L");
	item.change();
}

function weekOfDay(dom){
	var name = dom.name;
	var ns = $(dom).parent().find(".numberspinner");
	var start = ns.eq(0).val();
	var end = ns.eq(1).val();
	var item = $("input[name=v_" + name + "]");
	item.val(start + "#" + end);
	item.change();
}

function lastWeek(dom){
	var item = $("input[name=v_" + dom.name + "]");
	var ns = $(dom).parent().find(".numberspinner");
	var start = ns.eq(0).val();
	item.val(start+"L");
	item.change();
}

function workDay(dom) {
	var name = dom.name;
	var ns = $(dom).parent().find(".numberspinner");
	var start = ns.eq(0).val();
	var item = $("input[name=v_" + name + "]");
	item.val(start + "W");
	item.change();
}

$(function() {
	$(".numberspinner").change(function(){
		$(this).closest("div.line").children().eq(0).click();
	});
	// $(":checkbox").change(function () {
	//     var radio = $(this).closest("div.line").children().eq(0);
	//     radio.unbind("click")
	// 	$(this).closest("div.line").children().eq(0).click();
    //
	// });
	var vals = $("input[name^='v_']");
	var cron = $("#cron");
	vals.change(function() {
		var item = [];
		vals.each(function() {
			item.push(this.value);
		});
	    //修复表达式错误BUG，如果后一项不为* 那么前一项肯定不为为*，要不然就成了每秒执行了
	    //获取当前选中tab
		var currentIndex = 0;
		$(".tabs>li").each(function (i, item) {
		    if($(item).hasClass("tabs-selected")){
		        currentIndex =i;
		        return false;
		    }

		});
        //当前选中项之前的如果为*，则都设置成0
		for (var i = currentIndex; i >= 1; i--) {
		    if (item[i] != "*" && item[i - 1] == "*") {
		        item[i - 1] = "0";
		    }
		}
	    //当前选中项之后的如果不为*则都设置成*
		if (item[currentIndex] == "*") {
		    for (var i = currentIndex + 1; i < item.length; i++) {
		        if (i == 5) {
		            item[i] = "?";
		        } else {
		            item[i] = "*";
		        }
		    }
		}
		cron.val(item.join(" ")).change();
	});

	cron.change(function () {
	    btnFan();
	    //设置最近五次运行时间
	    $.ajax({
	        type: 'get',
	        url: "/spider/recent5TriggerTime",
	        dataType: "json",
	        data: { "cron": $("#cron").val() },
	        success: function (data) {
	            if (data) {
	                var strHTML = "<ul>";
	                for (var i = 0; i < data.length; i++) {
	                    strHTML += "<li>" + data[i] + "</li>";
	                }
	                strHTML +="</ul>"
	                $("#runTime").html(strHTML);
	            } else {
	                $("#runTime").html("");
	            }
	        }
	    });
	});
	
	var secondList = $(".secondList").children();
	$("#sencond_appoint").click(function(){
	    if (this.checked) {
	        if ($(secondList).filter(":checked").length === 0) {
	            $(secondList.eq(0)).attr("checked", true);
	        }
			secondList.eq(0).change();
		}
	});

	secondList.change(function() {
		var sencond_appoint = $("#sencond_appoint").prop("checked");
		if (sencond_appoint) {
			var vals = [];
			secondList.each(function() {
				if (this.checked) {
					vals.push(this.value);
				}
			});
			var val = "0";
			if (vals.length > 0 && vals.length < 59) {
				val = vals.join(","); 
			}else if(vals.length === 59){
				val = "*";
			}
			var item = $("input[name=v_second]");
			item.val(val);
			item.change();
		}
	});
	
	var minList = $(".minList").children();
	$("#min_appoint").click(function(){
	    if (this.checked) {
	        if ($(minList).filter(":checked").length == 0) {
	            $(minList.eq(0)).attr("checked", true);
	        }
			minList.eq(0).change();
		}
	});
	
	minList.change(function() {
		var min_appoint = $("#min_appoint").prop("checked");
		if (min_appoint) {
			var vals = [];
			minList.each(function() {
				if (this.checked) {
					vals.push(this.value);
				}
			});
			var val = "?";
			if (vals.length > 0 && vals.length < 59) {
				val = vals.join(",");
			}else if(vals.length == 59){
				val = "*";
			}
			var item = $("input[name=v_min]");
			item.val(val);
			item.change();
		}
	});
	
	var hourList = $(".hourList").children();
	$("#hour_appoint").click(function(){
	    if (this.checked) {
	        if ($(hourList).filter(":checked").length == 0) {
	            $(hourList.eq(0)).attr("checked", true);
	        }
			hourList.eq(0).change();
		}
	});
	
	hourList.change(function() {
		var hour_appoint = $("#hour_appoint").prop("checked");
		if (hour_appoint) {
			var vals = [];
			hourList.each(function() {
				if (this.checked) {
					vals.push(this.value);
				}
			});
			var val = "?";
			if (vals.length > 0 && vals.length < 24) {
				val = vals.join(",");
			}else if(vals.length == 24){
				val = "*";
			}
			var item = $("input[name=v_hour]");
			item.val(val);
			item.change();
		}
	});
	
	var dayList = $(".dayList").children();
	$("#day_appoint").click(function(){
	    if (this.checked) {
	        if ($(dayList).filter(":checked").length == 0) {
	            $(dayList.eq(0)).attr("checked", true);
	        }
			dayList.eq(0).change();
		}
	});
	
	dayList.change(function() {
		var day_appoint = $("#day_appoint").prop("checked");
		if (day_appoint) {
			var vals = [];
			dayList.each(function() {
				if (this.checked) {
					vals.push(this.value);
				}
			});
			var val = "?";
			if (vals.length > 0 && vals.length < 31) {
				val = vals.join(",");
			}else if(vals.length == 31){
				val = "*";
			}
			var item = $("input[name=v_day]");
			item.val(val);
			item.change();
		}
	});
	
	var mouthList = $(".mouthList").children();
	$("#mouth_appoint").click(function(){
	    if (this.checked) {
	        if ($(mouthList).filter(":checked").length == 0) {
	            $(mouthList.eq(0)).attr("checked", true);
	        }
			mouthList.eq(0).change();
		}
	});
	
	mouthList.change(function() {
		var mouth_appoint = $("#mouth_appoint").prop("checked");
		if (mouth_appoint) {
			var vals = [];
			mouthList.each(function() {
				if (this.checked) {
					vals.push(this.value);
				}
			});
			var val = "?";
			if (vals.length > 0 && vals.length < 12) {
				val = vals.join(",");
			}else if(vals.length == 12){
				val = "*";
			}
			var item = $("input[name=v_mouth]");
			item.val(val);
			item.change();
		}
	});
	
	var weekList = $(".weekList").children();
	$("#week_appoint").click(function(){
	    if (this.checked) {
	        if ($(weekList).filter(":checked").length == 0) {
	            $(weekList.eq(0)).attr("checked", true);
	        }
			weekList.eq(0).change();
		}
	});
	
	weekList.change(function() {
		var week_appoint = $("#week_appoint").prop("checked");
		if (week_appoint) {
			var vals = [];
			weekList.each(function() {
				if (this.checked) {
					vals.push(this.value);
				}
			});
			var val = "?";
			if (vals.length > 0 && vals.length < 7) {
				val = vals.join(",");
			}else if(vals.length == 7){
				val = "*";
			}
			var item = $("input[name=v_week]");
			item.val(val);
			item.change();
		}
	});
});