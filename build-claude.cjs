const fs=require('fs'),a=require('assert/strict'),vm=require('vm');let h=fs.readFileSync('index-claude-backup.html','utf8');
function edit(x,y){a(h.includes(x),x);h=h.replace(x,y);}
edit('Configure session-only Gemini API key. Stored strictly in memory, zero persistence.','Choose a provider and enter its key. Keys remain in memory only.');
edit('<label for="ai-api-key-input"',`<label for="ai-provider-select">AI Provider &amp; Model</label><select id="ai-provider-select" class="sim-login-input"><option value="gemini">Google Gemini — 3.8 Flash</option><option value="claude">Anthropic Claude — Haiku 4.5</option></select><p id="ai-provider-help">Get a Gemini key from Google AI Studio.</p>
          <label for="ai-api-key-input"`);
edit('>Gemini API Key</label>','>Provider API Key</label>');
edit("    const aiKeyInput = document.getElementById('ai-api-key-input');",`    const aiKeyInput = document.getElementById('ai-api-key-input');
    const aiProviderSelect = document.getElementById('ai-provider-select');
    const providerKeys = {gemini:null,claude:null};
    function updateProviderField(){
      const provider=aiProviderSelect.value;
      aiKeyInput.value=providerKeys[provider]||'';
      aiKeyInput.placeholder=provider==='claude'?'sk-ant-…':'AIzaSy…';
      document.getElementById('ai-provider-help').textContent=provider==='claude'?'Get a key at console.anthropic.com. Check your account for trial-credit eligibility and any phone verification requirement. Web search must be enabled in your organization and may cost extra.':'Get a Gemini key from Google AI Studio.';
    }
    aiProviderSelect.addEventListener('change',updateProviderField);`);
edit("        aiKeyInput.value = window.SecurityState.aiApiKey || '';","        aiProviderSelect.value=window.SecurityState.aiProvider||'gemini';\n        updateProviderField();");
edit("const provider = 'gemini';","const provider = aiProviderSelect.value;");
edit('        window.SecurityState.aiApiKey = key;','        providerKeys[provider]=key;\n        window.SecurityState.aiApiKey = key;');
edit('        window.SecurityState.aiApiKey = null;','        providerKeys[window.SecurityState.aiProvider]=null;\n        window.SecurityState.aiApiKey = null;');
edit("if(state.aiProvider!=='gemini')","if(!['gemini','claude'].includes(state.aiProvider))");
edit('const job={controller:new AbortController(),key:state.aiApiKey,session:',"const provider=state.aiProvider, providerName=provider==='claude'?'Claude':'Gemini';\n        const job={provider,controller:new AbortController(),key:state.aiApiKey,session:");
edit('webSearchJob===job&&state.aiApiKey===job.key&&window.currentSessionToken','webSearchJob===job&&state.aiProvider===job.provider&&state.aiApiKey===job.key&&window.currentSessionToken');
edit('        const body={contents:', '        let body={contents:');
edit('        if(search)body.tools=[{google_search:{}}];',`        if(search)body.tools=[{google_search:{}}];
        let endpoint='https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent';
        let headers={'Content-Type':'application/json','x-goog-api-key':job.key};
        if(provider==='claude'){
          endpoint='https://api.anthropic.com/v1/messages';
          headers={'content-type':'application/json','x-api-key':job.key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'};
          body={model:'claude-haiku-4-5-20251001',max_tokens:1024,messages:[{role:'user',content:question}]};
          if(search)body.tools=[{type:'web_search_20250305',name:'web_search',max_uses:1}];
        }`);
edit("new Error('Gemini exceeded the 6-second response deadline.')","new Error(providerName+' exceeded the 6-second response deadline.')");
edit("window.keanGeminiFetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':job.key},signal:job.controller.signal,body:JSON.stringify(body)})","window.keanGeminiFetch(endpoint,{method:'POST',headers,signal:job.controller.signal,body:JSON.stringify(body)})");
edit('          const text=candidate?.content?.parts?',"          const text=provider==='claude'?data.content?.filter(p=>p.type==='text').map(p=>p.text).join('\\n').trim():candidate?.content?.parts?");
edit("throw new Error('Gemini returned no answer text. Finish reason: '+(candidate?.finishReason||'unknown'))","throw new Error(providerName+' returned no answer text. Finish reason: '+(data.stop_reason||candidate?.finishReason||'unknown'))");
edit('          const meta=candidate.groundingMetadata;',`          const toolError=data.content?.find(p=>p.type==='web_search_tool_result'&&p.content?.type==='web_search_tool_result_error');
          if(toolError)throw new Error('Claude web search failed: '+toolError.content.error_code);
          const citations=(data.content||[]).flatMap(p=>p.citations||[]).filter(c=>c.type==='web_search_result_location');
          const meta=provider==='claude'?{groundingChunks:citations.map(c=>({web:{uri:c.url,title:c.title}})),webSearchQueries:citations.length?['Claude search']:[]}:candidate.groundingMetadata;`);
edit("new Error('Gemini returned no verifiable search grounding.')","new Error(providerName+' returned no verifiable search grounding.')");
edit("'Live Gemini conversational answer received.'","'Live '+providerName+' conversational answer received.'");
edit("const failure=new Error(window.keanGeminiError(response.status,body));","const failure=new Error(window.keanGeminiError(response.status,body).replaceAll('Gemini',endpoint.includes('api.anthropic.com')?'Claude':'Gemini'));");
edit("console.error('[GEMINI DIAGNOSTIC]\\n' + detail);","console.error('[AI DIAGNOSTIC]\\n' + detail);");
edit("'Gemini network error: no HTTP response was received. '","'AI network error: no HTTP response was received. '");
for(const [,js] of h.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))new vm.Script(js);
fs.writeFileSync('index-cmdk.html',h);console.log('PASS JavaScript syntax');
