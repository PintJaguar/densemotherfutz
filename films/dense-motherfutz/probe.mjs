/**
 * Probe renders and stills for this film, in any aspect. Frames are the canvas's native pixels
 * (toDataURL), so a 9:16 canvas is captured whole; the square viewport in tools/lib/browser.mjs
 * would crop it. The film draws natively at --res via ?res= (no downscaled frames, no moiré).
 * Run from tools/ (it uses tools/node_modules):
 *
 *   node ../films/dense-motherfutz/probe.mjs --stills 12,48,120 [--res 540] [--sheet] [--cols 4]
 *   node ../films/dense-motherfutz/probe.mjs --from 0 --to 192 --res 540 --jobs 3
 *   --aspect 1:1 for the square cut. Video: out/dense-motherfutz-probe-<from>-<to>-<res>.mp4,
 *   silent parts concatenated and muxed with the matching slice of track.wav.
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { launch, args } from '../../tools/lib/browser.mjs';
import { pipeFrames, run } from '../../tools/lib/ffmpeg.mjs';

const here = path.dirname(url.fileURLToPath(import.meta.url));
const film = path.join(here, 'index.html'), name = path.basename(here);
const a = args(process.argv.slice(2));
const res = Number(a.res || 540), fps = Number(a.fps || 30), jobs = Number(a.jobs || 3);
const query = `res=${res}` + (a.aspect ? `&aspect=${a.aspect}` : '');
const outDir = path.resolve(here, '..', '..', 'out');
fs.mkdirSync(outDir, { recursive: true });

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 720, height: 1280 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url.pathToFileURL(film).href + '?' + query, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__riso && window.__riso.ready === true, null, { timeout: 180000 })
    .catch(() => { throw Error('film never got ready:\n - ' + errors.join('\n - ')); });
  const frame = async t => Buffer.from((await page.evaluate(t => { window.__riso.seek(t); return document.querySelector('canvas').toDataURL('image/png'); }, t)).split(',')[1], 'base64');
  const size = await page.evaluate(() => { const c = document.querySelector('canvas'); return [c.width, c.height]; });
  return { page, errors, frame, size };
}

if (a.stills) {
  const times = String(a.stills).split(',').map(Number), dir = path.join(outDir, a.out || `${name}-stills`);
  fs.mkdirSync(dir, { recursive: true });
  const browser = await launch();
  const { frame, errors, size, page } = await openPage(browser);
  const names = [];
  for (const t of times) { const n = `t_${t.toFixed(2).padStart(6, '0')}.png`; fs.writeFileSync(path.join(dir, n), await frame(t)); names.push([t, n]); console.log(`  ${n}`); }
  if (a.sheet) {
    const cols = Number(a.cols || Math.min(6, times.length)), cw = Number(a.cell || 200), ch = Math.round(cw * size[1] / size[0]);
    const html = `<!doctype html><style>body{margin:0;background:#1b1b1b;font:11px monospace;color:#bbb}.g{display:grid;grid-template-columns:repeat(${cols},${cw}px);gap:6px;padding:6px}img{width:${cw}px;height:${ch}px;display:block}p{margin:2px 0;text-align:center}</style><div class=g>${names.map(([t, n]) => `<div><img src="${n}"><p>${t.toFixed(2)}s</p></div>`).join('')}</div>`;
    fs.writeFileSync(path.join(dir, '_sheet.html'), html);
    const sp = await browser.newPage({ viewport: { width: cols * (cw + 6) + 6, height: 400 } });
    await sp.goto(url.pathToFileURL(path.join(dir, '_sheet.html')).href, { waitUntil: 'load' });
    await sp.screenshot({ path: path.join(dir, 'sheet.png'), fullPage: true });
    console.log(`sheet -> ${path.join(dir, 'sheet.png')}`);
  }
  if (errors.length) console.error('!! page errors:\n - ' + errors.slice(0, 5).join('\n - '));
  await browser.close();
  process.exit(0);
}

const from = Number(a.from || 0), to = Number(a.to || 192);
const out = path.resolve(a.out || path.join(outDir, `${name}-probe-${from}-${to}-${res}${a.aspect ? '-' + a.aspect.replace(':', 'x') : ''}.mp4`));
const total = Math.round((to - from) * fps), per = Math.ceil(total / jobs);
console.log(`${name} probe: ${from}-${to}s, ${total} frames @ ${res}px wide, ${jobs} jobs`);
const t0 = Date.now();

async function chunk(j) {
  const f0 = j * per, f1 = Math.min(total, f0 + per), part = out.replace(/\.mp4$/, `.part${j}.mp4`);
  if (f1 <= f0) return null;
  const browser = await launch();
  const { frame, errors } = await openPage(browser);
  const ff = pipeFrames(['-f', 'image2pipe', '-framerate', String(fps), '-i', 'pipe:0',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'veryfast', '-y', part]);
  for (let f = f0; f < f1; f++) {
    await ff.write(await frame(from + f / fps));
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
