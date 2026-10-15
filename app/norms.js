// Percentile ranks against the aggregated US reference table (app/data/norms-us.json,
// built by scripts/build_norms.py from Kajonius & Johnson 2019, CC BY 4.0).
// Midrank: P = 100 × (below + 0.5 × count) / n. Whole numbers use floor(P + 0.5).

/** Returns the rounded midrank percentile (0–100) for an integer keyed sum, or null. */
export function percentile(scale, sum) {
  if (!scale || !Array.isArray(scale.lookup) || !Number.isInteger(sum)) return null;
  const entry = scale.lookup.find(x => x.sum === sum);
  if (!entry || !scale.n) return null;
  return Math.floor(100 * (entry.below + 0.5 * entry.count) / scale.n + 0.5);
}

/** Display-only rule: empirical extremes that round to 0 or 100 are shown as 1 or 99. */
export const shownPercentile = p => Math.min(99, Math.max(1, p));

/** Level words follow the percentile when a norm table exists: below 30 lower, above 70 higher. */
export const bandFromPercentile = p => p < 30 ? 'low' : p > 70 ? 'high' : 'middle';

/**
 * Adds `percentile` to each domain and facet of a scored result and sets `band` from it, so that
 * level words and all band-selected text agree with the percentile. `meanBand` keeps the 1–5 rule.
 * Without a matching norm table the result is returned unchanged (mean-based bands).
 */
export function applyNorms(result, norms) {
  if (!norms?.scales || (result.instrumentVersion && norms.instrumentVersion !== result.instrumentVersion)) return result;
  const add = x => { const p = percentile(norms.scales[x.code], x.sum); return p === null ? x : {...x, percentile: p, meanBand: x.band, band: bandFromPercentile(p)}; };
  const ref = norms.reference || {};
  return {...result, domains: result.domains.map(d => ({...add(d), facets: d.facets.map(add)})),
    norms: {version: norms.normVersion, n: ref.n, collected: (ref.collectedYears || []).join('–')}};
}

/**
 * Test shortcut only: random answers that look like a person from the reference group. Uniform
 * random answers sit near 3, which is well below the norm median for Agreeableness and
 * Conscientiousness, so almost every random profile came out "Direct" and "Flexible".
 * Each facet gets a quantile from a trait-level draw plus its own (correlation about 0.75),
 * the keyed facet sum at that quantile is taken from the norm table and split over its four items.
 */
export function sampleAnswers(questions, norms, rand = Math.random) {
  const z = () => { let u = 0, v = 0; while (!u) u = rand(); while (!v) v = rand(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const cdf = x => 1 / (1 + Math.exp(-1.702 * x)); // logistic approximation of the normal CDF
  const trait = {}, answers = {};
  for (const code of 'OCEAN') trait[code] = z();
  const byFacet = {};
  for (const q of questions) (byFacet[`${q.domain}${q.facet}`] ||= []).push(q);
  for (const [code, items] of Object.entries(byFacet)) {
    const scale = norms?.scales?.[code], u = cdf(.75 * trait[code[0]] + .66 * z());
    const entry = scale?.lookup?.find(x => (x.below + x.count) / scale.n >= u) || scale?.lookup?.at(-1);
    let sum = entry ? entry.sum : 4 + Math.floor(rand() * 17);
    const keyed = items.map(() => 1);
    for (sum -= items.length; sum > 0; sum--) { const open = keyed.map((v, i) => v < 5 ? i : -1).filter(i => i >= 0); keyed[open[Math.floor(rand() * open.length)]]++; }
    items.forEach((q, i) => { answers[q.id] = q.keyed === 'minus' ? 6 - keyed[i] : keyed[i]; });
  }
  return answers;
}
