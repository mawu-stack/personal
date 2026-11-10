import fs from 'node:fs';

export function addAssignment8(source) {
  let html=source;
  function replace(before,after) {
    if(!html.includes(before))throw Error('Assignment 8 integration point missing: '+before.slice(0,90));
    html=html.replace(before,()=>after);
  }
  replace('  <link rel="stylesheet" href="gateway.css">','  <link rel="stylesheet" href="gateway.css">\n  <link rel="stylesheet" href="assignment8.css">');
  const nav=html.match(/<button type="button" class="tab-btn" role="tab" id="tab-btn-9"[^\n]*<\/button>/)[0];
  replace(nav,nav+'\n<button type="button" class="tab-btn" role="tab" id="tab-btn-10" data-tab="tab-10" aria-controls="panel-tab-10"><span class="wb-tab-num">10</span><span><span class="wb-tab-name">Security Monitor</span><span class="wb-tab-desc">ASSIGNMENT 8</span></span></button>');
  replace('</main>',fs.readFileSync(new URL('./assignment8-panel.html',import.meta.url),'utf8')+'\n</main>');
  replace('<script src="platform.js"></script>','<script src="platform.js"></script>\n<script src="assignment8.js"></script>\n<script src="assignment8-education.js"></script>\n<script src="assignment8-monitor.js"></script>\n<script src="assignment8-evidence.js"></script>');
  replace("'tab-7', 'tab-8', 'tab-9'];","'tab-7', 'tab-8', 'tab-9', 'tab-10'];");
  replace("'#tab-9':'tab-9',","'#tab-10':'tab-10', '#tab10':'tab-10', '#tab-9':'tab-9',");
  replace('/^#tab-?[1-9]$/','/^#tab-?(?:[1-9]|10)$/');
  replace("user:Object.freeze(['profile.view','profile.edit']),admin:Object.freeze(['profile.view','profile.edit','users.manage','logs.view','content.manage'])","user:Object.freeze(['profile.view','profile.edit','site.control','monitor.replay']),admin:Object.freeze(['profile.view','profile.edit','users.manage','logs.view','content.manage','site.control','monitor.replay','monitor.block'])");
  replace('window.routeCommand = function routeCommand(rawCmd) {','window.routeCommand = function routeCommand(rawCmd, options = {}) {');
  replace('        cancelKeanWebSearch();\n        const isOpenEndedQuestion', '        cancelKeanWebSearch();\n        if (window.Assignment8?.shouldHandle(rawCmd, options.scope)) {\n          if (window.PresentationMode?.acceptsReply(rawCmd) && window.PresentationMode.handleCommand(cmd)) return;\n          return window.Assignment8.run(rawCmd, options);\n        }\n        const isOpenEndedQuestion');
  const start=html.indexOf('      function setupVoiceRecognition()');
  const end=html.indexOf('      if (toggleWakeWord) {',start);
  if(start<0||end<0)throw Error('Voice integration point missing');
  html=html.slice(0,start)+html.slice(start,end).replace(/window\.routeCommand\((transcript|command|cmdPart)\);/g,'window.routeCommand($1, {source: "voice"});')+html.slice(end);
  replace('async function answerKeanQuestion(question) {','async function answerKeanQuestion(question, assignment8Prompt) {');
  replace('function speakSentryResponse(text, category) {','function speakSentryResponse(text, category, options = {}) {');
  replace('            window.speechSynthesis.cancel();\n            if (typeof SpeechSynthesisUtterance', '            if (!options.queue) window.speechSynthesis.cancel();\n            if (typeof SpeechSynthesisUtterance');
  replace("const search=/\\b(latest|today|yesterday|current|recent|news|search|look up)\\b/i.test(question);","const search=!assignment8Prompt&&/\\b(latest|today|yesterday|current|recent|news|search|look up)\\b/i.test(question);");
  replace("if(!state?.aiApiKey){fallback('No AI is connected.');return;}","if(assignment8Prompt&&(!state?.aiApiKey||!['gemini','claude'].includes(state.aiProvider)))throw Error('No supported AI provider is connected.');\n        if(!state?.aiApiKey){fallback('No AI is connected.');return;}");
  replace("say('Good question. Let me pull that up.','pending');","if(!assignment8Prompt)say('Good question. Let me pull that up.','pending');");
  replace("        try{\n          const timeout=new Promise((_,reject)=>{job.timer=setTimeout", "        if(assignment8Prompt){\n          if(provider==='claude')body.system=assignment8Prompt;\n          else body.systemInstruction={parts:[{text:assignment8Prompt}]};\n        }\n        try{\n          const timeout=new Promise((_,reject)=>{job.timer=setTimeout");
  replace("          const toolError=data.content?.find", "          if(assignment8Prompt)return text;\n          const toolError=data.content?.find");
  replace("          state.logEvent(source,error.message,'warn');\n          fallback","          if(assignment8Prompt)throw Error(providerName+' did not return a usable response.');\n          state.logEvent(source,error.message,'warn');\n          fallback");
  replace('      window.keanSpeak = speakSentryResponse;', '      window.keanSpeak = speakSentryResponse;\n      window.keanA8Concepts = Object.freeze({...SECURITY_CONCEPTS});\n      window.keanA8Provider = (input, instructions) => answerKeanQuestion("<user_data>"+JSON.stringify(input).replace(/</g,"\\\\u003c")+"</user_data>",instructions);');
  return html;
}
