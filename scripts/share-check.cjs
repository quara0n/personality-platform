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
  await page.evaluate(()=>document.querySelector('#share-fab').click());
  await page.waitForFunction(()=>!document.querySelector('#share-out').hidden,null,{timeout:90000});
  const create=calls.find(c=>c.action==='create');
  assert.equal(create.kind,'profile');assert.equal(create.lang,'no');assert.match(create.type,/^video\//);assert.ok(create.title,'profile name as title');
  assert.deepEqual(Object.keys(puts).sort(),['card.jpg','poster.jpg','video.mp4']);
  assert.equal(puts['card.jpg'].type,'image/jpeg');assert.ok(puts['video.mp4'].body.length>100000,'the recorded video is uploaded');
  assert.equal(await page.inputValue('#share-link'),'https://kaleidotest.com/v/AbCdEfGhIj');
  assert.match(await page.getAttribute('.d-share-facebook','href'),/u=https%3A%2F%2Fkaleidotest\.com%2Fv%2FAbCdEfGhIj/);
  if(mobile){assert.equal(await page.locator('#share-file').count(),1,'Reels/TikTok share the file on a phone');
    const shared=await page.evaluate(()=>window.__shared);assert.ok(shared.length<=1);
    await page.evaluate(()=>document.querySelector('#share-fab').click());
    assert.deepEqual((await page.evaluate(()=>window.__shared)).at(-1),{url:'https://kaleidotest.com/v/AbCdEfGhIj',files:0},'a second tap shares the same link');
    assert.equal(calls.filter(c=>c.action==='create').length,1,'no second upload');}
  else assert.equal(await page.locator('.d-share-instagram').count(),1);
  if(process.env.SHOT){fs.writeFileSync(`${process.env.SHOT}-card.jpg`,puts['card.jpg'].body);fs.writeFileSync(`${process.env.SHOT}-poster.jpg`,puts['poster.jpg'].body);
    await page.locator('.d-share-body').screenshot({path:`${process.env.SHOT}-${mobile?'mobil':'pc'}.png`});}
  page.once('dialog',d=>d.accept());await page.click('#share-unlink');
  await page.waitForFunction(()=>!document.querySelector('#share-link'));
  assert.deepEqual(calls.at(-1),{action:'delete',id:'AbCdEfGhIj'});
  assert.deepEqual(errors,[]);
  await ctx.close();console.log(`share check ${mobile?'mobile':'desktop'}: ok`);}
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
