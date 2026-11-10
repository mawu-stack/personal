const fs=require('fs'),assert=require('assert/strict');
let s=fs.readFileSync('index-gemini-diagnostics-backup.html','utf8');
const anchor='    const aiModal =';assert(s.includes(anchor));
s=s.replace(anchor,fs.readFileSync('gemini-diagnostics.js','utf8')+'\n'+anchor);
assert(s.includes('fetch(endpoint, {'));
s=s.replace('fetch(endpoint, {','window.keanGeminiFetch(endpoint, {');
assert(s.includes("await fetch('https://generativelanguage.googleapis.com"));
s=s.replace("await fetch('https://generativelanguage.googleapis.com","await window.keanGeminiFetch('https://generativelanguage.googleapis.com");
fs.writeFileSync('index-cmdk.html',s);
