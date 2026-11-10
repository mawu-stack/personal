"""Run: python src/train.py. Produces real models, JSON, charts and held-out examples."""
import json
import platform
from datetime import datetime
from zoneinfo import ZoneInfo
import joblib
import numpy as np
import pandas as pd
import sklearn
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from sklearn.model_selection import StratifiedGroupKFold
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from preprocess import ROOT, SEED, LEXICAL, load_data, encoder, groups_for
from evaluate import evaluate, aggregate_importance

def run():
    raw, clean, features, digest = load_data()
    out = ROOT / 'results'; charts = out / 'charts'; charts.mkdir(parents=True, exist_ok=True)
    (ROOT / 'models').mkdir(exist_ok=True)
    y = (clean.Result == -1).astype(int)
    result = {'schema_version': 1, 'status': 'complete', 'generated_at': datetime.now(ZoneInfo('America/New_York')).isoformat(),
      'dataset': {'title': 'Phishing website dataset', 'creator': 'Akash Kumar (akashkr)',
      'url': 'https://www.kaggle.com/datasets/akashkr/phishing-website-dataset', 'version': 2,
      'notebook': 'https://www.kaggle.com/code/akashkr/phishing-url-eda-and-modelling/input',
      'sha256': digest, 'records': len(raw), 'columns': len(raw.columns), 'features': len(features),
      'target': 'Result', 'labels': {'-1': 'Phishing', '1': 'Legitimate'},
      'missing': int(raw.isna().sum().sum()), 'exact_duplicates': int(raw.duplicated().sum()),
      'duplicates_without_index': len(raw)-len(clean), 'retained': len(clean),
      'distribution': {'Phishing': int((raw.Result == -1).sum()), 'Legitimate': int((raw.Result == 1).sum())}},
      'seed': SEED, 'versions': {'python': platform.python_version(), 'sklearn': sklearn.__version__, 'pandas': pd.__version__, 'numpy': np.__version__},
      'feature_summaries': {}, 'experiments': {}}
    for col in features:
        result['feature_summaries'][col] = {'missing': int(raw[col].isna().sum()), 'values': [
            {'value': int(v), 'Phishing': int(((raw[col] == v)&(raw.Result == -1)).sum()),
             'Legitimate': int(((raw[col] == v)&(raw.Result == 1)).sum())} for v in sorted(raw[col].dropna().unique())]}
    corr = clean[features].corr().fillna(0)
    result['correlation'] = {'features': features, 'values': corr.to_numpy().round(4).tolist()}
    for key, cols in [('url', LEXICAL), ('full', features)]:
        X = clean[cols]; groups = groups_for(X)
        splitter = StratifiedGroupKFold(n_splits=5, shuffle=True, random_state=SEED)
        train, test = next(splitter.split(X, y, groups))
        assert set(groups.iloc[train]).isdisjoint(set(groups.iloc[test]))
        assert len(set(y.iloc[train])) == len(set(y.iloc[test])) == 2
        counts = y.iloc[train].value_counts(); imbalance = counts.max()/counts.min()
        weight = 'balanced' if imbalance > 1.5 else None
        exp = {'features': cols, 'split': {'method': 'First fold of 5-fold StratifiedGroupKFold',
          'train': len(train), 'test': len(test), 'test_fraction': len(test)/len(clean),
          'train_phishing': int(y.iloc[train].sum()), 'test_phishing': int(y.iloc[test].sum()),
          'unique_groups': int(groups.nunique()), 'group_overlap': 0, 'class_weight': weight,
          'train_source_ids': clean.iloc[train]['index'].astype(int).tolist(),
          'test_source_ids': clean.iloc[test]['index'].astype(int).tolist()}, 'models': {}}
        algorithms = {'Logistic Regression': LogisticRegression(max_iter=2000, C=1.0, random_state=SEED, class_weight=weight),
                      'Random Forest': RandomForestClassifier(n_estimators=250, min_samples_leaf=2, random_state=SEED, class_weight=weight, n_jobs=2)}
        predictions = {}
        for name, model in algorithms.items():
            pipeline = Pipeline([('encode', encoder()), ('model', model)])
            pipeline.fit(X.iloc[train], y.iloc[train])
            scores, pred, prob = evaluate(pipeline, X.iloc[test], y.iloc[test])
            scores['parameters'] = model.get_params()
            exp['models'][name] = scores
            predictions[name] = (pred, prob)
            joblib.dump(pipeline, ROOT / 'models' / (key+'-'+name.lower().replace(' ','-')+'.joblib'))
            if name == 'Random Forest': exp['importance'] = aggregate_importance(pipeline, cols)
        exp['records'] = [{'id': int(clean.iloc[idx]['index']), 'actual': 'Phishing' if y.iloc[idx] else 'Legitimate',
            'features': {c: int(clean.iloc[idx][c]) if pd.notna(clean.iloc[idx][c]) else None for c in cols},
            'predictions': {n: {'label': 'Phishing' if p[0][j] else 'Legitimate', 'phishing_probability': float(p[1][j])} for n,p in predictions.items()}}
            for j,idx in enumerate(test)]
        result['experiments'][key] = exp
    (out / 'metrics.json').write_text(json.dumps(result, indent=2, allow_nan=False), encoding='utf-8')
    make_charts(result, corr, charts)
    print(json.dumps({'dataset': result['dataset'], 'metrics': {k: {n: {m:v for m,v in s.items() if m in ['accuracy','precision','recall','f1','roc_auc','confusion']} for n,s in e['models'].items()} for k,e in result['experiments'].items()}},indent=2))
    return result

def make_charts(r, corr, out):
    plt.rcParams.update({'figure.dpi':140,'axes.spines.top':False,'axes.spines.right':False})
    def save(name): plt.tight_layout(); plt.savefig(out / (name+'.png'), bbox_inches='tight'); plt.close()
    plt.figure(figsize=(6,4)); plt.bar(r['dataset']['distribution'].keys(), r['dataset']['distribution'].values(),color=['#b7791f','#087f8c']); plt.ylabel('Raw records'); plt.title('Source class distribution'); save('classes')
    plt.figure(figsize=(12,10)); plt.imshow(corr,vmin=-1,vmax=1,cmap='RdBu_r'); plt.colorbar(label='Pearson r (encoded states)'); plt.xticks(range(len(corr)),corr.columns,rotation=90,fontsize=6); plt.yticks(range(len(corr)),corr.columns,fontsize=6); plt.title('Deduplicated feature correlation — descriptive, not causal'); save('correlation')
    plt.figure(figsize=(10,5)); names=list(r['feature_summaries']); plt.barh(names,[r['feature_summaries'][c]['missing'] for c in names]); plt.xlabel('Missing entries'); plt.xlim(0,max(1,r['dataset']['missing'])); plt.yticks(fontsize=6); plt.title('Missing-value audit'); save('missing')
    fig, axs=plt.subplots(2,4,figsize=(14,7))
    for ax,c in zip(axs.ravel(),LEXICAL):
        data=r['feature_summaries'][c]['values']; x=np.arange(len(data)); ax.bar(x-.2,[v['Phishing'] for v in data],.4,label='Phishing',color='#b7791f'); ax.bar(x+.2,[v['Legitimate'] for v in data],.4,label='Legitimate',color='#087f8c'); ax.set_xticks(x,[v['value'] for v in data]); ax.set_title(c,fontsize=8); ax.set_ylabel('Raw records')
    axs[0,0].legend(fontsize=7); save('feature-distributions')
    for key,e in r['experiments'].items():
        plt.figure(figsize=(6,5))
        for name,m in e['models'].items(): plt.plot([p['fpr'] for p in m['roc']],[p['tpr'] for p in m['roc']],label=f"{name} AUC={m['roc_auc']:.3f}")
        plt.plot([0,1],[0,1],'k--'); plt.xlabel('False-positive rate'); plt.ylabel('True-positive rate'); plt.title(key+' features: held-out ROC'); plt.legend(); save(key+'-roc')
        fig,axes=plt.subplots(1,2,figsize=(9,4))
        for ax,(name,m) in zip(axes,e['models'].items()):
            a=np.array(m['confusion']); ax.imshow(a,cmap='Blues'); ax.set_title(name)
            for (i,j),v in np.ndenumerate(a): ax.text(j,i,str(v),ha='center',va='center',color='white' if v>a.max()/2 else 'black')
            ax.set_xticks([0,1],['Legitimate','Phishing']); ax.set_yticks([0,1],['Legitimate','Phishing']); ax.set_xlabel('Predicted'); ax.set_ylabel('Actual')
        save(key+'-confusion')
        plt.figure(figsize=(8,4)); imp=e['importance'][:10][::-1]; plt.barh([x['feature'] for x in imp],[x['importance'] for x in imp],color='#087f8c'); plt.xlabel('Summed one-hot impurity importance'); plt.title(key+' Random Forest — association, not causation'); save(key+'-importance')
        plt.figure(figsize=(8,4)); metrics=['accuracy','precision','recall','f1','roc_auc']; x=np.arange(5)
        for i,(name,m) in enumerate(e['models'].items()): plt.bar(x+(i-.5)*.35,[m[z] for z in metrics],.35,label=name)
        plt.xticks(x,metrics); plt.ylim(0,1); plt.legend(); plt.title(key+' held-out model comparison'); save(key+'-comparison')

if __name__ == '__main__': run()
