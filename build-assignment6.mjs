import fs from 'node:fs';import assert from 'node:assert/strict';
const path='index-cmdk.html',backup='index-a6-backup.html',dir='phishguard-ai/assignment6/';
if(!fs.existsSync(backup))fs.copyFileSync(path,backup);
let h=fs.readFileSync(path,'utf8');const edits=[];
function edit(before,after){assert.equal(h.split(before).length,2,before.slice(0,100));h=h.replace(before,after);edits.push({before,after});}
if(!h.includes('id="tab-btn-9"')){
 const nav=h.match(/<button[^>]*id="tab-btn-8"[\s\S]*?<\/button>/)[0];
 edit(nav,nav+'\n<button type="button" class="tab-btn" role="tab" id="tab-btn-9" data-tab="tab-9" aria-controls="panel-tab-9"><span class="wb-tab-num">09</span><span><span class="wb-tab-name">Assignment 6 - XSS &amp; Research</span><span class="wb-tab-desc">INPUT SECURITY / HYBRID ML</span></span></button>');
 edit("'tab-7', 'tab-8'];","'tab-7', 'tab-8', 'tab-9'];");
 edit("'#tab-8':'tab-8', '#tab8':'tab-8',","'#tab-9':'tab-9', '#tab9':'tab-9', '#tab-8':'tab-8', '#tab8':'tab-8',");
 edit('/^#tab-?[1-8]$/','/^#tab-?[1-9]$/');
 edit('injectionSandboxDisplay.innerHTML = output;','injectionSandboxDisplay.textContent = output;');
 edit('<section id="panel-tab-8"','<!-- ASSIGNMENT6 PANEL START -->\n'+fs.readFileSync(dir+'panel.html','utf8')+'\n<!-- ASSIGNMENT6 PANEL END -->\n<section id="panel-tab-8"');
}else{
 const old=h.match(/<!-- ASSIGNMENT6 PANEL START -->[\s\S]*?<!-- ASSIGNMENT6 PANEL END -->/)[0];
 edit(old,'<!-- ASSIGNMENT6 PANEL START -->\n'+fs.readFileSync(dir+'panel.html','utf8')+'\n<!-- ASSIGNMENT6 PANEL END -->');
}
const safe=value=>JSON.stringify(value).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');
const metrics=fs.existsSync('ddos-guard/results/metrics.json')?JSON.parse(fs.readFileSync('ddos-guard/results/metrics.json','utf8')):{status:'pending'};
const report=fs.existsSync('ddos-guard/submission.md')?fs.readFileSync('ddos-guard/submission.md','utf8'):null;
const bundle='<!-- ASSIGNMENT6 BUNDLE START -->\n<style id="a6-style">\n'+fs.readFileSync(dir+'style.css','utf8')+'\n</style>\n<script type="application/json" id="a6-results-json">'+safe(metrics)+'</script>\n<script type="application/json" id="a6-report-json">'+safe(report)+'</script>\n<script id="a6-controller">\n'+fs.readFileSync(dir+'controller.js','utf8')+'\n</script>\n<!-- ASSIGNMENT6 BUNDLE END -->';
const previous=h.match(/<!-- ASSIGNMENT6 BUNDLE START -->[\s\S]*?<!-- ASSIGNMENT6 BUNDLE END -->/);
if(previous)edit(previous[0],bundle);else edit('</body>',bundle+'\n</body>');
fs.writeFileSync(path,h);
const log='assignment6-changes.json',oldEdits=fs.existsSync(log)?JSON.parse(fs.readFileSync(log,'utf8')):[];fs.writeFileSync(log,JSON.stringify([...oldEdits,...edits],null,2));
console.log('Assignment 6 exported; results:',metrics.models?'measured':'pending','write-up:',Boolean(report));
