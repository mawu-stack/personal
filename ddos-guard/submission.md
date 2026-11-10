# Assignment 6 — XSS Security and DDoS Detection Research

Prepared: 22 October 2026. This replaces the previous phishing research in the active workbench.

## Security problem → control → mitigation → improvement

Untrusted markup reaching an HTML parser can execute in the application origin. The local AI transcript display now uses textContent instead of innerHTML. Accepted markup stays inert regardless of the prompt-guard setting. The Assignment 6 lab demonstrates validation, context-specific HTML text encoding and safe text rendering with ten runtime checks. Validation limits type/length; it does not replace safe output handling. A trusted fixed markup illustration is isolated in a sandbox with restrictive CSP. No arbitrary input enters that frame. SentrySim retains its deliberately vulnerable educational exercise. Broader server-side controls and sink audits remain necessary.

## Research topic, problem and question

Topic: machine learning for network-flow DDoS detection. Availability attacks must be detected without disrupting legitimate traffic through excessive false positives. Question: how does a class-balanced Random Forest compare with a compact decision tree on F1, attack recall and false-positive rate using the same eight flow features? Objectives: document provenance and cleaning; establish a reproducible baseline; measure a fixed ensemble comparison; report errors and limitations rather than assume improvement.

## Dataset and provenance

Source: https://www.kaggle.com/datasets/dhoogla/cicddos2019. Original: https://www.unb.ca/cic/datasets/ddos-2019.html. Mirror license: CC BY-NC-SA 4.0 (Kaggle mirror metadata; cite original CIC paper). Cite Sharafaldin, Lashkari, Hakak and Ghorbani, “Developing Realistic Distributed Denial of Service (DDoS) Attack Dataset and Taxonomy,” IEEE ICCST 2019, and the Kaggle mirror owner dhoogla. The downloaded mirror supplies 17 named training/testing Parquet files. Full source file SHA-256 values and per-file record counts are in results/metrics.json. This is a cleaned third-party mirror, not unprocessed PCAP traffic.

Observed raw training labels: {"Syn":48840,"Benign":46427,"UDP":18090,"MSSQL":8523,"LDAP":1906,"Portmap":685,"NetBIOS":644,"UDPLag":55}.

Observed raw testing labels: {"DrDoS_NTP":121368,"TFTP":98917,"Benign":51404,"DrDoS_UDP":10420,"UDP-lag":8872,"DrDoS_MSSQL":6212,"DrDoS_DNS":3669,"DrDoS_SNMP":2717,"DrDoS_LDAP":1440,"DrDoS_NetBIOS":598,"Syn":533,"WebDDoS":51}.

All non-Benign labels are grouped as attack. Retained evaluation labels: {"DrDoS_NTP":96459,"TFTP":39221,"Benign":36287,"UDP-lag":6628,"DrDoS_UDP":4117,"DrDoS_DNS":975,"DrDoS_SNMP":498,"Syn":395,"DrDoS_MSSQL":379,"DrDoS_LDAP":94,"DrDoS_NetBIOS":42,"WebDDoS":22}. Binary labels do not determine attack family, coordination or service impact.

## Method and fair experiment

Features: Protocol, Flow Duration, Total Fwd Packets, Total Backward Packets, Flow Bytes/s, Flow Packets/s, SYN Flag Count, ACK Flag Count. Protocol is numeric; duration uses microseconds. Replace infinities with missing values, then fit median imputation on training only. Remove conflicting training feature patterns and duplicate training patterns. Exclude 26,328 test rows sharing retained training feature patterns; deduplicate test feature/label rows. Retain 93,696 training and 185,117 test rows. Fixed seed 42; a stratified training cap of 120,000 applies only if exceeded.

Baseline: balanced depth-5 DecisionTreeClassifier, minimum leaf size 20. Comparison: balanced RandomForestClassifier, 100 trees, depth 12, minimum leaf size 5. Hyperparameters were fixed in protocol.md before training. Both use the same records, eight features and binary target. No test tuning was performed. This is traditional ML, not DL or an LLM. The forest is a proposed comparison, not an established new method or claimed novelty. A substantial research contribution would require additional justified development, validation and ablation beyond this baseline study.

## Actual results

| Method | Precision | Recall | F1 | False-positive rate | ROC-AUC |
|---|---|---|---|---|---|
| Decision tree | 99.89% | 86.51% | 92.72% | 0.38% | 95.88% |
| Random forest | 99.98% | 85.50% | 92.17% | 0.07% | 99.93% |

Confusion matrices, rows actual benign/attack and columns predicted benign/attack: Decision tree [[36149,138],[20083,128747]]; Random forest [[36261,26],[21580,127250]].

The forest has fewer false alarms but misses more attacks; it does not improve F1 here. This negative result is retained. The compact tree is exported for browser inference because its complete path is inspectable; the forest is an offline comparator. No calibrated confidence percentages are displayed. ROC curves and feature-distribution histograms use real retained test data. Measured experiment runtime: 6.68 seconds on this machine, not per-request latency.

## Limitations and next experiments

Feature-pattern separation is not proof of temporal, campaign or host separation. Metadata needed for those checks is unavailable in the selected features/mirror. Deduplication changes the population. The dataset is historical, laboratory-generated and cleaned by a third party; class imbalance and mirror selection constrain inference. Scores are single-split observations with no training-seed uncertainty interval. A benign-like individual flow cannot rule out a coordinated flood. Planned work: training-only group/temporal validation where metadata permits, repeated seeds, external traffic, calibration, operational thresholds, ablation and measured inference cost. Do not claim production readiness or a novel deep-learning contribution.

## Reproducibility and tool boundaries

Run ddos-guard/train.py using the project environment, then node ddos-guard/build.mjs, node build-assignment6.mjs and node ddos-guard/verify.mjs from the website root. Source: ddos-guard/train.py and protocol.md. Results: ddos-guard/results/metrics.json. The browser analyzes supplied flow measurements only, never generates attacks or monitors live traffic. Optional local history contains numerical measurements only. Review this draft against the instructor's method and contribution requirements before submitting.

## References

- Original dataset: https://www.unb.ca/cic/datasets/ddos-2019.html
- Kaggle mirror: https://www.kaggle.com/datasets/dhoogla/cicddos2019
- XSS controls: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- Decision tree: https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeClassifier.html
- Random Forest: https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html
