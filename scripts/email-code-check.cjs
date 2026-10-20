// Browser check of signing in with the code from the email (account.verifyEmailCode), with a stand-in for Supabase.
// The answers stay in this browser and are saved to the account once the code is accepted.
// Run with the dev server on 127.0.0.1:4173: node scripts/email-code-check.cjs (SHOT=prefix saves a screenshot).
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const assert=require('node:assert/strict');
const fake=()=>{const user={id:'u1',email:'jan@example.com',app_metadata:{provider:'email'},user_metadata:{}};let session=null;window.__auth=[];window.__saved=null;
  window.__femAuthClient={auth:{getSession:async()=>({data:{session}}),signOut:async()=>{session=null;return {};},
    signInWithOtp:async a=>{window.__auth.push(['otp',a.email]);return {error:null};},
    verifyOtp:async a=>{window.__auth.push(['verify',a.type,a.token]);if(a.token!=='123456')return {data:{session:null},error:new Error('Token has expired or is invalid')};session={user,access_token:'tok'};return {data:{session},error:null};}},
    from:()=>({select:()=>({maybeSingle:async()=>({data:window.__saved})}),upsert:async row=>{window.__saved={answers:row.answers,language:row.language,updated_at:row.updated_at};return {error:null};}})};};
const seed=async page=>page.evaluate(async()=>{const q=await (await fetch('data/questions-no.json')).json();const list=Array.isArray(q)?q:q.items||q.questions;sessionStorage.setItem('five-assessment-v1',JSON.stringify({answers:Object.fromEntries(list.map((x,i)=>[x.id,1+i%5])),index:119}));});
(async()=>{const browser=await chromium.launch();try{
  const ctx=await browser.newContext({viewport:{width:390,height:780},isMobile:true,hasTouch:true,locale:'nb-NO'});const page=await ctx.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await ctx.route('**/config.js',r=>r.fulfill({contentType:'text/javascript',body:"window.FEM_CONFIG={supabaseUrl:'https://example.supabase.co',supabaseAnonKey:'public-anon',providers:'google'};"}));
  await ctx.addInitScript(fake);
  await page.goto('http://127.0.0.1:4173/#home');await seed(page);
  await page.goto('http://127.0.0.1:4173/#signin');await page.reload();
  await page.waitForTimeout(1500);if(!/#signin$/.test(page.url()))await page.evaluate(()=>{location.hash='#signin';});
  await page.locator('.d-signin-email summary').first().click();
  await page.fill('[data-email-signin] input[name=email]','jan@example.com');
  await page.click('[data-email-signin] button');
  const code=page.locator('[data-email-code]').first();await code.waitFor({state:'visible'});
  assert.match(await page.locator('[data-email-signin] .d-signin-email-msg').textContent(),/Skriv inn koden/);
  await code.locator('input').fill('111111');await code.locator('button').click();
  await page.waitForFunction(()=>/virket ikke/.test(document.querySelector('[data-email-code] .d-signin-email-msg').textContent));
  if(process.env.SHOT)await page.screenshot({path:`${process.env.SHOT}-kode.png`});
  await code.locator('input').fill('123 456');await code.locator('button').click();
  await page.waitForFunction(()=>window.__saved);
  const saved=await page.evaluate(()=>window.__saved);assert.match(saved.answers,/^1[1-5]{120}$/,'the answers in this browser are saved to the account');
  await page.waitForFunction(()=>!/#signin$/.test(location.href));
  assert.deepEqual((await page.evaluate(()=>window.__auth)).slice(-1)[0],['verify','email','123456']);
  assert.deepEqual(errors,[]);
  console.log('email code check: ok',page.url());
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
