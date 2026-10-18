import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {pages,renderPage,robotsTxt,sitemapXml} from './seo.js';
const root=path.resolve(fileURLToPath(new URL('../app/',import.meta.url)));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.mp3':'audio/mpeg','.webp':'image/webp','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8'};
http.createServer(async(req,res)=>{
  if(req.method==='POST'&&req.url==='/api/career-report'){
    // Same handler as the Vercel function in api/career-report.js; needs ANTHROPIC_API_KEY in the environment.
    let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>40000)break;}
    let body=null;try{body=JSON.parse(raw);}catch{}
    const {handleCareerRequest}=await import('../lib/career-llm.js');
    const result=await handleCareerRequest(body);
    res.writeHead(result.status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}).end(JSON.stringify(result.body));return;
  }
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    // Same pages as the build: / and /no from app/index.html, plus robots and sitemap.
    const page=pathname==='/'||pathname==='/index.html'?'en':pathname==='/no'||pathname==='/no.html'?'no':null;
    if(page){res.writeHead(200,{'Content-Type':mime['.html'],'Cache-Control':'no-store'}).end(renderPage(await readFile(path.join(root,'index.html'),'utf8'),page));return;}
    if(pathname==='/robots.txt'){res.writeHead(200,{'Content-Type':mime['.txt']}).end(robotsTxt());return;}
    if(pathname==='/sitemap.xml'){res.writeHead(200,{'Content-Type':'application/xml; charset=utf-8'}).end(sitemapXml());return;}
    const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
    if(!file.startsWith(root+path.sep)&&file!==path.join(root,'index.html')){res.writeHead(403).end();return;}
    const body=await readFile(file);
    res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(body);
  }catch{res.writeHead(404).end('Not found');}
}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
