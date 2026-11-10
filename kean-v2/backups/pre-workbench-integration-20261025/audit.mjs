import fs from 'node:fs';import crypto from 'node:crypto';import{parse}from'../.html-audit/node_modules/parse5/dist/index.js';
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const source=fs.readFileSync('index-cmdk.html','utf8');const ast=parse(source,{sourceCodeLocationInfo:true});
const inventory={generated:'2026-10-25',baseline:'index-cmdk.html',sha256:sha(source),bytes:Buffer.byteLength(source),pages:[],controls:[],headings:[],dependencies:[],scripts:[],storageKeys:[],functionCandidates:[],globals:[],events:[],content:[]};
const text=n=>(n.nodeName==='#text'?n.value:(n.childNodes||[]).filter(x=>!['script','style'].includes(x.tagName)).map(text).join(' ')).replace(/\s+/g,' ').trim();
function walk(n,page='global'){
 const a=Object.fromEntries((n.attrs||[]).map(x=>[x.name,x.value]));if(a.id?.startsWith('panel-tab-'))page=a.id;
 const loc=n.sourceCodeLocation;
 if(a.id?.startsWith('panel-tab-'))inventory.pages.push({id:a.id,bytes:loc.endOffset-loc.startOffset,sha256:sha(source.slice(loc.startOffset,loc.endOffset)),text:text(n)});
 if(/^h[1-6]$/.test(n.tagName||''))inventory.headings.push({page,tag:n.tagName,id:a.id,text:text(n)});
 if(['p','li','figcaption','caption','summary','dt','dd','th','td','pre'].includes(n.tagName))inventory.content.push({page,tag:n.tagName,id:a.id,text:text(n)});
 if(['button','input','select','textarea','a','details','dialog','form'].includes(n.tagName))inventory.controls.push({page,tag:n.tagName,id:a.id,name:a.name,type:a.type,label:a['aria-label']||a.title||text(n).slice(0,240),href:a.href,events:Object.entries(a).filter(([k])=>k.startsWith('on'))});
 if((n.tagName==='script'&&a.src)||(n.tagName==='link'&&a.href))inventory.dependencies.push({tag:n.tagName,url:a.src||a.href,rel:a.rel});
 if(n.tagName==='script'){
  const code=(n.childNodes||[]).map(x=>x.value||'').join('');inventory.scripts.push({id:a.id||null,type:a.type||'javascript',src:a.src,bytes:Buffer.byteLength(code),sha256:sha(code)});
  if(a.type!=='application/json'){
   for(const m of code.matchAll(/(?:async\s+)?function\s+([\w$]+)\s*\(|(?:const|let|var)\s+([\w$]+)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[\w$]+)\s*=>/g))inventory.functionCandidates.push({script:a.id||'inline',name:m[1]||m[2]});
   for(const m of code.matchAll(/window\.([\w$]+)\s*=/g))inventory.globals.push(m[1]);
   for(const m of code.matchAll(/(?:localStorage|sessionStorage)\.(?:getItem|setItem|removeItem)\(['"]([^'"]+)/g))inventory.storageKeys.push(m[1]);
   for(const m of code.matchAll(/(?:addEventListener|CustomEvent)\(['"]([^'"]+)/g))inventory.events.push(m[1]);
  }
 }
 for(const c of n.childNodes||[])walk(c,page);
}walk(ast);for(const k of ['storageKeys','globals','events'])inventory[k]=[...new Set(inventory[k])].sort();
fs.writeFileSync('kean-v2/docs/inventory.json',JSON.stringify(inventory,null,2));
const skip=new Set(['.git','.venv','.tools','node_modules','.dart_tool','build','data','models','.chart-data-48pygd','.chart-data-aamNxe','.chart-data-WbgUNC','kean-v2']);let files=[];
function scan(dir='.') {for(const d of fs.readdirSync(dir,{withFileTypes:true})){if(skip.has(d.name))continue;const p=dir+'/'+d.name;if(d.isDirectory())scan(p);else if(/\.(?:html|css|js|cjs|mjs|py|dart|md|json|yaml|yml|toml|txt)$/.test(d.name)){const b=fs.readFileSync(p);files.push({path:p.slice(2),bytes:b.length,sha256:sha(b)});}}}scan();
fs.writeFileSync('kean-v2/docs/source-manifest.json',JSON.stringify(files,null,2));
fs.writeFileSync('kean-v2/docs/backup-manifest.json',JSON.stringify({date:'2026-10-25',files:['index-cmdk.html','index.html'].map((p,i)=>({original:p,backup:i?'legacy/index-original.html':'legacy/index-cmdk.html',sha256:sha(fs.readFileSync(p))}))},null,2));
console.log(JSON.stringify({bytes:inventory.bytes,tabs:inventory.pages.length,controls:inventory.controls.length,headings:inventory.headings.length,contentBlocks:inventory.content.length,scripts:inventory.scripts.length,functionCandidates:inventory.functionCandidates.length,files:files.length,dependencies:inventory.dependencies,globals:inventory.globals,storage:inventory.storageKeys},null,2));
