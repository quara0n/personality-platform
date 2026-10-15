// "X of 100" line on the facet cards, e.g. «Ut fra svarene dine blir du lettere irritert enn omtrent
// 85 av 100.» From percentile 50 and up the higher pole is used with the percentile; below 50 the
// lower pole is used with 100 minus the percentile, so the sentence always reads as a plain
// comparison and never as a lack. Based on the person's own answers, compared with the reference group.
import {shownPercentile} from './norms.js';

// code: [higher EN, higher NO, lower EN, lower NO]; each completes "You … than about N in 100" / "Du … enn omtrent N av 100".
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
  A2: ['put more weight on honesty and fair play', 'legger mer vekt på ærlighet og fair play', 'are more strategic in what you share', 'er mer strategisk med hva du deler'],
  A3: ['offer help more readily', 'tilbyr lettere hjelp', 'are more selective about helping', 'er mer selektiv med å hjelpe'],
  A4: ['avoid conflict more', 'unngår konflikt mer', 'take on disagreement more readily', 'tar lettere en uenighet'],
  A5: ['play down your achievements more', 'toner oftere ned egne prestasjoner', 'are more comfortable highlighting your strengths', 'er mer komfortabel med å fremheve styrkene dine'],
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
  const p = shownPercentile(f.percentile), up = p >= 50, n = up ? p : 100 - p, no = language === 'no';
  const phrase = pair[(up ? 0 : 2) + (no ? 1 : 0)];
  return no ? `Ut fra svarene dine ${phrase.replace(/^(\S+) /, '$1 du ')} enn omtrent ${n} av 100.`
    : `Based on your answers, you ${phrase} than about ${n} in 100 people.`;
}
