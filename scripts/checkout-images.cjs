// Draws the pictures on the left of Stripe's payment page: a list of what each report holds, in Kaleido's look
// (Rune 2026-10-21: «liste med ting, oversiktlig, innbydende»). Writes app/assets/checkout/<tier>-<lang>.jpg.
// Run with the dev server on 127.0.0.1:4173: node scripts/checkout-images.cjs
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const path=require('node:path');
const LISTS={
  base:{
    no:{kicker:'Fordypningsrapport',title:'Dette får du',items:['Alle 30 fasettene','Hvor du ligger (persentiler)','Komboene dine','Arbeidsliv','Hverdagsliv og relasjoner','En ukeplan','Over 40 sider som PDF'],foot:'Én betaling. Ingen abonnement.'},
    en:{kicker:'In-depth report',title:'What you get',items:['All 30 facets','Where you stand (percentiles)','Your combos','Work','Everyday life & relationships','A one-week plan','Over 40 pages as a PDF'],foot:'One payment. No subscription.'}},
  plus:{
    no:{kicker:'Fordypning + tilpasset',title:'Dette får du',items:['Alt i Fordypningsrapporten','Tilpassede spørsmål','Jobben din, tilpasset','Hverdagen din, tilpasset','Konkrete tiltak','Din personlige AI-partner','Over 40 sider som PDF'],foot:'Én betaling. Ingen abonnement.'},
    en:{kicker:'In-depth + tailored',title:'What you get',items:['Everything in the in-depth report','Tailored questions','Your work, tailored','Your everyday life, tailored','Concrete ideas','Your personal AI partner','Over 40 pages as a PDF'],foot:'One payment. No subscription.'}}
};
// Stripe shows the picture about 300 px wide, so the lines are short and large.
const PIECES=['navy','apricot','sky','steel','apricot','navy','sky'];
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const page=l=>`<!doctype html><html><head><meta charset="utf-8"><base href="http://127.0.0.1:4173/"><style>
@font-face{font-family:'Source Serif 4';src:url(assets/fonts/source-serif-4.woff2) format('woff2');font-weight:400}
@font-face{font-family:Manrope;src:url(assets/fonts/manrope.woff2) format('woff2');font-weight:200 800}
html,body{margin:0}body{width:1000px;padding:40px;box-sizing:border-box;background:#fbf9f4;font-family:Manrope,sans-serif;color:#102747;overflow:hidden}
.card{position:relative;overflow:hidden;background:#fffefa;border:2px solid #dde4ec;border-radius:28px;padding:56px 60px}
.top{display:flex;align-items:center;gap:18px}.top img{width:64px;height:64px}
.kicker{font-size:30px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#53667c}
h1{font:400 96px/1.05 'Source Serif 4',serif;letter-spacing:-.04em;margin:26px 0 30px}
ul{list-style:none;margin:0;padding:0}li{display:grid;grid-template-columns:70px 1fr;gap:24px;align-items:center;padding:20px 0;border-top:2px solid #eef1f4;font-size:50px;font-weight:700;line-height:1.15}
li img{width:62px;height:56px;object-fit:contain}
.foot{margin-top:26px;padding-top:24px;border-top:2px solid #eef1f4;font-size:40px;font-weight:600;color:#53667c}
.spread{position:absolute;right:-70px;top:-80px;width:320px;opacity:.9}
</style></head><body><div class="card"><img class="spread" src="assets/design/logo-spread.webp" alt="">
<div class="top"><img src="assets/design/logo-mark.webp" alt=""><div class="kicker">${esc(l.kicker)}</div></div>
<h1>${esc(l.title)}</h1><ul>${l.items.map((t,i)=>`<li><img src="assets/design/tri-${PIECES[i]}.png" alt=""><span>${esc(t)}</span></li>`).join('')}</ul>
<div class="foot">${esc(l.foot)}</div></div></body></html>`;
(async()=>{const browser=await chromium.launch();try{const p=await browser.newPage({viewport:{width:1000,height:600}});
  for(const tier of Object.keys(LISTS))for(const lang of ['no','en']){
    await p.goto('http://127.0.0.1:4173/');await p.setContent(page(LISTS[tier][lang]),{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
    const out=path.join(__dirname,'..','app','assets','checkout',`${tier}-${lang}.jpg`);await p.screenshot({path:out,type:'jpeg',quality:86,fullPage:true});console.log(out);}
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
