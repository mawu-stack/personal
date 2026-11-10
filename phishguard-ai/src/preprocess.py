"""Dataset-specific validation and leakage-aware preparation; no network access."""
from pathlib import Path
import hashlib
import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline

ROOT = Path(__file__).resolve().parents[1]
SEED = 42
LEXICAL = ['having_IPhaving_IP_Address', 'URLURL_Length', 'Shortining_Service',
           'having_At_Symbol', 'double_slash_redirecting', 'Prefix_Suffix',
           'having_Sub_Domain', 'HTTPS_token']

def load_data(path=ROOT / 'data/dataset.csv'):
    path = Path(path)
    raw = pd.read_csv(path)
    if raw.shape[1] != 32 or not {'index', 'Result', *LEXICAL}.issubset(raw.columns):
        raise ValueError('Expected the verified akashkr version-2 dataset schema.')
    if set(raw.Result.dropna().unique()) != {-1, 1} or raw.Result.isna().any():
        raise ValueError('Expected verified labels -1=phishing, +1=legitimate.')
    features = [c for c in raw if c not in ['index', 'Result']]
    if not raw[features].isin([-1, 0, 1]).where(raw[features].notna(), True).all().all():
        raise ValueError('Unexpected encoded feature value; review source before training.')
    clean = raw.drop_duplicates(subset=features + ['Result']).copy()
    return raw, clean, features, hashlib.sha256(path.read_bytes()).hexdigest()

def encoder():
    # Encoded states are categories, not physical measurements. Fit inside pipeline.
    return Pipeline([('impute', SimpleImputer(strategy='most_frequent')),
                     ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))])

def groups_for(frame):
    # Exact feature patterns stay together even when their target labels disagree.
    return pd.util.hash_pandas_object(frame, index=False).astype(str)
