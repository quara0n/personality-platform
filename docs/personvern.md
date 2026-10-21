# Personvern og vilkår

Rune er behandlingsansvarlig gjennom sitt enkeltpersonforetak (beslutning 2026-10-18). Personvernerklæringen (`#privacy`, app/privacy-copy.js) og brukervilkårene (`#terms`, app/terms-copy.js) ligger under «Juridisk» (`#legal`), som lenkes fra bunnteksten. Begge finnes på engelsk og norsk bokmål.

Tekstene er skrevet for å beskytte Rune personlig så godt det lar seg gjøre, men de er ikke juridisk rådgivning. Rune har bestemt at ingen advokat skal lese dem (2026-10-18); da er det ekstra viktig at teksten holdes i takt med hva appen faktisk gjør.

## Må gjøres før lansering
1. `CONTROLLER` i app/privacy-copy.js er fylt inn: Rune Finne, org.nr. 915 553 346 (2026-10-18). Kontaktadressen er support@kaleidotest.com (Rune 2026-10-18); den må settes opp hos e-postleverandør før lansering.
2. Godta databehandleravtalene (DPA) hos Vercel, Supabase, Anthropic og Stripe. Hos alle fire ligger de i kontoinnstillingene eller vilkårene for bedriftskunder.
3. Bekreft at Supabase-prosjektet ligger i en EU-region.
4. Før en protokoll over behandlingene (artikkel 30). Personvernerklæringen kan brukes som grunnlag.
5. Når betaling slås på: sjekk at teksten om Stripe, kvitteringer og angrerett fortsatt stemmer med kjøpsflyten.
6. Når måling slås på (GA4_ID, CLARITY_ID, GOOGLE_ADS_ID i Vercel): godta databehandlervilkårene for Google Analytics (Admin → Kontoinnstillinger → Data processing terms), Google Ads (Admin → Kontoinnstillinger → Databeskyttelse) og Microsoft Clarity (vilkårene godtas når prosjektet lages). I Clarity: slå av «Personalized ads»-deling hvis den er på.
7. Ved overgang til AS: bytt navn og organisasjonsnummer i `CONTROLLER` og oppdater `UPDATED`.

## Når appen endres
Hvis en funksjon begynner å sende eller lagre noe nytt (analyse, e-postutsendelse, nye leverandører), skal personvernerklæringen og denne filen oppdateres i samme endring, og datoen `UPDATED` endres.

## Måling (2026-10-21)
GA4, Google Ads-konverteringer og Microsoft Clarity lastes bare etter «Godta» i samtykkebanneret (app/analytics.js, valget i localStorage `kaleido-consent`). «Bare nødvendige» er like stor og like lett å trykke. «Informasjonskapsler» i bunnteksten åpner valget igjen. Uten ID-ene i Vercel vises verken banner eller teksten om måling i personvernerklæringen. Hendelsene har aldri svar, skårer, profilnavn, e-post eller bruker-ID. Resultatsidene er maskert i Clarity (`data-clarity-mask`).
