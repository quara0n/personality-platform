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

test('the app row: deep links on a phone, copy-and-open for Messenger on a computer, the file for Instagram and TikTok', async () => {
  const {appTargets} = await import('../app/share-targets.js');
  const url = 'https://kaleidotest.com/v/AbCdEfGhIj';
  const phone = Object.fromEntries(appTargets(url, 'Se videoen', {touch: true}).map(t => [t.id, t]));
  assert.equal(phone.messenger.url, 'fb-messenger://share/?link=https%3A%2F%2Fkaleidotest.com%2Fv%2FAbCdEfGhIj');
  assert.equal(phone.snapchat.url, 'https://www.snapchat.com/scan?attachmentUrl=https%3A%2F%2Fkaleidotest.com%2Fv%2FAbCdEfGhIj');
  assert.equal(phone.instagram.kind, 'file');
  assert.equal(phone.tiktok.kind, 'file');
  assert.ok(phone.sms.url.startsWith('sms:?&body=Se%20videoen%20https'));
  const pc = Object.fromEntries(appTargets(url, 'Se videoen').map(t => [t.id, t]));
  assert.equal(pc.messenger.kind, 'paste');
  assert.equal(pc.sms, undefined);
  assert.deepEqual(appTargets(url, 'x', {touch: true}).slice(0, 3).map(t => t.id), ['messenger', 'snapchat', 'instagram']);
});
