/* Presentation adapter. All explanations are read verbatim from protected coursework. */
(()=>{'use strict';
const source=document.querySelector('#panel-tab-5 .a3');if(!source)return;
const articles=[...source.querySelectorAll('.a3-grid article')],steps=[...source.querySelectorAll('.a3-flow li')];
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;};
const stage=el('section','arch-explorer');stage.id='architecture-explorer';stage.setAttribute('aria-label','Interactive proposed architecture');
stage.append(el('p','arch-kicker','PROPOSED SYSTEM / INTERACTIVE FIELD GUIDE'),el('h3','','Follow the trust boundary.'));
const toolbar=el('div','arch-toolbar'),next=el('button','','Next request step →'),reset=el('button','','Reset path'),read=el('button','','Read the complete assignment ↓');[next,reset,read].forEach(b=>b.type='button');toolbar.append(next,reset,read);stage.append(toolbar);
const layout=el('div','arch-layout'),diagram=el('div','arch-map'),flow=el('div','arch-nodes'),controls=el('div','arch-controls'),inspector=el('article','arch-inspector');inspector.id='architecture-inspector';inspector.setAttribute('aria-live','polite');inspector.setAttribute('aria-atomic','true');
diagram.append(el('p','arch-kicker','REQUEST PATH · BROWSER → PRIVATE DATA'),flow,el('p','arch-kicker','CROSS-CUTTING SECURITY CONTROLS'),controls);layout.append(diagram,inspector);stage.append(layout);
const progress=el('p','arch-progress');progress.setAttribute('role','status');stage.append(progress);
let selected=0,path=-1;const buttons=[];
articles.forEach((article,i)=>{const b=el('button','arch-node',article.querySelector('h4').textContent);b.type='button';b.setAttribute('aria-controls',inspector.id);b.addEventListener('click',()=>select(i));buttons.push(b);(i<4?flow:controls).append(b);});
function select(i){selected=i;buttons.forEach((b,j)=>b.setAttribute('aria-pressed',String(j===i)));inspector.replaceChildren(el('p','arch-kicker',String(i+1).padStart(2,'0')+' / COMPONENT INSPECTOR'),el('h4','',articles[i].querySelector('h4').textContent));for(const p of articles[i].querySelectorAll('p,small'))inspector.append(el(p.tagName.toLowerCase(),'',p.textContent));if(i<4){const boundary=steps[i].querySelector('small');inspector.append(el('p','arch-boundary',boundary.textContent));} }
next.addEventListener('click',()=>{path=(path+1)%4;select(path);buttons.forEach((b,i)=>b.classList.toggle('arch-traversed',i<=path&&i<4));progress.textContent='Illustrative request · '+(path+1)+' of 4 · '+steps[path].querySelector('h4').textContent+' · '+steps[path].querySelector('small').textContent;});
reset.addEventListener('click',()=>{path=-1;buttons.forEach(b=>b.classList.remove('arch-traversed'));progress.textContent='Request path reset. Select a component or advance one boundary at a time.';select(0);});
read.addEventListener('click',()=>{const heading=source.querySelector('#a3-flow-title');heading.tabIndex=-1;heading.focus({preventScroll:true});heading.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});});
source.querySelector('.a3-intro').after(stage);select(0);progress.textContent='Illustration only. No request is sent and no backend is deployed.';
})();
