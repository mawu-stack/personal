# PhishGuard AI: Machine Learning–Powered Phishing URL Detection
## One-page proposal · 13 October 2026

**Security problem.** Phishing links imitate trusted services to steal credentials or induce harmful actions. A URL can expose lexical warning signs before a page is visited, but superficial cues cannot establish whether a site is safe. The project investigates this distinction through a reproducible educational classifier.

**Research question.** Can machine learning accurately identify phishing URLs using URL-based features, and which model provides the best balance between detecting threats and minimizing false alarms?

**Dataset.** The Kaggle Malicious URLs dataset (sid321axn, version 1, CC0) contains 651,191 actual rows and two columns: URL and class. The binary experiment uses benign and phishing labels; malware and defacement are excluded. After URL validation, conflict removal and canonical deduplication, 509,886 records remain. The prior K.E.A.N. dataset is unsuitable for a live lexical scanner because it does not contain raw URLs.

**Methodology.** A single network-free Python function extracts 19 lexical features during both training and inference. Preparation addresses invalid values, duplicate URLs, contradictory labels and class imbalance. Split by registrable domain with seed 42 to reduce same-site leakage. Fit Logistic Regression with training-only scaling and Random Forest on the same training partition. Preserve the final holdout for evaluation; do not tune against it. Compare accuracy, precision, recall, F1, ROC-AUC, FPR, FNR and confusion matrices.

**Application.** Flutter Web communicates with FastAPI for genuine inference using saved pipelines. The interface provides a live scanner, dataset explorer, evaluation charts, limitations, documentation and a dated development log. The server never fetches a submitted URL. It validates input, restricts CORS and reports unavailable models explicitly. The existing K.E.A.N. website remains intact.

**Expected contribution.** The project should demonstrate an understandable comparison of linear and nonlinear classifiers and communicate the operational cost of missed attacks and false alarms. Initial measured results are available in the accompanying report; no production safety claim is made. A 10–15 minute presentation will include a live inference demonstration, error handling and an honest account of lexical limitations and dataset bias.
