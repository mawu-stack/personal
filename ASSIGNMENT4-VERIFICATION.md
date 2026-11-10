# Assignment 4 verification — 2026-10-02

## IMPLEMENTED
- Assignment 4 lab inside the existing Tab 3, with an A4 Lab shortcut and shared command entry.
- Regular User / Administrator selector in the existing demo login. Role is bound to the current in-memory session.
- Central permission checks, interactive authentication/authorization workflow, explicit grant/deny reasons, and existing SecurityState audit events.
- Session-only demo profile, fictional user administration, existing security-log viewer, and safe simulated announcement editing.
- Local Digital Person photo preview, validated PNG/JPEG/WEBP uploads (5 MB; decoded dimensions up to 4096 × 4096), replacement/reset, scan treatment, and upload/generate/talk/ask/response stages.
- Shared K.E.A.N. state indicators, typed question routing, and accurate local/live/search response labels. Late responses cannot repopulate the lab after expiry.
- Responsive cards, light/dark styling, labeled controls, and reduced-motion rule for the scan animation.

## REUSED
Existing login overlay, session token/timer/expiry, SecurityState logger, routeCommand, answerKeanQuestion, provider connection controls, speech synthesis, microphone control, voice status events, command registry and palette. No second chatbot, provider client, recognizer, or credential store was added.

## PRESERVED
The source-diff verifier reconstructs the current file from the backup using only the declared targeted additions. The complete source region containing Tabs 5 and 6 is byte-for-byte equal to the backup. Existing provider request bodies, key handling, AuthGuard calculations, SentrySim attacks, STRIDE data and export code were not rewritten. Original index.html was not edited.

## TEST RESULTS

### Requested checklist
| # | Check | Result / evidence |
|---|---|---|
| 1 | Existing login | PASS — original submit handler and session timer |
| 2 | Regular User login | PASS |
| 3 | Administrator login | PASS |
| 4 | Role retained during session | PASS — changing login selector does not change active role |
| 5 | View profile | PASS |
| 6 | Edit profile | PASS — memory-only demo update |
| 7 | User denied Manage Users | PASS |
| 8 | User denied Security Logs | PASS |
| 9 | Admin Manage Users | PASS — view, role change, disable |
| 10 | Admin Security Logs | PASS — existing RBAC events visible |
| 11 | Admin content management | PASS — literal HTML-like text stays text |
| 12 | Granted authorization logging | PASS — SecurityState |
| 13 | Denied authorization logging | PASS — SecurityState |
| 14 | Expiry invalidates access | PASS — all admin permissions denied; late answer ignored |
| 15 | Photo upload | PASS — File/DataTransfer through actual input change handler |
| 16 | Invalid photo type | PASS — SVG and spoofed PNG rejected |
| 17 | Oversized photo | PASS — over 5 MB rejected |
| 18 | Local preview | PASS — decoded PNG dimensions and blob URL verified |
| 19 | Clear/reset | PASS — source removed and generation reset |
| 20 | Digital Person workflow | PASS — generation, question/response, synthetic voice-state events |
| 21 | Digital Person typed questions | PASS — same routeCommand, honest no-key answer |
| 22 | Existing K.E.A.N. questions | PASS — shared router concept and status answers; speech mocked |
| 23 | Existing palette | PASS — Ctrl+K opens and Enter navigates |
| 24 | Navigation | PASS — all six tabs through transcript-driven routes |
| 25 | Provider controls | PASS — Gemini/Claude switching and disconnect with dummy key; no live request |
| 26 | Unique IDs | PASS — parsed full document |
| 27 | JavaScript syntax | PASS — all inline scripts parsed with Node vm |
| 28 | CSS braces | PASS — all 12 style blocks |
| 29 | HTML5 parsing | PASS — parse5; zero parse errors; one main; structural closing tags verified |
| 30 | Tabs 5/6 unchanged | PASS — byte-for-byte source comparison |

### Browser suites and visual inspection
- PASS: 42 Assignment 4 integration checks. Raw evidence: assignment4-browser-results.txt.
- PASS: 36 existing presentation-mode checks, including approval/denial, countdown, palette/microphone-error pause, normal mode and expiry. Recognition and speech are simulated in this fixture.
- PASS: 43 command/attack regression checks on both updated file and untouched backup. Includes eight attack vectors with voice/click outcome parity, five defense controls, AuthGuard, STRIDE filters and exports, and six-tab navigation.
- FAIL (pre-existing, unchanged): the older “every clickable control has a command” audit finds kean-prime-test. Reproduced against the backup. The test-audio button itself remains present; this is missing command registration, not proof that audio playback fails. No unrelated production fix was made.
- Test-fixture correction: the old STRIDE export check expected “STRIDE THREAT MODEL AUDIT REPORT”; the current report is headed “ASSIGNMENT 2 AUDIT REPORT”. The task-specific fixture checks that current heading. This passed in both baseline and updated versions. Export download creation was intercepted for verification, not written through the browser save dialog.
- PASS: desktop light/dark card contrast visually inspected. Light card surface was corrected during inspection.
- PASS: 390 px viewport stacks the new lab into a single column (343.2 px cards, left edge 16 px). The existing Prime voice settings farther down the page still extend the document width to 445 px; this unrelated pre-existing panel was not restyled.
- Reduced-motion support is present in scoped CSS. OS-level reduced-motion preference and physical assistive-technology behavior were not exercised.

## NOT LIVE-VERIFIED
- Physical microphone recognition accuracy, wake-word reliability in a room, audible voice quality or latency.
- Real Gemini or Claude calls, credentials, credits, quota, web-search results or provider availability. Provider UI and answer-provenance rendering were tested with dummy keys/mock responses only.
- External AI avatar generation: none is connected. The feature explicitly says LOCAL DIGITAL PERSON SIMULATION and uses a temporary local photo. It is not lip-sync or AI image generation.
- Cmd+K on macOS was not physically tested; Ctrl+K was tested on Windows.

The RBAC system is explicitly an educational client-side simulation, not production access enforcement. Roles are self-selected, and all fake-user mutations remain inside the page session.

## FILES CHANGED
Existing application file modified:
- index-cmdk.html

New backup (left unchanged after creation):
- index-assignment4-backup.html
- SHA-256: D63FABD01B2E52BE7F20C263EDECB9CB2A02473201F971A6B177DC36874C8ED9

New implementation/support files:
- assignment4.html
- assignment4.css
- assignment4.js
- build-assignment4.cjs
- assignment4-changes.json
- verify-assignment4.mjs
- assignment4-check.html
- assignment4-voice-check.html
- assignment4-browser-results.txt
- assignment4-preview.png
- ASSIGNMENT4-VERIFICATION.md

The working HTML is self-contained: the implementation source snippets are already embedded. No build or additional script files are needed to open index-cmdk.html. The task-specific builder intentionally uses this task's backup; do not rerun it after making subsequent unrelated edits to the working HTML.
