// Five levels for the trait cards in Work & career and Everyday life, matching the facet cards:
// veryLow below the 10th percentile, low 10–30, middle 30–70, high 70–90, veryHigh above 90.
// context-copy.js holds the low / middle / high cards; this file adds the two outer cards and,
// for every level, a short list of strengths and things that can be harder.
// Each item is "English|Norsk". Editorial reflection text in «kan/trolig» form, not validated claims.

const card = (quote, text, tryIt) => ({quote: quote.split('|'), text: text.split('|'), try: tryIt.split('|')});

export const outerCards = {
  O: {
    work: {
      veryHigh: card('You see possibilities where others see a finished map.|Du ser muligheter der andre ser et ferdig kart.',
        'You are strongly drawn to new ideas, experiments and unsolved problems, often more than almost anyone around you. Work that lets you rethink and invent can give you a lot of energy. Routine tasks and fixed procedures can feel like a cage, and you may start new things before the old ones are finished.|Du trekkes sterkt mot nye ideer, eksperimenter og uløste problemer, ofte mer enn nesten alle rundt deg. Arbeid der du får tenke nytt og finne opp, kan gi deg mye energi. Rutineoppgaver og faste prosedyrer kan kjennes som et bur, og du kan begynne på nye ting før de gamle er ferdige.',
        'Before you start your next new idea, finish or hand over one that is already underway.|Før du starter på neste nye idé: fullfør eller overlat én som allerede er i gang.'),
      veryLow: card('If it works, you leave it alone.|Det som virker, lar du være i fred.',
        'You clearly prefer what is tested, concrete and practical. You are often the one who keeps the work stable when others want to change everything at once. Big changes and abstract discussions can feel like a waste of time, and you risk saying no to an improvement before you have seen it work.|Du foretrekker tydelig det utprøvde, konkrete og praktiske. Ofte er det du som holder arbeidet stabilt når andre vil endre alt på en gang. Store endringer og abstrakte diskusjoner kan kjennes som bortkastet tid, og du kan risikere å si nei til en forbedring før du har sett den virke.',
        'Ask to see one new method in practice before you judge it, and agree on what result would convince you.|Be om å se én ny metode i praksis før du vurderer den, og bli enige om hvilket resultat som ville overbevist deg.')
    },
    life: {
      veryHigh: card('Your curiosity never takes a day off.|Nysgjerrigheten din tar aldri fri.',
        'You probably seek out new places, ideas, art and experiences more than almost anyone. Life rarely gets boring for you. The flip side is that everyday routines can feel heavy, and you may lose interest in plans that are no longer new.|Du oppsøker trolig nye steder, ideer, kunst og opplevelser mer enn nesten alle andre. Livet blir sjelden kjedelig for deg. Baksiden er at hverdagsrutiner kan kjennes tunge, og at du kan miste interessen for planer som ikke lenger er nye.',
        'Pick one habit you dropped because it got boring, and give it a small new twist instead of quitting.|Velg én vane du sluttet med fordi den ble kjedelig, og gi den en liten vri i stedet for å gi opp.'),
      veryLow: card('Home is where you know where everything is.|Hjemme er der du vet hvor alt står.',
        'You find real calm in the familiar: the same places, traditions and ways of doing things. That gives you and the people around you a steady base. You may turn down new experiences before trying them, and someone close to you may want more variety than you do.|Du finner ekte ro i det kjente: de samme stedene, tradisjonene og måtene å gjøre ting på. Det gir deg og folk rundt deg et stødig fundament. Du kan takke nei til nye opplevelser før du har prøvd dem, og noen nær deg kan ønske mer variasjon enn du gjør.',
        'Say yes to one small new thing someone close to you suggests, and decide afterwards whether it was worth it.|Si ja til én liten ny ting som en nær deg foreslår, og bestem etterpå om det var verdt det.')
    }
  },
  C: {
    work: {
      veryHigh: card('Your to-do list has its own to-do list.|Huskelista di har sin egen huskeliste.',
        'You plan, follow up and finish more thoroughly than almost anyone. People can rely completely on what you deliver. You may find it hard to let go of details, set the bar so high that it costs you rest, or get frustrated when others are more relaxed.|Du planlegger, følger opp og fullfører grundigere enn nesten alle andre. Folk kan stole helt på det du leverer. Du kan ha vanskelig for å slippe detaljer, legge lista så høyt at det koster deg hvile, eller bli frustrert når andre er mer avslappet.',
        'Choose one task this week that only needs to be good enough, and stop when it is.|Velg én oppgave denne uken som bare trenger å være god nok, og stopp når den er det.'),
      veryLow: card('You start the engine before reading the manual.|Du starter motoren før du leser bruksanvisningen.',
        'You work best in motion and can handle change and chaos that would stop others. You often get going quickly. Deadlines, details and follow-up can slip, and colleagues may have to pick up loose ends after you.|Du jobber best i bevegelse og takler endringer og kaos som ville stoppet andre. Du kommer ofte raskt i gang. Frister, detaljer og oppfølging kan skli, og kolleger kan måtte plukke opp løse tråder etter deg.',
        'Use one simple tool for deadlines, like a calendar reminder, for the next three things you promise someone.|Bruk ett enkelt verktøy for frister, som en påminnelse i kalenderen, for de tre neste tingene du lover noen.')
    },
    life: {
      veryHigh: card('Everything has its place, even spontaneity.|Alt har sin plass, også spontaniteten.',
        'Order, plans and routines probably mean more to you than to almost anyone. Your home and your week often run like clockwork. Unplanned changes can feel very uncomfortable, and you may find it hard to relax before everything is done.|Orden, planer og rutiner betyr trolig mer for deg enn for nesten alle andre. Hjemmet og uka di går ofte som et urverk. Uplanlagte endringer kan kjennes svært ubehagelige, og det kan være vanskelig å slappe av før alt er gjort.',
        'Leave one chore undone on purpose this weekend, and notice what actually happens.|La ett gjøremål stå ugjort med vilje i helgen, og legg merke til hva som faktisk skjer.'),
      veryLow: card('You live in the moment, and the moment is usually now.|Du lever i øyeblikket, og øyeblikket er som regel nå.',
        'You are probably flexible, spontaneous and good at making the best of whatever happens. Others may find you relaxed and easy to be around. Bills, appointments and chores can pile up, and the people closest to you may end up carrying more of the planning.|Du er trolig fleksibel, spontan og flink til å gjøre det beste ut av det som skjer. Andre kan oppleve deg som avslappet og lett å være sammen med. Regninger, avtaler og gjøremål kan hope seg opp, og de nærmeste kan ende opp med å bære mer av planleggingen.',
        'Choose one thing that keeps slipping, like bills, and set up an automatic solution for it.|Velg én ting som stadig glipper, som regninger, og lag en automatisk løsning for den.')
    }
  },
  E: {
    work: {
      veryHigh: card('You turn a meeting into a meeting place.|Du gjør et møte til en møteplass.',
        'You get a lot of energy from people, pace and talking things through, more than almost anyone. You can lift a team and make things happen quickly. You may take up more space than you notice, and quiet, solitary tasks can drain you fast.|Du får mye energi av folk, tempo og å snakke ting gjennom, mer enn nesten alle andre. Du kan løfte et team og få ting til å skje raskt. Du kan ta mer plass enn du merker, og stille alenearbeid kan tappe deg fort.',
        'In your next meeting, ask three questions before you give your own view.|Still tre spørsmål før du sier din egen mening i neste møte.'),
      veryLow: card('Your best thoughts arrive when the door is closed.|De beste tankene dine kommer når døra er lukket.',
        'You do your best work with peace, depth and few interruptions. You often notice what others miss because you are not busy talking. Meetings, networking and open offices can cost you a lot, and others may not know what you think unless you say it.|Du gjør ditt beste arbeid med ro, dybde og få avbrytelser. Du legger ofte merke til det andre overser, fordi du ikke er opptatt med å snakke. Møter, nettverksbygging og åpne landskap kan koste deg mye, og andre vet kanskje ikke hva du mener med mindre du sier det.',
        'Share one idea in writing with your team this week, before anyone asks.|Del én idé skriftlig med teamet denne uken, før noen spør.')
    },
    life: {
      veryHigh: card('Nobody stays a stranger to you for long.|Ingen er fremmede for deg lenge.',
        'You probably love having people around you and plans on the go, more than almost anyone. Life around you is rarely dull. Quiet weekends can feel empty, and you may say yes to so much that rest and close relationships get less room.|Du elsker trolig å ha folk rundt deg og planer på gang, mer enn nesten alle andre. Livet rundt deg er sjelden kjedelig. Rolige helger kan kjennes tomme, og du kan si ja til så mye at hvile og nære relasjoner får mindre plass.',
        'Plan one evening this week with just one person you care about.|Planlegg én kveld denne uka med bare én person du er glad i.'),
      veryLow: card('Your idea of a good party has three guests.|Din idé om en god fest har tre gjester.',
        'You probably need a lot of quiet and time alone to feel good, more than almost anyone. Your relationships are often few and deep. Big gatherings can feel like hard work, and people may mistake your need for quiet for a lack of interest.|Du trenger trolig mye ro og tid alene for å ha det bra, mer enn nesten alle andre. Relasjonene dine er ofte få og dype. Store sammenkomster kan kjennes som hardt arbeid, og folk kan forveksle behovet ditt for ro med manglende interesse.',
        'Tell someone close to you, in one sentence, that quiet is how you recharge, not a sign that something is wrong.|Si til en nær deg, i én setning, at ro er måten du lader på, ikke et tegn på at noe er galt.')
    }
  },
  A: {
    work: {
      veryHigh: card('You make the day easier for everyone, sometimes except yourself.|Du gjør dagen lettere for alle, av og til unntatt deg selv.',
        'You are very considerate, helpful and keen to keep the peace, more than almost anyone. People trust you and like working with you. You may find it very hard to say no, take on too much, and avoid conflicts that would be better faced.|Du er svært omtenksom, hjelpsom og opptatt av å holde fred, mer enn nesten alle andre. Folk stoler på deg og liker å jobbe med deg. Du kan ha svært vanskelig for å si nei, ta på deg for mye og unngå konflikter som hadde vært bedre å ta.',
        'Before you say yes to the next request, say “let me check and get back to you”.|Før du sier ja til neste forespørsel, si «jeg sjekker og kommer tilbake til deg».'),
      veryLow: card('You put the matter before the mood.|Du setter saken foran stemningen.',
        'You are very direct, competitive and hard to push around, more than almost anyone. You can drive through tough decisions and say what others avoid. Colleagues may experience you as harsh or hard to work with, even when you are right about the matter.|Du er svært direkte, konkurranseinnstilt og vanskelig å presse, mer enn nesten alle andre. Du kan drive gjennom tøffe beslutninger og si det andre unngår. Kolleger kan oppleve deg som hard eller vanskelig å samarbeide med, selv når du har rett i saken.',
        'In your next disagreement, repeat the other person’s point in your own words before you answer.|I neste uenighet: gjenta den andres poeng med egne ord før du svarer.')
    },
    life: {
      veryHigh: card('You have a chair for everyone, and sometimes forget your own.|Du har en stol til alle, og glemmer av og til din egen.',
        'You probably care deeply about others and do a lot to make them feel good, more than almost anyone. People feel safe with you. Your own needs can disappear, and others may sometimes take more than they give.|Du bryr deg trolig dypt om andre og gjør mye for at de skal ha det bra, mer enn nesten alle andre. Folk føler seg trygge hos deg. Dine egne behov kan forsvinne, og andre kan av og til ta mer enn de gir.',
        'Ask for help with one thing this week, even if you could manage it yourself.|Be om hjelp med én ting denne uka, selv om du kunne klart det selv.'),
      veryLow: card('You would rather be honest than easy.|Du vil heller være ærlig enn lettvint.',
        'You probably say what you mean and stand up for yourself more clearly than almost anyone. People never have to guess where they stand with you. In close relationships your directness can hurt more than you intend, and others may hold back with you.|Du sier trolig det du mener og står opp for deg selv tydeligere enn nesten alle andre. Folk trenger aldri å gjette hvor de har deg. I nære relasjoner kan direktheten såre mer enn du mener, og andre kan holde tilbake overfor deg.',
        'Once this week, ask how something you said came across, and just listen to the answer.|Spør én gang denne uka hvordan noe du sa ble tatt imot, og bare lytt til svaret.')
    }
  },
  N: {
    work: {
      veryHigh: card('You feel the weather turn long before it rains.|Du kjenner at været snur lenge før det regner.',
        'You react strongly to pressure, criticism and uncertainty, more than almost anyone. That can make you very alert to problems others miss. Stress at work can take a lot of energy, and worries may follow you home after the working day.|Du reagerer sterkt på press, kritikk og usikkerhet, mer enn nesten alle andre. Det kan gjøre deg svært oppmerksom på problemer andre overser. Stress på jobben kan ta mye energi, og bekymringer kan bli med deg hjem etter arbeidsdagen.',
        'Set one fixed time to stop each day, and write down tomorrow’s first step before you leave.|Bestem ett fast tidspunkt å slutte hver dag, og skriv ned morgendagens første steg før du går.'),
      veryLow: card('Your pulse stays the same when the deadline moves.|Pulsen din er den samme når fristen flyttes.',
        'You stay calm under pressure, criticism and setbacks, more than almost anyone. Others can lean on you when things get tough. You may miss warning signs that others feel, and seem unaffected when colleagues are struggling.|Du holder deg rolig under press, kritikk og tilbakeslag, mer enn nesten alle andre. Andre kan støtte seg på deg når det blir tøft. Du kan overse varseltegn som andre kjenner, og virke uberørt når kolleger sliter.',
        'Ask one colleague how the workload feels for them right now.|Spør én kollega hvordan arbeidsmengden kjennes for dem akkurat nå.')
    },
    life: {
      veryHigh: card('You feel everything at full volume.|Du kjenner alt på full styrke.',
        'You probably feel joy, worry and stress very strongly, more than almost anyone. That can make you deeply caring and aware of others. Everyday setbacks can knock you off balance for a while, and a few fixed things that calm you can help.|Du kjenner trolig glede, bekymring og stress svært sterkt, mer enn nesten alle andre. Det kan gjøre deg dypt omtenksom og oppmerksom på andre. Hverdagens tilbakeslag kan slå deg ut av balanse en stund, og noen faste ting som roer deg, kan hjelpe.',
        'Make a short list of three things that calm you, and keep it on your phone for a hard day.|Lag en kort liste med tre ting som roer deg, og ha den på telefonen til en tung dag.'),
      veryLow: card('It takes a lot to rock your boat.|Det skal mye til for å vippe båten din.',
        'You probably take worries, setbacks and stress very calmly, more than almost anyone. You can be a safe harbour for others. It can be hard to understand why others get upset, and they may feel you do not take their worries seriously.|Du tar trolig bekymringer, tilbakeslag og stress svært rolig, mer enn nesten alle andre. Du kan være en trygg havn for andre. Det kan være vanskelig å forstå hvorfor andre blir urolige, og de kan føle at du ikke tar bekymringene deres på alvor.',
        'Next time someone is worried, say “that sounds hard” before anything else.|Neste gang noen er bekymret, si «det høres tungt ut» før du sier noe annet.')
    }
  }
};

// [good, hard] per level; each list holds three "English|Norsk" items.
const L = (good, hard) => ({good: good.map(s => s.split('|')), hard: hard.map(s => s.split('|'))});

export const strengthLists = {
  O: {
    work: {
      veryLow: L(['Holds a steady course when others chase trends|Holder stø kurs når andre jager trender', 'Practical, tested solutions|Praktiske, utprøvde løsninger', 'Makes processes reliable|Gjør prosesser pålitelige'],
        ['Can reject new ideas too early|Kan avvise nye ideer for tidlig', 'Big changes cost a lot of energy|Store endringer koster mye energi', 'Abstract discussions feel pointless|Abstrakte diskusjoner kjennes meningsløse']),
      low: L(['Asks whether it will actually work|Spør om det faktisk vil virke', 'Concrete and realistic|Konkret og realistisk', 'Values proven methods|Verdsetter utprøvde metoder'],
        ['Needs time before changes settle|Trenger tid før endringer sitter', 'May miss better ways of working|Kan gå glipp av bedre måter å jobbe på', 'Less keen on brainstorming|Mindre glad i idémyldring']),
      middle: L(['Bridges the new and the proven|Bygger bro mellom nytt og utprøvd', 'Open when a change has a purpose|Åpen når en endring har et formål', 'Adapts to the task|Tilpasser deg oppgaven'],
        ['Rarely the one who pushes for new ideas|Sjelden den som presser på for nye ideer', 'Rarely the one who defends the old either|Sjelden den som forsvarer det gamle heller', 'Can wait to see which way the wind blows|Kan vente og se hvor vinden blåser']),
      high: L(['Sees new angles|Ser nye vinkler', 'Enjoys solving what is unsolved|Liker å løse det uløste', 'Improves how things are done|Forbedrer måten ting gjøres på'],
        ['Routine work drains you quickly|Rutinearbeid tapper deg fort', 'Can lose interest once it gets familiar|Kan miste interessen når det blir kjent', 'Ideas can run ahead of the plan|Ideene kan løpe fra planen']),
      veryHigh: L(['Invents where others copy|Finner opp der andre kopierer', 'Connects ideas far apart|Kobler ideer som ligger langt fra hverandre', 'Thrives in the unknown|Trives i det ukjente'],
        ['Starts more than you finish|Starter mer enn du fullfører', 'Fixed procedures feel like a cage|Faste prosedyrer kjennes som et bur', 'Others may struggle to keep up|Andre kan slite med å henge med'])
    },
    life: {
      veryLow: L(['Traditions others can lean on|Tradisjoner andre kan støtte seg på', 'Knows what makes you happy|Vet hva som gjør deg glad', 'Finds calm in the familiar|Finner ro i det kjente'],
        ['Says no before trying|Sier nei før du har prøvd', 'Can feel stuck when life changes|Kan føle deg fastlåst når livet endrer seg', 'People close to you may want more variety|De nærmeste kan ønske mer variasjon']),
      low: L(['Down to earth|Jordnær', 'Enjoys practical tasks|Liker praktiske gjøremål', 'Loyal to good habits|Trofast mot gode vaner'],
        ['New things must earn their place|Nye ting må gjøre seg fortjent til plassen', 'May miss out on experiences|Kan gå glipp av opplevelser', 'Changes take time to accept|Endringer tar tid å godta']),
      middle: L(['Likes both habits and new things|Liker både vaner og nye ting', 'Open without being restless|Åpen uten å bli rastløs', 'Stable without being rigid|Stabil uten å være rigid'],
        ['Can slide into comfortable routines|Kan gli inn i behagelige rutiner', 'New things need a nudge|Nye ting trenger et dytt', 'Not always sure which you want more|Ikke alltid sikker på hva du vil mest']),
      high: L(['A rich inner life|Et rikt indre liv', 'Loves books, places and ideas|Elsker bøker, steder og ideer', 'Makes everyday life interesting|Gjør hverdagen interessant'],
        ['Routines can feel tight|Rutiner kan føles trange', 'Restless when the weeks repeat|Rastløs når ukene gjentar seg', 'Practical chores can feel dull|Praktiske gjøremål kan kjennes kjedelige']),
      veryHigh: L(['Rarely bored for long|Kjeder deg sjelden lenge', 'Sees beauty and meaning everywhere|Ser skjønnhet og mening overalt', 'Inspires others to try new things|Inspirerer andre til å prøve nytt'],
        ['Everyday routines can feel heavy|Hverdagsrutiner kan kjennes tunge', 'Drops plans that are no longer new|Slipper planer som ikke lenger er nye', 'Can feel out of step with others|Kan føle deg i utakt med andre'])
    }
  },
  C: {
    work: {
      veryLow: L(['Gets going fast|Kommer raskt i gang', 'Handles chaos and change|Takler kaos og endring', 'Improvises when plans fall apart|Improviserer når planer ryker'],
        ['Deadlines and details slip|Frister og detaljer glipper', 'Others may pick up your loose ends|Andre kan måtte plukke opp løse tråder', 'Long processes feel very heavy|Lange prosesser kjennes svært tunge']),
      low: L(['Flexible|Fleksibel', 'Quick to try things|Rask til å prøve', 'Comfortable with loose plans|Trygg med løse planer'],
        ['Can put off the boring parts|Kan utsette de kjedelige delene', 'Checklists feel binding|Sjekklister kjennes bindende', 'Follow-up may need reminders|Oppfølging kan trenge påminnelser']),
      middle: L(['Plans when a lot is at stake|Planlegger når mye står på spill', 'Improvises when it is not|Improviserer når det ikke gjør det', 'Adjusts to the terrain|Tilpasser deg terrenget'],
        ['Not always aware which mode you are in|Merker ikke alltid hvilken modus du er i', 'Can plan too little for big tasks|Kan planlegge for lite for store oppgaver', 'Or too much for small ones|Eller for mye for små']),
      high: L(['Reliable|Pålitelig', 'Notices early when a plan slips|Merker tidlig når en plan skrider', 'Finishes what you start|Fullfører det du begynner på'],
        ['Frequent changes cost energy|Hyppige endringer koster energi', 'Can be hard on yourself|Kan være streng mot deg selv', 'Others’ looseness can frustrate you|Andres løse stil kan frustrere deg']),
      veryHigh: L(['Delivers exactly as agreed|Leverer til punkt og prikke', 'Others can count on you completely|Andre kan stole helt på deg', 'Strong drive and discipline|Sterk driv og disiplin'],
        ['Hard to let go of details|Vanskelig å slippe detaljer', 'The bar can be set too high|Lista kan bli lagt for høyt', 'Rest comes last|Hvilen kommer sist'])
    },
    life: {
      veryLow: L(['Relaxed and easy to be around|Avslappet og lett å være sammen med', 'Spontaneous|Spontan', 'Makes the best of whatever happens|Gjør det beste ut av det som skjer'],
        ['Bills and appointments pile up|Regninger og avtaler hoper seg opp', 'Others may carry the planning|Andre kan ende opp med planleggingen', 'Good intentions can stay intentions|Gode forsetter kan forbli forsetter']),
      low: L(['Takes things as they come|Tar ting som de kommer', 'Easy-going when plans fall apart|Grei når planer ryker', 'Not stressed by mess|Stresser ikke av rot'],
        ['Chores can sneak up on you|Gjøremål kan snike seg innpå deg', 'Habits are hard to keep|Vaner er vanskelige å holde', 'Deadlines come as a surprise|Frister kommer overraskende']),
      middle: L(['Keeps track of what matters|Har oversikt over det som betyr noe', 'Spontaneous at the weekend|Spontan i helgene', 'Structured when needed|Strukturert når det trengs'],
        ['Some areas get less order|Noen områder får mindre orden', 'New habits need a push|Nye vaner trenger et dytt', 'Things can be left half-done|Ting kan bli stående halvferdige']),
      high: L(['Keeps your promises|Holder det du lover', 'Finds calm in order|Finner ro i orden', 'Follows through on plans|Gjennomfører planer'],
        ['Sudden changes are hard to enjoy|Plutselige endringer er vanskelige å nyte', 'Hard to relax before it is done|Vanskelig å slappe av før alt er gjort', 'Can expect the same of others|Kan forvente det samme av andre']),
      veryHigh: L(['Home and week run like clockwork|Hjem og uke går som et urverk', 'Others feel safe with your planning|Andre føler seg trygge med planleggingen din', 'Strong self-control|Sterk selvkontroll'],
        ['Unplanned things feel very uncomfortable|Uplanlagte ting kjennes svært ubehagelige', 'Rest can feel like another task|Hvile kan kjennes som enda en oppgave', 'Others may feel managed|Andre kan føle seg styrt'])
    }
  },
  E: {
    work: {
      veryLow: L(['Deep focus|Dyp konsentrasjon', 'Notices what others miss|Ser det andre overser', 'Thinks before speaking|Tenker før du snakker'],
        ['Meetings and networking cost a lot|Møter og nettverksbygging koster mye', 'Your ideas may go unheard|Ideene dine kan forbli uhørt', 'Open offices drain you fast|Åpne landskap tapper deg fort']),
      low: L(['Works well alone|Jobber godt alene', 'Listens well|Lytter godt', 'Well-prepared input|Godt forberedte innspill'],
        ['Back-to-back meetings drain you|Møter på rad tapper deg', 'Can be overlooked in loud groups|Kan bli oversett i høylytte grupper', 'Promoting yourself feels uncomfortable|Å fremheve deg selv kjennes ubehagelig']),
      middle: L(['Enjoys both teamwork and solo work|Trives med både samarbeid og alenearbeid', 'Speaks up when it matters|Tar ordet når det trengs', 'Does not need to fill every silence|Trenger ikke fylle hver stillhet'],
        ['Not always aware what drains you|Merker ikke alltid hva som tapper deg', 'Can end up in too many meetings|Kan havne i for mange møter', 'Or too much time alone|Eller for mye tid alene']),
      high: L(['Brings energy|Gir energi', 'Gets discussions going|Får i gang diskusjoner', 'Makes newcomers feel welcome|Får nye til å føle seg velkomne'],
        ['Long stretches alone drain you|Lange perioder alene tapper deg', 'Can speak before others have finished thinking|Kan snakke før andre har tenkt ferdig', 'Quiet colleagues may get less room|Stille kolleger kan få mindre plass']),
      veryHigh: L(['Lifts the whole team|Løfter hele teamet', 'Makes things happen fast|Får ting til å skje raskt', 'A natural networker|En naturlig nettverksbygger'],
        ['Takes more space than you notice|Tar mer plass enn du merker', 'Quiet tasks drain you fast|Stille oppgaver tapper deg fort', 'Can decide before listening|Kan bestemme før du har lyttet'])
    },
    life: {
      veryLow: L(['Few but deep relationships|Få, men dype relasjoner', 'Happy in your own company|Trives i ditt eget selskap', 'A calm presence|Et rolig nærvær'],
        ['Big gatherings feel like hard work|Store sammenkomster kjennes som hardt arbeid', 'Quiet can be mistaken for disinterest|Ro kan forveksles med manglende interesse', 'Can drift from friends without noticing|Kan gli fra venner uten å merke det']),
      low: L(['Values close friends|Verdsetter nære venner', 'Good one to one|God på tomannshånd', 'Recharges in quiet|Lader i stillhet'],
        ['Large events cost energy|Store arrangementer koster energi', 'New people take time|Nye folk tar tid', 'May say no to more than you want to|Kan si nei til mer enn du egentlig vil']),
      middle: L(['Enjoys both parties and quiet evenings|Liker både fest og rolige kvelder', 'Adapts to the company|Tilpasser deg selskapet', 'Balanced social energy|Balansert sosial energi'],
        ['Can say yes or no out of habit|Kan si ja eller nei av vane', 'Not always sure what you need this week|Ikke alltid sikker på hva du trenger denne uka', 'Energy can run out unexpectedly|Energien kan ta slutt uventet']),
      high: L(['Brings people together|Samler folk', 'Gets plans going|Får planer i gang', 'Lively and warm|Livlig og varm'],
        ['Quiet weeks feel long|Rolige uker kjennes lange', 'Can overbook yourself|Kan booke deg for fullt', 'Others may need more space|Andre kan trenge mer rom']),
      veryHigh: L(['Never short of company|Mangler aldri selskap', 'Makes life around you lively|Gjør livet rundt deg livlig', 'Connects easily with strangers|Får lett kontakt med fremmede'],
        ['Quiet weekends feel empty|Rolige helger kjennes tomme', 'Rest gets too little room|Hvile får for lite plass', 'Close relationships can get less time|Nære relasjoner kan få mindre tid'])
    }
  },
  A: {
    work: {
      veryLow: L(['Says what others avoid|Sier det andre unngår', 'Drives through tough decisions|Driver gjennom tøffe beslutninger', 'Hard to push around|Vanskelig å presse'],
        ['Can come across as harsh|Kan oppleves som hard', 'Cooperation can suffer|Samarbeidet kan lide', 'Others may stop sharing ideas|Andre kan slutte å dele ideer']),
      low: L(['Direct|Direkte', 'Challenges weak ideas|Utfordrer svake ideer', 'Stands up for your view|Står for ditt syn'],
        ['Directness lands harder than meant|Direktheten treffer hardere enn ment', 'Can win the argument and lose an ally|Kan vinne diskusjonen og miste en støttespiller', 'Praise may be rare|Ros kan bli sjelden']),
      middle: L(['Both kind and honest|Både vennlig og ærlig', 'Cooperates, and disagrees when needed|Samarbeider, og sier imot når det trengs', 'Trusted by different kinds of people|Får tillit fra ulike folk'],
        ['May avoid a conflict that is needed|Kan unngå en konflikt som trengs', 'Or push when you should listen|Eller presse når du burde lytte', 'Others cannot always tell which you will do|Andre vet ikke alltid hva du vil gjøre']),
      high: L(['The glue in the team|Limet i teamet', 'Helps without being asked|Hjelper uten å bli spurt', 'Easy to come to|Lett å komme til'],
        ['Hard to stand your ground|Vanskelig å stå på ditt', 'Can take on others’ tasks|Kan ta på deg andres oppgaver', 'Negotiations cost a lot|Forhandlinger koster mye']),
      veryHigh: L(['Deeply trusted|Har stor tillit', 'Creates a safe atmosphere|Skaper et trygt miljø', 'Sees what others need|Ser hva andre trenger'],
        ['Very hard to say no|Svært vanskelig å si nei', 'Takes on too much|Tar på deg for mye', 'Avoids conflicts that should be faced|Unngår konflikter som burde tas'])
    },
    life: {
      veryLow: L(['Honest when it counts|Ærlig når det gjelder', 'Stands up for yourself|Står opp for deg selv', 'People know where they stand|Folk vet hvor de har deg'],
        ['Can hurt more than you intend|Kan såre mer enn du mener', 'Others may hold back with you|Andre kan holde tilbake overfor deg', 'Hard to give way, even on small things|Vanskelig å gi etter, også i små ting']),
      low: L(['Says what you mean|Sier det du mener', 'Not easily fooled|Lar deg ikke lett lure', 'Keeps your own needs in view|Har egne behov i sikte'],
        ['Others may want a gentler start|Andre kan ønske en mykere start', 'Can seem sceptical|Kan virke skeptisk', 'Comfort may come out as advice|Trøst kan komme ut som råd']),
      middle: L(['Generous, but no doormat|Raus, men ingen dørmatte', 'Considerate and looks after yourself|Omtenksom og tar vare på deg selv', 'Adjusts without always giving in|Tilpasser deg uten alltid å gi etter'],
        ['May give way in the wrong places|Kan gi etter på feil steder', 'Or stand firm when it is not worth it|Eller stå på ditt når det ikke er verdt det', 'Mixed signals to people close to you|Blandede signaler til de nærmeste']),
      high: L(['Caring|Omsorgsfull', 'Others come to you for support|Andre kommer til deg for støtte', 'Creates warmth around you|Skaper varme rundt deg'],
        ['Your own needs end up last|Egne behov havner sist', 'Hard to disagree|Vanskelig å være uenig', 'Can be taken for granted|Kan bli tatt for gitt']),
      veryHigh: L(['People feel safe with you|Folk føler seg trygge hos deg', 'Generous with time and care|Raus med tid og omsorg', 'Forgives easily|Tilgir lett'],
        ['Your own needs can disappear|Egne behov kan forsvinne', 'Others may take more than they give|Andre kan ta mer enn de gir', 'Hard to set limits|Vanskelig å sette grenser'])
    }
  },
  // N: higher means more emotional reactivity.
  N: {
    work: {
      veryLow: L(['Calm under pressure|Rolig under press', 'Others lean on you|Andre støtter seg på deg', 'Recovers fast from setbacks|Kommer raskt over tilbakeslag'],
        ['May miss warning signs|Kan overse varseltegn', 'Can seem unaffected|Kan virke uberørt', 'Others’ stress can be hard to grasp|Andres stress kan være vanskelig å forstå']),
      low: L(['Steady when deadlines tighten|Stødig når fristene strammes', 'Reassuring to work with|Betryggende å jobbe med', 'Takes criticism calmly|Tar kritikk med ro'],
        ['Can underestimate risks|Kan undervurdere risiko', 'May not notice colleagues struggling|Merker ikke alltid at kolleger sliter', 'Can seem relaxed when others want urgency|Kan virke avslappet når andre vil ha fart']),
      middle: L(['Feels pressure without being overwhelmed|Kjenner press uten å bli overveldet', 'Stress gives you useful clues|Stresset gir deg nyttige hint', 'Finds your footing again|Finner fotfestet igjen'],
        ['Some situations get to you more|Noen situasjoner går mer innpå deg', 'Stress can build up unnoticed|Stress kan bygge seg opp ubemerket', 'Heavy periods take their toll|Tunge perioder tar på']),
      high: L(['Spots risks early|Ser risiko tidlig', 'Careful and thorough|Nøye og grundig', 'Takes things seriously|Tar ting på alvor'],
        ['Worries take up room|Bekymringer tar plass', 'Criticism can sting|Kritikk kan svi', 'High pressure drains you fast|Høyt press tapper deg fort']),
      veryHigh: L(['Very alert to problems|Svært oppmerksom på problemer', 'Senses when something is off|Kjenner når noe er galt', 'Cares a lot about doing well|Bryr deg mye om å gjøre det bra'],
        ['Stress takes a lot of energy|Stress tar mye energi', 'Worries follow you home|Bekymringer blir med deg hjem', 'Setbacks can feel bigger than they are|Tilbakeslag kan kjennes større enn de er'])
    },
    life: {
      veryLow: L(['A safe harbour for others|En trygg havn for andre', 'Unbothered by small hassles|Uberørt av småplager', 'Bounces back quickly|Kommer deg raskt'],
        ['Others’ worries can seem overblown|Andres bekymringer kan virke overdrevne', 'Can seem unmoved|Kan virke uberørt', 'Can brush feelings aside too quickly|Kan avfeie følelser for raskt']),
      low: L(['Takes everyday stress calmly|Tar hverdagsstress med ro', 'A calm that supports others|En ro som støtter andre', 'Recovers quickly|Kommer deg raskt'],
        ['Others may need more time than you|Andre kan trenge mer tid enn deg', 'Can reassure too soon|Kan berolige for tidlig', 'May underestimate your own strain|Kan undervurdere din egen belastning']),
      middle: L(['Reacts, and recovers|Reagerer, og kommer deg igjen', 'Notices what drains you|Merker hva som tapper deg', 'Mostly steady|Stort sett stødig'],
        ['Some situations get to you|Noen situasjoner går innpå deg', 'Ups and downs can come in clusters|Opp- og nedturer kan komme i klynger', 'Can forget what helps|Kan glemme hva som hjelper']),
      high: L(['Feels deeply|Kjenner dypt', 'Empathetic|Empatisk', 'Attentive to the people you love|Oppmerksom på dem du er glad i'],
        ['Worries can take over|Bekymringer kan ta over', 'Needs time to land|Trenger tid til å lande', 'Many demands at once can be too much|Mange krav samtidig kan bli for mye']),
      veryHigh: L(['Very aware of others’ feelings|Svært var for andres følelser', 'Feels joy strongly|Kjenner glede sterkt', 'Deep care for others|Dyp omtanke for andre'],
        ['Setbacks knock you off balance|Tilbakeslag slår deg ut av balanse', 'Stress and worry feel very present|Stress og bekymring kjennes svært nært', 'Calm takes deliberate effort|Ro krever bevisst innsats'])
    }
  }
};

/** Five-level key from the percentile when a norm exists, otherwise the three-level band. */
export function contextLevel(d) {
  if (Number.isFinite(d.percentile)) {
    if (d.percentile < 10 && d.band === 'low') return 'veryLow';
    if (d.percentile > 90 && d.band === 'high') return 'veryHigh';
  }
  return d.band;
}

// Level-specific illustrations that exist under assets/design/context/ as `${chapter}-${code}-${level}.webp`.
// Until a file is added here, the card uses the trait's shared chapter image.
export const levelArt = new Set([]);
