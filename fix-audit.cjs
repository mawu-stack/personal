const fs=require('fs'),a=require('assert/strict');let h=fs.readFileSync('index-audit-fixes-backup.html','utf8');const edits=[];
function edit(before,after){a.equal(h.split(before).length,2,before);h=h.replace(before,after);edits.push({before,after});}
edit('    <main>\n      <!-- PAGE 1 — HOME -->','      <!-- End AuthGuard panel -->');
const start=h.indexOf('<section id="panel-tab-2"'),end=h.indexOf('</section>',start);
edit(h.slice(start,end+10),h.slice(start,end)+'  </div>\n    </section>');
edit("document.getElementById('ai-input-prompt')","document.getElementById('injection-input')");
edit('<input type="text" id="injection-input" class="injection-input" placeholder="Enter a prompt to test…" autocomplete="off">','<textarea id="injection-input" class="injection-input" rows="3" aria-label="AI threat modeling prompt" placeholder="Enter a prompt to test…" autocomplete="off"></textarea>');
edit('          <form id="injection-form"',`          <div aria-label="AI threat categories" style="display:flex;gap:12px;flex-wrap:wrap;margin:16px 0">
            <button type="button" class="ai-threat-node sample-chip-btn" data-category="injection">Prompt injection</button>
            <button type="button" class="ai-threat-node sample-chip-btn" data-category="leakage">Information leakage</button>
            <button type="button" class="ai-threat-node sample-chip-btn" data-category="abuse">Privilege abuse</button>
            <button type="button" class="ai-threat-node sample-chip-btn" data-category="manipulation">Output manipulation</button>
          </div>
          <form id="injection-form"`);
edit("document.getElementById('btn-export-stride-report')","document.getElementById('stride-export-btn')");
edit('class="stride-action-btn" onclick="exportStrideReport()"','class="stride-action-btn"');
edit('Download report (.txt)','Export Assignment 2 Report');
edit('      <div class="stride-header-actions">',`      <div class="stride-header-actions">
        <label for="stride-tier-filter">Architecture tier</label>
        <select id="stride-tier-filter" class="stride-action-btn"><option value="ALL">All tiers</option>${[1,2,3,4,5].map(n=>'<option value="Tier '+n+'">Tier '+n+'</option>').join('')}</select>`);
edit('    <!-- Header & Action Bar -->',`    <div class="stride-table-wrapper" style="overflow:auto;margin-bottom:24px"><table class="stride-table"><caption>Assignment 2 threat matrix</caption><thead><tr><th scope="col">ID</th><th scope="col">Threat</th><th scope="col">Tier</th><th scope="col">STRIDE</th><th scope="col">Severity</th><th scope="col">Description</th><th scope="col">Mitigation</th></tr></thead><tbody id="stride-table-body"></tbody></table></div>
    <!-- Header & Action Bar -->`);
fs.writeFileSync('index-cmdk.html',h);fs.writeFileSync('audit-fix-changes.json',JSON.stringify(edits,null,2));
