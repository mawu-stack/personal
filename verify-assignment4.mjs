import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {parse} from './.html-audit/node_modules/parse5/dist/index.js';
const h=fs.readFileSync('index-cmdk.html','utf8'),b=fs.readFileSync('index-assignment4-backup.html','utf8');let reconstructed=b;
for(const {before,after} of JSON.parse(fs.readFileSync('assignment4-changes.json'))){assert.equal(reconstructed.split(before).length,2);reconstructed=reconstructed.replace(before,after);}assert.equal(reconstructed,h);
const academic=s=>s.slice(s.indexOf('<section id="panel-tab-6"'),s.indexOf('<!-- MIGRATED AI CONNECT MODAL -->'));assert.equal(academic(h),academic(b));
const errors=[],ids=new Set();let main=0;function walk(n){if(n.tagName==='main')main++;for(const attr of n.attrs||[])if(attr.name==='id'){assert(!ids.has(attr.value),'duplicate '+attr.value);ids.add(attr.value);}if(['main','div','section'].includes(n.tagName)&&n.sourceCodeLocation)assert(n.sourceCodeLocation.endTag,'unclosed '+n.tagName);for(const c of n.childNodes||[])walk(c);}
walk(parse(h,{sourceCodeLocationInfo:true,onParseError:e=>errors.push(e)}));assert.equal(main,1);assert.equal(errors.length,0);
for(const [,js] of h.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))new vm.Script(js);
let styles=0;for(const [,css] of h.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)){let depth=0;for(const c of css.replace(/\/\*[\s\S]*?\*\//g,'').replace(/"[^"\n]*"|'[^'\n]*'/g,'')){if(c==='{')depth++;if(c==='}')depth--;assert(depth>=0);}assert.equal(depth,0);styles++;}
assert.equal((h.match(/new SpeechRec\(/g)||[]).length,(b.match(/new SpeechRec\(/g)||[]).length);
console.log('PASS: declared additions only; byte-identical Tab 5/6; unique IDs; one main; HTML5 parser clean; JS valid; '+styles+' balanced CSS blocks; no new recognizer.');
