# Personality platform — arbeidsnavn «5»

Big Five-tjeneste på engelsk og norsk bokmål. Samarbeid med Rune foregår på norsk bokmål.

**Status:** Interaktiv IPIP-NEO-120-test, skåringsmotor og rapporter er implementert på engelsk og norsk bokmål. USA/USD og Norge/NOK støttes. Betaling er ikke aktivert; hele rapporten er tilgjengelig i forhåndsvisningen. Se [implementering og kjøring](docs/implementation.md).

Kjør `npm start` og åpne http://127.0.0.1:4173. `npm test` kontrollerer skåring/rapporter, og `npm run verify:items` sammenligner spørsmålsbanken med originalkilden. Ingen installasjon av appavhengigheter trengs.

## Start her
1. [Overlevering til Codex](HANDOFF.md) — status og neste økt.
2. [Beslutninger](docs/decisions.md) — hva brukeren faktisk har valgt.
3. [Produkt og brukerreise](docs/product.md) — gratis og betalt tilbud.
4. [Designreferanser](docs/design.md) — syv utvalgte bilder og prioritet ved avvik.
5. [Research og åpne spørsmål](docs/research.md).
6. [Arbeidsplan](docs/plan.md).

Åpne [designgalleriet](design/index.html) i en nettleser for å se hele den valgte flyten. Galleriet er bare en lokal visning av PNG-skisser, ikke produktet.

## Viktig
Produktet finnes på **engelsk og norsk bokmål**. USA/USD og Norge/NOK er første markeder. Brukeren har valgt 49 kr og $4.99 som engangspriser (endret fra 99 kr/$9.99 2026-10-13), med Stripe.
«Fem» er arbeidsnavnet og brukerens originale logo brukes i grensesnittet. Stripe-sandbox er koblet til, med produkt, priser og to testlenker; kjøp er ikke koblet til rapporttilgang.
Rapportenes eksempelprofiler er syntetiske, ikke Runes personlighet.
Gratisresultatet skal gi nyttig verdi før et valgfritt engangskjøp av én rapport med både arbeidsliv og hverdagsliv.

## Oppbevaring og GitHub
Denne mappen er et selvstendig lokalt Git-repo, adskilt fra den synkroniserte ChatGPT-prosjektmappen.
GitHub: https://github.com/quara0n/personality-platform (privat). Se [GitHub-status](docs/github-setup.md) og [gjeldende prosjektstatus](docs/status.md).
Ingen åpen kildekodelisens er valgt; ikke anta at kildekode, spørreskjema eller eksterne illustrasjoner kan gjenbrukes fritt.

Rapport v2 forklarer fasettforskjeller innenfor hvert trekk og bruker fasetter i arbeidsliv, hverdagsliv og neste steg. Bruk «Lagre svarene mine» for å ta vare på en lokal svarfil; «Hent lagrede svar» lager gjeldende rapport fra filen uten ny test. Svarfilen inneholder personlige svar og skal oppbevares privat.
