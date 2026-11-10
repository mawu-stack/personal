# Assignment 4 tab upgrade — 22 October 2026

Working file: `index-cmdk.html`. Backup created before the first edit: `index-a4-backup.html` (SHA-256 `F4B76832E6020CF73B5F9D1ADDBB707C9902EF2C0B686AF45E5BCE3D4D82DDF4`).

## Completed

- Moved the existing Assignment 4 lab from Tab 3 into Tab 08, with navigation, sticky section links and shared command-registry aliases.
- Replaced any-input sign-in with two credential records containing salted PBKDF2-SHA256 hashes at 120,000 iterations. The login screen deliberately publishes the throwaway lab credentials. No plaintext password appears in the credential table or audit.
- Added generic failure messages, three-failure/30-second lockout, attempt logging, assigned roles and an in-memory session object. The existing 20-minute timer remains in use. Logout/expiry revokes the new session.
- Central `window.authorize(action)` evaluates current session, expiry, enabled state and current account role at execution. Existing A4 protected handlers call it through their common check function. Administrator includes personal permissions. Shared voice/palette actions use the same authorization path.
- Added authentication/authorization teaching text, admin denial demonstration, actual in-memory user administration, full audit display, and a safely rendered announcement banner.
- Added typed chat history, Enter-to-send, and five fixed questions with response arrival, elapsed time, provider and fallback/error notes measured at runtime through the existing provider pipeline.
- Added required photo permission checkbox and generation gating. Existing type/signature/size/decode validation, local preview, removal and object-URL revocation remain in place.

## Executed verification

- `node verify-a4-v2.mjs`: PASS after each phase and final repairs. HTML5 parse, unique IDs, one main landmark, JavaScript syntax and CSS brace balance pass. Tabs 5/6 source is byte-identical. The complete file reconstructs from the backup using only the recorded edits.
- `node a4-auth-unit.cjs`: PASS with actual WebCrypto-compatible PBKDF2 verification, lockout/time advance, user/admin permissions, disabled account, role demotion, expiry and audit assertions.
- Browser fixture `a4-v2-check.html`: 37 checks PASS. Evidence: `a4-v2-browser-results.txt`. Includes actual credential login, shared-router authorization denial, all seven existing tabs, five runtime no-key chatbot responses, announcement escaping, malformed/oversized photo rejection, consent gating, local generation and removal.
- Desktop preview visually inspected, screenshot `a4-v2-preview.png`.

Voice navigation was exercised through its shared router, not a physical microphone. Live paid Gemini/Claude calls were not made; their request/acknowledgment/timeout/fallback implementation was preserved. AuthGuard/SentrySim/STRIDE algorithms were preserved in source, not exhaustively re-executed by this new fixture. The login/role changes intentionally supersede the earlier any-input/self-selected-role test assumptions.

## Awaiting missing directive

The user message ends at “(A) D-ID API mode (BYOK key, session memory only). BEFORE building, verify against”. The remaining API requirements and generation modes B/C were not supplied. No D-ID integration, external photo upload, or fabricated generation capability was added. The current digital person remains clearly labelled a local visual demo. Complete the generation phase after receiving the missing text.

Preview: `node a4-v2-preview.cjs`, then `http://127.0.0.1:3510/index-cmdk.html#tab-8`. The HTML itself remains a standalone file; no build step is required to open the workbench.
