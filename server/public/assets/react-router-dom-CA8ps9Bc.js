import{r as l,R as O}from"./react-BjOUEUJ-.js";import"./react-dom-DZmwVGuR.js";import{l as _,R as k,c as x,d as F,a as P,u as B,e as j}from"./react-router-tasTa4Vj.js";import{c as I,s as K,b as y}from"./@remix-run-CqHE3mAX.js";/**
 * React Router DOM v6.28.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function w(){return w=Object.assign?Object.assign.bind():function(e){for(var r=1;r<arguments.length;r++){var i=arguments[r];for(var t in i)Object.prototype.hasOwnProperty.call(i,t)&&(e[t]=i[t])}return e},w.apply(this,arguments)}function N(e,r){if(e==null)return{};var i={},t=Object.keys(e),s,a;for(a=0;a<t.length;a++)s=t[a],!(r.indexOf(s)>=0)&&(i[s]=e[s]);return i}function V(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}function A(e,r){return e.button===0&&(!r||r==="_self")&&!V(e)}const W=["onClick","relative","reloadDocument","replace","state","target","to","preventScrollReset","viewTransition"],z="6";try{window.__reactRouterVersion=z}catch{}const G="startTransition",S=O[G];function Y(e){let{basename:r,children:i,future:t,window:s}=e,a=l.useRef();a.current==null&&(a.current=I({window:s,v5Compat:!0}));let o=a.current,[u,c]=l.useState({action:o.action,location:o.location}),{v7_startTransition:n}=t||{},f=l.useCallback(d=>{n&&S?S(()=>c(d)):c(d)},[c,n]);return l.useLayoutEffect(()=>o.listen(f),[o,f]),l.useEffect(()=>_(t),[t]),l.createElement(k,{basename:r,children:i,location:u.location,navigationType:u.action,navigator:o,future:t})}const M=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",X=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,Z=l.forwardRef(function(r,i){let{onClick:t,relative:s,reloadDocument:a,replace:o,state:u,target:c,to:n,preventScrollReset:f,viewTransition:d}=r,m=N(r,W),{basename:U}=l.useContext(x),R,v=!1;if(typeof n=="string"&&X.test(n)&&(R=n,M))try{let p=new URL(window.location.href),h=n.startsWith("//")?new URL(p.protocol+n):new URL(n),g=K(h.pathname,U);h.origin===p.origin&&g!=null?n=g+h.search+h.hash:v=!0}catch{}let E=F(n,{relative:s}),C=q(n,{replace:o,state:u,target:c,preventScrollReset:f,relative:s,viewTransition:d});function L(p){t&&t(p),p.defaultPrevented||C(p)}return l.createElement("a",w({},m,{href:R||E,onClick:v||a?t:L,ref:i,target:c}))});var b;(function(e){e.UseScrollRestoration="useScrollRestoration",e.UseSubmit="useSubmit",e.UseSubmitFetcher="useSubmitFetcher",e.UseFetcher="useFetcher",e.useViewTransitionState="useViewTransitionState"})(b||(b={}));var T;(function(e){e.UseFetcher="useFetcher",e.UseFetchers="useFetchers",e.UseScrollRestoration="useScrollRestoration"})(T||(T={}));function q(e,r){let{target:i,replace:t,state:s,preventScrollReset:a,relative:o,viewTransition:u}=r===void 0?{}:r,c=P(),n=B(),f=j(e,{relative:o});return l.useCallback(d=>{if(A(d,i)){d.preventDefault();let m=t!==void 0?t:y(n)===y(f);c(e,{replace:m,state:s,preventScrollReset:a,relative:o,viewTransition:u})}},[n,c,f,t,s,i,e,a,o,u])}export{Y as B,Z as L};
