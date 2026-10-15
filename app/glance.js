// Report overview "Your profile at a glance": pentagon radar, 100-person grid per trait,
// the trait and the facet furthest from the middle and one combination sentence.
// Everything is drawn from the same percentiles (or 1–5 means when norms are missing) as the bars.
// Animations start when a part scrolls into view and are skipped with reduced motion; until then
// every element sits in its final state, so print and no-JS views stay complete.
import {traitColors} from './design-copy.js';
import {combination} from './combination-copy.js';
import {profileName} from './profile-name.js';
import {compareHtml} from './facet-compare.js';

const ORDER = ['O', 'C', 'E', 'A', 'N'];
const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const extremity = x => Number.isFinite(x.percentile) ? Math.abs(x.percentile - 50) / 50 : Math.abs(x.mean - 3) / 2;
function radar(c) {
  const cx = 180, cy = 174, R = 128, at = (k, r) => {const a = (-90 + k * 72) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)];};
  const ring = f => ORDER.map((_, k) => at(k, R * f).map(v => v.toFixed(1)).join(',')).join(' ');
  const ds = ORDER.map(code => c.domains.find(d => d.code === code));
  const pts = ds.map((d, k) => at(k, R * c.barPos(d) / 100));
  const values = ds.map((d, k) => {const [x, y] = at(k, R + 24); return `<text x="${x.toFixed(1)}" y="${(y + 7).toFixed(1)}" text-anchor="middle" class="d-radar-value" data-count="${c.value(d)}">${c.value(d)}</text>`;}).join('');
  const label = ds.map(d => `${c.name(d)}: ${c.scoreText(d)}`).join(', ');
  return `<svg class="d-radar" viewBox="0 0 360 336" role="img" aria-label="${c.esc(label)}">
    ${[1, .75, .5, .25].map(f => `<polygon class="d-radar-ring${f === .5 ? ' is-mid' : ''}" points="${ring(f)}"/>`).join('')}
    ${ORDER.map((_, k) => {const [x, y] = at(k, R); return `<line class="d-radar-axis" x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`;}).join('')}
    <g class="d-radar-shape"><polygon class="d-radar-area" points="${pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}"/>
    ${pts.map((p, k) => `<circle class="d-radar-dot" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="8" fill="${traitColors[ORDER[k]]}"/>`).join('')}</g>
    ${values}
  </svg><ul class="d-radar-legend" aria-hidden="true">${ds.map(d => `<li>${c.piece(d.code)}<span>${c.esc(c.name(d))}</span><strong data-count="${c.value(d)}">${c.value(d)}</strong></li>`).join('')}</ul>`;
}

// 100 figures; you score higher than the first p of them, and the next one is you.
function people(c, d) {
  const p = Math.round(c.value(d)), you = Math.min(99, p);
  let figs = '';
  for (let i = 0; i < 100; i++) {
    const x = (i % 10) * 30 + 15, y = Math.floor(i / 10) * 30 + 2;
    figs += `<use href="#d-person" x="${x - 9}" y="${y}" width="18" height="26" class="d-person${i < p ? ' is-lit' : ''}${i === you ? ' is-you' : ''}" style="--i:${i}"/>`;
  }
  const lit = traitColors[d.code];
  return `<svg class="d-people" viewBox="0 0 300 300" role="img" aria-label="${c.esc(c.tr(`You score higher than about ${p} of 100 people in the reference group.`, `Du skårer høyere enn omtrent ${p} av 100 i referansegruppen.`))}" style="--lit:${lit}">
    <defs><symbol id="d-person" viewBox="0 0 18 26"><circle cx="9" cy="5" r="4.4"/><path d="M1.5 25.5v-8.2a7.5 7.5 0 0 1 15 0v8.2z"/></symbol></defs>${figs}</svg>
    <p class="d-people-line">${c.tr(`You score higher than about <strong data-count="${p}">${p}</strong> of 100`, `Du skårer høyere enn omtrent <strong data-count="${p}">${p}</strong> av 100`)}</p>
    <p class="d-people-key"><span class="d-key-lit" style="background:${lit}"></span>${c.tr('People you score higher than', 'Personer du skårer høyere enn')}<span class="d-key-you"></span>${c.tr('You', 'Deg')}</p>`;
}

/** Grid for one trait, used when switching tabs. */
export const peopleFor = (c, code) => people(c, c.domains.find(d => d.code === code));

export function glanceHtml(c) {
  const ds = c.domains, pct = c.pct;
  // The trait furthest from the middle, in either direction. "Highest" read as "strong" even when
  // every trait was below the middle (e.g. Extraversion at percentile 31 as the highest).
  const strongest = [...ds].sort((a, b) => extremity(b) - extremity(a) || a.code.localeCompare(b.code))[0];
  const facet = ds.flatMap(d => d.facets).sort((a, b) => extremity(b) - extremity(a) || a.code.localeCompare(b.code))[0];
  const facetTrait = ds.find(d => d.code === facet.code[0]);
  const combo = combination(ds, c.language), named = profileName(ds, c.language);
  const first = ds[0];
  const tabs = pct ? `<div class="d-people-box"><h3>${c.tr('Compared with 100 people', 'Sammenlignet med 100 personer')}</h3>
    <div class="d-people-tabs" role="tablist" aria-label="${c.tr('Choose a trait', 'Velg et trekk')}">${ORDER.map(code => {const d = ds.find(x => x.code === code); return `<button type="button" role="tab" id="pt-${code}" aria-controls="people-panel" aria-selected="${d === first}" tabindex="${d === first ? 0 : -1}" data-trait="${code}" style="--tc:${traitColors[code]}">${c.esc(c.name(d).replace(/\s*\(.*\)$/, '').replace(/^Følelsesmessig r/, 'R').replace(/^Emotional r/, 'R'))}</button>`;}).join('')}</div>
    <div class="d-people-panel" id="people-panel" role="tabpanel" aria-labelledby="pt-${first.code}">${people(c, first)}</div></div>` : '';
  return `<section class="d-panel d-glance" aria-labelledby="glance-title">
    <h2 class="d-panel-title" id="glance-title">${c.tr('Your profile at a glance', 'Din profil på ett blikk')}</h2>
    <p class="d-glance-name">${c.tr('Your profile character', 'Profilfiguren din')}: <strong>${c.esc(named.name)}</strong></p>
    <p class="d-pct-sub">${pct ? c.tr('A higher percentile means more of the trait, not a better result. The dashed ring is the middle (50).', 'Høyere persentil betyr mer av trekket, ikke et bedre resultat. Den stiplede ringen er midten (50).') : c.tr('Further out means you agreed more with statements about the trait. The dashed ring is the middle of the answer scale.', 'Lenger ut betyr at du sa deg mer enig i utsagn om trekket. Den stiplede ringen er midten av svarskalaen.')}</p>${c.pctInfo}
    <div class="d-glance-grid${pct ? '' : ' is-single'}"><div class="d-radar-box">${radar(c)}</div>${tabs}</div>
    <div class="d-glance-cards">
      <article class="d-glance-card is-warm"><img src="assets/design/trait-${strongest.code}.webp" alt="" aria-hidden="true"><div><p class="d-glance-eyebrow">${c.tr('The trait that stands out most', 'Trekket som skiller seg mest ut')}</p><h3>${c.esc(c.name(strongest))}</h3><p class="d-glance-score">${c.countText(strongest)}</p><p>${c.esc(c.traitLine(strongest))}</p></div></article>
      <article class="d-glance-card is-cool"><img src="assets/design/facets/${facet.code}.webp" alt="" aria-hidden="true"><div><p class="d-glance-eyebrow">${c.tr('Your most distinctive facet', 'Fasetten som skiller seg mest ut')}</p><h3>${c.esc(facet.name)}</h3><p class="d-glance-score">${c.countText(facet)} · ${c.esc(c.name(facetTrait))}</p>${compareHtml(facet, c.language, traitColors[facetTrait.code], c.esc)}<p>${c.esc(facet.interpretation)}</p></div></article>
    </div>
    <article class="d-combo"><div class="d-combo-pieces" aria-hidden="true">${combo.traits.map(d => c.piece(d.code)).join('')}</div><div><p class="d-glance-eyebrow">${c.tr('Your combination', 'Kombinasjonen din')}</p><h3>${c.esc(combo.title)}</h3><p>${c.esc(combo.text)}${combo.nuance ? ' ' + c.esc(combo.nuance) : ''}</p>${combo.traits.length === 2 ? `<p class="d-small">${c.tr(`Based on the two traits furthest from the middle: ${c.name(combo.traits[0])} and ${c.name(combo.traits[1])}.`, `Bygger på de to trekkene som ligger lengst fra midten: ${c.name(combo.traits[0])} og ${c.name(combo.traits[1])}.`)}</p>` : ''}</div></article>
  </section>`;
}

/** Counts a number up from 0 to its final value. */
export function countUp(el, ms = 800) {
  const end = Number(el.dataset.count), dec = String(el.dataset.count).includes('.') ? 1 : 0;
  if (!Number.isFinite(end) || still()) return;
  const t0 = performance.now(), fmt = v => dec ? v.toFixed(1) : String(Math.round(v));
  const step = t => {const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(end * e); if (k < 1) requestAnimationFrame(step);};
  el.textContent = fmt(0); requestAnimationFrame(step);
}

const play = el => {el.classList.remove('is-playing', 'is-waiting'); el.getBoundingClientRect(); el.classList.add('is-playing'); el.querySelectorAll('[data-count]').forEach(n => countUp(n));};

/** Wires tabs and in-view animations. `peopleFor(code)` returns the grid for one trait. */
export function initGlance(root, peopleFor) {
  const box = root.querySelector('.d-glance');
  if (!box) return;
  const tabs = [...box.querySelectorAll('[role="tab"]')], panel = box.querySelector('#people-panel');
  const select = (tab, focus) => {
    tabs.forEach(t => {const on = t === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;});
    panel.setAttribute('aria-labelledby', tab.id); panel.innerHTML = peopleFor(tab.dataset.trait);
    if (focus) tab.focus();
    if (!still()) play(panel);
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', e => {
      const n = {ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1}[e.key];
      if (n) {e.preventDefault(); select(tabs[(i + n + tabs.length) % tabs.length], true);}
      if (e.key === 'Home' || e.key === 'End') {e.preventDefault(); select(tabs[e.key === 'Home' ? 0 : tabs.length - 1], true);}
    });
  });
  if (still() || !('IntersectionObserver' in window)) return;
  const parts = [box.querySelector('.d-radar-box'), panel, ...box.querySelectorAll('.d-glance-card, .d-combo')].filter(Boolean);
  // Only parts below the fold wait for the reader; the rest play right away.
  const io = new IntersectionObserver(entries => entries.forEach(en => {if (en.isIntersecting) {play(en.target); io.unobserve(en.target);}}), {threshold: .2});
  requestAnimationFrame(() => parts.forEach(p => {const r = p.getBoundingClientRect(); if (r.height && r.top > innerHeight * .9) p.classList.add('is-waiting'); io.observe(p);}));
  addEventListener('beforeprint', () => parts.forEach(p => p.classList.remove('is-waiting')), {once: true});
}
