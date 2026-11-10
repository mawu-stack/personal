// Rebuild only the redesign workbench from the frozen source and current presentation assets.
import fs from 'node:fs';import{generate}from'./consolidate.mjs';
const result=generate(fs.readFileSync('kean-v2/legacy/index-cmdk.html','utf8'));
fs.writeFileSync('kean-v2/workbench.html',result.html);fs.writeFileSync('kean-v2/legacy-compat.css',result.css);
console.log('PASS: regenerated layered workbench; root originals untouched.');
