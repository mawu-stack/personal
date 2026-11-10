import fs from 'node:fs';import assert from 'node:assert/strict';
let h=fs.readFileSync('index-cmdk.html','utf8');const edits=[];
function edit(before,after){assert.equal(h.split(before).length,2,before.slice(0,100));h=h.replace(before,after);edits.push({before,after});}
const auth=h.match(/<script id="a4-auth-controller">[\s\S]*?<\/script>/)[0];edit(auth,'');edit('<script id="assignment4-controller">',auth+'\n<script id="assignment4-controller">');
edit('<button type="button" id="a4-content-save"','<button type="button" id="a4-content-save"');
fs.writeFileSync('index-cmdk.html',h);const path='a4-v2-phase3-changes.json';fs.writeFileSync(path,JSON.stringify([...JSON.parse(fs.readFileSync(path)),...edits],null,2));
