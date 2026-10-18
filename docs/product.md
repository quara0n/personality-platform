# Produkt og brukerreise

## Tilbud
En nyttig gratis Big Five-profil, med valgfritt engangskjøp av én fordypningsrapport. Rapporten hjelper brukeren å forstå mønstre og prøve konkrete tiltak i arbeid og hverdag. Ingen jobbgaranti, diagnose eller fast personlighetstype.

## Flyt
Landing → spørsmål → kort logoovergang → gratisresultat → rapportens kjøpsside → betaling → full rapport.

Betaling er en kommende funksjon, ikke ferdig implementert. Tilgang må i produksjon knyttes til verifisert betaling, med håndtering av avbrudd og nytt forsøk uten dobbeltbelastning.

## Spørsmål
- Ett utsagn om gangen. Designkonseptet viste svarvalg fra Strongly disagree til Strongly agree; dette er UX-retningen, endelig skala avhenger av instrument.
- Klikk/touch velger; hover velger aldri.
- Kort visuell bekreftelse med farge og hake før automatisk neste spørsmål.
- Tilbake gjenåpner tidligere svar. Endring erstatter det gamle svaret.
- Frem blar gjennom allerede besvarte spørsmål. Ikke bruk den til utilsiktet å hoppe over ubesvarte.
- Ikke aktiver neste svar ved dobbeltklikk under overgang. Bruk radiosemantikk og synlig tastaturfokus; fokus alene må ikke sende svar.
- Etter siste svar vises logoovergangen én gang, deretter resultat.
- Fremdrift må samsvare med faktisk besvarte spørsmål; skissenes 20 % er eksempel.
- Redusert bevegelse støttes med rolig toning eller statisk logo. Dette er implementeringskrav foreslått for tilgjengelighet.

## Gratis resultat
Alle fem trekk vises med forståelige forklaringer. Ingen betaling nødvendig for denne grunnverdien.
Skalaens betydning må forklares etter instrumentvalg. Nåværende bilde har illustrative markører, ikke verifiserte persentiler.
En kort oppsummering av kombinasjonen og utfellbare trekkforklaringer leder til valgfri fordypning.

## Betalt rapport
1. **Overview:** trekkoversikt og en kort, begrunnet oppsummering.
2. **Your five traits:** nyansert forklaring, mulige styrker og utfordringer, situasjonsavhengighet. Bare målte fasetter tas med.
3. **Work & career:** arbeidsstil, samarbeid, struktur, motivasjon og miljøer å utforske. Ikke bastante yrkesanbefalinger.
4. **Everyday life:** sosial energi, kommunikasjon, vaner, relasjoner og reaksjoner under press.
5. **Your next steps:** tre realistiske tiltak og spørsmål brukeren kan reflektere over.

Gjennomgående kapittelstruktur: Hva tyder svarene på? Hvordan kan det vise seg? Hva kan du prøve?
Rapporten skal kunne leses på nett og lastes ned som PDF. Bildeknappen implementerer ikke eksport.

## Innholdskvalitet
Hver personlig tolkning skal kunne spores til skår/trekk og faglig grunnlag. Skill observasjon, forsiktig tolkning og forslag. Unngå generelle smigrende tekster som fremstilles som presise funn.
Motivasjon, verdier, evner og mental helse må ikke hevdes målt bare fordi brukeren tok en Big Five-test.
