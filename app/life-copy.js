// «Hverdagsliv og relasjoner»: the deeper everyday-life module in the 79 kr / $7.99 tier (149 kr until 2026-10-18) (2026-10-16).
// Built like «Din jobb, din profil» (career-copy.js): the reader answers eight questions about their
// everyday life and the people close to them, and fixed rules pick what the report says. Each rule names
// one answer and one facet, and fires only when that facet sits outside the middle range in the named
// direction. The text describes the facet in plain words; the facet chip next to it carries the name.
// Every item keeps its rule id, facet codes and answer ids, so each claim can be traced back to a score
// and an answer. Pairs are [English, Norwegian bokmål]. Editorial reflection text, not validated claims.

export const LIFE_VERSION = 'life-v1';

export const OTHER_MAX = 80;

export const questions = [
  {id: 'household', q: ['Who do you share everyday life with?', 'Hvem deler du hverdagen med?'], options: [
    ['alone', 'I live alone', 'Jeg bor alene'],
    ['partner', 'A partner', 'Partner'],
    ['family', 'A partner and children', 'Partner og barn'],
    ['single', 'Children, without a partner', 'Barn, uten partner'],
    ['shared', 'Family, friends or flatmates', 'Familie, venner eller bofeller'],
    ['other', 'Other', 'Annet']]},
  {id: 'kids', multi: 2, when: {household: ['family', 'single']}, q: ['How old are the children?', 'Hvor gamle er barna?'], options: [
    ['small', 'Under 6', 'Under 6 år'],
    ['school', '6 to 12', '6 til 12 år'],
    ['teens', '13 to 18', '13 til 18 år'],
    ['adult', 'Adults', 'Voksne']]},
  {id: 'focus', q: ['Which relationship do you most want to look after right now?', 'Hvilken relasjon vil du helst ta vare på nå?'], options: [
    ['partner', 'My partner', 'Partneren min'],
    ['children', 'My children', 'Barna mine'],
    ['family', 'Parents or family', 'Foreldre eller familie'],
    ['friends', 'Friends', 'Venner'],
    ['meet', 'Meeting someone new', 'Å møte noen nye'],
    ['none', 'None in particular', 'Ingen spesiell'],
    ['other', 'Other', 'Annet']]},
  {id: 'social', q: ['How is your social life right now?', 'Hvordan er det sosiale livet ditt nå?'], options: [
    ['quiet', 'Quieter than I would like', 'Roligere enn jeg vil'],
    ['few', 'A few close people, and that suits me', 'Noen få nære, og det passer meg'],
    ['many', 'Plenty of people', 'Mange folk rundt meg'],
    ['toomuch', 'More than I have energy for', 'Mer enn jeg har energi til'],
    ['other', 'Other', 'Annet']]},
  {id: 'conflict', q: ['When you disagree with someone close, what usually happens?', 'Når du er uenig med en du står nær, hva skjer som regel?'], options: [
    ['heated', 'I say it straight away, and it can get heated', 'Jeg sier det med en gang, og det kan bli opphetet'],
    ['calm', 'I say it, calmly', 'Jeg sier det, rolig'],
    ['keep', 'I keep it to myself', 'Jeg holder det for meg selv'],
    ['givein', 'I give in to keep the peace', 'Jeg gir meg for å bevare freden'],
    ['rarely', 'We rarely disagree', 'Vi er sjelden uenige'],
    ['other', 'Other', 'Annet']]},
  {id: 'week', q: ['How full is your week?', 'Hvor full er uka di?'], options: [
    ['room', 'Plenty of room', 'God plass'],
    ['full', 'Fairly full', 'Ganske full'],
    ['packed', 'Packed', 'Stappfull'],
    ['uneven', 'Very uneven', 'Svært ujevn'],
    ['other', 'Other', 'Annet']]},
  {id: 'drains', multi: 2, q: ['What drains you most in everyday life?', 'Hva tapper deg mest i hverdagen?'], options: [
    ['chores', 'Chores and admin', 'Husarbeid og papirer'],
    ['metime', 'Too little time to myself', 'For lite tid for meg selv'],
    ['alone', 'Too much time alone', 'For mye alenetid'],
    ['tension', 'Tension at home', 'Spenning hjemme'],
    ['reachable', 'Always being reachable', 'Å alltid være tilgjengelig'],
    ['plans', 'Plans that change', 'Planer som endres'],
    ['rest', 'Not enough rest', 'For lite hvile'],
    ['other', 'Other', 'Annet']]},
  {id: 'energy', multi: 2, q: ['What gives you the most energy?', 'Hva gir deg mest energi?'], options: [
    ['alone', 'Time on my own', 'Tid alene'],
    ['friends', 'Seeing friends', 'Å treffe venner'],
    ['close', 'Close time with partner or family', 'Nær tid med partner eller familie'],
    ['new', 'Doing something new', 'Å gjøre noe nytt'],
    ['done', 'Getting things done at home', 'Å få unna ting hjemme'],
    ['outdoors', 'Being outdoors or active', 'Å være ute eller i aktivitet'],
    ['create', 'Making something', 'Å lage noe'],
    ['other', 'Other', 'Annet']]},
  {id: 'goal', q: ['What would you most like to change in the next few months?', 'Hva vil du helst endre de neste månedene?'], options: [
    ['calm', 'More calm', 'Mer ro'],
    ['closer', 'A closer relationship', 'En nærere relasjon'],
    ['friends', 'More or better friendships', 'Flere eller bedre venner'],
    ['routines', 'Better routines', 'Bedre rutiner'],
    ['fewer', 'Fewer arguments', 'Færre krangler'],
    ['balance', 'Better balance between me-time and others', 'Bedre balanse mellom egentid og andre'],
    ['other', 'Other', 'Annet']]}
];

export const SECTIONS = ['good', 'hard', 'close', 'conflict', 'drain', 'energy', 'next'];
export const LIMIT = {good: 3, hard: 3, close: 4, conflict: 3, drain: 3, energy: 2, next: 3};
const PRIORITY = ['close', 'conflict', 'hard', 'good', 'drain', 'energy'];

// R(section, question, values, facet, direction, text EN, text NO, try EN, try NO)
const R = (section, q, v, facet, dir, en, no, tryEn = '', tryNo = '') => ({section, q, v: [].concat(v), facet, dir, text: [en, no], try: [tryEn, tryNo]});

// Order matters: within a section the first rule that names a facet wins, so the more specific
// answers (children's ages, who you live with) come before the general ones.
export const rules = [
  // ── What helps and what can get harder ─────────────────────────────────
  R('hard', 'kids', 'small', 'N2', 'high', 'Small children test anyone’s patience, and irritation comes quickly for you. That says nothing about how good a parent you are.', 'Små barn setter tålmodigheten på prøve, og irritasjonen kommer fort hos deg. Det sier ingenting om hvor god forelder du er.', 'Find one short reset, like three slow breaths, before you answer when you feel it rising.', 'Finn én kort pause, som tre rolige pust, før du svarer når du kjenner det stige.'),
  R('hard', 'kids', 'small', 'E4', 'low', 'Small children set a high pace, and you prefer a calmer one. The days can wear you down faster than they seem to wear down others.', 'Små barn setter et høyt tempo, og du foretrekker et roligere. Dagene kan slite deg ut fortere enn de ser ut til å slite ut andre.', 'Pick one calm activity you and the children both like, and make it a fixed part of the week.', 'Velg én rolig aktivitet både du og barna liker, og gjør den til en fast del av uka.'),
  R('good', 'kids', 'small', 'E4', 'high', 'You have a lot of energy, and that helps when small children set the pace.', 'Du har mye energi, og det hjelper når små barn setter tempoet.', 'Check that you also get one quiet hour a week for yourself.', 'Sjekk at du også får én rolig time i uka for deg selv.'),
  R('hard', 'kids', 'school', 'C5', 'low', 'Homework, activities and messages from school need steady follow-up, and getting started on that kind of task does not come easily for you.', 'Lekser, aktiviteter og beskjeder fra skolen krever jevn oppfølging, og å komme i gang med sånt faller ikke naturlig for deg.', 'Choose one fixed ten minutes each evening for school things, and keep it for two weeks.', 'Velg ti faste minutter hver kveld til skoleting, og hold på det i to uker.'),
  R('good', 'kids', 'school', 'C2', 'high', 'School-age children come with schedules, packed lunches and messages, and your sense of order probably keeps it all together.', 'Skolebarn kommer med timeplaner, matpakker og beskjeder, og ordenssansen din holder trolig det hele sammen.', 'Share the list with someone else at home, so not everything rests on you.', 'Del listen med en annen hjemme, så ikke alt hviler på deg.'),
  R('hard', 'kids', 'teens', 'A1', 'low', 'With teenagers, letting go matters, and since you are careful about trusting, you may check more than they like.', 'Med tenåringer handler mye om å slippe taket, og siden du er forsiktig med å stole på andre, kan du sjekke mer enn de liker.', 'Agree on one thing you will not check this month, and keep to it.', 'Avtal én ting du ikke skal sjekke denne måneden, og hold deg til det.'),
  R('hard', 'kids', 'teens', 'C6', 'high', 'Teenagers take chances you cannot control, and you like to think things through and stay on the safe side.', 'Tenåringer tar sjanser du ikke kan styre, og du liker å tenke deg om og holde deg på den sikre siden.', 'Talk through one «what if» with your teenager, then leave the decision to them.', 'Snakk gjennom ett «hva om» med tenåringen, og la dem ta avgjørelsen selv.'),
  R('good', 'kids', 'adult', 'E1', 'high', 'With adult children, closeness is something you both choose, and your warmth probably makes it easy to keep in touch.', 'Med voksne barn er nærheten noe dere velger selv, og varmen din gjør det trolig lett å holde kontakten.', 'Suggest one thing to do together that is not a family dinner.', 'Foreslå én ting å gjøre sammen som ikke er en familiemiddag.'),
  R('hard', 'household', 'family', 'N6', 'high', 'With a partner and children, the days rarely go to plan, and you probably feel the pressure more than most.', 'Med partner og barn går dagene sjelden etter planen, og du kjenner trolig presset mer enn de fleste.', 'Agree on one fixed half hour a week where someone else takes over.', 'Avtal én fast halvtime i uka der noen andre tar over.'),
  R('good', 'household', 'family', 'C2', 'high', 'A family has many moving parts, and your sense of order probably keeps the household running.', 'En familie har mange deler i bevegelse, og ordenssansen din holder trolig hjemmet i gang.', 'Share one list with your partner, so not everything rests on you.', 'Del én liste med partneren din, så ikke alt hviler på deg.'),
  R('hard', 'household', 'family', 'C2', 'low', 'With children in the house, a lot needs remembering, and keeping things in order may not come naturally to you.', 'Med barn i huset er det mye å huske, og å holde orden faller kanskje ikke naturlig for deg.', 'Use one shared family calendar, and put the next three things in it today.', 'Bruk én felles familiekalender, og legg inn de tre neste tingene i dag.'),
  R('hard', 'household', 'single', 'N6', 'high', 'As the only adult at home, everything lands on you, and pressure probably hits you harder than most.', 'Som eneste voksne hjemme lander alt på deg, og press treffer deg trolig hardere enn de fleste.', 'Name one person you can ask for help this month, and ask for one specific thing.', 'Tenk på én person du kan be om hjelp denne måneden, og be om én bestemt ting.'),
  R('good', 'household', 'single', 'C1', 'high', 'You trust yourself to handle what comes, which matters when you carry everyday life alone.', 'Du stoler på at du takler det som kommer, og det betyr mye når du bærer hverdagen alene.', 'Write down one thing you handled well this week.', 'Skriv ned én ting du fikk til denne uka.'),
  R('hard', 'household', 'alone', 'E2', 'high', 'You live alone and enjoy company more than most. Quiet evenings can feel emptier than you expect.', 'Du bor alene og liker selskap mer enn de fleste. Stille kvelder kan kjennes tommere enn du venter.', 'Put one fixed social plan in the calendar each week, even a short one.', 'Legg inn én fast sosial avtale i kalenderen hver uke, selv en kort en.'),
  R('good', 'household', 'alone', 'E2', 'low', 'You live alone and need less company than most. Your home probably gives you the quiet you need to recharge.', 'Du bor alene og trenger mindre selskap enn de fleste. Hjemmet gir deg trolig roen du trenger for å lade opp.', 'Protect one evening a week for yourself, also when invitations come.', 'Beskytt én kveld i uka for deg selv, også når invitasjonene kommer.'),
  R('hard', 'household', 'alone', 'C5', 'low', 'With no one else at home, routines rest on you alone, and getting going with chores can be hard.', 'Når ingen andre bor hjemme, hviler rutinene på deg alene, og det kan være tungt å komme i gang med husarbeid.', 'Pair one dull chore with something you like, such as a podcast.', 'Koble én kjedelig oppgave med noe du liker, som en podkast.'),
  R('good', 'household', 'partner', 'A4', 'high', 'You rarely make small disagreements bigger than they are, and that helps when you share a home with a partner.', 'Du gjør sjelden små uenigheter større enn de er, og det hjelper når du deler hjem med en partner.', 'Still say it once when something matters to you.', 'Si likevel ifra én gang når noe betyr noe for deg.'),
  R('hard', 'household', 'partner', 'N2', 'high', 'Irritation comes quickly for you, and at home it is often your partner who gets it.', 'Irritasjonen kommer fort hos deg, og hjemme er det ofte partneren din som får den.', 'When you feel it, say «give me five minutes» before you answer.', 'Når du kjenner det, si «gi meg fem minutter» før du svarer.'),
  R('hard', 'household', 'shared', 'A4', 'low', 'You tend to stand your ground, and in a home with several people small disagreements can grow big.', 'Du står gjerne på ditt, og i et hjem med flere mennesker kan små uenigheter vokse seg store.', 'Before you argue your case, say what you think the other person wants.', 'Før du argumenterer for ditt, si hva du tror den andre vil.'),
  R('good', 'household', 'shared', 'E1', 'high', 'You are warm and easy to approach, which makes a shared home easier for everyone.', 'Du er varm og lett å komme innpå, og det gjør et delt hjem lettere for alle.', 'Suggest one shared meal a week.', 'Foreslå ett felles måltid i uka.'),
  R('hard', 'week', 'packed', 'N6', 'high', 'Your week is packed, and pressure hits you harder than most. The days can feel heavier than they look on paper.', 'Uka di er stappfull, og press treffer deg hardere enn de fleste. Dagene kan kjennes tyngre enn de ser ut på papiret.', 'Remove or move one thing from next week’s calendar.', 'Fjern eller flytt én ting i kalenderen for neste uke.'),
  R('hard', 'week', 'packed', 'E4', 'low', 'Your week is packed, and you prefer a slower pace than most. That can wear you down faster than others.', 'Uka di er stappfull, og du foretrekker et roligere tempo enn de fleste. Det kan slite deg ut fortere enn andre.', 'Keep one evening a week completely free, and treat it as an appointment.', 'Hold én kveld i uka helt fri, og behandle den som en avtale.'),
  R('good', 'week', ['packed', 'full'], 'E4', 'high', 'You like a high pace, so a full week probably feels lively rather than heavy.', 'Du liker høyt tempo, så en full uke kjennes trolig levende heller enn tung.', 'Check that one evening a week still stays free.', 'Sjekk at én kveld i uka fortsatt er fri.'),
  R('hard', 'week', ['packed', 'full'], 'C2', 'low', 'With a full week and little taste for planning, things can slip through the cracks.', 'Med en full uke og lite sans for planlegging kan ting falle mellom stolene.', 'Spend ten minutes on Sunday looking at the week ahead.', 'Bruk ti minutter på søndag på å se over uka som kommer.'),
  R('good', 'week', ['full', 'packed'], 'C2', 'high', 'A full week works best with order, and order probably comes naturally to you.', 'En full uke fungerer best med orden, og orden faller trolig naturlig for deg.', 'Leave one slot a week unplanned on purpose.', 'La ett tidsrom i uka stå uplanlagt med vilje.'),
  R('hard', 'week', 'room', 'C5', 'low', 'With plenty of room in the week, the days can slip by without what you meant to do, since getting started does not come easily for you.', 'Med god plass i uka kan dagene gli forbi uten det du hadde tenkt å gjøre, siden det ikke faller lett for deg å komme i gang.', 'Give each free day one thing you want done.', 'Gi hver fri dag én ting du vil få gjort.'),
  R('hard', 'week', 'room', 'E5', 'high', 'You have plenty of free time and a strong taste for excitement, which can leave you restless.', 'Du har god tid og stor sans for spenning, og det kan gjøre deg rastløs.', 'Plan one new thing each week, however small.', 'Planlegg én ny ting hver uke, uansett hvor liten.'),
  R('hard', 'week', 'uneven', 'C6', 'high', 'An uneven week is hard to plan, and you like to think things through before you act.', 'En ujevn uke er vanskelig å planlegge, og du liker å tenke deg om før du handler.', 'Plan the fixed parts, and keep one slot open for what comes up.', 'Planlegg de faste delene, og hold av ett tidsrom til det som dukker opp.'),
  R('good', 'week', 'uneven', 'O4', 'high', 'You like variety, so an uneven week probably suits you better than a fixed one.', 'Du liker variasjon, så en ujevn uke passer deg trolig bedre enn en fast.', 'Keep one small routine that stays the same, like a morning walk.', 'Behold én liten rutine som er lik, som en morgentur.'),
  R('hard', 'social', 'quiet', 'E2', 'high', 'Your social life is quieter than you want, and you enjoy company more than most. That gap is worth taking seriously.', 'Det sosiale livet er roligere enn du vil, og du liker selskap mer enn de fleste. Det gapet er verdt å ta på alvor.', 'Invite one person to something small this week.', 'Inviter én person til noe lite denne uka.'),
  R('hard', 'social', 'quiet', 'N4', 'high', 'You may hold back from reaching out because you worry about how you come across.', 'Du kan holde deg tilbake fra å ta kontakt fordi du bekymrer deg for hvordan du fremstår.', 'Send one short message to someone you miss, without rewriting it.', 'Send én kort melding til noen du savner, uten å skrive den om.'),
  R('good', 'social', 'few', 'E2', 'low', 'A few close people suit you, and you need less company than most to feel good.', 'Noen få nære passer deg, og du trenger mindre selskap enn de fleste for å ha det bra.', 'Give one of those people your full attention this week.', 'Gi én av dem din fulle oppmerksomhet denne uka.'),
  R('hard', 'social', 'few', 'E2', 'high', 'You keep to a few close people, while you enjoy company more than most. You may want more than you think.', 'Du holder deg til noen få nære, mens du liker selskap mer enn de fleste. Du kan ønske deg mer enn du tror.', 'Say yes to one invitation you would normally skip.', 'Si ja til én invitasjon du vanligvis ville droppet.'),
  R('good', 'social', 'many', 'E2', 'high', 'You have plenty of people around you, and you enjoy company more than most. That probably gives you energy.', 'Du har mange folk rundt deg, og du liker selskap mer enn de fleste. Det gir deg trolig energi.', 'Notice who you leave with more energy than you came with.', 'Legg merke til hvem du går fra med mer energi enn du kom med.'),
  R('hard', 'social', ['many', 'toomuch'], 'E2', 'low', 'You have more social life than you need, since you need less company than most. It can drain you more than you show.', 'Du har mer sosialt liv enn du trenger, siden du trenger mindre selskap enn de fleste. Det kan tappe deg mer enn du viser.', 'Say no to one plan a week, without explaining why.', 'Si nei til én avtale i uka, uten å forklare hvorfor.'),
  R('good', 'household', 'alone', 'C1', 'high', 'You trust yourself to handle what comes, which helps when everyday life rests on you alone.', 'Du stoler på at du takler det som kommer, og det hjelper når hverdagen hviler på deg alene.', 'Write down one thing you sorted out on your own this week.', 'Skriv ned én ting du fikk ordnet på egen hånd denne uka.'),
  R('hard', 'household', 'alone', 'N3', 'high', 'Living alone, low days can be harder to shake when there is no one to talk to in the evening.', 'Når du bor alene, kan tunge dager være vanskeligere å riste av seg når det ikke er noen å snakke med om kvelden.', 'Agree with one person to check in on each other once a week.', 'Avtal med én person at dere sjekker inn med hverandre én gang i uka.'),
  R('hard', 'household', 'alone', 'N5', 'high', 'Living alone, no one notices when a habit runs away with you, and you act on impulse more than most.', 'Når du bor alene, er det ingen som merker når en vane tar overhånd, og du handler mer på impuls enn de fleste.', 'Choose one habit you want less of, and set one simple limit for it.', 'Velg én vane du vil ha mindre av, og sett én enkel grense for den.'),
  R('good', 'household', 'alone', 'O1', 'high', 'You have a rich imagination, so time at home on your own is rarely dull.', 'Du har rik fantasi, så tid hjemme alene er sjelden kjedelig.', 'Give one evening a week to something you make or dream up.', 'Gi én kveld i uka til noe du lager eller finner på.'),
  R('good', 'household', ['partner', 'family'], 'A6', 'high', 'You feel strongly with the people you live with, and they probably feel cared for.', 'Du føler sterkt med dem du bor med, og de føler seg trolig ivaretatt.', 'Check now and then that you also say what you need yourself.', 'Sjekk innimellom at du også sier hva du trenger selv.'),
  R('hard', 'household', ['partner', 'family'], 'A4', 'low', 'You stand your ground, and at home small disagreements can turn into tugs of war.', 'Du står på ditt, og hjemme kan små uenigheter bli til dragkamper.', 'Pick one small thing this week and let the other person decide.', 'Velg én liten ting denne uka og la den andre bestemme.'),
  R('good', 'household', ['partner', 'family'], 'C3', 'high', 'You keep what you promise, and that builds trust in a shared home.', 'Du holder det du lover, og det bygger tillit i et felles hjem.', 'Ask what one promise would matter most to the others this month.', 'Spør hvilket løfte som ville betydd mest for de andre denne måneden.'),
  R('hard', 'household', 'partner', 'C2', 'low', 'Keeping the home in order may not come naturally to you, and your partner may end up doing more of it.', 'Å holde orden hjemme faller kanskje ikke naturlig for deg, og partneren din kan ende opp med å gjøre mer av det.', 'Agree who does what at home, and write it down.', 'Avtal hvem som gjør hva hjemme, og skriv det ned.'),
  R('good', 'household', ['partner', 'family', 'shared'], 'E6', 'high', 'You laugh easily, and that probably makes everyday life at home lighter.', 'Du ler lett, og det gjør trolig hverdagen hjemme lettere.', 'Notice what made the others laugh this week, and do more of it.', 'Legg merke til hva som fikk de andre til å le denne uka, og gjør mer av det.'),
  R('hard', 'household', ['family', 'single'], 'N2', 'high', 'With children at home, irritation comes quickly for you, and it often lands on the people closest to you.', 'Med barn hjemme kommer irritasjonen fort hos deg, og den lander ofte på dem som står deg nærmest.', 'When you feel it, step away for one minute before you answer.', 'Når du kjenner det, gå unna i ett minutt før du svarer.'),
  R('good', 'household', ['family', 'single'], 'E4', 'high', 'You have plenty of energy, which helps in a busy home with children.', 'Du har mye energi, og det hjelper i et travelt hjem med barn.', 'Keep one quiet hour a week for yourself as well.', 'Hold av én rolig time i uka til deg selv også.'),
  R('hard', 'household', ['family', 'single'], 'E4', 'low', 'Life with children sets a high pace, and you prefer a calmer one.', 'Livet med barn har høyt tempo, og du foretrekker et roligere.', 'Choose one evening a week with nothing planned after dinner.', 'Velg én kveld i uka der ingenting er planlagt etter middag.'),
  R('good', 'household', ['family', 'single'], 'N6', 'low', 'Pressure rarely knocks you off balance, which helps when family days do not go to plan.', 'Press slår deg sjelden ut av balanse, og det hjelper når familiedagene ikke går etter planen.', 'Use the calm to take over one hard moment of the day for someone else.', 'Bruk roen til å ta over ett krevende øyeblikk i dagen for en annen.'),
  R('good', 'household', ['family', 'single'], 'A3', 'high', 'You like helping others, which matters a lot in a home with children.', 'Du liker å hjelpe andre, og det betyr mye i et hjem med barn.', 'Let the children help with one task you would rather do yourself.', 'La barna hjelpe til med én oppgave du helst ville gjort selv.'),
  R('hard', 'household', 'single', 'C2', 'low', 'As the only adult, there is a lot to keep track of, and keeping order may not come naturally to you.', 'Som eneste voksne er det mye å holde styr på, og orden faller kanskje ikke naturlig for deg.', 'Put a list on the fridge with the three things that must not be forgotten this week.', 'Heng en liste på kjøleskapet med de tre tingene som ikke må glemmes denne uka.'),
  R('hard', 'household', 'shared', 'C2', 'high', 'You like order more than most, so other people’s mess at home can bother you more than it bothers them.', 'Du liker orden mer enn de fleste, så andres rot hjemme kan plage deg mer enn det plager dem.', 'Agree on one shared rule for the kitchen.', 'Avtal én felles regel for kjøkkenet.'),
  R('good', 'household', 'shared', 'A4', 'high', 'You rarely make small disagreements bigger than they are, which helps in a shared home.', 'Du gjør sjelden små uenigheter større enn de er, og det hjelper i et delt hjem.', 'Still say it once when something matters to you.', 'Si likevel ifra én gang når noe betyr noe for deg.'),
  R('hard', 'household', 'shared', 'E2', 'low', 'Sharing a home with several people, you may get less time alone than you need.', 'Når du deler hjem med flere, kan du få mindre alenetid enn du trenger.', 'Agree on one place or time at home that is just yours.', 'Avtal ett sted eller én tid hjemme som bare er din.'),
  R('hard', 'week', 'full', 'N6', 'high', 'Your week is fairly full, and pressure hits you harder than most. Small extras can tip it over.', 'Uka di er ganske full, og press treffer deg hardere enn de fleste. Små ekstra ting kan få det til å tippe over.', 'Keep one slot a week free for the unexpected.', 'Hold av ett tidsrom i uka til det uventede.'),
  R('good', 'week', ['full', 'packed'], 'C5', 'high', 'You get going without much fuss, which helps when the week is full.', 'Du kommer i gang uten mye styr, og det hjelper når uka er full.', 'Plan one break as carefully as you plan the tasks.', 'Planlegg én pause like nøye som oppgavene.'),
  R('hard', 'week', 'packed', 'C4', 'high', 'You set high standards, and in a packed week it can be hard to accept «good enough».', 'Du har høye krav til deg selv, og i en stappfull uke kan det være vanskelig å godta «godt nok».', 'Pick one task this week where good enough really is enough.', 'Velg én oppgave denne uka der godt nok virkelig er nok.'),
  R('good', 'week', ['packed', 'uneven'], 'N6', 'low', 'Pressure rarely knocks you off balance, so a demanding week is probably manageable for you.', 'Press slår deg sjelden ut av balanse, så en krevende uke er trolig håndterbar for deg.', 'Notice who around you is struggling more, and offer one small hand.', 'Legg merke til hvem rundt deg som strever mer, og tilby en liten hjelpende hånd.'),
  R('good', 'week', 'room', 'O5', 'high', 'With room in the week, you have time for your curiosity about ideas.', 'Med god plass i uka har du tid til nysgjerrigheten din på ideer.', 'Pick one thing to read or learn about this month.', 'Velg én ting å lese eller lære om denne måneden.'),
  R('good', 'week', 'room', 'E2', 'low', 'Room in the week gives you the quiet you need, since you need less company than most.', 'God plass i uka gir deg roen du trenger, siden du trenger mindre selskap enn de fleste.', 'Use one free evening on something that really recharges you.', 'Bruk én fri kveld på noe som virkelig lader deg opp.'),
  R('hard', 'week', 'room', 'E4', 'high', 'You have a lot of energy, and too much free time can make you restless.', 'Du har mye energi, og for mye fritid kan gjøre deg rastløs.', 'Fill one free day with something active.', 'Fyll én fri dag med noe aktivt.'),
  R('hard', 'week', 'uneven', 'C2', 'high', 'An uneven week makes it hard to keep the order you like.', 'En ujevn uke gjør det vanskelig å holde den ordenen du liker.', 'Keep one small part of the day the same, whatever else happens.', 'Hold én liten del av dagen lik, uansett hva annet som skjer.'),
  R('hard', 'social', 'quiet', 'N3', 'high', 'A quiet social life and low days can feed each other.', 'Et rolig sosialt liv og tunge dager kan forsterke hverandre.', 'Plan one small social thing on the days you expect to be low.', 'Planlegg én liten sosial ting på dagene du venter å være nedfor.'),
  R('hard', 'social', 'quiet', 'E1', 'low', 'You may warm up slowly, which can make it harder to get more people around you.', 'Du tiner kanskje sakte opp, og det kan gjøre det vanskeligere å få flere folk rundt deg.', 'Say hello to one neighbour or colleague you rarely talk to.', 'Hils på én nabo eller kollega du sjelden snakker med.'),
  R('good', 'social', 'few', 'A1', 'high', 'You trust the people close to you, which is what makes a small circle strong.', 'Du stoler på dem som står deg nær, og det er det som gjør en liten krets sterk.', 'Tell one of them what they mean to you.', 'Si til én av dem hva de betyr for deg.'),
  R('good', 'social', 'many', 'E1', 'high', 'You are warm and easy to approach, which helps you keep many relationships going.', 'Du er varm og lett å komme innpå, og det hjelper deg å holde mange relasjoner ved like.', 'Pick one relationship to go deeper in this month.', 'Velg én relasjon å gå dypere i denne måneden.'),
  R('hard', 'social', 'many', 'C3', 'low', 'With many people around you, plans and small promises can slip.', 'Med mange folk rundt deg kan avtaler og små løfter gli ut.', 'Put every plan in the calendar as soon as you make it.', 'Legg hver avtale i kalenderen med en gang dere lager den.'),
  R('hard', 'social', 'toomuch', 'A3', 'high', 'You like to help, and with many people around you, many ask.', 'Du liker å hjelpe, og med mange folk rundt deg er det mange som spør.', 'Say no to one request this week without explaining.', 'Si nei til én forespørsel denne uka uten å forklare.'),
  R('hard', 'social', 'toomuch', 'N6', 'high', 'More social life than you have energy for, and pressure hits you harder than most.', 'Mer sosialt liv enn du har energi til, og press treffer deg hardere enn de fleste.', 'Leave one weekend this month without plans.', 'La én helg denne måneden stå uten planer.'),
  R('hard', 'social', 'toomuch', 'A4', 'high', 'You would rather go along than disappoint anyone, so the calendar can fill with other people’s plans.', 'Du blir heller med enn å skuffe noen, så kalenderen kan fylles med andres planer.', 'Say «let me check and get back to you» before you say yes.', 'Si «jeg sjekker og kommer tilbake til deg» før du sier ja.'),

  // ── You and the people close to you (question 2) ───────────────────────
  R('close', 'focus', 'partner', 'A1', 'low', 'You probably check before you trust, also at home. Your partner may read it as doubt, even when it is just caution.', 'Du sjekker trolig før du stoler på noen, også hjemme. Partneren din kan oppfatte det som tvil, selv når det bare er forsiktighet.', 'Once this week, take something your partner says at face value, and notice what happens.', 'Én gang denne uka: ta noe partneren din sier for god fisk, og legg merke til hva som skjer.'),
  R('close', 'focus', 'partner', 'A6', 'high', 'You feel strongly with your partner, which brings you close. It can also make you carry their worries as your own.', 'Du føler sterkt med partneren din, og det bringer dere nær hverandre. Det kan også gjøre at du bærer bekymringene deres som dine egne.', 'Ask «do you want advice, or just someone to listen?»', 'Spør «vil du ha råd, eller bare noen som lytter?»'),
  R('close', 'focus', 'partner', 'N1', 'high', 'You worry more than most, and in a relationship that can show as a need for reassurance.', 'Du bekymrer deg mer enn de fleste, og i et forhold kan det vise seg som et behov for å bli beroliget.', 'Next time a worry comes up, check it with your partner instead of guessing.', 'Neste gang en bekymring dukker opp: sjekk den med partneren din i stedet for å gjette.'),
  R('close', 'focus', 'partner', 'N3', 'high', 'You can feel low more often than most, and it is easy to pull away from your partner then.', 'Du kan føle deg nedfor oftere enn de fleste, og da er det lett å trekke seg unna partneren.', 'When you feel low, say it in one sentence instead of going quiet.', 'Når du er nedfor, si det med én setning i stedet for å bli stille.'),
  R('close', 'focus', 'partner', 'O3', 'high', 'You notice your own feelings well, which makes it easier to tell your partner what is going on in you.', 'Du merker godt hva du føler, og det gjør det lettere å fortelle partneren din hva som skjer i deg.', 'Ask your partner how they feel, and wait for the answer.', 'Spør partneren din hvordan de har det, og vent på svaret.'),
  R('close', 'focus', 'partner', 'O3', 'low', 'You may not notice your own feelings until they are strong, so your partner may not always know what goes on in you.', 'Du merker kanskje ikke følelsene dine før de er sterke, så partneren din vet ikke alltid hva som skjer i deg.', 'At the end of the day, name one feeling in one word and tell your partner.', 'Sett ett ord på en følelse på slutten av dagen, og fortell det til partneren din.'),
  R('close', 'focus', 'partner', 'E1', 'low', 'You may show warmth less openly than you feel it, and your partner may need to hear it.', 'Du viser kanskje varme mindre åpent enn du kjenner den, og partneren din kan trenge å høre den.', 'Say one thing you appreciate about your partner today.', 'Si én ting du setter pris på ved partneren din i dag.'),
  R('close', 'focus', 'partner', 'C3', 'high', 'You keep your promises, and your partner can probably count on you.', 'Du holder det du lover, og partneren din kan trolig stole på deg.', 'Ask what one thing would make the biggest difference for them this week.', 'Spør hva én ting ville gjort størst forskjell for dem denne uka.'),
  R('close', 'focus', 'partner', 'C3', 'low', 'Small promises can slip for you, and at home they add up.', 'Små løfter kan gli ut for deg, og hjemme hoper de seg opp.', 'Write down the next promise you make at home, and keep it.', 'Skriv ned det neste løftet du gir hjemme, og hold det.'),
  R('close', 'focus', 'children', 'A6', 'high', 'You feel strongly with your children, which helps them feel seen. It can also make it hard to let them struggle a little.', 'Du føler sterkt med barna dine, og det hjelper dem å føle seg sett. Det kan også gjøre det vanskelig å la dem streve litt.', 'Let your child solve one small problem on their own this week.', 'La barnet løse ett lite problem på egen hånd denne uka.'),
  R('close', 'focus', 'children', 'N2', 'high', 'Irritation comes quickly for you, and children notice. Making up afterwards matters more than never losing patience.', 'Irritasjonen kommer fort hos deg, og barn merker det. Å gjøre det godt igjen etterpå betyr mer enn aldri å miste tålmodigheten.', 'After you snap, go back and say sorry in one sentence.', 'Når du har glefset, gå tilbake og si unnskyld med én setning.'),
  R('close', 'focus', 'children', 'C2', 'high', 'You probably give your children routines and predictability, which many children do well with.', 'Du gir trolig barna rutiner og forutsigbarhet, og det har mange barn godt av.', 'Leave one weekend afternoon unplanned together.', 'La én ettermiddag i helgen stå uplanlagt sammen.'),
  R('close', 'focus', 'children', 'C2', 'low', 'Routines may not come easily to you, and children often do better with a few fixed ones.', 'Rutiner faller kanskje ikke lett for deg, og barn har ofte godt av noen få faste.', 'Pick one routine, like bedtime, and keep it the same for two weeks.', 'Velg én rutine, som leggetid, og hold den lik i to uker.'),
  R('close', 'focus', 'children', 'E1', 'high', 'You show warmth easily, and children notice that.', 'Du viser varme lett, og det merker barn.', 'Ask one open question at dinner: «What was the best part of your day?»', 'Still ett åpent spørsmål ved middagen: «Hva var det beste med dagen din?»'),
  R('close', 'focus', 'children', 'E4', 'low', 'Children often want more activity than you have energy for.', 'Barn vil ofte ha mer aktivitet enn du har energi til.', 'Choose one calm activity you both like, and suggest it before you are tired.', 'Velg én rolig aktivitet dere begge liker, og foreslå den før du er sliten.'),
  R('close', 'focus', 'family', 'A3', 'high', 'You probably help your family a lot, sometimes more than you have room for.', 'Du hjelper trolig familien mye, noen ganger mer enn du har plass til.', 'Say no to one request this month, and notice that the relationship holds.', 'Si nei til én forespørsel denne måneden, og legg merke til at forholdet tåler det.'),
  R('close', 'focus', 'family', 'A4', 'low', 'You stand your ground, and family disagreements can follow old patterns.', 'Du står på ditt, og uenigheter i familien kan følge gamle mønstre.', 'Next family visit, let one old disagreement rest.', 'La én gammel uenighet ligge ved neste familiebesøk.'),
  R('close', 'focus', 'family', 'N2', 'high', 'Old family patterns can set off irritation quickly for you.', 'Gamle familiemønstre kan fort vekke irritasjonen hos deg.', 'Before a family visit, decide what you will say if the usual topic comes up.', 'Bestem før et familiebesøk hva du vil si hvis det vanlige temaet dukker opp.'),
  R('close', 'focus', 'family', 'C3', 'high', 'You take family obligations seriously, and your family can count on you.', 'Du tar familieforpliktelser på alvor, og familien kan stole på deg.', 'Choose one obligation you can let go of this year.', 'Velg én forpliktelse du kan gi slipp på i år.'),
  R('close', 'focus', 'family', 'E1', 'low', 'You may keep in touch less than you mean to.', 'Du holder kanskje mindre kontakt enn du har tenkt.', 'Set a fixed time each week to call one family member.', 'Sett av et fast tidspunkt hver uke til å ringe ett familiemedlem.'),
  R('close', 'focus', 'friends', 'E2', 'high', 'You like being with people, so friendships probably give you a lot.', 'Du liker å være sammen med folk, så vennskap gir deg trolig mye.', 'Invite two friends who do not know each other.', 'Inviter to venner som ikke kjenner hverandre.'),
  R('close', 'focus', 'friends', 'E2', 'low', 'You need less company than most, so your friendships may thrive best as fewer and closer ones.', 'Du trenger mindre selskap enn de fleste, så vennskapene dine trives kanskje best som færre og nærere.', 'Pick one friend and suggest something just the two of you.', 'Velg én venn og foreslå noe bare dere to.'),
  R('close', 'focus', 'friends', 'E1', 'low', 'You may warm up slowly, so new friendships can take longer to grow.', 'Du tiner kanskje sakte opp, så nye vennskap kan bruke lengre tid på å vokse.', 'Say yes to one invitation you would normally skip.', 'Si ja til én invitasjon du vanligvis ville droppet.'),
  R('close', 'focus', 'friends', 'N4', 'high', 'You may worry about how you come across, which can stop you from reaching out.', 'Du kan bekymre deg for hvordan du fremstår, og det kan stoppe deg fra å ta kontakt.', 'Send one short message to a friend today.', 'Send én kort melding til en venn i dag.'),
  R('close', 'focus', 'friends', 'A1', 'high', 'You trust people easily, which makes it easy for friends to open up to you.', 'Du stoler lett på folk, og det gjør det lett for venner å åpne seg for deg.', 'Ask one friend how things really are, and listen.', 'Spør én venn hvordan det egentlig går, og lytt.'),
  R('close', 'focus', 'friends', 'C3', 'low', 'Plans with friends can slip, and friends may read it as not caring.', 'Avtaler med venner kan gli ut, og venner kan tolke det som at du ikke bryr deg.', 'Put the next plan in the calendar as soon as you make it.', 'Legg neste avtale i kalenderen med en gang dere lager den.'),
  R('close', 'focus', 'meet', 'N4', 'high', 'Meeting new people can feel uncomfortable, since you notice how you come across.', 'Å møte nye mennesker kan kjennes ubehagelig, siden du merker hvordan du fremstår.', 'Prepare one question you would like to ask a new person.', 'Forbered ett spørsmål du gjerne vil stille en ny person.'),
  R('close', 'focus', 'meet', 'E1', 'high', 'You are warm and open, which makes first meetings easier.', 'Du er varm og åpen, og det gjør første møter lettere.', 'Go to one place this month where you can meet new people.', 'Gå til ett sted denne måneden der du kan møte nye folk.'),
  R('close', 'focus', 'meet', 'E2', 'low', 'You need less company than most, so small settings may suit you better than big parties.', 'Du trenger mindre selskap enn de fleste, så små sammenhenger passer deg trolig bedre enn store fester.', 'Look for one small group or activity with the same people each week.', 'Se etter én liten gruppe eller aktivitet med de samme folkene hver uke.'),
  R('close', 'focus', 'meet', 'O4', 'high', 'You like trying new things, which can be an easy way to meet people.', 'Du liker å prøve nye ting, og det kan være en enkel vei til å møte folk.', 'Try one new activity where others are beginners too.', 'Prøv én ny aktivitet der andre også er nybegynnere.'),
  R('close', 'focus', 'meet', 'A1', 'low', 'You are careful about trusting, which protects you, but it can make letting someone in slow.', 'Du er forsiktig med å stole på folk, og det beskytter deg, men det kan gjøre det tregt å slippe noen inn.', 'Give one new person one more chance than you normally would.', 'Gi én ny person én sjanse mer enn du vanligvis ville gjort.'),
  R('close', 'focus', 'partner', 'A4', 'low', 'You stand your ground, also with your partner, and small things can turn into contests about who is right.', 'Du står på ditt, også med partneren din, og små ting kan bli konkurranser om hvem som har rett.', 'Let your partner have the last word on one small thing this week.', 'La partneren din få siste ord om én liten ting denne uka.'),
  R('close', 'focus', 'partner', 'E6', 'high', 'You laugh easily, and shared humour is often what keeps a couple close.', 'Du ler lett, og felles humor er ofte det som holder et par nær hverandre.', 'Plan one evening where the only goal is to have fun together.', 'Planlegg én kveld der det eneste målet er å ha det gøy sammen.'),
  R('close', 'focus', 'partner', 'A5', 'high', 'You tend to put yourself last, and your partner may not know what you want.', 'Du setter gjerne deg selv sist, og partneren din vet kanskje ikke hva du ønsker deg.', 'Say one thing you would like the two of you to do this month.', 'Si én ting du gjerne vil at dere skal gjøre denne måneden.'),
  R('close', 'focus', 'partner', 'N6', 'high', 'When pressure builds, it hits you harder than most, and your partner often feels it first.', 'Når presset bygger seg opp, treffer det deg hardere enn de fleste, og partneren din merker det ofte først.', 'Tell your partner early when the week is getting heavy, before it shows.', 'Si fra til partneren din tidlig når uka begynner å bli tung, før det synes.'),
  R('close', 'focus', 'children', 'N1', 'high', 'You worry more than most, and with children worry has plenty to work on.', 'Du bekymrer deg mer enn de fleste, og med barn har bekymringene mye å ta tak i.', 'Next time you worry about your child, ask yourself what the most likely outcome is.', 'Neste gang du bekymrer deg for barnet ditt: spør deg selv hva det mest sannsynlige utfallet er.'),
  R('close', 'focus', 'children', 'C3', 'high', 'You keep your promises, and children learn a lot from that.', 'Du holder det du lover, og det lærer barn mye av.', 'Make one small promise this week that is only about fun, and keep it.', 'Gi ett lite løfte denne uka som bare handler om noe gøy, og hold det.'),
  R('close', 'focus', 'children', 'A1', 'low', 'You are careful about trusting, and children may read checking as not being trusted.', 'Du er forsiktig med å stole på andre, og barn kan oppfatte sjekking som at de ikke blir stolt på.', 'Give your child one task this week and do not check how it went.', 'Gi barnet én oppgave denne uka, og ikke sjekk hvordan det gikk.'),
  R('close', 'focus', 'children', 'E6', 'high', 'You laugh easily, and children notice a parent who enjoys their company.', 'Du ler lett, og barn merker en forelder som liker å være sammen med dem.', 'Let your child choose what you do together for one hour.', 'La barnet velge hva dere gjør sammen i én time.'),
  R('close', 'focus', 'family', 'A1', 'low', 'You are careful about trusting, and with family that can keep old suspicions alive.', 'Du er forsiktig med å stole på andre, og i familien kan det holde gammel mistro i live.', 'Assume the best about one family member’s intentions this month.', 'Tro det beste om ett familiemedlems hensikter denne måneden.'),
  R('close', 'focus', 'family', 'N1', 'high', 'You worry more than most, and family is often where worries gather.', 'Du bekymrer deg mer enn de fleste, og familien er ofte der bekymringene samler seg.', 'Call to ask, rather than wondering.', 'Ring og spør, i stedet for å lure.'),
  R('close', 'focus', 'family', 'A6', 'high', 'You feel strongly with your family, which means you notice when someone is struggling.', 'Du føler sterkt med familien, og det betyr at du merker når noen strever.', 'Ask how they are, and resist fixing it straight away.', 'Spør hvordan de har det, og la være å løse det med en gang.'),
  R('close', 'focus', 'friends', 'E6', 'high', 'You laugh easily, and friends probably like being around you.', 'Du ler lett, og vennene dine liker trolig å være sammen med deg.', 'Gather a few friends for something simple this month.', 'Samle noen venner til noe enkelt denne måneden.'),
  R('close', 'focus', 'friends', 'A3', 'high', 'You like helping, and friends probably come to you when they need it.', 'Du liker å hjelpe, og venner kommer trolig til deg når de trenger det.', 'Ask a friend for help with something small, so it goes both ways.', 'Be en venn om hjelp med noe lite, så det går begge veier.'),
  R('close', 'focus', 'friends', 'N2', 'high', 'Irritation comes quickly, and with friends it can turn into distance rather than talk.', 'Irritasjonen kommer fort, og med venner kan den bli til avstand heller enn prat.', 'Bring up one small annoyance with a friend while it is still small.', 'Ta opp én liten irritasjon med en venn mens den fortsatt er liten.'),
  R('close', 'focus', 'meet', 'E3', 'low', 'You rarely take the lead socially, so new people may not know you are interested.', 'Du tar sjelden ledelsen sosialt, så nye folk vet kanskje ikke at du er interessert.', 'Suggest one plan yourself, instead of waiting to be asked.', 'Foreslå én avtale selv, i stedet for å vente på å bli spurt.'),
  R('close', 'focus', 'meet', 'E6', 'high', 'You laugh easily, and that is attractive to most people.', 'Du ler lett, og det liker de fleste.', 'Say yes to one social plan you are unsure about.', 'Si ja til én sosial avtale du er usikker på.'),
  R('close', 'focus', 'meet', 'N3', 'high', 'You can feel low more often than most, and a setback in meeting people can weigh more than it should.', 'Du kan føle deg nedfor oftere enn de fleste, og et tilbakeslag når du møter folk kan veie mer enn det burde.', 'After a meeting that went badly, write down one thing that went well.', 'Skriv ned én ting som gikk bra etter et møte som gikk dårlig.'),
  R('close', 'focus', ['none', 'other'], 'C3', 'high', 'You keep your promises, and the people close to you can count on you.', 'Du holder det du lover, og de som står deg nær kan stole på deg.', 'Ask one person what would help them most this month.', 'Spør én person hva som ville hjulpet dem mest denne måneden.'),
  R('close', 'focus', ['none', 'other'], 'N1', 'high', 'You worry more than most, and with people you care about, worry can show as a need for reassurance.', 'Du bekymrer deg mer enn de fleste, og med dem du er glad i kan det vise seg som et behov for å bli beroliget.', 'Check one worry with the person it is about, instead of guessing.', 'Sjekk én bekymring med den det gjelder, i stedet for å gjette.'),
  R('close', 'focus', ['none', 'other'], 'A1', 'low', 'You probably check before you trust, and people close to you may read it as doubt.', 'Du sjekker trolig før du stoler på noen, og de som står deg nær kan oppfatte det som tvil.', 'Once this week, take what someone close says at face value.', 'Én gang denne uka: ta det en nær person sier for god fisk.'),
  R('close', 'focus', ['none', 'other'], 'E1', 'low', 'You may show warmth less openly than you feel it.', 'Du viser kanskje varme mindre åpent enn du kjenner den.', 'Tell one person close to you something you appreciate about them.', 'Si én ting du setter pris på til en som står deg nær.'),
  R('close', 'focus', ['none', 'other'], 'E1', 'high', 'You show warmth easily, which makes people feel welcome around you.', 'Du viser varme lett, og det gjør at folk føler seg velkomne hos deg.', 'Use it on someone you have not talked to in a while.', 'Bruk den på noen du ikke har snakket med på en stund.'),
  R('close', 'focus', ['none', 'other'], 'A6', 'high', 'You feel strongly with the people close to you. It brings you close, and it can also make you carry their worries.', 'Du føler sterkt med dem som står deg nær. Det bringer dere nær hverandre, og det kan også gjøre at du bærer bekymringene deres.', 'Ask «do you want advice, or just someone to listen?»', 'Spør «vil du ha råd, eller bare noen som lytter?»'),
  R('close', 'focus', ['none', 'other'], 'N2', 'high', 'Irritation comes quickly, and it often lands on the people closest to you.', 'Irritasjonen kommer fort, og den lander ofte på dem som står deg nærmest.', 'When you feel it, say «give me five minutes» before you answer.', 'Når du kjenner det, si «gi meg fem minutter» før du svarer.'),

  // ── When you disagree (question 4) ─────────────────────────────────────
  R('conflict', 'conflict', 'heated', 'N2', 'high', 'Disagreements get heated, and irritation comes quickly for you. The heat probably comes more from temperament than from the topic.', 'Uenigheter blir opphetet, og irritasjonen kommer fort hos deg. Varmen kommer trolig mer fra temperamentet enn fra temaet.', 'Agree on a word that means «pause, we continue in twenty minutes».', 'Avtal et ord som betyr «pause, vi fortsetter om tjue minutter».'),
  R('conflict', 'conflict', 'heated', 'A4', 'low', 'You stand your ground, which helps you get heard, but it can turn a disagreement into a contest.', 'Du står på ditt, og det hjelper deg å bli hørt, men det kan gjøre en uenighet til en konkurranse.', 'Repeat the other person’s point in your own words before you answer.', 'Gjenta den andres poeng med dine egne ord før du svarer.'),
  R('conflict', 'conflict', 'heated', 'N5', 'high', 'You act on impulse more than most, so words can come out before you have thought them through.', 'Du handler mer på impuls enn de fleste, så ord kan komme ut før du har tenkt dem gjennom.', 'Count to five before you answer in your next disagreement.', 'Tell til fem før du svarer i neste uenighet.'),
  R('conflict', 'conflict', 'heated', 'A4', 'high', 'You value peace, so heated disagreements probably cost you a lot afterwards.', 'Du setter pris på fred, så opphetede uenigheter koster deg trolig mye etterpå.', 'Take the conversation up again when you are both calm.', 'Ta opp samtalen igjen når dere begge er rolige.'),
  R('conflict', 'conflict', 'calm', 'E3', 'high', 'You say what you think, calmly and clearly, so people know where they stand with you.', 'Du sier hva du mener, rolig og tydelig, så folk vet hvor de har deg.', 'Ask what the other person needs before you suggest a solution.', 'Spør hva den andre trenger før du foreslår en løsning.'),
  R('conflict', 'conflict', ['calm', 'rarely'], 'N2', 'low', 'Irritation rarely takes over for you, so you can stay calm when others do not.', 'Irritasjonen tar sjelden overhånd hos deg, så du kan holde roen når andre ikke gjør det.', 'Use that calm to suggest a solution you can both live with.', 'Bruk roen til å foreslå en løsning dere begge kan leve med.'),
  R('conflict', 'conflict', 'calm', 'A4', 'low', 'You say it calmly, but you probably still like to win the point.', 'Du sier det rolig, men du liker trolig fortsatt å vinne diskusjonen.', 'In your next disagreement, name one thing the other person is right about.', 'Si én ting den andre har rett i, i neste uenighet.'),
  R('conflict', 'conflict', ['keep', 'givein', 'rarely'], 'E3', 'low', 'You rarely push your own view, and what you do not say can build up over time.', 'Du presser sjelden på ditt eget syn, og det du ikke sier, kan hope seg opp over tid.', 'Say one small disagreement out loud this week.', 'Si én liten uenighet høyt denne uka.'),
  R('conflict', 'conflict', 'keep', 'N4', 'high', 'You may hold back because you worry about how it will come across.', 'Du kan holde igjen fordi du bekymrer deg for hvordan det tas imot.', 'Start with «I may be wrong, but …» and say it anyway.', 'Start med «Jeg kan ta feil, men …» og si det likevel.'),
  R('conflict', 'conflict', ['keep', 'givein'], 'N1', 'high', 'You worry more than most, so a disagreement you do not voice can keep spinning in your head.', 'Du bekymrer deg mer enn de fleste, så en uenighet du ikke sier noe om, kan fortsette å surre i hodet.', 'Write down what you would have said, then decide whether to say it.', 'Skriv ned det du ville sagt, og bestem deg så for om du skal si det.'),
  R('conflict', 'conflict', 'keep', 'A1', 'low', 'You may assume the worst about what the other person thinks, without checking.', 'Du kan anta det verste om hva den andre tenker, uten å sjekke.', 'Ask what they meant before you decide what they meant.', 'Spør hva de mente før du bestemmer deg for hva de mente.'),
  R('conflict', 'conflict', 'givein', 'A4', 'high', 'You would rather give way than argue. It keeps the peace now, but what you swallow can build up.', 'Du gir heller etter enn å krangle. Det bevarer freden nå, men det du svelger, kan hope seg opp.', 'Say one small wish out loud this week, before you are asked.', 'Si ett lite ønske høyt denne uka, før noen spør.'),
  R('conflict', 'conflict', 'givein', 'A5', 'high', 'You tend to put yourself last, so your needs can disappear in the compromise.', 'Du setter gjerne deg selv sist, så behovene dine kan forsvinne i kompromisset.', 'Before you give in, say what you would have wanted.', 'Si hva du ville ønsket deg før du gir deg.'),
  R('conflict', 'conflict', 'rarely', 'A4', 'high', 'You rarely disagree, and you value harmony. Check now and then that it is real agreement and not just avoiding friction.', 'Dere er sjelden uenige, og du verdsetter harmoni. Sjekk innimellom at det er ekte enighet og ikke bare unngåelse.', 'Ask once this month: «Is there anything you would like us to do differently?»', 'Spør én gang denne måneden: «Er det noe du vil at vi skal gjøre annerledes?»'),

  R('conflict', 'conflict', 'heated', 'E3', 'high', 'You speak up quickly and clearly, which means the other person may feel run over before they have said their part.', 'Du sier fra raskt og tydelig, og den andre kan føle seg overkjørt før de har fått sagt sitt.', 'Ask «what do you think?» before you give your view.', 'Spør «hva tenker du?» før du sier hva du mener.'),
  R('conflict', 'conflict', ['heated', 'keep'], 'A1', 'low', 'You may assume the worst about what the other person means, which can make things sharper than they need to be.', 'Du kan anta det verste om hva den andre mener, og det kan gjøre ting skarpere enn de trenger å være.', 'Ask what they meant before you answer what you think they meant.', 'Spør hva de mente før du svarer på det du tror de mente.'),
  R('conflict', 'conflict', 'calm', 'O3', 'high', 'You notice your own feelings well, which helps you say what a disagreement is really about.', 'Du merker godt hva du føler, og det hjelper deg å si hva uenigheten egentlig handler om.', 'Name the feeling behind your view next time: «I get worried when …».', 'Si følelsen bak synet ditt neste gang: «Jeg blir bekymret når …».'),
  R('conflict', 'conflict', 'calm', 'A4', 'high', 'You say it calmly and you look for a solution, which makes it easier for others to meet you halfway.', 'Du sier det rolig og ser etter en løsning, og det gjør det lettere for andre å møte deg på halvveien.', 'Check afterwards that the solution also works for you.', 'Sjekk etterpå at løsningen også fungerer for deg.'),
  R('conflict', 'conflict', 'keep', 'A4', 'high', 'You keep it to yourself because you value peace, but the other person cannot respond to what they do not know.', 'Du holder det for deg selv fordi du verdsetter fred, men den andre kan ikke svare på noe de ikke vet om.', 'Say one thing that bothers you, in one calm sentence.', 'Si én ting som plager deg, med én rolig setning.'),
  R('conflict', 'conflict', 'givein', 'N4', 'high', 'You may give in because you worry about how standing your ground will look.', 'Du kan gi deg fordi du bekymrer deg for hvordan det ser ut å stå på ditt.', 'Practise one sentence: «I see it differently, and that is fine.»', 'Øv på én setning: «Jeg ser det annerledes, og det er greit.»'),
  R('conflict', 'conflict', 'rarely', 'A5', 'high', 'You tend to put yourself last, so «we rarely disagree» may sometimes mean that you let it go.', 'Du setter gjerne deg selv sist, så «vi er sjelden uenige» kan noen ganger bety at du lar det passere.', 'Notice once this week whether you agreed or just let it go.', 'Legg merke til én gang denne uka om du var enig eller bare lot det passere.'),
  R('conflict', 'conflict', 'rarely', 'O3', 'low', 'You may not notice your own feelings until they are strong, so small disagreements can pass unnoticed until they are big.', 'Du merker kanskje ikke følelsene dine før de er sterke, så små uenigheter kan passere ubemerket til de er store.', 'At the end of the week, ask yourself whether anything bothered you.', 'Spør deg selv på slutten av uka om noe har plaget deg.'),

  // ── What drains you (question 6) ───────────────────────────────────────
  R('drain', 'drains', 'chores', 'C5', 'low', 'Chores drain you, and getting started on that kind of task does not come easily for you.', 'Husarbeid tapper deg, og det faller ikke lett for deg å komme i gang med den typen oppgaver.', 'Set a timer for fifteen minutes and stop when it rings.', 'Sett en tidtaker på femten minutter og stopp når den ringer.'),
  R('drain', 'drains', 'chores', 'C2', 'high', 'You like things in order, so chores can feel endless because they are never quite done.', 'Du liker orden, så husarbeid kan kjennes uendelig fordi det aldri blir helt ferdig.', 'Decide what «clean enough» means for one room.', 'Bestem hva «rent nok» betyr for ett rom.'),
  R('drain', 'drains', 'chores', 'O4', 'high', 'You like variety, so repetitive chores feel extra dull to you.', 'Du liker variasjon, så ensformig husarbeid kjennes ekstra kjedelig for deg.', 'Change the order or the music, and see if it helps.', 'Bytt rekkefølge eller musikk, og se om det hjelper.'),
  R('drain', 'drains', 'metime', 'E2', 'low', 'You need time alone more than most, so too little of it drains you fast.', 'Du trenger alenetid mer enn de fleste, så for lite av det tapper deg fort.', 'Book one hour a week for yourself, like an appointment.', 'Sett av én time i uka til deg selv, som en avtale.'),
  R('drain', 'drains', 'metime', 'A3', 'high', 'You give a lot to others, and your own time is often the first thing to go.', 'Du gir mye til andre, og din egen tid er ofte det første som ryker.', 'Say no to one request this week that someone else can take.', 'Si nei til én forespørsel denne uka som noen andre kan ta.'),
  R('drain', 'drains', 'alone', 'E2', 'high', 'You enjoy company more than most, so too much time alone drains you.', 'Du liker selskap mer enn de fleste, så for mye alenetid tapper deg.', 'Plan one short meeting with someone on the days you are alone.', 'Planlegg ett kort møte med noen på dagene du er alene.'),
  R('drain', 'drains', 'alone', 'N3', 'high', 'You can feel low more often than most, and long stretches alone can make it heavier.', 'Du kan føle deg nedfor oftere enn de fleste, og lange perioder alene kan gjøre det tyngre.', 'Get outside and talk to one person each day you are alone, even briefly.', 'Kom deg ut og snakk med én person hver dag du er alene, selv kort.'),
  R('drain', 'drains', 'tension', 'A4', 'high', 'You value harmony, so tension at home costs you more than most.', 'Du verdsetter harmoni, så spenning hjemme koster deg mer enn de fleste.', 'Name the tension calmly once: «I notice it feels tense. Can we talk?»', 'Si fra om spenningen rolig én gang: «Jeg merker at det er anspent. Kan vi snakke?»'),
  R('drain', 'drains', 'tension', 'N1', 'high', 'You worry more than most, so tension at home can keep going in your head long after.', 'Du bekymrer deg mer enn de fleste, så spenning hjemme kan surre i hodet lenge etterpå.', 'Write the worry down, and choose one time to bring it up.', 'Skriv ned bekymringen, og velg ett tidspunkt å ta den opp.'),
  R('drain', 'drains', 'tension', 'N2', 'high', 'Irritation comes quickly for you, which can add to the tension.', 'Irritasjonen kommer fort hos deg, og det kan øke spenningen.', 'Leave the room for five minutes before you answer.', 'Gå ut av rommet i fem minutter før du svarer.'),
  R('drain', 'drains', 'reachable', 'E2', 'low', 'Always being reachable costs extra when you need time alone more than most.', 'Å alltid være tilgjengelig koster ekstra når du trenger alenetid mer enn de fleste.', 'Turn off notifications for one evening a week.', 'Slå av varsler én kveld i uka.'),
  R('drain', 'drains', 'reachable', 'N1', 'high', 'Messages that wait for an answer can keep your mind busy, since you worry more than most.', 'Meldinger som venter på svar kan holde hodet ditt opptatt, siden du bekymrer deg mer enn de fleste.', 'Pick two fixed times a day to answer messages.', 'Velg to faste tider om dagen til å svare på meldinger.'),
  R('drain', 'drains', 'reachable', 'A3', 'high', 'You find it hard not to help when someone asks, so being reachable means being on duty.', 'Du synes det er vanskelig å la være å hjelpe når noen spør, så å være tilgjengelig betyr å være på vakt.', 'Answer one request with «I can do it tomorrow».', 'Svar på én forespørsel med «jeg kan ta det i morgen».'),
  R('drain', 'drains', 'plans', 'C2', 'high', 'Order matters to you, so plans that change can feel like losing your footing.', 'Orden betyr mye for deg, så planer som endres kan kjennes som å miste fotfestet.', 'Keep one small plan B ready for the plan that changes most often.', 'Ha en liten plan B klar for den planen som oftest endres.'),
  R('drain', 'drains', 'plans', 'C6', 'high', 'You like to think before you act, so sudden changes are hard.', 'Du liker å tenke deg om før du handler, så plutselige endringer er krevende.', 'Ask for a few minutes to think before you answer a change.', 'Be om noen minutter til å tenke før du svarer på en endring.'),
  R('drain', 'drains', 'rest', 'N6', 'high', 'Pressure hits you harder than most, and without rest it builds up.', 'Press treffer deg hardere enn de fleste, og uten hvile hoper det seg opp.', 'Put one block of rest in the calendar this week, and keep it.', 'Legg inn én hvilepause i kalenderen denne uka, og hold på den.'),
  R('drain', 'drains', 'rest', 'E4', 'high', 'You keep a high pace, and slowing down may not come naturally.', 'Du holder høyt tempo, og å senke farten faller kanskje ikke naturlig.', 'Choose one evening without plans, and notice what you do with it.', 'Velg én kveld uten planer, og legg merke til hva du bruker den til.'),
  R('drain', 'drains', 'rest', 'C4', 'high', 'You set high standards, which can make it hard to stop.', 'Du har høye krav til deg selv, og det kan gjøre det vanskelig å stoppe.', 'Decide in the morning what «done for today» means.', 'Bestem om morgenen hva «ferdig for i dag» betyr.'),

  // ── What gives you energy (question 7) ─────────────────────────────────
  R('energy', 'energy', 'alone', 'E2', 'low', 'Time on your own gives you energy, which fits that you need less company than most.', 'Tid alene gir deg energi, og det passer med at du trenger mindre selskap enn de fleste.', 'Protect one hour on your own each week.', 'Beskytt én time alene hver uke.'),
  R('energy', 'energy', 'alone', 'O1', 'high', 'You have a rich imagination, so time on your own is rarely empty.', 'Du har rik fantasi, så tid alene er sjelden tom.', 'Use one evening on something only you care about.', 'Bruk én kveld på noe bare du bryr deg om.'),
  R('energy', 'energy', 'friends', 'E2', 'high', 'Seeing friends gives you energy, which fits that you enjoy company more than most.', 'Å treffe venner gir deg energi, og det passer med at du liker selskap mer enn de fleste.', 'Make one fixed plan with friends each week.', 'Lag én fast avtale med venner hver uke.'),
  R('energy', 'energy', 'friends', 'E6', 'high', 'You laugh easily and enjoy good company, and friends probably notice it.', 'Du ler lett og setter pris på godt selskap, og det merker trolig vennene dine.', 'Invite someone who could use a lift.', 'Inviter noen som trenger en oppmuntring.'),
  R('energy', 'energy', 'close', 'E1', 'high', 'Close time gives you energy, and your warmth makes it easy to get close.', 'Nær tid gir deg energi, og varmen din gjør det lett å komme nær.', 'Plan one hour this week with no screens, just the two of you or the family.', 'Planlegg én time denne uka uten skjermer, bare dere to eller familien.'),
  R('energy', 'energy', 'close', 'A6', 'high', 'You feel strongly with people, so close time probably matters a lot to you.', 'Du føler sterkt med andre, så nær tid betyr trolig mye for deg.', 'Ask one question you have never asked before.', 'Still ett spørsmål du aldri har stilt før.'),
  R('energy', 'energy', 'new', 'O4', 'high', 'Doing something new gives you energy, which fits your taste for variety.', 'Å gjøre noe nytt gir deg energi, og det passer med sansen din for variasjon.', 'Plan one small first this week: a new route, a new recipe or a new place.', 'Planlegg én liten premiere denne uka: en ny rute, en ny oppskrift eller et nytt sted.'),
  R('energy', 'energy', 'new', 'E5', 'high', 'You like excitement, so new experiences probably give you a real boost.', 'Du liker spenning, så nye opplevelser gir deg trolig et skikkelig løft.', 'Say yes to one thing you have never tried.', 'Si ja til én ting du aldri har prøvd.'),
  R('energy', 'energy', 'done', 'C4', 'high', 'Getting things done gives you energy, which fits that you like to reach your goals.', 'Å få unna ting gir deg energi, og det passer med at du liker å nå målene dine.', 'Write down what you got done each evening for a week.', 'Skriv ned hva du fikk gjort hver kveld i en uke.'),
  R('energy', 'energy', 'done', 'C5', 'high', 'You get going without much fuss, so ticking things off gives you a good feeling.', 'Du kommer i gang uten mye styr, så å krysse av ting gir deg en god følelse.', 'Leave one task undone on purpose and notice how it feels.', 'La én oppgave stå med vilje og legg merke til hvordan det kjennes.'),
  R('energy', 'energy', 'outdoors', 'E4', 'high', 'You have a lot of energy, and being active probably helps you use it well.', 'Du har mye energi, og å være i aktivitet hjelper deg trolig å bruke den godt.', 'Put one active hour outside in the calendar each week.', 'Legg inn én aktiv time ute i kalenderen hver uke.'),
  R('energy', 'energy', 'outdoors', 'E5', 'high', 'You like excitement, so outdoor activities with a bit of challenge probably suit you.', 'Du liker spenning, så uteaktiviteter med litt utfordring passer deg trolig.', 'Pick one trip this month that is a little harder than usual.', 'Velg én tur denne måneden som er litt tøffere enn vanlig.'),
  R('energy', 'energy', 'create', 'O2', 'high', 'Making something gives you energy, which fits your interest in art and beauty.', 'Å lage noe gir deg energi, og det passer med interessen din for kunst og det vakre.', 'Give yourself one small creative task each week.', 'Gi deg selv én liten kreativ oppgave hver uke.'),
  R('energy', 'energy', 'create', 'O1', 'high', 'You have a rich imagination, so making something is a natural outlet.', 'Du har rik fantasi, så å lage noe er en naturlig måte å bruke den på.', 'Keep one list of ideas and try one each month.', 'Ha én liste med ideer og prøv én hver måned.')
];

// Next steps for the goal: facet-specific first, then general steps to fill three.
const S = (facet, dir, en, no) => ({facet, dir, text: [en, no]});
export const goalSteps = {
  calm: {facet: [
    S('N1', 'high', 'Write down what is on your mind before you go to bed.', 'Skriv ned det som surrer i hodet før du legger deg.'),
    S('N6', 'high', 'Agree in advance what can wait when the week gets busy.', 'Avtal på forhånd hva som kan vente når uka blir travel.'),
    S('E2', 'low', 'Book one evening a week alone, and keep it.', 'Sett av én kveld i uka alene, og hold på den.'),
    S('C2', 'low', 'Collect everything you need to remember in one place.', 'Samle alt du må huske på ett sted.')],
  general: [
    ['Choose one fixed quiet moment each day and keep it for four weeks.', 'Velg ett fast rolig øyeblikk hver dag og hold på det i fire uker.'],
    ['Note what gave you calm and what took it, every evening for a week.', 'Noter hva som ga deg ro og hva som tok den, hver kveld i en uke.'],
    ['Say no to one plan a week that you do not need.', 'Si nei til én avtale i uka som du ikke trenger.']]},
  closer: {facet: [
    S('A1', 'low', 'Take what someone close says at face value, once a week.', 'Ta det en nær person sier for god fisk, én gang i uka.'),
    S('E1', 'low', 'Say one thing you appreciate about someone close, every week.', 'Si én ting du setter pris på ved en nær person, hver uke.'),
    S('O3', 'low', 'Name one feeling in one word at the end of each day, and share it.', 'Sett ett ord på en følelse på slutten av hver dag, og del det.'),
    S('A6', 'high', 'Ask «do you want advice, or just someone to listen?» before you help.', 'Spør «vil du ha råd, eller bare noen som lytter?» før du hjelper.')],
  general: [
    ['Plan one hour a week with no screens, just the two of you or the family.', 'Planlegg én time i uka uten skjermer, bare dere to eller familien.'],
    ['Ask one question a week you have never asked before.', 'Still ett spørsmål i uka du aldri har stilt før.'],
    ['Do one small thing for someone close without being asked.', 'Gjør én liten ting for en nær person uten å bli spurt.']]},
  friends: {facet: [
    S('E2', 'low', 'Pick one friend and suggest something just the two of you.', 'Velg én venn og foreslå noe bare dere to.'),
    S('N4', 'high', 'Send one short message a week to someone you miss, without rewriting it.', 'Send én kort melding i uka til noen du savner, uten å skrive den om.'),
    S('E1', 'low', 'Say yes to one invitation a month you would normally skip.', 'Si ja til én invitasjon i måneden du vanligvis ville droppet.'),
    S('C3', 'low', 'Put every plan with friends in the calendar right away.', 'Legg hver avtale med venner i kalenderen med en gang.')],
  general: [
    ['Join one activity where you meet the same people each week.', 'Bli med på én aktivitet der du møter de samme folkene hver uke.'],
    ['Get back in touch with one old friend this month.', 'Ta kontakt igjen med én gammel venn denne måneden.'],
    ['Invite someone home, even for something simple.', 'Inviter noen hjem, selv til noe enkelt.']]},
  routines: {facet: [
    S('C5', 'low', 'Choose one routine and tie it to something you already do, like the morning coffee.', 'Velg én rutine og koble den til noe du allerede gjør, som morgenkaffen.'),
    S('C2', 'low', 'Give the things you lose most often one fixed place.', 'Gi tingene du oftest mister, én fast plass.'),
    S('N5', 'high', 'Make the habit you want to break a little harder to reach.', 'Gjør vanen du vil bryte litt vanskeligere å komme til.'),
    S('C4', 'high', 'Start smaller than you think you need to.', 'Start mindre enn du tror du trenger.')],
  general: [
    ['Pick one routine and keep it for four weeks before you add another.', 'Velg én rutine og hold på den i fire uker før du legger til en ny.'],
    ['Spend ten minutes on Sunday looking at the week ahead.', 'Bruk ti minutter på søndag på å se over uka som kommer.'],
    ['Mark each day you kept the routine, and look at the pattern after two weeks.', 'Kryss av hver dag du holdt rutinen, og se på mønsteret etter to uker.']]},
  fewer: {facet: [
    S('N2', 'high', 'Agree on a word that means «pause, we continue in twenty minutes».', 'Avtal et ord som betyr «pause, vi fortsetter om tjue minutter».'),
    S('A4', 'low', 'Repeat the other person’s point in your own words before you answer.', 'Gjenta den andres poeng med dine egne ord før du svarer.'),
    S('E3', 'low', 'Say small disagreements early, before they grow.', 'Si fra om små uenigheter tidlig, før de vokser.'),
    S('A1', 'low', 'Ask what the other person meant before you decide what they meant.', 'Spør hva den andre mente før du bestemmer deg for hva de mente.')],
  general: [
    ['Notice what your arguments are usually about, and write it down for two weeks.', 'Legg merke til hva dere vanligvis krangler om, og skriv det ned i to uker.'],
    ['Take hard topics when you are both rested, not late in the evening.', 'Ta vanskelige temaer når dere er uthvilte, ikke sent på kvelden.'],
    ['After an argument, say one thing you could have done differently.', 'Si én ting du kunne gjort annerledes etter en krangel.']]},
  balance: {facet: [
    S('A3', 'high', 'Say no to one request a week that someone else can take.', 'Si nei til én forespørsel i uka som noen andre kan ta.'),
    S('E2', 'high', 'Plan your time alone as carefully as your plans with others.', 'Planlegg alenetiden like nøye som avtalene med andre.'),
    S('E2', 'low', 'Make one plan with others each week, and keep the rest of the week free.', 'Lag én avtale med andre hver uke, og hold resten av uka fri.'),
    S('C4', 'high', 'Decide what «good enough» means for one thing each day, and stop there.', 'Bestem hva som er «godt nok» for én ting hver dag, og stopp der.')],
  general: [
    ['Put one thing just for you in the calendar each week.', 'Legg inn én ting bare for deg i kalenderen hver uke.'],
    ['Notice which days the balance feels right, and what made them so.', 'Legg merke til hvilke dager balansen kjennes riktig, og hva som gjorde dem slik.'],
    ['Agree with the people at home on one evening that is yours.', 'Avtal med dem du bor med at én kveld er din.']]},
  other: {facet: [],
  general: [
    ['Write your goal in one sentence and share it with someone.', 'Skriv målet ditt i én setning og del det med noen.'],
    ['Decide how you will know that you are on your way.', 'Bestem hvordan du vil merke at du er på vei.'],
    ['Choose one small step you can take this week.', 'Velg ett lite steg du kan ta denne uka.']]}
};

const pick = (pair, language) => pair[language === 'no' ? 1 : 0];
export const question = id => questions.find(q => q.id === id);
const asList = v => Array.isArray(v) ? v : v ? [v] : [];
export const cleanOther = v => typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, OTHER_MAX) : '';

/** Questions to show, given the answers so far (the children's ages only when there are children). */
export function visibleQuestions(answers = {}) {
  return questions.filter(q => !q.when || Object.entries(q.when).every(([k, v]) => asList(answers[k]).some(x => v.includes(x))));
}

/** The label for an answer; «Other» shows the reader's own text when they wrote one. */
export function optionLabel(qid, value, language, answers = null) {
  const o = question(qid)?.options.find(([v]) => v === value);
  if (!o) return '';
  const base = language === 'no' ? o[2] : o[1], text = value === 'other' ? cleanOther(answers?.other?.[qid]) : '';
  return text ? `${base}: ${text}` : base;
}

// Short headlines for the overview (one per answer). «Other» uses the reader's own text when there is one.
const topics = {
  household: {alone: ['Living alone', 'Å bo alene'], partner: ['Life with a partner', 'Livet med partner'], family: ['Family life', 'Familielivet'], single: ['Alone with children', 'Alene med barn'], shared: ['A shared home', 'Et delt hjem'], other: ['Your home', 'Hjemmet ditt']},
  kids: {small: ['Small children', 'Små barn'], school: ['School-age children', 'Skolebarn'], teens: ['Teenagers', 'Tenåringer'], adult: ['Adult children', 'Voksne barn']},
  focus: {partner: ['Your partner', 'Partneren din'], children: ['Your children', 'Barna dine'], family: ['Your family', 'Familien din'], friends: ['Your friends', 'Vennene dine'], meet: ['Meeting someone new', 'Å møte noen nye'], none: ['The people close to you', 'De nærmeste'], other: ['The people close to you', 'De nærmeste']},
  social: {quiet: ['A quiet social life', 'Et rolig sosialt liv'], few: ['A few close people', 'Noen få nære'], many: ['Plenty of people', 'Mange folk'], toomuch: ['Too much socialising', 'For mye sosialt'], other: ['Your social life', 'Det sosiale livet']},
  conflict: {heated: ['Heated disagreements', 'Opphetede uenigheter'], calm: ['Calm disagreements', 'Rolige uenigheter'], keep: ['Keeping it to yourself', 'Å holde det for seg selv'], givein: ['Giving in', 'Å gi seg'], rarely: ['Rarely disagreeing', 'Sjelden uenige'], other: ['When you disagree', 'Når dere er uenige']},
  week: {room: ['Plenty of room', 'God plass'], full: ['A full week', 'En full uke'], packed: ['A packed week', 'En stappfull uke'], uneven: ['An uneven week', 'En ujevn uke'], other: ['Your week', 'Uka di']},
  drains: {chores: ['Chores', 'Husarbeid'], metime: ['Too little time to yourself', 'For lite egentid'], alone: ['Too much time alone', 'For mye alenetid'], tension: ['Tension at home', 'Spenning hjemme'], reachable: ['Always reachable', 'Alltid tilgjengelig'], plans: ['Changing plans', 'Planer som endres'], rest: ['Too little rest', 'For lite hvile'], other: ['What drains you', 'Det som tapper deg']},
  energy: {alone: ['Time on your own', 'Tid alene'], friends: ['Friends', 'Venner'], close: ['Close time', 'Nær tid'], new: ['Something new', 'Noe nytt'], done: ['Getting things done', 'Å få unna ting'], outdoors: ['Being active', 'Å være i aktivitet'], create: ['Making something', 'Å lage noe'], other: ['What gives you energy', 'Det som gir deg energi']},
  goal: {calm: ['More calm', 'Mer ro'], closer: ['Closeness', 'Nærhet'], friends: ['Friendships', 'Vennskap'], routines: ['Routines', 'Rutiner'], fewer: ['Fewer arguments', 'Færre krangler'], balance: ['Balance', 'Balanse'], other: ['Your goal', 'Målet ditt']}
};
export function answerTopic(qid, value, language, answers = null) {
  const own = value === 'other' ? cleanOther(answers?.other?.[qid]) : '';
  if (own) return own.charAt(0).toUpperCase() + own.slice(1);
  const t = topics[qid]?.[value];
  return t ? pick(t, language) : optionLabel(qid, value, language, answers);
}

/** True when every visible question has a valid answer (multi questions need 1–max choices). */
export function isComplete(answers = {}) {
  return visibleQuestions(answers).every(q => {
    const values = asList(answers[q.id]), ok = values.every(v => q.options.some(([o]) => o === v));
    return ok && values.length >= 1 && values.length <= (q.multi || 1);
  });
}

function facetIndex(domains) {
  const map = {};
  for (const d of domains || []) for (const f of d.facets || []) map[f.code] = f;
  return map;
}
const fact = f => ({code: f.code, name: f.name, percentile: Number.isFinite(f.percentile) ? f.percentile : null, band: f.band});

/**
 * Picks what the chapter says. Returns {sections:[{id, items:[{ruleId, text, try, facets, answers}]}]}.
 * Only facets outside the middle range are used, and only in the direction a rule names. Answers to the
 * children question are ignored when it is not shown.
 */
export function buildLife(domains, answers, language = 'en') {
  if (!isComplete(answers)) return null;
  const facets = facetIndex(domains), shown = new Set(visibleQuestions(answers).map(q => q.id));
  const out = Object.fromEntries(SECTIONS.map(id => [id, []])), used = Object.fromEntries(SECTIONS.map(id => [id, new Set()]));
  const answered = {};
  for (const q of questions) answered[q.id] = shown.has(q.id) ? asList(answers[q.id]) : [];
  const candidates = {drain: {}, energy: {}};
  const item = (r, f, hit) => ({ruleId: `life-${r.section}-${r.q}-${hit}-${r.facet}-${r.dir}`, text: pick(r.text, language), try: pick(r.try, language), facets: [fact(f)], answers: [{q: r.q, value: hit, label: optionLabel(r.q, hit, language, answers)}]});
  // The relationship sections pick first, so they get the facets that matter most for closeness and
  // disagreement. Across those four sections a facet is explained once, so the reader is not told the
  // same thing three times; drains and energy may come back to it, since they answer a different question.
  const told = new Set(), story = new Set(['close', 'conflict', 'hard', 'good']);
  for (const r of PRIORITY.flatMap(id => rules.filter(x => x.section === id))) {
    const f = facets[r.facet];
    if (!f || f.band !== r.dir || used[r.section].has(r.facet)) continue;
    if (story.has(r.section) && told.has(r.facet)) continue;
    const hit = r.v.find(v => answered[r.q].includes(v));
    if (!hit) continue;
    // Drains and energy can have two answers: collect per answer and share the room fairly below.
    if (candidates[r.section]) { (candidates[r.section][hit] ||= []).push({r, f, hit}); continue; }
    if (out[r.section].length >= LIMIT[r.section]) continue;
    used[r.section].add(r.facet);
    if (story.has(r.section)) told.add(r.facet);
    out[r.section].push(item(r, f, hit));
  }
  for (const [section, qid] of [['drain', 'drains'], ['energy', 'energy']]) {
    const queues = answered[qid].map(v => [...(candidates[section][v] || [])]);
    while (out[section].length < LIMIT[section] && queues.some(q => q.length)) {
      for (const queue of queues) {
        while (queue.length && used[section].has(queue[0].r.facet)) queue.shift();
        const next = queue.shift();
        if (next && out[section].length < LIMIT[section]) { used[section].add(next.r.facet); out[section].push(item(next.r, next.f, next.hit)); }
      }
    }
    // An answer no facet explains still gets a line: it is probably more about the situation than about personality.
    for (const value of answered[qid]) {
      if (value === 'other' || out[section].some(x => x.answers.some(a => a.value === value)) || candidates[section][value]?.length) continue;
      const label = optionLabel(qid, value, language);
      const text = section === 'drain'
        ? pick([`“${label}” drains you, but none of the facets linked to it sits clearly high or low. It may be more about the situation than about your personality, which also means it can be easier to change.`, `«${label}» tapper deg, men ingen av fasettene som henger sammen med det, ligger tydelig høyt eller lavt. Det kan handle mer om situasjonen enn om personligheten din, og det betyr også at det kan være lettere å endre.`], language)
        : pick([`“${label}” gives you energy, even though no linked facet sits clearly high or low. It is worth noticing when it happens, and making room for more of it.`, `«${label}» gir deg energi, selv om ingen av fasettene som henger sammen med det, ligger tydelig høyt eller lavt. Det er verdt å legge merke til når det skjer, og å gi plass til mer av det.`], language);
      out[section].push({ruleId: `life-${section}-${qid}-${value}-situation`, text, try: '', facets: [], answers: [{q: qid, value, label}]});
    }
  }
  const goal = answered.goal[0], plan = goalSteps[goal], goalAnswer = {q: 'goal', value: goal, label: optionLabel('goal', goal, language, answers)};
  for (const s of plan.facet) {
    const f = facets[s.facet];
    if (out.next.length < LIMIT.next && f && f.band === s.dir) out.next.push({ruleId: `life-next-${goal}-${s.facet}-${s.dir}`, text: pick(s.text, language), try: '', facets: [fact(f)], answers: [goalAnswer]});
  }
  plan.general.forEach((pair, i) => {
    const text = pick(pair, language);
    if (out.next.length < LIMIT.next && !out.next.some(x => x.text === text)) out.next.push({ruleId: `life-next-${goal}-general-${i + 1}`, text, try: '', facets: [], answers: [goalAnswer]});
  });
  return {version: LIFE_VERSION, goal, sections: SECTIONS.map(id => ({id, items: out[id]}))};
}

/** The compact input the server needs to write the text: picked facts only, no names. */
export function lifeRequest(life, domains, answers, language) {
  return {
    chapter: 'life',
    version: LIFE_VERSION,
    language: language === 'no' ? 'no' : 'en',
    traits: (domains || []).map(d => ({code: d.code, percentile: Number.isFinite(d.percentile) ? d.percentile : null, band: d.band})),
    answers: visibleQuestions(answers).map(q => ({q: q.id, question: pick(q.q, language), values: asList(answers[q.id]), labels: asList(answers[q.id]).map(v => optionLabel(q.id, v, language, answers))})),
    sections: life.sections.map(s => ({id: s.id, items: s.items.map(x => ({ruleId: x.ruleId, draft: x.text, try: x.try, facets: x.facets, answers: x.answers.map(a => a.q)}))}))
  };
}
