import socket
import numpy as np
import pandas as pd
import pytest
from fastapi.testclient import TestClient
from app.main import app, state
from app.features import FEATURES, extract_features, canonical_url, domain_group

@pytest.fixture(scope='session')
def client():
    with TestClient(app) as c:
        yield c

def test_ready(client):
    assert client.get('/health').json()['status']=='ready'
    assert client.get('/model-info').json()['features']==FEATURES

@pytest.mark.parametrize('model',['random_forest','logistic_regression'])
def test_real_inference_matches_pipeline(client, model, monkeypatch):
    def denied(*args, **kwargs): raise AssertionError('Network access attempted')
    monkeypatch.setattr(socket,'getaddrinfo',denied)
    value='https://example.com/account?source=demo'
    result=client.post('/predict',json={'url':value,'model':model})
    assert result.status_code==200
    expected=state['models'][model].predict_proba(pd.DataFrame([extract_features(value)],columns=FEATURES))[0,1]
    assert result.json()['phishing_probability']==pytest.approx(expected)
    assert list(result.json()['features'])==FEATURES

@pytest.mark.parametrize('value',['','javascript:alert(1)','file:///etc/passwd','https://','not a url','<img src=x>','https://a..com','https://example.com:99999','https://example.com/\nhello','a'*2049])
def test_invalid(client,value):
    assert client.post('/predict',json={'url':value}).status_code==422

def test_model_validation(client):
    assert client.post('/predict',json={'url':'example.com','model':'../../other'}).status_code==422

def test_offline_has_no_fake_result(client):
    models=state['models']
    state['models']={}
    try: assert client.post('/predict',json={'url':'example.com'}).status_code==503
    finally: state['models']=models

def test_cors(client):
    allowed=client.options('/predict',headers={'Origin':'http://localhost:8080','Access-Control-Request-Method':'POST'})
    denied=client.options('/predict',headers={'Origin':'https://untrusted.example','Access-Control-Request-Method':'POST'})
    assert allowed.headers['access-control-allow-origin']=='http://localhost:8080'
    assert 'access-control-allow-origin' not in denied.headers

def test_normalization_and_groups():
    assert canonical_url('EXAMPLE.com')==canonical_url('http://example.com/')
    assert domain_group('https://a.example.co.uk')==domain_group('https://b.example.co.uk')
    assert domain_group('https://one.blogspot.com')!=domain_group('https://two.blogspot.com')
    assert extract_features('example.com')==extract_features('http://example.com')

def test_metrics_from_predictions(client):
    from pathlib import Path
    from sklearn.metrics import accuracy_score, roc_auc_score, confusion_matrix
    root=Path(__file__).resolve().parents[1]
    metrics=client.get('/metrics').json()
    for name,m in metrics['models'].items():
        d=np.load(root/'models'/f'{name}-heldout.npz')
        assert accuracy_score(d['truth'],d['prediction'])==pytest.approx(m['accuracy'])
        assert roc_auc_score(d['truth'],d['probability'])==pytest.approx(m['roc_auc'])
        assert confusion_matrix(d['truth'],d['prediction']).tolist()==m['confusion_matrix']
    prepared=pd.read_csv(root.parent/'data/raw-url/prepared.csv')
    assert not set(prepared.loc[prepared.split=='train','domain']) & set(prepared.loc[prepared.split=='test','domain'])
    assert not set(prepared.loc[prepared.split=='train','canonical']) & set(prepared.loc[prepared.split=='test','canonical'])
