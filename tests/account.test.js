import test from 'node:test';
import assert from 'node:assert/strict';
import {validCode, enabled, providers} from '../app/account.js';

test('accepts only a full profile code', () => {
  assert.ok(validCode('1' + '3'.repeat(120)));
  assert.ok(!validCode('1' + '3'.repeat(119)));
  assert.ok(!validCode('2' + '3'.repeat(120)));
  assert.ok(!validCode('1' + '6'.repeat(120)));
});

test('sign-in stays off until both public Supabase values are set', () => {
  assert.equal(enabled({}), false);
  assert.equal(enabled({supabaseUrl: 'https://x.supabase.co'}), false);
  assert.equal(enabled({supabaseUrl: 'https://x.supabase.co', supabaseAnonKey: 'public'}), true);
});

test('offers Google, Apple and X, with the X provider id configurable', () => {
  assert.deepEqual(providers({}).map(p => [p.id, p.label]), [['google', 'Google'], ['apple', 'Apple'], ['twitter', 'X']]);
  assert.equal(providers({xProvider: 'x'})[2].id, 'x');
});

test('the build writes only public settings to config.js', async () => {
  const {readFile} = await import('node:fs/promises');
  const build = await readFile(new URL('../scripts/build.js', import.meta.url), 'utf8');
  assert.ok(!/SERVICE_ROLE/i.test(build));
});
