import fs from 'node:fs';import assert from 'node:assert/strict';import vm from 'node:vm';import crypto from 'node:crypto';
const base='kean-v2/',backup=base+'backups/pre-architecture-topology/';
for(const f of ['workbench.html','workbench.css'])assert.equal(fs.readFileSync(base+f,'utf8'),fs.readFileSync(backup+f,'utf8'),f+' untouched');
const before=fs.readFileSync(backup+'platform.js','utf8'),after=fs.readFileSync(base+'platform.js','utf8');assert.equal(after,before.replace('if(arch){const toolbar=arch.querySelector','if(arch&&!arch.dataset.topology){const toolbar=arch.querySelector'),'Only the Lab 05 adapter guard changed in shared module');
const js=fs.readFileSync(base+'architecture.js','utf8');new vm.Script(js);assert(!/fetch\(|localStorage|sessionStorage|innerHTML\s*=|SecurityState\s*=|routeCommand\s*=/.test(js));
const css=fs.readFileSync(base+'architecture.css','utf8').replace(/\/\*[\s\S]*?\*\//g,'');let n=0;for(const c of css){if(c==='{')n++;if(c==='}')n--;assert(n>=0);}assert.equal(n,0,'Architecture CSS balanced');assert(!css.includes('!important'));
const hash=crypto.createHash('sha256').update(fs.readFileSync(base+'vendor/cytoscape.min.js')).digest('hex');assert.equal(hash,'081591ab735b2b6a3b31a3c60f8f3a3e2fee8c92939e0c7820ad1208571b6cd8');assert(fs.readFileSync(base+'vendor/CYTOSCAPE-LICENSE.txt','utf8').includes('Permission is hereby granted'));
console.log('PASS: original workbench HTML/CSS untouched; shared module differs only in Lab 05 guard; adapter JS syntax clean; CSS braces balanced/no important; official local library hash and license verified.');
