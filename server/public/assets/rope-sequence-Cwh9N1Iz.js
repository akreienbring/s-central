var l=200,f=function(){};f.prototype.append=function(t){return t.length?(t=f.from(t),!this.length&&t||t.length<l&&this.leafAppend(t)||this.length<l&&t.leafPrepend(this)||this.appendInner(t)):this};f.prototype.prepend=function(t){return t.length?f.from(t).append(this):this};f.prototype.appendInner=function(t){return new u(this,t)};f.prototype.slice=function(t,r){return t===void 0&&(t=0),r===void 0&&(r=this.length),t>=r?f.empty:this.sliceInner(Math.max(0,t),Math.min(this.length,r))};f.prototype.get=function(t){if(!(t<0||t>=this.length))return this.getInner(t)};f.prototype.forEach=function(t,r,e){r===void 0&&(r=0),e===void 0&&(e=this.length),r<=e?this.forEachInner(t,r,e,0):this.forEachInvertedInner(t,r,e,0)};f.prototype.map=function(t,r,e){r===void 0&&(r=0),e===void 0&&(e=this.length);var n=[];return this.forEach(function(i,s){return n.push(t(i,s))},r,e),n};f.from=function(t){return t instanceof f?t:t&&t.length?new o(t):f.empty};var o=function(p){function t(e){p.call(this),this.values=e}t.__proto__=p,t.prototype=Object.create(p.prototype),t.prototype.constructor=t;var r={length:{configurable:!0},depth:{configurable:!0}};return t.prototype.flatten=function(){return this.values},t.prototype.sliceInner=function(n,i){return n==0&&i==this.length?this:new t(this.values.slice(n,i))},t.prototype.getInner=function(n){return this.values[n]},t.prototype.forEachInner=function(n,i,s,h){for(var a=i;a<s;a++)if(n(this.values[a],h+a)===!1)return!1},t.prototype.forEachInvertedInner=function(n,i,s,h){for(var a=i-1;a>=s;a--)if(n(this.values[a],h+a)===!1)return!1},t.prototype.leafAppend=function(n){if(this.length+n.length<=l)return new t(this.values.concat(n.flatten()))},t.prototype.leafPrepend=function(n){if(this.length+n.length<=l)return new t(n.flatten().concat(this.values))},r.length.get=function(){return this.values.length},r.depth.get=function(){return 0},Object.defineProperties(t.prototype,r),t}(f);f.empty=new o([]);var u=function(p){function t(r,e){p.call(this),this.left=r,this.right=e,this.length=r.length+e.length,this.depth=Math.max(r.depth,e.depth)+1}return t.__proto__=p,t.prototype=Object.create(p.prototype),t.prototype.constructor=t,t.prototype.flatten=function(){return this.left.flatten().concat(this.right.flatten())},t.prototype.getInner=function(e){return e<this.left.length?this.left.get(e):this.right.get(e-this.left.length)},t.prototype.forEachInner=function(e,n,i,s){var h=this.left.length;if(n<h&&this.left.forEachInner(e,n,Math.min(i,h),s)===!1||i>h&&this.right.forEachInner(e,Math.max(n-h,0),Math.min(this.length,i)-h,s+h)===!1)return!1},t.prototype.forEachInvertedInner=function(e,n,i,s){var h=this.left.length;if(n>h&&this.right.forEachInvertedInner(e,n-h,Math.max(i,h)-h,s+h)===!1||i<h&&this.left.forEachInvertedInner(e,Math.min(n,h),i,s)===!1)return!1},t.prototype.sliceInner=function(e,n){if(e==0&&n==this.length)return this;var i=this.left.length;return n<=i?this.left.slice(e,n):e>=i?this.right.slice(e-i,n-i):this.left.slice(e,i).append(this.right.slice(0,n-i))},t.prototype.leafAppend=function(e){var n=this.right.leafAppend(e);if(n)return new t(this.left,n)},t.prototype.leafPrepend=function(e){var n=this.left.leafPrepend(e);if(n)return new t(n,this.right)},t.prototype.appendInner=function(e){return this.left.depth>=Math.max(this.right.depth,e.depth)+1?new t(this.left,new t(this.right,e)):new t(this,e)},t}(f);export{f as R};
