import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const projectSlugs = [
  'civicproof',
  'divyadhun',
  'watchroom',
  'instafetch',
  'resume-fit-checker',
  'frost-and-flowers',
  'cpp-practice',
  'leetcode-probs'
];

test('home page navigation targets exist and use the actual section ids', async ({ page }) => {
  await page.goto('/');
  const expected = ['highlights', 'about', 'comparison', 'contact'];
  for (const id of expected) await expect(page.locator(`#${id}`)).toHaveCount(1);
  for (const href of ['/\u0023highlights', '/\u0023about', '/\u0023comparison', '/\u0023contact']) {
    await expect(page.locator(`.site-nav a[href="${href}"]`)).toHaveCount(1);
  }
  await expect(page.locator('.site-nav a[href="/#work"], .site-nav a[href="/#labs"]')).toHaveCount(0);
});

test('mobile homepage uses one persistent section menu that opens, navigates, and closes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.site-header')).toBeHidden();
  await expect(page.locator('.local-nav')).toHaveAttribute('data-hydrated', 'true');
  const toggle = page.getByRole('button', { name: 'Sections' });
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.locator('.local-nav__links a[href="#projects"]').click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator('.local-nav')).toHaveCSS('position', 'sticky');
});

test('carousel keyboard support is scoped and never steals search input arrows', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const carousel = page.getByRole('region', { name: 'Selected project highlights' });
  const dots = carousel.locator('.highlights-dots button');
  const activeDot = async () => dots.evaluateAll((buttons) => buttons.findIndex((button) => button.getAttribute('aria-pressed') === 'true'));
  const before = await activeDot();
  await carousel.focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(activeDot).toBe((before + 1) % await dots.count());

  const search = page.getByRole('searchbox', { name: 'Search projects' });
  await search.fill('InstaFetch');
  const afterCarouselMove = await activeDot();
  await search.focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(activeDot).toBe(afterCarouselMove);
});

test('project category tabs and archive search update the selected content', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const webTab = page.getByRole('tab', { name: 'Web' });
  const appsTab = page.getByRole('tab', { name: 'Apps' });
  await appsTab.focus();
  await page.keyboard.press('ArrowRight');
  await expect(webTab).toHaveAttribute('aria-selected', 'true');
  await expect(webTab).toBeFocused();
  await webTab.click();
  await expect(webTab).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toContainText('InstaFetch');
  await expect(page.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'universe-tab-web');

  const search = page.getByRole('searchbox', { name: 'Search projects' });
  await search.fill('Frost & Flowers');
  await expect(page.locator('[data-project-explorer] [data-project-card]')).toHaveCount(1);
  await expect(page.locator('[data-project-explorer]')).toContainText('Frost & Flowers');
  await search.fill('no-such-project');
  await expect(page.locator('[data-project-explorer]')).toContainText('No signal found.');
});

test('every project case-study route has unique story beats and an honest visual label', async ({ page }) => {
  for (const slug of projectSlugs) {
    const response = await page.goto(`/projects/${slug}/`);
    expect(response?.status(), slug).toBe(200);
    await expect(page.locator('main h1')).toBeVisible();
    const storyTitles = await page.locator('.scroll-story__beats article h3').allTextContents();
    expect(storyTitles.length, slug).toBeGreaterThan(0);
    expect(new Set(storyTitles).size, `${slug} repeats a story title`).toBe(storyTitles.length);
    await expect(page.locator('.scroll-story__beats article h3').first()).not.toBeEmpty();
    await expect(page.locator('.project-visual__stamp').first()).not.toBeEmpty();
  }
});

test('image assets exist and all rendered images have useful alternative text', async ({ page, request }) => {
  await page.goto('/');
  const images = await page.locator('img').evaluateAll((nodes) => nodes.map((image) => ({ src: image.getAttribute('src'), alt: image.getAttribute('alt'), hidden: Boolean(image.closest('[aria-hidden="true"]')) })));
  expect(images.length).toBeGreaterThan(0);
  for (const image of images) {
    if (!image.hidden) expect(image.alt?.trim(), `missing alt for ${image.src}`).toBeTruthy();
    const response = await request.get(new URL(image.src, page.url()).toString());
    expect(response.status(), image.src).toBe(200);
  }
});

test('layout does not create horizontal overflow at mobile, tablet, desktop or wide sizes', async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
    { width: 1728, height: 1117 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const widths = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
    expect(widths.content, `horizontal overflow at ${viewport.width}px`).toBeLessThanOrEqual(widths.viewport + 1);
    if (viewport.width <= 390) {
      const introWidth = await page.locator('.universe-section .editorial-heading--split > p').evaluate((element) => element.getBoundingClientRect().width);
      expect(introWidth, 'product-universe intro should not collapse into a narrow side column').toBeGreaterThan(240);
    }
  }
});

test('reduced-motion preference keeps content available and disables the WebGL canvas', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.cinematic-hero h1')).toBeVisible();
  await expect(page.locator('.cinematic-hero canvas')).toHaveCount(0);
  await expect(page.locator('#highlights')).toBeVisible();
});

test('production first paint and JavaScript transfer stay within the portfolio budget', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.cinematic-hero__three canvas, .cinematic-hero__three .scene-fallback').first()).toBeVisible();
  const metrics = await page.evaluate(() => {
    const resources = performance.getEntriesByType('resource');
    const scripts = resources.filter((entry) => new URL(entry.name).origin === location.origin && entry.name.endsWith('.js'));
    return {
      firstContentfulPaintMs: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0),
      sameOriginJavaScriptEncodedBytes: scripts.reduce((sum, entry) => sum + (entry.encodedBodySize || 0), 0),
      scripts: scripts.map((entry) => ({ path: new URL(entry.name).pathname, encodedBytes: entry.encodedBodySize || 0 }))
    };
  });
  await testInfo.attach('performance-budget.json', { body: Buffer.from(JSON.stringify(metrics, null, 2)), contentType: 'application/json' });
  expect(metrics.firstContentfulPaintMs).toBeGreaterThan(0);
  expect(metrics.firstContentfulPaintMs).toBeLessThan(4_000);
  expect(metrics.sameOriginJavaScriptEncodedBytes).toBeLessThan(550_000);
});

test('home and case study pages have no uncaught browser errors or axe WCAG A/AA violations', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  for (const [route, viewport] of [
    ['/', { width: 1440, height: 900 }],
    ['/', { width: 390, height: 844 }],
    ['/projects/civicproof/', { width: 1440, height: 900 }]
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(route);
    await expect(page.locator('main')).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(results.violations.map(({ id, impact, nodes }) => ({ id, impact, count: nodes.length })), route).toEqual([]);
  }
  expect(pageErrors).toEqual([]);
});

test('verified public deployments remain reachable', async ({ request }) => {
  const urls = [
    'https://instafetch.pages.dev',
    'https://resume-fit-checker.pages.dev',
    'https://frost-and-flowers-store.amansharma-it5.workers.dev'
  ];
  for (const url of urls) {
    const response = await request.get(url, { timeout: 45_000 });
    expect(response.status(), url).toBe(200);
  }
});
