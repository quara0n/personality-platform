// Preview only: a fixed test profile for Rune (2026-10-15), so the career questions can be tried
// against a realistic profile. Remove together with the «Random» shortcut before launch.
// Rune gave the broad traits (reactivity below average, openness very high, conscientiousness middle,
// extraversion and agreeableness middle-plus). The facet targets are a plausible guess around those.
export const RUNE_TARGETS = {
  N: 28, N1: 30, N2: 35, N3: 20, N4: 25, N5: 45, N6: 22,
  E: 62, E1: 75, E2: 55, E3: 60, E4: 65, E5: 50, E6: 70,
  O: 92, O1: 85, O2: 80, O3: 85, O4: 90, O5: 95, O6: 75,
  A: 62, A1: 65, A2: 60, A3: 78, A4: 50, A5: 40, A6: 72,
  C: 50, C1: 70, C2: 28, C3: 55, C4: 60, C5: 45, C6: 40
};

const pctOf = (scale, sum) => {
  const e = scale?.lookup?.find(x => x.sum === sum);
  return e && scale.n ? 100 * (e.below + 0.5 * e.count) / scale.n : 0;
};

/**
 * Builds 120 raw answers whose facet and domain percentiles land as close to `targets` as the
 * four-item facets allow. Without norms, sums are placed linearly on the 4–20 scale.
 */
export function profileAnswers(questions, norms, targets = RUNE_TARGETS) {
  const scales = norms?.scales;
  const p = (code, sum) => scales?.[code] ? pctOf(scales[code], sum) : 100 * (sum - (code.length === 1 ? 24 : 4)) / (code.length === 1 ? 96 : 16);
  const sums = {};
  for (const d of ['N', 'E', 'O', 'A', 'C']) {
    const codes = [1, 2, 3, 4, 5, 6].map(i => d + i);
    for (const c of codes) {
      let best = 4;
      for (let s = 4; s <= 20; s++) if (Math.abs(p(c, s) - targets[c]) < Math.abs(p(c, best) - targets[c])) best = s;
      sums[c] = best;
    }
    // Nudge facet sums one step at a time until the domain percentile is close to its target too.
    const cost = () => codes.reduce((t, c) => t + Math.abs(p(c, sums[c]) - targets[c]), 0) + 1.5 * Math.abs(p(d, codes.reduce((t, c) => t + sums[c], 0)) - targets[d]);
    for (let round = 0; round < 40; round++) {
      let current = cost(), move = null;
      for (const c of codes) for (const step of [-1, 1]) {
        const s = sums[c] + step;
        if (s < 4 || s > 20) continue;
        sums[c] = s;
        const next = cost();
        sums[c] -= step;
        if (next < current - 1e-9) { current = next; move = [c, step]; }
      }
      if (!move) break;
      sums[move[0]] += move[1];
    }
  }
  const answers = {};
  for (const d of ['N', 'E', 'O', 'A', 'C']) for (let i = 1; i <= 6; i++) {
    const items = questions.filter(q => q.domain === d && q.facet === i);
    const total = sums[d + i], base = Math.floor(total / 4);
    items.forEach((q, k) => {
      const keyed = base + (k < total - base * 4 ? 1 : 0);
      answers[q.id] = q.keyed === 'minus' ? 6 - keyed : keyed;
    });
  }
  return answers;
}
