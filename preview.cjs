const http=require('node:http');
const fs=require('node:fs');
http.createServer((request,response)=>{
  if(request.url==='/' || request.url.startsWith('/index.html')){
    response.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});response.end(fs.readFileSync('index.html'));
  }else{response.writeHead(404);response.end('Not found');}
}).listen(3498,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:3498'));
