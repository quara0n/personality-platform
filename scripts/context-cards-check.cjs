// Trait cards in Work & career and Everyday life: picture cards that open a panel below their row.
// Uses synthetic answers only. Run with the app on http://127.0.0.1:4173 (npm start).
// Set SHOTS=<folder> to save screenshots.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const assert=require('node:assert/strict');
const URL='http://127.0.0.1:4173/',SHOTS=process.env.SHOTS;
async function seed(page){await page.goto(URL+'#home');await page.locator('.hero').waitFor();
  await page.evaluate(async()=>{const q=await (await fetch('data/questions.json')).json();const a={};q.forEach((x,i)=>a[x.id]=1+(i*7+Math.floor(i/7))%5);sessionStorage.setItem('five-assessment-v1',JSON.stringify({answers:a,index:119}));},);
  await page.reload();}
// Layout position without transforms (sections fade in as they scroll into view).
const box=l=>l.evaluate(e=>({y:e.offsetTop,height:e.offsetHeight}));
(async()=>{const browser=await chromium.launch();try{
  const page=await browser.newPage({viewport:{width:1440,height:900},locale:'nb-NO'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await seed(page);
  for(const ch of ['work','life']){
    await page.evaluate(c=>location.hash='report/'+c,ch);
    const grid=page.locator(`#${ch} .d-ctx-grid`);await grid.waitFor();
    const cards=grid.locator('.d-ctx-card'),toggles=grid.locator('.d-ctx-toggle'),panels=grid.locator('.d-ctx-panel');
    assert.equal(await cards.count(),5);
    assert.equal(await grid.locator('.d-ctx-panel:not([hidden])').count(),1,'one panel open from the start');
    assert.equal(await toggles.nth(0).getAttribute('aria-expanded'),'true');
    // Cards 1–3 share the first row and the open panel sits below it.
    const [b0,b2,p0]=[await box(cards.nth(0)),await box(cards.nth(2)),await box(panels.nth(0))];
    assert.ok(Math.abs(b0.y-b2.y)<2,'first three cards on one row');
    assert.ok(p0.y>b0.y+b0.height,'panel below the row');
    if(SHOTS&&ch==='life')await page.locator('#life').screenshot({path:`${SHOTS}/ny-hverdag-desktop.png`});
    // Choosing another card closes the first and opens its own panel below that row.
    await toggles.nth(3).click();
    assert.equal(await grid.locator('.d-ctx-panel:not([hidden])').count(),1);
    assert.equal(await toggles.nth(0).getAttribute('aria-expanded'),'false');
    assert.equal(await toggles.nth(3).getAttribute('aria-expanded'),'true');
    const [b3,p3]=[await box(cards.nth(3)),await box(panels.nth(3))];
    assert.ok(p3.y>b3.y+b3.height,'panel below the second row');
    // «Read more» shows strengths and weaknesses.
    const more=panels.nth(3).locator('.d-ctx-more');
    assert.equal(await more.locator('.d-sw').isVisible(),false);
    await more.locator('summary').click();
    assert.equal(await more.locator('.d-sw-col.is-good li').count(),3);
    assert.equal(await more.locator('.d-sw-col.is-hard li').count(),3);
    if(SHOTS&&ch==='life')await page.locator('#life .d-ctx-grid').screenshot({path:`${SHOTS}/ny-hverdag-les-mer.png`});
    // Clicking the open card closes it; the keyboard works too.
    await toggles.nth(3).click();
    assert.equal(await grid.locator('.d-ctx-panel:not([hidden])').count(),0);
    await toggles.nth(1).focus();await page.keyboard.press('Enter');
    assert.equal(await toggles.nth(1).getAttribute('aria-expanded'),'true');
    const ids=await cards.evaluateAll(l=>l.map(x=>x.dataset.rule));
    assert.ok(ids.every(id=>new RegExp(`^context-v2/[OCEAN]/${ch}/(veryLow|low|middle|high|veryHigh)$`).test(id)),ids.join());
  }
  // Mobile: one column, the panel follows its card, no sideways scroll.
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>location.hash='report/life');
  const grid=page.locator('#life .d-ctx-grid');await grid.waitFor();await page.waitForTimeout(150);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'no sideways scroll');
  await grid.locator('.d-ctx-toggle').nth(0).click();
  const [c0,p0,c1]=[await box(grid.locator('.d-ctx-card').nth(0)),await box(grid.locator('.d-ctx-panel').nth(0)),await box(grid.locator('.d-ctx-card').nth(1))];
  assert.ok(c0.y<p0.y&&p0.y<c1.y,'panel between card 1 and card 2');
  if(SHOTS)await grid.screenshot({path:`${SHOTS}/ny-hverdag-mobil.png`});
  assert.deepEqual(errors,[]);
  console.log('context-cards-check: ok');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
