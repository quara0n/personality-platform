// Builds app/data/name-frequencies.json: how often each profile name (profile-name ruleId) would come out
// in the reference population, so the profile can say «About 3 in 100 people get this profile character»
// before Kaleido has enough saved profiles of its own (Rune 2026-10-20: «kombo-statistikk»).
// The raw norm records are not in the repository, only the per-scale sum tables, so this is a model:
// simulated people whose 30 facet sums follow the norm table exactly (app/data/norms-us.json), with
// facets of the same trait correlated through a shared trait factor (loading LOADING) and the five traits
// correlated as in the meta-analysis below. Each simulated person is scored with the app's own
// percentile and naming code, so the counts follow every naming rule.
// Run: node scripts/build_name_frequencies.js   (deterministic: fixed seed and N)
import {readFile, writeFile} from 'node:fs/promises';
import {percentile, bandFromPercentile} from '../app/norms.js';
import {profileName} from '../app/profile-name.js';

const root = new URL('../', import.meta.url);
const N = 1_000_000, SEED = 20261020, LOADING = 0.65;
// Big Five intercorrelations, van der Linden, te Nijenhuis & Bakker (2010), J. Research in Personality 44,
// 315–327, meta-analysis (N = 144 117). Order O C E A N; N is Neuroticism (high = more reactive), as in the app.
const ORDER = 'OCEAN';
const R = [
  [1, .20, .43, .21, -.17],
  [.20, 1, .29, .43, -.43],
  [.43, .29, 1, .26, -.36],
  [.21, .43, .26, 1, -.36],
  [-.17, -.43, -.36, -.36, 1]
];

// Cholesky factor of R.
const L = R.map(() => Array(5).fill(0));
for (let i = 0; i < 5; i++) for (let j = 0; j <= i; j++) {
  let s = R[i][j];
  for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
  L[i][j] = i === j ? Math.sqrt(s) : s / L[j][j];
}

// mulberry32 + Box–Muller: reproducible across machines.
let state = SEED;
const rand = () => { state = (state + 0x6D2B79F5) | 0; let t = Math.imul(state ^ (state >>> 15), 1 | state); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
let spare = null;
const z = () => { if (spare !== null) { const s = spare; spare = null; return s; } let u = 0; while (!u) u = rand(); const v = rand(), r = Math.sqrt(-2 * Math.log(u)); spare = r * Math.sin(2 * Math.PI * v); return r * Math.cos(2 * Math.PI * v); };
// Normal CDF (Abramowitz–Stegun 7.1.26 erf, error < 1.5e-7).
const cdf = x => { const t = 1 / (1 + 0.3275911 * Math.abs(x) / Math.SQRT2), y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x / 2); return x >= 0 ? (1 + y) / 2 : (1 - y) / 2; };

const norms = JSON.parse(await readFile(new URL('app/data/norms-us.json', root), 'utf8'));
// Per facet: cumulative share at the top of each sum, so a quantile maps to the sum the norm table gives.
const facets = [...ORDER].flatMap(d => [1, 2, 3, 4, 5, 6].map(i => `${d}${i}`));
const tables = Object.fromEntries(facets.map(code => {
  const s = norms.scales[code];
  return [code, s.lookup.map(x => ({sum: x.sum, top: (x.below + x.count) / s.n, percentile: percentile(s, x.sum)}))];
}));
const fromQuantile = (code, u) => tables[code].find(x => x.top >= u) || tables[code].at(-1);

const counts = {}, unique = Math.sqrt(1 - LOADING * LOADING);
for (let n = 0; n < N; n++) {
  const e = [z(), z(), z(), z(), z()];
  const trait = L.map(row => row.reduce((s, l, k) => s + l * e[k], 0));
  const domains = [...ORDER].map((d, i) => ({code: d, band: 'middle', facets: [1, 2, 3, 4, 5, 6].map(f => {
    const code = `${d}${f}`, p = fromQuantile(code, cdf(LOADING * trait[i] + unique * z())).percentile;
    return {code, percentile: p, band: bandFromPercentile(p)};
  })}));
  const id = profileName(domains, 'en').ruleId.replace('profile-name-v2/', '');
  counts[id] = (counts[id] || 0) + 1;
}

const sortedCounts = Object.fromEntries(Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
const out = {
  schemaVersion: 1,
  version: 'profile-name-v2-model-2026-10-20-v1',
  normVersion: norms.normVersion,
  method: `Simulation of ${N} people. Facet sums follow the norm table exactly; facets share a trait factor (loading ${LOADING}); the five traits correlate as in van der Linden, te Nijenhuis & Bakker (2010). Each person is named with app/profile-name.js. An estimate, not a count of real people.`,
  n: N,
  counts: sortedCounts
};
await writeFile(new URL('app/data/name-frequencies.json', root), JSON.stringify(out) + '\n');
const values = Object.values(sortedCounts);
console.log(`${values.length} names. Most common: ${Object.entries(sortedCounts).slice(0, 5).map(([k, v]) => `${k} ${(100 * v / N).toFixed(2)}%`).join(', ')}. Median share ${(100 * values[Math.floor(values.length / 2)] / N).toFixed(4)}%.`);
