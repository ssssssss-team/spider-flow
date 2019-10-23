function btnFan() {
	// 获取参数中表达式的值
	var txt = $("#cron").val();
	if (txt) {
		var regs = txt.split(' ');
		$("input[name=v_second]").val(regs[0]);
		$("input[name=v_min]").val(regs[1]);
		$("input[name=v_hour]").val(regs[2]);
		$("input[name=v_day]").val(regs[3]);
		$("input[name=v_mouth]").val(regs[4]);
		$("input[name=v_week]").val(regs[5]);

		initObj(regs[0], "second");
		initObj(regs[1], "min");
		initObj(regs[2], "hour");
		initDay(regs[3]);
		initMonth(regs[4]);
		initWeek(regs[5]);

		if (regs.length > 6) {
			$("input[name=v_year]").val(regs[6]);
			initYear(regs[6]);
		}
	}
}

function initObj(strVal, strid) {
	var ary = null;
	var objRadio = $("input[name='" + strid + "'");
	if (strVal == "*") {
		objRadio.eq(0).attr("checked", "checked");
	} else if (strVal.split('-').length > 1) {
		ary = strVal.split('-');
		objRadio.eq(1).attr("checked", "checked");
		$("#" + strid + "Start_0").numberspinner('setValue', ary[0]);
		$("#" + strid + "End_0").numberspinner('setValue', ary[1]);
	} else if (strVal.split('/').length > 1) {
		ary = strVal.split('/');
		objRadio.eq(2).attr("checked", "checked");
		$("#" + strid + "Start_1").numberspinner('setValue', ary[0]);
		$("#" + strid + "End_1").numberspinner('setValue', ary[1]);
	} else {
		objRadio.eq(3).attr("checked", "checked");
		if (strVal != "?") {
			ary = strVal.split(",");
			for (var i = 0; i < ary.length; i++) {
				$("." + strid + "List input[value='" + ary[i] + "']").attr(
						"checked", "checked");
			}
		}
	}
}

function initDay(strVal) {
	var ary = null;
	var objRadio = $("input[name='day'");
	if (strVal == "*") {
		objRadio.eq(0).attr("checked", "checked");
	} else if (strVal == "?") {
		objRadio.eq(1).attr("checked", "checked");
	} else if (strVal.split('-').length > 1) {
		ary = strVal.split('-');
		objRadio.eq(2).attr("checked", "checked");
		$("#dayStart_0").numberspinner('setValue', ary[0]);
		$("#dayEnd_0").numberspinner('setValue', ary[1]);
	} else if (strVal.split('/').length > 1) {
		ary = strVal.split('/');
		objRadio.eq(3).attr("checked", "checked");
		$("#dayStart_1").numberspinner('setValue', ary[0]);
		$("#dayEnd_1").numberspinner('setValue', ary[1]);
	} else if (strVal.split('W').length > 1) {
		ary = strVal.split('W');
		objRadio.eq(4).attr("checked", "checked");
		$("#dayStart_2").numberspinner('setValue', ary[0]);
	} else if (strVal == "L") {
		objRadio.eq(5).attr("checked", "checked");
	} else {
		objRadio.eq(6).attr("checked", "checked");
		ary = strVal.split(",");
		for (var i = 0; i < ary.length; i++) {
			$(".dayList input[value='" + ary[i] + "']").attr("checked",
					"checked");
		}
	}
}

function initMonth(strVal) {
	var ary = null;
	var objRadio = $("input[name='mouth'");
	if (strVal == "*") {
		objRadio.eq(0).attr("checked", "checked");
	} else if (strVal == "?") {
		objRadio.eq(1).attr("checked", "checked");
	} else if (strVal.split('-').length > 1) {
		ary = strVal.split('-');
		objRadio.eq(2).attr("checked", "checked");
		$("#mouthStart_0").numberspinner('setValue', ary[0]);
		$("#mouthEnd_0").numberspinner('setValue', ary[1]);
	} else if (strVal.split('/').length > 1) {
		ary = strVal.split('/');
		objRadio.eq(3).attr("checked", "checked");
		$("#mouthStart_1").numberspinner('setValue', ary[0]);
		$("#mouthEnd_1").numberspinner('setValue', ary[1]);

	} else {
		objRadio.eq(4).attr("checked", "checked");

		ary = strVal.split(",");
		for (var i = 0; i < ary.length; i++) {
			$(".mouthList input[value='" + ary[i] + "']").attr("checked",
					"checked");
		}
	}
}

function initWeek(strVal) {
	var ary = null;
	var objRadio = $("input[name='week'");
	if (strVal == "*") {
		objRadio.eq(0).attr("checked", "checked");
	} else if (strVal == "?") {
		objRadio.eq(1).attr("checked", "checked");
	} else if (strVal.split('/').length > 1) {
		ary = strVal.split('/');
		objRadio.eq(2).attr("checked", "checked");
		$("#weekStart_0").numberspinner('setValue', ary[0]);
		$("#weekEnd_0").numberspinner('setValue', ary[1]);
	} else if (strVal.split('-').length > 1) {
		ary = strVal.split('-');
		objRadio.eq(3).attr("checked", "checked");
		$("#weekStart_1").numberspinner('setValue', ary[0]);
		$("#weekEnd_1").numberspinner('setValue', ary[1]);
	} else if (strVal.split('L').length > 1) {
		ary = strVal.split('L');
		objRadio.eq(4).attr("checked", "checked");
		$("#weekStart_2").numberspinner('setValue', ary[0]);
	} else {
		objRadio.eq(5).attr("checked", "checked");
		ary = strVal.split(",");
		for (var i = 0; i < ary.length; i++) {
			$(".weekList input[value='" + ary[i] + "']").attr("checked",
					"checked");
		}
	}
}

function initYear(strVal) {
	var ary = null;
	var objRadio = $("input[name='year'");
	if (strVal == "*") {
		objRadio.eq(1).attr("checked", "checked");
	} else if (strVal.split('-').length > 1) {
		ary = strVal.split('-');
		objRadio.eq(2).attr("checked", "checked");
		$("#yearStart_0").numberspinner('setValue', ary[0]);
		$("#yearEnd_0").numberspinner('setValue', ary[1]);
	}
}
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
	if (name == "year")
		val = "";
	var item = $("input[name=v_" + name + "]");
	item.val(val);
	item.change();
}

function appoint(dom) {

}

/**
 * 周期
 */
function cycle(dom) {
	var name = dom.name;
	var ns = $(dom).parent().find(".numberspinner");
	var start = ns.eq(0).numberspinner("getValue");
	var end = ns.eq(1).numberspinner("getValue");
	var item = $("input[name=v_" + name + "]");
	item.val(start + "-" + end);
	item.change();
}

/**
 * 从开始
 */
function startOn(dom) {
	var name = dom.name;
	var ns = $(dom).parent().find(".numberspinner");
	var start = ns.eq(0).numberspinner("getValue");
	var end = ns.eq(1).numberspinner("getValue");
	var item = $("input[name=v_" + name + "]");
	item.val(start + "/" + end);
	item.change();
}

function lastDay(dom) {
	var item = $("input[name=v_" + dom.name + "]");
	item.val("L");
	item.change();
}

function weekOfDay(dom) {
	var name = dom.name;
	var ns = $(dom).parent().find(".numberspinner");
	var start = ns.eq(0).numberspinner("getValue");
	var end = ns.eq(1).numberspinner("getValue");
	var item = $("input[name=v_" + name + "]");
	item.val(start + "#" + end);
	item.change();
}

function lastWeek(dom) {
	var item = $("input[name=v_" + dom.name + "]");
	var ns = $(dom).parent().find(".numberspinner");
	var start = ns.eq(0).numberspinner("getValue");
	item.val(start + "L");
	item.change();
}

function workDay(dom) {
	var name = dom.name;
	var ns = $(dom).parent().find(".numberspinner");
	var start = ns.eq(0).numberspinner("getValue");
	var item = $("input[name=v_" + name + "]");
	item.val(start + "W");
	item.change();
}
$(function() {
	$(".numberspinner").numberspinner({
		onChange : function() {
			$(this).closest("div.line").children().eq(0).click();
		}
	});

	var vals = $("input[name^='v_']");
	var cron = $("#cron");
	vals.change(function() {
		var item = [];
		vals.each(function() {
			item.push(this.value);
		});
		// 修复表达式错误BUG，如果后一项不为* 那么前一项肯定不为为*，要不然就成了每秒执行了
		// 获取当前选中tab
		var currentIndex = 0;
		$(".tabs>li").each(function(i, item) {
			if ($(item).hasClass("tabs-selected")) {
				currentIndex = i;
				return false;
			}

		});
		// 当前选中项之前的如果为*，则都设置成0
		for (var i = currentIndex; i >= 1; i--) {
			if (item[i] != "*" && item[i - 1] == "*") {
				item[i - 1] = "0";
			}
		}
		// 当前选中项之后的如果不为*则都设置成*
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

	cron.change(function() {
		// 获取参数中表达式的值
			btnFan();
			// 设置最近五次运行时间
			$.ajax({
				type : 'get',
				url : "/spider/recent5TriggerTime",
				dataType : "json",
				data : {
					"cron" : $("#cron").val()
				},
				success : function(data) {
					if (data && data.length == 5) {
						var strHTML = "<ul>";
						for (var i = 0; i < data.length; i++) {
							strHTML += "<li>" + data[i] + "</li>";
						}
						strHTML += "</ul>"
						$("#runTime").html(strHTML);
					} else {
						$("#runTime").html("");
					}
				}
			});
	});

	var secondList = $(".secondList").children();
	$("#sencond_appoint").click(function() {
		if (this.checked) {
			if ($(secondList).filter(":checked").length == 0) {
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
			var val = "?";
			if (vals.length > 0 && vals.length < 59) {
				val = vals.join(",");
			} else if (vals.length == 59) {
				val = "*";
			}
			var item = $("input[name=v_second]");
			item.val(val);
			item.change();
		}
	});

	var minList = $(".minList").children();
	$("#min_appoint").click(function() {
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
			} else if (vals.length == 59) {
				val = "*";
			}
			var item = $("input[name=v_min]");
			item.val(val);
			item.change();
		}
	});

	var hourList = $(".hourList").children();
	$("#hour_appoint").click(function() {
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
			} else if (vals.length == 24) {
				val = "*";
			}
			var item = $("input[name=v_hour]");
			item.val(val);
			item.change();
		}
	});

	var dayList = $(".dayList").children();
	$("#day_appoint").click(function() {
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
			} else if (vals.length == 31) {
				val = "*";
			}
			var item = $("input[name=v_day]");
			item.val(val);
			item.change();
		}
	});

	var mouthList = $(".mouthList").children();
	$("#mouth_appoint").click(function() {
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
			} else if (vals.length == 12) {
				val = "*";
			}
			var item = $("input[name=v_mouth]");
			item.val(val);
			item.change();
		}
	});

	var weekList = $(".weekList").children();
	$("#week_appoint").click(function() {
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
			} else if (vals.length == 7) {
				val = "*";
			}
			var item = $("input[name=v_week]");
			item.val(val);
			item.change();
		}
	});
});