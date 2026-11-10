const fs=require('fs'),vm=require('vm'),a=require('assert/strict');
const h=fs.readFileSync('index-cmdk.html','utf8'),b=fs.readFileSync('index-gemini-error-fix-backup.html','utf8');
for(const [,js] of h.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))new vm.Script(js);
const ctx={window:{SecurityState:{aiApiKey:'dummy-secret'}}};vm.createContext(ctx);
vm.runInContext(h.slice(h.indexOf('    window.keanGeminiError ='),h.indexOf('    // Temporary request diagnostics.')),ctx);
for(const [status,message,expected] of [[404,'not found','model not found'],[429,'quota','quota exceeded'],[400,'API key not valid','key is invalid'],[403,'API_KEY_HTTP_REFERRER_BLOCKED','referrer restrictions'],[403,'permission denied','permission denied'],[400,'bad tool','configuration'],[503,'unavailable','temporarily unavailable']])a(ctx.window.keanGeminiError(status,JSON.stringify({error:{message}})).includes(expected));
a(!ctx.window.keanGeminiError(400,'dummy-secret').includes('dummy-secret'));
const academic=s=>s.slice(s.indexOf('<section id="panel-tab-6"'),s.indexOf('<!-- MIGRATED AI CONNECT MODAL -->'));
a.equal(academic(h),academic(b));
const styles=s=>[...s.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map(m=>m[1]);a.deepEqual(styles(h),styles(b));
for(const css of styles(h)){let n=0;for(const c of css.replace(/\/\*[\s\S]*?\*\//g,'').replace(/"[^"\n]*"|'[^'\n]*'/g,'')){if(c==='{')n++;if(c==='}')n--;a(n>=0);}a.equal(n,0);}
console.log('PASS: seven error classifications, key redaction, JS syntax, CSS balance and unchanged academic content.');
