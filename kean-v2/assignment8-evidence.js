(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const create=(tag,text)=>{const node=document.createElement(tag);node.textContent=text;return node;};
  const percent=()=>Math.round(Number(getComputedStyle(document.documentElement).zoom||1)*100);
  const state=()=>window.Assignment8.state;
  const nav=()=>document.querySelector('.tab-panel.active')?.id;
  const video=()=>!$('a8-media').hidden&&state().lessonPlaying;
  const waitForTab=async id=>{
    const end=performance.now()+1200;
    while(nav()!==id&&performance.now()<end)await new Promise(resolve=>setTimeout(resolve,25));
    return nav()===id;
  };
  const tests=[
    ['Change the background to dark blue','setBackgroundColor',()=>getComputedStyle($('workbench-content')).backgroundColor==='rgb(19, 40, 68)'],
    ['Set preset to security-grid','setBackgroundPreset',()=>getComputedStyle($('workbench-content')).backgroundImage.includes('linear-gradient')],
    ['Set theme to light','setTheme',()=>!document.body.classList.contains('dark-mode')],
    ['Set theme to dark','setTheme',()=>document.body.classList.contains('dark-mode')],
    ['Set font scale to 120%','setFontScale',()=>percent()===120],
    ['Change music to calm','changeMusic',()=>state().music==='calm'],
    ['Play music','playMusic',()=>state().audio?.state==='running'&&state().voices.length===3],
    ['Pause music','pauseMusic',()=>state().voices.length===0],
    ['Play the cybersecurity training video','playVideo',()=>video()&&Boolean($('a8-video-stage').textContent.includes('Urgency'))],
    ['Pause video','pauseVideo',()=>!state().lessonPlaying&&!$('a8-media').hidden],
    ['Close video','closeVideo',()=>$('a8-media').hidden&&!$('a8-video-stage').children.length],
    ['Show products','showProducts',()=>$('a8-products').children.length===12],
    ['Find laptops under $900','findProducts',()=>$('a8-products').children.length===2],
    ['Open architecture','navigateTo',()=>waitForTab('panel-tab-5')],
    ['Open the dashboard','openDashboard',()=>waitForTab('panel-tab-10')],
    ['Reset appearance','resetAppearance',()=>percent()===100&&getComputedStyle($('workbench-content')).backgroundImage==='none']
  ];
  const questions=[
    ['Teach me how to recognize phishing attacks',/sender.*report/i],
    ['How do I make strong passwords?',/unique.*manager/i],
    ['Compare DoS and DDoS',/distributed.*multiple sources/i],
    ['Explain SQL injection',/parameterized queries/i],
    ['What is MFA?',/multi-factor.*security key/i]
  ];
  let rows=[],running=false,cancelled=false;
  function addRow(input,result,status,elapsed,note='') {
    const row={input,source:result?.action||result?.source||'—',status,milliseconds:elapsed===null?'—':elapsed.toFixed(1),note};
    rows.push(row);
    const tr=create('tr','');
    for(const value of Object.values(row))tr.append(create('td',value));
    $('a8-test-rows').append(tr);
  }
  async function run() {
    if(running||!window.authorize?.('site.control'))return;
    running=true;cancelled=false;rows=[];$('a8-test-rows').replaceChildren();
    $('a8-run-tests').disabled=true;$('a8-export-tests').disabled=true;
    $('a8-stop-tests').disabled=false;
    $('a8-test-status').textContent='Measuring local command and education results…';
    const session=window.currentSessionToken;
    const {color,preset,scale,music,video:openMedia,catalog}=state();
    const theme=['light','dark','auto'].find(mode=>$('theme-btn-'+mode)?.classList.contains('active'))||'auto';
    const tab=nav()?.replace(/^panel-/,'')||'overview';
    const url=location.href,scroll=[window.scrollX,window.scrollY];
    const catalogPanel=$('a8-catalog'),catalogHidden=catalogPanel.hidden;
    const products=$('a8-products'),productNodes=[...products.childNodes],count=$('a8-product-count');
    const productCount=count.textContent;
    const audioReady=state().audio?.state==='running'&&!state().voices.length;
    const interrupted=()=>cancelled||session!==window.currentSessionToken||url!==location.href;
    const send=input=>window.routeCommand(input,{source:'typed',scope:'assignment8',quiet:true,localOnly:true,test:true});
    let audioTested=false,mediaTested=false,completed=false;
    try{
      for(const [input,expected,verify] of tests){
        if(interrupted())break;
        if(expected.endsWith('Music')&&!audioReady){
          addRow(input,null,'NOT TESTED',null,'Activate audio and pause any current track before testing.');continue;
        }
        if(expected.endsWith('Video')&&openMedia){
          addRow(input,null,'NOT TESTED',null,'Close current media before testing.');continue;
        }
        if(expected.endsWith('Music'))audioTested=true;
        if(expected.endsWith('Video'))mediaTested=true;
        const start=performance.now(),[result]=await send(input);
        const passed=Boolean(result?.ok&&result.action===expected&&await verify());
        addRow(input,result,interrupted()?'PARTIAL':passed?'PASS':'FAIL',performance.now()-start,interrupted()?'Run interrupted during check.':passed?'State matched.':result?.text||'No result returned.');
      }
      for(const [input,keywords] of questions){
        if(interrupted())break;
        const start=performance.now(),[result]=await send(input);
        addRow(input,result,interrupted()?'PARTIAL':result?.ok&&keywords.test(result.text)?'PASS':'FAIL',performance.now()-start,'Local keyword check.');
      }
      completed=!interrupted();
    }catch{addRow('Test runner',null,'FAIL',null,'A check stopped unexpectedly.');}
    finally{
      try{
        if(session===window.currentSessionToken){
          if(audioTested){await send('Pause music');state().music=music;}
          if(mediaTested)await send('Close video');
          Object.assign(state(),{color,preset,scale,catalog});
          window.Assignment8.restoreAppearance();
          products.replaceChildren(...productNodes);count.textContent=productCount;catalogPanel.hidden=catalogHidden;
          if(location.href===url){
            window.switchTab(tab,null,false);
            if(!await waitForTab('panel-'+tab))throw Error('Original tab did not return.');
            window.scrollTo({left:scroll[0],top:scroll[1],behavior:'instant'});
          }
        }
        window.applyTheme(theme,false);
      }catch{addRow('Restore workbench',null,'FAIL',null,'Restoration stopped unexpectedly.');}
      finally{
        const summary=['PASS','FAIL','PARTIAL','NOT TESTED'].map(status=>rows.filter(row=>row.status===status).length+' '+status).join(' · ');
        $('a8-test-status').textContent=(completed?'Checks finished. ':'Run interrupted. ')+summary;
        $('a8-run-tests').disabled=false;$('a8-stop-tests').disabled=true;
        $('a8-export-tests').disabled=!rows.length;running=false;
      }
    }
  }
  function renderChecklist() {
    const evidence=state().evidence,controls=['setBackgroundColor','setBackgroundPreset','setTheme','setFontScale','resetAppearance'];
    const items=[
      ['Two different appearance controls',controls.filter(action=>evidence.has(action)).length>=2],
      ['One media, catalog, or replay feature',evidence.has('extra')],
      ['Three different security questions',[...evidence].filter(key=>key.startsWith('question:')).length>=3],
      ['One typed or voice command',evidence.has('nonclick')]
    ];
    $('a8-checklist').replaceChildren(...items.map(([label,done])=>create('li',(done?'✓ Complete — ':'○ Pending — ')+label)));
  }
  function boot() {
    if(!$('a8-run-tests'))return;
    $('a8-run-tests').addEventListener('click',run);
    $('a8-stop-tests').addEventListener('click',()=>{cancelled=true;});
    $('a8-export-tests').addEventListener('click',()=>{
      if(!rows.length||!window.authorize?.('site.control'))return;
      const report=['Assignment 8 measured test results','Security question checks use approximate keyword matching.',...rows.map(row=>[row.status,row.input,row.source,row.milliseconds+' ms',row.note].join(' | '))].join('\n');
      const url=URL.createObjectURL(new Blob([report],{type:'text/plain;charset=utf-8'}));
      const anchor=create('a','');anchor.href=url;anchor.download='assignment-8-test-report.txt';anchor.click();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
    });
    document.addEventListener('a8:evidence',renderChecklist);
    const missing=window.A8Education.ASSIGNMENT_KB.filter(item=>item.status==='missing').map(item=>item.id);
    $('a8-kb-status').textContent='No identifiable coursework on this site for assignments '+missing.join(', ')+'.';
    renderChecklist();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
