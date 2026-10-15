import test from 'node:test';
import assert from 'node:assert/strict';
import {compareLine, poles} from '../app/facet-compare.js';

test('low scores are phrased by their own pole with 100 minus the percentile', () => {
  assert.equal(compareLine({code: 'N2', percentile: 23}, 'no'), 'Ut fra svarene dine blir du sjeldnere irritert enn omtrent 77 av 100.');
  assert.equal(compareLine({code: 'N2', percentile: 85}, 'en'), 'Based on your answers, you get irritated more easily than about 85 in 100 people.');
  assert.equal(compareLine({code: 'C1', percentile: 0}, 'no'), 'Ut fra svarene dine føler du deg mindre trygg på at du mestrer oppgaver enn omtrent 99 av 100.');
  assert.equal(compareLine({code: 'N2', mean: 2}, 'no'), '');
});

test('all 30 facets have both poles in both languages', () => {
  assert.equal(Object.keys(poles).length, 30);
  for (const p of Object.values(poles)) assert.ok(p.length === 4 && p.every(x => x.length > 5));
});
