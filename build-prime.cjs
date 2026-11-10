const fs=require('fs'),a=require('assert/strict'),vm=require('vm');
const base=fs.readFileSync('index-voice-backup.html','utf8'),layer=fs.readFileSync('kean-prime.html','utf8');
const old='              utter.rate = 1.05;\n              utter.pitch = 1.0;',next='              window.KeanPrime.apply(utter);';
a(base.includes(old));const html=base.replace(old,next).replace('</body>',layer+'\n</body>');
for(const [,js] of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))new vm.Script(js);
for(const [,css] of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)){let n=0;for(const c of css.replace(/\/\*[\s\S]*?\*\//g,'').replace(/"[^"\n]*"|'[^'\n]*'/g,'')){if(c==='{')n++;if(c==='}')n--;a(n>=0);}a.equal(n,0);}
a.equal(html.replace(layer+'\n','').replace(next,old),base);fs.writeFileSync('index-cmdk.html',html);console.log('PASS syntax, CSS balance and exact preservation outside voice layer');
