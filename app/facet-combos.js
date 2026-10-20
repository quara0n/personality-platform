// Rare facet combinations for the share video («morsomme komboer», Rune 2026-10-20): the pair of facets in a
// person's profile that the fewest people share, e.g. very orderly and very adventurous, with a line that
// hits home. How rare a pair is comes from the same model as the profile character's rarity
// (scripts/build_name_frequencies.js): facet scores are normal, facets share a trait factor (loading 0.65)
// and the five traits correlate as in van der Linden, te Nijenhuis & Bakker (2010). The share is the
// estimated number of people at least as far out as this person on both facets, so it is an estimate from
// the norm data, not a count, and the video says so. Numbers are said in people, never percent.
// Lines are editorial: warm, a little boastful or cheeky, never mocking. They only claim what the two facets
// measure, so the joke stays traceable to the result.
import {words, profileName} from './profile-name.js';
import {roundPeople} from './name-rarity.js';

const LOADING = 0.65, ORDER = 'OCEAN';
const R = [
  [1, .20, .43, .21, -.17],
  [.20, 1, .29, .43, -.43],
  [.43, .29, 1, .26, -.36],
  [.21, .43, .26, 1, -.36],
  [-.17, -.43, -.36, -.36, 1]
];
// Facet ends we never put in a combo: they are hard to say playfully (low self-efficacy, low mood, feeling overwhelmed).
const SKIP = new Set(['C1l', 'N3h', 'N6h']);
// A pair has to be at least this rare to be shown (1 in 20 people or fewer).
export const MAX_SHARE = 1 / 20;
// Pairs that pull the same way are more common; the report shows them up to 1 in 10.
export const MAX_TOGETHER = 1 / 10;
// Below this share of what two unrelated facets would give, the pair «rarely goes together».
const CONTRAST = .7;

const pick = (pair, language) => pair[language === 'no' ? 1 : 0];
const key = f => `${f.code}${f.band[0]}`;
export const comboKey = (a, b) => [a, b].sort().join('+');

// Hand-written lines for pairs that say more together than apart. [English, Norwegian]
const lines = {
  // Conscientiousness pulling two ways
  'C2h+C5l': ['Everything has its place. Except the task that was due yesterday.', 'Alt har sin faste plass. Bortsett fra oppgaven som skulle vært levert i går.'],
  'C2l+C5h': ['The desk looks like a crater. The work still lands on time.', 'Pulten ser ut som et krater. Jobben blir likevel levert i tide.'],
  'C2l+C4h': ['Big goals. Messy desk. Both at full speed.', 'Store mål. Rotete pult. Begge deler i full fart.'],
  'C2l+C3h': ['Always keeps their word. Can’t always find their keys.', 'Holder alltid det den lover. Finner bare ikke alltid nøklene.'],
  'C5l+C6h': ['Thinks everything through. So thoroughly that it becomes tomorrow.', 'Tenker grundig gjennom alt. Så grundig at det blir i morgen.'],
  'C1h+C5l': ['Knows they can do it. Just not quite yet.', 'Vet at den klarer det. Bare ikke helt ennå.'],
  'C2h+C6l': ['Buys on impulse. Files the receipt afterwards.', 'Kjøper på impuls. Arkiverer kvitteringen etterpå.'],
  // Openness and Conscientiousness
  'C2h+O4h': ['Colour-codes the backpack before the round-the-world trip.', 'Fargekoder ryggsekken før jorda rundt-turen.'],
  'C5h+O1h': ['Daydreams. At a set time in the calendar.', 'Dagdrømmer. På fast tidspunkt i kalenderen.'],
  'C3l+O6l': ['Loves the old traditions. Bends the rules a little.', 'Elsker de gamle tradisjonene. Bøyer litt på reglene.'],
  // Openness pulling two ways
  'O4h+O6l': ['Travels the world. Home for Christmas. Every time.', 'Reiser verden rundt. Hjemme til jul. Hver gang.'],
  'O4l+O6h': ['Questions every rule. Eats the same breakfast every day.', 'Stiller spørsmål ved hver regel. Spiser samme frokost hver dag.'],
  'O2l+O5h': ['Can debate the meaning of life for hours. The art museum can wait.', 'Kan diskutere meningen med livet i timevis. Kunstmuseet får vente.'],
  'O2h+O5l': ['Moved by a beautiful sunset. Skips the lecture on why it’s orange.', 'Blir rørt av en vakker solnedgang. Hopper over forelesningen om hvorfor den er oransje.'],
  'E6l+O3h': ['Feels everything deeply. Shows it with a small nod.', 'Kjenner alt dypt. Viser det med et lite nikk.'],
  'A6h+O3l': ['Keeps a cool head. And a warm heart.', 'Holder hodet kaldt. Og hjertet varmt.'],
  // Openness and Extraversion
  'E5h+O4l': ['Orders the usual. Preferably on a rollercoaster.', 'Bestiller det vanlige. Helst i en berg-og-dal-bane.'],
  'E5l+O4h': ['Wants to try everything new. From the sofa, under a blanket.', 'Vil prøve alt som er nytt. Fra sofaen, under pleddet.'],
  'E5h+O6l': ['Loves old traditions. And skydiving.', 'Elsker gamle tradisjoner. Og fallskjermhopp.'],
  // Extraversion pulling two ways
  'E1l+E2h': ['Loves a big party. Takes a while to let new people in.', 'Elsker store fester. Bruker litt tid før nye folk slipper inn.'],
  'E2l+E3h': ['Takes charge. Ideally on a video call from home.', 'Tar styringen. Helst på videomøte hjemmefra.'],
  'E2h+E3l': ['Loves a party. Happy to let someone else give the speech.', 'Elsker fest. Lar gjerne andre holde talen.'],
  'E4l+E5h': ['Wants thrills. At their own pace.', 'Vil ha spenning. I sitt eget tempo.'],
  'E2h+E6l': ['Always at the party. Only laughs when it’s actually funny.', 'Alltid med på festen. Ler bare når det faktisk er morsomt.'],
  'E2l+E6h': ['Laughs loud and often. Preferably from the sofa.', 'Ler høyt og ofte. Helst fra sofaen.'],
  'E2l+E4h': ['Full speed all day. With the door closed.', 'Full fart hele dagen. Med døra lukket.'],
  'E1l+E3h': ['Leads the way. Skips the small talk.', 'Går foran. Hopper over småpraten.'],
  'C4h+E4l': ['Big goals. Slow pace. Gets there anyway.', 'Store mål. Rolig tempo. Kommer fram likevel.'],
  'C6l+E5l': ['Decides in a second. Still picks the sofa.', 'Bestemmer seg på et sekund. Velger likevel sofaen.'],
  // Emotional reactivity
  'C6h+N1l': ['Doesn’t worry. Still checks that the stove is off.', 'Bekymrer seg ikke. Sjekker likevel at komfyren er av.'],
  'E5h+N1h': ['Worries about everything. Jumps in anyway.', 'Bekymrer seg for alt. Hopper i det likevel.'],
  'C6l+N1h': ['Pictures everything that could go wrong. Then does it right away.', 'Ser for seg alt som kan gå galt. Gjør det så med en gang.'],
  'E3h+N4h': ['Shy. Still speaks up when it counts.', 'Sjenert. Tar likevel ordet når det gjelder.'],
  'E2l+N4l': ['Could give a speech to a hundred. Prefers dinner for two.', 'Kunne holdt tale for hundre. Velger heller middag for to.'],
  'A4h+N2h': ['Boiling inside. Still finds the compromise.', 'Koker inni seg. Finner likevel kompromisset.'],
  'A4l+N2l': ['Never gets angry. Never gives up an argument either.', 'Blir aldri sint. Gir seg heller aldri i en diskusjon.'],
  'C2h+N5h': ['Eats the whole bag. Folds it neatly afterwards.', 'Spiser hele posen. Bretter den pent sammen etterpå.'],
  'C5h+N5h': ['Just one more episode. Still up at six.', 'Bare én episode til. Står likevel opp klokka seks.'],
  'E5h+N5l': ['Says no to dessert. Yes to bungee jumping.', 'Sier nei til dessert. Ja til strikkhopp.'],
  'N1h+N6l': ['Worries in advance. Is the rock when it actually happens.', 'Bekymrer seg på forhånd. Er klippen når det faktisk smeller.'],
  'E6h+N2h': ['Sunny as anything. With the odd small eruption.', 'Blid som en sol. Med et lite vulkanutbrudd innimellom.'],
  'E6l+N3l': ['Looks serious. Actually believes it will all work out.', 'Ser alvorlig ut. Tror egentlig at alt ordner seg.'],
  'A6h+N1l': ['Feels for everyone. Never loses their cool.', 'Føler med alle. Mister aldri roen.'],
  // Agreeableness
  'A1l+A3h': ['Doesn’t trust just anyone. Helps everyone anyway.', 'Stoler ikke på hvem som helst. Hjelper alle likevel.'],
  'A4l+A6h': ['Happy to argue with you. Comforts you right after.', 'Krangler gjerne med deg. Trøster deg rett etterpå.'],
  'A3h+A5l': ['Knows they’re good. Uses it to help others.', 'Vet at den er god. Bruker det til å hjelpe andre.'],
  'A3h+A6l': ['Doesn’t comfort with words. Turns up with a toolbox.', 'Trøster ikke med ord. Kommer med verktøykassa.'],
  'A5l+E3l': ['Knows their worth. Doesn’t need the stage to prove it.', 'Vet hva den er god for. Trenger ikke scenen for å vise det.'],
  'A2l+C3h': ['Knows every trick. Sticks to the deal anyway.', 'Kan alle triksene. Holder avtalen likevel.'],
  'A4l+E6h': ['Disagrees with you. With a big smile.', 'Er uenig med deg. Med et stort smil.'],
  'A1h+C6h': ['Believes the best of everyone. Has still read the terms and conditions.', 'Tror det beste om alle. Har likevel lest vilkårene.'],
  'A4h+E3h': ['Takes the lead. Makes sure everyone agrees.', 'Tar styringen. Sørger for at alle blir enige.'],
  // More pairs inside one trait, where the contrasts are most common
  'C1h+C2l': ['Can handle anything. If they can find it.', 'Klarer alt. Hvis den bare finner det.'],
  'C1h+C3l': ['Can fix anything. Never reads the manual.', 'Kan fikse alt. Leser aldri bruksanvisningen.'],
  'C1h+C4l': ['Could do anything. Chooses the hammock.', 'Kunne klart hva som helst. Velger hengekøya.'],
  'C1h+C6l': ['Trusts themselves. Jumps first, thinks after.', 'Stoler på seg selv. Hopper først, tenker etterpå.'],
  'C2h+C3l': ['Everything in its place. The rules, slightly less so.', 'Alt står på rett plass. Reglene står litt skjevt.'],
  'C2h+C4l': ['Perfectly tidy. Zero urge to climb any ladder.', 'Perfekt ryddig. Null behov for å klatre til topps.'],
  'C2l+C6h': ['Messy desk. Still reads the small print.', 'Rotete pult. Leser likevel det med liten skrift.'],
  'C3h+C4l': ['Always keeps their promises. Just doesn’t promise much.', 'Holder alltid det den lover. Lover bare ikke så mye.'],
  'C3h+C5l': ['Keeps every promise. At the last minute.', 'Holder alt den lover. I siste liten.'],
  'C3h+C6l': ['Keeps their word. Decides in a split second.', 'Holder ord. Bestemmer seg på sekundet.'],
  'C3l+C4h': ['Big goals. Own rules.', 'Store mål. Egne regler.'],
  'C3l+C5h': ['Works hard. By their own rules.', 'Jobber hardt. Etter egne regler.'],
  'C3l+C6h': ['Bends the rules. Carefully.', 'Bøyer på reglene. Forsiktig.'],
  'C4h+C6l': ['Aims for the top. Takes the shortcut.', 'Vil helt til topps. Tar snarveien.'],
  'C4l+C5h': ['No big goals. Still does everything on time.', 'Ingen store mål. Gjør likevel alt i tide.'],
  'C4l+C6h': ['No rush to reach the top. Checks the route twice anyway.', 'Ingen hast med å nå toppen. Sjekker veien to ganger likevel.'],
  'C5h+C6l': ['Disciplined as an athlete. Spontaneous as a kid.', 'Disiplinert som en idrettsutøver. Spontan som et barn.'],
  'O1h+O2l': ['Dreams in vivid pictures. Doesn’t need them on the wall.', 'Drømmer i fargerike bilder. Trenger ikke henge dem på veggen.'],
  'O1h+O3l': ['Full of imagination. Keeps the feelings to themselves.', 'Full av fantasi. Holder følelsene for seg selv.'],
  'O1h+O4l': ['Travels far in their head. Orders the usual in real life.', 'Reiser langt i fantasien. Bestiller det vanlige i virkeligheten.'],
  'O1h+O5l': ['Daydreams a lot. Still fixes things with their hands.', 'Dagdrømmer mye. Fikser likevel ting med hendene.'],
  'O1h+O6l': ['Dreams wildly. Keeps the traditions.', 'Drømmer vilt. Holder på tradisjonene.'],
  'O1l+O2h': ['Loves art. Keeps both feet on the ground.', 'Elsker kunst. Holder beina på jorda.'],
  'O1l+O3h': ['Feet on the ground. Heart on the sleeve.', 'Beina på jorda. Hjertet utenpå.'],
  'O1l+O4h': ['Wants to try everything. For real, not in their head.', 'Vil oppleve alt. På ekte, ikke i fantasien.'],
  'O1l+O5h': ['Loves big questions. Wants facts for answers.', 'Elsker store spørsmål. Vil ha fakta som svar.'],
  'O1l+O6h': ['Questions every rule. Feet firmly on the ground.', 'Stiller spørsmål ved alle regler. Med beina godt plantet.'],
  'O2h+O3l': ['Loves art. Doesn’t cry at it.', 'Elsker kunst. Gråter ikke av den.'],
  'O2h+O4l': ['Loves art. Visits the same museum every time.', 'Elsker kunst. Går på det samme museet hver gang.'],
  'O2h+O6l': ['An eye for beauty. And for tradition.', 'Sans for det vakre. Og for det tradisjonelle.'],
  'O2l+O3h': ['Skips the art museum. Cries at adverts.', 'Hopper over kunstmuseet. Gråter av reklamefilmer.'],
  'O2l+O4h': ['Wants to see the whole world. The art museums will manage without.', 'Vil se hele verden. Kunstmuseene får klare seg uten.'],
  'O2l+O6h': ['Questions every rule. Skips the gallery.', 'Stiller spørsmål ved alle regler. Hopper over galleriet.'],
  'O3h+O4l': ['Feels everything deeply. Orders the usual.', 'Kjenner alt dypt. Bestiller det vanlige.'],
  'O3h+O5l': ['Follows the heart. Skips the philosophy.', 'Følger hjertet. Hopper over filosofien.'],
  'O3h+O6l': ['Big heart. Old values.', 'Stort hjerte. Gamle verdier.'],
  'O3l+O4h': ['Up for every adventure. Keeps a cool head through all of them.', 'Med på alle eventyr. Holder hodet kaldt i alle sammen.'],
  'O3l+O5h': ['Thinks big thoughts. With a cool head.', 'Tenker store tanker. Med kaldt hode.'],
  'O3l+O6h': ['Challenges every rule. Without any drama.', 'Utfordrer alle regler. Helt uten dramatikk.'],
  'O4h+O5l': ['Tries everything new. Skips the theory.', 'Prøver alt som er nytt. Hopper over teorien.'],
  'O4l+O5h': ['Can philosophise for hours. In their usual seat.', 'Kan filosofere i timevis. På den faste plassen sin.'],
  'O5h+O6l': ['Thinks deeply. Keeps the traditions.', 'Tenker dypt. Holder på tradisjonene.'],
  'O5l+O6h': ['Questions every rule. Without writing an essay about it.', 'Stiller spørsmål ved alle regler. Uten å skrive en avhandling om det.'],
  'E1h+E3l': ['Warm with everyone. Happy to let others decide.', 'Varm mot alle. Lar gjerne andre bestemme.'],
  'E1h+E4l': ['Chats with anyone. At a gentle pace.', 'Prater gjerne med alle. I rolig tempo.'],
  'E1h+E5l': ['Warm with everyone. Ideally over a calm cup of coffee.', 'Hjertelig mot alle. Helst over en rolig kopp kaffe.'],
  'E1h+E6l': ['Warm and friendly. With a straight face.', 'Varm og vennlig. Med alvorlig mine.'],
  'E1l+E4h': ['Full speed all day. The small talk can wait.', 'Full fart hele dagen. Småpraten kan vente.'],
  'E1l+E5h': ['Loves a thrill. Doesn’t need new friends for it.', 'Elsker spenning. Trenger ikke nye venner for det.'],
  'E1l+E6h': ['Laughs out loud. Doesn’t let just anyone in.', 'Ler høyt. Men slipper ikke inn hvem som helst.'],
  'E2h+E4l': ['Loves a big crowd. At their own pace.', 'Elsker store selskap. I sitt eget tempo.'],
  'E2h+E5l': ['The more people the better. As long as nobody suggests skydiving.', 'Jo flere folk, jo bedre. Så lenge ingen foreslår fallskjermhopp.'],
  'E2l+E5h': ['Loves a thrill. And getting home to the sofa after.', 'Elsker spenning. Og å komme hjem til sofaen etterpå.'],
  'E3h+E4l': ['Takes charge. At a calm pace.', 'Tar styringen. I rolig tempo.'],
  'E3h+E5l': ['Takes the lead. Keeps the course safe.', 'Tar styringen. Holder kursen trygg.'],
  'E3h+E6l': ['Takes charge. With a perfectly straight face.', 'Tar styringen. Med helt alvorlig mine.'],
  'E3l+E4h': ['Always busy. No need to be the boss.', 'Har alltid noe fore. Trenger ikke være sjefen.'],
  'E3l+E5h': ['Loves a thrill. Lets others do the talking.', 'Elsker spenning. Lar andre ta ordet.'],
  'E3l+E6h': ['Laughs loudest from the back of the room.', 'Ler høyest bakerst i rommet.'],
  'E4h+E5l': ['Full speed all day. No unnecessary risks.', 'Full fart hele dagen. Ingen unødvendig risiko.'],
  'E4h+E6l': ['Gets a huge amount done. With a perfectly straight face.', 'Får gjort enormt mye. Med helt rolig ansikt.'],
  'E4l+E6h': ['Laughs a lot. Never in a hurry.', 'Ler mye. Har aldri dårlig tid.'],
  'E5h+E6l': ['Loves a thrill. Keeps a straight face the whole way.', 'Elsker spenning. Holder masken hele veien.'],
  'E5l+E6h': ['Laughs easily. Still picks a calm evening.', 'Ler lett. Velger likevel en rolig kveld.'],
  'N1h+N2l': ['Worries a lot. Hardly ever gets angry.', 'Bekymrer seg mye. Blir nesten aldri sint.'],
  'N1h+N3l': ['Worries a lot. Still believes it will all work out.', 'Bekymrer seg mye. Tror likevel at alt ordner seg.'],
  'N1h+N4l': ['Worries quietly. Still grabs the mic.', 'Bekymrer seg i det stille. Tar likevel mikrofonen.'],
  'N1h+N5l': ['Worries plenty. Never overdoes anything.', 'Bekymrer seg mye. Tar aldri for mye av noe.'],
  'N1l+N2h': ['Never worries. Just gets a little fiery now and then.', 'Bekymrer seg aldri. Blir bare litt fyrrig av og til.'],
  'N1l+N4h': ['Calm inside. Still blushes easily.', 'Rolig inni seg. Rødmer likevel lett.'],
  'N1l+N5h': ['Carefree. Happy to have one more slice.', 'Bekymringsløs. Tar gjerne ett kakestykke til.'],
  'N2h+N3l': ['Quick to anger. Just as quick to smile again.', 'Blir fort sint. Blir like fort blid igjen.'],
  'N2h+N4l': ['Fiery. And not shy about saying so.', 'Fyrrig. Og ikke redd for å si det høyt.'],
  'N2h+N5l': ['A temper. But full control of the chocolate.', 'Temperament. Men full kontroll på sjokoladen.'],
  'N2h+N6l': ['Boils fast. Still steady in a storm.', 'Koker fort. Står likevel stødig i stormen.'],
  'N2l+N4h': ['Patient and a bit shy. The best listener in the room.', 'Tålmodig og litt sjenert. Den beste lytteren i rommet.'],
  'N2l+N5h': ['Never angry. Just hungry.', 'Blir aldri sint. Bare sulten.'],
  'N3l+N4h': ['A bit shy. Very hopeful.', 'Litt sjenert. Veldig optimistisk.'],
  'N3l+N5h': ['Enjoys life. And believes it will get even better.', 'Nyter livet. Og tror det blir enda bedre.'],
  'N4h+N5l': ['Shy. With iron self-control.', 'Sjenert. Med jernkontroll.'],
  'N4h+N6l': ['A bit shy. But the rock in a storm.', 'Litt sjenert. Men klippen når det stormer.'],
  'N4l+N5h': ['Grabs the mic. And the last biscuit.', 'Tar mikrofonen. Og den siste kjeksen.'],
  'N5h+N6l': ['Says yes to one more. Stays steady anyway.', 'Sier ja til en til. Står stødig uansett.'],
  'A1h+A2l': ['Trusts everyone. Still plays to win.', 'Stoler på alle. Spiller likevel for å vinne.'],
  'A1h+A4l': ['Believes the best of you. Argues with you anyway.', 'Tror det beste om deg. Krangler likevel med deg.'],
  'A1h+A5l': ['Trusts others. And definitely themselves.', 'Stoler på andre. Og ikke minst på seg selv.'],
  'A1h+A6l': ['Trusts people. Comforts with solutions.', 'Stoler på folk. Trøster med løsninger.'],
  'A1l+A2h': ['Doesn’t trust you yet. Would never lie to you.', 'Stoler ikke på deg ennå. Ville aldri løyet for deg.'],
  'A1l+A4h': ['Sceptical deep down. Finds the compromise anyway.', 'Skeptisk innerst inne. Finner likevel kompromisset.'],
  'A1l+A5h': ['Sceptical and modest. Sees everything, says little.', 'Skeptisk og beskjeden. Ser alt, sier lite.'],
  'A1l+A6h': ['Doesn’t trust just anyone. Feels for everyone.', 'Stoler ikke på hvem som helst. Føler med alle.'],
  'A2h+A3l': ['Would never cheat you. Won’t carry your sofa either.', 'Ville aldri lurt deg. Bærer ikke sofaen din heller.'],
  'A2h+A4l': ['Honest to the core. Never backs down in an argument.', 'Ærlig til fingerspissene. Gir seg aldri i en diskusjon.'],
  'A2h+A5l': ['Honest. Including about how good they are.', 'Ærlig. Også om hvor flink den er.'],
  'A2h+A6l': ['Honest and clear-eyed. Sugar-coats nothing.', 'Ærlig og klarsynt. Pakker ikke inn noe.'],
  'A2l+A3h': ['Knows how the game works. Uses it to help others.', 'Kan spillet. Bruker det til å hjelpe andre.'],
  'A2l+A4h': ['Crafty as a fox. Wants everyone to agree.', 'Lur som en rev. Vil helst at alle skal bli enige.'],
  'A2l+A5h': ['Crafty. But modest about it.', 'Lur. Men beskjeden om det.'],
  'A2l+A6h': ['Crafty as a fox. With a soft heart.', 'Lur som en rev. Med et mykt hjerte.'],
  'A3h+A4l': ['Happy to help you. Just doesn’t agree with you.', 'Hjelper deg gjerne. Er bare ikke enig med deg.'],
  'A3l+A4h': ['Avoids arguments. Also avoids moving day.', 'Unngår krangel. Unngår også flyttedagen.'],
  'A3l+A5h': ['Modest. And looks after number one.', 'Beskjeden. Og passer godt på seg selv.'],
  'A3l+A6h': ['Feels for you. From the sofa.', 'Føler med deg. Fra sofaen.'],
  'A4h+A5l': ['Wants everyone to agree. That they were right.', 'Vil at alle skal bli enige. Om at den hadde rett.'],
  'A4h+A6l': ['Avoids the argument. Solves the problem instead.', 'Unngår krangelen. Løser problemet i stedet.'],
  'A4l+A5h': ['Happy to argue. Never brags.', 'Krangler gjerne. Skryter aldri.'],
  'A5h+A6l': ['Modest and clear-eyed. Does what needs doing.', 'Beskjeden og klarsynt. Gjør det som må gjøres.'],
  'A5l+A6h': ['Knows their worth. Still has a soft heart.', 'Vet hva den er god for. Har likevel et mykt hjerte.']

};
export {lines as comboLines};

// Pairs that pull the same way and are strong together in certain situations (Rune 2026-10-20: «to som går
// steinbra sammen i enkelte situasjoner»), for the report's combo chapter. [line, when it shines], each [English, Norwegian].
const together = {
  'C2h+C5h': [['Has a place for everything, and the discipline to keep it there.', 'Har en plass til alt, og disiplinen til å holde det sånn.'], ['Big projects with many parts and a fixed deadline.', 'Store prosjekter med mange deler og en fast frist.']],
  'C3h+C5h': [['Says yes, then actually does it, on time.', 'Sier ja, og gjør det faktisk, i tide.'], ['When others need someone they can count on all the way.', 'Når andre trenger noen de kan stole på hele veien.']],
  'C4h+C5h': [['Big goals and the stamina to reach them.', 'Store mål og utholdenhet til å nå dem.'], ['Long hauls: an education, a marathon, a business.', 'Lange løp: en utdanning, et maraton, en bedrift.']],
  'C1h+C4h': [['Believes they can, and wants to.', 'Tror den klarer det, og vil det.'], ['New challenges where someone has to step up first.', 'Nye utfordringer der noen må gå først.']],
  'C2h+C6h': [['Careful and orderly. Nothing slips through.', 'Grundig og ryddig. Ingenting glipper.'], ['Checking, planning and anything where mistakes are expensive.', 'Kontroll, planlegging og alt der feil koster dyrt.']],
  'C6l+E5h': [['Spontaneous and up for a thrill. Says yes before the question is finished.', 'Spontan og spenningssøkende. Sier ja før spørsmålet er ferdig.'], ['When plans fall apart and something new has to happen right now.', 'Når planene ryker og noe nytt må skje med en gang.']],
  'C2l+O4h': [['Messy and adventurous. Ready to pack in five minutes.', 'Rotete og eventyrlysten. Klar til å pakke på fem minutter.'], ['Trips without an itinerary, and teams that need to try something new.', 'Reiser uten reiseplan, og team som må prøve noe nytt.']],
  'C4l+E4l': [['Relaxed about goals and pace. The calm in a stressed office.', 'Avslappet til både mål og tempo. Roen på et stresset kontor.'], ['When everyone else is rushing and someone needs to keep it calm.', 'Når alle andre stresser og noen må holde det rolig.']],
  'O1h+O2h': [['Daydreams in colour, and makes something of it.', 'Dagdrømmer i farger, og lager noe av det.'], ['Creative work: design, writing, music, ideas.', 'Kreativt arbeid: design, skriving, musikk, ideer.']],
  'O5h+O6h': [['Thinks big and questions everything.', 'Tenker stort og stiller spørsmål ved alt.'], ['Debates, research, and spotting the flaw in a plan.', 'Debatter, forskning og å finne svakheten i en plan.']],
  'E5h+O4h': [['Adventurous and up for a thrill. First one out of the plane.', 'Eventyrlysten og spenningssøkende. Først ut av flyet.'], ['Travel, new places and anything nobody has tried before.', 'Reiser, nye steder og alt ingen har prøvd før.']],
  'C6h+O5h': [['Thinks deeply, and carefully.', 'Tenker dypt, og grundig.'], ['Hard problems that need both ideas and checking.', 'Vanskelige problemer som trenger både ideer og kontroll.']],
  'C4h+O1h': [['Dreams big, and goes for it.', 'Drømmer stort, og går for det.'], ['Building something of your own from an idea.', 'Å bygge noe eget fra en idé.']],
  'A6h+O3h': [['Feels deeply, and feels with others.', 'Kjenner sterkt, og føler med andre.'], ['When someone needs to be truly understood.', 'Når noen trenger å bli virkelig forstått.']],
  'O2h+O3h': [['Moved by beauty. Every time.', 'Blir rørt av det vakre. Hver gang.'], ['Art, music, nature, and making a room beautiful.', 'Kunst, musikk, natur og å gjøre et rom vakkert.']],
  'C3h+O4l': [['Loves routines and keeps their word.', 'Elsker rutiner og holder ord.'], ['Jobs and homes that need someone steady over time.', 'Jobber og hjem som trenger noen stødige over tid.']],
  'C3h+O6l': [['Old values and a firm handshake.', 'Gamle verdier og et fast håndtrykk.'], ['When traditions and promises need someone to keep them.', 'Når tradisjoner og løfter trenger noen som holder dem.']],
  'C1h+O5l': [['Practical and capable. Fixes it instead of discussing it.', 'Praktisk og handlekraftig. Fikser det i stedet for å diskutere det.'], ['When something breaks and needs fixing now.', 'Når noe går i stykker og må fikses nå.']],
  'A3h+E1h': [['Warm and helpful. People feel welcome at once.', 'Varm og hjelpsom. Folk føler seg velkomne med en gang.'], ['Welcoming new people, hosting, and caring jobs.', 'Å ta imot nye folk, være vert og omsorgsyrker.']],
  'C4h+E3h': [['Takes charge and aims high.', 'Tar styringen og sikter høyt.'], ['Leading a team towards a clear goal.', 'Å lede et team mot et tydelig mål.']],
  'E3h+N6l': [['Takes the lead and stays calm.', 'Tar ledelsen og holder roen.'], ['Crises where someone has to decide fast.', 'Kriser der noen må bestemme fort.']],
  'E2h+E6h': [['Social and cheerful. The party starts when they arrive.', 'Selskapelig og blid. Festen starter når de kommer.'], ['Parties, teams and anything that needs a bit of energy.', 'Fester, team og alt som trenger litt energi.']],
  'C5h+E4h': [['Busy and disciplined. Gets an incredible amount done.', 'Travel og disiplinert. Får gjort utrolig mye.'], ['Busy periods with many tasks at once.', 'Travle perioder med mange oppgaver samtidig.']],
  'E1h+E6h': [['Warm and cheerful. Hard not to like.', 'Varm og blid. Vanskelig å ikke like.'], ['First meetings, customer service and new groups.', 'Første møter, kundekontakt og nye grupper.']],
  'E2l+O5h': [['Happy alone with big thoughts.', 'Trives alene med store tanker.'], ['Deep work that needs peace and concentration.', 'Dypt arbeid som trenger ro og konsentrasjon.']],
  'E4l+N6l': [['Unhurried and steady.', 'Har god tid og står støtt.'], ['When things get hectic and someone needs to slow it down.', 'Når det blir hektisk og noen må senke tempoet.']],
  'A4h+E3l': [['Lets others lead and keeps the peace.', 'Lar andre lede og holder freden.'], ['Teams that need glue more than another boss.', 'Team som trenger lim mer enn enda en sjef.']],
  'C6h+E5l': [['Safe and careful. The one who brings the first-aid kit.', 'Trygg og forsiktig. Den som tar med førstehjelpsskrinet.'], ['Safety, planning and looking after others.', 'Sikkerhet, planlegging og å passe på andre.']],
  'A1h+A3h': [['Trusts people and helps them.', 'Stoler på folk og hjelper dem.'], ['Volunteering, mentoring and new colleagues.', 'Frivillig arbeid, mentoring og nye kolleger.']],
  'A2h+C3h': [['Honest and dependable. Their word is enough.', 'Ærlig og pålitelig. Ordet holder.'], ['Money, trust and anything that needs integrity.', 'Penger, tillit og alt som krever integritet.']],
  'A4h+N2l': [['Cooperative and patient. Calms every argument.', 'Samarbeidsvillig og tålmodig. Roer ned enhver krangel.'], ['Conflicts, negotiations and family dinners.', 'Konflikter, forhandlinger og familiemiddager.']],
  'A3h+A6h': [['Feels for others and does something about it.', 'Føler med andre og gjør noe med det.'], ['Care, teaching and being there for a friend.', 'Omsorg, undervisning og å stille opp for en venn.']],
  'A3h+A5h': [['Helps without needing thanks.', 'Hjelper uten å trenge takk.'], ['Work behind the scenes that keeps everything running.', 'Arbeid bak kulissene som får alt til å gå rundt.']],
  'A4l+E3h': [['Direct and takes charge. Says what everyone is thinking.', 'Direkte og tar styringen. Sier det alle tenker.'], ['When a hard decision has to be made and said out loud.', 'Når en vanskelig beslutning må tas og sies høyt.']],
  'A1l+O5h': [['Sceptical and sharp. Checks the sources.', 'Skeptisk og skarp. Sjekker kildene.'], ['Research, analysis and spotting what doesn’t add up.', 'Forskning, analyse og å se det som ikke stemmer.']],
  'A6l+N6l': [['Clear-eyed and steady. Keeps a cool head when others feel too much.', 'Klarsynt og stødig. Holder hodet kaldt når andre kjenner for mye.'], ['Emergencies and hard calls.', 'Nødsituasjoner og tøffe valg.']],
  'A5l+E3h': [['Self-assured and takes charge.', 'Selvsikker og tar styringen.'], ['Pitching, selling and standing up for a team.', 'Å pitche, selge og stå opp for et team.']],
  'E5h+N1l': [['Fearless and up for a thrill.', 'Uredd og spenningssøkende.'], ['Adventure sports, start-ups and bold first moves.', 'Ekstremsport, gründerliv og dristige første trekk.']],
  'C6h+N1h': [['Thinks of what can go wrong, and prepares for it.', 'Tenker på det som kan gå galt, og forbereder seg.'], ['Risk, safety and planning for the unexpected.', 'Risiko, sikkerhet og å planlegge for det uventede.']],
  'N1l+N6l': [['Unflappable and steady. The calm in every storm.', 'Uforskrekket og stødig. Roen i enhver storm.'], ['Crises, deadlines and bumpy flights.', 'Kriser, frister og urolige flyturer.']],
  'E6h+N3l': [['Hopeful and cheerful. Sees the bright side first.', 'Håpefull og blid. Ser lyspunktene først.'], ['Hard days, for yourself and for others.', 'Tunge dager, for deg selv og for andre.']],
  'C1h+N6l': [['Steady and capable. Handles whatever comes.', 'Stødig og handlekraftig. Takler det som kommer.'], ['When something goes wrong and needs handling.', 'Når noe går galt og må håndteres.']],
  'E3h+N4l': [['Unabashed and takes charge. At home on any stage.', 'Frimodig og tar styringen. Hjemme på enhver scene.'], ['Talks, presentations and leading meetings.', 'Foredrag, presentasjoner og å lede møter.']],
  'A6h+N4h': [['Shy and soft-hearted. Notices who is left out.', 'Sjenert og bløthjertet. Ser hvem som står utenfor.'], ['When someone quiet needs a friend.', 'Når noen stille trenger en venn.']],
  'E6h+N5h': [['Enjoys life and laughs a lot.', 'Nyter livet og ler mye.'], ['Dinners, holidays and celebrations.', 'Middager, ferier og feiringer.']],
  'N2h+O6h': [['Fiery and free-thinking. Fights for what matters.', 'Fyrrig og frisinnet. Kjemper for det som betyr noe.'], ['Causes, and speaking up against unfairness.', 'Saker man brenner for, og å si fra mot urettferdighet.']],
  'C1h+N1l': [['Capable and unworried. Just does it.', 'Handlekraftig og bekymringsløs. Bare gjør det.'], ['New jobs and situations without a manual.', 'Nye jobber og situasjoner uten bruksanvisning.']],
  'E5h+O1h': [['Daring and imaginative.', 'Dristig og fantasifull.'], ['Start-ups, new ideas and turning dreams into trips.', 'Gründerliv, nye ideer og å gjøre drømmer om til reiser.']],
  'A1h+E6h': [['Cheerful and trusting. Sees the best in people.', 'Blid og tillitsfull. Ser det beste i folk.'], ['New groups, new colleagues, new neighbours.', 'Nye grupper, nye kolleger, nye naboer.']],
  'A4h+C3h': [['Dependable and cooperative. Everyone’s favourite colleague.', 'Pålitelig og samarbeidsvillig. Alles favorittkollega.'], ['Teams and group projects.', 'Team og gruppeprosjekter.']],
  'O1h+O4h': [['Imaginative and adventurous. Always the next idea, the next place.', 'Fantasifull og eventyrlysten. Alltid neste idé, neste sted.'], ['Travel, change and new beginnings.', 'Reiser, endring og nye begynnelser.']],
  'C4h+O5h': [['Sharp and ambitious.', 'Skarp og ambisiøs.'], ['Studies, research and demanding goals.', 'Studier, forskning og krevende mål.']],
  'A6h+O6h': [['Free-thinking and caring.', 'Frisinnet og omtenksom.'], ['Standing up for people who are treated unfairly.', 'Å stå opp for folk som blir urettferdig behandlet.']],
  'E4h+E5h': [['Busy and daring. Never a dull day.', 'Travel og dristig. Aldri en kjedelig dag.'], ['Events, travel and fast-paced jobs.', 'Arrangementer, reiser og jobber i høyt tempo.']],
  'E1l+O5h': [['Reserved and thoughtful.', 'Reservert og ettertenksom.'], ['Writing, analysis and conversations that go deep.', 'Skriving, analyse og samtaler som går i dybden.']],
  'A3h+C1h': [['Helpful and capable. Fixes it for you.', 'Hjelpsom og handlekraftig. Fikser det for deg.'], ['Moving day, crises and practical help.', 'Flyttedag, kriser og praktisk hjelp.']],
  'C3h+E3h': [['Takes charge and keeps promises.', 'Tar styringen og holder det den lover.'], ['Leading people who need to know where they stand.', 'Å lede folk som trenger å vite hvor de har deg.']],
  'C2l+C6l': [['Spontaneous and relaxed about mess. Life is a jam session.', 'Spontan og avslappet til rot. Livet er en jamsession.'], ['Improvising: when the plan is gone and fun has to happen anyway.', 'Improvisasjon: når planen er borte og det skal bli gøy likevel.']],
  'C4l+N1l': [['Content and unworried.', 'Nøysom og bekymringsløs.'], ['Holidays, weekends, and reminding others to breathe.', 'Ferier, helger og å minne andre på å puste.']],
  'E2l+E5l': [['Homebody and comfort-seeker. Knows what a good evening is.', 'Hjemmekjær og kosemester. Vet hva en god kveld er.'], ['Recharging, and being the calm friend people visit.', 'Å lade opp, og å være den rolige vennen folk kommer på besøk til.']]
};
export {together as togetherLines};

// ---------- the model ----------
const phi = x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
// Normal CDF (Abramowitz–Stegun 7.1.26 erf, error < 1.5e-7), as in the build script.
export const cdf = x => { const t = 1 / (1 + 0.3275911 * Math.abs(x) / Math.SQRT2), y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x / 2); return x >= 0 ? (1 + y) / 2 : (1 - y) / 2; };
// Inverse normal CDF (Acklam), relative error < 1.2e-9.
function quantile(p) {
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const lo = 0.02425;
  if (p < lo) { const q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  if (p > 1 - lo) return -quantile(1 - p);
  const q = p - .5, r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

/** Correlation of two facets in the model: loading² within a trait, loading² × trait correlation across. */
export function facetCorrelation(a, b) {
  const i = ORDER.indexOf(a[0]), j = ORDER.indexOf(b[0]);
  return LOADING * LOADING * (i === j ? 1 : R[i][j]);
}

/** P(X > x, Y > y) for standard normals with correlation rho (Simpson's rule over x). */
export function upperBoth(x, y, rho) {
  const s = Math.sqrt(1 - rho * rho), top = Math.max(x, 0) + 8, n = 400, h = (top - x) / n;
  let sum = 0;
  for (let k = 0; k <= n; k++) {
    const u = x + k * h, w = k === 0 || k === n ? 1 : k % 2 ? 4 : 2;
    sum += w * phi(u) * (1 - cdf((y - rho * u) / s));
  }
  return sum * h / 3;
}

// Share of people at least as far out as this facet score, in its own direction.
const tail = f => Math.min(.5, Math.max(.01, f.band === 'high' ? 1 - f.percentile / 100 : f.percentile / 100));

/** Estimated share of people at least as far out as `a` and `b`, each in its own direction, and how that
 *  compares with two unrelated facets (`lift` below 1: the two rarely go together). */
export function pairShare(a, b) {
  const ta = tail(a), tb = tail(b), sign = (a.band === 'high' ? 1 : -1) * (b.band === 'high' ? 1 : -1);
  const share = upperBoth(quantile(1 - ta), quantile(1 - tb), sign * facetCorrelation(a.code, b.code));
  return {share, lift: share / (ta * tb)};
}

/** «1 av 400» / «7 av 100», the same style as the profile character's rarity. */
export function peopleAmount(share, language) {
  if (share >= 1 / 100) { const x = Math.round(share * 100); return language === 'no' ? `${x} av 100` : `${x} in 100`; }
  const n = roundPeople(1 / share, language);
  return language === 'no' ? `1 av ${n}` : `1 in ${n}`;
}


/**
 * Up to `count` rarest facet pairs for this person, not sharing a facet. Pairs that rarely go together
 * (lift under CONTRAST) come first, since they make the best stories; hand-written pairs get a head start.
 * `skip` holds the facet keys of a pair already told elsewhere (the profile name's own pair).
 */
export function rareCombos(domains, {language = 'en', count = 1, skip = []} = {}) {
  const facets = domains.flatMap(d => d.facets || []).filter(f => Number.isFinite(f.percentile) && f.band && f.band !== 'middle' && !SKIP.has(key(f)));
  const told = skip.length === 2 ? comboKey(...skip) : '';
  const pairs = [];
  for (let i = 0; i < facets.length; i++) for (let j = i + 1; j < facets.length; j++) {
    const [a, b] = [facets[i], facets[j]].sort((x, y) => key(x).localeCompare(key(y)));
    const id = comboKey(key(a), key(b));
    if (id === told) continue;
    const {share, lift} = pairShare(a, b);
    if (share > MAX_SHARE) continue;
    const contrast = lift < CONTRAST, written = Boolean(lines[id]);
    pairs.push({id, a, b, share, lift, contrast, written, score: Math.log(share) - (contrast ? 3 : 0) - (written ? 2.5 : 0)});
  }
  pairs.sort((x, y) => x.score - y.score || x.id.localeCompare(y.id));
  const out = [], used = new Set();
  for (const p of pairs) {
    if (out.length >= count) break;
    if (used.has(p.a.code) || used.has(p.b.code)) continue;
    used.add(p.a.code); used.add(p.b.code);
    out.push({...p, line: p.written ? pick(lines[p.id], language) : '',
      adjectives: [p.a, p.b].map(f => language === 'no' ? words[key(f)][1] : words[key(f)][0].toLowerCase()),
      amount: peopleAmount(p.share, language)});
  }
  return out;
}

/**
 * Up to `count` hand-written facet pairs that work well together (never contrasts), rarest first, not sharing a facet.
 * Each says when the pair shines. Only written pairs are shown: a made-up situation would claim more than we know.
 */
export function strongPairs(domains, {language = 'en', count = 3, taken = []} = {}) {
  const no = language === 'no';
  const facets = domains.flatMap(d => d.facets || []).filter(f => Number.isFinite(f.percentile) && f.band && f.band !== 'middle' && !SKIP.has(key(f)));
  const pairs = [];
  for (let i = 0; i < facets.length; i++) for (let j = i + 1; j < facets.length; j++) {
    const [a, b] = [facets[i], facets[j]].sort((x, y) => key(x).localeCompare(key(y)));
    const id = comboKey(key(a), key(b)), {share, lift} = pairShare(a, b);
    if (!together[id] || share > MAX_TOGETHER || lift < CONTRAST) continue;
    pairs.push({id, a, b, share, lift, written: true, score: Math.log(share)});
  }
  pairs.sort((x, y) => x.score - y.score || x.id.localeCompare(y.id));
  const out = [], used = new Set(taken);
  for (const p of pairs) {
    if (out.length >= count) break;
    if (used.has(p.a.code) || used.has(p.b.code)) continue;
    used.add(p.a.code); used.add(p.b.code);
    const t = together[p.id];
    out.push({...p, adjectives: [p.a, p.b].map(f => no ? words[key(f)][1] : words[key(f)][0].toLowerCase()), amount: peopleAmount(p.share, language),
      line: pick(t[0], language), when: pick(t[1], language)});
  }
  return out;
}

/** The one combo the free profile and the share video show; a signature name's own pair is already told. */
export function freeCombo(domains, language) {
  const named = profileName(domains, language);
  return rareCombos(domains, {language, skip: named.line ? named.facets.map(key) : []})[0] || null;
}

/** The report chapter: up to three contrasts and three pairs that work well together. */
export function comboChapter(domains, language) {
  // Facets already in a contrast are left out of the second list when other pairs are there, so the chapter shows more of the profile.
  const contrasts = rareCombos(domains, {language, count: 3}).filter(c => c.contrast), taken = contrasts.flatMap(c => [c.a.code, c.b.code]);
  const fresh = strongPairs(domains, {language, count: 3, taken});
  return {contrasts, together: fresh.length >= 2 ? fresh : strongPairs(domains, {language, count: 3})};
}
