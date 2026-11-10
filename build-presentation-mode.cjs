const fs=require('fs');
let html=fs.readFileSync('index-presentation-phase3.html','utf8');
const replacements=[];
function once(before,after){if(html.split(before).length!==2)throw Error('Expected one match: '+before.slice(0,80));html=html.replace(before,after);replacements.push({before,after});}
once("      function updateVoiceStatusPill(state, text) {",`      function updateVoiceStatusPill(state, text) {
        document.dispatchEvent(new CustomEvent('kean:voice-status', {detail:{state, text, micActive:isWakeWordListening}}));`);
once("      window.routeCommand = function routeCommand(rawCmd) {",`      window.keanSpeak = speakSentryResponse;
      window.routeCommand = function routeCommand(rawCmd) {`);
once("        // Both speech and the palette resolve the same exact command entry.",`        document.dispatchEvent(new CustomEvent('kean:command-start'));
        if (window.PresentationMode?.handleCommand(cmd)) return;

        // Both speech and the palette resolve the same exact command entry.`);
const replyHook=`          if (window.PresentationMode?.acceptsReply(transcript)) {
            if (window.speechSynthesis?.speaking) window.speechSynthesis.cancel();
            window.routeCommand(transcript);
            return;
          }
`;
once("\n          const wake = parseKeanWake(transcript);","\n"+replyHook+"          const wake = parseKeanWake(transcript);");
once("\n        const wake = parseKeanWake(transcript);","\n"+replyHook.replace(/^  /gm,'')+"        const wake = parseKeanWake(transcript);");
once("    catalog:()=>entries.map(({run,...entry})=>entry),","    register:add,\n    catalog:()=>entries.map(({run,...entry})=>entry),");
once("      if(label)say(label,'action');","      if(label&&!window.PresentationMode?.pendingFor(element))say(label,'action');");
const start=html.indexOf("          const userConfirmed = confirm(");
const end=html.indexOf('\n        }\n      });',start);
if(start<0||end<0)throw Error('Cannot locate simulated approval handler');
const old=html.slice(start,end);
let callback=old.replace(/^          const userConfirmed = confirm\([^\n]+\);\r?\n/,'');
callback=callback.replace("permOutput.innerHTML = '<span style=\"color: #10b981; font-weight: 700;\">[AUTHORIZED]</span> Tier 2 Action approved and executed safely with verified human consent.';",`permOutput.innerHTML = source === 'countdown'
              ? '<span style="color: #10b981; font-weight: 700;">[AUTO-CONFIRMED DEMO]</span> Tier 2 simulation executed after the visible Presentation Mode countdown.'
              : '<span style="color: #10b981; font-weight: 700;">[AUTHORIZED]</span> Tier 2 Action approved and executed safely with verified human consent.';`);
callback=callback.replace("'Tier 2 action approved by human operator: rotate_session_credentials()'","source === 'countdown' ? 'Tier 2 simulation auto-confirmed by presentation countdown' : 'Tier 2 action approved by human operator: rotate_session_credentials()'");
const updated=`          window.PresentationMode.request({
            title: 'Rotate simulated session credentials',
            description: 'The agent proposes the local Tier 2 credential-rotation demonstration. This updates the simulated permission result; it does not change real credentials.',
            control: tier2Btn,
            onResolve(userConfirmed, source) {
${callback}
              window.keanSpeak?.(userConfirmed ? (source === 'countdown' ? 'Tier two simulation auto-confirmed.' : 'Tier two simulation approved.') : 'Tier two simulation denied.');
            }
          });`;
once(old,updated);
html=html.replace('</body>',fs.readFileSync('presentation-mode.html','utf8')+'\n</body>');
fs.writeFileSync('index-cmdk.html',html);
fs.writeFileSync('presentation-mode-changes.json',JSON.stringify(replacements,null,2));
console.log('Presentation Mode installed.');
