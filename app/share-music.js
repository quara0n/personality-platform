// Music for the share video, composed for Fem and synthesised in the browser, so there is no
// licence to clear and nothing to download. Light and upbeat: 120 BPM in D major over
// I–V–vi–IV (D, A, Bm, G), soft plucked arpeggios, a warm pad, a round bass and gentle drums.
// A five-note bell motif ("Fem" is five) opens the hook and resolves on the end card.
// The plan is a plain list of notes timed to the video's scenes; renderMusic() turns it into an
// AudioBuffer with an OfflineAudioContext, which needs no user gesture.
export const BPM = 120;
const BEAT = 60 / BPM, BAR = BEAT * 4;
const CHORDS = [
  {bass: 38, tones: [62, 66, 69]}, // D
  {bass: 45, tones: [61, 64, 69]}, // A
  {bass: 47, tones: [62, 66, 71]}, // Bm
  {bass: 43, tones: [62, 67, 71]}  // G
];
const MOTIF_UP = [81, 83, 86, 88, 90], MOTIF_HOME = [90, 88, 86, 83, 86];
const ARP = [0, 1, 2, 3, 2, 1, 2, 3];

/** Note events for a video of `total` seconds whose groove starts at `grooveAt` and end card at `endAt`. */
export function musicPlan(total, {grooveAt = 4, endAt = total - 5} = {}) {
  const ev = [], add = (type, t, dur, extra = {}) => {if (t >= 0 && t < total - .05) ev.push({type, t: +t.toFixed(4), dur: +Math.min(dur, total - t).toFixed(4), ...extra});};
  const bars = Math.ceil(endAt / BAR);
  for (let b = 0; b < bars; b++) {
    const c = CHORDS[b % 4], t0 = b * BAR;
    c.tones.forEach(m => add('pad', t0, Math.min(BAR, endAt - t0) + .1, {midi: m}));
    if (t0 + BAR <= grooveAt + .01) continue;
    for (let i = 0; i < 8; i++) {
      const t = t0 + i * BEAT / 2; if (t < grooveAt || t >= endAt) continue;
      const tones = [...c.tones, c.tones[0] + 12];
      add('pluck', t, BEAT, {midi: tones[ARP[i]] + 12, pan: i % 2 ? .35 : -.35});
      if (t + BEAT / 4 < endAt) add('hat', t + BEAT / 4, .05);
    }
    for (let i = 0; i < 4; i++) {
      const t = t0 + i * BEAT; if (t < grooveAt || t >= endAt) continue;
      if (i % 2 === 0) {add('kick', t, .3); add('bass', t, BEAT * 1.5, {midi: c.bass});}
      else {add('clap', t, .15); add('bass', t + BEAT / 2, BEAT / 2, {midi: c.bass + 12});}
    }
  }
  // A small lift into the groove, then the motif on top of the hook.
  add('swell', Math.max(0, grooveAt - 1.6), 1.6);
  MOTIF_UP.forEach((m, i) => add('bell', .3 + i * BEAT / 2, i === 4 ? 2 : .8, {midi: m}));
  // End card: drums stop, the motif comes home and the D chord rings out.
  [50, 62, 66, 69, 74].forEach(m => add('pad', endAt, total - endAt, {midi: m, end: true}));
  add('bass', endAt, total - endAt, {midi: 38, end: true});
  MOTIF_HOME.forEach((m, i) => add('bell', endAt + .15 + i * BEAT / 2, i === 4 ? 3 : .8, {midi: m}));
  return ev.sort((a, b) => a.t - b.t);
}

const hz = m => 440 * 2 ** ((m - 69) / 12);

/** Renders the plan to a stereo AudioBuffer of `total` seconds. */
export async function renderMusic(total, opts = {}) {
  const Offline = globalThis.OfflineAudioContext || globalThis.webkitOfflineAudioContext;
  if (!Offline) throw new Error('no-audio');
  const rate = 44100, ac = new Offline(2, Math.ceil(total * rate), rate);
  // Seeded noise so every render is the same.
  let seed = 7;
  const noise = ac.createBuffer(1, rate, rate), nd = noise.getChannelData(0);
  for (let i = 0; i < nd.length; i++) {seed = (seed * 1103515245 + 12345) % 2147483648; nd[i] = seed / 1073741824 - 1;}

  const master = ac.createGain(), comp = ac.createDynamicsCompressor();
  comp.threshold.value = -20; comp.ratio.value = 4; comp.attack.value = .01; comp.release.value = .2;
  // A second, fast compressor catches peaks so the louder mix never clips.
  const limit = ac.createDynamicsCompressor(), out = ac.createGain();
  limit.threshold.value = -4; limit.knee.value = 0; limit.ratio.value = 20; limit.attack.value = .002; limit.release.value = .1; out.gain.value = 1.5;
  master.connect(comp); comp.connect(out); out.connect(limit); limit.connect(ac.destination);
  master.gain.setValueAtTime(0, 0); master.gain.linearRampToValueAtTime(.9, .25);
  master.gain.setValueAtTime(.9, Math.max(.3, total - 1.8)); master.gain.linearRampToValueAtTime(0, total);

  // A dotted-eighth echo gives the plucks and bells some air.
  const echo = ac.createDelay(1), fb = ac.createGain(), tone = ac.createBiquadFilter(), send = ac.createGain();
  echo.delayTime.value = BEAT * .75; fb.gain.value = .3; tone.type = 'lowpass'; tone.frequency.value = 3200; send.gain.value = .35;
  send.connect(echo); echo.connect(tone); tone.connect(fb); fb.connect(echo); tone.connect(master);

  const env = (g, t, a, peak, d, hold = 0) => {g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); if (hold) g.gain.setValueAtTime(peak, t + a + hold); g.gain.exponentialRampToValueAtTime(.0001, t + a + hold + d); g.gain.linearRampToValueAtTime(0, t + a + hold + d + .02);};
  const osc = (type, f, t, end, out, detune = 0) => {const o = ac.createOscillator(); o.type = type; o.frequency.value = f; o.detune.value = detune; o.connect(out); o.start(t); o.stop(end); return o;};
  const noiseHit = (t, filterType, freq, peak, d, q = 1) => {
    const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = noise; f.type = filterType; f.frequency.value = freq; f.Q.value = q;
    s.connect(f); f.connect(g); g.connect(master); env(g, t, .002, peak, d); s.start(t, (t * 7.3) % .5); s.stop(t + d + .05);
    return {g, f};
  };

  const play = {
    pad({t, dur, midi, end}) {
      const g = ac.createGain(), f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = end ? 1400 : 1000; f.Q.value = .5;
      f.connect(g); g.connect(master);
      // The end chord holds through the end card and fades with the master.
      const peak = end ? .05 : .035, rel = end ? 1.4 : .7;
      env(g, t, end ? .08 : .45, peak, rel, end ? Math.max(0, dur - 1.6) : Math.max(0, dur - .9));
      [-7, 7].forEach(d => osc('sawtooth', hz(midi), t, t + dur + 1, f, d));
    },
    pluck({t, midi, pan = 0}) {
      const g = ac.createGain(), p = ac.createStereoPanner(); p.pan.value = pan;
      g.connect(p); p.connect(master); p.connect(send); env(g, t, .004, .07, .32);
      osc('triangle', hz(midi), t, t + .45, g); osc('sine', hz(midi) * 2, t, t + .45, g);
    },
    bass({t, dur, midi, end}) {
      const g = ac.createGain(); g.connect(master); env(g, t, .01, end ? .12 : .26, end ? dur : dur * .9);
      osc('sine', hz(midi), t, t + dur + .1, g); osc('triangle', hz(midi), t, t + dur + .1, g);
    },
    kick({t}) {
      const g = ac.createGain(), o = ac.createOscillator(); o.type = 'sine'; g.connect(master);
      o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(42, t + .12);
      env(g, t, .003, .55, .28); o.connect(g); o.start(t); o.stop(t + .35);
    },
    hat({t}) {noiseHit(t, 'highpass', 7500, .045, .05);},
    clap({t}) {noiseHit(t, 'bandpass', 1600, .1, .14, .8);},
    swell({t, dur}) {
      const {g, f} = noiseHit(t, 'bandpass', 600, .001, .01, 1.2);
      g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.05, t + dur - .05); g.gain.linearRampToValueAtTime(0, t + dur);
      f.frequency.setValueAtTime(400, t); f.frequency.exponentialRampToValueAtTime(5000, t + dur);
      const s = ac.createBufferSource(); s.buffer = noise; s.connect(f); s.start(t); s.stop(t + dur);
    },
    bell({t, dur, midi}) {
      const g = ac.createGain(); g.connect(master); g.connect(send); env(g, t, .003, .06, dur);
      [[1, 1], [2.76, .3], [5.4, .1]].forEach(([k, a]) => {const h = ac.createGain(); h.gain.value = a; h.connect(g); osc('sine', hz(midi) * k, t, t + dur + .1, h);});
    }
  };
  musicPlan(total, opts).forEach(e => play[e.type](e));
  return ac.startRendering();
}
