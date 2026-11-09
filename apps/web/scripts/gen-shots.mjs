/* global URL, console, process */
// Screenshots of the templates and the demo for the landing page mosaic.
// Run: node scripts/gen-shots.mjs [baseUrl]   (default: the live site)
// Writes public/shots/<name>-<light|dark>.jpg. Rerun after a template changes.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.argv[2] ?? 'https://sorbetui.tahmid.space';
const OUT = new URL('../public/shots/', import.meta.url).pathname;
const W = 1280, H = 1500;
const SHOTS = ['saas-landing', 'product-launch', 'developer-tool', 'store', 'auth', 'workspace']
  .map((slug) => ({ name: slug, path: `/templates/${slug}`, sel: '[data-testid="template-preview"]' }))
  .concat({ name: 'demo', path: '/demo', sel: 'main' });

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
for (const mode of ['light', 'dark']) {
  const page = await browser.newPage({ viewport: { width: W, height: 1200 }, colorScheme: mode, reducedMotion: 'reduce' });
  for (const s of SHOTS) {
    await page.goto(BASE + s.path, { waitUntil: 'networkidle' });
    const box = await page.locator(s.sel).first().boundingBox();
    await page.screenshot({ path: `${OUT}${s.name}-${mode}.jpg`, type: 'jpeg', quality: 72, fullPage: true, clip: { x: box.x, y: box.y, width: W, height: H } });
    console.log(mode, s.name);
  }
  await page.close();
}
await browser.close();
