# Assignment 8 verification

Security Monitor is Tab 10 in the existing K.E.A.N. 2.0 workbench. The pre-change HTML is saved at `index-a8-backup.html` in the workspace root. The original nine lab panels were compared byte for byte. The current HTML is reproducible from the original migration plus the declared Assignment 8 integration.

| Phase or requirement | Result | Evidence |
| --- | --- | --- |
| Phase 1 registry, source tagging, compound request | PASS in interpreter test | Ran the actual interpreter against a DOM test double. Background variable changed to dark blue, the lesson entered its playing state, and the local phishing answer followed in order. The log included the voice source. |
| Invalid or malicious intents | PASS | Rejected unknown actions, malformed color, raw URLs, a path outside the media list, wrong parameter types, extra payment fields, public IP blocks, and an invalid intent returned by a stubbed provider. |
| State-changing authorization | PASS in interpreter test | Denied changes when the existing authorization interface returned false. A simulated block request opened a confirmation state while the list remained empty. |
| Phase 2 local education | PASS | Exercised all 11 requested topics, missing-entry response, a local follow-up, three-result retrieval limit and refusal to expose private instructions. |
| Phase 3 dataset and rules | PASS | Fixed-seed generation produced 400 rows. All IPs use documentation ranges. All seven simulated detection rules fired. Normalizers recognized demo login, authorization denial and sandbox prompt flags. |
| Replay | PASS in interpreter test | The actual replay code injected seven simulated failures and rendered the new documentation IP into the dashboard model using a DOM test double. |
| Phase 4 Test Console | Implemented, browser verification pending | The console contains 16 command checks and five security questions. It derives rows from actual command results, state checks, and elapsed time. Questions use approximate keyword checks. |
| Existing coursework, JS syntax, HTML and CSS | PASS | Original nine panels matched byte for byte. HTML parser, unique ID check, JS compilation and CSS brace checks passed. |
| Actual browser rendering and command UI | NOT VERIFIED | Localhost port 3513 refused connections. Browser layout, player delivery, audio activation, speech, physical microphone, real provider replies, export download and full legacy UI regression were not exercised. |

## Permission and data choices

The existing demo authorization system grants site controls and simulated replay to signed-in student and administrator accounts. Simulated blocks require the administrator role, a documentation IP and a separate confirmation click. The assistant uses the existing provider transport for optional JSON intent interpretation or educational answers. The tests use a stubbed provider. An intent never becomes executable code. The lesson is a built-in four-step animated teaching sequence. The existing Under Siege MP4 is the second approved media entry.

Live classroom events have no network IPs. The live table shows “Page event.” Simulated thresholds and UTC hours appear beside the dashboard. Event flags are classroom signals. The score counts distinct rule/IP pairs so a single repeated flag does not add points indefinitely.

Assignments 1, 5, 9, 9.1 and 9.2 lack identifiable assignment write-ups in the current site. Available entries cover 2, 3, 4, 6, 7 and the new Assignment 8. General security guidance is identified separately from coursework.

## Reproduce

- `node kean-v2/verify-a8.mjs`
- `node kean-v2/verify-migration.mjs`
- `node kean-v2/build.mjs`

For browser verification, keep `node kean-v2/preview.cjs` running in a foreground terminal. Open `http://127.0.0.1:3513/personal/kean-v2/workbench.html#tab-10` and sign in with the classroom account shown by the gateway. Activate audio and run the Test Console. Submit the compound command in the assistant and use Replay attack to check the dashboard update.
