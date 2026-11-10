const fs=require('fs'),vm=require('vm'),a=require('assert/strict');const js=fs.readFileSync('kean-prime.html','utf8').match(/<script[^>]*>([\s\S]*?)<\/script>/)[1];
let list=[],ready,changed;const elements={};const element=()=>({value:'',textContent:'',style:{},listeners:{},append(){},replaceChildren(){},addEventListener(n,f){this.listeners[n]=f;}});
const ctx={window:{speechSynthesis:{getVoices:()=>list,addEventListener:(n,f)=>changed=f}},document:{readyState:'loading',addEventListener:(n,f)=>ready=f,getElementById:id=>elements[id]||(elements[id]=element()),createElement:element}};
vm.createContext(ctx);vm.runInContext(js,ctx);const p=ctx.window.KeanPrime;a.equal(p.selected,null);a.equal(p.apply({}).pitch,.85);a.equal(p.apply({}).rate,.92);ready();
list=[{name:'Default',lang:'en-US',default:true,voiceURI:'a'},{name:'Google UK English Male',lang:'en-GB',voiceURI:'b'}];changed();a.equal(p.selected,list[1]);
elements['kean-prime-pitch'].listeners.input({target:{value:'1.1'}});elements['kean-prime-rate'].listeners.input({target:{value:'.8'}});a.equal(p.apply({}).pitch,1.1);a.equal(p.apply({}).rate,.8);
elements['kean-prime-voice'].listeners.change({target:{value:'a|Default|en-US'}});a.equal(p.selected,list[0]);changed();a.equal(p.selected,list[0]);
a.equal(p.choose([list[0]]),list[0]);a.equal(p.choose([]),null);console.log('PASS empty initial voices, async discovery, UK selection, manual override, live pitch/rate application and default fallback');
