import test from 'node:test';
import assert from 'node:assert/strict';
import {videoScript, closers, timeline, duration, musicCues} from '../app/share-video.js';
import {musicPlan} from '../app/share-music.js';

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

test('short cut is 15 s of content plus a 5-second end card and keeps paid content out; long cut is about 30 s plus the end card', () => {
  const ds = profile({O: 92, C: 81, E: 45, A: 60, N: 35});
  const short = videoScript(ds, {language: 'en', name}), long = videoScript(ds, {language: 'no', name, long: true});
  assert.ok(timeline(short).at(-1).start <= 15 && duration(short) <= 20);
  assert.ok(timeline(long).at(-1).start <= 30 && duration(long) <= 35);
  assert.ok(Math.abs(timeline(short).at(-1).end - timeline(short).at(-1).start - 5) < 1e-9);
  assert.equal(short.traits, undefined);
  assert.equal(short.combo, undefined);
  assert.deepEqual(timeline(long).map(x => x.id), ['hook', 'name', 'traits', 'stat', 'facet', 'combo', 'strength', 'closer', 'end']);
  assert.deepEqual(long.traits.map(x => x.percentile), [92, 81, 45, 60, 35]);
  assert.ok(long.combo.text.length > 20 && long.strength.title.length > 5);
});

test('music follows the video: groove from the name, motif home on the end card, nothing after the end', () => {
  const s = videoScript(profile({O: 92, C: 81, E: 45, A: 60, N: 35}), {language: 'en', name}), cues = musicCues(s), plan = musicPlan(cues.total, cues);
  assert.deepEqual(plan, musicPlan(cues.total, cues), 'the same every time');
  assert.ok(plan.every(e => e.t >= 0 && e.t + e.dur <= cues.total + 1e-6));
  assert.ok(plan.filter(e => ['kick', 'pluck', 'hat', 'clap'].includes(e.type)).every(e => e.t >= cues.grooveAt && e.t < cues.endAt));
  assert.equal(plan.filter(e => e.type === 'bell' && e.t >= cues.endAt).at(-1).midi, 86, 'the motif ends on D');
});
