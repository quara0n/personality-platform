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
  // Method, shown in a speech bubble behind the (i) by the number (Rune 2026-10-20: «faglig tyngde»).
  // Not «multiplied probabilities»: the calculation keeps that facets go together.
  const method = s.source === 'kaleido'
    ? [[`Counted among ${people} saved Kaleido profiles.`, 'Only totals are used, never who has which character.'],
      [`Talt opp blant ${people} lagrede Kaleido-profiler.`, 'Bare totalene brukes, aldri hvem som har hvilken figur.']]
    : [['Calculated from the research data behind the test: the answers of 243,307 participants in a large open study of this questionnaire (Kajonius & Johnson, 2019).',
        'We worked out how often this exact combination of facets turns up among a million people modelled on those answers, taking into account that facets go together. Once enough Kaleido profiles are saved, we switch to real counts.'],
      ['Beregnet fra forskningsdataene bak testen: svarene til 243\u00a0307 deltakere i en stor, åpen studie av dette spørreskjemaet (Kajonius og Johnson, 2019).',
        'Vi regnet ut hvor ofte akkurat denne kombinasjonen av fasetter dukker opp blant en million personer modellert etter disse svarene, og tok hensyn til at fasettene henger sammen. Når nok Kaleido-profiler er lagret, bytter vi til ekte tall.']];
  return {tag: pick(tag, language), line: pick(line, language), method: pick(method, language)};
}

let popId = 0;
/** Uses the app's (i) button and pop (.d-info-btn / .d-info-pop, toggled in app/ui.js). */
export function rarityHtml(ruleId, estimates, real, language) {
  const s = nameShare(ruleId, estimates, real);
  if (!s) return '';
  const c = rarityCopy(s, language), id = `rarity-info-${++popId}`, label = pick(['How is this calculated?', 'Hvordan er dette regnet ut?'], language);
  const btn = `<button type="button" class="d-info-btn" aria-expanded="false" aria-controls="${id}" aria-label="${label}" title="${label}"><span class="d-info-i" aria-hidden="true">i</span></button>`;
  return `<span class="d-name-rarity-tag">${c.tag}</span><p class="d-name-rarity-line">${c.line.replace('</b>', `</b>\u00a0${btn}`)}</p><div class="d-info-pop d-name-rarity-pop" id="${id}" hidden>${c.method.map(t => `<p>${t}</p>`).join('')}</div>`;
}

let estimatesPromise, realPromise, loaded = {estimates: null, real: null};
const getJson = url => fetch(url).then(r => r.ok ? r.json() : null).catch(() => null);

/** Short line for the share video, from data already loaded on the page («Omtrent 1 av 3 600 får denne figuren»), or ''. */
export function rarityShort(ruleId, language, data = loaded) {
  const s = nameShare(ruleId, data.estimates, data.real);
  if (!s || !s.share) return '';
  const pct = s.share >= 1 / 100, x = Math.round(s.share * 100), n = roundPeople(1 / s.share, language);
  return language === 'no' ? `Omtrent ${pct ? `${x} av 100` : `1 av ${n}`} får denne figuren` : `About ${pct ? `${x} in 100` : `1 in ${n}`} people get this character`;
}
/** Fills every [data-name-rarity="<ruleId>"] on the page. `live` asks the server for real counts. */
export async function paintRarity(language, live = false) {
  estimatesPromise ||= getJson('data/name-frequencies.json');
  if (live) realPromise ||= getJson('api/name-stats');
  const [estimates, real] = await Promise.all([estimatesPromise, live ? realPromise : null]);
  loaded = {estimates, real};
  document.querySelectorAll('[data-name-rarity]').forEach(el => {
    const html = rarityHtml(el.dataset.nameRarity, estimates, real, language);
    el.innerHTML = html;
    el.hidden = !html;
  });
}
