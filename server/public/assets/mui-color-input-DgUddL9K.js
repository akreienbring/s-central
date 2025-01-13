import{g as b,j as c}from"./react-BjOUEUJ-.js";import{s as P,c as St,a0 as ct,d as kt,I as Mt,P as At,B as X}from"./@mui-CNZuoisg.js";const Ct="linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(135deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(135deg, transparent 75%, #ccc 75%) /*! @noflip */",$t="linear-gradient(to top, #000000, transparent), linear-gradient(to right, #ffffff, transparent) /*! @noflip */",Ht={Button:P(St)(()=>({backgroundSize:"8px 8px",backgroundPosition:"0 0, 4px 0, 4px -4px, 0px 4px",transition:"none",boxShadow:"0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",border:0,borderRadius:4,width:"24px",aspectRatio:"1 / 1",height:"24px",minWidth:0}))},Rt=n=>{const{bgColor:e,className:t,disablePopover:r,isBgColorValid:o,...a}=n;return c.jsx(Ht.Button,{disableTouchRipple:!0,style:{backgroundColor:o?e:void 0,backgroundImage:o?void 0:Ct,cursor:r?"default":void 0},className:`MuiColorInput-Button ${t||""}`,variant:"text",disableElevation:!1,...a})},jt={Container:P("div")(()=>({width:300,padding:8}))},Ft=({children:n,className:e,position:t="start",...r})=>c.jsx(At,{className:`MuiColorInput-Popover ${e||""}`,anchorOrigin:{vertical:"bottom",horizontal:t==="start"?"left":"right"},transformOrigin:{vertical:"top",horizontal:t==="start"?"left":"right"},...r,children:c.jsx(jt.Container,{children:n})}),Nt={Slider:P(ct,{shouldForwardProp:n=>n!=="$rgbaFrom"&&n!=="$rgbaTo"})(()=>({height:8,"& .MuiSlider-rail":{opacity:1,background:"linear-gradient(to right, rgba(var(--rgb-r), var(--rgb-g), var(--rgb-b), 0) 0%, rgba(var(--rgb-r), var(--rgb-g), var(--rgb-b), 1) 100%)"},"& .MuiSlider-track":{color:"transparent",border:0},"& .MuiSlider-thumb":{backgroundColor:"#ffffff",border:"3px solid currentColor"}}))},It=n=>{const{rgbColor:e,style:t,className:r,...o}=n,a={"--rgb-r":e.r,"--rgb-g":e.g,"--rgb-b":e.b,...t};return c.jsx(Nt.Slider,{className:`MuiColorInput-AlphaSlider ${r||""}`,style:a,...o})},D={up:"ArrowUp",down:"ArrowDown",left:"ArrowLeft",right:"ArrowRight"},Pt={ArrowUp:{type:"hsvV",value:1},ArrowDown:{type:"hsvV",value:-1},ArrowLeft:{type:"hsvS",value:-1},ArrowRight:{type:"hsvS",value:1}};function Bt(n){return n===D.up||n===D.down||n===D.left||n===D.right}function z(n,e,t){return Math.max(e,Math.min(n,t))}function nt(n){return typeof n=="number"}function rt(n,e,t){const r=n.toLocaleString("en",{useGrouping:!1,minimumFractionDigits:e,maximumFractionDigits:t});return Number(r)}function Et(n,e,t){const r=n.getBoundingClientRect(),o=e-r.left,a=t-r.top;return{x:z(o/r.width,0,1),y:z(1-a/r.height,0,1)}}function Vt(n){const e=b.useRef();return e.current=n,b.useCallback((...t)=>{var r;return(r=e.current)==null?void 0:r.call(e,...t)},[])}const at={Space:P("div")(()=>({width:"100%",height:"180px",boxSizing:"border-box",outline:0,position:"relative",backgroundImage:$t})),Thumb:P("div")(()=>({position:"absolute",border:"3px solid #ffffff",borderRadius:"50%",width:"20px",height:"20px",marginLeft:"-10px /*! @noflip */",marginBottom:"-10px /*! @noflip */",outline:0,boxSizing:"border-box",willChange:"left, bottom",transition:"box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms","&:hover":{boxShadow:"0px 0px 0px 4px rgba(255 255 255 / 0.16)"},"&.MuiColorInput-Thumb-active":{boxShadow:"0px 0px 0px 8px rgba(255 255 255 / 0.16)"},"@media (hover: none)":{boxShadow:"none"}}))},Tt=n=>{const{hsv:e,onChange:t,currentHue:r}=n,o=b.useRef(!1),a=b.useRef(null),[s,i]=b.useState(!1),u=Vt((g,C)=>{if(!a.current)return;const{x:$,y:R}=Et(a.current,g,C);t({s:$,v:R}),a.current&&document.activeElement!==a.current&&a.current.focus()}),S=b.useCallback(()=>{o.current&&(o.current=!1,i(!1))},[]),d=b.useCallback(g=>{o.current&&u(g.clientX,g.clientY)},[]);b.useEffect(()=>(document.addEventListener("pointermove",d,!1),document.addEventListener("pointerup",S,!1),()=>{document.removeEventListener("pointermove",d,!1),document.removeEventListener("pointerup",S,!1)}),[S,d]);const m=g=>{g.preventDefault(),o.current=!0,u(g.clientX,g.clientY),i(!0)},w=g=>{if(Bt(g.key)){g.preventDefault();const{type:C,value:$}=Pt[g.key],R=g.shiftKey?10:1,j=C==="hsvS"?e.s:e.v,B=z(j+$*R*.01,0,1);i(!0),t({s:C==="hsvS"?B:e.s,v:C==="hsvV"?B:e.v})}},k=e.s*100,A=e.v*100;return c.jsx(at.Space,{onPointerDown:m,ref:a,className:"MuiColorInput-ColorSpace",style:{backgroundColor:`hsl(${r} 100% 50%)`,touchAction:"none"},role:"slider","aria-valuetext":`Saturation ${rt(k,0,0)}%, Brightness ${rt(A,0,0)}%`,onKeyDown:w,tabIndex:0,children:c.jsx(at.Thumb,{"aria-label":"Color space thumb",className:s?"MuiColorInput-Thumb-active":"",style:{left:`${k}%`,bottom:`${A}%`}})})},qt={Slider:P(ct)(()=>({height:8,"& .MuiSlider-rail":{opacity:1,background:"linear-gradient(to right, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 67%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%) /*! @noflip */"},"& .MuiSlider-track":{color:"transparent",border:0},"& .MuiSlider-thumb":{backgroundColor:"#ffffff",border:"3px solid currentColor"}}))},Dt=n=>{const{className:e,...t}=n;return c.jsx(qt.Slider,{className:`MuiColorInput-HueSlider ${e||""}`,...t})};function Lt(n){return typeof n=="string"}function p(n,e){Wt(n)&&(n="100%");const t=Ot(n);return n=e===360?n:Math.min(e,Math.max(0,parseFloat(n))),t&&(n=parseInt(String(n*e),10)/100),Math.abs(n-e)<1e-6?1:(e===360?n=(n<0?n%e+e:n%e)/parseFloat(String(e)):n=n%e/parseFloat(String(e)),n)}function L(n){return Math.min(1,Math.max(0,n))}function Wt(n){return typeof n=="string"&&n.indexOf(".")!==-1&&parseFloat(n)===1}function Ot(n){return typeof n=="string"&&n.indexOf("%")!==-1}function dt(n){return n=parseFloat(n),(isNaN(n)||n<0||n>1)&&(n=1),n}function W(n){return Number(n)<=1?`${Number(n)*100}%`:n}function H(n){return n.length===1?"0"+n:String(n)}function zt(n,e,t){return{r:p(n,255)*255,g:p(e,255)*255,b:p(t,255)*255}}function ot(n,e,t){n=p(n,255),e=p(e,255),t=p(t,255);const r=Math.max(n,e,t),o=Math.min(n,e,t);let a=0,s=0;const i=(r+o)/2;if(r===o)s=0,a=0;else{const u=r-o;switch(s=i>.5?u/(2-r-o):u/(r+o),r){case n:a=(e-t)/u+(e<t?6:0);break;case e:a=(t-n)/u+2;break;case t:a=(n-e)/u+4;break}a/=6}return{h:a,s,l:i}}function Y(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*(6*t):t<1/2?e:t<2/3?n+(e-n)*(2/3-t)*6:n}function Ut(n,e,t){let r,o,a;if(n=p(n,360),e=p(e,100),t=p(t,100),e===0)o=t,a=t,r=t;else{const s=t<.5?t*(1+e):t+e-t*e,i=2*t-s;r=Y(i,s,n+1/3),o=Y(i,s,n),a=Y(i,s,n-1/3)}return{r:r*255,g:o*255,b:a*255}}function st(n,e,t){n=p(n,255),e=p(e,255),t=p(t,255);const r=Math.max(n,e,t),o=Math.min(n,e,t);let a=0;const s=r,i=r-o,u=r===0?0:i/r;if(r===o)a=0;else{switch(r){case n:a=(e-t)/i+(e<t?6:0);break;case e:a=(t-n)/i+2;break;case t:a=(n-e)/i+4;break}a/=6}return{h:a,s:u,v:s}}function Kt(n,e,t){n=p(n,360)*6,e=p(e,100),t=p(t,100);const r=Math.floor(n),o=n-r,a=t*(1-e),s=t*(1-o*e),i=t*(1-(1-o)*e),u=r%6,S=[t,s,a,a,i,t][u],d=[i,t,t,s,a,a][u],m=[a,a,i,t,t,s][u];return{r:S*255,g:d*255,b:m*255}}function it(n,e,t,r){const o=[H(Math.round(n).toString(16)),H(Math.round(e).toString(16)),H(Math.round(t).toString(16))];return r&&o[0].startsWith(o[0].charAt(1))&&o[1].startsWith(o[1].charAt(1))&&o[2].startsWith(o[2].charAt(1))?o[0].charAt(0)+o[1].charAt(0)+o[2].charAt(0):o.join("")}function Xt(n,e,t,r,o){const a=[H(Math.round(n).toString(16)),H(Math.round(e).toString(16)),H(Math.round(t).toString(16)),H(Gt(r))];return o&&a[0].startsWith(a[0].charAt(1))&&a[1].startsWith(a[1].charAt(1))&&a[2].startsWith(a[2].charAt(1))&&a[3].startsWith(a[3].charAt(1))?a[0].charAt(0)+a[1].charAt(0)+a[2].charAt(0)+a[3].charAt(0):a.join("")}function Yt(n,e,t,r){const o=n/100,a=e/100,s=t/100,i=r/100,u=255*(1-o)*(1-i),S=255*(1-a)*(1-i),d=255*(1-s)*(1-i);return{r:u,g:S,b:d}}function lt(n,e,t){let r=1-n/255,o=1-e/255,a=1-t/255,s=Math.min(r,o,a);return s===1?(r=0,o=0,a=0):(r=(r-s)/(1-s)*100,o=(o-s)/(1-s)*100,a=(a-s)/(1-s)*100),s*=100,{c:Math.round(r),m:Math.round(o),y:Math.round(a),k:Math.round(s)}}function Gt(n){return Math.round(parseFloat(n)*255).toString(16)}function ht(n){return v(n)/255}function v(n){return parseInt(n,16)}function Jt(n){return{r:n>>16,g:(n&65280)>>8,b:n&255}}const J={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkgrey:"#a9a9a9",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",goldenrod:"#daa520",gold:"#ffd700",gray:"#808080",green:"#008000",greenyellow:"#adff2f",grey:"#808080",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavenderblush:"#fff0f5",lavender:"#e6e6fa",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgreen:"#90ee90",lightgrey:"#d3d3d3",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370db",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#db7093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",rebeccapurple:"#663399",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",slategrey:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"};function Qt(n){let e={r:0,g:0,b:0},t=1,r=null,o=null,a=null,s=!1,i=!1;return typeof n=="string"&&(n=te(n)),typeof n=="object"&&(x(n.r)&&x(n.g)&&x(n.b)?(e=zt(n.r,n.g,n.b),s=!0,i=String(n.r).substr(-1)==="%"?"prgb":"rgb"):x(n.h)&&x(n.s)&&x(n.v)?(r=W(n.s),o=W(n.v),e=Kt(n.h,r,o),s=!0,i="hsv"):x(n.h)&&x(n.s)&&x(n.l)?(r=W(n.s),a=W(n.l),e=Ut(n.h,r,a),s=!0,i="hsl"):x(n.c)&&x(n.m)&&x(n.y)&&x(n.k)&&(e=Yt(n.c,n.m,n.y,n.k),s=!0,i="cmyk"),Object.prototype.hasOwnProperty.call(n,"a")&&(t=n.a)),t=dt(t),{ok:s,format:n.format||i,r:Math.min(255,Math.max(e.r,0)),g:Math.min(255,Math.max(e.g,0)),b:Math.min(255,Math.max(e.b,0)),a:t}}const Zt="[-\\+]?\\d+%?",_t="[-\\+]?\\d*\\.\\d+%?",M="(?:"+_t+")|(?:"+Zt+")",G="[\\s|\\(]+("+M+")[,|\\s]+("+M+")[,|\\s]+("+M+")\\s*\\)?",O="[\\s|\\(]+("+M+")[,|\\s]+("+M+")[,|\\s]+("+M+")[,|\\s]+("+M+")\\s*\\)?",y={CSS_UNIT:new RegExp(M),rgb:new RegExp("rgb"+G),rgba:new RegExp("rgba"+O),hsl:new RegExp("hsl"+G),hsla:new RegExp("hsla"+O),hsv:new RegExp("hsv"+G),hsva:new RegExp("hsva"+O),cmyk:new RegExp("cmyk"+O),hex3:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,hex4:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex8:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/};function te(n){if(n=n.trim().toLowerCase(),n.length===0)return!1;let e=!1;if(J[n])n=J[n],e=!0;else if(n==="transparent")return{r:0,g:0,b:0,a:0,format:"name"};let t=y.rgb.exec(n);return t?{r:t[1],g:t[2],b:t[3]}:(t=y.rgba.exec(n),t?{r:t[1],g:t[2],b:t[3],a:t[4]}:(t=y.hsl.exec(n),t?{h:t[1],s:t[2],l:t[3]}:(t=y.hsla.exec(n),t?{h:t[1],s:t[2],l:t[3],a:t[4]}:(t=y.hsv.exec(n),t?{h:t[1],s:t[2],v:t[3]}:(t=y.hsva.exec(n),t?{h:t[1],s:t[2],v:t[3],a:t[4]}:(t=y.cmyk.exec(n),t?{c:t[1],m:t[2],y:t[3],k:t[4]}:(t=y.hex8.exec(n),t?{r:v(t[1]),g:v(t[2]),b:v(t[3]),a:ht(t[4]),format:e?"name":"hex8"}:(t=y.hex6.exec(n),t?{r:v(t[1]),g:v(t[2]),b:v(t[3]),format:e?"name":"hex"}:(t=y.hex4.exec(n),t?{r:v(t[1]+t[1]),g:v(t[2]+t[2]),b:v(t[3]+t[3]),a:ht(t[4]+t[4]),format:e?"name":"hex8"}:(t=y.hex3.exec(n),t?{r:v(t[1]+t[1]),g:v(t[2]+t[2]),b:v(t[3]+t[3]),format:e?"name":"hex"}:!1))))))))))}function x(n){return typeof n=="number"?!Number.isNaN(n):y.CSS_UNIT.test(n)}class l{constructor(e="",t={}){if(e instanceof l)return e;typeof e=="number"&&(e=Jt(e)),this.originalInput=e;const r=Qt(e);this.originalInput=e,this.r=r.r,this.g=r.g,this.b=r.b,this.a=r.a,this.roundA=Math.round(100*this.a)/100,this.format=t.format??r.format,this.gradientType=t.gradientType,this.r<1&&(this.r=Math.round(this.r)),this.g<1&&(this.g=Math.round(this.g)),this.b<1&&(this.b=Math.round(this.b)),this.isValid=r.ok}isDark(){return this.getBrightness()<128}isLight(){return!this.isDark()}getBrightness(){const e=this.toRgb();return(e.r*299+e.g*587+e.b*114)/1e3}getLuminance(){const e=this.toRgb();let t,r,o;const a=e.r/255,s=e.g/255,i=e.b/255;return a<=.03928?t=a/12.92:t=Math.pow((a+.055)/1.055,2.4),s<=.03928?r=s/12.92:r=Math.pow((s+.055)/1.055,2.4),i<=.03928?o=i/12.92:o=Math.pow((i+.055)/1.055,2.4),.2126*t+.7152*r+.0722*o}getAlpha(){return this.a}setAlpha(e){return this.a=dt(e),this.roundA=Math.round(100*this.a)/100,this}isMonochrome(){const{s:e}=this.toHsl();return e===0}toHsv(){const e=st(this.r,this.g,this.b);return{h:e.h*360,s:e.s,v:e.v,a:this.a}}toHsvString(){const e=st(this.r,this.g,this.b),t=Math.round(e.h*360),r=Math.round(e.s*100),o=Math.round(e.v*100);return this.a===1?`hsv(${t}, ${r}%, ${o}%)`:`hsva(${t}, ${r}%, ${o}%, ${this.roundA})`}toHsl(){const e=ot(this.r,this.g,this.b);return{h:e.h*360,s:e.s,l:e.l,a:this.a}}toHslString(){const e=ot(this.r,this.g,this.b),t=Math.round(e.h*360),r=Math.round(e.s*100),o=Math.round(e.l*100);return this.a===1?`hsl(${t}, ${r}%, ${o}%)`:`hsla(${t}, ${r}%, ${o}%, ${this.roundA})`}toHex(e=!1){return it(this.r,this.g,this.b,e)}toHexString(e=!1){return"#"+this.toHex(e)}toHex8(e=!1){return Xt(this.r,this.g,this.b,this.a,e)}toHex8String(e=!1){return"#"+this.toHex8(e)}toHexShortString(e=!1){return this.a===1?this.toHexString(e):this.toHex8String(e)}toRgb(){return{r:Math.round(this.r),g:Math.round(this.g),b:Math.round(this.b),a:this.a}}toRgbString(){const e=Math.round(this.r),t=Math.round(this.g),r=Math.round(this.b);return this.a===1?`rgb(${e}, ${t}, ${r})`:`rgba(${e}, ${t}, ${r}, ${this.roundA})`}toPercentageRgb(){const e=t=>`${Math.round(p(t,255)*100)}%`;return{r:e(this.r),g:e(this.g),b:e(this.b),a:this.a}}toPercentageRgbString(){const e=t=>Math.round(p(t,255)*100);return this.a===1?`rgb(${e(this.r)}%, ${e(this.g)}%, ${e(this.b)}%)`:`rgba(${e(this.r)}%, ${e(this.g)}%, ${e(this.b)}%, ${this.roundA})`}toCmyk(){return{...lt(this.r,this.g,this.b)}}toCmykString(){const{c:e,m:t,y:r,k:o}=lt(this.r,this.g,this.b);return`cmyk(${e}, ${t}, ${r}, ${o})`}toName(){if(this.a===0)return"transparent";if(this.a<1)return!1;const e="#"+it(this.r,this.g,this.b,!1);for(const[t,r]of Object.entries(J))if(e===r)return t;return!1}toString(e){const t=!!e;e=e??this.format;let r=!1;const o=this.a<1&&this.a>=0;return!t&&o&&(e.startsWith("hex")||e==="name")?e==="name"&&this.a===0?this.toName():this.toRgbString():(e==="rgb"&&(r=this.toRgbString()),e==="prgb"&&(r=this.toPercentageRgbString()),(e==="hex"||e==="hex6")&&(r=this.toHexString()),e==="hex3"&&(r=this.toHexString(!0)),e==="hex4"&&(r=this.toHex8String(!0)),e==="hex8"&&(r=this.toHex8String()),e==="name"&&(r=this.toName()),e==="hsl"&&(r=this.toHslString()),e==="hsv"&&(r=this.toHsvString()),e==="cmyk"&&(r=this.toCmykString()),r||this.toHexString())}toNumber(){return(Math.round(this.r)<<16)+(Math.round(this.g)<<8)+Math.round(this.b)}clone(){return new l(this.toString())}lighten(e=10){const t=this.toHsl();return t.l+=e/100,t.l=L(t.l),new l(t)}brighten(e=10){const t=this.toRgb();return t.r=Math.max(0,Math.min(255,t.r-Math.round(255*-(e/100)))),t.g=Math.max(0,Math.min(255,t.g-Math.round(255*-(e/100)))),t.b=Math.max(0,Math.min(255,t.b-Math.round(255*-(e/100)))),new l(t)}darken(e=10){const t=this.toHsl();return t.l-=e/100,t.l=L(t.l),new l(t)}tint(e=10){return this.mix("white",e)}shade(e=10){return this.mix("black",e)}desaturate(e=10){const t=this.toHsl();return t.s-=e/100,t.s=L(t.s),new l(t)}saturate(e=10){const t=this.toHsl();return t.s+=e/100,t.s=L(t.s),new l(t)}greyscale(){return this.desaturate(100)}spin(e){const t=this.toHsl(),r=(t.h+e)%360;return t.h=r<0?360+r:r,new l(t)}mix(e,t=50){const r=this.toRgb(),o=new l(e).toRgb(),a=t/100,s={r:(o.r-r.r)*a+r.r,g:(o.g-r.g)*a+r.g,b:(o.b-r.b)*a+r.b,a:(o.a-r.a)*a+r.a};return new l(s)}analogous(e=6,t=30){const r=this.toHsl(),o=360/t,a=[this];for(r.h=(r.h-(o*e>>1)+720)%360;--e;)r.h=(r.h+o)%360,a.push(new l(r));return a}complement(){const e=this.toHsl();return e.h=(e.h+180)%360,new l(e)}monochromatic(e=6){const t=this.toHsv(),{h:r}=t,{s:o}=t;let{v:a}=t;const s=[],i=1/e;for(;e--;)s.push(new l({h:r,s:o,v:a})),a=(a+i)%1;return s}splitcomplement(){const e=this.toHsl(),{h:t}=e;return[this,new l({h:(t+72)%360,s:e.s,l:e.l}),new l({h:(t+216)%360,s:e.s,l:e.l})]}onBackground(e){const t=this.toRgb(),r=new l(e).toRgb(),o=t.a+r.a*(1-t.a);return new l({r:(t.r*t.a+r.r*r.a*(1-t.a))/o,g:(t.g*t.a+r.g*r.a*(1-t.a))/o,b:(t.b*t.a+r.b*r.a*(1-t.a))/o,a:o})}triad(){return this.polyad(3)}tetrad(){return this.polyad(4)}polyad(e){const t=this.toHsl(),{h:r}=t,o=[this],a=360/e;for(let s=1;s<e;s++)o.push(new l({h:(r+s*a)%360,s:t.s,l:t.l}));return o}equals(e){const t=new l(e);return this.format==="cmyk"||t.format==="cmyk"?this.toCmykString()===t.toCmykString():this.toRgbString()===t.toRgbString()}}function I(n,e){return n.isValid?n.toString(e):n.originalInput.toString()}function ut(n,e){return new l(n,e)}function ee(n){return Lt(n)?n:new l(n).toString()}const ne=n=>{const{currentColor:e,format:t,onChange:r,isAlphaHidden:o}=n,[a,s]=b.useState(e.toHsv()),i=(d,m)=>{if(!nt(m))return;const w=z(360*m/100,0,359);s(A=>({...A,h:w}));const k=new l({...a,a:e.toHsv().a,h:w});r==null||r(I(k,t))},u=(d,m)=>{if(!nt(m))return;const w=e.clone().setAlpha(m);r==null||r(I(w,t))},S=({s:d,v:m})=>{const w=new l({h:a.h,a:e.toHsv().a,s:d,v:m});s(k=>({...k,s:d,v:m})),r==null||r(I(w,t))};return c.jsxs(X,{className:"MuiColorInput-PopoverBody",children:[c.jsx(Tt,{currentHue:a.h,hsv:a,onChange:S}),c.jsx(X,{mt:"10px",px:"3px",children:c.jsx(Dt,{min:0,max:100,step:1,onChange:i,"aria-label":"hue",value:a.h*100/360})}),o?null:c.jsx(X,{mt:"10px",px:"3px",children:c.jsx(It,{min:0,max:1,step:.01,"aria-label":"alpha",rgbColor:e.toRgb(),onChange:u,value:e.getAlpha()})})]})},re=b.forwardRef((n,e)=>{const{className:t,...r}=n;return c.jsx(kt,{className:`MuiColorInput-TextField ${t||""}`,ref:e,...r})}),ae="rgb";function oe(n){return typeof n=="object"&&!Array.isArray(n)&&n!==null}function ft(n,e){typeof e=="function"?e(n):e&&oe(e)&&"current"in e&&(e.current=n)}const le=b.forwardRef((n,e)=>{const{value:t,format:r,onChange:o,adornmentPosition:a="start",PopoverProps:s,Adornment:i=Rt,fallbackValue:u,isAlphaHidden:S,disablePopover:d,...m}=n,{onBlur:w,InputProps:k,...A}=m,{onClose:g,...C}=s||{},$=A.disabled||(k==null?void 0:k.disabled)||!1,R=b.useRef(null),j=b.useRef(null),[B,Q]=b.useState(null),F=r||ae,U=ut(t,{format:F}),[T,E]=b.useState(t),[Z,V]=b.useState(t),gt=h=>{h.preventDefault(),h.stopPropagation(),!$&&!d&&Q(R.current)},q=h=>{const f=new l(h);o==null||o(h,{hex:f.isValid?f.toHexString():"",hsv:f.isValid?f.toHsvString():"",hsl:f.isValid?f.toHslString():"",rgb:f.isValid?f.toRgbString():"",hex8:f.isValid?f.toHex8String():""})},bt=h=>{const f=h.target.value;if(E(f),f==="")V(""),q("");else{const K=new l(f),N=I(K,F);V(N),q(N)}},pt=(...h)=>{g==null||g(...h),Q(null),queueMicrotask(()=>{var f;(f=j.current)==null||f.focus()})},mt=h=>{w==null||w(h);const f=new l(T);if(f.isValid)f.format!==F&&E(I(f,F));else{if(T==="")return;if(u){const K=new l(u),N=I(K,F);E(N),V(N),q(N)}}};b.useEffect(()=>{if(t!==Z){const h=ut(t).originalInput;V(h),E(h)}},[t,Z]);const xt=h=>{E(h),V(h),q(h)},vt=h=>{R.current=h,e&&ft(h,e)},wt=h=>{j.current=h,j&&ft(h,j)},_=!!B,tt=_?"color-popover":void 0,et=c.jsx(Mt,{position:a,children:c.jsx(i,{disabled:$,"aria-describedby":tt,disablePopover:d||!1,component:d?"span":void 0,bgColor:U.toString(),isBgColorValid:!!(T!==""&&U.isValid),onClick:d?void 0:gt})}),yt=a==="start"?{startAdornment:et}:{endAdornment:et};return c.jsxs(c.Fragment,{children:[c.jsx(re,{ref:vt,spellCheck:"false",type:"text",autoComplete:"off",onChange:bt,value:ee(T),onBlur:mt,inputRef:wt,disabled:$,InputProps:{...yt,...k},...A}),d?null:c.jsx(Ft,{id:tt,open:_,position:a,anchorEl:B,onClose:pt,...C,children:c.jsx(ne,{onChange:xt,currentColor:U,format:F,isAlphaHidden:S})})]})});export{le as x};
