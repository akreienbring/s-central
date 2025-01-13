import{a as Z,S as N,b as ye,T as E,P as fe,N as Se}from"./prosemirror-state-CbPVowry.js";import{F as R,S as v}from"./prosemirror-model-CWJw0FAp.js";import{a as X,D as q}from"./prosemirror-view-D2u4awtz.js";import{a as Ae}from"./prosemirror-keymap-BAKRQlar.js";import{T as Re}from"./prosemirror-transform-CmxhxSzP.js";var J,U;if(typeof WeakMap<"u"){let t=new WeakMap;J=e=>t.get(e),U=(e,n)=>(t.set(e,n),n)}else{const t=[];let n=0;J=o=>{for(let l=0;l<t.length;l+=2)if(t[l]==o)return t[l+1]},U=(o,l)=>(n==10&&(n=0),t[n++]=o,t[n++]=l)}var C=class{constructor(t,e,n,o){this.width=t,this.height=e,this.map=n,this.problems=o}findCell(t){for(let e=0;e<this.map.length;e++){const n=this.map[e];if(n!=t)continue;const o=e%this.width,l=e/this.width|0;let s=o+1,r=l+1;for(let c=1;s<this.width&&this.map[e+c]==n;c++)s++;for(let c=1;r<this.height&&this.map[e+this.width*c]==n;c++)r++;return{left:o,top:l,right:s,bottom:r}}throw new RangeError(`No cell with offset ${t} found`)}colCount(t){for(let e=0;e<this.map.length;e++)if(this.map[e]==t)return e%this.width;throw new RangeError(`No cell with offset ${t} found`)}nextCell(t,e,n){const{left:o,right:l,top:s,bottom:r}=this.findCell(t);return e=="horiz"?(n<0?o==0:l==this.width)?null:this.map[s*this.width+(n<0?o-1:l)]:(n<0?s==0:r==this.height)?null:this.map[o+this.width*(n<0?s-1:r)]}rectBetween(t,e){const{left:n,right:o,top:l,bottom:s}=this.findCell(t),{left:r,right:c,top:i,bottom:a}=this.findCell(e);return{left:Math.min(n,r),top:Math.min(l,i),right:Math.max(o,c),bottom:Math.max(s,a)}}cellsInRect(t){const e=[],n={};for(let o=t.top;o<t.bottom;o++)for(let l=t.left;l<t.right;l++){const s=o*this.width+l,r=this.map[s];n[r]||(n[r]=!0,!(l==t.left&&l&&this.map[s-1]==r||o==t.top&&o&&this.map[s-this.width]==r)&&e.push(r))}return e}positionAt(t,e,n){for(let o=0,l=0;;o++){const s=l+n.child(o).nodeSize;if(o==t){let r=e+t*this.width;const c=(t+1)*this.width;for(;r<c&&this.map[r]<l;)r++;return r==c?s-1:this.map[r]}l=s}}static get(t){return J(t)||U(t,xe(t))}};function xe(t){if(t.type.spec.tableRole!="table")throw new RangeError("Not a table node: "+t.type.name);const e=Me(t),n=t.childCount,o=[];let l=0,s=null;const r=[];for(let a=0,d=e*n;a<d;a++)o[a]=0;for(let a=0,d=0;a<n;a++){const f=t.child(a);d++;for(let p=0;;p++){for(;l<o.length&&o[l]!=0;)l++;if(p==f.childCount)break;const m=f.child(p),{colspan:g,rowspan:b,colwidth:H}=m.attrs;for(let B=0;B<b;B++){if(B+a>=n){(s||(s=[])).push({type:"overlong_rowspan",pos:d,n:b-B});break}const j=l+B*e;for(let k=0;k<g;k++){o[j+k]==0?o[j+k]=d:(s||(s=[])).push({type:"collision",row:a,pos:d,n:g-k});const $=H&&H[k];if($){const L=(j+k)%e*2,K=r[L];K==null||K!=$&&r[L+1]==1?(r[L]=$,r[L+1]=1):K==$&&r[L+1]++}}}l+=g,d+=m.nodeSize}const u=(a+1)*e;let h=0;for(;l<u;)o[l++]==0&&h++;h&&(s||(s=[])).push({type:"missing",row:a,n:h}),d++}const c=new C(e,n,o,s);let i=!1;for(let a=0;!i&&a<r.length;a+=2)r[a]!=null&&r[a+1]<n&&(i=!0);return i&&Ne(c,r,t),c}function Me(t){let e=-1,n=!1;for(let o=0;o<t.childCount;o++){const l=t.child(o);let s=0;if(n)for(let r=0;r<o;r++){const c=t.child(r);for(let i=0;i<c.childCount;i++){const a=c.child(i);r+a.attrs.rowspan>o&&(s+=a.attrs.colspan)}}for(let r=0;r<l.childCount;r++){const c=l.child(r);s+=c.attrs.colspan,c.attrs.rowspan>1&&(n=!0)}e==-1?e=s:e!=s&&(e=Math.max(e,s))}return e}function Ne(t,e,n){t.problems||(t.problems=[]);const o={};for(let l=0;l<t.map.length;l++){const s=t.map[l];if(o[s])continue;o[s]=!0;const r=n.nodeAt(s);if(!r)throw new RangeError(`No cell with offset ${s} found`);let c=null;const i=r.attrs;for(let a=0;a<i.colspan;a++){const d=(l+a)%t.width,f=e[d*2];f!=null&&(!i.colwidth||i.colwidth[a]!=f)&&((c||(c=ze(i)))[a]=f)}c&&t.problems.unshift({type:"colwidth mismatch",pos:s,colwidth:c})}}function ze(t){if(t.colwidth)return t.colwidth.slice();const e=[];for(let n=0;n<t.colspan;n++)e.push(0);return e}function y(t){let e=t.cached.tableNodeTypes;if(!e){e=t.cached.tableNodeTypes={};for(const n in t.nodes){const o=t.nodes[n],l=o.spec.tableRole;l&&(e[l]=o)}}return e}var z=new Z("selectingCells");function D(t){for(let e=t.depth-1;e>0;e--)if(t.node(e).type.spec.tableRole=="row")return t.node(0).resolve(t.before(e+1));return null}function ve(t){for(let e=t.depth;e>0;e--){const n=t.node(e).type.spec.tableRole;if(n==="cell"||n==="header_cell")return t.node(e)}return null}function A(t){const e=t.selection.$head;for(let n=e.depth;n>0;n--)if(e.node(n).type.spec.tableRole=="row")return!0;return!1}function O(t){const e=t.selection;if("$anchorCell"in e&&e.$anchorCell)return e.$anchorCell.pos>e.$headCell.pos?e.$anchorCell:e.$headCell;if("node"in e&&e.node&&e.node.type.spec.tableRole=="cell")return e.$anchor;const n=D(e.$head)||ke(e.$head);if(n)return n;throw new RangeError(`No cell found around position ${e.head}`)}function ke(t){for(let e=t.nodeAfter,n=t.pos;e;e=e.firstChild,n++){const o=e.type.spec.tableRole;if(o=="cell"||o=="header_cell")return t.doc.resolve(n)}for(let e=t.nodeBefore,n=t.pos;e;e=e.lastChild,n--){const o=e.type.spec.tableRole;if(o=="cell"||o=="header_cell")return t.doc.resolve(n-e.nodeSize)}}function Y(t){return t.parent.type.spec.tableRole=="row"&&!!t.nodeAfter}function Ee(t){return t.node(0).resolve(t.pos+t.nodeAfter.nodeSize)}function ee(t,e){return t.depth==e.depth&&t.pos>=e.start(-1)&&t.pos<=e.end(-1)}function ue(t,e,n){const o=t.node(-1),l=C.get(o),s=t.start(-1),r=l.nextCell(t.pos-s,e,n);return r==null?null:t.node(0).resolve(s+r)}function T(t,e,n=1){const o={...t,colspan:t.colspan-n};return o.colwidth&&(o.colwidth=o.colwidth.slice(),o.colwidth.splice(e,n),o.colwidth.some(l=>l>0)||(o.colwidth=null)),o}function he(t,e,n=1){const o={...t,colspan:t.colspan+n};if(o.colwidth){o.colwidth=o.colwidth.slice();for(let l=0;l<n;l++)o.colwidth.splice(e,0,0)}return o}function Te(t,e,n){const o=y(e.type.schema).header_cell;for(let l=0;l<t.height;l++)if(e.nodeAt(t.map[n+l*t.width]).type!=o)return!1;return!0}var w=class M extends N{constructor(e,n=e){const o=e.node(-1),l=C.get(o),s=e.start(-1),r=l.rectBetween(e.pos-s,n.pos-s),c=e.node(0),i=l.cellsInRect(r).filter(d=>d!=n.pos-s);i.unshift(n.pos-s);const a=i.map(d=>{const f=o.nodeAt(d);if(!f)throw RangeError(`No cell with offset ${d} found`);const u=s+d+1;return new ye(c.resolve(u),c.resolve(u+f.content.size))});super(a[0].$from,a[0].$to,a),this.$anchorCell=e,this.$headCell=n}map(e,n){const o=e.resolve(n.map(this.$anchorCell.pos)),l=e.resolve(n.map(this.$headCell.pos));if(Y(o)&&Y(l)&&ee(o,l)){const s=this.$anchorCell.node(-1)!=o.node(-1);return s&&this.isRowSelection()?M.rowSelection(o,l):s&&this.isColSelection()?M.colSelection(o,l):new M(o,l)}return E.between(o,l)}content(){const e=this.$anchorCell.node(-1),n=C.get(e),o=this.$anchorCell.start(-1),l=n.rectBetween(this.$anchorCell.pos-o,this.$headCell.pos-o),s={},r=[];for(let i=l.top;i<l.bottom;i++){const a=[];for(let d=i*n.width+l.left,f=l.left;f<l.right;f++,d++){const u=n.map[d];if(s[u])continue;s[u]=!0;const h=n.findCell(u);let p=e.nodeAt(u);if(!p)throw RangeError(`No cell with offset ${u} found`);const m=l.left-h.left,g=h.right-l.right;if(m>0||g>0){let b=p.attrs;if(m>0&&(b=T(b,0,m)),g>0&&(b=T(b,b.colspan-g,g)),h.left<l.left){if(p=p.type.createAndFill(b),!p)throw RangeError(`Could not create cell with attrs ${JSON.stringify(b)}`)}else p=p.type.create(b,p.content)}if(h.top<l.top||h.bottom>l.bottom){const b={...p.attrs,rowspan:Math.min(h.bottom,l.bottom)-Math.max(h.top,l.top)};h.top<l.top?p=p.type.createAndFill(b):p=p.type.create(b,p.content)}a.push(p)}r.push(e.child(i).copy(R.from(a)))}const c=this.isColSelection()&&this.isRowSelection()?e:r;return new v(R.from(c),1,1)}replace(e,n=v.empty){const o=e.steps.length,l=this.ranges;for(let r=0;r<l.length;r++){const{$from:c,$to:i}=l[r],a=e.mapping.slice(o);e.replace(a.map(c.pos),a.map(i.pos),r?v.empty:n)}const s=N.findFrom(e.doc.resolve(e.mapping.slice(o).map(this.to)),-1);s&&e.setSelection(s)}replaceWith(e,n){this.replace(e,new v(R.from(n),0,0))}forEachCell(e){const n=this.$anchorCell.node(-1),o=C.get(n),l=this.$anchorCell.start(-1),s=o.cellsInRect(o.rectBetween(this.$anchorCell.pos-l,this.$headCell.pos-l));for(let r=0;r<s.length;r++)e(n.nodeAt(s[r]),l+s[r])}isColSelection(){const e=this.$anchorCell.index(-1),n=this.$headCell.index(-1);if(Math.min(e,n)>0)return!1;const o=e+this.$anchorCell.nodeAfter.attrs.rowspan,l=n+this.$headCell.nodeAfter.attrs.rowspan;return Math.max(o,l)==this.$headCell.node(-1).childCount}static colSelection(e,n=e){const o=e.node(-1),l=C.get(o),s=e.start(-1),r=l.findCell(e.pos-s),c=l.findCell(n.pos-s),i=e.node(0);return r.top<=c.top?(r.top>0&&(e=i.resolve(s+l.map[r.left])),c.bottom<l.height&&(n=i.resolve(s+l.map[l.width*(l.height-1)+c.right-1]))):(c.top>0&&(n=i.resolve(s+l.map[c.left])),r.bottom<l.height&&(e=i.resolve(s+l.map[l.width*(l.height-1)+r.right-1]))),new M(e,n)}isRowSelection(){const e=this.$anchorCell.node(-1),n=C.get(e),o=this.$anchorCell.start(-1),l=n.colCount(this.$anchorCell.pos-o),s=n.colCount(this.$headCell.pos-o);if(Math.min(l,s)>0)return!1;const r=l+this.$anchorCell.nodeAfter.attrs.colspan,c=s+this.$headCell.nodeAfter.attrs.colspan;return Math.max(r,c)==n.width}eq(e){return e instanceof M&&e.$anchorCell.pos==this.$anchorCell.pos&&e.$headCell.pos==this.$headCell.pos}static rowSelection(e,n=e){const o=e.node(-1),l=C.get(o),s=e.start(-1),r=l.findCell(e.pos-s),c=l.findCell(n.pos-s),i=e.node(0);return r.left<=c.left?(r.left>0&&(e=i.resolve(s+l.map[r.top*l.width])),c.right<l.width&&(n=i.resolve(s+l.map[l.width*(c.top+1)-1]))):(c.left>0&&(n=i.resolve(s+l.map[c.top*l.width])),r.right<l.width&&(e=i.resolve(s+l.map[l.width*(r.top+1)-1]))),new M(e,n)}toJSON(){return{type:"cell",anchor:this.$anchorCell.pos,head:this.$headCell.pos}}static fromJSON(e,n){return new M(e.resolve(n.anchor),e.resolve(n.head))}static create(e,n,o=n){return new M(e.resolve(n),e.resolve(o))}getBookmark(){return new De(this.$anchorCell.pos,this.$headCell.pos)}};w.prototype.visible=!1;N.jsonID("cell",w);var De=class pe{constructor(e,n){this.anchor=e,this.head=n}map(e){return new pe(e.map(this.anchor),e.map(this.head))}resolve(e){const n=e.resolve(this.anchor),o=e.resolve(this.head);return n.parent.type.spec.tableRole=="row"&&o.parent.type.spec.tableRole=="row"&&n.index()<n.parent.childCount&&o.index()<o.parent.childCount&&ee(n,o)?new w(n,o):N.near(o,1)}};function He(t){if(!(t.selection instanceof w))return null;const e=[];return t.selection.forEachCell((n,o)=>{e.push(q.node(o,o+n.nodeSize,{class:"selectedCell"}))}),X.create(t.doc,e)}function Be({$from:t,$to:e}){if(t.pos==e.pos||t.pos<e.pos-6)return!1;let n=t.pos,o=e.pos,l=t.depth;for(;l>=0&&!(t.after(l+1)<t.end(l));l--,n++);for(let s=e.depth;s>=0&&!(e.before(s+1)>e.start(s));s--,o--);return n==o&&/row|table/.test(t.node(l).type.spec.tableRole)}function Le({$from:t,$to:e}){let n,o;for(let l=t.depth;l>0;l--){const s=t.node(l);if(s.type.spec.tableRole==="cell"||s.type.spec.tableRole==="header_cell"){n=s;break}}for(let l=e.depth;l>0;l--){const s=e.node(l);if(s.type.spec.tableRole==="cell"||s.type.spec.tableRole==="header_cell"){o=s;break}}return n!==o&&e.parentOffset===0}function $e(t,e,n){const o=(e||t).selection,l=(e||t).doc;let s,r;if(o instanceof Se&&(r=o.node.type.spec.tableRole)){if(r=="cell"||r=="header_cell")s=w.create(l,o.from);else if(r=="row"){const c=l.resolve(o.from+1);s=w.rowSelection(c,c)}else if(!n){const c=C.get(o.node),i=o.from+1,a=i+c.map[c.width*c.height-1];s=w.create(l,i+1,a)}}else o instanceof E&&Be(o)?s=E.create(l,o.from):o instanceof E&&Le(o)&&(s=E.create(l,o.$from.start(),o.$from.end()));return s&&(e||(e=t.tr)).setSelection(s),e}var _e=new Z("fix-tables");function me(t,e,n,o){const l=t.childCount,s=e.childCount;e:for(let r=0,c=0;r<s;r++){const i=e.child(r);for(let a=c,d=Math.min(l,r+3);a<d;a++)if(t.child(a)==i){c=a+1,n+=i.nodeSize;continue e}o(i,n),c<l&&t.child(c).sameMarkup(i)?me(t.child(c),i,n+1,o):i.nodesBetween(0,i.content.size,o,n+1),n+=i.nodeSize}}function Fe(t,e){let n;const o=(l,s)=>{l.type.spec.tableRole=="table"&&(n=Pe(t,l,s,n))};return e?e.doc!=t.doc&&me(e.doc,t.doc,0,o):t.doc.descendants(o),n}function Pe(t,e,n,o){const l=C.get(e);if(!l.problems)return o;o||(o=t.tr);const s=[];for(let i=0;i<l.height;i++)s.push(0);for(let i=0;i<l.problems.length;i++){const a=l.problems[i];if(a.type=="collision"){const d=e.nodeAt(a.pos);if(!d)continue;const f=d.attrs;for(let u=0;u<f.rowspan;u++)s[a.row+u]+=a.n;o.setNodeMarkup(o.mapping.map(n+1+a.pos),null,T(f,f.colspan-a.n,a.n))}else if(a.type=="missing")s[a.row]+=a.n;else if(a.type=="overlong_rowspan"){const d=e.nodeAt(a.pos);if(!d)continue;o.setNodeMarkup(o.mapping.map(n+1+a.pos),null,{...d.attrs,rowspan:d.attrs.rowspan-a.n})}else if(a.type=="colwidth mismatch"){const d=e.nodeAt(a.pos);if(!d)continue;o.setNodeMarkup(o.mapping.map(n+1+a.pos),null,{...d.attrs,colwidth:a.colwidth})}}let r,c;for(let i=0;i<s.length;i++)s[i]&&(r==null&&(r=i),c=i);for(let i=0,a=n+1;i<l.height;i++){const d=e.child(i),f=a+d.nodeSize,u=s[i];if(u>0){let h="cell";d.firstChild&&(h=d.firstChild.type.spec.tableRole);const p=[];for(let g=0;g<u;g++){const b=y(t.schema)[h].createAndFill();b&&p.push(b)}const m=(i==0||r==i-1)&&c==i?a+1:f-1;o.insert(o.mapping.map(m),p)}a=f}return o.setMeta(_e,{fixTables:!0})}function x(t){const e=t.selection,n=O(t),o=n.node(-1),l=n.start(-1),s=C.get(o);return{...e instanceof w?s.rectBetween(e.$anchorCell.pos-l,e.$headCell.pos-l):s.findCell(n.pos-l),tableStart:l,map:s,table:o}}function ge(t,{map:e,tableStart:n,table:o},l){let s=l>0?-1:0;Te(e,o,l+s)&&(s=l==0||l==e.width?null:0);for(let r=0;r<e.height;r++){const c=r*e.width+l;if(l>0&&l<e.width&&e.map[c-1]==e.map[c]){const i=e.map[c],a=o.nodeAt(i);t.setNodeMarkup(t.mapping.map(n+i),null,he(a.attrs,l-e.colCount(i))),r+=a.attrs.rowspan-1}else{const i=s==null?y(o.type.schema).cell:o.nodeAt(e.map[c+s]).type,a=e.positionAt(r,l,o);t.insert(t.mapping.map(n+a),i.createAndFill())}}return t}function gt(t,e){if(!A(t))return!1;if(e){const n=x(t);e(ge(t.tr,n,n.left))}return!0}function wt(t,e){if(!A(t))return!1;if(e){const n=x(t);e(ge(t.tr,n,n.right))}return!0}function We(t,{map:e,table:n,tableStart:o},l){const s=t.mapping.maps.length;for(let r=0;r<e.height;){const c=r*e.width+l,i=e.map[c],a=n.nodeAt(i),d=a.attrs;if(l>0&&e.map[c-1]==i||l<e.width-1&&e.map[c+1]==i)t.setNodeMarkup(t.mapping.slice(s).map(o+i),null,T(d,l-e.colCount(i)));else{const f=t.mapping.slice(s).map(o+i);t.delete(f,f+a.nodeSize)}r+=d.rowspan}}function Ct(t,e){if(!A(t))return!1;if(e){const n=x(t),o=t.tr;if(n.left==0&&n.right==n.map.width)return!1;for(let l=n.right-1;We(o,n,l),l!=n.left;l--){const s=n.tableStart?o.doc.nodeAt(n.tableStart-1):o.doc;if(!s)throw RangeError("No table found");n.table=s,n.map=C.get(s)}e(o)}return!0}function Ie(t,e,n){var o;const l=y(e.type.schema).header_cell;for(let s=0;s<t.width;s++)if(((o=e.nodeAt(t.map[s+n*t.width]))==null?void 0:o.type)!=l)return!1;return!0}function we(t,{map:e,tableStart:n,table:o},l){var s;let r=n;for(let a=0;a<l;a++)r+=o.child(a).nodeSize;const c=[];let i=l>0?-1:0;Ie(e,o,l+i)&&(i=l==0||l==e.height?null:0);for(let a=0,d=e.width*l;a<e.width;a++,d++)if(l>0&&l<e.height&&e.map[d]==e.map[d-e.width]){const f=e.map[d],u=o.nodeAt(f).attrs;t.setNodeMarkup(n+f,null,{...u,rowspan:u.rowspan+1}),a+=u.colspan-1}else{const f=i==null?y(o.type.schema).cell:(s=o.nodeAt(e.map[d+i*e.width]))==null?void 0:s.type,u=f==null?void 0:f.createAndFill();u&&c.push(u)}return t.insert(r,y(o.type.schema).row.create(null,c)),t}function bt(t,e){if(!A(t))return!1;if(e){const n=x(t);e(we(t.tr,n,n.top))}return!0}function yt(t,e){if(!A(t))return!1;if(e){const n=x(t);e(we(t.tr,n,n.bottom))}return!0}function Oe(t,{map:e,table:n,tableStart:o},l){let s=0;for(let a=0;a<l;a++)s+=n.child(a).nodeSize;const r=s+n.child(l).nodeSize,c=t.mapping.maps.length;t.delete(s+o,r+o);const i=new Set;for(let a=0,d=l*e.width;a<e.width;a++,d++){const f=e.map[d];if(!i.has(f)){if(i.add(f),l>0&&f==e.map[d-e.width]){const u=n.nodeAt(f).attrs;t.setNodeMarkup(t.mapping.slice(c).map(f+o),null,{...u,rowspan:u.rowspan-1}),a+=u.colspan-1}else if(l<e.height&&f==e.map[d+e.width]){const u=n.nodeAt(f),h=u.attrs,p=u.type.create({...h,rowspan:u.attrs.rowspan-1},u.content),m=e.positionAt(l+1,a,n);t.insert(t.mapping.slice(c).map(o+m),p),a+=h.colspan-1}}}}function St(t,e){if(!A(t))return!1;if(e){const n=x(t),o=t.tr;if(n.top==0&&n.bottom==n.map.height)return!1;for(let l=n.bottom-1;Oe(o,n,l),l!=n.top;l--){const s=n.tableStart?o.doc.nodeAt(n.tableStart-1):o.doc;if(!s)throw RangeError("No table found");n.table=s,n.map=C.get(n.table)}e(o)}return!0}function ne(t){const e=t.content;return e.childCount==1&&e.child(0).isTextblock&&e.child(0).childCount==0}function je({width:t,height:e,map:n},o){let l=o.top*t+o.left,s=l,r=(o.bottom-1)*t+o.left,c=l+(o.right-o.left-1);for(let i=o.top;i<o.bottom;i++){if(o.left>0&&n[s]==n[s-1]||o.right<t&&n[c]==n[c+1])return!0;s+=t,c+=t}for(let i=o.left;i<o.right;i++){if(o.top>0&&n[l]==n[l-t]||o.bottom<e&&n[r]==n[r+t])return!0;l++,r++}return!1}function At(t,e){const n=t.selection;if(!(n instanceof w)||n.$anchorCell.pos==n.$headCell.pos)return!1;const o=x(t),{map:l}=o;if(je(l,o))return!1;if(e){const s=t.tr,r={};let c=R.empty,i,a;for(let d=o.top;d<o.bottom;d++)for(let f=o.left;f<o.right;f++){const u=l.map[d*l.width+f],h=o.table.nodeAt(u);if(!(r[u]||!h))if(r[u]=!0,i==null)i=u,a=h;else{ne(h)||(c=c.append(h.content));const p=s.mapping.map(u+o.tableStart);s.delete(p,p+h.nodeSize)}}if(i==null||a==null)return!0;if(s.setNodeMarkup(i+o.tableStart,null,{...he(a.attrs,a.attrs.colspan,o.right-o.left-a.attrs.colspan),rowspan:o.bottom-o.top}),c.size){const d=i+1+a.content.size,f=ne(a)?i+1:d;s.replaceWith(f+o.tableStart,d+o.tableStart,c)}s.setSelection(new w(s.doc.resolve(i+o.tableStart))),e(s)}return!0}function Rt(t,e){const n=y(t.schema);return Ke(({node:o})=>n[o.type.spec.tableRole])(t,e)}function Ke(t){return(e,n)=>{var o;const l=e.selection;let s,r;if(l instanceof w){if(l.$anchorCell.pos!=l.$headCell.pos)return!1;s=l.$anchorCell.nodeAfter,r=l.$anchorCell.pos}else{if(s=ve(l.$from),!s)return!1;r=(o=D(l.$from))==null?void 0:o.pos}if(s==null||r==null||s.attrs.colspan==1&&s.attrs.rowspan==1)return!1;if(n){let c=s.attrs;const i=[],a=c.colwidth;c.rowspan>1&&(c={...c,rowspan:1}),c.colspan>1&&(c={...c,colspan:1});const d=x(e),f=e.tr;for(let h=0;h<d.right-d.left;h++)i.push(a?{...c,colwidth:a&&a[h]?[a[h]]:null}:c);let u;for(let h=d.top;h<d.bottom;h++){let p=d.map.positionAt(h,d.left,d.table);h==d.top&&(p+=s.nodeSize);for(let m=d.left,g=0;m<d.right;m++,g++)m==d.left&&h==d.top||f.insert(u=f.mapping.map(p+d.tableStart,1),t({node:s,row:h,col:m}).createAndFill(i[g]))}f.setNodeMarkup(r,t({node:s,row:d.top,col:d.left}),i[0]),l instanceof w&&f.setSelection(new w(f.doc.resolve(l.$anchorCell.pos),u?f.doc.resolve(u):void 0)),n(f)}return!0}}function xt(t,e){return function(n,o){if(!A(n))return!1;const l=O(n);if(l.nodeAfter.attrs[t]===e)return!1;if(o){const s=n.tr;n.selection instanceof w?n.selection.forEachCell((r,c)=>{r.attrs[t]!==e&&s.setNodeMarkup(c,null,{...r.attrs,[t]:e})}):s.setNodeMarkup(l.pos,null,{...l.nodeAfter.attrs,[t]:e}),o(s)}return!0}}function Ve(t){return function(e,n){if(!A(e))return!1;if(n){const o=y(e.schema),l=x(e),s=e.tr,r=l.map.cellsInRect(t=="column"?{left:l.left,top:0,right:l.right,bottom:l.map.height}:t=="row"?{left:0,top:l.top,right:l.map.width,bottom:l.bottom}:l),c=r.map(i=>l.table.nodeAt(i));for(let i=0;i<r.length;i++)c[i].type==o.header_cell&&s.setNodeMarkup(l.tableStart+r[i],o.cell,c[i].attrs);if(s.steps.length==0)for(let i=0;i<r.length;i++)s.setNodeMarkup(l.tableStart+r[i],o.header_cell,c[i].attrs);n(s)}return!0}}function oe(t,e,n){const o=e.map.cellsInRect({left:0,top:0,right:t=="row"?e.map.width:1,bottom:t=="column"?e.map.height:1});for(let l=0;l<o.length;l++){const s=e.table.nodeAt(o[l]);if(s&&s.type!==n.header_cell)return!1}return!0}function te(t,e){return e=e||{useDeprecatedLogic:!1},e.useDeprecatedLogic?Ve(t):function(n,o){if(!A(n))return!1;if(o){const l=y(n.schema),s=x(n),r=n.tr,c=oe("row",s,l),i=oe("column",s,l),d=(t==="column"?c:t==="row"?i:!1)?1:0,f=t=="column"?{left:0,top:d,right:1,bottom:s.map.height}:t=="row"?{left:d,top:0,right:s.map.width,bottom:1}:s,u=t=="column"?i?l.cell:l.header_cell:t=="row"?c?l.cell:l.header_cell:l.cell;s.map.cellsInRect(f).forEach(h=>{const p=h+s.tableStart,m=r.doc.nodeAt(p);m&&r.setNodeMarkup(p,u,m.attrs)}),o(r)}return!0}}te("row",{useDeprecatedLogic:!0});te("column",{useDeprecatedLogic:!0});var Mt=te("cell",{useDeprecatedLogic:!0});function Xe(t,e){if(e<0){const n=t.nodeBefore;if(n)return t.pos-n.nodeSize;for(let o=t.index(-1)-1,l=t.before();o>=0;o--){const s=t.node(-1).child(o),r=s.lastChild;if(r)return l-1-r.nodeSize;l-=s.nodeSize}}else{if(t.index()<t.parent.childCount-1)return t.pos+t.nodeAfter.nodeSize;const n=t.node(-1);for(let o=t.indexAfter(-1),l=t.after();o<n.childCount;o++){const s=n.child(o);if(s.childCount)return l+1;l+=s.nodeSize}}return null}function Nt(t){return function(e,n){if(!A(e))return!1;const o=Xe(O(e),t);if(o==null)return!1;if(n){const l=e.doc.resolve(o);n(e.tr.setSelection(E.between(l,Ee(l))).scrollIntoView())}return!0}}function zt(t,e){const n=t.selection.$anchor;for(let o=n.depth;o>0;o--)if(n.node(o).type.spec.tableRole=="table")return e&&e(t.tr.delete(n.before(o),n.after(o)).scrollIntoView()),!0;return!1}function _(t,e){const n=t.selection;if(!(n instanceof w))return!1;if(e){const o=t.tr,l=y(t.schema).cell.createAndFill().content;n.forEachCell((s,r)=>{s.content.eq(l)||o.replace(o.mapping.map(r+1),o.mapping.map(r+s.nodeSize-1),new v(l,0,0))}),o.docChanged&&e(o)}return!0}function qe(t){if(!t.size)return null;let{content:e,openStart:n,openEnd:o}=t;for(;e.childCount==1&&(n>0&&o>0||e.child(0).type.spec.tableRole=="table");)n--,o--,e=e.child(0).content;const l=e.child(0),s=l.type.spec.tableRole,r=l.type.schema,c=[];if(s=="row")for(let i=0;i<e.childCount;i++){let a=e.child(i).content;const d=i?0:Math.max(0,n-1),f=i<e.childCount-1?0:Math.max(0,o-1);(d||f)&&(a=G(y(r).row,new v(a,d,f)).content),c.push(a)}else if(s=="cell"||s=="header_cell")c.push(n||o?G(y(r).row,new v(e,n,o)).content:e);else return null;return Je(r,c)}function Je(t,e){const n=[];for(let l=0;l<e.length;l++){const s=e[l];for(let r=s.childCount-1;r>=0;r--){const{rowspan:c,colspan:i}=s.child(r).attrs;for(let a=l;a<l+c;a++)n[a]=(n[a]||0)+i}}let o=0;for(let l=0;l<n.length;l++)o=Math.max(o,n[l]);for(let l=0;l<n.length;l++)if(l>=e.length&&e.push(R.empty),n[l]<o){const s=y(t).cell.createAndFill(),r=[];for(let c=n[l];c<o;c++)r.push(s);e[l]=e[l].append(R.from(r))}return{height:e.length,width:o,rows:e}}function G(t,e){const n=t.createAndFill();return new Re(n).replace(0,n.content.size,e).doc}function Ue({width:t,height:e,rows:n},o,l){if(t!=o){const s=[],r=[];for(let c=0;c<n.length;c++){const i=n[c],a=[];for(let d=s[c]||0,f=0;d<o;f++){let u=i.child(f%i.childCount);d+u.attrs.colspan>o&&(u=u.type.createChecked(T(u.attrs,u.attrs.colspan,d+u.attrs.colspan-o),u.content)),a.push(u),d+=u.attrs.colspan;for(let h=1;h<u.attrs.rowspan;h++)s[c+h]=(s[c+h]||0)+u.attrs.colspan}r.push(R.from(a))}n=r,t=o}if(e!=l){const s=[];for(let r=0,c=0;r<l;r++,c++){const i=[],a=n[c%e];for(let d=0;d<a.childCount;d++){let f=a.child(d);r+f.attrs.rowspan>l&&(f=f.type.create({...f.attrs,rowspan:Math.max(1,l-f.attrs.rowspan)},f.content)),i.push(f)}s.push(R.from(i))}n=s,e=l}return{width:t,height:e,rows:n}}function Ye(t,e,n,o,l,s,r){const c=t.doc.type.schema,i=y(c);let a,d;if(l>e.width)for(let f=0,u=0;f<e.height;f++){const h=n.child(f);u+=h.nodeSize;const p=[];let m;h.lastChild==null||h.lastChild.type==i.cell?m=a||(a=i.cell.createAndFill()):m=d||(d=i.header_cell.createAndFill());for(let g=e.width;g<l;g++)p.push(m);t.insert(t.mapping.slice(r).map(u-1+o),p)}if(s>e.height){const f=[];for(let p=0,m=(e.height-1)*e.width;p<Math.max(e.width,l);p++){const g=p>=e.width?!1:n.nodeAt(e.map[m+p]).type==i.header_cell;f.push(g?d||(d=i.header_cell.createAndFill()):a||(a=i.cell.createAndFill()))}const u=i.row.create(null,R.from(f)),h=[];for(let p=e.height;p<s;p++)h.push(u);t.insert(t.mapping.slice(r).map(o+n.nodeSize-2),h)}return!!(a||d)}function le(t,e,n,o,l,s,r,c){if(r==0||r==e.height)return!1;let i=!1;for(let a=l;a<s;a++){const d=r*e.width+a,f=e.map[d];if(e.map[d-e.width]==f){i=!0;const u=n.nodeAt(f),{top:h,left:p}=e.findCell(f);t.setNodeMarkup(t.mapping.slice(c).map(f+o),null,{...u.attrs,rowspan:r-h}),t.insert(t.mapping.slice(c).map(e.positionAt(r,p,n)),u.type.createAndFill({...u.attrs,rowspan:h+u.attrs.rowspan-r})),a+=u.attrs.colspan-1}}return i}function se(t,e,n,o,l,s,r,c){if(r==0||r==e.width)return!1;let i=!1;for(let a=l;a<s;a++){const d=a*e.width+r,f=e.map[d];if(e.map[d-1]==f){i=!0;const u=n.nodeAt(f),h=e.colCount(f),p=t.mapping.slice(c).map(f+o);t.setNodeMarkup(p,null,T(u.attrs,r-h,u.attrs.colspan-(r-h))),t.insert(p+u.nodeSize,u.type.createAndFill(T(u.attrs,0,r-h))),a+=u.attrs.rowspan-1}}return i}function re(t,e,n,o,l){let s=n?t.doc.nodeAt(n-1):t.doc;if(!s)throw new Error("No table found");let r=C.get(s);const{top:c,left:i}=o,a=i+l.width,d=c+l.height,f=t.tr;let u=0;function h(){if(s=n?f.doc.nodeAt(n-1):f.doc,!s)throw new Error("No table found");r=C.get(s),u=f.mapping.maps.length}Ye(f,r,s,n,a,d,u)&&h(),le(f,r,s,n,i,a,c,u)&&h(),le(f,r,s,n,i,a,d,u)&&h(),se(f,r,s,n,c,d,i,u)&&h(),se(f,r,s,n,c,d,a,u)&&h();for(let p=c;p<d;p++){const m=r.positionAt(p,i,s),g=r.positionAt(p,a,s);f.replace(f.mapping.slice(u).map(m+n),f.mapping.slice(u).map(g+n),new v(l.rows[p-c],0,0))}h(),f.setSelection(new w(f.doc.resolve(n+r.positionAt(c,i,s)),f.doc.resolve(n+r.positionAt(d-1,a-1,s)))),e(f)}var Ge=Ae({ArrowLeft:F("horiz",-1),ArrowRight:F("horiz",1),ArrowUp:F("vert",-1),ArrowDown:F("vert",1),"Shift-ArrowLeft":P("horiz",-1),"Shift-ArrowRight":P("horiz",1),"Shift-ArrowUp":P("vert",-1),"Shift-ArrowDown":P("vert",1),Backspace:_,"Mod-Backspace":_,Delete:_,"Mod-Delete":_});function W(t,e,n){return n.eq(t.selection)?!1:(e&&e(t.tr.setSelection(n).scrollIntoView()),!0)}function F(t,e){return(n,o,l)=>{if(!l)return!1;const s=n.selection;if(s instanceof w)return W(n,o,N.near(s.$headCell,e));if(t!="horiz"&&!s.empty)return!1;const r=Ce(l,t,e);if(r==null)return!1;if(t=="horiz")return W(n,o,N.near(n.doc.resolve(s.head+e),e));{const c=n.doc.resolve(r),i=ue(c,t,e);let a;return i?a=N.near(i,1):e<0?a=N.near(n.doc.resolve(c.before(-1)),-1):a=N.near(n.doc.resolve(c.after(-1)),1),W(n,o,a)}}}function P(t,e){return(n,o,l)=>{if(!l)return!1;const s=n.selection;let r;if(s instanceof w)r=s;else{const i=Ce(l,t,e);if(i==null)return!1;r=new w(n.doc.resolve(i))}const c=ue(r.$headCell,t,e);return c?W(n,o,new w(r.$anchorCell,c)):!1}}function Qe(t,e){const n=t.state.doc,o=D(n.resolve(e));return o?(t.dispatch(t.state.tr.setSelection(new w(o))),!0):!1}function Ze(t,e,n){if(!A(t.state))return!1;let o=qe(n);const l=t.state.selection;if(l instanceof w){o||(o={width:1,height:1,rows:[R.from(G(y(t.state.schema).cell,n))]});const s=l.$anchorCell.node(-1),r=l.$anchorCell.start(-1),c=C.get(s).rectBetween(l.$anchorCell.pos-r,l.$headCell.pos-r);return o=Ue(o,c.right-c.left,c.bottom-c.top),re(t.state,t.dispatch,r,c,o),!0}else if(o){const s=O(t.state),r=s.start(-1);return re(t.state,t.dispatch,r,C.get(s.node(-1)).findCell(s.pos-r),o),!0}else return!1}function et(t,e){var n;if(e.ctrlKey||e.metaKey)return;const o=ie(t,e.target);let l;if(e.shiftKey&&t.state.selection instanceof w)s(t.state.selection.$anchorCell,e),e.preventDefault();else if(e.shiftKey&&o&&(l=D(t.state.selection.$anchor))!=null&&((n=V(t,e))==null?void 0:n.pos)!=l.pos)s(l,e),e.preventDefault();else if(!o)return;function s(i,a){let d=V(t,a);const f=z.getState(t.state)==null;if(!d||!ee(i,d))if(f)d=i;else return;const u=new w(i,d);if(f||!t.state.selection.eq(u)){const h=t.state.tr.setSelection(u);f&&h.setMeta(z,i.pos),t.dispatch(h)}}function r(){t.root.removeEventListener("mouseup",r),t.root.removeEventListener("dragstart",r),t.root.removeEventListener("mousemove",c),z.getState(t.state)!=null&&t.dispatch(t.state.tr.setMeta(z,-1))}function c(i){const a=i,d=z.getState(t.state);let f;if(d!=null)f=t.state.doc.resolve(d);else if(ie(t,a.target)!=o&&(f=V(t,e),!f))return r();f&&s(f,a)}t.root.addEventListener("mouseup",r),t.root.addEventListener("dragstart",r),t.root.addEventListener("mousemove",c)}function Ce(t,e,n){if(!(t.state.selection instanceof E))return null;const{$head:o}=t.state.selection;for(let l=o.depth-1;l>=0;l--){const s=o.node(l);if((n<0?o.index(l):o.indexAfter(l))!=(n<0?0:s.childCount))return null;if(s.type.spec.tableRole=="cell"||s.type.spec.tableRole=="header_cell"){const c=o.before(l),i=e=="vert"?n>0?"down":"up":n>0?"right":"left";return t.endOfTextblock(i)?c:null}}return null}function ie(t,e){for(;e&&e!=t.dom;e=e.parentNode)if(e.nodeName=="TD"||e.nodeName=="TH")return e;return null}function V(t,e){const n=t.posAtCoords({left:e.clientX,top:e.clientY});return n&&n?D(t.state.doc.resolve(n.pos)):null}var tt=class{constructor(t,e){this.node=t,this.defaultCellMinWidth=e,this.dom=document.createElement("div"),this.dom.className="tableWrapper",this.table=this.dom.appendChild(document.createElement("table")),this.table.style.setProperty("--default-cell-min-width",`${e}px`),this.colgroup=this.table.appendChild(document.createElement("colgroup")),Q(t,this.colgroup,this.table,e),this.contentDOM=this.table.appendChild(document.createElement("tbody"))}update(t){return t.type!=this.node.type?!1:(this.node=t,Q(t,this.colgroup,this.table,this.defaultCellMinWidth),!0)}ignoreMutation(t){return t.type=="attributes"&&(t.target==this.table||this.colgroup.contains(t.target))}};function Q(t,e,n,o,l,s){var r;let c=0,i=!0,a=e.firstChild;const d=t.firstChild;if(d){for(let f=0,u=0;f<d.childCount;f++){const{colspan:h,colwidth:p}=d.child(f).attrs;for(let m=0;m<h;m++,u++){const g=l==u?s:p&&p[m],b=g?g+"px":"";if(c+=g||o,g||(i=!1),a)a.style.width!=b&&(a.style.width=b),a=a.nextSibling;else{const H=document.createElement("col");H.style.width=b,e.appendChild(H)}}}for(;a;){const f=a.nextSibling;(r=a.parentNode)==null||r.removeChild(a),a=f}i?(n.style.width=c+"px",n.style.minWidth=""):(n.style.width="",n.style.minWidth=c+"px")}}var S=new Z("tableColumnResizing");function vt({handleWidth:t=5,cellMinWidth:e=25,defaultCellMinWidth:n=100,View:o=tt,lastColumnResizable:l=!0}={}){const s=new fe({key:S,state:{init(r,c){var i,a;const d=(a=(i=s.spec)==null?void 0:i.props)==null?void 0:a.nodeViews,f=y(c.schema).table.name;return o&&d&&(d[f]=(u,h)=>new o(u,n,h)),new nt(-1,!1)},apply(r,c){return c.apply(r)}},props:{attributes:r=>{const c=S.getState(r);return c&&c.activeHandle>-1?{class:"resize-cursor"}:{}},handleDOMEvents:{mousemove:(r,c)=>{ot(r,c,t,l)},mouseleave:r=>{lt(r)},mousedown:(r,c)=>{st(r,c,e,n)}},decorations:r=>{const c=S.getState(r);if(c&&c.activeHandle>-1)return dt(r,c.activeHandle)},nodeViews:{}}});return s}var nt=class I{constructor(e,n){this.activeHandle=e,this.dragging=n}apply(e){const n=this,o=e.getMeta(S);if(o&&o.setHandle!=null)return new I(o.setHandle,!1);if(o&&o.setDragging!==void 0)return new I(n.activeHandle,o.setDragging);if(n.activeHandle>-1&&e.docChanged){let l=e.mapping.map(n.activeHandle,-1);return Y(e.doc.resolve(l))||(l=-1),new I(l,n.dragging)}return n}};function ot(t,e,n,o){const l=S.getState(t.state);if(l&&!l.dragging){const s=it(e.target);let r=-1;if(s){const{left:c,right:i}=s.getBoundingClientRect();e.clientX-c<=n?r=ce(t,e,"left",n):i-e.clientX<=n&&(r=ce(t,e,"right",n))}if(r!=l.activeHandle){if(!o&&r!==-1){const c=t.state.doc.resolve(r),i=c.node(-1),a=C.get(i),d=c.start(-1);if(a.colCount(c.pos-d)+c.nodeAfter.attrs.colspan-1==a.width-1)return}be(t,r)}}}function lt(t){const e=S.getState(t.state);e&&e.activeHandle>-1&&!e.dragging&&be(t,-1)}function st(t,e,n,o){var l;const s=(l=t.dom.ownerDocument.defaultView)!=null?l:window,r=S.getState(t.state);if(!r||r.activeHandle==-1||r.dragging)return!1;const c=t.state.doc.nodeAt(r.activeHandle),i=rt(t,r.activeHandle,c.attrs);t.dispatch(t.state.tr.setMeta(S,{setDragging:{startX:e.clientX,startWidth:i}}));function a(f){s.removeEventListener("mouseup",a),s.removeEventListener("mousemove",d);const u=S.getState(t.state);u!=null&&u.dragging&&(ct(t,u.activeHandle,ae(u.dragging,f,n)),t.dispatch(t.state.tr.setMeta(S,{setDragging:null})))}function d(f){if(!f.which)return a(f);const u=S.getState(t.state);if(u&&u.dragging){const h=ae(u.dragging,f,n);de(t,u.activeHandle,h,o)}}return de(t,r.activeHandle,i,o),s.addEventListener("mouseup",a),s.addEventListener("mousemove",d),e.preventDefault(),!0}function rt(t,e,{colspan:n,colwidth:o}){const l=o&&o[o.length-1];if(l)return l;const s=t.domAtPos(e);let c=s.node.childNodes[s.offset].offsetWidth,i=n;if(o)for(let a=0;a<n;a++)o[a]&&(c-=o[a],i--);return c/i}function it(t){for(;t&&t.nodeName!="TD"&&t.nodeName!="TH";)t=t.classList&&t.classList.contains("ProseMirror")?null:t.parentNode;return t}function ce(t,e,n,o){const l=n=="right"?-o:o,s=t.posAtCoords({left:e.clientX+l,top:e.clientY});if(!s)return-1;const{pos:r}=s,c=D(t.state.doc.resolve(r));if(!c)return-1;if(n=="right")return c.pos;const i=C.get(c.node(-1)),a=c.start(-1),d=i.map.indexOf(c.pos-a);return d%i.width==0?-1:a+i.map[d-1]}function ae(t,e,n){const o=e.clientX-t.startX;return Math.max(n,t.startWidth+o)}function be(t,e){t.dispatch(t.state.tr.setMeta(S,{setHandle:e}))}function ct(t,e,n){const o=t.state.doc.resolve(e),l=o.node(-1),s=C.get(l),r=o.start(-1),c=s.colCount(o.pos-r)+o.nodeAfter.attrs.colspan-1,i=t.state.tr;for(let a=0;a<s.height;a++){const d=a*s.width+c;if(a&&s.map[d]==s.map[d-s.width])continue;const f=s.map[d],u=l.nodeAt(f).attrs,h=u.colspan==1?0:c-s.colCount(f);if(u.colwidth&&u.colwidth[h]==n)continue;const p=u.colwidth?u.colwidth.slice():at(u.colspan);p[h]=n,i.setNodeMarkup(r+f,null,{...u,colwidth:p})}i.docChanged&&t.dispatch(i)}function de(t,e,n,o){const l=t.state.doc.resolve(e),s=l.node(-1),r=l.start(-1),c=C.get(s).colCount(l.pos-r)+l.nodeAfter.attrs.colspan-1;let i=t.domAtPos(l.start(-1)).node;for(;i&&i.nodeName!="TABLE";)i=i.parentNode;i&&Q(s,i.firstChild,i,o,c,n)}function at(t){return Array(t).fill(0)}function dt(t,e){var n;const o=[],l=t.doc.resolve(e),s=l.node(-1);if(!s)return X.empty;const r=C.get(s),c=l.start(-1),i=r.colCount(l.pos-c)+l.nodeAfter.attrs.colspan-1;for(let a=0;a<r.height;a++){const d=i+a*r.width;if((i==r.width-1||r.map[d]!=r.map[d+1])&&(a==0||r.map[d]!=r.map[d-r.width])){const f=r.map[d],u=c+f+s.nodeAt(f).nodeSize-1,h=document.createElement("div");h.className="column-resize-handle",(n=S.getState(t))!=null&&n.dragging&&o.push(q.node(c+f,c+f+s.nodeAt(f).nodeSize,{class:"column-resize-dragging"})),o.push(q.widget(u,h))}}return X.create(t.doc,o)}function kt({allowTableNodeSelection:t=!1}={}){return new fe({key:z,state:{init(){return null},apply(e,n){const o=e.getMeta(z);if(o!=null)return o==-1?null:o;if(n==null||!e.docChanged)return n;const{deleted:l,pos:s}=e.mapping.mapResult(n);return l?null:s}},props:{decorations:He,handleDOMEvents:{mousedown:et},createSelectionBetween(e){return z.getState(e.state)!=null?e.state.selection:null},handleTripleClick:Qe,handleKeyDown:Ge,handlePaste:Ze},appendTransaction(e,n,o){return $e(o,Fe(o,n),t)}})}export{w as C,gt as a,wt as b,bt as c,Ct as d,yt as e,St as f,zt as g,Mt as h,xt as i,Nt as j,Fe as k,vt as l,At as m,kt as n,Rt as s,te as t};
