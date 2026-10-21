import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {pages, renderPage} from '../scripts/seo.js';
import {sharePageHtml} from '../lib/shares.js';

const app = new URL('../app/', import.meta.url);
const hrefs = html => [...html.matchAll(/<link rel="(?:icon|apple-touch-icon|manifest)" href="([^"]+)"/g)].map(m => m[1]);

// Google shows the favicon in search results: it needs a square icon whose size is a multiple of 48 px, on every page.
test('every page links the favicon set with root paths, and the files exist', () => {
  const template = readFileSync(new URL('index.html', app), 'utf8');
  const share = sharePageHtml({id: 'AbCdEfGhIj', title: 'X', lang: 'no', kind: 'profile', video_ext: 'mp4'}, {SUPABASE_URL: 'https://sb.example', SITE_URL: 'https://kaleidotest.com'});
  for (const html of [...Object.keys(pages).map(k => renderPage(template, k)), share]) {
    const list = hrefs(html);
    assert.ok(list.includes('/favicon.ico') && list.includes('/assets/icons/icon-192.png') && list.includes('/site.webmanifest'), list.join());
    for (const href of list) assert.ok(href.startsWith('/') && existsSync(new URL(href.slice(1), app)), href);
  }
  const manifest = JSON.parse(readFileSync(new URL('site.webmanifest', app), 'utf8'));
  for (const icon of manifest.icons) assert.ok(existsSync(new URL(icon.src.slice(1), app)), icon.src);
});
