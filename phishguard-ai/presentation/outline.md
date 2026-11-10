# PhishGuard AI — 13-minute presentation

1. **0:00–1:00 — Problem.** Explain phishing, the research question and why a URL verdict is uncertain.
2. **1:00–2:15 — Dataset.** Show source, CC0, 651,191 raw rows, binary subset and 509,886 retained rows. Explain why a raw-URL dataset replaced the old precomputed one.
3. **2:15–3:30 — Features.** Demonstrate the shared 19-feature extractor. No URL is visited. Explain HTTPS is not legitimacy.
4. **3:30–5:00 — Method.** Domain-disjoint split, same holdout, balanced class weights, training-only scaling, LR versus RF. No tuning on the test set.
5. **5:00–7:00 — Results.** Show confusion matrices, precision/recall and ROC. Discuss RF 86.58% accuracy/87.04% recall, but 11,364 false alarms. Explain the majority baseline.
6. **7:00–10:00 — Live Flutter demo.** Start backend and web app. Scan example.com, switch models, inspect exact extracted features. Enter an invalid scheme. Stop backend and retry to show an honest error, then restart. Use harmless example inputs; a result is not a pre-scripted guaranteed label.
7. **10:00–11:30 — Security and limits.** False negatives versus false positives, no network fetching, source bias, uncalibrated probability, no production claim.
8. **11:30–13:00 — Conclusion/Q&A.** RF is stronger on this holdout. Explain independent temporal validation as next work and pending K.E.A.N. integration.

## Actual metrics
| Model | Accuracy | Precision | Recall | F1 | ROC-AUC | FPR | FNR |
|---|---:|---:|---:|---:|---:|---:|---:|
| Logistic Regression | 0.6687 | 0.3240 | 0.8171 | 0.4640 | 0.8056 | 0.3629 | 0.1829 |
| Random Forest | 0.8658 | 0.5782 | 0.8704 | 0.6949 | 0.9401 | 0.1352 | 0.1296 |


## Rehearsal checklist
- [ ] Start FastAPI on 8000 and Flutter on 8080.
- [ ] Confirm /health reports ready and choose Random Forest.
- [ ] Verify browser can reach API; check both themes and projector zoom.
- [ ] Run one genuine prediction with each model.
- [ ] Show invalid input and backend-down error, then restore connection.
- [ ] Have notebook outputs and chart PNGs available offline.
- [ ] Review all report wording and rehearse to 13 minutes.
- [ ] Deliver presentation. This is not marked complete in advance.
