// Short editorial copy for the designed result and report screens.
// Each entry is selected deterministically from a domain's band (low / middle / high),
// so every sentence stays traceable to the underlying score.

// One logo piece per trait. Colours follow the pieces; Emotional reactivity uses a deeper sand
// version of the ivory piece so it keeps contrast on the ivory page.
export const traitColors = {O: '#91b6d3', C: '#f6b18d', E: '#5a84aa', A: '#cdb8a2', N: '#142c5b'};
export const traitPiece = {O: 'sky', C: 'apricot', E: 'steel', A: 'sand', N: 'navy'};

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
  O: {high: ['When does curiosity help you, and when does it pull you off track?', 'Når hjelper nysgjerrigheten deg, og når trekker den deg ut av kurs?'], low: ['When does a proven way work well for you, and when could one new thing help?', 'Når fungerer en utprøvd løsning godt for deg, og når kan én ny ting hjelpe?']},
  C: {high: ['When does planning help you, and when does it make you less flexible?', 'Når hjelper planlegging deg, og når gjør den deg mindre fleksibel?'], low: ['When does flexibility help you, and when would a simple plan save effort?', 'Når hjelper fleksibiliteten deg, og når ville en enkel plan spart deg for strev?']},
  E: {high: ['When does company give you energy, and when do you need a pause?', 'Når gir selskap deg energi, og når trenger du en pause?'], low: ['When does quiet time help you, and when would speaking up earlier help?', 'Når hjelper rolig tid deg, og når ville det hjulpet å si fra tidligere?']},
  A: {high: ['When does consideration help you, and when do your own needs get lost?', 'Når hjelper omtanken deg, og når blir dine egne behov borte?'], low: ['When does directness help you, and when does it create unnecessary friction?', 'Når hjelper direktheten deg, og når skaper den unødig friksjon?']},
  N: {high: ['What do you notice first when pressure builds, and what helps you then?', 'Hva merker du først når presset øker, og hva hjelper deg da?'], low: ['When does calm help you, and when might a risk deserve more attention?', 'Når hjelper roen deg, og når kan en risiko fortjene mer oppmerksomhet?']}
};

const pick = (pair, language) => pair[language === 'no' ? 1 : 0];
const extremity = x => Number.isFinite(x.percentile) ? Math.abs(x.percentile - 50) / 50 : Math.abs(x.mean - 3) / 2;
const distinctive = domains => domains.filter(d => d.band !== 'middle').sort((a, b) => extremity(b) - extremity(a) || a.code.localeCompare(b.code));

/** One or two phrases from the domains furthest from the response midpoint. */
export function profileSummary(domains, language) {
  const top = distinctive(domains).slice(0, 2).map(d => pick(summaryPhrases[d.code][d.band], language));
  if (!top.length) return pick(['All five traits sit in the middle range, so the situation may shape what you do more than any single tendency.', 'Alle fem trekkene ligger i midtområdet, så situasjonen kan forme det du gjør mer enn én enkelt tendens.'], language);
  return language === 'no' ? `Svarene dine tyder på ${top.join(' og ')}.` : `Your answers suggest ${top.join(', alongside ')}.`;
}

export const traitLine = (d, language) => pick(traitLines[d.code][d.band], language);
export const traitQuestion = (d, language) => pick(traitQuestions[d.code], language);

/** Reflection question for the most distinctive domain, or a neutral prompt. */
export function reflection(domains, language) {
  const [d] = distinctive(domains);
  return d ? pick(reflections[d.code][d.band], language) : pick(['Which situation this week brings out a side of you that surprised you?', 'Hvilken situasjon denne uken fikk frem en side av deg som overrasket deg?'], language);
}

// Expanded trait panel on the free result: a short strength, one thing to try and a caveat.
// [English, Norwegian bokmål]; plain everyday words, selected by band like the rest.
const panels = {
  O: {
    caveat: ['Curiosity can vary between topics and situations.', 'Nysgjerrighet kan variere mellom temaer og situasjoner.'],
    high: {strength: ['You spot options others walk past.', 'Du ser muligheter andre går forbi.'], strengthText: ['Your curiosity can get a stuck discussion moving or find a new way forward.', 'Nysgjerrigheten din kan få en fastlåst diskusjon i gang eller finne en ny vei.'],
      try: ['Test one idea on a small scale.', 'Test én idé i det små.'], tryQuestion: ['What did you learn, even if it was not perfect?', 'Hva lærte du, selv om det ikke ble perfekt?']},
    middle: {strength: ['Try new things. Keep what works.', 'Prøver nytt. Beholder det som virker.'], strengthText: ['You can build on what already works and add a new twist.', 'Du kan bygge videre på det som fungerer, og legge til en ny vri.'],
      try: ['Pick one routine. Change one small detail.', 'Velg én rutine. Endre én liten detalj.'], tryQuestion: ['What got better, and what do you want to keep?', 'Hva ble bedre, og hva vil du beholde?']},
    low: {strength: ['Steady on what works.', 'Står støtt på det som virker.'], strengthText: ['You make sure good solutions are done properly, not swapped out just for the sake of change.', 'Du sørger for at gode løsninger blir gjort skikkelig, ikke byttet ut bare for å bytte.'],
      try: ['Give one new idea a small trial.', 'Gi én ny idé en liten prøve.'], tryQuestion: ['What would it take to convince you?', 'Hva skulle til for at den overbeviste deg?']}
  },
  C: {
    caveat: ['How structured you are can depend on how much the task matters to you.', 'Hvor strukturert du er, kan avhenge av hvor viktig oppgaven er for deg.'],
    high: {strength: ['You get things done.', 'Du får ting gjort.'], strengthText: ['You turn plans into finished work, and others can count on you to follow through.', 'Du gjør planer om til ferdig arbeid, og andre kan stole på at du følger opp.'],
      try: ['Choose one task to do “good enough”.', 'Velg én oppgave du gjør «godt nok».'], tryQuestion: ['What happened when you let go a little?', 'Hva skjedde da du slapp litt taket?']},
    middle: {strength: ['A plan when it helps. Freedom when it doesn’t.', 'Plan når det trengs. Frihet når det går.'], strengthText: ['You can add structure when a lot is at stake, and improvise when that works better.', 'Du kan lage struktur når mye står på spill, og improvisere når det passer bedre.'],
      try: ['Compare a planned task with an improvised one.', 'Sammenlign en planlagt og en improvisert oppgave.'], tryQuestion: ['Which went better, and why?', 'Hvilken gikk best, og hvorfor?']},
    low: {strength: ['You adapt quickly.', 'Du tilpasser deg raskt.'], strengthText: ['When things change, you can switch course without getting stuck on an old plan.', 'Når noe endrer seg, kan du snu deg rundt uten å bli hengende i en gammel plan.'],
      try: ['Make one simple to-do list for the week.', 'Lag én enkel huskeliste for uken.'], tryQuestion: ['What got easier with it?', 'Hva ble lettere da du hadde den?']}
  },
  E: {
    caveat: ['How social you feel can depend on who you are with.', 'Hvor sosial du er, kan avhenge av hvem du er sammen med.'],
    high: {strength: ['You bring people along.', 'Du får folk med deg.'], strengthText: ['You can get conversations going and make it easier for others to join in.', 'Du kan starte samtaler og gjøre det lettere for andre å bli med.'],
      try: ['Let someone else speak first next time.', 'La noen andre snakke først neste gang.'], tryQuestion: ['What did you hear that you might have missed?', 'Hva fikk du høre som du ellers kunne gått glipp av?']},
    middle: {strength: ['At home in a group and on your own.', 'Trives både i gruppa og alene.'], strengthText: ['You can join in with others and still enjoy quiet time to yourself.', 'Du kan bidra sammen med andre og samtidig ha godt av rolig tid for deg selv.'],
      try: ['Notice your energy after a social and a quiet evening.', 'Kjenn etter hvordan energien er etter en sosial og etter en rolig kveld.'], tryQuestion: ['What did you need most this week?', 'Hva trengte du mest denne uken?']},
    low: {strength: ['You listen well and think things through.', 'Du lytter godt og tenker grundig.'], strengthText: ['You give conversations room for detail and think before you speak.', 'Du gir samtaler plass til detaljer og tenker deg om før du sier noe.'],
      try: ['Share one thought early in your next meeting.', 'Si én tanke tidlig i neste møte.'], tryQuestion: ['How was it received?', 'Hvordan ble den tatt imot?']}
  },
  A: {
    caveat: ['How much you give way can depend on the relationship and what is at stake.', 'Hvor mye du gir etter, kan avhenge av forholdet og hva som står på spill.'],
    high: {strength: ['You make people feel seen.', 'Du får andre til å føle seg sett.'], strengthText: ['You notice what others need and help build good teamwork.', 'Du merker hva andre trenger, og bidrar til godt samarbeid.'],
      try: ['Say no to one small thing this week.', 'Si nei til én liten ting denne uken.'], tryQuestion: ['What happened, and how did it feel?', 'Hva skjedde, og hvordan føltes det?']},
    middle: {strength: ['Kind, but clear.', 'Vennlig, men tydelig.'], strengthText: ['You can go out of your way for others and still speak up when it matters.', 'Du kan strekke deg for andre og samtidig si fra når noe er viktig.'],
      try: ['Voice one disagreement kindly and clearly.', 'Si fra om én uenighet, vennlig og tydelig.'], tryQuestion: ['What helped you find the words?', 'Hva hjalp deg å finne ordene?']},
    low: {strength: ['You say what others only think.', 'Du sier det andre bare tenker.'], strengthText: ['You dare to ask the hard questions, and that can stop bad decisions.', 'Du tør å stille de vanskelige spørsmålene, og det kan stoppe dårlige beslutninger.'],
      try: ['Start your next objection with what you agree on.', 'Start neste innvending med det du er enig i.'], tryQuestion: ['Did it change how it was received?', 'Endret det hvordan den ble tatt imot?']}
  },
  N: {
    caveat: ['Sleep, stress and what is going on in your life can affect this a lot.', 'Søvn, stress og livssituasjon kan påvirke dette mye.'],
    high: {strength: ['You notice early when something is off.', 'Du merker tidlig når noe er galt.'], strengthText: ['You can spot problems before others do, and prepare well.', 'Du kan oppdage problemer før andre, og forberede deg godt.'],
      try: ['Write down one worry and one small next step.', 'Skriv ned én bekymring og ett lite neste steg.'], tryQuestion: ['Did it feel smaller afterwards?', 'Føltes den mindre etterpå?']},
    middle: {strength: ['You feel the waves but keep your balance.', 'Du kjenner bølgene, men holder balansen.'], strengthText: ['You can feel pressure and still find your calm again.', 'Du kan kjenne på press og likevel finne roen igjen.'],
      try: ['Note one thing that drained you and one that recharged you.', 'Noter én ting som tappet deg, og én som ga deg påfyll.'], tryQuestion: ['Do you see a pattern after a week?', 'Ser du et mønster etter en uke?']},
    low: {strength: ['You keep a cool head.', 'Du holder hodet kaldt.'], strengthText: ['When things get uncertain, you can calm things down and find the next step.', 'Når ting blir usikre, kan du roe ned situasjonen og finne neste steg.'],
      try: ['Ask someone how they see a situation that feels calm to you.', 'Spør noen hvordan de opplever en situasjon som føles rolig for deg.'], tryQuestion: ['Did they notice something you did not?', 'Så de noe du ikke så?']}
  }
};

export function panelCopy(d, language) {
  const p = panels[d.code], b = p[d.band];
  return {strength: pick(b.strength, language), strengthText: pick(b.strengthText, language), try: pick(b.try, language), tryQuestion: pick(b.tryQuestion, language), caveat: pick(p.caveat, language)};
}
