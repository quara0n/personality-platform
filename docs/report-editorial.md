# Report editorial rules

The English content in `app/data/report-content.json` is original editorial writing for an adult self-reflection audience. `app/data/report-content-no.json` is a complete Bokmål localization with the same schema, domain/facet keys, and interpretation rules. The launch markets are the US and Norway. The content is organized around IPIP-NEO-120 domains and facets. It is not copied or adapted from a competitor's reports. Instrument provenance, item permissions, and scoring evidence belong in the instrument research record; the existence of a validated questionnaire does not validate this report's prose or suggestions.

The Norwegian report translates all visible content, including names, introduction, caveats, and practical suggestions. Its facet labels are editorial translations linked to the original English labels by stable keys, not a claim of an independently validated report translation. Language changes must preserve scores and band selection. Printed/PDF output must use the selected language throughout. Currency selection is independent of these interpretation rules and must never alter content or scores. Native-language comprehension and psychometric review should cover each locale before launch.

## Traceability contract

1. Complete item responses are scored with the instrument's documented key, including reversal where required. Scoring is owned by the application; this content file never calculates scores.
2. The keyed mean for each domain selects exactly one editorial band: `low` for a mean below 2.5; `middle` for 2.5 through 3.5 inclusive; `high` for a mean above 3.5. Select using the unrounded mean; rounding is for display only.
3. These cutoffs are transparent editorial choices, not validated thresholds or norms. In user-facing prose, prefer “lower response mean,” “middle response mean,” and “higher response mean.” Never present the bands as population low/average/high, a percentile, or a diagnostic range.
4. For each domain, show its description and the selected band's meaning, possible strength, watch point, work application, life application, and experiment. A work or life suggestion must retain its domain identity and selected band so its origin remains visible.
5. Each facet has a description and two directional interpretations. Use `low` below 2.5 and `high` above 3.5. For the inclusive middle range, show the description with neutral wording explaining that the response mean is in the middle band; do not select a directional interpretation by rounding or choose one arbitrarily. The same editorial-band limitation applies.
6. Show the introduction and limitations in the full report and preserve them in printed/PDF output. A shorter free result must still explain the response scale, lack of norms, and nonclinical purpose.
7. Do not invent interactions between traits, rank suitable careers, or claim that an experiment will work. A changed answer that changes the selected band must update every report view consistently.

## Content model

The root has `introduction`, `limitations`, `domains`, and `facets`. Domains use canonical keys N, E, O, A, C; each has `name`, `description`, and three bands with identical fields: `meaning`, `strength`, `watch`, `work`, `life`, `experiment`. Facets use N1–N6, E1–E6, O1–O6, A1–A6, and C1–C6; each has `name`, `description`, `low`, and `high`.

The displayed N domain is “Emotional reactivity (Neuroticism)” so the accessible phrasing remains connected to the instrument term. Historical facet labels are retained for traceability, with boundaries on their meaning. Anxiety and Depression are not clinical assessments. Intellect is interest in ideas, not IQ. Morality concerns straightforwardness and strategic presentation, not moral worth. Liberalism includes actual political and conventional beliefs: liberal/conservative candidates, crime policy, and absolute right/wrong. Do not obscure this sensitive item content as merely abstract curiosity or questioning authority. The score does not establish party membership or voting behavior. Political references are culturally specific, and translation alone establishes neither cultural equivalence nor Norwegian norms. Emotionality is attention to feelings, not distress or empathy; low Extraversion is not proof of shyness.

## Editorial standards

- Describe the user's answers before offering an interpretation. Use conditional language for possible real-world expressions.
- Avoid fixed types, universal advantages, flattering certainty, and deficit labels. No score level establishes competence, worth, health, relationship quality, or employment suitability.
- Explain that middle means can conceal divergent facets. Do not automatically characterize a middle score as balanced, adaptive, or ideal.
- Keep practical suggestions small, observable, reversible, and tied to the particular trait. They are hypotheses for reflection, not validated interventions or treatment recommendations.
- Preserve a distinction between feelings, intentions, and observed behavior. An anger score is not evidence of aggression, for example.
- Encourage checking an interpretation against concrete experience and context. Do not imply that a trait score alone reveals another person's motives.
- Report uncertainty plainly: self-report context matters, four-item facets are narrow, small differences and boundary changes deserve caution, and no individual confidence interval is supplied.
- Do not manufacture a crisis response from a questionnaire facet. The report neither diagnoses nor rules out a condition.

## Review and launch boundary

Structural review should confirm five domains, three complete bands per domain, 30 unique facets, and readable populated fields. Scoring and report integration should separately check both exact boundaries, reverse-keyed responses, and a profile with divergent facets. Review printed output for omissions and clipping. These checks establish consistency of implementation, not psychometric validity of the prose.

The content is ready for integration and editorial review. Independent psychometric review and representative adult user comprehension testing remain launch work; do not describe the report interpretations as clinically validated. Record any later content or threshold revision so the same responses can be traced to the version of the report that produced the text.
