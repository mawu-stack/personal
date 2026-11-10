import fs from 'node:fs';import assert from 'node:assert/strict';
let h=fs.readFileSync('index-cmdk.html','utf8');const edits=[];
function edit(before,after){assert.equal(h.split(before).length,2);h=h.replace(before,after);edits.push({before,after});}
edit('<p</p>','');
edit("$('a4-question-form').addEventListener('submit',()=>{const q=", "$('a4-question-form').addEventListener('submit',e=>{if(testRunning){e.preventDefault();e.stopImmediatePropagation();return;}const q=");
fs.writeFileSync('index-cmdk.html',h);const path='a4-v2-phase3-changes.json';fs.writeFileSync(path,JSON.stringify([...JSON.parse(fs.readFileSync(path)),...edits],null,2));
