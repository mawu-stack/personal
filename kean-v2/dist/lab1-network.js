(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const label='[SIMULATED EDUCATIONAL OUTPUT]';
  const original='192.0.2.10',gateway='192.0.2.1',peer='192.0.2.180',dns='203.0.113.53';
  const macs=Object.freeze({[gateway]:'02-00-00-00-02-01',[peer]:'02-00-00-00-02-B4'});
  const targets=Object.freeze({kean:{name:'www.kean.edu',address:'203.0.113.70'},google:{name:'www.google.com',address:'203.0.113.80'}});
  const routePaths=[
    ['198.51.100.1','198.51.100.6'],
    ['198.51.100.1','198.51.100.7'],
    ['198.51.100.2',null,'198.51.100.6'],
    ['198.51.100.1','198.51.100.9','203.0.113.14'],
    ['198.51.100.2','198.51.100.7']
  ];
  function exampleRoute(target,run){
    const endpoint=targets[target];
    if(!endpoint||!Number.isInteger(run)||run<1||run>5)return null;
    const offset=target==='google'?1:0;
    const paths=routePaths[(run-1+offset)%5];
    return [gateway,...paths,endpoint.address].map((address,index)=>({hop:index+1,address,rtt:address?index===0?1:7+index*4+run+offset:null}));
  }
  const validIPv4=value=>/^(?:0|[1-9]\d{0,2})(?:\.(?:0|[1-9]\d{0,2})){3}$/.test(value)&&value.split('.').every(octet=>Number(octet)<=255);
  function validAddress(value){
    if(value.includes(':')){
      const address=value.split('%');
      if(!/^[a-f\d:.]+$/i.test(address[0])||address.length>2||(address.length===2&&!/^[\w.-]+$/.test(address[1])))return false;
      try{return Boolean(new URL('http://['+address[0]+']/').hostname);}catch{return false;}
    }
    return validIPv4(value);
  }
  const validHost=value=>value.length<=254&&!/^[\d.]+$/.test(value)&&value.replace(/\.$/,'').split('.').every(label=>/^[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?$/i.test(label));
  function parseTrace(raw,reachability='unconfirmed'){
    const rows=[];
    for(const line of raw.split(/\r?\n/)){
      if(!/^\s*[+-]?\d+(?:\s|$)/.test(line))continue;
      const unreachable=line.match(/^\s*([1-9]\d{0,2})\s+(\S+)\s+reports:\s+Destination (?:host|net(?:work)?) unreachable\.?\s*$/i);
      if(unreachable&&validAddress(unreachable[2])){
        const hop=Number(unreachable[1]);
        if(hop<=Number(rows.at(-1)?.hop||0))return {error:'Paste one run with increasing numbered hops.'};
        rows.push({hop,probes:[],address:unreachable[2],endpoint:line.trim().replace(/^\d+\s+/,''),unreachable:true});
        continue;
      }
      const match=line.match(/^\s*([1-9]\d{0,2})\s+((?:<\s*\d+|\d+)\s*ms|\*)\s+((?:<\s*\d+|\d+)\s*ms|\*)\s+((?:<\s*\d+|\d+)\s*ms|\*)(?:\s+(.+?))?\s*$/i);
      if(!match)return {error:'A numbered hop is malformed. Paste one Windows tracert run.'};
      const hop=Number(match[1]),probes=match.slice(2,5),endpoint=match[5]||'';
      if(hop<=Number(rows.at(-1)?.hop||0))return {error:'Paste one run with increasing numbered hops.'};
      const responding=probes.some(probe=>probe!=='*');
      const named=endpoint.match(/^(\S+)\s+\[([^\s\[\]]+)\]$/);
      const address=responding?(named?named[2]:endpoint):null;
      if(responding&&!(named?validHost(named[1])&&validAddress(address):validAddress(address)||validHost(address)))return {error:'Hop '+hop+' has an invalid address or hostname.'};
      if(!responding&&endpoint&&!/^Request timed out\.?$/i.test(endpoint))return {error:'Hop '+hop+' has an unrecognized timeout format.'};
      rows.push({hop,probes,address,endpoint:endpoint||'No reply'});
    }
    if(!rows.length)return {error:'No numbered Windows tracert rows with three probes were found.'};
    const readings=rows.flatMap(row=>row.probes.filter(x=>/^\d+\s*ms$/i.test(x)).map(x=>({hop:row.hop,address:row.address,ms:parseInt(x,10)})));
    const maximum=readings.length?Math.max(...readings.map(x=>x.ms)):null;
    const slowest=maximum===null?[]:[...new Set(readings.filter(x=>x.ms===maximum).map(x=>x.hop))];
    const last=rows.at(-1);
    if(reachability==='reached'&&(!last.address||last.unreachable))return {error:'The final hop does not confirm a reply from the destination. Choose not reached or not confirmed.'};
    const status=['reached','not-reached'].includes(reachability)?reachability:'unconfirmed';
    return {rows,lastHop:last.hop,reachability:status,maximum,slowest};
  }
  function download(name,text,type){
    const url=URL.createObjectURL(new Blob([text],{type}));
    const link=node('a','');
    link.href=url;link.download=name;link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  const sameLAN=ip=>ip.startsWith('192.0.2.');
  const node=(tag,text)=>{const element=document.createElement(tag);element.textContent=text;return element;};
  function boot(){
    const template=$('lab1-network-template'),panel=$('panel-tab-1');
    if(!template||!panel||$('lab1-network'))return;
    panel.prepend(template.content.cloneNode(true));
    let ip=original,mode='DHCP';
    const arp=new Map(),observations=new Map();
    const output=(id,text)=>{$(id).textContent=label+'\n'+text;};
    const config=full=>'Ethernet adapter Classroom sample\nIPv4 Address: '+ip+'\nSubnet Mask: 255.255.255.0\nDefault Gateway: '+gateway+(full?'\nPhysical Address: 02-00-00-00-02-0A\nDHCP Enabled: '+(mode==='DHCP'?'Yes':'No')+'\nDNS Servers: '+dns:'');
    function showArp(){
      const rows=[...arp].map(([address,mac])=>address+'     '+mac+'     dynamic');
      output('lab1-arp-output','Interface: '+ip+'\nInternet Address     Physical Address     Type\n'+(rows.join('\n')||'(cache empty)'));
    }
    function contact(address){
      if(!sameLAN(ip))return false;
      const nextHop=sameLAN(address)?address:gateway;
      if(macs[nextHop])arp.set(nextHop,macs[nextHop]);
      showArp();
      return true;
    }
    function ping(address){
      const reachable=contact(address);
      const remote=address===dns;
      const replies=reachable?Array.from({length:4},(_,index)=>remote&&index===2?'Request timed out.':'Reply from '+address+': bytes=32 time='+(remote?18+index:1)+'ms TTL='+(remote?54:64)):[...Array(4)].map(()=> 'Request timed out.');
      const received=reachable?(remote?3:4):0;
      output('lab1-ping-output','Pinging '+address+' with 32 bytes of data:\n'+replies.join('\n')+'\nPackets: Sent = 4, Received = '+received+', Lost = '+(4-received)+' ('+((4-received)*25)+'% loss)');
    }
    function trace(){
      const target=$('lab1-target').value,run=Number($('lab1-run').value),route=exampleRoute(target,run);
      const reached=contact(targets[target].address);
      const shown=reached?route:[{hop:1,address:null}];
      const rows=shown.map(row=>row.address?row.hop+'   '+row.rtt+' ms   '+(row.rtt+1)+' ms   '+row.rtt+' ms   '+row.address:row.hop+'   *   *   *   Request timed out.');
      output('lab1-trace-output','Run '+run+' to '+targets[target].name+' (fictional destination '+targets[target].address+')\n'+rows.join('\n')+'\n'+(reached?'Destination reached in the simulation.':'Gateway unreachable in the simulation.'));
      const topology=['Computer '+ip,...shown.map(row=>row.address?(row.hop===1?'Gateway ':row===shown.at(-1)?'Destination ':'Router ')+row.address:'No reply at hop '+row.hop)];
      $('lab1-topology').replaceChildren(...topology.map(text=>node('li',text)));
    }
    const commands={
      'ip-help':()=>output('lab1-ip-output','ipconfig     Show basic adapter settings\nipconfig /all     Show detailed adapter settings\nipconfig /renew     Request renewal of a DHCP lease'),
      'ip-basic':()=>output('lab1-ip-output',config(false)),
      'ip-all':()=>output('lab1-ip-output',config(true)),
      'ip-renew':()=>{
        if(mode==='DHCP')ip=original;
        output('lab1-ip-output',(mode==='DHCP'?'Sample lease renewed. The address stayed the same.':'This sample adapter uses a static address. Restore DHCP to renew.')+'\n'+config(true));
      },
      'ip-restore':()=>{ip=original;mode='DHCP';arp.clear();showArp();output('lab1-ip-output',config(true));$('lab1-ip-status').textContent='Restored the sample DHCP configuration.';},
      'ping-help':()=>output('lab1-ping-output','ping target     Send ICMP echo requests\nping -n count target     Set the number of probes'),
      'ping-gateway':()=>ping(gateway),
      'ping-dns':()=>ping(dns),
      'arp-help':()=>output('lab1-arp-output','arp -a     Display cached IPv4-to-MAC mappings\narp -d address     Remove an entry\nThis lab’s clear button empties only the sample cache.'),
      'arp-view':showArp,
      'arp-clear':()=>{arp.clear();showArp();},
      'arp-local':()=>{if(!contact(peer))output('lab1-arp-output','The simulated peer is unreachable from this configuration.');}
    };
    $('lab1-network').querySelectorAll('[data-lab1-command]').forEach(button=>button.addEventListener('click',()=>commands[button.dataset.lab1Command]()));
    $('lab1-ip-form').addEventListener('submit',event=>{
      event.preventDefault();
      const proposed=$('lab1-proposed-ip').value.trim(),status=$('lab1-ip-status');
      if(!validIPv4(proposed))status.textContent='Enter a valid dotted-decimal IPv4 address.';
      else if([gateway,peer,dns].includes(proposed)||[0,255].includes(Number(proposed.split('.').at(-1))))status.textContent='Rejected in the simulation. The address is assigned or reserved in the /24 example.';
      else {
        ip=proposed;mode='static';arp.clear();showArp();output('lab1-ip-output',config(true));
        status.textContent=sameLAN(ip)?'Applied to the sample adapter. Its gateway is still on the same subnet.':'Applied to the sample adapter. The original gateway is now outside its /24, so simulated connectivity fails.';
      }
    });
    $('lab1-trace-form').addEventListener('submit',event=>{event.preventDefault();trace();});
    function observationSummary(run){
      const rtt=run.maximum===null?'[MISSING: exact responding RTT]':run.maximum+' ms at hop '+run.slowest.join(', ');
      const topology=run.rows.map(row=>row.hop+' '+row.endpoint+(row.probes.length?' ('+row.probes.join(', ')+')':'')).join(' → ');
      const status={reached:'destination reached','not-reached':'destination not reached',unconfirmed:'destination not confirmed'};
      return [targets[run.target].name+' / '+run.run,run.lastHop+' ('+status[run.reachability]+')',rtt,topology];
    }
    const routeKey=record=>record.rows.map(row=>row.hop+' '+(row.address?.toLowerCase().replace(/\.$/,'')||'*')).join('|');
    const reportForm=$('lab1-report-form');
    $('lab1-export-observations').addEventListener('click',()=>{
      const runs=[...observations.values()].map(({target,...record})=>({...record,destination:targets[target].name}));
      download('lab-1-observations.json',JSON.stringify({
        source:'Student-provided observations and report fields',
        reportFields:Object.fromEntries(new FormData(reportForm)),runs
      },null,2),'application/json');
    });
    $('lab1-observation-form').addEventListener('submit',event=>{
      event.preventDefault();
      const target=$('lab1-target').value,run=Number($('lab1-run').value);
      if(!exampleRoute(target,run))return;
      const result=parseTrace($('lab1-actual-trace').value,$('lab1-reached').value);
      if(result.error){$('lab1-actual-status').textContent=result.error;return;}
      observations.set(target+':'+run,{...result,target,run});
      const table=$('lab1-actual-routes');
      table.replaceChildren(...[...observations.values()].map(record=>{
        const tr=document.createElement('tr');
        tr.append(...observationSummary(record).map(text=>node('td',text)));
        return tr;
      }));
      const runs=[...observations.values()].filter(record=>record.target===target);
      const distinct=new Set(runs.map(routeKey)).size;
      $('lab1-actual-status').textContent=runs.length+' actual runs for '+targets[target].name+'. '+distinct+' distinct recorded hop sequences. Unanswered hops and address formatting can affect this count.';
      $('lab1-actual-trace').value='';$('lab1-reached').value='unconfirmed';
    });
    function report(){
      const data=new FormData(reportForm);
      const field=(key,missing)=>String(data.get(key)||'').trim()||'[MISSING: '+missing+']';
      const routes=observations.size?[...observations.values()].map(record=>observationSummary(record).join(' | ')).join('\n'):'[MISSING: actual tracert runs and comparison]';
      const comparison=Object.entries(targets).map(([key,target])=>{
        const runs=[...observations.values()].filter(run=>run.target===key);
        return target.name+' — '+runs.length+'/5 actual runs, '+new Set(runs.map(routeKey)).size+' distinct recorded sequences.';
      }).join('\n');
      return [
        'Lab 1 — Identity and Security','Cover page',field('student','student and course'),field('instructor','instructor and date'),
        '\nDescription',field('description','your description'),'\nSystem configuration',field('computer','computer and OS'),field('connection','location, connection and ISP'),
        '\nProcedure and Notes','Lab 1.1 — IP configuration',field('ip','actual ipconfig observations'),'[Screenshot: actual IP configuration]',
        'Lab 1.2 A — Ping and Tracert',field('ping','actual ping observations'),'[Screenshot: actual ping and tracert]',
        'Lab 1.2 B — ARP',field('arp','actual ARP observations'),'[Screenshot: actual ARP output]',
        '\nActual traceroute observations',routes,'\nResults and Reports',comparison,
        '\nProblems and fixes',field('problems','problems and fixes'),'\nConclusions',field('conclusions','conclusions based on your observations'),
        '\nReferences and Acknowledgements',field('references','sources and people you list')
      ].join('\n');
    }
    reportForm.addEventListener('submit',event=>{event.preventDefault();$('lab1-report-output').textContent=report();});
    $('lab1-download-report').addEventListener('click',()=>download('lab-1-identity-security.txt',report(),'text/plain;charset=utf-8'));
    commands['ip-all']();commands['ping-help']();showArp();trace();
  }
  window.Lab1Network=Object.freeze({parseTrace,exampleRoute});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
