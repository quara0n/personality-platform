const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'chrome'});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},locale:'nb-NO'});
 await page.goto('http://127.0.0.1:4173/#home');await page.locator('.hero').waitFor();
 assert.equal(await page.locator('.brand .wordmark').getAttribute('alt'),'Kaleido');
 assert.match(await page.locator('.hero').innerText(),/120 spørsmål/);
 assert.doesNotMatch(await page.locator('.hero').innerText(),/stemmegivning|utsagn/);
 assert.equal(await page.locator('header .locale-bar').count(),1);
 await page.screenshot({path:'artifacts/design-home-no.png',fullPage:true});
 await page.goto('http://127.0.0.1:4173/#test');await page.locator('.d-choices').waitFor();
 assert.match(await page.locator('.d-count').innerText(),/Spørsmål/i);
 await page.screenshot({path:'artifacts/design-question-no.png',fullPage:true});
 for(const width of [390,768,971]){
  await page.setViewportSize({width,height:844});
  await page.goto('http://127.0.0.1:4173/#home');await page.locator('.hero').waitFor();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:`artifacts/design-home-${width}.png`,fullPage:true});
 }
 await page.locator('#header-language').selectOption('en');await page.waitForFunction(()=>document.documentElement.lang==='en');
 assert.match(await page.locator('.hero').innerText(),/120 questions/);
 console.log('PASS: original wordmark, question labels, removed landing note, compact header, English/Norwegian and responsive widths.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});

