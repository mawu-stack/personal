# DDoS Guard AI

The active replacement for PhishGuard is Tab 07 in `../index-cmdk.html`; Assignment 6 now uses the same DDoS research. Old phishing source/data and backups remain archived in `../phishguard-ai`; do not run its old export scripts over the current website. The Python environment there is reused to avoid reinstalling the scientific stack.

## Working features

- Actual local decision-tree inference with decision-path explanations. Eight flow measurements, no URL checker and no attack generation.
- Dataset class charts, normalized feature distributions, ROC curves, confusion matrices, metric comparison and measured JSON export.
- Held-out record selector, optional local-only history, revisit, delete and clear.
- Incident response guidance, shared voice/palette navigation, XSS lab and Assignment 6 research summary.
- Works from file:// without an API or key; everything needed for browser inference is embedded.

## Reproduce

Use Python 3.12 with pandas, numpy, scikit-learn and pyarrow. Existing project environment: `../phishguard-ai/.venv`. Download https://www.kaggle.com/datasets/dhoogla/cicddos2019 and extract its Parquet files into `data/flows/`. Mirror license CC BY-NC-SA 4.0. Retain attribution to mirror and original CIC authors; see `protocol.md` and the UI. Downloaded archive and source file fingerprints are recorded by the experiment.

From website root:

```
phishguard-ai\.venv\Scripts\python.exe ddos-guard\train.py
node ddos-guard/build.mjs
node build-assignment6.mjs
node ddos-guard/verify.mjs
```

`migrate-a6.mjs` is a one-time migration, not a repeated build step. `index-ddos-backup.html` is the rollback point. Original index.html is not changed. No live packet capture, server blocking, paid provider requests or calibrated confidence scores are implemented. The deployed browser model is the small decision tree; the Random Forest is an offline comparator. Review false-negative rates before considering real-world use.
