import fs from 'node:fs';
const root='kean-v2/';
let h=fs.readFileSync(root+'workbench.html','utf8');h=h.replace('</body>','<link rel="stylesheet" href="integration.css">\n<script src="architecture.js"></script>\n</body>');fs.writeFileSync(root+'workbench.html',h);
for(const file of ['build.mjs']){let s=fs.readFileSync(root+file,'utf8').replace("const files=[","const files=['architecture.js','integration.css','architecture-check.html',");fs.writeFileSync(root+file,s);}
let v=fs.readFileSync(root+'verify-migration.mjs','utf8').replace("current.replace(","current.replace('<link rel=\"stylesheet\" href=\"integration.css\">\\n','').replace('<script src=\"architecture.js\"></script>\\n','').replace(").replace("['workbench.css','phase2.css']","['workbench.css','phase2.css','integration.css']");fs.writeFileSync(root+'verify-migration.mjs',v);
