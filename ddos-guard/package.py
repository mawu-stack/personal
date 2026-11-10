from pathlib import Path
import zipfile
root=Path(__file__).resolve().parents[1]
out=root/'Assignment6-DDoS-Submission.zip'
files=[root/'index-cmdk.html',root/'Assignment6-README.md']+[p for p in (root/'ddos-guard').rglob('*') if p.is_file() and 'data' not in p.relative_to(root/'ddos-guard').parts and '__pycache__' not in p.parts]
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
 for p in files:z.write(p,p.relative_to(root))
with zipfile.ZipFile(out) as z:assert z.testzip() is None
print('PASS:',out,len(files),'files; datasets excluded, reproducible from cited source.')
