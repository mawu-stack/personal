"""Independent checks against saved outputs; does not retrain or alter results."""
import hashlib
import json
from pathlib import Path
import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, average_precision_score, roc_auc_score, confusion_matrix

HERE=Path(__file__).resolve().parent;ROOT=HERE.parent
if __name__=='__main__':
    r=json.loads((HERE/'results/metrics.json').read_text())
    p=np.load(HERE/'results/predictions.npz')
    data=pd.read_csv(ROOT/'data/raw-url/prepared.csv')
    raw=pd.read_csv(ROOT/'data/raw-url/malicious_phish.csv')
    assert len(data)==r['dataset']['retained']
    assert np.array_equal(data.url.to_numpy(),raw.url.iloc[data.source_id].to_numpy())
    assert np.array_equal(data.type.to_numpy(),raw.type.iloc[data.source_id].to_numpy())
    test=data[data.split=='test'];train=data[data.split=='train']
    validation=data[data.source_id.isin(p['validation_source_id'])]
    fit=train[~train.source_id.isin(p['validation_source_id'])]
    assert not set(train.domain)&set(test.domain)
    assert not set(fit.domain)&set(validation.domain)
    assert set(validation.source_id)<=set(train.source_id)
    assert np.array_equal(test.source_id.to_numpy(),p['source_id'])
    assert not set(p['source_id'])&set(p['train_source_id'])
    assert np.array_equal((test.type=='phishing').astype(int).to_numpy(),p['truth'])
    weight=max(r['validation']['candidate_hybrids'],key=lambda c:(c['f1'],-c['character_weight']))['character_weight']
    assert weight==r['validation']['selected_character_weight']
    assert np.allclose(p['hybrid'],(1-weight)*p['lexical']+weight*p['character'])
    y=p['truth'];scores={'accuracy':accuracy_score,'precision':precision_score,'recall':recall_score,'f1':f1_score}
    probabilities={'lexical_logistic_regression':np.load(ROOT/'backend/models/logistic_regression-heldout.npz')['probability'],'lexical_random_forest':p['lexical'],'character_linear':p['character'],'hybrid':p['hybrid']}
    for name,prob in probabilities.items():
        pred=(prob>=.5).astype(int);m=r['test'][name]
        for k,f in scores.items():assert np.isclose(m[k],f(y,pred))
        assert np.isclose(m['roc_auc'],roc_auc_score(y,prob))
        assert np.isclose(m['average_precision'],average_precision_score(y,prob))
        assert m['confusion_matrix']==confusion_matrix(y,pred).tolist()
        tn,fp,fn,tp=confusion_matrix(y,pred).ravel()
        assert np.isclose(m['fpr'],fp/(fp+tn)) and np.isclose(m['fnr'],fn/(fn+tp))
    model_path=HERE/'models/character-linear.joblib'
    assert hashlib.sha256(model_path.read_bytes()).hexdigest()==r['artifacts']['character_sha256']
    model=joblib.load(model_path)
    sample=test.iloc[:128]
    assert np.allclose(model.predict_proba(sample.canonical)[:,1],p['character'][:128])
    assert all(r['checks'].values())
    print('PASS: raw row provenance/labels; outer and inner domain separation; validation-only weight selection; prediction mixing; all reported metrics/CM recomputed; saved character model reload matches predictions.')
