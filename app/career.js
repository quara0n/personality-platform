// «Din jobb, din profil» (prototype): eight questions about work, one at a time, then a chapter that
// links the answers with the facet scores. The pre-written rule text shows at once; «Write with AI»
// sends only the picked facts to /api/career-report (lib/career-llm.js) and shows the checked result.
// Answers and any AI text stay in this browser tab (sessionStorage).
import {questions, isComplete, optionLabel, buildCareer, careerRequest} from './career-copy.js';

export const CAREER_KEY = 'fem-career-v1';
let pending = null, message = '';

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
  const first = s.step === 0 && !Object.keys(s.answers).length;
  return `${first ? `<p class="d-career-lead">${tr('Answer eight short questions about your work. It takes two or three minutes. We link your answers with your facets and write a chapter about you and your job.', 'Svar på åtte korte spørsmål om jobben din. Det tar to–tre minutter. Vi kobler svarene med fasettene dine og skriver et kapittel om deg og jobben din.')}</p>` : ''}
    <div class="d-career-progress"><span>${tr('About your work', 'Om jobben din')}</span><span class="d-career-bar" aria-hidden="true"><i style="width:${Math.round(100 * s.step / questions.length)}%"></i></span><span>${tr(`${s.step + 1} of ${questions.length}`, `${s.step + 1} av ${questions.length}`)}</span></div>
    <fieldset class="d-career-q"><legend>${esc(q.q[language === 'no' ? 1 : 0])}</legend>${q.multi ? `<p class="d-career-hint">${tr('Choose up to two.', 'Velg opptil to.')}</p>` : ''}
    <div class="d-career-options">${q.options.map(([value, en, no]) => `<button type="button" class="d-career-opt" data-value="${value}" aria-pressed="${chosen.includes(value)}">${q.multi ? '<b aria-hidden="true"></b>' : ''}${esc(tr(en, no))}</button>`).join('')}</div></fieldset>
    <div class="d-career-nav">${s.step > 0 ? `<button type="button" class="text-button" data-career="back">${tr('Back', 'Tilbake')}</button>` : '<span></span>'}${q.multi ? `<button type="button" class="button" data-career="next" ${chosen.length ? '' : 'disabled'}>${tr('Next', 'Videre')}</button>` : ''}</div>`;
}

function itemHtml(item, ctx) {
  const {tr, esc, scoreText, bandShort} = ctx;
  const facets = item.facets.length ? `<p class="d-career-facets">${item.facets.map(f => `<span><strong>${esc(f.name)}</strong> ${esc(scoreText(f))} <span class="d-chip d-chip-${f.band}">${bandShort(f.band)}</span></span>`).join('')}</p>` : '';
  const from = item.answers.length ? `<p class="d-career-why">${tr('From your answer', 'Fra svaret ditt')}: ${esc(item.answers.map(a => a.label).join(' · '))}</p>` : '';
  return `<li>${facets}<p>${esc(item.text)}</p>${item.try ? `<p class="d-try"><span>${tr('Try', 'Prøv')}</span>${esc(item.try)}</p>` : ''}${from}</li>`;
}

function sectionsFor(s, ctx, career) {
  const {domains, language} = ctx, map = facetMap(domains);
  const labels = q => asList(s.answers[q]).map(v => ({q, label: optionLabel(q, v, language)}));
  if (s.view !== 'rules' && s.ai?.key === career.key && Array.isArray(s.ai.sections)) {
    return s.ai.sections.map(sec => ({id: sec.id, source: sec.source, items: sec.items.map(x => ({text: x.text, try: x.try, facets: x.facets.map(c => map[c]).filter(Boolean), answers: x.answers.flatMap(labels)}))}));
  }
  return career.sections.map(sec => ({...sec, source: 'rules', items: sec.items.map(x => ({...x, facets: x.facets.map(f => map[f.code] || f)}))}));
}

function resultHtml(s, ctx, career) {
  const {tr, esc, language} = ctx;
  const goal = optionLabel('goal', asList(s.answers.goal)[0], language).toLowerCase();
  const summary = questions.map(q => asList(s.answers[q.id]).map(v => optionLabel(q.id, v, language)).join(', ')).join(' · ');
  const sections = sectionsFor(s, ctx, career), by = id => sections.find(x => x.id === id);
  const usingAi = sections.some(x => x.source === 'ai');
  const list = items => items.length ? `<ul class="d-career-list">${items.map(x => itemHtml(x, ctx)).join('')}</ul>` : `<p class="d-tailor-empty">${tr('Nothing stands out clearly here for your answers.', 'Ingenting skiller seg tydelig ut her for svarene dine.')}</p>`;
  const titles = {
    drain: tr('What drains you, and why', 'Det som tapper deg, og hvorfor'),
    energy: tr('What gives you energy', 'Det som gir deg energi'),
    lead: tr('When you lead', 'Når du leder'),
    next: tr(`Your next step: ${goal}`, `Ditt neste steg: ${goal}`),
    lookfor: tr('Look for this in your next job', 'Se etter dette i neste jobb')
  };
  const block = id => {
    const sec = by(id);
    if (!sec) return '';
    if (id === 'next') return `<div class="d-career-sec"><h4>${titles.next}</h4><ol class="d-career-steps">${sec.items.map(x => `<li>${esc(x.text)}</li>`).join('')}</ol><p class="d-career-why">${tr('Three things to try in the next 30 days.', 'Tre ting å prøve de neste 30 dagene.')}</p></div>`;
    return `<div class="d-career-sec${id === 'lead' || id === 'drain' ? ' is-warm' : ''}"><h4>${titles[id]}</h4>${list(sec.items)}</div>`;
  };
  const status = pending ? `<p class="d-career-status" role="status">${tr('Writing your chapter…', 'Skriver kapittelet ditt …')}</p>` : message ? `<p class="d-career-status is-error" role="status">${esc(message)}</p>` : '';
  const aiBar = s.ai?.key === career.key
    ? `<div class="d-career-ai no-print"><p>${usingAi && s.view !== 'rules' ? tr('Written by AI from your scores and answers, within fixed rules.', 'Skrevet av AI ut fra skårene og svarene dine, innenfor faste regler.') : tr('Pre-written text from fixed rules.', 'Ferdigskrevet tekst fra faste regler.')}</p><button type="button" class="text-button" data-career="toggle">${s.view === 'rules' ? tr('Show the AI text', 'Vis AI-teksten') : tr('Show the pre-written text', 'Vis den ferdigskrevne teksten')}</button></div>`
    : `<div class="d-career-ai no-print"><p>${tr('You are seeing pre-written text from fixed rules. The AI version combines the same facts into text written for you. Only your facet scores and ticked answers are sent, no name, e-mail or free text.', 'Du ser ferdigskrevet tekst fra faste regler. AI-versjonen setter de samme fakta sammen til tekst skrevet for deg. Bare fasettskårene og avkrysningene dine sendes, ingen navn, e-post eller fritekst.')}</p><button type="button" class="button" data-career="ai" ${pending ? 'disabled' : ''}>${tr('Write with AI (test)', 'Skriv med AI (test)')}</button></div>`;
  return `<div class="d-career-answers no-print"><span>${tr('Your answers', 'Svarene dine')}: ${esc(summary)}</span><button type="button" class="text-button" data-career="edit">${tr('Change', 'Endre')}</button></div>
    ${aiBar}${status}
    <div class="d-career-sec"><h4>${tr('How you and the job fit right now', 'Slik passer du og jobben sammen nå')}</h4><div class="d-tailor-cols"><div class="d-tailor-col is-help"><h4>${tr('What fits', 'Det passer')}</h4>${list(by('good').items)}</div><div class="d-tailor-col is-hard"><h4>${tr('What clashes', 'Det skurrer')}</h4>${list(by('hard').items)}</div></div></div>
    ${block('drain')}${block('energy')}${block('lead')}${block('next')}${block('lookfor')}`;
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
  return `<section class="d-tailor d-career" data-career-root aria-labelledby="career-title"><div class="d-tailor-head"><p class="d-tailor-badge">${tr('Tailored · prototype', 'Tilpasset deg · prototype')}</p><h3 id="career-title">${tr('Your work, your profile', 'Din jobb, din profil')}</h3></div>
    ${done ? resultHtml(s, ctx, career) : stepHtml(s, ctx)}
    <p class="d-tailor-note">${tr('Each point links your answers with facets that sit clearly high or low. They are ideas to test, not established facts about you. Your answers stay in this browser tab.', 'Hvert punkt kobler svarene dine med fasetter som ligger tydelig høyt eller lavt. Det er ideer å teste, ikke fastslåtte sannheter om deg. Svarene blir bare lagret i denne nettleserfanen.')}</p></section>`;
}

function rerender(section, ctx, focusSelector) {
  const tmp = document.createElement('div');
  tmp.innerHTML = careerHtml(ctx);
  const next = tmp.firstElementChild;
  section.replaceWith(next);
  initCareer({querySelectorAll: () => [next]}, ctx);
  const target = focusSelector && next.querySelector(focusSelector);
  if (target) target.focus({preventScroll: false});
  return next;
}

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
  root.querySelectorAll('[data-career-root]').forEach(section => section.addEventListener('click', e => {
    const opt = e.target.closest('.d-career-opt'), act = e.target.closest('[data-career]')?.dataset.career;
    const s = state();
    if (opt) {
      const q = questions[s.step];
      if (q.multi) {
        const now = asList(s.answers[q.id]), v = opt.dataset.value;
        s.answers[q.id] = now.includes(v) ? now.filter(x => x !== v) : now.length < q.multi ? [...now, v] : [...now.slice(1), v];
        store(s);
        rerender(section, ctx, `.d-career-opt[data-value="${v}"]`);
        return;
      }
      s.answers[q.id] = opt.dataset.value;
      if (s.step < questions.length - 1) s.step++; else { s.step = 0; s.editing = false; }
      message = '';
      store(s);
      const next = rerender(section, ctx, '.d-career-opt');
      if (!s.step && !s.editing) next.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
      return;
    }
    if (act === 'next') { if (s.step < questions.length - 1) s.step++; else { s.step = 0; s.editing = false; } store(s); rerender(section, ctx, '.d-career-opt'); }
    else if (act === 'back') { s.step = Math.max(0, s.step - 1); store(s); rerender(section, ctx, '.d-career-opt'); }
    else if (act === 'edit') { s.step = 0; s.editing = true; message = ''; store(s); rerender(section, ctx, '.d-career-opt'); }
    else if (act === 'toggle') { s.view = s.view === 'rules' ? 'ai' : 'rules'; store(s); rerender(section, ctx); }
    else if (act === 'ai' && !pending) writeWithAi(section, ctx);
  }));
}
