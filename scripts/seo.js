// Head tags, static crawlable intro and robots/sitemap for / (English) and /no (Norwegian). Used by build.js and serve.js.
// The domain is one setting: SITE_URL (default: the Vercel preview address).
export const siteUrl=(process.env.SITE_URL||'https://kaleidotest.com').replace(/\/+$/,'');
const esc=v=>String(v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export const pages={
  en:{path:'/',file:'index.html',lang:'en',locale:'en_US',alt:'nb_NO',image:'assets/og/kaleido-en.png',
    title:'Free Big Five personality test – 120 questions | Kaleido',
    description:'Take a free Big Five personality test: 120 research-based questions, about 10 minutes, and a clear profile of your five traits. No sign-up needed.',
    imageAlt:'Kaleido – free Big Five personality test',
    skip:'Skip to content',
    nav:'<a href="#method">The science</a><a class="small-button" href="#test">Take the test <span aria-hidden="true">→</span></a>',
    main:'<article class="page narrow seo-intro"><p class="eyebrow">Kaleido</p><h1>A free Big Five personality test</h1><p>Answer 120 research-based questions (IPIP-NEO-120) in about 10 minutes. You get a free profile of the five traits – openness, conscientiousness, extraversion, agreeableness and emotional reactivity – and can choose an optional in-depth report on work and everyday life.</p><a class="button" href="#test">Start the test <span aria-hidden="true">→</span></a></article>',
    footer:'<a class="footer-brand" href="#home" aria-label="Kaleido"><span class="brand-mark" aria-hidden="true"></span><img class="wordmark" src="assets/design/kaleido-wordmark.webp" alt="" width="562" height="150"> <span>Your personality, in context.</span></a><div><a href="no">Norsk</a><a href="#method">Method & sources</a><a href="#legal">Legal</a><button id="clear-data" class="text-button">Clear my answers</button></div><p>Research-based self-reflection.</p>',
    noscript:'This assessment needs JavaScript to calculate your answers in your browser.'},
  no:{path:'/no',file:'no.html',lang:'nb',locale:'nb_NO',alt:'en_US',image:'assets/og/kaleido-no.png',
    title:'Gratis personlighetstest (Big Five) – 120 spørsmål | Kaleido',
    description:'Ta en gratis personlighetstest basert på Big Five: 120 forskningsbaserte spørsmål, rundt 10 minutter og en tydelig profil av dine fem trekk.',
    imageAlt:'Kaleido – gratis personlighetstest basert på Big Five',
    skip:'Hopp til innhold',
    nav:'<a href="#method">Faglig grunnlag</a><a class="small-button" href="#test">Ta testen <span aria-hidden="true">→</span></a>',
    main:'<article class="page narrow seo-intro"><p class="eyebrow">Kaleido</p><h1>Gratis personlighetstest basert på Big Five</h1><p>Svar på 120 forskningsbaserte spørsmål (IPIP-NEO-120) på rundt 10 minutter. Du får en gratis profil av de fem trekkene – åpenhet, planmessighet, ekstroversjon, medmenneskelighet og følelsesmessig reaktivitet – og kan velge en fordypningsrapport om arbeidsliv og hverdagsliv.</p><a class="button" href="#test">Start testen <span aria-hidden="true">→</span></a></article>',
    footer:'<a class="footer-brand" href="#home" aria-label="Kaleido"><span class="brand-mark" aria-hidden="true"></span><img class="wordmark" src="assets/design/kaleido-wordmark.webp" alt="" width="562" height="150"> <span>Personligheten din, i sammenheng.</span></a><div><a href="./">English</a><a href="#method">Metode og kilder</a><a href="#legal">Juridisk</a><button id="clear-data" class="text-button">Slett svarene mine</button></div><p>Forskningsbasert selvrefleksjon.</p>',
    noscript:'Testen trenger JavaScript for å regne ut svarene dine i nettleseren.'}
};
const url=(p,site)=>site+(p==='/'?'/':p);
export function head(key,site=siteUrl){
  const p=pages[key],img=`${site}/${p.image}`;
  const ld={'@context':'https://schema.org','@graph':[
    {'@type':'Organization','@id':`${site}/#org`,name:'Kaleido',url:`${site}/`,logo:`${site}/assets/icons/icon-512.png`},
    {'@type':'WebSite','@id':`${site}/#website`,name:'Kaleido',url:`${site}/`,inLanguage:['en','nb'],publisher:{'@id':`${site}/#org`},description:pages.en.description}]};
  return [`<title>${esc(p.title)}</title>`,`<meta name="description" content="${esc(p.description)}">`,
    `<link rel="canonical" href="${url(p.path,site)}">`,
    `<link rel="alternate" hreflang="en" href="${url('/',site)}">`,`<link rel="alternate" hreflang="nb" href="${url('/no',site)}">`,`<link rel="alternate" hreflang="x-default" href="${url('/',site)}">`,
    `<meta property="og:type" content="website">`,`<meta property="og:site_name" content="Kaleido">`,`<meta property="og:title" content="${esc(p.title)}">`,`<meta property="og:description" content="${esc(p.description)}">`,`<meta property="og:url" content="${url(p.path,site)}">`,
    `<meta property="og:image" content="${img}">`,`<meta property="og:image:width" content="1200">`,`<meta property="og:image:height" content="630">`,`<meta property="og:image:alt" content="${esc(p.imageAlt)}">`,
    `<meta property="og:locale" content="${p.locale}">`,`<meta property="og:locale:alternate" content="${p.alt}">`,
    `<meta name="twitter:card" content="summary_large_image">`,`<meta name="twitter:title" content="${esc(p.title)}">`,`<meta name="twitter:description" content="${esc(p.description)}">`,`<meta name="twitter:image" content="${img}">`,
    `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g,'\\u003c')}</script>`].join('');
}
// Fills app/index.html for one language. Each replacement must hit exactly once, so a template change fails loudly.
export function renderPage(template,key,site=siteUrl){
  const p=pages[key];let html=template;
  const swap=(re,to)=>{if(!re.test(html))throw Error(`seo.js: template is missing ${re}`);html=html.replace(re,()=>to);};
  swap(/<html lang="[^"]*"/,`<html lang="${p.lang}"`);
  swap(/<title>[^<]*<\/title><meta name="description" content="[^"]*">/,head(key,site));
  swap(/<a class="skip" href="#main">[^<]*/,`<a class="skip" href="#main">${p.skip}`);
  swap(/<nav aria-label="Main navigation">[\s\S]*?<\/nav>/,`<nav aria-label="${key==='no'?'Hovedmeny':'Main navigation'}">${p.nav}</nav>`);
  swap(/<main id="main" tabindex="-1">[\s\S]*?<\/main>/,`<main id="main" tabindex="-1">${p.main}</main>`);
  swap(/<footer>[\s\S]*?<\/footer>/,`<footer>${p.footer}</footer>`);
  swap(/<noscript>[\s\S]*?<\/noscript>/,`<noscript>${p.noscript}</noscript>`);
  return html;
}
export const robotsTxt=(site=siteUrl)=>`User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`;
export function sitemapXml(site=siteUrl){
  const alts=`<xhtml:link rel="alternate" hreflang="en" href="${url('/',site)}"/><xhtml:link rel="alternate" hreflang="nb" href="${url('/no',site)}"/><xhtml:link rel="alternate" hreflang="x-default" href="${url('/',site)}"/>`;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${Object.values(pages).map(p=>`<url><loc>${url(p.path,site)}</loc>${alts}</url>`).join('\n')}\n</urlset>\n`;
}
