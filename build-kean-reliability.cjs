const fs=require('fs');
let html=fs.readFileSync('index-kean-reliability-backup.html','utf8');
const edits=[];
function once(before,after){if(html.split(before).length!==2)throw Error('Expected one match: '+before.slice(0,100));html=html.replace(before,after);edits.push({before,after});}
once('        recognitionInstance.interimResults = false;','        recognitionInstance.interimResults = true;');
const start=html.indexOf('        recognitionInstance.onstart = () => {');
const end=html.indexOf('        recognitionInstance.onerror = (e) => {',start);
if(start<0||end<0)throw Error('Missing recognition handlers');
once(html.slice(start,end),fs.readFileSync('kean-recognition-handler.js','utf8'));
once('        recognitionInstance.onerror = (e) => {','        recognitionInstance.onerror = (e) => {\n          clearRestartWatchdog();');
const endStart=html.indexOf('        recognitionInstance.onend = () => {');
const endEnd=html.indexOf('\n      }',endStart);
once(html.slice(endStart,endEnd),`        recognitionInstance.onend = () => {
          if (isWakeWordListening && toggleWakeWord?.checked) restartRecognition();
          else {clearRestartWatchdog();updateVoiceStatusPill('idle');}
        };`);
once('      window.keanSpeak = speakSentryResponse;',fs.readFileSync('kean-live-search.js','utf8')+'      window.keanSpeak = speakSentryResponse;');
once("        const cmd = rawCmd.trim().toLowerCase().replace(/[.,!?;:]/g, '');",`        const cmd = rawCmd.trim().toLowerCase().replace(/[.,!?;:]/g, '');
        cancelKeanWebSearch();
        const isOpenEndedQuestion = /^(what|whats|who|when|where|why|how|explain|define|tell me|give me|summarize|search|look up|find|latest|current|recent|news)\\b/.test(cmd);`);
once("        if (cmd.includes('go to') || cmd.includes('navigate to') || cmd.includes('switch to') || cmd.includes('open') || cmd.includes('show me')) {","        if (/^(go to|navigate to|switch to|open|show me)\\b/.test(cmd)) {");
once('          if (cmd.includes(key)) {',"          if (cmd.includes(key) && !/\\b(latest|recent|today|yesterday|this week|news)\\b/.test(cmd)) {");
const fallbackStart=html.indexOf("        // If explanation query didn't match local table, fallback to BYOK or honest message");
const fallbackEnd=html.indexOf('        // c. Action Commands',fallbackStart);
once(html.slice(fallbackStart,fallbackEnd),'        // Unanswered questions continue through local actions before the remote fallback.\n\n');
once("        if (cmd.includes('attack') || cmd.includes('vector')) {","        if (!isOpenEndedQuestion && (cmd.includes('attack') || cmd.includes('vector'))) {");
once('        // d. Default Fallback Response',`        // Only otherwise-unanswered questions reach the connected search provider.
        if (isOpenEndedQuestion || isExplanationQuery) {
          return searchKeanWeb(rawCmd);
        }

        // d. Default Fallback Response`);
fs.writeFileSync('index-cmdk.html',html);
fs.writeFileSync('kean-reliability-changes.json',JSON.stringify(edits,null,2));
console.log('Interim wake detection, restart watchdog, and grounded fallback installed.');
