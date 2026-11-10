# Gateway integration stabilization

Local redesign workspace only. No deployment or original website changes.

## Changes

- `gateway.js`: visibility follows `.hidden`, the HTML hidden attribute, computed display/visibility/opacity, connection and rendered geometry. Mutation and transition listeners release the focus boundary promptly. Session start clears gateway-owned background inert states synchronously and restores workbench focus. Previously inert elements retain their prior state.
- `gateway.js`: the invisible gateway itself becomes inert. Required form/title/header nodes are checked before any presentation mutation. Optional navigation and missing original logout controls fail gracefully. Focus targets are checked before use.
- `gateway.js`: fixed an additional reproduced race: logout within the original login controller's 300ms animation delay reopened the gateway, then the stale timer hid it again. The adapter now preserves the newer session-end presentation state. Authentication, hashes, token issuance, timeout and role logic are unchanged.
- `gateway.css`: a single scoped `[inert]` pointer-events rule prevents an invisible gateway from receiving clicks. No new `!important` rules.
- `workbench.js`: required navbar/header/main references are guarded, optional arrow navigation targets checked, and ResizeObserver has a capability guard.
- `build.mjs`: includes two local regression fixtures, `visibility-check.html` and `guard-check.html`.
- Added regression evidence and this report. `fix-gateway-visibility.mjs` records the initial targeted edit operation; do not rerun it as an application entry point.

`workbench.html`, `workbench.css`, and `legacy-compat.css` were inspected and required no changes in this pass. Six target files were backed up in `backups/pre-gateway-visibility-fix/` before changes.

## CSS architecture

Actual browser CSSOM confirms every compatibility rule is contained in one `@layer legacy` block. Loading order is `legacy-compat.css`, `workbench.css`, then `gateway.css`. The unlayered shared design system takes precedence over layered legacy specificity; the gateway stylesheet follows the shared system. Compatibility extraction removes legacy stylesheet priority declarations reproducibly. The remaining shared priority declarations are unchanged. Computed-style tests confirm the gateway input styles, shared light/dark canvas, sidebar position, and architecture node treatment win over legacy rules. No broad override or legacy deletion was needed.

## Executed browser tests

| Suite | Result | Coverage |
|---|---|---|
| Visibility/lifecycle | 34 PASS | Five hiding mechanisms; immediate inert and focus release; dynamic background control; rapid logout; four repeated cycles; original expiration helper; sign-in after expiry; missing logout target |
| Shared layouts/labs | 54 PASS | All nine tabs at 390/768/1200px; header clearance through 1280px; keyboard sidebar; themes; AI prompt preset/connection dialog; STRIDE filter; browser history; actual local DDoS inference and model rows; built-in XSS tests/safe text rendering; regular-user authorization denial |
| Visitor journey | 59 PASS | Homepage link; gateway; native required validation; generic failed-login messages; actual 30-second lockout; public student/admin PBKDF2 verification; role/token/timer; all nine hashes; logout; refresh; history; all nine fresh direct links; unique IDs |
| Original parity | 61 PASS | Password entropy/strength/audit/visibility/clear/generation; TTC combinations; all eight SentrySim vector telemetry outputs; SQL defense; nine tab destinations; central authorization; command palette; mobile navigation |
| Missing DOM fixtures | 10 PASS | Individually removed gateway/card/form/button/inputs/title/subtitle/header; missing workbench navbar header; no exceptions or partially applied gateway |
| Reduced motion | 5 PASS | Forced preference fixture, disabled entrance/input animations, navigation, no adapter Web Animations |

Total: **223 passing fixture assertions**. Additionally, native keyboard Ctrl+K, search and Enter navigated the signed-in preview to Secure Architecture; its browser error log was empty. Logs: `evidence/gateway-fix-{visibility,layouts,journey,parity,guards,motion}.txt`. Screenshot: `evidence/gateway-visibility-fixed.png`.

The first rapid-logout regression failed and was fixed before the final passing run. A parity run was accidentally started twice after a browser action timed out, producing an invalid toggle-state failure; a fresh page with a single run passed all 61 assertions. Vector parity tests cover actual control feedback, not every possible defense branch.

## Static checks and preservation

`verify-migration.mjs`, `verify.mjs`, `check-inline.mjs`, `check-local-assets.mjs`, and `build.mjs` pass. CSS braces balance; adapter syntax and all 13 original inline script blocks compile; 17 local asset references resolve. All nine original panel fragments, coursework and controller scripts remain byte-exact. Both root HTML files and 218 protected supporting source files match the preservation baseline.

## Limits

Paid Gemini/Claude requests, physical microphone recognition/audio, camera/photo services, real mobile hardware, and a screen-reader session were not tested. Responsive checks use browser iframe viewport widths. Reduced motion is forced in an isolated fixture, not an OS preference change. Expiration calls the existing controller helper; a full 20-minute wall-clock wait was not performed. This remains a client-side demo authentication simulation, not production authentication.

## Local preview

From the website directory run `node kean-v2/build.mjs`, then `node kean-v2/preview.cjs` if the preview is not already running. Open http://127.0.0.1:3513/personal/kean-v2/index.html or the workbench deep link. Use the public demo credentials displayed in the gateway. The original site has not been modified or deployed.
