// Browser check of the purchase flow with payments switched on, using stand-ins for Supabase and /api/purchase
// (Stripe is simulated by sending the browser straight to the success address).
// Run with the dev server on 127.0.0.1:4173: node scripts/payment-check.cjs
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const assert=require('node:assert/strict');
const fake=()=>{const user={id:'u1',email:'rune@example.com',app_metadata:{provider:'google'},user_metadata:{full_name:'Rune Hansen'}};
  window.__femAuthClient={auth:{getSession:async()=>({data:{session:{user,access_token:'tok'}}}),signOut:async()=>({})},from:()=>({select:()=>({maybeSingle:async()=>({data:null})})})};};
const seed=async page=>page.evaluate(async()=>{const q=await (await fetch('data/questions-no.json')).json();const list=Array.isArray(q)?q:q.items||q.questions;sessionStorage.setItem('five-assessment-v1',JSON.stringify({answers:Object.fromEntries(list.map((x,i)=>[x.id,1+i%5])),index:119}));});
(async()=>{const browser=await chromium.launch();try{
  for(const [w,h] of [[1280,900],[390,664]]){
  const ctx=await browser.newContext({viewport:{width:w,height:h},locale:'nb-NO'});const page=await ctx.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await ctx.route('**/config.js',r=>r.fulfill({contentType:'text/javascript',body:"window.FEM_CONFIG={supabaseUrl:'https://example.supabase.co',supabaseAnonKey:'public-anon',payments:true,vipps:true};"}));
  let owned=null;const calls=[];
  await ctx.route('**/api/purchase',async r=>{const b=JSON.parse(r.request().postData());calls.push(b);assert.equal(r.request().headers().authorization,'Bearer tok');
    if(b.action==='status')return r.fulfill({json:{tier:owned}});
    if(b.action==='checkout')return r.fulfill({json:{url:'http://127.0.0.1:4173/?paid=cs_test_abc#report'}});
    if(b.action==='confirm'){owned=b.session==='cs_test_abc'?'plus':owned;return r.fulfill({json:{tier:owned,paid:true}});}});
  await ctx.addInitScript(fake);
  await page.goto('http://127.0.0.1:4173/#home');await seed(page);
  // Without a purchase, the report leads to the free profile with the purchase sheet on top.
  await page.goto('http://127.0.0.1:4173/#report');await page.reload();
  const sheet=page.locator('dialog.d-osheet[open]');await sheet.waitFor({timeout:20000});
  assert.match(page.url(),/#results$/);
  assert.equal(await sheet.locator('.d-opay-btn').count(),3,'card, Vipps and a wallet');
  assert.doesNotMatch(await sheet.textContent(),/Forhåndsvisning/,'no preview line once payments are on');
  if(process.env.SHOT)await page.screenshot({path:`${process.env.SHOT}-sheet-${w}.png`});
  await sheet.locator('.d-opay-btn.is-vipps').click();
  await page.waitForURL(/#report$/);await page.locator('.d-chapter').first().waitFor({timeout:20000});
  const checkout=calls.find(c=>c.action==='checkout');
  assert.deepEqual({tier:checkout.tier,method:checkout.method,market:checkout.market},{tier:'plus',method:'vipps',market:'NO'});
  assert.ok(calls.some(c=>c.action==='confirm'&&c.session==='cs_test_abc'));
  assert.ok(!page.url().includes('paid='),'the session id is removed from the address');
  await page.goto('http://127.0.0.1:4173/#report/work');await page.locator('#work').waitFor();assert.equal(await page.locator('.d-tailor-up').count(),0,'«plus» shows the tailored chapters');
  // An owner of the 49 kr report: the report opens without the tailored parts, and the offer is the upgrade.
  owned='base';await page.goto('http://127.0.0.1:4173/#report/work');await page.reload();await page.locator('.d-tailor-up').first().waitFor({timeout:20000});
  await page.locator('.d-tailor-up a').first().click();
  const up=page.locator('dialog.d-osheet[open]');await up.waitFor();
  assert.ok(await up.locator('input[value="base"]').isDisabled());
  assert.match(await up.locator('.d-otier.is-base .d-ocard-price').textContent(),/Kjøpt/);
  assert.match(await up.locator('.d-otier.is-plus .d-ocard-price').textContent(),/30/);
  assert.match(await up.locator('.d-opay-btn').first().textContent(),/30/);
  if(process.env.SHOT)await page.screenshot({path:`${process.env.SHOT}-upgrade-${w}.png`});
  // A failed checkout leaves the sheet open with a message and nothing charged.
  await ctx.unroute('**/api/purchase');await ctx.route('**/api/purchase',r=>r.fulfill({status:502,json:{error:'down'}}));
  await up.locator('.d-opay-btn').first().click();await up.locator('.d-opay-err:not([hidden])').waitFor();
  assert.match(await up.locator('.d-opay-err').textContent(),/Ingenting er trukket/);
  assert.deepEqual(errors,[]);await ctx.close();}
  console.log('payment check passed');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
