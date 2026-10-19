// Shared profile videos as links (Rune 2026-10-19: «like classic YouTube, Reels share»).
// The person taps Share, the browser uploads the video it made plus two pictures straight to Supabase Storage
// (signed upload URLs from here, so the files never pass through Vercel's small request limit), and the link
// kaleidotest.com/v/<id> unfurls with a big thumbnail and a play button and opens a page that plays the video.
// Only what the video already shows is stored: no answers, scores or email. Only signed-in users can share,
// at most LIMIT links a day, and each person can delete their links (or all of them with the account).
// Environment: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, optional SITE_URL.
import {userFromToken} from './payments.js';

export const BUCKET = 'shares', LIMIT = 20;
const FILES = {video: null, poster: 'poster.jpg', card: 'card.jpg'};
const VIDEO_TYPES = {'video/mp4': 'mp4', 'video/webm': 'webm'};
const site = env => String(env.SITE_URL || 'https://kaleidotest.com').replace(/\/+$/, '');
export const validId = id => /^[A-Za-z0-9]{10}$/.test(String(id));
export const configured = env => Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY && env.SUPABASE_SERVICE_ROLE_KEY);

/** Random 10-character id (about 59 bits), so links cannot be guessed. */
export function newId(random = n => crypto.getRandomValues(new Uint8Array(n))) {
  const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return [...random(10)].map(b => abc[b % abc.length]).join('');
}

const keyHeaders = env => {
  const key = env.SUPABASE_SERVICE_ROLE_KEY, h = {apikey: key};
  if (!String(key).startsWith('sb_')) h.Authorization = `Bearer ${key}`;
  return h;
};
async function rest(env, path, {method = 'GET', body, prefer} = {}) {
  const headers = keyHeaders(env);
  if (body) headers['Content-Type'] = 'application/json';
  if (prefer) headers.Prefer = prefer;
  const r = await fetch(`${env.SUPABASE_URL}/rest/v1/${path}`, {method, headers, body: body ? JSON.stringify(body) : undefined});
  if (!r.ok) throw Object.assign(new Error(`Supabase ${r.status}: ${await r.text().catch(() => '')}`), {status: 502});
  return r.status === 204 ? null : r.json().catch(() => null);
}
async function storage(env, path, {method = 'POST', body} = {}) {
  const r = await fetch(`${env.SUPABASE_URL}/storage/v1/${path}`, {method, headers: {...keyHeaders(env), 'Content-Type': 'application/json'}, body: JSON.stringify(body || {})});
  if (!r.ok) throw Object.assign(new Error(`Storage ${r.status}: ${await r.text().catch(() => '')}`), {status: 502});
  return r.json().catch(() => null);
}

/** File names inside the bucket for one share. */
export const paths = (id, ext) => ({video: `${id}/video.${ext}`, poster: `${id}/${FILES.poster}`, card: `${id}/${FILES.card}`});
export const publicUrl = (env, path) => `${env.SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;

const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, max);

/** POST /api/share: {action: 'create', title, lang, kind, type} → {id, url, uploads}; 'delete' {id}; 'delete-all'. */
export async function handleShare(body, token, env = process.env) {
  if (!configured(env)) return {status: 503, body: {error: 'Sharing is not configured on the server.'}};
  const user = await userFromToken(env, token);
  if (!user) return {status: 401, body: {error: 'Sign in to share.'}};
  const action = body?.action;
  try {
    if (action === 'create') {
      const ext = VIDEO_TYPES[String(body.type || '').split(';')[0]];
      if (!ext) return {status: 400, body: {error: 'Unsupported video type.'}};
      const since = new Date(Date.now() - 864e5).toISOString();
      const recent = await rest(env, `shares?select=id&user_id=eq.${user.id}&created_at=gte.${since}`);
      if ((recent || []).length >= LIMIT) return {status: 429, body: {error: 'Too many shares today.'}};
      const id = newId(), p = paths(id, ext);
      await rest(env, 'shares', {method: 'POST', prefer: 'return=minimal', body: {
        id, user_id: user.id, title: clean(body.title, 80), lang: body.lang === 'en' ? 'en' : 'no', kind: body.kind === 'report' ? 'report' : 'profile', video_ext: ext}});
      const uploads = {};
      for (const [k, path] of Object.entries(p)) {
        const s = await storage(env, `object/upload/sign/${BUCKET}/${path}`);
        uploads[k] = `${env.SUPABASE_URL}/storage/v1${s.url}`;
      }
      return {status: 200, body: {id, url: `${site(env)}/v/${id}`, uploads}};
    }
    if (action === 'delete' || action === 'delete-all') {
      if (action === 'delete' && !validId(body.id)) return {status: 400, body: {error: 'Unknown share.'}};
      const filter = `user_id=eq.${user.id}` + (action === 'delete' ? `&id=eq.${body.id}` : '');
      const rows = await rest(env, `shares?select=id,video_ext&${filter}`) || [];
      if (rows.length) {
        await storage(env, `object/${BUCKET}`, {method: 'DELETE', body: {prefixes: rows.flatMap(r => Object.values(paths(r.id, r.video_ext)))}});
        await rest(env, `shares?${filter}`, {method: 'DELETE'});
      }
      return {status: 200, body: {deleted: rows.length}};
    }
    return {status: 400, body: {error: 'Unknown action.'}};
  } catch (e) {
    return {status: e.status || 500, body: {error: 'Sharing failed.'}};
  }
}

const esc = v => String(v).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

/** The page behind /v/<id>: Open Graph and Twitter tags for the big preview, and a player that starts on a tap. */
export function sharePageHtml(row, env = process.env) {
  const no = row.lang !== 'en', t = (en, nb) => no ? nb : en, s = site(env), p = paths(row.id, row.video_ext);
  const video = publicUrl(env, p.video), poster = publicUrl(env, p.poster), card = publicUrl(env, p.card);
  const name = row.title || 'Kaleido';
  const title = row.kind === 'report' ? t(`${name} – my Kaleido report`, `${name} – Kaleido-rapporten min`) : t(`${name} – my Kaleido profile`, `${name} – Kaleido-profilen min`);
  const description = t("See my personality video. What's your profile? Find out for free.", 'Se personlighetsvideoen min. Hvordan ser din profil ut? Finn ut gratis.');
  const home = no ? `${s}/no` : `${s}/`, mime = row.video_ext === 'webm' ? 'video/webm' : 'video/mp4';
  return `<!doctype html><html lang="${no ? 'nb' : 'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="noindex">
<meta property="og:type" content="video.other"><meta property="og:site_name" content="Kaleido"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${s}/v/${row.id}">
<meta property="og:image" content="${card}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(title)}">
<meta property="og:video" content="${video}"><meta property="og:video:secure_url" content="${video}"><meta property="og:video:type" content="${mime}"><meta property="og:video:width" content="1080"><meta property="og:video:height" content="1920">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${card}">
<link rel="icon" href="/assets/icons/icon-192.png"><style>
@font-face{font-family:'Source Serif 4';src:url(/assets/fonts/source-serif-4.woff2) format('woff2');font-display:swap}
@font-face{font-family:Manrope;src:url(/assets/fonts/manrope.woff2) format('woff2');font-display:swap}
*{box-sizing:border-box}body{margin:0;min-height:100vh;background:#f6f1e8;color:#13284f;font:16px/1.5 Manrope,system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;padding:16px}
.top{width:100%;max-width:420px;display:flex;justify-content:center;margin:4px 0 14px}.top img{height:30px}
.player{position:relative;width:100%;max-width:420px;aspect-ratio:9/16;max-height:78vh;border-radius:14px;overflow:hidden;background:#13284f;box-shadow:0 14px 40px rgba(16,39,71,.22)}
.player video{width:100%;height:100%;object-fit:contain;display:block;background:#f6f1e8}
.play{position:absolute;inset:0;margin:auto;width:88px;height:88px;border:0;border-radius:50%;background:rgba(19,40,79,.82);cursor:pointer;display:grid;place-items:center}
.play svg{width:40px;height:40px;fill:#fff;margin-left:6px}.play[hidden]{display:none}
h1{font:600 24px/1.25 'Source Serif 4',Georgia,serif;text-align:center;margin:18px 0 6px;max-width:420px}
p{margin:0 0 16px;text-align:center;max-width:420px}
.cta{display:inline-block;padding:14px 26px;border-radius:6px;background:#f06a3c;color:#fff;font-weight:700;text-decoration:none}
</style></head><body>
<a class="top" href="${home}"><img src="/assets/design/kaleido-wordmark.webp" alt="Kaleido"></a>
<div class="player"><video id="v" src="${video}" poster="${poster}" playsinline preload="metadata"></video><button class="play" id="play" aria-label="${t('Play', 'Spill av')}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z"/></svg></button></div>
<h1>${esc(t("What's your profile?", 'Hvordan ser din profil ut?'))}</h1><p>${esc(t('Take the free Big Five personality test: 120 questions, about 10 minutes.', 'Ta den gratis personlighetstesten basert på Big Five: 120 spørsmål, rundt 10 minutter.'))}</p>
<a class="cta" href="${home}#test">${t('Take the test for free', 'Ta testen gratis')}</a>
<script>const v=document.getElementById('v'),b=document.getElementById('play');b.onclick=()=>{v.controls=true;v.play();b.hidden=true;};v.onplay=()=>{b.hidden=true;};</script>
</body></html>`;
}

/** GET /v/<id>: {status, html}. */
export async function sharePage(id, env = process.env) {
  const missing = {status: 404, html: `<!doctype html><meta charset="utf-8"><title>Kaleido</title><meta http-equiv="refresh" content="0;url=${site(env)}/">`};
  if (!validId(id) || !configured(env)) return missing;
  try {
    const rows = await rest(env, `shares?select=id,title,lang,kind,video_ext&id=eq.${id}`);
    return rows?.[0] ? {status: 200, html: sharePageHtml(rows[0], env)} : missing;
  } catch {
    return missing;
  }
}
