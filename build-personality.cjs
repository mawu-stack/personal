const fs=require('fs'),vm=require('vm'),a=require('assert/strict');
const b=fs.readFileSync('index-personality-backup.html','utf8'),layer=fs.readFileSync('kean-personality.html','utf8');
let h=b.replace('text=varyVoiceResponse(text,category);','text=varyVoiceResponse(text,category);\n        text=window.KeanPersonality?.flavor(text) ?? text;');
h=h.replace('</body>',layer+'\n</body>');fs.writeFileSync('index-cmdk.html',h);
for(const [,js] of h.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))new vm.Script(js);
for(const [,css] of h.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)){let n=0;for(const c of css.replace(/\/\*[\s\S]*?\*\//g,'').replace(/"[^"\n]*"|'[^'\n]*'/g,'')){if(c==='{')n++;if(c==='}')n--;a(n>=0);}a.equal(n,0);}
a.equal(h.replace(layer+'\n','').replace('\n        text=window.KeanPersonality?.flavor(text) ?? text;',''),b);
console.log('PASS syntax, CSS braces, exact preservation outside personality layer');
