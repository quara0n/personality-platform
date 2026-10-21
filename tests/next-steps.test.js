import test from 'node:test';
import assert from 'node:assert/strict';
import {facetNotes, strengthAndTrap, experiments, retakeIcs, sixMonthsAfter} from '../app/next-steps.js';

const facet = (code, band, percentile) => ({code, band, percentile, name: code, content: {work: `work ${code}`, life: `life ${code}`}});

test('every facet has a strength and a trap in both directions and both languages', () => {
  assert.equal(Object.keys(facetNotes).length, 30);
  for (const [code, n] of Object.entries(facetNotes)) for (const band of ['high', 'low']) for (const k of ['use', 'watch']) {
    assert.equal(n[band][k].length, 2, `${code} ${band} ${k}`);
    assert.ok(n[band][k].every(t => t.length > 20 && !t.includes('—')), `${code} ${band} ${k}`);
  }
});

test('the strength is the brilliant pair when there is one, and the trap is another facet', () => {
  const a = facet('O1', 'high', 97), b = facet('O4', 'high', 95), c = facet('C1', 'low', 4);
  const domains = [{facets: [a, b, c, facet('N1', 'middle', 50)]}];
  const {strength, trap} = strengthAndTrap(domains, [{a, b, line: 'Line', when: 'Travel.'}], 'no');
  assert.deepEqual(strength.facets.map(f => f.code), ['O1', 'O4']);
  assert.equal(trap.facets[0].code, 'C1');
  assert.equal(trap.text, facetNotes.C1.low.watch[1]);
  const solo = strengthAndTrap(domains, [], 'en');
  assert.equal(solo.strength.facets[0].code, 'O1');
  assert.equal(solo.trap.facets[0].code, 'C1');
});

test('a middle-only profile gets neither strength nor trap', () => {
  const {strength, trap} = strengthAndTrap([{facets: [facet('N1', 'middle', 50)]}], [], 'no');
  assert.equal(strength, null);
  assert.equal(trap, null);
});

test('three experiments: the tailored tries when answered, else the facets’ own lines', () => {
  const picks = [facet('O1', 'high', 97), facet('C1', 'low', 4), facet('E3', 'high', 90)];
  const plain = experiments(picks, {}, null, 'no');
  assert.deepEqual(plain.map(x => x.text), ['work O1', 'life C1', 'life E3']);
  const tailored = experiments(picks, {work: 'Try at work', life: 'Try at home'}, {when: 'Travel.'}, 'no');
  assert.deepEqual(tailored.map(x => x.id), ['work', 'life', 'strength']);
  assert.match(tailored[2].text, /travel\.$/);
});

test('the retake reminder is an all-day event six months on', () => {
  const d = sixMonthsAfter('2026-10-21T10:00:00Z');
  assert.equal(d.getUTCMonth(), 3);
  const ics = retakeIcs(new Date('2027-04-21T12:00:00Z'), 'no');
  assert.match(ics, /DTSTART;VALUE=DATE:20270421/);
  assert.match(ics, /SUMMARY:Ta Kaleido-testen på nytt/);
});
