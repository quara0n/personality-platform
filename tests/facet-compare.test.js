import test from 'node:test';
import assert from 'node:assert/strict';
import {compareLine, compareCount, poles} from '../app/facet-compare.js';

test('the number is always the percentile, phrased in people', () => {
  assert.equal(compareLine({code: 'C2', name: 'Orden', percentile: 27}, 'no'), 'Når det gjelder orden, skårer du høyere enn omtrent 27 av 100 mennesker, så du ligger litt lavere enn de fleste.');
  assert.equal(compareLine({code: 'C2', name: 'Orderliness', percentile: 27}, 'en'), 'For orderliness, you score higher than about 27 in 100 people, so you sit a little lower than most.');
  assert.equal(compareLine({code: 'N2', name: 'Sinne', percentile: 85}, 'no'), 'Ut fra svarene dine blir du lettere irritert enn omtrent 85 av 100 mennesker.');
  assert.equal(compareLine({code: 'N2', name: 'Anger', percentile: 85}, 'en'), 'Based on your answers, you get irritated more easily than about 85 in 100 people.');
  assert.equal(compareLine({code: 'C1', name: 'Mestringstro', percentile: 0}, 'no'), 'Når det gjelder mestringstro, skårer du høyere enn omtrent 1 av 100 mennesker. De fleste ligger altså over deg her.');
  assert.equal(compareLine({code: 'C1', name: 'Mestringstro', percentile: 42}, 'no'), 'Når det gjelder mestringstro, skårer du høyere enn omtrent 42 av 100 mennesker. Det er litt under midten.');
  assert.equal(compareLine({code: 'C1', name: 'Mestringstro', percentile: 60}, 'no'), 'Når det gjelder mestringstro, skårer du høyere enn omtrent 60 av 100 mennesker. Det er litt over midten.');
  assert.equal(compareLine({code: 'N2', mean: 2}, 'no'), '');
});

test('the figure lights the same number as the card', () => {
  assert.equal(compareCount({code: 'C2', percentile: 27}), 27);
  assert.equal(compareCount({code: 'C2', percentile: 85}), 85);
});

test('all 30 facets have both poles in both languages', () => {
  assert.equal(Object.keys(poles).length, 30);
  for (const p of Object.values(poles)) assert.ok(p.length === 4 && p.every(x => x.length > 5));
});
