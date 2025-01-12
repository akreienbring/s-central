import{l as y,r as h,R as D,c as T,j as R,a as E,b as j,f as q}from"./prosemirror-transform-BPcrkV9w.js";import{S,F as x}from"./prosemirror-model-m3iZ3_G7.js";import{N as a,S as A,T as C,A as $}from"./prosemirror-state-BGDnCfAs.js";const K=(t,e)=>t.selection.empty?!1:(e&&e(t.tr.deleteSelection().scrollIntoView()),!0);function F(t,e){let{$cursor:r}=t.selection;return!r||(e?!e.endOfTextblock("backward",t):r.parentOffset>0)?null:r}const L=(t,e,r)=>{let o=F(t,r);if(!o)return!1;let n=z(o);if(!n){let i=o.blockRange(),f=i&&y(i);return f==null?!1:(e&&e(t.tr.lift(i,f).scrollIntoView()),!0)}let l=n.nodeBefore;if(M(t,n,e,-1))return!0;if(o.parent.content.size==0&&(w(l,"end")||a.isSelectable(l)))for(let i=o.depth;;i--){let f=h(t.doc,o.before(i),o.after(i),S.empty);if(f&&f.slice.size<f.to-f.from){if(e){let c=t.tr.step(f);c.setSelection(w(l,"end")?A.findFrom(c.doc.resolve(c.mapping.map(n.pos,-1)),-1):a.create(c.doc,n.pos-l.nodeSize)),e(c.scrollIntoView())}return!0}if(i==1||o.node(i-1).childCount>1)break}return l.isAtom&&n.depth==o.depth-1?(e&&e(t.tr.delete(n.pos-l.nodeSize,n.pos).scrollIntoView()),!0):!1},Q=(t,e,r)=>{let o=F(t,r);if(!o)return!1;let n=z(o);return n?O(t,n,e):!1},X=(t,e,r)=>{let o=v(t,r);if(!o)return!1;let n=B(o);return n?O(t,n,e):!1};function O(t,e,r){let o=e.nodeBefore,n=o,l=e.pos-1;for(;!n.isTextblock;l--){if(n.type.spec.isolating)return!1;let s=n.lastChild;if(!s)return!1;n=s}let i=e.nodeAfter,f=i,c=e.pos+1;for(;!f.isTextblock;c++){if(f.type.spec.isolating)return!1;let s=f.firstChild;if(!s)return!1;f=s}let p=h(t.doc,l,c,S.empty);if(!p||p.from!=l||p instanceof D&&p.slice.size>=c-l)return!1;if(r){let s=t.tr.step(p);s.setSelection(C.create(s.doc,l)),r(s.scrollIntoView())}return!0}function w(t,e,r=!1){for(let o=t;o;o=e=="start"?o.firstChild:o.lastChild){if(o.isTextblock)return!0;if(r&&o.childCount!=1)return!1}return!1}const Y=(t,e,r)=>{let{$head:o,empty:n}=t.selection,l=o;if(!n)return!1;if(o.parent.isTextblock){if(r?!r.endOfTextblock("backward",t):o.parentOffset>0)return!1;l=z(o)}let i=l&&l.nodeBefore;return!i||!a.isSelectable(i)?!1:(e&&e(t.tr.setSelection(a.create(t.doc,l.pos-i.nodeSize)).scrollIntoView()),!0)};function z(t){if(!t.parent.type.spec.isolating)for(let e=t.depth-1;e>=0;e--){if(t.index(e)>0)return t.doc.resolve(t.before(e+1));if(t.node(e).type.spec.isolating)break}return null}function v(t,e){let{$cursor:r}=t.selection;return!r||(e?!e.endOfTextblock("forward",t):r.parentOffset<r.parent.content.size)?null:r}const Z=(t,e,r)=>{let o=v(t,r);if(!o)return!1;let n=B(o);if(!n)return!1;let l=n.nodeAfter;if(M(t,n,e,1))return!0;if(o.parent.content.size==0&&(w(l,"start")||a.isSelectable(l))){let i=h(t.doc,o.before(),o.after(),S.empty);if(i&&i.slice.size<i.to-i.from){if(e){let f=t.tr.step(i);f.setSelection(w(l,"start")?A.findFrom(f.doc.resolve(f.mapping.map(n.pos)),1):a.create(f.doc,f.mapping.map(n.pos))),e(f.scrollIntoView())}return!0}}return l.isAtom&&n.depth==o.depth-1?(e&&e(t.tr.delete(n.pos,n.pos+l.nodeSize).scrollIntoView()),!0):!1},_=(t,e,r)=>{let{$head:o,empty:n}=t.selection,l=o;if(!n)return!1;if(o.parent.isTextblock){if(r?!r.endOfTextblock("forward",t):o.parentOffset<o.parent.content.size)return!1;l=B(o)}let i=l&&l.nodeAfter;return!i||!a.isSelectable(i)?!1:(e&&e(t.tr.setSelection(a.create(t.doc,l.pos)).scrollIntoView()),!0)};function B(t){if(!t.parent.type.spec.isolating)for(let e=t.depth-1;e>=0;e--){let r=t.node(e);if(t.index(e)+1<r.childCount)return t.doc.resolve(t.after(e+1));if(r.type.spec.isolating)break}return null}const ee=(t,e)=>{let r=t.selection,o=r instanceof a,n;if(o){if(r.node.isTextblock||!T(t.doc,r.from))return!1;n=r.from}else if(n=R(t.doc,r.from,-1),n==null)return!1;if(e){let l=t.tr.join(n);o&&l.setSelection(a.create(l.doc,n-t.doc.resolve(n).nodeBefore.nodeSize)),e(l.scrollIntoView())}return!0},te=(t,e)=>{let r=t.selection,o;if(r instanceof a){if(r.node.isTextblock||!T(t.doc,r.to))return!1;o=r.to}else if(o=R(t.doc,r.to,1),o==null)return!1;return e&&e(t.tr.join(o).scrollIntoView()),!0},re=(t,e)=>{let{$from:r,$to:o}=t.selection,n=r.blockRange(o),l=n&&y(n);return l==null?!1:(e&&e(t.tr.lift(n,l).scrollIntoView()),!0)},ne=(t,e)=>{let{$head:r,$anchor:o}=t.selection;return!r.parent.type.spec.code||!r.sameParent(o)?!1:(e&&e(t.tr.insertText(`
`).scrollIntoView()),!0)};function P(t){for(let e=0;e<t.edgeCount;e++){let{type:r}=t.edge(e);if(r.isTextblock&&!r.hasRequiredAttrs())return r}return null}const oe=(t,e)=>{let{$head:r,$anchor:o}=t.selection;if(!r.parent.type.spec.code||!r.sameParent(o))return!1;let n=r.node(-1),l=r.indexAfter(-1),i=P(n.contentMatchAt(l));if(!i||!n.canReplaceWith(l,l,i))return!1;if(e){let f=r.after(),c=t.tr.replaceWith(f,f,i.createAndFill());c.setSelection(A.near(c.doc.resolve(f),1)),e(c.scrollIntoView())}return!0},le=(t,e)=>{let r=t.selection,{$from:o,$to:n}=r;if(r instanceof $||o.parent.inlineContent||n.parent.inlineContent)return!1;let l=P(n.parent.contentMatchAt(n.indexAfter()));if(!l||!l.isTextblock)return!1;if(e){let i=(!o.parentOffset&&n.index()<n.parent.childCount?o:n).pos,f=t.tr.insert(i,l.createAndFill());f.setSelection(C.create(f.doc,i+1)),e(f.scrollIntoView())}return!0},ie=(t,e)=>{let{$cursor:r}=t.selection;if(!r||r.parent.content.size)return!1;if(r.depth>1&&r.after()!=r.end(-1)){let l=r.before();if(E(t.doc,l))return e&&e(t.tr.split(l).scrollIntoView()),!0}let o=r.blockRange(),n=o&&y(o);return n==null?!1:(e&&e(t.tr.lift(o,n).scrollIntoView()),!0)},fe=(t,e)=>{let{$from:r,to:o}=t.selection,n,l=r.sharedDepth(o);return l==0?!1:(n=r.before(l),e&&e(t.tr.setSelection(a.create(t.doc,n))),!0)};function J(t,e,r){let o=e.nodeBefore,n=e.nodeAfter,l=e.index();return!o||!n||!o.type.compatibleContent(n.type)?!1:!o.content.size&&e.parent.canReplace(l-1,l)?(r&&r(t.tr.delete(e.pos-o.nodeSize,e.pos).scrollIntoView()),!0):!e.parent.canReplace(l,l+1)||!(n.isTextblock||T(t.doc,e.pos))?!1:(r&&r(t.tr.join(e.pos).scrollIntoView()),!0)}function M(t,e,r,o){let n=e.nodeBefore,l=e.nodeAfter,i,f,c=n.type.spec.isolating||l.type.spec.isolating;if(!c&&J(t,e,r))return!0;let p=!c&&e.parent.canReplace(e.index(),e.index()+1);if(p&&(i=(f=n.contentMatchAt(n.childCount)).findWrapping(l.type))&&f.matchType(i[0]||l.type).validEnd){if(r){let u=e.pos+l.nodeSize,d=x.empty;for(let g=i.length-1;g>=0;g--)d=x.from(i[g].create(null,d));d=x.from(n.copy(d));let b=t.tr.step(new j(e.pos-1,u,e.pos,u,new S(d,1,0),i.length,!0)),m=b.doc.resolve(u+2*i.length);m.nodeAfter&&m.nodeAfter.type==n.type&&T(b.doc,m.pos)&&b.join(m.pos),r(b.scrollIntoView())}return!0}let s=l.type.spec.isolating||o>0&&c?null:A.findFrom(e,1),k=s&&s.$from.blockRange(s.$to),I=k&&y(k);if(I!=null&&I>=e.depth)return r&&r(t.tr.lift(k,I).scrollIntoView()),!0;if(p&&w(l,"start",!0)&&w(n,"end")){let u=n,d=[];for(;d.push(u),!u.isTextblock;)u=u.lastChild;let b=l,m=1;for(;!b.isTextblock;b=b.firstChild)m++;if(u.canReplace(u.childCount,u.childCount,b.content)){if(r){let g=x.empty;for(let V=d.length-1;V>=0;V--)g=x.from(d[V].copy(g));let W=t.tr.step(new j(e.pos-d.length,e.pos+l.nodeSize,e.pos+m,e.pos+l.nodeSize-m,new S(g,d.length,0),0,!0));r(W.scrollIntoView())}return!0}}return!1}function N(t){return function(e,r){let o=e.selection,n=t<0?o.$from:o.$to,l=n.depth;for(;n.node(l).isInline;){if(!l)return!1;l--}return n.node(l).isTextblock?(r&&r(e.tr.setSelection(C.create(e.doc,t<0?n.start(l):n.end(l)))),!0):!1}}const ce=N(-1),se=N(1);function ae(t,e=null){return function(r,o){let{$from:n,$to:l}=r.selection,i=n.blockRange(l),f=i&&q(i,t,e);return f?(o&&o(r.tr.wrap(i,f).scrollIntoView()),!0):!1}}function ue(t,e=null){return function(r,o){let n=!1;for(let l=0;l<r.selection.ranges.length&&!n;l++){let{$from:{pos:i},$to:{pos:f}}=r.selection.ranges[l];r.doc.nodesBetween(i,f,(c,p)=>{if(n)return!1;if(!(!c.isTextblock||c.hasMarkup(t,e)))if(c.type==t)n=!0;else{let s=r.doc.resolve(p),k=s.index();n=s.parent.canReplaceWith(k,k+1,t)}})}if(!n)return!1;if(o){let l=r.tr;for(let i=0;i<r.selection.ranges.length;i++){let{$from:{pos:f},$to:{pos:c}}=r.selection.ranges[i];l.setBlockType(f,c,t,e)}o(l.scrollIntoView())}return!0}}typeof navigator<"u"?/Mac|iP(hone|[oa]d)/.test(navigator.platform):typeof os<"u"&&os.platform&&os.platform()=="darwin";export{te as a,L as b,le as c,K as d,oe as e,Z as f,Q as g,X as h,ie as i,ee as j,_ as k,re as l,fe as m,ne as n,se as o,ce as p,ue as q,Y as s,ae as w};
