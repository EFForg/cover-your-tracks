function e(e){return e?(e.nodeName||"").toLowerCase():null}function t(e){if(null==e)return window;if("[object Window]"!==e.toString()){var t=e.ownerDocument;return t&&t.defaultView||window}return e}function n(e){var n=t(e).Element;return e instanceof n||e instanceof Element}function o(e){var n=t(e).HTMLElement;return e instanceof n||e instanceof HTMLElement}function i(e){if("undefined"==typeof ShadowRoot)return!1;var n=t(e).ShadowRoot;return e instanceof n||e instanceof ShadowRoot}var r,a,s,c,p,u={name:"applyStyles",enabled:!0,phase:"write",fn:function(t){var n=t.state;Object.keys(n.elements).forEach(function(t){var i=n.styles[t]||{},r=n.attributes[t]||{},a=n.elements[t];o(a)&&e(a)&&(Object.assign(a.style,i),Object.keys(r).forEach(function(e){var t=r[e];!1===t?a.removeAttribute(e):a.setAttribute(e,!0===t?"":t)}))})},effect:function(t){var n=t.state,i={popper:{position:n.options.strategy,left:"0",top:"0",margin:"0"},arrow:{position:"absolute"},reference:{}};return Object.assign(n.elements.popper.style,i.popper),n.styles=i,n.elements.arrow&&Object.assign(n.elements.arrow.style,i.arrow),function(){Object.keys(n.elements).forEach(function(t){var r=n.elements[t],a=n.attributes[t]||{},s=Object.keys(n.styles.hasOwnProperty(t)?n.styles[t]:i[t]).reduce(function(e,t){return e[t]="",e},{});o(r)&&e(r)&&(Object.assign(r.style,s),Object.keys(a).forEach(function(e){r.removeAttribute(e)}))})}},requires:["computeStyles"]},f=Math.max,d=Math.min,l=Math.round;function m(){var e=navigator.userAgentData;return null!=e&&e.brands?e.brands.map(function(e){return e.brand+"/"+e.version}).join(" "):navigator.userAgent}function v(){return!/^((?!chrome|android).)*safari/i.test(m())}function h(e,i,r){void 0===i&&(i=!1),void 0===r&&(r=!1);var a=e.getBoundingClientRect(),s=1,c=1;i&&o(e)&&(s=e.offsetWidth>0&&l(a.width)/e.offsetWidth||1,c=e.offsetHeight>0&&l(a.height)/e.offsetHeight||1);var p=(n(e)?t(e):window).visualViewport,u=!v()&&r,f=(a.left+(u&&p?p.offsetLeft:0))/s,d=(a.top+(u&&p?p.offsetTop:0))/c,m=a.width/s,h=a.height/c;return{width:m,height:h,top:d,right:f+m,bottom:d+h,left:f,x:f,y:d}}function g(e){var n=t(e);return{scrollLeft:n.pageXOffset,scrollTop:n.pageYOffset}}function y(e){return((n(e)?e.ownerDocument:e.document)||window.document).documentElement}function b(e){return h(y(e)).left+g(e).scrollLeft}function w(e){return t(e).getComputedStyle(e)}function x(e){var t=w(e),n=t.overflow,o=t.overflowX,i=t.overflowY;return/auto|scroll|overlay|hidden/.test(n+i+o)}function O(e){var t=h(e),n=e.offsetWidth,o=e.offsetHeight;return 1>=Math.abs(t.width-n)&&(n=t.width),1>=Math.abs(t.height-o)&&(o=t.height),{x:e.offsetLeft,y:e.offsetTop,width:n,height:o}}function E(t){return"html"===e(t)?t:t.assignedSlot||t.parentNode||(i(t)?t.host:null)||y(t)}function A(n,i){void 0===i&&(i=[]);var r,a=function t(n){return["html","body","#document"].indexOf(e(n))>=0?n.ownerDocument.body:o(n)&&x(n)?n:t(E(n))}(n),s=a===(null==(r=n.ownerDocument)?void 0:r.body),c=t(a),p=s?[c].concat(c.visualViewport||[],x(a)?a:[]):a,u=i.concat(p);return s?u:u.concat(A(E(p)))}function T(e){return o(e)&&"fixed"!==w(e).position?e.offsetParent:null}function D(n){for(var r=t(n),a=T(n);a&&["table","td","th"].indexOf(e(a))>=0&&"static"===w(a).position;)a=T(a);return a&&("html"===e(a)||"body"===e(a)&&"static"===w(a).position)?r:a||function(t){var n=/firefox/i.test(m());if(/Trident/i.test(m())&&o(t)&&"fixed"===w(t).position)return null;var r=E(t);for(i(r)&&(r=r.host);o(r)&&0>["html","body"].indexOf(e(r));){var a=w(r);if("none"!==a.transform||"none"!==a.perspective||"paint"===a.contain||-1!==["transform","perspective"].indexOf(a.willChange)||n&&"filter"===a.willChange||n&&a.filter&&"none"!==a.filter)return r;r=r.parentNode}return null}(n)||r}var j="bottom",L="right",k="left",C="auto",M=["top",j,L,k],V="start",H="viewport",S="popper",W=M.reduce(function(e,t){return e.concat([t+"-"+V,t+"-end"])},[]),P=[].concat(M,[C]).reduce(function(e,t){return e.concat([t,t+"-"+V,t+"-end"])},[]),B=["beforeRead","read","afterRead","beforeMain","main","afterMain","beforeWrite","write","afterWrite"],R={placement:"bottom",modifiers:[],strategy:"absolute"};function N(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return!t.some(function(e){return!(e&&"function"==typeof e.getBoundingClientRect)})}var I={passive:!0};function q(e){return e.split("-")[0]}function U(e){return e.split("-")[1]}function _(e){return["top","bottom"].indexOf(e)>=0?"x":"y"}function F(e){var t,n=e.reference,o=e.element,i=e.placement,r=i?q(i):null,a=i?U(i):null,s=n.x+n.width/2-o.width/2,c=n.y+n.height/2-o.height/2;switch(r){case"top":t={x:s,y:n.y-o.height};break;case j:t={x:s,y:n.y+n.height};break;case L:t={x:n.x+n.width,y:c};break;case k:t={x:n.x-o.width,y:c};break;default:t={x:n.x,y:n.y}}var p=r?_(r):null;if(null!=p){var u="y"===p?"height":"width";switch(a){case V:t[p]=t[p]-(n[u]/2-o[u]/2);break;case"end":t[p]=t[p]+(n[u]/2-o[u]/2)}}return t}var z={top:"auto",right:"auto",bottom:"auto",left:"auto"};function $(e){var n,o,i,r,a,s,c=e.popper,p=e.popperRect,u=e.placement,f=e.variation,d=e.offsets,m=e.position,v=e.gpuAcceleration,h=e.adaptive,g=e.roundOffsets,b=e.isFixed,x=d.x,O=void 0===x?0:x,E=d.y,A=void 0===E?0:E,T="function"==typeof g?g({x:O,y:A}):{x:O,y:A};O=T.x,A=T.y;var C=d.hasOwnProperty("x"),M=d.hasOwnProperty("y"),V=k,H="top",S=window;if(h){var W=D(c),P="clientHeight",B="clientWidth";W===t(c)&&"static"!==w(W=y(c)).position&&"absolute"===m&&(P="scrollHeight",B="scrollWidth"),("top"===u||(u===k||u===L)&&"end"===f)&&(H=j,A-=(b&&W===S&&S.visualViewport?S.visualViewport.height:W[P])-p.height,A*=v?1:-1),(u===k||("top"===u||u===j)&&"end"===f)&&(V=L,O-=(b&&W===S&&S.visualViewport?S.visualViewport.width:W[B])-p.width,O*=v?1:-1)}var R=Object.assign({position:m},h&&z),N=!0===g?(o=(n={x:O,y:A}).x,i=n.y,{x:l(o*(r=window.devicePixelRatio||1))/r||0,y:l(i*r)/r||0}):{x:O,y:A};return(O=N.x,A=N.y,v)?Object.assign({},R,((s={})[H]=M?"0":"",s[V]=C?"0":"",s.transform=1>=(S.devicePixelRatio||1)?"translate("+O+"px, "+A+"px)":"translate3d("+O+"px, "+A+"px, 0)",s)):Object.assign({},R,((a={})[H]=M?A+"px":"",a[V]=C?O+"px":"",a.transform="",a))}var X={left:"right",right:"left",bottom:"top",top:"bottom"};function Y(e){return e.replace(/left|right|bottom|top/g,function(e){return X[e]})}var J={start:"end",end:"start"};function G(e){return e.replace(/start|end/g,function(e){return J[e]})}function K(e,t){var n=t.getRootNode&&t.getRootNode();if(e.contains(t))return!0;if(n&&i(n)){var o=t;do{if(o&&e.isSameNode(o))return!0;o=o.parentNode||o.host}while(o)}return!1}function Q(e){return Object.assign({},e,{left:e.x,top:e.y,right:e.x+e.width,bottom:e.y+e.height})}function Z(e,o,i){var r,a,s,c,p,u,d,l,m,x;return o===H?Q(function(e,n){var o=t(e),i=y(e),r=o.visualViewport,a=i.clientWidth,s=i.clientHeight,c=0,p=0;if(r){a=r.width,s=r.height;var u=v();(u||!u&&"fixed"===n)&&(c=r.offsetLeft,p=r.offsetTop)}return{width:a,height:s,x:c+b(e),y:p}}(e,i)):n(o)?((r=h(o,!1,"fixed"===i)).top=r.top+o.clientTop,r.left=r.left+o.clientLeft,r.bottom=r.top+o.clientHeight,r.right=r.left+o.clientWidth,r.width=o.clientWidth,r.height=o.clientHeight,r.x=r.left,r.y=r.top,r):Q((a=y(e),c=y(a),p=g(a),u=null==(s=a.ownerDocument)?void 0:s.body,d=f(c.scrollWidth,c.clientWidth,u?u.scrollWidth:0,u?u.clientWidth:0),l=f(c.scrollHeight,c.clientHeight,u?u.scrollHeight:0,u?u.clientHeight:0),m=-p.scrollLeft+b(a),x=-p.scrollTop,"rtl"===w(u||c).direction&&(m+=f(c.clientWidth,u?u.clientWidth:0)-d),{width:d,height:l,x:m,y:x}))}function ee(){return{top:0,right:0,bottom:0,left:0}}function et(e){return Object.assign({},ee(),e)}function en(e,t){return t.reduce(function(t,n){return t[n]=e,t},{})}function eo(t,i){void 0===i&&(i={});var r,a,s,c,p,u,l,m,v=i,g=v.placement,b=void 0===g?t.placement:g,x=v.strategy,O=void 0===x?t.strategy:x,T=v.boundary,k=v.rootBoundary,C=v.elementContext,V=void 0===C?S:C,W=v.altBoundary,P=v.padding,B=void 0===P?0:P,R=et("number"!=typeof B?B:en(B,M)),N=t.rects.popper,I=t.elements[void 0!==W&&W?V===S?"reference":S:V],q=(r=n(I)?I:I.contextElement||y(t.elements.popper),a=void 0===T?"clippingParents":T,s=void 0===k?H:k,l=(u=[].concat("clippingParents"===a?(c=A(E(r)),n(p=["absolute","fixed"].indexOf(w(r).position)>=0&&o(r)?D(r):r)?c.filter(function(t){return n(t)&&K(t,p)&&"body"!==e(t)}):[]):[].concat(a),[s]))[0],(m=u.reduce(function(e,t){var n=Z(r,t,O);return e.top=f(n.top,e.top),e.right=d(n.right,e.right),e.bottom=d(n.bottom,e.bottom),e.left=f(n.left,e.left),e},Z(r,l,O))).width=m.right-m.left,m.height=m.bottom-m.top,m.x=m.left,m.y=m.top,m),U=h(t.elements.reference),_=F({reference:U,element:N,strategy:"absolute",placement:b}),z=Q(Object.assign({},N,_)),$=V===S?z:U,X={top:q.top-$.top+R.top,bottom:$.bottom-q.bottom+R.bottom,left:q.left-$.left+R.left,right:$.right-q.right+R.right},Y=t.modifiersData.offset;if(V===S&&Y){var J=Y[b];Object.keys(X).forEach(function(e){var t=[L,j].indexOf(e)>=0?1:-1,n=["top",j].indexOf(e)>=0?"y":"x";X[e]+=J[n]*t})}return X}function ei(e,t,n){return f(e,d(t,n))}function er(e,t,n){return void 0===n&&(n={x:0,y:0}),{top:e.top-t.height-n.y,right:e.right-t.width+n.x,bottom:e.bottom-t.height+n.y,left:e.left-t.width-n.x}}function ea(e){return["top",L,j,k].some(function(t){return e[t]>=0})}var es=(s=void 0===(a=(r={defaultModifiers:[{name:"eventListeners",enabled:!0,phase:"write",fn:function(){},effect:function(e){var n=e.state,o=e.instance,i=e.options,r=i.scroll,a=void 0===r||r,s=i.resize,c=void 0===s||s,p=t(n.elements.popper),u=[].concat(n.scrollParents.reference,n.scrollParents.popper);return a&&u.forEach(function(e){e.addEventListener("scroll",o.update,I)}),c&&p.addEventListener("resize",o.update,I),function(){a&&u.forEach(function(e){e.removeEventListener("scroll",o.update,I)}),c&&p.removeEventListener("resize",o.update,I)}},data:{}},{name:"popperOffsets",enabled:!0,phase:"read",fn:function(e){var t=e.state,n=e.name;t.modifiersData[n]=F({reference:t.rects.reference,element:t.rects.popper,strategy:"absolute",placement:t.placement})},data:{}},{name:"computeStyles",enabled:!0,phase:"beforeWrite",fn:function(e){var t=e.state,n=e.options,o=n.gpuAcceleration,i=n.adaptive,r=n.roundOffsets,a=void 0===r||r,s={placement:q(t.placement),variation:U(t.placement),popper:t.elements.popper,popperRect:t.rects.popper,gpuAcceleration:void 0===o||o,isFixed:"fixed"===t.options.strategy};null!=t.modifiersData.popperOffsets&&(t.styles.popper=Object.assign({},t.styles.popper,$(Object.assign({},s,{offsets:t.modifiersData.popperOffsets,position:t.options.strategy,adaptive:void 0===i||i,roundOffsets:a})))),null!=t.modifiersData.arrow&&(t.styles.arrow=Object.assign({},t.styles.arrow,$(Object.assign({},s,{offsets:t.modifiersData.arrow,position:"absolute",adaptive:!1,roundOffsets:a})))),t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-placement":t.placement})},data:{}},u,{name:"offset",enabled:!0,phase:"main",requires:["popperOffsets"],fn:function(e){var t=e.state,n=e.options,o=e.name,i=n.offset,r=void 0===i?[0,0]:i,a=P.reduce(function(e,n){var o,i,a,s,c,p;return e[n]=(o=t.rects,a=[k,"top"].indexOf(i=q(n))>=0?-1:1,c=(s="function"==typeof r?r(Object.assign({},o,{placement:n})):r)[0],p=s[1],c=c||0,p=(p||0)*a,[k,L].indexOf(i)>=0?{x:p,y:c}:{x:c,y:p}),e},{}),s=a[t.placement],c=s.x,p=s.y;null!=t.modifiersData.popperOffsets&&(t.modifiersData.popperOffsets.x+=c,t.modifiersData.popperOffsets.y+=p),t.modifiersData[o]=a}},{name:"flip",enabled:!0,phase:"main",fn:function(e){var t=e.state,n=e.options,o=e.name;if(!t.modifiersData[o]._skip){for(var i=n.mainAxis,r=void 0===i||i,a=n.altAxis,s=void 0===a||a,c=n.fallbackPlacements,p=n.padding,u=n.boundary,f=n.rootBoundary,d=n.altBoundary,l=n.flipVariations,m=void 0===l||l,v=n.allowedAutoPlacements,h=t.options.placement,g=q(h)===h,y=c||(g||!m?[Y(h)]:function(e){if(q(e)===C)return[];var t=Y(e);return[G(e),t,G(t)]}(h)),b=[h].concat(y).reduce(function(e,n){var o,i,r,a,s,c,d,l,h,g,y,b;return e.concat(q(n)===C?(i=(o={placement:n,boundary:u,rootBoundary:f,padding:p,flipVariations:m,allowedAutoPlacements:v}).placement,r=o.boundary,a=o.rootBoundary,s=o.padding,c=o.flipVariations,l=void 0===(d=o.allowedAutoPlacements)?P:d,0===(y=(g=(h=U(i))?c?W:W.filter(function(e){return U(e)===h}):M).filter(function(e){return l.indexOf(e)>=0})).length&&(y=g),Object.keys(b=y.reduce(function(e,n){return e[n]=eo(t,{placement:n,boundary:r,rootBoundary:a,padding:s})[q(n)],e},{})).sort(function(e,t){return b[e]-b[t]})):n)},[]),w=t.rects.reference,x=t.rects.popper,O=new Map,E=!0,A=b[0],T=0;T<b.length;T++){var D=b[T],H=q(D),S=U(D)===V,B=["top",j].indexOf(H)>=0,R=B?"width":"height",N=eo(t,{placement:D,boundary:u,rootBoundary:f,altBoundary:d,padding:p}),I=B?S?L:k:S?j:"top";w[R]>x[R]&&(I=Y(I));var _=Y(I),F=[];if(r&&F.push(N[H]<=0),s&&F.push(N[I]<=0,N[_]<=0),F.every(function(e){return e})){A=D,E=!1;break}O.set(D,F)}if(E)for(var z=m?3:1,$=function(e){var t=b.find(function(t){var n=O.get(t);if(n)return n.slice(0,e).every(function(e){return e})});if(t)return A=t,"break"},X=z;X>0&&"break"!==$(X);X--);t.placement!==A&&(t.modifiersData[o]._skip=!0,t.placement=A,t.reset=!0)}},requiresIfExists:["offset"],data:{_skip:!1}},{name:"preventOverflow",enabled:!0,phase:"main",fn:function(e){var t=e.state,n=e.options,o=e.name,i=n.mainAxis,r=n.altAxis,a=n.boundary,s=n.rootBoundary,c=n.altBoundary,p=n.padding,u=n.tether,l=void 0===u||u,m=n.tetherOffset,v=void 0===m?0:m,h=eo(t,{boundary:a,rootBoundary:s,padding:p,altBoundary:c}),g=q(t.placement),y=U(t.placement),b=!y,w=_(g),x="x"===w?"y":"x",E=t.modifiersData.popperOffsets,A=t.rects.reference,T=t.rects.popper,C="function"==typeof v?v(Object.assign({},t.rects,{placement:t.placement})):v,M="number"==typeof C?{mainAxis:C,altAxis:C}:Object.assign({mainAxis:0,altAxis:0},C),H=t.modifiersData.offset?t.modifiersData.offset[t.placement]:null,S={x:0,y:0};if(E){if(void 0===i||i){var W,P="y"===w?"top":k,B="y"===w?j:L,R="y"===w?"height":"width",N=E[w],I=N+h[P],F=N-h[B],z=l?-T[R]/2:0,$=y===V?A[R]:T[R],X=y===V?-T[R]:-A[R],Y=t.elements.arrow,J=l&&Y?O(Y):{width:0,height:0},G=t.modifiersData["arrow#persistent"]?t.modifiersData["arrow#persistent"].padding:ee(),K=G[P],Q=G[B],Z=ei(0,A[R],J[R]),et=b?A[R]/2-z-Z-K-M.mainAxis:$-Z-K-M.mainAxis,en=b?-A[R]/2+z+Z+Q+M.mainAxis:X+Z+Q+M.mainAxis,er=t.elements.arrow&&D(t.elements.arrow),ea=er?"y"===w?er.clientTop||0:er.clientLeft||0:0,es=null!=(W=null==H?void 0:H[w])?W:0,ec=ei(l?d(I,N+et-es-ea):I,N,l?f(F,N+en-es):F);E[w]=ec,S[w]=ec-N}if(void 0!==r&&r){var ep,eu,ef="x"===w?"top":k,ed="x"===w?j:L,el=E[x],em="y"===x?"height":"width",ev=el+h[ef],eh=el-h[ed],eg=-1!==["top",k].indexOf(g),ey=null!=(eu=null==H?void 0:H[x])?eu:0,eb=eg?ev:el-A[em]-T[em]-ey+M.altAxis,ew=eg?el+A[em]+T[em]-ey-M.altAxis:eh,ex=l&&eg?(ep=ei(eb,el,ew))>ew?ew:ep:ei(l?eb:ev,el,l?ew:eh);E[x]=ex,S[x]=ex-el}t.modifiersData[o]=S}},requiresIfExists:["offset"]},{name:"arrow",enabled:!0,phase:"main",fn:function(e){var t,n=e.state,o=e.name,i=e.options,r=n.elements.arrow,a=n.modifiersData.popperOffsets,s=q(n.placement),c=_(s),p=[k,L].indexOf(s)>=0?"height":"width";if(r&&a){var u,f=et("number"!=typeof(u="function"==typeof(u=i.padding)?u(Object.assign({},n.rects,{placement:n.placement})):u)?u:en(u,M)),d=O(r),l="y"===c?"top":k,m="y"===c?j:L,v=n.rects.reference[p]+n.rects.reference[c]-a[c]-n.rects.popper[p],h=a[c]-n.rects.reference[c],g=D(r),y=g?"y"===c?g.clientHeight||0:g.clientWidth||0:0,b=f[l],w=y-d[p]-f[m],x=y/2-d[p]/2+(v/2-h/2),E=ei(b,x,w);n.modifiersData[o]=((t={})[c]=E,t.centerOffset=E-x,t)}},effect:function(e){var t=e.state,n=e.options.element,o=void 0===n?"[data-popper-arrow]":n;null!=o&&("string"!=typeof o||(o=t.elements.popper.querySelector(o)))&&K(t.elements.popper,o)&&(t.elements.arrow=o)},requires:["popperOffsets"],requiresIfExists:["preventOverflow"]},{name:"hide",enabled:!0,phase:"main",requiresIfExists:["preventOverflow"],fn:function(e){var t=e.state,n=e.name,o=t.rects.reference,i=t.rects.popper,r=t.modifiersData.preventOverflow,a=eo(t,{elementContext:"reference"}),s=eo(t,{altBoundary:!0}),c=er(a,o),p=er(s,i,r),u=ea(c),f=ea(p);t.modifiersData[n]={referenceClippingOffsets:c,popperEscapeOffsets:p,isReferenceHidden:u,hasPopperEscaped:f},t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-reference-hidden":u,"data-popper-escaped":f})}}]}).defaultModifiers)?[]:a,p=void 0===(c=r.defaultOptions)?R:c,function(i,r,a){void 0===a&&(a=p);var c,u,f={placement:"bottom",orderedModifiers:[],options:Object.assign({},R,p),modifiersData:{},elements:{reference:i,popper:r},attributes:{},styles:{}},d=[],m=!1,v={state:f,setOptions:function(e){var t,o,a,c,u,l="function"==typeof e?e(f.options):e;w(),f.options=Object.assign({},p,f.options,l),f.scrollParents={reference:n(i)?A(i):i.contextElement?A(i.contextElement):[],popper:A(r)};var m=(o=Object.keys(t=[].concat(s,f.options.modifiers).reduce(function(e,t){var n=e[t.name];return e[t.name]=n?Object.assign({},n,t,{options:Object.assign({},n.options,t.options),data:Object.assign({},n.data,t.data)}):t,e},{})).map(function(e){return t[e]}),a=new Map,c=new Set,u=[],o.forEach(function(e){a.set(e.name,e)}),o.forEach(function(e){c.has(e.name)||function e(t){c.add(t.name),[].concat(t.requires||[],t.requiresIfExists||[]).forEach(function(t){if(!c.has(t)){var n=a.get(t);n&&e(n)}}),u.push(t)}(e)}),B.reduce(function(e,t){return e.concat(u.filter(function(e){return e.phase===t}))},[]));return f.orderedModifiers=m.filter(function(e){return e.enabled}),f.orderedModifiers.forEach(function(e){var t=e.name,n=e.options,o=e.effect;if("function"==typeof o){var i=o({state:f,name:t,instance:v,options:void 0===n?{}:n});d.push(i||function(){})}}),v.update()},forceUpdate:function(){if(!m){var n=f.elements,i=n.reference,r=n.popper;if(N(i,r)){;f.rects={reference:(s=D(r),c="fixed"===f.options.strategy,p=o(s),E=o(s)&&(d=l((u=s.getBoundingClientRect()).width)/s.offsetWidth||1,w=l(u.height)/s.offsetHeight||1,1!==d||1!==w),A=y(s),T=h(i,E,c),j={scrollLeft:0,scrollTop:0},L={x:0,y:0},(p||!p&&!c)&&(("body"!==e(s)||x(A))&&(j=(a=s)!==t(a)&&o(a)?{scrollLeft:a.scrollLeft,scrollTop:a.scrollTop}:g(a)),o(s)?(L=h(s,!0),L.x+=s.clientLeft,L.y+=s.clientTop):A&&(L.x=b(A))),{x:T.left+j.scrollLeft-L.x,y:T.top+j.scrollTop-L.y,width:T.width,height:T.height}),popper:O(r)},f.reset=!1,f.placement=f.options.placement,f.orderedModifiers.forEach(function(e){return f.modifiersData[e.name]=Object.assign({},e.data)});for(var a,s,c,p,u,d,w,E,A,T,j,L,k=0;k<f.orderedModifiers.length;k++){if(!0===f.reset){f.reset=!1,k=-1;continue}var C=f.orderedModifiers[k],M=C.fn,V=C.options,H=void 0===V?{}:V,S=C.name;"function"==typeof M&&(f=M({state:f,options:H,name:S,instance:v})||f)}}}},update:(c=function(){return new Promise(function(e){v.forceUpdate(),e(f)})},function(){return u||(u=new Promise(function(e){Promise.resolve().then(function(){u=void 0,e(c())})})),u}),destroy:function(){w(),m=!0}};if(!N(i,r))return v;function w(){d.forEach(function(e){return e()}),d=[]}return v.setOptions(a).then(function(e){!m&&a.onFirstUpdate&&a.onFirstUpdate(e)}),v}),ec="tippy-content",ep="tippy-arrow",eu="tippy-svg-arrow",ef={passive:!0,capture:!0},ed=function(){return document.body};function el(e,t,n){if(Array.isArray(e)){var o=e[t];return null==o?Array.isArray(n)?n[t]:n:o}return e}function em(e,t){var n=({}).toString.call(e);return 0===n.indexOf("[object")&&n.indexOf(t+"]")>-1}function ev(e,t){return"function"==typeof e?e.apply(void 0,t):e}function eh(e,t){var n;return 0===t?e:function(o){clearTimeout(n),n=setTimeout(function(){e(o)},t)}}function eg(e){return[].concat(e)}function ey(e,t){-1===e.indexOf(t)&&e.push(t)}function eb(e){return[].slice.call(e)}function ew(e){return Object.keys(e).reduce(function(t,n){return void 0!==e[n]&&(t[n]=e[n]),t},{})}function ex(){return document.createElement("div")}function eO(e){return["Element","Fragment"].some(function(t){return em(e,t)})}function eE(e,t){e.forEach(function(e){e&&(e.style.transitionDuration=t+"ms")})}function eA(e,t){e.forEach(function(e){e&&e.setAttribute("data-state",t)})}function eT(e,t,n){var o=t+"EventListener";["transitionend","webkitTransitionEnd"].forEach(function(t){e[o](t,n)})}function eD(e,t){for(var n,o=t;o;){if(e.contains(o))return!0;o=null==o.getRootNode?void 0:null==(n=o.getRootNode())?void 0:n.host}return!1}var ej={isTouch:!1},eL=0;function ek(){!ej.isTouch&&(ej.isTouch=!0,window.performance&&document.addEventListener("mousemove",eC))}function eC(){var e=performance.now();e-eL<20&&(ej.isTouch=!1,document.removeEventListener("mousemove",eC)),eL=e}function eM(){var e=document.activeElement;if(e&&e._tippy&&e._tippy.reference===e){var t=e._tippy;e.blur&&!t.state.isVisible&&e.blur()}}var eV=!!("undefined"!=typeof window&&"undefined"!=typeof document)&&!!window.msCrypto,eH=Object.assign({appendTo:ed,aria:{content:"auto",expanded:"auto"},delay:0,duration:[300,250],getReferenceClientRect:null,hideOnClick:!0,ignoreAttributes:!1,interactive:!1,interactiveBorder:2,interactiveDebounce:0,moveTransition:"",offset:[0,10],onAfterUpdate:function(){},onBeforeUpdate:function(){},onCreate:function(){},onDestroy:function(){},onHidden:function(){},onHide:function(){},onMount:function(){},onShow:function(){},onShown:function(){},onTrigger:function(){},onUntrigger:function(){},onClickOutside:function(){},placement:"top",plugins:[],popperOptions:{},render:null,showOnCreate:!1,touch:!0,trigger:"mouseenter focus",triggerTarget:null},{animateFill:!1,followCursor:!1,inlinePositioning:!1,sticky:!1},{allowHTML:!1,animation:"fade",arrow:!0,content:"",inertia:!1,maxWidth:350,role:"tooltip",theme:"",zIndex:9999}),eS=Object.keys(eH);function eW(e){var t=(e.plugins||[]).reduce(function(t,n){var o,i=n.name,r=n.defaultValue;return i&&(t[i]=void 0!==e[i]?e[i]:null!=(o=eH[i])?o:r),t},{});return Object.assign({},e,t)}function eP(e,t){var n,o=Object.assign({},t,{content:ev(t.content,[e])},t.ignoreAttributes?{}:((n=t.plugins)?Object.keys(eW(Object.assign({},eH,{plugins:n}))):eS).reduce(function(t,n){var o=(e.getAttribute("data-tippy-"+n)||"").trim();if(!o)return t;if("content"===n)t[n]=o;else try{t[n]=JSON.parse(o)}catch(e){t[n]=o}return t},{}));return o.aria=Object.assign({},eH.aria,o.aria),o.aria={expanded:"auto"===o.aria.expanded?t.interactive:o.aria.expanded,content:"auto"===o.aria.content?t.interactive?null:"describedby":o.aria.content},o}function eB(e,t){e.innerHTML=t}function eR(e){var t=ex();return!0===e?t.className=ep:(t.className=eu,eO(e)?t.appendChild(e):eB(t,e)),t}function eN(e,t){eO(t.content)?(eB(e,""),e.appendChild(t.content)):"function"!=typeof t.content&&(t.allowHTML?eB(e,t.content):e.textContent=t.content)}function eI(e){var t=e.firstElementChild,n=eb(t.children);return{box:t,content:n.find(function(e){return e.classList.contains(ec)}),arrow:n.find(function(e){return e.classList.contains(ep)||e.classList.contains(eu)}),backdrop:n.find(function(e){return e.classList.contains("tippy-backdrop")})}}function eq(e){var t=ex(),n=ex();n.className="tippy-box",n.setAttribute("data-state","hidden"),n.setAttribute("tabindex","-1");var o=ex();function i(n,o){var i=eI(t),r=i.box,a=i.content,s=i.arrow;o.theme?r.setAttribute("data-theme",o.theme):r.removeAttribute("data-theme"),"string"==typeof o.animation?r.setAttribute("data-animation",o.animation):r.removeAttribute("data-animation"),o.inertia?r.setAttribute("data-inertia",""):r.removeAttribute("data-inertia"),r.style.maxWidth="number"==typeof o.maxWidth?o.maxWidth+"px":o.maxWidth,o.role?r.setAttribute("role",o.role):r.removeAttribute("role"),(n.content!==o.content||n.allowHTML!==o.allowHTML)&&eN(a,e.props),o.arrow?s?n.arrow!==o.arrow&&(r.removeChild(s),r.appendChild(eR(o.arrow))):r.appendChild(eR(o.arrow)):s&&r.removeChild(s)}return o.className=ec,o.setAttribute("data-state","hidden"),eN(o,e.props),t.appendChild(n),n.appendChild(o),i(e.props,e.props),{popper:t,onUpdate:i}}eq.$$tippy=!0;var eU=1,e_=[],eF=[];function ez(e,t){void 0===t&&(t={});var n=eH.plugins.concat(t.plugins||[]);document.addEventListener("touchstart",ek,ef),window.addEventListener("blur",eM);var o=Object.assign({},t,{plugins:n}),i=(eO(e)?[e]:em(e,"NodeList")?eb(e):Array.isArray(e)?e:eb(document.querySelectorAll(e))).reduce(function(e,t){var n=t&&function(e,t){var n,o,i,r,a,s,c,p,u=eP(e,Object.assign({},eH,eW(ew(t)))),f=!1,d=!1,l=!1,m=!1,v=[],h=eh(z,u.interactiveDebounce),g=eU++,y=(n=u.plugins).filter(function(e,t){return n.indexOf(e)===t}),b={id:g,reference:e,popper:ex(),popperInstance:null,props:u,state:{isEnabled:!0,isVisible:!1,isDestroyed:!1,isMounted:!1,isShown:!1},plugins:y,clearDelayTimeouts:function(){clearTimeout(o),clearTimeout(i),cancelAnimationFrame(r)},setProps:function(t){if(!b.state.isDestroyed){M("onBeforeUpdate",[b,t]),_();var n=b.props,o=eP(e,Object.assign({},n,ew(t),{ignoreAttributes:!0}));b.props=o,U(),n.interactiveDebounce!==o.interactiveDebounce&&(S(),h=eh(z,o.interactiveDebounce)),n.triggerTarget&&!o.triggerTarget?eg(n.triggerTarget).forEach(function(e){e.removeAttribute("aria-expanded")}):o.triggerTarget&&e.removeAttribute("aria-expanded"),H(),C(),O&&O(n,o),b.popperInstance&&(J(),K().forEach(function(e){requestAnimationFrame(e._tippy.popperInstance.forceUpdate)})),M("onAfterUpdate",[b,t])}},setContent:function(e){b.setProps({content:e})},show:function(){var t=b.state.isVisible,n=b.state.isDestroyed,o=!b.state.isEnabled,i=ej.isTouch&&!b.props.touch,r=el(b.props.duration,0,eH.duration);if(!(t||n||o||i||(p||e).hasAttribute("disabled"))&&(M("onShow",[b],!1),!1!==b.props.onShow(b))){if(b.state.isVisible=!0,j()&&(x.style.visibility="visible"),C(),R(),b.state.isMounted||(x.style.transition="none"),j()){var a,s,u,f=eI(x);eE([f.box,f.content],0)}c=function(){var e;if(b.state.isVisible&&!m){if(m=!0,x.offsetHeight,x.style.transition=b.props.moveTransition,j()&&b.props.animation){var t=eI(x),n=t.box,o=t.content;eE([n,o],r),eA([n,o],"visible")}V(),H(),ey(eF,b),null==(e=b.popperInstance)||e.forceUpdate(),M("onMount",[b]),b.props.animation&&j()&&I(r,function(){b.state.isShown=!0,M("onShown",[b])})}},s=b.props.appendTo,u=p||e,(a=b.props.interactive&&s===ed||"parent"===s?u.parentNode:ev(s,[u])).contains(x)||a.appendChild(x),b.state.isMounted=!0,J()}},hide:function(){var e=!b.state.isVisible,t=b.state.isDestroyed,n=!b.state.isEnabled,o=el(b.props.duration,1,eH.duration);if(!e&&!t&&!n&&(M("onHide",[b],!1),!1!==b.props.onHide(b))){if(b.state.isVisible=!1,b.state.isShown=!1,m=!1,f=!1,j()&&(x.style.visibility="hidden"),S(),N(),C(!0),j()){var i,r=eI(x),a=r.box,s=r.content;b.props.animation&&(eE([a,s],o),eA([a,s],"hidden"))}(V(),H(),b.props.animation)?j()&&(i=b.unmount,I(o,function(){!b.state.isVisible&&x.parentNode&&x.parentNode.contains(x)&&i()})):b.unmount()}},hideWithInteractivity:function(e){L().addEventListener("mousemove",h),ey(e_,h),h(e)},enable:function(){b.state.isEnabled=!0},disable:function(){b.hide(),b.state.isEnabled=!1},unmount:function(){b.state.isVisible&&b.hide(),b.state.isMounted&&(G(),K().forEach(function(e){e._tippy.unmount()}),x.parentNode&&x.parentNode.removeChild(x),eF=eF.filter(function(e){return e!==b}),b.state.isMounted=!1,M("onHidden",[b]))},destroy:function(){b.state.isDestroyed||(b.clearDelayTimeouts(),b.unmount(),_(),delete e._tippy,b.state.isDestroyed=!0,M("onDestroy",[b]))}};if(!u.render)return b;var w=u.render(b),x=w.popper,O=w.onUpdate;x.setAttribute("data-tippy-root",""),x.id="tippy-"+b.id,b.popper=x,e._tippy=b,x._tippy=b;var E=y.map(function(e){return e.fn(b)}),A=e.hasAttribute("aria-expanded");return U(),H(),C(),M("onCreate",[b]),u.showOnCreate&&Q(),x.addEventListener("mouseenter",function(){b.props.interactive&&b.state.isVisible&&b.clearDelayTimeouts()}),x.addEventListener("mouseleave",function(){b.props.interactive&&b.props.trigger.indexOf("mouseenter")>=0&&L().addEventListener("mousemove",h)}),b;function T(){var e=b.props.touch;return Array.isArray(e)?e:[e,0]}function D(){return"hold"===T()[0]}function j(){var e;return!!(null!=(e=b.props.render)&&e.$$tippy)}function L(){var t,n,o=(p||e).parentNode;return o&&null!=(n=eg(o)[0])&&null!=(t=n.ownerDocument)&&t.body?n.ownerDocument:document}function k(e){return b.state.isMounted&&!b.state.isVisible||ej.isTouch||a&&"focus"===a.type?0:el(b.props.delay,e?0:1,eH.delay)}function C(e){void 0===e&&(e=!1),x.style.pointerEvents=b.props.interactive&&!e?"":"none",x.style.zIndex=""+b.props.zIndex}function M(e,t,n){if(void 0===n&&(n=!0),E.forEach(function(n){n[e]&&n[e].apply(n,t)}),n){var o;(o=b.props)[e].apply(o,t)}}function V(){var t=b.props.aria;if(t.content){var n="aria-"+t.content,o=x.id;eg(b.props.triggerTarget||e).forEach(function(e){var t=e.getAttribute(n);if(b.state.isVisible)e.setAttribute(n,t?t+" "+o:o);else{var i=t&&t.replace(o,"").trim();i?e.setAttribute(n,i):e.removeAttribute(n)}})}}function H(){!A&&b.props.aria.expanded&&eg(b.props.triggerTarget||e).forEach(function(t){b.props.interactive?t.setAttribute("aria-expanded",b.state.isVisible&&t===(p||e)?"true":"false"):t.removeAttribute("aria-expanded")})}function S(){L().removeEventListener("mousemove",h),e_=e_.filter(function(e){return e!==h})}function W(t){if(!ej.isTouch||!l&&"mousedown"!==t.type){var n=t.composedPath&&t.composedPath()[0]||t.target;if(!(b.props.interactive&&eD(x,n))){if(eg(b.props.triggerTarget||e).some(function(e){return eD(e,n)})){if(ej.isTouch||b.state.isVisible&&b.props.trigger.indexOf("click")>=0)return}else M("onClickOutside",[b,t]);!0!==b.props.hideOnClick||(b.clearDelayTimeouts(),b.hide(),d=!0,setTimeout(function(){d=!1}),b.state.isMounted||N())}}}function P(){l=!0}function B(){l=!1}function R(){var e=L();e.addEventListener("mousedown",W,!0),e.addEventListener("touchend",W,ef),e.addEventListener("touchstart",B,ef),e.addEventListener("touchmove",P,ef)}function N(){var e=L();e.removeEventListener("mousedown",W,!0),e.removeEventListener("touchend",W,ef),e.removeEventListener("touchstart",B,ef),e.removeEventListener("touchmove",P,ef)}function I(e,t){var n=eI(x).box;function o(e){e.target===n&&(eT(n,"remove",o),t())}if(0===e)return t();eT(n,"remove",s),eT(n,"add",o),s=o}function q(t,n,o){void 0===o&&(o=!1),eg(b.props.triggerTarget||e).forEach(function(e){e.addEventListener(t,n,o),v.push({node:e,eventType:t,handler:n,options:o})})}function U(){D()&&(q("touchstart",F,{passive:!0}),q("touchend",$,{passive:!0})),b.props.trigger.split(/\s+/).filter(Boolean).forEach(function(e){if("manual"!==e)switch(q(e,F),e){case"mouseenter":q("mouseleave",$);break;case"focus":q(eV?"focusout":"blur",X);break;case"focusin":q("focusout",X)}})}function _(){v.forEach(function(e){var t=e.node,n=e.eventType,o=e.handler,i=e.options;t.removeEventListener(n,o,i)}),v=[]}function F(e){var t,n=!1;if(!(!b.state.isEnabled||Y(e))&&!d){var o=(null==(t=a)?void 0:t.type)==="focus";a=e,p=e.currentTarget,H(),!b.state.isVisible&&em(e,"MouseEvent")&&e_.forEach(function(t){return t(e)}),"click"===e.type&&(0>b.props.trigger.indexOf("mouseenter")||f)&&!1!==b.props.hideOnClick&&b.state.isVisible?n=!0:Q(e),"click"===e.type&&(f=!n),n&&!o&&Z(e)}}function z(t){var n,o,i,r=t.target,a=(p||e).contains(r)||x.contains(r);("mousemove"!==t.type||!a)&&(n=K().concat(x).map(function(e){var t,n=null==(t=e._tippy.popperInstance)?void 0:t.state;return n?{popperRect:e.getBoundingClientRect(),popperState:n,props:u}:null}).filter(Boolean),o=t.clientX,i=t.clientY,n.every(function(e){var t=e.popperRect,n=e.popperState,r=e.props.interactiveBorder,a=n.placement.split("-")[0],s=n.modifiersData.offset;if(!s)return!0;var c="bottom"===a?s.top.y:0,p="top"===a?s.bottom.y:0,u="right"===a?s.left.x:0,f="left"===a?s.right.x:0,d=t.top-i+c>r,l=i-t.bottom-p>r,m=t.left-o+u>r,v=o-t.right-f>r;return d||l||m||v})&&(S(),Z(t)))}function $(e){if(!(Y(e)||b.props.trigger.indexOf("click")>=0&&f)){if(b.props.interactive){b.hideWithInteractivity(e);return}Z(e)}}function X(t){(!(0>b.props.trigger.indexOf("focusin"))||t.target===(p||e))&&(b.props.interactive&&t.relatedTarget&&x.contains(t.relatedTarget)||Z(t))}function Y(e){return!!ej.isTouch&&D()!==e.type.indexOf("touch")>=0}function J(){G();var t=b.props,n=t.popperOptions,o=t.placement,i=t.offset,r=t.getReferenceClientRect,a=t.moveTransition,s=j()?eI(x).arrow:null,u=r?{getBoundingClientRect:r,contextElement:r.contextElement||p||e}:e,f=[{name:"offset",options:{offset:i}},{name:"preventOverflow",options:{padding:{top:2,bottom:2,left:5,right:5}}},{name:"flip",options:{padding:5}},{name:"computeStyles",options:{adaptive:!a}},{name:"$$tippy",enabled:!0,phase:"beforeWrite",requires:["computeStyles"],fn:function(e){var t=e.state;if(j()){var n=eI(x).box;["placement","reference-hidden","escaped"].forEach(function(e){"placement"===e?n.setAttribute("data-placement",t.placement):t.attributes.popper["data-popper-"+e]?n.setAttribute("data-"+e,""):n.removeAttribute("data-"+e)}),t.attributes.popper={}}}}];j()&&s&&f.push({name:"arrow",options:{element:s,padding:3}}),f.push.apply(f,(null==n?void 0:n.modifiers)||[]),b.popperInstance=es(u,x,Object.assign({},n,{placement:o,onFirstUpdate:c,modifiers:f}))}function G(){b.popperInstance&&(b.popperInstance.destroy(),b.popperInstance=null)}function K(){return eb(x.querySelectorAll("[data-tippy-root]"))}function Q(e){b.clearDelayTimeouts(),e&&M("onTrigger",[b,e]),R();var t=k(!0),n=T(),i=n[0],r=n[1];ej.isTouch&&"hold"===i&&r&&(t=r),t?o=setTimeout(function(){b.show()},t):b.show()}function Z(e){if(b.clearDelayTimeouts(),M("onUntrigger",[b,e]),!b.state.isVisible){N();return}if(!(b.props.trigger.indexOf("mouseenter")>=0&&b.props.trigger.indexOf("click")>=0&&["mouseleave","mousemove"].indexOf(e.type)>=0)||!f){var t=k(!1);t?i=setTimeout(function(){b.state.isVisible&&b.hide()},t):r=requestAnimationFrame(function(){b.hide()})}}}(t,o);return n&&e.push(n),e},[]);return eO(e)?i[0]:i}ez.defaultProps=eH,ez.setDefaultProps=function(e){Object.keys(e).forEach(function(t){eH[t]=e[t]})},ez.currentInput=ej,Object.assign({},u,{effect:function(e){var t=e.state,n={popper:{position:t.options.strategy,left:"0",top:"0",margin:"0"},arrow:{position:"absolute"},reference:{}};Object.assign(t.elements.popper.style,n.popper),t.styles=n,t.elements.arrow&&Object.assign(t.elements.arrow.style,n.arrow)}}),ez.setDefaultProps({render:eq}),window.tippy=ez;
//# sourceMappingURL=tippy.99ea24e4.js.map