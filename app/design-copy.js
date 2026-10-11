// Short editorial copy for the designed result and report screens.
// Each entry is selected deterministically from a domain's band (low / middle / high),
// so every sentence stays traceable to the underlying score.

export const traitColors = {O: '#8fb4d0', C: '#a9c6dc', E: '#f6b18d', A: '#8fb4d0', N: '#f6b18d'};

// Noun phrases used in "Your answers suggest … and …".
const summaryPhrases = {
  O: {high: ['curiosity about new ideas', 'nysgjerrighet på nye ideer'], low: ['a preference for the familiar and practical', 'en forkjærlighet for det kjente og praktiske']},
  C: {high: ['a liking for structure and follow-through', 'sans for struktur og for å fullføre det du starter'], low: ['a flexible, spontaneous approach to plans', 'en fleksibel og spontan tilnærming til planer']},
  E: {high: ['an appetite for time with other people', 'at du får energi av å være sammen med andre'], low: ['a preference for time to reflect on your own', 'at du setter pris på tid til å tenke selv']},
  A: {high: ['warmth and consideration for others', 'varme og omtanke for andre'], low: ['directness and a readiness to challenge', 'direkthet og vilje til å utfordre']},
  N: {high: ['a tendency to feel pressure and worry strongly', 'at du kjenner press og bekymring ganske sterkt'], low: ['calm under pressure', 'ro under press']}
};

const traitLines = {
  O: {high: ['You seem to thrive on new perspectives.', 'Du ser ut til å trives med nye perspektiver.'], middle: ['You seem to mix new ideas with familiar ways.', 'Du ser ut til å blande nye ideer med kjente løsninger.'], low: ['You seem to prefer what is concrete and proven.', 'Du ser ut til å foretrekke det konkrete og utprøvde.']},
  C: {high: ['You seem to like plans and finishing what you start.', 'Du ser ut til å like planer og å fullføre det du starter.'], middle: ['You seem to adjust structure to the situation.', 'Du ser ut til å tilpasse strukturen til situasjonen.'], low: ['You seem to prefer flexibility over fixed plans.', 'Du ser ut til å foretrekke fleksibilitet fremfor faste planer.']},
  E: {high: ['You seem to gain energy from other people.', 'Du ser ut til å få energi av andre mennesker.'], middle: ['You seem to balance company and time alone.', 'Du ser ut til å veksle mellom selskap og alenetid.'], low: ['You seem to value quiet time to think.', 'Du ser ut til å sette pris på rolig tid til å tenke.']},
  A: {high: ['You seem to put weight on cooperation and care.', 'Du ser ut til å legge vekt på samarbeid og omtanke.'], middle: ['You seem to balance consideration and directness.', 'Du ser ut til å balansere omtanke og direkthet.'], low: ['You seem to speak your mind and question others.', 'Du ser ut til å si din mening og stille spørsmål ved andre.']},
  N: {high: ['You seem to notice pressure and worry clearly.', 'Du ser ut til å kjenne press og bekymring tydelig.'], middle: ['Your reactions to pressure seem to depend on the situation.', 'Reaksjonene dine på press ser ut til å avhenge av situasjonen.'], low: ['You seem to stay fairly calm under pressure.', 'Du ser ut til å holde deg ganske rolig under press.']}
};

const traitQuestions = {
  O: ['When do you notice this in everyday life?', 'Når merker du dette i hverdagen?'],
  C: ['Where does structure help you, and where does it hold you back?', 'Hvor hjelper struktur deg, og hvor holder den deg tilbake?'],
  E: ['Which situations give you energy, and which drain it?', 'Hvilke situasjoner gir deg energi, og hvilke tapper deg?'],
  A: ['When do you choose harmony, and when do you disagree?', 'Når velger du harmoni, og når sier du imot?'],
  N: ['What helps you when pressure builds up?', 'Hva hjelper deg når presset bygger seg opp?']
};

const reflections = {
  O: {high: ['When does curiosity help you, and when does it pull you off track?', 'Når hjelper nysgjerrigheten deg, og når trekker den deg ut av kurs?'], low: ['When does a proven approach serve you, and when could one new element help?', 'Når tjener en utprøvd løsning deg, og når kan ett nytt element hjelpe?']},
  C: {high: ['When does planning help you, and when does it make you less flexible?', 'Når hjelper planlegging deg, og når gjør den deg mindre fleksibel?'], low: ['When does flexibility help you, and when would a simple plan save effort?', 'Når hjelper fleksibiliteten deg, og når ville en enkel plan spart deg for strev?']},
  E: {high: ['When does company give you energy, and when do you need a pause?', 'Når gir selskap deg energi, og når trenger du en pause?'], low: ['When does quiet time help you, and when would speaking up earlier help?', 'Når hjelper rolig tid deg, og når ville det hjulpet å si fra tidligere?']},
  A: {high: ['When does consideration help you, and when do your own needs get lost?', 'Når hjelper omtanken deg, og når blir dine egne behov borte?'], low: ['When does directness help you, and when does it create unnecessary friction?', 'Når hjelper direktheten deg, og når skaper den unødig friksjon?']},
  N: {high: ['What do you notice first when pressure builds, and what helps you then?', 'Hva merker du først når presset øker, og hva hjelper deg da?'], low: ['When does calm help you, and when might a risk deserve more attention?', 'Når hjelper roen deg, og når kan en risiko fortjene mer oppmerksomhet?']}
};

const pick = (pair, language) => pair[language === 'no' ? 1 : 0];
const distinctive = domains => domains.filter(d => d.band !== 'middle').sort((a, b) => Math.abs(b.mean - 3) - Math.abs(a.mean - 3) || a.code.localeCompare(b.code));

/** One or two phrases from the domains furthest from the response midpoint. */
export function profileSummary(domains, language) {
  const top = distinctive(domains).slice(0, 2).map(d => pick(summaryPhrases[d.code][d.band], language));
  if (!top.length) return pick(['Your answers sit close to the middle on all five traits, so the situation may shape what you do more than any single tendency.', 'Svarene dine ligger nær midten på alle fem trekk, så situasjonen kan forme det du gjør mer enn én enkelt tendens.'], language);
  return language === 'no' ? `Svarene dine tyder på ${top.join(' og ')}.` : `Your answers suggest ${top.join(', alongside ')}.`;
}

export const traitLine = (d, language) => pick(traitLines[d.code][d.band], language);
export const traitQuestion = (d, language) => pick(traitQuestions[d.code], language);

/** Reflection question for the most distinctive domain, or a neutral prompt. */
export function reflection(domains, language) {
  const [d] = distinctive(domains);
  return d ? pick(reflections[d.code][d.band], language) : pick(['Which situation this week brings out a side of you that surprised you?', 'Hvilken situasjon denne uken får frem en side av deg som overrasket deg?'], language);
}
