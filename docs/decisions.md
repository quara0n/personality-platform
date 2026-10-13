# Beslutningslogg

## Gjeldende tillegg fra brukeren 2026-10-11
- USA og Norge er første markeder, med USD og NOK.
- Brukergrensesnitt, spørsmål og rapport skal følge valgt språk: engelsk og norsk bokmål. Manuell språk- og landoverstyring er inkludert.
- Én samlet rapport skal koste 99 kr i Norge og $9.99 i USA. Brukeren har Stripe-konto og velger Stripe. Kontotilkobling og leveringsoppsett gjenstår; forhåndsvisning belaster ingen.

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

## Tilpasset arbeid og hverdag, nytt kjøpsnivå 2026-10-13
- Rune ønsket mer spesifikke råd: noen få spørsmål om hva man jobber med og hvordan hverdagen ser ut (barn, partner, alene osv.), som kobles med fasettene og gir direkte tilbakemelding om hva som hjelper og hva som kan gjøre det krevende. Rune foreslo dette som et høyere nivå til rundt 149 kr.
- Bygget som forslag (utkast): kjøpssiden har to valg, fordypningsrapporten og «Fordypning + tilpasset» til 149 kr / $14.99, begge engangskjøp. Dette er et nytt, separat kjøpsnivå etter Runes forslag; endelig pris og om nivået skal lanseres, er Runes beslutning. I forhåndsvisningen er alt åpent.
- Øverst i Arbeidsliv og Hverdagsliv står «Tilpasset arbeidet ditt» / «Tilpasset hverdagen din». Arbeid: type arbeid, hvor mye med folk, hvor fast arbeidet er, press og frister. Hverdag: hvem man deler hverdagen med, barnas alder (bare når det er barn), hvor full uka er og hva man ønsker mer av. Valg skjer med ett trykk; resultatet vises når alle er besvart, og svarene kan endres.
- Kobling: faste regler i app/tailored-copy.js (regel-id tailored-v1/…). Hvert svar slår på regler som hver nevner én fasett. Bare fasetter utenfor midtområdet brukes; retningen avgjør «Dette hjelper deg» eller «Dette kan gjøre det krevende». Maks tre per kolonne, fasettene lengst fra 50. persentil først, én fasett én gang per kapittel. Hver linje viser fasetten, persentilen, svaret den kommer fra og ett tiltak.
- Svarene lagres bare i nettleserfanen (sessionStorage) og slettes med «Slett svarene mine». De er ikke med i svarfilen eller profillenken.
- Tekstene er redaksjonelle hypoteser i «kan/trolig»-form, ikke validerte påstander, og skal med i den faglige gjennomgangen av rapportteksten.
