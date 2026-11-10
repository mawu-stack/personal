const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const html=fs.readFileSync('index-cmdk.html','utf8');
const search=fs.readFileSync('kean-live-search.js','utf8');
const concepts=html.slice(html.indexOf('      const SECURITY_CONCEPTS = {'),html.indexOf('      function updateVoiceStatusPill('));
const router=html.slice(html.indexOf('      window.routeCommand = function'),html.indexOf('      function voiceDiagnostic('));
const grounded={candidates:[{content:{parts:[{text:'A verified current answer.'}]},groundingMetadata:{webSearchQueries:['test current question'],groundingChunks:[{web:{uri:'https://example.com/source',title:'Source'}}],searchEntryPoint:{renderedContent:'<div>Search suggestions</div>'}}}]};
function fixture(){
 const requests=[],spoken=[],logs=[],renders=[],timers=new Map(),events={};let next=0;
 const c={AbortController,URL,JSON,clearTimeout:id=>timers.delete(id),setTimeout:fn=>{timers.set(++next,fn);return next;},
 currentSessionToken:'test-session',SecurityState:{aiApiKey:'TEST_ONLY_NOT_A_REAL_KEY',aiProvider:'gemini',logEvent:(...args)=>logs.push(args)},
 speakSentryResponse:text=>spoken.push(text),switchTab:()=>{},PresentationMode:{handleCommand:()=>false},
 keanCommandRegistry:{resolve:cmd=>['check entropy','check ttc','generate passphrase','turn off the waf','run sql injection'].includes(cmd)?{run:say=>say('Local result')}:null},
 document:{addEventListener:(name,fn)=>events[name]=fn,dispatchEvent(){},getElementById:()=>null,querySelectorAll:()=>[]},CustomEvent:class{},
 fetch:async(url,options)=>{requests.push({url,options});return {ok:true,status:200,json:async()=>grounded};}};
 c.window=c;vm.createContext(c);vm.runInContext(search+concepts+router,c);c.showKeanSearchResult=(...args)=>renders.push(args);
 return {c,requests,spoken,logs,renders,timers,events};
}
(async()=>{
 const results=[];const check=async(name,fn)=>{await fn();results.push({check:name,result:'PASS'});};
 await check('Gemini REST grounding structure matches current official docs',async()=>{
  const f=fixture();await f.c.routeCommand('Who won the latest tournament?');assert.equal(f.requests.length,1);
  const {url,options}=f.requests[0],body=JSON.parse(options.body);
  assert.equal(url,'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent');
  assert.deepEqual(body.tools,[{google_search:{}}]);assert.equal(options.headers['x-goog-api-key'],'TEST_ONLY_NOT_A_REAL_KEY');
  assert(!url.includes('key='));assert(!options.body.includes('TEST_ONLY_NOT_A_REAL_KEY'));
  assert.equal(body.contents[0].role,'user');assert(f.spoken.at(-1).startsWith('Based on a live search: '));
  assert(f.logs.some(entry=>entry[0]==='WEB SEARCH'&&entry[2]==='success'));assert.equal(f.renders.at(-1)[1][0].uri,'https://example.com/source');
 });
 await check('Local navigation, concepts, app-state and action commands never fetch',async()=>{
  const f=fixture();for(const cmd of ['open authguard','open tab 5','explain entropy','what is STRIDE','check entropy','check ttc','generate passphrase','turn off the waf','run sql injection','course goals'])await f.c.routeCommand(cmd);
  assert.equal(f.requests.length,0);
 });
 await check('Current questions reach fallback rather than substring navigation',async()=>{
  const f=fixture();await f.c.routeCommand('What did OpenAI announce today?');await f.c.routeCommand('What are the latest SQL injection vulnerabilities?');assert.equal(f.requests.length,2);
 });
 await check('No-key and unsupported-provider responses are explicit and make no request',async()=>{
  const f=fixture();f.c.SecurityState.aiApiKey=null;await f.c.routeCommand('What is the weather today?');assert(f.spoken.at(-1).includes('No live search was performed'));
  f.c.SecurityState.aiProvider='other';await f.c.routeCommand('Who won yesterday?');assert.equal(f.spoken.at(-1),"Web search isn't available for the connected AI provider");assert.equal(f.requests.length,0);
 });
 await check('Ungrounded/empty responses never claim live search or invent an answer',async()=>{
  const f=fixture();f.c.fetch=async()=>({ok:true,json:async()=>({candidates:[{content:{parts:[{text:'UNVERIFIED ANSWER'}]}}]})});
  await f.c.routeCommand('Who won yesterday?');assert(f.spoken.at(-1).includes('did not return a verifiable'));assert(!f.spoken.some(text=>text.includes('UNVERIFIED ANSWER')));
 });
 await check('Unsafe source URLs are rejected',async()=>{
  const f=fixture(),data=structuredClone(grounded);data.candidates[0].groundingMetadata.groundingChunks=[{web:{uri:'javascript:alert(1)',title:'Unsafe'}}];
  f.c.fetch=async()=>({ok:true,json:async()=>data});await f.c.routeCommand('Who won yesterday?');assert(f.spoken.at(-1).includes('did not return a verifiable'));
 });
 await check('HTTP and network failures are visible and do not expose the key',async()=>{
  const f=fixture();f.c.fetch=async()=>({ok:false,status:429});await f.c.routeCommand('Who won yesterday?');assert(f.spoken.at(-1).includes('HTTP 429'));
  f.c.fetch=async()=>{throw Error('TEST_ONLY_NOT_A_REAL_KEY');};await f.c.routeCommand('Who won yesterday?');assert(f.spoken.at(-1).includes('could not complete'));assert(!JSON.stringify([f.logs,f.spoken,f.renders]).includes('TEST_ONLY_NOT_A_REAL_KEY'));
 });
 await check('Timeout is reported honestly',async()=>{
  const f=fixture();f.c.fetch=(_url,options)=>new Promise((_resolve,reject)=>options.signal.addEventListener('abort',()=>reject(Error('aborted'))));
  const promise=f.c.routeCommand('Who won yesterday?');[...f.timers.values()][0]();await promise;assert(f.spoken.at(-1).includes('timed out'));
 });
 await check('A newer local command prevents stale remote speech',async()=>{
  const f=fixture();let finish;f.c.fetch=()=>new Promise(resolve=>finish=resolve);const promise=f.c.routeCommand('Who won yesterday?');f.c.routeCommand('open authguard');
  finish({ok:true,json:async()=>grounded});await promise;assert(!f.spoken.some(text=>text.startsWith('Based on a live search:')));
 });
 await check('Disconnect cancels search without introducing persistent key storage',async()=>{
  const f=fixture();let signal;f.c.fetch=(_url,opts)=>{signal=opts.signal;return new Promise(()=>{});};f.c.routeCommand('Who won yesterday?');
  f.c.SecurityState.aiApiKey=null;f.events['kean:activity']({detail:{source:'AI-ENGINE',message:'API Key cleared.'}});assert(signal.aborted);
  assert(!/localStorage|sessionStorage|indexedDB|document\.cookie/.test(search));
 });
 fs.writeFileSync('kean-search-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
})().catch(error=>{console.error(error);process.exitCode=1;});
