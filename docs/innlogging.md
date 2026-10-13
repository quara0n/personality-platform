# Innlogging og lagret profil

Valgfri innlogging med Google, Apple eller X lar folk lagre de 120 svarene og åpne profilen igjen på en annen enhet. Testen, gratisprofilen, rapporten og videoen virker uten konto. Koden ligger i `app/account.js`, databasen i `supabase/migrations/`.

## Slik virker det
- Tjenesten er Supabase (innlogging og Postgres-database). Appen bruker PKCE-flyten, så innloggingen kommer tilbake som `?code=…` og kolliderer ikke med `#`-rutene.
- Lagret: svarene som samme kode som profillenken (`1` + 120 sifre), språk og tidspunkt, én rad per konto i `public.profiles`. Radnivåsikkerhet gjør at hver bruker bare kan lese, endre og slette sin egen rad.
- «Lagre profilen din» står under e-postboksen i gratisprofilen. Etter innlogging derfra lagres profilen automatisk. «Min side» (`#account`) viser kontoen, åpner den lagrede profilen, erstatter den med svarene i fanen, sletter profilen, sletter kontoen (`delete_my_account()`) og logger ut.
- Uten oppsett er alt skjult. Med `?dev=1` vises knappene deaktivert, slik at designet kan sees i forhåndsvisningen.

## Oppsett (gjøres én gang av Rune)
1. Opprett et Supabase-prosjekt i en EU-region (for eksempel Stockholm eller Frankfurt).
2. Kjør `supabase/migrations/20261013000000_profiles.sql` i SQL-editoren.
3. Under Authentication → URL Configuration: sett Site URL til produksjonsadressen og legg til Vercel-forhåndsvisningene (`https://*.vercel.app`) og `http://127.0.0.1:4173` som tillatte omdirigeringsadresser.
4. Slå på leverandørene under Authentication → Providers. Tilbakekallingsadressen som skal inn hos hver leverandør, står på samme side (`https://<prosjekt>.supabase.co/auth/v1/callback`).
   - Google: OAuth-klient (Web) i Google Cloud Console. Gratis.
   - Apple: krever Apple Developer Program (99 USD per år), en Services ID og en nøkkel for Sign in with Apple.
   - X: app i X Developer Portal med OAuth slått på. Supabase kaller leverandøren `twitter`; hvis prosjektet bruker den nyere `x`-leverandøren, sett `SUPABASE_X_PROVIDER=x`.
5. I Vercel → Settings → Environment Variables: `SUPABASE_URL` og `SUPABASE_ANON_KEY` (Project Settings → API i Supabase). Begge er offentlige verdier. Service role-nøkkelen skal aldri inn i Vercel-bygget eller Git.
6. Deploy på nytt. `scripts/build.js` skriver verdiene til `dist/config.js`.

## Kontroll
- `npm test` dekker kodeformatet og konfigurasjonen.
- `node scripts/account-check.cjs` (med `npm start` kjørende) går gjennom innlogging, automatisk lagring, åpning i en ny fane og sletting av konto med en stand-in for Supabase-klienten.

## Gjenstår før lansering
- Personvernerklæring og databehandleravtale med Supabase; vurdere om svarene skal regnes som særlig følsomme opplysninger.
- Koble kjøp av fordypningsrapporten (Stripe) til kontoen, slik at rapporten kan åpnes på alle enheter etter kjøp.
