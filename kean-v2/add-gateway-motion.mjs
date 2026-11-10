import fs from 'node:fs';const p='kean-v2/build.mjs';fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace("const files=[","const files=['gateway-motion-check.html',"));
