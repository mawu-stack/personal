(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const make=(tag,text)=>{const element=document.createElement(tag);if(text!==undefined)element.textContent=text;return element;};
  const day=86400000, start=Date.UTC(2026,0,1);
  const rules=Object.freeze({
    brute:'At least 5 failed logins from the same IP in 60 seconds.',
    stuffing:'At least 4 distinct usernames from the same IP in the selected event set.',
    takeover:'A successful login after at least 3 failures from the same IP in the prior 60 seconds.',
    offhours:'Administrator login outside 08:00–18:00 UTC.',
    flood:'At least 30 requests from one IP in 10 seconds.',
    sqli:'Request matched a SQL injection signature.',
    xss:'Request matched a cross-site scripting signature.',
    lockout:'The classroom login reported a lockout.',
    denial:'The classroom authorization policy denied an action.',
    prompt:'The AI sandbox reported a prompt injection flag.',
    sentry:'SentrySim reported a classroom attack scenario.'
  });
  const names={brute:'Brute force',stuffing:'Credential stuffing',takeover:'Success after failures',offhours:'Off-hours admin',flood:'Request flood',sqli:'SQL injection',xss:'XSS',lockout:'Login lockout',denial:'Authorization denial',prompt:'Prompt injection',sentry:'SentrySim attack'};
  function generate() {
    let seed=8127;
    const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
    const rows=[];
    const add=(offset,kind,details)=>rows.push({at:start+offset,kind,origin:'simulated',...details});
    for(let i=0;i<350;i++){
      const user=Math.floor(random()*80)+1;
      const login=random()<.36;
      add(Math.floor(random()*day),login?'login':'request',{ip:'192.0.2.'+user,user:'sample-'+user,result:login?(random()<.05?'failed':'success'):'ok'});
    }
    for(let i=0;i<6;i++)add(10*3600000+i*8000,'login',{ip:'198.51.100.21',user:'demo-account',result:'failed'});
    for(let i=0;i<5;i++)add(11*3600000+i*5000,'login',{ip:'198.51.100.22',user:'sample-'+(100+i),result:'failed'});
    for(let i=0;i<4;i++)add(12*3600000+i*5000,'login',{ip:'198.51.100.23',user:'demo-account',result:i===3?'success':'failed'});
    add(2*3600000,'login',{ip:'203.0.113.41',user:'sample-admin',role:'admin',result:'success'});
    for(let i=0;i<32;i++)add(14*3600000+i*240,'request',{ip:'203.0.113.52',result:'ok'});
    add(15*3600000,'request',{ip:'203.0.113.61',payload:"' OR 1=1 --"});
    add(16*3600000,'request',{ip:'203.0.113.62',payload:'<script>example()</script>'});
    return rows.sort((a,b)=>a.at-b.at);
  }
  function detect(rows) {
    const byIP=new Map();
    return [...rows].sort((a,b)=>a.at-b.at).map(event=>{
      const flags=[];
      if(event.flag)flags.push({id:event.flag,why:event.description});
      if(!event.ip)return {...event,flags};
      const record=byIP.get(event.ip)||{failed:[],requests:[],users:new Set()};
      byIP.set(event.ip,record);
      if(event.kind==='login'){
        record.failed=record.failed.filter(at=>event.at-at<=60000);
        if(event.user)record.users.add(event.user);
        if(record.users.size>=4)flags.push({id:'stuffing',why:record.users.size+' usernames observed from this IP.'});
        if(event.result==='failed'){
          record.failed.push(event.at);
          if(record.failed.length>=5)flags.push({id:'brute',why:record.failed.length+' failures in the last 60 seconds.'});
        }else if(event.result==='success'){
          if(record.failed.length>=3)flags.push({id:'takeover',why:'Success followed '+record.failed.length+' failures in 60 seconds.'});
          const hour=new Date(event.at).getUTCHours();
          if(event.role==='admin'&&(hour<8||hour>=18))flags.push({id:'offhours',why:'Administrator success at '+String(hour).padStart(2,'0')+':00 UTC hour.'});
          record.failed=[];
        }
      }
      if(event.kind==='request'){
        record.requests=record.requests.filter(at=>event.at-at<=10000);
        record.requests.push(event.at);
        if(record.requests.length>=30)flags.push({id:'flood',why:record.requests.length+' requests in the last 10 seconds.'});
        if(/\bunion\s+(?:all\s+)?select\b|['"]\s*or\s+\d+\s*=\s*\d+/i.test(event.payload||''))flags.push({id:'sqli',why:'SQL-like boolean bypass or UNION SELECT pattern.'});
        if(/<\s*script\b|\bon(?:error|load)\s*=/i.test(event.payload||''))flags.push({id:'xss',why:'Script tag or inline event-handler pattern.'});
      }
      return {...event,flags};
    });
  }
  const simulated=generate(),live=[],blocks=new Set();
  let pending=null,replays=0,selected=null,renderQueued=false;
  function normalize(entry) {
    const source=String(entry?.source||'').toUpperCase(),message=String(entry?.message||'');
    const at=Date.parse(entry?.timestamp);
    const base={at:Number.isFinite(at)?at:Date.now(),origin:'live',kind:'event'};
    if(source==='AUTH'){
      if(/Login succeeded/.test(message))return {...base,kind:'login',result:'success',description:'Demo sign-in succeeded.'};
      if(/Login attempt failed/.test(message))return {...base,kind:'login',result:'failed',...(message.includes('lockout')?{flag:'lockout',description:'Failed sign-in started a lockout.'}:{description:'Demo sign-in failed.'})};
      if(/Login attempt denied during.*lockout/.test(message))return {...base,kind:'login',result:'failed',flag:'lockout',description:'Sign-in denied during lockout.'};
      if(/Login attempt rejected|Credential verification failed/.test(message))return {...base,kind:'login',result:'failed',description:'Demo sign-in could not complete.'};
    }
    if(source==='AUTHORIZATION'&&message.startsWith('Denied'))return {...base,flag:'denial',description:'A role or session check denied an action.'};
    if(source==='SENTRY-SIM'&&/^Attack \[Vector/.test(message))return {...base,flag:'sentry',description:'A local SentrySim exercise recorded an attack result.'};
    if(source==='AI-ENGINE'&&/prompt injection (?:attempt BLOCKED|breached)/i.test(message))return {...base,flag:'prompt',description:'The sandbox recorded a prompt injection flag.'};
    return null;
  }
  function summarize(rows) {
    const attempts=rows.filter(row=>row.kind==='login'),failed=attempts.filter(row=>row.result==='failed').length;
    const types={},ips=new Set(),pairs=new Set();
    for(const row of rows)for(const flag of row.flags){
      types[flag.id]=(types[flag.id]||0)+1;
      pairs.add(flag.id+'|'+(row.ip||'page'));
      if(row.ip)ips.add(row.ip);
    }
    const score=2*pairs.size;
    return {attempts:attempts.length,failed,rate:attempts.length?failed/attempts.length:0,types,ips:[...ips].sort(),score,level:score>=10?'Critical':score>=6?'High':score>=3?'Elevated':'Low'};
  }
  const current=()=>detect($('a8-dataset')?.value==='live'?live:simulated);
  const describe=row=>row.flags.map(flag=>names[flag.id]+'. '+rules[flag.id]+' '+flag.why).join(' ');
  function drawTimeline(rows) {
    const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
    svg.setAttribute('viewBox','0 0 720 110');svg.setAttribute('role','img');
    svg.setAttribute('aria-label','Events per hour over 24 hours. Mint bars show all events and orange bars show flagged events.');
    const buckets=Array.from({length:24},()=>[0,0]);
    const base=$('a8-dataset').value==='live'?Date.now()-day:start;
    for(const row of rows){
      const hour=Math.floor((row.at-base)/3600000);
      if(hour<0||hour>23)continue;
      buckets[hour][0]++;
      if(row.flags.length)buckets[hour][1]++;
    }
    const max=Math.max(1,...buckets.map(b=>b[0]));
    buckets.forEach(([total,flagged],hour)=>{
      [total,flagged].forEach((count,index)=>{
        const rect=document.createElementNS(ns,'rect'),height=count/max*80;
        for(const [key,value] of Object.entries({x:hour*30+index*13,y:84-height,width:11,height,fill:index?'#e99052':'var(--lab-accent)'}))rect.setAttribute(key,value);
        const title=document.createElementNS(ns,'title');title.textContent='Hour '+hour+': '+count+(index?' flagged':' total');rect.append(title);svg.append(rect);
      });
    });
    const label=document.createElementNS(ns,'text');
    label.setAttribute('x','0');label.setAttribute('y','105');label.setAttribute('fill','currentColor');
    label.textContent='Hour 0                                      Hour 12                                      Hour 23';svg.append(label);
    $('a8-timeline').replaceChildren(svg);
  }
  function render() {
    if(!$('a8-dataset'))return;
    const rows=current(),stats=summarize(rows);
    const liveView=$('a8-dataset').value==='live';
    $('a8-sim-banner').textContent=liveView?'Live classroom events from this page. IP addresses are unavailable for page events.':'Simulated log data for demonstration.';
    const cards=[['Login attempts',stats.attempts],['Failed attempts',stats.failed],['Failure rate',(stats.rate*100).toFixed(1)+'%'],['Suspicious IPs',stats.ips.length],['Threat level',stats.level+' · '+stats.score]];
    $('a8-metrics').replaceChildren(...cards.map(([label,value])=>{const card=make('article');card.append(make('span',label),make('strong',String(value)));return card;}));
    $('a8-types').textContent=Object.entries(stats.types).map(([key,value])=>names[key]+' '+value).join(' · ')||'No flags in this view.';
    $('a8-ips').textContent=stats.ips.length?stats.ips.join(', '):'No suspicious IPs in this view.';
    const normal=rows.filter(row=>!row.flags.length),suspicious=rows.filter(row=>row.flags.length);
    const base=summarize(normal),flagged=summarize(suspicious);
    $('a8-baseline').textContent=normal.length+' unflagged events · '+suspicious.length+' flagged events. Login failure rate: '+(base.rate*100).toFixed(1)+'% unflagged ('+base.failed+'/'+base.attempts+'), '+(flagged.rate*100).toFixed(1)+'% flagged ('+flagged.failed+'/'+flagged.attempts+').';
    $('a8-blocklist').textContent=blocks.size?[...blocks].join(', '):'No simulated blocks.';
    drawTimeline(rows);
    const filter=$('a8-filter').value;
    const displayed=rows.filter(row=>filter==='all'||(filter==='suspicious'?row.flags.length:!row.flags.length)).reverse();
    $('a8-table-note').textContent='Showing '+Math.min(60,displayed.length)+' of '+displayed.length+' matching events. All events contribute to the cards.';
    $('a8-events').replaceChildren(...displayed.slice(0,60).map(row=>{
      const tr=make('tr');
      const detail=make('td');
      if(row.flags.length){
        const button=make('button','Inspect '+names[row.flags[0].id]);
        button.type='button';button.className='research-button';
        button.addEventListener('click',()=>{
          selected=row;$('a8-alert-detail').textContent=describe(row);
          window.Assignment8.feedback('Selected '+names[row.flags[0].id]+'.','click','answer',false);
        });
        detail.append(button);
      }else detail.textContent=row.description||'Normal baseline event';
      tr.append(make('td',new Date(row.at).toISOString().slice(11,19)+' UTC'),make('td',row.ip||'Page event'),make('td',row.kind+(row.result?' / '+row.result:'')),make('td',row.flags.length?'Suspicious':'Normal'),detail);
      return tr;
    }));
  }
  function replay() {
    if(replays>=20)throw Error('The classroom replay limit is 20 bursts per page load.');
    const at=start+day-600000+replays*16000;
    const ip='203.0.113.'+(220+replays++);
    for(let i=0;i<7;i++)simulated.push({at:at+i*600,origin:'simulated',kind:'login',ip,user:'replay-account',result:'failed'});
    window.switchTab('tab-10');
    $('a8-dataset').value='simulated';$('a8-filter').value='suspicious';render();
    return 'Replayed seven simulated login failures from '+ip+'.';
  }
  function proposeBlock(ip) {
    pending={ip,session:window.currentSessionToken};
    $('a8-confirm-block').hidden=false;
    $('a8-confirm-text').textContent='Add '+ip+' to the simulated block list?';
    window.switchTab('tab-10');
    return 'Confirm the simulated block using the dashboard button.';
  }
  function answer(text) {
    const cmd=text.toLowerCase().trim().replace(/[?!.]+$/,'');
    const stats=summarize(current());
    if(/^(?:what(?:'s|s| is) (?:the )?|show (?:the )?)threat level$/.test(cmd))return {text:'Threat level is '+stats.level+' with '+stats.score+' points in the selected view.',source:'Security Monitor'};
    if(/^show (?:the )?suspicious ips$/.test(cmd))return {text:stats.ips.length?'Suspicious documentation IPs: '+stats.ips.join(', ')+'.':'No suspicious IPs in the selected view.',source:'Security Monitor'};
    if(cmd==='explain this alert')return {text:selected?describe(selected):'Select an alert in the event table first.',source:'Security Monitor'};
    return null;
  }
  function boot() {
    if(!$('a8-dataset'))return;
    $('a8-dataset').addEventListener('change',()=>{selected=null;$('a8-alert-detail').textContent='Select an alert to inspect its rule.';render();});
    $('a8-filter').addEventListener('change',render);
    function clearPending(){pending=null;$('a8-confirm-block').hidden=true;}
    $('a8-block-cancel').addEventListener('click',clearPending);
    $('a8-block-confirm').addEventListener('click',()=>{
      const request=pending;clearPending();
      if(!request||request.session!==window.currentSessionToken||!window.authorize?.('monitor.block'))return;
      blocks.add(request.ip);render();
      window.Assignment8.log('[click] Confirmed simulated block for '+request.ip+'.','success');
      window.Assignment8.feedback('Added '+request.ip+' to the simulated block list.','click');
    });
    for(const entry of window.SecurityState?.activityLog||[]){const row=normalize(entry);if(row)live.push(row);}
    document.addEventListener('kean:activity',event=>{
      const row=normalize(event.detail);
      if(!row)return;
      live.push(row);if(live.length>500)live.shift();
      if($('a8-dataset').value==='live'&&!renderQueued){
        renderQueued=true;queueMicrotask(()=>{renderQueued=false;render();});
      }
    });
    document.addEventListener('kean:session-end',()=>{clearPending();blocks.clear();selected=null;render();});
    render();
  }
  window.A8Monitor=Object.freeze({rules,generate,detect,summarize,normalize,replay,proposeBlock,answer,matches:text=>/^(?:what(?:'s|s| is) (?:the )?threat level|show (?:the )?(?:threat level|suspicious ips)|explain this alert)[?.!]*$/i.test(text.trim()),get replayCount(){return replays;},get blockCount(){return blocks.size;}});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
