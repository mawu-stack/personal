import fs from 'node:fs';const r=JSON.parse(fs.readFileSync('ddos-guard/results/metrics.json'));const p=n=>(n*100).toFixed(2)+'%';
const rows=Object.entries(r.models).map(([name,m])=>`| ${name} | ${p(m.precision)} | ${p(m.recall)} | ${p(m.f1)} | ${p(m.fpr)} | ${p(m.auc)} |`).join('\n');
fs.writeFileSync('ddos-guard/submission.md',`# Assignment 6 — XSS Security and DDoS Detection Research

Prepared: 22 October 2026. This replaces the previous phishing research in the active workbench.

## Security problem → control → mitigation → improvement

Untrusted markup reaching an HTML parser can execute in the application origin. The local AI transcript display now uses textContent instead of innerHTML. Accepted markup stays inert regardless of the prompt-guard setting. The Assignment 6 lab demonstrates validation, context-specific HTML text encoding and safe text rendering with ten runtime checks. Validation limits type/length; it does not replace safe output handling. A trusted fixed markup illustration is isolated in a sandbox with restrictive CSP. No arbitrary input enters that frame. SentrySim retains its deliberately vulnerable educational exercise. Broader server-side controls and sink audits remain necessary.

## Research topic, problem and question

Topic: machine learning for network-flow DDoS detection. Availability attacks must be detected without disrupting legitimate traffic through excessive false positives. Question: how does a class-balanced Random Forest compare with a compact decision tree on F1, attack recall and false-positive rate using the same eight flow features? Objectives: document provenance and cleaning; establish a reproducible baseline; measure a fixed ensemble comparison; report errors and limitations rather than assume improvement.

## Dataset and provenance

Source: ${r.source}. Original: https://www.unb.ca/cic/datasets/ddos-2019.html. Mirror license: ${r.license}. Cite Sharafaldin, Lashkari, Hakak and Ghorbani, “Developing Realistic Distributed Denial of Service (DDoS) Attack Dataset and Taxonomy,” IEEE ICCST 2019, and the Kaggle mirror owner dhoogla. The downloaded mirror supplies ${r.sources.length} named training/testing Parquet files. Full source file SHA-256 values and per-file record counts are in results/metrics.json. This is a cleaned third-party mirror, not unprocessed PCAP traffic.

Observed raw training labels: ${JSON.stringify(r.raw_counts.training)}.

Observed raw testing labels: ${JSON.stringify(r.raw_counts.testing)}.

All non-Benign labels are grouped as attack. Retained evaluation labels: ${JSON.stringify(r.classes)}. Binary labels do not determine attack family, coordination or service impact.

## Method and fair experiment

Features: ${r.features.join(', ')}. Protocol is numeric; duration uses microseconds. Replace infinities with missing values, then fit median imputation on training only. Remove conflicting training feature patterns and duplicate training patterns. Exclude ${r.test_overlap_removed.toLocaleString()} test rows sharing retained training feature patterns; deduplicate test feature/label rows. Retain ${r.train_rows.toLocaleString()} training and ${r.test_rows.toLocaleString()} test rows. Fixed seed 42; a stratified training cap of 120,000 applies only if exceeded.

Baseline: balanced depth-5 DecisionTreeClassifier, minimum leaf size 20. Comparison: balanced RandomForestClassifier, 100 trees, depth 12, minimum leaf size 5. Hyperparameters were fixed in protocol.md before training. Both use the same records, eight features and binary target. No test tuning was performed. This is traditional ML, not DL or an LLM. The forest is a proposed comparison, not an established new method or claimed novelty. A substantial research contribution would require additional justified development, validation and ablation beyond this baseline study.

## Actual results

| Method | Precision | Recall | F1 | False-positive rate | ROC-AUC |
|---|---|---|---|---|---|
${rows}

Confusion matrices, rows actual benign/attack and columns predicted benign/attack: ${Object.entries(r.models).map(([n,m])=>n+' '+JSON.stringify(m.confusion)).join('; ')}.

The forest has fewer false alarms but misses more attacks; it does not improve F1 here. This negative result is retained. The compact tree is exported for browser inference because its complete path is inspectable; the forest is an offline comparator. No calibrated confidence percentages are displayed. ROC curves and feature-distribution histograms use real retained test data. Measured experiment runtime: ${r.elapsed_seconds.toFixed(2)} seconds on this machine, not per-request latency.

## Limitations and next experiments

Feature-pattern separation is not proof of temporal, campaign or host separation. Metadata needed for those checks is unavailable in the selected features/mirror. Deduplication changes the population. The dataset is historical, laboratory-generated and cleaned by a third party; class imbalance and mirror selection constrain inference. Scores are single-split observations with no training-seed uncertainty interval. A benign-like individual flow cannot rule out a coordinated flood. Planned work: training-only group/temporal validation where metadata permits, repeated seeds, external traffic, calibration, operational thresholds, ablation and measured inference cost. Do not claim production readiness or a novel deep-learning contribution.

## Reproducibility and tool boundaries

Run ddos-guard/train.py using the project environment, then node ddos-guard/build.mjs, node build-assignment6.mjs and node ddos-guard/verify.mjs from the website root. Source: ddos-guard/train.py and protocol.md. Results: ddos-guard/results/metrics.json. The browser analyzes supplied flow measurements only, never generates attacks or monitors live traffic. Optional local history contains numerical measurements only. Review this draft against the instructor's method and contribution requirements before submitting.

## References

- Original dataset: https://www.unb.ca/cic/datasets/ddos-2019.html
- Kaggle mirror: ${r.source}
- XSS controls: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- Decision tree: https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeClassifier.html
- Random Forest: https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html
`);
