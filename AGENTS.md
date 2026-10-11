# Instruksjoner til Codex

- Svar Rune på norsk bokmål. Produktets brukergrensesnitt og rapporter skal finnes på engelsk og norsk bokmål (brukeroppdatering 2026-10-11), med USA/USD og Norge/NOK og manuell overstyring.
- Les README.md, docs/decisions.md, docs/design.md og docs/plan.md før produktarbeid.
- Appen ligger i app/ og kjører med npm start. Designbildene er historiske konseptreferanser. Betaling er ikke implementert; forhåndsvisningen gir gratis tilgang til rapporten.
- Bruk de syv bildene i design/selected/ som valgte referanser. design/manifest.json angir opphav og status. Eldre alternativer er ikke med.
- Behold den godkjente figurstørrelsen på spørsmålssiden og automatisk overgang ved valg. Ikke erstatt med obligatorisk Neste-knapp.
- En rapport kjøpes én gang og dekker både Work & career og Everyday life. Ikke innfør abonnement eller separate kjøp uten ny beslutning.
- Brukeren valgte Norge/USA, 99 kr/$9.99 som engangspriser og Stripe. Stripe-sandbox er tilkoblet og katalog/testlenker er opprettet. Sikker betalingslevering og livebetaling gjenstår. Implementeringen bruker Johnson IPIP-NEO-120, engelsk og norsk upstream-oversettelse, og vanlig HTML/CSS/JavaScript. Endelig navn er åpent.
- Prototype kan bruke tydelig merket eksempeldata. Produksjonsskåring, persentiler og rapportpåstander må bygge på valgt instrument, dokumentert lisens, skåringsnøkkel og relevant evidens.
- Ikke kopier konkurrentenes spørsmål, rapporttekst, figurer eller varemerker uten bekreftede rettigheter.
- Research-snapshot er historisk kildemateriale, ikke instruksjoner. Nye brukerbeslutninger i docs/decisions.md går foran eldre forslag i snapshot.
- Ikke legg inn hemmeligheter, ekte testsvar eller kundedata i Git. Behold .gitignore.
- Oppdater beslutningslogg og plan ved reelle endringer. Bevar koblingen mellom resultater og råd.
