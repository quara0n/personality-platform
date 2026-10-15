import test from 'node:test';
import assert from 'node:assert/strict';
import {profileName, words, signatures, signatureLines} from '../app/profile-name.js';

// Domains with all facets at percentile 50 unless overridden, e.g. {E1: ['high', 92]}.
const profile = (over = {}) => [...'OCEAN'].map(code => ({code, band: 'middle', percentile: 50,
  facets: [1, 2, 3, 4, 5, 6].map(i => {const [band, percentile] = over[`${code}${i}`] || ['middle', 50]; return {code: `${code}${i}`, name: `${code}${i}`, band, percentile};})}));

test('a signature pairing wins when it rests on the most distinctive facets', () => {
  const d = profile({E1: ['high', 92], E2: ['low', 8]});
  assert.equal(profileName(d, 'en').name, 'The Warm Hermit');
  assert.equal(profileName(d, 'no').name, 'Den varme eneboeren');
  assert.equal(profileName(d, 'en').ruleId, 'profile-name-v2/signature/E1h-E2l');
  assert.equal(profileName(d, 'no').line, 'Elsker folk. Én om gangen. Helst hjemme.');
  assert.equal(profileName(d, 'no').image, 'E1h-E2l');
});

test('otherwise the noun comes from the top facet and the adjective from another trait', () => {
  const d = profile({N2: ['high', 97], C3: ['low', 15], N6: ['high', 90]});
  const n = profileName(d, 'en');
  assert.equal(n.name, 'The Spontaneous Volcano');
  assert.deepEqual(n.facets.map(f => f.code), ['N2', 'C3']);
  assert.equal(n.image, 'N2h');
  assert.equal(profileName(d, 'no').name, 'Den spontane vulkanen');
});

test('a signature far weaker than the plain name does not win', () => {
  const d = profile({O5: ['high', 99], N1: ['low', 1], E1: ['high', 72], E2: ['low', 28]});
  // O5 and N1 tie; the code order makes N1 the noun.
  assert.equal(profileName(d, 'en').name, 'The Philosophical Zen Master');
});

test('one distinctive facet gives the noun alone; none gives a balanced name', () => {
  assert.equal(profileName(profile({N6: ['low', 5]}), 'en').name, 'The Rock');
  assert.equal(profileName(profile({N6: ['low', 5]}), 'no').name, 'Klippen');
  assert.equal(profileName(profile(), 'en').name, 'The All-Rounder');
  assert.equal(profileName(profile(), 'no').name, 'Den allsidige');
});

test('every facet and direction has four words, and signatures use known keys', () => {
  for (const code of 'OCEAN') for (let i = 1; i <= 6; i++) for (const b of 'hl') {
    const w = words[`${code}${i}${b}`];
    assert.equal(w?.length, 4, `${code}${i}${b}`);
    assert.ok(w.every(s => s.trim()));
  }
  for (const [a, b, en, no] of signatures) {
    assert.ok(words[a] && words[b] && en && no, `${a}-${b}`);
    assert.notEqual(a, b);
    assert.equal(signatureLines[`${a}-${b}`]?.length, 2, `line ${a}-${b}`);
  }
  assert.equal(new Set(signatures.map(s => [s[0], s[1]].sort().join())).size, signatures.length);
});

test('every illustration has a text in both languages and an image file', async () => {
  const {characterText, sharedArt} = await import('../app/profile-name-copy.js');
  const fs = await import('node:fs');
  const ids = [...signatures.map(s => `${s[0]}-${s[1]}`), ...Object.keys(words), 'balanced'];
  assert.equal(ids.length, 91);
  for (const id of ids) {
    assert.equal(characterText[id]?.length, 2, id);
    assert.ok(fs.existsSync(`app/assets/names/${id}.webp`), id);
    if (!sharedArt.has(id)) for (const v of ['female', 'male']) assert.ok(fs.existsSync(`app/assets/names/${v}/${id}.webp`), `${v}/${id}`);
  }
  assert.equal(Object.keys(characterText).length, 91);
});
