const fs=require('fs'),a=require('assert/strict'),vm=require('vm');const file='index-cmdk.html';let h=fs.readFileSync(file,'utf8');fs.writeFileSync('index-claude-workspace-backup.html',h);
function edit(x,y){a(h.includes(x));h=h.replace(x,y);}
edit('<p id="ai-provider-help">', '<label for="ai-workspace-id">Claude Workspace ID (only for unscoped keys)</label><input id="ai-workspace-id" class="sim-login-input" autocomplete="off" placeholder="Workspace ID from Claude Console"><p id="ai-provider-help">');
edit("      const provider=aiProviderSelect.value;", "      const provider=aiProviderSelect.value;\n      document.getElementById('ai-workspace-id').disabled=provider!=='claude';\n      document.getElementById('ai-workspace-id').value=window.SecurityState.claudeWorkspaceId||'';");
edit('        providerKeys[provider]=key;', "        if(provider==='claude')window.SecurityState.claudeWorkspaceId=document.getElementById('ai-workspace-id').value.trim();\n        providerKeys[provider]=key;");
edit("          body={model:'claude-haiku-4-5-20251001'", "          if(state.claudeWorkspaceId)headers['anthropic-workspace-id']=state.claudeWorkspaceId;\n          body={model:'claude-haiku-4-5-20251001'");
for(const [,js] of h.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))new vm.Script(js);
fs.writeFileSync(file,h);console.log('PASS workspace header added only to Claude branch; JavaScript syntax valid');
