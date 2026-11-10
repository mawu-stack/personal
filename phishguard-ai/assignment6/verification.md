# Verification — 22 October 2026

## Research

- Actual experiment completed with 326,328 inner fit rows, 81,580 validation rows, 407,908 total outer training rows and 101,978 historical test rows.
- Validation selected a 0.50 character-model mixture weight from the three candidates specified in `protocol.json`.
- Independent `verify_experiment.py` passed: raw-row provenance and labels, outer/inner domain separation, validation-only selection, mixed predictions, accuracy/precision/recall/F1/FPR/FNR/AP/ROC-AUC and confusion matrices for all four methods, and saved character-pipeline reload.
- Original notebook executed successfully. Four chart assets were generated from actual results and visually inspected.
- Lexical RF F1 0.694855; hybrid F1 0.815438. False-positive counts 11,364 versus 4,922. These are exploratory historical-test results, not deployment guarantees.

## Workbench and XSS

- `node verify-assignment6.mjs` passed: HTML5 parse, unique IDs, one main landmark, 19 executable JavaScript blocks, 15 CSS brace-balanced blocks, embedded JSON, declared-edit reconstruction and targeted sink replacement.
- Tabs 3, 5, 6 and 8 HTML remain byte-identical to the pre-Assignment-6 backup. All Assignment 4 controllers remain byte-identical. Existing SentrySim intentionally vulnerable mode remains in source. No deployed Flutter model artifact was changed.
- Browser fixture: **29 checks passed**, plus **10 renderer subchecks**. See `browser-results.txt`.
- Actual local AI simulation is tested with markup-shaped text while the prompt guard is both enabled and disabled: output contains the literal payload, no injected SVG element and no execution marker.
- Controls test length/control-character validation, literal text rendering, HTML-text encoding and special-character/Unicode preservation. The fixed parsing demonstration uses an opaque sandbox and never receives entered text.
- Browser also verifies all four measured-method rows, JSON/display consistency, local write-up/results download generation, shared navigation alias, all eight existing tabs, existing A4 student authorization denial, and one-column/mobile panel fit at a 390-pixel iframe width.
- Desktop dark-theme view and chart figures were visually inspected. Mobile geometry was exercised in the fixture, rather than claiming a physical-device test.

## Preservation and limits

Pre-change file: `index-a6-backup.html`, SHA-256 `3923C95E6B6A3861922D6BE318B29B3F7E7AAEEE33E4F6F556DBDBB0C95DF5C6`.

Only one existing application display sink changes: the local AI transcript's `innerHTML` assignment becomes `textContent`. Global request routing, provider timeout/acknowledgment/fallback code, login/session, voice/personality, AuthGuard/STRIDE algorithms and graded text remain preserved through the declared-edit verification. Shared voice navigation was exercised via the router, not a physical microphone. No live paid provider requests were made, and there is no claim of an exhaustive application security audit.

The historical test set was inspected before this extension, so results are exploratory. Domain grouping cannot eliminate all campaign/source leakage. The bootstrap interval is conditional and excludes retraining/model-selection uncertainty. No external/temporal validation, repeated model seeds, calibrated confidence or production protection is claimed. The deployed scanner still uses its existing baseline pipeline.

Nothing was submitted to Canvas. The submission draft is for the student to review.
