/*
	Copyright (c) 2004-2012, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

/*
	This is an optimized version of Dojo, built for deployment and not for
	development. To get sources and documentation, please visit:

		http://dojotoolkit.org
*/

//>>built
require({cache:{"dijit/popup":function(){
define("dijit/popup",["dojo/_base/array","dojo/aspect","dojo/_base/connect","dojo/_base/declare","dojo/dom","dojo/dom-attr","dojo/dom-construct","dojo/dom-geometry","dojo/dom-style","dojo/_base/event","dojo/keys","dojo/_base/lang","dojo/on","dojo/sniff","./place","./BackgroundIframe","./main"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,on,_d,_e,_f,_10){
function _11(){
if(this._popupWrapper){
_7.destroy(this._popupWrapper);
delete this._popupWrapper;
}
};
var _12=_4(null,{_stack:[],_beginZIndex:1000,_idGen:1,_createWrapper:function(_13){
var _14=_13._popupWrapper,_15=_13.domNode;
if(!_14){
_14=_7.create("div",{"class":"dijitPopup",style:{display:"none"},role:"presentation"},_13.ownerDocumentBody);
_14.appendChild(_15);
var s=_15.style;
s.display="";
s.visibility="";
s.position="";
s.top="0px";
_13._popupWrapper=_14;
_2.after(_13,"destroy",_11,true);
}
return _14;
},moveOffScreen:function(_16){
var _17=this._createWrapper(_16);
_9.set(_17,{visibility:"hidden",top:"-9999px",display:""});
},hide:function(_18){
var _19=this._createWrapper(_18);
_9.set(_19,"display","none");
},getTopPopup:function(){
var _1a=this._stack;
for(var pi=_1a.length-1;pi>0&&_1a[pi].parent===_1a[pi-1].widget;pi--){
}
return _1a[pi];
},open:function(_1b){
var _1c=this._stack,_1d=_1b.popup,_1e=_1b.orient||["below","below-alt","above","above-alt"],ltr=_1b.parent?_1b.parent.isLeftToRight():_8.isBodyLtr(_1d.ownerDocument),_1f=_1b.around,id=(_1b.around&&_1b.around.id)?(_1b.around.id+"_dropdown"):("popup_"+this._idGen++);
while(_1c.length&&(!_1b.parent||!_5.isDescendant(_1b.parent.domNode,_1c[_1c.length-1].widget.domNode))){
this.close(_1c[_1c.length-1].widget);
}
var _20=this._createWrapper(_1d);
_6.set(_20,{id:id,style:{zIndex:this._beginZIndex+_1c.length},"class":"dijitPopup "+(_1d.baseClass||_1d["class"]||"").split(" ")[0]+"Popup",dijitPopupParent:_1b.parent?_1b.parent.id:""});
if(_d("ie")||_d("mozilla")){
if(!_1d.bgIframe){
_1d.bgIframe=new _f(_20);
}
}
var _21=_1f?_e.around(_20,_1f,_1e,ltr,_1d.orient?_c.hitch(_1d,"orient"):null):_e.at(_20,_1b,_1e=="R"?["TR","BR","TL","BL"]:["TL","BL","TR","BR"],_1b.padding);
_20.style.display="";
_20.style.visibility="visible";
_1d.domNode.style.visibility="visible";
var _22=[];
_22.push(on(_20,_3._keypress,_c.hitch(this,function(evt){
if(evt.charOrCode==_b.ESCAPE&&_1b.onCancel){
_a.stop(evt);
_1b.onCancel();
}else{
if(evt.charOrCode===_b.TAB){
_a.stop(evt);
var _23=this.getTopPopup();
if(_23&&_23.onCancel){
_23.onCancel();
}
}
}
})));
if(_1d.onCancel&&_1b.onCancel){
_22.push(_1d.on("cancel",_1b.onCancel));
}
_22.push(_1d.on(_1d.onExecute?"execute":"change",_c.hitch(this,function(){
var _24=this.getTopPopup();
if(_24&&_24.onExecute){
_24.onExecute();
}
})));
_1c.push({widget:_1d,parent:_1b.parent,onExecute:_1b.onExecute,onCancel:_1b.onCancel,onClose:_1b.onClose,handlers:_22});
if(_1d.onOpen){
_1d.onOpen(_21);
}
return _21;
},close:function(_25){
var _26=this._stack;
while((_25&&_1.some(_26,function(_27){
return _27.widget==_25;
}))||(!_25&&_26.length)){
var top=_26.pop(),_28=top.widget,_29=top.onClose;
if(_28.onClose){
_28.onClose();
}
var h;
while(h=top.handlers.pop()){
h.remove();
}
if(_28&&_28.domNode){
this.hide(_28);
}
if(_29){
_29();
}
}
}});
return (_10.popup=new _12());
});
},"dojo/string":function(){
define(["./_base/kernel","./_base/lang"],function(_2a,_2b){
var _2c={};
_2b.setObject("dojo.string",_2c);
_2c.rep=function(str,num){
if(num<=0||!str){
return "";
}
var buf=[];
for(;;){
if(num&1){
buf.push(str);
}
if(!(num>>=1)){
break;
}
str+=str;
}
return buf.join("");
};
_2c.pad=function(_2d,_2e,ch,end){
if(!ch){
ch="0";
}
var out=String(_2d),pad=_2c.rep(ch,Math.ceil((_2e-out.length)/ch.length));
return end?out+pad:pad+out;
};
_2c.substitute=function(_2f,map,_30,_31){
_31=_31||_2a.global;
_30=_30?_2b.hitch(_31,_30):function(v){
return v;
};
return _2f.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g,function(_32,key,_33){
var _34=_2b.getObject(key,false,map);
if(_33){
_34=_2b.getObject(_33,false,_31).call(_31,_34,key);
}
return _30(_34,key).toString();
});
};
_2c.trim=String.prototype.trim?_2b.trim:function(str){
str=str.replace(/^\s+/,"");
for(var i=str.length-1;i>=0;i--){
if(/\S/.test(str.charAt(i))){
str=str.substring(0,i+1);
break;
}
}
return str;
};
return _2c;
});
},"dijit/a11y":function(){
define("dijit/a11y",["dojo/_base/array","dojo/_base/config","dojo/_base/declare","dojo/dom","dojo/dom-attr","dojo/dom-style","dojo/sniff","./main"],function(_35,_36,_37,dom,_38,_39,has,_3a){
var _3b=(_3a._isElementShown=function(_3c){
var s=_39.get(_3c);
return (s.visibility!="hidden")&&(s.visibility!="collapsed")&&(s.display!="none")&&(_38.get(_3c,"type")!="hidden");
});
_3a.hasDefaultTabStop=function(_3d){
switch(_3d.nodeName.toLowerCase()){
case "a":
return _38.has(_3d,"href");
case "area":
case "button":
case "input":
case "object":
case "select":
case "textarea":
return true;
case "iframe":
var _3e;
try{
var _3f=_3d.contentDocument;
if("designMode" in _3f&&_3f.designMode=="on"){
return true;
}
_3e=_3f.body;
}
catch(e1){
try{
_3e=_3d.contentWindow.document.body;
}
catch(e2){
return false;
}
}
return _3e&&(_3e.contentEditable=="true"||(_3e.firstChild&&_3e.firstChild.contentEditable=="true"));
default:
return _3d.contentEditable=="true";
}
};
var _40=(_3a.isTabNavigable=function(_41){
if(_38.get(_41,"disabled")){
return false;
}else{
if(_38.has(_41,"tabIndex")){
return _38.get(_41,"tabIndex")>=0;
}else{
return _3a.hasDefaultTabStop(_41);
}
}
});
_3a._getTabNavigable=function(_42){
var _43,_44,_45,_46,_47,_48,_49={};
function _4a(_4b){
return _4b&&_4b.tagName.toLowerCase()=="input"&&_4b.type&&_4b.type.toLowerCase()=="radio"&&_4b.name&&_4b.name.toLowerCase();
};
var _4c=function(_4d){
for(var _4e=_4d.firstChild;_4e;_4e=_4e.nextSibling){
if(_4e.nodeType!=1||(has("ie")<=9&&_4e.scopeName!=="HTML")||!_3b(_4e)){
continue;
}
if(_40(_4e)){
var _4f=+_38.get(_4e,"tabIndex");
if(!_38.has(_4e,"tabIndex")||_4f==0){
if(!_43){
_43=_4e;
}
_44=_4e;
}else{
if(_4f>0){
if(!_45||_4f<_46){
_46=_4f;
_45=_4e;
}
if(!_47||_4f>=_48){
_48=_4f;
_47=_4e;
}
}
}
var rn=_4a(_4e);
if(_38.get(_4e,"checked")&&rn){
_49[rn]=_4e;
}
}
if(_4e.nodeName.toUpperCase()!="SELECT"){
_4c(_4e);
}
}
};
if(_3b(_42)){
_4c(_42);
}
function rs(_50){
return _49[_4a(_50)]||_50;
};
return {first:rs(_43),last:rs(_44),lowest:rs(_45),highest:rs(_47)};
};
_3a.getFirstInTabbingOrder=function(_51,doc){
var _52=_3a._getTabNavigable(dom.byId(_51,doc));
return _52.lowest?_52.lowest:_52.first;
};
_3a.getLastInTabbingOrder=function(_53,doc){
var _54=_3a._getTabNavigable(dom.byId(_53,doc));
return _54.last?_54.last:_54.highest;
};
return {hasDefaultTabStop:_3a.hasDefaultTabStop,isTabNavigable:_3a.isTabNavigable,_getTabNavigable:_3a._getTabNavigable,getFirstInTabbingOrder:_3a.getFirstInTabbingOrder,getLastInTabbingOrder:_3a.getLastInTabbingOrder};
});
},"dijit/WidgetSet":function(){
define("dijit/WidgetSet",["dojo/_base/array","dojo/_base/declare","dojo/_base/kernel","./registry"],function(_55,_56,_57,_58){
var _59=_56("dijit.WidgetSet",null,{constructor:function(){
this._hash={};
this.length=0;
},add:function(_5a){
if(this._hash[_5a.id]){
throw new Error("Tried to register widget with id=="+_5a.id+" but that id is already registered");
}
this._hash[_5a.id]=_5a;
this.length++;
},remove:function(id){
if(this._hash[id]){
delete this._hash[id];
this.length--;
}
},forEach:function(_5b,_5c){
_5c=_5c||_57.global;
var i=0,id;
for(id in this._hash){
_5b.call(_5c,this._hash[id],i++,this._hash);
}
return this;
},filter:function(_5d,_5e){
_5e=_5e||_57.global;
var res=new _59(),i=0,id;
for(id in this._hash){
var w=this._hash[id];
if(_5d.call(_5e,w,i++,this._hash)){
res.add(w);
}
}
return res;
},byId:function(id){
return this._hash[id];
},byClass:function(cls){
var res=new _59(),id,_5f;
for(id in this._hash){
_5f=this._hash[id];
if(_5f.declaredClass==cls){
res.add(_5f);
}
}
return res;
},toArray:function(){
var ar=[];
for(var id in this._hash){
ar.push(this._hash[id]);
}
return ar;
},map:function(_60,_61){
return _55.map(this.toArray(),_60,_61);
},every:function(_62,_63){
_63=_63||_57.global;
var x=0,i;
for(i in this._hash){
if(!_62.call(_63,this._hash[i],x++,this._hash)){
return false;
}
}
return true;
},some:function(_64,_65){
_65=_65||_57.global;
var x=0,i;
for(i in this._hash){
if(_64.call(_65,this._hash[i],x++,this._hash)){
return true;
}
}
return false;
}});
_55.forEach(["forEach","filter","byClass","map","every","some"],function(_66){
_58[_66]=_59.prototype[_66];
});
return _59;
});
},"dijit/_base/wai":function(){
define("dijit/_base/wai",["dojo/dom-attr","dojo/_base/lang","../main","../hccss"],function(_67,_68,_69){
var _6a={hasWaiRole:function(_6b,_6c){
var _6d=this.getWaiRole(_6b);
return _6c?(_6d.indexOf(_6c)>-1):(_6d.length>0);
},getWaiRole:function(_6e){
return _68.trim((_67.get(_6e,"role")||"").replace("wairole:",""));
},setWaiRole:function(_6f,_70){
_67.set(_6f,"role",_70);
},removeWaiRole:function(_71,_72){
var _73=_67.get(_71,"role");
if(!_73){
return;
}
if(_72){
var t=_68.trim((" "+_73+" ").replace(" "+_72+" "," "));
_67.set(_71,"role",t);
}else{
_71.removeAttribute("role");
}
},hasWaiState:function(_74,_75){
return _74.hasAttribute?_74.hasAttribute("aria-"+_75):!!_74.getAttribute("aria-"+_75);
},getWaiState:function(_76,_77){
return _76.getAttribute("aria-"+_77)||"";
},setWaiState:function(_78,_79,_7a){
_78.setAttribute("aria-"+_79,_7a);
},removeWaiState:function(_7b,_7c){
_7b.removeAttribute("aria-"+_7c);
}};
_68.mixin(_69,_6a);
return _69;
});
},"dijit/Viewport":function(){
define("dijit/Viewport",["dojo/Evented","dojo/on","dojo/ready","dojo/sniff","dojo/_base/window","dojo/window"],function(_7d,on,_7e,has,win,_7f){
var _80=new _7d();
_7e(200,function(){
var _81=_7f.getBox();
_80._rlh=on(win.global,"resize",function(){
var _82=_7f.getBox();
if(_81.h==_82.h&&_81.w==_82.w){
return;
}
_81=_82;
_80.emit("resize");
});
if(has("ie")==8){
var _83=screen.deviceXDPI;
setInterval(function(){
if(screen.deviceXDPI!=_83){
_83=screen.deviceXDPI;
_80.emit("resize");
}
},500);
}
});
return _80;
});
},"dojo/hccss":function(){
define(["require","./_base/config","./dom-class","./dom-style","./has","./ready","./_base/window"],function(_84,_85,_86,_87,has,_88,win){
has.add("highcontrast",function(){
var div=win.doc.createElement("div");
div.style.cssText="border: 1px solid; border-color:red green; position: absolute; height: 5px; top: -999px;"+"background-image: url("+(_85.blankGif||_84.toUrl("./resources/blank.gif"))+");";
win.body().appendChild(div);
var cs=_87.getComputedStyle(div),_89=cs.backgroundImage,hc=(cs.borderTopColor==cs.borderRightColor)||(_89&&(_89=="none"||_89=="url(invalid-url:)"));
if(has("ie")<=8){
div.outerHTML="";
}else{
win.body().removeChild(div);
}
return hc;
});
_88(90,function(){
if(has("highcontrast")){
_86.add(win.body(),"dj_a11y");
}
});
return has;
});
},"dijit/_WidgetBase":function(){
define("dijit/_WidgetBase",["require","dojo/_base/array","dojo/aspect","dojo/_base/config","dojo/_base/connect","dojo/_base/declare","dojo/dom","dojo/dom-attr","dojo/dom-class","dojo/dom-construct","dojo/dom-geometry","dojo/dom-style","dojo/has","dojo/_base/kernel","dojo/_base/lang","dojo/on","dojo/ready","dojo/Stateful","dojo/topic","dojo/_base/window","./Destroyable","./registry"],function(_8a,_8b,_8c,_8d,_8e,_8f,dom,_90,_91,_92,_93,_94,has,_95,_96,on,_97,_98,_99,win,_9a,_9b){
has.add("dijit-legacy-requires",!_95.isAsync);
if(has("dijit-legacy-requires")){
_97(0,function(){
var _9c=["dijit/_base/manager"];
_8a(_9c);
});
}
var _9d={};
function _9e(obj){
var ret={};
for(var _9f in obj){
ret[_9f.toLowerCase()]=true;
}
return ret;
};
function _a0(_a1){
return function(val){
_90[val?"set":"remove"](this.domNode,_a1,val);
this._set(_a1,val);
};
};
return _8f("dijit._WidgetBase",[_98,_9a],{id:"",_setIdAttr:"domNode",lang:"",_setLangAttr:_a0("lang"),dir:"",_setDirAttr:_a0("dir"),textDir:"","class":"",_setClassAttr:{node:"domNode",type:"class"},style:"",title:"",tooltip:"",baseClass:"",srcNodeRef:null,domNode:null,containerNode:null,ownerDocument:null,_setOwnerDocumentAttr:function(val){
this._set("ownerDocument",val);
},attributeMap:{},_blankGif:_8d.blankGif||_8a.toUrl("dojo/resources/blank.gif"),postscript:function(_a2,_a3){
this.create(_a2,_a3);
},create:function(_a4,_a5){
this.srcNodeRef=dom.byId(_a5);
this._connects=[];
this._supportingWidgets=[];
if(this.srcNodeRef&&(typeof this.srcNodeRef.id=="string")){
this.id=this.srcNodeRef.id;
}
if(_a4){
this.params=_a4;
_96.mixin(this,_a4);
}
this.postMixInProperties();
if(!this.id){
this.id=_9b.getUniqueId(this.declaredClass.replace(/\./g,"_"));
if(this.params){
delete this.params.id;
}
}
this.ownerDocument=this.ownerDocument||(this.srcNodeRef?this.srcNodeRef.ownerDocument:win.doc);
this.ownerDocumentBody=win.body(this.ownerDocument);
_9b.add(this);
this.buildRendering();
var _a6;
if(this.domNode){
this._applyAttributes();
var _a7=this.srcNodeRef;
if(_a7&&_a7.parentNode&&this.domNode!==_a7){
_a7.parentNode.replaceChild(this.domNode,_a7);
_a6=true;
}
this.domNode.setAttribute("widgetId",this.id);
}
this.postCreate();
if(_a6){
delete this.srcNodeRef;
}
this._created=true;
},_applyAttributes:function(){
var _a8=this.constructor,_a9=_a8._setterAttrs;
if(!_a9){
_a9=(_a8._setterAttrs=[]);
for(var _aa in this.attributeMap){
_a9.push(_aa);
}
var _ab=_a8.prototype;
for(var _ac in _ab){
if(_ac in this.attributeMap){
continue;
}
var _ad="_set"+_ac.replace(/^[a-z]|-[a-zA-Z]/g,function(c){
return c.charAt(c.length-1).toUpperCase();
})+"Attr";
if(_ad in _ab){
_a9.push(_ac);
}
}
}
var _ae={};
for(var key in this.params||{}){
_ae[key]=this[key];
}
_8b.forEach(_a9,function(_af){
if(_af in _ae){
}else{
if(this[_af]){
this.set(_af,this[_af]);
}
}
},this);
for(key in _ae){
this.set(key,_ae[key]);
}
},postMixInProperties:function(){
},buildRendering:function(){
if(!this.domNode){
this.domNode=this.srcNodeRef||this.ownerDocument.createElement("div");
}
if(this.baseClass){
var _b0=this.baseClass.split(" ");
if(!this.isLeftToRight()){
_b0=_b0.concat(_8b.map(_b0,function(_b1){
return _b1+"Rtl";
}));
}
_91.add(this.domNode,_b0);
}
},postCreate:function(){
},startup:function(){
if(this._started){
return;
}
this._started=true;
_8b.forEach(this.getChildren(),function(obj){
if(!obj._started&&!obj._destroyed&&_96.isFunction(obj.startup)){
obj.startup();
obj._started=true;
}
});
},destroyRecursive:function(_b2){
this._beingDestroyed=true;
this.destroyDescendants(_b2);
this.destroy(_b2);
},destroy:function(_b3){
this._beingDestroyed=true;
this.uninitialize();
function _b4(w){
if(w.destroyRecursive){
w.destroyRecursive(_b3);
}else{
if(w.destroy){
w.destroy(_b3);
}
}
};
_8b.forEach(this._connects,_96.hitch(this,"disconnect"));
_8b.forEach(this._supportingWidgets,_b4);
if(this.domNode){
_8b.forEach(_9b.findWidgets(this.domNode,this.containerNode),_b4);
}
this.destroyRendering(_b3);
_9b.remove(this.id);
this._destroyed=true;
},destroyRendering:function(_b5){
if(this.bgIframe){
this.bgIframe.destroy(_b5);
delete this.bgIframe;
}
if(this.domNode){
if(_b5){
_90.remove(this.domNode,"widgetId");
}else{
_92.destroy(this.domNode);
}
delete this.domNode;
}
if(this.srcNodeRef){
if(!_b5){
_92.destroy(this.srcNodeRef);
}
delete this.srcNodeRef;
}
},destroyDescendants:function(_b6){
_8b.forEach(this.getChildren(),function(_b7){
if(_b7.destroyRecursive){
_b7.destroyRecursive(_b6);
}
});
},uninitialize:function(){
return false;
},_setStyleAttr:function(_b8){
var _b9=this.domNode;
if(_96.isObject(_b8)){
_94.set(_b9,_b8);
}else{
if(_b9.style.cssText){
_b9.style.cssText+="; "+_b8;
}else{
_b9.style.cssText=_b8;
}
}
this._set("style",_b8);
},_attrToDom:function(_ba,_bb,_bc){
_bc=arguments.length>=3?_bc:this.attributeMap[_ba];
_8b.forEach(_96.isArray(_bc)?_bc:[_bc],function(_bd){
var _be=this[_bd.node||_bd||"domNode"];
var _bf=_bd.type||"attribute";
switch(_bf){
case "attribute":
if(_96.isFunction(_bb)){
_bb=_96.hitch(this,_bb);
}
var _c0=_bd.attribute?_bd.attribute:(/^on[A-Z][a-zA-Z]*$/.test(_ba)?_ba.toLowerCase():_ba);
if(_be.tagName){
_90.set(_be,_c0,_bb);
}else{
_be.set(_c0,_bb);
}
break;
case "innerText":
_be.innerHTML="";
_be.appendChild(this.ownerDocument.createTextNode(_bb));
break;
case "innerHTML":
_be.innerHTML=_bb;
break;
case "class":
_91.replace(_be,_bb,this[_ba]);
break;
}
},this);
},get:function(_c1){
var _c2=this._getAttrNames(_c1);
return this[_c2.g]?this[_c2.g]():this[_c1];
},set:function(_c3,_c4){
if(typeof _c3==="object"){
for(var x in _c3){
this.set(x,_c3[x]);
}
return this;
}
var _c5=this._getAttrNames(_c3),_c6=this[_c5.s];
if(_96.isFunction(_c6)){
var _c7=_c6.apply(this,Array.prototype.slice.call(arguments,1));
}else{
var _c8=this.focusNode&&!_96.isFunction(this.focusNode)?"focusNode":"domNode",tag=this[_c8].tagName,_c9=_9d[tag]||(_9d[tag]=_9e(this[_c8])),map=_c3 in this.attributeMap?this.attributeMap[_c3]:_c5.s in this?this[_c5.s]:((_c5.l in _c9&&typeof _c4!="function")||/^aria-|^data-|^role$/.test(_c3))?_c8:null;
if(map!=null){
this._attrToDom(_c3,_c4,map);
}
this._set(_c3,_c4);
}
return _c7||this;
},_attrPairNames:{},_getAttrNames:function(_ca){
var apn=this._attrPairNames;
if(apn[_ca]){
return apn[_ca];
}
var uc=_ca.replace(/^[a-z]|-[a-zA-Z]/g,function(c){
return c.charAt(c.length-1).toUpperCase();
});
return (apn[_ca]={n:_ca+"Node",s:"_set"+uc+"Attr",g:"_get"+uc+"Attr",l:uc.toLowerCase()});
},_set:function(_cb,_cc){
var _cd=this[_cb];
this[_cb]=_cc;
if(this._created&&_cc!==_cd){
if(this._watchCallbacks){
this._watchCallbacks(_cb,_cd,_cc);
}
this.emit("attrmodified-"+_cb,{detail:{prevValue:_cd,newValue:_cc}});
}
},emit:function(_ce,_cf,_d0){
_cf=_cf||{};
if(_cf.bubbles===undefined){
_cf.bubbles=true;
}
if(_cf.cancelable===undefined){
_cf.cancelable=true;
}
if(!_cf.detail){
_cf.detail={};
}
_cf.detail.widget=this;
var ret,_d1=this["on"+_ce];
if(_d1){
ret=_d1.apply(this,_d0?_d0:[_cf]);
}
if(this._started&&!this._beingDestroyed){
on.emit(this.domNode,_ce.toLowerCase(),_cf);
}
return ret;
},on:function(_d2,_d3){
var _d4=this._onMap(_d2);
if(_d4){
return _8c.after(this,_d4,_d3,true);
}
return this.own(on(this.domNode,_d2,_d3))[0];
},_onMap:function(_d5){
var _d6=this.constructor,map=_d6._onMap;
if(!map){
map=(_d6._onMap={});
for(var _d7 in _d6.prototype){
if(/^on/.test(_d7)){
map[_d7.replace(/^on/,"").toLowerCase()]=_d7;
}
}
}
return map[typeof _d5=="string"&&_d5.toLowerCase()];
},toString:function(){
return "[Widget "+this.declaredClass+", "+(this.id||"NO ID")+"]";
},getChildren:function(){
return this.containerNode?_9b.findWidgets(this.containerNode):[];
},getParent:function(){
return _9b.getEnclosingWidget(this.domNode.parentNode);
},connect:function(obj,_d8,_d9){
return this.own(_8e.connect(obj,_d8,this,_d9))[0];
},disconnect:function(_da){
_da.remove();
},subscribe:function(t,_db){
return this.own(_99.subscribe(t,_96.hitch(this,_db)))[0];
},unsubscribe:function(_dc){
_dc.remove();
},isLeftToRight:function(){
return this.dir?(this.dir=="ltr"):_93.isBodyLtr(this.ownerDocument);
},isFocusable:function(){
return this.focus&&(_94.get(this.domNode,"display")!="none");
},placeAt:function(_dd,_de){
var _df=!_dd.tagName&&_9b.byId(_dd);
if(_df&&_df.addChild&&(!_de||typeof _de==="number")){
_df.addChild(this,_de);
}else{
var ref=_df?(_df.containerNode&&!/after|before|replace/.test(_de||"")?_df.containerNode:_df.domNode):dom.byId(_dd,this.ownerDocument);
_92.place(this.domNode,ref,_de);
if(!this._started&&(this.getParent()||{})._started){
this.startup();
}
}
return this;
},getTextDir:function(_e0,_e1){
return _e1;
},applyTextDir:function(){
},defer:function(fcn,_e2){
var _e3=setTimeout(_96.hitch(this,function(){
_e3=null;
if(!this._destroyed){
_96.hitch(this,fcn)();
}
}),_e2||0);
return {remove:function(){
if(_e3){
clearTimeout(_e3);
_e3=null;
}
return null;
}};
}});
});
},"dijit/_base":function(){
define("dijit/_base",["./main","./a11y","./WidgetSet","./_base/focus","./_base/manager","./_base/place","./_base/popup","./_base/scroll","./_base/sniff","./_base/typematic","./_base/wai","./_base/window"],function(_e4){
return _e4._base;
});
},"dojo/touch":function(){
define(["./_base/kernel","./aspect","./dom","./on","./has","./mouse","./ready","./_base/window"],function(_e5,_e6,dom,on,has,_e7,_e8,win){
var _e9=has("touch");
var _ea=false;
if(has("ios")){
var ua=navigator.userAgent;
var v=ua.match(/OS ([\d_]+)/)?RegExp.$1:"1";
var os=parseFloat(v.replace(/_/,".").replace(/_/g,""));
_ea=os<5;
}
var _eb,_ec;
if(_e9){
_e8(function(){
_ec=win.body();
win.doc.addEventListener("touchstart",function(evt){
var _ed=_ec;
_ec=evt.target;
on.emit(_ed,"dojotouchout",{target:_ed,relatedTarget:_ec,bubbles:true});
on.emit(_ec,"dojotouchover",{target:_ec,relatedTarget:_ed,bubbles:true});
},true);
on(win.doc,"touchmove",function(evt){
var _ee=win.doc.elementFromPoint(evt.pageX-(_ea?0:win.global.pageXOffset),evt.pageY-(_ea?0:win.global.pageYOffset));
if(_ee&&_ec!==_ee){
on.emit(_ec,"dojotouchout",{target:_ec,relatedTarget:_ee,bubbles:true});
on.emit(_ee,"dojotouchover",{target:_ee,relatedTarget:_ec,bubbles:true});
_ec=_ee;
}
});
});
_eb=function(_ef,_f0){
return on(win.doc,"touchmove",function(evt){
if(_ef===win.doc||dom.isDescendant(_ec,_ef)){
evt.target=_ec;
_f0.call(this,evt);
}
});
};
}
function _f1(_f2){
return function(_f3,_f4){
return on(_f3,_f2,_f4);
};
};
var _f5={press:_f1(_e9?"touchstart":"mousedown"),move:_e9?_eb:_f1("mousemove"),release:_f1(_e9?"touchend":"mouseup"),cancel:_e9?_f1("touchcancel"):_e7.leave,over:_f1(_e9?"dojotouchover":"mouseover"),out:_f1(_e9?"dojotouchout":"mouseout"),enter:_e7._eventHandler(_e9?"dojotouchover":"mouseover"),leave:_e7._eventHandler(_e9?"dojotouchout":"mouseout")};
1&&(_e5.touch=_f5);
return _f5;
});
},"dijit/form/_FormValueMixin":function(){
define("dijit/form/_FormValueMixin",["dojo/_base/declare","dojo/dom-attr","dojo/keys","dojo/sniff","./_FormWidgetMixin"],function(_f6,_f7,_f8,has,_f9){
return _f6("dijit.form._FormValueMixin",_f9,{readOnly:false,_setReadOnlyAttr:function(_fa){
_f7.set(this.focusNode,"readOnly",_fa);
this._set("readOnly",_fa);
},postCreate:function(){
this.inherited(arguments);
if(has("ie")){
this.connect(this.focusNode||this.domNode,"onkeydown",this._onKeyDown);
}
if(this._resetValue===undefined){
this._lastValueReported=this._resetValue=this.value;
}
},_setValueAttr:function(_fb,_fc){
this._handleOnChange(_fb,_fc);
},_handleOnChange:function(_fd,_fe){
this._set("value",_fd);
this.inherited(arguments);
},undo:function(){
this._setValueAttr(this._lastValueReported,false);
},reset:function(){
this._hasBeenBlurred=false;
this._setValueAttr(this._resetValue,true);
},_onKeyDown:function(e){
if(e.keyCode==_f8.ESCAPE&&!(e.ctrlKey||e.altKey||e.metaKey)){
if(has("ie")<9||(has("ie")&&has("quirks"))){
e.preventDefault();
var _ff=e.srcElement,te=_ff.ownerDocument.createEventObject();
te.keyCode=_f8.ESCAPE;
te.shiftKey=e.shiftKey;
_ff.fireEvent("onkeypress",te);
}
}
}});
});
},"dojo/Stateful":function(){
define(["./_base/declare","./_base/lang","./_base/array","dojo/when"],function(_100,lang,_101,when){
return _100("dojo.Stateful",null,{_attrPairNames:{},_getAttrNames:function(name){
var apn=this._attrPairNames;
if(apn[name]){
return apn[name];
}
return (apn[name]={s:"_"+name+"Setter",g:"_"+name+"Getter"});
},postscript:function(_102){
if(_102){
this.set(_102);
}
},_get:function(name,_103){
return typeof this[_103.g]==="function"?this[_103.g]():this[name];
},get:function(name){
return this._get(name,this._getAttrNames(name));
},set:function(name,_104){
if(typeof name==="object"){
for(var x in name){
if(name.hasOwnProperty(x)&&x!="_watchCallbacks"){
this.set(x,name[x]);
}
}
return this;
}
var _105=this._getAttrNames(name),_106=this._get(name,_105),_107=this[_105.s],_108;
if(typeof _107==="function"){
_108=_107.apply(this,Array.prototype.slice.call(arguments,1));
}else{
this[name]=_104;
}
if(this._watchCallbacks){
var self=this;
when(_108,function(){
self._watchCallbacks(name,_106,_104);
});
}
return this;
},_changeAttrValue:function(name,_109){
var _10a=this.get(name);
this[name]=_109;
if(this._watchCallbacks){
this._watchCallbacks(name,_10a,_109);
}
return this;
},watch:function(name,_10b){
var _10c=this._watchCallbacks;
if(!_10c){
var self=this;
_10c=this._watchCallbacks=function(name,_10d,_10e,_10f){
var _110=function(_111){
if(_111){
_111=_111.slice();
for(var i=0,l=_111.length;i<l;i++){
_111[i].call(self,name,_10d,_10e);
}
}
};
_110(_10c["_"+name]);
if(!_10f){
_110(_10c["*"]);
}
};
}
if(!_10b&&typeof name==="function"){
_10b=name;
name="*";
}else{
name="_"+name;
}
var _112=_10c[name];
if(typeof _112!=="object"){
_112=_10c[name]=[];
}
_112.push(_10b);
var _113={};
_113.unwatch=_113.remove=function(){
var _114=_101.indexOf(_112,_10b);
if(_114>-1){
_112.splice(_114,1);
}
};
return _113;
}});
});
},"dijit/_CssStateMixin":function(){
define("dijit/_CssStateMixin",["dojo/_base/array","dojo/_base/declare","dojo/dom","dojo/dom-class","dojo/has","dojo/_base/lang","dojo/on","dojo/ready","dojo/_base/window","./registry"],function(_115,_116,dom,_117,has,lang,on,_118,win,_119){
var _11a=_116("dijit._CssStateMixin",[],{cssStateNodes:{},hovering:false,active:false,_applyAttributes:function(){
this.inherited(arguments);
_115.forEach(["disabled","readOnly","checked","selected","focused","state","hovering","active","_opened"],function(attr){
this.watch(attr,lang.hitch(this,"_setStateClass"));
},this);
for(var ap in this.cssStateNodes){
this._trackMouseState(this[ap],this.cssStateNodes[ap]);
}
this._trackMouseState(this.domNode,this.baseClass);
this._setStateClass();
},_cssMouseEvent:function(_11b){
if(!this.disabled){
switch(_11b.type){
case "mouseover":
this._set("hovering",true);
this._set("active",this._mouseDown);
break;
case "mouseout":
this._set("hovering",false);
this._set("active",false);
break;
case "mousedown":
case "touchstart":
this._set("active",true);
break;
case "mouseup":
case "touchend":
this._set("active",false);
break;
}
}
},_setStateClass:function(){
var _11c=this.baseClass.split(" ");
function _11d(_11e){
_11c=_11c.concat(_115.map(_11c,function(c){
return c+_11e;
}),"dijit"+_11e);
};
if(!this.isLeftToRight()){
_11d("Rtl");
}
var _11f=this.checked=="mixed"?"Mixed":(this.checked?"Checked":"");
if(this.checked){
_11d(_11f);
}
if(this.state){
_11d(this.state);
}
if(this.selected){
_11d("Selected");
}
if(this._opened){
_11d("Opened");
}
if(this.disabled){
_11d("Disabled");
}else{
if(this.readOnly){
_11d("ReadOnly");
}else{
if(this.active){
_11d("Active");
}else{
if(this.hovering){
_11d("Hover");
}
}
}
}
if(this.focused){
_11d("Focused");
}
var tn=this.stateNode||this.domNode,_120={};
_115.forEach(tn.className.split(" "),function(c){
_120[c]=true;
});
if("_stateClasses" in this){
_115.forEach(this._stateClasses,function(c){
delete _120[c];
});
}
_115.forEach(_11c,function(c){
_120[c]=true;
});
var _121=[];
for(var c in _120){
_121.push(c);
}
tn.className=_121.join(" ");
this._stateClasses=_11c;
},_subnodeCssMouseEvent:function(node,_122,evt){
if(this.disabled||this.readOnly){
return;
}
function _123(_124){
_117.toggle(node,_122+"Hover",_124);
};
function _125(_126){
_117.toggle(node,_122+"Active",_126);
};
function _127(_128){
_117.toggle(node,_122+"Focused",_128);
};
switch(evt.type){
case "mouseover":
_123(true);
break;
case "mouseout":
_123(false);
_125(false);
break;
case "mousedown":
case "touchstart":
_125(true);
break;
case "mouseup":
case "touchend":
_125(false);
break;
case "focus":
case "focusin":
_127(true);
break;
case "blur":
case "focusout":
_127(false);
break;
}
},_trackMouseState:function(node,_129){
node._cssState=_129;
}});
_118(function(){
function _12a(evt){
if(!dom.isDescendant(evt.relatedTarget,evt.target)){
for(var node=evt.target;node&&node!=evt.relatedTarget;node=node.parentNode){
if(node._cssState){
var _12b=_119.getEnclosingWidget(node);
if(_12b){
if(node==_12b.domNode){
_12b._cssMouseEvent(evt);
}else{
_12b._subnodeCssMouseEvent(node,node._cssState,evt);
}
}
}
}
}
};
function _12c(evt){
evt.target=evt.srcElement;
_12a(evt);
};
var body=win.body(),_12d=(has("touch")?[]:["mouseover","mouseout"]).concat(["mousedown","touchstart","mouseup","touchend"]);
_115.forEach(_12d,function(type){
if(body.addEventListener){
body.addEventListener(type,_12a,true);
}else{
body.attachEvent("on"+type,_12c);
}
});
on(body,"focusin, focusout",function(evt){
var node=evt.target;
if(node._cssState&&!node.getAttribute("widgetId")){
var _12e=_119.getEnclosingWidget(node);
_12e._subnodeCssMouseEvent(node,node._cssState,evt);
}
});
});
return _11a;
});
},"dijit/_base/manager":function(){
define("dijit/_base/manager",["dojo/_base/array","dojo/_base/config","dojo/_base/lang","../registry","../main"],function(_12f,_130,lang,_131,_132){
var _133={};
_12f.forEach(["byId","getUniqueId","findWidgets","_destroyAll","byNode","getEnclosingWidget"],function(name){
_133[name]=_131[name];
});
lang.mixin(_133,{defaultDuration:_130["defaultDuration"]||200});
lang.mixin(_132,_133);
return _132;
});
},"dijit/_base/sniff":function(){
define("dijit/_base/sniff",["dojo/uacss"],function(){
});
},"dijit/BackgroundIframe":function(){
define("dijit/BackgroundIframe",["require","./main","dojo/_base/config","dojo/dom-construct","dojo/dom-style","dojo/_base/lang","dojo/on","dojo/sniff","dojo/_base/window"],function(_134,_135,_136,_137,_138,lang,on,has,win){
var _139=new function(){
var _13a=[];
this.pop=function(){
var _13b;
if(_13a.length){
_13b=_13a.pop();
_13b.style.display="";
}else{
if(has("ie")<9){
var burl=_136["dojoBlankHtmlUrl"]||_134.toUrl("dojo/resources/blank.html")||"javascript:\"\"";
var html="<iframe src='"+burl+"' role='presentation'"+" style='position: absolute; left: 0px; top: 0px;"+"z-index: -1; filter:Alpha(Opacity=\"0\");'>";
_13b=win.doc.createElement(html);
}else{
_13b=_137.create("iframe");
_13b.src="javascript:\"\"";
_13b.className="dijitBackgroundIframe";
_13b.setAttribute("role","presentation");
_138.set(_13b,"opacity",0.1);
}
_13b.tabIndex=-1;
}
return _13b;
};
this.push=function(_13c){
_13c.style.display="none";
_13a.push(_13c);
};
}();
_135.BackgroundIframe=function(node){
if(!node.id){
throw new Error("no id");
}
if(has("ie")||has("mozilla")){
var _13d=(this.iframe=_139.pop());
node.appendChild(_13d);
if(has("ie")<7||has("quirks")){
this.resize(node);
this._conn=on(node,"resize",lang.hitch(this,function(){
this.resize(node);
}));
}else{
_138.set(_13d,{width:"100%",height:"100%"});
}
}
};
lang.extend(_135.BackgroundIframe,{resize:function(node){
if(this.iframe){
_138.set(this.iframe,{width:node.offsetWidth+"px",height:node.offsetHeight+"px"});
}
},destroy:function(){
if(this._conn){
this._conn.remove();
this._conn=null;
}
if(this.iframe){
_139.push(this.iframe);
delete this.iframe;
}
}});
return _135.BackgroundIframe;
});
},"dijit/typematic":function(){
define(["dojo/_base/array","dojo/_base/connect","dojo/_base/event","dojo/_base/kernel","dojo/_base/lang","dojo/on","dojo/sniff","./main"],function(_13e,_13f,_140,_141,lang,on,has,_142){
var _143=(_142.typematic={_fireEventAndReload:function(){
this._timer=null;
this._callback(++this._count,this._node,this._evt);
this._currentTimeout=Math.max(this._currentTimeout<0?this._initialDelay:(this._subsequentDelay>1?this._subsequentDelay:Math.round(this._currentTimeout*this._subsequentDelay)),this._minDelay);
this._timer=setTimeout(lang.hitch(this,"_fireEventAndReload"),this._currentTimeout);
},trigger:function(evt,_144,node,_145,obj,_146,_147,_148){
if(obj!=this._obj){
this.stop();
this._initialDelay=_147||500;
this._subsequentDelay=_146||0.9;
this._minDelay=_148||10;
this._obj=obj;
this._node=node;
this._currentTimeout=-1;
this._count=-1;
this._callback=lang.hitch(_144,_145);
this._evt={faux:true};
for(var attr in evt){
if(attr!="layerX"&&attr!="layerY"){
var v=evt[attr];
if(typeof v!="function"&&typeof v!="undefined"){
this._evt[attr]=v;
}
}
}
this._fireEventAndReload();
}
},stop:function(){
if(this._timer){
clearTimeout(this._timer);
this._timer=null;
}
if(this._obj){
this._callback(-1,this._node,this._evt);
this._obj=null;
}
},addKeyListener:function(node,_149,_14a,_14b,_14c,_14d,_14e){
if(_149.keyCode){
_149.charOrCode=_149.keyCode;
_141.deprecated("keyCode attribute parameter for dijit.typematic.addKeyListener is deprecated. Use charOrCode instead.","","2.0");
}else{
if(_149.charCode){
_149.charOrCode=String.fromCharCode(_149.charCode);
_141.deprecated("charCode attribute parameter for dijit.typematic.addKeyListener is deprecated. Use charOrCode instead.","","2.0");
}
}
var _14f=[on(node,_13f._keypress,lang.hitch(this,function(evt){
if(evt.charOrCode==_149.charOrCode&&(_149.ctrlKey===undefined||_149.ctrlKey==evt.ctrlKey)&&(_149.altKey===undefined||_149.altKey==evt.altKey)&&(_149.metaKey===undefined||_149.metaKey==(evt.metaKey||false))&&(_149.shiftKey===undefined||_149.shiftKey==evt.shiftKey)){
_140.stop(evt);
_143.trigger(evt,_14a,node,_14b,_149,_14c,_14d,_14e);
}else{
if(_143._obj==_149){
_143.stop();
}
}
})),on(node,"keyup",lang.hitch(this,function(){
if(_143._obj==_149){
_143.stop();
}
}))];
return {remove:function(){
_13e.forEach(_14f,function(h){
h.remove();
});
}};
},addMouseListener:function(node,_150,_151,_152,_153,_154){
var _155=[on(node,"mousedown",lang.hitch(this,function(evt){
evt.preventDefault();
_143.trigger(evt,_150,node,_151,node,_152,_153,_154);
})),on(node,"mouseup",lang.hitch(this,function(evt){
if(this._obj){
evt.preventDefault();
}
_143.stop();
})),on(node,"mouseout",lang.hitch(this,function(evt){
if(this._obj){
evt.preventDefault();
}
_143.stop();
})),on(node,"dblclick",lang.hitch(this,function(evt){
evt.preventDefault();
if(has("ie")<9){
_143.trigger(evt,_150,node,_151,node,_152,_153,_154);
setTimeout(lang.hitch(this,_143.stop),50);
}
}))];
return {remove:function(){
_13e.forEach(_155,function(h){
h.remove();
});
}};
},addListener:function(_156,_157,_158,_159,_15a,_15b,_15c,_15d){
var _15e=[this.addKeyListener(_157,_158,_159,_15a,_15b,_15c,_15d),this.addMouseListener(_156,_159,_15a,_15b,_15c,_15d)];
return {remove:function(){
_13e.forEach(_15e,function(h){
h.remove();
});
}};
}});
return _143;
});
},"dojo/_base/url":function(){
define(["./kernel"],function(dojo){
var ore=new RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?$"),ire=new RegExp("^((([^\\[:]+):)?([^@]+)@)?(\\[([^\\]]+)\\]|([^\\[:]*))(:([0-9]+))?$"),_15f=function(){
var n=null,_160=arguments,uri=[_160[0]];
for(var i=1;i<_160.length;i++){
if(!_160[i]){
continue;
}
var _161=new _15f(_160[i]+""),_162=new _15f(uri[0]+"");
if(_161.path==""&&!_161.scheme&&!_161.authority&&!_161.query){
if(_161.fragment!=n){
_162.fragment=_161.fragment;
}
_161=_162;
}else{
if(!_161.scheme){
_161.scheme=_162.scheme;
if(!_161.authority){
_161.authority=_162.authority;
if(_161.path.charAt(0)!="/"){
var path=_162.path.substring(0,_162.path.lastIndexOf("/")+1)+_161.path;
var segs=path.split("/");
for(var j=0;j<segs.length;j++){
if(segs[j]=="."){
if(j==segs.length-1){
segs[j]="";
}else{
segs.splice(j,1);
j--;
}
}else{
if(j>0&&!(j==1&&segs[0]=="")&&segs[j]==".."&&segs[j-1]!=".."){
if(j==(segs.length-1)){
segs.splice(j,1);
segs[j-1]="";
}else{
segs.splice(j-1,2);
j-=2;
}
}
}
}
_161.path=segs.join("/");
}
}
}
}
uri=[];
if(_161.scheme){
uri.push(_161.scheme,":");
}
if(_161.authority){
uri.push("//",_161.authority);
}
uri.push(_161.path);
if(_161.query){
uri.push("?",_161.query);
}
if(_161.fragment){
uri.push("#",_161.fragment);
}
}
this.uri=uri.join("");
var r=this.uri.match(ore);
this.scheme=r[2]||(r[1]?"":n);
this.authority=r[4]||(r[3]?"":n);
this.path=r[5];
this.query=r[7]||(r[6]?"":n);
this.fragment=r[9]||(r[8]?"":n);
if(this.authority!=n){
r=this.authority.match(ire);
this.user=r[3]||n;
this.password=r[4]||n;
this.host=r[6]||r[7];
this.port=r[9]||n;
}
};
_15f.prototype.toString=function(){
return this.uri;
};
return dojo._Url=_15f;
});
},"dojo/date/stamp":function(){
define(["../_base/lang","../_base/array"],function(lang,_163){
var _164={};
lang.setObject("dojo.date.stamp",_164);
_164.fromISOString=function(_165,_166){
if(!_164._isoRegExp){
_164._isoRegExp=/^(?:(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(.\d+)?)?((?:[+-](\d{2}):(\d{2}))|Z)?)?$/;
}
var _167=_164._isoRegExp.exec(_165),_168=null;
if(_167){
_167.shift();
if(_167[1]){
_167[1]--;
}
if(_167[6]){
_167[6]*=1000;
}
if(_166){
_166=new Date(_166);
_163.forEach(_163.map(["FullYear","Month","Date","Hours","Minutes","Seconds","Milliseconds"],function(prop){
return _166["get"+prop]();
}),function(_169,_16a){
_167[_16a]=_167[_16a]||_169;
});
}
_168=new Date(_167[0]||1970,_167[1]||0,_167[2]||1,_167[3]||0,_167[4]||0,_167[5]||0,_167[6]||0);
if(_167[0]<100){
_168.setFullYear(_167[0]||1970);
}
var _16b=0,_16c=_167[7]&&_167[7].charAt(0);
if(_16c!="Z"){
_16b=((_167[8]||0)*60)+(Number(_167[9])||0);
if(_16c!="-"){
_16b*=-1;
}
}
if(_16c){
_16b-=_168.getTimezoneOffset();
}
if(_16b){
_168.setTime(_168.getTime()+_16b*60000);
}
}
return _168;
};
_164.toISOString=function(_16d,_16e){
var _16f=function(n){
return (n<10)?"0"+n:n;
};
_16e=_16e||{};
var _170=[],_171=_16e.zulu?"getUTC":"get",date="";
if(_16e.selector!="time"){
var year=_16d[_171+"FullYear"]();
date=["0000".substr((year+"").length)+year,_16f(_16d[_171+"Month"]()+1),_16f(_16d[_171+"Date"]())].join("-");
}
_170.push(date);
if(_16e.selector!="date"){
var time=[_16f(_16d[_171+"Hours"]()),_16f(_16d[_171+"Minutes"]()),_16f(_16d[_171+"Seconds"]())].join(":");
var _172=_16d[_171+"Milliseconds"]();
if(_16e.milliseconds){
time+="."+(_172<100?"0":"")+_16f(_172);
}
if(_16e.zulu){
time+="Z";
}else{
if(_16e.selector!="time"){
var _173=_16d.getTimezoneOffset();
var _174=Math.abs(_173);
time+=(_173>0?"-":"+")+_16f(Math.floor(_174/60))+":"+_16f(_174%60);
}
}
_170.push(time);
}
return _170.join("T");
};
return _164;
});
},"dijit/_base/place":function(){
define("dijit/_base/place",["dojo/_base/array","dojo/_base/lang","dojo/window","../place","../main"],function(_175,lang,_176,_177,_178){
var _179={};
_179.getViewport=function(){
return _176.getBox();
};
_179.placeOnScreen=_177.at;
_179.placeOnScreenAroundElement=function(node,_17a,_17b,_17c){
var _17d;
if(lang.isArray(_17b)){
_17d=_17b;
}else{
_17d=[];
for(var key in _17b){
_17d.push({aroundCorner:key,corner:_17b[key]});
}
}
return _177.around(node,_17a,_17d,true,_17c);
};
_179.placeOnScreenAroundNode=_179.placeOnScreenAroundElement;
_179.placeOnScreenAroundRectangle=_179.placeOnScreenAroundElement;
_179.getPopupAroundAlignment=function(_17e,_17f){
var _180={};
_175.forEach(_17e,function(pos){
var ltr=_17f;
switch(pos){
case "after":
_180[_17f?"BR":"BL"]=_17f?"BL":"BR";
break;
case "before":
_180[_17f?"BL":"BR"]=_17f?"BR":"BL";
break;
case "below-alt":
ltr=!ltr;
case "below":
_180[ltr?"BL":"BR"]=ltr?"TL":"TR";
_180[ltr?"BR":"BL"]=ltr?"TR":"TL";
break;
case "above-alt":
ltr=!ltr;
case "above":
default:
_180[ltr?"TL":"TR"]=ltr?"BL":"BR";
_180[ltr?"TR":"TL"]=ltr?"BR":"BL";
break;
}
});
return _180;
};
lang.mixin(_178,_179);
return _178;
});
},"dijit/registry":function(){
define("dijit/registry",["dojo/_base/array","dojo/sniff","dojo/_base/unload","dojo/_base/window","./main"],function(_181,has,_182,win,_183){
var _184={},hash={};
var _185={length:0,add:function(_186){
if(hash[_186.id]){
throw new Error("Tried to register widget with id=="+_186.id+" but that id is already registered");
}
hash[_186.id]=_186;
this.length++;
},remove:function(id){
if(hash[id]){
delete hash[id];
this.length--;
}
},byId:function(id){
return typeof id=="string"?hash[id]:id;
},byNode:function(node){
return hash[node.getAttribute("widgetId")];
},toArray:function(){
var ar=[];
for(var id in hash){
ar.push(hash[id]);
}
return ar;
},getUniqueId:function(_187){
var id;
do{
id=_187+"_"+(_187 in _184?++_184[_187]:_184[_187]=0);
}while(hash[id]);
return _183._scopeName=="dijit"?id:_183._scopeName+"_"+id;
},findWidgets:function(root,_188){
var _189=[];
function _18a(root){
for(var node=root.firstChild;node;node=node.nextSibling){
if(node.nodeType==1){
var _18b=node.getAttribute("widgetId");
if(_18b){
var _18c=hash[_18b];
if(_18c){
_189.push(_18c);
}
}else{
if(node!==_188){
_18a(node);
}
}
}
}
};
_18a(root);
return _189;
},_destroyAll:function(){
_183._curFocus=null;
_183._prevFocus=null;
_183._activeStack=[];
_181.forEach(_185.findWidgets(win.body()),function(_18d){
if(!_18d._destroyed){
if(_18d.destroyRecursive){
_18d.destroyRecursive();
}else{
if(_18d.destroy){
_18d.destroy();
}
}
}
});
},getEnclosingWidget:function(node){
while(node){
var id=node.nodeType==1&&node.getAttribute("widgetId");
if(id){
return hash[id];
}
node=node.parentNode;
}
return null;
},_hash:hash};
_183.registry=_185;
return _185;
});
},"dijit/form/_FormWidgetMixin":function(){
define("dijit/form/_FormWidgetMixin",["dojo/_base/array","dojo/_base/declare","dojo/dom-attr","dojo/dom-style","dojo/_base/lang","dojo/mouse","dojo/sniff","dojo/window","../a11y"],function(_18e,_18f,_190,_191,lang,_192,has,_193,a11y){
return _18f("dijit.form._FormWidgetMixin",null,{name:"",alt:"",value:"",type:"text","aria-label":"focusNode",tabIndex:"0",_setTabIndexAttr:"focusNode",disabled:false,intermediateChanges:false,scrollOnFocus:true,_setIdAttr:"focusNode",_setDisabledAttr:function(_194){
this._set("disabled",_194);
_190.set(this.focusNode,"disabled",_194);
if(this.valueNode){
_190.set(this.valueNode,"disabled",_194);
}
this.focusNode.setAttribute("aria-disabled",_194?"true":"false");
if(_194){
this._set("hovering",false);
this._set("active",false);
var _195="tabIndex" in this.attributeMap?this.attributeMap.tabIndex:("_setTabIndexAttr" in this)?this._setTabIndexAttr:"focusNode";
_18e.forEach(lang.isArray(_195)?_195:[_195],function(_196){
var node=this[_196];
if(has("webkit")||a11y.hasDefaultTabStop(node)){
node.setAttribute("tabIndex","-1");
}else{
node.removeAttribute("tabIndex");
}
},this);
}else{
if(this.tabIndex!=""){
this.set("tabIndex",this.tabIndex);
}
}
},_onFocus:function(by){
if(by=="mouse"&&this.isFocusable()){
var _197=this.connect(this.focusNode,"onfocus",function(){
this.disconnect(_198);
this.disconnect(_197);
});
var _198=this.connect(this.ownerDocumentBody,"onmouseup",function(){
this.disconnect(_198);
this.disconnect(_197);
if(this.focused){
this.focus();
}
});
}
if(this.scrollOnFocus){
this.defer(function(){
_193.scrollIntoView(this.domNode);
});
}
this.inherited(arguments);
},isFocusable:function(){
return !this.disabled&&this.focusNode&&(_191.get(this.domNode,"display")!="none");
},focus:function(){
if(!this.disabled&&this.focusNode.focus){
try{
this.focusNode.focus();
}
catch(e){
}
}
},compare:function(val1,val2){
if(typeof val1=="number"&&typeof val2=="number"){
return (isNaN(val1)&&isNaN(val2))?0:val1-val2;
}else{
if(val1>val2){
return 1;
}else{
if(val1<val2){
return -1;
}else{
return 0;
}
}
}
},onChange:function(){
},_onChangeActive:false,_handleOnChange:function(_199,_19a){
if(this._lastValueReported==undefined&&(_19a===null||!this._onChangeActive)){
this._resetValue=this._lastValueReported=_199;
}
this._pendingOnChange=this._pendingOnChange||(typeof _199!=typeof this._lastValueReported)||(this.compare(_199,this._lastValueReported)!=0);
if((this.intermediateChanges||_19a||_19a===undefined)&&this._pendingOnChange){
this._lastValueReported=_199;
this._pendingOnChange=false;
if(this._onChangeActive){
if(this._onChangeHandle){
this._onChangeHandle.remove();
}
this._onChangeHandle=this.defer(function(){
this._onChangeHandle=null;
this.onChange(_199);
});
}
}
},create:function(){
this.inherited(arguments);
this._onChangeActive=true;
},destroy:function(){
if(this._onChangeHandle){
this._onChangeHandle.remove();
this.onChange(this._lastValueReported);
}
this.inherited(arguments);
}});
});
},"dojo/uacss":function(){
define(["./dom-geometry","./_base/lang","./ready","./sniff","./_base/window"],function(_19b,lang,_19c,has,_19d){
var html=_19d.doc.documentElement,ie=has("ie"),_19e=has("opera"),maj=Math.floor,ff=has("ff"),_19f=_19b.boxModel.replace(/-/,""),_1a0={"dj_quirks":has("quirks"),"dj_opera":_19e,"dj_khtml":has("khtml"),"dj_webkit":has("webkit"),"dj_safari":has("safari"),"dj_chrome":has("chrome"),"dj_gecko":has("mozilla")};
if(ie){
_1a0["dj_ie"]=true;
_1a0["dj_ie"+maj(ie)]=true;
_1a0["dj_iequirks"]=has("quirks");
}
if(ff){
_1a0["dj_ff"+maj(ff)]=true;
}
_1a0["dj_"+_19f]=true;
var _1a1="";
for(var clz in _1a0){
if(_1a0[clz]){
_1a1+=clz+" ";
}
}
html.className=lang.trim(html.className+" "+_1a1);
_19c(90,function(){
if(!_19b.isBodyLtr()){
var _1a2="dj_rtl dijitRtl "+_1a1.replace(/ /g,"-rtl ");
html.className=lang.trim(html.className+" "+_1a2+"dj_rtl dijitRtl "+_1a1.replace(/ /g,"-rtl "));
}
});
return has;
});
},"dijit/place":function(){
define("dijit/place",["dojo/_base/array","dojo/dom-geometry","dojo/dom-style","dojo/_base/kernel","dojo/_base/window","dojo/window","./main"],function(_1a3,_1a4,_1a5,_1a6,win,_1a7,_1a8){
function _1a9(node,_1aa,_1ab,_1ac){
var view=_1a7.getBox(node.ownerDocument);
if(!node.parentNode||String(node.parentNode.tagName).toLowerCase()!="body"){
win.body(node.ownerDocument).appendChild(node);
}
var best=null;
_1a3.some(_1aa,function(_1ad){
var _1ae=_1ad.corner;
var pos=_1ad.pos;
var _1af=0;
var _1b0={w:{"L":view.l+view.w-pos.x,"R":pos.x-view.l,"M":view.w}[_1ae.charAt(1)],h:{"T":view.t+view.h-pos.y,"B":pos.y-view.t,"M":view.h}[_1ae.charAt(0)]};
var s=node.style;
s.left=s.right="auto";
if(_1ab){
var res=_1ab(node,_1ad.aroundCorner,_1ae,_1b0,_1ac);
_1af=typeof res=="undefined"?0:res;
}
var _1b1=node.style;
var _1b2=_1b1.display;
var _1b3=_1b1.visibility;
if(_1b1.display=="none"){
_1b1.visibility="hidden";
_1b1.display="";
}
var bb=_1a4.position(node);
_1b1.display=_1b2;
_1b1.visibility=_1b3;
var _1b4={"L":pos.x,"R":pos.x-bb.w,"M":Math.max(view.l,Math.min(view.l+view.w,pos.x+(bb.w>>1))-bb.w)}[_1ae.charAt(1)],_1b5={"T":pos.y,"B":pos.y-bb.h,"M":Math.max(view.t,Math.min(view.t+view.h,pos.y+(bb.h>>1))-bb.h)}[_1ae.charAt(0)],_1b6=Math.max(view.l,_1b4),_1b7=Math.max(view.t,_1b5),endX=Math.min(view.l+view.w,_1b4+bb.w),endY=Math.min(view.t+view.h,_1b5+bb.h),_1b8=endX-_1b6,_1b9=endY-_1b7;
_1af+=(bb.w-_1b8)+(bb.h-_1b9);
if(best==null||_1af<best.overflow){
best={corner:_1ae,aroundCorner:_1ad.aroundCorner,x:_1b6,y:_1b7,w:_1b8,h:_1b9,overflow:_1af,spaceAvailable:_1b0};
}
return !_1af;
});
if(best.overflow&&_1ab){
_1ab(node,best.aroundCorner,best.corner,best.spaceAvailable,_1ac);
}
var l=_1a4.isBodyLtr(node.ownerDocument),s=node.style;
s.top=best.y+"px";
s[l?"left":"right"]=(l?best.x:view.w-best.x-best.w)+"px";
s[l?"right":"left"]="auto";
return best;
};
var _1ba={at:function(node,pos,_1bb,_1bc){
var _1bd=_1a3.map(_1bb,function(_1be){
var c={corner:_1be,pos:{x:pos.x,y:pos.y}};
if(_1bc){
c.pos.x+=_1be.charAt(1)=="L"?_1bc.x:-_1bc.x;
c.pos.y+=_1be.charAt(0)=="T"?_1bc.y:-_1bc.y;
}
return c;
});
return _1a9(node,_1bd);
},around:function(node,_1bf,_1c0,_1c1,_1c2){
var _1c3=(typeof _1bf=="string"||"offsetWidth" in _1bf)?_1a4.position(_1bf,true):_1bf;
if(_1bf.parentNode){
var _1c4=_1a5.getComputedStyle(_1bf).position=="absolute";
var _1c5=_1bf.parentNode;
while(_1c5&&_1c5.nodeType==1&&_1c5.nodeName!="BODY"){
var _1c6=_1a4.position(_1c5,true),pcs=_1a5.getComputedStyle(_1c5);
if(/relative|absolute/.test(pcs.position)){
_1c4=false;
}
if(!_1c4&&/hidden|auto|scroll/.test(pcs.overflow)){
var _1c7=Math.min(_1c3.y+_1c3.h,_1c6.y+_1c6.h);
var _1c8=Math.min(_1c3.x+_1c3.w,_1c6.x+_1c6.w);
_1c3.x=Math.max(_1c3.x,_1c6.x);
_1c3.y=Math.max(_1c3.y,_1c6.y);
_1c3.h=_1c7-_1c3.y;
_1c3.w=_1c8-_1c3.x;
}
if(pcs.position=="absolute"){
_1c4=true;
}
_1c5=_1c5.parentNode;
}
}
var x=_1c3.x,y=_1c3.y,_1c9="w" in _1c3?_1c3.w:(_1c3.w=_1c3.width),_1ca="h" in _1c3?_1c3.h:(_1a6.deprecated("place.around: dijit/place.__Rectangle: { x:"+x+", y:"+y+", height:"+_1c3.height+", width:"+_1c9+" } has been deprecated.  Please use { x:"+x+", y:"+y+", h:"+_1c3.height+", w:"+_1c9+" }","","2.0"),_1c3.h=_1c3.height);
var _1cb=[];
function push(_1cc,_1cd){
_1cb.push({aroundCorner:_1cc,corner:_1cd,pos:{x:{"L":x,"R":x+_1c9,"M":x+(_1c9>>1)}[_1cc.charAt(1)],y:{"T":y,"B":y+_1ca,"M":y+(_1ca>>1)}[_1cc.charAt(0)]}});
};
_1a3.forEach(_1c0,function(pos){
var ltr=_1c1;
switch(pos){
case "above-centered":
push("TM","BM");
break;
case "below-centered":
push("BM","TM");
break;
case "after-centered":
ltr=!ltr;
case "before-centered":
push(ltr?"ML":"MR",ltr?"MR":"ML");
break;
case "after":
ltr=!ltr;
case "before":
push(ltr?"TL":"TR",ltr?"TR":"TL");
push(ltr?"BL":"BR",ltr?"BR":"BL");
break;
case "below-alt":
ltr=!ltr;
case "below":
push(ltr?"BL":"BR",ltr?"TL":"TR");
push(ltr?"BR":"BL",ltr?"TR":"TL");
break;
case "above-alt":
ltr=!ltr;
case "above":
push(ltr?"TL":"TR",ltr?"BL":"BR");
push(ltr?"TR":"TL",ltr?"BR":"BL");
break;
default:
push(pos.aroundCorner,pos.corner);
}
});
var _1ce=_1a9(node,_1cb,_1c2,{w:_1c9,h:_1ca});
_1ce.aroundNodePos=_1c3;
return _1ce;
}};
return _1a8.place=_1ba;
});
},"dojo/window":function(){
define(["./_base/lang","./sniff","./_base/window","./dom","./dom-geometry","./dom-style"],function(lang,has,_1cf,dom,geom,_1d0){
var _1d1={getBox:function(doc){
doc=doc||_1cf.doc;
var _1d2=(doc.compatMode=="BackCompat")?_1cf.body(doc):doc.documentElement,_1d3=geom.docScroll(doc),w,h;
if(has("touch")){
var _1d4=_1d1.get(doc);
w=_1d4.innerWidth||_1d2.clientWidth;
h=_1d4.innerHeight||_1d2.clientHeight;
}else{
w=_1d2.clientWidth;
h=_1d2.clientHeight;
}
return {l:_1d3.x,t:_1d3.y,w:w,h:h};
},get:function(doc){
if(has("ie")&&_1d1!==document.parentWindow){
doc.parentWindow.execScript("document._parentWindow = window;","Javascript");
var win=doc._parentWindow;
doc._parentWindow=null;
return win;
}
return doc.parentWindow||doc.defaultView;
},scrollIntoView:function(node,pos){
try{
node=dom.byId(node);
var doc=node.ownerDocument||_1cf.doc,body=_1cf.body(doc),html=doc.documentElement||body.parentNode,isIE=has("ie"),isWK=has("webkit");
if((!(has("mozilla")||isIE||isWK||has("opera"))||node==body||node==html)&&(typeof node.scrollIntoView!="undefined")){
node.scrollIntoView(false);
return;
}
var _1d5=doc.compatMode=="BackCompat",_1d6=(isIE>=9&&"frameElement" in node.ownerDocument.parentWindow)?((html.clientHeight>0&&html.clientWidth>0&&(body.clientHeight==0||body.clientWidth==0||body.clientHeight>html.clientHeight||body.clientWidth>html.clientWidth))?html:body):(_1d5?body:html),_1d7=isWK?body:_1d6,_1d8=_1d6.clientWidth,_1d9=_1d6.clientHeight,rtl=!geom.isBodyLtr(doc),_1da=pos||geom.position(node),el=node.parentNode,_1db=function(el){
return ((isIE<=6||(isIE&&_1d5))?false:(_1d0.get(el,"position").toLowerCase()=="fixed"));
};
if(_1db(node)){
return;
}
while(el){
if(el==body){
el=_1d7;
}
var _1dc=geom.position(el),_1dd=_1db(el);
if(el==_1d7){
_1dc.w=_1d8;
_1dc.h=_1d9;
if(_1d7==html&&isIE&&rtl){
_1dc.x+=_1d7.offsetWidth-_1dc.w;
}
if(_1dc.x<0||!isIE){
_1dc.x=0;
}
if(_1dc.y<0||!isIE){
_1dc.y=0;
}
}else{
var pb=geom.getPadBorderExtents(el);
_1dc.w-=pb.w;
_1dc.h-=pb.h;
_1dc.x+=pb.l;
_1dc.y+=pb.t;
var _1de=el.clientWidth,_1df=_1dc.w-_1de;
if(_1de>0&&_1df>0){
_1dc.w=_1de;
_1dc.x+=(rtl&&(isIE||el.clientLeft>pb.l))?_1df:0;
}
_1de=el.clientHeight;
_1df=_1dc.h-_1de;
if(_1de>0&&_1df>0){
_1dc.h=_1de;
}
}
if(_1dd){
if(_1dc.y<0){
_1dc.h+=_1dc.y;
_1dc.y=0;
}
if(_1dc.x<0){
_1dc.w+=_1dc.x;
_1dc.x=0;
}
if(_1dc.y+_1dc.h>_1d9){
_1dc.h=_1d9-_1dc.y;
}
if(_1dc.x+_1dc.w>_1d8){
_1dc.w=_1d8-_1dc.x;
}
}
var l=_1da.x-_1dc.x,t=_1da.y-Math.max(_1dc.y,0),r=l+_1da.w-_1dc.w,bot=t+_1da.h-_1dc.h;
if(r*l>0){
var s=Math[l<0?"max":"min"](l,r);
if(rtl&&((isIE==8&&!_1d5)||isIE>=9)){
s=-s;
}
_1da.x+=el.scrollLeft;
el.scrollLeft+=s;
_1da.x-=el.scrollLeft;
}
if(bot*t>0){
_1da.y+=el.scrollTop;
el.scrollTop+=Math[t<0?"max":"min"](t,bot);
_1da.y-=el.scrollTop;
}
el=(el!=_1d7)&&!_1dd&&el.parentNode;
}
}
catch(error){
console.error("scrollIntoView: "+error);
node.scrollIntoView(false);
}
}};
1&&lang.setObject("dojo.window",_1d1);
return _1d1;
});
},"dijit/form/_FormValueWidget":function(){
define("dijit/form/_FormValueWidget",["dojo/_base/declare","dojo/sniff","./_FormWidget","./_FormValueMixin"],function(_1e0,has,_1e1,_1e2){
return _1e0("dijit.form._FormValueWidget",[_1e1,_1e2],{_layoutHackIE7:function(){
if(has("ie")==7){
var _1e3=this.domNode;
var _1e4=_1e3.parentNode;
var _1e5=_1e3.firstChild||_1e3;
var _1e6=_1e5.style.filter;
var _1e7=this;
while(_1e4&&_1e4.clientHeight==0){
(function ping(){
var _1e8=_1e7.connect(_1e4,"onscroll",function(){
_1e7.disconnect(_1e8);
_1e5.style.filter=(new Date()).getMilliseconds();
_1e7.defer(function(){
_1e5.style.filter=_1e6;
});
});
})();
_1e4=_1e4.parentNode;
}
}
}});
});
},"dijit/_OnDijitClickMixin":function(){
define("dijit/_OnDijitClickMixin",["dojo/on","dojo/_base/array","dojo/keys","dojo/_base/declare","dojo/has","dojo/_base/unload","dojo/_base/window","./a11yclick"],function(on,_1e9,keys,_1ea,has,_1eb,win,_1ec){
var ret=_1ea("dijit._OnDijitClickMixin",null,{connect:function(obj,_1ed,_1ee){
return this.inherited(arguments,[obj,_1ed=="ondijitclick"?_1ec:_1ed,_1ee]);
}});
ret.a11yclick=_1ec;
return ret;
});
},"dijit/a11yclick":function(){
define("dijit/a11yclick",["dojo/on","dojo/_base/array","dojo/keys","dojo/_base/declare","dojo/has","dojo/_base/unload","dojo/_base/window"],function(on,_1ef,keys,_1f0,has,_1f1,win){
var _1f2=null;
if(has("dom-addeventlistener")){
win.doc.addEventListener("keydown",function(evt){
_1f2=evt.target;
},true);
}else{
(function(){
var _1f3=function(evt){
_1f2=evt.srcElement;
};
win.doc.attachEvent("onkeydown",_1f3);
_1f1.addOnWindowUnload(function(){
win.doc.detachEvent("onkeydown",_1f3);
});
})();
}
function _1f4(e){
return (e.keyCode===keys.ENTER||e.keyCode===keys.SPACE)&&!e.ctrlKey&&!e.shiftKey&&!e.altKey&&!e.metaKey;
};
return function(node,_1f5){
if(/input|button/i.test(node.nodeName)){
return on(node,"click",_1f5);
}else{
var _1f6=[on(node,"keydown",function(e){
if(_1f4(e)){
_1f2=e.target;
e.preventDefault();
}
}),on(node,"keyup",function(e){
if(_1f4(e)&&e.target==_1f2){
_1f2=null;
on.emit(e.target,"click",{cancelable:true,bubbles:true});
}
}),on(node,"click",function(e){
_1f5.call(this,e);
})];
if(has("touch")){
var _1f7;
_1f6.push(on(node,"touchend",function(e){
var _1f8=e.target;
_1f7=setTimeout(function(){
_1f7=null;
on.emit(_1f8,"click",{cancelable:true,bubbles:true});
},600);
}),on(node,"click",function(e){
if(_1f7){
clearTimeout(_1f7);
}
}));
}
return {remove:function(){
_1ef.forEach(_1f6,function(h){
h.remove();
});
if(_1f7){
clearTimeout(_1f7);
_1f7=null;
}
}};
}
};
return ret;
});
},"dijit/hccss":function(){
define("dijit/hccss",["dojo/dom-class","dojo/hccss","dojo/ready","dojo/_base/window"],function(_1f9,has,_1fa,win){
_1fa(90,function(){
if(has("highcontrast")){
_1f9.add(win.body(),"dijit_a11y");
}
});
return has;
});
},"dijit/_TemplatedMixin":function(){
define("dijit/_TemplatedMixin",["dojo/_base/lang","dojo/touch","./_WidgetBase","dojo/string","dojo/cache","dojo/_base/array","dojo/_base/declare","dojo/dom-construct","dojo/sniff","dojo/_base/unload"],function(lang,_1fb,_1fc,_1fd,_1fe,_1ff,_200,_201,has,_202){
var _203=_200("dijit._TemplatedMixin",null,{templateString:null,templatePath:null,_skipNodeCache:false,_earlyTemplatedStartup:false,constructor:function(){
this._attachPoints=[];
this._attachEvents=[];
},_stringRepl:function(tmpl){
var _204=this.declaredClass,_205=this;
return _1fd.substitute(tmpl,this,function(_206,key){
if(key.charAt(0)=="!"){
_206=lang.getObject(key.substr(1),false,_205);
}
if(typeof _206=="undefined"){
throw new Error(_204+" template:"+key);
}
if(_206==null){
return "";
}
return key.charAt(0)=="!"?_206:_206.toString().replace(/"/g,"&quot;");
},this);
},buildRendering:function(){
if(!this.templateString){
this.templateString=_1fe(this.templatePath,{sanitize:true});
}
var _207=_203.getCachedTemplate(this.templateString,this._skipNodeCache,this.ownerDocument);
var node;
if(lang.isString(_207)){
node=_201.toDom(this._stringRepl(_207),this.ownerDocument);
if(node.nodeType!=1){
throw new Error("Invalid template: "+_207);
}
}else{
node=_207.cloneNode(true);
}
this.domNode=node;
this.inherited(arguments);
this._attachTemplateNodes(node,function(n,p){
return n.getAttribute(p);
});
this._beforeFillContent();
this._fillContent(this.srcNodeRef);
},_beforeFillContent:function(){
},_fillContent:function(_208){
var dest=this.containerNode;
if(_208&&dest){
while(_208.hasChildNodes()){
dest.appendChild(_208.firstChild);
}
}
},_attachTemplateNodes:function(_209,_20a){
var _20b=lang.isArray(_209)?_209:(_209.all||_209.getElementsByTagName("*"));
var x=lang.isArray(_209)?0:-1;
for(;x<0||_20b[x];x++){
var _20c=(x==-1)?_209:_20b[x];
if(this.widgetsInTemplate&&(_20a(_20c,"dojoType")||_20a(_20c,"data-dojo-type"))){
continue;
}
var _20d=_20a(_20c,"dojoAttachPoint")||_20a(_20c,"data-dojo-attach-point");
if(_20d){
var _20e,_20f=_20d.split(/\s*,\s*/);
while((_20e=_20f.shift())){
if(lang.isArray(this[_20e])){
this[_20e].push(_20c);
}else{
this[_20e]=_20c;
}
this._attachPoints.push(_20e);
}
}
var _210=_20a(_20c,"dojoAttachEvent")||_20a(_20c,"data-dojo-attach-event");
if(_210){
var _211,_212=_210.split(/\s*,\s*/);
var trim=lang.trim;
while((_211=_212.shift())){
if(_211){
var _213=null;
if(_211.indexOf(":")!=-1){
var _214=_211.split(":");
_211=trim(_214[0]);
_213=trim(_214[1]);
}else{
_211=trim(_211);
}
if(!_213){
_213=_211;
}
this._attachEvents.push(this.connect(_20c,_1fb[_211]||_211,_213));
}
}
}
}
},destroyRendering:function(){
_1ff.forEach(this._attachPoints,function(_215){
delete this[_215];
},this);
this._attachPoints=[];
_1ff.forEach(this._attachEvents,this.disconnect,this);
this._attachEvents=[];
this.inherited(arguments);
}});
_203._templateCache={};
_203.getCachedTemplate=function(_216,_217,doc){
var _218=_203._templateCache;
var key=_216;
var _219=_218[key];
if(_219){
try{
if(!_219.ownerDocument||_219.ownerDocument==(doc||document)){
return _219;
}
}
catch(e){
}
_201.destroy(_219);
}
_216=_1fd.trim(_216);
if(_217||_216.match(/\$\{([^\}]+)\}/g)){
return (_218[key]=_216);
}else{
var node=_201.toDom(_216,doc);
if(node.nodeType!=1){
throw new Error("Invalid template: "+_216);
}
return (_218[key]=node);
}
};
if(has("ie")){
_202.addOnWindowUnload(function(){
var _21a=_203._templateCache;
for(var key in _21a){
var _21b=_21a[key];
if(typeof _21b=="object"){
_201.destroy(_21b);
}
delete _21a[key];
}
});
}
lang.extend(_1fc,{dojoAttachEvent:"",dojoAttachPoint:""});
return _203;
});
},"dijit/form/_FormWidget":function(){
define("dijit/form/_FormWidget",["dojo/_base/declare","dojo/has","dojo/_base/kernel","dojo/ready","../_Widget","../_CssStateMixin","../_TemplatedMixin","./_FormWidgetMixin"],function(_21c,has,_21d,_21e,_21f,_220,_221,_222){
if(has("dijit-legacy-requires")){
_21e(0,function(){
var _223=["dijit/form/_FormValueWidget"];
require(_223);
});
}
return _21c("dijit.form._FormWidget",[_21f,_221,_220,_222],{setDisabled:function(_224){
_21d.deprecated("setDisabled("+_224+") is deprecated. Use set('disabled',"+_224+") instead.","","2.0");
this.set("disabled",_224);
},setValue:function(_225){
_21d.deprecated("dijit.form._FormWidget:setValue("+_225+") is deprecated.  Use set('value',"+_225+") instead.","","2.0");
this.set("value",_225);
},getValue:function(){
_21d.deprecated(this.declaredClass+"::getValue() is deprecated. Use get('value') instead.","","2.0");
return this.get("value");
},postMixInProperties:function(){
this.nameAttrSetting=this.name?("name=\""+this.name.replace(/"/g,"&quot;")+"\""):"";
this.inherited(arguments);
},_setTypeAttr:null});
});
},"dijit/_base/focus":function(){
define("dijit/_base/focus",["dojo/_base/array","dojo/dom","dojo/_base/lang","dojo/topic","dojo/_base/window","../focus","../main"],function(_226,dom,lang,_227,win,_228,_229){
var _22a={_curFocus:null,_prevFocus:null,isCollapsed:function(){
return _229.getBookmark().isCollapsed;
},getBookmark:function(){
var bm,rg,tg,sel=win.doc.selection,cf=_228.curNode;
if(win.global.getSelection){
sel=win.global.getSelection();
if(sel){
if(sel.isCollapsed){
tg=cf?cf.tagName:"";
if(tg){
tg=tg.toLowerCase();
if(tg=="textarea"||(tg=="input"&&(!cf.type||cf.type.toLowerCase()=="text"))){
sel={start:cf.selectionStart,end:cf.selectionEnd,node:cf,pRange:true};
return {isCollapsed:(sel.end<=sel.start),mark:sel};
}
}
bm={isCollapsed:true};
if(sel.rangeCount){
bm.mark=sel.getRangeAt(0).cloneRange();
}
}else{
rg=sel.getRangeAt(0);
bm={isCollapsed:false,mark:rg.cloneRange()};
}
}
}else{
if(sel){
tg=cf?cf.tagName:"";
tg=tg.toLowerCase();
if(cf&&tg&&(tg=="button"||tg=="textarea"||tg=="input")){
if(sel.type&&sel.type.toLowerCase()=="none"){
return {isCollapsed:true,mark:null};
}else{
rg=sel.createRange();
return {isCollapsed:rg.text&&rg.text.length?false:true,mark:{range:rg,pRange:true}};
}
}
bm={};
try{
rg=sel.createRange();
bm.isCollapsed=!(sel.type=="Text"?rg.htmlText.length:rg.length);
}
catch(e){
bm.isCollapsed=true;
return bm;
}
if(sel.type.toUpperCase()=="CONTROL"){
if(rg.length){
bm.mark=[];
var i=0,len=rg.length;
while(i<len){
bm.mark.push(rg.item(i++));
}
}else{
bm.isCollapsed=true;
bm.mark=null;
}
}else{
bm.mark=rg.getBookmark();
}
}else{
console.warn("No idea how to store the current selection for this browser!");
}
}
return bm;
},moveToBookmark:function(_22b){
var _22c=win.doc,mark=_22b.mark;
if(mark){
if(win.global.getSelection){
var sel=win.global.getSelection();
if(sel&&sel.removeAllRanges){
if(mark.pRange){
var n=mark.node;
n.selectionStart=mark.start;
n.selectionEnd=mark.end;
}else{
sel.removeAllRanges();
sel.addRange(mark);
}
}else{
console.warn("No idea how to restore selection for this browser!");
}
}else{
if(_22c.selection&&mark){
var rg;
if(mark.pRange){
rg=mark.range;
}else{
if(lang.isArray(mark)){
rg=_22c.body.createControlRange();
_226.forEach(mark,function(n){
rg.addElement(n);
});
}else{
rg=_22c.body.createTextRange();
rg.moveToBookmark(mark);
}
}
rg.select();
}
}
}
},getFocus:function(menu,_22d){
var node=!_228.curNode||(menu&&dom.isDescendant(_228.curNode,menu.domNode))?_229._prevFocus:_228.curNode;
return {node:node,bookmark:node&&(node==_228.curNode)&&win.withGlobal(_22d||win.global,_229.getBookmark),openedForWindow:_22d};
},_activeStack:[],registerIframe:function(_22e){
return _228.registerIframe(_22e);
},unregisterIframe:function(_22f){
_22f&&_22f.remove();
},registerWin:function(_230,_231){
return _228.registerWin(_230,_231);
},unregisterWin:function(_232){
_232&&_232.remove();
}};
_228.focus=function(_233){
if(!_233){
return;
}
var node="node" in _233?_233.node:_233,_234=_233.bookmark,_235=_233.openedForWindow,_236=_234?_234.isCollapsed:false;
if(node){
var _237=(node.tagName.toLowerCase()=="iframe")?node.contentWindow:node;
if(_237&&_237.focus){
try{
_237.focus();
}
catch(e){
}
}
_228._onFocusNode(node);
}
if(_234&&win.withGlobal(_235||win.global,_229.isCollapsed)&&!_236){
if(_235){
_235.focus();
}
try{
win.withGlobal(_235||win.global,_229.moveToBookmark,null,[_234]);
}
catch(e2){
}
}
};
_228.watch("curNode",function(name,_238,_239){
_229._curFocus=_239;
_229._prevFocus=_238;
if(_239){
_227.publish("focusNode",_239);
}
});
_228.watch("activeStack",function(name,_23a,_23b){
_229._activeStack=_23b;
});
_228.on("widget-blur",function(_23c,by){
_227.publish("widgetBlur",_23c,by);
});
_228.on("widget-focus",function(_23d,by){
_227.publish("widgetFocus",_23d,by);
});
lang.mixin(_229,_22a);
return _229;
});
},"dojo/parser":function(){
define(["require","./_base/kernel","./_base/lang","./_base/array","./_base/config","./_base/html","./_base/window","./_base/url","./_base/json","./aspect","./date/stamp","./Deferred","./has","./query","./on","./ready"],function(_23e,dojo,_23f,_240,_241,_242,_243,_244,_245,_246,_247,_248,has,_249,don,_24a){
new Date("X");
var _24b=0;
_246.after(_23f,"extend",function(){
_24b++;
},true);
function _24c(ctor){
var map=ctor._nameCaseMap,_24d=ctor.prototype;
if(!map||map._extendCnt<_24b){
map=ctor._nameCaseMap={};
for(var name in _24d){
if(name.charAt(0)==="_"){
continue;
}
map[name.toLowerCase()]=name;
}
map._extendCnt=_24b;
}
return map;
};
var _24e={};
function _24f(_250){
var ts=_250.join();
if(!_24e[ts]){
var _251=[];
for(var i=0,l=_250.length;i<l;i++){
var t=_250[i];
_251[_251.length]=(_24e[t]=_24e[t]||(_23f.getObject(t)||(~t.indexOf("/")&&_23e(t))));
}
var ctor=_251.shift();
_24e[ts]=_251.length?(ctor.createSubclass?ctor.createSubclass(_251):ctor.extend.apply(ctor,_251)):ctor;
}
return _24e[ts];
};
var _252={_clearCache:function(){
_24b++;
_24e={};
},_functionFromScript:function(_253,_254){
var _255="",_256="",_257=(_253.getAttribute(_254+"args")||_253.getAttribute("args")),_258=_253.getAttribute("with");
var _259=(_257||"").split(/\s*,\s*/);
if(_258&&_258.length){
_240.forEach(_258.split(/\s*,\s*/),function(part){
_255+="with("+part+"){";
_256+="}";
});
}
return new Function(_259,_255+_253.innerHTML+_256);
},instantiate:function(_25a,_25b,_25c){
_25b=_25b||{};
_25c=_25c||{};
var _25d=(_25c.scope||dojo._scopeName)+"Type",_25e="data-"+(_25c.scope||dojo._scopeName)+"-",_25f=_25e+"type",_260=_25e+"mixins";
var list=[];
_240.forEach(_25a,function(node){
var type=_25d in _25b?_25b[_25d]:node.getAttribute(_25f)||node.getAttribute(_25d);
if(type){
var _261=node.getAttribute(_260),_262=_261?[type].concat(_261.split(/\s*,\s*/)):[type];
list.push({node:node,types:_262});
}
});
return this._instantiate(list,_25b,_25c);
},_instantiate:function(_263,_264,_265){
var _266=_240.map(_263,function(obj){
var ctor=obj.ctor||_24f(obj.types);
if(!ctor){
throw new Error("Unable to resolve constructor for: '"+obj.types.join()+"'");
}
return this.construct(ctor,obj.node,_264,_265,obj.scripts,obj.inherited);
},this);
if(!_264._started&&!_265.noStart){
_240.forEach(_266,function(_267){
if(typeof _267.startup==="function"&&!_267._started){
_267.startup();
}
});
}
return _266;
},construct:function(ctor,node,_268,_269,_26a,_26b){
var _26c=ctor&&ctor.prototype;
_269=_269||{};
var _26d={};
if(_269.defaults){
_23f.mixin(_26d,_269.defaults);
}
if(_26b){
_23f.mixin(_26d,_26b);
}
var _26e;
if(has("dom-attributes-explicit")){
_26e=node.attributes;
}else{
if(has("dom-attributes-specified-flag")){
_26e=_240.filter(node.attributes,function(a){
return a.specified;
});
}else{
var _26f=/^input$|^img$/i.test(node.nodeName)?node:node.cloneNode(false),_270=_26f.outerHTML.replace(/=[^\s"']+|="[^"]*"|='[^']*'/g,"").replace(/^\s*<[a-zA-Z0-9]*\s*/,"").replace(/\s*>.*$/,"");
_26e=_240.map(_270.split(/\s+/),function(name){
var _271=name.toLowerCase();
return {name:name,value:(node.nodeName=="LI"&&name=="value")||_271=="enctype"?node.getAttribute(_271):node.getAttributeNode(_271).value};
});
}
}
var _272=_269.scope||dojo._scopeName,_273="data-"+_272+"-",hash={};
if(_272!=="dojo"){
hash[_273+"props"]="data-dojo-props";
hash[_273+"type"]="data-dojo-type";
hash[_273+"mixins"]="data-dojo-mixins";
hash[_272+"type"]="dojoType";
hash[_273+"id"]="data-dojo-id";
}
var i=0,item,_274=[],_275,_276;
while(item=_26e[i++]){
var name=item.name,_277=name.toLowerCase(),_278=item.value;
switch(hash[_277]||_277){
case "data-dojo-type":
case "dojotype":
case "data-dojo-mixins":
break;
case "data-dojo-props":
_276=_278;
break;
case "data-dojo-id":
case "jsid":
_275=_278;
break;
case "data-dojo-attach-point":
case "dojoattachpoint":
_26d.dojoAttachPoint=_278;
break;
case "data-dojo-attach-event":
case "dojoattachevent":
_26d.dojoAttachEvent=_278;
break;
case "class":
_26d["class"]=node.className;
break;
case "style":
_26d["style"]=node.style&&node.style.cssText;
break;
default:
if(!(name in _26c)){
var map=_24c(ctor);
name=map[_277]||name;
}
if(name in _26c){
switch(typeof _26c[name]){
case "string":
_26d[name]=_278;
break;
case "number":
_26d[name]=_278.length?Number(_278):NaN;
break;
case "boolean":
_26d[name]=_278.toLowerCase()!="false";
break;
case "function":
if(_278===""||_278.search(/[^\w\.]+/i)!=-1){
_26d[name]=new Function(_278);
}else{
_26d[name]=_23f.getObject(_278,false)||new Function(_278);
}
_274.push(name);
break;
default:
var pVal=_26c[name];
_26d[name]=(pVal&&"length" in pVal)?(_278?_278.split(/\s*,\s*/):[]):(pVal instanceof Date)?(_278==""?new Date(""):_278=="now"?new Date():_247.fromISOString(_278)):(pVal instanceof _244)?(dojo.baseUrl+_278):_245.fromJson(_278);
}
}else{
_26d[name]=_278;
}
}
}
for(var j=0;j<_274.length;j++){
var _279=_274[j].toLowerCase();
node.removeAttribute(_279);
node[_279]=null;
}
if(_276){
try{
_276=_245.fromJson.call(_269.propsThis,"{"+_276+"}");
_23f.mixin(_26d,_276);
}
catch(e){
throw new Error(e.toString()+" in data-dojo-props='"+_276+"'");
}
}
_23f.mixin(_26d,_268);
if(!_26a){
_26a=(ctor&&(ctor._noScript||_26c._noScript)?[]:_249("> script[type^='dojo/']",node));
}
var _27a=[],_27b=[],_27c=[],ons=[];
if(_26a){
for(i=0;i<_26a.length;i++){
var _27d=_26a[i];
node.removeChild(_27d);
var _27e=(_27d.getAttribute(_273+"event")||_27d.getAttribute("event")),prop=_27d.getAttribute(_273+"prop"),_27f=_27d.getAttribute(_273+"method"),_280=_27d.getAttribute(_273+"advice"),_281=_27d.getAttribute("type"),nf=this._functionFromScript(_27d,_273);
if(_27e){
if(_281=="dojo/connect"){
_27a.push({method:_27e,func:nf});
}else{
if(_281=="dojo/on"){
ons.push({event:_27e,func:nf});
}else{
_26d[_27e]=nf;
}
}
}else{
if(_281=="dojo/aspect"){
_27a.push({method:_27f,advice:_280,func:nf});
}else{
if(_281=="dojo/watch"){
_27c.push({prop:prop,func:nf});
}else{
_27b.push(nf);
}
}
}
}
}
var _282=ctor.markupFactory||_26c.markupFactory;
var _283=_282?_282(_26d,node,ctor):new ctor(_26d,node);
if(_275){
_23f.setObject(_275,_283);
}
for(i=0;i<_27a.length;i++){
_246[_27a[i].advice||"after"](_283,_27a[i].method,_23f.hitch(_283,_27a[i].func),true);
}
for(i=0;i<_27b.length;i++){
_27b[i].call(_283);
}
for(i=0;i<_27c.length;i++){
_283.watch(_27c[i].prop,_27c[i].func);
}
for(i=0;i<ons.length;i++){
don(_283,ons[i].event,ons[i].func);
}
return _283;
},scan:function(root,_284){
var list=[],mids=[],_285={};
var _286=(_284.scope||dojo._scopeName)+"Type",_287="data-"+(_284.scope||dojo._scopeName)+"-",_288=_287+"type",_289=_287+"textdir",_28a=_287+"mixins";
var node=root.firstChild;
var _28b=_284.inherited;
if(!_28b){
function _28c(node,attr){
return (node.getAttribute&&node.getAttribute(attr))||(node.parentNode&&_28c(node.parentNode,attr));
};
_28b={dir:_28c(root,"dir"),lang:_28c(root,"lang"),textDir:_28c(root,_289)};
for(var key in _28b){
if(!_28b[key]){
delete _28b[key];
}
}
}
var _28d={inherited:_28b};
var _28e;
var _28f;
function _290(_291){
if(!_291.inherited){
_291.inherited={};
var node=_291.node,_292=_290(_291.parent);
var _293={dir:node.getAttribute("dir")||_292.dir,lang:node.getAttribute("lang")||_292.lang,textDir:node.getAttribute(_289)||_292.textDir};
for(var key in _293){
if(_293[key]){
_291.inherited[key]=_293[key];
}
}
}
return _291.inherited;
};
while(true){
if(!node){
if(!_28d||!_28d.node){
break;
}
node=_28d.node.nextSibling;
_28f=false;
_28d=_28d.parent;
_28e=_28d.scripts;
continue;
}
if(node.nodeType!=1){
node=node.nextSibling;
continue;
}
if(_28e&&node.nodeName.toLowerCase()=="script"){
type=node.getAttribute("type");
if(type&&/^dojo\/\w/i.test(type)){
_28e.push(node);
}
node=node.nextSibling;
continue;
}
if(_28f){
node=node.nextSibling;
continue;
}
var type=node.getAttribute(_288)||node.getAttribute(_286);
var _294=node.firstChild;
if(!type&&(!_294||(_294.nodeType==3&&!_294.nextSibling))){
node=node.nextSibling;
continue;
}
var _295;
var ctor=null;
if(type){
var _296=node.getAttribute(_28a),_297=_296?[type].concat(_296.split(/\s*,\s*/)):[type];
try{
ctor=_24f(_297);
}
catch(e){
}
if(!ctor){
_240.forEach(_297,function(t){
if(~t.indexOf("/")&&!_285[t]){
_285[t]=true;
mids[mids.length]=t;
}
});
}
var _298=ctor&&!ctor.prototype._noScript?[]:null;
_295={types:_297,ctor:ctor,parent:_28d,node:node,scripts:_298};
_295.inherited=_290(_295);
list.push(_295);
}else{
_295={node:node,scripts:_28e,parent:_28d};
}
node=_294;
_28e=_298;
_28f=ctor&&ctor.prototype.stopParser&&!(_284.template);
_28d=_295;
}
var d=new _248();
if(mids.length){
if(has("dojo-debug-messages")){
console.warn("WARNING: Modules being Auto-Required: "+mids.join(", "));
}
_23e(mids,function(){
d.resolve(_240.filter(list,function(_299){
if(!_299.ctor){
try{
_299.ctor=_24f(_299.types);
}
catch(e){
}
}
var _29a=_299.parent;
while(_29a&&!_29a.types){
_29a=_29a.parent;
}
var _29b=_299.ctor&&_299.ctor.prototype;
_299.instantiateChildren=!(_29b&&_29b.stopParser&&!(_284.template));
_299.instantiate=!_29a||(_29a.instantiate&&_29a.instantiateChildren);
return _299.instantiate;
}));
});
}else{
d.resolve(list);
}
return d.promise;
},_require:function(_29c){
var hash=_245.fromJson("{"+_29c.innerHTML+"}"),vars=[],mids=[],d=new _248();
for(var name in hash){
vars.push(name);
mids.push(hash[name]);
}
_23e(mids,function(){
for(var i=0;i<vars.length;i++){
_23f.setObject(vars[i],arguments[i]);
}
d.resolve(arguments);
});
return d.promise;
},_scanAmd:function(root){
var _29d=new _248(),_29e=_29d.promise;
_29d.resolve(true);
var self=this;
_249("script[type='dojo/require']",root).forEach(function(node){
_29e=_29e.then(function(){
return self._require(node);
});
node.parentNode.removeChild(node);
});
return _29e;
},parse:function(_29f,_2a0){
var root;
if(!_2a0&&_29f&&_29f.rootNode){
_2a0=_29f;
root=_2a0.rootNode;
}else{
if(_29f&&_23f.isObject(_29f)&&!("nodeType" in _29f)){
_2a0=_29f;
}else{
root=_29f;
}
}
root=root?_242.byId(root):_243.body();
_2a0=_2a0||{};
var _2a1=_2a0.template?{template:true}:{},_2a2=[],self=this;
var p=this._scanAmd(root,_2a0).then(function(){
return self.scan(root,_2a0);
}).then(function(_2a3){
return _2a2=_2a2.concat(self._instantiate(_2a3,_2a1,_2a0));
}).otherwise(function(e){
console.error("dojo/parser::parse() error",e);
throw e;
});
_23f.mixin(_2a2,p);
return _2a2;
}};
if(1){
dojo.parser=_252;
}
if(_241.parseOnLoad){
_24a(100,_252,"parse");
}
return _252;
});
},"dijit/layout/_LayoutWidget":function(){
define("dijit/layout/_LayoutWidget",["dojo/_base/lang","../_Widget","../_Container","../_Contained","../Viewport","dojo/_base/declare","dojo/dom-class","dojo/dom-geometry","dojo/dom-style"],function(lang,_2a4,_2a5,_2a6,_2a7,_2a8,_2a9,_2aa,_2ab){
return _2a8("dijit.layout._LayoutWidget",[_2a4,_2a5,_2a6],{baseClass:"dijitLayoutContainer",isLayoutContainer:true,buildRendering:function(){
this.inherited(arguments);
_2a9.add(this.domNode,"dijitContainer");
},startup:function(){
if(this._started){
return;
}
this.inherited(arguments);
var _2ac=this.getParent&&this.getParent();
if(!(_2ac&&_2ac.isLayoutContainer)){
this.resize();
this.own(_2a7.on("resize",lang.hitch(this,"resize")));
}
},resize:function(_2ad,_2ae){
var node=this.domNode;
if(_2ad){
_2aa.setMarginBox(node,_2ad);
}
var mb=_2ae||{};
lang.mixin(mb,_2ad||{});
if(!("h" in mb)||!("w" in mb)){
mb=lang.mixin(_2aa.getMarginBox(node),mb);
}
var cs=_2ab.getComputedStyle(node);
var me=_2aa.getMarginExtents(node,cs);
var be=_2aa.getBorderExtents(node,cs);
var bb=(this._borderBox={w:mb.w-(me.w+be.w),h:mb.h-(me.h+be.h)});
var pe=_2aa.getPadExtents(node,cs);
this._contentBox={l:_2ab.toPixelValue(node,cs.paddingLeft),t:_2ab.toPixelValue(node,cs.paddingTop),w:bb.w-pe.w,h:bb.h-pe.h};
this.layout();
},layout:function(){
},_setupChild:function(_2af){
var cls=this.baseClass+"-child "+(_2af.baseClass?this.baseClass+"-"+_2af.baseClass:"");
_2a9.add(_2af.domNode,cls);
},addChild:function(_2b0,_2b1){
this.inherited(arguments);
if(this._started){
this._setupChild(_2b0);
}
},removeChild:function(_2b2){
var cls=this.baseClass+"-child"+(_2b2.baseClass?" "+this.baseClass+"-"+_2b2.baseClass:"");
_2a9.remove(_2b2.domNode,cls);
this.inherited(arguments);
}});
});
},"dijit/_Widget":function(){
define("dijit/_Widget",["dojo/aspect","dojo/_base/config","dojo/_base/connect","dojo/_base/declare","dojo/has","dojo/_base/kernel","dojo/_base/lang","dojo/query","dojo/ready","./registry","./_WidgetBase","./_OnDijitClickMixin","./_FocusMixin","dojo/uacss","./hccss"],function(_2b3,_2b4,_2b5,_2b6,has,_2b7,lang,_2b8,_2b9,_2ba,_2bb,_2bc,_2bd){
function _2be(){
};
function _2bf(_2c0){
return function(obj,_2c1,_2c2,_2c3){
if(obj&&typeof _2c1=="string"&&obj[_2c1]==_2be){
return obj.on(_2c1.substring(2).toLowerCase(),lang.hitch(_2c2,_2c3));
}
return _2c0.apply(_2b5,arguments);
};
};
_2b3.around(_2b5,"connect",_2bf);
if(_2b7.connect){
_2b3.around(_2b7,"connect",_2bf);
}
var _2c4=_2b6("dijit._Widget",[_2bb,_2bc,_2bd],{onClick:_2be,onDblClick:_2be,onKeyDown:_2be,onKeyPress:_2be,onKeyUp:_2be,onMouseDown:_2be,onMouseMove:_2be,onMouseOut:_2be,onMouseOver:_2be,onMouseLeave:_2be,onMouseEnter:_2be,onMouseUp:_2be,constructor:function(_2c5){
this._toConnect={};
for(var name in _2c5){
if(this[name]===_2be){
this._toConnect[name.replace(/^on/,"").toLowerCase()]=_2c5[name];
delete _2c5[name];
}
}
},postCreate:function(){
this.inherited(arguments);
for(var name in this._toConnect){
this.on(name,this._toConnect[name]);
}
delete this._toConnect;
},on:function(type,func){
if(this[this._onMap(type)]===_2be){
return _2b5.connect(this.domNode,type.toLowerCase(),this,func);
}
return this.inherited(arguments);
},_setFocusedAttr:function(val){
this._focused=val;
this._set("focused",val);
},setAttribute:function(attr,_2c6){
_2b7.deprecated(this.declaredClass+"::setAttribute(attr, value) is deprecated. Use set() instead.","","2.0");
this.set(attr,_2c6);
},attr:function(name,_2c7){
if(_2b4.isDebug){
var _2c8=arguments.callee._ach||(arguments.callee._ach={}),_2c9=(arguments.callee.caller||"unknown caller").toString();
if(!_2c8[_2c9]){
_2b7.deprecated(this.declaredClass+"::attr() is deprecated. Use get() or set() instead, called from "+_2c9,"","2.0");
_2c8[_2c9]=true;
}
}
var args=arguments.length;
if(args>=2||typeof name==="object"){
return this.set.apply(this,arguments);
}else{
return this.get(name);
}
},getDescendants:function(){
_2b7.deprecated(this.declaredClass+"::getDescendants() is deprecated. Use getChildren() instead.","","2.0");
return this.containerNode?_2b8("[widgetId]",this.containerNode).map(_2ba.byNode):[];
},_onShow:function(){
this.onShow();
},onShow:function(){
},onHide:function(){
},onClose:function(){
return true;
}});
if(has("dijit-legacy-requires")){
_2b9(0,function(){
var _2ca=["dijit/_base"];
require(_2ca);
});
}
return _2c4;
});
},"dijit/_FocusMixin":function(){
define(["./focus","./_WidgetBase","dojo/_base/declare","dojo/_base/lang"],function(_2cb,_2cc,_2cd,lang){
lang.extend(_2cc,{focused:false,onFocus:function(){
},onBlur:function(){
},_onFocus:function(){
this.onFocus();
},_onBlur:function(){
this.onBlur();
}});
return _2cd("dijit._FocusMixin",null,{_focusManager:_2cb});
});
},"dijit/focus":function(){
define("dijit/focus",["dojo/aspect","dojo/_base/declare","dojo/dom","dojo/dom-attr","dojo/dom-construct","dojo/Evented","dojo/_base/lang","dojo/on","dojo/ready","dojo/sniff","dojo/Stateful","dojo/_base/unload","dojo/_base/window","dojo/window","./a11y","./registry","./main"],function(_2ce,_2cf,dom,_2d0,_2d1,_2d2,lang,on,_2d3,has,_2d4,_2d5,win,_2d6,a11y,_2d7,_2d8){
var _2d9=_2cf([_2d4,_2d2],{curNode:null,activeStack:[],constructor:function(){
var _2da=lang.hitch(this,function(node){
if(dom.isDescendant(this.curNode,node)){
this.set("curNode",null);
}
if(dom.isDescendant(this.prevNode,node)){
this.set("prevNode",null);
}
});
_2ce.before(_2d1,"empty",_2da);
_2ce.before(_2d1,"destroy",_2da);
},registerIframe:function(_2db){
return this.registerWin(_2db.contentWindow,_2db);
},registerWin:function(_2dc,_2dd){
var _2de=this;
var _2df=function(evt){
_2de._justMouseDowned=true;
setTimeout(function(){
_2de._justMouseDowned=false;
},0);
if(has("ie")&&evt&&evt.srcElement&&evt.srcElement.parentNode==null){
return;
}
_2de._onTouchNode(_2dd||evt.target||evt.srcElement,"mouse");
};
var doc=has("ie")?_2dc.document.documentElement:_2dc.document;
if(doc){
if(has("ie")){
_2dc.document.body.attachEvent("onmousedown",_2df);
var _2e0=function(evt){
var tag=evt.srcElement.tagName.toLowerCase();
if(tag=="#document"||tag=="body"){
return;
}
if(a11y.isTabNavigable(evt.srcElement)){
_2de._onFocusNode(_2dd||evt.srcElement);
}else{
_2de._onTouchNode(_2dd||evt.srcElement);
}
};
doc.attachEvent("onfocusin",_2e0);
var _2e1=function(evt){
_2de._onBlurNode(_2dd||evt.srcElement);
};
doc.attachEvent("onfocusout",_2e1);
return {remove:function(){
_2dc.document.detachEvent("onmousedown",_2df);
doc.detachEvent("onfocusin",_2e0);
doc.detachEvent("onfocusout",_2e1);
doc=null;
}};
}else{
doc.body.addEventListener("mousedown",_2df,true);
doc.body.addEventListener("touchstart",_2df,true);
var _2e2=function(evt){
_2de._onFocusNode(_2dd||evt.target);
};
doc.addEventListener("focus",_2e2,true);
var _2e3=function(evt){
_2de._onBlurNode(_2dd||evt.target);
};
doc.addEventListener("blur",_2e3,true);
return {remove:function(){
doc.body.removeEventListener("mousedown",_2df,true);
doc.body.removeEventListener("touchstart",_2df,true);
doc.removeEventListener("focus",_2e2,true);
doc.removeEventListener("blur",_2e3,true);
doc=null;
}};
}
}
},_onBlurNode:function(node){
if(this._clearFocusTimer){
clearTimeout(this._clearFocusTimer);
}
this._clearFocusTimer=setTimeout(lang.hitch(this,function(){
this.set("prevNode",this.curNode);
this.set("curNode",null);
}),0);
if(this._justMouseDowned){
return;
}
if(this._clearActiveWidgetsTimer){
clearTimeout(this._clearActiveWidgetsTimer);
}
this._clearActiveWidgetsTimer=setTimeout(lang.hitch(this,function(){
delete this._clearActiveWidgetsTimer;
this._setStack([]);
}),0);
},_onTouchNode:function(node,by){
if(this._clearActiveWidgetsTimer){
clearTimeout(this._clearActiveWidgetsTimer);
delete this._clearActiveWidgetsTimer;
}
var _2e4=[];
try{
while(node){
var _2e5=_2d0.get(node,"dijitPopupParent");
if(_2e5){
node=_2d7.byId(_2e5).domNode;
}else{
if(node.tagName&&node.tagName.toLowerCase()=="body"){
if(node===win.body()){
break;
}
node=_2d6.get(node.ownerDocument).frameElement;
}else{
var id=node.getAttribute&&node.getAttribute("widgetId"),_2e6=id&&_2d7.byId(id);
if(_2e6&&!(by=="mouse"&&_2e6.get("disabled"))){
_2e4.unshift(id);
}
node=node.parentNode;
}
}
}
}
catch(e){
}
this._setStack(_2e4,by);
},_onFocusNode:function(node){
if(!node){
return;
}
if(node.nodeType==9){
return;
}
if(this._clearFocusTimer){
clearTimeout(this._clearFocusTimer);
delete this._clearFocusTimer;
}
this._onTouchNode(node);
if(node==this.curNode){
return;
}
this.set("prevNode",this.curNode);
this.set("curNode",node);
},_setStack:function(_2e7,by){
var _2e8=this.activeStack;
this.set("activeStack",_2e7);
for(var _2e9=0;_2e9<Math.min(_2e8.length,_2e7.length);_2e9++){
if(_2e8[_2e9]!=_2e7[_2e9]){
break;
}
}
var _2ea;
for(var i=_2e8.length-1;i>=_2e9;i--){
_2ea=_2d7.byId(_2e8[i]);
if(_2ea){
_2ea._hasBeenBlurred=true;
_2ea.set("focused",false);
if(_2ea._focusManager==this){
_2ea._onBlur(by);
}
this.emit("widget-blur",_2ea,by);
}
}
for(i=_2e9;i<_2e7.length;i++){
_2ea=_2d7.byId(_2e7[i]);
if(_2ea){
_2ea.set("focused",true);
if(_2ea._focusManager==this){
_2ea._onFocus(by);
}
this.emit("widget-focus",_2ea,by);
}
}
},focus:function(node){
if(node){
try{
node.focus();
}
catch(e){
}
}
}});
var _2eb=new _2d9();
_2d3(function(){
var _2ec=_2eb.registerWin(_2d6.get(win.doc));
if(has("ie")){
_2d5.addOnWindowUnload(function(){
if(_2ec){
_2ec.remove();
_2ec=null;
}
});
}
});
_2d8.focus=function(node){
_2eb.focus(node);
};
for(var attr in _2eb){
if(!/^_/.test(attr)){
_2d8.focus[attr]=typeof _2eb[attr]=="function"?lang.hitch(_2eb,attr):_2eb[attr];
}
}
_2eb.watch(function(attr,_2ed,_2ee){
_2d8.focus[attr]=_2ee;
});
return _2eb;
});
},"dijit/_Contained":function(){
define("dijit/_Contained",["dojo/_base/declare","./registry"],function(_2ef,_2f0){
return _2ef("dijit._Contained",null,{_getSibling:function(_2f1){
var node=this.domNode;
do{
node=node[_2f1+"Sibling"];
}while(node&&node.nodeType!=1);
return node&&_2f0.byNode(node);
},getPreviousSibling:function(){
return this._getSibling("previous");
},getNextSibling:function(){
return this._getSibling("next");
},getIndexInParent:function(){
var p=this.getParent();
if(!p||!p.getIndexOfChild){
return -1;
}
return p.getIndexOfChild(this);
}});
});
},"dijit/_base/scroll":function(){
define("dijit/_base/scroll",["dojo/window","../main"],function(_2f2,_2f3){
_2f3.scrollIntoView=function(node,pos){
_2f2.scrollIntoView(node,pos);
};
});
},"dijit/main":function(){
define("dijit/main",["dojo/_base/kernel"],function(dojo){
return dojo.dijit;
});
},"dijit/Destroyable":function(){
define("dijit/Destroyable",["dojo/_base/array","dojo/aspect","dojo/_base/declare"],function(_2f4,_2f5,_2f6){
return _2f6("dijit.Destroyable",null,{destroy:function(_2f7){
this._destroyed=true;
},own:function(){
_2f4.forEach(arguments,function(_2f8){
var _2f9="destroyRecursive" in _2f8?"destroyRecursive":"destroy" in _2f8?"destroy":"remove";
var odh=_2f5.before(this,"destroy",function(_2fa){
_2f8[_2f9](_2fa);
});
var hdh=_2f5.after(_2f8,_2f9,function(){
odh.remove();
hdh.remove();
},true);
},this);
return arguments;
}});
});
},"dojo/cache":function(){
define(["./_base/kernel","./text"],function(dojo){
return dojo.cache;
});
},"dijit/_base/window":function(){
define("dijit/_base/window",["dojo/window","../main"],function(_2fb,_2fc){
_2fc.getDocumentWindow=function(doc){
return _2fb.get(doc);
};
});
},"dijit/_base/typematic":function(){
define(["../typematic"],function(){
});
},"dijit/_base/popup":function(){
define("dijit/_base/popup",["dojo/dom-class","dojo/_base/window","../popup","../BackgroundIframe"],function(_2fd,win,_2fe){
var _2ff=_2fe._createWrapper;
_2fe._createWrapper=function(_300){
if(!_300.declaredClass){
_300={_popupWrapper:(_300.parentNode&&_2fd.contains(_300.parentNode,"dijitPopup"))?_300.parentNode:null,domNode:_300,destroy:function(){
},ownerDocument:_300.ownerDocument,ownerDocumentBody:win.body(_300.ownerDocument)};
}
return _2ff.call(this,_300);
};
var _301=_2fe.open;
_2fe.open=function(args){
if(args.orient&&typeof args.orient!="string"&&!("length" in args.orient)){
var ary=[];
for(var key in args.orient){
ary.push({aroundCorner:key,corner:args.orient[key]});
}
args.orient=ary;
}
return _301.call(this,args);
};
return _2fe;
});
},"dijit/_Container":function(){
define("dijit/_Container",["dojo/_base/array","dojo/_base/declare","dojo/dom-construct"],function(_302,_303,_304){
return _303("dijit._Container",null,{buildRendering:function(){
this.inherited(arguments);
if(!this.containerNode){
this.containerNode=this.domNode;
}
},addChild:function(_305,_306){
var _307=this.containerNode;
if(_306&&typeof _306=="number"){
var _308=this.getChildren();
if(_308&&_308.length>=_306){
_307=_308[_306-1].domNode;
_306="after";
}
}
_304.place(_305.domNode,_307,_306);
if(this._started&&!_305._started){
_305.startup();
}
},removeChild:function(_309){
if(typeof _309=="number"){
_309=this.getChildren()[_309];
}
if(_309){
var node=_309.domNode;
if(node&&node.parentNode){
node.parentNode.removeChild(node);
}
}
},hasChildren:function(){
return this.getChildren().length>0;
},_getSiblingOfChild:function(_30a,dir){
var _30b=this.getChildren(),idx=_302.indexOf(this.getChildren(),_30a);
return _30b[idx+dir];
},getIndexOfChild:function(_30c){
return _302.indexOf(this.getChildren(),_30c);
}});
});
}}});
define("dijit/dijit",["./main","./_base","dojo/parser","./_Widget","./_TemplatedMixin","./_Container","./layout/_LayoutWidget","./form/_FormWidget","./form/_FormValueWidget"],function(_30d){
return _30d;
});
