import fs from 'node:fs';
const root='kean-v2/';let b=fs.readFileSync(root+'build.mjs','utf8');if(!b.includes("'a7-check.html'"))b=b.replace("const files=[","const files=['a7-check.html','a7-browser-test.js',");fs.writeFileSync(root+'build.mjs',b);
let s=fs.readFileSync(root+'preview.cjs','utf8');const marker="res.writeHead(200,{'Content-Type':types[path.extname(file)]";const at=s.indexOf(marker);if(at<0)throw Error('Preview response not found');
if(!s.includes('req.headers.range'))s=s.slice(0,at)+`if(path.extname(file)==='.mp4'){
const size=fs.statSync(file).size,headers={'Content-Type':'video/mp4','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes'};let start=0,end=size-1,status=200;
if(req.headers.range){const match=/^bytes=(\\d*)-(\\d*)$/.exec(req.headers.range);if(!match||(!match[1]&&!match[2])){res.writeHead(416,{'Content-Range':'bytes */'+size});res.end();return;}if(!match[1]){start=Math.max(0,size-Number(match[2]));}else{start=Number(match[1]);if(match[2])end=Math.min(Number(match[2]),size-1);}if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=size){res.writeHead(416,{'Content-Range':'bytes */'+size});res.end();return;}status=206;headers['Content-Range']='bytes '+start+'-'+end+'/'+size;}
headers['Content-Length']=end-start+1;res.writeHead(status,headers);if(req.method==='HEAD')res.end();else fs.createReadStream(file,{start,end}).pipe(res);return;}
`+s.slice(at);fs.writeFileSync(root+'preview.cjs',s);console.log('Added local MP4 range/HEAD support and packaged browser fixture. No server started.');
