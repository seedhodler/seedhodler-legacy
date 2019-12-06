(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{274:function(e,t){},276:function(e,t){},293:function(e,t){},295:function(e,t){},372:function(e,t,n){"use strict";n.r(t);var r=n(36),o=(n(108),n(201),n(193),n(269)),l={name:"NodeInfo",components:{},props:{seed:Uint8Array},data:function(){return{derivationPath:"m/0'/0/0"}},computed:{bip32node:function(){return o.fromSeed(this.seed)},bip32neutered:function(){return this.bip32node.neutered()},derivedPath:function(){return this.validDerivationPath?this.bip32node.derivePath(this.derivationPath):null},validDerivationPath:function(){try{return this.bip32node.derivePath(this.derivationPath),!0}catch(e){return!1}}},methods:{}},c=n(12),d=Object(c.a)(l,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[e.bip32node?n("div",{staticClass:"column"},[n("b-field",{attrs:{label:"Master Extended Private Key (BIP32 Root)"}},[n("b-input",{attrs:{value:e.bip32node.toBase58(),expanded:""}})],1),e._v(" "),n("b-field",{attrs:{label:"Master Extended Public Key (xpub)"}},[n("b-input",{attrs:{value:e.bip32neutered.toBase58(),expanded:""}})],1),e._v(" "),n("b-field",{attrs:{label:"Seed"}},[n("b-input",{attrs:{value:e.seed.toString("hex"),type:"textarea",expanded:""}})],1),e._v(" "),n("b-field",{attrs:{label:"Network: WIF"}},[n("b-input",{attrs:{value:e.bip32node.network.wif}})],1),e._v(" "),n("b-field",{attrs:{label:"Network: Public"}},[n("b-input",{attrs:{value:e.bip32node.network.bip32.public}})],1),e._v(" "),n("b-field",{attrs:{label:"Network: Private"}},[n("b-input",{attrs:{value:e.bip32node.network.bip32.private}})],1),e._v(" "),n("b-field",{attrs:{label:"Master Extended Key (xpriv)"}},[n("b-input",{attrs:{value:e.bip32node.toBase58(),expanded:""}})],1),e._v(" "),n("b-field",{attrs:{label:"Key Info: (Node Public Key)"}},[n("b-input",{attrs:{value:e.bip32node.publicKey.toString("hex"),expanded:""}})],1),e._v(" "),n("b-field",{attrs:{label:"Key Info: Depth"}},[n("b-input",{attrs:{value:e.bip32node.depth,expanded:""}})],1),e._v(" "),n("b-field",{attrs:{label:"Key Info: Index"}},[n("b-input",{attrs:{value:e.bip32node.index,expanded:""}})],1),e._v(" "),n("b-field",{attrs:{label:"Key Info: Identifier"}},[n("b-input",{attrs:{value:e.bip32node.identifier.toString("hex"),expanded:""}})],1),e._v(" "),e.bip32node.parentFingerprint?n("b-field",{attrs:{label:"Key Info: Parent Fingerprint"}},[n("b-input",{attrs:{value:e.bip32node.parentFingerprint.toString("hex"),expanded:""}})],1):e._e(),e._v(" "),n("b-field",{attrs:{label:"Key Info: Parent Fingerprint"}},[n("b-input",{attrs:{value:e.bip32node.fingerprint.toString("hex"),expanded:""}})],1),e._v(" "),n("b-field",{attrs:{label:"Key Info: (Node Private Key)"}},[n("b-input",{attrs:{value:e.bip32node.privateKey.toString("hex"),expanded:""}})],1)],1):e._e(),e._v(" "),n("div",{staticClass:"column"},[n("b-field",{attrs:{type:e.validDerivationPath?"is-success":"is-warning",message:e.validDerivationPath?"valid path":"invalid path",horizontal:"",label:"Path"}},[n("b-input",{model:{value:e.derivationPath,callback:function(t){e.derivationPath=t},expression:"derivationPath"}})],1),e._v(" "),n("b-field",{attrs:{label:"Derived BIP32 Extended Private Key"}},[n("b-input",{attrs:{value:e.derivedPath&&e.derivedPath.toBase58(),expanded:""}})],1),e._v(" "),n("b-field",{attrs:{label:"Derived BIP32 Extended Public Key"}},[n("b-input",{attrs:{value:e.derivedPath&&e.derivedPath.neutered().toBase58(),expanded:""}})],1)],1)])}),[],!1,null,null,null).exports,h=(n(33),n(81),n(32),n(20),n(58),n(317),n(50));n(73),n(74),n(14);function v(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,n)}return t}function m(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?v(Object(source),!0).forEach((function(t){Object(h.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):v(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var f=function(e){switch(Number(e)){case 12:return new Uint8Array(16);case 18:return new Uint8Array(24);case 24:return new Uint8Array(32)}throw new Error("Invalid word count length specified. Got ".concat(e," but expected 12, 18 or 24"))},y=function(e){var t;return regeneratorRuntime.async((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,regeneratorRuntime.awrap(window.crypto.subtle.importKey("raw",(new TextEncoder).encode(e),{name:"PBKDF2"},!1,["deriveBits","deriveKey"]));case 2:return t=n.sent,n.abrupt("return",t);case 4:case"end":return n.stop()}}))},_={name:"PBKDF2",iterations:1e5,hash:"SHA-256"},w={name:"HMAC",hash:"SHA-256"},S=function(e,t){var n;return regeneratorRuntime.async((function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,regeneratorRuntime.awrap(window.crypto.subtle.deriveKey(m({},_,{salt:t}),e,w,!0,["sign","verify"]));case 2:return n=r.sent,r.abrupt("return",n);case 4:case"end":return r.stop()}}))},E=function(e,t){var n,r,o,l,c,d;return regeneratorRuntime.async((function(h){for(;;)switch(h.prev=h.next){case 0:if(!(e.length<16)){h.next=3;break}return console.log(e),h.abrupt("return",t);case 3:return n=t.length,r=new Uint8Array(t),o=window.crypto.getRandomValues(new Uint8Array(16)),h.next=8,regeneratorRuntime.awrap(y(e));case 8:return l=h.sent,h.next=11,regeneratorRuntime.awrap(S(l,o));case 11:return c=h.sent,h.next=14,regeneratorRuntime.awrap(window.crypto.subtle.sign("HMAC",c,r));case 14:return d=h.sent,h.abrupt("return",new Uint8Array(d,0,n));case 16:case"end":return h.stop()}}))},x=null,k={name:"EntropyInput",components:{},props:{words:String,entropy:Uint8Array},data:function(){return{isGeneratingEntropy:!1,entropyGenerationProgress:0,requiredPoints:256,lastX:0,lastY:0,lastEntropyTick:null,showEntropyArray:!1,pointsGenerated:0,gatheredMouseEntropy:[]}},watch:{words:function(){this.generateRandomEntropy()}},methods:{toggleShowEntropyArray:function(){this.showEntropyArray=!this.showEntropyArray},clearEntropy:function(){this.$emit("clearEntropy"),this.lastEntropyTick=null,this.entropyGenerationProgress=0},generateRandomEntropy:function(){var e=f(Number(this.words)),t=window.crypto.getRandomValues(e);this.$emit("updateEntropy",t)},generateEntropy:function(e){this.isGeneratingEntropy=!this.isGeneratingEntropy;var t=f(Number(this.words)),n=this.entropy||window.crypto.getRandomValues(t);this.pointsGenerated=0,this.$emit("updateEntropy",n),this.isGeneratingEntropy?(this.entropyGenerationProgress=0,window.addEventListener("mousemove",this.addEntropy)):window.removeEventListener("mousemove",this.addEntropy)},addEntropy:function(e){var t=this;this.pointsGenerated>=this.requiredPoints&&(this.isGeneratingEntropy=!1,this.lastEntropyTick=null,window.removeEventListener("mousemove",this.addEntropy));var n,r,o=(new Date).getTime();if(this.lastEntropyTick||(this.lastEntropyTick=o),o-this.lastEntropyTick>50){var l=e.clientX,c=e.clientY;l!==this.lastX&&c!==this.lastY&&(this.lastX=l,this.lastY=c,this.gatheredMouseEntropy.length>=16?(n=function(){var e;return regeneratorRuntime.async((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,regeneratorRuntime.awrap(E(t.gatheredMouseEntropy,t.entropy));case 2:e=n.sent,t.gatheredMouseEntropy=[],t.$emit("updateEntropy",e);case 5:case"end":return n.stop()}}))},r=100,clearTimeout(x),x=setTimeout(n,r)):(this.gatheredMouseEntropy.push(function(e,t){return parseInt(e.toString(2).slice(-4)+t.toString(2).slice(-4),2)^parseInt(window.performance.now().toString(2).slice(-8),2)}(l,c)),this.pointsGenerated+=1,this.lastEntropyTick=o))}}}},M=Object(c.a)(k,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("b-field",{attrs:{label:"Entropy Generation"}},[n("b-field",[n("p",{staticClass:"control"},[n("b-button",{attrs:{size:"is-small",type:"is-info",outlined:""},on:{click:e.generateRandomEntropy}},[e._v("\n          Generate Random\n        ")]),e._v(" "),n("b-button",{attrs:{type:e.isGeneratingEntropy?"is-primary":"is-info",size:"is-small",outlined:""},on:{click:e.generateEntropy}},[e._v("\n          "+e._s(e.isGeneratingEntropy?"Stop Generating":"Generate Manually")+"\n        ")]),e._v(" "),n("b-button",{attrs:{size:"is-small",type:"is-info",outlined:""},on:{click:e.clearEntropy}},[e._v("\n          Reset\n        ")]),e._v(" "),e.entropy?n("b-button",{attrs:{size:"is-small","icon-left":"chevron-down","icon-right":"alert-octagon",type:"is-danger",outlined:""},on:{click:e.toggleShowEntropyArray}},[e._v("\n          Show entropy\n        ")]):e._e()],1)])],1),e._v(" "),n("b-field",[e.isGeneratingEntropy?n("b-progress",{attrs:{"show-value":!0,max:e.requiredPoints,value:e.pointsGenerated,size:"is-small",type:"is-primary"}},[e._v("\n      "+e._s(e.pointsGenerated)+" / "+e._s(e.requiredPoints)+"\n    ")]):e._e()],1),e._v(" "),e.showEntropyArray?n("b-field",[n("b-taglist",{attrs:{attached:""}},[n("b-tag",{attrs:{type:"is-dark"}},[e._v("\n        Entropy from HMAC\n      ")]),e._v(" "),n("b-tag",{attrs:{type:"is-danger"}},[e._v("\n        "+e._s(e.entropy)+"\n      ")])],1)],1):e._e(),e._v(" "),e.showEntropyArray?n("b-field",[n("b-taglist",{attrs:{attached:""}},[n("b-tag",{attrs:{type:"is-dark"}},[e._v("\n        Mouse Movement Entropy\n      ")]),e._v(" "),n("b-tag",{attrs:{type:"is-danger"}},[e._v("\n        "+e._s(e.gatheredMouseEntropy)+"\n      ")])],1)],1):e._e()],1)}),[],!1,null,null,null).exports,P=(n(112),n(57),n(318)),G=function(e){return e.split(" ").map((function(e){return e.substr(0,4)})).join(" ")},C=function(e,t){return t.split(" ").map((function(t){return function(e,t){var n="[invalid-short-word]",r=!0,o=!1,l=void 0;try{for(var c,d=P.wordlists[e][Symbol.iterator]();!(r=(c=d.next()).done);r=!0){var h=c.value;if(h.startsWith(t)){n=h;break}}}catch(e){o=!0,l=e}finally{try{r||null==d.return||d.return()}finally{if(o)throw l}}return n}(e,t)})).join(" ")},O=function(e){return P.validateMnemonic(e)},A=n(328),I=function(e){return e.toString().split(" ").slice(0,3).join(" ")},T=function(e){return A.validateMnemonic(e)},R={name:"Generator",components:{NodeInfo:d,EntropyInput:M},data:function(){return{shortenMnemonic:!1,language:"english",words:"12",mnemonic:null,shortMnemonic:null,recoveredSecret:null,allShares:null,passphrase:"",masterThreshold:1,thresholds:[3],shareGroups:[5],showEntropyInput:!1,entropy:null}},computed:{validMnemonic:function(){if(this.mnemonic&&this.shortMnemonic){if(this.shortenMnemonic){var e=C(this.language,this.shortMnemonic);return O(e)}return O(this.mnemonic)}return!1},displayedMnemonic:{get:function(){return this.shortenMnemonic?this.shortMnemonic:this.mnemonic},set:function(e){this.shortenMnemonic?(this.shortMnemonic=e,this.mnemonic=C(this.language,e)):(this.mnemonic=e,this.shortMnemonic=G(e))}},seed:function(){return e=this.mnemonic,P.mnemonicToSeedSync(e);var e}},methods:{updateEntropy:function(e){this.entropy=e,this.entropy&&this.generateMnemonic()},clearEntropy:function(){this.entropy=null,this.clearMnemonic()},clearMnemonic:function(){this.mnemonic&&(this.mnemonic=null),this.shortMnemonic&&(this.shortMnemonic=null)},addGroup:function(){this.thresholds.length<6&&(this.thresholds.push(3),this.shareGroups.push(5))},removeGroup:function(e){this.thresholds.length>1&&(this.thresholds.splice(e,1),this.shareGroups.splice(e,1))},generateShares:function(){var e,t=this,n=this.thresholds.map((function(e,i){return[e,t.shareGroups[i]]})),r=this.passphrase,o=function(e){for(var t=[],i=0;i<e.length;i+=2)t.push(parseInt(e.substr(i,2),16));return t}((e=this.mnemonic,P.mnemonicToEntropy(e)));this.allShares=function(e,t,n,r){var o=A.fromArray(e,{passphrase:t,threshold:n,groups:r});return r.map((function(e,i){return{index:i,threshold:e[0],shares:e[1],groupName:I(o.fromPath("r/"+i+"/0").mnemonics),mnemonicShares:o.fromPath("r/"+i).mnemonics}}))}(o,r,this.masterThreshold,n)},generateMnemonic:function(){var e,t;this.entropy?this.mnemonic=(e=this.language,t=this.entropy,P.setDefaultWordlist(e),P.entropyToMnemonic(t)):this.mnemonic=function(e,t){P.setDefaultWordlist(e);var n=Math.floor(10.66666666666*parseInt(t))+1;return P.generateMnemonic(n)}(this.language,Number(this.words)),this.shortMnemonic=G(this.mnemonic)},wordCount:function(e){return e.split(" ").length},copyToClipboard:function(e){var t,n;t=e,(n=document.getElementById(t)).select(),n.setSelectionRange(0,99999),document.execCommand("copy");var o=e.split("-"),l=Object(r.a)(o,3),c=(l[0],l[1]),d=l[2];this.$buefy.snackbar.open("Copied share ".concat(d," from group ").concat(c))}}},j=Object(c.a)(R,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("h6",{staticClass:"subtitle"},[e._v("\n    1. Phrase\n  ")]),e._v(" "),n("b-field",{attrs:{grouped:""}},[n("b-field",{attrs:{"label-position":"on-border",label:"Language"}},[n("b-select",{model:{value:e.language,callback:function(t){e.language=t},expression:"language"}},[n("option",{attrs:{title:"English",value:"english"}},[e._v("\n          English\n        ")]),e._v(" "),n("option",{attrs:{title:"French",value:"french"}},[e._v("\n          Français\n        ")]),e._v(" "),n("option",{attrs:{title:"Spanish",value:"spanish"}},[e._v("\n          Spanish\n        ")]),e._v(" "),n("option",{attrs:{title:"Italian",value:"italian"}},[e._v("\n          Italian\n        ")]),e._v(" "),n("option",{attrs:{title:"Japanese",value:"japanese"}},[e._v("\n          Japanese\n        ")]),e._v(" "),n("option",{attrs:{title:"Korean",value:"korean"}},[e._v("\n          Korean\n        ")]),e._v(" "),n("option",{attrs:{title:"Chinese Simplified",value:"chinese_simplified"}},[e._v("\n          Chinese (Simplified)\n        ")]),e._v(" "),n("option",{attrs:{title:"Chinese Traditional",value:"chinese_traditional"}},[e._v("\n          Chinese (Traditional)\n        ")])])],1),e._v(" "),n("b-field",{attrs:{"label-position":"on-border",label:"Words"}},[n("b-select",{model:{value:e.words,callback:function(t){e.words=t},expression:"words"}},[n("option",{attrs:{title:"24",value:"24"}},[e._v("\n          24\n        ")]),e._v(" "),n("option",{attrs:{title:"12",value:"12"}},[e._v("\n          12\n        ")])]),e._v(" "),n("b-field"),e._v(" "),n("b-field",[n("b-button",{attrs:{type:"is-primary",outlined:""},on:{click:e.generateMnemonic}},[e._v("\n          Generate\n        ")]),e._v(" "),n("b-field",[n("b-button",{attrs:{type:"is-text","icon-left":"chevron-down","aria-controls":"advancedEntropyGeneration"},on:{click:function(t){e.showEntropyInput=!e.showEntropyInput}}},[e._v("\n            Advanced\n          ")])],1)],1)],1)],1),e._v(" "),n("b-field",[n("b-collapse",{attrs:{open:e.showEntropyInput,"aria-id":"advancedEntropyGeneration"}},[n("div",[n("EntropyInput",{attrs:{words:e.words,entropy:e.entropy},on:{updateEntropy:e.updateEntropy,clearEntropy:e.clearEntropy}})],1)])],1),e._v(" "),n("b-tabs",{staticClass:"spacer-top-md",attrs:{size:"is-small",expanded:""}},[n("b-tab-item",[n("template",{slot:"header"},[n("b-icon",{attrs:{icon:"circle-edit-outline"}}),e._v(" "),n("span",[e._v(" Phrase "),n("b-tag",{attrs:{rounded:""}},[e._v(" BIP 39 ")])],1)],1),e._v(" "),n("b-field",{attrs:{type:e.mnemonic?e.validMnemonic?"is-success":"is-danger":"",message:e.mnemonic?e.validMnemonic?"valid ("+e.displayedMnemonic.length+")":"invalid ("+e.displayedMnemonic.length+")":""}},[n("b-input",{attrs:{type:"textarea",expanded:""},model:{value:e.displayedMnemonic,callback:function(t){e.displayedMnemonic=t},expression:"displayedMnemonic"}})],1),e._v(" "),n("b-field",{attrs:{position:"is-right"}},[n("b-switch",{attrs:{rounded:!1,outlined:!1,size:"is-small",type:"is-primary"},model:{value:e.shortenMnemonic,callback:function(t){e.shortenMnemonic=t},expression:"shortenMnemonic"}},[e._v("\n          Shorten\n        ")])],1)],2),e._v(" "),n("b-tab-item",[n("template",{slot:"header"},[n("b-icon",{attrs:{icon:"call-split"}}),e._v(" "),n("span",[e._v(" Derivation "),n("b-tag",{attrs:{rounded:""}},[e._v(" BIP 32 ")])],1)],1),e._v(" "),n("NodeInfo",{attrs:{seed:e.seed}})],2)],1),e._v(" "),e.mnemonic?[n("h6",{staticClass:"subtitle"},[e._v("\n      2. Configure\n    ")]),e._v(" "),n("b-field",{attrs:{grouped:""}},[n("table",{staticClass:"table is-narrow"},[n("thead",[n("th",[e._v("#")]),e._v(" "),n("th",[e._v("Threshold")]),e._v(" "),n("th",[e._v("Shares")]),e._v(" "),n("th")]),e._v(" "),n("tbody",e._l(e.thresholds,(function(t,r){return n("tr",{key:r},[n("td",[e._v(e._s(r+1))]),e._v(" "),n("td",[n("b-numberinput",{attrs:{max:e.shareGroups[r],type:"is-info","controls-position":"compact",size:"is-small",min:"1"},model:{value:e.thresholds[r],callback:function(t){e.$set(e.thresholds,r,t)},expression:"thresholds[index]"}})],1),e._v(" "),n("td",[n("b-numberinput",{attrs:{min:e.thresholds[r],max:6,"controls-position":"compact",size:"is-small",type:"is-info"},model:{value:e.shareGroups[r],callback:function(t){e.$set(e.shareGroups,r,t)},expression:"shareGroups[index]"}})],1),e._v(" "),e.shareGroups.length>1?n("td",[n("b-button",{attrs:{"icon-left":"delete",type:"is-text"},on:{click:function(t){return e.removeGroup(r)}}})],1):e._e()])})),0)])]),e._v(" "),n("b-field",[n("b-button",{attrs:{"icon-left":"plus",type:"is-text"},on:{click:e.addGroup}},[e._v("\n        Add Share Group\n      ")])],1),e._v(" "),n("b-field",{staticClass:"spacer-top-lg"},[n("b-button",{attrs:{size:"is-medium",type:"is-primary is-outlined"},on:{click:e.generateShares}},[e._v("\n        Split\n      ")])],1)]:e._e(),e._v(" "),e.allShares?[n("h6",{staticClass:"subtitle spacer-top-lg"},[e._v("\n      3. Share Groups\n    ")]),e._v(" "),n("b-tabs",{staticClass:"spacer-top=lg"},e._l(e.allShares,(function(t,r){return n("b-tab-item",{key:r},[n("template",{slot:"header"},[n("span",[n("b-tag",{attrs:{rounded:""}},[e._v(e._s(r+1)+". "+e._s(t.groupName)+" ["+e._s(t.threshold)+"/"+e._s(t.shares)+"] ")])],1)]),e._v(" "),n("div",{staticClass:"table-container"},[n("table",{staticClass:"table is-fullwidth is-striped is-bordered"},[n("thead",[n("th",[e._v("Group "+e._s(r+1))]),e._v(" "),n("th",[e._v("Share")]),e._v(" "),n("th")]),e._v(" "),n("tbody",e._l(t.mnemonicShares,(function(t,o){return n("tr",{key:t},[n("td",[n("b-taglist",{attrs:{attached:""}},[n("b-tag",{attrs:{type:"is-info"}},[e._v("\n                      Share "+e._s(o+1)+"\n                    ")]),e._v(" "),n("b-tag",{attrs:{type:"is-dark"}},[e._v("\n                      "+e._s(e.wordCount(t))+"\n                    ")])],1)],1),e._v(" "),n("td",[n("b-input",{attrs:{id:"sharetext-"+r+"-"+o,value:t,type:"textarea",readonly:"",expanded:""}})],1),e._v(" "),n("td",[n("b-button",{attrs:{"icon-left":"content-copy",type:"is-text","area-label":"copy-share"},on:{click:function(t){return e.copyToClipboard("sharetext-"+r+"-"+o)}}})],1)])})),0)])])],2)})),1)]:e._e(),e._v(" "),e.recoveredSecret?n("div",{staticClass:"column has-text-left"},[n("b-message",{attrs:{type:e.recoveredSecret===e.mnemonic||e.recoveredSecret===e.displayedMnemonic?"is-success":"is-danger",title:"Recovered Seed Phrase"}},[e._v("\n      "+e._s(e.recoveredSecret)+"\n    ")])],1):e._e()],2)}),[],!1,null,null,null).exports,K={name:"OnlineCheck",components:{},data:function(){return{isOnline:!0}},computed:{},created:function(){this.checkOnlineStatus(),window.addEventListener("online",this.checkOnlineStatus),window.addEventListener("offline",this.checkOnlineStatus)},destroyed:function(){window.addEventListener("online",this.checkOnlineStatus),window.addEventListener("offline",this.checkOnlineStatus)},methods:{checkOnlineStatus:function(){this.isOnline=navigator.onLine}}},N=Object(c.a)(K,(function(){var e=this.$createElement,t=this._self._c||e;return this.isOnline?t("b-message",{attrs:{size:"is-small",type:"is-danger","has-icon":""}},[this._v("\n  You are currently "),t("em",[this._v("online")]),this._v(". This tool should only be used when you're offline\n")]):this._e()}),[],!1,null,null,null).exports,D=(n(77),n(78),{name:"Restore",components:{},data:function(){return{shares:[],newShare:"",passphrase:"",showAddNewShare:!0,recoveredSecret:"Add shares to recover secret",recoveredSecretType:"is-info"}},computed:{validNewMnemonic:function(){return T(this.newShare.trim())}},methods:{focusAddShareInput:function(){this.$refs.addinput&&this.$refs.addinput.focus()},addShare:function(){var e=this.newShare.trim(),t=T(e);!this.shares.includes(e)&&t&&(this.shares.push(this.newShare.trim()),this.restore()),this.newShare="",this.error="",this.focusAddShareInput()},removeShare:function(e){this.shares.splice(e,1),this.restore()},simplifyMnemonic:function(e){var t=e.split(" "),n=t.slice(0,8),r=t.slice(-8);return n.concat(["...","...","...","...","..."]).concat(r).join(" ")},restore:function(){try{this.recoveredSecret="";var e=this.shares.map((function(e){return e.trim()})),t=(r=e,o=this.passphrase,A.recoverSecret(r.map((function(e){return e.trim()})),o));this.recoveredSecret=(n=new Uint8Array(t),P.entropyToMnemonic(n)),this.recoveredSecretType="is-success",this.showAddNewShare=!1}catch(e){e.message.startsWith("Wrong number of mnemonics")?(this.recoveredSecret='Please continue adding shares from the group starting with "'.concat(I(this.shares[0]),'" to restore the recovery phrase'),this.recoveredSecretType="is-info",this.showAddNewShare=!0):(this.recoveredSecret=e,this.recoveredSecretType="is-danger",this.showAddNewShare=!0)}var n,r,o}}}),$={name:"Generate",components:{Generator:j,OnlineCheck:N,Restore:Object(c.a)(D,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("b-field",{attrs:{type:e.recoveredSecretType,label:"Recovered Phrase"}},[n("b-input",{attrs:{type:"textarea",expanded:"",readonly:""},model:{value:e.recoveredSecret,callback:function(t){e.recoveredSecret=t},expression:"recoveredSecret"}})],1),e._v(" "),e.showAddNewShare?n("b-field",{attrs:{type:e.validNewMnemonic?"is-success":"is-danger",label:"Add share"}},[n("b-input",{ref:"addinput",attrs:{type:"textarea",expanded:""},on:{enter:e.addShare},model:{value:e.newShare,callback:function(t){e.newShare=t},expression:"newShare"}})],1):e._e(),e._v(" "),e.showAddNewShare?n("b-field",[n("b-button",{attrs:{disabled:!e.validNewMnemonic,type:"is-success"},on:{click:e.addShare}},[e._v("\n      Add\n    ")])],1):e._e(),e._v(" "),e.shares.length?n("div",[n("table",{staticClass:"spacer-top-lg table is-striped is-fullwidth is-bordered"},[e._m(0),e._v(" "),e._l(e.shares,(function(t,r){return n("tbody",{key:r},[n("tr",[n("td",[e._v(e._s(r+1))]),e._v(" "),n("td",[e._v(e._s(e.simplifyMnemonic(t)))]),e._v(" "),n("td",[n("a",{on:{click:function(t){return e.removeShare(r)}}},[n("b-icon",{attrs:{icon:"delete",size:"is-small"}})],1)])])])}))],2)]):e._e()],1)}),[function(){var e=this.$createElement,t=this._self._c||e;return t("thead",[t("tr",[t("th",[this._v("#")]),this._v(" "),t("th",[this._v("share")]),this._v(" "),t("th",[this._v("actions")])])])}],!1,null,null,null).exports},methods:{restoreSelected:function(e){1===e&&this.$refs.restore.focusAddShareInput()}}},B=Object(c.a)($,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("section",{staticClass:"section"},[n("h1",{staticClass:"page-heading"},[e._v("\n    Generate or Restore\n  ")]),e._v(" "),n("h3",{staticClass:"page-subtitle spacer"},[e._v("\n    Easily split or restore your seed recovery phrase\n  ")]),e._v(" "),n("OnlineCheck"),e._v(" "),n("div",{staticClass:"card"},[n("div",{staticClass:"card-content"},[n("b-tabs",{attrs:{position:"is-left",expanded:""},on:{input:e.restoreSelected}},[n("b-tab-item",{staticClass:"spacer-top-md",attrs:{icon:"pencil",label:"Generate"}},[n("keep-alive",[n("Generator")],1)],1),e._v(" "),n("b-tab-item",{attrs:{icon:"backup-restore",label:"Restore"}},[n("keep-alive",[n("Restore",{ref:"restore"})],1)],1)],1)],1)]),e._v(" "),n("div",{staticClass:"is-mobile"})],1)}),[],!1,null,null,null);t.default=B.exports}}]);