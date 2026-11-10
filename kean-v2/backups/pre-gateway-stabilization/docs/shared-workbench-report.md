# K.E.A.N. 2.0 — Shared workbench consolidation

Implemented only in `kean-v2`. Root original website and live deployment were not modified.

## Architecture tested first
Before changing the visual system, executed the browser architecture fixture: **22 PASS**. It selected all nine components, compared every explanation with the original assignment, advanced the four request steps, reset the path, opened #tab-5, activated the original-assignment navigation and checked focus on its original heading. The full original walkthrough remains available. The same 22 checks passed after consolidation.

## Actual changes
- `consolidate.mjs`: parses the frozen HTML with parse5 and extracts its 15 CSS blocks to `legacy-compat.css`, inside `@layer legacy`. A lexical scanner demotes old stylesheet `!important` flags outside strings/comments. No controller script or coursework paragraph is rewritten. Normal unlayered presentation rules now win over legacy specificity.
- `workbench.css`: replaces the previous accumulated workbench and integration override rules with one shared stylesheet. Homepage colors, Inter typography, monospaced labels, light theme tokens, surfaces, controls, content spacing, reading layouts, architecture inspector and diagram are defined here. Seven priority declarations remain for inline cosmetic inputs, the hidden attribute and reduced motion; the previous two redesign stylesheets contained 279.
- `integration.css`: retired to a short explanatory comment; no longer loaded. It is not a second active theme.
- `workbench.js`: reuses and reparents the original nine tab controls into a labeled, scrollable rail; adds a clear homepage return, current-section indicator, skip link and desktop Up/Down navigation. Mobile uses a horizontal scrollable lab strip. Existing tab IDs, click handlers, commands, hashes and routing remain in place. Floating controls have reserved space below the rail.
- Shared surfaces now cover the actual audited card classes, including password metrics, defenses, telemetry, AI labs, STRIDE, Traffic and academic labs. Architecture controls no longer inherit forced blue pill styles. Academic notes use a mint rule; original component explanations use open reading columns rather than another wall of raised cards.
- Fixed mobile minimum-content sizing in fieldsets/selects and wrapped long code/text. Theme canvas changes are immediate, avoiding stale intermediate colors.
- `migrate.mjs`: now regenerates the consolidated derivative from the frozen source. `build.mjs` includes the compatibility stylesheet and verification fixture.

## Preservation and static verification
**PASS**: root `index-cmdk.html`, root `index.html`, frozen originals and 218 supporting source files match their baseline hashes.
**PASS**: all nine original panel source fragments remain byte-for-byte exact, including Tab 5/6 academic content.
**PASS**: every original script remains byte-for-byte exact. No changes to SecurityState, AuthGuard, SentrySim, STRIDE calculations/data, session/role logic, command routing, personality, voice or BYOK provider code.
**PASS**: parse5 HTML/unique-ID checks; CSS brace balance; 13 inline JavaScript blocks compile; presentation JS syntax checks.
**PASS**: local static production build. No deployment or publication.

## Browser verification
| Suite | Outcome | What was exercised |
| --- | --- | --- |
| Architecture before/after | 22 PASS each | Nine nodes and exact explanations, next/reset, original assignment focus/navigation, full walkthrough, deep link, light tokens, mobile inspector |
| Shared interface | 42 PASS, 0 FAIL | Single stylesheet, legacy extraction, resolved blue-node conflict, original navigation reuse, all nine tabs at 390/768/1200 px, desktop arrows, light/dark canvas, AI prompt autofill and connection dialog, STRIDE tier filter, history back/forward, runtime errors |
| Original-versus-derived | 61 PASS | Actual public demo sign-in and role, password calculations and audit receipt parity, generator/visibility/clear, TTC calculations, all eight vector feedback comparisons, SQL control, nine destinations, authorization denial, Ctrl+K, mobile AuthGuard and return link |
| Preview console | PASS | No warning/error entries returned for the inspected final preview |

Initial responsive checks exposed the AI fieldset/long-text minimum width; corrected in the shared stylesheet. Early keyboard/theme assertions ran during existing view transitions; checks now wait for the requested active panel. Immediate theme rendering removed a stale intermediate canvas color. Final suites have no remaining failures.

Limits: iframe widths exercise responsive CSS, not physical mobile hardware. Vector tests exercise the recorded configurations, not every defense combination. Live Gemini/Claude requests, microphone/speaker output and actual report downloads were not newly tested. Their original code is retained; this report does not mark them as live-tested.

## Evidence
- [Before shell](../evidence/shared-before.png)
- [After shell](../evidence/shared-after.png)
- [Before architecture](../evidence/architecture-before-consolidation.png)
- [After architecture](../evidence/architecture-after-consolidation.png)
- [Shared browser assertions](../evidence/shared-check-final.txt)
- [Architecture assertions](../evidence/architecture-check-final.txt)
- [Original parity assertions](../evidence/parity-check-final.txt)

Images are genuine browser captures at the same desktop window size; they are not mockups. Different section heights produce slightly different vertical framing.

## Reproduce and rollback
Run from the website workspace:

```
node kean-v2/migrate.mjs
node kean-v2/verify.mjs
node kean-v2/verify-migration.mjs
node kean-v2/check-inline.mjs
node kean-v2/build.mjs
```

Browser fixtures: `architecture-check.html`, `shared-check.html`, and `migration-check.html` under the local preview. The parity fixture requires its Run button.

Pre-change files and docs are in `backups/pre-css-consolidation/`. Restore the workbench HTML/CSS/JS, integration CSS, build and migration/verification scripts from there, then rebuild. The added compatibility file is unused by the previous HTML and can remain while reviewing rollback. Never restore over root original files.

No new external component library or asset was introduced. The retained legacy animation/tool dependencies remain; this task does not claim full dependency removal or a framework rewrite.
