import test from 'node:test';
import assert from 'node:assert/strict';
import {privacyHtml, CONTROLLER} from '../app/privacy-copy.js';
import {termsHtml} from '../app/terms-copy.js';

const en = (a) => a, no = (a, b) => b;

test('privacy statement and terms render in both languages without gaps', () => {
  for (const tr of [en, no]) for (const html of [privacyHtml(tr, {signIn: true, via: 'Google'}), privacyHtml(tr), termsHtml(tr)]) {
    assert.doesNotMatch(html, /undefined|null|\$\{/);
    assert.ok(html.length > 3000);
  }
});

test('the account section only shows when sign-in is on', () => {
  assert.match(privacyHtml(en, {signIn: true}), /Your account/);
  assert.doesNotMatch(privacyHtml(en), /Your account/);
});

test('the controller line falls back to a notice until the details are filled in', () => {
  if (!CONTROLLER.name) assert.match(privacyHtml(no), /legges inn her før lansering/);
  else assert.match(privacyHtml(no), new RegExp(CONTROLLER.name));
});
