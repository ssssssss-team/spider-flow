function LogViewer(options){
    options = options || {};
    this.element = options.element;
    this.maxLines = options.maxLines || 10;
    this.onSearchFinish = options.onSearchFinish || function(){};
    this.bufferSize = this.maxLines * 10;
    this.logId = options.logId;
    this.taskId = options.taskId;
    this.url = options.url;
    this.buffer = [];
    this.displayIndex = -1;
    this.index = -1;
    this.loading = false;
    this.reversed = true;
    this.matchcase = true;
    this.initEvent();
    this.init(options.onLoad);
}
LogViewer.prototype.init = function(callback){
    var _this = this;
    _this.index = -1;
    this.autoLoad(callback);
}
LogViewer.prototype.autoLoad = function(callback){
    var _this = this;
    this.loadLines(this.maxLines,function(hasData){
        if(_this.reversed){
            _this.displayIndex = _this.buffer.length - _this.maxLines;
        }else{
            _this.displayIndex = 0;
        }
        _this.render(_this.buffer.slice(_this.displayIndex,_this.displayIndex + _this.maxLines));
        callback&&callback(hasData);
    },false);
}
LogViewer.prototype.render = function(lines){
    if(lines.length == 0){
        return;
    }
    this.firstFrom = lines[0].from;
    this.firstTo = lines[0].to;
    this.lastFrom = lines[lines.length - 1].from;
    this.lastTo = lines[lines.length - 1].to;
    var html = [];
    if(this.reversed){
        lines = lines.reverse();
    }
    var find = this.keywords === undefined || this.keywords === '';
    var regx = new RegExp('(' + this.keywords + ')',this.matchcase ? "ig" : "g");
    for (var i = 0; i < lines.length; i++) {
        var text = lines[i].text;
        if(find == false && (find = text.match(regx))){
            text = text.replace(regx,'b4430885ba83495_$1_88d1220d37eac831d');
        }
        //转义html
        text = text.replace(/</g,'&lt;');
        //搜索关键词高亮
        text = text.replace(/b4430885ba83495_(.*?)_88d1220d37eac831d/g,'<em class="search-finded">$1</em>');
        html.push('<div class="log-row">' + text + '</div>');
    }
    if(this.reversed){
        html = html.reverse();
    }
    this.element.html(html.join(''));
}
LogViewer.prototype.search = function(reversed){
    if(reversed === undefined){
        reversed = this.reversed;
    }
    this.index = reversed ? this.lastFrom : this.firstTo;
    var _this = this;
    this.autoLoad(function(hasData){
        _this.onSearchFinish(hasData);
    });
}
LogViewer.prototype.initEvent = function(){
    var _this = this;
    function eventFunc(e){
        e.stopPropagation();
        _this.scroll((e.wheelDelta||e.detail) > 0,3);
        return false;
    }
    document.addEventListener('DOMMouseScroll',eventFunc,false);
    window.onmousewheel = document.onmousewheel = eventFunc;
    document.addEventListener('keydown', function (e) {
        e = e || event;
        var currKey = e.keyCode || e.which || e.charCode;
        if (currKey === 38 || currKey === 40) {
            if(_this.keywords){
                _this.search(currKey === 38);
            }else{
                _this.scroll(currKey === 38, 1);
            }
        }
        if (currKey === 33 || currKey === 34) {
            _this.scroll(currKey === 33, _this.maxLines);
        }
        if (currKey === 36 || currKey ===35){
            _this.reversed = currKey === 35;
           _this.init();
        }
    });
}
LogViewer.prototype.setOptions = function(key,value){
    var _this = this;
    _this[key] = value;
}
LogViewer.prototype.scroll = function(reversed,count){
    var _this = this;
    _this.reversed = reversed;
    var ignore = false;
    if(reversed){
        if(this.displayIndex == 0){
            this.index = this.buffer[0].from;
            this.loadLines(this.bufferSize,function(hasData){
                if(hasData){
                    _this.displayIndex = Math.max(_this.buffer.length - _this.maxLines,0);
                }
            },false);
        }else{
            _this.displayIndex-=count;
        }
    }else{
        if(this.displayIndex + this.maxLines >= this.buffer.length){
            this.index = this.buffer[this.buffer.length - 1].to;
            this.loadLines(this.bufferSize,function(hasData){
                if(hasData){
                    _this.displayIndex = 0;
                }
            },false);
        }else{
            _this.displayIndex+=count;
        }
    }
    this.render(this.buffer.slice(this.displayIndex,this.displayIndex + this.maxLines));

}
LogViewer.prototype.loadLines = function(count,callback,async){
    if(this.loading){
        return;
    }
    this.loading = true;
    var _this = this;
    $.ajax({
        url : this.url,
        async : async,
        type : 'post',
        data : {
            reversed : this.reversed,
            count : this.bufferSize,
            id : this.logId,
            taskId: this.taskId,
            index : _this.index,
            keywords : this.keywords,
            matchcase : this.matchcase,
            regx : this.regx
        },
        dataType : 'json',
        success : function(json){
            var hasData = json&&json.data&&json.data.length > 0;
            if(hasData){
                _this.buffer = json.data;
            }
            callback && callback(hasData);
            _this.loading = false;
        }
    })
}
