// Cairns on the question page, the report overview "at a glance" and facet-card animation.
// Uses synthetic answers only. Run with the app on http://127.0.0.1:4173 (npm start).
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const assert=require('node:assert/strict');
const URL='http://127.0.0.1:4173/';
async function seed(page,n,value){await page.goto(URL+'#home');await page.locator('.hero').waitFor();
  await page.evaluate(async([n,value])=>{const q=await (await fetch('data/questions.json')).json();const a={};q.slice(0,n).forEach((x,i)=>a[x.id]=value||1+(i*7+Math.floor(i/7))%5);sessionStorage.setItem('five-assessment-v1',JSON.stringify({answers:a,index:Math.min(n,119)}));},[n,value]);
  await page.reload();}
const stones=page=>page.evaluate(()=>Object.fromEntries([...document.querySelectorAll('.d-cairn')].map(c=>[c.dataset.code,c.querySelectorAll('.d-stone:not(.is-leaving)').length])));
const total=s=>Object.values(s).reduce((a,b)=>a+b,0);
(async()=>{const browser=await chromium.launch({channel:'chrome'});try{
  const page=await browser.newPage({viewport:{width:1440,height:900},locale:'nb-NO'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  // Same stone geometry whatever the answer: all-1 and all-5 answers give identical cairns.
  const shapes=[];for(const v of [1,5]){await seed(page,40,v);await page.evaluate(()=>location.hash='test');await page.locator('.d-cairn').first().waitFor();shapes.push(await page.locator('.d-cairns').innerHTML());}
  assert.equal(shapes[0],shapes[1]);
  await seed(page,59);await page.evaluate(()=>location.hash='test');await page.locator('.d-choices').waitFor();
  assert.equal(total(await stones(page)),59);
  await page.locator('.d-choice').nth(0).click();await page.waitForTimeout(700);
  assert.equal(total(await stones(page)),60);
  assert.match(await page.locator('.d-cairns .d-milestone').innerText(),/Halvveis/);
  await page.locator('#back').click();await page.waitForTimeout(100);
  assert.equal(total(await stones(page)),59,'going back takes the stone off');
  for(const [w,h] of [[1440,900],[1366,768],[768,1024],[390,664],[375,600]]){await page.setViewportSize({width:w,height:h});await page.waitForTimeout(100);
    const fit=await page.evaluate(()=>({next:document.querySelector('.d-actions').getBoundingClientRect().bottom,h:innerHeight,sw:document.documentElement.scrollWidth}));
    assert.ok(fit.next<=fit.h,`answers and buttons fit at ${w}x${h}`);assert.ok(fit.sw<=w,`no sideways scroll at ${w}`);}
  // Last answer: cairns turn into the logo pieces and hand over to loading, then the result.
  await page.setViewportSize({width:1440,height:900});await seed(page,119);await page.evaluate(()=>location.hash='test');await page.locator('.d-choices').waitFor();
  await page.locator('.d-choice').nth(2).click();await page.waitForSelector('.d-question.is-finale');
  await page.waitForSelector('.d-assemble.is-from-cairns');await page.waitForFunction(()=>location.hash==='#results',null,{timeout:8000});
  // Report overview: radar, 100 people with tabs, two cards and the combination.
  await page.evaluate(()=>location.hash='report/overview');await page.locator('.d-glance').waitFor();
  assert.equal(await page.locator('.d-radar-dot').count(),5);
  assert.equal(await page.locator('.d-people-tabs [role=tab]').count(),5);
  await page.locator('.d-people-tabs [role=tab]').nth(2).click();
  assert.equal(await page.locator('.d-people-tabs [role=tab]').nth(2).getAttribute('aria-selected'),'true');
  const lit=await page.locator('.d-person.is-lit').count();await page.waitForTimeout(1200);
  assert.match(await page.locator('.d-people-line').innerText(),new RegExp(`høyere enn omtrent ${lit} av 100`));
  await page.keyboard.press('ArrowRight');assert.equal(await page.evaluate(()=>document.activeElement.dataset.trait),'A');
  assert.equal(await page.locator('.d-glance-card').count(),2);assert.equal(await page.locator('.d-combo h3').count(),1);
  assert.equal(await page.locator('.d-glance .d-info-btn').count(),1);assert.equal(await page.locator('#overview .d-norm-note').count(),1);
  await page.evaluate(()=>location.hash='report/traits');await page.locator('.d-tacc-toggle').first().click();await page.locator('.d-tlpanel:not([hidden]) .d-fcard-toggle').first().click();
  assert.ok(await page.locator('.d-fcard.is-filling').count()===1);await page.waitForTimeout(900);
  const score=await page.locator('.d-fcard.is-filling .d-facet-score').innerText();assert.match(score,/\d+\. persentil/);
  // Reduced motion: no finale, stones appear without animation, glance parts never wait.
  const still=await browser.newPage({viewport:{width:390,height:844},locale:'en-US',reducedMotion:'reduce'});still.on('pageerror',e=>errors.push(e.message));
  await seed(still,119);await still.evaluate(()=>location.hash='test');await still.locator('.d-choices').waitFor();
  await still.locator('.d-choice').nth(1).click();await still.waitForFunction(()=>location.hash==='#loading');
  assert.equal(await still.locator('.d-assemble.is-from-cairns').count(),0);
  await still.waitForFunction(()=>location.hash==='#results',null,{timeout:5000});
  await still.evaluate(()=>location.hash='report/overview');await still.locator('.d-glance').waitFor();await still.waitForTimeout(200);
  assert.equal(await still.locator('.is-waiting').count(),0);assert.match(await still.locator('.d-glance').innerText(),/Your profile at a glance/);
  assert.ok(await still.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.deepEqual(errors,[]);
  console.log('PASS: equal stones per trait, back removes a stone, milestone, no-scroll sizes, finale to loading, glance radar/tabs/cards, facet fill, reduced motion.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
