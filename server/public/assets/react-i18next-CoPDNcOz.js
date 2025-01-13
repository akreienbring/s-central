import{r as f}from"./react-BjOUEUJ-.js";const M=(e,s,n,a)=>{var t,d,h,N;const r=[n,{code:s,...a||{}}];if((d=(t=e==null?void 0:e.services)==null?void 0:t.logger)!=null&&d.forward)return e.services.logger.forward(r,"warn","react-i18next::",!0);m(r[0])&&(r[0]=`react-i18next:: ${r[0]}`),(N=(h=e==null?void 0:e.services)==null?void 0:h.logger)!=null&&N.warn?e.services.logger.warn(...r):console!=null&&console.warn&&console.warn(...r)},L={},E=(e,s,n,a)=>{m(n)&&L[n]||(m(n)&&(L[n]=new Date),M(e,s,n,a))},P=(e,s)=>()=>{if(e.isInitialized)s();else{const n=()=>{setTimeout(()=>{e.off("initialized",n)},0),s()};e.on("initialized",n)}},S=(e,s,n)=>{e.loadNamespaces(s,P(e,n))},A=(e,s,n,a)=>{if(m(n)&&(n=[n]),e.options.preload&&e.options.preload.indexOf(s)>-1)return S(e,n,a);n.forEach(r=>{e.options.ns.indexOf(r)<0&&e.options.ns.push(r)}),e.loadLanguages(s,P(e,a))},U=(e,s,n={})=>!s.languages||!s.languages.length?(E(s,"NO_LANGUAGES","i18n.languages were undefined or empty",{languages:s.languages}),!0):s.hasLoadedNamespace(e,{lng:n.lng,precheck:(a,r)=>{var t;if(((t=n.bindI18n)==null?void 0:t.indexOf("languageChanging"))>-1&&a.services.backendConnector.backend&&a.isLanguageChangingTo&&!r(a.isLanguageChangingTo,e))return!1}}),m=e=>typeof e=="string",_=e=>typeof e=="object"&&e!==null,G=/&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g,$={"&amp;":"&","&#38;":"&","&lt;":"<","&#60;":"<","&gt;":">","&#62;":">","&apos;":"'","&#39;":"'","&quot;":'"',"&#34;":'"',"&nbsp;":" ","&#160;":" ","&copy;":"©","&#169;":"©","&reg;":"®","&#174;":"®","&hellip;":"…","&#8230;":"…","&#x2F;":"/","&#47;":"/"},q=e=>$[e],B=e=>e.replace(G,q);let b={bindI18n:"languageChanged",bindI18nStore:"",transEmptyNodeValue:"",transSupportBasicHtmlNodes:!0,transWrapTextNodes:"",transKeepBasicHtmlNodesFor:["br","strong","i","p"],useSuspense:!0,unescape:B};const W=(e={})=>{b={...b,...e}},D=()=>b;let j;const J=e=>{j=e},K=()=>j,ee={type:"3rdParty",init(e){W(e.options.react),J(e)}},X=f.createContext();class Y{constructor(){this.usedNamespaces={}}addUsedNamespaces(s){s.forEach(n=>{this.usedNamespaces[n]||(this.usedNamespaces[n]=!0)})}getUsedNamespaces(){return Object.keys(this.usedNamespaces)}}const Q=(e,s)=>{const n=f.useRef();return f.useEffect(()=>{n.current=e},[e,s]),n.current},k=(e,s,n,a)=>e.getFixedT(s,n,a),Z=(e,s,n,a)=>f.useCallback(k(e,s,n,a),[e,s,n,a]),te=(e,s={})=>{var R,v,z,F;const{i18n:n}=s,{i18n:a,defaultNS:r}=f.useContext(X)||{},t=n||a||K();if(t&&!t.reportNamespaces&&(t.reportNamespaces=new Y),!t){E(t,"NO_I18NEXT_INSTANCE","useTranslation: You will need to pass in an i18next instance by using initReactI18next");const i=(u,l)=>m(l)?l:_(l)&&m(l.defaultValue)?l.defaultValue:Array.isArray(u)?u[u.length-1]:u,c=[i,{},!1];return c.t=i,c.i18n={},c.ready=!1,c}(R=t.options.react)!=null&&R.wait&&E(t,"DEPRECATED_OPTION","useTranslation: It seems you are still using the old wait option, you may migrate to the new useSuspense behaviour.");const d={...D(),...t.options.react,...s},{useSuspense:h,keyPrefix:N}=d;let o=r||((v=t.options)==null?void 0:v.defaultNS);o=m(o)?[o]:o||["translation"],(F=(z=t.reportNamespaces).addUsedNamespaces)==null||F.call(z,o);const g=(t.isInitialized||t.initializedStoreOnce)&&o.every(i=>U(i,t,d)),H=Z(t,s.lng||null,d.nsMode==="fallback"?o:o[0],N),C=()=>H,T=()=>k(t,s.lng||null,d.nsMode==="fallback"?o:o[0],N),[I,y]=f.useState(C);let w=o.join();s.lng&&(w=`${s.lng}${w}`);const O=Q(w),p=f.useRef(!0);f.useEffect(()=>{const{bindI18n:i,bindI18nStore:c}=d;p.current=!0,!g&&!h&&(s.lng?A(t,s.lng,o,()=>{p.current&&y(T)}):S(t,o,()=>{p.current&&y(T)})),g&&O&&O!==w&&p.current&&y(T);const u=()=>{p.current&&y(T)};return i&&(t==null||t.on(i,u)),c&&(t==null||t.store.on(c,u)),()=>{p.current=!1,t&&(i==null||i.split(" ").forEach(l=>t.off(l,u))),c&&t&&c.split(" ").forEach(l=>t.store.off(l,u))}},[t,w]),f.useEffect(()=>{p.current&&g&&y(C)},[t,N,g]);const x=[I,t,g];if(x.t=I,x.i18n=t,x.ready=g,g||!g&&!h)return x;throw new Promise(i=>{s.lng?A(t,s.lng,o,()=>i()):S(t,o,()=>i())})};export{ee as i,te as u};
