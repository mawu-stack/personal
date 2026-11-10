import fs from 'node:fs';
let field=fs.readFileSync('kean-v2/field-motion.js','utf8');field=field.replace('start(root){stop();','start(root){stop();if(root.querySelector("canvas")){stop=()=>{};return;}');fs.writeFileSync('kean-v2/field-motion.js',field);
let build=fs.readFileSync('kean-v2/build.mjs','utf8').replace("'workbench.html','workbench.css'","'migration-check.html','workbench.html','workbench.css'");fs.writeFileSync('kean-v2/build.mjs',build);
