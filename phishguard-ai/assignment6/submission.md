# Assignment 6 — XSS Security and Research Method Selection

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

Source CSV SHA-256: `d83ce942075dd63ed4d11560cfdcd9d512caa3d680e292f22cab484e8f074d01`. This experiment extends the standalone **raw-URL** study. The older Tab 7 dashboard's precomputed-feature experiment uses a different dataset and must not be mixed into these comparisons.

## 3. Method selection and baseline implementation

The method family is a hybrid feature/model ensemble using traditional ML components. Tabular lexical structure suits Random Forest, while character patterns support a sparse linear text classifier. This meets the research goal without assuming that a larger model is better. The project does not claim a deep-learning architecture or an LLM contribution. An LLM could later support explanation quality, but that would require its own factuality, latency and cost evaluation.

The original Logistic Regression provides an interpretable linear baseline: median imputation, StandardScaler, C=1, balanced weights, max_iter=2,000 and seed 42. Random Forest is the stronger comparator: median imputation, 150 trees, maximum depth 22, minimum leaf size 3, balanced weights and seed 42. Their stored pipelines and test outputs were verified rather than substituted with published notebook scores. Initial lexical LR F1 is 0.4640 and Random Forest F1 is 0.6949 on the same stored test rows.

The proposed component is SGDClassifier with logistic loss, L2 regularization, alpha=0.00001, max_iter=30, tolerance=0.001, averaged coefficients, balanced weights and seed 42. It learns from hashed URL character patterns. The hybrid averages its phishing probability with the lexical Random Forest probability using a validation-selected weight. This is a local, testable improvement to this project's baseline, not a claim that weighted ensembles are a new algorithm.

## 4. Experimental design and leakage controls

The outer partition is the existing registrable-domain-separated split: 407,908 training rows and 101,978 test rows, including 17,898 phishing and 84,080 benign records. It comes from the first seed-42 StratifiedGroupKFold split with five folds. It is one holdout, not a five-fold performance average. Private suffixes use the bundled offline public-suffix snapshot.

Inside outer training, the first seed-73 grouped split supplies 326,328 fit rows and 81,580 validation rows. A new Random Forest and character classifier fit only the inner fit partition. Candidate character weights 0.25, 0.50 and 0.75 are compared by validation phishing F1, with ties favoring the smaller character weight. Settings and the selection rule were written to `protocol.json` before executing the experiment. Threshold 0.5 is fixed for every method.

After selecting weight 0.50, the character classifier refits on all outer training data. The original full-training Random Forest is reused after verifying its hash and reproducing its saved test probabilities. The same ordered test rows serve all models. Assertions check disjoint registrable domains, disjoint canonical URLs and correct source-row labels. The current deployed scanner's model files are unchanged.

**Important evaluation boundary:** the historical test set was already inspected in earlier project work. No test metric selects this extension's weight or threshold, but reuse still makes the conclusions exploratory. A new external or temporal test set is needed for a confirmatory claim. Avoiding current test-set tuning does not erase earlier exposure.

The primary metric is phishing F1. Secondary metrics are precision, recall, FPR, FNR, average precision (AP), ROC-AUC and accuracy. AP is the average-precision summary of the precision–recall curve, not trapezoidal PR-AUC. We also report confusion matrices, measured computing time and a paired registrable-domain bootstrap interval. Accuracy alone would conceal the costs of missed attacks in this imbalanced problem.

## 5. Experimental results

| Method | Accuracy | Precision | Recall | F1 | FPR | FNR | AP | ROC-AUC |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Lexical Logistic Regression | 0.6687 | 0.3240 | 0.8171 | 0.4640 | 0.3629 | 0.1829 | 0.4522 | 0.8056 |
| Lexical Random Forest | 0.8658 | 0.5782 | 0.8704 | 0.6949 | 0.1352 | 0.1296 | 0.8256 | 0.9401 |
| Character-only linear classifier | 0.8902 | 0.6467 | 0.8252 | 0.7251 | 0.0960 | 0.1748 | 0.8012 | 0.9432 |
| Selected hybrid | 0.9303 | 0.7614 | 0.8777 | 0.8154 | 0.0585 | 0.1223 | 0.8964 | 0.9678 |


Confusion matrices use rows actual benign/phishing and columns predicted benign/phishing:

- Lexical Logistic Regression: `[[53568, 30512], [3273, 14625]]`.
- Lexical Random Forest: `[[72716, 11364], [2319, 15579]]`.
- Character-only linear classifier: `[[76011, 8069], [3128, 14770]]`.
- Selected hybrid: `[[79158, 4922], [2189, 15709]]`.

The hybrid increases F1 over the lexical Random Forest by 12.06 percentage points. Precision increases from 57.82% to 76.14%, while recall changes from 87.04% to 87.77%. False-positive rate falls from 13.52% to 5.85%. In counts, false alerts fall from 11,364 to 4,922 and missed phishing cases fall from 2,319 to 2,189. These are measured test outcomes, not promised live protection rates.

The character-only ablation achieves F1 0.7251 but has lower recall and AP than the lexical Random Forest. It does not improve every metric alone. Combining the components gives F1 0.8154 and AP 0.8964, stronger than either component on this split. Inner-validation F1 was 0.7430 for lexical-only and 0.7093 for character-only. Candidate hybrid F1 values were 0.25 weight: 0.7744, 0.5 weight: 0.8172, 0.75 weight: 0.7859. The selected mixture therefore also improved the validation comparison.

The paired domain-cluster bootstrap uses 500 draws over 30,439 test domains. The 95% percentile interval for hybrid minus lexical F1 is 3.05 to 21.68 percentage points. The wide interval reflects sensitivity to the evaluated domains. It is conditional on fitted models and does not include retraining, model selection or historical-test reuse uncertainty. A single split and one seed do not establish consistency across datasets or future traffic.

Total measured experiment time was 174.3 seconds on AMD64, Python 3.12.14 and scikit-learn 1.9.1, without a GPU or external API. Inner Random Forest training took 57.0 seconds, inner character training 23.6 seconds, and full character refitting 29.5 seconds. This adds a second model and preprocessing representation. Batch prediction timings have different loading boundaries and should not be presented as a fair per-request latency comparison. Peak memory was not measured.

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
3. From `phishguard-ai`, run `.venv\Scripts\python.exe assignment6\experiment.py`.
4. Run `.venv\Scripts\python.exe assignment6\verify_experiment.py` to check provenance, partitions, probabilities, metrics and model reload.
5. Run `.venv\Scripts\python.exe assignment6\make_deliverables.py`; execute `assignment6/research.ipynb` with the project kernel to generate its real outputs and chart assets.
6. From the website root, run `node build-assignment6.mjs` then `node verify-assignment6.mjs`. The latter checks preservation, HTML/JSON/JS/CSS and declared edits.
7. Open Assignment 6, run its XSS tests, and use the local browser fixture for the actual AI-display regression. See `verification.md` for executed checks and their limits.

Results: `assignment6/results/metrics.json`, `predictions.npz`, saved character pipeline and original notebook. Protocol SHA-256: `efaed1feb0fff7a18ea7e27b9adadf439afe6df9db8ea027e5fb6d1b3fb8e84f`. The write-up, charts and results are also accessible from the new tab. Large model/prediction artifacts are ignored by Git and reproducible with the commands above. Review the submission before uploading through Canvas.

## 9. References

- Kaggle, Malicious URLs dataset: https://www.kaggle.com/datasets/sid321axn/malicious-urls-dataset
- OWASP, Cross Site Scripting Prevention Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- scikit-learn, HashingVectorizer: https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.HashingVectorizer.html
- scikit-learn, SGDClassifier: https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.SGDClassifier.html
- scikit-learn, StratifiedGroupKFold: https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.StratifiedGroupKFold.html

External references support the method and control rationale. All counts, scores and timings in this submission come from this project's local data and executed experiment.
