"""Embed current results into the existing standalone HTML; never rebuild old content."""
import json
import re
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT.parent / 'index-cmdk.html'

def export():
    html = SITE.read_bytes().decode('utf-8')
    def insert_once(old,new):
        nonlocal html
        if new in html: return
        if html.count(old)!=1: raise ValueError('Integration anchor changed: '+old[:70])
        html=html.replace(old,new,1)
    insert_once("const validTabs = ['tab-1', 'tab-2', 'tab-3', 'tab-4', 'tab-6', 'tab-5'];", "const validTabs = ['tab-1', 'tab-2', 'tab-3', 'tab-4', 'tab-6', 'tab-5', 'tab-7'];")
    insert_once("'#overview':'overview',", "'#overview':'overview', '#tab-7':'tab-7', '#tab7':'tab-7',")
    insert_once('/^#tab-?[1-6]$/', '/^#tab-?[1-7]$/')
    if 'id="tab-btn-7"' not in html:
        match=re.search(r'<button[^>]*id="tab-btn-6"[\s\S]*?</button>',html)
        if not match: raise ValueError('Tab anchor missing')
        button='<button type="button" class="tab-btn" role="tab" id="tab-btn-7" data-tab="tab-7" aria-controls="panel-tab-7"><span class="wb-tab-num">07</span><span><span class="wb-tab-name">PhishGuard AI</span><span class="wb-tab-desc">MACHINE LEARNING / RESEARCH</span></span></button>'
        html=html[:match.end()]+'\n'+button+html[match.end():]
    panel='<!-- PHISHGUARD PANEL START -->\n'+(ROOT/'web/panel.html').read_text(encoding='utf-8')+'\n<!-- PHISHGUARD PANEL END -->'
    if '<!-- PHISHGUARD PANEL START -->' in html:
        html=re.sub(r'<!-- PHISHGUARD PANEL START -->[\s\S]*?<!-- PHISHGUARD PANEL END -->',lambda _:panel,html)
    else:
        anchor='<section id="panel-tab-1"'
        if html.count(anchor)!=1: raise ValueError('Panel anchor missing')
        html=html.replace(anchor,panel+'\n'+anchor,1)
    result_path=ROOT/'results/metrics.json'
    result=json.loads(result_path.read_text(encoding='utf-8')) if result_path.exists() else {'status':'pending'}
    desc=ROOT/'docs/feature-descriptions.json'
    if desc.exists(): result['feature_descriptions']=json.loads(desc.read_text(encoding='utf-8'))
    payload=json.dumps(result,ensure_ascii=True,allow_nan=False).replace('<','\\u003c').replace('>','\\u003e').replace('&','\\u0026')
    bundle='<!-- PHISHGUARD BUNDLE START -->\n<style id="phishguard-style">'+(ROOT/'web/style.css').read_text(encoding='utf-8')+'</style>\n<script type="application/json" id="phishguard-results">'+payload+'</script>\n<script id="phishguard-controller">'+(ROOT/'web/controller.js').read_text(encoding='utf-8')+'</script>\n<!-- PHISHGUARD BUNDLE END -->'
    if '<!-- PHISHGUARD BUNDLE START -->' in html:
        html=re.sub(r'<!-- PHISHGUARD BUNDLE START -->[\s\S]*?<!-- PHISHGUARD BUNDLE END -->',lambda _:bundle,html)
    else: html=html.replace('</body>',bundle+'\n</body>',1)
    SITE.write_bytes(html.encode('utf-8'))
    print('Embedded PhishGuard '+result['status']+' results; existing content retained.')

if __name__=='__main__': export()
