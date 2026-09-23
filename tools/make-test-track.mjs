/**
 * A 64 s synthetic techno sketch with known ground truth, for testing analyze.mjs
 * and a film's reactions before a real track is in place.
 *
 *   node make-test-track.mjs [--out ../tracks/test-128.wav]
 *
 * 128 BPM, first downbeat at 0. Form (bars of 1.875 s):
 *   0-8    intro: kick + hats
 *   8-16   groove: + bass + clap on 2/4
 *   16-24  breakdown: pad + riser, no kick, no bass
 *   24-34  drop: everything, louder
 * Prints the ground truth so the analyser's report can be compared against it.
 */
import fs from 'node:fs';
import path from 'node:path';
import { args } from './lib/browser.mjs';

const a = args(process.argv.slice(2));
const out = path.resolve(a.out || '../tracks/test-128.wav');
const SR = 48000, BPM = 128, B = 60 / BPM, BAR = 4 * B, BARS = 34, DUR = BARS * BAR;
const n = Math.round(DUR * SR), L = new Float32Array(n), R = new Float32Array(n);
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647 * 2 - 1;
const add = (t0, fn, len) => { const i0 = Math.round(t0 * SR); for (let i = 0; i < len * SR && i0 + i < n; i++) { const [l, r] = fn(i / SR); L[i0 + i] += l; R[i0 + i] += r; } };

const kick = g => t => { const f = 45 + 110 * Math.exp(-t * 30), e = Math.exp(-t * 7) * g; const v = Math.sin(2 * Math.PI * f * t - 2 * Math.exp(-t * 30)) * e; return [v, v]; };
const hat = g => t => { const v = rnd() * Math.exp(-t * 60) * g; return [v * 0.8, v]; };
const clap = g => t => { const v = rnd() * Math.exp(-t * 18) * g * (1 + Math.sin(2 * Math.PI * 1800 * t)) * 0.5; return [v, v]; };
const bass = (f, g) => t => { const v = Math.tanh(3 * Math.sin(2 * Math.PI * f * t)) * Math.min(1, t * 200) * Math.exp(-t * 4) * g; return [v, v]; };

const truth = { bpm: BPM, kicks: [], drop: 24 * BAR, breakdown: 16 * BAR, sections: [[0, 8 * BAR, 'intro'], [8 * BAR, 16 * BAR, 'groove'], [16 * BAR, 24 * BAR, 'breakdown'], [24 * BAR, DUR, 'drop']] };
for (let bar = 0; bar < BARS; bar++) {
  const drop = bar >= 24, brk = bar >= 16 && bar < 24, g = drop ? 1 : 0.7;
  for (let b = 0; b < 4; b++) {
    const t = bar * BAR + b * B;
    if (!brk) { add(t, kick(0.9 * g), 0.5); truth.kicks.push(+t.toFixed(3)); }
    add(t + B / 2, hat(0.25 * g), 0.1);
    if (bar >= 8 && !brk && (b === 1 || b === 3)) add(t, clap(0.5 * g), 0.3);
    if (bar >= 8 && !brk) add(t + B / 2, bass(bar % 4 === 3 ? 49 : 55, 0.35 * g), B / 2);
  }
  if (brk) {
    const u = (bar - 16) / 8;
    add(bar * BAR, t => { const f = 220 * (1 + (u + t / BAR / 8) * 3), v = (rnd() * 0.15 * (u + t / BAR / 8) + Math.sin(2 * Math.PI * f * t) * 0.08) * 0.8; return [v, v * 0.9]; }, BAR);
    add(bar * BAR, t => { const v = (Math.sin(2 * Math.PI * 220 * t) + Math.sin(2 * Math.PI * 277 * t) + Math.sin(2 * Math.PI * 330 * t)) * 0.06; return [v, v]; }, BAR);
  }
}
let peak = 0; for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const k = 0.89 / peak, dv = new DataView(new ArrayBuffer(44 + n * 4));
const s = (o, str) => [...str].forEach((c, i) => dv.setUint8(o + i, c.charCodeAt(0)));
s(0, 'RIFF'); dv.setUint32(4, 36 + n * 4, true); s(8, 'WAVEfmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 2, true);
dv.setUint32(24, SR, true); dv.setUint32(28, SR * 4, true); dv.setUint16(32, 4, true); dv.setUint16(34, 16, true); s(36, 'data'); dv.setUint32(40, n * 4, true);
for (let i = 0; i < n; i++) { dv.setInt16(44 + i * 4, L[i] * k * 32767, true); dv.setInt16(46 + i * 4, R[i] * k * 32767, true); }
fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, Buffer.from(dv.buffer));
console.log(`${out}: ${DUR.toFixed(3)} s`);
console.log(`truth: bpm ${BPM}, ${truth.kicks.length} kicks, breakdown ${truth.breakdown.toFixed(3)} s, drop ${truth.drop.toFixed(3)} s`);
