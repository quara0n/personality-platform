// Share images (1200×630) for / and /no: the logo pieces from fem-logo-reference.png, the «Kaleido» wordmark image
// (app/assets/design/kaleido-wordmark.png) and the headline. The headline is Georgia; install it before running, or the
// browser falls back to another serif. Run: node scripts/og-images.cjs
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const fs=require('node:fs'),path=require('node:path');
const app=path.join(__dirname,'..','app'),ref='data:image/png;base64,'+fs.readFileSync(path.join(app,'assets/fem-logo-reference.png')).toString('base64'),
  mark='data:image/png;base64,'+fs.readFileSync(path.join(app,'assets/design/kaleido-wordmark.png')).toString('base64');
const pages={
  en:{title:'Free Big Five<br>personality test',lines:['120 questions · about 10 minutes','A free profile of your five traits']},
  no:{title:'Gratis personlighetstest<br>– Big Five',lines:['120 spørsmål · rundt 10 minutter','En gratis profil av dine fem trekk']}};
const html=p=>`<!doctype html><meta charset="utf-8"><style>
body{margin:0;width:1200px;height:630px;background:#fefdf8;position:relative;overflow:hidden}
.art{position:absolute;left:60px;top:120px;width:440px;height:410px;background:url(${ref}) -775.25px -312.5px/1920px 1280px no-repeat}
.text{position:absolute;left:540px;top:103px;width:620px}
.brand{display:block;height:66px;margin:-4px 0 0 -2px}
h1{display:inline-block;margin:62px 0 0;font:400 var(--size,68px)/1.14 Georgia,serif;letter-spacing:-.01em;color:#102747;white-space:nowrap}
.bar{width:65px;height:6px;margin:26px 0 22px;background:#f6b18d}
p.l{margin:0;font:400 26px/1.46 Arial,Helvetica,sans-serif;color:#53667c}
</style><div class="art"></div><div class="text"><img class="brand" src="${mark}" alt="Kaleido"><h1>${p.title}</h1><div class="bar"></div>${p.lines.map(l=>`<p class="l">${l}</p>`).join('')}</div>`;
(async()=>{const browser=await chromium.launch();try{const page=await browser.newPage({viewport:{width:1200,height:630}});
  for(const [k,p] of Object.entries(pages)){await page.setContent(html(p));await page.evaluate(()=>document.fonts.ready);
    // Shrink the headline until its longest line fits the column.
    await page.evaluate(()=>{const h=document.querySelector('h1');let s=68;while(h.offsetWidth>590&&s>40){s-=2;h.style.setProperty('--size',s+'px');}});
    await page.screenshot({path:path.join(app,`assets/og/kaleido-${k}.png`)});}
}finally{await browser.close();}})();
