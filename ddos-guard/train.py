"""Fixed offline experiment. No requests or attack traffic are generated."""
from pathlib import Path
import json, hashlib, time
import numpy as np
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import accuracy_score,precision_score,recall_score,f1_score,confusion_matrix,roc_auc_score,roc_curve,precision_recall_curve,average_precision_score
ROOT=Path(__file__).resolve().parent
FEATURES=['Protocol','Flow Duration','Total Fwd Packets','Total Backward Packets','Flow Bytes/s','Flow Packets/s','SYN Flag Count','ACK Flag Count']
def main():
 start=time.perf_counter(); frames={}; sources=[]; counts={}
 for split in ['training','testing']:
  parts=[]
  for path in sorted((ROOT/'data/flows').glob('*-'+split+'.parquet')):
   d=pd.read_parquet(path); sources.append({'file':path.name,'rows':len(d),'sha256':hashlib.sha256(path.read_bytes()).hexdigest()});parts.append(d[FEATURES+['Label']])
  frames[split]=pd.concat(parts,ignore_index=True);counts[split]=frames[split].Label.value_counts().to_dict()
 train,test=frames['training'].copy(),frames['testing'].copy()
 for d in [train,test]:
  d[FEATURES]=d[FEATURES].replace([np.inf,-np.inf],np.nan)
  d['target']=(d.Label!='Benign').astype(int)
 # Exclude ambiguous training feature patterns, then exact duplicates.
 hashes=pd.util.hash_pandas_object(train[FEATURES],index=False)
 conflicting=train.groupby(hashes).target.nunique(); bad=set(conflicting[conflicting>1].index)
 train=train.loc[~hashes.isin(bad)].drop_duplicates(FEATURES).copy()
 trainhash=set(pd.util.hash_pandas_object(train[FEATURES],index=False))
 overlap=pd.util.hash_pandas_object(test[FEATURES],index=False).isin(trainhash)
 removed=int(overlap.sum());test=test.loc[~overlap].drop_duplicates(FEATURES+['target']).copy()
 # Fixed cap limits CPU cost; no hyperparameter selection on the test set.
 if len(train)>120000:
  from sklearn.model_selection import train_test_split
  train,_=train_test_split(train,train_size=120000,stratify=train.target,random_state=42)
 imputer=SimpleImputer(strategy='median');x=imputer.fit_transform(train[FEATURES]);xt=imputer.transform(test[FEATURES]);y=train.target.to_numpy();yt=test.target.to_numpy()
 models={'Decision tree':DecisionTreeClassifier(max_depth=5,min_samples_leaf=20,class_weight='balanced',random_state=42),'Random forest':RandomForestClassifier(n_estimators=100,max_depth=12,min_samples_leaf=5,class_weight='balanced',random_state=42,n_jobs=2)}
 result={'status':'complete','source':'https://www.kaggle.com/datasets/dhoogla/cicddos2019','license':'CC BY-NC-SA 4.0 (Kaggle mirror metadata; cite original CIC paper)','features':FEATURES,'sources':sources,'raw_counts':counts,'train_rows':len(train),'test_rows':len(test),'test_overlap_removed':removed,'seed':42,'models':{},'classes':test.Label.value_counts().to_dict(),'distributions':{}}
 for name,model in models.items():
  t=time.perf_counter();model.fit(x,y);seconds=time.perf_counter()-t;p=model.predict(xt);s=model.predict_proba(xt)[:,1];cm=confusion_matrix(yt,p,labels=[0,1]);tn,fp,fn,tp=map(int,cm.ravel());fpr,tpr,_=roc_curve(yt,s);pr,re,_=precision_recall_curve(yt,s)
  def sampled(a):return np.asarray(a)[np.linspace(0,len(a)-1,min(100,len(a))).astype(int)].tolist()
  result['models'][name]={'accuracy':accuracy_score(yt,p),'precision':precision_score(yt,p,zero_division=0),'recall':recall_score(yt,p,zero_division=0),'f1':f1_score(yt,p),'auc':roc_auc_score(yt,s),'ap':average_precision_score(yt,s),'fpr':fp/(fp+tn),'fnr':fn/(fn+tp),'confusion':cm.tolist(),'train_seconds':seconds,'roc':list(zip(sampled(fpr),sampled(tpr))),'pr':list(zip(sampled(re),sampled(pr)))}
  if name=='Decision tree':
   tr=model.tree_;result['browser_model']={'features':FEATURES,'medians':imputer.statistics_.tolist(),'left':tr.children_left.tolist(),'right':tr.children_right.tolist(),'feature':tr.feature.tolist(),'threshold':tr.threshold.tolist(),'prediction':[int(np.argmax(v)) for v in tr.value[:,0,:]]}
   result['examples']=[{'label':str(test.iloc[i].Label),'values':dict(zip(FEATURES,map(float,xt[i]))),'prediction':int(p[i])} for i in np.linspace(0,len(test)-1,24).astype(int)]
 for field in ['Flow Packets/s','Flow Bytes/s','Flow Duration']:
  entries={}
  for label in ['Benign','Attack']:
   v=test.loc[(test.target==0) if label=='Benign' else (test.target==1),field].dropna().clip(lower=0)
   bins=np.array([0,1,2,3,4,5,6,7,8,np.inf]);hist,_=np.histogram(np.log10(1+v),bins=bins);entries[label]=hist.tolist()
  result['distributions'][field]=entries
 result['elapsed_seconds']=time.perf_counter()-start
 (ROOT/'results/metrics.json').write_text(json.dumps(result,allow_nan=False),encoding='utf-8')
 print(json.dumps({k:result[k] for k in ['train_rows','test_rows','test_overlap_removed','elapsed_seconds']}));print({k:v['f1'] for k,v in result['models'].items()})
if __name__=='__main__':main()
