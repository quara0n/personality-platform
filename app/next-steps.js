// «Dine neste steg», the last chapter of the paid report (Rune 2026-10-21, option A): it gathers the threads
// instead of adding more advice. One strength to use more (the rarest pair that works brilliantly together,
// else the facet furthest out), one trap to watch for (the next facet furthest out), then ONE experiment the
// person picks from three the report already points to (work, everyday life, their own facets), and a close
// with the video and a new test in six months. Copy is [English, Norwegian bokmål], one plain sentence each.

const pick = (pair, language) => pair[language === 'no' ? 1 : 0];
const extremity = f => Number.isFinite(f.percentile) ? Math.abs(f.percentile - 50) : Math.abs(f.mean - 3);

// Per facet and direction: `use` is the strength worth using more, `watch` the trap that comes with it.
// Both directions have both: a low score is not a weakness, and a high one is not only good.
export const facetNotes = {
  N1: {high: {use: ['You see what could go wrong before it happens. Use it to make a plan B.', 'Du ser hva som kan gå galt før det skjer. Bruk det til å lage en plan B.'],
    watch: ['Worry can feel like danger even when nothing is wrong. Ask: is this a risk, or just not knowing yet?', 'Bekymring kan kjennes som fare selv når ingenting er galt. Spør deg: er dette en risiko, eller bare noe du ikke vet ennå?']},
    low: {use: ['You stay calm when others worry. That makes you good to have around when things are uncertain.', 'Du holder roen når andre bekymrer seg. Det gjør deg god å ha med når noe er usikkert.'],
    watch: ['Calm can make you miss a real risk. Check the most important thing one extra time.', 'Roen kan få deg til å overse en reell risiko. Sjekk det viktigste én gang ekstra.']}},
  N2: {high: {use: ['You notice quickly when something is unfair. Use that drive to speak up about what matters.', 'Du merker raskt når noe er urettferdig. Bruk engasjementet til å si fra om det som betyr noe.'],
    watch: ['Irritation can come before the words. Pause, and say what you expected, not just that you are annoyed.', 'Irritasjonen kan komme før ordene. Ta en pause og si hva du forventet, ikke bare at du er irritert.']},
    low: {use: ['You are rarely provoked. That makes you good at cooling down a heated discussion.', 'Du blir sjelden provosert. Det gjør deg god til å roe ned en opphetet diskusjon.'],
    watch: ['You may swallow things that should be said. Speak up early, while it is still small.', 'Du kan svelge ting som burde vært sagt. Si fra tidlig, mens det ennå er lite.']}},
  N3: {high: {use: ['You take heavy feelings seriously. That can make you honest and good at understanding people who struggle.', 'Du tar tunge følelser på alvor. Det kan gjøre deg ærlig og god til å forstå andre som strever.'],
    watch: ['Heavy periods can colour how everything looks. Talk to someone you trust if it lasts, and get help if it gets too much.', 'Tunge perioder kan farge hvordan alt ser ut. Snakk med noen du stoler på hvis det varer, og søk hjelp hvis det blir for mye.']},
    low: {use: ['You bounce back quickly. Use it to keep spirits up when things move slowly.', 'Du kommer deg raskt på beina igjen. Bruk det til å holde motet oppe når ting går tregt.'],
    watch: ['It is easy to think others shake things off as fast as you. Ask how they are really doing.', 'Det er lett å tro at andre rister ting av seg like fort som deg. Spør hvordan de egentlig har det.']}},
  N4: {high: {use: ['You notice how others feel in social settings. That makes you careful and considerate.', 'Du merker hvordan andre har det i sosiale situasjoner. Det gjør deg varsom og hensynsfull.'],
    watch: ['Fear of looking silly can hold you back. Say one thing even if it feels a little uncomfortable.', 'Frykten for å dumme deg ut kan holde deg tilbake. Si én ting selv om det kjennes litt ubehagelig.']},
    low: {use: ['You dare to be yourself in front of others. Use it when someone needs to break the ice.', 'Du tør å være deg selv foran andre. Bruk det når noen må bryte isen.'],
    watch: ['You may underestimate how awkward others find it. Give them a moment before you pull them in.', 'Du kan undervurdere hvor ubehagelig andre synes det er. Gi dem litt tid før du drar dem med.']}},
  N5: {high: {use: ['You feel desire strongly and can enjoy the moment. Use it to give yourself rewards to look forward to.', 'Du kjenner lysten sterkt og kan nyte øyeblikket. Bruk det til å gi deg selv belønninger å glede deg til.'],
    watch: ['Temptation can beat the plan. Make what you want less of harder to reach, instead of relying on willpower.', 'Fristelser kan vinne over planen. Gjør det du vil ha mindre av vanskeligere å nå, i stedet for å stole på viljestyrke.']},
    low: {use: ['You resist temptation easily. That makes good habits simple to keep.', 'Du står lett imot fristelser. Det gjør det enkelt å holde på gode vaner.'],
    watch: ['You can be strict with yourself. Leave room for a treat without a bad conscience.', 'Du kan bli streng med deg selv. Gi rom for litt kos uten dårlig samvittighet.']}},
  N6: {high: {use: ['You notice early when it gets too much. Use that as a signal to ask for help in time.', 'Du kjenner tidlig når det blir for mye. Bruk det som et signal til å be om hjelp i tide.'],
    watch: ['Under pressure everything can feel equally urgent. Pick the one thing that has to be done now.', 'Under press kan alt føles like viktig. Velg den ene tingen som må gjøres nå.']},
    low: {use: ['You keep a cool head under pressure. That makes you good to have around when something is on fire.', 'Du holder hodet kaldt under press. Det gjør deg god å ha med når det brenner.'],
    watch: ['You may take on too much because you can handle it. Say so before others assume it is always fine.', 'Du kan ta på deg for mye fordi du tåler det. Si fra før andre tror at det alltid går bra.']}},
  E1: {high: {use: ['You make people feel welcome. Use it when someone is new or left out.', 'Du får folk til å føle seg velkommen. Bruk det når noen er ny eller står utenfor.'],
    watch: ['Not everyone wants closeness as fast as you. Follow the other person’s pace.', 'Ikke alle vil ha nærhet like fort som deg. Følg tempoet til den andre.']},
    low: {use: ['You are honest and keep a little distance. People know where they have you.', 'Du er ærlig og holder litt avstand. Folk vet hvor de har deg.'],
    watch: ['Distance can be read as rejection. Show interest with one question or a smile.', 'Avstand kan bli lest som avvisning. Vis interesse med ett spørsmål eller et smil.']}},
  E2: {high: {use: ['You enjoy people and bring them together. Use it to build a sense of belonging.', 'Du trives blant folk og samler dem. Bruk det til å skape fellesskap.'],
    watch: ['A full calendar can squeeze out rest. Plan a quiet evening as deliberately as a social one.', 'En full kalender kan presse ut hvilen. Planlegg en rolig kveld like bevisst som en sosial.']},
    low: {use: ['You like quiet and time to yourself. It gives you room to think and recharge.', 'Du trives med ro og egen tid. Det gir deg rom til å tenke og lade opp.'],
    watch: ['You may say no so often that contact fades. Pick one plan you actually look forward to.', 'Du kan takke nei så ofte at kontakten blir borte. Velg én avtale du faktisk har lyst på.']}},
  E3: {high: {use: ['You take the floor and make things happen. Use it to give a group direction.', 'Du tar ordet og får ting til å skje. Bruk det til å gi gruppen retning.'],
    watch: ['You can take over without noticing. Ask what others think before you decide.', 'Du kan ta over uten å merke det. Spør hva andre mener før du bestemmer.']},
    low: {use: ['You listen and let others in. That makes people feel safe to speak their mind.', 'Du lytter og slipper andre til. Det gjør folk trygge på å si hva de mener.'],
    watch: ['Your views can disappear in the crowd. Prepare one thing to say, and say it early.', 'Synspunktene dine kan forsvinne i mengden. Forbered én ting du vil si, og si den tidlig.']}},
  E4: {high: {use: ['You have lots of energy and get a lot done. Spend it on what matters most.', 'Du har mye energi og får mye gjort. Bruk den på det som betyr mest.'],
    watch: ['A high pace can become a habit. Put in breaks before your body demands them.', 'Høyt tempo kan bli en vane. Legg inn pauser før kroppen krever det.']},
    low: {use: ['You take things at your own pace. It leaves room for care and calm.', 'Du tar ting i ditt eget tempo. Det gir rom for grundighet og ro.'],
    watch: ['Others may think you are not engaged. Say what you are working on and when it will be done.', 'Andre kan tro at du ikke er engasjert. Si hva du jobber med og når det blir ferdig.']}},
  E5: {high: {use: ['You go where others hesitate. Use it to try something new together with others.', 'Du tør der andre nøler. Bruk det til å prøve noe nytt sammen med andre.'],
    watch: ['The thrill can hide the cost. Think about the consequences before you jump.', 'Spenningen kan skjule prisen. Tenk på følgene før du hopper.']},
    low: {use: ['You choose the safe and familiar. That makes you steady and predictable.', 'Du velger det trygge og kjente. Det gjør deg stødig og forutsigbar.'],
    watch: ['You may miss out on things you would enjoy. Try one small new thing that is not scary.', 'Du kan gå glipp av ting du ville likt. Prøv én liten ny ting som ikke er skummel.']}},
  E6: {high: {use: ['You spread joy and good humour. Use it to lift the mood when it is heavy.', 'Du sprer glede og godt humør. Bruk det til å løfte stemningen når den er tung.'],
    watch: ['Not everyone is in the same mood. Leave room for others to have a hard time.', 'Ikke alle er i samme modus. Gi rom for at andre kan ha det tungt.']},
    low: {use: ['You are calm and down to earth. People take you seriously when you say something is good.', 'Du er rolig og nøktern. Folk tar deg på alvor når du sier at noe er bra.'],
    watch: ['Others can read your calm as discontent. Say it out loud when you are pleased.', 'Andre kan lese roen din som misnøye. Si det høyt når du er fornøyd.']}},
  O1: {high: {use: ['You see possibilities in your head before they exist. Use it to sketch new solutions.', 'Du ser muligheter i hodet før de finnes. Bruk det til å skissere nye løsninger.'],
    watch: ['Ideas can stay in your head. Make one of them concrete this week.', 'Ideer kan bli værende i hodet. Gjør én av dem konkret denne uka.']},
    low: {use: ['You stick to what is real and close at hand. That makes you practical and grounded.', 'Du holder deg til det som er virkelig og nært. Det gjør deg praktisk og jordnær.'],
    watch: ['You may dismiss an idea before it has had a chance. Ask how it could work.', 'Du kan avvise en idé før den har fått en sjanse. Spør hvordan den kunne fungert.']}},
  O2: {high: {use: ['You notice what is beautiful. Use it to make everyday life a little nicer.', 'Du legger merke til det vakre. Bruk det til å gjøre hverdagen litt finere.'],
    watch: ['It can be hard to enjoy something that is not quite right. Good enough is often good enough.', 'Det kan bli vanskelig å nyte noe som ikke er helt riktig. Godt nok er ofte godt nok.']},
    low: {use: ['You care about what things do, not only how they look. That makes you practical.', 'Du er opptatt av hva ting gjør, ikke bare hvordan de ser ut. Det gjør deg praktisk.'],
    watch: ['Others may care more about look and feel than you think. Ask what matters to them.', 'Andre kan bry seg mer om form enn du tror. Spør hva som betyr noe for dem.']}},
  O3: {high: {use: ['You know well what you feel. Use it to understand what you really need.', 'Du kjenner godt hva du føler. Bruk det til å forstå hva du egentlig trenger.'],
    watch: ['Strong feelings can take the wheel. Put them into words before you act.', 'Sterke følelser kan ta styringen. Sett ord på dem før du handler.']},
    low: {use: ['You keep feelings in check and think clearly. It helps with hard choices.', 'Du holder følelsene i sjakk og tenker klart. Det hjelper i vanskelige valg.'],
    watch: ['Signals from your body can pass you by. Ask yourself once a day how you are doing.', 'Signaler fra kroppen kan gå deg forbi. Spør deg selv én gang om dagen hvordan du har det.']}},
  O4: {high: {use: ['You like the new and unknown. Use it to find new paths when something is stuck.', 'Du liker det nye og ukjente. Bruk det til å finne nye veier når noe står fast.'],
    watch: ['You can get bored before something is finished. Pick one thing to see all the way through.', 'Du kan bli lei før noe er ferdig. Velg én ting du gjør helt ferdig.']},
    low: {use: ['You value the familiar. Good routines give you calm and stability.', 'Du setter pris på det kjente. Gode rutiner gir deg ro og stabilitet.'],
    watch: ['Routines can turn into habits you did not choose. Change one small detail and see what happens.', 'Rutiner kan bli vaner du ikke har valgt selv. Endre én liten detalj og se hva som skjer.']}},
  O5: {high: {use: ['You like to dig into ideas. Use it to understand a problem fully before solving it.', 'Du liker å grave i ideer. Bruk det til å forstå et problem helt før du løser det.'],
    watch: ['You can analyse for a long time without getting started. Decide when you know enough.', 'Du kan analysere lenge uten å komme i gang. Bestem når du vet nok.']},
    low: {use: ['You prefer the concrete to theory. That makes you quick to act.', 'Du foretrekker det konkrete fremfor teori. Det gjør deg rask til å handle.'],
    watch: ['Some problems need more thought than they seem to. Take time for one extra question.', 'Noen problemer trenger mer tenking enn de ser ut til. Ta deg tid til ett ekstra spørsmål.']}},
  O6: {high: {use: ['You question the usual ways of doing things. Use it to find better solutions.', 'Du stiller spørsmål ved vante måter å gjøre ting på. Bruk det til å finne bedre løsninger.'],
    watch: ['Not everything old is wrong. Ask what a tradition was good for before you change it.', 'Ikke alt gammelt er feil. Spør hva en tradisjon var god for før du endrer den.']},
    low: {use: ['You value what has worked for a long time. That makes you a steady force.', 'Du setter pris på det som har fungert lenge. Det gjør deg til en stødig kraft.'],
    watch: ['New ways can be turned down too fast. Give one change an honest chance.', 'Nye måter kan bli avvist for fort. Gi én endring en ærlig sjanse.']}},
  A1: {high: {use: ['You believe the best about people. That often helps them grow.', 'Du tror det beste om folk. Det får dem ofte til å vokse.'],
    watch: ['Not everyone earns trust straight away. Look at what people do, not only what they say.', 'Ikke alle fortjener tillit med en gang. Se på hva folk gjør, ikke bare hva de sier.']},
    low: {use: ['You are critical and hard to fool. That protects you and others.', 'Du er kritisk og vanskelig å lure. Det beskytter deg og andre.'],
    watch: ['Distrust can keep good people at a distance. Give one person the chance to prove themselves.', 'Mistillit kan holde gode folk på avstand. Gi én person sjansen til å vise hvem de er.']}},
  A2: {high: {use: ['You are straightforward and honest. People know what they get.', 'Du er rett frem og ærlig. Folk vet hva de får.'],
    watch: ['Honesty needs the right moment. Think about when and how you say it.', 'Ærlighet trenger riktig tidspunkt. Tenk på når og hvordan du sier det.']},
    low: {use: ['You know how to make things run smoothly and read the game. It can help in negotiations.', 'Du vet hvordan du får ting til å gli, og leser spillet. Det kan hjelpe i forhandlinger.'],
    watch: ['Tactics can wear down trust over time. Be open about what you really want.', 'Taktikk kan svekke tilliten over tid. Vær åpen om hva du egentlig vil.']}},
  A3: {high: {use: ['You like helping others. That makes you a good colleague and friend.', 'Du hjelper gjerne andre. Det gjør deg til en god kollega og venn.'],
    watch: ['You can help so much that you run empty. Ask what is actually needed.', 'Du kan hjelpe så mye at du selv går tom. Spør hva som faktisk trengs.']},
    low: {use: ['You look after your own time and energy. That helps you last.', 'Du passer på din egen tid og energi. Det gjør at du holder ut lenge.'],
    watch: ['Others may see you as hard to reach. Offer help with one concrete thing.', 'Andre kan oppleve deg som lite tilgjengelig. Tilby hjelp med én konkret ting.']}},
  A4: {high: {use: ['You find solutions everyone can live with. That makes working together easier.', 'Du finner løsninger alle kan leve med. Det gjør samarbeid lettere.'],
    watch: ['You may give in to avoid conflict. Speak up about what matters to you.', 'Du kan gi etter for å unngå konflikt. Si fra om det som er viktig for deg.']},
    low: {use: ['You stand up for what you think. That makes you good at saying when something is wrong.', 'Du står for det du mener. Det gjør deg god til å si fra når noe er galt.'],
    watch: ['Fighting over everything wears others out. Choose which battles are worth it.', 'Kamp om alt sliter på andre. Velg hvilke saker som er verdt det.']}},
  A5: {high: {use: ['You let others shine and rarely boast. People like working with you.', 'Du lar andre skinne og skryter lite. Folk liker å jobbe med deg.'],
    watch: ['What you achieve can go unnoticed. Tell someone about one thing you are pleased with.', 'Det du får til kan gå folk hus forbi. Fortell noen om én ting du er fornøyd med.']},
    low: {use: ['You dare to show what you can do. That opens doors.', 'Du tør å vise hva du kan. Det åpner dører.'],
    watch: ['Confidence can sound like bragging. Lift up what others contributed too.', 'Selvtillit kan høres ut som skryt. Løft frem det andre har bidratt med også.']}},
  A6: {high: {use: ['You feel with others. That makes people feel safe coming to you.', 'Du kjenner med andre. Det gjør folk trygge på å komme til deg.'],
    watch: ['Other people’s problems can become yours. Be clear about what you can give.', 'Andres problemer kan bli dine. Vær tydelig på hva du kan gi.']},
    low: {use: ['You see the matter clearly even when feelings run high. It helps with tough choices.', 'Du ser saken klart, selv når følelsene står på spill. Det hjelper i tøffe valg.'],
    watch: ['Clarity can come across as cold. Show that you understand before you offer the solution.', 'Klarhet kan oppleves som kaldt. Vis at du forstår før du kommer med løsningen.']}},
  C1: {high: {use: ['You believe you can do it. That makes you take on challenges.', 'Du tror at du får det til. Det får deg til å ta på deg utfordringer.'],
    watch: ['Confidence is not the same as preparation. Check that you have what you need.', 'Trygghet er ikke det samme som forberedelse. Sjekk at du har det du trenger.']},
    low: {use: ['You are humble about new tasks. That makes you prepare well.', 'Du er ydmyk overfor nye oppgaver. Det gjør at du forbereder deg godt.'],
    watch: ['Doubt can stop you before you try. Think of one thing you have managed before.', 'Tvilen kan stoppe deg før du prøver. Tenk på én ting du har fått til før.']}},
  C2: {high: {use: ['You keep order and structure. It saves time for you and others.', 'Du holder orden og struktur. Det sparer tid for deg og andre.'],
    watch: ['Not everyone needs the same order as you. Agree on a level that suits more people.', 'Ikke alle trenger like mye orden som deg. Avtal et nivå som passer flere.']},
    low: {use: ['You can live with mess and go with the flow. That makes you flexible.', 'Du tåler rot og flyter med. Det gjør deg fleksibel.'],
    watch: ['Mess can cost others time. Pick one place where order matters most.', 'Rotet kan koste andre tid. Velg ett sted der orden betyr mest.']}},
  C3: {high: {use: ['You keep your promises. People can rely on you.', 'Du holder det du lover. Folk kan stole på deg.'],
    watch: ['Duties can crowd out everything else. It is fine to say no to something.', 'Plikter kan fortrenge alt annet. Det er lov å si nei til noe.']},
    low: {use: ['You do not let rules steer you more than needed. It leaves room to think for yourself.', 'Du lar ikke regler styre deg mer enn nødvendig. Det gir rom for å tenke selv.'],
    watch: ['Others may depend on your promises. Set a reminder for the one that matters most.', 'Andre kan være avhengige av løftene dine. Sett en påminnelse for det viktigste.']}},
  C4: {high: {use: ['You set high goals and work for them. Spend that on what really matters.', 'Du setter høye mål og jobber for dem. Bruk det på det som virkelig betyr noe.'],
    watch: ['High goals can crowd out rest and people. Look at what the goal costs.', 'Høye mål kan fortrenge hvile og folk. Se hva målet koster.']},
    low: {use: ['You are content without chasing more. That gives calm and balance.', 'Du er fornøyd uten å jage mer. Det gir ro og balanse.'],
    watch: ['Without goals, things can stand still. Set one small goal for something you care about.', 'Uten mål kan ting stå stille. Sett ett lite mål for noe du bryr deg om.']}},
  C5: {high: {use: ['You get started and finish things. That turns plans into something real.', 'Du kommer i gang og gjør ting ferdig. Det gjør at planene blir til noe.'],
    watch: ['You can push yourself too hard. Plan the breaks too.', 'Du kan presse deg selv for hardt. Planlegg pausene også.']},
    low: {use: ['You work best when something tempts you. It gives you energy when the interest is there.', 'Du jobber best når noe frister. Det gir deg energi når interessen er der.'],
    watch: ['Boring tasks can be left lying. Split them up and start with five minutes.', 'Kjedelige oppgaver kan bli liggende. Del dem opp og start med fem minutter.']}},
  C6: {high: {use: ['You think before you act. That prevents many mistakes.', 'Du tenker før du handler. Det hindrer mange feil.'],
    watch: ['You can wait too long. Decide when you have enough information.', 'Du kan vente for lenge. Bestem når du har nok informasjon.']},
    low: {use: ['You decide quickly. That makes things happen.', 'Du bestemmer deg raskt. Det får ting til å skje.'],
    watch: ['Quick choices can have unexpected effects. Sleep on the most important one this week.', 'Raske valg kan få uventede følger. Sov på det viktigste valget denne uka.']}}
};

const outer = facets => facets.filter(f => (f.band === 'high' || f.band === 'low') && facetNotes[f.code])
  .sort((a, b) => extremity(b) - extremity(a) || a.code.localeCompare(b.code));

/**
 * The strength and the trap. `together` is comboChapter().together (pairs that work brilliantly together).
 * Returns {strength: {facets, pair?, line, when?, text}, trap: {facets, text}}; either may be null for a profile
 * with every facet in the middle range.
 */
export function strengthAndTrap(domains, together = [], language = 'en') {
  const facets = outer(domains.flatMap(d => d.facets));
  const pair = together[0];
  let strength = null;
  if (pair) strength = {facets: [pair.a, pair.b], pair, line: pair.line, when: pair.when};
  else if (facets[0]) strength = {facets: [facets[0]], text: pick(facetNotes[facets[0].code][facets[0].band].use, language)};
  const used = new Set((strength?.facets || []).map(f => f.code));
  const t = facets.find(f => !used.has(f.code)) || (pair ? facets[0] : null);
  const trap = t ? {facets: [t], text: pick(facetNotes[t.code][t.band].watch, language)} : null;
  return {strength, trap};
}

/**
 * Three experiments to choose one from, each from a part of the report: work, everyday life and the
 * person's own facets. `tries` holds the tailored chapters' «Try one thing this week» when those questions
 * are answered ({work, life}); otherwise the facet's own work and life lines are used. `picks` are the facets
 * the report follows (furthest from the midpoint, filled with one per trait for a middle profile).
 */
export function experiments(picks, tries = {}, strength = null, language = 'en') {
  const no = language === 'no', [a, b, c] = picks, out = [];
  const add = (id, source, text, facet) => { if (text && !out.some(x => x.text === text)) out.push({id, source, text, facet}); };
  add('work', no ? 'Arbeidsliv' : 'Work', tries.work || a?.content?.work, tries.work ? null : a);
  add('life', no ? 'Hverdagsliv og relasjoner' : 'Everyday life', tries.life || (b || a)?.content?.life, tries.life ? null : b || a);
  if (strength?.when) add('strength', no ? 'Styrken din' : 'Your strength', no ? `Finn én anledning denne uka der styrken din passer: ${lower(strength.when)}` : `Find one moment this week where your strength fits: ${lower(strength.when)}`, null);
  for (const f of [c, b, a]) if (out.length < 3 && f) add(`facet-${f.code}`, no ? 'Fasettene dine' : 'Your facets', f.content?.life, f);
  return out.slice(0, 3);
}
const lower = s => s ? s[0].toLowerCase() + s.slice(1) : '';

/** A calendar file (.ics) with an all-day reminder to take the test again on `date` (a Date). */
export function retakeIcs(date, language = 'en', url = 'https://kaleidotest.com') {
  const d = x => x.toISOString().slice(0, 10).replace(/-/g, ''), next = new Date(date.getTime() + 864e5);
  const title = language === 'no' ? 'Ta Kaleido-testen på nytt' : 'Take the Kaleido test again';
  const body = language === 'no' ? 'Se hva som har endret seg siden sist.' : 'See what has changed since last time.';
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Kaleido//Neste steg//NO', 'BEGIN:VEVENT', `UID:retake-${d(date)}@kaleidotest.com`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`, `DTSTART;VALUE=DATE:${d(date)}`, `DTEND;VALUE=DATE:${d(next)}`,
    `SUMMARY:${title}`, `DESCRIPTION:${body} ${url}`, `URL:${url}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
}

/** Six months after `from`, for the retake reminder. */
export function sixMonthsAfter(from) { const d = new Date(from); d.setMonth(d.getMonth() + 6); return d; }
