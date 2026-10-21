// Browser check of sharing the profile video as a link (lib/shares.js), with stand-ins for Supabase, /api/share
// and the storage uploads. Records the real video, so it takes about half a minute per size.
// Run with the dev server on 127.0.0.1:4173: node scripts/share-check.cjs (SHOT=prefix saves screenshots and the card).
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const fake=()=>{const user={id:'u1',email:'rune@example.com',app_metadata:{provider:'google'},user_metadata:{full_name:'Rune Hansen'}};
  window.__femAuthClient={auth:{getSession:async()=>({data:{session:{user,access_token:'tok'}}}),signOut:async()=>({})},from:()=>({select:()=>({maybeSingle:async()=>({data:null})})})};
  window.__shared=[];if(matchMedia('(pointer:coarse)').matches){navigator.share=async d=>{window.__shared.push({url:d.url,files:(d.files||[]).length});};navigator.canShare=d=>!d.files||d.files.every(f=>/mp4|webm/.test(f.type));}};
const seed=async page=>page.evaluate(async()=>{const q=await (await fetch('data/questions-no.json')).json();const list=Array.isArray(q)?q:q.items||q.questions;sessionStorage.setItem('five-assessment-v1',JSON.stringify({answers:Object.fromEntries(list.map((x,i)=>[x.id,1+i%5])),index:119}));});
(async()=>{const browser=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});try{
  for(const mobile of [false,true]){
  const ctx=await browser.newContext(mobile?{viewport:{width:390,height:780},isMobile:true,hasTouch:true,locale:'nb-NO'}:{viewport:{width:1280,height:900},locale:'nb-NO',acceptDownloads:true});const page=await ctx.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await ctx.route('**/config.js',r=>r.fulfill({contentType:'text/javascript',body:"window.FEM_CONFIG={supabaseUrl:'https://example.supabase.co',supabaseAnonKey:'public-anon'};"}));
  const calls=[],puts={};
  await ctx.route('**/api/share',async r=>{const b=JSON.parse(r.request().postData());calls.push(b);assert.equal(r.request().headers().authorization,'Bearer tok');
    if(b.action==='create'){const up=k=>`https://example.supabase.co/storage/v1/object/upload/sign/shares/AbCdEfGhIj/${k}?token=t`;return r.fulfill({json:{id:'AbCdEfGhIj',url:'https://kaleidotest.com/v/AbCdEfGhIj',uploads:{video:up('video.mp4'),poster:up('poster.jpg'),card:up('card.jpg')}}});}
    return r.fulfill({json:{deleted:1}});});
  await ctx.route('https://example.supabase.co/storage/**',async r=>{if(r.request().method()==='OPTIONS')return r.fulfill({status:204,headers:{'access-control-allow-origin':'*','access-control-allow-methods':'PUT','access-control-allow-headers':'*'}});
    const name=new URL(r.request().url()).pathname.split('/').pop();puts[name]={type:r.request().headers()['content-type'],body:r.request().postDataBuffer()};return r.fulfill({status:200,headers:{'access-control-allow-origin':'*'},json:{Key:name}});});
  await ctx.addInitScript(fake);
  await page.goto('http://127.0.0.1:4173/#home');await seed(page);
  await page.goto('http://127.0.0.1:4173/#results');await page.reload();
  // The app can land on the last question before the seeded answers are read; one more hash change opens the results.
  await page.waitForTimeout(1500);if(!/#results$/.test(page.url()))await page.evaluate(()=>{location.hash='#results';});
  await page.locator('#share-fab').waitFor({state:'attached',timeout:30000});
  await page.evaluate(()=>document.querySelectorAll('dialog[open]').forEach(d=>d.close()));
  const t0=Date.now();await page.evaluate(()=>document.querySelector('#share-fab').click());
  if(mobile){
    // Phones: Del goes straight to the phone's share sheet with the link, and no window of ours opens.
    await page.waitForFunction(()=>window.__shared.length>0,null,{timeout:15000});console.log(`share sheet after ${Date.now()-t0} ms`);
    assert.deepEqual((await page.evaluate(()=>window.__shared))[0],{url:'https://kaleidotest.com/v/AbCdEfGhIj',files:0});
    assert.equal(await page.evaluate(()=>document.querySelector('dialog#share-pop').open),false,'no second share window');
    assert.ok(calls.some(c=>c.action==='warm'),'the function is woken before the tap');
    for(let i=0;i<180&&!puts['video.mp4'];i++)await page.waitForTimeout(500);
    assert.ok(puts['video.mp4']&&puts['video.mp4'].body.length>100000,'the recorded video is uploaded');
    assert.ok(await page.locator('#share-send').isVisible(),'Share the video file stays on the page for Reels and TikTok');
    await page.evaluate(()=>document.querySelector('#share-fab').click());
    await page.waitForFunction(()=>window.__shared.length>1,null,{timeout:2000});
    assert.equal(calls.filter(c=>c.action==='create').length,1,'no second link');
    assert.equal(await page.evaluate(()=>document.querySelector('dialog#share-pop').open),false);
    if(process.env.SHOT)await page.screenshot({path:`${process.env.SHOT}-mobil.png`});
    assert.deepEqual(errors,[]);await ctx.close();console.log('share check mobile: ok');continue;}
  // The window opens at once with the app row; the link comes from the pictures, before the video is made.
  await page.locator('dialog#share-pop[open]').waitFor({timeout:2000});
  assert.ok(await page.locator('.d-app[data-app="messenger"]').isVisible(),'Messenger first in the app row');
  await page.waitForFunction(()=>!document.querySelector('.d-app[data-app="copy"]').disabled,null,{timeout:15000});
  console.log(`link ready after ${Date.now()-t0} ms`);
  assert.match(await page.textContent('.d-share-url'),/kaleidotest\.com\/v\/AbCdEfGhIj/);
  assert.ok(calls.some(c=>c.action==='warm'),'the function is woken before the tap');
  assert.ok(!puts['video.mp4'],'the link does not wait for the video');
  const create=calls.find(c=>c.action==='create');
  assert.equal(create.kind,'profile');assert.equal(create.lang,'no');assert.match(create.type,/^video\//);assert.ok(create.title,'profile name as title');
  assert.equal(puts['card.jpg'].type,'image/jpeg');
  const ids=await page.$$eval('.d-apps:not(.d-apps-actions) .d-app',b=>b.map(x=>x.dataset.app));
  assert.deepEqual(ids.slice(0,6),['messenger','snapchat','instagram','whatsapp','facebook','tiktok']);
  if(mobile)assert.ok(ids.includes('sms'));
  await page.evaluate(()=>{window.__opened=[];window.open=u=>{window.__opened.push(u);return null;};});
  if(!mobile){await page.click('.d-app[data-app="facebook"]');assert.match((await page.evaluate(()=>window.__opened)).at(-1),/sharer\.php\?u=https%3A%2F%2Fkaleidotest\.com%2Fv%2FAbCdEfGhIj/);}
  else{await page.click('.d-app[data-app="more"]');assert.deepEqual((await page.evaluate(()=>window.__shared)).at(-1),{url:'https://kaleidotest.com/v/AbCdEfGhIj',files:0},'More opens the phone share sheet with the link');}
  if(process.env.SHOT)await page.screenshot({path:`${process.env.SHOT}-vindu-${mobile?'mobil':'pc'}.png`});
  // The video uploads in the background once it is made.
  for(let i=0;i<180&&!puts['video.mp4'];i++)await page.waitForTimeout(500);
  assert.ok(puts['video.mp4']&&puts['video.mp4'].body.length>100000,'the recorded video is uploaded');
  await page.waitForFunction(()=>!document.querySelector('#share-up')?.textContent,null,{timeout:10000});
  await page.waitForFunction(()=>!document.querySelector('.d-app[data-app="save"]').disabled);
  if(mobile){await page.click('.d-app[data-app="instagram"]');assert.equal((await page.evaluate(()=>window.__shared)).at(-1).files,1,'Instagram gets the video file');
    await page.click('.d-share-pop-close');await page.evaluate(()=>document.querySelector('#share-fab').click());
    await page.waitForFunction(()=>!document.querySelector('.d-app[data-app="copy"]').disabled,null,{timeout:2000});
    assert.equal(calls.filter(c=>c.action==='create').length,1,'no second link');}
  if(process.env.SHOT){fs.writeFileSync(`${process.env.SHOT}-card.jpg`,puts['card.jpg'].body);fs.writeFileSync(`${process.env.SHOT}-poster.jpg`,puts['poster.jpg'].body);}
  page.once('dialog',d=>d.accept());await page.click('#share-unlink');
  await page.waitForFunction(()=>!document.querySelector('dialog#share-pop').open);
  assert.deepEqual(calls.at(-1),{action:'delete',id:'AbCdEfGhIj'});
  assert.deepEqual(errors,[]);
  await ctx.close();console.log(`share check ${mobile?'mobile':'desktop'}: ok`);}
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
