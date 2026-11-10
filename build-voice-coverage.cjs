const fs=require('fs');
let html=fs.readFileSync('index-presentation-phase2.html','utf8');
function replaceOnce(before,after){if(html.split(before).length!==2)throw Error('Expected one replacement: '+before.slice(0,90));html=html.replace(before,after);}
replaceOnce('        function updateCourseworkPillActive(targetId) {',`        // Both speech and the palette resolve the same exact command entry.
        const commandEntry = window.keanCommandRegistry?.resolve(cmd);
        if (commandEntry) {
          commandEntry.run(speakSentryResponse);
          return;
        }

        function updateCourseworkPillActive(targetId) {`);
replaceOnce("  const commands = [","  const baseCommands = [");
replaceOnce("filtered=commands.filter(c=>matches", "const commands=[...baseCommands,...(window.keanCommandRegistry?.catalog()||[])].map((c,id)=>({...c,id}));filtered=commands.filter(c=>matches");
replaceOnce("list.replaceChildren();filtered.forEach", "const exact=window.keanCommandRegistry?.resolve(input.value.trim());if(exact)filtered.sort((a,b)=>Number(b.command===exact.command)-Number(a.command===exact.command));if(input.value.trim()&&!filtered.some(c=>c.command.toLowerCase()===input.value.trim().toLowerCase()))filtered.push({id:'typed',name:'Run: '+input.value.trim(),command:input.value.trim(),type:'Command'});list.replaceChildren();filtered.forEach");
replaceOnce("+(c.type==='Action'?' — result in AuthGuard.':'')", "");
replaceOnce("row.dataset.commandId=String(c.id);", "row.dataset.commandId=String(c.id);row.title='Say: Kean, '+c.command;");
html=html.replace('</body>',fs.readFileSync('voice-command-coverage.html','utf8')+'\n</body>');
fs.writeFileSync('index-cmdk.html',html);
console.log('Shared voice registry and palette coverage installed.');
