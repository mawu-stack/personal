# Verification — 9 October 2026

## Passed

- Actual dataset downloaded from the reference notebook's linked Kaggle dataset, version 2. Source labels verified; CSV SHA-256 recorded in results.
- Executed notebook completed with outputs. Four saved pipelines were reloaded and all held-out probabilities and metrics recomputed successfully. Training/test row IDs and predictor-pattern groups are disjoint.
- 28 dashboard browser checks passed, plus the separate missing-results check. Evidence: `results/browser-checks.txt` and `results/pending-state.txt`.
- Existing regression fixtures: 43 voice/attack checks, 42 Assignment 4 checks, and 36 presentation checks passed. These use simulated recognition/speech and mocked provider responses.
- HTML5 parsing, unique IDs, one main landmark, JavaScript syntax, CSS brace balance, embedded metrics and confusion totals passed `verify-site.mjs`.
- Tabs 5 and 6 remain byte-for-byte identical. Removing the declared PhishGuard additions and reversing the three tab-routing extensions reproduces the backup exactly, preserving all earlier source logic.
- Desktop dark/light visual inspection: navigation, cards, charts and text remain readable.

## Preservation

Backup: `index-phishguard-backup.html`, SHA-256 `CE0E46DA9D6A00D56A25125E29B19CD5DF3622C2B648DA49FDFA6E7D0295D146`.
The current working deliverable is `index-cmdk.html`. The original `index.html` was not edited.

## Boundaries

- Physical microphone, audible speech and live paid AI-provider calls were not retested. Their existing implementation was preserved.
- The browser viewport override did not apply (the rendered viewport stayed 1280px), so mobile visual verification is not claimed. Responsive CSS is included.
- Entered URLs are parsed locally and never visited; URL anatomy is explicitly not a trained-model verdict. The prediction explorer uses genuine held-out dataset records.
- Accuracy is a single grouped holdout result, not cross-validation or production performance. URL-focused and full-feature results use different group-aware splits and are not paired comparisons.
- Final presentation delivery remains planned. Proposal/report/presentation documents are drafts for the student's review.
