// Percentile ranks against an aggregated reference distribution (app/data/norms-us.json).
// P = 100 × (lower + 0.5 × equal) / N, shown as a whole number between 1 and 99.

export function percentile(dist, sum) {
  if (!dist || !Array.isArray(dist.counts)) return null;
  const i = Math.round(sum) - dist.min;
  const n = dist.counts.reduce((a, b) => a + b, 0);
  if (!n || i < 0 || i >= dist.counts.length) return null;
  const lower = dist.counts.slice(0, i).reduce((a, b) => a + b, 0);
  return Math.min(99, Math.max(1, Math.round(100 * (lower + 0.5 * dist.counts[i]) / n)));
}

/** Adds `percentile` to each domain and facet when a norm table is available. */
export function withPercentiles(report, norms) {
  if (!norms) return report;
  const domains = report.domains.map(d => ({
    ...d,
    percentile: percentile(norms.domains?.[d.code], d.sum),
    facets: d.facets.map(f => ({...f, percentile: percentile(norms.facets?.[f.code], f.sum)}))
  }));
  const byCode = Object.fromEntries(domains.flatMap(d => d.facets).map(f => [f.code, f]));
  const swap = list => list?.map(f => byCode[f.code] ? {...f, percentile: byCode[f.code].percentile} : f);
  return {...report, domains: domains.map(d => ({...d, contextFacets: swap(d.contextFacets), pattern: {...d.pattern, high: byCode[d.pattern?.high?.code] ? {...d.pattern.high, percentile: byCode[d.pattern.high.code].percentile} : d.pattern?.high, low: byCode[d.pattern?.low?.code] ? {...d.pattern.low, percentile: byCode[d.pattern.low.code].percentile} : d.pattern?.low}})), nextSteps: swap(report.nextSteps), norms: {version: norms.normVersion, n: norms.n, collected: norms.collected}};
}
