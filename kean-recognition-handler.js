        // Result indices are stable for finalized results within one recognition session.
        // A new speech boundary permits a dropped interim slot to represent a new utterance.
        const utteranceResults = new Map();
        let speechEpoch = 0;
        let restartWatchdog = null;
        let startGeneration = 0;
        let lastWakeRecord = null;
        function clearRestartWatchdog() {
          clearTimeout(restartWatchdog);
          restartWatchdog = null;
          startGeneration++;
        }
        function restartRecognition(retried = false) {
          if (!isWakeWordListening || !toggleWakeWord?.checked) return;
          clearRestartWatchdog();
          const generation = startGeneration;
          // Arm before start(): test adapters and some implementations fire onstart synchronously.
          restartWatchdog = setTimeout(() => {
            if (generation !== startGeneration || !isWakeWordListening || !toggleWakeWord?.checked) return;
            window.SecurityState?.logEvent('K.E.A.N.', retried
              ? 'Recognition restart failed twice without onstart. Microphone stopped; enable it to retry.'
              : 'Recognition restart watchdog: no onstart within 2 seconds; retrying once.', 'warn');
            if (!retried) restartRecognition(true);
            else {
              isWakeWordListening = false;
              isAwaitingVoiceCommand = false;
              toggleWakeWord.checked = false;
              clearTimeout(voiceCommandTimeout);
              clearRestartWatchdog();
              updateVoiceStatusPill('idle', 'Recognition did not restart. Enable the microphone to retry.');
              try { recognitionInstance.abort?.(); } catch (_) {}
            }
          }, 2000);
          try { recognitionInstance.start(); } catch (_) { /* The bounded watchdog handles a stalled start. */ }
        }
        function awaitVoiceCommand() {
          isAwaitingVoiceCommand = true;
          clearTimeout(voiceCommandTimeout);
          voiceCommandTimeout = setTimeout(() => {
            isAwaitingVoiceCommand = false;
            if (isWakeWordListening) updateVoiceStatusPill('listening', 'Listening for "K.E.A.N."');
          }, 8000);
        }
        function detectWake(record, wake) {
          if (record.wakeDetected) return;
          record.wakeDetected = true;
          if (lastWakeRecord?.epoch === record.epoch && !lastWakeRecord.finalHandled) return;
          lastWakeRecord = record;
          if (window.speechSynthesis?.speaking) window.speechSynthesis.cancel();
          playWakeChime();
          awaitVoiceCommand();
          updateVoiceStatusPill('awaiting', 'K.E.A.N. heard you — listening for the command.');
          if (!wake.command || /^(hello|hi)$/.test(wake.command)) {
            speakSentryResponse('Yes? How can I assist you, Mawutorwu?');
          }
        }
        recognitionInstance.onspeechstart = () => { speechEpoch++; };
        recognitionInstance.onstart = () => {
          clearRestartWatchdog();
          if (!toggleWakeWord?.checked) {
            isWakeWordListening = false;
            try { recognitionInstance.stop(); } catch (_) {}
            return;
          }
          utteranceResults.clear();
          lastWakeRecord = null;
          speechEpoch = 0;
          isWakeWordListening = true;
          updateVoiceStatusPill('listening', 'Listening for "K.E.A.N."');
          window.SecurityState?.logEvent('K.E.A.N.', 'Single wake-word listener ENGAGED (interim wake detection)', 'info');
        };
        recognitionInstance.onresult = event => {
          if (!toggleWakeWord?.checked) return;
          // Inspect every result, including interims. Never run a command before isFinal.
          for (let index = 0; index < event.results.length; index++) {
            const result = event.results[index];
            const transcript = String(result[0]?.transcript || '').trim().toLowerCase();
            const wake = parseKeanWake(transcript);
            if (!transcript) continue;
            let record = utteranceResults.get(index);
            if (record?.finalHandled) continue;
            const changed = index >= (event.resultIndex ?? 0);
            if (!record || (!result.isFinal && changed && record.epoch !== speechEpoch)) {
              record = {epoch: speechEpoch, wakeDetected: false, finalHandled: false};
              utteranceResults.set(index, record);
            }
            if (wake) detectWake(record, wake);
            if (!result.isFinal) continue;
            record.finalHandled = true;
            window.SecurityState?.logEvent('K.E.A.N.', 'Voice heard: "' + transcript + '"', 'info');
            if (window.PresentationMode?.acceptsReply(transcript)) {
              if (window.speechSynthesis?.speaking) window.speechSynthesis.cancel();
              window.routeCommand(transcript);
              continue;
            }
            voiceDiagnostic('Heard: "' + transcript + '" — ' + (wake || isAwaitingVoiceCommand
              ? 'Processing command.' : 'Wake word not recognized. Say "Kean, open AuthGuard".'));
            const command = wake ? wake.command : transcript;
            if (wake && (!command || /^(hello|hi)$/.test(command))) continue;
            if (wake || isAwaitingVoiceCommand) {
              if (window.speechSynthesis?.speaking) window.speechSynthesis.cancel();
              isAwaitingVoiceCommand = false;
              clearTimeout(voiceCommandTimeout);
              window.routeCommand(command);
            }
          }
          // Removed interim slots may be reused by the next utterance.
          for (const [index, record] of utteranceResults) {
            if (index >= event.results.length && !record.finalHandled) utteranceResults.delete(index);
          }
        };
