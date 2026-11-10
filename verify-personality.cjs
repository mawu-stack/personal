const fs=require('fs'),vm=require('vm'),a=require('assert/strict');
const layer=fs.readFileSync('kean-personality.html','utf8'),script=layer.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1];
const elements={'kean-personality-select':{},'kean-personality-feedback':{}},ctx={window:{},document:{readyState:'loading',addEventListener(){},getElementById:id=>elements[id],body:{classList:{remove(){}}}},clearTimeout(){},Math};
vm.createContext(ctx);vm.runInContext(script,ctx);const p=ctx.window.KeanPersonality;
a.equal(p.mode,'professional');const fact='CVSS 3.1: 7.5. STRIDE: Spoofing. Entropy: 65 bits. TTC: 312 years.';a.equal(p.flavor(fact),fact);p.setMode('hype');
for(let i=0;i<30;i++){a(p.flavor(fact).endsWith(fact));a(p.flavor('Attack BLOCKED: WAF').endsWith('Attack BLOCKED: WAF'));a.equal(p.flavor('Your session has expired.'),'Your session has expired.');}
p.setMode('professional');a.equal(p.flavor(fact),fact);console.log('PASS professional default, mode transitions, technical text identity and session exclusion');
