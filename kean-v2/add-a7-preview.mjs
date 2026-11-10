import fs from 'node:fs';import crypto from 'node:crypto';
const root='kean-v2/',backup=root+'backups/pre-a7-preview/';fs.mkdirSync(backup,{recursive:true});
for(const name of ['platform.js','build.mjs','preview.cjs']){if(fs.existsSync(backup+name))throw Error('Backup already exists; do not rerun integration');fs.copyFileSync(root+name,backup+name);}
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const preserved=['workbench.html','workbench.css','workbench.js','legacy-compat.css','architecture.js','architecture.css','sentry.js','sentry.css','gateway.js','gateway.css','research-data.js','index.html'];
fs.writeFileSync(backup+'preserved.json',JSON.stringify(Object.fromEntries(preserved.map(n=>[n,hash(root+n)])),null,2));
fs.mkdirSync(root+'media',{recursive:true});fs.copyFileSync('film/under-siege/under-siege-ltx-draft.mp4',root+'media/under-siege-ltx-draft.mp4');
let p=fs.readFileSync(root+'platform.js','utf8');const start=p.indexOf("const movie=make('section','research-movie')"),end=p.indexOf('\n\n// Reflect the original entropy engine',start);if(start<0||end<0)throw Error('Movie adapter not found');
p=p.slice(0,start)+`const movie=make('section','research-movie');movie.id='research-movie';movie.setAttribute('aria-labelledby','a7-movie-heading');
const status=make('p','research-eyebrow','AI Movie Preview — Full Film in Production.');status.id='a7-movie-status';status.setAttribute('role','status');
const title=make('h3','','UNDER SIEGE — AI Movie');title.id='a7-movie-heading';
movie.append(status,title,make('p','research-movie-subtitle','The Anatomy of a DDoS Attack'),make('p','','An AI-generated visual introduction to network availability. This five-second portrait draft shows an analyst reviewing illustrative traffic dashboards; it is not live telemetry or evidence of detector performance.'));
const css=make('link');css.rel='stylesheet';css.href='a7-movie.css';document.head.append(css);
const video=make('video');video.id='a7-movie-video';video.controls=true;video.preload='metadata';video.playsInline=true;video.setAttribute('aria-label','Under Siege AI movie preview, approximately five seconds');video.setAttribute('aria-describedby','a7-movie-context');
const source=make('source');source.src='media/under-siege-ltx-draft.mp4';source.type='video/mp4';video.append(source,document.createTextNode('Your browser cannot play this MP4. Use the download link below.'));
const frame=make('div','a7-movie-frame');frame.append(video);const download=make('a','research-button','Download the preview MP4');download.href=source.src;download.setAttribute('download','under-siege-ltx-draft.mp4');
const context=make('p','research-caption','Preview only · Generated online with LTX via a public service · Portrait footage · Full attack, detection and recovery sequence, captions and final edit are pending. Published-site playback has not been verified.');context.id='a7-movie-context';
const error=make('p','a7-movie-error','Preview unavailable. Download the existing MP4 below, or check that the media folder is included in the local build.');error.hidden=true;error.setAttribute('role','alert');video.addEventListener('error',()=>error.hidden=false);source.addEventListener('error',()=>error.hidden=false);
movie.append(frame,error,download,context,make('p','research-caption','Website availability depends on understanding the traffic—and knowing when to act.'));ddos.querySelector('.research-guide')?.after(movie);
const movieNav=make('a','','AI movie preview');movieNav.href='#research-movie';ddos.querySelector('.dg-nav')?.append(movieNav);}
`+p.slice(end);fs.writeFileSync(root+'platform.js',p);
let build=fs.readFileSync(root+'build.mjs','utf8');build=build.replace("const files=[","const files=['a7-movie.css','media/under-siege-ltx-draft.mp4',");fs.writeFileSync(root+'build.mjs',build);
let server=fs.readFileSync(root+'preview.cjs','utf8');server=server.replace("'.svg':'image/svg+xml'","'.mp4':'video/mp4','.svg':'image/svg+xml'");fs.writeFileSync(root+'preview.cjs',server);
console.log('Lab 07 movie adapter replaced; source video copied unchanged; backup and preservation manifest saved. No server started.');
