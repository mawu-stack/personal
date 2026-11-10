import socket
import pytest
from fastapi.testclient import TestClient
from app.main import app, state
from app.analysis import url_findings, analyze_message

@pytest.mark.parametrize('url,kind',[
 ('https://paypal.com.account.bad-example.com','Brand name in a subdomain'),
 ('http://192.0.2.1/login','IP-based address'),
 ('https://paypa1.com','Possible spelling trick'),
 ('https://google.com@bad-example.com','Misleading user information'),
 ('https://xn--pple-43d.com','Internationalized hostname'),
 ('https://example.com:8443','Unusual network port'),
 ('https://example.com/'+('a'*160),'Unusual URL structure'),
])
def test_warning_signs(url,kind):
    assert kind in [f['kind'] for f in url_findings(url)['findings']]

def test_no_safety_guarantee():
    r=url_findings('https://example.com')
    assert r['rule_summary']=='No obvious warning signs detected'
    assert 'does not prove' in r['transport_note']
    assert not url_findings('https://accounts.google.com')['findings']

def test_message_highlights_and_links():
    text='😀 URGENT: IT support says enter your password and send money. https://example.com/login. <script>alert(1)</script>'
    r=analyze_message(text)
    assert len({f['kind'] for f in r['findings']})==4
    for f in r['findings']:
        assert text.encode('utf-16-le')[f['start']*2:f['end']*2].decode('utf-16-le')==f['evidence']
    assert r['links']==['https://example.com/login']

def test_dedup_limit_and_email_address():
    r=analyze_message('mail me at hello@example.com '+ ' '.join(f'https://site{i}.example.com' for i in range(12)))
    assert r['links_found']==12 and len(r['links'])==10 and r['links_omitted']==2
    assert analyze_message('https://example.com https://example.com')['links_found']==1

def test_message_reuses_model_and_never_fetches(monkeypatch):
    with TestClient(app) as client:
        def forbidden(*args,**kwargs):raise AssertionError('Network request')
        monkeypatch.setattr(socket,'getaddrinfo',forbidden)
        direct=client.post('/predict',json={'url':'https://example.com','model':'random_forest'}).json()
        message=client.post('/analyze-message',json={'text':'urgent https://example.com'}).json()
        assert message['links'][0]['result']['phishing_probability']==direct['phishing_probability']
        assert 'text' not in message
        assert not direct['score_calibrated']
        models=state['models'];state['models']={}
        try:
            failed=client.post('/analyze-message',json={'text':'urgent https://example.com'}).json()
            assert failed['findings'] and 'error' in failed['links'][0]
        finally:state['models']=models

def test_empty_oversized_and_invalid_link():
    with TestClient(app) as client:
        for text in [' ', 'a'*20001]:assert client.post('/analyze-message',json={'text':text}).status_code==422
        r=client.post('/analyze-message',json={'text':'https://example.com:99999'}).json()
        assert 'error' in r['links'][0]
