const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('C:/Users/nicka/.gemini/antigravity/scratch/tech3498-lab1/index.html','utf8');
let html=source;
function replace(oldText,newText){if(!html.includes(oldText))throw Error('Missing anchor: '+oldText.slice(0,100));html=html.replace(oldText,newText);}
replace('<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>',`<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.waves.min.js"></script>`);
replace('</head>','<style id="unified-redesign">\n'+fs.readFileSync('redesign.css','utf8')+'\n</style>\n</head>');
html=html.replace(/<canvas id="webgl-liquid-bg"[^>]*><\/canvas>/,'<div id="vanta-bg-canvas" aria-hidden="true"></div>');
html=html.replace(/<nav class="nav-menu"[\s\S]*?<\/nav>/,'<a class="wb-home" href="#overview" onclick="switchTab(\'overview\');return false;">Portfolio ↗</a>');
replace('<main class="container">','<main class="container">\n'+fs.readFileSync('redesign-shell.html','utf8'));
replace('<!-- MIGRATED AI CONNECT MODAL -->',`<section id="panel-tab-6" class="tab-panel" data-tab="tab-6" role="tabpanel" aria-labelledby="tab-btn-6"><span id="tab-6"></span>
      <div class="wb-stage saas-card"><div><span class="wb-overline">06 / NEXT IN THE WORKBENCH</span><h2>Secure Architecture</h2><p>The next layer: connect the frontend, server, application, and database through a secure web architecture.</p><small>Assignment 3 is the next build stage. This space is reserved while the visual redesign is reviewed.</small></div><div class="wb-stage-symbol" aria-hidden="true">⌘</div></div>
    </section>
    <!-- MIGRATED AI CONNECT MODAL -->`);
replace('<!-- LARGE VISUAL SECURITY SCORE & DYNAMIC ANALYSIS DASHBOARD -->',`<div id="known-banner" class="tip-box" role="status" style="display:none;border-left-color:#fb7185">Known public example detected. Publicly shared passwords and textbook passphrases are predictable; generate a unique candidate.</div>
        <!-- LARGE VISUAL SECURITY SCORE & DYNAMIC ANALYSIS DASHBOARD -->`);
replace('<div id="audit-receipt-drawer" id-alias="audit-report-drawer" class="audit-drawer"><span id="audit-report-drawer" style="display:none"></span> style="display: none;">','<div id="audit-report-drawer" class="audit-drawer" style="display:none">');
replace('<button type="button" id="btn-download-receipt" class="drawer-btn"><span id="save-report-btn" style="display:none"></span> title="Save .txt receipt to disk">','<button type="button" id="btn-download-receipt" class="drawer-btn" title="Save .txt receipt to disk">');
replace('var copyReportBtn = document.getElementById("copy-report-btn");','var copyReportBtn = document.getElementById("btn-copy-receipt");');
replace('var saveReportBtn = document.getElementById("save-report-btn");','var saveReportBtn = document.getElementById("btn-download-receipt");');
html=html.replace(/    \/\/ Wire #btn-copy-receipt and #btn-download-receipt[\s\S]*?(?=    \/\/ Wire Dedicated AI Modal Open\/Close)/,'    // Receipt controls use the original audit generator and handlers.\n');
replace("const validTabs = ['tab-1', 'tab-2', 'tab-3', 'tab-4', 'tab-5'];","const validTabs = ['tab-1', 'tab-2', 'tab-3', 'tab-4', 'tab-5', 'tab-6'];");
replace("document.querySelectorAll('.top-navbar .nav-link').forEach(btn => {","document.querySelectorAll('.top-navbar .nav-link, .tabs-nav-bar .tab-btn').forEach(btn => {");
replace("'tab-5': 'Tab 5: Academic Coursework Portfolio'","'tab-5': 'Tab 5: Academic Coursework Portfolio',\n        'tab-6': 'Tab 6: Secure Architecture'");
replace("const tabMap = {","const tabMap = {\n        '#overview':'overview',\n        '#tab-1':'tab-1', '#tab-2':'tab-2', '#tab-3':'tab-3', '#tab-4':'tab-4', '#tab-5':'tab-5', '#tab-6':'tab-6', '#tab6':'tab6',");
html=html.replace(/} else \{\s*switchTab\('tab1'\);\s*}/,"} else { switchTab('overview'); }");
replace("if (hash === '#tab1' || hash === '#tab2' || hash === '#tab3' || hash === '#tab4' || hash === '#tab5') {","if (/^#tab-?[1-6]$/.test(hash) || hash === '#overview') {");
// History navigation must not add another history entry.
replace("if (history.pushState) history.pushState(null, null, '#overview');","if (history.pushState && location.hash !== '#overview') history.pushState(null, null, '#overview');");
replace("history.pushState(null, null, '#' + tabId);","if (location.hash !== '#' + tabId) history.pushState(null, null, '#' + tabId);");
replace("if (toggleBtn) toggleBtn.addEventListener('click', toggleActivityDock);","// Dock behavior is owned by the unified presentation controller.");
replace("if (toggleTitle) toggleTitle.addEventListener('click', toggleActivityDock);","// Header click handled once by the unified presentation controller.");
replace('  setupTamedActivityDock();','  // Unified presentation controller owns the dock.');
replace('  setupBentoSpotlightTracker();','  // Unified presentation controller owns spotlight tracking.');
html=html.replace(/const width = 120;\s*const height = 120;/,'const width = 260;\n    const height = 260;');
// Read-only six-axis radar, linked to actual simulation controls.
const axes=['S','T','R','I','D','E'];
const point=(radius,index)=>{const a=-Math.PI/2+index*Math.PI/3;return [150+Math.cos(a)*radius,130+Math.sin(a)*radius];};
const polygon=radius=>axes.map((_,i)=>point(radius,i).join(',')).join(' ');
const grid=[30,60,90].map(r=>`<polygon points="${polygon(r)}" fill="none" stroke="#7dd3fc22"/>`).join('');
const lines=axes.map((letter,i)=>{const [x,y]=point(90,i),[lx,ly]=point(109,i);return `<line x1="150" y1="130" x2="${x}" y2="${y}" stroke="#7dd3fc22"/><text x="${lx}" y="${ly+4}" fill="#91b6cc" text-anchor="middle" font-family="monospace" font-size="12">${letter}</text>`;}).join('');
replace('<!-- 6-CARD STRIDE BENTO MATRIX -->',`<div class="wb-radar-card"><svg viewBox="0 0 300 260" role="img" aria-labelledby="wb-radar-title wb-radar-description"><title id="wb-radar-title">STRIDE simulation control coverage</title><desc id="wb-radar-description">Six axes reflect the simulation defense toggles.</desc>${grid}${lines}<polygon id="wb-radar-polygon" points="${polygon(18)}"/><circle cx="150" cy="130" r="3" fill="#a7f3d0"/></svg><div><span class="wb-overline">LIVE CONTROL COVERAGE</span><h3>See your defense take shape.</h3><p>Toggle defenses in SentrySim to see the matrix respond. The radar shows simulation coverage, not a measured security score. Audit logging and object-level authorization still require separate controls.</p><div class="wb-radar-summary"><div><strong id="wb-defense-count">5/5</strong><span>Defenses enabled</span></div><div><strong>6</strong><span>Threat categories</span></div></div><button type="button" class="wb-button" style="margin-top:18px" onclick="switchTab('tab-2')">Configure defenses ↗</button></div></div>
      <!-- 6-CARD STRIDE BENTO MATRIX -->`);
replace('</body>','<script id="unified-redesign-script">\n'+fs.readFileSync('redesign.js','utf8')+'\n</script>\n</body>');
// Ensure the entire academic block is byte-for-byte unchanged, including whitespace.
function coursework(text){return text.slice(text.indexOf('    <section id="panel-tab-5"'),text.indexOf('    <!-- MIGRATED AI CONNECT MODAL -->')).split('    <section id="panel-tab-6"')[0];}
const originalCourse=coursework(source);
if(!html.includes(originalCourse))throw Error('Coursework changed');
// Remap complete routes together so panel IDs, ARIA links, history, and handlers agree.
html=html.replace(/tab-([56])\b/g,(_,n)=>'tab-'+(n==='5'?'6':'5'))
  .replace(/tab-btn-([56])\b/g,(_,n)=>'tab-btn-'+(n==='5'?'6':'5'))
  .replace(/tab([56])\b/g,(_,n)=>'tab'+(n==='5'?'6':'5'))
  .replace('Tab 5: Academic Coursework Portfolio','Tab 6: Academic Coursework Portfolio')
  .replace('Tab 6: Secure Architecture','Tab 5: Secure Architecture')
  .replace('06 / NEXT IN THE WORKBENCH','05 / NEXT IN THE WORKBENCH');
html=html.replace(/(  <button[^\n]+id="tab-btn-6"[^\n]+\n)(  <button[^\n]+id="tab-btn-5"[^\n]+\n)/,
  (_,course,architecture)=>architecture.replace('wb-tab-num">06','wb-tab-num">05')+course.replace('wb-tab-num">05','wb-tab-num">06'));
let count=0;
// Add the new assignment after preserving and remapping the existing coursework.
html=html.replace(/(<section id="panel-tab-5"[^>]*>)[\s\S]*?(<\/section>)/,
  (_,open,close)=>open+'<span id="tab-5"></span>'+fs.readFileSync('assignment3.html','utf8')+close);
replace('<section id="panel-tab-6" class="tab-panel" data-tab="tab-6" role="tabpanel" aria-labelledby="tab-btn-6">',
  '<section id="panel-tab-6" class="tab-panel" data-tab="tab-6" role="tabpanel" aria-labelledby="tab-btn-6">'+fs.readFileSync('assignment3-coursework.html','utf8'));
html=html.replace('ASSIGNMENT 3 / UP NEXT','ASSIGNMENT 3 / SYSTEM DESIGN');
for(const script of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)){if(script[1].trim()){new vm.Script(script[1]);count++;}}
const css=fs.readFileSync('redesign.css','utf8');
let balance=0;for(const char of css){if(char==='{')balance++;if(char==='}')balance--;if(balance<0)throw Error('Invalid CSS braces');}if(balance)throw Error('Unbalanced CSS');
fs.writeFileSync('index.html',html,'utf8');
console.log(JSON.stringify({bytes:Buffer.byteLength(html),inlineScriptsParsed:count,courseworkBytesPreserved:Buffer.byteLength(originalCourse),newCSSBracesBalanced:true}));
