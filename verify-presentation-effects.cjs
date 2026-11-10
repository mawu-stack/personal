const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const html=fs.readFileSync('index-cmdk.html','utf8');
const baseline=fs.readFileSync('index-presentation-backup.html','utf8');
const addition=fs.readFileSync('presentation-effects.html','utf8');
assert.equal(html.replace(addition+'\n','').trimEnd(),baseline.trimEnd(),'Only additive presentation code may change');
let styleCount=0;
for(const [,css] of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
  let depth=0;
  for(const char of css.replace(/\/\*[\s\S]*?\*\//g,'').replace(/"[^"\n]*"|'[^'\n]*'/g,'')) {
    if(char==='{')depth++;if(char==='}')depth--;assert(depth>=0);
  }
  assert.equal(depth,0);styleCount++;
}
for(const [,script] of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))new vm.Script(script);
const source=addition.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1];
function setup({reduced=false,native=true,hidden=false}={}) {
  const handlers={},mediaHandlers={},calls=[],transitions=[],animations=[],tweens=[];
  const media={matches:reduced,addEventListener:(name,fn)=>mediaHandlers[name]=fn};
  const nodes=new Map(),status={textContent:''};
  const panel=id=>{if(!nodes.has(id))nodes.set(id,{id,style:{opacity:''}});return nodes.get(id);};
  let active=panel('panel-tab-1');
  const details={open:false,style:{overflow:''},querySelector:()=>({addEventListener:(name,fn)=>handlers.summary=fn}),
    getBoundingClientRect:()=>({height:details.open?240:48}),
    animate:(frames,options)=>{const a={frames,options,cancel(){this.cancelled=true;}};animations.push(a);return a;}};
  const output={textContent:'',setAttribute:(name,value)=>output[name]=value};
  let observe;
  const document={hidden,readyState:'complete',querySelector:()=>active,querySelectorAll:()=>[details],
    getElementById:id=>id==='interaction-status'?status:output,
    addEventListener:(name,fn)=>handlers[name]=fn};
  if(native)document.startViewTransition=update=>{const t={update,ready:Promise.resolve(),finished:Promise.resolve(),skipTransition(){this.skipped=true;}};transitions.push(t);return t;};
  const context={document,matchMedia:()=>media,setTimeout:()=>1,clearTimeout:()=>{},MutationObserver:class{constructor(fn){observe=fn;}observe(){}},
    switchTab(id){calls.push(id);active=panel('panel-'+id);},
    gsap:{to:(el,opts)=>{const t={kill(){},opts};tweens.push(t);return t;},fromTo:(el,from,opts)=>{const t={kill(){},opts};tweens.push(t);return t;}}};
  context.window=context;vm.runInNewContext(source,context);
  return {context,document,media,mediaHandlers,handlers,calls,transitions,animations,tweens,details,output,status,observe:()=>observe()};
}
const normal=setup();
normal.context.switchTab('tab-2');normal.context.switchTab('tab-3');
for(const t of normal.transitions)t.update();
assert.deepEqual(normal.calls,['tab-2','tab-3'],'Rapid navigation must apply each existing action once');
assert(normal.transitions[0].skipped);
for(const settings of [{reduced:true},{hidden:true}]) {
  const env=setup(settings);env.context.switchTab('tab-2');
  assert.deepEqual(env.calls,['tab-2']);assert.equal(env.transitions.length,0);assert.equal(env.tweens.length,0);
  env.handlers.summary({defaultPrevented:false,target:{closest:()=>null},preventDefault(){throw Error('Native reduced-motion toggle was intercepted');}});
  assert.equal(env.animations.length,0);
}
const fallback=setup({native:false});fallback.context.switchTab('tab-2');
assert.deepEqual(fallback.calls,['tab-2']);assert.equal(fallback.tweens.length,1);
const event={defaultPrevented:false,target:{closest:()=>null},preventDefault(){}};
normal.handlers.summary(event);assert.equal(normal.details.open,true);
normal.handlers.summary(event);normal.animations.at(-1).onfinish();assert.equal(normal.details.open,false);
normal.handlers.summary(event);normal.media.matches=true;normal.mediaHandlers.change();
assert.equal(normal.details.open,true);assert.equal(normal.details.style.overflow,'');
normal.output.textContent='// Querying Google Gemini Live with BYOK API key...';normal.observe();
assert.equal(normal.output['aria-busy'],'true');assert.equal(normal.status.textContent,'Processing AI request…');
normal.output.textContent='MODEL RESPONSE: Complete';normal.observe();
assert.equal(normal.output['aria-busy'],'false');assert.equal(normal.status.textContent,'AI results ready.');
console.log(JSON.stringify({balancedStyleBlocks:styleCount,originalScriptsAndAcademicMarkupUnchanged:true,rapidNavigation:true,reducedMotion:true,hiddenTab:true,noViewTransitionFallback:true,disclosureReversal:true,asyncStatus:true},null,2));
