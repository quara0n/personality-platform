# Verification record — 2026-10-11

## Completed evidence

- No existing implementation or tests were present. The new scoring tests first failed with a missing scoring module, before implementation. Seven Node tests now pass: neutral, keyed endpoints, reversal, malformed/incomplete inputs, instrument shape, Norwegian identity/key parity, and both exact editorial boundaries with complete bilingual report content.
- `python scripts/verify_items.py` passes all 120 English item texts, facet assignments and signs against the saved official IPIP key (terminal punctuation normalized). All Norwegian IDs, facets and keys agree. Upstream revision and SHA-256 values are in app/data/provenance.json.
- `scripts/browser-check.cjs` passed in installed headless Chrome with 1440×1000 and 390×844 viewports: all 120 answers through actual controls, back/change/resume, five free results, thirty report facets, three actions, English/Norwegian report generation, NOK offer, no horizontal overflow, keyboard focus without submission, reduced-motion setting, and no page errors.
- `scripts/preview-check.cjs` passed Norwegian browser defaults, independent country/language selection, rapid double-click protection, language switch while in a report chapter, answer deletion, fresh screenshots and both sample PDF exports.
- English and Norwegian synthetic reports were rendered through the actual print styles. Current examples contain 16 pages each; text extraction confirms all thirty Norwegian facet names and all nine limitations. Representative cover, score, facet and late report pages were inspected visually. Print styling was adjusted to remove sparse forced pages, preserve score labels, and add page numbers.
- CSS review and screenshots prompted tighter decorative-image clipping and mobile spacing so the question figure does not overlap the pause link.
- No lint or type-check command is configured for this dependency-free vanilla JavaScript app. JavaScript syntax checks passed.

## Simplification

Three independent ce-simplify-code reviewers examined reuse, quality and efficiency. Applied two reuse findings (canonical domain order and canonical facet codes), an unused-import removal, and browser cleanup in a finally block. Deferred duplicated locale-control markup and chapter-render caching as low-value changes for this small fixed-size app; caching would reintroduce a stale-language risk without demonstrated performance need. These are not launch blockers.

## Limits

Tests establish calculation and implementation consistency, not local psychometric validation. No payment, purchase entitlement, tax calculation, hosted user database or commercial checkout exists to verify. Browser language suggests locale; it does not establish physical location. English and Norwegian public-domain/translated content is versioned, but no population norms or treatment claims are provided. Native print/save PDF depends on the user's browser; generated samples use Chrome. Real participant data were not used.

Independent code-review receipt and deployment outcome will be recorded after completion.

## Design follow-up and review resolution
- Compared the landing, question and loading screens directly against selected reference PNGs. Restored the separated five-triangle mark and Fem wordmark; enlarged landing artwork, compacted the header, removed the political-voting landing note, and changed UI item labels to questions. Retained all 120 original keyed items.
- `scripts/design-check.cjs` passed Norwegian/English labels, compact header, and no horizontal overflow at 390, 768 and 971 pixels. Screenshots at desktop and mobile were inspected.
- The independent eight-lens review completed with one confirmed P2: obsolete locale fetch failures could overwrite a newer successful page. Added the same load-token guard to the failure branch. `scripts/locale-race-check.cjs` reproduced the failure before the fix and passed after it. All seven scoring/content tests still pass.
- Review receipt is stored outside the repo in ../review-artifacts/20261011-bigfive. Its payment-connection description predates the subsequently approved Stripe sandbox; commercial checkout remains unfinished.

## Facet report v2 and reusable answers (2026-10-11)
- Proof-first: equal-domain/different-facet and neutral report tests failed on the old report; answer-file tests failed before the backup module existed. All 11 tests now pass.
- Source audit: all 120 English texts, facet assignments and signs still match the official key; Norwegian IDs and scoring metadata match.
- `scripts/report-upgrade-check.cjs`: synthetic profile with E facets 5/1/4/2/3/3; verifies contrasts, all 30 facet descriptions, facet actions, downloaded backup, restore in another tab, reload, both languages, invalid-file preservation, neutral profile, desktop/mobile overflow and printable PDF. No real user answers are accessed or saved to the repository.
- Simplification: three independent reuse/quality/efficiency passes. Centralized facet selection in the report model and removed duplicate restore rendering that could clear the success message. No configured lint/typecheck; JavaScript syntax and runtime/browser checks used.
- Original `scripts/browser-check.cjs` remains the 120-answer end-to-end regression check.
- This validates implementation and response/report traceability, not Norwegian linguistic equivalence, population norms or new psychometric accuracy.

- Code review completed: `20261011-report-facets`, focused correctness plus independent local adversarial review. Finding #1 (P2, a pending answer import could undo a clear) applied inline. A deferred-read browser regression failed before the fix and now passes for both clear and a newer import. No unresolved findings.
- Final full 120-answer browser regression passed. Final report-upgrade browser regression passed, including the import/clear race.
