# K.E.A.N. wake reliability and live search verification

Verified 2026-09-26. Deliverable: `index-cmdk.html`. Rollback: `index-kean-reliability-backup.html`.

## Part 1 — PASS

- PASS: Interim recognition enabled; ten simulated isolated wake utterances produce ten acknowledgments without waiting for finalization.
- PASS: Repeated interim fragments do not duplicate acknowledgments.
- PASS: All event results are examined; final commands execute once, and revised interim commands never execute.
- PASS: Dropped interim wake can arm a subsequent final command.
- PASS: Presentation approval replies require final recognition.
- PASS: Immediate recognition restart; missing onstart causes one retry at two seconds, with a warning. Failure after retry stops cleanly. Manual stop prevents retries.

## Part 2 — PASS

- PASS: Gemini REST request uses the native `tools: [{google_search: {}}]` configuration and `x-goog-api-key` header. Checked against [Google's current grounding documentation](https://ai.google.dev/gemini-api/docs/generate-content/google-search).
- PASS: Local navigation, concept explanations, app-state queries and actions make no search request.
- PASS: Missing-key and unsupported-provider cases produce explicit spoken/visual messages without a network request.
- PASS: Grounded responses use “Based on a live search:” and Activity Log source `[WEB SEARCH]`, with source links and isolated Google search suggestions.
- PASS: Missing grounding, empty answers, HTTP failures, network failures and timeout receive honest messages.
- PASS: Unsafe source links are rejected; answer text cannot inject HTML. New local commands suppress stale remote speech.
- PASS: Disconnect cancels pending search; no persistent credential storage was introduced.

## Regression and preservation — PASS

- 9 Node recognition/preservation checks: `node verify-kean-reliability.cjs`.
- 10 Node search checks: `node verify-kean-search.cjs`.
- 12 browser wake/search checks: `kean-search-check.html`.
- 36 browser presentation/session/approval/palette checks: `presentation-check.html`.
- 44 browser voice/control checks: `voice-coverage-check.html`, including all eight attack vectors and all six STRIDE categories.
- All ten CSS blocks have balanced braces; inline JavaScript parses.
- Reversing only the declared wake/search replacements recovers the complete backup exactly. AuthGuard, SentrySim, STRIDE/CVSS and login/session implementation remain unchanged.
- Tab 5/6 coursework markup is byte-identical to the backup.
- Original `index.html` remains unchanged (SHA256 `d847abfe7a02a38e8cb930dad466006ca6c9d65f90d043521bd46a68b94bc3c4`).
- Backup SHA256: `da7c78d76645abe6b57b879de9293fb6e364272195bc034975ac3dff8f98cf48`.

## Test scope

Recognition events and Gemini responses were simulated. No physical microphone accuracy test or credentialed Gemini request was performed; no real API key was used. These checks verify routing, request structure, deduplication, failure handling and UI integration, not external speech-service availability or account quota.
