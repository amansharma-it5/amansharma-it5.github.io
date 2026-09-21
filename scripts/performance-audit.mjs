import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:4323';
const outputPath = path.join(process.cwd(), 'artifacts', 'qa', 'reports', 'performance.json');
const viewports = [
  { name: 'mobile-390x844', width: 390, height: 844 },
  { name: 'desktop-1440x900', width: 1440, height: 900 }
];
const browser = await chromium.launch({ headless: true });
const measurements = [];
let failed = false;

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle', timeout: 60_000 });
  await page.waitForTimeout(500);
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const resources = performance.getEntriesByType('resource');
    const sameOrigin = resources.filter((entry) => new URL(entry.name).origin === location.origin);
    const scripts = sameOrigin.filter((entry) => entry.name.endsWith('.js'));
    return {
      domContentLoadedMs: Math.round(navigation?.domContentLoadedEventEnd ?? 0),
      loadEventMs: Math.round(navigation?.loadEventEnd ?? 0),
      firstContentfulPaintMs: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0),
      sameOriginTransferBytes: sameOrigin.reduce((sum, entry) => sum + (entry.transferSize || 0), 0),
      sameOriginJavaScriptEncodedBytes: scripts.reduce((sum, entry) => sum + (entry.encodedBodySize || 0), 0),
      scriptResources: scripts.map((entry) => ({ url: new URL(entry.name).pathname, encodedBytes: entry.encodedBodySize || 0 })),
      webglCanvasCount: document.querySelectorAll('.cinematic-hero__three canvas').length,
      fallbackCount: document.querySelectorAll('.cinematic-hero__three .scene-fallback').length
    };
  });
  const measurement = { viewport, ...metrics };
  measurements.push(measurement);
  console.log(JSON.stringify(measurement));
  if (!metrics.firstContentfulPaintMs || metrics.firstContentfulPaintMs > 4_000) failed = true;
  if (metrics.sameOriginJavaScriptEncodedBytes > 550_000) failed = true;
  if (!metrics.webglCanvasCount && !metrics.fallbackCount) failed = true;
  await page.close();
}

await browser.close();
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, JSON.stringify({ baseUrl, generatedAt: new Date().toISOString(), thresholds: { firstContentfulPaintMs: 4000, sameOriginJavaScriptEncodedBytes: 550000 }, measurements }, null, 2));
console.log(`Performance report written: ${outputPath}`);
if (failed) process.exitCode = 1;
