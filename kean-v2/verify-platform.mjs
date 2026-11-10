import fs from 'node:fs';import assert from 'node:assert/strict';import vm from 'node:vm';
new vm.Script(fs.readFileSync('kean-v2/platform.js','utf8'));
const data=JSON.parse(fs.readFileSync('ddos-guard/results/metrics.json','utf8'));
for(const [name,m]of Object.entries(data.models)){const [tn,fp,fn,tp]=m.confusion.flat();assert.equal(tn+fp+fn+tp,data.test_rows,name+' rows');assert(Math.abs(tp/(tp+fp)-m.precision)<1e-12);assert(Math.abs(tp/(tp+fn)-m.recall)<1e-12);assert(Math.abs(2*tp/(2*tp+fp+fn)-m.f1)<1e-12);}
const source=fs.readFileSync('kean-v2/platform.js','utf8');assert(!/fetch\(|localStorage|sessionStorage|innerHTML\s*=/.test(source));assert(!/routeCommand\s*=|SecurityState\s*=|authorize\s*=/.test(source));
const files=['platform.js','workbench.js','workbench.css','gateway.js'];console.log('PASS: adapter syntax; no fetch/storage/unsafe HTML or controller replacement; both measured confusion matrices reproduce retained rows/precision/recall/F1.');console.log(JSON.stringify(Object.fromEntries(files.map(f=>[f,fs.statSync('kean-v2/'+f).size])),null,2));
