import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const outputDir = path.join(root, 'public', 'assets', 'images');
const captures = [
  { slug: 'instafetch', url: 'https://instafetch.pages.dev', file: 'instafetch-live.png' },
  { slug: 'recruitos-ai', url: 'https://resume-fit-checker.pages.dev', file: 'recruitos-ai-live.png' },
  { slug: 'frost-flowers', url: 'https://frost-and-flowers-store.amansharma-it5.workers.dev', file: 'frost-flowers-live.png' }
];

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];

for (const capture of captures) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  try {
    const response = await page.goto(capture.url, { waitUntil: 'domcontentloaded', timeout: 45_000 });
    await page.waitForTimeout(2_500);
    await page.screenshot({ path: path.join(outputDir, capture.file), fullPage: false, animations: 'disabled' });
    results.push({ ...capture, status: response?.status() ?? null, ok: Boolean(response?.ok()) });
    console.log(`${capture.slug}: ${response?.status() ?? 'no-response'} -> ${capture.file}`);
  } catch (error) {
    results.push({ ...capture, ok: false, error: error instanceof Error ? error.message : String(error) });
    console.error(`${capture.slug}: capture failed`);
    console.error(error);
    process.exitCode = 1;
  } finally {
    await page.close();
  }
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
