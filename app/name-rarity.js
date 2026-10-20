// How common the profile character is («kombo-statistikk», Rune 2026-10-20): «About 1 in 5,300 people
// get this profile character». Until enough Kaleido profiles are saved, the share is an estimate from the
// norm data (app/data/name-frequencies.json, built by scripts/build_name_frequencies.js). Once the server
// reports enough saved profiles (api/name-stats, aggregate counts only), the real share is used for every
// name that has at least MIN_COUNT profiles. The line always says where the number comes from.
// Numbers are said in people, never percent (same rule as the facet cards).
export const MIN_COUNT = 10;
const keyOf = ruleId => String(ruleId || '').replace('profile-name-v2/', '');
const pick = (pair, language) => pair[language === 'no' ? 1 : 0];

/** Two significant digits, grouped: 5263 → «5 300» / «5,300». */
export function roundPeople(n, language) {
  const digits = Math.max(0, Math.floor(Math.log10(n)) - 1), r = Math.round(n / 10 ** digits) * 10 ** digits;
  return String(r).replace(/\B(?=(\d{3})+(?!\d))/g, language === 'no' ? ' ' : ',');
}

/** {share, source: 'kaleido' | 'estimate', total} for a profile-name ruleId, or null without data. */
export function nameShare(ruleId, estimates, real) {
  const key = keyOf(ruleId);
  if (real?.counts && real.total > 0 && (real.counts[key] || 0) >= MIN_COUNT) return {share: real.counts[key] / real.total, source: 'kaleido', total: real.total};
  if (!estimates?.counts || !estimates.n) return null;
  return {share: (estimates.counts[key] || 0) / estimates.n, source: 'estimate', total: estimates.n};
}

/** Tag, sentence (with <b> around the number) and source line. All text is ours, so nothing needs escaping. */
export function rarityCopy(s, language) {
  const tag = s.share >= 1 / 100 ? ['One of the more common characters', 'En av de vanligere figurene']
    : s.share >= 1 / 1000 ? ['Uncommon combination', 'Uvanlig kombinasjon']
    : s.share >= 1 / 10000 ? ['Rare combination', 'Sjelden kombinasjon'] : ['Very rare combination', 'Svært sjelden kombinasjon'];
  let amount;
  if (!s.share) amount = ['Fewer than 1 in 100,000', 'Færre enn 1 av 100 000'];
  else if (s.share >= 1 / 100) { const x = Math.round(s.share * 100); amount = [`${x} in 100`, `${x} av 100`]; }
  else { const n = roundPeople(1 / s.share, 'en'), m = roundPeople(1 / s.share, 'no'); amount = [`1 in ${n}`, `1 av ${m}`]; }
  const lead = s.share ? ['About', 'Omtrent'] : ['', ''];
  const line = [`${lead[0]} <b>${amount[0]}</b> people get this profile character.`.trim(), `${lead[1]} <b>${amount[1]}</b> mennesker får denne profilfiguren.`.trim()];
  const people = roundPeople(s.total, language);
  const source = s.source === 'kaleido'
    ? [`Based on ${people} saved Kaleido profiles.`, `Bygger på ${people} lagrede Kaleido-profiler.`]
    : ['Calculated from the research data behind the test: we worked out how often this exact combination of facets turns up among a million people, modelled on the answers of 243,307 participants.', 'Beregnet fra forskningsdataene bak testen: vi regnet ut hvor ofte akkurat denne kombinasjonen av fasetter dukker opp blant en million personer, modellert etter svarene til 243\u00a0307 deltakere.'];
  return {tag: pick(tag, language), line: pick(line, language), source: pick(source, language)};
}

export function rarityHtml(ruleId, estimates, real, language) {
  const s = nameShare(ruleId, estimates, real);
  if (!s) return '';
  const c = rarityCopy(s, language);
  return `<span class="d-name-rarity-tag">${c.tag}</span><p class="d-name-rarity-line">${c.line}</p><p class="d-name-rarity-source">${c.source}</p>`;
}

let estimatesPromise, realPromise;
const getJson = url => fetch(url).then(r => r.ok ? r.json() : null).catch(() => null);
/** Fills every [data-name-rarity="<ruleId>"] on the page. `live` asks the server for real counts. */
export async function paintRarity(language, live = false) {
  estimatesPromise ||= getJson('data/name-frequencies.json');
  if (live) realPromise ||= getJson('api/name-stats');
  const [estimates, real] = await Promise.all([estimatesPromise, live ? realPromise : null]);
  document.querySelectorAll('[data-name-rarity]').forEach(el => {
    const html = rarityHtml(el.dataset.nameRarity, estimates, real, language);
    el.innerHTML = html;
    el.hidden = !html;
  });
}
