// Tailored block in Work & career and Everyday life, and the 149 kr tier on the offer page.
// Uses synthetic answers only. Run with the app on http://127.0.0.1:4173 (npm start).
// Set SHOTS=<folder> to save screenshots.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const assert=require('node:assert/strict');
const URL='http://127.0.0.1:4173/',SHOTS=process.env.SHOTS;
async function seed(page){await page.goto(URL+'#home');await page.locator('.hero').waitFor();
  await page.evaluate(async()=>{const q=await (await fetch('data/questions.json')).json();const a={};q.forEach((x,i)=>a[x.id]=1+(i*7+Math.floor(i/7))%5);sessionStorage.setItem('five-assessment-v1',JSON.stringify({answers:a,index:119}));sessionStorage.removeItem('fem-tailor-v1');},);
  await page.reload();}
const pick=(page,ch,q,v)=>page.locator(`label[for="tq-${ch}-${q}-${v}"]`).click();
(async()=>{const browser=await chromium.launch();try{
  const page=await browser.newPage({viewport:{width:1440,height:900},locale:'nb-NO'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await seed(page);await page.evaluate(()=>location.hash='report/work');
  const work=page.locator('#work .d-tailor');await work.waitFor();
  assert.equal(await work.locator('.d-tailor-cols').count(),0,'no result before the answers');
  assert.equal(await work.locator('fieldset').count(),4);
  await pick(page,'work','role','lead');await pick(page,'work','people','people');await pick(page,'work','structure','shifting');
  assert.equal(await page.locator('#work .d-tailor-cols').count(),0);
  await pick(page,'work','pressure','high');
  const cols=page.locator('#work .d-tailor-cols');await cols.waitFor();
  const lines=await page.locator('#work .d-tailor-col li').count();
  assert.ok(lines>0,'at least one tailored line');
  const ids=await page.locator('#work .d-tailor-col li').evaluateAll(l=>l.map(x=>x.dataset.rule));
  assert.ok(ids.every(id=>/^tailored-v1\/work\/[\w-]+\/(low|high)$/.test(id)),ids.join());
  assert.match(await page.locator('#work .d-tailor summary').innerText(),/Leder for andre · Mest med folk · Det endrer seg mye · Ofte høyt press/);
  if(SHOTS)await work.screenshot({path:`${SHOTS}/arbeid-desktop.png`});
  // Answers survive a reload, and changing one updates the result.
  await page.reload();await page.locator('#work .d-tailor-cols').waitFor();
  await page.locator('#work .d-tailor summary').click();await pick(page,'work','role','care');
  assert.match(await page.locator('#work .d-tailor summary').innerText(),/Omsorg, helse eller undervisning/);
  assert.ok(await page.locator('#work details[open]').count(),'the form stays open while changing');
  // Everyday life: the children question appears only with children.
  await page.evaluate(()=>location.hash='report/life');const life=page.locator('#life .d-tailor');await life.waitFor();
  assert.equal(await life.locator('fieldset').count(),3);
  await pick(page,'life','household','family');assert.equal(await page.locator('#life .d-tailor fieldset').count(),4);
  await pick(page,'life','kids','small');await pick(page,'life','week','packed');await pick(page,'life','wish','calm');
  await page.locator('#life .d-tailor-cols').waitFor();
  if(SHOTS)await page.locator('#life .d-tailor').screenshot({path:`${SHOTS}/hverdag-desktop.png`});
  // Mobile: no sideways scroll, columns stack.
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(150);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no sideways scroll on mobile');
  if(SHOTS)await page.locator('#life .d-tailor').screenshot({path:`${SHOTS}/hverdag-mobil.png`});
  // English.
  await page.setViewportSize({width:1440,height:900});await page.locator('#header-language').selectOption('en');await page.evaluate(()=>location.hash='report/work');
  await page.locator('#work .d-tailor-cols').waitFor();assert.match(await page.locator('#work .d-tailor h3').innerText(),/Tailored to your work/);
  if(SHOTS)await page.locator('#work .d-tailor').screenshot({path:`${SHOTS}/work-english.png`});
  // Offer page: both tiers, prices follow the country.
  await page.locator('#header-language').selectOption('no');await page.evaluate(()=>location.hash='offer');await page.locator('.d-offer-plus').waitFor();
  await page.locator('#header-country').selectOption('NO');
  assert.match(await page.locator('.d-offer-plus .d-offer-price').innerText(),/149/);
  assert.equal(await page.locator('.d-offer-plus .d-offer-recommended').innerText(),'ANBEFALT');
  if(SHOTS)await page.screenshot({path:`${SHOTS}/kjopsside.png`,fullPage:true});
  await page.locator('#header-country').selectOption('US');assert.match(await page.locator('.d-offer-plus .d-offer-price').innerText(),/14[.,]99/);
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(150);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'offer: no sideways scroll on mobile');
  if(SHOTS)await page.locator('.d-offer-plus').screenshot({path:`${SHOTS}/kjopsside-mobil.png`});
  // Clearing answers also clears the tailored answers.
  page.on('dialog',d=>d.accept());await page.locator('#clear-data').click();
  assert.equal(await page.evaluate(()=>sessionStorage.getItem('fem-tailor-v1')),null);
  assert.deepEqual(errors,[]);
  console.log('tailored-check: ok');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
