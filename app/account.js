// Optional account: sign in with Google, Apple or X to save the 120 answers and open the profile
// again on any device. Everything else (scoring, report, video) keeps working without an account.
// Uses Supabase Auth with the PKCE flow, so the sign-in redirect comes back as ?code=… and never
// clashes with the app's #routes. Answers are stored as the same code as the profile link
// (1 + 120 digits) in a table protected by row-level security (supabase/migrations).
// Configured at build time from SUPABASE_URL and SUPABASE_ANON_KEY, which are public values;
// without them, sign-in stays hidden.
const SUPABASE_JS = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';
const RETURN = 'fem-account-return', INTENT = 'fem-account-intent';

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

/** On the way back from the provider: the route to show at once, so the first paint is not the home page. */
export function pendingRoute() {
  return /[?&](code|error)=/.test(location.search) ? store.get(RETURN) || 'account' : null;
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
  const route = store.get(RETURN) || 'account', intent = store.get(INTENT) || '';
  store.drop(RETURN); store.drop(INTENT);
  params.delete('code'); params.delete('error'); params.delete('error_description'); params.delete('error_code'); params.delete('state');
  const query = params.toString();
  history.replaceState(null, '', `${location.pathname}${query ? `?${query}` : ''}#${route}`);
  return {route, intent, failed, reason};
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
