import fs from 'node:fs';
let js=fs.readFileSync('ddos-guard/controller.js','utf8');js=js.replace("e.preventDefault();if(model.features", "e.preventDefault();$('dg-reasons').replaceChildren();if(model.features");
js=js.replace("$('dg-roc').append(svg,",`for(const [text,x,y]of [['0',30,279],['1',458,279],['1',22,34],['False-positive rate →',170,298],['True-positive rate',42,18]]){const label=document.createElementNS(NS,'text');label.setAttribute('x',x);label.setAttribute('y',y);label.setAttribute('fill','currentColor');label.setAttribute('font-size','13');label.textContent=text;svg.append(label);}line([[0,1],[0,0],[1,0]],'#8496a5');$('dg-roc').append(svg,`);
fs.writeFileSync('ddos-guard/controller.js',js);
let b=fs.readFileSync('build-assignment6.mjs','utf8').replace("metrics.test?'measured':'pending'","metrics.models?'measured':'pending'");fs.writeFileSync('build-assignment6.mjs',b);
fs.writeFileSync('Assignment6-README.md',`# Assignment 6 — DDoS Guard & XSS

Current research: DDoS detection, replacing phishing. Open index-cmdk.html and choose Tab 07 for the DDoS tool or Tab 09 for the XSS lab and research summary. Public lab sign-in: student / StudentDemo!2026. Never use a real password.

Current draft: ddos-guard/submission.md. Reproduction and limitations: ddos-guard/README.md and protocol.md. The old PhishGuard ZIP and source files are historical rollback materials, not the current submission.

No live attack generation, packet capture or paid AI connection is needed for the DDoS tools. Model inference, charts and metrics are embedded in index-cmdk.html and work offline.
`);
fs.writeFileSync('README.md',`# K.E.A.N. Cybersecurity Workbench

Current working site: **index-cmdk.html**. Open it directly, or run node ddos-guard/preview.cjs and visit http://127.0.0.1:3512/index-cmdk.html#tab-7.

Tab 07 is now DDoS Guard AI, replacing PhishGuard and its URL-analysis tools. It contains real offline ML flow inference, decision-path explanations, dataset charts, model evaluation, optional local history and response guidance. Tab 09 retains XSS controls and now uses the DDoS research. Existing Tabs 1–6 and 8 remain intact.

See ddos-guard/README.md for reproduction, actual data provenance and limitations. Assignment draft: ddos-guard/submission.md. Rollback: index-ddos-backup.html. Original index.html is an older preserved version. Old phishing files and backups remain historical archives; do not run their export scripts over the current site.
`);
