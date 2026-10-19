import test from 'node:test';
import assert from 'node:assert/strict';
import {UPLOADS, linkTargets, caption} from '../app/share-targets.js';

test('upload targets are the three networks that take a video file on the web', () => {
  assert.deepEqual(UPLOADS.map(t => t.id), ['instagram', 'tiktok', 'messenger']);
  for (const t of UPLOADS) assert.match(t.url, /^https:\/\//);
});

test('link targets carry the encoded address and caption', () => {
  const ts = linkTargets('https://kaleidotest.com/', 'Hvordan ser din profil ut? Finn ut gratis');
  const by = Object.fromEntries(ts.map(t => [t.id, t.url]));
  assert.equal(by.email, 'mailto:?subject=Kaleido&body=Hvordan%20ser%20din%20profil%20ut%3F%20Finn%20ut%20gratis%3A%20https%3A%2F%2Fkaleidotest.com%2F');
  assert.equal(by.facebook, 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fkaleidotest.com%2F');
  assert.ok(by.whatsapp.startsWith('https://wa.me/?text=Hvordan%20ser'));
  assert.ok(by.whatsapp.endsWith('https%3A%2F%2Fkaleidotest.com%2F'));
  assert.ok(by.x.includes('&url=https%3A%2F%2Fkaleidotest.com%2F'));
  assert.ok(by.linkedin.endsWith('?url=https%3A%2F%2Fkaleidotest.com%2F'));
});

test('caption joins the end-card question and the address', () => {
  assert.equal(caption({end: "What's your profile?", cta: 'Find out for free'}, 'https://kaleidotest.com/'), "What's your profile? Find out for free: https://kaleidotest.com/");
});
