import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {nameShare, rarityCopy, rarityHtml, rarityShort, roundPeople, MIN_COUNT} from '../app/name-rarity.js';
import {nameKey, aggregate, MIN_TOTAL} from '../lib/name-stats.js';

const estimates = JSON.parse(await readFile(new URL('../app/data/name-frequencies.json', import.meta.url), 'utf8'));

test('the estimate table covers the names and sums to its sample size', () => {
  const total = Object.values(estimates.counts).reduce((a, b) => a + b, 0);
  assert.equal(total, estimates.n);
  assert.ok(Object.keys(estimates.counts).length > 2000);
  assert.ok(estimates.counts['signature/N5l-C5h'] > estimates.counts['C1l-N5l']);
});

test('numbers are said in people, rounded to two digits', () => {
  assert.equal(roundPeople(5263, 'no'), '5 300');
  assert.equal(roundPeople(5263, 'en'), '5,300');
  assert.equal(roundPeople(66, 'no'), '66');
  assert.match(rarityCopy({share: 0.0252, source: 'estimate', total: 1e6}, 'no').line, /Omtrent <b>3 av 100<\/b> mennesker/);
  assert.match(rarityCopy({share: 1 / 5263, source: 'estimate', total: 1e6}, 'no').line, /Omtrent <b>1 av 5 300<\/b> mennesker får denne profilfiguren/);
  assert.match(rarityCopy({share: 0, source: 'estimate', total: 1e6}, 'en').line, /^<b>Fewer than 1 in 100,000<\/b>/);
  assert.equal(rarityCopy({share: 1 / 20000, source: 'estimate', total: 1e6}, 'no').tag, 'Svært sjelden kombinasjon');
});

test('the (i) opens the method in a bubble, and never says the probabilities are multiplied', () => {
  const html = rarityHtml('profile-name-v2/C1l-N5l', estimates, null, 'no');
  assert.match(html, /<\/b>\u00a0<button type="button" class="d-info-btn" aria-expanded="false" aria-controls="(rarity-info-\d+)"[^]*id="\1" hidden>/);
  assert.match(html, /243\u00a0307 deltakere/);
  assert.doesNotMatch(html, /multipli|ganget/i);
});

test('real counts replace the estimate only where there are enough of them, and say so', () => {
  const real = {total: 2000, counts: {'C1l-N5l': MIN_COUNT}};
  const s = nameShare('profile-name-v2/C1l-N5l', estimates, real);
  assert.deepEqual(s, {share: MIN_COUNT / 2000, source: 'kaleido', total: 2000});
  assert.match(rarityCopy(s, 'no').method[0], /2 000 lagrede Kaleido-profiler/);
  assert.equal(nameShare('profile-name-v2/C2l-N5l', estimates, real).source, 'estimate');
  assert.equal(nameShare('x', null, null), null);
});

test('the server counts names with the app code and hides small groups', () => {
  assert.equal(nameKey('nonsense'), null);
  const code = '1' + '15'.repeat(60);
  assert.match(nameKey(code), /^(signature\/)?[OCEAN]\d[hl]/);
  assert.deepEqual(aggregate([code, code]), {total: 2, minTotal: MIN_TOTAL, counts: {}});
  const many = aggregate([...Array(MIN_TOTAL).fill(code), '1' + '3'.repeat(120)]);
  assert.equal(many.total, MIN_TOTAL + 1);
  assert.deepEqual(Object.keys(many.counts), [nameKey(code)]);
});

test('the share video gets a short line in people, or nothing before the data has loaded', () => {
  assert.match(rarityShort('profile-name-v2/C1l-N5l', 'no', {estimates, real: null}), /^Omtrent 1 av [\d\u00a0]+ får denne figuren$/);
  assert.match(rarityShort('profile-name-v2/signature/N5h-C5l', 'en', {estimates, real: null}), /^About \d in 100 people get this character$/);
  assert.equal(rarityShort('profile-name-v2/C1l-N5l', 'no'), '');
});
