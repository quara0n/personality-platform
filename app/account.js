// Account: sign in with Google (or Apple/X) or by an emailed link to save the 120 answers and open the
// profile again on any device. Since 2026-10-16 the results need a signed-in account when sign-in is
// configured (Rune's decision); scoring, report and video still run in the browser.
// Uses Supabase Auth with the PKCE flow, so the sign-in redirect comes back as ?code=… and never
// clashes with the app's #routes. Answers are stored as the same code as the profile link
// (1 + 120 digits) in a table protected by row-level security (supabase/migrations).
// Configured at build time from SUPABASE_URL and SUPABASE_ANON_KEY, which are public values;
// without them, sign-in stays hidden.
const SUPABASE_JS = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';
const RETURN = 'fem-account-return', INTENT = 'fem-account-intent';
// The emailed link usually opens in a new tab, where sessionStorage (and with it the answers) is empty.
// So the email flow keeps the route, intent and answer code in localStorage until the link is used.
const PENDING = 'fem-account-pending', PENDING_MS = 24 * 60 * 60 * 1000;
export const validEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());

export const validCode = code => /^1[1-5]{120}$/.test(String(code));
const cfg = () => (typeof window !== 'undefined' && window.FEM_CONFIG) || {};
export const enabled = (c = cfg()) => Boolean(c.supabaseUrl && c.supabaseAnonKey);

/** Providers in the order shown. X is "twitter" in Supabase unless the config says otherwise. */
// `providers` in the config ("google,apple,x") limits the buttons to the ones switched on in Supabase.
export const providers = (c = cfg()) => {
  const on = String(c.providers || 'google,apple,x').split(',').map(x => x.trim().toLowerCase());
  return [
    {key: 'google', id: 'google', label: 'Google'},
    {key: 'apple', id: 'apple', label: 'Apple'},
    {key: 'x', id: c.xProvider || 'twitter', label: 'X'}
  ].filter(p => on.includes(p.key)).map(({id, label}) => ({id, label}));
};

let clientPromise;
function client() {
  if (!enabled()) return Promise.reject(new Error('not-configured'));
  // Tests and previews can inject a client with the same shape.
  if (window.__femAuthClient) return Promise.resolve(window.__femAuthClient);
  clientPromise ||= import(SUPABASE_JS).then(({createClient}) => createClient(cfg().supabaseUrl, cfg().supabaseAnonKey, {auth: {flowType: 'pkce', persistSession: true, detectSessionInUrl: true}}));
  return clientPromise;
}

const store = {
  get: k => {try {return sessionStorage.getItem(k);} catch {return null;}},
  set: (k, v) => {try {sessionStorage.setItem(k, v);} catch {}},
  drop: k => {try {sessionStorage.removeItem(k);} catch {}}
};
const pending = {
  get: () => {try {const p = JSON.parse(localStorage.getItem(PENDING) || 'null'); return p && Date.now() - p.at < PENDING_MS ? p : null;} catch {return null;}},
  set: p => {try {localStorage.setItem(PENDING, JSON.stringify({...p, at: Date.now()}));} catch {}},
  drop: () => {try {localStorage.removeItem(PENDING);} catch {}}
};

/** Current user ({id, email, provider}) or null. */
export async function currentUser() {
  if (!enabled()) return null;
  const c = await client(), {data} = await c.auth.getSession(), u = data?.session?.user;
  return u ? {id: u.id, email: u.email || u.user_metadata?.email || '', name: u.user_metadata?.full_name || u.user_metadata?.name || '', provider: u.app_metadata?.provider || ''} : null;
}

/** Sends the browser to the provider. `route` is where to land afterwards; `intent` 'save' saves the answers on return. */
export async function signIn(provider, route = 'account', intent = '') {
  const c = await client();
  store.set(RETURN, route);
  if (intent) store.set(INTENT, intent); else store.drop(INTENT);
  const {error} = await c.auth.signInWithOAuth({provider, options: {redirectTo: location.origin + location.pathname}});
  if (error) throw error;
}

/** Emails a sign-in link. `code` (the 120 answers) comes back with the link, even in a new tab. */
export async function signInWithEmail(email, route = 'account', intent = '', code = '') {
  if (!validEmail(email)) throw new Error('invalid-email');
  const c = await client();
  pending.set({route, intent, code: validCode(code) ? code : ''});
  const {error} = await c.auth.signInWithOtp({email: String(email).trim(), options: {emailRedirectTo: location.origin + location.pathname, shouldCreateUser: true}});
  if (error) {pending.drop(); throw error;}
}

/** On the way back from the provider: the route to show at once, so the first paint is not the home page. */
export function pendingRoute() {
  return /[?&](code|error)=/.test(location.search) ? store.get(RETURN) || pending.get()?.route || 'account' : null;
}

/** After the redirect back: lets Supabase swap ?code= for a session, cleans the address and returns {route, intent}, or null. */
export async function finishSignIn() {
  const params = new URLSearchParams(location.search);
  if (!enabled() || !(params.has('code') || params.has('error'))) return null;
  const c = await client();
  let failed = params.has('error') && !params.has('code'), reason = params.get('error_description') || '';
  if (params.has('code')) {
    const {data} = await c.auth.getSession();
    if (!data?.session) {
      // A code that does not turn into a session is a failed sign-in, not a silent no-op.
      const {data: swapped, error} = await c.auth.exchangeCodeForSession(params.get('code')).catch(e => ({error: e}));
      if (!swapped?.session) {failed = true; reason = error?.message || 'no-session';}
    }
  }
  if (failed) console.warn('Sign-in failed:', reason);
  const p = store.get(RETURN) ? null : pending.get();
  const route = store.get(RETURN) || p?.route || 'account', intent = store.get(INTENT) || p?.intent || '', code = p?.code || '';
  store.drop(RETURN); store.drop(INTENT); if (!failed) pending.drop();
  params.delete('code'); params.delete('error'); params.delete('error_description'); params.delete('error_code'); params.delete('state');
  const query = params.toString();
  history.replaceState(null, '', `${location.pathname}${query ? `?${query}` : ''}#${route}`);
  return {route, intent, code, failed, reason};
}

/** Saved profile {code, language, updatedAt} or null. */
export async function loadProfile() {
  const c = await client(), {data, error} = await c.from('profiles').select('answers, language, updated_at').maybeSingle();
  if (error) throw error;
  return data && validCode(data.answers) ? {code: data.answers, language: data.language, updatedAt: data.updated_at} : null;
}

export async function saveProfile(code, language) {
  if (!validCode(code)) throw new Error('invalid-answers');
  const c = await client(), user = await currentUser();
  if (!user) throw new Error('signed-out');
  const {error} = await c.from('profiles').upsert({user_id: user.id, answers: code, language, updated_at: new Date().toISOString()});
  if (error) throw error;
}

export async function deleteProfile() {
  const c = await client(), user = await currentUser();
  if (!user) return;
  const {error} = await c.from('profiles').delete().eq('user_id', user.id);
  if (error) throw error;
}

/** Deletes the saved profile and the account itself (delete_my_account() in the migration), then signs out. */
export async function deleteAccount() {
  const c = await client(), {error} = await c.rpc('delete_my_account');
  if (error) throw error;
  await c.auth.signOut().catch(() => {});
}

export async function signOut() {
  const c = await client();
  await c.auth.signOut();
}

/** Payments are switched on in this deployment (build flag; the keys stay on the server). */
export const paymentsOn = (c = cfg()) => enabled(c) && Boolean(c.payments);
export const vippsOn = (c = cfg()) => paymentsOn(c) && Boolean(c.vipps);

/** The signed-in user's access token, or '' (for server calls that check a purchase). */
export async function accessToken() {
  try { const c = await client(), {data} = await c.auth.getSession(); return data?.session?.access_token || ''; } catch { return ''; }
}

/** Calls /api/purchase as the signed-in user: 'status' → {tier}, 'checkout' → {url}, 'confirm' → {tier, paid}. */
export async function purchase(action, body = {}) {
  const c = await client(), {data} = await c.auth.getSession(), token = data?.session?.access_token;
  if (!token) throw new Error('signed-out');
  const r = await fetch('api/purchase', {method: 'POST', headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`}, body: JSON.stringify({...body, action})});
  const out = await r.json().catch(() => ({}));
  if (!r.ok && r.status !== 409) throw Object.assign(new Error(out.error || `purchase ${r.status}`), {status: r.status});
  return out;
}
