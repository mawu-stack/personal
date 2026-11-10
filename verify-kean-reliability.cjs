const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),crypto=require('crypto');
const html=fs.readFileSync('index-cmdk.html','utf8'),backup=fs.readFileSync('index-kean-reliability-backup.html','utf8');
let recovered=html;
for(const {before,after} of JSON.parse(fs.readFileSync('kean-reliability-changes.json','utf8')).reverse()){
 assert.equal(recovered.split(after).length,2);recovered=recovered.replace(after,before);
}
assert.equal(recovered,backup,'Only declared wake/search changes are allowed');
const academic=s=>s.slice(s.indexOf('<section id="panel-tab-6"'),s.indexOf('<!-- MIGRATED AI CONNECT MODAL -->'));
assert(academic(html).length>1000);assert.equal(academic(html),academic(backup));
let styles=0;
for(const [,css] of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)){
 let n=0;for(const c of css.replace(/\/\*[\s\S]*?\*\//g,'').replace(/"[^"\n]*"|'[^'\n]*'/g,'')){if(c==='{')n++;if(c==='}')n--;assert(n>=0);}assert.equal(n,0);styles++;
}
for(const [,script] of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))new vm.Script(script);
const parser=html.slice(html.indexOf('      function parseKeanWake('),html.indexOf('      function setupVoiceRecognition('));
const setup=html.slice(html.indexOf('      function setupVoiceRecognition('),html.indexOf('      // Expose voice test helper'));
function fixture(){
 let time=0,nextTimer=0;const timers=new Map(),spoken=[],commands=[],logs=[];let chimes=0;
 const c={isWakeWordListening:false,isAwaitingVoiceCommand:false,voiceCommandTimeout:null,recognitionInstance:null,wakeWordStatusPill:null,toggleWakeWord:{checked:true},
 setTimeout(fn,ms){const id=++nextTimer;timers.set(id,{fn,at:time+ms});return id;},clearTimeout(id){timers.delete(id);},
 updateVoiceStatusPill(){},voiceDiagnostic(){},playWakeChime(){chimes++;},speakSentryResponse:text=>spoken.push(text),
 speechSynthesis:{speaking:false,cancel(){}},SecurityState:{logEvent:(...args)=>logs.push(args)},routeCommand:cmd=>commands.push(cmd)};
 c.SpeechRecognition=class{constructor(){this.starts=0;this.autoStart=true;}start(){this.starts++;if(this.autoStart)this.onstart?.();}stop(){this.onend?.();}abort(){this.onend?.();}};
 c.window=c;vm.createContext(c);vm.runInContext(parser+setup+'\nsetupVoiceRecognition();',c);
 const rec=c.recognitionInstance;rec.start();
 const result=(text,isFinal)=>Object.assign([{transcript:text}],{isFinal});
 const emit=(items,resultIndex=0)=>rec.onresult({results:items.map(([t,f])=>result(t,f)),resultIndex});
 const advance=ms=>{const end=time+ms;while(true){const item=[...timers].sort((a,b)=>a[1].at-b[1].at)[0];if(!item||item[1].at>end)break;time=item[1].at;timers.delete(item[0]);item[1].fn();}time=end;};
 return {c,rec,emit,advance,spoken,commands,logs,get chimes(){return chimes;}};
}
const results=[];const check=(name,fn)=>{fn();results.push({check:name,result:'PASS'});};
check('Interim results enabled; ten isolated wake words detected without finals',()=>{
 const f=fixture();assert.equal(f.rec.interimResults,true);
 for(let i=0;i<10;i++){f.rec.onspeechstart();for(let j=0;j<5;j++)f.emit([['Kean',false]]);f.advance(1000);}
 assert.equal(f.chimes,10);assert.equal(f.spoken.length,10);assert.equal(f.commands.length,0);
});
check('Interim duplicate wake fragments do not trigger repeated acknowledgments',()=>{
 const f=fixture();f.rec.onspeechstart();f.emit([['Kean',false],['Kean open authguard',false]]);f.emit([['Kean',false],['Kean open authguard',false]]);
 assert.equal(f.chimes,1);assert.equal(f.spoken.length,1);assert.equal(f.commands.length,0);
});
check('Only final commands execute; revised interims and replayed finals are deduplicated',()=>{
 const f=fixture();f.rec.onspeechstart();f.emit([['Kean turn off WAF',false]]);assert.equal(f.commands.length,0);
 f.emit([['Kean turn on WAF',true]]);f.emit([['Kean turn on WAF',true]]);assert.deepEqual(f.commands,['turn on waf']);assert.equal(f.chimes,1);
});
check('All event results examined, including wake word before the final list entry',()=>{
 const f=fixture();f.emit([['Kean open authguard',true],['unrelated noise',true]]);assert.deepEqual(f.commands,['open authguard']);
 f.rec.onspeechstart();f.emit([['Kean open authguard',true],['unrelated noise',true],['Keen open stride',true]],2);assert.deepEqual(f.commands,['open authguard','open stride']);
});
check('Dropped interim wake arms a later final command without repeating the wake',()=>{
 const f=fixture();f.rec.onspeechstart();f.emit([['Cain',false]]);f.rec.onspeechstart();f.emit([['open sentrysim',true]]);assert.deepEqual(f.commands,['open sentrysim']);
});
check('Presentation approvals wait for final recognition',()=>{
 const f=fixture();f.c.PresentationMode={acceptsReply:t=>t==='confirm'};f.emit([['confirm',false]]);assert.equal(f.commands.length,0);f.emit([['confirm',true]]);assert.deepEqual(f.commands,['confirm']);
});
check('Immediate restart plus one watchdog retry after two seconds',()=>{
 const f=fixture();f.rec.autoStart=false;f.rec.onend();assert.equal(f.rec.starts,2);f.advance(1999);assert.equal(f.rec.starts,2);
 f.rec.autoStart=true;f.advance(1);assert.equal(f.rec.starts,3);assert(f.logs.some(entry=>entry[1].includes('retrying once')));f.advance(5000);assert.equal(f.rec.starts,3);
 f.rec.onspeechstart();f.emit([['Kean',false]]);assert.equal(f.chimes,1);
});
check('Failed retry is bounded; manual stop prevents watchdog restarts',()=>{
 const f=fixture();f.rec.autoStart=false;f.rec.onend();f.advance(8000);assert.equal(f.rec.starts,3);assert.equal(f.c.isWakeWordListening,false);
 const g=fixture();g.rec.autoStart=false;g.rec.onend();g.c.toggleWakeWord.checked=false;g.c.isWakeWordListening=false;g.rec.onend();g.advance(5000);assert.equal(g.rec.starts,2);
});
results.push({check:'Protected source, coursework, JavaScript syntax and '+styles+' CSS blocks',result:'PASS'});
fs.writeFileSync('kean-reliability-results.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
