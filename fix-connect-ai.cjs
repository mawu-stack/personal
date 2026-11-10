const fs=require('fs'),assert=require('assert/strict');
let s=fs.readFileSync('index-connect-ai-backup.html','utf8');
const edits=[];
function replace(before,after){assert.equal(s.split(before).length,2,before);s=s.replace(before,after);edits.push({before,after});}
replace('#ai-connect-modal.modal-backdrop,\n    #connect-ai-modal.modal-backdrop','#ai-connect-modal.modal-backdrop');
replace('id="ai-connect-modal" class="modal-overlay"','id="ai-connect-modal" class="modal-backdrop"');
replace('<div class="modal-content">','<div class="modal-content modal-card">');
replace("const aiModal = document.getElementById('connect-ai-modal');","const aiModal = document.getElementById('ai-connect-modal');");
replace("const aiKeyInput = document.getElementById('ai-key-input');","const aiKeyInput = document.getElementById('ai-api-key-input');");
replace("    const aiProviderSelect = document.getElementById('ai-provider-select');\n",'');
for(const name of ['openAiDialog','closeAiDialog']){
 const before=`function ${name}() {\n      const modalEl = document.getElementById('ai-connect-modal') || document.getElementById('connect-ai-modal');`;
 replace(before,`function ${name}() {\n      const modalEl = aiModal;`);
}
replace("const provider = aiProviderSelect ? aiProviderSelect.value : 'gemini';","const provider = 'gemini';");
replace("if (modalEl) { modalEl.style.display = 'none'; modalEl.classList.remove('open'); }","if (modalEl) { modalEl.style.display = 'none'; modalEl.classList.remove('open'); }\n      if (aiKeyInput) aiKeyInput.value = '';\n      openAiBtn?.focus();");
const start=s.indexOf('    // Phase 2: Global Escape key listener to close open modals');
const end=s.indexOf("  window.addEventListener('DOMContentLoaded'",start);
replace(s.slice(start,end),"    window.addEventListener('keydown', e => {\n      if (e.key === 'Escape' && aiModal?.classList.contains('open')) closeAiDialog();\n    });\n\n");
const a=s.indexOf('    // Wire Dedicated AI Modal Open/Close');
const b=s.indexOf('    // Two-Tier Permissions & Autonomy Mode',a);
replace(s.slice(a,b),'');
fs.writeFileSync('index-cmdk.html',s);
fs.writeFileSync('connect-ai-changes.json',JSON.stringify(edits,null,2));
