// The five traits as the logo (Rune, 2026-10-16): each piece of the logo is one trait and carries its
// percentile and level. Tapping a piece lifts it out of the logo and opens that trait below; the other
// pieces step back. Used in the free profile ("Explore your traits") and the report ("Your five traits").
// The caller renders the panels (hidden, with the ids from panelId) so print can still show them all.

// A soft light band sweeps across the whole logo now and then (clipped to each piece, behind the numbers)
// and the pieces brighten one by one, like the sheen on the score bars; still under reduced motion.

// Piece outlines in the 512-unit logo (from logo-flat.svg; they match logo-mark-1024.webp at half scale).
const SHAPES = {
  C: [[458.9, 138.4], [317.5, 14.5], [246.8, 218.6]],
  N: [[52.4, 158.3], [217.5, 257.2], [238.3, 39.2]],
  A: [[491.1, 243.1], [285.0, 231.3], [420.2, 408.4]],
  O: [[242.4, 291.6], [35.5, 227.9], [100.6, 403.5]],
  E: [[151.2, 440.6], [356.2, 448.6], [287.7, 277.3]],
};
export const LOGO_ORDER = ['O', 'C', 'E', 'A', 'N'];
const DARK = new Set(['N', 'E']);
const PIECE = {O: 'sky', C: 'apricot', E: 'steel', A: 'ivory', N: 'navy'};
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const centroid = t => [(t[0][0] + t[1][0] + t[2][0]) / 3, (t[0][1] + t[1][1] + t[2][1]) / 3];
const MID = (() => {const cs = Object.values(SHAPES).map(centroid); return [cs.reduce((s, c) => s + c[0], 0) / 5, cs.reduce((s, c) => s + c[1], 0) / 5];})();
// Incentre and inradius: where the number sits and how big it may be.
function incircle([a, b, c]) {
  const la = dist(b, c), lb = dist(a, c), lc = dist(a, b), s = la + lb + lc;
  const area = Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1])) / 2;
  return {x: (la * a[0] + lb * b[0] + lc * c[0]) / s, y: (la * a[1] + lb * b[1] + lc * c[1]) / s, r: 2 * area / s};
}
const open = {};

/** items: [{code, name, num, level, band, label}] in any order; opts: {key, panelId, tr, esc}. */
export function logoNavHtml(items, {key, panelId, tr, esc}) {
  const by = Object.fromEntries(items.map(x => [x.code, x]));
  if (!by[open[key]]) open[key] = null;
  const sel = open[key];
  const pieces = LOGO_ORDER.filter(c => by[c]).map((code, i) => {
    const x = by[code], t = SHAPES[code], pts = t.map(p => p.join(',')).join(' '), ic = incircle(t), cen = centroid(t);
    const ux = cen[0] - MID[0], uy = cen[1] - MID[1], k = 1 / Math.hypot(ux, uy);
    const fs = Math.min(54, ic.r * .82), on = code === sel;
    return `<g class="d-lnav-piece${DARK.has(code) ? ' is-dark' : ''}${on ? ' is-on' : ''}" data-trait="${code}" role="button" tabindex="0" aria-expanded="${on}" aria-controls="${panelId(code)}" aria-label="${esc(x.label)}" style="--ux:${(ux * k).toFixed(3)};--uy:${(uy * k).toFixed(3)};--i:${i};transform-origin:${cen[0].toFixed(1)}px ${cen[1].toFixed(1)}px">
      <clipPath id="lnav-${key}-${code}"><polygon points="${pts}"/></clipPath>
      <image href="assets/design/logo-mark-1024.webp" width="512" height="512" clip-path="url(#lnav-${key}-${code})"/>
      <g class="d-lnav-gloss" clip-path="url(#lnav-${key}-${code})"><rect class="d-lnav-sheen" x="-180" y="-120" width="180" height="760" fill="url(#lnav-${key}-sheen)"/></g>
      <polygon class="d-lnav-hit" points="${pts}"/>
      <polygon class="d-lnav-edge" points="${pts}"/>
      <text class="d-lnav-num" x="${ic.x.toFixed(1)}" y="${(ic.y + fs * .18).toFixed(1)}" style="font-size:${fs.toFixed(1)}px">${esc(x.num)}</text>
      <text class="d-lnav-level" x="${ic.x.toFixed(1)}" y="${(ic.y + fs * .18 + 19).toFixed(1)}">${esc(x.level)}</text></g>`;
  }).join('');
  const keys = LOGO_ORDER.filter(c => by[c]).map(code => `<li><button type="button" class="d-lnav-key${code === sel ? ' is-on' : ''}" data-trait="${code}" aria-expanded="${code === sel}" aria-controls="${panelId(code)}"><img src="assets/design/logo-piece-${PIECE[code]}.webp" alt="" aria-hidden="true"><span>${esc(by[code].name)}</span><span class="d-chip d-chip-${by[code].band}">${esc(by[code].level)}</span></button></li>`).join('');
  return `<div class="d-lnav${sel ? ' has-open' : ''}" data-key="${key}">
    <p class="d-lnav-hint">${tr('Tap a piece of the logo to open that trait.', 'Trykk på en bit av logoen for å åpne trekket.')}</p>
    <svg class="d-lnav-logo" viewBox="1.5 -19.5 523 502" aria-label="${esc(tr('Your five traits', 'Dine fem trekk'))}"><defs><linearGradient id="lnav-${key}-sheen"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>${pieces}</svg>
    <ul class="d-lnav-keys">${keys}</ul>
    <button type="button" class="d-lnav-float no-print" hidden><img src="assets/design/logo-mark.webp" alt="" aria-hidden="true"><span>${tr('All traits', 'Alle trekk')}</span></button></div>`;
}

/** Wires the pieces and the name keys. onOpen(code|null) runs after a change. */
export function initLogoNav(root, {panelId, onOpen = () => {}}) {
  const nav = root.querySelector('.d-lnav');
  if (!nav) return;
  const key = nav.dataset.key, still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const set = (code, from) => {
    open[key] = code;
    nav.classList.toggle('has-open', !!code);
    nav.querySelectorAll('[data-trait]').forEach(el => {const on = el.dataset.trait === code; el.classList.toggle('is-on', on); el.setAttribute('aria-expanded', String(on));});
    LOGO_ORDER.forEach(c => {const p = document.getElementById(panelId(c)); if (!p) return; p.hidden = c !== code; p.classList.remove('is-opening'); if (c === code && !still()) {p.getBoundingClientRect(); p.classList.add('is-opening');}});
    const panel = code && document.getElementById(panelId(code));
    // Bring the opened trait into view when it starts low on the screen; the logo stays reachable above.
    if (panel && panel.getBoundingClientRect().top > innerHeight * .72) panel.scrollIntoView({block: 'start', behavior: still() ? 'auto' : 'smooth'});
    if (!code && from) (nav.querySelector(`.d-lnav-piece[data-trait="${from}"]`) || nav).focus({preventScroll: false});
    onOpen(code);
  };
  const toggle = code => set(code === open[key] ? null : code);
  nav.querySelectorAll('[data-trait]').forEach(el => {
    el.addEventListener('click', () => toggle(el.dataset.trait));
    if (el.tagName !== 'BUTTON') el.addEventListener('keydown', e => {if (e.key === 'Enter' || e.key === ' ') {e.preventDefault(); toggle(el.dataset.trait);}});
  });
  root.querySelectorAll('[data-lnav-close]').forEach(b => b.addEventListener('click', () => set(null, b.dataset.lnavClose)));
  // Inside a trait, a small logo button floats at the bottom so the way back is always one tap (Rune, 2026-10-17).
  const float = nav.querySelector('.d-lnav-float');
  let logoSeen = true;
  const showFloat = () => {float.hidden = logoSeen || !open[key];};
  float.addEventListener('click', () => {const from = open[key]; set(null, from); nav.scrollIntoView({block: 'start', behavior: still() ? 'auto' : 'smooth'});});
  if ('IntersectionObserver' in window) new IntersectionObserver(es => {logoSeen = es[es.length - 1].isIntersecting; showFloat();}).observe(nav.querySelector('.d-lnav-logo'));
  const done = onOpen;
  onOpen = code => {showFloat(); done(code);};
  // The pieces fly together the first time the logo comes into view.
  if (still() || !('IntersectionObserver' in window)) {nav.classList.add('is-in'); return;}
  const io = new IntersectionObserver(es => {if (es.some(e => e.isIntersecting)) {nav.classList.add('is-in'); io.disconnect();}}, {threshold: .35});
  io.observe(nav);
}
