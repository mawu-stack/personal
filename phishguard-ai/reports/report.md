# PhishGuard AI — Research report draft
13 October 2026 · Standalone Flutter/FastAPI experiment

## 1. Introduction
PhishGuard AI studies whether URL text alone offers useful evidence of phishing. It combines an original scikit-learn experiment with a Flutter interface and a local FastAPI service. The research question is not whether a classifier can certify safety, but how well two models distinguish phishing from benign examples while managing the cost of mistakes. The application is an educational prototype. It deliberately avoids loading suspicious pages, collecting user credentials or making production-protection claims.

This work is separate from the earlier K.E.A.N. precomputed-feature dashboard. That dataset could support held-out-record analysis but not faithful prediction from newly entered URL strings. Reusing its models with guessed features would introduce training/inference mismatch. The standalone implementation instead starts with raw URLs and shares an exact extraction function between offline training and the prediction endpoint.

## 2. Security problem
Phishing uses impersonation and deception to obtain credentials or induce harmful actions. Lexical cues such as unusual hostname structure, long paths, encoded characters or sensitive words may help, but none is conclusive. Legitimate tracking links can be long; attackers can use short links or compromise established websites. HTTPS protects transport but does not establish the legitimacy of a page or organization.

A false negative predicts legitimate for phishing and may expose the user to credential theft. A false positive blocks or alarms on legitimate activity, disrupting work and eroding trust. Accuracy alone obscures these costs in an imbalanced dataset. Precision measures how often phishing alerts are correct; recall measures how much phishing is caught. Both rates and absolute errors must be visible in a credible research demonstration.

<div style="page-break-after: always;"></div>

## 3. Dataset description
The public source is Kaggle's Malicious URLs dataset, published by sid321axn, version 1. Kaggle API metadata lists CC0: Public Domain. The downloaded `malicious_phish.csv` contains 651,191 rows, with URL and type as text columns. The raw labels are {'benign': 428103, 'defacement': 96457, 'phishing': 94111, 'malware': 32520}. There are no missing source cells and 10,066 exact raw duplicate rows. These figures were calculated from the downloaded file rather than copied from a notebook.

The binary question uses benign and phishing only. Malware and defacement describe different threat categories, so silently merging them with phishing would change the research target. The retained labels are benign=0 and phishing=1. CSV SHA-256 is `d83ce942075dd63ed4d11560cfdcd9d512caa3d680e292f22cab484e8f074d01`. The downloader verifies this checksum before saving a reproduction copy. Large data and model files are excluded from Git; public source and reproduction steps are retained.

## 4. Data preprocessing
URL validation rejects unsupported schemes, missing hostnames, malformed labels, out-of-range ports, whitespace/markup and inputs over 2048 characters. An absent scheme is consistently treated as HTTP. This convention supports the historical dataset but must not be interpreted as knowing the original transport protocol. Validation excluded 4,175 binary rows. Canonicalization identifies equivalent scheme/host forms and ignores fragments for duplicate detection. All 7,895 rows with conflicting canonical labels were removed rather than arbitrarily choosing a label; then 258 repeated canonical URLs were collapsed.

The final dataset contains 509,886 records: 420,396 benign and 89,490 phishing. This imbalance motivates balanced training weights. Filtering can introduce selection bias: conclusions apply to accepted URLs, not every malformed or unsupported input in the wild. Exclusion counts are therefore documented and shown in the interface.

<div style="page-break-after: always;"></div>

## 5. Methodology
The shared extractor produces 19 numeric lexical features: URL, host, path and query lengths; counts of dots, hyphens, digits, slashes, percent signs and @ signs; digit ratio; query-parameter and subdomain counts; IP-host, explicit-port, HTTPS and punycode indicators; character entropy; and sensitive-word occurrences. It performs no DNS or HTTP requests. All features are extracted identically for dataset rows and submitted inputs. Numeric binary flags require no separate categorical encoder. All features are retained to avoid selection based on test performance.

The split uses the first fold of seed-42 StratifiedGroupKFold with five partitions, grouped by registrable domain including private suffixes. The public-suffix snapshot is bundled locally and never updated during inference. There are 407,908 training and 101,978 test rows, with zero shared domain groups and zero shared canonical URLs. This is one held-out result, not the mean of five-fold cross-validation. Both models see the same split. Domain grouping reduces one source of leakage but does not eliminate campaign or collection-source overlap.

Logistic Regression provides a linear baseline. Its median imputer and standard scaler fit only the training data. Random Forest models nonlinear relationships and interactions; it uses a training-fitted median imputer without scaling. Defensive imputation is retained even though the generated features have no missing values. Both use class_weight=balanced, learned from training frequencies. Fixed model settings are LR C=1/max_iter=2000 and RF 150 trees/max_depth=22/min_samples_leaf=3. No tuning uses the final test set. Saved artifacts contain the complete preprocessing pipeline and feature schema.

<div style="page-break-after: always;"></div>

## 6. Experimental results
All metrics below are computed from actual held-out predictions with phishing as the positive class and threshold 0.5.

| Model | Accuracy | Precision | Recall | F1 | ROC-AUC | FPR | FNR |
|---|---:|---:|---:|---:|---:|---:|---:|
| Logistic Regression | 0.6687 | 0.3240 | 0.8171 | 0.4640 | 0.8056 | 0.3629 | 0.1829 |
| Random Forest | 0.8658 | 0.5782 | 0.8704 | 0.6949 | 0.9401 | 0.1352 | 0.1296 |


Logistic Regression confusion matrix (rows actual benign/phishing; columns predicted benign/phishing): [[53568, 30512], [3273, 14625]]. Random Forest: [[72716, 11364], [2319, 15579]].

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
