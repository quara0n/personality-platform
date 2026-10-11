import test from 'node:test';
import assert from 'node:assert/strict';
import {percentile, withPercentiles} from '../app/norms.js';

const dist = {min: 4, counts: [10, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 10]};

test('percentile uses lower plus half of equal scores', () => {
  assert.equal(percentile(dist, 4), 13);   // 0 + 5 of 40
  assert.equal(percentile(dist, 12), 50);  // 10 + 10 of 40
  assert.equal(percentile(dist, 20), 88);  // 30 + 5 of 40
  assert.equal(percentile(dist, 13), 75);  // all 30 below, none equal
});

test('percentile is clamped to 1-99 and null outside the table', () => {
  assert.equal(percentile({min: 4, counts: [1000, 0, 1]}, 6), 99);
  assert.equal(percentile({min: 4, counts: [0, 0, 1000]}, 4), 1);
  assert.equal(percentile(dist, 30), null);
  assert.equal(percentile(undefined, 10), null);
});

test('withPercentiles leaves the report unchanged without norms', () => {
  const report = {domains: []};
  assert.equal(withPercentiles(report, null), report);
});
