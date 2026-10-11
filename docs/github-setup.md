# GitHub-status og publisering

Per overleveringen: lokalt repo, ingen remote, ingen GitHub-push. Git finnes. GitHub CLI finnes ikke i PATH eller de kontrollerte vanlige installasjonsmappene. Et ikke-interaktivt forsøk med Git Credential Manager returnerte ingen tilgjengelig GitHub-innlogging. Den tilkoblede GitHub-koblingen tilbyr ikke oppretting av repository.

Brukeren har bedt om oppretting og push. Privat repo er et forsiktig foreslått standardvalg for dette upubliserte prosjektet; ingen organisasjon er valgt.

Når GitHub CLI og innlogging er tilgjengelig, kan følgende kjøres fra prosjektroten:
```powershell
gh auth login
gh repo create personality-platform --private --source . --remote origin --push
```

Navnet er et teknisk forslag. Ved navnekollisjon velg et ledig navn; ikke skriv over et eksisterende repo.
Alternativt: opprett et tomt privat repo i GitHub, sett den bekreftede URL-en som origin og push den lokale grenen.
Lokal gren er bootstrap/project-foundation. Den kan brukes som første standardgren eller omdøpes til main før første push etter prosjektets konvensjon.
Verifiser remote, commit og tilgang etter push. Ikke rapporter GitHub som ferdig før dette faktisk er gjort.
