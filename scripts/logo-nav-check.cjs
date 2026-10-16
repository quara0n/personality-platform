// "Your five traits" (report) and "Explore your traits" (free profile) as the logo: each piece opens
// that trait below, one at a time; the name keys do the same. Uses synthetic answers only.
// Run with the app on http://127.0.0.1:4173 (npm start).
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const assert=require('node:assert/strict');
const URL='http://127.0.0.1:4173/';
async function open(page,hash){await page.goto(URL+'#home');await page.locator('.h-hero').waitFor();
  await page.evaluate(async()=>{const q=await (await fetch('data/questions.json')).json();const a={};q.forEach((x,i)=>a[x.id]=1+(i*7+Math.floor(i/7))%5);sessionStorage.setItem('five-assessment-v1',JSON.stringify({answers:a,index:119}));});
  await page.reload();await page.evaluate(h=>location.hash=h,hash);await page.locator('.d-lnav').waitFor();await page.evaluate(()=>document.querySelector('dialog')?.close());}
const state=(page,prefix)=>page.evaluate(p=>({open:['O','C','E','A','N'].filter(c=>!document.getElementById(p+c).hidden),pressed:[...document.querySelectorAll('.d-lnav-piece')].filter(b=>b.getAttribute('aria-expanded')==='true').map(b=>b.dataset.trait)}),prefix);
(async()=>{const browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{channel:'chrome'});try{
  for(const [hash,prefix] of [['report/traits','trait-'],['results','td-']])
  for(const [w,h,locale] of [[1440,900,'nb-NO'],[768,1024,'nb-NO'],[390,844,'nb-NO'],[390,844,'en-US']]){
    const page=await browser.newPage({viewport:{width:w,height:h},locale});const errors=[];page.on('pageerror',e=>errors.push(e.message));await open(page,hash);
    assert.deepEqual(await state(page,prefix),{open:[],pressed:[]},'all traits start closed');
    assert.equal(await page.locator('.d-lnav-piece').count(),5);
    // Every piece shows a number and a level.
    assert.equal((await page.locator('.d-lnav-num').allTextContents()).filter(t=>/^\d/.test(t)).length,5);
    for(const code of ['O','C','E','A','N']){
      await page.locator(`.d-lnav-piece[data-trait="${code}"] .d-lnav-hit`).click();
      assert.deepEqual(await state(page,prefix),{open:[code],pressed:[code]},`${code} opens alone at ${w} (${hash})`);}
    await page.locator('.d-lnav-key[data-trait="N"]').click();
    assert.deepEqual(await state(page,prefix),{open:[],pressed:[]},'tapping the open trait closes it');
    await page.locator('.d-lnav-key[data-trait="E"]').click();
    assert.deepEqual(await state(page,prefix),{open:['E'],pressed:['E']});
    if(w===390){const box=await page.locator('.d-lnav-logo').boundingBox();assert.ok(box.width>=w-1,`logo fills the phone width (${box.width})`);}
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth)<=w,`no sideways scroll at ${w}`);
    assert.deepEqual(errors,[]);await page.close();}
  // Keyboard: Enter on a piece opens it; the close button returns focus to the piece.
  const page=await browser.newPage({viewport:{width:1440,height:900},locale:'nb-NO'});await open(page,'report/traits');
  await page.locator('.d-lnav-piece[data-trait="O"]').focus();await page.keyboard.press('Enter');
  assert.deepEqual((await state(page,'trait-')).open,['O']);
  await page.locator('#trait-O .d-tlpanel-close').click();
  assert.deepEqual((await state(page,'trait-')).open,[]);assert.equal(await page.evaluate(()=>document.activeElement.dataset.trait),'O');
  // Print and PDF show all five traits.
  await page.emulateMedia({media:'print'});
  assert.equal(await page.locator('#traits .d-trait-chapter:visible').count(),5);
  console.log('logo-nav-check: ok');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
