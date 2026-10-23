import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {pages,renderPage,robotsTxt,sitemapXml} from './seo.js';
const root=path.resolve(fileURLToPath(new URL('../app/',import.meta.url)));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.mp3':'audio/mpeg','.webp':'image/webp','.svg':'image/svg+xml','.ico':'image/x-icon','.webmanifest':'application/manifest+json','.txt':'text/plain; charset=utf-8'};
http.createServer(async(req,res)=>{
  if(req.method==='POST'&&req.url==='/api/career-report'){
    // Same handler as the Vercel function in api/career-report.js; needs ANTHROPIC_API_KEY in the environment.
    let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>40000)break;}
    let body=null;try{body=JSON.parse(raw);}catch{}
    const {handleCareerRequest}=await import('../lib/career-llm.js');
    const result=await handleCareerRequest(body);
    res.writeHead(result.status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}).end(JSON.stringify(result.body));return;
  }
  if(req.method==='POST'&&(req.url==='/api/purchase'||req.url==='/api/stripe-webhook')){
    // Same handlers as api/purchase.js and api/stripe-webhook.js; need the Stripe and Supabase keys in the environment.
    let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>200000)break;}
    const {handlePurchase,handleWebhook}=await import('../lib/payments.js');
    let result;
    if(req.url==='/api/stripe-webhook')result=await handleWebhook(raw,req.headers['stripe-signature']);
    else{let body=null;try{body=JSON.parse(raw);}catch{}result=await handlePurchase(body,String(req.headers.authorization||'').replace(/^Bearer\s+/i,''),process.env,req.headers);}
    res.writeHead(result.status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}).end(JSON.stringify(result.body));return;
  }
  if(req.method==='POST'&&req.url==='/api/share'){
    // Same handler as api/share.js; needs the Supabase keys in the environment.
    let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>20000)break;}
    let body=null;try{body=JSON.parse(raw);}catch{}
    const {handleShare}=await import('../lib/shares.js');
    const result=await handleShare(body,String(req.headers.authorization||'').replace(/^Bearer\s+/i,''),process.env);
    res.writeHead(result.status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}).end(JSON.stringify(result.body));return;
  }
  if(req.method==='POST'&&req.url==='/api/profile-email'){
    // Same handler as api/profile-email.js; needs RESEND_API_KEY and the Supabase keys in the environment.
    let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>20000)break;}
    let body=null;try{body=JSON.parse(raw);}catch{}
    const {handleProfileEmail}=await import('../lib/profile-email.js');
    const result=await handleProfileEmail(body,req.socket.remoteAddress,process.env);
    res.writeHead(result.status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}).end(JSON.stringify(result.body));return;
  }
  if(req.method==='GET'&&/^\/v\/[^/]+$/.test(req.url.split('?')[0])){
    const {sharePage}=await import('../lib/shares.js');
    const {status,html}=await sharePage(req.url.split('?')[0].slice(3),process.env);
    res.writeHead(status,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}).end(html);return;
  }
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    // Same pages as the build: / (Norwegian) and /en from app/index.html; /no redirects to / as on Vercel; plus robots and sitemap.
    if(pathname==='/no'||pathname==='/no.html'){res.writeHead(301,{Location:'/'+new URL(req.url,'http://localhost').search}).end();return;}
    const page=pathname==='/'||pathname==='/index.html'?'no':pathname==='/en'||pathname==='/en.html'?'en':null;
    if(page){res.writeHead(200,{'Content-Type':mime['.html'],'Cache-Control':'no-store'}).end(renderPage(await readFile(path.join(root,'index.html'),'utf8'),page));return;}
    if(pathname==='/robots.txt'){res.writeHead(200,{'Content-Type':mime['.txt']}).end(robotsTxt());return;}
    if(pathname==='/sitemap.xml'){res.writeHead(200,{'Content-Type':'application/xml; charset=utf-8'}).end(sitemapXml());return;}
    const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
    if(!file.startsWith(root+path.sep)&&file!==path.join(root,'index.html')){res.writeHead(403).end();return;}
    const body=await readFile(file);
    res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(body);
  }catch{res.writeHead(404).end('Not found');}
}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
