/**
 * Low-res probe render with sound, for judging timing and pacing quickly.
 * Draws natively at --res via the film's ?res= parameter (no downscaled 1080 frames, no moiré),
 * splits [from, to) into --jobs chunks in separate browsers, concatenates and muxes the track
 * segment. Run from tools/ (it uses tools/node_modules):
 *
 *   node ../films/dense-motherfutz/probe.mjs --from 0 --to 133 --res 540 --jobs 3
 *
 * Output: out/dense-motherfutz-probe-<from>-<to>-<res>.mp4. Not a delivery render.
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { launch, openFilm, args } from '../../tools/lib/browser.mjs';
import { pipeFrames, run } from '../../tools/lib/ffmpeg.mjs';

const here = path.dirname(url.fileURLToPath(import.meta.url));
const film = path.join(here, 'index.html'), name = path.basename(here);
const a = args(process.argv.slice(2));
const res = Number(a.res || 540), fps = Number(a.fps || 30), jobs = Number(a.jobs || 3);
const from = Number(a.from || 0), to = Number(a.to || 133);
const outDir = path.resolve(here, '..', '..', 'out');
const out = path.resolve(a.out || path.join(outDir, `${name}-probe-${from}-${to}-${res}.mp4`));
fs.mkdirSync(path.dirname(out), { recursive: true });

const total = Math.round((to - from) * fps), per = Math.ceil(total / jobs);
console.log(`${name} probe: ${from}-${to}s, ${total} frames @ ${res}px, ${jobs} jobs`);
const t0 = Date.now();

async function chunk(j) {
  const f0 = j * per, f1 = Math.min(total, f0 + per), part = out.replace(/\.mp4$/, `.part${j}.mp4`);
  if (f1 <= f0) return null;
  const browser = await launch();
  const { page, errors } = await openFilm(browser, film, { size: res, css: 720, query: `res=${res}` });
  const w = await page.evaluate(() => document.querySelector('canvas').width);
  if (w !== res) throw Error(`film drew at ${w}px, expected ${res}`);
  const ff = pipeFrames(['-f', 'image2pipe', '-framerate', String(fps), '-i', 'pipe:0',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'veryfast', '-y', part]);
  for (let f = f0; f < f1; f++) {
    await page.evaluate(t => window.__riso.seek(t), from + f / fps);
    await ff.write(await page.screenshot({ type: 'png' }));
    if ((f - f0) % 150 === 0) console.log(`  job ${j}: ${f - f0 + 1}/${f1 - f0}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  await ff.end();
  if (errors.length) console.error(`!! job ${j}: ${errors.slice(0, 5).join('\n - ')}`);
  await browser.close();
  return part;
}

const parts = (await Promise.all(Array.from({ length: jobs }, (_, j) => chunk(j)))).filter(Boolean);
const list = out.replace(/\.mp4$/, '.txt');
fs.writeFileSync(list, parts.map(p => `file '${p.replace(/\\/g, '/')}'`).join('\n'));
await run(['-f', 'concat', '-safe', '0', '-i', list, '-ss', String(from), '-t', String(to - from), '-i', path.join(here, 'track.wav'),
  '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', '-y', out]);
for (const p of [...parts, list]) fs.unlinkSync(p);
console.log(`done in ${((Date.now() - t0) / 1000).toFixed(0)}s -> ${out}`);
