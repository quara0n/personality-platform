// «Din jobb, din profil»: the deeper work module in the 149 kr / $14.99 tier (prototype, 2026-10-15).
// The reader answers eight questions about their work. Fixed rules then pick what the report says:
// each rule names one answer and one facet, and fires only when that facet sits outside the middle
// range in the named direction. The rule text is a complete, pre-written fallback. When AI writing is
// switched on, the same picked facts are sent to the server, which may only rephrase and combine them
// (see lib/career-llm.js). Every item keeps its rule id, facet codes and answer ids, so each claim can
// be traced back to a score and an answer. Pairs are [English, Norwegian bokmål].

export const CAREER_VERSION = 'career-v1-prototype';

export const questions = [
  {id: 'role', q: ['What kind of work is closest to your day?', 'Hva slags arbeid ligner mest på dagen din?'], options: [
    ['knowledge', 'Office or knowledge work', 'Kontor- eller kunnskapsarbeid'],
    ['care', 'Care, health or teaching', 'Omsorg, helse eller undervisning'],
    ['service', 'Sales, service or customers', 'Salg, service eller kunder'],
    ['practical', 'Practical, technical or a trade', 'Praktisk, teknisk eller håndverk'],
    ['creative', 'Creative work', 'Kreativt arbeid'],
    ['own', 'Self-employed or my own business', 'Selvstendig eller egen bedrift'],
    ['student', 'Studying', 'Studerer'],
    ['none', 'Not working right now', 'Ikke i jobb nå'],
    ['other', 'Something else (write your job)', 'Noe annet (skriv yrket ditt)']]},
  {id: 'lead', q: ['Are you responsible for other people?', 'Har du ansvar for andre?'], options: [
    ['no', 'No', 'Nei'],
    ['informal', 'Informally (a project or a subject area)', 'Uformelt (prosjekt eller fagansvar)'],
    ['small', 'I lead 1–5 people', 'Leder 1–5 personer'],
    ['large', 'I lead more than 5 people', 'Leder flere enn 5'],
    ['owner', 'I run a business with employees', 'Driver egen bedrift med ansatte'],
    ['other', 'Other', 'Annet']]},
  {id: 'with', q: ['How do you work with other people?', 'Hvordan jobber du sammen med andre?'], options: [
    ['alone', 'Mostly on my own', 'Mest alene'],
    ['team', 'In a fixed team', 'I et fast team'],
    ['many', 'With many different people', 'Med mange ulike mennesker'],
    ['clients', 'With clients or patients most of the day', 'Med kunder, klienter eller pasienter det meste av dagen'],
    ['remote', 'Mostly digitally or at a distance', 'Mest digitalt eller på avstand'],
    ['other', 'Other', 'Annet']]},
  {id: 'structure', q: ['How fixed is your work?', 'Hvor fast er arbeidet ditt?'], options: [
    ['fixed', 'Fixed routines', 'Faste rutiner'],
    ['mixed', 'Some of both', 'Litt av begge'],
    ['shifting', 'It changes a lot', 'Det endrer seg mye'],
    ['projects', 'Project by project', 'Prosjekt for prosjekt'],
    ['other', 'Other', 'Annet']]},
  {id: 'pressure', q: ['How much pressure and how many deadlines?', 'Hvor mye press og hvor mange frister er det?'], options: [
    ['calm', 'Calm and predictable', 'Rolig og forutsigbart'],
    ['peaks', 'Busy periods now and then', 'Travle perioder innimellom'],
    ['high', 'Often high pressure', 'Ofte høyt press'],
    ['uneven', 'Hard to predict', 'Vanskelig å forutsi'],
    ['other', 'Other', 'Annet']]},
  {id: 'drains', multi: 2, q: ['What drains you most at work?', 'Hva tapper deg mest på jobb?'], options: [
    ['meetings', 'Many meetings and a lot of talk', 'Mange møter og mye prat'],
    ['unclear', 'Unclear expectations', 'Uklare forventninger'],
    ['conflict', 'Conflict and discontent', 'Konflikter og misnøye'],
    ['routine', 'Repetitive tasks', 'Ensformige oppgaver'],
    ['overload', 'Too much at once', 'For mye på en gang'],
    ['judged', 'Being assessed or criticised', 'Å bli vurdert eller kritisert'],
    ['alone', 'Too much time alone', 'For mye alenetid'],
    ['noinfluence', 'Little say over my own day', 'Lite å si over egen arbeidsdag'],
    ['other', 'Other', 'Annet']]},
  {id: 'energy', multi: 2, q: ['What gives you the most energy?', 'Hva gir deg mest energi?'], options: [
    ['problems', 'Solving hard problems', 'Å løse vanskelige problemer'],
    ['help', 'Helping someone', 'Å hjelpe noen'],
    ['finish', 'Getting things done', 'Å få ting ferdig'],
    ['learn', 'Learning something new', 'Å lære noe nytt'],
    ['people', 'Being with people', 'Å være sammen med folk'],
    ['create', 'Making something of my own', 'Å lage noe eget'],
    ['recognition', 'Recognition for what I do', 'Å få anerkjennelse for det jeg gjør'],
    ['variety', 'Variety and new places', 'Variasjon og nye steder'],
    ['other', 'Other', 'Annet']]},
  {id: 'goal', q: ['What would you most like to achieve in the next year?', 'Hva vil du helst få til det neste året?'], options: [
    ['thrive', 'Enjoy the job I have more', 'Trives bedre der jeg er'],
    ['more', 'Take on more responsibility or lead', 'Få mer ansvar eller lede'],
    ['change', 'Change direction', 'Bytte retning'],
    ['calm', 'Less stress', 'Mindre stress'],
    ['people', 'Work better with others', 'Samarbeide bedre med andre'],
    ['balance', 'Better balance between work and free time', 'Bedre balanse mellom jobb og fritid'],
    ['skills', 'Get better at my craft', 'Bli flinkere faglig'],
    ['other', 'Other', 'Annet']]}
];

// «Other» opens a short text field. The text is the reader's own words: it is shown back to them and,
// when AI writing is used, sent along as context (capped at OTHER_MAX characters). No rule fires on it.
export const OTHER_MAX = 80;

const LIMIT = {good: 3, hard: 3, drain: 3, energy: 2, lead: 3, next: 3, lookfor: 5};

// R(section, question, values, facet, direction, text EN, text NO, try EN, try NO)
const R = (section, q, v, facet, dir, en, no, tryEn = '', tryNo = '') => ({section, q, v: [].concat(v), facet, dir, text: [en, no], try: [tryEn, tryNo]});

// Order matters: within a section the first rule that names a facet wins.
export const rules = [
  // ── How you and the job fit ─────────────────────────────────────────────
  R('good', 'with', 'clients', 'A3', 'high', 'You spend much of the day with clients or patients, and Altruism is high. Helping people is probably part of what makes the work meaningful to you.', 'Du er mye sammen med kunder, klienter eller pasienter, og Altruisme er høy. Å hjelpe folk er trolig noe av det som gjør jobben meningsfull for deg.', 'At the end of a working day, note which meeting gave you the most, and why.', 'På slutten av en arbeidsdag: skriv ned hvilket møte som ga deg mest, og hvorfor.'),
  R('good', 'with', 'clients', 'E1', 'high', 'Friendliness is higher than in most people. Clients and patients probably feel at ease with you quickly, which makes trust easier to build.', 'Vennlighet er høyere enn hos de fleste. Kunder og pasienter blir trolig fort trygge på deg, og det gjør det lettere å bygge tillit.', 'Use the first minute of a new meeting on the person, not the problem.', 'Bruk det første minuttet i et nytt møte på personen, ikke på problemet.'),
  R('good', 'with', 'clients', 'N4', 'low', 'Self-Consciousness is low, so you are probably at ease with new people, also when something goes wrong.', 'Sosial selvbevissthet er lav, så du er trolig trygg i møte med nye mennesker, også når noe går galt.', 'Use that ease to take difficult conversations early.', 'Bruk tryggheten til å ta de vanskelige samtalene tidlig.'),
  R('hard', 'with', 'clients', 'E2', 'low', 'You are with clients most of the day, while Gregariousness is low. Many meetings in a row can drain you more than you show.', 'Du er sammen med kunder det meste av dagen, mens Selskapelighet er lav. Mange møter etter hverandre kan tappe deg mer enn du viser.', 'Put five minutes without people between the busiest meetings.', 'Legg inn fem minutter uten folk mellom de travleste møtene.'),
  R('hard', 'with', 'clients', 'A1', 'low', 'Trust is low, which can make you read clients more critically than they deserve.', 'Tillit er lav, og det kan gjøre at du vurderer kunder mer kritisk enn de fortjener.', 'Before you judge, ask one more question about what the person actually needs.', 'Før du dømmer: still ett spørsmål til om hva personen faktisk trenger.'),
  R('hard', 'with', 'alone', 'E2', 'high', 'You mostly work on your own, while Gregariousness is high. You may miss having people around more than you notice.', 'Du jobber mest alene, mens Selskapelighet er høy. Du kan savne folk rundt deg mer enn du merker.', 'Add one fixed meeting point with others each week, such as lunch or a work chat.', 'Legg inn ett fast møtepunkt med andre i uka, for eksempel lunsj eller en faglig prat.'),
  R('good', 'with', 'alone', 'E2', 'low', 'You mostly work on your own, and Gregariousness is low. The setup probably gives you peace to work without spending energy on many people.', 'Du jobber mest alene, og Selskapelighet er lav. Arbeidsformen gir deg trolig ro til å jobbe uten å bruke energi på mange mennesker.', 'Protect long, uninterrupted blocks in your calendar.', 'Beskytt de lange, uforstyrrede øktene i kalenderen.'),
  R('good', 'with', 'team', 'A4', 'high', 'In a fixed team it is a strength that you rarely create unnecessary conflict; Cooperation is high.', 'I et fast team er det en styrke at du sjelden lager unødige konflikter; Samarbeidsvilje er høy.', 'Still say it once when you disagree, with a reason.', 'Si likevel ifra én gang når du er uenig, gjerne med en begrunnelse.'),
  R('hard', 'with', 'team', 'A4', 'low', 'In a fixed team, low Cooperation can make disagreements sharper than you intend.', 'I et fast team kan lav Samarbeidsvilje gjøre at uenigheter blir skarpere enn du vil.', 'Start with what you agree with before saying what you would do differently.', 'Start med det du er enig i før du sier hva du ville gjort annerledes.'),
  R('hard', 'with', 'team', 'E2', 'low', 'You work in a fixed team, but Gregariousness is low. Many shared meetings can drain you earlier in the day than the others.', 'Du jobber i et fast team, men Selskapelighet er lav. Mange felles møter kan tappe deg tidligere på dagen enn de andre.', 'Agree on one meeting-free time slot each day.', 'Avtal ett tidsrom om dagen uten møter.'),
  R('good', 'with', 'many', 'E1', 'high', 'You work with many different people, and Friendliness is high. You probably connect quickly with new people.', 'Du jobber med mange ulike mennesker, og Vennlighet er høy. Du blir trolig fort kjent med nye folk.', 'Reach out to one new person each week who could matter for your work.', 'Ta kontakt med én ny person i uka som kan bli viktig for arbeidet ditt.'),
  R('hard', 'with', 'many', 'N4', 'high', 'With many new people, high Self-Consciousness can make you spend a lot of energy on how you come across.', 'Med mange nye mennesker kan høy Sosial selvbevissthet gjøre at du bruker mye energi på hvordan du fremstår.', 'Prepare one opening sentence before meeting new people.', 'Forbered én åpningssetning før du møter nye folk.'),
  R('good', 'role', 'care', 'O5', 'high', 'Intellect is high, so you probably want to understand more of your field than the job strictly requires. That is a strength in health and teaching, where knowledge keeps changing.', 'Intellekt er høy, så du vil trolig forstå mer av faget enn jobben krever. Det er en styrke i helse og undervisning, der kunnskapen stadig endrer seg.', 'Pick one question from your practice this month and read up on it properly.', 'Velg ett spørsmål fra praksisen din denne måneden og les deg skikkelig opp på det.'),
  R('good', 'role', 'care', 'O3', 'high', 'Emotionality is high, so you probably notice what happens in yourself when you meet others, and can use it in your work.', 'Følelsesbevissthet er høy, så du merker trolig hva som skjer i deg selv i møte med andre, og kan bruke det i arbeidet.', 'After a demanding meeting, name to yourself what you felt, in one word.', 'Etter et krevende møte: sett ett ord på hva du kjente.'),
  R('hard', 'role', 'care', 'A6', 'high', 'In caring work, high Sympathy can make you carry other people’s problems after work.', 'I omsorgsarbeid kan høy Medfølelse gjøre at du bærer med deg andres problemer etter arbeidstid.', 'Make a fixed transition between work and free time, such as a short walk before you go home.', 'Lag en fast overgang mellom jobb og fritid, for eksempel en kort tur før du går inn døra.'),
  R('hard', 'pressure', 'uneven', 'C6', 'high', 'When work is hard to predict, high Cautiousness can make it stressful not to be able to plan ahead.', 'Når arbeidet er vanskelig å forutsi, kan høy Varsomhet gjøre det stressende at du ikke kan planlegge.', 'Plan what you can control, and keep one buffer slot free each day.', 'Planlegg det du kan styre, og sett av litt ledig tid hver dag.'),
  R('good', 'with', 'remote', 'E2', 'low', 'You mostly work digitally or at a distance, and Gregariousness is low. That probably gives you peace to concentrate.', 'Du jobber mest digitalt eller på avstand, og Selskapelighet er lav. Det gir deg trolig ro til å konsentrere deg.', 'Agree on fixed times when others can reach you, so the rest stays undisturbed.', 'Avtal faste tider der andre kan nå deg, så resten får være uforstyrret.'),
  R('hard', 'with', 'remote', 'E2', 'high', 'You mostly work digitally or at a distance, while Gregariousness is high. You may miss people more than you notice.', 'Du jobber mest digitalt eller på avstand, mens Selskapelighet er høy. Du kan savne folk mer enn du merker.', 'Meet someone from work in person at least once a week.', 'Møt noen fra jobben ansikt til ansikt minst én gang i uka.'),
  R('good', 'role', 'own', 'O4', 'high', 'Running your own work and high Adventurousness probably fit well: you shape your own days.', 'Egen virksomhet og høy Eventyrlyst passer trolig godt: du former dagene dine selv.', 'Set aside time each month to try one new idea in the business.', 'Sett av tid hver måned til å teste én ny idé i virksomheten.'),
  R('hard', 'role', 'own', 'C5', 'low', 'With your own business there is no one to set deadlines for you, and Self-Discipline is low.', 'Med egen virksomhet er det ingen som setter frister for deg, og Selvdisiplin er lav.', 'Give yourself weekly deadlines and tell someone about them.', 'Gi deg selv ukentlige frister og fortell noen om dem.'),
  R('good', 'role', 'knowledge', 'O5', 'high', 'Knowledge work and high Intellect probably fit well together.', 'Kunnskapsarbeid og høy Intellekt passer trolig godt sammen.', 'Ask for the problem nobody has solved yet.', 'Be om det problemet ingen har løst ennå.'),
  R('good', 'role', 'creative', 'O1', 'high', 'Creative work and high Imagination probably fit well together.', 'Kreativt arbeid og høy Fantasi passer trolig godt sammen.', 'Keep one list of ideas and test one each month.', 'Ha én liste med ideer og test én hver måned.'),
  R('good', 'role', 'practical', 'C2', 'high', 'Practical work and high Orderliness probably fit well: you like things to be done properly.', 'Praktisk arbeid og høy Orden passer trolig godt: du liker at ting gjøres skikkelig.', 'Suggest one improvement to a routine that others will also benefit from.', 'Foreslå én forbedring av en rutine som andre også har nytte av.'),
  R('good', 'role', 'service', 'E1', 'high', 'Customer work and high Friendliness probably fit well together.', 'Kundearbeid og høy Vennlighet passer trolig godt sammen.', 'Notice which customers you are best with, and why.', 'Legg merke til hvilke kunder du er best med, og hvorfor.'),
  R('hard', 'role', 'student', 'C5', 'low', 'Studying gives a lot of freedom, and Self-Discipline is low. Work can easily be pushed until the deadline.', 'Studier gir mye frihet, og Selvdisiplin er lav. Arbeidet blir lett utsatt til rett før fristen.', 'Split each assignment into small parts with their own deadlines.', 'Del hver oppgave i små biter med egne frister.'),
  R('good', 'structure', 'fixed', 'C2', 'high', 'Fixed routines probably suit high Orderliness well.', 'Faste rutiner passer trolig godt med høy Orden.', 'Suggest one improvement to a routine that others will also benefit from.', 'Foreslå én forbedring av en rutine som andre også har nytte av.'),
  R('hard', 'structure', 'fixed', 'O4', 'high', 'Fixed routines and high Adventurousness can make weeks feel too alike.', 'Faste rutiner og høy Eventyrlyst kan gjøre at ukene kjennes for like.', 'Give yourself one small project that is new to you, alongside the fixed work.', 'Gi deg selv ett lite prosjekt som er nytt for deg, ved siden av det faste.'),
  R('hard', 'structure', 'fixed', 'C2', 'low', 'The work has fixed routines, while Orderliness is low. Routines can feel like a constraint, and small things may slip.', 'Arbeidet har faste rutiner, mens Orden er lav. Rutinene kan kjennes som tvang, og småting kan glippe.', 'Make one checklist for what slips most often, and let it do the work.', 'Lag én sjekkliste for det som oftest glipper, og la den gjøre jobben for deg.'),
  R('good', 'structure', 'fixed', 'O4', 'low', 'Adventurousness is low, so fixed frames probably feel safe rather than boring.', 'Eventyrlyst er lav, så faste rammer gir trolig trygghet heller enn kjedsomhet.', 'Become the person who knows the routines best.', 'Bli den som kan rutinene best.'),
  R('good', 'structure', ['mixed', 'projects'], 'O4', 'high', 'The work mixes fixed and new tasks, and high Adventurousness means you probably enjoy the variety.', 'Arbeidet blander faste og nye oppgaver, og høy Eventyrlyst gjør at du trolig setter pris på variasjonen.', 'Say yes to new tasks, but choose them on purpose.', 'Si ja til nye oppgaver, men velg dem bevisst.'),
  R('hard', 'structure', ['mixed', 'projects'], 'C2', 'low', 'With both fixed and changing tasks, low Orderliness can make the fixed ones pile up.', 'Med både faste og skiftende oppgaver kan lav Orden gjøre at det faste blir liggende.', 'Do the fixed tasks at the same time every week.', 'Gjør de faste oppgavene på samme tid hver uke.'),
  R('good', 'structure', 'shifting', 'O4', 'high', 'The work changes a lot, and Adventurousness is high. The variety probably gives you energy.', 'Arbeidet endrer seg mye, og Eventyrlyst er høy. Variasjonen gir deg trolig energi.', 'Keep a short list of what you learned each month.', 'Før en kort liste over hva du lærte hver måned.'),
  R('good', 'structure', 'shifting', 'O5', 'high', 'New, unsolved problems probably suit high Intellect well.', 'Nye, uløste problemer passer trolig godt med høy Intellekt.', 'Ask for the hardest case once a month.', 'Be om den vanskeligste saken én gang i måneden.'),
  R('hard', 'structure', 'shifting', 'C2', 'high', 'When the work changes a lot, high Orderliness can make it stressful that plans keep being redone.', 'Når arbeidet endrer seg mye, kan høy Orden gjøre det stressende at planene stadig må lages på nytt.', 'Plan in short pieces, one week at a time.', 'Lag planer i korte biter, én uke av gangen.'),
  R('hard', 'structure', 'shifting', 'C6', 'high', 'With much change, high Cautiousness can make it hard to think things through before you have to decide.', 'Med mye endring kan høy Varsomhet gjøre det krevende å tenke grundig før du må bestemme deg.', 'Agree which decisions can be made quickly and which deserve a day.', 'Avtal hvilke beslutninger som kan tas raskt og hvilke som trenger en dags betenkningstid.'),
  R('hard', 'pressure', 'high', 'N6', 'high', 'You often work under high pressure, and Vulnerability is high. A lot at once probably feels heavier for you than for others, without you doing the job worse.', 'Du jobber ofte under høyt press, og Sårbarhet er høy. Mye på en gang kjennes trolig tyngre for deg enn for andre, uten at du gjør jobben dårligere.', 'Agree in advance what can wait when it gets busy.', 'Avtal på forhånd hva som kan vente når det blir travelt.'),
  R('good', 'pressure', 'high', 'N6', 'low', 'You often work under high pressure, and Vulnerability is low. You probably keep a cool head when a lot happens at once.', 'Du jobber ofte under høyt press, og Sårbarhet er lav. Du holder trolig hodet kaldt når mye skjer samtidig.', 'Notice who around you finds busy periods harder.', 'Legg merke til hvem rundt deg som har det tyngre i travle perioder.'),
  R('hard', 'pressure', 'high', 'N1', 'high', 'High pressure and high Anxiety can make you take work home in your head.', 'Høyt press og høy Angst kan gjøre at du tar med deg jobben hjem i tankene.', 'Write down what is on your mind before you leave, and decide when to pick it up again.', 'Skriv ned det som surrer i hodet før du går hjem, og bestem når du skal ta det opp igjen.'),
  R('good', 'pressure', 'high', 'C4', 'high', 'Achievement-Striving is high, so deadlines probably drive you forward rather than stop you.', 'Prestasjonsstreben er høy, så frister driver deg trolig fremover heller enn å stoppe deg.', 'Set your own finish line a day before the real one.', 'Sett din egen frist en dag før den egentlige.'),
  R('good', 'pressure', ['peaks', 'uneven'], 'N6', 'low', 'Vulnerability is low, so you probably keep calm in busy periods and rarely feel overwhelmed.', 'Sårbarhet er lav, så du holder trolig roen i travle perioder og blir sjelden overveldet.', 'Use the quiet periods to prepare for the next busy one.', 'Bruk de rolige periodene til å forberede deg på den neste travle.'),
  R('hard', 'pressure', ['peaks', 'uneven'], 'N6', 'high', 'Busy periods can feel heavier for you than for others; Vulnerability is high.', 'Travle perioder kan kjennes tyngre for deg enn for andre; Sårbarhet er høy.', 'Plan a quieter day right after the busiest periods.', 'Planlegg en roligere dag rett etter de travleste periodene.'),
  R('hard', 'pressure', 'peaks', 'C5', 'low', 'Between busy periods, low Self-Discipline can make tasks wait until the pressure comes.', 'Mellom travle perioder kan lav Selvdisiplin gjøre at oppgaver venter til presset kommer.', 'Split large tasks into small pieces with their own deadlines.', 'Del store oppgaver i små biter med egne frister.'),
  R('hard', 'pressure', 'calm', 'E5', 'high', 'Calm work and high Excitement-Seeking can give too little pulse in the day.', 'Rolig arbeid og høy Spenningssøking kan gi for lite puls i hverdagen.', 'Seek out one task with a clear deadline or challenge.', 'Søk deg til én oppgave med en tydelig frist eller utfordring.'),
  R('good', 'pressure', 'calm', 'N6', 'high', 'Calm, predictable work probably suits high Vulnerability well.', 'Rolig og forutsigbart arbeid passer trolig godt når Sårbarhet er høy.', 'Notice what keeps it calm, so you can ask for it if the job changes.', 'Legg merke til hva som holder det rolig, så du kan be om det hvis jobben endrer seg.'),

  // ── What drains you ─────────────────────────────────────────────────────
  R('drain', 'drains', 'meetings', 'E2', 'low', 'Many meetings drain you, which fits low Gregariousness. It is not that you dislike people; you recharge on your own.', 'Mange møter tapper deg, og det passer med lav Selskapelighet. Det er ikke at du ikke liker folk, men at du lader opp alene.', 'Decline one meeting a week where you are not needed.', 'Si nei til ett møte i uka der du ikke trengs.'),
  R('drain', 'drains', 'meetings', 'O5', 'high', 'With high Intellect, talk without substance can feel like time taken from real work.', 'Med høy Intellekt kan prat uten innhold kjennes som tid tatt fra det egentlige arbeidet.', 'Ask for an agenda, or suggest a shorter meeting.', 'Be om en dagsorden, eller foreslå et kortere møte.'),
  R('drain', 'drains', 'unclear', 'C4', 'high', 'With high Achievement-Striving you want to know what “done” means, so unclear expectations hit harder.', 'Med høy Prestasjonsstreben vil du vite hva «ferdig» betyr, så uklare forventninger treffer hardere.', 'Ask for one measurable goal per quarter.', 'Be om ett målbart mål per kvartal.'),
  R('drain', 'drains', 'unclear', 'C2', 'high', 'Unclear expectations are extra demanding when Orderliness is high: you want to know how things should be.', 'Uklare forventninger er ekstra krevende når Orden er høy: du vil vite hvordan ting skal være.', 'Ask for one concrete example of what “good enough” looks like.', 'Be om ett konkret eksempel på hva som er «bra nok».'),
  R('drain', 'drains', 'unclear', 'N1', 'high', 'High Anxiety can turn unclear expectations into a lot of worry.', 'Høy Angst kan gjøre uklare forventninger til mye bekymring.', 'Write down your best guess at what is expected, and check it with someone.', 'Skriv ned hva du tror er forventet, og sjekk det med noen.'),
  R('drain', 'drains', 'conflict', 'A4', 'high', 'Conflict drains more when Cooperation is high: you would rather people agree.', 'Konflikter tapper mer når Samarbeidsvilje er høy: du vil helst at folk skal være enige.', 'Practise saying “I see it differently” without apologising.', 'Øv på å si «jeg ser det annerledes» uten å be om unnskyldning.'),
  R('drain', 'drains', 'conflict', 'A6', 'high', 'High Sympathy means you feel what others feel in a conflict, and carry more afterwards.', 'Høy Medfølelse gjør at du kjenner det andre føler i en konflikt, og bærer mer etterpå.', 'After a hard conversation, do something that has nothing to do with work.', 'Gjør noe som ikke har med jobb å gjøre etter en vanskelig samtale.'),
  R('drain', 'drains', 'conflict', 'E3', 'low', 'Assertiveness is low, so in conflicts you probably speak up less than you would like.', 'Selvhevdelse er lav, så i konflikter sier du trolig ifra sjeldnere enn du vil.', 'Write down the one thing you want to say before the meeting.', 'Skriv ned den ene tingen du vil si før møtet.'),
  R('drain', 'drains', 'conflict', 'N2', 'high', 'Anger is high, so conflict can wind you up quickly and take time to settle.', 'Sinne er høy, så konflikter kan fort få deg opp i harnisk, og det kan ta tid å legge dem fra seg.', 'Wait one night before you answer an angry message.', 'Vent én natt før du svarer på en sint melding.'),
  R('drain', 'drains', 'routine', 'O4', 'high', 'Repetitive tasks drain you, which fits high Adventurousness: you need something new to keep your spark.', 'Ensformige oppgaver tapper deg, og det passer med høy Eventyrlyst: du trenger noe nytt for å holde gløden.', 'Do the repetitive tasks in one block, and reward yourself with something new afterwards.', 'Gjør de ensformige oppgavene i én samlet bolk, og belønn deg med noe nytt etterpå.'),
  R('drain', 'drains', 'routine', 'C2', 'low', 'Low Orderliness means repetitive tasks take more willpower for you than for others.', 'Lav Orden gjør at ensformige oppgaver krever mer viljestyrke av deg enn av andre.', 'Make a template for the task you repeat most often.', 'Lag en mal for oppgaven du gjentar oftest.'),
  R('drain', 'drains', 'routine', 'E5', 'high', 'High Excitement-Seeking makes repetitive days feel long.', 'Høy Spenningssøking gjør at ensformige dager kjennes lange.', 'Put something with a bit of pulse at the end of a routine day.', 'Legg noe med litt puls på slutten av en rutinedag.'),
  R('drain', 'drains', 'overload', 'N6', 'high', 'Too much at once hits harder when Vulnerability is high.', 'For mye på en gang treffer hardere når Sårbarhet er høy.', 'Agree in advance what can wait when it gets busy.', 'Avtal på forhånd hva som kan vente når det blir travelt.'),
  R('drain', 'drains', 'overload', 'C2', 'low', 'Low Orderliness makes many balls in the air harder to keep track of.', 'Lav Orden gjør at det lettere blir uoversiktlig med mange baller i lufta.', 'Write every task down in one place before you start any of them.', 'Skriv alle oppgavene ned på ett sted før du begynner på noen av dem.'),
  R('drain', 'drains', 'overload', 'N1', 'high', 'High Anxiety can make a long list feel like a threat rather than a plan.', 'Høy Angst kan gjøre at en lang liste kjennes som en trussel heller enn en plan.', 'Pick the three tasks that matter most today, and hide the rest.', 'Velg de tre viktigste oppgavene i dag, og skjul resten.'),
  R('drain', 'drains', 'judged', 'N4', 'high', 'Self-Consciousness is high, so being assessed probably feels stronger than it is meant.', 'Sosial selvbevissthet er høy, så det å bli vurdert kjennes trolig sterkere enn det er ment.', 'Ask what the person giving feedback actually wants you to do differently.', 'Spør hva den som gir tilbakemelding, faktisk vil at du skal gjøre annerledes.'),
  R('drain', 'drains', 'judged', 'C1', 'low', 'Self-Efficacy is low, so criticism can make you doubt yourself more than it should.', 'Mestringstro er lav, så kritikk kan få deg til å tvile mer på deg selv enn den burde.', 'Write down one thing you got done every Friday. Evidence beats feelings.', 'Skriv ned én ting du fikk til hver fredag. Bevis slår følelser.'),
  R('drain', 'drains', 'judged', 'N3', 'high', 'Depression is high, so criticism can linger and colour the rest of the day.', 'Depresjon er høy, så kritikk kan bli hengende og farge resten av dagen.', 'Ask for feedback in writing, so you can read it when you are ready.', 'Be om tilbakemelding skriftlig, så du kan lese den når du er klar.'),

  R('drain', 'drains', 'alone', 'E2', 'high', 'Too much time alone drains you, which fits high Gregariousness.', 'For mye alenetid tapper deg, og det passer med høy Selskapelighet.', 'Plan your solo tasks next to a colleague, or in a café.', 'Gjør alenearbeidet ved siden av en kollega, eller på en kafé.'),
  R('drain', 'drains', 'alone', 'E1', 'high', 'High Friendliness means contact with people is part of what keeps you going.', 'Høy Vennlighet gjør at kontakt med folk er noe av det som holder deg i gang.', 'Start the day with a short chat with someone.', 'Start dagen med en kort prat med noen.'),
  R('drain', 'drains', 'noinfluence', 'E3', 'high', 'Little say over your day drains more when Assertiveness is high: you want to influence.', 'Lite å si over egen arbeidsdag tapper mer når Selvhevdelse er høy: du vil gjerne påvirke.', 'Ask to decide the order of your own tasks one day a week.', 'Be om å få bestemme rekkefølgen på oppgavene dine selv én dag i uka.'),
  R('drain', 'drains', 'noinfluence', 'O4', 'high', 'High Adventurousness makes it hard to follow someone else’s plan with no room to try things.', 'Høy Eventyrlyst gjør det tungt å følge andres plan uten rom for å prøve noe selv.', 'Suggest one small experiment you can be responsible for.', 'Foreslå ett lite forsøk du kan ha ansvaret for.'),

  // ── What gives you energy ───────────────────────────────────────────────
  R('energy', 'energy', 'problems', 'O5', 'high', 'Hard problems give you energy, which fits high Intellect.', 'Vanskelige problemer gir deg energi, og det passer med høy Intellekt.', 'Take on one case a month that nobody else has solved.', 'Ta på deg én sak i måneden som ingen andre har løst.'),
  R('energy', 'energy', 'problems', 'C1', 'high', 'High Self-Efficacy means you probably trust that you will find a way.', 'Høy Mestringstro gjør at du trolig stoler på at du finner en vei.', 'Say yes to one problem that is slightly beyond what you know today.', 'Si ja til ett problem som er litt utenfor det du kan i dag.'),
  R('energy', 'energy', 'help', 'A3', 'high', 'Helping someone gives you energy, and Altruism is high. It is probably at the core of why you do your job.', 'Å hjelpe noen gir deg energi, og Altruisme er høy. Det er trolig en viktig del av grunnen til at du gjør jobben din.', 'Tell colleagues what you are good at helping with, so they ask you.', 'Fortell kollegaene hva du er god til å hjelpe med, så de spør deg.'),
  R('energy', 'energy', 'help', 'A6', 'high', 'High Sympathy makes it meaningful to see that someone is doing better.', 'Høy Medfølelse gjør det meningsfullt å se at noen får det bedre.', 'Keep a note of one person you helped each week.', 'Noter én person du hjalp hver uke.'),
  R('energy', 'energy', 'finish', 'C4', 'high', 'Getting things done gives you energy, which fits high Achievement-Striving.', 'Å få ting ferdig gir deg energi, og det passer med høy Prestasjonsstreben.', 'End each day by ticking off one thing.', 'Avslutt hver dag med å krysse av for én ting.'),
  R('energy', 'energy', 'finish', 'C5', 'high', 'High Self-Discipline means you finish things even when they are not fun.', 'Høy Selvdisiplin gjør at du får ting ferdig også når det ikke er gøy.', 'Use it on the task you have been putting off longest.', 'Bruk det på oppgaven du har utsatt lengst.'),
  R('energy', 'energy', 'learn', 'O5', 'high', 'High Intellect means learning is probably a driving force in itself for you.', 'Høy Intellekt gjør at læring trolig er en drivkraft i seg selv for deg.', 'Set aside two hours a month to learn something in your field nobody asked you to.', 'Sett av to timer i måneden til å lære noe i faget ditt som ingen har bedt deg om.'),
  R('energy', 'energy', 'learn', 'O4', 'high', 'High Adventurousness means new things give you energy.', 'Høy Eventyrlyst gjør at nye ting gir deg energi.', 'Try one new method or tool at work each quarter.', 'Prøv én ny metode eller ett nytt verktøy på jobb hvert kvartal.'),
  R('energy', 'energy', 'people', 'E2', 'high', 'Being with people gives you energy, which fits high Gregariousness.', 'Å være sammen med folk gir deg energi, og det passer med høy Selskapelighet.', 'Put the most social tasks where you need a lift in the day.', 'Legg de mest sosiale oppgavene der du trenger et løft i dagen.'),
  R('energy', 'energy', 'people', 'E1', 'high', 'High Friendliness means you probably make people around you feel welcome, which gives energy back.', 'Høy Vennlighet gjør at du trolig får folk rundt deg til å føle seg velkomne, og det gir energi tilbake.', 'Take care of the new person at work.', 'Ta deg av den nye på jobben.'),
  R('energy', 'energy', 'people', 'E6', 'high', 'High Cheerfulness means your good mood probably spreads to people around you.', 'Høy Munterhet gjør at det gode humøret ditt trolig smitter over på dem rundt deg.', 'Notice which days you bring the most energy, and what made them so.', 'Legg merke til hvilke dager du gir mest energi, og hva som gjorde dem slik.'),
  R('energy', 'energy', 'create', 'O1', 'high', 'High Imagination means you probably have many ideas.', 'Høy Fantasi gjør at du trolig får mange ideer.', 'Keep the ideas in one list and pick one to test each month.', 'Skriv ideene i én liste og velg én å teste hver måned.'),
  R('energy', 'energy', 'create', 'O2', 'high', 'High Artistic Interests mean making something that looks or works well probably gives you energy.', 'Høye kunstneriske interesser gjør at det å lage noe som ser bra ut eller fungerer fint, trolig gir deg energi.', 'Give yourself one small creative task each week, also at work.', 'Gi deg selv én liten kreativ oppgave i uka, også på jobb.'),
  R('energy', 'energy', 'recognition', 'A5', 'low', 'Modesty is low, so being seen for what you achieve probably matters to you.', 'Beskjedenhet er lav, så det betyr trolig mye for deg å bli sett for det du får til.', 'Tell your manager about one result each month, rather than waiting to be asked.', 'Fortell lederen din om ett resultat hver måned, heller enn å vente på at noen spør.'),
  R('energy', 'energy', 'recognition', 'E3', 'high', 'High Assertiveness means visible results and influence give you energy.', 'Høy Selvhevdelse gjør at synlige resultater og innflytelse gir deg energi.', 'Present your own work to others once a month.', 'Legg fram ditt eget arbeid for andre én gang i måneden.'),
  R('energy', 'energy', 'variety', 'O4', 'high', 'Variety gives you energy, which fits high Adventurousness.', 'Variasjon gir deg energi, og det passer med høy Eventyrlyst.', 'Swap one routine task for something new each week.', 'Bytt ut én rutineoppgave med noe nytt hver uke.'),
  R('energy', 'energy', 'variety', 'E5', 'high', 'High Excitement-Seeking means new places and a bit of pace give you a lift.', 'Høy Spenningssøking gjør at nye steder og litt tempo gir deg et løft.', 'Say yes to the next work trip or field visit.', 'Si ja til neste jobbreise eller befaring.'),

  // ── When you lead (only with responsibility for others) ─────────────────
  R('lead', 'lead', ['informal', 'small', 'large', 'owner'], 'N6', 'low', 'Low Vulnerability means you are probably a calm presence when things get stormy, and that rubs off on others.', 'Lav Sårbarhet gjør at du trolig er en rolig kraft når det stormer, og det smitter over på andre.', 'Say out loud what you will handle first when things get busy, so others can relax.', 'Si høyt hva du tar først når det blir travelt, så andre kan senke skuldrene.'),
  R('lead', 'lead', ['informal', 'small', 'large', 'owner'], 'E3', 'high', 'High Assertiveness means you probably take the floor and set direction easily.', 'Høy Selvhevdelse gjør at du trolig lett tar ordet og staker ut retningen.', 'In the next meeting, let others speak first.', 'La andre snakke først i neste møte.'),
  R('lead', 'lead', ['informal', 'small', 'large', 'owner'], 'E3', 'low', 'Low Assertiveness can make you wait too long to decide or to say clearly what you want.', 'Lav Selvhevdelse kan gjøre at du venter for lenge med å bestemme eller si tydelig hva du vil.', 'End each meeting by saying out loud what has been decided.', 'Avslutt hvert møte med å si høyt hva som er bestemt.'),
  R('lead', 'lead', ['informal', 'small', 'large', 'owner'], 'A1', 'low', 'Low Trust can make it tempting to take tasks back yourself. Others may feel you do not trust them.', 'Lav Tillit kan gjøre det fristende å ta over oppgaver selv. Andre kan oppleve at du ikke stoler på dem.', 'Hand over one task a week that you would rather do yourself, and agree in advance what “good enough” looks like.', 'Gi bort én oppgave i uka som du helst ville gjort selv, og avtal på forhånd hva som er «bra nok».'),
  R('lead', 'lead', ['informal', 'small', 'large', 'owner'], 'A1', 'high', 'High Trust means you probably give people responsibility and room to act.', 'Høy Tillit gjør at du trolig gir folk ansvar og handlingsrom.', 'Agree on a simple check-in, so trust does not become absence.', 'Avtal en enkel oppfølging, så tillit ikke blir til fravær.'),
  R('lead', 'lead', ['informal', 'small', 'large', 'owner'], 'A6', 'high', 'High Sympathy means you probably notice early when someone is struggling.', 'Høy Medfølelse gjør at du trolig merker tidlig når noen sliter.', 'Ask one person a week how things are really going.', 'Spør én person i uka hvordan det egentlig går.'),
  R('lead', 'lead', ['informal', 'small', 'large', 'owner'], 'O4', 'high', 'High Adventurousness means you are probably open to new ways of doing things, and others get to try new ideas.', 'Høy Eventyrlyst gjør at du trolig er åpen for nye måter å gjøre ting på, og at andre får prøve nye ideer.', 'Introduce one idea at a time, so others can keep up.', 'Innfør én idé om gangen, så andre rekker å følge med.'),
  R('lead', 'lead', ['informal', 'small', 'large', 'owner'], 'C2', 'low', 'Low Orderliness can leave others missing clear plans and follow-up.', 'Lav Orden kan gjøre at andre savner tydelige planer og oppfølging.', 'Agree on one fixed weekly summary of what happens next.', 'Avtal én fast ukentlig oppsummering av hva som skal skje.'),
  R('lead', 'lead', ['informal', 'small', 'large', 'owner'], 'C4', 'high', 'High Achievement-Striving means you set high goals, for yourself and for others.', 'Høy Prestasjonsstreben gjør at du setter høye mål, for deg selv og for andre.', 'Ask whether the goal feels realistic for the others too.', 'Spør om målet kjennes realistisk for de andre også.'),
  R('lead', 'lead', ['informal', 'small', 'large', 'owner'], 'A5', 'high', 'High Modesty can make you underrate your own contribution and take less room than a leader needs.', 'Høy Beskjedenhet kan gjøre at du undervurderer egne bidrag og tar mindre plass enn en leder trenger.', 'Tell your manager about one thing you achieved this month.', 'Fortell lederen din om én ting du fikk til denne måneden.'),
  R('lead', 'lead', ['informal', 'small', 'large', 'owner'], 'E1', 'high', 'High Friendliness means people probably feel safe with you.', 'Høy Vennlighet gjør at folk trolig er trygge på deg.', 'Use that safety to give honest feedback early.', 'Bruk tryggheten til å gi ærlige tilbakemeldinger tidlig.')
];

// Next steps for the goal: facet-specific first, then general steps to fill three.
const S = (facet, dir, en, no) => ({facet, dir, text: [en, no]});
const goalSteps = {
  thrive: {facet: [
    S('O4', 'high', 'Ask for one new task or project that you can shape yourself.', 'Be om én ny oppgave eller ett prosjekt du kan forme selv.'),
    S('E2', 'high', 'Set up one fixed lunch or chat with a colleague each week.', 'Avtal én fast lunsj eller prat med en kollega i uka.'),
    S('N6', 'high', 'Agree in advance what can wait when it gets busy.', 'Avtal på forhånd hva som kan vente når det blir travelt.'),
    S('A3', 'high', 'Notice which moments of helping give you the most, and ask for more of them.', 'Legg merke til hvilke hjelpeøyeblikk som gir deg mest, og be om flere av dem.')],
  general: [
    ['Every Friday for four weeks, write down what gave and took energy that week.', 'Skriv ned hva som ga og tok energi hver fredag i fire uker.'],
    ['Talk to your manager about one task you want more of.', 'Snakk med lederen din om én oppgave du vil ha mer av.'],
    ['Pick one thing that drains you and agree on one small change.', 'Velg én ting som tapper deg, og avtal én liten endring.']]},
  more: {facet: [
    S('C4', 'high', 'Ask for one measurable goal for the quarter.', 'Be om ett målbart mål for kvartalet.'),
    S('E3', 'low', 'Take the floor first in one meeting a week.', 'Ta ordet først i ett møte i uka.'),
    S('A1', 'low', 'Hand over one task a week that you would rather keep.', 'Gi bort én oppgave i uka som du helst ville beholdt.'),
    S('O4', 'high', 'Propose one improvement you would like to lead yourself.', 'Foreslå én forbedring du vil lede selv.')],
  general: [
    ['Tell your manager that you want more responsibility, and ask what it would take.', 'Si til lederen din at du ønsker mer ansvar, og spør hva som skal til.'],
    ['Take on one small project you own from start to finish.', 'Ta på deg ett lite prosjekt du har ansvaret for fra start til slutt.'],
    ['Find someone who has the role you want, and ask how they got there.', 'Finn noen som har rollen du vil ha, og spør hvordan de kom dit.']]},
  change: {facet: [
    S('O4', 'high', 'List three directions you are curious about, and talk to one person in each.', 'Lag en liste over tre retninger du er nysgjerrig på, og snakk med én person i hver.'),
    S('C6', 'high', 'Test one direction on a small scale before you decide, such as a course.', 'Test én retning i det små før du bestemmer deg, for eksempel med et kurs.'),
    S('N1', 'high', 'Write down the worst and the most likely outcome of a change, side by side.', 'Skriv ned det verste og det mest sannsynlige utfallet av et bytte, ved siden av hverandre.')],
  general: [
    ['Write down three things you would take with you from your current job.', 'Skriv ned tre ting du ville tatt med deg fra jobben du har nå.'],
    ['Talk to two people who work with something you are curious about.', 'Snakk med to personer som jobber med noe du er nysgjerrig på.'],
    ['Use the list «Look for this in your next job» when you read job ads.', 'Bruk listen «Se etter dette i neste jobb» når du leser stillingsannonser.']]},
  calm: {facet: [
    S('N6', 'high', 'Agree in advance what can wait when it gets busy.', 'Avtal på forhånd hva som kan vente når det blir travelt.'),
    S('N1', 'high', 'Write down what is on your mind before you go home.', 'Skriv ned det som surrer i hodet før du går hjem.'),
    S('C2', 'low', 'Collect all tasks in one place.', 'Samle alle oppgavene på ett sted.'),
    S('A4', 'high', 'Say no to one thing a week that is not yours.', 'Si nei til én ting i uka som ikke er din.')],
  general: [
    ['Choose one fixed break in the day and keep it for four weeks.', 'Velg én fast pause i løpet av dagen og hold fast på den i fire uker.'],
    ['Note the situations that give the most stress, every day for a week.', 'Noter situasjonene som gir mest stress, hver dag i en uke.'],
    ['Say no to one thing a week that is not yours.', 'Si nei til én ting i uka som ikke er din.']]},
  balance: {facet: [
    S('C4', 'high', 'Decide what “good enough” is for one task each day, and stop there.', 'Bestem hva som er «godt nok» for én oppgave hver dag, og stopp der.'),
    S('A3', 'high', 'Say no to one request a week that someone else can take.', 'Si nei til én forespørsel i uka som noen andre kan ta.'),
    S('N1', 'high', 'Write down what is on your mind before you go home.', 'Skriv ned det som surrer i hodet før du går hjem.')],
  general: [
    ['Choose a fixed time when the working day is over, and keep it for four weeks.', 'Velg et fast tidspunkt da arbeidsdagen er over, og hold fast på det i fire uker.'],
    ['Put one thing you look forward to in the calendar each week, outside work.', 'Legg én ting du gleder deg til inn i kalenderen hver uke, utenom jobben.'],
    ['Notice which days the balance feels right, and what made them so.', 'Legg merke til hvilke dager balansen kjennes riktig, og hva som gjorde dem slik.']]},
  skills: {facet: [
    S('O5', 'high', 'Pick one question from your work this month and go deep on it.', 'Velg ett faglig spørsmål fra jobben denne måneden og gå i dybden på det.'),
    S('C5', 'low', 'Book a fixed hour a week for learning, like a meeting.', 'Sett av en fast time i uka til læring, som et møte.'),
    S('E2', 'high', 'Learn together with a colleague, or join a professional group.', 'Lær sammen med en kollega, eller bli med i en faggruppe.')],
  general: [
    ['Name one skill you want to be better at in six months.', 'Skriv ned én ferdighet du vil være bedre i om seks måneder.'],
    ['Ask someone skilled to watch you work and give feedback.', 'Be en dyktig kollega se deg jobbe og gi tilbakemelding.'],
    ['Take one course or read one book in your field this quarter.', 'Ta ett kurs eller les én fagbok dette kvartalet.']]},
  other: {facet: [],
  general: [
    ['Write your goal in one sentence and share it with someone.', 'Skriv målet ditt i én setning og del det med noen.'],
    ['Decide how you will know that you are on your way.', 'Bestem hvordan du vil merke at du er på vei.'],
    ['Choose one small step you can take this week.', 'Velg ett lite steg du kan ta denne uka.']]},
  people: {facet: [
    S('A4', 'low', 'Start with what you agree with before you say what you would do differently.', 'Start med det du er enig i før du sier hva du ville gjort annerledes.'),
    S('A1', 'low', 'Trust one colleague with a task you usually check.', 'Vis én kollega tillit ved å overlate en oppgave du vanligvis kontrollerer.'),
    S('E3', 'low', 'Say your view first in one meeting a week.', 'Si din mening først i ett møte i uka.'),
    S('E1', 'high', 'Use your warmth to welcome the newest person at work.', 'Bruk varmen din til å ta imot den nyeste på jobben.')],
  general: [
    ['Ask one colleague a week what they are working on right now.', 'Spør én kollega i uka hva de jobber med akkurat nå.'],
    ['Give one concrete, positive piece of feedback a day for two weeks.', 'Gi én konkret, positiv tilbakemelding om dagen i to uker.'],
    ['Ask for feedback on what you are like to work with.', 'Be om tilbakemelding på hvordan du er å samarbeide med.']]}
};

// «Look for this in your next job»: properties of the work, not job titles.
const L = (facet, dir, en, no) => ({facet, dir, text: [en, no]});
const lookFor = [
  L('O4', 'high', 'Tasks that change, and room to learn new things.', 'Oppgaver som skifter, og rom for å lære nytt.'),
  L('O4', 'low', 'Stable tasks you can become really good at.', 'Stabile oppgaver du kan bli virkelig god på.'),
  L('O5', 'high', 'Demanding problems that need to be thought through.', 'Faglig krevende problemer som må tenkes gjennom.'),
  L('A3', 'high', 'Work where you notice that you help someone.', 'Arbeid der du merker at du hjelper noen.'),
  L('E2', 'high', 'Plenty of contact with other people.', 'Mye kontakt med andre mennesker.'),
  L('E2', 'low', 'Room to work alone and undisturbed.', 'Rom for å jobbe alene og uforstyrret.'),
  L('E3', 'high', 'A chance to influence and take responsibility.', 'Mulighet til å påvirke og ta ansvar.'),
  L('E3', 'low', 'A role where you can contribute without having to stand in front.', 'En rolle der du kan bidra uten å måtte stå i front.'),
  L('C2', 'high', 'Clear frames and plans.', 'Tydelige rammer og planer.'),
  L('C2', 'low', 'Freedom in how you do the job, ideally with someone else keeping the systems in order.', 'Frihet i hvordan du gjør jobben, gjerne med noen andre som holder orden på systemene.'),
  L('C5', 'low', 'Clear deadlines rather than completely free rein.', 'Tydelige frister heller enn helt frie tøyler.'),
  L('N6', 'high', 'A predictable pace and a manager who shields you from too much at once.', 'Et forutsigbart tempo og en leder som skjermer deg mot for mye på en gang.'),
  L('N6', 'low', 'Roles where keeping a cool head under pressure is valued.', 'Roller der det å holde hodet kaldt under press er verdsatt.'),
  L('E5', 'high', 'Pace and challenges.', 'Tempo og utfordringer.'),
  L('O1', 'high', 'Room to make something of your own.', 'Rom for å lage noe eget.'),
  L('A4', 'low', 'Room to disagree and say so directly.', 'Rom for å være uenig og si det rett ut.')
];

const pick = (pair, language) => pair[language === 'no' ? 1 : 0];
export const question = id => questions.find(q => q.id === id);
const asList = v => Array.isArray(v) ? v : v ? [v] : [];

/** The label for an answer; «Other» shows the reader's own text when they wrote one. */
export function optionLabel(qid, value, language, answers = null) {
  const o = question(qid)?.options.find(([v]) => v === value);
  if (!o) return '';
  const base = language === 'no' ? o[2] : o[1], text = value === 'other' ? cleanOther(answers?.other?.[qid]) : '';
  // A written job title stands on its own («kiropraktor»), other notes keep the option name in front.
  if (text && qid === 'role') return text;
  return text ? `${base}: ${text}` : base;
}
export const cleanOther = v => typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, OTHER_MAX) : '';

/** True when every question has a valid answer (multi questions need 1–max choices). */
export function isComplete(answers = {}) {
  return questions.every(q => {
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
 * Picks what the report says. Returns {sections:[{id, items:[{ruleId, text, try, facets, answers}]}]}.
 * Only facets outside the middle range are used, and only in the direction a rule names.
 */
export function buildCareer(domains, answers, language = 'en') {
  if (!isComplete(answers)) return null;
  const facets = facetIndex(domains), out = {good: [], hard: [], drain: [], energy: [], lead: [], next: [], lookfor: []};
  const used = {good: new Set(), hard: new Set(), drain: new Set(), energy: new Set(), lead: new Set()};
  const answered = {};
  for (const q of questions) answered[q.id] = asList(answers[q.id]);
  const leads = answered.lead[0] !== 'no', candidates = {drain: {}, energy: {}};
  const item = (r, f, hit) => ({ruleId: `career-${r.section}-${r.q}-${hit}-${r.facet}-${r.dir}`, text: pick(r.text, language), try: pick(r.try, language), facets: [fact(f)], answers: [{q: r.q, value: hit, label: optionLabel(r.q, hit, language, answers)}]});
  rules.forEach(r => {
    const f = facets[r.facet];
    if (!f || f.band !== r.dir || used[r.section].has(r.facet)) return;
    if (r.section === 'lead' && !leads) return;
    const hit = r.v.find(v => answered[r.q].includes(v));
    if (!hit) return;
    // Drains and energy can have two answers: collect per answer and share the room fairly below.
    if (candidates[r.section]) { (candidates[r.section][hit] ||= []).push({r, f, hit}); return; }
    if (out[r.section].length >= LIMIT[r.section]) return;
    // The same facet should not be explained twice under «fits» and «clashes».
    if ((r.section === 'good' && used.hard.has(r.facet)) || (r.section === 'hard' && used.good.has(r.facet))) return;
    used[r.section].add(r.facet);
    out[r.section].push(item(r, f, hit));
  });
  for (const [section, qid] of [['drain', 'drains'], ['energy', 'energy']]) {
    const queues = answered[qid].map(v => [...(candidates[section][v] || [])]);
    while (out[section].length < LIMIT[section] && queues.some(q => q.length)) {
      for (const queue of queues) {
        while (queue.length && used[section].has(queue[0].r.facet)) queue.shift();
        const next = queue.shift();
        if (next && out[section].length < LIMIT[section]) { used[section].add(next.r.facet); out[section].push(item(next.r, next.f, next.hit)); }
      }
    }
  }
  // Answers about drains and energy that no facet explains still get a line: it is useful to know
  // that this is probably more about the situation than about personality.
  for (const [section, qid] of [['drain', 'drains'], ['energy', 'energy']]) {
    for (const value of answered[qid]) {
      if (value === 'other') continue;
      if (out[section].some(x => x.answers.some(a => a.value === value)) || candidates[section][value]?.length) continue;
      const label = optionLabel(qid, value, language);
      const text = section === 'drain'
        ? pick([`“${label}” drains you, but none of the facets linked to it sits clearly high or low. It may be more about the situation than about your personality, which also means it can be easier to change.`, `«${label}» tapper deg, men ingen av fasettene som henger sammen med det, ligger tydelig høyt eller lavt. Det kan derfor handle mer om situasjonen enn om personligheten din, og det betyr at det kan være lettere å endre.`], language)
        : pick([`“${label}” gives you energy, even though no linked facet sits clearly high or low. It is worth noticing when it happens, and asking for more of it.`, `«${label}» gir deg energi, selv om ingen av fasettene som henger sammen med det, ligger tydelig høyt eller lavt. Det er verdt å legge merke til når det skjer, og be om mer av det.`], language);
      out[section].push({ruleId: `career-${section}-${qid}-${value}-situation`, text, try: '', facets: [], answers: [{q: qid, value, label}]});
    }
  }
  const goal = answered.goal[0], plan = goalSteps[goal], goalAnswer = {q: 'goal', value: goal, label: optionLabel('goal', goal, language, answers)};
  for (const s of plan.facet) {
    const f = facets[s.facet];
    if (out.next.length < LIMIT.next && f && f.band === s.dir) out.next.push({ruleId: `career-next-${goal}-${s.facet}-${s.dir}`, text: pick(s.text, language), try: '', facets: [fact(f)], answers: [goalAnswer]});
  }
  plan.general.forEach((pair, i) => {
    const text = pick(pair, language);
    if (out.next.length < LIMIT.next && !out.next.some(x => x.text === text)) out.next.push({ruleId: `career-next-${goal}-general-${i + 1}`, text, try: '', facets: [], answers: [goalAnswer]});
  });
  if (goal === 'change') for (const l of lookFor) {
    const f = facets[l.facet];
    if (out.lookfor.length < LIMIT.lookfor && f && f.band === l.dir) out.lookfor.push({ruleId: `career-lookfor-${l.facet}-${l.dir}`, text: pick(l.text, language), try: '', facets: [fact(f)], answers: [goalAnswer]});
  }
  const order = ['good', 'hard', 'drain', 'energy', 'lead', 'next', 'lookfor'];
  return {version: CAREER_VERSION, goal, leads, sections: order.filter(id => id !== 'lead' || leads).filter(id => id !== 'lookfor' || goal === 'change').map(id => ({id, items: out[id]}))};
}

/** The compact input the server needs to write the text: picked facts only, no names or free text. */
export function careerRequest(career, domains, answers, language) {
  return {
    version: CAREER_VERSION,
    language: language === 'no' ? 'no' : 'en',
    traits: (domains || []).map(d => ({code: d.code, percentile: Number.isFinite(d.percentile) ? d.percentile : null, band: d.band})),
    answers: questions.map(q => ({q: q.id, question: pick(q.q, language), values: asList(answers[q.id]), labels: asList(answers[q.id]).map(v => optionLabel(q.id, v, language, answers))})),
    sections: career.sections.map(s => ({id: s.id, items: s.items.map(x => ({ruleId: x.ruleId, draft: x.text, try: x.try, facets: x.facets, answers: x.answers.map(a => a.q)}))}))
  };
}
