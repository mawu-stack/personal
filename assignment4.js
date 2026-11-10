(()=>{
  'use strict';
  const $=id=>document.getElementById(id);
  const permissions={user:['profile.view','profile.edit'],admin:['users.manage','logs.view','content.manage']};
  let identity=null,profile={name:'Demo Student',focus:'Web security'},users=[],photoURL=null,photoVersion=0,generated=false,steps=new Set(),busy=false;
  const resetUsers=()=>[{name:'demo.student',role:'user',enabled:true},{name:'demo.editor',role:'admin',enabled:true},{name:'demo.guest',role:'user',enabled:false}];
  const roleName=role=>role==='admin'?'ADMINISTRATOR':'REGULAR USER';
  const valid=()=>Boolean(identity&&window.currentSessionToken===identity.token&&Date.now()<identity.expiresAt&&getComputedStyle($('simulated-login-overlay')).display==='none');
  function progress(id,count){[...$(id).children].forEach((e,i)=>e.classList.toggle('done',i<count));}
  function personProgress(){[...$('a4-person-flow').children].forEach((e,i)=>e.classList.toggle('done',steps.has(i)));}
  function hidePanels(){for(const id of ['profile','users','logs','content'])$('a4-'+id).hidden=true;}
  function check(permission){
    const authenticated=valid(),allowed=authenticated&&permissions[identity.role]?.includes(permission);
    const reason=!authenticated?'Active simulated session required.':allowed?'Permission '+permission+' belongs to '+roleName(identity.role)+'.':permission.startsWith('profile.')?'REGULAR USER PROFILE PERMISSION REQUIRED.':'ADMINISTRATOR PRIVILEGES REQUIRED.';
    $('a4-decision').textContent=(allowed?'ACCESS GRANTED — ':'ACCESS DENIED — ')+reason;
    progress('a4-access-flow',authenticated?5:1);
    $('a4-access-flow').lastElementChild.textContent=allowed?'ALLOW':'DENY';
    window.SecurityState.logEvent('RBAC',(allowed?'ACCESS GRANTED':'ACCESS DENIED')+' | '+permission+' | '+reason,allowed?'success':'warn');
    return Boolean(allowed);
  }
  function showProfile(){ $('a4-profile-summary').textContent=profile.name+' · '+profile.focus;$('a4-profile-name').value=profile.name;$('a4-profile-focus').value=profile.focus; }
  function renderUsers(){
    $('a4-user-list').replaceChildren();
    users.forEach((u,i)=>{const row=document.createElement('tr');for(const value of [u.name,roleName(u.role),u.enabled?'Enabled':'Disabled']){const td=document.createElement('td');td.textContent=value;row.append(td);}const actions=document.createElement('td');
      for(const [label,operation] of [['View',()=>{$('a4-user-detail').textContent=u.name+' · '+roleName(u.role)+' · '+(u.enabled?'Enabled':'Disabled');}],['Change demo role',()=>{u.role=u.role==='user'?'admin':'user';renderUsers();}],[(u.enabled?'Disable':'Enable')+' demo account',()=>{u.enabled=!u.enabled;renderUsers();}]]){const button=document.createElement('button');button.type='button';button.textContent=label;button.className='stride-action-btn';button.addEventListener('click',()=>{if(check('users.manage')){operation();window.SecurityState.logEvent('RBAC','SIMULATION: '+label+' for demo account '+(i+1),'info');}});actions.append(button);}row.append(actions);$('a4-user-list').append(row);});
  }
  function renderLogs(){ $('a4-log-output').textContent=window.SecurityState.activityLog.slice(0,20).map(e=>'['+e.timestamp+'] '+e.source+' · '+e.message).join('\n'); }
  function resetPhoto(){photoVersion++;if(photoURL)URL.revokeObjectURL(photoURL);photoURL=null;generated=false;steps.clear();$('a4-photo').removeAttribute('src');$('a4-photo').hidden=true;$('a4-photo-placeholder').hidden=false;$('a4-avatar').classList.remove('generated');$('a4-photo-file').value='';$('a4-photo-status').textContent='No photo selected.';$('a4-generation-status').textContent='No external avatar-generation service connected.';$('a4-generate').disabled=true;$('a4-talk').disabled=true;personProgress();}
  async function photo(file){
    resetPhoto();const version=photoVersion;if(!file)return false;
    const fail=message=>{if(version===photoVersion)$('a4-photo-status').textContent=message;return false;};
    if(!valid())return fail('Sign in to select a demo photo.');
    if(!['image/png','image/jpeg','image/webp'].includes(file.type))return fail('Unsupported type. Choose PNG, JPEG or WEBP.');
    if(file.size>5*1024*1024||!file.size)return fail('Choose a nonempty image no larger than 5 MB.');
    const bytes=new Uint8Array(await file.slice(0,12).arrayBuffer());
    const signature=file.type==='image/png'?bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71:file.type==='image/jpeg'?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP';
    if(!signature)return fail('The image contents do not match its declared type.');
    const url=URL.createObjectURL(file),preview=new Image();preview.src=url;
    try{await preview.decode();}catch(_){URL.revokeObjectURL(url);return fail('This image cannot be decoded. Choose another photo.');}
    if(version!==photoVersion||!valid()){URL.revokeObjectURL(url);return false;}
    if(preview.naturalWidth>4096||preview.naturalHeight>4096){URL.revokeObjectURL(url);return fail('Use an image no larger than 4096 × 4096 pixels.');}
    photoURL=url;$('a4-photo').src=url;$('a4-photo').hidden=false;$('a4-photo-placeholder').hidden=true;$('a4-photo-status').textContent='Local preview ready · '+preview.naturalWidth+' × '+preview.naturalHeight;$('a4-generate').disabled=false;steps.add(0);personProgress();return true;
  }
  function avatarState(state){$('a4-avatar').dataset.state=state;$('a4-avatar-state').textContent=state.toUpperCase();}
  function expire(){identity=null;hidePanels();resetPhoto();busy=false;avatarState('idle');$('a4-role').textContent='NOT AUTHENTICATED';$('a4-role-nav').textContent='SIGNED OUT';$('a4-answer').textContent='Session ended. Sign in to continue.';$('a4-answer-source').textContent='SESSION ENDED';$('a4-question').value='';progress('a4-access-flow',0);}
  function boot(){
    const nav=document.createElement('span');nav.id='a4-role-nav';nav.className='a4-role-nav';nav.textContent='SIGNED OUT';$('session-status-pill').append(nav);
    const shortcut=document.createElement('button');shortcut.type='button';shortcut.className='stride-action-btn';shortcut.textContent='A4 Lab';shortcut.setAttribute('aria-label','Open Assignment 4 lab');shortcut.id='a4-open';shortcut.addEventListener('click',()=>{window.switchTab('tab-3');$('assignment4').scrollIntoView({behavior:'auto'});});document.querySelector('.nav-controls').append(shortcut);
    $('a4-check').addEventListener('click',()=>{hidePanels();const action=$('a4-action').value;if(!check(action))return;if(action.startsWith('profile.')){$('a4-profile').hidden=false;showProfile();}if(action==='users.manage'){$('a4-users').hidden=false;renderUsers();}if(action==='logs.view'){$('a4-logs').hidden=false;renderLogs();}if(action==='content.manage')$('a4-content').hidden=false;});
    $('a4-profile-save').addEventListener('click',()=>{if(!check('profile.edit'))return;const name=$('a4-profile-name').value.trim();if(!name||name.length>40){$('a4-decision').textContent='Enter a demo display name of 1–40 characters.';return;}profile={name,focus:$('a4-profile-focus').value};showProfile();window.SecurityState.logEvent('RBAC','Demo profile updated in memory.','success');});
    $('a4-log-refresh').addEventListener('click',()=>{if(check('logs.view'))renderLogs();});
    $('a4-content-save').addEventListener('click',()=>{if(!check('content.manage'))return;$('a4-content-preview').textContent=$('a4-content-text').value.slice(0,180);window.SecurityState.logEvent('RBAC','SIMULATION: announcement preview updated; source and coursework unchanged.','success');});
    $('a4-end-session').addEventListener('click',()=>window.handleSessionExpired());
    $('a4-photo-file').addEventListener('change',e=>photo(e.target.files[0]).catch(()=>{$('a4-photo-status').textContent='Could not read this image.';}));
    $('a4-clear').addEventListener('click',resetPhoto);
    $('a4-generate').addEventListener('click',()=>{if(!valid()||!photoURL)return;generated=true;$('a4-avatar').classList.add('generated');$('a4-talk').disabled=false;$('a4-generation-status').textContent='DEMO AVATAR ready · local visual presentation only.';steps.add(1);personProgress();});
    $('a4-talk').addEventListener('click',()=>{if(!valid()||!generated)return;steps.add(2);personProgress();$('kean-global-voice').click();});
    $('a4-question-form').addEventListener('submit',e=>{e.preventDefault();if(!valid()){$('a4-answer').textContent='Sign in before asking K.E.A.N.';return;}const question=$('a4-question').value.trim();if(!question)return;steps.add(3);personProgress();window.routeCommand(question);});
    document.addEventListener('kean:session-start',e=>{identity={...e.detail};profile={name:'Demo Student',focus:'Web security'};users=resetUsers();hidePanels();resetPhoto();$('a4-role').textContent='AUTHENTICATED · '+roleName(identity.role);nav.textContent=roleName(identity.role);$('a4-decision').textContent='Identity established. Select an action to check authorization.';progress('a4-access-flow',3);$('a4-access-flow').lastElementChild.textContent='ALLOW / DENY';$('a4-content-text').value='Welcome to the security lab.';$('a4-content-preview').textContent='Welcome to the security lab.';});
    document.addEventListener('kean:session-end',expire);
    document.addEventListener('kean:voice-status',e=>{if(!valid())return;const state=e.detail.state;avatarState(state==='speaking'?'speaking':busy?'thinking':['listening','awaiting'].includes(state)?'listening':state==='processing'?'thinking':'idle');if(['listening','awaiting'].includes(state)&&generated){steps.add(2);personProgress();}});
    document.addEventListener('kean:command-start',()=>{if(!valid())return;busy=true;steps.add(3);steps.delete(4);personProgress();avatarState('thinking');$('a4-chat-flow').textContent='QUESTION RECEIVED → PROCESSING';});
    document.addEventListener('kean:utterance',e=>{if(!valid())return;$('a4-answer').textContent=e.detail.text;$('a4-answer-source').textContent='LOCAL COMMAND RESPONSE';busy=false;steps.add(4);personProgress();$('a4-chat-flow').textContent='QUESTION → RESPONSE';});
    document.addEventListener('kean:answer',e=>{if(!valid())return;const {text,kind}=e.detail;busy=kind==='pending';$('a4-answer').textContent=text;$('a4-answer-source').textContent=kind==='live'?'LIVE AI RESPONSE':kind==='search'?'LIVE AI RESPONSE · WEB SEARCH':kind==='pending'?'AI REQUEST IN PROGRESS':'LOCAL FALLBACK RESPONSE';$('a4-chat-flow').textContent=busy?'QUESTION → AI PROCESSING':'QUESTION → RESPONSE RECEIVED';if(busy)steps.delete(4);else steps.add(4);personProgress();});
    window.addEventListener('pagehide',resetPhoto);
    window.Assignment4={check,valid,selectPhoto:photo,get role(){return valid()?identity.role:null;},get generated(){return generated;}};
    window.keanCommandRegistry?.register('Open Assignment 4',['open assignment 4','open assignment four'],say=>{shortcut.click();say('Opened Assignment 4.');},'Navigate',shortcut);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
