
layui.define(['form', 'jquery'], function (exports) { //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
  var jQuery = layui.jquery,
      $ = jQuery,
      form = layui.form,
      _MOD = 'treeSelect',
      trss = {},
      TreeSelect = function () {
        this.v = '1.0.4';
      };



/*
 * JQuery zTree core v3.5.37
 * http://treejs.cn/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Licensed same as jquery - MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * email: hunter.z@263.net
 * Date: 2018-08-21
 */
(function(r){var J,K,L,M,N,O,v,t={},w={},x={},P={treeId:"",treeObj:null,view:{addDiyDom:null,autoCancelSelected:!0,dblClickExpand:!0,expandSpeed:"fast",fontCss:{},nameIsHTML:!1,selectedMulti:!0,showIcon:!0,showLine:!0,showTitle:!0,txtSelectedEnable:!1},data:{key:{isParent:"isParent",children:"children",name:"name",title:"",url:"url",icon:"icon"},simpleData:{enable:!1,idKey:"id",pIdKey:"pId",rootPId:null},keep:{parent:!1,leaf:!1}},async:{enable:!1,contentType:"application/x-www-form-urlencoded",type:"post",
dataType:"text",headers:{},xhrFields:{},url:"",autoParam:[],otherParam:[],dataFilter:null},callback:{beforeAsync:null,beforeClick:null,beforeDblClick:null,beforeRightClick:null,beforeMouseDown:null,beforeMouseUp:null,beforeExpand:null,beforeCollapse:null,beforeRemove:null,onAsyncError:null,onAsyncSuccess:null,onNodeCreated:null,onClick:null,onDblClick:null,onRightClick:null,onMouseDown:null,onMouseUp:null,onExpand:null,onCollapse:null,onRemove:null}},y=[function(a){var b=a.treeObj,c=g.event;b.bind(c.NODECREATED,
function(b,c,i){h.apply(a.callback.onNodeCreated,[b,c,i])});b.bind(c.CLICK,function(b,c,i,e,k){h.apply(a.callback.onClick,[c,i,e,k])});b.bind(c.EXPAND,function(b,c,i){h.apply(a.callback.onExpand,[b,c,i])});b.bind(c.COLLAPSE,function(b,c,i){h.apply(a.callback.onCollapse,[b,c,i])});b.bind(c.ASYNC_SUCCESS,function(b,c,i,e){h.apply(a.callback.onAsyncSuccess,[b,c,i,e])});b.bind(c.ASYNC_ERROR,function(b,c,i,e,k,g){h.apply(a.callback.onAsyncError,[b,c,i,e,k,g])});b.bind(c.REMOVE,function(b,c,i){h.apply(a.callback.onRemove,
[b,c,i])});b.bind(c.SELECTED,function(b,c,i){h.apply(a.callback.onSelected,[c,i])});b.bind(c.UNSELECTED,function(b,c,i){h.apply(a.callback.onUnSelected,[c,i])})}],z=[function(a){var b=g.event;a.treeObj.unbind(b.NODECREATED).unbind(b.CLICK).unbind(b.EXPAND).unbind(b.COLLAPSE).unbind(b.ASYNC_SUCCESS).unbind(b.ASYNC_ERROR).unbind(b.REMOVE).unbind(b.SELECTED).unbind(b.UNSELECTED)}],A=[function(a){var b=e.getCache(a);b||(b={},e.setCache(a,b));b.nodes=[];b.doms=[]}],B=[function(a,b,c,d,f,i){if(c){var m=
e.getRoot(a),k=e.nodeChildren(a,c);c.level=b;c.tId=a.treeId+"_"+ ++m.zId;c.parentTId=d?d.tId:null;c.open=typeof c.open=="string"?h.eqs(c.open,"true"):!!c.open;b=e.nodeIsParent(a,c);h.isArray(k)&&!(b===!1||typeof b=="string"&&h.eqs(b,"false"))?(e.nodeIsParent(a,c,!0),c.zAsync=!0):(b=e.nodeIsParent(a,c,b),c.open=b&&!a.async.enable?c.open:!1,c.zAsync=!b);c.isFirstNode=f;c.isLastNode=i;c.getParentNode=function(){return e.getNodeCache(a,c.parentTId)};c.getPreNode=function(){return e.getPreNode(a,c)};c.getNextNode=
function(){return e.getNextNode(a,c)};c.getIndex=function(){return e.getNodeIndex(a,c)};c.getPath=function(){return e.getNodePath(a,c)};c.isAjaxing=!1;e.fixPIdKeyValue(a,c)}}],u=[function(a){var b=a.target,c=e.getSetting(a.data.treeId),d="",f=null,i="",m="",k=null,j=null,o=null;if(h.eqs(a.type,"mousedown"))m="mousedown";else if(h.eqs(a.type,"mouseup"))m="mouseup";else if(h.eqs(a.type,"contextmenu"))m="contextmenu";else if(h.eqs(a.type,"click"))if(h.eqs(b.tagName,"span")&&b.getAttribute("treeNode"+
g.id.SWITCH)!==null)d=h.getNodeMainDom(b).id,i="switchNode";else{if(o=h.getMDom(c,b,[{tagName:"a",attrName:"treeNode"+g.id.A}]))d=h.getNodeMainDom(o).id,i="clickNode"}else if(h.eqs(a.type,"dblclick")&&(m="dblclick",o=h.getMDom(c,b,[{tagName:"a",attrName:"treeNode"+g.id.A}])))d=h.getNodeMainDom(o).id,i="switchNode";if(m.length>0&&d.length==0&&(o=h.getMDom(c,b,[{tagName:"a",attrName:"treeNode"+g.id.A}])))d=h.getNodeMainDom(o).id;if(d.length>0)switch(f=e.getNodeCache(c,d),i){case "switchNode":e.nodeIsParent(c,
f)?h.eqs(a.type,"click")||h.eqs(a.type,"dblclick")&&h.apply(c.view.dblClickExpand,[c.treeId,f],c.view.dblClickExpand)?k=J:i="":i="";break;case "clickNode":k=K}switch(m){case "mousedown":j=L;break;case "mouseup":j=M;break;case "dblclick":j=N;break;case "contextmenu":j=O}return{stop:!1,node:f,nodeEventType:i,nodeEventCallback:k,treeEventType:m,treeEventCallback:j}}],C=[function(a){var b=e.getRoot(a);b||(b={},e.setRoot(a,b));e.nodeChildren(a,b,[]);b.expandTriggerFlag=!1;b.curSelectedList=[];b.noSelection=
!0;b.createdNodes=[];b.zId=0;b._ver=(new Date).getTime()}],D=[],E=[],F=[],G=[],H=[],e={addNodeCache:function(a,b){e.getCache(a).nodes[e.getNodeCacheId(b.tId)]=b},getNodeCacheId:function(a){return a.substring(a.lastIndexOf("_")+1)},addAfterA:function(a){E.push(a)},addBeforeA:function(a){D.push(a)},addInnerAfterA:function(a){G.push(a)},addInnerBeforeA:function(a){F.push(a)},addInitBind:function(a){y.push(a)},addInitUnBind:function(a){z.push(a)},addInitCache:function(a){A.push(a)},addInitNode:function(a){B.push(a)},
addInitProxy:function(a,b){b?u.splice(0,0,a):u.push(a)},addInitRoot:function(a){C.push(a)},addNodesData:function(a,b,c,d){var f=e.nodeChildren(a,b);f?c>=f.length&&(c=-1):(f=e.nodeChildren(a,b,[]),c=-1);if(f.length>0&&c===0)f[0].isFirstNode=!1,j.setNodeLineIcos(a,f[0]);else if(f.length>0&&c<0)f[f.length-1].isLastNode=!1,j.setNodeLineIcos(a,f[f.length-1]);e.nodeIsParent(a,b,!0);c<0?e.nodeChildren(a,b,f.concat(d)):(a=[c,0].concat(d),f.splice.apply(f,a))},addSelectedNode:function(a,b){var c=e.getRoot(a);
e.isSelectedNode(a,b)||c.curSelectedList.push(b)},addCreatedNode:function(a,b){(a.callback.onNodeCreated||a.view.addDiyDom)&&e.getRoot(a).createdNodes.push(b)},addZTreeTools:function(a){H.push(a)},exSetting:function(a){r.extend(!0,P,a)},fixPIdKeyValue:function(a,b){a.data.simpleData.enable&&(b[a.data.simpleData.pIdKey]=b.parentTId?b.getParentNode()[a.data.simpleData.idKey]:a.data.simpleData.rootPId)},getAfterA:function(a,b,c){for(var d=0,e=E.length;d<e;d++)E[d].apply(this,arguments)},getBeforeA:function(a,
b,c){for(var d=0,e=D.length;d<e;d++)D[d].apply(this,arguments)},getInnerAfterA:function(a,b,c){for(var d=0,e=G.length;d<e;d++)G[d].apply(this,arguments)},getInnerBeforeA:function(a,b,c){for(var d=0,e=F.length;d<e;d++)F[d].apply(this,arguments)},getCache:function(a){return x[a.treeId]},getNodeIndex:function(a,b){if(!b)return null;for(var c=b.parentTId?b.getParentNode():e.getRoot(a),c=e.nodeChildren(a,c),d=0,f=c.length-1;d<=f;d++)if(c[d]===b)return d;return-1},getNextNode:function(a,b){if(!b)return null;
for(var c=b.parentTId?b.getParentNode():e.getRoot(a),c=e.nodeChildren(a,c),d=0,f=c.length-1;d<=f;d++)if(c[d]===b)return d==f?null:c[d+1];return null},getNodeByParam:function(a,b,c,d){if(!b||!c)return null;for(var f=0,i=b.length;f<i;f++){var m=b[f];if(m[c]==d)return b[f];m=e.nodeChildren(a,m);if(m=e.getNodeByParam(a,m,c,d))return m}return null},getNodeCache:function(a,b){if(!b)return null;var c=x[a.treeId].nodes[e.getNodeCacheId(b)];return c?c:null},getNodePath:function(a,b){if(!b)return null;var c;
(c=b.parentTId?b.getParentNode().getPath():[])&&c.push(b);return c},getNodes:function(a){return e.nodeChildren(a,e.getRoot(a))},getNodesByParam:function(a,b,c,d){if(!b||!c)return[];for(var f=[],i=0,m=b.length;i<m;i++){var k=b[i];k[c]==d&&f.push(k);k=e.nodeChildren(a,k);f=f.concat(e.getNodesByParam(a,k,c,d))}return f},getNodesByParamFuzzy:function(a,b,c,d){if(!b||!c)return[];for(var f=[],d=d.toLowerCase(),i=0,m=b.length;i<m;i++){var k=b[i];typeof k[c]=="string"&&b[i][c].toLowerCase().indexOf(d)>-1&&
f.push(k);k=e.nodeChildren(a,k);f=f.concat(e.getNodesByParamFuzzy(a,k,c,d))}return f},getNodesByFilter:function(a,b,c,d,f){if(!b)return d?null:[];for(var i=d?null:[],m=0,k=b.length;m<k;m++){var g=b[m];if(h.apply(c,[g,f],!1)){if(d)return g;i.push(g)}g=e.nodeChildren(a,g);g=e.getNodesByFilter(a,g,c,d,f);if(d&&g)return g;i=d?g:i.concat(g)}return i},getPreNode:function(a,b){if(!b)return null;for(var c=b.parentTId?b.getParentNode():e.getRoot(a),c=e.nodeChildren(a,c),d=0,f=c.length;d<f;d++)if(c[d]===b)return d==
0?null:c[d-1];return null},getRoot:function(a){return a?w[a.treeId]:null},getRoots:function(){return w},getSetting:function(a){return t[a]},getSettings:function(){return t},getZTreeTools:function(a){return(a=this.getRoot(this.getSetting(a)))?a.treeTools:null},initCache:function(a){for(var b=0,c=A.length;b<c;b++)A[b].apply(this,arguments)},initNode:function(a,b,c,d,e,i){for(var m=0,g=B.length;m<g;m++)B[m].apply(this,arguments)},initRoot:function(a){for(var b=0,c=C.length;b<c;b++)C[b].apply(this,arguments)},
isSelectedNode:function(a,b){for(var c=e.getRoot(a),d=0,f=c.curSelectedList.length;d<f;d++)if(b===c.curSelectedList[d])return!0;return!1},nodeChildren:function(a,b,c){if(!b)return null;a=a.data.key.children;typeof c!=="undefined"&&(b[a]=c);return b[a]},nodeIsParent:function(a,b,c){if(!b)return!1;a=a.data.key.isParent;typeof c!=="undefined"&&(typeof c==="string"&&(c=h.eqs(c,"true")),b[a]=!!c);return b[a]},nodeName:function(a,b,c){a=a.data.key.name;typeof c!=="undefined"&&(b[a]=c);return""+b[a]},nodeTitle:function(a,
b){return""+b[a.data.key.title===""?a.data.key.name:a.data.key.title]},removeNodeCache:function(a,b){var c=e.nodeChildren(a,b);if(c)for(var d=0,f=c.length;d<f;d++)e.removeNodeCache(a,c[d]);e.getCache(a).nodes[e.getNodeCacheId(b.tId)]=null},removeSelectedNode:function(a,b){for(var c=e.getRoot(a),d=0,f=c.curSelectedList.length;d<f;d++)if(b===c.curSelectedList[d]||!e.getNodeCache(a,c.curSelectedList[d].tId))c.curSelectedList.splice(d,1),a.treeObj.trigger(g.event.UNSELECTED,[a.treeId,b]),d--,f--},setCache:function(a,
b){x[a.treeId]=b},setRoot:function(a,b){w[a.treeId]=b},setZTreeTools:function(a,b){for(var c=0,d=H.length;c<d;c++)H[c].apply(this,arguments)},transformToArrayFormat:function(a,b){function c(b){d.push(b);(b=e.nodeChildren(a,b))&&(d=d.concat(e.transformToArrayFormat(a,b)))}if(!b)return[];var d=[];if(h.isArray(b))for(var f=0,i=b.length;f<i;f++)c(b[f]);else c(b);return d},transformTozTreeFormat:function(a,b){var c,d,f=a.data.simpleData.idKey,i=a.data.simpleData.pIdKey;if(!f||f==""||!b)return[];if(h.isArray(b)){var g=
[],k={};for(c=0,d=b.length;c<d;c++)k[b[c][f]]=b[c];for(c=0,d=b.length;c<d;c++){var j=k[b[c][i]];if(j&&b[c][f]!=b[c][i]){var o=e.nodeChildren(a,j);o||(o=e.nodeChildren(a,j,[]));o.push(b[c])}else g.push(b[c])}return g}else return[b]}},n={bindEvent:function(a){for(var b=0,c=y.length;b<c;b++)y[b].apply(this,arguments)},unbindEvent:function(a){for(var b=0,c=z.length;b<c;b++)z[b].apply(this,arguments)},bindTree:function(a){var b={treeId:a.treeId},c=a.treeObj;a.view.txtSelectedEnable||c.bind("selectstart",
v).css({"-moz-user-select":"-moz-none"});c.bind("click",b,n.proxy);c.bind("dblclick",b,n.proxy);c.bind("mouseover",b,n.proxy);c.bind("mouseout",b,n.proxy);c.bind("mousedown",b,n.proxy);c.bind("mouseup",b,n.proxy);c.bind("contextmenu",b,n.proxy)},unbindTree:function(a){a.treeObj.unbind("selectstart",v).unbind("click",n.proxy).unbind("dblclick",n.proxy).unbind("mouseover",n.proxy).unbind("mouseout",n.proxy).unbind("mousedown",n.proxy).unbind("mouseup",n.proxy).unbind("contextmenu",n.proxy)},doProxy:function(a){for(var b=
[],c=0,d=u.length;c<d;c++){var e=u[c].apply(this,arguments);b.push(e);if(e.stop)break}return b},proxy:function(a){var b=e.getSetting(a.data.treeId);if(!h.uCanDo(b,a))return!0;for(var b=n.doProxy(a),c=!0,d=0,f=b.length;d<f;d++){var i=b[d];i.nodeEventCallback&&(c=i.nodeEventCallback.apply(i,[a,i.node])&&c);i.treeEventCallback&&(c=i.treeEventCallback.apply(i,[a,i.node])&&c)}return c}};J=function(a,b){var c=e.getSetting(a.data.treeId);if(b.open){if(h.apply(c.callback.beforeCollapse,[c.treeId,b],!0)==
!1)return!0}else if(h.apply(c.callback.beforeExpand,[c.treeId,b],!0)==!1)return!0;e.getRoot(c).expandTriggerFlag=!0;j.switchNode(c,b);return!0};K=function(a,b){var c=e.getSetting(a.data.treeId),d=c.view.autoCancelSelected&&(a.ctrlKey||a.metaKey)&&e.isSelectedNode(c,b)?0:c.view.autoCancelSelected&&(a.ctrlKey||a.metaKey)&&c.view.selectedMulti?2:1;if(h.apply(c.callback.beforeClick,[c.treeId,b,d],!0)==!1)return!0;d===0?j.cancelPreSelectedNode(c,b):j.selectNode(c,b,d===2);c.treeObj.trigger(g.event.CLICK,
[a,c.treeId,b,d]);return!0};L=function(a,b){var c=e.getSetting(a.data.treeId);h.apply(c.callback.beforeMouseDown,[c.treeId,b],!0)&&h.apply(c.callback.onMouseDown,[a,c.treeId,b]);return!0};M=function(a,b){var c=e.getSetting(a.data.treeId);h.apply(c.callback.beforeMouseUp,[c.treeId,b],!0)&&h.apply(c.callback.onMouseUp,[a,c.treeId,b]);return!0};N=function(a,b){var c=e.getSetting(a.data.treeId);h.apply(c.callback.beforeDblClick,[c.treeId,b],!0)&&h.apply(c.callback.onDblClick,[a,c.treeId,b]);return!0};
O=function(a,b){var c=e.getSetting(a.data.treeId);h.apply(c.callback.beforeRightClick,[c.treeId,b],!0)&&h.apply(c.callback.onRightClick,[a,c.treeId,b]);return typeof c.callback.onRightClick!="function"};v=function(a){a=a.originalEvent.srcElement.nodeName.toLowerCase();return a==="input"||a==="textarea"};var h={apply:function(a,b,c){return typeof a=="function"?a.apply(Q,b?b:[]):c},canAsync:function(a,b){var c=e.nodeChildren(a,b),d=e.nodeIsParent(a,b);return a.async.enable&&b&&d&&!(b.zAsync||c&&c.length>
0)},clone:function(a){if(a===null)return null;var b=h.isArray(a)?[]:{},c;for(c in a)b[c]=a[c]instanceof Date?new Date(a[c].getTime()):typeof a[c]==="object"?h.clone(a[c]):a[c];return b},eqs:function(a,b){return a.toLowerCase()===b.toLowerCase()},isArray:function(a){return Object.prototype.toString.apply(a)==="[object Array]"},isElement:function(a){return typeof HTMLElement==="object"?a instanceof HTMLElement:a&&typeof a==="object"&&a!==null&&a.nodeType===1&&typeof a.nodeName==="string"},$:function(a,
b,c){b&&typeof b!="string"&&(c=b,b="");return typeof a=="string"?r(a,c?c.treeObj.get(0).ownerDocument:null):r("#"+a.tId+b,c?c.treeObj:null)},getMDom:function(a,b,c){if(!b)return null;for(;b&&b.id!==a.treeId;){for(var d=0,e=c.length;b.tagName&&d<e;d++)if(h.eqs(b.tagName,c[d].tagName)&&b.getAttribute(c[d].attrName)!==null)return b;b=b.parentNode}return null},getNodeMainDom:function(a){return r(a).parent("li").get(0)||r(a).parentsUntil("li").parent().get(0)},isChildOrSelf:function(a,b){return r(a).closest("#"+
b).length>0},uCanDo:function(){return!0}},j={addNodes:function(a,b,c,d,f){var i=e.nodeIsParent(a,b);if(!a.data.keep.leaf||!b||i)if(h.isArray(d)||(d=[d]),a.data.simpleData.enable&&(d=e.transformTozTreeFormat(a,d)),b){var i=l(b,g.id.SWITCH,a),m=l(b,g.id.ICON,a),k=l(b,g.id.UL,a);if(!b.open)j.replaceSwitchClass(b,i,g.folder.CLOSE),j.replaceIcoClass(b,m,g.folder.CLOSE),b.open=!1,k.css({display:"none"});e.addNodesData(a,b,c,d);j.createNodes(a,b.level+1,d,b,c);f||j.expandCollapseParentNode(a,b,!0)}else e.addNodesData(a,
e.getRoot(a),c,d),j.createNodes(a,0,d,null,c)},appendNodes:function(a,b,c,d,f,i,g){if(!c)return[];var k=[],h=d?d:e.getRoot(a),h=e.nodeChildren(a,h),o,l;if(!h||f>=h.length-c.length)f=-1;for(var s=0,n=c.length;s<n;s++){var p=c[s];i&&(o=(f===0||h.length==c.length)&&s==0,l=f<0&&s==c.length-1,e.initNode(a,b,p,d,o,l,g),e.addNodeCache(a,p));o=e.nodeIsParent(a,p);l=[];var I=e.nodeChildren(a,p);I&&I.length>0&&(l=j.appendNodes(a,b+1,I,p,-1,i,g&&p.open));g&&(j.makeDOMNodeMainBefore(k,a,p),j.makeDOMNodeLine(k,
a,p),e.getBeforeA(a,p,k),j.makeDOMNodeNameBefore(k,a,p),e.getInnerBeforeA(a,p,k),j.makeDOMNodeIcon(k,a,p),e.getInnerAfterA(a,p,k),j.makeDOMNodeNameAfter(k,a,p),e.getAfterA(a,p,k),o&&p.open&&j.makeUlHtml(a,p,k,l.join("")),j.makeDOMNodeMainAfter(k,a,p),e.addCreatedNode(a,p))}return k},appendParentULDom:function(a,b){var c=[],d=l(b,a);!d.get(0)&&b.parentTId&&(j.appendParentULDom(a,b.getParentNode()),d=l(b,a));var f=l(b,g.id.UL,a);f.get(0)&&f.remove();f=e.nodeChildren(a,b);f=j.appendNodes(a,b.level+1,
f,b,-1,!1,!0);j.makeUlHtml(a,b,c,f.join(""));d.append(c.join(""))},asyncNode:function(a,b,c,d){var f,i;f=e.nodeIsParent(a,b);if(b&&!f)return h.apply(d),!1;else if(b&&b.isAjaxing)return!1;else if(h.apply(a.callback.beforeAsync,[a.treeId,b],!0)==!1)return h.apply(d),!1;if(b)b.isAjaxing=!0,l(b,g.id.ICON,a).attr({style:"","class":g.className.BUTTON+" "+g.className.ICO_LOADING});var m={},k=h.apply(a.async.autoParam,[a.treeId,b],a.async.autoParam);for(f=0,i=k.length;b&&f<i;f++){var q=k[f].split("="),o=
q;q.length>1&&(o=q[1],q=q[0]);m[o]=b[q]}k=h.apply(a.async.otherParam,[a.treeId,b],a.async.otherParam);if(h.isArray(k))for(f=0,i=k.length;f<i;f+=2)m[k[f]]=k[f+1];else for(var n in k)m[n]=k[n];var s=e.getRoot(a)._ver;r.ajax({contentType:a.async.contentType,cache:!1,type:a.async.type,url:h.apply(a.async.url,[a.treeId,b],a.async.url),data:a.async.contentType.indexOf("application/json")>-1?JSON.stringify(m):m,dataType:a.async.dataType,headers:a.async.headers,xhrFields:a.async.xhrFields,success:function(i){if(s==
e.getRoot(a)._ver){var f=[];try{f=!i||i.length==0?[]:typeof i=="string"?eval("("+i+")"):i}catch(k){f=i}if(b)b.isAjaxing=null,b.zAsync=!0;j.setNodeLineIcos(a,b);f&&f!==""?(f=h.apply(a.async.dataFilter,[a.treeId,b,f],f),j.addNodes(a,b,-1,f?h.clone(f):[],!!c)):j.addNodes(a,b,-1,[],!!c);a.treeObj.trigger(g.event.ASYNC_SUCCESS,[a.treeId,b,i]);h.apply(d)}},error:function(c,d,i){if(s==e.getRoot(a)._ver){if(b)b.isAjaxing=null;j.setNodeLineIcos(a,b);a.treeObj.trigger(g.event.ASYNC_ERROR,[a.treeId,b,c,d,i])}}});
return!0},cancelPreSelectedNode:function(a,b,c){var d=e.getRoot(a).curSelectedList,f,i;for(f=d.length-1;f>=0;f--)if(i=d[f],b===i||!b&&(!c||c!==i))if(l(i,g.id.A,a).removeClass(g.node.CURSELECTED),b){e.removeSelectedNode(a,b);break}else d.splice(f,1),a.treeObj.trigger(g.event.UNSELECTED,[a.treeId,i])},createNodeCallback:function(a){if(a.callback.onNodeCreated||a.view.addDiyDom)for(var b=e.getRoot(a);b.createdNodes.length>0;){var c=b.createdNodes.shift();h.apply(a.view.addDiyDom,[a.treeId,c]);a.callback.onNodeCreated&&
a.treeObj.trigger(g.event.NODECREATED,[a.treeId,c])}},createNodes:function(a,b,c,d,f){if(c&&c.length!=0){var i=e.getRoot(a),m=!d||d.open||!!l(e.nodeChildren(a,d)[0],a).get(0);i.createdNodes=[];var b=j.appendNodes(a,b,c,d,f,!0,m),k,h;d?(d=l(d,g.id.UL,a),d.get(0)&&(k=d)):k=a.treeObj;k&&(f>=0&&(h=k.children()[f]),f>=0&&h?r(h).before(b.join("")):k.append(b.join("")));j.createNodeCallback(a)}},destroy:function(a){a&&(e.initCache(a),e.initRoot(a),n.unbindTree(a),n.unbindEvent(a),a.treeObj.empty(),delete t[a.treeId])},
expandCollapseNode:function(a,b,c,d,f){var i=e.getRoot(a),m;if(b){var k=e.nodeChildren(a,b),q=e.nodeIsParent(a,b);if(i.expandTriggerFlag)m=f,f=function(){m&&m();b.open?a.treeObj.trigger(g.event.EXPAND,[a.treeId,b]):a.treeObj.trigger(g.event.COLLAPSE,[a.treeId,b])},i.expandTriggerFlag=!1;if(!b.open&&q&&(!l(b,g.id.UL,a).get(0)||k&&k.length>0&&!l(k[0],a).get(0)))j.appendParentULDom(a,b),j.createNodeCallback(a);if(b.open==c)h.apply(f,[]);else{var c=l(b,g.id.UL,a),i=l(b,g.id.SWITCH,a),o=l(b,g.id.ICON,
a);q?(b.open=!b.open,b.iconOpen&&b.iconClose&&o.attr("style",j.makeNodeIcoStyle(a,b)),b.open?(j.replaceSwitchClass(b,i,g.folder.OPEN),j.replaceIcoClass(b,o,g.folder.OPEN),d==!1||a.view.expandSpeed==""?(c.show(),h.apply(f,[])):k&&k.length>0?c.slideDown(a.view.expandSpeed,f):(c.show(),h.apply(f,[]))):(j.replaceSwitchClass(b,i,g.folder.CLOSE),j.replaceIcoClass(b,o,g.folder.CLOSE),d==!1||a.view.expandSpeed==""||!(k&&k.length>0)?(c.hide(),h.apply(f,[])):c.slideUp(a.view.expandSpeed,f))):h.apply(f,[])}}else h.apply(f,
[])},expandCollapseParentNode:function(a,b,c,d,e){b&&(b.parentTId?(j.expandCollapseNode(a,b,c,d),b.parentTId&&j.expandCollapseParentNode(a,b.getParentNode(),c,d,e)):j.expandCollapseNode(a,b,c,d,e))},expandCollapseSonNode:function(a,b,c,d,f){var i=e.getRoot(a),i=b?e.nodeChildren(a,b):e.nodeChildren(a,i),g=b?!1:d,k=e.getRoot(a).expandTriggerFlag;e.getRoot(a).expandTriggerFlag=!1;if(i)for(var h=0,l=i.length;h<l;h++)i[h]&&j.expandCollapseSonNode(a,i[h],c,g);e.getRoot(a).expandTriggerFlag=k;j.expandCollapseNode(a,
b,c,d,f)},isSelectedNode:function(a,b){if(!b)return!1;var c=e.getRoot(a).curSelectedList,d;for(d=c.length-1;d>=0;d--)if(b===c[d])return!0;return!1},makeDOMNodeIcon:function(a,b,c){var d=e.nodeName(b,c),d=b.view.nameIsHTML?d:d.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");a.push("<span id='",c.tId,g.id.ICON,"' title='' treeNode",g.id.ICON," class='",j.makeNodeIcoClass(b,c),"' style='",j.makeNodeIcoStyle(b,c),"'></span><span id='",c.tId,g.id.SPAN,"' class='",g.className.NAME,"'>",
d,"</span>")},makeDOMNodeLine:function(a,b,c){a.push("<span id='",c.tId,g.id.SWITCH,"' title='' class='",j.makeNodeLineClass(b,c),"' treeNode",g.id.SWITCH,"></span>")},makeDOMNodeMainAfter:function(a){a.push("</li>")},makeDOMNodeMainBefore:function(a,b,c){a.push("<li id='",c.tId,"' class='",g.className.LEVEL,c.level,"' tabindex='0' hidefocus='true' treenode>")},makeDOMNodeNameAfter:function(a){a.push("</a>")},makeDOMNodeNameBefore:function(a,b,c){var d=e.nodeTitle(b,c),f=j.makeNodeUrl(b,c),i=j.makeNodeFontCss(b,
c),m=[],k;for(k in i)m.push(k,":",i[k],";");a.push("<a id='",c.tId,g.id.A,"' class='",g.className.LEVEL,c.level,"' treeNode",g.id.A,' onclick="',c.click||"",'" ',f!=null&&f.length>0?"href='"+f+"'":""," target='",j.makeNodeTarget(c),"' style='",m.join(""),"'");h.apply(b.view.showTitle,[b.treeId,c],b.view.showTitle)&&d&&a.push("title='",d.replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),"'");a.push(">")},makeNodeFontCss:function(a,b){var c=h.apply(a.view.fontCss,[a.treeId,b],a.view.fontCss);
return c&&typeof c!="function"?c:{}},makeNodeIcoClass:function(a,b){var c=["ico"];if(!b.isAjaxing){var d=e.nodeIsParent(a,b);c[0]=(b.iconSkin?b.iconSkin+"_":"")+c[0];d?c.push(b.open?g.folder.OPEN:g.folder.CLOSE):c.push(g.folder.DOCU)}return g.className.BUTTON+" "+c.join("_")},makeNodeIcoStyle:function(a,b){var c=[];if(!b.isAjaxing){var d=e.nodeIsParent(a,b)&&b.iconOpen&&b.iconClose?b.open?b.iconOpen:b.iconClose:b[a.data.key.icon];d&&c.push("background:url(",d,") 0 0 no-repeat;");(a.view.showIcon==
!1||!h.apply(a.view.showIcon,[a.treeId,b],!0))&&c.push("width:0px;height:0px;")}return c.join("")},makeNodeLineClass:function(a,b){var c=[];a.view.showLine?b.level==0&&b.isFirstNode&&b.isLastNode?c.push(g.line.ROOT):b.level==0&&b.isFirstNode?c.push(g.line.ROOTS):b.isLastNode?c.push(g.line.BOTTOM):c.push(g.line.CENTER):c.push(g.line.NOLINE);e.nodeIsParent(a,b)?c.push(b.open?g.folder.OPEN:g.folder.CLOSE):c.push(g.folder.DOCU);return j.makeNodeLineClassEx(b)+c.join("_")},makeNodeLineClassEx:function(a){return g.className.BUTTON+
" "+g.className.LEVEL+a.level+" "+g.className.SWITCH+" "},makeNodeTarget:function(a){return a.target||"_blank"},makeNodeUrl:function(a,b){var c=a.data.key.url;return b[c]?b[c]:null},makeUlHtml:function(a,b,c,d){c.push("<ul id='",b.tId,g.id.UL,"' class='",g.className.LEVEL,b.level," ",j.makeUlLineClass(a,b),"' style='display:",b.open?"block":"none","'>");c.push(d);c.push("</ul>")},makeUlLineClass:function(a,b){return a.view.showLine&&!b.isLastNode?g.line.LINE:""},removeChildNodes:function(a,b){if(b){var c=
e.nodeChildren(a,b);if(c){for(var d=0,f=c.length;d<f;d++)e.removeNodeCache(a,c[d]);e.removeSelectedNode(a);delete b[a.data.key.children];a.data.keep.parent?l(b,g.id.UL,a).empty():(e.nodeIsParent(a,b,!1),b.open=!1,c=l(b,g.id.SWITCH,a),d=l(b,g.id.ICON,a),j.replaceSwitchClass(b,c,g.folder.DOCU),j.replaceIcoClass(b,d,g.folder.DOCU),l(b,g.id.UL,a).remove())}}},scrollIntoView:function(a,b){if(b)if(typeof Element==="undefined"){var c=a.treeObj.get(0).getBoundingClientRect(),d=b.getBoundingClientRect();(d.top<
c.top||d.bottom>c.bottom||d.right>c.right||d.left<c.left)&&b.scrollIntoView()}else{if(!Element.prototype.scrollIntoViewIfNeeded)Element.prototype.scrollIntoViewIfNeeded=function(a){function b(a,c){return{start:a,length:c,end:a+c}}function c(b,d){return!1===a||d.start<b.end&&b.start<d.end?Math.max(b.end-d.length,Math.min(d.start,b.start)):(b.start+b.end-d.length)/2}function d(a,b){return{x:a,y:b,translate:function(c,i){return d(a+c,b+i)}}}function e(a,b){for(;a;)b=b.translate(a.offsetLeft,a.offsetTop),
a=a.offsetParent;return b}for(var g=e(this,d(0,0)),j=d(this.offsetWidth,this.offsetHeight),h=this.parentNode,l;h instanceof HTMLElement;)l=e(h,d(h.clientLeft,h.clientTop)),h.scrollLeft=c(b(g.x-l.x,j.x),b(h.scrollLeft,h.clientWidth)),h.scrollTop=c(b(g.y-l.y,j.y),b(h.scrollTop,h.clientHeight)),g=g.translate(-h.scrollLeft,-h.scrollTop),h=h.parentNode};b.scrollIntoViewIfNeeded()}},setFirstNode:function(a,b){var c=e.nodeChildren(a,b);if(c.length>0)c[0].isFirstNode=!0},setLastNode:function(a,b){var c=e.nodeChildren(a,
b);if(c.length>0)c[c.length-1].isLastNode=!0},removeNode:function(a,b){var c=e.getRoot(a),d=b.parentTId?b.getParentNode():c;b.isFirstNode=!1;b.isLastNode=!1;b.getPreNode=function(){return null};b.getNextNode=function(){return null};if(e.getNodeCache(a,b.tId)){l(b,a).remove();e.removeNodeCache(a,b);e.removeSelectedNode(a,b);for(var f=e.nodeChildren(a,d),i=0,h=f.length;i<h;i++)if(f[i].tId==b.tId){f.splice(i,1);break}j.setFirstNode(a,d);j.setLastNode(a,d);var k,i=f.length;if(!a.data.keep.parent&&i==
0)e.nodeIsParent(a,d,!1),d.open=!1,delete d[a.data.key.children],i=l(d,g.id.UL,a),h=l(d,g.id.SWITCH,a),k=l(d,g.id.ICON,a),j.replaceSwitchClass(d,h,g.folder.DOCU),j.replaceIcoClass(d,k,g.folder.DOCU),i.css("display","none");else if(a.view.showLine&&i>0){var q=f[i-1],i=l(q,g.id.UL,a),h=l(q,g.id.SWITCH,a);k=l(q,g.id.ICON,a);d==c?f.length==1?j.replaceSwitchClass(q,h,g.line.ROOT):(c=l(f[0],g.id.SWITCH,a),j.replaceSwitchClass(f[0],c,g.line.ROOTS),j.replaceSwitchClass(q,h,g.line.BOTTOM)):j.replaceSwitchClass(q,
h,g.line.BOTTOM);i.removeClass(g.line.LINE)}}},replaceIcoClass:function(a,b,c){if(b&&!a.isAjaxing&&(a=b.attr("class"),a!=void 0)){a=a.split("_");switch(c){case g.folder.OPEN:case g.folder.CLOSE:case g.folder.DOCU:a[a.length-1]=c}b.attr("class",a.join("_"))}},replaceSwitchClass:function(a,b,c){if(b){var d=b.attr("class");if(d!=void 0){d=d.split("_");switch(c){case g.line.ROOT:case g.line.ROOTS:case g.line.CENTER:case g.line.BOTTOM:case g.line.NOLINE:d[0]=j.makeNodeLineClassEx(a)+c;break;case g.folder.OPEN:case g.folder.CLOSE:case g.folder.DOCU:d[1]=
c}b.attr("class",d.join("_"));c!==g.folder.DOCU?b.removeAttr("disabled"):b.attr("disabled","disabled")}}},selectNode:function(a,b,c){c||j.cancelPreSelectedNode(a,null,b);l(b,g.id.A,a).addClass(g.node.CURSELECTED);e.addSelectedNode(a,b);a.treeObj.trigger(g.event.SELECTED,[a.treeId,b])},setNodeFontCss:function(a,b){var c=l(b,g.id.A,a),d=j.makeNodeFontCss(a,b);d&&c.css(d)},setNodeLineIcos:function(a,b){if(b){var c=l(b,g.id.SWITCH,a),d=l(b,g.id.UL,a),f=l(b,g.id.ICON,a),i=j.makeUlLineClass(a,b);i.length==
0?d.removeClass(g.line.LINE):d.addClass(i);c.attr("class",j.makeNodeLineClass(a,b));e.nodeIsParent(a,b)?c.removeAttr("disabled"):c.attr("disabled","disabled");f.removeAttr("style");f.attr("style",j.makeNodeIcoStyle(a,b));f.attr("class",j.makeNodeIcoClass(a,b))}},setNodeName:function(a,b){var c=e.nodeTitle(a,b),d=l(b,g.id.SPAN,a);d.empty();a.view.nameIsHTML?d.html(e.nodeName(a,b)):d.text(e.nodeName(a,b));h.apply(a.view.showTitle,[a.treeId,b],a.view.showTitle)&&l(b,g.id.A,a).attr("title",!c?"":c)},
setNodeTarget:function(a,b){l(b,g.id.A,a).attr("target",j.makeNodeTarget(b))},setNodeUrl:function(a,b){var c=l(b,g.id.A,a),d=j.makeNodeUrl(a,b);d==null||d.length==0?c.removeAttr("href"):c.attr("href",d)},switchNode:function(a,b){b.open||!h.canAsync(a,b)?j.expandCollapseNode(a,b,!b.open):a.async.enable?j.asyncNode(a,b)||j.expandCollapseNode(a,b,!b.open):b&&j.expandCollapseNode(a,b,!b.open)}};r.fn.zTree={consts:{className:{BUTTON:"button",LEVEL:"level",ICO_LOADING:"ico_loading",SWITCH:"switch",NAME:"node_name"},
event:{NODECREATED:"ztree_nodeCreated",CLICK:"ztree_click",EXPAND:"ztree_expand",COLLAPSE:"ztree_collapse",ASYNC_SUCCESS:"ztree_async_success",ASYNC_ERROR:"ztree_async_error",REMOVE:"ztree_remove",SELECTED:"ztree_selected",UNSELECTED:"ztree_unselected"},id:{A:"_a",ICON:"_ico",SPAN:"_span",SWITCH:"_switch",UL:"_ul"},line:{ROOT:"root",ROOTS:"roots",CENTER:"center",BOTTOM:"bottom",NOLINE:"noline",LINE:"line"},folder:{OPEN:"open",CLOSE:"close",DOCU:"docu"},node:{CURSELECTED:"curSelectedNode"}},_z:{tools:h,
view:j,event:n,data:e},getZTreeObj:function(a){return(a=e.getZTreeTools(a))?a:null},destroy:function(a){if(a&&a.length>0)j.destroy(e.getSetting(a));else for(var b in t)j.destroy(t[b])},init:function(a,b,c){var d=h.clone(P);r.extend(!0,d,b);d.treeId=a.attr("id");d.treeObj=a;d.treeObj.empty();t[d.treeId]=d;if(typeof document.body.style.maxHeight==="undefined")d.view.expandSpeed="";e.initRoot(d);a=e.getRoot(d);c=c?h.clone(h.isArray(c)?c:[c]):[];d.data.simpleData.enable?e.nodeChildren(d,a,e.transformTozTreeFormat(d,
c)):e.nodeChildren(d,a,c);e.initCache(d);n.unbindTree(d);n.bindTree(d);n.unbindEvent(d);n.bindEvent(d);var f={setting:d,addNodes:function(a,b,c,f){function g(){j.addNodes(d,a,b,n,f==!0)}a||(a=null);var l=e.nodeIsParent(d,a);if(a&&!l&&d.data.keep.leaf)return null;l=parseInt(b,10);isNaN(l)?(f=!!c,c=b,b=-1):b=l;if(!c)return null;var n=h.clone(h.isArray(c)?c:[c]);h.canAsync(d,a)?j.asyncNode(d,a,f,g):g();return n},cancelSelectedNode:function(a){j.cancelPreSelectedNode(d,a)},destroy:function(){j.destroy(d)},
expandAll:function(a){a=!!a;j.expandCollapseSonNode(d,null,a,!0);return a},expandNode:function(a,b,c,f,g){function n(){var b=l(a,d).get(0);b&&f!==!1&&j.scrollIntoView(d,b)}if(!a||!e.nodeIsParent(d,a))return null;b!==!0&&b!==!1&&(b=!a.open);if((g=!!g)&&b&&h.apply(d.callback.beforeExpand,[d.treeId,a],!0)==!1)return null;else if(g&&!b&&h.apply(d.callback.beforeCollapse,[d.treeId,a],!0)==!1)return null;b&&a.parentTId&&j.expandCollapseParentNode(d,a.getParentNode(),b,!1);if(b===a.open&&!c)return null;
e.getRoot(d).expandTriggerFlag=g;!h.canAsync(d,a)&&c?j.expandCollapseSonNode(d,a,b,!0,n):(a.open=!b,j.switchNode(this.setting,a),n());return b},getNodes:function(){return e.getNodes(d)},getNodeByParam:function(a,b,c){return!a?null:e.getNodeByParam(d,c?e.nodeChildren(d,c):e.getNodes(d),a,b)},getNodeByTId:function(a){return e.getNodeCache(d,a)},getNodesByParam:function(a,b,c){return!a?null:e.getNodesByParam(d,c?e.nodeChildren(d,c):e.getNodes(d),a,b)},getNodesByParamFuzzy:function(a,b,c){return!a?null:
e.getNodesByParamFuzzy(d,c?e.nodeChildren(d,c):e.getNodes(d),a,b)},getNodesByFilter:function(a,b,c,f){b=!!b;return!a||typeof a!="function"?b?null:[]:e.getNodesByFilter(d,c?e.nodeChildren(d,c):e.getNodes(d),a,b,f)},getNodeIndex:function(a){if(!a)return null;for(var b=a.parentTId?a.getParentNode():e.getRoot(d),b=e.nodeChildren(d,b),c=0,f=b.length;c<f;c++)if(b[c]==a)return c;return-1},getSelectedNodes:function(){for(var a=[],b=e.getRoot(d).curSelectedList,c=0,f=b.length;c<f;c++)a.push(b[c]);return a},
isSelectedNode:function(a){return e.isSelectedNode(d,a)},reAsyncChildNodesPromise:function(a,b,c){return new Promise(function(d,e){try{f.reAsyncChildNodes(a,b,c,function(){d(a)})}catch(g){e(g)}})},reAsyncChildNodes:function(a,b,c,f){if(this.setting.async.enable){var h=!a;h&&(a=e.getRoot(d));if(b=="refresh"){for(var b=e.nodeChildren(d,a),n=0,r=b?b.length:0;n<r;n++)e.removeNodeCache(d,b[n]);e.removeSelectedNode(d);e.nodeChildren(d,a,[]);h?this.setting.treeObj.empty():l(a,g.id.UL,d).empty()}j.asyncNode(this.setting,
h?null:a,!!c,f)}},refresh:function(){this.setting.treeObj.empty();var a=e.getRoot(d),b=e.nodeChildren(d,a);e.initRoot(d);e.nodeChildren(d,a,b);e.initCache(d);j.createNodes(d,0,e.nodeChildren(d,a),null,-1)},removeChildNodes:function(a){if(!a)return null;var b=e.nodeChildren(d,a);j.removeChildNodes(d,a);return b?b:null},removeNode:function(a,b){a&&(b=!!b,b&&h.apply(d.callback.beforeRemove,[d.treeId,a],!0)==!1||(j.removeNode(d,a),b&&this.setting.treeObj.trigger(g.event.REMOVE,[d.treeId,a])))},selectNode:function(a,
b,c){function e(){if(!c){var b=l(a,d).get(0);j.scrollIntoView(d,b)}}if(a&&h.uCanDo(d)){b=d.view.selectedMulti&&b;if(a.parentTId)j.expandCollapseParentNode(d,a.getParentNode(),!0,!1,e);else if(!c)try{l(a,d).focus().blur()}catch(f){}j.selectNode(d,a,b)}},transformTozTreeNodes:function(a){return e.transformTozTreeFormat(d,a)},transformToArray:function(a){return e.transformToArrayFormat(d,a)},updateNode:function(a){a&&l(a,d).get(0)&&h.uCanDo(d)&&(j.setNodeName(d,a),j.setNodeTarget(d,a),j.setNodeUrl(d,
a),j.setNodeLineIcos(d,a),j.setNodeFontCss(d,a))}};a.treeTools=f;e.setZTreeTools(d,f);(c=e.nodeChildren(d,a))&&c.length>0?j.createNodes(d,0,c,null,-1):d.async.enable&&d.async.url&&d.async.url!==""&&j.asyncNode(d);return f}};var Q=r.fn.zTree,l=h.$,g=Q.consts})(jQuery);

/*
 * JQuery zTree excheck v3.5.37
 * http://treejs.cn/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Licensed same as jquery - MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * email: hunter.z@263.net
 * Date: 2018-08-21
 */
(function(n){var q,r,s,p={event:{CHECK:"ztree_check"},id:{CHECK:"_check"},checkbox:{STYLE:"checkbox",DEFAULT:"chk",DISABLED:"disable",FALSE:"false",TRUE:"true",FULL:"full",PART:"part",FOCUS:"focus"},radio:{STYLE:"radio",TYPE_ALL:"all",TYPE_LEVEL:"level"}},w={check:{enable:!1,autoCheckTrigger:!1,chkStyle:p.checkbox.STYLE,nocheckInherit:!1,chkDisabledInherit:!1,radioType:p.radio.TYPE_LEVEL,chkboxType:{Y:"ps",N:"ps"}},data:{key:{checked:"checked"}},callback:{beforeCheck:null,onCheck:null}};q=function(c,
a){if(a.chkDisabled===!0)return!1;var b=e.getSetting(c.data.treeId);if(i.apply(b.callback.beforeCheck,[b.treeId,a],!0)==!1)return!0;var d=e.nodeChecked(b,a);e.nodeChecked(b,a,!d);f.checkNodeRelation(b,a);d=m(a,h.id.CHECK,b);f.setChkClass(b,d,a);f.repairParentChkClassWithSelf(b,a);b.treeObj.trigger(h.event.CHECK,[c,b.treeId,a]);return!0};r=function(c,a){if(a.chkDisabled===!0)return!1;var b=e.getSetting(c.data.treeId),d=m(a,h.id.CHECK,b);a.check_Focus=!0;f.setChkClass(b,d,a);return!0};s=function(c,
a){if(a.chkDisabled===!0)return!1;var b=e.getSetting(c.data.treeId),d=m(a,h.id.CHECK,b);a.check_Focus=!1;f.setChkClass(b,d,a);return!0};n.extend(!0,n.fn.zTree.consts,p);n.extend(!0,n.fn.zTree._z,{tools:{},view:{checkNodeRelation:function(c,a){var b,d,j;d=h.radio;b=e.nodeChecked(c,a);if(c.check.chkStyle==d.STYLE){var g=e.getRadioCheckedList(c);if(b)if(c.check.radioType==d.TYPE_ALL){for(d=g.length-1;d>=0;d--){b=g[d];var k=e.nodeChecked(c,b);k&&b!=a&&(e.nodeChecked(c,b,!1),g.splice(d,1),f.setChkClass(c,
m(b,h.id.CHECK,c),b),b.parentTId!=a.parentTId&&f.repairParentChkClassWithSelf(c,b))}g.push(a)}else{g=a.parentTId?a.getParentNode():e.getRoot(c);g=e.nodeChildren(c,g);for(d=0,j=g.length;d<j;d++)if(b=g[d],(k=e.nodeChecked(c,b))&&b!=a)e.nodeChecked(c,b,!1),f.setChkClass(c,m(b,h.id.CHECK,c),b)}else if(c.check.radioType==d.TYPE_ALL)for(d=0,j=g.length;d<j;d++)if(a==g[d]){g.splice(d,1);break}}else g=e.nodeChildren(c,a),b&&(!g||g.length==0||c.check.chkboxType.Y.indexOf("s")>-1)&&f.setSonNodeCheckBox(c,a,
!0),!b&&(!g||g.length==0||c.check.chkboxType.N.indexOf("s")>-1)&&f.setSonNodeCheckBox(c,a,!1),b&&c.check.chkboxType.Y.indexOf("p")>-1&&f.setParentNodeCheckBox(c,a,!0),!b&&c.check.chkboxType.N.indexOf("p")>-1&&f.setParentNodeCheckBox(c,a,!1)},makeChkClass:function(c,a){var b=h.checkbox,d=h.radio,j="",g=e.nodeChecked(c,a),j=a.chkDisabled===!0?b.DISABLED:a.halfCheck?b.PART:c.check.chkStyle==d.STYLE?a.check_Child_State<1?b.FULL:b.PART:g?a.check_Child_State===2||a.check_Child_State===-1?b.FULL:b.PART:
a.check_Child_State<1?b.FULL:b.PART,d=c.check.chkStyle+"_"+(g?b.TRUE:b.FALSE)+"_"+j,d=a.check_Focus&&a.chkDisabled!==!0?d+"_"+b.FOCUS:d;return h.className.BUTTON+" "+b.DEFAULT+" "+d},repairAllChk:function(c,a){if(c.check.enable&&c.check.chkStyle===h.checkbox.STYLE)for(var b=e.getRoot(c),b=e.nodeChildren(c,b),d=0,j=b.length;d<j;d++){var g=b[d];g.nocheck!==!0&&g.chkDisabled!==!0&&e.nodeChecked(c,g,a);f.setSonNodeCheckBox(c,g,a)}},repairChkClass:function(c,a){if(a&&(e.makeChkFlag(c,a),a.nocheck!==!0)){var b=
m(a,h.id.CHECK,c);f.setChkClass(c,b,a)}},repairParentChkClass:function(c,a){if(a&&a.parentTId){var b=a.getParentNode();f.repairChkClass(c,b);f.repairParentChkClass(c,b)}},repairParentChkClassWithSelf:function(c,a){if(a){var b=e.nodeChildren(c,a);b&&b.length>0?f.repairParentChkClass(c,b[0]):f.repairParentChkClass(c,a)}},repairSonChkDisabled:function(c,a,b,d){if(a){if(a.chkDisabled!=b)a.chkDisabled=b;f.repairChkClass(c,a);if((a=e.nodeChildren(c,a))&&d)for(var j=0,g=a.length;j<g;j++)f.repairSonChkDisabled(c,
a[j],b,d)}},repairParentChkDisabled:function(c,a,b,d){if(a){if(a.chkDisabled!=b&&d)a.chkDisabled=b;f.repairChkClass(c,a);f.repairParentChkDisabled(c,a.getParentNode(),b,d)}},setChkClass:function(c,a,b){a&&(b.nocheck===!0?a.hide():a.show(),a.attr("class",f.makeChkClass(c,b)))},setParentNodeCheckBox:function(c,a,b,d){var j=m(a,h.id.CHECK,c);d||(d=a);e.makeChkFlag(c,a);a.nocheck!==!0&&a.chkDisabled!==!0&&(e.nodeChecked(c,a,b),f.setChkClass(c,j,a),c.check.autoCheckTrigger&&a!=d&&c.treeObj.trigger(h.event.CHECK,
[null,c.treeId,a]));if(a.parentTId){j=!0;if(!b)for(var g=e.nodeChildren(c,a.getParentNode()),k=0,o=g.length;k<o;k++){var l=g[k],i=e.nodeChecked(c,l);if(l.nocheck!==!0&&l.chkDisabled!==!0&&i||(l.nocheck===!0||l.chkDisabled===!0)&&l.check_Child_State>0){j=!1;break}}j&&f.setParentNodeCheckBox(c,a.getParentNode(),b,d)}},setSonNodeCheckBox:function(c,a,b,d){if(a){var j=m(a,h.id.CHECK,c);d||(d=a);var g=!1,k=e.nodeChildren(c,a);if(k)for(var o=0,l=k.length;o<l;o++){var i=k[o];f.setSonNodeCheckBox(c,i,b,d);
i.chkDisabled===!0&&(g=!0)}if(a!=e.getRoot(c)&&a.chkDisabled!==!0){g&&a.nocheck!==!0&&e.makeChkFlag(c,a);if(a.nocheck!==!0&&a.chkDisabled!==!0){if(e.nodeChecked(c,a,b),!g)a.check_Child_State=k&&k.length>0?b?2:0:-1}else a.check_Child_State=-1;f.setChkClass(c,j,a);c.check.autoCheckTrigger&&a!=d&&a.nocheck!==!0&&a.chkDisabled!==!0&&c.treeObj.trigger(h.event.CHECK,[null,c.treeId,a])}}}},event:{},data:{getRadioCheckedList:function(c){for(var a=e.getRoot(c).radioCheckedList,b=0,d=a.length;b<d;b++)e.getNodeCache(c,
a[b].tId)||(a.splice(b,1),b--,d--);return a},getCheckStatus:function(c,a){if(!c.check.enable||a.nocheck||a.chkDisabled)return null;var b=e.nodeChecked(c,a);return{checked:b,half:a.halfCheck?a.halfCheck:c.check.chkStyle==h.radio.STYLE?a.check_Child_State===2:b?a.check_Child_State>-1&&a.check_Child_State<2:a.check_Child_State>0}},getTreeCheckedNodes:function(c,a,b,d){if(!a)return[];for(var j=b&&c.check.chkStyle==h.radio.STYLE&&c.check.radioType==h.radio.TYPE_ALL,d=!d?[]:d,g=0,f=a.length;g<f;g++){var i=
a[g],l=e.nodeChildren(c,i),m=e.nodeChecked(c,i);if(i.nocheck!==!0&&i.chkDisabled!==!0&&m==b&&(d.push(i),j))break;e.getTreeCheckedNodes(c,l,b,d);if(j&&d.length>0)break}return d},getTreeChangeCheckedNodes:function(c,a,b){if(!a)return[];for(var b=!b?[]:b,d=0,j=a.length;d<j;d++){var g=a[d],f=e.nodeChildren(c,g),h=e.nodeChecked(c,g);g.nocheck!==!0&&g.chkDisabled!==!0&&h!=g.checkedOld&&b.push(g);e.getTreeChangeCheckedNodes(c,f,b)}return b},makeChkFlag:function(c,a){if(a){var b=-1,d=e.nodeChildren(c,a);
if(d)for(var j=0,g=d.length;j<g;j++){var f=d[j],i=e.nodeChecked(c,f),l=-1;if(c.check.chkStyle==h.radio.STYLE)if(l=f.nocheck===!0||f.chkDisabled===!0?f.check_Child_State:f.halfCheck===!0?2:i?2:f.check_Child_State>0?2:0,l==2){b=2;break}else l==0&&(b=0);else if(c.check.chkStyle==h.checkbox.STYLE)if(l=f.nocheck===!0||f.chkDisabled===!0?f.check_Child_State:f.halfCheck===!0?1:i?f.check_Child_State===-1||f.check_Child_State===2?2:1:f.check_Child_State>0?1:0,l===1){b=1;break}else if(l===2&&b>-1&&j>0&&l!==
b){b=1;break}else if(b===2&&l>-1&&l<2){b=1;break}else l>-1&&(b=l)}a.check_Child_State=b}}}});var n=n.fn.zTree,i=n._z.tools,h=n.consts,f=n._z.view,e=n._z.data,m=i.$;e.nodeChecked=function(c,a,b){if(!a)return!1;c=c.data.key.checked;typeof b!=="undefined"&&(typeof b==="string"&&(b=i.eqs(b,"true")),a[c]=!!b);return a[c]};e.exSetting(w);e.addInitBind(function(c){c.treeObj.bind(h.event.CHECK,function(a,b,d,e){a.srcEvent=b;i.apply(c.callback.onCheck,[a,d,e])})});e.addInitUnBind(function(c){c.treeObj.unbind(h.event.CHECK)});
e.addInitCache(function(){});e.addInitNode(function(c,a,b,d){if(b){a=e.nodeChecked(c,b);a=e.nodeChecked(c,b,a);b.checkedOld=a;if(typeof b.nocheck=="string")b.nocheck=i.eqs(b.nocheck,"true");b.nocheck=!!b.nocheck||c.check.nocheckInherit&&d&&!!d.nocheck;if(typeof b.chkDisabled=="string")b.chkDisabled=i.eqs(b.chkDisabled,"true");b.chkDisabled=!!b.chkDisabled||c.check.chkDisabledInherit&&d&&!!d.chkDisabled;if(typeof b.halfCheck=="string")b.halfCheck=i.eqs(b.halfCheck,"true");b.halfCheck=!!b.halfCheck;
b.check_Child_State=-1;b.check_Focus=!1;b.getCheckStatus=function(){return e.getCheckStatus(c,b)};c.check.chkStyle==h.radio.STYLE&&c.check.radioType==h.radio.TYPE_ALL&&a&&e.getRoot(c).radioCheckedList.push(b)}});e.addInitProxy(function(c){var a=c.target,b=e.getSetting(c.data.treeId),d="",f=null,g="",k=null;if(i.eqs(c.type,"mouseover")){if(b.check.enable&&i.eqs(a.tagName,"span")&&a.getAttribute("treeNode"+h.id.CHECK)!==null)d=i.getNodeMainDom(a).id,g="mouseoverCheck"}else if(i.eqs(c.type,"mouseout")){if(b.check.enable&&
i.eqs(a.tagName,"span")&&a.getAttribute("treeNode"+h.id.CHECK)!==null)d=i.getNodeMainDom(a).id,g="mouseoutCheck"}else if(i.eqs(c.type,"click")&&b.check.enable&&i.eqs(a.tagName,"span")&&a.getAttribute("treeNode"+h.id.CHECK)!==null)d=i.getNodeMainDom(a).id,g="checkNode";if(d.length>0)switch(f=e.getNodeCache(b,d),g){case "checkNode":k=q;break;case "mouseoverCheck":k=r;break;case "mouseoutCheck":k=s}return{stop:g==="checkNode",node:f,nodeEventType:g,nodeEventCallback:k,treeEventType:"",treeEventCallback:null}},
!0);e.addInitRoot(function(c){e.getRoot(c).radioCheckedList=[]});e.addBeforeA(function(c,a,b){c.check.enable&&(e.makeChkFlag(c,a),b.push("<span ID='",a.tId,h.id.CHECK,"' class='",f.makeChkClass(c,a),"' treeNode",h.id.CHECK,a.nocheck===!0?" style='display:none;'":"","></span>"))});e.addZTreeTools(function(c,a){a.checkNode=function(a,b,g,k){var o=e.nodeChecked(c,a);if(a.chkDisabled!==!0&&(b!==!0&&b!==!1&&(b=!o),k=!!k,(o!==b||g)&&!(k&&i.apply(this.setting.callback.beforeCheck,[this.setting.treeId,a],
!0)==!1)&&i.uCanDo(this.setting)&&this.setting.check.enable&&a.nocheck!==!0))e.nodeChecked(c,a,b),b=m(a,h.id.CHECK,this.setting),(g||this.setting.check.chkStyle===h.radio.STYLE)&&f.checkNodeRelation(this.setting,a),f.setChkClass(this.setting,b,a),f.repairParentChkClassWithSelf(this.setting,a),k&&this.setting.treeObj.trigger(h.event.CHECK,[null,this.setting.treeId,a])};a.checkAllNodes=function(a){f.repairAllChk(this.setting,!!a)};a.getCheckedNodes=function(a){var a=a!==!1,b=e.nodeChildren(c,e.getRoot(this.setting));
return e.getTreeCheckedNodes(this.setting,b,a)};a.getChangeCheckedNodes=function(){var a=e.nodeChildren(c,e.getRoot(this.setting));return e.getTreeChangeCheckedNodes(this.setting,a)};a.setChkDisabled=function(a,b,c,e){b=!!b;c=!!c;f.repairSonChkDisabled(this.setting,a,b,!!e);f.repairParentChkDisabled(this.setting,a.getParentNode(),b,c)};var b=a.updateNode;a.updateNode=function(c,e){b&&b.apply(a,arguments);if(c&&this.setting.check.enable&&m(c,this.setting).get(0)&&i.uCanDo(this.setting)){var g=m(c,
h.id.CHECK,this.setting);(e==!0||this.setting.check.chkStyle===h.radio.STYLE)&&f.checkNodeRelation(this.setting,c);f.setChkClass(this.setting,g,c);f.repairParentChkClassWithSelf(this.setting,c)}}});var t=f.createNodes;f.createNodes=function(c,a,b,d,e){t&&t.apply(f,arguments);b&&f.repairParentChkClassWithSelf(c,d)};var u=f.removeNode;f.removeNode=function(c,a){var b=a.getParentNode();u&&u.apply(f,arguments);a&&b&&(f.repairChkClass(c,b),f.repairParentChkClass(c,b))};var v=f.appendNodes;f.appendNodes=
function(c,a,b,d,h,g,i){var m="";v&&(m=v.apply(f,arguments));d&&e.makeChkFlag(c,d);return m}})(jQuery);

/*
 * JQuery zTree exedit v3.5.37
 * http://treejs.cn/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Licensed same as jquery - MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * email: hunter.z@263.net
 * Date: 2018-08-21
 */
(function(B){var I={event:{DRAG:"ztree_drag",DROP:"ztree_drop",RENAME:"ztree_rename",DRAGMOVE:"ztree_dragmove"},id:{EDIT:"_edit",INPUT:"_input",REMOVE:"_remove"},move:{TYPE_INNER:"inner",TYPE_PREV:"prev",TYPE_NEXT:"next"},node:{CURSELECTED_EDIT:"curSelectedNode_Edit",TMPTARGET_TREE:"tmpTargetzTree",TMPTARGET_NODE:"tmpTargetNode"}},v={onHoverOverNode:function(a,b){var c=i.getSetting(a.data.treeId),d=i.getRoot(c);if(d.curHoverNode!=b)v.onHoverOutNode(a);d.curHoverNode=b;e.addHoverDom(c,b)},onHoverOutNode:function(a){var a=
i.getSetting(a.data.treeId),b=i.getRoot(a);if(b.curHoverNode&&!i.isSelectedNode(a,b.curHoverNode))e.removeTreeDom(a,b.curHoverNode),b.curHoverNode=null},onMousedownNode:function(a,b){function c(a){if(m.dragFlag==0&&Math.abs(N-a.clientX)<f.edit.drag.minMoveSize&&Math.abs(O-a.clientY)<f.edit.drag.minMoveSize)return!0;var b,c,g,j;L.css("cursor","pointer");if(m.dragFlag==0){if(k.apply(f.callback.beforeDrag,[f.treeId,n],!0)==!1)return l(a),!0;for(b=0,c=n.length;b<c;b++){if(b==0)m.dragNodeShowBefore=[];
g=n[b];i.nodeIsParent(f,g)&&g.open?(e.expandCollapseNode(f,g,!g.open),m.dragNodeShowBefore[g.tId]=!0):m.dragNodeShowBefore[g.tId]=!1}m.dragFlag=1;y.showHoverDom=!1;k.showIfameMask(f,!0);j=!0;var p=-1;if(n.length>1){var o=n[0].parentTId?i.nodeChildren(f,n[0].getParentNode()):i.getNodes(f);g=[];for(b=0,c=o.length;b<c;b++)if(m.dragNodeShowBefore[o[b].tId]!==void 0&&(j&&p>-1&&p+1!==b&&(j=!1),g.push(o[b]),p=b),n.length===g.length){n=g;break}}j&&(H=n[0].getPreNode(),Q=n[n.length-1].getNextNode());C=q("<ul class='zTreeDragUL'></ul>",
f);for(b=0,c=n.length;b<c;b++)g=n[b],g.editNameFlag=!1,e.selectNode(f,g,b>0),e.removeTreeDom(f,g),b>f.edit.drag.maxShowNodeNum-1||(j=q("<li id='"+g.tId+"_tmp'></li>",f),j.append(q(g,d.id.A,f).clone()),j.css("padding","0"),j.children("#"+g.tId+d.id.A).removeClass(d.node.CURSELECTED),C.append(j),b==f.edit.drag.maxShowNodeNum-1&&(j=q("<li id='"+g.tId+"_moretmp'><a>  ...  </a></li>",f),C.append(j)));C.attr("id",n[0].tId+d.id.UL+"_tmp");C.addClass(f.treeObj.attr("class"));C.appendTo(L);u=q("<span class='tmpzTreeMove_arrow'></span>",
f);u.attr("id","zTreeMove_arrow_tmp");u.appendTo(L);f.treeObj.trigger(d.event.DRAG,[a,f.treeId,n])}if(m.dragFlag==1){t&&u.attr("id")==a.target.id&&w&&a.clientX+G.scrollLeft()+2>B("#"+w+d.id.A,t).offset().left?(g=B("#"+w+d.id.A,t),a.target=g.length>0?g.get(0):a.target):t&&(t.removeClass(d.node.TMPTARGET_TREE),w&&B("#"+w+d.id.A,t).removeClass(d.node.TMPTARGET_NODE+"_"+d.move.TYPE_PREV).removeClass(d.node.TMPTARGET_NODE+"_"+I.move.TYPE_NEXT).removeClass(d.node.TMPTARGET_NODE+"_"+I.move.TYPE_INNER));
w=t=null;J=!1;h=f;g=i.getSettings();for(var z in g)if(g[z].treeId&&g[z].edit.enable&&g[z].treeId!=f.treeId&&(a.target.id==g[z].treeId||B(a.target).parents("#"+g[z].treeId).length>0))J=!0,h=g[z];z=G.scrollTop();j=G.scrollLeft();p=h.treeObj.offset();b=h.treeObj.get(0).scrollHeight;g=h.treeObj.get(0).scrollWidth;c=a.clientY+z-p.top;var E=h.treeObj.height()+p.top-a.clientY-z,r=a.clientX+j-p.left,s=h.treeObj.width()+p.left-a.clientX-j,p=c<f.edit.drag.borderMax&&c>f.edit.drag.borderMin,o=E<f.edit.drag.borderMax&&
E>f.edit.drag.borderMin,F=r<f.edit.drag.borderMax&&r>f.edit.drag.borderMin,v=s<f.edit.drag.borderMax&&s>f.edit.drag.borderMin,E=c>f.edit.drag.borderMin&&E>f.edit.drag.borderMin&&r>f.edit.drag.borderMin&&s>f.edit.drag.borderMin,r=p&&h.treeObj.scrollTop()<=0,s=o&&h.treeObj.scrollTop()+h.treeObj.height()+10>=b,M=F&&h.treeObj.scrollLeft()<=0,P=v&&h.treeObj.scrollLeft()+h.treeObj.width()+10>=g;if(a.target&&k.isChildOrSelf(a.target,h.treeId)){for(var D=a.target;D&&D.tagName&&!k.eqs(D.tagName,"li")&&D.id!=
h.treeId;)D=D.parentNode;var R=!0;for(b=0,c=n.length;b<c;b++)if(g=n[b],D.id===g.tId){R=!1;break}else if(q(g,f).find("#"+D.id).length>0){R=!1;break}if(R&&a.target&&k.isChildOrSelf(a.target,D.id+d.id.A))t=B(D),w=D.id}g=n[0];if(E&&k.isChildOrSelf(a.target,h.treeId)){if(!t&&(a.target.id==h.treeId||r||s||M||P)&&(J||!J&&g.parentTId))t=h.treeObj;p?h.treeObj.scrollTop(h.treeObj.scrollTop()-10):o&&h.treeObj.scrollTop(h.treeObj.scrollTop()+10);F?h.treeObj.scrollLeft(h.treeObj.scrollLeft()-10):v&&h.treeObj.scrollLeft(h.treeObj.scrollLeft()+
10);t&&t!=h.treeObj&&t.offset().left<h.treeObj.offset().left&&h.treeObj.scrollLeft(h.treeObj.scrollLeft()+t.offset().left-h.treeObj.offset().left)}C.css({top:a.clientY+z+3+"px",left:a.clientX+j+3+"px"});b=j=0;if(t&&t.attr("id")!=h.treeId){var A=w==null?null:i.getNodeCache(h,w),p=(a.ctrlKey||a.metaKey)&&f.edit.drag.isMove&&f.edit.drag.isCopy||!f.edit.drag.isMove&&f.edit.drag.isCopy;c=!!(H&&w===H.tId);F=!!(Q&&w===Q.tId);o=g.parentTId&&g.parentTId==w;g=(p||!F)&&k.apply(h.edit.drag.prev,[h.treeId,n,A],
!!h.edit.drag.prev);c=(p||!c)&&k.apply(h.edit.drag.next,[h.treeId,n,A],!!h.edit.drag.next);p=(p||!o)&&!(h.data.keep.leaf&&!i.nodeIsParent(f,A))&&k.apply(h.edit.drag.inner,[h.treeId,n,A],!!h.edit.drag.inner);o=function(){t=null;w="";x=d.move.TYPE_INNER;u.css({display:"none"});if(window.zTreeMoveTimer)clearTimeout(window.zTreeMoveTimer),window.zTreeMoveTargetNodeTId=null};if(!g&&!c&&!p)o();else if(F=B("#"+w+d.id.A,t),v=A.isLastNode?null:B("#"+A.getNextNode().tId+d.id.A,t.next()),E=F.offset().top,r=
F.offset().left,s=g?p?0.25:c?0.5:1:-1,M=c?p?0.75:g?0.5:0:-1,z=(a.clientY+z-E)/F.height(),(s==1||z<=s&&z>=-0.2)&&g?(j=1-u.width(),b=E-u.height()/2,x=d.move.TYPE_PREV):(M==0||z>=M&&z<=1.2)&&c?(j=1-u.width(),b=v==null||i.nodeIsParent(f,A)&&A.open?E+F.height()-u.height()/2:v.offset().top-u.height()/2,x=d.move.TYPE_NEXT):p?(j=5-u.width(),b=E,x=d.move.TYPE_INNER):o(),t){u.css({display:"block",top:b+"px",left:r+j+"px"});F.addClass(d.node.TMPTARGET_NODE+"_"+x);if(S!=w||T!=x)K=(new Date).getTime();if(A&&i.nodeIsParent(f,
A)&&x==d.move.TYPE_INNER&&(z=!0,window.zTreeMoveTimer&&window.zTreeMoveTargetNodeTId!==A.tId?(clearTimeout(window.zTreeMoveTimer),window.zTreeMoveTargetNodeTId=null):window.zTreeMoveTimer&&window.zTreeMoveTargetNodeTId===A.tId&&(z=!1),z))window.zTreeMoveTimer=setTimeout(function(){x==d.move.TYPE_INNER&&A&&i.nodeIsParent(f,A)&&!A.open&&(new Date).getTime()-K>h.edit.drag.autoOpenTime&&k.apply(h.callback.beforeDragOpen,[h.treeId,A],!0)&&(e.switchNode(h,A),h.edit.drag.autoExpandTrigger&&h.treeObj.trigger(d.event.EXPAND,
[h.treeId,A]))},h.edit.drag.autoOpenTime+50),window.zTreeMoveTargetNodeTId=A.tId}}else if(x=d.move.TYPE_INNER,t&&k.apply(h.edit.drag.inner,[h.treeId,n,null],!!h.edit.drag.inner)?t.addClass(d.node.TMPTARGET_TREE):t=null,u.css({display:"none"}),window.zTreeMoveTimer)clearTimeout(window.zTreeMoveTimer),window.zTreeMoveTargetNodeTId=null;S=w;T=x;f.treeObj.trigger(d.event.DRAGMOVE,[a,f.treeId,n])}return!1}function l(a){if(window.zTreeMoveTimer)clearTimeout(window.zTreeMoveTimer),window.zTreeMoveTargetNodeTId=
null;T=S=null;G.unbind("mousemove",c);G.unbind("mouseup",l);G.unbind("selectstart",g);L.css("cursor","");t&&(t.removeClass(d.node.TMPTARGET_TREE),w&&B("#"+w+d.id.A,t).removeClass(d.node.TMPTARGET_NODE+"_"+d.move.TYPE_PREV).removeClass(d.node.TMPTARGET_NODE+"_"+I.move.TYPE_NEXT).removeClass(d.node.TMPTARGET_NODE+"_"+I.move.TYPE_INNER));k.showIfameMask(f,!1);y.showHoverDom=!0;if(m.dragFlag!=0){m.dragFlag=0;var b,j,o;for(b=0,j=n.length;b<j;b++)o=n[b],i.nodeIsParent(f,o)&&m.dragNodeShowBefore[o.tId]&&
!o.open&&(e.expandCollapseNode(f,o,!o.open),delete m.dragNodeShowBefore[o.tId]);C&&C.remove();u&&u.remove();var r=(a.ctrlKey||a.metaKey)&&f.edit.drag.isMove&&f.edit.drag.isCopy||!f.edit.drag.isMove&&f.edit.drag.isCopy;!r&&t&&w&&n[0].parentTId&&w==n[0].parentTId&&x==d.move.TYPE_INNER&&(t=null);if(t){var p=w==null?null:i.getNodeCache(h,w);if(k.apply(f.callback.beforeDrop,[h.treeId,n,p,x,r],!0)==!1)e.selectNodes(v,n);else{var s=r?k.clone(n):n;b=function(){if(J){if(!r)for(var b=0,c=n.length;b<c;b++)e.removeNode(f,
n[b]);x==d.move.TYPE_INNER?e.addNodes(h,p,-1,s):e.addNodes(h,p.getParentNode(),x==d.move.TYPE_PREV?p.getIndex():p.getIndex()+1,s)}else if(r&&x==d.move.TYPE_INNER)e.addNodes(h,p,-1,s);else if(r)e.addNodes(h,p.getParentNode(),x==d.move.TYPE_PREV?p.getIndex():p.getIndex()+1,s);else if(x!=d.move.TYPE_NEXT)for(b=0,c=s.length;b<c;b++)e.moveNode(h,p,s[b],x,!1);else for(b=-1,c=s.length-1;b<c;c--)e.moveNode(h,p,s[c],x,!1);e.selectNodes(h,s);b=q(s[0],f).get(0);e.scrollIntoView(f,b);f.treeObj.trigger(d.event.DROP,
[a,h.treeId,s,p,x,r])};x==d.move.TYPE_INNER&&k.canAsync(h,p)?e.asyncNode(h,p,!1,b):b()}}else e.selectNodes(v,n),f.treeObj.trigger(d.event.DROP,[a,f.treeId,n,null,null,null])}}function g(){return!1}var o,j,f=i.getSetting(a.data.treeId),m=i.getRoot(f),y=i.getRoots();if(a.button==2||!f.edit.enable||!f.edit.drag.isCopy&&!f.edit.drag.isMove)return!0;var r=a.target,s=i.getRoot(f).curSelectedList,n=[];if(i.isSelectedNode(f,b))for(o=0,j=s.length;o<j;o++){if(s[o].editNameFlag&&k.eqs(r.tagName,"input")&&r.getAttribute("treeNode"+
d.id.INPUT)!==null)return!0;n.push(s[o]);if(n[0].parentTId!==s[o].parentTId){n=[b];break}}else n=[b];e.editNodeBlur=!0;e.cancelCurEditNode(f);var G=B(f.treeObj.get(0).ownerDocument),L=B(f.treeObj.get(0).ownerDocument.body),C,u,t,J=!1,h=f,v=f,H,Q,S=null,T=null,w=null,x=d.move.TYPE_INNER,N=a.clientX,O=a.clientY,K=(new Date).getTime();k.uCanDo(f)&&G.bind("mousemove",c);G.bind("mouseup",l);G.bind("selectstart",g);return!0}};B.extend(!0,B.fn.zTree.consts,I);B.extend(!0,B.fn.zTree._z,{tools:{getAbs:function(a){a=
a.getBoundingClientRect();return[a.left+(document.body.scrollLeft+document.documentElement.scrollLeft),a.top+(document.body.scrollTop+document.documentElement.scrollTop)]},inputFocus:function(a){a.get(0)&&(a.focus(),k.setCursorPosition(a.get(0),a.val().length))},inputSelect:function(a){a.get(0)&&(a.focus(),a.select())},setCursorPosition:function(a,b){if(a.setSelectionRange)a.focus(),a.setSelectionRange(b,b);else if(a.createTextRange){var c=a.createTextRange();c.collapse(!0);c.moveEnd("character",
b);c.moveStart("character",b);c.select()}},showIfameMask:function(a,b){for(var c=i.getRoot(a);c.dragMaskList.length>0;)c.dragMaskList[0].remove(),c.dragMaskList.shift();if(b)for(var d=q("iframe",a),g=0,e=d.length;g<e;g++){var j=d.get(g),f=k.getAbs(j),j=q("<div id='zTreeMask_"+g+"' class='zTreeMask' style='top:"+f[1]+"px; left:"+f[0]+"px; width:"+j.offsetWidth+"px; height:"+j.offsetHeight+"px;'></div>",a);j.appendTo(q("body",a));c.dragMaskList.push(j)}}},view:{addEditBtn:function(a,b){if(!(b.editNameFlag||
q(b,d.id.EDIT,a).length>0)&&k.apply(a.edit.showRenameBtn,[a.treeId,b],a.edit.showRenameBtn)){var c=q(b,d.id.A,a),l="<span class='"+d.className.BUTTON+" edit' id='"+b.tId+d.id.EDIT+"' title='"+k.apply(a.edit.renameTitle,[a.treeId,b],a.edit.renameTitle)+"' treeNode"+d.id.EDIT+" style='display:none;'></span>";c.append(l);q(b,d.id.EDIT,a).bind("click",function(){if(!k.uCanDo(a)||k.apply(a.callback.beforeEditName,[a.treeId,b],!0)==!1)return!1;e.editNode(a,b);return!1}).show()}},addRemoveBtn:function(a,
b){if(!(b.editNameFlag||q(b,d.id.REMOVE,a).length>0)&&k.apply(a.edit.showRemoveBtn,[a.treeId,b],a.edit.showRemoveBtn)){var c=q(b,d.id.A,a),l="<span class='"+d.className.BUTTON+" remove' id='"+b.tId+d.id.REMOVE+"' title='"+k.apply(a.edit.removeTitle,[a.treeId,b],a.edit.removeTitle)+"' treeNode"+d.id.REMOVE+" style='display:none;'></span>";c.append(l);q(b,d.id.REMOVE,a).bind("click",function(){if(!k.uCanDo(a)||k.apply(a.callback.beforeRemove,[a.treeId,b],!0)==!1)return!1;e.removeNode(a,b);a.treeObj.trigger(d.event.REMOVE,
[a.treeId,b]);return!1}).bind("mousedown",function(){return!0}).show()}},addHoverDom:function(a,b){if(i.getRoots().showHoverDom)b.isHover=!0,a.edit.enable&&(e.addEditBtn(a,b),e.addRemoveBtn(a,b)),k.apply(a.view.addHoverDom,[a.treeId,b])},cancelCurEditNode:function(a,b,c){var l=i.getRoot(a),g=l.curEditNode;if(g){var o=l.curEditInput,b=b?b:c?i.nodeName(a,g):o.val();if(k.apply(a.callback.beforeRename,[a.treeId,g,b,c],!0)===!1)return!1;i.nodeName(a,g,b);q(g,d.id.A,a).removeClass(d.node.CURSELECTED_EDIT);
o.unbind();e.setNodeName(a,g);g.editNameFlag=!1;l.curEditNode=null;l.curEditInput=null;e.selectNode(a,g,!1);a.treeObj.trigger(d.event.RENAME,[a.treeId,g,c])}return l.noSelection=!0},editNode:function(a,b){var c=i.getRoot(a);e.editNodeBlur=!1;if(i.isSelectedNode(a,b)&&c.curEditNode==b&&b.editNameFlag)setTimeout(function(){k.inputFocus(c.curEditInput)},0);else{b.editNameFlag=!0;e.removeTreeDom(a,b);e.cancelCurEditNode(a);e.selectNode(a,b,!1);q(b,d.id.SPAN,a).html("<input type=text class='rename' id='"+
b.tId+d.id.INPUT+"' treeNode"+d.id.INPUT+" >");var l=q(b,d.id.INPUT,a);l.attr("value",i.nodeName(a,b));a.edit.editNameSelectAll?k.inputSelect(l):k.inputFocus(l);l.bind("blur",function(){e.editNodeBlur||e.cancelCurEditNode(a)}).bind("keydown",function(b){b.keyCode=="13"?(e.editNodeBlur=!0,e.cancelCurEditNode(a)):b.keyCode=="27"&&e.cancelCurEditNode(a,null,!0)}).bind("click",function(){return!1}).bind("dblclick",function(){return!1});q(b,d.id.A,a).addClass(d.node.CURSELECTED_EDIT);c.curEditInput=l;
c.noSelection=!1;c.curEditNode=b}},moveNode:function(a,b,c,l,g,k){var j=i.getRoot(a);if(b!=c&&(!a.data.keep.leaf||!b||i.nodeIsParent(a,b)||l!=d.move.TYPE_INNER)){var f=c.parentTId?c.getParentNode():j,m=b===null||b==j;m&&b===null&&(b=j);if(m)l=d.move.TYPE_INNER;j=b.parentTId?b.getParentNode():j;if(l!=d.move.TYPE_PREV&&l!=d.move.TYPE_NEXT)l=d.move.TYPE_INNER;if(l==d.move.TYPE_INNER)if(m)c.parentTId=null;else{if(!i.nodeIsParent(a,b))i.nodeIsParent(a,b,!0),b.open=!!b.open,e.setNodeLineIcos(a,b);c.parentTId=
b.tId}var y;m?y=m=a.treeObj:(!k&&l==d.move.TYPE_INNER?e.expandCollapseNode(a,b,!0,!1):k||e.expandCollapseNode(a,b.getParentNode(),!0,!1),m=q(b,a),y=q(b,d.id.UL,a),m.get(0)&&!y.get(0)&&(y=[],e.makeUlHtml(a,b,y,""),m.append(y.join(""))),y=q(b,d.id.UL,a));var r=q(c,a);r.get(0)?m.get(0)||r.remove():r=e.appendNodes(a,c.level,[c],null,-1,!1,!0).join("");y.get(0)&&l==d.move.TYPE_INNER?y.append(r):m.get(0)&&l==d.move.TYPE_PREV?m.before(r):m.get(0)&&l==d.move.TYPE_NEXT&&m.after(r);var s;y=-1;var r=0,n=null,
m=null,B=c.level,v=i.nodeChildren(a,f),C=i.nodeChildren(a,j),u=i.nodeChildren(a,b);if(c.isFirstNode){if(y=0,v.length>1)n=v[1],n.isFirstNode=!0}else if(c.isLastNode)y=v.length-1,n=v[y-1],n.isLastNode=!0;else for(j=0,s=v.length;j<s;j++)if(v[j].tId==c.tId){y=j;break}y>=0&&v.splice(y,1);if(l!=d.move.TYPE_INNER)for(j=0,s=C.length;j<s;j++)C[j].tId==b.tId&&(r=j);if(l==d.move.TYPE_INNER){u||(u=i.nodeChildren(a,b,[]));if(u.length>0)m=u[u.length-1],m.isLastNode=!1;u.splice(u.length,0,c);c.isLastNode=!0;c.isFirstNode=
u.length==1}else b.isFirstNode&&l==d.move.TYPE_PREV?(C.splice(r,0,c),m=b,m.isFirstNode=!1,c.parentTId=b.parentTId,c.isFirstNode=!0,c.isLastNode=!1):b.isLastNode&&l==d.move.TYPE_NEXT?(C.splice(r+1,0,c),m=b,m.isLastNode=!1,c.parentTId=b.parentTId,c.isFirstNode=!1,c.isLastNode=!0):(l==d.move.TYPE_PREV?C.splice(r,0,c):C.splice(r+1,0,c),c.parentTId=b.parentTId,c.isFirstNode=!1,c.isLastNode=!1);i.fixPIdKeyValue(a,c);i.setSonNodeLevel(a,c.getParentNode(),c);e.setNodeLineIcos(a,c);e.repairNodeLevelClass(a,
c,B);!a.data.keep.parent&&v.length<1?(i.nodeIsParent(a,f,!1),f.open=!1,b=q(f,d.id.UL,a),l=q(f,d.id.SWITCH,a),j=q(f,d.id.ICON,a),e.replaceSwitchClass(f,l,d.folder.DOCU),e.replaceIcoClass(f,j,d.folder.DOCU),b.css("display","none")):n&&e.setNodeLineIcos(a,n);m&&e.setNodeLineIcos(a,m);a.check&&a.check.enable&&e.repairChkClass&&(e.repairChkClass(a,f),e.repairParentChkClassWithSelf(a,f),f!=c.parent&&e.repairParentChkClassWithSelf(a,c));k||e.expandCollapseParentNode(a,c.getParentNode(),!0,g)}},removeEditBtn:function(a,
b){q(b,d.id.EDIT,a).unbind().remove()},removeRemoveBtn:function(a,b){q(b,d.id.REMOVE,a).unbind().remove()},removeTreeDom:function(a,b){b.isHover=!1;e.removeEditBtn(a,b);e.removeRemoveBtn(a,b);k.apply(a.view.removeHoverDom,[a.treeId,b])},repairNodeLevelClass:function(a,b,c){if(c!==b.level){var e=q(b,a),g=q(b,d.id.A,a),a=q(b,d.id.UL,a),c=d.className.LEVEL+c,b=d.className.LEVEL+b.level;e.removeClass(c);e.addClass(b);g.removeClass(c);g.addClass(b);a.removeClass(c);a.addClass(b)}},selectNodes:function(a,
b){for(var c=0,d=b.length;c<d;c++)e.selectNode(a,b[c],c>0)}},event:{},data:{setSonNodeLevel:function(a,b,c){if(c){var d=i.nodeChildren(a,c);c.level=b?b.level+1:0;if(d)for(var b=0,g=d.length;b<g;b++)d[b]&&i.setSonNodeLevel(a,c,d[b])}}}});var H=B.fn.zTree,k=H._z.tools,d=H.consts,e=H._z.view,i=H._z.data,q=k.$;i.exSetting({edit:{enable:!1,editNameSelectAll:!1,showRemoveBtn:!0,showRenameBtn:!0,removeTitle:"remove",renameTitle:"rename",drag:{autoExpandTrigger:!1,isCopy:!0,isMove:!0,prev:!0,next:!0,inner:!0,
minMoveSize:5,borderMax:10,borderMin:-5,maxShowNodeNum:5,autoOpenTime:500}},view:{addHoverDom:null,removeHoverDom:null},callback:{beforeDrag:null,beforeDragOpen:null,beforeDrop:null,beforeEditName:null,beforeRename:null,onDrag:null,onDragMove:null,onDrop:null,onRename:null}});i.addInitBind(function(a){var b=a.treeObj,c=d.event;b.bind(c.RENAME,function(b,c,d,e){k.apply(a.callback.onRename,[b,c,d,e])});b.bind(c.DRAG,function(b,c,d,e){k.apply(a.callback.onDrag,[c,d,e])});b.bind(c.DRAGMOVE,function(b,
c,d,e){k.apply(a.callback.onDragMove,[c,d,e])});b.bind(c.DROP,function(b,c,d,e,f,i,q){k.apply(a.callback.onDrop,[c,d,e,f,i,q])})});i.addInitUnBind(function(a){var a=a.treeObj,b=d.event;a.unbind(b.RENAME);a.unbind(b.DRAG);a.unbind(b.DRAGMOVE);a.unbind(b.DROP)});i.addInitCache(function(){});i.addInitNode(function(a,b,c){if(c)c.isHover=!1,c.editNameFlag=!1});i.addInitProxy(function(a){var b=a.target,c=i.getSetting(a.data.treeId),e=a.relatedTarget,g="",o=null,j="",f=null,m=null;if(k.eqs(a.type,"mouseover")){if(m=
k.getMDom(c,b,[{tagName:"a",attrName:"treeNode"+d.id.A}]))g=k.getNodeMainDom(m).id,j="hoverOverNode"}else if(k.eqs(a.type,"mouseout"))m=k.getMDom(c,e,[{tagName:"a",attrName:"treeNode"+d.id.A}]),m||(g="remove",j="hoverOutNode");else if(k.eqs(a.type,"mousedown")&&(m=k.getMDom(c,b,[{tagName:"a",attrName:"treeNode"+d.id.A}])))g=k.getNodeMainDom(m).id,j="mousedownNode";if(g.length>0)switch(o=i.getNodeCache(c,g),j){case "mousedownNode":f=v.onMousedownNode;break;case "hoverOverNode":f=v.onHoverOverNode;
break;case "hoverOutNode":f=v.onHoverOutNode}return{stop:!1,node:o,nodeEventType:j,nodeEventCallback:f,treeEventType:"",treeEventCallback:null}});i.addInitRoot(function(a){var a=i.getRoot(a),b=i.getRoots();a.curEditNode=null;a.curEditInput=null;a.curHoverNode=null;a.dragFlag=0;a.dragNodeShowBefore=[];a.dragMaskList=[];b.showHoverDom=!0});i.addZTreeTools(function(a,b){b.cancelEditName=function(a){i.getRoot(this.setting).curEditNode&&e.cancelCurEditNode(this.setting,a?a:null,!0)};b.copyNode=function(b,
l,g,o){if(!l)return null;var j=i.nodeIsParent(a,b);if(b&&!j&&this.setting.data.keep.leaf&&g===d.move.TYPE_INNER)return null;var f=this,m=k.clone(l);if(!b)b=null,g=d.move.TYPE_INNER;g==d.move.TYPE_INNER?(l=function(){e.addNodes(f.setting,b,-1,[m],o)},k.canAsync(this.setting,b)?e.asyncNode(this.setting,b,o,l):l()):(e.addNodes(this.setting,b.parentNode,-1,[m],o),e.moveNode(this.setting,b,m,g,!1,o));return m};b.editName=function(a){a&&a.tId&&a===i.getNodeCache(this.setting,a.tId)&&(a.parentTId&&e.expandCollapseParentNode(this.setting,
a.getParentNode(),!0),e.editNode(this.setting,a))};b.moveNode=function(b,l,g,o){function j(){e.moveNode(m.setting,b,l,g,!1,o)}if(!l)return l;var f=i.nodeIsParent(a,b);if(b&&!f&&this.setting.data.keep.leaf&&g===d.move.TYPE_INNER)return null;else if(b&&(l.parentTId==b.tId&&g==d.move.TYPE_INNER||q(l,this.setting).find("#"+b.tId).length>0))return null;else b||(b=null);var m=this;k.canAsync(this.setting,b)&&g===d.move.TYPE_INNER?e.asyncNode(this.setting,b,o,j):j();return l};b.setEditable=function(a){this.setting.edit.enable=
a;return this.refresh()}});var N=e.cancelPreSelectedNode;e.cancelPreSelectedNode=function(a,b){for(var c=i.getRoot(a).curSelectedList,d=0,g=c.length;d<g;d++)if(!b||b===c[d])if(e.removeTreeDom(a,c[d]),b)break;N&&N.apply(e,arguments)};var O=e.createNodes;e.createNodes=function(a,b,c,d,g){O&&O.apply(e,arguments);c&&e.repairParentChkClassWithSelf&&e.repairParentChkClassWithSelf(a,d)};var V=e.makeNodeUrl;e.makeNodeUrl=function(a,b){return a.edit.enable?null:V.apply(e,arguments)};var K=e.removeNode;e.removeNode=
function(a,b){var c=i.getRoot(a);if(c.curEditNode===b)c.curEditNode=null;K&&K.apply(e,arguments)};var P=e.selectNode;e.selectNode=function(a,b,c){var d=i.getRoot(a);if(i.isSelectedNode(a,b)&&d.curEditNode==b&&b.editNameFlag)return!1;P&&P.apply(e,arguments);e.addHoverDom(a,b);return!0};var U=k.uCanDo;k.uCanDo=function(a,b){var c=i.getRoot(a);if(b&&(k.eqs(b.type,"mouseover")||k.eqs(b.type,"mouseout")||k.eqs(b.type,"mousedown")||k.eqs(b.type,"mouseup")))return!0;if(c.curEditNode)e.editNodeBlur=!1,c.curEditInput.focus();
return!c.curEditNode&&(U?U.apply(e,arguments):!0)}})(jQuery);
/*
 * JQuery zTree exHideNodes v3.5.37
 * http://treejs.cn/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Licensed same as jquery - MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * email: hunter.z@263.net
 * Date: 2018-08-21
 */
(function(j){j.extend(!0,j.fn.zTree._z,{view:{clearOldFirstNode:function(c,a){for(var b=a.getNextNode();b;){if(b.isFirstNode){b.isFirstNode=!1;e.setNodeLineIcos(c,b);break}if(b.isLastNode)break;b=b.getNextNode()}},clearOldLastNode:function(c,a,b){for(a=a.getPreNode();a;){if(a.isLastNode){a.isLastNode=!1;b&&e.setNodeLineIcos(c,a);break}if(a.isFirstNode)break;a=a.getPreNode()}},makeDOMNodeMainBefore:function(c,a,b){a=d.isHidden(a,b);c.push("<li ",a?"style='display:none;' ":"","id='",b.tId,"' class='",
l.className.LEVEL,b.level,"' tabindex='0' hidefocus='true' treenode>")},showNode:function(c,a){d.isHidden(c,a,!1);d.initShowForExCheck(c,a);k(a,c).show()},showNodes:function(c,a,b){if(a&&a.length!=0){var f={},g,i;for(g=0,i=a.length;g<i;g++){var h=a[g];if(!f[h.parentTId]){var u=h.getParentNode();f[h.parentTId]=u===null?d.getRoot(c):h.getParentNode()}e.showNode(c,h,b)}for(var j in f)a=d.nodeChildren(c,f[j]),e.setFirstNodeForShow(c,a),e.setLastNodeForShow(c,a)}},hideNode:function(c,a){d.isHidden(c,a,
!0);a.isFirstNode=!1;a.isLastNode=!1;d.initHideForExCheck(c,a);e.cancelPreSelectedNode(c,a);k(a,c).hide()},hideNodes:function(c,a,b){if(a&&a.length!=0){var f={},g,i;for(g=0,i=a.length;g<i;g++){var h=a[g];if((h.isFirstNode||h.isLastNode)&&!f[h.parentTId]){var j=h.getParentNode();f[h.parentTId]=j===null?d.getRoot(c):h.getParentNode()}e.hideNode(c,h,b)}for(var k in f)a=d.nodeChildren(c,f[k]),e.setFirstNodeForHide(c,a),e.setLastNodeForHide(c,a)}},setFirstNode:function(c,a){var b=d.nodeChildren(c,a),f=
d.isHidden(c,b[0],!1);b.length>0&&!f?b[0].isFirstNode=!0:b.length>0&&e.setFirstNodeForHide(c,b)},setLastNode:function(c,a){var b=d.nodeChildren(c,a),f=d.isHidden(c,b[0]);b.length>0&&!f?b[b.length-1].isLastNode=!0:b.length>0&&e.setLastNodeForHide(c,b)},setFirstNodeForHide:function(c,a){var b,f,g;for(f=0,g=a.length;f<g;f++){b=a[f];if(b.isFirstNode)break;if(!d.isHidden(c,b)&&!b.isFirstNode){b.isFirstNode=!0;e.setNodeLineIcos(c,b);break}else b=null}return b},setFirstNodeForShow:function(c,a){var b,f,
g,i,h;for(f=0,g=a.length;f<g;f++){b=a[f];var j=d.isHidden(c,b);if(!i&&!j&&b.isFirstNode){i=b;break}else if(!i&&!j&&!b.isFirstNode)b.isFirstNode=!0,i=b,e.setNodeLineIcos(c,b);else if(i&&b.isFirstNode){b.isFirstNode=!1;h=b;e.setNodeLineIcos(c,b);break}}return{"new":i,old:h}},setLastNodeForHide:function(c,a){var b,f;for(f=a.length-1;f>=0;f--){b=a[f];if(b.isLastNode)break;if(!d.isHidden(c,b)&&!b.isLastNode){b.isLastNode=!0;e.setNodeLineIcos(c,b);break}else b=null}return b},setLastNodeForShow:function(c,
a){var b,f,g,i;for(f=a.length-1;f>=0;f--){b=a[f];var h=d.isHidden(c,b);if(!g&&!h&&b.isLastNode){g=b;break}else if(!g&&!h&&!b.isLastNode)b.isLastNode=!0,g=b,e.setNodeLineIcos(c,b);else if(g&&b.isLastNode){b.isLastNode=!1;i=b;e.setNodeLineIcos(c,b);break}}return{"new":g,old:i}}},data:{initHideForExCheck:function(c,a){if(d.isHidden(c,a)&&c.check&&c.check.enable){if(typeof a._nocheck=="undefined")a._nocheck=!!a.nocheck,a.nocheck=!0;a.check_Child_State=-1;e.repairParentChkClassWithSelf&&e.repairParentChkClassWithSelf(c,
a)}},initShowForExCheck:function(c,a){if(!d.isHidden(c,a)&&c.check&&c.check.enable){if(typeof a._nocheck!="undefined")a.nocheck=a._nocheck,delete a._nocheck;if(e.setChkClass){var b=k(a,l.id.CHECK,c);e.setChkClass(c,b,a)}e.repairParentChkClassWithSelf&&e.repairParentChkClassWithSelf(c,a)}}}});var j=j.fn.zTree,m=j._z.tools,l=j.consts,e=j._z.view,d=j._z.data,k=m.$;d.isHidden=function(c,a,b){if(!a)return!1;c=c.data.key.isHidden;typeof b!=="undefined"&&(typeof b==="string"&&(b=m.eqs(checked,"true")),a[c]=
!!b);return a[c]};d.exSetting({data:{key:{isHidden:"isHidden"}}});d.addInitNode(function(c,a,b){a=d.isHidden(c,b);d.isHidden(c,b,a);d.initHideForExCheck(c,b)});d.addBeforeA(function(){});d.addZTreeTools(function(c,a){a.showNodes=function(a,b){e.showNodes(c,a,b)};a.showNode=function(a,b){a&&e.showNodes(c,[a],b)};a.hideNodes=function(a,b){e.hideNodes(c,a,b)};a.hideNode=function(a,b){a&&e.hideNodes(c,[a],b)};var b=a.checkNode;if(b)a.checkNode=function(f,e,i,h){(!f||!d.isHidden(c,f))&&b.apply(a,arguments)}});
var n=d.initNode;d.initNode=function(c,a,b,f,g,i,h){var j=(f?f:d.getRoot(c))[c.data.key.children];d.tmpHideFirstNode=e.setFirstNodeForHide(c,j);d.tmpHideLastNode=e.setLastNodeForHide(c,j);h&&(e.setNodeLineIcos(c,d.tmpHideFirstNode),e.setNodeLineIcos(c,d.tmpHideLastNode));g=d.tmpHideFirstNode===b;i=d.tmpHideLastNode===b;n&&n.apply(d,arguments);h&&i&&e.clearOldLastNode(c,b,h)};var o=d.makeChkFlag;if(o)d.makeChkFlag=function(c,a){(!a||!d.isHidden(c,a))&&o.apply(d,arguments)};var p=d.getTreeCheckedNodes;
if(p)d.getTreeCheckedNodes=function(c,a,b,f){if(a&&a.length>0){var e=a[0].getParentNode();if(e&&d.isHidden(c,e))return[]}return p.apply(d,arguments)};var q=d.getTreeChangeCheckedNodes;if(q)d.getTreeChangeCheckedNodes=function(c,a,b){if(a&&a.length>0){var e=a[0].getParentNode();if(e&&d.isHidden(c,e))return[]}return q.apply(d,arguments)};var r=e.expandCollapseSonNode;if(r)e.expandCollapseSonNode=function(c,a,b,f,g){(!a||!d.isHidden(c,a))&&r.apply(e,arguments)};var s=e.setSonNodeCheckBox;if(s)e.setSonNodeCheckBox=
function(c,a,b,f){(!a||!d.isHidden(c,a))&&s.apply(e,arguments)};var t=e.repairParentChkClassWithSelf;if(t)e.repairParentChkClassWithSelf=function(c,a){(!a||!d.isHidden(c,a))&&t.apply(e,arguments)}})(jQuery);




  TreeSelect.prototype.render = function (options) {
    var elem = options.elem,
      // 请求地址
      data = options.data,
      // 请求方式
      type = options.type === undefined ? 'GET' : options.type,
      // 节点点击回调
      click = options.click,
      // 渲染成功后的回调函数
      success = options.success,
      // 占位符（提示信息）
      placeholder = options.placeholder === undefined ? '请选择' : options.placeholder,
      // 是否开启搜索
      search = options.search === undefined ? false : options.search,
      process = options.process;
      // 样式配置项
      style = options.style,
      // 唯一id
      tmp = new Date().getTime(),
      DATA = {},
      selected = 'layui-form-selected',
      TREE_OBJ = undefined,
      TREE_INPUT_ID = 'treeSelect-input-' + tmp,
      TREE_INPUT_CLASS = 'layui-treeselect',
      TREE_SELECT_ID = 'layui-treeSelect-' + tmp,
      TREE_SELECT_CLASS = 'layui-treeSelect',
      TREE_SELECT_TITLE_ID = 'layui-select-title-' + tmp,
      TREE_SELECT_TITLE_CLASS = 'layui-select-title',
      TREE_SELECT_BODY_ID = 'layui-treeSelect-body-' + tmp,
      TREE_SELECT_BODY_CLASS = 'layui-treeSelect-body',
      TREE_SELECT_SEARCHED_CLASS = 'layui-treeSelect-search-ed';


    var a = {
      init: function () {
        $.ajax({
          url: data,
          type: type,
          dataType: 'json',
          success: function (d) {
          	if(process){
          		d = process(d);
          	}
            DATA = d;
            a.hideElem().input().toggleSelect().loadCss().preventEvent();
            $.fn.zTree.init($('#' + TREE_SELECT_BODY_ID), a.setting(), d);
            TREE_OBJ = $.fn.zTree.getZTreeObj(TREE_SELECT_BODY_ID);
            if (search) {
              a.searchParam();
            }
            a.configStyle();
            if (success) {
              var obj = {
                treeId: TREE_SELECT_ID,
                data: d
              };
              success(obj);
            }
          }
        });
        return a;
      },
      // 检查input是否有默认值
      checkDefaultValue: function () {

      },
      setting: function () {
        var setting = {
          callback: {
            onClick: a.onClick,
            onExpand: a.onExpand,
            onCollapse: a.onCollapse,
            beforeExpand: a.ztreeCallBack.beforeExpand
          }
        };
        return setting;
      },
      ztreeCallBack: {
        beforeExpand: function () {
          a.configStyle();
        },
      },
      onCollapse: function () {
        a.focusInput();
      },
      onExpand: function () {
        a.configStyle();
        a.focusInput();
      },
      focusInput: function () {
        $('#' + TREE_INPUT_ID).focus();
      },
      onClick: function (event, treeId, treeNode) {
        var name = treeNode.name,
          id = treeNode.id,
          $input = $('#' + TREE_SELECT_TITLE_ID + ' input');
        $input.val(name);
        $(elem).attr('value', id).val(id);
        $('#' + TREE_SELECT_ID).removeClass(selected);

        if (click) {
          var obj = {
            data: DATA,
            current: treeNode,
            treeId: TREE_SELECT_ID
          };
          click(obj);
        }
        return a;
      },
      hideElem: function () {
        $(elem).hide();
        return a;
      },
      input: function () {
        var readonly = '';
        if (!search) {
          readonly = 'readonly';
        }
        var selectHtml = '<div class="' + TREE_SELECT_CLASS + ' layui-unselect layui-form-select" id="' + TREE_SELECT_ID + '">' +
          '<div class="' + TREE_SELECT_TITLE_CLASS + '" id="' + TREE_SELECT_TITLE_ID + '">' +
          ' <input type="text" id="' + TREE_INPUT_ID + '" placeholder="' + placeholder + '" value="" ' + readonly + ' class="layui-input layui-unselect">' +
          '<i class="layui-edge"></i>' +
          '</div>' +
          '<div class="layui-anim layui-anim-upbit" style="">' +
          '<div class="' + TREE_SELECT_BODY_CLASS + ' ztree" id="' + TREE_SELECT_BODY_ID + '"></div>' +
          '</div>' +
          '</div>';
        $(elem).parent().append(selectHtml);
        return a;
      },
      /**
       * 展开/折叠下拉框
       */
      toggleSelect: function () {
        var item = '#' + TREE_SELECT_TITLE_ID;
        a.event('click', item, function (e) {
          var $select = $('#' + TREE_SELECT_ID);
          if ($select.hasClass(selected)) {
            $select.removeClass(selected);
            $('#' + TREE_INPUT_ID).blur();
          } else {
            // 隐藏其他picker
            $('.layui-form-select').removeClass(selected);
            // 显示当前picker
            $select.addClass(selected);
          }
          e.stopPropagation();
        });
        $(document).click(function () {
          var $select = $('#' + TREE_SELECT_ID);
          if ($select.hasClass(selected)) {
            $select.removeClass(selected);
            $('#' + TREE_INPUT_ID).blur();
          }
        });
        return a;
      },
      // 模糊查询
      searchParam: function () {
        if (!search) {
          return;
        }

        var item = '#' + TREE_INPUT_ID;
        a.fuzzySearch(item, null, true);
      },
      fuzzySearch: function (searchField, isHighLight, isExpand) {
        var zTreeObj = TREE_OBJ;//get the ztree object by ztree id
        if (!zTreeObj) {
          alert("fail to get ztree object");
        }
        var nameKey = zTreeObj.setting.data.key.name; //get the key of the node name
        isHighLight = isHighLight === false ? false : true;//default true, only use false to disable highlight
        isExpand = isExpand ? true : false; // not to expand in default
        zTreeObj.setting.view.nameIsHTML = isHighLight; //allow use html in node name for highlight use

        var metaChar = '[\\[\\]\\\\\^\\$\\.\\|\\?\\*\\+\\(\\)]'; //js meta characters
        var rexMeta = new RegExp(metaChar, 'gi');//regular expression to match meta characters

        // keywords filter function 
        function ztreeFilter(zTreeObj, _keywords, callBackFunc) {
          if (!_keywords) {
            _keywords = ''; //default blank for _keywords 
          }

          // function to find the matching node
          function filterFunc(node) {
            if (node && node.oldname && node.oldname.length > 0) {
              node[nameKey] = node.oldname; //recover oldname of the node if exist
            }
            zTreeObj.updateNode(node); //update node to for modifications take effect
            if (_keywords.length == 0) {
              //return true to show all nodes if the keyword is blank
              zTreeObj.showNode(node);
              zTreeObj.expandNode(node, isExpand);
              return true;
            }
            //transform node name and keywords to lowercase
            if (node[nameKey] && node[nameKey].toLowerCase().indexOf(_keywords.toLowerCase()) != -1) {
              zTreeObj.showNode(node);//show node with matching keywords
              return true; //return true and show this node
            }

            zTreeObj.hideNode(node); // hide node that not matched
            return false; //return false for node not matched
          }

          var nodesShow = zTreeObj.getNodesByFilter(filterFunc); //get all nodes that would be shown
          processShowNodes(nodesShow, _keywords);//nodes should be reprocessed to show correctly
        }

        /**
         * reprocess of nodes before showing
         */
        function processShowNodes(nodesShow, _keywords) {
          if (nodesShow && nodesShow.length > 0) {
            //process the ancient nodes if _keywords is not blank
            if (_keywords.length > 0) {
              $.each(nodesShow, function (n, obj) {
                var pathOfOne = obj.getPath();//get all the ancient nodes including current node
                if (pathOfOne && pathOfOne.length > 0) {
                  //i < pathOfOne.length-1 process every node in path except self
                  for (var i = 0; i < pathOfOne.length - 1; i++) {
                    zTreeObj.showNode(pathOfOne[i]); //show node 
                    zTreeObj.expandNode(pathOfOne[i], true); //expand node
                  }
                }
              });
            } else { //show all nodes when _keywords is blank and expand the root nodes
              var rootNodes = zTreeObj.getNodesByParam('level', '0');//get all root nodes
              $.each(rootNodes, function (n, obj) {
                zTreeObj.expandNode(obj, true); //expand all root nodes
              });
            }
          }
        }

        //listen to change in input element
        $(searchField).bind('input propertychange', function () {
          var _keywords = $(this).val();
          searchNodeLazy(_keywords); //call lazy load
        });

        var timeoutId = null;
        // excute lazy load once after input change, the last pending task will be cancled  
        function searchNodeLazy(_keywords) {
          if (timeoutId) {
            //clear pending task
            clearTimeout(timeoutId);
          }
          timeoutId = setTimeout(function () {
            ztreeFilter(zTreeObj, _keywords); //lazy load ztreeFilter function 
            $(searchField).focus();//focus input field again after filtering
          }, 200);
        }
      },
      checkNodes: function (nodes) {
        for (var i = 0; i < nodes.length; i++) {
          var o = nodes[i],
            pid = o.parentTId,
            tid = o.tId;
          if (pid !== null) {
            // 获取父节点
            $('#' + pid).addClass(TREE_SELECT_SEARCHED_CLASS);
            var pNode = TREE_OBJ.getNodesByParam("tId", pid, null);
            TREE_OBJ.expandNode(pNode[0], true, false, true);
          }
          $('#' + tid).addClass(TREE_SELECT_SEARCHED_CLASS);
        }
      },
      // 阻止Layui的一些默认事件
      preventEvent: function () {
        var item = '#' + TREE_SELECT_ID + ' .layui-anim';
        a.event('click', item, function (e) {
          e.stopPropagation();
        });
        return a;
      },
      loadCss: function () {
        var ztree = '.ztree *{padding:0;margin:0;font-size:12px;font-family:Verdana,Arial,Helvetica,AppleGothic,sans-serif}.ztree{margin:0;padding:5px;color:#333}.ztree li{padding:0;margin:0;list-style:none;line-height:14px;text-align:left;white-space:nowrap;outline:0}.ztree li ul{margin:0;padding:0 0 0 18px}.ztree li ul.line{background:url(./img/line_conn.gif) 0 0 repeat-y;}.ztree li a{padding:1px 3px 0 0;margin:0;cursor:pointer;height:17px;color:#333;background-color:transparent;text-decoration:none;vertical-align:top;display:inline-block}.ztree li a:hover{text-decoration:underline}.ztree li a.curSelectedNode{padding-top:0px;background-color:#FFE6B0;color:black;height:16px;border:1px #FFB951 solid;opacity:0.8;}.ztree li a.curSelectedNode_Edit{padding-top:0px;background-color:#FFE6B0;color:black;height:16px;border:1px #FFB951 solid;opacity:0.8;}.ztree li a.tmpTargetNode_inner{padding-top:0px;background-color:#316AC5;color:white;height:16px;border:1px #316AC5 solid;opacity:0.8;filter:alpha(opacity=80)}.ztree li a.tmpTargetNode_prev{}.ztree li a.tmpTargetNode_next{}.ztree li a input.rename{height:14px;width:80px;padding:0;margin:0;font-size:12px;border:1px #7EC4CC solid;*border:0px}.ztree li span{line-height:16px;margin-right:2px}.ztree li span.button{line-height:0;margin:0;width:16px;height:16px;display:inline-block;vertical-align:middle;border:0 none;cursor:pointer;outline:none;background-color:transparent;background-repeat:no-repeat;background-attachment:scroll;background-image:url("./img/zTreeStandard.png");*background-image:url("./img/zTreeStandard.gif")}.ztree li span.button.chk{width:13px;height:13px;margin:0 3px 0 0;cursor:auto}.ztree li span.button.chk.checkbox_false_full{background-position:0 0}.ztree li span.button.chk.checkbox_false_full_focus{background-position:0 -14px}.ztree li span.button.chk.checkbox_false_part{background-position:0 -28px}.ztree li span.button.chk.checkbox_false_part_focus{background-position:0 -42px}.ztree li span.button.chk.checkbox_false_disable{background-position:0 -56px}.ztree li span.button.chk.checkbox_true_full{background-position:-14px 0}.ztree li span.button.chk.checkbox_true_full_focus{background-position:-14px -14px}.ztree li span.button.chk.checkbox_true_part{background-position:-14px -28px}.ztree li span.button.chk.checkbox_true_part_focus{background-position:-14px -42px}.ztree li span.button.chk.checkbox_true_disable{background-position:-14px -56px}.ztree li span.button.chk.radio_false_full{background-position:-28px 0}.ztree li span.button.chk.radio_false_full_focus{background-position:-28px -14px}.ztree li span.button.chk.radio_false_part{background-position:-28px -28px}.ztree li span.button.chk.radio_false_part_focus{background-position:-28px -42px}.ztree li span.button.chk.radio_false_disable{background-position:-28px -56px}.ztree li span.button.chk.radio_true_full{background-position:-42px 0}.ztree li span.button.chk.radio_true_full_focus{background-position:-42px -14px}.ztree li span.button.chk.radio_true_part{background-position:-42px -28px}.ztree li span.button.chk.radio_true_part_focus{background-position:-42px -42px}.ztree li span.button.chk.radio_true_disable{background-position:-42px -56px}.ztree li span.button.switch{width:18px;height:18px}.ztree li span.button.root_open{background-position:-92px -54px}.ztree li span.button.root_close{background-position:-74px -54px}.ztree li span.button.roots_open{background-position:-92px 0}.ztree li span.button.roots_close{background-position:-74px 0}.ztree li span.button.center_open{background-position:-92px -18px}.ztree li span.button.center_close{background-position:-74px -18px}.ztree li span.button.bottom_open{background-position:-92px -36px}.ztree li span.button.bottom_close{background-position:-74px -36px}.ztree li span.button.noline_open{background-position:-92px -72px}.ztree li span.button.noline_close{background-position:-74px -72px}.ztree li span.button.root_docu{background:none;}.ztree li span.button.roots_docu{background-position:-56px 0}.ztree li span.button.center_docu{background-position:-56px -18px}.ztree li span.button.bottom_docu{background-position:-56px -36px}.ztree li span.button.noline_docu{background:none;}.ztree li span.button.ico_open{display:none!important;margin-right:2px;background-position:-110px -16px;vertical-align:top;*vertical-align:middle}.ztree li span.button.ico_close{display:none!important;margin-right:2px;background-position:-110px 0;vertical-align:top;*vertical-align:middle}.ztree li span.button.ico_docu{margin-right:2px;background-position:-110px -32px;vertical-align:top;*vertical-align:middle}.ztree li span.button.edit{margin-right:2px;background-position:-110px -48px;vertical-align:top;*vertical-align:middle}.ztree li span.button.remove{margin-right:2px;background-position:-110px -64px;vertical-align:top;*vertical-align:middle}.ztree li span.button.ico_loading{margin-right:2px;background:url(./img/loading.gif) no-repeat scroll 0 0 transparent;vertical-align:top;*vertical-align:middle}ul.tmpTargetzTree{background-color:#FFE6B0;opacity:0.8;filter:alpha(opacity=80)}span.tmpzTreeMove_arrow{width:16px;height:16px;display:inline-block;padding:0;margin:2px 0 0 1px;border:0 none;position:absolute;background-color:transparent;background-repeat:no-repeat;background-attachment:scroll;background-position:-110px -80px;background-image:url("./img/zTreeStandard.png");*background-image:url("./img/zTreeStandard.gif")}ul.ztree.zTreeDragUL{margin:0;padding:0;position:absolute;width:auto;height:auto;overflow:hidden;background-color:#cfcfcf;border:1px #00B83F dotted;opacity:0.8;filter:alpha(opacity=80)}.zTreeMask{z-index:10000;background-color:#cfcfcf;opacity:0.0;filter:alpha(opacity=0);position:absolute}',
          ztree_ex = '.layui-treeSelect .ztree li span.button{font-family:layui-icon!important;font-size:16px;font-style:normal;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;background:none;line-height:inherit;}.layui-treeSelect .ztree li span.button.ico_open{display:none;}.layui-treeSelect .ztree li span.button.ico_close{display:none;}.layui-treeSelect .ztree li span.button.ico_docu:before{content:"\\e621";}.layui-treeSelect .ztree li span.button.bottom_close:before,.layui-treeSelect .ztree li span.button.center_close:before,.layui-treeSelect .ztree li span.button.roots_close:before,.layui-treeSelect .ztree li span.button.root_close:before{content:"\\e623";}.layui-treeSelect .ztree li span.button.bottom_open:before,.layui-treeSelect .ztree li span.button.roots_open:before,.layui-treeSelect .ztree li span.button.center_open:before,.layui-treeSelect .ztree li span.button.root_open:before{content:"\\e625";}.layui-treeSelect .ztree li a:hover{text-decoration:none;}.layui-treeSelect .ztree *{font-size:14px;}.layui-treeSelect .ztree li{line-height:inherit;padding:2px 0;}.layui-treeSelect .ztree li span.button.switch{position:relative;top:-1px;}.layui-treeSelect .ztree li a,.ztree li span{line-height:18px;height:inherit;}.layui-treeSelect .ztree li a.curSelectedNode{color:#5FB878;background:none;border:none;height:inherit;padding-top:1px;}.layui-treeSelect .layui-anim::-webkit-scrollbar{width:6px;height:6px;background-color:#F5F5F5;}.layui-treeSelect .layui-anim::-webkit-scrollbar-track{box-shadow:inset 0 0 6px rgba(107,98,98,0.3);border-radius:10px;background-color:#F5F5F5;}.layui-treeSelect .layui-anim::-webkit-scrollbar-thumb{border-radius:10px;box-shadow:inset 0 0 6px rgba(107,98,98,0.3);background-color:#555;}.layui-treeSelect.layui-form-select .layui-anim{display:none;position:absolute;left:0;top:42px;padding:5px 0;z-index:9999;min-width:100%;border:1px solid #d2d2d2;max-height:185px;overflow-y:auto;background-color:#fff;border-radius:2px;box-shadow:0 2px 4px rgba(0,0,0,.12);box-sizing:border-box;}.layui-treeSelect.layui-form-selected .layui-anim{display:block;}.layui-treeSelect .ztree li ul.line{background:none;position:relative;}.layui-treeSelect .ztree li ul.line:before{content:"";height:100%;border-left:1px dotted #ece;position:absolute;left:8px;}.layui-treeSelect .ztree li .center_docu:before,.ztree li .bottom_docu::before{content:"";height:100%;border-left:1px dotted #ece;position:absolute;left:8px;}.layui-treeSelect .ztree li .center_docu::after,.ztree li .bottom_docu::after{content:"";position:absolute;left:8px;top:8px;width:8px;border-top:1px dotted #ece;}.layui-treeSelect .ztree li span.button.ico_open{display:inline-block;position:relative;top:1px;}.layui-treeSelect .ztree li span.button.ico_close{display:inline-block;position:relative;top:1px;}.layui-treeSelect .ztree li span.button.ico_open:before{content:"\\e643";}.layui-treeSelect .ztree li span.button.ico_close:before{content:"\\e63f";}';
        $head = $('head'),
          ztreeStyle = $head.find('style[ztree]');

        if (ztreeStyle.length === 0) {
          $head.append($('<style ztree>').append(ztree).append(ztree_ex))
        }
        return a;
      },
      configStyle: function () {
        if (style == undefined || style.line == undefined || !style.line.enable) {
          $('#' + TREE_SELECT_ID).find('li .center_docu,li .bottom_docu').hide();
          //.layui-treeSelect .ztree li .center_docu:before, .ztree li .bottom_docu::before
        }

        if (style == undefined || style.folder == undefined || !style.folder.enable) {
          $('#' + TREE_SELECT_ID).find('li span.button.ico_open').hide();
          $('#' + TREE_SELECT_ID).find('li span.button.ico_close').hide();
        }
      },
      event: function (evt, el, fn) {
        $('body').on(evt, el, fn);
      }
    };
    a.init();
    return new TreeSelect();
  };

  /**
   * 重新加载trerSelect
   * @param filter
   */
  TreeSelect.prototype.refresh = function (filter) {
      var treeObj = obj.treeObj(filter);
      treeObj.reAsyncChildNodes(null, "refresh");
  };

  /**
   * 选中节点，因为tree是异步加载，所以必须在success回调中调用checkNode函数，否则无法获取生成的DOM元素
   * @param filter lay-filter属性
   * @param id 选中的id
   */
  TreeSelect.prototype.checkNode = function(filter, id){
    var o = obj.filter(filter),
        treeInput = o.find('.layui-select-title input'),
        treeObj = obj.treeObj(filter),
        node = treeObj.getNodeByParam("id", id, null),
        name = node.name;
    treeInput.val(name);
    o.find('a[treenode_a]').removeClass('curSelectedNode');
    obj.get(filter).val(id).attr('value', id);
    treeObj.selectNode(node);
  };

  /**
   * 撤销选中的节点
   * @param filter lay-filter属性
   * @param fn 回调函数
   */
  TreeSelect.prototype.revokeNode = function(filter, fn){
    var o = obj.filter(filter);
    o.find('a[treenode_a]').removeClass('curSelectedNode');
    o.find('.layui-select-title input.layui-input').val('');
    obj.get(filter).attr('value', '').val('');
    obj.treeObj(filter).expandAll(false);
    if (fn){
      fn({
        treeId: o.attr('id')
      });
    }
  }

  /**
   * 销毁组件
   */
  TreeSelect.prototype.destroy = function(filter) {
    var o = obj.filter(filter);
    o.remove();
    obj.get(filter).show();
  }

  /**
   * 获取zTree对象，可调用所有zTree函数
   * @param filter
   */
  TreeSelect.prototype.zTree = function (filter) {
    return obj.treeObj(filter);
  };

  var obj = {
    get: function(filter){
      if (!filter) {
        layui.hint().error('filter 不能为空');
      }
      return $('*[lay-filter='+ filter +']');
    },
    filter: function(filter){
      var tf = obj.get(filter),
          o = tf.next();
      return o;
    },
    treeObj: function (filter) {
      var o = obj.filter(filter),
          treeId = o.find('.layui-treeSelect-body').attr('id'),
          tree = $.fn.zTree.getZTreeObj(treeId);
      return tree;
    }
  };

  //输出接口
  var mod = new TreeSelect();
  exports(_MOD, mod);
});    