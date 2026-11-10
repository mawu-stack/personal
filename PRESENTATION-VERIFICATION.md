# Presentation upgrade verification — September 26, 2026

Deliverable: `index-cmdk.html`. The rollback file `index-presentation-backup.html` and original `index.html` retain their recorded SHA-256 hashes. Academic markup in Tabs 5/6 matches the presentation backup byte for byte.

## Browser checks

- **44 command-coverage checks passed** on the final JavaScript: all six tabs, five defenses with shared-state parity and idempotent enable, all eight attack outcomes compared with direct clicks, password generation, current entropy/TTC, six STRIDE filters and explanations, audit/STRIDE exports, capability summary, and command discovery.
- **36 Presentation Mode checks passed**: shared microphone setup; all six tabs and an attack without mouse input after setup; unchanged defense while awaiting approval; all six spoken approval/denial synonyms; Tier 2 approval/denial; visible five-second auto-confirmation; explicit labeling of automatic execution; paused countdown with Ctrl+K or microphone failure; keyboard fallback after an unrecognized phrase; normal-mode parity; mouse approval/denial handler parity; cancellation on mode exit, hidden page and session expiry; Escape-style cancellation; voice statuses; persistent backup hint.
- Direct browser keyboard checks verified Ctrl+K proposal execution and actual Escape dismissal. The approval dialog was visually inspected at desktop and 390px viewport widths. At 390px, document width was 375px and dialog width was approximately 339px, with no horizontal overflow.

The no-mouse presentation flow was actually executed in a local browser fixture, using recognized transcripts delivered through the application's recognition result callback. The fixture replaces the browser recognition service and captures synthesis output. Physical microphone recognition, room acoustics and audible speech output were **not** tested. Those require a live check on the presentation computer. The fixture also captures generated report blobs instead of saving downloads.

## Preservation and syntax

`node verify-presentation-mode.cjs` passes: only declared integration changes, byte-identical academic markup against the original presentation backup, 10 balanced CSS blocks, 12 parsed script blocks, unchanged backup and unchanged original index. Security engines and eight attack handlers were not rewritten. The existing command router, recognizer and simulated Tier 2 approval path gained explicit presentation integration; voice, mouse, keyboard and countdown decisions converge on the same approval handler.

## Files

- `VOICE-COMMANDS.md`: command examples and Presentation Mode instructions.
- `presentation-check.html`: 36-check local presentation fixture.
- `voice-coverage-check.html`: 44-check command fixture.
- `verify-presentation-mode.cjs`: preservation and syntax checks.

Test servers were local-only. No API key, real credential, real microphone capture or external attack was required for verification.
