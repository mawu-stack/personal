const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),crypto=require('crypto');
const html=fs.readFileSync('index-cmdk.html','utf8'),before=fs.readFileSync('index-presentation-phase3.html','utf8');
let recovered=html.replace(fs.readFileSync('presentation-mode.html','utf8')+'\n','');
for(const {before:old,after} of JSON.parse(fs.readFileSync('presentation-mode-changes.json','utf8')).reverse()){
 assert.equal(recovered.split(after).length,2,'Unexpected edit overlap');recovered=recovered.replace(after,old);
}
assert.equal(recovered,before,'Changes outside the declared presentation integration');
const academic=s=>s.slice(s.indexOf('<section id="panel-tab-6"'),s.indexOf('<!-- MIGRATED AI CONNECT MODAL -->'));
assert(academic(html).length>1000);assert.equal(academic(html),academic(before));
assert.equal(academic(html),academic(fs.readFileSync('index-presentation-backup.html','utf8')));
let styles=0,scripts=0;
for(const [,css] of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)){
 let depth=0;for(const c of css.replace(/\/\*[\s\S]*?\*\//g,'').replace(/"[^"\n]*"|'[^'\n]*'/g,'')){if(c==='{')depth++;if(c==='}')depth--;assert(depth>=0);}assert.equal(depth,0);styles++;
}
for(const [,script] of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)){new vm.Script(script);scripts++;}
assert.equal(crypto.createHash('sha256').update(fs.readFileSync('index-presentation-backup.html')).digest('hex'),'b4d8fb617c1fa08191ace5d2ef54ec993f228a83f8f9cc5d70320818ae6931ad');
assert.equal(crypto.createHash('sha256').update(fs.readFileSync('index.html')).digest('hex'),'d847abfe7a02a38e8cb930dad466006ca6c9d65f90d043521bd46a68b94bc3c4');
console.log(JSON.stringify({onlyDeclaredPresentationChanges:true,academicByteIdentical:true,balancedStyleBlocks:styles,parsedScripts:scripts,presentationBackupUntouched:true,originalIndexUntouched:true},null,2));
