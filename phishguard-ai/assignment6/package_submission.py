"""Bundle reviewable source and outputs; exclude datasets, environments and models."""
from pathlib import Path
import zipfile

HERE=Path(__file__).resolve().parent
WORKSPACE=HERE.parents[1]

if __name__=='__main__':
    files=[WORKSPACE/name for name in ['Assignment6-README.md','index-cmdk.html','index-a6-backup.html','build-assignment6.mjs','verify-assignment6.mjs','assignment6-check.html','assignment6-preview.cjs','assignment6-changes.json','.html-audit/package.json','.html-audit/package-lock.json']]
    files.extend(p for p in HERE.rglob('*') if p.is_file() and not any(part in ['models','__pycache__'] for part in p.relative_to(HERE).parts) and p.suffix not in ['.npz','.zip'])
    files.extend(WORKSPACE/'phishguard-ai'/name for name in ['README.md','backend/train.py','backend/download_data.py','backend/requirements.txt','backend/app/__init__.py','backend/app/features.py','backend/models/metrics.json'])
    output=WORKSPACE/'Assignment6-PhishGuard-Submission.zip'
    with zipfile.ZipFile(output,'w',zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(set(files)):
            if path.exists():archive.write(path,path.relative_to(WORKSPACE))
    with zipfile.ZipFile(output) as archive:
        assert archive.testzip() is None
        assert 'index-cmdk.html' in archive.namelist()
        assert 'phishguard-ai/assignment6/submission.md' in archive.namelist()
        assert not any(name.endswith(('.joblib','.npz')) or '/data/' in name or '/.venv/' in name for name in archive.namelist())
        print(f'PASS: {len(archive.namelist())} files packaged; {output.stat().st_size:,} bytes; no raw datasets/model binaries/environments. File: {output}')
