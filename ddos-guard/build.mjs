import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8'),dir='ddos-guard/';
let h=read('index-cmdk.html');
const panel=read(dir+'panel.html'),metrics=JSON.parse(read(dir+'results/metrics.json'));
const safe=x=>JSON.stringify(x).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');
const bundle='<!-- DDOS BUNDLE START -->\n<style id="ddos-style">'+read(dir+'style.css')+'</style>\n<script type="application/json" id="ddos-results">'+safe(metrics)+'</script>\n<script id="ddos-controller">'+read(dir+'controller.js')+'</script>\n<!-- DDOS BUNDLE END -->';
if(h.includes('<!-- PHISHGUARD PANEL START -->')){
 h=h.replace(/<!-- PHISHGUARD PANEL START -->[\s\S]*?<!-- PHISHGUARD PANEL END -->/,'<!-- DDOS PANEL START -->'+panel+'<!-- DDOS PANEL END -->');
 h=h.replace(/<!-- PHISHGUARD BUNDLE START -->[\s\S]*?<!-- PHISHGUARD BUNDLE END -->/,bundle);
 h=h.replace('<span class="wb-tab-name">PhishGuard AI</span>','<span class="wb-tab-name">DDoS Guard AI</span>');
}else{
 h=h.replace(/<!-- DDOS PANEL START -->[\s\S]*?<!-- DDOS PANEL END -->/,'<!-- DDOS PANEL START -->'+panel+'<!-- DDOS PANEL END -->');
 h=h.replace(/<!-- DDOS BUNDLE START -->[\s\S]*?<!-- DDOS BUNDLE END -->/,bundle);
}
fs.writeFileSync('index-cmdk.html',h);
console.log('DDoS panel, model and measured results exported.');
