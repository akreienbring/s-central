import{r as P}from"./tslib-DWL4nlhP.js";var s={};Object.defineProperty(s,"__esModule",{value:!0});var o=P,T=function(r,e){return function(a){return Math.max(Math.min(a,e),r)}},g=function(r){return r%1?Number(r.toFixed(5)):r},h=/(-)?([\d]*\.?[\d])+/g,x=/(#[0-9a-f]{6}|#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2,3}\s*\/*\s*[\d\.]+%?\))/gi,U=/^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2,3}\s*\/*\s*[\d\.]+%?\))$/i;function d(r){return typeof r=="string"}var b={test:function(r){return typeof r=="number"},parse:parseFloat,transform:function(r){return r}},F=o.__assign(o.__assign({},b),{transform:T(0,1)}),A=o.__assign(o.__assign({},b),{default:1}),v=function(r){return{test:function(e){return d(e)&&e.endsWith(r)&&e.split(" ").length===1},parse:parseFloat,transform:function(e){return""+e+r}}},S=v("deg"),p=v("%"),z=v("px"),D=v("vh"),V=v("vw"),W=o.__assign(o.__assign({},p),{parse:function(r){return p.parse(r)/100},transform:function(r){return p.transform(r*100)}}),w=function(r,e){return function(a){return!!(d(a)&&U.test(a)&&a.startsWith(r)||e&&Object.prototype.hasOwnProperty.call(a,e))}},$=function(r,e,a){return function(t){var n;if(!d(t))return t;var u=t.match(h),i=u[0],c=u[1],l=u[2],N=u[3];return n={},n[r]=parseFloat(i),n[e]=parseFloat(c),n[a]=parseFloat(l),n.alpha=N!==void 0?parseFloat(N):1,n}},m={test:w("hsl","hue"),parse:$("hue","saturation","lightness"),transform:function(r){var e=r.hue,a=r.saturation,t=r.lightness,n=r.alpha,u=n===void 0?1:n;return"hsla("+Math.round(e)+", "+p.transform(g(a))+", "+p.transform(g(t))+", "+g(F.transform(u))+")"}},q=T(0,255),_=o.__assign(o.__assign({},b),{transform:function(r){return Math.round(q(r))}}),f={test:w("rgb","red"),parse:$("red","green","blue"),transform:function(r){var e=r.red,a=r.green,t=r.blue,n=r.alpha,u=n===void 0?1:n;return"rgba("+_.transform(e)+", "+_.transform(a)+", "+_.transform(t)+", "+g(F.transform(u))+")"}};function B(r){var e="",a="",t="",n="";return r.length>5?(e=r.substr(1,2),a=r.substr(3,2),t=r.substr(5,2),n=r.substr(7,2)):(e=r.substr(1,1),a=r.substr(2,1),t=r.substr(3,1),n=r.substr(4,1),e+=e,a+=a,t+=t,n+=n),{red:parseInt(e,16),green:parseInt(a,16),blue:parseInt(t,16),alpha:n?parseInt(n,16)/255:1}}var y={test:w("#"),parse:B,transform:f.transform},C={test:function(r){return f.test(r)||y.test(r)||m.test(r)},parse:function(r){return f.test(r)?f.parse(r):m.test(r)?m.parse(r):y.parse(r)},transform:function(r){return d(r)?r:r.hasOwnProperty("red")?f.transform(r):m.transform(r)}},k="${c}",M="${n}";function H(r){var e,a,t,n;return isNaN(r)&&d(r)&&((a=(e=r.match(h))===null||e===void 0?void 0:e.length)!==null&&a!==void 0?a:0)+((n=(t=r.match(x))===null||t===void 0?void 0:t.length)!==null&&n!==void 0?n:0)>0}function R(r){var e=[],a=0,t=r.match(x);t&&(a=t.length,r=r.replace(x,k),e.push.apply(e,t.map(C.parse)));var n=r.match(h);return n&&(r=r.replace(h,M),e.push.apply(e,n.map(b.parse))),{values:e,numColors:a,tokenised:r}}function j(r){return R(r).values}function I(r){var e=R(r),a=e.values,t=e.numColors,n=e.tokenised,u=a.length;return function(i){for(var c=n,l=0;l<u;l++)c=c.replace(l<t?k:M,l<t?C.transform(i[l]):g(i[l]));return c}}var Z=function(r){return typeof r=="number"?0:r};function E(r){var e=j(r),a=I(r);return a(e.map(Z))}var O={test:H,parse:j,createTransformer:I,getAnimatableNone:E},G=new Set(["brightness","contrast","saturate","opacity"]);function J(r){var e=r.slice(0,-1).split("("),a=e[0],t=e[1];if(a==="drop-shadow")return r;var n=(t.match(h)||[])[0];if(!n)return r;var u=t.replace(n,""),i=G.has(a)?1:0;return n!==t&&(i*=100),a+"("+i+u+")"}var K=/([a-z-]*)\(.*?\)/g,L=o.__assign(o.__assign({},O),{getAnimatableNone:function(r){var e=r.match(K);return e?e.map(J).join(" "):r}});s.alpha=F;s.color=C;s.complex=O;s.degrees=S;s.filter=L;s.hex=y;s.hsla=m;s.number=b;s.percent=p;s.progressPercentage=W;s.px=z;s.rgbUnit=_;s.rgba=f;s.scale=A;s.vh=D;s.vw=V;export{s as v};
