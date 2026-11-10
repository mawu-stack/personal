// Isolated capture preview: never changes the delivered application.
const fs=require('node:fs');
const http=require('node:http');
http.createServer((req,res)=>{
  let html=fs.readFileSync('index.html','utf8');
  html=html.replaceAll('history.pushState(null, null,', 'void (null, null,');
  html=html.replace('</head>','<style>#simulated-login-overlay,#ai-connect-modal{display:none!important}html{scroll-behavior:auto!important}</style></head>');
  html=html.replace('</body>','<script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script></body>');
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(html);
}).listen(3499,'127.0.0.1',()=>console.log('Figma capture preview: http://127.0.0.1:3499'));
