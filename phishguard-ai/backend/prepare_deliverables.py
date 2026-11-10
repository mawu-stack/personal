"""Generate measured research assets and original notebook; does not touch K.E.A.N."""
import json
from pathlib import Path
import shutil
import nbformat as nbf

ROOT=Path(__file__).resolve().parents[1]
m=json.loads((ROOT/'backend/models/metrics.json').read_text())
d=m['dataset']; s=m['split']
for folder in ['reports','presentation','flutter_app/assets']:(ROOT/folder).mkdir(exist_ok=True)
table='| Model | Accuracy | Precision | Recall | F1 | ROC-AUC | FPR | FNR |\n|---|---:|---:|---:|---:|---:|---:|---:|\n'
for name,r in m['models'].items():
    table+='| '+name.replace('_',' ').title()+' | '+' | '.join(f'{r[k]:.4f}' for k in ['accuracy','precision','recall','f1','roc_auc','fpr','fnr'])+' |\n'
readme='''# PhishGuard AI — standalone Flutter + FastAPI

This is the current raw-URL research application. The older K.E.A.N. Tab 7 experiment, its `src/`, `web/`, `results/` and `docs/` artifacts remain separate and unchanged. Do not run `src/export_site.py` for this standalone project.

## Run on this Windows machine

Terminal 1, from `phishguard-ai/backend`:
```powershell
..\\.venv\\Scripts\\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
Terminal 2, from `phishguard-ai/flutter_app`:
```powershell
..\\.tools\\flutter\\bin\\flutter.bat run -d web-server --web-hostname 127.0.0.1 --web-port 8080
```
Open http://127.0.0.1:8080. The API docs are at http://127.0.0.1:8000/docs.

For the built release, serve `flutter_app/build/web` on port 8080 using Python's `http.server 8080 --bind 127.0.0.1` from that directory while FastAPI runs.

## Reproduce from source

Use Python 3.12 and Flutter 3.47.7 / Dart 3.13.5. The tested Python environment and Dart lockfile pin dependencies. Install Flutter from https://docs.flutter.dev/install/manual; `.tools/flutter` is a local SDK, not committed source.

```powershell
python -m venv .venv
.\\.venv\\Scripts\\python.exe -m pip install -r backend/requirements.txt
cd backend
..\\.venv\\Scripts\\python.exe download_data.py
..\\.venv\\Scripts\\python.exe train.py
..\\.venv\\Scripts\\python.exe prepare_deliverables.py
..\\.venv\\Scripts\\python.exe -m pytest tests -q
cd ../flutter_app
flutter pub get
flutter analyze
flutter test
flutter build web --no-web-resources-cdn
```

The training command uses all retained benign/phishing rows, not a sample. Expect several minutes and sufficient memory. Models and large raw/derived datasets are ignored by Git; retrain after cloning. Load only locally generated trusted joblib files. Hash checks detect accidental replacement, not malicious modification of both model and manifest.

## Source and experiment

Dataset: https://www.kaggle.com/datasets/sid321axn/malicious-urls-dataset · version 1 · Kaggle metadata lists CC0: Public Domain. Public archive downloaded without credentials on 2026-10-13. `backend/download_data.py` verifies the CSV SHA-256. Attribution is retained despite CC0.

The source columns are `url` and `type`. Use benign=0, phishing=1; exclude malware and defacement because they are not equivalent to phishing. The shared `backend/app/features.py` implements 19 lexical features, with no DNS/HTTP lookups. Missing schemes are interpreted as HTTP identically during training and inference. This is an assumption, not evidence of the original protocol.

See `reports/report.md`, `reports/proposal.md`, `presentation/outline.md`, `docs/standalone-methodology.md`, `notebooks/raw_url_research.ipynb`, and `backend/models/metrics.json`. Run the notebook with the project Python kernel from its `notebooks` directory. It recomputes EDA from the real prepared data and verifies saved test predictions; `backend/train.py` trains both pipelines.

## Security

No API key is needed. URLs are processed locally and never visited. The API accepts only bounded HTTP(S) URL strings. CORS allows only localhost/127.0.0.1 on port 8080. Keep the server bound to loopback for the classroom demo. A remote deployment needs explicit hosting, HTTPS, rate limits and an approved CORS origin. Backend failures show explicit errors; no mock prediction is substituted.

Probabilities are uncalibrated. Predicted Legitimate never means guaranteed safe. Source bias, historical labels and lexical-only features limit generalization. All metrics are a single held-out experiment, not five-fold performance or production assurance.

## Integration

`index-cmdk.html` was not modified. See `docs/integration-plan.md`; integration requires approval.
'''
(ROOT/'README.md').write_text(readme,encoding='utf-8')
method='''# Methodology and references

Research question: Can machine learning accurately identify phishing URLs using URL-based features, and which model best balances detection and false alarms?

The actual CSV is inspected before selecting a representation. Nulls are removed, invalid URLs excluded, conflicting canonical URLs removed, and repeated canonical URLs collapsed. The canonical key lowercases scheme/IDNA hostname, supplies HTTP when absent and a root slash when empty, and drops fragments. Features still use the shared parsed input representation, preserving path/query spelling. No labels, source IDs, domain categories or split identifiers enter the predictor matrix.

All 19 predictors are numeric: string/host/path/query lengths, punctuation counts, digits/ratio, query parameter count, subdomain count, IP-host/port/HTTPS flags, Shannon character entropy, sensitive-word count and punycode flag. No categorical encoding is needed. Missing-value imputation is fitted on training data only as a defensive pipeline step; generated features have no missing cells. Logistic Regression uses training-fitted StandardScaler; trees do not require scaling. Retain all features as a predeclared baseline rather than selecting on test performance.

Registrable domains are extracted using tldextract's bundled public-suffix snapshot, including private suffixes, with remote updates disabled. The first seed-42 StratifiedGroupKFold split is held out. No hyperparameter tuning or threshold optimization is performed. Both models use balanced class weights calculated from training labels. Logistic Regression: C=1, max_iter=2000. Random Forest: 150 trees, max_depth=22, min_samples_leaf=3, n_jobs=2. Threshold 0.5; positive class phishing. Save complete pipelines and schema.

ROC points are downsampled only for display, while ROC-AUC is computed on all test probabilities. Random Forest impurity importances are training summaries, not causal explanations. Logistic Regression coefficients refer to standardized features. Test metrics must not be treated as training objectives in later iterations; use a separate validation partition before future tuning.

References:
- Dataset: https://www.kaggle.com/datasets/sid321axn/malicious-urls-dataset
- Leakage prevention: https://scikit-learn.org/stable/common_pitfalls.html
- Grouped splitting: https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.StratifiedGroupKFold.html
- FastAPI: https://fastapi.tiangolo.com/tutorial/
- Flutter: https://docs.flutter.dev/
- Offline suffix extraction: https://github.com/john-kurkowski/tldextract
'''
(ROOT/'docs/standalone-methodology.md').write_text(method,encoding='utf-8')
proposal=f'''# PhishGuard AI: Machine Learning–Powered Phishing URL Detection
## One-page proposal · 13 October 2026

**Security problem.** Phishing links imitate trusted services to steal credentials or induce harmful actions. A URL can expose lexical warning signs before a page is visited, but superficial cues cannot establish whether a site is safe. The project investigates this distinction through a reproducible educational classifier.

**Research question.** Can machine learning accurately identify phishing URLs using URL-based features, and which model provides the best balance between detecting threats and minimizing false alarms?

**Dataset.** The Kaggle Malicious URLs dataset (sid321axn, version 1, CC0) contains {d['raw_rows']:,} actual rows and two columns: URL and class. The binary experiment uses benign and phishing labels; malware and defacement are excluded. After URL validation, conflict removal and canonical deduplication, {d['retained']:,} records remain. The prior K.E.A.N. dataset is unsuitable for a live lexical scanner because it does not contain raw URLs.

**Methodology.** A single network-free Python function extracts 19 lexical features during both training and inference. Preparation addresses invalid values, duplicate URLs, contradictory labels and class imbalance. Split by registrable domain with seed 42 to reduce same-site leakage. Fit Logistic Regression with training-only scaling and Random Forest on the same training partition. Preserve the final holdout for evaluation; do not tune against it. Compare accuracy, precision, recall, F1, ROC-AUC, FPR, FNR and confusion matrices.

**Application.** Flutter Web communicates with FastAPI for genuine inference using saved pipelines. The interface provides a live scanner, dataset explorer, evaluation charts, limitations, documentation and a dated development log. The server never fetches a submitted URL. It validates input, restricts CORS and reports unavailable models explicitly. The existing K.E.A.N. website remains intact.

**Expected contribution.** The project should demonstrate an understandable comparison of linear and nonlinear classifiers and communicate the operational cost of missed attacks and false alarms. Initial measured results are available in the accompanying report; no production safety claim is made. A 10–15 minute presentation will include a live inference demonstration, error handling and an honest account of lexical limitations and dataset bias.
'''
(ROOT/'reports/proposal.md').write_text(proposal,encoding='utf-8')
report=f'''# PhishGuard AI — Research report draft
13 October 2026 · Standalone Flutter/FastAPI experiment

## 1. Introduction
PhishGuard AI studies whether URL text alone offers useful evidence of phishing. It combines an original scikit-learn experiment with a Flutter interface and a local FastAPI service. The research question is not whether a classifier can certify safety, but how well two models distinguish phishing from benign examples while managing the cost of mistakes. The application is an educational prototype. It deliberately avoids loading suspicious pages, collecting user credentials or making production-protection claims.

This work is separate from the earlier K.E.A.N. precomputed-feature dashboard. That dataset could support held-out-record analysis but not faithful prediction from newly entered URL strings. Reusing its models with guessed features would introduce training/inference mismatch. The standalone implementation instead starts with raw URLs and shares an exact extraction function between offline training and the prediction endpoint.

## 2. Security problem
Phishing uses impersonation and deception to obtain credentials or induce harmful actions. Lexical cues such as unusual hostname structure, long paths, encoded characters or sensitive words may help, but none is conclusive. Legitimate tracking links can be long; attackers can use short links or compromise established websites. HTTPS protects transport but does not establish the legitimacy of a page or organization.

A false negative predicts legitimate for phishing and may expose the user to credential theft. A false positive blocks or alarms on legitimate activity, disrupting work and eroding trust. Accuracy alone obscures these costs in an imbalanced dataset. Precision measures how often phishing alerts are correct; recall measures how much phishing is caught. Both rates and absolute errors must be visible in a credible research demonstration.

<div style="page-break-after: always;"></div>

## 3. Dataset description
The public source is Kaggle's Malicious URLs dataset, published by sid321axn, version 1. Kaggle API metadata lists CC0: Public Domain. The downloaded `malicious_phish.csv` contains {d['raw_rows']:,} rows, with URL and type as text columns. The raw labels are {d['raw_classes']}. There are no missing source cells and {d['raw_duplicates']:,} exact raw duplicate rows. These figures were calculated from the downloaded file rather than copied from a notebook.

The binary question uses benign and phishing only. Malware and defacement describe different threat categories, so silently merging them with phishing would change the research target. The retained labels are benign=0 and phishing=1. CSV SHA-256 is `{m['source']['sha256']}`. The downloader verifies this checksum before saving a reproduction copy. Large data and model files are excluded from Git; public source and reproduction steps are retained.

## 4. Data preprocessing
URL validation rejects unsupported schemes, missing hostnames, malformed labels, out-of-range ports, whitespace/markup and inputs over 2048 characters. An absent scheme is consistently treated as HTTP. This convention supports the historical dataset but must not be interpreted as knowing the original transport protocol. Validation excluded {d['invalid_binary_rows']:,} binary rows. Canonicalization identifies equivalent scheme/host forms and ignores fragments for duplicate detection. All {d['conflicting_rows_removed']:,} rows with conflicting canonical labels were removed rather than arbitrarily choosing a label; then {d['canonical_duplicates_removed']:,} repeated canonical URLs were collapsed.

The final dataset contains {d['retained']:,} records: {d['classes']['benign']:,} benign and {d['classes']['phishing']:,} phishing. This imbalance motivates balanced training weights. Filtering can introduce selection bias: conclusions apply to accepted URLs, not every malformed or unsupported input in the wild. Exclusion counts are therefore documented and shown in the interface.

<div style="page-break-after: always;"></div>

## 5. Methodology
The shared extractor produces 19 numeric lexical features: URL, host, path and query lengths; counts of dots, hyphens, digits, slashes, percent signs and @ signs; digit ratio; query-parameter and subdomain counts; IP-host, explicit-port, HTTPS and punycode indicators; character entropy; and sensitive-word occurrences. It performs no DNS or HTTP requests. All features are extracted identically for dataset rows and submitted inputs. Numeric binary flags require no separate categorical encoder. All features are retained to avoid selection based on test performance.

The split uses the first fold of seed-42 StratifiedGroupKFold with five partitions, grouped by registrable domain including private suffixes. The public-suffix snapshot is bundled locally and never updated during inference. There are {s['train']:,} training and {s['test']:,} test rows, with zero shared domain groups and zero shared canonical URLs. This is one held-out result, not the mean of five-fold cross-validation. Both models see the same split. Domain grouping reduces one source of leakage but does not eliminate campaign or collection-source overlap.

Logistic Regression provides a linear baseline. Its median imputer and standard scaler fit only the training data. Random Forest models nonlinear relationships and interactions; it uses a training-fitted median imputer without scaling. Defensive imputation is retained even though the generated features have no missing values. Both use class_weight=balanced, learned from training frequencies. Fixed model settings are LR C=1/max_iter=2000 and RF 150 trees/max_depth=22/min_samples_leaf=3. No tuning uses the final test set. Saved artifacts contain the complete preprocessing pipeline and feature schema.

<div style="page-break-after: always;"></div>

## 6. Experimental results
All metrics below are computed from actual held-out predictions with phishing as the positive class and threshold 0.5.

{table}

Logistic Regression confusion matrix (rows actual benign/phishing; columns predicted benign/phishing): {m['models']['logistic_regression']['confusion_matrix']}. Random Forest: {m['models']['random_forest']['confusion_matrix']}.

Random Forest improves precision, recall, F1 and ROC-AUC in this experiment. Its accuracy is 86.58%, but the phishing precision of 57.82% shows that many alerts remain false positives. It misses 2,319 of 17,898 phishing test records and flags 11,364 of 84,080 benign records. Logistic Regression misses 3,273 phishing records while generating 30,512 false alarms. Balanced training weights favor sensitivity, but the default 0.5 threshold is not calibrated to a deployment cost model.

The majority-class baseline would achieve roughly 82.45% test accuracy by predicting every URL benign, while detecting no phishing. This makes the Logistic Regression accuracy below that baseline understandable rather than a reason to hide the result: it trades many additional alerts for phishing detection. Random Forest exceeds the majority baseline while preserving useful recall, but still requires substantial improvement before practical use.

Figures generated by the original notebook include class distribution, feature distributions, correlation, model metrics, confusion matrices, ROC curves, feature relationships and Random Forest importance. ROC-AUC uses all probabilities; the Flutter chart downsamples display points only. Impurity importance can favor continuous/high-cardinality variables and is not a causal account of an individual decision.

<div style="page-break-after: always;"></div>

## 7. Security analysis and application
The Flutter scanner submits a bounded URL string and selected model to `/predict`. FastAPI validates the input, extracts the shared feature schema, loads only fixed local artifacts and returns the predicted class, uncalibrated phishing probability and observed feature values. A model checksum and schema check detect accidental mismatch. They are not a defense against an attacker who can replace both the manifest and model files. Untrusted joblib files must never be loaded.

The service binds to loopback for local demonstrations and permits only localhost/127.0.0.1:8080 as frontend origins. It does not open, fetch or execute submitted URLs. No mock prediction is returned on failure. The frontend displays explicit connection/inference errors and clears stale results before a new scan. Observed lexical properties are labelled as observations rather than causal explanations. The UI uses Potential Phishing and Predicted Legitimate and never certifies safety.

## 8. Limitations
The dataset is historical and aggregated, with possible collection and label bias. It lacks a reliable timestamp-based evaluation. Domains are separated, but related campaigns can span domains; lexical templates can cross splits. Malformed URLs and contradictory labels were excluded, changing the evaluated population. We did not measure confidence intervals, calibrate probabilities, optimize thresholds on a validation set or evaluate a second independent corpus. No current real-world detection rate is claimed.

Lexical analysis cannot inspect page content, certificate validity, redirection destinations or reputational evidence. Those exclusions preserve a safe network-free demo but restrict detection capability. Future work should use independent temporal data, training-only validation for model selection, calibrated outputs, cost-sensitive thresholds and privacy-preserving deployment controls. HTTPS, rate limiting and drift monitoring would be necessary for remote use.

<div style="page-break-after: always;"></div>

## 9. Conclusion
The experiment supports the narrower conclusion that these lexical features provide useful evidence on a domain-separated sample of the selected dataset. Random Forest provides the stronger measured trade-off, while Logistic Regression illustrates the limitations of a linear decision surface with balanced weighting. Neither model guarantees safety. The main engineering result is an auditable chain from raw data through one feature representation, persisted pipelines and genuine API inference to a responsive interface.

The live presentation should show both a successful inference and an explicit backend failure, explain the difference between false positives and false negatives, and distinguish this new experiment from the earlier K.E.A.N. work. Integration remains a separate approval step. Test execution details and outstanding verification items belong in `docs/standalone-verification.md`, rather than being assumed from implementation alone.

## 10. References
1. sid321axn. Malicious URLs dataset, Kaggle, version 1. https://www.kaggle.com/datasets/sid321axn/malicious-urls-dataset (accessed 13 October 2026).
2. scikit-learn. Common pitfalls and recommended practices. https://scikit-learn.org/stable/common_pitfalls.html
3. scikit-learn. StratifiedGroupKFold API. https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.StratifiedGroupKFold.html
4. FastAPI documentation. https://fastapi.tiangolo.com/tutorial/
5. Flutter documentation. https://docs.flutter.dev/
6. tldextract project. https://github.com/john-kurkowski/tldextract

This six-section pagination draft must be reviewed by the student; final page count depends on export formatting. The code and original notebook are part of the reproducibility record.
'''
(ROOT/'reports/report.md').write_text(report,encoding='utf-8')
outline=f'''# PhishGuard AI — 13-minute presentation

1. **0:00–1:00 — Problem.** Explain phishing, the research question and why a URL verdict is uncertain.
2. **1:00–2:15 — Dataset.** Show source, CC0, {d['raw_rows']:,} raw rows, binary subset and {d['retained']:,} retained rows. Explain why a raw-URL dataset replaced the old precomputed one.
3. **2:15–3:30 — Features.** Demonstrate the shared 19-feature extractor. No URL is visited. Explain HTTPS is not legitimacy.
4. **3:30–5:00 — Method.** Domain-disjoint split, same holdout, balanced class weights, training-only scaling, LR versus RF. No tuning on the test set.
5. **5:00–7:00 — Results.** Show confusion matrices, precision/recall and ROC. Discuss RF 86.58% accuracy/87.04% recall, but 11,364 false alarms. Explain the majority baseline.
6. **7:00–10:00 — Live Flutter demo.** Start backend and web app. Scan example.com, switch models, inspect exact extracted features. Enter an invalid scheme. Stop backend and retry to show an honest error, then restart. Use harmless example inputs; a result is not a pre-scripted guaranteed label.
7. **10:00–11:30 — Security and limits.** False negatives versus false positives, no network fetching, source bias, uncalibrated probability, no production claim.
8. **11:30–13:00 — Conclusion/Q&A.** RF is stronger on this holdout. Explain independent temporal validation as next work and pending K.E.A.N. integration.

## Actual metrics
{table}

## Rehearsal checklist
- [ ] Start FastAPI on 8000 and Flutter on 8080.
- [ ] Confirm /health reports ready and choose Random Forest.
- [ ] Verify browser can reach API; check both themes and projector zoom.
- [ ] Run one genuine prediction with each model.
- [ ] Show invalid input and backend-down error, then restore connection.
- [ ] Have notebook outputs and chart PNGs available offline.
- [ ] Review all report wording and rehearse to 13 minutes.
- [ ] Deliver presentation. This is not marked complete in advance.
'''
(ROOT/'presentation/outline.md').write_text(outline,encoding='utf-8')
for src,dst in [('README.md','README.md'),('reports/proposal.md','proposal.md'),('reports/report.md','report.md'),('presentation/outline.md','presentation.md'),('docs/standalone-methodology.md','methodology.md')]:shutil.copyfile(ROOT/src,ROOT/'flutter_app/assets'/dst)
cells=[nbf.v4.new_markdown_cell('# PhishGuard AI: original raw-URL research\n\nThis notebook examines the real dataset and verifies saved held-out outputs. Training is reproducible with `backend/train.py`; no source notebook is copied. Positive class = phishing. No URLs are visited.'),
nbf.v4.new_code_cell("from pathlib import Path\nimport json, numpy as np, pandas as pd\nimport matplotlib.pyplot as plt\nfrom sklearn.metrics import accuracy_score, roc_auc_score\nROOT=Path.cwd().parent if Path.cwd().name=='notebooks' else Path.cwd()\nraw=pd.read_csv(ROOT/'data/raw-url/malicious_phish.csv')\nd=pd.read_csv(ROOT/'data/raw-url/prepared.csv')\nX=pd.read_csv(ROOT/'data/raw-url/features.csv')\nm=json.loads((ROOT/'backend/models/metrics.json').read_text())\ncharts=ROOT/'reports/charts'; charts.mkdir(exist_ok=True)\nprint(raw.shape,raw.dtypes,raw.isna().sum(), 'duplicates:',raw.duplicated().sum(),sep='\\n')\nprint(m['dataset']); print(m['split'])"),
nbf.v4.new_code_cell("raw['type'].value_counts().plot.bar(color=['#408cff','#28c9ab','#ffb85c','#8b9db5'],title='Raw source class distribution'); plt.tight_layout(); plt.savefig(charts/'classes.png',dpi=180); plt.show()"),
nbf.v4.new_markdown_cell('## Preparation and leakage\nInvalid inputs, conflicting canonical labels and duplicate canonical URLs are removed. Learned imputation/scaling fit only training data. Grouped domains reduce same-site overlap. The raw imbalance motivates training-only balanced class weights; all 19 numeric features are retained.'),
nbf.v4.new_code_cell("assert not set(d.loc[d.split=='train','domain']) & set(d.loc[d.split=='test','domain'])\nassert not set(d.loc[d.split=='train','canonical']) & set(d.loc[d.split=='test','canonical'])\nprint('No shared domains or canonical URLs'); print(X.isna().sum()); display(X.describe())"),
nbf.v4.new_code_cell("X[['length','host_length','entropy','digit_ratio']].hist(bins=30,figsize=(10,6),color='#408cff'); plt.tight_layout(); plt.savefig(charts/'distributions.png',dpi=180); plt.show()"),
nbf.v4.new_code_cell("fig,ax=plt.subplots(figsize=(11,9)); im=ax.imshow(X.corr().fillna(0),vmin=-1,vmax=1,cmap='coolwarm'); ax.set_xticks(range(len(X.columns)),X.columns,rotation=90); ax.set_yticks(range(len(X.columns)),X.columns); fig.colorbar(im); plt.tight_layout(); plt.savefig(charts/'correlation.png',dpi=180); plt.show()"),
nbf.v4.new_code_cell("sample=X.assign(label=d.type).sample(min(5000,len(X)),random_state=42)\nfor label,color in [('benign','#28c9ab'),('phishing','#ffb85c')]:\n p=sample[sample.label==label]; plt.scatter(p.length,p.entropy,s=5,alpha=.25,label=label,color=color)\nplt.xlabel('URL length'); plt.ylabel('Character entropy'); plt.legend(); plt.title('Feature relationship: seeded 5,000-row display sample'); plt.tight_layout(); plt.savefig(charts/'relationships.png',dpi=180); plt.show()"),
nbf.v4.new_markdown_cell('## Actual held-out evaluation\nThe same domain-separated holdout is used for both models. No hyperparameters were tuned against it. The full training entry point is `backend/train.py`; saved pipelines include imputation and scaling where appropriate.'),
nbf.v4.new_code_cell("display(pd.DataFrame({name:{k:v for k,v in r.items() if k in ['accuracy','precision','recall','f1','roc_auc','fpr','fnr']} for name,r in m['models'].items()}).T)\nfor name,r in m['models'].items():\n p=np.load(ROOT/'backend/models'/f'{name}-heldout.npz'); assert np.isclose(accuracy_score(p['truth'],p['prediction']),r['accuracy']); assert np.isclose(roc_auc_score(p['truth'],p['probability']),r['roc_auc'])\nprint('Saved predictions reproduce measured accuracy and ROC-AUC.')"),
nbf.v4.new_code_cell("fig,axes=plt.subplots(1,2,figsize=(10,4))\nfor ax,(name,r) in zip(axes,m['models'].items()):\n cm=np.array(r['confusion_matrix']); ax.imshow(cm,cmap='Blues'); ax.set_title(name); ax.set_xticks([0,1],['Legitimate','Phishing']); ax.set_yticks([0,1],['Legitimate','Phishing']); ax.set_xlabel('Predicted'); ax.set_ylabel('Actual')\n for i in range(2):\n  for j in range(2): ax.text(j,i,str(cm[i,j]),ha='center',va='center',color='white' if cm[i,j]>cm.max()/2 else 'black')\nplt.tight_layout(); plt.savefig(charts/'confusion.png',dpi=180); plt.show()"),
nbf.v4.new_code_cell("from sklearn.metrics import roc_curve\nfor name,r in m['models'].items():\n p=np.load(ROOT/'backend/models'/f'{name}-heldout.npz'); fpr,tpr,_=roc_curve(p['truth'],p['probability']); plt.plot(fpr,tpr,label=f'{name}: AUC={r[\"roc_auc\"]:.3f}')\nplt.plot([0,1],[0,1],'--',color='gray'); plt.xlabel('False positive rate'); plt.ylabel('True positive rate'); plt.legend(); plt.tight_layout(); plt.savefig(charts/'roc.png',dpi=180); plt.show()"),
nbf.v4.new_code_cell("imp=pd.DataFrame(m['models']['random_forest']['importance']).head(10).sort_values('value'); plt.barh(imp.feature,imp.value,color='#408cff'); plt.title('Random Forest impurity importance (not causal)'); plt.tight_layout(); plt.savefig(charts/'importance.png',dpi=180); plt.show()"),
nbf.v4.new_markdown_cell('## Interpretation\nRandom Forest improves the trade-off on this holdout, but false alarms remain substantial. Long URLs, high entropy and keywords are not proof of phishing; legitimate tracking and compromised trusted hosts are difficult cases. Historical source bias and uncalibrated outputs prevent production safety claims. See the report for false-positive/negative counts and references.')]
nb=nbf.v4.new_notebook(cells=cells,metadata={'kernelspec':{'display_name':'Python 3','language':'python','name':'python3'}})
nbf.write(nb,ROOT/'notebooks/raw_url_research.ipynb')
print('Wrote measured report, proposal, outline, app documents and original notebook.')
