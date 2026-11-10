"""Original raw-URL experiment. Run from backend: python train.py."""
import hashlib
import json
from pathlib import Path
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, roc_auc_score, roc_curve
from sklearn.model_selection import StratifiedGroupKFold
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from app.features import FEATURES, SCHEMA_VERSION, canonical_url, domain_group, extract_features

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'backend/models'
SOURCE = ROOT / 'data/raw-url/malicious_phish.csv'

def run():
    raw = pd.read_csv(SOURCE)
    assert list(raw.columns) == ['url', 'type']
    data = raw[raw.type.isin(['benign', 'phishing'])].dropna().copy()
    data['source_id'] = data.index
    canonical = []
    for value in data.url:
        try: canonical.append(canonical_url(value))
        except ValueError: canonical.append(None)
    data['canonical'] = canonical
    invalid = int(data.canonical.isna().sum())
    data = data.dropna(subset=['canonical'])
    conflicts = data.groupby('canonical').type.nunique()
    conflict_keys = conflicts[conflicts > 1].index
    conflict_rows = int(data.canonical.isin(conflict_keys).sum())
    data = data[~data.canonical.isin(conflict_keys)]
    duplicates = int(data.duplicated('canonical').sum())
    data = data.drop_duplicates('canonical').reset_index(drop=True)
    print('Extracting', len(data), 'URLs', flush=True)
    X = pd.DataFrame([extract_features(u) for u in data.url], columns=FEATURES)
    y = (data.type == 'phishing').astype(int)
    groups = data.url.map(domain_group)
    train, test = next(StratifiedGroupKFold(n_splits=5, shuffle=True, random_state=42).split(X, y, groups))
    assert not set(groups.iloc[train]) & set(groups.iloc[test])
    assert not set(data.canonical.iloc[train]) & set(data.canonical.iloc[test])
    OUT.mkdir(parents=True, exist_ok=True)
    models = {
        'logistic_regression': make_pipeline(SimpleImputer(strategy='median'), StandardScaler(), LogisticRegression(max_iter=2000, class_weight='balanced', random_state=42)),
        'random_forest': make_pipeline(SimpleImputer(strategy='median'), RandomForestClassifier(n_estimators=150, max_depth=22, min_samples_leaf=3, class_weight='balanced', random_state=42, n_jobs=2))}
    results = {}
    for name, model in models.items():
        print('Training', name, flush=True)
        model.fit(X.iloc[train], y.iloc[train])
        prob = model.predict_proba(X.iloc[test])[:, 1]
        pred = (prob >= .5).astype(int)
        tn, fp, fn, tp = confusion_matrix(y.iloc[test], pred, labels=[0,1]).ravel()
        fpr, tpr, _ = roc_curve(y.iloc[test], prob)
        keep = np.unique(np.linspace(0, len(fpr)-1, min(201, len(fpr))).astype(int))
        results[name] = { 'accuracy': accuracy_score(y.iloc[test], pred), 'precision': precision_score(y.iloc[test], pred),
            'recall': recall_score(y.iloc[test], pred), 'f1': f1_score(y.iloc[test], pred), 'roc_auc': roc_auc_score(y.iloc[test], prob),
            'fpr': fp/(fp+tn), 'fnr': fn/(fn+tp), 'confusion_matrix': [[int(tn), int(fp)], [int(fn), int(tp)]],
            'roc': [{'x':float(fpr[i]),'y':float(tpr[i])} for i in keep]}
        final = model.steps[-1][1]
        weights = final.feature_importances_ if hasattr(final, 'feature_importances_') else final.coef_[0]
        results[name]['importance'] = sorted([{'feature': f, 'value':float(v)} for f,v in zip(FEATURES, weights)], key=lambda p:abs(p['value']), reverse=True)
        joblib.dump(model, OUT / (name + '.joblib'))
        np.savez_compressed(OUT / (name + '-heldout.npz'), truth=y.iloc[test].to_numpy(), prediction=pred, probability=prob)
        print(name, results[name]['accuracy'], flush=True)
    histograms = {}
    for feature in FEATURES:
        edges = np.histogram_bin_edges(X[feature], bins=12)
        histograms[feature] = {'edges': edges.tolist(), 'benign':np.histogram(X.loc[y==0,feature],bins=edges)[0].tolist(), 'phishing':np.histogram(X.loc[y==1,feature],bins=edges)[0].tolist()}
    manifest = {'schema_version':SCHEMA_VERSION,'features':FEATURES, 'seed':42, 'date':'2026-10-13',
        'source':{'url':'https://www.kaggle.com/datasets/sid321axn/malicious-urls-dataset','version':1,'license':'CC0: Public Domain', 'sha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest()},
        'dataset':{'raw_rows':len(raw),'raw_columns':list(raw.columns),'raw_classes':raw.type.value_counts().to_dict(), 'missing':raw.isna().sum().to_dict(), 'raw_duplicates':int(raw.duplicated().sum()), 'invalid_binary_rows':invalid,'conflicting_rows_removed':conflict_rows,'canonical_duplicates_removed':duplicates,'retained':len(data),'classes':data.type.value_counts().to_dict(), 'feature_count':len(FEATURES)},
        'split':{'method':'First fold of 5-fold StratifiedGroupKFold grouped by registrable domain (including private suffixes). Single held-out evaluation; no tuning.', 'train':len(train),'test':len(test),'domain_overlap':0,'train_classes':y.iloc[train].value_counts().to_dict(),'test_classes':y.iloc[test].value_counts().to_dict()},
        'models':results,'histograms':histograms,'correlation':X.corr().fillna(0).values.tolist(),
        'limitations':['Historical dataset with source and collection bias; no temporal holdout.', 'Lexical signals miss compromised legitimate sites and page-content attacks.', 'Probabilities are uncalibrated; predicted legitimate is not guaranteed safe.', 'Domain-disjoint split reduces same-domain leakage, but cannot prove absence of campaign/source leakage.']}
    manifest['artifacts'] = {name:hashlib.sha256((OUT/(name+'.joblib')).read_bytes()).hexdigest() for name in models}
    (OUT/'metrics.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
    (OUT/'feature-schema.json').write_text(json.dumps({'version':SCHEMA_VERSION,'features':FEATURES},indent=2),encoding='utf-8')
    data.assign(split=np.where(data.index.isin(test),'test','train'),domain=groups).to_csv(ROOT/'data/raw-url/prepared.csv',index=False)
    X.to_csv(ROOT/'data/raw-url/features.csv',index=False)
    return manifest

if __name__ == '__main__': run()
