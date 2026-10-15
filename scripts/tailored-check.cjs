// «Din jobb, din profil» in Work & career, the tailored block in Everyday life, and the 149 kr tier on the offer page.
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
  await seed(page);await page.evaluate(()=>{sessionStorage.removeItem('fem-career-v1');location.hash='report/work';});
  // Work: «Din jobb, din profil», eight questions one at a time (app/career.js).
  const work=page.locator('#work .d-career');await work.waitFor();
  assert.equal(await work.locator('.d-career-sec').count(),0,'no result before the answers');
  const opt=t=>page.locator('#work .d-career-opt',{hasText:t}).first().click();
  for(const t of ['Kontor','Leder 1–5','I et fast team','Det endrer seg mye','Ofte høyt press'])await opt(t);
  await opt('Uklare forventninger');await page.locator('[data-career="next"]').click();
  await opt('løse vanskelige');await page.locator('[data-career="next"]').click();
  // «Other» on a single question stays on the page, shows a short text field and needs «Videre».
  await page.locator('#work .d-career-opt[data-value="other"]').click();await page.locator('#work [data-career-other]').fill('Starte egen praksis');
  await page.locator('[data-career="next"]').click();
  await page.locator('#work .d-career-grid').waitFor();
  assert.match(await page.locator('#work .d-career-deep').textContent(),/Ditt neste steg: Starte egen praksis/);
  // Back to the goal question and pick a plain option for the rest of the check.
  await page.locator('[data-career="edit"]').click();
  for(let i=0;i<7;i++){if(i===5||i===6)await page.locator('[data-career="next"]').click();else await page.locator('#work .d-career-opt[aria-pressed="true"]').first().click();}
  await opt('Få mer ansvar');
  await page.locator('#work .d-career-grid').waitFor();
  assert.match(await page.locator('#work [data-career-bar]').innerText(),/Kontor- eller kunnskapsarbeid · Et fast team · Et lite team å lede/);
  // Overview: two columns with what fits and what is demanding, energy and one thing to try; the rest is folded away.
  for(const t of ['Dette kan fungere godt','Dette kan bli krevende','Din energi'])assert.ok(await page.locator('#work .d-career-eyebrow',{hasText:t}).count(),t);
  assert.equal(await page.locator('#work .d-career-deep').getAttribute('open'),null,'details start folded');
  if(await page.locator('#work [data-career-try]').count()){await page.locator('#work [data-career-try]').check();await page.reload();await page.locator('#work [data-career-try]').waitFor();assert.ok(await page.locator('#work [data-career-try]').isChecked(),'try box remembered');}
  await page.locator('#work .d-career-deep>summary').click();
  assert.ok(await page.locator('#work .d-career-sec h4',{hasText:'Når du leder'}).count(),'lead section with responsibility');
  if(SHOTS)await work.screenshot({path:`${SHOTS}/arbeid-desktop.png`});
  // Answers survive a reload; «Change» starts the questions again with the answers kept.
  await page.reload();await page.locator('#work .d-career-grid').waitFor();
  await page.locator('[data-career="edit"]').click();
  assert.equal(await page.locator('#work .d-career-opt[aria-pressed="true"]').innerText(),'Kontor- eller kunnskapsarbeid');
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
  await page.locator('#work .d-career').waitFor();assert.match(await page.locator('#work .d-career h3').innerText(),/Your work, your profile/);
  if(SHOTS)await page.locator('#work .d-career').screenshot({path:`${SHOTS}/work-english.png`});
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
  assert.equal(await page.evaluate(()=>sessionStorage.getItem('fem-career-v1')),null);
  assert.deepEqual(errors,[]);
  console.log('tailored-check: ok');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
