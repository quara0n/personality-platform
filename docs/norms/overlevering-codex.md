# Ekte empiriske persentiler for Fem — overlevering til Opus

Bygget og kontrollert 11. oktober 2026. Ingen appfiler eller GitHub-kode er endret.

## Brukerens beslutning

Bruk samme amerikanske nettreferanse for engelsk og norsk bokmål. Ikke lag en norsk norm av de 748 norske engelskspråklige svarene eller piloten med 298 deltakere. Opus tar integreringen i appen; denne pakken inneholder ferdige aggregerte normtabeller, etterprøvbar beregning og kontrolltilfeller.

Dette er ekte empiriske persentiler fra originaldataene, ikke en normalfordelingsantakelse, oppdiktede tall eller den gamle omregningen av svarskalaen til 0–100. Det er en historisk amerikansk nettreferanse, ikke en representativ befolkningsnorm eller dokumentasjon på norsk målevaliditet.

## Filene

- `ipip-neo-120-us-percentiles-v1.json`: tabellen appen kan bruke. Fem domener og 30 fasetter, 995 oppslag totalt. Ingen deltakerrekker.
- `percentiles.csv`: samme tabell i lesbart tabellformat.
- `item-mapping.json`: alle 120 posisjoner, spørsmål-ID-er, fasetter og reverseringsnøkler kontrollert mot arkivets Excel-nøkkel.
- `synthetic-verification-cases.json`: fire oppdiktede profiler med råsvar og forventede summer/persentiler for alle 35 skalaer. Dette er testdata, ikke personopplysninger.
- `validation-and-sensitivity.json`: kontroll av alle oppslag og alternative utvalgsavgrensninger.
- `verify_app_scoring.mjs`: kontroll av eksisterende skåringsmotor mot de syntetiske profilene. Send repoets absolutte mappe som argument.
- `build_norms.py`: gjenskap tabellene fra originalarkivet. Krever Python, numpy og xlrd. Kjør med `--repo <repo>` og `--output <utmappe>`. Originaldataene må finnes under `artifacts/norm-research/`; de følger ikke denne pakken.
- `Normgrunnlag-IPIP-NEO-120.md`: tidligere kildegjennomgang. Delen om hva som gjenstår før beregning er historisk; denne pakkens kontrollrapport dokumenterer nå utført beregning og sensitivitetsanalyse. Faglig gjennomgang og norsk språkvalidering er fortsatt ikke utført.
- `SHA256SUMS.txt`: filhashene for leveransen.

## Referanseutvalget

N = **243 307 svarrekker** fra USA med oppgitt alder 18–90, med alle 120 itemverdier i 1–5. Land er originalfeltet `COUNTRY == USA`, ikke verifisert bosted. Undersøkelsen var på engelsk. Innsamlingsår 2001–2011. Gruppen var selvvalgt og omtrent 82 % var under 35 år. Ingen vekting eller alders-/kjønnsjustering. N betyr svarrekker, ikke garantert unike personer.

Alder 18–90 er en dokumentert analyseavgrensning, ikke en validert aldersgrense for instrumentet. Denne filen er laget for voksenreferansen; ikke presenter den som en barnenorm eller egen norm for personer over 90. Hvis alder ikke er innhentet, merk tydelig at referansegruppen er voksne. Land, språk og valuta skal ikke automatisk skifte referansegruppe; begge språk bruker den samme filen.

Kilde: Kajonius, P. J. og Johnson, J. A. (2019), Supplementary materials, PsychArchives, DOI https://doi.org/10.23668/psycharchives.2448. Datalisens CC BY 4.0: https://creativecommons.org/licenses/by/4.0/. Dette er egne bearbeidelser; opphavspersonene har ikke godkjent Fems anvendelse. Behold attribusjon, kilde, lisenslenke og opplysning om bearbeiding i metode/kilder og distribusjon av normfilen. Spørsmålenes public domain-status og upstream-pakkens MIT-lisens er separate forhold.

## Integrering uten å endre spørsmålene

1. Behold originalspørsmål og eksisterende skåringsmotor. For nye råsvar reverseres negative items én gang: `6 − svar`. **Arkivets verdier er allerede reversert** og summeres direkte når normene bygges. Dobbel reversering gir feil norm.
2. Bruk `domain.sum` (24–120) og `facet.sum` (4–20) fra den skårede profilen. Kodene er N, E, O, A, C og N1–N6 osv. Høy N betyr mer følelsesmessig reaktivitet; filen snur ikke N til emosjonell stabilitet.
3. Finn skalaen i `norm.scales[code]`, deretter oppslaget med riktig `sum`. Bruk `displayPercentile` for visning. Eksakt beregning er `100 * (below + 0.5 * count) / n`. Rå counts er bevart, så alle verdier kan gjenskapes uten avrundingsfeil.
4. Persentilen er midtrang: halvparten av dem med lik skår bidrar til rangeringen. Bruk «omtrent ved 72. persentil», ikke «høyere enn nøyaktig 72 av 100 amerikanere». Fasetter har bare 17 mulige summer og mange like skårer.
5. Ikke bruk den gamle `position`-verdien som input; den er bare plassering på svarskalaen. Ikke interpoler mellom oppslag for ufullstendige brukersvar. Avvis manglende, ugyldige og ikke-heltallige summer. Ikke velg nærmeste oppslag eller klamp en feil råskår.
6. Skillet mellom råskår og persentil må være tydelig i figurer, tekst, eksport og lagrede resultater. Ikke endre rapportens redaksjonelle lav/midt/høy-regler bare fordi persentiler vises: dagens regler bygger på itemgjennomsnitt. En eventuell overgang til persentilbaserte regler må gjøres konsekvent og kontrolleres separat.
7. Lagre `normVersion` med resultatet og rapporten. Eksisterende komplette råsvar kan skåres med denne normversjonen uten ny gjennomføring når instrument og nøkkel er uendret. Skårings-/instrumentversjoner må ikke blandes.
8. Hele persentiler er avrundet med `floor(P + 0.5)`. Empiriske ytterpunkter kan avrundes til 0 eller 100. Eventuell visning som «under 1» / «over 99» må være en tydelig visningsregel, ikke endring av dataene.

## Kort merking på norsk

> Sammenlignet med amerikanske nettdeltakere. Sammenligningen bygger på den engelske testen; overføring til norsk språk er ikke særskilt validert.

I utdypende metodeforklaring:

> Persentilene bygger på 243 307 komplette amerikanske nettbesvarelser fra voksne med oppgitt alder 18–90, samlet inn på engelsk i 2001–2011. Deltakerne valgte selv å ta testen, og de fleste var unge voksne. Dette er en historisk referansegruppe, ikke et representativt utvalg av hele USAs eller Norges befolkning. Personer med lik skår deles i rangberegningen. En persentil beskriver plasseringen av skåren i denne gruppen; den er ikke prosent personlighet, en diagnose eller et mål på hvor sikker målingen er.

På engelsk:

> Compared with US online respondents who took the English test. This historical volunteer sample is not representative of the entire US population.

## Utførte kontroller og praktiske begrensninger

- ZIP-filens MD5 matcher tidligere kildekontroll: `e1bd2b3b385d0ad77dfbb1d0496589c6`.
- `IPIP120.dat` SHA-256: `526daf7ebe7d480ba71258cd20f0fc3b37ab3a43a2e4191c19a49e185a1df53b`.
- Alle 120 posisjoner, fasetter og positive/negative nøkler er kontrollert mot arkivets `IPIP-NEO-ItemKey.xls`. Norsk ID/nøkkel er også kontrollert mot engelsk.
- Ordlydsavvik ved item 58 / O6: arkivnøkkelen sier «no absolute right **or** wrong», upstream/Fem sier «no absolute right **and** wrong». Posisjon, fasett og positiv nøkkel samsvarer. Dette er dokumentert; vi endret ingen spørsmål og hevder ikke ordrett identitet mellom alle kilder.
- Alle 35 fordelinger summerer til samme N. Alle 995 midtrangoppslag er monotone, ligger i 0–100 og matcher en uavhengig søkebasert beregning av lavere/like skårer. Kontrolltilfellene undersøker også reversering i Fems eksisterende skåringsmotor.
- Referansen utelukker manglende svar fremfor å imputere. Alternativet med opptil fire manglende items totalt, minst tre gyldige per fasett, proratering av fasetter og summering til domener gir N = 358 647. Største endring mot hovedtabellen er **0,70 persentilpoeng** ved de kontrollerte skårene. Alternativet er en sensitivitetsanalyse, ikke en anbefaling om å tillate ufullstendige brukersvar.
- Avgrensning til 19–69 år gir N = 212 869 og største endring **2,00 persentilpoeng**. En separat gruppe på 35–90 år gir N = 44 768 og opptil **18,41 persentilpoeng** forskjell på en fasett (E5). Alder kan altså bety mye for sammenligningen. Dette er forskjeller mellom grupper, ikke konfidensintervaller eller målefeil. Tabellen er samlet og ikke aldersjustert.
- Ingen av hovedutvalgets profiler har samme råsvar på alle 120 spørsmål etter at arkivets reversering er tilbakeført. Dette er bare én enkel responskontroll. Det utelukker ikke annen svarstøy; ingen nye vilkårlige renseregler eller duplikatregler er innført.

Beregningen er kontrollert. Uavhengig psykometrisk fagvurdering, ny representativ rekruttering, norsk målevaliditet og individuelle usikkerhetsintervaller er ikke levert med denne pakken. Ikke skriv at tabellen er «validert norsk norm», «aldersjustert» eller en rangering blant alle mennesker.

## Eksempel som viser forskjellen fra gammel 0–100-skala

Et itemgjennomsnitt på 3,00 gir domenesum 72 og gammel skala-plassering 50. Det gir derimot følgende empiriske persentiler i den valgte gruppen:

| Trekk | Domenesum | Persentil, avrundet |
| --- | ---: | ---: |
| Åpenhet, O | 72 | 21 |
| Planmessighet, C | 72 | 12 |
| Ekstroversjon, E | 72 | 23 |
| Medmenneskelighet, A | 72 | 9 |
| Følelsesmessig reaktivitet, N | 72 | 64 |

Dette er matematiske eksempler, ikke en persons rapport. Middelpunktet på svarskalaen er ikke automatisk middelpunktet i referansegruppen.
