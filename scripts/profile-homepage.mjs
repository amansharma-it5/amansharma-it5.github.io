import { chromium } from '@playwright/test';

const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const mode = process.env.PROFILE_MODE ?? 'baseline';
const viewport = { width: 390, height: 844 };

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport });

if (mode === 'block-fonts') {
  await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
  await page.route('https://fonts.gstatic.com/**', (route) => route.abort());
}

await page.addInitScript(({ profileMode }) => {
  window.__profile = {
    longTasks: [],
    layoutShifts: [],
    paints: [],
    rectCalls: 0,
    rectTime: 0,
    computedStyleCalls: 0,
    computedStyleTime: 0,
    mode: profileMode,
    marks: []
  };
  const originalRect = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function (...args) {
    const start = performance.now();
    const result = originalRect.apply(this, args);
    window.__profile.rectCalls += 1;
    window.__profile.rectTime += performance.now() - start;
    return result;
  };
  const originalComputedStyle = window.getComputedStyle;
  window.getComputedStyle = function (...args) {
    const start = performance.now();
    const result = originalComputedStyle.apply(this, args);
    window.__profile.computedStyleCalls += 1;
    window.__profile.computedStyleTime += performance.now() - start;
    return result;
  };
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      window.__profile.longTasks.push({
        name: entry.name,
        start: Number(entry.startTime.toFixed(2)),
        duration: Number(entry.duration.toFixed(2)),
        attribution: entry.attribution?.map((item) => ({
          name: item.name,
          entryType: item.entryType,
          containerType: item.containerType,
          containerName: item.containerName,
          containerId: item.containerId,
          containerSrc: item.containerSrc
        })) ?? []
      });
    }
  }).observe({ type: 'longtask', buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      window.__profile.layoutShifts.push({
        start: Number(entry.startTime.toFixed(2)),
        value: entry.value,
        hadRecentInput: entry.hadRecentInput
      });
    }
  }).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      window.__profile.paints.push({ name: entry.name, start: entry.startTime, duration: entry.duration });
    }
  }).observe({ type: 'paint', buffered: true });
}, { profileMode: mode });

await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle', timeout: 60_000 });
await page.waitForTimeout(7000);

const initial = await page.evaluate(() => {
  const p = window.__profile;
  const nav = performance.getEntriesByType('navigation')[0];
  const resources = performance.getEntriesByType('resource');
  const islands = [...document.querySelectorAll('astro-island')].map((node) => ({
    component: node.getAttribute('component-url'),
    renderer: node.getAttribute('renderer-url'),
    client: node.getAttribute('client'),
    hydrated: node.getAttribute('ssr') === null
  }));
  return {
    viewport: { width: innerWidth, height: innerHeight },
    mode: p.mode,
    navigation: {
      domContentLoaded: nav?.domContentLoadedEventEnd ?? 0,
      load: nav?.loadEventEnd ?? 0,
      duration: nav?.duration ?? 0
    },
    longTasks: p.longTasks,
    totalLongTaskTime: p.longTasks.reduce((sum, entry) => sum + entry.duration, 0),
    blockingTime: p.longTasks.reduce((sum, entry) => sum + Math.max(0, entry.duration - 50), 0),
    layoutShifts: p.layoutShifts,
    paints: p.paints,
    rectCalls: p.rectCalls,
    rectTime: p.rectTime,
    computedStyleCalls: p.computedStyleCalls,
    computedStyleTime: p.computedStyleTime,
    domNodes: document.getElementsByTagName('*').length,
    stylesheets: [...document.styleSheets].map((sheet) => ({ href: sheet.href, rules: (() => { try { return sheet.cssRules.length; } catch { return null; } })() })),
    resources: resources.map((entry) => ({ name: new URL(entry.name).pathname || entry.name, initiatorType: entry.initiatorType, duration: Number(entry.duration.toFixed(2)), transferSize: entry.transferSize, decodedBodySize: entry.decodedBodySize })).sort((a, b) => b.duration - a.duration).slice(0, 30),
    islands,
    hydratedMarkers: [...document.querySelectorAll('[data-hydrated]')].map((node) => ({ tag: node.tagName, className: node.className, value: node.getAttribute('data-hydrated') }))
  };
});

const scrollSamples = [];
for (const id of ['highlights', 'projects', 'apps', 'web', 'ai', 'about', 'comparison', 'contact']) {
  await page.locator(`#${id}`).scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  scrollSamples.push(await page.evaluate((sectionId) => {
    const p = window.__profile;
    const last = p.longTasks.at(-12) ?? [];
    return { sectionId, scrollY: scrollY, longTasks: last, totalLongTaskTime: p.longTasks.reduce((sum, entry) => sum + entry.duration, 0), blockingTime: p.longTasks.reduce((sum, entry) => sum + Math.max(0, entry.duration - 50), 0), rectCalls: p.rectCalls, rectTime: p.rectTime, computedStyleCalls: p.computedStyleCalls, computedStyleTime: p.computedStyleTime, hydratedMarkers: [...document.querySelectorAll('[data-hydrated]')].map((node) => ({ tag: node.tagName, className: node.className, value: node.getAttribute('data-hydrated') })) };
  }, id));
}

console.log(JSON.stringify({ initial, scrollSamples }, null, 2));
await browser.close();
