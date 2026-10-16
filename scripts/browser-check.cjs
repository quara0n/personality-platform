const path=require('node:path');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const bundle=process.env.PLAYWRIGHT_MODULE_PATH;
const {chromium}=bundle?require(bundle):require('playwright');
(async()=>{
  const browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH,headless:true}:{channel:'chrome',headless:true});
  try {
  const page=await browser.newPage({viewport:{width:1440,height:1000},locale:'en-US'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const out=path.resolve('artifacts');fs.mkdirSync(out,{recursive:true});
  await page.goto('http://127.0.0.1:4173');
  await page.locator('.hero h1').waitFor();
  await page.screenshot({path:path.join(out,'landing-desktop.png'),fullPage:true});
  await page.locator('a[href="#test"]').first().click();
  await page.locator('.d-choice').first().click();
  await page.waitForFunction(()=>document.querySelector('.d-count')?.textContent.includes('2 of 120'));
  await page.locator('#back').click();
  assert.equal(await page.locator('.d-choice input:checked').inputValue(),'1');
  await page.locator('.d-choice').nth(4).click();
  await page.waitForFunction(()=>document.querySelector('.d-count')?.textContent.includes('2 of 120'));
  await page.reload();await page.locator('.d-choices').waitFor();
  assert.equal(await page.locator('progress').getAttribute('value'),'1');
  for(let n=1;n<120;n++){
    await page.locator('.d-choice').nth(2).click();
    if(n<119)await page.waitForFunction(expected=>document.querySelector('.d-count')?.textContent.includes(`${expected} of 120`),n+2);
  }
  await page.waitForURL('**/#results');await page.locator('.d-panels').waitFor();
  // After a finished test the share-video intro opens as a modal; close it like a user would.
  const intro=page.locator('dialog.d-video-intro[open]');await intro.waitFor();await intro.locator('.d-video-intro-close').click();await intro.waitFor({state:'detached'}).catch(()=>{});assert.equal(await page.locator('dialog.d-video-intro[open]').count(),0);
  assert.equal(await page.locator('.d-lnav-piece').count(),5);await page.locator('.d-lnav-key').nth(1).click();assert.equal(await page.locator('.d-tdetail:visible').count(),1);
  await page.screenshot({path:path.join(out,'results-desktop.png'),fullPage:true});
  await page.goto('http://127.0.0.1:4173/#demo');await page.locator('.d-report-body').waitFor();
  assert.equal(await page.locator('.facet').count(),30);
  assert.equal(await page.locator('.step').count(),3);
  await page.pdf({path:path.join(out,'sample-report-en.pdf'),format:'Letter',printBackground:true});
  await page.locator('#language').selectOption('no');
  await page.waitForFunction(()=>document.documentElement.lang==='nb'&&document.querySelector('.d-report-body')?.textContent.includes('Personlighetsprofilen din'));
  await page.locator('#country').selectOption('NO');
  await page.pdf({path:path.join(out,'sample-report-no.pdf'),format:'A4',printBackground:true});
  await page.screenshot({path:path.join(out,'report-no-desktop.png'),fullPage:false});
  await page.goto('http://127.0.0.1:4173/#offer');
  await page.waitForFunction(()=>/NOK|kr/.test(document.querySelector('.d-offer-card')?.textContent||''));
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:path.join(out,'offer-mobile.png'),fullPage:true});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No mobile horizontal overflow');
  await page.goto('http://127.0.0.1:4173/#test');await page.locator('.d-choices').waitFor();
  await page.screenshot({path:path.join(out,'question-mobile.png'),fullPage:true});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No question overflow');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('.d-choice input').first().focus();await page.keyboard.press('ArrowRight');
  const before=await page.locator('progress').getAttribute('value');
  await page.waitForTimeout(450);assert.equal(await page.locator('progress').getAttribute('value'),before);
  assert.deepEqual(errors,[]);
  console.log('PASS: 120 answers, back/edit/resume, results, bilingual report, 30 facets, three actions, PDF, currency, mobile overflow, keyboard focus; no browser errors.');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
