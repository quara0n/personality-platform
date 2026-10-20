import test from 'node:test';
import assert from 'node:assert/strict';
import {rareCombos, pairShare, upperBoth, cdf, comboLines, comboKey, peopleAmount, MAX_SHARE} from '../app/facet-combos.js';
import {words} from '../app/profile-name.js';
import {videoScript, timeline, comboArt} from '../app/share-video.js';

const band = p => p < 30 ? 'low' : p > 70 ? 'high' : 'middle';
const person = (facets, traits = {}) => [...'OCEAN'].map(d => ({code: d, percentile: traits[d] ?? 50, band: band(traits[d] ?? 50), name: d,
  facets: [1, 2, 3, 4, 5, 6].map(i => { const code = `${d}${i}`, p = facets[code] ?? 50; return {code, percentile: p, band: band(p), name: `${code} name`}; })}));

test('the joint tail matches the independent case and grows with correlation', () => {
  assert.ok(Math.abs(upperBoth(1.2, 0.8, 0) - (1 - cdf(1.2)) * (1 - cdf(0.8))) < 1e-6);
  assert.ok(upperBoth(1, 1, .4) > upperBoth(1, 1, 0) && upperBoth(1, 1, -.4) < upperBoth(1, 1, 0));
});

test('opposite ends of the same trait rarely go together; same ends often do', () => {
  const f = (code, p) => ({code, percentile: p, band: band(p)});
  const apart = pairShare(f('C2', 92), f('C5', 10)), together = pairShare(f('C2', 92), f('C5', 90));
  assert.ok(apart.lift < .5 && together.lift > 1.5);
  assert.ok(apart.share < together.share);
});

test('picks the rarest contrasting pair, with its hand-written line', () => {
  const [c] = rareCombos(person({C2: 93, N5: 88, O4: 75}), {language: 'no'});
  assert.equal(c.id, 'C2h+N5h');
  assert.equal(c.line, 'Spiser hele posen. Bretter den pent sammen etterpå.');
  assert.ok(c.contrast && c.share <= MAX_SHARE);
  assert.match(c.amount, /^1 av \d/);
});

test('a middle-of-the-road profile has no combo, and no pair is told twice or with a facet we keep out', () => {
  assert.deepEqual(rareCombos(person({})), []);
  assert.deepEqual(rareCombos(person({C1: 5, N3: 95})), []);
  const two = rareCombos(person({A1: 11, A3: 93, N1: 80, E2: 90, E6: 12}), {count: 2});
  assert.equal(two.length, 2);
  assert.equal(new Set(two.flatMap(c => [c.a.code, c.b.code])).size, 4);
  assert.notEqual(rareCombos(person({C2: 93, N5: 88}), {skip: ['N5h', 'C2h']})[0]?.id, 'C2h+N5h');
});

test('every hand-written pair is two different facets, sorted, in both languages', () => {
  for (const [id, pair] of Object.entries(comboLines)) {
    const [a, b] = id.split('+');
    assert.equal(comboKey(a, b), id);
    assert.ok(words[a] && words[b] && a.slice(0, 2) !== b.slice(0, 2), id);
    assert.ok(pair.length === 2 && pair.every(x => x.trim().length > 8), id);
  }
});

test('amounts follow the people rule', () => {
  assert.equal(peopleAmount(.034, 'no'), '3 av 100');
  assert.equal(peopleAmount(1 / 1234, 'no'), '1 av 1\u00a0200');
  assert.equal(peopleAmount(1 / 1234, 'en'), '1 in 1,200');
});

test('the video shows the rare combo in place of the facet, ends on its line and says how common the character is', () => {
  const d = person({C2: 93, N5: 88});
  const freq = {estimates: {n: 1000, counts: {'C2h-N5h': 2}}, real: null};
  const s = videoScript(d, {language: 'no', name: x => x.name, frequencies: freq});
  assert.equal(s.closer, 'Spiser hele posen. Bretter den pent sammen etterpå.');
  assert.match(s.rarity, /<b>1 av 500<\/b> mennesker får denne profilfiguren$/);
  assert.deepEqual(comboArt(s), ['C2h', 'N5h']);
  const ids = timeline(s).map(x => x.id);
  assert.ok(ids.includes('rare') && !ids.includes('facet'));
  assert.match(s.ruleId, /\/combo\/C2h\+N5h$/);
  const plain = videoScript(person({}), {language: 'en', name: x => x.name});
  assert.equal(plain.rarity, '');
  assert.ok(!timeline(plain).some(x => x.id === 'rare'));
});
