// «Tilpasset deg»: the tailored block at the top of the Work & career and Everyday life chapters.
// The reader answers a few questions; the answers stay in this browser tab (sessionStorage) and are
// combined with the facet scores by the rules in tailored-copy.js.
import {visibleQuestions, isComplete, optionLabel, tailor} from './tailored-copy.js';

export const TAILOR_KEY = 'fem-tailor-v1';

export function tailorAnswers() {
  try { const s = JSON.parse(sessionStorage.getItem(TAILOR_KEY) || 'null'); return s && typeof s === 'object' ? s : {}; } catch { return {}; }
}
function store(all) { try { sessionStorage.setItem(TAILOR_KEY, JSON.stringify(all)); } catch {} }
export function clearTailor() { try { sessionStorage.removeItem(TAILOR_KEY); } catch {} }

function formHtml(chapter, answers, ctx) {
  const {tr, esc, language} = ctx;
  return visibleQuestions(chapter, answers).map(q => `<fieldset class="d-tailor-q"><legend>${esc(q.q[language === 'no' ? 1 : 0])}</legend><div class="d-tailor-options">${q.options.map(([value, en, no]) => {
    const id = `tq-${chapter}-${q.id}-${value}`;
    return `<input type="radio" id="${id}" name="tq-${chapter}-${q.id}" value="${value}" data-q="${q.id}" ${answers[q.id] === value ? 'checked' : ''}><label for="${id}">${esc(tr(en, no))}</label>`;
  }).join('')}</div></fieldset>`).join('');
}

function itemHtml(l, ctx) {
  const {tr, esc, scoreText, bandShort} = ctx;
  return `<li data-rule="${l.ruleId}"><p class="d-tailor-facet"><strong>${esc(l.facet.name)}</strong><span>${esc(scoreText(l.facet))}</span><span class="d-chip d-chip-${l.facet.band}">${bandShort(l.facet.band)}</span></p><p>${esc(l.text)}</p><p class="d-try"><span>${tr('Try', 'Prøv')}</span>${esc(l.try)}</p><p class="d-tailor-why">${tr('From your answer', 'Fra svaret ditt')}: ${esc(l.because)}</p></li>`;
}

function resultHtml(chapter, answers, ctx) {
  const {tr, domains, language} = ctx;
  const t = tailor(domains, chapter, answers, language);
  const empty = `<p class="d-tailor-empty">${tr('None of the facets linked to your answers sits clearly high or low here. The trait cards below are the best place to start.', 'Ingen av fasettene som henger sammen med svarene dine, ligger tydelig høyt eller lavt her. Trekkortene under er det beste stedet å starte.')}</p>`;
  const col = (cls, title, list) => `<div class="d-tailor-col ${cls}"><h4>${title}</h4>${list.length ? `<ul>${list.map(l => itemHtml(l, ctx)).join('')}</ul>` : empty}</div>`;
  return `<div class="d-tailor-cols">${col('is-help', tr('What helps you', 'Dette hjelper deg'), t.helps)}${col('is-hard', tr('What can make it harder', 'Dette kan gjøre det krevende'), t.hard)}</div>`;
}

export function tailorHtml(chapter, ctx) {
  const {tr, esc, language} = ctx;
  const answers = tailorAnswers()[chapter] || {}, done = isComplete(chapter, answers);
  const summary = visibleQuestions(chapter, answers).map(q => optionLabel(chapter, q.id, answers[q.id], language)).join(' · ');
  const title = chapter === 'work' ? tr('Tailored to your work', 'Tilpasset arbeidet ditt') : tr('Tailored to your everyday life', 'Tilpasset hverdagen din');
  const lead = chapter === 'work'
    ? tr('Answer four short questions about your work. We combine your answers with your facets, so you see what probably helps you and what can make it harder.', 'Svar på fire korte spørsmål om arbeidet ditt. Vi kobler svarene med fasettene dine, så du ser hva som trolig hjelper deg og hva som kan gjøre det krevende.')
    : tr('Answer a few short questions about your everyday life. We combine your answers with your facets, so you see what probably helps you and what can make it harder.', 'Svar på noen korte spørsmål om hverdagen din. Vi kobler svarene med fasettene dine, så du ser hva som trolig hjelper deg og hva som kan gjøre det krevende.');
  return `<section class="d-tailor" data-tailor="${chapter}" aria-labelledby="tailor-${chapter}-title"><div class="d-tailor-head"><p class="d-tailor-badge">${tr('Tailored', 'Tilpasset deg')}</p><h3 id="tailor-${chapter}-title">${title}</h3>${done ? '' : `<p>${lead}</p>`}</div>
    ${done ? `<details class="d-tailor-form no-print"><summary><span>${tr('Your answers', 'Svarene dine')}: ${esc(summary)}</span><b>${tr('Change', 'Endre')}</b></summary>${formHtml(chapter, answers, ctx)}</details>${resultHtml(chapter, answers, ctx)}` : `<div class="d-tailor-form no-print">${formHtml(chapter, answers, ctx)}</div>`}
    <p class="d-tailor-note">${tr('Each line links one of your answers with one facet. They are ideas to test, not established facts about you. Your answers here stay in this browser tab.', 'Hver linje kobler ett av svarene dine med én fasett. Det er ideer å teste, ikke fastslåtte sannheter om deg. Svarene her blir bare lagret i denne nettleserfanen.')}</p></section>`;
}

/** Re-renders a tailored block when an answer changes, keeping focus on the chosen option. */
export function initTailor(root, ctx) {
  root.querySelectorAll('.d-tailor').forEach(section => section.addEventListener('change', e => {
    const input = e.target.closest('input[data-q]');
    if (!input) return;
    const chapter = section.dataset.tailor, all = tailorAnswers();
    all[chapter] = {...(all[chapter] || {}), [input.dataset.q]: input.value};
    store(all);
    const wasOpen = !!section.querySelector('details[open]'), id = input.id;
    const tmp = document.createElement('div');
    tmp.innerHTML = tailorHtml(chapter, ctx);
    const next = tmp.firstElementChild;
    const details = next.querySelector('details');
    if (details && wasOpen) details.open = true;
    section.replaceWith(next);
    initTailor({querySelectorAll: () => [next]}, ctx);
    const justDone = !section.querySelector('details') && !!details, again = next.querySelector(`#${id}`);
    if (again && !justDone) again.focus({preventScroll: true});
    else next.querySelector('.d-tailor-cols')?.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest'});
  }));
}
