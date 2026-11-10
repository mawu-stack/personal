# Methodology and references

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
