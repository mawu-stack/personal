# Phase 2 verification update

User approval for incremental migration has been received. Current results: 61 side-by-side parity/smoke checks, 32 homepage checks and 3 isolated reduced-motion branch checks. See [phase2-report.md](phase2-report.md) and evidence/phase2-*.txt for exact scope. Original files and controllers remain byte-preserved; the remainder of this document records the earlier prototype stage. Paid providers, physical voice and final deployment are still unverified/not performed.

# Current-stage verification

25 October 2026. Scope: discovery, design and separate homepage/navigation prototype. This is not a claim that the full redesign is migrated or production-ready.

| Check | Result / evidence |
|---|---|
| Root entry files unchanged | PASS — both SHA-256 values equal baseline manifest; separate backup copies are byte-identical |
| Existing supporting source untouched | PASS — 218 files match pre-prototype fingerprints |
| All nine panels, content and original code retained | PASS — complete original HTML snapshot, per-panel hashes/content inventories; all nine launch destinations exist |
| Prototype HTML and semantics | PASS — parse5 reports no parse errors; unique IDs; one H1 and main; skip link, native controls/dialog and accessible labels |
| JS, JSON and CSS | PASS — scripts compile; braces balanced; DDoS preview values exactly match existing experiment JSON |
| Local static build | PASS — 13 allowlisted files plus .nojekyll; no package installation; tested under repository-prefixed URL |
| Interactive project selectors | PASS — title, description, pressed state and real tool launch destination update |
| Explorer search | PASS — all nine destinations, keyword/fuzzy filtering, helpful empty state, arrow selection and Ctrl+K |
| Modal focus | PASS — search receives focus, close restores opener; real Escape key dismissal also exercised |
| Optional field motion | PASS — real UI click lazy-loads the motion script, sets pressed state, produces an observed matrix3d transform; Pause returns to static state. Overlapping art click interception found during review and fixed with pointer-event/z-order rules |
| 390 / 768 / 1280 layout | PASS — browser fixture renders the actual page in each width, checks no horizontal page overflow, single-column mobile hero and working mobile menu. Physical phones/tablets not exercised |
| Visual review | Desktop hero, full page and selected-work section inspected. Screenshots under evidence/. The browser viewport override did not change the native screenshot size; no desktop image is represented as a mobile screenshot |
| Reduced motion | Source-reviewed: CSS removes animation/transition/smooth scroll; JS disables motion when preference matches and stops on preference change. Actual OS/browser reduced-motion preference not changed/tested; pending manual accessibility review |
| Provider and credential boundaries | Prototype makes no external API requests and collects no credentials. Existing BYOK code preserved in snapshot. No paid Gemini/Claude call certified in this stage |
| Full legacy runtime parity | Pending approved migration — source identity protects behavior but is not a fresh test of every calculation/vector/export/session path |
| Physical voice | Not exercised in this stage; existing recognition/speech/personality code unchanged |
| File URL browser verification | Not exercised: browser automation permits HTTP(S) and rejected direct file navigation. Local HTTP prefixed build was tested instead |
| GitHub Pages publication | NOT PERFORMED. Relative paths/build are locally checked; live publication requires explicit approval |

Browser fixture: **26 checks passed**, saved in `evidence/browser-results.txt`. Check the raw result for exact assertions; they do not include paid providers, physical microphone, a screen-reader audit or full legacy feature regression. Static checks: `node kean-v2/verify.mjs`. Build: `node kean-v2/build.mjs`.

## Remaining gate

The supplied brief says: “Wait for my approval before migrating the complete application or replacing any existing files.” This stage stops at the finished separate prototype and documentation. Review the visual direction and navigation, then approve migration if desired. No live website replacement is implied.
