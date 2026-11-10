/* Branded presentation and focus handling only; authentication stays in the original controllers. */
(()=>{'use strict';
const gate=document.getElementById('simulated-login-overlay'),card=gate?.querySelector('.sim-login-card');if(!gate||!card)return;
const make=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;};
const header=make('header','gateway-header'),brand=make('a','gateway-brand');brand.href='index.html';brand.setAttribute('aria-label','K.E.A.N. homepage');
const logo=make('img');logo.src='mark.svg';logo.alt='';logo.width=34;logo.height=34;brand.append(logo,make('span','','K.E.A.N.²'));
const back=make('a','gateway-back','↖ Return to portfolio');back.href='index.html';header.append(brand,back);
const layout=make('div','gateway-layout'),story=make('section','gateway-story');story.setAttribute('aria-label','About this demonstration');
story.append(make('p','gateway-eyebrow','THE DEFENSIVE FIELD / DEMO ACCESS'));
const headline=make('h1','','Step inside');headline.append(make('br'),make('em','','the workbench.'));story.append(headline,make('p','gateway-intro','Nine cybersecurity labs. One space to question, test, and understand the systems behind the screen.'));
const field=make('div','gateway-field');field.setAttribute('aria-hidden','true');
field.innerHTML='<svg viewBox="0 0 480 190" focusable="false"><defs><pattern id="gateway-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="currentColor" stroke-width=".5"/></pattern></defs><rect width="480" height="190" fill="url(#gateway-grid)" opacity=".25"/><path d="M26 96H124L160 58H260L298 96H454" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="160" cy="58" r="36" fill="none" stroke="currentColor" opacity=".5"/><circle cx="160" cy="58" r="48" fill="none" stroke="currentColor" opacity=".2"/><circle cx="26" cy="96" r="4" fill="currentColor"/><circle cx="160" cy="58" r="5" fill="currentColor"/><circle cx="298" cy="96" r="4" fill="currentColor"/><circle cx="454" cy="96" r="4" fill="currentColor"/><text x="20" y="145">IDENTITY</text><text x="220" y="145">PERMISSIONS</text><text x="397" y="145">EXPLORE</text></svg>';
story.append(field);
const facts=make('div','gateway-facts');for(const [value,label]of [['09','Interactive labs'],['20 min','Demo session'],['Local','Client-side identity']]){const fact=make('div');fact.append(make('strong','',value),make('span','',label));facts.append(fact);}story.append(facts);
card.querySelector('.sim-login-radar-icon')?.remove();card.querySelector('.sim-login-title').textContent='Enter the lab.';card.querySelector('.sim-login-subtitle').textContent='DEMO AUTHENTICATION SIMULATION';
const form=document.getElementById('sim-login-form'),button=document.getElementById('btn-sim-login-submit');button.textContent='Enter workbench →';
const disclaimer=make('p','gateway-disclaimer','Use only the public demo credentials below. Client-side checks can be bypassed; this is a teaching simulation, not production-grade authentication.');disclaimer.id='gateway-disclaimer';card.querySelector('.sim-login-header').after(disclaimer);gate.setAttribute('aria-describedby',disclaimer.id);
const user=document.getElementById('sim-login-username'),password=document.getElementById('sim-login-password');user.setAttribute('aria-describedby','sim-login-note');password.setAttribute('aria-describedby','sim-login-note');user.spellcheck=false;user.autocapitalize='none';
layout.append(story,card);const footer=make('footer','gateway-footer');footer.append(make('span','','K.E.A.N. / SECURITY, MADE TANGIBLE.'),make('span','','TEMPORARY SESSION · NO AUTHENTICATION BACKEND'));
gate.replaceChildren(header,layout,footer);
const logout=make('button','v2-logout','Log out');logout.type='button';logout.id='v2-logout';logout.addEventListener('click',()=>document.getElementById('a4-end-session').click());document.querySelector('.nav-controls').append(logout);
// Reuse the original overlay state. Inert is a focus boundary, never an authorization decision.
const priorInert=new Map();let active=false;
function shown(){return getComputedStyle(gate).display!=='none';}
function keepOutsideInert(){for(const e of document.body.children){if(e===gate||['SCRIPT','STYLE','LINK'].includes(e.tagName))continue;if(!priorInert.has(e))priorInert.set(e,e.inert);e.inert=true;}}
function focusUser(){if(active&&!gate.contains(document.activeElement))user.focus({preventScroll:true});}
function sync(){const next=shown();if(next){keepOutsideInert();if(!active){for(const dialog of document.querySelectorAll('dialog[open]'))dialog.close();active=true;document.body.classList.add('v2-gateway-open');requestAnimationFrame(focusUser);}}else if(active){active=false;document.body.classList.remove('v2-gateway-open');for(const [e,value]of priorInert)e.inert=value;priorInert.clear();const target=document.querySelector('.tab-panel.active h2')||document.getElementById('workbench-content');if(target){target.tabIndex=-1;target.focus({preventScroll:true});}}}
new MutationObserver(sync).observe(gate,{attributes:true,attributeFilter:['class','style','hidden']});new MutationObserver(()=>{if(active)keepOutsideInert();}).observe(document.body,{childList:true});
document.addEventListener('keydown',event=>{if(!active)return;if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();event.stopImmediatePropagation();return;}if(event.key!=='Tab')return;const nodes=[...gate.querySelectorAll('a[href],button:not([disabled]),input:not([disabled])')].filter(e=>e.getClientRects().length);const first=nodes[0],last=nodes.at(-1);if((event.shiftKey&&document.activeElement===first)||(!event.shiftKey&&document.activeElement===last)){event.preventDefault();(event.shiftKey?last:first).focus();}},true);
document.addEventListener('focusin',event=>{if(active&&!gate.contains(event.target))focusUser();});
document.addEventListener('kean:session-end',()=>{const status=document.getElementById('a4-login-status');if(status)status.textContent='Demo session ended. Sign in again.';password.value='';queueMicrotask(sync);});
document.addEventListener('kean:session-start',()=>queueMicrotask(sync));sync();
})();
