# PhishGuard AI — 13-minute presentation outline

| Time | Segment | Visual / demonstration | Main point |
|---|---|---|---|
| 0:00–1:00 | Problem and motivation | PhishGuard overview | Missing phishing and blocking legitimate sites have different costs. |
| 1:00–2:00 | Research question and provenance | Dataset source card | Exact notebook input, not a similarly named dataset; URL-focused vs full scope. |
| 2:00–3:15 | Dataset exploration | Class chart, missing audit, feature selector | 11,055 records; 30 predictors; verify target coding; zero missing cells. |
| 3:15–4:30 | Preprocessing | Integrity disclosure | Remove index and 5,206 repeats; group matching predictors across split. |
| 4:30–5:30 | Experimental design | Split summary | Train-only one-hot encoding; seed 42; one holdout, not five-fold evaluation. |
| 5:30–7:00 | Model comparison | URL-focused comparison, then full-feature selector | About 79% URL-focused accuracy; do not present 95.6% as URL-text-only performance. |
| 7:00–8:30 | Evaluation | Confusion matrices and ROC | URL forest: 157 false positives, 89 false negatives. Explain what each means. |
| 8:30–9:30 | Interpretation | Forest importance | Importance is model association, not causal evidence or a security rule. |
| 9:30–11:15 | Live dashboard demo | Filter held-out mistakes; inspect example.com | Real stored predictions; URL inspector gives no ML verdict and never visits sites. |
| 11:15–12:15 | Limitations | Source and method disclosure | No raw URLs, timestamps, domain holdout, calibration or live validation. |
| 12:15–13:00 | Conclusion | Research timeline | URL features carry signal, but this experiment is not production protection. |

## Rehearsal checklist

- Open Tab 7 / PhishGuard AI and use the existing simulated login.
- Keep K.E.A.N. Professional mode; voice is optional, all actions have visible controls.
- Start with the URL-focused results so the research question is answered directly.
- Open one false-negative record and read its actual label before discussing prediction.
- Enter only `https://example.com/account` for the URL inspector demonstration.
- If network access is unavailable, embedded results and all research controls still work.
- Bring `results/charts/` and `docs/report.md` as fallback materials.
- Do not claim a real-time URL classifier, calibrated confidence or completed external validation.

**Status:** outline prepared; rehearsal and final presentation remain Planned.
