// Browser check of the optional account flow with a stand-in for the Supabase client.
// Run with the dev server on 127.0.0.1:4173: node scripts/account-check.cjs
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const assert=require('node:assert/strict');
const fake=()=>{const k='fake-auth',db='fake-db',get=n=>JSON.parse(localStorage.getItem(n)||'null'),put=(n,v)=>localStorage.setItem(n,JSON.stringify(v));
  const user={id:'u1',email:'rune@example.com',app_metadata:{provider:'google'},user_metadata:{full_name:'Rune Hansen'}};
  window.__femAuthClient={auth:{getSession:async()=>{if(new URLSearchParams(location.search).get('code')==='ok')put(k,true);return {data:{session:get(k)?{user}:null}};},exchangeCodeForSession:async()=>({}),
    signInWithOAuth:async({provider,options})=>{put('fake-provider',provider);location.href=options.redirectTo+'?code=ok';return {};},signOut:async()=>{put(k,false);return {};}},
    from:()=>({select:()=>({maybeSingle:async()=>({data:get(db)})}),upsert:async row=>{put(db,{answers:row.answers,language:row.language,updated_at:row.updated_at});return {};},delete:()=>({eq:async()=>{put(db,null);return {};}})}),
    rpc:async()=>{put(db,null);put(k,false);return {};}};};
(async()=>{const browser=await chromium.launch();try{
  const ctx=await browser.newContext({viewport:{width:1280,height:900},locale:'nb-NO'});const page=await ctx.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await ctx.route('**/config.js',r=>r.fulfill({contentType:'text/javascript',body:"window.FEM_CONFIG={supabaseUrl:'https://example.supabase.co',supabaseAnonKey:'public-anon'};"}));
  await ctx.addInitScript(fake);
  await page.goto('http://127.0.0.1:4173/?dev=1#test');await page.locator('#dev-random').click();
  // The video card opens first after the test and closes with «Ikke nå».
  await page.locator('dialog.d-video-intro[open]').waitFor({timeout:20000});await page.locator('.d-video-intro-close').click();
  await page.locator('dialog.d-video-intro').waitFor({state:'detached'});assert.equal(await page.locator('.d-results .d-share').count(),1);
  const box=page.locator('[data-account="box"]');await box.locator('.d-signin-btn').first().waitFor({timeout:20000});
  assert.equal(await box.locator('.d-signin-btn').count(),3);
  await box.locator('.d-signin-google').click();
  await page.waitForURL(/#results$/);await box.locator('.d-account-saved').waitFor();
  assert.match(await box.textContent(),/rune@example\.com/);
  assert.ok(!page.url().includes('code='),'the sign-in code is removed from the address');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('fake-db')).answers);
  assert.match(saved,/^1[1-5]{120}$/);
  // A fresh tab with no answers can open the saved profile.
  const tab=await ctx.newPage();tab.on('pageerror',e=>errors.push(e.message));
  await tab.goto('http://127.0.0.1:4173/#account');
  await tab.locator('[data-account-action="open"]').click();await tab.locator('.d-results').waitFor();
  assert.equal(await tab.evaluate(()=>JSON.parse(sessionStorage.getItem('five-assessment-v1')).answers&&Object.keys(JSON.parse(sessionStorage.getItem('five-assessment-v1')).answers).length),120);
  await tab.goto('http://127.0.0.1:4173/#account');tab.on('dialog',d=>d.accept());
  await tab.locator('[data-account-action="delete-account"]').click();await tab.locator('.d-signin-btn').first().waitFor();
  assert.equal(await tab.evaluate(()=>localStorage.getItem('fake-db')),'null');
  // The sign-in step right after the last question: sign in there and land on the saved profile.
  const step=await ctx.newPage();step.on('pageerror',e=>errors.push(e.message));
  await step.goto('http://127.0.0.1:4173/#home');await step.evaluate(async()=>{localStorage.setItem('fake-auth','false');localStorage.setItem('fake-db','null');const q=await (await fetch('data/questions-no.json')).json();const list=Array.isArray(q)?q:q.items||q.questions;const answers=Object.fromEntries(list.slice(0,119).map(x=>[x.id,3]));sessionStorage.setItem('five-assessment-v1',JSON.stringify({answers,index:119}));});
  await step.goto('http://127.0.0.1:4173/#test');await step.reload();await step.locator('.d-choice').first().click();
  await step.waitForURL(/#signin$/,{timeout:15000});assert.equal(await step.locator('.d-signin-step .d-signin-btn').count(),3);
  if(process.env.SHOT_STEP)await step.screenshot({path:process.env.SHOT_STEP});
  await step.locator('.d-signin-step .d-signin-apple').click();
  await step.locator('.d-results').waitFor({timeout:20000});await step.locator('dialog.d-video-intro[open]').waitFor();
  assert.equal(await step.locator('#share-first').inputValue(),'Rune','first name comes from the sign-in');
  if(process.env.SHOT_INTRO)await step.screenshot({path:process.env.SHOT_INTRO});
  await step.keyboard.press('Escape');await step.locator('dialog.d-video-intro').waitFor({state:'detached'});await step.locator('[data-account="box"] .d-account-saved').waitFor();
  assert.equal(await step.evaluate(()=>localStorage.getItem('fake-provider')),'"apple"');
  await page.screenshot({path:process.env.SHOT||'/dev/null'}).catch(()=>{});
  assert.deepEqual(errors,[]);console.log('account check passed');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
