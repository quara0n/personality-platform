// «Din jobb, din profil» (prototype): eight questions about work, one at a time, then a chapter that
// links the answers with the facet scores. The pre-written rule text shows at once; «Write with AI»
// sends only the picked facts to /api/career-report (lib/career-llm.js) and shows the checked result.
// Answers and any AI text stay in this browser tab (sessionStorage).
import {questions, isComplete, optionLabel, answerTopic, buildCareer, careerRequest, OTHER_MAX} from './career-copy.js';

export const CAREER_KEY = 'fem-career-v1';
let pending = null, message = '', printHook = false;

function state() {
  try { const s = JSON.parse(sessionStorage.getItem(CAREER_KEY) || 'null'); return s && typeof s === 'object' ? {answers: {}, step: 0, ...s} : {answers: {}, step: 0}; } catch { return {answers: {}, step: 0}; }
}
function store(s) { try { sessionStorage.setItem(CAREER_KEY, JSON.stringify(s)); } catch {} }
export function clearCareer() { try { sessionStorage.removeItem(CAREER_KEY); } catch {} }

const asList = v => Array.isArray(v) ? v : v ? [v] : [];
const hash = text => { let h = 5381; for (let i = 0; i < text.length; i++) h = (h * 33 + text.charCodeAt(i)) >>> 0; return h.toString(36); };

function facetMap(domains) { const m = {}; for (const d of domains) for (const f of d.facets) m[f.code] = f; return m; }

function stepHtml(s, ctx) {
  const {tr, esc, language} = ctx, q = questions[s.step], chosen = asList(s.answers[q.id]);
  const first = s.step === 0 && !Object.keys(s.answers).length, other = chosen.includes('other');
  return `${first ? `<p class="d-career-lead">${tr('Answer eight short questions about your work. It takes two or three minutes. We link your answers with your facets and write a chapter about you and your job.', 'Svar på åtte korte spørsmål om jobben din. Det tar to–tre minutter. Vi kobler svarene med fasettene dine og skriver et kapittel om deg og jobben din.')}</p>` : ''}
    <div class="d-career-progress"><span>${tr('About your work', 'Om jobben din')}</span><span class="d-career-bar" aria-hidden="true"><i style="width:${Math.round(100 * s.step / questions.length)}%"></i></span><span>${tr(`${s.step + 1} of ${questions.length}`, `${s.step + 1} av ${questions.length}`)}</span></div>
    <fieldset class="d-career-q"><legend>${esc(q.q[language === 'no' ? 1 : 0])}</legend>${q.multi ? `<p class="d-career-hint">${tr('Choose up to two.', 'Velg opptil to.')}</p>` : ''}
    <div class="d-career-options">${q.options.map(([value, en, no]) => `<button type="button" class="d-career-opt" data-value="${value}" aria-pressed="${chosen.includes(value)}">${q.multi ? '<b aria-hidden="true"></b>' : ''}${esc(tr(en, no))}</button>`).join('')}</div>
    ${other ? `<label class="d-career-other"><span>${q.id === 'role' ? tr('Your job (optional)', 'Yrket ditt (valgfritt)') : tr('Specify (optional)', 'Utdyp (valgfritt)')}</span><input type="text" maxlength="${OTHER_MAX}" autocomplete="off" data-career-other value="${esc(s.answers.other?.[q.id] || '')}" placeholder="${q.id === 'role' ? tr('For example chiropractor', 'For eksempel kiropraktor') : tr('A few words, no names', 'Noen få ord, ingen navn')}"></label>` : ''}</fieldset>
    <div class="d-career-nav">${s.step > 0 ? `<button type="button" class="text-button" data-career="back">${tr('Back', 'Tilbake')}</button>` : '<span></span>'}${q.multi || other ? `<button type="button" class="button" data-career="next" ${chosen.length ? '' : 'disabled'}>${tr('Next', 'Videre')}</button>` : ''}</div>`;
}

function sectionsFor(s, ctx, career) {
  const {domains, language} = ctx, map = facetMap(domains);
  const labels = q => asList(s.answers[q]).map(v => ({q, value: v, label: optionLabel(q, v, language, s.answers)}));
  if (s.view !== 'rules' && s.ai?.key === career.key && Array.isArray(s.ai.sections)) {
    return s.ai.sections.map(sec => ({id: sec.id, source: sec.source, items: sec.items.map(x => ({text: x.text, try: x.try, facets: x.facets.map(c => map[c]).filter(Boolean), answers: x.answers.flatMap(labels)}))}));
  }
  return career.sections.map(sec => ({...sec, source: 'rules', items: sec.items.map(x => ({...x, facets: x.facets.map(f => map[f.code] || f)}))}));
}

// Headline for an item: the topic of the answer it builds on, else the facet name.
function headline(item, s, ctx) {
  const a = item.answers[0];
  return a ? answerTopic(a.q, a.value, ctx.language, s.answers) : item.facets[0]?.name || '';
}

const chips = (item, ctx) => item.facets.length ? `<p class="d-career-chips">${item.facets.map(f => `<span title="${ctx.esc(ctx.scoreText(f))}">${ctx.esc(f.name)}</span>`).join('')}</p>` : '';

// One overview block: eyebrow, headline, one line, facet chips and «Read more» with the rest.
function featureHtml(kind, eyebrow, sec, s, ctx) {
  const {tr, esc} = ctx, [top, ...rest] = sec?.items || [];
  if (!top) return `<div class="d-career-feature is-${kind}"><p class="d-career-eyebrow">${eyebrow}</p><p class="d-tailor-empty">${tr('Nothing stands out clearly here for your answers.', 'Ingenting skiller seg tydelig ut her for svarene dine.')}</p></div>`;
  const more = `${top.try ? `<p class="d-try"><span>${tr('Try', 'Prøv')}</span>${esc(top.try)}</p>` : ''}${top.answers.length ? `<p class="d-career-why">${tr('From your answer', 'Fra svaret ditt')}: ${esc(top.answers.map(a => a.label).join(' · '))}</p>` : ''}${rest.length ? `<ul class="d-career-list">${rest.map(x => itemHtml(x, ctx, s, headline(top, s, ctx))).join('')}</ul>` : ''}`;
  return `<div class="d-career-feature is-${kind}"><span class="d-career-mark" aria-hidden="true"></span><div><p class="d-career-eyebrow">${eyebrow}</p><h4>${esc(headline(top, s, ctx))}</h4><p class="d-career-line">${esc(top.text)}</p>${chips(top, ctx)}${more.trim() ? `<details class="d-career-more"><summary>${tr('Read more', 'Les mer')} <span aria-hidden="true">+</span></summary>${more}</details>` : ''}</div></div>`;
}

function itemHtml(item, ctx, s, skipHead = '') {
  const {tr, esc} = ctx, head = headline(item, s, ctx);
  const from = item.answers.length ? `<p class="d-career-why">${tr('From your answer', 'Fra svaret ditt')}: ${esc(item.answers.map(a => a.label).join(' · '))}</p>` : '';
  return `<li>${head && head !== skipHead ? `<h5>${esc(head)}</h5>` : ''}<p>${esc(item.text)}</p>${chips(item, ctx)}${item.try ? `<p class="d-try"><span>${tr('Try', 'Prøv')}</span>${esc(item.try)}</p>` : ''}${from}</li>`;
}

// The one thing to try this week: from what clashes first, then what drains, then what fits.
function weekTry(by) {
  for (const id of ['hard', 'drain', 'good', 'energy']) { const x = by(id)?.items.find(i => i.try); if (x) return x.try; }
  return by('next')?.items[0]?.text || '';
}

function resultHtml(s, ctx, career) {
  const {tr, esc, language} = ctx;
  const goalValue = asList(s.answers.goal)[0], goalText = goalValue === 'other' ? (s.answers.other?.goal || '').trim() : optionLabel('goal', goalValue, language).toLowerCase();
  const sections = sectionsFor(s, ctx, career), by = id => sections.find(x => x.id === id);
  const usingAi = sections.some(x => x.source === 'ai');
  const list = items => items.length ? `<ul class="d-career-list">${items.map(x => itemHtml(x, ctx, s)).join('')}</ul>` : `<p class="d-tailor-empty">${tr('Nothing stands out clearly here for your answers.', 'Ingenting skiller seg tydelig ut her for svarene dine.')}</p>`;
  const titles = {
    drain: tr('What drains you, and why', 'Det som tapper deg, og hvorfor'),
    lead: tr('When you lead', 'Når du leder'),
    next: goalText ? tr(`Your next step: ${esc(goalText)}`, `Ditt neste steg: ${esc(goalText)}`) : tr('Your next step', 'Ditt neste steg'),
    lookfor: tr('Look for this in your next job', 'Se etter dette i neste jobb')
  };
  const block = id => {
    const sec = by(id);
    if (!sec) return '';
    if (id === 'next') return `<div class="d-career-sec"><h4>${titles.next}</h4><ol class="d-career-steps">${sec.items.map(x => `<li>${esc(x.text)}</li>`).join('')}</ol><p class="d-career-why">${tr('Three things to try in the next 30 days.', 'Tre ting å prøve de neste 30 dagene.')}</p></div>`;
    return `<div class="d-career-sec"><h4>${titles[id]}</h4>${list(sec.items)}</div>`;
  };
  const status = pending ? `<p class="d-career-status" role="status">${tr('Writing your chapter…', 'Skriver kapittelet ditt …')}</p>` : message ? `<p class="d-career-status is-error" role="status">${esc(message)}</p>` : '';
  const aiBar = !ctx.showDev ? '' : s.ai?.key === career.key
    ? `<div class="d-career-ai no-print"><p>${usingAi && s.view !== 'rules' ? tr('Written by AI from your scores and answers, within fixed rules.', 'Skrevet av AI ut fra skårene og svarene dine, innenfor faste regler.') : tr('Pre-written text from fixed rules.', 'Ferdigskrevet tekst fra faste regler.')}</p><button type="button" class="text-button" data-career="toggle">${s.view === 'rules' ? tr('Show the AI text', 'Vis AI-teksten') : tr('Show the pre-written text', 'Vis den ferdigskrevne teksten')}</button></div>`
    : `<div class="d-career-ai no-print"><p>${tr('You are seeing pre-written text from fixed rules. The AI version combines the same facts into text written for you. Only your facet scores, your ticked answers and anything you wrote under «Other» are sent, no name or e-mail. So do not write names or health details there.', 'Du ser ferdigskrevet tekst fra faste regler. AI-versjonen setter de samme fakta sammen til tekst skrevet for deg. Bare fasettskårene, avkrysningene og det du skrev under «Annet» sendes, ingen navn eller e-post. Ikke skriv navn eller helseopplysninger der.')}</p><button type="button" class="button" data-career="ai" ${pending ? 'disabled' : ''}>${tr('Write with AI (test)', 'Skriv med AI (test)')}</button></div>`;
  const tryText = weekTry(by), tried = !!tryText && s.tried === hash(tryText);
  const tryBox = tryText ? `<div class="d-career-week"><p class="d-career-eyebrow">${tr('Try one thing this week', 'Prøv én ting denne uken')}</p><p class="d-career-week-text">${esc(tryText)}</p><label class="d-career-check"><input type="checkbox" data-career-try ${tried ? 'checked' : ''}><span>${tr('I will try this', 'Jeg skal prøve dette')}</span></label></div>` : '';
  const deep = `${block('drain')}${block('lead')}${block('next')}${block('lookfor')}`;
  return `${aiBar}${status}
    <div class="d-career-grid">
      <div class="d-career-main">${featureHtml('good', tr('This can work well', 'Dette kan fungere godt'), by('good'), s, ctx)}${featureHtml('hard', tr('This can be demanding', 'Dette kan bli krevende'), by('hard'), s, ctx)}</div>
      <div class="d-career-side">${featureHtml('energy', tr('Your energy', 'Din energi'), by('energy'), s, ctx)}${tryBox}</div>
    </div>
    <details class="d-career-deep"><summary><span class="d-career-deep-icon" aria-hidden="true"><i></i><i></i><i></i></span>${tr('How does this connect with your traits?', 'Hvordan henger dette sammen med trekkene dine?')}<span class="d-career-plus" aria-hidden="true">+</span></summary>
      <div class="d-career-deep-body">${deep}<p class="d-tailor-note">${tr('Each point links your answers with facets that sit clearly high or low. They are ideas to test, not established facts about you. Your answers stay in this browser tab.', 'Hvert punkt kobler svarene dine med fasetter som ligger tydelig høyt eller lavt. Det er ideer å teste, ikke fastslåtte sannheter om deg. Svarene blir bare lagret i denne nettleserfanen.')}</p></div></details>`;
}

const briefcase = '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 12h18M10.5 12v2h3v-2"/></svg>';

/** «Your job context» bar for the chapter header: the job, how you work with others and any lead role. */
export function careerContextHtml(ctx) {
  const {tr, esc, language} = ctx, s = state();
  if (!isComplete(s.answers) || s.editing) return '<div data-career-bar hidden></div>';
  const a = s.answers, lead = asList(a.lead)[0];
  const parts = [optionLabel('role', asList(a.role)[0], language, a), answerTopic('with', asList(a.with)[0], language, a), ...(lead && lead !== 'no' ? [answerTopic('lead', lead, language, a)] : [])];
  return `<div class="d-career-context" data-career-bar><span class="d-career-context-icon">${briefcase}</span><div><p class="d-career-eyebrow">${tr('Your job context', 'Din jobbkontekst')}</p><p class="d-career-context-text">${parts.map(esc).join('<span aria-hidden="true"> · </span>')}</p></div><button type="button" class="text-button no-print" data-career="edit">${tr('Change', 'Endre')}</button></div>`;
}

export function careerHtml(ctx) {
  const {tr, domains, language} = ctx, s = state();
  const done = isComplete(s.answers) && !s.editing;
  let career = null;
  if (done) {
    career = buildCareer(domains, s.answers, language);
    career.request = careerRequest(career, domains, s.answers, language);
    career.key = hash(JSON.stringify(career.request));
  }
  if (done) return `<section class="d-career is-result" data-career-root aria-label="${tr('Your work, your profile', 'Din jobb, din profil')}"><p class="d-tailor-badge">${tr('Tailored · prototype', 'Tilpasset deg · prototype')}</p>${resultHtml(s, ctx, career)}</section>`;
  return `<section class="d-tailor d-career" data-career-root aria-labelledby="career-title"><div class="d-tailor-head"><p class="d-tailor-badge">${tr('Tailored · prototype', 'Tilpasset deg · prototype')}</p><h3 id="career-title">${tr('Your work, your profile', 'Din jobb, din profil')}</h3></div>
    ${stepHtml(s, ctx)}
    <p class="d-tailor-note">${tr('Each point links your answers with facets that sit clearly high or low. They are ideas to test, not established facts about you. Your answers stay in this browser tab.', 'Hvert punkt kobler svarene dine med fasetter som ligger tydelig høyt eller lavt. Det er ideer å teste, ikke fastslåtte sannheter om deg. Svarene blir bare lagret i denne nettleserfanen.')}</p></section>`;
}

function rerender(section, ctx, focusSelector) {
  const tmp = document.createElement('div');
  tmp.innerHTML = careerHtml(ctx);
  const next = tmp.firstElementChild;
  section.replaceWith(next);
  initCareer({querySelectorAll: () => [next]}, ctx);
  // The job context bar sits in the chapter header and follows the same answers.
  const bar = document.querySelector('[data-career-bar]');
  if (bar) { tmp.innerHTML = careerContextHtml(ctx); const nb = tmp.firstElementChild; bar.replaceWith(nb); bindBar(nb, ctx); }
  const target = focusSelector && next.querySelector(focusSelector);
  if (target) target.focus({preventScroll: false});
  return next;
}

function startEditing(ctx) {
  const s = state(), section = document.querySelector('[data-career-root]');
  s.step = 0; s.editing = true; message = ''; store(s);
  if (section) rerender(section, ctx, '.d-career-opt')?.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
}
function bindBar(bar, ctx) { bar.querySelector('[data-career="edit"]')?.addEventListener('click', () => startEditing(ctx)); }

async function writeWithAi(section, ctx) {
  const s = state(), {tr, domains, language} = ctx;
  const career = buildCareer(domains, s.answers, language), request = careerRequest(career, domains, s.answers, language);
  const key = hash(JSON.stringify(request));
  pending = key; message = '';
  section = rerender(section, ctx);
  try {
    const r = await fetch('api/career-report', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(request)});
    const data = await r.json().catch(() => ({}));
    if (r.status === 503 || r.status === 404 || r.status === 405) message = tr('AI writing is not switched on here yet (the server needs an API key). You are seeing the pre-written text.', 'AI-skriving er ikke slått på her ennå (serveren mangler API-nøkkel). Du ser den ferdigskrevne teksten.');
    else if (!r.ok || !Array.isArray(data.sections)) message = tr('AI writing failed. You are seeing the pre-written text.', 'AI-skrivingen feilet. Du ser den ferdigskrevne teksten.');
    else store({...state(), ai: {key, sections: data.sections, model: data.model}, view: 'ai'});
  } catch {
    message = tr('Could not reach the server. You are seeing the pre-written text.', 'Fikk ikke kontakt med serveren. Du ser den ferdigskrevne teksten.');
  }
  pending = null;
  const live = document.querySelector('[data-career-root]');
  if (live) rerender(live, ctx);
}

export function initCareer(root, ctx) {
  if (root.nodeType === 1) root.querySelectorAll('[data-career-bar]').forEach(bar => bindBar(bar, ctx));
  if (!printHook) { printHook = true; addEventListener('beforeprint', () => document.querySelectorAll('.d-career details').forEach(d => { d.open = true; })); }
  root.querySelectorAll('[data-career-root]').forEach(section => section.addEventListener('change', e => {
    if (!e.target.matches('[data-career-try]')) return;
    const s = state(), text = e.target.closest('.d-career-week')?.querySelector('.d-career-week-text')?.textContent || '';
    s.tried = e.target.checked ? hash(text) : null;
    store(s);
  }));
  root.querySelectorAll('[data-career-root]').forEach(section => section.addEventListener('input', e => {
    if (!e.target.matches('[data-career-other]')) return;
    const s = state(), q = questions[s.step];
    s.answers.other = {...(s.answers.other || {}), [q.id]: e.target.value.slice(0, OTHER_MAX)};
    store(s);
  }));
  root.querySelectorAll('[data-career-root]').forEach(section => section.addEventListener('click', e => {
    const opt = e.target.closest('.d-career-opt'), act = e.target.closest('[data-career]')?.dataset.career;
    const s = state();
    if (opt) {
      const q = questions[s.step];
      if (q.multi) {
        const now = asList(s.answers[q.id]), v = opt.dataset.value;
        s.answers[q.id] = now.includes(v) ? now.filter(x => x !== v) : now.length < q.multi ? [...now, v] : [...now.slice(1), v];
        store(s);
        rerender(section, ctx, v === 'other' && s.answers[q.id].includes('other') ? '[data-career-other]' : `.d-career-opt[data-value="${v}"]`);
        return;
      }
      s.answers[q.id] = opt.dataset.value;
      // Stay on the question (in the stepper, even when every answer is now filled in) so the text field can be used.
      if (opt.dataset.value === 'other') { s.editing = true; store(s); rerender(section, ctx, '[data-career-other]'); return; }
      if (s.step < questions.length - 1) s.step++; else { s.step = 0; s.editing = false; }
      message = '';
      store(s);
      const next = rerender(section, ctx, '.d-career-opt');
      if (!s.step && !s.editing) next.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
      return;
    }
    if (act === 'next') { if (s.step < questions.length - 1) s.step++; else { s.step = 0; s.editing = false; } store(s); rerender(section, ctx, '.d-career-opt'); }
    else if (act === 'back') { s.step = Math.max(0, s.step - 1); store(s); rerender(section, ctx, '.d-career-opt'); }
    else if (act === 'edit') startEditing(ctx);
    else if (act === 'toggle') { s.view = s.view === 'rules' ? 'ai' : 'rules'; store(s); rerender(section, ctx); }
    else if (act === 'ai' && !pending) writeWithAi(section, ctx);
  }));
}
