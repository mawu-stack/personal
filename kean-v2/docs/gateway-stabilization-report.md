# K.E.A.N. 2.0 — Workbench stabilization and login gateway

Completed 2026-10-26. All development is isolated in `kean-v2`. No original website files or live deployment were modified. No authentication backend was added and no login was bypassed.

## Phase 1 — audit and stabilization completed before gateway implementation

Backup: `backups/pre-gateway-stabilization/` contains 72 source/dependency/document files with SHA256 manifest. It excludes generated dist and historical evidence. The immutable original snapshots remain available separately.

`docs/gateway-dependency-audit.json` records 11 declared external assets and 13 inline JavaScript controllers. Original dependencies include GSAP, ScrollTrigger, Lenis, Three/Vanta, zxcvbn and Google Fonts. No new third-party library was introduced.

Fixed the legacy startup that overwrote saved theme selection: the presentation adapter captures only the existing `cyberworkbench-theme` preference and restores it after legacy initialization. Provider keys and session tokens remain in memory; no new credential storage was introduced.

The rail now measures the actual header height with ResizeObserver, so a wrapped tablet header does not cover navigation. Control borders have stronger contrast. Existing light/dark aliases remain in one shared theme. Both themes' primary, muted and accent text tokens exceeded 4.5:1 against their canvas in the fixture. This is a token check, not a certification of every possible UI state.

Retained compatibility CSS: rare admin, failure, voice and simulation states still depend on it. No unverified wholesale CSS deletion was made. Active login rules now have one component owner in gateway.css; obsolete login rules were removed from the shared presentation stylesheet after the new component was implemented and tested.

Before Phase 2, executed 54 stabilization checks, 61 original-versus-derived checks and 22 architecture checks: all passed.

## Phase 2 — traced and redesigned existing login

The homepage's project/Workbench links target `workbench.html#overview` or `#tab-N`. The generated page retains the original `#simulated-login-overlay`, `#sim-login-form`, username/password IDs, native required validation and inline submit handler. `handleSimulatedLoginSubmit()` calls the existing `A4Auth.authenticate()` PBKDF2 verifier (120,000 iterations), issues the original in-memory token and starts the 20-minute timer. The original logout control calls the existing expiry/session-end handler, which reopens the same overlay.

The new gateway is a full-screen graphite/mint interface with homepage typography, technical illustration, public demo credentials, portfolio return and a prominent client-side simulation notice. It reuses the actual form and its listeners. It does not simulate a successful login or create another credential path.

Presentation behavior added: username focus on entry, Tab/Shift+Tab containment, inert background, suppression of the background Ctrl+K shortcut while signed out, focus restoration after successful sign-in, closure of open native dialogs when the gateway reopens, and cleanup of stale success text at logout. A top-bar Log out button clicks the existing logout control. Authentication, role policy, lockout and session algorithms are unchanged.

## Phase 3 — executed tests and actual results

| Suite | Result | Coverage |
| --- | --- | --- |
| Gateway journey | 59 PASS | Real homepage link, gateway/form uniqueness, native empty/incomplete validation, generic invalid-user/password errors, password clearing, actual wall-clock 30-second lockout, successful student/admin logins, token and timer, nine lab destinations, logout, focus boundaries, role authorization, back/forward, refresh and nine fresh direct links |
| Post-gateway workbench | 54 PASS / 0 FAIL | All nine tabs at 390/768/1200 px; measured header clearance at 390/768/1024/1280; theme tokens; palette blocking only while signed out; AI prompt autofill and connection modal; STRIDE filtering; actual DDoS inference/decision path; actual built-in XSS tests; safe rendering; Regular User admin denial; navigation/history |
| Post-gateway original parity | 61 PASS | Public demo sign-in, four password inputs/calculation outputs, full audit receipt parity, generator/visibility/clear, TTC calculation profiles, eight simulated attack feedback comparisons, SQL defense control, nine destinations, authorization denial, Ctrl+K and mobile layout |
| Post-gateway architecture | 22 PASS | Nine nodes and verbatim explanations, request path and reset, original assignment navigation/focus, full walkthrough, deep link, theme and mobile layout; fixture now signs in before interacting |
| Reduced-motion fixture | 5 PASS | Existing reduced-motion CSS branches activated in an isolated copy, no gateway entrance/input transitions, navigation works and no Web Animations requested by adapters |
| Static integrity/build | PASS | Original files and 218 supporting sources unchanged; all nine panel fragments and every original controller byte-identical; HTML parser/IDs; CSS brace balance; 13 inline scripts and added JS compile; static production build |
| Local asset references | PASS | 17 distinct declared local references, none missing |
| Inspected preview console | PASS | No warning/error entries returned after the exercised visitor flow |

The gateway test used the actual PBKDF2 calculation and waited for the actual lockout; it did not override the clock or hardcode a result. A separate browser interaction also signed in using Enter and navigated the actual sidebar.

The saved theme survives refresh. The gateway retains its branded dark palette independently; the selected workbench theme appears after sign-in. Refresh intentionally ends the nonpersistent demo session and requires sign-in again while preserving the requested hash.

## Remaining limits

No failures remain in the listed checks. Live Gemini/Claude requests, API billing/grounding, physical microphone/speaker behavior, external avatar generation, every attack/defense permutation and actual report-file downloads were not newly verified. Their original code was retained. Reduced-motion testing used an isolated forced-preference fixture, not an OS preference change. Responsive widths were tested in browser frames, not physical phones. No full assistive-technology audit or complete sitewide contrast certification is claimed.

The legacy logout control still uses the original session-expiry handler and its existing activity-log wording. This was preserved rather than rewriting authentication in a presentation task.

## Screenshots and raw results

Login before:
![Previous login](C:/Users/nicka/Documents/ChatGPT/website/kean-v2/evidence/login-gateway-before.png)

Login after:
![Branded gateway](C:/Users/nicka/Documents/ChatGPT/website/kean-v2/evidence/login-gateway-after.png)

Workbench before:
![Workbench before](C:/Users/nicka/Documents/ChatGPT/website/kean-v2/evidence/workbench-gateway-before.png)

Workbench after:
![Workbench after](C:/Users/nicka/Documents/ChatGPT/website/kean-v2/evidence/workbench-gateway-after.png)

Raw evidence is in `evidence/gateway-journey.txt`, `gateway-reduced-motion.txt`, `post-gateway-stabilization.txt`, `post-gateway-parity.txt`, and `post-gateway-architecture.txt`.

## Preview and rollback

From `C:\Users\nicka\Documents\ChatGPT\website`:

```
node kean-v2/migrate.mjs
node kean-v2/build.mjs
node kean-v2/preview.cjs
```

Open http://127.0.0.1:3513/personal/kean-v2/ . The current preview server is already running; do not start another on the same port. Direct architecture link: http://127.0.0.1:3513/personal/kean-v2/workbench.html#tab-5 . Use localhost for WebCrypto and relative asset loading.

Public throwaway accounts: student / StudentDemo!2026 and administrator / AdminDemo!2026. Never use a real password in this simulation.

For rollback, restore the changed source files from `backups/pre-gateway-stabilization/` and rebuild dist. The previous HTML does not reference gateway.css/gateway.js. Do not restore over root original files. Nothing was published.

## File-by-file changes

The generated inventory below compares this workspace's source against the pre-task backup. Dist is the generated copy of build.mjs's allowlist; evidence images/text and the backup manifest are separate artifacts.

| File | Status | Purpose |
| --- | --- | --- |
| `add-gateway-check.mjs` | Added | Local implementation/verification helper; not loaded by the website. |
| `add-gateway-motion.mjs` | Added | Local implementation/verification helper; not loaded by the website. |
| `architecture-check.html` | Changed | Signs in before protected interaction tests. |
| `audit-gateway.mjs` | Added | Local implementation/verification helper; not loaded by the website. |
| `build.mjs` | Changed | Explicit local build allowlist extended. |
| `check-local-assets.mjs` | Added | Local implementation/verification helper; not loaded by the website. |
| `consolidate.mjs` | Changed | Deterministic generator includes gateway stylesheet and script. |
| `docs/gateway-dependency-audit.json` | Added | Dependency and login-flow trace. |
| `docs/gateway-stabilization-report.md` | Added | Deliverables, evidence, test scope and local preview instructions. |
| `gateway-check.html` | Added | 59 authentication/visitor journey tests using actual verifier and lockout. |
| `gateway-motion-check.html` | Added | Five isolated reduced-motion branch tests. |
| `gateway.css` | Added | Responsive fullscreen gateway component and reduced-motion styling. |
| `gateway.js` | Added | Existing-form enhancement, branded shell, focus/inert handling, original logout delegation. |
| `integrate-gateway.mjs` | Added | Local implementation/verification helper; not loaded by the website. |
| `package-gateway-report.mjs` | Added | Local implementation/verification helper; not loaded by the website. |
| `refine-gateway-focus.mjs` | Added | Local implementation/verification helper; not loaded by the website. |
| `refine-gateway.mjs` | Added | Local implementation/verification helper; not loaded by the website. |
| `stabilization-check.html` | Added | 54 actual lab/layout/theme tests. |
| `stabilize-shell.mjs` | Added | Local implementation/verification helper; not loaded by the website. |
| `verify-migration.mjs` | Changed | Preservation checks extended to gateway assets and narrowly allowed theme preference read. |
| `workbench.css` | Changed | Shared contrast/layout stabilization; login styling ownership moved to gateway component. |
| `workbench.html` | Changed | Regenerated derivative with new gateway asset references. |
| `workbench.js` | Changed | Saved theme restoration and measured header clearance; existing router retained. |
| `docs/gateway-change-manifest.json` | Added | Complete changed/new source inventory. |
| `README.md` | Changed | Points to the current gateway/stabilization delivery report. |
