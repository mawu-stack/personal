# Lab 02 — SentrySim final upgrade

Implemented only in the isolated K.E.A.N. 2.0 workspace. No deployment.

## Implementation

- Reused the existing local, pinned Cytoscape.js 3.34.4 engine. No new dependency or CDN.
- Five compound trust zones, selectable tier nodes and labeled connections, optional AI branch, native tier selector, keyboard selection, zoom/pan/fit controls.
- Original eight attack handlers evaluate each run. Their `kean:activity` outcome and path-tracer events determine the displayed result and destination. A separate, explicitly illustrative replay supplies start, pause/resume, step and reset controls.
- Timeline includes the recorded defense profile and actual original simulator events. The inspector distinguishes recorded controls from the settings for the next run.
- Comparison executes the original scenario with all five controls off, then its relevant control on. It displays actual reasons and interruption tier, explains remaining risks, and restores the visitor's settings.
- Existing defense DOM elements/listeners are moved, not recreated. TTC, original attack cards, telemetry, and the expandable legacy reference remain available.
- The upgraded XSS replay isolates the existing rendering sink in inert template content while evaluating its original handler. It records the same outcome without fetching an image or opening an alert. The legacy reference/launch controls are retained.
- AI tier is clearly labeled architectural context: none of the eight original vectors directly targets it. No invented AI attack telemetry, security scores or real attack traffic.
- Scoped graphite/mint dark and light styling; portrait topology on narrow screens. Animation checks `prefers-reduced-motion`. Resizing now keeps the replay dot at the recorded component.

## Files

Runtime additions: `sentry.js`, `sentry.css`.

Runtime modification: `platform.js`, only its former Lab 02 adapter block, replaced by the new Lab 02 loader. `build.mjs` adds the three Sentry assets to the local output list. `dist/` is the regenerated local preview output.

QA/support additions: `sentry-check.html`, `verify-sentry.mjs`, `integrate-sentry-final.mjs` (one-time integration script), this report, and `evidence/sentry-*` screenshots/logs. Pre-change copies are in `backups/pre-sentry-final/`.

Unchanged byte-for-byte against the pre-task backup: `workbench.html`, `workbench.css`, `workbench.js`, `gateway.js`, `architecture.js`, `architecture.css`. Shared platform code outside the Lab 02 adapter is also byte-identical. Root originals and 218 protected supporting files pass their existing preservation manifest.

## Browser results

Actual local page: `http://127.0.0.1:3513/personal/kean-v2/workbench.html#tab-2`.

| Test | Result |
| --- | --- |
| All eight choices and original launch controls | PASS |
| Eight exposed and eight relevant-defense evaluations | PASS |
| Genuine original outcome/tracer events and defense restoration | PASS |
| Five node selections and connection inspection | PASS |
| Start, pause/resume, step, completion, reset | PASS |
| Block at ingress and successful path to vault | PASS |
| Zoom, pan, fit | PASS |
| Native selector and graph arrow-key interaction | PASS |
| Real pointer selection of WAF node, then keyboard selection of application | PASS |
| Light/dark graph palette | PASS |
| 1440, 1024, 768, 390px: graph fits, no horizontal page overflow | PASS |
| Replay dot remains at its recorded tier after resizing | PASS |
| Actual 390×900 mobile screenshot | PASS |
| Upgraded XSS replay: zero alerts | PASS |
| Runtime errors captured during all eight scenario tests | PASS: zero |
| Standalone workbench console warnings/errors | PASS: empty during final inspection |
| Lab 05 existing browser suite | PASS: 83 checks |
| All nine original panels/controller scripts and coursework preservation | PASS: byte-exact |
| JS syntax, CSS brace balance, static build, original-file manifest | PASS |
| Paid AI calls, physical microphone, exhaustive other-lab functionality | NOT TESTED in this Lab 02 task |
| Physical mobile device, screen reader, OS reduced-motion setting | NOT TESTED; responsive viewport and keyboard alternatives tested |

The final Sentry browser fixture passed **73 checks**; raw output is `evidence/sentry-final-tests.txt`. Lab 05 output is `evidence/sentry-architecture-regression.txt`. Its unchanged original assignment navigation and coursework checks passed.

The iframe QA container's browser log also retained three unattributed MutationObserver initialization errors across earlier reloads. The fixture's workbench runtime error listener reported zero errors, and the independently opened final workbench console was empty. Their source was not established; this is not claimed as a clean console for the QA container itself.

## Limits

These are inherited teaching rules, not claims about deployed WAF/CSP, authorization or cryptographic effectiveness. Only the all-off and relevant-single-control profiles were exhaustively tested for each vector; every possible defense permutation was not tested. Playback illustrates recorded destinations rather than observing a real network. Comparison intentionally writes original simulator events to the shared Activity Log and temporarily changes shared defense settings before restoring them.

## Preview and evidence

From the website workspace run `node kean-v2/build.mjs`, then `node kean-v2/preview.cjs` if no preview is running. Open the Lab 02 URL above. Use the public demo account shown by the gateway; no real password is needed.

Screenshots: `evidence/sentry-default.png`, `sentry-active.png`, `sentry-blocked.png`, and `sentry-mobile.png`.
