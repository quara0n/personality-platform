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
