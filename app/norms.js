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

/** Adds `percentile` to each domain and facet when a norm table for this instrument is available. */
export function withPercentiles(report, norms) {
  if (!norms?.scales || (report.instrumentVersion && norms.instrumentVersion !== report.instrumentVersion)) return report;
  const pct = x => percentile(norms.scales[x.code], x.sum);
  const domains = report.domains.map(d => ({...d, percentile: pct(d), facets: d.facets.map(f => ({...f, percentile: pct(f)}))}));
  const byCode = Object.fromEntries(domains.flatMap(d => d.facets).map(f => [f.code, f]));
  const swap = list => list?.map(f => byCode[f.code] ? {...f, percentile: byCode[f.code].percentile} : f);
  const one = f => f && byCode[f.code] ? {...f, percentile: byCode[f.code].percentile} : f;
  const ref = norms.reference || {};
  return {...report, domains: domains.map(d => ({...d, contextFacets: swap(d.contextFacets), pattern: {...d.pattern, high: one(d.pattern?.high), low: one(d.pattern?.low)}})), nextSteps: swap(report.nextSteps),
    norms: {version: norms.normVersion, n: ref.n, collected: (ref.collectedYears || []).join('–')}};
}
