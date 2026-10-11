import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {encodeAnswers,decodeAnswers} from '../app/answer-backup.js';
const questions=JSON.parse(readFileSync(new URL('../app/data/questions.json',import.meta.url)));
test('partial and completed answers survive a portable backup without report or locale coupling',()=>{
  for(const count of [1,120]){
    const answers=Object.fromEntries(questions.slice(0,count).map((q,i)=>[q.id,i%5+1]));
    const restored=decodeAnswers(encodeAnswers(answers,count-1),questions);
    assert.deepEqual(restored,{answers,index:count-1});
  }
});
test('wrong instrument and invalid answers cannot replace a saved session',()=>{
  const valid=JSON.parse(encodeAnswers({[questions[0].id]:3},0));
  for(const mutation of [s=>s.instrumentVersion='other',s=>s.answers.unknown=3,s=>s.answers[questions[0].id]=6,s=>s.answers={},s=>s.index=120]){
    const value=structuredClone(valid);mutation(value);assert.throws(()=>decodeAnswers(JSON.stringify(value),questions));
  }
  assert.throws(()=>decodeAnswers('not json',questions));
});
