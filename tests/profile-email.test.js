import test from 'node:test';
import assert from 'node:assert/strict';
import {profileEmail, handleProfileEmail, validEmail, PER_TO} from '../lib/profile-email.js';

const env = {RESEND_API_KEY: 're_test', SUPABASE_URL: 'https://sb.example', SUPABASE_SERVICE_ROLE_KEY: 'service', SITE_URL: 'https://kaleidotest.com'};
const code = '1' + '35'.repeat(60);

function fakeFetch(routes) {
  const calls = [];
  const f = async (url, opts = {}) => {
    calls.push({url, method: opts.method || 'GET', body: opts.body});
    for (const [re, reply] of routes) if (re.test(`${opts.method || 'GET'} ${url}`)) {
      const {status = 200, json = {}} = typeof reply === 'function' ? reply(url, opts) : reply;
      return {ok: status < 300, status, json: async () => json, text: async () => JSON.stringify(json)};
    }
    throw new Error(`unexpected ${opts.method || 'GET'} ${url}`);
  };
  f.calls = calls;
  return f;
}

test('the email holds the profile name, the five traits and a link back to the profile', () => {
  const no = profileEmail(code, 'no', '/', env);
  assert.equal(no.subject, 'Kaleido-profilen din');
  assert.equal(no.link, `https://kaleidotest.com/#p=${code}`);
  assert.match(no.html, /Åpne profilen din/);
  assert.match(no.html, /Følelsesmessig reaktivitet/);
  assert.match(no.html, /\d+\. persentil/);
  assert.match(no.text, /Profilfiguren|Lenken inneholder svarene dine/);
  const en = profileEmail(code, 'en', '/en', env);
  assert.equal(en.link, `https://kaleidotest.com/en#p=${code}`);
  assert.match(en.html, /Open your profile/);
  assert.equal(profileEmail(code, 'no', '//evil.example', env).link, `https://kaleidotest.com/#p=${code}`, 'only our own pages');
});

test('addresses are checked before anything is sent', () => {
  for (const ok of ['kari@example.no', 'a.b+c@sub.example.com']) assert.ok(validEmail(ok), ok);
  for (const bad of ['', 'kari', 'kari@', '@x.no', 'a b@x.no', 'a@x', 'a@x.no, b@y.no', 'x'.repeat(250) + '@x.no']) assert.equal(validEmail(bad), false, bad);
});

test('sending checks the limits, sends through Resend and counts the email', async t => {
  const saved = globalThis.fetch;
  t.after(() => {globalThis.fetch = saved;});
  assert.equal((await handleProfileEmail({to: 'kari@example.no', code}, '1.2.3.4', {})).status, 503);
  globalThis.fetch = fakeFetch([]);
  assert.equal((await handleProfileEmail({to: 'nope', code}, '1.2.3.4', env)).status, 400);
  assert.equal((await handleProfileEmail({to: 'kari@example.no', code: '123'}, '1.2.3.4', env)).status, 400);

  const f = globalThis.fetch = fakeFetch([
    [/GET .*profile_emails\?select/, {json: []}],
    [/POST .*rest\/v1\/profile_emails$/, {status: 201}],
    [/DELETE .*profile_emails\?created_at=lt/, {status: 204}],
    [/POST https:\/\/api\.resend\.com\/emails/, {json: {id: 'e1'}}]
  ]);
  const r = await handleProfileEmail({to: ' Kari@Example.no ', code, lang: 'no', path: '/'}, '1.2.3.4', env);
  assert.equal(r.status, 200);
  const sent = JSON.parse(f.calls.find(c => /resend/.test(c.url)).body);
  assert.deepEqual(sent.to, ['Kari@Example.no']);
  assert.equal(sent.from, 'Kaleido <support@kaleidotest.com>');
  assert.match(sent.html, /#p=1/);
  const row = JSON.parse(f.calls.find(c => c.method === 'POST' && /profile_emails/.test(c.url)).body);
  assert.deepEqual(Object.keys(row).sort(), ['ip_hash', 'to_hash']);
  assert.doesNotMatch(JSON.stringify(row), /kari|1\.2\.3\.4/i, 'only hashes are stored');
});

test('the same address gets at most a few emails a day', async t => {
  const saved = globalThis.fetch;
  t.after(() => {globalThis.fetch = saved;});
  let toHash = null;
  globalThis.fetch = fakeFetch([
    [/GET .*profile_emails\?select/, {json: []}],
    [/POST .*rest\/v1\/profile_emails$/, (url, opts) => {toHash = JSON.parse(opts.body).to_hash; return {status: 201};}],
    [/DELETE /, {status: 204}],
    [/resend/, {json: {}}]
  ]);
  await handleProfileEmail({to: 'kari@example.no', code}, '1.1.1.1', env);
  const f = globalThis.fetch = fakeFetch([[/GET .*profile_emails\?select/, {json: Array.from({length: PER_TO}, () => ({to_hash: toHash, ip_hash: 'x'}))}]]);
  assert.equal((await handleProfileEmail({to: 'KARI@example.no', code}, '9.9.9.9', env)).status, 429);
  assert.ok(!f.calls.some(c => /resend/.test(c.url)), 'nothing sent');
});

test('a failed send says so', async t => {
  const saved = globalThis.fetch;
  t.after(() => {globalThis.fetch = saved;});
  globalThis.fetch = fakeFetch([
    [/GET .*profile_emails\?select/, {json: []}],
    [/POST .*rest\/v1\/profile_emails$/, {status: 201}],
    [/resend/, {status: 422, json: {message: 'bad'}}]
  ]);
  assert.equal((await handleProfileEmail({to: 'kari@example.no', code}, '1.1.1.1', env)).status, 502);
});
