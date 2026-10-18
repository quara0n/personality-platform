// The tailored chapter in the 149 kr tier, shared by «Din jobb, din profil» (career.js) and
// «Hverdagsliv og relasjoner» (life.js): questions one at a time, then a chapter that links the answers
// with the facet scores, in the same layout (context bar in the chapter header, two columns, the rest
// folded). The pre-written rule text shows at once; «Write with AI» (test flag only) sends only the
// picked facts to /api/career-report and shows the checked result. Answers and any AI text stay in this
// browser tab (sessionStorage). Each chapter passes its copy module, texts and layout in `cfg`.

import {initFacetCarousels} from './carousel.js';

const asList = v => Array.isArray(v) ? v : v ? [v] : [];
const hash = text => { let h = 5381; for (let i = 0; i < text.length; i++) h = (h * 33 + text.charCodeAt(i)) >>> 0; return h.toString(36); };
const smooth = () => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
function facetMap(domains) { const m = {}; for (const d of domains) for (const f of d.facets) m[f.code] = f; return m; }

// Facet chips say the direction in words («Orden: lav»), so no badge is needed to read them.
const level = (f, tr) => f.band === 'high' ? tr('high', 'høy') : f.band === 'low' ? tr('low', 'lav') : tr('middle', 'middels');
const chips = (item, ctx) => item.facets.length ? `<p class="d-career-chips">${item.facets.map(f => `<span title="${ctx.esc(ctx.scoreText(f))}">${ctx.esc(f.name)}: ${level(f, ctx.tr)}</span>`).join('')}</p>` : '';

/**
 * cfg: {name, key, copy: {questions, visibleQuestions?, isComplete, optionLabel, answerTopic, build, request, OTHER_MAX},
 * text(ctx) → {title, progress, otherLabel(qid), otherPlaceholder(qid), contextEyebrow, aria},
 * contextParts(answers, language) → [labels], icon, jumpIn?, questionArt(qid)?, optionArt(qid, value)?, main: [[id, eyebrow(ctx), fallbackId?]], side: [[id, eyebrow(ctx)]],
 * deep: [ids], hideEmpty: [ids], titles(ctx, answers) → {id: title}, weekOrder: [ids]}
 */
export function createTailoredChapter(cfg) {
  const {name, key, copy} = cfg, A = `data-${name}`;
  const visible = answers => copy.visibleQuestions ? copy.visibleQuestions(answers) : copy.questions;
  let pending = null, message = '', printHook = false;

  function state() {
    try { const s = JSON.parse(sessionStorage.getItem(key) || 'null'); return s && typeof s === 'object' ? {answers: {}, step: 0, ...s} : {answers: {}, step: 0}; } catch { return {answers: {}, step: 0}; }
  }
  const store = s => { try { sessionStorage.setItem(key, JSON.stringify(s)); } catch {} };
  const clear = () => { try { sessionStorage.removeItem(key); } catch {} };
  const current = s => { const qs = visible(s.answers); return {qs, q: qs[Math.min(s.step, qs.length - 1)]}; };

  // One question as Rune's card layout (mockup 2026-10-17): progress on top, a large question with the
  // chapter picture beside it, then one card per answer with its picture and an arrow (a tick box when
  // several may be chosen). Answers without their own picture show a logo piece.
  const PIECES = ['sky', 'apricot', 'steel', 'ivory', 'navy'];
  function stepHtml(s, ctx) {
    const {tr, esc, language} = ctx, t = cfg.text(ctx), {qs, q} = current(s), step = qs.indexOf(q), chosen = asList(s.answers[q.id]);
    const other = chosen.includes('other'), hero = cfg.questionArt?.(q.id);
    const art = (value, i) => cfg.optionArt?.(q.id, value) || `assets/design/logo-piece-${PIECES[i % PIECES.length]}.webp`;
    return `<div class="d-q2-progress"><span class="d-q2-label">${t.progress}</span><span class="d-q2-row"><span class="d-career-bar" aria-hidden="true"><i style="width:${Math.round(100 * (step + 1) / qs.length)}%"></i></span><span>${tr(`${step + 1} of ${qs.length}`, `${step + 1} av ${qs.length}`)}</span></span></div>
    <div class="d-q2-head${hero ? ' has-art' : ''}"><h3 class="d-q2-title" id="${name}-q">${esc(q.q[language === 'no' ? 1 : 0])}</h3>${hero ? `<img class="d-q2-hero" src="${hero}" alt="" aria-hidden="true">` : ''}</div>
    ${q.multi ? `<p class="d-career-hint">${tr('Choose up to two.', 'Velg opptil to.')}</p>` : ''}
    <div class="d-q2-options" role="group" aria-labelledby="${name}-q">${q.options.map(([value, en, no], i) => {
      const own = !!cfg.optionArt?.(q.id, value);
      return `<button type="button" class="d-career-opt d-q2-opt" data-value="${value}" aria-pressed="${chosen.includes(value)}"><span class="d-q2-icon${own ? '' : ' is-piece'}"><img src="${art(value, i)}" alt="" aria-hidden="true"></span><span class="d-q2-text">${esc(tr(en, no))}</span><span class="d-q2-go${q.multi ? ' is-check' : ''}" aria-hidden="true">${q.multi ? '' : '<svg viewBox="0 0 24 24"><path d="M9.5 6l6 6-6 6"/></svg>'}</span></button>`;
    }).join('')}</div>
    ${other ? `<label class="d-career-other"><span>${t.otherLabel(q.id)}</span><input type="text" maxlength="${copy.OTHER_MAX}" autocomplete="off" ${A}-other value="${esc(s.answers.other?.[q.id] || '')}" placeholder="${t.otherPlaceholder(q.id)}"></label>` : ''}
    <div class="d-career-nav">${step > 0 ? `<button type="button" class="text-button" ${A}="back">${tr('Back', 'Tilbake')}</button>` : '<span></span>'}${q.multi || other ? `<button type="button" class="button" ${A}="next" ${chosen.length ? '' : 'disabled'}>${tr('Next', 'Videre')}</button>` : ''}</div>`;
  }

  function sectionsFor(s, ctx, built) {
    const {domains, language} = ctx, map = facetMap(domains);
    const labels = q => asList(s.answers[q]).map(v => ({q, value: v, label: copy.optionLabel(q, v, language, s.answers)}));
    if (s.view !== 'rules' && s.ai?.key === built.key && Array.isArray(s.ai.sections)) {
      return s.ai.sections.map(sec => ({id: sec.id, source: sec.source, items: sec.items.map(x => ({text: x.text, try: x.try, facets: x.facets.map(c => map[c]).filter(Boolean), answers: x.answers.flatMap(labels)}))}));
    }
    return built.sections.map(sec => ({...sec, source: 'rules', items: sec.items.map(x => ({...x, facets: x.facets.map(f => map[f.code] || f)}))}));
  }

  // Headline for an item: the topic of the answer it builds on, else the facet name.
  function headline(item, s, ctx) {
    const a = item.answers[0];
    return a ? copy.answerTopic(a.q, a.value, ctx.language, s.answers) : item.facets[0]?.name || '';
  }

  const emptyLine = tr => `<p class="d-tailor-empty">${tr('Nothing stands out clearly here for your answers.', 'Ingenting skiller seg tydelig ut her for svarene dine.')}</p>`;

  // One overview card in the swipeable row: a logo piece, eyebrow, headline, one line, facet chips and
  // «Read more» behind the facets' gem «+» with the rest.
  const KIND_PIECE = {good: 'sky', hard: 'apricot', energy: 'navy', close: 'steel'};
  function featureHtml(kind, eyebrow, sec, s, ctx) {
    const {tr, esc} = ctx, [top, ...rest] = sec?.items || [];
    const piece = `<img class="d-jcard-piece" src="assets/design/logo-piece-${KIND_PIECE[kind] || 'sky'}.webp" alt="" aria-hidden="true">`;
    if (!top) return `<article class="d-jcard is-${kind}">${piece}<p class="d-career-eyebrow">${eyebrow}</p>${emptyLine(tr)}</article>`;
    const more = `${top.try ? `<p class="d-try"><span>${tr('Try', 'Prøv')}</span>${esc(top.try)}</p>` : ''}${top.answers.length ? `<p class="d-career-why">${tr('From your answer', 'Fra svaret ditt')}: ${esc(top.answers.map(a => a.label).join(' · '))}</p>` : ''}${rest.length ? `<ul class="d-career-list">${rest.map(x => itemHtml(x, ctx, s, headline(top, s, ctx))).join('')}</ul>` : ''}`;
    return `<article class="d-jcard is-${kind}">${piece}<p class="d-career-eyebrow">${eyebrow}</p><h4>${esc(headline(top, s, ctx))}</h4><p class="d-career-line">${esc(top.text)}</p>${chips(top, ctx)}${more.trim() ? `<details class="d-jcard-more"><summary>${tr('Read more', 'Les mer')}<span class="d-gem-plus" aria-hidden="true"></span></summary><div class="d-jcard-body">${more}</div></details>` : ''}</article>`;
  }

  function itemHtml(item, ctx, s, skipHead = '') {
    const {tr, esc} = ctx, head = headline(item, s, ctx);
    const from = item.answers.length ? `<p class="d-career-why">${tr('From your answer', 'Fra svaret ditt')}: ${esc(item.answers.map(a => a.label).join(' · '))}</p>` : '';
    return `<li>${head && head !== skipHead ? `<h5>${esc(head)}</h5>` : ''}<p>${esc(item.text)}</p>${chips(item, ctx)}${item.try ? `<p class="d-try"><span>${tr('Try', 'Prøv')}</span>${esc(item.try)}</p>` : ''}${from}</li>`;
  }

  // The one thing to try this week: the first section in cfg.weekOrder with something to try.
  function weekTry(by) {
    for (const id of cfg.weekOrder) { const x = by(id)?.items.find(i => i.try); if (x) return x.try; }
    return by('next')?.items[0]?.text || '';
  }

  function resultHtml(s, ctx, built) {
    const {tr, esc} = ctx;
    const sections = sectionsFor(s, ctx, built), by = id => sections.find(x => x.id === id);
    const usingAi = sections.some(x => x.source === 'ai'), titles = cfg.titles(ctx, s.answers);
    const list = items => items.length ? `<ul class="d-career-list">${items.map(x => itemHtml(x, ctx, s)).join('')}</ul>` : emptyLine(tr);
    // When a main block has nothing, it may show the strongest item of a fallback section instead,
    // and the folded list of that section then skips it.
    const shown = {}, skip = {};
    for (const [id, , fallback] of cfg.main) {
      if (by(id)?.items.length || !fallback) shown[id] = by(id);
      else { shown[id] = by(fallback); skip[fallback] = true; }
    }
    const block = id => {
      let sec = by(id);
      if (!sec) return '';
      if (skip[id]) { sec = {...sec, items: sec.items.slice(1)}; if (!sec.items.length) return ''; }
      if (!sec.items.length && cfg.hideEmpty?.includes(id)) return '';
      if (id === 'next') return `<div class="d-career-sec"><h4>${titles.next}</h4><ol class="d-career-steps">${sec.items.map(x => `<li>${esc(x.text)}</li>`).join('')}</ol><p class="d-career-why">${tr('Three things to try in the next 30 days.', 'Tre ting å prøve de neste 30 dagene.')}</p></div>`;
      return `<div class="d-career-sec"><h4>${titles[id]}</h4>${list(sec.items)}</div>`;
    };
    const status = pending ? `<p class="d-career-status" role="status">${tr('Writing your chapter…', 'Skriver kapittelet ditt …')}</p>` : message ? `<p class="d-career-status is-error" role="status">${esc(message)}</p>` : '';
    const aiBar = !ctx.showDev ? '' : s.ai?.key === built.key
      ? `<div class="d-career-ai no-print"><p>${usingAi && s.view !== 'rules' ? tr('Written by AI from your scores and answers, within fixed rules.', 'Skrevet av AI ut fra skårene og svarene dine, innenfor faste regler.') : tr('Pre-written text from fixed rules.', 'Ferdigskrevet tekst fra faste regler.')}</p><button type="button" class="text-button" ${A}="toggle">${s.view === 'rules' ? tr('Show the AI text', 'Vis AI-teksten') : tr('Show the pre-written text', 'Vis den ferdigskrevne teksten')}</button></div>`
      : cfg.aiCard ? `<div class="d-ai-partner no-print"><div class="d-ai-partner-text"><h3>${tr('Your personal AI partner', 'Din personlige AI&#8209;partner')}</h3><p>${tr('Get insight, suggestions and guidance based on your strengths.', 'Få innsikt, forslag og veiledning basert på dine styrker.')}</p></div><img class="d-ai-partner-art" src="assets/design/ai-partner.webp" alt="" aria-hidden="true"><button type="button" class="button d-ai-partner-button" ${A}="ai" ${pending ? 'disabled' : ''}>${tr('AI help', 'AI-hjelp')}<span aria-hidden="true">→</span></button><p class="d-ai-partner-note">${tr('Only your facet scores, your ticked answers and anything you wrote under «Other» are sent, no name or e-mail.', 'Bare fasettskårene, avkrysningene og det du skrev under «Annet» sendes, ingen navn eller e-post.')}</p></div>`
      : `<div class="d-career-ai no-print"><p>${tr('You are seeing pre-written text from fixed rules. The AI version combines the same facts into text written for you. Only your facet scores, your ticked answers and anything you wrote under «Other» are sent, no name or e-mail. So do not write names or health details there.', 'Du ser ferdigskrevet tekst fra faste regler. AI-versjonen setter de samme fakta sammen til tekst skrevet for deg. Bare fasettskårene, avkrysningene og det du skrev under «Annet» sendes, ingen navn eller e-post. Ikke skriv navn eller helseopplysninger der.')}</p><button type="button" class="button" ${A}="ai" ${pending ? 'disabled' : ''}>${tr('Write with AI (test)', 'Skriv med AI (test)')}</button></div>`;
    const tryText = weekTry(by), tried = !!tryText && s.tried === hash(tryText);
    const tryBox = tryText ? `<div class="d-career-week"><img class="d-career-week-piece" src="assets/design/logo-piece-apricot.webp" alt="" aria-hidden="true"><p class="d-career-eyebrow">${tr('Try one thing this week', 'Prøv én ting denne uken')}</p><p class="d-career-week-text">${esc(tryText)}</p><label class="d-career-check"><input type="checkbox" ${A}-try ${tried ? 'checked' : ''}><span>${tr('I will try this', 'Jeg skal prøve dette')}</span></label></div>` : '';
    // The overview cards swipe sideways on phones and portrait tablets like the facet cards, with the same
    // dot toggle; wider screens show them side by side (Rune, 2026-10-17).
    const cards = [...cfg.main, ...cfg.side];
    const feature = ([id, eyebrow]) => featureHtml(id, eyebrow(ctx), shown[id] ?? by(id), s, ctx);
    return `${aiBar}${status}
    <div class="d-fcarousel d-jcarousel" data-fcarousel><div class="d-jcarousel-top"><div class="d-fdots" role="group" aria-label="${tr('Your overview', 'Oversikten din')}">${cards.map(([, eyebrow], i) => `<button type="button" class="d-fdot" aria-label="${eyebrow(ctx)}"${i ? '' : ' aria-current="true"'}></button>`).join('')}</div><button type="button" class="d-jnext" data-fnext aria-label="${tr('Next card', 'Neste kort')}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg></button></div>
      <div class="d-fslides d-jslides${cards.length % 2 ? '' : ' is-even'}" tabindex="0" aria-label="${tr('Overview, swipe sideways', 'Oversikt, sveip sidelengs')}">${cards.map(feature).join('')}</div></div>
    ${tryBox}
    <details class="d-career-deep"><summary><span class="d-career-deep-title">${tr('How does this connect with your traits?', 'Hvordan henger dette sammen med trekkene dine?')}</span><img class="d-career-deep-art" src="assets/design/context/deep-traits.webp" alt="" aria-hidden="true" loading="lazy"><span class="d-career-plus" aria-hidden="true"></span></summary>
      <div class="d-career-deep-body">${cfg.deep.map(block).join('')}<p class="d-tailor-note">${tr('Each point links your answers with facets that sit clearly high or low. They are ideas to test, not established facts about you. Your answers stay in this browser tab.', 'Hvert punkt kobler svarene dine med fasetter som ligger tydelig høyt eller lavt. Det er ideer å teste, ikke fastslåtte sannheter om deg. Svarene blir bare lagret i denne nettleserfanen.')}</p></div></details>`;
  }

  /** The context bar for the chapter header (for example «Your job context»), with «Change». */
  function contextHtml(ctx) {
    const {tr, esc, language} = ctx, s = state();
    if (!copy.isComplete(s.answers) || s.editing) return `<div ${A}-bar hidden></div>`;
    return `<div class="d-career-context" ${A}-bar><span class="d-career-context-icon">${cfg.icon}</span><div><p class="d-career-eyebrow">${cfg.text(ctx).contextEyebrow}</p><p class="d-career-context-text">${cfg.contextParts(s.answers, language).filter(Boolean).map(esc).join('<span aria-hidden="true"> · </span>')}</p></div><button type="button" class="text-button no-print" ${A}="edit">${tr('Change', 'Endre')}</button></div>`;
  }

  function build(ctx, answers) {
    const {domains, language} = ctx, built = copy.build(domains, answers, language);
    built.request = copy.request(built, domains, answers, language);
    built.key = hash(JSON.stringify(built.request));
    return built;
  }

  function html(ctx) {
    const {tr} = ctx, s = state(), t = cfg.text(ctx);
    const done = copy.isComplete(s.answers) && !s.editing;
    if (done) return `<section class="d-career is-result" ${A}-root aria-label="${t.title}"><p class="d-tailor-badge">${t.badge}</p>${resultHtml(s, ctx, build(ctx, s.answers))}</section>`;
    // While the questions are open, the chapter shows them first (cfg.jumpIn hides the chapter header).
    return `<section class="d-tailor d-career d-q2" ${A}-root aria-label="${t.title}"${cfg.jumpIn ? ' data-jump' : ''}>
    ${stepHtml(s, ctx)}
    <p class="d-tailor-note">${tr('Each point links your answers with facets that sit clearly high or low. They are ideas to test, not established facts about you. Your answers stay in this browser tab.', 'Hvert punkt kobler svarene dine med fasetter som ligger tydelig høyt eller lavt. Det er ideer å teste, ikke fastslåtte sannheter om deg. Svarene blir bare lagret i denne nettleserfanen.')}</p></section>`;
  }

  function rerender(section, ctx, focusSelector) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html(ctx);
    const next = tmp.firstElementChild;
    section.replaceWith(next);
    init({querySelectorAll: () => [next]}, ctx);
    // The context bar sits in the chapter header and follows the same answers.
    const bar = document.querySelector(`[${A}-bar]`);
    if (bar) { tmp.innerHTML = contextHtml(ctx); const nb = tmp.firstElementChild; bar.replaceWith(nb); bindBar(nb, ctx); }
    const target = focusSelector && next.querySelector(focusSelector);
    if (target) target.focus({preventScroll: false});
    return next;
  }

  function startEditing(ctx) {
    const s = state(), section = document.querySelector(`[${A}-root]`);
    s.step = 0; s.editing = true; message = ''; store(s);
    if (section) rerender(section, ctx, '.d-career-opt')?.scrollIntoView({behavior: smooth(), block: 'start'});
  }
  function bindBar(bar, ctx) { bar.querySelector(`[${A}="edit"]`)?.addEventListener('click', () => startEditing(ctx)); }

  async function writeWithAi(section, ctx) {
    const s = state(), {tr} = ctx, built = build(ctx, s.answers), aiKey = built.key;
    pending = aiKey; message = '';
    section = rerender(section, ctx);
    try {
      const r = await fetch('api/career-report', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(built.request)});
      const data = await r.json().catch(() => ({}));
      if (r.status === 503 || r.status === 404 || r.status === 405) message = tr('AI writing is not switched on here yet (the server needs an API key). You are seeing the pre-written text.', 'AI-skriving er ikke slått på her ennå (serveren mangler API-nøkkel). Du ser den ferdigskrevne teksten.');
      else if (!r.ok || !Array.isArray(data.sections)) message = tr('AI writing failed. You are seeing the pre-written text.', 'AI-skrivingen feilet. Du ser den ferdigskrevne teksten.');
      else store({...state(), ai: {key: aiKey, sections: data.sections, model: data.model}, view: 'ai'});
    } catch {
      message = tr('Could not reach the server. You are seeing the pre-written text.', 'Fikk ikke kontakt med serveren. Du ser den ferdigskrevne teksten.');
    }
    pending = null;
    const live = document.querySelector(`[${A}-root]`);
    if (live) rerender(live, ctx);
  }

  // Moves on after an answer: to the next visible question, or to the result after the last one.
  function advance(s) {
    const qs = visible(s.answers), at = qs.indexOf(current(s).q);
    if (at < qs.length - 1) s.step = at + 1; else { s.step = 0; s.editing = false; }
  }

  function init(root, ctx) {
    if (root.nodeType === 1) root.querySelectorAll(`[${A}-bar]`).forEach(bar => bindBar(bar, ctx));
    if (!printHook) { printHook = true; addEventListener('beforeprint', () => document.querySelectorAll(`[${A}-root] details`).forEach(d => { d.open = true; })); }
    root.querySelectorAll(`[${A}-root]`).forEach(section => {
      initFacetCarousels(section);
      section.addEventListener('change', e => {
        if (!e.target.matches(`[${A}-try]`)) return;
        const s = state(), text = e.target.closest('.d-career-week')?.querySelector('.d-career-week-text')?.textContent || '';
        s.tried = e.target.checked ? hash(text) : null;
        store(s);
      });
      section.addEventListener('input', e => {
        if (!e.target.matches(`[${A}-other]`)) return;
        const s = state(), {q} = current(s);
        s.answers.other = {...(s.answers.other || {}), [q.id]: e.target.value.slice(0, copy.OTHER_MAX)};
        store(s);
      });
      section.addEventListener('click', e => {
        const opt = e.target.closest('.d-career-opt'), act = e.target.closest(`[${A}]`)?.getAttribute(A);
        const s = state();
        if (opt) {
          const {q} = current(s);
          if (q.multi) {
            const now = asList(s.answers[q.id]), v = opt.dataset.value;
            s.answers[q.id] = now.includes(v) ? now.filter(x => x !== v) : now.length < q.multi ? [...now, v] : [...now.slice(1), v];
            store(s);
            rerender(section, ctx, v === 'other' && s.answers[q.id].includes('other') ? `[${A}-other]` : `.d-career-opt[data-value="${v}"]`);
            return;
          }
          s.answers[q.id] = opt.dataset.value;
          // Stay on the question (in the stepper, even when every answer is now filled in) so the text field can be used.
          if (opt.dataset.value === 'other') { s.editing = true; store(s); rerender(section, ctx, `[${A}-other]`); return; }
          advance(s);
          message = '';
          store(s);
          const next = rerender(section, ctx, '.d-career-opt');
          if (!s.step && !s.editing) next.scrollIntoView({behavior: smooth(), block: 'start'});
          return;
        }
        if (act === 'next') { advance(s); store(s); rerender(section, ctx, '.d-career-opt'); }
        else if (act === 'back') { s.step = Math.max(0, visible(s.answers).indexOf(current(s).q) - 1); store(s); rerender(section, ctx, '.d-career-opt'); }
        else if (act === 'edit') startEditing(ctx);
        else if (act === 'toggle') { s.view = s.view === 'rules' ? 'ai' : 'rules'; store(s); rerender(section, ctx); }
        else if (act === 'ai' && !pending) writeWithAi(section, ctx);
      });
    });
  }

  return {html, contextHtml, init, clear, state};
}
