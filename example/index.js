var x=class{weak=new WeakMap;map=new Map;set=(e,n)=>{typeof e!="object"?this.map.set(e,n):this.weak.set(e,n)};get=e=>typeof e!="object"?this.map.get(e):this.weak.get(e);has=e=>{typeof e!="object"?this.map.has(e):this.weak.has(e)};delete=e=>{if(typeof e!="object")return this.map.delete(e);this.weak.delete(e)}};function v(t){return!!(t.tagName==="svg"||t.ownerSVGElement)}var O={autofocus:!0,role:!0,viewBox:!0,disabled:!0,class:!0},A={};function b(t,e,n){if(Array.isArray(n)){t[e](...n);return}if(typeof n=="object"){Object.assign(t[e],n);return}if(t.__lastAttr||(t.__lastAttr={}),t.__lastAttr[e]!==n){if(t.__lastAttr[e]=n,t.setAttribute&&(A[e]||O[e]||/-/.test(e)||v(t))){A[e]=!0,n==null?t.removeAttribute(e):t.setAttribute(e,n);return}t[e]=n}}function l(t,e,n,r){if(t.setAttribute("data-x-subscrib",""),t.__x_subscrib||(t.__x_subscrib={}),t.__x_subscrib[e]=n,!r){if(/^(__update)/.test(e)){n(t,e);return}Promise.resolve(n(t,e)).then(o=>{b(t,e,o)})}}var p=new Set,m="",T=t=>{m===t&&p.forEach(e=>{m===t&&(requestAnimationFrame(()=>{m===t&&e.__x_subscrib&&Object.keys(e.__x_subscrib).forEach(r=>{if(m!==t)return;let o=e.__x_subscrib[r];if(/^(__update)/.test(r)){o(e,r);return}Promise.resolve(o(e,r)).then(s=>{b(e,r,s)})})}),p.delete(e))})};function _(t){t.hasAttribute("data-x-subscrib")&&p.add(t),t.querySelectorAll("[data-x-subscrib]").forEach(n=>{p.add(n)})}var E=new x,h;function y(t=document.body,e={}){if(t!==null){let n=Math.random().toString();m=n;let r=E.get(t)||0;r&&cancelAnimationFrame(r);let o=requestAnimationFrame(()=>{typeof t=="string"?document.body.querySelectorAll(t).forEach(_):Array.isArray(t)?t.forEach(_):_(t),T(n),E.delete(t)});E.set(t,o)}!e.ignoreSupplement&&t!==document.body&&(h&&(clearTimeout(h),h=null),h=setTimeout(()=>{_(document.body),T(m)},250))}function F(t){let e;return typeof t=="string"?e=document.createElement(t):e=t,e}function f(t,e){let n=F(t);return e&&Object.keys(e).forEach(o=>{let s=e[o];if(typeof s=="function"&&n.setAttribute&&!/^on/.test(o)){l(n,o,s);return}b(n,o,s)}),n}function S(t,e){let{each:n,render:r,...o}=e,s=f(t,o);if(typeof n=="function")l(s,"__update_for",a=>{let u=!!a.__lastForRender;a.__lastForRender=!0;let d=n();if(!u){let c=[];for(let i=0;i<d;i++)c.push(r(i,n));a.append(...c);return}let g=a.childNodes.length;if(d>g){let c=[];for(let i=g;i<d;i++)c.push(r(i,n));a.append(...c)}else for(let c=d;c<g;c++){let i=a.childNodes.item(c);i&&i.remove()}});else{let a=[];for(let u=0;u<n;u++)a.push(r(u,()=>n));s.append(...a)}return s}function N(){let t=document.createElement("span");return t.style.all="none",t}function j(t,e){let n=N();if(typeof t=="function"){let r=o=>{l(o,"__update_show",s=>{Promise.resolve(t()).then(a=>{if(a===s.__lastShow)return;let u=a?e():N();r(u),s.replaceWith(u),s.__lastShow=a})},!0)};r(n)}return n}var P=f("style",{textContent:`
.contains {
	background: #f3f3f3;
	font-size:40px;
}
`});document.head.append(P);var w={value0:"200"},R=f("div",{className:"contains",style:{cssText:"width:100%; height:100%;"},append:["Hello",f("span",{innerText:"world",style:{cssText:"color:red;"},onclick:()=>{alert("hello")}}),j(()=>Date.now()%3!==0,()=>f("span",{textContent:"show temp"})),S("div",{each:()=>{let t=Number(w.value0);return t>15e3?15e3:t},render:(t,e)=>{let n=()=>t%(e()/5);return f("input",{value:()=>w["value"+n()],dog:"aaa",oninput:r=>{let o=r.currentTarget.value;w["value"+t]=o,y()}})}})]});document.body.append(R);
//# sourceMappingURL=index.js.map
