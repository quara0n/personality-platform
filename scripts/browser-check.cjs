const path=require('node:path');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const bundle=process.env.PLAYWRIGHT_MODULE_PATH;
const {chromium}=bundle?require(bundle):require('playwright');
(async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try {
  const page=await browser.newPage({viewport:{width:1440,height:1000},locale:'en-US'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const out=path.resolve('artifacts');fs.mkdirSync(out,{recursive:true});
  await page.goto('http://127.0.0.1:4173');
  await page.locator('.hero h1').waitFor();
  await page.screenshot({path:path.join(out,'landing-desktop.png'),fullPage:true});
  await page.locator('a[href="#test"]').first().click();
  await page.locator('.choice').first().click();
  await page.waitForFunction(()=>document.querySelector('.assessment .eyebrow')?.textContent.includes('2 / 120'));
  await page.locator('#back').click();
  assert.equal(await page.locator('.choice input:checked').inputValue(),'1');
  await page.locator('.choice').nth(4).click();
  await page.waitForFunction(()=>document.querySelector('.assessment .eyebrow')?.textContent.includes('2 / 120'));
  await page.reload();await page.locator('.choices').waitFor();
  assert.equal(await page.locator('progress').getAttribute('value'),'1');
  for(let n=1;n<120;n++){
    await page.locator('.choice').nth(2).click();
    if(n<119)await page.waitForFunction(expected=>document.querySelector('.assessment .eyebrow')?.textContent.includes(`${expected} / 120`),n+2);
  }
  await page.waitForURL('**/#results');await page.locator('.traits-details').waitFor();
  assert.equal(await page.locator('.traits-details details').count(),5);
  await page.screenshot({path:path.join(out,'results-desktop.png'),fullPage:true});
  await page.goto('http://127.0.0.1:4173/#demo');await page.locator('.report-body').waitFor();
  assert.equal(await page.locator('.facet').count(),30);
  assert.equal(await page.locator('.step').count(),3);
  await page.pdf({path:path.join(out,'sample-report-en.pdf'),format:'Letter',printBackground:true});
  await page.locator('#language').selectOption('no');
  await page.waitForFunction(()=>document.documentElement.lang==='nb'&&document.querySelector('.report-body')?.textContent.includes('Personligheten din.'));
  await page.locator('#country').selectOption('NO');
  await page.pdf({path:path.join(out,'sample-report-no.pdf'),format:'A4',printBackground:true});
  await page.screenshot({path:path.join(out,'report-no-desktop.png'),fullPage:false});
  await page.goto('http://127.0.0.1:4173/#offer');
  await page.waitForFunction(()=>document.querySelector('.offer-card')?.textContent.includes('NOK'));
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:path.join(out,'offer-mobile.png'),fullPage:true});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No mobile horizontal overflow');
  await page.goto('http://127.0.0.1:4173/#test');await page.locator('.choices').waitFor();
  await page.screenshot({path:path.join(out,'question-mobile.png'),fullPage:true});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No question overflow');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('.choice input').first().focus();await page.keyboard.press('ArrowRight');
  const before=await page.locator('progress').getAttribute('value');
  await page.waitForTimeout(450);assert.equal(await page.locator('progress').getAttribute('value'),before);
  assert.deepEqual(errors,[]);
  console.log('PASS: 120 answers, back/edit/resume, results, bilingual report, 30 facets, three actions, PDF, currency, mobile overflow, keyboard focus; no browser errors.');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
