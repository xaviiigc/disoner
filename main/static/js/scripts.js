/*
	Autores: Marcos Aguayo y Xavi Güell
	Fecha de inicio: 10/04/2013
	Fecha de finalización: 01/06/2013
	Objetivo: Fichero de scripts jQuery.
*/


/**
 * Cuando se haya cargado el documento y este listo,
 * ejecutara la función "inicio".
 */
$(document).on('ready', inicio);
var contador_tags = 5;

/**
* Bootstrap.js by @fat & @mdo
* plugins: bootstrap-transition.js, bootstrap-modal.js, bootstrap-dropdown.js, bootstrap-alert.js, bootstrap-button.js, bootstrap-collapse.js
* Copyright 2012 Twitter, Inc.
* http://www.apache.org/licenses/LICENSE-2.0.txt
*/!function(a){a(function(){a.support.transition=function(){var a=function(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"},c;for(c in b)if(a.style[c]!==undefined)return b[c]}();return a&&{end:a}}()})}(window.jQuery),!function(a){var b=function(b,c){this.options=c,this.$element=a(b).delegate('[data-dismiss="modal"]',"click.dismiss.modal",a.proxy(this.hide,this)),this.options.remote&&this.$element.find(".modal-body").load(this.options.remote)};b.prototype={constructor:b,toggle:function(){return this[this.isShown?"hide":"show"]()},show:function(){var b=this,c=a.Event("show");this.$element.trigger(c);if(this.isShown||c.isDefaultPrevented())return;this.isShown=!0,this.escape(),this.backdrop(function(){var c=a.support.transition&&b.$element.hasClass("fade");b.$element.parent().length||b.$element.appendTo(document.body),b.$element.show(),c&&b.$element[0].offsetWidth,b.$element.addClass("in").attr("aria-hidden",!1),b.enforceFocus(),c?b.$element.one(a.support.transition.end,function(){b.$element.focus().trigger("shown")}):b.$element.focus().trigger("shown")})},hide:function(b){b&&b.preventDefault();var c=this;b=a.Event("hide"),this.$element.trigger(b);if(!this.isShown||b.isDefaultPrevented())return;this.isShown=!1,this.escape(),a(document).off("focusin.modal"),this.$element.removeClass("in").attr("aria-hidden",!0),a.support.transition&&this.$element.hasClass("fade")?this.hideWithTransition():this.hideModal()},enforceFocus:function(){var b=this;a(document).on("focusin.modal",function(a){b.$element[0]!==a.target&&!b.$element.has(a.target).length&&b.$element.focus()})},escape:function(){var a=this;this.isShown&&this.options.keyboard?this.$element.on("keyup.dismiss.modal",function(b){b.which==27&&a.hide()}):this.isShown||this.$element.off("keyup.dismiss.modal")},hideWithTransition:function(){var b=this,c=setTimeout(function(){b.$element.off(a.support.transition.end),b.hideModal()},500);this.$element.one(a.support.transition.end,function(){clearTimeout(c),b.hideModal()})},hideModal:function(){var a=this;this.$element.hide(),this.backdrop(function(){a.removeBackdrop(),a.$element.trigger("hidden")})},removeBackdrop:function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},backdrop:function(b){var c=this,d=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var e=a.support.transition&&d;this.$backdrop=a('<div class="modal-backdrop '+d+'" />').appendTo(document.body),this.$backdrop.click(this.options.backdrop=="static"?a.proxy(this.$element[0].focus,this.$element[0]):a.proxy(this.hide,this)),e&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in");if(!b)return;e?this.$backdrop.one(a.support.transition.end,b):b()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(a.support.transition.end,b):b()):b&&b()}};var c=a.fn.modal;a.fn.modal=function(c){return this.each(function(){var d=a(this),e=d.data("modal"),f=a.extend({},a.fn.modal.defaults,d.data(),typeof c=="object"&&c);e||d.data("modal",e=new b(this,f)),typeof c=="string"?e[c]():f.show&&e.show()})},a.fn.modal.defaults={backdrop:!0,keyboard:!0,show:!0},a.fn.modal.Constructor=b,a.fn.modal.noConflict=function(){return a.fn.modal=c,this},a(document).on("click.modal.data-api",'[data-toggle="modal"]',function(b){var c=a(this),d=c.attr("href"),e=a(c.attr("data-target")||d&&d.replace(/.*(?=#[^\s]+$)/,"")),f=e.data("modal")?"toggle":a.extend({remote:!/#/.test(d)&&d},e.data(),c.data());b.preventDefault(),e.modal(f).one("hide",function(){c.focus()})})}(window.jQuery),!function(a){function d(){a(".dropdown-backdrop").remove(),a(b).each(function(){e(a(this)).removeClass("open")})}function e(b){var c=b.attr("data-target"),d;c||(c=b.attr("href"),c=c&&/#/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,"")),d=c&&a(c);if(!d||!d.length)d=b.parent();return d}var b="[data-toggle=dropdown]",c=function(b){var c=a(b).on("click.dropdown.data-api",this.toggle);a("html").on("click.dropdown.data-api",function(){c.parent().removeClass("open")})};c.prototype={constructor:c,toggle:function(b){var c=a(this),f,g;if(c.is(".disabled, :disabled"))return;return f=e(c),g=f.hasClass("open"),d(),g||("ontouchstart"in document.documentElement&&a('<div class="dropdown-backdrop"/>').insertBefore(a(this)).on("click",d),f.toggleClass("open")),c.focus(),!1},keydown:function(c){var d,f,g,h,i,j;if(!/(38|40|27)/.test(c.keyCode))return;d=a(this),c.preventDefault(),c.stopPropagation();if(d.is(".disabled, :disabled"))return;h=e(d),i=h.hasClass("open");if(!i||i&&c.keyCode==27)return c.which==27&&h.find(b).focus(),d.click();f=a("[role=menu] li:not(.divider):visible a",h);if(!f.length)return;j=f.index(f.filter(":focus")),c.keyCode==38&&j>0&&j--,c.keyCode==40&&j<f.length-1&&j++,~j||(j=0),f.eq(j).focus()}};var f=a.fn.dropdown;a.fn.dropdown=function(b){return this.each(function(){var d=a(this),e=d.data("dropdown");e||d.data("dropdown",e=new c(this)),typeof b=="string"&&e[b].call(d)})},a.fn.dropdown.Constructor=c,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=f,this},a(document).on("click.dropdown.data-api",d).on("click.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.dropdown.data-api",b,c.prototype.toggle).on("keydown.dropdown.data-api",b+", [role=menu]",c.prototype.keydown)}(window.jQuery),!function(a){var b='[data-dismiss="alert"]',c=function(c){a(c).on("click",b,this.close)};c.prototype.close=function(b){function f(){e.trigger("closed").remove()}var c=a(this),d=c.attr("data-target"),e;d||(d=c.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),e=a(d),b&&b.preventDefault(),e.length||(e=c.hasClass("alert")?c:c.parent()),e.trigger(b=a.Event("close"));if(b.isDefaultPrevented())return;e.removeClass("in"),a.support.transition&&e.hasClass("fade")?e.on(a.support.transition.end,f):f()};var d=a.fn.alert;a.fn.alert=function(b){return this.each(function(){var d=a(this),e=d.data("alert");e||d.data("alert",e=new c(this)),typeof b=="string"&&e[b].call(d)})},a.fn.alert.Constructor=c,a.fn.alert.noConflict=function(){return a.fn.alert=d,this},a(document).on("click.alert.data-api",b,c.prototype.close)}(window.jQuery),!function(a){var b=function(b,c){this.$element=a(b),this.options=a.extend({},a.fn.button.defaults,c)};b.prototype.setState=function(a){var b="disabled",c=this.$element,d=c.data(),e=c.is("input")?"val":"html";a+="Text",d.resetText||c.data("resetText",c[e]()),c[e](d[a]||this.options[a]),setTimeout(function(){a=="loadingText"?c.addClass(b).attr(b,b):c.removeClass(b).removeAttr(b)},0)},b.prototype.toggle=function(){var a=this.$element.closest('[data-toggle="buttons-radio"]');a&&a.find(".active").removeClass("active"),this.$element.toggleClass("active")};var c=a.fn.button;a.fn.button=function(c){return this.each(function(){var d=a(this),e=d.data("button"),f=typeof c=="object"&&c;e||d.data("button",e=new b(this,f)),c=="toggle"?e.toggle():c&&e.setState(c)})},a.fn.button.defaults={loadingText:"loading..."},a.fn.button.Constructor=b,a.fn.button.noConflict=function(){return a.fn.button=c,this},a(document).on("click.button.data-api","[data-toggle^=button]",function(b){var c=a(b.target);c.hasClass("btn")||(c=c.closest(".btn")),c.button("toggle")})}(window.jQuery),!function(a){var b=function(b,c){this.$element=a(b),this.options=a.extend({},a.fn.collapse.defaults,c),this.options.parent&&(this.$parent=a(this.options.parent)),this.options.toggle&&this.toggle()};b.prototype={constructor:b,dimension:function(){var a=this.$element.hasClass("width");return a?"width":"height"},show:function(){var b,c,d,e;if(this.transitioning||this.$element.hasClass("in"))return;b=this.dimension(),c=a.camelCase(["scroll",b].join("-")),d=this.$parent&&this.$parent.find("> .accordion-group > .in");if(d&&d.length){e=d.data("collapse");if(e&&e.transitioning)return;d.collapse("hide"),e||d.data("collapse",null)}this.$element[b](0),this.transition("addClass",a.Event("show"),"shown"),a.support.transition&&this.$element[b](this.$element[0][c])},hide:function(){var b;if(this.transitioning||!this.$element.hasClass("in"))return;b=this.dimension(),this.reset(this.$element[b]()),this.transition("removeClass",a.Event("hide"),"hidden"),this.$element[b](0)},reset:function(a){var b=this.dimension();return this.$element.removeClass("collapse")[b](a||"auto")[0].offsetWidth,this.$element[a!==null?"addClass":"removeClass"]("collapse"),this},transition:function(b,c,d){var e=this,f=function(){c.type=="show"&&e.reset(),e.transitioning=0,e.$element.trigger(d)};this.$element.trigger(c);if(c.isDefaultPrevented())return;this.transitioning=1,this.$element[b]("in"),a.support.transition&&this.$element.hasClass("collapse")?this.$element.one(a.support.transition.end,f):f()},toggle:function(){this[this.$element.hasClass("in")?"hide":"show"]()}};var c=a.fn.collapse;a.fn.collapse=function(c){return this.each(function(){var d=a(this),e=d.data("collapse"),f=a.extend({},a.fn.collapse.defaults,d.data(),typeof c=="object"&&c);e||d.data("collapse",e=new b(this,f)),typeof c=="string"&&e[c]()})},a.fn.collapse.defaults={toggle:!0},a.fn.collapse.Constructor=b,a.fn.collapse.noConflict=function(){return a.fn.collapse=c,this},a(document).on("click.collapse.data-api","[data-toggle=collapse]",function(b){var c=a(this),d,e=c.attr("data-target")||b.preventDefault()||(d=c.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,""),f=a(e).data("collapse")?"toggle":c.data();c[a(e).hasClass("in")?"addClass":"removeClass"]("collapsed"),a(e).collapse(f)})}(window.jQuery)


/*! Backstretch - v2.0.3 - 2012-11-30
* http://srobbin.com/jquery-plugins/backstretch/
* Copyright (c) 2012 Scott Robbin; Licensed MIT 
*/!function(e,t,n){"use strict";e.fn.backstretch=function(r,s){return(r===n||r.length===0)&&e.error("No images were supplied for Backstretch"),e(t).scrollTop()===0&&t.scrollTo(0,0),this.each(function(){var t=e(this),n=t.data("backstretch");n&&(s=e.extend(n.options,s),n.destroy(!0)),n=new i(this,r,s),t.data("backstretch",n)})},e.backstretch=function(t,n){return e("body").backstretch(t,n).data("backstretch")},e.expr[":"].backstretch=function(t){return e(t).data("backstretch")!==n},e.fn.backstretch.defaults={centeredX:!0,centeredY:!0,duration:5e3,fade:0};var r={wrap:{left:0,top:0,overflow:"hidden",margin:0,padding:0,height:"100%",width:"100%",zIndex:-999999},img:{position:"absolute",display:"none",margin:0,padding:0,border:"none",width:"auto",height:"auto",maxWidth:"none",zIndex:-999999}},i=function(n,i,o){this.options=e.extend({},e.fn.backstretch.defaults,o||{}),this.images=e.isArray(i)?i:[i],e.each(this.images,function(){e("<img />")[0].src=this}),this.isBody=n===document.body,this.$container=e(n),this.$wrap=e('<div class="backstretch"></div>').css(r.wrap).appendTo(this.$container),this.$root=this.isBody?s?e(t):e(document):this.$container;if(!this.isBody){var u=this.$container.css("position"),a=this.$container.css("zIndex");this.$container.css({position:u==="static"?"relative":u,zIndex:a==="auto"?0:a,background:"none"}),this.$wrap.css({zIndex:-999998})}this.$wrap.css({position:this.isBody&&s?"fixed":"absolute"}),this.index=0,this.show(this.index),e(t).on("resize.backstretch",e.proxy(this.resize,this)).on("orientationchange.backstretch",e.proxy(function(){this.isBody&&t.pageYOffset===0&&(t.scrollTo(0,1),this.resize())},this))};i.prototype={resize:function(){try{var e={left:0,top:0},n=this.isBody?this.$root.width():this.$root.innerWidth(),r=n,i=this.isBody?t.innerHeight?t.innerHeight:this.$root.height():this.$root.innerHeight(),s=r/this.$img.data("ratio"),o;s>=i?(o=(s-i)/2,this.options.centeredY&&(e.top="-"+o+"px")):(s=i,r=s*this.$img.data("ratio"),o=(r-n)/2,this.options.centeredX&&(e.left="-"+o+"px")),this.$wrap.css({width:n,height:i}).find("img:not(.deleteable)").css({width:r,height:s}).css(e)}catch(u){}return this},show:function(t){if(Math.abs(t)>this.images.length-1)return;this.index=t;var n=this,i=n.$wrap.find("img").addClass("deleteable"),s=e.Event("backstretch.show",{relatedTarget:n.$container[0]});return clearInterval(n.interval),n.$img=e("<img />").css(r.img).bind("load",function(t){var r=this.width||e(t.target).width(),o=this.height||e(t.target).height();e(this).data("ratio",r/o),e(this).fadeIn(n.options.speed||n.options.fade,function(){i.remove(),n.paused||n.cycle(),n.$container.trigger(s,n)}),n.resize()}).appendTo(n.$wrap),n.$img.attr("src",n.images[t]),n},next:function(){return this.show(this.index<this.images.length-1?this.index+1:0)},prev:function(){return this.show(this.index===0?this.images.length-1:this.index-1)},pause:function(){return this.paused=!0,this},resume:function(){return this.paused=!1,this.next(),this},cycle:function(){return this.images.length>1&&(clearInterval(this.interval),this.interval=setInterval(e.proxy(function(){this.paused||this.next()},this),this.options.duration)),this},destroy:function(n){e(t).off("resize.backstretch orientationchange.backstretch"),clearInterval(this.interval),n||this.$wrap.remove(),this.$container.removeData("backstretch")}};var s=function(){var e=navigator.userAgent,n=navigator.platform,r=e.match(/AppleWebKit\/([0-9]+)/),i=!!r&&r[1],s=e.match(/Fennec\/([0-9]+)/),o=!!s&&s[1],u=e.match(/Opera Mobi\/([0-9]+)/),a=!!u&&u[1],f=e.match(/MSIE ([0-9]+)/),l=!!f&&f[1];return!((n.indexOf("iPhone")>-1||n.indexOf("iPad")>-1||n.indexOf("iPod")>-1)&&i&&i<534||t.operamini&&{}.toString.call(t.operamini)==="[object OperaMini]"||u&&a<7458||e.indexOf("Android")>-1&&i&&i<533||o&&o<6||"palmGetResource"in t&&i&&i<534||e.indexOf("MeeGo")>-1&&e.indexOf("NokiaBrowser/8.5.0")>-1||l&&l<=6)}()}(jQuery,window);


/**
 * alertify
 * An unobtrusive customizable JavaScript notification system
 *
 * @author Fabien Doiron <fabien.doiron@gmail.com>
 * @copyright Fabien Doiron 2013
 * @license MIT <http://opensource.org/licenses/mit-license.php>
 * @link http://fabien-d.github.com/alertify.js/
 * @module alertify
 * @version 0.3.8
 */!(function(e,t){"use strict";var n=e.document,r;r=function(){var r={},i={},s=!1,o={ENTER:13,ESC:27,SPACE:32},u=[],a,f,l,c,h,p,d,v,m,g,y,b;return i={buttons:{holder:'<nav class="alertify-buttons">{{buttons}}</nav>',submit:'<button type="submit" class="alertify-button alertify-button-ok" id="alertify-ok">{{ok}}</button>',ok:'<a href="#" class="alertify-button alertify-button-ok" id="alertify-ok">{{ok}}</a>',cancel:'<a href="#" class="alertify-button alertify-button-cancel" id="alertify-cancel">{{cancel}}</a>'},input:'<div class="alertify-text-wrapper"><input type="text" class="alertify-text" id="alertify-text"></div>',message:'<p class="alertify-message">{{message}}</p>',log:'<article class="alertify-log{{class}}">{{message}}</article>'},b=function(){var e,r=n.createElement("fakeelement"),i={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"otransitionend",transition:"transitionend"};for(e in i)if(r.style[e]!==t)return i[e]},a=function(e){return n.getElementById(e)},r={labels:{ok:"OK",cancel:"Cancel"},delay:5e3,buttonReverse:!1,buttonFocus:"ok",transition:t,addListeners:function(e){var t=typeof l!="undefined",r=typeof f!="undefined",i=typeof y!="undefined",s="",u=this,a,h,p,d,v;a=function(t){return typeof t.preventDefault!="undefined"&&t.preventDefault(),p(t),typeof y!="undefined"&&(s=y.value),typeof e=="function"&&(typeof y!="undefined"?e(!0,s):e(!0)),!1},h=function(t){return typeof t.preventDefault!="undefined"&&t.preventDefault(),p(t),typeof e=="function"&&e(!1),!1},p=function(e){u.hide(),u.unbind(n.body,"keyup",d),u.unbind(c,"focus",v),i&&u.unbind(g,"submit",a),t&&u.unbind(l,"click",a),r&&u.unbind(f,"click",h)},d=function(e){var t=e.keyCode;t===o.SPACE&&!i&&a(e),t===o.ESC&&r&&h(e)},v=function(e){i?y.focus():r?f.focus():l.focus()},this.bind(c,"focus",v),t&&this.bind(l,"click",a),r&&this.bind(f,"click",h),this.bind(n.body,"keyup",d),i&&this.bind(g,"submit",a),typeof this.transition=="undefined"&&this.setFocus()},bind:function(e,t,n){typeof e.addEventListener=="function"?e.addEventListener(t,n,!1):e.attachEvent&&e.attachEvent("on"+t,n)},handleErrors:function(){if(typeof e.onerror!="undefined"){var t=this;return e.onerror=function(e,n,r){t.error("["+e+" on line "+r+" of "+n+"]",0)},!0}return!1},appendButtons:function(e,t){return this.buttonReverse?t+e:e+t},build:function(e){var t="",n=e.type,s=e.message,o=e.cssClass||"";t+='<div class="alertify-dialog">',r.buttonFocus==="none"&&(t+='<a href="#" id="alertify-noneFocus" class="alertify-hidden"></a>'),n==="prompt"&&(t+='<form id="alertify-form">'),t+='<article class="alertify-inner">',t+=i.message.replace("{{message}}",s),n==="prompt"&&(t+=i.input),t+=i.buttons.holder,t+="</article>",n==="prompt"&&(t+="</form>"),t+='<a id="alertify-resetFocus" class="alertify-resetFocus" href="#">Reset Focus</a>',t+="</div>";switch(n){case"confirm":t=t.replace("{{buttons}}",this.appendButtons(i.buttons.cancel,i.buttons.ok)),t=t.replace("{{ok}}",this.labels.ok).replace("{{cancel}}",this.labels.cancel);break;case"prompt":t=t.replace("{{buttons}}",this.appendButtons(i.buttons.cancel,i.buttons.submit)),t=t.replace("{{ok}}",this.labels.ok).replace("{{cancel}}",this.labels.cancel);break;case"alert":t=t.replace("{{buttons}}",i.buttons.ok),t=t.replace("{{ok}}",this.labels.ok);break;default:}return v.className="alertify alertify-show alertify-"+n+" "+o,d.className="alertify-cover",t},close:function(e,t){var n=t&&!isNaN(t)?+t:this.delay,r=this,i,s;this.bind(e,"click",function(){i(e)}),s=function(e){e.stopPropagation(),r.unbind(this,r.transition,s),m.removeChild(this),m.hasChildNodes()||(m.className+=" alertify-logs-hidden")},i=function(e){typeof e!="undefined"&&e.parentNode===m&&(typeof r.transition!="undefined"?(r.bind(e,r.transition,s),e.className+=" alertify-log-hide"):(m.removeChild(e),m.hasChildNodes()||(m.className+=" alertify-logs-hidden")))};if(t===0)return;setTimeout(function(){i(e)},n)},dialog:function(e,t,r,i,o){p=n.activeElement;var a=function(){if(v&&v.scrollTop!==null)return;a()};if(typeof e!="string")throw new Error("message must be a string");if(typeof t!="string")throw new Error("type must be a string");if(typeof r!="undefined"&&typeof r!="function")throw new Error("fn must be a function");return typeof this.init=="function"&&(this.init(),a()),u.push({type:t,message:e,callback:r,placeholder:i,cssClass:o}),s||this.setup(),this},extend:function(e){if(typeof e!="string")throw new Error("extend method must have exactly one paramter");return function(t,n){return this.log(t,e,n),this}},hide:function(){var e,t=this;u.splice(0,1),u.length>0?this.setup():(s=!1,e=function(n){n.stopPropagation(),v.className+=" alertify-isHidden",t.unbind(v,t.transition,e)},typeof this.transition!="undefined"?(this.bind(v,this.transition,e),v.className="alertify alertify-hide alertify-hidden"):v.className="alertify alertify-hide alertify-hidden alertify-isHidden",d.className="alertify-cover alertify-cover-hidden",p.focus())},init:function(){n.createElement("nav"),n.createElement("article"),n.createElement("section"),d=n.createElement("div"),d.setAttribute("id","alertify-cover"),d.className="alertify-cover alertify-cover-hidden",n.body.appendChild(d),v=n.createElement("section"),v.setAttribute("id","alertify"),v.className="alertify alertify-hidden",n.body.appendChild(v),m=n.createElement("section"),m.setAttribute("id","alertify-logs"),m.className="alertify-logs alertify-logs-hidden",n.body.appendChild(m),n.body.setAttribute("tabindex","0"),this.transition=b(),delete this.init},log:function(e,t,n){var r=function(){if(m&&m.scrollTop!==null)return;r()};return typeof this.init=="function"&&(this.init(),r()),m.className="alertify-logs",this.notify(e,t,n),this},notify:function(e,t,r){var i=n.createElement("article");i.className="alertify-log"+(typeof t=="string"&&t!==""?" alertify-log-"+t:""),i.innerHTML=e,m.insertBefore(i,m.firstChild),setTimeout(function(){i.className=i.className+" alertify-log-show"},50),this.close(i,r)},set:function(e){var t;if(typeof e!="object"&&e instanceof Array)throw new Error("args must be an object");for(t in e)e.hasOwnProperty(t)&&(this[t]=e[t])},setFocus:function(){y?(y.focus(),y.select()):h.focus()},setup:function(){var e=u[0],n=this,i;s=!0,i=function(e){e.stopPropagation(),n.setFocus(),n.unbind(v,n.transition,i)},typeof this.transition!="undefined"&&this.bind(v,this.transition,i),v.innerHTML=this.build(e),c=a("alertify-resetFocus"),l=a("alertify-ok")||t,f=a("alertify-cancel")||t,h=r.buttonFocus==="cancel"?f:r.buttonFocus==="none"?a("alertify-noneFocus"):l,y=a("alertify-text")||t,g=a("alertify-form")||t,typeof e.placeholder=="string"&&e.placeholder!==""&&(y.value=e.placeholder),this.addListeners(e.callback)},unbind:function(e,t,n){typeof e.removeEventListener=="function"?e.removeEventListener(t,n,!1):e.detachEvent&&e.detachEvent("on"+t,n)}},{alert:function(e,t,n){return r.dialog(e,"alert",t,"",n),this},confirm:function(e,t,n){return r.dialog(e,"confirm",t,"",n),this},extend:r.extend,init:r.init,log:function(e,t,n){return r.log(e,t,n),this},prompt:function(e,t,n,i){return r.dialog(e,"prompt",t,n,i),this},success:function(e,t){return r.log(e,"success",t),this},error:function(e,t){return r.log(e,"error",t),this},set:function(e){r.set(e)},labels:r.labels,debug:r.handleErrors}},typeof define=="function"?define([],function(){return new r}):typeof e.alertify=="undefined"&&(e.alertify=new r)})(this);


/**
 * MagicSuggest
 * http://nicolasbize.github.io/magicsuggest/
 * Copyright (C) 2013 Nicolas Bize; Licensed MIT
 */!(function($){"use strict";var MagicSuggest=function(element,options){var ms=this;var defaults={allowFreeEntries:true,cls:"",data:null,dataUrlParams:{},disabled:false,displayField:"name",editable:true,emptyText:function(){return cfg.editable?"Type or click here":"Click here"},emptyTextCls:"ms-empty-text",expanded:false,expandOnFocus:function(){return cfg.editable?false:true},groupBy:null,hideTrigger:false,highlight:true,id:function(){return"ms-ctn-"+$('div[id^="ms-ctn"]').length},infoMsgCls:"",inputCfg:{},invalidCls:"ms-ctn-invalid",matchCase:false,maxDropHeight:290,maxEntryLength:null,maxEntryRenderer:function(v){return"Please reduce your entry by "+v+" character"+(v>1?"s":"")},maxSuggestions:null,maxSelection:10,maxSelectionRenderer:function(v){return"No puedes escoger más de "+v+" genero"+(v>1?"s":"")},method:"POST",minChars:0,minCharsRenderer:function(v){return"Please type "+v+" more character"+(v>1?"s":"")},name:null,noSuggestionText:"No suggestions",preselectSingleSuggestion:true,renderer:null,required:false,resultAsString:false,selectionCls:"",selectionPosition:"inner",selectionRenderer:null,selectionStacked:false,sortDir:"asc",sortOrder:null,strictSuggest:false,style:"",toggleOnClick:false,typeDelay:400,useTabKey:false,useCommaKey:true,useZebraStyle:true,value:null,valueField:"id",width:function(){return $(this).width()}};var conf=$.extend({},options);var cfg=$.extend(true,{},defaults,conf);if($.isFunction(cfg.emptyText)){cfg.emptyText=cfg.emptyText.call(this)}if($.isFunction(cfg.expandOnFocus)){cfg.expandOnFocus=cfg.expandOnFocus.call(this)}if($.isFunction(cfg.id)){cfg.id=cfg.id.call(this)}this.addToSelection=function(items,isSilent){if(!cfg.maxSelection||_selection.length<cfg.maxSelection){if(!$.isArray(items)){items=[items]}var valuechanged=false;$.each(items,function(index,json){if($.inArray(json[cfg.valueField],ms.getValue())===-1){_selection.push(json);valuechanged=true}});if(valuechanged===true){self._renderSelection();this.empty();if(isSilent!==true){$(this).trigger("selectionchange",[this,this.getSelectedItems()])}}}};this.clear=function(isSilent){this.removeFromSelection(_selection.slice(0))};this.collapse=function(){if(cfg.expanded===true){this.combobox.detach();cfg.expanded=false;$(this).trigger("collapse",[this])}};this.disable=function(){this.container.addClass("ms-ctn-disabled");cfg.disabled=true};this.empty=function(){this.input.removeClass(cfg.emptyTextCls);this.input.val("")};this.enable=function(){this.container.removeClass("ms-ctn-disabled");cfg.disabled=false};this.expand=function(){if(!cfg.expanded&&(this.input.val().length>=cfg.minChars||this.combobox.children().size()>0)){this.combobox.appendTo(this.container);self._processSuggestions();cfg.expanded=true;$(this).trigger("expand",[this])}};this.isDisabled=function(){return cfg.disabled};this.isValid=function(){return cfg.required===false||_selection.length>0};this.getDataUrlParams=function(){return cfg.dataUrlParams};this.getSelectedItems=function(){return _selection};this.getRawValue=function(){return ms.input.val()!==cfg.emptyText?ms.input.val():""};this.getValue=function(){return $.map(_selection,function(o){return o[cfg.valueField]})};this.removeFromSelection=function(items,isSilent){if(!$.isArray(items)){items=[items]}var valuechanged=false;$.each(items,function(index,json){var i=$.inArray(json[cfg.valueField],ms.getValue());if(i>-1){_selection.splice(i,1);valuechanged=true}});if(valuechanged===true){self._renderSelection();if(isSilent!==true){$(this).trigger("selectionchange",[this,this.getSelectedItems()])}if(cfg.expandOnFocus){ms.expand()}if(cfg.expanded){self._processSuggestions()}}};this.setData=function(data){cfg.data=data;self._processSuggestions()};this.setValue=function(data){var values=$.isArray(data)?data:typeof data==="string"&&data.indexOf(",")>-1?data.split(","):[data],items=[];$.each(_cbData,function(index,obj){if($.inArray(obj[cfg.valueField],values)>-1){items.push(obj)}});if(items.length>0){this.addToSelection(items)}};this.setDataUrlParams=function(params){cfg.dataUrlParams=$.extend({},params)};var _selection=[],_comboItemHeight=0,_timer,_hasFocus=false,_groups=null,_cbData=[],_ctrlDown=false;var self={_displaySuggestions:function(data){ms.combobox.empty();var resHeight=0,nbGroups=0;if(_groups===null){self._renderComboItems(data);resHeight=_comboItemHeight*data.length}else{for(var grpName in _groups){nbGroups+=1;$("<div/>",{"class":"ms-res-group",html:grpName}).appendTo(ms.combobox);self._renderComboItems(_groups[grpName].items,true)}resHeight=_comboItemHeight*(data.length+nbGroups)}if(resHeight<ms.combobox.height()||resHeight<=cfg.maxDropHeight){ms.combobox.height(resHeight)}else if(resHeight>=ms.combobox.height()&&resHeight>cfg.maxDropHeight){ms.combobox.height(cfg.maxDropHeight)}if(data.length===1&&cfg.preselectSingleSuggestion===true){ms.combobox.children().filter(":last").addClass("ms-res-item-active")}if(data.length===0&&ms.getRawValue()!==""){self._updateHelper(cfg.noSuggestionText);ms.collapse()}},_getEntriesFromStringArray:function(data){var json=[];$.each(data,function(index,s){var entry={};entry[cfg.displayField]=entry[cfg.valueField]=$.trim(s);json.push(entry)});return json},_highlightSuggestion:function(html){var q=ms.input.val()!==cfg.emptyText?ms.input.val():"";if(q.length===0){return html}if(cfg.matchCase===true){html=html.replace(new RegExp("("+q+")(?!([^<]+)?>)","g"),"<em>$1</em>")}else{html=html.replace(new RegExp("("+q+")(?!([^<]+)?>)","gi"),"<em>$1</em>")}return html},_moveSelectedRow:function(dir){if(!cfg.expanded){ms.expand()}var list,start,active,scrollPos;list=ms.combobox.find(".ms-res-item");if(dir==="down"){start=list.eq(0)}else{start=list.filter(":last")}active=ms.combobox.find(".ms-res-item-active:first");if(active.length>0){if(dir==="down"){start=active.nextAll(".ms-res-item").first();if(start.length===0){start=list.eq(0)}scrollPos=ms.combobox.scrollTop();ms.combobox.scrollTop(0);if(start[0].offsetTop+start.outerHeight()>ms.combobox.height()){ms.combobox.scrollTop(scrollPos+_comboItemHeight)}}else{start=active.prevAll(".ms-res-item").first();if(start.length===0){start=list.filter(":last");ms.combobox.scrollTop(_comboItemHeight*list.length)}if(start[0].offsetTop<ms.combobox.scrollTop()){ms.combobox.scrollTop(ms.combobox.scrollTop()-_comboItemHeight)}}}list.removeClass("ms-res-item-active");start.addClass("ms-res-item-active")},_processSuggestions:function(source){var json=null,data=source||cfg.data;if(data!==null){if(typeof data==="function"){data=data.call(ms)}if(typeof data==="string"&&data.indexOf(",")<0){$(ms).trigger("beforeload",[ms]);var params=$.extend({query:ms.input.val()},cfg.dataUrlParams);$.ajax({type:cfg.method,url:data,data:params,success:function(asyncData){self._processSuggestions(asyncData);$(ms).trigger("load",[ms,json])},error:function(){throw"Could not reach server"}});return}else if(typeof data==="string"&&data.indexOf(",")>-1){_cbData=self._getEntriesFromStringArray(data.split(","))}else{if(data.length>0&&typeof data[0]==="string"){_cbData=self._getEntriesFromStringArray(data)}else{_cbData=data.results||data}}self._displaySuggestions(self._sortAndTrim(_cbData))}},_render:function(el){$(ms).trigger("beforerender",[ms]);var w=$.isFunction(cfg.width)?cfg.width.call(el):cfg.width;ms.container=$("<div/>",{id:cfg.id,"class":"ms-ctn "+cfg.cls+(cfg.disabled===true?" ms-ctn-disabled":"")+(cfg.editable===true?"":" ms-ctn-readonly"),style:"width: "+w+"px;"+cfg.style});ms.container.focus($.proxy(handlers._onFocus,this));ms.container.blur($.proxy(handlers._onBlur,this));ms.container.keydown($.proxy(handlers._onKeyDown,this));ms.container.keyup($.proxy(handlers._onKeyUp,this));ms.input=$("<input/>",$.extend({id:"ms-input-"+$('input[id^="ms-input"]').length,type:"text","class":cfg.emptyTextCls+(cfg.editable===true?"":" ms-input-readonly"),value:cfg.emptyText,readonly:!cfg.editable,disabled:cfg.disabled,style:"width: "+(w-(cfg.hideTrigger?16:42))+"px;"},cfg.inputCfg));ms.input.focus($.proxy(handlers._onInputFocus,this));ms.input.click($.proxy(handlers._onInputClick,this));if(cfg.hideTrigger===false){ms.trigger=$("<div/>",{id:"ms-trigger-"+$('div[id^="ms-trigger"]').length,"class":"ms-trigger",html:'<div class="ms-trigger-ico"></div>'});ms.trigger.click($.proxy(handlers._onTriggerClick,this));ms.container.append(ms.trigger)}ms.combobox=$("<div/>",{id:"ms-res-ctn-"+$('div[id^="ms-res-ctn"]').length,"class":"ms-res-ctn ",style:"width: "+w+"px; height: "+cfg.maxDropHeight+"px;"});ms.combobox.on("click","div.ms-res-item",$.proxy(handlers._onComboItemSelected,this));ms.combobox.on("mouseover","div.ms-res-item",$.proxy(handlers._onComboItemMouseOver,this));ms.selectionContainer=$("<div/>",{id:"ms-sel-ctn-"+$('div[id^="ms-sel-ctn"]').length,"class":"ms-sel-ctn"});ms.selectionContainer.click($.proxy(handlers._onFocus,this));if(cfg.selectionPosition==="inner"){ms.selectionContainer.append(ms.input)}else{ms.container.append(ms.input)}ms.helper=$("<div/>",{"class":"ms-helper "+cfg.infoMsgCls});self._updateHelper();ms.container.append(ms.helper);$(el).replaceWith(ms.container);switch(cfg.selectionPosition){case"bottom":ms.selectionContainer.insertAfter(ms.container);if(cfg.selectionStacked===true){ms.selectionContainer.width(ms.container.width());ms.selectionContainer.addClass("ms-stacked")}break;case"right":ms.selectionContainer.insertAfter(ms.container);ms.container.css("float","left");break;default:ms.container.append(ms.selectionContainer);break}self._processSuggestions();if(cfg.value!==null){ms.setValue(cfg.value);self._renderSelection()}$(ms).trigger("afterrender",[ms]);$("body").click(function(e){if(ms.container.hasClass("ms-ctn-bootstrap-focus")&&ms.container.has(e.target).length===0&&e.target.className.indexOf("ms-res-item")<0&&e.target.className.indexOf("ms-close-btn")<0&&ms.container[0]!==e.target){handlers._onBlur()}});if(cfg.expanded===true){cfg.expanded=false;ms.expand()}},_renderComboItems:function(items,isGrouped){var ref=this,html="";$.each(items,function(index,value){var displayed=cfg.renderer!==null?cfg.renderer.call(ref,value):value[cfg.displayField];var resultItemEl=$("<div/>",{"class":"ms-res-item "+(isGrouped?"ms-res-item-grouped ":"")+(index%2===1&&cfg.useZebraStyle===true?"ms-res-odd":""),html:cfg.highlight===true?self._highlightSuggestion(displayed):displayed,"data-json":JSON.stringify(value)});resultItemEl.click($.proxy(handlers._onComboItemSelected,ref));resultItemEl.mouseover($.proxy(handlers._onComboItemMouseOver,ref));html+=$("<div/>").append(resultItemEl).html()});ms.combobox.html(html);_comboItemHeight=ms.combobox.find(".ms-res-item:first").outerHeight()},_renderSelection:function(){var ref=this,w=0,inputOffset=0,items=[],asText=cfg.resultAsString===true&&!_hasFocus;ms.selectionContainer.find(".ms-sel-item").remove();if(ms._valueContainer!==undefined){ms._valueContainer.remove()}$.each(_selection,function(index,value){var selectedItemEl,delItemEl,selectedItemHtml=cfg.selectionRenderer!==null?cfg.selectionRenderer.call(ref,value):value[cfg.displayField];if(asText===true){selectedItemEl=$("<div/>",{"class":"ms-sel-item ms-sel-text "+cfg.selectionCls,html:selectedItemHtml+(index===_selection.length-1?"":",")}).data("json",value)}else{selectedItemEl=$("<div/>",{"class":"ms-sel-item "+cfg.selectionCls,html:selectedItemHtml}).data("json",value);if(cfg.disabled===false){delItemEl=$("<span/>",{"class":"ms-close-btn"}).data("json",value).appendTo(selectedItemEl);delItemEl.click($.proxy(handlers._onTagTriggerClick,ref))}}items.push(selectedItemEl)});ms.selectionContainer.prepend(items);ms._valueContainer=$("<input/>",{type:"hidden",name:cfg.name,value:JSON.stringify(ms.getValue())});ms._valueContainer.appendTo(ms.selectionContainer);if(cfg.selectionPosition==="inner"){ms.input.width(0);inputOffset=ms.input.offset().left-ms.selectionContainer.offset().left;w=ms.container.width()-inputOffset-(cfg.hideTrigger===true?0:42);ms.input.width(w);ms.container.height(ms.selectionContainer.height())}if(_selection.length===cfg.maxSelection){self._updateHelper(cfg.maxSelectionRenderer.call(this,_selection.length))}else{ms.helper.hide()}},_selectItem:function(item){if(cfg.maxSelection===1){_selection=[]}ms.addToSelection(item.data("json"));item.removeClass("ms-res-item-active");if(cfg.expandOnFocus===false||_selection.length===cfg.maxSelection){ms.collapse()}if(!_hasFocus){ms.input.focus()}else if(_hasFocus&&(cfg.expandOnFocus||_ctrlDown)){self._processSuggestions();if(_ctrlDown){ms.expand()}}},_sortAndTrim:function(data){var q=ms.getRawValue(),filtered=[],newSuggestions=[],selectedValues=ms.getValue();if(q.length>0){$.each(data,function(index,obj){var name=obj[cfg.displayField];if(cfg.matchCase===true&&name.indexOf(q)>-1||cfg.matchCase===false&&name.toLowerCase().indexOf(q.toLowerCase())>-1){if(cfg.strictSuggest===false||name.toLowerCase().indexOf(q.toLowerCase())===0){filtered.push(obj)}}})}else{filtered=data}$.each(filtered,function(index,obj){if($.inArray(obj[cfg.valueField],selectedValues)===-1){newSuggestions.push(obj)}});if(cfg.sortOrder!==null){newSuggestions.sort(function(a,b){if(a[cfg.sortOrder]<b[cfg.sortOrder]){return cfg.sortDir==="asc"?-1:1}if(a[cfg.sortOrder]>b[cfg.sortOrder]){return cfg.sortDir==="asc"?1:-1}return 0})}if(cfg.maxSuggestions&&cfg.maxSuggestions>0){newSuggestions=newSuggestions.slice(0,cfg.maxSuggestions)}if(cfg.groupBy!==null){_groups={};$.each(newSuggestions,function(index,value){if(_groups[value[cfg.groupBy]]===undefined){_groups[value[cfg.groupBy]]={title:value[cfg.groupBy],items:[value]}}else{_groups[value[cfg.groupBy]].items.push(value)}})}return newSuggestions},_updateHelper:function(html){ms.helper.html(html);if(!ms.helper.is(":visible")){ms.helper.fadeIn()}}};var handlers={_onBlur:function(){ms.container.removeClass("ms-ctn-bootstrap-focus");ms.collapse();_hasFocus=false;if(ms.getRawValue()!==""&&cfg.allowFreeEntries===true){var obj={};obj[cfg.displayField]=obj[cfg.valueField]=ms.getRawValue();ms.addToSelection(obj)}self._renderSelection();if(ms.isValid()===false){ms.container.addClass("ms-ctn-invalid")}if(ms.input.val()===""&&_selection.length===0){ms.input.addClass(cfg.emptyTextCls);ms.input.val(cfg.emptyText)}else if(ms.input.val()!==""&&cfg.allowFreeEntries===false){ms.empty();self._updateHelper("")}if(ms.input.is(":focus")){$(ms).trigger("blur",[ms])}},_onComboItemMouseOver:function(e){ms.combobox.children().removeClass("ms-res-item-active");$(e.currentTarget).addClass("ms-res-item-active")},_onComboItemSelected:function(e){self._selectItem($(e.currentTarget))},_onFocus:function(){ms.input.focus()},_onInputClick:function(){if(ms.isDisabled()===false&&_hasFocus){if(cfg.toggleOnClick===true){if(cfg.expanded){ms.collapse()}else{ms.expand()}}}},_onInputFocus:function(){if(ms.isDisabled()===false&&!_hasFocus){_hasFocus=true;ms.container.addClass("ms-ctn-bootstrap-focus");ms.container.removeClass(cfg.invalidCls);if(ms.input.val()===cfg.emptyText){ms.empty()}var curLength=ms.getRawValue().length;if(cfg.expandOnFocus===true){ms.expand()}if(_selection.length===cfg.maxSelection){self._updateHelper(cfg.maxSelectionRenderer.call(this,_selection.length))}else if(curLength<cfg.minChars){self._updateHelper(cfg.minCharsRenderer.call(this,cfg.minChars-curLength))}self._renderSelection();$(ms).trigger("focus",[ms])}},_onKeyDown:function(e){var active=ms.combobox.find(".ms-res-item-active:first"),freeInput=ms.input.val()!==cfg.emptyText?ms.input.val():"";$(ms).trigger("keydown",[ms,e]);if(e.keyCode===9&&(cfg.useTabKey===false||cfg.useTabKey===true&&active.length===0&&ms.input.val().length===0)){handlers._onBlur();return}switch(e.keyCode){case 8:if(freeInput.length===0&&ms.getSelectedItems().length>0&&cfg.selectionPosition==="inner"){_selection.pop();self._renderSelection();$(ms).trigger("selectionchange",[ms,ms.getSelectedItems()]);ms.input.focus();e.preventDefault()}break;case 9:case 188:case 13:e.preventDefault();break;case 17:_ctrlDown=true;break;case 40:e.preventDefault();self._moveSelectedRow("down");break;case 38:e.preventDefault();self._moveSelectedRow("up");break;default:if(_selection.length===cfg.maxSelection){e.preventDefault()}break}},_onKeyUp:function(e){var freeInput=ms.getRawValue(),inputValid=$.trim(ms.input.val()).length>0&&ms.input.val()!==cfg.emptyText&&(!cfg.maxEntryLength||$.trim(ms.input.val()).length<=cfg.maxEntryLength),selected,obj={};$(ms).trigger("keyup",[ms,e]);clearTimeout(_timer);if(e.keyCode===27&&cfg.expanded){ms.combobox.height(0)}if(e.keyCode===9&&cfg.useTabKey===false||e.keyCode>13&&e.keyCode<32){if(e.keyCode===17){_ctrlDown=false}return}switch(e.keyCode){case 40:case 38:e.preventDefault();break;case 13:case 9:case 188:if(e.keyCode!==188||cfg.useCommaKey===true){e.preventDefault();if(cfg.expanded===true){selected=ms.combobox.find(".ms-res-item-active:first");if(selected.length>0){self._selectItem(selected);return}}if(inputValid===true&&cfg.allowFreeEntries===true){obj[cfg.displayField]=obj[cfg.valueField]=freeInput;ms.addToSelection(obj);ms.collapse();ms.input.focus()}break}default:if(_selection.length===cfg.maxSelection){self._updateHelper(cfg.maxSelectionRenderer.call(this,_selection.length))}else{if(freeInput.length<cfg.minChars){self._updateHelper(cfg.minCharsRenderer.call(this,cfg.minChars-freeInput.length));if(cfg.expanded===true){ms.collapse()}}else if(cfg.maxEntryLength&&freeInput.length>cfg.maxEntryLength){self._updateHelper(cfg.maxEntryRenderer.call(this,freeInput.length-cfg.maxEntryLength));if(cfg.expanded===true){ms.collapse()}}else{ms.helper.hide();if(cfg.minChars<=freeInput.length){_timer=setTimeout(function(){if(cfg.expanded===true){self._processSuggestions()}else{ms.expand()}},cfg.typeDelay)}}}break}},_onTagTriggerClick:function(e){ms.removeFromSelection($(e.currentTarget).data("json"))},_onTriggerClick:function(){if(ms.isDisabled()===false&&!(cfg.expandOnFocus===true&&_selection.length===cfg.maxSelection)){$(ms).trigger("triggerclick",[ms]);if(cfg.expanded===true){ms.collapse()}else{var curLength=ms.getRawValue().length;if(curLength>=cfg.minChars){ms.input.focus();ms.expand()}else{self._updateHelper(cfg.minCharsRenderer.call(this,cfg.minChars-curLength))}}}}};if(element!==null){self._render(element)}};$.fn.magicSuggest=function(options){var obj=$(this);if(obj.size()===1&&obj.data("magicSuggest")){return obj.data("magicSuggest")}obj.each(function(i){var cntr=$(this);if(cntr.data("magicSuggest")){return}if(this.nodeName.toLowerCase()==="select"){options.data=[];options.value=[];$.each(this.children,function(index,child){if(child.nodeName&&child.nodeName.toLowerCase()==="option"){options.data.push({id:child.value,name:child.text});if(child.selected){options.value.push(child.value)}}})}var def={};$.each(this.attributes,function(i,att){def[att.name]=att.value});var field=new MagicSuggest(this,$.extend(options,def));cntr.data("magicSuggest",field)});if(obj.size()===1){return obj.data("magicSuggest")}return obj}})(jQuery);




/**
 * Función que se ejecutara cuando el documento este
 * listo para usarse. 
 */
function inicio(){

    var titulo = $('title').html();
    if($('#sidebar').length) sidebarFijo(); // Para el Sidebar
    //$("#al-left-1").html(secondsToTime($("#al-left-1").html()));
    $("#id_biografia").prop("maxlength", "175");

    gustosToTags();

    /* CLICK LISTENERS */
    $("#borrar-lista").on('click', eliminarLista);
    $("#btn_foto_cancion").on('click', function(){$("#id_foto_cancion").click();})
    $("#enviar-bienvenida").on('click', enviarFormBienvenido);
    $("#to-cancion").on('click', function(){$("#id_cancion").click();});
    $("#to-foto").on('click', function(){$("#id_file").click();});
    $("#topAutores").on('click', goTopAutores);
    $("#topCanciones").on('click', goTopCanciones);
    $("#ver-amigos").on('click', mostrarAmigos);
    $("#ver-fans").on('click', mostrarFans);
    $("#volver-privado").on('click', volverPrivados);
    $('#cancelar-lista').on('click', cancelarEditarLista);
    $('#cargar-mas-canciones').on('click', cargarMasCanciones);
    $('#editar-lista').on('click', editarLista);
    $('#enviar-privado, .notificacion-privados').on('click', cargarMensajes);
    $('#etiquetas').on('click', '.welcome-tag', seleccionarEtiqueta);
    $('#nuevo-privado').on('click', nuevoPrivado);
    $('#popup-privados .modal-body').on('click', '.mensaje-privado', verMensaje);
    $('#toEnviados').on('click', toEnviados);
    $('#toRecibidos').on('click', toRecibidos);
    $('#usuarios-existentes').on('click', 'a', seleccionarDestinatario);
    $('#contenedor-bienvenido .btn').on('click', agregarUsuarioBienvenido);
    $(".botones-cancion").on('click', '.btn_comentarios', comentariosCancion);
    $(".elegir-lista").on('click', mostrarListas);
    $(".estrella").on('click', clickEstrellas);
    $(".mg").on('click', meGustaCancion);
    $(".publicar-comentario").on('click', publicarComentario);
    $('.compartir-cancion').on('click', compartirCancion);
    $('.editar-cancion').on('click', editarCancion);
    $('.eliminar-cancion').on('click', eliminarCancionLista);
    $('.eliminar-comentario').on('click', eliminarComentario);
    $('.enlace').on('click', simularLink)

    /* SUBMIT LISTENERS */
    $("#formulario-datos-cancion").on('submit', addInfoCancion);
    $('#formulario-editarPerfil').on('submit', editarPerfil);
    $("#form-new-privado, #form-contestar-privado").on('submit', enviarNuevoMensaje);
    $('.listas-tooltip').on('submit', '.crear-nueva-lista', nuevaLista);

    /* OTHER LISTENERS */
    $(".estrella").on('mouseover', efectoEstrellas);
    $("#subir-foto").on('change', subirImagen);
    $("#formulario").on('change', subirCancion);
    $("#id_foto_cancion").on('change', addFotoCancion);
    $("#buscador-header .search-query").on('keyup', buscadorHeader);
    $("#form-new-privado #destinatario-mensaje").on('keyup', buscadorUsuarios);
    $("#buscador-header").on('mouseleave', buscadorHeaderOff)
    $("#buscador-header .search-query").on('mouseenter', buscadorHeaderShow)
    $(".eliminar-amigo").on('mouseover', onEliminarAmigo);
    $(".eliminar-amigo").on('mouseleave', offEliminarAmigo);



    $("#form-contestar-privado textarea, #form-new-privado textarea").on('keyup', {num:220}, contarCaracteres); 
    $("#formulario-editarPerfil textarea").on('keyup', {num:175}, contarCaracteres); 
}

/**
 * Función para enviar los datos del formulario de Editar Perfil.
 */
function editarPerfil(e){
	e.preventDefault();
	var formData = new FormData($('#formulario-editarPerfil')[0]);
    $.ajax({
        url: '/editar-perfil/', 
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(msg) {
            if($.trim(msg) == '-1'){
                alertify.error("El fondo tiene que pesar menos de 600KB y ser en formato PNG o JPG");
            }else if($.trim(msg) == '1'){
                window.location.reload();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
			alertify.error(xhr.status + " - " + thrownError);
	    }           
    });
}


/**
 * Función para contar los caracteres de los text areas.
 */
function contarCaracteres(event){
	var form = $(this).parent();
	len = this.value.length;
	form.find('.charsleft').show();
	if(len >= event.data.num){
		this.value = this.value.substring(0, event.data.num);
		form.find('.charsleft').text("0");
	}else{
		form.find('.charsleft').text(event.data.num - len);
	}
}


function goTopAutores(){
	$('#ranking-canciones').fadeOut(function(){
		$('#ranking-autores').fadeIn();
		$("#topAutores").hide();
		$("#topCanciones").show();
	});
}

function goTopCanciones(){
	$('#ranking-autores').fadeOut(function(){
		$('#ranking-canciones').fadeIn();
		$("#topAutores").show();
		$("#topCanciones").hide();
	});
}


function eliminarComentario(){
	var id_comentario = $(this).data("id");
	var este = $(this);
	var csrftoken = getCookie('csrftoken');
    $.ajax({
        type: 'POST',
        url: '/borrar-comentario/' + id_comentario + '/',
        data: '1',
        contentType: false,
        processData: false,
        crossDomain: false, 
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type)) xhr.setRequestHeader("X-CSRFToken", csrftoken);
        },
        success: function(data) {
            if($.trim(data) == '-1'){
            	alertify.error("No se ha podido borrar el comentario.");
            }else if($.trim(data) == '1'){
               	este.parent().parent().fadeOut('slow');
            }else{
				alertify.error("Error desconocido.");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
			alertify.error(xhr.status + " - " + thrownError);
	    }
    });
}


/**
 * Función para borrar una canción de una lista de reproducción tuya.
 */
function eliminarLista(e){
	var id_lista = $(this).data("id");
	e.preventDefault();
	$("#celimcan").modal();

	$("#celimcan .btn-primary").on('click', function(){
		var csrftoken = getCookie('csrftoken');
	    $.ajax({
	        url: '/borrar-lista/' + id_lista + '/',
	        type: 'POST',
	        data: '1',
	        cache: false,
	        contentType: false,
	        processData: false,
	        beforeSend: function(xhr, settings) {
	            if (!csrfSafeMethod(settings.type)) xhr.setRequestHeader("X-CSRFToken", csrftoken);
	        },
	        success: function(msg) {
	            if($.trim(msg) == '-1'){
	                alertify.error("Error, no se ha podido enviar. Vuelve a intentarlo.");
	            }else if($.trim(msg) == '1'){
                	alertify.success("Lista eliminada con éxito.");
                	setTimeout(function(){
                		window.location = "/listas-reproduccion/"
                	}, 1000);
	            }else if($.trim(msg) == '-2'){
	            	alertify.error("Solo puedes borrar una lista que sea tuya.");
	            }
	        },
	        error: function (xhr, ajaxOptions, thrownError) {
				alertify.error(xhr.status + " - " + thrownError);
		    }           
	    });
	});

	$("#celimcan .cancelar").on('click', function(){
		$("#celimcan").hide();
	});
	
}

/**
 * Función que actua parecido al hover sobre el boton de eliminar
 */
function offEliminarAmigo(){
    $(this).removeClass("btn-danger");
    $(this).addClass("btn-primary");
    $(this).html('<i class="icon-user"></i> Amigo');
}

/**
 * Función que actua parecido al hover sobre el boton de eliminar
 */
function onEliminarAmigo(){
    $(this).removeClass("btn-primary");
    $(this).addClass("btn-danger");
    $(this).html('<i class="icon-ban-circle"></i> Eliminar');
}

/**
 * Función para fijar el sidebar siempre en una posición.
 */
function sidebarFijo(){
    var eTop = $('#sidebar').offset().top;
    $(window).scroll(function() {
        if(eTop  - $(window).scrollTop() <= 90){
            $("#sidebar").addClass("fijado");
        }else{
            $("#sidebar").removeClass("fijado");  
        } 
    });
}


/**
 * Función para enviar los gustos de la página de Bievenida a la BD, y 
 * si se ha enviado correctamente redirigir a la siguiente página de sugerir amigos.
 */
function enviarFormBienvenido(){
    var formData = new FormData($('#form-bienvenida')[0]);
    $.ajax({
        url: '/bienvenido/', 
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(msg) {
            if($.trim(msg) == '-1'){
                alertify.error("Error, no se ha podido enviar. Vuelve a intentarlo.");
            }else{
                if($.trim(msg) == '1'){
                    window.location = "/sugerir-amigos/"
                }else{
                    alertify.error("Error desconocido, contacta con nosotros para solucionarlo. ");
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
			alertify.error(xhr.status + " - " + thrownError);
	    }           
    });
}


/**
 * Función para la página de "bienvenido", al hacer click en una etiqueta
 * comrpueba que no lleve 10 o mas seleccionadas ya que es el limite para
 * el buen funcionamiento de la aplicacion, cuantos menos gustos mas especificos
 * serán tus recomendaciones.
 */
function seleccionarEtiqueta(e){
    if($("#etiquetas .selected").length < 5){
        if($(this).hasClass("selected")){
            $(this).removeClass("selected");
            contador_tags++;
        }else{
            $(this).addClass("selected");
            contador_tags--;
        }
    }else{
    	if($(this).hasClass("selected")){
            $(this).removeClass("selected");
            contador_tags++;
        }
    }
    $("#gustos-restantes").html(contador_tags);
    var gustos = '';
    var total = $('.selected.welcome-tag').length; 
    $(".selected.welcome-tag").each(function(index){
        if(index == total - 1){
            gustos += $(this).text();
        }else{
            gustos += $(this).text() + ',';
        }
    })
    $("#gustos_array").val(gustos);
}


/**
 * Función para mostrar el mensaje en el que el usuario haya hecho click.
 */
function verMensaje(e){
    e.preventDefault();
    var conversacion = $(this).data('conversacion');
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        type: 'POST',
        url: '/ver-conversacion/'+conversacion+'/',
        data: '1',
        contentType: false,
        processData: false,
        crossDomain: false, 
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function(data) {
            if($.trim(data) == '-1'){
                alertify.error("No se pueden cargar tus mensajes.");
            }else{
                $('#popup-privados .single-mensaje .c-single').html(data);
                $('#destinatario-contestar-mensaje').val(conversacion);
                $('#popup-privados .c-mensajes').fadeOut('slow', function(){
                    $('#popup-privados .single-mensaje').fadeIn(function(){
                        $("#nuevo-privado").hide();
                        $("#volver-privado").show();
                    });
                });
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
			alertify.error(xhr.status + " - " + thrownError);
	    }
    });
}

/**
 * Función para enviar un nuevo mensaje privado.
 */
 function enviarNuevoMensaje(e){
    e.preventDefault()
    var form = $(this)[0];
    var fd = new FormData($(this).get(0));
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        type: 'POST',
        url: '/enviar-nuevo-mensajes/',
        data: fd,
        contentType: false,
        processData: false,
        crossDomain: false, 
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function(data) {
            if($.trim(data) == '-1'){
                alertify.error("No se ha podido enviar el mensaje.");
            }else if($.trim(data) == '1'){
                alertify.success("Enviado con éxito");
                form.reset();
                volverPrivados();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
			alertify.error(xhr.status + " - " + thrownError);
	    }
    });
    return false;
 }


/**
 * Función que prepara la interfaz para enviar un nuevo mensaje privado.
 */
function nuevoPrivado(){
    $('#popup-privados .c-mensajes').fadeOut('slow', function(){
        $('#popup-privados .c-nuevo-mensaje').fadeIn(function(){
            $("#nuevo-privado").hide();
            $("#volver-privado").show();
            $("#toRecibidos, #toEnviados").hide();
        });
    });
}

/**
 * Función para cuando estas en el pop-up de nuevo mensaje privado, poder
 * volver atrás, a la lista de los mensajes privados.
 */
function volverPrivados(){
    toRecibidos();
    $("#popup-privados .single-mensaje").hide();
    $('#popup-privados .c-nuevo-mensaje').fadeOut('slow', function(){
        $('#popup-privados .c-mensajes').fadeIn(function(){
            $("#volver-privado").hide();
            $("#nuevo-privado").show();
        }); 
    });
}


/**
 * Función que hace una consulta AjAX a la BD para coger los mensajes
 * privados del usuario, y una vez los tiene los carga en el pop-up
 */
function cargarMensajes(){
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        type: 'POST',
        url: '/cargar-mensajes/',
        data: '1',
        contentType: false,
        processData: false,
        crossDomain: false, 
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function(data) {
            if($.trim(data) == '-1'){
                alertify.error("No se pueden cargar tus mensajes. ");
            }else{
                $('#popup-privados .c-mensajes').html(data);
                $('#form-contestar-privado .charsleft').text('220');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
			alertify.error(xhr.status + " - " + thrownError);
	    }
    });
}

/**
 * Función para que al ahcer click en "Añadir a lista", cargue tus listas
 * en un tooltip. Y cuando hagas click en una de ellas te añada la canción
 * a la lista de reproducción.
 */
 function mostrarListas(e){
    e.preventDefault();
    var lista_click_id = $(this).data('id')
    var csrftoken = getCookie('csrftoken');
    $('.listas-tooltip').hide();

    if(!$('.listas-tooltip[data-id="' + lista_click_id +'"]').hasClass('opened')){
    	$('.listas-tooltip[data-id="' + lista_click_id +'"]').addClass('opened');
    	$('.listas-tooltip[data-id="' + lista_click_id +'"]').show();
    }else{
    	$('.listas-tooltip').removeClass('opened');
    }

    $('.listas-tooltip').html("<img src='/static/img/ajax-loader.gif'>");
    $.ajax({
        type: 'POST',
        url: '/cargar-listas/',
        data: '1',
        contentType: false,
        processData: false,
        crossDomain: false, 
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function(data) {
            if($.trim(data) == '-1'){
                alertify.error("No se pueden cargar tus listas.");
            }else{
                $('.listas-tooltip[data-id="' + lista_click_id +'"]').html(data);
                $('.listas-tooltip tr').on('click', function(){
                    agregarCancionLista(lista_click_id, $(this).data('lista'));
                });
            }
        }
    });
 }

/**
 * Función para crear una nueva lista en AJAX
 */
function nuevaLista(e){
    e.preventDefault();
    var este = $(this);
    // Seleccionamos el ID de la cancion
    var id_cancion = $(this).parent().parent(".listas-tooltip").data('id');
    var nombre = este.find(".nombre-lista").val();
    var fd = new FormData($(".crear-nueva-lista").get(0));
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        type: 'POST',
        url: '/crear-lista/',
        data: fd,
        contentType: false,
        processData: false,
        crossDomain: false, 
        beforeSend: function(xhr, settings) {
            if(!csrfSafeMethod(settings.type)) xhr.setRequestHeader("X-CSRFToken", csrftoken);
        },
        success: function(data) {
            if($.trim(data) == '-1'){
                alertify.error("No se ha podido crear tu lista");
            }else if($.trim(data) == '-4'){
                alertify.error("Ya tienes una lista con este nombre");
            }else if($.trim(data) == '-5'){
                alertify.error("Puedes tener 10 listas como máximo.");
            }else if($.trim(data) == '-3'){
                alertify.error("Tienes que elegir un nombre");
            }else if(data.codigo == 1){
                este.find(".nombre-lista").val("");
                alertify.success("Se ha creado una nueva lista.");
                agregarCancionLista(id_cancion, data.id);
                $('.contenedor-listas .table tbody').append('<tr data-lista="'+data.id+'"><td>'+data.nombre+'</td></tr>');

                // Refrescamos el listener porque se han añadido nuevas listas
                $('.listas-tooltip tr').on('click', function(){
                    agregarCancionLista(id_cancion, $(this).data('lista'));
                });
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
			alertify.error(xhr.status + " - " + thrownError);
	    }
    });
}

function agregarCancionLista(cancion, lista){
    $('.formulario-prueba[data="'+cancion+'"]')
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        type: 'POST',
        url: '/cancion'+cancion+'/lista'+lista+'/',
        data: '1',
        contentType: false,
        processData: false,
        crossDomain: false, 
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function(data) {
            if($.trim(data) == '-1'){
                alertify.error("No se ha podido agregar, intentalo más tarde.");
                $(".listas-tooltip").hide();
                $('.listas-tooltip').removeClass('opened');
            }else if($.trim(data) == '-2'){
                alertify.error("Ya tienes esta canción en la lista.");
                $(".listas-tooltip").hide();
                $('.listas-tooltip').removeClass('opened');
            }else if($.trim(data) == '1'){
            	alertify.success("Canción agregada a tu lista.");
            	$(".listas-tooltip").hide();
            	$('.listas-tooltip').removeClass('opened');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
			alertify.error(xhr.status + " - " + thrownError);
	    }
    });
}



/**
 * Función que convierte los gustos que hay en los spans ".gustosToTags"
 * en tags para que se les pueda dar formato y un link.
 */
function gustosToTags(){
    $(".gustosToTags").each(function(){
        lista = $(".gustosToTags").html().split(',');
        var contenido = '';
        for(var i=0; i<lista.length; i++){
            contenido = contenido + '<a class="tag" href="http://disoner.com/descubre/'+lista[i]+'">'+lista[i]+'</a> ';
        }
        $(this).html(contenido);
    });
}


/**
 * Función para subir una imagen vía AJAX
 */
function subirImagen(){
	alertify.set({ delay: 3500 });
	alertify.log("Subiendo imagen... ");
	var formData = new FormData($('#subir-foto')[0]);
    $.ajax({
        url: '/cambiar-foto/',  //server script to process data
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(msg) {
        	if($.trim(msg) == '-1'){
        		alertify.error("Error, no se ha podido subir la imagen");
        	}else{
                if($.trim(msg) == '-2'){
                    alertify.error("La foto ha de ser PNG o JPG y pesar menos de 500KB.");
                }else{
            		alertify.success("Imagen subida con éxito");
    				$("#profile-picture").prop('src', msg)
                }
        	}
        	
        },
        error: function (xhr, ajaxOptions, thrownError) {
			alertify.error(xhr.status + " - " + thrownError);
	    }			
    });
}



/**
 * Función para subir una cancion vía AJAX
 */
function subirCancion(){
	alertify.set({ delay: 1500 });
	alertify.log("Subiendo canción... ");
	$("#ajax-spinner").show();
	var formData = new FormData($('#formulario')[0]);
    $.ajax({
        url: '/add-cancion/',  //server script to process data
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(msg2) {
        	if($.trim(msg2) == '-1' || $.trim(msg2) == '-2' || $.trim(msg2) == '-3'){
        		$("#ajax-spinner").hide();
        		alertify.error("No se ha podido subir la canción, código de error: " + msg2);
        	}else if($.trim(msg2) == '-4'){
                $("#ajax-spinner").hide();
                alertify.error("No tienes suficiente espacio");
            }else{
        		$("#cancion-editar").val(msg2); // Ponermos el ID de la cancion a editar
        		alertify.success("Canción subida con éxito");
        		$("#ajax-spinner").hide();
	        	$("#to-cancion").hide();
                $(".modal-footer").show();
	        	$("#formulario").hide();
	        	$("#formulario-datos-cancion").show();
        	}
        },
        error: function (xhr, ajaxOptions, thrownError) {
			alertify.error(xhr.status + " - " + thrownError);
	    }	
    });
}



/**
 * Función para añadir al información de las canciones vía AJAX
 */
function addInfoCancion(e){
	e.preventDefault();
	alertify.set({ delay: 2000 });
	var formData = new FormData($('#formulario-datos-cancion')[0]);
    $.ajax({
        type: 'POST',
        url: '/add-info/',
        data: formData,
        contentType: false,
        processData: false,
        success: function(msg3) {
        	if($.trim(msg3) == '-4' || $.trim(msg3) == '-5' || $.trim(msg3) == '-6'){
        		alertify.error("No se ha podido actualizar la información, código de error: " + msg3);
        	}else if($.trim(msg3) == '-7'){
				alertify.error("El título y el género son obligatorios.");
        	}else if($.trim(msg3) == '1'){
        		alertify.success("Información añadida con éxito");
        		$("#maag-overlay").click();
        		$('#formulario-datos-cancion')[0].reset();
        		window.location.reload();
        	}else{
        		alertify.error("Error desconocido");
        	}
        },
        error: function (xhr, ajaxOptions, thrownError) {
			alertify.error(xhr.status + " - " + thrownError);
	    }
    });
}



/**
 * Función que llama a una vista de Django para cargar los
 * amigos con AJAX.
 */
function mostrarAmigos(e){
 	e.preventDefault();
 	var csrftoken = getCookie('csrftoken');
    var id_perfil = $("#id-perfil").val()
    $.ajax({
        type: 'POST',
        url: '/amigos/'+id_perfil+'/',
        data: '',
        contentType: false,
        processData: false,
        crossDomain: false, 
        beforeSend: function(xhr, settings) {
	        if (!csrfSafeMethod(settings.type)) {
	            xhr.setRequestHeader("X-CSRFToken", csrftoken);
	        }
	    },
        success: function(data) {
        	if($.trim(data) == '-1'){
        		alertify.error("Ha habido un error.");
        	}else{
        		$("#lightbox").html(data);
        	}
        },
        error: function (xhr, ajaxOptions, thrownError) {
			alertify.error(xhr.status + " - " + thrownError);
	    }
    });
}


function mostrarFans(e){
    e.preventDefault();
    var csrftoken = getCookie('csrftoken');
    var id_perfil = $("#id-perfil").val()
    $.ajax({
        type: 'POST',
        url: '/fans/'+id_perfil+'/',
        data: '',
        contentType: false,
        processData: false,
        crossDomain: false, 
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function(data) {
            if($.trim(data) == '-1'){
                alertify.error("Ha habido un error.");
            }else{
                $("#lightbox").html(data);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
			alertify.error(xhr.status + " - " + thrownError);
	    }
    });
}


/**
 * Función para marcar todas las estrellas que seleccione el usuario.
 * Si selecciona la 8 estrella se marcaran todas menos las 2 ultimas.
 */
function efectoEstrellas(){
    $(".estrella").removeClass('estrella-hover');
    var puntoHover = $(this).data("puntos");
    for(i=0; i<puntoHover; i++){
        $(".estrella[data-puntos='" + (i+1) + "']").addClass('estrella-hover');
    }
}



/**
 * Enviar la puntuación al hacer click en las estrellas.
 */
 function clickEstrellas(e){
    e.preventDefault();
    var puntos = $(this).data("puntos")
    var perfil = $("#id-perfil").val();
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        type: 'POST',
        url: '/votar/' + perfil + '/' + puntos + '/',
        data: '',
        contentType: false,
        processData: false,
        crossDomain: false, 
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function(data) {
            if($.trim(data) == '-1' || $.trim(data) == '-2'){
                alertify.error("No has podido votar, código de error: " + data);
            }else if($.trim(data) == '-3'){
                alertify.error("Ya has votado este perfil");
            }else if($.trim(data) == '1'){
                alertify.success("Gracias por votar!");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
			alertify.error(xhr.status + " - " + thrownError);
	    }
    });
 }



/**
 * Función que llama a una vista de Django para cargar los
 * amigos con AJAX.
 */
function addFotoCancion(e){
    e.preventDefault();
    var formData = new FormData($('#formulario-datos-cancion')[0]);
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        type: 'POST',
        url: '/add-foto-cancion/',
        data: formData,
        contentType: false,
        processData: false,
        crossDomain: false, 
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function(data) {
            if($.trim(data) == '-1'){
                alertify.error("No se ha podido subir la foto.");
            }else if($.trim(data) == '-7'){
            	alertify.error("La imagen tiene que pesar menos de 500KB y ser en formato JPG o PNG");
            }else{
                $("#foto-cancion").prop("src", "http://disoner.com/static/fotos_canciones/" + data);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
			alertify.error(xhr.status + " - " + thrownError);
	    }
    });
}



/**
 * Función para que al hacer click en "Like", envie este like a la BD
 */
function meGustaCancion(e){
    e.preventDefault();
    var id_cancion = $(this).data("id");
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        type: 'POST',
        url: '/me-gusta/'+id_cancion+'/',
        data: '1',
        contentType: false,
        processData: false,
        crossDomain: false, 
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function(data) {
            if($.trim(data) == '-1'){
                alertify.error("Ha habido un error, lo sentimos.");
            }else{
                if($.trim(data) == '1'){
                    $("#likes-"+id_cancion).parent().addClass("active");
                    $("#likes-"+id_cancion).html(parseInt($("#likes-"+id_cancion).html()) + 1);
                }
                if($.trim(data) == '2'){
                    $("#likes-"+id_cancion).parent().removeClass("active");
                    $("#likes-"+id_cancion).html(parseInt($("#likes-"+id_cancion).html()) - 1);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
			alertify.error(xhr.status + " - " + thrownError);
	    }
    });
}



/**
 * Función para mostrar todos los comentarios de la canción 
 * que hayas hecho click.
 */
function comentariosCancion(e){
    e.preventDefault();
    var id_cancion = $(this).data("id");
    $(".comentarios[data-cancion='" + id_cancion +"']").toggle();
}



/**
 * Función para enviar el comentario de la canción a la BD.
 */
function publicarComentario(e){
    e.preventDefault();
    var id_cancion = $(this).data("id");
    var formData = new FormData($(".form-publicar-comentario[data-id='" + id_cancion +"']")[0]);
    var csrftoken = getCookie('csrftoken');
    alertify.log("Publicando mensaje...");
    $.ajax({
        type: 'POST',
        url: '/publicar-comentario/',
        data: formData,
        contentType: false,
        processData: false,
        crossDomain: false, 
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function(data) {
            if($.trim(data) == '-1'){
                alertify.error("No se ha podido guardar el comentario.");
            }else{
                $(".form-publicar-comentario[data-id='" + id_cancion +"']")[0].reset();
                $(".form-publicar-comentario[data-id='" + id_cancion +"']").before('\
                <div class="media">\
			     	<a href="http://disoner.com/perfil/' + data.slug +'/" class="pull-left">\
			        	<img src="http://disoner.com/static/fotos_perfil/'+data.foto+'" style="width: 64px; height: 64px;" class="media-object">\
			      	</a>\
			    	<div class="media-body">\
			        	<a href="http://disoner.com/perfil/' + data.slug +'/">'+data.nombre+':</a> '+data.comentario+'\
			        		<div data-id="'+data.id_comentario+'" class="eliminar-comentario">×</div>\
			    	</div>\
			    </div>');
			    $('.eliminar-comentario').on('click', eliminarComentario);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
			alertify.error(xhr.status + " - " + thrownError);
	    }
    });
    return false;
}


/**
 * Función para pasar de segundos a horas, minutos y segundos, en un formato
 * más presentable "hh:mm".
 */
function secondsToTime(secs){
    var hours = Math.floor(secs / (60 * 60));
    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);
    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);
   
    var obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
    };
    if(obj.m < 10) return obj.h + ":0" + obj.m;
    else return obj.h + ":" + obj.m;
}


/**
 * Función que se lanza cuando el usuario hace click sobre editar una de sus
 * canciones, se abre un lightbox con la canción y sus datos.
 */
function editarCancion(){
    var cancion_editar = $(this).data("id");
    $("#cancion-editar").val(cancion_editar);
    $("#popup-subir-cancion #formulario").hide();
    $("#formulario-datos-cancion, #popup-subir-cancion .modal-footer").show();
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        type: 'POST',
        url: '/editar-cancion/'+cancion_editar+'/',
        data: '1',
        contentType: false,
        processData: false,
        crossDomain: false, 
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function(data) {
            if($.trim(data) == '-1'){
                alertify.error("Ha habido un error, lo sentimos.");
            }else{
                $("#titulo-cancion").val(data.nombre);
                $("#genero-cancion").val(data.genero);
                $("#foto-cancion").prop("src", "http://disoner.com/static/fotos_canciones/" + data.foto);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
			alertify.error(xhr.status + " - " + thrownError);
	    }
    });
}


/**
 * Función que imita el comportamiento de un link en una columna
 * de una tabla, entre otros casos se usa en el Ranking.
 */
function simularLink(){
    window.location = $(this).data('href');
    return false;
}


/**
 * Función que sirve para editar las listas de reproducción. Muestra los
 * campos del formulario que antes estaban ocultos.
 */
function editarLista(){
    $(".lista").addClass('editando');
    $(".lista > h2").hide();
    $("#editar-lista").hide();
    $('#nombre-lista').show();
    $("#guardar-lista").show();
    $("#cancelar-lista").show();
}

/**
 * Función que vuelve todo a su estado original en el apartado de las 
 * listas.
 */
function cancelarEditarLista(){
    $(".lista").removeClass('editando');
    $(".lista > h2").show();
    $("#editar-lista").show();
    $('#nombre-lista').hide();
    $("#guardar-lista").hide();
    $("#cancelar-lista").hide();
}

/**
 * Función que da la impresión que borra una canción de una lista de
 * reproducción, en realidad la oculta y guarda su ID en un input
 * hidden, que si le damos a guardar se enviará junto con el formulario.
 */
function eliminarCancionLista(e){
    e.preventDefault();
    var array_canciones = $("#eliminar-canciones").val();
    $("#eliminar-canciones").val(array_canciones + $(this).data("id") + ",")
    $(this).parent().fadeOut();
}

/**
 * Función para compartir una cancion, coge el ID de la cancion del
 * "data-id" que hay en el boton, y hace una peticion AJAX a la URL
 * "compartir-cancion" añadiendo el ID.
 */
function compartirCancion(){
    var cancion_compartir = $(this).data("id");
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        type: 'POST',
        url: '/compartir-cancion/'+cancion_compartir+'/',
        data: '1',
        contentType: false,
        processData: false,
        crossDomain: false, 
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function(data) {
            if($.trim(data) == '-1'){
                alertify.error("No se ha podido compartir");
            }else if($.trim(data) == '-3'){
                alertify.error("No puedes compartir una canción tuya.");
            }else if($.trim(data) == '-4'){
                alertify.error("Ya has compartido esta canción.");
            }else if($.trim(data) == '1'){
                alertify.success("Has compartido la canción.");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
			alertify.error(xhr.status + " - " + thrownError);
	    }
    });
}

/**
 * Función para el buscador del header, cada vez que se escribe
 * alguna letra se hace una llamada al servidor con AJAX para
 * buscar si hay coincidencias, los resultados se añaden con jQuery
 * al div de resultados.
 */
function buscadorHeader(){
    $("#buscador-resultados").show();
    var formData = new FormData($("#formulario-busqueda")[0]);
    $.ajax({
        type: 'POST',
        url: '/buscar/',
        data: formData,
        contentType: false,
        processData: false,
        crossDomain: false, 
        success: function(data) {
            if($.trim(data) != '-1' && $.trim(data) != '-2'){
                $("#buscador-resultados").html(data);
            }
        }
    });
}


/**
 * Función para el buscador que hay en enviar nuevo mensaje que
 * te muestran todos los usuarios que existen para poderselo enviar.
 */
function buscadorUsuarios(){
    $("#buscador-resultados").show();
    if($("#destinatario-mensaje").val() != ''){
    	var formData = new FormData($("#form-new-privado")[0]);
	    $.ajax({
	        type: 'POST',
	        url: '/buscar-usuarios/',
	        data: formData,
	        contentType: false,
	        processData: false,
	        crossDomain: false, 
	        success: function(data) {
	            if($.trim(data) != '-1' && $.trim(data) != '-2'){
	                $("#usuarios-existentes").html(data);
	                $("#usuarios-existentes").show();
	            }
	        }
	    });
    }else{
    	$("#usuarios-existentes").hide();
    }
    
}

/**
 * Función para cuando se abre la lista desplegable de las sugerencias, haces
 * click en alguna, esta funcion se encarga de seleccionarla.
 */
function seleccionarDestinatario(){
	var destinatario = $(this).data("id");
	$("#destinatario-mensaje-id").val(destinatario);
	$("#destinatario-mensaje").val($(this).find('span').html());
	$("#usuarios-existentes").hide();
}

/**
 * Para que cuando hagamos click en otro sitio que no sea el buscador
 * desaparezca. Usamos el listener "focus"
 */
function buscadorHeaderOff(){
    $("#buscador-resultados").hide();
}

/**
 * Para que cuando volvamos ha hacer click en el campo de buscar, 
 * vuelvan a aparecer los resultados
 */
function buscadorHeaderShow(){
    $("#buscador-resultados").show();
}

/**
 * Función para cargar via AJAX más canciones.
 */
function cargarMasCanciones(e){
    e.preventDefault();
    var now = $(this).data("now");
    var next = $(this).data("next");
    var perfil = $("#id-perfil").val();
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        type: 'POST',
        url: '/cargar-canciones/'+perfil+'/'+now+'/'+next + '/',
        data: '1',
        contentType: false,
        processData: false,
        crossDomain: false, 
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function(data) {
            if($.trim(data) == '-1'){
                alertify.error("Ha habido un error.");
            }else{
                now += 7;
                next += 7;
                $("#cargar-mas-canciones").data("next", next);
                $("#cargar-mas-canciones").data("now", now);
                console.log($("#cargar-mas-canciones").data("now") + " ----> " + $("#cargar-mas-canciones").data("next"))
                contenido = $('ul.playlist').html();
                $('ul.playlist').html(contenido + '' + data.html);
                if(data.max < now) $("#cargar-mas-canciones").hide()

                // Refrescamos los listeners de los nuevos botones
			    $('.compartir-cancion').on('click', compartirCancion);
			    $('.editar-cancion').on('click', editarCancion);
			    $('.eliminar-cancion').on('click', eliminarCancionLista);
			    $('.eliminar-comentario').on('click', eliminarComentario);
            	$(".botones-cancion").on('click', '.btn_comentarios', comentariosCancion);
            	$(".elegir-lista").on('click', mostrarListas);
            	$(".mg").on('click', meGustaCancion);
            	$(".publicar-comentario").on('click', publicarComentario);
            	$('.enlace').on('click', simularLink)
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
			alertify.error(xhr.status + " - " + thrownError);
	    }
    });
}


/**
 * Función de los mensajes privados para ir de los recibidos a los
 * mensajes enviados.
 */
function toEnviados(){
	$("#mensajes-recibidos").fadeOut(function(){
		$("#mensajes-enviados").fadeIn();
		$("#toRecibidos").show();
		$("#toEnviados").hide();
	});
}


/**
 * Función de los mensajes privados para ir de los enviados a los
 * mensajes recibidos.
 */
function toRecibidos(){
	$("#mensajes-enviados").fadeOut(function(){
		$("#mensajes-recibidos").fadeIn();
		$("#toEnviados").show();
		$("#toRecibidos").hide();
	});
}


function agregarUsuarioBienvenido(e){
	e.preventDefault();
	este = $(this);
	var csrftoken = getCookie('csrftoken');
    $.ajax({
        type: 'POST',
        url: este.prop('href') + '/',
        data: '1',
        contentType: false,
        processData: false,
        crossDomain: false, 
        beforeSend: function(xhr, settings) {
            if(!csrfSafeMethod(settings.type)) xhr.setRequestHeader("X-CSRFToken", csrftoken);
        },
        success: function(data) {
        	este.parent().fadeOut();
        },
        error: function (xhr, ajaxOptions, thrownError) {
			alertify.error(xhr.status + " - " + thrownError);
	    }
    });
}