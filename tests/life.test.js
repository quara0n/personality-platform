import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {questions, rules, goalSteps, SECTIONS, LIMIT, buildLife, lifeRequest, visibleQuestions, isComplete, optionLabel, answerTopic} from '../app/life-copy.js';
import {validateRequest, checkOutput, handleCareerRequest} from '../lib/career-llm.js';
import {scoreAssessment} from '../app/scoring.js';
import {applyNorms, sampleAnswers} from '../app/norms.js';

const facetCodes = ['N', 'E', 'O', 'A', 'C'].flatMap(d => [1, 2, 3, 4, 5, 6].map(i => `${d}${i}`));
const profile = (overrides = {}) => ['N', 'E', 'O', 'A', 'C'].map(code => ({code, percentile: 50, band: 'middle', facets: [1, 2, 3, 4, 5, 6].map(i => {
  const c = `${code}${i}`, p = overrides[c] ?? 50;
  return {code: c, name: c, percentile: p, mean: 3, band: p < 30 ? 'low' : p > 70 ? 'high' : 'middle'};
})}));
const answers = {household: 'family', kids: ['small'], focus: 'partner', social: 'few', conflict: 'givein', week: 'packed', drains: ['metime', 'tension'], energy: ['alone', 'close'], goal: 'closer'};
const items = life => life.sections.flatMap(s => s.items);

test('every rule names a real question, option, section and facet, written in both languages', () => {
  for (const r of rules) {
    const q = questions.find(x => x.id === r.q);
    assert.ok(q, r.q);
    for (const v of r.v) assert.ok(q.options.some(o => o[0] === v), `${r.q}=${v}`);
    assert.ok(SECTIONS.includes(r.section) && r.section !== 'next', r.section);
    assert.ok(facetCodes.includes(r.facet), r.facet);
    assert.ok(['high', 'low'].includes(r.dir));
    assert.ok(r.text[0] && r.text[1] && r.text[0] !== r.text[1], `${r.section} ${r.q} ${r.facet}`);
    assert.ok(r.try[0] && r.try[1], `${r.section} ${r.q} ${r.facet} has something to try`);
  }
  for (const [goal, plan] of Object.entries(goalSteps)) {
    assert.ok(questions.find(q => q.id === 'goal').options.some(o => o[0] === goal), goal);
    assert.equal(plan.general.length, 3, goal);
  }
  assert.ok(rules.length >= 90, `${rules.length} rules`);
});

test('the text describes facets in plain words, never as a verdict or with em dashes', () => {
  const names = JSON.parse(readFileSync(new URL('../app/data/report-content.json', import.meta.url))).facets;
  const all = [...rules.flatMap(r => [...r.text, ...r.try]), ...Object.values(goalSteps).flatMap(p => [...p.facet.flatMap(s => s.text), ...p.general.flat()])];
  for (const t of all) {
    assert.ok(!t.includes('—'), t);
    for (const f of Object.values(names)) assert.ok(!new RegExp(`\\b${f.name} is (high|low)`).test(t), t);
  }
});

test('the children question shows only with children, and a hidden answer no longer counts', () => {
  assert.equal(visibleQuestions({household: 'partner'}).length, 8);
  assert.equal(visibleQuestions({household: 'family'}).length, 9);
  assert.ok(isComplete(answers));
  assert.ok(!isComplete({...answers, kids: undefined}));
  assert.ok(!isComplete({...answers, drains: ['metime', 'tension', 'rest']}));
  const noKids = {...answers, household: 'partner'};
  assert.ok(isComplete(noKids));
  const life = buildLife(profile({N2: 90, E4: 15}), noKids, 'en');
  assert.ok(!items(life).some(x => x.answers.some(a => a.q === 'kids')), 'no children rules without children');
  assert.ok(!lifeRequest(life, profile(), noKids, 'en').answers.some(a => a.q === 'kids'));
});

test('every answer has a short headline in both languages, «Other» uses the reader\'s text', () => {
  for (const q of questions) for (const [v] of q.options) {
    assert.ok(answerTopic(q.id, v, 'en') && answerTopic(q.id, v, 'no'), `${q.id}=${v}`);
    assert.ok(answerTopic(q.id, v, 'no').length <= 32, `${q.id}=${v} is short`);
  }
  assert.equal(answerTopic('goal', 'other', 'no', {other: {goal: 'flytte nærmere familien'}}), 'Flytte nærmere familien');
  assert.equal(optionLabel('goal', 'other', 'no', {other: {goal: '  flytte  '}}), 'Annet: flytte');
});

test('a middle-only profile gets no facet claims, only situation lines and general steps', () => {
  const life = buildLife(profile(), answers, 'no');
  for (const x of items(life)) assert.equal(x.facets.length, 0, x.ruleId);
  assert.equal(life.sections.find(s => s.id === 'next').items.length, 3);
  assert.equal(life.sections.find(s => s.id === 'drain').items.length, 2, 'one situation line per drain');
});

test('facet claims use facets outside the middle in the rule direction, within the limits, told once', () => {
  const life = buildLife(profile({A4: 88, E3: 20, A1: 18, N6: 85, E2: 12, N2: 80, C2: 85}), answers, 'en');
  for (const s of life.sections) assert.ok(s.items.length <= LIMIT[s.id] + 2, s.id);
  for (const x of items(life)) for (const f of x.facets) assert.notEqual(f.band, 'middle', x.ruleId);
  const by = id => life.sections.find(s => s.id === id).items;
  assert.ok(by('close').some(x => x.ruleId === 'life-close-focus-partner-A1-low'));
  assert.ok(by('conflict').some(x => x.ruleId === 'life-conflict-conflict-givein-A4-high'));
  // Across helps, harder, close and disagreements a facet is explained once.
  const story = ['good', 'hard', 'close', 'conflict'].flatMap(by).flatMap(x => x.facets.map(f => f.code));
  assert.equal(new Set(story).size, story.length);
  // Both drains get a facet line before either gets a second one.
  assert.deepEqual(new Set(by('drain').slice(0, 2).map(x => x.answers[0].value)), new Set(['metime', 'tension']));
});

test('most realistic profiles get a full chapter', () => {
  const app = new URL('../app/', import.meta.url);
  const q = JSON.parse(readFileSync(new URL('data/questions.json', app)));
  const norms = JSON.parse(readFileSync(new URL('data/norms-us.json', app)));
  let seed = 11;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647, one = a => a[Math.floor(rand() * a.length)];
  const n = 400, counts = {top: 0, close: 0, visible: 0};
  for (let i = 0; i < n; i++) {
    const domains = applyNorms(scoreAssessment(q, sampleAnswers(q, norms, rand)), norms).domains, a = {};
    for (let next; (next = visibleQuestions(a).find(x => !a[x.id]));) {
      const opts = next.options.map(o => o[0]).filter(o => o !== 'other');
      a[next.id] = next.multi ? [...new Set([one(opts), one(opts)])] : one(opts);
    }
    const life = buildLife(domains, a, 'no'), by = id => life.sections.find(s => s.id === id).items.filter(x => x.facets.length).length;
    if (by('good') + by('hard') >= 2) counts.top++;
    if (by('close') >= 2) counts.close++;
    if (by('good') + by('hard') + by('close') + by('conflict') >= 4) counts.visible++;
  }
  assert.ok(counts.top / n >= 0.8, `helps + harder ≥ 2 for ${counts.top} of ${n}`);
  assert.ok(counts.close / n >= 0.7, `close ≥ 2 for ${counts.close} of ${n}`);
  assert.ok(counts.visible / n >= 0.85, `≥ 4 points on the chapter's front for ${counts.visible} of ${n}`);
});

test('the server request validates as the life chapter, and the output check drops anything not sent', () => {
  const domains = profile({A1: 18, A4: 88});
  const life = buildLife(domains, answers, 'no'), req = lifeRequest(life, domains, answers, 'no');
  assert.equal(req.chapter, 'life');
  assert.equal(validateRequest(req), '');
  assert.notEqual(validateRequest({...req, chapter: 'dating'}), '');
  assert.notEqual(validateRequest({...req, chapter: undefined}), '', 'life sections are not valid in the job chapter');
  const checked = checkOutput({sections: [{id: 'close', items: [
    {text: 'Ok.', try: '', facets: ['A1'], answers: ['focus']},
    {text: 'Invented.', try: '', facets: ['N1'], answers: []}]}]}, req);
  assert.deepEqual(checked.find(s => s.id === 'close').items.map(x => x.text), ['Ok.']);
  assert.equal(checked.find(s => s.id === 'conflict').source, 'rules');
});

test('without an API key the endpoint says AI writing is off', async () => {
  const domains = profile();
  const r = await handleCareerRequest(lifeRequest(buildLife(domains, answers, 'en'), domains, answers, 'en'), {});
  assert.equal(r.status, 503);
});
