var m={exports:{}},e={};/**
 * @license React
 * react-is.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var _=Symbol.for("react.transitional.element"),S=Symbol.for("react.portal"),n=Symbol.for("react.fragment"),o=Symbol.for("react.strict_mode"),s=Symbol.for("react.profiler"),f=Symbol.for("react.consumer"),a=Symbol.for("react.context"),E=Symbol.for("react.forward_ref"),u=Symbol.for("react.suspense"),i=Symbol.for("react.suspense_list"),c=Symbol.for("react.memo"),l=Symbol.for("react.lazy"),R=Symbol.for("react.offscreen"),C=Symbol.for("react.client.reference");function t(r){if(typeof r=="object"&&r!==null){var T=r.$$typeof;switch(T){case _:switch(r=r.type,r){case n:case s:case o:case u:case i:return r;default:switch(r=r&&r.$$typeof,r){case a:case E:case l:case c:return r;case f:return r;default:return T}}case S:return T}}}e.ContextConsumer=f;e.ContextProvider=a;e.Element=_;e.ForwardRef=E;e.Fragment=n;e.Lazy=l;e.Memo=c;e.Portal=S;e.Profiler=s;e.StrictMode=o;e.Suspense=u;e.SuspenseList=i;e.isContextConsumer=function(r){return t(r)===f};e.isContextProvider=function(r){return t(r)===a};e.isElement=function(r){return typeof r=="object"&&r!==null&&r.$$typeof===_};e.isForwardRef=function(r){return t(r)===E};e.isFragment=function(r){return t(r)===n};e.isLazy=function(r){return t(r)===l};e.isMemo=function(r){return t(r)===c};e.isPortal=function(r){return t(r)===S};e.isProfiler=function(r){return t(r)===s};e.isStrictMode=function(r){return t(r)===o};e.isSuspense=function(r){return t(r)===u};e.isSuspenseList=function(r){return t(r)===i};e.isValidElementType=function(r){return typeof r=="string"||typeof r=="function"||r===n||r===s||r===o||r===u||r===i||r===R||typeof r=="object"&&r!==null&&(r.$$typeof===l||r.$$typeof===c||r.$$typeof===a||r.$$typeof===f||r.$$typeof===E||r.$$typeof===C||r.getModuleId!==void 0)};e.typeOf=t;m.exports=e;var P=m.exports;export{P as r};
