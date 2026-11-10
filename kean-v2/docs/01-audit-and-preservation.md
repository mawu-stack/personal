# K.E.A.N. 2.0 — discovery and preservation

25 October 2026. Scope of this stage: audit, specification and a separate homepage/navigation prototype. No full migration or publication is authorized yet.

## Baseline and evidence

The local `index-cmdk.html` is the authoritative fuller application: 747,843 bytes, nine panels, 201 interactive/control elements, 133 headings, 278 captured content blocks, 22 script elements and 193 syntactic function candidates. These are parser-derived inventories, not claims that every behavior has been runtime-tested. `inventory.json` captures all panel text, headings, controls, dependency URLs, script hashes, event names, globals, storage keys and named/arrow function candidates. Anonymous callbacks, computed names and dynamically generated UI are not exhaustively identified by the function regex; the complete immutable HTML snapshot preserves them. `source-manifest.json` fingerprints 218 supporting source/document files, excluding environments, generated builds, datasets and model binaries. All nine panel hashes are recorded.

Backups: `legacy/index-cmdk.html` and `legacy/index-original.html`, with SHA-256 values in `backup-manifest.json`. The original root files remain untouched. All new work lives under `kean-v2/`, a separate workspace, rather than changing a Git branch with mostly untracked existing files. No files were moved or renamed.

The published GitHub Pages URL was inspected in the browser. It currently exposes six tabs and an any-input demo login with a role selector. The local nine-tab version has newer PBKDF2 demo credentials, Assignment 4, Assignment 6 and DDoS Guard. The live version is therefore not an adequate migration baseline. The web text fetch failed for that URL, but browser inspection succeeded. Publication status of the newer local work is not assumed.

## Feature-to-destination checklist

Every destination below is a proposed future location. In this prototype it links to the unchanged workbench snapshot, not a migrated implementation.

| Existing surface | Preserve | Planned location | Current verification/status |
|---|---|---|---|
| Overview / identity | Mawutorwu Klu, TECH 3498, existing biography, interests, skills, goals, proposal, featured projects and privacy text | Public portfolio Home + About + project stories; originals retained in Coursework | Content inventoried; new homepage copy adds no credentials |
| 01 AuthGuard | Input/sample presets, clear/show, passphrase generator, zxcvbn and custom effective entropy, morphology penalties, NIST guidance, GPU crack estimates, live timer/trend, full audit receipt and explanations | Labs → AuthGuard; result-first workspace + expandable assumptions | Local calculations/estimates, not actual cracking; original scripts untouched |
| 02 SentrySim | All eight vectors, five defense switches, five-tier trust-boundary tracer, TTC engine/presets/live entropy, ingress telemetry copy/clear, forensics and debriefs | Labs → SentrySim; pipeline first, controls beside evidence | In-memory simulations; intentionally vulnerable XSS exercise and mock hardware probe explicitly labeled |
| 03 AI Security | Threat category presets, prompt textarea, guard toggle, prompt-injection transcript, debrief catalog, two-tier human approval, autonomous action sandbox, microphone diagnostics | K.E.A.N. → Security workspace | Local simulation + existing optional provider calls; no claim of production agent enforcement |
| 04 STRIDE | Six threat categories, CVSS/vector data, status/radar synchronization, tier filtering, full matrix, Assignment 2 report export | Labs → STRIDE; overview then evidence table | Real rendering of educational threat data; stored scores, not measured exploit probabilities |
| 05 Secure architecture | Every original sentence, diagrams and all nine required architecture components | Coursework → Assignment 3 architecture case study | Byte-preserved, no rewording |
| 06 Academic coursework | All paragraphs, tables, personal reflections, proposal, resource links, course goals and written answers | Coursework → Original assignments, indexed case-study navigation | Byte-preserved; copy not rewritten for marketing |
| 07 DDoS Guard | Downloaded source provenance, eight features, real tree inference/path, record selector, dataset counts/distributions, metric selector, ROC/CM, measured JSON export, local opt-in history/revisit/delete/clear, response guide | Research → DDoS Guard; direct tool launch | Actual offline ML; no live packet capture, blocking or attack generation; historical mirror limitations retained |
| 08 Assignment 4 | Real demo credential checks, user/admin roles, centralized authorize, 3-failure lockout, in-memory users, profile, logs, announcement, teaching denial, typed chat/self-test, local photo consent/validation/removal, stepper/test evidence | Coursework → Identity & AI; related assistant entry points | Client-side educational authorization; local avatar, not external photo generation; D-ID API integration remains incomplete |
| 09 Assignment 6 | XSS validation/encoding/textContent tests, isolated fixed frame, actual local sink fix, control mapping, DDoS research/results, report/results downloads, diagrams, limitations and reproducibility | Coursework → XSS & research method; linked DDoS study | Ten runtime renderer checks in existing fixture; broader production XSS audit not claimed |
| Shared session/auth | Existing token, 20-minute timer, warning/expiry, clear session/credentials, demo login/logout, central role checks | Existing workbench shell until approved migration | Client-side simulated session; PBKDF2 credentials are throwaway demo accounts |
| Shared command/voice | Single routeCommand, registry and aliases, Cmd/Ctrl+K, fuzzy commands, arrows/Enter/Escape, wake aliases/interim dedup/restart watchdog, turn taking, chime, proactive commentary, diagnostics | Persistent command launcher + assistant dock | Microphone/OS speech availability remains environment-dependent |
| Voice personality | Professional default, Hype wrapper/cosmetic gag, Prime voice discovery/manual select, pitch/rate sliders, no change to technical facts | Assistant → Settings | Original implementation retained; no real-person impersonation claim |
| BYOK providers | Gemini + Claude branches, session-only keys, instant acknowledgment, 6s timeout, honest local fallback, errors, web-search source transparency, workspace field | K.E.A.N. → Connection settings | Implemented paths; no paid provider success verified in this stage; embedded model IDs require live revalidation before migration |
| Presentation and safety UI | Presentation toggle, guarded approval countdown/deny, session-bound actions, highlighting/focus/announcements and effects | Assistant / presentation toolbar | Existing behavior preserved; no new automation permission |
| Activity/state/theme | SecurityState, event hooks, live activity log, filters/clear/copy controls, theme choice, reduced-motion behavior | Workspace context bar + collapsible activity drawer | In-memory telemetry; theme and optional DDoS history are existing localStorage uses |
| Older standalone work | Flutter/FastAPI URL study, notebooks, old datasets, prior backups and exports | Archive, kept in source; not promoted as current DDoS functionality | Historical phishing code is not active research; no deletion authorized |

## Architecture and dependencies discovered

The active app is a large static document with inline CSS/JS and embedded JSON/model data. DOM IDs and script order are behavioral contracts. Routing uses hashes and `switchTab`; `SecurityState`, `sentryState`, `currentSession`, `A4Auth`, the registry and custom `kean:*` events connect features. Several helper source files are older than their embedded counterparts (for example `kean-conversation.js`); copying them over the current app would regress provider support. Use the frozen embedded source, not the oldest similarly named build script.

External assets: Inter via Google Fonts; GSAP 3.12.5 and ScrollTrigger; Lenis 1.1.18; Three.js r134; Vanta Waves 0.5.24; zxcvbn 4.4.2. Authentication uses WebCrypto; voice uses browser recognition, SpeechSynthesis and Web Audio. DDoS browser inference is an embedded decision tree, with offline Python/scikit-learn training. Existing APIs are browser BYOK calls to Google and Anthropic; no backend proxy is introduced by this redesign. Session keys are not migrated into a public bundle or persisted.

## Risks / incomplete verification

1. Nested inline globals and load order make a framework rewrite risky. Keep the legacy runtime isolated until each module has parity checks.
2. Provider model names and search entitlement can change. Source inspection is not a successful paid request. Never label an unconnected prototype as online AI.
3. Public login gates the current portfolio presentation. The new public homepage will stay ungated while actual tool launches keep the existing demo sign-in.
4. Current BYOK client-side keys and client-side roles remain educational constraints. Do not silently claim server-enforced security.
5. Cached older ZIPs/build scripts can overwrite newer work. New workflow stays under `kean-v2`; deployment requires a reviewed artifact and separate approval.
6. Full voice, provider, timeout, lockout, timer and attack-vector regressions are migration gates, not prerequisites satisfied by source hashes alone. Current-stage checks are separately documented.
