"""Download only the public dataset archive; never visit URLs inside the CSV."""
from pathlib import Path
import hashlib
import io
import urllib.request
import zipfile

URL='https://www.kaggle.com/api/v1/datasets/download/sid321axn/malicious-urls-dataset?datasetVersionNumber=1'
EXPECTED='d83ce942075dd63ed4d11560cfdcd9d512caa3d680e292f22cab484e8f074d01'
if __name__=='__main__':
    archive=urllib.request.urlopen(URL,timeout=120).read()
    raw=zipfile.ZipFile(io.BytesIO(archive)).read('malicious_phish.csv')
    if hashlib.sha256(raw).hexdigest()!=EXPECTED:
        raise ValueError('Dataset checksum changed; inspect the source before training.')
    target=Path(__file__).resolve().parents[1]/'data/raw-url/malicious_phish.csv'
    target.parent.mkdir(parents=True,exist_ok=True)
    target.write_bytes(raw)
    print('Verified dataset saved:',target)
