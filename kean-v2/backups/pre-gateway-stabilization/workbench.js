/* Shell adapter only. Existing tab buttons, handlers, IDs, router and state are reused. */
(()=>{'use strict';
const nav=document.querySelector('.tabs-nav-bar'),main=document.querySelector('main');if(!nav||!main)return;
const skip=document.createElement('a');skip.href='#workbench-content';skip.className='v2-skip';skip.textContent='Skip to active lab';document.body.prepend(skip);
main.id='workbench-content';main.tabIndex=-1;skip.addEventListener('click',event=>{event.preventDefault();main.focus({preventScroll:true});main.scrollIntoView({block:'start',behavior:'instant'});});
const sidebar=document.createElement('aside');sidebar.className='v2-sidebar';sidebar.setAttribute('aria-label','Lab navigation');
const back=document.createElement('a');back.href='index.html';back.className='v2-return';back.textContent='↖ Back to portfolio';
const caption=document.createElement('p');caption.className='v2-sidebar-label';caption.textContent='09 LABS / SCROLL TO EXPLORE';sidebar.append(back,caption,nav);document.querySelector('.top-navbar').after(sidebar);
const brand=document.querySelector('.brand-main');if(brand)brand.textContent='K.E.A.N.²';const sub=document.querySelector('.brand-sub');if(sub)sub.textContent='SECURITY, MADE TANGIBLE.';
const status=document.createElement('div');status.className='v2-workspace-status';status.setAttribute('aria-live','polite');main.prepend(status);
const labels={'tab-1':'01 / AUTHGUARD','tab-2':'02 / SENTRYSIM','tab-3':'03 / AI SECURITY','tab-4':'04 / STRIDE','tab-5':'05 / SECURE ARCHITECTURE','tab-6':'06 / COURSEWORK','tab-7':'07 / DDOS GUARD','tab-8':'08 / IDENTITY & AI','tab-9':'09 / XSS & RESEARCH'};
let previous='';function sync(){const active=nav.querySelector('.tab-btn.active'),id=active?.dataset.tab||'overview';if(id===previous)return;previous=id;status.replaceChildren();const label=document.createElement('strong');label.textContent=labels[id]||'K.E.A.N. / RESEARCH WORKBENCH';const scope=document.createElement('span');scope.className='v2-scope';scope.textContent=['tab-1','tab-2'].includes(id)?'Interactive educational lab':'Research, systems & coursework';status.append(label,scope);const panel=document.getElementById('panel-'+id);if(panel&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&panel.animate)panel.animate([{opacity:.5,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:200,easing:'ease-out'});}
// The original horizontal tab keys remain. Add vertical arrow equivalents to the desktop rail.
nav.addEventListener('keydown',event=>{if(innerWidth<=700||!['ArrowUp','ArrowDown'].includes(event.key))return;const buttons=[...nav.querySelectorAll('[role=tab]')],i=buttons.indexOf(document.activeElement);if(i<0)return;event.preventDefault();event.stopImmediatePropagation();const target=buttons[(i+(event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length];target.focus();target.click();},true);
new MutationObserver(sync).observe(nav,{subtree:true,attributes:true,attributeFilter:['class']});sync();
})();
