import test from 'node:test';
import assert from 'node:assert/strict';
import {videoScript, closers} from '../app/share-video.js';

const f = (code, p, extra = {}) => ({code, percentile: p, band: p < 30 ? 'low' : p > 70 ? 'high' : 'middle', ...extra});
const profile = ps => Object.entries(ps).map(([code, p]) => ({...f(code, p), facets: [f(`${code}1`, 50, {name: `${code} facet`})]}));
const name = d => ({O: 'Openness', C: 'Conscientiousness', E: 'Extraversion', A: 'Agreeableness', N: 'Emotional reactivity'})[d.code];

test('names the person, the profile name and the trait furthest from the middle', () => {
  const s = videoScript(profile({O: 92, C: 81, E: 45, A: 60, N: 35}), {language: 'en', firstName: '  Rune Hansen ', name});
  assert.equal(s.hook, 'Who is Rune, really?');
  assert.equal(s.intro, 'Rune is');
  assert.equal(s.name, 'The Structured Explorer');
  assert.deepEqual([s.stat.above, s.stat.number], ['More curious than', 92]);
  assert.equal(s.closer, closers.O.high[0]);
});

test('a low score is phrased by its own pole, never as lacking', () => {
  const s = videoScript(profile({O: 50, C: 50, E: 50, A: 50, N: 8}), {language: 'no', name});
  assert.equal(s.hook, '120 spørsmål senere …');
  assert.equal(s.intro, 'Dette er');
  assert.deepEqual([s.stat.above, s.stat.number, s.stat.below], ['Roligere enn', 92, 'av 100 personer']);
  assert.equal(s.closer, closers.N.low[1]);
});

test('shows the facet furthest from the middle, and a balanced line when nothing stands out', () => {
  const ds = profile({O: 50, C: 55, E: 45, A: 52, N: 48});
  ds[2].facets.push(f('E3', 6, {name: 'Assertiveness'}));
  const s = videoScript(ds, {language: 'en', name});
  assert.equal(s.facet.name, 'Assertiveness');
  assert.equal(s.facet.caption, 'Percentile 6 · Extraversion');
  assert.equal(s.closer, closers.balanced[0]);
  assert.match(s.ruleId, /^share-video-v1\//);
});

test('every trait and direction has a closing line in both languages', () => {
  for (const code of 'OCEAN') for (const band of ['low', 'high']) assert.ok(closers[code][band].every(x => x.trim().length > 10));
});
