// Report chapter "Your five traits": one row per trait opens and folds that trait's panel, one at a time.
// Uses synthetic answers only. Run with the app on http://127.0.0.1:4173 (npm start).
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const assert=require('node:assert/strict');
const URL='http://127.0.0.1:4173/';
async function open(page){await page.goto(URL+'#home');await page.locator('.hero').waitFor();
  await page.evaluate(async()=>{const q=await (await fetch('data/questions.json')).json();const a={};q.forEach((x,i)=>a[x.id]=1+(i*7+Math.floor(i/7))%5);sessionStorage.setItem('five-assessment-v1',JSON.stringify({answers:a,index:119}));});
  await page.reload();await page.evaluate(()=>location.hash='report/traits');await page.locator('.d-tacc-list').waitFor();}
const state=page=>page.evaluate(()=>({open:[...document.querySelectorAll('.d-tlpanel')].filter(p=>!p.hidden).map(p=>p.id),expanded:[...document.querySelectorAll('.d-tacc-toggle')].filter(b=>b.getAttribute('aria-expanded')==='true').map(b=>b.closest('.d-tacc').dataset.trait)}));
(async()=>{const browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{channel:'chrome'});try{
  for(const [w,h,locale] of [[1440,900,'nb-NO'],[768,1024,'nb-NO'],[390,844,'nb-NO'],[390,844,'en-US']]){
    const page=await browser.newPage({viewport:{width:w,height:h},locale});const errors=[];page.on('pageerror',e=>errors.push(e.message));await open(page);
    assert.deepEqual(await state(page),{open:[],expanded:[]},'all traits start folded');
    assert.equal(await page.locator('.d-tacc').count(),5);
    for(const code of ['O','C','E','A','N']){
      await page.locator(`.d-tacc[data-trait="${code}"] .d-tacc-toggle`).click();
      assert.deepEqual(await state(page),{open:[`trait-${code}`],expanded:[code]},`${code} opens alone at ${w}`);}
    // Clicking the open row folds it again.
    await page.locator('.d-tacc[data-trait="N"] .d-tacc-toggle').click();
    assert.deepEqual(await state(page),{open:[],expanded:[]});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth)<=w,`no sideways scroll at ${w}`);
    assert.deepEqual(errors,[]);await page.close();}
  // Keyboard: Enter opens, the fold button closes and returns focus to the row.
  const page=await browser.newPage({viewport:{width:1440,height:900},locale:'nb-NO'});await open(page);
  await page.locator('.d-tacc-toggle').first().focus();await page.keyboard.press('Enter');
  assert.deepEqual((await state(page)).open,['trait-O']);
  await page.locator('#trait-O .d-tlpanel-close').click();
  assert.deepEqual((await state(page)).open,[]);assert.equal(await page.evaluate(()=>document.activeElement.closest('.d-tacc').dataset.trait),'O');
  // Print and PDF show all five traits.
  await page.emulateMedia({media:'print'});
  assert.equal(await page.locator('#traits .d-trait-chapter:visible').count(),5);
  console.log('trait-list-check: ok');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
