import {cp,mkdir,readFile,writeFile} from 'node:fs/promises';
import {siteUrl,pages,renderPage,robotsTxt,sitemapXml} from './seo.js';
const root=new URL('../',import.meta.url);
await mkdir(new URL('dist',root),{recursive:true});
await cp(new URL('app/',root),new URL('dist/',root),{recursive:true});
// Public sign-in settings from the environment (see app/config.js). The service-role key is never read here.
// Payments: only whether they are on (and Vipps) reaches the browser, never a key.
const payments=Boolean(process.env.STRIPE_SECRET_KEY);
const config={supabaseUrl:process.env.SUPABASE_URL||'',supabaseAnonKey:process.env.SUPABASE_ANON_KEY||'',xProvider:process.env.SUPABASE_X_PROVIDER||'',providers:process.env.SUPABASE_PROVIDERS||'',payments,vipps:payments&&String(process.env.STRIPE_VIPPS||'').toLowerCase()==='on',
  // Measurement IDs (public). Nothing loads until the visitor consents, see app/analytics.js.
  ga4Id:process.env.GA4_ID||'',clarityId:process.env.CLARITY_ID||'',adsId:process.env.GOOGLE_ADS_ID||'',adsPurchaseLabel:process.env.GOOGLE_ADS_PURCHASE_LABEL||''};
await writeFile(new URL('dist/config.js',root),`window.FEM_CONFIG = ${JSON.stringify(config)};\n`);
// SEO: / in Norwegian, /en (en.html via cleanUrls) in English, robots and sitemap for SITE_URL.
const template=await readFile(new URL('app/index.html',root),'utf8');
for(const key in pages)await writeFile(new URL(`dist/${pages[key].file}`,root),renderPage(template,key));
await writeFile(new URL('dist/robots.txt',root),robotsTxt());
await writeFile(new URL('dist/sitemap.xml',root),sitemapXml());
console.log(`Static app copied to dist for ${siteUrl}. Sign-in ${config.supabaseUrl&&config.supabaseAnonKey?'configured':'not configured'}. No user answers or research source files are packaged.`);
