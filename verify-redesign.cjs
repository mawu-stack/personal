const fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');
const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
const init=html.slice(html.indexOf('var pwdInput ='),html.indexOf('function renderEvaluation'));
console.log('Missing AuthGuard UI:',[...init.matchAll(/getElementById\("([^"]+)"\)/g)].map(m=>m[1]).filter(id=>!ids.has(id)));
for(const [i,m] of [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].entries()){
const css=m[1].replace(/\/\*[\s\S]*?\*\//g,'').replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g,'');
let n=0;for(const c of css){if(c==='{')n++;if(c==='}')n--;if(n<0)throw Error('CSS closing brace without opening in block '+i);}if(n!==0)throw Error('Unbalanced CSS block '+i);
}console.log('All CSS blocks have balanced braces.');
