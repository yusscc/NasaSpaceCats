// SI-generated code: written with Claude (Anthropic). Disclosed per NASA Space Apps 2026 SI rules.
// Takes screenshots of the running site (http://localhost:5500) for the demo video.
// Usage: serve the site, then `node capture.mjs`.
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const SITE = 'http://localhost:5500/';
const OUT = 'public/demo';
const CHROME = 'node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe';
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720 });
const wait = ms => new Promise(r => setTimeout(r, ms));
const shot = async name => { await page.screenshot({ path: `${OUT}/${name}.png` }); console.log('saved', name); };
const click = sel => page.evaluate(s => document.querySelector(s).click(), sel);
// clicks are ignored while the camera flies, so retry until the detail panel opens
const openArtifact = async id => {
  for (let i = 0; i < 20; i++) {
    await click(`#artifact-list button[data-id="${id}"]`);
    await wait(700);
    if (await page.evaluate(() => !document.getElementById('panel').hidden)) break;
  }
  await wait(3500);
};
const setFolded = folded => page.evaluate(want => { const f = document.getElementById('fold'); if ((f.getAttribute('aria-expanded') === 'false') !== want) f.click(); }, folded);

await page.goto(SITE, { waitUntil: 'networkidle0' });
await page.evaluate(() => localStorage.removeItem('abf-progress'));
await page.waitForSelector('#loading.done', { timeout: 30000 });
await wait(2500);
await shot('01-intro');

// story: Apollo 11 chapter
await page.evaluate(() => {
  const i = [...document.querySelectorAll('.chapter')].findIndex(c => c.textContent.includes('Eagle descent'));
  scrollTo(0, i * innerHeight);
});
await wait(12000); // the story camera eases in slowly in software rendering
await shot('02-story-eagle');

// explore: Eagle close-up, then the orbit slider
await click('#skip');
await wait(5000);
await openArtifact('apollo-11-eagle');
await setFolded(true);
await wait(1500);
await shot('03-eagle-model');
await setFolded(false);
await page.evaluate(() => {
  const box = document.querySelector('.compare-box'), input = box.querySelector('input');
  input.value = 45; input.dispatchEvent(new Event('input', { bubbles: true }));
});
await wait(800);
await shot('04-orbit-slider');

// Mars: Ingenuity close-up and its quiz
await click('button[data-world="mars"]');
await wait(6000);
await openArtifact('ingenuity');
await setFolded(true);
await wait(1500);
await shot('05-ingenuity-model');
await setFolded(false);
await page.evaluate(() => {
  document.querySelector('.quiz').scrollIntoView({ block: 'center' });
  document.querySelector('.quiz button[data-year="2021"]').click();
});
await wait(800);
await shot('06-quiz');

// badge
await page.evaluate(async () => {
  const ids = [...document.querySelectorAll('#artifact-list button')].map(b => b.dataset.id);
  const { artifacts } = await import('/data/artifacts.js');
  localStorage.setItem('abf-progress', JSON.stringify({ seen: artifacts.map(a => a.id), quiz: artifacts.map(a => a.id), awarded: true }));
  return ids;
});
await page.reload({ waitUntil: 'networkidle0' });
await page.waitForSelector('#loading.done', { timeout: 30000 });
await wait(1500);
await click('#score');
await wait(800);
await shot('07-badge');
await page.evaluate(() => localStorage.removeItem('abf-progress'));

await browser.close();
