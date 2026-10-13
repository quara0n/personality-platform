import test from 'node:test';
import assert from 'node:assert/strict';
import {questions, rules, tailor, isComplete, visibleQuestions, TAILOR_VERSION} from '../app/tailored-copy.js';

const facetCodes = ['N', 'E', 'O', 'A', 'C'].flatMap(d => [1, 2, 3, 4, 5, 6].map(i => `${d}${i}`));
const profile = (overrides = {}) => ['N', 'E', 'O', 'A', 'C'].map(code => ({code, facets: [1, 2, 3, 4, 5, 6].map(i => {
  const c = `${code}${i}`, p = overrides[c] ?? 50;
  return {code: c, name: c, percentile: p, mean: 3, band: p < 30 ? 'low' : p > 70 ? 'high' : 'middle'};
})}));

test('every question and option has both languages', () => {
  for (const chapter of ['work', 'life']) for (const q of questions[chapter]) {
    assert.equal(q.q.length, 2);
    assert.notEqual(q.q[0], q.q[1]);
    for (const o of q.options) assert.ok(o[1] && o[2], `${chapter}/${q.id}/${o[0]}`);
  }
});

test('every rule names a real facet, real answers and two directions in both languages', () => {
  const ids = new Set();
  for (const r of rules) {
    assert.ok(facetCodes.includes(r.f), r.id);
    assert.ok(!ids.has(`${r.ch}/${r.id}`), `duplicate ${r.ch}/${r.id}`);
    ids.add(`${r.ch}/${r.id}`);
    for (const [qid, values] of Object.entries(r.when)) {
      const q = questions[r.ch].find(x => x.id === qid);
      assert.ok(q, `${r.id}: ${qid}`);
      for (const v of values) assert.ok(q.options.some(o => o[0] === v), `${r.id}: ${qid}=${v}`);
    }
    for (const band of ['high', 'low']) {
      const c = r[band];
      assert.ok(['help', 'hard'].includes(c.kind), `${r.id}/${band}`);
      for (const field of ['text', 'try']) {
        assert.equal(c[field].length, 2);
        assert.ok(c[field].every(s => s.trim().length > 10), `${r.id}/${band}/${field}`);
        assert.notEqual(c[field][0], c[field][1]);
      }
    }
  }
});

test('the children question only counts when the household has children', () => {
  assert.deepEqual(visibleQuestions('life', {household: 'alone'}).map(q => q.id), ['household', 'week', 'wish']);
  assert.ok(visibleQuestions('life', {household: 'family'}).some(q => q.id === 'kids'));
  assert.ok(isComplete('life', {household: 'alone', week: 'room', wish: 'calm'}));
  assert.ok(!isComplete('life', {household: 'family', week: 'room', wish: 'calm'}));
  const t = tailor(profile({C2: 95}), 'life', {household: 'alone', kids: 'small', week: 'room', wish: 'calm'}, 'en');
  assert.ok(![...t.helps, ...t.hard].some(l => l.ruleId.includes('kids-')));
});

test('a low facet that meets a demanding answer becomes a harder line with a traceable rule', () => {
  const t = tailor(profile({E2: 8}), 'work', {role: 'knowledge', people: 'people', structure: 'mixed', pressure: 'calm'}, 'no');
  assert.equal(t.hard.length, 1);
  assert.equal(t.hard[0].facet.code, 'E2');
  assert.equal(t.hard[0].ruleId, `${TAILOR_VERSION}/work/people-E2/low`);
  assert.equal(t.hard[0].because, 'Mest med folk');
  assert.equal(t.helps.length, 0);
});

test('middle facets give no lines, and the most pronounced facets come first', () => {
  const answers = {role: 'lead', people: 'people', structure: 'shifting', pressure: 'high'};
  assert.deepEqual(tailor(profile(), 'work', answers, 'en'), {helps: [], hard: []});
  const t = tailor(profile({E3: 75, O4: 97, N1: 90, N6: 99, C2: 85}), 'work', answers, 'en');
  assert.deepEqual(t.helps.map(l => l.facet.code), ['O4', 'E3']);
  assert.deepEqual(t.hard.map(l => l.facet.code), ['N6', 'N1', 'C2']);
});

test('one facet appears once per chapter, from the first matching rule', () => {
  const t = tailor(profile({E2: 90}), 'life', {household: 'alone', week: 'room', wish: 'energy'}, 'en');
  const e2 = [...t.helps, ...t.hard].filter(l => l.facet.code === 'E2');
  assert.equal(e2.length, 1);
  assert.match(e2[0].ruleId, /life\/alone-E2\/high$/);
});
