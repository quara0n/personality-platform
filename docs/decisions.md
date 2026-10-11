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
