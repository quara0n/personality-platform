# Personvern og vilkår

Rune er behandlingsansvarlig gjennom sitt enkeltpersonforetak (beslutning 2026-10-18). Personvernerklæringen (`#privacy`, app/privacy-copy.js) og brukervilkårene (`#terms`, app/terms-copy.js) ligger under «Juridisk» (`#legal`), som lenkes fra bunnteksten. Begge finnes på engelsk og norsk bokmål.

Tekstene er skrevet for å beskytte Rune personlig så godt det lar seg gjøre, men de er ikke juridisk rådgivning. Rune har bestemt at ingen advokat skal lese dem (2026-10-18); da er det ekstra viktig at teksten holdes i takt med hva appen faktisk gjør.

## Må gjøres før lansering
1. `CONTROLLER` i app/privacy-copy.js er fylt inn: Rune Finne, org.nr. 915 553 346 (2026-10-18). Kontaktadressen er support@kaleidotest.com (Rune 2026-10-18); den må settes opp hos e-postleverandør før lansering.
2. Godta databehandleravtalene (DPA) hos Vercel, Supabase, Anthropic og Stripe. Hos alle fire ligger de i kontoinnstillingene eller vilkårene for bedriftskunder.
3. Bekreft at Supabase-prosjektet ligger i en EU-region.
4. Før en protokoll over behandlingene (artikkel 30). Personvernerklæringen kan brukes som grunnlag.
5. Når betaling slås på: sjekk at teksten om Stripe, kvitteringer og angrerett fortsatt stemmer med kjøpsflyten.
6. Ved overgang til AS: bytt navn og organisasjonsnummer i `CONTROLLER` og oppdater `UPDATED`.

## Når appen endres
Hvis en funksjon begynner å sende eller lagre noe nytt (analyse, e-postutsendelse, nye leverandører), skal personvernerklæringen og denne filen oppdateres i samme endring, og datoen `UPDATED` endres.
