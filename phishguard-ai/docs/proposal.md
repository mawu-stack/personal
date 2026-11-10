# PhishGuard AI — Project proposal

**Student:** Mawutorwu Klu · **Status:** proposal draft · **Date:** October 9, 2026

## Research question
How accurately can machine-learning models distinguish phishing websites from legitimate websites using URL-based features?

## Dataset and provenance
Use Akash Kumar’s *Phishing website dataset*, version 2, on Kaggle. This is the exact dataset linked from the supplied *Phishing URL EDA and modelling* notebook’s Input tab. The downloaded CSV contains 11,055 records and 32 columns: an index, 30 precomputed indicators, and `Result`. Source column documentation defines −1 as phishing and +1 as legitimate. The actual target contains these two labels only. The source lists CC0 licensing. No raw website URLs are present.

## Methods
Compare Logistic Regression and Random Forest under two explicitly separated scopes: eight address-related indicators addressing the research question, and all 30 website indicators as an extended benchmark. Remove the index and collapse repeated feature-and-label records before splitting. Keep identical predictor patterns in the same group, including cases with conflicting labels. Use a reproducible, approximately 80/20 group-aware stratified holdout with seed 42. Fit categorical encoding and any missing-value imputation only on training data. Assess training imbalance before deciding whether class weighting is necessary.

Report phishing-positive precision, recall, F1, accuracy and ROC-AUC, accompanied by confusion matrices, ROC curves, feature distributions, a missing-value audit and Random Forest importance. Preserve a test set that is never used for tuning. This initial project uses a single holdout; future cross-validation must remain separate from the reported test evaluation.

## Expected outcomes and deliverables
Produce reproducible Python modules, an executed Jupyter notebook, saved model pipelines, machine-readable results, a research report and a 10–15 minute presentation. Integrate measured findings into a new PhishGuard AI section of the existing K.E.A.N. portfolio. An offline record explorer will demonstrate real held-out predictions; a separate URL-text inspector will explicitly avoid offering a model verdict.

## Cybersecurity significance and limits
A missed phishing record represents exposure, while a false alarm can block legitimate use. The study will compare these errors rather than promote accuracy alone. Results from historical, precomputed data do not establish live protection. Missing domain and time metadata prevent domain-disjoint and temporal validation. Features involving certificates, content, DNS and reputation cannot be reliably reconstructed from arbitrary URL text. The interface will therefore never claim that entering a URL establishes its safety.

## Sources
- [Dataset](https://www.kaggle.com/datasets/akashkr/phishing-website-dataset)
- [Reference notebook input](https://www.kaggle.com/code/akashkr/phishing-url-eda-and-modelling/input)
- [scikit-learn: avoiding data leakage](https://scikit-learn.org/stable/common_pitfalls.html)
