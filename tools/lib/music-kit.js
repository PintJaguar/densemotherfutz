/* ── music kit ───────────────────────────────────────────────────────────────
   Injected by new-riso.mjs --kind music. Reads window.FEATURES written by
   tools/analyze.mjs. Every function here is pure in t: the track was analysed
   offline, so seek(t) never touches live audio and any frame is reproducible.

   M.val(name, t)            continuous envelope 0..1, interpolated between frames:
                             loud sub bass lowmid mid high bright energy build
   M.last(kind, t, minS)     last hit at or before t: {i, t, s, age} or null
                             kind: kick snare hat; s is strength 0..1
   M.hit(kind, t, decay, minS) punch envelope: strength at the hit, ~5% after decay s
   M.beat(t)                 {i, phase, bar, inBar} on the analysed grid
   M.section(t)              {index, start, end, kind, energy, u}
                             kind: calm groove peak breakdown drop
   M.sinceDrop(t)            seconds since the latest drop (Infinity before the first)       */
const FEAT = window.FEATURES;
const M = (() => {
  const fps = FEAT.fps, n = FEAT.frames;
  function val(name, t) {
    const a = FEAT.env[name];
    if (!a) throw Error(`no envelope "${name}"; have ${Object.keys(FEAT.env).join(', ')}`);
    const x = clamp(t * fps, 0, n - 1), i = Math.floor(x), u = x - i;
    return a[i] * (1 - u) + a[Math.min(n - 1, i + 1)] * u;
  }
  function last(kind, t, minS = 0) {
    const h = FEAT.hits[kind];
    let lo = 0, hi = h.length - 1, r = -1;
    while (lo <= hi) { const m = (lo + hi) >> 1; if (h[m][0] <= t + 1e-6) { r = m; lo = m + 1; } else hi = m - 1; }
    while (r >= 0 && h[r][1] < minS) r--;
    return r < 0 ? null : { i: r, t: h[r][0], s: h[r][1], age: t - h[r][0] };
  }
  const hit = (kind, t, decay = 0.25, minS = 0) => {
    const h = last(kind, t, minS);
    return h ? h.s * Math.exp(-3 * h.age / decay) : 0;
  };
  function beat(t) {
    const b = (t - FEAT.firstDownbeat) / FEAT.beat, i = Math.floor(b);
    return { i, phase: b - i, bar: Math.floor(i / 4), inBar: ((i % 4) + 4) % 4 };
  }
  function section(t) {
    const S = FEAT.sections;
    let k = S.findIndex(s => t < s.end);
    if (k < 0) k = S.length - 1;
    const s = S[k];
    return { ...s, index: k, u: clamp((t - s.start) / (s.end - s.start), 0, 1) };
  }
  const sinceDrop = t => { let d = Infinity; for (const x of FEAT.drops) if (x <= t) d = t - x; return d; };
  return { val, last, hit, beat, section, sinceDrop, bpm: FEAT.bpm, beatLen: FEAT.beat, sections: FEAT.sections, drops: FEAT.drops };
})();

/* ── synthwave inks ──────────────────────────────────────────────────────────
   Real riso drum colours that read as synthwave: fluorescent pink and orange,
   aqua, purple, midnight. Darks are overprints of purple + midnight + indigo,
   never a black ink; neon comes from knocking the dark back to paper and
   printing fluorescent ink into the hole.                                      */
Object.assign(INK,    { aqua: '#5EC8E5', florange: '#FF7477', purple: '#765BA7', midnight: '#435060', sunflower: '#FFB511', teal: '#00838A' });
Object.assign(SCREEN, { aqua: { a: 3, b: 1 }, florange: { a: 1, b: 3 }, purple: { a: 1, b: 2 }, midnight: { a: 1, b: 1 }, sunflower: { a: 1, b: 0 }, teal: { a: 3, b: 2 } });
Object.assign(REG,    { aqua: [-1.5, 1.0], florange: [2.0, -1.5], purple: [-1.0, -2.0], midnight: [0.5, 0.5], sunflower: [1.5, 1.5], teal: [-1.0, 1.0] });

/* ── VHS / glitch pass ───────────────────────────────────────────────────────
   Runs last, on the finished print, as the "tape" the print was dubbed onto.
   One getImageData pass: row displacement (tracking band + glitch slices),
   chroma split, scanlines, luma noise. Noise is seeded per frame index so it
   changes every frame (tape noise should) yet any frame re-renders identically.
   Glitch slices are seeded by a caller key (e.g. the kick index) so a slice
   holds its shape for the life of one hit instead of flickering.

   o = { chroma px, scan 0..1, noise 0..1, track 0..1, glitch 0..1, glitchKey,
         wobble px, bleed 0..1 }                                                  */
function vhs(ctx, t, o = {}) {
  const chroma = o.chroma ?? 2, scan = o.scan ?? 0.12, noise = o.noise ?? 0.06;
  const track = o.track ?? 0, glitch = o.glitch ?? 0, wobble = o.wobble ?? 0.6, bleed = o.bleed ?? 0.35;
  const f = Math.round(t * 30), rng = rngFor('vhs:' + f);
  const img = ctx.getImageData(0, 0, OUT, OUT), d = img.data, s = new Uint8ClampedArray(d);
  const off = new Float32Array(OUT);
  const wob = (rng() - 0.5) * 2 * wobble;
  for (let y = 0; y < OUT; y++) off[y] = wob;
  if (track > 0.001) {                               // a tracking band rolling up the frame
    const y0 = (1.1 - ((t * 0.09 + rngFor('vhs:track')()) % 1.3)) * OUT, h = 30 + 110 * track;
    for (let y = Math.max(0, Math.floor(y0)); y < Math.min(OUT, y0 + h); y++) {
      const u = (y - y0) / h;
      off[y] += Math.sin(u * Math.PI) * track * (18 + 26 * rng());
    }
  }
  if (glitch > 0.001) {                              // horizontal slice tears
    const g = rngFor('glitch:' + (o.glitchKey ?? f));
    const k = 1 + Math.floor(g() * 7 * glitch);
    for (let j = 0; j < k; j++) {
      const y = Math.floor(g() * OUT), h = 3 + Math.floor(g() * 90 * glitch), dx = (g() - 0.5) * 220 * glitch;
      for (let r = y; r < Math.min(OUT, y + h); r++) off[r] += dx;
    }
  }
  const cr = chroma;
  for (let y = 0; y < OUT; y++) {
    const row = y * OUT, dy = off[y], dark = (y & 1) ? 1 - scan : 1;
    let pr = 0, pg = 0, pb = 0;                        // horizontal chroma bleed, like a VHS luma/chroma split
    for (let x = 0; x < OUT; x++) {
      const xr = clamp(Math.round(x - dy - cr), 0, OUT - 1);
      const xg = clamp(Math.round(x - dy), 0, OUT - 1);
      const xb = clamp(Math.round(x - dy + cr), 0, OUT - 1);
      let r = s[(row + xr) * 4], g = s[(row + xg) * 4 + 1], b = s[(row + xb) * 4 + 2];
      pr = x ? pr + (r - pr) * (1 - bleed) : r; pg = x ? pg + (g - pg) * (1 - bleed * 0.3) : g; pb = x ? pb + (b - pb) * (1 - bleed) : b;
      const nz = (rng() - 0.5) * noise * 255;
      const i = (row + x) * 4;
      d[i] = (pr + nz) * dark; d[i + 1] = (pg + nz) * dark; d[i + 2] = (pb + nz) * dark;
    }
  }
  ctx.putImageData(img, 0, 0);
}
