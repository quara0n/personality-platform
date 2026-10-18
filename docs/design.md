# Valgt design

PNG-filene er konseptreferanser, ikke ferdige UI-komponenter. Nye engelske produkttekster erstatter norsk tekst i tidlige bilder. Navnet «5» er foreløpig. Ikke bruk de tidligere forkastede variantene som hovedretning.

| Fil | Bruk | Status |
| --- | --- | --- |
| 01-landing.png | Sentrert landing, figurer rundt profil, mørk nedre seksjon | Brukervalgt |
| 02-question.png | Ett spørsmål, variable firkanter, hover og automatisk overgang | Brukervalgt; figuren beholdes |
| 03-loading.png | Fem logodeler under samling | Godkjent konsept; animasjon gjenstår |
| 04-free-results.png | Fem trekk samlet, utfellbare forklaringer | Brukervalgt første resultatforslag |
| 05-report-offer.png | Sentrert kjøp, arbeid venstre og samtale høyre | Siste godkjente variant |
| 06-report-reader.png | Full rapport med kapittelmeny og PDF-knapp | Brukeren sa den ser bra ut |
| 07-character-style.png | Kantet figurstil og hverdagsklær | Tidlig valgt stilreferanse; senere sidespesifikke figurer går foran |

Filer ligger i selected/ relativt til designmappen; vis dem samlet i ../design/index.html.
Opphavsfilnavn og SHA-256 finnes i ../design/manifest.json.

## Retning
Blekk, aprikos, støvete blått, varm elfenben; rolige flater og god luft. Serif til sentrale overskrifter, lettlest sans-serif til kontroller og løpende tekst. Fonter (valgt 2026-10-18): Source Serif 4 til overskrifter og Manrope til tekst og knapper, lagt i app/assets/fonts og brukt via `var(--serif)` og `var(--sans)`. Tekststørrelser under 24 px følger skalaen 10, 11, 12, 13, 14, 15, 16, 18, 20, 22 px; nye regler bruker disse.
Foreløpige implementeringsforslag (ikke målte verdier fra bildene): ink #102747, apricot #F6B18D, dusty blue #93B7CD, ivory #FBF9F4. Kontrast må verifiseres når UI bygges.
Figurene er voksne i hverdagsklær med klare, geometriske kanter. Inspirasjon fra 16Personalities og InsightfulTraits, men eget uttrykk.

## Interaksjon
Svarfeltene er symmetriske: stor, middels, liten, middels, stor. Hele området med tekst må være lett å trykke. Ingen farger som antyder riktig/galt svar.
Hover: lett aprikos og subtilt løft. Valg: tydelig markering/hake og kort overgang.
Ingen obligatorisk Neste-knapp. Tilbake og Frem beholdes som diskrete kontroller.

## Responsivt
Mobilutforming er ennå ikke skissert eller testet. Bevar lesbarhet og trykkflater, også på midtvalget. Tilpass layout uten å endre svarrekkefølge eller skala. Ingen godkjenning av mobil kan utledes av desktopbildene.
PDF må få et eget lesbart sideoppsett. Ikke eksporter et skjermbilde av nettsiden som rapport.

## Illustrasjoner
De medfølgende bildene er generert med innebygd bildegenerering og er komposisjonsreferanser. For produksjon trengs separate figurer, en konsistent logo og faktiske UI-elementer. Ikke lat som hele screenshotet er en fungerende app.
