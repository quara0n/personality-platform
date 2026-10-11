# IPIP-NEO-120: instrument and implementation evidence

Reviewed: 2026-10-11. Scope: English, adult self-reflection product. This is an evidence and implementation decision record, not a claim of local validation.

## Recommendation

Use the original Johnson IPIP-NEO-120 English item set, with its published item keys, to produce five domain scores and thirty facet scores. Keep all 120 items and their wording. Explain results as tendencies reflected in the user's answers. Launch the assessment with transparent raw score interpretation; do not manufacture population percentiles. Report guidance must remain exploratory rather than diagnostic or a hiring recommendation.

## Rights: public domain and MIT refer to different layers

The official [IPIP permission statement](https://ipip.ori.org/newPermission.htm) explicitly permits commercial and non-commercial use of IPIP items, scales and inventories without seeking individual permission. The questions are public-domain material. This permission does not extend to every commercial Big Five questionnaire, competitor's report prose, illustration, trademark, or journal article discussing the instrument.

The [Alheimsins question package](https://github.com/Alheimsins/b5-johnson-120-ipip-neo-pi-r) provides a convenient machine-readable implementation and translations. Its [MIT license](https://raw.githubusercontent.com/Alheimsins/b5-johnson-120-ipip-neo-pi-r/main/LICENSE) carries Copyright (c) 2017 Geir Gåsodden and requires retention of its copyright and permission notice in copies or substantial portions of the software. Preserve the complete notice when importing its code, identifiers or data organization. Describe the product as using public-domain IPIP questions, with MIT-licensed packaging if reused. Do not describe the scientific instrument itself as an MIT-developed test.

## Exact item source and O6 audit

The authoritative [IPIP four-item facet key](https://ipip.ori.org/30FacetNEO-PI-RItems.htm) specifies all thirty facets and their signs. The current [Alheimsins English JSON on main](https://raw.githubusercontent.com/Alheimsins/b5-johnson-120-ipip-neo-pi-r/main/data/en/questions.json), as returned by web retrieval on the review date, contains the same four Liberalism (O6) statements:

| Item in published sequence | Meaning | Key |
|---|---|---|
| 28 | Tendency to vote for liberal political candidates | Positive |
| 58 | Belief that no absolute right and wrong exists | Positive |
| 88 | Tendency to vote for conservative political candidates | Reverse |
| 118 | Belief in being tough on crime | Reverse |

This review did **not** establish an O6 wording difference in the web-returned main version. Cached web pages and moving branch URLs are not sufficient for release provenance: compare the exact downloaded commit or package version against the official key. A variant replacing political statements with general authority/tradition statements is an adaptation, even when permitted by the license; it cannot silently inherit the original validation or norms. Keep a provenance manifest with retrieval date, immutable revision where available, file hash, source URLs and any corrections. Check every item and key, not just O6.

The original O6 content includes political opinions. Preserve scientific transparency: explain that this is part of the original inventory, allow the user to stop, and avoid using its answers for political targeting. Do not rename this facet in a way that hides its content. Cross-country interpretations of political labels are uncertain. It is not a general test of moral worth or tolerance.

## Psychometric evidence

### Johnson (2014)

[Original paper, author-hosted PDF](https://bpb-us-e1.wpmucdn.com/sites.psu.edu/dist/1/163537/files/2023/07/IPIPNEO120.pdf); [DOI](https://doi.org/10.1016/j.jrp.2014.05.003). Reviewed full-text development, Table 1, Table 2 and validity discussion.

The short form was developed using 21,588 internet respondents and evaluated in community, internet and acquaintance-rating samples. The directly administered 120-item internet sample contained 619,150 screened cases. Its facet alphas ranged from .63 to .88; the paper explicitly cautions that these short facets probably should not determine important decisions about individuals. Average correlation with corresponding NEO PI-R facet scales was .66 before correction for unreliability. The short and long inventories measure similar, not identical, constructs. Development balanced reliability and content, rather than taking four arbitrary questions per facet. The article is instrument evidence, not validation of this application's report advice, response interface or target market.

### Kajonius and Johnson (2019)

[Original full text](https://ejop.psychopen.eu/index.php/ejop/article/download/1671/1671.html?inline=1); [DOI](https://doi.org/10.5964/ejop.v15i2.1671). Reviewed methods, limitations, factor tables and discussion.

This structural study used 320,128 US online volunteers aged 19–69 (mean 28.1; 60% female). Authors expressly state the sample is probably not nationally representative. Five recognizable domains emerged, with qualifications: some facets cross-loaded, Modesty was weakly connected to Agreeableness, and Openness was relatively loosely structured (explained common variance .43). Mean facet alpha was .78; four facets were below .70. Structural support does not make each facet independent or equally precise. Nor does the large sample establish country-specific population norms, clinical accuracy, or suitability for employment decisions. The paper describes response anchors as frequency; the official IPIP scoring guidance uses accuracy anchors. Record the actual anchors used in this product rather than claiming every reviewed study used identical administration.

## Scoring contract

The [official scoring instructions](https://ipip.ori.org/newScoringInstructions.htm) assign 1–5 to increasing accuracy on positive items, reverse the assignment on negative items, and sum keyed responses.

Recommended implementation:

1. Store raw answers as integers 1–5 tied to stable item IDs and instrument version. Reject unknown IDs, missing items, duplicate IDs, non-integers and out-of-range values for a final report.
2. For positive keys, scored value is the answer; for reverse keys, it is `6 - answer`. Never reverse twice.
3. Sum the four scored items per facet: range 4–20. Sum the twenty-four items per domain: range 24–120. Means (sum divided by item count) range 1–5.
4. If the design needs a 0–100 bar, use `25 * (mean - 1)`. Label it scale position, never percentile or percent of personality. It describes endorsement on the possible answer range.
5. Use unrounded values for interpretation and round only for display. Save the instrument and report version with exports.

Any low/middle/high interpretation thresholds are editorial rules unless calibrated empirically. State that explicitly. They must not be called population averages, diagnostic cutoffs or validated categories. Do not treat the largest raw domain score as a strongest trait relative to other people: domain distributions differ.

## Norms and launch boundaries

The [official norms page](https://www.ipip.ori.org/newNorms.htm) warns against canned norms, recommends relevant local comparisons, and links to research datasets. A huge online volunteer sample is still self-selected. The 50-item IPIP factor-marker datasets are different instruments and cannot supply interchangeable norms for this 120-item test.

A later percentile release needs a documented target population, matching instrument/anchors/language, sample selection and cleaning rules, reference distributions, subgroup sizes, uncertainty and versioned calculation. Retest change needs a separate reliability basis. This research did not derive or approve such norms.

Launch checks: exact 120-item/key audit; five domains × six facets × four items; reverse-key fixtures; incomplete-input rejection; neutral and extreme profile checks; transparent score labels; cautious facet wording; privacy disclosure covering local persistence/export; no diagnosis, ability ranking, political targeting, hiring suitability or career certainty. These are project recommendations based on the evidence, not proof that a local validation study has occurred.
