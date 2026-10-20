// Browser check of «Min side»: someone who signs in again in an empty tab lands on an overview of their own profile,
// and a buyer reaches the report from every in-depth link while the upgrade stays optional.
// Run with the dev server on 127.0.0.1:4173: node scripts/min-side-check.cjs (SHOT=prefix saves screenshots)
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const assert=require('node:assert/strict');
const code='1'+Array.from({length:120},(_,i)=>1+(i*7)%5).join('');
const fake=code=>{const user={id:'u1',email:'rune@example.com',app_metadata:{provider:'google'},user_metadata:{full_name:'Rune Hansen'}};
  window.__femAuthClient={auth:{getSession:async()=>({data:{session:{user,access_token:'tok'}}}),signOut:async()=>({})},from:()=>({select:()=>({maybeSingle:async()=>({data:{answers:code,language:'no',updated_at:'2026-10-19T10:00:00Z'}})})})};};
(async()=>{const browser=await chromium.launch();try{
  for(const [w,h] of [[1280,900],[390,844]]){
  const ctx=await browser.newContext({viewport:{width:w,height:h},locale:'nb-NO'});const page=await ctx.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await ctx.route('**/config.js',r=>r.fulfill({contentType:'text/javascript',body:"window.FEM_CONFIG={supabaseUrl:'https://example.supabase.co',supabaseAnonKey:'public-anon',payments:true};"}));
  await ctx.route('**/api/purchase',r=>r.fulfill({json:{tier:'base'}}));
  await ctx.addInitScript(fake,code);
  // A new tab: nothing in sessionStorage, the answers come from the account.
  await page.goto('http://127.0.0.1:4173/#account');
  const me=page.locator('.d-me');await me.waitFor({timeout:20000});
  assert.match(await me.locator('h1').textContent(),/Hei, Rune/);
  assert.equal(await me.locator('.d-trait-row').count(),5);
  assert.match(await me.locator('.d-me-card').first().textContent(),/Kjøpt/);
  await page.locator('.d-avatar').waitFor();assert.equal(await page.locator('.d-avatar').getAttribute('href'),'#account');
  await page.waitForTimeout(800);
  if(process.env.SHOT){await page.screenshot({path:`${process.env.SHOT}-${w<500?'mobil':'pc'}.png`});await page.screenshot({path:`${process.env.SHOT}-${w<500?'mobil':'pc'}-hel.png`,fullPage:true});}
  await me.locator('.d-me-card[href="#report"]').click();await page.waitForURL(/#report$/);await page.locator('.d-chapter').first().waitFor({timeout:20000});
  assert.equal(await page.locator('dialog.d-osheet[open]').count(),0);
  // The free profile's in-depth links open the report for a buyer, not the purchase sheet.
  await page.goto('http://127.0.0.1:4173/#results');await page.locator('.d-deeper').waitFor();
  assert.match(await page.locator('.d-deeper-btn').textContent(),/Åpne Fordypningsrapporten/);
  await page.locator('.d-profile-name-more').click();await page.waitForURL(/#report$/);
  assert.equal(await page.locator('dialog.d-osheet[open]').count(),0);
  // The upgrade is an optional card on «Min side».
  await page.goto('http://127.0.0.1:4173/#account');await page.locator('.d-me-card[data-tier="plus"]').click();
  await page.locator('dialog.d-osheet[open]').waitFor();await page.keyboard.press('Escape');
  // The video shortcut lands on the share box.
  await page.goto('http://127.0.0.1:4173/#account');await page.locator('.d-me-card[data-me="video"]').click();await page.waitForURL(/#results$/);
  await page.waitForTimeout(600);assert.ok(await page.locator('.d-share').evaluate(el=>{const r=el.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0;}),'share box in view');
  assert.deepEqual(errors,[]);await ctx.close();}
  console.log('min side check passed');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
