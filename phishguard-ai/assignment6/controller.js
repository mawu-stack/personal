(()=>{
 'use strict';
 const $=id=>document.getElementById(id);
 const metrics=()=>{try{return JSON.parse($('a6-results-json').textContent);}catch(_){return null;}};
 function encodeHTMLText(value){return value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
 function renderTo(value,safe,encoded){
   if(typeof value!=='string'||!value.trim()||value.length>2000||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value))return false;
   safe.textContent=value;encoded.textContent=encodeHTMLText(value);return true;
 }
 function render(){const ok=renderTo($('a6-input').value,$('a6-safe-output'),$('a6-encoded-output'));$('a6-input-status').textContent=ok?'Rendered as inert text. No HTML elements were created.':'Enter 1–2,000 characters without unsupported control characters.';if(!ok){$('a6-safe-output').replaceChildren();$('a6-encoded-output').replaceChildren();}}
 function tests(){
   const report=[],safe=document.createElement('pre'),encoded=document.createElement('pre');
   const check=(ok,name)=>{report.push((ok?'PASS ':'FAIL ')+name);};
   for(const sample of ['<img src=x onerror="alert(1)">','<svg onload="alert(1)">','<script>alert(1)<'+ '/script>','<a href="javascript:alert(1)">link</a>','A & B "quoted" \'single\'','Unicode: café 😀\nsecond line']){
     check(renderTo(sample,safe,encoded)&&safe.textContent===sample&&safe.children.length===0&&encoded.textContent===encodeHTMLText(sample),'Text preserved without parsed elements: '+sample.slice(0,45));
   }
   check(!renderTo('x'.repeat(2001),safe,encoded),'Oversized input rejected by application validation');
   check(!renderTo('   ',safe,encoded),'Empty/whitespace input rejected');
   check(!renderTo('x\u0000y',safe,encoded),'Unsupported control character rejected');
   check(encodeHTMLText('<>&"\'')==='&lt;&gt;&amp;&quot;&#39;','HTML text encoding covers special characters');
   const result={passed:report.filter(x=>x.startsWith('PASS')).length,failed:report.filter(x=>x.startsWith('FAIL')).length};
   $('a6-test-output').textContent=report.join('\n')+'\n'+result.passed+' passed; '+result.failed+' failed. Measured in this browser.';
   window.SecurityState?.logEvent('ASSIGNMENT6','XSS text-control tests: '+result.passed+' passed, '+result.failed+' failed.','info');return result;
 }
 const names={lexical_logistic_regression:'Lexical Logistic Regression',lexical_random_forest:'Lexical Random Forest',character_linear:'Character-only linear model',hybrid:'Selected hybrid'};
 const pct=n=>(100*n).toFixed(2)+'%';
 function download(name,content,type){const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 function renderResults(){const r=metrics();if(!r?.models){$('a6-results-status').textContent='DDoS experiment results unavailable.';return;}$('a6-results-status').textContent='Actual offline DDoS experiment. Attack is the positive class; no calibrated confidence claims.';$('a6-data-summary').textContent=r.train_rows.toLocaleString()+' training flows; '+r.test_rows.toLocaleString()+' held-out flows. Dataset: CIC-DDoS2019 Kaggle mirror.';$('a6-split-summary').textContent=r.test_overlap_removed.toLocaleString()+' overlapping test feature patterns removed; all methods evaluated on the same retained records.';$('a6-compute-summary').textContent='Measured experiment runtime: '+r.elapsed_seconds.toFixed(2)+' seconds on this machine. This is not request latency.';for(const [name,m]of Object.entries(r.models)){const row=document.createElement('tr');for(const text of [name,pct(m.precision),pct(m.recall),pct(m.f1),pct(m.fpr)]){const td=document.createElement('td');td.textContent=text;row.append(td);}$('a6-metric-rows').append(row);}}
 function boot(){
   $('a6-render').addEventListener('click',render);
   $('a6-example').addEventListener('click',()=>{$('a6-input').value='<img src=x onerror="alert(\'XSS\')">';render();});
   $('a6-clear').addEventListener('click',()=>{$('a6-input').value='';$('a6-safe-output').replaceChildren();$('a6-encoded-output').replaceChildren();$('a6-input-status').textContent='Cleared. Input is not saved.';});
   $('a6-run-tests').addEventListener('click',tests);
   $('a6-download-results').addEventListener('click',()=>{const r=metrics();if(r?.models)download('assignment6-results.json',JSON.stringify(r,null,2),'application/json');});
   $('a6-download-report').addEventListener('click',()=>{try{const value=JSON.parse($('a6-report-json').textContent);if(!value){$('a6-results-status').textContent='Write-up missing. Run make_deliverables.py and export the tab.';return;}download('assignment6-submission.md',value,'text/markdown;charset=utf-8');}catch(_){$('a6-results-status').textContent='Write-up could not be loaded.';}});
   window.Assignment6={renderTo,encodeHTMLText,runTests:tests};renderResults();
   window.keanCommandRegistry?.register('Open Assignment 6',['open assignment 6','open assignment six','open xss lab','go to assignment 6'],say=>{window.switchTab('tab-9');say('Opened Assignment 6: XSS security and research.');},'Navigate',$('tab-btn-9'));
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
