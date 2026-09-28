/**
 * Debug helper: open the film in Chromium and evaluate an expression in the page.
 * Run from tools/:  node ../films/lift-hochhaus/evalfilm.mjs "expr" [--res 540]
 */
import path from 'node:path';
import url from 'node:url';
import { launch, args } from '../../tools/lib/browser.mjs';
const here = path.dirname(url.fileURLToPath(import.meta.url));
const a = args(process.argv.slice(3));
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 720, height: 1280 } });
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => console.log('[console]', m.text()));
await page.goto(url.pathToFileURL(path.join(here, 'index.html')).href + '?res=' + (a.res || 540), { waitUntil: 'load' });
await page.waitForFunction(() => window.__riso && window.__riso.ready === true, null, { timeout: 180000 }).catch(() => {});
try { console.log(JSON.stringify(await page.evaluate(process.argv[2]), null, 1)); } catch (e) { console.log('ERR', String(e)); }
if (errors.length) console.log('page errors:', errors.slice(0, 5));
await browser.close();
