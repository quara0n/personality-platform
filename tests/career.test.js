import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {questions, rules, buildCareer, careerRequest, isComplete} from '../app/career-copy.js';
import {validateRequest, checkOutput, handleCareerRequest} from '../lib/career-llm.js';
import {profileAnswers, RUNE_TARGETS} from '../app/dev-profile.js';
import {scoreAssessment} from '../app/scoring.js';
import {applyNorms} from '../app/norms.js';

const facetCodes = ['N', 'E', 'O', 'A', 'C'].flatMap(d => [1, 2, 3, 4, 5, 6].map(i => `${d}${i}`));
const profile = (overrides = {}) => ['N', 'E', 'O', 'A', 'C'].map(code => ({code, percentile: 50, band: 'middle', facets: [1, 2, 3, 4, 5, 6].map(i => {
  const c = `${code}${i}`, p = overrides[c] ?? 50;
  return {code: c, name: c, percentile: p, mean: 3, band: p < 30 ? 'low' : p > 70 ? 'high' : 'middle'};
})}));
const answers = {role: 'care', lead: 'informal', with: 'clients', structure: 'mixed', pressure: 'peaks', drains: ['routine', 'overload'], energy: ['help', 'learn'], goal: 'change'};

test('every rule names a real question, option and facet in both languages', () => {
  for (const r of rules) {
    const q = questions.find(x => x.id === r.q);
    assert.ok(q, r.q);
    for (const v of r.v) assert.ok(q.options.some(o => o[0] === v), `${r.q}=${v}`);
    assert.ok(facetCodes.includes(r.facet), r.facet);
    assert.ok(['high', 'low'].includes(r.dir));
    assert.ok(r.text[0] && r.text[1] && r.text[0] !== r.text[1]);
  }
});

test('completeness requires every answer and at most two choices on multi questions', () => {
  assert.ok(isComplete(answers));
  assert.ok(!isComplete({...answers, goal: undefined}));
  assert.ok(!isComplete({...answers, drains: ['routine', 'overload', 'judged']}));
});

test('a middle-only profile gets no facet claims, only situation lines and general steps', () => {
  const c = buildCareer(profile(), answers, 'no');
  for (const s of c.sections) for (const x of s.items) assert.equal(x.facets.length, 0, x.ruleId);
  assert.equal(c.sections.find(s => s.id === 'next').items.length, 3);
});

test('facet claims only use facets outside the middle, in the rule direction, and keep their answer', () => {
  const c = buildCareer(profile({A3: 85, O4: 90, C2: 20, N6: 15, A6: 80}), answers, 'en');
  const all = c.sections.flatMap(s => s.items);
  for (const x of all) for (const f of x.facets) assert.notEqual(f.band, 'middle', x.ruleId);
  assert.ok(all.some(x => x.ruleId === 'career-good-with-clients-A3-high'));
  // Both drains get a facet line before either gets a second one.
  const drains = c.sections.find(s => s.id === 'drain').items;
  assert.deepEqual(new Set(drains.map(x => x.answers[0].value)), new Set(['routine', 'overload']));
  assert.ok(c.sections.some(s => s.id === 'lead') && c.sections.some(s => s.id === 'lookfor'));
});

test('the server request validates, and the output check drops anything not sent', () => {
  const domains = profile({A3: 85, O4: 90});
  const c = buildCareer(domains, answers, 'no'), req = careerRequest(c, domains, answers, 'no');
  assert.equal(validateRequest(req), '');
  assert.notEqual(validateRequest({...req, language: 'de'}), '');
  assert.notEqual(validateRequest({...req, email: 'x'.repeat(40000)}), '');
  const good = c.sections.find(s => s.id === 'good');
  const checked = checkOutput({sections: [{id: 'good', items: [
    {text: 'Ok.', try: '', facets: ['A3'], answers: ['with']},
    {text: 'Invented.', try: '', facets: ['N1'], answers: []},
    {text: 'Uncited.', try: '', facets: [], answers: []}]}]}, req);
  assert.deepEqual(checked.find(s => s.id === 'good').items.map(x => x.text), ['Ok.']);
  // A section the model skipped falls back to the drafts.
  const drain = checked.find(s => s.id === 'drain');
  assert.equal(drain.source, 'rules');
  assert.equal(drain.items.length, c.sections.find(s => s.id === 'drain').items.length);
  assert.ok(good.items.length >= 1);
});

test('without an API key the endpoint says AI writing is off', async () => {
  const domains = profile();
  const c = buildCareer(domains, answers, 'en');
  const r = await handleCareerRequest(careerRequest(c, domains, answers, 'en'), {});
  assert.equal(r.status, 503);
});

test('Rune’s test profile lands close to the targets', () => {
  const app = new URL('../app/', import.meta.url);
  const q = JSON.parse(readFileSync(new URL('data/questions.json', app)));
  const norms = JSON.parse(readFileSync(new URL('data/norms-us.json', app)));
  const r = applyNorms(scoreAssessment(q, profileAnswers(q, norms)), norms);
  for (const d of r.domains) assert.ok(Math.abs(d.percentile - RUNE_TARGETS[d.code]) <= 10, `${d.code} ${d.percentile}`);
  const o = r.domains.find(d => d.code === 'O');
  assert.equal(o.band, 'high');
});
