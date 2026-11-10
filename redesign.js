/* Presentation only: all original cryptographic and simulation modules are retained. */
(() => {
  'use strict';
  const boot = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const emblem = document.getElementById('hero-glass-viewport');
    const emblemSlot = document.getElementById('wb-emblem-slot');
    if (emblem && emblemSlot) emblemSlot.appendChild(emblem);
    document.querySelectorAll('.modal-content,.activity-dock-body,.ai-chat-messages').forEach(el => el.setAttribute('data-lenis-prevent',''));
    let lenis;
    let waves;
    let motionFrame;
    let gsapTick;
    const startMotion = () => {
      if (reduced.matches) return;
      if (window.Lenis && !lenis) {
        lenis = new Lenis({duration:1.2,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),smoothWheel:true,wheelMultiplier:.95});
        if (window.gsap && window.ScrollTrigger) {
          gsap.registerPlugin(ScrollTrigger);
          lenis.on('scroll',ScrollTrigger.update);
          gsapTick = time => lenis.raf(time*1000);
          gsap.ticker.add(gsapTick);
        } else {
          const raf = time => {lenis.raf(time);motionFrame=requestAnimationFrame(raf);};
          motionFrame=requestAnimationFrame(raf);
        }
      }
      if (window.VANTA && window.THREE && !waves) {
        try {waves=VANTA.WAVES({el:'#vanta-bg-canvas',THREE:window.THREE,mouseControls:false,touchControls:false,gyroControls:false,color:0x07111e,shininess:35,waveHeight:14,waveSpeed:.65,zoom:.85,minHeight:200,minWidth:200,scale:1.5,scaleMobile:2});} catch(error) {console.info('Ambient waves unavailable; static background retained.');}
      }
    };
    const stopMotion = () => {
      if (gsapTick && window.gsap) gsap.ticker.remove(gsapTick);
      cancelAnimationFrame(motionFrame);
      if (lenis) {lenis.destroy();lenis=null;}
      if (waves) {waves.destroy();waves=null;}
    };
    startMotion();
    reduced.addEventListener('change',()=>{stopMotion();startMotion();});
    window.addEventListener('pagehide',stopMotion);
    window.addEventListener('pageshow',event=>{if(event.persisted) startMotion();});

    const nav=document.querySelector('.wb-tabs');
    const indicator=nav.querySelector('.wb-tab-indicator');
    const buttons=Array.from(nav.querySelectorAll('[role="tab"]'));
    function syncIndicator() {
      const active=nav.querySelector('.tab-btn.active');
      document.body.classList.toggle('wb-in-lab',Boolean(active));
      nav.setAttribute('aria-orientation',innerWidth<=700?'vertical':'horizontal');
      indicator.style.opacity=active?'1':'0';
      if(active){indicator.style.width=active.offsetWidth+'px';indicator.style.transform='translateX('+active.offsetLeft+'px)';}
      buttons.forEach(button=>button.tabIndex=button===active?0:-1);
      if(!active) buttons[0].tabIndex=0;
    }
    new ResizeObserver(syncIndicator).observe(nav);
    nav.addEventListener('keydown',event=>{
      const index=buttons.indexOf(document.activeElement);
      if(index<0) return;
      let next=index;
      if(event.key==='ArrowRight' || (innerWidth<=700 && event.key==='ArrowDown')) next=(index+1)%buttons.length;
      else if(event.key==='ArrowLeft' || (innerWidth<=700 && event.key==='ArrowUp')) next=(index+buttons.length-1)%buttons.length;
      else if(event.key==='Home') next=0;
      else if(event.key==='End') next=buttons.length-1;
      else return;
      event.preventDefault();buttons[next].focus();buttons[next].click();
    });
    const scrambleFrames=new WeakMap();
    function scrambleHeading(panel) {
      const heading=panel && panel.querySelector('h2');
      if(!heading || heading.children.length || reduced.matches) return;
      cancelAnimationFrame(scrambleFrames.get(heading));
      const title=heading.dataset.wbTitle || heading.textContent;
      heading.dataset.wbTitle=title;heading.setAttribute('aria-label',title);
      const start=performance.now();
      const tick=now=>{
        const progress=Math.min((now-start)/500,1);
        heading.textContent=Array.from(title,(char,i)=>i<title.length*progress || /\s/.test(char)?char:'#X01&'[Math.floor(Math.random()*5)]).join('');
        if(progress<1) scrambleFrames.set(heading,requestAnimationFrame(tick));
      };
      scrambleFrames.set(heading,requestAnimationFrame(tick));
    }
    const route=window.switchTab;
    window.switchTab=function(tabId,scrollTarget=null){
      route(tabId,scrollTarget);
      syncIndicator();
      const active=document.querySelector('.tab-panel.active');
      if(active && active.id!=='panel-tab-5') scrambleHeading(active);
      if(!scrollTarget && lenis) lenis.scrollTo(0,{immediate:reduced.matches});
      if(window.ScrollTrigger) ScrollTrigger.refresh();
      requestAnimationFrame(()=>{syncIndicator();if(lenis)lenis.resize();});
    };
    syncIndicator();

    // A single dock controller avoids the original overlapping click handlers.
    const dock=document.getElementById('activity-log-dock');
    const toggle=document.getElementById('btn-toggle-activity-dock');
    function syncDock(){
      const collapsed=dock.classList.contains('collapsed');
      toggle.setAttribute('aria-expanded',String(!collapsed));
      toggle.setAttribute('aria-controls','activity-dock-body');
      toggle.setAttribute('aria-label',collapsed?'Expand live telemetry':'Collapse live telemetry');
      document.getElementById('dock-toggle-icon').textContent=collapsed?'▲':'▼';
      document.getElementById('dock-toggle-prompt').textContent=collapsed?'Click to Expand ▲':'Click to Collapse ▼';
    }
    dock.querySelector('.activity-dock-header').addEventListener('click',event=>{
      if(event.target.closest('.dock-filter-group') || (event.target.closest('button') && !event.target.closest('#btn-toggle-activity-dock')))return;
      dock.classList.toggle('collapsed');syncDock();
    });
    syncDock();

    // React Bits-style spotlight interaction without adding a second UI runtime.
    document.querySelectorAll('.portfolio-card,.saas-card,.panel-card,.stride-bento-card,.tier-card,.wb-stage').forEach(card=>{
      card.classList.add('wb-spotlight');
      card.addEventListener('pointermove',event=>{
        if(reduced.matches || event.pointerType==='touch')return;
        const rect=card.getBoundingClientRect();card.style.setProperty('--mouse-x',(event.clientX-rect.left)+'px');card.style.setProperty('--mouse-y',(event.clientY-rect.top)+'px');
      },{passive:true});
    });

    // Radar reflects the existing simulation toggles; it is not a security audit.
    const letters=['s','t','r','i','d','e'];
    const relations=[['rateLimit','pbkdf2'],['paramSql'],[],['domSafe','pbkdf2'],['rateLimit','waf'],['waf']];
    const labels=['Identity defenses','Prepared queries','Audit logging (not modeled)','Safe DOM + hashing','Ingress defenses','WAF proxy (not RBAC)'];
    function updateRadar(){
      const defense=window.SecurityState.defenses;
      const values=relations.map(keys=>keys.length?keys.filter(key=>defense[key]).length/keys.length:0);
      const points=values.map((value,index)=>{const angle=-Math.PI/2+index*Math.PI/3;const radius=18+value*72;return (150+Math.cos(angle)*radius).toFixed(1)+','+(130+Math.sin(angle)*radius).toFixed(1);});
      document.getElementById('wb-radar-polygon').setAttribute('points',points.join(' '));
      document.getElementById('wb-defense-count').textContent=Object.values(defense).filter(Boolean).length+'/5';
      document.getElementById('wb-radar-description').textContent='Simulation control coverage. '+letters.map((letter,i)=>letter.toUpperCase()+': '+labels[i]+' '+Math.round(values[i]*100)+'%').join('; ');
      letters.forEach((letter,index)=>{
        const pill=document.getElementById('stride-status-'+letter);
        if(!pill)return;
        const active=values[index]===1;
        pill.classList.toggle('mitigated',active);pill.classList.toggle('exposed',!active);
        const text=pill.querySelector('.status-text') || pill;
        text.textContent=index===2?'Not modeled · audit trail required':index===5?(active?'WAF active · RBAC still required':'Exposed · RBAC required'):(active?'Mitigated in simulation':values[index]>0?'Partial coverage':'Exposed in simulation');
      });
    }
    document.addEventListener('change',event=>{if(event.target.closest('#panel-tab-2'))requestAnimationFrame(updateRadar);});
    new MutationObserver(updateRadar).observe(document.getElementById('sentry-defense-summary-badge'),{childList:true,subtree:true});
    updateRadar();

    // Spring interpolation guides the existing emblem toward the brand slot.
    const brand=document.querySelector('.brand-monogram');
    let morphFrame=0,x=0,y=0,scale=1;
    function morph(){
      morphFrame=0;
      if(!emblem || reduced.matches || innerWidth<701){if(emblem)emblem.style.transform='';return;}
      const rect=emblemSlot.getBoundingClientRect(),target=brand.getBoundingClientRect();
      const p=Math.min(window.scrollY/500,1);
      const tx=(target.left+target.width/2-rect.left-rect.width/2)*p;
      const ty=(target.top+target.height/2-rect.top-rect.height/2)*p;
      const ts=1-.45*p;
      x+=(tx-x)*.12;y+=(ty-y)*.12;scale+=(ts-scale)*.12;
      emblem.style.transform='translate('+x+'px,'+y+'px) scale('+scale+')';
      emblem.style.opacity=String(1-p*.9);
      if(Math.abs(tx-x)+Math.abs(ty-y)+Math.abs(ts-scale)>.1)morphFrame=requestAnimationFrame(morph);
    }
    const requestMorph=()=>{if(!morphFrame)morphFrame=requestAnimationFrame(morph);};
    window.addEventListener('scroll',requestMorph,{passive:true});window.addEventListener('resize',requestMorph,{passive:true});
    reduced.addEventListener('change',requestMorph);
    function syncTheme(){const light=!document.body.classList.contains('dark-mode');if(document.body.classList.contains('wb-light')!==light)document.body.classList.toggle('wb-light',light);}
    new MutationObserver(syncTheme).observe(document.body,{attributes:true,attributeFilter:['class']});
    // Honor explicit theme choices; start this visual redesign in dark mode.
    if(typeof applyTheme==='function')applyTheme('dark');
    else document.getElementById('theme-btn-dark')?.click();
    syncTheme();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
