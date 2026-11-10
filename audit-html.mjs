import {parse} from './.html-audit/node_modules/parse5/dist/index.js';import fs from 'node:fs';
const errors=[];const d=parse(fs.readFileSync(process.argv[2]||'index-cmdk.html','utf8'),{sourceCodeLocationInfo:true,onParseError:e=>errors.push(e)});
function walk(n){if(['div','main','section'].includes(n.tagName)&&n.sourceCodeLocation&&!n.sourceCodeLocation.endTag)console.log('IMPLICIT CLOSE',n.tagName,n.attrs,n.sourceCodeLocation.startLine,n.sourceCodeLocation.endLine);for(const c of n.childNodes||[])walk(c);}walk(d);console.log(errors);
