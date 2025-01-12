import{P as u}from"./prosemirror-state-BGDnCfAs.js";import{d as p}from"./prosemirror-transform-BPcrkV9w.js";function w(h={}){return new u({view(e){return new f(e,h)}})}class f{constructor(e,t){var i;this.editorView=e,this.cursorPos=null,this.element=null,this.timeout=-1,this.width=(i=t.width)!==null&&i!==void 0?i:1,this.color=t.color===!1?void 0:t.color||"black",this.class=t.class,this.handlers=["dragover","dragend","drop","dragleave"].map(o=>{let l=r=>{this[o](r)};return e.dom.addEventListener(o,l),{name:o,handler:l}})}destroy(){this.handlers.forEach(({name:e,handler:t})=>this.editorView.dom.removeEventListener(e,t))}update(e,t){this.cursorPos!=null&&t.doc!=e.state.doc&&(this.cursorPos>e.state.doc.content.size?this.setCursor(null):this.updateOverlay())}setCursor(e){e!=this.cursorPos&&(this.cursorPos=e,e==null?(this.element.parentNode.removeChild(this.element),this.element=null):this.updateOverlay())}updateOverlay(){let e=this.editorView.state.doc.resolve(this.cursorPos),t=!e.parent.inlineContent,i;if(t){let s=e.nodeBefore,a=e.nodeAfter;if(s||a){let c=this.editorView.nodeDOM(this.cursorPos-(s?s.nodeSize:0));if(c){let d=c.getBoundingClientRect(),n=s?d.bottom:d.top;s&&a&&(n=(n+this.editorView.nodeDOM(this.cursorPos).getBoundingClientRect().top)/2),i={left:d.left,right:d.right,top:n-this.width/2,bottom:n+this.width/2}}}}if(!i){let s=this.editorView.coordsAtPos(this.cursorPos);i={left:s.left-this.width/2,right:s.left+this.width/2,top:s.top,bottom:s.bottom}}let o=this.editorView.dom.offsetParent;this.element||(this.element=o.appendChild(document.createElement("div")),this.class&&(this.element.className=this.class),this.element.style.cssText="position: absolute; z-index: 50; pointer-events: none;",this.color&&(this.element.style.backgroundColor=this.color)),this.element.classList.toggle("prosemirror-dropcursor-block",t),this.element.classList.toggle("prosemirror-dropcursor-inline",!t);let l,r;if(!o||o==document.body&&getComputedStyle(o).position=="static")l=-pageXOffset,r=-pageYOffset;else{let s=o.getBoundingClientRect();l=s.left-o.scrollLeft,r=s.top-o.scrollTop}this.element.style.left=i.left-l+"px",this.element.style.top=i.top-r+"px",this.element.style.width=i.right-i.left+"px",this.element.style.height=i.bottom-i.top+"px"}scheduleRemoval(e){clearTimeout(this.timeout),this.timeout=setTimeout(()=>this.setCursor(null),e)}dragover(e){if(!this.editorView.editable)return;let t=this.editorView.posAtCoords({left:e.clientX,top:e.clientY}),i=t&&t.inside>=0&&this.editorView.state.doc.nodeAt(t.inside),o=i&&i.type.spec.disableDropCursor,l=typeof o=="function"?o(this.editorView,t,e):o;if(t&&!l){let r=t.pos;if(this.editorView.dragging&&this.editorView.dragging.slice){let s=p(this.editorView.state.doc,r,this.editorView.dragging.slice);s!=null&&(r=s)}this.setCursor(r),this.scheduleRemoval(5e3)}}dragend(){this.scheduleRemoval(20)}drop(){this.scheduleRemoval(20)}dragleave(e){(e.target==this.editorView.dom||!this.editorView.dom.contains(e.relatedTarget))&&this.setCursor(null)}}export{w as d};
