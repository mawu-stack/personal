import fs from 'node:fs';let p='kean-v2/build.mjs',s=fs.readFileSync(p,'utf8').replace("const files=[","const files=['legacy-compat.css',");fs.writeFileSync(p,s);
