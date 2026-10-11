import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {scoreAssessment,createReport} from '../app/scoring.js';
const questions=JSON.parse(readFileSync(new URL('../app/data/questions.json',import.meta.url)));
const answersFor=fn=>Object.fromEntries(questions.map(q=>[q.id,fn(q)]));
test('neutral responses produce 72 per domain and 12 per facet, not percentiles',()=>{
  const result=scoreAssessment(questions,answersFor(()=>3));
  assert.equal(result.domains.length,5);
  for(const d of result.domains){assert.equal(d.sum,72);assert.equal(d.mean,3);assert.equal(d.position,50);assert.equal(d.band,'middle');assert.equal(d.facets.length,6);for(const f of d.facets)assert.equal(f.sum,12);assert.ok(!('percentile' in d));}
});
test('keyed endpoint profiles give exactly minimum and maximum scores',()=>{
  for(const [value,expected] of [[false,1],[true,5]]){
    const r=scoreAssessment(questions,answersFor(q=>(q.keyed==='plus')===value?5:1));
    for(const d of r.domains){assert.equal(d.mean,expected);assert.equal(d.sum,24*expected);for(const f of d.facets)assert.equal(f.sum,4*expected);}
  }
});
test('all inaccurate differs from low profile and reverses minus items',()=>{
  const r=scoreAssessment(questions,answersFor(()=>1));
  assert.equal(r.domains.find(d=>d.code==='N').facets.find(f=>f.code==='N1').sum,4);
  assert.equal(r.domains.find(d=>d.code==='A').facets.find(f=>f.code==='A2').sum,20);
});
test('missing, out-of-range and extra answers are rejected',()=>{
  for(const val of [undefined,0,6,2.5,'3',null,NaN]){const a=answersFor(()=>3);a[questions[0].id]=val;assert.throws(()=>scoreAssessment(questions,a));}
  assert.throws(()=>scoreAssessment(questions,{...answersFor(()=>3),unknown:3}));
});
test('invalid instrument shape is rejected',()=>{
  assert.throws(()=>scoreAssessment(questions.slice(1),answersFor(()=>3)));
  const altered=structuredClone(questions);altered[1].id=altered[0].id;assert.throws(()=>scoreAssessment(altered,answersFor(()=>3)));
});
test('Norwegian items preserve identifiers, keys and scores',()=>{
  const no=JSON.parse(readFileSync(new URL('../app/data/questions-no.json',import.meta.url)));
  assert.deepEqual(no.map(({id,keyed,domain,facet})=>({id,keyed,domain,facet})),questions.map(({id,keyed,domain,facet})=>({id,keyed,domain,facet})));
  assert.deepEqual(scoreAssessment(no,answersFor(()=>3)),scoreAssessment(questions,answersFor(()=>3)));
});
test('editorial boundaries use unrounded means and both report languages have complete content',()=>{
  for(const locale of ['','-no']){
    const content=JSON.parse(readFileSync(new URL(`../app/data/report-content${locale}.json`,import.meta.url)));
    assert.equal(Object.keys(content.domains).length,5);assert.equal(Object.keys(content.facets).length,30);
    for(const d of Object.values(content.domains))for(const b of ['low','middle','high'])for(const field of ['meaning','strength','watch','work','life','experiment'])assert.ok(d[b][field]?.length>20);
    for(const f of Object.values(content.facets))for(const field of ['name','description','low','middle','high','work','life'])assert.ok(f[field]?.length>0);
    for(const [sum,band] of [[59,'low'],[60,'middle'],[84,'middle'],[85,'high']]){
      let remaining=sum-24;
      const a=answersFor(q=>{if(q.domain!=='O')return 3;const value=1+Math.min(4,remaining);remaining-=value-1;return q.keyed==='plus'?value:6-value;});
      const r=createReport(scoreAssessment(questions,a),content),d=r.domains.find(d=>d.code==='O');
      assert.equal(d.band,band);assert.equal(d.sum,sum);assert.equal(d.content.meaning,content.domains.O[band].meaning);
      assert.ok(d.ruleId.endsWith(`/O/${band}`));assert.deepEqual(r.limitations,content.limitations);
    }
  }
});

test('equal domain means retain different facet patterns and advice',()=>{
  for(const locale of ['','-no']){
    const content=JSON.parse(readFileSync(new URL(`../app/data/report-content${locale}.json`,import.meta.url)));
    const profile=values=>createReport(scoreAssessment(questions,answersFor(q=>{
      const value=q.domain==='E'?values[q.facet-1]:3;
      return q.keyed==='minus'?6-value:value;
    })),content);
    const a=profile([5,1,4,2,3,3]),b=profile([1,5,2,4,3,3]);
    const ea=a.domains.find(d=>d.code==='E'),eb=b.domains.find(d=>d.code==='E');
    assert.equal(ea.mean,eb.mean);
    assert.equal(ea.pattern.high.code,'E1');assert.equal(ea.pattern.low.code,'E2');
    assert.equal(eb.pattern.high.code,'E2');assert.equal(eb.pattern.low.code,'E1');
    assert.notEqual(ea.pattern.text,eb.pattern.text);
    assert.notDeepEqual(a.nextSteps,b.nextSteps);
    assert.ok(a.nextSteps.some(f=>f.code==='E1'));
    assert.ok(ea.facets.every(f=>f.interpretation&&f.ruleId));
  }
});

test('neutral profile does not invent distinctive facets and all 30 middle interpretations exist',()=>{
  for(const locale of ['','-no']){
    const content=JSON.parse(readFileSync(new URL(`../app/data/report-content${locale}.json`,import.meta.url)));
    const r=createReport(scoreAssessment(questions,answersFor(()=>3)),content);
    assert.equal(r.nextSteps.length,0);
    for(const d of r.domains){assert.equal(d.pattern.mixed,false);for(const f of d.facets)assert.equal(f.interpretation,content.facets[f.code].middle);}
  }
});
