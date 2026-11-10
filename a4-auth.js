(()=>{
 'use strict';
 const $=id=>document.getElementById(id);
 const users=[
 {name:'student',role:'user',enabled:true,salt:'5ee61caea51a8cd0a2db703466f0fca6',hash:'d78713a780d06a0b26ad906ef0782e73550ec0606993355d15fa264fce2b415e'},
 {name:'administrator',role:'admin',enabled:true,salt:'a1692e604620261fcacd66696da2768a',hash:'6f2e6136d9ec64a987443e6c6e0be7d70f0b774632bbfef061313ae594a3cfb4'}
 ];
 const permissions=Object.freeze({user:Object.freeze(['profile.view','profile.edit']),admin:Object.freeze(['profile.view','profile.edit','users.manage','logs.view','content.manage'])});
 let session=null,failures=0,lockedUntil=0,pending=false;
 const audit=[];
 const credentials=$('sim-login-note').cloneNode(true);
 function record(source,message,type='info') {audit.push({timestamp:new Date().toISOString(),source,message});window.SecurityState?.logEvent(source,message,type);}
 function status(text){let el=$('a4-login-status');if(!el){el=document.createElement('p');el.id='a4-login-status';el.setAttribute('role','status');$('sim-login-form').append(el);}el.textContent=text;}
 const bytes=hex=>Uint8Array.from(hex.match(/../g),h=>parseInt(h,16));
 function equal(a,b){let difference=a.length^b.length;for(let i=0;i<Math.max(a.length,b.length);i++)difference|=(a[i]||0)^(b[i]||0);return difference===0;}
 async function authenticate(name,password){
  if(pending){record('AUTH','Login attempt rejected while credential verification is in progress.','warn');return null;}
  if(Date.now()<lockedUntil){record('AUTH','Login attempt denied during 30-second lockout.','warn');status('Sign-in unavailable. Wait '+Math.ceil((lockedUntil-Date.now())/1000)+' seconds and retry.');return null;}
  if(lockedUntil){failures=0;lockedUntil=0;}
  if(!window.crypto?.subtle){record('AUTH','Login unavailable: WebCrypto is not available.','error');status('Credential verification requires WebCrypto. Open the file in a supported browser or use localhost.');return null;}
  pending=true;$('btn-sim-login-submit').disabled=true;status('Checking credentials…');
  try{
   const account=users.find(u=>u.name===name),reference=account||users[0];
   const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
   const result=new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:bytes(reference.salt),iterations:120000,hash:'SHA-256'},key,256));
   if(!account||!account.enabled||!equal(result,bytes(reference.hash))){failures++;if(failures>=3)lockedUntil=Date.now()+30000;record('AUTH','Login attempt failed: invalid or unavailable credentials'+(lockedUntil?'; 30-second lockout started.':'.'),'warn');status('Unable to sign in with those credentials.'+(lockedUntil?' Try again in 30 seconds.':''));return null;}
   failures=0;record('AUTH','Login succeeded for demo account '+account.name+'.','success');status('Signed in.');return {name:account.name,role:account.role};
  }catch(error){record('AUTH','Credential verification failed: '+error.name,'error');status('Unable to verify credentials. Retry in a supported browser.');return null;}
  finally{pending=false;$('btn-sim-login-submit').disabled=false;$('sim-login-password').value='';}
 }
 function authorize(action){
  const account=users.find(u=>u.name===session?.username);
  const authenticated=Boolean(session&&session.token===window.currentSessionToken&&Date.now()<session.expiresAt);
  if(account&&session)session.role=account.role;
  const allowed=Boolean(authenticated&&account?.enabled&&permissions[account.role]?.includes(action));
  record('AUTHORIZATION',(allowed?'Allowed':'Denied')+' '+action+'; authenticated='+(authenticated?'yes':'no')+'; authorized='+(allowed?'yes':'no')+'.',allowed?'info':'warn');
  return allowed;
 }
 window.authorize=authorize;
 window.A4Auth={users,permissions,audit,authenticate,authorize,setSession(value){session=value;},get session(){return session;},get lockoutRemaining(){return Math.max(0,lockedUntil-Date.now());}};
 document.addEventListener('kean:session-end',()=>{session=null;window.currentSessionToken=null;queueMicrotask(()=>{const note=$('sim-login-note');if(note)note.replaceWith(credentials.cloneNode(true));});});
})();
