var pg="1.3.15";function ep(n,t,e){return Math.max(n,Math.min(t,e))}function mg(n,t,e){return(1-e)*n+e*t}function _g(n,t,e,i){return mg(n,t,1-Math.exp(-e*i))}function gg(n,t){return(n%t+t)%t}var vg=class{isRunning=!1;value=0;from=0;to=0;currentTime=0;lerp;duration;easing;onUpdate;advance(n){if(!this.isRunning)return;let t=!1;if(this.duration&&this.easing){this.currentTime+=n;const e=ep(0,this.currentTime/this.duration,1);t=e>=1;const i=t?1:this.easing(e);this.value=this.from+(this.to-this.from)*i}else this.lerp?(this.value=_g(this.value,this.to,this.lerp*60,n),Math.round(this.value)===this.to&&(this.value=this.to,t=!0)):(this.value=this.to,t=!0);t&&this.stop(),this.onUpdate?.(this.value,t)}stop(){this.isRunning=!1}fromTo(n,t,{lerp:e,duration:i,easing:r,onStart:s,onUpdate:o}){this.from=this.value=n,this.to=t,this.lerp=e,this.duration=i,this.easing=r,this.currentTime=0,this.isRunning=!0,s?.(),this.onUpdate=o}};function xg(n,t){let e;return function(...i){let r=this;clearTimeout(e),e=setTimeout(()=>{e=void 0,n.apply(r,i)},t)}}var bg=class{constructor(n,t,{autoResize:e=!0,debounce:i=250}={}){this.wrapper=n,this.content=t,e&&(this.debouncedResize=xg(this.resize,i),this.wrapper instanceof Window?window.addEventListener("resize",this.debouncedResize,!1):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}width=0;height=0;scrollHeight=0;scrollWidth=0;debouncedResize;wrapperResizeObserver;contentResizeObserver;destroy(){this.wrapperResizeObserver?.disconnect(),this.contentResizeObserver?.disconnect(),this.wrapper===window&&this.debouncedResize&&window.removeEventListener("resize",this.debouncedResize,!1)}resize=()=>{this.onWrapperResize(),this.onContentResize()};onWrapperResize=()=>{this.wrapper instanceof Window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)};onContentResize=()=>{this.wrapper instanceof Window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)};get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}},np=class{events={};emit(t,...e){let i=this.events[t]||[];for(let r=0,s=i.length;r<s;r++)i[r]?.(...e)}on(t,e){return this.events[t]?.push(e)||(this.events[t]=[e]),()=>{this.events[t]=this.events[t]?.filter(i=>e!==i)}}off(t,e){this.events[t]=this.events[t]?.filter(i=>e!==i)}destroy(){this.events={}}},Yu=100/6,Fi={passive:!1},yg=class{constructor(n,t={wheelMultiplier:1,touchMultiplier:1}){this.element=n,this.options=t,window.addEventListener("resize",this.onWindowResize,!1),this.onWindowResize(),this.element.addEventListener("wheel",this.onWheel,Fi),this.element.addEventListener("touchstart",this.onTouchStart,Fi),this.element.addEventListener("touchmove",this.onTouchMove,Fi),this.element.addEventListener("touchend",this.onTouchEnd,Fi)}touchStart={x:0,y:0};lastDelta={x:0,y:0};window={width:0,height:0};emitter=new np;on(n,t){return this.emitter.on(n,t)}destroy(){this.emitter.destroy(),window.removeEventListener("resize",this.onWindowResize,!1),this.element.removeEventListener("wheel",this.onWheel,Fi),this.element.removeEventListener("touchstart",this.onTouchStart,Fi),this.element.removeEventListener("touchmove",this.onTouchMove,Fi),this.element.removeEventListener("touchend",this.onTouchEnd,Fi)}onTouchStart=n=>{const{clientX:t,clientY:e}=n.targetTouches?n.targetTouches[0]:n;this.touchStart.x=t,this.touchStart.y=e,this.lastDelta={x:0,y:0},this.emitter.emit("scroll",{deltaX:0,deltaY:0,event:n})};onTouchMove=n=>{const{clientX:t,clientY:e}=n.targetTouches?n.targetTouches[0]:n,i=-(t-this.touchStart.x)*this.options.touchMultiplier,r=-(e-this.touchStart.y)*this.options.touchMultiplier;this.touchStart.x=t,this.touchStart.y=e,this.lastDelta={x:i,y:r},this.emitter.emit("scroll",{deltaX:i,deltaY:r,event:n})};onTouchEnd=n=>{this.emitter.emit("scroll",{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:n})};onWheel=n=>{let{deltaX:t,deltaY:e,deltaMode:i}=n;const r=i===1?Yu:i===2?this.window.width:1,s=i===1?Yu:i===2?this.window.height:1;t*=r,e*=s,t*=this.options.wheelMultiplier,e*=this.options.wheelMultiplier,this.emitter.emit("scroll",{deltaX:t,deltaY:e,event:n})};onWindowResize=()=>{this.window={width:window.innerWidth,height:window.innerHeight}}},$u=n=>Math.min(1,1.001-Math.pow(2,-10*n)),wg=class{_isScrolling=!1;_isStopped=!1;_isLocked=!1;_preventNextNativeScrollEvent=!1;_resetVelocityTimeout=null;__rafID=null;isTouching;time=0;userData={};lastVelocity=0;velocity=0;direction=0;options;targetScroll;animatedScroll;animate=new vg;emitter=new np;dimensions;virtualScroll;constructor({wrapper:n=window,content:t=document.documentElement,eventsTarget:e=n,smoothWheel:i=!0,syncTouch:r=!1,syncTouchLerp:s=.075,touchInertiaExponent:o=1.7,duration:a,easing:l,lerp:c=.1,infinite:h=!1,orientation:d="vertical",gestureOrientation:u=d==="horizontal"?"both":"vertical",touchMultiplier:f=1,wheelMultiplier:_=1,autoResize:g=!0,prevent:p,virtualScroll:m,overscroll:y=!0,autoRaf:E=!1,anchors:b=!1,autoToggle:S=!1,allowNestedScroll:T=!1,__experimental__naiveDimensions:C=!1}={}){window.lenisVersion=pg,(!n||n===document.documentElement)&&(n=window),typeof a=="number"&&typeof l!="function"?l=$u:typeof l=="function"&&typeof a!="number"&&(a=1),this.options={wrapper:n,content:t,eventsTarget:e,smoothWheel:i,syncTouch:r,syncTouchLerp:s,touchInertiaExponent:o,duration:a,easing:l,lerp:c,infinite:h,gestureOrientation:u,orientation:d,touchMultiplier:f,wheelMultiplier:_,autoResize:g,prevent:p,virtualScroll:m,overscroll:y,autoRaf:E,anchors:b,autoToggle:S,allowNestedScroll:T,__experimental__naiveDimensions:C},this.dimensions=new bg(n,t,{autoResize:g}),this.updateClassName(),this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener("scroll",this.onNativeScroll,!1),this.options.wrapper.addEventListener("scrollend",this.onScrollEnd,{capture:!0}),this.options.anchors&&this.options.wrapper===window&&this.options.wrapper.addEventListener("click",this.onClick,!1),this.options.wrapper.addEventListener("pointerdown",this.onPointerDown,!1),this.virtualScroll=new yg(e,{touchMultiplier:f,wheelMultiplier:_}),this.virtualScroll.on("scroll",this.onVirtualScroll),this.options.autoToggle&&this.rootElement.addEventListener("transitionend",this.onTransitionEnd,{passive:!0}),this.options.autoRaf&&(this.__rafID=requestAnimationFrame(this.raf))}destroy(){this.emitter.destroy(),this.options.wrapper.removeEventListener("scroll",this.onNativeScroll,!1),this.options.wrapper.removeEventListener("scrollend",this.onScrollEnd,{capture:!0}),this.options.wrapper.removeEventListener("pointerdown",this.onPointerDown,!1),this.options.anchors&&this.options.wrapper===window&&this.options.wrapper.removeEventListener("click",this.onClick,!1),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName(),this.__rafID&&cancelAnimationFrame(this.__rafID)}on(n,t){return this.emitter.on(n,t)}off(n,t){return this.emitter.off(n,t)}onScrollEnd=n=>{n instanceof CustomEvent||(this.isScrolling==="smooth"||this.isScrolling===!1)&&n.stopPropagation()};dispatchScrollendEvent=()=>{this.options.wrapper.dispatchEvent(new CustomEvent("scrollend",{bubbles:this.options.wrapper===window,detail:{lenisScrollEnd:!0}}))};onTransitionEnd=n=>{if(n.propertyName.includes("overflow")){const t=this.isHorizontal?"overflow-x":"overflow-y",e=getComputedStyle(this.rootElement)[t];["hidden","clip"].includes(e)?this.internalStop():this.internalStart()}};setScroll(n){this.isHorizontal?this.options.wrapper.scrollTo({left:n,behavior:"instant"}):this.options.wrapper.scrollTo({top:n,behavior:"instant"})}onClick=n=>{const e=n.composedPath().find(i=>i instanceof HTMLAnchorElement&&i.getAttribute("href")?.includes("#"));if(e){const i=e.getAttribute("href");if(i){const r=typeof this.options.anchors=="object"&&this.options.anchors?this.options.anchors:void 0,s=`#${i.split("#")[1]}`;this.scrollTo(s,r)}}};onPointerDown=n=>{n.button===1&&this.reset()};onVirtualScroll=n=>{if(typeof this.options.virtualScroll=="function"&&this.options.virtualScroll(n)===!1)return;const{deltaX:t,deltaY:e,event:i}=n;if(this.emitter.emit("virtual-scroll",{deltaX:t,deltaY:e,event:i}),i.ctrlKey||i.lenisStopPropagation)return;const r=i.type.includes("touch"),s=i.type.includes("wheel");this.isTouching=i.type==="touchstart"||i.type==="touchmove";const o=t===0&&e===0;if(this.options.syncTouch&&r&&i.type==="touchstart"&&o&&!this.isStopped&&!this.isLocked){this.reset();return}const l=this.options.gestureOrientation==="vertical"&&e===0||this.options.gestureOrientation==="horizontal"&&t===0;if(o||l)return;let c=i.composedPath();c=c.slice(0,c.indexOf(this.rootElement));const h=this.options.prevent;if(c.find(p=>p instanceof HTMLElement&&(typeof h=="function"&&h?.(p)||p.hasAttribute?.("data-lenis-prevent")||r&&p.hasAttribute?.("data-lenis-prevent-touch")||s&&p.hasAttribute?.("data-lenis-prevent-wheel")||this.options.allowNestedScroll&&this.checkNestedScroll(p,{deltaX:t,deltaY:e}))))return;if(this.isStopped||this.isLocked){i.cancelable&&i.preventDefault();return}if(!(this.options.syncTouch&&r||this.options.smoothWheel&&s)){this.isScrolling="native",this.animate.stop(),i.lenisStopPropagation=!0;return}let u=e;this.options.gestureOrientation==="both"?u=Math.abs(e)>Math.abs(t)?e:t:this.options.gestureOrientation==="horizontal"&&(u=t),(!this.options.overscroll||this.options.infinite||this.options.wrapper!==window&&this.limit>0&&(this.animatedScroll>0&&this.animatedScroll<this.limit||this.animatedScroll===0&&e>0||this.animatedScroll===this.limit&&e<0))&&(i.lenisStopPropagation=!0),i.cancelable&&i.preventDefault();const f=r&&this.options.syncTouch,g=r&&i.type==="touchend";g&&(u=Math.sign(this.velocity)*Math.pow(Math.abs(this.velocity),this.options.touchInertiaExponent)),this.scrollTo(this.targetScroll+u,{programmatic:!1,...f?{lerp:g?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}})};resize(){this.dimensions.resize(),this.animatedScroll=this.targetScroll=this.actualScroll,this.emit()}emit(){this.emitter.emit("scroll",this)}onNativeScroll=()=>{if(this._resetVelocityTimeout!==null&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this._preventNextNativeScrollEvent){this._preventNextNativeScrollEvent=!1;return}if(this.isScrolling===!1||this.isScrolling==="native"){const n=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-n,this.direction=Math.sign(this.animatedScroll-n),this.isStopped||(this.isScrolling="native"),this.emit(),this.velocity!==0&&(this._resetVelocityTimeout=setTimeout(()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()},400))}};reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){if(this.isStopped){if(this.options.autoToggle){this.rootElement.style.removeProperty("overflow");return}this.internalStart()}}internalStart(){this.isStopped&&(this.reset(),this.isStopped=!1,this.emit())}stop(){if(!this.isStopped){if(this.options.autoToggle){this.rootElement.style.setProperty("overflow","clip");return}this.internalStop()}}internalStop(){this.isStopped||(this.reset(),this.isStopped=!0,this.emit())}raf=n=>{const t=n-(this.time||n);this.time=n,this.animate.advance(t*.001),this.options.autoRaf&&(this.__rafID=requestAnimationFrame(this.raf))};scrollTo(n,{offset:t=0,immediate:e=!1,lock:i=!1,duration:r=this.options.duration,easing:s=this.options.easing,lerp:o=this.options.lerp,onStart:a,onComplete:l,force:c=!1,programmatic:h=!0,userData:d}={}){if(!((this.isStopped||this.isLocked)&&!c)){if(typeof n=="string"&&["top","left","start","#"].includes(n))n=0;else if(typeof n=="string"&&["bottom","right","end"].includes(n))n=this.limit;else{let u;if(typeof n=="string"?(u=document.querySelector(n),u||(n==="#top"?n=0:console.warn("Lenis: Target not found",n))):n instanceof HTMLElement&&n?.nodeType&&(u=n),u){if(this.options.wrapper!==window){const _=this.rootElement.getBoundingClientRect();t-=this.isHorizontal?_.left:_.top}const f=u.getBoundingClientRect();n=(this.isHorizontal?f.left:f.top)+this.animatedScroll}}if(typeof n=="number"){if(n+=t,n=Math.round(n),this.options.infinite){if(h){this.targetScroll=this.animatedScroll=this.scroll;const u=n-this.animatedScroll;u>this.limit/2?n=n-this.limit:u<-this.limit/2&&(n=n+this.limit)}}else n=ep(0,n,this.limit);if(n===this.targetScroll){a?.(this),l?.(this);return}if(this.userData=d??{},e){this.animatedScroll=this.targetScroll=n,this.setScroll(this.scroll),this.reset(),this.preventNextNativeScrollEvent(),this.emit(),l?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()});return}h||(this.targetScroll=n),typeof r=="number"&&typeof s!="function"?s=$u:typeof s=="function"&&typeof r!="number"&&(r=1),this.animate.fromTo(this.animatedScroll,n,{duration:r,easing:s,lerp:o,onStart:()=>{i&&(this.isLocked=!0),this.isScrolling="smooth",a?.(this)},onUpdate:(u,f)=>{this.isScrolling="smooth",this.lastVelocity=this.velocity,this.velocity=u-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=u,this.setScroll(this.scroll),h&&(this.targetScroll=u),f||this.emit(),f&&(this.reset(),this.emit(),l?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()}),this.preventNextNativeScrollEvent())}})}}}preventNextNativeScrollEvent(){this._preventNextNativeScrollEvent=!0,requestAnimationFrame(()=>{this._preventNextNativeScrollEvent=!1})}checkNestedScroll(n,{deltaX:t,deltaY:e}){const i=Date.now(),r=n._lenis??={};let s,o,a,l,c,h,d,u;const f=this.options.gestureOrientation;if(i-(r.time??0)>2e3){r.time=Date.now();const S=window.getComputedStyle(n);r.computedStyle=S;const T=S.overflowX,C=S.overflowY;if(s=["auto","overlay","scroll"].includes(T),o=["auto","overlay","scroll"].includes(C),r.hasOverflowX=s,r.hasOverflowY=o,!s&&!o||f==="vertical"&&!o||f==="horizontal"&&!s)return!1;c=n.scrollWidth,h=n.scrollHeight,d=n.clientWidth,u=n.clientHeight,a=c>d,l=h>u,r.isScrollableX=a,r.isScrollableY=l,r.scrollWidth=c,r.scrollHeight=h,r.clientWidth=d,r.clientHeight=u}else a=r.isScrollableX,l=r.isScrollableY,s=r.hasOverflowX,o=r.hasOverflowY,c=r.scrollWidth,h=r.scrollHeight,d=r.clientWidth,u=r.clientHeight;if(!s&&!o||!a&&!l||f==="vertical"&&(!o||!l)||f==="horizontal"&&(!s||!a))return!1;let _;if(f==="horizontal")_="x";else if(f==="vertical")_="y";else{const S=t!==0,T=e!==0;S&&s&&a&&(_="x"),T&&o&&l&&(_="y")}if(!_)return!1;let g,p,m,y,E;if(_==="x")g=n.scrollLeft,p=c-d,m=t,y=s,E=a;else if(_==="y")g=n.scrollTop,p=h-u,m=e,y=o,E=l;else return!1;return(m>0?g<p:g>0)&&y&&E}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.__experimental__naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?"x":"y"]}get isHorizontal(){return this.options.orientation==="horizontal"}get actualScroll(){const n=this.options.wrapper;return this.isHorizontal?n.scrollX??n.scrollLeft:n.scrollY??n.scrollTop}get scroll(){return this.options.infinite?gg(this.animatedScroll,this.limit):this.animatedScroll}get progress(){return this.limit===0?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(n){this._isScrolling!==n&&(this._isScrolling=n,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(n){this._isStopped!==n&&(this._isStopped=n,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(n){this._isLocked!==n&&(this._isLocked=n,this.updateClassName())}get isSmooth(){return this.isScrolling==="smooth"}get className(){let n="lenis";return this.options.autoToggle&&(n+=" lenis-autoToggle"),this.isStopped&&(n+=" lenis-stopped"),this.isLocked&&(n+=" lenis-locked"),this.isScrolling&&(n+=" lenis-scrolling"),this.isScrolling==="smooth"&&(n+=" lenis-smooth"),n}updateClassName(){this.cleanUpClassName(),this.rootElement.className=`${this.rootElement.className} ${this.className}`.trim()}cleanUpClassName(){this.rootElement.className=this.rootElement.className.replace(/lenis(-\w+)?/g,"").trim()}};const wl=new WeakMap;function Sl(n,t,e,i){if(!n&&!wl.has(t))return!1;const r=wl.get(t)??new WeakMap;wl.set(t,r);const s=r.get(e)??new Set;r.set(e,s);const o=s.has(i);return n?s.add(i):s.delete(i),o&&n}function Sg(n,t){let e=n.target;if(e instanceof Text&&(e=e.parentElement),e instanceof Element&&n.currentTarget instanceof Node){const i=e.closest(t);if(i&&n.currentTarget.contains(i))return i}}function ip(n,t,e,i={}){if(Array.isArray(t)){for(const _ of t)ip(n,_,e,i);return}const r=t,{signal:s,base:o=document}=i;if(s?.aborted)return;const{once:a,...l}=i,c=o instanceof Document?o.documentElement:o,h=!!(typeof i=="object"?i.capture:i),d=_=>{const g=Sg(_,String(n));if(g){const p=Object.assign(_,{delegateTarget:g});e.call(c,p),a&&(c.removeEventListener(r,d,l),Sl(!1,c,e,u))}},u=JSON.stringify({selector:n,type:r,capture:h});Sl(!0,c,e,u)||c.addEventListener(r,d,l),s?.addEventListener("abort",()=>{Sl(!1,c,e,u)})}function Ie(){return Ie=Object.assign?Object.assign.bind():function(n){for(var t=1;t<arguments.length;t++){var e=arguments[t];for(var i in e)({}).hasOwnProperty.call(e,i)&&(n[i]=e[i])}return n},Ie.apply(null,arguments)}const rp=(n,t)=>String(n).toLowerCase().replace(/[\s/_.]+/g,"-").replace(/[^\w-]+/g,"").replace(/--+/g,"-").replace(/^-+|-+$/g,"")||t||"",so=({hash:n}={})=>window.location.pathname+window.location.search+(n?window.location.hash:""),Eg=(n,t={})=>{const e=Ie({url:n=n||so({hash:!0}),random:Math.random(),source:"swup"},t);window.history.pushState(e,"",n)},Js=(n=null,t={})=>{n=n||so({hash:!0});const e=Ie({},window.history.state||{},{url:n,random:Math.random(),source:"swup"},t);window.history.replaceState(e,"",n)},Mg=(n,t,e,i)=>{const r=new AbortController;return i=Ie({},i,{signal:r.signal}),ip(n,t,e,i),{destroy:()=>r.abort()}};class je extends URL{constructor(t,e=document.baseURI){super(t.toString(),e),Object.setPrototypeOf(this,je.prototype)}get url(){return this.pathname+this.search}static fromElement(t){const e=t.getAttribute("href")||t.getAttribute("xlink:href")||"";return new je(e)}static fromUrl(t){return new je(t)}}class Ho extends Error{constructor(t,e){super(t),this.url=void 0,this.status=void 0,this.aborted=void 0,this.timedOut=void 0,this.name="FetchError",this.url=e.url,this.status=e.status,this.aborted=e.aborted||!1,this.timedOut=e.timedOut||!1}}async function Tg(n,t={}){var e;n=je.fromUrl(n).url;const{visit:i=this.visit}=t,r=Ie({},this.options.requestHeaders,t.headers),s=(e=t.timeout)!=null?e:this.options.timeout,o=new AbortController,{signal:a}=o;t=Ie({},t,{headers:r,signal:a});let l,c=!1,h=null;s&&s>0&&(h=setTimeout(()=>{c=!0,o.abort("timeout")},s));try{l=await this.hooks.call("fetch:request",i,{url:n,options:t},(p,{url:m,options:y})=>fetch(m,y)),h&&clearTimeout(h)}catch(p){throw c?(this.hooks.call("fetch:timeout",i,{url:n}),new Ho(`Request timed out: ${n}`,{url:n,timedOut:c})):p?.name==="AbortError"||a.aborted?new Ho(`Request aborted: ${n}`,{url:n,aborted:!0}):p}const{status:d,url:u}=l,f=await l.text();if(d===500)throw this.hooks.call("fetch:error",i,{status:d,response:l,url:u}),new Ho(`Server error: ${u}`,{status:d,url:u});if(!f)throw new Ho(`Empty response: ${u}`,{status:d,url:u});const{url:_}=je.fromUrl(u),g={url:_,html:f};return!i.cache.write||t.method&&t.method!=="GET"||n!==_||this.cache.set(g.url,g),g}class Cg{constructor(t){this.swup=void 0,this.pages=new Map,this.swup=t}get size(){return this.pages.size}get all(){const t=new Map;return this.pages.forEach((e,i)=>{t.set(i,Ie({},e))}),t}has(t){return this.pages.has(this.resolve(t))}get(t){const e=this.pages.get(this.resolve(t));return e&&Ie({},e)}set(t,e){e=Ie({},e,{url:t=this.resolve(t)}),this.pages.set(t,e),this.swup.hooks.callSync("cache:set",void 0,{page:e})}update(t,e){t=this.resolve(t);const i=Ie({},this.get(t),e,{url:t});this.pages.set(t,i)}delete(t){this.pages.delete(this.resolve(t))}clear(){this.pages.clear(),this.swup.hooks.callSync("cache:clear",void 0,void 0)}prune(t){this.pages.forEach((e,i)=>{t(i,e)&&this.delete(i)})}resolve(t){const{url:e}=je.fromUrl(t);return this.swup.resolveUrl(e)}}const bc=(n,t=document)=>t.querySelector(n),Ih=(n,t=document)=>Array.from(t.querySelectorAll(n)),sp=()=>new Promise(n=>{requestAnimationFrame(()=>{requestAnimationFrame(()=>{n()})})});function op(n){return!!n&&(typeof n=="object"||typeof n=="function")&&typeof n.then=="function"}function Ag(n,t=[]){return new Promise((e,i)=>{const r=n(...t);op(r)?r.then(e,i):e(r)})}function Ku(n,t){const e=n?.closest(`[${t}]`);return e!=null&&e.hasAttribute(t)?e?.getAttribute(t)||!0:void 0}class Pg{constructor(t){this.swup=void 0,this.swupClasses=["to-","is-changing","is-rendering","is-popstate","is-animating","is-leaving"],this.swup=t}get selectors(){const{scope:t}=this.swup.visit.animation;return t==="containers"?this.swup.visit.containers:t==="html"?["html"]:Array.isArray(t)?t:[]}get selector(){return this.selectors.join(",")}get targets(){return this.selector.trim()?Ih(this.selector):[]}add(...t){this.targets.forEach(e=>e.classList.add(...t))}remove(...t){this.targets.forEach(e=>e.classList.remove(...t))}clear(){this.targets.forEach(t=>{const e=t.className.split(" ").filter(i=>this.isSwupClass(i));t.classList.remove(...e)})}isSwupClass(t){return this.swupClasses.some(e=>t.startsWith(e))}}class ap{constructor(t,e){this.id=void 0,this.state=void 0,this.from=void 0,this.to=void 0,this.containers=void 0,this.animation=void 0,this.trigger=void 0,this.cache=void 0,this.history=void 0,this.scroll=void 0,this.meta=void 0;const{to:i,from:r,hash:s,el:o,event:a}=e;this.id=Math.random(),this.state=1,this.from={url:r??t.location.url,hash:t.location.hash},this.to={url:i,hash:s},this.containers=t.options.containers,this.animation={animate:!0,wait:!1,name:void 0,native:t.options.native,scope:t.options.animationScope,selector:t.options.animationSelector},this.trigger={el:o,event:a},this.cache={read:t.options.cache,write:t.options.cache},this.history={action:"push",popstate:!1,direction:void 0},this.scroll={reset:!0,target:void 0},this.meta={}}advance(t){this.state<t&&(this.state=t)}abort(){this.state=8}ignore(){this.state=10}get done(){return this.state>=7}get ignored(){return this.state===10}}function Rg(n){return new ap(this,n)}class Lg{constructor(t){this.swup=void 0,this.registry=new Map,this.hooks=["animation:out:start","animation:out:await","animation:out:end","animation:in:start","animation:in:await","animation:in:end","animation:skip","cache:clear","cache:set","content:replace","content:scroll","enable","disable","fetch:request","fetch:error","fetch:timeout","history:popstate","link:click","link:self","link:anchor","link:newtab","page:load","page:view","scroll:top","scroll:anchor","visit:start","visit:transition","visit:abort","visit:end"],this.nextHookId=0,this.swup=t,this.init()}init(){this.hooks.forEach(t=>this.create(t))}create(t){this.registry.has(t)||this.registry.set(t,new Map)}exists(t){return this.registry.has(t)}get(t){const e=this.registry.get(t);if(e)return e;console.error(`Unknown hook '${t}'`)}clear(){this.registry.forEach(t=>t.clear())}on(t,e,i={}){const r=this.get(t);if(!r)return console.warn(`Hook '${t}' not found.`),()=>{};const s=Ie({},i,{id:++this.nextHookId,hook:t,handler:e});return r.set(e,s),()=>this.off(t,e)}before(t,e,i={}){return this.on(t,e,Ie({},i,{before:!0}))}replace(t,e,i={}){return this.on(t,e,Ie({},i,{replace:!0}))}once(t,e,i={}){return this.on(t,e,Ie({},i,{once:!0}))}off(t,e){const i=this.get(t);i&&e?i.delete(e)||console.warn(`Handler for hook '${t}' not found.`):i&&i.clear()}async call(t,e,i,r){const[s,o,a]=this.parseCallArgs(t,e,i,r),{before:l,handler:c,after:h}=this.getHandlers(t,a);await this.run(l,s,o);const[d]=await this.run(c,s,o,!0);return await this.run(h,s,o),this.dispatchDomEvent(t,s,o),d}callSync(t,e,i,r){const[s,o,a]=this.parseCallArgs(t,e,i,r),{before:l,handler:c,after:h}=this.getHandlers(t,a);this.runSync(l,s,o);const[d]=this.runSync(c,s,o,!0);return this.runSync(h,s,o),this.dispatchDomEvent(t,s,o),d}parseCallArgs(t,e,i,r){return e instanceof ap||typeof e!="object"&&typeof i!="function"?[e,i,r]:[void 0,e,i]}async run(t,e=this.swup.visit,i,r=!1){const s=[];for(const{hook:o,handler:a,defaultHandler:l,once:c}of t)if(e==null||!e.done){c&&this.off(o,a);try{const h=await Ag(a,[e,i,l]);s.push(h)}catch(h){if(r)throw h;console.error(`Error in hook '${o}':`,h)}}return s}runSync(t,e=this.swup.visit,i,r=!1){const s=[];for(const{hook:o,handler:a,defaultHandler:l,once:c}of t)if(e==null||!e.done){c&&this.off(o,a);try{const h=a(e,i,l);s.push(h),op(h)&&console.warn(`Swup will not await Promises in handler for synchronous hook '${o}'.`)}catch(h){if(r)throw h;console.error(`Error in hook '${o}':`,h)}}return s}getHandlers(t,e){const i=this.get(t);if(!i)return{found:!1,before:[],handler:[],after:[],replaced:!1};const r=Array.from(i.values()),s=this.sortRegistrations,o=r.filter(({before:d,replace:u})=>d&&!u).sort(s),a=r.filter(({replace:d})=>d).filter(d=>!0).sort(s),l=r.filter(({before:d,replace:u})=>!d&&!u).sort(s),c=a.length>0;let h=[];if(e&&(h=[{id:0,hook:t,handler:e}],c)){const d=a.length-1,{handler:u,once:f}=a[d],_=g=>{const p=a[g-1];return p?(m,y)=>p.handler(m,y,_(g-1)):e};h=[{id:0,hook:t,once:f,handler:u,defaultHandler:_(d)}]}return{found:!0,before:o,handler:h,after:l,replaced:c}}sortRegistrations(t,e){var i,r;return((i=t.priority)!=null?i:0)-((r=e.priority)!=null?r:0)||t.id-e.id||0}dispatchDomEvent(t,e,i){if(e!=null&&e.done)return;const r={hook:t,args:i,visit:e||this.swup.visit};document.dispatchEvent(new CustomEvent("swup:any",{detail:r,bubbles:!0})),document.dispatchEvent(new CustomEvent(`swup:${t}`,{detail:r,bubbles:!0}))}parseName(t){const[e,...i]=t.split(".");return[e,i.reduce((r,s)=>Ie({},r,{[s]:!0}),{})]}}const Dg=n=>{if(n&&n.charAt(0)==="#"&&(n=n.substring(1)),!n)return null;const t=decodeURIComponent(n);let e=document.getElementById(n)||document.getElementById(t)||bc(`a[name='${CSS.escape(n)}']`)||bc(`a[name='${CSS.escape(t)}']`);return e||n!=="top"||(e=document.body),e},Go="transition",El="animation";async function Ig({selector:n,elements:t}){if(n===!1&&!t)return;let e=[];if(t)e=Array.from(t);else if(n&&(e=Ih(n,document.body),!e.length))return void console.warn(`[swup] No elements found matching animationSelector \`${n}\``);const i=e.map(r=>(function(s){const{type:o,timeout:a,propCount:l}=(function(c){const h=window.getComputedStyle(c),d=Wo(h,`${Go}Delay`),u=Wo(h,`${Go}Duration`),f=Zu(d,u),_=Wo(h,`${El}Delay`),g=Wo(h,`${El}Duration`),p=Zu(_,g),m=Math.max(f,p),y=m>0?f>p?Go:El:null;return{type:y,timeout:m,propCount:y?y===Go?u.length:g.length:0}})(s);return!(!o||!a)&&new Promise(c=>{const h=`${o}end`,d=performance.now();let u=0;const f=()=>{s.removeEventListener(h,_),c()},_=g=>{g.target===s&&((performance.now()-d)/1e3<g.elapsedTime||++u>=l&&f())};setTimeout(()=>{u<l&&f()},a+1),s.addEventListener(h,_)})})(r)).filter(r=>r!==!1);i.length?await Promise.all(i):n&&console.warn(`[swup] No CSS animation duration defined on elements matching \`${n}\``)}function Wo(n,t){return(n[t]||"").split(", ")}function Zu(n,t){for(;n.length<t.length;)n=n.concat(n);return Math.max(...t.map((e,i)=>Ju(e)+Ju(n[i])))}function Ju(n){return 1e3*parseFloat(n)}function Ug(n,t={},e={}){if(typeof n!="string")throw new Error("swup.navigate() requires a URL parameter");if(this.shouldIgnoreVisit(n,{el:e.el,event:e.event}))return void window.location.assign(n);const{url:i,hash:r}=je.fromUrl(n),s=this.createVisit(Ie({},e,{to:i,hash:r}));this.performNavigation(s,t)}async function Ng(n,t={}){if(this.navigating){if(this.visit.state>=6)return n.state=2,void(this.onVisitEnd=()=>this.performNavigation(n,t));await this.hooks.call("visit:abort",this.visit,void 0),delete this.visit.to.document,this.visit.state=8}this.navigating=!0,this.visit=n;const{el:e}=n.trigger;t.referrer=t.referrer||this.location.url,t.animate===!1&&(n.animation.animate=!1),n.animation.animate||this.classes.clear();const i=t.history||Ku(e,"data-swup-history");typeof i=="string"&&["push","replace"].includes(i)&&(n.history.action=i);const r=t.animation||Ku(e,"data-swup-animation");var s,o;typeof r=="string"&&(n.animation.name=r),n.meta=t.meta||{},typeof t.cache=="object"?(n.cache.read=(s=t.cache.read)!=null?s:n.cache.read,n.cache.write=(o=t.cache.write)!=null?o:n.cache.write):t.cache!==void 0&&(n.cache={read:!!t.cache,write:!!t.cache}),delete t.cache;try{await this.hooks.call("visit:start",n,void 0),n.state=3;const a=this.hooks.call("page:load",n,{options:t},async(c,h)=>{let d;return c.cache.read&&(d=this.cache.get(c.to.url)),h.page=d||await this.fetchPage(c.to.url,h.options),h.cache=!!d,h.page});a.then(({html:c})=>{n.advance(5),n.to.html=c,n.to.document=new DOMParser().parseFromString(c,"text/html")});const l=n.to.url+n.to.hash;if(n.history.popstate||(n.history.action==="replace"||n.to.url===this.location.url?Js(l):(this.currentHistoryIndex++,Eg(l,{index:this.currentHistoryIndex}))),this.location=je.fromUrl(l),n.history.popstate&&this.classes.add("is-popstate"),n.animation.name&&this.classes.add(`to-${rp(n.animation.name)}`),n.animation.wait&&await a,n.ignored)throw new Error(`Visit to ${n.to.url} manually ignored`);if(n.done||(await this.hooks.call("visit:transition",n,void 0,async()=>{if(!n.animation.animate)return await this.hooks.call("animation:skip",void 0),void await this.renderPage(n,await a);n.advance(4),await this.animatePageOut(n),n.animation.native&&document.startViewTransition?await document.startViewTransition(async()=>await this.renderPage(n,await a)).finished:await this.renderPage(n,await a),await this.animatePageIn(n)}),n.done))return;await this.hooks.call("visit:end",n,void 0,()=>this.classes.clear()),n.state=7,this.navigating=!1,this.onVisitEnd&&(this.onVisitEnd(),this.onVisitEnd=void 0)}catch(a){if(!a||a!=null&&a.aborted)return void n.advance(8);n.advance(9),console.error(a),this.options.skipPopStateHandling=()=>(window.location.assign(n.to.url+n.to.hash),!0),window.history.back()}finally{delete n.to.document}}const Og=async function(n){await this.hooks.call("animation:out:start",n,void 0,()=>{this.classes.add("is-changing","is-animating","is-leaving")}),await this.hooks.call("animation:out:await",n,{skip:!1},(t,{skip:e})=>{if(!e)return this.awaitAnimations({selector:t.animation.selector})}),await this.hooks.call("animation:out:end",n,void 0)},Fg=function(n){var t;const e=n.to.document;if(!e)return!1;const i=((t=e.querySelector("title"))==null?void 0:t.innerText)||"";document.title=i;const r=Ih('[data-swup-persist]:not([data-swup-persist=""])'),s=n.containers.map(o=>{const a=document.querySelector(o),l=e.querySelector(o);return a&&l?(a.replaceWith(l.cloneNode(!0)),!0):(a||console.warn(`[swup] Container missing in current document: ${o}`),l||console.warn(`[swup] Container missing in incoming document: ${o}`),!1)}).filter(Boolean);return r.forEach(o=>{const a=o.getAttribute("data-swup-persist"),l=bc(`[data-swup-persist="${a}"]`);l&&l!==o&&l.replaceWith(o)}),s.length===n.containers.length},kg=function(n){const t={behavior:"auto"},{target:e,reset:i}=n.scroll,r=e??n.to.hash;let s=!1;return r&&(s=this.hooks.callSync("scroll:anchor",n,{hash:r,options:t},(o,{hash:a,options:l})=>{const c=this.getAnchorElement(a);return c&&c.scrollIntoView(l),!!c})),i&&!s&&(s=this.hooks.callSync("scroll:top",n,{options:t},(o,{options:a})=>(window.scrollTo(Ie({top:0,left:0},a)),!0))),s},Bg=async function(n){if(n.done)return;const t=this.hooks.call("animation:in:await",n,{skip:!1},(e,{skip:i})=>{if(!i)return this.awaitAnimations({selector:e.animation.selector})});await sp(),await this.hooks.call("animation:in:start",n,void 0,()=>{this.classes.remove("is-animating")}),await t,await this.hooks.call("animation:in:end",n,void 0)},Vg=async function(n,t){if(n.done)return;n.advance(6);const{url:e}=t;this.isSameResolvedUrl(so(),e)||(Js(e),this.location=je.fromUrl(e),n.to.url=this.location.url,n.to.hash=this.location.hash),await this.hooks.call("content:replace",n,{page:t},(i,{})=>{if(this.classes.remove("is-leaving"),i.animation.animate&&this.classes.add("is-rendering"),!this.replaceContent(i))throw new Error("[swup] Container mismatch, aborting");i.animation.animate&&(this.classes.add("is-changing","is-animating","is-rendering"),i.animation.name&&this.classes.add(`to-${rp(i.animation.name)}`))}),await this.hooks.call("content:scroll",n,void 0,()=>this.scrollToContent(n)),await this.hooks.call("page:view",n,{url:this.location.url,title:document.title})},zg=function(n){var t;if(t=n,!!t?.isSwupPlugin){if(n.swup=this,!n._checkRequirements||n._checkRequirements())return n._beforeMount&&n._beforeMount(),n.mount(),this.plugins.push(n),this.plugins}else console.error("Not a swup plugin instance",n)};function Hg(n){const t=this.findPlugin(n);if(t)return t.unmount(),t._afterUnmount&&t._afterUnmount(),this.plugins=this.plugins.filter(e=>e!==t),this.plugins;console.error("No such plugin",t)}function Gg(n){return this.plugins.find(t=>typeof n=="string"?[`Swup${n}`,n].includes(t.name):t===n)}function Wg(n){if(typeof this.options.resolveUrl!="function")return console.warn("[swup] options.resolveUrl expects a callback function."),n;const t=this.options.resolveUrl(n);return t&&typeof t=="string"?t.startsWith("//")||t.startsWith("http")?(console.warn("[swup] options.resolveUrl needs to return a relative url"),n):t:(console.warn("[swup] options.resolveUrl needs to return a url"),n)}function Xg(n,t){return this.resolveUrl(n)===this.resolveUrl(t)}const qg={animateHistoryBrowsing:!1,animationSelector:'[class*="transition-"]',animationScope:"html",cache:!0,containers:["#swup"],hooks:{},ignoreVisit:(n,{el:t}={})=>!(t==null||!t.closest("[data-no-swup]")),linkSelector:"a[href]",linkToSelf:"scroll",native:!1,plugins:[],resolveUrl:n=>n,requestHeaders:{"X-Requested-With":"swup",Accept:"text/html, application/xhtml+xml"},skipPopStateHandling:n=>{var t;return((t=n.state)==null?void 0:t.source)!=="swup"},timeout:0};class Yg{get currentPageUrl(){return this.location.url}constructor(t={}){var e,i;this.version="4.9.2",this.options=void 0,this.defaults=qg,this.plugins=[],this.visit=void 0,this.cache=void 0,this.hooks=void 0,this.classes=void 0,this.location=je.fromUrl(window.location.href),this.currentHistoryIndex=void 0,this.clickDelegate=void 0,this.navigating=!1,this.onVisitEnd=void 0,this.use=zg,this.unuse=Hg,this.findPlugin=Gg,this.log=()=>{},this.navigate=Ug,this.performNavigation=Ng,this.createVisit=Rg,this.delegateEvent=Mg,this.fetchPage=Tg,this.awaitAnimations=Ig,this.renderPage=Vg,this.replaceContent=Fg,this.animatePageIn=Bg,this.animatePageOut=Og,this.scrollToContent=kg,this.getAnchorElement=Dg,this.getCurrentUrl=so,this.resolveUrl=Wg,this.isSameResolvedUrl=Xg,this.options=Ie({},this.defaults,t),this.handleLinkClick=this.handleLinkClick.bind(this),this.handlePopState=this.handlePopState.bind(this),this.cache=new Cg(this),this.classes=new Pg(this),this.hooks=new Lg(this),this.visit=this.createVisit({to:""}),this.currentHistoryIndex=(e=(i=window.history.state)==null?void 0:i.index)!=null?e:1,this.enable()}async enable(){var t;const{linkSelector:e}=this.options;this.clickDelegate=this.delegateEvent(e,"click",this.handleLinkClick),window.addEventListener("popstate",this.handlePopState),this.options.animateHistoryBrowsing&&(window.history.scrollRestoration="manual"),this.options.native=this.options.native&&!!document.startViewTransition,this.options.plugins.forEach(i=>this.use(i));for(const[i,r]of Object.entries(this.options.hooks)){const[s,o]=this.hooks.parseName(i);this.hooks.on(s,r,o)}((t=window.history.state)==null?void 0:t.source)!=="swup"&&Js(null,{index:this.currentHistoryIndex}),await sp(),await this.hooks.call("enable",void 0,void 0,()=>{const i=document.documentElement;i.classList.add("swup-enabled"),i.classList.toggle("swup-native",this.options.native)})}async destroy(){this.clickDelegate.destroy(),window.removeEventListener("popstate",this.handlePopState),this.cache.clear(),this.plugins.forEach(t=>this.unuse(t)),await this.hooks.call("disable",void 0,void 0,()=>{const t=document.documentElement;t.classList.remove("swup-enabled"),t.classList.remove("swup-native")}),this.hooks.clear()}shouldIgnoreVisit(t,{el:e,event:i}={}){const{origin:r,url:s,hash:o}=je.fromUrl(t);return r!==window.location.origin||!(!e||!this.triggerWillOpenNewWindow(e))||!!this.options.ignoreVisit(s+o,{el:e,event:i})}handleLinkClick(t){const e=t.delegateTarget,{href:i,url:r,hash:s}=je.fromElement(e);if(this.shouldIgnoreVisit(i,{el:e,event:t}))return;if(this.navigating&&r===this.visit.to.url)return void t.preventDefault();const o=this.createVisit({to:r,hash:s,el:e,event:t});t.metaKey||t.ctrlKey||t.shiftKey||t.altKey?this.hooks.callSync("link:newtab",o,{href:i}):t.button===0&&this.hooks.callSync("link:click",o,{el:e,event:t},()=>{var a;const l=(a=o.from.url)!=null?a:"";t.preventDefault(),r&&r!==l?this.isSameResolvedUrl(r,l)||this.performNavigation(o):s?this.hooks.callSync("link:anchor",o,{hash:s},()=>{Js(r+s),this.scrollToContent(o)}):this.hooks.callSync("link:self",o,void 0,()=>{this.options.linkToSelf==="navigate"?this.performNavigation(o):(Js(r),this.scrollToContent(o))})})}handlePopState(t){var e,i,r,s;const o=(e=(i=t.state)==null?void 0:i.url)!=null?e:window.location.href;if(this.options.skipPopStateHandling(t)||this.isSameResolvedUrl(so(),this.location.url))return;const{url:a,hash:l}=je.fromUrl(o),c=this.createVisit({to:a,hash:l,event:t});c.history.popstate=!0;const h=(r=(s=t.state)==null?void 0:s.index)!=null?r:0;h&&h!==this.currentHistoryIndex&&(c.history.direction=h-this.currentHistoryIndex>0?"forwards":"backwards",this.currentHistoryIndex=h),c.animation.animate=!1,c.scroll.reset=!1,c.scroll.target=!1,this.options.animateHistoryBrowsing&&(c.animation.animate=!0,c.scroll.reset=!0),this.hooks.callSync("history:popstate",c,{event:t},()=>{this.performNavigation(c)})}triggerWillOpenNewWindow(t){return!!t.matches('[download], [target="_blank"]')}}function js(){return js=Object.assign?Object.assign.bind():function(n){for(var t=1;t<arguments.length;t++){var e=arguments[t];for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(n[i]=e[i])}return n},js.apply(this,arguments)}const ju=n=>String(n).split(".").map(t=>String(parseInt(t||"0",10))).concat(["0","0"]).slice(0,3).join(".");class lp{constructor(){this.isSwupPlugin=!0,this.swup=void 0,this.version=void 0,this.requires={},this.handlersToUnregister=[]}mount(){}unmount(){this.handlersToUnregister.forEach(t=>t()),this.handlersToUnregister=[]}_beforeMount(){if(!this.name)throw new Error("You must define a name of plugin when creating a class.")}_afterUnmount(){}_checkRequirements(){return typeof this.requires!="object"||Object.entries(this.requires).forEach(([t,e])=>{if(!(function(i,r,s){const o=(function(a,l){var c;if(a==="swup")return(c=l.version)!=null?c:"";{var h;const d=l.findPlugin(a);return(h=d?.version)!=null?h:""}})(i,s);return!!o&&((a,l)=>l.every(c=>{const[,h,d]=c.match(/^([\D]+)?(.*)$/)||[];var u,f;return((_,g)=>{const p={"":m=>m===0,">":m=>m>0,">=":m=>m>=0,"<":m=>m<0,"<=":m=>m<=0};return(p[g]||p[""])(_)})((f=d,u=ju(u=a),f=ju(f),u.localeCompare(f,void 0,{numeric:!0})),h||">=")}))(o,r)})(t,e=Array.isArray(e)?e:[e],this.swup)){const i=`${t} ${e.join(", ")}`;throw new Error(`Plugin version mismatch: ${this.name} requires ${i}`)}}),!0}on(t,e,i={}){var r;e=!(r=e).name.startsWith("bound ")||r.hasOwnProperty("prototype")?e.bind(this):e;const s=this.swup.hooks.on(t,e,i);return this.handlersToUnregister.push(s),s}once(t,e,i={}){return this.on(t,e,js({},i,{once:!0}))}before(t,e,i={}){return this.on(t,e,js({},i,{before:!0}))}replace(t,e,i={}){return this.on(t,e,js({},i,{replace:!0}))}off(t,e){return this.swup.hooks.off(t,e)}}(function(){if(!(typeof window>"u"||typeof document>"u"||typeof HTMLElement>"u")){var n=!1;try{var t=document.createElement("div");t.addEventListener("focus",function(s){s.preventDefault(),s.stopPropagation()},!0),t.focus(Object.defineProperty({},"preventScroll",{get:function(){if(navigator&&typeof navigator.userAgent<"u"&&navigator.userAgent&&navigator.userAgent.match(/Edge\/1[7-8]/))return n=!1;n=!0}}))}catch{}if(HTMLElement.prototype.nativeFocus===void 0&&!n){HTMLElement.prototype.nativeFocus=HTMLElement.prototype.focus;var e=function(s){for(var o=s.parentNode,a=[],l=document.scrollingElement||document.documentElement;o&&o!==l;)(o.offsetHeight<o.scrollHeight||o.offsetWidth<o.scrollWidth)&&a.push([o,o.scrollTop,o.scrollLeft]),o=o.parentNode;return o=l,a.push([o,o.scrollTop,o.scrollLeft]),a},i=function(s){for(var o=0;o<s.length;o++)s[o][0].scrollTop=s[o][1],s[o][0].scrollLeft=s[o][2];s=[]},r=function(s){if(s&&s.preventScroll){var o=e(this);if(typeof setTimeout=="function"){var a=this;setTimeout(function(){a.nativeFocus(),i(o)},0)}else this.nativeFocus(),i(o)}else this.nativeFocus()};HTMLElement.prototype.focus=r}}})();function yc(){return yc=Object.assign?Object.assign.bind():function(n){for(var t=1;t<arguments.length;t++){var e=arguments[t];for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(n[i]=e[i])}return n},yc.apply(this,arguments)}function Qu(n,t){return Object.keys(t).reduce((e,i)=>e.replace(`{${i}}`,t[i]||""),n||"")}let $g=class{constructor(){var t;this.id="swup-announcer",this.style="position:absolute;top:0;left:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;word-wrap:normal;width:1px;height:1px;",this.region=void 0,this.region=(t=this.getRegion())!=null?t:this.createRegion()}getRegion(){return document.getElementById(this.id)}createRegion(){const t=(function(e){const i=document.createElement("template");return i.innerHTML=e,i.content.children[0]})(`<p aria-live="assertive" aria-atomic="true" id="${this.id}" style="${this.style}"></p>`);return document.body.appendChild(t),t}announce(t,e=0){return new Promise(i=>{setTimeout(()=>{this.region.textContent===t&&(t=`${t}.`),this.region.textContent="",this.region.textContent=t,i()},e)})}};function td(n){let t;if(t=typeof n=="string"?document.querySelector(n):n,!(t instanceof HTMLElement))return;const e=t.getAttribute("tabindex");t.setAttribute("tabindex","-1"),t.focus({preventScroll:!0}),e!==null&&t.setAttribute("tabindex",e)}let Kg=class extends lp{constructor(t={}){super(),this.name="SwupA11yPlugin",this.requires={swup:">=4"},this.defaults={headingSelector:["main h1","h1"],respectReducedMotion:!0,autofocus:!1,announcements:{visit:"Navigated to: {title}",url:"New page at {url}"}},this.options=void 0,this.announcer=void 0,this.announcementDelay=100,this.rootSelector="body",this.handleAnchorScroll=(e,{hash:i})=>{const r=this.swup.getAnchorElement(i);r instanceof HTMLElement&&td(r)},this.options=yc({},this.defaults,t),this.announcer=new $g}mount(){this.swup.hooks.create("content:announce"),this.swup.hooks.create("content:focus"),this.before("visit:start",this.prepareVisit),this.on("visit:start",this.markAsBusy),this.on("visit:end",this.unmarkAsBusy),this.on("content:replace",this.maybeFocusEarly),this.on("visit:end",this.maybeFocusLate),this.on("visit:end",this.announceContent),this.on("scroll:anchor",this.handleAnchorScroll),this.before("visit:start",this.disableAnimations),this.before("link:self",this.disableAnimations),this.before("link:anchor",this.disableAnimations),this.swup.announce=this.announce.bind(this)}unmount(){this.swup.announce=void 0}async announce(t){await this.announcer.announce(t)}markAsBusy(){document.documentElement.setAttribute("aria-busy","true")}unmarkAsBusy(){document.documentElement.removeAttribute("aria-busy")}prepareVisit(t){t.a11y={announce:void 0,focus:{selector:this.rootSelector,wait:!0}}}announceContent(t){this.swup.hooks.callSync("content:announce",t,void 0,e=>{e.a11y.announce===void 0&&(e.a11y.announce=this.getPageAnnouncement()),e.a11y.announce&&this.announcer.announce(e.a11y.announce,this.announcementDelay)})}maybeFocusEarly(t){const e=this.parseVisitFocus(t.a11y.focus);e&&!e.wait&&this.focusContent(t)}maybeFocusLate(t){const e=this.parseVisitFocus(t.a11y.focus);e&&e.wait&&this.focusContent(t)}focusContent(t){this.swup.hooks.callSync("content:focus",t,void 0,e=>{const i=this.parseVisitFocus(e.a11y.focus);i&&(this.options.autofocus&&(function(){const r=(function(){const s=document.querySelector("body [autofocus]");if(s&&!s.closest('[inert], [aria-disabled], [aria-hidden="true"]'))return s})();return!!r&&(r!==document.activeElement&&r.focus(),!0)})()===!0||td(i.selector))})}parseVisitFocus(t){if(!t)return!1;const e=typeof t=="string"?{selector:t,wait:!0}:t;return!!e.selector&&e}getPageAnnouncement(){const{headingSelector:t,announcements:e}=this.options;return(function({headingSelector:i="h1",announcements:r={}}){var s,o;const a=document.documentElement.lang||"*",{href:l,url:c,pathname:h}=je.fromUrl(window.location.href),d=(s=(o=r[a])!=null?o:r["*"])!=null?s:r;if(typeof d!="object")return;const u=Array.isArray(i)?i:[i],f=u.reduce((g,p)=>g??document.querySelector(p),null);f||console.warn(`SwupA11yPlugin: No main heading (${u.join(" / ")}) found on new page`);const _=f?.getAttribute("aria-label")||f?.textContent||document.title||Qu(d.url,{href:l,url:c,path:h});return Qu(d.visit,{title:_,href:l,url:c,path:h})})({headingSelector:t,announcements:e})}disableAnimations(t){this.options.respectReducedMotion&&window.matchMedia("(prefers-reduced-motion: reduce)").matches&&(t.animation.animate=!1,t.scroll.animate=!1)}};function Ua(){return Ua=Object.assign?Object.assign.bind():function(n){for(var t=1;t<arguments.length;t++){var e=arguments[t];for(var i in e)({}).hasOwnProperty.call(e,i)&&(n[i]=e[i])}return n},Ua.apply(null,arguments)}function ed(n){return n.localName!=="title"&&!n.matches("[data-swup-theme]")}function nd(n,t){return n.outerHTML===t.outerHTML}function id(n,t=[]){const e=Array.from(n.attributes);return t.length?e.filter(({name:i})=>t.some(r=>r instanceof RegExp?r.test(i):i===r)):e}function Zg(n){return n.matches("link[rel=stylesheet][href]")}class Jg extends lp{constructor(t={}){var e;super(),e=this,this.name="SwupHeadPlugin",this.requires={swup:">=4.6"},this.defaults={persistTags:!1,persistAssets:!1,awaitAssets:!1,attributes:["lang","dir"],timeout:3e3},this.options=void 0,this.updateHead=async function(i,{page:{}}){const{awaitAssets:r,attributes:s,timeout:o}=e.options,a=i.to.document,{removed:l,added:c}=(function(h,d,{shouldPersist:u=()=>!1}={}){const f=Array.from(h.children),_=Array.from(d.children),g=(p=f,_.reduce((E,b,S)=>(p.some(T=>nd(b,T))||E.push({el:b,index:S}),E),[]));var p;const m=(function(E,b){return E.reduce((S,T)=>(b.some(C=>nd(T,C))||S.push({el:T}),S),[])})(f,_);m.reverse().filter(({el:E})=>ed(E)).filter(({el:E})=>!u(E)).forEach(({el:E})=>h.removeChild(E));const y=g.filter(({el:E})=>ed(E)).map(E=>{let b=E.el.cloneNode(!0);return h.insertBefore(b,h.children[(E.index||0)+1]||null),Ua({},E,{el:b})});return{removed:m.map(({el:E})=>E),added:y.map(({el:E})=>E)}})(document.head,a.head,{shouldPersist:h=>e.isPersistentTag(h)});if(e.swup.log(`Removed ${l.length} / added ${c.length} tags in head`),s!=null&&s.length&&(function(h,d,u=[]){const f=new Set;for(const{name:_,value:g}of id(d,u))h.setAttribute(_,g),f.add(_);for(const{name:_}of id(h,u))f.has(_)||h.removeAttribute(_)})(document.documentElement,a.documentElement,s),r){const h=(function(d,u=0){return d.filter(Zg).map(f=>(function(_,g=0){let p;const m=y=>{_.sheet?y():p=setTimeout(()=>m(y),10)};return new Promise(y=>{m(()=>y(_)),g>0&&setTimeout(()=>{p&&clearTimeout(p),y(_)},g)})})(f,u))})(c,o);h.length&&(e.swup.log(`Waiting for ${h.length} assets to load`),await Promise.all(h))}},this.options=Ua({},this.defaults,t),this.options.persistAssets&&!this.options.persistTags&&(this.options.persistTags="link[rel=stylesheet], script[src], style")}mount(){this.before("content:replace",this.updateHead)}isPersistentTag(t){const{persistTags:e}=this.options;return typeof e=="function"?e(t):typeof e=="string"&&e.length>0?t.matches(e):!!e}}const el=new Yg({containers:["#swup"],animationSelector:'[class*="swup-"]',plugins:[new Jg({persistTags:"[data-tp-style]"}),new Kg]}),ba=new wg;function cp(n){ba.raf(n),requestAnimationFrame(cp)}function hp(){const n=document.querySelector('[data-page="home"]')!==null;document.documentElement.classList.toggle("is-home",n),n?(ba.scrollTo(0,{immediate:!0,force:!0}),ba.stop()):ba.start()}requestAnimationFrame(cp);hp();el.hooks.on("page:view",hp);const nl=document.querySelector("#site-menu"),il=document.querySelector(".site-navigation__toggle"),up=document.querySelectorAll(".site-menu__link");if(!(nl instanceof HTMLElement))throw new Error("The site menu was not found.");if(!(il instanceof HTMLButtonElement))throw new Error("The site menu trigger was not found.");function rl(n){nl.setAttribute("aria-hidden",String(!n)),il.setAttribute("aria-expanded",String(n)),document.documentElement.classList.toggle("is-menu-open",n)}function jg(n){return`${n.replace(/index\.html$/,"").replace(/\/$/,"")}/`}function dp(){const n=jg(window.location.pathname);up.forEach(t=>{t.dataset.path===n?t.setAttribute("aria-current","page"):t.removeAttribute("aria-current")})}il.addEventListener("click",()=>{rl(nl.getAttribute("aria-hidden")==="true")});document.addEventListener("keydown",n=>{n.key==="Escape"&&nl.getAttribute("aria-hidden")==="false"&&(rl(!1),il.focus())});up.forEach(n=>{n.addEventListener("click",()=>rl(!1))});dp();el.hooks.on("visit:start",()=>rl(!1));el.hooks.on("page:view",dp);/*! Tweakpane 4.0.5 (c) 2016 cocopon, licensed under the MIT license. */function ce(n){return n==null}function Uh(n){return n!==null&&typeof n=="object"}function wc(n){return n!==null&&typeof n=="object"}function Qg(n,t){if(n.length!==t.length)return!1;for(let e=0;e<n.length;e++)if(n[e]!==t[e])return!1;return!0}function Rr(n,t){return Array.from(new Set([...Object.keys(n),...Object.keys(t)])).reduce((i,r)=>{const s=n[r],o=t[r];return wc(s)&&wc(o)?Object.assign(Object.assign({},i),{[r]:Rr(s,o)}):Object.assign(Object.assign({},i),{[r]:r in t?o:s})},{})}function Nh(n){return Uh(n)?"target"in n:!1}const tv={alreadydisposed:()=>"View has been already disposed",invalidparams:n=>`Invalid parameters for '${n.name}'`,nomatchingcontroller:n=>`No matching controller for '${n.key}'`,nomatchingview:n=>`No matching view for '${JSON.stringify(n.params)}'`,notbindable:()=>"Value is not bindable",notcompatible:n=>`Not compatible with  plugin '${n.id}'`,propertynotfound:n=>`Property '${n.name}' not found`,shouldneverhappen:()=>"This error should never happen"};class xe{static alreadyDisposed(){return new xe({type:"alreadydisposed"})}static notBindable(){return new xe({type:"notbindable"})}static notCompatible(t,e){return new xe({type:"notcompatible",context:{id:`${t}.${e}`}})}static propertyNotFound(t){return new xe({type:"propertynotfound",context:{name:t}})}static shouldNeverHappen(){return new xe({type:"shouldneverhappen"})}constructor(t){var e;this.message=(e=tv[t.type](t.context))!==null&&e!==void 0?e:"Unexpected error",this.name=this.constructor.name,this.stack=new Error(this.message).stack,this.type=t.type}toString(){return this.message}}class Na{constructor(t,e){this.obj_=t,this.key=e}static isBindable(t){return!(t===null||typeof t!="object"&&typeof t!="function")}read(){return this.obj_[this.key]}write(t){this.obj_[this.key]=t}writeProperty(t,e){const i=this.read();if(!Na.isBindable(i))throw xe.notBindable();if(!(t in i))throw xe.propertyNotFound(t);i[t]=e}}class Le{constructor(){this.observers_={}}on(t,e,i){var r;let s=this.observers_[t];return s||(s=this.observers_[t]=[]),s.push({handler:e,key:(r=i?.key)!==null&&r!==void 0?r:e}),this}off(t,e){const i=this.observers_[t];return i&&(this.observers_[t]=i.filter(r=>r.key!==e)),this}emit(t,e){const i=this.observers_[t];i&&i.forEach(r=>{r.handler(e)})}}class ev{constructor(t,e){var i;this.constraint_=e?.constraint,this.equals_=(i=e?.equals)!==null&&i!==void 0?i:((r,s)=>r===s),this.emitter=new Le,this.rawValue_=t}get constraint(){return this.constraint_}get rawValue(){return this.rawValue_}set rawValue(t){this.setRawValue(t,{forceEmit:!1,last:!0})}setRawValue(t,e){const i=e??{forceEmit:!1,last:!0},r=this.constraint_?this.constraint_.constrain(t):t,s=this.rawValue_;this.equals_(s,r)&&!i.forceEmit||(this.emitter.emit("beforechange",{sender:this}),this.rawValue_=r,this.emitter.emit("change",{options:i,previousRawValue:s,rawValue:r,sender:this}))}}class nv{constructor(t){this.emitter=new Le,this.value_=t}get rawValue(){return this.value_}set rawValue(t){this.setRawValue(t,{forceEmit:!1,last:!0})}setRawValue(t,e){const i=e??{forceEmit:!1,last:!0},r=this.value_;r===t&&!i.forceEmit||(this.emitter.emit("beforechange",{sender:this}),this.value_=t,this.emitter.emit("change",{options:i,previousRawValue:r,rawValue:this.value_,sender:this}))}}class iv{constructor(t){this.emitter=new Le,this.onValueBeforeChange_=this.onValueBeforeChange_.bind(this),this.onValueChange_=this.onValueChange_.bind(this),this.value_=t,this.value_.emitter.on("beforechange",this.onValueBeforeChange_),this.value_.emitter.on("change",this.onValueChange_)}get rawValue(){return this.value_.rawValue}onValueBeforeChange_(t){this.emitter.emit("beforechange",Object.assign(Object.assign({},t),{sender:this}))}onValueChange_(t){this.emitter.emit("change",Object.assign(Object.assign({},t),{sender:this}))}}function ue(n,t){const e=t?.constraint,i=t?.equals;return!e&&!i?new nv(n):new ev(n,t)}function rv(n){return[new iv(n),(t,e)=>{n.setRawValue(t,e)}]}class Ft{constructor(t){this.emitter=new Le,this.valMap_=t;for(const e in this.valMap_)this.valMap_[e].emitter.on("change",()=>{this.emitter.emit("change",{key:e,sender:this})})}static createCore(t){return Object.keys(t).reduce((i,r)=>Object.assign(i,{[r]:ue(t[r])}),{})}static fromObject(t){const e=this.createCore(t);return new Ft(e)}get(t){return this.valMap_[t].rawValue}set(t,e){this.valMap_[t].rawValue=e}value(t){return this.valMap_[t]}}class Mo{constructor(t){this.values=Ft.fromObject({max:t.max,min:t.min})}constrain(t){const e=this.values.get("max"),i=this.values.get("min");return Math.min(Math.max(t,i),e)}}class sv{constructor(t){this.values=Ft.fromObject({max:t.max,min:t.min})}constrain(t){const e=this.values.get("max"),i=this.values.get("min");let r=t;return ce(i)||(r=Math.max(r,i)),ce(e)||(r=Math.min(r,e)),r}}class ov{constructor(t,e=0){this.step=t,this.origin=e}constrain(t){const e=this.origin%this.step,i=Math.round((t-e)/this.step);return e+i*this.step}}class av{constructor(t){this.text=t}evaluate(){return Number(this.text)}toString(){return this.text}}const lv={"**":(n,t)=>Math.pow(n,t),"*":(n,t)=>n*t,"/":(n,t)=>n/t,"%":(n,t)=>n%t,"+":(n,t)=>n+t,"-":(n,t)=>n-t,"<<":(n,t)=>n<<t,">>":(n,t)=>n>>t,">>>":(n,t)=>n>>>t,"&":(n,t)=>n&t,"^":(n,t)=>n^t,"|":(n,t)=>n|t};class cv{constructor(t,e,i){this.left=e,this.operator=t,this.right=i}evaluate(){const t=lv[this.operator];if(!t)throw new Error(`unexpected binary operator: '${this.operator}`);return t(this.left.evaluate(),this.right.evaluate())}toString(){return["b(",this.left.toString(),this.operator,this.right.toString(),")"].join(" ")}}const hv={"+":n=>n,"-":n=>-n,"~":n=>~n};class uv{constructor(t,e){this.operator=t,this.expression=e}evaluate(){const t=hv[this.operator];if(!t)throw new Error(`unexpected unary operator: '${this.operator}`);return t(this.expression.evaluate())}toString(){return["u(",this.operator,this.expression.toString(),")"].join(" ")}}function Oh(n){return(t,e)=>{for(let i=0;i<n.length;i++){const r=n[i](t,e);if(r!=="")return r}return""}}function oo(n,t){var e;const i=n.substr(t).match(/^\s+/);return(e=i&&i[0])!==null&&e!==void 0?e:""}function dv(n,t){const e=n.substr(t,1);return e.match(/^[1-9]$/)?e:""}function ao(n,t){var e;const i=n.substr(t).match(/^[0-9]+/);return(e=i&&i[0])!==null&&e!==void 0?e:""}function fv(n,t){const e=ao(n,t);if(e!=="")return e;const i=n.substr(t,1);if(t+=1,i!=="-"&&i!=="+")return"";const r=ao(n,t);return r===""?"":i+r}function Fh(n,t){const e=n.substr(t,1);if(t+=1,e.toLowerCase()!=="e")return"";const i=fv(n,t);return i===""?"":e+i}function fp(n,t){const e=n.substr(t,1);if(e==="0")return e;const i=dv(n,t);return t+=i.length,i===""?"":i+ao(n,t)}function pv(n,t){const e=fp(n,t);if(t+=e.length,e==="")return"";const i=n.substr(t,1);if(t+=i.length,i!==".")return"";const r=ao(n,t);return t+=r.length,e+i+r+Fh(n,t)}function mv(n,t){const e=n.substr(t,1);if(t+=e.length,e!==".")return"";const i=ao(n,t);return t+=i.length,i===""?"":e+i+Fh(n,t)}function _v(n,t){const e=fp(n,t);return t+=e.length,e===""?"":e+Fh(n,t)}const gv=Oh([pv,mv,_v]);function vv(n,t){var e;const i=n.substr(t).match(/^[01]+/);return(e=i&&i[0])!==null&&e!==void 0?e:""}function xv(n,t){const e=n.substr(t,2);if(t+=e.length,e.toLowerCase()!=="0b")return"";const i=vv(n,t);return i===""?"":e+i}function bv(n,t){var e;const i=n.substr(t).match(/^[0-7]+/);return(e=i&&i[0])!==null&&e!==void 0?e:""}function yv(n,t){const e=n.substr(t,2);if(t+=e.length,e.toLowerCase()!=="0o")return"";const i=bv(n,t);return i===""?"":e+i}function wv(n,t){var e;const i=n.substr(t).match(/^[0-9a-f]+/i);return(e=i&&i[0])!==null&&e!==void 0?e:""}function Sv(n,t){const e=n.substr(t,2);if(t+=e.length,e.toLowerCase()!=="0x")return"";const i=wv(n,t);return i===""?"":e+i}const Ev=Oh([xv,yv,Sv]),Mv=Oh([Ev,gv]);function Tv(n,t){const e=Mv(n,t);return t+=e.length,e===""?null:{evaluable:new av(e),cursor:t}}function Cv(n,t){const e=n.substr(t,1);if(t+=e.length,e!=="(")return null;const i=mp(n,t);if(!i)return null;t=i.cursor,t+=oo(n,t).length;const r=n.substr(t,1);return t+=r.length,r!==")"?null:{evaluable:i.evaluable,cursor:t}}function Av(n,t){var e;return(e=Tv(n,t))!==null&&e!==void 0?e:Cv(n,t)}function pp(n,t){const e=Av(n,t);if(e)return e;const i=n.substr(t,1);if(t+=i.length,i!=="+"&&i!=="-"&&i!=="~")return null;const r=pp(n,t);return r?(t=r.cursor,{cursor:t,evaluable:new uv(i,r.evaluable)}):null}function Pv(n,t,e){e+=oo(t,e).length;const i=n.filter(r=>t.startsWith(r,e))[0];return i?(e+=i.length,e+=oo(t,e).length,{cursor:e,operator:i}):null}function Rv(n,t){return(e,i)=>{const r=n(e,i);if(!r)return null;i=r.cursor;let s=r.evaluable;for(;;){const o=Pv(t,e,i);if(!o)break;i=o.cursor;const a=n(e,i);if(!a)return null;i=a.cursor,s=new cv(o.operator,s,a.evaluable)}return s?{cursor:i,evaluable:s}:null}}const Lv=[["**"],["*","/","%"],["+","-"],["<<",">>>",">>"],["&"],["^"],["|"]].reduce((n,t)=>Rv(n,t),pp);function mp(n,t){return t+=oo(n,t).length,Lv(n,t)}function Dv(n){const t=mp(n,0);return!t||t.cursor+oo(n,t.cursor).length!==n.length?null:t.evaluable}function Ti(n){var t;const e=Dv(n);return(t=e?.evaluate())!==null&&t!==void 0?t:null}function _p(n){if(typeof n=="number")return n;if(typeof n=="string"){const t=Ti(n);if(!ce(t))return t}return 0}function Iv(n){return String(n)}function un(n){return t=>t.toFixed(Math.max(Math.min(n,20),0))}function jt(n,t,e,i,r){const s=(n-t)/(e-t);return i+s*(r-i)}function rd(n){return String(n.toFixed(10)).split(".")[1].replace(/0+$/,"").length}function Ue(n,t,e){return Math.min(Math.max(n,t),e)}function gp(n,t){return(n%t+t)%t}function Uv(n,t){return ce(n.step)?Math.max(rd(t),2):rd(n.step)}function vp(n){var t;return(t=n.step)!==null&&t!==void 0?t:1}function xp(n,t){var e;const i=Math.abs((e=n.step)!==null&&e!==void 0?e:t);return i===0?.1:Math.pow(10,Math.floor(Math.log10(i))-1)}function bp(n,t){return ce(n.step)?null:new ov(n.step,t)}function yp(n){return!ce(n.max)&&!ce(n.min)?new Mo({max:n.max,min:n.min}):!ce(n.max)||!ce(n.min)?new sv({max:n.max,min:n.min}):null}function wp(n,t){var e,i,r;return{formatter:(e=n.format)!==null&&e!==void 0?e:un(Uv(n,t)),keyScale:(i=n.keyScale)!==null&&i!==void 0?i:vp(n),pointerScale:(r=n.pointerScale)!==null&&r!==void 0?r:xp(n,t)}}function Sp(n){return{format:n.optional.function,keyScale:n.optional.number,max:n.optional.number,min:n.optional.number,pointerScale:n.optional.number,step:n.optional.number}}function kh(n){return{constraint:n.constraint,textProps:Ft.fromObject(wp(n.params,n.initialValue))}}class Or{constructor(t){this.controller=t}get element(){return this.controller.view.element}get disabled(){return this.controller.viewProps.get("disabled")}set disabled(t){this.controller.viewProps.set("disabled",t)}get hidden(){return this.controller.viewProps.get("hidden")}set hidden(t){this.controller.viewProps.set("hidden",t)}dispose(){this.controller.viewProps.set("disposed",!0)}importState(t){return this.controller.importState(t)}exportState(){return this.controller.exportState()}}class sl{constructor(t){this.target=t}}class To extends sl{constructor(t,e,i){super(t),this.value=e,this.last=i??!0}}class Nv extends sl{constructor(t,e){super(t),this.expanded=e}}class Ov extends sl{constructor(t,e){super(t),this.index=e}}class Fv extends sl{constructor(t,e){super(t),this.native=e}}class lo extends Or{constructor(t){super(t),this.onValueChange_=this.onValueChange_.bind(this),this.emitter_=new Le,this.controller.value.emitter.on("change",this.onValueChange_)}get label(){return this.controller.labelController.props.get("label")}set label(t){this.controller.labelController.props.set("label",t)}get key(){return this.controller.value.binding.target.key}get tag(){return this.controller.tag}set tag(t){this.controller.tag=t}on(t,e){const i=e.bind(this);return this.emitter_.on(t,r=>{i(r)},{key:e}),this}off(t,e){return this.emitter_.off(t,e),this}refresh(){this.controller.value.fetch()}onValueChange_(t){const e=this.controller.value;this.emitter_.emit("change",new To(this,e.binding.target.read(),t.options.last))}}class kv{constructor(t,e){this.onValueBeforeChange_=this.onValueBeforeChange_.bind(this),this.onValueChange_=this.onValueChange_.bind(this),this.binding=e,this.value_=t,this.value_.emitter.on("beforechange",this.onValueBeforeChange_),this.value_.emitter.on("change",this.onValueChange_),this.emitter=new Le}get rawValue(){return this.value_.rawValue}set rawValue(t){this.value_.rawValue=t}setRawValue(t,e){this.value_.setRawValue(t,e)}fetch(){this.value_.rawValue=this.binding.read()}push(){this.binding.write(this.value_.rawValue)}onValueBeforeChange_(t){this.emitter.emit("beforechange",Object.assign(Object.assign({},t),{sender:this}))}onValueChange_(t){this.push(),this.emitter.emit("change",Object.assign(Object.assign({},t),{sender:this}))}}function Bv(n){if(!("binding"in n))return!1;const t=n.binding;return Nh(t)&&"read"in t&&"write"in t}function Vv(n,t){const i=Object.keys(t).reduce((r,s)=>{if(r===void 0)return;const o=t[s],a=o(n[s]);return a.succeeded?Object.assign(Object.assign({},r),{[s]:a.value}):void 0},{});return i}function zv(n,t){return n.reduce((e,i)=>{if(e===void 0)return;const r=t(i);if(!(!r.succeeded||r.value===void 0))return[...e,r.value]},[])}function Hv(n){return n===null?!1:typeof n=="object"}function ui(n){return t=>e=>{if(!t&&e===void 0)return{succeeded:!1,value:void 0};if(t&&e===void 0)return{succeeded:!0,value:void 0};const i=n(e);return i!==void 0?{succeeded:!0,value:i}:{succeeded:!1,value:void 0}}}function sd(n){return{custom:t=>ui(t)(n),boolean:ui(t=>typeof t=="boolean"?t:void 0)(n),number:ui(t=>typeof t=="number"?t:void 0)(n),string:ui(t=>typeof t=="string"?t:void 0)(n),function:ui(t=>typeof t=="function"?t:void 0)(n),constant:t=>ui(e=>e===t?t:void 0)(n),raw:ui(t=>t)(n),object:t=>ui(e=>{if(Hv(e))return Vv(e,t)})(n),array:t=>ui(e=>{if(Array.isArray(e))return zv(e,t)})(n)}}const Sc={optional:sd(!0),required:sd(!1)};function me(n,t){const e=t(Sc),i=Sc.required.object(e)(n);return i.succeeded?i.value:void 0}function Tn(n,t,e,i){if(t&&!t(n))return!1;const r=me(n,e);return r?i(r):!1}function Cn(n,t){var e;return Rr((e=n?.())!==null&&e!==void 0?e:{},t)}function Mr(n){return"value"in n}function Ep(n){if(!Uh(n)||!("binding"in n))return!1;const t=n.binding;return Nh(t)}const jn="http://www.w3.org/2000/svg";function Oa(n){n.offsetHeight}function Gv(n,t){const e=n.style.transition;n.style.transition="none",t(),n.style.transition=e}function Bh(n){return n.ontouchstart!==void 0}function Wv(){return globalThis}function Xv(){return Wv().document}function qv(n){const t=n.ownerDocument.defaultView;return t&&"document"in t?n.getContext("2d",{willReadFrequently:!0}):null}const Yv={check:'<path d="M2 8l4 4l8 -8"/>',dropdown:'<path d="M5 7h6l-3 3 z"/>',p2dpad:'<path d="M8 4v8"/><path d="M4 8h8"/><circle cx="12" cy="12" r="1.2"/>'};function ol(n,t){const e=n.createElementNS(jn,"svg");return e.innerHTML=Yv[t],e}function Mp(n,t,e){n.insertBefore(t,n.children[e])}function Vh(n){n.parentElement&&n.parentElement.removeChild(n)}function Tp(n){for(;n.children.length>0;)n.removeChild(n.children[0])}function $v(n){for(;n.childNodes.length>0;)n.removeChild(n.childNodes[0])}function Cp(n){return n.relatedTarget?n.relatedTarget:"explicitOriginalTarget"in n?n.explicitOriginalTarget:null}function wi(n,t){n.emitter.on("change",e=>{t(e.rawValue)}),t(n.rawValue)}function si(n,t,e){wi(n.value(t),e)}const Kv="tp";function qt(n){return(e,i)=>[Kv,"-",n,"v",e?`_${e}`:"",i?`-${i}`:""].join("")}const Ns=qt("lbl");function Zv(n,t){const e=n.createDocumentFragment();return t.split(`
`).map(r=>n.createTextNode(r)).forEach((r,s)=>{s>0&&e.appendChild(n.createElement("br")),e.appendChild(r)}),e}class Ap{constructor(t,e){this.element=t.createElement("div"),this.element.classList.add(Ns()),e.viewProps.bindClassModifiers(this.element);const i=t.createElement("div");i.classList.add(Ns("l")),si(e.props,"label",s=>{ce(s)?this.element.classList.add(Ns(void 0,"nol")):(this.element.classList.remove(Ns(void 0,"nol")),$v(i),i.appendChild(Zv(t,s)))}),this.element.appendChild(i),this.labelElement=i;const r=t.createElement("div");r.classList.add(Ns("v")),this.element.appendChild(r),this.valueElement=r}}class Pp{constructor(t,e){this.props=e.props,this.valueController=e.valueController,this.viewProps=e.valueController.viewProps,this.view=new Ap(t,{props:e.props,viewProps:this.viewProps}),this.view.valueElement.appendChild(this.valueController.view.element)}importProps(t){return Tn(t,null,e=>({label:e.optional.string}),e=>(this.props.set("label",e.label),!0))}exportProps(){return Cn(null,{label:this.props.get("label")})}}function Jv(){return["veryfirst","first","last","verylast"]}const od=qt(""),ad={veryfirst:"vfst",first:"fst",last:"lst",verylast:"vlst"};class al{constructor(t){this.parent_=null,this.blade=t.blade,this.view=t.view,this.viewProps=t.viewProps;const e=this.view.element;this.blade.value("positions").emitter.on("change",()=>{Jv().forEach(i=>{e.classList.remove(od(void 0,ad[i]))}),this.blade.get("positions").forEach(i=>{e.classList.add(od(void 0,ad[i]))})}),this.viewProps.handleDispose(()=>{Vh(e)})}get parent(){return this.parent_}set parent(t){this.parent_=t,this.viewProps.set("parent",this.parent_?this.parent_.viewProps:null)}importState(t){return Tn(t,null,e=>({disabled:e.required.boolean,hidden:e.required.boolean}),e=>(this.viewProps.importState(e),!0))}exportState(){return Cn(null,Object.assign({},this.viewProps.exportState()))}}class Lr extends al{constructor(t,e){if(e.value!==e.valueController.value)throw xe.shouldNeverHappen();const i=e.valueController.viewProps,r=new Pp(t,{blade:e.blade,props:e.props,valueController:e.valueController});super(Object.assign(Object.assign({},e),{view:new Ap(t,{props:e.props,viewProps:i}),viewProps:i})),this.labelController=r,this.value=e.value,this.valueController=e.valueController,this.view.valueElement.appendChild(this.valueController.view.element)}importState(t){return Tn(t,e=>{var i,r,s;return super.importState(e)&&this.labelController.importProps(e)&&((s=(r=(i=this.valueController).importProps)===null||r===void 0?void 0:r.call(i,t))!==null&&s!==void 0?s:!0)},e=>({value:e.optional.raw}),e=>(e.value&&(this.value.rawValue=e.value),!0))}exportState(){var t,e,i;return Cn(()=>super.exportState(),Object.assign(Object.assign({value:this.value.rawValue},this.labelController.exportProps()),(i=(e=(t=this.valueController).exportProps)===null||e===void 0?void 0:e.call(t))!==null&&i!==void 0?i:{}))}}function ld(n){const t=Object.assign({},n);return delete t.value,t}class Rp extends Lr{constructor(t,e){super(t,e),this.tag=e.tag}importState(t){return Tn(t,e=>super.importState(ld(t)),e=>({tag:e.optional.string}),e=>(this.tag=e.tag,!0))}exportState(){return Cn(()=>ld(super.exportState()),{binding:{key:this.value.binding.target.key,value:this.value.binding.target.read()},tag:this.tag})}}function jv(n){return Mr(n)&&Ep(n.value)}class Qv extends Rp{importState(t){return Tn(t,e=>super.importState(e),e=>({binding:e.required.object({value:e.required.raw})}),e=>(this.value.binding.inject(e.binding.value),this.value.fetch(),!0))}}function t0(n){return Mr(n)&&Bv(n.value)}function Lp(n,t){for(;n.length<t;)n.push(void 0)}function e0(n){const t=[];return Lp(t,n),t}function n0(n){const t=n.indexOf(void 0);return t<0?n:n.slice(0,t)}function i0(n,t){const e=[...n0(n),t];return e.length>n.length?e.splice(0,e.length-n.length):Lp(e,n.length),e}class r0{constructor(t){this.emitter=new Le,this.onTick_=this.onTick_.bind(this),this.onValueBeforeChange_=this.onValueBeforeChange_.bind(this),this.onValueChange_=this.onValueChange_.bind(this),this.binding=t.binding,this.value_=ue(e0(t.bufferSize)),this.value_.emitter.on("beforechange",this.onValueBeforeChange_),this.value_.emitter.on("change",this.onValueChange_),this.ticker=t.ticker,this.ticker.emitter.on("tick",this.onTick_),this.fetch()}get rawValue(){return this.value_.rawValue}set rawValue(t){this.value_.rawValue=t}setRawValue(t,e){this.value_.setRawValue(t,e)}fetch(){this.value_.rawValue=i0(this.value_.rawValue,this.binding.read())}onTick_(){this.fetch()}onValueBeforeChange_(t){this.emitter.emit("beforechange",Object.assign(Object.assign({},t),{sender:this}))}onValueChange_(t){this.emitter.emit("change",Object.assign(Object.assign({},t),{sender:this}))}}function s0(n){if(!("binding"in n))return!1;const t=n.binding;return Nh(t)&&"read"in t&&!("write"in t)}class o0 extends Rp{exportState(){return Cn(()=>super.exportState(),{binding:{readonly:!0}})}}function a0(n){return Mr(n)&&s0(n.value)}class l0 extends Or{get label(){return this.controller.labelController.props.get("label")}set label(t){this.controller.labelController.props.set("label",t)}get title(){var t;return(t=this.controller.buttonController.props.get("title"))!==null&&t!==void 0?t:""}set title(t){this.controller.buttonController.props.set("title",t)}on(t,e){const i=e.bind(this);return this.controller.buttonController.emitter.on(t,s=>{i(new Fv(this,s.nativeEvent))}),this}off(t,e){return this.controller.buttonController.emitter.off(t,e),this}}function c0(n,t,e){e?n.classList.add(t):n.classList.remove(t)}function As(n,t){return e=>{c0(n,t,e)}}function zh(n,t){wi(n,e=>{t.textContent=e??""})}const Ml=qt("btn");class h0{constructor(t,e){this.element=t.createElement("div"),this.element.classList.add(Ml()),e.viewProps.bindClassModifiers(this.element);const i=t.createElement("button");i.classList.add(Ml("b")),e.viewProps.bindDisabled(i),this.element.appendChild(i),this.buttonElement=i;const r=t.createElement("div");r.classList.add(Ml("t")),zh(e.props.value("title"),r),this.buttonElement.appendChild(r)}}class u0{constructor(t,e){this.emitter=new Le,this.onClick_=this.onClick_.bind(this),this.props=e.props,this.viewProps=e.viewProps,this.view=new h0(t,{props:this.props,viewProps:this.viewProps}),this.view.buttonElement.addEventListener("click",this.onClick_)}importProps(t){return Tn(t,null,e=>({title:e.optional.string}),e=>(this.props.set("title",e.title),!0))}exportProps(){return Cn(null,{title:this.props.get("title")})}onClick_(t){this.emitter.emit("click",{nativeEvent:t,sender:this})}}class cd extends al{constructor(t,e){const i=new u0(t,{props:e.buttonProps,viewProps:e.viewProps}),r=new Pp(t,{blade:e.blade,props:e.labelProps,valueController:i});super({blade:e.blade,view:r.view,viewProps:e.viewProps}),this.buttonController=i,this.labelController=r}importState(t){return Tn(t,e=>super.importState(e)&&this.buttonController.importProps(e)&&this.labelController.importProps(e),()=>({}),()=>!0)}exportState(){return Cn(()=>super.exportState(),Object.assign(Object.assign({},this.buttonController.exportProps()),this.labelController.exportProps()))}}class Dp{constructor(t){const[e,i]=t.split("-"),r=e.split(".");this.major=parseInt(r[0],10),this.minor=parseInt(r[1],10),this.patch=parseInt(r[2],10),this.prerelease=i??null}toString(){const t=[this.major,this.minor,this.patch].join(".");return this.prerelease!==null?[t,this.prerelease].join("-"):t}}const Ps=new Dp("2.0.5");function tn(n){return Object.assign({core:Ps},n)}const d0=tn({id:"button",type:"blade",accept(n){const t=me(n,e=>({title:e.required.string,view:e.required.constant("button"),label:e.optional.string}));return t?{params:t}:null},controller(n){return new cd(n.document,{blade:n.blade,buttonProps:Ft.fromObject({title:n.params.title}),labelProps:Ft.fromObject({label:n.params.label}),viewProps:n.viewProps})},api(n){return n.controller instanceof cd?new l0(n.controller):null}});function f0(n,t){return n.addBlade(Object.assign(Object.assign({},t),{view:"button"}))}function p0(n,t){return n.addBlade(Object.assign(Object.assign({},t),{view:"folder"}))}function m0(n,t){return n.addBlade(Object.assign(Object.assign({},t),{view:"tab"}))}function _0(n){return Uh(n)?"refresh"in n&&typeof n.refresh=="function":!1}function g0(n,t){if(!Na.isBindable(n))throw xe.notBindable();return new Na(n,t)}class v0{constructor(t,e){this.onRackValueChange_=this.onRackValueChange_.bind(this),this.controller_=t,this.emitter_=new Le,this.pool_=e,this.controller_.rack.emitter.on("valuechange",this.onRackValueChange_)}get children(){return this.controller_.rack.children.map(t=>this.pool_.createApi(t))}addBinding(t,e,i){const r=i??{},s=this.controller_.element.ownerDocument,o=this.pool_.createBinding(s,g0(t,e),r),a=this.pool_.createBindingApi(o);return this.add(a,r.index)}addFolder(t){return p0(this,t)}addButton(t){return f0(this,t)}addTab(t){return m0(this,t)}add(t,e){const i=t.controller;return this.controller_.rack.add(i,e),t}remove(t){this.controller_.rack.remove(t.controller)}addBlade(t){const e=this.controller_.element.ownerDocument,i=this.pool_.createBlade(e,t),r=this.pool_.createApi(i);return this.add(r,t.index)}on(t,e){const i=e.bind(this);return this.emitter_.on(t,r=>{i(r)},{key:e}),this}off(t,e){return this.emitter_.off(t,e),this}refresh(){this.children.forEach(t=>{_0(t)&&t.refresh()})}onRackValueChange_(t){const e=t.bladeController,i=this.pool_.createApi(e),r=Ep(e.value)?e.value.binding:null;this.emitter_.emit("change",new To(i,r?r.target.read():e.value.rawValue,t.options.last))}}class Hh extends Or{constructor(t,e){super(t),this.rackApi_=new v0(t.rackController,e)}refresh(){this.rackApi_.refresh()}}class Gh extends al{constructor(t){super({blade:t.blade,view:t.view,viewProps:t.rackController.viewProps}),this.rackController=t.rackController}importState(t){return Tn(t,e=>super.importState(e),e=>({children:e.required.array(e.required.raw)}),e=>this.rackController.rack.children.every((i,r)=>i.importState(e.children[r])))}exportState(){return Cn(()=>super.exportState(),{children:this.rackController.rack.children.map(t=>t.exportState())})}}function Ec(n){return"rackController"in n}class x0{constructor(t){this.emitter=new Le,this.items_=[],this.cache_=new Set,this.onSubListAdd_=this.onSubListAdd_.bind(this),this.onSubListRemove_=this.onSubListRemove_.bind(this),this.extract_=t}get items(){return this.items_}allItems(){return Array.from(this.cache_)}find(t){for(const e of this.allItems())if(t(e))return e;return null}includes(t){return this.cache_.has(t)}add(t,e){if(this.includes(t))throw xe.shouldNeverHappen();const i=e!==void 0?e:this.items_.length;this.items_.splice(i,0,t),this.cache_.add(t);const r=this.extract_(t);r&&(r.emitter.on("add",this.onSubListAdd_),r.emitter.on("remove",this.onSubListRemove_),r.allItems().forEach(s=>{this.cache_.add(s)})),this.emitter.emit("add",{index:i,item:t,root:this,target:this})}remove(t){const e=this.items_.indexOf(t);if(e<0)return;this.items_.splice(e,1),this.cache_.delete(t);const i=this.extract_(t);i&&(i.allItems().forEach(r=>{this.cache_.delete(r)}),i.emitter.off("add",this.onSubListAdd_),i.emitter.off("remove",this.onSubListRemove_)),this.emitter.emit("remove",{index:e,item:t,root:this,target:this})}onSubListAdd_(t){this.cache_.add(t.item),this.emitter.emit("add",{index:t.index,item:t.item,root:this,target:t.target})}onSubListRemove_(t){this.cache_.delete(t.item),this.emitter.emit("remove",{index:t.index,item:t.item,root:this,target:t.target})}}function b0(n,t){for(let e=0;e<n.length;e++){const i=n[e];if(Mr(i)&&i.value===t)return i}return null}function y0(n){return Ec(n)?n.rackController.rack.bcSet_:null}class w0{constructor(t){var e,i;this.emitter=new Le,this.onBladePositionsChange_=this.onBladePositionsChange_.bind(this),this.onSetAdd_=this.onSetAdd_.bind(this),this.onSetRemove_=this.onSetRemove_.bind(this),this.onChildDispose_=this.onChildDispose_.bind(this),this.onChildPositionsChange_=this.onChildPositionsChange_.bind(this),this.onChildValueChange_=this.onChildValueChange_.bind(this),this.onChildViewPropsChange_=this.onChildViewPropsChange_.bind(this),this.onRackLayout_=this.onRackLayout_.bind(this),this.onRackValueChange_=this.onRackValueChange_.bind(this),this.blade_=(e=t.blade)!==null&&e!==void 0?e:null,(i=this.blade_)===null||i===void 0||i.value("positions").emitter.on("change",this.onBladePositionsChange_),this.viewProps=t.viewProps,this.bcSet_=new x0(y0),this.bcSet_.emitter.on("add",this.onSetAdd_),this.bcSet_.emitter.on("remove",this.onSetRemove_)}get children(){return this.bcSet_.items}add(t,e){var i;(i=t.parent)===null||i===void 0||i.remove(t),t.parent=this,this.bcSet_.add(t,e)}remove(t){t.parent=null,this.bcSet_.remove(t)}find(t){return this.bcSet_.allItems().filter(t)}onSetAdd_(t){this.updatePositions_();const e=t.target===t.root;if(this.emitter.emit("add",{bladeController:t.item,index:t.index,root:e,sender:this}),!e)return;const i=t.item;if(i.viewProps.emitter.on("change",this.onChildViewPropsChange_),i.blade.value("positions").emitter.on("change",this.onChildPositionsChange_),i.viewProps.handleDispose(this.onChildDispose_),Mr(i))i.value.emitter.on("change",this.onChildValueChange_);else if(Ec(i)){const r=i.rackController.rack;if(r){const s=r.emitter;s.on("layout",this.onRackLayout_),s.on("valuechange",this.onRackValueChange_)}}}onSetRemove_(t){this.updatePositions_();const e=t.target===t.root;if(this.emitter.emit("remove",{bladeController:t.item,root:e,sender:this}),!e)return;const i=t.item;if(Mr(i))i.value.emitter.off("change",this.onChildValueChange_);else if(Ec(i)){const r=i.rackController.rack;if(r){const s=r.emitter;s.off("layout",this.onRackLayout_),s.off("valuechange",this.onRackValueChange_)}}}updatePositions_(){const t=this.bcSet_.items.filter(r=>!r.viewProps.get("hidden")),e=t[0],i=t[t.length-1];this.bcSet_.items.forEach(r=>{const s=[];r===e&&(s.push("first"),(!this.blade_||this.blade_.get("positions").includes("veryfirst"))&&s.push("veryfirst")),r===i&&(s.push("last"),(!this.blade_||this.blade_.get("positions").includes("verylast"))&&s.push("verylast")),r.blade.set("positions",s)})}onChildPositionsChange_(){this.updatePositions_(),this.emitter.emit("layout",{sender:this})}onChildViewPropsChange_(t){this.updatePositions_(),this.emitter.emit("layout",{sender:this})}onChildDispose_(){this.bcSet_.items.filter(e=>e.viewProps.get("disposed")).forEach(e=>{this.bcSet_.remove(e)})}onChildValueChange_(t){const e=b0(this.find(Mr),t.sender);if(!e)throw xe.alreadyDisposed();this.emitter.emit("valuechange",{bladeController:e,options:t.options,sender:this})}onRackLayout_(t){this.updatePositions_(),this.emitter.emit("layout",{sender:this})}onRackValueChange_(t){this.emitter.emit("valuechange",{bladeController:t.bladeController,options:t.options,sender:this})}onBladePositionsChange_(){this.updatePositions_()}}class Wh{constructor(t){this.onRackAdd_=this.onRackAdd_.bind(this),this.onRackRemove_=this.onRackRemove_.bind(this),this.element=t.element,this.viewProps=t.viewProps;const e=new w0({blade:t.root?void 0:t.blade,viewProps:t.viewProps});e.emitter.on("add",this.onRackAdd_),e.emitter.on("remove",this.onRackRemove_),this.rack=e,this.viewProps.handleDispose(()=>{for(let i=this.rack.children.length-1;i>=0;i--)this.rack.children[i].viewProps.set("disposed",!0)})}onRackAdd_(t){t.root&&Mp(this.element,t.bladeController.view.element,t.index)}onRackRemove_(t){t.root&&Vh(t.bladeController.view.element)}}function Rs(){return new Ft({positions:ue([],{equals:Qg})})}class Co extends Ft{constructor(t){super(t)}static create(t){const e={completed:!0,expanded:t,expandedHeight:null,shouldFixHeight:!1,temporaryExpanded:null},i=Ft.createCore(e);return new Co(i)}get styleExpanded(){var t;return(t=this.get("temporaryExpanded"))!==null&&t!==void 0?t:this.get("expanded")}get styleHeight(){if(!this.styleExpanded)return"0";const t=this.get("expandedHeight");return this.get("shouldFixHeight")&&!ce(t)?`${t}px`:"auto"}bindExpandedClass(t,e){const i=()=>{this.styleExpanded?t.classList.add(e):t.classList.remove(e)};si(this,"expanded",i),si(this,"temporaryExpanded",i)}cleanUpTransition(){this.set("shouldFixHeight",!1),this.set("expandedHeight",null),this.set("completed",!0)}}function S0(n,t){let e=0;return Gv(t,()=>{n.set("expandedHeight",null),n.set("temporaryExpanded",!0),Oa(t),e=t.clientHeight,n.set("temporaryExpanded",null),Oa(t)}),e}function hd(n,t){t.style.height=n.styleHeight}function Xh(n,t){n.value("expanded").emitter.on("beforechange",()=>{if(n.set("completed",!1),ce(n.get("expandedHeight"))){const e=S0(n,t);e>0&&n.set("expandedHeight",e)}n.set("shouldFixHeight",!0),Oa(t)}),n.emitter.on("change",()=>{hd(n,t)}),hd(n,t),t.addEventListener("transitionend",e=>{e.propertyName==="height"&&n.cleanUpTransition()})}class Ip extends Hh{constructor(t,e){super(t,e),this.emitter_=new Le,this.controller.foldable.value("expanded").emitter.on("change",i=>{this.emitter_.emit("fold",new Nv(this,i.sender.rawValue))}),this.rackApi_.on("change",i=>{this.emitter_.emit("change",i)})}get expanded(){return this.controller.foldable.get("expanded")}set expanded(t){this.controller.foldable.set("expanded",t)}get title(){return this.controller.props.get("title")}set title(t){this.controller.props.set("title",t)}get children(){return this.rackApi_.children}addBinding(t,e,i){return this.rackApi_.addBinding(t,e,i)}addFolder(t){return this.rackApi_.addFolder(t)}addButton(t){return this.rackApi_.addButton(t)}addTab(t){return this.rackApi_.addTab(t)}add(t,e){return this.rackApi_.add(t,e)}remove(t){this.rackApi_.remove(t)}addBlade(t){return this.rackApi_.addBlade(t)}on(t,e){const i=e.bind(this);return this.emitter_.on(t,r=>{i(r)},{key:e}),this}off(t,e){return this.emitter_.off(t,e),this}}const Up=qt("cnt");class E0{constructor(t,e){var i;this.className_=qt((i=e.viewName)!==null&&i!==void 0?i:"fld"),this.element=t.createElement("div"),this.element.classList.add(this.className_(),Up()),e.viewProps.bindClassModifiers(this.element),this.foldable_=e.foldable,this.foldable_.bindExpandedClass(this.element,this.className_(void 0,"expanded")),si(this.foldable_,"completed",As(this.element,this.className_(void 0,"cpl")));const r=t.createElement("button");r.classList.add(this.className_("b")),si(e.props,"title",c=>{ce(c)?this.element.classList.add(this.className_(void 0,"not")):this.element.classList.remove(this.className_(void 0,"not"))}),e.viewProps.bindDisabled(r),this.element.appendChild(r),this.buttonElement=r;const s=t.createElement("div");s.classList.add(this.className_("i")),this.element.appendChild(s);const o=t.createElement("div");o.classList.add(this.className_("t")),zh(e.props.value("title"),o),this.buttonElement.appendChild(o),this.titleElement=o;const a=t.createElement("div");a.classList.add(this.className_("m")),this.buttonElement.appendChild(a);const l=t.createElement("div");l.classList.add(this.className_("c")),this.element.appendChild(l),this.containerElement=l}}class Mc extends Gh{constructor(t,e){var i;const r=Co.create((i=e.expanded)!==null&&i!==void 0?i:!0),s=new E0(t,{foldable:r,props:e.props,viewName:e.root?"rot":void 0,viewProps:e.viewProps});super(Object.assign(Object.assign({},e),{rackController:new Wh({blade:e.blade,element:s.containerElement,root:e.root,viewProps:e.viewProps}),view:s})),this.onTitleClick_=this.onTitleClick_.bind(this),this.props=e.props,this.foldable=r,Xh(this.foldable,this.view.containerElement),this.rackController.rack.emitter.on("add",()=>{this.foldable.cleanUpTransition()}),this.rackController.rack.emitter.on("remove",()=>{this.foldable.cleanUpTransition()}),this.view.buttonElement.addEventListener("click",this.onTitleClick_)}get document(){return this.view.element.ownerDocument}importState(t){return Tn(t,e=>super.importState(e),e=>({expanded:e.required.boolean,title:e.optional.string}),e=>(this.foldable.set("expanded",e.expanded),this.props.set("title",e.title),!0))}exportState(){return Cn(()=>super.exportState(),{expanded:this.foldable.get("expanded"),title:this.props.get("title")})}onTitleClick_(){this.foldable.set("expanded",!this.foldable.get("expanded"))}}const M0=tn({id:"folder",type:"blade",accept(n){const t=me(n,e=>({title:e.required.string,view:e.required.constant("folder"),expanded:e.optional.boolean}));return t?{params:t}:null},controller(n){return new Mc(n.document,{blade:n.blade,expanded:n.params.expanded,props:Ft.fromObject({title:n.params.title}),viewProps:n.viewProps})},api(n){return n.controller instanceof Mc?new Ip(n.controller,n.pool):null}}),T0=qt("");function ud(n,t){return As(n,T0(void 0,t))}class Di extends Ft{constructor(t){var e;super(t),this.onDisabledChange_=this.onDisabledChange_.bind(this),this.onParentChange_=this.onParentChange_.bind(this),this.onParentGlobalDisabledChange_=this.onParentGlobalDisabledChange_.bind(this),[this.globalDisabled_,this.setGlobalDisabled_]=rv(ue(this.getGlobalDisabled_())),this.value("disabled").emitter.on("change",this.onDisabledChange_),this.value("parent").emitter.on("change",this.onParentChange_),(e=this.get("parent"))===null||e===void 0||e.globalDisabled.emitter.on("change",this.onParentGlobalDisabledChange_)}static create(t){var e,i,r;const s=t??{};return new Di(Ft.createCore({disabled:(e=s.disabled)!==null&&e!==void 0?e:!1,disposed:!1,hidden:(i=s.hidden)!==null&&i!==void 0?i:!1,parent:(r=s.parent)!==null&&r!==void 0?r:null}))}get globalDisabled(){return this.globalDisabled_}bindClassModifiers(t){wi(this.globalDisabled_,ud(t,"disabled")),si(this,"hidden",ud(t,"hidden"))}bindDisabled(t){wi(this.globalDisabled_,e=>{t.disabled=e})}bindTabIndex(t){wi(this.globalDisabled_,e=>{t.tabIndex=e?-1:0})}handleDispose(t){this.value("disposed").emitter.on("change",e=>{e&&t()})}importState(t){this.set("disabled",t.disabled),this.set("hidden",t.hidden)}exportState(){return{disabled:this.get("disabled"),hidden:this.get("hidden")}}getGlobalDisabled_(){const t=this.get("parent");return(t?t.globalDisabled.rawValue:!1)||this.get("disabled")}updateGlobalDisabled_(){this.setGlobalDisabled_(this.getGlobalDisabled_())}onDisabledChange_(){this.updateGlobalDisabled_()}onParentGlobalDisabledChange_(){this.updateGlobalDisabled_()}onParentChange_(t){var e;const i=t.previousRawValue;i?.globalDisabled.emitter.off("change",this.onParentGlobalDisabledChange_),(e=this.get("parent"))===null||e===void 0||e.globalDisabled.emitter.on("change",this.onParentGlobalDisabledChange_),this.updateGlobalDisabled_()}}const dd=qt("tbp");class C0{constructor(t,e){this.element=t.createElement("div"),this.element.classList.add(dd()),e.viewProps.bindClassModifiers(this.element);const i=t.createElement("div");i.classList.add(dd("c")),this.element.appendChild(i),this.containerElement=i}}const Os=qt("tbi");class A0{constructor(t,e){this.element=t.createElement("div"),this.element.classList.add(Os()),e.viewProps.bindClassModifiers(this.element),si(e.props,"selected",s=>{s?this.element.classList.add(Os(void 0,"sel")):this.element.classList.remove(Os(void 0,"sel"))});const i=t.createElement("button");i.classList.add(Os("b")),e.viewProps.bindDisabled(i),this.element.appendChild(i),this.buttonElement=i;const r=t.createElement("div");r.classList.add(Os("t")),zh(e.props.value("title"),r),this.buttonElement.appendChild(r),this.titleElement=r}}class P0{constructor(t,e){this.emitter=new Le,this.onClick_=this.onClick_.bind(this),this.props=e.props,this.viewProps=e.viewProps,this.view=new A0(t,{props:e.props,viewProps:e.viewProps}),this.view.buttonElement.addEventListener("click",this.onClick_)}onClick_(){this.emitter.emit("click",{sender:this})}}class Tc extends Gh{constructor(t,e){const i=new C0(t,{viewProps:e.viewProps});super(Object.assign(Object.assign({},e),{rackController:new Wh({blade:e.blade,element:i.containerElement,viewProps:e.viewProps}),view:i})),this.onItemClick_=this.onItemClick_.bind(this),this.ic_=new P0(t,{props:e.itemProps,viewProps:Di.create()}),this.ic_.emitter.on("click",this.onItemClick_),this.props=e.props,si(this.props,"selected",r=>{this.itemController.props.set("selected",r),this.viewProps.set("hidden",!r)})}get itemController(){return this.ic_}importState(t){return Tn(t,e=>super.importState(e),e=>({selected:e.required.boolean,title:e.required.string}),e=>(this.ic_.props.set("selected",e.selected),this.ic_.props.set("title",e.title),!0))}exportState(){return Cn(()=>super.exportState(),{selected:this.ic_.props.get("selected"),title:this.ic_.props.get("title")})}onItemClick_(){this.props.set("selected",!0)}}class R0 extends Hh{constructor(t,e){super(t,e),this.emitter_=new Le,this.onSelect_=this.onSelect_.bind(this),this.pool_=e,this.rackApi_.on("change",i=>{this.emitter_.emit("change",i)}),this.controller.tab.selectedIndex.emitter.on("change",this.onSelect_)}get pages(){return this.rackApi_.children}addPage(t){const e=this.controller.view.element.ownerDocument,i=new Tc(e,{blade:Rs(),itemProps:Ft.fromObject({selected:!1,title:t.title}),props:Ft.fromObject({selected:!1}),viewProps:Di.create()}),r=this.pool_.createApi(i);return this.rackApi_.add(r,t.index)}removePage(t){this.rackApi_.remove(this.rackApi_.children[t])}on(t,e){const i=e.bind(this);return this.emitter_.on(t,r=>{i(r)},{key:e}),this}off(t,e){return this.emitter_.off(t,e),this}onSelect_(t){this.emitter_.emit("select",new Ov(this,t.rawValue))}}class L0 extends Hh{get title(){var t;return(t=this.controller.itemController.props.get("title"))!==null&&t!==void 0?t:""}set title(t){this.controller.itemController.props.set("title",t)}get selected(){return this.controller.props.get("selected")}set selected(t){this.controller.props.set("selected",t)}get children(){return this.rackApi_.children}addButton(t){return this.rackApi_.addButton(t)}addFolder(t){return this.rackApi_.addFolder(t)}addTab(t){return this.rackApi_.addTab(t)}add(t,e){this.rackApi_.add(t,e)}remove(t){this.rackApi_.remove(t)}addBinding(t,e,i){return this.rackApi_.addBinding(t,e,i)}addBlade(t){return this.rackApi_.addBlade(t)}}const fd=-1;class D0{constructor(){this.onItemSelectedChange_=this.onItemSelectedChange_.bind(this),this.empty=ue(!0),this.selectedIndex=ue(fd),this.items_=[]}add(t,e){const i=e??this.items_.length;this.items_.splice(i,0,t),t.emitter.on("change",this.onItemSelectedChange_),this.keepSelection_()}remove(t){const e=this.items_.indexOf(t);e<0||(this.items_.splice(e,1),t.emitter.off("change",this.onItemSelectedChange_),this.keepSelection_())}keepSelection_(){if(this.items_.length===0){this.selectedIndex.rawValue=fd,this.empty.rawValue=!0;return}const t=this.items_.findIndex(e=>e.rawValue);t<0?(this.items_.forEach((e,i)=>{e.rawValue=i===0}),this.selectedIndex.rawValue=0):(this.items_.forEach((e,i)=>{e.rawValue=i===t}),this.selectedIndex.rawValue=t),this.empty.rawValue=!1}onItemSelectedChange_(t){if(t.rawValue){const e=this.items_.findIndex(i=>i===t.sender);this.items_.forEach((i,r)=>{i.rawValue=r===e}),this.selectedIndex.rawValue=e}else this.keepSelection_()}}const Fs=qt("tab");class I0{constructor(t,e){this.element=t.createElement("div"),this.element.classList.add(Fs(),Up()),e.viewProps.bindClassModifiers(this.element),wi(e.empty,As(this.element,Fs(void 0,"nop")));const i=t.createElement("div");i.classList.add(Fs("t")),this.element.appendChild(i),this.itemsElement=i;const r=t.createElement("div");r.classList.add(Fs("i")),this.element.appendChild(r);const s=t.createElement("div");s.classList.add(Fs("c")),this.element.appendChild(s),this.contentsElement=s}}class pd extends Gh{constructor(t,e){const i=new D0,r=new I0(t,{empty:i.empty,viewProps:e.viewProps});super({blade:e.blade,rackController:new Wh({blade:e.blade,element:r.contentsElement,viewProps:e.viewProps}),view:r}),this.onRackAdd_=this.onRackAdd_.bind(this),this.onRackRemove_=this.onRackRemove_.bind(this);const s=this.rackController.rack;s.emitter.on("add",this.onRackAdd_),s.emitter.on("remove",this.onRackRemove_),this.tab=i}add(t,e){this.rackController.rack.add(t,e)}remove(t){this.rackController.rack.remove(this.rackController.rack.children[t])}onRackAdd_(t){if(!t.root)return;const e=t.bladeController;Mp(this.view.itemsElement,e.itemController.view.element,t.index),e.itemController.viewProps.set("parent",this.viewProps),this.tab.add(e.props.value("selected"))}onRackRemove_(t){if(!t.root)return;const e=t.bladeController;Vh(e.itemController.view.element),e.itemController.viewProps.set("parent",null),this.tab.remove(e.props.value("selected"))}}const Np=tn({id:"tab",type:"blade",accept(n){const t=me(n,e=>({pages:e.required.array(e.required.object({title:e.required.string})),view:e.required.constant("tab")}));return!t||t.pages.length===0?null:{params:t}},controller(n){const t=new pd(n.document,{blade:n.blade,viewProps:n.viewProps});return n.params.pages.forEach(e=>{const i=new Tc(n.document,{blade:Rs(),itemProps:Ft.fromObject({selected:!1,title:e.title}),props:Ft.fromObject({selected:!1}),viewProps:Di.create()});t.add(i)}),t},api(n){return n.controller instanceof pd?new R0(n.controller,n.pool):n.controller instanceof Tc?new L0(n.controller,n.pool):null}});function U0(n,t){const e=n.accept(t.params);if(!e)return null;const i=me(t.params,r=>({disabled:r.optional.boolean,hidden:r.optional.boolean}));return n.controller({blade:Rs(),document:t.document,params:Object.assign(Object.assign({},e.params),{disabled:i?.disabled,hidden:i?.hidden}),viewProps:Di.create({disabled:i?.disabled,hidden:i?.hidden})})}class qh extends lo{get options(){return this.controller.valueController.props.get("options")}set options(t){this.controller.valueController.props.set("options",t)}}class N0{constructor(){this.disabled=!1,this.emitter=new Le}dispose(){}tick(){this.disabled||this.emitter.emit("tick",{sender:this})}}class O0{constructor(t,e){this.disabled_=!1,this.timerId_=null,this.onTick_=this.onTick_.bind(this),this.doc_=t,this.emitter=new Le,this.interval_=e,this.setTimer_()}get disabled(){return this.disabled_}set disabled(t){this.disabled_=t,this.disabled_?this.clearTimer_():this.setTimer_()}dispose(){this.clearTimer_()}clearTimer_(){if(this.timerId_===null)return;const t=this.doc_.defaultView;t&&t.clearInterval(this.timerId_),this.timerId_=null}setTimer_(){if(this.clearTimer_(),this.interval_<=0)return;const t=this.doc_.defaultView;t&&(this.timerId_=t.setInterval(this.onTick_,this.interval_))}onTick_(){this.disabled_||this.emitter.emit("tick",{sender:this})}}class Ao{constructor(t){this.constraints=t}constrain(t){return this.constraints.reduce((e,i)=>i.constrain(e),t)}}function Fa(n,t){if(n instanceof t)return n;if(n instanceof Ao){const e=n.constraints.reduce((i,r)=>i||(r instanceof t?r:null),null);if(e)return e}return null}class Po{constructor(t){this.values=Ft.fromObject({options:t})}constrain(t){const e=this.values.get("options");return e.length===0||e.filter(r=>r.value===t).length>0?t:e[0].value}}function Ro(n){var t;const e=Sc;if(Array.isArray(n))return(t=me({items:n},i=>({items:i.required.array(i.required.object({text:i.required.string,value:i.required.raw}))})))===null||t===void 0?void 0:t.items;if(typeof n=="object")return e.required.raw(n).value}function Yh(n){if(Array.isArray(n))return n;const t=[];return Object.keys(n).forEach(e=>{t.push({text:e,value:n[e]})}),t}function $h(n){return ce(n)?null:new Po(Yh(n))}const Tl=qt("lst");class F0{constructor(t,e){this.onValueChange_=this.onValueChange_.bind(this),this.props_=e.props,this.element=t.createElement("div"),this.element.classList.add(Tl()),e.viewProps.bindClassModifiers(this.element);const i=t.createElement("select");i.classList.add(Tl("s")),e.viewProps.bindDisabled(i),this.element.appendChild(i),this.selectElement=i;const r=t.createElement("div");r.classList.add(Tl("m")),r.appendChild(ol(t,"dropdown")),this.element.appendChild(r),e.value.emitter.on("change",this.onValueChange_),this.value_=e.value,si(this.props_,"options",s=>{Tp(this.selectElement),s.forEach(o=>{const a=t.createElement("option");a.textContent=o.text,this.selectElement.appendChild(a)}),this.update_()})}update_(){const t=this.props_.get("options").map(e=>e.value);this.selectElement.selectedIndex=t.indexOf(this.value_.rawValue)}onValueChange_(){this.update_()}}class ir{constructor(t,e){this.onSelectChange_=this.onSelectChange_.bind(this),this.props=e.props,this.value=e.value,this.viewProps=e.viewProps,this.view=new F0(t,{props:this.props,value:this.value,viewProps:this.viewProps}),this.view.selectElement.addEventListener("change",this.onSelectChange_)}onSelectChange_(t){const e=t.currentTarget;this.value.rawValue=this.props.get("options")[e.selectedIndex].value}importProps(t){return Tn(t,null,e=>({options:e.required.custom(Ro)}),e=>(this.props.set("options",Yh(e.options)),!0))}exportProps(){return Cn(null,{options:this.props.get("options")})}}const md=qt("pop");class k0{constructor(t,e){this.element=t.createElement("div"),this.element.classList.add(md()),e.viewProps.bindClassModifiers(this.element),wi(e.shows,As(this.element,md(void 0,"v")))}}class Op{constructor(t,e){this.shows=ue(!1),this.viewProps=e.viewProps,this.view=new k0(t,{shows:this.shows,viewProps:this.viewProps})}}const _d=qt("txt");class B0{constructor(t,e){this.onChange_=this.onChange_.bind(this),this.element=t.createElement("div"),this.element.classList.add(_d()),e.viewProps.bindClassModifiers(this.element),this.props_=e.props,this.props_.emitter.on("change",this.onChange_);const i=t.createElement("input");i.classList.add(_d("i")),i.type="text",e.viewProps.bindDisabled(i),this.element.appendChild(i),this.inputElement=i,e.value.emitter.on("change",this.onChange_),this.value_=e.value,this.refresh()}refresh(){const t=this.props_.get("formatter");this.inputElement.value=t(this.value_.rawValue)}onChange_(){this.refresh()}}class co{constructor(t,e){this.onInputChange_=this.onInputChange_.bind(this),this.parser_=e.parser,this.props=e.props,this.value=e.value,this.viewProps=e.viewProps,this.view=new B0(t,{props:e.props,value:this.value,viewProps:this.viewProps}),this.view.inputElement.addEventListener("change",this.onInputChange_)}onInputChange_(t){const i=t.currentTarget.value,r=this.parser_(i);ce(r)||(this.value.rawValue=r),this.view.refresh()}}function V0(n){return String(n)}function Fp(n){return n==="false"?!1:!!n}function gd(n){return V0(n)}function z0(n){return t=>n.reduce((e,i)=>e!==null?e:i(t),null)}const H0=un(0);function ka(n){return H0(n)+"%"}function kp(n){return String(n)}function Cc(n){return n}function Ls({primary:n,secondary:t,forward:e,backward:i}){let r=!1;function s(o){r||(r=!0,o(),r=!1)}n.emitter.on("change",o=>{s(()=>{t.setRawValue(e(n.rawValue,t.rawValue),o.options)})}),t.emitter.on("change",o=>{s(()=>{n.setRawValue(i(n.rawValue,t.rawValue),o.options)}),s(()=>{t.setRawValue(e(n.rawValue,t.rawValue),o.options)})}),s(()=>{t.setRawValue(e(n.rawValue,t.rawValue),{forceEmit:!1,last:!0})})}function sn(n,t){const e=n*(t.altKey?.1:1)*(t.shiftKey?10:1);return t.upKey?+e:t.downKey?-e:0}function ho(n){return{altKey:n.altKey,downKey:n.key==="ArrowDown",shiftKey:n.shiftKey,upKey:n.key==="ArrowUp"}}function Ci(n){return{altKey:n.altKey,downKey:n.key==="ArrowLeft",shiftKey:n.shiftKey,upKey:n.key==="ArrowRight"}}function G0(n){return n==="ArrowUp"||n==="ArrowDown"}function Bp(n){return G0(n)||n==="ArrowLeft"||n==="ArrowRight"}function Cl(n,t){var e,i;const r=t.ownerDocument.defaultView,s=t.getBoundingClientRect();return{x:n.pageX-(((e=r&&r.scrollX)!==null&&e!==void 0?e:0)+s.left),y:n.pageY-(((i=r&&r.scrollY)!==null&&i!==void 0?i:0)+s.top)}}class Fr{constructor(t){this.lastTouch_=null,this.onDocumentMouseMove_=this.onDocumentMouseMove_.bind(this),this.onDocumentMouseUp_=this.onDocumentMouseUp_.bind(this),this.onMouseDown_=this.onMouseDown_.bind(this),this.onTouchEnd_=this.onTouchEnd_.bind(this),this.onTouchMove_=this.onTouchMove_.bind(this),this.onTouchStart_=this.onTouchStart_.bind(this),this.elem_=t,this.emitter=new Le,t.addEventListener("touchstart",this.onTouchStart_,{passive:!1}),t.addEventListener("touchmove",this.onTouchMove_,{passive:!0}),t.addEventListener("touchend",this.onTouchEnd_),t.addEventListener("mousedown",this.onMouseDown_)}computePosition_(t){const e=this.elem_.getBoundingClientRect();return{bounds:{width:e.width,height:e.height},point:t?{x:t.x,y:t.y}:null}}onMouseDown_(t){var e;t.preventDefault(),(e=t.currentTarget)===null||e===void 0||e.focus();const i=this.elem_.ownerDocument;i.addEventListener("mousemove",this.onDocumentMouseMove_),i.addEventListener("mouseup",this.onDocumentMouseUp_),this.emitter.emit("down",{altKey:t.altKey,data:this.computePosition_(Cl(t,this.elem_)),sender:this,shiftKey:t.shiftKey})}onDocumentMouseMove_(t){this.emitter.emit("move",{altKey:t.altKey,data:this.computePosition_(Cl(t,this.elem_)),sender:this,shiftKey:t.shiftKey})}onDocumentMouseUp_(t){const e=this.elem_.ownerDocument;e.removeEventListener("mousemove",this.onDocumentMouseMove_),e.removeEventListener("mouseup",this.onDocumentMouseUp_),this.emitter.emit("up",{altKey:t.altKey,data:this.computePosition_(Cl(t,this.elem_)),sender:this,shiftKey:t.shiftKey})}onTouchStart_(t){t.preventDefault();const e=t.targetTouches.item(0),i=this.elem_.getBoundingClientRect();this.emitter.emit("down",{altKey:t.altKey,data:this.computePosition_(e?{x:e.clientX-i.left,y:e.clientY-i.top}:void 0),sender:this,shiftKey:t.shiftKey}),this.lastTouch_=e}onTouchMove_(t){const e=t.targetTouches.item(0),i=this.elem_.getBoundingClientRect();this.emitter.emit("move",{altKey:t.altKey,data:this.computePosition_(e?{x:e.clientX-i.left,y:e.clientY-i.top}:void 0),sender:this,shiftKey:t.shiftKey}),this.lastTouch_=e}onTouchEnd_(t){var e;const i=(e=t.targetTouches.item(0))!==null&&e!==void 0?e:this.lastTouch_,r=this.elem_.getBoundingClientRect();this.emitter.emit("up",{altKey:t.altKey,data:this.computePosition_(i?{x:i.clientX-r.left,y:i.clientY-r.top}:void 0),sender:this,shiftKey:t.shiftKey})}}const Pn=qt("txt");class W0{constructor(t,e){this.onChange_=this.onChange_.bind(this),this.props_=e.props,this.props_.emitter.on("change",this.onChange_),this.element=t.createElement("div"),this.element.classList.add(Pn(),Pn(void 0,"num")),e.arrayPosition&&this.element.classList.add(Pn(void 0,e.arrayPosition)),e.viewProps.bindClassModifiers(this.element);const i=t.createElement("input");i.classList.add(Pn("i")),i.type="text",e.viewProps.bindDisabled(i),this.element.appendChild(i),this.inputElement=i,this.onDraggingChange_=this.onDraggingChange_.bind(this),this.dragging_=e.dragging,this.dragging_.emitter.on("change",this.onDraggingChange_),this.element.classList.add(Pn()),this.inputElement.classList.add(Pn("i"));const r=t.createElement("div");r.classList.add(Pn("k")),this.element.appendChild(r),this.knobElement=r;const s=t.createElementNS(jn,"svg");s.classList.add(Pn("g")),this.knobElement.appendChild(s);const o=t.createElementNS(jn,"path");o.classList.add(Pn("gb")),s.appendChild(o),this.guideBodyElem_=o;const a=t.createElementNS(jn,"path");a.classList.add(Pn("gh")),s.appendChild(a),this.guideHeadElem_=a;const l=t.createElement("div");l.classList.add(qt("tt")()),this.knobElement.appendChild(l),this.tooltipElem_=l,e.value.emitter.on("change",this.onChange_),this.value=e.value,this.refresh()}onDraggingChange_(t){if(t.rawValue===null){this.element.classList.remove(Pn(void 0,"drg"));return}this.element.classList.add(Pn(void 0,"drg"));const e=t.rawValue/this.props_.get("pointerScale"),i=e+(e>0?-1:e<0?1:0),r=Ue(-i,-4,4);this.guideHeadElem_.setAttributeNS(null,"d",[`M ${i+r},0 L${i},4 L${i+r},8`,`M ${e},-1 L${e},9`].join(" ")),this.guideBodyElem_.setAttributeNS(null,"d",`M 0,4 L${e},4`);const s=this.props_.get("formatter");this.tooltipElem_.textContent=s(this.value.rawValue),this.tooltipElem_.style.left=`${e}px`}refresh(){const t=this.props_.get("formatter");this.inputElement.value=t(this.value.rawValue)}onChange_(){this.refresh()}}class Lo{constructor(t,e){var i;this.originRawValue_=0,this.onInputChange_=this.onInputChange_.bind(this),this.onInputKeyDown_=this.onInputKeyDown_.bind(this),this.onInputKeyUp_=this.onInputKeyUp_.bind(this),this.onPointerDown_=this.onPointerDown_.bind(this),this.onPointerMove_=this.onPointerMove_.bind(this),this.onPointerUp_=this.onPointerUp_.bind(this),this.parser_=e.parser,this.props=e.props,this.sliderProps_=(i=e.sliderProps)!==null&&i!==void 0?i:null,this.value=e.value,this.viewProps=e.viewProps,this.dragging_=ue(null),this.view=new W0(t,{arrayPosition:e.arrayPosition,dragging:this.dragging_,props:this.props,value:this.value,viewProps:this.viewProps}),this.view.inputElement.addEventListener("change",this.onInputChange_),this.view.inputElement.addEventListener("keydown",this.onInputKeyDown_),this.view.inputElement.addEventListener("keyup",this.onInputKeyUp_);const r=new Fr(this.view.knobElement);r.emitter.on("down",this.onPointerDown_),r.emitter.on("move",this.onPointerMove_),r.emitter.on("up",this.onPointerUp_)}constrainValue_(t){var e,i;const r=(e=this.sliderProps_)===null||e===void 0?void 0:e.get("min"),s=(i=this.sliderProps_)===null||i===void 0?void 0:i.get("max");let o=t;return r!==void 0&&(o=Math.max(o,r)),s!==void 0&&(o=Math.min(o,s)),o}onInputChange_(t){const i=t.currentTarget.value,r=this.parser_(i);ce(r)||(this.value.rawValue=this.constrainValue_(r)),this.view.refresh()}onInputKeyDown_(t){const e=sn(this.props.get("keyScale"),ho(t));e!==0&&this.value.setRawValue(this.constrainValue_(this.value.rawValue+e),{forceEmit:!1,last:!1})}onInputKeyUp_(t){sn(this.props.get("keyScale"),ho(t))!==0&&this.value.setRawValue(this.value.rawValue,{forceEmit:!0,last:!0})}onPointerDown_(){this.originRawValue_=this.value.rawValue,this.dragging_.rawValue=0}computeDraggingValue_(t){if(!t.point)return null;const e=t.point.x-t.bounds.width/2;return this.constrainValue_(this.originRawValue_+e*this.props.get("pointerScale"))}onPointerMove_(t){const e=this.computeDraggingValue_(t.data);e!==null&&(this.value.setRawValue(e,{forceEmit:!1,last:!1}),this.dragging_.rawValue=this.value.rawValue-this.originRawValue_)}onPointerUp_(t){const e=this.computeDraggingValue_(t.data);e!==null&&(this.value.setRawValue(e,{forceEmit:!0,last:!0}),this.dragging_.rawValue=null)}}const Al=qt("sld");class X0{constructor(t,e){this.onChange_=this.onChange_.bind(this),this.props_=e.props,this.props_.emitter.on("change",this.onChange_),this.element=t.createElement("div"),this.element.classList.add(Al()),e.viewProps.bindClassModifiers(this.element);const i=t.createElement("div");i.classList.add(Al("t")),e.viewProps.bindTabIndex(i),this.element.appendChild(i),this.trackElement=i;const r=t.createElement("div");r.classList.add(Al("k")),this.trackElement.appendChild(r),this.knobElement=r,e.value.emitter.on("change",this.onChange_),this.value=e.value,this.update_()}update_(){const t=Ue(jt(this.value.rawValue,this.props_.get("min"),this.props_.get("max"),0,100),0,100);this.knobElement.style.width=`${t}%`}onChange_(){this.update_()}}class q0{constructor(t,e){this.onKeyDown_=this.onKeyDown_.bind(this),this.onKeyUp_=this.onKeyUp_.bind(this),this.onPointerDownOrMove_=this.onPointerDownOrMove_.bind(this),this.onPointerUp_=this.onPointerUp_.bind(this),this.value=e.value,this.viewProps=e.viewProps,this.props=e.props,this.view=new X0(t,{props:this.props,value:this.value,viewProps:this.viewProps}),this.ptHandler_=new Fr(this.view.trackElement),this.ptHandler_.emitter.on("down",this.onPointerDownOrMove_),this.ptHandler_.emitter.on("move",this.onPointerDownOrMove_),this.ptHandler_.emitter.on("up",this.onPointerUp_),this.view.trackElement.addEventListener("keydown",this.onKeyDown_),this.view.trackElement.addEventListener("keyup",this.onKeyUp_)}handlePointerEvent_(t,e){t.point&&this.value.setRawValue(jt(Ue(t.point.x,0,t.bounds.width),0,t.bounds.width,this.props.get("min"),this.props.get("max")),e)}onPointerDownOrMove_(t){this.handlePointerEvent_(t.data,{forceEmit:!1,last:!1})}onPointerUp_(t){this.handlePointerEvent_(t.data,{forceEmit:!0,last:!0})}onKeyDown_(t){const e=sn(this.props.get("keyScale"),Ci(t));e!==0&&this.value.setRawValue(this.value.rawValue+e,{forceEmit:!1,last:!1})}onKeyUp_(t){sn(this.props.get("keyScale"),Ci(t))!==0&&this.value.setRawValue(this.value.rawValue,{forceEmit:!0,last:!0})}}const Pl=qt("sldtxt");class Y0{constructor(t,e){this.element=t.createElement("div"),this.element.classList.add(Pl());const i=t.createElement("div");i.classList.add(Pl("s")),this.sliderView_=e.sliderView,i.appendChild(this.sliderView_.element),this.element.appendChild(i);const r=t.createElement("div");r.classList.add(Pl("t")),this.textView_=e.textView,r.appendChild(this.textView_.element),this.element.appendChild(r)}}class Ba{constructor(t,e){this.value=e.value,this.viewProps=e.viewProps,this.sliderC_=new q0(t,{props:e.sliderProps,value:e.value,viewProps:this.viewProps}),this.textC_=new Lo(t,{parser:e.parser,props:e.textProps,sliderProps:e.sliderProps,value:e.value,viewProps:e.viewProps}),this.view=new Y0(t,{sliderView:this.sliderC_.view,textView:this.textC_.view})}get sliderController(){return this.sliderC_}get textController(){return this.textC_}importProps(t){return Tn(t,null,e=>({max:e.required.number,min:e.required.number}),e=>{const i=this.sliderC_.props;return i.set("max",e.max),i.set("min",e.min),!0})}exportProps(){const t=this.sliderC_.props;return Cn(null,{max:t.get("max"),min:t.get("min")})}}function Vp(n){return{sliderProps:new Ft({keyScale:n.keyScale,max:n.max,min:n.min}),textProps:new Ft({formatter:ue(n.formatter),keyScale:n.keyScale,pointerScale:ue(n.pointerScale)})}}const $0={containerUnitSize:"cnt-usz"};function zp(n){return`--${$0[n]}`}function uo(n){return Sp(n)}function Ki(n){if(wc(n))return me(n,uo)}function bi(n,t){if(!n)return;const e=[],i=bp(n,t);i&&e.push(i);const r=yp(n);return r&&e.push(r),new Ao(e)}function K0(n){return n?n.major===Ps.major:!1}function Hp(n){if(n==="inline"||n==="popup")return n}function Do(n,t){n.write(t)}const Xo=qt("ckb");class Z0{constructor(t,e){this.onValueChange_=this.onValueChange_.bind(this),this.element=t.createElement("div"),this.element.classList.add(Xo()),e.viewProps.bindClassModifiers(this.element);const i=t.createElement("label");i.classList.add(Xo("l")),this.element.appendChild(i),this.labelElement=i;const r=t.createElement("input");r.classList.add(Xo("i")),r.type="checkbox",this.labelElement.appendChild(r),this.inputElement=r,e.viewProps.bindDisabled(this.inputElement);const s=t.createElement("div");s.classList.add(Xo("w")),this.labelElement.appendChild(s);const o=ol(t,"check");s.appendChild(o),e.value.emitter.on("change",this.onValueChange_),this.value=e.value,this.update_()}update_(){this.inputElement.checked=this.value.rawValue}onValueChange_(){this.update_()}}class J0{constructor(t,e){this.onInputChange_=this.onInputChange_.bind(this),this.onLabelMouseDown_=this.onLabelMouseDown_.bind(this),this.value=e.value,this.viewProps=e.viewProps,this.view=new Z0(t,{value:this.value,viewProps:this.viewProps}),this.view.inputElement.addEventListener("change",this.onInputChange_),this.view.labelElement.addEventListener("mousedown",this.onLabelMouseDown_)}onInputChange_(t){const e=t.currentTarget;this.value.rawValue=e.checked,t.preventDefault(),t.stopPropagation()}onLabelMouseDown_(t){t.preventDefault()}}function j0(n){const t=[],e=$h(n.options);return e&&t.push(e),new Ao(t)}const Q0=tn({id:"input-bool",type:"input",accept:(n,t)=>{if(typeof n!="boolean")return null;const e=me(t,i=>({options:i.optional.custom(Ro),readonly:i.optional.constant(!1)}));return e?{initialValue:n,params:e}:null},binding:{reader:n=>Fp,constraint:n=>j0(n.params),writer:n=>Do},controller:n=>{const t=n.document,e=n.value,i=n.constraint,r=i&&Fa(i,Po);return r?new ir(t,{props:new Ft({options:r.values.value("options")}),value:e,viewProps:n.viewProps}):new J0(t,{value:e,viewProps:n.viewProps})},api(n){return typeof n.controller.value.rawValue!="boolean"?null:n.controller.valueController instanceof ir?new qh(n.controller):null}}),ur=qt("col");class tx{constructor(t,e){this.element=t.createElement("div"),this.element.classList.add(ur()),e.foldable.bindExpandedClass(this.element,ur(void 0,"expanded")),si(e.foldable,"completed",As(this.element,ur(void 0,"cpl")));const i=t.createElement("div");i.classList.add(ur("h")),this.element.appendChild(i);const r=t.createElement("div");r.classList.add(ur("s")),i.appendChild(r),this.swatchElement=r;const s=t.createElement("div");if(s.classList.add(ur("t")),i.appendChild(s),this.textElement=s,e.pickerLayout==="inline"){const o=t.createElement("div");o.classList.add(ur("p")),this.element.appendChild(o),this.pickerElement=o}else this.pickerElement=null}}function ex(n,t,e){const i=Ue(n/255,0,1),r=Ue(t/255,0,1),s=Ue(e/255,0,1),o=Math.max(i,r,s),a=Math.min(i,r,s),l=o-a;let c=0,h=0;const d=(a+o)/2;return l!==0&&(h=l/(1-Math.abs(o+a-1)),i===o?c=(r-s)/l:r===o?c=2+(s-i)/l:c=4+(i-r)/l,c=c/6+(c<0?1:0)),[c*360,h*100,d*100]}function nx(n,t,e){const i=(n%360+360)%360,r=Ue(t/100,0,1),s=Ue(e/100,0,1),o=(1-Math.abs(2*s-1))*r,a=o*(1-Math.abs(i/60%2-1)),l=s-o/2;let c,h,d;return i>=0&&i<60?[c,h,d]=[o,a,0]:i>=60&&i<120?[c,h,d]=[a,o,0]:i>=120&&i<180?[c,h,d]=[0,o,a]:i>=180&&i<240?[c,h,d]=[0,a,o]:i>=240&&i<300?[c,h,d]=[a,0,o]:[c,h,d]=[o,0,a],[(c+l)*255,(h+l)*255,(d+l)*255]}function ix(n,t,e){const i=Ue(n/255,0,1),r=Ue(t/255,0,1),s=Ue(e/255,0,1),o=Math.max(i,r,s),a=Math.min(i,r,s),l=o-a;let c;l===0?c=0:o===i?c=60*(((r-s)/l%6+6)%6):o===r?c=60*((s-i)/l+2):c=60*((i-r)/l+4);const h=o===0?0:l/o,d=o;return[c,h*100,d*100]}function Gp(n,t,e){const i=gp(n,360),r=Ue(t/100,0,1),s=Ue(e/100,0,1),o=s*r,a=o*(1-Math.abs(i/60%2-1)),l=s-o;let c,h,d;return i>=0&&i<60?[c,h,d]=[o,a,0]:i>=60&&i<120?[c,h,d]=[a,o,0]:i>=120&&i<180?[c,h,d]=[0,o,a]:i>=180&&i<240?[c,h,d]=[0,a,o]:i>=240&&i<300?[c,h,d]=[a,0,o]:[c,h,d]=[o,0,a],[(c+l)*255,(h+l)*255,(d+l)*255]}function rx(n,t,e){const i=e+t*(100-Math.abs(2*e-100))/200;return[n,i!==0?t*(100-Math.abs(2*e-100))/i:0,e+t*(100-Math.abs(2*e-100))/200]}function sx(n,t,e){const i=100-Math.abs(e*(200-t)/100-100);return[n,i!==0?t*e/i:0,e*(200-t)/200]}function oi(n){return[n[0],n[1],n[2]]}function ll(n,t){return[n[0],n[1],n[2],t]}const ox={hsl:{hsl:(n,t,e)=>[n,t,e],hsv:rx,rgb:nx},hsv:{hsl:sx,hsv:(n,t,e)=>[n,t,e],rgb:Gp},rgb:{hsl:ex,hsv:ix,rgb:(n,t,e)=>[n,t,e]}};function vs(n,t){return[t==="float"?1:n==="rgb"?255:360,t==="float"?1:n==="rgb"?255:100,t==="float"?1:n==="rgb"?255:100]}function ax(n,t){return n===t?t:gp(n,t)}function Wp(n,t,e){var i;const r=vs(t,e);return[t==="rgb"?Ue(n[0],0,r[0]):ax(n[0],r[0]),Ue(n[1],0,r[1]),Ue(n[2],0,r[2]),Ue((i=n[3])!==null&&i!==void 0?i:1,0,1)]}function vd(n,t,e,i){const r=vs(t,e),s=vs(t,i);return n.map((o,a)=>o/r[a]*s[a])}function Xp(n,t,e){const i=vd(n,t.mode,t.type,"int"),r=ox[t.mode][e.mode](...i);return vd(r,e.mode,"int",e.type)}class Yt{static black(){return new Yt([0,0,0],"rgb")}constructor(t,e){this.type="int",this.mode=e,this.comps_=Wp(t,e,this.type)}getComponents(t){return ll(Xp(oi(this.comps_),{mode:this.mode,type:this.type},{mode:t??this.mode,type:this.type}),this.comps_[3])}toRgbaObject(){const t=this.getComponents("rgb");return{r:t[0],g:t[1],b:t[2],a:t[3]}}}const ki=qt("colp");class lx{constructor(t,e){this.alphaViews_=null,this.element=t.createElement("div"),this.element.classList.add(ki()),e.viewProps.bindClassModifiers(this.element);const i=t.createElement("div");i.classList.add(ki("hsv"));const r=t.createElement("div");r.classList.add(ki("sv")),this.svPaletteView_=e.svPaletteView,r.appendChild(this.svPaletteView_.element),i.appendChild(r);const s=t.createElement("div");s.classList.add(ki("h")),this.hPaletteView_=e.hPaletteView,s.appendChild(this.hPaletteView_.element),i.appendChild(s),this.element.appendChild(i);const o=t.createElement("div");if(o.classList.add(ki("rgb")),this.textsView_=e.textsView,o.appendChild(this.textsView_.element),this.element.appendChild(o),e.alphaViews){this.alphaViews_={palette:e.alphaViews.palette,text:e.alphaViews.text};const a=t.createElement("div");a.classList.add(ki("a"));const l=t.createElement("div");l.classList.add(ki("ap")),l.appendChild(this.alphaViews_.palette.element),a.appendChild(l);const c=t.createElement("div");c.classList.add(ki("at")),c.appendChild(this.alphaViews_.text.element),a.appendChild(c),this.element.appendChild(a)}}get allFocusableElements(){const t=[this.svPaletteView_.element,this.hPaletteView_.element,this.textsView_.modeSelectElement,...this.textsView_.inputViews.map(e=>e.inputElement)];return this.alphaViews_&&t.push(this.alphaViews_.palette.element,this.alphaViews_.text.inputElement),t}}function cx(n){return n==="int"?"int":n==="float"?"float":void 0}function Kh(n){return me(n,t=>({color:t.optional.object({alpha:t.optional.boolean,type:t.optional.custom(cx)}),expanded:t.optional.boolean,picker:t.optional.custom(Hp),readonly:t.optional.constant(!1)}))}function Dr(n){return n?.1:1}function qp(n){var t;return(t=n.color)===null||t===void 0?void 0:t.type}class Zh{constructor(t,e){this.type="float",this.mode=e,this.comps_=Wp(t,e,this.type)}getComponents(t){return ll(Xp(oi(this.comps_),{mode:this.mode,type:this.type},{mode:t??this.mode,type:this.type}),this.comps_[3])}toRgbaObject(){const t=this.getComponents("rgb");return{r:t[0],g:t[1],b:t[2],a:t[3]}}}const hx={int:(n,t)=>new Yt(n,t),float:(n,t)=>new Zh(n,t)};function Jh(n,t,e){return hx[e](n,t)}function ux(n){return n.type==="float"}function dx(n){return n.type==="int"}function fx(n){const t=n.getComponents(),e=vs(n.mode,"int");return new Yt([Math.round(jt(t[0],0,1,0,e[0])),Math.round(jt(t[1],0,1,0,e[1])),Math.round(jt(t[2],0,1,0,e[2])),t[3]],n.mode)}function px(n){const t=n.getComponents(),e=vs(n.mode,"int");return new Zh([jt(t[0],0,e[0],0,1),jt(t[1],0,e[1],0,1),jt(t[2],0,e[2],0,1),t[3]],n.mode)}function Qe(n,t){if(n.type===t)return n;if(dx(n)&&t==="float")return px(n);if(ux(n)&&t==="int")return fx(n);throw xe.shouldNeverHappen()}function mx(n,t){return n.alpha===t.alpha&&n.mode===t.mode&&n.notation===t.notation&&n.type===t.type}function Nn(n,t){const e=n.match(/^(.+)%$/);return Math.min(e?parseFloat(e[1])*.01*t:parseFloat(n),t)}const _x={deg:n=>n,grad:n=>n*360/400,rad:n=>n*360/(2*Math.PI),turn:n=>n*360};function Yp(n){const t=n.match(/^([0-9.]+?)(deg|grad|rad|turn)$/);if(!t)return parseFloat(n);const e=parseFloat(t[1]),i=t[2];return _x[i](e)}function $p(n){const t=n.match(/^rgb\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);if(!t)return null;const e=[Nn(t[1],255),Nn(t[2],255),Nn(t[3],255)];return isNaN(e[0])||isNaN(e[1])||isNaN(e[2])?null:e}function gx(n){const t=$p(n);return t?new Yt(t,"rgb"):null}function Kp(n){const t=n.match(/^rgba\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);if(!t)return null;const e=[Nn(t[1],255),Nn(t[2],255),Nn(t[3],255),Nn(t[4],1)];return isNaN(e[0])||isNaN(e[1])||isNaN(e[2])||isNaN(e[3])?null:e}function vx(n){const t=Kp(n);return t?new Yt(t,"rgb"):null}function Zp(n){const t=n.match(/^hsl\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);if(!t)return null;const e=[Yp(t[1]),Nn(t[2],100),Nn(t[3],100)];return isNaN(e[0])||isNaN(e[1])||isNaN(e[2])?null:e}function xx(n){const t=Zp(n);return t?new Yt(t,"hsl"):null}function Jp(n){const t=n.match(/^hsla\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);if(!t)return null;const e=[Yp(t[1]),Nn(t[2],100),Nn(t[3],100),Nn(t[4],1)];return isNaN(e[0])||isNaN(e[1])||isNaN(e[2])||isNaN(e[3])?null:e}function bx(n){const t=Jp(n);return t?new Yt(t,"hsl"):null}function jp(n){const t=n.match(/^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);if(t)return[parseInt(t[1]+t[1],16),parseInt(t[2]+t[2],16),parseInt(t[3]+t[3],16)];const e=n.match(/^(?:#|0x)([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);return e?[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)]:null}function yx(n){const t=jp(n);return t?new Yt(t,"rgb"):null}function Qp(n){const t=n.match(/^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);if(t)return[parseInt(t[1]+t[1],16),parseInt(t[2]+t[2],16),parseInt(t[3]+t[3],16),jt(parseInt(t[4]+t[4],16),0,255,0,1)];const e=n.match(/^(?:#|0x)?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);return e?[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16),jt(parseInt(e[4],16),0,255,0,1)]:null}function wx(n){const t=Qp(n);return t?new Yt(t,"rgb"):null}function tm(n){const t=n.match(/^\{\s*r\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*g\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*b\s*:\s*([0-9A-Fa-f.]+%?)\s*\}$/);if(!t)return null;const e=[parseFloat(t[1]),parseFloat(t[2]),parseFloat(t[3])];return isNaN(e[0])||isNaN(e[1])||isNaN(e[2])?null:e}function Sx(n){return t=>{const e=tm(t);return e?Jh(e,"rgb",n):null}}function em(n){const t=n.match(/^\{\s*r\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*g\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*b\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*a\s*:\s*([0-9A-Fa-f.]+%?)\s*\}$/);if(!t)return null;const e=[parseFloat(t[1]),parseFloat(t[2]),parseFloat(t[3]),parseFloat(t[4])];return isNaN(e[0])||isNaN(e[1])||isNaN(e[2])||isNaN(e[3])?null:e}function Ex(n){return t=>{const e=em(t);return e?Jh(e,"rgb",n):null}}const Mx=[{parser:jp,result:{alpha:!1,mode:"rgb",notation:"hex"}},{parser:Qp,result:{alpha:!0,mode:"rgb",notation:"hex"}},{parser:$p,result:{alpha:!1,mode:"rgb",notation:"func"}},{parser:Kp,result:{alpha:!0,mode:"rgb",notation:"func"}},{parser:Zp,result:{alpha:!1,mode:"hsl",notation:"func"}},{parser:Jp,result:{alpha:!0,mode:"hsl",notation:"func"}},{parser:tm,result:{alpha:!1,mode:"rgb",notation:"object"}},{parser:em,result:{alpha:!0,mode:"rgb",notation:"object"}}];function Tx(n){return Mx.reduce((t,{parser:e,result:i})=>t||(e(n)?i:null),null)}function Cx(n,t="int"){const e=Tx(n);return e?e.notation==="hex"&&t!=="float"?Object.assign(Object.assign({},e),{type:"int"}):e.notation==="func"?Object.assign(Object.assign({},e),{type:t}):null:null}function Io(n){const t=[yx,wx,gx,vx,xx,bx];t.push(Sx("int"),Ex("int"));const e=z0(t);return i=>{const r=e(i);return r?Qe(r,n):null}}function Ax(n){const t=Io("int");if(typeof n!="string")return Yt.black();const e=t(n);return e??Yt.black()}function nm(n){const t=Ue(Math.floor(n),0,255).toString(16);return t.length===1?`0${t}`:t}function jh(n,t="#"){const e=oi(n.getComponents("rgb")).map(nm).join("");return`${t}${e}`}function Qh(n,t="#"){const e=n.getComponents("rgb"),i=[e[0],e[1],e[2],e[3]*255].map(nm).join("");return`${t}${i}`}function im(n){const t=un(0),e=Qe(n,"int");return`rgb(${oi(e.getComponents("rgb")).map(r=>t(r)).join(", ")})`}function ya(n){const t=un(2),e=un(0);return`rgba(${Qe(n,"int").getComponents("rgb").map((s,o)=>(o===3?t:e)(s)).join(", ")})`}function Px(n){const t=[un(0),ka,ka],e=Qe(n,"int");return`hsl(${oi(e.getComponents("hsl")).map((r,s)=>t[s](r)).join(", ")})`}function Rx(n){const t=[un(0),ka,ka,un(2)];return`hsla(${Qe(n,"int").getComponents("hsl").map((r,s)=>t[s](r)).join(", ")})`}function rm(n,t){const e=un(t==="float"?2:0),i=["r","g","b"],r=Qe(n,t);return`{${oi(r.getComponents("rgb")).map((o,a)=>`${i[a]}: ${e(o)}`).join(", ")}}`}function Lx(n){return t=>rm(t,n)}function sm(n,t){const e=un(2),i=un(t==="float"?2:0),r=["r","g","b","a"];return`{${Qe(n,t).getComponents("rgb").map((a,l)=>{const c=l===3?e:i;return`${r[l]}: ${c(a)}`}).join(", ")}}`}function Dx(n){return t=>sm(t,n)}const Ix=[{format:{alpha:!1,mode:"rgb",notation:"hex",type:"int"},stringifier:jh},{format:{alpha:!0,mode:"rgb",notation:"hex",type:"int"},stringifier:Qh},{format:{alpha:!1,mode:"rgb",notation:"func",type:"int"},stringifier:im},{format:{alpha:!0,mode:"rgb",notation:"func",type:"int"},stringifier:ya},{format:{alpha:!1,mode:"hsl",notation:"func",type:"int"},stringifier:Px},{format:{alpha:!0,mode:"hsl",notation:"func",type:"int"},stringifier:Rx},...["int","float"].reduce((n,t)=>[...n,{format:{alpha:!1,mode:"rgb",notation:"object",type:t},stringifier:Lx(t)},{format:{alpha:!0,mode:"rgb",notation:"object",type:t},stringifier:Dx(t)}],[])];function om(n){return Ix.reduce((t,e)=>t||(mx(e.format,n)?e.stringifier:null),null)}const ks=qt("apl");class Ux{constructor(t,e){this.onValueChange_=this.onValueChange_.bind(this),this.value=e.value,this.value.emitter.on("change",this.onValueChange_),this.element=t.createElement("div"),this.element.classList.add(ks()),e.viewProps.bindClassModifiers(this.element),e.viewProps.bindTabIndex(this.element);const i=t.createElement("div");i.classList.add(ks("b")),this.element.appendChild(i);const r=t.createElement("div");r.classList.add(ks("c")),i.appendChild(r),this.colorElem_=r;const s=t.createElement("div");s.classList.add(ks("m")),this.element.appendChild(s),this.markerElem_=s;const o=t.createElement("div");o.classList.add(ks("p")),this.markerElem_.appendChild(o),this.previewElem_=o,this.update_()}update_(){const t=this.value.rawValue,e=t.getComponents("rgb"),i=new Yt([e[0],e[1],e[2],0],"rgb"),r=new Yt([e[0],e[1],e[2],255],"rgb"),s=["to right",ya(i),ya(r)];this.colorElem_.style.background=`linear-gradient(${s.join(",")})`,this.previewElem_.style.backgroundColor=ya(t);const o=jt(e[3],0,1,0,100);this.markerElem_.style.left=`${o}%`}onValueChange_(){this.update_()}}class Nx{constructor(t,e){this.onKeyDown_=this.onKeyDown_.bind(this),this.onKeyUp_=this.onKeyUp_.bind(this),this.onPointerDown_=this.onPointerDown_.bind(this),this.onPointerMove_=this.onPointerMove_.bind(this),this.onPointerUp_=this.onPointerUp_.bind(this),this.value=e.value,this.viewProps=e.viewProps,this.view=new Ux(t,{value:this.value,viewProps:this.viewProps}),this.ptHandler_=new Fr(this.view.element),this.ptHandler_.emitter.on("down",this.onPointerDown_),this.ptHandler_.emitter.on("move",this.onPointerMove_),this.ptHandler_.emitter.on("up",this.onPointerUp_),this.view.element.addEventListener("keydown",this.onKeyDown_),this.view.element.addEventListener("keyup",this.onKeyUp_)}handlePointerEvent_(t,e){if(!t.point)return;const i=t.point.x/t.bounds.width,r=this.value.rawValue,[s,o,a]=r.getComponents("hsv");this.value.setRawValue(new Yt([s,o,a,i],"hsv"),e)}onPointerDown_(t){this.handlePointerEvent_(t.data,{forceEmit:!1,last:!1})}onPointerMove_(t){this.handlePointerEvent_(t.data,{forceEmit:!1,last:!1})}onPointerUp_(t){this.handlePointerEvent_(t.data,{forceEmit:!0,last:!0})}onKeyDown_(t){const e=sn(Dr(!0),Ci(t));if(e===0)return;const i=this.value.rawValue,[r,s,o,a]=i.getComponents("hsv");this.value.setRawValue(new Yt([r,s,o,a+e],"hsv"),{forceEmit:!1,last:!1})}onKeyUp_(t){sn(Dr(!0),Ci(t))!==0&&this.value.setRawValue(this.value.rawValue,{forceEmit:!0,last:!0})}}const Gr=qt("coltxt");function Ox(n){const t=n.createElement("select"),e=[{text:"RGB",value:"rgb"},{text:"HSL",value:"hsl"},{text:"HSV",value:"hsv"},{text:"HEX",value:"hex"}];return t.appendChild(e.reduce((i,r)=>{const s=n.createElement("option");return s.textContent=r.text,s.value=r.value,i.appendChild(s),i},n.createDocumentFragment())),t}class Fx{constructor(t,e){this.element=t.createElement("div"),this.element.classList.add(Gr()),e.viewProps.bindClassModifiers(this.element);const i=t.createElement("div");i.classList.add(Gr("m")),this.modeElem_=Ox(t),this.modeElem_.classList.add(Gr("ms")),i.appendChild(this.modeSelectElement),e.viewProps.bindDisabled(this.modeElem_);const r=t.createElement("div");r.classList.add(Gr("mm")),r.appendChild(ol(t,"dropdown")),i.appendChild(r),this.element.appendChild(i);const s=t.createElement("div");s.classList.add(Gr("w")),this.element.appendChild(s),this.inputsElem_=s,this.inputViews_=e.inputViews,this.applyInputViews_(),wi(e.mode,o=>{this.modeElem_.value=o})}get modeSelectElement(){return this.modeElem_}get inputViews(){return this.inputViews_}set inputViews(t){this.inputViews_=t,this.applyInputViews_()}applyInputViews_(){Tp(this.inputsElem_);const t=this.element.ownerDocument;this.inputViews_.forEach(e=>{const i=t.createElement("div");i.classList.add(Gr("c")),i.appendChild(e.element),this.inputsElem_.appendChild(i)})}}function kx(n){return un(n==="float"?2:0)}function Bx(n,t,e){const i=vs(n,t)[e];return new Mo({min:0,max:i})}function Vx(n,t,e){return new Lo(n,{arrayPosition:e===0?"fst":e===2?"lst":"mid",parser:t.parser,props:Ft.fromObject({formatter:kx(t.colorType),keyScale:Dr(!1),pointerScale:t.colorType==="float"?.01:1}),value:ue(0,{constraint:Bx(t.colorMode,t.colorType,e)}),viewProps:t.viewProps})}function zx(n,t){const e={colorMode:t.colorMode,colorType:t.colorType,parser:Ti,viewProps:t.viewProps};return[0,1,2].map(i=>{const r=Vx(n,e,i);return Ls({primary:t.value,secondary:r.value,forward(s){return Qe(s,t.colorType).getComponents(t.colorMode)[i]},backward(s,o){const a=t.colorMode,c=Qe(s,t.colorType).getComponents(a);c[i]=o;const h=Jh(ll(oi(c),c[3]),a,t.colorType);return Qe(h,"int")}}),r})}function Hx(n,t){const e=new co(n,{parser:Io("int"),props:Ft.fromObject({formatter:jh}),value:ue(Yt.black()),viewProps:t.viewProps});return Ls({primary:t.value,secondary:e.value,forward:i=>new Yt(oi(i.getComponents()),i.mode),backward:(i,r)=>new Yt(ll(oi(r.getComponents(i.mode)),i.getComponents()[3]),i.mode)}),[e]}function Gx(n){return n!=="hex"}class Wx{constructor(t,e){this.onModeSelectChange_=this.onModeSelectChange_.bind(this),this.colorType_=e.colorType,this.value=e.value,this.viewProps=e.viewProps,this.colorMode=ue(this.value.rawValue.mode),this.ccs_=this.createComponentControllers_(t),this.view=new Fx(t,{mode:this.colorMode,inputViews:[this.ccs_[0].view,this.ccs_[1].view,this.ccs_[2].view],viewProps:this.viewProps}),this.view.modeSelectElement.addEventListener("change",this.onModeSelectChange_)}createComponentControllers_(t){const e=this.colorMode.rawValue;return Gx(e)?zx(t,{colorMode:e,colorType:this.colorType_,value:this.value,viewProps:this.viewProps}):Hx(t,{value:this.value,viewProps:this.viewProps})}onModeSelectChange_(t){const e=t.currentTarget;this.colorMode.rawValue=e.value,this.ccs_=this.createComponentControllers_(this.view.element.ownerDocument),this.view.inputViews=this.ccs_.map(i=>i.view)}}const Rl=qt("hpl");class Xx{constructor(t,e){this.onValueChange_=this.onValueChange_.bind(this),this.value=e.value,this.value.emitter.on("change",this.onValueChange_),this.element=t.createElement("div"),this.element.classList.add(Rl()),e.viewProps.bindClassModifiers(this.element),e.viewProps.bindTabIndex(this.element);const i=t.createElement("div");i.classList.add(Rl("c")),this.element.appendChild(i);const r=t.createElement("div");r.classList.add(Rl("m")),this.element.appendChild(r),this.markerElem_=r,this.update_()}update_(){const t=this.value.rawValue,[e]=t.getComponents("hsv");this.markerElem_.style.backgroundColor=im(new Yt([e,100,100],"hsv"));const i=jt(e,0,360,0,100);this.markerElem_.style.left=`${i}%`}onValueChange_(){this.update_()}}class qx{constructor(t,e){this.onKeyDown_=this.onKeyDown_.bind(this),this.onKeyUp_=this.onKeyUp_.bind(this),this.onPointerDown_=this.onPointerDown_.bind(this),this.onPointerMove_=this.onPointerMove_.bind(this),this.onPointerUp_=this.onPointerUp_.bind(this),this.value=e.value,this.viewProps=e.viewProps,this.view=new Xx(t,{value:this.value,viewProps:this.viewProps}),this.ptHandler_=new Fr(this.view.element),this.ptHandler_.emitter.on("down",this.onPointerDown_),this.ptHandler_.emitter.on("move",this.onPointerMove_),this.ptHandler_.emitter.on("up",this.onPointerUp_),this.view.element.addEventListener("keydown",this.onKeyDown_),this.view.element.addEventListener("keyup",this.onKeyUp_)}handlePointerEvent_(t,e){if(!t.point)return;const i=jt(Ue(t.point.x,0,t.bounds.width),0,t.bounds.width,0,360),r=this.value.rawValue,[,s,o,a]=r.getComponents("hsv");this.value.setRawValue(new Yt([i,s,o,a],"hsv"),e)}onPointerDown_(t){this.handlePointerEvent_(t.data,{forceEmit:!1,last:!1})}onPointerMove_(t){this.handlePointerEvent_(t.data,{forceEmit:!1,last:!1})}onPointerUp_(t){this.handlePointerEvent_(t.data,{forceEmit:!0,last:!0})}onKeyDown_(t){const e=sn(Dr(!1),Ci(t));if(e===0)return;const i=this.value.rawValue,[r,s,o,a]=i.getComponents("hsv");this.value.setRawValue(new Yt([r+e,s,o,a],"hsv"),{forceEmit:!1,last:!1})}onKeyUp_(t){sn(Dr(!1),Ci(t))!==0&&this.value.setRawValue(this.value.rawValue,{forceEmit:!0,last:!0})}}const Ll=qt("svp"),xd=64;class Yx{constructor(t,e){this.onValueChange_=this.onValueChange_.bind(this),this.value=e.value,this.value.emitter.on("change",this.onValueChange_),this.element=t.createElement("div"),this.element.classList.add(Ll()),e.viewProps.bindClassModifiers(this.element),e.viewProps.bindTabIndex(this.element);const i=t.createElement("canvas");i.height=xd,i.width=xd,i.classList.add(Ll("c")),this.element.appendChild(i),this.canvasElement=i;const r=t.createElement("div");r.classList.add(Ll("m")),this.element.appendChild(r),this.markerElem_=r,this.update_()}update_(){const t=qv(this.canvasElement);if(!t)return;const i=this.value.rawValue.getComponents("hsv"),r=this.canvasElement.width,s=this.canvasElement.height,o=t.getImageData(0,0,r,s),a=o.data;for(let h=0;h<s;h++)for(let d=0;d<r;d++){const u=jt(d,0,r,0,100),f=jt(h,0,s,100,0),_=Gp(i[0],u,f),g=(h*r+d)*4;a[g]=_[0],a[g+1]=_[1],a[g+2]=_[2],a[g+3]=255}t.putImageData(o,0,0);const l=jt(i[1],0,100,0,100);this.markerElem_.style.left=`${l}%`;const c=jt(i[2],0,100,100,0);this.markerElem_.style.top=`${c}%`}onValueChange_(){this.update_()}}class $x{constructor(t,e){this.onKeyDown_=this.onKeyDown_.bind(this),this.onKeyUp_=this.onKeyUp_.bind(this),this.onPointerDown_=this.onPointerDown_.bind(this),this.onPointerMove_=this.onPointerMove_.bind(this),this.onPointerUp_=this.onPointerUp_.bind(this),this.value=e.value,this.viewProps=e.viewProps,this.view=new Yx(t,{value:this.value,viewProps:this.viewProps}),this.ptHandler_=new Fr(this.view.element),this.ptHandler_.emitter.on("down",this.onPointerDown_),this.ptHandler_.emitter.on("move",this.onPointerMove_),this.ptHandler_.emitter.on("up",this.onPointerUp_),this.view.element.addEventListener("keydown",this.onKeyDown_),this.view.element.addEventListener("keyup",this.onKeyUp_)}handlePointerEvent_(t,e){if(!t.point)return;const i=jt(t.point.x,0,t.bounds.width,0,100),r=jt(t.point.y,0,t.bounds.height,100,0),[s,,,o]=this.value.rawValue.getComponents("hsv");this.value.setRawValue(new Yt([s,i,r,o],"hsv"),e)}onPointerDown_(t){this.handlePointerEvent_(t.data,{forceEmit:!1,last:!1})}onPointerMove_(t){this.handlePointerEvent_(t.data,{forceEmit:!1,last:!1})}onPointerUp_(t){this.handlePointerEvent_(t.data,{forceEmit:!0,last:!0})}onKeyDown_(t){Bp(t.key)&&t.preventDefault();const[e,i,r,s]=this.value.rawValue.getComponents("hsv"),o=Dr(!1),a=sn(o,Ci(t)),l=sn(o,ho(t));a===0&&l===0||this.value.setRawValue(new Yt([e,i+a,r+l,s],"hsv"),{forceEmit:!1,last:!1})}onKeyUp_(t){const e=Dr(!1),i=sn(e,Ci(t)),r=sn(e,ho(t));i===0&&r===0||this.value.setRawValue(this.value.rawValue,{forceEmit:!0,last:!0})}}class Kx{constructor(t,e){this.value=e.value,this.viewProps=e.viewProps,this.hPaletteC_=new qx(t,{value:this.value,viewProps:this.viewProps}),this.svPaletteC_=new $x(t,{value:this.value,viewProps:this.viewProps}),this.alphaIcs_=e.supportsAlpha?{palette:new Nx(t,{value:this.value,viewProps:this.viewProps}),text:new Lo(t,{parser:Ti,props:Ft.fromObject({pointerScale:.01,keyScale:.1,formatter:un(2)}),value:ue(0,{constraint:new Mo({min:0,max:1})}),viewProps:this.viewProps})}:null,this.alphaIcs_&&Ls({primary:this.value,secondary:this.alphaIcs_.text.value,forward:i=>i.getComponents()[3],backward:(i,r)=>{const s=i.getComponents();return s[3]=r,new Yt(s,i.mode)}}),this.textsC_=new Wx(t,{colorType:e.colorType,value:this.value,viewProps:this.viewProps}),this.view=new lx(t,{alphaViews:this.alphaIcs_?{palette:this.alphaIcs_.palette.view,text:this.alphaIcs_.text.view}:null,hPaletteView:this.hPaletteC_.view,supportsAlpha:e.supportsAlpha,svPaletteView:this.svPaletteC_.view,textsView:this.textsC_.view,viewProps:this.viewProps})}get textsController(){return this.textsC_}}const Dl=qt("colsw");class Zx{constructor(t,e){this.onValueChange_=this.onValueChange_.bind(this),e.value.emitter.on("change",this.onValueChange_),this.value=e.value,this.element=t.createElement("div"),this.element.classList.add(Dl()),e.viewProps.bindClassModifiers(this.element);const i=t.createElement("div");i.classList.add(Dl("sw")),this.element.appendChild(i),this.swatchElem_=i;const r=t.createElement("button");r.classList.add(Dl("b")),e.viewProps.bindDisabled(r),this.element.appendChild(r),this.buttonElement=r,this.update_()}update_(){const t=this.value.rawValue;this.swatchElem_.style.backgroundColor=Qh(t)}onValueChange_(){this.update_()}}class Jx{constructor(t,e){this.value=e.value,this.viewProps=e.viewProps,this.view=new Zx(t,{value:this.value,viewProps:this.viewProps})}}class tu{constructor(t,e){this.onButtonBlur_=this.onButtonBlur_.bind(this),this.onButtonClick_=this.onButtonClick_.bind(this),this.onPopupChildBlur_=this.onPopupChildBlur_.bind(this),this.onPopupChildKeydown_=this.onPopupChildKeydown_.bind(this),this.value=e.value,this.viewProps=e.viewProps,this.foldable_=Co.create(e.expanded),this.swatchC_=new Jx(t,{value:this.value,viewProps:this.viewProps});const i=this.swatchC_.view.buttonElement;i.addEventListener("blur",this.onButtonBlur_),i.addEventListener("click",this.onButtonClick_),this.textC_=new co(t,{parser:e.parser,props:Ft.fromObject({formatter:e.formatter}),value:this.value,viewProps:this.viewProps}),this.view=new tx(t,{foldable:this.foldable_,pickerLayout:e.pickerLayout}),this.view.swatchElement.appendChild(this.swatchC_.view.element),this.view.textElement.appendChild(this.textC_.view.element),this.popC_=e.pickerLayout==="popup"?new Op(t,{viewProps:this.viewProps}):null;const r=new Kx(t,{colorType:e.colorType,supportsAlpha:e.supportsAlpha,value:this.value,viewProps:this.viewProps});r.view.allFocusableElements.forEach(s=>{s.addEventListener("blur",this.onPopupChildBlur_),s.addEventListener("keydown",this.onPopupChildKeydown_)}),this.pickerC_=r,this.popC_?(this.view.element.appendChild(this.popC_.view.element),this.popC_.view.element.appendChild(r.view.element),Ls({primary:this.foldable_.value("expanded"),secondary:this.popC_.shows,forward:s=>s,backward:(s,o)=>o})):this.view.pickerElement&&(this.view.pickerElement.appendChild(this.pickerC_.view.element),Xh(this.foldable_,this.view.pickerElement))}get textController(){return this.textC_}onButtonBlur_(t){if(!this.popC_)return;const e=this.view.element,i=t.relatedTarget;(!i||!e.contains(i))&&(this.popC_.shows.rawValue=!1)}onButtonClick_(){this.foldable_.set("expanded",!this.foldable_.get("expanded")),this.foldable_.get("expanded")&&this.pickerC_.view.allFocusableElements[0].focus()}onPopupChildBlur_(t){if(!this.popC_)return;const e=this.popC_.view.element,i=Cp(t);i&&e.contains(i)||i&&i===this.swatchC_.view.buttonElement&&!Bh(e.ownerDocument)||(this.popC_.shows.rawValue=!1)}onPopupChildKeydown_(t){this.popC_?t.key==="Escape"&&(this.popC_.shows.rawValue=!1):this.view.pickerElement&&t.key==="Escape"&&this.swatchC_.view.buttonElement.focus()}}function jx(n){return oi(n.getComponents("rgb")).reduce((t,e)=>t<<8|Math.floor(e)&255,0)}function Qx(n){return n.getComponents("rgb").reduce((t,e,i)=>{const r=Math.floor(i===3?e*255:e)&255;return t<<8|r},0)>>>0}function tb(n){return new Yt([n>>16&255,n>>8&255,n&255],"rgb")}function eb(n){return new Yt([n>>24&255,n>>16&255,n>>8&255,jt(n&255,0,255,0,1)],"rgb")}function nb(n){return typeof n!="number"?Yt.black():tb(n)}function ib(n){return typeof n!="number"?Yt.black():eb(n)}function wa(n,t){return typeof n!="object"||ce(n)?!1:t in n&&typeof n[t]=="number"}function am(n){return wa(n,"r")&&wa(n,"g")&&wa(n,"b")}function lm(n){return am(n)&&wa(n,"a")}function cm(n){return am(n)}function eu(n,t){if(n.mode!==t.mode||n.type!==t.type)return!1;const e=n.getComponents(),i=t.getComponents();for(let r=0;r<e.length;r++)if(e[r]!==i[r])return!1;return!0}function bd(n){return"a"in n?[n.r,n.g,n.b,n.a]:[n.r,n.g,n.b]}function rb(n){const t=om(n);return t?(e,i)=>{Do(e,t(i))}:null}function sb(n){const t=n?Qx:jx;return(e,i)=>{Do(e,t(i))}}function ob(n,t,e){const r=Qe(t,e).toRgbaObject();n.writeProperty("r",r.r),n.writeProperty("g",r.g),n.writeProperty("b",r.b),n.writeProperty("a",r.a)}function ab(n,t,e){const r=Qe(t,e).toRgbaObject();n.writeProperty("r",r.r),n.writeProperty("g",r.g),n.writeProperty("b",r.b)}function lb(n,t){return(e,i)=>{n?ob(e,i,t):ab(e,i,t)}}function cb(n){var t;return!!(!((t=n?.color)===null||t===void 0)&&t.alpha)}function hb(n){return n?t=>Qh(t,"0x"):t=>jh(t,"0x")}function ub(n){return"color"in n||n.view==="color"}const db=tn({id:"input-color-number",type:"input",accept:(n,t)=>{if(typeof n!="number"||!ub(t))return null;const e=Kh(t);return e?{initialValue:n,params:Object.assign(Object.assign({},e),{supportsAlpha:cb(t)})}:null},binding:{reader:n=>n.params.supportsAlpha?ib:nb,equals:eu,writer:n=>sb(n.params.supportsAlpha)},controller:n=>{var t,e;return new tu(n.document,{colorType:"int",expanded:(t=n.params.expanded)!==null&&t!==void 0?t:!1,formatter:hb(n.params.supportsAlpha),parser:Io("int"),pickerLayout:(e=n.params.picker)!==null&&e!==void 0?e:"popup",supportsAlpha:n.params.supportsAlpha,value:n.value,viewProps:n.viewProps})}});function fb(n,t){if(!cm(n))return Qe(Yt.black(),t);if(t==="int"){const e=bd(n);return new Yt(e,"rgb")}if(t==="float"){const e=bd(n);return new Zh(e,"rgb")}return Qe(Yt.black(),"int")}function pb(n){return lm(n)}function mb(n){return t=>{const e=fb(t,n);return Qe(e,"int")}}function _b(n,t){return e=>n?sm(e,t):rm(e,t)}const gb=tn({id:"input-color-object",type:"input",accept:(n,t)=>{var e;if(!cm(n))return null;const i=Kh(t);return i?{initialValue:n,params:Object.assign(Object.assign({},i),{colorType:(e=qp(t))!==null&&e!==void 0?e:"int"})}:null},binding:{reader:n=>mb(n.params.colorType),equals:eu,writer:n=>lb(pb(n.initialValue),n.params.colorType)},controller:n=>{var t,e;const i=lm(n.initialValue);return new tu(n.document,{colorType:n.params.colorType,expanded:(t=n.params.expanded)!==null&&t!==void 0?t:!1,formatter:_b(i,n.params.colorType),parser:Io("int"),pickerLayout:(e=n.params.picker)!==null&&e!==void 0?e:"popup",supportsAlpha:i,value:n.value,viewProps:n.viewProps})}}),vb=tn({id:"input-color-string",type:"input",accept:(n,t)=>{if(typeof n!="string"||t.view==="text")return null;const e=Cx(n,qp(t));if(!e)return null;const i=om(e);if(!i)return null;const r=Kh(t);return r?{initialValue:n,params:Object.assign(Object.assign({},r),{format:e,stringifier:i})}:null},binding:{reader:()=>Ax,equals:eu,writer:n=>{const t=rb(n.params.format);if(!t)throw xe.notBindable();return t}},controller:n=>{var t,e;return new tu(n.document,{colorType:n.params.format.type,expanded:(t=n.params.expanded)!==null&&t!==void 0?t:!1,formatter:n.params.stringifier,parser:Io("int"),pickerLayout:(e=n.params.picker)!==null&&e!==void 0?e:"popup",supportsAlpha:n.params.format.alpha,value:n.value,viewProps:n.viewProps})}});class nu{constructor(t){this.components=t.components,this.asm_=t.assembly}constrain(t){const e=this.asm_.toComponents(t).map((i,r)=>{var s,o;return(o=(s=this.components[r])===null||s===void 0?void 0:s.constrain(i))!==null&&o!==void 0?o:i});return this.asm_.fromComponents(e)}}const yd=qt("pndtxt");class xb{constructor(t,e){this.textViews=e.textViews,this.element=t.createElement("div"),this.element.classList.add(yd()),this.textViews.forEach(i=>{const r=t.createElement("div");r.classList.add(yd("a")),r.appendChild(i.element),this.element.appendChild(r)})}}function bb(n,t,e){return new Lo(n,{arrayPosition:e===0?"fst":e===t.axes.length-1?"lst":"mid",parser:t.parser,props:t.axes[e].textProps,value:ue(0,{constraint:t.axes[e].constraint}),viewProps:t.viewProps})}class iu{constructor(t,e){this.value=e.value,this.viewProps=e.viewProps,this.acs_=e.axes.map((i,r)=>bb(t,e,r)),this.acs_.forEach((i,r)=>{Ls({primary:this.value,secondary:i.value,forward:s=>e.assembly.toComponents(s)[r],backward:(s,o)=>{const a=e.assembly.toComponents(s);return a[r]=o,e.assembly.fromComponents(a)}})}),this.view=new xb(t,{textViews:this.acs_.map(i=>i.view)})}get textControllers(){return this.acs_}}class yb extends lo{get max(){return this.controller.valueController.sliderController.props.get("max")}set max(t){this.controller.valueController.sliderController.props.set("max",t)}get min(){return this.controller.valueController.sliderController.props.get("min")}set min(t){this.controller.valueController.sliderController.props.set("min",t)}}function wb(n,t){const e=[],i=bp(n,t);i&&e.push(i);const r=yp(n);r&&e.push(r);const s=$h(n.options);return s&&e.push(s),new Ao(e)}const Sb=tn({id:"input-number",type:"input",accept:(n,t)=>{if(typeof n!="number")return null;const e=me(t,i=>Object.assign(Object.assign({},Sp(i)),{options:i.optional.custom(Ro),readonly:i.optional.constant(!1)}));return e?{initialValue:n,params:e}:null},binding:{reader:n=>_p,constraint:n=>wb(n.params,n.initialValue),writer:n=>Do},controller:n=>{const t=n.value,e=n.constraint,i=e&&Fa(e,Po);if(i)return new ir(n.document,{props:new Ft({options:i.values.value("options")}),value:t,viewProps:n.viewProps});const r=wp(n.params,t.rawValue),s=e&&Fa(e,Mo);return s?new Ba(n.document,Object.assign(Object.assign({},Vp(Object.assign(Object.assign({},r),{keyScale:ue(r.keyScale),max:s.values.value("max"),min:s.values.value("min")}))),{parser:Ti,value:t,viewProps:n.viewProps})):new Lo(n.document,{parser:Ti,props:Ft.fromObject(r),value:t,viewProps:n.viewProps})},api(n){return typeof n.controller.value.rawValue!="number"?null:n.controller.valueController instanceof Ba?new yb(n.controller):n.controller.valueController instanceof ir?new qh(n.controller):null}});class tr{constructor(t=0,e=0){this.x=t,this.y=e}getComponents(){return[this.x,this.y]}static isObject(t){if(ce(t))return!1;const e=t.x,i=t.y;return!(typeof e!="number"||typeof i!="number")}static equals(t,e){return t.x===e.x&&t.y===e.y}toObject(){return{x:this.x,y:this.y}}}const hm={toComponents:n=>n.getComponents(),fromComponents:n=>new tr(...n)},Wr=qt("p2d");class Eb{constructor(t,e){this.element=t.createElement("div"),this.element.classList.add(Wr()),e.viewProps.bindClassModifiers(this.element),wi(e.expanded,As(this.element,Wr(void 0,"expanded")));const i=t.createElement("div");i.classList.add(Wr("h")),this.element.appendChild(i);const r=t.createElement("button");r.classList.add(Wr("b")),r.appendChild(ol(t,"p2dpad")),e.viewProps.bindDisabled(r),i.appendChild(r),this.buttonElement=r;const s=t.createElement("div");if(s.classList.add(Wr("t")),i.appendChild(s),this.textElement=s,e.pickerLayout==="inline"){const o=t.createElement("div");o.classList.add(Wr("p")),this.element.appendChild(o),this.pickerElement=o}else this.pickerElement=null}}const Bi=qt("p2dp");class Mb{constructor(t,e){this.onFoldableChange_=this.onFoldableChange_.bind(this),this.onPropsChange_=this.onPropsChange_.bind(this),this.onValueChange_=this.onValueChange_.bind(this),this.props_=e.props,this.props_.emitter.on("change",this.onPropsChange_),this.element=t.createElement("div"),this.element.classList.add(Bi()),e.layout==="popup"&&this.element.classList.add(Bi(void 0,"p")),e.viewProps.bindClassModifiers(this.element);const i=t.createElement("div");i.classList.add(Bi("p")),e.viewProps.bindTabIndex(i),this.element.appendChild(i),this.padElement=i;const r=t.createElementNS(jn,"svg");r.classList.add(Bi("g")),this.padElement.appendChild(r),this.svgElem_=r;const s=t.createElementNS(jn,"line");s.classList.add(Bi("ax")),s.setAttributeNS(null,"x1","0"),s.setAttributeNS(null,"y1","50%"),s.setAttributeNS(null,"x2","100%"),s.setAttributeNS(null,"y2","50%"),this.svgElem_.appendChild(s);const o=t.createElementNS(jn,"line");o.classList.add(Bi("ax")),o.setAttributeNS(null,"x1","50%"),o.setAttributeNS(null,"y1","0"),o.setAttributeNS(null,"x2","50%"),o.setAttributeNS(null,"y2","100%"),this.svgElem_.appendChild(o);const a=t.createElementNS(jn,"line");a.classList.add(Bi("l")),a.setAttributeNS(null,"x1","50%"),a.setAttributeNS(null,"y1","50%"),this.svgElem_.appendChild(a),this.lineElem_=a;const l=t.createElement("div");l.classList.add(Bi("m")),this.padElement.appendChild(l),this.markerElem_=l,e.value.emitter.on("change",this.onValueChange_),this.value=e.value,this.update_()}get allFocusableElements(){return[this.padElement]}update_(){const[t,e]=this.value.rawValue.getComponents(),i=this.props_.get("max"),r=jt(t,-i,+i,0,100),s=jt(e,-i,+i,0,100),o=this.props_.get("invertsY")?100-s:s;this.lineElem_.setAttributeNS(null,"x2",`${r}%`),this.lineElem_.setAttributeNS(null,"y2",`${o}%`),this.markerElem_.style.left=`${r}%`,this.markerElem_.style.top=`${o}%`}onValueChange_(){this.update_()}onPropsChange_(){this.update_()}onFoldableChange_(){this.update_()}}function wd(n,t,e){return[sn(t[0],Ci(n)),sn(t[1],ho(n))*(e?1:-1)]}class Tb{constructor(t,e){this.onPadKeyDown_=this.onPadKeyDown_.bind(this),this.onPadKeyUp_=this.onPadKeyUp_.bind(this),this.onPointerDown_=this.onPointerDown_.bind(this),this.onPointerMove_=this.onPointerMove_.bind(this),this.onPointerUp_=this.onPointerUp_.bind(this),this.props=e.props,this.value=e.value,this.viewProps=e.viewProps,this.view=new Mb(t,{layout:e.layout,props:this.props,value:this.value,viewProps:this.viewProps}),this.ptHandler_=new Fr(this.view.padElement),this.ptHandler_.emitter.on("down",this.onPointerDown_),this.ptHandler_.emitter.on("move",this.onPointerMove_),this.ptHandler_.emitter.on("up",this.onPointerUp_),this.view.padElement.addEventListener("keydown",this.onPadKeyDown_),this.view.padElement.addEventListener("keyup",this.onPadKeyUp_)}handlePointerEvent_(t,e){if(!t.point)return;const i=this.props.get("max"),r=jt(t.point.x,0,t.bounds.width,-i,+i),s=jt(this.props.get("invertsY")?t.bounds.height-t.point.y:t.point.y,0,t.bounds.height,-i,+i);this.value.setRawValue(new tr(r,s),e)}onPointerDown_(t){this.handlePointerEvent_(t.data,{forceEmit:!1,last:!1})}onPointerMove_(t){this.handlePointerEvent_(t.data,{forceEmit:!1,last:!1})}onPointerUp_(t){this.handlePointerEvent_(t.data,{forceEmit:!0,last:!0})}onPadKeyDown_(t){Bp(t.key)&&t.preventDefault();const[e,i]=wd(t,[this.props.get("xKeyScale"),this.props.get("yKeyScale")],this.props.get("invertsY"));e===0&&i===0||this.value.setRawValue(new tr(this.value.rawValue.x+e,this.value.rawValue.y+i),{forceEmit:!1,last:!1})}onPadKeyUp_(t){const[e,i]=wd(t,[this.props.get("xKeyScale"),this.props.get("yKeyScale")],this.props.get("invertsY"));e===0&&i===0||this.value.setRawValue(this.value.rawValue,{forceEmit:!0,last:!0})}}class Cb{constructor(t,e){var i,r;this.onPopupChildBlur_=this.onPopupChildBlur_.bind(this),this.onPopupChildKeydown_=this.onPopupChildKeydown_.bind(this),this.onPadButtonBlur_=this.onPadButtonBlur_.bind(this),this.onPadButtonClick_=this.onPadButtonClick_.bind(this),this.value=e.value,this.viewProps=e.viewProps,this.foldable_=Co.create(e.expanded),this.popC_=e.pickerLayout==="popup"?new Op(t,{viewProps:this.viewProps}):null;const s=new Tb(t,{layout:e.pickerLayout,props:new Ft({invertsY:ue(e.invertsY),max:ue(e.max),xKeyScale:e.axes[0].textProps.value("keyScale"),yKeyScale:e.axes[1].textProps.value("keyScale")}),value:this.value,viewProps:this.viewProps});s.view.allFocusableElements.forEach(o=>{o.addEventListener("blur",this.onPopupChildBlur_),o.addEventListener("keydown",this.onPopupChildKeydown_)}),this.pickerC_=s,this.textC_=new iu(t,{assembly:hm,axes:e.axes,parser:e.parser,value:this.value,viewProps:this.viewProps}),this.view=new Eb(t,{expanded:this.foldable_.value("expanded"),pickerLayout:e.pickerLayout,viewProps:this.viewProps}),this.view.textElement.appendChild(this.textC_.view.element),(i=this.view.buttonElement)===null||i===void 0||i.addEventListener("blur",this.onPadButtonBlur_),(r=this.view.buttonElement)===null||r===void 0||r.addEventListener("click",this.onPadButtonClick_),this.popC_?(this.view.element.appendChild(this.popC_.view.element),this.popC_.view.element.appendChild(this.pickerC_.view.element),Ls({primary:this.foldable_.value("expanded"),secondary:this.popC_.shows,forward:o=>o,backward:(o,a)=>a})):this.view.pickerElement&&(this.view.pickerElement.appendChild(this.pickerC_.view.element),Xh(this.foldable_,this.view.pickerElement))}get textController(){return this.textC_}onPadButtonBlur_(t){if(!this.popC_)return;const e=this.view.element,i=t.relatedTarget;(!i||!e.contains(i))&&(this.popC_.shows.rawValue=!1)}onPadButtonClick_(){this.foldable_.set("expanded",!this.foldable_.get("expanded")),this.foldable_.get("expanded")&&this.pickerC_.view.allFocusableElements[0].focus()}onPopupChildBlur_(t){if(!this.popC_)return;const e=this.popC_.view.element,i=Cp(t);i&&e.contains(i)||i&&i===this.view.buttonElement&&!Bh(e.ownerDocument)||(this.popC_.shows.rawValue=!1)}onPopupChildKeydown_(t){this.popC_?t.key==="Escape"&&(this.popC_.shows.rawValue=!1):this.view.pickerElement&&t.key==="Escape"&&this.view.buttonElement.focus()}}function Ab(n){return tr.isObject(n)?new tr(n.x,n.y):new tr}function Pb(n,t){n.writeProperty("x",t.x),n.writeProperty("y",t.y)}function Rb(n,t){return new nu({assembly:hm,components:[bi(Object.assign(Object.assign({},n),n.x),t.x),bi(Object.assign(Object.assign({},n),n.y),t.y)]})}function Sd(n,t){var e,i;if(!ce(n.min)||!ce(n.max))return Math.max(Math.abs((e=n.min)!==null&&e!==void 0?e:0),Math.abs((i=n.max)!==null&&i!==void 0?i:0));const r=vp(n);return Math.max(Math.abs(r)*10,Math.abs(t)*10)}function Lb(n,t){var e,i;const r=Sd(Rr(n,(e=n.x)!==null&&e!==void 0?e:{}),t.x),s=Sd(Rr(n,(i=n.y)!==null&&i!==void 0?i:{}),t.y);return Math.max(r,s)}function Db(n){if(!("y"in n))return!1;const t=n.y;return t&&"inverted"in t?!!t.inverted:!1}const Ib=tn({id:"input-point2d",type:"input",accept:(n,t)=>{if(!tr.isObject(n))return null;const e=me(t,i=>Object.assign(Object.assign({},uo(i)),{expanded:i.optional.boolean,picker:i.optional.custom(Hp),readonly:i.optional.constant(!1),x:i.optional.custom(Ki),y:i.optional.object(Object.assign(Object.assign({},uo(i)),{inverted:i.optional.boolean}))}));return e?{initialValue:n,params:e}:null},binding:{reader:()=>Ab,constraint:n=>Rb(n.params,n.initialValue),equals:tr.equals,writer:()=>Pb},controller:n=>{var t,e;const i=n.document,r=n.value,s=n.constraint,o=[n.params.x,n.params.y];return new Cb(i,{axes:r.rawValue.getComponents().map((a,l)=>{var c;return kh({constraint:s.components[l],initialValue:a,params:Rr(n.params,(c=o[l])!==null&&c!==void 0?c:{})})}),expanded:(t=n.params.expanded)!==null&&t!==void 0?t:!1,invertsY:Db(n.params),max:Lb(n.params,r.rawValue),parser:Ti,pickerLayout:(e=n.params.picker)!==null&&e!==void 0?e:"popup",value:r,viewProps:n.viewProps})}});class hs{constructor(t=0,e=0,i=0){this.x=t,this.y=e,this.z=i}getComponents(){return[this.x,this.y,this.z]}static isObject(t){if(ce(t))return!1;const e=t.x,i=t.y,r=t.z;return!(typeof e!="number"||typeof i!="number"||typeof r!="number")}static equals(t,e){return t.x===e.x&&t.y===e.y&&t.z===e.z}toObject(){return{x:this.x,y:this.y,z:this.z}}}const um={toComponents:n=>n.getComponents(),fromComponents:n=>new hs(...n)};function Ub(n){return hs.isObject(n)?new hs(n.x,n.y,n.z):new hs}function Nb(n,t){n.writeProperty("x",t.x),n.writeProperty("y",t.y),n.writeProperty("z",t.z)}function Ob(n,t){return new nu({assembly:um,components:[bi(Object.assign(Object.assign({},n),n.x),t.x),bi(Object.assign(Object.assign({},n),n.y),t.y),bi(Object.assign(Object.assign({},n),n.z),t.z)]})}const Fb=tn({id:"input-point3d",type:"input",accept:(n,t)=>{if(!hs.isObject(n))return null;const e=me(t,i=>Object.assign(Object.assign({},uo(i)),{readonly:i.optional.constant(!1),x:i.optional.custom(Ki),y:i.optional.custom(Ki),z:i.optional.custom(Ki)}));return e?{initialValue:n,params:e}:null},binding:{reader:n=>Ub,constraint:n=>Ob(n.params,n.initialValue),equals:hs.equals,writer:n=>Nb},controller:n=>{const t=n.value,e=n.constraint,i=[n.params.x,n.params.y,n.params.z];return new iu(n.document,{assembly:um,axes:t.rawValue.getComponents().map((r,s)=>{var o;return kh({constraint:e.components[s],initialValue:r,params:Rr(n.params,(o=i[s])!==null&&o!==void 0?o:{})})}),parser:Ti,value:t,viewProps:n.viewProps})}});class us{constructor(t=0,e=0,i=0,r=0){this.x=t,this.y=e,this.z=i,this.w=r}getComponents(){return[this.x,this.y,this.z,this.w]}static isObject(t){if(ce(t))return!1;const e=t.x,i=t.y,r=t.z,s=t.w;return!(typeof e!="number"||typeof i!="number"||typeof r!="number"||typeof s!="number")}static equals(t,e){return t.x===e.x&&t.y===e.y&&t.z===e.z&&t.w===e.w}toObject(){return{x:this.x,y:this.y,z:this.z,w:this.w}}}const dm={toComponents:n=>n.getComponents(),fromComponents:n=>new us(...n)};function kb(n){return us.isObject(n)?new us(n.x,n.y,n.z,n.w):new us}function Bb(n,t){n.writeProperty("x",t.x),n.writeProperty("y",t.y),n.writeProperty("z",t.z),n.writeProperty("w",t.w)}function Vb(n,t){return new nu({assembly:dm,components:[bi(Object.assign(Object.assign({},n),n.x),t.x),bi(Object.assign(Object.assign({},n),n.y),t.y),bi(Object.assign(Object.assign({},n),n.z),t.z),bi(Object.assign(Object.assign({},n),n.w),t.w)]})}const zb=tn({id:"input-point4d",type:"input",accept:(n,t)=>{if(!us.isObject(n))return null;const e=me(t,i=>Object.assign(Object.assign({},uo(i)),{readonly:i.optional.constant(!1),w:i.optional.custom(Ki),x:i.optional.custom(Ki),y:i.optional.custom(Ki),z:i.optional.custom(Ki)}));return e?{initialValue:n,params:e}:null},binding:{reader:n=>kb,constraint:n=>Vb(n.params,n.initialValue),equals:us.equals,writer:n=>Bb},controller:n=>{const t=n.value,e=n.constraint,i=[n.params.x,n.params.y,n.params.z,n.params.w];return new iu(n.document,{assembly:dm,axes:t.rawValue.getComponents().map((r,s)=>{var o;return kh({constraint:e.components[s],initialValue:r,params:Rr(n.params,(o=i[s])!==null&&o!==void 0?o:{})})}),parser:Ti,value:t,viewProps:n.viewProps})}});function Hb(n){const t=[],e=$h(n.options);return e&&t.push(e),new Ao(t)}const Gb=tn({id:"input-string",type:"input",accept:(n,t)=>{if(typeof n!="string")return null;const e=me(t,i=>({readonly:i.optional.constant(!1),options:i.optional.custom(Ro)}));return e?{initialValue:n,params:e}:null},binding:{reader:n=>kp,constraint:n=>Hb(n.params),writer:n=>Do},controller:n=>{const t=n.document,e=n.value,i=n.constraint,r=i&&Fa(i,Po);return r?new ir(t,{props:new Ft({options:r.values.value("options")}),value:e,viewProps:n.viewProps}):new co(t,{parser:s=>s,props:Ft.fromObject({formatter:Cc}),value:e,viewProps:n.viewProps})},api(n){return typeof n.controller.value.rawValue!="string"?null:n.controller.valueController instanceof ir?new qh(n.controller):null}}),Uo={monitor:{defaultInterval:200,defaultRows:3}},Ed=qt("mll");class Wb{constructor(t,e){this.onValueUpdate_=this.onValueUpdate_.bind(this),this.formatter_=e.formatter,this.element=t.createElement("div"),this.element.classList.add(Ed()),e.viewProps.bindClassModifiers(this.element);const i=t.createElement("textarea");i.classList.add(Ed("i")),i.style.height=`calc(var(${zp("containerUnitSize")}) * ${e.rows})`,i.readOnly=!0,e.viewProps.bindDisabled(i),this.element.appendChild(i),this.textareaElem_=i,e.value.emitter.on("change",this.onValueUpdate_),this.value=e.value,this.update_()}update_(){const t=this.textareaElem_,e=t.scrollTop===t.scrollHeight-t.clientHeight,i=[];this.value.rawValue.forEach(r=>{r!==void 0&&i.push(this.formatter_(r))}),t.textContent=i.join(`
`),e&&(t.scrollTop=t.scrollHeight)}onValueUpdate_(){this.update_()}}class ru{constructor(t,e){this.value=e.value,this.viewProps=e.viewProps,this.view=new Wb(t,{formatter:e.formatter,rows:e.rows,value:this.value,viewProps:this.viewProps})}}const Md=qt("sgl");class Xb{constructor(t,e){this.onValueUpdate_=this.onValueUpdate_.bind(this),this.formatter_=e.formatter,this.element=t.createElement("div"),this.element.classList.add(Md()),e.viewProps.bindClassModifiers(this.element);const i=t.createElement("input");i.classList.add(Md("i")),i.readOnly=!0,i.type="text",e.viewProps.bindDisabled(i),this.element.appendChild(i),this.inputElement=i,e.value.emitter.on("change",this.onValueUpdate_),this.value=e.value,this.update_()}update_(){const t=this.value.rawValue,e=t[t.length-1];this.inputElement.value=e!==void 0?this.formatter_(e):""}onValueUpdate_(){this.update_()}}class su{constructor(t,e){this.value=e.value,this.viewProps=e.viewProps,this.view=new Xb(t,{formatter:e.formatter,value:this.value,viewProps:this.viewProps})}}const qb=tn({id:"monitor-bool",type:"monitor",accept:(n,t)=>{if(typeof n!="boolean")return null;const e=me(t,i=>({readonly:i.required.constant(!0),rows:i.optional.number}));return e?{initialValue:n,params:e}:null},binding:{reader:n=>Fp},controller:n=>{var t;return n.value.rawValue.length===1?new su(n.document,{formatter:gd,value:n.value,viewProps:n.viewProps}):new ru(n.document,{formatter:gd,rows:(t=n.params.rows)!==null&&t!==void 0?t:Uo.monitor.defaultRows,value:n.value,viewProps:n.viewProps})}});class Yb extends lo{get max(){return this.controller.valueController.props.get("max")}set max(t){this.controller.valueController.props.set("max",t)}get min(){return this.controller.valueController.props.get("min")}set min(t){this.controller.valueController.props.set("min",t)}}const Vi=qt("grl");class $b{constructor(t,e){this.onCursorChange_=this.onCursorChange_.bind(this),this.onValueUpdate_=this.onValueUpdate_.bind(this),this.element=t.createElement("div"),this.element.classList.add(Vi()),e.viewProps.bindClassModifiers(this.element),this.formatter_=e.formatter,this.props_=e.props,this.cursor_=e.cursor,this.cursor_.emitter.on("change",this.onCursorChange_);const i=t.createElementNS(jn,"svg");i.classList.add(Vi("g")),i.style.height=`calc(var(${zp("containerUnitSize")}) * ${e.rows})`,this.element.appendChild(i),this.svgElem_=i;const r=t.createElementNS(jn,"polyline");this.svgElem_.appendChild(r),this.lineElem_=r;const s=t.createElement("div");s.classList.add(Vi("t"),qt("tt")()),this.element.appendChild(s),this.tooltipElem_=s,e.value.emitter.on("change",this.onValueUpdate_),this.value=e.value,this.update_()}get graphElement(){return this.svgElem_}update_(){const{clientWidth:t,clientHeight:e}=this.element,i=this.value.rawValue.length-1,r=this.props_.get("min"),s=this.props_.get("max"),o=[];this.value.rawValue.forEach((d,u)=>{if(d===void 0)return;const f=jt(u,0,i,0,t),_=jt(d,r,s,e,0);o.push([f,_].join(","))}),this.lineElem_.setAttributeNS(null,"points",o.join(" "));const a=this.tooltipElem_,l=this.value.rawValue[this.cursor_.rawValue];if(l===void 0){a.classList.remove(Vi("t","a"));return}const c=jt(this.cursor_.rawValue,0,i,0,t),h=jt(l,r,s,e,0);a.style.left=`${c}px`,a.style.top=`${h}px`,a.textContent=`${this.formatter_(l)}`,a.classList.contains(Vi("t","a"))||(a.classList.add(Vi("t","a"),Vi("t","in")),Oa(a),a.classList.remove(Vi("t","in")))}onValueUpdate_(){this.update_()}onCursorChange_(){this.update_()}}class fm{constructor(t,e){if(this.onGraphMouseMove_=this.onGraphMouseMove_.bind(this),this.onGraphMouseLeave_=this.onGraphMouseLeave_.bind(this),this.onGraphPointerDown_=this.onGraphPointerDown_.bind(this),this.onGraphPointerMove_=this.onGraphPointerMove_.bind(this),this.onGraphPointerUp_=this.onGraphPointerUp_.bind(this),this.props=e.props,this.value=e.value,this.viewProps=e.viewProps,this.cursor_=ue(-1),this.view=new $b(t,{cursor:this.cursor_,formatter:e.formatter,rows:e.rows,props:this.props,value:this.value,viewProps:this.viewProps}),!Bh(t))this.view.element.addEventListener("mousemove",this.onGraphMouseMove_),this.view.element.addEventListener("mouseleave",this.onGraphMouseLeave_);else{const i=new Fr(this.view.element);i.emitter.on("down",this.onGraphPointerDown_),i.emitter.on("move",this.onGraphPointerMove_),i.emitter.on("up",this.onGraphPointerUp_)}}importProps(t){return Tn(t,null,e=>({max:e.required.number,min:e.required.number}),e=>(this.props.set("max",e.max),this.props.set("min",e.min),!0))}exportProps(){return Cn(null,{max:this.props.get("max"),min:this.props.get("min")})}onGraphMouseLeave_(){this.cursor_.rawValue=-1}onGraphMouseMove_(t){const{clientWidth:e}=this.view.element;this.cursor_.rawValue=Math.floor(jt(t.offsetX,0,e,0,this.value.rawValue.length))}onGraphPointerDown_(t){this.onGraphPointerMove_(t)}onGraphPointerMove_(t){if(!t.data.point){this.cursor_.rawValue=-1;return}this.cursor_.rawValue=Math.floor(jt(t.data.point.x,0,t.data.bounds.width,0,this.value.rawValue.length))}onGraphPointerUp_(){this.cursor_.rawValue=-1}}function Ac(n){return ce(n.format)?un(2):n.format}function Kb(n){var t;return n.value.rawValue.length===1?new su(n.document,{formatter:Ac(n.params),value:n.value,viewProps:n.viewProps}):new ru(n.document,{formatter:Ac(n.params),rows:(t=n.params.rows)!==null&&t!==void 0?t:Uo.monitor.defaultRows,value:n.value,viewProps:n.viewProps})}function Zb(n){var t,e,i;return new fm(n.document,{formatter:Ac(n.params),rows:(t=n.params.rows)!==null&&t!==void 0?t:Uo.monitor.defaultRows,props:Ft.fromObject({max:(e=n.params.max)!==null&&e!==void 0?e:100,min:(i=n.params.min)!==null&&i!==void 0?i:0}),value:n.value,viewProps:n.viewProps})}function Td(n){return n.view==="graph"}const Jb=tn({id:"monitor-number",type:"monitor",accept:(n,t)=>{if(typeof n!="number")return null;const e=me(t,i=>({format:i.optional.function,max:i.optional.number,min:i.optional.number,readonly:i.required.constant(!0),rows:i.optional.number,view:i.optional.string}));return e?{initialValue:n,params:e}:null},binding:{defaultBufferSize:n=>Td(n)?64:1,reader:n=>_p},controller:n=>Td(n.params)?Zb(n):Kb(n),api:n=>n.controller.valueController instanceof fm?new Yb(n.controller):null}),jb=tn({id:"monitor-string",type:"monitor",accept:(n,t)=>{if(typeof n!="string")return null;const e=me(t,i=>({multiline:i.optional.boolean,readonly:i.required.constant(!0),rows:i.optional.number}));return e?{initialValue:n,params:e}:null},binding:{reader:n=>kp},controller:n=>{var t;const e=n.value;return e.rawValue.length>1||n.params.multiline?new ru(n.document,{formatter:Cc,rows:(t=n.params.rows)!==null&&t!==void 0?t:Uo.monitor.defaultRows,value:e,viewProps:n.viewProps}):new su(n.document,{formatter:Cc,value:e,viewProps:n.viewProps})}});class Qb{constructor(){this.map_=new Map}get(t){var e;return(e=this.map_.get(t))!==null&&e!==void 0?e:null}has(t){return this.map_.has(t)}add(t,e){return this.map_.set(t,e),t.viewProps.handleDispose(()=>{this.map_.delete(t)}),e}}class ty{constructor(t){this.target=t.target,this.reader_=t.reader,this.writer_=t.writer}read(){return this.reader_(this.target.read())}write(t){this.writer_(this.target,t)}inject(t){this.write(this.reader_(t))}}function ey(n,t){var e;const i=n.accept(t.target.read(),t.params);if(ce(i))return null;const r={target:t.target,initialValue:i.initialValue,params:i.params},s=me(t.params,d=>({disabled:d.optional.boolean,hidden:d.optional.boolean,label:d.optional.string,tag:d.optional.string})),o=n.binding.reader(r),a=n.binding.constraint?n.binding.constraint(r):void 0,l=new ty({reader:o,target:t.target,writer:n.binding.writer(r)}),c=new kv(ue(o(i.initialValue),{constraint:a,equals:n.binding.equals}),l),h=n.controller({constraint:a,document:t.document,initialValue:i.initialValue,params:i.params,value:c,viewProps:Di.create({disabled:s?.disabled,hidden:s?.hidden})});return new Qv(t.document,{blade:Rs(),props:Ft.fromObject({label:"label"in t.params?(e=s?.label)!==null&&e!==void 0?e:null:t.target.key}),tag:s?.tag,value:c,valueController:h})}class ny{constructor(t){this.target=t.target,this.reader_=t.reader}read(){return this.reader_(this.target.read())}}function iy(n,t){return t===0?new N0:new O0(n,t??Uo.monitor.defaultInterval)}function ry(n,t){var e,i,r;const s=n.accept(t.target.read(),t.params);if(ce(s))return null;const o={target:t.target,initialValue:s.initialValue,params:s.params},a=me(t.params,u=>({bufferSize:u.optional.number,disabled:u.optional.boolean,hidden:u.optional.boolean,interval:u.optional.number,label:u.optional.string})),l=n.binding.reader(o),c=(i=(e=a?.bufferSize)!==null&&e!==void 0?e:n.binding.defaultBufferSize&&n.binding.defaultBufferSize(s.params))!==null&&i!==void 0?i:1,h=new r0({binding:new ny({reader:l,target:t.target}),bufferSize:c,ticker:iy(t.document,a?.interval)}),d=n.controller({document:t.document,params:s.params,value:h,viewProps:Di.create({disabled:a?.disabled,hidden:a?.hidden})});return d.viewProps.bindDisabled(h.ticker),d.viewProps.handleDispose(()=>{h.ticker.dispose()}),new o0(t.document,{blade:Rs(),props:Ft.fromObject({label:"label"in t.params?(r=a?.label)!==null&&r!==void 0?r:null:t.target.key}),value:h,valueController:d})}class sy{constructor(t){this.pluginsMap_={blades:[],inputs:[],monitors:[]},this.apiCache_=t}getAll(){return[...this.pluginsMap_.blades,...this.pluginsMap_.inputs,...this.pluginsMap_.monitors]}register(t,e){if(!K0(e.core))throw xe.notCompatible(t,e.id);e.type==="blade"?this.pluginsMap_.blades.unshift(e):e.type==="input"?this.pluginsMap_.inputs.unshift(e):e.type==="monitor"&&this.pluginsMap_.monitors.unshift(e)}createInput_(t,e,i){return this.pluginsMap_.inputs.reduce((r,s)=>r??ey(s,{document:t,target:e,params:i}),null)}createMonitor_(t,e,i){return this.pluginsMap_.monitors.reduce((r,s)=>r??ry(s,{document:t,params:i,target:e}),null)}createBinding(t,e,i){const r=e.read();if(ce(r))throw new xe({context:{key:e.key},type:"nomatchingcontroller"});const s=this.createInput_(t,e,i);if(s)return s;const o=this.createMonitor_(t,e,i);if(o)return o;throw new xe({context:{key:e.key},type:"nomatchingcontroller"})}createBlade(t,e){const i=this.pluginsMap_.blades.reduce((r,s)=>r??U0(s,{document:t,params:e}),null);if(!i)throw new xe({type:"nomatchingview",context:{params:e}});return i}createInputBindingApi_(t){const e=this.pluginsMap_.inputs.reduce((i,r)=>{var s,o;return i||((o=(s=r.api)===null||s===void 0?void 0:s.call(r,{controller:t}))!==null&&o!==void 0?o:null)},null);return this.apiCache_.add(t,e??new lo(t))}createMonitorBindingApi_(t){const e=this.pluginsMap_.monitors.reduce((i,r)=>{var s,o;return i||((o=(s=r.api)===null||s===void 0?void 0:s.call(r,{controller:t}))!==null&&o!==void 0?o:null)},null);return this.apiCache_.add(t,e??new lo(t))}createBindingApi(t){if(this.apiCache_.has(t))return this.apiCache_.get(t);if(t0(t))return this.createInputBindingApi_(t);if(a0(t))return this.createMonitorBindingApi_(t);throw xe.shouldNeverHappen()}createApi(t){if(this.apiCache_.has(t))return this.apiCache_.get(t);if(jv(t))return this.createBindingApi(t);const e=this.pluginsMap_.blades.reduce((i,r)=>i??r.api({controller:t,pool:this}),null);if(!e)throw xe.shouldNeverHappen();return this.apiCache_.add(t,e)}}const oy=new Qb;function ay(){const n=new sy(oy);return[Ib,Fb,zb,Gb,Sb,vb,gb,db,Q0,qb,jb,Jb,d0,M0,Np].forEach(t=>{n.register("core",t)}),n}class ly extends Or{constructor(t){super(t),this.emitter_=new Le,this.controller.value.emitter.on("change",e=>{this.emitter_.emit("change",new To(this,e.rawValue))})}get label(){return this.controller.labelController.props.get("label")}set label(t){this.controller.labelController.props.set("label",t)}get options(){return this.controller.valueController.props.get("options")}set options(t){this.controller.valueController.props.set("options",t)}get value(){return this.controller.value.rawValue}set value(t){this.controller.value.rawValue=t}on(t,e){const i=e.bind(this);return this.emitter_.on(t,r=>{i(r)},{key:e}),this}off(t,e){return this.emitter_.off(t,e),this}}class cy extends Or{}class hy extends Or{constructor(t){super(t),this.emitter_=new Le,this.controller.value.emitter.on("change",e=>{this.emitter_.emit("change",new To(this,e.rawValue))})}get label(){return this.controller.labelController.props.get("label")}set label(t){this.controller.labelController.props.set("label",t)}get max(){return this.controller.valueController.sliderController.props.get("max")}set max(t){this.controller.valueController.sliderController.props.set("max",t)}get min(){return this.controller.valueController.sliderController.props.get("min")}set min(t){this.controller.valueController.sliderController.props.set("min",t)}get value(){return this.controller.value.rawValue}set value(t){this.controller.value.rawValue=t}on(t,e){const i=e.bind(this);return this.emitter_.on(t,r=>{i(r)},{key:e}),this}off(t,e){return this.emitter_.off(t,e),this}}class uy extends Or{constructor(t){super(t),this.emitter_=new Le,this.controller.value.emitter.on("change",e=>{this.emitter_.emit("change",new To(this,e.rawValue))})}get label(){return this.controller.labelController.props.get("label")}set label(t){this.controller.labelController.props.set("label",t)}get formatter(){return this.controller.valueController.props.get("formatter")}set formatter(t){this.controller.valueController.props.set("formatter",t)}get value(){return this.controller.value.rawValue}set value(t){this.controller.value.rawValue=t}on(t,e){const i=e.bind(this);return this.emitter_.on(t,r=>{i(r)},{key:e}),this}off(t,e){return this.emitter_.off(t,e),this}}const dy=(function(){return{id:"list",type:"blade",core:Ps,accept(n){const t=me(n,e=>({options:e.required.custom(Ro),value:e.required.raw,view:e.required.constant("list"),label:e.optional.string}));return t?{params:t}:null},controller(n){const t=new Po(Yh(n.params.options)),e=ue(n.params.value,{constraint:t}),i=new ir(n.document,{props:new Ft({options:t.values.value("options")}),value:e,viewProps:n.viewProps});return new Lr(n.document,{blade:n.blade,props:Ft.fromObject({label:n.params.label}),value:e,valueController:i})},api(n){return!(n.controller instanceof Lr)||!(n.controller.valueController instanceof ir)?null:new ly(n.controller)}}})();class fy extends Ip{constructor(t,e){super(t,e)}get element(){return this.controller.view.element}}class py extends Mc{constructor(t,e){super(t,{expanded:e.expanded,blade:e.blade,props:e.props,root:!0,viewProps:e.viewProps})}}const Cd=qt("spr");class my{constructor(t,e){this.element=t.createElement("div"),this.element.classList.add(Cd()),e.viewProps.bindClassModifiers(this.element);const i=t.createElement("hr");i.classList.add(Cd("r")),this.element.appendChild(i)}}class Ad extends al{constructor(t,e){super(Object.assign(Object.assign({},e),{view:new my(t,{viewProps:e.viewProps})}))}}const _y={id:"separator",type:"blade",core:Ps,accept(n){const t=me(n,e=>({view:e.required.constant("separator")}));return t?{params:t}:null},controller(n){return new Ad(n.document,{blade:n.blade,viewProps:n.viewProps})},api(n){return n.controller instanceof Ad?new cy(n.controller):null}},gy={id:"slider",type:"blade",core:Ps,accept(n){const t=me(n,e=>({max:e.required.number,min:e.required.number,view:e.required.constant("slider"),format:e.optional.function,label:e.optional.string,value:e.optional.number}));return t?{params:t}:null},controller(n){var t,e;const i=(t=n.params.value)!==null&&t!==void 0?t:0,r=new Mo({max:n.params.max,min:n.params.min}),s=ue(i,{constraint:r}),o=new Ba(n.document,Object.assign(Object.assign({},Vp({formatter:(e=n.params.format)!==null&&e!==void 0?e:Iv,keyScale:ue(1),max:r.values.value("max"),min:r.values.value("min"),pointerScale:xp(n.params,i)})),{parser:Ti,value:s,viewProps:n.viewProps}));return new Lr(n.document,{blade:n.blade,props:Ft.fromObject({label:n.params.label}),value:s,valueController:o})},api(n){return!(n.controller instanceof Lr)||!(n.controller.valueController instanceof Ba)?null:new hy(n.controller)}},vy=(function(){return{id:"text",type:"blade",core:Ps,accept(n){const t=me(n,e=>({parse:e.required.function,value:e.required.raw,view:e.required.constant("text"),format:e.optional.function,label:e.optional.string}));return t?{params:t}:null},controller(n){var t;const e=ue(n.params.value),i=new co(n.document,{parser:n.params.parse,props:Ft.fromObject({formatter:(t=n.params.format)!==null&&t!==void 0?t:(r=>String(r))}),value:e,viewProps:n.viewProps});return new Lr(n.document,{blade:n.blade,props:Ft.fromObject({label:n.params.label}),value:e,valueController:i})},api(n){return!(n.controller instanceof Lr)||!(n.controller.valueController instanceof co)?null:new uy(n.controller)}}})();function xy(n){const t=n.createElement("div");return t.classList.add(qt("dfw")()),n.body&&n.body.appendChild(t),t}function by(n,t,e){if(n.querySelector(`style[data-tp-style=${t}]`))return;const i=n.createElement("style");i.dataset.tpStyle=t,i.textContent=e,n.head.appendChild(i)}class yy extends fy{constructor(t){var e,i;const r=t??{},s=(e=r.document)!==null&&e!==void 0?e:Xv(),o=ay(),a=new py(s,{expanded:r.expanded,blade:Rs(),props:Ft.fromObject({title:r.title}),viewProps:Di.create()});super(a,o),this.pool_=o,this.containerElem_=(i=r.container)!==null&&i!==void 0?i:xy(s),this.containerElem_.appendChild(this.element),this.doc_=s,this.usesDefaultWrapper_=!r.container,this.setUpDefaultPlugins_()}get document(){if(!this.doc_)throw xe.alreadyDisposed();return this.doc_}dispose(){const t=this.containerElem_;if(!t)throw xe.alreadyDisposed();if(this.usesDefaultWrapper_){const e=t.parentElement;e&&e.removeChild(t)}this.containerElem_=null,this.doc_=null,super.dispose()}registerPlugin(t){t.css&&by(this.document,`plugin-${t.id}`,t.css),("plugin"in t?[t.plugin]:"plugins"in t?t.plugins:[]).forEach(i=>{this.pool_.register(t.id,i)})}setUpDefaultPlugins_(){this.registerPlugin({id:"default",css:'.tp-tbiv_b,.tp-coltxtv_ms,.tp-colswv_b,.tp-ckbv_i,.tp-sglv_i,.tp-mllv_i,.tp-grlv_g,.tp-txtv_i,.tp-p2dpv_p,.tp-colswv_sw,.tp-rotv_b,.tp-fldv_b,.tp-p2dv_b,.tp-btnv_b,.tp-lstv_s{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:rgba(0,0,0,0);border-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0;outline:none;padding:0}.tp-p2dv_b,.tp-btnv_b,.tp-lstv_s{background-color:var(--btn-bg);border-radius:var(--bld-br);color:var(--btn-fg);cursor:pointer;display:block;font-weight:bold;height:var(--cnt-usz);line-height:var(--cnt-usz);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tp-p2dv_b:hover,.tp-btnv_b:hover,.tp-lstv_s:hover{background-color:var(--btn-bg-h)}.tp-p2dv_b:focus,.tp-btnv_b:focus,.tp-lstv_s:focus{background-color:var(--btn-bg-f)}.tp-p2dv_b:active,.tp-btnv_b:active,.tp-lstv_s:active{background-color:var(--btn-bg-a)}.tp-p2dv_b:disabled,.tp-btnv_b:disabled,.tp-lstv_s:disabled{opacity:.5}.tp-rotv_c>.tp-cntv.tp-v-lst,.tp-tbpv_c>.tp-cntv.tp-v-lst,.tp-fldv_c>.tp-cntv.tp-v-lst{margin-bottom:calc(-1*var(--cnt-vp))}.tp-rotv_c>.tp-fldv.tp-v-lst .tp-fldv_c,.tp-tbpv_c>.tp-fldv.tp-v-lst .tp-fldv_c,.tp-fldv_c>.tp-fldv.tp-v-lst .tp-fldv_c{border-bottom-left-radius:0}.tp-rotv_c>.tp-fldv.tp-v-lst .tp-fldv_b,.tp-tbpv_c>.tp-fldv.tp-v-lst .tp-fldv_b,.tp-fldv_c>.tp-fldv.tp-v-lst .tp-fldv_b{border-bottom-left-radius:0}.tp-rotv_c>*:not(.tp-v-fst),.tp-tbpv_c>*:not(.tp-v-fst),.tp-fldv_c>*:not(.tp-v-fst){margin-top:var(--cnt-usp)}.tp-rotv_c>.tp-sprv:not(.tp-v-fst),.tp-tbpv_c>.tp-sprv:not(.tp-v-fst),.tp-fldv_c>.tp-sprv:not(.tp-v-fst),.tp-rotv_c>.tp-cntv:not(.tp-v-fst),.tp-tbpv_c>.tp-cntv:not(.tp-v-fst),.tp-fldv_c>.tp-cntv:not(.tp-v-fst){margin-top:var(--cnt-vp)}.tp-rotv_c>.tp-sprv+*:not(.tp-v-hidden),.tp-tbpv_c>.tp-sprv+*:not(.tp-v-hidden),.tp-fldv_c>.tp-sprv+*:not(.tp-v-hidden),.tp-rotv_c>.tp-cntv+*:not(.tp-v-hidden),.tp-tbpv_c>.tp-cntv+*:not(.tp-v-hidden),.tp-fldv_c>.tp-cntv+*:not(.tp-v-hidden){margin-top:var(--cnt-vp)}.tp-rotv_c>.tp-sprv:not(.tp-v-hidden)+.tp-sprv,.tp-tbpv_c>.tp-sprv:not(.tp-v-hidden)+.tp-sprv,.tp-fldv_c>.tp-sprv:not(.tp-v-hidden)+.tp-sprv,.tp-rotv_c>.tp-cntv:not(.tp-v-hidden)+.tp-cntv,.tp-tbpv_c>.tp-cntv:not(.tp-v-hidden)+.tp-cntv,.tp-fldv_c>.tp-cntv:not(.tp-v-hidden)+.tp-cntv{margin-top:0}.tp-tbpv_c>.tp-cntv,.tp-fldv_c>.tp-cntv{margin-left:4px}.tp-tbpv_c>.tp-fldv>.tp-fldv_b,.tp-fldv_c>.tp-fldv>.tp-fldv_b{border-top-left-radius:var(--bld-br);border-bottom-left-radius:var(--bld-br)}.tp-tbpv_c>.tp-fldv.tp-fldv-expanded>.tp-fldv_b,.tp-fldv_c>.tp-fldv.tp-fldv-expanded>.tp-fldv_b{border-bottom-left-radius:0}.tp-tbpv_c .tp-fldv>.tp-fldv_c,.tp-fldv_c .tp-fldv>.tp-fldv_c{border-bottom-left-radius:var(--bld-br)}.tp-tbpv_c>.tp-cntv+.tp-fldv>.tp-fldv_b,.tp-fldv_c>.tp-cntv+.tp-fldv>.tp-fldv_b{border-top-left-radius:0}.tp-tbpv_c>.tp-cntv+.tp-tabv>.tp-tabv_t,.tp-fldv_c>.tp-cntv+.tp-tabv>.tp-tabv_t{border-top-left-radius:0}.tp-tbpv_c>.tp-tabv>.tp-tabv_t,.tp-fldv_c>.tp-tabv>.tp-tabv_t{border-top-left-radius:var(--bld-br)}.tp-tbpv_c .tp-tabv>.tp-tabv_c,.tp-fldv_c .tp-tabv>.tp-tabv_c{border-bottom-left-radius:var(--bld-br)}.tp-rotv_b,.tp-fldv_b{background-color:var(--cnt-bg);color:var(--cnt-fg);cursor:pointer;display:block;height:calc(var(--cnt-usz) + 4px);line-height:calc(var(--cnt-usz) + 4px);overflow:hidden;padding-left:var(--cnt-hp);padding-right:calc(4px + var(--cnt-usz) + var(--cnt-hp));position:relative;text-align:left;text-overflow:ellipsis;white-space:nowrap;width:100%;transition:border-radius .2s ease-in-out .2s}.tp-rotv_b:hover,.tp-fldv_b:hover{background-color:var(--cnt-bg-h)}.tp-rotv_b:focus,.tp-fldv_b:focus{background-color:var(--cnt-bg-f)}.tp-rotv_b:active,.tp-fldv_b:active{background-color:var(--cnt-bg-a)}.tp-rotv_b:disabled,.tp-fldv_b:disabled{opacity:.5}.tp-rotv_m,.tp-fldv_m{background:linear-gradient(to left, var(--cnt-fg), var(--cnt-fg) 2px, transparent 2px, transparent 4px, var(--cnt-fg) 4px);border-radius:2px;bottom:0;content:"";display:block;height:6px;right:calc(var(--cnt-hp) + (var(--cnt-usz) + 4px - 6px)/2 - 2px);margin:auto;opacity:.5;position:absolute;top:0;transform:rotate(90deg);transition:transform .2s ease-in-out;width:6px}.tp-rotv.tp-rotv-expanded .tp-rotv_m,.tp-fldv.tp-fldv-expanded>.tp-fldv_b>.tp-fldv_m{transform:none}.tp-rotv_c,.tp-fldv_c{box-sizing:border-box;height:0;opacity:0;overflow:hidden;padding-bottom:0;padding-top:0;position:relative;transition:height .2s ease-in-out,opacity .2s linear,padding .2s ease-in-out}.tp-rotv.tp-rotv-cpl:not(.tp-rotv-expanded) .tp-rotv_c,.tp-fldv.tp-fldv-cpl:not(.tp-fldv-expanded)>.tp-fldv_c{display:none}.tp-rotv.tp-rotv-expanded .tp-rotv_c,.tp-fldv.tp-fldv-expanded>.tp-fldv_c{opacity:1;padding-bottom:var(--cnt-vp);padding-top:var(--cnt-vp);transform:none;overflow:visible;transition:height .2s ease-in-out,opacity .2s linear .2s,padding .2s ease-in-out}.tp-txtv_i,.tp-p2dpv_p,.tp-colswv_sw{background-color:var(--in-bg);border-radius:var(--bld-br);box-sizing:border-box;color:var(--in-fg);font-family:inherit;height:var(--cnt-usz);line-height:var(--cnt-usz);min-width:0;width:100%}.tp-txtv_i:hover,.tp-p2dpv_p:hover,.tp-colswv_sw:hover{background-color:var(--in-bg-h)}.tp-txtv_i:focus,.tp-p2dpv_p:focus,.tp-colswv_sw:focus{background-color:var(--in-bg-f)}.tp-txtv_i:active,.tp-p2dpv_p:active,.tp-colswv_sw:active{background-color:var(--in-bg-a)}.tp-txtv_i:disabled,.tp-p2dpv_p:disabled,.tp-colswv_sw:disabled{opacity:.5}.tp-lstv,.tp-coltxtv_m{position:relative}.tp-lstv_s{padding:0 20px 0 4px;width:100%}.tp-lstv_m,.tp-coltxtv_mm{bottom:0;margin:auto;pointer-events:none;position:absolute;right:2px;top:0}.tp-lstv_m svg,.tp-coltxtv_mm svg{bottom:0;height:16px;margin:auto;position:absolute;right:0;top:0;width:16px}.tp-lstv_m svg path,.tp-coltxtv_mm svg path{fill:currentColor}.tp-sglv_i,.tp-mllv_i,.tp-grlv_g{background-color:var(--mo-bg);border-radius:var(--bld-br);box-sizing:border-box;color:var(--mo-fg);height:var(--cnt-usz);scrollbar-color:currentColor rgba(0,0,0,0);scrollbar-width:thin;width:100%}.tp-sglv_i::-webkit-scrollbar,.tp-mllv_i::-webkit-scrollbar,.tp-grlv_g::-webkit-scrollbar{height:8px;width:8px}.tp-sglv_i::-webkit-scrollbar-corner,.tp-mllv_i::-webkit-scrollbar-corner,.tp-grlv_g::-webkit-scrollbar-corner{background-color:rgba(0,0,0,0)}.tp-sglv_i::-webkit-scrollbar-thumb,.tp-mllv_i::-webkit-scrollbar-thumb,.tp-grlv_g::-webkit-scrollbar-thumb{background-clip:padding-box;background-color:currentColor;border:rgba(0,0,0,0) solid 2px;border-radius:4px}.tp-pndtxtv,.tp-coltxtv_w{display:flex}.tp-pndtxtv_a,.tp-coltxtv_c{width:100%}.tp-pndtxtv_a+.tp-pndtxtv_a,.tp-coltxtv_c+.tp-pndtxtv_a,.tp-pndtxtv_a+.tp-coltxtv_c,.tp-coltxtv_c+.tp-coltxtv_c{margin-left:2px}.tp-rotv{--bs-bg: var(--tp-base-background-color, hsl(230, 7%, 17%));--bs-br: var(--tp-base-border-radius, 6px);--bs-ff: var(--tp-base-font-family, Roboto Mono, Source Code Pro, Menlo, Courier, monospace);--bs-sh: var(--tp-base-shadow-color, rgba(0, 0, 0, 0.2));--bld-br: var(--tp-blade-border-radius, 2px);--bld-hp: var(--tp-blade-horizontal-padding, 4px);--bld-vw: var(--tp-blade-value-width, 160px);--btn-bg: var(--tp-button-background-color, hsl(230, 7%, 70%));--btn-bg-a: var(--tp-button-background-color-active, #d6d7db);--btn-bg-f: var(--tp-button-background-color-focus, #c8cad0);--btn-bg-h: var(--tp-button-background-color-hover, #bbbcc4);--btn-fg: var(--tp-button-foreground-color, hsl(230, 7%, 17%));--cnt-bg: var(--tp-container-background-color, rgba(187, 188, 196, 0.1));--cnt-bg-a: var(--tp-container-background-color-active, rgba(187, 188, 196, 0.25));--cnt-bg-f: var(--tp-container-background-color-focus, rgba(187, 188, 196, 0.2));--cnt-bg-h: var(--tp-container-background-color-hover, rgba(187, 188, 196, 0.15));--cnt-fg: var(--tp-container-foreground-color, hsl(230, 7%, 75%));--cnt-hp: var(--tp-container-horizontal-padding, 4px);--cnt-vp: var(--tp-container-vertical-padding, 4px);--cnt-usp: var(--tp-container-unit-spacing, 4px);--cnt-usz: var(--tp-container-unit-size, 20px);--in-bg: var(--tp-input-background-color, rgba(187, 188, 196, 0.1));--in-bg-a: var(--tp-input-background-color-active, rgba(187, 188, 196, 0.25));--in-bg-f: var(--tp-input-background-color-focus, rgba(187, 188, 196, 0.2));--in-bg-h: var(--tp-input-background-color-hover, rgba(187, 188, 196, 0.15));--in-fg: var(--tp-input-foreground-color, hsl(230, 7%, 75%));--lbl-fg: var(--tp-label-foreground-color, rgba(187, 188, 196, 0.7));--mo-bg: var(--tp-monitor-background-color, rgba(0, 0, 0, 0.2));--mo-fg: var(--tp-monitor-foreground-color, rgba(187, 188, 196, 0.7));--grv-fg: var(--tp-groove-foreground-color, rgba(187, 188, 196, 0.1))}.tp-btnv_b{width:100%}.tp-btnv_t{text-align:center}.tp-ckbv_l{display:block;position:relative}.tp-ckbv_i{left:0;opacity:0;position:absolute;top:0}.tp-ckbv_w{background-color:var(--in-bg);border-radius:var(--bld-br);cursor:pointer;display:block;height:var(--cnt-usz);position:relative;width:var(--cnt-usz)}.tp-ckbv_w svg{display:block;height:16px;inset:0;margin:auto;opacity:0;position:absolute;width:16px}.tp-ckbv_w svg path{fill:none;stroke:var(--in-fg);stroke-width:2}.tp-ckbv_i:hover+.tp-ckbv_w{background-color:var(--in-bg-h)}.tp-ckbv_i:focus+.tp-ckbv_w{background-color:var(--in-bg-f)}.tp-ckbv_i:active+.tp-ckbv_w{background-color:var(--in-bg-a)}.tp-ckbv_i:checked+.tp-ckbv_w svg{opacity:1}.tp-ckbv.tp-v-disabled .tp-ckbv_w{opacity:.5}.tp-colv{position:relative}.tp-colv_h{display:flex}.tp-colv_s{flex-grow:0;flex-shrink:0;width:var(--cnt-usz)}.tp-colv_t{flex:1;margin-left:4px}.tp-colv_p{height:0;margin-top:0;opacity:0;overflow:hidden;transition:height .2s ease-in-out,opacity .2s linear,margin .2s ease-in-out}.tp-colv.tp-colv-expanded.tp-colv-cpl .tp-colv_p{overflow:visible}.tp-colv.tp-colv-expanded .tp-colv_p{margin-top:var(--cnt-usp);opacity:1}.tp-colv .tp-popv{left:calc(-1*var(--cnt-hp));right:calc(-1*var(--cnt-hp));top:var(--cnt-usz)}.tp-colpv_h,.tp-colpv_ap{margin-left:6px;margin-right:6px}.tp-colpv_h{margin-top:var(--cnt-usp)}.tp-colpv_rgb{display:flex;margin-top:var(--cnt-usp);width:100%}.tp-colpv_a{display:flex;margin-top:var(--cnt-vp);padding-top:calc(var(--cnt-vp) + 2px);position:relative}.tp-colpv_a::before{background-color:var(--grv-fg);content:"";height:2px;left:calc(-1*var(--cnt-hp));position:absolute;right:calc(-1*var(--cnt-hp));top:0}.tp-colpv.tp-v-disabled .tp-colpv_a::before{opacity:.5}.tp-colpv_ap{align-items:center;display:flex;flex:3}.tp-colpv_at{flex:1;margin-left:4px}.tp-svpv{border-radius:var(--bld-br);outline:none;overflow:hidden;position:relative}.tp-svpv.tp-v-disabled{opacity:.5}.tp-svpv_c{cursor:crosshair;display:block;height:calc(var(--cnt-usz)*4);width:100%}.tp-svpv_m{border-radius:100%;border:rgba(255,255,255,.75) solid 2px;box-sizing:border-box;filter:drop-shadow(0 0 1px rgba(0, 0, 0, 0.3));height:12px;margin-left:-6px;margin-top:-6px;pointer-events:none;position:absolute;width:12px}.tp-svpv:focus .tp-svpv_m{border-color:#fff}.tp-hplv{cursor:pointer;height:var(--cnt-usz);outline:none;position:relative}.tp-hplv.tp-v-disabled{opacity:.5}.tp-hplv_c{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAABCAYAAABubagXAAAAQ0lEQVQoU2P8z8Dwn0GCgQEDi2OK/RBgYHjBgIpfovFh8j8YBIgzFGQxuqEgPhaDOT5gOhPkdCxOZeBg+IDFZZiGAgCaSSMYtcRHLgAAAABJRU5ErkJggg==);background-position:left top;background-repeat:no-repeat;background-size:100% 100%;border-radius:2px;display:block;height:4px;left:0;margin-top:-2px;position:absolute;top:50%;width:100%}.tp-hplv_m{border-radius:var(--bld-br);border:rgba(255,255,255,.75) solid 2px;box-shadow:0 0 2px rgba(0,0,0,.1);box-sizing:border-box;height:12px;left:50%;margin-left:-6px;margin-top:-6px;position:absolute;top:50%;width:12px}.tp-hplv:focus .tp-hplv_m{border-color:#fff}.tp-aplv{cursor:pointer;height:var(--cnt-usz);outline:none;position:relative;width:100%}.tp-aplv.tp-v-disabled{opacity:.5}.tp-aplv_b{background-color:#fff;background-image:linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);background-size:4px 4px;background-position:0 0,2px 2px;border-radius:2px;display:block;height:4px;left:0;margin-top:-2px;overflow:hidden;position:absolute;top:50%;width:100%}.tp-aplv_c{inset:0;position:absolute}.tp-aplv_m{background-color:#fff;background-image:linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);background-size:12px 12px;background-position:0 0,6px 6px;border-radius:var(--bld-br);box-shadow:0 0 2px rgba(0,0,0,.1);height:12px;left:50%;margin-left:-6px;margin-top:-6px;overflow:hidden;position:absolute;top:50%;width:12px}.tp-aplv_p{border-radius:var(--bld-br);border:rgba(255,255,255,.75) solid 2px;box-sizing:border-box;inset:0;position:absolute}.tp-aplv:focus .tp-aplv_p{border-color:#fff}.tp-colswv{background-color:#fff;background-image:linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);background-size:10px 10px;background-position:0 0,5px 5px;border-radius:var(--bld-br);overflow:hidden}.tp-colswv.tp-v-disabled{opacity:.5}.tp-colswv_sw{border-radius:0}.tp-colswv_b{cursor:pointer;display:block;height:var(--cnt-usz);left:0;position:absolute;top:0;width:var(--cnt-usz)}.tp-colswv_b:focus::after{border:rgba(255,255,255,.75) solid 2px;border-radius:var(--bld-br);content:"";display:block;inset:0;position:absolute}.tp-coltxtv{display:flex;width:100%}.tp-coltxtv_m{margin-right:4px}.tp-coltxtv_ms{border-radius:var(--bld-br);color:var(--lbl-fg);cursor:pointer;height:var(--cnt-usz);line-height:var(--cnt-usz);padding:0 18px 0 4px}.tp-coltxtv_ms:hover{background-color:var(--in-bg-h)}.tp-coltxtv_ms:focus{background-color:var(--in-bg-f)}.tp-coltxtv_ms:active{background-color:var(--in-bg-a)}.tp-coltxtv_mm{color:var(--lbl-fg)}.tp-coltxtv.tp-v-disabled .tp-coltxtv_mm{opacity:.5}.tp-coltxtv_w{flex:1}.tp-dfwv{position:absolute;top:8px;right:8px;width:256px}.tp-fldv{position:relative}.tp-fldv_t{padding-left:4px}.tp-fldv_b:disabled .tp-fldv_m{display:none}.tp-fldv_c{padding-left:4px}.tp-fldv_i{bottom:0;color:var(--cnt-bg);left:0;overflow:hidden;position:absolute;top:calc(var(--cnt-usz) + 4px);width:max(var(--bs-br),4px)}.tp-fldv_i::before{background-color:currentColor;bottom:0;content:"";left:0;position:absolute;top:0;width:4px}.tp-fldv_b:hover+.tp-fldv_i{color:var(--cnt-bg-h)}.tp-fldv_b:focus+.tp-fldv_i{color:var(--cnt-bg-f)}.tp-fldv_b:active+.tp-fldv_i{color:var(--cnt-bg-a)}.tp-fldv.tp-v-disabled>.tp-fldv_i{opacity:.5}.tp-grlv{position:relative}.tp-grlv_g{display:block;height:calc(var(--cnt-usz)*3)}.tp-grlv_g polyline{fill:none;stroke:var(--mo-fg);stroke-linejoin:round}.tp-grlv_t{margin-top:-4px;transition:left .05s,top .05s;visibility:hidden}.tp-grlv_t.tp-grlv_t-a{visibility:visible}.tp-grlv_t.tp-grlv_t-in{transition:none}.tp-grlv.tp-v-disabled .tp-grlv_g{opacity:.5}.tp-grlv .tp-ttv{background-color:var(--mo-fg)}.tp-grlv .tp-ttv::before{border-top-color:var(--mo-fg)}.tp-lblv{align-items:center;display:flex;line-height:1.3;padding-left:var(--cnt-hp);padding-right:var(--cnt-hp)}.tp-lblv.tp-lblv-nol{display:block}.tp-lblv_l{color:var(--lbl-fg);flex:1;-webkit-hyphens:auto;hyphens:auto;overflow:hidden;padding-left:4px;padding-right:16px}.tp-lblv.tp-v-disabled .tp-lblv_l{opacity:.5}.tp-lblv.tp-lblv-nol .tp-lblv_l{display:none}.tp-lblv_v{align-self:flex-start;flex-grow:0;flex-shrink:0;width:var(--bld-vw)}.tp-lblv.tp-lblv-nol .tp-lblv_v{width:100%}.tp-lstv_s{padding:0 20px 0 var(--bld-hp);width:100%}.tp-lstv_m{color:var(--btn-fg)}.tp-sglv_i{padding-left:var(--bld-hp);padding-right:var(--bld-hp)}.tp-sglv.tp-v-disabled .tp-sglv_i{opacity:.5}.tp-mllv_i{display:block;height:calc(var(--cnt-usz)*3);line-height:var(--cnt-usz);padding-left:var(--bld-hp);padding-right:var(--bld-hp);resize:none;white-space:pre}.tp-mllv.tp-v-disabled .tp-mllv_i{opacity:.5}.tp-p2dv{position:relative}.tp-p2dv_h{display:flex}.tp-p2dv_b{height:var(--cnt-usz);margin-right:4px;position:relative;width:var(--cnt-usz)}.tp-p2dv_b svg{display:block;height:16px;left:50%;margin-left:-8px;margin-top:-8px;position:absolute;top:50%;width:16px}.tp-p2dv_b svg path{stroke:currentColor;stroke-width:2}.tp-p2dv_b svg circle{fill:currentColor}.tp-p2dv_t{flex:1}.tp-p2dv_p{height:0;margin-top:0;opacity:0;overflow:hidden;transition:height .2s ease-in-out,opacity .2s linear,margin .2s ease-in-out}.tp-p2dv.tp-p2dv-expanded .tp-p2dv_p{margin-top:var(--cnt-usp);opacity:1}.tp-p2dv .tp-popv{left:calc(-1*var(--cnt-hp));right:calc(-1*var(--cnt-hp));top:var(--cnt-usz)}.tp-p2dpv{padding-left:calc(var(--cnt-usz) + 4px)}.tp-p2dpv_p{cursor:crosshair;height:0;overflow:hidden;padding-bottom:100%;position:relative}.tp-p2dpv.tp-v-disabled .tp-p2dpv_p{opacity:.5}.tp-p2dpv_g{display:block;height:100%;left:0;pointer-events:none;position:absolute;top:0;width:100%}.tp-p2dpv_ax{opacity:.1;stroke:var(--in-fg);stroke-dasharray:1}.tp-p2dpv_l{opacity:.5;stroke:var(--in-fg);stroke-dasharray:1}.tp-p2dpv_m{border:var(--in-fg) solid 1px;border-radius:50%;box-sizing:border-box;height:4px;margin-left:-2px;margin-top:-2px;position:absolute;width:4px}.tp-p2dpv_p:focus .tp-p2dpv_m{background-color:var(--in-fg);border-width:0}.tp-popv{background-color:var(--bs-bg);border-radius:var(--bs-br);box-shadow:0 2px 4px var(--bs-sh);display:none;max-width:var(--bld-vw);padding:var(--cnt-vp) var(--cnt-hp);position:absolute;visibility:hidden;z-index:1000}.tp-popv.tp-popv-v{display:block;visibility:visible}.tp-sldv.tp-v-disabled{opacity:.5}.tp-sldv_t{box-sizing:border-box;cursor:pointer;height:var(--cnt-usz);margin:0 6px;outline:none;position:relative}.tp-sldv_t::before{background-color:var(--in-bg);border-radius:1px;content:"";display:block;height:2px;inset:0;margin:auto;position:absolute}.tp-sldv_k{height:100%;left:0;position:absolute;top:0}.tp-sldv_k::before{background-color:var(--in-fg);border-radius:1px;content:"";display:block;height:2px;inset:0;margin-bottom:auto;margin-top:auto;position:absolute}.tp-sldv_k::after{background-color:var(--btn-bg);border-radius:var(--bld-br);bottom:0;content:"";display:block;height:12px;margin-bottom:auto;margin-top:auto;position:absolute;right:-6px;top:0;width:12px}.tp-sldv_t:hover .tp-sldv_k::after{background-color:var(--btn-bg-h)}.tp-sldv_t:focus .tp-sldv_k::after{background-color:var(--btn-bg-f)}.tp-sldv_t:active .tp-sldv_k::after{background-color:var(--btn-bg-a)}.tp-sldtxtv{display:flex}.tp-sldtxtv_s{flex:2}.tp-sldtxtv_t{flex:1;margin-left:4px}.tp-tabv{position:relative}.tp-tabv_t{align-items:flex-end;color:var(--cnt-bg);display:flex;overflow:hidden;position:relative}.tp-tabv_t:hover{color:var(--cnt-bg-h)}.tp-tabv_t:has(*:focus){color:var(--cnt-bg-f)}.tp-tabv_t:has(*:active){color:var(--cnt-bg-a)}.tp-tabv_t::before{background-color:currentColor;bottom:0;content:"";height:2px;left:0;pointer-events:none;position:absolute;right:0}.tp-tabv.tp-v-disabled .tp-tabv_t::before{opacity:.5}.tp-tabv.tp-tabv-nop .tp-tabv_t{height:calc(var(--cnt-usz) + 4px);position:relative}.tp-tabv.tp-tabv-nop .tp-tabv_t::before{background-color:var(--cnt-bg);bottom:0;content:"";height:2px;left:0;position:absolute;right:0}.tp-tabv_i{bottom:0;color:var(--cnt-bg);left:0;overflow:hidden;position:absolute;top:calc(var(--cnt-usz) + 4px);width:max(var(--bs-br),4px)}.tp-tabv_i::before{background-color:currentColor;bottom:0;content:"";left:0;position:absolute;top:0;width:4px}.tp-tabv_t:hover+.tp-tabv_i{color:var(--cnt-bg-h)}.tp-tabv_t:has(*:focus)+.tp-tabv_i{color:var(--cnt-bg-f)}.tp-tabv_t:has(*:active)+.tp-tabv_i{color:var(--cnt-bg-a)}.tp-tabv.tp-v-disabled>.tp-tabv_i{opacity:.5}.tp-tbiv{flex:1;min-width:0;position:relative}.tp-tbiv+.tp-tbiv{margin-left:2px}.tp-tbiv+.tp-tbiv.tp-v-disabled::before{opacity:.5}.tp-tbiv_b{display:block;padding-left:calc(var(--cnt-hp) + 4px);padding-right:calc(var(--cnt-hp) + 4px);position:relative;width:100%}.tp-tbiv_b:disabled{opacity:.5}.tp-tbiv_b::before{background-color:var(--cnt-bg);content:"";inset:0 0 2px;pointer-events:none;position:absolute}.tp-tbiv_b:hover::before{background-color:var(--cnt-bg-h)}.tp-tbiv_b:focus::before{background-color:var(--cnt-bg-f)}.tp-tbiv_b:active::before{background-color:var(--cnt-bg-a)}.tp-tbiv_t{color:var(--cnt-fg);height:calc(var(--cnt-usz) + 4px);line-height:calc(var(--cnt-usz) + 4px);opacity:.5;overflow:hidden;position:relative;text-overflow:ellipsis}.tp-tbiv.tp-tbiv-sel .tp-tbiv_t{opacity:1}.tp-tbpv_c{padding-bottom:var(--cnt-vp);padding-left:4px;padding-top:var(--cnt-vp)}.tp-txtv{position:relative}.tp-txtv_i{padding-left:var(--bld-hp);padding-right:var(--bld-hp)}.tp-txtv.tp-txtv-fst .tp-txtv_i{border-bottom-right-radius:0;border-top-right-radius:0}.tp-txtv.tp-txtv-mid .tp-txtv_i{border-radius:0}.tp-txtv.tp-txtv-lst .tp-txtv_i{border-bottom-left-radius:0;border-top-left-radius:0}.tp-txtv.tp-txtv-num .tp-txtv_i{text-align:right}.tp-txtv.tp-txtv-drg .tp-txtv_i{opacity:.3}.tp-txtv_k{cursor:pointer;height:100%;left:calc(var(--bld-hp) - 5px);position:absolute;top:0;width:12px}.tp-txtv_k::before{background-color:var(--in-fg);border-radius:1px;bottom:0;content:"";height:calc(var(--cnt-usz) - 4px);left:50%;margin-bottom:auto;margin-left:-1px;margin-top:auto;opacity:.1;position:absolute;top:0;transition:border-radius .1s,height .1s,transform .1s,width .1s;width:2px}.tp-txtv_k:hover::before,.tp-txtv.tp-txtv-drg .tp-txtv_k::before{opacity:1}.tp-txtv.tp-txtv-drg .tp-txtv_k::before{border-radius:50%;height:4px;transform:translateX(-1px);width:4px}.tp-txtv_g{bottom:0;display:block;height:8px;left:50%;margin:auto;overflow:visible;pointer-events:none;position:absolute;top:0;visibility:hidden;width:100%}.tp-txtv.tp-txtv-drg .tp-txtv_g{visibility:visible}.tp-txtv_gb{fill:none;stroke:var(--in-fg);stroke-dasharray:1}.tp-txtv_gh{fill:none;stroke:var(--in-fg)}.tp-txtv .tp-ttv{margin-left:6px;visibility:hidden}.tp-txtv.tp-txtv-drg .tp-ttv{visibility:visible}.tp-ttv{background-color:var(--in-fg);border-radius:var(--bld-br);color:var(--bs-bg);padding:2px 4px;pointer-events:none;position:absolute;transform:translate(-50%, -100%)}.tp-ttv::before{border-color:var(--in-fg) rgba(0,0,0,0) rgba(0,0,0,0) rgba(0,0,0,0);border-style:solid;border-width:2px;box-sizing:border-box;content:"";font-size:.9em;height:4px;left:50%;margin-left:-2px;position:absolute;top:100%;width:4px}.tp-rotv{background-color:var(--bs-bg);border-radius:var(--bs-br);box-shadow:0 2px 4px var(--bs-sh);font-family:var(--bs-ff);font-size:11px;font-weight:500;line-height:1;text-align:left}.tp-rotv_b{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br);border-top-left-radius:var(--bs-br);border-top-right-radius:var(--bs-br);padding-left:calc(4px + var(--cnt-usz) + var(--cnt-hp));text-align:center}.tp-rotv.tp-rotv-expanded .tp-rotv_b{border-bottom-left-radius:0;border-bottom-right-radius:0;transition-delay:0s;transition-duration:0s}.tp-rotv.tp-rotv-not>.tp-rotv_b{display:none}.tp-rotv_b:disabled .tp-rotv_m{display:none}.tp-rotv_c>.tp-fldv.tp-v-lst>.tp-fldv_c{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br)}.tp-rotv_c>.tp-fldv.tp-v-lst>.tp-fldv_i{border-bottom-left-radius:var(--bs-br)}.tp-rotv_c>.tp-fldv.tp-v-lst:not(.tp-fldv-expanded)>.tp-fldv_b{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br)}.tp-rotv_c>.tp-fldv.tp-v-lst.tp-fldv-expanded>.tp-fldv_b{transition-delay:0s;transition-duration:0s}.tp-rotv_c .tp-fldv.tp-v-vlst:not(.tp-fldv-expanded)>.tp-fldv_b{border-bottom-right-radius:var(--bs-br)}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-fldv.tp-v-fst{margin-top:calc(-1*var(--cnt-vp))}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-fldv.tp-v-fst>.tp-fldv_b{border-top-left-radius:var(--bs-br);border-top-right-radius:var(--bs-br)}.tp-rotv_c>.tp-tabv.tp-v-lst>.tp-tabv_c{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br)}.tp-rotv_c>.tp-tabv.tp-v-lst>.tp-tabv_i{border-bottom-left-radius:var(--bs-br)}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-tabv.tp-v-fst{margin-top:calc(-1*var(--cnt-vp))}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-tabv.tp-v-fst>.tp-tabv_t{border-top-left-radius:var(--bs-br);border-top-right-radius:var(--bs-br)}.tp-rotv.tp-v-disabled,.tp-rotv .tp-v-disabled{pointer-events:none}.tp-rotv.tp-v-hidden,.tp-rotv .tp-v-hidden{display:none}.tp-sprv_r{background-color:var(--grv-fg);border-width:0;display:block;height:2px;margin:0;width:100%}.tp-sprv.tp-v-disabled .tp-sprv_r{opacity:.5}',plugins:[dy,_y,gy,Np,vy]})}}new Dp("4.0.5");function gi(n){if(n===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return n}function pm(n,t){n.prototype=Object.create(t.prototype),n.prototype.constructor=n,n.__proto__=t}/*!
 * GSAP 3.15.0
 * https://gsap.com
 *
 * @license Copyright 2008-2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var yn={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},fo={duration:.5,overwrite:!1,delay:0},ou,Ge,he,On=1e8,oe=1/On,Pc=Math.PI*2,wy=Pc/4,Sy=0,mm=Math.sqrt,Ey=Math.cos,My=Math.sin,Be=function(t){return typeof t=="string"},ye=function(t){return typeof t=="function"},Ai=function(t){return typeof t=="number"},au=function(t){return typeof t>"u"},ai=function(t){return typeof t=="object"},on=function(t){return t!==!1},lu=function(){return typeof window<"u"},qo=function(t){return ye(t)||Be(t)},_m=typeof ArrayBuffer=="function"&&ArrayBuffer.isView||function(){},$e=Array.isArray,Ty=/random\([^)]+\)/g,Cy=/,\s*/g,Pd=/(?:-?\.?\d|\.)+/gi,gm=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,ls=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,Il=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,vm=/[+-]=-?[.\d]+/,Ay=/[^,'"\[\]\s]+/gi,Py=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,fe,Kn,Rc,cu,Sn={},Va={},xm,bm=function(t){return(Va=xs(t,Sn))&&dn},hu=function(t,e){return console.warn("Invalid property",t,"set to",e,"Missing plugin? gsap.registerPlugin()")},po=function(t,e){return!e&&console.warn(t)},ym=function(t,e){return t&&(Sn[t]=e)&&Va&&(Va[t]=e)||Sn},mo=function(){return 0},Ry={suppressEvents:!0,isStart:!0,kill:!1},Sa={suppressEvents:!0,kill:!1},Ly={suppressEvents:!0},uu={},er=[],Lc={},wm,_n={},Ul={},Rd=30,Ea=[],du="",fu=function(t){var e=t[0],i,r;if(ai(e)||ye(e)||(t=[t]),!(i=(e._gsap||{}).harness)){for(r=Ea.length;r--&&!Ea[r].targetTest(e););i=Ea[r]}for(r=t.length;r--;)t[r]&&(t[r]._gsap||(t[r]._gsap=new Wm(t[r],i)))||t.splice(r,1);return t},Tr=function(t){return t._gsap||fu(Fn(t))[0]._gsap},Sm=function(t,e,i){return(i=t[e])&&ye(i)?t[e]():au(i)&&t.getAttribute&&t.getAttribute(e)||i},an=function(t,e){return(t=t.split(",")).forEach(e)||t},Me=function(t){return Math.round(t*1e5)/1e5||0},de=function(t){return Math.round(t*1e7)/1e7||0},ds=function(t,e){var i=e.charAt(0),r=parseFloat(e.substr(2));return t=parseFloat(t),i==="+"?t+r:i==="-"?t-r:i==="*"?t*r:t/r},Dy=function(t,e){for(var i=e.length,r=0;t.indexOf(e[r])<0&&++r<i;);return r<i},za=function(){var t=er.length,e=er.slice(0),i,r;for(Lc={},er.length=0,i=0;i<t;i++)r=e[i],r&&r._lazy&&(r.render(r._lazy[0],r._lazy[1],!0)._lazy=0)},pu=function(t){return!!(t._initted||t._startAt||t.add)},Em=function(t,e,i,r){er.length&&!Ge&&za(),t.render(e,i,!!(Ge&&e<0&&pu(t))),er.length&&!Ge&&za()},Mm=function(t){var e=parseFloat(t);return(e||e===0)&&(t+"").match(Ay).length<2?e:Be(t)?t.trim():t},Tm=function(t){return t},En=function(t,e){for(var i in e)i in t||(t[i]=e[i]);return t},Iy=function(t){return function(e,i){for(var r in i)r in e||r==="duration"&&t||r==="ease"||(e[r]=i[r])}},xs=function(t,e){for(var i in e)t[i]=e[i];return t},Ld=function n(t,e){for(var i in e)i!=="__proto__"&&i!=="constructor"&&i!=="prototype"&&(t[i]=ai(e[i])?n(t[i]||(t[i]={}),e[i]):e[i]);return t},Ha=function(t,e){var i={},r;for(r in t)r in e||(i[r]=t[r]);return i},Qs=function(t){var e=t.parent||fe,i=t.keyframes?Iy($e(t.keyframes)):En;if(on(t.inherit))for(;e;)i(t,e.vars.defaults),e=e.parent||e._dp;return t},Uy=function(t,e){for(var i=t.length,r=i===e.length;r&&i--&&t[i]===e[i];);return i<0},Cm=function(t,e,i,r,s){var o=t[r],a;if(s)for(a=e[s];o&&o[s]>a;)o=o._prev;return o?(e._next=o._next,o._next=e):(e._next=t[i],t[i]=e),e._next?e._next._prev=e:t[r]=e,e._prev=o,e.parent=e._dp=t,e},cl=function(t,e,i,r){i===void 0&&(i="_first"),r===void 0&&(r="_last");var s=e._prev,o=e._next;s?s._next=o:t[i]===e&&(t[i]=o),o?o._prev=s:t[r]===e&&(t[r]=s),e._next=e._prev=e.parent=null},rr=function(t,e){t.parent&&(!e||t.parent.autoRemoveChildren)&&t.parent.remove&&t.parent.remove(t),t._act=0},Cr=function(t,e){if(t&&(!e||e._end>t._dur||e._start<0))for(var i=t;i;)i._dirty=1,i=i.parent;return t},Ny=function(t){for(var e=t.parent;e&&e.parent;)e._dirty=1,e.totalDuration(),e=e.parent;return t},Dc=function(t,e,i,r){return t._startAt&&(Ge?t._startAt.revert(Sa):t.vars.immediateRender&&!t.vars.autoRevert||t._startAt.render(e,!0,r))},Oy=function n(t){return!t||t._ts&&n(t.parent)},Dd=function(t){return t._repeat?bs(t._tTime,t=t.duration()+t._rDelay)*t:0},bs=function(t,e){var i=Math.floor(t=de(t/e));return t&&i===t?i-1:i},Ga=function(t,e){return(t-e._start)*e._ts+(e._ts>=0?0:e._dirty?e.totalDuration():e._tDur)},hl=function(t){return t._end=de(t._start+(t._tDur/Math.abs(t._ts||t._rts||oe)||0))},ul=function(t,e){var i=t._dp;return i&&i.smoothChildTiming&&t._ts&&(t._start=de(i._time-(t._ts>0?e/t._ts:((t._dirty?t.totalDuration():t._tDur)-e)/-t._ts)),hl(t),i._dirty||Cr(i,t)),t},Am=function(t,e){var i;if((e._time||!e._dur&&e._initted||e._start<t._time&&(e._dur||!e.add))&&(i=Ga(t.rawTime(),e),(!e._dur||No(0,e.totalDuration(),i)-e._tTime>oe)&&e.render(i,!0)),Cr(t,e)._dp&&t._initted&&t._time>=t._dur&&t._ts){if(t._dur<t.duration())for(i=t;i._dp;)i.rawTime()>=0&&i.totalTime(i._tTime),i=i._dp;t._zTime=-oe}},Jn=function(t,e,i,r){return e.parent&&rr(e),e._start=de((Ai(i)?i:i||t!==fe?Ln(t,i,e):t._time)+e._delay),e._end=de(e._start+(e.totalDuration()/Math.abs(e.timeScale())||0)),Cm(t,e,"_first","_last",t._sort?"_start":0),Ic(e)||(t._recent=e),r||Am(t,e),t._ts<0&&ul(t,t._tTime),t},Pm=function(t,e){return(Sn.ScrollTrigger||hu("scrollTrigger",e))&&Sn.ScrollTrigger.create(e,t)},Rm=function(t,e,i,r,s){if(_u(t,e,s),!t._initted)return 1;if(!i&&t._pt&&!Ge&&(t._dur&&t.vars.lazy!==!1||!t._dur&&t.vars.lazy)&&wm!==vn.frame)return er.push(t),t._lazy=[s,r],1},Fy=function n(t){var e=t.parent;return e&&e._ts&&e._initted&&!e._lock&&(e.rawTime()<0||n(e))},Ic=function(t){var e=t.data;return e==="isFromStart"||e==="isStart"},ky=function(t,e,i,r){var s=t.ratio,o=e<0||!e&&(!t._start&&Fy(t)&&!(!t._initted&&Ic(t))||(t._ts<0||t._dp._ts<0)&&!Ic(t))?0:1,a=t._rDelay,l=0,c,h,d;if(a&&t._repeat&&(l=No(0,t._tDur,e),h=bs(l,a),t._yoyo&&h&1&&(o=1-o),h!==bs(t._tTime,a)&&(s=1-o,t.vars.repeatRefresh&&t._initted&&t.invalidate())),o!==s||Ge||r||t._zTime===oe||!e&&t._zTime){if(!t._initted&&Rm(t,e,r,i,l))return;for(d=t._zTime,t._zTime=e||(i?oe:0),i||(i=e&&!d),t.ratio=o,t._from&&(o=1-o),t._time=0,t._tTime=l,c=t._pt;c;)c.r(o,c.d),c=c._next;e<0&&Dc(t,e,i,!0),t._onUpdate&&!i&&xn(t,"onUpdate"),l&&t._repeat&&!i&&t.parent&&xn(t,"onRepeat"),(e>=t._tDur||e<0)&&t.ratio===o&&(o&&rr(t,1),!i&&!Ge&&(xn(t,o?"onComplete":"onReverseComplete",!0),t._prom&&t._prom()))}else t._zTime||(t._zTime=e)},By=function(t,e,i){var r;if(i>e)for(r=t._first;r&&r._start<=i;){if(r.data==="isPause"&&r._start>e)return r;r=r._next}else for(r=t._last;r&&r._start>=i;){if(r.data==="isPause"&&r._start<e)return r;r=r._prev}},ys=function(t,e,i,r){var s=t._repeat,o=de(e)||0,a=t._tTime/t._tDur;return a&&!r&&(t._time*=o/t._dur),t._dur=o,t._tDur=s?s<0?1e10:de(o*(s+1)+t._rDelay*s):o,a>0&&!r&&ul(t,t._tTime=t._tDur*a),t.parent&&hl(t),i||Cr(t.parent,t),t},Id=function(t){return t instanceof rn?Cr(t):ys(t,t._dur)},Vy={_start:0,endTime:mo,totalDuration:mo},Ln=function n(t,e,i){var r=t.labels,s=t._recent||Vy,o=t.duration()>=On?s.endTime(!1):t._dur,a,l,c;return Be(e)&&(isNaN(e)||e in r)?(l=e.charAt(0),c=e.substr(-1)==="%",a=e.indexOf("="),l==="<"||l===">"?(a>=0&&(e=e.replace(/=/,"")),(l==="<"?s._start:s.endTime(s._repeat>=0))+(parseFloat(e.substr(1))||0)*(c?(a<0?s:i).totalDuration()/100:1)):a<0?(e in r||(r[e]=o),r[e]):(l=parseFloat(e.charAt(a-1)+e.substr(a+1)),c&&i&&(l=l/100*($e(i)?i[0]:i).totalDuration()),a>1?n(t,e.substr(0,a-1),i)+l:o+l)):e==null?o:+e},to=function(t,e,i){var r=Ai(e[1]),s=(r?2:1)+(t<2?0:1),o=e[s],a,l;if(r&&(o.duration=e[1]),o.parent=i,t){for(a=o,l=i;l&&!("immediateRender"in a);)a=l.vars.defaults||{},l=on(l.vars.inherit)&&l.parent;o.immediateRender=on(a.immediateRender),t<2?o.runBackwards=1:o.startAt=e[s-1]}return new Re(e[0],o,e[s+1])},cr=function(t,e){return t||t===0?e(t):e},No=function(t,e,i){return i<t?t:i>e?e:i},Ye=function(t,e){return!Be(t)||!(e=Py.exec(t))?"":e[1]},zy=function(t,e,i){return cr(i,function(r){return No(t,e,r)})},Uc=[].slice,Lm=function(t,e){return t&&ai(t)&&"length"in t&&(!e&&!t.length||t.length-1 in t&&ai(t[0]))&&!t.nodeType&&t!==Kn},Hy=function(t,e,i){return i===void 0&&(i=[]),t.forEach(function(r){var s;return Be(r)&&!e||Lm(r,1)?(s=i).push.apply(s,Fn(r)):i.push(r)})||i},Fn=function(t,e,i){return he&&!e&&he.selector?he.selector(t):Be(t)&&!i&&(Rc||!ws())?Uc.call((e||cu).querySelectorAll(t),0):$e(t)?Hy(t,i):Lm(t)?Uc.call(t,0):t?[t]:[]},Nc=function(t){return t=Fn(t)[0]||po("Invalid scope")||{},function(e){var i=t.current||t.nativeElement||t;return Fn(e,i.querySelectorAll?i:i===t?po("Invalid scope")||cu.createElement("div"):t)}},Dm=function(t){return t.sort(function(){return .5-Math.random()})},Im=function(t){if(ye(t))return t;var e=ai(t)?t:{each:t},i=Ar(e.ease),r=e.from||0,s=parseFloat(e.base)||0,o={},a=r>0&&r<1,l=isNaN(r)||a,c=e.axis,h=r,d=r;return Be(r)?h=d={center:.5,edges:.5,end:1}[r]||0:!a&&l&&(h=r[0],d=r[1]),function(u,f,_){var g=(_||e).length,p=o[g],m,y,E,b,S,T,C,v,M;if(!p){if(M=e.grid==="auto"?0:(e.grid||[1,On])[1],!M){for(C=-On;C<(C=_[M++].getBoundingClientRect().left)&&M<g;);M<g&&M--}for(p=o[g]=[],m=l?Math.min(M,g)*h-.5:r%M,y=M===On?0:l?g*d/M-.5:r/M|0,C=0,v=On,T=0;T<g;T++)E=T%M-m,b=y-(T/M|0),p[T]=S=c?Math.abs(c==="y"?b:E):mm(E*E+b*b),S>C&&(C=S),S<v&&(v=S);r==="random"&&Dm(p),p.max=C-v,p.min=v,p.v=g=(parseFloat(e.amount)||parseFloat(e.each)*(M>g?g-1:c?c==="y"?g/M:M:Math.max(M,g/M))||0)*(r==="edges"?-1:1),p.b=g<0?s-g:s,p.u=Ye(e.amount||e.each)||0,i=i&&g<0?ew(i):i}return g=(p[u]-p.min)/p.max||0,de(p.b+(i?i(g):g)*p.v)+p.u}},Oc=function(t){var e=Math.pow(10,((t+"").split(".")[1]||"").length);return function(i){var r=de(Math.round(parseFloat(i)/t)*t*e);return(r-r%1)/e+(Ai(i)?0:Ye(i))}},Um=function(t,e){var i=$e(t),r,s;return!i&&ai(t)&&(r=i=t.radius||On,t.values?(t=Fn(t.values),(s=!Ai(t[0]))&&(r*=r)):t=Oc(t.increment)),cr(e,i?ye(t)?function(o){return s=t(o),Math.abs(s-o)<=r?s:o}:function(o){for(var a=parseFloat(s?o.x:o),l=parseFloat(s?o.y:0),c=On,h=0,d=t.length,u,f;d--;)s?(u=t[d].x-a,f=t[d].y-l,u=u*u+f*f):u=Math.abs(t[d]-a),u<c&&(c=u,h=d);return h=!r||c<=r?t[h]:o,s||h===o||Ai(o)?h:h+Ye(o)}:Oc(t))},Nm=function(t,e,i,r){return cr($e(t)?!e:i===!0?!!(i=0):!r,function(){return $e(t)?t[~~(Math.random()*t.length)]:(i=i||1e-5)&&(r=i<1?Math.pow(10,(i+"").length-2):1)&&Math.floor(Math.round((t-i/2+Math.random()*(e-t+i*.99))/i)*i*r)/r})},Gy=function(){for(var t=arguments.length,e=new Array(t),i=0;i<t;i++)e[i]=arguments[i];return function(r){return e.reduce(function(s,o){return o(s)},r)}},Wy=function(t,e){return function(i){return t(parseFloat(i))+(e||Ye(i))}},Xy=function(t,e,i){return Fm(t,e,0,1,i)},Om=function(t,e,i){return cr(i,function(r){return t[~~e(r)]})},qy=function n(t,e,i){var r=e-t;return $e(t)?Om(t,n(0,t.length),e):cr(i,function(s){return(r+(s-t)%r)%r+t})},Yy=function n(t,e,i){var r=e-t,s=r*2;return $e(t)?Om(t,n(0,t.length-1),e):cr(i,function(o){return o=(s+(o-t)%s)%s||0,t+(o>r?s-o:o)})},_o=function(t){return t.replace(Ty,function(e){var i=e.indexOf("[")+1,r=e.substring(i||7,i?e.indexOf("]"):e.length-1).split(Cy);return Nm(i?r:+r[0],i?0:+r[1],+r[2]||1e-5)})},Fm=function(t,e,i,r,s){var o=e-t,a=r-i;return cr(s,function(l){return i+((l-t)/o*a||0)})},$y=function n(t,e,i,r){var s=isNaN(t+e)?0:function(f){return(1-f)*t+f*e};if(!s){var o=Be(t),a={},l,c,h,d,u;if(i===!0&&(r=1)&&(i=null),o)t={p:t},e={p:e};else if($e(t)&&!$e(e)){for(h=[],d=t.length,u=d-2,c=1;c<d;c++)h.push(n(t[c-1],t[c]));d--,s=function(_){_*=d;var g=Math.min(u,~~_);return h[g](_-g)},i=e}else r||(t=xs($e(t)?[]:{},t));if(!h){for(l in e)mu.call(a,t,l,"get",e[l]);s=function(_){return xu(_,a)||(o?t.p:t)}}}return cr(i,s)},Ud=function(t,e,i){var r=t.labels,s=On,o,a,l;for(o in r)a=r[o]-e,a<0==!!i&&a&&s>(a=Math.abs(a))&&(l=o,s=a);return l},xn=function(t,e,i){var r=t.vars,s=r[e],o=he,a=t._ctx,l,c,h;if(s)return l=r[e+"Params"],c=r.callbackScope||t,i&&er.length&&za(),a&&(he=a),h=l?s.apply(c,l):s.call(c),he=o,h},Ys=function(t){return rr(t),t.scrollTrigger&&t.scrollTrigger.kill(!!Ge),t.progress()<1&&xn(t,"onInterrupt"),t},cs,km=[],Bm=function(t){if(t)if(t=!t.name&&t.default||t,lu()||t.headless){var e=t.name,i=ye(t),r=e&&!i&&t.init?function(){this._props=[]}:t,s={init:mo,render:xu,add:mu,kill:uw,modifier:hw,rawVars:0},o={targetTest:0,get:0,getSetter:vu,aliases:{},register:0};if(ws(),t!==r){if(_n[e])return;En(r,En(Ha(t,s),o)),xs(r.prototype,xs(s,Ha(t,o))),_n[r.prop=e]=r,t.targetTest&&(Ea.push(r),uu[e]=1),e=(e==="css"?"CSS":e.charAt(0).toUpperCase()+e.substr(1))+"Plugin"}ym(e,r),t.register&&t.register(dn,r,ln)}else km.push(t)},se=255,$s={aqua:[0,se,se],lime:[0,se,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,se],navy:[0,0,128],white:[se,se,se],olive:[128,128,0],yellow:[se,se,0],orange:[se,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[se,0,0],pink:[se,192,203],cyan:[0,se,se],transparent:[se,se,se,0]},Nl=function(t,e,i){return t+=t<0?1:t>1?-1:0,(t*6<1?e+(i-e)*t*6:t<.5?i:t*3<2?e+(i-e)*(2/3-t)*6:e)*se+.5|0},Vm=function(t,e,i){var r=t?Ai(t)?[t>>16,t>>8&se,t&se]:0:$s.black,s,o,a,l,c,h,d,u,f,_;if(!r){if(t.substr(-1)===","&&(t=t.substr(0,t.length-1)),$s[t])r=$s[t];else if(t.charAt(0)==="#"){if(t.length<6&&(s=t.charAt(1),o=t.charAt(2),a=t.charAt(3),t="#"+s+s+o+o+a+a+(t.length===5?t.charAt(4)+t.charAt(4):"")),t.length===9)return r=parseInt(t.substr(1,6),16),[r>>16,r>>8&se,r&se,parseInt(t.substr(7),16)/255];t=parseInt(t.substr(1),16),r=[t>>16,t>>8&se,t&se]}else if(t.substr(0,3)==="hsl"){if(r=_=t.match(Pd),!e)l=+r[0]%360/360,c=+r[1]/100,h=+r[2]/100,o=h<=.5?h*(c+1):h+c-h*c,s=h*2-o,r.length>3&&(r[3]*=1),r[0]=Nl(l+1/3,s,o),r[1]=Nl(l,s,o),r[2]=Nl(l-1/3,s,o);else if(~t.indexOf("="))return r=t.match(gm),i&&r.length<4&&(r[3]=1),r}else r=t.match(Pd)||$s.transparent;r=r.map(Number)}return e&&!_&&(s=r[0]/se,o=r[1]/se,a=r[2]/se,d=Math.max(s,o,a),u=Math.min(s,o,a),h=(d+u)/2,d===u?l=c=0:(f=d-u,c=h>.5?f/(2-d-u):f/(d+u),l=d===s?(o-a)/f+(o<a?6:0):d===o?(a-s)/f+2:(s-o)/f+4,l*=60),r[0]=~~(l+.5),r[1]=~~(c*100+.5),r[2]=~~(h*100+.5)),i&&r.length<4&&(r[3]=1),r},zm=function(t){var e=[],i=[],r=-1;return t.split(nr).forEach(function(s){var o=s.match(ls)||[];e.push.apply(e,o),i.push(r+=o.length+1)}),e.c=i,e},Nd=function(t,e,i){var r="",s=(t+r).match(nr),o=e?"hsla(":"rgba(",a=0,l,c,h,d;if(!s)return t;if(s=s.map(function(u){return(u=Vm(u,e,1))&&o+(e?u[0]+","+u[1]+"%,"+u[2]+"%,"+u[3]:u.join(","))+")"}),i&&(h=zm(t),l=i.c,l.join(r)!==h.c.join(r)))for(c=t.replace(nr,"1").split(ls),d=c.length-1;a<d;a++)r+=c[a]+(~l.indexOf(a)?s.shift()||o+"0,0,0,0)":(h.length?h:s.length?s:i).shift());if(!c)for(c=t.split(nr),d=c.length-1;a<d;a++)r+=c[a]+s[a];return r+c[d]},nr=(function(){var n="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",t;for(t in $s)n+="|"+t+"\\b";return new RegExp(n+")","gi")})(),Ky=/hsl[a]?\(/,Hm=function(t){var e=t.join(" "),i;if(nr.lastIndex=0,nr.test(e))return i=Ky.test(e),t[1]=Nd(t[1],i),t[0]=Nd(t[0],i,zm(t[1])),!0},go,vn=(function(){var n=Date.now,t=500,e=33,i=n(),r=i,s=1e3/240,o=s,a=[],l,c,h,d,u,f,_=function g(p){var m=n()-r,y=p===!0,E,b,S,T;if((m>t||m<0)&&(i+=m-e),r+=m,S=r-i,E=S-o,(E>0||y)&&(T=++d.frame,u=S-d.time*1e3,d.time=S=S/1e3,o+=E+(E>=s?4:s-E),b=1),y||(l=c(g)),b)for(f=0;f<a.length;f++)a[f](S,u,T,p)};return d={time:0,frame:0,tick:function(){_(!0)},deltaRatio:function(p){return u/(1e3/(p||60))},wake:function(){xm&&(!Rc&&lu()&&(Kn=Rc=window,cu=Kn.document||{},Sn.gsap=dn,(Kn.gsapVersions||(Kn.gsapVersions=[])).push(dn.version),bm(Va||Kn.GreenSockGlobals||!Kn.gsap&&Kn||{}),km.forEach(Bm)),h=typeof requestAnimationFrame<"u"&&requestAnimationFrame,l&&d.sleep(),c=h||function(p){return setTimeout(p,o-d.time*1e3+1|0)},go=1,_(2))},sleep:function(){(h?cancelAnimationFrame:clearTimeout)(l),go=0,c=mo},lagSmoothing:function(p,m){t=p||1/0,e=Math.min(m||33,t)},fps:function(p){s=1e3/(p||240),o=d.time*1e3+s},add:function(p,m,y){var E=m?function(b,S,T,C){p(b,S,T,C),d.remove(E)}:p;return d.remove(p),a[y?"unshift":"push"](E),ws(),E},remove:function(p,m){~(m=a.indexOf(p))&&a.splice(m,1)&&f>=m&&f--},_listeners:a},d})(),ws=function(){return!go&&vn.wake()},Ht={},Zy=/^[\d.\-M][\d.\-,\s]/,Jy=/["']/g,jy=function(t){for(var e={},i=t.substr(1,t.length-3).split(":"),r=i[0],s=1,o=i.length,a,l,c;s<o;s++)l=i[s],a=s!==o-1?l.lastIndexOf(","):l.length,c=l.substr(0,a),e[r]=isNaN(c)?c.replace(Jy,"").trim():+c,r=l.substr(a+1).trim();return e},Qy=function(t){var e=t.indexOf("(")+1,i=t.indexOf(")"),r=t.indexOf("(",e);return t.substring(e,~r&&r<i?t.indexOf(")",i+1):i)},tw=function(t){var e=(t+"").split("("),i=Ht[e[0]];return i&&e.length>1&&i.config?i.config.apply(null,~t.indexOf("{")?[jy(e[1])]:Qy(t).split(",").map(Mm)):Ht._CE&&Zy.test(t)?Ht._CE("",t):i},ew=function(t){return function(e){return 1-t(1-e)}},Ar=function(t,e){return t&&(ye(t)?t:Ht[t]||tw(t))||e},kr=function(t,e,i,r){i===void 0&&(i=function(l){return 1-e(1-l)}),r===void 0&&(r=function(l){return l<.5?e(l*2)/2:1-e((1-l)*2)/2});var s={easeIn:e,easeOut:i,easeInOut:r},o;return an(t,function(a){Ht[a]=Sn[a]=s,Ht[o=a.toLowerCase()]=i;for(var l in s)Ht[o+(l==="easeIn"?".in":l==="easeOut"?".out":".inOut")]=Ht[a+"."+l]=s[l]}),s},Gm=function(t){return function(e){return e<.5?(1-t(1-e*2))/2:.5+t((e-.5)*2)/2}},Ol=function n(t,e,i){var r=e>=1?e:1,s=(i||(t?.3:.45))/(e<1?e:1),o=s/Pc*(Math.asin(1/r)||0),a=function(h){return h===1?1:r*Math.pow(2,-10*h)*My((h-o)*s)+1},l=t==="out"?a:t==="in"?function(c){return 1-a(1-c)}:Gm(a);return s=Pc/s,l.config=function(c,h){return n(t,c,h)},l},Fl=function n(t,e){e===void 0&&(e=1.70158);var i=function(o){return o?--o*o*((e+1)*o+e)+1:0},r=t==="out"?i:t==="in"?function(s){return 1-i(1-s)}:Gm(i);return r.config=function(s){return n(t,s)},r};an("Linear,Quad,Cubic,Quart,Quint,Strong",function(n,t){var e=t<5?t+1:t;kr(n+",Power"+(e-1),t?function(i){return Math.pow(i,e)}:function(i){return i},function(i){return 1-Math.pow(1-i,e)},function(i){return i<.5?Math.pow(i*2,e)/2:1-Math.pow((1-i)*2,e)/2})});Ht.Linear.easeNone=Ht.none=Ht.Linear.easeIn;kr("Elastic",Ol("in"),Ol("out"),Ol());(function(n,t){var e=1/t,i=2*e,r=2.5*e,s=function(a){return a<e?n*a*a:a<i?n*Math.pow(a-1.5/t,2)+.75:a<r?n*(a-=2.25/t)*a+.9375:n*Math.pow(a-2.625/t,2)+.984375};kr("Bounce",function(o){return 1-s(1-o)},s)})(7.5625,2.75);kr("Expo",function(n){return Math.pow(2,10*(n-1))*n+n*n*n*n*n*n*(1-n)});kr("Circ",function(n){return-(mm(1-n*n)-1)});kr("Sine",function(n){return n===1?1:-Ey(n*wy)+1});kr("Back",Fl("in"),Fl("out"),Fl());Ht.SteppedEase=Ht.steps=Sn.SteppedEase={config:function(t,e){t===void 0&&(t=1);var i=1/t,r=t+(e?0:1),s=e?1:0,o=1-oe;return function(a){return((r*No(0,o,a)|0)+s)*i}}};fo.ease=Ht["quad.out"];an("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(n){return du+=n+","+n+"Params,"});var Wm=function(t,e){this.id=Sy++,t._gsap=this,this.target=t,this.harness=e,this.get=e?e.get:Sm,this.set=e?e.getSetter:vu},vo=(function(){function n(e){this.vars=e,this._delay=+e.delay||0,(this._repeat=e.repeat===1/0?-2:e.repeat||0)&&(this._rDelay=e.repeatDelay||0,this._yoyo=!!e.yoyo||!!e.yoyoEase),this._ts=1,ys(this,+e.duration,1,1),this.data=e.data,he&&(this._ctx=he,he.data.push(this)),go||vn.wake()}var t=n.prototype;return t.delay=function(i){return i||i===0?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+i-this._delay),this._delay=i,this):this._delay},t.duration=function(i){return arguments.length?this.totalDuration(this._repeat>0?i+(i+this._rDelay)*this._repeat:i):this.totalDuration()&&this._dur},t.totalDuration=function(i){return arguments.length?(this._dirty=0,ys(this,this._repeat<0?i:(i-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},t.totalTime=function(i,r){if(ws(),!arguments.length)return this._tTime;var s=this._dp;if(s&&s.smoothChildTiming&&this._ts){for(ul(this,i),!s._dp||s.parent||Am(s,this);s&&s.parent;)s.parent._time!==s._start+(s._ts>=0?s._tTime/s._ts:(s.totalDuration()-s._tTime)/-s._ts)&&s.totalTime(s._tTime,!0),s=s.parent;!this.parent&&this._dp.autoRemoveChildren&&(this._ts>0&&i<this._tDur||this._ts<0&&i>0||!this._tDur&&!i)&&Jn(this._dp,this,this._start-this._delay)}return(this._tTime!==i||!this._dur&&!r||this._initted&&Math.abs(this._zTime)===oe||!this._initted&&this._dur&&i||!i&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=i),Em(this,i,r)),this},t.time=function(i,r){return arguments.length?this.totalTime(Math.min(this.totalDuration(),i+Dd(this))%(this._dur+this._rDelay)||(i?this._dur:0),r):this._time},t.totalProgress=function(i,r){return arguments.length?this.totalTime(this.totalDuration()*i,r):this.totalDuration()?Math.min(1,this._tTime/this._tDur):this.rawTime()>=0&&this._initted?1:0},t.progress=function(i,r){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&!(this.iteration()&1)?1-i:i)+Dd(this),r):this.duration()?Math.min(1,this._time/this._dur):this.rawTime()>0?1:0},t.iteration=function(i,r){var s=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(i-1)*s,r):this._repeat?bs(this._tTime,s)+1:1},t.timeScale=function(i,r){if(!arguments.length)return this._rts===-oe?0:this._rts;if(this._rts===i)return this;var s=this.parent&&this._ts?Ga(this.parent._time,this):this._tTime;return this._rts=+i||0,this._ts=this._ps||i===-oe?0:this._rts,this.totalTime(No(-Math.abs(this._delay),this.totalDuration(),s),r!==!1),hl(this),Ny(this)},t.paused=function(i){return arguments.length?(this._ps!==i&&(this._ps=i,i?(this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0):(ws(),this._ts=this._rts,this.totalTime(this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,this.progress()===1&&Math.abs(this._zTime)!==oe&&(this._tTime-=oe)))),this):this._ps},t.startTime=function(i){if(arguments.length){this._start=de(i);var r=this.parent||this._dp;return r&&(r._sort||!this.parent)&&Jn(r,this,this._start-this._delay),this}return this._start},t.endTime=function(i){return this._start+(on(i)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},t.rawTime=function(i){var r=this.parent||this._dp;return r?i&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?Ga(r.rawTime(i),this):this._tTime:this._tTime},t.revert=function(i){i===void 0&&(i=Ly);var r=Ge;return Ge=i,pu(this)&&(this.timeline&&this.timeline.revert(i),this.totalTime(-.01,i.suppressEvents)),this.data!=="nested"&&i.kill!==!1&&this.kill(),Ge=r,this},t.globalTime=function(i){for(var r=this,s=arguments.length?i:r.rawTime();r;)s=r._start+s/(Math.abs(r._ts)||1),r=r._dp;return!this.parent&&this._sat?this._sat.globalTime(i):s},t.repeat=function(i){return arguments.length?(this._repeat=i===1/0?-2:i,Id(this)):this._repeat===-2?1/0:this._repeat},t.repeatDelay=function(i){if(arguments.length){var r=this._time;return this._rDelay=i,Id(this),r?this.time(r):this}return this._rDelay},t.yoyo=function(i){return arguments.length?(this._yoyo=i,this):this._yoyo},t.seek=function(i,r){return this.totalTime(Ln(this,i),on(r))},t.restart=function(i,r){return this.play().totalTime(i?-this._delay:0,on(r)),this._dur||(this._zTime=-oe),this},t.play=function(i,r){return i!=null&&this.seek(i,r),this.reversed(!1).paused(!1)},t.reverse=function(i,r){return i!=null&&this.seek(i||this.totalDuration(),r),this.reversed(!0).paused(!1)},t.pause=function(i,r){return i!=null&&this.seek(i,r),this.paused(!0)},t.resume=function(){return this.paused(!1)},t.reversed=function(i){return arguments.length?(!!i!==this.reversed()&&this.timeScale(-this._rts||(i?-oe:0)),this):this._rts<0},t.invalidate=function(){return this._initted=this._act=0,this._zTime=-oe,this},t.isActive=function(){var i=this.parent||this._dp,r=this._start,s;return!!(!i||this._ts&&this._initted&&i.isActive()&&(s=i.rawTime(!0))>=r&&s<this.endTime(!0)-oe)},t.eventCallback=function(i,r,s){var o=this.vars;return arguments.length>1?(r?(o[i]=r,s&&(o[i+"Params"]=s),i==="onUpdate"&&(this._onUpdate=r)):delete o[i],this):o[i]},t.then=function(i){var r=this,s=r._prom;return new Promise(function(o){var a=ye(i)?i:Tm,l=function(){var h=r.then;r.then=null,s&&s(),ye(a)&&(a=a(r))&&(a.then||a===r)&&(r.then=h),o(a),r.then=h};r._initted&&r.totalProgress()===1&&r._ts>=0||!r._tTime&&r._ts<0?l():r._prom=l})},t.kill=function(){Ys(this)},n})();En(vo.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-oe,_prom:0,_ps:!1,_rts:1});var rn=(function(n){pm(t,n);function t(i,r){var s;return i===void 0&&(i={}),s=n.call(this,i)||this,s.labels={},s.smoothChildTiming=!!i.smoothChildTiming,s.autoRemoveChildren=!!i.autoRemoveChildren,s._sort=on(i.sortChildren),fe&&Jn(i.parent||fe,gi(s),r),i.reversed&&s.reverse(),i.paused&&s.paused(!0),i.scrollTrigger&&Pm(gi(s),i.scrollTrigger),s}var e=t.prototype;return e.to=function(r,s,o){return to(0,arguments,this),this},e.from=function(r,s,o){return to(1,arguments,this),this},e.fromTo=function(r,s,o,a){return to(2,arguments,this),this},e.set=function(r,s,o){return s.duration=0,s.parent=this,Qs(s).repeatDelay||(s.repeat=0),s.immediateRender=!!s.immediateRender,new Re(r,s,Ln(this,o),1),this},e.call=function(r,s,o){return Jn(this,Re.delayedCall(0,r,s),o)},e.staggerTo=function(r,s,o,a,l,c,h){return o.duration=s,o.stagger=o.stagger||a,o.onComplete=c,o.onCompleteParams=h,o.parent=this,new Re(r,o,Ln(this,l)),this},e.staggerFrom=function(r,s,o,a,l,c,h){return o.runBackwards=1,Qs(o).immediateRender=on(o.immediateRender),this.staggerTo(r,s,o,a,l,c,h)},e.staggerFromTo=function(r,s,o,a,l,c,h,d){return a.startAt=o,Qs(a).immediateRender=on(a.immediateRender),this.staggerTo(r,s,a,l,c,h,d)},e.render=function(r,s,o){var a=this._time,l=this._dirty?this.totalDuration():this._tDur,c=this._dur,h=r<=0?0:de(r),d=this._zTime<0!=r<0&&(this._initted||!c),u,f,_,g,p,m,y,E,b,S,T,C;if(this!==fe&&h>l&&r>=0&&(h=l),h!==this._tTime||o||d){if(a!==this._time&&c&&(h+=this._time-a,r+=this._time-a),u=h,b=this._start,E=this._ts,m=!E,d&&(c||(a=this._zTime),(r||!s)&&(this._zTime=r)),this._repeat){if(T=this._yoyo,p=c+this._rDelay,this._repeat<-1&&r<0)return this.totalTime(p*100+r,s,o);if(u=de(h%p),h===l?(g=this._repeat,u=c):(S=de(h/p),g=~~S,g&&g===S&&(u=c,g--),u>c&&(u=c)),S=bs(this._tTime,p),!a&&this._tTime&&S!==g&&this._tTime-S*p-this._dur<=0&&(S=g),T&&g&1&&(u=c-u,C=1),g!==S&&!this._lock){var v=T&&S&1,M=v===(T&&g&1);if(g<S&&(v=!v),a=v?0:h%c?c:h,this._lock=1,this.render(a||(C?0:de(g*p)),s,!c)._lock=0,this._tTime=h,!s&&this.parent&&xn(this,"onRepeat"),this.vars.repeatRefresh&&!C&&(this.invalidate()._lock=1,S=g),a&&a!==this._time||m!==!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(c=this._dur,l=this._tDur,M&&(this._lock=2,a=v?c:-1e-4,this.render(a,!0),this.vars.repeatRefresh&&!C&&this.invalidate()),this._lock=0,!this._ts&&!m)return this}}if(this._hasPause&&!this._forcing&&this._lock<2&&(y=By(this,de(a),de(u)),y&&(h-=u-(u=y._start))),this._tTime=h,this._time=u,this._act=!!E,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=r,a=0),!a&&h&&c&&!s&&!S&&(xn(this,"onStart"),this._tTime!==h))return this;if(u>=a&&r>=0)for(f=this._first;f;){if(_=f._next,(f._act||u>=f._start)&&f._ts&&y!==f){if(f.parent!==this)return this.render(r,s,o);if(f.render(f._ts>0?(u-f._start)*f._ts:(f._dirty?f.totalDuration():f._tDur)+(u-f._start)*f._ts,s,o),u!==this._time||!this._ts&&!m){y=0,_&&(h+=this._zTime=-oe);break}}f=_}else{f=this._last;for(var P=r<0?r:u;f;){if(_=f._prev,(f._act||P<=f._end)&&f._ts&&y!==f){if(f.parent!==this)return this.render(r,s,o);if(f.render(f._ts>0?(P-f._start)*f._ts:(f._dirty?f.totalDuration():f._tDur)+(P-f._start)*f._ts,s,o||Ge&&pu(f)),u!==this._time||!this._ts&&!m){y=0,_&&(h+=this._zTime=P?-oe:oe);break}}f=_}}if(y&&!s&&(this.pause(),y.render(u>=a?0:-oe)._zTime=u>=a?1:-1,this._ts))return this._start=b,hl(this),this.render(r,s,o);this._onUpdate&&!s&&xn(this,"onUpdate",!0),(h===l&&this._tTime>=this.totalDuration()||!h&&a)&&(b===this._start||Math.abs(E)!==Math.abs(this._ts))&&(this._lock||((r||!c)&&(h===l&&this._ts>0||!h&&this._ts<0)&&rr(this,1),!s&&!(r<0&&!a)&&(h||a||!l)&&(xn(this,h===l&&r>=0?"onComplete":"onReverseComplete",!0),this._prom&&!(h<l&&this.timeScale()>0)&&this._prom())))}return this},e.add=function(r,s){var o=this;if(Ai(s)||(s=Ln(this,s,r)),!(r instanceof vo)){if($e(r))return r.forEach(function(a){return o.add(a,s)}),this;if(Be(r))return this.addLabel(r,s);if(ye(r))r=Re.delayedCall(0,r);else return this}return this!==r?Jn(this,r,s):this},e.getChildren=function(r,s,o,a){r===void 0&&(r=!0),s===void 0&&(s=!0),o===void 0&&(o=!0),a===void 0&&(a=-On);for(var l=[],c=this._first;c;)c._start>=a&&(c instanceof Re?s&&l.push(c):(o&&l.push(c),r&&l.push.apply(l,c.getChildren(!0,s,o)))),c=c._next;return l},e.getById=function(r){for(var s=this.getChildren(1,1,1),o=s.length;o--;)if(s[o].vars.id===r)return s[o]},e.remove=function(r){return Be(r)?this.removeLabel(r):ye(r)?this.killTweensOf(r):(r.parent===this&&cl(this,r),r===this._recent&&(this._recent=this._last),Cr(this))},e.totalTime=function(r,s){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=de(vn.time-(this._ts>0?r/this._ts:(this.totalDuration()-r)/-this._ts))),n.prototype.totalTime.call(this,r,s),this._forcing=0,this):this._tTime},e.addLabel=function(r,s){return this.labels[r]=Ln(this,s),this},e.removeLabel=function(r){return delete this.labels[r],this},e.addPause=function(r,s,o){var a=Re.delayedCall(0,s||mo,o);return a.data="isPause",this._hasPause=1,Jn(this,a,Ln(this,r))},e.removePause=function(r){var s=this._first;for(r=Ln(this,r);s;)s._start===r&&s.data==="isPause"&&rr(s),s=s._next},e.killTweensOf=function(r,s,o){for(var a=this.getTweensOf(r,o),l=a.length;l--;)Zi!==a[l]&&a[l].kill(r,s);return this},e.getTweensOf=function(r,s){for(var o=[],a=Fn(r),l=this._first,c=Ai(s),h;l;)l instanceof Re?Dy(l._targets,a)&&(c?(!Zi||l._initted&&l._ts)&&l.globalTime(0)<=s&&l.globalTime(l.totalDuration())>s:!s||l.isActive())&&o.push(l):(h=l.getTweensOf(a,s)).length&&o.push.apply(o,h),l=l._next;return o},e.tweenTo=function(r,s){s=s||{};var o=this,a=Ln(o,r),l=s,c=l.startAt,h=l.onStart,d=l.onStartParams,u=l.immediateRender,f,_=Re.to(o,En({ease:s.ease||"none",lazy:!1,immediateRender:!1,time:a,overwrite:"auto",duration:s.duration||Math.abs((a-(c&&"time"in c?c.time:o._time))/o.timeScale())||oe,onStart:function(){if(o.pause(),!f){var p=s.duration||Math.abs((a-(c&&"time"in c?c.time:o._time))/o.timeScale());_._dur!==p&&ys(_,p,0,1).render(_._time,!0,!0),f=1}h&&h.apply(_,d||[])}},s));return u?_.render(0):_},e.tweenFromTo=function(r,s,o){return this.tweenTo(s,En({startAt:{time:Ln(this,r)}},o))},e.recent=function(){return this._recent},e.nextLabel=function(r){return r===void 0&&(r=this._time),Ud(this,Ln(this,r))},e.previousLabel=function(r){return r===void 0&&(r=this._time),Ud(this,Ln(this,r),1)},e.currentLabel=function(r){return arguments.length?this.seek(r,!0):this.previousLabel(this._time+oe)},e.shiftChildren=function(r,s,o){o===void 0&&(o=0);var a=this._first,l=this.labels,c;for(r=de(r);a;)a._start>=o&&(a._start+=r,a._end+=r),a=a._next;if(s)for(c in l)l[c]>=o&&(l[c]+=r);return Cr(this)},e.invalidate=function(r){var s=this._first;for(this._lock=0;s;)s.invalidate(r),s=s._next;return n.prototype.invalidate.call(this,r)},e.clear=function(r){r===void 0&&(r=!0);for(var s=this._first,o;s;)o=s._next,this.remove(s),s=o;return this._dp&&(this._time=this._tTime=this._pTime=0),r&&(this.labels={}),Cr(this)},e.totalDuration=function(r){var s=0,o=this,a=o._last,l=On,c,h,d;if(arguments.length)return o.timeScale((o._repeat<0?o.duration():o.totalDuration())/(o.reversed()?-r:r));if(o._dirty){for(d=o.parent;a;)c=a._prev,a._dirty&&a.totalDuration(),h=a._start,h>l&&o._sort&&a._ts&&!o._lock?(o._lock=1,Jn(o,a,h-a._delay,1)._lock=0):l=h,h<0&&a._ts&&(s-=h,(!d&&!o._dp||d&&d.smoothChildTiming)&&(o._start+=de(h/o._ts),o._time-=h,o._tTime-=h),o.shiftChildren(-h,!1,-1/0),l=0),a._end>s&&a._ts&&(s=a._end),a=c;ys(o,o===fe&&o._time>s?o._time:s,1,1),o._dirty=0}return o._tDur},t.updateRoot=function(r){if(fe._ts&&(Em(fe,Ga(r,fe)),wm=vn.frame),vn.frame>=Rd){Rd+=yn.autoSleep||120;var s=fe._first;if((!s||!s._ts)&&yn.autoSleep&&vn._listeners.length<2){for(;s&&!s._ts;)s=s._next;s||vn.sleep()}}},t})(vo);En(rn.prototype,{_lock:0,_hasPause:0,_forcing:0});var nw=function(t,e,i,r,s,o,a){var l=new ln(this._pt,t,e,0,1,Zm,null,s),c=0,h=0,d,u,f,_,g,p,m,y;for(l.b=i,l.e=r,i+="",r+="",(m=~r.indexOf("random("))&&(r=_o(r)),o&&(y=[i,r],o(y,t,e),i=y[0],r=y[1]),u=i.match(Il)||[];d=Il.exec(r);)_=d[0],g=r.substring(c,d.index),f?f=(f+1)%5:g.substr(-5)==="rgba("&&(f=1),_!==u[h++]&&(p=parseFloat(u[h-1])||0,l._pt={_next:l._pt,p:g||h===1?g:",",s:p,c:_.charAt(1)==="="?ds(p,_)-p:parseFloat(_)-p,m:f&&f<4?Math.round:0},c=Il.lastIndex);return l.c=c<r.length?r.substring(c,r.length):"",l.fp=a,(vm.test(r)||m)&&(l.e=0),this._pt=l,l},mu=function(t,e,i,r,s,o,a,l,c,h){ye(r)&&(r=r(s||0,t,o));var d=t[e],u=i!=="get"?i:ye(d)?c?t[e.indexOf("set")||!ye(t["get"+e.substr(3)])?e:"get"+e.substr(3)](c):t[e]():d,f=ye(d)?c?aw:$m:gu,_;if(Be(r)&&(~r.indexOf("random(")&&(r=_o(r)),r.charAt(1)==="="&&(_=ds(u,r)+(Ye(u)||0),(_||_===0)&&(r=_))),!h||u!==r||Fc)return!isNaN(u*r)&&r!==""?(_=new ln(this._pt,t,e,+u||0,r-(u||0),typeof d=="boolean"?cw:Km,0,f),c&&(_.fp=c),a&&_.modifier(a,this,t),this._pt=_):(!d&&!(e in t)&&hu(e,r),nw.call(this,t,e,u,r,f,l||yn.stringFilter,c))},iw=function(t,e,i,r,s){if(ye(t)&&(t=eo(t,s,e,i,r)),!ai(t)||t.style&&t.nodeType||$e(t)||_m(t))return Be(t)?eo(t,s,e,i,r):t;var o={},a;for(a in t)o[a]=eo(t[a],s,e,i,r);return o},Xm=function(t,e,i,r,s,o){var a,l,c,h;if(_n[t]&&(a=new _n[t]).init(s,a.rawVars?e[t]:iw(e[t],r,s,o,i),i,r,o)!==!1&&(i._pt=l=new ln(i._pt,s,t,0,1,a.render,a,0,a.priority),i!==cs))for(c=i._ptLookup[i._targets.indexOf(s)],h=a._props.length;h--;)c[a._props[h]]=l;return a},Zi,Fc,_u=function n(t,e,i){var r=t.vars,s=r.ease,o=r.startAt,a=r.immediateRender,l=r.lazy,c=r.onUpdate,h=r.runBackwards,d=r.yoyoEase,u=r.keyframes,f=r.autoRevert,_=t._dur,g=t._startAt,p=t._targets,m=t.parent,y=m&&m.data==="nested"?m.vars.targets:p,E=t._overwrite==="auto"&&!ou,b=t.timeline,S=r.easeReverse||d,T,C,v,M,P,R,D,H,X,U,G,O,$;if(b&&(!u||!s)&&(s="none"),t._ease=Ar(s,fo.ease),t._rEase=S&&(Ar(S)||t._ease),t._from=!b&&!!r.runBackwards,t._from&&(t.ratio=1),!b||u&&!r.stagger){if(H=p[0]?Tr(p[0]).harness:0,O=H&&r[H.prop],T=Ha(r,uu),g&&(g._zTime<0&&g.progress(1),e<0&&h&&a&&!f?g.render(-1,!0):g.revert(h&&_?Sa:Ry),g._lazy=0),o){if(rr(t._startAt=Re.set(p,En({data:"isStart",overwrite:!1,parent:m,immediateRender:!0,lazy:!g&&on(l),startAt:null,delay:0,onUpdate:c&&function(){return xn(t,"onUpdate")},stagger:0},o))),t._startAt._dp=0,t._startAt._sat=t,e<0&&(Ge||!a&&!f)&&t._startAt.revert(Sa),a&&_&&e<=0&&i<=0){e&&(t._zTime=e);return}}else if(h&&_&&!g){if(e&&(a=!1),v=En({overwrite:!1,data:"isFromStart",lazy:a&&!g&&on(l),immediateRender:a,stagger:0,parent:m},T),O&&(v[H.prop]=O),rr(t._startAt=Re.set(p,v)),t._startAt._dp=0,t._startAt._sat=t,e<0&&(Ge?t._startAt.revert(Sa):t._startAt.render(-1,!0)),t._zTime=e,!a)n(t._startAt,oe,oe);else if(!e)return}for(t._pt=t._ptCache=0,l=_&&on(l)||l&&!_,C=0;C<p.length;C++){if(P=p[C],D=P._gsap||fu(p)[C]._gsap,t._ptLookup[C]=U={},Lc[D.id]&&er.length&&za(),G=y===p?C:y.indexOf(P),H&&(X=new H).init(P,O||T,t,G,y)!==!1&&(t._pt=M=new ln(t._pt,P,X.name,0,1,X.render,X,0,X.priority),X._props.forEach(function(Q){U[Q]=M}),X.priority&&(R=1)),!H||O)for(v in T)_n[v]&&(X=Xm(v,T,t,G,P,y))?X.priority&&(R=1):U[v]=M=mu.call(t,P,v,"get",T[v],G,y,0,r.stringFilter);t._op&&t._op[C]&&t.kill(P,t._op[C]),E&&t._pt&&(Zi=t,fe.killTweensOf(P,U,t.globalTime(e)),$=!t.parent,Zi=0),t._pt&&l&&(Lc[D.id]=1)}R&&Jm(t),t._onInit&&t._onInit(t)}t._onUpdate=c,t._initted=(!t._op||t._pt)&&!$,u&&e<=0&&b.render(On,!0,!0)},rw=function(t,e,i,r,s,o,a,l){var c=(t._pt&&t._ptCache||(t._ptCache={}))[e],h,d,u,f;if(!c)for(c=t._ptCache[e]=[],u=t._ptLookup,f=t._targets.length;f--;){if(h=u[f][e],h&&h.d&&h.d._pt)for(h=h.d._pt;h&&h.p!==e&&h.fp!==e;)h=h._next;if(!h)return Fc=1,t.vars[e]="+=0",_u(t,a),Fc=0,l?po(e+" not eligible for reset. Try splitting into individual properties"):1;c.push(h)}for(f=c.length;f--;)d=c[f],h=d._pt||d,h.s=(r||r===0)&&!s?r:h.s+(r||0)+o*h.c,h.c=i-h.s,d.e&&(d.e=Me(i)+Ye(d.e)),d.b&&(d.b=h.s+Ye(d.b))},sw=function(t,e){var i=t[0]?Tr(t[0]).harness:0,r=i&&i.aliases,s,o,a,l;if(!r)return e;s=xs({},e);for(o in r)if(o in s)for(l=r[o].split(","),a=l.length;a--;)s[l[a]]=s[o];return s},ow=function(t,e,i,r){var s=e.ease||r||"power1.inOut",o,a;if($e(e))a=i[t]||(i[t]=[]),e.forEach(function(l,c){return a.push({t:c/(e.length-1)*100,v:l,e:s})});else for(o in e)a=i[o]||(i[o]=[]),o==="ease"||a.push({t:parseFloat(t),v:e[o],e:s})},eo=function(t,e,i,r,s){return ye(t)?t.call(e,i,r,s):Be(t)&&~t.indexOf("random(")?_o(t):t},qm=du+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert",Ym={};an(qm+",id,stagger,delay,duration,paused,scrollTrigger",function(n){return Ym[n]=1});var Re=(function(n){pm(t,n);function t(i,r,s,o){var a;typeof r=="number"&&(s.duration=r,r=s,s=null),a=n.call(this,o?r:Qs(r))||this;var l=a.vars,c=l.duration,h=l.delay,d=l.immediateRender,u=l.stagger,f=l.overwrite,_=l.keyframes,g=l.defaults,p=l.scrollTrigger,m=r.parent||fe,y=($e(i)||_m(i)?Ai(i[0]):"length"in r)?[i]:Fn(i),E,b,S,T,C,v,M,P;if(a._targets=y.length?fu(y):po("GSAP target "+i+" not found. https://gsap.com",!yn.nullTargetWarn)||[],a._ptLookup=[],a._overwrite=f,_||u||qo(c)||qo(h)){r=a.vars;var R=r.easeReverse||r.yoyoEase;if(E=a.timeline=new rn({data:"nested",defaults:g||{},targets:m&&m.data==="nested"?m.vars.targets:y}),E.kill(),E.parent=E._dp=gi(a),E._start=0,u||qo(c)||qo(h)){if(T=y.length,M=u&&Im(u),ai(u))for(C in u)~qm.indexOf(C)&&(P||(P={}),P[C]=u[C]);for(b=0;b<T;b++)S=Ha(r,Ym),S.stagger=0,R&&(S.easeReverse=R),P&&xs(S,P),v=y[b],S.duration=+eo(c,gi(a),b,v,y),S.delay=(+eo(h,gi(a),b,v,y)||0)-a._delay,!u&&T===1&&S.delay&&(a._delay=h=S.delay,a._start+=h,S.delay=0),E.to(v,S,M?M(b,v,y):0),E._ease=Ht.none;E.duration()?c=h=0:a.timeline=0}else if(_){Qs(En(E.vars.defaults,{ease:"none"})),E._ease=Ar(_.ease||r.ease||"none");var D=0,H,X,U;if($e(_))_.forEach(function(G){return E.to(y,G,">")}),E.duration();else{S={};for(C in _)C==="ease"||C==="easeEach"||ow(C,_[C],S,_.easeEach);for(C in S)for(H=S[C].sort(function(G,O){return G.t-O.t}),D=0,b=0;b<H.length;b++)X=H[b],U={ease:X.e,duration:(X.t-(b?H[b-1].t:0))/100*c},U[C]=X.v,E.to(y,U,D),D+=U.duration;E.duration()<c&&E.to({},{duration:c-E.duration()})}}c||a.duration(c=E.duration())}else a.timeline=0;return f===!0&&!ou&&(Zi=gi(a),fe.killTweensOf(y),Zi=0),Jn(m,gi(a),s),r.reversed&&a.reverse(),r.paused&&a.paused(!0),(d||!c&&!_&&a._start===de(m._time)&&on(d)&&Oy(gi(a))&&m.data!=="nested")&&(a._tTime=-oe,a.render(Math.max(0,-h)||0)),p&&Pm(gi(a),p),a}var e=t.prototype;return e.render=function(r,s,o){var a=this._time,l=this._tDur,c=this._dur,h=r<0,d=r>l-oe&&!h?l:r<oe?0:r,u,f,_,g,p,m,y,E;if(!c)ky(this,r,s,o);else if(d!==this._tTime||!r||o||!this._initted&&this._tTime||this._startAt&&this._zTime<0!==h||this._lazy){if(u=d,E=this.timeline,this._repeat){if(g=c+this._rDelay,this._repeat<-1&&h)return this.totalTime(g*100+r,s,o);if(u=de(d%g),d===l?(_=this._repeat,u=c):(p=de(d/g),_=~~p,_&&_===p?(u=c,_--):u>c&&(u=c)),m=this._yoyo&&_&1,m&&(u=c-u),p=bs(this._tTime,g),u===a&&!o&&this._initted&&_===p)return this._tTime=d,this;_!==p&&this.vars.repeatRefresh&&!m&&!this._lock&&u!==g&&this._initted&&(this._lock=o=1,this.render(de(g*_),!0).invalidate()._lock=0)}if(!this._initted){if(Rm(this,h?r:u,o,s,d))return this._tTime=0,this;if(a!==this._time&&!(o&&this.vars.repeatRefresh&&_!==p))return this;if(c!==this._dur)return this.render(r,s,o)}if(this._rEase){var b=u<a;if(b!==this._inv){var S=b?a:c-a;this._inv=b,this._from&&(this.ratio=1-this.ratio),this._invRatio=this.ratio,this._invTime=a,this._invRecip=S?(b?-1:1)/S:0,this._invScale=b?-this.ratio:1-this.ratio,this._invEase=b?this._rEase:this._ease}this.ratio=y=this._invRatio+this._invScale*this._invEase((u-this._invTime)*this._invRecip)}else this.ratio=y=this._ease(u/c);if(this._from&&(this.ratio=y=1-y),this._tTime=d,this._time=u,!this._act&&this._ts&&(this._act=1,this._lazy=0),!a&&d&&!s&&!p&&(xn(this,"onStart"),this._tTime!==d))return this;for(f=this._pt;f;)f.r(y,f.d),f=f._next;E&&E.render(r<0?r:E._dur*E._ease(u/this._dur),s,o)||this._startAt&&(this._zTime=r),this._onUpdate&&!s&&(h&&Dc(this,r,s,o),xn(this,"onUpdate")),this._repeat&&_!==p&&this.vars.onRepeat&&!s&&this.parent&&xn(this,"onRepeat"),(d===this._tDur||!d)&&this._tTime===d&&(h&&!this._onUpdate&&Dc(this,r,!0,!0),(r||!c)&&(d===this._tDur&&this._ts>0||!d&&this._ts<0)&&rr(this,1),!s&&!(h&&!a)&&(d||a||m)&&(xn(this,d===l?"onComplete":"onReverseComplete",!0),this._prom&&!(d<l&&this.timeScale()>0)&&this._prom()))}return this},e.targets=function(){return this._targets},e.invalidate=function(r){return(!r||!this.vars.runBackwards)&&(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(r),n.prototype.invalidate.call(this,r)},e.resetTo=function(r,s,o,a,l){go||vn.wake(),this._ts||this.play();var c=Math.min(this._dur,(this._dp._time-this._start)*this._ts),h;return this._initted||_u(this,c),h=this._ease(c/this._dur),rw(this,r,s,o,a,h,c,l)?this.resetTo(r,s,o,a,1):(ul(this,0),this.parent||Cm(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},e.kill=function(r,s){if(s===void 0&&(s="all"),!r&&(!s||s==="all"))return this._lazy=this._pt=0,this.parent?Ys(this):this.scrollTrigger&&this.scrollTrigger.kill(!!Ge),this;if(this.timeline){var o=this.timeline.totalDuration();return this.timeline.killTweensOf(r,s,Zi&&Zi.vars.overwrite!==!0)._first||Ys(this),this.parent&&o!==this.timeline.totalDuration()&&ys(this,this._dur*this.timeline._tDur/o,0,1),this}var a=this._targets,l=r?Fn(r):a,c=this._ptLookup,h=this._pt,d,u,f,_,g,p,m;if((!s||s==="all")&&Uy(a,l))return s==="all"&&(this._pt=0),Ys(this);for(d=this._op=this._op||[],s!=="all"&&(Be(s)&&(g={},an(s,function(y){return g[y]=1}),s=g),s=sw(a,s)),m=a.length;m--;)if(~l.indexOf(a[m])){u=c[m],s==="all"?(d[m]=s,_=u,f={}):(f=d[m]=d[m]||{},_=s);for(g in _)p=u&&u[g],p&&((!("kill"in p.d)||p.d.kill(g)===!0)&&cl(this,p,"_pt"),delete u[g]),f!=="all"&&(f[g]=1)}return this._initted&&!this._pt&&h&&Ys(this),this},t.to=function(r,s){return new t(r,s,arguments[2])},t.from=function(r,s){return to(1,arguments)},t.delayedCall=function(r,s,o,a){return new t(s,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:r,onComplete:s,onReverseComplete:s,onCompleteParams:o,onReverseCompleteParams:o,callbackScope:a})},t.fromTo=function(r,s,o){return to(2,arguments)},t.set=function(r,s){return s.duration=0,s.repeatDelay||(s.repeat=0),new t(r,s)},t.killTweensOf=function(r,s,o){return fe.killTweensOf(r,s,o)},t})(vo);En(Re.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0});an("staggerTo,staggerFrom,staggerFromTo",function(n){Re[n]=function(){var t=new rn,e=Uc.call(arguments,0);return e.splice(n==="staggerFromTo"?5:4,0,0),t[n].apply(t,e)}});var gu=function(t,e,i){return t[e]=i},$m=function(t,e,i){return t[e](i)},aw=function(t,e,i,r){return t[e](r.fp,i)},lw=function(t,e,i){return t.setAttribute(e,i)},vu=function(t,e){return ye(t[e])?$m:au(t[e])&&t.setAttribute?lw:gu},Km=function(t,e){return e.set(e.t,e.p,Math.round((e.s+e.c*t)*1e6)/1e6,e)},cw=function(t,e){return e.set(e.t,e.p,!!(e.s+e.c*t),e)},Zm=function(t,e){var i=e._pt,r="";if(!t&&e.b)r=e.b;else if(t===1&&e.e)r=e.e;else{for(;i;)r=i.p+(i.m?i.m(i.s+i.c*t):Math.round((i.s+i.c*t)*1e4)/1e4)+r,i=i._next;r+=e.c}e.set(e.t,e.p,r,e)},xu=function(t,e){for(var i=e._pt;i;)i.r(t,i.d),i=i._next},hw=function(t,e,i,r){for(var s=this._pt,o;s;)o=s._next,s.p===r&&s.modifier(t,e,i),s=o},uw=function(t){for(var e=this._pt,i,r;e;)r=e._next,e.p===t&&!e.op||e.op===t?cl(this,e,"_pt"):e.dep||(i=1),e=r;return!i},dw=function(t,e,i,r){r.mSet(t,e,r.m.call(r.tween,i,r.mt),r)},Jm=function(t){for(var e=t._pt,i,r,s,o;e;){for(i=e._next,r=s;r&&r.pr>e.pr;)r=r._next;(e._prev=r?r._prev:o)?e._prev._next=e:s=e,(e._next=r)?r._prev=e:o=e,e=i}t._pt=s},ln=(function(){function n(e,i,r,s,o,a,l,c,h){this.t=i,this.s=s,this.c=o,this.p=r,this.r=a||Km,this.d=l||this,this.set=c||gu,this.pr=h||0,this._next=e,e&&(e._prev=this)}var t=n.prototype;return t.modifier=function(i,r,s){this.mSet=this.mSet||this.set,this.set=dw,this.m=i,this.mt=s,this.tween=r},n})();an(du+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse",function(n){return uu[n]=1});Sn.TweenMax=Sn.TweenLite=Re;Sn.TimelineLite=Sn.TimelineMax=rn;fe=new rn({sortChildren:!1,defaults:fo,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0});yn.stringFilter=Hm;var Pr=[],Ma={},fw=[],Od=0,pw=0,kl=function(t){return(Ma[t]||fw).map(function(e){return e()})},kc=function(){var t=Date.now(),e=[];t-Od>2&&(kl("matchMediaInit"),Pr.forEach(function(i){var r=i.queries,s=i.conditions,o,a,l,c;for(a in r)o=Kn.matchMedia(r[a]).matches,o&&(l=1),o!==s[a]&&(s[a]=o,c=1);c&&(i.revert(),l&&e.push(i))}),kl("matchMediaRevert"),e.forEach(function(i){return i.onMatch(i,function(r){return i.add(null,r)})}),Od=t,kl("matchMedia"))},jm=(function(){function n(e,i){this.selector=i&&Nc(i),this.data=[],this._r=[],this.isReverted=!1,this.id=pw++,e&&this.add(e)}var t=n.prototype;return t.add=function(i,r,s){ye(i)&&(s=r,r=i,i=ye);var o=this,a=function(){var c=he,h=o.selector,d;return c&&c!==o&&c.data.push(o),s&&(o.selector=Nc(s)),he=o,d=r.apply(o,arguments),ye(d)&&o._r.push(d),he=c,o.selector=h,o.isReverted=!1,d};return o.last=a,i===ye?a(o,function(l){return o.add(null,l)}):i?o[i]=a:a},t.ignore=function(i){var r=he;he=null,i(this),he=r},t.getTweens=function(){var i=[];return this.data.forEach(function(r){return r instanceof n?i.push.apply(i,r.getTweens()):r instanceof Re&&!(r.parent&&r.parent.data==="nested")&&i.push(r)}),i},t.clear=function(){this._r.length=this.data.length=0},t.kill=function(i,r){var s=this;if(i?(function(){for(var a=s.getTweens(),l=s.data.length,c;l--;)c=s.data[l],c.data==="isFlip"&&(c.revert(),c.getChildren(!0,!0,!1).forEach(function(h){return a.splice(a.indexOf(h),1)}));for(a.map(function(h){return{g:h._dur||h._delay||h._sat&&!h._sat.vars.immediateRender?h.globalTime(0):-1/0,t:h}}).sort(function(h,d){return d.g-h.g||-1/0}).forEach(function(h){return h.t.revert(i)}),l=s.data.length;l--;)c=s.data[l],c instanceof rn?c.data!=="nested"&&(c.scrollTrigger&&c.scrollTrigger.revert(),c.kill()):!(c instanceof Re)&&c.revert&&c.revert(i);s._r.forEach(function(h){return h(i,s)}),s.isReverted=!0})():this.data.forEach(function(a){return a.kill&&a.kill()}),this.clear(),r)for(var o=Pr.length;o--;)Pr[o].id===this.id&&Pr.splice(o,1)},t.revert=function(i){this.kill(i||{})},n})(),mw=(function(){function n(e){this.contexts=[],this.scope=e,he&&he.data.push(this)}var t=n.prototype;return t.add=function(i,r,s){ai(i)||(i={matches:i});var o=new jm(0,s||this.scope),a=o.conditions={},l,c,h;he&&!o.selector&&(o.selector=he.selector),this.contexts.push(o),r=o.add("onMatch",r),o.queries=i;for(c in i)c==="all"?h=1:(l=Kn.matchMedia(i[c]),l&&(Pr.indexOf(o)<0&&Pr.push(o),(a[c]=l.matches)&&(h=1),l.addListener?l.addListener(kc):l.addEventListener("change",kc)));return h&&r(o,function(d){return o.add(null,d)}),this},t.revert=function(i){this.kill(i||{})},t.kill=function(i){this.contexts.forEach(function(r){return r.kill(i,!0)})},n})(),Wa={registerPlugin:function(){for(var t=arguments.length,e=new Array(t),i=0;i<t;i++)e[i]=arguments[i];e.forEach(function(r){return Bm(r)})},timeline:function(t){return new rn(t)},getTweensOf:function(t,e){return fe.getTweensOf(t,e)},getProperty:function(t,e,i,r){Be(t)&&(t=Fn(t)[0]);var s=Tr(t||{}).get,o=i?Tm:Mm;return i==="native"&&(i=""),t&&(e?o((_n[e]&&_n[e].get||s)(t,e,i,r)):function(a,l,c){return o((_n[a]&&_n[a].get||s)(t,a,l,c))})},quickSetter:function(t,e,i){if(t=Fn(t),t.length>1){var r=t.map(function(h){return dn.quickSetter(h,e,i)}),s=r.length;return function(h){for(var d=s;d--;)r[d](h)}}t=t[0]||{};var o=_n[e],a=Tr(t),l=a.harness&&(a.harness.aliases||{})[e]||e,c=o?function(h){var d=new o;cs._pt=0,d.init(t,i?h+i:h,cs,0,[t]),d.render(1,d),cs._pt&&xu(1,cs)}:a.set(t,l);return o?c:function(h){return c(t,l,i?h+i:h,a,1)}},quickTo:function(t,e,i){var r,s=dn.to(t,En((r={},r[e]="+=0.1",r.paused=!0,r.stagger=0,r),i||{})),o=function(l,c,h){return s.resetTo(e,l,c,h)};return o.tween=s,o},isTweening:function(t){return fe.getTweensOf(t,!0).length>0},defaults:function(t){return t&&t.ease&&(t.ease=Ar(t.ease,fo.ease)),Ld(fo,t||{})},config:function(t){return Ld(yn,t||{})},registerEffect:function(t){var e=t.name,i=t.effect,r=t.plugins,s=t.defaults,o=t.extendTimeline;(r||"").split(",").forEach(function(a){return a&&!_n[a]&&!Sn[a]&&po(e+" effect requires "+a+" plugin.")}),Ul[e]=function(a,l,c){return i(Fn(a),En(l||{},s),c)},o&&(rn.prototype[e]=function(a,l,c){return this.add(Ul[e](a,ai(l)?l:(c=l)&&{},this),c)})},registerEase:function(t,e){Ht[t]=Ar(e)},parseEase:function(t,e){return arguments.length?Ar(t,e):Ht},getById:function(t){return fe.getById(t)},exportRoot:function(t,e){t===void 0&&(t={});var i=new rn(t),r,s;for(i.smoothChildTiming=on(t.smoothChildTiming),fe.remove(i),i._dp=0,i._time=i._tTime=fe._time,r=fe._first;r;)s=r._next,(e||!(!r._dur&&r instanceof Re&&r.vars.onComplete===r._targets[0]))&&Jn(i,r,r._start-r._delay),r=s;return Jn(fe,i,0),i},context:function(t,e){return t?new jm(t,e):he},matchMedia:function(t){return new mw(t)},matchMediaRefresh:function(){return Pr.forEach(function(t){var e=t.conditions,i,r;for(r in e)e[r]&&(e[r]=!1,i=1);i&&t.revert()})||kc()},addEventListener:function(t,e){var i=Ma[t]||(Ma[t]=[]);~i.indexOf(e)||i.push(e)},removeEventListener:function(t,e){var i=Ma[t],r=i&&i.indexOf(e);r>=0&&i.splice(r,1)},utils:{wrap:qy,wrapYoyo:Yy,distribute:Im,random:Nm,snap:Um,normalize:Xy,getUnit:Ye,clamp:zy,splitColor:Vm,toArray:Fn,selector:Nc,mapRange:Fm,pipe:Gy,unitize:Wy,interpolate:$y,shuffle:Dm},install:bm,effects:Ul,ticker:vn,updateRoot:rn.updateRoot,plugins:_n,globalTimeline:fe,core:{PropTween:ln,globals:ym,Tween:Re,Timeline:rn,Animation:vo,getCache:Tr,_removeLinkedListItem:cl,reverting:function(){return Ge},context:function(t){return t&&he&&(he.data.push(t),t._ctx=he),he},suppressOverwrites:function(t){return ou=t}}};an("to,from,fromTo,delayedCall,set,killTweensOf",function(n){return Wa[n]=Re[n]});vn.add(rn.updateRoot);cs=Wa.to({},{duration:0});var _w=function(t,e){for(var i=t._pt;i&&i.p!==e&&i.op!==e&&i.fp!==e;)i=i._next;return i},gw=function(t,e){var i=t._targets,r,s,o;for(r in e)for(s=i.length;s--;)o=t._ptLookup[s][r],o&&(o=o.d)&&(o._pt&&(o=_w(o,r)),o&&o.modifier&&o.modifier(e[r],t,i[s],r))},Bl=function(t,e){return{name:t,headless:1,rawVars:1,init:function(r,s,o){o._onInit=function(a){var l,c;if(Be(s)&&(l={},an(s,function(h){return l[h]=1}),s=l),e){l={};for(c in s)l[c]=e(s[c]);s=l}gw(a,s)}}}},dn=Wa.registerPlugin({name:"attr",init:function(t,e,i,r,s){var o,a,l;this.tween=i;for(o in e)l=t.getAttribute(o)||"",a=this.add(t,"setAttribute",(l||0)+"",e[o],r,s,0,0,o),a.op=o,a.b=l,this._props.push(o)},render:function(t,e){for(var i=e._pt;i;)Ge?i.set(i.t,i.p,i.b,i):i.r(t,i.d),i=i._next}},{name:"endArray",headless:1,init:function(t,e){for(var i=e.length;i--;)this.add(t,i,t[i]||0,e[i],0,0,0,0,0,1)}},Bl("roundProps",Oc),Bl("modifiers"),Bl("snap",Um))||Wa;Re.version=rn.version=dn.version="3.15.0";xm=1;lu()&&ws();Ht.Power0;Ht.Power1;Ht.Power2;Ht.Power3;Ht.Power4;Ht.Linear;Ht.Quad;Ht.Cubic;Ht.Quart;Ht.Quint;Ht.Strong;Ht.Elastic;Ht.Back;Ht.SteppedEase;Ht.Bounce;Ht.Sine;Ht.Expo;Ht.Circ;/*!
 * CSSPlugin 3.15.0
 * https://gsap.com
 *
 * Copyright 2008-2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var Fd,Ji,fs,bu,wr,kd,yu,vw=function(){return typeof window<"u"},Pi={},vr=180/Math.PI,ps=Math.PI/180,Xr=Math.atan2,Bd=1e8,wu=/([A-Z])/g,xw=/(left|right|width|margin|padding|x)/i,bw=/[\s,\(]\S/,Qn={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},Bc=function(t,e){return e.set(e.t,e.p,Math.round((e.s+e.c*t)*1e4)/1e4+e.u,e)},yw=function(t,e){return e.set(e.t,e.p,t===1?e.e:Math.round((e.s+e.c*t)*1e4)/1e4+e.u,e)},ww=function(t,e){return e.set(e.t,e.p,t?Math.round((e.s+e.c*t)*1e4)/1e4+e.u:e.b,e)},Sw=function(t,e){return e.set(e.t,e.p,t===1?e.e:t?Math.round((e.s+e.c*t)*1e4)/1e4+e.u:e.b,e)},Ew=function(t,e){var i=e.s+e.c*t;e.set(e.t,e.p,~~(i+(i<0?-.5:.5))+e.u,e)},Qm=function(t,e){return e.set(e.t,e.p,t?e.e:e.b,e)},t_=function(t,e){return e.set(e.t,e.p,t!==1?e.b:e.e,e)},Mw=function(t,e,i){return t.style[e]=i},Tw=function(t,e,i){return t.style.setProperty(e,i)},Cw=function(t,e,i){return t._gsap[e]=i},Aw=function(t,e,i){return t._gsap.scaleX=t._gsap.scaleY=i},Pw=function(t,e,i,r,s){var o=t._gsap;o.scaleX=o.scaleY=i,o.renderTransform(s,o)},Rw=function(t,e,i,r,s){var o=t._gsap;o[e]=i,o.renderTransform(s,o)},pe="transform",cn=pe+"Origin",Lw=function n(t,e){var i=this,r=this.target,s=r.style,o=r._gsap;if(t in Pi&&s){if(this.tfm=this.tfm||{},t!=="transform")t=Qn[t]||t,~t.indexOf(",")?t.split(",").forEach(function(a){return i.tfm[a]=vi(r,a)}):this.tfm[t]=o.x?o[t]:vi(r,t),t===cn&&(this.tfm.zOrigin=o.zOrigin);else return Qn.transform.split(",").forEach(function(a){return n.call(i,a,e)});if(this.props.indexOf(pe)>=0)return;o.svg&&(this.svgo=r.getAttribute("data-svg-origin"),this.props.push(cn,e,"")),t=pe}(s||e)&&this.props.push(t,e,s[t])},e_=function(t){t.translate&&(t.removeProperty("translate"),t.removeProperty("scale"),t.removeProperty("rotate"))},Dw=function(){var t=this.props,e=this.target,i=e.style,r=e._gsap,s,o;for(s=0;s<t.length;s+=3)t[s+1]?t[s+1]===2?e[t[s]](t[s+2]):e[t[s]]=t[s+2]:t[s+2]?i[t[s]]=t[s+2]:i.removeProperty(t[s].substr(0,2)==="--"?t[s]:t[s].replace(wu,"-$1").toLowerCase());if(this.tfm){for(o in this.tfm)r[o]=this.tfm[o];r.svg&&(r.renderTransform(),e.setAttribute("data-svg-origin",this.svgo||"")),s=yu(),(!s||!s.isStart)&&!i[pe]&&(e_(i),r.zOrigin&&i[cn]&&(i[cn]+=" "+r.zOrigin+"px",r.zOrigin=0,r.renderTransform()),r.uncache=1)}},n_=function(t,e){var i={target:t,props:[],revert:Dw,save:Lw};return t._gsap||dn.core.getCache(t),e&&t.style&&t.nodeType&&e.split(",").forEach(function(r){return i.save(r)}),i},i_,Vc=function(t,e){var i=Ji.createElementNS?Ji.createElementNS((e||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),t):Ji.createElement(t);return i&&i.style?i:Ji.createElement(t)},bn=function n(t,e,i){var r=getComputedStyle(t);return r[e]||r.getPropertyValue(e.replace(wu,"-$1").toLowerCase())||r.getPropertyValue(e)||!i&&n(t,Ss(e)||e,1)||""},Vd="O,Moz,ms,Ms,Webkit".split(","),Ss=function(t,e,i){var r=e||wr,s=r.style,o=5;if(t in s&&!i)return t;for(t=t.charAt(0).toUpperCase()+t.substr(1);o--&&!(Vd[o]+t in s););return o<0?null:(o===3?"ms":o>=0?Vd[o]:"")+t},zc=function(){vw()&&window.document&&(Fd=window,Ji=Fd.document,fs=Ji.documentElement,wr=Vc("div")||{style:{}},Vc("div"),pe=Ss(pe),cn=pe+"Origin",wr.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",i_=!!Ss("perspective"),yu=dn.core.reverting,bu=1)},zd=function(t){var e=t.ownerSVGElement,i=Vc("svg",e&&e.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),r=t.cloneNode(!0),s;r.style.display="block",i.appendChild(r),fs.appendChild(i);try{s=r.getBBox()}catch{}return i.removeChild(r),fs.removeChild(i),s},Hd=function(t,e){for(var i=e.length;i--;)if(t.hasAttribute(e[i]))return t.getAttribute(e[i])},r_=function(t){var e,i;try{e=t.getBBox()}catch{e=zd(t),i=1}return e&&(e.width||e.height)||i||(e=zd(t)),e&&!e.width&&!e.x&&!e.y?{x:+Hd(t,["x","cx","x1"])||0,y:+Hd(t,["y","cy","y1"])||0,width:0,height:0}:e},s_=function(t){return!!(t.getCTM&&(!t.parentNode||t.ownerSVGElement)&&r_(t))},sr=function(t,e){if(e){var i=t.style,r;e in Pi&&e!==cn&&(e=pe),i.removeProperty?(r=e.substr(0,2),(r==="ms"||e.substr(0,6)==="webkit")&&(e="-"+e),i.removeProperty(r==="--"?e:e.replace(wu,"-$1").toLowerCase())):i.removeAttribute(e)}},ji=function(t,e,i,r,s,o){var a=new ln(t._pt,e,i,0,1,o?t_:Qm);return t._pt=a,a.b=r,a.e=s,t._props.push(i),a},Gd={deg:1,rad:1,turn:1},Iw={grid:1,flex:1},or=function n(t,e,i,r){var s=parseFloat(i)||0,o=(i+"").trim().substr((s+"").length)||"px",a=wr.style,l=xw.test(e),c=t.tagName.toLowerCase()==="svg",h=(c?"client":"offset")+(l?"Width":"Height"),d=100,u=r==="px",f=r==="%",_,g,p,m;if(r===o||!s||Gd[r]||Gd[o])return s;if(o!=="px"&&!u&&(s=n(t,e,i,"px")),m=t.getCTM&&s_(t),(f||o==="%")&&(Pi[e]||~e.indexOf("adius")))return _=m?t.getBBox()[l?"width":"height"]:t[h],Me(f?s/_*d:s/100*_);if(a[l?"width":"height"]=d+(u?o:r),g=r!=="rem"&&~e.indexOf("adius")||r==="em"&&t.appendChild&&!c?t:t.parentNode,m&&(g=(t.ownerSVGElement||{}).parentNode),(!g||g===Ji||!g.appendChild)&&(g=Ji.body),p=g._gsap,p&&f&&p.width&&l&&p.time===vn.time&&!p.uncache)return Me(s/p.width*d);if(f&&(e==="height"||e==="width")){var y=t.style[e];t.style[e]=d+r,_=t[h],y?t.style[e]=y:sr(t,e)}else(f||o==="%")&&!Iw[bn(g,"display")]&&(a.position=bn(t,"position")),g===t&&(a.position="static"),g.appendChild(wr),_=wr[h],g.removeChild(wr),a.position="absolute";return l&&f&&(p=Tr(g),p.time=vn.time,p.width=g[h]),Me(u?_*s/d:_&&s?d/_*s:0)},vi=function(t,e,i,r){var s;return bu||zc(),e in Qn&&e!=="transform"&&(e=Qn[e],~e.indexOf(",")&&(e=e.split(",")[0])),Pi[e]&&e!=="transform"?(s=bo(t,r),s=e!=="transformOrigin"?s[e]:s.svg?s.origin:qa(bn(t,cn))+" "+s.zOrigin+"px"):(s=t.style[e],(!s||s==="auto"||r||~(s+"").indexOf("calc("))&&(s=Xa[e]&&Xa[e](t,e,i)||bn(t,e)||Sm(t,e)||(e==="opacity"?1:0))),i&&!~(s+"").trim().indexOf(" ")?or(t,e,s,i)+i:s},Uw=function(t,e,i,r){if(!i||i==="none"){var s=Ss(e,t,1),o=s&&bn(t,s,1);o&&o!==i?(e=s,i=o):e==="borderColor"&&(i=bn(t,"borderTopColor"))}var a=new ln(this._pt,t.style,e,0,1,Zm),l=0,c=0,h,d,u,f,_,g,p,m,y,E,b,S;if(a.b=i,a.e=r,i+="",r+="",r.substring(0,6)==="var(--"&&(r=bn(t,r.substring(4,r.indexOf(")")))),r==="auto"&&(g=t.style[e],t.style[e]=r,r=bn(t,e)||r,g?t.style[e]=g:sr(t,e)),h=[i,r],Hm(h),i=h[0],r=h[1],u=i.match(ls)||[],S=r.match(ls)||[],S.length){for(;d=ls.exec(r);)p=d[0],y=r.substring(l,d.index),_?_=(_+1)%5:(y.substr(-5)==="rgba("||y.substr(-5)==="hsla(")&&(_=1),p!==(g=u[c++]||"")&&(f=parseFloat(g)||0,b=g.substr((f+"").length),p.charAt(1)==="="&&(p=ds(f,p)+b),m=parseFloat(p),E=p.substr((m+"").length),l=ls.lastIndex-E.length,E||(E=E||yn.units[e]||b,l===r.length&&(r+=E,a.e+=E)),b!==E&&(f=or(t,e,g,E)||0),a._pt={_next:a._pt,p:y||c===1?y:",",s:f,c:m-f,m:_&&_<4||e==="zIndex"?Math.round:0});a.c=l<r.length?r.substring(l,r.length):""}else a.r=e==="display"&&r==="none"?t_:Qm;return vm.test(r)&&(a.e=0),this._pt=a,a},Wd={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},Nw=function(t){var e=t.split(" "),i=e[0],r=e[1]||"50%";return(i==="top"||i==="bottom"||r==="left"||r==="right")&&(t=i,i=r,r=t),e[0]=Wd[i]||i,e[1]=Wd[r]||r,e.join(" ")},Ow=function(t,e){if(e.tween&&e.tween._time===e.tween._dur){var i=e.t,r=i.style,s=e.u,o=i._gsap,a,l,c;if(s==="all"||s===!0)r.cssText="",l=1;else for(s=s.split(","),c=s.length;--c>-1;)a=s[c],Pi[a]&&(l=1,a=a==="transformOrigin"?cn:pe),sr(i,a);l&&(sr(i,pe),o&&(o.svg&&i.removeAttribute("transform"),r.scale=r.rotate=r.translate="none",bo(i,1),o.uncache=1,e_(r)))}},Xa={clearProps:function(t,e,i,r,s){if(s.data!=="isFromStart"){var o=t._pt=new ln(t._pt,e,i,0,0,Ow);return o.u=r,o.pr=-10,o.tween=s,t._props.push(i),1}}},xo=[1,0,0,1,0,0],o_={},a_=function(t){return t==="matrix(1, 0, 0, 1, 0, 0)"||t==="none"||!t},Xd=function(t){var e=bn(t,pe);return a_(e)?xo:e.substr(7).match(gm).map(Me)},Su=function(t,e){var i=t._gsap||Tr(t),r=t.style,s=Xd(t),o,a,l,c;return i.svg&&t.getAttribute("transform")?(l=t.transform.baseVal.consolidate().matrix,s=[l.a,l.b,l.c,l.d,l.e,l.f],s.join(",")==="1,0,0,1,0,0"?xo:s):(s===xo&&!t.offsetParent&&t!==fs&&!i.svg&&(l=r.display,r.display="block",o=t.parentNode,(!o||!t.offsetParent&&!t.getBoundingClientRect().width)&&(c=1,a=t.nextElementSibling,fs.appendChild(t)),s=Xd(t),l?r.display=l:sr(t,"display"),c&&(a?o.insertBefore(t,a):o?o.appendChild(t):fs.removeChild(t))),e&&s.length>6?[s[0],s[1],s[4],s[5],s[12],s[13]]:s)},Hc=function(t,e,i,r,s,o){var a=t._gsap,l=s||Su(t,!0),c=a.xOrigin||0,h=a.yOrigin||0,d=a.xOffset||0,u=a.yOffset||0,f=l[0],_=l[1],g=l[2],p=l[3],m=l[4],y=l[5],E=e.split(" "),b=parseFloat(E[0])||0,S=parseFloat(E[1])||0,T,C,v,M;i?l!==xo&&(C=f*p-_*g)&&(v=b*(p/C)+S*(-g/C)+(g*y-p*m)/C,M=b*(-_/C)+S*(f/C)-(f*y-_*m)/C,b=v,S=M):(T=r_(t),b=T.x+(~E[0].indexOf("%")?b/100*T.width:b),S=T.y+(~(E[1]||E[0]).indexOf("%")?S/100*T.height:S)),r||r!==!1&&a.smooth?(m=b-c,y=S-h,a.xOffset=d+(m*f+y*g)-m,a.yOffset=u+(m*_+y*p)-y):a.xOffset=a.yOffset=0,a.xOrigin=b,a.yOrigin=S,a.smooth=!!r,a.origin=e,a.originIsAbsolute=!!i,t.style[cn]="0px 0px",o&&(ji(o,a,"xOrigin",c,b),ji(o,a,"yOrigin",h,S),ji(o,a,"xOffset",d,a.xOffset),ji(o,a,"yOffset",u,a.yOffset)),t.setAttribute("data-svg-origin",b+" "+S)},bo=function(t,e){var i=t._gsap||new Wm(t);if("x"in i&&!e&&!i.uncache)return i;var r=t.style,s=i.scaleX<0,o="px",a="deg",l=getComputedStyle(t),c=bn(t,cn)||"0",h,d,u,f,_,g,p,m,y,E,b,S,T,C,v,M,P,R,D,H,X,U,G,O,$,Q,it,et,dt,Rt,kt,Lt;return h=d=u=g=p=m=y=E=b=0,f=_=1,i.svg=!!(t.getCTM&&s_(t)),l.translate&&((l.translate!=="none"||l.scale!=="none"||l.rotate!=="none")&&(r[pe]=(l.translate!=="none"?"translate3d("+(l.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+(l.rotate!=="none"?"rotate("+l.rotate+") ":"")+(l.scale!=="none"?"scale("+l.scale.split(" ").join(",")+") ":"")+(l[pe]!=="none"?l[pe]:"")),r.scale=r.rotate=r.translate="none"),C=Su(t,i.svg),i.svg&&(i.uncache?($=t.getBBox(),c=i.xOrigin-$.x+"px "+(i.yOrigin-$.y)+"px",O=""):O=!e&&t.getAttribute("data-svg-origin"),Hc(t,O||c,!!O||i.originIsAbsolute,i.smooth!==!1,C)),S=i.xOrigin||0,T=i.yOrigin||0,C!==xo&&(R=C[0],D=C[1],H=C[2],X=C[3],h=U=C[4],d=G=C[5],C.length===6?(f=Math.sqrt(R*R+D*D),_=Math.sqrt(X*X+H*H),g=R||D?Xr(D,R)*vr:0,y=H||X?Xr(H,X)*vr+g:0,y&&(_*=Math.abs(Math.cos(y*ps))),i.svg&&(h-=S-(S*R+T*H),d-=T-(S*D+T*X))):(Lt=C[6],Rt=C[7],it=C[8],et=C[9],dt=C[10],kt=C[11],h=C[12],d=C[13],u=C[14],v=Xr(Lt,dt),p=v*vr,v&&(M=Math.cos(-v),P=Math.sin(-v),O=U*M+it*P,$=G*M+et*P,Q=Lt*M+dt*P,it=U*-P+it*M,et=G*-P+et*M,dt=Lt*-P+dt*M,kt=Rt*-P+kt*M,U=O,G=$,Lt=Q),v=Xr(-H,dt),m=v*vr,v&&(M=Math.cos(-v),P=Math.sin(-v),O=R*M-it*P,$=D*M-et*P,Q=H*M-dt*P,kt=X*P+kt*M,R=O,D=$,H=Q),v=Xr(D,R),g=v*vr,v&&(M=Math.cos(v),P=Math.sin(v),O=R*M+D*P,$=U*M+G*P,D=D*M-R*P,G=G*M-U*P,R=O,U=$),p&&Math.abs(p)+Math.abs(g)>359.9&&(p=g=0,m=180-m),f=Me(Math.sqrt(R*R+D*D+H*H)),_=Me(Math.sqrt(G*G+Lt*Lt)),v=Xr(U,G),y=Math.abs(v)>2e-4?v*vr:0,b=kt?1/(kt<0?-kt:kt):0),i.svg&&(O=t.getAttribute("transform"),i.forceCSS=t.setAttribute("transform","")||!a_(bn(t,pe)),O&&t.setAttribute("transform",O))),Math.abs(y)>90&&Math.abs(y)<270&&(s?(f*=-1,y+=g<=0?180:-180,g+=g<=0?180:-180):(_*=-1,y+=y<=0?180:-180)),e=e||i.uncache,i.x=h-((i.xPercent=h&&(!e&&i.xPercent||(Math.round(t.offsetWidth/2)===Math.round(-h)?-50:0)))?t.offsetWidth*i.xPercent/100:0)+o,i.y=d-((i.yPercent=d&&(!e&&i.yPercent||(Math.round(t.offsetHeight/2)===Math.round(-d)?-50:0)))?t.offsetHeight*i.yPercent/100:0)+o,i.z=u+o,i.scaleX=Me(f),i.scaleY=Me(_),i.rotation=Me(g)+a,i.rotationX=Me(p)+a,i.rotationY=Me(m)+a,i.skewX=y+a,i.skewY=E+a,i.transformPerspective=b+o,(i.zOrigin=parseFloat(c.split(" ")[2])||!e&&i.zOrigin||0)&&(r[cn]=qa(c)),i.xOffset=i.yOffset=0,i.force3D=yn.force3D,i.renderTransform=i.svg?kw:i_?l_:Fw,i.uncache=0,i},qa=function(t){return(t=t.split(" "))[0]+" "+t[1]},Vl=function(t,e,i){var r=Ye(e);return Me(parseFloat(e)+parseFloat(or(t,"x",i+"px",r)))+r},Fw=function(t,e){e.z="0px",e.rotationY=e.rotationX="0deg",e.force3D=0,l_(t,e)},dr="0deg",Bs="0px",fr=") ",l_=function(t,e){var i=e||this,r=i.xPercent,s=i.yPercent,o=i.x,a=i.y,l=i.z,c=i.rotation,h=i.rotationY,d=i.rotationX,u=i.skewX,f=i.skewY,_=i.scaleX,g=i.scaleY,p=i.transformPerspective,m=i.force3D,y=i.target,E=i.zOrigin,b="",S=m==="auto"&&t&&t!==1||m===!0;if(E&&(d!==dr||h!==dr)){var T=parseFloat(h)*ps,C=Math.sin(T),v=Math.cos(T),M;T=parseFloat(d)*ps,M=Math.cos(T),o=Vl(y,o,C*M*-E),a=Vl(y,a,-Math.sin(T)*-E),l=Vl(y,l,v*M*-E+E)}p!==Bs&&(b+="perspective("+p+fr),(r||s)&&(b+="translate("+r+"%, "+s+"%) "),(S||o!==Bs||a!==Bs||l!==Bs)&&(b+=l!==Bs||S?"translate3d("+o+", "+a+", "+l+") ":"translate("+o+", "+a+fr),c!==dr&&(b+="rotate("+c+fr),h!==dr&&(b+="rotateY("+h+fr),d!==dr&&(b+="rotateX("+d+fr),(u!==dr||f!==dr)&&(b+="skew("+u+", "+f+fr),(_!==1||g!==1)&&(b+="scale("+_+", "+g+fr),y.style[pe]=b||"translate(0, 0)"},kw=function(t,e){var i=e||this,r=i.xPercent,s=i.yPercent,o=i.x,a=i.y,l=i.rotation,c=i.skewX,h=i.skewY,d=i.scaleX,u=i.scaleY,f=i.target,_=i.xOrigin,g=i.yOrigin,p=i.xOffset,m=i.yOffset,y=i.forceCSS,E=parseFloat(o),b=parseFloat(a),S,T,C,v,M;l=parseFloat(l),c=parseFloat(c),h=parseFloat(h),h&&(h=parseFloat(h),c+=h,l+=h),l||c?(l*=ps,c*=ps,S=Math.cos(l)*d,T=Math.sin(l)*d,C=Math.sin(l-c)*-u,v=Math.cos(l-c)*u,c&&(h*=ps,M=Math.tan(c-h),M=Math.sqrt(1+M*M),C*=M,v*=M,h&&(M=Math.tan(h),M=Math.sqrt(1+M*M),S*=M,T*=M)),S=Me(S),T=Me(T),C=Me(C),v=Me(v)):(S=d,v=u,T=C=0),(E&&!~(o+"").indexOf("px")||b&&!~(a+"").indexOf("px"))&&(E=or(f,"x",o,"px"),b=or(f,"y",a,"px")),(_||g||p||m)&&(E=Me(E+_-(_*S+g*C)+p),b=Me(b+g-(_*T+g*v)+m)),(r||s)&&(M=f.getBBox(),E=Me(E+r/100*M.width),b=Me(b+s/100*M.height)),M="matrix("+S+","+T+","+C+","+v+","+E+","+b+")",f.setAttribute("transform",M),y&&(f.style[pe]=M)},Bw=function(t,e,i,r,s){var o=360,a=Be(s),l=parseFloat(s)*(a&&~s.indexOf("rad")?vr:1),c=l-r,h=r+c+"deg",d,u;return a&&(d=s.split("_")[1],d==="short"&&(c%=o,c!==c%(o/2)&&(c+=c<0?o:-o)),d==="cw"&&c<0?c=(c+o*Bd)%o-~~(c/o)*o:d==="ccw"&&c>0&&(c=(c-o*Bd)%o-~~(c/o)*o)),t._pt=u=new ln(t._pt,e,i,r,c,yw),u.e=h,u.u="deg",t._props.push(i),u},qd=function(t,e){for(var i in e)t[i]=e[i];return t},Vw=function(t,e,i){var r=qd({},i._gsap),s="perspective,force3D,transformOrigin,svgOrigin",o=i.style,a,l,c,h,d,u,f,_;r.svg?(c=i.getAttribute("transform"),i.setAttribute("transform",""),o[pe]=e,a=bo(i,1),sr(i,pe),i.setAttribute("transform",c)):(c=getComputedStyle(i)[pe],o[pe]=e,a=bo(i,1),o[pe]=c);for(l in Pi)c=r[l],h=a[l],c!==h&&s.indexOf(l)<0&&(f=Ye(c),_=Ye(h),d=f!==_?or(i,l,c,_):parseFloat(c),u=parseFloat(h),t._pt=new ln(t._pt,a,l,d,u-d,Bc),t._pt.u=_||0,t._props.push(l));qd(a,r)};an("padding,margin,Width,Radius",function(n,t){var e="Top",i="Right",r="Bottom",s="Left",o=(t<3?[e,i,r,s]:[e+s,e+i,r+i,r+s]).map(function(a){return t<2?n+a:"border"+a+n});Xa[t>1?"border"+n:n]=function(a,l,c,h,d){var u,f;if(arguments.length<4)return u=o.map(function(_){return vi(a,_,c)}),f=u.join(" "),f.split(u[0]).length===5?u[0]:f;u=(h+"").split(" "),f={},o.forEach(function(_,g){return f[_]=u[g]=u[g]||u[(g-1)/2|0]}),a.init(l,f,d)}});var c_={name:"css",register:zc,targetTest:function(t){return t.style&&t.nodeType},init:function(t,e,i,r,s){var o=this._props,a=t.style,l=i.vars.startAt,c,h,d,u,f,_,g,p,m,y,E,b,S,T,C,v,M;bu||zc(),this.styles=this.styles||n_(t),v=this.styles.props,this.tween=i;for(g in e)if(g!=="autoRound"&&(h=e[g],!(_n[g]&&Xm(g,e,i,r,t,s)))){if(f=typeof h,_=Xa[g],f==="function"&&(h=h.call(i,r,t,s),f=typeof h),f==="string"&&~h.indexOf("random(")&&(h=_o(h)),_)_(this,t,g,h,i)&&(C=1);else if(g.substr(0,2)==="--")c=(getComputedStyle(t).getPropertyValue(g)+"").trim(),h+="",nr.lastIndex=0,nr.test(c)||(p=Ye(c),m=Ye(h),m?p!==m&&(c=or(t,g,c,m)+m):p&&(h+=p)),this.add(a,"setProperty",c,h,r,s,0,0,g),o.push(g),v.push(g,0,a[g]);else if(f!=="undefined"){if(l&&g in l?(c=typeof l[g]=="function"?l[g].call(i,r,t,s):l[g],Be(c)&&~c.indexOf("random(")&&(c=_o(c)),Ye(c+"")||c==="auto"||(c+=yn.units[g]||Ye(vi(t,g))||""),(c+"").charAt(1)==="="&&(c=vi(t,g))):c=vi(t,g),u=parseFloat(c),y=f==="string"&&h.charAt(1)==="="&&h.substr(0,2),y&&(h=h.substr(2)),d=parseFloat(h),g in Qn&&(g==="autoAlpha"&&(u===1&&vi(t,"visibility")==="hidden"&&d&&(u=0),v.push("visibility",0,a.visibility),ji(this,a,"visibility",u?"inherit":"hidden",d?"inherit":"hidden",!d)),g!=="scale"&&g!=="transform"&&(g=Qn[g],~g.indexOf(",")&&(g=g.split(",")[0]))),E=g in Pi,E){if(this.styles.save(g),M=h,f==="string"&&h.substring(0,6)==="var(--"){if(h=bn(t,h.substring(4,h.indexOf(")"))),h.substring(0,5)==="calc("){var P=t.style.perspective;t.style.perspective=h,h=bn(t,"perspective"),P?t.style.perspective=P:sr(t,"perspective")}d=parseFloat(h)}if(b||(S=t._gsap,S.renderTransform&&!e.parseTransform||bo(t,e.parseTransform),T=e.smoothOrigin!==!1&&S.smooth,b=this._pt=new ln(this._pt,a,pe,0,1,S.renderTransform,S,0,-1),b.dep=1),g==="scale")this._pt=new ln(this._pt,S,"scaleY",S.scaleY,(y?ds(S.scaleY,y+d):d)-S.scaleY||0,Bc),this._pt.u=0,o.push("scaleY",g),g+="X";else if(g==="transformOrigin"){v.push(cn,0,a[cn]),h=Nw(h),S.svg?Hc(t,h,0,T,0,this):(m=parseFloat(h.split(" ")[2])||0,m!==S.zOrigin&&ji(this,S,"zOrigin",S.zOrigin,m),ji(this,a,g,qa(c),qa(h)));continue}else if(g==="svgOrigin"){Hc(t,h,1,T,0,this);continue}else if(g in o_){Bw(this,S,g,u,y?ds(u,y+h):h);continue}else if(g==="smoothOrigin"){ji(this,S,"smooth",S.smooth,h);continue}else if(g==="force3D"){S[g]=h;continue}else if(g==="transform"){Vw(this,h,t);continue}}else g in a||(g=Ss(g)||g);if(E||(d||d===0)&&(u||u===0)&&!bw.test(h)&&g in a)p=(c+"").substr((u+"").length),d||(d=0),m=Ye(h)||(g in yn.units?yn.units[g]:p),p!==m&&(u=or(t,g,c,m)),this._pt=new ln(this._pt,E?S:a,g,u,(y?ds(u,y+d):d)-u,!E&&(m==="px"||g==="zIndex")&&e.autoRound!==!1?Ew:Bc),this._pt.u=m||0,E&&M!==h?(this._pt.b=c,this._pt.e=M,this._pt.r=Sw):p!==m&&m!=="%"&&(this._pt.b=c,this._pt.r=ww);else if(g in a)Uw.call(this,t,g,c,y?y+h:h);else if(g in t)this.add(t,g,c||t[g],y?y+h:h,r,s);else if(g!=="parseTransform"){hu(g,h);continue}E||(g in a?v.push(g,0,a[g]):typeof t[g]=="function"?v.push(g,2,t[g]()):v.push(g,1,c||t[g])),o.push(g)}}C&&Jm(this)},render:function(t,e){if(e.tween._time||!yu())for(var i=e._pt;i;)i.r(t,i.d),i=i._next;else e.styles.revert()},get:vi,aliases:Qn,getSetter:function(t,e,i){var r=Qn[e];return r&&r.indexOf(",")<0&&(e=r),e in Pi&&e!==cn&&(t._gsap.x||vi(t,"x"))?i&&kd===i?e==="scale"?Aw:Cw:(kd=i||{})&&(e==="scale"?Pw:Rw):t.style&&!au(t.style[e])?Mw:~e.indexOf("-")?Tw:vu(t,e)},core:{_removeProperty:sr,_getMatrix:Su}};dn.utils.checkPrefix=Ss;dn.core.getStyleSaver=n_;(function(n,t,e,i){var r=an(n+","+t+","+e,function(s){Pi[s]=1});an(t,function(s){yn.units[s]="deg",o_[s]=1}),Qn[r[13]]=n+","+t,an(i,function(s){var o=s.split(":");Qn[o[1]]=r[o[0]]})})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent","rotation,rotationX,rotationY,skewX,skewY","transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective","0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");an("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(n){yn.units[n]="px"});dn.registerPlugin(c_);var Mn=dn.registerPlugin(c_)||dn;Mn.core.Tween;/*!
 * paths 3.15.0
 * https://gsap.com
 *
 * Copyright 2008-2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var zw=/[achlmqstvz]|(-?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig,Hw=/[\+\-]?\d*\.?\d+e[\+\-]?\d+/ig,Gw=Math.PI/180,Yo=Math.sin,$o=Math.cos,no=Math.abs,Vs=Math.sqrt,Ww=function(t){return typeof t=="number"},Yd=1e5,zi=function(t){return Math.round(t*Yd)/Yd||0},$d=function(t){return t.closed=Math.abs(t[0]-t[t.length-2])<.001&&Math.abs(t[1]-t[t.length-1])<.001};function Xw(n,t,e,i,r,s,o){for(var a=n.length,l,c,h,d,u;--a>-1;)for(l=n[a],c=l.length,h=0;h<c;h+=2)d=l[h],u=l[h+1],l[h]=d*t+u*i+s,l[h+1]=d*e+u*r+o;return n._dirty=1,n}function qw(n,t,e,i,r,s,o,a,l){if(!(n===a&&t===l)){e=no(e),i=no(i);var c=r%360*Gw,h=$o(c),d=Yo(c),u=Math.PI,f=u*2,_=(n-a)/2,g=(t-l)/2,p=h*_+d*g,m=-d*_+h*g,y=p*p,E=m*m,b=y/(e*e)+E/(i*i);b>1&&(e=Vs(b)*e,i=Vs(b)*i);var S=e*e,T=i*i,C=(S*T-S*E-T*y)/(S*E+T*y);C<0&&(C=0);var v=(s===o?-1:1)*Vs(C),M=v*(e*m/i),P=v*-(i*p/e),R=(n+a)/2,D=(t+l)/2,H=R+(h*M-d*P),X=D+(d*M+h*P),U=(p-M)/e,G=(m-P)/i,O=(-p-M)/e,$=(-m-P)/i,Q=U*U+G*G,it=(G<0?-1:1)*Math.acos(U/Vs(Q)),et=(U*$-G*O<0?-1:1)*Math.acos((U*O+G*$)/Vs(Q*(O*O+$*$)));isNaN(et)&&(et=u),!o&&et>0?et-=f:o&&et<0&&(et+=f),it%=f,et%=f;var dt=Math.ceil(no(et)/(f/4)),Rt=[],kt=et/dt,Lt=4/3*Yo(kt/2)/(1+$o(kt/2)),Z=h*e,rt=d*e,tt=d*-i,At=h*i,St;for(St=0;St<dt;St++)r=it+St*kt,p=$o(r),m=Yo(r),U=$o(r+=kt),G=Yo(r),Rt.push(p-Lt*m,m+Lt*p,U+Lt*G,G-Lt*U,U,G);for(St=0;St<Rt.length;St+=2)p=Rt[St],m=Rt[St+1],Rt[St]=p*Z+m*tt+H,Rt[St+1]=p*rt+m*At+X;return Rt[St-2]=a,Rt[St-1]=l,Rt}}function Yw(n){var t=(n+"").replace(Hw,function(M){var P=+M;return P<1e-4&&P>-1e-4?0:P}).match(zw)||[],e=[],i=0,r=0,s=2/3,o=t.length,a=0,l="ERROR: malformed path: "+n,c,h,d,u,f,_,g,p,m,y,E,b,S,T,C,v=function(P,R,D,H){y=(D-P)/3,E=(H-R)/3,g.push(P+y,R+E,D-y,H-E,D,H)};if(!n||!isNaN(t[0])||isNaN(t[1]))return console.log(l),e;for(c=0;c<o;c++)if(S=f,isNaN(t[c])?(f=t[c].toUpperCase(),_=f!==t[c]):c--,d=+t[c+1],u=+t[c+2],_&&(d+=i,u+=r),c||(p=d,m=u),f==="M")g&&(g.length<8?e.length-=1:a+=g.length,$d(g)),i=p=d,r=m=u,g=[d,u],e.push(g),c+=2,f="L";else if(f==="C")g||(g=[0,0]),_||(i=r=0),g.push(d,u,i+t[c+3]*1,r+t[c+4]*1,i+=t[c+5]*1,r+=t[c+6]*1),c+=6;else if(f==="S")y=i,E=r,(S==="C"||S==="S")&&(y+=i-g[g.length-4],E+=r-g[g.length-3]),_||(i=r=0),g.push(y,E,d,u,i+=t[c+3]*1,r+=t[c+4]*1),c+=4;else if(f==="Q")y=i+(d-i)*s,E=r+(u-r)*s,_||(i=r=0),i+=t[c+3]*1,r+=t[c+4]*1,g.push(y,E,i+(d-i)*s,r+(u-r)*s,i,r),c+=4;else if(f==="T")y=i-g[g.length-4],E=r-g[g.length-3],g.push(i+y,r+E,d+(i+y*1.5-d)*s,u+(r+E*1.5-u)*s,i=d,r=u),c+=2;else if(f==="H")v(i,r,i=d,r),c+=1;else if(f==="V")v(i,r,i,r=d+(_?r-i:0)),c+=1;else if(f==="L"||f==="Z")f==="Z"&&(d=p,u=m,g.closed=!0),(f==="L"||no(i-d)>.5||no(r-u)>.5)&&(v(i,r,d,u),f==="L"&&(c+=2)),i=d,r=u;else if(f==="A"){if(T=t[c+4],C=t[c+5],y=t[c+6],E=t[c+7],h=7,T.length>1&&(T.length<3?(E=y,y=C,h--):(E=C,y=T.substr(2),h-=2),C=T.charAt(1),T=T.charAt(0)),b=qw(i,r,+t[c+1],+t[c+2],+t[c+3],+T,+C,(_?i:0)+y*1,(_?r:0)+E*1),c+=h,b)for(h=0;h<b.length;h++)g.push(b[h]);i=g[g.length-2],r=g[g.length-1]}else console.log(l);return c=g.length,c<6?(e.pop(),c=0):$d(g),e.totalPoints=a+c,e}function $w(n){Ww(n[0])&&(n=[n]);var t="",e=n.length,i,r,s,o;for(r=0;r<e;r++){for(o=n[r],t+="M"+zi(o[0])+","+zi(o[1])+" C",i=o.length,s=2;s<i;s++)t+=zi(o[s++])+","+zi(o[s++])+" "+zi(o[s++])+","+zi(o[s++])+" "+zi(o[s++])+","+zi(o[s])+" ";o.closed&&(t+="z")}return t}/*!
 * CustomEase 3.15.0
 * https://gsap.com
 *
 * @license Copyright 2008-2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var nn,h_,u_=function(){return nn||typeof window<"u"&&(nn=window.gsap)&&nn.registerPlugin&&nn},Kd=function(){nn=u_(),nn?(nn.registerEase("_CE",Br.create),h_=1):console.warn("Please gsap.registerPlugin(CustomEase)")},Kw=1e20,Ko=function(t){return~~(t*1e3+(t<0?-.5:.5))/1e3},Zw=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/gi,Jw=/[cLlsSaAhHvVtTqQ]/g,jw=function(t){var e=t.length,i=Kw,r;for(r=1;r<e;r+=6)+t[r]<i&&(i=+t[r]);return i},Qw=function(t,e,i){!i&&i!==0&&(i=Math.max(+t[t.length-1],+t[1]));var r=+t[0]*-1,s=-i,o=t.length,a=1/(+t[o-2]+r),l=-e||(Math.abs(+t[o-1]-+t[1])<.01*(+t[o-2]-+t[0])?jw(t)+s:+t[o-1]+s),c;for(l?l=1/l:l=-a,c=0;c<o;c+=2)t[c]=(+t[c]+r)*a,t[c+1]=(+t[c+1]+s)*l},tS=function n(t,e,i,r,s,o,a,l,c,h,d){var u=(t+i)/2,f=(e+r)/2,_=(i+s)/2,g=(r+o)/2,p=(s+a)/2,m=(o+l)/2,y=(u+_)/2,E=(f+g)/2,b=(_+p)/2,S=(g+m)/2,T=(y+b)/2,C=(E+S)/2,v=a-t,M=l-e,P=Math.abs((i-a)*M-(r-l)*v),R=Math.abs((s-a)*M-(o-l)*v),D;return h||(h=[{x:t,y:e},{x:a,y:l}],d=1),h.splice(d||h.length-1,0,{x:T,y:C}),(P+R)*(P+R)>c*(v*v+M*M)&&(D=h.length,n(t,e,u,f,y,E,T,C,c,h,d),n(T,C,b,S,p,m,a,l,c,h,d+1+(h.length-D))),h},Br=(function(){function n(e,i,r){h_||Kd(),this.id=e,this.setData(i,r)}var t=n.prototype;return t.setData=function(i,r){r=r||{},i=i||"0,0,1,1";var s=i.match(Zw),o=1,a=[],l=[],c=r.precision||1,h=c<=1,d,u,f,_,g,p,m,y,E;if(this.data=i,(Jw.test(i)||~i.indexOf("M")&&i.indexOf("C")<0)&&(s=Yw(i)[0]),d=s.length,d===4)s.unshift(0,0),s.push(1,1),d=8;else if((d-2)%6)throw"Invalid CustomEase";for((+s[0]!=0||+s[d-2]!=1)&&Qw(s,r.height,r.originY),this.segment=s,_=2;_<d;_+=6)u={x:+s[_-2],y:+s[_-1]},f={x:+s[_+4],y:+s[_+5]},a.push(u,f),tS(u.x,u.y,+s[_],+s[_+1],+s[_+2],+s[_+3],f.x,f.y,1/(c*2e5),a,a.length-1);for(d=a.length,_=0;_<d;_++)m=a[_],y=a[_-1]||m,(m.x>y.x||y.y!==m.y&&y.x===m.x||m===y)&&m.x<=1?(y.cx=m.x-y.x,y.cy=m.y-y.y,y.n=m,y.nx=m.x,h&&_>1&&Math.abs(y.cy/y.cx-a[_-2].cy/a[_-2].cx)>2&&(h=0),y.cx<o&&(y.cx?o=y.cx:(y.cx=.001,_===d-1&&(y.x-=.001,o=Math.min(o,.001),h=0)))):(a.splice(_--,1),d--);if(d=1/o+1|0,g=1/d,p=0,m=a[0],h){for(_=0;_<d;_++)E=_*g,m.nx<E&&(m=a[++p]),u=m.y+(E-m.x)/m.cx*m.cy,l[_]={x:E,cx:g,y:u,cy:0,nx:9},_&&(l[_-1].cy=u-l[_-1].y);p=a[a.length-1],l[d-1].cy=p.y-u,l[d-1].cx=p.x-l[l.length-1].x}else{for(_=0;_<d;_++)m.nx<_*g&&(m=a[++p]),l[_]=m;p<a.length-1&&(l[_-1]=a[a.length-2])}return this.ease=function(b){var S=l[b*d|0]||l[d-1];return S.nx<b&&(S=S.n),S.y+(b-S.x)/S.cx*S.cy},this.ease.custom=this,this.id&&nn&&nn.registerEase(this.id,this.ease),this},t.getSVGData=function(i){return n.getSVGData(this,i)},n.create=function(i,r,s){return new n(i,r,s).ease},n.register=function(i){nn=i,Kd()},n.get=function(i){return nn.parseEase(i)},n.getSVGData=function(i,r){r=r||{};var s=r.width||100,o=r.height||100,a=r.x||0,l=(r.y||0)+o,c=nn.utils.toArray(r.path)[0],h,d,u,f,_,g,p,m,y,E;if(r.invert&&(o=-o,l=0),typeof i=="string"&&(i=nn.parseEase(i)),i.custom&&(i=i.custom),i instanceof n)h=$w(Xw([i.segment.slice(0)],s,0,0,-o,a,l));else{for(h=[a,l],p=Math.max(5,(r.precision||1)*200),f=1/p,p+=2,m=5/p,y=Ko(a+f*s),E=Ko(l+i(f)*-o),d=(E-l)/(y-a),u=2;u<p;u++)_=Ko(a+u*f*s),g=Ko(l+i(u*f)*-o),(Math.abs((g-E)/(_-y)-d)>m||u===p-1)&&(h.push(y,E),d=(g-E)/(_-y)),y=_,E=g;h="M"+h.join(",")}return c&&c.setAttribute("d",h),h},n})();Br.version="3.15.0";Br.headless=!0;u_()&&nn.registerPlugin(Br);Mn.registerPlugin(Br);const Dn={none:"none","power1.out":"power1.out","power2.inOut":"power2.inOut","power3.inOut":"power3.inOut","power4.out":"power4.out","expo.out":"expo.out",t1:Br.create("t1","M0,0 C0.072,0 0.142,0.064 0.192,0.126 0.252,0.201 0.322,0.375 0.375,0.514 0.419,0.63 0.478,0.832 0.584,0.924 0.657,0.988 0.869,1 1,1 ")},Zt={res:.75,fov:35,grid:6,scale:1,autoScale:!0,aspect:{x:1,y:1},speed:100,ease:.1,autoscroll:{x:0,y:.2},animation:{splash:{layoutName:"static",planeName:"fadein",dragStart:.6,layout:{static:{delay:0,duration:1.25,stagger:.035,ease:Dn.t1},card:{delay:.4,duration:1.75,stagger:.065,ease:Dn.t1,stack:{offsetX:1.25,offsetY:2.5,depth:.01,visibleLayers:6}},slide:{delay:.2,duration:1.75,stagger:.055,ease:Dn.t1,outside:0,offset:{x:.1,y:1}},tornado:{delay:.2,duration:1.5,stagger:.04,ease:"power2.out",turns:.25,radius:.2,distance:.1,depth:.01}},plane:{fadein:{rotation:{enabled:!1,rand:!1,from:{x:0,y:0,z:0},to:{x:0,y:0,z:0}},scale:{enabled:!1,from:1,to:1},opacity:{enabled:!0,from:0,to:1}},zoom:{rotation:{enabled:!1,rand:!1,from:{x:0,y:0,z:0},to:{x:0,y:0,z:0}},scale:{enabled:!0,from:.75,to:1},opacity:{enabled:!1,from:0,to:1}},pile:{rotation:{enabled:!0,rand:!0,from:{x:0,y:0,z:5},to:{x:0,y:0,z:0}},scale:{enabled:!0,from:.95,to:1},opacity:{enabled:!1,from:0,to:1}},flip:{rotation:{enabled:!0,rand:!1,origin:{x:-.5,y:0,z:0},from:{x:0,y:-120,z:0},to:{x:0,y:0,z:0}},scale:{enabled:!0,from:.95,to:1},opacity:{enabled:!1,from:0,to:1}}}},transition:{leave:{zoom:{duration:2,ease:Dn.t1},fadeout:{duration:1,ease:Dn.t1}},enter:{fadein:{duration:1,ease:Dn.t1}}}}};/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Eu="185",eS=0,Zd=1,nS=2,Ta=1,iS=2,Ks=3,ar=0,hn=1,xi=2,Si=0,ms=1,Jd=2,jd=3,Qd=4,rS=5,br=100,sS=101,oS=102,aS=103,lS=104,cS=200,hS=201,uS=202,dS=203,Gc=204,Wc=205,fS=206,pS=207,mS=208,_S=209,gS=210,vS=211,xS=212,bS=213,yS=214,Xc=0,qc=1,Yc=2,Es=3,$c=4,Kc=5,Zc=6,Jc=7,d_=0,wS=1,SS=2,ni=0,f_=1,p_=2,m_=3,__=4,g_=5,v_=6,x_=7,b_=300,Ir=301,Ms=302,zl=303,Hl=304,dl=306,jc=1e3,yi=1001,Qc=1002,ze=1003,ES=1004,Zo=1005,He=1006,Gl=1007,Sr=1008,Un=1009,y_=1010,w_=1011,yo=1012,Mu=1013,li=1014,ti=1015,Ri=1016,Tu=1017,Cu=1018,wo=1020,S_=35902,E_=35899,M_=1021,T_=1022,Hn=1023,Li=1026,Er=1027,C_=1028,Au=1029,Ur=1030,Pu=1031,Ru=1033,Ca=33776,Aa=33777,Pa=33778,Ra=33779,th=35840,eh=35841,nh=35842,ih=35843,rh=36196,sh=37492,oh=37496,ah=37488,lh=37489,Ya=37490,ch=37491,hh=37808,uh=37809,dh=37810,fh=37811,ph=37812,mh=37813,_h=37814,gh=37815,vh=37816,xh=37817,bh=37818,yh=37819,wh=37820,Sh=37821,Eh=36492,Mh=36494,Th=36495,Ch=36283,Ah=36284,$a=36285,Ph=36286,MS=3200,tf=0,TS=1,$i="",gn="srgb",Ka="srgb-linear",Za="linear",te="srgb",qr=7680,ef=519,CS=512,AS=513,PS=514,Lu=515,RS=516,LS=517,Du=518,DS=519,nf=35044,rf="300 es",ei=2e3,Ja=2001;function IS(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function So(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function US(){const n=So("canvas");return n.style.display="block",n}const sf={};function of(...n){const t="THREE."+n.shift();console.log(t,...n)}function A_(n){const t=n[0];if(typeof t=="string"&&t.startsWith("TSL:")){const e=n[1];e&&e.isStackTrace?n[0]+=" "+e.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Pt(...n){n=A_(n);const t="THREE."+n.shift();{const e=n[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...n)}}function Xt(...n){n=A_(n);const t="THREE."+n.shift();{const e=n[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...n)}}function _s(...n){const t=n.join(" ");t in sf||(sf[t]=!0,Pt(...n))}function NS(n,t,e){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}const OS={[Xc]:qc,[Yc]:Zc,[$c]:Jc,[Es]:Kc,[qc]:Xc,[Zc]:Yc,[Jc]:$c,[Kc]:Es};class Vr{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){const i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){const i=this._listeners;if(i===void 0)return;const r=i[t];if(r!==void 0){const s=r.indexOf(e);s!==-1&&r.splice(s,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const i=e[t.type];if(i!==void 0){t.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,t);t.target=null}}}const Xe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let af=1234567;const io=Math.PI/180,Eo=180/Math.PI;function Ds(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Xe[n&255]+Xe[n>>8&255]+Xe[n>>16&255]+Xe[n>>24&255]+"-"+Xe[t&255]+Xe[t>>8&255]+"-"+Xe[t>>16&15|64]+Xe[t>>24&255]+"-"+Xe[e&63|128]+Xe[e>>8&255]+"-"+Xe[e>>16&255]+Xe[e>>24&255]+Xe[i&255]+Xe[i>>8&255]+Xe[i>>16&255]+Xe[i>>24&255]).toLowerCase()}function Vt(n,t,e){return Math.max(t,Math.min(e,n))}function Iu(n,t){return(n%t+t)%t}function FS(n,t,e,i,r){return i+(n-t)*(r-i)/(e-t)}function kS(n,t,e){return n!==t?(e-n)/(t-n):0}function ro(n,t,e){return(1-e)*n+e*t}function BS(n,t,e,i){return ro(n,t,1-Math.exp(-e*i))}function VS(n,t=1){return t-Math.abs(Iu(n,t*2)-t)}function zS(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function HS(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function GS(n,t){return n+Math.floor(Math.random()*(t-n+1))}function WS(n,t){return n+Math.random()*(t-n)}function XS(n){return n*(.5-Math.random())}function qS(n){n!==void 0&&(af=n);let t=af+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function YS(n){return n*io}function $S(n){return n*Eo}function KS(n){return(n&n-1)===0&&n!==0}function ZS(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function JS(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function jS(n,t,e,i,r){const s=Math.cos,o=Math.sin,a=s(e/2),l=o(e/2),c=s((t+i)/2),h=o((t+i)/2),d=s((t-i)/2),u=o((t-i)/2),f=s((i-t)/2),_=o((i-t)/2);switch(r){case"XYX":n.set(a*h,l*d,l*u,a*c);break;case"YZY":n.set(l*u,a*h,l*d,a*c);break;case"ZXZ":n.set(l*d,l*u,a*h,a*c);break;case"XZX":n.set(a*h,l*_,l*f,a*c);break;case"YXY":n.set(l*f,a*h,l*_,a*c);break;case"ZYZ":n.set(l*_,l*f,a*h,a*c);break;default:Pt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function as(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Ze(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const QS={DEG2RAD:io,RAD2DEG:Eo,generateUUID:Ds,clamp:Vt,euclideanModulo:Iu,mapLinear:FS,inverseLerp:kS,lerp:ro,damp:BS,pingpong:VS,smoothstep:zS,smootherstep:HS,randInt:GS,randFloat:WS,randFloatSpread:XS,seededRandom:qS,degToRad:YS,radToDeg:$S,isPowerOfTwo:KS,ceilPowerOfTwo:ZS,floorPowerOfTwo:JS,setQuaternionFromProperEuler:jS,normalize:Ze,denormalize:as};class Kt{static{Kt.prototype.isVector2=!0}constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6],this.y=r[1]*e+r[4]*i+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Vt(this.x,t.x,e.x),this.y=Vt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Vt(this.x,t,e),this.y=Vt(this.y,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Vt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Vt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),r=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*i-o*r+t.x,this.y=s*r+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Is{constructor(t=0,e=0,i=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=r}static slerpFlat(t,e,i,r,s,o,a){let l=i[r+0],c=i[r+1],h=i[r+2],d=i[r+3],u=s[o+0],f=s[o+1],_=s[o+2],g=s[o+3];if(d!==g||l!==u||c!==f||h!==_){let p=l*u+c*f+h*_+d*g;p<0&&(u=-u,f=-f,_=-_,g=-g,p=-p);let m=1-a;if(p<.9995){const y=Math.acos(p),E=Math.sin(y);m=Math.sin(m*y)/E,a=Math.sin(a*y)/E,l=l*m+u*a,c=c*m+f*a,h=h*m+_*a,d=d*m+g*a}else{l=l*m+u*a,c=c*m+f*a,h=h*m+_*a,d=d*m+g*a;const y=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=y,c*=y,h*=y,d*=y}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],h=i[r+3],d=s[o],u=s[o+1],f=s[o+2],_=s[o+3];return t[e]=a*_+h*d+l*f-c*u,t[e+1]=l*_+h*u+c*d-a*f,t[e+2]=c*_+h*f+a*u-l*d,t[e+3]=h*_-a*d-l*u-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,r){return this._x=t,this._y=e,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,r=t._y,s=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(i/2),h=a(r/2),d=a(s/2),u=l(i/2),f=l(r/2),_=l(s/2);switch(o){case"XYZ":this._x=u*h*d+c*f*_,this._y=c*f*d-u*h*_,this._z=c*h*_+u*f*d,this._w=c*h*d-u*f*_;break;case"YXZ":this._x=u*h*d+c*f*_,this._y=c*f*d-u*h*_,this._z=c*h*_-u*f*d,this._w=c*h*d+u*f*_;break;case"ZXY":this._x=u*h*d-c*f*_,this._y=c*f*d+u*h*_,this._z=c*h*_+u*f*d,this._w=c*h*d-u*f*_;break;case"ZYX":this._x=u*h*d-c*f*_,this._y=c*f*d+u*h*_,this._z=c*h*_-u*f*d,this._w=c*h*d+u*f*_;break;case"YZX":this._x=u*h*d+c*f*_,this._y=c*f*d+u*h*_,this._z=c*h*_-u*f*d,this._w=c*h*d-u*f*_;break;case"XZY":this._x=u*h*d-c*f*_,this._y=c*f*d-u*h*_,this._z=c*h*_+u*f*d,this._w=c*h*d+u*f*_;break;default:Pt("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,r=Math.sin(i);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],r=e[4],s=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=i+a+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(s-c)*f,this._z=(o-r)*f}else if(i>a&&i>d){const f=2*Math.sqrt(1+i-a-d);this._w=(h-l)/f,this._x=.25*f,this._y=(r+o)/f,this._z=(s+c)/f}else if(a>d){const f=2*Math.sqrt(1+a-i-d);this._w=(s-c)/f,this._x=(r+o)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+d-i-a);this._w=(o-r)/f,this._x=(s+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Vt(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const r=Math.min(1,e/i);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,r=t._y,s=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+o*a+r*c-s*l,this._y=r*h+o*l+s*a-i*c,this._z=s*h+o*c+i*l-r*a,this._w=o*h-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(t,e){let i=t._x,r=t._y,s=t._z,o=t._w,a=this.dot(t);a<0&&(i=-i,r=-r,s=-s,o=-o,a=-a);let l=1-e;if(a<.9995){const c=Math.acos(a),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+i*e,this._y=this._y*l+r*e,this._z=this._z*l+s*e,this._w=this._w*l+o*e,this._onChangeCallback()}else this._x=this._x*l+i*e,this._y=this._y*l+r*e,this._z=this._z*l+s*e,this._w=this._w*l+o*e,this.normalize();return this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(t),r*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class V{static{V.prototype.isVector3=!0}constructor(t=0,e=0,i=0){this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(lf.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(lf.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*r,this.y=s[1]*e+s[4]*i+s[7]*r,this.z=s[2]*e+s[5]*i+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,r=this.z,s=t.elements,o=1/(s[3]*e+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*e+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*e+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,r=this.z,s=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*r-a*i),h=2*(a*e-s*r),d=2*(s*i-o*e);return this.x=e+l*c+o*d-a*h,this.y=i+l*h+a*c-s*d,this.z=r+l*d+s*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*r,this.y=s[1]*e+s[5]*i+s[9]*r,this.z=s[2]*e+s[6]*i+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Vt(this.x,t.x,e.x),this.y=Vt(this.y,t.y,e.y),this.z=Vt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Vt(this.x,t,e),this.y=Vt(this.y,t,e),this.z=Vt(this.z,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Vt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,r=t.y,s=t.z,o=e.x,a=e.y,l=e.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Wl.copy(this).projectOnVector(t),this.sub(Wl)}reflect(t){return this.sub(Wl.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Vt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,r=this.z-t.z;return e*e+i*i+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const r=Math.sin(e)*t;return this.x=r*Math.sin(i),this.y=Math.cos(e)*t,this.z=r*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Wl=new V,lf=new Is;class Dt{static{Dt.prototype.isMatrix3=!0}constructor(t,e,i,r,s,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,r,s,o,a,l,c)}set(t,e,i,r,s,o,a,l,c){const h=this.elements;return h[0]=t,h[1]=r,h[2]=a,h[3]=e,h[4]=s,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,r=e.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],h=i[4],d=i[7],u=i[2],f=i[5],_=i[8],g=r[0],p=r[3],m=r[6],y=r[1],E=r[4],b=r[7],S=r[2],T=r[5],C=r[8];return s[0]=o*g+a*y+l*S,s[3]=o*p+a*E+l*T,s[6]=o*m+a*b+l*C,s[1]=c*g+h*y+d*S,s[4]=c*p+h*E+d*T,s[7]=c*m+h*b+d*C,s[2]=u*g+f*y+_*S,s[5]=u*p+f*E+_*T,s[8]=u*m+f*b+_*C,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],r=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-i*s*h+i*a*l+r*s*c-r*o*l}invert(){const t=this.elements,e=t[0],i=t[1],r=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=h*o-a*c,u=a*l-h*s,f=c*s-o*l,_=e*d+i*u+r*f;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/_;return t[0]=d*g,t[1]=(r*c-h*i)*g,t[2]=(a*i-r*o)*g,t[3]=u*g,t[4]=(h*e-r*l)*g,t[5]=(r*s-a*e)*g,t[6]=f*g,t[7]=(i*l-c*e)*g,t[8]=(o*e-i*s)*g,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+t,-r*c,r*l,-r*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return _s("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Xl.makeScale(t,e)),this}rotate(t){return _s("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Xl.makeRotation(-t)),this}translate(t,e){return _s("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Xl.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let r=0;r<9;r++)if(e[r]!==i[r])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Xl=new Dt,cf=new Dt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),hf=new Dt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function tE(){const n={enabled:!0,workingColorSpace:Ka,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===te&&(r.r=Ei(r.r),r.g=Ei(r.g),r.b=Ei(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===te&&(r.r=gs(r.r),r.g=gs(r.g),r.b=gs(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===$i?Za:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return _s("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return _s("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(r,s)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Ka]:{primaries:t,whitePoint:i,transfer:Za,toXYZ:cf,fromXYZ:hf,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:gn},outputColorSpaceConfig:{drawingBufferColorSpace:gn}},[gn]:{primaries:t,whitePoint:i,transfer:te,toXYZ:cf,fromXYZ:hf,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:gn}}}),n}const zt=tE();function Ei(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function gs(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Yr;class eE{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{Yr===void 0&&(Yr=So("canvas")),Yr.width=t.width,Yr.height=t.height;const r=Yr.getContext("2d");t instanceof ImageData?r.putImageData(t,0,0):r.drawImage(t,0,0,t.width,t.height),i=Yr}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=So("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const r=i.getImageData(0,0,t.width,t.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Ei(s[o]/255)*255;return i.putImageData(r,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Ei(e[i]/255)*255):e[i]=Ei(e[i]);return{data:e,width:t.width,height:t.height}}else return Pt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let nE=0;class Uu{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:nE++}),this.uuid=Ds(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(ql(r[o].image)):s.push(ql(r[o]))}else s=ql(r);i.url=s}return e||(t.images[this.uuid]=i),i}}function ql(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?eE.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Pt("Texture: Unable to serialize Texture."),{})}let iE=0;const Yl=new V;class Ke extends Vr{constructor(t=Ke.DEFAULT_IMAGE,e=Ke.DEFAULT_MAPPING,i=yi,r=yi,s=He,o=Sr,a=Hn,l=Un,c=Ke.DEFAULT_ANISOTROPY,h=$i){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:iE++}),this.uuid=Ds(),this.name="",this.source=new Uu(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Kt(0,0),this.repeat=new Kt(1,1),this.center=new Kt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Dt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Yl).x}get height(){return this.source.getSize(Yl).y}get depth(){return this.source.getSize(Yl).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const i=t[e];if(i===void 0){Pt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){Pt(`Texture.setValues(): property '${e}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==b_)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case jc:t.x=t.x-Math.floor(t.x);break;case yi:t.x=t.x<0?0:1;break;case Qc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case jc:t.y=t.y-Math.floor(t.y);break;case yi:t.y=t.y<0?0:1;break;case Qc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ke.DEFAULT_IMAGE=null;Ke.DEFAULT_MAPPING=b_;Ke.DEFAULT_ANISOTROPY=1;class be{static{be.prototype.isVector4=!0}constructor(t=0,e=0,i=0,r=1){this.x=t,this.y=e,this.z=i,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,r){return this.x=t,this.y=e,this.z=i,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,r=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*e+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*e+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*e+o[7]*i+o[11]*r+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,r,s;const l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],_=l[9],g=l[2],p=l[6],m=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-g)<.01&&Math.abs(_-p)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+g)<.1&&Math.abs(_+p)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const E=(c+1)/2,b=(f+1)/2,S=(m+1)/2,T=(h+u)/4,C=(d+g)/4,v=(_+p)/4;return E>b&&E>S?E<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(E),r=T/i,s=C/i):b>S?b<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(b),i=T/r,s=v/r):S<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(S),i=C/s,r=v/s),this.set(i,r,s,e),this}let y=Math.sqrt((p-_)*(p-_)+(d-g)*(d-g)+(u-h)*(u-h));return Math.abs(y)<.001&&(y=1),this.x=(p-_)/y,this.y=(d-g)/y,this.z=(u-h)/y,this.w=Math.acos((c+f+m-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Vt(this.x,t.x,e.x),this.y=Vt(this.y,t.y,e.y),this.z=Vt(this.z,t.z,e.z),this.w=Vt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Vt(this.x,t,e),this.y=Vt(this.y,t,e),this.z=Vt(this.z,t,e),this.w=Vt(this.w,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Vt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class rE extends Vr{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:He,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new be(0,0,t,e),this.scissorTest=!1,this.viewport=new be(0,0,t,e),this.textures=[];const r={width:t,height:e,depth:i.depth},s=new Ke(r),o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(t={}){const e={minFilter:He,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=t,this.textures[r].image.height=e,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const r=Object.assign({},t.textures[e].image);this.textures[e].source=new Uu(r)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ii extends rE{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class P_ extends Ke{constructor(t=null,e=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:r},this.magFilter=ze,this.minFilter=ze,this.wrapR=yi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class sE extends Ke{constructor(t=null,e=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:r},this.magFilter=ze,this.minFilter=ze,this.wrapR=yi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Te{static{Te.prototype.isMatrix4=!0}constructor(t,e,i,r,s,o,a,l,c,h,d,u,f,_,g,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,r,s,o,a,l,c,h,d,u,f,_,g,p)}set(t,e,i,r,s,o,a,l,c,h,d,u,f,_,g,p){const m=this.elements;return m[0]=t,m[4]=e,m[8]=i,m[12]=r,m[1]=s,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=h,m[10]=d,m[14]=u,m[3]=f,m[7]=_,m[11]=g,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Te().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),i.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();const e=this.elements,i=t.elements,r=1/$r.setFromMatrixColumn(t,0).length(),s=1/$r.setFromMatrixColumn(t,1).length(),o=1/$r.setFromMatrixColumn(t,2).length();return e[0]=i[0]*r,e[1]=i[1]*r,e[2]=i[2]*r,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,r=t.y,s=t.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),h=Math.cos(s),d=Math.sin(s);if(t.order==="XYZ"){const u=o*h,f=o*d,_=a*h,g=a*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=f+_*c,e[5]=u-g*c,e[9]=-a*l,e[2]=g-u*c,e[6]=_+f*c,e[10]=o*l}else if(t.order==="YXZ"){const u=l*h,f=l*d,_=c*h,g=c*d;e[0]=u+g*a,e[4]=_*a-f,e[8]=o*c,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=f*a-_,e[6]=g+u*a,e[10]=o*l}else if(t.order==="ZXY"){const u=l*h,f=l*d,_=c*h,g=c*d;e[0]=u-g*a,e[4]=-o*d,e[8]=_+f*a,e[1]=f+_*a,e[5]=o*h,e[9]=g-u*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const u=o*h,f=o*d,_=a*h,g=a*d;e[0]=l*h,e[4]=_*c-f,e[8]=u*c+g,e[1]=l*d,e[5]=g*c+u,e[9]=f*c-_,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const u=o*l,f=o*c,_=a*l,g=a*c;e[0]=l*h,e[4]=g-u*d,e[8]=_*d+f,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*d+_,e[10]=u-g*d}else if(t.order==="XZY"){const u=o*l,f=o*c,_=a*l,g=a*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+g,e[5]=o*h,e[9]=f*d-_,e[2]=_*d-f,e[6]=a*h,e[10]=g*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(oE,t,aE)}lookAt(t,e,i){const r=this.elements;return pn.subVectors(t,e),pn.lengthSq()===0&&(pn.z=1),pn.normalize(),Hi.crossVectors(i,pn),Hi.lengthSq()===0&&(Math.abs(i.z)===1?pn.x+=1e-4:pn.z+=1e-4,pn.normalize(),Hi.crossVectors(i,pn)),Hi.normalize(),Jo.crossVectors(pn,Hi),r[0]=Hi.x,r[4]=Jo.x,r[8]=pn.x,r[1]=Hi.y,r[5]=Jo.y,r[9]=pn.y,r[2]=Hi.z,r[6]=Jo.z,r[10]=pn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,r=e.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],h=i[1],d=i[5],u=i[9],f=i[13],_=i[2],g=i[6],p=i[10],m=i[14],y=i[3],E=i[7],b=i[11],S=i[15],T=r[0],C=r[4],v=r[8],M=r[12],P=r[1],R=r[5],D=r[9],H=r[13],X=r[2],U=r[6],G=r[10],O=r[14],$=r[3],Q=r[7],it=r[11],et=r[15];return s[0]=o*T+a*P+l*X+c*$,s[4]=o*C+a*R+l*U+c*Q,s[8]=o*v+a*D+l*G+c*it,s[12]=o*M+a*H+l*O+c*et,s[1]=h*T+d*P+u*X+f*$,s[5]=h*C+d*R+u*U+f*Q,s[9]=h*v+d*D+u*G+f*it,s[13]=h*M+d*H+u*O+f*et,s[2]=_*T+g*P+p*X+m*$,s[6]=_*C+g*R+p*U+m*Q,s[10]=_*v+g*D+p*G+m*it,s[14]=_*M+g*H+p*O+m*et,s[3]=y*T+E*P+b*X+S*$,s[7]=y*C+E*R+b*U+S*Q,s[11]=y*v+E*D+b*G+S*it,s[15]=y*M+E*H+b*O+S*et,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],r=t[8],s=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],f=t[14],_=t[3],g=t[7],p=t[11],m=t[15],y=l*f-c*u,E=a*f-c*d,b=a*u-l*d,S=o*f-c*h,T=o*u-l*h,C=o*d-a*h;return e*(g*y-p*E+m*b)-i*(_*y-p*S+m*T)+r*(_*E-g*S+m*C)-s*(_*b-g*T+p*C)}determinantAffine(){const t=this.elements,e=t[0],i=t[4],r=t[8],s=t[1],o=t[5],a=t[9],l=t[2],c=t[6],h=t[10];return e*(o*h-a*c)-i*(s*h-a*l)+r*(s*c-o*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],r=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],f=t[11],_=t[12],g=t[13],p=t[14],m=t[15],y=e*a-i*o,E=e*l-r*o,b=e*c-s*o,S=i*l-r*a,T=i*c-s*a,C=r*c-s*l,v=h*g-d*_,M=h*p-u*_,P=h*m-f*_,R=d*p-u*g,D=d*m-f*g,H=u*m-f*p,X=y*H-E*D+b*R+S*P-T*M+C*v;if(X===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const U=1/X;return t[0]=(a*H-l*D+c*R)*U,t[1]=(r*D-i*H-s*R)*U,t[2]=(g*C-p*T+m*S)*U,t[3]=(u*T-d*C-f*S)*U,t[4]=(l*P-o*H-c*M)*U,t[5]=(e*H-r*P+s*M)*U,t[6]=(p*b-_*C-m*E)*U,t[7]=(h*C-u*b+f*E)*U,t[8]=(o*D-a*P+c*v)*U,t[9]=(i*P-e*D-s*v)*U,t[10]=(_*T-g*b+m*y)*U,t[11]=(d*b-h*T-f*y)*U,t[12]=(a*M-o*R-l*v)*U,t[13]=(e*R-i*M+r*v)*U,t[14]=(g*E-_*S-p*y)*U,t[15]=(h*S-d*E+u*y)*U,this}scale(t){const e=this.elements,i=t.x,r=t.y,s=t.z;return e[0]*=i,e[4]*=r,e[8]*=s,e[1]*=i,e[5]*=r,e[9]*=s,e[2]*=i,e[6]*=r,e[10]*=s,e[3]*=i,e[7]*=r,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,r))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),r=Math.sin(e),s=1-i,o=t.x,a=t.y,l=t.z,c=s*o,h=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,h*a+i,h*l-r*o,0,c*l-r*a,h*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,r,s,o){return this.set(1,i,s,0,t,1,o,0,e,r,1,0,0,0,0,1),this}compose(t,e,i){const r=this.elements,s=e._x,o=e._y,a=e._z,l=e._w,c=s+s,h=o+o,d=a+a,u=s*c,f=s*h,_=s*d,g=o*h,p=o*d,m=a*d,y=l*c,E=l*h,b=l*d,S=i.x,T=i.y,C=i.z;return r[0]=(1-(g+m))*S,r[1]=(f+b)*S,r[2]=(_-E)*S,r[3]=0,r[4]=(f-b)*T,r[5]=(1-(u+m))*T,r[6]=(p+y)*T,r[7]=0,r[8]=(_+E)*C,r[9]=(p-y)*C,r[10]=(1-(u+g))*C,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,i){const r=this.elements;t.x=r[12],t.y=r[13],t.z=r[14];const s=this.determinantAffine();if(s===0)return i.set(1,1,1),e.identity(),this;let o=$r.set(r[0],r[1],r[2]).length();const a=$r.set(r[4],r[5],r[6]).length(),l=$r.set(r[8],r[9],r[10]).length();s<0&&(o=-o),kn.copy(this);const c=1/o,h=1/a,d=1/l;return kn.elements[0]*=c,kn.elements[1]*=c,kn.elements[2]*=c,kn.elements[4]*=h,kn.elements[5]*=h,kn.elements[6]*=h,kn.elements[8]*=d,kn.elements[9]*=d,kn.elements[10]*=d,e.setFromRotationMatrix(kn),i.x=o,i.y=a,i.z=l,this}makePerspective(t,e,i,r,s,o,a=ei,l=!1){const c=this.elements,h=2*s/(e-t),d=2*s/(i-r),u=(e+t)/(e-t),f=(i+r)/(i-r);let _,g;if(l)_=s/(o-s),g=o*s/(o-s);else if(a===ei)_=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(a===Ja)_=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=_,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,r,s,o,a=ei,l=!1){const c=this.elements,h=2/(e-t),d=2/(i-r),u=-(e+t)/(e-t),f=-(i+r)/(i-r);let _,g;if(l)_=1/(o-s),g=o/(o-s);else if(a===ei)_=-2/(o-s),g=-(o+s)/(o-s);else if(a===Ja)_=-1/(o-s),g=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=_,c[14]=g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let r=0;r<16;r++)if(e[r]!==i[r])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const $r=new V,kn=new Te,oE=new V(0,0,0),aE=new V(1,1,1),Hi=new V,Jo=new V,pn=new V,uf=new Te,df=new Is;class Nr{constructor(t=0,e=0,i=0,r=Nr.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,r=this._order){return this._x=t,this._y=e,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const r=t.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],h=r[9],d=r[2],u=r[6],f=r[10];switch(e){case"XYZ":this._y=Math.asin(Vt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Vt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(Vt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Vt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Vt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Vt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Pt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return uf.makeRotationFromQuaternion(t),this.setFromRotationMatrix(uf,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return df.setFromEuler(this),this.setFromQuaternion(df,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Nr.DEFAULT_ORDER="XYZ";class R_{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let lE=0;const ff=new V,Kr=new Is,di=new Te,jo=new V,zs=new V,cE=new V,hE=new Is,pf=new V(1,0,0),mf=new V(0,1,0),_f=new V(0,0,1),gf={type:"added"},uE={type:"removed"},Zr={type:"childadded",child:null},$l={type:"childremoved",child:null};class wn extends Vr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:lE++}),this.uuid=Ds(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=wn.DEFAULT_UP.clone();const t=new V,e=new Nr,i=new Is,r=new V(1,1,1);function s(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Te},normalMatrix:{value:new Dt}}),this.matrix=new Te,this.matrixWorld=new Te,this.matrixAutoUpdate=wn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=wn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new R_,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Kr.setFromAxisAngle(t,e),this.quaternion.multiply(Kr),this}rotateOnWorldAxis(t,e){return Kr.setFromAxisAngle(t,e),this.quaternion.premultiply(Kr),this}rotateX(t){return this.rotateOnAxis(pf,t)}rotateY(t){return this.rotateOnAxis(mf,t)}rotateZ(t){return this.rotateOnAxis(_f,t)}translateOnAxis(t,e){return ff.copy(t).applyQuaternion(this.quaternion),this.position.add(ff.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(pf,t)}translateY(t){return this.translateOnAxis(mf,t)}translateZ(t){return this.translateOnAxis(_f,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(di.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?jo.copy(t):jo.set(t,e,i);const r=this.parent;this.updateWorldMatrix(!0,!1),zs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?di.lookAt(zs,jo,this.up):di.lookAt(jo,zs,this.up),this.quaternion.setFromRotationMatrix(di),r&&(di.extractRotation(r.matrixWorld),Kr.setFromRotationMatrix(di),this.quaternion.premultiply(Kr.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Xt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(gf),Zr.child=t,this.dispatchEvent(Zr),Zr.child=null):Xt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(uE),$l.child=t,this.dispatchEvent($l),$l.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),di.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),di.multiply(t.parent.matrixWorld)),t.applyMatrix4(di),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(gf),Zr.child=t,this.dispatchEvent(Zr),Zr.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zs,t,cE),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zs,hE,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,r=e.length;i<r;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,r=e.length;i<r;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const e=t.x,i=t.y,r=t.z,s=this.matrix.elements;s[12]+=e-s[0]*e-s[4]*i-s[8]*r,s[13]+=i-s[1]*e-s[5]*i-s[9]*r,s[14]+=r-s[2]*e-s[6]*i-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,r=e.length;i<r;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e,i=!1){const r=this.parent;if(t===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),e===!0){const s=this.children;for(let o=0,a=s.length;o<a;o++)s[o].updateWorldMatrix(!1,!0,i)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),this.static!==!1&&(r.static=this.static),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(t),r.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];s(t.shapes,d)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(t.materials,this.material[l]));r.material=a}else r.material=s(t.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),d=o(t.shapes),u=o(t.skeletons),f=o(t.animations),_=o(t.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),d.length>0&&(i.shapes=d),u.length>0&&(i.skeletons=u),f.length>0&&(i.animations=f),_.length>0&&(i.nodes=_)}return i.object=r,i;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const r=t.children[i];this.add(r.clone())}return this}}wn.DEFAULT_UP=new V(0,1,0);wn.DEFAULT_MATRIX_AUTO_UPDATE=!0;wn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Qo extends wn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const dE={type:"move"};class Kl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Qo,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Qo,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Qo,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const g of t.hand.values()){const p=e.getJointPose(g,i),m=this._getHandJoint(c,g);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,_=.005;c.inputState.pinching&&u>f+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=f-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(r=e.getPose(t.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(dE)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Qo;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const L_={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Gi={h:0,s:0,l:0},ta={h:0,s:0,l:0};function Zl(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class Jt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=gn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,zt.colorSpaceToWorking(this,e),this}setRGB(t,e,i,r=zt.workingColorSpace){return this.r=t,this.g=e,this.b=i,zt.colorSpaceToWorking(this,r),this}setHSL(t,e,i,r=zt.workingColorSpace){if(t=Iu(t,1),e=Vt(e,0,1),i=Vt(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,o=2*i-s;this.r=Zl(o,s,t+1/3),this.g=Zl(o,s,t),this.b=Zl(o,s,t-1/3)}return zt.colorSpaceToWorking(this,r),this}setStyle(t,e=gn){function i(s){s!==void 0&&parseFloat(s)<1&&Pt("Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:Pt("Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);Pt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=gn){const i=L_[t.toLowerCase()];return i!==void 0?this.setHex(i,e):Pt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ei(t.r),this.g=Ei(t.g),this.b=Ei(t.b),this}copyLinearToSRGB(t){return this.r=gs(t.r),this.g=gs(t.g),this.b=gs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=gn){return zt.workingToColorSpace(qe.copy(this),t),Math.round(Vt(qe.r*255,0,255))*65536+Math.round(Vt(qe.g*255,0,255))*256+Math.round(Vt(qe.b*255,0,255))}getHexString(t=gn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=zt.workingColorSpace){zt.workingToColorSpace(qe.copy(this),e);const i=qe.r,r=qe.g,s=qe.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case i:l=(r-s)/d+(r<s?6:0);break;case r:l=(s-i)/d+2;break;case s:l=(i-r)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=zt.workingColorSpace){return zt.workingToColorSpace(qe.copy(this),e),t.r=qe.r,t.g=qe.g,t.b=qe.b,t}getStyle(t=gn){zt.workingToColorSpace(qe.copy(this),t);const e=qe.r,i=qe.g,r=qe.b;return t!==gn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(t,e,i){return this.getHSL(Gi),this.setHSL(Gi.h+t,Gi.s+e,Gi.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Gi),t.getHSL(ta);const i=ro(Gi.h,ta.h,e),r=ro(Gi.s,ta.s,e),s=ro(Gi.l,ta.l,e);return this.setHSL(i,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,r=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*r,this.g=s[1]*e+s[4]*i+s[7]*r,this.b=s[2]*e+s[5]*i+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const qe=new Jt;Jt.NAMES=L_;class fE extends wn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Nr,this.environmentIntensity=1,this.environmentRotation=new Nr,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}const Bn=new V,fi=new V,Jl=new V,pi=new V,Jr=new V,jr=new V,vf=new V,jl=new V,Ql=new V,tc=new V,ec=new be,nc=new be,ic=new be;class zn{constructor(t=new V,e=new V,i=new V){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,r){r.subVectors(i,e),Bn.subVectors(t,e),r.cross(Bn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(t,e,i,r,s){Bn.subVectors(r,e),fi.subVectors(i,e),Jl.subVectors(t,e);const o=Bn.dot(Bn),a=Bn.dot(fi),l=Bn.dot(Jl),c=fi.dot(fi),h=fi.dot(Jl),d=o*c-a*a;if(d===0)return s.set(0,0,0),null;const u=1/d,f=(c*l-a*h)*u,_=(o*h-a*l)*u;return s.set(1-f-_,_,f)}static containsPoint(t,e,i,r){return this.getBarycoord(t,e,i,r,pi)===null?!1:pi.x>=0&&pi.y>=0&&pi.x+pi.y<=1}static getInterpolation(t,e,i,r,s,o,a,l){return this.getBarycoord(t,e,i,r,pi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,pi.x),l.addScaledVector(o,pi.y),l.addScaledVector(a,pi.z),l)}static getInterpolatedAttribute(t,e,i,r,s,o){return ec.setScalar(0),nc.setScalar(0),ic.setScalar(0),ec.fromBufferAttribute(t,e),nc.fromBufferAttribute(t,i),ic.fromBufferAttribute(t,r),o.setScalar(0),o.addScaledVector(ec,s.x),o.addScaledVector(nc,s.y),o.addScaledVector(ic,s.z),o}static isFrontFacing(t,e,i,r){return Bn.subVectors(i,e),fi.subVectors(t,e),Bn.cross(fi).dot(r)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,r){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,e,i,r){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Bn.subVectors(this.c,this.b),fi.subVectors(this.a,this.b),Bn.cross(fi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return zn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return zn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,r,s){return zn.getInterpolation(t,this.a,this.b,this.c,e,i,r,s)}containsPoint(t){return zn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return zn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,r=this.b,s=this.c;let o,a;Jr.subVectors(r,i),jr.subVectors(s,i),jl.subVectors(t,i);const l=Jr.dot(jl),c=jr.dot(jl);if(l<=0&&c<=0)return e.copy(i);Ql.subVectors(t,r);const h=Jr.dot(Ql),d=jr.dot(Ql);if(h>=0&&d<=h)return e.copy(r);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(i).addScaledVector(Jr,o);tc.subVectors(t,s);const f=Jr.dot(tc),_=jr.dot(tc);if(_>=0&&f<=_)return e.copy(s);const g=f*c-l*_;if(g<=0&&c>=0&&_<=0)return a=c/(c-_),e.copy(i).addScaledVector(jr,a);const p=h*_-f*d;if(p<=0&&d-h>=0&&f-_>=0)return vf.subVectors(s,r),a=(d-h)/(d-h+(f-_)),e.copy(r).addScaledVector(vf,a);const m=1/(p+g+u);return o=g*m,a=u*m,e.copy(i).addScaledVector(Jr,o).addScaledVector(jr,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}class Oo{constructor(t=new V(1/0,1/0,1/0),e=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Vn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Vn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=Vn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Vn):Vn.fromBufferAttribute(s,o),Vn.applyMatrix4(t.matrixWorld),this.expandByPoint(Vn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ea.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ea.copy(i.boundingBox)),ea.applyMatrix4(t.matrixWorld),this.union(ea)}const r=t.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Vn),Vn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Hs),na.subVectors(this.max,Hs),Qr.subVectors(t.a,Hs),ts.subVectors(t.b,Hs),es.subVectors(t.c,Hs),Wi.subVectors(ts,Qr),Xi.subVectors(es,ts),pr.subVectors(Qr,es);let e=[0,-Wi.z,Wi.y,0,-Xi.z,Xi.y,0,-pr.z,pr.y,Wi.z,0,-Wi.x,Xi.z,0,-Xi.x,pr.z,0,-pr.x,-Wi.y,Wi.x,0,-Xi.y,Xi.x,0,-pr.y,pr.x,0];return!rc(e,Qr,ts,es,na)||(e=[1,0,0,0,1,0,0,0,1],!rc(e,Qr,ts,es,na))?!1:(ia.crossVectors(Wi,Xi),e=[ia.x,ia.y,ia.z],rc(e,Qr,ts,es,na))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Vn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Vn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(mi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),mi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),mi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),mi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),mi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),mi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),mi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),mi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(mi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const mi=[new V,new V,new V,new V,new V,new V,new V,new V],Vn=new V,ea=new Oo,Qr=new V,ts=new V,es=new V,Wi=new V,Xi=new V,pr=new V,Hs=new V,na=new V,ia=new V,mr=new V;function rc(n,t,e,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){mr.fromArray(n,s);const a=r.x*Math.abs(mr.x)+r.y*Math.abs(mr.y)+r.z*Math.abs(mr.z),l=t.dot(mr),c=e.dot(mr),h=i.dot(mr);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const Pe=new V,ra=new Kt;let pE=0;class ri extends Vr{constructor(t,e,i=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:pE++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=nf,this.updateRanges=[],this.gpuType=ti,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=e.array[i+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)ra.fromBufferAttribute(this,e),ra.applyMatrix3(t),this.setXY(e,ra.x,ra.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Pe.fromBufferAttribute(this,e),Pe.applyMatrix3(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Pe.fromBufferAttribute(this,e),Pe.applyMatrix4(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Pe.fromBufferAttribute(this,e),Pe.applyNormalMatrix(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Pe.fromBufferAttribute(this,e),Pe.transformDirection(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=as(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Ze(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=as(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ze(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=as(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ze(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=as(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ze(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=as(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ze(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Ze(e,this.array),i=Ze(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,r){return t*=this.itemSize,this.normalized&&(e=Ze(e,this.array),i=Ze(i,this.array),r=Ze(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=r,this}setXYZW(t,e,i,r,s){return t*=this.itemSize,this.normalized&&(e=Ze(e,this.array),i=Ze(i,this.array),r=Ze(r,this.array),s=Ze(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==nf&&(t.usage=this.usage),t}dispose(){this.dispatchEvent({type:"dispose"})}}class D_ extends ri{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class I_ extends ri{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Mi extends ri{constructor(t,e,i){super(new Float32Array(t),e,i)}}const mE=new Oo,Gs=new V,sc=new V;class Nu{constructor(t=new V,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):mE.setFromPoints(t).getCenter(i);let r=0;for(let s=0,o=t.length;s<o;s++)r=Math.max(r,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Gs.subVectors(t,this.center);const e=Gs.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),r=(i-this.radius)*.5;this.center.addScaledVector(Gs,r/i),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(sc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Gs.copy(t.center).add(sc)),this.expandByPoint(Gs.copy(t.center).sub(sc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}let _E=0;const Rn=new Te,oc=new wn,ns=new V,mn=new Oo,Ws=new Oo,ke=new V;class Ii extends Vr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:_E++}),this.uuid=Ds(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(IS(t)?I_:D_)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Dt().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return Rn.makeRotationFromQuaternion(t),this.applyMatrix4(Rn),this}rotateX(t){return Rn.makeRotationX(t),this.applyMatrix4(Rn),this}rotateY(t){return Rn.makeRotationY(t),this.applyMatrix4(Rn),this}rotateZ(t){return Rn.makeRotationZ(t),this.applyMatrix4(Rn),this}translate(t,e,i){return Rn.makeTranslation(t,e,i),this.applyMatrix4(Rn),this}scale(t,e,i){return Rn.makeScale(t,e,i),this.applyMatrix4(Rn),this}lookAt(t){return oc.lookAt(t),oc.updateMatrix(),this.applyMatrix4(oc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ns).negate(),this.translate(ns.x,ns.y,ns.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let r=0,s=t.length;r<s;r++){const o=t[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Mi(i,3))}else{const i=Math.min(t.length,e.count);for(let r=0;r<i;r++){const s=t[r];e.setXYZ(r,s.x,s.y,s.z||0)}t.length>e.count&&Pt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Oo);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Xt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,r=e.length;i<r;i++){const s=e[i];mn.setFromBufferAttribute(s),this.morphTargetsRelative?(ke.addVectors(this.boundingBox.min,mn.min),this.boundingBox.expandByPoint(ke),ke.addVectors(this.boundingBox.max,mn.max),this.boundingBox.expandByPoint(ke)):(this.boundingBox.expandByPoint(mn.min),this.boundingBox.expandByPoint(mn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Xt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Nu);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Xt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new V,1/0);return}if(t){const i=this.boundingSphere.center;if(mn.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const a=e[s];Ws.setFromBufferAttribute(a),this.morphTargetsRelative?(ke.addVectors(mn.min,Ws.min),mn.expandByPoint(ke),ke.addVectors(mn.max,Ws.max),mn.expandByPoint(ke)):(mn.expandByPoint(Ws.min),mn.expandByPoint(Ws.max))}mn.getCenter(i);let r=0;for(let s=0,o=t.count;s<o;s++)ke.fromBufferAttribute(t,s),r=Math.max(r,i.distanceToSquared(ke));if(e)for(let s=0,o=e.length;s<o;s++){const a=e[s],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)ke.fromBufferAttribute(a,c),l&&(ns.fromBufferAttribute(t,c),ke.add(ns)),r=Math.max(r,i.distanceToSquared(ke))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&Xt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Xt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,r=e.normal,s=e.uv;let o=this.getAttribute("tangent");(o===void 0||o.count!==i.count)&&(o=new ri(new Float32Array(4*i.count),4),this.setAttribute("tangent",o));const a=[],l=[];for(let v=0;v<i.count;v++)a[v]=new V,l[v]=new V;const c=new V,h=new V,d=new V,u=new Kt,f=new Kt,_=new Kt,g=new V,p=new V;function m(v,M,P){c.fromBufferAttribute(i,v),h.fromBufferAttribute(i,M),d.fromBufferAttribute(i,P),u.fromBufferAttribute(s,v),f.fromBufferAttribute(s,M),_.fromBufferAttribute(s,P),h.sub(c),d.sub(c),f.sub(u),_.sub(u);const R=1/(f.x*_.y-_.x*f.y);isFinite(R)&&(g.copy(h).multiplyScalar(_.y).addScaledVector(d,-f.y).multiplyScalar(R),p.copy(d).multiplyScalar(f.x).addScaledVector(h,-_.x).multiplyScalar(R),a[v].add(g),a[M].add(g),a[P].add(g),l[v].add(p),l[M].add(p),l[P].add(p))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let v=0,M=y.length;v<M;++v){const P=y[v],R=P.start,D=P.count;for(let H=R,X=R+D;H<X;H+=3)m(t.getX(H+0),t.getX(H+1),t.getX(H+2))}const E=new V,b=new V,S=new V,T=new V;function C(v){S.fromBufferAttribute(r,v),T.copy(S);const M=a[v];E.copy(M),E.sub(S.multiplyScalar(S.dot(M))).normalize(),b.crossVectors(T,M);const R=b.dot(l[v])<0?-1:1;o.setXYZW(v,E.x,E.y,E.z,R)}for(let v=0,M=y.length;v<M;++v){const P=y[v],R=P.start,D=P.count;for(let H=R,X=R+D;H<X;H+=3)C(t.getX(H+0)),C(t.getX(H+1)),C(t.getX(H+2))}this._transformed=!0}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==e.count)i=new ri(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let u=0,f=i.count;u<f;u++)i.setXYZ(u,0,0,0);const r=new V,s=new V,o=new V,a=new V,l=new V,c=new V,h=new V,d=new V;if(t)for(let u=0,f=t.count;u<f;u+=3){const _=t.getX(u+0),g=t.getX(u+1),p=t.getX(u+2);r.fromBufferAttribute(e,_),s.fromBufferAttribute(e,g),o.fromBufferAttribute(e,p),h.subVectors(o,s),d.subVectors(r,s),h.cross(d),a.fromBufferAttribute(i,_),l.fromBufferAttribute(i,g),c.fromBufferAttribute(i,p),a.add(h),l.add(h),c.add(h),i.setXYZ(_,a.x,a.y,a.z),i.setXYZ(g,l.x,l.y,l.z),i.setXYZ(p,c.x,c.y,c.z)}else for(let u=0,f=e.count;u<f;u+=3)r.fromBufferAttribute(e,u+0),s.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),h.subVectors(o,s),d.subVectors(r,s),h.cross(d),i.setXYZ(u+0,h.x,h.y,h.z),i.setXYZ(u+1,h.x,h.y,h.z),i.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)ke.fromBufferAttribute(t,e),ke.normalize(),t.setXYZ(e,ke.x,ke.y,ke.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,d=a.normalized,u=new c.constructor(l.length*h);let f=0,_=0;for(let g=0,p=l.length;g<p;g++){a.isInterleavedBufferAttribute?f=l[g]*a.data.stride+a.offset:f=l[g]*h;for(let m=0;m<h;m++)u[_++]=c[f++]}return new ri(u,h,d)}if(this.index===null)return Pt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ii,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=t(l,i);e.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let h=0,d=c.length;h<d;h++){const u=c[h],f=t(u,i);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const f=c[d];h.push(f.toJSON(t.data))}h.length>0&&(r[l]=h,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone());const r=t.attributes;for(const c in r){const h=r[c];this.setAttribute(c,h.clone(e))}const s=t.morphAttributes;for(const c in s){const h=[],d=s[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}let gE=0;class fl extends Vr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:gE++}),this.uuid=Ds(),this.name="",this.type="Material",this.blending=ms,this.side=ar,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Gc,this.blendDst=Wc,this.blendEquation=br,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Jt(0,0,0),this.blendAlpha=0,this.depthFunc=Es,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ef,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=qr,this.stencilZFail=qr,this.stencilZPass=qr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){Pt(`Material: parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){Pt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector2&&i&&i.isVector2||r&&r.isEuler&&i&&i.isEuler||r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ms&&(i.blending=this.blending),this.side!==ar&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Gc&&(i.blendSrc=this.blendSrc),this.blendDst!==Wc&&(i.blendDst=this.blendDst),this.blendEquation!==br&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Es&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ef&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==qr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==qr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==qr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(e){const s=r(t.textures),o=r(t.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Jt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let i=t.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new Kt().fromArray(i)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Kt().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const r=e.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}const _i=new V,ac=new V,sa=new V,qi=new V,lc=new V,oa=new V,cc=new V;class vE{constructor(t=new V,e=new V(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,_i)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=_i.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(_i.copy(this.origin).addScaledVector(this.direction,e),_i.distanceToSquared(t))}distanceSqToSegment(t,e,i,r){ac.copy(t).add(e).multiplyScalar(.5),sa.copy(e).sub(t).normalize(),qi.copy(this.origin).sub(ac);const s=t.distanceTo(e)*.5,o=-this.direction.dot(sa),a=qi.dot(this.direction),l=-qi.dot(sa),c=qi.lengthSq(),h=Math.abs(1-o*o);let d,u,f,_;if(h>0)if(d=o*l-a,u=o*a-l,_=s*h,d>=0)if(u>=-_)if(u<=_){const g=1/h;d*=g,u*=g,f=d*(d+o*u+2*a)+u*(o*d+u+2*l)+c}else u=s,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u=-s,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u<=-_?(d=Math.max(0,-(-o*s+a)),u=d>0?-s:Math.min(Math.max(-s,-l),s),f=-d*d+u*(u+2*l)+c):u<=_?(d=0,u=Math.min(Math.max(-s,-l),s),f=u*(u+2*l)+c):(d=Math.max(0,-(o*s+a)),u=d>0?s:Math.min(Math.max(-s,-l),s),f=-d*d+u*(u+2*l)+c);else u=o>0?-s:s,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(ac).addScaledVector(sa,u),f}intersectSphere(t,e){_i.subVectors(t.center,this.origin);const i=_i.dot(this.direction),r=_i.dot(_i)-i*i,s=t.radius*t.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,r,s,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(i=(t.min.x-u.x)*c,r=(t.max.x-u.x)*c):(i=(t.max.x-u.x)*c,r=(t.min.x-u.x)*c),h>=0?(s=(t.min.y-u.y)*h,o=(t.max.y-u.y)*h):(s=(t.max.y-u.y)*h,o=(t.min.y-u.y)*h),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),d>=0?(a=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(a=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,e)}intersectsBox(t){return this.intersectBox(t,_i)!==null}intersectTriangle(t,e,i,r,s){lc.subVectors(e,t),oa.subVectors(i,t),cc.crossVectors(lc,oa);let o=this.direction.dot(cc),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;qi.subVectors(this.origin,t);const l=a*this.direction.dot(oa.crossVectors(qi,oa));if(l<0)return null;const c=a*this.direction.dot(lc.cross(qi));if(c<0||l+c>o)return null;const h=-a*qi.dot(cc);return h<0?null:this.at(h/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ou extends fl{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Jt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Nr,this.combine=d_,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const xf=new Te,_r=new vE,aa=new Nu,bf=new V,la=new V,ca=new V,ha=new V,hc=new V,ua=new V,yf=new V,da=new V;class ci extends wn{constructor(t=new Ii,e=new Ou){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const r=e[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(t,e){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(r,t);const a=this.morphTargetInfluences;if(s&&a){ua.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=a[l],d=s[l];h!==0&&(hc.fromBufferAttribute(d,t),o?ua.addScaledVector(hc,h):ua.addScaledVector(hc.sub(e),h))}e.add(ua)}return e}raycast(t,e){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),aa.copy(i.boundingSphere),aa.applyMatrix4(s),_r.copy(t.ray).recast(t.near),!(aa.containsPoint(_r.origin)===!1&&(_r.intersectSphere(aa,bf)===null||_r.origin.distanceToSquared(bf)>(t.far-t.near)**2))&&(xf.copy(s).invert(),_r.copy(t.ray).applyMatrix4(xf),!(i.boundingBox!==null&&_r.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,_r)))}_computeIntersections(t,e,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,d=s.attributes.normal,u=s.groups,f=s.drawRange;if(a!==null)if(Array.isArray(o))for(let _=0,g=u.length;_<g;_++){const p=u[_],m=o[p.materialIndex],y=Math.max(p.start,f.start),E=Math.min(a.count,Math.min(p.start+p.count,f.start+f.count));for(let b=y,S=E;b<S;b+=3){const T=a.getX(b),C=a.getX(b+1),v=a.getX(b+2);r=fa(this,m,t,i,c,h,d,T,C,v),r&&(r.faceIndex=Math.floor(b/3),r.face.materialIndex=p.materialIndex,e.push(r))}}else{const _=Math.max(0,f.start),g=Math.min(a.count,f.start+f.count);for(let p=_,m=g;p<m;p+=3){const y=a.getX(p),E=a.getX(p+1),b=a.getX(p+2);r=fa(this,o,t,i,c,h,d,y,E,b),r&&(r.faceIndex=Math.floor(p/3),e.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let _=0,g=u.length;_<g;_++){const p=u[_],m=o[p.materialIndex],y=Math.max(p.start,f.start),E=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let b=y,S=E;b<S;b+=3){const T=b,C=b+1,v=b+2;r=fa(this,m,t,i,c,h,d,T,C,v),r&&(r.faceIndex=Math.floor(b/3),r.face.materialIndex=p.materialIndex,e.push(r))}}else{const _=Math.max(0,f.start),g=Math.min(l.count,f.start+f.count);for(let p=_,m=g;p<m;p+=3){const y=p,E=p+1,b=p+2;r=fa(this,o,t,i,c,h,d,y,E,b),r&&(r.faceIndex=Math.floor(p/3),e.push(r))}}}}function xE(n,t,e,i,r,s,o,a){let l;if(t.side===hn?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,t.side===ar,a),l===null)return null;da.copy(a),da.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(da);return c<e.near||c>e.far?null:{distance:c,point:da.clone(),object:n}}function fa(n,t,e,i,r,s,o,a,l,c){n.getVertexPosition(a,la),n.getVertexPosition(l,ca),n.getVertexPosition(c,ha);const h=xE(n,t,e,i,la,ca,ha,yf);if(h){const d=new V;zn.getBarycoord(yf,la,ca,ha,d),r&&(h.uv=zn.getInterpolatedAttribute(r,a,l,c,d,new Kt)),s&&(h.uv1=zn.getInterpolatedAttribute(s,a,l,c,d,new Kt)),o&&(h.normal=zn.getInterpolatedAttribute(o,a,l,c,d,new V),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:l,c,normal:new V,materialIndex:0};zn.getNormal(la,ca,ha,u.normal),h.face=u,h.barycoord=d}return h}class bE extends Ke{constructor(t=null,e=1,i=1,r,s,o,a,l,c=ze,h=ze,d,u){super(null,o,a,l,c,h,r,s,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const uc=new V,yE=new V,wE=new Dt;class xr{constructor(t=new V(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,r){return this.normal.set(t,e,i),this.constant=r,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const r=uc.subVectors(i,e).cross(yE.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,i=!0){const r=t.delta(uc),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/s;return i===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(r,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||wE.getNormalMatrix(t),r=this.coplanarPoint(uc).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const gr=new Nu,SE=new Kt(.5,.5),pa=new V;class U_{constructor(t=new xr,e=new xr,i=new xr,r=new xr,s=new xr,o=new xr){this.planes=[t,e,i,r,s,o]}set(t,e,i,r,s,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=ei,i=!1){const r=this.planes,s=t.elements,o=s[0],a=s[1],l=s[2],c=s[3],h=s[4],d=s[5],u=s[6],f=s[7],_=s[8],g=s[9],p=s[10],m=s[11],y=s[12],E=s[13],b=s[14],S=s[15];if(r[0].setComponents(c-o,f-h,m-_,S-y).normalize(),r[1].setComponents(c+o,f+h,m+_,S+y).normalize(),r[2].setComponents(c+a,f+d,m+g,S+E).normalize(),r[3].setComponents(c-a,f-d,m-g,S-E).normalize(),i)r[4].setComponents(l,u,p,b).normalize(),r[5].setComponents(c-l,f-u,m-p,S-b).normalize();else if(r[4].setComponents(c-l,f-u,m-p,S-b).normalize(),e===ei)r[5].setComponents(c+l,f+u,m+p,S+b).normalize();else if(e===Ja)r[5].setComponents(l,u,p,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),gr.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),gr.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(gr)}intersectsSprite(t){gr.center.set(0,0,0);const e=SE.distanceTo(t.center);return gr.radius=.7071067811865476+e,gr.applyMatrix4(t.matrixWorld),this.intersectsSphere(gr)}intersectsSphere(t){const e=this.planes,i=t.center,r=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const r=e[i];if(pa.x=r.normal.x>0?t.max.x:t.min.x,pa.y=r.normal.y>0?t.max.y:t.min.y,pa.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(pa)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class N_ extends Ke{constructor(t=[],e=Ir,i,r,s,o,a,l,c,h){super(t,e,i,r,s,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Ts extends Ke{constructor(t,e,i=li,r,s,o,a=ze,l=ze,c,h=Li,d=1){if(h!==Li&&h!==Er)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:t,height:e,depth:d};super(u,r,s,o,a,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Uu(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class EE extends Ts{constructor(t,e=li,i=Ir,r,s,o=ze,a=ze,l,c=Li){const h={width:t,height:t,depth:1},d=[h,h,h,h,h,h];super(t,t,e,i,r,s,o,a,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class O_ extends Ke{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Fo extends Ii{constructor(t=1,e=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],h=[],d=[];let u=0,f=0;_("z","y","x",-1,-1,i,e,t,o,s,0),_("z","y","x",1,-1,i,e,-t,o,s,1),_("x","z","y",1,1,t,i,e,r,o,2),_("x","z","y",1,-1,t,i,-e,r,o,3),_("x","y","z",1,-1,t,e,i,r,s,4),_("x","y","z",-1,-1,t,e,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new Mi(c,3)),this.setAttribute("normal",new Mi(h,3)),this.setAttribute("uv",new Mi(d,2));function _(g,p,m,y,E,b,S,T,C,v,M){const P=b/C,R=S/v,D=b/2,H=S/2,X=T/2,U=C+1,G=v+1;let O=0,$=0;const Q=new V;for(let it=0;it<G;it++){const et=it*R-H;for(let dt=0;dt<U;dt++){const Rt=dt*P-D;Q[g]=Rt*y,Q[p]=et*E,Q[m]=X,c.push(Q.x,Q.y,Q.z),Q[g]=0,Q[p]=0,Q[m]=T>0?1:-1,h.push(Q.x,Q.y,Q.z),d.push(dt/C),d.push(1-it/v),O+=1}}for(let it=0;it<v;it++)for(let et=0;et<C;et++){const dt=u+et+U*it,Rt=u+et+U*(it+1),kt=u+(et+1)+U*(it+1),Lt=u+(et+1)+U*it;l.push(dt,Rt,Lt),l.push(Rt,kt,Lt),$+=6}a.addGroup(f,$,M),f+=$,u+=O}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fo(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}class ko extends Ii{constructor(t=1,e=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:r};const s=t/2,o=e/2,a=Math.floor(i),l=Math.floor(r),c=a+1,h=l+1,d=t/a,u=e/l,f=[],_=[],g=[],p=[];for(let m=0;m<h;m++){const y=m*u-o;for(let E=0;E<c;E++){const b=E*d-s;_.push(b,-y,0),g.push(0,0,1),p.push(E/a),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let y=0;y<a;y++){const E=y+c*m,b=y+c*(m+1),S=y+1+c*(m+1),T=y+1+c*m;f.push(E,b,T),f.push(b,S,T)}this.setIndex(f),this.setAttribute("position",new Mi(_,3)),this.setAttribute("normal",new Mi(g,3)),this.setAttribute("uv",new Mi(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ko(t.width,t.height,t.widthSegments,t.heightSegments)}}function Cs(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const r=n[e][i];if(wf(r))r.isRenderTargetTexture?(Pt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=r.clone();else if(Array.isArray(r))if(wf(r[0])){const s=[];for(let o=0,a=r.length;o<a;o++)s[o]=r[o].clone();t[e][i]=s}else t[e][i]=r.slice();else t[e][i]=r}}return t}function Je(n){const t={};for(let e=0;e<n.length;e++){const i=Cs(n[e]);for(const r in i)t[r]=i[r]}return t}function wf(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function ME(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function F_(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:zt.workingColorSpace}const TE={clone:Cs,merge:Je};var CE=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,AE=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class hi extends fl{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=CE,this.fragmentShader=AE,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Cs(t.uniforms),this.uniformsGroups=ME(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?e.uniforms[r]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[r]={type:"m4",value:o.toArray()}:e.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(const i in t.uniforms){const r=t.uniforms[i];switch(this.uniforms[i]={},r.type){case"t":this.uniforms[i].value=e[r.value]||null;break;case"c":this.uniforms[i].value=new Jt().setHex(r.value);break;case"v2":this.uniforms[i].value=new Kt().fromArray(r.value);break;case"v3":this.uniforms[i].value=new V().fromArray(r.value);break;case"v4":this.uniforms[i].value=new be().fromArray(r.value);break;case"m3":this.uniforms[i].value=new Dt().fromArray(r.value);break;case"m4":this.uniforms[i].value=new Te().fromArray(r.value);break;default:this.uniforms[i].value=r.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(const i in t.extensions)this.extensions[i]=t.extensions[i];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}}class PE extends hi{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class RE extends fl{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=MS,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class LE extends fl{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const dc={enabled:!1,files:{},add:function(n,t){this.enabled!==!1&&(Sf(n)||(this.files[n]=t))},get:function(n){if(this.enabled!==!1&&!Sf(n))return this.files[n]},remove:function(n){delete this.files[n]},clear:function(){this.files={}}};function Sf(n){try{const t=n.slice(n.indexOf(":")+1);return new URL(t).protocol==="blob:"}catch{return!1}}class DE{constructor(t,e,i){const r=this;let s=!1,o=0,a=0,l;const c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=i,this._abortController=null,this.itemStart=function(h){a++,s===!1&&r.onStart!==void 0&&r.onStart(h,o,a),s=!0},this.itemEnd=function(h){o++,r.onProgress!==void 0&&r.onProgress(h,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(h){r.onError!==void 0&&r.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){const d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=c.length;d<u;d+=2){const f=c[d],_=c[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return _}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const IE=new DE;class Fu{constructor(t){this.manager=t!==void 0?t:IE,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){const i=this;return new Promise(function(r,s){i.load(t,r,e,s)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}}Fu.DEFAULT_MATERIAL_NAME="__DEFAULT";const is=new WeakMap;class UE extends Fu{constructor(t){super(t)}load(t,e,i,r){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const s=this,o=dc.get(`image:${t}`);if(o!==void 0){if(o.complete===!0)s.manager.itemStart(t),setTimeout(function(){e&&e(o),s.manager.itemEnd(t)},0);else{let d=is.get(o);d===void 0&&(d=[],is.set(o,d)),d.push({onLoad:e,onError:r})}return o}const a=So("img");function l(){h(),e&&e(this);const d=is.get(this)||[];for(let u=0;u<d.length;u++){const f=d[u];f.onLoad&&f.onLoad(this)}is.delete(this),s.manager.itemEnd(t)}function c(d){h(),r&&r(d),dc.remove(`image:${t}`);const u=is.get(this)||[];for(let f=0;f<u.length;f++){const _=u[f];_.onError&&_.onError(d)}is.delete(this),s.manager.itemError(t),s.manager.itemEnd(t)}function h(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),dc.add(`image:${t}`,a),s.manager.itemStart(t),a.src=t,a}}class NE extends Fu{constructor(t){super(t)}load(t,e,i,r){const s=new Ke,o=new UE(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){s.image=a,s.needsUpdate=!0,e!==void 0&&e(s)},i,r),s}}const ma=new V,_a=new Is,Yn=new V;class k_ extends wn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Te,this.projectionMatrix=new Te,this.projectionMatrixInverse=new Te,this.coordinateSystem=ei,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(ma,_a,Yn),Yn.x===1&&Yn.y===1&&Yn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ma,_a,Yn.set(1,1,1)).invert()}updateWorldMatrix(t,e,i=!1){super.updateWorldMatrix(t,e,i),this.matrixWorld.decompose(ma,_a,Yn),Yn.x===1&&Yn.y===1&&Yn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ma,_a,Yn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Yi=new V,Ef=new Kt,Mf=new Kt;class In extends k_{constructor(t=50,e=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Eo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(io*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Eo*2*Math.atan(Math.tan(io*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Yi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Yi.x,Yi.y).multiplyScalar(-t/Yi.z),Yi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Yi.x,Yi.y).multiplyScalar(-t/Yi.z)}getViewSize(t,e){return this.getViewBounds(t,Ef,Mf),e.subVectors(Mf,Ef)}setViewOffset(t,e,i,r,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(io*.5*this.fov)/this.zoom,i=2*e,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,e-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}class B_ extends k_{constructor(t=-1,e=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-t,o=i+t,a=r+e,l=r-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const rs=-90,ss=1;class OE extends wn{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new In(rs,ss,t,e);r.layers=this.layers,this.add(r);const s=new In(rs,ss,t,e);s.layers=this.layers,this.add(s);const o=new In(rs,ss,t,e);o.layers=this.layers,this.add(o);const a=new In(rs,ss,t,e);a.layers=this.layers,this.add(a);const l=new In(rs,ss,t,e);l.layers=this.layers,this.add(l);const c=new In(rs,ss,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,r,s,o,a,l]=e;for(const c of e)this.remove(c);if(t===ei)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Ja)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),_=t.xr.enabled;t.xr.enabled=!1;const g=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let p=!1;t.isWebGLRenderer===!0?p=t.state.buffers.depth.getReversed():p=t.reversedDepthBuffer,t.setRenderTarget(i,0,r),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,s),t.setRenderTarget(i,1,r),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(i,2,r),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(i,3,r),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(i,4,r),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),i.texture.generateMipmaps=g,t.setRenderTarget(i,5,r),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(d,u,f),t.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class FE extends In{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class V_{static{V_.prototype.isMatrix2=!0}constructor(t,e,i,r){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,i,r)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let i=0;i<4;i++)this.elements[i]=t[i+e];return this}set(t,e,i,r){const s=this.elements;return s[0]=t,s[2]=e,s[1]=i,s[3]=r,this}}function Tf(n,t,e,i){const r=kE(i);switch(e){case M_:return n*t;case C_:return n*t/r.components*r.byteLength;case Au:return n*t/r.components*r.byteLength;case Ur:return n*t*2/r.components*r.byteLength;case Pu:return n*t*2/r.components*r.byteLength;case T_:return n*t*3/r.components*r.byteLength;case Hn:return n*t*4/r.components*r.byteLength;case Ru:return n*t*4/r.components*r.byteLength;case Ca:case Aa:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Pa:case Ra:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case eh:case ih:return Math.max(n,16)*Math.max(t,8)/4;case th:case nh:return Math.max(n,8)*Math.max(t,8)/2;case rh:case sh:case ah:case lh:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case oh:case Ya:case ch:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case hh:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case uh:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case dh:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case fh:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case ph:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case mh:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case _h:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case gh:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case vh:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case xh:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case bh:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case yh:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case wh:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Sh:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Eh:case Mh:case Th:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Ch:case Ah:return Math.ceil(n/4)*Math.ceil(t/4)*8;case $a:case Ph:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function kE(n){switch(n){case Un:case y_:return{byteLength:1,components:1};case yo:case w_:case Ri:return{byteLength:2,components:1};case Tu:case Cu:return{byteLength:2,components:4};case li:case Mu:case ti:return{byteLength:4,components:1};case S_:case E_:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Eu}}));typeof window<"u"&&(window.__THREE__?Pt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Eu);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function z_(){let n=null,t=!1,e=null,i=null;function r(s,o){e(s,o),i=n.requestAnimationFrame(r)}return{start:function(){t!==!0&&e!==null&&n!==null&&(i=n.requestAnimationFrame(r),t=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function BE(n){const t=new WeakMap;function e(a,l){const c=a.array,h=a.usage,d=c.byteLength,u=n.createBuffer();n.bindBuffer(l,u),n.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=n.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function i(a,l,c){const h=l.array,d=l.updateRanges;if(n.bindBuffer(c,a),d.length===0)n.bufferSubData(c,0,h);else{d.sort((f,_)=>f.start-_.start);let u=0;for(let f=1;f<d.length;f++){const _=d[u],g=d[f];g.start<=_.start+_.count+1?_.count=Math.max(_.count,g.start+g.count-_.start):(++u,d[u]=g)}d.length=u+1;for(let f=0,_=d.length;f<_;f++){const g=d[f];n.bufferSubData(c,g.start*h.BYTES_PER_ELEMENT,h,g.start,g.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(n.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}var VE=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,zE=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,HE=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,GE=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,WE=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,XE=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,qE=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,YE=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,$E=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,KE=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,ZE=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,JE=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,jE=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,QE=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,tM=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,eM=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,nM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,iM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,rM=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,sM=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,oM=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,aM=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,lM=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,cM=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,hM=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,uM=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,dM=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,fM=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,pM=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,mM=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,_M="gl_FragColor = linearToOutputTexel( gl_FragColor );",gM=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,vM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,xM=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,bM=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,yM=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,wM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,SM=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,EM=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,MM=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,TM=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,CM=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,AM=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,PM=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,RM=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,LM=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,DM=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,IM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,UM=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,NM=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,OM=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,FM=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,kM=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,BM=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,VM=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,zM=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,HM=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,GM=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,WM=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,XM=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qM=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,YM=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,$M=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,KM=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,ZM=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,JM=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,jM=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,QM=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,tT=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,eT=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,nT=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,iT=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,rT=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,sT=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,oT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,aT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,lT=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,cT=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,hT=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,uT=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,dT=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,fT=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,pT=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,mT=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,_T=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,gT=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,vT=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,xT=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,bT=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,yT=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,wT=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,ST=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,ET=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,MT=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,TT=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,CT=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,AT=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,PT=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,RT=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,LT=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,DT=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,IT=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,UT=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,NT=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,OT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,FT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,kT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,BT=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const VT=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,zT=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,HT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,GT=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,WT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,XT=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qT=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,YT=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,$T=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,KT=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,ZT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,JT=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jT=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,QT=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,tC=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,eC=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,nC=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,iC=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rC=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,sC=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,oC=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,aC=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,lC=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,cC=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hC=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,uC=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dC=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fC=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pC=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,mC=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,_C=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,gC=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,vC=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,xC=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Nt={alphahash_fragment:VE,alphahash_pars_fragment:zE,alphamap_fragment:HE,alphamap_pars_fragment:GE,alphatest_fragment:WE,alphatest_pars_fragment:XE,aomap_fragment:qE,aomap_pars_fragment:YE,batching_pars_vertex:$E,batching_vertex:KE,begin_vertex:ZE,beginnormal_vertex:JE,bsdfs:jE,iridescence_fragment:QE,bumpmap_pars_fragment:tM,clipping_planes_fragment:eM,clipping_planes_pars_fragment:nM,clipping_planes_pars_vertex:iM,clipping_planes_vertex:rM,color_fragment:sM,color_pars_fragment:oM,color_pars_vertex:aM,color_vertex:lM,common:cM,cube_uv_reflection_fragment:hM,defaultnormal_vertex:uM,displacementmap_pars_vertex:dM,displacementmap_vertex:fM,emissivemap_fragment:pM,emissivemap_pars_fragment:mM,colorspace_fragment:_M,colorspace_pars_fragment:gM,envmap_fragment:vM,envmap_common_pars_fragment:xM,envmap_pars_fragment:bM,envmap_pars_vertex:yM,envmap_physical_pars_fragment:DM,envmap_vertex:wM,fog_vertex:SM,fog_pars_vertex:EM,fog_fragment:MM,fog_pars_fragment:TM,gradientmap_pars_fragment:CM,lightmap_pars_fragment:AM,lights_lambert_fragment:PM,lights_lambert_pars_fragment:RM,lights_pars_begin:LM,lights_toon_fragment:IM,lights_toon_pars_fragment:UM,lights_phong_fragment:NM,lights_phong_pars_fragment:OM,lights_physical_fragment:FM,lights_physical_pars_fragment:kM,lights_fragment_begin:BM,lights_fragment_maps:VM,lights_fragment_end:zM,lightprobes_pars_fragment:HM,logdepthbuf_fragment:GM,logdepthbuf_pars_fragment:WM,logdepthbuf_pars_vertex:XM,logdepthbuf_vertex:qM,map_fragment:YM,map_pars_fragment:$M,map_particle_fragment:KM,map_particle_pars_fragment:ZM,metalnessmap_fragment:JM,metalnessmap_pars_fragment:jM,morphinstance_vertex:QM,morphcolor_vertex:tT,morphnormal_vertex:eT,morphtarget_pars_vertex:nT,morphtarget_vertex:iT,normal_fragment_begin:rT,normal_fragment_maps:sT,normal_pars_fragment:oT,normal_pars_vertex:aT,normal_vertex:lT,normalmap_pars_fragment:cT,clearcoat_normal_fragment_begin:hT,clearcoat_normal_fragment_maps:uT,clearcoat_pars_fragment:dT,iridescence_pars_fragment:fT,opaque_fragment:pT,packing:mT,premultiplied_alpha_fragment:_T,project_vertex:gT,dithering_fragment:vT,dithering_pars_fragment:xT,roughnessmap_fragment:bT,roughnessmap_pars_fragment:yT,shadowmap_pars_fragment:wT,shadowmap_pars_vertex:ST,shadowmap_vertex:ET,shadowmask_pars_fragment:MT,skinbase_vertex:TT,skinning_pars_vertex:CT,skinning_vertex:AT,skinnormal_vertex:PT,specularmap_fragment:RT,specularmap_pars_fragment:LT,tonemapping_fragment:DT,tonemapping_pars_fragment:IT,transmission_fragment:UT,transmission_pars_fragment:NT,uv_pars_fragment:OT,uv_pars_vertex:FT,uv_vertex:kT,worldpos_vertex:BT,background_vert:VT,background_frag:zT,backgroundCube_vert:HT,backgroundCube_frag:GT,cube_vert:WT,cube_frag:XT,depth_vert:qT,depth_frag:YT,distance_vert:$T,distance_frag:KT,equirect_vert:ZT,equirect_frag:JT,linedashed_vert:jT,linedashed_frag:QT,meshbasic_vert:tC,meshbasic_frag:eC,meshlambert_vert:nC,meshlambert_frag:iC,meshmatcap_vert:rC,meshmatcap_frag:sC,meshnormal_vert:oC,meshnormal_frag:aC,meshphong_vert:lC,meshphong_frag:cC,meshphysical_vert:hC,meshphysical_frag:uC,meshtoon_vert:dC,meshtoon_frag:fC,points_vert:pC,points_frag:mC,shadow_vert:_C,shadow_frag:gC,sprite_vert:vC,sprite_frag:xC},ut={common:{diffuse:{value:new Jt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Dt},alphaMap:{value:null},alphaMapTransform:{value:new Dt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Dt}},envmap:{envMap:{value:null},envMapRotation:{value:new Dt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Dt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Dt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Dt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Dt},normalScale:{value:new Kt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Dt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Dt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Dt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Dt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Jt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new V},probesMax:{value:new V},probesResolution:{value:new V}},points:{diffuse:{value:new Jt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Dt},alphaTest:{value:0},uvTransform:{value:new Dt}},sprite:{diffuse:{value:new Jt(16777215)},opacity:{value:1},center:{value:new Kt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Dt},alphaMap:{value:null},alphaMapTransform:{value:new Dt},alphaTest:{value:0}}},Zn={basic:{uniforms:Je([ut.common,ut.specularmap,ut.envmap,ut.aomap,ut.lightmap,ut.fog]),vertexShader:Nt.meshbasic_vert,fragmentShader:Nt.meshbasic_frag},lambert:{uniforms:Je([ut.common,ut.specularmap,ut.envmap,ut.aomap,ut.lightmap,ut.emissivemap,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.fog,ut.lights,{emissive:{value:new Jt(0)},envMapIntensity:{value:1}}]),vertexShader:Nt.meshlambert_vert,fragmentShader:Nt.meshlambert_frag},phong:{uniforms:Je([ut.common,ut.specularmap,ut.envmap,ut.aomap,ut.lightmap,ut.emissivemap,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.fog,ut.lights,{emissive:{value:new Jt(0)},specular:{value:new Jt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Nt.meshphong_vert,fragmentShader:Nt.meshphong_frag},standard:{uniforms:Je([ut.common,ut.envmap,ut.aomap,ut.lightmap,ut.emissivemap,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.roughnessmap,ut.metalnessmap,ut.fog,ut.lights,{emissive:{value:new Jt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Nt.meshphysical_vert,fragmentShader:Nt.meshphysical_frag},toon:{uniforms:Je([ut.common,ut.aomap,ut.lightmap,ut.emissivemap,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.gradientmap,ut.fog,ut.lights,{emissive:{value:new Jt(0)}}]),vertexShader:Nt.meshtoon_vert,fragmentShader:Nt.meshtoon_frag},matcap:{uniforms:Je([ut.common,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.fog,{matcap:{value:null}}]),vertexShader:Nt.meshmatcap_vert,fragmentShader:Nt.meshmatcap_frag},points:{uniforms:Je([ut.points,ut.fog]),vertexShader:Nt.points_vert,fragmentShader:Nt.points_frag},dashed:{uniforms:Je([ut.common,ut.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Nt.linedashed_vert,fragmentShader:Nt.linedashed_frag},depth:{uniforms:Je([ut.common,ut.displacementmap]),vertexShader:Nt.depth_vert,fragmentShader:Nt.depth_frag},normal:{uniforms:Je([ut.common,ut.bumpmap,ut.normalmap,ut.displacementmap,{opacity:{value:1}}]),vertexShader:Nt.meshnormal_vert,fragmentShader:Nt.meshnormal_frag},sprite:{uniforms:Je([ut.sprite,ut.fog]),vertexShader:Nt.sprite_vert,fragmentShader:Nt.sprite_frag},background:{uniforms:{uvTransform:{value:new Dt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Nt.background_vert,fragmentShader:Nt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Dt}},vertexShader:Nt.backgroundCube_vert,fragmentShader:Nt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Nt.cube_vert,fragmentShader:Nt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Nt.equirect_vert,fragmentShader:Nt.equirect_frag},distance:{uniforms:Je([ut.common,ut.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Nt.distance_vert,fragmentShader:Nt.distance_frag},shadow:{uniforms:Je([ut.lights,ut.fog,{color:{value:new Jt(0)},opacity:{value:1}}]),vertexShader:Nt.shadow_vert,fragmentShader:Nt.shadow_frag}};Zn.physical={uniforms:Je([Zn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Dt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Dt},clearcoatNormalScale:{value:new Kt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Dt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Dt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Dt},sheen:{value:0},sheenColor:{value:new Jt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Dt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Dt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Dt},transmissionSamplerSize:{value:new Kt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Dt},attenuationDistance:{value:0},attenuationColor:{value:new Jt(0)},specularColor:{value:new Jt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Dt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Dt},anisotropyVector:{value:new Kt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Dt}}]),vertexShader:Nt.meshphysical_vert,fragmentShader:Nt.meshphysical_frag};const ga={r:0,b:0,g:0},bC=new Te,H_=new Dt;H_.set(-1,0,0,0,1,0,0,0,1);function yC(n,t,e,i,r,s){const o=new Jt(0);let a=r===!0?0:1,l,c,h=null,d=0,u=null;function f(y){let E=y.isScene===!0?y.background:null;if(E&&E.isTexture){const b=y.backgroundBlurriness>0;E=t.get(E,b)}return E}function _(y){let E=!1;const b=f(y);b===null?p(o,a):b&&b.isColor&&(p(b,1),E=!0);const S=n.xr.getEnvironmentBlendMode();S==="additive"?e.buffers.color.setClear(0,0,0,1,s):S==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,s),(n.autoClear||E)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(y,E){const b=f(E);b&&(b.isCubeTexture||b.mapping===dl)?(c===void 0&&(c=new ci(new Fo(1,1,1),new hi({name:"BackgroundCubeMaterial",uniforms:Cs(Zn.backgroundCube.uniforms),vertexShader:Zn.backgroundCube.vertexShader,fragmentShader:Zn.backgroundCube.fragmentShader,side:hn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(S,T,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=b,c.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(bC.makeRotationFromEuler(E.backgroundRotation)).transpose(),b.isCubeTexture&&b.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(H_),c.material.toneMapped=zt.getTransfer(b.colorSpace)!==te,(h!==b||d!==b.version||u!==n.toneMapping)&&(c.material.needsUpdate=!0,h=b,d=b.version,u=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null)):b&&b.isTexture&&(l===void 0&&(l=new ci(new ko(2,2),new hi({name:"BackgroundMaterial",uniforms:Cs(Zn.background.uniforms),vertexShader:Zn.background.vertexShader,fragmentShader:Zn.background.fragmentShader,side:ar,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=b,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.toneMapped=zt.getTransfer(b.colorSpace)!==te,b.matrixAutoUpdate===!0&&b.updateMatrix(),l.material.uniforms.uvTransform.value.copy(b.matrix),(h!==b||d!==b.version||u!==n.toneMapping)&&(l.material.needsUpdate=!0,h=b,d=b.version,u=n.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function p(y,E){y.getRGB(ga,F_(n)),e.buffers.color.setClear(ga.r,ga.g,ga.b,E,s)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(y,E=1){o.set(y),a=E,p(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(y){a=y,p(o,a)},render:_,addToRenderList:g,dispose:m}}function wC(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=u(null);let s=r,o=!1;function a(R,D,H,X,U){let G=!1;const O=d(R,X,H,D);s!==O&&(s=O,c(s.object)),G=f(R,X,H,U),G&&_(R,X,H,U),U!==null&&t.update(U,n.ELEMENT_ARRAY_BUFFER),(G||o)&&(o=!1,b(R,D,H,X),U!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(U).buffer))}function l(){return n.createVertexArray()}function c(R){return n.bindVertexArray(R)}function h(R){return n.deleteVertexArray(R)}function d(R,D,H,X){const U=X.wireframe===!0;let G=i[D.id];G===void 0&&(G={},i[D.id]=G);const O=R.isInstancedMesh===!0?R.id:0;let $=G[O];$===void 0&&($={},G[O]=$);let Q=$[H.id];Q===void 0&&(Q={},$[H.id]=Q);let it=Q[U];return it===void 0&&(it=u(l()),Q[U]=it),it}function u(R){const D=[],H=[],X=[];for(let U=0;U<e;U++)D[U]=0,H[U]=0,X[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:H,attributeDivisors:X,object:R,attributes:{},index:null}}function f(R,D,H,X){const U=s.attributes,G=D.attributes;let O=0;const $=H.getAttributes();for(const Q in $)if($[Q].location>=0){const et=U[Q];let dt=G[Q];if(dt===void 0&&(Q==="instanceMatrix"&&R.instanceMatrix&&(dt=R.instanceMatrix),Q==="instanceColor"&&R.instanceColor&&(dt=R.instanceColor)),et===void 0||et.attribute!==dt||dt&&et.data!==dt.data)return!0;O++}return s.attributesNum!==O||s.index!==X}function _(R,D,H,X){const U={},G=D.attributes;let O=0;const $=H.getAttributes();for(const Q in $)if($[Q].location>=0){let et=G[Q];et===void 0&&(Q==="instanceMatrix"&&R.instanceMatrix&&(et=R.instanceMatrix),Q==="instanceColor"&&R.instanceColor&&(et=R.instanceColor));const dt={};dt.attribute=et,et&&et.data&&(dt.data=et.data),U[Q]=dt,O++}s.attributes=U,s.attributesNum=O,s.index=X}function g(){const R=s.newAttributes;for(let D=0,H=R.length;D<H;D++)R[D]=0}function p(R){m(R,0)}function m(R,D){const H=s.newAttributes,X=s.enabledAttributes,U=s.attributeDivisors;H[R]=1,X[R]===0&&(n.enableVertexAttribArray(R),X[R]=1),U[R]!==D&&(n.vertexAttribDivisor(R,D),U[R]=D)}function y(){const R=s.newAttributes,D=s.enabledAttributes;for(let H=0,X=D.length;H<X;H++)D[H]!==R[H]&&(n.disableVertexAttribArray(H),D[H]=0)}function E(R,D,H,X,U,G,O){O===!0?n.vertexAttribIPointer(R,D,H,U,G):n.vertexAttribPointer(R,D,H,X,U,G)}function b(R,D,H,X){g();const U=X.attributes,G=H.getAttributes(),O=D.defaultAttributeValues;for(const $ in G){const Q=G[$];if(Q.location>=0){let it=U[$];if(it===void 0&&($==="instanceMatrix"&&R.instanceMatrix&&(it=R.instanceMatrix),$==="instanceColor"&&R.instanceColor&&(it=R.instanceColor)),it!==void 0){const et=it.normalized,dt=it.itemSize,Rt=t.get(it);if(Rt===void 0)continue;const kt=Rt.buffer,Lt=Rt.type,Z=Rt.bytesPerElement,rt=Lt===n.INT||Lt===n.UNSIGNED_INT||it.gpuType===Mu;if(it.isInterleavedBufferAttribute){const tt=it.data,At=tt.stride,St=it.offset;if(tt.isInstancedInterleavedBuffer){for(let Tt=0;Tt<Q.locationSize;Tt++)m(Q.location+Tt,tt.meshPerAttribute);R.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let Tt=0;Tt<Q.locationSize;Tt++)p(Q.location+Tt);n.bindBuffer(n.ARRAY_BUFFER,kt);for(let Tt=0;Tt<Q.locationSize;Tt++)E(Q.location+Tt,dt/Q.locationSize,Lt,et,At*Z,(St+dt/Q.locationSize*Tt)*Z,rt)}else{if(it.isInstancedBufferAttribute){for(let tt=0;tt<Q.locationSize;tt++)m(Q.location+tt,it.meshPerAttribute);R.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=it.meshPerAttribute*it.count)}else for(let tt=0;tt<Q.locationSize;tt++)p(Q.location+tt);n.bindBuffer(n.ARRAY_BUFFER,kt);for(let tt=0;tt<Q.locationSize;tt++)E(Q.location+tt,dt/Q.locationSize,Lt,et,dt*Z,dt/Q.locationSize*tt*Z,rt)}}else if(O!==void 0){const et=O[$];if(et!==void 0)switch(et.length){case 2:n.vertexAttrib2fv(Q.location,et);break;case 3:n.vertexAttrib3fv(Q.location,et);break;case 4:n.vertexAttrib4fv(Q.location,et);break;default:n.vertexAttrib1fv(Q.location,et)}}}}y()}function S(){M();for(const R in i){const D=i[R];for(const H in D){const X=D[H];for(const U in X){const G=X[U];for(const O in G)h(G[O].object),delete G[O];delete X[U]}}delete i[R]}}function T(R){if(i[R.id]===void 0)return;const D=i[R.id];for(const H in D){const X=D[H];for(const U in X){const G=X[U];for(const O in G)h(G[O].object),delete G[O];delete X[U]}}delete i[R.id]}function C(R){for(const D in i){const H=i[D];for(const X in H){const U=H[X];if(U[R.id]===void 0)continue;const G=U[R.id];for(const O in G)h(G[O].object),delete G[O];delete U[R.id]}}}function v(R){for(const D in i){const H=i[D],X=R.isInstancedMesh===!0?R.id:0,U=H[X];if(U!==void 0){for(const G in U){const O=U[G];for(const $ in O)h(O[$].object),delete O[$];delete U[G]}delete H[X],Object.keys(H).length===0&&delete i[D]}}}function M(){P(),o=!0,s!==r&&(s=r,c(s.object))}function P(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:M,resetDefaultState:P,dispose:S,releaseStatesOfGeometry:T,releaseStatesOfObject:v,releaseStatesOfProgram:C,initAttributes:g,enableAttribute:p,disableUnusedAttributes:y}}function SC(n,t,e){let i;function r(l){i=l}function s(l,c){n.drawArrays(i,l,c),e.update(c,i,1)}function o(l,c,h){h!==0&&(n.drawArraysInstanced(i,l,c,h),e.update(c,i,h))}function a(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let u=0;for(let f=0;f<h;f++)u+=c[f];e.update(u,i,1)}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a}function EC(n,t,e,i){let r;function s(){if(r!==void 0)return r;if(t.has("EXT_texture_filter_anisotropic")===!0){const C=t.get("EXT_texture_filter_anisotropic");r=n.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(C){return!(C!==Hn&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){const v=C===Ri&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==Un&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==ti&&!v)}function l(C){if(C==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(Pt("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&Pt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_TEXTURE_SIZE),p=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),m=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),E=n.getParameter(n.MAX_VARYING_VECTORS),b=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),S=n.getParameter(n.MAX_SAMPLES),T=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:_,maxTextureSize:g,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:y,maxVaryings:E,maxFragmentUniforms:b,maxSamples:S,samples:T}}function MC(n){const t=this;let e=null,i=0,r=!1,s=!1;const o=new xr,a=new Dt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||i!==0||r;return r=u,i=d.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,f){const _=d.clippingPlanes,g=d.clipIntersection,p=d.clipShadows,m=n.get(d);if(!r||_===null||_.length===0||s&&!p)s?h(null):c();else{const y=s?0:i,E=y*4;let b=m.clippingState||null;l.value=b,b=h(_,u,E,f);for(let S=0;S!==E;++S)b[S]=e[S];m.clippingState=b,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(d,u,f,_){const g=d!==null?d.length:0;let p=null;if(g!==0){if(p=l.value,_!==!0||p===null){const m=f+g*4,y=u.matrixWorldInverse;a.getNormalMatrix(y),(p===null||p.length<m)&&(p=new Float32Array(m));for(let E=0,b=f;E!==g;++E,b+=4)o.copy(d[E]).applyMatrix4(y,a),o.normal.toArray(p,b),p[b+3]=o.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,p}}const Qi=4,Cf=[.125,.215,.35,.446,.526,.582],yr=20,TC=256,Xs=new B_,Af=new Jt;let fc=null,pc=0,mc=0,_c=!1;const CC=new V;class Pf{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,i=.1,r=100,s={}){const{size:o=256,position:a=CC}=s;fc=this._renderer.getRenderTarget(),pc=this._renderer.getActiveCubeFace(),mc=this._renderer.getActiveMipmapLevel(),_c=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,i,r,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Df(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Lf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(fc,pc,mc),this._renderer.xr.enabled=_c,t.scissorTest=!1,os(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ir||t.mapping===Ms?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),fc=this._renderer.getRenderTarget(),pc=this._renderer.getActiveCubeFace(),mc=this._renderer.getActiveMipmapLevel(),_c=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:He,minFilter:He,generateMipmaps:!1,type:Ri,format:Hn,colorSpace:Ka,depthBuffer:!1},r=Rf(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Rf(t,e,i);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=AC(s)),this._blurMaterial=RC(s,t,e),this._ggxMaterial=PC(s,t,e)}return r}_compileMaterial(t){const e=new ci(new Ii,t);this._renderer.compile(e,Xs)}_sceneToCubeUV(t,e,i,r,s){const l=new In(90,1,e,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(Af),d.toneMapping=ni,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(r),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ci(new Fo,new Ou({name:"PMREM.Background",side:hn,depthWrite:!1,depthTest:!1})));const g=this._backgroundBox,p=g.material;let m=!1;const y=t.background;y?y.isColor&&(p.color.copy(y),t.background=null,m=!0):(p.color.copy(Af),m=!0);for(let E=0;E<6;E++){const b=E%3;b===0?(l.up.set(0,c[E],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+h[E],s.y,s.z)):b===1?(l.up.set(0,0,c[E]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+h[E],s.z)):(l.up.set(0,c[E],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+h[E]));const S=this._cubeSize;os(r,b*S,E>2?S:0,S,S),d.setRenderTarget(r),m&&d.render(g,l),d.render(t,l)}d.toneMapping=f,d.autoClear=u,t.background=y}_textureToCubeUV(t,e){const i=this._renderer,r=t.mapping===Ir||t.mapping===Ms;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Df()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Lf());const s=r?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=s;const a=s.uniforms;a.envMap.value=t;const l=this._cubeSize;os(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,Xs)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(t,s-1,s);e.autoClear=i}_applyGGXFilter(t,e,i){const r=this._renderer,s=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;const l=o.uniforms,c=i/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),d=Math.sqrt(c*c-h*h),u=0+c*1.25,f=d*u,{_lodMax:_}=this,g=this._sizeLods[i],p=3*g*(i>_-Qi?i-_+Qi:0),m=4*(this._cubeSize-g);l.envMap.value=t.texture,l.roughness.value=f,l.mipInt.value=_-e,os(s,p,m,3*g,2*g),r.setRenderTarget(s),r.render(a,Xs),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=_-i,os(t,p,m,3*g,2*g),r.setRenderTarget(t),r.render(a,Xs)}_blur(t,e,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,r,"latitudinal",s),this._halfBlur(o,t,i,i,r,"longitudinal",s)}_halfBlur(t,e,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&Xt("blur direction must be either latitudinal or longitudinal!");const h=3,d=this._lodMeshes[r];d.material=c;const u=c.uniforms,f=this._sizeLods[i]-1,_=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*yr-1),g=s/_,p=isFinite(s)?1+Math.floor(h*g):yr;p>yr&&Pt(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${yr}`);const m=[];let y=0;for(let C=0;C<yr;++C){const v=C/g,M=Math.exp(-v*v/2);m.push(M),C===0?y+=M:C<p&&(y+=2*M)}for(let C=0;C<m.length;C++)m[C]=m[C]/y;u.envMap.value=t.texture,u.samples.value=p,u.weights.value=m,u.latitudinal.value=o==="latitudinal",a&&(u.poleAxis.value=a);const{_lodMax:E}=this;u.dTheta.value=_,u.mipInt.value=E-i;const b=this._sizeLods[r],S=3*b*(r>E-Qi?r-E+Qi:0),T=4*(this._cubeSize-b);os(e,S,T,3*b,2*b),l.setRenderTarget(e),l.render(d,Xs)}}function AC(n){const t=[],e=[],i=[];let r=n;const s=n-Qi+1+Cf.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);t.push(a);let l=1/a;o>n-Qi?l=Cf[o-n+Qi-1]:o===0&&(l=0),e.push(l);const c=1/(a-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],f=6,_=6,g=3,p=2,m=1,y=new Float32Array(g*_*f),E=new Float32Array(p*_*f),b=new Float32Array(m*_*f);for(let T=0;T<f;T++){const C=T%3*2/3-1,v=T>2?0:-1,M=[C,v,0,C+2/3,v,0,C+2/3,v+1,0,C,v,0,C+2/3,v+1,0,C,v+1,0];y.set(M,g*_*T),E.set(u,p*_*T);const P=[T,T,T,T,T,T];b.set(P,m*_*T)}const S=new Ii;S.setAttribute("position",new ri(y,g)),S.setAttribute("uv",new ri(E,p)),S.setAttribute("faceIndex",new ri(b,m)),i.push(new ci(S,null)),r>Qi&&r--}return{lodMeshes:i,sizeLods:t,sigmas:e}}function Rf(n,t,e){const i=new ii(n,t,e);return i.texture.mapping=dl,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function os(n,t,e,i,r){n.viewport.set(t,e,i,r),n.scissor.set(t,e,i,r)}function PC(n,t,e){return new hi({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:TC,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:pl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Si,depthTest:!1,depthWrite:!1})}function RC(n,t,e){const i=new Float32Array(yr),r=new V(0,1,0);return new hi({name:"SphericalGaussianBlur",defines:{n:yr,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:pl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Si,depthTest:!1,depthWrite:!1})}function Lf(){return new hi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:pl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Si,depthTest:!1,depthWrite:!1})}function Df(){return new hi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:pl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Si,depthTest:!1,depthWrite:!1})}function pl(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class G_ extends ii{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},r=[i,i,i,i,i,i];this.texture=new N_(r),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Fo(5,5,5),s=new hi({name:"CubemapFromEquirect",uniforms:Cs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:hn,blending:Si});s.uniforms.tEquirect.value=e;const o=new ci(r,s),a=e.minFilter;return e.minFilter===Sr&&(e.minFilter=He),new OE(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,i=!0,r=!0){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,r);t.setRenderTarget(s)}}function LC(n){let t=new WeakMap,e=new WeakMap,i=null;function r(u,f=!1){return u==null?null:f?o(u):s(u)}function s(u){if(u&&u.isTexture){const f=u.mapping;if(f===zl||f===Hl)if(t.has(u)){const _=t.get(u).texture;return a(_,u.mapping)}else{const _=u.image;if(_&&_.height>0){const g=new G_(_.height);return g.fromEquirectangularTexture(n,u),t.set(u,g),u.addEventListener("dispose",c),a(g.texture,u.mapping)}else return null}}return u}function o(u){if(u&&u.isTexture){const f=u.mapping,_=f===zl||f===Hl,g=f===Ir||f===Ms;if(_||g){let p=e.get(u);const m=p!==void 0?p.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==m)return i===null&&(i=new Pf(n)),p=_?i.fromEquirectangular(u,p):i.fromCubemap(u,p),p.texture.pmremVersion=u.pmremVersion,e.set(u,p),p.texture;if(p!==void 0)return p.texture;{const y=u.image;return _&&y&&y.height>0||g&&y&&l(y)?(i===null&&(i=new Pf(n)),p=_?i.fromEquirectangular(u):i.fromCubemap(u),p.texture.pmremVersion=u.pmremVersion,e.set(u,p),u.addEventListener("dispose",h),p.texture):null}}}return u}function a(u,f){return f===zl?u.mapping=Ir:f===Hl&&(u.mapping=Ms),u}function l(u){let f=0;const _=6;for(let g=0;g<_;g++)u[g]!==void 0&&f++;return f===_}function c(u){const f=u.target;f.removeEventListener("dispose",c);const _=t.get(f);_!==void 0&&(t.delete(f),_.dispose())}function h(u){const f=u.target;f.removeEventListener("dispose",h);const _=e.get(f);_!==void 0&&(e.delete(f),_.dispose())}function d(){t=new WeakMap,e=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:d}}function DC(n){const t={};function e(i){if(t[i]!==void 0)return t[i];const r=n.getExtension(i);return t[i]=r,r}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const r=e(i);return r===null&&_s("WebGLRenderer: "+i+" extension not supported."),r}}}function IC(n,t,e,i){const r={},s=new WeakMap;function o(d){const u=d.target;u.index!==null&&t.remove(u.index);for(const _ in u.attributes)t.remove(u.attributes[_]);u.removeEventListener("dispose",o),delete r[u.id];const f=s.get(u);f&&(t.remove(f),s.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(d,u){return r[u.id]===!0||(u.addEventListener("dispose",o),r[u.id]=!0,e.memory.geometries++),u}function l(d){const u=d.attributes;for(const f in u)t.update(u[f],n.ARRAY_BUFFER)}function c(d){const u=[],f=d.index,_=d.attributes.position;let g=0;if(_===void 0)return;if(f!==null){const y=f.array;g=f.version;for(let E=0,b=y.length;E<b;E+=3){const S=y[E+0],T=y[E+1],C=y[E+2];u.push(S,T,T,C,C,S)}}else{const y=_.array;g=_.version;for(let E=0,b=y.length/3-1;E<b;E+=3){const S=E+0,T=E+1,C=E+2;u.push(S,T,T,C,C,S)}}const p=new(_.count>=65535?I_:D_)(u,1);p.version=g;const m=s.get(d);m&&t.remove(m),s.set(d,p)}function h(d){const u=s.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return s.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function UC(n,t,e){let i;function r(d){i=d}let s,o;function a(d){s=d.type,o=d.bytesPerElement}function l(d,u){n.drawElements(i,u,s,d*o),e.update(u,i,1)}function c(d,u,f){f!==0&&(n.drawElementsInstanced(i,u,s,d*o,f),e.update(u,i,f))}function h(d,u,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,s,d,0,f);let g=0;for(let p=0;p<f;p++)g+=u[p];e.update(g,i,1)}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function NC(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=a*(s/3);break;case n.LINES:e.lines+=a*(s/2);break;case n.LINE_STRIP:e.lines+=a*(s-1);break;case n.LINE_LOOP:e.lines+=a*s;break;case n.POINTS:e.points+=a*s;break;default:Xt("WebGLInfo: Unknown draw mode:",o);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:r,update:i}}function OC(n,t,e){const i=new WeakMap,r=new be;function s(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0;let u=i.get(a);if(u===void 0||u.count!==d){let P=function(){v.dispose(),i.delete(a),a.removeEventListener("dispose",P)};var f=P;u!==void 0&&u.texture.dispose();const _=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,p=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],y=a.morphAttributes.normal||[],E=a.morphAttributes.color||[];let b=0;_===!0&&(b=1),g===!0&&(b=2),p===!0&&(b=3);let S=a.attributes.position.count*b,T=1;S>t.maxTextureSize&&(T=Math.ceil(S/t.maxTextureSize),S=t.maxTextureSize);const C=new Float32Array(S*T*4*d),v=new P_(C,S,T,d);v.type=ti,v.needsUpdate=!0;const M=b*4;for(let R=0;R<d;R++){const D=m[R],H=y[R],X=E[R],U=S*T*4*R;for(let G=0;G<D.count;G++){const O=G*M;_===!0&&(r.fromBufferAttribute(D,G),C[U+O+0]=r.x,C[U+O+1]=r.y,C[U+O+2]=r.z,C[U+O+3]=0),g===!0&&(r.fromBufferAttribute(H,G),C[U+O+4]=r.x,C[U+O+5]=r.y,C[U+O+6]=r.z,C[U+O+7]=0),p===!0&&(r.fromBufferAttribute(X,G),C[U+O+8]=r.x,C[U+O+9]=r.y,C[U+O+10]=r.z,C[U+O+11]=X.itemSize===4?r.w:1)}}u={count:d,texture:v,size:new Kt(S,T)},i.set(a,u),a.addEventListener("dispose",P)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let _=0;for(let p=0;p<c.length;p++)_+=c[p];const g=a.morphTargetsRelative?1:1-_;l.getUniforms().setValue(n,"morphTargetBaseInfluence",g),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",u.size)}return{update:s}}function FC(n,t,e,i,r){let s=new WeakMap;function o(c){const h=r.render.frame,d=c.geometry,u=t.get(c,d);if(s.get(u)!==h&&(t.update(u),s.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==h&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==h&&(f.update(),s.set(f,h))}return u}function a(){s=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:o,dispose:a}}const kC={[f_]:"LINEAR_TONE_MAPPING",[p_]:"REINHARD_TONE_MAPPING",[m_]:"CINEON_TONE_MAPPING",[__]:"ACES_FILMIC_TONE_MAPPING",[v_]:"AGX_TONE_MAPPING",[x_]:"NEUTRAL_TONE_MAPPING",[g_]:"CUSTOM_TONE_MAPPING"};function BC(n,t,e,i,r,s){const o=new ii(t,e,{type:n,depthBuffer:r,stencilBuffer:s,samples:i?4:0,depthTexture:r?new Ts(t,e):void 0}),a=new ii(t,e,{type:Ri,depthBuffer:!1,stencilBuffer:!1}),l=new Ii;l.setAttribute("position",new Mi([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new Mi([0,2,0,0,2,0],2));const c=new PE({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),h=new ci(l,c),d=new B_(-1,1,1,-1,0,1);let u=null,f=null,_=!1,g,p=null,m=[],y=!1;this.setSize=function(E,b){o.setSize(E,b),a.setSize(E,b);for(let S=0;S<m.length;S++){const T=m[S];T.setSize&&T.setSize(E,b)}},this.setEffects=function(E){m=E,y=m.length>0&&m[0].isRenderPass===!0;const b=o.width,S=o.height;for(let T=0;T<m.length;T++){const C=m[T];C.setSize&&C.setSize(b,S)}},this.begin=function(E,b){if(_||E.toneMapping===ni&&m.length===0)return!1;if(p=b,b!==null){const S=b.width,T=b.height;(o.width!==S||o.height!==T)&&this.setSize(S,T)}return y===!1&&E.setRenderTarget(o),g=E.toneMapping,E.toneMapping=ni,!0},this.hasRenderPass=function(){return y},this.end=function(E,b){E.toneMapping=g,_=!0;let S=o,T=a;for(let C=0;C<m.length;C++){const v=m[C];if(v.enabled!==!1&&(v.render(E,T,S,b),v.needsSwap!==!1)){const M=S;S=T,T=M}}if(u!==E.outputColorSpace||f!==E.toneMapping){u=E.outputColorSpace,f=E.toneMapping,c.defines={},zt.getTransfer(u)===te&&(c.defines.SRGB_TRANSFER="");const C=kC[f];C&&(c.defines[C]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=S.texture,E.setRenderTarget(p),E.render(h,d),p=null,_=!1},this.isCompositing=function(){return _},this.dispose=function(){o.depthTexture&&o.depthTexture.dispose(),o.dispose(),a.dispose(),l.dispose(),c.dispose()}}const W_=new Ke,Rh=new Ts(1,1),X_=new P_,q_=new sE,Y_=new N_,If=[],Uf=[],Nf=new Float32Array(16),Of=new Float32Array(9),Ff=new Float32Array(4);function Us(n,t,e){const i=n[0];if(i<=0||i>0)return n;const r=t*e;let s=If[r];if(s===void 0&&(s=new Float32Array(r),If[r]=s),t!==0){i.toArray(s,0);for(let o=1,a=0;o!==t;++o)a+=e,n[o].toArray(s,a)}return s}function Ne(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Oe(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function ml(n,t){let e=Uf[t];e===void 0&&(e=new Int32Array(t),Uf[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function VC(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function zC(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ne(e,t))return;n.uniform2fv(this.addr,t),Oe(e,t)}}function HC(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ne(e,t))return;n.uniform3fv(this.addr,t),Oe(e,t)}}function GC(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ne(e,t))return;n.uniform4fv(this.addr,t),Oe(e,t)}}function WC(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ne(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Oe(e,t)}else{if(Ne(e,i))return;Ff.set(i),n.uniformMatrix2fv(this.addr,!1,Ff),Oe(e,i)}}function XC(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ne(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Oe(e,t)}else{if(Ne(e,i))return;Of.set(i),n.uniformMatrix3fv(this.addr,!1,Of),Oe(e,i)}}function qC(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ne(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Oe(e,t)}else{if(Ne(e,i))return;Nf.set(i),n.uniformMatrix4fv(this.addr,!1,Nf),Oe(e,i)}}function YC(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function $C(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ne(e,t))return;n.uniform2iv(this.addr,t),Oe(e,t)}}function KC(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ne(e,t))return;n.uniform3iv(this.addr,t),Oe(e,t)}}function ZC(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ne(e,t))return;n.uniform4iv(this.addr,t),Oe(e,t)}}function JC(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function jC(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ne(e,t))return;n.uniform2uiv(this.addr,t),Oe(e,t)}}function QC(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ne(e,t))return;n.uniform3uiv(this.addr,t),Oe(e,t)}}function t1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ne(e,t))return;n.uniform4uiv(this.addr,t),Oe(e,t)}}function e1(n,t,e){const i=this.cache,r=e.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(Rh.compareFunction=e.isReversedDepthBuffer()?Du:Lu,s=Rh):s=W_,e.setTexture2D(t||s,r)}function n1(n,t,e){const i=this.cache,r=e.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),e.setTexture3D(t||q_,r)}function i1(n,t,e){const i=this.cache,r=e.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),e.setTextureCube(t||Y_,r)}function r1(n,t,e){const i=this.cache,r=e.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),e.setTexture2DArray(t||X_,r)}function s1(n){switch(n){case 5126:return VC;case 35664:return zC;case 35665:return HC;case 35666:return GC;case 35674:return WC;case 35675:return XC;case 35676:return qC;case 5124:case 35670:return YC;case 35667:case 35671:return $C;case 35668:case 35672:return KC;case 35669:case 35673:return ZC;case 5125:return JC;case 36294:return jC;case 36295:return QC;case 36296:return t1;case 35678:case 36198:case 36298:case 36306:case 35682:return e1;case 35679:case 36299:case 36307:return n1;case 35680:case 36300:case 36308:case 36293:return i1;case 36289:case 36303:case 36311:case 36292:return r1}}function o1(n,t){n.uniform1fv(this.addr,t)}function a1(n,t){const e=Us(t,this.size,2);n.uniform2fv(this.addr,e)}function l1(n,t){const e=Us(t,this.size,3);n.uniform3fv(this.addr,e)}function c1(n,t){const e=Us(t,this.size,4);n.uniform4fv(this.addr,e)}function h1(n,t){const e=Us(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function u1(n,t){const e=Us(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function d1(n,t){const e=Us(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function f1(n,t){n.uniform1iv(this.addr,t)}function p1(n,t){n.uniform2iv(this.addr,t)}function m1(n,t){n.uniform3iv(this.addr,t)}function _1(n,t){n.uniform4iv(this.addr,t)}function g1(n,t){n.uniform1uiv(this.addr,t)}function v1(n,t){n.uniform2uiv(this.addr,t)}function x1(n,t){n.uniform3uiv(this.addr,t)}function b1(n,t){n.uniform4uiv(this.addr,t)}function y1(n,t,e){const i=this.cache,r=t.length,s=ml(e,r);Ne(i,s)||(n.uniform1iv(this.addr,s),Oe(i,s));let o;this.type===n.SAMPLER_2D_SHADOW?o=Rh:o=W_;for(let a=0;a!==r;++a)e.setTexture2D(t[a]||o,s[a])}function w1(n,t,e){const i=this.cache,r=t.length,s=ml(e,r);Ne(i,s)||(n.uniform1iv(this.addr,s),Oe(i,s));for(let o=0;o!==r;++o)e.setTexture3D(t[o]||q_,s[o])}function S1(n,t,e){const i=this.cache,r=t.length,s=ml(e,r);Ne(i,s)||(n.uniform1iv(this.addr,s),Oe(i,s));for(let o=0;o!==r;++o)e.setTextureCube(t[o]||Y_,s[o])}function E1(n,t,e){const i=this.cache,r=t.length,s=ml(e,r);Ne(i,s)||(n.uniform1iv(this.addr,s),Oe(i,s));for(let o=0;o!==r;++o)e.setTexture2DArray(t[o]||X_,s[o])}function M1(n){switch(n){case 5126:return o1;case 35664:return a1;case 35665:return l1;case 35666:return c1;case 35674:return h1;case 35675:return u1;case 35676:return d1;case 5124:case 35670:return f1;case 35667:case 35671:return p1;case 35668:case 35672:return m1;case 35669:case 35673:return _1;case 5125:return g1;case 36294:return v1;case 36295:return x1;case 36296:return b1;case 35678:case 36198:case 36298:case 36306:case 35682:return y1;case 35679:case 36299:case 36307:return w1;case 35680:case 36300:case 36308:case 36293:return S1;case 36289:case 36303:case 36311:case 36292:return E1}}class T1{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=s1(e.type)}}class C1{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=M1(e.type)}}class A1{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(t,e[a.id],i)}}}const gc=/(\w+)(\])?(\[|\.)?/g;function kf(n,t){n.seq.push(t),n.map[t.id]=t}function P1(n,t,e){const i=n.name,r=i.length;for(gc.lastIndex=0;;){const s=gc.exec(i),o=gc.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){kf(e,c===void 0?new T1(a,n,t):new C1(a,n,t));break}else{let d=e.map[a];d===void 0&&(d=new A1(a),kf(e,d)),e=d}}}class La{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const a=t.getActiveUniform(e,o),l=t.getUniformLocation(e,a.name);P1(a,l,this)}const r=[],s=[];for(const o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?r.push(o):s.push(o);r.length>0&&(this.seq=r.concat(s))}setValue(t,e,i,r){const s=this.map[e];s!==void 0&&s.setValue(t,i,r)}setOptional(t,e,i){const r=e[i];r!==void 0&&this.setValue(t,i,r)}static upload(t,e,i,r){for(let s=0,o=e.length;s!==o;++s){const a=e[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,r)}}static seqWithValue(t,e){const i=[];for(let r=0,s=t.length;r!==s;++r){const o=t[r];o.id in e&&i.push(o)}return i}}function Bf(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const R1=37297;let L1=0;function D1(n,t){const e=n.split(`
`),i=[],r=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return i.join(`
`)}const Vf=new Dt;function I1(n){zt._getMatrix(Vf,zt.workingColorSpace,n);const t=`mat3( ${Vf.elements.map(e=>e.toFixed(4))} )`;switch(zt.getTransfer(n)){case Za:return[t,"LinearTransferOETF"];case te:return[t,"sRGBTransferOETF"];default:return Pt("WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function zf(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),s=(n.getShaderInfoLog(t)||"").trim();if(i&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+s+`

`+D1(n.getShaderSource(t),a)}else return s}function U1(n,t){const e=I1(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}const N1={[f_]:"Linear",[p_]:"Reinhard",[m_]:"Cineon",[__]:"ACESFilmic",[v_]:"AgX",[x_]:"Neutral",[g_]:"Custom"};function O1(n,t){const e=N1[t];return e===void 0?(Pt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const va=new V;function F1(){zt.getLuminanceCoefficients(va);const n=va.x.toFixed(4),t=va.y.toFixed(4),e=va.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function k1(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Zs).join(`
`)}function B1(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function V1(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(t,r),o=s.name;let a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),e[o]={type:s.type,location:n.getAttribLocation(t,o),locationSize:a}}return e}function Zs(n){return n!==""}function Hf(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Gf(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const z1=/^[ \t]*#include +<([\w\d./]+)>/gm;function Lh(n){return n.replace(z1,G1)}const H1=new Map;function G1(n,t){let e=Nt[t];if(e===void 0){const i=H1.get(t);if(i!==void 0)e=Nt[i],Pt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Lh(e)}const W1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Wf(n){return n.replace(W1,X1)}function X1(n,t,e,i){let r="";for(let s=parseInt(t);s<parseInt(e);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Xf(n){let t=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}const q1={[Ta]:"SHADOWMAP_TYPE_PCF",[Ks]:"SHADOWMAP_TYPE_VSM"};function Y1(n){return q1[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const $1={[Ir]:"ENVMAP_TYPE_CUBE",[Ms]:"ENVMAP_TYPE_CUBE",[dl]:"ENVMAP_TYPE_CUBE_UV"};function K1(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":$1[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const Z1={[Ms]:"ENVMAP_MODE_REFRACTION"};function J1(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":Z1[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const j1={[d_]:"ENVMAP_BLENDING_MULTIPLY",[wS]:"ENVMAP_BLENDING_MIX",[SS]:"ENVMAP_BLENDING_ADD"};function Q1(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":j1[n.combine]||"ENVMAP_BLENDING_NONE"}function tA(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function eA(n,t,e,i){const r=n.getContext(),s=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=Y1(e),c=K1(e),h=J1(e),d=Q1(e),u=tA(e),f=k1(e),_=B1(s),g=r.createProgram();let p,m,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Zs).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Zs).join(`
`),m.length>0&&(m+=`
`)):(p=[Xf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Zs).join(`
`),m=[Xf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ni?"#define TONE_MAPPING":"",e.toneMapping!==ni?Nt.tonemapping_pars_fragment:"",e.toneMapping!==ni?O1("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Nt.colorspace_pars_fragment,U1("linearToOutputTexel",e.outputColorSpace),F1(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Zs).join(`
`)),o=Lh(o),o=Hf(o,e),o=Gf(o,e),a=Lh(a),a=Hf(a,e),a=Gf(a,e),o=Wf(o),a=Wf(a),e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",e.glslVersion===rf?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===rf?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const E=y+p+o,b=y+m+a,S=Bf(r,r.VERTEX_SHADER,E),T=Bf(r,r.FRAGMENT_SHADER,b);r.attachShader(g,S),r.attachShader(g,T),e.index0AttributeName!==void 0?r.bindAttribLocation(g,0,e.index0AttributeName):e.hasPositionAttribute===!0&&r.bindAttribLocation(g,0,"position"),r.linkProgram(g);function C(R){if(n.debug.checkShaderErrors){const D=r.getProgramInfoLog(g)||"",H=r.getShaderInfoLog(S)||"",X=r.getShaderInfoLog(T)||"",U=D.trim(),G=H.trim(),O=X.trim();let $=!0,Q=!0;if(r.getProgramParameter(g,r.LINK_STATUS)===!1)if($=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,g,S,T);else{const it=zf(r,S,"vertex"),et=zf(r,T,"fragment");Xt("WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(g,r.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+U+`
`+it+`
`+et)}else U!==""?Pt("WebGLProgram: Program Info Log:",U):(G===""||O==="")&&(Q=!1);Q&&(R.diagnostics={runnable:$,programLog:U,vertexShader:{log:G,prefix:p},fragmentShader:{log:O,prefix:m}})}r.deleteShader(S),r.deleteShader(T),v=new La(r,g),M=V1(r,g)}let v;this.getUniforms=function(){return v===void 0&&C(this),v};let M;this.getAttributes=function(){return M===void 0&&C(this),M};let P=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=r.getProgramParameter(g,R1)),P},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(g),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=L1++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=S,this.fragmentShader=T,this}let nA=0;class iA{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,i){const r=this._getShaderCacheForMaterial(t);return r.has(e)===!1&&(r.add(e),e.usedTimes++),r.has(i)===!1&&(r.add(i),i.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new rA(t),e.set(t,i)),i}}class rA{constructor(t){this.id=nA++,this.code=t,this.usedTimes=0}}function sA(n){return n===Ur||n===Ya||n===$a}function oA(n,t,e,i,r,s){const o=new R_,a=new iA,l=new Set,c=[],h=new Map,d=i.logarithmicDepthBuffer;let u=i.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(v){return l.add(v),v===0?"uv":`uv${v}`}function g(v,M,P,R,D,H){const X=R.fog,U=D.geometry,G=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?R.environment:null,O=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,$=t.get(v.envMap||G,O),Q=$&&$.mapping===dl?$.image.height:null,it=f[v.type];v.precision!==null&&(u=i.getMaxPrecision(v.precision),u!==v.precision&&Pt("WebGLProgram.getParameters:",v.precision,"not supported, using",u,"instead."));const et=U.morphAttributes.position||U.morphAttributes.normal||U.morphAttributes.color,dt=et!==void 0?et.length:0;let Rt=0;U.morphAttributes.position!==void 0&&(Rt=1),U.morphAttributes.normal!==void 0&&(Rt=2),U.morphAttributes.color!==void 0&&(Rt=3);let kt,Lt,Z,rt;if(it){const vt=Zn[it];kt=vt.vertexShader,Lt=vt.fragmentShader}else{kt=v.vertexShader,Lt=v.fragmentShader;const vt=a.getVertexShaderStage(v),ge=a.getFragmentShaderStage(v);a.update(v,vt,ge),Z=vt.id,rt=ge.id}const tt=n.getRenderTarget(),At=n.state.buffers.depth.getReversed(),St=D.isInstancedMesh===!0,Tt=D.isBatchedMesh===!0,we=!!v.map,Bt=!!v.matcap,ne=!!$,$t=!!v.aoMap,Gt=!!v.lightMap,Ce=!!v.bumpMap&&v.wireframe===!1,De=!!v.normalMap,Fe=!!v.displacementMap,Ve=!!v.emissiveMap,_e=!!v.metalnessMap,Ae=!!v.roughnessMap,I=v.anisotropy>0,en=v.clearcoat>0,Qt=v.dispersion>0,A=v.iridescence>0,x=v.sheen>0,F=v.transmission>0,z=I&&!!v.anisotropyMap,q=en&&!!v.clearcoatMap,nt=en&&!!v.clearcoatNormalMap,ot=en&&!!v.clearcoatRoughnessMap,Y=A&&!!v.iridescenceMap,J=A&&!!v.iridescenceThicknessMap,at=x&&!!v.sheenColorMap,yt=x&&!!v.sheenRoughnessMap,ht=!!v.specularMap,lt=!!v.specularColorMap,Mt=!!v.specularIntensityMap,Ct=F&&!!v.transmissionMap,It=F&&!!v.thicknessMap,L=!!v.gradientMap,st=!!v.alphaMap,K=v.alphaTest>0,ct=!!v.alphaHash,mt=!!v.extensions;let j=ni;v.toneMapped&&(tt===null||tt.isXRRenderTarget===!0)&&(j=n.toneMapping);const bt={shaderID:it,shaderType:v.type,shaderName:v.name,vertexShader:kt,fragmentShader:Lt,defines:v.defines,customVertexShaderID:Z,customFragmentShaderID:rt,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:u,batching:Tt,batchingColor:Tt&&D._colorsTexture!==null,instancing:St,instancingColor:St&&D.instanceColor!==null,instancingMorph:St&&D.morphTexture!==null,outputColorSpace:tt===null?n.outputColorSpace:tt.isXRRenderTarget===!0?tt.texture.colorSpace:zt.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:we,matcap:Bt,envMap:ne,envMapMode:ne&&$.mapping,envMapCubeUVHeight:Q,aoMap:$t,lightMap:Gt,bumpMap:Ce,normalMap:De,displacementMap:Fe,emissiveMap:Ve,normalMapObjectSpace:De&&v.normalMapType===TS,normalMapTangentSpace:De&&v.normalMapType===tf,packedNormalMap:De&&v.normalMapType===tf&&sA(v.normalMap.format),metalnessMap:_e,roughnessMap:Ae,anisotropy:I,anisotropyMap:z,clearcoat:en,clearcoatMap:q,clearcoatNormalMap:nt,clearcoatRoughnessMap:ot,dispersion:Qt,iridescence:A,iridescenceMap:Y,iridescenceThicknessMap:J,sheen:x,sheenColorMap:at,sheenRoughnessMap:yt,specularMap:ht,specularColorMap:lt,specularIntensityMap:Mt,transmission:F,transmissionMap:Ct,thicknessMap:It,gradientMap:L,opaque:v.transparent===!1&&v.blending===ms&&v.alphaToCoverage===!1,alphaMap:st,alphaTest:K,alphaHash:ct,combine:v.combine,mapUv:we&&_(v.map.channel),aoMapUv:$t&&_(v.aoMap.channel),lightMapUv:Gt&&_(v.lightMap.channel),bumpMapUv:Ce&&_(v.bumpMap.channel),normalMapUv:De&&_(v.normalMap.channel),displacementMapUv:Fe&&_(v.displacementMap.channel),emissiveMapUv:Ve&&_(v.emissiveMap.channel),metalnessMapUv:_e&&_(v.metalnessMap.channel),roughnessMapUv:Ae&&_(v.roughnessMap.channel),anisotropyMapUv:z&&_(v.anisotropyMap.channel),clearcoatMapUv:q&&_(v.clearcoatMap.channel),clearcoatNormalMapUv:nt&&_(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ot&&_(v.clearcoatRoughnessMap.channel),iridescenceMapUv:Y&&_(v.iridescenceMap.channel),iridescenceThicknessMapUv:J&&_(v.iridescenceThicknessMap.channel),sheenColorMapUv:at&&_(v.sheenColorMap.channel),sheenRoughnessMapUv:yt&&_(v.sheenRoughnessMap.channel),specularMapUv:ht&&_(v.specularMap.channel),specularColorMapUv:lt&&_(v.specularColorMap.channel),specularIntensityMapUv:Mt&&_(v.specularIntensityMap.channel),transmissionMapUv:Ct&&_(v.transmissionMap.channel),thicknessMapUv:It&&_(v.thicknessMap.channel),alphaMapUv:st&&_(v.alphaMap.channel),vertexTangents:!!U.attributes.tangent&&(De||I),vertexNormals:!!U.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!U.attributes.color&&U.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!U.attributes.uv&&(we||st),fog:!!X,useFog:v.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||U.attributes.normal===void 0&&De===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:At,skinning:D.isSkinnedMesh===!0,hasPositionAttribute:U.attributes.position!==void 0,morphTargets:U.morphAttributes.position!==void 0,morphNormals:U.morphAttributes.normal!==void 0,morphColors:U.morphAttributes.color!==void 0,morphTargetsCount:dt,morphTextureStride:Rt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numLightProbeGrids:H.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:v.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:j,decodeVideoTexture:we&&v.map.isVideoTexture===!0&&zt.getTransfer(v.map.colorSpace)===te,decodeVideoTextureEmissive:Ve&&v.emissiveMap.isVideoTexture===!0&&zt.getTransfer(v.emissiveMap.colorSpace)===te,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===xi,flipSided:v.side===hn,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:mt&&v.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(mt&&v.extensions.multiDraw===!0||Tt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return bt.vertexUv1s=l.has(1),bt.vertexUv2s=l.has(2),bt.vertexUv3s=l.has(3),l.clear(),bt}function p(v){const M=[];if(v.shaderID?M.push(v.shaderID):(M.push(v.customVertexShaderID),M.push(v.customFragmentShaderID)),v.defines!==void 0)for(const P in v.defines)M.push(P),M.push(v.defines[P]);return v.isRawShaderMaterial===!1&&(m(M,v),y(M,v),M.push(n.outputColorSpace)),M.push(v.customProgramCacheKey),M.join()}function m(v,M){v.push(M.precision),v.push(M.outputColorSpace),v.push(M.envMapMode),v.push(M.envMapCubeUVHeight),v.push(M.mapUv),v.push(M.alphaMapUv),v.push(M.lightMapUv),v.push(M.aoMapUv),v.push(M.bumpMapUv),v.push(M.normalMapUv),v.push(M.displacementMapUv),v.push(M.emissiveMapUv),v.push(M.metalnessMapUv),v.push(M.roughnessMapUv),v.push(M.anisotropyMapUv),v.push(M.clearcoatMapUv),v.push(M.clearcoatNormalMapUv),v.push(M.clearcoatRoughnessMapUv),v.push(M.iridescenceMapUv),v.push(M.iridescenceThicknessMapUv),v.push(M.sheenColorMapUv),v.push(M.sheenRoughnessMapUv),v.push(M.specularMapUv),v.push(M.specularColorMapUv),v.push(M.specularIntensityMapUv),v.push(M.transmissionMapUv),v.push(M.thicknessMapUv),v.push(M.combine),v.push(M.fogExp2),v.push(M.sizeAttenuation),v.push(M.morphTargetsCount),v.push(M.morphAttributeCount),v.push(M.numDirLights),v.push(M.numPointLights),v.push(M.numSpotLights),v.push(M.numSpotLightMaps),v.push(M.numHemiLights),v.push(M.numRectAreaLights),v.push(M.numDirLightShadows),v.push(M.numPointLightShadows),v.push(M.numSpotLightShadows),v.push(M.numSpotLightShadowsWithMaps),v.push(M.numLightProbes),v.push(M.shadowMapType),v.push(M.toneMapping),v.push(M.numClippingPlanes),v.push(M.numClipIntersection),v.push(M.depthPacking)}function y(v,M){o.disableAll(),M.instancing&&o.enable(0),M.instancingColor&&o.enable(1),M.instancingMorph&&o.enable(2),M.matcap&&o.enable(3),M.envMap&&o.enable(4),M.normalMapObjectSpace&&o.enable(5),M.normalMapTangentSpace&&o.enable(6),M.clearcoat&&o.enable(7),M.iridescence&&o.enable(8),M.alphaTest&&o.enable(9),M.vertexColors&&o.enable(10),M.vertexAlphas&&o.enable(11),M.vertexUv1s&&o.enable(12),M.vertexUv2s&&o.enable(13),M.vertexUv3s&&o.enable(14),M.vertexTangents&&o.enable(15),M.anisotropy&&o.enable(16),M.alphaHash&&o.enable(17),M.batching&&o.enable(18),M.dispersion&&o.enable(19),M.batchingColor&&o.enable(20),M.gradientMap&&o.enable(21),M.packedNormalMap&&o.enable(22),M.vertexNormals&&o.enable(23),v.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reversedDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),M.numLightProbeGrids>0&&o.enable(22),M.hasPositionAttribute&&o.enable(23),v.push(o.mask)}function E(v){const M=f[v.type];let P;if(M){const R=Zn[M];P=TE.clone(R.uniforms)}else P=v.uniforms;return P}function b(v,M){let P=h.get(M);return P!==void 0?++P.usedTimes:(P=new eA(n,M,v,r),c.push(P),h.set(M,P)),P}function S(v){if(--v.usedTimes===0){const M=c.indexOf(v);c[M]=c[c.length-1],c.pop(),h.delete(v.cacheKey),v.destroy()}}function T(v){a.remove(v)}function C(){a.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:E,acquireProgram:b,releaseProgram:S,releaseShaderCache:T,programs:c,dispose:C}}function aA(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function r(o,a,l){n.get(o)[a]=l}function s(){n=new WeakMap}return{has:t,get:e,remove:i,update:r,dispose:s}}function lA(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.materialVariant!==t.materialVariant?n.materialVariant-t.materialVariant:n.z!==t.z?n.z-t.z:n.id-t.id}function qf(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Yf(){const n=[];let t=0;const e=[],i=[],r=[];function s(){t=0,e.length=0,i.length=0,r.length=0}function o(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function a(u,f,_,g,p,m){let y=n[t];return y===void 0?(y={id:u.id,object:u,geometry:f,material:_,materialVariant:o(u),groupOrder:g,renderOrder:u.renderOrder,z:p,group:m},n[t]=y):(y.id=u.id,y.object=u,y.geometry=f,y.material=_,y.materialVariant=o(u),y.groupOrder=g,y.renderOrder=u.renderOrder,y.z=p,y.group=m),t++,y}function l(u,f,_,g,p,m){const y=a(u,f,_,g,p,m);_.transmission>0?i.push(y):_.transparent===!0?r.push(y):e.push(y)}function c(u,f,_,g,p,m){const y=a(u,f,_,g,p,m);_.transmission>0?i.unshift(y):_.transparent===!0?r.unshift(y):e.unshift(y)}function h(u,f,_){e.length>1&&e.sort(u||lA),i.length>1&&i.sort(f||qf),r.length>1&&r.sort(f||qf),_&&(e.reverse(),i.reverse(),r.reverse())}function d(){for(let u=t,f=n.length;u<f;u++){const _=n[u];if(_.id===null)break;_.id=null,_.object=null,_.geometry=null,_.material=null,_.group=null}}return{opaque:e,transmissive:i,transparent:r,init:s,push:l,unshift:c,finish:d,sort:h}}function cA(){let n=new WeakMap;function t(i,r){const s=n.get(i);let o;return s===void 0?(o=new Yf,n.set(i,[o])):r>=s.length?(o=new Yf,s.push(o)):o=s[r],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function hA(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new V,color:new Jt};break;case"SpotLight":e={position:new V,direction:new V,color:new Jt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new V,color:new Jt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new V,skyColor:new Jt,groundColor:new Jt};break;case"RectAreaLight":e={color:new Jt,position:new V,halfWidth:new V,halfHeight:new V};break}return n[t.id]=e,e}}}function uA(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Kt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Kt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Kt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let dA=0;function fA(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function pA(n){const t=new hA,e=uA(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new V);const r=new V,s=new Te,o=new Te;function a(c){let h=0,d=0,u=0;for(let M=0;M<9;M++)i.probe[M].set(0,0,0);let f=0,_=0,g=0,p=0,m=0,y=0,E=0,b=0,S=0,T=0,C=0;c.sort(fA);for(let M=0,P=c.length;M<P;M++){const R=c[M],D=R.color,H=R.intensity,X=R.distance;let U=null;if(R.shadow&&R.shadow.map&&(R.shadow.map.texture.format===Ur?U=R.shadow.map.texture:U=R.shadow.map.depthTexture||R.shadow.map.texture),R.isAmbientLight)h+=D.r*H,d+=D.g*H,u+=D.b*H;else if(R.isLightProbe){for(let G=0;G<9;G++)i.probe[G].addScaledVector(R.sh.coefficients[G],H);C++}else if(R.isDirectionalLight){const G=t.get(R);if(G.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const O=R.shadow,$=e.get(R);$.shadowIntensity=O.intensity,$.shadowBias=O.bias,$.shadowNormalBias=O.normalBias,$.shadowRadius=O.radius,$.shadowMapSize=O.mapSize,i.directionalShadow[f]=$,i.directionalShadowMap[f]=U,i.directionalShadowMatrix[f]=R.shadow.matrix,y++}i.directional[f]=G,f++}else if(R.isSpotLight){const G=t.get(R);G.position.setFromMatrixPosition(R.matrixWorld),G.color.copy(D).multiplyScalar(H),G.distance=X,G.coneCos=Math.cos(R.angle),G.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),G.decay=R.decay,i.spot[g]=G;const O=R.shadow;if(R.map&&(i.spotLightMap[S]=R.map,S++,O.updateMatrices(R),R.castShadow&&T++),i.spotLightMatrix[g]=O.matrix,R.castShadow){const $=e.get(R);$.shadowIntensity=O.intensity,$.shadowBias=O.bias,$.shadowNormalBias=O.normalBias,$.shadowRadius=O.radius,$.shadowMapSize=O.mapSize,i.spotShadow[g]=$,i.spotShadowMap[g]=U,b++}g++}else if(R.isRectAreaLight){const G=t.get(R);G.color.copy(D).multiplyScalar(H),G.halfWidth.set(R.width*.5,0,0),G.halfHeight.set(0,R.height*.5,0),i.rectArea[p]=G,p++}else if(R.isPointLight){const G=t.get(R);if(G.color.copy(R.color).multiplyScalar(R.intensity),G.distance=R.distance,G.decay=R.decay,R.castShadow){const O=R.shadow,$=e.get(R);$.shadowIntensity=O.intensity,$.shadowBias=O.bias,$.shadowNormalBias=O.normalBias,$.shadowRadius=O.radius,$.shadowMapSize=O.mapSize,$.shadowCameraNear=O.camera.near,$.shadowCameraFar=O.camera.far,i.pointShadow[_]=$,i.pointShadowMap[_]=U,i.pointShadowMatrix[_]=R.shadow.matrix,E++}i.point[_]=G,_++}else if(R.isHemisphereLight){const G=t.get(R);G.skyColor.copy(R.color).multiplyScalar(H),G.groundColor.copy(R.groundColor).multiplyScalar(H),i.hemi[m]=G,m++}}p>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ut.LTC_FLOAT_1,i.rectAreaLTC2=ut.LTC_FLOAT_2):(i.rectAreaLTC1=ut.LTC_HALF_1,i.rectAreaLTC2=ut.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=d,i.ambient[2]=u;const v=i.hash;(v.directionalLength!==f||v.pointLength!==_||v.spotLength!==g||v.rectAreaLength!==p||v.hemiLength!==m||v.numDirectionalShadows!==y||v.numPointShadows!==E||v.numSpotShadows!==b||v.numSpotMaps!==S||v.numLightProbes!==C)&&(i.directional.length=f,i.spot.length=g,i.rectArea.length=p,i.point.length=_,i.hemi.length=m,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=E,i.pointShadowMap.length=E,i.spotShadow.length=b,i.spotShadowMap.length=b,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=E,i.spotLightMatrix.length=b+S-T,i.spotLightMap.length=S,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=C,v.directionalLength=f,v.pointLength=_,v.spotLength=g,v.rectAreaLength=p,v.hemiLength=m,v.numDirectionalShadows=y,v.numPointShadows=E,v.numSpotShadows=b,v.numSpotMaps=S,v.numLightProbes=C,i.version=dA++)}function l(c,h){let d=0,u=0,f=0,_=0,g=0;const p=h.matrixWorldInverse;for(let m=0,y=c.length;m<y;m++){const E=c[m];if(E.isDirectionalLight){const b=i.directional[d];b.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),b.direction.sub(r),b.direction.transformDirection(p),d++}else if(E.isSpotLight){const b=i.spot[f];b.position.setFromMatrixPosition(E.matrixWorld),b.position.applyMatrix4(p),b.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),b.direction.sub(r),b.direction.transformDirection(p),f++}else if(E.isRectAreaLight){const b=i.rectArea[_];b.position.setFromMatrixPosition(E.matrixWorld),b.position.applyMatrix4(p),o.identity(),s.copy(E.matrixWorld),s.premultiply(p),o.extractRotation(s),b.halfWidth.set(E.width*.5,0,0),b.halfHeight.set(0,E.height*.5,0),b.halfWidth.applyMatrix4(o),b.halfHeight.applyMatrix4(o),_++}else if(E.isPointLight){const b=i.point[u];b.position.setFromMatrixPosition(E.matrixWorld),b.position.applyMatrix4(p),u++}else if(E.isHemisphereLight){const b=i.hemi[g];b.direction.setFromMatrixPosition(E.matrixWorld),b.direction.transformDirection(p),g++}}}return{setup:a,setupView:l,state:i}}function $f(n){const t=new pA(n),e=[],i=[],r=[];function s(u){d.camera=u,e.length=0,i.length=0,r.length=0}function o(u){e.push(u)}function a(u){i.push(u)}function l(u){r.push(u)}function c(){t.setup(e)}function h(u){t.setupView(e,u)}const d={lightsArray:e,shadowsArray:i,lightProbeGridArray:r,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:d,setupLights:c,setupLightsView:h,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function mA(n){let t=new WeakMap;function e(r,s=0){const o=t.get(r);let a;return o===void 0?(a=new $f(n),t.set(r,[a])):s>=o.length?(a=new $f(n),o.push(a)):a=o[s],a}function i(){t=new WeakMap}return{get:e,dispose:i}}const _A=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,gA=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,vA=[new V(1,0,0),new V(-1,0,0),new V(0,1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1)],xA=[new V(0,-1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1),new V(0,-1,0),new V(0,-1,0)],Kf=new Te,qs=new V,vc=new V;function bA(n,t,e){let i=new U_;const r=new Kt,s=new Kt,o=new be,a=new RE,l=new LE,c={},h=e.maxTextureSize,d={[ar]:hn,[hn]:ar,[xi]:xi},u=new hi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Kt},radius:{value:4}},vertexShader:_A,fragmentShader:gA}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const _=new Ii;_.setAttribute("position",new ri(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new ci(_,u),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ta;let m=this.type;this.render=function(T,C,v){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||T.length===0)return;this.type===iS&&(Pt("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Ta);const M=n.getRenderTarget(),P=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),D=n.state;D.setBlending(Si),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);const H=m!==this.type;H&&C.traverse(function(X){X.material&&(Array.isArray(X.material)?X.material.forEach(U=>U.needsUpdate=!0):X.material.needsUpdate=!0)});for(let X=0,U=T.length;X<U;X++){const G=T[X],O=G.shadow;if(O===void 0){Pt("WebGLShadowMap:",G,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;r.copy(O.mapSize);const $=O.getFrameExtents();r.multiply($),s.copy(O.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/$.x),r.x=s.x*$.x,O.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/$.y),r.y=s.y*$.y,O.mapSize.y=s.y));const Q=n.state.buffers.depth.getReversed();if(O.camera._reversedDepth=Q,O.map===null||H===!0){if(O.map!==null&&(O.map.depthTexture!==null&&(O.map.depthTexture.dispose(),O.map.depthTexture=null),O.map.dispose()),this.type===Ks){if(G.isPointLight){Pt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}O.map=new ii(r.x,r.y,{format:Ur,type:Ri,minFilter:He,magFilter:He,generateMipmaps:!1}),O.map.texture.name=G.name+".shadowMap",O.map.depthTexture=new Ts(r.x,r.y,ti),O.map.depthTexture.name=G.name+".shadowMapDepth",O.map.depthTexture.format=Li,O.map.depthTexture.compareFunction=null,O.map.depthTexture.minFilter=ze,O.map.depthTexture.magFilter=ze}else G.isPointLight?(O.map=new G_(r.x),O.map.depthTexture=new EE(r.x,li)):(O.map=new ii(r.x,r.y),O.map.depthTexture=new Ts(r.x,r.y,li)),O.map.depthTexture.name=G.name+".shadowMap",O.map.depthTexture.format=Li,this.type===Ta?(O.map.depthTexture.compareFunction=Q?Du:Lu,O.map.depthTexture.minFilter=He,O.map.depthTexture.magFilter=He):(O.map.depthTexture.compareFunction=null,O.map.depthTexture.minFilter=ze,O.map.depthTexture.magFilter=ze);O.camera.updateProjectionMatrix()}const it=O.map.isWebGLCubeRenderTarget?6:1;for(let et=0;et<it;et++){if(O.map.isWebGLCubeRenderTarget)n.setRenderTarget(O.map,et),n.clear();else{et===0&&(n.setRenderTarget(O.map),n.clear());const dt=O.getViewport(et);o.set(s.x*dt.x,s.y*dt.y,s.x*dt.z,s.y*dt.w),D.viewport(o)}if(G.isPointLight){const dt=O.camera,Rt=O.matrix,kt=G.distance||dt.far;kt!==dt.far&&(dt.far=kt,dt.updateProjectionMatrix()),qs.setFromMatrixPosition(G.matrixWorld),dt.position.copy(qs),vc.copy(dt.position),vc.add(vA[et]),dt.up.copy(xA[et]),dt.lookAt(vc),dt.updateMatrixWorld(),Rt.makeTranslation(-qs.x,-qs.y,-qs.z),Kf.multiplyMatrices(dt.projectionMatrix,dt.matrixWorldInverse),O._frustum.setFromProjectionMatrix(Kf,dt.coordinateSystem,dt.reversedDepth)}else O.updateMatrices(G);i=O.getFrustum(),b(C,v,O.camera,G,this.type)}O.isPointLightShadow!==!0&&this.type===Ks&&y(O,v),O.needsUpdate=!1}m=this.type,p.needsUpdate=!1,n.setRenderTarget(M,P,R)};function y(T,C){const v=t.update(g);u.defines.VSM_SAMPLES!==T.blurSamples&&(u.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new ii(r.x,r.y,{format:Ur,type:Ri})),u.uniforms.shadow_pass.value=T.map.depthTexture,u.uniforms.resolution.value=T.mapSize,u.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(C,null,v,u,g,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(C,null,v,f,g,null)}function E(T,C,v,M){let P=null;const R=v.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(R!==void 0)P=R;else if(P=v.isPointLight===!0?l:a,n.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const D=P.uuid,H=C.uuid;let X=c[D];X===void 0&&(X={},c[D]=X);let U=X[H];U===void 0&&(U=P.clone(),X[H]=U,C.addEventListener("dispose",S)),P=U}if(P.visible=C.visible,P.wireframe=C.wireframe,M===Ks?P.side=C.shadowSide!==null?C.shadowSide:C.side:P.side=C.shadowSide!==null?C.shadowSide:d[C.side],P.alphaMap=C.alphaMap,P.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,P.map=C.map,P.clipShadows=C.clipShadows,P.clippingPlanes=C.clippingPlanes,P.clipIntersection=C.clipIntersection,P.displacementMap=C.displacementMap,P.displacementScale=C.displacementScale,P.displacementBias=C.displacementBias,P.wireframeLinewidth=C.wireframeLinewidth,P.linewidth=C.linewidth,v.isPointLight===!0&&P.isMeshDistanceMaterial===!0){const D=n.properties.get(P);D.light=v}return P}function b(T,C,v,M,P){if(T.visible===!1)return;if(T.layers.test(C.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&P===Ks)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,T.matrixWorld);const H=t.update(T),X=T.material;if(Array.isArray(X)){const U=H.groups;for(let G=0,O=U.length;G<O;G++){const $=U[G],Q=X[$.materialIndex];if(Q&&Q.visible){const it=E(T,Q,M,P);T.onBeforeShadow(n,T,C,v,H,it,$),n.renderBufferDirect(v,null,H,it,T,$),T.onAfterShadow(n,T,C,v,H,it,$)}}}else if(X.visible){const U=E(T,X,M,P);T.onBeforeShadow(n,T,C,v,H,U,null),n.renderBufferDirect(v,null,H,U,T,null),T.onAfterShadow(n,T,C,v,H,U,null)}}const D=T.children;for(let H=0,X=D.length;H<X;H++)b(D[H],C,v,M,P)}function S(T){T.target.removeEventListener("dispose",S);for(const v in c){const M=c[v],P=T.target.uuid;P in M&&(M[P].dispose(),delete M[P])}}}function yA(n,t){function e(){let L=!1;const st=new be;let K=null;const ct=new be(0,0,0,0);return{setMask:function(mt){K!==mt&&!L&&(n.colorMask(mt,mt,mt,mt),K=mt)},setLocked:function(mt){L=mt},setClear:function(mt,j,bt,vt,ge){ge===!0&&(mt*=vt,j*=vt,bt*=vt),st.set(mt,j,bt,vt),ct.equals(st)===!1&&(n.clearColor(mt,j,bt,vt),ct.copy(st))},reset:function(){L=!1,K=null,ct.set(-1,0,0,0)}}}function i(){let L=!1,st=!1,K=null,ct=null,mt=null;return{setReversed:function(j){if(st!==j){const bt=t.get("EXT_clip_control");j?bt.clipControlEXT(bt.LOWER_LEFT_EXT,bt.ZERO_TO_ONE_EXT):bt.clipControlEXT(bt.LOWER_LEFT_EXT,bt.NEGATIVE_ONE_TO_ONE_EXT),st=j;const vt=mt;mt=null,this.setClear(vt)}},getReversed:function(){return st},setTest:function(j){j?tt(n.DEPTH_TEST):At(n.DEPTH_TEST)},setMask:function(j){K!==j&&!L&&(n.depthMask(j),K=j)},setFunc:function(j){if(st&&(j=OS[j]),ct!==j){switch(j){case Xc:n.depthFunc(n.NEVER);break;case qc:n.depthFunc(n.ALWAYS);break;case Yc:n.depthFunc(n.LESS);break;case Es:n.depthFunc(n.LEQUAL);break;case $c:n.depthFunc(n.EQUAL);break;case Kc:n.depthFunc(n.GEQUAL);break;case Zc:n.depthFunc(n.GREATER);break;case Jc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ct=j}},setLocked:function(j){L=j},setClear:function(j){mt!==j&&(mt=j,st&&(j=1-j),n.clearDepth(j))},reset:function(){L=!1,K=null,ct=null,mt=null,st=!1}}}function r(){let L=!1,st=null,K=null,ct=null,mt=null,j=null,bt=null,vt=null,ge=null;return{setTest:function(ae){L||(ae?tt(n.STENCIL_TEST):At(n.STENCIL_TEST))},setMask:function(ae){st!==ae&&!L&&(n.stencilMask(ae),st=ae)},setFunc:function(ae,Wn,Xn){(K!==ae||ct!==Wn||mt!==Xn)&&(n.stencilFunc(ae,Wn,Xn),K=ae,ct=Wn,mt=Xn)},setOp:function(ae,Wn,Xn){(j!==ae||bt!==Wn||vt!==Xn)&&(n.stencilOp(ae,Wn,Xn),j=ae,bt=Wn,vt=Xn)},setLocked:function(ae){L=ae},setClear:function(ae){ge!==ae&&(n.clearStencil(ae),ge=ae)},reset:function(){L=!1,st=null,K=null,ct=null,mt=null,j=null,bt=null,vt=null,ge=null}}}const s=new e,o=new i,a=new r,l=new WeakMap,c=new WeakMap;let h={},d={},u={},f=new WeakMap,_=[],g=null,p=!1,m=null,y=null,E=null,b=null,S=null,T=null,C=null,v=new Jt(0,0,0),M=0,P=!1,R=null,D=null,H=null,X=null,U=null;const G=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let O=!1,$=0;const Q=n.getParameter(n.VERSION);Q.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(Q)[1]),O=$>=1):Q.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]),O=$>=2);let it=null,et={};const dt=n.getParameter(n.SCISSOR_BOX),Rt=n.getParameter(n.VIEWPORT),kt=new be().fromArray(dt),Lt=new be().fromArray(Rt);function Z(L,st,K,ct){const mt=new Uint8Array(4),j=n.createTexture();n.bindTexture(L,j),n.texParameteri(L,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(L,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let bt=0;bt<K;bt++)L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY?n.texImage3D(st,0,n.RGBA,1,1,ct,0,n.RGBA,n.UNSIGNED_BYTE,mt):n.texImage2D(st+bt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,mt);return j}const rt={};rt[n.TEXTURE_2D]=Z(n.TEXTURE_2D,n.TEXTURE_2D,1),rt[n.TEXTURE_CUBE_MAP]=Z(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),rt[n.TEXTURE_2D_ARRAY]=Z(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),rt[n.TEXTURE_3D]=Z(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),tt(n.DEPTH_TEST),o.setFunc(Es),Ce(!1),De(Zd),tt(n.CULL_FACE),$t(Si);function tt(L){h[L]!==!0&&(n.enable(L),h[L]=!0)}function At(L){h[L]!==!1&&(n.disable(L),h[L]=!1)}function St(L,st){return u[L]!==st?(n.bindFramebuffer(L,st),u[L]=st,L===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=st),L===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=st),!0):!1}function Tt(L,st){let K=_,ct=!1;if(L){K=f.get(st),K===void 0&&(K=[],f.set(st,K));const mt=L.textures;if(K.length!==mt.length||K[0]!==n.COLOR_ATTACHMENT0){for(let j=0,bt=mt.length;j<bt;j++)K[j]=n.COLOR_ATTACHMENT0+j;K.length=mt.length,ct=!0}}else K[0]!==n.BACK&&(K[0]=n.BACK,ct=!0);ct&&n.drawBuffers(K)}function we(L){return g!==L?(n.useProgram(L),g=L,!0):!1}const Bt={[br]:n.FUNC_ADD,[sS]:n.FUNC_SUBTRACT,[oS]:n.FUNC_REVERSE_SUBTRACT};Bt[aS]=n.MIN,Bt[lS]=n.MAX;const ne={[cS]:n.ZERO,[hS]:n.ONE,[uS]:n.SRC_COLOR,[Gc]:n.SRC_ALPHA,[gS]:n.SRC_ALPHA_SATURATE,[mS]:n.DST_COLOR,[fS]:n.DST_ALPHA,[dS]:n.ONE_MINUS_SRC_COLOR,[Wc]:n.ONE_MINUS_SRC_ALPHA,[_S]:n.ONE_MINUS_DST_COLOR,[pS]:n.ONE_MINUS_DST_ALPHA,[vS]:n.CONSTANT_COLOR,[xS]:n.ONE_MINUS_CONSTANT_COLOR,[bS]:n.CONSTANT_ALPHA,[yS]:n.ONE_MINUS_CONSTANT_ALPHA};function $t(L,st,K,ct,mt,j,bt,vt,ge,ae){if(L===Si){p===!0&&(At(n.BLEND),p=!1);return}if(p===!1&&(tt(n.BLEND),p=!0),L!==rS){if(L!==m||ae!==P){if((y!==br||S!==br)&&(n.blendEquation(n.FUNC_ADD),y=br,S=br),ae)switch(L){case ms:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Jd:n.blendFunc(n.ONE,n.ONE);break;case jd:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Qd:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Xt("WebGLState: Invalid blending: ",L);break}else switch(L){case ms:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Jd:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case jd:Xt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Qd:Xt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Xt("WebGLState: Invalid blending: ",L);break}E=null,b=null,T=null,C=null,v.set(0,0,0),M=0,m=L,P=ae}return}mt=mt||st,j=j||K,bt=bt||ct,(st!==y||mt!==S)&&(n.blendEquationSeparate(Bt[st],Bt[mt]),y=st,S=mt),(K!==E||ct!==b||j!==T||bt!==C)&&(n.blendFuncSeparate(ne[K],ne[ct],ne[j],ne[bt]),E=K,b=ct,T=j,C=bt),(vt.equals(v)===!1||ge!==M)&&(n.blendColor(vt.r,vt.g,vt.b,ge),v.copy(vt),M=ge),m=L,P=!1}function Gt(L,st){L.side===xi?At(n.CULL_FACE):tt(n.CULL_FACE);let K=L.side===hn;st&&(K=!K),Ce(K),L.blending===ms&&L.transparent===!1?$t(Si):$t(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),o.setFunc(L.depthFunc),o.setTest(L.depthTest),o.setMask(L.depthWrite),s.setMask(L.colorWrite);const ct=L.stencilWrite;a.setTest(ct),ct&&(a.setMask(L.stencilWriteMask),a.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),a.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),Ve(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?tt(n.SAMPLE_ALPHA_TO_COVERAGE):At(n.SAMPLE_ALPHA_TO_COVERAGE)}function Ce(L){R!==L&&(L?n.frontFace(n.CW):n.frontFace(n.CCW),R=L)}function De(L){L!==eS?(tt(n.CULL_FACE),L!==D&&(L===Zd?n.cullFace(n.BACK):L===nS?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):At(n.CULL_FACE),D=L}function Fe(L){L!==H&&(O&&n.lineWidth(L),H=L)}function Ve(L,st,K){L?(tt(n.POLYGON_OFFSET_FILL),(X!==st||U!==K)&&(X=st,U=K,o.getReversed()&&(st=-st),n.polygonOffset(st,K))):At(n.POLYGON_OFFSET_FILL)}function _e(L){L?tt(n.SCISSOR_TEST):At(n.SCISSOR_TEST)}function Ae(L){L===void 0&&(L=n.TEXTURE0+G-1),it!==L&&(n.activeTexture(L),it=L)}function I(L,st,K){K===void 0&&(it===null?K=n.TEXTURE0+G-1:K=it);let ct=et[K];ct===void 0&&(ct={type:void 0,texture:void 0},et[K]=ct),(ct.type!==L||ct.texture!==st)&&(it!==K&&(n.activeTexture(K),it=K),n.bindTexture(L,st||rt[L]),ct.type=L,ct.texture=st)}function en(){const L=et[it];L!==void 0&&L.type!==void 0&&(n.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function Qt(){try{n.compressedTexImage2D(...arguments)}catch(L){Xt("WebGLState:",L)}}function A(){try{n.compressedTexImage3D(...arguments)}catch(L){Xt("WebGLState:",L)}}function x(){try{n.texSubImage2D(...arguments)}catch(L){Xt("WebGLState:",L)}}function F(){try{n.texSubImage3D(...arguments)}catch(L){Xt("WebGLState:",L)}}function z(){try{n.compressedTexSubImage2D(...arguments)}catch(L){Xt("WebGLState:",L)}}function q(){try{n.compressedTexSubImage3D(...arguments)}catch(L){Xt("WebGLState:",L)}}function nt(){try{n.texStorage2D(...arguments)}catch(L){Xt("WebGLState:",L)}}function ot(){try{n.texStorage3D(...arguments)}catch(L){Xt("WebGLState:",L)}}function Y(){try{n.texImage2D(...arguments)}catch(L){Xt("WebGLState:",L)}}function J(){try{n.texImage3D(...arguments)}catch(L){Xt("WebGLState:",L)}}function at(L){return d[L]!==void 0?d[L]:n.getParameter(L)}function yt(L,st){d[L]!==st&&(n.pixelStorei(L,st),d[L]=st)}function ht(L){kt.equals(L)===!1&&(n.scissor(L.x,L.y,L.z,L.w),kt.copy(L))}function lt(L){Lt.equals(L)===!1&&(n.viewport(L.x,L.y,L.z,L.w),Lt.copy(L))}function Mt(L,st){let K=c.get(st);K===void 0&&(K=new WeakMap,c.set(st,K));let ct=K.get(L);ct===void 0&&(ct=n.getUniformBlockIndex(st,L.name),K.set(L,ct))}function Ct(L,st){const ct=c.get(st).get(L);l.get(st)!==ct&&(n.uniformBlockBinding(st,ct,L.__bindingPointIndex),l.set(st,ct))}function It(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),h={},d={},it=null,et={},u={},f=new WeakMap,_=[],g=null,p=!1,m=null,y=null,E=null,b=null,S=null,T=null,C=null,v=new Jt(0,0,0),M=0,P=!1,R=null,D=null,H=null,X=null,U=null,kt.set(0,0,n.canvas.width,n.canvas.height),Lt.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:tt,disable:At,bindFramebuffer:St,drawBuffers:Tt,useProgram:we,setBlending:$t,setMaterial:Gt,setFlipSided:Ce,setCullFace:De,setLineWidth:Fe,setPolygonOffset:Ve,setScissorTest:_e,activeTexture:Ae,bindTexture:I,unbindTexture:en,compressedTexImage2D:Qt,compressedTexImage3D:A,texImage2D:Y,texImage3D:J,pixelStorei:yt,getParameter:at,updateUBOMapping:Mt,uniformBlockBinding:Ct,texStorage2D:nt,texStorage3D:ot,texSubImage2D:x,texSubImage3D:F,compressedTexSubImage2D:z,compressedTexSubImage3D:q,scissor:ht,viewport:lt,reset:It}}function wA(n,t,e,i,r,s,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Kt,h=new WeakMap,d=new Set;let u;const f=new WeakMap;let _=!1;try{_=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,x){return _?new OffscreenCanvas(A,x):So("canvas")}function p(A,x,F){let z=1;const q=Qt(A);if((q.width>F||q.height>F)&&(z=F/Math.max(q.width,q.height)),z<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const nt=Math.floor(z*q.width),ot=Math.floor(z*q.height);u===void 0&&(u=g(nt,ot));const Y=x?g(nt,ot):u;return Y.width=nt,Y.height=ot,Y.getContext("2d").drawImage(A,0,0,nt,ot),Pt("WebGLRenderer: Texture has been resized from ("+q.width+"x"+q.height+") to ("+nt+"x"+ot+")."),Y}else return"data"in A&&Pt("WebGLRenderer: Image in DataTexture is too big ("+q.width+"x"+q.height+")."),A;return A}function m(A){return A.generateMipmaps}function y(A){n.generateMipmap(A)}function E(A){return A.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?n.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function b(A,x,F,z,q,nt=!1){if(A!==null){if(n[A]!==void 0)return n[A];Pt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let ot;z&&(ot=t.get("EXT_texture_norm16"),ot||Pt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Y=x;if(x===n.RED&&(F===n.FLOAT&&(Y=n.R32F),F===n.HALF_FLOAT&&(Y=n.R16F),F===n.UNSIGNED_BYTE&&(Y=n.R8),F===n.UNSIGNED_SHORT&&ot&&(Y=ot.R16_EXT),F===n.SHORT&&ot&&(Y=ot.R16_SNORM_EXT)),x===n.RED_INTEGER&&(F===n.UNSIGNED_BYTE&&(Y=n.R8UI),F===n.UNSIGNED_SHORT&&(Y=n.R16UI),F===n.UNSIGNED_INT&&(Y=n.R32UI),F===n.BYTE&&(Y=n.R8I),F===n.SHORT&&(Y=n.R16I),F===n.INT&&(Y=n.R32I)),x===n.RG&&(F===n.FLOAT&&(Y=n.RG32F),F===n.HALF_FLOAT&&(Y=n.RG16F),F===n.UNSIGNED_BYTE&&(Y=n.RG8),F===n.UNSIGNED_SHORT&&ot&&(Y=ot.RG16_EXT),F===n.SHORT&&ot&&(Y=ot.RG16_SNORM_EXT)),x===n.RG_INTEGER&&(F===n.UNSIGNED_BYTE&&(Y=n.RG8UI),F===n.UNSIGNED_SHORT&&(Y=n.RG16UI),F===n.UNSIGNED_INT&&(Y=n.RG32UI),F===n.BYTE&&(Y=n.RG8I),F===n.SHORT&&(Y=n.RG16I),F===n.INT&&(Y=n.RG32I)),x===n.RGB_INTEGER&&(F===n.UNSIGNED_BYTE&&(Y=n.RGB8UI),F===n.UNSIGNED_SHORT&&(Y=n.RGB16UI),F===n.UNSIGNED_INT&&(Y=n.RGB32UI),F===n.BYTE&&(Y=n.RGB8I),F===n.SHORT&&(Y=n.RGB16I),F===n.INT&&(Y=n.RGB32I)),x===n.RGBA_INTEGER&&(F===n.UNSIGNED_BYTE&&(Y=n.RGBA8UI),F===n.UNSIGNED_SHORT&&(Y=n.RGBA16UI),F===n.UNSIGNED_INT&&(Y=n.RGBA32UI),F===n.BYTE&&(Y=n.RGBA8I),F===n.SHORT&&(Y=n.RGBA16I),F===n.INT&&(Y=n.RGBA32I)),x===n.RGB&&(F===n.UNSIGNED_SHORT&&ot&&(Y=ot.RGB16_EXT),F===n.SHORT&&ot&&(Y=ot.RGB16_SNORM_EXT),F===n.UNSIGNED_INT_5_9_9_9_REV&&(Y=n.RGB9_E5),F===n.UNSIGNED_INT_10F_11F_11F_REV&&(Y=n.R11F_G11F_B10F)),x===n.RGBA){const J=nt?Za:zt.getTransfer(q);F===n.FLOAT&&(Y=n.RGBA32F),F===n.HALF_FLOAT&&(Y=n.RGBA16F),F===n.UNSIGNED_BYTE&&(Y=J===te?n.SRGB8_ALPHA8:n.RGBA8),F===n.UNSIGNED_SHORT&&ot&&(Y=ot.RGBA16_EXT),F===n.SHORT&&ot&&(Y=ot.RGBA16_SNORM_EXT),F===n.UNSIGNED_SHORT_4_4_4_4&&(Y=n.RGBA4),F===n.UNSIGNED_SHORT_5_5_5_1&&(Y=n.RGB5_A1)}return(Y===n.R16F||Y===n.R32F||Y===n.RG16F||Y===n.RG32F||Y===n.RGBA16F||Y===n.RGBA32F)&&t.get("EXT_color_buffer_float"),Y}function S(A,x){let F;return A?x===null||x===li||x===wo?F=n.DEPTH24_STENCIL8:x===ti?F=n.DEPTH32F_STENCIL8:x===yo&&(F=n.DEPTH24_STENCIL8,Pt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===li||x===wo?F=n.DEPTH_COMPONENT24:x===ti?F=n.DEPTH_COMPONENT32F:x===yo&&(F=n.DEPTH_COMPONENT16),F}function T(A,x){return m(A)===!0||A.isFramebufferTexture&&A.minFilter!==ze&&A.minFilter!==He?Math.log2(Math.max(x.width,x.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?x.mipmaps.length:1}function C(A){const x=A.target;x.removeEventListener("dispose",C),M(x),x.isVideoTexture&&h.delete(x),x.isHTMLTexture&&d.delete(x)}function v(A){const x=A.target;x.removeEventListener("dispose",v),R(x)}function M(A){const x=i.get(A);if(x.__webglInit===void 0)return;const F=A.source,z=f.get(F);if(z){const q=z[x.__cacheKey];q.usedTimes--,q.usedTimes===0&&P(A),Object.keys(z).length===0&&f.delete(F)}i.remove(A)}function P(A){const x=i.get(A);n.deleteTexture(x.__webglTexture);const F=A.source,z=f.get(F);delete z[x.__cacheKey],o.memory.textures--}function R(A){const x=i.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),i.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let z=0;z<6;z++){if(Array.isArray(x.__webglFramebuffer[z]))for(let q=0;q<x.__webglFramebuffer[z].length;q++)n.deleteFramebuffer(x.__webglFramebuffer[z][q]);else n.deleteFramebuffer(x.__webglFramebuffer[z]);x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer[z])}else{if(Array.isArray(x.__webglFramebuffer))for(let z=0;z<x.__webglFramebuffer.length;z++)n.deleteFramebuffer(x.__webglFramebuffer[z]);else n.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&n.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let z=0;z<x.__webglColorRenderbuffer.length;z++)x.__webglColorRenderbuffer[z]&&n.deleteRenderbuffer(x.__webglColorRenderbuffer[z]);x.__webglDepthRenderbuffer&&n.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const F=A.textures;for(let z=0,q=F.length;z<q;z++){const nt=i.get(F[z]);nt.__webglTexture&&(n.deleteTexture(nt.__webglTexture),o.memory.textures--),i.remove(F[z])}i.remove(A)}let D=0;function H(){D=0}function X(){return D}function U(A){D=A}function G(){const A=D;return A>=r.maxTextures&&Pt("WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+r.maxTextures),D+=1,A}function O(A){const x=[];return x.push(A.wrapS),x.push(A.wrapT),x.push(A.wrapR||0),x.push(A.magFilter),x.push(A.minFilter),x.push(A.anisotropy),x.push(A.internalFormat),x.push(A.format),x.push(A.type),x.push(A.generateMipmaps),x.push(A.premultiplyAlpha),x.push(A.flipY),x.push(A.unpackAlignment),x.push(A.colorSpace),x.join()}function $(A,x){const F=i.get(A);if(A.isVideoTexture&&I(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&F.__version!==A.version){const z=A.image;if(z===null)Pt("WebGLRenderer: Texture marked for update but no image data found.");else if(z.complete===!1)Pt("WebGLRenderer: Texture marked for update but image is incomplete");else{At(F,A,x);return}}else A.isExternalTexture&&(F.__webglTexture=A.sourceTexture?A.sourceTexture:null);e.bindTexture(n.TEXTURE_2D,F.__webglTexture,n.TEXTURE0+x)}function Q(A,x){const F=i.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&F.__version!==A.version){At(F,A,x);return}else A.isExternalTexture&&(F.__webglTexture=A.sourceTexture?A.sourceTexture:null);e.bindTexture(n.TEXTURE_2D_ARRAY,F.__webglTexture,n.TEXTURE0+x)}function it(A,x){const F=i.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&F.__version!==A.version){At(F,A,x);return}e.bindTexture(n.TEXTURE_3D,F.__webglTexture,n.TEXTURE0+x)}function et(A,x){const F=i.get(A);if(A.isCubeDepthTexture!==!0&&A.version>0&&F.__version!==A.version){St(F,A,x);return}e.bindTexture(n.TEXTURE_CUBE_MAP,F.__webglTexture,n.TEXTURE0+x)}const dt={[jc]:n.REPEAT,[yi]:n.CLAMP_TO_EDGE,[Qc]:n.MIRRORED_REPEAT},Rt={[ze]:n.NEAREST,[ES]:n.NEAREST_MIPMAP_NEAREST,[Zo]:n.NEAREST_MIPMAP_LINEAR,[He]:n.LINEAR,[Gl]:n.LINEAR_MIPMAP_NEAREST,[Sr]:n.LINEAR_MIPMAP_LINEAR},kt={[CS]:n.NEVER,[DS]:n.ALWAYS,[AS]:n.LESS,[Lu]:n.LEQUAL,[PS]:n.EQUAL,[Du]:n.GEQUAL,[RS]:n.GREATER,[LS]:n.NOTEQUAL};function Lt(A,x){if(x.type===ti&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===He||x.magFilter===Gl||x.magFilter===Zo||x.magFilter===Sr||x.minFilter===He||x.minFilter===Gl||x.minFilter===Zo||x.minFilter===Sr)&&Pt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(A,n.TEXTURE_WRAP_S,dt[x.wrapS]),n.texParameteri(A,n.TEXTURE_WRAP_T,dt[x.wrapT]),(A===n.TEXTURE_3D||A===n.TEXTURE_2D_ARRAY)&&n.texParameteri(A,n.TEXTURE_WRAP_R,dt[x.wrapR]),n.texParameteri(A,n.TEXTURE_MAG_FILTER,Rt[x.magFilter]),n.texParameteri(A,n.TEXTURE_MIN_FILTER,Rt[x.minFilter]),x.compareFunction&&(n.texParameteri(A,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(A,n.TEXTURE_COMPARE_FUNC,kt[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===ze||x.minFilter!==Zo&&x.minFilter!==Sr||x.type===ti&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){const F=t.get("EXT_texture_filter_anisotropic");n.texParameterf(A,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,r.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function Z(A,x){let F=!1;A.__webglInit===void 0&&(A.__webglInit=!0,x.addEventListener("dispose",C));const z=x.source;let q=f.get(z);q===void 0&&(q={},f.set(z,q));const nt=O(x);if(nt!==A.__cacheKey){q[nt]===void 0&&(q[nt]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,F=!0),q[nt].usedTimes++;const ot=q[A.__cacheKey];ot!==void 0&&(q[A.__cacheKey].usedTimes--,ot.usedTimes===0&&P(x)),A.__cacheKey=nt,A.__webglTexture=q[nt].texture}return F}function rt(A,x,F){return Math.floor(Math.floor(A/F)/x)}function tt(A,x,F,z){const nt=A.updateRanges;if(nt.length===0)e.texSubImage2D(n.TEXTURE_2D,0,0,0,x.width,x.height,F,z,x.data);else{nt.sort((yt,ht)=>yt.start-ht.start);let ot=0;for(let yt=1;yt<nt.length;yt++){const ht=nt[ot],lt=nt[yt],Mt=ht.start+ht.count,Ct=rt(lt.start,x.width,4),It=rt(ht.start,x.width,4);lt.start<=Mt+1&&Ct===It&&rt(lt.start+lt.count-1,x.width,4)===Ct?ht.count=Math.max(ht.count,lt.start+lt.count-ht.start):(++ot,nt[ot]=lt)}nt.length=ot+1;const Y=e.getParameter(n.UNPACK_ROW_LENGTH),J=e.getParameter(n.UNPACK_SKIP_PIXELS),at=e.getParameter(n.UNPACK_SKIP_ROWS);e.pixelStorei(n.UNPACK_ROW_LENGTH,x.width);for(let yt=0,ht=nt.length;yt<ht;yt++){const lt=nt[yt],Mt=Math.floor(lt.start/4),Ct=Math.ceil(lt.count/4),It=Mt%x.width,L=Math.floor(Mt/x.width),st=Ct,K=1;e.pixelStorei(n.UNPACK_SKIP_PIXELS,It),e.pixelStorei(n.UNPACK_SKIP_ROWS,L),e.texSubImage2D(n.TEXTURE_2D,0,It,L,st,K,F,z,x.data)}A.clearUpdateRanges(),e.pixelStorei(n.UNPACK_ROW_LENGTH,Y),e.pixelStorei(n.UNPACK_SKIP_PIXELS,J),e.pixelStorei(n.UNPACK_SKIP_ROWS,at)}}function At(A,x,F){let z=n.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(z=n.TEXTURE_2D_ARRAY),x.isData3DTexture&&(z=n.TEXTURE_3D);const q=Z(A,x),nt=x.source;e.bindTexture(z,A.__webglTexture,n.TEXTURE0+F);const ot=i.get(nt);if(nt.version!==ot.__version||q===!0){if(e.activeTexture(n.TEXTURE0+F),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){const K=zt.getPrimaries(zt.workingColorSpace),ct=x.colorSpace===$i?null:zt.getPrimaries(x.colorSpace),mt=x.colorSpace===$i||K===ct?n.NONE:n.BROWSER_DEFAULT_WEBGL;e.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,mt)}e.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment);let J=p(x.image,!1,r.maxTextureSize);J=en(x,J);const at=s.convert(x.format,x.colorSpace),yt=s.convert(x.type);let ht=b(x.internalFormat,at,yt,x.normalized,x.colorSpace,x.isVideoTexture);Lt(z,x);let lt;const Mt=x.mipmaps,Ct=x.isVideoTexture!==!0,It=ot.__version===void 0||q===!0,L=nt.dataReady,st=T(x,J);if(x.isDepthTexture)ht=S(x.format===Er,x.type),It&&(Ct?e.texStorage2D(n.TEXTURE_2D,1,ht,J.width,J.height):e.texImage2D(n.TEXTURE_2D,0,ht,J.width,J.height,0,at,yt,null));else if(x.isDataTexture)if(Mt.length>0){Ct&&It&&e.texStorage2D(n.TEXTURE_2D,st,ht,Mt[0].width,Mt[0].height);for(let K=0,ct=Mt.length;K<ct;K++)lt=Mt[K],Ct?L&&e.texSubImage2D(n.TEXTURE_2D,K,0,0,lt.width,lt.height,at,yt,lt.data):e.texImage2D(n.TEXTURE_2D,K,ht,lt.width,lt.height,0,at,yt,lt.data);x.generateMipmaps=!1}else Ct?(It&&e.texStorage2D(n.TEXTURE_2D,st,ht,J.width,J.height),L&&tt(x,J,at,yt)):e.texImage2D(n.TEXTURE_2D,0,ht,J.width,J.height,0,at,yt,J.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Ct&&It&&e.texStorage3D(n.TEXTURE_2D_ARRAY,st,ht,Mt[0].width,Mt[0].height,J.depth);for(let K=0,ct=Mt.length;K<ct;K++)if(lt=Mt[K],x.format!==Hn)if(at!==null)if(Ct){if(L)if(x.layerUpdates.size>0){const mt=Tf(lt.width,lt.height,x.format,x.type);for(const j of x.layerUpdates){const bt=lt.data.subarray(j*mt/lt.data.BYTES_PER_ELEMENT,(j+1)*mt/lt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,j,lt.width,lt.height,1,at,bt)}x.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,0,lt.width,lt.height,J.depth,at,lt.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,K,ht,lt.width,lt.height,J.depth,0,lt.data,0,0);else Pt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ct?L&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,0,lt.width,lt.height,J.depth,at,yt,lt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,K,ht,lt.width,lt.height,J.depth,0,at,yt,lt.data)}else{Ct&&It&&e.texStorage2D(n.TEXTURE_2D,st,ht,Mt[0].width,Mt[0].height);for(let K=0,ct=Mt.length;K<ct;K++)lt=Mt[K],x.format!==Hn?at!==null?Ct?L&&e.compressedTexSubImage2D(n.TEXTURE_2D,K,0,0,lt.width,lt.height,at,lt.data):e.compressedTexImage2D(n.TEXTURE_2D,K,ht,lt.width,lt.height,0,lt.data):Pt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ct?L&&e.texSubImage2D(n.TEXTURE_2D,K,0,0,lt.width,lt.height,at,yt,lt.data):e.texImage2D(n.TEXTURE_2D,K,ht,lt.width,lt.height,0,at,yt,lt.data)}else if(x.isDataArrayTexture)if(Ct){if(It&&e.texStorage3D(n.TEXTURE_2D_ARRAY,st,ht,J.width,J.height,J.depth),L)if(x.layerUpdates.size>0){const K=Tf(J.width,J.height,x.format,x.type);for(const ct of x.layerUpdates){const mt=J.data.subarray(ct*K/J.data.BYTES_PER_ELEMENT,(ct+1)*K/J.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ct,J.width,J.height,1,at,yt,mt)}x.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,at,yt,J.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,ht,J.width,J.height,J.depth,0,at,yt,J.data);else if(x.isData3DTexture)Ct?(It&&e.texStorage3D(n.TEXTURE_3D,st,ht,J.width,J.height,J.depth),L&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,at,yt,J.data)):e.texImage3D(n.TEXTURE_3D,0,ht,J.width,J.height,J.depth,0,at,yt,J.data);else if(x.isFramebufferTexture){if(It)if(Ct)e.texStorage2D(n.TEXTURE_2D,st,ht,J.width,J.height);else{let K=J.width,ct=J.height;for(let mt=0;mt<st;mt++)e.texImage2D(n.TEXTURE_2D,mt,ht,K,ct,0,at,yt,null),K>>=1,ct>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in n){const K=n.canvas;if(K.hasAttribute("layoutsubtree")||K.setAttribute("layoutsubtree","true"),J.parentNode!==K){K.appendChild(J),d.add(x),K.onpaint=ct=>{const mt=ct.changedElements;for(const j of d)mt.includes(j.image)&&(j.needsUpdate=!0)},K.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,J);else{const mt=n.RGBA,j=n.RGBA,bt=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,mt,j,bt,J)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(Mt.length>0){if(Ct&&It){const K=Qt(Mt[0]);e.texStorage2D(n.TEXTURE_2D,st,ht,K.width,K.height)}for(let K=0,ct=Mt.length;K<ct;K++)lt=Mt[K],Ct?L&&e.texSubImage2D(n.TEXTURE_2D,K,0,0,at,yt,lt):e.texImage2D(n.TEXTURE_2D,K,ht,at,yt,lt);x.generateMipmaps=!1}else if(Ct){if(It){const K=Qt(J);e.texStorage2D(n.TEXTURE_2D,st,ht,K.width,K.height)}L&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,at,yt,J)}else e.texImage2D(n.TEXTURE_2D,0,ht,at,yt,J);m(x)&&y(z),ot.__version=nt.version,x.onUpdate&&x.onUpdate(x)}A.__version=x.version}function St(A,x,F){if(x.image.length!==6)return;const z=Z(A,x),q=x.source;e.bindTexture(n.TEXTURE_CUBE_MAP,A.__webglTexture,n.TEXTURE0+F);const nt=i.get(q);if(q.version!==nt.__version||z===!0){e.activeTexture(n.TEXTURE0+F);const ot=zt.getPrimaries(zt.workingColorSpace),Y=x.colorSpace===$i?null:zt.getPrimaries(x.colorSpace),J=x.colorSpace===$i||ot===Y?n.NONE:n.BROWSER_DEFAULT_WEBGL;e.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),e.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,J);const at=x.isCompressedTexture||x.image[0].isCompressedTexture,yt=x.image[0]&&x.image[0].isDataTexture,ht=[];for(let j=0;j<6;j++)!at&&!yt?ht[j]=p(x.image[j],!0,r.maxCubemapSize):ht[j]=yt?x.image[j].image:x.image[j],ht[j]=en(x,ht[j]);const lt=ht[0],Mt=s.convert(x.format,x.colorSpace),Ct=s.convert(x.type),It=b(x.internalFormat,Mt,Ct,x.normalized,x.colorSpace),L=x.isVideoTexture!==!0,st=nt.__version===void 0||z===!0,K=q.dataReady;let ct=T(x,lt);Lt(n.TEXTURE_CUBE_MAP,x);let mt;if(at){L&&st&&e.texStorage2D(n.TEXTURE_CUBE_MAP,ct,It,lt.width,lt.height);for(let j=0;j<6;j++){mt=ht[j].mipmaps;for(let bt=0;bt<mt.length;bt++){const vt=mt[bt];x.format!==Hn?Mt!==null?L?K&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,bt,0,0,vt.width,vt.height,Mt,vt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,bt,It,vt.width,vt.height,0,vt.data):Pt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?K&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,bt,0,0,vt.width,vt.height,Mt,Ct,vt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,bt,It,vt.width,vt.height,0,Mt,Ct,vt.data)}}}else{if(mt=x.mipmaps,L&&st){mt.length>0&&ct++;const j=Qt(ht[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,ct,It,j.width,j.height)}for(let j=0;j<6;j++)if(yt){L?K&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,ht[j].width,ht[j].height,Mt,Ct,ht[j].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,It,ht[j].width,ht[j].height,0,Mt,Ct,ht[j].data);for(let bt=0;bt<mt.length;bt++){const ge=mt[bt].image[j].image;L?K&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,bt+1,0,0,ge.width,ge.height,Mt,Ct,ge.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,bt+1,It,ge.width,ge.height,0,Mt,Ct,ge.data)}}else{L?K&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Mt,Ct,ht[j]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,It,Mt,Ct,ht[j]);for(let bt=0;bt<mt.length;bt++){const vt=mt[bt];L?K&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,bt+1,0,0,Mt,Ct,vt.image[j]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,bt+1,It,Mt,Ct,vt.image[j])}}}m(x)&&y(n.TEXTURE_CUBE_MAP),nt.__version=q.version,x.onUpdate&&x.onUpdate(x)}A.__version=x.version}function Tt(A,x,F,z,q,nt){const ot=s.convert(F.format,F.colorSpace),Y=s.convert(F.type),J=b(F.internalFormat,ot,Y,F.normalized,F.colorSpace),at=i.get(x),yt=i.get(F);if(yt.__renderTarget=x,!at.__hasExternalTextures){const ht=Math.max(1,x.width>>nt),lt=Math.max(1,x.height>>nt);q===n.TEXTURE_3D||q===n.TEXTURE_2D_ARRAY?e.texImage3D(q,nt,J,ht,lt,x.depth,0,ot,Y,null):e.texImage2D(q,nt,J,ht,lt,0,ot,Y,null)}e.bindFramebuffer(n.FRAMEBUFFER,A),Ae(x)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,z,q,yt.__webglTexture,0,_e(x)):(q===n.TEXTURE_2D||q>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&q<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,z,q,yt.__webglTexture,nt),e.bindFramebuffer(n.FRAMEBUFFER,null)}function we(A,x,F){if(n.bindRenderbuffer(n.RENDERBUFFER,A),x.depthBuffer){const z=x.depthTexture,q=z&&z.isDepthTexture?z.type:null,nt=S(x.stencilBuffer,q),ot=x.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;Ae(x)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,_e(x),nt,x.width,x.height):F?n.renderbufferStorageMultisample(n.RENDERBUFFER,_e(x),nt,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,nt,x.width,x.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,ot,n.RENDERBUFFER,A)}else{const z=x.textures;for(let q=0;q<z.length;q++){const nt=z[q],ot=s.convert(nt.format,nt.colorSpace),Y=s.convert(nt.type),J=b(nt.internalFormat,ot,Y,nt.normalized,nt.colorSpace);Ae(x)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,_e(x),J,x.width,x.height):F?n.renderbufferStorageMultisample(n.RENDERBUFFER,_e(x),J,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,J,x.width,x.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Bt(A,x,F){const z=x.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(n.FRAMEBUFFER,A),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const q=i.get(x.depthTexture);if(q.__renderTarget=x,(!q.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),z){if(q.__webglInit===void 0&&(q.__webglInit=!0,x.depthTexture.addEventListener("dispose",C)),q.__webglTexture===void 0){q.__webglTexture=n.createTexture(),e.bindTexture(n.TEXTURE_CUBE_MAP,q.__webglTexture),Lt(n.TEXTURE_CUBE_MAP,x.depthTexture);const at=s.convert(x.depthTexture.format),yt=s.convert(x.depthTexture.type);let ht;x.depthTexture.format===Li?ht=n.DEPTH_COMPONENT24:x.depthTexture.format===Er&&(ht=n.DEPTH24_STENCIL8);for(let lt=0;lt<6;lt++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,ht,x.width,x.height,0,at,yt,null)}}else $(x.depthTexture,0);const nt=q.__webglTexture,ot=_e(x),Y=z?n.TEXTURE_CUBE_MAP_POSITIVE_X+F:n.TEXTURE_2D,J=x.depthTexture.format===Er?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(x.depthTexture.format===Li)Ae(x)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,J,Y,nt,0,ot):n.framebufferTexture2D(n.FRAMEBUFFER,J,Y,nt,0);else if(x.depthTexture.format===Er)Ae(x)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,J,Y,nt,0,ot):n.framebufferTexture2D(n.FRAMEBUFFER,J,Y,nt,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ne(A){const x=i.get(A),F=A.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==A.depthTexture){const z=A.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),z){const q=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,z.removeEventListener("dispose",q)};z.addEventListener("dispose",q),x.__depthDisposeCallback=q}x.__boundDepthTexture=z}if(A.depthTexture&&!x.__autoAllocateDepthBuffer)if(F)for(let z=0;z<6;z++)Bt(x.__webglFramebuffer[z],A,z);else{const z=A.texture.mipmaps;z&&z.length>0?Bt(x.__webglFramebuffer[0],A,0):Bt(x.__webglFramebuffer,A,0)}else if(F){x.__webglDepthbuffer=[];for(let z=0;z<6;z++)if(e.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[z]),x.__webglDepthbuffer[z]===void 0)x.__webglDepthbuffer[z]=n.createRenderbuffer(),we(x.__webglDepthbuffer[z],A,!1);else{const q=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,nt=x.__webglDepthbuffer[z];n.bindRenderbuffer(n.RENDERBUFFER,nt),n.framebufferRenderbuffer(n.FRAMEBUFFER,q,n.RENDERBUFFER,nt)}}else{const z=A.texture.mipmaps;if(z&&z.length>0?e.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[0]):e.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=n.createRenderbuffer(),we(x.__webglDepthbuffer,A,!1);else{const q=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,nt=x.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,nt),n.framebufferRenderbuffer(n.FRAMEBUFFER,q,n.RENDERBUFFER,nt)}}e.bindFramebuffer(n.FRAMEBUFFER,null)}function $t(A,x,F){const z=i.get(A);x!==void 0&&Tt(z.__webglFramebuffer,A,A.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),F!==void 0&&ne(A)}function Gt(A){const x=A.texture,F=i.get(A),z=i.get(x);A.addEventListener("dispose",v);const q=A.textures,nt=A.isWebGLCubeRenderTarget===!0,ot=q.length>1;if(ot||(z.__webglTexture===void 0&&(z.__webglTexture=n.createTexture()),z.__version=x.version,o.memory.textures++),nt){F.__webglFramebuffer=[];for(let Y=0;Y<6;Y++)if(x.mipmaps&&x.mipmaps.length>0){F.__webglFramebuffer[Y]=[];for(let J=0;J<x.mipmaps.length;J++)F.__webglFramebuffer[Y][J]=n.createFramebuffer()}else F.__webglFramebuffer[Y]=n.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){F.__webglFramebuffer=[];for(let Y=0;Y<x.mipmaps.length;Y++)F.__webglFramebuffer[Y]=n.createFramebuffer()}else F.__webglFramebuffer=n.createFramebuffer();if(ot)for(let Y=0,J=q.length;Y<J;Y++){const at=i.get(q[Y]);at.__webglTexture===void 0&&(at.__webglTexture=n.createTexture(),o.memory.textures++)}if(A.samples>0&&Ae(A)===!1){F.__webglMultisampledFramebuffer=n.createFramebuffer(),F.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let Y=0;Y<q.length;Y++){const J=q[Y];F.__webglColorRenderbuffer[Y]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,F.__webglColorRenderbuffer[Y]);const at=s.convert(J.format,J.colorSpace),yt=s.convert(J.type),ht=b(J.internalFormat,at,yt,J.normalized,J.colorSpace,A.isXRRenderTarget===!0),lt=_e(A);n.renderbufferStorageMultisample(n.RENDERBUFFER,lt,ht,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Y,n.RENDERBUFFER,F.__webglColorRenderbuffer[Y])}n.bindRenderbuffer(n.RENDERBUFFER,null),A.depthBuffer&&(F.__webglDepthRenderbuffer=n.createRenderbuffer(),we(F.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(nt){e.bindTexture(n.TEXTURE_CUBE_MAP,z.__webglTexture),Lt(n.TEXTURE_CUBE_MAP,x);for(let Y=0;Y<6;Y++)if(x.mipmaps&&x.mipmaps.length>0)for(let J=0;J<x.mipmaps.length;J++)Tt(F.__webglFramebuffer[Y][J],A,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,J);else Tt(F.__webglFramebuffer[Y],A,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0);m(x)&&y(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ot){for(let Y=0,J=q.length;Y<J;Y++){const at=q[Y],yt=i.get(at);let ht=n.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(ht=A.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(ht,yt.__webglTexture),Lt(ht,at),Tt(F.__webglFramebuffer,A,at,n.COLOR_ATTACHMENT0+Y,ht,0),m(at)&&y(ht)}e.unbindTexture()}else{let Y=n.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(Y=A.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(Y,z.__webglTexture),Lt(Y,x),x.mipmaps&&x.mipmaps.length>0)for(let J=0;J<x.mipmaps.length;J++)Tt(F.__webglFramebuffer[J],A,x,n.COLOR_ATTACHMENT0,Y,J);else Tt(F.__webglFramebuffer,A,x,n.COLOR_ATTACHMENT0,Y,0);m(x)&&y(Y),e.unbindTexture()}A.depthBuffer&&ne(A)}function Ce(A){const x=A.textures;for(let F=0,z=x.length;F<z;F++){const q=x[F];if(m(q)){const nt=E(A),ot=i.get(q).__webglTexture;e.bindTexture(nt,ot),y(nt),e.unbindTexture()}}}const De=[],Fe=[];function Ve(A){if(A.samples>0){if(Ae(A)===!1){const x=A.textures,F=A.width,z=A.height;let q=n.COLOR_BUFFER_BIT;const nt=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ot=i.get(A),Y=x.length>1;if(Y)for(let at=0;at<x.length;at++)e.bindFramebuffer(n.FRAMEBUFFER,ot.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+at,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,ot.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+at,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,ot.__webglMultisampledFramebuffer);const J=A.texture.mipmaps;J&&J.length>0?e.bindFramebuffer(n.DRAW_FRAMEBUFFER,ot.__webglFramebuffer[0]):e.bindFramebuffer(n.DRAW_FRAMEBUFFER,ot.__webglFramebuffer);for(let at=0;at<x.length;at++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(q|=n.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(q|=n.STENCIL_BUFFER_BIT)),Y){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,ot.__webglColorRenderbuffer[at]);const yt=i.get(x[at]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,yt,0)}n.blitFramebuffer(0,0,F,z,0,0,F,z,q,n.NEAREST),l===!0&&(De.length=0,Fe.length=0,De.push(n.COLOR_ATTACHMENT0+at),A.depthBuffer&&A.resolveDepthBuffer===!1&&(De.push(nt),Fe.push(nt),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Fe)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,De))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Y)for(let at=0;at<x.length;at++){e.bindFramebuffer(n.FRAMEBUFFER,ot.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+at,n.RENDERBUFFER,ot.__webglColorRenderbuffer[at]);const yt=i.get(x[at]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,ot.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+at,n.TEXTURE_2D,yt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,ot.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){const x=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[x])}}}function _e(A){return Math.min(r.maxSamples,A.samples)}function Ae(A){const x=i.get(A);return A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function I(A){const x=o.render.frame;h.get(A)!==x&&(h.set(A,x),A.update())}function en(A,x){const F=A.colorSpace,z=A.format,q=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||F!==Ka&&F!==$i&&(zt.getTransfer(F)===te?(z!==Hn||q!==Un)&&Pt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Xt("WebGLTextures: Unsupported texture color space:",F)),x}function Qt(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=G,this.resetTextureUnits=H,this.getTextureUnits=X,this.setTextureUnits=U,this.setTexture2D=$,this.setTexture2DArray=Q,this.setTexture3D=it,this.setTextureCube=et,this.rebindTextures=$t,this.setupRenderTarget=Gt,this.updateRenderTargetMipmap=Ce,this.updateMultisampleRenderTarget=Ve,this.setupDepthRenderbuffer=ne,this.setupFrameBufferTexture=Tt,this.useMultisampledRTT=Ae,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function SA(n,t){function e(i,r=$i){let s;const o=zt.getTransfer(r);if(i===Un)return n.UNSIGNED_BYTE;if(i===Tu)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Cu)return n.UNSIGNED_SHORT_5_5_5_1;if(i===S_)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===E_)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===y_)return n.BYTE;if(i===w_)return n.SHORT;if(i===yo)return n.UNSIGNED_SHORT;if(i===Mu)return n.INT;if(i===li)return n.UNSIGNED_INT;if(i===ti)return n.FLOAT;if(i===Ri)return n.HALF_FLOAT;if(i===M_)return n.ALPHA;if(i===T_)return n.RGB;if(i===Hn)return n.RGBA;if(i===Li)return n.DEPTH_COMPONENT;if(i===Er)return n.DEPTH_STENCIL;if(i===C_)return n.RED;if(i===Au)return n.RED_INTEGER;if(i===Ur)return n.RG;if(i===Pu)return n.RG_INTEGER;if(i===Ru)return n.RGBA_INTEGER;if(i===Ca||i===Aa||i===Pa||i===Ra)if(o===te)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Ca)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Aa)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Pa)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ra)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Ca)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Aa)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Pa)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ra)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===th||i===eh||i===nh||i===ih)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===th)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===eh)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===nh)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ih)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===rh||i===sh||i===oh||i===ah||i===lh||i===Ya||i===ch)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===rh||i===sh)return o===te?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===oh)return o===te?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===ah)return s.COMPRESSED_R11_EAC;if(i===lh)return s.COMPRESSED_SIGNED_R11_EAC;if(i===Ya)return s.COMPRESSED_RG11_EAC;if(i===ch)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===hh||i===uh||i===dh||i===fh||i===ph||i===mh||i===_h||i===gh||i===vh||i===xh||i===bh||i===yh||i===wh||i===Sh)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===hh)return o===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===uh)return o===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===dh)return o===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===fh)return o===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===ph)return o===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===mh)return o===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===_h)return o===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===gh)return o===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===vh)return o===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===xh)return o===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===bh)return o===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===yh)return o===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===wh)return o===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Sh)return o===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Eh||i===Mh||i===Th)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===Eh)return o===te?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Mh)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Th)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Ch||i===Ah||i===$a||i===Ph)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===Ch)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Ah)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===$a)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ph)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===wo?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}const EA=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,MA=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class TA{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const i=new O_(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new hi({vertexShader:EA,fragmentShader:MA,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ci(new ko(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class CA extends Vr{constructor(t,e){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,_=null;const g=typeof XRWebGLBinding<"u",p=new TA,m={},y=e.getContextAttributes();let E=null,b=null;const S=[],T=[],C=new Kt;let v=null;const M=new In;M.viewport=new be;const P=new In;P.viewport=new be;const R=[M,P],D=new FE;let H=null,X=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let rt=S[Z];return rt===void 0&&(rt=new Kl,S[Z]=rt),rt.getTargetRaySpace()},this.getControllerGrip=function(Z){let rt=S[Z];return rt===void 0&&(rt=new Kl,S[Z]=rt),rt.getGripSpace()},this.getHand=function(Z){let rt=S[Z];return rt===void 0&&(rt=new Kl,S[Z]=rt),rt.getHandSpace()};function U(Z){const rt=T.indexOf(Z.inputSource);if(rt===-1)return;const tt=S[rt];tt!==void 0&&(tt.update(Z.inputSource,Z.frame,c||o),tt.dispatchEvent({type:Z.type,data:Z.inputSource}))}function G(){r.removeEventListener("select",U),r.removeEventListener("selectstart",U),r.removeEventListener("selectend",U),r.removeEventListener("squeeze",U),r.removeEventListener("squeezestart",U),r.removeEventListener("squeezeend",U),r.removeEventListener("end",G),r.removeEventListener("inputsourceschange",O);for(let Z=0;Z<S.length;Z++){const rt=T[Z];rt!==null&&(T[Z]=null,S[Z].disconnect(rt))}H=null,X=null,p.reset();for(const Z in m)delete m[Z];t.setRenderTarget(E),f=null,u=null,d=null,r=null,b=null,Lt.stop(),i.isPresenting=!1,t.setPixelRatio(v),t.setSize(C.width,C.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){s=Z,i.isPresenting===!0&&Pt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){a=Z,i.isPresenting===!0&&Pt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&g&&(d=new XRWebGLBinding(r,e)),d},this.getFrame=function(){return _},this.getSession=function(){return r},this.setSession=async function(Z){if(r=Z,r!==null){if(E=t.getRenderTarget(),r.addEventListener("select",U),r.addEventListener("selectstart",U),r.addEventListener("selectend",U),r.addEventListener("squeeze",U),r.addEventListener("squeezestart",U),r.addEventListener("squeezeend",U),r.addEventListener("end",G),r.addEventListener("inputsourceschange",O),y.xrCompatible!==!0&&await e.makeXRCompatible(),v=t.getPixelRatio(),t.getSize(C),g&&"createProjectionLayer"in XRWebGLBinding.prototype){let tt=null,At=null,St=null;y.depth&&(St=y.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,tt=y.stencil?Er:Li,At=y.stencil?wo:li);const Tt={colorFormat:e.RGBA8,depthFormat:St,scaleFactor:s};d=this.getBinding(),u=d.createProjectionLayer(Tt),r.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),b=new ii(u.textureWidth,u.textureHeight,{format:Hn,type:Un,depthTexture:new Ts(u.textureWidth,u.textureHeight,At,void 0,void 0,void 0,void 0,void 0,void 0,tt),stencilBuffer:y.stencil,colorSpace:t.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const tt={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,e,tt),r.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),b=new ii(f.framebufferWidth,f.framebufferHeight,{format:Hn,type:Un,colorSpace:t.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),Lt.setContext(r),Lt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function O(Z){for(let rt=0;rt<Z.removed.length;rt++){const tt=Z.removed[rt],At=T.indexOf(tt);At>=0&&(T[At]=null,S[At].disconnect(tt))}for(let rt=0;rt<Z.added.length;rt++){const tt=Z.added[rt];let At=T.indexOf(tt);if(At===-1){for(let Tt=0;Tt<S.length;Tt++)if(Tt>=T.length){T.push(tt),At=Tt;break}else if(T[Tt]===null){T[Tt]=tt,At=Tt;break}if(At===-1)break}const St=S[At];St&&St.connect(tt)}}const $=new V,Q=new V;function it(Z,rt,tt){$.setFromMatrixPosition(rt.matrixWorld),Q.setFromMatrixPosition(tt.matrixWorld);const At=$.distanceTo(Q),St=rt.projectionMatrix.elements,Tt=tt.projectionMatrix.elements,we=St[14]/(St[10]-1),Bt=St[14]/(St[10]+1),ne=(St[9]+1)/St[5],$t=(St[9]-1)/St[5],Gt=(St[8]-1)/St[0],Ce=(Tt[8]+1)/Tt[0],De=we*Gt,Fe=we*Ce,Ve=At/(-Gt+Ce),_e=Ve*-Gt;if(rt.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(_e),Z.translateZ(Ve),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),St[10]===-1)Z.projectionMatrix.copy(rt.projectionMatrix),Z.projectionMatrixInverse.copy(rt.projectionMatrixInverse);else{const Ae=we+Ve,I=Bt+Ve,en=De-_e,Qt=Fe+(At-_e),A=ne*Bt/I*Ae,x=$t*Bt/I*Ae;Z.projectionMatrix.makePerspective(en,Qt,A,x,Ae,I),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function et(Z,rt){rt===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(rt.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(r===null)return;let rt=Z.near,tt=Z.far;p.texture!==null&&(p.depthNear>0&&(rt=p.depthNear),p.depthFar>0&&(tt=p.depthFar)),D.near=P.near=M.near=rt,D.far=P.far=M.far=tt,(H!==D.near||X!==D.far)&&(r.updateRenderState({depthNear:D.near,depthFar:D.far}),H=D.near,X=D.far),D.layers.mask=Z.layers.mask|6,M.layers.mask=D.layers.mask&-5,P.layers.mask=D.layers.mask&-3;const At=Z.parent,St=D.cameras;et(D,At);for(let Tt=0;Tt<St.length;Tt++)et(St[Tt],At);St.length===2?it(D,M,P):D.projectionMatrix.copy(M.projectionMatrix),dt(Z,D,At)};function dt(Z,rt,tt){tt===null?Z.matrix.copy(rt.matrixWorld):(Z.matrix.copy(tt.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(rt.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(rt.projectionMatrix),Z.projectionMatrixInverse.copy(rt.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Eo*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(Z){l=Z,u!==null&&(u.fixedFoveation=Z),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Z)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(D)},this.getCameraTexture=function(Z){return m[Z]};let Rt=null;function kt(Z,rt){if(h=rt.getViewerPose(c||o),_=rt,h!==null){const tt=h.views;f!==null&&(t.setRenderTargetFramebuffer(b,f.framebuffer),t.setRenderTarget(b));let At=!1;tt.length!==D.cameras.length&&(D.cameras.length=0,At=!0);for(let Bt=0;Bt<tt.length;Bt++){const ne=tt[Bt];let $t=null;if(f!==null)$t=f.getViewport(ne);else{const Ce=d.getViewSubImage(u,ne);$t=Ce.viewport,Bt===0&&(t.setRenderTargetTextures(b,Ce.colorTexture,Ce.depthStencilTexture),t.setRenderTarget(b))}let Gt=R[Bt];Gt===void 0&&(Gt=new In,Gt.layers.enable(Bt),Gt.viewport=new be,R[Bt]=Gt),Gt.matrix.fromArray(ne.transform.matrix),Gt.matrix.decompose(Gt.position,Gt.quaternion,Gt.scale),Gt.projectionMatrix.fromArray(ne.projectionMatrix),Gt.projectionMatrixInverse.copy(Gt.projectionMatrix).invert(),Gt.viewport.set($t.x,$t.y,$t.width,$t.height),Bt===0&&(D.matrix.copy(Gt.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),At===!0&&D.cameras.push(Gt)}const St=r.enabledFeatures;if(St&&St.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&g){d=i.getBinding();const Bt=d.getDepthInformation(tt[0]);Bt&&Bt.isValid&&Bt.texture&&p.init(Bt,r.renderState)}if(St&&St.includes("camera-access")&&g){t.state.unbindTexture(),d=i.getBinding();for(let Bt=0;Bt<tt.length;Bt++){const ne=tt[Bt].camera;if(ne){let $t=m[ne];$t||($t=new O_,m[ne]=$t);const Gt=d.getCameraImage(ne);$t.sourceTexture=Gt}}}}for(let tt=0;tt<S.length;tt++){const At=T[tt],St=S[tt];At!==null&&St!==void 0&&St.update(At,rt,c||o)}Rt&&Rt(Z,rt),rt.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:rt}),_=null}const Lt=new z_;Lt.setAnimationLoop(kt),this.setAnimationLoop=function(Z){Rt=Z},this.dispose=function(){}}}const AA=new Te,$_=new Dt;$_.set(-1,0,0,0,1,0,0,0,1);function PA(n,t){function e(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function i(p,m){m.color.getRGB(p.fogColor.value,F_(n)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function r(p,m,y,E,b){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?s(p,m):m.isMeshLambertMaterial?(s(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(s(p,m),d(p,m)):m.isMeshPhongMaterial?(s(p,m),h(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(s(p,m),u(p,m),m.isMeshPhysicalMaterial&&f(p,m,b)):m.isMeshMatcapMaterial?(s(p,m),_(p,m)):m.isMeshDepthMaterial?s(p,m):m.isMeshDistanceMaterial?(s(p,m),g(p,m)):m.isMeshNormalMaterial?s(p,m):m.isLineBasicMaterial?(o(p,m),m.isLineDashedMaterial&&a(p,m)):m.isPointsMaterial?l(p,m,y,E):m.isSpriteMaterial?c(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function s(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,e(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===hn&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,e(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===hn&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,e(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,e(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const y=t.get(m),E=y.envMap,b=y.envMapRotation;E&&(p.envMap.value=E,p.envMapRotation.value.setFromMatrix4(AA.makeRotationFromEuler(b)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply($_),p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,p.aoMapTransform))}function o(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform))}function a(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,y,E){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*y,p.scale.value=E*.5,m.map&&(p.map.value=m.map,e(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function c(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function d(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function u(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,y){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===hn&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=y.texture,p.transmissionSamplerSize.value.set(y.width,y.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,p.specularIntensityMapTransform))}function _(p,m){m.matcap&&(p.matcap.value=m.matcap)}function g(p,m){const y=t.get(m).light;p.referencePosition.value.setFromMatrixPosition(y.matrixWorld),p.nearDistance.value=y.shadow.camera.near,p.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function RA(n,t,e,i){let r={},s={},o=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,S){const T=S.program;i.uniformBlockBinding(b,T)}function c(b,S){let T=r[b.id];T===void 0&&(p(b),T=h(b),r[b.id]=T,b.addEventListener("dispose",y));const C=S.program;i.updateUBOMapping(b,C);const v=t.render.frame;s[b.id]!==v&&(u(b),s[b.id]=v)}function h(b){const S=d();b.__bindingPointIndex=S;const T=n.createBuffer(),C=b.__size,v=b.usage;return n.bindBuffer(n.UNIFORM_BUFFER,T),n.bufferData(n.UNIFORM_BUFFER,C,v),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,S,T),T}function d(){for(let b=0;b<a;b++)if(o.indexOf(b)===-1)return o.push(b),b;return Xt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(b){const S=r[b.id],T=b.uniforms,C=b.__cache;n.bindBuffer(n.UNIFORM_BUFFER,S);for(let v=0,M=T.length;v<M;v++){const P=T[v];if(Array.isArray(P))for(let R=0,D=P.length;R<D;R++)f(P[R],v,R,C);else f(P,v,0,C)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(b,S,T,C){if(g(b,S,T,C)===!0){const v=b.__offset,M=b.value;if(Array.isArray(M)){let P=0;for(let R=0;R<M.length;R++){const D=M[R],H=m(D);_(D,b.__data,P),typeof D!="number"&&typeof D!="boolean"&&!D.isMatrix3&&!ArrayBuffer.isView(D)&&(P+=H.storage/Float32Array.BYTES_PER_ELEMENT)}}else _(M,b.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,v,b.__data)}}function _(b,S,T){typeof b=="number"||typeof b=="boolean"?S[0]=b:b.isMatrix3?(S[0]=b.elements[0],S[1]=b.elements[1],S[2]=b.elements[2],S[3]=0,S[4]=b.elements[3],S[5]=b.elements[4],S[6]=b.elements[5],S[7]=0,S[8]=b.elements[6],S[9]=b.elements[7],S[10]=b.elements[8],S[11]=0):ArrayBuffer.isView(b)?S.set(new b.constructor(b.buffer,b.byteOffset,S.length)):b.toArray(S,T)}function g(b,S,T,C){const v=b.value,M=S+"_"+T;if(C[M]===void 0)return typeof v=="number"||typeof v=="boolean"?C[M]=v:ArrayBuffer.isView(v)?C[M]=v.slice():C[M]=v.clone(),!0;{const P=C[M];if(typeof v=="number"||typeof v=="boolean"){if(P!==v)return C[M]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(P.equals(v)===!1)return P.copy(v),!0}}return!1}function p(b){const S=b.uniforms;let T=0;const C=16;for(let M=0,P=S.length;M<P;M++){const R=Array.isArray(S[M])?S[M]:[S[M]];for(let D=0,H=R.length;D<H;D++){const X=R[D],U=Array.isArray(X.value)?X.value:[X.value];for(let G=0,O=U.length;G<O;G++){const $=U[G],Q=m($),it=T%C,et=it%Q.boundary,dt=it+et;T+=et,dt!==0&&C-dt<Q.storage&&(T+=C-dt),X.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),X.__offset=T,T+=Q.storage}}}const v=T%C;return v>0&&(T+=C-v),b.__size=T,b.__cache={},this}function m(b){const S={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(S.boundary=4,S.storage=4):b.isVector2?(S.boundary=8,S.storage=8):b.isVector3||b.isColor?(S.boundary=16,S.storage=12):b.isVector4?(S.boundary=16,S.storage=16):b.isMatrix3?(S.boundary=48,S.storage=48):b.isMatrix4?(S.boundary=64,S.storage=64):b.isTexture?Pt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(b)?(S.boundary=16,S.storage=b.byteLength):Pt("WebGLRenderer: Unsupported uniform value type.",b),S}function y(b){const S=b.target;S.removeEventListener("dispose",y);const T=o.indexOf(S.__bindingPointIndex);o.splice(T,1),n.deleteBuffer(r[S.id]),delete r[S.id],delete s[S.id]}function E(){for(const b in r)n.deleteBuffer(r[b]);o=[],r={},s={}}return{bind:l,update:c,dispose:E}}const LA=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let $n=null;function DA(){return $n===null&&($n=new bE(LA,16,16,Ur,Ri),$n.name="DFG_LUT",$n.minFilter=He,$n.magFilter=He,$n.wrapS=yi,$n.wrapT=yi,$n.generateMipmaps=!1,$n.needsUpdate=!0),$n}class IA{constructor(t={}){const{canvas:e=US(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=Un}=t;this.isWebGLRenderer=!0;let _;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");_=i.getContextAttributes().alpha}else _=o;const g=f,p=new Set([Ru,Pu,Au]),m=new Set([Un,li,yo,wo,Tu,Cu]),y=new Uint32Array(4),E=new Int32Array(4),b=new V;let S=null,T=null;const C=[],v=[];let M=null;this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ni,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const P=this;let R=!1,D=null,H=null,X=null,U=null;this._outputColorSpace=gn;let G=0,O=0,$=null,Q=-1,it=null;const et=new be,dt=new be;let Rt=null;const kt=new Jt(0);let Lt=0,Z=e.width,rt=e.height,tt=1,At=null,St=null;const Tt=new be(0,0,Z,rt),we=new be(0,0,Z,rt);let Bt=!1;const ne=new U_;let $t=!1,Gt=!1;const Ce=new Te,De=new V,Fe=new be,Ve={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let _e=!1;function Ae(){return $===null?tt:1}let I=i;function en(w,N){return e.getContext(w,N)}try{const w={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Eu}`),e.addEventListener("webglcontextlost",ge,!1),e.addEventListener("webglcontextrestored",ae,!1),e.addEventListener("webglcontextcreationerror",Wn,!1),I===null){const N="webgl2";if(I=en(N,w),I===null)throw en(N)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(w){throw Xt("WebGLRenderer: "+w.message),w}let Qt,A,x,F,z,q,nt,ot,Y,J,at,yt,ht,lt,Mt,Ct,It,L,st,K,ct,mt,j;function bt(){Qt=new DC(I),Qt.init(),ct=new SA(I,Qt),A=new EC(I,Qt,t,ct),x=new yA(I,Qt),A.reversedDepthBuffer&&u&&x.buffers.depth.setReversed(!0),H=I.createFramebuffer(),X=I.createFramebuffer(),U=I.createFramebuffer(),F=new NC(I),z=new aA,q=new wA(I,Qt,x,z,A,ct,F),nt=new LC(P),ot=new BE(I),mt=new wC(I,ot),Y=new IC(I,ot,F,mt),J=new FC(I,Y,ot,mt,F),L=new OC(I,A,q),Mt=new MC(z),at=new oA(P,nt,Qt,A,mt,Mt),yt=new PA(P,z),ht=new cA,lt=new mA(Qt),It=new yC(P,nt,x,J,_,l),Ct=new bA(P,J,A),j=new RA(I,F,A,x),st=new SC(I,Qt,F),K=new UC(I,Qt,F),F.programs=at.programs,P.capabilities=A,P.extensions=Qt,P.properties=z,P.renderLists=ht,P.shadowMap=Ct,P.state=x,P.info=F}bt(),g!==Un&&(M=new BC(g,e.width,e.height,a,r,s));const vt=new CA(P,I);this.xr=vt,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const w=Qt.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=Qt.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return tt},this.setPixelRatio=function(w){w!==void 0&&(tt=w,this.setSize(Z,rt,!1))},this.getSize=function(w){return w.set(Z,rt)},this.setSize=function(w,N,W=!0){if(vt.isPresenting){Pt("WebGLRenderer: Can't change size while VR device is presenting.");return}Z=w,rt=N,e.width=Math.floor(w*tt),e.height=Math.floor(N*tt),W===!0&&(e.style.width=w+"px",e.style.height=N+"px"),M!==null&&M.setSize(e.width,e.height),this.setViewport(0,0,w,N)},this.getDrawingBufferSize=function(w){return w.set(Z*tt,rt*tt).floor()},this.setDrawingBufferSize=function(w,N,W){Z=w,rt=N,tt=W,e.width=Math.floor(w*W),e.height=Math.floor(N*W),this.setViewport(0,0,w,N)},this.setEffects=function(w){if(g===Un){Xt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(w){for(let N=0;N<w.length;N++)if(w[N].isOutputPass===!0){Pt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}M.setEffects(w||[])},this.getCurrentViewport=function(w){return w.copy(et)},this.getViewport=function(w){return w.copy(Tt)},this.setViewport=function(w,N,W,k){w.isVector4?Tt.set(w.x,w.y,w.z,w.w):Tt.set(w,N,W,k),x.viewport(et.copy(Tt).multiplyScalar(tt).round())},this.getScissor=function(w){return w.copy(we)},this.setScissor=function(w,N,W,k){w.isVector4?we.set(w.x,w.y,w.z,w.w):we.set(w,N,W,k),x.scissor(dt.copy(we).multiplyScalar(tt).round())},this.getScissorTest=function(){return Bt},this.setScissorTest=function(w){x.setScissorTest(Bt=w)},this.setOpaqueSort=function(w){At=w},this.setTransparentSort=function(w){St=w},this.getClearColor=function(w){return w.copy(It.getClearColor())},this.setClearColor=function(){It.setClearColor(...arguments)},this.getClearAlpha=function(){return It.getClearAlpha()},this.setClearAlpha=function(){It.setClearAlpha(...arguments)},this.clear=function(w=!0,N=!0,W=!0){let k=0;if(w){let B=!1;if($!==null){const pt=$.texture.format;B=p.has(pt)}if(B){const pt=$.texture.type,gt=m.has(pt),ft=It.getClearColor(),xt=It.getClearAlpha(),wt=ft.r,Ut=ft.g,Ot=ft.b;gt?(y[0]=wt,y[1]=Ut,y[2]=Ot,y[3]=xt,I.clearBufferuiv(I.COLOR,0,y)):(E[0]=wt,E[1]=Ut,E[2]=Ot,E[3]=xt,I.clearBufferiv(I.COLOR,0,E))}else k|=I.COLOR_BUFFER_BIT}N&&(k|=I.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),W&&(k|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k!==0&&I.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(w){w.setRenderer(this),D=w},this.dispose=function(){e.removeEventListener("webglcontextlost",ge,!1),e.removeEventListener("webglcontextrestored",ae,!1),e.removeEventListener("webglcontextcreationerror",Wn,!1),It.dispose(),ht.dispose(),lt.dispose(),z.dispose(),nt.dispose(),J.dispose(),mt.dispose(),j.dispose(),at.dispose(),vt.dispose(),vt.removeEventListener("sessionstart",Bu),vt.removeEventListener("sessionend",Vu),hr.stop()};function ge(w){w.preventDefault(),of("WebGLRenderer: Context Lost."),R=!0}function ae(){of("WebGLRenderer: Context Restored."),R=!1;const w=F.autoReset,N=Ct.enabled,W=Ct.autoUpdate,k=Ct.needsUpdate,B=Ct.type;bt(),F.autoReset=w,Ct.enabled=N,Ct.autoUpdate=W,Ct.needsUpdate=k,Ct.type=B}function Wn(w){Xt("WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Xn(w){const N=w.target;N.removeEventListener("dispose",Xn),ag(N)}function ag(w){lg(w),z.remove(w)}function lg(w){const N=z.get(w).programs;N!==void 0&&(N.forEach(function(W){at.releaseProgram(W)}),w.isShaderMaterial&&at.releaseShaderCache(w))}this.renderBufferDirect=function(w,N,W,k,B,pt){N===null&&(N=Ve);const gt=B.isMesh&&B.matrixWorld.determinantAffine()<0,ft=ug(w,N,W,k,B);x.setMaterial(k,gt);let xt=W.index,wt=1;if(k.wireframe===!0){if(xt=Y.getWireframeAttribute(W),xt===void 0)return;wt=2}const Ut=W.drawRange,Ot=W.attributes.position;let Et=Ut.start*wt,ee=(Ut.start+Ut.count)*wt;pt!==null&&(Et=Math.max(Et,pt.start*wt),ee=Math.min(ee,(pt.start+pt.count)*wt)),xt!==null?(Et=Math.max(Et,0),ee=Math.min(ee,xt.count)):Ot!=null&&(Et=Math.max(Et,0),ee=Math.min(ee,Ot.count));const Se=ee-Et;if(Se<0||Se===1/0)return;mt.setup(B,k,ft,W,xt);let ve,ie=st;if(xt!==null&&(ve=ot.get(xt),ie=K,ie.setIndex(ve)),B.isMesh)k.wireframe===!0?(x.setLineWidth(k.wireframeLinewidth*Ae()),ie.setMode(I.LINES)):ie.setMode(I.TRIANGLES);else if(B.isLine){let We=k.linewidth;We===void 0&&(We=1),x.setLineWidth(We*Ae()),B.isLineSegments?ie.setMode(I.LINES):B.isLineLoop?ie.setMode(I.LINE_LOOP):ie.setMode(I.LINE_STRIP)}else B.isPoints?ie.setMode(I.POINTS):B.isSprite&&ie.setMode(I.TRIANGLES);if(B.isBatchedMesh)if(Qt.get("WEBGL_multi_draw"))ie.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{const We=B._multiDrawStarts,_t=B._multiDrawCounts,fn=B._multiDrawCount,Wt=xt?ot.get(xt).bytesPerElement:1,An=z.get(k).currentProgram.getUniforms();for(let qn=0;qn<fn;qn++)An.setValue(I,"_gl_DrawID",qn),ie.render(We[qn]/Wt,_t[qn])}else if(B.isInstancedMesh)ie.renderInstances(Et,Se,B.count);else if(W.isInstancedBufferGeometry){const We=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,_t=Math.min(W.instanceCount,We);ie.renderInstances(Et,Se,_t)}else ie.render(Et,Se)};function ku(w,N,W){w.transparent===!0&&w.side===xi&&w.forceSinglePass===!1?(w.side=hn,w.needsUpdate=!0,zo(w,N,W),w.side=ar,w.needsUpdate=!0,zo(w,N,W),w.side=xi):zo(w,N,W)}this.compile=function(w,N,W=null){W===null&&(W=w),T=lt.get(W),T.init(N),v.push(T),W.traverseVisible(function(B){B.isLight&&B.layers.test(N.layers)&&(T.pushLight(B),B.castShadow&&T.pushShadow(B))}),w!==W&&w.traverseVisible(function(B){B.isLight&&B.layers.test(N.layers)&&(T.pushLight(B),B.castShadow&&T.pushShadow(B))}),T.setupLights();const k=new Set;return w.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;const pt=B.material;if(pt)if(Array.isArray(pt))for(let gt=0;gt<pt.length;gt++){const ft=pt[gt];ku(ft,W,B),k.add(ft)}else ku(pt,W,B),k.add(pt)}),T=v.pop(),k},this.compileAsync=function(w,N,W=null){const k=this.compile(w,N,W);return new Promise(B=>{function pt(){if(k.forEach(function(gt){z.get(gt).currentProgram.isReady()&&k.delete(gt)}),k.size===0){B(w);return}setTimeout(pt,10)}Qt.get("KHR_parallel_shader_compile")!==null?pt():setTimeout(pt,10)})};let bl=null;function cg(w){bl&&bl(w)}function Bu(){hr.stop()}function Vu(){hr.start()}const hr=new z_;hr.setAnimationLoop(cg),typeof self<"u"&&hr.setContext(self),this.setAnimationLoop=function(w){bl=w,vt.setAnimationLoop(w),w===null?hr.stop():hr.start()},vt.addEventListener("sessionstart",Bu),vt.addEventListener("sessionend",Vu),this.render=function(w,N){if(N!==void 0&&N.isCamera!==!0){Xt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;D!==null&&D.renderStart(w,N);const W=vt.enabled===!0&&vt.isPresenting===!0,k=M!==null&&($===null||W)&&M.begin(P,$);if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),vt.enabled===!0&&vt.isPresenting===!0&&(M===null||M.isCompositing()===!1)&&(vt.cameraAutoUpdate===!0&&vt.updateCamera(N),N=vt.getCamera()),w.isScene===!0&&w.onBeforeRender(P,w,N,$),T=lt.get(w,v.length),T.init(N),T.state.textureUnits=q.getTextureUnits(),v.push(T),Ce.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),ne.setFromProjectionMatrix(Ce,ei,N.reversedDepth),Gt=this.localClippingEnabled,$t=Mt.init(this.clippingPlanes,Gt),S=ht.get(w,C.length),S.init(),C.push(S),vt.enabled===!0&&vt.isPresenting===!0){const gt=P.xr.getDepthSensingMesh();gt!==null&&yl(gt,N,-1/0,P.sortObjects)}yl(w,N,0,P.sortObjects),S.finish(),P.sortObjects===!0&&S.sort(At,St,N.reversedDepth),_e=vt.enabled===!1||vt.isPresenting===!1||vt.hasDepthSensing()===!1,_e&&It.addToRenderList(S,w),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),$t===!0&&Mt.beginShadows();const B=T.state.shadowsArray;if(Ct.render(B,w,N),$t===!0&&Mt.endShadows(),(k&&M.hasRenderPass())===!1){const gt=S.opaque,ft=S.transmissive;if(T.setupLights(),N.isArrayCamera){const xt=N.cameras;if(ft.length>0)for(let wt=0,Ut=xt.length;wt<Ut;wt++){const Ot=xt[wt];Hu(gt,ft,w,Ot)}_e&&It.render(w);for(let wt=0,Ut=xt.length;wt<Ut;wt++){const Ot=xt[wt];zu(S,w,Ot,Ot.viewport)}}else ft.length>0&&Hu(gt,ft,w,N),_e&&It.render(w),zu(S,w,N)}$!==null&&O===0&&(q.updateMultisampleRenderTarget($),q.updateRenderTargetMipmap($)),k&&M.end(P),w.isScene===!0&&w.onAfterRender(P,w,N),mt.resetDefaultState(),Q=-1,it=null,v.pop(),v.length>0?(T=v[v.length-1],q.setTextureUnits(T.state.textureUnits),$t===!0&&Mt.setGlobalState(P.clippingPlanes,T.state.camera)):T=null,C.pop(),C.length>0?S=C[C.length-1]:S=null,D!==null&&D.renderEnd()};function yl(w,N,W,k){if(w.visible===!1)return;if(w.layers.test(N.layers)){if(w.isGroup)W=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(N);else if(w.isLightProbeGrid)T.pushLightProbeGrid(w);else if(w.isLight)T.pushLight(w),w.castShadow&&T.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||ne.intersectsSprite(w)){k&&Fe.setFromMatrixPosition(w.matrixWorld).applyMatrix4(Ce);const gt=J.update(w),ft=w.material;ft.visible&&S.push(w,gt,ft,W,Fe.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||ne.intersectsObject(w))){const gt=J.update(w),ft=w.material;if(k&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Fe.copy(w.boundingSphere.center)):(gt.boundingSphere===null&&gt.computeBoundingSphere(),Fe.copy(gt.boundingSphere.center)),Fe.applyMatrix4(w.matrixWorld).applyMatrix4(Ce)),Array.isArray(ft)){const xt=gt.groups;for(let wt=0,Ut=xt.length;wt<Ut;wt++){const Ot=xt[wt],Et=ft[Ot.materialIndex];Et&&Et.visible&&S.push(w,gt,Et,W,Fe.z,Ot)}}else ft.visible&&S.push(w,gt,ft,W,Fe.z,null)}}const pt=w.children;for(let gt=0,ft=pt.length;gt<ft;gt++)yl(pt[gt],N,W,k)}function zu(w,N,W,k){const{opaque:B,transmissive:pt,transparent:gt}=w;T.setupLightsView(W),$t===!0&&Mt.setGlobalState(P.clippingPlanes,W),k&&x.viewport(et.copy(k)),B.length>0&&Vo(B,N,W),pt.length>0&&Vo(pt,N,W),gt.length>0&&Vo(gt,N,W),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function Hu(w,N,W,k){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[k.id]===void 0){const Et=Qt.has("EXT_color_buffer_half_float")||Qt.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[k.id]=new ii(1,1,{generateMipmaps:!0,type:Et?Ri:Un,minFilter:Sr,samples:Math.max(4,A.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:zt.workingColorSpace})}const pt=T.state.transmissionRenderTarget[k.id],gt=k.viewport||et;pt.setSize(gt.z*P.transmissionResolutionScale,gt.w*P.transmissionResolutionScale);const ft=P.getRenderTarget(),xt=P.getActiveCubeFace(),wt=P.getActiveMipmapLevel();P.setRenderTarget(pt),P.getClearColor(kt),Lt=P.getClearAlpha(),Lt<1&&P.setClearColor(16777215,.5),P.clear(),_e&&It.render(W);const Ut=P.toneMapping;P.toneMapping=ni;const Ot=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),T.setupLightsView(k),$t===!0&&Mt.setGlobalState(P.clippingPlanes,k),Vo(w,W,k),q.updateMultisampleRenderTarget(pt),q.updateRenderTargetMipmap(pt),Qt.has("WEBGL_multisampled_render_to_texture")===!1){let Et=!1;for(let ee=0,Se=N.length;ee<Se;ee++){const ve=N[ee],{object:ie,geometry:We,material:_t,group:fn}=ve;if(_t.side===xi&&ie.layers.test(k.layers)){const Wt=_t.side;_t.side=hn,_t.needsUpdate=!0,Gu(ie,W,k,We,_t,fn),_t.side=Wt,_t.needsUpdate=!0,Et=!0}}Et===!0&&(q.updateMultisampleRenderTarget(pt),q.updateRenderTargetMipmap(pt))}P.setRenderTarget(ft,xt,wt),P.setClearColor(kt,Lt),Ot!==void 0&&(k.viewport=Ot),P.toneMapping=Ut}function Vo(w,N,W){const k=N.isScene===!0?N.overrideMaterial:null;for(let B=0,pt=w.length;B<pt;B++){const gt=w[B],{object:ft,geometry:xt,group:wt}=gt;let Ut=gt.material;Ut.allowOverride===!0&&k!==null&&(Ut=k),ft.layers.test(W.layers)&&Gu(ft,N,W,xt,Ut,wt)}}function Gu(w,N,W,k,B,pt){w.onBeforeRender(P,N,W,k,B,pt),w.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),B.onBeforeRender(P,N,W,k,w,pt),B.transparent===!0&&B.side===xi&&B.forceSinglePass===!1?(B.side=hn,B.needsUpdate=!0,P.renderBufferDirect(W,N,k,B,w,pt),B.side=ar,B.needsUpdate=!0,P.renderBufferDirect(W,N,k,B,w,pt),B.side=xi):P.renderBufferDirect(W,N,k,B,w,pt),w.onAfterRender(P,N,W,k,B,pt)}function zo(w,N,W){N.isScene!==!0&&(N=Ve);const k=z.get(w),B=T.state.lights,pt=T.state.shadowsArray,gt=B.state.version,ft=at.getParameters(w,B.state,pt,N,W,T.state.lightProbeGridArray),xt=at.getProgramCacheKey(ft);let wt=k.programs;k.environment=w.isMeshStandardMaterial||w.isMeshLambertMaterial||w.isMeshPhongMaterial?N.environment:null,k.fog=N.fog;const Ut=w.isMeshStandardMaterial||w.isMeshLambertMaterial&&!w.envMap||w.isMeshPhongMaterial&&!w.envMap;k.envMap=nt.get(w.envMap||k.environment,Ut),k.envMapRotation=k.environment!==null&&w.envMap===null?N.environmentRotation:w.envMapRotation,wt===void 0&&(w.addEventListener("dispose",Xn),wt=new Map,k.programs=wt);let Ot=wt.get(xt);if(Ot!==void 0){if(k.currentProgram===Ot&&k.lightsStateVersion===gt)return Xu(w,ft),Ot}else ft.uniforms=at.getUniforms(w),D!==null&&w.isNodeMaterial&&D.build(w,W,ft),w.onBeforeCompile(ft,P),Ot=at.acquireProgram(ft,xt),wt.set(xt,Ot),k.uniforms=ft.uniforms;const Et=k.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Et.clippingPlanes=Mt.uniform),Xu(w,ft),k.needsLights=fg(w),k.lightsStateVersion=gt,k.needsLights&&(Et.ambientLightColor.value=B.state.ambient,Et.lightProbe.value=B.state.probe,Et.directionalLights.value=B.state.directional,Et.directionalLightShadows.value=B.state.directionalShadow,Et.spotLights.value=B.state.spot,Et.spotLightShadows.value=B.state.spotShadow,Et.rectAreaLights.value=B.state.rectArea,Et.ltc_1.value=B.state.rectAreaLTC1,Et.ltc_2.value=B.state.rectAreaLTC2,Et.pointLights.value=B.state.point,Et.pointLightShadows.value=B.state.pointShadow,Et.hemisphereLights.value=B.state.hemi,Et.directionalShadowMatrix.value=B.state.directionalShadowMatrix,Et.spotLightMatrix.value=B.state.spotLightMatrix,Et.spotLightMap.value=B.state.spotLightMap,Et.pointShadowMatrix.value=B.state.pointShadowMatrix),k.lightProbeGrid=T.state.lightProbeGridArray.length>0,k.currentProgram=Ot,k.uniformsList=null,Ot}function Wu(w){if(w.uniformsList===null){const N=w.currentProgram.getUniforms();w.uniformsList=La.seqWithValue(N.seq,w.uniforms)}return w.uniformsList}function Xu(w,N){const W=z.get(w);W.outputColorSpace=N.outputColorSpace,W.batching=N.batching,W.batchingColor=N.batchingColor,W.instancing=N.instancing,W.instancingColor=N.instancingColor,W.instancingMorph=N.instancingMorph,W.skinning=N.skinning,W.morphTargets=N.morphTargets,W.morphNormals=N.morphNormals,W.morphColors=N.morphColors,W.morphTargetsCount=N.morphTargetsCount,W.numClippingPlanes=N.numClippingPlanes,W.numIntersection=N.numClipIntersection,W.vertexAlphas=N.vertexAlphas,W.vertexTangents=N.vertexTangents,W.toneMapping=N.toneMapping}function hg(w,N){if(w.length===0)return null;if(w.length===1)return w[0].texture!==null?w[0]:null;b.setFromMatrixPosition(N.matrixWorld);for(let W=0,k=w.length;W<k;W++){const B=w[W];if(B.texture!==null&&B.boundingBox.containsPoint(b))return B}return null}function ug(w,N,W,k,B){N.isScene!==!0&&(N=Ve),q.resetTextureUnits();const pt=N.fog,gt=k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial?N.environment:null,ft=$===null?P.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:zt.workingColorSpace,xt=k.isMeshStandardMaterial||k.isMeshLambertMaterial&&!k.envMap||k.isMeshPhongMaterial&&!k.envMap,wt=nt.get(k.envMap||gt,xt),Ut=k.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Ot=!!W.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),Et=!!W.morphAttributes.position,ee=!!W.morphAttributes.normal,Se=!!W.morphAttributes.color;let ve=ni;k.toneMapped&&($===null||$.isXRRenderTarget===!0)&&(ve=P.toneMapping);const ie=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,We=ie!==void 0?ie.length:0,_t=z.get(k),fn=T.state.lights;if($t===!0&&(Gt===!0||w!==it)){const le=w===it&&k.id===Q;Mt.setState(k,w,le)}let Wt=!1;k.version===_t.__version?(_t.needsLights&&_t.lightsStateVersion!==fn.state.version||_t.outputColorSpace!==ft||B.isBatchedMesh&&_t.batching===!1||!B.isBatchedMesh&&_t.batching===!0||B.isBatchedMesh&&_t.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&_t.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&_t.instancing===!1||!B.isInstancedMesh&&_t.instancing===!0||B.isSkinnedMesh&&_t.skinning===!1||!B.isSkinnedMesh&&_t.skinning===!0||B.isInstancedMesh&&_t.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&_t.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&_t.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&_t.instancingMorph===!1&&B.morphTexture!==null||_t.envMap!==wt||k.fog===!0&&_t.fog!==pt||_t.numClippingPlanes!==void 0&&(_t.numClippingPlanes!==Mt.numPlanes||_t.numIntersection!==Mt.numIntersection)||_t.vertexAlphas!==Ut||_t.vertexTangents!==Ot||_t.morphTargets!==Et||_t.morphNormals!==ee||_t.morphColors!==Se||_t.toneMapping!==ve||_t.morphTargetsCount!==We||!!_t.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(Wt=!0):(Wt=!0,_t.__version=k.version);let An=_t.currentProgram;Wt===!0&&(An=zo(k,N,B),D&&k.isNodeMaterial&&D.onUpdateProgram(k,An,_t));let qn=!1,Ui=!1,zr=!1;const re=An.getUniforms(),Ee=_t.uniforms;if(x.useProgram(An.program)&&(qn=!0,Ui=!0,zr=!0),k.id!==Q&&(Q=k.id,Ui=!0),_t.needsLights){const le=hg(T.state.lightProbeGridArray,B);_t.lightProbeGrid!==le&&(_t.lightProbeGrid=le,Ui=!0)}if(qn||it!==w){x.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),re.setValue(I,"projectionMatrix",w.projectionMatrix),re.setValue(I,"viewMatrix",w.matrixWorldInverse);const Oi=re.map.cameraPosition;Oi!==void 0&&Oi.setValue(I,De.setFromMatrixPosition(w.matrixWorld)),A.logarithmicDepthBuffer&&re.setValue(I,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&re.setValue(I,"isOrthographic",w.isOrthographicCamera===!0),it!==w&&(it=w,Ui=!0,zr=!0)}if(_t.needsLights&&(fn.state.directionalShadowMap.length>0&&re.setValue(I,"directionalShadowMap",fn.state.directionalShadowMap,q),fn.state.spotShadowMap.length>0&&re.setValue(I,"spotShadowMap",fn.state.spotShadowMap,q),fn.state.pointShadowMap.length>0&&re.setValue(I,"pointShadowMap",fn.state.pointShadowMap,q)),B.isSkinnedMesh){re.setOptional(I,B,"bindMatrix"),re.setOptional(I,B,"bindMatrixInverse");const le=B.skeleton;le&&(le.boneTexture===null&&le.computeBoneTexture(),re.setValue(I,"boneTexture",le.boneTexture,q))}B.isBatchedMesh&&(re.setOptional(I,B,"batchingTexture"),re.setValue(I,"batchingTexture",B._matricesTexture,q),re.setOptional(I,B,"batchingIdTexture"),re.setValue(I,"batchingIdTexture",B._indirectTexture,q),re.setOptional(I,B,"batchingColorTexture"),B._colorsTexture!==null&&re.setValue(I,"batchingColorTexture",B._colorsTexture,q));const Ni=W.morphAttributes;if((Ni.position!==void 0||Ni.normal!==void 0||Ni.color!==void 0)&&L.update(B,W,An),(Ui||_t.receiveShadow!==B.receiveShadow)&&(_t.receiveShadow=B.receiveShadow,re.setValue(I,"receiveShadow",B.receiveShadow)),(k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial)&&k.envMap===null&&N.environment!==null&&(Ee.envMapIntensity.value=N.environmentIntensity),Ee.dfgLUT!==void 0&&(Ee.dfgLUT.value=DA()),Ui){if(re.setValue(I,"toneMappingExposure",P.toneMappingExposure),_t.needsLights&&dg(Ee,zr),pt&&k.fog===!0&&yt.refreshFogUniforms(Ee,pt),yt.refreshMaterialUniforms(Ee,k,tt,rt,T.state.transmissionRenderTarget[w.id]),_t.needsLights&&_t.lightProbeGrid){const le=_t.lightProbeGrid;Ee.probesSH.value=le.texture,Ee.probesMin.value.copy(le.boundingBox.min),Ee.probesMax.value.copy(le.boundingBox.max),Ee.probesResolution.value.copy(le.resolution)}La.upload(I,Wu(_t),Ee,q)}if(k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(La.upload(I,Wu(_t),Ee,q),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&re.setValue(I,"center",B.center),re.setValue(I,"modelViewMatrix",B.modelViewMatrix),re.setValue(I,"normalMatrix",B.normalMatrix),re.setValue(I,"modelMatrix",B.matrixWorld),k.uniformsGroups!==void 0){const le=k.uniformsGroups;for(let Oi=0,Hr=le.length;Oi<Hr;Oi++){const qu=le[Oi];j.update(qu,An),j.bind(qu,An)}}return An}function dg(w,N){w.ambientLightColor.needsUpdate=N,w.lightProbe.needsUpdate=N,w.directionalLights.needsUpdate=N,w.directionalLightShadows.needsUpdate=N,w.pointLights.needsUpdate=N,w.pointLightShadows.needsUpdate=N,w.spotLights.needsUpdate=N,w.spotLightShadows.needsUpdate=N,w.rectAreaLights.needsUpdate=N,w.hemisphereLights.needsUpdate=N}function fg(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return G},this.getActiveMipmapLevel=function(){return O},this.getRenderTarget=function(){return $},this.setRenderTargetTextures=function(w,N,W){const k=z.get(w);k.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,k.__autoAllocateDepthBuffer===!1&&(k.__useRenderToTexture=!1),z.get(w.texture).__webglTexture=N,z.get(w.depthTexture).__webglTexture=k.__autoAllocateDepthBuffer?void 0:W,k.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,N){const W=z.get(w);W.__webglFramebuffer=N,W.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(w,N=0,W=0){$=w,G=N,O=W;let k=null,B=!1,pt=!1;if(w){const ft=z.get(w);if(ft.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(I.FRAMEBUFFER,ft.__webglFramebuffer),et.copy(w.viewport),dt.copy(w.scissor),Rt=w.scissorTest,x.viewport(et),x.scissor(dt),x.setScissorTest(Rt),Q=-1;return}else if(ft.__webglFramebuffer===void 0)q.setupRenderTarget(w);else if(ft.__hasExternalTextures)q.rebindTextures(w,z.get(w.texture).__webglTexture,z.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const Ut=w.depthTexture;if(ft.__boundDepthTexture!==Ut){if(Ut!==null&&z.has(Ut)&&(w.width!==Ut.image.width||w.height!==Ut.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");q.setupDepthRenderbuffer(w)}}const xt=w.texture;(xt.isData3DTexture||xt.isDataArrayTexture||xt.isCompressedArrayTexture)&&(pt=!0);const wt=z.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(wt[N])?k=wt[N][W]:k=wt[N],B=!0):w.samples>0&&q.useMultisampledRTT(w)===!1?k=z.get(w).__webglMultisampledFramebuffer:Array.isArray(wt)?k=wt[W]:k=wt,et.copy(w.viewport),dt.copy(w.scissor),Rt=w.scissorTest}else et.copy(Tt).multiplyScalar(tt).floor(),dt.copy(we).multiplyScalar(tt).floor(),Rt=Bt;if(W!==0&&(k=H),x.bindFramebuffer(I.FRAMEBUFFER,k)&&x.drawBuffers(w,k),x.viewport(et),x.scissor(dt),x.setScissorTest(Rt),B){const ft=z.get(w.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+N,ft.__webglTexture,W)}else if(pt){const ft=N;for(let xt=0;xt<w.textures.length;xt++){const wt=z.get(w.textures[xt]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+xt,wt.__webglTexture,W,ft)}}else if(w!==null&&W!==0){const ft=z.get(w.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,ft.__webglTexture,W)}Q=-1},this.readRenderTargetPixels=function(w,N,W,k,B,pt,gt,ft=0){if(!(w&&w.isWebGLRenderTarget)){Xt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let xt=z.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&gt!==void 0&&(xt=xt[gt]),xt){x.bindFramebuffer(I.FRAMEBUFFER,xt);try{const wt=w.textures[ft],Ut=wt.format,Ot=wt.type;if(w.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+ft),!A.textureFormatReadable(Ut)){Xt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!A.textureTypeReadable(Ot)){Xt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=w.width-k&&W>=0&&W<=w.height-B&&I.readPixels(N,W,k,B,ct.convert(Ut),ct.convert(Ot),pt)}finally{const wt=$!==null?z.get($).__webglFramebuffer:null;x.bindFramebuffer(I.FRAMEBUFFER,wt)}}},this.readRenderTargetPixelsAsync=async function(w,N,W,k,B,pt,gt,ft=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let xt=z.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&gt!==void 0&&(xt=xt[gt]),xt)if(N>=0&&N<=w.width-k&&W>=0&&W<=w.height-B){x.bindFramebuffer(I.FRAMEBUFFER,xt);const wt=w.textures[ft],Ut=wt.format,Ot=wt.type;if(w.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+ft),!A.textureFormatReadable(Ut))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!A.textureTypeReadable(Ot))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Et=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Et),I.bufferData(I.PIXEL_PACK_BUFFER,pt.byteLength,I.STREAM_READ),I.readPixels(N,W,k,B,ct.convert(Ut),ct.convert(Ot),0);const ee=$!==null?z.get($).__webglFramebuffer:null;x.bindFramebuffer(I.FRAMEBUFFER,ee);const Se=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await NS(I,Se,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Et),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,pt),I.deleteBuffer(Et),I.deleteSync(Se),pt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,N=null,W=0){const k=Math.pow(2,-W),B=Math.floor(w.image.width*k),pt=Math.floor(w.image.height*k),gt=N!==null?N.x:0,ft=N!==null?N.y:0;q.setTexture2D(w,0),I.copyTexSubImage2D(I.TEXTURE_2D,W,0,0,gt,ft,B,pt),x.unbindTexture()},this.copyTextureToTexture=function(w,N,W=null,k=null,B=0,pt=0){let gt,ft,xt,wt,Ut,Ot,Et,ee,Se;const ve=w.isCompressedTexture?w.mipmaps[pt]:w.image;if(W!==null)gt=W.max.x-W.min.x,ft=W.max.y-W.min.y,xt=W.isBox3?W.max.z-W.min.z:1,wt=W.min.x,Ut=W.min.y,Ot=W.isBox3?W.min.z:0;else{const Ee=Math.pow(2,-B);gt=Math.floor(ve.width*Ee),ft=Math.floor(ve.height*Ee),w.isDataArrayTexture?xt=ve.depth:w.isData3DTexture?xt=Math.floor(ve.depth*Ee):xt=1,wt=0,Ut=0,Ot=0}k!==null?(Et=k.x,ee=k.y,Se=k.z):(Et=0,ee=0,Se=0);const ie=ct.convert(N.format),We=ct.convert(N.type);let _t;N.isData3DTexture?(q.setTexture3D(N,0),_t=I.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(q.setTexture2DArray(N,0),_t=I.TEXTURE_2D_ARRAY):(q.setTexture2D(N,0),_t=I.TEXTURE_2D),x.activeTexture(I.TEXTURE0),x.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,N.flipY),x.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),x.pixelStorei(I.UNPACK_ALIGNMENT,N.unpackAlignment);const fn=x.getParameter(I.UNPACK_ROW_LENGTH),Wt=x.getParameter(I.UNPACK_IMAGE_HEIGHT),An=x.getParameter(I.UNPACK_SKIP_PIXELS),qn=x.getParameter(I.UNPACK_SKIP_ROWS),Ui=x.getParameter(I.UNPACK_SKIP_IMAGES);x.pixelStorei(I.UNPACK_ROW_LENGTH,ve.width),x.pixelStorei(I.UNPACK_IMAGE_HEIGHT,ve.height),x.pixelStorei(I.UNPACK_SKIP_PIXELS,wt),x.pixelStorei(I.UNPACK_SKIP_ROWS,Ut),x.pixelStorei(I.UNPACK_SKIP_IMAGES,Ot);const zr=w.isDataArrayTexture||w.isData3DTexture,re=N.isDataArrayTexture||N.isData3DTexture;if(w.isDepthTexture){const Ee=z.get(w),Ni=z.get(N),le=z.get(Ee.__renderTarget),Oi=z.get(Ni.__renderTarget);x.bindFramebuffer(I.READ_FRAMEBUFFER,le.__webglFramebuffer),x.bindFramebuffer(I.DRAW_FRAMEBUFFER,Oi.__webglFramebuffer);for(let Hr=0;Hr<xt;Hr++)zr&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,z.get(w).__webglTexture,B,Ot+Hr),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,z.get(N).__webglTexture,pt,Se+Hr)),I.blitFramebuffer(wt,Ut,gt,ft,Et,ee,gt,ft,I.DEPTH_BUFFER_BIT,I.NEAREST);x.bindFramebuffer(I.READ_FRAMEBUFFER,null),x.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(B!==0||w.isRenderTargetTexture||z.has(w)){const Ee=z.get(w),Ni=z.get(N);x.bindFramebuffer(I.READ_FRAMEBUFFER,X),x.bindFramebuffer(I.DRAW_FRAMEBUFFER,U);for(let le=0;le<xt;le++)zr?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Ee.__webglTexture,B,Ot+le):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Ee.__webglTexture,B),re?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Ni.__webglTexture,pt,Se+le):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Ni.__webglTexture,pt),B!==0?I.blitFramebuffer(wt,Ut,gt,ft,Et,ee,gt,ft,I.COLOR_BUFFER_BIT,I.NEAREST):re?I.copyTexSubImage3D(_t,pt,Et,ee,Se+le,wt,Ut,gt,ft):I.copyTexSubImage2D(_t,pt,Et,ee,wt,Ut,gt,ft);x.bindFramebuffer(I.READ_FRAMEBUFFER,null),x.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else re?w.isDataTexture||w.isData3DTexture?I.texSubImage3D(_t,pt,Et,ee,Se,gt,ft,xt,ie,We,ve.data):N.isCompressedArrayTexture?I.compressedTexSubImage3D(_t,pt,Et,ee,Se,gt,ft,xt,ie,ve.data):I.texSubImage3D(_t,pt,Et,ee,Se,gt,ft,xt,ie,We,ve):w.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,pt,Et,ee,gt,ft,ie,We,ve.data):w.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,pt,Et,ee,ve.width,ve.height,ie,ve.data):I.texSubImage2D(I.TEXTURE_2D,pt,Et,ee,gt,ft,ie,We,ve);x.pixelStorei(I.UNPACK_ROW_LENGTH,fn),x.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Wt),x.pixelStorei(I.UNPACK_SKIP_PIXELS,An),x.pixelStorei(I.UNPACK_SKIP_ROWS,qn),x.pixelStorei(I.UNPACK_SKIP_IMAGES,Ui),pt===0&&N.generateMipmaps&&I.generateMipmap(_t),x.unbindTexture()},this.initRenderTarget=function(w){z.get(w).__webglFramebuffer===void 0&&q.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?q.setTextureCube(w,0):w.isData3DTexture?q.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?q.setTexture2DArray(w,0):q.setTexture2D(w,0),x.unbindTexture()},this.resetState=function(){G=0,O=0,$=null,x.reset(),mt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ei}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=zt._getDrawingBufferColorSpace(t),e.unpackColorSpace=zt._getUnpackColorSpace()}}function Gn(n){return typeof n!="string"?n:Dn[n]?Dn[n]:n.charAt(0)==="M"||n.charAt(0)==="m"||n.includes(",")?Br.create(n,n):n}/*!
 * Usagi Grid Scroll 1.0.5
 * Author: Kenta Toshikura
 * Last update: 2026/9/4
 * Require: gsap
*/class UA{constructor(t={}){if(this.ready=!1,this.stopped=!0,this.props=t,this.$html=document.querySelector("html"),this.$html.classList.add("is-usg-grid-scroll"),this.wrapElem=t.el??document.querySelector(".usg-grid"),this.bodyClassName=t.body??".usg-grid-body",this.blockClassName=t.block??".usg-grid-block",this.bodyElem=this.wrapElem.querySelector(this.bodyClassName),!this.bodyElem||(this.block={origin:this.wrapElem.querySelectorAll(this.blockClassName),clone:null},!this.block.origin))return!1;this.detail={x:0,y:0},this.delta1={x:0,y:0},this.delta2={x:0,y:0},this.speed=t.speed??100,this.ease=t.ease?t.ease:.1,this.accelerationEnable=t.accelerationEnable??!0,this.accelerationDuration=t.accelerationDuration??6,this.accelerationEase=t.accelerationEase??"expo.out",this.acceleration={delta:{x:0,y:0},hitory:[],max:1,tween:null,pow0:{x:0,y:0,d:0},pow1:{x:0,y:0,d:0},dir:{x:0,y:0}},this.position={x:0,y:0},this.scroll={dir:"down",progress:0,loop:0,x:0,y:0,top:0,left:0},this.autoscroll={x:0,y:0},t.autoscroll&&(this.autoscroll=t.autoscroll),this.autoscrollOffset={x:0,y:0},this.autoscrollProgress=1,this.events={};const e=t?.timers?.complete?Number(t.timers.complete):30,i=t?.timers?.resize?Number(t.timers.resize):500;this.timers={complete:{timer:null,wait:e},resize:{timer:null,wait:i}},this.touch={ratio:t.touchRatio??1.5,ease:t.touchEase??.125,active:!1,delta:{x:0,y:0},start:{x:0,y:0,delta:{x:0,y:0}},dist:{x:0,y:0},ing:{x:0,y:0},dir:{x:0,y:0},throw:{event:null,buffer:{x:0,y:0}}},this.array=[],this.content={width:0,height:0};let r=t?.aspect?.x?Math.max(t?.aspect?.x,1):1,s=t?.aspect?.y?Math.max(t?.aspect?.y,1):1;this.aspect={x:r,y:s},this.grid=t.grid??5,this.scale=t.scale??1,this.autoScaleEnable=t.autoScale??!0,this.autoScale=1,this.childWidth=0,this.childHeight=0,this.totalWidth=0,this.totalHeight=0,this.translate={x:0,y:0},this.block.origin.length&&this.bodyElem&&(this.runRabbit(),this.ready=!0,this.stopped=!1),typeof t.onUpdateBefore=="function"&&(this.onUpdateBefore=()=>t.onUpdateBefore(this)),typeof t.onUpdateAfter=="function"&&(this.onUpdateAfter=()=>t.onUpdateAfter(this)),typeof t.onDragStart=="function"&&(this.onDragStart=()=>t.onDragStart(this)),typeof t.onDragging=="function"&&(this.onDragging=()=>t.onDragging(this)),typeof t.onDragEnd=="function"&&(this.onDragEnd=()=>t.onDragEnd(this))}stop(){this.stopped=!0}start(){this.stopped=!1}getRandom(t,e){let i=[];for(;i.length<e;){const r=t.slice();let s=r.length;for(let o=s-1;o>0;o--){const a=Math.floor(Math.random()*(o+1));[r[o],r[a]]=[r[a],r[o]]}i=i.concat(r)}return i.slice(0,e)}getCloneSource(t,e,i){const r=Math.floor(i/this.grid),s=i%this.grid,o=[];if(s>0&&o.push(i-1),s===this.grid-1&&o.push(r*this.grid),r>0){const u=r-1;o.push(u*this.grid+s),o.push(u*this.grid+(s+this.grid-1)%this.grid),o.push(u*this.grid+(s+1)%this.grid)}r===this.grid-1&&(o.push(s),o.push((s+this.grid-1)%this.grid),o.push((s+1)%this.grid));const a=new Set(o.map(u=>e[u])),l=t.map((u,f)=>e.filter(_=>_===f).length),c=t.map((u,f)=>({origin:u,index:f})).filter(({index:u})=>!a.has(u));if(!c.length)throw new Error("UsagiGridScroll could not place a non-adjacent clone.");const h=Math.min(...c.map(({index:u})=>l[u])),d=c.filter(({index:u})=>l[u]===h);return d[Math.floor(Math.random()*d.length)]}runRabbit(){this.initElements(),this.initEvents(),this.resize()}initElements(){const t=this.grid*this.grid-this.block.origin.length;if(t!=0)if(t>0){const i=[...this.block.origin],r=i.map((s,o)=>o);for(var e=0;e<t;e++){const s=this.getCloneSource(i,r,r.length),o=s.origin.cloneNode(!0);o.classList.add("is-clone"),this.bodyElem.appendChild(o),r.push(s.index)}}else{const i=Math.abs(t),r=[...this.bodyElem.querySelectorAll(this.blockClassName)];this.getRandom(r,i).forEach(o=>{this.bodyElem.removeChild(o)})}this.block.clone=this.wrapElem.querySelectorAll(this.blockClassName),this.array=[],this.block.clone.forEach((i,r)=>{this.array.push({el:i,x:0,y:0,left:0,top:0,inview:!1,min:{x:0,y:0},max:{x:0,y:0},rect:{width:0,height:0,top:0,left:0},position:{x:0,y:0}})}),this.setPosition()}setPosition(){let t=0;for(let e=0;e<this.grid;e++)for(let i=0;i<this.grid;i++){const r=this.array[t];r&&(r.position.x=e,r.position.y=i,r.el.dataset.x=e,r.el.dataset.y=i,t++)}}getDetail(t){let e=0;const i=t.deltaX?-t.deltaX:t.wheelDeltaX?t.wheelDeltaX:-t.detail,r=t.deltaY?-t.deltaY:t.wheelDeltaY?t.wheelDeltaY:-t.detail,s=t.deltaY?-t.deltaY:t.wheelDelta?t.wheelDelta:-t.detail,o=t.detail;if(o?s?e=s/o/40*o>0?1:-1:e=-o/3:e=s/120,o)if(r){let a=i/o/40*o>0?1:-1,l=r/o/40*o>0?1:-1;return{x:a,y:l,d:e}}else{let a=0,l=-o/3;return{x:a,y:l,d:e}}else{let a=i/120,l=r/120;return{x:a,y:l,d:e}}}isWindowsOS(){return navigator.userAgent.toLowerCase().includes("windows")}onWheel(t){if(!this.ready||this.stopped)return!1;const e=this.getDetail(t);t.deltaX!==0&&t.preventDefault(),this.detail.x=e.x,this.detail.y=e.y,this.delta1.x+=-this.detail.x*this.speed,this.delta1.y+=-this.detail.y*this.speed,this.ing=!0,this.timers.complete.timer=setTimeout(()=>{this.onComplete()},this.timers.complete.wait)}onTouchStart(t){if(!this.ready||this.stopped||t.target.tagName==="BUTTON"||t.target.tagName==="INPUT"||t.target.tagName==="LABEL")return!1;this.$html.classList.add("is-usg-grid-scroll-dragging");let e=t.clientX,i=t.clientY;t.touches&&t.touches[0]&&(e=t.touches[0].clientX,i=t.touches[0].clientY),this.touch.start.x=e,this.touch.start.y=i,this.touch.dist.x=0,this.touch.dist.y=0,t.touches&&t.touches.length>1&&t.preventDefault(),this.touch.start.delta.x=this.delta1.x,this.touch.start.delta.y=this.delta1.y,this.touch.active=!0}onTouchMove(t){if(!this.ready||this.stopped)return!1;let e=t.clientX,i=t.clientY;t.touches&&t.touches[0]?(e=t.touches[0].clientX,i=t.touches[0].clientY):t.originalEvent&&t.originalEvent.changedTouches[0]&&(e=t.originalEvent.changedTouches[0].clientX,i=t.originalEvent.changedTouches[0].clientY),this.touch.ing.x=e,this.touch.ing.y=i,this.touch.dist.x=this.touch.start.x-e,this.touch.dist.y=this.touch.start.y-i,this.touch.active&&(this.touch.delta.x=this.touch.dist.x*this.touch.ratio*Math.abs(1)+this.touch.start.delta.x,this.touch.dir.x=this.touch.dist.x>0?1:-1,this.touch.throw.buffer.x=window.innerHeight*.5,this.delta1.x=this.touch.delta.x,this.touch.delta.y=this.touch.dist.y*this.touch.ratio*Math.abs(1)+this.touch.start.delta.y,this.touch.dir.y=this.touch.dist.y>0?1:-1,this.touch.throw.buffer.y=window.innerHeight*.5,this.delta1.y=this.touch.delta.y,this.trigger("dragging"))}onTouchEnd(t){if(!this.ready||this.stopped)return!1;this.$html.classList.remove("is-usg-grid-scroll-dragging"),this.touch.dist.x=0,this.touch.dist.y=0,this.touch.active=!1,this.timers.complete.timer=setTimeout(()=>{this.onComplete()},this.timers.complete.wait)}calcGrid(){this.aspectRatio=this.aspect.y/this.aspect.x,this.childWidth=window.innerWidth/(this.grid-1)*this.scale*this.autoScale,this.childHeight=window.innerWidth/(this.grid-1)*this.aspectRatio*this.scale*this.autoScale,this.totalWidth=this.childWidth*this.grid,this.totalHeight=this.childHeight*this.grid,this.translate.x=-this.totalWidth/2+window.innerWidth/2,this.translate.y=-this.totalHeight/2+window.innerHeight/2;for(let t=0;t<this.array.length;t++){const e=this.array[t],i=parseInt(e.el.style.width),r=parseInt(e.el.style.height);(i!=this.childWidth||r!=this.childHeight)&&(e.rect.width=this.childWidth,e.rect.height=this.childHeight,e.el.style.width=this.childWidth+"px",e.el.style.height=this.childHeight+"px",e.el.style.position="absolute",e.el.style.top="0px",e.el.style.left="0px")}}calcAutoScale(){const t=window.innerWidth/(this.grid-1)*this.scale,e=t*(this.aspect.y/this.aspect.x),i=t*this.grid,r=e*this.grid,s=window.innerWidth/(i-t),o=window.innerHeight/(r-e);this.autoScale=Math.max(s,o,1)}resize(){this.autoScaleEnable&&this.calcAutoScale(),this.calcGrid()}getAcceleration(t=1){if(this.acceleration.hitory.length>2?(this.acceleration.hitory.shift(),this.acceleration.hitory.push({x:this.delta1.x,y:this.delta1.y})):this.acceleration.hitory.push({x:this.delta1.x,y:this.delta1.y}),this.acceleration.hitory.length>2){this.acceleration.pow0.x=Math.min(Math.abs((this.acceleration.hitory[0].x-this.acceleration.hitory[2].x)*t),this.acceleration.max),this.acceleration.pow0.y=Math.min(Math.abs((this.acceleration.hitory[0].y-this.acceleration.hitory[2].y)*t),this.acceleration.max),this.acceleration.dir.x=this.acceleration.hitory[0].x-this.acceleration.hitory[2].x<0?-1:1,this.acceleration.dir.y=this.acceleration.hitory[0].y-this.acceleration.hitory[2].y<0?-1:1;const e=this.acceleration.pow0.x*this.acceleration.dir.x,i=this.acceleration.pow0.y*this.acceleration.dir.y,r=this.clamp(Math.sqrt(this.acceleration.pow0.x*this.acceleration.pow0.x+this.acceleration.pow0.y*this.acceleration.pow0.y),0,1);this.acceleration.tween=gsap.to(this.acceleration.pow1,{duration:this.accelerationDuration,ease:this.accelerationEase,x:e,y:i,d:r})}}onResetTweens(){this.acceleration.tween&&this.acceleration.tween.kill(),this.acceleration.tween=null}onComplete(){this.onResetTweens(),this.ing=!1}clamp(t,e,i){return Math.max(e,Math.min(t,i))}raf(){if(!this.ready)return!1;this.calcGrid(),this.scroll.x+=(this.delta1.x-this.scroll.x)*this.ease,.001>=Math.abs(this.scroll.x)&&(this.scroll.x=0),this.scroll.y+=(this.delta1.y-this.scroll.y)*this.ease,.001>=Math.abs(this.scroll.y)&&(this.scroll.y=0),this.autoscrollOffset.x=(this.autoscrollOffset.x+this.autoscroll.x*this.autoscrollProgress)%this.totalWidth,this.autoscrollOffset.y=(this.autoscrollOffset.y+this.autoscroll.y*this.autoscrollProgress)%this.totalHeight,this.scroll.left=(this.scroll.x+this.autoscrollOffset.x)%this.totalWidth,this.scroll.top=(this.scroll.y+this.autoscrollOffset.y)%this.totalHeight,this.position.x=this.scroll.left%this.totalWidth/this.totalWidth,this.position.y=this.scroll.top%this.totalHeight/this.totalHeight,this.onUpdate(),this.getAcceleration(1),this.trigger("update")}onUpdate(){for(let t=0;t<this.array.length;t++){const e=this.array[t];let i=e.position.x*this.childWidth+this.translate.x-this.scroll.left,r=e.position.y*this.childHeight+this.translate.y-this.scroll.top;r+this.childHeight<0&&(r=r+this.totalHeight),r-window.innerHeight>0&&(r=r-this.totalHeight),i-window.innerWidth>0&&(i=i-this.totalWidth),i+this.childWidth<0&&(i=i+this.totalWidth);const s=i+this.childWidth>0&&i<window.innerWidth,o=r+this.childHeight>0&&r<window.innerHeight;e.left=i,e.top=r,e.inview=s&&o,e.inview?(e.el.style.transform="translate3d("+i+"px, "+r+"px, 0)",e.el.dataset.visible=1):e.el.dataset.visible=0}}initEvents(){this.onWheel=this.onWheel.bind(this),this.resize=this.resize.bind(this),this.onTouchStart=this.onTouchStart.bind(this),this.onTouchMove=this.onTouchMove.bind(this),this.onTouchEnd=this.onTouchEnd.bind(this),window.addEventListener("wheel",this.onWheel,{passive:!1}),window.addEventListener("resize",this.resize),window.addEventListener("touchstart",this.onTouchStart,{passive:!0}),window.addEventListener("touchmove",this.onTouchMove,{passive:!0}),window.addEventListener("touchend",this.onTouchEnd),window.addEventListener("mousedown",this.onTouchStart),window.addEventListener("mousemove",this.onTouchMove),window.addEventListener("mouseup",this.onTouchEnd),document.addEventListener("mouseleave",this.onTouchEnd)}removeEvents(){window.removeEventListener("wheel",this.onWheel),window.removeEventListener("resize",this.resize),window.removeEventListener("touchstart",this.onTouchStart),window.removeEventListener("touchmove",this.onTouchMove),window.removeEventListener("touchend",this.onTouchEnd),window.removeEventListener("mousedown",this.onTouchStart),window.removeEventListener("mousemove",this.onTouchMove),window.removeEventListener("mouseup",this.onTouchEnd),document.removeEventListener("mouseleave",this.onTouchEnd)}on(t,e){this.events[t]||(this.events[t]=[]),this.events[t].push(e.bind(this))}trigger(t,e){this.events[t]&&this.events[t].forEach(i=>i(e))}destroy(){this.$html.classList.remove("is-usg-grid-scroll"),clearTimeout(this.timers.complete.timer),this.array=[],this.onResetTweens(),this.removeEvents(),this.events={}}get scale(){return this._scale}set scale(t){this._scale=t}get speed(){return this._speed}set speed(t){this._speed=t}get ease(){return this._ease}set ease(t){this._ease=t}get aspect(){return this._aspect}set aspect(t){typeof t=="object"&&"x"in t&&"y"in t?this._aspect={x:t.x,y:t.y}:console.warn("Invalid aspect value. It should be an object with x and y properties.")}}window.gsap=Mn;function NA(n){Dh(n);const t=document.querySelector(".usg-grid");if(!t)throw new Error("Home grid was not found.");const e=navigator.userAgent.toLowerCase().includes("windows")?Zt.speed*1.2:Zt.speed;if(n.grid=new UA({el:t,body:".usg-grid-body",block:".usg-grid-block",speed:e,ease:Zt.ease,grid:Zt.grid,scale:Zt.scale,autoScale:Zt.autoScale,aspect:Zt.aspect,autoscroll:Zt.autoscroll}),!n.grid.ready)throw new Error("Home grid failed to start.");K_(n),n.gridPointer={x:0,y:0,moved:!1},n.onGridPointerDown=i=>{n.gridPointer.x=i.clientX,n.gridPointer.y=i.clientY,n.gridPointer.moved=!1},n.onGridPointerMove=i=>{const r=i.clientX-n.gridPointer.x,s=i.clientY-n.gridPointer.y;r*r+s*s>25&&(n.gridPointer.moved=!0)},t.addEventListener("pointerdown",n.onGridPointerDown),window.addEventListener("pointermove",n.onGridPointerMove)}function Dh(n){n.grid&&(n.grid.wrapElem.removeEventListener("pointerdown",n.onGridPointerDown),window.removeEventListener("pointermove",n.onGridPointerMove),n.grid.destroy(),n.grid=null,n.gridPadding=null)}function K_(n){const t=n.grid.array[0],e=getComputedStyle(t.el);n.gridPadding={x:parseFloat(e.paddingLeft)+parseFloat(e.paddingRight),y:parseFloat(e.paddingTop)+parseFloat(e.paddingBottom)}}function Z_(n,t){const e=n.grid.childWidth-n.gridPadding.x,i=n.grid.childHeight-n.gridPadding.y,r=t.width/t.height,s=Math.min(e,i*r);return{width:s,height:s/r}}function ja(n){const t=n.container.clientWidth,e=n.container.clientHeight,i=n.grid.childWidth,r=n.grid.childHeight;n.entries.forEach(s=>{const o=s.cell;if(!o.inview||i===0||r===0){s.mesh.visible=!1;return}const a=Z_(n,s.item),l=o.left+i/2-t/2,c=e/2-o.top-r/2;s.link.style.width=`${a.width}px`,s.link.style.height=`${a.height}px`,s.mesh.visible=!0,s.mesh.position.set(l,c,0),s.mesh.scale.set(a.width,a.height,1)})}const xa=new V,Zf=4,Da=Math.PI/180,OA={static:$A,card:KA,slide:ZA,tornado:JA};function FA(n){return(Math.random()*2-1)*n}function xc(n,t){return(t?FA(n):n)*Da}function Bo(n,t,e,i,r){let s=0,o=0,a=0;if(r.rotation.enabled&&r.rotation.origin){const l=r.rotation.origin;s=l.x*n.scale.x,o=l.y*n.scale.y,a=l.z*n.scale.z,xa.set(s,o,a).applyEuler(n.rotation),s-=xa.x,o-=xa.y,a-=xa.z}n.position.set(t+s,e+o,i+a)}function kA(){const n=Zt.animation.splash;return n.plane[n.planeName]}function _l(n,t,e){const i=e.scale.enabled?e.scale.from:1,r=e.opacity.enabled?e.opacity.from:1;n.mesh.scale.set(t.scale.x*i,t.scale.y*i,1),e.rotation.enabled?n.mesh.rotation.set(xc(e.rotation.from.x,e.rotation.rand),xc(e.rotation.from.y,e.rotation.rand),xc(e.rotation.from.z,e.rotation.rand)):n.mesh.rotation.set(0,0,0),n.mesh.material.opacity=t.opacity*r}function gl(n,t,e,i,r,s){i.scale.enabled&&n.to(t.mesh.scale,{x:e.scale.x*i.scale.to,y:e.scale.y*i.scale.to,duration:s.duration,ease:Gn(s.ease)},r),i.rotation.enabled&&n.to(t.mesh.rotation,{x:i.rotation.to.x*Da,y:i.rotation.to.y*Da,z:i.rotation.to.z*Da,duration:s.duration,ease:Gn(s.ease)},r),i.opacity.enabled&&n.to(t.mesh.material,{opacity:e.opacity*i.opacity.to,duration:s.duration,ease:Gn(s.ease)},r)}function BA({x:n,y:t}){return n<0&&t>=0?0:n>=0&&t<0?1:n>=0&&t>=0?2:3}function VA(n,t){const e=Array.from({length:Zf},()=>[]),i=[];n.forEach(o=>{const a=t.get(o);Math.hypot(a.position.x,a.position.y)<1?i.push(o):e[BA(a.position)].push(o)}),e.forEach(o=>{o.sort((a,l)=>t.get(l).distance-t.get(a).distance)});const r=[],s=e.reduce((o,a)=>o+a.length,0);for(let o=0;r.length<s;o+=1){const a=e[o%Zf];a.length>0&&r.push(a.shift())}return r.concat(i)}function zA(n,t){return t.position.y>=1?1:t.position.y<=-1?-1:Number(n.el.dataset.x)%2===0?1:-1}function HA(n,t){return n.slice().sort((e,i)=>{const r=t.get(e).position,s=t.get(i).position,o=r.x-s.x;if(Math.abs(o)>=1)return o;const a=Math.abs(r.y)-Math.abs(s.y);return Math.abs(a)>=1?a:r.y-s.y})}function Jf(n,t){const e=Math.atan2(n,t);return e<0?e+Math.PI*2:e}function GA(n,t){return n.slice().sort((e,i)=>{const r=t.get(e),s=t.get(i),o=r.distance-s.distance;return Math.abs(o)>=1?o:Jf(r.position.x,r.position.y)-Jf(s.position.x,s.position.y)})}function jf(n,t,e,i){const r=Math.hypot(t.x,t.y);if(r<1)return{x:t.x,y:t.y};const s=Math.atan2(t.y,t.x),o=s+e*Math.PI*2,a=o+(s-o)*n,l=i+(r-i)*n;return{x:Math.cos(a)*l,y:Math.sin(a)*l}}function WA(n){let t=0;return n.forEach(e=>{e.distance>=1&&(t===0||e.distance<t)&&(t=e.distance)}),t}function XA(n,t,e){if(t===0)return e.duration;const i=Math.max(n,t)/t;return e.duration*(1+(i-1)*e.distance)}function vl(n,t){const e=n.entries.filter(({mesh:r})=>r.visible);if(e.length===0)throw new Error("Home splash could not find a visible Plane.");const i=new Map(e.map(r=>[r,{position:r.mesh.position.clone(),scale:r.mesh.scale.clone(),opacity:r.mesh.material.opacity,distance:Math.hypot(r.mesh.position.x,r.mesh.position.y),unscrolled:{x:r.mesh.position.x,y:r.mesh.position.y,z:r.mesh.position.z}}]));return n.splashing=!0,n.splashDragEnabled=!1,n.splashScrollX=n.grid.scroll.x,n.splashScrollY=n.grid.scroll.y,n.splashTargets=i,n.grid.autoscrollProgress=t,n.grid.stop(),document.documentElement.classList.add("is-ppc-home-splash"),Zt.animation.splash.dragStart<=0&&j_(n),{entries:e,targets:i}}function J_(n,t){n.mesh.position.set(t.position.x,t.position.y,0),n.mesh.scale.set(t.scale.x,t.scale.y,1),n.mesh.rotation.set(0,0,0),n.mesh.material.opacity=t.opacity,n.mesh.renderOrder=0,n.mesh.material.depthWrite=!0}function j_(n){n.splashDragEnabled||(n.splashDragEnabled=!0,n.grid.start(),document.documentElement.classList.remove("is-ppc-home-splash"))}function qA(n){const t=n.grid.autoscrollOffset.x+n.grid.scroll.x-n.splashScrollX,e=n.grid.autoscrollOffset.y+n.grid.scroll.y-n.splashScrollY,i=kA();n.splashTargets.forEach((r,s)=>{Bo(s.mesh,r.unscrolled.x-t,r.unscrolled.y+e,r.unscrolled.z,i)})}function YA(n){n.splashTimeline&&(n.grid.autoscrollProgress=n.splashAutoscrollProgress(),n.grid.raf(),qA(n),!n.splashDragEnabled&&n.splashTimeline.totalProgress()>=Zt.animation.splash.dragStart&&j_(n),n.render())}function xl(n,t){n.splashAutoscrollProgress=t,n.syncSplashAutoscroll=()=>YA(n),Mn.ticker.add(n.syncSplashAutoscroll)}function Q_(n){n.syncSplashAutoscroll&&(Mn.ticker.remove(n.syncSplashAutoscroll),n.syncSplashAutoscroll=null,n.splashAutoscrollProgress=null)}function lr(n){Q_(n),n.splashTargets.forEach((t,e)=>{J_(e,t)}),n.grid.autoscrollProgress=1,n.grid.start(),n.grid.raf(),ja(n),n.splashTimeline=null,n.splashTargets=null,n.splashDragEnabled=!1,n.splashing=!1,document.documentElement.classList.remove("is-ppc-home-splash"),n.startLoop()}function $A(n,t){const e=Zt.animation.splash.layout.static,{entries:i,targets:r}=vl(n,1),s={rotation:t.rotation,scale:t.scale,opacity:{enabled:!0,from:t.opacity.from,to:t.opacity.to}};if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){lr(n);return}i.forEach(o=>{const a=r.get(o);_l(o,a,s),Bo(o.mesh,a.unscrolled.x,a.unscrolled.y,a.unscrolled.z,s)}),n.render(),n.splashTimeline=Mn.timeline({delay:e.delay,onComplete:()=>lr(n)}),xl(n,()=>1),i.forEach((o,a)=>{gl(n.splashTimeline,o,r.get(o),s,a*e.stagger,e)})}function KA(n,t){const e=Zt.animation.splash.layout.card,{entries:i,targets:r}=vl(n,0),s=VA(i,r);if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){lr(n);return}s.forEach((o,a)=>{const l=r.get(o),c=Math.min(a,e.stack.visibleLayers),h=a%2===0?-1:1;l.unscrolled.x=c*e.stack.offsetX*h,l.unscrolled.y=c*e.stack.offsetY,l.unscrolled.z=(s.length-a)*e.stack.depth,_l(o,l,t),Bo(o.mesh,l.unscrolled.x,l.unscrolled.y,l.unscrolled.z,t),o.mesh.renderOrder=s.length-a,o.mesh.material.depthWrite=!1}),n.render(),n.splashTimeline=Mn.timeline({delay:e.delay,onComplete:()=>lr(n)}),xl(n,()=>n.splashTimeline.progress()),s.forEach((o,a)=>{const l=r.get(o),c=a*e.stagger;n.splashTimeline.to(l.unscrolled,{x:l.position.x,y:l.position.y,z:0,duration:e.duration,ease:Gn(e.ease),onComplete:()=>{o.mesh.renderOrder=0,o.mesh.material.depthWrite=!0}},c),gl(n.splashTimeline,o,l,t,c,e)})}function ZA(n,t){const e=Zt.animation.splash.layout.slide,{entries:i,targets:r}=vl(n,0),s=HA(i,r);if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){lr(n);return}s.forEach((o,a)=>{const l=r.get(o),c=zA(o,l);l.unscrolled.x=l.position.x+(n.container.clientWidth/2+l.scale.x/2+e.outside)*e.offset.x,l.unscrolled.y=l.position.y+c*(n.container.clientHeight/2+l.scale.y/2+e.outside)*e.offset.y,l.unscrolled.z=0,_l(o,l,t),Bo(o.mesh,l.unscrolled.x,l.unscrolled.y,l.unscrolled.z,t),o.mesh.renderOrder=s.length-a,o.mesh.material.depthWrite=!1}),n.render(),n.splashTimeline=Mn.timeline({delay:e.delay,onComplete:()=>lr(n)}),xl(n,()=>n.splashTimeline.progress()),s.forEach((o,a)=>{const l=r.get(o),c=a*e.stagger;n.splashTimeline.to(l.unscrolled,{x:l.position.x,y:l.position.y,duration:e.duration,ease:Gn(e.ease),onComplete:()=>{o.mesh.renderOrder=0,o.mesh.material.depthWrite=!0}},c),gl(n.splashTimeline,o,l,t,c,e)})}function JA(n,t){const e=Zt.animation.splash.layout.tornado,{entries:i,targets:r}=vl(n,0),s=GA(i,r),o=WA(r);if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){lr(n);return}s.forEach((a,l)=>{const c=r.get(a),h=jf(0,c.position,e.turns,e.radius);c.tornado=0,c.unscrolled.x=h.x,c.unscrolled.y=h.y,c.unscrolled.z=(s.length-l)*e.depth,_l(a,c,t),Bo(a.mesh,c.unscrolled.x,c.unscrolled.y,c.unscrolled.z,t),a.mesh.renderOrder=s.length-l,a.mesh.material.depthWrite=!1}),n.render(),n.splashTimeline=Mn.timeline({delay:e.delay,onComplete:()=>lr(n)}),xl(n,()=>n.splashTimeline.progress()),s.forEach((a,l)=>{const c=r.get(a),h=l*e.stagger,d=XA(c.distance,o,e);n.splashTimeline.to(c,{tornado:1,duration:d,ease:Gn(e.ease),onUpdate:()=>{const u=jf(c.tornado,c.position,e.turns,e.radius);c.unscrolled.x=u.x,c.unscrolled.y=u.y},onComplete:()=>{a.mesh.renderOrder=0,a.mesh.material.depthWrite=!0}},h),n.splashTimeline.to(c.unscrolled,{z:0,duration:d,ease:Gn(e.ease)},h),gl(n.splashTimeline,a,c,t,h,{duration:d,ease:e.ease})})}function jA(){return Zt.animation.splash.layoutName}function QA(){return Zt.animation.splash.planeName}function tg(n,t,e){const i=OA[t],r=Zt.animation.splash.plane[e];if(!i)throw new Error(`Unsupported Home splash layout: ${t}`);if(!r)throw new Error(`Unsupported Home splash Plane: ${e}`);i(n,r)}function tP(n,t,e){!n.active||!n.grid||n.transitioning||(Ia(n),n.stopLoop(),n.grid.autoscrollProgress=0,n.grid.autoscrollOffset.x=0,n.grid.autoscrollOffset.y=0,n.grid.start(),n.grid.raf(),ja(n),tg(n,t,e))}function Ia(n){Q_(n),n.splashTimeline&&n.splashTimeline.kill(),n.splashTargets&&n.splashTargets.forEach((t,e)=>{J_(e,t)}),n.splashTimeline=null,n.splashTargets=null,n.splashDragEnabled=!1,n.splashing=!1,document.documentElement.classList.remove("is-ppc-home-splash")}const eg={};for(const n in Dn)eg[n]=n;function Qf(n){const t={};for(const e in n)t[e]=e;return t}function ng(n){return Object.getPrototypeOf(n)===Object.prototype}function Qa(n,t){return n==="speed"?{min:1,max:400}:n==="ease"?{min:.01,max:1}:n==="delay"?{min:0,max:3}:n==="dragStart"?{min:0,max:1,step:.05}:n==="duration"?{min:0,max:5}:n==="stagger"?{min:0,max:.5}:n==="depth"?{min:0,max:.2}:n==="visibleLayers"?{min:1,max:25,step:1}:n==="outside"?{min:0,max:400}:n==="turns"?{min:0,max:3,step:.05}:n==="radius"?{min:0,max:400}:n==="distance"?{min:0,max:3,step:.05}:n==="offsetX"||n==="offsetY"?{min:-20,max:20}:t==="autoscroll"&&(n==="x"||n==="y")?{min:-5,max:5}:t==="offset"&&(n==="x"||n==="y")?{min:-2,max:2}:t==="origin"&&(n==="x"||n==="y"||n==="z")?{min:-1,max:1,step:.05}:(t==="from"||t==="to")&&(n==="x"||n==="y"||n==="z")?{min:-180,max:180}:t==="scale"&&(n==="from"||n==="to")?{min:0,max:2}:t==="opacity"&&(n==="from"||n==="to")?{min:0,max:1}:{}}function ig(n,t,e,i){const r={value:""},s=t[e];if(typeof s=="string")r.value=s;else for(const o in Dn)if(Dn[o]===s){r.value=o;break}n.addBinding(r,"value",{label:i,options:eg}).on("change",o=>{t[e]=Dn[o.value]})}function tl(n,t,e){for(const i in t){const r=t[i];if(i==="ease"&&typeof r!="number"){ig(n,t,i,"ease");continue}if(ng(r)){const s=n.addFolder({title:i,expanded:!1});tl(s,r,i);continue}n.addBinding(t,i,{label:i,...Qa(i,e)})}}function eP(n){n.grid&&(n.grid.speed=navigator.userAgent.toLowerCase().includes("windows")?Zt.speed*1.2:Zt.speed)}function nP(n,t,e){const i=n.addFolder({title:"splash"});i.addBinding(t,"layoutName",{label:"layout",options:Qf(t.layout)}),i.addBinding(t,"planeName",{label:"plane",options:Qf(t.plane)}),i.addButton({title:"replay"}).on("click",()=>{tP(e,t.layoutName,t.planeName)});for(const r in t){if(r==="layoutName"||r==="planeName")continue;const s=t[r];if(!ng(s)){if(r==="ease"&&typeof s!="number"){ig(i,t,r,"ease");continue}i.addBinding(t,r,{label:r,...Qa(r,"splash")});continue}for(const o in s){const a=i.addFolder({title:o,expanded:!1});tl(a,s[o],o)}}}function iP(n){const t=new URLSearchParams(window.location.search),e=Zt.animation,i=e.splash,r=new yy({title:"PPC Home",expanded:!1}),s=t.get("splash"),o=t.get("plane");i.layoutName=i.layout[s]?s:i.layoutName,i.planeName=i.plane[o]?o:i.planeName,r.addBinding(Zt,"speed",{label:"speed",...Qa("speed","")}).on("change",()=>{eP(n)}),r.addBinding(Zt,"ease",{label:"ease",...Qa("ease","")}).on("change",()=>{n.grid&&(n.grid.ease=Zt.ease)});const a=r.addFolder({title:"autoscroll"});tl(a,Zt.autoscroll,"autoscroll");for(const l in e){if(l==="splash"){nP(r,i,n);continue}const c=r.addFolder({title:l,expanded:!1});tl(c,e[l],l)}}function rP(n,t){return n.find(({width:e})=>e>=t)??n[n.length-1]}function sP(n){if(n.loadPromise)return n.loadPromise;const t=new NE;return n.loadPromise=Promise.all(n.items.map((e,i)=>{if(e.media!=="image")throw new Error(`Unsupported media type: ${e.media}`);const{width:r}=Z_(n,e),s=rP(e.sources,r*n.renderer.getPixelRatio());return t.loadAsync(s.url).then(o=>({index:i,texture:o}))})).then(e=>{e.forEach(({index:i,texture:r})=>{r.colorSpace=gn,r.generateMipmaps=!1,r.minFilter=He,n.textures[i]=r})}),n.loadPromise}function oP(n){const t=document.querySelector(`[data-transition-target][data-project-id="${n.transitionEntry.item.id}"]`);if(!t)throw new Error(`Transition target for ${n.transitionEntry.item.id} was not found.`);const e=t.querySelector("img");if(!e)throw new Error(`Transition target image for ${n.transitionEntry.item.id} was not found.`);return e}function tp(n,t){const e=t.getBoundingClientRect();if(e.width===0||e.height===0)throw new Error(`Transition target image for ${n.transitionEntry.item.id} has zero size.`);return{x:e.left+e.width/2-n.container.clientWidth/2,y:n.container.clientHeight/2-e.top-e.height/2,width:e.width,height:e.height}}function aP(n){const t=oP(n),e=tp(n,t),i=Zt.animation.transition.leave.zoom,r=n.getTransitionDuration(i.duration),s=n.transitionEntry.mesh;n.transitionTimeline=Mn.timeline({onUpdate:()=>{const o=tp(n,t);s.position.x+=o.x-e.x,s.position.y+=o.y-e.y,s.scale.x+=o.width-e.width,s.scale.y+=o.height-e.height,n.render()},onComplete:()=>n.completeTransition()}),n.transitionTimeline.to(s.position,{x:e.x,y:e.y,duration:r,ease:Gn(i.ease)},0),n.transitionTimeline.to(s.scale,{x:e.width,y:e.height,duration:r,ease:Gn(i.ease)},0)}function lP(n){const t=Zt.animation.transition.enter.fadein,e=n.entries.map(({mesh:i})=>i.material);e.forEach(i=>{i.opacity=0}),Mn.to(e,{opacity:1,duration:n.getTransitionDuration(t.duration),ease:Gn(t.ease)})}class cP{constructor(t){this.container=t,this.items=window.firstData.top.items,this.scene=new fE,this.camera=new In(Zt.fov,1,.1,1e4),this.renderer=new IA({alpha:!0,antialias:!0}),this.geometry=new ko(1,1),this.textures=[],this.entries=[],this.links=[],this.grid=null,this.loadPromise=null,this.rafId=null,this.transitionEntry=null,this.transitionTimeline=null,this.transitioning=!1,this.splashTimeline=null,this.splashTargets=null,this.splashing=!1,this.hasPlayedSplash=!1,this.active=t.dataset.active==="true",this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)*Zt.res),this.renderer.setClearColor(0,0),this.renderer.domElement.setAttribute("aria-hidden","true"),this.container.appendChild(this.renderer.domElement),this.resize=this.resize.bind(this),this.render=this.render.bind(this),this.tick=this.tick.bind(this),this.onLinkClick=this.onLinkClick.bind(this),window.addEventListener("resize",this.resize),this.resize()}activateHome(){NA(this),sP(this).then(()=>{!this.active||!this.grid||(this.syncMeshesToGrid(),this.syncLinks(),this.hasPlayedSplash?lP(this):this.grid.autoscrollProgress=0,this.grid.raf(),this.resize(),this.hasPlayedSplash?this.startLoop():(this.hasPlayedSplash=!0,tg(this,jA(),QA())))})}createPlane(t,e,i,r,s){const o=new Ou({map:i,transparent:!0}),a=new ci(this.geometry,o);this.scene.add(a),this.entries.push({item:t,index:e,mesh:a,el:r.el,link:s,cell:r})}syncMeshesToGrid(){this.entries.forEach(({mesh:t})=>{this.scene.remove(t),t.material.dispose()}),this.entries=[],this.grid.array.forEach(t=>{const e=t.el.querySelector("[data-ppc-home-link]"),i=Number(e.dataset.index);this.createPlane(this.items[i],i,this.textures[i],t,e)})}syncLinks(){this.links=[],this.grid.array.forEach(t=>{const e=t.el.querySelector("[data-ppc-home-link]");this.links.push(e),e.addEventListener("click",this.onLinkClick)})}onLinkClick(t){if(this.splashing){t.preventDefault();return}if(this.gridPointer.moved){t.preventDefault(),t.stopPropagation();return}if(t.button!==0||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey)return;const e=t.currentTarget.closest(".usg-grid-block"),i=this.entries.find(r=>r.el===e);if(!i)throw new Error(`Home Plane ${t.currentTarget.dataset.index} was not found.`);this.startTransition(i)}startTransition(t){if(this.transitioning)return;this.transitioning=!0,this.transitionEntry=t,document.documentElement.classList.add("is-ppc-home-transition"),t.mesh.position.z=1,this.grid.stop();const e=this.entries.filter(r=>r!==t).map(({mesh:r})=>r.material),i=Zt.animation.transition.leave.fadeout;Mn.to(e,{opacity:0,duration:this.getTransitionDuration(i.duration),ease:Gn(i.ease),onUpdate:this.render})}completeTransition(){this.transitionEntry.mesh.visible=!1,this.transitionEntry.mesh.position.z=0,this.container.dataset.active="false",document.documentElement.classList.remove("is-ppc-home-transition"),this.transitionTimeline=null,this.transitionEntry=null,this.transitioning=!1,this.render()}getTransitionDuration(t){return window.matchMedia("(prefers-reduced-motion: reduce)").matches?0:t}resetPlanes(){Ia(this),Mn.killTweensOf(this.entries.map(({mesh:t})=>t.material)),this.transitionTimeline&&this.transitionTimeline.kill(),this.transitionTimeline=null,this.transitionEntry=null,this.transitioning=!1,document.documentElement.classList.remove("is-ppc-home-transition"),this.entries.forEach(({mesh:t})=>{t.visible=!0,t.position.z=0,t.material.opacity=0})}startLoop(){this.rafId===null&&this.tick()}stopLoop(){cancelAnimationFrame(this.rafId),this.rafId=null}tick(){this.rafId=requestAnimationFrame(this.tick),this.grid&&!this.transitioning&&!this.splashing&&(this.grid.raf(),ja(this)),this.render()}resize(){const t=this.container.clientWidth,e=this.container.clientHeight;this.camera.aspect=t/e,this.camera.position.z=e/(2*Math.tan(QS.degToRad(this.camera.fov/2))),this.camera.far=this.camera.position.z*10,this.camera.updateProjectionMatrix(),this.renderer.setSize(t,e,!1),this.grid&&!this.transitioning&&!this.splashing&&(this.grid.resize(),K_(this),this.grid.onUpdate(),ja(this)),this.render()}render(){this.renderer.render(this.scene,this.camera)}setActive(t){this.active=t,t?(this.resetPlanes(),this.activateHome(),this.container.dataset.active="true",this.resize()):this.transitioning?(Ia(this),this.stopLoop(),this.links=[],Dh(this),aP(this)):(Ia(this),this.stopLoop(),this.links=[],Dh(this),this.container.dataset.active="false")}}const rg=document.querySelector("[data-ppc-home-canvas]");if(!rg)throw new Error("PPC home canvas container was not found.");const sg=new cP(rg);iP(sg);function og(){sg.setActive(document.querySelector('[data-page="home"]')!==null)}og();el.hooks.on("page:view",og);
