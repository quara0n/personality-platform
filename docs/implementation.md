# Assessment and report implementation

Updated 2026-10-11. The original handoff remains a historical record.

## Scope delivered

Buildless HTML/CSS/JavaScript application, with no application-server collection of answers. English and Norwegian Bokmål questionnaires and reports, 120 items, five domains, thirty facets, free results, combined work/life report, up to three facet-based suggested experiments and native browser print/save-PDF. The one-time-purchase offer is explicitly a preview: no payment is collected and no paid entitlement is simulated.

The user confirmed USA and Norway first, fixed one-time prices of USD 9.99 and NOK 99, and Stripe. Browser language proposes English/USA/USD or Norwegian/Norway/NOK. Independent manual language and country selectors remain available. This is a locale suggestion, not IP geolocation. There is no invented exchange rate. Prices are displayed, with checkout explicitly unavailable. See docs/stripe-setup.md for exact minor-unit amounts and remaining setup.

## Scientific contract

See research/ipip-neo-120-evidence.md, research/report-evidence.md and app/data/provenance.json. The exact upstream revision is 493546d48eb9053aca7e6c55574f4bf8033cc5a4. The item texts are public domain; the imported distribution is MIT, with notice retained in the shipped app. All 120 English texts and signs are compared against the official original key by scripts/verify_items.py. Norwegian metadata matches all 120 English IDs and keys; available translation is attributed to Eli Huseby. Norwegian linguistic equivalence and representative norms were not established here.

Raw choices are integers 1–5. Negative keys use 6 minus response. Each four-item facet sums to 4–20; each 24-item domain sums to 24–120. Displayed means are sum/item count; bar position is (mean−1)×25. These are not percentiles. Editorial bands use unrounded means below 2.5, inclusive 2.5–3.5 and above 3.5. The report retains its scores and deterministic rule IDs. No AI call is needed to produce results.

Answers remain in browser session storage; preferences in local storage. Clear answers removes the session's responses. No identity, email, analytics or payment data are requested. A hosting provider can still process ordinary access metadata; this must be disclosed in production policy. Printed/downloaded reports are the user's own files.

## Run and verify

- `npm start`: local app at http://127.0.0.1:4173.
- `npm test`: scoring and report contract tests.
- `npm run verify:items`: exact source-key audit (Python 3).
- `npm run build`: copy app into dist; no dependencies to install.
- `node scripts/browser-check.cjs`: Chrome/Playwright end-to-end verification. Provide PLAYWRIGHT_MODULE_PATH when using bundled Playwright. Uses synthetic answers only and saves evidence in artifacts/.

## Remaining commercial launch dependencies

USD/NOK prices and Stripe are confirmed. Live Stripe access, tax treatment, seller identity and terms, paid delivery/access after checkout, support/refund policy, and domain/name remain open. Live checkout must verify payment server-side and enforce idempotent delivery; a browser flag must never grant a real paid entitlement. Those features cannot be claimed complete by this preview. Independent psychometric/editorial and user comprehension review remain release criteria. Representative percentiles are deliberately absent.

GitHub destination is the private quara0n/personality-platform repository. See docs/github-setup.md for publication status. Sites source hosting is a separate destination.

## Facet report v2
Report version `editorial-v2-facets-2026-10-11` retains all raw domain and facet scores. Each of 30 facets has an English and Norwegian middle interpretation instead of displaying both opposing endpoint descriptions. Within-domain highest/lowest means are shown together when their range is at least 1 response point. This is an editorial presentation threshold, not statistical significance or psychometric evidence. Wording boundaries are explicitly softened when a facet mean lies within 0.25 of 2.5 or 3.5; numerical scores remain visible.

Work/life chapters select up to two non-middle facets per domain, ranked by absolute distance from the response midpoint of 3, with facet-code ties. Next steps select up to three non-middle facets across all domains using the same rule. These are reflection prompts, not predictions or evidence that the selected facets are deficits. A wholly middle profile receives an observation prompt instead of invented standout traits. The overview shows facet contrasts early; the longer reading limitations follow the substantive report.

`app/answer-backup.js` encodes raw answers and current question with a format and instrument version. The downloaded JSON supports partial and completed assessments and is independent of report version, country and language. Import validates identifiers, integer responses and instrument version before replacing a session, asks before replacing existing answers, and invalidates pending answer transitions. Clear and newer imports also cancel obsolete file reads. No uploaded answers leave the browser. Session storage behaviour is unchanged; closing the tab still requires a downloaded backup to ensure reuse. Downloaded files are not deleted by the in-app clear action.
