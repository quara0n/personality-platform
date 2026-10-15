// Report chapter "Your five traits" as a list: one row per trait with picture, name, bar,
// percentile and level, the same layout as the facet cards. A row opens that trait's panel
// right below it. One trait is open at a time so the chapter stays short.
// Print and PDF show every panel (see design.css), so nothing is lost on paper.
import {traitColors} from './design-copy.js';

const ORDER = ['O', 'C', 'E', 'A', 'N'];
let openCode = null;

// "Emotional reactivity (neuroticism)" keeps the bracket on a quieter second line.
const nameHtml = (c, d) => {const full = c.name(d), m = full.match(/^(.*?)\s*(\(.*\))$/); return m ? `${c.esc(m[1])}<span class="d-tacc-alt">${c.esc(m[2])}</span>` : c.esc(full);};
const art = code => code === 'O' ? 'trait-O.webp' : `facets/head-${code}.webp`;

/** c: {domains, name, scoreText, bandShort, miniBar, esc, tr}; panels: [[code, html]]. */
export function traitListHtml(c, panels) {
  const byCode = Object.fromEntries(c.domains.map(d => [d.code, d]));
  const html = Object.fromEntries(panels);
  if (!byCode[openCode]) openCode = null;
  const rows = ORDER.filter(code => byCode[code]).map(code => {
    const d = byCode[code], open = code === openCode, bar = c.miniBar(d, traitColors[code]).replace(/^<div/, '<span').replace(/<\/div>$/, '</span>');
    return `<article class="d-tacc${open ? ' is-open' : ''}" data-trait="${code}" style="--tc:${traitColors[code]}"><h3 class="d-tacc-h"><button type="button" class="d-tacc-toggle" aria-expanded="${open}" aria-controls="trait-${code}"><img class="d-tacc-art d-tacc-art-${code}" src="assets/design/${art(code)}" alt=""><span class="d-tacc-name">${nameHtml(c, d)}</span>${bar}<span class="d-tacc-score">${c.esc(c.scoreText(d))}</span><span class="d-chip d-chip-${d.band}">${c.bandShort(d.band)}</span><span class="d-fcard-plus" aria-hidden="true"></span></button></h3><div class="d-tlpanel" id="trait-${code}" role="region" aria-label="${c.esc(c.name(d))}"${open ? '' : ' hidden'}>${html[code]}<button type="button" class="d-tlpanel-close" data-close="${code}"><span aria-hidden="true">↑</span> ${c.tr('Fold away', 'Fold sammen')}</button></div></article>`;
  }).join('');
  return `<div class="d-tacc-list">${rows}</div>`;
}

export function initTraitList(root) {
  const list = root.querySelector('.d-tacc-list');
  if (!list) return;
  const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const set = (code, focusRow) => {
    openCode = code;
    list.querySelectorAll('.d-tacc').forEach(row => {
      const on = row.dataset.trait === code, panel = row.querySelector('.d-tlpanel');
      row.classList.toggle('is-open', on);
      row.querySelector('.d-tacc-toggle').setAttribute('aria-expanded', String(on));
      panel.hidden = !on;
      panel.classList.remove('is-opening');
      if (on && !still()) {panel.getBoundingClientRect(); panel.classList.add('is-opening');}
    });
    const row = list.querySelector(`[data-trait="${code || focusRow}"]`);
    // Closing the panel above can pull the opened row out of view, so bring it back.
    if (row && row.getBoundingClientRect().top < 0) row.scrollIntoView({block: 'start', behavior: still() ? 'auto' : 'smooth'});
    if (focusRow) row.querySelector('.d-tacc-toggle').focus();
  };
  list.querySelectorAll('.d-tacc-toggle').forEach(b => b.addEventListener('click', () => {
    const code = b.closest('.d-tacc').dataset.trait;
    set(code === openCode ? null : code);
  }));
  list.querySelectorAll('.d-tlpanel-close').forEach(b => b.addEventListener('click', () => set(null, b.dataset.close)));
}
