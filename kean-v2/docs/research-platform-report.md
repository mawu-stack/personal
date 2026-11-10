# K.E.A.N. 2.0 research platform implementation

## Outcome and preservation

Implemented an incremental research-experience pass in the existing vanilla application. The three principal additions are SentrySim's component/path inspector, Secure Architecture's controllable request playback, and DDoS Guard's measured model-error investigator. All nine labs receive consistent field guides and useful navigation. This is an implemented iteration, not a claim that every aspirational visual detail in the master prompt is finished.

Git checkpoint before edits: **ae2202d**. The repository previously had no commits or configured author; this local checkpoint used the explicit one-commit identity `Codex checkpoint <codex-checkpoint@localhost>`. User Git settings were not changed. Only redesign files were staged. Original root files were not edited or deployed.

Static preservation checks confirm that all nine original panel fragments, all original inline controller scripts, both original root HTML files and 218 supporting files remain unchanged. Tab 5/6 coursework remains byte-for-byte verbatim. New presentation elements are added at runtime using safe DOM methods, rather than replacing the original content or event handlers.

## Audit and research

Reviewed the workbench, gateway, compatibility layer, architecture adapter, homepage, build/generator, original auth/session scripts, DDoS controller and actual evaluation artifacts. Prior working features included PBKDF2 demo roles, timed in-memory sessions, nine hash-routed labs, a shared router/command palette, optional BYOK providers, entropy/TTC engines, eight local vectors, local DDoS inference, and isolated XSS tests.

Repository sources, license findings, design references, data provenance and unavailable references are listed in [the research log](research-platform-references.md). All 15 requested repository pages were opened; selected implementation source was inspected. No library was installed. Native DOM controls and existing SVG charts were a better fit than adding a graph/chart framework for these fixed topologies. Existing animation dependencies were neither upgraded nor replaced. Hart and React Bits provided accessible material; Sen and Quang could not be meaningfully reviewed with the research tool. No design or component source was copied.

## Changes by phase

1. Audit/checkpoint: saved a local Git checkpoint and compared against the existing preservation manifests.
2. Stabilization: preserved the previous gateway visibility/race fixes. Fixed the 700px/850px shell keyboard breakpoint mismatch and reconciled orientation metadata that the retained legacy controller rewrites after tab changes. Login now focuses the new field guide when present, with the original heading as fallback.
3. Shell/design: introduced a single overview lead, three real lab entry points, shared field-guide controls and a consistent mint/graphite visual language. Reduced the visual prominence of repeated legacy section titles. Existing overview research content remains below the new lead.
4. SentrySim/Architecture: added actual inspection and playback controls around existing nodes and handlers. Timers stop on pause, lab exit, page hiding or session end.
5. DDoS Guard: reads `DDoSGuard.results`, adds model selection and selectable error counts, explains false alarms/missed attacks, and retains all original measured distributions, ROC curves, comparison charts, inference, methodology and history. Adds the movie's honest missing-asset state and optional local player configuration.
6. Other labs: added engine-derived entropy summary, STRIDE concept inspector, coursework section navigation and educational trust-boundary sequences for AI, identity and XSS. No technical coursework paragraphs reworded.
7. QA: executed responsive, interaction, preservation and regression checks, fixed confirmed issues, and recorded evidence. No deployment.

## Per-lab implementation

| Lab | Added or improved | Retained |
|---|---|---|
| 01 AuthGuard | Field guide; summary observes original strength/entropy output | Algorithms, crack-time estimates, assumptions, samples, generation, mathematical details and audit receipt |
| 02 SentrySim | Five tier inspectors; previous/next/play/pause/reset walkthrough; selector delegates to eight original attack buttons; readable topology grid | Actual local simulation, packet animations, defense controls, TTC, feedback and telemetry |
| 03 AI Security | Trust-boundary sequence and direct interaction link | Prompt presets/testing, guardrails, provider/voice logic and session-only keys |
| 04 STRIDE | Six-category explanatory inspector, with no invented risk scores | Original filtering, scores/classifications, mitigations, report and controls |
| 05 Architecture | Request playback reuses original next/reset; component numbers and public/private boundary context | All nine nodes, verbatim inspector, original request walkthrough and complete proposed architecture assignment |
| 06 Coursework | Editorial field guide and buttons linking to original sections | All coursework and original assignment navigation |
| 07 DDoS Guard | Selectable model-error cells, counts and explanations; clearly labeled held-out evaluation; movie section | Actual dataset/model/metrics, ROC, distributions, comparison, local tree inference, history and guidance |
| 08 Identity & AI | Authentication → permission → execution conceptual sequence | Original role checks, central authorize(), chatbot, self-tests and digital person workflows |
| 09 XSS & Research | Untrusted-input → inert-output conceptual sequence | Safe rendering, built-in control suite, experiments and research artifacts |

Walkthrough playback is explicitly illustrative. It does not generate attack results or send network traffic. The new simulation launcher delegates to original controls and honors their disabled state. No key field is read by the new adapter.

## Bugs found and fixed

- Desktop orientation could be overwritten by the original 700px controller after navigation. The adapter now restores the orientation appropriate to the shared 850px layout without a mutation loop.
- Overview visibility initially treated the active overview as an active lab. It now distinguishes `panel-tab-*` from `panel-overview`.
- Visual QA found legacy conduit columns squeezing SentrySim text into narrow strips, despite no page-level overflow. The topology now allocates readable node columns, moves conduit details into the inspector, and stacks at narrower widths. Tier badge dimensions were normalized.
- Browser fixtures were updated to allow asynchronous MutationObserver reconciliation and to exclude added presentation guides when comparing original academic text.

## Browser verification

| Major area | Result | Evidence/limits |
|---|---|---|
| New research interactions and four target widths | PASS | 78 assertions: nine labs at 1440/1024/768/390px; node readability, inspectors, playback/reset/exit, both model matrices, guide links, overview, themes and duplicate IDs |
| Shared layout/retained lab controls | PASS | 54 assertions: 390/768/1200px plus header clearance through 1280px; AI preset/dialog, STRIDE filtering, local DDoS prediction, actual XSS suite, role denial, history and contrast tokens |
| Gateway lifecycle | PASS | 34 assertions: all hiding mechanisms, immediate focus/inert release, rapid logout, four cycles, expiry helper, sign-in after expiry and missing logout target |
| Full visitor journey/both demo roles | PASS | 59 assertions: actual public PBKDF2 logins, actual 30-second lockout, incomplete/failed attempts, hashes, refresh, logout, history and fresh deep links |
| Architecture | PASS | 22 assertions: nine node inspectors, verbatim text, next/reset, original assignment navigation and mobile diagram |
| Original parity | PASS | 61 assertions: entropy/audit/password controls, TTC combinations, eight vector feedback outputs, defense toggle, nine routes, regular-user denial and command palette |
| Forced reduced motion | PASS | 5 assertions; isolated preference fixture, not a real OS preference change |
| Missing assets, syntax and CSS | PASS | 18 local references resolve; 13 original inline JS blocks compile; adapters compile; HTML/unique IDs/CSS braces clean |
| Live Gemini/Claude, speech hardware and remote avatar services | NOT TESTED | No API keys or physical microphone/audio test used |
| Real mobile hardware and screen reader | NOT TESTED | Responsive checks use browser iframe widths; semantic controls/focus tested, not a full assistive-technology audit |
| Actual movie playback/captions/poster | NOT TESTED | Exported assets not supplied |
| Production/published site | NOT TESTED | No deployment authorized or performed |

**313 passing browser-fixture assertions** across the seven suites above. Logs are `evidence/research-{platform,stabilization,lifecycle,journey,architecture,parity,motion}.txt`. Results cover exercised controls and feedback, not every permutation of every original feature. Expiration used the original helper rather than a 20-minute wall-clock wait. Automatic theme control was exercised; OS light/dark preference transitions were not independently simulated.

## Performance and accessibility

No new framework, icon package, graph engine, chart engine or network dependency. `platform.js` is approximately 16 KB uncompressed. It uses event-driven DOM updates, semantic buttons/selects, labels, status text, plain-text rendering and explicit playback controls. Playback stops when no longer relevant. Original reduced-motion behavior remains; new controls do not introduce continuous visual effects or animation loops at load.

Shared light/dark canvas text tokens pass 4.5:1 contrast checks. This is not a claim that every inherited inline color passes a full accessibility audit. Existing external fonts/scripts and the large monolithic legacy file remain performance limitations. Lighthouse, Core Web Vitals, CPU throttling and cross-browser benchmarking were not run; no performance score is claimed.

## Files changed

- `platform.js` — new presentation/investigation module.
- `workbench.css` — shared research styles, hierarchy, responsive topology and badge corrections.
- `workbench.js` — responsive keyboard/orientation reconciliation.
- `gateway.js` — prefer field-guide focus after sign-in, preserving original fallback.
- `consolidate.mjs` and generated `workbench.html` — add the new module after original scripts.
- `build.mjs` — include module and new local fixture.
- `verify-migration.mjs` — explicitly allow/compile the new adapter while preserving all original script/panel comparisons.
- `platform-check.html`, `verify-platform.mjs` — new tests, including model arithmetic/provenance checks.
- `architecture-check.html` — compare original text after removing the new presentation guide from the test clone.
- `docs/research-platform-references.md`, this report, and evidence — research decisions, execution notes and screenshots.
- `dist/` — regenerated local preview output only.

`gateway.css`, `legacy-compat.css`, `architecture.js`, homepage HTML/styles/scripts and original files remain unchanged in this pass. No additional broad `!important` rules were added.

## Screenshots

Baseline from the previous stabilized workbench: [before](../evidence/gateway-visibility-fixed.png).

Implemented iteration: [overview](../evidence/research-overview-after.png), [SentrySim](../evidence/research-sentry-after.png), [DDoS field guide](../evidence/research-ddos-after.png). Screenshots show desktop browser views; the responsive assertions cover the other target widths.

## Assignment 7 movie and remaining work

The actual **UNDER SIEGE — The Anatomy of a DDoS Attack** video is **not complete or embedded**. The section has an honest missing-asset state. Local native-video/poster/caption support is implemented but unverified until actual exports are supplied and added to the build/server. No Flow account was accessed and no generation or upload was performed. The assignment cannot be declared complete or verified on a published site.

The main interaction improvements are implemented. Optional graph-engine zoom/pan, further art direction, richer validated AI-specific status displays and comprehensive per-control/cross-browser/accessibility/performance audits remain possible future work; they are not claimed here as delivered. The homepage retains its existing explorer and motion system. No simulated telemetry, invented dataset metrics or new backend authentication was introduced.

## Preview and deployment readiness

Run `node kean-v2/build.mjs`, then `node kean-v2/preview.cjs` if the preview server is not already running. Open http://127.0.0.1:3513/personal/kean-v2/workbench.html#overview and use the public demo accounts displayed on the gateway. No real credentials are needed for these tests.

Ready for local review. Not declared production-ready, not a production authentication system, and not deployed. Publication still requires explicit approval, real movie assets if required for submission, and any desired live-provider/device checks.
