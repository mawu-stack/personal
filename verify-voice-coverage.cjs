const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),crypto=require('crypto');
const html=fs.readFileSync('index-cmdk.html','utf8'),before=fs.readFileSync('index-presentation-phase2.html','utf8');
const scripts=text=>Array.from(text.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi),m=>({attrs:m[1],code:m[2]}));
const oldScripts=scripts(before),newScripts=scripts(html);
const hook=`        // Both speech and the palette resolve the same exact command entry.
        const commandEntry = window.keanCommandRegistry?.resolve(cmd);
        if (commandEntry) {
          commandEntry.run(speakSentryResponse);
          return;
        }

`;
for(let i=0;i<oldScripts.length;i++){
  new vm.Script(newScripts[i].code);
  if(oldScripts[i].attrs.includes('cmdk-controller'))continue;
  assert.equal(newScripts[i].code.replace(hook,''),oldScripts[i].code,'Protected script changed at '+i);
}
new vm.Script(newScripts.at(-1).code);
const academic=text=>text.slice(text.indexOf('<section id="panel-tab-6"'),text.indexOf('<!-- MIGRATED AI CONNECT MODAL -->'));
assert(academic(html).length>1000);assert.equal(academic(html),academic(before));
let styles=0;
for(const [,css] of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)){
 let depth=0;for(const c of css.replace(/\/\*[\s\S]*?\*\//g,'').replace(/"[^"\n]*"|'[^'\n]*'/g,'')){if(c==='{')depth++;if(c==='}')depth--;assert(depth>=0);}assert.equal(depth,0);styles++;
}
assert.equal(crypto.createHash('sha256').update(fs.readFileSync('index-presentation-backup.html')).digest('hex'),'b4d8fb617c1fa08191ace5d2ef54ec993f228a83f8f9cc5d70320818ae6931ad');
console.log(JSON.stringify({protectedScriptsUnchangedExceptRouterHook:true,academicByteIdentical:true,allJavaScriptParses:true,balancedStyleBlocks:styles,backupUntouched:true},null,2));
