import fs from 'node:fs';
let css=fs.readFileSync('kean-v2/styles.css','utf8');css=css.replaceAll('font:7px','font:9px').replaceAll('font:8px','font:10px').replaceAll('font:6px','font:9px').replaceAll('font-size:7px','font-size:9px').replaceAll('font-size:8px','font-size:10px').replaceAll('font-size:6px','font-size:9px');fs.writeFileSync('kean-v2/styles.css',css);
