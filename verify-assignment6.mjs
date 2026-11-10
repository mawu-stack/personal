import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {parse} from './.html-audit/node_modules/parse5/dist/index.js';
const h=fs.readFileSync('index-cmdk.html','utf8'),b=fs.readFileSync('index-a6-backup.html','utf8');
const errors=[],ids=new Set();let mains=0,scripts=0,styles=0;
function element(source,id){let text;function walk(n){if(n.attrs?.some(a=>a.name==='id'&&a.value===id)){const l=n.sourceCodeLocation;text=source.slice(l.startOffset,l.endOffset);}for(const c of n.childNodes||[])walk(c);}walk(parse(source,{sourceCodeLocationInfo:true}));return text;}
function walk(n){if(n.tagName==='main')mains++;for(const a of n.attrs||[])if(a.name==='id'){assert(!ids.has(a.value),'Duplicate ID '+a.value);ids.add(a.value);}for(const c of n.childNodes||[])walk(c);}
walk(parse(h,{onParseError:e=>errors.push(e)}));assert.equal(mains,1);assert.equal(errors.length,0,JSON.stringify(errors));
for(const [,attrs,code] of h.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){if(/application\/json/.test(attrs)){JSON.parse(code);continue;}new vm.Script(code);scripts++;}
for(const [,css] of h.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)){let depth=0;for(const c of css.replace(/\/\*[\s\S]*?\*\//g,'').replace(/"[^"\n]*"|'[^'\n]*'/g,'')){if(c==='{')depth++;if(c==='}')depth--;assert(depth>=0);}assert.equal(depth,0);styles++;}
for(const id of ['panel-tab-5','panel-tab-6','panel-tab-8','assignment4-controller','a4-auth-controller','a4-chat-controller'])assert.equal(element(h,id),element(b,id),'Preservation failed '+id);
const old=element(b,'panel-tab-3'),updated=element(h,'panel-tab-3');assert.equal(updated,old,'Tab 3 HTML unchanged');
const unsafe='injectionSandboxDisplay.innerHTML = output;';assert(b.includes(unsafe));assert(!h.includes(unsafe));
assert(h.includes('injectionSandboxDisplay.textContent = output;'));assert(h.includes('xssSandbox.innerHTML = payload;'),'Intentional SentrySim exercise preserved');
let reconstructed=b;for(const {before,after} of JSON.parse(fs.readFileSync('assignment6-changes.json'))){assert.equal(reconstructed.split(before).length,2);reconstructed=reconstructed.replace(before,after);}assert.equal(reconstructed,h,'Undeclared changes');
assert(ids.has('tab-btn-9')&&ids.has('panel-tab-9')&&ids.has('a6-results-json'));
console.log(`PASS: HTML5/IDs/main; ${scripts} JS blocks; ${styles} CSS blocks balanced; JSON valid; Tabs 3/5/6/8 and A4 controllers preserved; targeted XSS sink fixed; SentrySim exercise preserved; declared edits reconstruct entire file.`);
