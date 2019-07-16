/**
 @Name：treeGrid树状表格
 @Author：beijiyi
 @version: 0.1
 码云地址：https://gitee.com/beijiyi/tree_table_treegrid_based_on_layui
 在线demo：http://beijiyi.com/
 */
layui.define(['laytpl', 'laypage', 'layer', 'form'], function(exports){
    "use strict";
    var $ = layui.$
        ,laytpl = layui.laytpl
        ,laypage = layui.laypage
        ,layer = layui.layer
        ,form = layui.form
        ,hint = layui.hint()
        ,device = layui.device()
        //外部接口
        ,table = {
            config: {//全局配置项,表格级别
                indexName: 'lay_table_index' //下标索引名
                ,cols:{//节点级别的附加字段
                    isCheckName: 'lay_is_checked' //选中状态（true，false）
                    ,isRadio:'lay_is_radio'//单选状态（true，false）
                    ,isOpen:'lay_is_open'//是否展开节点
                    ,isShow:'lay_is_show'//是否显示节点
                    ,level:'lay_level'//节点的层级关系（不需要设置）
                    ,children:'children'//存放下级的变量

                    ,cheDisabled:'lay_che_disabled'//禁止多选（true，false）
                    ,radDisabled:'lay_rad_disabled'//禁止单选（true，false）

                    ,iconOpen:'lay_icon_open'//打开的图标
                    ,iconClose:'lay_icon_close'//关闭的图标
                    ,icon:'lay_icon'//叶子节点图标
                }
                ,initWidth:{//默认列宽度定义
                    checkbox: 48
                    ,space: 15
                    ,numbers: 40
                    ,radio:48
                }
            }
            /**
             * 缓存数据
             *
             * 结构图示
             * cache{}                  缓存（对象）
             *      key['data']{}       全部数据缓存（对象）
             *          key[list][]     列表数据对象（数组）
             *          key[map]{}      列表数据Map对象（Map）
             *          key[treeList][] 树状结构的对象（数组）
             *      key['cla']{}        全部已初始化过的Calss对象类（注意渲染是异步执行）
             *          key['claIds'][] 全部已经吊用过初始化方法的表格类
             *          key[claObjs]{key[tableId]}  全部已经初始化好的cla对象
             *
             */
            ,cache: {
                tableId:{
                    data:{
                        list:[]//列表数据
                        ,map:{}//列表数据以idField或唯一值作为key的Map数据
                        ,treeList:[]//树状数据
                        ,upIds:[]//父节点集合  在一次外部请求前严格按照第一次的顺序
                    }
                }
                ,cla:{
                    claIds:{
                        tableId:true
                    }
                    ,claObjs:{
                        tableId:{}
                    }
                }
                ,selectcode:{//数据字典缓存
                    demokey:[
                        {
                            key:{value:''}
                        }
                    ]
                }
            }
            ,index: layui.table ? (layui.table.index + 10000) : 0
            /**
             * 设置全局项
             * @param options
             * @return {table}
             */
            ,set: function(options){
                var that = this;
                that.config = $.extend({}, that.config, options);
                return that;
            }
            /**
             * 事件监听
             * @param events
             * @param callback
             * @return {*}
             */
            ,on: function(events, callback){
                return layui.onevent.call(this, MOD_NAME, events, callback);
            }
            ,getClass:function (tableId) {
                return table.cache.cla.claObjs[tableId];;
            }
            ,pushClass:function (tableId,that) {
                table.cache.cla.claObjs[tableId]=that;
            }
            ,isCalss:function (tableId) {
                var ids=this.cache.cla.claIds||{};
                return  ids.hasOwnProperty(tableId)||false;
            }
            ,isClassYes:function (tableId) {
                var ids=this.cache.cla.claIds||{};
                return ids[tableId]||false;
            }
            ,pushClassIds:function (tableId,is) {
                this.cache.cla.claIds[tableId]=is;
            }
            ,setObj:function (tableId,key,o) {
                if(!this.obj[tableId])this.obj[tableId]={};
                this.obj[tableId][key]=o;
            }
            ,getObj:function (tableId, key) {
                return this.obj[tableId]?this.obj[tableId][key]:null;
            }
            /**
             * 获取列表数据
             */
            ,getDataList:function (tableId) {
                if(table.cache[tableId]){
                    return table.cache[tableId].data.list;
                }
                return [];
            }
            /**
             * 设置列表数据
             */
            ,setDataList:function (tableId, list) {
                if(!table.cache[tableId])table.cache[tableId]={};
                if(!table.cache[tableId].data)table.cache[tableId].data={};
                if(!table.cache[tableId].data.list)table.cache[tableId].data.list=[];
                table.cache[tableId].data.list=list;
            }
            /**
             * 获取列表数据
             */
            ,getDataMap:function (tableId) {
                if(table.cache[tableId]){
                    return table.cache[tableId].data.map;
                }
                return {};
            }
            /**
             * 设置列表数据
             */
            ,setDataMap:function (tableId, map) {
                if(!table.cache[tableId])table.cache[tableId]={};
                if(!table.cache[tableId].data)table.cache[tableId].data={};
                if(!table.cache[tableId].data.map)table.cache[tableId].data.map={};
                table.cache[tableId].data.map=map;
            }
            /**
             * 获取树状数据
             */
            ,getDataTreeList:function (tableId) {
                if(table.cache[tableId]){
                    return table.cache[tableId].data.treeList;
                }
                return [];
            }
            /**
             * 设置树状数据
             */
            ,setDataTreeList:function (tableId, treeList) {
                if(!table.cache[tableId])table.cache[tableId]={};
                if(!table.cache[tableId].data)table.cache[tableId].data={};
                if(!table.cache[tableId].data.treeList)table.cache[tableId].data.treeList={};
                table.cache[tableId].data.treeList=treeList;
            }
            /**
             * 获取根节点数据
             */
            ,getDataRootList:function (tableId) {
                if(table.cache[tableId]){
                    return table.cache[tableId].data.upIds||[];
                }
                return [];
            }
            /**
             * 设置根节点数据
             */
            ,setDataRootList:function (tableId, rootList) {
                if(!table.cache[tableId])table.cache[tableId]={};
                if(!table.cache[tableId].data)table.cache[tableId].data={};
                if(!table.cache[tableId].data.upIds)table.cache[tableId].data.upIds=[];
                table.cache[tableId].data.upIds=rootList;
            }
            /**
             * 初始化
             * @param filter
             * @param settings
             * @return {table}
             */
            ,init:function (filter, settings) {
                settings = settings || {};
                var that = this
                    ,elemTable = filter ? $('table[lay-filter="'+ filter +'"]') : $(ELEM + '[lay-data]')
                    ,errorTips = 'Table element property lay-data configuration item has a syntax error: ';
                //遍历数据表格
                elemTable.each(function(){
                    var othis = $(this), tableData = othis.attr('lay-data');
                    try{
                        tableData = new Function('return '+ tableData)();
                    } catch(e){
                        hint.error(errorTips + tableData)
                    }
                    var cols = [], options = $.extend({
                        elem: this
                        ,cols: []
                        ,data: []
                        ,skin: othis.attr('lay-skin') //风格
                        ,size: othis.attr('lay-size') //尺寸
                        ,even: typeof othis.attr('lay-even') === 'string' //偶数行背景
                    }, table.config, settings, tableData);

                    filter && othis.hide();

                    //获取表头数据
                    othis.find('thead>tr').each(function(i){
                        options.cols[i] = [];
                        $(this).children().each(function(ii){
                            var th = $(this), itemData = th.attr('lay-data');

                            try{
                                itemData = new Function('return '+ itemData)();
                            } catch(e){
                                return hint.error(errorTips + itemData)
                            }

                            var row = $.extend({
                                title: th.text()
                                ,colspan: th.attr('colspan') || 0 //列单元格
                                ,rowspan: th.attr('rowspan') || 0 //行单元格
                            }, itemData);

                            if(row.colspan < 2) cols.push(row);
                            options.cols[i].push(row);
                        });
                    });

                    //获取表体数据
                    othis.find('tbody>tr').each(function(i1){
                        var tr = $(this), row = {};
                        //如果定义了字段名
                        tr.children('td').each(function(i2, item2){
                            var td = $(this)
                                ,field = td.data('field');
                            if(field){
                                return row[field] = td.html();
                            }
                        });
                        //如果未定义字段名
                        layui.each(cols, function(i3, item3){
                            var td = tr.children('td').eq(i3);
                            row[item3.field] = td.html();
                        });
                        options.data[i1] = row;
                    });
                    table.render(options);
                });

                return that;
            }
            /**
             * 渲染入口方法（核心入口）
             */
            ,render:function (options) {
                table.pushClassIds(options.id);
                var inst = new Class(options);
                return thisTable.call(inst);
            }
            /**
             * 对应的表格加载完成后执行(方法已弃用，请使用parseData代替)
             * @param tableId
             * @param fn
             */
            ,ready:function (tableId,fn) {
                var is=false;
                var myDate=new Date();
                function isReady() {
                    if(tableId){
                        var that=table.getClass(tableId);
                        if(that&&that.hasOwnProperty('layBody')){
                            fn(that);
                            is=true;
                        }else{
                            var myDate2=new Date();
                            var i=myDate2.getTime()-myDate.getTime();
                            if(i<=(1000*10)&&!is){//大于10秒退出
                                setTimeout(isReady,50);
                            }
                        }
                    }
                }
                if(tableId&&fn){
                    setTimeout(isReady,50);
                }
            }
            /**
             * 获取表格选中记录
             * @param tableId
             * @return {{data: Array, isAll: boolean}}
             */
            ,checkStatus:function (tableId) {
                var nums = 0
                    ,invalidNum = 0
                    ,arr = []
                    ,data = table.getDataList(tableId) || [];
                //计算全选个数
                layui.each(data, function(i, item){
                    if(item.constructor === Array){
                        invalidNum++; //无效数据，或已删除的
                        return;
                    }
                    if(item[table.config.cols.isCheckName]){
                        nums++;
                        arr.push(table.clearCacheKey(item));
                    }
                });
                return {
                    data: arr //选中的数据
                    ,isAll: data.length ? (nums === (data.length - invalidNum)) : false //是否全选
                };
            }
            /**
             * 设置表格复选状态
             * @param tableId
             * @param value     此值存在时为设置操作
             * @returns {*}
             */
            ,setCheckStatus:function(tableId, fildName, ids){
                var retObj=null;
                var that=table.getClass(tableId)
                    ,invalidNum = 0
                    ,arr = []
                    ,data = table.getDataList(tableId) || []
                    ,childs = that.layBody.find('input[name="'+TABLE_CHECKBOX_ID+'"]')//复选框
                ;
                if(fildName&&ids){//设置选中
                    var idsarr=ids.split(',');
                    idsarr.forEach(function (o) {
                        var temo=null;
                        data.forEach(function (e) {
                            var b1=e[fildName]+"";
                            var b2=o+"";
                            if(b1==b2){
                                temo=e;
                                return;
                            };
                        });
                        if(temo){
                            var v=temo[table.config.indexName];
                            that.layBody.find('input[name="'+TABLE_CHECKBOX_ID+'"][value="'+v+'"]').prop("checked",true);
                            that.setCheckData(v, true);
                        }
                    });
                    that.syncCheckAll();
                    that.renderForm('checkbox');
                }
                return retObj;
            }
            /**
             * 表格单选状态
             * @param tableId
             * @param value     此值存在时为设置操作
             * @returns {*}
             */
            ,radioStatus:function (tableId) {
                var that=table.getClass(tableId);
                var retObj=null;
                var nums = 0
                    ,invalidNum = 0
                    ,arr = []
                    ,data = table.getDataList(tableId) || [];
                var v=that.layBody.find("input[name='"+TABLE_RADIO_ID+"']:checked").val();
                v=parseInt(v);
                data.forEach(function (e) {
                    if(e[table.config.indexName]==v){
                        retObj=e;
                    };
                });
                return table.clearCacheKey(retObj);
            }
            /**
             * 设置表格单选状态
             * @param tableId
             * @param value     此值存在时为设置操作
             * @returns {*}
             */
            ,setRadioStatus:function (tableId,fildName,value) {
                var that=table.getClass(tableId);
                var retObj=null;
                var nums = 0
                    ,invalidNum = 0
                    ,arr = []
                    ,data = table.getDataList(tableId) || [];

                if(fildName&&value){//设置选中
                    data.forEach(function (e) {
                        var b1=e[fildName]+"";
                        var b2=value+"";
                        if(b1==b2){
                            retObj=e;
                            return;
                        };
                    });

                    if(retObj){
                        var v=retObj[table.config.indexName];
                        that.layBody.find("input:radio[name='"+TABLE_RADIO_ID+"'][value='"+v+"']").prop("checked",true);
                        form.render('radio');
                    }
                }
                return retObj;
            }
            /**
             * 清除临时Key
             * @param data
             * @return {*}
             */
            ,clearCacheKey:function (data) {
                data = $.extend({}, data);
                delete data[table.config.cols.isCheckName];
                delete data[table.config.indexName];
                return data;
            }
            /**
             * 刷新数据
             * @param id
             * @param options
             * @return {*}
             */
            ,query:function (tableId, options) {
                var that= table.getClass(tableId);
                that.renderTdCss();
                if(that.config.data && that.config.data.constructor === Array) delete that.config.data;
                that.config = $.extend({}, that.config, options);
                that.pullData(that.page, that.loading());
            }
            /**
             * 此方法为整体重新渲染（重量级刷新方法）
             * @param id
             * @param options
             */
            ,reload:function (tableId, options) {
                var config = thisTable.config[tableId];
                options = options || {};
                if(!config) return hint.error('The ID option was not found in the table instance');
                if(options.data && options.data.constructor === Array) delete config.data;
                return table.render($.extend(true, {}, config, options));
            }
            /**
             * 添加一行或多行数据
             * @param tableId   表格id
             * @param index     在第几个位置插入（从0开始）
             * @param data      数据
             * @returns {*}
             */
            ,addRow:function (tableId, index, data) {
                var that=table.getClass(tableId)
                    ,options=that.config
                    ,uo = []//父级节点
                    ,treeList=table.getDataTreeList(tableId)
                    ,list = table.getDataList(tableId) || [];
                that.resetData(data);
                //插入到父节点后面
                list.splice(index,0,data);//更新缓存
                table.kit.restNumbers(list);//重置下标
                table.setDataMap(tableId,that.resetDataMap(list));//处理map
                if(options.isTree){//处理层级
                    //1、处理父级  2、处理treeObj 3、层级
                    var uo=that.treeFindUpData(data);
                    if(uo) {
                        var clist=uo.children;
                        uo.children.push(data);
                        data[table.config.cols.level]=uo[table.config.cols.level]+1;
                    }else{
                        data[table.config.cols.level]=1;
                        treeList.push(data);
                    }
                }
                //生成html
                var tds=that.renderTr(data,data[table.config.indexName]);
                var trs='<tr data-index="'+ data[table.config.indexName] +'"'+that.renderTrUpids(data)+'>'+ tds.join('') + '</tr>';
                if(index==0){//在第一个位置插入
                    var  tbody=that.layBody.find('table tbody');
                    $(tbody).prepend(trs);
                    that.layBody.find(".layui-none").remove();
                }else{
                    var o=that.layBody.find('[data-index='+(index-1)+']');//父节点dom树
                    $(o).after(trs);
                }
                that.renderForm();
                if(options.isPage)that.renderPage(that.config.page.count+1);//分页渲染
                that.restNumbers();
                that.events();
                if(options.isTree) {//展开节点
                    that.treeNodeOpen(uo, true);
                    that.renderTreeConvertShowName(uo);
                }
            }
            /**
             * 删除一行或多行数据
             * （如果是树状则删除自己和子节点）
             * @param tableId
             * @param data（1、数组；2、对象）
             */
            ,delRow:function (tableId, data) {
                //1、页面清除 2、缓存清除
                var that=table.getClass(tableId)
                    ,options=that.config
                    ,list=table.getDataList(tableId);
                var sonList=[];//需要删除的数据
                var delIds={};//需要删除的数据map
                var delDatas=[];
                var upDelDatas=[];//全部待删除节点的父节点（处理折叠）
                if(!that||!data)return;
                if(table.kit.isArray(data)){//是数组，删除多个
                    delDatas=data;
                }else{
                    delDatas[0]=data;
                }
                delDatas.forEach(function(temo) {//记录全部父节点
                    var uo=that.treeFindUpData(temo);
                    if(uo){
                        upDelDatas.push(uo);
                    }
                });
                sonList=options.isTree?table.treeFindSonList(that.config.id,delDatas):delDatas;
                sonList.forEach(function (temo) {//页面元素处理
                    var index=temo[table.config.indexName];
                    delIds[index]=index;//设置代删除的id集合
                    var tr = that.layBody.find('tr[data-index="'+ index +'"]');
                    tr.remove();
                });
                that.restNumbers();//数据处理
                var newList=[];//重构一个新的数组
                for (var i=0,len=list.length;i<len;i++) {
                    var isP=true;
                    var temo1=null;
                    sonList.forEach(function (temo) {
                        if (temo[table.config.indexName] === list[i][table.config.indexName]) {
                            isP = false;
                        }
                    });
                    if(isP){
                        newList.push(list[i]);
                    }
                }
                table.kit.restNumbers(newList);//下标重新编号
                table.setDataList(tableId,newList);//处理list
                table.setDataMap(tableId,that.resetDataMap(newList));//处理map
                table.setDataTreeList(tableId,that.resetDataTreeList(newList,table.getDataRootList(tableId)));//处理树结构
                upDelDatas.forEach(function(temo) {//处理父级节点
                    that.renderTreeConvertShowName(temo);
                });
                if(options.isPage)that.renderPage(that.config.page.count-Object.keys(delIds).length);//分页渲染
                that.events();//重新注册事件
            }
            /**
             * 更新指定的记录
             * @param obj
             * @param index
             */
            ,updateRow:function (tableId,obj) {
                var that=table.getClass(tableId);
                if(!that||!obj)return;
                var id=obj[that.config.idField];
                //更新缓存数据
                var maps=table.getDataMap(tableId);
                var thisobj=maps[id];
                if(thisobj){
                    $.extend(thisobj, obj);
                }else{
                    return;
                }
                //更新页面
                var oi=thisobj[table.config.indexName];
                var  tds=that.renderTr(thisobj,oi);
                var tr=that.layBody.find('tr[data-index='+oi+']');
                $(tr).html(tds);
            }
            ,treeNodeOpen:function (tableId,o, isOpen) {
                var that=table.getClass(tableId);
                if(!that||!o)return;
                that.treeNodeOpen(o,isOpen);
            }
            /**
             * 折叠或展开全部(默认为展开全部节点)
             * @param tableId
             * @param isOpen    展开还是折叠（默认值为true 展开）
             */
            ,treeOpenAll:function (tableId,isOpen) {
                var that=table.getClass(tableId);
                if(!that)return;
                if(isOpen===undefined){isOpen=true;}
                var list=table.getDataList(tableId);
                if(!list)return;
                list.forEach(function (temo) {
                    that.treeNodeOpen(temo,isOpen);
                });
            }
            /**
             * 获取全部需要子节点对象集合
             * @param data（数组或对象）
             */
            ,treeFindSonList:function (tableId,data) {
                var that=table.getClass(tableId);
                if(!that||!data)return [];
                var delDatas=[];
                var sonList=[];//需要删除的数据
                var delIds={};//需要删除的数据map
                if(table.kit.isArray(data)){//是数组，删除多个
                    delDatas=data;
                }else{
                    delDatas[0]=data;
                }
                delDatas.forEach(function (temo) {
                    if(temo.children.length>0){
                        var temSonList=that.treeFindSonData(temo);
                        temSonList.forEach(function (temii) {
                            if(!delIds[temii[table.config.indexName]]){
                                sonList.push(temii);
                                delIds[temii[table.config.indexName]]=temii[table.config.indexName];
                            }
                        });
                    }
                    sonList.push(temo);
                    delIds[temo[table.config.indexName]]=temo[table.config.indexName];
                });
                return sonList;
            }
            ,treeFindUpDatas:function (tableId, o) {
                var that=table.getClass(tableId);
                if(!that||!o)return [];
                return that.treeFindUpDatas(o);
            }
            ,treeFindUpData:function (tableId, o) {
                var that=table.getClass(tableId);
                if(!that||!o)return [];
                return that.treeFindUpData(o);
            }
            /**
             * 获取全部需要子节点id集合
             * @param data（数组或对象）
             */
            ,treeFindSonIds:function (tableId,data) {
                var delIds=[];
                var sonList=table.treeFindSonList(tableId,data);
                sonList.forEach(function (temo) {
                    delIds.push([table.config.indexName]);
                });
                return delIds;
            }
            /**
             * 获取全部的id字段集合
             * @param tableId
             * @param data
             * @returns {Array}
             */
            ,treeFindSonIdFields:function (tableId,data) {
                var idField=[];
                var that=table.getClass(tableId);
                var sonList=table.treeFindSonList(tableId,data);
                sonList.forEach(function (temo) {
                    idField.push(temo[that.config.idField]);
                });
                return idField;
            }
            ,treeIconRender:function (tableId, o) {
                var that=table.getClass(tableId);
                if(!that||!o)return [];
                return that.treeIconRender(o,false);
            }
            /**
             * 工具方法对象
             */
            ,kit:{
                isArray:function (o) {
                    return Object.prototype.toString.call(o) === '[object Array]';
                }
                ,isNumber:function (val){
                    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
                    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
                    if(regPos.test(val) || regNeg.test(val)){
                        return true;
                    }else{
                        return false;
                    }

                }
                ,restNumbers:function (list) {
                    if(!list)return;
                    var i=0;
                    list.forEach(function (o) {
                        o[table.config.indexName]=i;
                        i++;
                    });
                }
            }
        }
        //操作当前实例
        ,thisTable = function(){
            var that = this
                ,options = that.config
                ,id = options.id;
            id && (thisTable.config[id] = options);
            return {
                reload: function(options){
                    that.reload.call(that, options);
                }
                ,config: options
            }
        }
        //字符常量
        ,MOD_NAME = 'treeGrid', ELEM = '.layui-table', THIS = 'layui-this', SHOW = 'layui-show', HIDE = 'layui-hide', DISABLED = 'layui-disabled', NONE = 'layui-none'
        ,ELEM_VIEW = 'layui-table-view', ELEM_HEADER = '.layui-table-header', ELEM_BODY = '.layui-table-body', ELEM_MAIN = '.layui-table-main', ELEM_FIXED = '.layui-table-fixed', ELEM_FIXL = '.layui-table-fixed-l', ELEM_FIXR = '.layui-table-fixed-r', ELEM_TOOL = '.layui-table-tool', ELEM_PAGE = '.layui-table-page', ELEM_SORT = '.layui-table-sort', ELEM_EDIT = 'layui-table-edit', ELEM_HOVER = 'layui-table-hover'
        ,TABLE_RADIO_ID='table_radio_',TABLE_CHECKBOX_ID='layTableCheckbox'
        ,ELEM_FILTER='.layui-table-filter'
        ,TREE_ID='treeId',TREE_UPID='treeUpId',TREE_SHOW_NAME='treeShowName',TREE_KEY_MAP='tree_key_map'
        //thead区域模板
        ,TPL_HEADER = function(options){
            var rowCols = '{{#if(item2.colspan){}} colspan="{{item2.colspan}}"{{#} if(item2.rowspan){}} rowspan="{{item2.rowspan}}"{{#}}}';
            options = options || {};
            return ['<table cellspacing="0" cellpadding="0" border="0" class="layui-table" '
                ,'{{# if(d.data.skin){ }}lay-skin="{{d.data.skin}}"{{# } }} {{# if(d.data.size){ }}lay-size="{{d.data.size}}"{{# } }} {{# if(d.data.even){ }}lay-even{{# } }}>'
                ,'<thead>'
                ,'{{# layui.each(d.data.cols, function(i1, item1){ }}'
                ,'<tr>'
                ,'{{# layui.each(item1, function(i2, item2){ }}'
                ,'{{# if(item2.fixed && item2.fixed !== "right"){ left = true; } }}'
                ,'{{# if(item2.fixed === "right"){ right = true; } }}'
                ,function(){
                    if(options.fixed && options.fixed !== 'right'){
                        return '{{# if(item2.fixed && item2.fixed !== "right"){ }}';
                    }
                    if(options.fixed === 'right'){
                        return '{{# if(item2.fixed === "right"){ }}';
                    }
                    return '';
                }()
                ,'<th data-field="{{ item2.field||i2 }}" {{# if(item2.minWidth){ }}data-minwidth="{{item2.minWidth}}"{{# } }} '+ rowCols +' {{# if(item2.unresize){ }}data-unresize="true"{{# } }}>'
                ,'<div class="layui-table-cell laytable-cell-'
                ,'{{# if(item2.colspan > 1){ }}'
                ,'group'
                ,'{{# } else { }}'
                ,'{{d.index}}-{{item2.field || i2}}'
                ,'{{# if(item2.type !== "normal"){ }}'
                ,' laytable-cell-{{ item2.type }}'
                ,'{{# } }}'
                ,'{{# } }}'
                ,'" {{#if(item2.align){}}align="{{item2.align}}"{{#}}}>'
                ,'{{# if(item2.type === "checkbox"){ }}' //复选框
                ,'<input type="checkbox" name="layTableCheckbox" lay-skin="primary" lay-filter="layTableAllChoose">'
                ,'{{# } else { }}'
                ,'<span>{{item2.title||""}}</span>'
                ,'{{# if(!(item2.colspan > 1) && item2.sort){ }}'
                ,'<span class="layui-table-sort layui-inline"><i class="layui-edge layui-table-sort-asc"></i><i class="layui-edge layui-table-sort-desc"></i></span>'
                ,'{{# } }}'
                ,'{{# } }}'
                ,'</div>'
                ,'</th>'
                ,(options.fixed ? '{{# }; }}' : '')
                ,'{{# }); }}'
                ,'</tr>'
                ,'{{# }); }}'
                ,'</thead>'
                ,'</table>'].join('');
        }
        /**
         * 行内过滤区域
         */
        ,TPL_FILTER = function(options){
        }
        //tbody区域模板
        ,TPL_BODY = ['<table cellspacing="0" cellpadding="0" border="0" class="layui-table" '
            ,'{{# if(d.data.skin){ }}lay-skin="{{d.data.skin}}"{{# } }} {{# if(d.data.size){ }}lay-size="{{d.data.size}}"{{# } }} {{# if(d.data.even){ }}lay-even{{# } }}>'
            ,'<tbody></tbody>'
            ,'</table>'].join('')
        //主模板
        ,TPL_MAIN = ['<div class="layui-form layui-border-box {{d.VIEW_CLASS}}" lay-filter="LAY-table-{{d.index}}" style="{{# if(d.data.width){ }}width:{{d.data.width}}px;{{# } }} {{# if(d.data.height){ }}height:{{d.data.height}}px;{{# } }}">'

            ,'{{# if(d.data.toolbar){ }}'
            ,'<div class="layui-table-tool"></div>'
            ,'{{# } }}'

            ,'<div class="layui-table-box">'
            ,'{{# var left, right; }}'
            ,'<div class="layui-table-header">'
            ,TPL_HEADER()
            ,'</div>'
            ,'<div class="layui-table-filter">'
            ,TPL_FILTER()
            ,'</div>'
            ,'<div class="layui-table-body layui-table-main">'
            ,TPL_BODY
            ,'</div>'

            ,'{{# if(left){ }}'
            ,'<div class="layui-table-fixed layui-table-fixed-l">'
            ,'<div class="layui-table-header">'
            ,TPL_HEADER({fixed: true})
            ,'</div>'
            ,'<div class="layui-table-body">'
            ,TPL_BODY
            ,'</div>'
            ,'</div>'
            ,'{{# }; }}'

            ,'{{# if(right){ }}'
            ,'<div class="layui-table-fixed layui-table-fixed-r">'
            ,'<div class="layui-table-header">'
            ,TPL_HEADER({fixed: 'right'})
            ,'<div class="layui-table-mend"></div>'
            ,'</div>'
            ,'<div class="layui-table-body">'
            ,TPL_BODY
            ,'</div>'
            ,'</div>'
            ,'{{# }; }}'
            ,'</div>'

            ,'{{# if(d.data.isPage){ }}'
            ,'<div class="layui-table-page">'
            ,'<div id="layui-table-page{{d.index}}"></div>'
            ,'</div>'
            ,'{{# } }}'

            /*,'<style>'
            ,'{{# layui.each(d.data.cols, function(i1, item1){'
            ,'layui.each(item1, function(i2, item2){ }}'
            ,'.laytable-cell-{{d.index}}-{{item2.field||i2}}{ '
            ,'{{# if(item2.width){ }}'
            ,'width: {{item2.width}}px;'
            ,'{{# } }}'
            ,' }'
            ,'{{# });'
            ,'}); }}'
            ,'</style>'*/
            ,'</div>'].join('')
        ,_WIN = $(window)
        ,_DOC = $(document)

        //构造器
        ,Class = function(options){
            var that = this;
            that.index = ++table.index;
            that.config = $.extend({}, that.config, table.config, options);
            that.configFirst = $.extend({}, that.config, table.config, options);
            that.render();
            table.pushClass(options.id,that);
        };
    /**
     * 表格行为属性（默认配置）
     */
    Class.prototype.config = {
        limit: 10 //每页显示的数量
        ,loading: true //请求数据时，是否显示loading
        ,cellMinWidth: 60 //所有单元格默认最小宽度
        ,heightRemove:[]//非固定高度情况下，不参与计算的高度
        ,text: {
            none: '无数据'
        }
        ,isFilter:false//是否开启行内过滤
        ,method:'post'//默认以post方式请求后台
        ,radDisabledNum:0//禁止单选的记录数
        ,cheDisabledNum:0//禁止多选的记录数
        //树相关图表
        ,branch: ['&#xe622;', '&#xe624;'] //父节点
        ,leaf: '&#xe621;' //叶节点
        ,iconOpen:true//默认开启树节点图标
        ,isOpenDefault:true//默认展开还是折叠节点
        ,parseData:null//加载数据后的回调方法
        ,onClickRow:null//行单击事件
        ,onDblClickRow:null//行双击事件
        ,onBeforeCheck:null//复选前事件
        ,onCheck:null//复选事件  (obj 对象,checked 选中状态,isAll 是否全选)
        ,onRadio:null//单选事件  （）
        ,isTree:true//默认为树表格
        ,isPage:false//不分页
        ,height:'100%'//默认高度100%
    };
    Class.prototype.configFirst={};//页面定义时原始参数
    //表格渲染
    Class.prototype.render = function(){
        var that = this
            ,options = that.config;
        options.elem = $(options.elem);
        options.where = options.where || {};
        options.id = options.id || options.elem.attr('id');
        that.test();
        //请求参数的自定义格式
        options.request = $.extend({
            pageName: 'page'
            ,limitName: 'limit'
        }, options.request)
        //响应数据的自定义格式
        options.response = $.extend({
            statusName: 'code'
            ,statusCode: 0
            ,msgName: 'msg'
            ,dataName: 'data'
            ,countName: 'count'
        }, options.response);
        //如果 page 传入 laypage 对象
        if(typeof options.page === 'object'){
            options.limit = options.page.limit || options.limit;
            options.limits = options.page.limits || options.limits;
            that.page = options.page.curr = options.page.curr || 1;
            delete options.page.elem;
            delete options.page.jump;
        }
        if(!options.elem[0]) return that;
        that.columnWidthInit();//列宽度计算
        //开始插入替代元素
        var othis = options.elem
            ,hasRender = othis.next('.' + ELEM_VIEW)
            //主容器
            ,reElem = that.elem = $(laytpl(TPL_MAIN).render({
                VIEW_CLASS: ELEM_VIEW
                ,data: options
                ,index: that.index //索引
            }));
        options.index = that.index;
        //生成替代元素
        hasRender[0] && hasRender.remove(); //如果已经渲染，则Rerender
        othis.after(reElem);
        that.renderTdCss();
        //各级容器
        that.layHeader = reElem.find(ELEM_HEADER);  //表头
        that.layMain = reElem.find(ELEM_MAIN);//内容区域
        that.layBody = reElem.find(ELEM_BODY);//内容区域
        that.layFixed = reElem.find(ELEM_FIXED);//浮动区域
        that.layFixLeft = reElem.find(ELEM_FIXL);//左浮动
        that.layFixRight = reElem.find(ELEM_FIXR);//有浮动
        that.layTool = reElem.find(ELEM_TOOL);//工具栏区域
        that.layPage = reElem.find(ELEM_PAGE);//分页区域
        that.layFilter=reElem.find(ELEM_FILTER);//行内过滤条件区域
        that.layTool.html(
            laytpl($(options.toolbar).html()||'').render(options)
        );
        if(options.height){
            that.tableHeight();//表格高度计算
            that.resizeHeight();//高度控制
            that.renderCss();
        }
        //如果多级表头，则填补表头高度
        if(options.cols.length > 1){
            var th = that.layFixed.find(ELEM_HEADER).find('th');
            th.height(that.layHeader.height() - 1 - parseFloat(th.css('padding-top')) - parseFloat(th.css('padding-bottom')));
        }
        //渲染过滤区域
        if(options.isFilter){
            that.layFilter.html(
                that.renderFilter()
            );
        }
        //请求数据
        that.pullData(that.page,that.loading());
        that.test();
    };
    //根据列类型，定制化参数
    Class.prototype.initOpts = function(item){
        var that = this,
            options = that.config;
        //让 type 参数兼容旧版本
        if(item.checkbox) item.type = "checkbox";
        if(item.space) item.type = "space";
        if(!item.type) item.type = "normal";

        if(item.type !== "normal"){
            item.unresize = true;
            item.width = item.width || table.config.initWidth[item.type];
        }

        if(options.isFilter){//开启行内过滤
            if(item.isFilter!=false){
                item.isFilter=true;
            }
        }
    };

    /**
     * 表格获取父容器高度
     * @param tableId
     */
    Class.prototype.getParentDivHeight = function(tableId){
        var th=$("#"+tableId).parent().height();
        return th;
    };

    /**
     * 获取列定义
     * @param tableId
     */
    Class.prototype.getCols = function(field){
        var that = this;
        var o={};
        var cols=that.config.cols[0];
        var isInt=false;
        var reg = /^[0-9]+.?[0-9]*$/;
        if (reg.test(field)) {//数字
            isInt=true;
        }
        for(var ii in cols){
            if(isInt){
                if(ii==parseInt(field)) return cols[ii];
            }else{
                if(field==cols[ii].field)return cols[ii];
            }
        }
        return o;
    };

    //表格重载
    Class.prototype.reload = function(options){
        var that = this;
        if(that.config.data && that.config.data.constructor === Array) delete that.config.data;
        that.config = $.extend({}, that.config, options);
        that.configFirst = $.extend({}, that.config, options);
        //获取行内过滤的值
        that.render();
    };
    //页码
    Class.prototype.page = 1;
    /**
     * 重置下标（插入删除等操作）
     * 1、data-index中的下标
     * 2、tr中data的值
     * 3、下标字段的值
     * @param list
     */
    Class.prototype.restNumbers=function(){
        var that = this
            ,options = that.config;
        var  trs=that.layBody.find('table tbody tr');
        var i=0;
        trs.each(function (o) {
            $(this).attr("data-index",i);
            $(this).find(".laytable-cell-numbers p").text(i+1);
            $(this).data('index',i);
            i++;
        });
    }

    /**
     * 初始化节点
     * 在每一次数据加载时只执行一次
     * query、reload时会执行
     * @param o
     */
    Class.prototype.resetData=function(n) {
        var that = this
            ,options = that.config;
        if(options.isTree){
            if(!n.hasOwnProperty(table.config.cols.isOpen)){//如果不存在该属性则默认为true
                n[table.config.cols.isOpen]=options.isOpenDefault;
            }
            if(!n.hasOwnProperty(table.config.cols.isShow)){//如果不存在该属性则默认为true
                n[table.config.cols.isShow]=options.isOpenDefault?true:false;
            }
        }
        //禁止设置
        if(!n.hasOwnProperty(table.config.cols.cheDisabled)){//不存在则默认为false
            n[table.config.cols.cheDisabled]=false;
        }
        //记录禁止多选、单选的记录数
        if(n[table.config.cols.cheDisabled])options.cheDisabledNum++;
        if(n[table.config.cols.radDisabled])options.radDisabledNum++;
        n.children=[];
    }
    /**
     * 构建map数据
     * @param list
     * @return {{}}
     */
    Class.prototype.resetDataMap=function(list) {
        var that = this
            ,options = that.config;
        var field_Id=options.idField;
        var map={};
        if(list){
            list.forEach(function (o) {
                map[o[field_Id]]=o;
            });
        }
        return map;
    }
    Class.prototype.resetDataresetRoot=true;//是否重新确定根节点
    /**
     * 确定根节点id(重新登录根节点)
     */
    Class.prototype.resetDataRoot=function (list) {
        var that = this
            ,options = that.config;
        var field_Id=options[TREE_ID];
        var field_upId=options[TREE_UPID];
        var map=table.getDataMap(that.config.id);//列表map，fieldId为key  //设置map数据集合
        var rootList=table.cache[options.id].data.upIds||[];//根节点list集合
        var rootMap={};//根节点map集合
        table.cache[options.id].data.upIds=[];
        rootList=table.cache[options.id].data.upIds;
        for(var i=0;i<list.length;i++){
            var temo=list[i];
            if(!map[temo[field_upId]]){//没有找到父节点
                if(!rootMap[temo[field_upId]]){//还不存在
                    var temis=true;
                    rootList.forEach(function (temoo) {
                        if(temoo===temo[field_upId])temis=false;
                    });
                    if(temis)rootList.push(temo[field_upId]);
                }
                rootMap[temo[field_upId]]=temo[field_upId];
            }
        }
        return rootList;
    }
    /**
     * 处理树结构
     * 1、原始列表数据
     * 2、根节点集合
     */
    Class.prototype.resetDataTreeList=function (list, rootList) {
        var that = this
            ,options = that.config;
        var field_Id=options[TREE_ID];
        var field_upId=options[TREE_UPID];
        var treeList=[];
        //处理树结构
        var fa = function(upId) {
            var _array = [];
            for (var i = 0; i < list.length; i++) {
                var n = list[i];
                if (n[field_upId] === upId) {
                    n.children = fa(n[field_Id]);
                    _array.push(n);
                }
            }
            return _array;
        }
        rootList.forEach(function (temo) {
            var temTreeObj=fa(temo);//递归
            if(temTreeObj){
                temTreeObj.forEach(function (o) {
                    treeList.push(o);
                });
            }
        });
        return treeList;
    }

    /**
     * 处理数据列表结构
     * 1、树结构
     */
    Class.prototype.resetDataTableList=function (treeList) {
        var that = this
            ,options = that.config;
        var field_Id=options[TREE_ID];
        var field_upId=options[TREE_UPID];
        var tableList=[];
        //处理表格结构
        var fa2=function (l,level) {
            for (var i = 0; i < l.length; i++) {
                var n = l[i];
                n[table.config.cols.level]=level;//设置当前层级
                tableList.push(n);
                if (n.children&&n.children.length>0) {
                    fa2(n.children,1+level);
                }
            }
            return;
        }
        fa2(treeList,1);

        //设置isOpen 和is_show状态
        tableList.forEach(function (o) {
            var uo=that.treeFindUpData(o);
            if(!uo||(uo[table.config.cols.isOpen]&&uo[table.config.cols.isShow])){//没有父亲：显示；父亲打开状态（显示状态：显示；隐藏状态：隐藏）
                o[table.config.cols.isShow]=true;
            }else{
                o[table.config.cols.isShow]=false;
            }
        });
        return tableList;
    }

    /**
     * 重置当前表格的数据（1、普通列表；2树状表格）
     * 将列表数据转成树形结构和符合table展示的列表
     * @param list          列表数据
     * @param field_Id      树形结构主键字段
     * @param field_upId    树形结构上级字段
     * @returns {Array}     [0]表格列表  [1]树形结构
     */
    Class.prototype.resetDatas=function(list) {
        //console.time("resetDatas");
        var that = this
            ,options = that.config;
        var field_Id=options[TREE_ID];
        var field_upId=options[TREE_UPID];
        var datas=[];
        var treeList=[];
        var tableList=list;
        var map=that.resetDataMap(list);//列表map，fieldId为key  //设置map数据集合
        datas.push(tableList);//table结构
        datas.push(treeList)//tree树结构
        datas.push(map)//data数据 map结构
        //设置到内存中去
        table.setDataList(that.config.id,tableList);
        table.setDataTreeList(that.config.id,treeList);
        table.setDataMap(that.config.id,map);
        if(list==null||list.length<=0)return datas;
        //设置默认参数
        for (var i = 0; i < list.length; i++) {
            that.resetData(list[i]);
        }
        if(options.isTree){//树状
            tableList=[];
            table.setDataList(that.config.id,tableList);
            var rootList=table.cache[options.id].data.upIds||[];//根节点list集合
            if(rootList.length<=0||that.resetDataresetRoot){//确定根节点
                table.cache[options.id].data.upIds=[];
                rootList=that.resetDataRoot(list);
                that.resetDataresetRoot=false;
            }
            treeList=that.resetDataTreeList(list,rootList);
            table.setDataTreeList(that.config.id,treeList);//设置树结构到缓存
            tableList=that.resetDataTableList(treeList);
            table.setDataList(that.config.id,tableList);//设置数据列表结构到缓存
        }
        //console.timeEnd("resetDatas");
        return datas;
    }
    /**
     * 根据id从表格数据中获取对象
     * @param data
     * @param field_Id
     * @param field_upId
     * @returns {Array}
     */
    Class.prototype.treeFindDataById=function(u_Id) {
        var that = this
            ,options = that.config;
        var e=null;
        var list=table.getDataList(that.key);
        var key=options[TREE_ID];
        list.forEach(function (o) {
            if(o[key]==u_Id){
                e=o;
                return;
            }
        });
        return e;
    }
    /**
     * 获取父节点
     * @param u_Id
     */
    Class.prototype.treeFindUpData=function(o){
        var uOjb=null;
        var that = this
            ,options = that.config;
        //处理父级
        var key=options[TREE_UPID];//父节点key名称
        var mapData=table.getDataMap(that.config.id);//获取map形式对象集合
        uOjb=mapData[o[key]];
        return uOjb;
    }
    /**
     * 获取全部父节点集合，返回list(不包含自己)
     * @param u_Id
     */
    Class.prototype.treeFindUpDatas=function(o){
        var uOjb=null;
        var that = this
            ,options = that.config;
        var list=[];
        var temf=function (temo) {
            var uo=that.treeFindUpData(temo);
            if(uo){
                list.push(uo);
                temf(uo);
            }
        };
        temf(o);
        return list;
    }
    /**
     * 根据父id获取全部的叶子节点(递归)
     * @param o 数据对象
     * @return {string}
     */
    Class.prototype.treeFindSonData=function (data) {
        var objs=[];
        function f(o) {
            if(o.children.length>0){
                o.children.forEach(function (i) {
                    objs.push(i);
                    if(i.children.length>0){
                        f(i);
                    }
                });
            }
        }f(data);
        return objs;
    };
    /**
     * 叶子节点显示转换
     * @param o             数据
     * @param fieldName     树显示列名
     * @returns {string}
     */
    Class.prototype.treeConvertShowName=function (o) {
        var that = this
            ,options = that.config;
        var isTreeNode=(o.children&&o.children.length>0);
        var temhtml='<div style="float: left;height: 28px;line-height: 28px;padding-left: '+
            function () {
                if(isTreeNode){
                    return '5px'
                }else{
                    return '21px'
                }
            }()
            +'">'
            +function () {//位移量
                var nbspHtml="<i>"//一次位移
                for(var i=1;i<o[table.config.cols.level];i++) {
                    nbspHtml = nbspHtml + "&nbsp;&nbsp;&nbsp;&nbsp;";
                }
                nbspHtml=nbspHtml+"</i>";
                return nbspHtml;
            }()
            +function () {//图标或占位符
                var temTreeHtml='';
                var temTreeIsOpen=o[table.config.cols.isOpen]?"&#xe625;":"&#xe623;";
                if(isTreeNode){//父节点
                    temTreeHtml='<i class="layui-icon layui-tree-head">'+temTreeIsOpen+'</i>'
                        +that.treeIconRender(o,true);
                }else{//叶子节点
                    temTreeHtml+=that.treeIconRender(o,true);
                }
                return temTreeHtml;
            }()
            +'</div>';
        return temhtml;
    };
    /**
     * 节点的展开或折叠
     * @param o         节点数据（树状表格）
     * @param isOpen    展开（true）或折叠（false）
     *
     * 每个节点有两种状态，
     * 1、打开状态（isOpen）   打开状态只需在点击瞬间控制，其他时候不需要变动
     * 2、显示状态（显示或隐藏） 显示状态根据父级节点控制，父级节点是显示并且打开状态的则显示，否则不显示，但不影响其打开状态
     */
    Class.prototype.treeNodeOpen=function (o,isOpen) {
        var that = this
            ,tr = that.layBody.find('tr[data-index="'+ o[table.config.indexName] +'"]');
        if(!o){
            return
        }
        o[table.config.cols.isOpen]=isOpen;
        //处理树结构
        var fa = function(e) {
            if(e.children&&e.children.length>0){
                var temList=e.children;
                for (var i = 0; i < temList.length; i++) {
                    var n = temList[i];
                    if(o[table.config.cols.isOpen]){//打开状态的，关闭
                        if(e[table.config.cols.isOpen]&&e[table.config.cols.isShow]){//该节点显示
                            var temo=that.layBody.find('tr[data-index="'+ n[table.config.indexName] +'"]');
                            temo.css('display', '');
                            n[table.config.cols.isShow]=true;
                        }
                    }else{
                        var temo=that.layBody.find('tr[data-index="'+ n[table.config.indexName] +'"]');
                        temo.css('display', 'none');
                        n[table.config.cols.isShow]=false;
                    }
                    fa(n);
                }
            }
        }
        fa(o);
        //处理图标
        that.treeIconRender(o,false);
        var dbClickI=tr.find('.layui-tree-head');
        if(o[table.config.cols.isOpen]){//打开状态
            dbClickI.html('&#xe625;');
        }else{
            dbClickI.html('&#xe623;');
        }
    };

    /**
     * icon渲染
     * @param o
     * @param isHtml  true（返回html）  false（立即渲染）
     */
    Class.prototype.treeIconRender=function (o,isHtml) {
        var that = this
            ,options = that.config
            ,iconOpen=options.iconOpen
            ,isTreeNode=(o.children&&o.children.length>0);
        var temTreeHtml='';
        if(iconOpen){
            var temf=function () {//自定义图标
                var temhtml='<i class="layui-tree-'+o[options.idField]+'" style="display:inline-block;width: 16px;height: 16px;background:url(';
                if(isTreeNode){//父节点
                    if(o[table.config.cols.isOpen]){
                        temhtml+=o[table.config.cols.iconOpen];
                    }else{
                        temhtml+=o[table.config.cols.iconClose];
                    }
                }else{
                    temhtml+=o[table.config.cols.icon];
                }
                temhtml+=') 0 0 no-repeat;"></i>';
                return temhtml;
            }
            if(isTreeNode){//父节点
                if((o[table.config.cols.iconOpen]||o[table.config.cols.iconClose])){
                    temTreeHtml=temf();
                }else{
                    temTreeHtml='<i class="layui-icon layui-tree-'+o[options.idField]+' layui-tree-'+ (o[table.config.cols.isOpen] ? "branch" : "leaf") +'" '+iconOpen+'>'+(o[table.config.cols.isOpen]?that.config.branch[1]:that.config.branch[0])+'</i>';
                }
            }else{//叶子节点
                if(o[table.config.cols.icon]){
                    temTreeHtml=temf();
                }else{
                    temTreeHtml+='<i class="layui-icon layui-tree-'+o[options.idField]+' layui-tree-leaf"  '+iconOpen+'>'+that.config.leaf+'</i>';
                }
            }
            if(isHtml){
                return temTreeHtml;
            }else{
                var temdiv=that.layBody.find('tr[data-index="'+ o[table.config.indexName] +'"]').find('td[data-field='+options[TREE_SHOW_NAME]+']').find('.layui-table-cell');
                $(temdiv).find('div .layui-tree-'+o[options.idField]).remove();//节点附加div
                $(temdiv).find('div').append(temTreeHtml);
            }
        }else{
            return temTreeHtml;
        }
    }
    //获得数据
    Class.prototype.pullData = function(curr, loadIndex){
        var that = this
            ,options = that.config
            ,request = options.request
            ,response = options.response
            ,sort = function(){
                if(typeof options.initSort === 'object'){
                    that.sort(options.initSort.field, options.initSort.type);
                }
            };
        that.startTime = new Date().getTime(); //渲染开始时间
        if(options.url){ //Ajax请求
            var params = {};
            params[request.pageName] = curr;
            params[request.limitName] = options.limit;
            that.filterRulesSet(params);//行内过滤条件
           // that.sortSet(params);//排序条件
            $.ajax({
                type: options.method || 'get'
                ,url: options.url
                ,data: $.extend(params, options.where)
                ,dataType: 'json'
                ,success: function(res){
                    if(!res[response.dataName]){//返回是未定义或null时转成[]
                        res[response.dataName]=[]
                        res[response.statusName]=0;
                        res[response.countName]=0;
                        res[response.msgName]='返回的数据状态异常';
                    };
                    that.resetDataresetRoot=true;
                    //如果有数据解析的回调，则获得其返回的数据
                    if(typeof options.parseData === 'function'){
                        res = options.parseData(res) || res;
                    }
                    that.resetDatas(res[response.dataName]);
                    res[response.dataName]=table.getDataList(options.id);
                    if(res[response.statusName] != response.statusCode){
                        that.renderForm();
                        that.layMain.html('<div class="'+ NONE +'">'+ (res[response.msgName] || '返回的数据状态异常') +'</div>');
                    } else {
                        that.renderData(res, curr, res[response.countName]);
                        options.time = (new Date().getTime() - that.startTime) + ' ms'; //耗时（接口请求+视图渲染）
                    }
                    loadIndex && layer.close(loadIndex);
                    that.events();
                    typeof options.done === 'function' && options.done(res, curr, res[response.countName]);
                }
                ,error: function(e, m){
                    that.layMain.html('<div class="'+ NONE +'">数据接口请求异常</div>');
                    that.renderForm();
                    loadIndex && layer.close(loadIndex);
                }
            });
        } else if(options.data && options.data.constructor === Array){ //已知数据
            var res = {},startLimit = curr*options.limit - options.limit
            res[response.dataName] = options.data.concat().splice(startLimit, options.limit);
            res[response.countName] = options.data.length;
            that.renderData(res, curr, options.data.length);
            that.events();
            typeof options.done === 'function' && options.done(res, curr, res[response.countName]);
        }
    };
    /**
     * 设置过滤条件
     */
    Class.prototype.filterRulesSet=function (p) {
        var that = this;
        p["filterRules"]=JSON.stringify(that.filterRules());
    }
    /**
     * 获取过滤条件
     * filterRules:
     * [
     * {"field":"XXXX","op":"equals","value":["1"],"datatype":"array"}
     * ,{"field":"XXXX","op":"contains","value":"3","datatype":"string"}
     * ]
     */
    Class.prototype.filterRules=function () {
        var that = this;
        var filterRules=[];
        //行内过滤条件
        var list=that.layFilter.find("[name^='filter_']");
        layui.each(list,function (i, o) {
            if($(o).val()){
                var tem={
                    "field":o.name
                    ,"op":"like"
                    ,"value":$(o).val()
                    ,"datatype":"string"
                }
                filterRules.push(tem);
            }
        });
        // console.log(filterRules,filterRules.toString(),JSON.stringify(filterRules));
        return filterRules;
    }

    //遍历表头
    Class.prototype.eachCols = function(callback){
        var cols = $.extend(true, [], this.config.cols)
            ,arrs = [], index = 0;

        //重新整理表头结构
        layui.each(cols, function(i1, item1){
            layui.each(item1, function(i2, item2){
                //如果是组合列，则捕获对应的子列
                if(item2.colspan > 1){
                    var childIndex = 0;
                    index++
                    item2.CHILD_COLS = [];
                    layui.each(cols[i1 + 1], function(i22, item22){
                        if(item22.PARENT_COL || childIndex == item2.colspan) return;
                        item22.PARENT_COL = index;
                        item2.CHILD_COLS.push(item22);
                        childIndex = childIndex + (item22.colspan > 1 ? item22.colspan : 1);
                    });
                }
                if(item2.PARENT_COL) return; //如果是子列，则不进行追加，因为已经存储在父列中
                arrs.push(item2)
            });
        });

        //重新遍历列，如果有子列，则进入递归
        var eachArrs = function(obj){
            layui.each(obj || arrs, function(i, item){
                if(item.CHILD_COLS) return eachArrs(item.CHILD_COLS);
                callback(i, item);
            });
        };

        eachArrs();
    };
    /**
     * 渲染节点显示
     * @param callback
     */
    Class.prototype.renderTreeConvertShowName = function(o){
        var that = this
            ,options = that.config
            ,m=options.elem
            ,hasRender = m.next('.' + ELEM_VIEW);
        var temhtml=that.treeConvertShowName(o);
        var temdiv=that.layBody.find('tr[data-index="'+ o[table.config.indexName] +'"]').find('td[data-field='+options[TREE_SHOW_NAME]+']').find('.layui-table-cell');
        $(temdiv).find('div').remove();
        $(temdiv).prepend(temhtml);
    }
    /**
     * 渲染表格单元格样式(宽度样式设置)
     * @param callback
     */
    Class.prototype.renderTdCss = function(){
        var that = this
            ,options = that.config
            ,m=options.elem
            ,hasRender = m.next('.' + ELEM_VIEW);
        var id= that.index+"_"+MOD_NAME+'_td_style';
        hasRender.find("#"+id).remove();
        var styel='<style id="'+id+'">'
            +function () {
                var ret="";
                layui.each(that.config.cols,function (i1, item1) {
                    layui.each(item1, function(i2, item2){
                        ret+='.laytable-cell-'+that.index+'-'+(item2.field||i2)+'{' +
                            'width:'+(item2.width?item2.width+"px":"0px")
                            +'}';
                    });
                });
                return ret;
            }()+'</style>';
        hasRender.append(styel);
    }

    /**
     * 插件内css
     */
    Class.prototype.renderCss = function(){
        var that = this
            ,options = that.config
            ,m=options.elem
            ,hasRender = m.next('.' + ELEM_VIEW);
        var id=that.index+"_"+MOD_NAME+'_style';
        hasRender.find("#"+id).remove();
        var styel='<style id="'+id+'">'
            +function () {
                var ret=".layui-tree-head{cursor: pointer;}";//树图标点击样式
                ret+=".layui-table-view {margin:0;}";
                return ret;
            }()+'</style>';
        hasRender.append(styel);
    }

    /**
     * 生成单元格
     * @param obj       行数据
     * @param numbers   下标
     * @param cols      列定义数据
     * @param i3        第几列
     */
    Class.prototype.renderTrUpids=function (obj) {
        var that = this
            ,options = that.config;
        var tree_upid_key=options[TREE_UPID];
        var upids=' upids="'+obj["upIds"]+'" ';
        var u_id=' u_id="'+obj[tree_upid_key]+'" '
        var ret=options.isTree?u_id:'';
        return ret;
    }
    /**
     * 生成单元格
     * @param obj       行数据
     * @param numbers   下标
     * @param cols      列定义数据
     * @param i3        第几列
     */
    Class.prototype.renderTd=function (obj,cols,numbers,i3) {
        var that = this
            ,options = that.config;
        var v=obj[cols.field]==null?'':String(obj[cols.field]);

        var field = cols.field || i3, content = v
            ,cell = that.getColElem(that.layHeader, field);

        var treeImgHtml='';
        if(options.isTree){
            if(options.treeShowName==cols.field){
                treeImgHtml=that.treeConvertShowName(obj);
            }
        }
        //td内容
        var td = ['<td data-field="'+ field +'" '+ function(){
            var attr = [];
            if(cols.edit) attr.push('data-edit="'+ cols.edit +'"'); //是否允许单元格编辑
            if(cols.align) attr.push('align="'+ cols.align +'"'); //对齐方式
            if(cols.templet) attr.push('data-content="'+ content +'"'); //自定义模板
            if(cols.toolbar) attr.push('data-off="true"'); //自定义模板
            if(cols.event) attr.push('lay-event="'+ cols.event +'"'); //自定义事件
            if(cols.style) attr.push('style="'+ cols.style +'"'); //自定义样式
            if(cols.minWidth) attr.push('data-minwidth="'+ cols.minWidth +'"'); //单元格最小宽度
            return attr.join(' ');
        }() +'>'
            ,'<div class="layui-table-cell laytable-cell-'+ function(){ //返回对应的CSS类标识
                var str = (options.index + '-' + field);
                return cols.type === 'normal' ? str
                    : (str + ' laytable-cell-' + cols.type);
            }() +'">'+treeImgHtml+'<p style="width: auto;height: 100%;">'+ function(){
                var tplData = $.extend(true, {LAY_INDEX: numbers}, obj);
                //渲染复选框列视图
                if(cols.type === 'checkbox'){
                    return tplData[table.config.cols.cheDisabled]?''
                        :'<input type="checkbox" name="'+TABLE_CHECKBOX_ID+'" value="'+tplData[table.config.indexName]+'" lay-skin="primary" '+ function(){
                        var isCheckName = table.config.cols.isCheckName;
                        //如果是全选
                        if(cols[isCheckName]){
                            obj[isCheckName] = cols[isCheckName];
                            return cols[isCheckName] ? 'checked' : '';
                        }
                        return tplData[isCheckName] ? 'checked' : '';
                    }() +'>';
                } else if(cols.type === 'numbers'){ //渲染序号
                    return numbers;
                }else if(cols.type === 'drop'){//下拉框
                    var rowsField=dl.ui.table.drop.findFieldObj(options.cols[0],field);
                    if(rowsField&&rowsField['drop']){
                        var o=dl.cache.code.get(rowsField.drop);
                        return dl.ui.table.drop.findDropLable(rowsField.drop,content);
                    }
                }else if(cols.type === 'radio'){//单选
                    return tplData[table.config.cols.radDisabled]?''
                        :'<input type="radio" name="'+TABLE_RADIO_ID+'" '+function () {
                        var isRadio = table.config.cols.isRadio;
                        if(cols[isRadio]){
                            obj[isRadio] = cols[isRadio];
                            return cols[isRadio] ? 'checked' : '';
                        }
                        return tplData[isRadio] ? 'checked' : '';
                    }()+' value="'+tplData[table.config.indexName]+'" title=" ">';
                }

                //解析工具列模板
                if(cols.toolbar){
                    return laytpl($(cols.toolbar).html()||'').render(tplData);
                }

                return cols.templet ? function(){
                    return typeof cols.templet === 'function'
                        ? cols.templet(tplData)
                        : laytpl($(cols.templet).html() || String(content)).render(tplData)
                }() : content;
            }()
            ,'</p></div></td>'].join('');
        return td;
    }
    /**
     * 生成tr中的一行
     * @param obj            行数据
     * @param numbers          行号
     */
    Class.prototype.renderTr=function (obj,numbers) {
        var that = this
            ,options = that.config;
        var tds= [];
        that.eachCols(function(i3, cols){//cols列定义
            var field = cols.field || i3, content = obj[field];
            if(cols.colspan > 1) return;
            var td = that.renderTd(obj,cols,numbers,i3);//td内容
            tds.push(td);
            // if(item3.fixed && item3.fixed !== 'right') tds_fixed.push(td);
            // if(item3.fixed === 'right') tds_fixed_r.push(td);
        });
        return tds;
    };
    /**
     * 表格数据部分渲染入口
     * @param res
     * @param curr
     * @param count
     * @param sort
     */
    Class.prototype.renderData = function(res, curr, count, sort){
        var that = this
            ,options = that.config
            ,data = res[options.response.dataName] || []
            ,trs = []
            ,trs_fixed = []
            ,trs_fixed_r = []
            //渲染视图
            ,render = function(){ //后续性能提升的重点
                if(!sort && that.sortKey){
                    return that.sort(that.sortKey.field, that.sortKey.sort, true);
                }

                layui.each(data, function(i1, obj){
                    var uo=that.treeFindUpData(obj);
                    var display="";
                    if(!obj[table.config.cols.isShow]&&options.isTree){
                        display="display: none;";
                    }
                    var tds = [], tds_fixed = [], tds_fixed_r = []
                        ,numbers = i1 + options.limit*(curr - 1) + 1; //序号
                    if(obj.length === 0) return;
                    if(!sort){
                        obj[table.config.indexName] = i1;
                    }
                    tds=that.renderTr(obj,numbers);
                    trs.push('<tr style="'+display+'" data-index="'+ i1 +'" '+that.renderTrUpids(obj)+'>'+ tds.join('') + '</tr>');
                    trs_fixed.push('<tr data-index="'+ i1 +'">'+ tds_fixed.join('') + '</tr>');
                    trs_fixed_r.push('<tr data-index="'+ i1 +'">'+ tds_fixed_r.join('') + '</tr>');
                });
                //if(data.length === 0) return;
                that.layBody.scrollTop(0);
                that.layMain.find('.'+ NONE).remove();
                that.layMain.find('tbody').html(trs.join(''));
                that.layFixLeft.find('tbody').html(trs_fixed.join(''));
                that.layFixRight.find('tbody').html(trs_fixed_r.join(''));
                that.renderForm();
                that.haveInit ? that.scrollPatch() : setTimeout(function(){
                    that.scrollPatch();
                }, 50);
                that.haveInit = true;
                layer.close(that.tipsIndex);
            };
        that.key = options.id || options.index;
        // table.cache[that.key] = data; //记录数据
        table.setDataList(that.key,data);
        //显示隐藏分页栏
        that.layPage[data.length === 0 && curr == 1 ? 'addClass' : 'removeClass'](HIDE);
        //排序
        if(sort){
            return render();
        }
        if(data.length === 0){
            that.renderForm();
            that.layFixed.remove();
            that.layMain.find('tbody').html('');
            that.layMain.find('.'+ NONE).remove();
            return that.layMain.append('<div class="'+ NONE +'">'+(res[options.response.msgName]?res[options.response.msgName]:options.text.none)+'</div>');
        }
        render();
        that.renderPage(count);//分页渲染
        //calss加载完成
        table.pushClassIds(options.id,true);
    };
    /**
     * 渲染分页
     */
    Class.prototype.renderPage=function (count) {
        var that = this
            ,options = that.config;
        //同步分页状态
        if(options.isPage){
            options.page = $.extend({
                elem: 'layui-table-page' + options.index
                ,count: count
                ,limit: options.limit
                ,limits: options.limits || [10,15,20,30,40,50,60,70,80,90]
                ,groups: 3
                ,layout: ['prev', 'page', 'next', 'skip', 'count', 'limit']
                ,prev: '<i class="layui-icon">&#xe603;</i>'
                ,next: '<i class="layui-icon">&#xe602;</i>'
                ,jump: function(obj, first){
                    if(!first){
                        //分页本身并非需要做以下更新，下面参数的同步，主要是因为其它处理统一用到了它们
                        //而并非用的是 options.page 中的参数（以确保分页未开启的情况仍能正常使用）
                        that.page = obj.curr; //更新页码
                        options.limit = obj.limit; //更新每页条数
                        that.pullData(obj.curr, that.loading());
                    }
                }
            }, options.page);
            options.page.count = count; //更新总条数
            laypage.render(options.page);
        }
    };
    /**
     * 过滤区域的渲染
     */
    Class.prototype.renderFilter = function(){
        var that = this
            ,options = that.config
            ,VIEW_CLASS=ELEM_VIEW
            ,index=that.index; //索引
        var v = [];
        v.push('<form method="post"  id="'+options.id+'_filter_form">');
        v.push('<table cellspacing="0" cellpadding="0" border="0" class="layui-table"><thead><tr>');
        layui.each(options.cols,function (i, o) {
            layui.each(o, function(i2, item2){
                var field=item2.field||i2;
                var minW=item2.minWidth?"data-minwidth='"+item2.minWidth+"'":"";
                var rowCols=item2.colspan?'colspan="'+item2.colspan+'"':'';
                var rowspan=item2.rowspan?'rowspan="'+item2.rowspan+'"':'';
                var unresize=item2.unresize?'data-unresize="true"':'';
                v.push('<th data-field="'+field+'"'+minW+rowCols+rowspan +unresize+'>');
                v.push('<div class="layui-table-cell laytable-cell-'+function () {
                    var tem="";
                    if (item2.colspan > 1) {
                        tem='group';
                    }else{
                        tem=index+"-"+field;
                        if(item2.type !== "normal"){
                            tem+=" laytable-cell-"+item2.type;
                        }
                    }
                    return tem;
                }()+'">');
                if(!item2.isFilter||!item2.field){//不开启行内过滤或没有列名
                    v.push('');
                }else{
                    v.push('<input class="layui-input '+ ELEM_EDIT +'" id="filter_'+item2.field+'" name="filter_'+item2.field+'">');
                }
                v.push('</div></th>');

            });
        });
        v.push('</tr></thead></table>');
        v.push('</form>');
        return v.join('');
    };
    //找到对应的列元素
    Class.prototype.getColElem = function(parent, field){
        var that = this
            ,options = that.config;
        return parent.eq(0).find('.laytable-cell-'+ (options.index + '-' + field) + ':eq(0)');
    };
    //渲染表单
    Class.prototype.renderForm = function(type){
        form.render(type, 'LAY-table-'+ this.index);
    }
    /**
     * 设置排序参数
     * @param p
     */
    Class.prototype.sortSet=function (p) {
        var that = this;
        var sort=[];
        var cols=that.config.cols[0];
        cols.forEach(function (t) {
            if(t.sortType){
                var tem={
                   "field":t.field
                    ,"sort":t.sortType
                }
                sort.push(tem);
            }
        });
        p.sort=JSON.stringify(sort);
    }
    /**
     * 设置排序字段
     * @param th
     * @param type
     * @param pull
     * @param formEvent
     */
    Class.prototype.sort = function(th, type, pull, formEvent){
        var that = this
            ,field
            ,res = {}
            ,options = that.config
            ,filter = options.elem.attr('lay-filter')
            ,data = table.getDataList(that.key), thisData;
        //字段匹配
        if(typeof th === 'string'){
            that.layHeader.find('th').each(function(i, item){
                var othis = $(this)
                    ,_field = othis.data('field');
                if(_field === th){
                    th = othis;
                    field = _field;
                    return false;
                }
            });
        }
        try {
            var field = field || th.data('field');
            //如果欲执行的排序已在状态中，则不执行渲染
            if(that.sortKey && !pull){
                if(field === that.sortKey.field && type === that.sortKey.sort){
                    return;
                }
            }
            var elemSort = that.layHeader.find('th .laytable-cell-'+ options.index +'-'+ field).find(ELEM_SORT);
            //that.layHeader.find('th').find(ELEM_SORT).removeAttr('lay-sort'); //清除其它标题排序状态
            elemSort.attr('lay-sort', type || null);
            that.layFixed.find('th')
        } catch(e){
            return hint.error('Table modules: Did not match to field');
        }
       /* //记录排序索引和类型
        that.sortKey = {
            field: field
            ,sort: type
        };
        if(type === 'asc'){ //升序
        } else if(type === 'desc'){ //降序
            thisData = layui.sort(data, field, true);
        } else { //清除排序
            thisData = layui.sort(data, table.config.indexName);
        }
        */
        var cols=that.getCols(field);
        if(cols){
            cols.sortType=type
        }
    };
    //请求loading
    Class.prototype.loading = function(){
        var that = this
            ,options = that.config;
        if(options.loading && options.url){
            return layer.msg('数据请求中', {
                icon: 16
                ,offset: [
                    that.elem.offset().top + that.elem.height()/2 - 35 - _WIN.scrollTop() + 'px'
                    ,that.elem.offset().left + that.elem.width()/2 - 90 - _WIN.scrollLeft() + 'px'
                ]
                ,time: -1
                ,anim: -1
                ,fixed: false
            });
        }
    };
    //同步选中值状态
    Class.prototype.setCheckData = function(index, checked){
        var that = this
            ,options = that.config
            ,thisData = table.getDataList(that.key);
        if(!thisData[index]) return;
        if(thisData[index].constructor === Array) return;
        thisData[index][table.config.cols.isCheckName] = checked;
    };
    //同步全选按钮状态
    Class.prototype.syncCheckAll = function(){
            var that = this
                ,options = that.config;
            var list=table.getDataList(that.config.id);
            if(!list)return;
            var temis=true;//全选
            var checkNum=0;//选中的个数
            list.forEach(function (t) {
                if(!t[table.config.cols.cheDisabled]){
                    if(t[table.config.cols.isCheckName]){
                        var  checkAllElem = that.layBody.find('tr[data-index='+t[table.config.indexName]+']').find('input[name="'+TABLE_CHECKBOX_ID+'"]');
                        checkAllElem.prop('checked', true);
                        checkNum++;
                    }else{
                        temis=false;
                        var  checkAllElem = that.layBody.find('tr[data-index='+t[table.config.indexName]+']').find('input[name="'+TABLE_CHECKBOX_ID+'"]');
                        checkAllElem.prop('checked', false);
                    }
                }
            });
            if(temis){//设置全选
                var  checkAllElem = that.layHeader.find('input[name="'+TABLE_CHECKBOX_ID+'"]');
                checkAllElem.prop('checked', true);
            }
            if(checkNum<(list.length-options.cheDisabledNum)){
                var  checkAllElem = that.layHeader.find('input[name="'+TABLE_CHECKBOX_ID+'"]');
                checkAllElem.prop('checked', false);
            }
        // console.time("pullData");
        // console.timeEnd("pullData");
        that.renderForm('checkbox');
    };
    //获取cssRule
    Class.prototype.getCssRule = function(field, callback){
        var that = this
            ,style = that.elem.find('style')[0]
            ,sheet = style.sheet || style.styleSheet || {}
            ,rules = sheet.cssRules || sheet.rules;
        layui.each(rules, function(i, item){
            if(item.selectorText === ('.laytable-cell-'+ that.index +'-'+ field)){
                return callback(item), true;
            }
        });
    };

    Class.prototype.test = function(){
    }
    /**
     * 窗体变化自适应
     */
    Class.prototype.resize = function(){
        var that = this;
        //根据父窗体高度设置table的高度
        // 1、table自身顶级容器高度（layui-table-view）
        // 2、内容区域高度（layui-table-main）
        that.columnWidthInit();//列宽度计算
        that.tableHeight();//表格高度计算
        that.resizeHeight();//高度控制
        that.resizeWidth();//宽度控制
    };

    //动态分配列宽高
    Class.prototype.setArea = function(){
        var that = this;
        that.columnWidthInit();//列宽度计算
        that.tableHeight();//表格高度计算
    };
    /**
     * 列宽度计算
     */
    Class.prototype.columnWidthInit = function(){
        var that = this,
            options = that.config
            ,colNums = 0 //列个数
            ,autoColNums = 0 //自动列宽的列个数
            ,autoWidth = 0 //自动列分配的宽度
            ,countWidth = 0 //所有列总宽度和
            ,cntrWidth = options.width ||function(){ //获取容器宽度
                //如果父元素宽度为0（一般为隐藏元素），则继续查找上层元素，直到找到真实宽度为止
                var getWidth = function(parent){
                    var width, isNone;
                    parent = parent || options.elem.parent()
                    width = parent.width();
                    try {
                        isNone = parent.css('display') === 'none';
                    } catch(e){}
                    if(parent[0] && (!width || isNone)) return getWidth(parent.parent());
                    return width;
                };
                return getWidth();
            }()-17;
        //统计列个数
        that.eachCols(function(){
            colNums++;
        });
        //减去边框差
        cntrWidth = cntrWidth - function(){
            return (options.skin === 'line' || options.skin === 'nob') ? 2 : colNums + 1;
        }();

        //遍历所有列
        layui.each(options.cols, function(i1, item1){
            layui.each(item1, function(i2, item2){
                var width;
                if(!item2){
                    item1.splice(i2, 1);
                    return;
                }
                that.initOpts(item2);
                width = item2.width || 0;
                if(item2.colspan > 1) return;
                if(/\d+%$/.test(width)){
                    item2.width = width = Math.floor((parseFloat(width) / 100) * cntrWidth);
                } else if(item2._is_width_dev||!width){ //列宽未填写
                    item2._is_width_dev=true;//采用默认宽度的列
                    item2.width = width = 0;
                    autoColNums++;
                }
                countWidth = countWidth + width;
            });
        });
        that.autoColNums = autoColNums; //记录自动列数
        //如果未填充满，则将剩余宽度平分。否则，给未设定宽度的列赋值一个默认宽
        (cntrWidth > countWidth && autoColNums) && (
            autoWidth = (cntrWidth - countWidth) / autoColNums
        );
        layui.each(options.cols, function(i1, item1){
            layui.each(item1, function(i2, item2){
                var minWidth = item2.minWidth || options.cellMinWidth;
                if(item2.colspan > 1) return;
                if(item2.width === 0){
                    item2.width = Math.floor(autoWidth >= minWidth ? autoWidth : minWidth); //不能低于设定的最小宽度
                }
            });
        });
    };
    /**
     * 重新渲染宽度
     */
    Class.prototype.resizeWidth = function(){
        var that = this;
        that.renderTdCss();
    };
    /**
     * 表格高度计算
     */
    Class.prototype.tableHeight = function(){
        var that = this,
            options = that.config,
            optionsFirst = that.configFirst;
        //确定高度
        if(!table.kit.isNumber(optionsFirst.height)){//如果非固定高度，则计算高度
            var htremove=0;//减去的高度
            if(options.heightRemove&&table.kit.isArray(options.heightRemove)){
                var htatt=options.heightRemove;
                htatt.forEach(function (t) {
                    var temh=table.kit.isNumber(t)?t:$(t).outerHeight(true);
                    if(table.kit.isNumber(temh)){
                        htremove+=temh;
                    }
                });
            }
            //高度铺满：full-差距值
            var th=_WIN.height()-htremove-1;//that.getParentDivHeight(options.id);
            that.fullHeightGap=0;
            if(options.height){
                if(/^full-\d+$/.test(options.height)){
                    that.fullHeightGap = options.height.split('-')[1];
                }
            }
            options.height = th - that.fullHeightGap;
        }
    };
    /**
     * 重新渲染高度
     */
    Class.prototype.resizeHeight = function(){
        var that = this
            ,options = that.config
            ,height = options.height, bodyHeight;
        if(height < 135) height = 135;
        that.elem.css('height', height);
        //tbody区域高度
        // bodyHeight = parseFloat(height) - parseFloat(that.layHeader.height()) - 1;//原本代码
        var theader=options.isFilter?76:38;//没有行内过滤区域
        bodyHeight = parseFloat(height) - theader - 1;//###注意：现在写死表头固定高度为38px，即不支持多表头方式（在tab方式下无法获取正确的高度，待处理）
        if(options.toolbar){
            bodyHeight = bodyHeight - that.layTool.outerHeight();
        }
        if(options.isPage){
            bodyHeight = bodyHeight - that.layPage.outerHeight() - 1;
        }
        that.layMain.css('height', bodyHeight);
    };
    //获取滚动条宽度
    Class.prototype.getScrollWidth = function(elem){
        var width = 0;
        if(elem){
            width = elem.offsetWidth - elem.clientWidth;
        } else {
            elem = document.createElement('div');
            elem.style.width = '100px';
            elem.style.height = '100px';
            elem.style.overflowY = 'scroll';

            document.body.appendChild(elem);
            width = elem.offsetWidth - elem.clientWidth;
            document.body.removeChild(elem);
        }
        return width;
    };
    //滚动条补丁
    Class.prototype.scrollPatch = function(){
        var that = this
            ,layMainTable = that.layMain.children('table')
            ,scollWidth = that.layMain.width() - that.layMain.prop('clientWidth') //纵向滚动条宽度
            ,scollHeight = that.layMain.height() - that.layMain.prop('clientHeight') //横向滚动条高度
            ,getScrollWidth = that.getScrollWidth(that.layMain[0]) //获取主容器滚动条宽度，如果有的话
            ,outWidth = layMainTable.outerWidth() - that.layMain.width(); //表格内容器的超出宽度

        //如果存在自动列宽，则要保证绝对填充满，并且不能出现横向滚动条
        if(that.autoColNums && outWidth < 5 && !that.scrollPatchWStatus){
            var th = that.layHeader.eq(0).find('thead th:last-child')
                ,field = th.data('field');
            that.getCssRule(field, function(item){
                var width = item.style.width || th.outerWidth();
                item.style.width = (parseFloat(width) - getScrollWidth - outWidth) + 'px';
                //二次校验，如果仍然出现横向滚动条
                if(that.layMain.height() - that.layMain.prop('clientHeight') > 0){
                    item.style.width = parseFloat(item.style.width) - 1 + 'px';
                }
                that.scrollPatchWStatus = true;
            });
        }
        if(scollWidth && scollHeight){
            if(that.elem.find('.layui-table-patch').length<=0){
                var patchElem = $('<th class="layui-table-patch"><div class="layui-table-cell"></div></th>'); //补丁元素
                patchElem.find('div').css({
                    width: scollWidth
                });
                that.layHeader.eq(0).find('thead tr').append(patchElem);
                //that.layFilter.find('table thead tr').append(patchElem);
            }
        } else {
            that.layFilter.eq(0).find('.layui-table-patch').remove();
            that.layHeader.eq(0).find('.layui-table-patch').remove();
        }
        //固定列区域高度
        var mainHeight = that.layMain.height()
            ,fixHeight = mainHeight - scollHeight;
        that.layFixed.find(ELEM_BODY).css('height', layMainTable.height() > fixHeight ? fixHeight : 'auto');
        //表格宽度小于容器宽度时，隐藏固定列
        that.layFixRight[outWidth > 0 ? 'removeClass' : 'addClass'](HIDE);
        //操作栏
        that.layFixRight.css('right', scollWidth - 1);
    };
    //事件处理
    Class.prototype.events = function(){
        var that = this
            ,options = that.config
            ,_BODY = $('body')
            ,dict = {}
            ,th = that.layHeader.find('th')
            ,bodytr=that.layBody.find('tr')
            ,resizing;
        //行点击事件
        bodytr.unbind('click').on('click',function (e) {
            var index=$(this).attr("data-index");
            var list=table.getDataList(that.config.id);
            var o=list[index];
            typeof options.onClickRow === 'function' && options.onClickRow(index,o);
        });
        //行双击事件
        bodytr.unbind('dblclick').on('dblclick',function (e) {
            var index=$(this).attr("data-index");
            var list=table.getDataList(that.config.id);
            var o=list[index];
            typeof options.onDblClickRow === 'function' && options.onDblClickRow(index,o);
        });
        //拖拽调整宽度
        th.unbind('mousemove').on('mousemove', function(e){
            var othis = $(this)
                ,oLeft = othis.offset().left
                ,pLeft = e.clientX - oLeft;
            if(othis.attr('colspan') > 1 || othis.data('unresize') || dict.resizeStart){
                return;
            }
            dict.allowResize = othis.width() - pLeft <= 10; //是否处于拖拽允许区域
            _BODY.css('cursor', (dict.allowResize ? 'col-resize' : ''));
        })
        th.unbind('mouseleave').on('mouseleave', function(){
            var othis = $(this);
            if(dict.resizeStart) return;
            _BODY.css('cursor', '');
        })
        th.unbind('mousedown').on('mousedown', function(e){
            var othis = $(this);
            if(dict.allowResize){
                var field = othis.data('field');
                e.preventDefault();
                dict.resizeStart = true; //开始拖拽
                dict.offset = [e.clientX, e.clientY]; //记录初始坐标

                that.getCssRule(field, function(item){
                    var width = item.style.width || othis.outerWidth();
                    dict.rule = item;
                    dict.ruleWidth = parseFloat(width);
                    dict.minWidth = othis.data('minwidth') || options.cellMinWidth;
                });
            }
        });
        //拖拽中
        _DOC.unbind('mousemove').on('mousemove', function(e){
            if(dict.resizeStart){
                e.preventDefault();
                if(dict.rule){
                    var setWidth = dict.ruleWidth + e.clientX - dict.offset[0];
                    if(setWidth < dict.minWidth) setWidth = dict.minWidth;
                    dict.rule.style.width = setWidth + 'px';
                    layer.close(that.tipsIndex);
                }
                resizing = 1
            }
        })
        _DOC.unbind('mouseup').on('mouseup', function(e){
            if(dict.resizeStart){
                dict = {};
                _BODY.css('cursor', '');
                that.scrollPatch();
            }
            if(resizing === 2){
                resizing = null;
            }
        });
        //排序
        th.unbind('click').on('click', function(){//点击标题列
            var othis = $(this)
                ,elemSort = othis.find(ELEM_SORT)
                ,nowType = elemSort.attr('lay-sort')
                ,type;

            if(!elemSort[0] || resizing === 1) return resizing = 2;

            if(nowType === 'asc'){
                type = 'desc';
            } else if(nowType === 'desc'){
                type = null;
            } else {
                type = 'asc';
            }
            that.sort(othis, type, null, true);
            table.query(that.key);//从新查询
        })
        th.find(ELEM_SORT+' .layui-edge ').unbind('click').on('click', function(e){//点击小三角形
            var othis = $(this)
                ,index = othis.index()
                ,field = othis.parents('th').eq(0).data('field')
            layui.stope(e);
            if(index === 0){
                that.sort(field, 'asc', null, true);
            } else {
                that.sort(field, 'desc', null, true);
            }
            table.query(that.key);//从新查询
        });
        if(!that.eventsinitIsRun){
            that.eventsinit();
            that.eventsinitIsRun=true;
        }
        //同步滚动条
        that.layMain.unbind('scroll').on('scroll', function(){
            var othis = $(this)
                ,scrollLeft = othis.scrollLeft()
                ,scrollTop = othis.scrollTop();

            that.layHeader.scrollLeft(scrollLeft);
            that.layFilter.scrollLeft(scrollLeft);
            that.layFixed.find(ELEM_BODY).scrollTop(scrollTop);

            layer.close(that.tipsIndex);
        });
        _WIN.unbind('resize').on('resize', function(){ //自适应
            that.resize();
        });
    };
    //事件处理单元格编辑(只执行一次)
    Class.prototype.eventsinitIsRun=false;
    //只执行一次的事件
    Class.prototype.eventsinit = function(){
        var that = this
            ,options = that.config
            ,ELEM_CELL = '.layui-table-cell'
            ,filter = options.elem.attr('lay-filter');
        //行内过滤
        that.layFilter.on('keyup',"[name^='filter_']",function () {
            that.page=1;
            that.pullData(that.page, that.loading());
        });
        //行事件
        that.layBody.on('mouseenter','tr',function(){
            var othis = $(this)
                ,index = othis.index();
            that.layBody.find('tr:eq('+ index +')').addClass(ELEM_HOVER)
        })
        that.layBody.on('mouseleave','tr', function(){
            var othis = $(this)
                ,index = othis.index();
            that.layBody.find('tr:eq('+ index +')').removeClass(ELEM_HOVER)
        });
        //单元格事件
        that.layBody.on('click','td div.layui-table-cell p',function(){
            var othis = $(this).parent().parent()
                ,field = othis.data('field')
                ,editType = othis.data('edit')
                ,index = othis.parents('tr').eq(0).data('index')
                ,data = table.getDataList(that.key)[index]
                ,elemCell = othis.children(ELEM_CELL);
            var  options = that.config;
            layer.close(that.tipsIndex);
            if(othis.data('off')) return;

            //显示编辑表单
            if(editType){
                if(editType === 'select') { //选择框
                    var dropName=othis.data('drop');
                    var rowsField=dl.ui.table.drop.findFieldObj(options.cols[0],field);
                    var o=dl.cache.code.get(rowsField.drop);
                    var html='';
                    var scv=o.syscodevaluecache;
                    for(var i in scv){
                        var isSelected="";
                        if(scv[i].scv_value==data[field]){
                            isSelected="selected='selected'";
                        }
                        //选中
                        html+='<option '+isSelected+'  value="'+scv[i].scv_value+'">'+scv[i].scv_show_name+'</option>'
                    }
                    var select = $('<select class="'+ ELEM_EDIT +'" lay-ignore>' +
                        html+
                        '</select>');
                    othis.find('.'+ELEM_EDIT)[0] || othis.append(select);
                } else { //输入框
                    var input = $('<input class="layui-input '+ ELEM_EDIT +'">');
                    input[0].value = $.trim($(this).text());//  othis.data('content') || elemCell.text();
                    othis.find('.'+ELEM_EDIT)[0] || othis.append(input);
                    input.focus();
                }
                return;
            }

            //如果出现省略，则可查看更多
            var c=that.getCols(field);

            if(!table.config.initWidth[c["type"]]){
                if(elemCell.find('.layui-form-switch,.layui-form-checkbox')[0]) return; //限制不出现更多（暂时）
                if(Math.round(elemCell.prop('scrollWidth')) > Math.round(elemCell.outerWidth())){
                    that.tipsIndex = layer.tips([
                        '<div class="layui-table-tips-main" style="margin-top: -'+ (elemCell.height() + 16) +'px;'+ function(){
                            if(options.size === 'sm'){
                                return 'padding: 4px 15px; font-size: 12px;';
                            }
                            if(options.size === 'lg'){
                                return 'padding: 14px 15px;';
                            }
                            return '';
                        }() +'">'
                        ,elemCell.html()
                        ,'</div>'
                        ,'<i class="layui-icon layui-table-tips-c">&#x1006;</i>'
                    ].join(''), elemCell[0], {
                        tips: [3, '']
                        ,time: -1
                        ,anim: -1
                        ,maxWidth: (device.ios || device.android) ? 300 : 600
                        ,isOutAnim: false
                        ,skin: 'layui-table-tips'
                        ,success: function(layero, index){
                            layero.find('.layui-table-tips-c').on('click', function(){
                                layer.close(index);
                            });
                        }
                    });
                }
            }
        });
        that.layBody.on('change','.'+ELEM_EDIT, function(){
            var othis = $(this)
                ,value = this.value
                ,field = othis.parent().data('field')
                ,index = othis.parents('tr').eq(0).data('index')
                ,data = table.getDataList(that.key)[index];
            data[field] = value; //更新缓存中的值
            layui.event.call(this, MOD_NAME, 'edit('+ filter +')', {
                value: value
                ,data: data
                ,field: field
            });
        });
        that.layBody.on('blur','.'+ELEM_EDIT, function(){//单元格失去焦点
            var templet
                ,othis = $(this)
                ,field = othis.parent().data('field')
                ,index = othis.parents('tr').eq(0).data('index')
                ,editType = othis.parent().data('edit')
                ,data = table.getDataList(that.key)[index];
            var  options = that.config;
            that.eachCols(function(i, item){
                if(item.field == field && item.templet){
                    templet = item.templet;
                }
            });
            var value="";
            if(editType === 'select') { //选择框
                var rowsField=dl.ui.table.drop.findFieldObj(options.cols[0],field);
                if(rowsField&&rowsField['drop']){
                    var o=dl.cache.code.get(rowsField.drop);
                    value=dl.ui.table.drop.findDropLable(rowsField.drop,this.value);
                }
                othis.parent().find(ELEM_CELL+' p').html(
                    templet ? laytpl($(templet).html() || value).render(data) : value
                );
            } else {//输入框
                othis.parent().find(ELEM_CELL+' p').html(
                    templet ? laytpl($(templet).html() || this.value).render(data) : this.value
                );
            }
            othis.parent().data('content', this.value);
            othis.remove();
        });
        //树形节点点击事件（隐藏展开下级节点）
        that.elem.on('click','i.layui-tree-head', function(){
            var othis = $(this)
                ,index = othis.parents('tr').eq(0).data('index')
                ,options=that.config
                ,datas=table.getDataList(that.key);//数据
            var o=datas[index];
            that.treeNodeOpen(o,!o[table.config.cols.isOpen]);
            that.resize();
        });
        //复选框选择
        that.elem.on('click','input[name="'+TABLE_CHECKBOX_ID+'"]+', function(){
            var checkbox = $(this).prev()
                ,childs = that.layBody.find('input[name="'+TABLE_CHECKBOX_ID+'"]')
                ,index = checkbox.parents('tr').eq(0).data('index')
                ,checked = checkbox[0].checked
                ,obj=table.getDataList(that.config.id)[index]
                ,isAll = checkbox.attr('lay-filter') === 'layTableAllChoose';
            //全选
            if(isAll){
                var list=table.getDataList(that.key);
                list.forEach(function (temo) {
                    if(!temo[table.config.cols.cheDisabled]){//可以选择的才设置
                        that.setCheckData(temo[table.config.indexName], checked);
                    }
                });
            } else {
                that.setCheckData(index, checked);
                if(options.isTree){
                    //处理下级
                    var sonList=that.treeFindSonData(obj);
                    sonList.forEach(function (temo) {
                        if(!temo[table.config.cols.cheDisabled]){//可以选择的才设置
                            that.setCheckData(temo[table.config.indexName], checked);
                        }
                    });

                    //处理上级
                    var temf=function (o) {
                        if(o==null)return;
                        if(o&&o.children.length>0){
                            var temis=true;
                            o.children.forEach(function (temo) {
                                if(temo[table.config.cols.isCheckName]){
                                    temis=false;
                                }
                            });
                            if(checked||temis){
                                that.setCheckData(o[table.config.indexName], checked);
                            }
                            var temuo=that.treeFindUpData(o);
                            if(temuo){
                                temf(temuo);
                            }
                        }
                    }
                    var uo=that.treeFindUpData(obj);
                    temf(uo);
                }
            }
            that.syncCheckAll();
            layui.event.call(this, MOD_NAME, 'checkbox('+ filter +')', {
                checked: checked
                ,data: table.getDataList(that.key) ? (obj || {}) : {}
                ,type: isAll ? 'all' : 'one'
            });
            typeof options.onCheck === 'function' && options.onCheck(obj,checked,isAll);
        });

        //单选框选择
        that.elem.on('click','input[name="'+TABLE_RADIO_ID+'"]+', function(){
            var checkbox = $(this).prev()
                ,index = checkbox.parents('tr').eq(0).data('index')
                ,obj=table.getDataList(that.config.id)[index];
            typeof options.onRadio === 'function' && options.onRadio(obj);
        });

        //工具条操作事件
        that.layBody.on('click', '*[lay-event]',function(){
            var othis = $(this)
                ,index = othis.parents('tr').eq(0).data('index')
                ,tr = that.layBody.find('tr[data-index="'+ index +'"]')
                ,ELEM_CLICK = 'layui-table-click'
                ,list = table.getDataList(that.key)
                ,data = table.getDataList(that.key)[index];
            layui.event.call(this, MOD_NAME, 'tool('+ filter +')', {
                data: data//table.clearCacheKey(data)
                ,event: othis.attr('lay-event')
                ,tr: tr
                ,del: function(){
                    table.delRow(options.id,data);
                }
                ,update: function(fields){
                    fields = fields || {};
                    layui.each(fields, function(key, value){
                        if(key in data){
                            var templet, td = tr.children('td[data-field="'+ key +'"]');
                            data[key] = value;
                            that.eachCols(function(i, item2){
                                if(item2.field == key && item2.templet){
                                    templet = item2.templet;
                                }
                            });
                            td.children(ELEM_CELL).html(
                                templet ? laytpl($(templet).html() || value).render(data) : value
                            );
                            td.data('content', value);
                        }
                    });
                }
            });
            tr.addClass(ELEM_CLICK).siblings('tr').removeClass(ELEM_CLICK);
        });
    }
    //表格重载
    thisTable.config = {};
    //自动完成渲染
    table.init();
    // layui.link('treeGrid.css');
    exports(MOD_NAME, table);
});