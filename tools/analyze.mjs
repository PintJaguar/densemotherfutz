/**
 * Analyse a finished track into per-frame features a film reads in seek(t).
 *
 *   node analyze.mjs <track.(wav|mp3|flac)> --film ../films/<name> [--fps 30] [--bpm 128] [--downbeat 0.05]
 *
 * --downbeat pins the time (s) of any bar's "one". With a straight four-on-the-floor all
 * four beats carry the same kick, so the automatic choice is a guess; set it by ear.
 *
 * Writes into the film folder:
 *   track.wav     48 kHz stereo 16-bit copy of the track (render.mjs muxes it)
 *   features.js   window.FEATURES = {...}, loaded by <script src> so file:// works
 *   features.json same data, for inspection
 *
 * Everything here runs once, offline. The film never analyses audio at runtime, so
 * seek(t) stays pure and a frame at t is the same in the player, shoot and render.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { args } from './lib/browser.mjs';
import { FFMPEG } from './lib/ffmpeg.mjs';

const a = args(process.argv.slice(2));
const src = a._[0];
if (!src || !a.film) {
  console.error('usage: node analyze.mjs <track> --film ../films/<name> [--fps 30] [--bpm 128] [--downbeat 0.05]');
  process.exit(1);
}
const FPS = Number(a.fps || 30), SR = 48000, HOP = SR / FPS, N = 4096;
const filmDir = path.resolve(a.film);
fs.mkdirSync(filmDir, { recursive: true });

// ── decode ─────────────────────────────────────────────────────────────────
const wavOut = path.join(filmDir, 'track.wav');
let r = spawnSync(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-i', src, '-ar', String(SR), '-ac', '2', '-c:a', 'pcm_s16le', '-y', wavOut]);
if (r.status) throw Error(`ffmpeg failed: ${r.stderr}`);
r = spawnSync(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-i', src, '-ar', String(SR), '-ac', '1', '-f', 'f32le', '-'], { maxBuffer: 2 ** 31 });
if (r.status) throw Error(`ffmpeg failed: ${r.stderr}`);
const pcm = new Float32Array(r.stdout.buffer, r.stdout.byteOffset, r.stdout.byteLength / 4);
const duration = pcm.length / SR;
const NF = Math.floor(duration * FPS);
console.log(`${path.basename(src)}: ${duration.toFixed(2)} s, ${NF} frames @ ${FPS} fps`);

// ── spectrum per frame ─────────────────────────────────────────────────────
function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = -2 * Math.PI / len, wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const a = i + k, b = a + len / 2;
        const tr = re[b] * cr - im[b] * ci, ti = re[b] * ci + im[b] * cr;
        re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
        const nr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = nr;
      }
    }
  }
}
// Bands chosen for electronic music: sub and kick body sit below 150 Hz, snare/clap
// body 150-400 Hz with crack at 1.5-5 kHz, hats and risers above 6 kHz.
const BANDS = { sub: [25, 60], kick: [40, 130], bass: [60, 250], lowmid: [250, 800], mid: [800, 2500], snare: [1500, 5000], high: [6000, 16000] };
const hz = k => k * SR / N;
const bandBins = Object.fromEntries(Object.entries(BANDS).map(([k, [lo, hi]]) =>
  [k, [Math.max(1, Math.round(lo * N / SR)), Math.round(hi * N / SR)]]));
const win = Float32Array.from({ length: N }, (_, i) => 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (N - 1)));
const band = Object.fromEntries(Object.keys(BANDS).map(k => [k, new Float32Array(NF)]));
const flux = Object.fromEntries(Object.keys(BANDS).map(k => [k, new Float32Array(NF)]));
const rms = new Float32Array(NF), centroid = new Float32Array(NF), lowPow = new Float32Array(NF), highPow = new Float32Array(NF);
let prev = new Float32Array(N / 2);
const re = new Float64Array(N), im = new Float64Array(N);
for (let f = 0; f < NF; f++) {
  const c = Math.round(f * HOP + HOP / 2) - N / 2;   // window centred on the frame's span
  let s2 = 0;
  for (let i = 0; i < N; i++) {
    const x = pcm[c + i] || 0; re[i] = x * win[i]; im[i] = 0; s2 += x * x;
  }
  rms[f] = Math.sqrt(s2 / N);
  fft(re, im);
  const mag = new Float32Array(N / 2);
  let num = 0, den = 0;
  for (let k = 1; k < N / 2; k++) {
    const p = re[k] * re[k] + im[k] * im[k];
    if (k >= bandBins.kick[0] && k <= bandBins.kick[1]) lowPow[f] += p; else if (k > bandBins.kick[1]) highPow[f] += p;
    mag[k] = Math.log1p(40 * Math.sqrt(p)); num += hz(k) * mag[k]; den += mag[k];
  }
  centroid[f] = den ? num / den : 0;
  for (const [name, [lo, hi]] of Object.entries(bandBins)) {
    let e = 0, d = 0;
    for (let k = lo; k <= hi; k++) { e += mag[k]; d += Math.max(0, mag[k] - prev[k]); }
    band[name][f] = e / (hi - lo + 1); flux[name][f] = d / (hi - lo + 1);
  }
  prev = mag;
}

// ── helpers ────────────────────────────────────────────────────────────────
const pct = (arr, p) => { const s = Float32Array.from(arr).sort(); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
const norm = (arr, lo = 0.05, hi = 0.98) => { const a = pct(arr, lo), b = pct(arr, hi) || 1; return arr.map(v => Math.max(0, Math.min(1, (v - a) / (b - a || 1)))); };
const smooth = (arr, sec) => { // centred box blur, 2 passes ≈ triangle
  let x = Float32Array.from(arr); const w = Math.max(1, Math.round(sec * FPS / 2));
  for (let pass = 0; pass < 2; pass++) {
    const y = new Float32Array(x.length); let acc = 0, n = 0;
    for (let i = -w; i < x.length + w; i++) {
      if (i + w < x.length) { acc += x[i + w]; n++; }
      if (i - w - 1 >= 0) { acc -= x[i - w - 1]; n--; }
      if (i >= 0 && i < x.length) y[i] = acc / n;
    }
    x = y;
  }
  return x;
};
const q = arr => Array.from(arr, v => Math.round(v * 1000) / 1000);

// Peak picking with an adaptive threshold: a hit must stand out from its own
// local neighbourhood, so quiet intros still produce kicks and loud drops do not
// turn every frame into one.
function onsets(env, { minGap, k = 1.4, floor = 0.08 }) {
  const loc = smooth(env, 1.0), out = [], strength = [];
  let last = -1e9;
  for (let f = 1; f < env.length - 1; f++) {
    if (env[f] < env[f - 1] || env[f] < env[f + 1]) continue;
    if (env[f] < loc[f] * k || env[f] < floor) continue;
    const t = f / FPS;
    if (t - last < minGap) {
      if (strength.length && env[f] > strength.at(-1)) { out[out.length - 1] = t; strength[strength.length - 1] = env[f]; last = t; }
      continue;
    }
    out.push(t); strength.push(env[f]); last = t;
  }
  const top = pct(strength, 0.95) || 1;
  return out.map((t, i) => [Math.round(t * 1000) / 1000, Math.round(Math.min(1, strength[i] / top) * 100) / 100]);
}

// ── continuous envelopes (0..1) ────────────────────────────────────────────
const env = {
  loud: norm(smooth(rms, 0.1)),
  sub: norm(band.sub), bass: norm(band.bass), kickBand: norm(band.kick),
  lowmid: norm(band.lowmid), mid: norm(band.mid), high: norm(band.high),
  bright: norm(smooth(centroid, 0.25)),
};
// "Drama": long-horizon energy. Slow enough to carry a section, fast enough to
// dip in a breakdown. Build = rising energy plus rising highs (risers, snare rolls).
env.energy = norm(smooth(Float32Array.from(env.loud, (v, i) => 0.5 * v + 0.3 * env.bass[i] + 0.2 * env.high[i]), 3));
const slope = new Float32Array(NF), L = Math.round(6 * FPS), highS = smooth(env.high, 2);
for (let f = 0; f < NF; f++) {
  const b = Math.max(0, f - L);
  slope[f] = Math.max(0, env.energy[f] - env.energy[b]) + 0.5 * Math.max(0, highS[f] - highS[b]);
}
env.build = norm(smooth(slope, 1.5), 0.5, 0.99);

// ── hits ───────────────────────────────────────────────────────────────────
// Kick: rise in *linear* 40-130 Hz power. Log magnitudes let broadband noise (hats,
// claps, risers) lift the low bins too; linear power is dominated by the kick body.
const lowDb = Float32Array.from(lowPow, v => Math.sqrt(v));
const kickOdf = Float32Array.from(lowDb, (v, i) => Math.max(0, v - (lowDb[i - 1] ?? v)));
const kick = onsets(norm(kickOdf, 0.5, 0.99), { minGap: 0.2, k: 2.0, floor: 0.2 });
const snare = onsets(norm(Float32Array.from(flux.snare, (v, i) => v + 0.6 * flux.lowmid[i])), { minGap: 0.15, k: 1.6, floor: 0.2 });
const hat = onsets(norm(flux.high), { minGap: 0.06, k: 1.3, floor: 0.12 });

// ── tempo and beat grid ────────────────────────────────────────────────────
const odf = Float32Array.from(flux.kick, (v, i) => 1.5 * v + flux.snare[i] + 0.5 * flux.high[i]);
let bpm = Number(a.bpm) || 0;
if (!bpm) {
  let best = 0;
  for (let b = 70; b <= 180; b += 0.1) {
    const lag = 60 * FPS / b; let s = 0;
    for (let f = 0; f + lag * 4 < NF - 2; f++) {
      const g = x => { const i = Math.floor(x), u = x - i; return odf[i] * (1 - u) + odf[i + 1] * u; };
      s += odf[f] * (g(f + lag) + 0.5 * g(f + 2 * lag) + 0.5 * g(f + 4 * lag));
    }
    // Mild preference for club tempi so half/double time does not win on ties.
    s *= Math.exp(-(((b - 128) / 60) ** 2));
    if (s > best) { best = s; bpm = b; }
  }
  // Refine: a 0.5 BPM error drifts a third of a beat per minute, so fit the grid finely.
  const coarse = bpm; let bestFit = -1;
  for (let b = coarse - 0.6; b <= coarse + 0.6; b += 0.01) {
    const L2 = 60 / b;
    for (let p = 0; p < L2; p += 1 / (FPS * 2)) {
      let s = 0;
      for (let t = p; t < duration - 0.1; t += L2) { const x = t * FPS, i = Math.floor(x), u = x - i; s += odf[i] * (1 - u) + odf[i + 1] * u; }
      if (s > bestFit) { bestFit = s; bpm = b; }
    }
  }
  bpm = Math.round(bpm * 100) / 100;
}
if (!(bpm > 0)) throw Error("tempo estimate failed; pass --bpm");
const beatLen = 60 / bpm;
let phase = 0, bestPhase = -1;
for (let p = 0; p < beatLen; p += 1 / (FPS * 4)) {
  let s = 0;
  for (let t = p; t < duration; t += beatLen) s += odf[Math.round(t * FPS)] || 0;
  if (s > bestPhase) { bestPhase = s; phase = p; }
}
// Downbeat: which of the four beat positions carries the most kick energy.
let bar0 = 0, bestBar = -1;
for (let o = 0; o < 4; o++) {
  let s = 0;
  for (let t = phase + o * beatLen; t < duration; t += 4 * beatLen) s += (env.kickBand[Math.round(t * FPS)] || 0) + (env.energy[Math.round(t * FPS)] || 0) * 0.2;
  if (s > bestBar) { bestBar = s; bar0 = o; }
}
const db = a.downbeat !== undefined ? Number(a.downbeat) : phase + bar0 * beatLen;
if (!Number.isFinite(db)) throw Error('--downbeat must be a time in seconds');
const firstDownbeat = db - 4 * beatLen * Math.ceil(db / (4 * beatLen) - 1e-9);

// ── sections and drops ─────────────────────────────────────────────────────
// Novelty: distance between the mean band profile of the 8 s before and after
// each bar line. Boundaries are bar-quantised so cuts land on the grid.
const prof = ['sub', 'bass', 'lowmid', 'mid', 'high', 'loud'].map(k => smooth(env[k], 0.5));
const barLen = 4 * beatLen, bars = [];
for (let t = firstDownbeat; t < duration; t += barLen) if (t >= 0) bars.push(t);
const W8 = Math.round(8 * FPS);
const nov = bars.map(t => {
  const f = Math.round(t * FPS); if (f < W8 / 2 || f > NF - W8 / 2) return 0;
  let d = 0;
  for (const p of prof) {
    let A = 0, B = 0, na = 0, nb = 0;
    for (let i = Math.max(0, f - W8); i < f; i++) { A += p[i]; na++; }
    for (let i = f; i < Math.min(NF, f + W8); i++) { B += p[i]; nb++; }
    d += (A / na - B / nb) ** 2;
  }
  return Math.sqrt(d);
});
const novThr = pct(nov, 0.8), cuts = [0];
for (let i = 1; i < bars.length - 1; i++) {
  if (nov[i] >= novThr && nov[i] >= nov[i - 1] && nov[i] >= nov[i + 1] && bars[i] - cuts.at(-1) >= 8) cuts.push(bars[i]);
}
cuts.push(duration);
const mean = (arr, t0, t1) => { let s = 0, n = 0; for (let f = Math.round(t0 * FPS); f < Math.min(NF, Math.round(t1 * FPS)); f++) { s += arr[f]; n++; } return n ? s / n : 0; };
const sections = cuts.slice(0, -1).map((t, i) => {
  const e = mean(env.energy, t, cuts[i + 1]), b = mean(env.bass, t, cuts[i + 1]);
  return { start: Math.round(t * 1000) / 1000, end: Math.round(cuts[i + 1] * 1000) / 1000, energy: Math.round(e * 100) / 100, bass: Math.round(b * 100) / 100 };
});
// Kind from kick density and energy relative to the track: in electronic music a
// breakdown is the kick dropping out, a drop is it returning with the bass.
const kickTimes = kick.map(k => k[0]);
for (const s of sections) s.kicks = Math.round(kickTimes.filter(t => t >= s.start && t < s.end).length / (s.end - s.start) / (bpm / 60) * 100) / 100; // kicks per beat
const maxE = Math.max(...sections.map(s => s.energy)), maxK = Math.max(...sections.map(s => s.kicks)) || 1;
sections.forEach((s, i) => {
  const p = sections[i - 1], rel = s.energy / (maxE || 1);
  s.kind = rel > 0.8 ? 'peak' : rel < 0.35 ? 'calm' : 'groove';
  if (p && p.kicks > 0.5 * maxK && s.kicks < 0.25 * maxK) s.kind = 'breakdown';
  if (p && s.kicks > 0.5 * maxK && (p.kicks < 0.25 * maxK || p.kind === 'breakdown') && s.energy > p.energy + 0.15) s.kind = 'drop';
});
const drops = sections.filter(s => s.kind === 'drop').map(s => s.start);

// ── write ──────────────────────────────────────────────────────────────────
const out = {
  source: path.basename(src), fps: FPS, duration: Math.round(duration * 1000) / 1000, frames: NF,
  bpm, beat: Math.round(beatLen * 10000) / 10000, firstDownbeat: Math.round(firstDownbeat * 1000) / 1000,
  sections, drops,
  hits: { kick, snare, hat },
  env: Object.fromEntries(Object.entries(env).filter(([k]) => k !== 'kickBand').map(([k, v]) => [k, q(v)])),
};
const json = JSON.stringify(out);
fs.writeFileSync(path.join(filmDir, 'features.json'), json);
fs.writeFileSync(path.join(filmDir, 'features.js'), `// Generated by tools/analyze.mjs from ${out.source}. Do not edit; re-run the analyzer.\nwindow.FEATURES=${json};\n`);

console.log(`  bpm ${bpm}  first downbeat ${out.firstDownbeat}s  kicks ${kick.length}  snares ${snare.length}  hats ${hat.length}`);
console.log('  sections:');
for (const s of sections) console.log(`    ${s.start.toFixed(1).padStart(6)}-${s.end.toFixed(1).padEnd(6)} ${s.kind.padEnd(9)} energy ${s.energy} bass ${s.bass} kicks/beat ${s.kicks}`);
console.log(`  -> ${path.relative(process.cwd(), filmDir)}/{track.wav,features.js,features.json}`);
