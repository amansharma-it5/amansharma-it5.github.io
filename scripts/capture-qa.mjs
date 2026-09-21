import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const outputDir = process.env.QA_OUTPUT ?? 'artifacts/qa/final';
const viewports = [
  { name: 'mobile-390x844', width: 390, height: 844 },
  { name: 'tablet-768x1024', width: 768, height: 1024 },
  { name: 'desktop-1440x900', width: 1440, height: 900 },
  { name: 'wide-1728x1117', width: 1728, height: 1117 }
];

const homeSections = [
  ['hero-start', 0],
  ['hero-middle', 0.45],
  ['hero-end', 0.95],
  ['highlights', '#highlights'],
  ['product-universe', '#projects'],
  ['3d-showroom', '.universe-showroom'],
  ['apps', '#apps'],
  ['web', '#web'],
  ['ai', '#ai'],
  ['archive', '#comparison'],
  ['contact', '#contact']
];
const caseStudies = ['civicproof', 'divyadhun', 'watchroom'];

function safeName(value) {
  return value.replace(/[^a-z0-9-]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
}

async function capture(page, file, scrollTo) {
  if (typeof scrollTo === 'number') {
    await page.evaluate((ratio) => {
      const hero = document.querySelector('.cinematic-hero');
      const heroTop = hero ? hero.getBoundingClientRect().top + window.scrollY : 0;
      const maximumHeroScroll = hero ? Math.max(0, heroTop + hero.offsetHeight - window.innerHeight) : document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: Math.round(maximumHeroScroll * ratio), behavior: 'instant' });
    }, scrollTo);
    const compact = (page.viewportSize()?.width ?? 0) <= 620;
    const surface = compact || scrollTo < 0.25 ? '.hero-surface--one img' : scrollTo < 0.52 ? '.hero-surface--two img' : '.hero-surface--three img';
    await page.waitForFunction((selector) => {
      const image = document.querySelector(selector);
      return image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0;
    }, surface, { timeout: 15_000 });
  } else {
    await page.evaluate((id) => {
      const element = document.querySelector(id);
      if (!element) return;
      const top = element.getBoundingClientRect().top + window.scrollY - 82;
      window.scrollTo({ top: Math.max(0, top), behavior: 'instant' });
    }, scrollTo);
    if (scrollTo === '.universe-showroom' && (page.viewportSize()?.width ?? 0) > 900) {
      await page.waitForSelector('.universe-showroom .scene-runtime--showroom canvas', { timeout: 30_000 });
    }
  }
  await page.waitForTimeout(320);
  await page.screenshot({ path: file, type: 'jpeg', quality: 91, animations: 'disabled' });
}

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const evidence = [];

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: 'no-preference' });
  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  for (const [name, scrollTo] of homeSections) {
    if (name === '3d-showroom' && viewport.width <= 900) continue;
    const file = join(outputDir, `${viewport.name}-${name}.jpg`);
    await capture(page, file, scrollTo);
    evidence.push({ file, viewport: viewport.name, route: '/', capture: name });
  }
  for (const slug of caseStudies) {
    await page.goto(`${baseUrl}/projects/${slug}/`, { waitUntil: 'networkidle' });
    const file = join(outputDir, `${viewport.name}-case-${slug}.jpg`);
    await page.screenshot({ path: file, type: 'jpeg', quality: 91, animations: 'disabled' });
    evidence.push({ file, viewport: viewport.name, route: `/projects/${slug}/`, capture: 'case-study-start' });
  }
  await page.close();
}

await writeFile(join(outputDir, 'manifest.json'), JSON.stringify({ baseUrl, generatedAt: new Date().toISOString(), evidence }, null, 2));
await browser.close();
console.log(`Captured ${evidence.length} screenshots in ${outputDir}`);
