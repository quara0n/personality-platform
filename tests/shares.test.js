import test from 'node:test';
import assert from 'node:assert/strict';
import {newId, validId, paths, sharePageHtml, handleShare, sharePage, LIMIT} from '../lib/shares.js';

const env = {SUPABASE_URL: 'https://sb.example', SUPABASE_ANON_KEY: 'anon', SUPABASE_SERVICE_ROLE_KEY: 'service', SITE_URL: 'https://kaleidotest.com'};

test('share ids are 10 random letters and digits', () => {
  const id = newId();
  assert.ok(validId(id), id);
  assert.notEqual(newId(), id);
  for (const bad of ['', 'abc', 'abcdefghij/', '../../etc/x', 'abcdefghi-']) assert.equal(validId(bad), false, bad);
});

test('the share page unfurls with a big card, the video and no way to inject markup', () => {
  const html = sharePageHtml({id: 'AbCdEfGhIj', title: 'Kapteinen <script>', lang: 'no', kind: 'profile', video_ext: 'mp4'}, env);
  assert.match(html, /<meta property="og:image" content="https:\/\/sb\.example\/storage\/v1\/object\/public\/shares\/AbCdEfGhIj\/card\.jpg">/);
  assert.match(html, /og:image:width" content="1200"/);
  assert.match(html, /<video id="v" src="https:\/\/sb\.example\/storage\/v1\/object\/public\/shares\/AbCdEfGhIj\/video\.mp4"/);
  assert.match(html, /og:type" content="website"/);
  assert.match(html, /og:image:type" content="image\/jpeg"/);
  assert.doesNotMatch(html, /og:video/, 'a plain link card, so Messenger shows the picture');
  assert.match(html, /twitter:card" content="summary_large_image"/);
  assert.match(html, /og:url" content="https:\/\/kaleidotest\.com\/v\/AbCdEfGhIj"/);
  assert.match(html, /Kaleido-profilen min/);
  assert.match(html, /href="https:\/\/kaleidotest\.com\/no#test"/);
  assert.doesNotMatch(html, /<script>"/);
  assert.match(html, /Kapteinen &lt;script&gt;/);
  const en = sharePageHtml({id: 'AbCdEfGhIj', title: 'The Captain', lang: 'en', kind: 'report', video_ext: 'webm'}, env);
  assert.match(en, /my Kaleido report/);
  assert.match(en, /video\.webm"/);
});

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

test('creating a share needs a signed-in user and returns signed upload URLs', async t => {
  const saved = globalThis.fetch;
  t.after(() => {globalThis.fetch = saved;});
  globalThis.fetch = fakeFetch([[/auth\/v1\/user/, {status: 401}]]);
  assert.equal((await handleShare({action: 'create', type: 'video/mp4'}, 'bad', env)).status, 401);

  const f = globalThis.fetch = fakeFetch([
    [/GET .*auth\/v1\/user/, {json: {id: 'u1'}}],
    [/GET .*rest\/v1\/shares\?select=id&user_id=eq\.u1/, {json: []}],
    [/POST .*rest\/v1\/shares$/, {status: 201}],
    [/POST .*storage\/v1\/object\/upload\/sign\/shares\//, url => ({json: {url: `/object/upload/sign/shares/${url.split('/shares/')[1]}?token=t`}})]
  ]);
  const r = await handleShare({action: 'create', type: 'video/mp4;codecs=avc1', title: 'Kapteinen', lang: 'no'}, 'tok', env);
  assert.equal(r.status, 200);
  assert.ok(validId(r.body.id));
  assert.equal(r.body.url, `https://kaleidotest.com/v/${r.body.id}`);
  assert.equal(r.body.uploads.video, `https://sb.example/storage/v1/object/upload/sign/shares/${r.body.id}/video.mp4?token=t`);
  assert.deepEqual(Object.keys(r.body.uploads).sort(), ['card', 'poster', 'video']);
  const row = JSON.parse(f.calls.find(c => c.method === 'POST' && /rest\/v1\/shares$/.test(c.url)).body);
  assert.deepEqual({...row, id: 'x'}, {id: 'x', user_id: 'u1', title: 'Kapteinen', lang: 'no', kind: 'profile', video_ext: 'mp4'});
});

test('sharing stops at the daily limit and refuses other file types', async t => {
  const saved = globalThis.fetch;
  t.after(() => {globalThis.fetch = saved;});
  globalThis.fetch = fakeFetch([[/auth\/v1\/user/, {json: {id: 'u1'}}], [/rest\/v1\/shares\?select=id/, {json: Array.from({length: LIMIT}, (_, i) => ({id: String(i)}))}]]);
  assert.equal((await handleShare({action: 'create', type: 'video/mp4'}, 'tok', env)).status, 429);
  assert.equal((await handleShare({action: 'create', type: 'text/html'}, 'tok', env)).status, 400);
});

test('deleting removes the files and the row, only for the owner', async t => {
  const saved = globalThis.fetch;
  t.after(() => {globalThis.fetch = saved;});
  const f = globalThis.fetch = fakeFetch([
    [/auth\/v1\/user/, {json: {id: 'u1'}}],
    [/GET .*rest\/v1\/shares\?select=id,video_ext&user_id=eq\.u1&id=eq\.AbCdEfGhIj/, {json: [{id: 'AbCdEfGhIj', video_ext: 'mp4'}]}],
    [/DELETE .*storage\/v1\/object\/shares/, {json: []}],
    [/DELETE .*rest\/v1\/shares\?user_id=eq\.u1&id=eq\.AbCdEfGhIj/, {status: 204}]
  ]);
  const r = await handleShare({action: 'delete', id: 'AbCdEfGhIj'}, 'tok', env);
  assert.deepEqual(r, {status: 200, body: {deleted: 1}});
  assert.deepEqual(JSON.parse(f.calls.find(c => /storage/.test(c.url)).body).prefixes, Object.values(paths('AbCdEfGhIj', 'mp4')));
  assert.equal((await handleShare({action: 'delete', id: '../x'}, 'tok', env)).status, 400);
});

test('an unknown or malformed link sends people to the front page', async t => {
  const saved = globalThis.fetch;
  t.after(() => {globalThis.fetch = saved;});
  globalThis.fetch = fakeFetch([[/rest\/v1\/shares/, {json: []}]]);
  assert.equal((await sharePage('AbCdEfGhIj', env)).status, 404);
  assert.equal((await sharePage('bad id', env)).status, 404);
});

test('a fresh video upload link is only given for the owner\'s own share', async t => {
  const saved = globalThis.fetch;
  t.after(() => {globalThis.fetch = saved;});
  globalThis.fetch = fakeFetch([
    [/auth\/v1\/user/, {json: {id: 'u1'}}],
    [/GET .*rest\/v1\/shares\?select=id,video_ext&user_id=eq\.u1&id=eq\.AbCdEfGhIj/, {json: [{id: 'AbCdEfGhIj', video_ext: 'webm'}]}],
    [/GET .*rest\/v1\/shares\?select=id,video_ext&user_id=eq\.u1&id=eq\.ZzZzZzZzZz/, {json: []}],
    [/POST .*storage\/v1\/object\/upload\/sign\/shares\//, url => ({json: {url: `/object/upload/sign/shares/${url.split('/shares/')[1]}?token=t`}})]
  ]);
  const r = await handleShare({action: 'video', id: 'AbCdEfGhIj'}, 'tok', env);
  assert.deepEqual(r, {status: 200, body: {upload: 'https://sb.example/storage/v1/object/upload/sign/shares/AbCdEfGhIj/video.webm?token=t'}});
  assert.equal((await handleShare({action: 'video', id: 'ZzZzZzZzZz'}, 'tok', env)).status, 404);
  assert.equal((await handleShare({action: 'video', id: '../x'}, 'tok', env)).status, 400);
});

test('warming the function needs no sign-in and touches nothing', async t => {
  const saved = globalThis.fetch;
  t.after(() => {globalThis.fetch = saved;});
  globalThis.fetch = async () => {throw new Error('no network for warm');};
  assert.deepEqual(await handleShare({action: 'warm'}, '', env), {status: 200, body: {ok: true}});
});
