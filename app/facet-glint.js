// Facet glint (Rune, 2026-10-20): each small triangle facet of the logo pieces lights up faintly now and then,
// one at a time in random order and never the same facet twice in a row. It applies to the trait pieces
// everywhere in the app, but not to the brand logo (header, footer, loading animation, the spread logo)
// or the tiny cairn stones on the question page.
// Piece images are swapped for an inline SVG of the same image with the facets drawn on top; the trait logo
// (logo-nav.js) draws LOGO_FACETS itself. Nothing glints under reduced motion.

// Facet outlines traced from the piece images (pixel units of each logo-piece-*.webp).
const PIECES = {
  sky: [375, 318, ['2,2 297,93 138,152 34,86', '34,86 138,152 118,316', '297,93 372,116 258,204 138,152', '138,152 258,204 118,316']],
  apricot: [383, 369, ['128,2 177,143 3,366', '128,2 355,208 177,143', '177,143 355,208 381,223 228,280', '3,366 177,143 228,280']],
  steel: [371, 310, ['246,3 205,208 2,293', '246,3 368,307 205,208', '2,293 205,208 368,307']],
  ivory: [373, 321, ['2,2 337,20 228,95', '2,2 228,95 262,272 243,317', '228,95 337,20 370,22 262,272']],
  navy: [337, 395, ['112,145 330,4 222,178', '330,4 298,355 222,178', '2,216 112,145 158,258 137,297', '112,145 222,178 158,258', '137,297 158,258 222,178 298,355 300,393']],
};
// The same facets in the 512-unit logo (logo-mark-1024.webp at half scale), mapped from the pieces above.
export const LOGO_FACETS = {
  O: ['35.5,227.9 200.5,278.7 111.6,311.8 53.5,274.9', '53.5,274.9 111.6,311.8 100.6,403.5', '200.5,278.7 242.4,291.6 178.8,340.8 111.6,311.8', '111.6,311.8 178.8,340.8 100.6,403.5'],
  C: ['317.5,14.5 344.7,93.6 246.8,218.6', '317.5,14.5 444.4,130 344.7,93.6', '344.7,93.6 444.4,130 458.9,138.4 373.1,170.4', '246.8,218.6 344.7,93.6 373.1,170.4'],
  E: ['287.7,277.3 264.9,392.8 151.2,440.6', '287.7,277.3 356.2,448.6 264.9,392.8', '151.2,440.6 264.9,392.8 356.2,448.6'],
  A: ['285,231.3 472.6,241.9 411.6,283.8', '285,231.3 411.6,283.8 430.8,383.2 420.2,408.4', '411.6,283.8 472.6,241.9 491.1,243.1 430.8,383.2'],
  N: ['114.7,118.4 238.3,39.2 176,136.8', '238.3,39.2 216.8,235.9 176,136.8', '52.4,158.3 114.7,118.4 139.3,181.7 127.2,203.6', '114.7,118.4 176,136.8 139.3,181.7', '127.2,203.6 139.3,181.7 176,136.8 216.8,235.9 217.5,257.2'],
};
export const facetPolygons = list => list.map(p => `<polygon class="k-facet" points="${p}"/>`).join('');

const SKIP = 'header,footer,.d-assemble,.d-loading,.d-cairn,.no-glint';
const NS = 'http://www.w3.org/2000/svg';
const KEEP = ['class', 'style', 'width', 'height', 'aria-hidden', 'data-facet-art'];

function upgrade(img) {
  const name = (img.getAttribute('src') || '').match(/logo-piece-(\w+)\.webp$/)?.[1], piece = PIECES[name];
  if (!piece || img.closest(SKIP)) return;
  const [w, h, facets] = piece, svg = document.createElementNS(NS, 'svg');
  KEEP.forEach(a => img.hasAttribute(a) && svg.setAttribute(a, img.getAttribute(a)));
  svg.classList.add('k-piece');
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('focusable', 'false');
  if (img.alt) {svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', img.alt);} else svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = `<image href="${img.getAttribute('src')}" width="${w}" height="${h}"/>${facetPolygons(facets)}`;
  img.replaceWith(svg);
}
const upgradeAll = root => root.querySelectorAll?.('img[src*="logo-piece-"]').forEach(upgrade);

// A new facet about three times a second (Rune 2026-10-21: more often), picked at random among those on screen, never the one that just glinted.
let last = null, timer = 0;
function onScreen(el) {
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
}
function tick() {
  timer = setTimeout(tick, 200 + Math.random() * 300);
  if (document.hidden) return;
  const all = [...document.querySelectorAll('.k-facet')].filter(f => f !== last && !f.classList.contains('is-glint') && !f.closest(SKIP) && onScreen(f));
  if (!all.length) return;
  const f = all[Math.floor(Math.random() * all.length)];
  f.classList.add('is-glint');
  f.addEventListener('animationend', () => f.classList.remove('is-glint'), {once: true});
  last = f;
}

export function startFacetGlint() {
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  upgradeAll(document);
  let queued = false;
  new MutationObserver(() => {if (queued) return; queued = true; requestAnimationFrame(() => {queued = false; upgradeAll(document);});}).observe(document.body, {childList: true, subtree: true});
  const run = () => {clearTimeout(timer); if (!still.matches) tick();};
  still.addEventListener?.('change', run);
  run();
}
