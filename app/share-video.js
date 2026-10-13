// Shareable profile video: a 14-second vertical clip (1080 × 1920) for Stories, Reels and TikTok.
// Hook, profile name, the trait furthest from the middle as "more X than N of 100", the facet that
// stands out most (already open in the free profile), a light closing line and an end card.
// Everything is drawn on a canvas and recorded in the browser; nothing is uploaded.
// Closing lines are editorial, kind in both directions and never mock a score; they follow the
// same trait as the profile name's noun, so they stay traceable to the result.
import {traitColors} from './design-copy.js';
import {extremity} from './scoring.js';
import {shownPercentile} from './norms.js';
import {profileName} from './profile-name.js';

export const W = 1080, H = 1920, DURATION = 14;
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
export function videoScript(domains, {language, firstName = '', name, site = ''}) {
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
  return {
    language,
    hook: first ? tr(`Who is ${first}, really?`, `Hvem er ${first}, egentlig?`) : tr('120 questions later …', '120 spørsmål senere …'),
    intro: first ? tr(`${first} is`, `${first} er`) : tr('This is', 'Dette er'),
    name: named.name,
    trait: trait.code,
    color: traitColors[trait.code],
    stat,
    facet: facet ? {eyebrow: tr('The facet that stands out most', 'Fasetten som skiller seg mest ut'), name: facet.name, caption: tr(`Percentile ${pct(facet)} · ${name(facetTrait)}`, `Persentil ${pct(facet)} · ${name(facetTrait)}`), percentile: pct(facet), color: traitColors[facetTrait.code]} : null,
    closer: pick(named.traits.length ? closers[trait.code][band] : closers.balanced, language),
    end: tr("What's yours?", 'Hva er din?'),
    cta: tr('Take the free Big Five test', 'Ta den gratis Big Five-testen'),
    site,
    note: tr('Self-reflection, not a diagnosis.', 'Selvrefleksjon, ikke en diagnose.'),
    ruleId: `share-video-v1/${trait.code}${band[0]}/${named.ruleId}`
  };
}

// ---------- drawing ----------
const clamp = t => Math.min(1, Math.max(0, t));
const ease = t => 1 - Math.pow(1 - clamp(t), 3);
const easeInOut = t => {t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;};
const span = (t, a, b) => clamp((t - a) / (b - a));
// Fade in over `inn` after a, out over `out` before b.
const life = (t, a, b, inn = .45, out = .35) => Math.min(ease(span(t, a, a + inn)), 1 - span(t, b - out, b));

// Assembled logo from the loading screen (285 × 288 box), piece name → [left, top, width].
const LOGO = {navy: [5, 18, 119], apricot: [129, 0, 130], ivory: [160, 125, 125], steel: [88, 163, 121], sky: [0, 132, 134]};
const FLY = {navy: [-700, -900, -38], apricot: [800, -700, 42], ivory: [900, 500, -30], steel: [-200, 1100, 34], sky: [-900, 300, -46]};
export const PIECES = Object.keys(LOGO);

export function loadPieces(base = 'assets/design/') {
  return Promise.all(PIECES.map(p => new Promise(ok => {const img = new Image(); img.onload = () => ok([p, img]); img.onerror = () => ok([p, null]); img.src = `${base}tri-${p}.png`;}))).then(Object.fromEntries);
}

function logo(ctx, imgs, cx, cy, scale, t = 1, ring = 1) {
  PIECES.forEach((p, i) => {
    const img = imgs[p]; if (!img) return;
    const [l, top, w] = LOGO[p], h = w * img.height / img.width, k = easeInOut(span(t, i * .09, i * .09 + .55));
    const [fx, fy, fr] = FLY[p];
    ctx.save();
    ctx.globalAlpha *= clamp(k * 3);
    ctx.translate(cx + ((l + w / 2 - 142) + fx * (1 - k)) * scale, cy + ((top + h / 2 - 148) + fy * (1 - k)) * scale);
    ctx.rotate(fr * (1 - k) * Math.PI / 180);
    ctx.drawImage(img, -w / 2 * scale, -h / 2 * scale, w * scale, h * scale);
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
  do {ctx.font = `${style} ${weight} ${s}px ${font}`; ls = lines(ctx, str, max); s -= 4;} while (ls.length > maxLines && s > 24);
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

/** Draws the frame at time t (seconds). */
export function drawFrame(ctx, t, s, imgs) {
  const sceneColor = t < 5 ? '#91b6d3' : t < 8.4 ? s.color : t < 10.6 ? (s.facet?.color || s.color) : s.color;
  paper(ctx, t, sceneColor);

  // 1. Hook: the pieces fly together into the logo.
  const hookA = 1 - span(t, 1.9, 2.4);
  if (t < 5) {
    const move = easeInOut(span(t, 2.0, 2.8));
    ctx.save(); ctx.globalAlpha = t > 4.6 ? 1 - span(t, 4.6, 5) : 1;
    logo(ctx, imgs, W / 2, 760 - 400 * move, 1.25 - .7 * move, span(t, 0, 1.5), span(t, 1.1, 1.9));
    ctx.restore();
  }
  if (hookA > 0) text(ctx, s.hook, 1260, {size: 78, style: 'italic', alpha: Math.min(ease(span(t, .5, 1.1)), hookA), rise: 30 * (1 - ease(span(t, .5, 1.1)))});

  // 2. Profile name.
  const nameA = life(t, 2.5, 5.1);
  if (nameA > 0) {
    const r = 40 * (1 - ease(span(t, 2.5, 3.1)));
    text(ctx, s.intro, 760, {size: 64, color: MUTED, alpha: nameA, rise: r});
    const bottom = text(ctx, s.name, 920, {size: 132, alpha: Math.min(nameA, ease(span(t, 2.8, 3.4))), rise: r, maxLines: 3, lh: 1.05, max: W - 140});
    brush(ctx, 260, 820, bottom + 70, '#f6b18d', ease(span(t, 3.3, 4.1)), nameA);
  }

  // 3. The standout percentile, with 100 dots.
  const statA = life(t, 5.0, 8.5);
  if (statA > 0) {
    const k = ease(span(t, 5.2, 6.8));
    text(ctx, s.stat.above, 360, {size: 70, alpha: statA});
    text(ctx, String(Math.round(s.stat.number * k)), 700, {size: 330, alpha: statA, color: INK});
    text(ctx, s.stat.below, 820, {size: 62, alpha: statA, color: MUTED, maxLines: 2});
    const lit = Math.round(s.stat.count * ease(span(t, 5.4, 7.2))), gap = 62, x0 = W / 2 - gap * 4.5, y0 = 1000;
    ctx.save(); ctx.globalAlpha = statA;
    for (let i = 0; i < 100; i++) {
      const on = i < lit, x = x0 + (i % 10) * gap, y = y0 + Math.floor(i / 10) * gap;
      ctx.beginPath(); ctx.arc(x, y, on ? 21 : 17, 0, Math.PI * 2); ctx.fillStyle = on ? s.color : 'rgba(12,23,66,.1)'; ctx.fill();
    }
    ctx.restore();
    text(ctx, s.stat.caption, 1660, {size: 44, font: SANS, color: MUTED, alpha: statA * ease(span(t, 6.6, 7.2))});
  }

  // 4. The facet that stands out most.
  const facetA = s.facet ? life(t, 8.4, 10.7) : 0;
  if (facetA > 0) {
    const f = s.facet, r = 40 * (1 - ease(span(t, 8.4, 9)));
    text(ctx, f.eyebrow.toUpperCase(), 640, {size: 40, font: SANS, weight: '700', color: '#d9764a', alpha: facetA, rise: r, spacing: 4});
    const bottom = text(ctx, f.name, 800, {size: 120, alpha: facetA, rise: r, maxLines: 2});
    const by = bottom + 170, bx = 170, bw = W - 340, k = ease(span(t, 9.0, 10.0)) * f.percentile / 100;
    ctx.save(); ctx.globalAlpha = facetA;
    ctx.fillStyle = 'rgba(12,23,66,.1)'; roundRect(ctx, bx, by - 14, bw, 28, 14); ctx.fill();
    ctx.fillStyle = f.color; roundRect(ctx, bx, by - 14, Math.max(28, bw * k), 28, 14); ctx.fill();
    ctx.beginPath(); ctx.arc(bx + Math.max(14, bw * k), by, 26, 0, Math.PI * 2); ctx.fillStyle = INK; ctx.fill();
    ctx.restore();
    text(ctx, f.caption, by + 130, {size: 48, font: SANS, color: MUTED, alpha: facetA});
  }

  // 5. The light closing line.
  const jokeA = life(t, 10.6, 12.5);
  if (jokeA > 0) {
    const k = ease(span(t, 10.6, 11.3));
    text(ctx, '“', 720, {size: 220, color: s.color, alpha: jokeA * .8});
    text(ctx, s.closer, 900, {size: 84, style: 'italic', alpha: jokeA, rise: 30 * (1 - k), maxLines: 4, lh: 1.18, max: W - 200});
  }

  footer(ctx, imgs, t > 2.6 && t < 12.5 ? Math.min(ease(span(t, 2.6, 3.2)), 1 - span(t, 12.1, 12.5)) : 0);

  // 6. End card.
  const endA = ease(span(t, 12.4, 12.9));
  if (endA > 0) {
    ctx.save(); ctx.globalAlpha = endA;
    logo(ctx, imgs, W / 2, 700, .95, span(t, 12.3, 13.2), span(t, 12.6, 13.4));
    ctx.restore();
    text(ctx, s.end, 1150, {size: 110, alpha: endA});
    text(ctx, s.cta, 1260, {size: 50, font: SANS, color: INK, alpha: endA});
    if (s.site) text(ctx, s.site, 1340, {size: 46, font: SANS, weight: '700', color: '#d9764a', alpha: endA});
    text(ctx, s.note, H - 130, {size: 36, font: SANS, color: MUTED, alpha: endA});
  }
}
function roundRect(ctx, x, y, w, h, r) {ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();}

/** A still image that carries the same content: name, the standout number and the closing line. */
export function drawPoster(ctx, s, imgs) {
  paper(ctx, 3, s.color);
  logo(ctx, imgs, W / 2, 300, .55, 1, 1);
  text(ctx, s.intro, 600, {size: 56, color: MUTED});
  const b = text(ctx, s.name, 730, {size: 112, maxLines: 3, lh: 1.05});
  brush(ctx, 280, 800, b + 60, '#f6b18d', 1);
  const y = b + 240;
  text(ctx, s.stat.above, y, {size: 56});
  text(ctx, String(s.stat.number), y + 220, {size: 230});
  text(ctx, s.stat.below, y + 300, {size: 50, color: MUTED});
  if (s.facet) text(ctx, `${s.facet.name} · ${s.facet.caption.split(' · ')[0].toLowerCase()}`, y + 410, {size: 44, font: SANS, color: MUTED});
  text(ctx, s.closer, H - 330, {size: 60, style: 'italic', maxLines: 3});
  text(ctx, `Fem · ${s.end}${s.site ? `  ${s.site}` : ''}`, H - 110, {size: 40, font: SANS, color: INK});
}

/** Best container this browser can record; MP4 first because Instagram and TikTok prefer it. */
export function videoType() {
  if (typeof MediaRecorder === 'undefined') return '';
  return ['video/mp4;codecs=avc1.42E01E', 'video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find(t => MediaRecorder.isTypeSupported(t)) || '';
}

/** Records the clip in real time on `canvas`. Resolves to a Blob; onProgress gets 0..1. */
export function recordVideo(canvas, s, imgs, onProgress = () => {}) {
  const type = videoType();
  if (!type || !canvas.captureStream) return Promise.reject(new Error('unsupported'));
  const ctx = canvas.getContext('2d'), stream = canvas.captureStream(30), rec = new MediaRecorder(stream, {mimeType: type, videoBitsPerSecond: 6e6}), parts = [];
  rec.ondataavailable = e => e.data.size && parts.push(e.data);
  return new Promise((resolve, reject) => {
    rec.onstop = () => {stream.getTracks().forEach(x => x.stop()); resolve(new Blob(parts, {type: type.split(';')[0]}));};
    rec.onerror = e => reject(e.error || e);
    drawFrame(ctx, 0, s, imgs);
    rec.start(250);
    const start = performance.now();
    const tick = now => {
      const t = (now - start) / 1000;
      drawFrame(ctx, Math.min(t, DURATION), s, imgs); onProgress(Math.min(1, t / DURATION));
      if (t < DURATION + .2) requestAnimationFrame(tick); else rec.stop();
    };
    requestAnimationFrame(tick);
  });
}
