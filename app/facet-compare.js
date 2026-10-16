// "X of 100 people" line on the facet cards. The number is always the percentile itself, the same
// number as on the card, so the reader can compare it directly: «Når det gjelder orden, skårer du
// høyere enn omtrent 27 av 100 mennesker, så du ligger litt lavere enn de fleste.» Above 70 the
// higher pole carries the sentence («… liker du mer orden enn omtrent 85 av 100 mennesker»).
// Based on the person's own answers, compared with the reference group.
import {shownPercentile} from './norms.js';

// code: [higher EN, higher NO, lower EN, lower NO]; each completes "You … than about N in 100" / "Du … enn omtrent N av 100".
// Only the higher pole is used in compareLine today; the lower pole is kept for other copy.
export const poles = {
  N1: ['worry more', 'bekymrer deg mer', 'worry less', 'bekymrer deg mindre'],
  N2: ['get irritated more easily', 'blir lettere irritert', 'get irritated less often', 'blir sjeldnere irritert'],
  N3: ['feel low more often', 'føler deg oftere nedstemt', 'feel low less often', 'føler deg sjeldnere nedstemt'],
  N4: ['feel more uneasy when others notice you', 'kjenner mer ubehag når andre legger merke til deg', 'feel more at ease when others notice you', 'kjenner deg tryggere når andre legger merke til deg'],
  N5: ['find temptations harder to resist', 'har vanskeligere for å motstå fristelser', 'find temptations easier to resist', 'har lettere for å motstå fristelser'],
  N6: ['feel overwhelmed under pressure more easily', 'blir lettere overveldet under press', 'stay calmer under pressure', 'holder deg roligere under press'],
  E1: ['find it easier to warm to new people', 'har lettere for å bli kjent med nye folk', 'are more reserved with new people', 'er mer tilbakeholden med nye folk'],
  E2: ['enjoy big groups more', 'trives bedre i store grupper', 'prefer small groups or time alone more', 'foretrekker oftere små grupper eller tid alene'],
  E3: ['take charge more readily', 'tar lettere styringen', 'leave the lead to others more often', 'lar oftere andre ta styringen'],
  E4: ['like a busier pace', 'liker et travlere tempo', 'like a calmer pace', 'liker et roligere tempo'],
  E5: ['seek excitement more', 'søker mer spenning', 'seek excitement less', 'søker mindre spenning'],
  E6: ['express high spirits more often', 'viser oftere lystighet og glede', 'express high spirits less often', 'viser sjeldnere lystighet og glede'],
  O1: ['daydream and imagine more', 'dagdrømmer og fantaserer mer', 'prefer the concrete over the imagined more', 'foretrekker oftere det konkrete fremfor det fantaserte'],
  O2: ['care more about art and beauty', 'bryr deg mer om kunst og skjønnhet', 'care less about art and beauty', 'bryr deg mindre om kunst og skjønnhet'],
  O3: ['notice your feelings more', 'legger mer merke til følelsene dine', 'notice your feelings less', 'legger mindre merke til følelsene dine'],
  O4: ['seek variety more', 'søker mer variasjon', 'prefer the familiar more', 'foretrekker oftere det kjente'],
  O5: ['enjoy abstract ideas more', 'liker abstrakte ideer bedre', 'prefer practical problems more', 'foretrekker oftere praktiske problemer'],
  O6: ['question conventions more', 'stiller oftere spørsmål ved konvensjoner', 'value established conventions more', 'legger mer vekt på etablerte konvensjoner'],
  A1: ['trust others more readily', 'stoler lettere på andre', 'are more cautious about trusting others', 'er mer forsiktig med å stole på andre'],
  A2: ['put more weight on honesty and fair play', 'legger mer vekt på ærlighet og redelighet', 'are more strategic in what you share', 'er mer strategisk med hva du deler'],
  A3: ['offer help more readily', 'tilbyr lettere hjelp', 'are more selective about helping', 'er mer nøye med når du hjelper'],
  A4: ['avoid conflict more', 'unngår konflikt mer', 'take on disagreement more readily', 'går lettere inn i en uenighet'],
  A5: ['play down your achievements more', 'toner oftere ned egne prestasjoner', 'are more comfortable highlighting your strengths', 'har lettere for å fremheve styrkene dine'],
  A6: ['are more moved by others’ difficulties', 'blir mer berørt av andres vanskeligheter', 'focus more on the practical side of others’ problems', 'ser mer på den praktiske siden av andres problemer'],
  C1: ['feel more sure you can handle tasks', 'føler deg tryggere på at du mestrer oppgaver', 'feel less sure you can handle tasks', 'føler deg mindre trygg på at du mestrer oppgaver'],
  C2: ['like more order around you', 'liker mer orden rundt deg', 'live more easily with mess', 'lever lettere med rot'],
  C3: ['take rules and promises more seriously', 'tar regler og løfter mer alvorlig', 'treat rules and promises more loosely', 'forholder deg løsere til regler og løfter'],
  C4: ['push harder towards demanding goals', 'presser deg hardere mot krevende mål', 'are more content with doing what is needed', 'er oftere fornøyd med å gjøre det som trengs'],
  C5: ['get started on tasks more easily', 'kommer lettere i gang med oppgaver', 'find it harder to get started on tasks', 'har vanskeligere for å komme i gang med oppgaver'],
  C6: ['think things through more before acting', 'tenker deg mer om før du handler', 'decide more quickly', 'bestemmer deg raskere']
};

/** One sentence comparing the facet with the reference group, or '' without a percentile. */
export function compareLine(f, language) {
  const pair = poles[f.code];
  if (!pair || !Number.isFinite(f.percentile)) return '';
  const p = shownPercentile(f.percentile), no = language === 'no';
  const name = String(f.name || '').replace(/^\p{Lu}(?!\p{Lu})/u, c => c.toLowerCase());
  if (p > 70 || !name) {
    const phrase = pair[no ? 1 : 0];
    return no ? `Ut fra svarene dine ${phrase.replace(/^(\S+) /, '$1 du ')} enn omtrent ${p} av 100 mennesker.`
      : `Based on your answers, you ${phrase} than about ${p} in 100 people.`;
  }
  const head = no ? `Når det gjelder ${name}, skårer du høyere enn omtrent ${p} av 100 mennesker`
    : `For ${name}, you score higher than about ${p} in 100 people`;
  if (p < 10) return no ? `${head}. De fleste ligger altså over deg her.` : `${head}. So most people sit above you here.`;
  if (p < 30) return no ? `${head}, så du ligger litt lavere enn de fleste.` : `${head}, so you sit a little lower than most.`;
  if (p < 50) return no ? `${head}. Det er litt under midten.` : `${head}. That is a little below the middle.`;
  if (p === 50) return no ? `${head}. Det er midt på.` : `${head}. That is right in the middle.`;
  return no ? `${head}. Det er litt over midten.` : `${head}. That is a little above the middle.`;
}

/** Number of people in the comparison: the percentile, so it matches the number on the card. */
export function compareCount(f) {
  if (!Number.isFinite(f.percentile)) return null;
  return shownPercentile(f.percentile);
}

/** The sentence followed by 100 small figures, the first N (the people you score higher than) in the trait colour.
 *  No caption under the figures: the sentence above already gives the number (Rune, 2026-10-16). */
export function compareHtml(f, language, color, esc) {
  const line = compareLine(f, language), n = compareCount(f);
  if (!line) return '';
  let figs = '';
  for (let i = 0; i < 100; i++) {
    const x = (i % 20) * 14 + 7, y = Math.floor(i / 20) * 20 + 4;
    figs += `<g class="d-cmp-person${i < n ? ' is-lit' : ''}"><circle cx="${x}" cy="${y}" r="3.2"/><path d="M${x - 5} ${y + 13}v-3.5a5 5 0 0 1 10 0v3.5z"/></g>`;
  }
  const no = language === 'no', rest = no ? 'av 100 mennesker skårer lavere enn deg' : 'in 100 people score lower than you';
  return `<p class="d-compare">${esc(line)}</p><figure class="d-cmp" style="--lit:${color}"><svg viewBox="0 0 280 100" role="img" aria-label="${esc(`${n} ${rest}`)}">${figs}</svg></figure>`;
}
