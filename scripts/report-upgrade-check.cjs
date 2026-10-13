const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const questions=JSON.parse(fs.readFileSync('app/data/questions.json','utf8'));
const answers=Object.fromEntries(questions.map(q=>{
  const value=q.domain==='E'?[5,1,4,2,3,3][q.facet-1]:3;
  return [q.id,q.keyed==='minus'?6-value:value];
}));
(async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const context=await browser.newContext({viewport:{width:1440,height:1000},locale:'en-US',acceptDownloads:true});
    const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:4173');await page.locator('.hero').waitFor();
    await page.evaluate(answers=>sessionStorage.setItem('five-assessment-v1',JSON.stringify({answers,index:119})),answers);
    await page.reload();await page.locator('.hero').waitFor();
    await page.goto('http://127.0.0.1:4173/#report');await page.locator('.d-report-body').waitFor();
    assert.equal(await page.locator('.facet').count(),30);
    const ePattern=await page.locator('.d-trait-chapter').filter({hasText:'Extraversion'}).locator('.facet-pattern').textContent();
    assert.ok(/Friendliness is highest \(percentile \d+\) and Gregariousness is lowest \(percentile \d+\)/.test(ePattern),ePattern);
    assert.equal(await page.locator('.step').count(),3);
    const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#report-save').click()]);
    const backup=fs.readFileSync(await download.path(),'utf8');assert.deepEqual(JSON.parse(backup).answers,answers);
    const restored=await context.newPage();await restored.goto('http://127.0.0.1:4173');await restored.locator('.hero').waitFor();
    await restored.locator('#backup-restore').setInputFiles({name:'fem-answers.json',mimeType:'application/json',buffer:Buffer.from(backup)});
    await restored.locator('.d-report-body').waitFor();assert.equal(await restored.locator('.facet').count(),30);
    assert.deepEqual(await restored.evaluate(()=>JSON.parse(sessionStorage.getItem('five-assessment-v1')).answers),answers);
    await restored.reload();await restored.locator('.d-report-body').waitFor();
    await restored.locator('#header-language').selectOption('no');
    await restored.getByRole('heading',{name:'Nyansene bak skårene',exact:true}).waitFor();
    const ePatternNo=await restored.locator('.d-trait-chapter').filter({hasText:'Ekstroversjon'}).locator('.facet-pattern').textContent();
    assert.ok(/Vennlighet høyest \(\d+\. persentil\) og Selskapelighet lavest/.test(ePatternNo),ePatternNo);
    await restored.goto('http://127.0.0.1:4173/#report/traits');await restored.locator('.d-tlogo-name').first().click();await restored.locator('.d-tlpanel:not([hidden]) .facet-pattern').waitFor();
    fs.mkdirSync('artifacts',{recursive:true});
    await restored.locator('#traits').scrollIntoViewIfNeeded();
    await restored.screenshot({path:'artifacts/report-upgraded-desktop.png'});
    await restored.pdf({path:'artifacts/report-upgraded-no.pdf',format:'A4',printBackground:true});
    await restored.setViewportSize({width:390,height:844});
    assert.ok(await restored.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await restored.locator('.d-tlpanel:not([hidden]) .facet-pattern').scrollIntoViewIfNeeded();
    await restored.screenshot({path:'artifacts/report-upgraded-mobile.png'});
    await restored.locator('#backup-restore').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{"answers":{}}')});
    await restored.getByText('Filen er ikke en gyldig Fem-svarkopi. Svarene dine er ikke endret.',{exact:true}).waitFor();
    assert.deepEqual(await restored.evaluate(()=>JSON.parse(sessionStorage.getItem('five-assessment-v1')).answers),answers);
    // Delay a real file read to prove that clearing wins over an older import.
    await restored.evaluate(()=>{
      const original=File.prototype.text;
      File.prototype.text=function(){const file=this;return new Promise(resolve=>{window.finishBackupRead=async()=>resolve(await original.call(file));});};
    });
    await restored.locator('#backup-restore').setInputFiles({name:'delayed.json',mimeType:'application/json',buffer:Buffer.from(backup)});
    await restored.waitForFunction(()=>typeof window.finishBackupRead==='function');
    restored.once('dialog',dialog=>dialog.accept());
    await restored.locator('#clear-data').click();await restored.locator('.hero').waitFor();
    await restored.evaluate(async()=>{await window.finishBackupRead();await new Promise(resolve=>requestAnimationFrame(resolve));});
    assert.equal(await restored.evaluate(()=>sessionStorage.getItem('five-assessment-v1')),null,'Clear must cancel an older pending import');
    await restored.locator('.hero').waitFor();
    // With norms, all-3 answers are not neutral; aim each facet at the sum closest to the 50th percentile.
    const norms=JSON.parse(fs.readFileSync('app/data/norms-us.json','utf8')),neutral={};
    for(const code of [...new Set(questions.map(q=>q.domain+q.facet))]){
      const scale=norms.scales[code],pct=x=>100*(x.below+0.5*x.count)/scale.n;
      let left=scale.lookup.reduce((a,b)=>Math.abs(pct(b)-50)<Math.abs(pct(a)-50)?b:a).sum;
      const items=questions.filter(q=>q.domain+q.facet===code);
      items.forEach((q,i)=>{const value=Math.ceil(left/(items.length-i));left-=value;neutral[q.id]=q.keyed==='minus'?6-value:value;});
    }
    await restored.locator('#backup-restore').setInputFiles({name:'older.json',mimeType:'application/json',buffer:Buffer.from(backup)});
    await restored.evaluate(()=>{window.olderBackupRead=window.finishBackupRead;});
    const newer=JSON.stringify({...JSON.parse(backup),answers:neutral});
    await restored.locator('#backup-restore').setInputFiles({name:'newer.json',mimeType:'application/json',buffer:Buffer.from(newer)});
    await restored.evaluate(async()=>{await window.finishBackupRead();await new Promise(resolve=>requestAnimationFrame(resolve));});
    await restored.locator('.d-report-body').waitFor();
    await restored.evaluate(async()=>{await window.olderBackupRead();await new Promise(resolve=>requestAnimationFrame(resolve));});
    assert.deepEqual(await restored.evaluate(()=>JSON.parse(sessionStorage.getItem('five-assessment-v1')).answers),neutral,'A newer import must win over an older delayed read');
    await restored.reload();await restored.locator('.d-report-body').waitFor();
    assert.equal(await restored.locator('.step').count(),0);
    assert.equal(await restored.locator('.d-step.is-explore').count(),3);
    assert.ok((await restored.locator('#steps').textContent()).includes('Fremfor å finne på tre'));
    assert.deepEqual(errors,[]);
    console.log('PASS: facet contrasts, 30 interpretations, facet actions, answer-file download/restore/reload, bilingual report, invalid import preserves answers, neutral report, desktop/mobile/PDF.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
