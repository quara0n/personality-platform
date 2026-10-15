import test from 'node:test';
import assert from 'node:assert/strict';
import {combination, facetLines} from '../app/combination-copy.js';

const f = (code, p) => ({code, name: code, percentile: p, band: p < 30 ? 'low' : p > 70 ? 'high' : 'middle'});
const profile = (traits, facets = {}) => Object.entries(traits).map(([code, p]) => ({...f(code, p),
  facets: [1, 2, 3, 4, 5, 6].map(i => f(`${code}${i}`, facets[`${code}${i}`] ?? 50))}));

test('the combination adds a line for the most distinctive facet that agrees with its trait', () => {
  // A4 is the most extreme facet but points the other way from Agreeableness, so C5 is used.
  const c = combination(profile({O: 50, C: 15, E: 50, A: 88, N: 50}, {A4: 2, C5: 8, A3: 85}), 'no');
  assert.equal(c.title, 'Fleksibel og omtenksom');
  assert.equal(c.facet.code, 'C5');
  assert.equal(c.nuance, `Det synes mest i c5: ${facetLines.C5l[1]}`);
});

test('no facet line when every facet sits in the middle, and 60 distinct lines exist', () => {
  assert.equal(combination(profile({O: 50, C: 15, E: 50, A: 88, N: 50}), 'en').nuance, '');
  const all = Object.values(facetLines).flat();
  assert.equal(Object.keys(facetLines).length, 60);
  assert.equal(new Set(all).size, all.length);
});
