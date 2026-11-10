import {parse} from './.html-audit/node_modules/parse5/dist/index.js';import fs from 'node:fs';import vm from 'node:vm';import a from 'node:assert/strict';
const h=fs.readFileSync('index-cmdk.html','utf8'),b=fs.readFileSync('index-audit-fixes-backup.html','utf8');let replay=b;
for(const {before,after} of JSON.parse(fs.readFileSync('audit-fix-changes.json')))replay=replay.replace(before,after);a.equal(replay,h);
const counts={div:0,main:0};const ids=new Set();function walk(n){if(n.tagName){for(const attr of n.attrs||[])if(attr.name==='id'){a(!ids.has(attr.value),'duplicate '+attr.value);ids.add(attr.value);}if(n.tagName in counts){counts[n.tagName]++;a(n.sourceCodeLocation?.endTag,'implicit '+n.tagName);}}for(const c of n.childNodes||[])walk(c);}
walk(parse(h,{sourceCodeLocationInfo:true}));a.equal(counts.main,1);
for(const [,js] of h.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))new vm.Script(js);
for(const [,css] of h.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)){let n=0;for(const c of css.replace(/\/\*[\s\S]*?\*\//g,'').replace(/"[^"\n]*"|'[^'\n]*'/g,'')){if(c==='{')n++;if(c==='}')n--;a(n>=0);}a.equal(n,0);}
const academic=s=>s.slice(s.indexOf('<section id="panel-tab-6"'),s.indexOf('<!-- MIGRATED AI CONNECT MODAL -->'));a.equal(academic(h),academic(b));
console.log('PASS HTML5 parser: '+counts.div+' divs with explicit closing tags; one main with explicit closing tag; unique IDs; JS syntax; CSS braces; academic text unchanged; only declared targeted edits.');
