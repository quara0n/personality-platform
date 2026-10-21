# Beslutningslogg

## Gjeldende tillegg fra brukeren 2026-10-11
- USA og Norge er første markeder, med USD og NOK.
- Brukergrensesnitt, spørsmål og rapport skal følge valgt språk: engelsk og norsk bokmål. Manuell språk- og landoverstyring er inkludert.
- Én samlet rapport skal koste 99 kr i Norge og $9.99 i USA. (Erstattet 2026-10-13: 49 kr og $4.99.) Brukeren har Stripe-konto og velger Stripe. Kontotilkobling og leveringsoppsett gjenstår; forhåndsvisning belaster ingen.

## Prisendring fra brukeren 2026-10-13
- Rapportprisen endres til 49 kr i Norge og $4.99 i USA (fra 99 kr/$9.99). Fortsatt engangskjøp av én samlet rapport. Stripe-sandboxprisene må opprettes på nytt; se docs/stripe-setup.md.

Disse tilleggene går foran tidligere engelsk-only føring og den historiske listen over uavklarte punkter nedenfor.

Registrert fra samtalen 11. oktober 2026. «Valgt» nedenfor viser brukerens uttrykkelige valg eller tilslutning. Forslag er merket separat.

## Valgt av brukeren
- Engelsk produkt. Norsk bokmål i samtalen.
- Big Five som produktretning; ikke 16 typologiske personlighetstyper.
- Minimalistisk, behagelig og profesjonelt, med litt lekenhet.
- Blekkblått og aprikos med støvete blått og varm elfenben.
- Kantede, geometriske redaksjonelle figurer med hverdagsklær. Ikke for runde eller leireaktige.
- Landing: sentrert overskrift, profilvisualisering mellom figurene, mørk seksjon med hverdagen/relasjoner/arbeidslivet.
- Spørsmål: ett om gangen; store firkanter ytterst, mellomstore innenfor, minste i midten. Brukeren aksepterte nåværende størrelser og vil beholde figuren som den er.
- Hover lyser opp/løfter felt; klikk velger svar og går automatisk videre. Tilbake/frem er valgfrie navigasjonskontroller.
- Kort lasting: fem deler av logoen samler seg til én markør. Ingen hjerneillustrasjon nødvendig.
- Gratis resultat: første resultatforslag, samlet femtrekksprofil og utfellbare forklaringer.
- Betalt tilbud: én fordypningsrapport som engangskjøp, med både arbeidsliv/karriere og hverdagsliv/relasjoner.
- Kjøpsside: rapport og kjøpsknapp sentrert. Kvinne ved laptop til venstre. Mann med lysere olivenbrun hud og blond kvinne med lys hud i samtale til høyre.
- «Two perspectives. One report.» beholdes under kjøpsområdet. Tidligere eksempelutdrag nederst er fjernet. Plantevanning er forkastet.
- Rapport: kapittelmeny, oversikt, fem trekk, arbeidsliv, hverdagsliv og neste steg. PDF-nedlasting inngår i godkjent konsept.
- Brukeren har autorisert prosjektpakking, lokalt repo og videre GitHub-oppretting/push.

## Forslag fra assistenten — må ikke fremstilles som ferdig testet
- Kort svarbekreftelse rundt 250–350 ms før automatisk overgang.
- Logoovergang rundt 1–2 sekunder, uten kunstig lang venting.
- På mobil: kjøpsinformasjon før illustrative scener; rapportmeny som kompakt kapittelvelger.
- Klikkbar prototype med eksempeldata parallelt med research.

## Uavklart
- **Oppdatering 2026-10-11:** Brukeren ba om ferdig test og rapporter, og valgte USA/USD og Norge/NOK ved lansering. Språk og valuta tilpasses med manuell overstyring. Engelsk og bokmål erstatter tidligere engelsk-only føring. Se docs/implementation.md for dagens status.
- **Implementeringsvalg:** Johnson IPIP-NEO-120 med alle 120 originalutsagn, MIT-distribusjon fra Alheimsins og bokmålsoversettelse derfra. Råskårer uten persentiler, deterministisk redaksjonell rapportmotor og nettleserbasert beregning. Dette er utførende valg innenfor brukerens oppdrag, ikke separate brukerutsagn.
- Endelig navn («5» er plassholder), domene, pris, valuta og avgifter.
- Primærmålgruppe og hvilket engelskspråklig marked som lanseres først.
- Instrument, lisens, antall spørsmål, svartype, normer, skåring og evt. fasetter.
- Konto/lagring, tilgang etter kjøp, personvern, analyse og betalingstilbyder.
- Om rapporttekster skal være redaksjonelle regler, KI-støttet eller en kombinasjon.
- Teknologistakk, hosting og produksjonsillustrasjoner.

## Designkorreksjon etter brukerens gjennomgang
- Originalbildene er igjen styrende for logo og komposisjon: fem adskilte trekanter og ordmerket «Fem», større figurer rundt profilkortet, kompakt topp og originale ikonmotiver.
- Grensesnittet bruker «spørsmål» / «questions». Informasjonslinjen om politisk stemmegivning er fjernet fra forsiden. Dette er en presentasjonsendring; den verifiserte spørsmålsbanken er ikke endret.
- Språk- og landvalg er flyttet inn i toppmenyen på desktop. Mobil beholder tilgjengelige valg.
- Brukeren godkjente Stripe-testkontoen «5 sandbox» for betalingsoppsett og testing. Ingen reelle kjøp er aktivert.

- Logo-presisering: Brukerens vedlagte original brukes nå direkte som visuell kilde i topp, bunn og lasting. CSS-beskjæring viser originalens tekstur, trekantformer og ordmerke uten nytegning. Originalfilen er bevart uendret i app/assets/fem-logo-reference.png.

## Rapportforbedring godkjent 2026-10-11
- Brukeren vil ha mer individuelle rapporter før egen gjennomføring, uten å måtte gjenta testen ved rapportoppdateringer.
- Originale spørsmål og skåringsnøkkel beholdes. Rapport v2 bruker alle 30 fasetter, viser kontraster innenfor hvert trekk og har egne midttolkninger på begge språk.
- Lokale svarfiler kan lastes ned og hentes inn igjen. Ingen konto eller serverlagring innføres; filen oppbevares av brukeren.
- Bedre rapportformidling er ikke dokumentasjon på forbedret psykometrisk nøyaktighet. Normering og uavhengig norsk validering gjenstår.

## Designtilpasning etter Runes bilder 2026-10-11
- Rune sendte fire bilder og ba om at appen bevarer mest mulig av dem: spørsmålsside, lasting, gratisresultat og betalt rapport.
- Spørsmålssiden følger det nye bildet: fem like store svarfelt med teksten inni, hake på valgt svar, «Tilbake» som tekstlenke og «Neste» som mørk knapp. Dette erstatter de varierende firkantstørrelsene. Automatisk overgang ved valg beholdes, og «Neste» er valgfri.
- Lastingen er en animasjon på rundt 4 sekunder der de fem originale logobitene faller på plass. Ved redusert bevegelse vises en kort toning.
- Gratisresultatet følger 04-free-results: figurer rundt profilkortet, «Et første blikk på mønstrene dine» og utfellbare trekk. Den personlige setningen velges deterministisk fra trekkene lengst fra midtpunktet (app/design-copy.js).
- Rapporten følger 06-report-reader: ett kapittel om gangen med kapittelmeny, oversikt med «Det store bildet», illustrerte kapittelkort, «Ett lite steg å prøve» og «Neste»-lenke. Utskrift/PDF tar med alle kapitler.
- Logoen er skåret ut fra originalen med gjennomsiktig bakgrunn (app/assets/design/logo.png). Figurer er hentet fra de valgte designbildene.

## Kjøpsside, stabil spørsmålsside og positiv vinkling 2026-10-11
- Kjøpssiden (#offer) følger 05-report-offer: overskrift, figurer på hver side av kjøpskortet, fire punkter, pris, kjøpsknapp og «To perspektiver. Én rapport.». Betaling er fortsatt ikke implementert; knappen åpner rapporten gratis i forhåndsvisningen, og kortet sier det.
- Spørsmålstittelen står i et felt med fast høyde, så svarfeltene ikke flytter seg når en tittel går over to linjer. Fokus på ny tittel ruller ikke siden.
- Figuren på spørsmålssiden er skåret på nytt med hele hodet.
- Rune ba om vekt på det positive. I gratisresultat og rapport kommer «Din styrke» først og fremhevet, deretter forklaringen og «Slik får du mest ut av det». «Hva gjennomsnittet kan skjule» heter nå «Nyanser i profilen din», står sist og er dempet, og er tatt ut av gratisresultatet. Tekstene er de samme regelstyrte tekstene som før, så koblingen mellom skår og råd er uendret.
- Rapporten er gjort mer visuell: trekkhoder med logobit, stolpe og nivåmerke, fasettkort med egne stolper, kontekstkort med «Prøv»-forslag og nummererte stegkort.

## Persentiler, logobiter og neste steg 2026-10-11
- Rune ba om oversikten som i bilde 5, med persentiler fra den amerikanske referansegruppen for både engelsk og norsk (se Codex sin normrapport). Persentilen beregnes som empirisk rang, P = 100 × (lavere + 0,5 × like) / N, avrundet til hele tall mellom 1 og 99 (app/norms.js).
- Referansefordelingen lages av scripts/build_norms.py fra IPIP120.dat (Kajonius og Johnson 2019, CC BY 4.0): USA, alle 120 svar 1–5, alder 18–90. Bare aggregerte tellinger per mulig sum lagres i app/data/norms-us.json. Alderskolonnen er utledet og må stemme med kildeopptellingen (243 307 rader); skriptet varsler ellers.
- Inntil norms-us.json finnes, viser rapporten skalaplassering 1–5 og sier tydelig at det ikke er persentiler. Ingen oppdiktede persentiler vises.
- Merking: «Sammenlignet med amerikanske nettdeltakere … overføring til norsk språk er ikke særskilt validert.» På engelsk: sammenlignet med amerikanske voksne som tok testen på nett på engelsk, ikke en nasjonal norm.
- Hvert trekk har sin logobit: Åpenhet lyseblå, Planmessighet mørkeblå, Ekstroversjon aprikos, Medmenneskelighet stålblå, Følelsesmessig reaktivitet en mørkere sandversjon av den lyse biten for kontrast. Bitene brukes i oversikt, kapitler og neste steg.
- «Dine neste steg» er en ukeplan med tre eksperimenter, avkrysning i fanen og «Etter en uke». Når færre enn tre fasetter er utenfor midtområdet, fylles det på med fasettene lengst fra midtpunktet, én per trekk, merket som utforskninger.

## Metaforkort i Arbeidsliv og Hverdagsliv 2026-10-11
- Rune godkjente et nytt kortformat for kapitlene Arbeidsliv og Hverdagsliv: en kort metafor som sitatlinje, en beskrivelse og én «Prøv»-idé. Kortene er skrevet for alle fem trekk × lav/midt/høy × begge kapitler, på engelsk og norsk bokmål hver for seg (app/context-copy.js, regel-ID context-v1/<trekk>/<kapittel>/<nivå>).
- Kortene velges fra trekkets nivå, så de er sporbare til skåren. Fasettkortene får ingen metaforer.
- De gjentakende forbeholdslinjene «Nær en grense for ordlyden …» og «Alle seks fasettene ligger i det redaksjonelle midtområdet …» er fjernet fra kortene. Forbeholdene står fortsatt i «Slik leser du resultatene».

## Forsiden på mobil 2026-10-11
- På smale skjermer (≤ 700 px) skjules de beskårne sidefigurene på forsiden. Eksempelkortet står i full bredde, med de to figurene fra resultatsiden under seg som to avrundede bilder. Det er samme side, ikke en egen mobilside.

## Spørsmålssiden på mobil 2026-10-11
- Rune ba om at logo, spørsmål og alle fem svaralternativer får plass i ett skjermbilde på telefon. På smale skjermer (≤ 760 px) er linjen «Svar ut fra hvordan du vanligvis er.» og «Spørsmål 12 av 120» tatt bort; fremdriftslinjen viser i stedet «12/120». Topptekst, avstander og svarknapper er strammet inn. Målt: femte svar slutter ved 465 px for alle 120 spørsmål på norsk og engelsk, og kvinnefiguren kommer innenfor skjermen fra omtrent 660 px synlig høyde.
- Figurstørrelsen og automatisk overgang på stor skjerm er uendret.
- «Take charge» (E3, selvhevdelse) var oversatt «Tar ansvar», som betyr noe annet. Endret til «Tar styringen». Dette avviker fra upstream-oversettelsen; ID, fasett og nøkkel er uendret.

## Mobilretting av resultat, rapport og kjøpskort 2026-10-11
- Rune så at overskrifter og kort gikk ut over høyre kant på Android, der serif-skriften er bredere enn i testene. Overskriftene skalerer nå med skjermbredden, kortene i «Nyansene bak skårene» krymper, og trekknavnene i profilkortet står over stolpen på telefon. Sjekket i 360 og 412 px med en bredere erstatningsskrift.
- En CSS-regel for figurene på resultatsiden gjorde logobitene like brede som navnefeltet, så navnene forsvant. Regelen gjelder nå bare figurene.
- Alle trekk i «Utforsk trekkene dine» er lukket fra start.
- Kjøpskortet har fem punkter med en uthevet fordel og en kort forklaring: Alle 30 fasettene, Hvor du ligger, Arbeidsliv, Hverdagsliv og En ukeplan, på norsk og engelsk.

## Nettbrett 2026-10-11
- Gått gjennom forside, spørsmål, resultat, kjøpsside og rapport i 768, 820 og 1024 px. Ingen tekst går utenfor skjermen.
- På liggende nettbrett dekket figuren på spørsmålssiden «Tilbake». Mellom 761 og 1100 px er figuren mindre og står under knappene.
- På stående nettbrett (701–900 px) står språk og land på egen linje i toppmenyen, så lenkene ikke brytes.

## Fem trekk-paneler på resultatsiden 2026-10-11
- Rune valgte et nytt motiv (design/selected/08-trait-panels.png) som erstatter listen «Utforsk trekkene dine» på gratisresultatet: tittelen «Utforsk trekkene dine» (Rune valgte den fremfor «Fem trekk. Mange nyanser.») og fem illustrerte paneler med skrå topp, ett per trekk i fast rekkefølge O, C, E, A, N.
- Illustrasjonene er klippet fra motivet (app/assets/design/trait-*.webp). Panelfarger, skrå kanter, navn og +-knapp er laget i HTML/CSS, så teksten er skarp og oversettes.
- Et trykk åpner forklaringen for trekket under panelraden; ett trekk er åpent om gangen, og alle er lukket fra start. På mobil blas panelene sidelengs.
- Panelfargene følger motivet og avviker fra logobitene: Planmessighet er fersken i panelet, men mørkeblå bit ellers; Ekstroversjon er blå i panelet, men aprikos bit; Følelsesmessig reaktivitet er mørkeblå i panelet, men sandfarget bit. Logobitene i resten av rapporten er uendret.

## Trekkfarger følger panelene 2026-10-11
- Rune bestemte at den mørke logobiten hører til Følelsesmessig reaktivitet, og at fargene i hele rapporten skal følge trekkpanelene: Åpenhet lyseblå, Planmessighet aprikos, Ekstroversjon stålblå, Medmenneskelighet den lyse sandbiten (lys bit med nok kontrast mot lys bakgrunn) og Følelsesmessig reaktivitet mørkeblå. Dette erstatter fargefordelingen fra «Persentiler, logobiter og neste steg».

## Fasettkort i «Dine fem trekk» 2026-10-11
- Rune valgte et nytt oppsett for rapportkapitlet «Dine fem trekk» for bedre oversikt: hvert trekk starter med et lyseblått bånd med navn, nivå, skår og illustrasjon, og de seks fasettene vises som kompakte kort med navn, stolpe i trekkfargen, skår, nivå, illustrasjon og +.
- + åpner kortet med tolkningen og beskrivelsen av fasetten. Kortene er lukket fra start, og flere kan være åpne samtidig. I PDF er alle kort åpne.
- Illustrasjonene er klippet fra Runes motiver (app/assets/design/facets/), med gjennomsiktig bakgrunn. Motivet for Åpenhet hadde ikke en båndillustrasjon, så båndet bruker panelillustrasjonen fra resultatsiden.
- Stolpene følger fargene fra «Trekkfarger følger panelene», ikke de eldre fargene i motivene. «Eksempelprofil» vises bare i eksempelrapporten.
- Rekkefølgen i hvert trekk er bånd, kort beskrivelse, fasettkort, din styrke, tolkning, råd og nyanser, så koblingen mellom resultater og råd er bevart.

## Ekte persentiler 2026-10-11
- Rune leverte Codex' normpakke. Hashene i SHA256SUMS stemte, og tabellen har N = 243 307 (USA, alder 18–90, alle 120 svar). Pakken er lagt inn som app/data/norms-us.json, scripts/build_norms.py (Codex' versjon), docs/norms/ og tests/fixtures/norm-synthetic-cases.json.
- Persentil = 100 × (lavere + 0,5 × like) / N, avrundet med floor(P + 0,5). Ugyldige eller ikke-heltallige summer gir ingen persentil; ingen interpolering eller nærmeste oppslag.
- Visningsregel: verdier som avrundes til 0 eller 100, vises som 1 og 99. Dataene endres ikke.
- Samme amerikanske referanse brukes for engelsk og norsk. Kort merking følger Codex' tekst, og metodesiden har utdypende forklaring, kilde, CC BY 4.0-lenke og opplysning om bearbeiding.
- Nivåordene lavere/midt/høyere og all rapporttekst følger fortsatt svargjennomsnittet, som Codex anbefalte. Stolpene på gratisprofilen følger persentilen når normen finnes, så de ikke motsier rapporten.

## Illustrerte kort i Arbeidsliv og Hverdagsliv 2026-10-11
- Rune sendte nye motiver for kapitlene Arbeidsliv og karriere og Hverdagsliv. Hvert kapittel starter med tittel, ingress og illustrasjon. Hvert trekk vises som et kort med logobit og navn, metaforen i kursiv med aksentstrek, beskrivelse, Prøv-boks og illustrasjon til høyre (over teksten på mobil).
- Illustrasjonene er klippet fra motivene (app/assets/design/context/), én per trekk og kapittel. De viser midtnivå-metaforene; samme illustrasjon brukes for lavere og høyere nivå til egne motiver finnes.
- Nivåmerket beholdes på kortet, så koblingen mellom skår og råd synes. «Eksempelprofil» vises bare i eksempelrapporten. Det løse anførselstegnet i motivets Reaktivitet-metafor finnes ikke i appteksten.

## Landskap på spørsmålssiden 2026-10-11
- Rune valgte et nytt motiv for spørsmålssiden: et landskap med åser, trær, sti og sol langs bunnen, og kvinnen som sitter på en kloss nederst til venstre. Det erstatter figuren og hjørnebildet. Illustrasjonen er klippet fra motivet (app/assets/design/question-landscape.webp) med gjennomsiktig himmel.
- Krav: logo, fremdrift, spørsmål, alle fem svar og knappene skal synes uten å rulle på mobil, nettbrett og desktop. Kontrollert i 360×640, 390×664, 390×844, 768×1024, 820×1180, 1024×768, 1280×720, 1366×768, 1440×900 og 1920×1080, også med det lengste spørsmålet.
- Fremdriftslinjen viser alltid både prosent og spørsmålsnummer (for eksempel «12 % 14/120»). På skjermer lavere enn 860 px skjules «Svar ut fra hvordan du vanligvis er / Spørsmål X av 120», og spørsmålet og svarboksene blir litt mindre. Under 760 px skjules også notatet under knappene.
- På mobil vises venstre del av landskapet (kvinnen og trærne) i fast høyde.
- 2026-10-18: Rune ville ha landskapet lenger opp, så hele landskapet med kvinnen synes nederst på første skjerm på mobil. Svarboksene og knappene står litt tettere, og notatet under knappene skjules på telefoner lavere enn 700 px. Kontrollert i 360×640, 375×600, 390×664 og 414×736 på norsk og engelsk (uten testknappene «Tilfeldig» og «Runes profil», som skal fjernes).
- «Worry about things» er rettet fra «Bekymrer meg for mye» til «Bekymrer meg for ting», fordi «for mye» endret betydningen av utsagnet.

## Utvidet trekkpanel og lettere språk 2026-10-11
- Rune valgte et nytt oppsett for trekket som åpnes under «Utforsk trekkene dine»: bit og navn, nivå og skår, én oppsummerende setning, «En mulig styrke» med kort overskrift, én setning og illustrasjon, «Prøv i hverdagen» med lyspære, overskrift og oppfølgingsspørsmål, en kort forbeholdslinje og til slutt «Les mer om resultatet» med de lengre tekstene.
- Styrke, Prøv og forbehold er skrevet for alle fem trekk og tre nivåer på norsk og engelsk (panelCopy i app/design-copy.js) og velges fra nivået, som resten av teksten.
- Språkregel fra Rune: lett og hverdagslig, men ikke barnslig. Unngå ord som «element» og akademiske ord. De lengre trekktekstene (betydning, styrke og «verdt å ha i bakhodet») er skrevet om i det språket på begge språk, og «Lavere/Høyere tilslutning» heter nå «Lavere/Høyere på skalaen».
- Illustrasjonen for Åpenhet er klippet fra motivet; de andre trekkene bruker båndillustrasjonene fra rapportkapitlet.

## Nivåord følger persentilen 2026-10-11
- Rune ville fjerne skårene fra 0 til 5 når persentilene finnes. Skåren x/5 vises ikke lenger i panelet, fasettkortene eller rapporten der en persentil finnes. Stolpene viser persentilposisjonen.
- Nivåord og all tekst som velges etter nivå, følger persentilen: under 30 er lavere, 30 til 70 er midt, over 70 er høyere. Det gjelder trekk og fasetter, panelene, kapitlene, neste steg og mønsterteksten. «Midt» kan dermed ikke stå ved siden av for eksempel 8. persentil.
- Etiketten heter «Lavere/Midtre/Høyere område» når persentil finnes. Uten normtabell (annen instrumentversjon) brukes fortsatt svargjennomsnittet og de gamle etikettene.
- Mønsterteksten i fasettene sammenligner persentiler (forskjell på minst 30 regnes som tydelig). Neste steg og nyansene sorteres etter avstand fra 50. persentil.
- Råskårene (sum og gjennomsnitt) beholdes i skåringen og i lagrede svar, men vises ikke i rapporten.
- Rune ønsket en synlig forklaring. Et (i)-symbol står ved profilkortet på gratisprofilen («Hva betyr persentilen?»), i oversikten og ved persentilen i hvert trekk i rapporten. Det åpner en kort forklaring: hva persentilen betyr, hvem referansegruppen er, grensene 30/70 og at høy eller lav verken er bra eller dårlig. Forklaringen skjules i PDF.

## Gratisprofil og fordypningsrapport 2026-10-13
- Prinsipp: gratisprofilen viser hva du er, rapporten viser hvorfor og hva du gjør med det. Rune godkjente forslaget.
- Gratis: de fem trekkene med persentil, profilkortet, og per trekk én oppsummering, én styrke med illustrasjon og forbeholdslinjen.
- Flyttet til rapporten: «Prøv i hverdagen» og spørsmålet til ettertanke står nå i hvert trekk i «Dine fem trekk». «Les mer om resultatet» er fjernet fra gratisprofilen; de lengre tekstene fantes allerede i rapporten.
- Nytt i gratisprofilen: under hvert trekk står «[Trekket] ditt består av seks fasetter. Én skiller seg ut.» Fasetten lengst fra 50. persentil vises åpen med nivå, persentil og tolkning. De fem andre vises med navn, uskarp stolpe og lås, og en knapp går til kjøpssiden. De uskarpe stolpene er faste plassholdere og avslører ikke de ekte verdiene. Er den åpne fasetten i midtområdet, står det «Her er en smakebit på én» i stedet.
- **Endret 2026-10-13:** Bare Åpenhet, det første trekket, viser en åpen fasett (fasetten lengst fra 50. persentil, med forklaring). De fire andre trekkene viser «[Trekket] ditt består av seks fasetter.», alle seks fasettene låst med uskarp stolpe, og knappen til kjøpssiden. Rune ønsket å gi bort færre fasetter gratis nå som delevideoen er lagt til.
- «Send profilen til e-posten din»: skjemaet åpner brukerens eget e-postprogram (mailto) med de fem persentilene og en lenke tilbake til profilen. Lenken har svarene etter #-tegnet (#p=1 + 120 sifre), så de sendes ikke til serveren. Lenken gjenoppretter profilen og spør før den erstatter andre svar. Ekte utsending fra oss krever en e-posttjeneste og en serverfunksjon (se plan).

## Animasjon på gratisprofilen 2026-10-13
- Rune godkjente forslaget. Når profilen vises, flyr logobitene inn på plass i profilkortet, stolpene vokser til persentilen, og persentiltallet ved hver stolpe teller opp fra 0, forskjøvet trekk for trekk.
- Profilkortet viser nå persentiltallet til høyre for stolpen (over stolpen på mobil).
- «Et første blikk», trekkpanelene, «Gå dypere» og e-postboksen glir inn når man ruller til dem. Låsen på fasett-smakebiten rister litt når et trekk åpnes.
- Alt slås av når brukeren har valgt redusert bevegelse; da vises ferdige verdier med en gang. Spørsmålssiden og rapportens oversiktsside eies av tråden «Animasjoner og oversiktsside».
## Logoen som trekkvelger i «Dine fem trekk» 2026-10-13
- Rune ønsket at kapittelet skal bli kortere: litt informasjon først, deretter Fem-logoen, der hver av de fem bitene åpner trekket sitt i et panel under logoen.
- Hver bit er en knapp i trekkfargen med navn og persentil ved siden av. Den hever seg ved hover og tastaturfokus; på berøringsskjerm brukes trykk. Bare den synlige trekanten reagerer, så bitene ikke stjeler klikk fra hverandre.
- Ett trekk er åpent om gangen. Alle er lukket når kapittelet åpnes. Et nytt trykk på samme bit eller «Fold sammen» nederst i panelet lukker det igjen.
- Utskrift og PDF viser alle fem trekk utfoldet og skjuler logovelgeren. Bevegelse slås av ved «redusert bevegelse».

## Varder, profiloversikt og animasjoner (2026-10-13)
- Rune godkjente forslagene om fem varder på spørsmålssiden og en ny oversikt i rapporten.
- Spørsmålssiden: fem steinvarder langs stien, én per trekk i trekkfargen. Hvert besvart spørsmål du har passert legger én stein på varden til trekket, uansett svar, og alle steinene er like store, så vardene aldri viser retningen på en skår. Tilbake tar steinen av igjen. Ved 25, 50 og 75 % gløder vardene og en kort tekst vises. Etter siste svar blir vardene til de fem logobitene, som flyr sammen i lasteanimasjonen. På mobil står vardene i en rad over fremdriftslinjen. Hele spørsmålet og alle svar synes fortsatt uten å rulle.
- Rapportoversikten heter «Din profil på ett blikk» og erstatter persentilstolpene der: femkant-radar med de fem persentilene og en liste med tallene, 100 personer per trekk med faner («Du skårer høyere enn omtrent 82 av 100»), kort for ditt høyeste trekk og fasetten som ligger lengst fra midten, og én setning om kombinasjonen av de to trekkene som ligger lengst fra midten (app/combination-copy.js, redaksjonell refleksjonstekst i «kan»-form, ikke en validert påstand). (i)-forklaringen og fotnoten om den amerikanske referansegruppen er beholdt.
- Fasettkortene fyller stolpen og teller opp tallet når de åpnes. All bevegelse er kort og slås av ved «redusert bevegelse»; utskrift viser alt i ferdig tilstand.

## Profilnavn 2026-10-13
- Rune ønsket en MBTI-aktig merkelapp som gjør resultatet morsommere og lettere å dele, men bygget på Big Five-svarene. Vi bruker egne navn, ingen MBTI-bokstaver, typenavn eller varemerker.
- Navnet beskriver skårene, det er ingen type. Det bygger på de samme to trekkene som kombinasjonssetningen (de to utenfor midtområdet som ligger lengst fra persentil 50): substantivet fra trekket lengst fra midten, adjektivet fra det andre, for eksempel «Den nysgjerrige planleggeren» / «The Curious Planner». Ett trekk utenfor midten gir bare substantivet («Klippen»); ingen gir «Den allsidige» / «The All-Rounder».
- Navnet står øverst på profilkortet i gratisprofilen med en linje om hvilke trekk det bygger på og persentilene under, som overskrift på «Kombinasjonen din» i rapportoversikten og først i e-posten. Regel-id profile-name-v1/… i app/profile-name.js.
- Navnet er gratis og vises åpent, fordi det er det folk deler. Forklaringen av kombinasjonen ligger i fordypningsrapporten, med en kort lenke fra profilkortet (Rune spurte om sladding 2026-10-13; anbefalt og bygget slik).
- Navnene er redaksjonell tekst og skal med i den faglige gjennomgangen av rapportteksten, sammen med kombinasjonssetningene. Navn for profiler nær grensen kan skifte ved ny test; persentilene under viser hvor nær midten trekkene ligger.

## Delbar profilvideo 2026-10-13
- Rune ønsket en kort video i gratisprofilen som gjør at folk vil dele profilen: en krok med navnet, én interessant persentil eller fasett, og noe morsomt uten å bli for spøkefullt. Målet er å kombinere morsomt, interessant og seriøst.
- Boksen «Del profilen din som video» står under «Et første blikk». Videoen er 15 sekunder, stående 9:16 (1080 × 1920) for Stories, Reels og TikTok, og tegnes og tas opp i nettleseren (canvas og MediaRecorder). Ingenting lastes opp. MP4 velges når nettleseren kan, ellers WebM. Del-knappen bruker telefonens delingsmeny når den støtter filer, og ellers kan man laste ned videoen. Et stillbilde (PNG) med samme innhold kan lastes ned i stedet.
- Innhold: krok («Hvem er Rune, egentlig?», eller «120 spørsmål senere …» uten fornavn; Rune ba om 1,5 sekunder lengre åpningsscene, så den varer 4 sekunder), profilnavnet, trekket profilnavnet bygger på som «Mer nysgjerrig enn 92 av 100 personer» med 100 prikker, fasetten som skiller seg mest ut (den er allerede åpen gratis), én avslutningslinje og sluttkortet «Hvordan ser din profil ut? Finn ut gratis» med nettadressen som en knapp og «Selvrefleksjon, ikke en diagnose.» (Rune syntes «Ta den gratis Big Five-testen» hørtes hardt ut). En video kan ikke ha en klikkbar knapp, så adressen vises som en knapp i bildet, og lenken til forsiden (uten svarene) følger med i delingsteksten.
- Fornavnet er valgfritt, skrives inn av brukeren og brukes bare i videoen. Lave skårer beskrives ved sin egen pol («Roligere enn 92 av 100»), aldri som mangel. Avslutningslinjene er vennlige i begge retninger og hører til samme trekk som substantivet i profilnavnet (app/share-video.js, regel-id share-video-v1/…). De er redaksjonell tekst og skal med i den faglige gjennomgangen.
- Ved redusert bevegelse viser forhåndsvisningen et stillbilde; selve videoen kan fortsatt lages.
- Rune ønsket i tillegg en lengre video på rundt 30 sekunder i fordypningsrapporten. «Del rapporten din som video» står i oversikten etter «Din profil på ett blikk». Den lange versjonen (30 s) legger til alle fem trekkene med persentil, kombinasjonssetningen og «En mulig styrke» for trekket profilnavnet bygger på. Gratisversjonen viser ikke disse. Begge bygger på samme scener i app/share-video.js (timeline(), regel-id share-video-v1/short|long/…). Boksen skjules i PDF.
- Rune tror den lange videoen blir delt mest, men vil ikke presse rapporten på folk. Gratisvideoen har derfor ingen salgsbudskap; sluttkortet inviterer bare til å ta testen. I gratisboksen står én stille linje om at den lengre versjonen følger med fordypningsrapporten, med lenke.

## Innlogging for å lagre profilen 2026-10-13
- Rune ønsket innlogging med Google, Apple eller X. Anbefalt og bygget: innlogging er valgfri og brukes til å lagre profilen og åpne den igjen på alle enheter. Testen, profilen og videoen virker uten konto, og videoen lages fortsatt i nettleseren.
- Tjeneste: Supabase (innlogging og database i EU), valgt fordi den også kan holde kjøp fra Stripe senere. Rune fikk valget på et beslutningskort; bygget på anbefalingen mens svaret venter.
- Lagret per konto: de 120 svarene som profilkode, språk og tidspunkt. Brukeren kan slette profilen eller hele kontoen fra «Min side». Personvernsiden forklarer dette når innlogging er slått på.
- Rune ønsket innloggingssiden rett etter spørsmålene. Den kommer mellom siste svar og lasteanimasjonen, med Google, Apple og X (de mest brukte i dag; Facebook og Microsoft kan legges til senere) og «Fortsett uten å logge inn», så ingen tvinges.
- Rune valgte Supabase på beslutningskortet 2026-10-13.
- Rune ønsket at videoen skal være det første man ser etter spørsmålene. Når lasteanimasjonen er ferdig, åpnes videokortet som et vindu over gratisprofilen og spiller av seg selv (stillbilde ved redusert bevegelse). Fornavnet fylles inn fra innloggingen når det finnes, og kan endres eller fjernes. «Ikke nå» (eller Esc) lukker vinduet, og kortet står videre på sin vanlige plass i profilen. Vinduet vises én gang per fullført test.
- Rune ønsket bare videoen i vinduet, uten tekst og knapper under, og en delingsknapp (pil, som på TikTok/Instagram) synlig hele tiden. Vinduet viser nå videoen så stor som skjermen tillater, med «Ikke nå ×» over og delingsknappen på selve videoen. Filen lages mens videoen spilles første gang (opptaket er avspillingen), og knappen viser fremdriften som en ring. Trykk før den er klar lager ferdig og åpner delingsmenyen. Telefoner som krever et nytt trykk etter ventetiden får «Trykk for å dele». Uten delingsmeny (PC) laster knappen ned videoen («Lagre»). Kortet i profilen har samme knapp på videoen og beholder fornavnfeltet, bilde-nedlasting og personvernnotatet.
- Oppsett og gjenstående arbeid står i docs/innlogging.md.
- Rune ga 2026-10-13 tilbakemelding på delingsvideoen: logoen manglet i første opptak, sluttbildet bør stå minst 5 sekunder før videoen starter på nytt, man bør se en tidslinje med gjenstående tid og kunne spole, og videoen trenger oppløftende musikk som passer Fem. Endringer:
  - Opptaket venter til logobildene er lastet, så logoen er med fra første gang.
  - Sluttkortet «Hvordan ser din profil ut?» varer 5 sekunder i både kort og lang versjon, også i selve filen, siden Instagram og TikTok også spiller i løkke. Kort versjon er dermed ca. 19 s (15 s innhold + sluttkort), lang ca. 34 s.
  - Spilleren har en tynn tidslinje nederst med gjenstående tid. Man kan spole fram og tilbake, unntatt mens den første avspillingen tas opp som fil.
  - Rune laget sangen «Who Are You?» til videoen (120 BPM, ca. 23 s, laget med Suno) og ba om at den brukes i stedet for musikken jeg først komponerte. Den ligger i app/assets/audio/who-are-you.mp3. Alle klipp ligger på slag (0,5 s), og kort versjon varer like lenge som sangen, så sluttkortet kommer når sangen slutter. Lang versjon spiller sangen fra start og starter den på nytt ved et sceneskifte (fasetten) slik at sangen slutter sammen med videoen. Kommersiell bruk forutsetter at sangen ble laget på et betalt Suno-abonnement, siden sanger fra gratisplanen eies av Suno. Rune bekreftet samme dag at den er laget med betalt abonnement.
  - Musikken tas opp i samme fil som bildet. Nettlesere tillater ikke lyd uten et trykk, så vinduet etter testen spiller og tar opp automatisk bare når lyden er tillatt. Ellers spiller videoen uten lyd, og trykk på delingsknappen tar den opp med musikk. Lydknappen øverst til venstre slår lyden av og på, og lyden slås av når vinduet lukkes.
  - Rune ba også om ett sekund lengre per bilde så tekstene blir lettere å lese. Alle innholdsscener har fått ett sekund til, rundet til slagene i sangen. Kort versjon er nå 23,5 s (18,5 s innhold + 5 s sluttkort), lang 42,5 s.
  - Rune ønsket at logoen bygges i takt med de raske lydene i starten av sangen. Sangen har plukk på hvert åttendedelsslag (0,25 s) fra 0,16 s. Ringen starter på første lyd, hver av de fem logobitene lander på de neste fem med et lite sprett, og ringen lukkes på slaget ved 1,9 s (LOGO_HITS i app/share-video.js). Opptaket venter 0,4 s på første bilde før klokke og sang starter, så starten ikke mister bilder mens koderen kommer i gang.
  - Rune ba 2026-10-16 om at sluttkortet varer 3 sekunder med outroen, og at sitatbildet får 2 sekunder mer. Sitatbildet varer nå 5 s (lang 5,5 s) og sluttkortet 3 s, så lengden er uendret (23,5 s / 42,5 s). I de siste 1,5 sekundene løftes logobitene én og én på sangens åttendedelsslag (samme rutenett som LOGO_HITS, fulgt gjennom sangplanen i lang versjon), og deretter løfter hele logoen seg og toner ut før videoen starter på nytt (outroHits i app/share-video.js).
  - Rune syntes samme dag at løftet startet ca. 0,5 s for sent. Det starter nå ett slag tidligere, ca. 2 s før slutten (21,4 s i kort versjon), og hele logoen løfter seg fra ca. 0,85 s før slutten.
  - Rune syntes trekantene så fysisk feil ut når de gled over ringen. De løfter seg nå mot seeren i stedet: de vokser litt på stedet og kaster en myk skygge, så de blir innenfor ringen. Hele logoen med ringen løfter seg fortsatt samlet til slutt.


## Tilpasset arbeid og hverdag, nytt kjøpsnivå 2026-10-13
- Rune ønsket mer spesifikke råd: noen få spørsmål om hva man jobber med og hvordan hverdagen ser ut (barn, partner, alene osv.), som kobles med fasettene og gir direkte tilbakemelding om hva som hjelper og hva som kan gjøre det krevende. Rune foreslo dette som et høyere nivå til rundt 149 kr.
- Kjøpssiden har to valg: fordypningsrapporten (49 kr / $4.99) og «Fordypning + tilpasset» til 149 kr / $14.99, begge engangskjøp. Rune godkjente nivået, prisen og spørsmålene 2026-10-13 («Vi prøver det»). Dette er et nytt, separat kjøpsnivå; Stripe-pris og opplåsing etter betaling gjenstår. I forhåndsvisningen er alt åpent.
- Øverst i Arbeidsliv og Hverdagsliv står «Tilpasset arbeidet ditt» / «Tilpasset hverdagen din». Arbeid: type arbeid, hvor mye med folk, hvor fast arbeidet er, press og frister. Hverdag: hvem man deler hverdagen med, barnas alder (bare når det er barn), hvor full uka er og hva man ønsker mer av. Valg skjer med ett trykk; resultatet vises når alle er besvart, og svarene kan endres.
- Kobling: faste regler i app/tailored-copy.js (regel-id tailored-v1/…). Hvert svar slår på regler som hver nevner én fasett. Bare fasetter utenfor midtområdet brukes; retningen avgjør «Dette hjelper deg» eller «Dette kan gjøre det krevende». Maks tre per kolonne, fasettene lengst fra 50. persentil først, én fasett én gang per kapittel. Hver linje viser fasetten, persentilen, svaret den kommer fra og ett tiltak.
- Svarene lagres bare i nettleserfanen (sessionStorage) og slettes med «Slett svarene mine». De er ikke med i svarfilen eller profillenken.
- Tekstene er redaksjonelle hypoteser i «kan/trolig»-form, ikke validerte påstander, og skal med i den faglige gjennomgangen av rapportteksten.
- Rune ønsket å vise rabatt, for eksempel 50 %. Ikke gjort: en overstrøket førpris må i Norge/EU være den laveste prisen produktet faktisk er solgt for de siste 30 dagene (og i USA en ekte tidligere pris), og produktet er ikke solgt ennå. 149 kr-valget har i stedet fått merket «Anbefalt». En ærlig lanseringspris («Lanseringspris X kr, deretter 149 kr fra dato») kan legges til når Rune har valgt pris og dato.

## 2026-10-13: Profilfigur og fast fasett i profilvideoen

- Rune likte profilnavnbildet og ba om å ta det med i videoen. Navnebildet viser nå figuren til profilnavnet (samme bilde som i profilen, kvinnelig eller mannlig etter valget i profilen) under navnet.
- Fasettbildet viser fasetten profilnavnet bygger på (den første i navnets id, regel i app/share-video.js), ikke den mest ekstreme av alle 30. Da viser samme profilnavn alltid samme fasett, slik at Rune kan lage én sang per profilnavn som nevner den. Overskriften er «Fasetten som skiller seg mest ut» bare når fasetten også er den mest ekstreme for personen, ellers «Fasetten bak navnet».
- «Who Are You?» brukes fortsatt i alle videoene. Egne sanger per profilnavn kan komme senere.

## Innholdsmenyen i rapporten 2026-10-13

- Rune ønsket litt mer kontrast i innholdsmenyen og en rolig bevegelse som viser hvilket kapittel som er aktivt. Aktivt kapittel har nå litt sterkere bakgrunn, halvfet tekst, mørkere oransje nummer og en tynn aksentlinje som «puster» sakte (3,6 s); en svak lysstripe glir over omtrent hvert niende sekund. Inaktive numre er dempet grå slik at titlene skiller seg ut. På smale skjermer ligger aksentlinjen under fanen. Ved redusert bevegelse står linjen stille og lysstripen vises ikke.

## Fem nivåer, styrker og svakheter på trekkortene i Arbeidsliv og Hverdagsliv 2026-10-15
- Rune spurte hvor mange versjoner kortene har (tre per trekk og kapittel: lavere, midt, høyere; 30 tekstsett og 10 bilder, der bildene viser midtmetaforen) og ba om flere tekster og ordtak, og styrker og svakheter i hver sin kolonne.
- Kortene følger nå de samme fem nivåene som fasettkortene: Mye lavere (under 10. persentil), Lavere (10–30), Midt (30–70), Høyere (70–90) og Mye høyere (over 90). De ytre nivåene krever også at nivåordet peker samme vei, og uten normtabell brukes de tre gamle nivåene. 20 nye kort med ordtak, tekst og Prøv er skrevet på begge språk (app/context-levels.js). Regel-id context-v2/….
- Hvert kort har to kolonner, «Styrker» og «Svakheter», med tre punkter hver for alle fem nivåer. Tonen er vennlig, men ærlig: svakhetene beskriver hva som kan bli krevende, ikke diagnoser eller verdidommer.
- Bilder: 40 nye trengs (fire nivåer × fem trekk × to kapitler). Liste med filnavn og motiv i prosjektmappen trekkort-bilder/bildeliste.md. Kortet bruker det nye bildet når filnavnet er lagt inn i levelArt i app/context-levels.js, ellers dagens bilde.
- Tekstene er redaksjonelle og skal med i den faglige gjennomgangen.

## Trekkortene som bildekort med panel 2026-10-15
- Rune sendte en skisse for Hverdagsliv («skulle vi prøvd noe sånt?»): en rad med store bildekort (trekk, nivå, ordtak, +/−), og et panel under raden når man velger ett.
- Begge kapitlene (Arbeidsliv og Hverdagsliv) bruker nå dette: tre kort per rad på PC, to på nettbrett og ett på mobil. Det første kortet er åpent. Ett panel er åpent om gangen, og et nytt klikk på samme kort lukker det.
- Panelet viser første setning av teksten som overskrift, resten som brødtekst, «Les mer om dette» med Styrker og Svakheter, og Prøv-boksen til høyre (under på mobil). Innholdet er det samme som før; bare oppsettet er endret.
- Ved utskrift vises alle paneler med styrker og svakheter.
- Endret samme kveld (Rune: «har et kollapseable på den, men selve metaforen kan vises»): alle kortene starter lukket, så bare bildet, trekket, nivået og metaforen synes. Tekst, «Les mer» og Prøv-boksen åpnes med + på kortet.

## Nye hverdagsbilder og valg av kvinne/mann for bildene 2026-10-15
- Rune sendte seks nye illustrasjoner i skarp profilstil til Hverdagsliv: Åpenhet (steget mellom blokkene), Planmessighet (kart og kompass) og Ekstroversjon (åpne døren), hver med kvinne- og mannsversjon. De ligger i app/assets/design/context/female/ og male/.
- Rune: «Hvis brukeren velger "mann" eller "kvinne" i begynnelsen, skal da alle bildene tilpasses» for Hverdagsliv og Arbeidsliv; gratisprofilen og «Dine 5 trekk» beholder blandede bilder. Svar «Ja» på forslaget om et tredje valg og at valget bare brukes til bilder.
- Forsiden og toppen av Arbeidsliv og Hverdagsliv har nå et valgfritt «Bildene i rapporten viser: Kvinne / Mann / Vil ikke oppgi». Valget lagres i nettleseren (localStorage, fem-report-figure-v1) og bytter bildene med en gang. Det brukes aldri til skåring; persentilene sammenlignes fortsatt med hele normgruppen.
- Uten valg eller med «Vil ikke oppgi» vises en fast blanding: Åpenhet, Ekstroversjon og Følelsesmessig reaktivitet med kvinne, Planmessighet og Medmenneskelighet med mann.
- Mangler et bilde, brukes nivåbildet, så midtbildet i valgt versjon, og til slutt det gamle felles bildet. Bildeliste med begge versjoner: trekkort-bilder/bildeliste.md i prosjektmappen (94 bilder gjenstår, de 40 ytterste først).
- Profilfiguren i gratisprofilen har fortsatt sitt eget Kvinne/Mann-valg.
## 2026-10-14: Ærligere tekster til profilfigurene

- Rune reagerte på at «Den tørrvittige lærlingen» ble beskrevet som «alltid klar for å lære mer», mens lav mestringstro (C1) heller handler om å vegre seg for utfordringer. Rune: «Skjønner at vi skal være snille, men vi må være litt mer ærlige om antatt svakheter og styrker.»
- Alle 91 beskrivelser (app/profile-name-copy.js) og 30 avslutningslinjer i videoen (signatureLines i app/profile-name.js) er gått gjennom mot hva hver IPIP-NEO-fasett faktisk måler. 76 beskrivelser og 7 videolinjer er skrevet om. Regelen er: teksten påstår bare det fasettene måler, og nevner den sannsynlige ulempen ved polen ved siden av styrken, i en vennlig tone.
- Navnene er beholdt, men to adjektiver påsto mer enn fasetten måler: E6l «tørrvittige/Deadpan» er nå «alvorlige/Serious» (lav munterhet måler lite glede og latter, ikke vidd), og C2l «kreativt kaotiske/Creatively Chaotic» er nå «kaotiske/Chaotic».
- Etter gjennomgangen «profilen skal ikke si imot Big Five-skårene» (2026-10-15) er flere navneord byttet, fordi de enten er de samme ordene appen bruker om hele trekk (og kan si det motsatte av kortene og videoen) eller beskriver en annen fasett: O5h «nysgjerrige» → «filosofiske», O1l «jordnære» → «konkrete», N6h «følsomme» → «lett overveldede», C1l «ydmyke» → «usikre», N5h «livsglade» → «nytelsesglade», E5l «fredelige» → «trygghetssøkende», A3l «selvhjulpne» → «selvfokuserte», C4l «tilfredse livsnyteren» → «nøysomme hengekøyeboeren» (Bon Vivant → Hammock Dweller, passer bildet), signaturen C4h+A5h «Den stille stjernen» → «Den beskjedne måljegeren». «Klippen alle ringer til» beholdes: bildet er en klippe, og «en klippe» betyr her pålitelig (pliktfølelse). Substantivet «selvbergeren» (A3l) beholdes inntil faglig vurdering.
- Videoen bruker en egen avslutningslinje når alle fem trekk ligger i midten men en fasett skiller seg ut (navnet bygger på den): «Midt på treet i det store. Ikke i detaljene.» «Irriterende allsidig» brukes bare når ingen fasett skiller seg ut.
- Før/etter-liste: /mnt/project-files/profilnavn/aerligere-beskrivelser.md (delt prosjektmappe, ikke i Git). Tekstene er fortsatt merket for faglig gjennomgang.

## Korrektur av all norsk tekst 2026-10-15
- Rune: «Ta å gå gjennom ALT på norsk og gjør dobbelsjekk at det stemmer grammatisk. bytt ut fremmedord med lettere ord også dersom det lar seg gjøre.»
- 124 rettelser i appens norske tekst (grammatikk, komma, anglisismer og enklere ord, for eksempel rigid → stiv, empatisk → innlevende, komfortabel → trygg/greit). Faste fagord beholdes: persentil, fasett, trekk og trekknavnene. Før/etter-lister: korrektur/ i prosjektmappen (ikke i Git).
- Beskrivelsen av fasetten Beskjedenhet (A5) er rettet fordi den pekte motsatt vei.
- Testspørsmålene (data/questions-no.json): Rune valgte «Bare skrivefeil». Fem rene skrive- og grammatikkfeil er rettet (nr. 21 «Har lett for å overdrive ting», 59 «dem som», 74 «overfor», 83 «ideer», 111 «i stand til å»). Ordlyden ellers er lik den attribuerte oversettelsen; endringene og ny kontrollsum står under norwegianLocalEdits i data/provenance.json. De sju forslagene som endrer ordlyd, er ikke tatt med.
- Andre runde samme dag: 36 rettelser i tekst som kom inn med senere sammenslåinger (de nye «svært lav/svært høy»-tekstene, fasettsammenligningen, kombinasjonslinjene og en videolinje), for eksempel «sluttet deg til» → «var enig i» og «fair play» → «redelighet».
- Tredje runde etter karriereprototypen (#45): 29 rettelser i karrieretekstene (for eksempel «opp i fistel» → «opp i harnisk», «buffer» → «litt ledig tid», «repetitive» → «ensformige») og fotnoten i språkvalget («hver for seg ovenfor»).


## 2026-10-15: Profilen skal ikke si imot skårene

- Rune ba om en gjennomgang av at profilen aldri blander sammen eller sier det motsatte av det Big Five-skårene (trekk og fasetter) viser. Gjennomgått med 20 000 simulerte svarsett (realistiske, sprikende, tilfeldige og alle-like) på begge språk: skåring og omvendte utsagn, persentiler og nivåord, fasett-til-trekk, profilnavn, kort, kombinasjon, video, tilpasset arbeid/hverdag og fasettekstene.
- Skåringen var riktig: alle 30 fasetter går riktig vei, også omvendte utsagn, og nivåordene følger persentilen.
- Videoen kunne si «Mer stillferdig enn 97 av 100» og rett etter vise «Vennlighet, persentil 97 · Ekstroversjon». Tallscenen brukte trekket lengst fra midten, ikke trekket profilnavnet bygger på, slik beslutningen om profilvideoen sier. Nå viser den trekket navnets fasett hører til når det peker samme vei som fasetten; ellers trekket lengst fra midten som ikke sier imot fasettscenen. Avslutningslinjen følger samme trekk. Regel i app/share-video.js.
- Kortet «Ditt høyeste trekk» i «Din profil på ett blikk» viste trekket med høyest persentil, også når alle lå under midten (for eksempel Ekstroversjon på 31. persentil som «høyeste»). Det gjaldt omtrent hver tredje simulerte profil. Kortet heter nå «Trekket som skiller seg mest ut» og viser trekket lengst fra midten i begge retninger, på samme måte som fasettkortet ved siden av.
- To norske utsagn betydde noe annet enn originalen. N5 «Rarely overindulge» var «Hengir meg sjelden til noe eller noen» (handler om hengivenhet, ikke måtehold) og er nå «Tar sjelden for mye av det gode». E5 «Enjoy being reckless» var «Liker å være uansvarlig» (ligner planmessighet) og er nå «Liker å være dumdristig». Dette avviker fra upstream-oversettelsen; ID, fasett og nøkkel er uendret, som ved E3-rettelsen.
- Når alle fem trekk ligger i midten, sa teksten «nær midten av svarskalaen», men nivået følger persentilen. Nå: «Alle fem trekkene ligger i midtområdet».
- Ordvalg i profilnavnene som kan krasje med trekkordene (for eksempel «Den nysgjerrige …» fra intellekt mens Åpenhet er lav og videoen sier «Mer jordnær») hører til arbeidet med profilnavnene og er skrevet ned i /mnt/project-files/profilnavn/navn-mot-skarer.md (delt prosjektmappe, ikke i Git).
- Rune la merke til at «Direkte» og «Sier ifra hvis du har spinat mellom tennene» gikk igjen i tilfeldige testprofiler. Årsaken var testsnarveien, ikke rapporten: den ga hvert utsagn et tilfeldig svar fra 1 til 5, og et gjennomsnitt rundt 3 ligger godt under medianen i referansegruppen for Medmenneskelighet (alle svar 3 gir 9. persentil) og Planmessighet (12. persentil). Derfor ble 95 % av tilfeldige profiler lave på begge. Snarveien trekker nå svar som ligner en person fra referansegruppen (sampleAnswers i app/norms.js), så lavere, midt og høyere kommer omtrent en tredjedel hver. Ekte brukere var aldri berørt. Hvert trekk og hver retning har én avslutningslinje i videoen, pluss 30 signaturlinjer.
- Rune 2026-10-15: «MÅ være MANGE flere kombinasjoner … skal folk dele må ikke samtlige få den samme», og ønsket flere varianter. Bygget:
  - Avslutningslinjen i videoen følger nå fasetten substantivet i profilnavnet kommer fra, med én linje per fasett og retning (60, facetClosers i app/share-video.js). Signaturnavn beholder sin egen linje. Linjene påstår bare det fasetten måler. De fem trekklinjene brukes bare når navnet ikke bygger på noen fasett.
  - Kombinasjonskortet får en setning for den mest særpregede fasetten som peker samme vei som trekket sitt («Det synes mest i mestringstro: du kan tvile på om du får til en oppgave.»), 60 linjer i app/combination-copy.js. Den lange videoen viser fortsatt bare parsetningen, så teksten får plass.
  - Med 10 000 realistiske tilfeldige profiler: avslutningslinjer 41 → 90 ulike (vanligste 7 % → 1,9 %), kombinasjonstekster 41 → 541 (vanligste ca. 3 % → 0,7 %), 2327 profilnavn, og 2895 ulike kombinasjoner av navn, tall og linje i videoen. Alle nye tekster er redaksjonelle og skal med i den faglige gjennomgangen.
- Rune spurte hvor mange versjoner fasettkortene har (tre: lavere, midt, høyere). Hver av de 30 fasettene har nå i tillegg en egen, tydeligere tekst under 10. persentil (veryLow) og over 90. persentil (veryHigh) i report-content.json og report-content-no.json, så 3. og 28. persentil ikke lenger får samme tekst. Nivåmerket (Lavere/Høyere) er uendret; regel-id slutter på /veryLow eller /veryHigh. Bygget på anbefalingen mens Runes svar på beslutningskortet venter. Tekstene skal med i den faglige gjennomgangen.
- Rune valgte 2026-10-15 fem tekstnivåer per fasett (veldig lav, litt lav, midt, litt høy, veldig høy), slik det allerede var bygget med grensene 10, 30, 70 og 90. Han ønsket også «X av 100» på fasettkortene. Hvert fasettkort (og fasetten i gratisprofilen og i «Din profil på ett blikk») viser nå én setning som «Ut fra svarene dine blir du sjeldnere irritert enn omtrent 77 av 100.» Fra 50. persentil brukes den høye polen med persentilen, under 50 den lave polen med 100 minus persentilen, så en lav skåre aldri leses som mangel. Setningene står i app/facet-compare.js og skal med i den faglige gjennomgangen. Rune ønsket i tillegg tallet vist som 100 små personer under setningen, med de N første i trekkfargen og «N av 100 personer» under (compareHtml i samme fil), på alle fasettkort.

## 2026-10-15: «Din jobb, din profil» som prototype i 149 kr-nivået

- Rune vil at tilpasningen etter kjøp kan bli mesteparten av produktet: valgfrie spørsmål etter de 120, bare for dem som kjøper 149 kr-pakken. Konseptet (8 jobbspørsmål, rapportkapittel, tre eksempler) ligger i /mnt/project-files/tilpasset-149/konsept-arbeid.md. Rune: «Dette er veldig bra! Vi prøver den.»
- I Arbeidsliv erstatter «Din jobb, din profil» (app/career.js, app/career-copy.js) de fire spørsmålene i «Tilpasset arbeidet ditt». Hverdagsliv beholder sine spørsmål til jobbversjonen er testet.
- Spørsmålene vises ett og ett, med automatisk overgang ved enkeltvalg og «Videre» der man kan velge opptil to. Rune ba om flere valg og «Annet» med «spesifiser»: alle åtte spørsmål har nå 1–2 ekstra valg og «Annet» med et valgfritt tekstfelt på inntil 80 tegn (da må man trykke «Videre»). På arbeidsspørsmålet heter valget «Noe annet (skriv yrket ditt)», og yrket (for eksempel «kiropraktor») vises i stedet for valget. Ingen regel bruker fritekst; teksten vises tilbake og går med til AI-skrivingen.
- Faste regler velger hva kapittelet sier: hver påstand kobler ett svar med én fasett utenfor midten (persentil under 30 eller over 70) og har en regel-id. Tapper/energi-svar som ingen fasett forklarer, får en linje om at det trolig handler mer om situasjonen.
- Teksten kan skrives om av en språkmodell (Claude, via /api/career-report og lib/career-llm.js). Modellen får bare de valgte fakta (fasettkoder, persentiler, avkrysninger og regelteksten), og hvert punkt den skriver, sjekkes: det må vise til fasetter og svar som ble sendt for den delen, ellers brukes regelteksten. Ingen navn eller e-post sendes; det eneste frie er «Annet»-teksten, og siden ber brukeren ikke skrive navn eller helseopplysninger der. Systemprompten sier at den teksten bare er kontekst, aldri instruksjoner. Uten ANTHROPIC_API_KEY på serveren vises regelteksten.
- Testprofil: «Runes profil» ved siden av «Tilfeldig» (app/dev-profile.js) fyller svar som gir Runes oppgitte nivåer (lav reaktivitet, svært høy åpenhet, resten midt eller litt over). Fasettene er et anslag. Fjernes sammen med «Tilfeldig» før lansering. Knappen «Skriv med AI (test)» vises også bare bak samme testflagg (showRandom), så vanlige besøkende ikke kan utløse API-kostnader.
- Før lansering må reglene og AI-teksten gjennomgås faglig, personvernerklæringen nevne Anthropic som databehandler, og endepunktet få bruksbegrensning slik at det ikke kan misbrukes til å bruke opp API-kreditt.

## 2026-10-15: «Nyansene bak skårene» bak et pluss

- I rapportoversikten vises de tre kortene (trekket som skiller seg mest ut, fasetten som skiller seg mest ut, kombinasjonen) med en gang. «Nyansene bak skårene» gjentar mye av det samme og er nå lagt bak en rad med + som åpnes ved trykk, som radene i «Dine fem trekk». Utskrift viser alltid innholdet. Runes beslutning.

## 2026-10-15: Oversiktlig oppsett for jobbkapittelet

- Rune ba om at «Arbeidsliv og karriere» skulle se mer ut som skissen hans (01-overblikk): «mer oversiktelig». Etter at spørsmålene er besvart viser kapittelet nå «Din jobbkontekst» i toppen av kapittelet (yrket eller arbeidstypen, hvordan man jobber med andre og eventuelt lederansvar, med «Endre»), deretter to kolonner: til venstre «Dette kan fungere godt» og «Dette kan bli krevende», til høyre «Din energi» og «Prøv én ting denne uken» med avkrysningen «Jeg skal prøve dette». Hver blokk har en kort overskrift (emnet for svaret den bygger på), én forklaring, fasettene som merker og «Les mer» med prøv-forslaget, hvilket svar det kommer fra og de andre punktene.
- Resten (det som tapper deg, når du leder, neste steg og hva du bør se etter) ligger sammenfoldet under «Hvordan henger dette sammen med trekkene dine?». Trekkortene står som før under kapittelet. På mobil stables alt i én kolonne. Ved utskrift foldes alt ut.
- Rune spurte om «Det skurrer» var feil for «Litt av begge» med lav Orden. Det var det: en blandet arbeidsdag skurrer ikke mot lav Orden, så regelen gjelder nå bare «Prosjekt for prosjekt». «Krevende» skal bare vise svar og fasetter som tydelig drar mot hverandre (står også i AI-prompten). Finnes ingen slik, viser blokken det sterkeste punktet fra «Det som tapper deg». Fasettmerkene sier retningen med ord («Orden: lav») i stedet for HØYERE/LAVERE. Formuleringen av «X av 100» tas i tråden «Tall som er lette å forstå».
- Prøv-forslaget hentes fra «krevende» først, så «tapper», «passer» og «energi». Avkrysningen lagres bare i nettleserfanen.

## 2026-10-15: Ny logo

- Rune valgte 2026-10-15 en ny logo: fem teksturerte papirtrekanter i virvel. Kantene er rensket, krem-trekanten er gjort litt mørkere med en tynn beige kant så den synes på lys bakgrunn, og trekantene står med jevne mellomrom (72°) rundt midten. Logoen brukes i toppfeltet og bunnfeltet (bilde + «Fem» i Georgia), i lasteanimasjonen, i rapporthodet og i delingsvideoen (app/assets/design/logo-mark.webp og logo-piece-*.webp). Trekkbitene (tri-*.png) er uendret. Favikon og app-ikoner bruker en flat vektorversjon uten tekstur (app/assets/icons/). Kilde og skript ligger i prosjektmappen logo-ny.
  - I delingsvideoen popper logoen litt mot seeren (8 %) etter at ringen er lukket, rett før den flytter seg opp til navnescenen (LOGO_POP i app/share-video.js).

## 2026-10-15: Toppkortene i «Din profil på ett blikk» i samme stil som trekkortene

- Rune likte de skrå bildekortene i «Utforsk trekkene dine» og sa ja til å bruke stilen på de tre toppkortene i rapportoversikten. Trekket som skiller seg mest ut, fasetten som skiller seg mest ut og kombinasjonen står nå som en rad med tre bildekort (trekkbildet, fasettbildet og profilfiguren). Teksten ligger bak «+» og åpnes i ett felles leseområde under raden, ett kort om gangen. Utskrift og PDF viser alle tre.
- «Medmenneskelighet» brøt midt i ordet på smale trekkort. Navnet skaleres nå etter kortbredden så det lengste ordet får plass på én linje, og lange trekknavn har myke bindestreker som reserve, så et brudd alltid får bindestrek.

## 2026-10-15: «X av 100» bruker alltid samme tall som persentilen

- Rune syntes «lavere enn hos 73 av 100» ved 27. persentil var forvirrende. Tallet i setningen og figuren er nå alltid persentilen selv, uttrykt i mennesker, ikke prosent: «Når det gjelder orden, skårer du høyere enn omtrent 27 av 100 mennesker, så du ligger litt lavere enn de fleste.» Over 70 brukes den høye polen («… liker du mer orden enn omtrent 85 av 100 mennesker»). Figurteksten sier «27 av 100 mennesker skårer lavere enn deg» (app/facet-compare.js, brukt på fasettkortene, i gratisprofilen og i oversikten).
- Jobbkapittelets AI-tekst følger samme regel (lib/career-llm.js). Delingsvideoen er ikke endret ennå.

## Nye fasettbilder for Åpenhet i kvinne/mann 2026-10-15
- Rune sendte tolv bilder i den nye fasettstilen (O1 Fantasi til O6 Liberalisme, hver i kvinne- og mannsversjon): «legg de inn hvor de skal». De ligger i app/assets/design/facets/female/ og male/, med bakgrunnen gjort gjennomsiktig og beskåret slik som de gamle fasettbildene.
- Fasettkortene følger valget Kvinne/Mann. Uten valg brukes standardversjonen fra Runes manifest (O3 og O6 mann, resten kvinne); app/facet-art.js. Den nøytrale filen facets/O1–O6.webp er erstattet med standardversjonen, så andre steder som viser fasettbilder, også får den nye stilen.

## Trekkikoner som logobiter og ny topp i rapportoversikten 2026-10-16
- Rune ba om at trekantikonene ved trekkene skal se ut som bitene i logoen, med samme 3D-følelse. Alle trekkikoner i gratisprofilen og rapporten bruker nå logo-piece-*.webp (Åpenhet sky, Planmessighet aprikos, Ekstroversjon stål, Medmenneskelighet elfenben, Reaktivitet marine), samme biter og retning som trekkbåndet på den nye forsiden. tri-*.png brukes fortsatt i varder, innloggingssteget og delingsvideoen.
- Rapportens «Oversikt» starter nå med samme topp som gratisprofilen (Personlighetsprofil, profilfiguren med Kvinne/Mann, navn og forklaring). Overskriften «Din profil på ett blikk», profilfigurlinjen og forklaringsteksten over radaren er fjernet; «Hva betyr persentilen?» ligger under radarlegenden.
- Samme dag: «Utforsk rapporten» heter nå «Utforsk rapporten din», kortene Arbeidsliv og karriere og Hverdagsliv har Runes nye illustrasjoner (report-work.webp, report-life.webp), og lenkene sier «Se hva det betyr for deg» i stedet for «Les kapittel», fordi kapitlene er visuelle å utforske og ikke lange tekster.
## Ny forside etter Runes mockup 2026-10-16
- Forsiden følger mockupen Rune delte 2026-10-16 («lag den akkurat som den er på bilde»): hovedbilde med paret, plante og fasetter, båndet «Fem trekk. Din kombinasjon.» med søyler, «Hva vil du forstå bedre?» med tre bildekort og et lyseblått avslutningsfelt. Hovedbildet og kortbildene er hentet fra mockupen (app/assets/design/home-*.webp), med teksten fjernet.
- Logoen er dagens logo, ikke den i mockupen. Trekantene i trekkbåndet og i avslutningsfeltet er logobitene, vendt som i logoen (Åpenhet himmelblå, Planmessighet aprikos, Ekstroversjon stålblå, Medmenneskelighet elfenben, Følelsesmessig reaktivitet marine).
- Knappene heter «Start testen» (Runes valg).
- Hovedbildet og trekkbåndet skal synes ved innlasting på vanlig PC-skjerm (1440×900). Sideteksten nede til venstre skjules på lave skjermer for å få plass.
- «Relasjonene dine» står som i mockupen. Hverdagslivkapittelet tar med partner og familie når brukeren oppgir det.
- Valget «Bildene i rapporten viser» er tatt bort fra forsiden og finnes fortsatt øverst i Arbeidsliv og Hverdagsliv.
- Oppfølging samme dag etter Runes mobilskjermbilde: tittelen er «Ingen boks. Bare deg.» («No box. Just you.»), som erstatter «Du er mer enn én type». På mobil samles lenkene og språk/land bak en menyknapp ved logoen, og teksten er strammet opp. «Start testen»-knappene har trekantfasetter i logofargene.

## 2026-10-16: Innlogging kreves før resultatene

- Rune: «de MÅ logge inn», etter 10–15 minutter på testen. Når innlogging er koblet til (Supabase), må man logge inn før lasteskjermen, gratisprofilen, rapporten og profillenker (#p=…) vises. Eksempelrapporten (#demo) er åpen.
- Innloggingsskjermen er kopiert fra Codex-skissen Rune valgte: logoen og «Fem» øverst, «Testen er fullført», «Lagre profilen din», én linje, Google-knapp, og Personvern nederst. Lenken for å hoppe over er fjernet.
- «Logg inn uten Google» åpner et e-postfelt og sender en innloggingslenke (Supabase magic link). Svarene legges i localStorage til lenken er brukt, så de overlever at lenken åpnes i en ny fane. Lenken må åpnes i samme nettleser.
- 2026-10-20: E-posten har også en sekssifret kode som skrives inn på siden der man ba om innlogging (verifyOtp). Grunn: Rune sin bror tok testen i Messenger sin nettleser, lenken åpnet seg i en annen nettleser og feilet («code verifier should be non-empty»), og svarene ble ikke lagret. Koden virker uansett hvilken app e-posten leses i. Åpnes lenken i feil nettleser, forklarer siden det og ber om koden. Krever {{ .Token }} i Supabase-malene «Magic Link» og «Confirm signup».
- 2026-10-20 (Rune: «120 spm uten å se resultatet er kriiiise»): ferdige svar holdes i localStorage i 24 timer mens man logger inn, så de overlever at Messenger-nettleseren lukkes. Kodefeltet og e-postadressen vises igjen når man kommer tilbake. I nettlesere inne i Messenger, Facebook, Instagram og TikTok skjules Google (Google avviser innlogging der), og e-postkoden åpnes med en gang. Feiler innloggingen (e-posten kan ikke sendes, lenken feiler, eller koden er feil to ganger), får man knappen «Se resultatet mitt» og kan lagre senere under Min profil.
- I lokal forhåndsvisning uten Supabase (?dev=1) finnes en merket lenke forbi skjermen, bare for testing.

## 2026-10-16 – Trekkene som logo, fasettknapper og to mockuper
- Rune: listen med de fem trekkene byttes ut med logoen. Hver logobit er ett trekk og viser persentil og nivå; trykk løfter biten ut og åpner trekket med fasettene under. Gjelder «Dine fem trekk» i rapporten og «Utforsk trekkene dine» i gratisprofilen. På mobil fyller logoen hele bredden.
- Alle knapper bruker forsidens fasettknapp (marine fasetter med aprikoshjørne). Lyse papirfasetter for sekundærknapper, aprikos der siden allerede brukte aprikos.
- Flate trekanter er byttet med logobitene (kjøpssiden, «En mulig styrke», vardene og trekkikonene i delevideoen).
- Under 100-figurene på fasettkortene står ikke lenger «N av 100 mennesker skårer lavere enn deg», fordi setningen over sier det samme.
- Kjøpssiden og «Din styrke»/«Prøv i hverdagen» er kopiert fra Runes Codex-mockuper. Illustrasjonene er klippet fra mockupene. Kapittelbytte i rapporten bruker knappen «Fortsett utforskningen» med neste kapittel under.
- Rune: samme bokser og kanter i hele appen. Kort og bokser bruker felles variabler i app/design.css (`--box-*`, `--field-*`): tynn kjølig kant, 14 px hjørner og en svak skygge, hentet fra svarkortene i mockupen av spørsmålssiden. Nye kort skal bruke variablene.

## Spørsmålssiden i ny stil (2026-10-16)
- Rune likte Codex-skissen av spørsmålssiden på mobil. Svarene er nå myke kort (tynn lys kant, avrundede hjørner, svak skygge) med en pil til høyre, uten runde valgsirkler til venstre (Runes ønske). Fremdriften vises som fem segmenter med prosent og tall. Tilfeldig/Runes profil har ikoner.
- Rune vil ha samme bokser og kanter i hele appen. Svarkortene bruker de felles `--box-*`-variablene fra PR #63 (med samme verdier som reserve til den er merget).
- Landskapet nederst beholdes til nytt bilde er laget (bildeoppdrag). Automatisk overgang ved valg er uendret.

## 2026-10-16 – Stilsjekken rettet (stilsjekk/avvik.md)
- Bokser, merknader, ferskenbokser («Ett lite steg å prøve», «En plassering, ikke en fasit»), toppkort, bildekort i «Utforsk rapporten din», valgknapper og innloggingsknapper bruker nå de felles `--box-*`/`--field-*`-variablene. Ingen nye kombinasjoner av kant, hjørner og skygge.
- «Ett lite steg å prøve» bruker samme ferskenkort med lyspære som «Prøv i hverdagen»; papirflyet er byttet med logobiten.
- Nedtrekkslister for språk og land er felt (10 px, `#cfd9e4`). Pluss i sirkel overalt. Del-video-boksen har marg på mobil. Tomrommet under første jobbspørsmål er fjernet.
- Åpne spørsmål venter på Rune: bildekortene på forsiden uten boks (1.1) og rutersymbolet i «Gå dypere»/«Prøv i hverdagen» (F11). Spørsmålssiden (2.1, 2.2) tas i den tråden.

## 2026-10-16 – Fordypningsrapporten tydeligere på gratisprofilen
- Rune: «Fordypningsrapporten må være mer markert og synlig.» «Gå dypere» er nå en ferskenboks med illustrasjonen fra kjøpssiden, en kort linje om innholdet og den fasetterte hovedknappen. Rutersymbolet er ikke lenger brukt der.
- Forklaringen av persentiler og ordene lavere/midt/høyere ligger bak «Les mer om tallene». Teksten under e-postfeltet er fjernet.
- Hopp-til-innhold-lenken er helt skjult til den får tastaturfokus.

## 2026-10-16 – Oversikt uten «Utforsk rapporten din»
- Rune: kortene for Arbeidsliv og Hverdagsliv trengs ikke på Oversikt, de kommer på sine egne faner. Overskriften og de to kortene er fjernet; «Ett lite steg å prøve» og forbeholdet står.

## 2026-10-16 – Lasteskjerm når fordypningsrapporten åpnes
- Rune spurte om det skal komme en lasteskjerm når man går til fordypningsrapporten. «Utforsk fordypningsrapporten» fører fortsatt til kjøpssiden. Kjøpsknappene der («Få hele rapporten» og «Få den tilpassede rapporten») går nå via en kort overgang (#opening) der logobitene samles og det faktiske innholdet nevnes: 30 fasetter med persentiler, arbeidsliv og karriere, hverdagsliv, ukeplan med tre eksperimenter, og at rapporten kan lagres som PDF. Etterpå åpnes rapporten (tilbakeknappen går til kjøpssiden).
- Rune 2026-10-16: overgangen skal føles som at noe jobbes hardt med. Den har nå en teller fra 0 til 100 % som går ujevnt, og logobitene hever seg én om gangen mens tilhørende linje dukker opp (ca. 6 s, 1,6 s med redusert bevegelse).
- Ingen sidetall nevnes. PDF-en er nettleserens utskrift av rapporten, ikke et eget designet dokument, og lengden varierer.

## 2026-10-16 – Alle bilder i fasettstil fra Codex, og to metaforer per trekkort
- Rune leverte FEM-bilder.zip fra Codex (laget etter bildeoppdrag/ i prosjektmappen): 257 bilder. Erstattet: trekkpanelene (trait-O…N), trekkbåndene (facets/head-*, strength-O), kapittelhodene (context/*-head), kjøpsbildene (offer-*, ikke i bruk nå) og landskapet på spørsmålssiden. Nye: alle 94 trekkort og 48 fasettbilder (C, E, A, N) i kvinne- og mannsversjon.
- Standardversjon for fasettene uten valg (`facetFigure`) følger figurene i de gamle bildene; `facets/{kode}.webp` er en kopi av den.
- Hvert trekkort har nå en andre metafor med eget bilde (`{kapittel}-{trekk}-{nivå}-2`, tekst i `altQuotes` i app/context-levels.js). Hvilken leseren ser, er fast ut fra råskåren (`contextVariant`): samme svar gir alltid samme kort, mens folk på samme nivå ofte ser ulike. Arbeidsliv og Hverdagsliv veksler, så hver leser ser begge slags. Teksten under kortet er den samme for begge. Metaforene er fra bildeoppdrag/2-nye-metaforer.md og trenger faglig og språklig gjennomgang sammen med resten av rapportteksten.

## 2026-10-16 – Hverdagsliv og relasjoner som eget tilpasset kapittel
- Rune ba om en ærlig vurdering av Arbeidsliv, Relasjoner og Hverdagsliv. Vurderingen: jobbkapittelet holder til testing, Hverdagsliv var for tynt (4 spørsmål, 20 regler, i snitt 3,4 linjer), og relasjoner fantes ikke som innhold selv om forsiden og kjøpssiden lover det. Utkast i Claude Docs: «Everyday life & relationships: questions and rules».
- Rune: «merge» (ett kapittel, relasjoner som en del av Hverdagsliv) og «just build it, we'll have someone test it later». Behold design, UI og UX fra de siste PR-ene.
- Kapittelet heter Hverdagsliv og relasjoner / Everyday life & relationships. Hvis man har kjøpt 149 kr-nivået, svarer man på åtte spørsmål (hvem man deler hverdagen med, barnas alder når det er barn, hvilken relasjon man vil ta vare på, det sosiale livet, hva som skjer ved uenighet, hvor full uka er, hva som tapper, hva som gir energi, hva man vil endre). Alle har «Annet» med kort tekst.
- Resultatet har samme oppsett som «Din jobb, din profil»: «Din hverdag» i kapittelhodet, «Dette hjelper deg», «Dette kan bli krevende» og «Deg og de nærmeste» til venstre, «Din energi» og «Prøv én ting denne uken» til høyre, og «Når dere er uenige», «Det som tapper deg» og «Ditt neste steg» sammenfoldet. Det gamle «Tilpasset hverdagen din» er fjernet.
- Reglene bygger på at egen nevrotisisme, medmenneskelighet og planmessighet er de personlighetstrekkene som tydeligst henger sammen med tilfredshet i nære relasjoner (Malouff mfl. 2010). Én fasett forklares bare én gang i de fire synlige delene. Teksten beskriver fasetten med vanlige ord («du bekymrer deg mer enn de fleste»); fasettnavnet står i brikken ved siden av. Rapporten sier aldri noe om partnerens eller barnas personlighet.
- Med tilfeldige realistiske profiler og svar får 9 av 10 minst fire punkter i de synlige delene (mot i snitt 3,4 linjer før).
- «Å møte noen nye» er med som valg (standardvalg mens Rune ikke har svart); reglene handler om sosial energi og trygghet, ikke dateråd.
- Tekstene er redaksjonelle og skal med i den faglige gjennomgangen og testen med 5–10 personer.


## 2026-10-17 – Norske svaralternativer: «Stemmer …»
- Rune: «ganske» leses sterkere på norsk enn «moderately», så trinn 4 føltes nær «svært». De norske svarene er nå «Stemmer svært dårlig», «Stemmer nokså dårlig», «Stemmer verken godt eller dårlig», «Stemmer nokså godt» og «Stemmer svært godt» (var «Svært unøyaktig» … «Svært nøyaktig» fra upstream-oversettelsen). «Nokså» er mildere enn «ganske», og «stemmer» er mer naturlig enn «nøyaktig» om seg selv.
- Engelsk er uendret (standard IPIP-ankre). Skåringen 1–5 er uendret. Ordlyden er en redaksjonell vurdering, ikke en validert norsk skala, og avviker fra upstream-oversettelsen.
- Målt på mobil (390 × 664): svarknappene har samme høyde og plassering som før.

## 2026-10-17 – «Liker … veldig godt» i stedet for «Elsker»
- Rune: «Bytt ut "elsker" med liker veldig godt. Passer bedre i alle spm.» Sju utsagn er endret («Love …» i originalen), for eksempel «Liker veldig godt å hjelpe andre» og «Liker livet veldig godt».
- E2 «Talk to a lot of different people at parties» er nå «Snakker med mange forskjellige folk på fester» (var «i selskapslivet»). A4 «Love a good fight» er nå «Liker en god krangel veldig godt» («kamp» ble lest som idrett). O5 «Love to read challenging material» er nå «Liker veldig godt å lese utfordrende tekster».
- O2 «See beauty in things that others might not notice» er nå «Ser det vakre i ting …» (var «Ser skjønnheten i ting …»), etter Runes ønske.
- N5 «Rarely overindulge» er nå «Overdriver sjelden med mat, drikke eller andre fristelser». Rune: «Å ta for mye av det gode gir ikke mening for oss.»
- N6 «Become overwhelmed by events» er nå «Blir overveldet når mye skjer på en gang» (var «… av det som skjer»), etter Runes ønske.
- O6 «Believe that there is no absolute right and wrong» er nå «Tror at det ikke finnes noe absolutt rett og galt» (var «… helt sant eller helt galt», som leses som et spørsmål om fakta).
- C4 «Do just enough work to get by» er nå «Gjør bare det minste jeg kan slippe unna med» (var «Gjør akkurat nok arbeid, verken mer eller mindre», som leses som balanse).
- O6 «Tend to vote for conservative/liberal political candidates» er nå «Pleier å stemme på konservative partier» og «… liberale partier». Rune: «partier»; i Norge stemmer man på partier, ikke kandidater.
- Rune 2026-10-17: «Venstreorienterte partier ja heller på norsk. Liberal v konservativ på engelsk.» Norsk O6 er nå «Pleier å stemme på venstreorienterte partier»; «liberale» leses som Venstre/sentrum i Norge. Engelsk er uendret.
- C2 «Leave my belongings around» er nå «Lar tingene mine ligge og slenge», A5 «Boast about my virtues» er nå «Skryter av mine gode sider» og O4 «Am attached to conventional ways» er nå «Holder fast på vante måter å gjøre ting på» (godkjent av Rune med 👍).
- Dette avviker fra upstream-oversettelsen; ID, fasett og nøkkel er uendret. Endringene og ny kontrollsum står under norwegianWordingEdits i app/data/provenance.json.

## 2026-10-17 – Samme lasting før gratisprofilen, stor F i Fordypningsrapporten
- Rune: lastingen etter testen («Vi setter sammen profilen din.») skal ha samme 0–100 %-teller og logoanimasjon som når Fordypningsrapporten åpnes. Listen viser det gratisprofilen faktisk gir: profilvideoen, de fem trekkene, én fasett fra hvert trekk, profilfiguren og en mulig styrke. Fordypningsrapporten listes ikke, og ingenting vises som utilgjengelig. Bitene flyr fortsatt inn fra vardene først når testen nettopp er fullført.
- «Fordypningsrapporten» skrives med stor F også midt i setninger i norsk tekst, som et produktnavn.

## 2026-10-17 – «Din personlige AI-partner» i Hverdagsliv og relasjoner
- Rune sendte en skisse («Fint design dette. Bruk det på ai seksjon på hverdag og forhold»). AI-knappen i Hverdagsliv og relasjoner er nå et kort med tittelen «Din personlige AI-partner», teksten «Få innsikt, forslag og veiledning basert på dine styrker.», bildet av kvinnen og roboten (klippet fra skissen, app/assets/design/ai-partner.webp) og den fasetterte knappen «AI-hjelp». Personvernlinjen står under knappen.
- Gjelder bare Hverdagsliv (`aiCard` i app/life.js); Arbeidsliv har den gamle linjen. Vises fortsatt bare i testmodus. Når AI-teksten er skrevet, vises den vanlige linjen med «Vis den ferdigskrevne teksten».

## Fasettkarusell og (i) i «Dine fem trekk» (2026-10-17)

- Rune: de seks fasettene i hvert trekk vises som en karusell man sveiper i, med én enkel prikk-toggle øverst som viser hvor man er (ingen navneknapper, piler eller hjelpetekst). Bare på mobil og nettbrett i stående format (opptil 900 px). PC og liggende nettbrett beholder rutenettet med to kolonner.
- Trekkbeskrivelsen er flyttet til en (i) ved trekknavnet, og fasettforklaringen («Selvrapportert tendens …») til en (i) øverst til høyre i hvert fasettkort. Teksten er uendret.
- Når man er inne i et trekk og logoen er ute av syne, flyter en liten «Alle trekk»-knapp med logoen nederst til høyre. Den lukker trekket og går tilbake til logoen.
- Et åpnet fasettkort viser bare «… høyere enn omtrent X av 100 mennesker» og 100-figurene. Tolkningsavsnittet er fjernet fra kortet, og mønsterteksten om sprikende fasetter er flyttet inn i trekkets (i).
- Prøve: større bilde på kortet Angst (N1) før vi eventuelt gjør det på alle.
- Etter Runes mockup (kveld 2026-10-17): på mobil er fasettkortene store, med stort fasettnavn og et bilde som fyller kortet. +-knappen er en fasettert diamant (beskåret fra mockupen, app/assets/design/facet-gem.webp), og den åpner et panel under bildet med «Om fasetten», fasettforklaringen og «X av 100 mennesker». (i)-knappen i fasettkortet er dermed fjernet. Trekkbiten i overskriften er større, og en rund «‹»-knapp øverst går tilbake til de fem trekkene.
- Rune: bildet til Angst viser en smilende kvinne og passer ikke. Det må byttes.
- Nye Angst-bilder (N1, kvinne og mann) laget med Higgsfield 2026-10-17 (0,5 kreditter): ettertenksomt, litt bekymret uttrykk i stedet for smil. Bakgrunnen er fjernet slik at de er utklipp som de andre fasettbildene.
- Nye bilder for Sinne (N2) og Depresjon (N3), kvinne og mann, laget med Higgsfield 2026-10-17 (1 kreditt): irritert ved feilmelding for Sinne og nedstemt på gulvet for Depresjon. Rune mente de forrige ikke viste følelsen.

## Spørsmålskort i Arbeidsliv, ryddigere trekkside og 100-figurer på trekk-boksen (2026-10-17, kveld)

- Rune (mockup): spørsmålene i de tilpassede kapitlene vises som store kort. Øverst står fremdriften («Om jobben din», «1 av 8»), så et stort spørsmål med bilde ved siden av, og deretter ett kort per svar med bilde og pil (avkrysningsboks der man kan velge to). Arbeidsliv åpner rett på spørsmålene, og kapittelhodet skjules til de er besvart. Bildet og de sju svarbildene til arbeidsspørsmålet er beskåret fra mockupen. Svar uten eget bilde viser en logobit. «Ikke i jobb nå» og «Noe annet» er med som før.
- Verktøylinjen (Gratisprofilen din, Lagre svarene mine, Last ned PDF) står bare i Oversikt, slik at «Dine fem trekk» starter med logoen. «Hva betyr persentilen?» er flyttet inn i kapittelets (i), så logoen og trekknavnene får plass på én mobilskjerm.
- «Trekket som skiller seg mest ut» i oversikten har fått samme «X av 100 mennesker»-setning og 100-figurer som fasett-boksen. De fem trekkene har fått egne poler i app/facet-compare.js.

## Resultatet i Arbeidsliv og Hverdagsliv som kortkarusell, og én «+» overalt (2026-10-17, kveld)

- Rune: oversikten etter de tilpassede spørsmålene vises som store kort i samme sveipbare rad som fasettene (prikker øverst, mobil og stående nettbrett). Hvert kort har en logobit, overskrift, én linje, fasettbrikker og «Les mer». En pil til høyre for prikkene viser at man kan bla. Bredere skjermer viser kortene side om side. «Prøv én ting denne uken» og «Hvordan henger dette sammen …» står under.
- Arbeidsliv har fått AI-partnerkortet med roboten, slik Hverdagsliv allerede har.
- Alle «+» som åpner noe, bruker fasettenes slipte edelsten med hvit pluss (app/design.css). De flate CSS-trekantene i kapitlene er byttet med logobitene.
- Gjenstår: en mannlig versjon av toppbildet i Arbeidsliv (Higgsfield-grensen var nådd).

## Kjøpsvalget som sprett-opp (2026-10-17, kveld)

- Rune valgte sprett-opp: lenkene til kjøpssiden fra gratisprofilen åpner to korte kort (Fordypningsrapport 49 kr / $4.99 og Fordypning + tilpasset 149 kr / $14.99) over siden med uskarp bakgrunn, slik at begge priser og knapper synes uten å rulle, også på små telefoner. «Se alt som er med» åpner hele #offer-siden, som står som før.

## Trekkortene i Arbeidsliv og Hverdagsliv som karusell, ingressen bak (i) (2026-10-18)

- Rune: de fem trekkortene i Arbeidsliv og Hverdagsliv sveipes som fasettene på mobil og stående nettbrett (prikker og pil). Det åpne kortets tekst vises under raden; bredere skjermer beholder rutenettet med teksten rett under kortet.
- Ingressen under kapitteltittelen («Bruk ideene til …», «Legg merke til …») ligger nå bak en (i) ved tittelen, som i «Dine fem trekk».

## «Hvordan henger dette sammen med trekkene dine?» som kort med bilde og «+» (2026-10-18)

- Rune sendte et kort med tittelen og en illustrasjon av fasetterte former og ba om at det åpnes med «+». Seksjonen i Arbeidsliv og Hverdagsliv er nå et kort med tittel, illustrasjonen (app/assets/design/context/deep-traits.webp, beskåret fra Runes bilde) og samme edelstein-pluss som fasettene. Innholdet åpner seg i kortet ved trykk, og bildet blir mindre mens det er åpent.

## Bare «Last ned PDF» øverst i rapporten, «Min profil» i menyen (2026-10-18)

- Rune: fjern «← Gratisprofilen din» og «Lagre svarene mine» øverst i rapporten; bare «Last ned PDF» står igjen.
- «Min side» i hamburgermenyen heter nå «Min profil» og vises så snart alle 120 svar finnes. Siden har kontoen (som før), «Last ned PDF» (åpner rapporten og utskriftsdialogen), «Lagre svarene mine i en fil», «Send profilen til e-posten din» og en sammenleggbar liste med svaret på hvert av de 120 spørsmålene.
- E-post går fortsatt via brukerens eget e-postprogram (mailto). Ekte utsending fra Fem med rapporten vedlagt krever egen SMTP/e-posttjeneste, som ikke er satt opp.

## Delene i «Hvordan henger dette sammen …» som karusell (2026-10-18)

- Rune: når kortet åpnes, sveipes delene («Det som tapper deg», «Når du leder», «Ditt neste steg» osv.) sidelengs som et eget kort hver, med prikker og pil, mens illustrasjonen står synlig over. Gjelder Arbeidsliv og Hverdagsliv, på alle skjermbredder. Utskrift viser delene under hverandre.

## Kjøpsvalget delt: rapportene til venstre, betaling til høyre (2026-10-18)

- Rune: i sprett-opp-vinduet ligger de to rapportene over hverandre til venstre, med «Fordypning + tilpasset» (149 kr / $14.99, anbefalt) allerede valgt. Til høyre står betalingsvalgene: Kort, Vipps (bare Norge) og Apple Pay eller Google Pay etter enheten. Ett trykk på et betalingsvalg går rett videre med den valgte rapporten; ett trykk på 49 kr-boksen bytter valget. På mobil står betalingen under boksene, og alt får plass uten å rulle.
- Fem-logoen står øverst i vinduet i stedet for «Gå dypere» (Rune 2026-10-18).
- Betalingsknappene viser merkene: Kort med Visa og Mastercard, Vipps-ordmerket, Apple Pay eller Google Pay, og «Sikker betaling med Stripe» under (Rune 2026-10-18). Merkene er fra Simple Icons (CC0); Vipps er skrevet som ordmerke til den offisielle logoen kommer med Vipps-avtalen.
- Betaling er ikke koblet til ennå: i forhåndsvisningen åpner alle betalingsvalgene rapporten gratis. Vipps krever egen avtale eller støtte i betalingsløsningen før lansering.
- Rune 2026-10-18: åpningsanimasjonen spilles når man trykker på Fordypning-knappen, før kjøpsvalget, og ikke etter betaling (den som trykker Kort eller Vipps har allerede bestemt seg). To versjoner: «Fordypning + tilpasset» (apricot-biten først, «Tilpasset deg», egne linjer) spilles fra alle Fordypning-knapper fordi den er forhåndsvalgt; den opprinnelige for Fordypningsrapporten spilles fra 49 kr-knappen på «Se alt som er med», som også åpner kjøpsvalget med 49 kr valgt. Gamle #opening-lenker går rett til rapporten.
- Hvert rapportkort i kjøpsvalget har en «+» (fasett-edelstenen) som folder ut alt rapporten inneholder (Rune 2026-10-18).

## 2026-10-18 – Kjøpsvalget etter evidensgjennomgangen
- Rune ba om evidensen bak en god betalingsside og deretter at det som bør gjøres, blir gjort. Notatet ligger i /mnt/project-files/betalingsside-evidens/evidens.md.
- Prisen står på hver betalingsknapp («Kort … 149 kr →») og følger valgt rapport, så ingen betaler et beløp de ikke så (angrerettloven § 16; standardvalget 149 kr er beholdt).
- I Norge står samtykket ved knappene: «Rapporten åpnes med en gang. Ved å betale samtykker du til det og godtar at angreretten da faller bort.» (angrerettloven § 22 n). Dette er en tekst ved knappen, ikke en avkrysning; en avkrysning er det sikreste juridisk og kan legges til før livebetaling. Samtykket må også bekreftes i kvitteringen når Stripe kobles til. USA får ikke linjen.
- Under overskriften står én setning om kjøperens eget resultat: de to mest særpregede trekkene utenfor midten, med samme nivåord som profilen («Du ligger lavere på medmenneskelighet og planmessighet.»). Ligger alle fem i midten, står det at rapporten viser om noen av de 30 fasettene skiller seg ut. Vises ikke for eksempelprofilen. På lave skjermer (under 700 px høyde) vises bare første setning, under 660 px ingen.
- Ikke gjort, med vilje: lokkedue eller tredje pakke, overstrøket førpris, nedtellingsur. Prisforsøk (49 mot 79 kr) og lanseringspris med sluttdato venter på at betaling er koblet til og Rune har valgt pris og dato.

## SEO-grunnmur: /no for norsk, metadata, delingsbilde, robots og sitemap (2026-10-18)

- Rune ba om søkemotoroptimalisering. Engelsk side ligger på `/`, norsk på `/no` (bygget lager dist/no.html; `cleanUrls` og `trailingSlash: false` i vercel.json). `/no` gir norsk språk og Norge/NOK som standard; en lagret språkvalg-preferanse går fortsatt foran. Relative stier fra `/no` peker til roten, så samme filer brukes.
- Hver side har søkeordtittel («Free Big Five personality test – 120 questions | Fem» / «Gratis personlighetstest (Big Five) – 120 spørsmål | Fem»), beskrivelse, canonical, hreflang (en, nb, x-default), Open Graph, Twitter-kort og JSON-LD (WebSite og Organization «Fem»). Alt lages i scripts/seo.js, som brukes av både build.js og serve.js.
- `<main>` har en kort statisk introduksjon med h1 og lenke til testen, slik at delingsroboter og AI-roboter som ikke kjører JavaScript ser innhold. JavaScript erstatter den straks. Statisk bunntekst viser «Fem» (ikke «5»).
- Delingsbilder 1200×630: app/assets/og/fem-en.png og fem-no.png (logobitene fra fem-logo-reference.png på lys bakgrunn med overskrift).
- robots.txt (alt tillatt) og sitemap.xml (/ og /no med hreflang) lages i dist. Domenet styres av `SITE_URL` i Vercel (standard https://kaleidotest.com fra 2026-10-18).

## 2026-10-18 – Produktnavnet er «Kaleido»
- Rune har valgt «Kaleido» som produktnavn, inspirert av det kaleidoskopaktige logomerket med de fem trekantene. «Fem» (arbeidsnavnet) og «Cinko» ble vurdert først; «Cinko» ble forkastet samme dag.
- Navnet står overalt brukeren ser det: sidetitler, ordmerket i topp og bunn, innloggingssiden, kjøpsvalget, e-posttekst, filnavn ved nedlasting (kaleido-profile/kaleido-profil, kaleido-report/kaleido-rapport, kaleido-answers.json), delingsvideoens sluttkort, og SEO (titler, og:site_name, JSON-LD).
- Domenet er kaleidotest.com (Rune 2026-10-18; kaleido.com og kaleidoapp.com var tatt). `SITE_URL` har kaleidotest.com som standard og kan fortsatt overstyres i Vercel. bigfive.no er foreslått som norsk viderekoblingsadresse.
- Ordmerket stod først i samme skrift som før (Georgia, live tekst); samme dag erstattet av Runes nye ordmerke, se neste oppføring. Logomerket med de fem trekantene er uendret.
- Delingsbildene heter nå app/assets/og/kaleido-en.png og kaleido-no.png og lages av scripts/og-images.cjs (krever at Georgia er installert).
- Ordet «fem» (tallet) er ikke endret, f.eks. «Fem trekk. Din kombinasjon.» og «dine fem trekk». Interne nøkler (localStorage/sessionStorage `fem-…`, `window.FEM_CONFIG`, svarfilformatet `fem-answers-v1`) og fem-logo-reference.png er beholdt, så lagrede data og svarfiler fortsatt virker.
- Eldre oppføringer i denne loggen og historiske notater (verification.md, docs/norms/overlevering-codex.md, research) beholder «Fem» som historikk. app/assets/fem-logo-reference.png er designreferansen med det gamle ordmerket; den vises ikke som ordmerke i appen.

## 2026-10-18 – Nytt ordmerke for Kaleido

- Rune valgte et nytt ordmerke («Let use that. Put it in»): marineblå serif «Kaleido» der K-ens armer er brettede trekanter (aprikos og himmelblå), i-prikken er en blå diamant og o-en har en sandfarget fasett.
- Ordmerket er et bilde: app/assets/design/kaleido-wordmark.webp (562×150, brukes i appen og videoen) og kaleido-wordmark.png (1124×300, kilde for delingsbildene). Bakgrunnen fra Runes JPG er fjernet og bildet beskåret. Runes original er en JPG; en vektorfil (SVG) bør erstatte den når den finnes.
- Ordmerket står alene i topplinjen, bunnteksten, innloggingssteget og kjøpsarket, og nederst i delingsvideoen. Pinwheel-logoen står ikke lenger ved siden av, siden ordmerket har sine egne fasetter. Pinwheel-logoen er fortsatt app-ikon/favikon, lasteanimasjon og trekknavigasjon.
- Delingsbildene (app/assets/og/kaleido-*.png) er laget på nytt med ordmerket. Overskriften er fortsatt Georgia.
- Denne oppføringen erstatter punktet om at ordmerket er live Georgia-tekst i oppføringen over.

## 2026-10-18 – Personvernerklæring og brukervilkår

- Rune: «Sett meg som ansvarlig da på gdpr etc» og «Skriv det sånn at jeg personlig ikke vil lide noe av dette i framtiden». Han driver som ENK foreløpig og oppretter AS hvis tjenesten tar av.
- Ny side «Juridisk» (`#legal`) med to kort: personvernerklæring (`#privacy`) og brukervilkår (`#terms`). Den nås fra bunnteksten («Legal»/«Juridisk»). «Personvern» er tatt ut av toppmenyen, slik Rune ba om at det juridiske skal ligge i en egen del man trykker seg inn på.
- Personvernerklæringen erstatter den gamle teksten om at svarene aldri forlater nettleseren, som ikke lenger stemte med innlogging (Supabase) og AI-skriving av de tilpassede kapitlene (Anthropic). Den beskriver hva som lagres, rettslig grunnlag, databehandlere og overføring til USA, sikkerhet, rettigheter, aldersgrense 16 år og at resultatene ikke brukes til reklame eller automatiserte avgjørelser.
- Brukervilkårene sier at Kaleido er selvrefleksjon og ikke diagnose eller rådgivning, forbyr bruk til å vurdere andre (f.eks. jobbsøkere), beskriver engangskjøp og angrerett (angrerettloven § 22 bokstav n), begrenser ansvar så langt loven tillater og lar ufravikelige forbrukerrettigheter stå.
- Navn, organisasjonsnummer og kontaktadresse står i `CONTROLLER` i app/privacy-copy.js og mangler fortsatt; sidene sier at de kommer. Se docs/personvern.md for hva som gjenstår.

## 2026-10-18 – Logo foran ordmerket og kundeserviceadresse

- Rune: «Ønsker logoen til venstre for kaleido». Pinwheel-logoen (logo-mark.webp) står nå til venstre for ordmerket i topplinjen, bunnteksten, innloggingen, kjøpsarket og delingsvideoen. Delingsbildene har allerede logoen stort til venstre og er uendret.
- Rune: «Må ha en customerservice@Kaleido.com». Kaleido.com eies ikke av oss; Rune valgte deretter support@kaleidotest.com (kortere) på et beslutningskort, brukt som kontaktadresse i personvernerklæringen og vilkårene. E-posten må settes opp hos en leverandør før den virker.

## 2026-10-18 – Metodesiden forklarer persentiler også før testen

- Metodesiden sa at stolpen viser gjennomsnitt fra 1 til 5 og «ikke er en persentil» når den ble åpnet uten en rapport, selv om alle resultater vises som persentiler. Den bruker nå persentilforklaringen så lenge normtabellen er lastet. Funnet under Runes gjennomgang av appen.

## 2026-10-18 – Lyden i delingsvideoen er på fra start

- Rune: lyden i videoen etter testen må være på automatisk. Nettlesere (særlig Safari, iPhone og Firefox) starter bare lyd fra et trykk, og videoen åpnes etter siste svar uten et nytt trykk, så den startet ofte uten lyd. Lyden vekkes nå (stille) ved hvert trykk eller tastetrykk i appen, og ventetiden på lydkortet er økt fra 0,3 til 1,5 sekunder, så videoen starter med musikk når nettleseren tillater det.

## 2026-10-18 – Profilmerke i hjørnet, ingen kontoboks under profilen

- Rune: kontoboksen («Kontoen din») nederst på gratisprofilen fjernes. Innlogging og lagring ligger under «Min profil».
- Når testen er tatt, byttes «Ta testen» øverst til høyre med et rundt merke: profilfiguren (beskåret rundt ansiktet, samme figurvalg kvinne/mann) og initialene fra innloggingen. Merket lenker til profilen. På mobil står det ved menyknappen.

## 2026-10-18 – «Fordypning + tilpasset» til 79 kr, og hva 49 kr ikke har

- Rune: 149 kr blir 79 kr. Valgt dollarpris: $7.99 (samme forhold som 49 kr / $4.99). Stripe-katalogen i sandkassen må få samme pris før betaling kobles til.
- Begge nivåene åpner rapporten på Oversikt (79 kr hoppet før rett til kapittel 3).
- 49 kr-rapporten har arbeidsliv, hverdagsliv og relasjoner med trekkortene og ukeplanen, men ikke de tilpassede spørsmålene i kapittel 3 og 4 eller AI-partneren. Der spørsmålene ville stått, forklarer et kort hva «Fordypning + tilpasset» gir. Kjøpskortene sier det samme («Tilpassede spørsmål og AI-partner» / «Uten tilpassede spørsmål og AI-partner»). Valget huskes i nettleseren til betaling er koblet til; uten valg (forhåndsvisning, eksempelrapport) vises alt.
- Rune: testen skal stå som «10 minutter» (forsiden, Google-teksten og delingsbildene).

## 2026-10-18 – Fasetterte grafer og rolig bevegelse

- Runes nye grafdesign: stolpene får trekkets farge som en lys-til-dyp gradient med papirfasetter (trekanter) oppå, og den marineblå prikken. Gjelder gratisprofilen, rapportens stolper og forsiden (forsiden bruker nå trekkfargene og har prikk). Ekstroversjon følger samme mønster med egen farge.
- Rolig, levende bevegelse: fasettene i stolpene glir sakte, et svakt lysskjær går over dem av og til, og logobitene vugger litt. Alt stopper når brukeren har valgt redusert bevegelse.

## 2026-10-18 – Slagord

- Rune valgte to slagord som gir navnet Kaleido noe å feste seg ved: «Se alle sidene dine.» / «See every side of you.» og «Se mønsteret ditt.» / «See your pattern.»
- Forsiden: «Se alle sidene dine.» står øverst over «Ingen boks. Bare deg.» (erstatter «Kjenn deg selv bedre»), og «Se mønsteret ditt.» står over «Nysgjerrig på hvem du er?» nederst.
- Delevideoen: «Se alle sidene dine.» står under Kaleido-ordmerket i bunnteksten og over spørsmålet på sluttkortet.
- Rune (samme kveld): «Se alle sidene dine.» er nå hovedtittelen på forsiden og erstatter «Ingen boks. Bare deg.»; linjen over er igjen «Kjenn deg selv bedre». Trekkoverskriften er «Fem trekk. Tretti fasetter. Én deg.» «Mer innsikt. Flere muligheter.», «Tendenser, ikke faste typer.» og lenken «Utforsk en eksempelrapport» er fjernet fra forsiden; selve rapporten skal være en overraskelse. Eksempelrapporten (#demo) finnes fortsatt for testing.

## 2026-10-18 – Egne fonter

- Rune sa ja til et eget fontpar: Source Serif 4 i overskrifter og Manrope i brødtekst og knapper. Før brukte appen Georgia og Arial, som Android ikke har (der ble det Noto Serif og Roboto), så appen så ulik ut fra enhet til enhet.
- Fontene ligger i app/assets/fonts (SIL Open Font License), kuttet til latinske tegn med æ, ø og å; til sammen omtrent 125 KB med kursiv. Delevideoen venter på fontene før den tegner.
- Tekststørrelsene er samlet fra 28 til en fast skala (10–22 px under overskriftene; halve piksler, 17, 19, 21 og 23 px er borte). Manrope er litt bredere enn Arial, så 17 px ble 16 px.

## 2026-10-18 – Betaling med Stripe Checkout, Apple Pay, Google Pay og Vipps

- Rune: «Stripe på, Google Pay, Vipps». Bygget med Stripes ferdige betalingsside (Checkout). Kort, Apple Pay og Google Pay kommer automatisk; Vipps er en lukket forhåndsversjon hos Stripe og slås på med `STRIPE_VIPPS=on` når Stripe har gitt tilgang. Vipps-knappen åpner en side med bare Vipps.
- Prisene ligger fast på serveren (49 kr / $4.99, 79 kr / $7.99). Den som har 49 kr-rapporten, betaler mellomlegget (30 kr / $3.00) for «Fordypning + tilpasset».
- Kjøpet lagres i Supabase (tabellen purchases) først når serveren har lest en betalt økt fra Stripe. Rapporten krever kjøp når betaling er slått på; eksempelrapporten er åpen. Uten kjøp åpnes gratisprofilen med kjøpsvalget.
- Først testmodus. Livebetaling venter på Runes ja.

## 2026-10-19 – Profilvideoen starter aldri dempet

- Rune: videoen startet fortsatt uten lyd på PC. Årsaken er innloggingen rett før resultatene: Google-innloggingen laster siden på nytt, og etter en ny sidelasting uten trykk tillater ikke nettleseren lyd. Da venter videovinduet nå på første bilde med en stor «Spill av med lyd»-knapp i stedet for å spille dempet; ett trykk starter videoen med musikk fra begynnelsen. Når lyden er tillatt (ingen omlasting), starter den med lyd som før.

## 2026-10-19 – Deling til Reels, TikTok, Messenger og e-post

- Rune: «integrate share video with reels, tiktok, messenger» og e-post. Ingen av nettverkene lar en nettside legge ut video på vegne av brukeren, så Kaleido gir fila videre der det går.
- Mobil: Del-knappen sender bare videofila til telefonens delingsmeny (Instagram Reels/Stories, TikTok, Messenger, Snapchat, WhatsApp, Mail osv.). Tekst sendes ikke med, fordi Instagram og TikTok kan falle ut av menyen på iPhone når tekst følger med. Bildeteksten («Hvordan ser din profil ut? Finn ut gratis: kaleidotest.com») kopieres i stedet til utklippstavla.
- PC og nettlesere uten fildeling: når videoen er lagret, vises «Legg ut videoen» med knapper til Instagram, TikTok (tiktokstudio/upload) og Messenger som laster ned fila og åpner nettverkets opplastingsside, og lenkedeling via E-post (mailto), Facebook, WhatsApp, X, LinkedIn og «Kopier lenke». Lenken går til forsiden, aldri til profillenken med svarene.
- E-post med videoen som vedlegg fra Kaleido (via support@) er ikke bygd; det krever e-posttjeneste på serveren og opplasting av videoen. Foreslått for Rune.

## 2026-10-19 – Livebetaling: webhook, branding og refusjon

- Rune: «Do what is needed with stripe and vercel to get it up and running». Stripes planleggingsverktøy anbefaler ferdig betalingsside (Checkout) for nettbutikk med digitale engangskjøp, som er det vi har.
- Live-webhook til https://kaleidotest.com/api/stripe-webhook er opprettet i Stripe med `checkout.session.completed`, `checkout.session.async_payment_succeeded` og `charge.refunded`. Branding: hovedfarge #102747, aksent #f6b18d, hvit bakgrunn og mørkeblå knapp på betalingssiden.
- En full refusjon fjerner kjøpet igjen, og den gamle suksesslenken kan ikke gjenopprette det. Delvis refusjon beholder rapporten.

## 2026-10-19 – Videoen deles som lenke med stort bilde

- Rune: delingen skal være som en klassisk YouTube- eller Reels-lenke, med stort miniatyrbilde og avspillingsknapp, ikke en mp4-fil i meldingen.
- Når en innlogget bruker trykker Del, lastes videoen, et stillbilde og et forhåndsbilde (1200 × 630: profilfiguren, «Rune er / Den impulsive reven», «Se videoen» og avspillingsknapp) opp til Supabase Storage (bøtta «shares») med signerte opplastingslenker fra /api/share. Lenken kaleidotest.com/v/<id> har Open Graph- og Twitter-merker og åpner en side som spiller videoen og leder til testen.
- Bare det videoen viser, lagres: tittel (profilnavnet), språk, type og bruker-ID. Ingen svar, skårer eller e-post. Id-en er tilfeldig (10 tegn), siden er noindex. Maks 20 lenker per bruker per døgn. «Slett lenken» fjerner rad og filer, og «Slett kontoen min» sletter alle lenkene først. Personvernerklæringen er oppdatert.
- Reels og TikTok tar bare imot selve fila, så «Del videofila» (mobil) og opplastingsknappene (PC) er beholdt under lenken. Uten innlogging deles fila som før.
- Krever at migrasjonen supabase/migrations/20261019000000_shares.sql kjøres i Supabase (tabell og bøtte).

## 2026-10-20 – Profilmerket kommer til slutt

- Rune: profilmerket øverst til høyre viste seg på innloggingssiden, før innlogging og introvideoen. Nå vises det ikke på innloggingssteget, lasteskjermen eller testen, ikke før man er logget inn (når innlogging er på), og først når profilvideoen er sett eller lukket.

## 2026-10-20 – Fasettene glinser hver for seg

- Rune: i stedet for et skrått lysskjær over hele trekklogoen skal hver lille trekantfasett i logobitene glinse svakt, regelmessig og i tilfeldig rekkefølge, aldri samme fasett to ganger på rad. Det gjelder overalt der bitene står i appen, men ikke selve logoen (topp, bunn, lasting, den spredte logoen) eller steinvardene på spørsmålssiden. Av ved redusert bevegelse. Fasettene er tegnet opp i app/facet-glint.js.
- 2026-10-20: Rune åpnet en delelenke i Messenger på Android, og «Ta testen gratis» lå under videoen. Nå passer hele siden på første skjerm: videoen skaleres til høyden som er igjen etter logoen, overskriften, én kort linje og knappen.

## 2026-10-20 – Nettleseroversettelse er slått av

- Rune: på en annen PC sto svarene som «Stemmer svært tørr» og «Stemmer nokså tørr». Hun landet på den engelske siden og byttet til norsk. Appens egne tekster er riktige («Stemmer svært dårlig» osv.), så det var nettleserens automatiske oversettelse som maskinoversatte siden, og som fortsatte etter språkbyttet.
- Siden har både engelsk og norsk selv, og testutsagnene må ha nøyaktig valgt ordlyd. Derfor har index.html og delingssidene translate="no" og `<meta name="google" content="notranslate">`. Ulempen er at Chrome ikke lenger tilbyr å oversette siden til andre språk.
- 2026-10-20: Rune sendte en delelenke i Messenger uten forhåndsbilde. Siden har ikke lenger og:video og er og:type website med og:image (1200 × 630, image/jpeg), slik at Facebook og Messenger alltid viser bildekortet i stedet for å prøve å bygge inn videoen.

## 2026-10-20 – Hvor vanlig profilfiguren er («kombo-statistikk»)

- Rune ville vise hvor mange som havner på samme profilfigur, så folk ser hvor «unik» kombinasjonen er. Profilfiguren (navnet, ruleId i app/profile-name.js) får en boks under seg på gratisprofilen, rapportoversikten og Min side: en merkelapp (vanligere / uvanlig / sjelden / svært sjelden), «Omtrent 1 av 5 300 mennesker får denne profilfiguren» og hvor tallet kommer fra. Tallet sies i mennesker, aldri prosent, som på fasettkortene.
- Fram til Kaleido har nok egne profiler er tallet et anslag: scripts/build_name_frequencies.js simulerer 1 million personer der hver fasettsum følger normtabellen eksakt, fasetter i samme trekk henger sammen gjennom en felles trekkfaktor (ladning 0,65) og de fem trekkene korrelerer som i metaanalysen til van der Linden, te Nijenhuis og Bakker (2010). Hver person navngis med appens egen kode. Rådataene bak normene ligger ikke i repoet, så samvariasjonen mellom fasettene er en modell, ikke en opptelling. Resultatet ligger i app/data/name-frequencies.json og må bygges på nytt når navnereglene endres.
- Ekte tall: /api/name-stats leser de lagrede svarkodene med service-nøkkelen, regner ut figuren på serveren og returnerer bare totaler (cache 15 min). Ingenting vises før minst 1 000 profiler er lagret, og figurer med færre enn 10 profiler utelates; da brukes anslaget for den figuren. Personvernerklæringen nevner statistikken (berettiget interesse). Ingen databaseendring trengs.
- 2026-10-20 Rune: kildelinjen skal låte som forskning og beregning, ikke «et anslag». Den sier nå «Beregnet fra forskningsdataene bak testen: vi regnet ut hvor ofte akkurat denne kombinasjonen av fasetter dukker opp blant en million personer, modellert etter svarene til 243 307 deltakere.» Vi skriver ikke at sannsynlighetene multipliseres, fordi beregningen tar hensyn til at fasettene henger sammen.
- 2026-10-20 Rune: tallet får en (i) som åpner forklaringen i en boble, og forsiden får raden «Hvor sjelden er du?» over den siste Start testen-knappen. Den viser tre figurer fra vanlig til svært sjelden (Bare-én-episode-til-entusiasten, Den ambisiøse sisteliten-kunstneren og Den kaotiske fair play-ridderen) med de samme tallene som på profilen. Delevideoen hører til tråden «Morsomme komboer i delevideoen»; `rarityShort()` i app/name-rarity.js gir den en kort linje.

## 2026-10-20 – Min side som oversikt etter innlogging

- Rune: når man logger inn igjen, skal man få en oversikt over profilen sin, ikke den lange gratisprofilen. «Min side» (#account) viser nå profilfiguren og navnet, de fem trekkene og snarveier til Fordypningsrapporten (Oversikt), gratisprofilen, profilvideoen og «Se gjennom svarene mine». Kontoen og profilverktøyene ligger under. Profilmerket øverst til høyre og «Min side» i menyen går hit, og den lagrede profilen åpnes av seg selv i en tom fane.
- Rune hadde kjøpt Fordypning (49 kr), men fikk kjøpsvalget med oppgraderingen forhåndsvalgt når han ville til rapporten. Nå går alle Fordypning-lenker rett til rapporten for den som har kjøpt; oppgraderingen til tilpasset vises bare fra lenker som tilbyr den, og som et valgfritt kort på Min side.

## Deling er hovedvalget i videovinduet (2026-10-20)

- Videovinduet som åpner seg etter testen har nå en stor knapp «Del personligheten din» under videoen. «Ikke nå» står fortsatt øverst. Grunn: Fredrik testet på mobil og trodde han måtte lukke vinduet med «Ikke nå» før han kunne dele. På PC lukkes vinduet når delepanelet åpnes, slik at lenken og knappene synes på siden.

## Del åpner et delevindu med en gang (2026-10-20)

- Rune: «et vindu skal poppe opp når man trykker på del … sånn det er i snapchat, insta». Del åpner nå et lite vindu med en gang, med lenke og Kopier, Facebook, WhatsApp, X, LinkedIn og E-post. På mobil kommer også «Del lenken», som åpner telefonens delemeny. Den lange boksen «Videolenken din / Reels og TikTok» under videoen er borte. I vinduet står det bare en stille «Last ned video» (PC) eller «Del videofila (Reels, TikTok)» (mobil), og «Slett lenken».
- Lenken lages fra forhåndsbildet og kortet på et par sekunder. Videoen lastes opp i bakgrunnen når den er laget. Åpner noen lenken før det, ser de bildet og «Videoen er på vei». Samme video (navn, språk, svar) beholder lenken sin, så et nytt trykk på Del åpner delemenyen med en gang uten ny opplasting.
- Storskjermknapp øverst til høyre i videoen. På iPhone, der Safari bare tillater fullskjerm for video-elementer, dekker videoen hele skjermen i stedet.

## PDF-rapporten nevnes i kjøpsvalget (2026-10-20)

- Rune ville at listen over hva man får sier at Fordypningsrapporten kan lastes ned som PDF med sidetall. Utskrift av hele rapporten (Letter, slik @page er satt) ga 45–48 sider i testprofiler, avhengig av profil, språk og nivå. Teksten sier derfor «Over 40 sider» og ikke et eksakt tall. Linjen står i kjøpsvalget (kort og «+»-listene for begge nivåer), på #offer-siden og i åpningsanimasjonen.

## 2026-10-20 – Sjeldne komboer i delevideoen

- Rune: hver video skal «lurke frem de rareste komboene» av testen, så folk vil dele den fordi den treffer, er morsom eller litt skrytete. app/facet-combos.js finner personens sjeldneste fasettpar (f.eks. svært ryddig og svært nytelsesglad) og regner ut hvor mange som har begge deler minst like tydelig. Tallet er et anslag fra samme modell som profilfigurens sjeldenhet (felles trekkfaktor 0,65, trekk-korrelasjoner fra van der Linden mfl. 2010), sies i mennesker («1 av 230 mennesker har denne kombinasjonen like tydelig som deg») og merkes «Anslag ut fra normdataene til testen».
- Valg av par: par som sjelden går sammen (under 70 % av det to uavhengige fasetter ville gitt) går foran, og par med håndskrevet linje får et forsprang. Paret må være sjeldnere enn 1 av 20. Lav mestringstro (C1), høy nedstemthet (N3) og høy sårbarhet (N6) brukes ikke i komboer, fordi de er vanskelige å si lekent. En signaturprofil sitt eget par hoppes over, fordi navnet og linjen allerede forteller det.
- 160 håndskrevne linjer (norsk og engelsk) for par som sier mer sammen enn hver for seg. I en simulering av 4 000 normpersoner fikk alle et par og omtrent 90 % et par med linje. Linjen blir sluttsitatet i videoen; uten linje beholdes det gamle sluttsitatet.
- Komboscenen erstatter enkeltfasett-scenen i begge klipp og viser de to fasettbildene (assets/names/<fasett><retning>.webp, samme figurvalg som profilen), persentilene og tallet. Ingen nye bilder trengtes. Navnescenen sier nå også hvor vanlig profilfiguren er («Omtrent 1 av 6 500 mennesker får denne profilfiguren»). Det korte klippet varer fortsatt like lenge som sangen (statistikken ga ett sekund til komboscenen); det lange er fortsatt under 40 s pluss sluttkortet, derfor ett par per video.
- Samme kveld etter Runes første titt: komboscenen fikk 2 s mer og sluttsitatet 2 s mindre når en kombo vises (lengden er den samme). Linjen under tallet sier paret med ord: «1 av 490 mennesker er like selskapelige og alvorlige som deg». Bildet kan gjerne være det samme som profilfigurens, så lenge det viser fasetten (Rune). (i)-boblen ved profilfigurens tall forklarer nå at tallet gjelder hele figuren, mens et enkelt par i videoen deles av flere.
- Gratis eller betalt (Rune valgte A, 2026-10-20): den sjeldneste komboen er gratis, både i videoen og som et kort på gratisprofilen (samme par, freeCombo i app/facet-combos.js), med lenke til Fordypningsrapporten. Rapporten får kapittel 05 «Komboene dine» (steg blir 06). Flyttet 2026-10-21 til kapittel 03, rett etter «Dine fem trekk» (Rune lot oss bestemme): den bygger direkte på fasettene, og er den morsomste og mest delbare delen, så den skal komme tidlig. Arbeidsliv blir 04 og Hverdagsliv 05: inntil tre par som sjelden går sammen og inntil tre par som er «steinbra sammen», med når de er steinbra. Par som virker sammen vises bare med håndskrevet tekst (60 par, norsk og engelsk); omtrent 93 % av normpersonene får minst ett slikt par. Fasetter som allerede står i en motsetning hoppes over i den andre lista når det finnes nok andre par.
