import test from 'node:test';
import assert from 'node:assert/strict';
import {profileName, adjectives, nouns} from '../app/profile-name.js';
import {combination} from '../app/combination-copy.js';

const profile = bands => Object.entries(bands).map(([code, [band, percentile]]) => ({code, band, percentile}));
const mid = {O: ['middle', 50], C: ['middle', 50], E: ['middle', 50], A: ['middle', 50], N: ['middle', 50]};

test('noun from the trait furthest from the middle, adjective from the second', () => {
  const d = profile({...mid, O: ['high', 80], C: ['high', 95]});
  assert.equal(profileName(d, 'en').name, 'The Curious Planner');
  assert.equal(profileName(d, 'no').name, 'Den nysgjerrige planleggeren');
  assert.equal(profileName(d, 'en').ruleId, 'profile-name-v1/ChOh');
});

test('rests on the same two traits as the combination sentence', () => {
  const d = profile({O: ['low', 10], C: ['high', 75], E: ['low', 4], A: ['high', 90], N: ['middle', 40]});
  assert.deepEqual(profileName(d, 'en').traits.map(x => x.code).sort(), combination(d, 'en').traits.map(x => x.code).sort());
  assert.equal(profileName(d, 'en').name, 'The Considerate Observer');
});

test('one standout gives the noun alone; none gives a balanced name', () => {
  assert.equal(profileName(profile({...mid, N: ['low', 5]}), 'en').name, 'The Anchor');
  assert.equal(profileName(profile({...mid, N: ['low', 5]}), 'no').name, 'Klippen');
  assert.equal(profileName(profile(mid), 'en').name, 'The All-Rounder');
  assert.equal(profileName(profile(mid), 'no').name, 'Den allsidige');
});

test('every trait and direction has words in both languages', () => {
  for (const code of 'OCEAN') for (const band of ['low', 'high']) for (const w of [adjectives, nouns]) {
    assert.equal(w[code][band].length, 2);
    assert.ok(w[code][band].every(s => s.trim()));
  }
});
