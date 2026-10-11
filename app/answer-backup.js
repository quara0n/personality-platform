import {INSTRUMENT_VERSION} from './scoring.js';

/** Portable raw answers let newer reports reuse the same assessment. */
export function encodeAnswers(answers,index){
  return JSON.stringify({format:'fem-answers-v1',instrumentVersion:INSTRUMENT_VERSION,answers,index},null,2);
}

export function decodeAnswers(text,questions){
  const saved=JSON.parse(text);
  if(saved?.format!=='fem-answers-v1'||saved.instrumentVersion!==INSTRUMENT_VERSION||
    !saved.answers||typeof saved.answers!=='object'||Array.isArray(saved.answers)||
    !Number.isInteger(saved.index)||saved.index<0||saved.index>=questions.length)throw Error('Invalid answer backup');
  const ids=new Set(questions.map(q=>String(q.id))),entries=Object.entries(saved.answers);
  if(!entries.length||entries.some(([id,value])=>!ids.has(id)||!Number.isInteger(value)||value<1||value>5))throw Error('Invalid answers');
  return {answers:Object.fromEntries(entries),index:saved.index};
}
