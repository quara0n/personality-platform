// Tailored feedback for the Work & career and Everyday life chapters (the 149 kr / $14.99 tier).
// The reader answers a few questions about their work or everyday life. Each answer switches on
// fixed rules; a rule names one facet and gives one text for a higher and one for a lower facet.
// Only facets outside the middle range are used. The direction decides whether the line goes under
// «what helps» or «what can make it harder». Every line keeps a rule id, so it can be traced back
// to the answer and the facet score. Pairs are [English, Norwegian bokmål].

export const TAILOR_VERSION = 'tailored-v1';

export const questions = {
  work: [
    {id: 'role', q: ['What kind of work is closest to your day?', 'Hva slags arbeid ligner mest på dagen din?'], options: [
      ['knowledge', 'Office or knowledge work', 'Kontor- eller kunnskapsarbeid'],
      ['care', 'Care, health or teaching', 'Omsorg, helse eller undervisning'],
      ['service', 'Sales, service or customers', 'Salg, service eller kunder'],
      ['practical', 'Practical, technical or a trade', 'Praktisk, teknisk eller håndverk'],
      ['creative', 'Creative work', 'Kreativt arbeid'],
      ['lead', 'Leading others', 'Leder for andre'],
      ['student', 'Studying', 'Studerer']]},
    {id: 'people', q: ['How much of your day do you spend with other people?', 'Hvor mye av dagen er du sammen med andre?'], options: [
      ['alone', 'Mostly on my own', 'Mest alene'],
      ['mixed', 'Some of both', 'Litt av begge'],
      ['people', 'Mostly with people', 'Mest med folk']]},
    {id: 'structure', q: ['How fixed is your work?', 'Hvor fast er arbeidet ditt?'], options: [
      ['fixed', 'Fixed routines and procedures', 'Faste rutiner og prosedyrer'],
      ['mixed', 'Some of both', 'Litt av begge'],
      ['shifting', 'It changes a lot', 'Det endrer seg mye']]},
    {id: 'pressure', q: ['How much pressure and how many deadlines?', 'Hvor mye press og frister er det?'], options: [
      ['calm', 'Calm and predictable', 'Rolig og forutsigbart'],
      ['peaks', 'Busy periods now and then', 'Travle perioder innimellom'],
      ['high', 'Often high pressure', 'Ofte høyt press']]}
  ],
  life: [
    {id: 'household', q: ['Who do you share everyday life with?', 'Hvem deler du hverdagen med?'], options: [
      ['alone', 'I live alone', 'Jeg bor alene'],
      ['partner', 'A partner', 'Partner'],
      ['family', 'A partner and children', 'Partner og barn'],
      ['single', 'Children, without a partner', 'Barn, uten partner'],
      ['shared', 'Family, friends or flatmates', 'Familie, venner eller bofeller']]},
    {id: 'kids', when: {household: ['family', 'single']}, q: ['How old are the children?', 'Hvor gamle er barna?'], options: [
      ['small', 'Under 6', 'Under 6 år'],
      ['school', '6 to 12', '6 til 12 år'],
      ['teens', '13 or older', '13 år eller eldre']]},
    {id: 'week', q: ['How full is your week?', 'Hvor full er uka di?'], options: [
      ['room', 'Plenty of room', 'God plass'],
      ['full', 'Fairly full', 'Ganske full'],
      ['packed', 'Packed', 'Stappfull']]},
    {id: 'wish', q: ['What do you want more of right now?', 'Hva ønsker du deg mer av nå?'], options: [
      ['calm', 'Calm', 'Ro'],
      ['energy', 'Energy and people', 'Energi og folk'],
      ['routines', 'Better routines', 'Bedre rutiner'],
      ['close', 'Closeness to the people I love', 'Nærhet til dem jeg er glad i']]}
  ]
};

// [kind, text EN, text NO, try EN, try NO]. kind is 'help' or 'hard'.
const H = (kind, en, no, tryEn, tryNo) => ({kind, text: [en, no], try: [tryEn, tryNo]});

// Order matters: when two rules name the same facet in one chapter, the first one wins,
// so the more specific rules (role, household) come first.
export const rules = [
  // Work: role
  {id: 'lead-E3', ch: 'work', when: {role: ['lead']}, f: 'E3',
    high: H('help', 'You probably speak up and set a direction without hesitating, which helps when you lead others.', 'Du tar trolig ordet og staker ut kursen uten å nøle, og det hjelper når du leder andre.',
      'Let someone else lead your next meeting, and notice who says more when you say less.', 'La en annen lede neste møte, og legg merke til hvem som sier mer når du sier mindre.'),
    low: H('hard', 'Leading often means taking the floor and making the call, and that may cost you more than it costs others.', 'Som leder må du ofte ta ordet og bestemme, og det kan koste deg mer enn det koster andre.',
      'Before your next meeting, prepare one sentence: what you have decided, and why.', 'Forbered én setning før neste møte: hva du har bestemt, og hvorfor.')},
  {id: 'lead-A4', ch: 'work', when: {role: ['lead']}, f: 'A4',
    high: H('hard', 'You would rather avoid conflict, and as a leader that can make it hard to say no or make unpopular calls.', 'Du vil helst unngå konflikt, og som leder kan det gjøre det vanskelig å si nei eller ta upopulære valg.',
      'Practise one short, friendly way of saying no: “We can’t do that now, because …”', 'Øv på én kort og vennlig måte å si nei på: «Det kan vi ikke nå, fordi …»'),
    low: H('help', 'You can probably stay in a disagreement without backing off, which helps when a decision will not please everyone.', 'Du kan trolig stå i uenighet uten å trekke deg, og det hjelper når en beslutning ikke vil glede alle.',
      'Next time you disagree, start by naming one thing you agree with.', 'Neste gang du er uenig: start med å si én ting du er enig i.')},
  {id: 'care-A6', ch: 'work', when: {role: ['care']}, f: 'A6',
    high: H('help', 'You probably feel strongly with the people you help, and they notice. Over time it can also wear you down.', 'Du føler trolig sterkt med dem du hjelper, og det merker de. Over tid kan det også slite på deg.',
      'Give yourself a small, fixed transition after work, like a short walk, so you do not carry everything home.', 'Lag deg en liten, fast overgang etter jobb, som en kort tur, så du ikke tar med deg alt hjem.'),
    low: H('hard', 'Care work expects a lot of visible compassion, and showing it may cost you more than others. That does not mean you care less.', 'Omsorgsarbeid forventer mye synlig medfølelse, og det kan koste deg mer å vise den enn andre. Det betyr ikke at du bryr deg mindre.',
      'Ask rather than comfort: “What do you need right now?” shows warmth without you having to find the perfect words.', 'Spør heller enn å trøste: «Hva trenger du nå?» viser varme uten at du må finne de perfekte ordene.')},
  {id: 'service-N2', ch: 'work', when: {role: ['service', 'care']}, f: 'N2',
    high: H('hard', 'Difficult customers or clients can spark irritation quickly, and it may stay with you for a while.', 'Vanskelige kunder eller brukere kan vekke irritasjon raskt, og den kan sitte i en stund.',
      'Take three slow breaths and repeat what the person needs in your own words before you answer.', 'Ta tre rolige pust og gjenta hva personen trenger med egne ord før du svarer.'),
    low: H('help', 'You probably do not get irritated easily, which is a real strength when customers or clients are unhappy.', 'Du blir trolig ikke lett irritert, og det er en styrke når kunder eller brukere er misfornøyde.',
      'Notice who on your team takes the tough conversations, and offer to take one.', 'Legg merke til hvem på laget som tar de tunge samtalene, og tilby å ta én.')},
  {id: 'service-E1', ch: 'work', when: {role: ['service', 'care'], people: ['people']}, f: 'E1',
    high: H('help', 'You find it easy to show warmth to new people, and that matters when your work is about people.', 'Du har lett for å vise varme mot nye mennesker, og det betyr mye når jobben handler om folk.',
      'Notice who you have not talked to for a while, and reach out to one of them.', 'Legg merke til hvem du ikke har snakket med på en stund, og ta kontakt med én av dem.'),
    low: H('hard', 'When the job asks for a lot of small talk and warmth towards strangers, it can feel like a role you have to play, and that can be tiring.', 'Når jobben krever mye småprat og varme mot fremmede, kan det kjennes som en rolle du må spille, og det kan bli slitsomt.',
      'Prepare two or three go-to opening questions for new people, so you do not have to invent one each time.', 'Lag deg to eller tre faste åpningsspørsmål til nye folk, så du slipper å finne på noe hver gang.')},
  {id: 'practical-C6', ch: 'work', when: {role: ['practical']}, f: 'C6',
    high: H('help', 'You probably think before you act, and in practical work that can save both time and mistakes.', 'Du tenker deg trolig om før du handler, og i praktisk arbeid kan det spare både tid og feil.',
      'Share one thing you always check before you start with someone who is new.', 'Del én ting du alltid sjekker før du starter, med en som er ny.'),
    low: H('hard', 'You tend to act quickly, and in practical work that can lead to small mistakes that take time to fix.', 'Du handler gjerne raskt, og i praktisk arbeid kan det gi små feil som tar tid å rette.',
      'Make a three-point checklist for the task where mistakes cost the most.', 'Lag en sjekkliste på tre punkter for oppgaven der feil koster mest.')},
  {id: 'practical-E4', ch: 'work', when: {role: ['practical', 'service']}, f: 'E4',
    high: H('help', 'You probably like a fast pace and keeping things moving, which suits work where you are on your feet.', 'Du liker trolig høyt tempo og å holde ting i gang, og det passer godt i arbeid der du er i bevegelse.',
      'Use your pace for the start of the day, and keep the last hour for tidying up loose ends.', 'Bruk farten på starten av dagen, og hold av siste time til å rydde opp i løse tråder.'),
    low: H('hard', 'A high pace all day may wear on you more than on others.', 'Høyt tempo hele dagen kan slite mer på deg enn på andre.',
      'Plan short, fixed breaks instead of waiting until you are tired.', 'Legg inn korte, faste pauser i stedet for å vente til du er sliten.')},
  {id: 'creative-O1', ch: 'work', when: {role: ['creative']}, f: 'O1',
    high: H('help', 'You probably find it easy to picture things that do not exist yet, which is raw material for creative work.', 'Du har trolig lett for å se for deg ting som ikke finnes ennå, og det er råstoff i kreativt arbeid.',
      'Write ideas down the moment they come, and pick one each Friday to take further.', 'Skriv ned ideer med en gang de kommer, og velg én hver fredag som du jobber videre med.'),
    low: H('hard', 'Creative work often asks you to invent from nothing, and that may feel heavier than improving something that already exists.', 'Kreativt arbeid krever ofte at du finner på fra ingenting, og det kan kjennes tyngre enn å forbedre noe som finnes.',
      'Start from an example you like, and change one thing at a time.', 'Start fra et eksempel du liker, og endre én ting om gangen.')},
  {id: 'knowledge-O5', ch: 'work', when: {role: ['knowledge', 'student']}, f: 'O5',
    high: H('help', 'You probably enjoy wrestling with difficult ideas, which brings energy to work with a lot of thinking.', 'Du liker trolig å bryne deg på vanskelige ideer, og det gir energi i arbeid med mye tenking.',
      'Set aside one hour a week to learn something that is not urgent.', 'Sett av én time i uka til å lære noe som ikke haster.'),
    low: H('hard', 'Long stretches of abstract problems and reading can feel heavy, even when you are good at the work.', 'Lange perioder med abstrakte problemer og lesing kan kjennes tunge, selv når du er flink i jobben.',
      'Make abstract tasks concrete: draw it, find an example or talk it through with someone.', 'Gjør abstrakte oppgaver konkrete: tegn, finn et eksempel eller snakk det gjennom med noen.')},
  {id: 'selfrun-C5', ch: 'work', when: {role: ['knowledge', 'creative', 'student']}, f: 'C5',
    high: H('help', 'You probably get started on tasks even when nobody is watching, which matters when you steer much of the work yourself.', 'Du kommer trolig i gang med oppgaver selv når ingen følger med, og det betyr mye når du styrer mye av arbeidet selv.',
      'Plan your breaks as firmly as your tasks, so your discipline does not eat your rest.', 'Planlegg pausene like fast som oppgavene, så selvdisiplinen ikke spiser opp hvilen.'),
    low: H('hard', 'When much of the work is up to you, it can be hard to get going on what is not urgent.', 'Når mye av arbeidet er opp til deg selv, kan det være vanskelig å komme i gang med det som ikke haster.',
      'Start the dullest task with five minutes on a timer. The start is often the heaviest part.', 'Start den kjedeligste oppgaven med fem minutter på klokka. Ofte er starten det tyngste.')},
  // Work: people
  {id: 'people-E2', ch: 'work', when: {people: ['people']}, f: 'E2',
    high: H('help', 'You work close to people, and a lot of company probably gives you energy rather than draining it.', 'Du jobber tett på folk, og mye selskap gir deg trolig energi i stedet for å tappe deg.',
      'Put your heaviest solo task straight after a meeting, while you are still warmed up.', 'Legg den tyngste alenearbeidsoppgaven rett etter et møte, mens du fortsatt er varm.'),
    low: H('hard', 'You spend much of the day with others, and many hours in company may drain you more than your colleagues. It says nothing about how good you are with people, only what it costs.', 'Du er mye sammen med andre, og mange timer i selskap kan tappe deg mer enn kollegaene dine. Det sier ingenting om hvor god du er med folk, bare hva det koster.',
      'Give yourself ten minutes alone after long blocks of meetings, before the next conversation.', 'Gi deg selv ti minutter alene etter lange møteblokker, før neste samtale.')},
  {id: 'alone-E2', ch: 'work', when: {people: ['alone']}, f: 'E2',
    high: H('hard', 'A lot of solo work can get quiet for you, and you may notice your energy dropping without people around.', 'Mye alenearbeid kan bli stille for deg, og du kan merke at energien synker uten folk rundt deg.',
      'Agree on one short, fixed chat or shared work session with a colleague each week.', 'Avtal én fast, kort prat eller felles arbeidsøkt med en kollega hver uke.'),
    low: H('help', 'Quiet work probably suits you, since you do not need much company to keep your energy up.', 'Arbeid med mye ro passer trolig godt for deg, siden du ikke trenger mye selskap for å holde energien oppe.',
      'Protect your quiet blocks by putting them in the calendar like meetings.', 'Beskytt de stille blokkene ved å legge dem inn i kalenderen som avtaler.')},
  // Work: structure
  {id: 'shifting-C2', ch: 'work', when: {structure: ['shifting']}, f: 'C2',
    high: H('hard', 'Your work changes a lot, and you probably like order. Constant changes of plan can cost you more than others.', 'Arbeidet ditt endrer seg mye, og du liker trolig orden. Stadige omkast kan koste deg mer enn andre.',
      'Keep one small thing fixed in the middle of the changes, such as the same start-up routine every morning.', 'Hold én liten ting fast midt i endringene, som samme oppstartsrutine hver morgen.'),
    low: H('help', 'You probably do not need everything tidy to function, which makes shifting days easier for you.', 'Du trenger trolig ikke at alt er ryddig for å fungere, og det gjør skiftende dager lettere for deg.',
      'Write down your two most important decisions each week, so others can follow what you change.', 'Skriv ned de to viktigste beslutningene dine hver uke, så andre kan følge med på hva du endrer.')},
  {id: 'shifting-O4', ch: 'work', when: {structure: ['shifting']}, f: 'O4',
    high: H('help', 'You probably enjoy variety and new tasks, which suits work that changes a lot.', 'Du trives trolig med variasjon og nye oppgaver, og det passer godt i arbeid som endrer seg mye.',
      'Say yes to one new task this month, and finish or hand over one old one.', 'Si ja til én ny oppgave denne måneden, og avslutt eller deleger én gammel.'),
    low: H('hard', 'Many new tasks and new ways of doing things can feel uncomfortable for you.', 'Mange nye oppgaver og stadig nye måter å gjøre ting på kan kjennes ubehagelig for deg.',
      'When something new is introduced, ask for one concrete example or template, so you have something familiar to start from.', 'Når noe nytt innføres, be om ett konkret eksempel eller en mal, så du har noe kjent å starte fra.')},
  {id: 'fixed-O4', ch: 'work', when: {structure: ['fixed']}, f: 'O4',
    high: H('hard', 'Fixed routines and similar days can get monotonous for you, since you probably look for variety.', 'Faste rutiner og like dager kan bli ensformige for deg, siden du trolig søker variasjon.',
      'Find one part of the job where you can try a new approach, and test it for two weeks.', 'Finn én del av jobben der du kan prøve en ny fremgangsmåte, og test den i to uker.'),
    low: H('help', 'You probably feel at home with the familiar, and fixed routines give you calm to do the job well.', 'Du trives trolig med det kjente, og faste rutiner gir deg ro til å gjøre jobben godt.',
      'Share your routines with a new colleague. What you take for granted can be gold for others.', 'Del rutinene dine med en ny kollega. Det du tar for gitt, kan være gull for andre.')},
  {id: 'fixed-C3', ch: 'work', when: {structure: ['fixed']}, f: 'C3',
    high: H('help', 'You take rules and agreements seriously, which suits work with fixed procedures.', 'Du tar regler og avtaler på alvor, og det passer godt i arbeid med faste prosedyrer.',
      'When a rule no longer makes sense, say so out loud instead of following it in silence.', 'Når en regel ikke gir mening lenger, si det høyt i stedet for å følge den i stillhet.'),
    low: H('hard', 'Fixed procedures can feel like a straitjacket when you do not see the point, and then things can slip.', 'Faste prosedyrer kan kjennes som en tvangstrøye når du ikke ser poenget, og da kan ting skli.',
      'Pick the two rules that matter most in your job, and set a reminder for them.', 'Velg de to reglene som betyr mest i jobben din, og sett en påminnelse for dem.')},
  // Work: pressure
  {id: 'pressure-N1', ch: 'work', when: {pressure: ['peaks', 'high']}, f: 'N1',
    high: H('hard', 'Pressure and deadlines can keep your worries running long after the working day is over.', 'Press og frister kan holde uroen din i gang lenge etter at arbeidsdagen er over.',
      'Write down your next three steps before you leave for the day, so your head does not have to hold them.', 'Skriv ned de tre neste stegene før du går for dagen, så hodet slipper å holde på dem.'),
    low: H('help', 'You probably do not get carried away by worry when deadlines pile up, and you can keep a cool head for others.', 'Du lar deg trolig ikke rive med av bekymring når fristene hoper seg opp, og kan holde hodet kaldt for andre.',
      'Ask a stressed colleague what the next concrete step is. Your calm can rub off.', 'Spør en stresset kollega hva som er neste konkrete steg. Roen din smitter.')},
  {id: 'pressure-N6', ch: 'work', when: {pressure: ['high']}, f: 'N6',
    high: H('hard', 'When a lot happens at once, it may feel like too much sooner than it does for others.', 'Når mye skjer samtidig, kan det kjennes som for mye tidligere enn for andre.',
      'Agree with your manager in advance what can wait when things get busy, before they get busy.', 'Avtal med lederen din på forhånd hva som kan vente når det blir travelt, før det blir travelt.'),
    low: H('help', 'You probably keep your head above water when things get stormy, which is useful in work with a lot of pressure.', 'Du holder trolig hodet over vannet når det stormer, og det er nyttig i arbeid med mye press.',
      'Use it to sketch a simple plan for the busy weeks that others can lean on too.', 'Bruk det til å lage en enkel plan for de travle ukene, som andre også kan støtte seg på.')},
  {id: 'pressure-C1', ch: 'work', when: {pressure: ['peaks', 'high']}, f: 'C1',
    high: H('help', 'You probably trust that you will manage, which makes it easier to take on big tasks under pressure.', 'Du har trolig tro på at du får det til, og det gjør det lettere å ta fatt på store oppgaver under press.',
      'Before saying yes to one more task, check that the trust also fits your calendar.', 'Før du sier ja til én oppgave til: sjekk at troen også passer med kalenderen.'),
    low: H('hard', 'Under pressure you may doubt that you will manage, even when you do.', 'Under press kan du tvile på om du får det til, selv når du gjør det.',
      'Every Friday, write down one thing you got done. Evidence beats feelings.', 'Skriv ned én ting du fikk til hver fredag. Bevis slår følelser.')},
  {id: 'pressure-C4', ch: 'work', when: {pressure: ['peaks', 'high']}, f: 'C4',
    high: H('help', 'You probably set high goals for yourself, which gives you drive when deadlines come.', 'Du setter trolig høye mål for deg selv, og det gir deg driv når fristene kommer.',
      'Decide in advance what “good enough” means for tasks that do not need your best.', 'Bestem på forhånd hva som er «godt nok» for oppgaver som ikke trenger ditt beste.'),
    low: H('hard', 'When a lot must be delivered at once, it can be hard to find the drive if the goal does not mean much to you.', 'Når mye skal leveres samtidig, kan det være vanskelig å finne driven hvis målet ikke betyr noe for deg.',
      'Link each big deadline to one reason you care about, and write it at the top of the document.', 'Knytt hver store frist til én grunn du selv bryr deg om, og skriv den øverst i dokumentet.')},

  // Everyday life: household
  {id: 'alone-E2', ch: 'life', when: {household: ['alone']}, f: 'E2',
    high: H('hard', 'You live alone and probably enjoy company. Without people around in everyday life, it can get quiet.', 'Du bor alene og trives trolig i selskap. Uten folk rundt deg i hverdagen kan det bli stille.',
      'Turn one weekly plan into a habit: dinner, training or a walk with someone.', 'Gjør én fast avtale i uka til en vane: middag, trening eller en tur med noen.'),
    low: H('help', 'You live alone and probably do not need much company. That gives you calm to recharge.', 'Du bor alene og trenger trolig ikke mye selskap. Det gir deg ro til å lade.',
      'Keep in touch with one person you care about anyway, for example a message every Sunday.', 'Hold likevel kontakt med én du er glad i, for eksempel med en melding hver søndag.')},
  {id: 'alone-C5', ch: 'life', when: {household: ['alone']}, f: 'C5',
    high: H('help', 'When nobody else sets the frame at home, it helps that you get yourself going.', 'Når ingen andre setter rammene hjemme, hjelper det at du får deg selv i gang.',
      'Leave one evening a week with nothing on the list.', 'La én kveld i uka stå uten noe på lista.'),
    low: H('hard', 'When nobody else sets the frame at home, habits and chores can easily slide.', 'Når ingen andre setter rammene hjemme, kan vaner og gjøremål lett skli ut.',
      'Tie one chore to a fixed time, such as Sunday evening.', 'Knytt ett gjøremål til et fast tidspunkt, som søndag kveld.')},
  {id: 'single-N1', ch: 'life', when: {household: ['single']}, f: 'N1',
    high: H('hard', 'When you carry a lot on your own, worries can take up a lot of space.', 'Når du bærer mye alene, kan bekymringene ta stor plass.',
      'Write your worries down in the evening, and pick one you will do something about tomorrow.', 'Skriv ned bekymringene om kvelden, og velg én du gjør noe med i morgen.'),
    low: H('help', 'You probably do not worry much, which helps when you carry a lot on your own.', 'Du bekymrer deg trolig lite, og det hjelper når du bærer mye alene.',
      'Use that calm to ask for help with one thing, before you need it.', 'Bruk roen til å be om hjelp med én ting, før du trenger det.')},
  {id: 'partner-A6', ch: 'life', when: {household: ['partner', 'family']}, f: 'A6',
    high: H('help', 'You probably notice quickly how your partner is doing, and that builds closeness.', 'Du merker trolig raskt hvordan partneren din har det, og det bygger nærhet.',
      'Remember to tell your partner how you are doing too, not only ask.', 'Husk å fortelle partneren hvordan du selv har det også, ikke bare spørre.'),
    low: H('hard', 'You may show care more through actions than words, and your partner might miss the words.', 'Du viser kanskje omsorg mer gjennom handling enn ord, og partneren kan savne ordene.',
      'Once this week, ask “How are you, really?” and just listen.', 'Spør én gang denne uka: «Hvordan har du det, egentlig?», og bare lytt.')},
  {id: 'home-A4', ch: 'life', when: {household: ['partner', 'family', 'shared']}, f: 'A4',
    high: H('help', 'You readily give way to keep the peace at home, which makes everyday life run smoothly. Watch that your own wishes do not disappear.', 'Du gir gjerne etter for å holde fred hjemme, og det gjør hverdagen smidig. Pass på at dine egne ønsker ikke forsvinner.',
      'Say one small thing you would actually like done differently this week.', 'Si fra om én liten ting du egentlig vil ha annerledes denne uka.'),
    low: H('hard', 'You tend to stand your ground, and in a home with several people small disagreements can grow big.', 'Du står gjerne på ditt, og i et hjem med flere kan små uenigheter vokse seg store.',
      'Before you argue your case, say what you think the other person wants. It lowers the temperature.', 'Før du argumenterer, si hva du tror den andre vil. Det senker temperaturen.')},
  {id: 'home-N2', ch: 'life', when: {household: ['partner', 'family', 'single', 'shared']}, f: 'N2',
    high: H('hard', 'Irritation probably comes quickly, and at home it is often the people closest to you who get it.', 'Irritasjonen kommer trolig raskt, og hjemme er det ofte de nærmeste som får den.',
      'When you feel it, say “give me five minutes” and leave the room before you answer.', 'Når du kjenner den, si «gi meg fem minutter» og gå ut av rommet før du svarer.'),
    low: H('help', 'You rarely get angry, which gives a calm tone at home.', 'Du blir sjelden sint, og det gir en rolig tone hjemme.',
      'Still say what bothers you, before it piles up.', 'Si likevel fra om det som plager deg, før det hoper seg opp.')},
  // Everyday life: children
  {id: 'kids-C2', ch: 'life', when: {kids: ['small', 'school', 'teens']}, f: 'C2',
    high: H('hard', 'Children bring mess and detours, and since you like order you may feel it more than others.', 'Barn gir rot og omveier, og siden du liker orden, kan du kjenne det sterkere enn andre.',
      'Choose one room or one shelf that stays tidy, and let the rest be good enough.', 'Bestem ett rom eller én hylle som skal være ryddig, og la resten være godt nok.'),
    low: H('help', 'You probably tolerate mess and chaos better than many, which makes life with children easier.', 'Du tåler trolig rot og kaos bedre enn mange, og det gjør hverdagen med barn lettere.',
      'Add one fixed routine, such as packing bags the night before, to take the pressure off mornings.', 'Legg inn én fast rutine, som at sekkene pakkes kvelden før, for å ta presset av morgenen.')},
  {id: 'small-N6', ch: 'life', when: {kids: ['small']}, f: 'N6',
    high: H('hard', 'Little sleep and many demands at once can make everything feel like too much sooner than for others.', 'Lite søvn og mange krav samtidig kan gjøre at alt kjennes som for mye tidligere enn for andre.',
      'Agree on one fixed break a week that is yours, and protect it.', 'Avtal én fast pause i uka som er din, og forsvar den.'),
    low: H('help', 'You probably stay calm when everything happens at once, and children pick up on that.', 'Du holder trolig roen når alt skjer på en gang, og det merker barna.',
      'Offer to take the hardest part of the evening, such as bedtime, on the toughest days.', 'Tilby å ta den tyngste delen av kvelden, som leggingen, på de tøffeste dagene.')},
  {id: 'teens-A1', ch: 'life', when: {kids: ['teens']}, f: 'A1',
    high: H('help', 'You probably trust others readily, and teenagers often grow when they are believed.', 'Du gir trolig andre tillit, og tenåringer vokser ofte på å bli trodd.',
      'Agree on one clear limit, so trust and freedom have a frame.', 'Bli enige om én tydelig grense, så tillit og frihet har en ramme.'),
    low: H('hard', 'You tend to be on guard, and with teenagers checking up can easily come across as distrust.', 'Du er gjerne på vakt, og overfor tenåringer kan kontroll lett oppleves som mistillit.',
      'Pick one area where you give more freedom, and follow up after a month.', 'Velg ett område der du gir mer frihet, og følg opp etter en måned.')},
  {id: 'kids-E4', ch: 'life', when: {kids: ['small', 'school']}, f: 'E4',
    high: H('help', 'You probably have plenty of drive, which helps when the day is full of pick-ups, dinner and bedtime.', 'Du har trolig mye fart i deg, og det hjelper når dagen er full av henting, middag og legging.',
      'Plan one slow weekend morning where nobody has to be anywhere.', 'Planlegg én rolig helgemorgen der ingen må noe sted.'),
    low: H('hard', 'Everyday life with children rarely has pauses, and it may wear on you more than on others.', 'En hverdag med barn har sjelden pauser, og den kan slite mer på deg enn på andre.',
      'Lower the bar on one thing this week, such as dinner, and use the time to rest.', 'Senk kravet til én ting denne uka, for eksempel middagen, og bruk tiden til å hvile.')},
  // Everyday life: week
  {id: 'packed-E4', ch: 'life', when: {week: ['full', 'packed']}, f: 'E4',
    high: H('help', 'You probably like having a lot going on, so a full week gives you as much as it takes.', 'Du liker trolig å ha mye på gang, så en full uke gir deg like mye som den tar.',
      'Keep one evening free anyway, so you notice whether you miss it.', 'Hold likevel én kveld fri, og legg merke til om du savner den.'),
    low: H('hard', 'A full week may drain you more than others, since you probably need a calmer pace.', 'En full uke kan tappe deg mer enn andre, siden du trolig trenger et roligere tempo.',
      'Cross out one plan this week, and use the time for nothing at all.', 'Stryk én avtale denne uka, og bruk tiden til ingenting.')},
  {id: 'packed-C2', ch: 'life', when: {week: ['packed']}, f: 'C2',
    high: H('help', 'You probably like order, which helps you keep track of a packed week.', 'Du liker trolig orden, og det hjelper deg å holde styr på en stappfull uke.',
      'Share your overview with the people around you, so you are not the only one who holds it.', 'Del oversikten med dem rundt deg, så du ikke er den eneste som holder den.'),
    low: H('hard', 'With a lot on the calendar, things can slip when you do not have fixed systems.', 'Med mye på timeplanen kan ting glippe når du ikke har faste systemer.',
      'Use one shared calendar for everything, and look at it every Sunday.', 'Bruk én felles kalender for alt, og se på den hver søndag.')},
  {id: 'room-E5', ch: 'life', when: {week: ['room']}, f: 'E5',
    high: H('hard', 'With plenty of time and few plans you may get bored, since you probably look for excitement.', 'Med god tid og få avtaler kan du kjede deg, siden du trolig søker spenning.',
      'Plan one new experience a month, something you have never done before.', 'Planlegg én ny opplevelse i måneden, noe du aldri har gjort før.'),
    low: H('help', 'Calm weeks probably suit you well, and you do not need much excitement to enjoy life.', 'Rolige uker passer deg trolig godt, og du trenger ikke mye spenning for å trives.',
      'Notice what gives you the most quiet joy in a week, and do a little more of it.', 'Legg merke til hva som gir deg mest stille glede i løpet av en uke, og gjør litt mer av det.')},
  // Everyday life: what they want more of
  {id: 'calm-N1', ch: 'life', when: {wish: ['calm']}, f: 'N1',
    high: H('hard', 'You want more calm, and your worries may be what steals it.', 'Du ønsker mer ro, og det kan være bekymringene som stjeler den.',
      'Set aside ten minutes a day as “worry time”, and park the rest until then.', 'Sett av ti minutter om dagen som «bekymringstid», og parker resten til da.'),
    low: H('help', 'You probably worry little, so more calm is mostly about your time, not your thoughts.', 'Du bekymrer deg trolig lite, så mer ro handler mest om tiden din, ikke tankene.',
      'Find one thing to say no to this week.', 'Finn én ting du kan si nei til denne uka.')},
  {id: 'energy-E2', ch: 'life', when: {wish: ['energy']}, f: 'E2',
    high: H('help', 'You probably get energy from people, so what you miss may be more company.', 'Du får trolig energi av folk, så det du savner kan være mer selskap.',
      'Say yes to the next invitation, even if it is short notice.', 'Si ja til neste invitasjon, selv om den kommer på kort varsel.'),
    low: H('help', 'More energy probably does not come from more people for you, but from time alone and things you enjoy.', 'For deg kommer mer energi trolig ikke fra flere folk, men fra tid alene og ting du liker.',
      'Plan time alone as deliberately as you plan appointments.', 'Planlegg tid alene like bevisst som du planlegger avtaler.')},
  {id: 'energy-E6', ch: 'life', when: {wish: ['energy']}, f: 'E6',
    high: H('help', 'You probably find joy easily, and small pleasant things give you a lot of energy.', 'Du har trolig lett for glede, og små hyggelige ting gir deg mye energi.',
      'Plan one thing each week that you look forward to.', 'Planlegg én ting hver uke som du gleder deg til.'),
    low: H('hard', 'Joy may not come easily in everyday life, and waiting for it rarely helps.', 'Gleden kommer kanskje ikke så lett i hverdagen, og det hjelper sjelden å vente på den.',
      'Write down one good thing each evening for two weeks, and notice whether it changes anything.', 'Skriv ned én god ting hver kveld i to uker, og legg merke til om det endrer noe.')},
  {id: 'routines-C5', ch: 'life', when: {wish: ['routines']}, f: 'C5',
    high: H('help', 'You probably follow through on what you decide, so a new routine has a good chance of sticking.', 'Du gjennomfører trolig det du bestemmer deg for, så en ny rutine har god sjanse til å feste seg.',
      'Start with one routine, not five.', 'Start med én rutine, ikke fem.'),
    low: H('hard', 'Routines that need willpower every day can easily break for you.', 'Rutiner som krever viljestyrke hver dag, kan lett ryke for deg.',
      'Make the routine almost too small: two minutes, not twenty.', 'Gjør rutinen nesten for liten: to minutter, ikke tjue.')},
  {id: 'routines-N5', ch: 'life', when: {wish: ['routines']}, f: 'N5',
    high: H('hard', 'Resisting temptation may be hard for you, and that can knock new routines over.', 'Det kan være vanskelig for deg å stå imot fristelser, og det kan velte nye rutiner.',
      'Make the temptation a little harder to reach, such as leaving your phone in another room at night.', 'Gjør fristelsen litt vanskeligere å nå, for eksempel ved å legge telefonen i et annet rom om kvelden.'),
    low: H('help', 'You probably resist temptations fairly easily, which helps new routines hold.', 'Du står trolig ganske lett imot fristelser, og det gjør det lettere for nye rutiner å feste seg.',
      'Allow yourself one planned exception a week, so the routine does not feel like a cage.', 'Gi deg selv ett planlagt unntak i uka, så rutinen ikke kjennes som et bur.')},
  {id: 'close-E1', ch: 'life', when: {wish: ['close']}, f: 'E1',
    high: H('help', 'You probably show warmth easily, which makes it easier to get close to people.', 'Du viser trolig varme lett, og det gjør det lettere å komme nær folk.',
      'Give one person close to you your full attention for half an hour this week, with the phone away.', 'Gi én som står deg nær full oppmerksomhet en halvtime denne uka, med telefonen borte.'),
    low: H('hard', 'Your warmth may not always show on the outside, so people close to you might think you are more reserved than you are.', 'Varmen din synes kanskje ikke alltid utenpå, så de nærmeste kan tro at du er mer reservert enn du er.',
      'Tell someone close to you, out loud, one thing you appreciate about them this week.', 'Si høyt til en som står deg nær, én ting du setter pris på hos dem denne uka.')},
  {id: 'close-A1', ch: 'life', when: {wish: ['close']}, f: 'A1',
    high: H('help', 'You probably trust others readily, which makes it easier to let people in.', 'Du gir trolig andre tillit, og det gjør det lettere å slippe folk inn.',
      'Let someone help you with something this week, even if you could do it yourself.', 'La noen hjelpe deg med noe denne uka, selv om du kunne klart det selv.'),
    low: H('hard', 'It may take time before you trust people, and that can keep even those closest to you at a distance.', 'Det kan ta tid før du stoler på folk, og det kan holde selv de nærmeste litt på avstand.',
      'Share one small thing about how you are doing with someone you care about, and see what happens.', 'Del én liten ting om hvordan du har det med en du er glad i, og se hva som skjer.')}
];

const pick = (pair, language) => pair[language === 'no' ? 1 : 0];

/** Questions to show for a chapter, given the answers so far (follow-ups appear only when relevant). */
export function visibleQuestions(chapter, answers = {}) {
  return questions[chapter].filter(q => !q.when || Object.entries(q.when).every(([k, v]) => v.includes(answers[k])));
}

export function isComplete(chapter, answers = {}) {
  return visibleQuestions(chapter, answers).every(q => q.options.some(o => o[0] === answers[q.id]));
}

export function optionLabel(chapter, qid, value, language) {
  const o = questions[chapter].find(q => q.id === qid)?.options.find(x => x[0] === value);
  return o ? o[language === 'no' ? 2 : 1] : '';
}

// Distance from the middle: percentile when available, otherwise the 1–5 mean.
const extremity = f => Number.isFinite(f.percentile) ? Math.abs(f.percentile - 50) / 50 : Math.abs(f.mean - 3) / 2;

/**
 * Combines the chapter answers with the facet scores. Returns up to `limit` lines that help and
 * up to `limit` lines that can make things harder, the most pronounced facets first. Answers to
 * follow-up questions that are no longer shown are ignored.
 */
export function tailor(domains, chapter, answers = {}, language = 'en', limit = 3) {
  const shown = new Set(visibleQuestions(chapter, answers).map(q => q.id));
  const facets = Object.fromEntries(domains.flatMap(d => d.facets).map(f => [f.code, f]));
  const seen = new Set(), lines = [];
  for (const r of rules) {
    if (r.ch !== chapter || seen.has(r.f)) continue;
    const reason = Object.entries(r.when).find(([k]) => !shown.has(k) || !r.when[k].includes(answers[k]));
    if (reason) continue;
    const f = facets[r.f];
    if (!f || f.band === 'middle' || !r[f.band]) continue;
    seen.add(r.f);
    const c = r[f.band];
    lines.push({kind: c.kind, facet: f, text: pick(c.text, language), try: pick(c.try, language),
      because: Object.keys(r.when).map(k => optionLabel(chapter, k, answers[k], language)).join(' · '), ruleId: `${TAILOR_VERSION}/${chapter}/${r.id}/${f.band}`});
  }
  lines.sort((a, b) => extremity(b.facet) - extremity(a.facet) || a.facet.code.localeCompare(b.facet.code));
  return {helps: lines.filter(l => l.kind === 'help').slice(0, limit), hard: lines.filter(l => l.kind === 'hard').slice(0, limit)};
}
