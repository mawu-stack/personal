import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from './.html-audit/node_modules/parse5/dist/index.js';
const file='index-cmdk.html',backup='index-a4-backup.html';
if(!fs.existsSync(backup))fs.copyFileSync(file,backup);
let html=fs.readFileSync(file,'utf8');
const edits=[];
function edit(before,after){assert.equal(html.split(before).length,2,before.slice(0,100));html=html.replace(before,after);edits.push({before,after});}
function element(id){let found;function walk(n){if(n.attrs?.some(a=>a.name==='id'&&a.value===id))found=n;for(const c of n.childNodes||[])walk(c);}walk(parse(html,{sourceCodeLocationInfo:true}));assert(found,id);const l=found.sourceCodeLocation;return html.slice(l.startOffset,l.endOffset);}
const phase=process.argv[2];
if(phase==='1'){
 const old=element('assignment4');
 let panel=old.replace('<div class="a4-grid">','<nav class="a4-subnav" aria-label="Assignment 4 parts"><a href="#a4-part1">Part 1 Auth &amp; Access Control</a><a href="#a4-part2">Part 2 AI Chatbot</a><a href="#a4-part3">Part 3 Digital Person</a><a href="#a4-evidence">Test Evidence</a></nav><div class="a4-grid">').replace('class="a4-card" aria-labelledby="a4-access-title"','id="a4-part1" class="a4-card" aria-labelledby="a4-access-title"').replace('class="a4-card" aria-labelledby="a4-person-title"','id="a4-part3" class="a4-card" aria-labelledby="a4-person-title"').replace('<section aria-labelledby="a4-chat-title">','<section id="a4-part2" aria-labelledby="a4-chat-title">').replace('</section>\n  </div>\n</section>','</section>\n  </div><section id="a4-evidence" class="a4-card"><h3>Test Evidence</h3><p>Runtime chatbot evidence and verification results will appear here.</p></section>\n</section>');
 edit(old,'');
 edit('<section id="panel-tab-3"', '<section id="panel-tab-8" class="tab-panel" data-tab="tab-8" role="tabpanel" aria-labelledby="tab-btn-8">'+panel+'</section>\n<section id="panel-tab-3"');
 const nav=element('tab-btn-7');edit(nav,nav+'\n<button type="button" class="tab-btn" role="tab" id="tab-btn-8" data-tab="tab-8" aria-controls="panel-tab-8"><span class="wb-tab-num">08</span><span><span class="wb-tab-name">Assignment 4 - Auth &amp; AI</span><span class="wb-tab-desc">IDENTITY / CHATBOT / DIGITAL PERSON</span></span></button>');
 edit("'tab-6', 'tab-5', 'tab-7'];","'tab-6', 'tab-5', 'tab-7', 'tab-8'];");
 edit("'#overview':'overview', '#tab-7'","'#tab-8':'tab-8', '#tab8':'tab-8', '#overview':'overview', '#tab-7'");
 edit('/^#tab-?[1-7]$/','/^#tab-?[1-8]$/');
 edit("window.switchTab('tab-3');$('assignment4').scrollIntoView", "window.switchTab('tab-8');$('assignment4').scrollIntoView");
 edit("['open assignment 4','open assignment four']","['open assignment 4','open assignment four','open auth and ai','go to assignment 4','assignment 4']");
 edit('</body>','<style id="a4-v2-style">.a4-subnav{display:flex;flex-wrap:wrap;gap:10px;position:sticky;top:170px;z-index:15;background:var(--bg-surface);padding:12px;border:1px solid var(--card-border);border-radius:16px;margin-bottom:24px}.a4-subnav a{padding:9px 12px;border:1px solid var(--card-border);border-radius:99px;color:var(--text-heading);text-decoration:none}.a4 :is(#a4-part1,#a4-part2,#a4-part3,#a4-evidence){scroll-margin-top:260px}.a4-subnav a:focus-visible{outline:3px solid var(--brand-blue)}@media(max-width:700px){.a4-subnav{top:70px;position:relative}.a4 :is(#a4-part1,#a4-part2,#a4-part3,#a4-evidence){scroll-margin-top:100px}}@media(prefers-reduced-motion:reduce){#panel-tab-8 *{scroll-behavior:auto!important;animation:none!important;transition:none!important}}</style>\n</body>');
}else if(phase==='2'){
 edit(element('sim-login-role').replace(/^.*$/s,x=>x),'<output id="sim-login-role" hidden>user</output>');
 edit('<label for="sim-login-role" class="sim-login-label">Demonstration role</label>','<span class="sim-login-label">Your role is assigned by the demo account.</span>');
 const note=element('sim-login-note');edit(note,'<p class="sim-login-note" id="sim-login-note" role="status">Throwaway demo accounts:<br>Regular User: <code>student</code> / <code>StudentDemo!2026</code><br>Administrator: <code>administrator</code> / <code>AdminDemo!2026</code><br>Use these public lab credentials only; never enter a real password.</p>');
 edit('window.handleSimulatedLoginSubmit = function() {','window.handleSimulatedLoginSubmit = async function() {');
 edit("      // Any non-empty input logs in; default fallback if empty\n      const username = uVal || 'demo_user';", "      const account = await window.A4Auth.authenticate(uVal, pVal);\n      if (!account) return;\n      const username = account.name;");
 edit('      document.dispatchEvent(new CustomEvent("kean:session-start",{detail:{token:window.currentSessionToken,role:document.getElementById("sim-login-role").value === "admin" ? "admin" : "user",expiresAt:Date.now()+SESSION_DURATION_SECONDS*1000}}));','      window.currentSession={token:window.currentSessionToken,username:account.name,role:account.role,expiresAt:Date.now()+SESSION_DURATION_SECONDS*1000};\n      window.A4Auth.setSession(window.currentSession);\n      document.dispatchEvent(new CustomEvent("kean:session-start",{detail:window.currentSession}));');
 edit('    window.handleSessionExpired = function() {','    window.handleSessionExpired = function() {\n      window.currentSession=null;\n      window.A4Auth?.setSession(null);');
 edit("  const permissions={user:['profile.view','profile.edit'],admin:['users.manage','logs.view','content.manage']};","  const permissions=window.A4Auth.permissions;");
 edit("  const resetUsers=()=>[{name:'demo.student',role:'user',enabled:true},{name:'demo.editor',role:'admin',enabled:true},{name:'demo.guest',role:'user',enabled:false}];","  const resetUsers=()=>window.A4Auth.users;");
 edit("const authenticated=valid(),allowed=authenticated&&permissions[identity.role]?.includes(permission);","const authenticated=valid(),allowed=window.A4Auth.authorize(permission);\n    if(identity&&window.currentSession)identity.role=window.currentSession.role;");
 edit("    $('a4-decision').textContent=(allowed?'ACCESS GRANTED — ':'ACCESS DENIED — ')+reason;","    $('a4-decision').textContent='Authenticated: '+(authenticated?'yes':'no')+'. Authorized: '+(allowed?'yes':'no')+'. '+reason;");
 edit("window.SecurityState.activityLog.slice(0,20).map", "[...window.A4Auth.audit,...window.SecurityState.activityLog].map");
 edit("$('a4-check').addEventListener('click',()=>{hidePanels();const action=$('a4-action').value;", "function execute(action){hidePanels();");
 edit("if(action==='content.manage')$('a4-content').hidden=false;});", "if(action==='content.manage')$('a4-content').hidden=false;}\n    $('a4-check').addEventListener('click',()=>execute($('a4-action').value));\n    $('a4-try-admin').addEventListener('click',()=>execute('logs.view'));\n    window.A4Auth.execute=execute;\n    for(const [label,aliases,action] of [['Show security logs',['show security logs','view security logs'],'logs.view'],['Manage users',['manage users'],'users.manage'],['Manage website content',['manage website content'],'content.manage'],['View personal information',['view personal information'],'profile.view'],['Edit personal profile',['edit personal profile'],'profile.edit']])window.keanCommandRegistry?.register(label,aliases,say=>{window.switchTab('tab-8');execute(action);say($('a4-decision').textContent);},'Action');");
 edit('Roles are self-selected for this demo; production permissions must be enforced by a server.','Accounts assign roles in memory. Client-side checks can be bypassed in developer tools; a real system enforces them server-side as in the Assignment 3 architecture.');
 edit('Latest 20 events from Live Telemetry.','Full in-memory login/authorization audit plus Live Telemetry.');
 edit('These fictional accounts do not affect your active role or real accounts.','Enable/disable and role changes apply to these in-memory demo accounts. They reset on a fresh page load.');
 edit('<button type="button" id="a4-check"', '<table><thead><tr><th>Authentication</th><th>Authorization</th></tr></thead><tbody><tr><td>Proving who you are through login.</td><td>Checking what your role permits at execution time.</td></tr></tbody></table><button type="button" id="a4-try-admin" class="wb-button">Try an admin action</button>\n<button type="button" id="a4-check"');
 edit('End demo session / change role','Logout');
 edit('    const nav=document.createElement(\'span\');',"    const nav=document.createElement('span');");
 edit('</body>','<script id="a4-auth-controller">\n'+fs.readFileSync('a4-auth.js','utf8')+'\n</script>\n</body>');
}else if(phase==='3'){
 const chat=element('a4-part2');edit(chat,'');
 let next=chat.replace('<section id="a4-part2"','<section class="a4-card" id="a4-part2"').replace('<h4 id="a4-chat-title">','<h3 id="a4-chat-title">').replace('</h4>','</h3>').replace('<form id="a4-question-form">','<div id="a4-chat-history" role="log" aria-live="polite" aria-label="Chat message history"></div><form id="a4-question-form">').replace('Ask K.E.A.N.</button>','Send</button>');
 edit('<section id="a4-part3"',next+'\n<section id="a4-part3"');
 edit('window.routeCommand(question);});','window.routeCommand(question);});');
 edit('Runtime chatbot evidence and verification results will appear here.','Measured at runtime. No prefilled pass results. API keys stay in the existing session-only provider pipeline.</p><button type="button" class="wb-button" id="a4-chat-selftest">Run chatbot self-test</button><p id="a4-test-status" role="status">Not run.</p><div class="a4-table-scroll"><table><thead><tr><th>Question</th><th>Response arrived</th><th>Time</th><th>Provider</th><th>Error / note</th></tr></thead><tbody id="a4-test-rows"></tbody></table></div><p');
 edit('</body>','<script id="a4-chat-controller">\n'+fs.readFileSync('a4-chat.js','utf8')+'\n</script>\n</body>');
}else throw new Error('Choose phase 1, 2 or 3');
fs.writeFileSync(file,html);
fs.writeFileSync('a4-v2-phase'+phase+'-changes.json',JSON.stringify(edits,null,2));
console.log('Applied phase',phase);
