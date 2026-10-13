// Shareable profile video, vertical 1080 × 1920 for Stories, Reels and TikTok, in two cuts.
// Short (about 24 s, free profile): hook, profile name, the trait furthest from the middle as
// "more X than N of 100", the facet that stands out most (already open in the free profile),
// a light closing line and an end card that stays for five seconds before the clip loops.
// The song from share-music.js is recorded into the same file.
// Long (about 42 s, in-depth report): adds all five traits, the combination sentence and a
// possible strength, which are part of the paid report.
// Everything is drawn on a canvas and recorded in the browser; nothing is uploaded.
// Closing lines are editorial, kind in both directions and never mock a score; they follow the
// same trait as the profile name's noun, so they stay traceable to the result.
import {traitColors, traitPiece, panelCopy} from './design-copy.js';
import {combination} from './combination-copy.js';
import {extremity} from './scoring.js';
import {shownPercentile} from './norms.js';
import {profileName} from './profile-name.js';
import {SONG} from './share-music.js';

export const W = 1080, H = 1920;
const INK = '#0c1742', MUTED = '#5a7290', PAPER = '#fbf9f4', SERIF = "Georgia,'Times New Roman',serif", SANS = 'Arial,Helvetica,sans-serif';
const pick = (pair, language) => pair[language === 'no' ? 1 : 0];

// Comparatives for "more X than N of 100".
const poles = {
  O: {high: ['More curious', 'Mer nysgjerrig'], low: ['More down-to-earth', 'Mer jordnær']},
  C: {high: ['More structured', 'Mer strukturert'], low: ['More flexible', 'Mer fleksibel']},
  E: {high: ['More outgoing', 'Mer utadvendt'], low: ['Quieter', 'Mer stillferdig']},
  A: {high: ['More considerate', 'Mer omtenksom'], low: ['More direct', 'Mer direkte']},
  N: {high: ['More sensitive', 'Mer følsom'], low: ['Calmer', 'Roligere']}
};

export const closers = {
  O: {high: ['Probably has 14 tabs open right now.', 'Har sannsynligvis 14 faner åpne akkurat nå.'], low: ['Knows what works. Sees no reason to reinvent the wheel.', 'Vet hva som virker. Ser ingen grunn til å finne opp hjulet på nytt.']},
  C: {high: ['Has a plan B. And a colour-coded plan C.', 'Har en plan B. Og en fargekodet plan C.'], low: ['The plan is to see how it goes. It usually goes fine.', 'Planen er å se det an. Det pleier å gå fint.']},
  E: {high: ['Has probably told someone about this video already.', 'Har sikkert fortalt noen om denne videoen allerede.'], low: ['Recharges best with the door closed and the phone on silent.', 'Lader best med døra lukket og telefonen på lydløs.']},
  A: {high: ['Says sorry when someone else steps on their toes.', 'Sier unnskyld når andre tråkker dem på tærne.'], low: ['Will tell you there is spinach in your teeth.', 'Sier ifra hvis du har spinat mellom tennene.']},
  N: {high: ['Has already thought of everything that could go wrong. So it usually goes right.', 'Har allerede tenkt på alt som kan gå galt. Derfor går det ofte bra.'], low: ['Keeps the coffee steady while everyone else spills.', 'Holder kaffekoppen stødig mens alle andre søler.']},
  balanced: ['A bit of everything. Annoyingly well-rounded.', 'Litt av alt. Irriterende allsidig.']
};

const pct = x => Math.round(shownPercentile(x.percentile));
const byExtremity = (a, b) => extremity(b) - extremity(a) || a.code.localeCompare(b.code);

/** Everything the video says, chosen from the scores. `names` maps a domain to its display name. */
export function videoScript(domains, {language, firstName = '', name, site = '', long = false}) {
  const tr = (en, no) => (language === 'no' ? no : en);
  const named = profileName(domains, language);
  const trait = named.traits[0] || [...domains].sort(byExtremity)[0];
  const p = pct(trait), band = trait.band;
  const count = band === 'low' ? 100 - p : p;
  const stat = band === 'middle'
    ? {above: tr('Right in the middle on', 'Midt på skalaen i'), number: p, below: name(trait), caption: tr(`Percentile ${p}`, `Persentil ${p}`), count: p}
    : {above: `${pick(poles[trait.code][band], language)} ${tr('than', 'enn')}`, number: count, below: tr('out of 100 people', 'av 100 personer'), caption: tr(`${name(trait)} · percentile ${p}`, `${name(trait)} · persentil ${p}`), count};
  const facet = domains.flatMap(d => d.facets || []).filter(f => Number.isFinite(f.percentile)).sort(byExtremity)[0];
  const facetTrait = facet && domains.find(d => d.code === facet.code[0]);
  const first = String(firstName).trim().split(/\s+/)[0].slice(0, 24);
  const ORDER = ['O', 'C', 'E', 'A', 'N'], combo = combination(domains, language), strength = panelCopy(trait, language);
  const extra = long ? {
    traitsTitle: tr('All five traits', 'Alle fem trekkene'),
    traits: ORDER.map(code => domains.find(d => d.code === code)).filter(Boolean).map(d => ({code: d.code, name: name(d), percentile: pct(d), color: traitColors[d.code], piece: traitPiece[d.code]})),
    traitsNote: tr('Percentile: how many of 100 people scored lower', 'Persentil: hvor mange av 100 som skåret lavere'),
    combo: {eyebrow: tr('Your combination', 'Kombinasjonen din'), text: combo.text, pieces: combo.traits.map(d => traitPiece[d.code])},
    strength: {eyebrow: tr('A possible strength', 'En mulig styrke'), title: strength.strength, text: strength.strengthText}
  } : {};
  return {
    long,
    ...extra,
    language,
    hook: first ? tr(`Who is ${first}, really?`, `Hvem er ${first}, egentlig?`) : tr('120 questions later …', '120 spørsmål senere …'),
    intro: first ? tr(`${first} is`, `${first} er`) : tr('This is', 'Dette er'),
    name: named.name,
    trait: trait.code,
    color: traitColors[trait.code],
    stat,
    facet: facet ? {eyebrow: tr('The facet that stands out most', 'Fasetten som skiller seg mest ut'), name: facet.name, caption: tr(`Percentile ${pct(facet)} · ${name(facetTrait)}`, `Persentil ${pct(facet)} · ${name(facetTrait)}`), percentile: pct(facet), color: traitColors[facetTrait.code]} : null,
    closer: named.line || pick(named.traits.length ? closers[trait.code][band] : closers.balanced, language),
    end: tr("What's your profile?", 'Hvordan ser din profil ut?'),
    cta: tr('Find out for free', 'Finn ut gratis'),
    button: site || 'Fem',
    site,
    note: tr('Self-reflection, not a diagnosis.', 'Selvrefleksjon, ikke en diagnose.'),
    ruleId: `share-video-v1/${long ? 'long' : 'short'}/${trait.code}${band[0]}/${named.ruleId}`
  };
}

// ---------- drawing ----------
const clamp = t => Math.min(1, Math.max(0, t));
const ease = t => 1 - Math.pow(1 - clamp(t), 3);
const easeInOut = t => {t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;};
const easeOutBack = t => {t = clamp(t); const c = 1.6; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);};

// The song opens with quick plucks on every eighth note (0.25 s) from 0.157 s. The ring starts on the
// first one, each logo piece lands on one of the next five, and the ring closes on the beat at 1.9 s.
export const LOGO_HITS = {ring: [.157, 1.9], pieces: [.407, .657, .907, 1.157, 1.407], flight: .32};
const span = (t, a, b) => clamp((t - a) / (b - a));
// Fade in over `inn` after a, out over `out` before b.
const life = (t, a, b, inn = .45, out = .35) => Math.min(ease(span(t, a, a + inn)), 1 - span(t, b - out, b));

// Assembled logo from the loading screen (285 × 288 box), piece name → [left, top, width].
const LOGO = {navy: [5, 18, 119], apricot: [129, 0, 130], ivory: [160, 125, 125], steel: [88, 163, 121], sky: [0, 132, 134]};
const FLY = {navy: [-700, -900, -38], apricot: [800, -700, 42], ivory: [900, 500, -30], steel: [-200, 1100, 34], sky: [-900, 300, -46]};
export const PIECES = Object.keys(LOGO);

export function loadPieces(base = 'assets/design/') {
  return Promise.all([...PIECES, 'sand'].map(p => new Promise(ok => {const img = new Image(); img.onload = () => ok([p, img]); img.onerror = () => ok([p, null]); img.src = `${base}tri-${p}.png`;}))).then(Object.fromEntries);
}

/** `t` (0..1) assembles the pieces in a staggered flight; `at` (seconds) instead lands each piece on its hit in LOGO_HITS with a small pop. */
function logo(ctx, imgs, cx, cy, scale, t = 1, ring = 1, at = null) {
  PIECES.forEach((p, i) => {
    const img = imgs[p]; if (!img) return;
    const hit = LOGO_HITS.pieces[i], pop = at === null ? 1 : 1 + .14 * clamp(1 - Math.abs(at - hit) / .12);
    const [l, top, w] = LOGO[p], h = w * img.height / img.width, k = at === null ? easeInOut(span(t, i * .09, i * .09 + .55)) : easeOutBack(span(at, hit - LOGO_HITS.flight, hit));
    const [fx, fy, fr] = FLY[p];
    ctx.save();
    ctx.globalAlpha *= clamp(k * 3);
    ctx.translate(cx + ((l + w / 2 - 142) + fx * (1 - k)) * scale, cy + ((top + h / 2 - 148) + fy * (1 - k)) * scale);
    ctx.rotate(fr * (1 - k) * Math.PI / 180);
    ctx.scale(pop, pop); ctx.drawImage(img, -w / 2 * scale, -h / 2 * scale, w * scale, h * scale);
    ctx.restore();
  });
  if (ring > 0) {
    ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = Math.max(2, 7 * scale); ctx.lineCap = 'round'; ctx.globalAlpha *= .9;
    ctx.beginPath(); ctx.arc(cx, cy, 200 * scale, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * easeInOut(ring)); ctx.stroke(); ctx.restore();
  }
}

let grain;
function paper(ctx, t, color) {
  ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H);
  // Soft watercolour washes that drift slowly.
  const wash = (x, y, r, c, a) => {const g = ctx.createRadialGradient(x, y, r * .1, x, y, r); g.addColorStop(0, hexA(c, a)); g.addColorStop(.6, hexA(c, a * .45)); g.addColorStop(1, hexA(c, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);};
  wash(180 + Math.sin(t * .4) * 40, 260, 520, '#f6b18d', .28);
  wash(940, 640 + Math.cos(t * .3) * 50, 560, '#91b6d3', .26);
  wash(120, 1700 + Math.sin(t * .35) * 40, 600, color || '#91b6d3', .22);
  wash(960, 1780, 420, '#cdb8a2', .22);
  if (!grain) {
    grain = document.createElement('canvas'); grain.width = 256; grain.height = 256;
    const g = grain.getContext('2d'), d = g.createImageData(256, 256);
    for (let i = 0; i < d.data.length; i += 4) {const v = 120 + Math.random() * 100; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 14;}
    g.putImageData(d, 0, 0);
  }
  ctx.fillStyle = ctx.createPattern(grain, 'repeat'); ctx.fillRect(0, 0, W, H);
}
function hexA(hex, a) {const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;}

function lines(ctx, text, max) {
  const out = []; let line = '';
  for (const word of String(text).split(/\s+/)) {const next = line ? `${line} ${word}` : word; if (line && ctx.measureText(next).width > max) {out.push(line); line = word;} else line = next;}
  if (line) out.push(line);
  return out;
}
// Centred, wrapped text; shrinks the font until it fits in `maxLines`. Returns the bottom y.
function text(ctx, str, y, {size, font = SERIF, weight = '400', style = '', color = INK, max = W - 160, maxLines = 3, lh = 1.12, alpha = 1, rise = 0, spacing = 0}) {
  let s = size, ls;
  // Shrink until it fits the line count and no single long word runs past the edge.
  do {ctx.font = `${style} ${weight} ${s}px ${font}`; ls = lines(ctx, str, max); s -= 4;} while ((ls.length > maxLines || ls.some(l => ctx.measureText(l).width > max)) && s > 24);
  s += 4;
  ctx.save(); ctx.globalAlpha *= alpha; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  if (spacing && 'letterSpacing' in ctx) ctx.letterSpacing = `${spacing}px`;
  ls.forEach((l, i) => ctx.fillText(l, W / 2, y + i * s * lh + rise));
  ctx.restore();
  return y + (ls.length - 1) * s * lh;
}

function brush(ctx, x1, x2, y, color, k, alpha = 1) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= alpha * .75; ctx.strokeStyle = color; ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    ctx.lineWidth = 16 - i * 4; ctx.globalAlpha *= .8;
    ctx.beginPath(); ctx.moveTo(x1, y + i * 5);
    const x = x1 + (x2 - x1) * k;
    ctx.quadraticCurveTo((x1 + x) / 2, y - 10 + i * 6, x, y + 4 + i * 3); ctx.stroke();
  }
  ctx.restore();
}

function footer(ctx, imgs, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  logo(ctx, imgs, W / 2 - 70, H - 150, .2, 1, 1);
  ctx.fillStyle = INK; ctx.font = `400 52px ${SERIF}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText('Fem', W / 2 - 18, H - 148);
  ctx.restore();
}

// Scene lengths in seconds, on the beat of the song (120 BPM, 0.5 s per beat); each content scene
// got one more second so it is easier to read. The short cut lasts as long as the song. Scenes play back to back and cross-fade at the edges.
const CUTS = {
  short: [['hook', 5.0], ['name', 3.5], ['stat', 4.0], ['facet', 3.0], ['closer', 3.0], ['end', 5.0]],
  long: [['hook', 5.0], ['name', 4.0], ['traits', 6.5], ['stat', 4.5], ['facet', 4.0], ['combo', 5.5], ['strength', 4.5], ['closer', 3.5], ['end', 5.0]]
};
/** Scenes with start and end times for this script; skips the facet when there is none. */
export function timeline(s) {
  let at = 0;
  return CUTS[s.long ? 'long' : 'short'].filter(([id]) => id !== 'facet' || s.facet).map(([id, d]) => {const x = {id, start: at, end: at + d}; at += d; return x;});
}
export const duration = s => timeline(s).at(-1).end;

const scenes = {
  hook(ctx, lt, d, a, s) {
    text(ctx, s.hook, 1260, {size: 78, style: 'italic', alpha: Math.min(ease(span(lt, .5, 1.1)), a), rise: 30 * (1 - ease(span(lt, .5, 1.1)))});
  },
  name(ctx, lt, d, a, s) {
    const r = 40 * (1 - ease(span(lt, .1, .7)));
    text(ctx, s.intro, 760, {size: 64, color: MUTED, alpha: a, rise: r});
    const bottom = text(ctx, s.name, 920, {size: 132, alpha: Math.min(a, ease(span(lt, .3, .9))), rise: r, maxLines: 3, lh: 1.05, max: W - 140});
    brush(ctx, 260, 820, bottom + 70, '#f6b18d', ease(span(lt, .8, 1.6)), a);
  },
  traits(ctx, lt, d, a, s, imgs) {
    text(ctx, s.traitsTitle, 330, {size: 84, alpha: a});
    s.traits.forEach((x, i) => {
      const y = 520 + i * 220, k = ease(span(lt, .5 + i * .35, 1.6 + i * .35)), ra = a * ease(span(lt, .3 + i * .35, .8 + i * .35));
      ctx.save(); ctx.globalAlpha = ra;
      const img = imgs[x.piece]; if (img) {const w = 70, h = w * img.height / img.width; ctx.drawImage(img, 110, y - h / 2 - 34, w, h);}
      ctx.fillStyle = INK; ctx.font = `400 50px ${SERIF}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(x.name, 200, y - 34);
      ctx.font = `400 64px ${SERIF}`; ctx.textAlign = 'right'; ctx.fillText(String(Math.round(x.percentile * k)), W - 110, y - 30);
      const bx = 110, bw = W - 220;
      ctx.fillStyle = 'rgba(12,23,66,.1)'; roundRect(ctx, bx, y + 34, bw, 22, 11); ctx.fill();
      ctx.fillStyle = x.color; roundRect(ctx, bx, y + 34, Math.max(22, bw * x.percentile / 100 * k), 22, 11); ctx.fill();
      ctx.restore();
    });
    text(ctx, s.traitsNote, 1640, {size: 38, font: SANS, color: MUTED, alpha: a * ease(span(lt, 2.4, 3))});
  },
  stat(ctx, lt, d, a, s) {
    const k = ease(span(lt, .2, 1.8));
    text(ctx, s.stat.above, 360, {size: 70, alpha: a});
    text(ctx, String(Math.round(s.stat.number * k)), 700, {size: 330, alpha: a});
    text(ctx, s.stat.below, 820, {size: 62, alpha: a, color: MUTED, maxLines: 2});
    const lit = Math.round(s.stat.count * ease(span(lt, .4, 2.2))), gap = 62, x0 = W / 2 - gap * 4.5, y0 = 1000;
    ctx.save(); ctx.globalAlpha = a;
    for (let i = 0; i < 100; i++) {
      const on = i < lit, x = x0 + (i % 10) * gap, y = y0 + Math.floor(i / 10) * gap;
      ctx.beginPath(); ctx.arc(x, y, on ? 21 : 17, 0, Math.PI * 2); ctx.fillStyle = on ? s.color : 'rgba(12,23,66,.1)'; ctx.fill();
    }
    ctx.restore();
    text(ctx, s.stat.caption, 1660, {size: 44, font: SANS, color: MUTED, alpha: a * ease(span(lt, 1.6, 2.2))});
  },
  facet(ctx, lt, d, a, s) {
    const f = s.facet, r = 40 * (1 - ease(span(lt, 0, .6)));
    text(ctx, f.eyebrow.toUpperCase(), 640, {size: 40, font: SANS, weight: '700', color: '#d9764a', alpha: a, rise: r, spacing: 4});
    const bottom = text(ctx, f.name, 800, {size: 120, alpha: a, rise: r, maxLines: 2});
    const by = bottom + 170, bx = 170, bw = W - 340, k = ease(span(lt, .6, 1.6)) * f.percentile / 100;
    ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = 'rgba(12,23,66,.1)'; roundRect(ctx, bx, by - 14, bw, 28, 14); ctx.fill();
    ctx.fillStyle = f.color; roundRect(ctx, bx, by - 14, Math.max(28, bw * k), 28, 14); ctx.fill();
    ctx.beginPath(); ctx.arc(bx + Math.max(14, bw * k), by, 26, 0, Math.PI * 2); ctx.fillStyle = INK; ctx.fill();
    ctx.restore();
    text(ctx, f.caption, by + 130, {size: 48, font: SANS, color: MUTED, alpha: a});
  },
  combo(ctx, lt, d, a, s, imgs) {
    const c = s.combo, n = c.pieces.length;
    c.pieces.forEach((p, i) => {const img = imgs[p]; if (!img) return; const w = 150, h = w * img.height / img.width, k = easeInOut(span(lt, .1, 1.1)), x = W / 2 + (i - (n - 1) / 2) * 150 * k - w / 2;
      ctx.save(); ctx.globalAlpha = a; ctx.drawImage(img, x, 420 - h / 2, w, h); ctx.restore();});
    text(ctx, c.eyebrow.toUpperCase(), 640, {size: 40, font: SANS, weight: '700', color: '#d9764a', alpha: a, spacing: 4});
    text(ctx, s.name, 760, {size: 76, alpha: a, maxLines: 2});
    text(ctx, c.text, 980, {size: 62, alpha: a * ease(span(lt, .6, 1.2)), maxLines: 7, lh: 1.3, max: W - 200});
  },
  strength(ctx, lt, d, a, s) {
    const g = s.strength, r = 40 * (1 - ease(span(lt, 0, .6)));
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#f6b18d'; ctx.beginPath(); ctx.moveTo(W / 2, 470 + r); ctx.lineTo(W / 2 + 60, 570 + r); ctx.lineTo(W / 2 - 60, 570 + r); ctx.closePath(); ctx.fill(); ctx.restore();
    text(ctx, g.eyebrow.toUpperCase(), 680, {size: 40, font: SANS, weight: '700', color: '#d9764a', alpha: a, rise: r, spacing: 4});
    const bottom = text(ctx, g.title, 840, {size: 96, alpha: a, rise: r, maxLines: 3});
    text(ctx, g.text, bottom + 150, {size: 56, color: '#2c4566', alpha: a * ease(span(lt, .5, 1.1)), maxLines: 4, lh: 1.3});
  },
  closer(ctx, lt, d, a, s) {
    const k = ease(span(lt, 0, .7));
    text(ctx, '“', 720, {size: 220, color: s.color, alpha: a * .8});
    text(ctx, s.closer, 900, {size: 84, style: 'italic', alpha: a, rise: 30 * (1 - k), maxLines: 4, lh: 1.18, max: W - 200});
  },
  end(ctx, lt, d, a, s, imgs) {
    const k = ease(span(lt, 0, .5));
    ctx.save(); ctx.globalAlpha = k; logo(ctx, imgs, W / 2, 700, .95, span(lt, -.1, .8), span(lt, .2, 1)); ctx.restore();
    text(ctx, s.end, 1150, {size: 84, alpha: k, maxLines: 2, lh: 1.1, max: W - 100});
    text(ctx, s.cta, 1330, {size: 54, font: SANS, alpha: k});
    pill(ctx, s.button, 1470, k * ease(span(lt, .3, .8)));
    text(ctx, s.note, H - 130, {size: 36, font: SANS, color: MUTED, alpha: k});
  }
};

/** Draws the frame at time t (seconds). */
export function drawFrame(ctx, t, s, imgs) {
  const tl = timeline(s), at = id => tl.find(x => x.id === id), now = tl.find(x => t < x.end) || tl.at(-1);
  const color = {traits: '#f6b18d', facet: s.facet?.color, combo: '#cdb8a2', strength: '#f6b18d'}[now.id] || (['hook', 'name'].includes(now.id) ? '#91b6d3' : s.color);
  paper(ctx, t, color);
  // The logo assembles in the hook, then shrinks to the top while the name appears.
  const name = at('name');
  if (t < name.end) {
    const move = easeInOut(span(t, name.start - .5, name.start + .3));
    ctx.save(); ctx.globalAlpha = 1 - span(t, name.end - .4, name.end);
    logo(ctx, imgs, W / 2, 760 - 400 * move, 1.25 - .7 * move, 1, span(t, ...LOGO_HITS.ring), t);
    ctx.restore();
  }
  for (const sc of tl) {
    if (t < sc.start - .05 || t > sc.end + .05) continue;
    const last = sc === tl.at(-1), a = Math.min(sc.id === 'hook' ? 1 : ease(span(t, sc.start, sc.start + .45)), last ? 1 : 1 - span(t, sc.end - .35, sc.end));
    if (a > 0) scenes[sc.id](ctx, t - sc.start, sc.end - sc.start, a, s, imgs);
  }
  const closer = at('closer');
  footer(ctx, imgs, t > name.start + .1 && t < closer.end ? Math.min(ease(span(t, name.start + .1, name.start + .7)), 1 - span(t, closer.end - .4, closer.end)) : 0);
}
// A button-like address on the end card. A video cannot hold a link, so the address is what people type or search for.
function pill(ctx, label, y, a, scale = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  let size = 50 * scale; ctx.font = `700 ${size}px ${SANS}`;
  while (ctx.measureText(label).width > W - 260 && size > 22) {size -= 2; ctx.font = `700 ${size}px ${SANS}`;}
  const w = ctx.measureText(label).width + 110 * scale, h = 104 * scale;
  ctx.fillStyle = INK; roundRect(ctx, W / 2 - w / 2, y - h / 2, w, h, h / 2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, W / 2, y + 2);
  ctx.restore();
}
function roundRect(ctx, x, y, w, h, r) {ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();}

/** A still image that carries the same content: name, the standout number and the closing line. */
export function drawPoster(ctx, s, imgs) {
  paper(ctx, 3, s.color);
  logo(ctx, imgs, W / 2, 250, .55, 1, 1);
  text(ctx, s.intro, 540, {size: 56, color: MUTED});
  const b = text(ctx, s.name, 670, {size: 112, maxLines: 3, lh: 1.05});
  brush(ctx, 280, 800, b + 60, '#f6b18d', 1);
  const y = b + 200;
  text(ctx, s.stat.above, y, {size: 56});
  text(ctx, String(s.stat.number), y + 190, {size: 200});
  text(ctx, s.stat.below, y + 262, {size: 50, color: MUTED});
  if (s.facet) text(ctx, `${s.facet.name} · ${s.facet.caption.split(' · ')[0].toLowerCase()}`, y + 352, {size: 44, font: SANS, color: MUTED});
  text(ctx, s.closer, H - 400, {size: 60, style: 'italic', maxLines: 2});
  text(ctx, `${s.end} ${s.cta}`, H - 200, {size: 40, font: SANS, color: INK});
  pill(ctx, s.button, H - 110, 1, .8);
}

/** Best container this browser can record; MP4 first because Instagram and TikTok prefer it. With `audio`, a type that also carries sound. */
export function videoType(audio = false) {
  if (typeof MediaRecorder === 'undefined') return '';
  const types = audio
    ? ['video/mp4;codecs="avc1.42E01E,mp4a.40.2"', 'video/mp4;codecs=avc1,mp4a', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm']
    : ['video/mp4;codecs=avc1.42E01E', 'video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
  return types.find(t => MediaRecorder.isTypeSupported(t)) || '';
}

/** Records the clip in real time on `canvas`. Resolves to a Blob; onProgress gets 0..1.
 *  `audio` ({ctx, buffer, monitor}) adds the music: a running AudioContext, the rendered buffer and
 *  an optional node the person hears it through. */
const WARMUP = .4;
export function recordVideo(canvas, s, imgs, onProgress = () => {}, audio = null) {
  const type = videoType(Boolean(audio)) || videoType();
  if (!type || !canvas.captureStream) return Promise.reject(new Error('unsupported'));
  const total = duration(s), ctx = canvas.getContext('2d'), video = canvas.captureStream(30), parts = [];
  let src = null, tracks = video.getVideoTracks();
  if (audio) {
    const dest = audio.ctx.createMediaStreamDestination();
    src = audio.ctx.createBufferSource(); src.buffer = audio.buffer; src.connect(dest); if (audio.monitor) src.connect(audio.monitor);
    tracks = [...tracks, ...dest.stream.getAudioTracks()];
  }
  const stream = new MediaStream(tracks), rec = new MediaRecorder(stream, {mimeType: type, videoBitsPerSecond: 6e6, audioBitsPerSecond: 160e3});
  rec.ondataavailable = e => e.data.size && parts.push(e.data);
  return new Promise((resolve, reject) => {
    rec.onstop = () => {video.getTracks().forEach(x => x.stop()); stream.getTracks().forEach(x => x.stop()); resolve(new Blob(parts, {type: type.split(';')[0]}));};
    rec.onerror = e => {src?.stop(); reject(e.error || e);};
    drawFrame(ctx, 0, s, imgs);
    rec.start(250);
    // Give the encoder a moment on the first (empty) frame before the clock and the song start, so the
    // opening logo animation is not dropped while it warms up.
    let start = 0;
    const warm = performance.now() + WARMUP * 1000;
    const tick = now => {
      if (!start) {if (now < warm) {drawFrame(ctx, 0, s, imgs); requestAnimationFrame(tick); return;} start = now; src?.start();}
      const t = (now - start) / 1000;
      drawFrame(ctx, Math.min(t, total), s, imgs); onProgress(Math.min(1, t / total));
      if (t < total + .2) requestAnimationFrame(tick); else {try {src?.stop();} catch {} rec.stop();}
    };
    requestAnimationFrame(tick);
  });
}

/** Times the music follows: its length and, when the video is longer than the song, the scene change
 *  where the song starts again so that both passes fit (the last cut before the song would end). */
export function musicCues(s) {
  const tl = timeline(s), total = duration(s);
  if (total <= SONG.length + .5) return {total, restartAt: null};
  return {total, restartAt: tl.filter(x => x.start >= total - SONG.length && x.start <= SONG.length).at(-1)?.start ?? null};
}
