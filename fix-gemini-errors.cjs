const fs=require('fs'),assert=require('assert/strict');
let s=fs.readFileSync('index-gemini-error-fix-backup.html','utf8');
function edit(a,b){assert.equal(s.split(a).length,2,a);s=s.replace(a,b);}
const classify=`    window.keanGeminiError = function(status, body) {
      let data;try {data=JSON.parse(body);} catch (_) {}
      let detail=data?.error?.message || body || 'No response body returned.';
      const key=window.SecurityState?.aiApiKey;
      if(key)detail=detail.split(key).join('[REDACTED API KEY]');
      let reason='Gemini request failed';
      if(status===429)reason='Gemini quota exceeded. Check project usage, quota and billing';
      else if(status===404)reason='Gemini model not found or unavailable for this API';
      else if(/API_KEY_INVALID|API key not valid|invalid api key/i.test(body))reason='Gemini API key is invalid';
      else if(status===403 && /referrer|referer|API_KEY_HTTP_REFERRER_BLOCKED/i.test(body))reason='This API key has domain/referrer restrictions blocking this site';
      else if(status===403)reason='Gemini permission denied. See the API reason below';
      else if(status===401)reason='Gemini authentication failed';
      else if(status===400)reason='Gemini rejected the request configuration';
      else if(status>=500)reason='Gemini service temporarily unavailable';
      return reason+' (HTTP '+status+'). '+detail;
    };
`;
edit('    // Temporary request diagnostics.',classify+'    // Temporary request diagnostics.');
edit('        record(response.status, body, \'\');\n        return response;',"        record(response.status, body, '');\n        if(!response.ok){const failure=new Error(window.keanGeminiError(response.status,body));failure.geminiHttp=true;throw failure;}\n        return response;");
edit("        record('unavailable (no HTTP response)', '(no response body)', error?.stack || error?.message || String(error));\n        throw error;","        if(error.geminiHttp)throw error;\n        record('unavailable (no HTTP response)', '(no response body)', error?.stack || error?.message || String(error));\n        throw new Error('Gemini network error: no HTTP response was received. '+redact(error?.message || String(error)));");
edit("const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + window.SecurityState.aiApiKey;","const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent';");
edit("headers: { 'Content-Type': 'application/json' },","headers: { 'Content-Type': 'application/json', 'x-goog-api-key': window.SecurityState.aiApiKey },");
edit('MODE: [LIVE GEMINI 1.5 FLASH VIA BYOK]','MODE: [LIVE GEMINI 3.8 FLASH VIA BYOK]');
edit('            renderLocalSimulation(output, isGuardOn, hasAdversarialIntent, query, err.message);',"            injectionSandboxDisplay.textContent = 'Live Gemini request failed:\\n' + err.message;\n            window.SecurityState?.logEvent('AI-ENGINE', err.message, 'warn');");
edit("        } catch (_) {\n          if (!stillCurrent()) return;\n          const message = job.timedOut ? 'Web search timed out. Please try again.' : 'Web search could not complete. Check your connection and Gemini access, then try again.';","        } catch (error) {\n          if (!stillCurrent()) return;\n          const message = job.timedOut ? 'Web search timed out. Please try again.' : error.message;");
fs.writeFileSync('index-cmdk.html',s);
