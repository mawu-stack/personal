# K.E.A.N. 2.0 final repair and QA

[Homepage](http://127.0.0.1:3513/personal/kean-v2/index.html) · [Assignment 8](http://127.0.0.1:3513/personal/kean-v2/workbench.html#tab-10) · [Lab 1](http://127.0.0.1:3513/personal/kean-v2/workbench.html#lab1-network)

## Assignment 8

| Requirement | Status | Evidence |
| --- | --- | --- |
| Site controls and approved actions | PASS | Final browser console measured 16 control and feature checks plus five local answer checks. It exercised dark blue, both themes, 120% scale, reset, security-grid, both navigation targets, catalog filtering, lesson playback and ambient audio. Audio was explicitly activated. An external navigation request was rejected in the typed interface. |
| Exact compound command | PASS | Browser showed three ordered results. It applied dark blue, opened the interactive phishing training lesson and explained sender verification and reporting. The old phrase is still accepted as an input alias. |
| Media accuracy | PASS | The new title and feedback identify the interactive text lesson. Existing Under Siege preview files and labeling are unchanged. Fresh native MP4 playback was NOT TESTED in this pass. |
| Test console restoration | PARTIAL | The final browser run restored light theme, dark-blue color, security-grid, 120% scale and Tab 10. The hash stayed fixed and test media closed. A separate run before audio activation showed 18 PASS and three NOT TESTED. The stop button timed out because the run finished before it could be pressed. Mid-run cancellation, logout and forced-error cleanup remain unverified in the browser. |
| Dashboard and simulated rules | PASS for tested paths | Automated checks verified the fixed seed, 400 events, seven rule categories and reserved IPs. In the browser, live mode showed one classroom login and no flags. Simulated replay changed 389 unflagged and 11 flagged events to 393 unflagged and 14 flagged. The suspicious filter displayed flagged entries. Inspecting XSS showed the rule and signature explanation. |
| Timeline and threat scoring | PARTIAL | Dashboard cards, filtered table and replay updated in the same browser workflow. Individual chart bins and numerical threat thresholds were not separately reconciled. |
| Authorization | PASS | Regular User was denied the block request. Administrator confirmation added one documentation IP to the simulated list. Canceling a second request kept the first as the only entry. |
| Education and provenance | PASS for local and mocked fallback | All five exact questions returned labeled local answers. The DDoS follow-up compared it with phishing and opened Lab 07. The automated verifier forced a provider error and checked the local fallback. Live providers and physical microphone input were NOT TESTED. |

## Lab 1

| Requirement | Status | Evidence |
| --- | --- | --- |
| Educational networking exercises | PASS for tested paths | Browser controls exercised all four ipconfig actions, restore, gateway and DNS ping, and ARP view, clear and repopulation. Outputs were labeled simulated. Automated checks verified five illustrative routes per destination. A fresh browser pass did not repeat every static address conflict and route variation from the prior audit. |
| Windows tracert parser | PASS | Automated cases covered three probes, less-than values, timeouts, DNS names, IPv4, IPv6 with a zone, unreachable replies, malformed addresses, duplicate and descending hop numbers, RTT ties and all three reachability states. The final responding hop alone leaves reachability unconfirmed. |
| Observation export | PASS | The browser downloaded JSON with the chosen destination, run 1, three hops, probes, explicit reached status and tied highest RTT of 12 ms at hops 1 and 3. Kean and Google had separate comparison counts. The fixture used documentation IPs and is QA evidence only. |
| Report workspace and download | PASS for functionality, PARTIAL for submission | Browser previewed and downloaded the text report. The file contained the entered QA trace and missing-evidence markers for blank fields. The student's actual captures, configuration, conclusions and screenshots are still needed. |

## Integration and regression

| Test | Expected | Observed |
| --- | --- | --- |
| Homepage explorer and portfolio return | Security Monitor opens Tab 10 and Back to portfolio returns home | PASS by keyboard in the browser. Gateway and workbench now display ten labs. |
| Lab 1 deep link and browser history | Lab 1 retains its dedicated hash | PASS for direct navigation and history URL round trip. Immediately after history changes, the previous panel could remain visible briefly during transition. The forward destination settled on Lab 1. |
| Existing navigation | All ten panels open | PASS by keyboard in the browser. The migration verifier confirmed all nine original panel bodies remain byte-exact. |
| Mobile | Both lab sections fit at 390 px viewport width and 120% scale | Initial Lab 1 check showed horizontal overflow. After bounding the new selector, both sections measured 375 px client and scroll width. PASS on retest. |
| Initialization and console | Tested features run and no errors appear | PASS for the exercised paths. The final browser error sample was empty. Full behavior of the older labs, reduced-motion settings, voice, digital person and live BYOK was NOT TESTED in this pass. |

### Commands run

- `node kean-v2/consolidate.mjs` regenerated the workbench from the frozen source and declared integration changes.
- `node --check` passed for `assignment8.js`, `assignment8-evidence.js`, `lab1-network.js`, `app.js`, `platform.js` and `gateway.js`.
- `node kean-v2/verify-a8.mjs` passed five verification groups, including parser cases, policy and monitored event tests.
- `node kean-v2/verify-migration.mjs` passed panel parity, IDs, CSS braces and JavaScript syntax.
- `node kean-v2/verify.mjs` passed preservation checks for the original HTML and 218 source files.
- `node kean-v2/build.mjs` built 62 local files. No publication occurred.

## Changed files

| Files | Change |
| --- | --- |
| `assignment8.js`, `assignment8-panel.html` | Accurate training lesson labels, compatible command alias and console controls. |
| `assignment8-evidence.js` | Capture and restore appearance, catalog and active tab. Skip audio without opt-in and skip tests that would interrupt existing playback. Report measured and skipped checks separately. |
| `assignment8-integration.mjs`, `workbench.html` | Temporary test navigation and theme application, Lab 1 hash handling and generated integration. |
| `lab1-network.js`, `lab1-panel.html`, `assignment8.css` | Harden traceroute parsing, collect explicit reachability, download observations and reports locally, and constrain the reachability control at small widths. |
| `app.js`, `platform.js`, `gateway.js` | Add Security Monitor to the homepage explorer and workbench overview. Correct the lab count. |
| `verify-a8.mjs` | Add regression checks for parser formats, lesson alias and a simulated provider failure. |
| `dist/`, this report | Rebuild local preview files and record verification. |

Pre-change copies of the edited source files are in `backups/pre-final-repair-qa/`. Consolidation also reproduced the existing compatibility stylesheet.

## Demo and submission

1. Open Security Monitor. Compare the live classroom view with simulated history, inspect an alert and replay a scenario.
2. Type “Change the background to dark blue” and “Set font scale to 120%.” Show both state changes.
3. Type “Find laptops under $900” and show the filtered sample catalog.
4. Ask how to recognize phishing, how to create a strong password, and how DoS differs from DDoS.
5. Open Lab 1. Demonstrate DHCP renewal and ARP clear and repopulate with the labeled samples. Preview the report and show the two download controls. Use your own captures for the submitted report.

- **Code defects** — The reproduced issues above were fixed. The interruption path still needs a deliberate browser test.
- **Browser-only checks** — Live microphone, live provider integration, fresh Under Siege playback, and detailed chart-bin and score reconciliation remain open.
- **Student observations and screenshots** — Gather actual Lab 1 data and replace the report placeholders. [Lab 1 draft](lab1-identity-security-draft.md)
- **Submission** — Record the demo and confirm the published URL after separate approval. [Earlier submission packet](assignment8-lab1-final-audit.md)
