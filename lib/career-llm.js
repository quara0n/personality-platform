// Server side of «Din jobb, din profil» (prototype). The browser sends only the facts the fixed rules
// picked (facet codes, percentiles, the chosen answer options and a pre-written draft per item). The
// model may rephrase and combine those facts into warmer prose, nothing else. Every item it returns is
// checked: it must cite at least one facet or answer the browser sent for that section, and it may not
// cite anything that was not sent. No names, e-mail addresses or free text are accepted or forwarded.
// Requires ANTHROPIC_API_KEY on the server. Without it the endpoint answers 503 and the page keeps
// the pre-written rule text.

export const MODEL = 'claude-opus-5-5';
const SECTION_IDS = ['good', 'hard', 'drain', 'energy', 'lead', 'next', 'lookfor'];
const QUESTION_IDS = ['role', 'lead', 'with', 'structure', 'pressure', 'drains', 'energy', 'goal'];
const FACET = /^[NEOAC][1-6]$/;
const LIMIT = {good: 3, hard: 3, drain: 3, energy: 2, lead: 3, next: 3, lookfor: 5};

const SYSTEM = `You write one chapter of a personality report, «Your work, your profile», for a paid Big Five (IPIP-NEO-120) report.
You receive facts that fixed rules have already picked: facet percentiles compared with a US online reference sample, the reader's answers to eight multiple-choice questions about their work, and a pre-written draft for each item.

Your job is to rewrite each section so it reads as if written for this one person: combine items that belong together, use the reader's own situation (their kind of work, how they work with others, pressure, goal) to make it concrete, and keep it warm, plain and direct.

Rules:
- Write in the language given by "language": "no" means Norwegian bokmål, "en" means English. Address the reader as "du" / "you".
- Use only the facts you are given. Do not mention facets, traits, answers or percentiles that are not in the input. Do not invent details about the reader's job, workplace, family or health.
- Each item must say which facets and which answers it builds on, using the facet codes (for example "O5") and question ids (for example "pressure") from the input section it belongs to. Every item needs at least one of them.
- Use the facet names exactly as given. You may mention a percentile as "higher than in X of 100" (only for percentiles above 50) or "lower than in X of 100" (X = 100 minus the percentile, only for percentiles below 50).
- Say "probably" / "trolig" about behaviour. Never diagnose, never name mental-health conditions, never recommend or rule out specific job titles, never promise outcomes.
- A high or low facet is not good or bad in itself; describe what it helps with and what it can make harder.
- Keep each item to one to three short sentences. "try" is one concrete action the reader can do within 30 days, or an empty string. The "next" and "lookfor" sections have no "try" (use an empty string).
- Keep the same section ids and do not add sections. You may return fewer items than the drafts if you combine them, never more.
- No em dashes. Write full sentences.`;

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['sections'],
  properties: {
    sections: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'items'],
        properties: {
          id: {type: 'string', enum: SECTION_IDS},
          items: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['text', 'try', 'facets', 'answers'],
              properties: {
                text: {type: 'string'},
                try: {type: 'string'},
                facets: {type: 'array', items: {type: 'string'}},
                answers: {type: 'array', items: {type: 'string'}}
              }
            }
          }
        }
      }
    }
  }
};

const str = (v, max) => typeof v === 'string' && v.length <= max;

/** Rejects anything but the expected compact shape, so no free text or identity data reaches the model. */
export function validateRequest(body) {
  if (!body || typeof body !== 'object' || JSON.stringify(body).length > 30000) return 'Invalid request.';
  if (!['en', 'no'].includes(body.language)) return 'Invalid language.';
  if (!Array.isArray(body.traits) || body.traits.length !== 5 || !body.traits.every(t => /^[NEOAC]$/.test(t?.code))) return 'Invalid traits.';
  if (!Array.isArray(body.answers) || !body.answers.every(a => QUESTION_IDS.includes(a?.q) && Array.isArray(a.values) && a.values.length <= 2 && a.values.every(v => str(v, 20)) && Array.isArray(a.labels) && a.labels.every(l => str(l, 80)) && str(a.question, 120))) return 'Invalid answers.';
  if (!Array.isArray(body.sections) || !body.sections.every(s => SECTION_IDS.includes(s?.id) && Array.isArray(s.items) && s.items.length <= 6 && s.items.every(x => str(x?.draft, 500) && str(x.try ?? '', 300) && str(x.ruleId, 80) && Array.isArray(x.facets) && x.facets.every(f => FACET.test(f?.code) && str(f.name, 40)) && Array.isArray(x.answers) && x.answers.every(q => QUESTION_IDS.includes(q))))) return 'Invalid sections.';
  return '';
}

/** Keeps only items that cite facts the browser sent for that section; falls back to the drafts. */
export function checkOutput(output, request) {
  const sections = [];
  for (const s of request.sections) {
    const allowedFacets = new Set(s.items.flatMap(x => x.facets.map(f => f.code)));
    const allowedAnswers = new Set(s.items.flatMap(x => x.answers));
    const written = (output?.sections || []).find(o => o?.id === s.id);
    const items = (written?.items || []).filter(x => str(x?.text, 700) && x.text.trim() && str(x.try ?? '', 350)
      && Array.isArray(x.facets) && Array.isArray(x.answers)
      && x.facets.every(c => allowedFacets.has(c)) && x.answers.every(q => allowedAnswers.has(q))
      && (x.facets.length + x.answers.length) > 0).slice(0, Math.min(LIMIT[s.id], s.items.length));
    const fromModel = items.length > 0 || s.items.length === 0;
    sections.push({id: s.id, source: fromModel ? 'ai' : 'rules', items: fromModel
      ? items.map(x => ({text: x.text.trim(), try: (x.try || '').trim(), facets: x.facets, answers: x.answers}))
      : s.items.map(x => ({text: x.draft, try: x.try || '', facets: x.facets.map(f => f.code), answers: x.answers}))});
  }
  return sections;
}

/** Calls Claude and returns checked sections. Throws on API errors; the caller answers 502. */
export async function writeCareer(request, apiKey) {
  const {default: Anthropic} = await import('@anthropic-ai/sdk');
  const client = new Anthropic({apiKey});
  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system: [{type: 'text', text: SYSTEM, cache_control: {type: 'ephemeral'}}],
    output_config: {effort: 'medium', format: {type: 'json_schema', schema: SCHEMA}},
    messages: [{role: 'user', content: JSON.stringify(request)}]
  });
  if (response.stop_reason === 'refusal') throw Object.assign(new Error('The model declined this request.'), {status: 502});
  if (response.stop_reason === 'max_tokens') throw Object.assign(new Error('The answer was cut off.'), {status: 502});
  const text = response.content.filter(b => b.type === 'text').map(b => b.text).join('');
  let parsed;
  try { parsed = JSON.parse(text); } catch { throw Object.assign(new Error('The answer was not valid JSON.'), {status: 502}); }
  return {model: response.model, sections: checkOutput(parsed, request), usage: {input: response.usage?.input_tokens, output: response.usage?.output_tokens}};
}

/** Shared by the Vercel function and the local server. Returns {status, body}. */
export async function handleCareerRequest(body, env = process.env) {
  const problem = validateRequest(body);
  if (problem) return {status: 400, body: {error: problem}};
  if (!env.ANTHROPIC_API_KEY) return {status: 503, body: {error: 'AI writing is not switched on: ANTHROPIC_API_KEY is missing on the server.'}};
  try {
    return {status: 200, body: await writeCareer(body, env.ANTHROPIC_API_KEY)};
  } catch (error) {
    console.error('career-report', error?.status || '', error?.message || error);
    return {status: 502, body: {error: 'AI writing failed. The pre-written text is shown instead.'}};
  }
}
