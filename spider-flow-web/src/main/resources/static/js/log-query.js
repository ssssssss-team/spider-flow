var LogInquirer = function () {
    var _ = {handler : -1};
    var _this = this;
    _.extend = function() {
        let length = arguments.length;
        let target = arguments[0] || {};
        if (typeof target != "object" && typeof target != "function") {
            target = {};
        }
        if (length === 1) {
            target = this;
            i--;
        }
        for (let i = 1; i < length; i++) {
            let source = arguments[i];
            for (let key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    _.ajax = function (method, url, data, success, error, then) {
        var _fun;
        var obj = {then:function(fun){
                _fun = fun;
            }};
        var xhr;
        if(window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");//IE高版本创建XMLHTTP
            }
            catch (E) {
                try {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");//IE低版本创建XMLHTTP
                }
                catch (E) {
                }
            }
        }
        if(method === 'GET' && data) {
            if (typeof data === 'object') {
                try {
                    data = parse2GettingUrl(data);
                }catch (e) {}
            }
            url = url + '?' + data;
        }
        xhr.open(method, url, true);
        if(method === 'GET') {
            xhr.send(null);
        } else {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(data);
        }
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {//响应过程状态信息，4代表发送完成，顺利返回信息
                if(xhr.status === 200) {//status:状态码，如果返回的信息是200
                    var result = xhr.responseText;
                    if (typeof result === 'string') {
                        try {
                            result = JSON.parse(result);
                        }catch (e) {}
                    }
                    success && success(result);
                    _fun && _fun(result);
                } else {
                    error && error(xhr.status, xhr.responseText);//发生错误时，返回该状态码
                }
            }
        }
        return obj;
    };
    this.init = function (logId, url, bufferSize, domObject) {
        _.logId = logId;
        _.url = url;
        _.domObject = domObject;
        _.index = 0;
        addEvent();
        if (bufferSize < _.rowCount) {
            bufferSize = _.rowCount;
        }
        _.bufferSize = bufferSize;
        _.dataBuffer = [];
        let div = document.createElement('div');
        div.setAttribute('class', 'log-row');
        div.setAttribute('style', 'filter: opacity(0);opacity:0;position:absolute;');
        div.setAttribute('id', 'test-for-row-test');
        document.body.appendChild(div);
        _.rowHeight = div.offsetHeight;
        div.remove();
        this.resize();
        queryPage().then(function (d) {
            _this.render(_.dataBuffer.slice(0, _.rowCount).reverse());
        });
        return this;
    };
    this.resize = function () {
        _.rowCount = parseInt(String(_.domObject.offsetHeight / _.rowHeight));
        return this;
    };

    this.render = function (list) {
        _.domObject.innerHTML = '';
        for(var i =0;i<list.length;i++){
            var div = document.createElement('div');
            div.setAttribute('class', 'log-row');
            div.innerHTML = list[i].replace(/</g,'&lt;');
            _.domObject.appendChild(div);
        }
    };
    this.scroll = function (desc, lines) {
        var n = lines||3;
        if (desc) {
            if (_.rowCount + _.index + n >= _.dataBuffer.length) {
                n = _.dataBuffer.length - _.rowCount - _.index;
                debugger
            }
            this.render(_.dataBuffer.slice(_.index + n, _.rowCount + _.index + n).reverse());
            _.index += n;
        } else {
            if (_.index - n <= 0) {
                n = _.index;
            }
            this.render(_.dataBuffer.slice(_.index - n, _.rowCount + _.index - n).reverse());
            _.index -= n;
        }
    };
    function queryPage(keyword) {
        return {then:_.ajax('GET', _.url, {
            id : _.logId,
            index : _.handler,
            count : _.bufferSize,
            keyword : keyword
        }, function(json){
            if(json.code === 1){
                var lines = json.data.lines;
                _.handler = json.data.index;
                _.dataBuffer = lines.reverse();
            }else{
                layui.layer.msg(json.message);
            }
            isLoad = false;
        }, function () {

        }).then};
    }
    function addEvent() {
        document.addEventListener('DOMMouseScroll',eventFunc,false);
        window.onmousewheel=document.onmousewheel=eventFunc;
        function eventFunc(e){
            e.stopPropagation();
            _this.scroll((e.wheelDelta||e.detail) > 0);
            return false;
        }
        document.addEventListener('keydown', function (e) {
            e = e || event;
            var currKey = e.keyCode || e.which || e.charCode;
            if (currKey === 38 || currKey === 40) {
                _this.scroll(currKey === 38, 1);
            }
            if (currKey === 33 || currKey === 34) {
                _this.scroll(currKey === 33, _.rowCount);
            }
        });
    }
    function parse2GettingUrl(obj) {
        var s = '';
        for (var x in obj) {
            if (obj.hasOwnProperty(x) && obj[x] != undefined) {
                s += encodeURIComponent(x) + '=' + encodeURIComponent(obj[x]) + '&';
            }
        }
        if (s.endsWith('&')) {
            s = s.substring(0, s.length - 1);
        }
        return s;
    }
};