// Report chapter "Your five traits": the Fem logo as a picker. Each of the five pieces is a
// button for one trait; it lifts on hover and opens that trait's panel below the logo.
// One panel is open at a time and it folds away again, so the chapter stays short.
// Print and PDF show every panel (see design.css), so nothing is lost on paper.
import {traitColors, traitPiece} from './design-copy.js';

// Same layout as the assembled logo on the loading screen (285 x 278).
// The sand piece is the ivory shape in a deeper colour, so it shares the ivory slot.
const slot = {navy: 'navy', apricot: 'apricot', sand: 'ivory', steel: 'steel', sky: 'sky'};
// Triangle corners within each piece image, measured from the PNG alpha, so only the
// visible triangle reacts to the pointer and overlapping boxes do not steal clicks.
const shape = {
  navy: '2% 53%,95% 1%,87% 96%', apricot: '32% 2%,98% 62%,2% 97%', ivory: '2% 3%,98% 11%,58% 97%',
  steel: '60% 2%,98% 96%,2% 97%', sky: '1% 2%,98% 35%,34% 98%'
};
// Tab and arrow-key order follows the usual trait order; stacking is set in CSS.
const ORDER = ['O', 'C', 'E', 'A', 'N'];
let openCode = null;

const shortName = name => name.replace(/\s*\(.*\)$/, '').replace(/^Følelsesmessig r/, 'R').replace(/^Emotional r/, 'R');

/** Logo with five trait buttons, followed by the five panels (all folded). */
export function traitLogoHtml(c, panels) {
  const byCode = Object.fromEntries(c.domains.map(d => [d.code, d]));
  if (!byCode[openCode]) openCode = null;
  const buttons = ORDER.filter(code => byCode[code]).map(code => {
    const d = byCode[code], s = slot[traitPiece[code]], open = code === openCode;
    return `<button type="button" class="d-tlogo-piece d-tlogo-${s}${open ? ' is-open' : ''}" data-trait="${code}" aria-expanded="${open}" aria-controls="trait-${code}" style="--tc:${traitColors[code]};--clip:polygon(${shape[s]})"><span class="d-tlogo-hit"></span><img src="assets/design/tri-${traitPiece[code]}.png" alt=""><span class="d-tlogo-label"><span class="d-tlogo-name">${c.esc(shortName(c.name(d)))}</span><span class="d-tlogo-score">${c.esc(c.scoreText(d))}</span></span></button>`;
  }).join('');
  return `<div class="d-tlogo-wrap${openCode ? ' has-open' : ''}"><p class="d-tlogo-hint" id="tlogo-hint">${c.tr('Choose a piece of the logo to open that trait.', 'Velg en del av logoen for å åpne trekket.')}</p>
    <div class="d-tlogo" role="group" aria-labelledby="tlogo-hint">${buttons}</div></div>
    <div class="d-tlpanels">${panels.map(([code, html]) => `<div class="d-tlpanel" id="trait-${code}" role="region" aria-label="${c.esc(c.name(byCode[code]))}"${code === openCode ? '' : ' hidden'}>${html}<button type="button" class="d-tlpanel-close" data-close="${code}"><span aria-hidden="true">↑</span> ${c.tr('Fold away', 'Fold sammen')}</button></div>`).join('')}</div>`;
}

export function initTraitLogo(root) {
  const logo = root.querySelector('.d-tlogo');
  if (!logo) return;
  const pieces = [...logo.querySelectorAll('.d-tlogo-piece')];
  const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const set = (code, focusPiece) => {
    openCode = code;
    root.querySelector('.d-tlogo-wrap').classList.toggle('has-open', !!code);
    pieces.forEach(p => {const on = p.dataset.trait === code; p.setAttribute('aria-expanded', String(on)); p.classList.toggle('is-open', on);});
    root.querySelectorAll('.d-tlpanel').forEach(panel => {
      const on = panel.id === `trait-${code}`;
      panel.hidden = !on;
      panel.classList.remove('is-opening');
      if (on && !still()) {panel.getBoundingClientRect(); panel.classList.add('is-opening');}
      // Bring the opened panel's heading into view when it starts near the bottom edge.
      const top = on ? panel.getBoundingClientRect().top : 0;
      if (on && top > innerHeight * .75) scrollBy({top: top - innerHeight * .4, behavior: still() ? 'auto' : 'smooth'});
    });
    if (focusPiece) {
      const p = logo.querySelector(`[data-trait="${focusPiece}"]`);
      p.focus();
      // Keep the logo in view when a long panel is folded from its bottom.
      if (p.getBoundingClientRect().top < 0) logo.scrollIntoView({block: 'start', behavior: still() ? 'auto' : 'smooth'});
    }
  };
  pieces.forEach((p, i) => {
    p.addEventListener('click', () => set(p.dataset.trait === openCode ? null : p.dataset.trait));
    p.addEventListener('keydown', e => {
      const n = {ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1}[e.key];
      if (n) {e.preventDefault(); pieces[(i + n + pieces.length) % pieces.length].focus();}
    });
  });
  root.querySelectorAll('.d-tlpanel-close').forEach(b => b.addEventListener('click', () => set(null, b.dataset.close)));
}
