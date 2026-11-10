"""Independent artifact verification; reload pipelines and recompute all held-out metrics."""
import json
import joblib
import numpy as np
from preprocess import ROOT, load_data, groups_for
from evaluate import evaluate
r=json.loads((ROOT/'results/metrics.json').read_text(encoding='utf-8'))
raw,clean,features,digest=load_data()
assert digest==r['dataset']['sha256']
by_id=clean.set_index('index')
for scope,e in r['experiments'].items():
    s=e['split']; tr=by_id.loc[s['train_source_ids']]; te=by_id.loc[s['test_source_ids']]
    assert set(tr.index).isdisjoint(te.index)
    assert len(tr)+len(te)==len(clean)
    assert set(groups_for(tr[e['features']])).isdisjoint(groups_for(te[e['features']]))
    y=(te.Result==-1).astype(int)
    for name,expected in e['models'].items():
        pipeline=joblib.load(ROOT/'models'/(scope+'-'+name.lower().replace(' ','-')+'.joblib'))
        actual,pred,prob=evaluate(pipeline,te[e['features']],y)
        for metric in ['accuracy','precision','recall','f1','roc_auc']:
            assert abs(expected[metric]-actual[metric])<1e-12
        assert expected['confusion']==actual['confusion']
        assert len(e['records'])==len(te)
        np.testing.assert_allclose(prob,[x['predictions'][name]['phishing_probability'] for x in e['records']])
        assert all(rec['id']==int(idx) for rec,idx in zip(e['records'],te.index))
        print('PASS',scope,name,'reloaded metrics, probabilities and held-out source IDs')
print('PASS CSV fingerprint; group disjointness; deduplicated partition sizes')
