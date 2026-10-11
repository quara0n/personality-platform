const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'chrome'});try{
 const page=await browser.newPage({locale:'en-US'});
 await page.goto('http://127.0.0.1:4173');await page.locator('.hero').waitFor();
 let release;
 await page.route('**/data/questions-no.json',async route=>{
   await new Promise(resolve=>{release=resolve});
   await route.fulfill({status:503,body:'Temporary failure'});
 });
 await page.locator('#language').selectOption('no');
 while(!release)await page.waitForTimeout(10);
 await page.locator('#language').selectOption('en');
 await page.waitForFunction(()=>document.documentElement.lang==='en'&&document.querySelector('.hero'));
 await page.waitForTimeout(200);
 release();await page.waitForTimeout(500);
 assert.equal(await page.locator('.error').count(),0,'Old failed locale request must not replace newer successful locale');
 assert.equal(await page.locator('.hero').count(),1);
 console.log('PASS: stale failed locale request cannot overwrite newer successful page.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
