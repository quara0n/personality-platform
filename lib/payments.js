// Payments with Stripe Checkout (hosted page): cards, Apple Pay and Google Pay come with Stripe's dynamic payment
// methods, Vipps (Norway, NOK, private preview at Stripe) when STRIPE_VIPPS=on. Used by api/purchase.js and
// api/stripe-webhook.js, and by the local server.
// - The price is decided here from a fixed list, never from the browser.
// - A purchase counts only after the server has read a paid Checkout Session from Stripe (webhook or confirm on
//   return), checked tier, amount and currency, and stored it in Supabase (public.purchases).
// - No answers or scores are sent to Stripe; the metadata holds only the user id and the tier.
// Environment: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY,
// optional STRIPE_VIPPS=on and SITE_URL.
import {createHmac, timingSafeEqual} from 'node:crypto';

export const TIERS = ['base', 'plus'];
// Minor units. «plus» bought on top of «base» costs the difference (79 − 49 kr, $7.99 − $4.99).
export const PRICES = {
  base: {nok: 4900, usd: 499},
  plus: {nok: 7900, usd: 799},
  upgrade: {nok: 3000, usd: 300}
};
const NAMES = {
  base: {en: 'Kaleido in-depth report', no: 'Kaleido Fordypningsrapport'},
  plus: {en: 'Kaleido in-depth + tailored', no: 'Kaleido Fordypning + tilpasset'},
  upgrade: {en: 'Kaleido upgrade to in-depth + tailored', no: 'Kaleido oppgradering til Fordypning + tilpasset'}
};
const rank = t => TIERS.indexOf(t);
export const better = (a, b) => (rank(a) >= rank(b) ? a : b);

/** What a buyer who already owns `owned` pays for `tier`: {item, amount} or null when there is nothing to buy. */
export function priceFor(tier, currency, owned = null) {
  if (!TIERS.includes(tier) || !['nok', 'usd'].includes(currency)) return null;
  if (owned && rank(owned) >= rank(tier)) return null;
  const item = owned === 'base' && tier === 'plus' ? 'upgrade' : tier;
  return {item, amount: PRICES[item][currency]};
}

/** True when a paid amount matches one of the fixed prices for that tier. */
export function validPaid(tier, currency, amount) {
  if (!TIERS.includes(tier) || !['nok', 'usd'].includes(currency)) return false;
  const ok = [PRICES[tier][currency]];
  if (tier === 'plus') ok.push(PRICES.upgrade[currency]);
  return ok.includes(amount);
}

const live = env => String(env.STRIPE_SECRET_KEY || '').startsWith('sk_live_') || String(env.STRIPE_SECRET_KEY || '').startsWith('rk_live_');
export const configured = env => Boolean(env.STRIPE_SECRET_KEY && env.SUPABASE_URL && env.SUPABASE_ANON_KEY && env.SUPABASE_SERVICE_ROLE_KEY);
const vippsOn = env => String(env.STRIPE_VIPPS || '').toLowerCase() === 'on';
// Vipps is a private preview at Stripe and needs this version header on requests that include it.
const VIPPS_VERSION = '2026-09-30.preview; vipps_preview=v1';

/** Flattens {a: {b: [1]}} into Stripe's form encoding a[b][0]=1. */
export function formEncode(obj, prefix = '', out = new URLSearchParams()) {
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (typeof v === 'object') formEncode(v, key, out);
    else out.append(key, String(v));
  }
  return out;
}

async function stripe(env, method, path, params, version) {
  const headers = {Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`};
  if (version) headers['Stripe-Version'] = version;
  let body;
  if (params) {headers['Content-Type'] = 'application/x-www-form-urlencoded'; body = formEncode(params).toString();}
  const r = await fetch(`https://api.stripe.com/v1/${path}`, {method, headers, body});
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(data?.error?.message || `Stripe ${r.status}`), {status: r.status, stripe: data?.error});
  return data;
}

async function supabase(env, path, {method = 'GET', body, prefer} = {}) {
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  const headers = {apikey: key, Authorization: `Bearer ${key}`};
  if (body) headers['Content-Type'] = 'application/json';
  if (prefer) headers.Prefer = prefer;
  const r = await fetch(`${env.SUPABASE_URL}/rest/v1/${path}`, {method, headers, body: body ? JSON.stringify(body) : undefined});
  if (!r.ok) throw Object.assign(new Error(`Supabase ${r.status}: ${await r.text().catch(() => '')}`), {status: 502});
  return r.status === 204 ? null : r.json().catch(() => null);
}

/** The signed-in user behind a Supabase access token, or null. */
export async function userFromToken(env, token) {
  if (!token) return null;
  const r = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {headers: {apikey: env.SUPABASE_ANON_KEY, Authorization: `Bearer ${token}`}});
  if (!r.ok) return null;
  const u = await r.json().catch(() => null);
  return u?.id ? {id: u.id, email: u.email || ''} : null;
}

/** The best tier the user owns in this Stripe mode (test purchases do not count once live keys are in), or null. */
export async function ownedTier(env, userId) {
  const rows = await supabase(env, `purchases?select=tier&user_id=eq.${encodeURIComponent(userId)}&livemode=eq.${live(env)}`);
  return (rows || []).reduce((best, r) => (best ? better(best, r.tier) : r.tier), null);
}

/** Stores a paid Checkout Session once (the session id is the key, so repeats are ignored). Returns the tier or null. */
export async function recordSession(env, session) {
  if (!session || session.object !== 'checkout.session' || session.mode !== 'payment') return null;
  if (session.payment_status !== 'paid' || session.status !== 'complete') return null;
  const tier = session.metadata?.tier, userId = session.metadata?.user_id || session.client_reference_id;
  if (!userId || !/^[0-9a-f-]{36}$/i.test(userId) || userId !== session.client_reference_id) return null;
  if (!validPaid(tier, session.currency, session.amount_total)) {
    console.error('purchase: unexpected amount', session.id, tier, session.currency, session.amount_total);
    return null;
  }
  await supabase(env, 'purchases?on_conflict=id', {
    method: 'POST', prefer: 'resolution=ignore-duplicates,return=minimal',
    body: {id: session.id, user_id: userId, tier, amount: session.amount_total, currency: session.currency,
      payment_intent: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id || null,
      livemode: Boolean(session.livemode)}
  });
  return tier;
}

function origin(env, headers = {}) {
  if (env.SITE_URL) return String(env.SITE_URL).replace(/\/$/, '');
  const host = headers['x-forwarded-host'] || headers.host || 'localhost:4173';
  const proto = headers['x-forwarded-proto'] || (/^(localhost|127\.)/.test(host) ? 'http' : 'https');
  return `${proto}://${host}`;
}

/** POST /api/purchase: {action: 'status' | 'checkout' | 'confirm', ...}. Returns {status, body}. */
export async function handlePurchase(body, token, env = process.env, headers = {}) {
  if (!configured(env)) return {status: 503, body: {error: 'Payments are not switched on.'}};
  const user = await userFromToken(env, token).catch(() => null);
  if (!user) return {status: 401, body: {error: 'Sign in first.'}};
  const action = body?.action;
  try {
    if (action === 'status') return {status: 200, body: {tier: await ownedTier(env, user.id), live: live(env)}};
    if (action === 'confirm') {
      const id = String(body?.session || '');
      if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(id)) return {status: 400, body: {error: 'Unknown session.'}};
      const session = await stripe(env, 'GET', `checkout/sessions/${id}`);
      if (session.client_reference_id !== user.id) return {status: 403, body: {error: 'Not your purchase.'}};
      await recordSession(env, session);
      return {status: 200, body: {tier: await ownedTier(env, user.id), paid: session.payment_status === 'paid'}};
    }
    if (action === 'checkout') {
      const tier = body?.tier, currency = body?.market === 'NO' ? 'nok' : 'usd', lang = body?.lang === 'no' ? 'no' : 'en';
      if (!TIERS.includes(tier)) return {status: 400, body: {error: 'Unknown report.'}};
      const owned = await ownedTier(env, user.id), price = priceFor(tier, currency, owned);
      if (!price) return {status: 409, body: {error: 'Already bought.', tier: owned}};
      const vipps = body?.method === 'vipps' && currency === 'nok' && vippsOn(env);
      const base = origin(env, headers), path = lang === 'no' ? '/no' : '/';
      const params = {
        mode: 'payment',
        client_reference_id: user.id,
        customer_email: user.email || undefined,
        locale: lang === 'no' ? 'nb' : 'en',
        line_items: [{quantity: 1, price_data: {currency, unit_amount: price.amount, product_data: {name: NAMES[price.item][lang]}}}],
        metadata: {user_id: user.id, tier},
        payment_intent_data: {metadata: {user_id: user.id, tier}, description: NAMES[price.item].en},
        success_url: `${base}${path}?paid={CHECKOUT_SESSION_ID}#report`,
        cancel_url: `${base}${path}#results`,
        // Norway: consent to immediate delivery, so the right of withdrawal lapses (angrerettloven § 22 n).
        custom_text: currency === 'nok' ? {submit: {message: lang === 'no'
          ? 'Rapporten åpnes med en gang. Ved å betale samtykker du til det og godtar at angreretten da faller bort.'
          : 'The report opens right away. By paying you agree to this and accept that the right of withdrawal then lapses.'}} : undefined
      };
      // The Vipps button opens a page with only Vipps; every other button opens the page with all methods (in
      // Norway with Vipps among them). If Stripe refuses the Vipps preview, fall back to the plain page.
      const tries = [];
      if (vipps) tries.push([{...params, payment_method_types: ['vipps']}, VIPPS_VERSION]);
      if (currency === 'nok' && vippsOn(env)) tries.push([params, VIPPS_VERSION]);
      tries.push([params, undefined]);
      let session, error;
      for (const [p, version] of tries) {
        try {session = await stripe(env, 'POST', 'checkout/sessions', p, version); break;}
        catch (e) {error = e; console.warn('purchase: checkout attempt refused', version || 'default', e.message);}
      }
      if (!session) throw error;
      return {status: 200, body: {url: session.url}};
    }
    return {status: 400, body: {error: 'Unknown action.'}};
  } catch (e) {
    console.error('purchase', action, e.status || '', e.message);
    return {status: 502, body: {error: 'The payment service did not answer. Nothing was charged.'}};
  }
}

/** Checks a Stripe-Signature header (t=…,v1=…) against the raw body. */
export function verifySignature(raw, header, secret, now = Date.now(), tolerance = 300) {
  if (!raw || !header || !secret) return false;
  const parts = Object.fromEntries(String(header).split(',').map(p => p.split('=')).filter(p => p.length === 2).map(([k, v]) => [k.trim(), v]));
  const signatures = String(header).split(',').filter(p => p.trim().startsWith('v1=')).map(p => p.trim().slice(3));
  const t = Number(parts.t);
  if (!Number.isFinite(t) || Math.abs(now / 1000 - t) > tolerance || !signatures.length) return false;
  const expected = createHmac('sha256', secret).update(`${t}.${raw}`).digest('hex');
  return signatures.some(s => s.length === expected.length && timingSafeEqual(Buffer.from(s), Buffer.from(expected)));
}

/** POST /api/stripe-webhook. Returns {status, body}. */
export async function handleWebhook(raw, signature, env = process.env) {
  if (!configured(env) || !env.STRIPE_WEBHOOK_SECRET) return {status: 503, body: {error: 'Payments are not switched on.'}};
  if (!verifySignature(raw, signature, env.STRIPE_WEBHOOK_SECRET)) return {status: 400, body: {error: 'Bad signature.'}};
  let event;
  try {event = JSON.parse(raw);} catch {return {status: 400, body: {error: 'Bad JSON.'}};}
  if (['checkout.session.completed', 'checkout.session.async_payment_succeeded'].includes(event.type)) {
    try {await recordSession(env, event.data?.object);}
    catch (e) {console.error('webhook', e.message); return {status: 500, body: {error: 'Could not store the purchase.'}};}
  }
  return {status: 200, body: {received: true}};
}
