const fs=require('fs'),a=require('assert/strict'),vm=require('vm');let h=fs.readFileSync('index-conversation-backup.html','utf8');
const marker='      window.keanSpeak = speakSentryResponse;';h=h.replace(marker,fs.readFileSync('kean-conversation.js','utf8')+'\n'+marker);
h=h.replace("        const commandEntry = window.keanCommandRegistry?.resolve(cmd);",`        const exactLocalQuestion = /^(?:what is|define) [a-z0-9 -]{1,40}$/.test(cmd) && Object.keys(SECURITY_CONCEPTS).some(key=>cmd==='what is '+key||cmd==='define '+key);
        const conversational = /^(?:(?:please|can you|could you|would you)\\s+)?(?:what|whats|who|when|where|why|how|explain|define|tell|give|describe|compare|summarize|search|look up|find|help me understand)\\b/.test(cmd);
        const localControl = window.keanCommandRegistry?.resolve(cmd);
        if ((conversational || exactLocalQuestion) && (!localControl || !/^(?:Navigate|Action)$/.test(localControl.type) || /^(?:explain|define|tell|describe|compare|how|why)\\b/.test(cmd))) return answerKeanQuestion(rawCmd.trim());
        const commandEntry = localControl;`);
h=h.replace('return searchKeanWeb(rawCmd);','return answerKeanQuestion(rawCmd);');
// Preserve original transcript casing and every word after the wake phrase.
h=h.replace("String(result[0]?.transcript || '').trim().toLowerCase()","String(result[0]?.transcript || '').trim()");
for(const [,js] of h.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))new vm.Script(js);
fs.writeFileSync('index-cmdk.html',h);console.log('PASS JavaScript syntax');
