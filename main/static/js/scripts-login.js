
/**
 * Cuando se haya cargado el documento y este listo,
 * ejecutara la función "inicio".
 */
$(document).on('ready', inicio);



/*! Backstretch - v2.0.3 - 2012-11-30
* http://srobbin.com/jquery-plugins/backstretch/
* Copyright (c) 2012 Scott Robbin; Licensed MIT */
!function(e,t,n){"use strict";e.fn.backstretch=function(r,s){return(r===n||r.length===0)&&e.error("No images were supplied for Backstretch"),e(t).scrollTop()===0&&t.scrollTo(0,0),this.each(function(){var t=e(this),n=t.data("backstretch");n&&(s=e.extend(n.options,s),n.destroy(!0)),n=new i(this,r,s),t.data("backstretch",n)})},e.backstretch=function(t,n){return e("body").backstretch(t,n).data("backstretch")},e.expr[":"].backstretch=function(t){return e(t).data("backstretch")!==n},e.fn.backstretch.defaults={centeredX:!0,centeredY:!0,duration:5e3,fade:0};var r={wrap:{left:0,top:0,overflow:"hidden",margin:0,padding:0,height:"100%",width:"100%",zIndex:-999999},img:{position:"absolute",display:"none",margin:0,padding:0,border:"none",width:"auto",height:"auto",maxWidth:"none",zIndex:-999999}},i=function(n,i,o){this.options=e.extend({},e.fn.backstretch.defaults,o||{}),this.images=e.isArray(i)?i:[i],e.each(this.images,function(){e("<img />")[0].src=this}),this.isBody=n===document.body,this.$container=e(n),this.$wrap=e('<div class="backstretch"></div>').css(r.wrap).appendTo(this.$container),this.$root=this.isBody?s?e(t):e(document):this.$container;if(!this.isBody){var u=this.$container.css("position"),a=this.$container.css("zIndex");this.$container.css({position:u==="static"?"relative":u,zIndex:a==="auto"?0:a,background:"none"}),this.$wrap.css({zIndex:-999998})}this.$wrap.css({position:this.isBody&&s?"fixed":"absolute"}),this.index=0,this.show(this.index),e(t).on("resize.backstretch",e.proxy(this.resize,this)).on("orientationchange.backstretch",e.proxy(function(){this.isBody&&t.pageYOffset===0&&(t.scrollTo(0,1),this.resize())},this))};i.prototype={resize:function(){try{var e={left:0,top:0},n=this.isBody?this.$root.width():this.$root.innerWidth(),r=n,i=this.isBody?t.innerHeight?t.innerHeight:this.$root.height():this.$root.innerHeight(),s=r/this.$img.data("ratio"),o;s>=i?(o=(s-i)/2,this.options.centeredY&&(e.top="-"+o+"px")):(s=i,r=s*this.$img.data("ratio"),o=(r-n)/2,this.options.centeredX&&(e.left="-"+o+"px")),this.$wrap.css({width:n,height:i}).find("img:not(.deleteable)").css({width:r,height:s}).css(e)}catch(u){}return this},show:function(t){if(Math.abs(t)>this.images.length-1)return;this.index=t;var n=this,i=n.$wrap.find("img").addClass("deleteable"),s=e.Event("backstretch.show",{relatedTarget:n.$container[0]});return clearInterval(n.interval),n.$img=e("<img />").css(r.img).bind("load",function(t){var r=this.width||e(t.target).width(),o=this.height||e(t.target).height();e(this).data("ratio",r/o),e(this).fadeIn(n.options.speed||n.options.fade,function(){i.remove(),n.paused||n.cycle(),n.$container.trigger(s,n)}),n.resize()}).appendTo(n.$wrap),n.$img.attr("src",n.images[t]),n},next:function(){return this.show(this.index<this.images.length-1?this.index+1:0)},prev:function(){return this.show(this.index===0?this.images.length-1:this.index-1)},pause:function(){return this.paused=!0,this},resume:function(){return this.paused=!1,this.next(),this},cycle:function(){return this.images.length>1&&(clearInterval(this.interval),this.interval=setInterval(e.proxy(function(){this.paused||this.next()},this),this.options.duration)),this},destroy:function(n){e(t).off("resize.backstretch orientationchange.backstretch"),clearInterval(this.interval),n||this.$wrap.remove(),this.$container.removeData("backstretch")}};var s=function(){var e=navigator.userAgent,n=navigator.platform,r=e.match(/AppleWebKit\/([0-9]+)/),i=!!r&&r[1],s=e.match(/Fennec\/([0-9]+)/),o=!!s&&s[1],u=e.match(/Opera Mobi\/([0-9]+)/),a=!!u&&u[1],f=e.match(/MSIE ([0-9]+)/),l=!!f&&f[1];return!((n.indexOf("iPhone")>-1||n.indexOf("iPad")>-1||n.indexOf("iPod")>-1)&&i&&i<534||t.operamini&&{}.toString.call(t.operamini)==="[object OperaMini]"||u&&a<7458||e.indexOf("Android")>-1&&i&&i<533||o&&o<6||"palmGetResource"in t&&i&&i<534||e.indexOf("MeeGo")>-1&&e.indexOf("NokiaBrowser/8.5.0")>-1||l&&l<=6)}()}(jQuery,window);


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
 */
!(function(e,t){"use strict";var n=e.document,r;r=function(){var r={},i={},s=!1,o={ENTER:13,ESC:27,SPACE:32},u=[],a,f,l,c,h,p,d,v,m,g,y,b;return i={buttons:{holder:'<nav class="alertify-buttons">{{buttons}}</nav>',submit:'<button type="submit" class="alertify-button alertify-button-ok" id="alertify-ok">{{ok}}</button>',ok:'<a href="#" class="alertify-button alertify-button-ok" id="alertify-ok">{{ok}}</a>',cancel:'<a href="#" class="alertify-button alertify-button-cancel" id="alertify-cancel">{{cancel}}</a>'},input:'<div class="alertify-text-wrapper"><input type="text" class="alertify-text" id="alertify-text"></div>',message:'<p class="alertify-message">{{message}}</p>',log:'<article class="alertify-log{{class}}">{{message}}</article>'},b=function(){var e,r=n.createElement("fakeelement"),i={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"otransitionend",transition:"transitionend"};for(e in i)if(r.style[e]!==t)return i[e]},a=function(e){return n.getElementById(e)},r={labels:{ok:"OK",cancel:"Cancel"},delay:5e3,buttonReverse:!1,buttonFocus:"ok",transition:t,addListeners:function(e){var t=typeof l!="undefined",r=typeof f!="undefined",i=typeof y!="undefined",s="",u=this,a,h,p,d,v;a=function(t){return typeof t.preventDefault!="undefined"&&t.preventDefault(),p(t),typeof y!="undefined"&&(s=y.value),typeof e=="function"&&(typeof y!="undefined"?e(!0,s):e(!0)),!1},h=function(t){return typeof t.preventDefault!="undefined"&&t.preventDefault(),p(t),typeof e=="function"&&e(!1),!1},p=function(e){u.hide(),u.unbind(n.body,"keyup",d),u.unbind(c,"focus",v),i&&u.unbind(g,"submit",a),t&&u.unbind(l,"click",a),r&&u.unbind(f,"click",h)},d=function(e){var t=e.keyCode;t===o.SPACE&&!i&&a(e),t===o.ESC&&r&&h(e)},v=function(e){i?y.focus():r?f.focus():l.focus()},this.bind(c,"focus",v),t&&this.bind(l,"click",a),r&&this.bind(f,"click",h),this.bind(n.body,"keyup",d),i&&this.bind(g,"submit",a),typeof this.transition=="undefined"&&this.setFocus()},bind:function(e,t,n){typeof e.addEventListener=="function"?e.addEventListener(t,n,!1):e.attachEvent&&e.attachEvent("on"+t,n)},handleErrors:function(){if(typeof e.onerror!="undefined"){var t=this;return e.onerror=function(e,n,r){t.error("["+e+" on line "+r+" of "+n+"]",0)},!0}return!1},appendButtons:function(e,t){return this.buttonReverse?t+e:e+t},build:function(e){var t="",n=e.type,s=e.message,o=e.cssClass||"";t+='<div class="alertify-dialog">',r.buttonFocus==="none"&&(t+='<a href="#" id="alertify-noneFocus" class="alertify-hidden"></a>'),n==="prompt"&&(t+='<form id="alertify-form">'),t+='<article class="alertify-inner">',t+=i.message.replace("{{message}}",s),n==="prompt"&&(t+=i.input),t+=i.buttons.holder,t+="</article>",n==="prompt"&&(t+="</form>"),t+='<a id="alertify-resetFocus" class="alertify-resetFocus" href="#">Reset Focus</a>',t+="</div>";switch(n){case"confirm":t=t.replace("{{buttons}}",this.appendButtons(i.buttons.cancel,i.buttons.ok)),t=t.replace("{{ok}}",this.labels.ok).replace("{{cancel}}",this.labels.cancel);break;case"prompt":t=t.replace("{{buttons}}",this.appendButtons(i.buttons.cancel,i.buttons.submit)),t=t.replace("{{ok}}",this.labels.ok).replace("{{cancel}}",this.labels.cancel);break;case"alert":t=t.replace("{{buttons}}",i.buttons.ok),t=t.replace("{{ok}}",this.labels.ok);break;default:}return v.className="alertify alertify-show alertify-"+n+" "+o,d.className="alertify-cover",t},close:function(e,t){var n=t&&!isNaN(t)?+t:this.delay,r=this,i,s;this.bind(e,"click",function(){i(e)}),s=function(e){e.stopPropagation(),r.unbind(this,r.transition,s),m.removeChild(this),m.hasChildNodes()||(m.className+=" alertify-logs-hidden")},i=function(e){typeof e!="undefined"&&e.parentNode===m&&(typeof r.transition!="undefined"?(r.bind(e,r.transition,s),e.className+=" alertify-log-hide"):(m.removeChild(e),m.hasChildNodes()||(m.className+=" alertify-logs-hidden")))};if(t===0)return;setTimeout(function(){i(e)},n)},dialog:function(e,t,r,i,o){p=n.activeElement;var a=function(){if(v&&v.scrollTop!==null)return;a()};if(typeof e!="string")throw new Error("message must be a string");if(typeof t!="string")throw new Error("type must be a string");if(typeof r!="undefined"&&typeof r!="function")throw new Error("fn must be a function");return typeof this.init=="function"&&(this.init(),a()),u.push({type:t,message:e,callback:r,placeholder:i,cssClass:o}),s||this.setup(),this},extend:function(e){if(typeof e!="string")throw new Error("extend method must have exactly one paramter");return function(t,n){return this.log(t,e,n),this}},hide:function(){var e,t=this;u.splice(0,1),u.length>0?this.setup():(s=!1,e=function(n){n.stopPropagation(),v.className+=" alertify-isHidden",t.unbind(v,t.transition,e)},typeof this.transition!="undefined"?(this.bind(v,this.transition,e),v.className="alertify alertify-hide alertify-hidden"):v.className="alertify alertify-hide alertify-hidden alertify-isHidden",d.className="alertify-cover alertify-cover-hidden",p.focus())},init:function(){n.createElement("nav"),n.createElement("article"),n.createElement("section"),d=n.createElement("div"),d.setAttribute("id","alertify-cover"),d.className="alertify-cover alertify-cover-hidden",n.body.appendChild(d),v=n.createElement("section"),v.setAttribute("id","alertify"),v.className="alertify alertify-hidden",n.body.appendChild(v),m=n.createElement("section"),m.setAttribute("id","alertify-logs"),m.className="alertify-logs alertify-logs-hidden",n.body.appendChild(m),n.body.setAttribute("tabindex","0"),this.transition=b(),delete this.init},log:function(e,t,n){var r=function(){if(m&&m.scrollTop!==null)return;r()};return typeof this.init=="function"&&(this.init(),r()),m.className="alertify-logs",this.notify(e,t,n),this},notify:function(e,t,r){var i=n.createElement("article");i.className="alertify-log"+(typeof t=="string"&&t!==""?" alertify-log-"+t:""),i.innerHTML=e,m.insertBefore(i,m.firstChild),setTimeout(function(){i.className=i.className+" alertify-log-show"},50),this.close(i,r)},set:function(e){var t;if(typeof e!="object"&&e instanceof Array)throw new Error("args must be an object");for(t in e)e.hasOwnProperty(t)&&(this[t]=e[t])},setFocus:function(){y?(y.focus(),y.select()):h.focus()},setup:function(){var e=u[0],n=this,i;s=!0,i=function(e){e.stopPropagation(),n.setFocus(),n.unbind(v,n.transition,i)},typeof this.transition!="undefined"&&this.bind(v,this.transition,i),v.innerHTML=this.build(e),c=a("alertify-resetFocus"),l=a("alertify-ok")||t,f=a("alertify-cancel")||t,h=r.buttonFocus==="cancel"?f:r.buttonFocus==="none"?a("alertify-noneFocus"):l,y=a("alertify-text")||t,g=a("alertify-form")||t,typeof e.placeholder=="string"&&e.placeholder!==""&&(y.value=e.placeholder),this.addListeners(e.callback)},unbind:function(e,t,n){typeof e.removeEventListener=="function"?e.removeEventListener(t,n,!1):e.detachEvent&&e.detachEvent("on"+t,n)}},{alert:function(e,t,n){return r.dialog(e,"alert",t,"",n),this},confirm:function(e,t,n){return r.dialog(e,"confirm",t,"",n),this},extend:r.extend,init:r.init,log:function(e,t,n){return r.log(e,t,n),this},prompt:function(e,t,n,i){return r.dialog(e,"prompt",t,n,i),this},success:function(e,t){return r.log(e,"success",t),this},error:function(e,t){return r.log(e,"error",t),this},set:function(e){r.set(e)},labels:r.labels,debug:r.handleErrors}},typeof define=="function"?define([],function(){return new r}):typeof e.alertify=="undefined"&&(e.alertify=new r)})(this);




/**
 * Función que se ejecutara cuando el documento este
 * listo para usarse. 
 */
function inicio(){

	var ancho = $(this).width();
	if(ancho < 600){
		$("body.showBG").css("background", "#222")
	}else{
		$("body.showBG").backstretch([  
    	"../static/img/fondo5.jpg",
    	"../static/img/fondo4.jpg",
    	"../static/img/fondo2.jpg", 
    	"../static/img/fondo3.jpg",
    	"../static/img/fondo6.jpg"
    	], {duration: 1000, fade: 2000});
	}


    $("#btn_registrar").on('click', goRegistrar);
    $("#btn_login").on('click', goLogin);
    $("#recuperar-password").on('click', goRecuperarPass);
    
    $("#formulario-registro").on('submit', enviarFormRegistro);
    $("#formulario-login").on('submit', enviarFormLogin);
    $("#formulario-recuperar").on('submit', enviarFormRecuperar);
    $("#formulario-recuperar-cambiar").on('submit', enviarFormCambiar);
}




/**
 * Función que oculta el login y muestra el formulario 
 * de registrar con un efecto "fade".
 */
function goRegistrar(){
	$("#resultados").html("");
	$("#formulario-login").fadeOut("slow", function(){
		$("#formulario-registro").fadeIn();
		$("#formulario-recuperar").hide();
		$("#btn_registrar").hide();
		$("#btn_login").show();
	});
}


/**
 * Función que oculta el formulario de login y muestra el
 * formulario para recupeara la password.
 */
function goRecuperarPass(){
	$("#resultados").html("");
	$("#formulario-login").fadeOut("slow", function(){
		$("#formulario-recuperar").fadeIn();
		$("#btn_registrar").hide();
		$("#btn_login").show();
	});
}


/**
 * Función que oculta el formulario de registro y muestra
 * el formulario de login con un ejecto "fade".
 */
function goLogin(){
	$("#formulario-registro").fadeOut("slow", function(){
		$("#formulario-login").fadeIn();
		$("#formulario-recuperar").fadeOut();
		$("#btn_login").hide();
		$("#btn_registrar").show();
	});
}



function enviando(){
	$("#resultados").html("<img src='/static/img/ajax-loader.gif' />")
	$("#resultados").show();
	$("#submit-registro").hide();
}

function enviado(){
	$("#resultados").html("")
	$("#submit-registro").show();
	$("#resultados").hide();
}


/**
 * Función que envia los datos del formulario via AJAX y
 * muestra el resultado o errores. FormData es una clase 
 * de HTML5 que sirve para coger la info de un formulario
 */
function enviarFormRegistro(e){
	e.preventDefault();
	var fd = new FormData($("#formulario-registro").get(0));
	enviando();
	$.ajax({
		url: '/add_user_ajax/',
		data: fd,
		type: 'POST',
		success: function(data){
			/*enviado();
			if($.trim(data) == "1"){
				alertify.success("Registro completado con éxito");
				$("#formulario-registro").get(0).reset();
				setTimeout(function(){
				    goLogin();
				},800);
			}else{
				alertify.set({ delay: 4000 });
				if($.trim(data) == "-1"){
					alertify.error("Rellena todos los campos.");
				}
				if($.trim(data) == "-2"){
					alertify.error("El email ya está en uso.");
				}
				if($.trim(data) == "-3"){
					alertify.error("Las contraseñas no coinciden.");
				}
				if($.trim(data) == "-4"){
					alertify.error("La <strong>contraseña</strong> tiene que ser entre 8 y 12 carácteres");
				}
				if($.trim(data) == "-5"){
					alertify.error("Asegurate de que todos los campos estan rellenados correctamente.");
				}
				if($.trim(data) == "-6"){
					alertify.error("El email no existe.");
				}
			}*/
			enviado();
			alertify.error("Registro inhabilitado. Entra con el usuario 'demo@disoner.com' y contraseña 'demo' ");
		},
		error: function (xhr, ajaxOptions, thrownError) {
			alertify.error(xhr.status + " - " + thrownError);
			setTimeout(function(){
			   alertify.success("Es posible que se haya creado la cuenta. Pero no ha podido enviar el email de confirmación.");
			   setTimeout(function(){
				   window.location = "/login/";
				},2000)
			},1000)
	    },
		processData: false,
		contentType: false
	});
}



/**
 * Función que envia los datos del formulario via AJAX y
 * muestra el resultado o errores. FormData es una clase 
 * de HTML5 que sirve para coger la info de un formulario
 */
function enviarFormLogin(e){
	e.preventDefault();
	var fd = new FormData($("#formulario-login").get(0));
	$.ajax({
		url: '/auth/',
		data: fd,
		type: 'POST',
		success: function(data){
			
			if($.trim(data) == "-1"){
				alertify.set({delay: 3000});
				alertify.error("Usuario o contraseña incorrectos");
			}

			if($.trim(data) == "1"){
				window.location = "/";
			}
		}, 
		error: function (xhr, ajaxOptions, thrownError) {
			alertify.error(xhr.status);
	        alertify.error(thrownError);
	    },
		processData: false,
		contentType: false
	});
}


function enviarFormRecuperar(e){
	e.preventDefault();
	var fd = new FormData($("#formulario-recuperar").get(0));
	$.ajax({
		url: '/recuperar-password/',
		data: fd,
		type: 'POST',
		success: function(data){
			
			if($.trim(data) == "-1"){
				alertify.set({delay: 3000});
				alertify.error("Ha habido un error, si persiste ponte en contacto con nosotros. ");
			}

			if($.trim(data) == "1"){
				alertify.success("Se te ha enviado un email con los pasos a seguir para recuperar tu contraseña. ");
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
			alertify.error(xhr.status + " - " + thrownError);
	    },
		processData: false,
		contentType: false
	});
}

function enviarFormCambiar(e){
	e.preventDefault();
	var fd = new FormData($("#formulario-recuperar-cambiar").get(0));
	var codigo = $("#codigo-recuperar").val()
	$.ajax({
		url: '/recuperar-password/' + codigo,
		data: fd,
		type: 'POST',
		success: function(data){
			
			if($.trim(data) == "1"){
				alertify.set({delay: 3000});
				alertify.success("Todo correcto.");
				setTimeout(function(){
				   window.location = "/";
				},800);
			}else if($.trim(data) == "-1"){
				alertify.error("El email esta vacío. ");
			}else if($.trim(data) == "-2"){
				alertify.error("Los datos no son correctos, contacta con nosotros si tienes problemas. ");
			}else if($.trim(data) == "-3"){
				alertify.error("La contraseña tiene que ser entre 8 y 12 carácteres. ");
			}else if($.trim(data) == "-4"){
				alertify.error("Las contraseñas no coinciden. ");
			}else if($.trim(data) == "-5"){
				alertify.error("Ha caducado, envia el email solo tiene una validez de 24h. ");
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
			alertify.error(xhr.status + " - " + thrownError);
	    },
		processData: false,
		contentType: false
	});
}