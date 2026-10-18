// «Din jobb, din profil» in Work & career, «Din hverdag, dine relasjoner» in Everyday life & relationships, and the 79 kr tier on the offer page.
// Uses synthetic answers only. Run with the app on http://127.0.0.1:4173 (npm start).
// Set SHOTS=<folder> to save screenshots.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const assert=require('node:assert/strict');
const URL='http://127.0.0.1:4173/',SHOTS=process.env.SHOTS;
async function seed(page){await page.goto(URL+'#home');await page.locator('.h-hero').waitFor();
  await page.evaluate(async()=>{const q=await (await fetch('data/questions.json')).json();const a={};q.forEach((x,i)=>a[x.id]=1+(i*7+Math.floor(i/7))%5);sessionStorage.setItem('five-assessment-v1',JSON.stringify({answers:a,index:119}));sessionStorage.removeItem('fem-life-v1');},);
  await page.reload();}
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
  await page.locator('#work .d-career .d-jcarousel:not(.d-deep-carousel)').waitFor();
  assert.match(await page.locator('#work .d-career-deep').textContent(),/Ditt neste steg: Starte egen praksis/);
  // Back to the goal question and pick a plain option for the rest of the check.
  await page.locator('[data-career="edit"]').click();
  for(let i=0;i<7;i++){if(i===5||i===6)await page.locator('[data-career="next"]').click();else await page.locator('#work .d-career-opt[aria-pressed="true"]').first().click();}
  await opt('Få mer ansvar');
  await page.locator('#work .d-career .d-jcarousel:not(.d-deep-carousel)').waitFor();
  assert.match(await page.locator('#work [data-career-bar]').innerText(),/Kontor- eller kunnskapsarbeid · Et fast team · Et lite team å lede/);
  // Phones: the overview cards swipe sideways; the arrow moves one card on and the dot follows.
  await page.setViewportSize({width:390,height:844});await page.locator('#work .d-career .d-jcarousel:not(.d-deep-carousel) [data-fnext]').click();await page.waitForTimeout(900);
  assert.equal(await page.locator('#work .d-career .d-jcarousel:not(.d-deep-carousel) .d-fdot[aria-current]').getAttribute('aria-label'),'Dette kan bli krevende','arrow moves the carousel');
  await page.setViewportSize({width:1440,height:900});
  // Overview: cards side by side with what fits and what is demanding, energy and one thing to try; the rest is folded away.
  for(const t of ['Dette kan fungere godt','Dette kan bli krevende','Din energi'])assert.ok(await page.locator('#work .d-career-eyebrow',{hasText:t}).count(),t);
  assert.equal(await page.locator('#work .d-career-deep').getAttribute('open'),null,'details start folded');
  if(await page.locator('#work [data-career-try]').count()){await page.locator('#work [data-career-try]').check();await page.reload();await page.locator('#work [data-career-try]').waitFor();assert.ok(await page.locator('#work [data-career-try]').isChecked(),'try box remembered');}
  await page.locator('#work .d-career-deep>summary').click();
  assert.ok(await page.locator('#work .d-career-sec h4',{hasText:'Når du leder'}).count(),'lead section with responsibility');
  if(SHOTS)await work.screenshot({path:`${SHOTS}/arbeid-desktop.png`});
  // Answers survive a reload; «Change» starts the questions again with the answers kept.
  await page.reload();await page.locator('#work .d-career .d-jcarousel:not(.d-deep-carousel)').waitFor();
  await page.locator('[data-career="edit"]').click();
  assert.equal(await page.locator('#work .d-career-opt[aria-pressed="true"]').innerText(),'Kontor- eller kunnskapsarbeid');
  // Everyday life and relationships: the same stepper as the job chapter (app/life.js). The children question appears only with children.
  await page.evaluate(()=>{sessionStorage.removeItem('fem-life-v1');location.hash='report/life';});const life=page.locator('#life .d-career');await life.waitFor();
  const lopt=t=>page.locator('#life .d-career-opt',{hasText:t}).first().click();
  const total=async()=>(await page.locator('#life .d-q2-row>span').last().innerText()).split(' ').pop();
  assert.equal(await total(),'8','eight questions without children');
  await lopt('Partner og barn');assert.equal(await total(),'9','children question added');
  await lopt('Under 6 år');await page.locator('[data-life="next"]').click();
  for(const t of ['Partneren min','Noen få nære','Jeg gir meg','Stappfull'])await lopt(t);
  await lopt('For lite tid for meg selv');await page.locator('[data-life="next"]').click();
  await lopt('Tid alene');await page.locator('[data-life="next"]').click();
  await lopt('En nærere relasjon');
  await page.locator('#life .d-career .d-jcarousel:not(.d-deep-carousel)').waitFor();
  assert.match(await page.locator('#life [data-life-bar]').innerText(),/^Partner og barn · barn: under 6 år$/m);
  for(const t of ['Dette hjelper deg','Dette kan bli krevende','Deg og de nærmeste','Din energi'])assert.ok(await page.locator('#life .d-career-eyebrow',{hasText:t}).count(),t);
  await page.locator('#life .d-career-deep>summary').click();
  assert.match(await page.locator('#life .d-career-deep').textContent(),/Ditt neste steg: en nærere relasjon/);
  if(SHOTS)await life.screenshot({path:`${SHOTS}/hverdag-desktop.png`});
  // Without children the children question goes away again, and the answer to it no longer counts.
  await page.locator('[data-life="edit"]').click();await lopt('Partner');
  assert.equal(await total(),'8','children question removed');
  // Mobile: no sideways scroll, columns stack.
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(150);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no sideways scroll on mobile');
  if(SHOTS)await page.locator('#life .d-career').screenshot({path:`${SHOTS}/hverdag-mobil.png`});
  // English.
  await page.setViewportSize({width:1440,height:900});await page.locator('#header-language').selectOption('en');await page.evaluate(()=>location.hash='report/work');
  await page.locator('#work .d-career').waitFor();assert.match(await page.locator('#work .d-career').getAttribute('aria-label'),/Your work, your profile/);
  if(SHOTS)await page.locator('#work .d-career').screenshot({path:`${SHOTS}/work-english.png`});
  // Offer page: both tiers, prices follow the country.
  await page.locator('#header-language').selectOption('no');await page.evaluate(()=>location.hash='offer');await page.locator('.d-offer-plus').waitFor();
  await page.locator('#header-country').selectOption('NO');
  assert.match(await page.locator('.d-offer-plus .d-offer-price').innerText(),/79/);
  assert.equal(await page.locator('.d-offer-plus .d-offer-recommended').innerText(),'ANBEFALT');
  if(SHOTS)await page.screenshot({path:`${SHOTS}/kjopsside.png`,fullPage:true});
  await page.locator('#header-country').selectOption('US');assert.match(await page.locator('.d-offer-plus .d-offer-price').innerText(),/7[.,]99/);
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(150);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'offer: no sideways scroll on mobile');
  if(SHOTS)await page.locator('.d-offer-plus').screenshot({path:`${SHOTS}/kjopsside-mobil.png`});
  // Links to the offer from the free profile open the purchase sheet: both prices and buttons fit on a small phone.
  await page.setViewportSize({width:1440,height:900});await page.locator('#header-country').selectOption('NO');await page.setViewportSize({width:360,height:640});await page.evaluate(()=>location.hash='results');
  await page.locator('a[href="#offer"]').first().click();await page.locator('dialog.d-osheet').waitFor();
  assert.deepEqual((await page.locator('.d-ocard-price').allInnerTexts()).map(t=>t.replace(/\s+/g,' ')),['79 kr','49 kr']);
  assert.equal(await page.locator('.d-opay-btn').first().getAttribute('href'),'#report','both reports open on the overview');
  assert.ok((await page.locator('.d-opay-amt').allInnerTexts()).every(t=>/79/.test(t)),'every payment button shows 79 kr');
  assert.match(await page.locator('.d-opay-consent').innerText(),/angreretten/,'Norway: consent to immediate delivery by the buttons');
  assert.match(await page.locator('.d-osheet-teaser').innerText(),/^Du ligger /,'one line about the buyer\'s own result');
  if(SHOTS)await page.screenshot({path:`${SHOTS}/kjopsark-360.png`});
  await page.locator('.d-otier.is-base').click();assert.equal(await page.locator('.d-opay-btn').first().getAttribute('href'),'#report','a tap on 49 kr switches the choice');
  assert.ok((await page.locator('.d-opay-amt').allInnerTexts()).every(t=>/^49/.test(t.trim())),'the buttons follow the chosen price');
  assert.ok(await page.evaluate(()=>{const b=document.querySelector('.d-osheet-box');return b.scrollHeight<=b.clientHeight+1;}),'sheet fits without scrolling');
  await page.keyboard.press('Escape');await page.waitForTimeout(200);assert.equal(await page.locator('dialog.d-osheet').count(),0,'Escape closes the sheet');
  await page.setViewportSize({width:390,height:844});
  // Clearing answers also clears the tailored answers.
  page.on('dialog',d=>d.accept());await page.locator('#clear-data').click();
  assert.equal(await page.evaluate(()=>sessionStorage.getItem('fem-life-v1')),null);
  assert.equal(await page.evaluate(()=>sessionStorage.getItem('fem-career-v1')),null);
  assert.deepEqual(errors,[]);
  console.log('tailored-check: ok');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
