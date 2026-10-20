// Real «kombo-statistikk»: how many saved Kaleido profiles get each profile character (app/name-rarity.js).
// Reads the saved answer codes with the service-role key, scores them with the app's own code and returns
// only aggregate counts: no ids, answers or scores leave the server. Nothing is returned until at least
// MIN_TOTAL profiles are saved, and names with fewer than MIN_COUNT profiles are left out, so a count can
// never point at one person. The browser falls back to the norm-data estimate for anything missing.
// Environment: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
import questions from '../app/data/questions.json' with {type: 'json'};
import norms from '../app/data/norms-us.json' with {type: 'json'};
import {scoreAssessment} from '../app/scoring.js';
import {applyNorms} from '../app/norms.js';
import {profileName} from '../app/profile-name.js';
import {MIN_COUNT} from '../app/name-rarity.js';

export const MIN_TOTAL = 1000, CACHE_MS = 15 * 60 * 1000, PAGE = 1000;
export const configured = env => Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);

/** profile-name ruleId (without the version prefix) for one saved answer code ('1' + 120 digits), or null. */
export function nameKey(code) {
  if (!/^1[1-5]{120}$/.test(String(code))) return null;
  const answers = Object.fromEntries(questions.map((q, i) => [q.id, Number(code[i + 1])]));
  const {domains} = applyNorms(scoreAssessment(questions, answers), norms);
  return profileName(domains, 'en').ruleId.replace('profile-name-v2/', '');
}

/** {total, counts} from a list of answer codes, with the privacy thresholds applied. */
export function aggregate(codes) {
  const all = {};
  let total = 0;
  for (const code of codes) { const k = nameKey(code); if (k) { all[k] = (all[k] || 0) + 1; total++; } }
  if (total < MIN_TOTAL) return {total, minTotal: MIN_TOTAL, counts: {}};
  return {total, minTotal: MIN_TOTAL, counts: Object.fromEntries(Object.entries(all).filter(([, n]) => n >= MIN_COUNT))};
}

async function savedCodes(env) {
  const key = env.SUPABASE_SERVICE_ROLE_KEY, headers = {apikey: key};
  if (!String(key).startsWith('sb_')) headers.Authorization = `Bearer ${key}`;
  const codes = [];
  for (let from = 0; ; from += PAGE) {
    const r = await fetch(`${env.SUPABASE_URL}/rest/v1/profiles?select=answers&order=user_id&offset=${from}&limit=${PAGE}`, {headers});
    if (!r.ok) throw new Error(`Supabase ${r.status}`);
    const rows = await r.json();
    codes.push(...rows.map(x => x.answers));
    if (rows.length < PAGE) return codes;
  }
}

let cache = null;
/** GET /api/name-stats → {total, minTotal, counts}. Cached per instance for CACHE_MS. */
export async function nameStats(env = process.env, now = Date.now()) {
  if (!configured(env)) return {status: 503, body: {error: 'Not configured.'}};
  if (cache && now - cache.at < CACHE_MS) return {status: 200, body: cache.body};
  try {
    const body = aggregate(await savedCodes(env));
    cache = {at: now, body};
    return {status: 200, body};
  } catch (e) {
    console.warn('name-stats failed:', e.message);
    return {status: 502, body: {error: 'Could not read the statistics.'}};
  }
}
