// Trait cards for the Work & career and Everyday life chapters.
// One card per trait, band (low / middle / high) and chapter: a short image, a description
// and one idea to try. Selected deterministically from the domain band, so each card stays
// traceable to the score. Each pair is [English, Norwegian bokmål], written for each language.

const cards = {
  O: {
    work: {
      high: {quote: ['You see the door before others see the wall.', 'Du ser døra før andre ser veggen.'],
        text: ['You are often drawn to new ideas, unusual angles and problems no one has solved yet. Work that lets you explore, connect dots and improve how things are done tends to keep you engaged. Repetitive tasks with no room to rethink can drain you faster than they drain others.', 'Du trekkes ofte mot nye ideer, uvanlige vinkler og problemer ingen har løst ennå. Arbeid der du får utforske, se sammenhenger og forbedre hvordan ting gjøres, holder gjerne på engasjementet ditt. Ensformige oppgaver uten rom for å tenke nytt kan tappe deg raskere enn andre.'],
        try: ['Pick one idea you have been carrying around and test the smallest version of it this week. Note what you learned, not just whether it worked.', 'Velg én idé du har gått og båret på, og test den minste versjonen av den denne uken. Skriv ned hva du lærte, ikke bare om det virket.']},
      middle: {quote: ['You keep one foot on solid ground and the other on new territory.', 'Du har én fot på fast grunn og den andre på nytt land.'],
        text: ['You can welcome new ideas when they have a clear purpose, and stick with proven methods when they work. That makes you a useful bridge between people who want to change everything and people who want to change nothing.', 'Du kan ta imot nye ideer når de har et tydelig formål, og holde deg til utprøvde metoder når de fungerer. Det gjør deg til en nyttig bro mellom dem som vil endre alt, og dem som ikke vil endre noe.'],
        try: ['In your next meeting, ask one question about how the work could be done differently, and one about what should stay the same.', 'Still ett spørsmål i neste møte om hvordan arbeidet kan gjøres annerledes, og ett om hva som bør forbli som det er.']},
      low: {quote: ['You build on bedrock, not on trends.', 'Du bygger på fjell, ikke på trender.'],
        text: ['You tend to value what is concrete, tested and practical. In a workplace full of new initiatives, you are often the one who asks whether it will actually work, and that question saves time and money. Work with clear methods and visible results suits you well.', 'Du verdsetter gjerne det konkrete, utprøvde og praktiske. På en arbeidsplass full av nye initiativ er det ofte du som spør om det faktisk vil virke, og det spørsmålet sparer både tid og penger. Arbeid med tydelige metoder og synlige resultater passer deg godt.'],
        try: ['When a new idea comes up, ask for one small, concrete trial before you decide. You keep your judgement and still give the idea a fair chance.', 'Når en ny idé dukker opp, be om en liten, konkret prøve før du bestemmer deg. Da beholder du dømmekraften og gir likevel ideen en rettferdig sjanse.']}
    },
    life: {
      high: {quote: ['Your mind always has a window open.', 'Tankene dine har alltid et vindu på gløtt.'],
        text: ['You probably enjoy books, places, conversations and experiences that show you something new. Curiosity can make everyday life rich, and it can also make routines feel tight. You may notice that you get restless when every week looks the same.', 'Du liker trolig bøker, steder, samtaler og opplevelser som viser deg noe nytt. Nysgjerrigheten kan gjøre hverdagen rik, men den kan også gjøre at rutiner føles trange. Kanskje merker du at du blir rastløs når hver uke ser lik ut.'],
        try: ['Plan one small first this week: a new route, a new recipe or a conversation with someone you rarely talk to.', 'Planlegg én liten premiere denne uken: en ny rute, en ny oppskrift eller en prat med noen du sjelden snakker med.']},
      middle: {quote: ['You love your usual café, and now and then you order something new.', 'Du går gjerne på stamkafeen, og bestiller av og til noe nytt.'],
        text: ['You appreciate habits that work, and you are open to new experiences when they fit your life. That balance gives you stability without making you rigid.', 'Du setter pris på vaner som fungerer, og er åpen for nye opplevelser når de passer inn i livet ditt. Den balansen gir deg stabilitet uten å gjøre deg rigid.'],
        try: ['Choose one routine you like and change one small detail in it. Notice whether the change adds something or just gets in the way.', 'Velg én rutine du liker, og endre én liten detalj i den. Legg merke til om endringen gir noe, eller bare forstyrrer.']},
      low: {quote: ['You know what you like, and you like what you know.', 'Du vet hva du liker, og du liker det du vet.'],
        text: ['You tend to find calm in familiar places, traditions and practical tasks. That can give you a steady base that others lean on. New things are not off-limits; they simply need to earn their place.', 'Du finner gjerne ro i kjente steder, tradisjoner og praktiske gjøremål. Det kan gi deg et stødig fundament som andre lener seg på. Nye ting er ikke uaktuelle; de må bare gjøre seg fortjent til plassen.'],
        try: ['Let someone close to you pick one activity this week that you would not have chosen yourself. Afterwards, name one thing you liked about it.', 'La en du er glad i velge én aktivitet denne uken som du ikke ville valgt selv. Si etterpå én ting du likte med den.']}
    }
  },
  C: {
    work: {
      high: {quote: ['You lay the tracks before the train leaves.', 'Du legger skinnene før toget kjører.'],
        text: ['You work best when you know what will be delivered, when and by whom. People can usually count on what you promise getting done, and you tend to notice early when a plan starts to slip. Workplaces that change direction all the time may cost you more energy than others.', 'Du jobber best når du vet hva som skal leveres, når og av hvem. Folk kan som regel stole på at det du lover, blir gjort, og du merker gjerne tidlig når en plan begynner å skli. Miljøer som skifter retning hele tiden, kan koste deg mer energi enn andre.'],
        try: ['Pick one task this week where you deliberately leave 20 percent open. Notice whether the result got worse, or just different.', 'Velg én oppgave denne uken der du bevisst lar 20 prosent stå åpent. Legg merke til om resultatet ble dårligere, eller bare annerledes.']},
      middle: {quote: ['You carry both a map and a compass, and switch depending on the terrain.', 'Du har både kart og kompass, og bytter etter terrenget.'],
        text: ['You can build structure when a lot is at stake and improvise when it is not. Your strength is that you adapt. The catch is that you may not always notice which mode you are in.', 'Du kan lage struktur når mye står på spill, og improvisere når det ikke gjør det. Styrken er at du tilpasser deg. Fallgruven er at du ikke alltid merker hvilken modus du er i.'],
        try: ['Write down one task where you planned and one where you improvised. Which went better, and why?', 'Skriv ned én oppgave der du planla og én der du improviserte. Hvilken gikk best, og hvorfor?']},
      low: {quote: ['You find the path by walking it.', 'Du finner veien mens du går.'],
        text: ['You tend to work well when things are moving and plans have to change. You can respond quickly, try things out and get going while others are still planning. Long, detailed processes with strict checklists may feel heavier for you than for others.', 'Du fungerer gjerne godt når ting er i bevegelse og planer må endres. Du kan reagere raskt, prøve deg frem og komme i gang mens andre fortsatt planlegger. Lange, detaljerte prosesser med strenge sjekklister kan kjennes tyngre for deg enn for andre.'],
        try: ['Before your most important task this week, write down just three steps and one deadline. Keep it short enough that it helps rather than binds.', 'Før den viktigste oppgaven din denne uken: skriv ned bare tre steg og én frist. Hold det så kort at det hjelper i stedet for å binde.']}
    },
    life: {
      high: {quote: ['Your calendar is a promise you keep to yourself.', 'Kalenderen din er et løfte du holder til deg selv.'],
        text: ['Order and routines probably give you calm. You like knowing what the week holds, and you often follow through on what you set out to do. Sudden changes can be harder to enjoy, even when they are pleasant ones.', 'Orden og rutiner gir deg trolig ro. Du liker å vite hva uken bringer, og du fullfører ofte det du har bestemt deg for. Plutselige endringer kan være vanskeligere å nyte, selv når de er hyggelige.'],
        try: ['Leave one evening this week completely unplanned. Notice what you end up doing, and how it feels.', 'La én kveld denne uken stå helt uplanlagt. Legg merke til hva du ender opp med å gjøre, og hvordan det kjennes.']},
      middle: {quote: ['You make lists, and you let yourself ignore them.', 'Du lager lister, og gir deg selv lov til å se bort fra dem.'],
        text: ['You keep track of what matters, without needing everything to be in order. You can be spontaneous on a Saturday and structured on a Monday.', 'Du har oversikt over det som betyr noe, uten at alt må være i orden. Du kan være spontan en lørdag og strukturert en mandag.'],
        try: ['Choose one area of life where a little more structure would make the week easier, and add a single habit there.', 'Velg ett område i livet der litt mer struktur ville gjort uken lettere, og legg inn én enkelt vane der.']},
      low: {quote: ['You say yes to the day as it comes.', 'Du sier ja til dagen slik den kommer.'],
        text: ['You are probably good at going with the flow and making the best of what happens. That makes you easy to be around when plans fall apart. Bills, forms and deadlines may sometimes sneak up on you.', 'Du er trolig flink til å ta ting som de kommer og gjøre det beste ut av det som skjer. Det gjør deg lett å være sammen med når planer ryker. Regninger, skjemaer og frister kan av og til snike seg innpå deg.'],
        try: ['Pick one recurring chore and tie it to something you already do every day, like your morning coffee.', 'Velg ett gjøremål som går igjen, og knytt det til noe du allerede gjør hver dag, som morgenkaffen.']}
    }
  },
  E: {
    work: {
      high: {quote: ['You bring the room to life.', 'Du får liv i rommet.'],
        text: ['You often get energy from meetings, collaboration and quick exchanges. You may be the one who gets a discussion going or makes newcomers feel welcome. Long stretches of solo work without contact can drain you.', 'Du får ofte energi av møter, samarbeid og raske utvekslinger. Kanskje er det du som får i gang diskusjonen eller får nye til å føle seg velkomne. Lange perioder med alenearbeid uten kontakt kan tappe deg.'],
        try: ['In your next meeting, wait until two others have spoken before you share your view. Notice what you hear that you might otherwise have missed.', 'Vent til to andre har sagt sitt før du deler ditt syn i neste møte. Legg merke til hva du hører som du ellers kanskje ville gått glipp av.']},
      middle: {quote: ['You can open the door to the room, and close it behind you.', 'Du kan både åpne døra til rommet og lukke den bak deg.'],
        text: ['You can enjoy teamwork and also need time to work undisturbed. You can speak up when it matters, and you do not need to fill every silence.', 'Du kan trives med samarbeid og samtidig trenge tid til å jobbe uforstyrret. Du kan ta ordet når det trengs, og du trenger ikke fylle hver stillhet.'],
        try: ["Look at next week's calendar and mark which meetings give you energy and which drain you. Can you move one?", 'Se på kalenderen for neste uke og merk hvilke møter som gir deg energi, og hvilke som tapper deg. Kan du flytte ett?']},
      low: {quote: ['You think before you speak, and it shows.', 'Du tenker før du snakker, og det merkes.'],
        text: ['You tend to do your best work with room to concentrate. You may prefer to prepare before speaking, and when you do speak, people listen. Open-plan offices and back-to-back meetings may cost you more than they cost others.', 'Du gjør ofte ditt beste arbeid når du har ro til å konsentrere deg. Du foretrekker kanskje å forberede deg før du tar ordet, og når du gjør det, lytter folk. Åpne landskap og møter på rad kan koste deg mer enn andre.'],
        try: ['Send your input in writing before your next meeting. Notice whether it is easier to be heard when your thoughts arrive first.', 'Send innspillet ditt skriftlig før neste møte. Legg merke til om det blir lettere å bli hørt når tankene dine kommer først.']}
    },
    life: {
      high: {quote: ['Your energy grows when it is shared.', 'Energien din vokser når den deles.'],
        text: ['You probably enjoy company, plans and people around you. You can be the one who gathers friends and gets things going. A week without social contact may feel longer for you than for others.', 'Du trives trolig med selskap, planer og folk rundt deg. Du kan være den som samler venner og får ting til å skje. En uke uten sosial kontakt kan kjennes lengre for deg enn for andre.'],
        try: ['Invite someone you rarely see to something simple this week, like a walk or a coffee.', 'Inviter noen du sjelden ser til noe enkelt denne uken, som en gåtur eller en kaffe.']},
      middle: {quote: ['You enjoy the party, and you enjoy getting home.', 'Du liker festen, og du liker å komme hjem.'],
        text: ['You can enjoy both busy social weeks and quiet evenings alone. You can adjust to the people around you without losing yourself.', 'Du kan trives både med sosiale uker og rolige kvelder alene. Du kan tilpasse deg folkene rundt deg uten å miste deg selv.'],
        try: ['After your next social plan, rate your energy from 1 to 10. After a quiet evening, do the same. Which did you need most this week?', 'Gi energien din en karakter fra 1 til 10 etter neste sosiale avtale. Gjør det samme etter en rolig kveld. Hva trengte du mest denne uken?']},
      low: {quote: ['You recharge in the quiet that others overlook.', 'Du lader i stillheten andre overser.'],
        text: ['You probably value close relationships and time on your own more than large gatherings. A few deep conversations may matter more to you than many short ones. The people closest to you often know you better than most.', 'Du verdsetter trolig nære relasjoner og tid alene mer enn store sammenkomster. Få og dype samtaler kan bety mer for deg enn mange korte. De som står deg nærmest, kjenner deg ofte bedre enn de fleste.'],
        try: ['Send a message to someone you care about and suggest a plan for just the two of you.', 'Send en melding til noen du bryr deg om, og foreslå en avtale bare for dere to.']}
    }
  },
  A: {
    work: {
      high: {quote: ['You are the glue that holds the team together.', 'Du er limet i teamet.'],
        text: ['You often notice how others are doing and help without being asked. Colleagues may find it easy to come to you, and you help create a good atmosphere. In tough negotiations or conflicts, standing your ground may cost you more.', 'Du merker ofte hvordan andre har det, og hjelper uten å bli spurt. Kolleger synes kanskje det er lett å komme til deg, og du bidrar til et godt miljø. I tøffe forhandlinger eller konflikter kan det koste deg mer å stå på ditt.'],
        try: ['Say no to one request this week that you would normally accept without thinking. Notice what happens.', 'Si nei til én forespørsel denne uken som du vanligvis ville sagt ja til uten å tenke deg om. Legg merke til hva som skjer.']},
      middle: {quote: ['You can lend a hand, and you can draw a line.', 'Du kan både rekke ut en hånd og sette en grense.'],
        text: ['You can cooperate and accommodate others, and you can also disagree when something matters. That makes you someone others can trust to be both kind and honest.', 'Du kan samarbeide og strekke deg for andre, og du kan si imot når noe er viktig. Det gjør deg til en som andre kan stole på er både vennlig og ærlig.'],
        try: ['Think of a disagreement you have avoided raising. Write down how you could say it kindly and clearly in two sentences.', 'Tenk på en uenighet du har latt være å ta opp. Skriv ned hvordan du kan si det vennlig og tydelig i to setninger.']},
      low: {quote: ['You say what others only think.', 'Du sier det andre bare tenker.'],
        text: ['You tend to be direct, challenge ideas and stand up for your view. That can make you valuable when decisions need sharpening or someone has to ask the hard questions. In close collaboration, others may experience your directness more strongly than you intend.', 'Du er gjerne direkte, utfordrer ideer og står for ditt syn. Det kan gjøre deg verdifull når beslutninger må skjerpes, eller noen må stille de vanskelige spørsmålene. I tett samarbeid kan andre oppleve direktheten sterkere enn du mener den.'],
        try: ['Before your next piece of criticism, start by naming what is good about the idea. Notice whether the conversation changes.', 'Begynn med å si hva som er bra med ideen før neste kritiske innspill. Legg merke til om samtalen endrer seg.']}
    },
    life: {
      high: {quote: ['You make room for others at the table.', 'Du lager plass til andre rundt bordet.'],
        text: ['You probably care a lot about the people around you and want things to go well for them. Friends and family may come to you when they need support. Your own needs can sometimes end up last in line.', 'Du bryr deg trolig mye om folk rundt deg og vil at de skal ha det bra. Venner og familie kommer kanskje til deg når de trenger støtte. Dine egne behov kan av og til havne bakerst i køen.'],
        try: ['Set aside one hour this week that is only for you, and protect it as carefully as a promise to someone else.', 'Sett av én time denne uken som bare er for deg, og pass på den like godt som et løfte til noen andre.']},
      middle: {quote: ['You are generous, but no doormat.', 'Du er raus, men ingen dørmatte.'],
        text: ['You show consideration for others and can also take care of yourself. You can adjust to the people around you without always giving in.', 'Du viser omtanke for andre og kan samtidig ta vare på deg selv. Du kan tilpasse deg folk rundt deg uten alltid å gi etter.'],
        try: ['Notice one situation this week where you gave in, and one where you held your ground. What decided it?', 'Legg merke til én situasjon denne uken der du ga etter, og én der du sto på ditt. Hva avgjorde det?']},
      low: {quote: ['With you, people know where they stand.', 'Hos deg vet folk hvor de har deg.'],
        text: ['You probably value honesty over politeness and say what you mean. People rarely need to guess what you think. In close relationships, others may sometimes want a gentler start.', 'Du setter trolig ærlighet foran høflighet og sier det du mener. Folk trenger sjelden å gjette hva du tenker. I nære relasjoner kan andre av og til ønske en mykere start.'],
        try: ['Ask someone close to you one question about how they are doing, and just listen, without giving advice.', 'Still en du står nær ett spørsmål om hvordan de har det, og bare lytt, uten å gi råd.']}
    }
  },
  N: {
    work: {
      high: {quote: ['You hear the alarm before the smoke appears.', 'Du hører alarmen før røyken kommer.'],
        text: ['You often notice risks, unclear expectations and tension early. That sensitivity can make you careful and thorough. Under a lot of pressure, worries may take up more room than the task itself.', 'Du merker ofte risiko, uklare forventninger og spenninger tidlig. Den følsomheten kan gjøre deg nøye og grundig. Under mye press kan bekymringene ta mer plass enn selve oppgaven.'],
        try: ['When a worry about work comes up, write it down and add the next concrete step. Then put the note away until tomorrow.', 'Når en bekymring om jobben dukker opp, skriv den ned og legg til neste konkrete steg. Legg så lappen bort til i morgen.']},
      middle: {quote: ['You feel the waves, and keep your balance.', 'Du kjenner bølgene, men holder balansen.'],
        text: ['You can feel pressure without being overwhelmed by it. Stress probably affects you more in some situations than in others, which gives you useful clues about what you need.', 'Du kan kjenne press uten å bli overveldet av det. Stress påvirker deg trolig mer i noen situasjoner enn andre, og det gir deg nyttige hint om hva du trenger.'],
        try: ['Note the moment this week when work felt heaviest. What was going on, and what helped?', 'Noter øyeblikket denne uken da jobben kjentes tyngst. Hva skjedde, og hva hjalp?']},
      low: {quote: ['You are the calm in the storm.', 'Du er roen i stormen.'],
        text: ['You tend to stay steady when deadlines tighten or things go wrong. Others may find it reassuring to work with you under pressure. Because you rarely worry, you may sometimes underestimate a risk others feel strongly.', 'Du holder deg ofte stødig når fristene strammes eller noe går galt. Andre kan synes det er betryggende å jobbe med deg under press. Fordi du sjelden bekymrer deg, kan du av og til undervurdere en risiko andre kjenner sterkt.'],
        try: ['Ask a colleague what worries them most about a current project, and take one of their concerns seriously.', 'Spør en kollega hva som bekymrer dem mest i et pågående prosjekt, og ta én av bekymringene på alvor.']}
    },
    life: {
      high: {quote: ['You experience life in high definition.', 'Du opplever livet i høy oppløsning.'],
        text: ['You probably feel both joy and worry strongly. That depth can make you empathetic and attentive to the people you care about. When a lot happens at once, you may need more time to land.', 'Du kjenner trolig både glede og bekymring sterkt. Den dybden kan gjøre deg empatisk og oppmerksom på dem du er glad i. Når mye skjer samtidig, kan du trenge mer tid til å lande.'],
        try: ['Choose one thing that reliably calms you, like a walk or music, and schedule it before a day you know will be demanding.', 'Velg én ting som pleier å roe deg ned, som en gåtur eller musikk, og legg den inn før en dag du vet blir krevende.']},
      middle: {quote: ['You pack both an umbrella and sunglasses.', 'Du har både paraply og solbriller i veska.'],
        text: ['You react to ups and downs, but you usually find your footing again. Some situations probably get to you more than others.', 'Du reagerer på opp- og nedturer, men finner som regel fotfestet igjen. Noen situasjoner går trolig mer innpå deg enn andre.'],
        try: ['At the end of each day this week, name one thing that drained you and one that filled you up.', 'Avslutt hver dag denne uken med å nevne én ting som tappet deg, og én som fylte deg opp.']},
      low: {quote: ['You keep your head above water when others start to splash.', 'Du holder hodet over vannet når andre begynner å plaske.'],
        text: ['You probably take everyday hassles in your stride and recover quickly. That calm can be a support for the people around you. It is worth remembering that others may need more time than you to settle.', 'Du tar trolig hverdagens små og store kriser med ro, og kommer deg raskt. Den roen kan være en støtte for folk rundt deg. Det er verdt å huske at andre kan trenge mer tid enn deg til å falle til ro.'],
        try: ['Next time someone close to you is upset, ask what they need before you reassure them.', 'Neste gang en du står nær er opprørt, spør hva de trenger før du beroliger dem.']}
    }
  }
};

/** The card for one domain in one chapter ('work' or 'life'), in the given language. */
export function contextCard(d, chapter, language) {
  const c = cards[d.code]?.[chapter]?.[d.band];
  if (!c) return null;
  const i = language === 'no' ? 1 : 0;
  return {quote: c.quote[i], text: c.text[i], try: c.try[i], ruleId: `context-v1/${d.code}/${chapter}/${d.band}`};
}

export const contextCards = cards;
