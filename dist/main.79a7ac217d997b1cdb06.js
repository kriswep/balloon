!function(t){function e(o){if(n[o])return n[o].exports;var i=n[o]={i:o,l:!1,exports:{}};return t[o].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var n={};e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,o){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:o})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=8)}([function(t,e,n){"use strict";var o=n(10),i=n(11),r=n(9),a={WIDTH:320,HEIGHT:480,scale:1,offset:{top:0,left:0},paused:1,score:0,highsore:0,highscoreBroken:0,mode:3,life:2,lastPos:-1,lastScore:-1,message:[],objects:[],createObjectTime:0,tex:new Image,texSrc:"./img/sprite.png",back:new Image,backSrc:"./img/back.png",showFps:0,fps:0,lastFrame:0,touching:0,touchHit:0,touchStart:0,touchX:0,touchY:0,zoomHelper:{level:1,NORMAL:1,FAR:.5,CLOSE:2},scrollPosition:{x:0,y:0},tile:null,grid:{width:15,height:10},RATIO:null,currentWidth:null,currentHeight:null,canvas:null,ctx:null,keys:{UP:38,DOWN:40,LEFT:37,RIGHT:39,W:87,A:65,S:83,D:68,Z:90,X:88,R:82},init:function(t){a.RATIO=a.WIDTH/a.HEIGHT,a.currentWidth=a.WIDTH,a.currentHeight=a.HEIGHT,a.canvas=document.getElementsByTagName("canvas")[0],a.canvas.width=a.WIDTH,a.canvas.height=a.HEIGHT,a.ctx=a.canvas.getContext("2d"),t(a.canvas,function(){a.tex.src=a.texSrc,a.back.src=a.backSrc,a.resize(),a.loop()})},resize:function(){a.currentHeight=window.innerHeight,a.currentWidth=a.currentHeight*a.RATIO,a.canvas.style.width=a.currentWidth+"px",a.canvas.style.height=a.currentHeight+"px",a.scale=a.currentWidth/a.WIDTH,a.offset.top=a.canvas.offsetTop,a.offset.left=a.canvas.offsetLeft,window.setTimeout(function(){window.scrollTo(0,1)},1)},translatePixels:function(t,e){return this.x=(t-a.offset.left)/a.scale,this.y=(e-a.offset.top)/a.scale,{x:this.x,y:this.y}},handleTouch:function(t,e){var n=a.translatePixels(t,e),o=(new Date).getTime(),r=0;if(a.touchX=n.x,a.touchY=n.y,o-a.touchStart>300&&a.handleTouchEnd(),a.touching&&(a.objects=a.objects.reduce(function(t,e){var o=Object.assign({},e);if(o.isInside(n.x,n.y))if(a.hit+=1,r=o.score*a.hit,a.score+=r,o.remove=!0,a.hit>1){var s=new i.a("+"+Math.round(r/100)+"(x"+a.hit+")",n.x,n.y,"#118811",a);t.push(s)}else{var c=new i.a("+"+Math.round(r/100),n.x,n.y,"#118811",a);t.push(c)}return t.push(o),t},[]),!a.highscoreBroken&&Math.round(a.score/100)>a.highsore)){var s=new i.a("Neuer Highscore!",a.touchX,a.touchY-25,"#118811",a);a.objects.push(s),a.highscoreBroken=1}},handleTouchEnd:function(){if(a.touching&&!a.paused){if(!a.hit&&a.score-1e3>0){a.score-=1e3;var t=new i.a("-10",a.touchX,a.touchY,"#881111",a);a.objects.push(t),a.highscoreBroken&&Math.round(a.score/100)<a.highsore&&(t=new i.a("Highscore verloren!",a.touchX,a.touchY-25,"#881111",a),a.objects.push(t),a.highscoreBroken=0)}a.hit=0,a.touchStart=0,a.touching=0}},startGame:function(){a.message=[],a.createObjectTime=0,a.objects=[],a.score=0,a.life=2*a.mode,a.paused=0,a.highsore=localStorage.getItem(1)},endGame:function(){a.paused=1,document.querySelector(".startGame").textContent="Spiel starten",document.querySelector(".inGameOption").style.display="none",document.querySelector(".ui").classList.remove("gameRunning"),document.querySelector(".ui").style.display="",document.querySelector(".openMenu").style.display="none",a.setScore()},setScore:function(){a.lastPos=-1,a.lastScore=Math.round(a.score/100);for(var t=[],e=[],n=!1,o=0;o<10;o+=1)t[o]=localStorage.getItem(o+1);for(var i=0;i<11;i+=1)n?e[i]=t[i-1]:a.lastScore>t[i]||"null"===t[i]?(e[i]=a.lastScore,n=!0,a.lastPos=i):e[i]=t[i];for(var r=0;r<10;r+=1)localStorage.setItem(r+1,e[r])},update:function(){a.life<=0&&a.endGame(),a.generateBalloon(),a.objects.forEach(function(t){t.update()}),a.objects=a.objects.filter(function(t){return!t.remove})},render:function(){a.ctx.clearRect(0,0,a.canvas.width,a.canvas.height),a.ctx.fillStyle="#2222dd",a.ctx.fillRect(0,0,a.canvas.width,a.canvas.height),a.ctx.drawImage(a.back,0,0);for(var t=0;t<a.objects.length;t+=1)a.objects[t].draw(a.ctx);a.Draw.text("Punkte: "+Math.round(a.score/100),5,25,24,"#333"),a.Draw.text("Leben: "+a.life,5,50,24,"#333"),a.showFps&&a.Draw.text(Math.round(a.fps),5,440,24,"#333")},loop:function(){if(n.i(r.a)(a.loop),a.paused||(a.update(),a.render()),a.showFps){a.lastFrame||(a.lastFrame=(new Date).getTime(),a.fps=0);var t=(new Date).getTime(),e=(t-a.lastFrame)/1e3;a.lastFrame=t,a.fps=1/e}},generateBalloon:function(){var t=(new Date).getTime();if(a.createObjectTime<=t){a.createObjectTime=t+Math.floor(2e3*Math.random())+500;var e=new o.a(Math.floor(8*Math.random()),Math.floor(256*Math.random()),500,Math.floor(3*Math.random())+1,a);a.objects.push(e)}},decreaseLife:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;a.life-=t}};a.Draw={clear:function(){a.ctx.clearRect(0,0,a.WIDTH,a.HEIGHT)},rect:function(t,e,n,o,i){a.ctx.fillStyle=i,a.ctx.fillRect(t,e,n,o)},circle:function(t,e,n,o){a.ctx.fillStyle=o,a.ctx.beginPath(),a.ctx.arc(t+5,e+5,n,0,2*Math.PI,!0),a.ctx.closePath(),a.ctx.fill()},text:function(t,e,n,o,i){a.ctx.font="bold "+o+"px Monospace",a.ctx.fillStyle=i,a.ctx.fillText(t,e,n)}},e.a=a},function(t,e){function n(t,e){var n=t[1]||"",i=t[3];if(!i)return n;if(e){var r=o(i),a=i.sources.map(function(t){return"/*# sourceURL="+i.sourceRoot+t+" */"});return[n].concat(a).concat([r]).join("\n")}return[n].join("\n")}function o(t){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+new Buffer(JSON.stringify(t)).toString("base64")+" */"}t.exports=function(t){var e=[];return e.toString=function(){return this.map(function(e){var o=n(e,t);return e[2]?"@media "+e[2]+"{"+o+"}":o}).join("")},e.i=function(t,n){"string"==typeof t&&(t=[[null,t,""]]);for(var o={},i=0;i<this.length;i++){var r=this[i][0];"number"==typeof r&&(o[r]=!0)}for(i=0;i<t.length;i++){var a=t[i];"number"==typeof a[0]&&o[a[0]]||(n&&!a[2]?a[2]=n:n&&(a[2]="("+a[2]+") and ("+n+")"),e.push(a))}},e}},function(t,e,n){function o(t,e){for(var n=0;n<t.length;n++){var o=t[n],i=p[o.id];if(i){i.refs++;for(var r=0;r<i.parts.length;r++)i.parts[r](o.parts[r]);for(;r<o.parts.length;r++)i.parts.push(l(o.parts[r],e))}else{for(var a=[],r=0;r<o.parts.length;r++)a.push(l(o.parts[r],e));p[o.id]={id:o.id,refs:1,parts:a}}}}function i(t){for(var e=[],n={},o=0;o<t.length;o++){var i=t[o],r=i[0],a=i[1],s=i[2],c=i[3],u={css:a,media:s,sourceMap:c};n[r]?n[r].parts.push(u):e.push(n[r]={id:r,parts:[u]})}return e}function r(t,e){var n=v(t.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var o=y[y.length-1];if("top"===t.insertAt)o?o.nextSibling?n.insertBefore(e,o.nextSibling):n.appendChild(e):n.insertBefore(e,n.firstChild),y.push(e);else{if("bottom"!==t.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(e)}}function a(t){t.parentNode.removeChild(t);var e=y.indexOf(t);e>=0&&y.splice(e,1)}function s(t){var e=document.createElement("style");return t.attrs.type="text/css",u(e,t.attrs),r(t,e),e}function c(t){var e=document.createElement("link");return t.attrs.type="text/css",t.attrs.rel="stylesheet",u(e,t.attrs),r(t,e),e}function u(t,e){Object.keys(e).forEach(function(n){t.setAttribute(n,e[n])})}function l(t,e){var n,o,i;if(e.singleton){var r=w++;n=g||(g=s(e)),o=d.bind(null,n,r,!1),i=d.bind(null,n,r,!0)}else t.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=c(e),o=f.bind(null,n,e),i=function(){a(n),n.href&&URL.revokeObjectURL(n.href)}):(n=s(e),o=h.bind(null,n),i=function(){a(n)});return o(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;o(t=e)}else i()}}function d(t,e,n,o){var i=n?"":o.css;if(t.styleSheet)t.styleSheet.cssText=x(e,i);else{var r=document.createTextNode(i),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(r,a[e]):t.appendChild(r)}}function h(t,e){var n=e.css,o=e.media;if(o&&t.setAttribute("media",o),t.styleSheet)t.styleSheet.cssText=n;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n))}}function f(t,e,n){var o=n.css,i=n.sourceMap,r=void 0===e.convertToAbsoluteUrls&&i;(e.convertToAbsoluteUrls||r)&&(o=b(o)),i&&(o+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(i))))+" */");var a=new Blob([o],{type:"text/css"}),s=t.href;t.href=URL.createObjectURL(a),s&&URL.revokeObjectURL(s)}var p={},m=function(t){var e;return function(){return void 0===e&&(e=t.apply(this,arguments)),e}}(function(){return window&&document&&document.all&&!window.atob}),v=function(t){var e={};return function(n){return void 0===e[n]&&(e[n]=t.call(this,n)),e[n]}}(function(t){return document.querySelector(t)}),g=null,w=0,y=[],b=n(14);t.exports=function(t,e){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");e=e||{},e.attrs="object"==typeof e.attrs?e.attrs:{},void 0===e.singleton&&(e.singleton=m()),void 0===e.insertInto&&(e.insertInto="head"),void 0===e.insertAt&&(e.insertAt="bottom");var n=i(t);return o(n,e),function(t){for(var r=[],a=0;a<n.length;a++){var s=n[a],c=p[s.id];c.refs--,r.push(c)}if(t){o(i(t),e)}for(var a=0;a<r.length;a++){var c=r[a];if(0===c.refs){for(var u=0;u<c.parts.length;u++)c.parts[u]();delete p[c.id]}}}};var x=function(){var t=[];return function(e,n){return t[e]=n,t.filter(Boolean).join("\n")}}()},function(t,e,n){"use strict";function o(t,e){this.resources=[],this.resourcesLoaded=0,void 0!==t&&"function"==typeof t&&(this.onPartial=t),void 0!==e&&"function"==typeof e&&(this.onComplete=e)}n.d(e,"b",function(){return i}),e.a=o;var i={IMAGE:0};o.prototype.addResource=function(t,e,n){if(n===i.IMAGE){var o={filePath:t,fileType:e,resourceType:n};this.resources.push(o)}},o.prototype.startPreloading=function(){for(var t=0,e=this.resources.length;t<e;t+=1){var n=new Image;n.addEventListener("load",this.onResourceLoaded.bind(this),!1),n.src=this.resources[t].filePath}},o.prototype.onResourceLoaded=function(){this.resourcesLoaded+=1,void 0!==this.onPartial&&this.onPartial(),this.resourcesLoaded===this.resources.length&&void 0!==this.onComplete&&this.onComplete()},o.prototype.isLoadComplete=function(){return this.resources.length===this.resourcesLoaded}},function(t,e,n){"use strict";function o(t,e,n){t&&e&&n&&e.split(" ").forEach(function(e){return t.addEventListener(e,n,!1)})}var i=n(0),r=function(){o(document.querySelector(".startGame"),"mousedown touchstart",function(t){t.preventDefault(),i.a.setScore(),i.a.startGame(),document.querySelector(".ui").style.display="none",document.querySelector("canvas").style.display="",document.querySelector(".openMenu").style.display="inline"}),o(document.querySelector(".toBaby"),"mousedown touchstart",function(t){t.preventDefault(),document.location.href="baby.html"}),o(document.querySelector(".toKids"),"mousedown touchstart",function(t){t.preventDefault(),document.location.href="index.html"}),o(document.querySelector(".openMenu"),"mousedown touchstart",function(t){t.preventDefault(),i.a.paused=1,i.a.hit||(i.a.hit=1),document.querySelector(".startGame").textContent="Neustart",document.querySelector(".inGameOption").style.display="list-item",document.querySelector(".ui").classList.add("gameRunning"),document.querySelector(".ui").style.display="",document.querySelector(".openMenu").style.display="none"}),o(document.querySelector(".resumeGame"),"mousedown touchstart",function(t){t.preventDefault(),i.a.hit||(i.a.hit=1),document.querySelector(".ui").style.display="none",document.querySelector(".openMenu").style.display="inline",i.a.paused=0})};!function(t){"loading"!==document.readyState?t():document.addEventListener("DOMContentLoaded",t)}(r)},function(t,e){function n(){return"serviceWorker"in navigator&&(window.fetch||"imageRendering"in document.documentElement.style)&&("https:"===window.location.protocol||"localhost"===window.location.hostname)}function o(t){if(t||(t={}),n()){var e=navigator.serviceWorker.register("sw.js"),o=function(t){function e(){switch(a.state){case"redundant":i("onUpdateFailed"),a.onstatechange=null;break;case"installing":o||i("onUpdating");break;case"installed":r||i("onUpdateReady");break;case"activated":i("onUpdated"),a.onstatechange=null}}function n(){switch(a.state){case"redundant":a.onstatechange=null;break;case"installing":case"installed":break;case"activated":i("onInstalled"),a.onstatechange=null}}var o,r,a=t.installing||t.waiting;if(a&&!a.onstatechange){var s;t.active?(e(),s=e):(n(),s=n),o=!0,t.waiting&&(r=!0),a.onstatechange=s}},i=function(e){"function"==typeof t[e]&&t[e]({source:"ServiceWorker"})};return void e.then(function(t){t&&(o(t),t.onupdatefound=function(){o(t)})}).catch(function(t){return i("onError"),Promise.reject(t)})}if(window.applicationCache){var r=function(){var t=document.createElement("iframe");t.src="appcache/manifest.html",t.style.display="none",a=t,document.body.appendChild(t)};return void("complete"===document.readyState?setTimeout(r):window.addEventListener("load",r))}}function i(t,e){if(n())return void navigator.serviceWorker.getRegistration().then(function(n){if(!n||!n.waiting)return void(e&&e());n.waiting.postMessage({action:"skipWaiting"}),t&&t()})}function r(){if(n()&&navigator.serviceWorker.getRegistration().then(function(t){if(t)return t.update()}),a)try{a.contentWindow.applicationCache.update()}catch(t){}}var a;e.install=o,e.applyUpdate=i,e.update=r},function(t,e,n){var o=n(12);"string"==typeof o&&(o=[[t.i,o,""]]);n(2)(o,{});o.locals&&(t.exports=o.locals)},function(t,e,n){var o=n(13);"string"==typeof o&&(o=[[t.i,o,""]]);n(2)(o,{});o.locals&&(t.exports=o.locals)},function(t,e,n){"use strict";function o(t,e){function n(){}var o=new c.a(n,e);o.addResource("./img/sprite.png",null,c.b.IMAGE),o.addResource("./img/back.png",null,c.b.IMAGE),o.startPreloading()}function i(){s.a.handleTouchEnd()}function r(t){s.a.handleTouch(t.pageX,t.pageY)}Object.defineProperty(e,"__esModule",{value:!0});var a=n(5),s=(n.n(a),n(0)),c=n(3),u=(n(4),n(6)),l=(n.n(u),n(7));n.n(l);n.d(e,"updateHandler",function(){return d}),e.default=o;var d={onUpdating:function(){console.log("SW Event:","onUpdating")},onUpdateReady:function(){console.log("SW Event:","onUpdateReady"),a.applyUpdate()},onUpdated:function(){console.log("SW Event:","onUpdated"),window.location.reload()},onUpdateFailed:function(){console.log("SW Event:","onUpdateFailed")}};a.install(d),window.addEventListener("load",s.a.init.bind(null,o)),window.addEventListener("resize",s.a.resize),window.addEventListener("keydown",s.a.handleKeyDown),window.addEventListener("mousedown",function(t){s.a.touching=1,s.a.touchStart=(new Date).getTime(),r(t)}),document.querySelector("canvas").addEventListener("mousemove",function(t){r(t)}),window.addEventListener("mouseup",function(t){i()}),window.addEventListener("touchstart",function(t){t.preventDefault(),s.a.touching=1,s.a.touchStart=(new Date).getTime(),r(t.touches[0])},!1),window.addEventListener("touchmove",function(t){t.preventDefault(),r(t.touches[0])},!1),window.addEventListener("touchend",function(t){t.preventDefault(),i()},!1)},function(t,e,n){"use strict";var o=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){window.setTimeout(t,1e3/60)}}();e.a=o},function(t,e,n){"use strict";function o(t,e,n,o,i){switch(this.balloonNumber=t,this.verticalOffset=0,this.horizontalOffset=0,this.width=64,this.height=64,this.x=e,this.y=n,this.speed=o,this.waveSize=20*Math.random()+4,this.origX=this.x,this.remove=0,this.pauseFrame=0,this.balloonNumber){case 0:this.verticalOffset=0,this.horizontalOffset=0,this.width=64,this.height=64;break;case 1:this.verticalOffset=178,this.horizontalOffset=0,this.width=32,this.height=64;break;case 2:this.verticalOffset=356,this.horizontalOffset=0,this.width=32,this.height=64;break;case 3:this.verticalOffset=534,this.horizontalOffset=0,this.width=32,this.height=64;break;case 4:this.verticalOffset=712,this.horizontalOffset=0,this.width=64,this.height=64;break;case 5:this.verticalOffset=890,this.horizontalOffset=0,this.width=32,this.height=64;break;case 6:this.verticalOffset=1068,this.horizontalOffset=0,this.width=64,this.height=64;break;default:this.verticalOffset=1246,this.horizontalOffset=0,this.width=64,this.height=64}this.lastUpdate=(new Date).getTime(),this.score=3e4*this.speed/this.width,this.slowFps=0,this.draw=function(t){t.drawImage(i.tex,this.horizontalOffset,this.verticalOffset,2*this.width,2*this.height,this.x,this.y,this.width,this.height)},this.update=function(){if(!i.paused){var t=(new Date).getTime();t-this.lastUpdate<90?(this.y-=(t-this.lastUpdate)*o/10,this.x=this.waveSize*Math.sin(.002*t)+this.origX,this.lastUpdate=t):this.pauseFrame+=1,this.pauseFrame>5&&(this.lastUpdate=t,this.pauseFrame=0),this.y<-this.width&&(this.remove=1,i.decreaseLife(1))}},this.isInside=function(t,e){return!this.remove&&(t>this.x&&t<this.x+this.width&&e>this.y&&e<this.y+this.height)}}e.a=o},function(t,e,n){"use strict";function o(t,e,n,o,i){return{message:t,color:o,x:e,y:n,remove:0,insertTime:(new Date).getTime(),draw:function(){i.Draw.text(this.message,this.x,this.y,24,this.color)},update:function(){(new Date).getTime()-this.insertTime>700&&(this.remove=1)},isInside:function(){return!1}}}e.a=o},function(t,e,n){e=t.exports=n(1)(void 0),e.push([t.i,"blockquote,body,canvas,dd,div,dl,dt,fieldset,form,h1,h2,h3,h4,h5,h6,input,li,ol,p,pre,td,textarea,th,ul{margin:0;padding:0}*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}body{background:#000;width:100%;height:100%;margin:0 auto}html{//min-width:480px;//min-height:320px}body{margin:0;padding:0;overflow:hidden;font-family:Tahoma,Geneva,sans-serif;font-size:12px;color:#222;background:##F7F0F0}.hidden{display:none}canvas{display:block;margin:0 auto;background:#fff;width:320px;height:480px}",""])},function(t,e,n){e=t.exports=n(1)(void 0),e.push([t.i,".ui{display:block;position:absolute;left:0;top:0;width:100%;height:100%;background-color:#aeaeae;color:#000;list-style:none}.ui.gameRunning{opacity:.9;filter:alpha(opacity=90)}.ui li{margin:20px auto;padding:0;display:block;width:85%}.ui li a,.ui li span{font-size:2em;text-align:center;padding:20px;display:block;width:100%;background-color:#33aeae;text-decoration:none;border-radius:60px;color:#000;cursor:pointer}.openMenu,.ui .inGameOption{display:none}.openMenu{padding:10px;text-decoration:none;position:absolute;border-radius:400px;right:10px;top:10px;background:#efefef}",""])},function(t,e){t.exports=function(t){var e="undefined"!=typeof window&&window.location;if(!e)throw new Error("fixUrls requires window.location");if(!t||"string"!=typeof t)return t;var n=e.protocol+"//"+e.host,o=n+e.pathname.replace(/\/[^\/]*$/,"/");return t.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(t,e){var i=e.trim().replace(/^"(.*)"$/,function(t,e){return e}).replace(/^'(.*)'$/,function(t,e){return e});if(/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(i))return t;var r;return r=0===i.indexOf("//")?i:0===i.indexOf("/")?n+i:o+i.replace(/^\.\//,""),"url("+JSON.stringify(r)+")"})}}]);
//# sourceMappingURL=main.79a7ac217d997b1cdb06.js.map