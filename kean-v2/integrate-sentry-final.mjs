import fs from 'node:fs';
const p='kean-v2/platform.js',s=fs.readFileSync(p,'utf8'),start=s.indexOf('// Enrich the existing five DOM nodes;'),end=s.indexOf('// Existing architecture controls',start);
if(start<0||end<0)throw Error('Sentry adapter boundaries missing');
fs.writeFileSync(p,s.slice(0,start)+`// Lab 02 owns its graph and playback; all other adapters remain unchanged.
if($('tracer-topology-section')){const script=document.createElement('script');script.src='sentry.js';document.body.append(script);}

`+s.slice(end));
const b='kean-v2/build.mjs';fs.writeFileSync(b,fs.readFileSync(b,'utf8').replace("const files=['architecture.css'","const files=['sentry.js','sentry.css','sentry-check.html','architecture.css'"));
