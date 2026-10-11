import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {percentile, shownPercentile, withPercentiles} from '../app/norms.js';
import {scoreAssessment, createReport} from '../app/scoring.js';

const read = file => JSON.parse(fs.readFileSync(new URL(file, import.meta.url), 'utf8'));
const norms = read('../app/data/norms-us.json');
const cases = read('./fixtures/norm-synthetic-cases.json');
const mapping = read('../docs/norms/item-mapping.json');
const scale = {n: 40, lookup: [{sum: 4, count: 10, below: 0}, {sum: 12, count: 20, below: 10}, {sum: 13, count: 0, below: 30}, {sum: 20, count: 10, below: 30}]};

test('percentile uses lower plus half of equal scores', () => {
  assert.equal(percentile(scale, 4), 13);   // 0 + 5 of 40 = 12.5 rounds up
  assert.equal(percentile(scale, 12), 50);  // 10 + 10 of 40
  assert.equal(percentile(scale, 13), 75);  // all 30 below, none equal
  assert.equal(percentile(scale, 20), 88);  // 30 + 5 of 40 = 87.5 rounds up
});

test('invalid sums are rejected rather than clamped or interpolated', () => {
  assert.equal(percentile(scale, 30), null);
  assert.equal(percentile(scale, 12.5), null);
  assert.equal(percentile(undefined, 10), null);
});

test('display rule shows 0 and 100 as 1 and 99', () => {
  assert.equal(shownPercentile(0), 1);
  assert.equal(shownPercentile(100), 99);
  assert.equal(shownPercentile(42), 42);
});

test('norm table covers every scale with consistent counts', () => {
  assert.equal(norms.reference.n, 243307);
  assert.equal(Object.keys(norms.scales).length, 35);
  for (const [code, s] of Object.entries(norms.scales)) {
    assert.equal(s.lookup.reduce((a, x) => a + x.count, 0), s.n, code);
    assert.equal(s.lookup.length, s.maxSum - s.minSum + 1, code);
  }
});

test('app scoring plus the norm table reproduces the synthetic verification profiles in both languages', () => {
  const questions = {en: read('../app/data/questions.json'), no: read('../app/data/questions-no.json')};
  const content = read('../app/data/report-content.json');
  let checked = 0;
  for (const fixture of cases) {
    const answers = Object.fromEntries(mapping.map((m, i) => [m.questionId, fixture.rawAnswersInArchiveOrder[i]]));
    for (const qs of Object.values(questions)) {
      const report = withPercentiles(createReport(scoreAssessment(qs, answers), content), norms);
      for (const d of report.domains) for (const x of [d, ...d.facets]) {
        assert.equal(x.sum, fixture.expected[x.code].sum, x.code);
        assert.equal(x.percentile, fixture.expected[x.code].displayPercentile, x.code);
        checked++;
      }
    }
  }
  assert.equal(checked, cases.length * 35 * 2);
});

test('withPercentiles leaves the report unchanged without norms or for another instrument', () => {
  const report = {instrumentVersion: 'ipip-neo-120-johnson-2014-v1', domains: []};
  assert.equal(withPercentiles(report, null), report);
  assert.equal(withPercentiles({...report, instrumentVersion: 'other'}, norms).norms, undefined);
});
