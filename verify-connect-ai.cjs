const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const html=fs.readFileSync('index-cmdk.html','utf8'),backup=fs.readFileSync('index-connect-ai-backup.html','utf8');
let recovered=backup;
for(const {before,after} of JSON.parse(fs.readFileSync('connect-ai-changes.json'))){assert.equal(recovered.split(before).length,2);recovered=recovered.replace(before,after);}
assert.equal(recovered,html);
for(const [,js] of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))new vm.Script(js);
let styles=0;for(const [,css] of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)){let n=0;for(const c of css.replace(/\/\*[\s\S]*?\*\//g,'').replace(/"[^"\n]*"|'[^'\n]*'/g,'')){if(c==='{')n++;if(c==='}')n--;assert(n>=0);}assert.equal(n,0);styles++;}
assert.equal((html.match(/<input[^>]*id="ai-api-key-input"/g)||[]).length,1);
assert(!/connect-ai-modal|ai-key-input|ai-provider-select/.test(html));
const els={}; for(const id of ['ai-connect-modal','btn-open-connect-ai','btn-close-ai-modal','btn-save-ai-key','btn-clear-ai-key','ai-api-key-input','connect-ai-label','ai-engine-mode-pill']){
 const classes=new Set();els[id]={value:'',style:{},textContent:'',classList:{add:c=>classes.add(c),remove:c=>classes.delete(c)},listeners:{},addEventListener(e,f){assert(!this.listeners[e]);this.listeners[e]=f;},focus(){}};
}
const state={aiApiKey:null,logEvent(){}},alerts=[];
const ctx={document:{getElementById:id=>els[id]||null},window:{SecurityState:state},alert:s=>alerts.push(s)};
vm.createContext(ctx);vm.runInContext(html.slice(html.indexOf('    const aiModal ='),html.lastIndexOf('    /*',html.indexOf('       6. AUTHGUARD'))),ctx);
const click=id=>els[id].listeners.click({target:els[id]});
click('btn-open-connect-ai');assert.equal(els['ai-connect-modal'].style.display,'flex');
els['ai-api-key-input'].value='  dummy-key  ';click('btn-save-ai-key');assert.equal(state.aiApiKey,'dummy-key');assert.equal(alerts.length,0);assert.equal(els['ai-connect-modal'].style.display,'none');
click('btn-open-connect-ai');assert.equal(els['ai-api-key-input'].value,'dummy-key');click('btn-clear-ai-key');assert.equal(state.aiApiKey,null);
click('btn-open-connect-ai');els['ai-api-key-input'].value='   ';click('btn-save-ai-key');assert.equal(alerts.length,1);assert.equal(state.aiApiKey,null);
console.log('PASS: single input/handlers, open/save/trim/reopen/clear/empty validation, exact unrelated-source preservation, JavaScript syntax, '+styles+' balanced CSS blocks.');
