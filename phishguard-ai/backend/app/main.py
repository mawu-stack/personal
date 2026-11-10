"""Local inference API. Never downloads submitted URLs or arbitrary model files."""
from contextlib import asynccontextmanager
import hashlib
import json
from pathlib import Path
from typing import Literal
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from .features import FEATURES, SCHEMA_VERSION, extract_features, parse_url
from .analysis import url_findings, analyze_message

MODEL_DIR = Path(__file__).resolve().parents[1] / 'models'
state = {'models': {}, 'metrics': None, 'error': 'Models have not loaded.'}

@asynccontextmanager
async def lifespan(app):
    try:
        metrics = json.loads((MODEL_DIR/'metrics.json').read_text(encoding='utf-8'))
        if metrics['features'] != FEATURES or metrics['schema_version'] != SCHEMA_VERSION:
            raise ValueError('Feature schema mismatch; retrain the models.')
        loaded = {}
        for name in ('logistic_regression', 'random_forest'):
            path = MODEL_DIR / (name + '.joblib')
            if hashlib.sha256(path.read_bytes()).hexdigest() != metrics['artifacts'][name]:
                raise ValueError('Local model checksum mismatch; retrain the models.')
            loaded[name] = joblib.load(path)
        state.update(models=loaded,metrics=metrics,error=None)
    except Exception as exc:
        state.update(models={},metrics=None,error=f'Model initialization failed: {type(exc).__name__}: {exc}')
    yield

app = FastAPI(title='PhishGuard AI', version='1.0.0', lifespan=lifespan)
app.add_middleware(CORSMiddleware,allow_origins=['http://localhost:8080','http://127.0.0.1:8080'],allow_methods=['GET','POST'],allow_headers=['Content-Type'],allow_credentials=False)

class PredictRequest(BaseModel):
    url: str = Field(min_length=1,max_length=2048)
    model: Literal['logistic_regression','random_forest'] = 'random_forest'

    @field_validator('url')
    @classmethod
    def validate_url(cls, value):
        parse_url(value)
        return value.strip()

def ready():
    if not state['models']:
        raise HTTPException(503, state['error'])

@app.get('/health')
def health():
    ready()
    return {'status':'ready','models':list(state['models']), 'schema_version':SCHEMA_VERSION}

@app.get('/model-info')
def model_info():
    ready()
    return {'models':list(state['models']), 'features':FEATURES,'schema_version':SCHEMA_VERSION,'threshold':.5,'network_free':True,'probability':'Uncalibrated phishing probability','limitations':state['metrics']['limitations']}

@app.get('/metrics')
def metrics():
    ready()
    return state['metrics']

@app.post('/predict')
def predict(request:PredictRequest):
    ready()
    features = extract_features(request.url)
    frame = pd.DataFrame([features],columns=FEATURES)
    try:
        probability = float(state['models'][request.model].predict_proba(frame)[0,1])
    except Exception:
        raise HTTPException(503,'Inference failed. No substitute prediction was generated.') from None
    phishing = probability >= .5
    observations = [f'URL length: {features["length"]} characters.', f'Hostname length: {features["host_length"]} characters.', f'Sensitive keyword occurrences: {features["sensitive_words"]}.']
    if features['ip_host']: observations.append('Hostname is an IP address.')
    if features['at_signs']: observations.append('Contains an @ character; inspect the actual hostname.')
    if features['punycode']: observations.append('Hostname uses internationalized domain encoding.')
    return {**url_findings(request.url), 'label':'Potential Phishing' if phishing else 'Predicted Legitimate','class':int(phishing),'model':request.model,
            'score_calibrated':False,
            'phishing_probability':probability,'model_confidence':probability if phishing else 1-probability,
            'features':features,'observations':observations,'explanation_note':'Observed lexical features, not a causal explanation of the individual prediction.',
            'warning':'Educational prototype. Uncalibrated model confidence is not a guarantee of safety. No URL was fetched.'}

class MessageRequest(BaseModel):
    text: str = Field(min_length=1,max_length=20000)
    model: Literal['logistic_regression','random_forest'] = 'random_forest'

    @field_validator('text')
    @classmethod
    def nonempty(cls,value):
        if not value.strip(): raise ValueError('Paste a message first.')
        return value

@app.post('/analyze-message')
def message(request:MessageRequest):
    analysis=analyze_message(request.text)
    checked=[]
    for url in analysis['links']:
        try:
            checked.append({'url':url,'result':predict(PredictRequest(url=url,model=request.model))})
        except (ValueError,HTTPException) as exc:
            checked.append({'url':url,'error':exc.detail if isinstance(exc,HTTPException) else 'Unsupported or malformed URL; not scanned.'})
    analysis['links']=checked
    return analysis
