'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * name: formSelects
 * 基于Layui Select多选
 * version: 4.0.0.0910
 * http://sun.faysunshine.com/layui/formSelects-v4/dist/formSelects-v4.js
 */
(function (layui, window, factory) {
	if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
		// 支持 CommonJS
		module.exports = factory();
	} else if (typeof define === 'function' && define.amd) {
		// 支持 AMD
		define(factory);
	} else if (window.layui && layui.define) {
		//layui加载
		layui.define(['jquery'], function (exports) {
			exports('formSelects', factory());
		});
	} else {
		window.formSelects = factory();
	}
})(typeof layui == 'undefined' ? null : layui, window, function () {
	var v = '4.0.0.0910',
	    NAME = 'xm-select',
	    PNAME = 'xm-select-parent',
	    INPUT = 'xm-select-input',
	    TDIV = 'xm-select--suffix',
	    THIS = 'xm-select-this',
	    LABEL = 'xm-select-label',
	    SEARCH = 'xm-select-search',
	    SEARCH_TYPE = 'xm-select-search-type',
	    SHOW_COUNT = 'xm-select-show-count',
	    CREATE = 'xm-select-create',
	    CREATE_LONG = 'xm-select-create-long',
	    MAX = 'xm-select-max',
	    SKIN = 'xm-select-skin',
	    DIRECTION = "xm-select-direction",
	    HEIGHT = 'xm-select-height',
	    DISABLED = 'xm-dis-disabled',
	    DIS = 'xm-select-dis',
	    TEMP = 'xm-select-temp',
	    RADIO = 'xm-select-radio',
	    LINKAGE = 'xm-select-linkage',
	    DL = 'xm-select-dl',
	    DD_HIDE = 'xm-select-hide',
	    HIDE_INPUT = 'xm-hide-input',
	    SANJIAO = 'xm-select-sj',
	    ICON_CLOSE = 'xm-icon-close',
	    FORM_TITLE = 'xm-select-title',
	    FORM_SELECT = 'xm-form-select',
	    FORM_SELECTED = 'xm-form-selected',
	    FORM_NONE = 'xm-select-none',
	    FORM_EMPTY = 'xm-select-empty',
	    FORM_INPUT = 'xm-input',
	    FORM_DL_INPUT = 'xm-dl-input',
	    FORM_SELECT_TIPS = 'xm-select-tips',
	    CHECKBOX_YES = 'xm-iconfont',
	    FORM_TEAM_PID = 'XM_PID_VALUE',
	    CZ = 'xm-cz',
	    CZ_GROUP = 'xm-cz-group',
	    TIPS = '请选择',
	    data = {},
	    events = {
		on: {},
		endOn: {},
		filter: {},
		maxTips: {},
		opened: {},
		closed: {}
	},
	    ajax = {
		type: 'get',
		header: {},
		first: true,
		data: {},
		searchUrl: '',
		searchName: 'keyword',
		searchVal: null,
		keyName: 'name',
		keyVal: 'value',
		keySel: 'selected',
		keyDis: 'disabled',
		keyChildren: 'children',
		dataType: '',
		delay: 500,
		beforeSuccess: null,
		success: null,
		error: null,
		beforeSearch: null,
		response: {
			statusCode: 0,
			statusName: 'code',
			msgName: 'msg',
			dataName: 'data'
		},
		tree: {
			nextClick: function nextClick(id, item, callback) {
				callback([]);
			},
			folderChoose: true,
			lazy: true
		}
	},
	    quickBtns = [{ icon: 'xm-iconfont icon-quanxuan', name: '全选', click: function click(id, cm) {
			cm.selectAll(id, true, true);
		} }, { icon: 'xm-iconfont icon-qingkong', name: '清空', click: function click(id, cm) {
			cm.removeAll(id, true, true);
		} }, { icon: 'xm-iconfont icon-fanxuan', name: '反选', click: function click(id, cm) {
			cm.reverse(id, true, true);
		} }, { icon: 'xm-iconfont icon-pifu', name: '换肤', click: function click(id, cm) {
			cm.skin(id);
		} }],
	    $ = window.$ || window.layui && window.layui.jquery,
	    $win = $(window),
	    ajaxs = {},
	    fsConfig = {},
	    fsConfigs = {},
	    FormSelects = function FormSelects(options) {
		var _this = this;

		this.config = {
			name: null, //xm-select="xxx"
			max: null,
			maxTips: function maxTips(id, vals, val, max) {
				var ipt = $('[xid="' + _this.config.name + '"]').prev().find('.' + NAME);
				if (ipt.parents('.layui-form-item[pane]').length) {
					ipt = ipt.parents('.layui-form-item[pane]');
				}
				ipt.attr('style', 'border-color: red !important');
				setTimeout(function () {
					ipt.removeAttr('style');
				}, 300);
			},
			init: null, //初始化的选择值,
			on: null, //select值发生变化
			opened: null,
			closed: null,
			filter: function filter(id, inputVal, val, isDisabled) {
				return val.name.indexOf(inputVal) == -1;
			},
			clearid: -1,
			direction: 'auto',
			height: null,
			isEmpty: false,
			btns: [quickBtns[0], quickBtns[1], quickBtns[2]],
			searchType: 0,
			create: function create(id, name) {
				return Date.now();
			},
			template: function template(id, item) {
				return item.name;
			},
			showCount: 0,
			isCreate: false,
			placeholder: TIPS,
			clearInput: false
		};
		this.select = null;
		this.values = [];
		$.extend(this.config, options, {
			searchUrl: options.isSearch ? options.searchUrl : null,
			placeholder: options.optionsFirst ? options.optionsFirst.value ? TIPS : options.optionsFirst.innerHTML || TIPS : TIPS,
			btns: options.radio ? [quickBtns[1]] : [quickBtns[0], quickBtns[1], quickBtns[2]]
		}, fsConfigs[options.name] || fsConfig);
		if (isNaN(this.config.showCount) || this.config.showCount <= 0) {
			this.config.showCount = 19921012;
		}
	};

	//一些简单的处理方法
	var Common = function Common() {
		this.appender();
		this.on();
		this.onreset();
	};

	Common.prototype.appender = function () {
		//针对IE做的一些拓展
		//拓展Array map方法
		if (!Array.prototype.map) {
			Array.prototype.map = function (i, h) {
				var b,
				    a,
				    c,
				    e = Object(this),
				    f = e.length >>> 0;if (h) {
					b = h;
				}a = new Array(f);c = 0;while (c < f) {
					var d, g;if (c in e) {
						d = e[c];g = i.call(b, d, c, e);a[c] = g;
					}c++;
				}return a;
			};
		};

		//拓展Array foreach方法
		if (!Array.prototype.forEach) {
			Array.prototype.forEach = function forEach(g, b) {
				var d, c;if (this == null) {
					throw new TypeError("this is null or not defined");
				}var f = Object(this);var a = f.length >>> 0;if (typeof g !== "function") {
					throw new TypeError(g + " is not a function");
				}if (arguments.length > 1) {
					d = b;
				}c = 0;while (c < a) {
					var e;if (c in f) {
						e = f[c];g.call(d, e, c, f);
					}c++;
				}
			};
		};

		//拓展Array filter方法
		if (!Array.prototype.filter) {
			Array.prototype.filter = function (b) {
				if (this === void 0 || this === null) {
					throw new TypeError();
				}var f = Object(this);var a = f.length >>> 0;if (typeof b !== "function") {
					throw new TypeError();
				}var e = [];var d = arguments[1];for (var c = 0; c < a; c++) {
					if (c in f) {
						var g = f[c];if (b.call(d, g, c, f)) {
							e.push(g);
						}
					}
				}return e;
			};
		};
	};

	Common.prototype.init = function (target) {
		var _this2 = this;

		//初始化页面上已有的select
		$(target ? target : 'select[' + NAME + ']').each(function (index, select) {
			var othis = $(select),
			    id = othis.attr(NAME),
			    hasLayuiRender = othis.next('.layui-form-select'),
			    hasRender = othis.next('.' + PNAME),
			    options = {
				name: id,
				disabled: select.disabled,
				max: othis.attr(MAX) - 0,
				isSearch: othis.attr(SEARCH) != undefined,
				searchUrl: othis.attr(SEARCH),
				isCreate: othis.attr(CREATE) != undefined,
				radio: othis.attr(RADIO) != undefined,
				skin: othis.attr(SKIN),
				direction: othis.attr(DIRECTION),
				optionsFirst: select.options[0],
				height: othis.attr(HEIGHT),
				formname: othis.attr('name') || othis.attr('_name'),
				layverify: othis.attr('lay-verify') || othis.attr('_lay-verify'),
				layverType: othis.attr('lay-verType'),
				searchType: othis.attr(SEARCH_TYPE) == 'dl' ? 1 : 0,
				showCount: othis.attr(SHOW_COUNT) - 0
			},
			    value = othis.find('option[selected]').toArray().map(function (option) {
				//获取已选中的数据
				return {
					name: option.innerHTML,
					value: option.value
				};
			}),
			    fs = new FormSelects(options);

			fs.values = value;

			if (fs.config.init) {
				fs.values = fs.config.init.map(function (item) {
					if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) == 'object') {
						return item;
					}
					return {
						name: othis.find('option[value="' + item + '"]').text(),
						value: item
					};
				}).filter(function (item) {
					return item.name;
				});
				fs.config.init = fs.values.concat([]);
			} else {
				fs.config.init = value.concat([]);
			}

			!fs.values && (fs.values = []);

			data[id] = fs;

			//先取消layui对select的渲染
			hasLayuiRender[0] && hasLayuiRender.remove();
			hasRender[0] && hasRender.remove();

			//构造渲染div
			var dinfo = _this2.renderSelect(id, fs.config.placeholder, select);
			var heightStyle = !fs.config.height || fs.config.height == 'auto' ? '' : 'xm-hg style="height: 34px;"';
			var inputHtml = ['<div class="' + LABEL + '">', '<input type="text" fsw class="' + FORM_INPUT + ' ' + INPUT + '" ' + (fs.config.isSearch ? '' : 'style="display: none;"') + ' autocomplete="off" debounce="0" />', '</div>'];
			var reElem = $('<div class="' + FORM_SELECT + '" ' + SKIN + '="' + fs.config.skin + '">\n\t\t\t\t\t<input class="' + HIDE_INPUT + '" value="" name="' + fs.config.formname + '" lay-verify="' + fs.config.layverify + '" lay-verType="' + fs.config.layverType + '" type="text" style="position: absolute;bottom: 0; z-index: -1;width: 100%; height: 100%; border: none; opacity: 0;"/>\n\t\t\t\t\t<div class="' + FORM_TITLE + ' ' + (fs.config.disabled ? DIS : '') + '">\n\t\t\t\t\t\t<div class="' + FORM_INPUT + ' ' + NAME + '" ' + heightStyle + '>\n\t\t\t\t\t\t\t' + inputHtml.join('') + '\n\t\t\t\t\t\t\t<i class="' + SANJIAO + '"></i>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="' + TDIV + '">\n\t\t\t\t\t\t\t<input type="text" autocomplete="off" placeholder="' + fs.config.placeholder + '" readonly="readonly" unselectable="on" class="' + FORM_INPUT + '">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<dl xid="' + id + '" class="' + DL + ' ' + (fs.config.radio ? RADIO : '') + '">' + dinfo + '</dl>\n\t\t\t\t</div>');

			var $parent = $('<div class="' + PNAME + '" FS_ID="' + id + '"></div>');
			$parent.append(reElem);
			othis.after($parent);
			othis.attr('lay-ignore', '');
			othis.removeAttr('name') && othis.attr('_name', fs.config.formname);
			othis.removeAttr('lay-verify') && othis.attr('_lay-verify', fs.config.layverify);

			//如果可搜索, 加上事件
			if (fs.config.isSearch) {
				ajaxs[id] = $.extend({}, ajax, { searchUrl: fs.config.searchUrl }, ajaxs[id]);
				$(document).on('input', 'div.' + PNAME + '[FS_ID="' + id + '"] .' + INPUT, function (e) {
					_this2.search(id, e, fs.config.searchUrl);
				});
				if (fs.config.searchUrl) {
					//触发第一次请求事件
					_this2.triggerSearch(reElem, true);
				}
			} else {
				//隐藏第二个dl
				reElem.find('dl dd.' + FORM_DL_INPUT).css('display', 'none');
			}
		});
	};

	Common.prototype.search = function (id, e, searchUrl, call) {
		var _this3 = this;

		var input = void 0;
		if (call) {
			input = call;
		} else {
			input = e.target;
			var keyCode = e.keyCode;
			if (keyCode === 9 || keyCode === 13 || keyCode === 37 || keyCode === 38 || keyCode === 39 || keyCode === 40) {
				return false;
			}
		}
		var inputValue = $.trim(input.value);
		//过滤一下tips
		this.changePlaceHolder($(input));

		var ajaxConfig = ajaxs[id] ? ajaxs[id] : ajax;
		searchUrl = ajaxConfig.searchUrl || searchUrl;
		var fs = data[id],
		    isCreate = fs.config.isCreate,
		    reElem = $('dl[xid="' + id + '"]').parents('.' + FORM_SELECT);
		//如果开启了远程搜索
		if (searchUrl) {
			if (ajaxConfig.searchVal) {
				inputValue = ajaxConfig.searchVal;
				ajaxConfig.searchVal = '';
			}
			if (!ajaxConfig.beforeSearch || ajaxConfig.beforeSearch && ajaxConfig.beforeSearch instanceof Function && ajaxConfig.beforeSearch(id, searchUrl, inputValue)) {
				var delay = ajaxConfig.delay;
				if (ajaxConfig.first) {
					ajaxConfig.first = false;
					delay = 10;
				}
				clearTimeout(fs.clearid);
				fs.clearid = setTimeout(function () {
					reElem.find('dl > *:not(.' + FORM_SELECT_TIPS + ')').remove();
					reElem.find('dd.' + FORM_NONE).addClass(FORM_EMPTY).text('请求中');
					_this3.ajax(id, searchUrl, inputValue, false, null, true);
				}, delay);
			}
		} else {
			reElem.find('dl .' + DD_HIDE).removeClass(DD_HIDE);
			//遍历选项, 选择可以显示的值
			reElem.find('dl dd:not(.' + FORM_SELECT_TIPS + ')').each(function (idx, item) {
				var _item = $(item);
				var searchFun = events.filter[id] || data[id].config.filter;
				if (searchFun && searchFun(id, inputValue, _this3.getItem(id, _item), _item.hasClass(DISABLED)) == true) {
					_item.addClass(DD_HIDE);
				}
			});
			//控制分组名称
			reElem.find('dl dt').each(function (index, item) {
				if (!$(item).nextUntil('dt', ':not(.' + DD_HIDE + ')').length) {
					$(item).addClass(DD_HIDE);
				}
			});
			//动态创建
			this.create(id, isCreate, inputValue);
			var shows = reElem.find('dl dd:not(.' + FORM_SELECT_TIPS + '):not(.' + DD_HIDE + ')');
			if (!shows.length) {
				reElem.find('dd.' + FORM_NONE).addClass(FORM_EMPTY).text('无匹配项');
			} else {
				reElem.find('dd.' + FORM_NONE).removeClass(FORM_EMPTY);
			}
		}
	};

	Common.prototype.isArray = function (obj) {
		return Object.prototype.toString.call(obj) == "[object Array]";
	};

	Common.prototype.triggerSearch = function (div, isCall) {
		var _this4 = this;

		(div ? [div] : $('.' + FORM_SELECT).toArray()).forEach(function (reElem, index) {
			reElem = $(reElem);
			var id = reElem.find('dl').attr('xid');
			if (id && data[id] && data[id].config.isEmpty || isCall) {
				_this4.search(id, null, null, data[id].config.searchType == 0 ? reElem.find('.' + LABEL + ' .' + INPUT) : reElem.find('dl .' + FORM_DL_INPUT + ' .' + INPUT));
			}
		});
	};

	Common.prototype.clearInput = function (id) {
		var div = $('.' + PNAME + '[fs_id="' + id + '"]');
		var input = data[id].config.searchType == 0 ? div.find('.' + LABEL + ' .' + INPUT) : div.find('dl .' + FORM_DL_INPUT + ' .' + INPUT);
		input.val('');
	};

	Common.prototype.ajax = function (id, searchUrl, inputValue, isLinkage, linkageWidth, isSearch, successCallback, isReplace) {
		var _this5 = this;

		var reElem = $('.' + PNAME + ' dl[xid="' + id + '"]').parents('.' + FORM_SELECT);
		if (!reElem[0] || !searchUrl) {
			return;
		}
		var ajaxConfig = ajaxs[id] ? ajaxs[id] : ajax;
		var ajaxData = $.extend(true, {}, ajaxConfig.data);
		ajaxData[ajaxConfig.searchName] = inputValue;
		//是否需要对ajax添加随机时间
		//ajaxData['_'] = Date.now();
		$.ajax({
			type: ajaxConfig.type,
			headers: ajaxConfig.header,
			url: searchUrl,
			data: ajaxConfig.dataType == 'json' ? JSON.stringify(ajaxData) : ajaxData,
			success: function success(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
				}
				ajaxConfig.beforeSuccess && ajaxConfig.beforeSuccess instanceof Function && (res = ajaxConfig.beforeSuccess(id, searchUrl, inputValue, res));
				if (_this5.isArray(res)) {
					var newRes = {};
					newRes[ajaxConfig.response.statusName] = ajaxConfig.response.statusCode;
					newRes[ajaxConfig.response.msgName] = "";
					newRes[ajaxConfig.response.dataName] = res;
					res = newRes;
				}
				if (res[ajaxConfig.response.statusName] != ajaxConfig.response.statusCode) {
					reElem.find('dd.' + FORM_NONE).addClass(FORM_EMPTY).text(res[ajaxConfig.response.msgName]);
				} else {
					reElem.find('dd.' + FORM_NONE).removeClass(FORM_EMPTY);
					_this5.renderData(id, res[ajaxConfig.response.dataName], isLinkage, linkageWidth, isSearch, isReplace);
					data[id].config.isEmpty = res[ajaxConfig.response.dataName].length == 0;
				}
				successCallback && successCallback(id);
				ajaxConfig.success && ajaxConfig.success instanceof Function && ajaxConfig.success(id, searchUrl, inputValue, res);
			},
			error: function error(err) {
				reElem.find('dd[lay-value]:not(.' + FORM_SELECT_TIPS + ')').remove();
				reElem.find('dd.' + FORM_NONE).addClass(FORM_EMPTY).text('服务异常');
				ajaxConfig.error && ajaxConfig.error instanceof Function && ajaxConfig.error(id, searchUrl, inputValue, err);
			}
		});
	};

	Common.prototype.renderData = function (id, dataArr, linkage, linkageWidth, isSearch, isReplace) {
		var _this6 = this;

		if (linkage) {
			//渲染多级联动
			this.renderLinkage(id, dataArr, linkageWidth);
			return;
		}
		if (isReplace) {
			this.renderReplace(id, dataArr);
			return;
		}

		var reElem = $('.' + PNAME + ' dl[xid="' + id + '"]').parents('.' + FORM_SELECT);
		var ajaxConfig = ajaxs[id] ? ajaxs[id] : ajax;
		var pcInput = reElem.find('.' + TDIV + ' input');

		dataArr = this.exchangeData(id, dataArr);
		var values = [];
		reElem.find('dl').html(this.renderSelect(id, pcInput.attr('placeholder') || pcInput.attr('back'), dataArr.map(function (item) {
			var itemVal = $.extend({}, item, {
				innerHTML: item[ajaxConfig.keyName],
				value: item[ajaxConfig.keyVal],
				sel: item[ajaxConfig.keySel],
				disabled: item[ajaxConfig.keyDis],
				type: item.type,
				name: item[ajaxConfig.keyName]
			});
			if (itemVal.sel) {
				values.push(itemVal);
			}
			return itemVal;
		})));

		var label = reElem.find('.' + LABEL);
		var dl = reElem.find('dl[xid]');
		if (isSearch) {
			//如果是远程搜索, 这里需要判重
			var oldVal = data[id].values;
			oldVal.forEach(function (item, index) {
				dl.find('dd[lay-value="' + item.value + '"]').addClass(THIS);
			});
			values.forEach(function (item, index) {
				if (_this6.indexOf(oldVal, item) == -1) {
					_this6.addLabel(id, label, item);
					dl.find('dd[lay-value="' + item.value + '"]').addClass(THIS);
					oldVal.push(item);
				}
			});
		} else {
			values.forEach(function (item, index) {
				_this6.addLabel(id, label, item);
				dl.find('dd[lay-value="' + item.value + '"]').addClass(THIS);
			});
			data[id].values = values;
		}
		this.commonHandler(id, label);
	};

	Common.prototype.renderLinkage = function (id, dataArr, linkageWidth) {
		var result = [],
		    index = 0,
		    temp = { "0": dataArr },
		    ajaxConfig = ajaxs[id] ? ajaxs[id] : ajax;
		db[id] = {};

		var _loop = function _loop() {
			var group = result[index++] = [],
			    _temp = temp;
			temp = {};
			$.each(_temp, function (pid, arr) {
				$.each(arr, function (idx, item) {
					var val = {
						pid: pid,
						name: item[ajaxConfig.keyName],
						value: item[ajaxConfig.keyVal]
					};
					db[id][val.value] = $.extend(item, val);
					group.push(val);
					var children = item[ajaxConfig.keyChildren];
					if (children && children.length) {
						temp[val.value] = children;
					}
				});
			});
		};

		do {
			_loop();
		} while (Object.getOwnPropertyNames(temp).length);

		var reElem = $('.' + PNAME + ' dl[xid="' + id + '"]').parents('.' + FORM_SELECT);
		var html = ['<div class="xm-select-linkage">'];

		$.each(result, function (idx, arr) {
			var groupDiv = ['<div style="left: ' + (linkageWidth - 0) * idx + 'px;" class="xm-select-linkage-group xm-select-linkage-group' + (idx + 1) + ' ' + (idx != 0 ? 'xm-select-linkage-hide' : '') + '">'];
			$.each(arr, function (idx2, item) {
				var span = '<li title="' + item.name + '" pid="' + item.pid + '" xm-value="' + item.value + '"><span>' + item.name + '</span></li>';
				groupDiv.push(span);
			});
			groupDiv.push('</div>');
			html = html.concat(groupDiv);
		});
		html.push('<div style="clear: both; height: 288px;"></div>');
		html.push('</div>');
		reElem.find('dl').html(html.join(''));
		reElem.find('.' + INPUT).css('display', 'none'); //联动暂时不支持搜索
	};

	Common.prototype.renderReplace = function (id, dataArr) {
		var _this7 = this;

		var dl = $('.' + PNAME + ' dl[xid="' + id + '"]');
		var ajaxConfig = ajaxs[id] ? ajaxs[id] : ajax;

		dataArr = this.exchangeData(id, dataArr);
		db[id] = dataArr;

		var html = dataArr.map(function (item) {
			var itemVal = $.extend({}, item, {
				innerHTML: item[ajaxConfig.keyName],
				value: item[ajaxConfig.keyVal],
				sel: item[ajaxConfig.keySel],
				disabled: item[ajaxConfig.keyDis],
				type: item.type,
				name: item[ajaxConfig.keyName]
			});
			return _this7.createDD(id, itemVal);
		}).join('');

		dl.find('dd:not(.' + FORM_SELECT_TIPS + '),dt:not([style])').remove();
		dl.find('dt[style]').after($(html));
	};

	Common.prototype.exchangeData = function (id, arr) {
		//这里处理树形结构
		var ajaxConfig = ajaxs[id] ? ajaxs[id] : ajax;
		var childrenName = ajaxConfig['keyChildren'];
		var disabledName = ajaxConfig['keyDis'];
		db[id] = {};
		var result = this.getChildrenList(arr, childrenName, disabledName, [], false);
		return result;
	};

	Common.prototype.getChildrenList = function (arr, childrenName, disabledName, pid, disabled) {
		var result = [],
		    offset = 0;
		for (var a = 0; a < arr.length; a++) {
			var item = arr[a];
			if (item.type && item.type == 'optgroup') {
				result.push(item);
				continue;
			} else {
				offset++;
			}
			var parentIds = pid.concat([]);
			parentIds.push(offset - 1 + '_E');
			item[FORM_TEAM_PID] = JSON.stringify(parentIds);
			item[disabledName] = item[disabledName] || disabled;
			result.push(item);
			var child = item[childrenName];
			if (child && common.isArray(child) && child.length) {
				item['XM_TREE_FOLDER'] = true;
				var pidArr = parentIds.concat([]);
				var childResult = this.getChildrenList(child, childrenName, disabledName, pidArr, item[disabledName]);
				result = result.concat(childResult);
			}
		}
		return result;
	};

	Common.prototype.create = function (id, isCreate, inputValue) {
		if (isCreate && inputValue) {
			var fs = data[id],
			    dl = $('[xid="' + id + '"]'),
			    tips = dl.find('dd.' + FORM_SELECT_TIPS + '.' + FORM_DL_INPUT),
			    tdd = null,
			    temp = dl.find('dd.' + TEMP);
			dl.find('dd:not(.' + FORM_SELECT_TIPS + '):not(.' + TEMP + ')').each(function (index, item) {
				if (inputValue == $(item).find('span').attr('name')) {
					tdd = item;
				}
			});
			if (!tdd) {
				//如果不存在, 则创建
				var val = fs.config.create(id, inputValue);
				if (temp[0]) {
					temp.attr('lay-value', val);
					temp.find('span').text(inputValue);
					temp.find('span').attr("name", inputValue);
					temp.removeClass(DD_HIDE);
				} else {
					tips.after($(this.createDD(id, {
						name: inputValue,
						innerHTML: inputValue,
						value: val
					}, TEMP + ' ' + CREATE_LONG)));
				}
			}
		} else {
			$('[xid=' + id + '] dd.' + TEMP).remove();
		}
	};

	Common.prototype.createDD = function (id, item, clz) {
		var ajaxConfig = ajaxs[id] ? ajaxs[id] : ajax;
		var name = $.trim(item.innerHTML);
		db[id][item.value] = $(item).is('option') ? item = function () {
			var resultItem = {};
			resultItem[ajaxConfig.keyName] = name;
			resultItem[ajaxConfig.keyVal] = item.value;
			resultItem[ajaxConfig.keyDis] = item.disabled;
			return resultItem;
		}() : item;
		var template = data[id].config.template(id, item);
		var pid = item[FORM_TEAM_PID];
		pid ? pid = JSON.parse(pid) : pid = [-1];
		var attr = pid[0] == -1 ? '' : 'tree-id="' + pid.join('-') + '" tree-folder="' + !!item['XM_TREE_FOLDER'] + '"';
		return '<dd lay-value="' + item.value + '" class="' + (item.disabled ? DISABLED : '') + ' ' + (clz ? clz : '') + '" ' + attr + '>\n\t\t\t\t\t<div class="xm-unselect xm-form-checkbox ' + (item.disabled ? DISABLED : '') + '"  style="margin-left: ' + (pid.length - 1) * 30 + 'px">\n\t\t\t\t\t\t<i class="' + CHECKBOX_YES + '"></i>\n\t\t\t\t\t\t<span name="' + name + '">' + template + '</span>\n\t\t\t\t\t</div>\n\t\t\t\t</dd>';
	};

	Common.prototype.createQuickBtn = function (obj, right) {
		return '<div class="' + CZ + '" method="' + obj.name + '" title="' + obj.name + '" ' + (right ? 'style="margin-right: ' + right + '"' : '') + '><i class="' + obj.icon + '"></i><span>' + obj.name + '</span></div>';
	};

	Common.prototype.renderBtns = function (id, show, right) {
		var _this8 = this;

		var quickBtn = [];
		var dl = $('dl[xid="' + id + '"]');
		quickBtn.push('<div class="' + CZ_GROUP + '" show="' + show + '" style="max-width: ' + (dl.prev().width() - 54) + 'px;">');
		$.each(data[id].config.btns, function (index, item) {
			quickBtn.push(_this8.createQuickBtn(item, right));
		});
		quickBtn.push('</div>');
		quickBtn.push(this.createQuickBtn({ icon: 'xm-iconfont icon-caidan', name: '' }));
		return quickBtn.join('');
	};

	Common.prototype.renderSelect = function (id, tips, select) {
		var _this9 = this;

		db[id] = {};
		var arr = [];
		if (data[id].config.btns.length) {
			setTimeout(function () {
				var dl = $('dl[xid="' + id + '"]');
				dl.parents('.' + FORM_SELECT).attr(SEARCH_TYPE, data[id].config.searchType);
				dl.find('.' + CZ_GROUP).css('max-width', dl.prev().width() - 54 + 'px');
			}, 10);
			arr.push(['<dd lay-value="" class="' + FORM_SELECT_TIPS + '" style="background-color: #FFF!important;">', this.renderBtns(id, null, '30px'), '</dd>', '<dd lay-value="" class="' + FORM_SELECT_TIPS + ' ' + FORM_DL_INPUT + '" style="background-color: #FFF!important;">', '<i class="xm-iconfont icon-sousuo"></i>', '<input type="text" class="' + FORM_INPUT + ' ' + INPUT + '" placeholder="\u8BF7\u641C\u7D22"/>', '</dd>'].join(''));
		} else {
			arr.push('<dd lay-value="" class="' + FORM_SELECT_TIPS + '">' + tips + '</dd>');
		}
		if (this.isArray(select)) {
			$(select).each(function (index, item) {
				if (item) {
					if (item.type && item.type === 'optgroup') {
						arr.push('<dt>' + item.name + '</dt>');
					} else {
						arr.push(_this9.createDD(id, item));
					}
				}
			});
		} else {
			$(select).find('*').each(function (index, item) {
				if (item.tagName.toLowerCase() == 'option' && index == 0 && !item.value) {
					return;
				}
				if (item.tagName.toLowerCase() === 'optgroup') {
					arr.push('<dt>' + item.label + '</dt>');
				} else {
					arr.push(_this9.createDD(id, item));
				}
			});
		}
		arr.push('<dt style="display:none;"> </dt>');
		arr.push('<dd class="' + FORM_SELECT_TIPS + ' ' + FORM_NONE + ' ' + (arr.length === 2 ? FORM_EMPTY : '') + '">\u6CA1\u6709\u9009\u9879</dd>');
		return arr.join('');
	};

	Common.prototype.on = function () {
		var _this10 = this;

		//事件绑定
		this.one();

		$(document).on('click', function (e) {
			if (!$(e.target).parents('.' + FORM_TITLE)[0]) {
				//清空input中的值
				$('.' + PNAME + ' dl .' + DD_HIDE).removeClass(DD_HIDE);
				$('.' + PNAME + ' dl dd.' + FORM_EMPTY).removeClass(FORM_EMPTY);
				$('.' + PNAME + ' dl dd.' + TEMP).remove();
				$.each(data, function (key, fs) {
					_this10.clearInput(key);
					if (!fs.values.length) {
						_this10.changePlaceHolder($('div[FS_ID="' + key + '"] .' + LABEL));
					}
				});
			}
			$('.' + PNAME + ' .' + FORM_SELECTED).each(function (index, item) {
				_this10.changeShow($(item).find('.' + FORM_TITLE), false);
			});
		});
	};

	Common.prototype.calcLabelLeft = function (label, w, call) {
		var pos = this.getPosition(label[0]);
		pos.y = pos.x + label[0].clientWidth;
		var left = label[0].offsetLeft;
		if (!label.find('span').length) {
			left = 0;
		} else if (call) {
			//校正归位
			var span = label.find('span:last');
			span.css('display') == 'none' ? span = span.prev()[0] : span = span[0];
			var spos = this.getPosition(span);
			spos.y = spos.x + span.clientWidth;

			if (spos.y > pos.y) {
				left = left - (spos.y - pos.y) - 5;
			} else {
				left = 0;
			}
		} else {
			if (w < 0) {
				var _span = label.find(':last');
				_span.css('display') == 'none' ? _span = _span.prev()[0] : _span = _span[0];
				var _spos = this.getPosition(_span);
				_spos.y = _spos.x + _span.clientWidth;
				if (_spos.y > pos.y) {
					left -= 10;
				}
			} else {
				if (left < 0) {
					left += 10;
				}
				if (left > 0) {
					left = 0;
				}
			}
		}
		label.css('left', left + 'px');
	};

	Common.prototype.one = function (target) {
		var _this11 = this;

		//一次性事件绑定
		$(target ? target : document).off('click', '.' + FORM_TITLE).on('click', '.' + FORM_TITLE, function (e) {
			var othis = $(e.target),
			    title = othis.is(FORM_TITLE) ? othis : othis.parents('.' + FORM_TITLE),
			    dl = title.next(),
			    id = dl.attr('xid');

			//清空非本select的input val
			$('dl[xid]').not(dl).each(function (index, item) {
				_this11.clearInput($(item).attr('xid'));
			});
			$('dl[xid]').not(dl).find('dd.' + DD_HIDE).removeClass(DD_HIDE);

			//如果是disabled select
			if (title.hasClass(DIS)) {
				return false;
			}
			//如果点击的是右边的三角或者只读的input
			if (othis.is('.' + SANJIAO) || othis.is('.' + INPUT + '[readonly]')) {
				_this11.changeShow(title, !title.parents('.' + FORM_SELECT).hasClass(FORM_SELECTED));
				return false;
			}
			//如果点击的是input的右边, focus一下
			if (title.find('.' + INPUT + ':not(readonly)')[0]) {
				var input = title.find('.' + INPUT),
				    epos = { x: e.pageX, y: e.pageY },
				    pos = _this11.getPosition(title[0]),
				    width = title.width();
				while (epos.x > pos.x) {
					if ($(document.elementFromPoint(epos.x, epos.y)).is(input)) {
						input.focus();
						_this11.changeShow(title, true);
						return false;
					}
					epos.x -= 50;
				}
			}

			//如果点击的是可搜索的input
			if (othis.is('.' + INPUT)) {
				_this11.changeShow(title, true);
				return false;
			}
			//如果点击的是x按钮
			if (othis.is('i[fsw="' + NAME + '"]')) {
				var val = _this11.getItem(id, othis),
				    dd = dl.find('dd[lay-value=\'' + val.value + '\']');
				if (dd.hasClass(DISABLED)) {
					//如果是disabled状态, 不可选, 不可删
					return false;
				}
				_this11.handlerLabel(id, dd, false, val);
				return false;
			}

			_this11.changeShow(title, !title.parents('.' + FORM_SELECT).hasClass(FORM_SELECTED));
			return false;
		});
		$(target ? target : document).off('click', 'dl.' + DL).on('click', 'dl.' + DL, function (e) {
			var othis = $(e.target);
			if (othis.is('.' + LINKAGE) || othis.parents('.' + LINKAGE)[0]) {
				//linkage的处理
				othis = othis.is('li') ? othis : othis.parents('li[xm-value]');
				var _group = othis.parents('.xm-select-linkage-group'),
				    _id = othis.parents('dl').attr('xid');
				if (!_id) {
					return false;
				}
				//激活li
				_group.find('.xm-select-active').removeClass('xm-select-active');
				othis.addClass('xm-select-active');
				//激活下一个group, 激活前显示对应数据
				_group.nextAll('.xm-select-linkage-group').addClass('xm-select-linkage-hide');
				var nextGroup = _group.next('.xm-select-linkage-group');
				nextGroup.find('li').addClass('xm-select-linkage-hide');
				nextGroup.find('li[pid="' + othis.attr('xm-value') + '"]').removeClass('xm-select-linkage-hide');
				//如果没有下一个group, 或没有对应的值
				if (!nextGroup[0] || nextGroup.find('li:not(.xm-select-linkage-hide)').length == 0) {
					var vals = [],
					    index = 0,
					    isAdd = !othis.hasClass('xm-select-this');
					if (data[_id].config.radio) {
						othis.parents('.xm-select-linkage').find('.xm-select-this').removeClass('xm-select-this');
					}
					do {
						vals[index++] = {
							name: othis.find('span').text(),
							value: othis.attr('xm-value')
						};
						othis = othis.parents('.xm-select-linkage-group').prev().find('li[xm-value="' + othis.attr('pid') + '"]');
					} while (othis.length);
					vals.reverse();
					var val = {
						name: vals.map(function (item) {
							return item.name;
						}).join('/'),
						value: vals.map(function (item) {
							return item.value;
						}).join('/')
					};
					_this11.handlerLabel(_id, null, isAdd, val);
				} else {
					nextGroup.removeClass('xm-select-linkage-hide');
				}
				return false;
			}

			if (othis.is('dl')) {
				return false;
			}

			if (othis.is('dt')) {
				othis.nextUntil('dt').each(function (index, item) {
					item = $(item);
					if (item.hasClass(DISABLED) || item.hasClass(THIS)) {} else {
						item.find('i:not(.icon-expand)').click();
					}
				});
				return false;
			}
			var dd = othis.is('dd') ? othis : othis.parents('dd');
			var id = dd.parent('dl').attr('xid');

			if (dd.hasClass(DISABLED)) {
				//被禁用选项的处理
				return false;
			}

			//菜单功效
			if (othis.is('i.icon-caidan')) {
				var opens = [],
				    closes = [];
				othis.parents('dl').find('dd[tree-folder="true"]').each(function (index, item) {
					$(item).attr('xm-tree-hidn') == undefined ? opens.push(item) : closes.push(item);
				});
				var arr = closes.length ? closes : opens;
				arr.forEach(function (item) {
					return item.click();
				});
				return false;
			}
			//树状结构的选择
			var treeId = dd.attr('tree-id');
			if (treeId) {
				//忽略右边的图标
				if (othis.is('i:not(.icon-expand)')) {
					_this11.handlerLabel(id, dd, !dd.hasClass(THIS));
					return false;
				}
				var ajaxConfig = ajaxs[id] || ajax;
				var treeConfig = ajaxConfig.tree;
				var childrens = dd.nextAll('dd[tree-id^="' + treeId + '"]');
				if (childrens && childrens.length) {
					var len = childrens[0].clientHeight;
					len ? (_this11.addTreeHeight(dd, len), len = 0) : (len = dd.attr('xm-tree-hidn') || 36, dd.removeAttr('xm-tree-hidn'), dd.find('>i').remove(), childrens = childrens.filter(function (index, item) {
						return $(item).attr('tree-id').split('-').length - 1 == treeId.split('-').length;
					}));
					childrens.animate({
						height: len
					}, 150);
					return false;
				} else {
					if (treeConfig.nextClick && treeConfig.nextClick instanceof Function) {
						treeConfig.nextClick(id, _this11.getItem(id, dd), function (res) {
							if (!res || !res.length) {
								_this11.handlerLabel(id, dd, !dd.hasClass(THIS));
							} else {
								dd.attr('tree-folder', 'true');
								var ddChilds = [];
								res.forEach(function (item, idx) {
									item.innerHTML = item[ajaxConfig.keyName];
									item[FORM_TEAM_PID] = JSON.stringify(treeId.split('-').concat([idx]));
									ddChilds.push(_this11.createDD(id, item));
									db[id][item[ajaxConfig.keyVal]] = item;
								});
								dd.after(ddChilds.join(''));
							}
						});
						return false;
					}
				}
			}

			if (dd.hasClass(FORM_SELECT_TIPS)) {
				//tips的处理
				var btn = othis.is('.' + CZ) ? othis : othis.parents('.' + CZ);
				if (!btn[0]) {
					return false;
				}
				var method = btn.attr('method');
				var obj = data[id].config.btns.filter(function (bean) {
					return bean.name == method;
				})[0];
				obj && obj.click && obj.click instanceof Function && obj.click(id, _this11);
				return false;
			}
			_this11.handlerLabel(id, dd, !dd.hasClass(THIS));
			return false;
		});
	};

	Common.prototype.addTreeHeight = function (dd, len) {
		var _this12 = this;

		var treeId = dd.attr('tree-id');
		var childrens = dd.nextAll('dd[tree-id^="' + treeId + '"]');
		if (childrens.length) {
			dd.append('<i class="xm-iconfont icon-expand"></i>');
			dd.attr('xm-tree-hidn', len);
			childrens.each(function (index, item) {
				var that = $(item);
				_this12.addTreeHeight(that, len);
			});
		}
	};

	var db = {};
	Common.prototype.getItem = function (id, value) {
		if (value instanceof $) {
			if (value.is('i[fsw="' + NAME + '"]')) {
				var span = value.parent();
				return db[id][value] || {
					name: span.find('font').text(),
					value: span.attr('value')
				};
			}
			var val = value.attr('lay-value');
			return !db[id][val] ? db[id][val] = {
				name: value.find('span[name]').attr('name'),
				value: val
			} : db[id][val];
		} else if (typeof value == 'string' && value.indexOf('/') != -1) {
			return db[id][value] || {
				name: this.valToName(id, value),
				value: value
			};
		}
		return db[id][value];
	};

	Common.prototype.linkageAdd = function (id, val) {
		var dl = $('dl[xid="' + id + '"]');
		dl.find('.xm-select-active').removeClass('xm-select-active');
		var vs = val.value.split('/');
		var pid = void 0,
		    li = void 0,
		    index = 0;
		var lis = [];
		do {
			pid = vs[index];
			li = dl.find('.xm-select-linkage-group' + (index + 1) + ' li[xm-value="' + pid + '"]');
			li[0] && lis.push(li);
			index++;
		} while (li.length && pid != undefined);
		if (lis.length == vs.length) {
			$.each(lis, function (idx, item) {
				item.addClass('xm-select-this');
			});
		}
	};

	Common.prototype.linkageDel = function (id, val) {
		var dl = $('dl[xid="' + id + '"]');
		var vs = val.value.split('/');
		var pid = void 0,
		    li = void 0,
		    index = vs.length - 1;
		do {
			pid = vs[index];
			li = dl.find('.xm-select-linkage-group' + (index + 1) + ' li[xm-value="' + pid + '"]');
			if (!li.parent().next().find('li[pid=' + pid + '].xm-select-this').length) {
				li.removeClass('xm-select-this');
			}
			index--;
		} while (li.length && pid != undefined);
	};

	Common.prototype.valToName = function (id, val) {
		var dl = $('dl[xid="' + id + '"]');
		var vs = (val + "").split('/');
		if (!vs.length) {
			return null;
		}
		var names = [];
		$.each(vs, function (idx, item) {
			var name = dl.find('.xm-select-linkage-group' + (idx + 1) + ' li[xm-value="' + item + '"] span').text();
			names.push(name);
		});
		return names.length == vs.length ? names.join('/') : null;
	};

	Common.prototype.commonHandler = function (key, label) {
		if (!label || !label[0]) {
			return;
		}
		this.checkHideSpan(key, label);
		//计算input的提示语
		this.changePlaceHolder(label);
		//计算高度
		this.retop(label.parents('.' + FORM_SELECT));
		this.calcLabelLeft(label, 0, true);
		//表单默认值
		this.setHidnVal(key, label);
		//title值
		label.parents('.' + FORM_TITLE + ' .' + NAME).attr('title', data[key].values.map(function (val) {
			return val.name;
		}).join(','));
	};

	Common.prototype.initVal = function (id) {
		var _this13 = this;

		var target = {};
		if (id) {
			target[id] = data[id];
		} else {
			target = data;
		}
		$.each(target, function (key, val) {
			var values = val.values,
			    div = $('dl[xid="' + key + '"]').parent(),
			    label = div.find('.' + LABEL),
			    dl = div.find('dl');
			dl.find('dd.' + THIS).removeClass(THIS);

			var _vals = values.concat([]);
			_vals.concat([]).forEach(function (item, index) {
				_this13.addLabel(key, label, item);
				dl.find('dd[lay-value="' + item.value + '"]').addClass(THIS);
			});
			if (val.config.radio) {
				_vals.length && values.push(_vals[_vals.length - 1]);
			}
			_this13.commonHandler(key, label);
		});
	};

	Common.prototype.setHidnVal = function (key, label) {
		if (!label || !label[0]) {
			return;
		}
		label.parents('.' + PNAME).find('.' + HIDE_INPUT).val(data[key].values.map(function (val) {
			return val.value;
		}).join(','));
	};

	Common.prototype.handlerLabel = function (id, dd, isAdd, oval, notOn) {
		var div = $('[xid="' + id + '"]').prev().find('.' + LABEL),
		    val = dd && this.getItem(id, dd),
		    vals = data[id].values,
		    on = data[id].config.on || events.on[id],
		    endOn = data[id].config.endOn || events.endOn[id];
		if (oval) {
			val = oval;
		}
		var fs = data[id];
		if (isAdd && fs.config.max && fs.values.length >= fs.config.max) {
			var maxTipsFun = events.maxTips[id] || data[id].config.maxTips;
			maxTipsFun && maxTipsFun(id, vals.concat([]), val, fs.config.max);
			return;
		}
		if (!notOn) {
			if (on && on instanceof Function && on(id, vals.concat([]), val, isAdd, dd && dd.hasClass(DISABLED)) == false) {
				return;
			}
		}
		var dl = $('dl[xid="' + id + '"]');
		isAdd ? (dd && dd[0] ? (dd.addClass(THIS), dd.removeClass(TEMP)) : dl.find('.xm-select-linkage')[0] && this.linkageAdd(id, val), this.addLabel(id, div, val), vals.push(val)) : (dd && dd[0] ? dd.removeClass(THIS) : dl.find('.xm-select-linkage')[0] && this.linkageDel(id, val), this.delLabel(id, div, val), this.remove(vals, val));
		if (!div[0]) return;
		//单选选完后直接关闭选择域
		if (fs.config.radio) {
			this.changeShow(div, false);
		}
		//移除表单验证的红色边框
		div.parents('.' + FORM_TITLE).prev().removeClass('layui-form-danger');

		//清空搜索值
		fs.config.clearInput && this.clearInput(id);

		this.commonHandler(id, div);

		!notOn && endOn && endOn instanceof Function && endOn(id, vals.concat([]), val, isAdd, dd && dd.hasClass(DISABLED));
	};

	Common.prototype.addLabel = function (id, div, val) {
		if (!val) return;
		var tips = 'fsw="' + NAME + '"';
		var _ref = [$('<span ' + tips + ' value="' + val.value + '"><font ' + tips + '>' + val.name + '</font></span>'), $('<i ' + tips + ' class="xm-iconfont icon-close"></i>')],
		    $label = _ref[0],
		    $close = _ref[1];

		$label.append($close);
		//如果是radio模式
		var fs = data[id];
		if (fs.config.radio) {
			fs.values.length = 0;
			$('dl[xid="' + id + '"]').find('dd.' + THIS + ':not([lay-value="' + val.value + '"])').removeClass(THIS);
			div.find('span').remove();
		}
		//如果是固定高度
		div.find('input').css('width', '50px');
		div.find('input').before($label);
	};

	Common.prototype.delLabel = function (id, div, val) {
		if (!val) return;
		div.find('span[value="' + val.value + '"]:first').remove();
	};

	Common.prototype.checkHideSpan = function (id, div) {
		var parentHeight = div.parents('.' + NAME)[0].offsetHeight + 5;
		div.find('span.xm-span-hide').removeClass('xm-span-hide');
		div.find('span[style]').remove();

		var count = data[id].config.showCount;
		div.find('span').each(function (index, item) {
			if (index >= count) {
				$(item).addClass('xm-span-hide');
			}
		});

		var prefix = div.find('span:eq(' + count + ')');
		prefix[0] && prefix.before($('<span style="padding-right: 6px;" fsw="' + NAME + '"> + ' + (div.find('span').length - count) + '</span>'));
	};

	Common.prototype.retop = function (div) {
		//计算dl显示的位置
		var dl = div.find('dl'),
		    top = div.offset().top + div.outerHeight() + 5 - $win.scrollTop(),
		    dlHeight = dl.outerHeight();
		var up = div.hasClass('layui-form-selectup') || dl.css('top').indexOf('-') != -1 || top + dlHeight > $win.height() && top >= dlHeight;
		div = div.find('.' + NAME);

		var fs = data[dl.attr('xid')];
		var base = dl.parents('.layui-form-pane')[0] && dl.prev()[0].clientHeight > 38 ? 14 : 10;
		if (fs && fs.config.direction == 'up' || up) {
			up = true;
			if (fs && fs.config.direction == 'down') {
				up = false;
			}
		}
		var reHeight = div[0].offsetTop + div.height() + base;
		if (up) {
			dl.css({
				top: 'auto',
				bottom: reHeight + 3 + 'px'
			});
		} else {
			dl.css({
				top: reHeight + 'px',
				bottom: 'auto'
			});
		}
	};

	Common.prototype.changeShow = function (children, isShow) {
		//显示于隐藏
		$('.layui-form-selected').removeClass('layui-form-selected');
		var top = children.parents('.' + FORM_SELECT),
		    realShow = top.hasClass(FORM_SELECTED),
		    id = top.find('dl').attr('xid');
		$('.' + PNAME + ' .' + FORM_SELECT).not(top).removeClass(FORM_SELECTED);
		if (isShow) {
			this.retop(top);
			top.addClass(FORM_SELECTED);
			top.find('.' + INPUT).focus();
			if (!top.find('dl dd[lay-value]:not(.' + FORM_SELECT_TIPS + ')').length) {
				top.find('dl .' + FORM_NONE).addClass(FORM_EMPTY);
			}
		} else {
			top.removeClass(FORM_SELECTED);
			this.clearInput(id);
			top.find('dl .' + FORM_EMPTY).removeClass(FORM_EMPTY);
			top.find('dl dd.' + DD_HIDE).removeClass(DD_HIDE);
			top.find('dl dd.' + TEMP).remove();
			//计算ajax数据是否为空, 然后重新请求数据
			if (id && data[id] && data[id].config.isEmpty) {
				this.triggerSearch(top);
			}
			this.changePlaceHolder(top.find('.' + LABEL));
		}
		if (isShow != realShow) {
			var openFun = data[id].config.opened || events.opened[id];
			isShow && openFun && openFun instanceof Function && openFun(id);
			var closeFun = data[id].config.closed || events.closed[id];
			!isShow && closeFun && closeFun instanceof Function && closeFun(id);
		}
	};

	Common.prototype.changePlaceHolder = function (div) {
		//显示于隐藏提示语
		//调整pane模式下的高度
		var title = div.parents('.' + FORM_TITLE);
		title[0] || (title = div.parents('dl').prev());
		if (!title[0]) {
			return;
		}

		var id = div.parents('.' + PNAME).find('dl[xid]').attr('xid');
		if (data[id] && data[id].config.height) {//既然固定高度了, 那就看着办吧

		} else {
			var height = title.find('.' + NAME)[0].clientHeight;
			title.css('height', (height > 36 ? height + 4 : height) + 'px');
			//如果是layui pane模式, 处理label的高度
			var label = title.parents('.' + PNAME).parent().prev();
			if (label.is('.layui-form-label') && title.parents('.layui-form-pane')[0]) {
				height = height > 36 ? height + 4 : height;
				title.css('height', height + 'px');
				label.css({
					height: height + 2 + 'px',
					lineHeight: height - 18 + 'px'
				});
			}
		}

		var input = title.find('.' + TDIV + ' input'),
		    isShow = !div.find('span:last')[0] && !title.find('.' + INPUT).val();
		if (isShow) {
			var ph = input.attr('back');
			input.removeAttr('back');
			input.attr('placeholder', ph);
		} else {
			var _ph = input.attr('placeholder');
			input.removeAttr('placeholder');
			input.attr('back', _ph);
		}
	};

	Common.prototype.indexOf = function (arr, val) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].value == val || arr[i].value == (val ? val.value : val) || arr[i] == val || JSON.stringify(arr[i]) == JSON.stringify(val)) {
				return i;
			}
		}
		return -1;
	};

	Common.prototype.remove = function (arr, val) {
		var idx = this.indexOf(arr, val ? val.value : val);
		if (idx > -1) {
			arr.splice(idx, 1);
			return true;
		}
		return false;
	};

	Common.prototype.selectAll = function (id, isOn, skipDis) {
		var _this14 = this;

		var dl = $('[xid="' + id + '"]');
		if (!dl[0]) {
			return;
		}
		if (dl.find('.xm-select-linkage')[0]) {
			return;
		}
		dl.find('dd[lay-value]:not(.' + FORM_SELECT_TIPS + '):not(.' + THIS + ')' + (skipDis ? ':not(.' + DISABLED + ')' : '')).each(function (index, item) {
			item = $(item);
			var val = _this14.getItem(id, item);
			_this14.handlerLabel(id, dl.find('dd[lay-value="' + val.value + '"]'), true, val, !isOn);
		});
	};

	Common.prototype.removeAll = function (id, isOn, skipDis) {
		var _this15 = this;

		var dl = $('[xid="' + id + '"]');
		if (!dl[0]) {
			return;
		}
		if (dl.find('.xm-select-linkage')[0]) {
			//针对多级联动的处理
			data[id].values.concat([]).forEach(function (item, idx) {
				var vs = item.value.split('/');
				var pid = void 0,
				    li = void 0,
				    index = 0;
				do {
					pid = vs[index++];
					li = dl.find('.xm-select-linkage-group' + index + ':not(.xm-select-linkage-hide) li[xm-value="' + pid + '"]');
					li.click();
				} while (li.length && pid != undefined);
			});
			return;
		}
		data[id].values.concat([]).forEach(function (item, index) {
			if (skipDis && dl.find('dd[lay-value="' + item.value + '"]').hasClass(DISABLED)) {} else {
				_this15.handlerLabel(id, dl.find('dd[lay-value="' + item.value + '"]'), false, item, !isOn);
			}
		});
	};

	Common.prototype.reverse = function (id, isOn, skipDis) {
		var _this16 = this;

		var dl = $('[xid="' + id + '"]');
		if (!dl[0]) {
			return;
		}
		if (dl.find('.xm-select-linkage')[0]) {
			return;
		}
		dl.find('dd[lay-value]:not(.' + FORM_SELECT_TIPS + ')' + (skipDis ? ':not(.' + DISABLED + ')' : '')).each(function (index, item) {
			item = $(item);
			var val = _this16.getItem(id, item);
			_this16.handlerLabel(id, dl.find('dd[lay-value="' + val.value + '"]'), !item.hasClass(THIS), val, !isOn);
		});
	};

	Common.prototype.skin = function (id) {
		var skins = ['default', 'primary', 'normal', 'warm', 'danger'];
		var skin = skins[Math.floor(Math.random() * skins.length)];
		$('dl[xid="' + id + '"]').parents('.' + PNAME).find('.' + FORM_SELECT).attr('xm-select-skin', skin);
		this.check(id) && this.commonHandler(id, $('dl[xid="' + id + '"]').parents('.' + PNAME).find('.' + LABEL));
	};

	Common.prototype.getPosition = function (e) {
		var x = 0,
		    y = 0;
		while (e != null) {
			x += e.offsetLeft;
			y += e.offsetTop;
			e = e.offsetParent;
		}
		return { x: x, y: y };
	};

	Common.prototype.onreset = function () {
		//监听reset按钮, 然后重置多选
		$(document).on('click', '[type=reset]', function (e) {
			$(e.target).parents('form').find('.' + PNAME + ' dl[xid]').each(function (index, item) {
				var id = item.getAttribute('xid'),
				    dl = $(item),
				    dd = void 0,
				    temp = {};
				common.removeAll(id);
				data[id].config.init.forEach(function (val, idx) {
					if (val && (!temp[val] || data[id].config.repeat) && (dd = dl.find('dd[lay-value="' + val.value + '"]'))[0]) {
						common.handlerLabel(id, dd, true);
						temp[val] = 1;
					}
				});
			});
		});
	};

	Common.prototype.bindEvent = function (name, id, fun) {
		if (id && id instanceof Function) {
			fun = id;
			id = null;
		}
		if (fun && fun instanceof Function) {
			if (!id) {
				$.each(data, function (id, val) {
					data[id] ? data[id].config[name] = fun : events[name][id] = fun;
				});
			} else {
				data[id] ? (data[id].config[name] = fun, delete events[name][id]) : events[name][id] = fun;
			}
		}
	};

	Common.prototype.check = function (id, notAutoRender) {
		if ($('dl[xid="' + id + '"]').length) {
			return true;
		} else if ($('select[xm-select="' + id + '"]').length) {
			if (!notAutoRender) {
				this.render(id, $('select[xm-select="' + id + '"]'));
				return true;
			}
		} else {
			delete data[id];
			return false;
		}
	};

	Common.prototype.render = function (id, select) {
		common.init(select);
		common.one($('dl[xid="' + id + '"]').parents('.' + PNAME));
		common.initVal(id);
	};

	Common.prototype.log = function (obj) {
		console.log(obj);
	};

	var Select4 = function Select4() {
		this.v = v;
		this.render();
	};
	var common = new Common();

	Select4.prototype.value = function (id, type, isAppend) {
		if (typeof id != 'string') {
			return [];
		}
		var fs = data[id];
		if (!common.check(id)) {
			return [];
		}
		if (typeof type == 'string' || type == undefined) {
			var arr = fs.values.concat([]) || [];
			if (type == 'val') {
				return arr.map(function (val) {
					return val.value;
				});
			}
			if (type == 'valStr') {
				return arr.map(function (val) {
					return val.value;
				}).join(',');
			}
			if (type == 'name') {
				return arr.map(function (val) {
					return val.name;
				});
			}
			if (type == 'nameStr') {
				return arr.map(function (val) {
					return val.name;
				}).join(',');
			}
			return arr;
		}
		if (common.isArray(type)) {
			var dl = $('[xid="' + id + '"]'),
			    temp = {},
			    dd = void 0,
			    isAdd = true;
			if (isAppend == false) {
				//删除传入的数组
				isAdd = false;
			} else if (isAppend == true) {
				//追加模式
				isAdd = true;
			} else {
				//删除原有的数据
				common.removeAll(id);
			}
			if (isAdd) {
				fs.values.forEach(function (val, index) {
					temp[val.value] = 1;
				});
			}
			type.forEach(function (val, index) {
				if (val && (!temp[val] || fs.config.repeat)) {
					if ((dd = dl.find('dd[lay-value="' + val + '"]'))[0]) {
						common.handlerLabel(id, dd, isAdd, null, true);
						temp[val] = 1;
					} else {
						var name = common.valToName(id, val);
						if (name) {
							common.handlerLabel(id, dd, isAdd, common.getItem(id, val), true);
							temp[val] = 1;
						}
					}
				}
			});
		}
	};

	Select4.prototype.on = function (id, fun, isEnd) {
		common.bindEvent(isEnd ? 'endOn' : 'on', id, fun);
		return this;
	};

	Select4.prototype.filter = function (id, fun) {
		common.bindEvent('filter', id, fun);
		return this;
	};

	Select4.prototype.maxTips = function (id, fun) {
		common.bindEvent('maxTips', id, fun);
		return this;
	};

	Select4.prototype.opened = function (id, fun) {
		common.bindEvent('opened', id, fun);
		return this;
	};

	Select4.prototype.closed = function (id, fun) {
		common.bindEvent('closed', id, fun);
		return this;
	};

	Select4.prototype.config = function (id, config, isJson) {
		if (id && (typeof id === 'undefined' ? 'undefined' : _typeof(id)) == 'object') {
			isJson = config == true;
			config = id;
			id = null;
		}
		if (config && (typeof config === 'undefined' ? 'undefined' : _typeof(config)) == 'object') {
			if (isJson) {
				config.header || (config.header = {});
				config.header['Content-Type'] = 'application/json; charset=UTF-8';
				config.dataType = 'json';
			}
			id ? (ajaxs[id] = $.extend(true, {}, ajaxs[id] || ajax, config), !common.check(id) && this.render(id), data[id] && config.direction && (data[id].config.direction = config.direction), data[id] && config.clearInput && (data[id].config.clearInput = true), config.searchUrl && data[id] && common.triggerSearch($('.' + PNAME + ' dl[xid="' + id + '"]').parents('.' + FORM_SELECT), true)) : ($.extend(true, ajax, config), $.each(ajaxs, function (key, item) {
				$.extend(true, item, config);
			}));
		}
		return this;
	};

	Select4.prototype.render = function (id, options) {
		var _ref2;

		if (id && (typeof id === 'undefined' ? 'undefined' : _typeof(id)) == 'object') {
			options = id;
			id = null;
		}
		var config = options ? (_ref2 = {
			init: options.init,
			disabled: options.disabled,
			max: options.max,
			isSearch: options.isSearch,
			searchUrl: options.searchUrl,
			isCreate: options.isCreate,
			radio: options.radio,
			skin: options.skin,
			direction: options.direction,
			height: options.height,
			formname: options.formname,
			layverify: options.layverify,
			layverType: options.layverType,
			showCount: options.showCount,
			placeholder: options.placeholder,
			create: options.create,
			filter: options.filter,
			maxTips: options.maxTips,
			on: options.on
		}, _defineProperty(_ref2, 'on', options.on), _defineProperty(_ref2, 'opened', options.opened), _defineProperty(_ref2, 'closed', options.closed), _defineProperty(_ref2, 'template', options.template), _defineProperty(_ref2, 'clearInput', options.clearInput), _ref2) : {};

		options && options.searchType != undefined && (config.searchType = options.searchType == 'dl' ? 1 : 0);

		if (id) {
			fsConfigs[id] = {};
			$.extend(fsConfigs[id], data[id] ? data[id].config : {}, config);
		} else {
			$.extend(fsConfig, config);
		}

		($('select[' + NAME + '="' + id + '"]')[0] ? $('select[' + NAME + '="' + id + '"]') : $('select[' + NAME + ']')).each(function (index, select) {
			var sid = select.getAttribute(NAME);
			common.render(sid, select);
			setTimeout(function () {
				return common.setHidnVal(sid, $('select[xm-select="' + sid + '"] + div.' + PNAME + ' .' + LABEL));
			}, 10);
		});
		return this;
	};

	Select4.prototype.disabled = function (id) {
		var target = {};
		id ? common.check(id) && (target[id] = data[id]) : target = data;

		$.each(target, function (key, val) {
			$('dl[xid="' + key + '"]').prev().addClass(DIS);
		});
		return this;
	};

	Select4.prototype.undisabled = function (id) {
		var target = {};
		id ? common.check(id) && (target[id] = data[id]) : target = data;

		$.each(target, function (key, val) {
			$('dl[xid="' + key + '"]').prev().removeClass(DIS);
		});
		return this;
	};

	Select4.prototype.data = function (id, type, config) {
		if (!id || !type || !config) {
			common.log('id: ' + id + ' param error !!!');
			return this;
		}
		if (!common.check(id)) {
			common.log('id: ' + id + ' not render !!!');
			return this;
		}
		this.value(id, []);
		this.config(id, config);
		if (type == 'local') {
			common.renderData(id, config.arr, config.linkage == true, config.linkageWidth ? config.linkageWidth : '100');
		} else if (type == 'server') {
			common.ajax(id, config.url, config.keyword, config.linkage == true, config.linkageWidth ? config.linkageWidth : '100');
		}
		return this;
	};

	Select4.prototype.btns = function (id, btns, config) {
		if (id && common.isArray(id)) {
			btns = id;
			id = null;
		}
		if (!btns || !common.isArray(btns)) {
			return this;
		};
		var target = {};
		id ? common.check(id) && (target[id] = data[id]) : target = data;

		btns = btns.map(function (obj) {
			if (typeof obj == 'string') {
				if (obj == 'select') {
					return quickBtns[0];
				}
				if (obj == 'remove') {
					return quickBtns[1];
				}
				if (obj == 'reverse') {
					return quickBtns[2];
				}
				if (obj == 'skin') {
					return quickBtns[3];
				}
			}
			return obj;
		});

		$.each(target, function (key, val) {
			val.config.btns = btns;
			var dd = $('dl[xid="' + key + '"]').find('.' + FORM_SELECT_TIPS + ':first');
			if (btns.length) {
				var show = config && config.show && (config.show == 'name' || config.show == 'icon') ? config.show : '';
				var html = common.renderBtns(key, show, config && config.space ? config.space : '30px');
				dd.html(html);
			} else {
				var pcInput = dd.parents('.' + FORM_SELECT).find('.' + TDIV + ' input');
				var _html = pcInput.attr('placeholder') || pcInput.attr('back');
				dd.html(_html);
				dd.removeAttr('style');
			}
		});

		return this;
	};

	Select4.prototype.search = function (id, val) {
		if (id && common.check(id)) {
			ajaxs[id] = $.extend(true, {}, ajaxs[id] || ajax, {
				first: true,
				searchVal: val
			});
			common.triggerSearch($('dl[xid="' + id + '"]').parents('.' + FORM_SELECT), true);
		}
		return this;
	};

	Select4.prototype.replace = function (id, type, config) {
		var _this17 = this;

		if (!id || !type || !config) {
			common.log('id: ' + id + ' param error !!!');
			return this;
		}
		if (!common.check(id, true)) {
			common.log('id: ' + id + ' not render !!!');
			return this;
		}
		var oldVals = this.value(id, 'val');
		this.value(id, []);
		this.config(id, config);
		if (type == 'local') {
			common.renderData(id, config.arr, config.linkage == true, config.linkageWidth ? config.linkageWidth : '100', false, true);
			this.value(id, oldVals, true);
		} else if (type == 'server') {
			common.ajax(id, config.url, config.keyword, config.linkage == true, config.linkageWidth ? config.linkageWidth : '100', false, function (id) {
				_this17.value(id, oldVals, true);
			}, true);
		}
	};

	return new Select4();
});