// Five stone cairns along the path on the question page, one per trait.
// Every answered question adds one stone of equal size to its trait's cairn, whatever the
// answer was, so the cairns show progress per trait and never the direction of a score.
import {traitColors} from './design-copy.js';

// 24 items per trait fill nine rows: 4+4+3+3+3+2+2+2+1.
const ROWS = [4, 4, 3, 3, 3, 2, 2, 2, 1];
const SLOTS = ROWS.flatMap((n, r) => Array.from({length: n}, (_, i) => ({r, i, n})));
export const CAIRN_STONES = SLOTS.length;
// Spots along the path in the landscape image (1800 × 372 px): x and baseline y.
const SPOTS = {C: [930, 338], A: [1192, 322], O: [1400, 250], E: [1530, 334], N: [1616, 278]};
const ORDER = ['O', 'C', 'E', 'A', 'N'];
// Loading-screen piece that each cairn turns into at the end.
export const loadingPiece = {O: 'sky', C: 'apricot', E: 'steel', A: 'ivory', N: 'navy'};

const rand = seed => {const x = Math.sin(seed * 12.9898) * 43758.5453; return x - Math.floor(x);};
function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16), target = amount < 0 ? 0 : 255, t = Math.abs(amount);
  const ch = s => Math.round(((n >> s) & 255) + (target - ((n >> s) & 255)) * t);
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
}

function stone(code, slot, cls) {
  const {r, i, n} = SLOTS[slot], seed = code.charCodeAt(0) * 31 + slot, base = traitColors[code];
  const x = 50 + (i - (n - 1) / 2) * 16.4 + (r % 2 ? 2 : -1.2) + (rand(seed) - .5) * 3;
  const y = 85 - r * 6.9 + (rand(seed + 3) - .5) * 1;
  const rot = (rand(seed + 5) - .5) * 12, fill = shade(base, (rand(seed + 9) - .5) * .16);
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})"><g class="d-stone${cls}"><ellipse rx="9.6" ry="4.3" fill="${fill}" stroke="${shade(base, -.35)}" stroke-width=".7" stroke-opacity=".55"/><ellipse rx="9.6" ry="4.3" fill="url(#d-stone-hi)"/></g></g>`;
}

/** Cairns for the current counts. Stones beyond `prev` drop in; stones beyond `counts` lift away. */
export function cairnsHtml(counts, prev, milestone = '') {
  const defs = `<svg class="d-cairn-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs><linearGradient id="d-stone-hi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".32"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#0b1b33" stop-opacity=".2"/></linearGradient><filter id="d-stone-tex" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="1.6"/></filter></defs></svg>`;
  const cairn = code => {
    const now = Math.min(CAIRN_STONES, counts[code] || 0), before = prev ? Math.min(CAIRN_STONES, prev[code] || 0) : now;
    let stones = '';
    for (let s = 0; s < Math.max(now, before); s++) stones += stone(code, s, s >= now ? ' is-leaving' : s >= before ? ' is-new' : '');
    const [x, y] = SPOTS[code];
    return `<span class="d-cairn" data-code="${code}" style="--x:${(x / 18).toFixed(2)}%;--y:${((372 - y) / 3.72).toFixed(2)}%"><svg viewBox="0 20 100 72" aria-hidden="true" focusable="false"><ellipse class="d-cairn-ground" cx="50" cy="90" rx="30" ry="3"/><g filter="url(#d-stone-tex)">${stones}</g></svg><img class="d-cairn-piece" src="assets/design/logo-piece-${loadingPiece[code]}.webp" alt=""></span>`;
  };
  const esc = v => String(v).replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
  return `<div class="d-cairns${milestone ? ' is-glow' : ''}" aria-hidden="true">${defs}${ORDER.map(cairn).join('')}<p class="d-milestone d-milestone-land">${esc(milestone)}</p></div>`;
}

/** Adds one dropping stone to a cairn that is already on screen. */
export function dropStone(code, slot) {
  const g = document.querySelector(`.d-cairn[data-code="${code}"] svg > g`);
  if (g && slot < CAIRN_STONES) g.insertAdjacentHTML('beforeend', stone(code, slot, ' is-new'));
}

/** End of the test: cairns lift into the five logo pieces. Returns where each piece ended up. */
export function cairnFinale(done) {
  const box = document.querySelector('.d-cairns');
  if (!box || matchMedia('(prefers-reduced-motion: reduce)').matches) {done(null); return;}
  document.querySelector('.d-question')?.classList.add('is-finale');
  setTimeout(() => done([...box.querySelectorAll('.d-cairn')].map(c => ({piece: loadingPiece[c.dataset.code], rect: c.querySelector('.d-cairn-piece').getBoundingClientRect()}))), 760);
}

/** On the loading screen, flies the pieces from the cairns into the assembled logo. */
export function flyPieces(flight) {
  const box = document.querySelector('.d-assemble');
  if (!box || !flight) return false;
  box.classList.add('is-from-cairns');
  const scale = box.getBoundingClientRect().width / box.offsetWidth || 1;
  flight.forEach(({piece, rect}, i) => {
    const el = box.querySelector(`.d-tri-${piece}`);
    if (!el) return;
    const end = el.getBoundingClientRect();
    const dx = (rect.left + rect.width / 2 - (end.left + end.width / 2)) / scale, dy = (rect.top + rect.height / 2 - (end.top + end.height / 2)) / scale;
    el.style.transition = 'none';
    el.style.transform = `translate(${dx}px,${dy}px) scale(${rect.width / end.width})`;
    el.getBoundingClientRect();
    requestAnimationFrame(() => {el.style.transition = `transform .95s cubic-bezier(.55,0,.2,1) ${i * 70}ms`; el.style.transform = '';});
  });
  return true;
}
