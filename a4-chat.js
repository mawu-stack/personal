(()=>{
 'use strict';
 const $=id=>document.getElementById(id);
 const questions=['What is authentication?','What is authorization?','Tell me about STRIDE and give examples.','How does PBKDF2 protect passwords?','Why should authorization be checked on the server?'];
 let testRunning=false,active=null,conversationId=0;
 function append(role,text){const item=document.createElement('p');const label=document.createElement('strong');label.textContent=role+': ';item.append(label,document.createTextNode(text));$('a4-chat-history').append(item);while($('a4-chat-history').children.length>60)$('a4-chat-history').firstElementChild.remove();}
 function provider(){const s=window.SecurityState;return s?.aiApiKey?(s.aiProvider==='claude'?'Claude':s.aiProvider==='gemini'?'Gemini':String(s.aiProvider)):'Local fallback (no key)';}
 function response(event){if(event.detail.kind==='pending')return;append('K.E.A.N.',event.detail.text);if(active){const done=active;active=null;clearTimeout(done.timer);done.resolve({arrived:true,elapsed:performance.now()-done.start,provider:done.provider,note:/fallback|local/.test(event.detail.kind||'local')?event.detail.text:'',kind:event.detail.kind});}}
 document.addEventListener('kean:answer',response);
 $('a4-question-form').addEventListener('submit',()=>{const q=$('a4-question').value.trim();if(q&&window.Assignment4?.valid())append('You',q);});
 $('a4-question').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();if(!testRunning)$('a4-question-form').requestSubmit();}});
 $('a4-chat-selftest').addEventListener('click',async()=>{
  if(testRunning)return;
  if(!window.Assignment4?.valid()){$('a4-test-status').textContent='Sign in before running the chatbot self-test.';return;}
  testRunning=true;const run=++conversationId;$('a4-chat-selftest').disabled=true;$('a4-question').disabled=true;$('a4-test-rows').replaceChildren();
  try{
   for(let i=0;i<questions.length;i++){
    if(run!==conversationId||!window.Assignment4.valid())break;
    const question=questions[i];$('a4-test-status').textContent='Testing '+(i+1)+' of 5…';
    const result=await new Promise(resolve=>{const job={start:performance.now(),provider:provider(),resolve,timer:null};active=job;job.timer=setTimeout(()=>{if(active===job)active=null;resolve({arrived:false,elapsed:performance.now()-job.start,provider:job.provider,note:'No final response within 7 seconds.'});},7000);window.routeCommand(question);});
    if(run!==conversationId)break;
    const row=document.createElement('tr');for(const value of [question,result.arrived?'Yes':'No',(result.elapsed/1000).toFixed(3)+' s',result.provider,result.note||'None']){const td=document.createElement('td');td.textContent=value;row.append(td);}$('a4-test-rows').append(row);
   }
   if(run===conversationId)$('a4-test-status').textContent='Finished. Responses, timings and fallback/error notes were measured during this run.';
  }finally{testRunning=false;$('a4-chat-selftest').disabled=false;$('a4-question').disabled=false;}
 });
 document.addEventListener('kean:session-end',()=>{conversationId++;if(active){clearTimeout(active.timer);active.resolve({arrived:false,elapsed:performance.now()-active.start,provider:active.provider,note:'Session ended.'});active=null;}$('a4-chat-history').replaceChildren();$('a4-test-status').textContent='Session ended; start a new test after login.';});
})();
