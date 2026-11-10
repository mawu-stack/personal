# K.E.A.N. voice commands

Enable the microphone using the existing control, then say **Kean** followed by a command. The same commands work through **Ctrl+K / Cmd+K**. Hover a palette result to see its spoken command. Commands use the existing button handlers; disabled controls remain disabled.

| Action | Example |
| --- | --- |
| Navigate | “Kean, open AuthGuard”, “open SentrySim”, “open AI Terminal”, “open STRIDE”, “open Secure Architecture”, “open Academic Coursework” |
| Set a defense | “Turn off the WAF”, “turn on the rate limiter”, “enable parameterized SQL”, “disable safe DOM”, “enable PBKDF2” |
| Launch a simulation | “Run credential stuffing”, “run IDOR”, “run SQL injection”, “run stored DOM XSS”, “run ReDoS”, “run GPU mask crack”, “run cache sniffing”, “run WebRTC audio probe” |
| Generate | “Generate a secure password” |
| Read current results | “Check entropy”, “check TTC” |
| Choose a sample | “Use password sample 1” through “use password sample 7” |
| Set SentrySim entropy | “Use 32 entropy”, “use 41 entropy”, “use 64 entropy”, “use 128 entropy”, “use live entropy” |
| STRIDE filtering | “Filter spoofing”, “filter tampering”, “filter repudiation”, “filter information disclosure”, “filter denial of service”, “filter elevation of privilege”, “show all STRIDE” |
| Explain a category | “Explain spoofing” (or another STRIDE category) |
| Inspect code | “Show spoofing details” (toggles the existing drawer) |
| Reports | “Show audit report”, “close audit report”, “copy audit report”, “export audit report”, “export STRIDE report” |
| Prompt lab | “Run prompt sample 1” through “run prompt sample 3”, “test current prompt” |
| Other controls | “Next tip”, “dark mode”, “light mode”, “copy telemetry”, “clear telemetry”, “toggle activity log”, “test voice” |
| Help | “What can you do”, “open commands” |

The palette also lists a scoped “activate … in …” command for remaining buttons, links, disclosures and interactive cards. Those commands activate the original control. Passwords and API keys are entered through their existing fields, not dictated as voice commands.

SQL injection is unavailable while the existing prepared-query control disables its launcher. A command reports that state rather than bypassing it. Browser microphone permissions, clipboard restrictions and download prompts still apply.

## Phase 3 verification

The local `voice-coverage-check.html` fixture passed 44 checks using `simulateKeanVoiceInput()` with “Kean, …” transcripts. It compares all eight attack results and five defense states with direct button clicks, checks all six tabs and STRIDE categories, current results, generation, exports and help. Speech output and downloads are captured only in the test fixture. This is not a physical microphone or speech-recognition accuracy test.

The live preview also passed Ctrl+K exact-alias selection and execution for WAF off/on and credential stuffing. `verify-voice-coverage.cjs` checks script preservation, academic markup, JavaScript syntax, nine CSS blocks and the original presentation backup hash.

## Interim wake detection and live search

K.E.A.N. now reacts to interim recognition of “Kean” (including existing aliases), without waiting for a final transcript. Repeated interim fragments produce one acknowledgment per utterance. Commands and approval replies still wait for final recognition. An ended recognition session restarts immediately, with one watchdog retry if no start event arrives within two seconds.

Connect a Gemini key using **Connect AI**, then ask an open-ended question such as “Kean, what is the latest cybersecurity news?” Local navigation, definitions and app controls remain local. Remote questions use Gemini's Google Search grounding. Verified search answers begin **“Based on a live search:”**, show source links in Tab 3 and appear under **[WEB SEARCH]** in the Activity Log. Missing keys, unsupported providers, ungrounded responses and network failures receive explicit messages. Keys remain session-only in memory.

Automated recognition and mocked API checks do not measure physical microphone accuracy or prove a credentialed Gemini request succeeds on a particular account.

## Presentation Mode

Use the **Presentation Mode** checkbox for one-time setup. It starts the existing shared microphone; allow the browser's microphone prompt if needed. The large display shows **Idle**, **Listening**, **Processing**, or **Speaking**.

- Say “Kean, turn off the WAF” to propose a local defense change. The defense remains unchanged until approved.
- While a proposal is open, say **confirm**, **yes**, or **approve**; or say **deny**, **no**, or **cancel**. These short replies do not need the wake word in Presentation Mode.
- Silence approves the local simulation after the visible five-second countdown. Automatic execution is labeled as automatic, not human consent.
- Say “Kean, rotate simulated credentials” to demonstrate the Tier 2 permission gate. This updates a simulated result, not real credentials.
- **Ctrl+K / Cmd+K** remains available. Type **confirm** or **cancel** to decide a proposal by keyboard. Opening the palette pauses the countdown.
- The countdown waits while K.E.A.N. speaks or the microphone is unavailable. Hiding the page, ending Presentation Mode, or losing the demo session cancels the pending action. Escape denies.
- Say “Kean, disable Presentation Mode” to finish. Normal mode keeps the original immediate defense toggles and requires explicit approval for the Tier 2 demonstration.

Only the local simulation's defense/autonomy switches and Tier 2 demo use this approval controller. Browser permission prompts, external services, API-key handling and real credentials are never auto-approved.

`presentation-check.html` tests recognized transcripts through the actual recognition result callback, including all six tabs, an attack, defense proposals, every spoken decision synonym, silent auto-confirmation, keyboard recovery, microphone failure and normal-mode controls. The no-mouse run after setup is an automated transcript test; physical microphone recognition and audible output still require a live check on the presentation computer. `verify-presentation-mode.cjs` verifies the declared integration changes, byte-identical coursework, ten balanced CSS blocks, JavaScript syntax and the untouched backup.
