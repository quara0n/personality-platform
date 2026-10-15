# Arbeidsplan

## Statusoppdatering 2026-10-11
Instrumentresearch, kildekontroll, skåringsmotor, engelske og norske rapporter og interaktiv nettleserflyt er implementert. Se docs/implementation.md for kjøring, avgrensninger og kommersielle lanseringsavhengigheter. Den opprinnelige planen nedenfor bevares som bakgrunn; setningen om at ingen faser var påbegynt gjaldt overleveringen, ikke dagens tilstand. Verifikasjon dokumenteres i docs/verification.md.

## Ferdig i denne overleveringen
Valgt brukerreise, konseptbilder, beslutningslogg, kildearkiv, forskningsspørsmål og Codex-instruksjoner er samlet. Dette er grunnlag, ikke produksjonskode.

## 1. Overta og avklar grunnlaget
Les HANDOFF.md og de lenkede dokumentene. Opprett privat GitHub-repo og push når autentisert tilgang finnes. Bruk et beskrivende midlertidig reponavn, ikke anta at arbeidsnavnet er endelig merkevare.
Avklar målgruppe/marked og gjør instrumentresearch som i docs/research.md. Dokumenter valg og resterende usikkerhet.

## 2. Klikkbar prototype med eksempeldata
Velg og dokumenter en passende teknologistakk. Lag landing, ett-spørsmål-flyt, kort logoanimasjon, gratisprofil, kjøpsvisning og rapportleser.
Prototypebetaling må være tydelig simulert og ikke belaste noen. Eksempelprofiler må være merket.
Godkjenningskriterier:
- Automatisk neste ved valg, ingen obligatorisk Neste.
- Tidligere svar beholdes og kan endres; fremdrift korrekt; ingen dobbeltregistrering ved raske klikk.
- Sidene matcher de valgte referansene, produktet er engelsk.
- Desktop og mobil kan brukes med tastatur/touch og redusert bevegelse.
- Fem trekk vises konsistent i gratisprofil og rapport.

## 3. Verifisert skåring og rapportinnhold
Forutsetter dokumentert instrument/lisens/skåringsnøkkel.
Test reversering, grensetilfeller, manglende svar og kjente profiler. Skill deterministisk beregning fra eventuell KI-formulering.
Lag kapittelmaler og kildegrunnlag, knytt tolkning til resultat. Faglig gjennomgang før lansering.
Ferdig når eksempeltilfeller kan spores fra svar til skår og relevant rapporttekst.

## 4. Betaling og levering
Fastsett pris/valuta/avgifter, leverings- og tilgangsmodell. Verifiser betaling server-side og håndter repetert betalingsmelding, avbrutt kjøp og tilgang etter kjøp.
Implementer PDF som lesbart dokument. Avklar lagring, sletting og nødvendig personverninformasjon for reelle brukere.

## 5. Brukertest og lanseringsgrunnlag
Test forståelse av svarskala, automatisk overgang, resultatskala og kjøpstilbud. Mål faktiske fullføringer og kjøp først når måleoppsettet er definert.
Revider design med evidens. Kontroller mobil, tilgjengelighet og betalingsflyt før produksjonslansering.

Ingen fase utover pakkingen er påbegynt her.

## Rapportoppdatering 2026-10-11
Rapport v2 gjennomført innenfor brukerens godkjente forbedring: fasettmønstre, egne midttolkninger, fasettbaserte arbeids-/hverdagsrefleksjoner og neste steg. Svar kan tas vare på i en lokal fil og brukes på nytt i senere rapportversjoner. Offisielle spørsmål og beregning er uendret. Se docs/verification.md for kontrollene; psykometrisk validering og normering er fortsatt separate lanseringsoppgaver.

Persentiler 2026-10-11: Ekte empiriske persentiler fra Codex' normpakke er koblet til skåringen (app/data/norms-us.json, N = 243 307 amerikanske voksne nettbesvarelser, midtrang). Begge språk bruker samme referanse. Gjenstår: faglig psykometrisk gjennomgang, norsk språkvalidering, eventuell aldersinnhenting og om grensene 30/70 for nivåordene skal justeres etter faglig gjennomgang. Nivåordene følger nå persentilen (se beslutningsloggen).

Testhjelp 2026-10-11: «Tilfeldig»-knappen på spørsmålssiden (vises etter at du har åpnet en adresse med ?dev=1, og forsvinner med ?dev=0) fyller ut alle 120 svar tilfeldig og går rett til profilen. Den er bare for forhåndsvisning og må fjernes før lansering: devMode(), devRandom(), #dev-random, #dev-reroll og ruten #random i app/ui.js og .d-dev-random i app/design.css.
Utvidet 2026-10-14: snarveien går nå samme vei som en ekte fullføring (innloggingssiden, lasteanimasjonen, videoen og gratisprofilen). Adressen `?dev=1#random` fyller ut svarene og starter flyten direkte, og gratisprofilen har knappen «Ny tilfeldig profil» for å trekke på nytt. Uten dev-modus sender #random til forsiden.
Endret 2026-10-14 (Rune): knappen vises for alle frem til lansering, også uten ?dev=1. Slå av med SHOW_RANDOM=false øverst ved devMode() i app/ui.js før lansering.

Trekkvelger 2026-10-13: «Dine fem trekk» i rapporten åpnes nå via logobitene (app/trait-logo.js), ett trekk om gangen; utskrift viser alle. Kontrolleres med scripts/trait-logo-check.cjs.

E-post 2026-10-13: «Send profilen til e-posten din» bruker foreløpig mailto og en lenke med svarene etter #. Ekte utsending krever en e-posttjeneste (for eksempel Resend eller Postmark), en serverfunksjon på Vercel, samtykke og personvernvilkår, og bør vurderes sammen med sikker betalingslevering.
Varder og oversikt 2026-10-13: Fem varder på spørsmålssiden (app/cairns.js), «Din profil på ett blikk» i rapportoversikten (app/glance.js, app/combination-copy.js) og animerte fasettkort. Kontrolleres med scripts/cairns-check.cjs. Gjenstår: faglig gjennomgang av kombinasjonssetningene og profilnavnene (app/profile-name.js) sammen med resten av rapportteksten.
Profilvideo 2026-10-13: «Del profilen din som video» i gratisprofilen (ca. 24 s) og «Del rapporten din som video» i rapportoversikten (ca. 42 s), app/share-video.js, med Runes sang «Who Are You?» (app/share-music.js). Rune bekreftet 2026-10-13 at sangen er laget på betalt Suno-abonnement. Fra 2026-10-13 viser navnebildet profilnavnets figur, og fasettbildet viser alltid samme fasett for et profilnavn (første fasett i navnets id), så en sang per profilnavn kan nevne den. Gjenstår: teste deling og opplasting til Instagram, TikTok og Snapchat på ekte iPhone og Android, faglig gjennomgang av avslutningslinjene, og domenet på sluttkortet når navnet er bestemt (det viser vertsnavnet automatisk utenfor localhost).
Innlogging 2026-10-13: Valgfri innlogging med Google, Apple og X for å lagre profilen (app/account.js, supabase/migrations/, docs/innlogging.md). Skjult til SUPABASE_URL og SUPABASE_ANON_KEY er satt i Vercel. Gjenstår: Rune oppretter Supabase-prosjekt og apper hos Google, Apple og X, personvernerklæring og databehandleravtale, og kobling av rapportkjøp til kontoen.
Tilpasset nivå 2026-10-13: «Tilpasset arbeidet ditt» og «Tilpasset hverdagen din» i rapporten (app/tailored.js, app/tailored-copy.js) og «Fordypning + tilpasset» til 149 kr / $14.99 på kjøpssiden. Kontrolleres med tests/tailored.test.js og scripts/tailored-check.cjs. Rune godkjente nivået 2026-10-13. Gjenstår: Stripe-pris for nivået, at betaling faktisk låser opp nivået, faglig gjennomgang av reglene og eventuelt flere regler for kombinasjoner som i dag gir få linjer.
Trekkort med fem nivåer 2026-10-15: app/context-levels.js, styrker og svakheter på kortene. Gjenstår: 40 nye bilder fra Rune (trekkort-bilder/bildeliste.md i prosjektmappen) og faglig gjennomgang av tekstene.
