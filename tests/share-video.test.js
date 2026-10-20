import test from 'node:test';
import assert from 'node:assert/strict';
import {videoScript, closers, facetClosers, timeline, duration, musicCues, outroHits} from '../app/share-video.js';
import {profileName} from '../app/profile-name.js';
import {songPlan, SONG} from '../app/share-music.js';

const f = (code, p, extra = {}) => ({code, percentile: p, band: p < 30 ? 'low' : p > 70 ? 'high' : 'middle', ...extra});
const profile = ps => Object.entries(ps).map(([code, p]) => ({...f(code, p), facets: [f(`${code}1`, 50, {name: `${code} facet`})]}));
const name = d => ({O: 'Openness', C: 'Conscientiousness', E: 'Extraversion', A: 'Agreeableness', N: 'Emotional reactivity'})[d.code];

test('names the person, the profile name and the trait furthest from the middle', () => {
  const d = profile({O: 92, C: 81, E: 45, A: 60, N: 35});
  d[0].facets.push(f('O5', 95, {name: 'Intellect'})); d[3].facets.push(f('A4', 20, {name: 'Cooperation'}));
  const s = videoScript(d, {language: 'en', firstName: '  Rune Hansen ', name});
  assert.equal(s.hook, 'Who is Rune, really?');
  assert.equal(s.intro, 'Rune is');
  assert.equal(s.name, "The Devil's Advocate");
  assert.equal(s.name, profileName(d, 'en').name);
  assert.deepEqual([s.stat.above, s.stat.number], ['More curious than', 92]);
  assert.equal(s.closer, 'Agrees with you. Just not yet.');
});

test('a low score is phrased by its own pole, never as lacking', () => {
  const s = videoScript(profile({O: 50, C: 50, E: 50, A: 50, N: 8}), {language: 'no', name});
  assert.equal(s.hook, '120 spørsmål senere …');
  assert.equal(s.intro, 'Dette er');
  assert.deepEqual([s.stat.above, s.stat.number, s.stat.below], ['Roligere enn', 92, 'av 100 personer']);
  assert.equal(s.closer, closers.N.low[1]);
});

test('shows the facet furthest from the middle, with the closer of the facet behind the name', () => {
  const ds = profile({O: 50, C: 55, E: 45, A: 52, N: 48});
  ds[2].facets.push(f('E3', 6, {name: 'Assertiveness'}));
  const s = videoScript(ds, {language: 'en', name});
  assert.equal(s.facet.name, 'Assertiveness');
  assert.equal(s.facet.caption, 'Percentile 6 · Extraversion');
  assert.equal(s.closer, facetClosers.E3l[0]);
  assert.match(s.ruleId, /^share-video-v2\//);
  assert.equal(videoScript(profile({O: 50, C: 55, E: 45, A: 52, N: 48}), {language: 'en', name}).closer, closers.balanced[0]);
});

test('every trait and direction has a closing line in both languages', () => {
  for (const code of 'OCEAN') for (const band of ['low', 'high']) assert.ok(closers[code][band].every(x => x.trim().length > 10));
});

test('short cut is about 20 s of content plus a 3-second end card and keeps paid content out; long cut is under 40 s plus the end card', () => {
  const ds = profile({O: 92, C: 81, E: 45, A: 60, N: 35});
  const short = videoScript(ds, {language: 'en', name}), long = videoScript(ds, {language: 'no', name, long: true});
  assert.ok(timeline(short).at(-1).start <= 21 && duration(short) <= 25);
  assert.ok(timeline(long).at(-1).start <= 40 && duration(long) <= 45);
  assert.ok(Math.abs(timeline(short).at(-1).end - timeline(short).at(-1).start - 3) < 1e-9);
  const closer = timeline(short).find(x => x.id === 'closer');
  assert.equal(closer.end - closer.start, 5);
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

test('the stat follows the trait the name builds on, and never contradicts the facet scene', () => {
  // Name rests on high Friendliness (E1) while Extraversion as a whole is very low and Conscientiousness high.
  const d = profile({O: 50, C: 85, E: 3, A: 50, N: 50});
  d[2].facets.push(f('E1', 97, {name: 'Friendliness'}));
  const s = videoScript(d, {language: 'en', name});
  assert.equal(s.facet.name, 'Friendliness');
  assert.equal(s.trait, 'C');
  assert.deepEqual([s.stat.above, s.stat.number], ['More structured than', 85]);
  // Same name facet with Extraversion high: the stat is the name's own trait, even when another trait is further out.
  const e = profile({O: 50, C: 2, E: 80, A: 50, N: 50});
  e[2].facets.push(f('E1', 97, {name: 'Friendliness'}));
  const t = videoScript(e, {language: 'en', name});
  assert.deepEqual([t.trait, t.stat.above, t.stat.number], ['E', 'More outgoing than', 80]);
});

test('every facet and direction has its own closing line in both languages', () => {
  const all = Object.values(facetClosers).flat();
  assert.equal(Object.keys(facetClosers).length, 60);
  assert.ok(all.every(x => x.trim().length > 10));
  assert.equal(new Set(all).size, all.length);
});

test('outro lifts the five logo pieces on eighth notes from about 2 s before the end, then the whole logo before the loop', () => {
  const ds = profile({O: 92, C: 81, E: 45, A: 60, N: 35});
  for (const long of [false, true]) {
    const s = videoScript(ds, {language: 'en', name, long}), total = duration(s), {pieces, rise} = outroHits(s);
    assert.equal(pieces.length, 5);
    assert.ok(pieces[0] >= total - 2.1 && rise < total, `${pieces} ${rise} ${total}`);
    pieces.forEach((t, i) => i && assert.ok(Math.abs(t - pieces[i - 1] - .25) < 1e-9));
  }
  // Short cut: the song plays once from 0, so the hits sit on its pluck grid (0.157 + n × 0.25 s).
  const {pieces} = outroHits(videoScript(ds, {language: 'en', name}));
  assert.ok(Math.abs(((pieces[0] - .157) / .25) - Math.round((pieces[0] - .157) / .25)) < 1e-6);
});

test('video type prefers H.264 in MP4 over a bare MP4 that may hold VP9', async () => {
  const {videoType} = await import('../app/share-video.js');
  const saved = globalThis.MediaRecorder;
  try {
    globalThis.MediaRecorder = {isTypeSupported: t => ['video/mp4', 'video/mp4;codecs=avc1,opus', 'video/webm'].includes(t)};
    assert.equal(videoType(true), 'video/mp4;codecs=avc1,opus');
    globalThis.MediaRecorder = {isTypeSupported: t => t === 'video/mp4;codecs="avc1.42E01E,mp4a.40.2"'};
    assert.equal(videoType(true), 'video/mp4;codecs="avc1.42E01E,mp4a.40.2"');
  } finally {globalThis.MediaRecorder = saved;}
});
