// "Your combination": one sentence on how the two most distinctive traits may play together.
// Chosen deterministically from the two traits furthest from the middle (higher or lower range),
// so the sentence stays traceable to the scores. [English, Norwegian bokmål]; editorial reflection
// copy written in the cautious "may" form used elsewhere in the report, not a validated claim.

const words = {
  O: {high: ['Curious', 'Nysgjerrig'], low: ['Down-to-earth', 'Jordnær']},
  C: {high: ['Structured', 'Strukturert'], low: ['Flexible', 'Fleksibel']},
  E: {high: ['Outgoing', 'Utadvendt'], low: ['Quiet', 'Stillferdig']},
  A: {high: ['Considerate', 'Omtenksom'], low: ['Direct', 'Direkte']},
  N: {high: ['Sensitive to pressure', 'Følsom for press'], low: ['Calm', 'Rolig']}
};

// Key: first trait + h/l, second trait + h/l, in the order O C E A N.
const pairs = {
  OhCh: ['You may enjoy new ideas most when you can turn them into a plan and see them through.', 'Du kan like nye ideer best når du kan gjøre dem om til en plan og fullføre dem.'],
  OhCl: ['You may follow ideas where they lead, and benefit from a simple way to finish the best ones.', 'Du kan følge ideer dit de leder, og ha nytte av en enkel måte å fullføre de beste på.'],
  OlCh: ['You may prefer proven methods and carry them out carefully and reliably.', 'Du kan foretrekke utprøvde metoder og gjennomføre dem grundig og pålitelig.'],
  OlCl: ['You may take things as they come and solve practical problems as they arise.', 'Du kan ta ting som de kommer og løse praktiske problemer etter hvert som de dukker opp.'],
  OhEh: ['You may like exploring new ideas together with others, in conversation.', 'Du kan like å utforske nye ideer sammen med andre, i samtale.'],
  OhEl: ['You may explore ideas mostly in your own head, and share them when they are ready.', 'Du kan utforske ideer mest i ditt eget hode og dele dem når de er klare.'],
  OlEh: ['You may enjoy people and get practical things moving together with them.', 'Du kan trives med folk og få praktiske ting i gang sammen med dem.'],
  OlEl: ['You may prefer steady, familiar routines and calm surroundings.', 'Du kan foretrekke stabile, kjente rutiner og rolige omgivelser.'],
  OhAh: ['You may be open to other people’s views and interested in how they see things.', 'Du kan være åpen for andres syn og interessert i hvordan de ser ting.'],
  OhAl: ['You may enjoy testing ideas through debate and challenging assumptions.', 'Du kan like å prøve ut ideer gjennom diskusjon og utfordre antakelser.'],
  OlAh: ['You may show care in practical ways, through help that is concrete.', 'Du kan vise omtanke på praktiske måter, gjennom hjelp som er konkret.'],
  OlAl: ['You may be quick to say when something does not seem to work in practice.', 'Du kan raskt si fra når noe ikke ser ut til å fungere i praksis.'],
  OhNh: ['You may notice many possibilities, and also what could go wrong with them.', 'Du kan se mange muligheter, og også hva som kan gå galt med dem.'],
  OhNl: ['You may try new things without worrying much about how they will turn out.', 'Du kan prøve nye ting uten å bekymre deg mye for hvordan det går.'],
  OlNh: ['You may find security in what is familiar when pressure builds.', 'Du kan finne trygghet i det kjente når presset øker.'],
  OlNl: ['You may stay steady and practical when things get uncertain.', 'Du kan holde deg stødig og praktisk når ting blir usikre.'],
  ChEh: ['You may like to organise people and get shared plans moving.', 'Du kan like å organisere folk og få felles planer i gang.'],
  ChEl: ['You may work steadily and thoroughly, preferably with room to concentrate.', 'Du kan jobbe jevnt og grundig, helst med ro til å konsentrere deg.'],
  ClEh: ['You may thrive on spontaneous plans and last-minute invitations.', 'Du kan trives med spontane planer og invitasjoner i siste liten.'],
  ClEl: ['You may prefer to go at your own pace, without fixed schedules.', 'Du kan foretrekke å gå i ditt eget tempo, uten faste timeplaner.'],
  ChAh: ['You may be someone others rely on, both to follow up and to care.', 'Du kan være en andre stoler på, både for å følge opp og for å bry seg.'],
  ChAl: ['You may set high standards and say clearly when they are not met.', 'Du kan ha høye krav og si tydelig fra når de ikke blir møtt.'],
  ClAh: ['You may adapt easily to what others need, sometimes ahead of your own plans.', 'Du kan lett tilpasse deg det andre trenger, noen ganger foran dine egne planer.'],
  ClAl: ['You may act on your own judgement and speak your mind when things change.', 'Du kan handle etter egen vurdering og si din mening når ting endrer seg.'],
  ChNh: ['You may use planning as a way to keep worries in check.', 'Du kan bruke planlegging som en måte å holde bekymringer i sjakk på.'],
  ChNl: ['You may keep a steady course when deadlines get close.', 'Du kan holde stø kurs når fristene nærmer seg.'],
  ClNh: ['You may feel pressure when tasks pile up, and a simple plan could help.', 'Du kan kjenne press når oppgaver hoper seg opp, og en enkel plan kan hjelpe.'],
  ClNl: ['You may take changes and loose ends in your stride.', 'Du kan ta endringer og løse tråder med ro.'],
  EhAh: ['You may enjoy bringing people together and making them feel welcome.', 'Du kan like å samle folk og få dem til å føle seg velkomne.'],
  EhAl: ['You may speak up readily and enjoy a lively discussion.', 'Du kan si fra uten å nøle og like en livlig diskusjon.'],
  ElAh: ['You may listen closely and support others without needing attention.', 'Du kan lytte godt og støtte andre uten å trenge oppmerksomhet.'],
  ElAl: ['You may say little, but say it plainly when it matters.', 'Du kan si lite, men si det rett ut når det betyr noe.'],
  EhNh: ['You may feel the ups and downs of social life quite strongly.', 'Du kan kjenne opp- og nedturer i det sosiale ganske sterkt.'],
  EhNl: ['You may stay relaxed and at ease in busy social settings.', 'Du kan være avslappet og trygg i travle sosiale sammenhenger.'],
  ElNh: ['You may need quiet time to process pressure and impressions.', 'Du kan trenge rolig tid til å bearbeide press og inntrykk.'],
  ElNl: ['You may come across as composed and steady, even when others are stressed.', 'Du kan virke samlet og stødig, også når andre er stresset.'],
  AhNh: ['You may take other people’s problems to heart.', 'Du kan ta andres problemer tungt.'],
  AhNl: ['You may be a calm support for others when things are hard.', 'Du kan være en rolig støtte for andre når ting er vanskelige.'],
  AlNh: ['You may react quickly when something feels unfair or wrong.', 'Du kan reagere raskt når noe føles urettferdig eller galt.'],
  AlNl: ['You may handle disagreement without getting easily unsettled.', 'Du kan håndtere uenighet uten å bli lett satt ut.']
};

const ORDER = 'OCEAN';
const pick = (pair, language) => pair[language === 'no' ? 1 : 0];
const extremity = x => Number.isFinite(x.percentile) ? Math.abs(x.percentile - 50) / 50 : Math.abs(x.mean - 3) / 2;

/** Up to two traits outside the middle range, furthest from the middle first. Shared with the profile name. */
export const standouts = domains => domains.filter(d => d.band !== 'middle').sort((a, b) => extremity(b) - extremity(a) || a.code.localeCompare(b.code)).slice(0, 2);

/** Title, sentence and the traits it rests on; falls back gracefully when few traits stand out. */
export function combination(domains, language) {
  const out = standouts(domains);
  if (out.length < 2) {
    if (out.length === 1) {
      const d = out[0];
      return {title: pick(words[d.code][d.band], language), traits: out, text: pick(['One trait stands out while the other four sit near the middle, so the situation may shape much of how they show.', 'Ett trekk skiller seg ut, mens de fire andre ligger nær midten. Situasjonen kan derfor forme mye av hvordan de viser seg.'], language)};
    }
    return {title: pick(['Balanced', 'Balansert'], language), traits: [], text: pick(['All five traits sit near the middle, so you may adapt a lot to the situation you are in.', 'Alle fem trekkene ligger nær midten, så du kan tilpasse deg mye etter situasjonen du er i.'], language)};
  }
  const [a, b] = out.sort((x, y) => ORDER.indexOf(x.code) - ORDER.indexOf(y.code));
  const key = `${a.code}${a.band[0]}${b.code}${b.band[0]}`;
  const second = pick(words[b.code][b.band], language);
  return {title: `${pick(words[a.code][a.band], language)} ${language === 'no' ? 'og' : 'and'} ${second.charAt(0).toLowerCase()}${second.slice(1)}`, traits: [a, b], text: pick(pairs[key], language)};
}
