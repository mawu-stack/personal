    // Temporary request diagnostics. Never log request credentials or headers.
    window.keanGeminiFetch = async function(endpoint, options) {
      const key = window.SecurityState?.aiApiKey;
      const redact = value => {
        let text = String(value ?? '');
        if (key) text = text.split(key).join('[REDACTED API KEY]');
        return text.replace(/([?&]key=)[^&\s"']+/gi, '$1[REDACTED]');
      };
      const record = (status, body, error) => {
        const detail = redact('Endpoint: ' + endpoint.split('?')[0] + '\nHTTP status: ' + status + '\nResponse body:\n' + body + (error ? '\nNetwork/console error:\n' + error : ''));
        console.error('[GEMINI DIAGNOSTIC]\n' + detail);
        let panel = document.getElementById('kean-api-diagnostic');
        if (!panel) {
          panel = document.createElement('pre');panel.id = 'kean-api-diagnostic';
          panel.setAttribute('aria-label','Gemini API diagnostics');
          panel.style.cssText='white-space:pre-wrap;overflow-wrap:anywhere;padding:16px;border:1px solid var(--card-border);max-height:360px;overflow:auto';
          const host = document.getElementById('kean-voice-diagnostic') || document.querySelector('.wake-word-banner');
          if (host) host.after(panel); else document.getElementById('panel-tab-3').append(panel);
        }
        panel.textContent += (panel.textContent ? '\n\n' : '') + detail;
      };
      try {
        const response = await fetch(endpoint, options);
        const body = await response.clone().text();
        record(response.status, body, '');
        return response;
      } catch (error) {
        record('unavailable (no HTTP response)', '(no response body)', error?.stack || error?.message || String(error));
        throw error;
      }
    };
