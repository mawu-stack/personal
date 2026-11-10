import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {parse} from './.html-audit/node_modules/parse5/dist/index.js';
const h=fs.readFileSync('index-cmdk.html','utf8'),b=fs.readFileSync('index-a4-backup.html','utf8');
const errors=[],ids=new Set(),panels={};let mains=0;
function walk(n){if(n.tagName==='main')mains++;for(const a of n.attrs||[])if(a.name==='id'){assert(!ids.has(a.value),'Duplicate '+a.value);ids.add(a.value);if(['panel-tab-5','panel-tab-6'].includes(a.value)){const l=n.sourceCodeLocation;panels[a.value]=h.slice(l.startOffset,l.endOffset);}}for(const c of n.childNodes||[])walk(c);}
walk(parse(h,{sourceCodeLocationInfo:true,onParseError:e=>errors.push(e)}));assert.equal(errors.length,0);assert.equal(mains,1);
function original(id){let value;function walk(n){if(n.attrs?.some(a=>a.name==='id'&&a.value===id)){const l=n.sourceCodeLocation;value=b.slice(l.startOffset,l.endOffset);}for(const c of n.childNodes||[])walk(c);}walk(parse(b,{sourceCodeLocationInfo:true}));return value;}
for(const id of Object.keys(panels))assert.equal(panels[id],original(id),id+' changed');
for(const match of h.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){if(/type=["']application\/json/.test(match[1]))continue;new vm.Script(match[2]);}
for(const [,css] of h.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)){let depth=0;for(const c of css.replace(/\/\*[\s\S]*?\*\//g,'').replace(/"[^"\n]*"|'[^'\n]*'/g,'')){if(c==='{')depth++;if(c==='}')depth--;assert(depth>=0);}assert.equal(depth,0);}
for(const id of ['tab-btn-8','panel-tab-8','a4-part1','a4-part2','a4-part3','a4-evidence'])assert(ids.has(id));
let reconstructed=b;
for(const phase of [1,2,3]){const f='a4-v2-phase'+phase+'-changes.json';if(fs.existsSync(f))for(const {before,after} of JSON.parse(fs.readFileSync(f))){assert.equal(reconstructed.split(before).length,2);reconstructed=reconstructed.replace(before,after);}}
assert.equal(reconstructed,h,'Undeclared changes');
console.log('PASS: declared edits only, Tab 5/6 byte-identical, HTML5/IDs/main clean, JS syntax valid, CSS braces balanced, Tab 8 and all sections registered.');
