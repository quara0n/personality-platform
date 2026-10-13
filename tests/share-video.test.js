import test from 'node:test';
import assert from 'node:assert/strict';
import {videoScript, closers, timeline, duration, musicCues} from '../app/share-video.js';
import {songPlan, SONG} from '../app/share-music.js';

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

test('short cut is under 20 s of content plus a 5-second end card and keeps paid content out; long cut is under 40 s plus the end card', () => {
  const ds = profile({O: 92, C: 81, E: 45, A: 60, N: 35});
  const short = videoScript(ds, {language: 'en', name}), long = videoScript(ds, {language: 'no', name, long: true});
  assert.ok(timeline(short).at(-1).start <= 20 && duration(short) <= 25);
  assert.ok(timeline(long).at(-1).start <= 40 && duration(long) <= 45);
  assert.ok(Math.abs(timeline(short).at(-1).end - timeline(short).at(-1).start - 5) < 1e-9);
  assert.equal(short.traits, undefined);
  assert.equal(short.combo, undefined);
  assert.deepEqual(timeline(long).map(x => x.id), ['hook', 'name', 'traits', 'stat', 'facet', 'combo', 'strength', 'closer', 'end']);
  assert.deepEqual(long.traits.map(x => x.percentile), [92, 81, 45, 60, 35]);
  assert.ok(long.combo.text.length > 20 && long.strength.title.length > 5);
});

test('the song fits the video: short cut plays it once, long cut starts it again at a scene change and ends with it', () => {
  const ds = profile({O: 92, C: 81, E: 45, A: 60, N: 35});
  const short = musicCues(videoScript(ds, {language: 'en', name})), long = musicCues(videoScript(ds, {language: 'no', name, long: true}));
  assert.ok(Math.abs(short.total - SONG.length) < .5, 'the short cut lasts as long as the song');
  assert.deepEqual(songPlan(short.total, short), [{at: 0, from: 0, dur: SONG.length}]);
  const [first, second] = songPlan(long.total, long);
  assert.deepEqual(first, {at: 0, from: 0, dur: long.restartAt});
  assert.equal(second.at, long.restartAt);
  assert.equal(second.from % SONG.beat, 0, 'starts on a beat');
  assert.ok(second.from + second.dur <= SONG.length && SONG.length - (second.from + second.dur) < SONG.beat, 'ends with the song');
  for (const cues of [short, long]) {
    const tl = timeline(videoScript(ds, {language: 'en', name, long: cues === long}));
    assert.ok(tl.every(x => Math.abs(x.start * 2 - Math.round(x.start * 2)) < 1e-9), 'every cut is on a beat');
  }
});

test('the logo pieces land on the song’s opening eighth notes', async () => {
  const {LOGO_HITS} = await import('../app/share-video.js');
  LOGO_HITS.pieces.forEach((t, i) => assert.ok(Math.abs((t - LOGO_HITS.ring[0]) - .25 * (i + 1)) < 1e-9));
  assert.ok(LOGO_HITS.pieces.at(-1) < LOGO_HITS.ring[1]);
});
