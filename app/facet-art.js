// Facet illustrations. Facets with a woman/man version follow the reader's picture choice
// (fem-report-figure-v1); without a choice they show the default version listed here.
// The neutral file facets/<code>.webp is a copy of the default, for places that ignore the choice.
export const facetFigure = {O1: 'female', O2: 'female', O3: 'male', O4: 'female', O5: 'female', O6: 'male',
  C1: 'female', C2: 'male', C3: 'female', C4: 'female', C5: 'male', C6: 'female',
  E1: 'male', E2: 'male', E3: 'male', E4: 'female', E5: 'male', E6: 'female',
  A1: 'male', A2: 'male', A3: 'female', A4: 'female', A5: 'male', A6: 'male',
  N1: 'female', N2: 'male', N3: 'female', N4: 'male', N5: 'female', N6: 'male'};

export function facetArt(code, figure) {
  const fallback = facetFigure[code];
  if (!fallback) return code;
  return `${figure === 'female' || figure === 'male' ? figure : fallback}/${code}`;
}
