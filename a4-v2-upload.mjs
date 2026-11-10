import fs from 'node:fs';import assert from 'node:assert/strict';
let h=fs.readFileSync('index-cmdk.html','utf8');const edits=[];
function edit(before,after){assert.equal(h.split(before).length,2,before.slice(0,100));h=h.replace(before,after);edits.push({before,after});}
edit('<main class="container">','<main class="container"><aside id="a4-announcement-banner" class="a4-card" aria-label="Demo announcement" hidden></aside>');
edit("$('a4-content-preview').textContent=$('a4-content-text').value.slice(0,180);", "$('a4-content-preview').textContent=$('a4-content-text').value.slice(0,180);$('a4-announcement-banner').textContent=$('a4-content-preview').textContent;$('a4-announcement-banner').hidden=!$('a4-announcement-banner').textContent.trim();");
edit('This changes only the preview below. Website source and graded coursework cannot be edited here.','Edit the in-memory announcement banner. Website source and graded coursework cannot be edited here.');
edit('Update simulated preview','Update announcement');
edit('<p id="a4-photo-status" role="status">No photo selected.</p>', '<p id="a4-photo-status" role="status">No photo selected.</p><label><input type="checkbox" id="a4-photo-consent" style="width:auto"> This is my own photo or I have permission to use it.</label><p>Only the existing local demo is available while the remaining generation-mode instructions are pending. No photo is uploaded to a service.</p>');
edit("$('a4-generate').disabled=false;steps.add(0);", "$('a4-generate').disabled=!$('a4-photo-consent').checked;steps.add(0);");
edit("if(!valid()||!photoURL)return;generated=true;", "if(!valid()||!photoURL||!$('a4-photo-consent').checked)return;generated=true;");
edit("$('a4-clear').addEventListener('click',resetPhoto);", "$('a4-clear').addEventListener('click',()=>{resetPhoto();$('a4-photo-consent').checked=false;});\n    $('a4-photo-consent').addEventListener('change',()=>{$('a4-generate').disabled=!photoURL||!$('a4-photo-consent').checked;if(!$('a4-photo-consent').checked){generated=false;$('a4-talk').disabled=true;$('a4-avatar').classList.remove('generated');steps.delete(1);personProgress();}});");
edit("$('a4-generate').disabled=true;$('a4-talk').disabled=true;personProgress();}", "$('a4-generate').disabled=true;$('a4-talk').disabled=true;$('a4-photo-consent').checked=false;personProgress();}");
edit('Clear photo / reset','Remove photo / reset');
fs.writeFileSync('index-cmdk.html',h);const path='a4-v2-phase3-changes.json';fs.writeFileSync(path,JSON.stringify([...JSON.parse(fs.readFileSync(path)),...edits],null,2));
