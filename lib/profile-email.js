// «Send profilen til e-posten din» (Rune 2026-10-21): the box used a mailto: link, so Windows asked which app to
// open and most people got stuck there. Now the server sends the email through Resend, from Kaleido
// <support@kaleidotest.com>, with the profile name, the five traits and a button back to the profile.
// The browser sends only the address, the answer code and the language; the server scores the code itself, so the
// text in the email is always ours and the endpoint cannot be used to send anything else.
// Abuse protection: a valid address, at most PER_TO emails a day to one address, PER_IP a day from one connection
// and DAILY in all (Resend's free plan has 100 a day, shared with the sign-in codes). Only HMAC hashes of the
// address and IP are stored (table profile_emails), and rows older than two days are deleted.
// Environment: RESEND_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, optional EMAIL_FROM and SITE_URL.
import {createHmac} from 'node:crypto';
import questions from '../app/data/questions.json' with {type: 'json'};
import norms from '../app/data/norms-us.json' with {type: 'json'};
import {scoreAssessment} from '../app/scoring.js';
import {applyNorms, shownPercentile} from '../app/norms.js';
import {profileName} from '../app/profile-name.js';

export const PER_TO = 3, PER_IP = 10, DAILY = 80;
const FROM = 'Kaleido <support@kaleidotest.com>';
const site = env => String(env.SITE_URL || 'https://kaleidotest.com').replace(/\/+$/, '');
export const configured = env => Boolean(env.RESEND_API_KEY && env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
export const validEmail = v => typeof v === 'string' && v.length <= 254 && /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i.test(v);
export const validCode = v => /^1[1-5]{120}$/.test(String(v));
// Only the app's own pages: the root (and /en, /no while those exist).
const page = path => /^\/(en|no)?$/.test(String(path)) ? String(path) : '/';
const hash = (env, v) => createHmac('sha256', String(env.SUPABASE_SERVICE_ROLE_KEY)).update(String(v)).digest('hex');
const esc = v => String(v).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

const NAMES = {O: ['Openness', 'Åpenhet'], C: ['Conscientiousness', 'Planmessighet'], E: ['Extraversion', 'Ekstroversjon'],
  A: ['Agreeableness', 'Medmenneskelighet'], N: ['Emotional reactivity', 'Følelsesmessig reaktivitet']};
const BANDS = {low: ['lower', 'lavere'], middle: ['middle', 'midt'], high: ['higher', 'høyere']};

/** Subject, HTML and plain text for one profile, in the Kaleido email look (same as the sign-in code emails). */
export function profileEmail(code, lang, path = '/', env = process.env) {
  const no = lang !== 'en', t = (en, nb) => no ? nb : en;
  const answers = Object.fromEntries(questions.map((q, i) => [q.id, Number(code[i + 1])]));
  const domains = applyNorms(scoreAssessment(questions, answers), norms).domains;
  const name = profileName(domains, no ? 'no' : 'en').name;
  const score = d => Number.isFinite(d.percentile) ? t(`percentile ${shownPercentile(d.percentile)}`, `${shownPercentile(d.percentile)}. persentil`) : `${Number(d.mean).toFixed(2)} / 5`;
  const traits = domains.map(d => ({name: NAMES[d.code][no ? 1 : 0], score: score(d), band: BANDS[d.band]?.[no ? 1 : 0] || ''}));
  const link = `${site(env)}${page(path)}#p=${code}`;
  const subject = t('Your Kaleido personality profile', 'Kaleido-profilen din');
  const intro = t('Here is your profile, so you can come back to it whenever you like.', 'Her er profilen din, så du kan komme tilbake til den når du vil.');
  const more = t('From the profile you can open the in-depth report with all 30 facets, work and everyday life.', 'Fra profilen kan du åpne Fordypningsrapporten med alle 30 fasettene, arbeidsliv og hverdagsliv.');
  const warn = t('The link contains your answers. Only share it with people you trust.', 'Lenken inneholder svarene dine. Del den bare med folk du stoler på.');
  const button = t('Open your profile', 'Åpne profilen din');
  const why = t('You get this email because someone typed this address on kaleidotest.com. If it was not you, you can ignore it.', 'Du får denne e-posten fordi noen skrev inn adressen på kaleidotest.com. Var det ikke deg, kan du se bort fra den.');
  const rows = traits.map(x => `<tr><td style="padding:8px 0;border-bottom:1px solid #ece4d6;font-size:15px">${esc(x.name)}</td><td style="padding:8px 0;border-bottom:1px solid #ece4d6;font-size:15px;text-align:right;white-space:nowrap"><b>${esc(x.score)}</b> <span style="color:#4f6c8a">(${esc(x.band)})</span></td></tr>`).join('');
  const html = `<div style="background:#f6f1e8;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#13284f">
  <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:14px;padding:32px 28px">
    <p style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:bold;color:#13284f">Kaleido</p>
    <p style="margin:0 0 4px;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#4f6c8a">${esc(t('Your profile character', 'Profilfiguren din'))}</p>
    <h1 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:normal">${esc(name)}</h1>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.5">${esc(intro)}</p>
    <table role="presentation" style="width:100%;border-collapse:collapse;margin:0 0 24px">${rows}</table>
    <p style="margin:0 0 24px"><a href="${esc(link)}" style="display:inline-block;padding:12px 22px;background:#f06a3c;color:#ffffff;border-radius:8px;text-decoration:none;font-weight:bold">${esc(button)}</a></p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.5">${esc(more)}</p>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.5;color:#4f6c8a">${esc(warn)}</p>
    <p style="margin:0;font-size:13px;color:#4f6c8a">${esc(why)} Kaleido · kaleidotest.com · support@kaleidotest.com</p>
  </div>
</div>`;
  const text = [subject, '', name, '', intro, '', ...traits.map(x => `${x.name}: ${x.score} (${x.band})`), '', `${button}:`, link, '', more, '', warn, '', why, 'Kaleido · kaleidotest.com'].join('\n');
  return {subject, html, text, link};
}

function keyHeaders(env) {
  const key = env.SUPABASE_SERVICE_ROLE_KEY, h = {apikey: key, 'Content-Type': 'application/json'};
  if (!String(key).startsWith('sb_')) h.Authorization = `Bearer ${key}`;
  return h;
}
async function rest(env, path, {method = 'GET', body} = {}) {
  const r = await fetch(`${env.SUPABASE_URL}/rest/v1/${path}`, {method, headers: {...keyHeaders(env), Prefer: 'return=minimal'}, body: body ? JSON.stringify(body) : undefined});
  if (!r.ok) throw new Error(`Supabase ${r.status}`);
  return method === 'GET' ? r.json() : null;
}

/** POST /api/profile-email: {to, code, lang, path} → {sent: true}. ip is the caller's address (only its hash is kept). */
export async function handleProfileEmail(body, ip, env = process.env) {
  if (!configured(env)) return {status: 503, body: {error: 'Email is not configured on the server.'}};
  const to = String(body?.to || '').trim();
  if (!validEmail(to)) return {status: 400, body: {error: 'invalid-email'}};
  if (!validCode(body?.code)) return {status: 400, body: {error: 'invalid-profile'}};
  const lang = body.lang === 'en' ? 'en' : 'no';
  const toHash = hash(env, to.toLowerCase()), ipHash = hash(env, ip || 'unknown');
  try {
    const since = new Date(Date.now() - 864e5).toISOString();
    const recent = await rest(env, `profile_emails?select=to_hash,ip_hash&created_at=gte.${since}`) || [];
    if (recent.length >= DAILY || recent.filter(r => r.to_hash === toHash).length >= PER_TO || recent.filter(r => r.ip_hash === ipHash).length >= PER_IP)
      return {status: 429, body: {error: 'too-many'}};
    const mail = profileEmail(body.code, lang, body.path, env);
    // Counted before sending, so a failed send still counts and nobody can retry past the limits.
    await rest(env, 'profile_emails', {method: 'POST', body: {to_hash: toHash, ip_hash: ipHash}});
    const r = await fetch('https://api.resend.com/emails', {method: 'POST',
      headers: {Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({from: env.EMAIL_FROM || FROM, to: [to], subject: mail.subject, html: mail.html, text: mail.text})});
    if (!r.ok) {
      console.error('Resend', r.status, await r.text().catch(() => ''));
      return {status: 502, body: {error: 'send-failed'}};
    }
    await rest(env, `profile_emails?created_at=lt.${new Date(Date.now() - 2 * 864e5).toISOString()}`, {method: 'DELETE'}).catch(() => {});
    return {status: 200, body: {sent: true}};
  } catch (e) {
    console.error('profile-email', e.message);
    return {status: 502, body: {error: 'send-failed'}};
  }
}
