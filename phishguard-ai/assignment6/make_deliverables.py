"""Generate a submission draft and original notebook from measured results."""
import json
from pathlib import Path
import nbformat as nbf

HERE=Path(__file__).resolve().parent
r=json.loads((HERE/'results/metrics.json').read_text())
names={'lexical_logistic_regression':'Lexical Logistic Regression','lexical_random_forest':'Lexical Random Forest','character_linear':'Character-only linear classifier','hybrid':'Selected hybrid'}
metrics=['accuracy','precision','recall','f1','fpr','fnr','average_precision','roc_auc']
table='| Method | Accuracy | Precision | Recall | F1 | FPR | FNR | AP | ROC-AUC |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|\n'
for key,m in r['test'].items():table+='| '+names[key]+' | '+' | '.join(f'{m[k]:.4f}' for k in metrics)+' |\n'
b=r['test']['lexical_random_forest'];h=r['test']['hybrid'];v=r['validation'];split=r['split'];ci=r['bootstrap']['f1_difference_95_percentile'];t=r['timing']
cm='\n'.join(f'- {names[key]}: `{m["confusion_matrix"]}`.' for key,m in r['test'].items())
submission=f'''# Assignment 6 — XSS Security and Research Method Selection

**Project:** PhishGuard AI, within the K.E.A.N. cybersecurity workbench  
**Prepared:** 22 October 2026  
**Status:** Research and implementation draft for student review. Not submitted to Canvas.

## 1. Research topic, problem and objectives

**Topic:** phishing URL classification and safe handling of untrusted web input.

**Problem statement:** the existing classifier summarizes URL text with 19 numeric features. Counts and lengths discard character order, potentially losing useful spelling and path patterns. Its stronger lexical baseline, Random Forest, detects many phishing URLs but generates 11,364 false alerts in the 101,978-row historical test partition. Separately, a website that analyzes suspicious text must avoid treating that text as HTML: accurate phishing detection does not itself prevent cross-site scripting.

**Research question:** does combining the lexical Random Forest with a URL character-pattern classifier improve phishing F1 and false-positive rate relative to the lexical baseline under the same evaluation conditions?

**Objectives:** improve the measured precision/recall trade-off, quantify false-positive and false-negative costs, and use ablation comparisons to determine whether both representations contribute. The security objective is to keep user text inert at the display boundary and verify the control with markup-shaped inputs. These are related application concerns but distinct evaluations: XSS tests do not establish classification quality, and classifier metrics do not prove XSS resistance.

## 2. Dataset and preprocessing

Source: [sid321axn, Malicious URLs dataset, Kaggle, version 1](https://www.kaggle.com/datasets/sid321axn/malicious-urls-dataset). The previously verified Kaggle metadata lists CC0: Public Domain. The CSV has 651,191 rows and two text columns, `url` and `type`: 428,103 benign, 94,111 phishing, 96,457 defacement and 32,520 malware. No source values are missing. It contains 10,066 exact raw duplicate rows across all four classes.

This binary experiment uses benign=0 and phishing=1. Malware and defacement are excluded because their labels describe different threat categories. The existing preprocessing removed 4,175 invalid binary URL rows, 7,895 rows belonging to conflicting canonical labels, and 258 additional repeated canonical URLs. The result is 509,886 rows: 420,396 benign and 89,490 phishing. These exclusion counts concern the binary subset and are not interchangeable with the raw four-class duplicate count.

Validation bounds URL length to 2,048 characters and permits HTTP(S) addresses with valid hostnames or IPs. Absent schemes consistently become HTTP. Canonical keys normalize scheme/hostname, supply a root path when absent and drop fragments. The lexical extractor computes the same 19 numeric features used by the existing model, without DNS or HTTP requests. A median imputer fits on training data only; generated features contain no missing values. Logistic Regression additionally uses training-fitted scaling. Numeric flags require no categorical encoder. Balanced class weights use training-label frequencies.

The character component uses canonical URLs and hashed character 3–4-grams, 262,144 bins, no alternate signs, L2 normalization and case preservation. Hashing does not learn a vocabulary or IDF values. The classifier learns only from training rows. Hash collisions and the loss of easy feature-name interpretation are limitations. No submitted or dataset URL is visited.

Source CSV SHA-256: `{r['source']['sha256']}`. This experiment extends the standalone **raw-URL** study. The older Tab 7 dashboard's precomputed-feature experiment uses a different dataset and must not be mixed into these comparisons.

## 3. Method selection and baseline implementation

The method family is a hybrid feature/model ensemble using traditional ML components. Tabular lexical structure suits Random Forest, while character patterns support a sparse linear text classifier. This meets the research goal without assuming that a larger model is better. The project does not claim a deep-learning architecture or an LLM contribution. An LLM could later support explanation quality, but that would require its own factuality, latency and cost evaluation.

The original Logistic Regression provides an interpretable linear baseline: median imputation, StandardScaler, C=1, balanced weights, max_iter=2,000 and seed 42. Random Forest is the stronger comparator: median imputation, 150 trees, maximum depth 22, minimum leaf size 3, balanced weights and seed 42. Their stored pipelines and test outputs were verified rather than substituted with published notebook scores. Initial lexical LR F1 is 0.4640 and Random Forest F1 is 0.6949 on the same stored test rows.

The proposed component is SGDClassifier with logistic loss, L2 regularization, alpha=0.00001, max_iter=30, tolerance=0.001, averaged coefficients, balanced weights and seed 42. It learns from hashed URL character patterns. The hybrid averages its phishing probability with the lexical Random Forest probability using a validation-selected weight. This is a local, testable improvement to this project's baseline, not a claim that weighted ensembles are a new algorithm.

## 4. Experimental design and leakage controls

The outer partition is the existing registrable-domain-separated split: {split['outer_train']:,} training rows and {split['historical_test']:,} test rows, including {split['test_positive']:,} phishing and {split['test_negative']:,} benign records. It comes from the first seed-42 StratifiedGroupKFold split with five folds. It is one holdout, not a five-fold performance average. Private suffixes use the bundled offline public-suffix snapshot.

Inside outer training, the first seed-73 grouped split supplies {split['inner_fit']:,} fit rows and {split['inner_validation']:,} validation rows. A new Random Forest and character classifier fit only the inner fit partition. Candidate character weights 0.25, 0.50 and 0.75 are compared by validation phishing F1, with ties favoring the smaller character weight. Settings and the selection rule were written to `protocol.json` before executing the experiment. Threshold 0.5 is fixed for every method.

After selecting weight {v['selected_character_weight']:.2f}, the character classifier refits on all outer training data. The original full-training Random Forest is reused after verifying its hash and reproducing its saved test probabilities. The same ordered test rows serve all models. Assertions check disjoint registrable domains, disjoint canonical URLs and correct source-row labels. The current deployed scanner's model files are unchanged.

**Important evaluation boundary:** the historical test set was already inspected in earlier project work. No test metric selects this extension's weight or threshold, but reuse still makes the conclusions exploratory. A new external or temporal test set is needed for a confirmatory claim. Avoiding current test-set tuning does not erase earlier exposure.

The primary metric is phishing F1. Secondary metrics are precision, recall, FPR, FNR, average precision (AP), ROC-AUC and accuracy. AP is the average-precision summary of the precision–recall curve, not trapezoidal PR-AUC. We also report confusion matrices, measured computing time and a paired registrable-domain bootstrap interval. Accuracy alone would conceal the costs of missed attacks in this imbalanced problem.

## 5. Experimental results

{table}

Confusion matrices use rows actual benign/phishing and columns predicted benign/phishing:

{cm}

The hybrid increases F1 over the lexical Random Forest by {(h['f1']-b['f1'])*100:.2f} percentage points. Precision increases from {b['precision']*100:.2f}% to {h['precision']*100:.2f}%, while recall changes from {b['recall']*100:.2f}% to {h['recall']*100:.2f}%. False-positive rate falls from {b['fpr']*100:.2f}% to {h['fpr']*100:.2f}%. In counts, false alerts fall from 11,364 to 4,922 and missed phishing cases fall from 2,319 to 2,189. These are measured test outcomes, not promised live protection rates.

The character-only ablation achieves F1 0.7251 but has lower recall and AP than the lexical Random Forest. It does not improve every metric alone. Combining the components gives F1 0.8154 and AP 0.8964, stronger than either component on this split. Inner-validation F1 was {v['lexical_random_forest']['f1']:.4f} for lexical-only and {v['character_linear']['f1']:.4f} for character-only. Candidate hybrid F1 values were {', '.join(str(c['character_weight'])+' weight: '+format(c['f1'],'.4f') for c in v['candidate_hybrids'])}. The selected mixture therefore also improved the validation comparison.

The paired domain-cluster bootstrap uses 500 draws over {r['bootstrap']['groups']:,} test domains. The 95% percentile interval for hybrid minus lexical F1 is {ci[0]*100:.2f} to {ci[1]*100:.2f} percentage points. The wide interval reflects sensitivity to the evaluated domains. It is conditional on fitted models and does not include retraining, model selection or historical-test reuse uncertainty. A single split and one seed do not establish consistency across datasets or future traffic.

Total measured experiment time was {t['total_seconds']:.1f} seconds on {r['runtime']['machine']}, Python {r['runtime']['python']} and scikit-learn {r['runtime']['sklearn']}, without a GPU or external API. Inner Random Forest training took {t['validation_lexical_fit_seconds']:.1f} seconds, inner character training {t['validation_character_fit_seconds']:.1f} seconds, and full character refitting {t['full_character_fit_seconds']:.1f} seconds. This adds a second model and preprocessing representation. Batch prediction timings have different loading boundaries and should not be presented as a fair per-request latency comparison. Peak memory was not measured.

## 6. XSS investigation: problem, control, mitigation, improvement

| Security problem | Security control | Mitigation | Security improvement and evidence |
|---|---|---|---|
| Local AI simulation includes raw typed query text in `output`, then assigns `injectionSandboxDisplay.innerHTML = output`. | Change that output sink to `textContent`. | Render markup-shaped input as literal data regardless of prompt-guard state. | Browser regression checks literal payload text, absence of injected elements and absence of marker execution. |
| Oversized/invalid inputs reach processing code. | Explicit length/type/format validation. | Reject inputs outside the field's expected contract. | New lab validates 1–2,000 text characters; the URL API separately validates HTTP(S) addresses. Validation is not an XSS defense by itself. |
| Comments, announcements and model output can cross a markup boundary. | DOM text APIs and framework text widgets. | Keep content in a text context. | Lab tests verify special characters, Unicode, quotes and markup-shaped input remain text. Existing A4 chat/announcement paths remain text-based. |
| A parsing demonstration needs HTML semantics. | Fixed trusted sample inside an opaque-origin sandbox with restrictive CSP. | Block scripts and remote resources while illustrating a bold tag. | The frame never receives arbitrary text from the lab input. CSP complements safe rendering rather than replacing it. |

The original local prompt simulation concatenates `query` into an input transcript. Encoding only a later `user_data` fragment does not protect the raw transcript that reaches an HTML sink. The targeted fix changes the display sink while preserving the prompt-injection teaching logic. An LLM prompt guard addresses instruction boundaries; it cannot prevent browser execution through a DOM sink.

The new Assignment 6 tab demonstrates safe text rendering and the encoded source appropriate for an HTML text context. The UI explicitly explains that encoders differ by context. It does not use a blacklist of suspicious tag names as its XSS boundary and does not implement a homemade rich-HTML sanitizer. Typed input remains in memory and is not logged or uploaded. The pre-existing SentrySim vulnerable XSS mode remains an intentional teaching example, so this work does not claim to make the entire application production-secure.

## 7. Discussion and limitations

The measured hybrid improvement supports further study of complementary lexical and character representations. It does not establish that every hybrid method is superior. The lower recall of the character-only model and its lower AP than Random Forest show why ablations matter. False negatives can expose users to credential theft; false positives interrupt legitimate browsing and undermine trust. Even the improved model misses 2,189 phishing records and produces 4,922 false alerts in this historical test set.

The source is historical and aggregated, with possible label/source bias and unknown campaign overlap. Grouping domains reduces same-site leakage but cannot remove every shared template or collection artifact. Filtering invalid URLs and contradictory labels changes the population under evaluation. Character hashing introduces collisions. Neither component's probability is calibrated, and no safety guarantee is appropriate. No deep-learning or LLM superiority claim is supported by these experiments.

Next experiments should use a genuinely independent temporal/external corpus, repeat group splits and training seeds, compare calibration on training-only validation data, and estimate deployment costs at operational thresholds chosen before testing. An LLM explanation component would need an independent evaluation of faithfulness and usefulness; it cannot be credited for detection gains here. For XSS, broader sink review and server-side controls remain necessary beyond the corrected path.

## 8. Code and reproducibility

1. Use the project Python environment and installed requirements from `phishguard-ai/backend/requirements.txt`.
2. Reproduce the raw-URL baseline with `backend/download_data.py` and `backend/train.py` if its local data/models are absent. Load only trusted locally produced joblib artifacts.
3. From `phishguard-ai`, run `.venv\\Scripts\\python.exe assignment6\\experiment.py`.
4. Run `.venv\\Scripts\\python.exe assignment6\\verify_experiment.py` to check provenance, partitions, probabilities, metrics and model reload.
5. Run `.venv\\Scripts\\python.exe assignment6\\make_deliverables.py`; execute `assignment6/research.ipynb` with the project kernel to generate its real outputs and chart assets.
6. From the website root, run `node build-assignment6.mjs` then `node verify-assignment6.mjs`. The latter checks preservation, HTML/JSON/JS/CSS and declared edits.
7. Open Assignment 6, run its XSS tests, and use the local browser fixture for the actual AI-display regression. See `verification.md` for executed checks and their limits.

Results: `assignment6/results/metrics.json`, `predictions.npz`, saved character pipeline and original notebook. Protocol SHA-256: `{r['protocol_sha256']}`. The write-up, charts and results are also accessible from the new tab. Large model/prediction artifacts are ignored by Git and reproducible with the commands above. Review the submission before uploading through Canvas.

## 9. References

- Kaggle, Malicious URLs dataset: https://www.kaggle.com/datasets/sid321axn/malicious-urls-dataset
- OWASP, Cross Site Scripting Prevention Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- scikit-learn, HashingVectorizer: https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.HashingVectorizer.html
- scikit-learn, SGDClassifier: https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.SGDClassifier.html
- scikit-learn, StratifiedGroupKFold: https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.StratifiedGroupKFold.html

External references support the method and control rationale. All counts, scores and timings in this submission come from this project's local data and executed experiment.
'''
(HERE/'submission.md').write_text(submission,encoding='utf-8')
readme='''# Assignment 6

The research question, fixed configuration and selection rule are in `protocol.json`. This is a validation-selected ensemble of traditional ML components using lexical and character representations, not a deep-learning or LLM experiment.

From `phishguard-ai`:
```powershell
.venv\\Scripts\\python.exe assignment6\\experiment.py
.venv\\Scripts\\python.exe assignment6\\verify_experiment.py
.venv\\Scripts\\python.exe assignment6\\make_deliverables.py
```
Use the existing project environment. The dataset and trusted baseline models must exist first (see parent README). The notebook is original and reads actual experiment artifacts. Execute it in this directory using the project kernel. Retraining is a separate explicit command so opening the notebook does not silently change the experiment.

From the website root, export with `node build-assignment6.mjs` and validate with `node verify-assignment6.mjs`. The current single-file workbench contains the report and structured results for offline access. Do not run old reconstruction scripts. K.E.A.N. Tab 7's earlier precomputed-feature dataset is a separate experiment.

`submission.md` covers the requested problem, method, baseline, proposed change, experiments, results, XSS controls and limitations. Review it before submitting to Canvas. `verification.md` records actual tests. Large locally generated artifacts are ignored by Git. The deployed URL scanner's baseline models are unchanged.
'''
(HERE/'README.md').write_text(readme,encoding='utf-8')
cells=[nbf.v4.new_markdown_cell('# Assignment 6: lexical/character phishing ensemble\n\nOriginal notebook using actual project outputs. The historical test set has been seen before: this is an exploratory extension. Weight selection uses a separate inner validation split. Run `experiment.py` explicitly to retrain; this notebook inspects and verifies results.'),
nbf.v4.new_code_cell("from pathlib import Path\nimport json, numpy as np, pandas as pd\nimport matplotlib.pyplot as plt\nfrom sklearn.metrics import f1_score, average_precision_score, roc_curve, precision_recall_curve\nHERE=Path.cwd() if (Path.cwd()/'protocol.json').exists() else Path.cwd()/'phishguard-ai/assignment6'\nr=json.loads((HERE/'results/metrics.json').read_text())\np=np.load(HERE/'results/predictions.npz')\ncharts=HERE/'charts'; charts.mkdir(exist_ok=True)\nprint(r['source']); print(r['dataset']); print(r['split']); print(r['checks'])\nassert all(r['checks'].values())\nassert not set(p['source_id']) & set(p['train_source_id'])"),
nbf.v4.new_markdown_cell('## Rationale and protocol\nCounts and lengths lose local character order. A sparse character classifier supplies a complementary representation. The baseline is the existing Logistic Regression, with Random Forest as the stronger comparator. No LLM, API or GPU is involved. Grouped validation chooses one of three weights. The test set never selects the weight or threshold.'),
nbf.v4.new_code_cell("print(json.dumps(r['protocol'],indent=2))\ncols=['accuracy','precision','recall','f1','fpr','fnr','average_precision','roc_auc']\ntable=pd.DataFrame({k:{c:m[c] for c in cols} for k,m in r['test'].items()}).T\ndisplay(table)\nfor name,key in [('lexical_random_forest','lexical'),('character_linear','character'),('hybrid','hybrid')]:\n assert np.isclose(r['test'][name]['f1'],f1_score(p['truth'],p[key]>=.5))\n assert np.isclose(r['test'][name]['average_precision'],average_precision_score(p['truth'],p[key]))\nprint('F1 and AP recompute from actual saved predictions.')"),
nbf.v4.new_code_cell("table[['precision','recall','f1']].plot.bar(figsize=(11,5),color=['#408cff','#28a997','#e6a640']); plt.ylim(0,1); plt.ylabel('Score'); plt.title('Same historical test rows, threshold 0.5'); plt.xticks(rotation=15,ha='right'); plt.tight_layout(); plt.savefig(charts/'comparison.png',dpi=180); plt.show()"),
nbf.v4.new_code_cell("c=r['validation']['candidate_hybrids']; plt.plot([x['character_weight'] for x in c],[x['f1'] for x in c],marker='o',color='#1674ed'); plt.xlabel('Character-model mixture weight'); plt.ylabel('Inner-validation phishing F1'); plt.title('Weight selection uses validation only'); plt.xticks([.25,.5,.75]); plt.tight_layout(); plt.savefig(charts/'validation.png',dpi=180); plt.show()"),
nbf.v4.new_code_cell("fig,axes=plt.subplots(1,2,figsize=(10,4))\nfor ax,name in zip(axes,['lexical_random_forest','hybrid']):\n cm=np.array(r['test'][name]['confusion_matrix']); ax.imshow(cm,cmap='Blues'); ax.set_title(name.replace('_',' ')); ax.set_xticks([0,1],['Benign','Phishing']); ax.set_yticks([0,1],['Benign','Phishing']); ax.set_xlabel('Predicted'); ax.set_ylabel('Actual')\n for i in range(2):\n  for j in range(2): ax.text(j,i,f'{cm[i,j]:,}',ha='center',va='center',color='white' if cm[i,j]>cm.max()/2 else 'black')\nplt.tight_layout(); plt.savefig(charts/'confusion.png',dpi=180); plt.show()"),
nbf.v4.new_code_cell("fig,axes=plt.subplots(1,2,figsize=(11,4))\nfor key in ['lexical','character','hybrid']:\n fpr,tpr,_=roc_curve(p['truth'],p[key]); axes[0].plot(fpr,tpr,label=key)\n precision,recall,_=precision_recall_curve(p['truth'],p[key]); axes[1].plot(recall,precision,label=key)\naxes[0].set(xlabel='False positive rate',ylabel='True positive rate',title='ROC, all test probabilities'); axes[1].set(xlabel='Recall',ylabel='Precision',title='Precision–recall, all test probabilities')\nfor ax in axes: ax.legend(); ax.set_xlim(0,1); ax.set_ylim(0,1)\nplt.tight_layout(); plt.savefig(charts/'curves.png',dpi=180); plt.show()"),
nbf.v4.new_code_cell("display(table[['fpr','fnr','average_precision']])\nprint('Domain-cluster bootstrap:',r['bootstrap'])\nprint('Measured timing boundaries:',r['timing'])\nbase=r['test']['lexical_random_forest']; hybrid=r['test']['hybrid']\nprint('F1 change (percentage points):',100*(hybrid['f1']-base['f1']))\nprint('False-positive-rate change (percentage points):',100*(hybrid['fpr']-base['fpr']))"),
nbf.v4.new_markdown_cell('## XSS controls and limitations\nThe local AI transcript previously interpolated query text into innerHTML. The targeted fix uses textContent, independent of prompt-guard state. The new workbench lab tests literal rendering, contextual HTML-text encoding and validation boundaries. Existing SentrySim vulnerable behavior remains intentional.\n\nHybrid gains are exploratory. Character-only recall/AP are worse than Random Forest, which motivates ablation rather than a blanket claim that text features improve everything. Test reuse, source bias, hashing collisions and a single fitted seed remain limitations. The conditional domain-bootstrap interval excludes model-selection and retraining variability. See submission.md and verification.md.')]
nb=nbf.v4.new_notebook(cells=cells,metadata={'kernelspec':{'display_name':'Python 3','language':'python','name':'python3'}})
nbf.write(nb,HERE/'research.ipynb')
print('Generated actual-results submission, README and original notebook.')
