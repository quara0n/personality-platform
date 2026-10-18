# Personvern og vilkår

Rune er behandlingsansvarlig gjennom sitt enkeltpersonforetak (beslutning 2026-10-18). Personvernerklæringen (`#privacy`, app/privacy-copy.js) og brukervilkårene (`#terms`, app/terms-copy.js) ligger under «Juridisk» (`#legal`), som lenkes fra bunnteksten. Begge finnes på engelsk og norsk bokmål.

Tekstene er skrevet for å beskytte Rune personlig så godt det lar seg gjøre, men de er ikke juridisk rådgivning. La en advokat eller rådgiver med personvernkompetanse lese dem før lansering.

## Må gjøres før lansering
1. Fyll inn `CONTROLLER` i app/privacy-copy.js: fullt navn, organisasjonsnummer og en kontaktadresse (gjerne en egen adresse på kaleidotest.com). Til da viser sidene at opplysningene kommer.
2. Godta databehandleravtalene (DPA) hos Vercel, Supabase, Anthropic og Stripe. Hos alle fire ligger de i kontoinnstillingene eller vilkårene for bedriftskunder.
3. Bekreft at Supabase-prosjektet ligger i en EU-region.
4. Før en protokoll over behandlingene (artikkel 30). Personvernerklæringen kan brukes som grunnlag.
5. Når betaling slås på: sjekk at teksten om Stripe, kvitteringer og angrerett fortsatt stemmer med kjøpsflyten.
6. Ved overgang til AS: bytt navn og organisasjonsnummer i `CONTROLLER` og oppdater `UPDATED`.

## Når appen endres
Hvis en funksjon begynner å sende eller lagre noe nytt (analyse, e-postutsendelse, nye leverandører), skal personvernerklæringen og denne filen oppdateres i samme endring, og datoen `UPDATED` endres.
