// Report chapter "Your five traits": the logo pieces open and fold one trait panel at a time.
// Uses synthetic answers only. Run with the app on http://127.0.0.1:4173 (npm start).
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const assert=require('node:assert/strict');
const URL='http://127.0.0.1:4173/';
async function open(page){await page.goto(URL+'#home');await page.locator('.hero').waitFor();
  await page.evaluate(async()=>{const q=await (await fetch('data/questions.json')).json();const a={};q.forEach((x,i)=>a[x.id]=1+(i*7+Math.floor(i/7))%5);sessionStorage.setItem('five-assessment-v1',JSON.stringify({answers:a,index:119}));});
  await page.reload();await page.evaluate(()=>location.hash='report/traits');await page.locator('.d-tlogo').waitFor();}
const state=page=>page.evaluate(()=>({open:[...document.querySelectorAll('.d-tlpanel')].filter(p=>!p.hidden).map(p=>p.id),expanded:[...document.querySelectorAll('.d-tlogo-piece')].filter(b=>b.getAttribute('aria-expanded')==='true').map(b=>b.dataset.trait)}));
(async()=>{const browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{channel:'chrome'});try{
  for(const [w,h,locale] of [[1440,900,'nb-NO'],[768,1024,'nb-NO'],[390,844,'nb-NO'],[390,844,'en-US']]){
    const page=await browser.newPage({viewport:{width:w,height:h},locale});const errors=[];page.on('pageerror',e=>errors.push(e.message));await open(page);
    assert.deepEqual(await state(page),{open:[],expanded:[]},'all traits start folded');
    // Clicking the middle of each visible triangle opens that trait, even where image boxes overlap.
    for(const code of ['O','C','E','A','N']){
      await page.locator(".d-tlogo").scrollIntoViewIfNeeded();
      const point=await page.evaluate(code=>{const b=document.querySelector(`.d-tlogo-piece[data-trait="${code}"]`),r=b.getBoundingClientRect(),pts=getComputedStyle(b).getPropertyValue('--clip').match(/[\d.]+%\s+[\d.]+%/g).map(p=>p.split(/\s+/).map(parseFloat));
        return {x:r.left+r.width*pts.reduce((s,p)=>s+p[0],0)/300,y:r.top+r.height*pts.reduce((s,p)=>s+p[1],0)/300};},code);
      await page.mouse.click(point.x,point.y);await page.waitForTimeout(50);
      assert.deepEqual(await state(page),{open:[`trait-${code}`],expanded:[code]},`${code} opens alone at ${w}`);}
    // Clicking the open piece's name folds it again.
    await page.locator('.d-tlogo-piece[data-trait="N"] .d-tlogo-name').click();
    assert.deepEqual(await state(page),{open:[],expanded:[]});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth)<=w,`no sideways scroll at ${w}`);
    assert.deepEqual(errors,[]);await page.close();}
  // Keyboard: Tab reaches the pieces, Enter opens, arrows move, the fold button returns focus to the piece.
  const page=await browser.newPage({viewport:{width:1440,height:900},locale:'nb-NO'});await open(page);
  await page.locator('.d-tlogo-piece').first().focus();await page.keyboard.press('Enter');
  assert.deepEqual((await state(page)).open,['trait-O']);
  await page.keyboard.press('ArrowRight');assert.equal(await page.evaluate(()=>document.activeElement.dataset.trait),'C');
  await page.keyboard.press('Space');assert.deepEqual(await state(page),{open:['trait-C'],expanded:['C']});
  await page.locator('#trait-C .d-tlpanel-close').click();
  assert.deepEqual((await state(page)).open,[]);assert.equal(await page.evaluate(()=>document.activeElement.dataset.trait),'C');
  // Print and PDF show all five traits and hide the picker.
  await page.emulateMedia({media:'print'});
  assert.equal(await page.locator('#traits .d-trait-chapter:visible').count(),5);
  assert.equal(await page.locator('.d-tlogo-wrap').isVisible(),false);
  console.log('trait-logo-check: ok');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
