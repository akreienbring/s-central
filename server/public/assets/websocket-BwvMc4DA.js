import{a as r}from"./index-BrtoKxF0.js";import{r as c}from"./es5-ext-B-aRoSt4.js";const a="websocket",l="Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.",b=["websocket","websockets","socket","networking","comet","push","RFC-6455","realtime","server","client"],u="Brian McKelvey <theturtle32@gmail.com> (https://github.com/theturtle32)",p=["Iñaki Baz Castillo <ibc@aliax.net> (http://dev.sipdoc.net)"],d="1.0.35",h={type:"git",url:"https://github.com/theturtle32/WebSocket-Node.git"},f="https://github.com/theturtle32/WebSocket-Node",g={node:">=4.0.0"},w={bufferutil:"^4.0.1",debug:"^2.2.0","es5-ext":"^0.10.63","typedarray-to-buffer":"^3.1.5","utf-8-validate":"^5.0.2",yaeti:"^0.0.6"},v={"buffer-equal":"^1.0.0",gulp:"^4.0.2","gulp-jshint":"^2.0.4","jshint-stylish":"^2.2.1",jshint:"^2.0.0",tape:"^4.9.1"},m={verbose:!1},k={test:"tape test/unit/*.js",gulp:"gulp"},y="index",C={lib:"./lib"},S="lib/browser.js",W="Apache-2.0",j={name:a,description:l,keywords:b,author:u,contributors:p,version:d,repository:h,homepage:f,engines:g,dependencies:w,devDependencies:v,config:m,scripts:k,main:y,directories:C,browser:S,license:W};var N=j.version,e;if(typeof globalThis=="object")e=globalThis;else try{e=c()}catch{}finally{if(!e&&typeof window<"u"&&(e=window),!e)throw new Error("Could not determine global this")}var o=e.WebSocket||e.MozWebSocket,E=N;function n(t,i){var s;return i?s=new o(t,i):s=new o(t),s}o&&["CONNECTING","OPEN","CLOSING","CLOSED"].forEach(function(t){Object.defineProperty(n,t,{get:function(){return o[t]}})});var x={w3cwebsocket:o?n:null,version:E};const T=r(x);export{T as w};
