"""Assignment 6: preregistered-in-file exploratory feature/model hybrid experiment.
Run: .venv/Scripts/python.exe assignment6/experiment.py from phishguard-ai.
"""
import hashlib
import json
import platform
import time
from pathlib import Path
import joblib
import numpy as np
import pandas as pd
import sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import HashingVectorizer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import SGDClassifier
from sklearn.metrics import (accuracy_score, average_precision_score, confusion_matrix,
    f1_score, precision_score, recall_score, roc_auc_score, roc_curve, precision_recall_curve)
from sklearn.model_selection import StratifiedGroupKFold
from sklearn.pipeline import make_pipeline

HERE=Path(__file__).resolve().parent
ROOT=HERE.parent

def measure(y,p):
    pred=(p>=.5).astype(int)
    tn,fp,fn,tp=confusion_matrix(y,pred,labels=[0,1]).ravel()
    fpr,tpr,_=roc_curve(y,p);precision,recall,_=precision_recall_curve(y,p)
    def points(x,z):
        keep=np.unique(np.linspace(0,len(x)-1,min(250,len(x))).astype(int))
        return [{'x':float(x[i]),'y':float(z[i])} for i in keep]
    return {'accuracy':accuracy_score(y,pred),'precision':precision_score(y,pred,zero_division=0),
      'recall':recall_score(y,pred,zero_division=0),'f1':f1_score(y,pred,zero_division=0),
      'fpr':float(fp/(fp+tn)),'fnr':float(fn/(fn+tp)),'roc_auc':roc_auc_score(y,p),
      'average_precision':average_precision_score(y,p),'confusion_matrix':[[int(tn),int(fp)],[int(fn),int(tp)]],
      'roc':points(fpr,tpr),'pr':points(recall,precision)}

def cluster_interval(y,p0,p1,groups):
    codes,keys=pd.factorize(groups)
    counts=np.zeros((len(keys),6),dtype=np.int64)
    for j,p in enumerate([p0,p1]):
        pred=p>=.5
        for k,mask in enumerate([(y==1)&pred,(y==0)&pred,(y==1)&~pred]):
            counts[:,j*3+k]=np.bincount(codes,weights=mask,minlength=len(keys)).astype(np.int64)
    rng=np.random.default_rng(42);diff=[]
    for _ in range(500):
        t=counts[rng.integers(0,len(keys),len(keys))].sum(axis=0)
        f=lambda i:2*t[i]/max(1,2*t[i]+t[i+1]+t[i+2])
        diff.append(f(3)-f(0))
    return {'unit':'registrable domain','draws':500,'groups':len(keys),'f1_difference_95_percentile':[float(v) for v in np.quantile(diff,[.025,.975])], 'note':'Conditional, exploratory percentile interval; does not include model-selection/training variability or remove historical-test reuse bias.'}

def run():
    started=time.perf_counter();protocol=json.loads((HERE/'protocol.json').read_text())
    out=HERE/'results';models=HERE/'models';out.mkdir(exist_ok=True);models.mkdir(exist_ok=True)
    data=pd.read_csv(ROOT/'data/raw-url/prepared.csv')
    X=pd.read_csv(ROOT/'data/raw-url/features.csv')
    old=json.loads((ROOT/'backend/models/metrics.json').read_text())
    assert len(X)==len(data)==old['dataset']['retained']
    assert list(X.columns)==old['features']
    assert hashlib.sha256((ROOT/'data/raw-url/malicious_phish.csv').read_bytes()).hexdigest()==old['source']['sha256']
    y=(data.type=='phishing').astype(int).to_numpy()
    train=np.flatnonzero(data.split=='train');test=np.flatnonzero(data.split=='test')
    assert not set(data.domain.iloc[train])&set(data.domain.iloc[test])
    assert not set(data.canonical.iloc[train])&set(data.canonical.iloc[test])
    inner_train,inner_val=next(StratifiedGroupKFold(n_splits=5,shuffle=True,random_state=73).split(X.iloc[train],y[train],data.domain.iloc[train]))
    fit,validation=train[inner_train],train[inner_val]
    assert not set(data.domain.iloc[fit])&set(data.domain.iloc[validation])
    print('Partitions:',len(fit),'fit;',len(validation),'validation;',len(test),'historical test',flush=True)
    settings=protocol['character_model'];
    def character():
        return make_pipeline(HashingVectorizer(analyzer='char',ngram_range=(3,4),n_features=262144,alternate_sign=False,norm='l2',lowercase=False,dtype=np.float32),SGDClassifier(loss='log_loss',alpha=1e-5,max_iter=30,tol=.001,class_weight='balanced',average=True,random_state=42))
    timing={}
    tic=time.perf_counter();rf_val=make_pipeline(SimpleImputer(strategy='median'),RandomForestClassifier(**protocol['lexical_model']));rf_val.fit(X.iloc[fit],y[fit]);timing['validation_lexical_fit_seconds']=time.perf_counter()-tic
    print('Validation lexical fitted',flush=True)
    p_rf_val=rf_val.predict_proba(X.iloc[validation])[:,1];del rf_val
    tic=time.perf_counter();char_val=character();char_val.fit(data.canonical.iloc[fit],y[fit]);timing['validation_character_fit_seconds']=time.perf_counter()-tic
    print('Validation character fitted',flush=True)
    p_char_val=char_val.predict_proba(data.canonical.iloc[validation])[:,1];del char_val
    candidates=[]
    for weight in protocol['weight_candidates']:
        r=measure(y[validation],(1-weight)*p_rf_val+weight*p_char_val)
        candidates.append({'character_weight':weight,**r})
    best=max(candidates,key=lambda r:(r['f1'],-r['character_weight']));weight=best['character_weight']
    print('Weight fixed from validation:',weight,flush=True)
    tic=time.perf_counter();char_model=character();char_model.fit(data.canonical.iloc[train],y[train]);timing['full_character_fit_seconds']=time.perf_counter()-tic
    joblib.dump(char_model,models/'character-linear.joblib',compress=3)
    tic=time.perf_counter();p_char=char_model.predict_proba(data.canonical.iloc[test])[:,1];timing['character_test_predict_seconds']=time.perf_counter()-tic
    del char_model
    tic=time.perf_counter()
    rf_path=ROOT/'backend/models/random_forest.joblib'
    assert hashlib.sha256(rf_path.read_bytes()).hexdigest()==old['artifacts']['random_forest']
    rf=joblib.load(rf_path);p_rf=rf.predict_proba(X.iloc[test])[:,1];timing['lexical_test_predict_seconds_including_load']=time.perf_counter()-tic
    saved=np.load(ROOT/'backend/models/random_forest-heldout.npz')
    assert np.array_equal(saved['truth'],y[test]);assert np.allclose(saved['probability'],p_rf)
    p_hybrid=(1-weight)*p_rf+weight*p_char
    baseline=np.load(ROOT/'backend/models/logistic_regression-heldout.npz');assert np.array_equal(baseline['truth'],y[test])
    evaluated={'lexical_logistic_regression':measure(y[test],baseline['probability']), 'lexical_random_forest':measure(y[test],p_rf), 'character_linear':measure(y[test],p_char), 'hybrid':measure(y[test],p_hybrid)}
    result={'date':'2026-10-22','protocol':protocol,'protocol_sha256':hashlib.sha256((HERE/'protocol.json').read_bytes()).hexdigest(),
      'dataset':old['dataset'],'source':old['source'],'split':{'outer_train':len(train),'inner_fit':len(fit),'inner_validation':len(validation),'historical_test':len(test),'domain_overlap':0,'test_positive':int(y[test].sum()),'test_negative':int((y[test]==0).sum())},
      'validation':{'lexical_random_forest':measure(y[validation],p_rf_val),'character_linear':measure(y[validation],p_char_val),'candidate_hybrids':candidates,'selected_character_weight':weight},
      'test':evaluated,'bootstrap':cluster_interval(y[test],p_rf,p_hybrid,data.domain.iloc[test]),'timing':timing,
      'runtime':{'python':platform.python_version(),'sklearn':sklearn.__version__,'machine':platform.machine(),'cpu_count':__import__('os').cpu_count()},
      'checks':{'feature_schema_matches':True,'source_hash_matches':True,'outer_domains_disjoint':True,'inner_domains_disjoint':True,'baseline_probabilities_reproduced':True,'test_not_used_for_weight_selection':True},
      'artifacts':{'character_sha256':hashlib.sha256((models/'character-linear.joblib').read_bytes()).hexdigest(),'lexical_sha256':old['artifacts']['random_forest']}}
    result['timing']['total_seconds']=time.perf_counter()-started
    (out/'metrics.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
    np.savez_compressed(out/'predictions.npz',source_id=data.source_id.iloc[test].to_numpy(),truth=y[test],lexical=p_rf,character=p_char,hybrid=p_hybrid,train_source_id=data.source_id.iloc[train].to_numpy(),validation_source_id=data.source_id.iloc[validation].to_numpy())
    print(json.dumps({k:{n:v for n,v in r.items() if n not in ['roc','pr']} for k,r in evaluated.items()},indent=2),flush=True)
    print('Saved actual results. Total seconds:',result['timing']['total_seconds'],flush=True)
    return result

if __name__=='__main__':run()
