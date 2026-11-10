const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const html=fs.readFileSync('index-cmdk.html','utf8'),backup=fs.readFileSync('index-gemini-diagnostics-backup.html','utf8');
for(const [,js] of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))new vm.Script(js);
const recovered=html.replace(fs.readFileSync('gemini-diagnostics.js','utf8')+'\n','').replace('window.keanGeminiFetch(endpoint, {','fetch(endpoint, {').replace("await window.keanGeminiFetch('https://generativelanguage.googleapis.com","await fetch('https://generativelanguage.googleapis.com");
assert.equal(recovered,backup);
console.log('PASS: JavaScript parses; only diagnostics changed; requests, coursework and CSS unchanged.');
