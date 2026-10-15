// Facet illustrations. Facets with a woman/man version follow the reader's picture choice
// (fem-report-figure-v1); without a choice they show the default version listed here.
// The neutral file facets/<code>.webp is a copy of the default, for places that ignore the choice.
export const facetFigure = {O1: 'female', O2: 'female', O3: 'male', O4: 'female', O5: 'female', O6: 'male'};

export function facetArt(code, figure) {
  const fallback = facetFigure[code];
  if (!fallback) return code;
  return `${figure === 'female' || figure === 'male' ? figure : fallback}/${code}`;
}
