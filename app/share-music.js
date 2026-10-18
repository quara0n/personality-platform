// Music for the share video: «Who Are You?», Rune's own song for Kaleido (120 BPM, about 23 s).
// The short cut is timed to the song, so the end card arrives as the song ends. The long cut plays
// the song from the start, then starts it again at a scene change, on a beat, so that the song ends
// together with the video.
// songPlan() is the pure timing; renderMusic() mixes it to an AudioBuffer with an OfflineAudioContext,
// which needs no user gesture.
export const SONG = {src: 'assets/audio/who-are-you.mp3', length: 23.232, beat: .5};
const FADE = .06;

/** Song pieces for a video of `total` seconds: [{at, from, dur}] in seconds. `restartAt` starts a second pass. */
export function songPlan(total, {restartAt = null, length = SONG.length} = {}) {
  if (!restartAt || restartAt > length || total <= length) return [{at: 0, from: 0, dur: Math.min(total, length)}];
  const rest = total - restartAt, from = Math.max(0, Math.floor((length - rest) / SONG.beat) * SONG.beat);
  return [{at: 0, from: 0, dur: restartAt}, {at: restartAt, from, dur: Math.min(rest, length - from)}];
}

let song;
/** Fetches and decodes the song once; `ac` is any AudioContext (decoding works while it is suspended). */
export function loadSong(ac, base = '') {
  song ||= fetch(base + SONG.src).then(r => {if (!r.ok) throw new Error('song'); return r.arrayBuffer();}).then(b => new Promise((ok, no) => ac.decodeAudioData(b, ok, no)));
  song.catch(() => {song = null;});
  return song;
}

/** Mixes the plan into a stereo AudioBuffer of `total` seconds. */
export async function renderMusic(buffer, total, opts = {}) {
  const Offline = globalThis.OfflineAudioContext || globalThis.webkitOfflineAudioContext;
  if (!Offline) throw new Error('no-audio');
  const rate = buffer.sampleRate, ac = new Offline(2, Math.ceil(total * rate), rate), master = ac.createGain();
  master.connect(ac.destination);
  master.gain.setValueAtTime(1, Math.max(0, total - .8)); master.gain.linearRampToValueAtTime(0, total);
  songPlan(total, {...opts, length: buffer.duration}).forEach(({at, from, dur}, i) => {
    const src = ac.createBufferSource(), g = ac.createGain();
    src.buffer = buffer; src.connect(g); g.connect(master);
    g.gain.setValueAtTime(i ? 0 : 1, at); if (i) g.gain.linearRampToValueAtTime(1, at + FADE);
    g.gain.setValueAtTime(1, Math.max(at, at + dur - FADE)); g.gain.linearRampToValueAtTime(0, at + dur);
    src.start(at, from, dur);
  });
  return ac.startRendering();
}
