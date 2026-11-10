# K.E.A.N. 2.0 — Assignment 8 and Lab 1 submission packet

[Local Security Monitor](http://127.0.0.1:3513/personal/kean-v2/workbench.html#tab-10) · [Local Identity and Security lab](http://127.0.0.1:3513/personal/kean-v2/workbench.html#lab1-network)

Assignment 8 combines in-page security telemetry, a deterministic attack replay, and a cybersecurity assistant that executes validated website actions. Lab 1 adds a browser-based networking exercise and a separate report for the student's actual observations.

## Assignment 8 compliance

| Requirement | Status | Evidence and limits |
| --- | --- | --- |
| Login totals, failures, failure rate and threat level | PASS | Live dashboard showed one login attempt, zero failures and Low. The deterministic dataset and rule calculations passed the static verifier. |
| Suspicious IPs, attack categories, history, normal versus suspicious and detection rules | PASS | Suspicious filter returned 11 flagged rows. The verifier checked the 400-event fixture, seven rule flags and reserved documentation IPs. Rules and thresholds are shown in the dashboard. |
| Educational scenario coverage and replay | PASS | Fixture covers normal logins, repeated failures, credential stuffing, off-hours admin activity, traffic bursts and injection signatures. Browser replay increased displayed events from 400 to 407, with 14 flagged afterward. The dashboard labels this data as simulated. |
| Natural-language controls and extra feature | PASS | Both Test Console passes returned 21/21. Tests included color, presets, themes, font scale, reset, navigation, media and product filtering. Relative font commands clamped to 80–160% in a separate browser check. |
| Exact compound command | PASS | Browser showed computed dark blue, the training lesson and three ordered results. The phishing explanation followed both actions. The separate approved MP4 played for 5.04 seconds and paused on command. |
| Cybersecurity education | PARTIAL | Browser checks covered phishing, passwords, DoS versus DDoS, SQL injection and MFA. The automated local verifier also exercised malware, compromised computers, personal information and suspicious sites. Those additional topics still await individual browser checks. |
| Coursework grounding and contextual follow-ups | PARTIAL | DDoS follow-up, comparison with phishing and navigation to Lab 07 passed. Assignments 1, 2, 3, 4, 6, 7 and 8 have supporting content. The assistant identifies 5, 9, 9.1 and 9.2 as unavailable. |
| Allowlist, safe rendering and authorization | PASS | Static checks exercised action validation and hostile provider output. Browser checks rejected arbitrary URLs, unsafe CSS, public-IP blocking and standard-user blocking. Administrator cancellation left the list empty, and confirmation added one documentation IP to the simulated list. This evidence covers the tested paths. |
| BYOK and response provenance | PARTIAL | Local provenance appeared in browser answers. Existing provider integration and fallback paths were retained. A stub was used for provider tests. Live Gemini and Claude, real keys, and comprehensive network capture were NOT TESTED. |
| Voice and browser media permissions | PARTIAL | Typed controls worked without microphone access. Source review found a shared interpreter and opt-in microphone flow. Native MP4 playback was tested. Physical microphone recognition, audible voice confirmation and live autoplay denial were NOT TESTED. |
| Keyboard, mobile and motion | PARTIAL | Keyboard navigation opened all ten tabs, and the palette opened Security Monitor. At 390 px both new sections fit without horizontal overflow. Global shortcut and OS-level reduced-motion behavior were NOT TESTED in this pass. |

## Lab 1 compliance

| Requirement | Status | Evidence and limits |
| --- | --- | --- |
| Lab 1.1 IP configuration | PARTIAL | The UI includes all four sample ipconfig commands and explanations for IP, subnet, gateway, DHCP, DNS and MAC. DHCP renewal was tested. The professor's exact question text and student captures are still needed. |
| IP modification, conflict and restoration | PASS | The simulation rejected an occupied sample address ending in .180. An off-subnet configuration produced sample gateway loss, and restoration returned the original sample configuration. |
| Lab 1.2 A Ping and Tracert | PASS for simulation | Gateway and DNS examples show TTL, latency and loss. Ten distinct example routes were exercised across Kean and Google. The UI identifies timeout behavior and explains the limits of ping as an identity check. |
| Lab 1.2 B ARP and topology | PASS for simulation | Clearing the sample cache then pinging a remote DNS server repopulated only the gateway entry. The topology explains same-LAN MAC resolution and forwarding to remote networks. |
| Actual traceroute analysis | PASS for parser, NOT TESTED with student data | A labeled QA fixture preserved a timeout, identified the last displayed hop as 3 and found a peak RTT of 23 ms. The report carried only the entered fixture. No real commands ran. |
| Kean report and screenshots | PARTIAL | The draft has a cover, description, configuration, procedure, results and references. Empty fields show missing-observation markers. The student still needs to provide actual outputs, screenshots, problems and fixes, and any sources or acknowledgements. [Lab 1 report draft](lab1-identity-security-draft.md) |

## Two-pass verification

| Test | Expected | Actual | Result |
| --- | --- | --- | --- |
| First browser Test Console | 21 passing checks | 21/21. Separate follow-up checks found that the comparison lost DDoS context and the contextual navigation stayed on Tab 10. | PASS for console, FAIL for follow-ups before repair |
| Second browser Test Console and contextual retest | 21 passing checks, both topics explained and correct lab opens | 21/21. Comparison included both topics and the next follow-up opened Lab 07. | PASS |
| Exact compound command | Ordered color, media and education results | Computed RGB 19, 40, 68, visible training lesson, phishing answer and three ordered entries. | PASS |
| MP4 play and pause | Time advances and pause stops playback | An early probe preceded media readiness. Retest showed 5.04 seconds of playback, and a separate pause test showed the element paused after the command completed. | PASS after retest |
| Replay and suspicious filter | Rendered counts and filtered rows update | 400 to 407 total events. All 11 rows before replay in the suspicious view were flagged. | PASS |
| Protected and malformed actions | No unauthorized state changes | Malicious strings and student block attempts left state unchanged. Admin cancel and confirmation affected only the simulation. | PASS |
| Existing labs, console and build | Navigation, core features and static checks succeed | All tabs navigated. AuthGuard and SentrySim passed after active-tab readiness, STRIDE showed six categories, and no console errors appeared in the sampled check. Build and static verifiers passed. | PASS for tested paths |
| Full legacy regression | Every existing feature exercised | All nine original panel bodies passed byte comparison. The login/logout, palette, AuthGuard, SentrySim and STRIDE checks passed. Existing session expiration, microphone and live providers were outside this browser pass. | PARTIAL |

[First browser pass](../evidence/a8-pass1.txt) · [Second browser pass](../evidence/a8-pass2-console.txt) · [Detailed browser observations and retests](../evidence/a8-lab1-browser-audit.json) · [Browser screenshot](../evidence/assignment8-monitor-verified.png)

Static checks passed for JavaScript syntax, CSS brace balance, unique IDs, migration parity and the local build. The nine original panel bodies matched their pre-change bytes. This included the Secure Architecture and Coursework content.

## Files changed

| Path | Purpose |
| --- | --- |
| `assignment8.js` | Validated Lab 1 routing, contextual navigation, ordered action results and bounded relative font commands. |
| `assignment8-education.js` | Lab 1 grounding, compromised-computer guidance and contextual DDoS comparison and navigation. |
| `assignment8-panel.html`, `assignment8-monitor.js` | Ordered action list and explicit simulation label. |
| `assignment8.css` | Scoped Lab 1 topology, report and responsive styles. |
| `lab1-panel.html`, `lab1-network.js` | New educational simulation, route analysis and actual-observations report form. |
| `assignment8-integration.mjs`, `workbench.html`, `build.mjs` | Reproducible template and controller integration, updated workbench entry point and build packaging. |
| `verify-a8.mjs` | Regression checks for compromised-computer guidance and the full DDoS comparison and lab-navigation follow-up. |
| `dist/` | Rebuilt local output. |
| `docs/lab1-identity-security-draft.md`, this packet | Student report template, verification and submission instructions. |
| `evidence/a8-pass1.txt`, `evidence/a8-pass2-console.txt`, `evidence/a8-lab1-browser-audit.json`, `evidence/assignment8-monitor-verified.png` | Browser verification evidence. |

[Pre-change backups](../backups/pre-final-a8-lab1/)

## Recording plan

1. Open the local Security Monitor. Show the live login counters and explain what one login actually recorded.
2. Switch to simulated history. Show normal activity and the suspicious filter, open the rule explanations, then replay a scenario and point out the changing counters. Keep the simulation label visible.
3. Enter “Change the background to dark blue” and “Set theme to light.” Show the visible state changes and restore the appearance.
4. Enter “Find laptops under $900” and show the filtered demonstration catalog.
5. Enter the exact compound request below. Show the three results in order. If autoplay is blocked during recording, show the reported status and use the native Play control.
6. Ask “How do I make strong passwords?”, “Compare DoS and DDoS” and “What is MFA?” Show where local answers came from. Ask “Show me the lab where you demonstrated it” directly after a DDoS answer to demonstrate contextual navigation.

> Hello! Change the background to dark blue, play the cybersecurity training video, and teach me how to recognize phishing attacks.

## Readiness

- **Ready locally** — Assignment 8's tested controls, monitoring and simulation workflows, plus the Lab 1 classroom exercises and report draft.
- **Requires student observations** — Lab 1 system configuration, command captures, topology, screenshots and conclusions. Keep the simulation examples separate from the submitted measurements.
- **Requires recording** — Record the Assignment 8 demonstration using the checklist.
- **Requires deployment approval** — [MISSING: approved public URL]. Published playback and submission are unverified. This work was previewed locally.
- **Requires additional fixes** — No unresolved failure in the retested local workflows. Live-provider, physical microphone, reduced-motion and full network verification remain open.

The missing student measurements and unpublished submission are the critical completion gaps. Recording and checking live voice/provider behavior are important when those paths will be used in the presentation. Broader legacy and motion verification can follow separately.
