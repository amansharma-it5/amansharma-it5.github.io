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

const routeList = ['/', '/projects/', ...projectSlugs.map((slug) => `/projects/${slug}/`), '/404.html'];

test('global and local navigation only point to real home sections', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.local-nav')).toHaveAttribute('data-hydrated', 'true');
  const ids = await page.locator('[id]').evaluateAll((nodes) => nodes.map((node) => node.id));
  const invalid = await page.locator('a[href^="#"], a[href^="/#"]').evaluateAll((links, homeIds) => links
    .map((link) => link.getAttribute('href'))
    .filter((href) => {
      const id = href?.startsWith('/#') ? href.slice(2) : href?.slice(1);
      return !id || !homeIds.includes(id);
    }), ids);
  expect(invalid).toEqual([]);

  for (const href of ['/#highlights', '/#about', '/#comparison', '/#contact']) {
    await expect(page.locator(`.site-nav a[href="${href}"]`)).toHaveCount(1);
  }
  await page.locator('.local-nav__links a[href="#comparison"]').click();
  await expect(page.locator('.local-nav__links a[href="#comparison"]')).toHaveAttribute('aria-current', 'location');
  await expect(page).toHaveURL(/#comparison$/);
});

test('gold design token drives visible keyboard focus and editorial accents', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const focus = await page.evaluate(() => {
    const node = document.activeElement;
    if (!node || node === document.body) return null;
    const style = getComputedStyle(node);
    return {
      token: getComputedStyle(document.documentElement).getPropertyValue('--gold').trim(),
      focusVisible: node.matches(':focus-visible'),
      outlineStyle: style.outlineStyle,
      outlineColor: style.outlineColor,
      outlineWidth: style.outlineWidth
    };
  });
  expect(focus).not.toBeNull();
  expect(focus.token).toBe('#d3ad73');
  expect(focus.focusVisible).toBe(true);
  expect(focus.outlineStyle).toBe('solid');
  expect(focus.outlineColor).toBe('rgb(211, 173, 115)');
  expect(focus.outlineWidth).toBe('2px');
  await expect(page.locator('.cinematic-hero__copy h1 em')).toHaveCSS('color', 'rgb(211, 173, 115)');
});

test('mobile section menu discloses, closes with Escape, restores focus and navigates', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.site-header')).toBeHidden();
  await expect(page.locator('.local-nav')).toHaveAttribute('data-hydrated', 'true');
  const toggle = page.getByRole('button', { name: 'Sections' });
  await expect(toggle).toHaveAttribute('aria-controls', 'local-nav-links');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.locator('.local-nav__links a[href="#projects"]').click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator('.local-nav')).toHaveCSS('position', 'sticky');
});

test('highlight carousel supports scoped keyboard input and horizontal touch swipes', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.locator('#highlights').scrollIntoViewIfNeeded();
  const carousel = page.getByRole('region', { name: 'Selected project highlights' });
  await expect(carousel).toHaveAttribute('data-hydrated', 'true');
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

  await page.evaluate(() => {
    const target = document.querySelector('.highlights-viewer');
    if (!target) throw new Error('Carousel not found');
    const point = (clientX, clientY) => ({ identifier: 1, target, clientX, clientY });
    const dispatch = (type, touches, changedTouches) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperties(event, { touches: { value: touches }, changedTouches: { value: changedTouches } });
      target.dispatchEvent(event);
    };
    const first = point(320, 340);
    const last = point(220, 344);
    dispatch('touchstart', [first], [first]);
    dispatch('touchend', [], [last]);
  });
  await expect.poll(activeDot).toBe((afterCarouselMove + 1) % await dots.count());
});

test('product universe tabs, project selectors and documented-flow controls work', async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto('/');
  await page.locator('.universe-section').scrollIntoViewIfNeeded();
  await expect(page.locator('.universe-tabs')).toHaveAttribute('data-hydrated', 'true');
  const webTab = page.getByRole('tab', { name: 'Web' });
  const appsTab = page.getByRole('tab', { name: 'Apps' });
  await appsTab.focus();
  await page.keyboard.press('ArrowRight');
  await expect(webTab).toHaveAttribute('aria-selected', 'true');
  await expect(webTab).toBeFocused();
  await webTab.click();
  await expect(page.getByRole('tabpanel')).toContainText('InstaFetch');
  await expect(page.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'universe-tab-web');

  await page.getByRole('tab', { name: 'Apps' }).click();
  const step = page.getByRole('button', { name: '02 Evidence flow' });
  await step.click();
  await expect(step).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.universe-stage__visual .flow-map__focus')).toContainText('Evidence needs a timeline');
  await page.locator('.universe-projects').getByRole('button', { name: /DivyaDhun/ }).click();
  await expect(page.locator('.universe-stage__visual .flow-map__focus')).toContainText('Discovery with a language switch');
});

test('live-site capture gallery opens as an accessible dialog and returns focus', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.locator('.universe-section').scrollIntoViewIfNeeded();
  await expect(page.locator('.universe-tabs')).toHaveAttribute('data-hydrated', 'true');
  await page.getByRole('tab', { name: 'Web' }).click();
  await page.locator('.universe-stage__visual').scrollIntoViewIfNeeded();
  const open = page.getByRole('button', { name: 'View full-size authentic InstaFetch website screenshot' });
  await open.click();
  const dialog = page.getByRole('dialog', { name: 'InstaFetch authentic live website capture' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Close full-size screenshot' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(open).toBeFocused();
});

test('missing public screenshot has an honest, accessible fallback', async ({ page }) => {
  await page.route('**/assets/images/instafetch-live-*.webp', (route) => route.fulfill({ status: 404, contentType: 'text/plain', body: 'missing image' }));
  await page.goto('/');
  await page.locator('.universe-section').scrollIntoViewIfNeeded();
  await expect(page.locator('.universe-tabs')).toHaveAttribute('data-hydrated', 'true');
  await page.getByRole('tab', { name: 'Web' }).click();
  await page.locator('.universe-stage__visual').scrollIntoViewIfNeeded();
  await expect(page.getByRole('img', { name: 'InstaFetch capture unavailable. Open the case study for its documented product flow.' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'View full-size authentic InstaFetch website screenshot' })).toHaveCount(0);
});

test('archive search includes status, category filters, and clear empty results', async ({ page }) => {
  await page.goto('/');
  await page.locator('.archive-section').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-project-explorer]')).toHaveAttribute('data-hydrated', 'true');
  const search = page.getByRole('searchbox', { name: 'Search projects' });
  await search.fill('ordering unavailable');
  const frostCard = page.locator('[data-project-explorer] [data-project-card]');
  await expect(frostCard).toHaveCount(1);
  await expect(frostCard).toContainText('Frost & Flowers');
  await expect(frostCard.locator('.status')).toContainText('Live storefront · ordering unavailable');

  await search.fill('no-such-project');
  await expect(page.locator('[data-project-explorer]')).toContainText('No signal found.');
  await page.getByRole('button', { name: 'Reset archive' }).click();
  await expect(search).toHaveValue('');
  await page.getByRole('button', { name: 'Android' }).click();
  await expect(page.locator('[data-project-explorer] [data-project-card]')).toHaveCount(3);
});

test('every project route loads directly with unique verified story content and clear status', async ({ page }) => {
  for (const slug of projectSlugs) {
    const response = await page.goto(`/projects/${slug}/`);
    expect(response?.status(), slug).toBe(200);
    await expect(page.locator('main h1')).toBeVisible();
    const storyTitles = await page.locator('.scroll-story__beats article h3').allTextContents();
    expect(storyTitles.length, slug).toBeGreaterThanOrEqual(3);
    expect(new Set(storyTitles).size, `${slug} repeats a story title`).toBe(storyTitles.length);
    await expect(page.locator('.case-hero__stamp')).not.toBeEmpty();
    await expect(page.locator('.scroll-story .flow-map')).toHaveCount(1);
    const requested3dModule = await page.evaluate(() => performance.getEntriesByType('resource').some((entry) => /ImmersiveScene/i.test(new URL(entry.name).pathname)));
    expect(requested3dModule, `${slug} should not request the homepage-only 3D module`).toBe(false);
  }
});

test('case-study flow can be selected and reverse scrolling updates the same stage', async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const slug of projectSlugs) {
    await page.goto(`/projects/${slug}/`);
    await page.locator('.scroll-story').scrollIntoViewIfNeeded();
    await expect(page.locator('.scroll-story')).toHaveAttribute('data-hydrated', 'true');
    const beats = page.locator('.scroll-story__beats article');
    const flowFocus = page.locator('.scroll-story .flow-map__focus');
    const count = await beats.count();
    expect(count, slug).toBeGreaterThanOrEqual(3);
    for (let index = 0; index < count; index += 1) {
      const beat = beats.nth(index);
      await beat.scrollIntoViewIfNeeded();
      await expect(beat, `${slug} beat ${index + 1}`).toHaveClass(/is-active/);
      await expect(flowFocus).toContainText((await beat.locator('h3').innerText()).trim());
    }
    await beats.first().scrollIntoViewIfNeeded();
    await expect(beats.first()).toHaveClass(/is-active/);
  }
});

test('project image paths resolve and meaningful images have alternative text', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.locator('.local-nav')).toHaveAttribute('data-hydrated', 'true');
  await page.evaluate(() => {
    const hero = document.querySelector('.cinematic-hero');
    if (!hero) throw new Error('Hero not found');
    const end = hero.getBoundingClientRect().top + window.scrollY + hero.offsetHeight - window.innerHeight;
    window.scrollTo({ top: Math.round(end * 0.75), behavior: 'instant' });
  });
  await page.waitForTimeout(200);
  const images = await page.locator('img').evaluateAll((nodes) => nodes.map((image) => ({ src: image.getAttribute('src'), alt: image.getAttribute('alt'), hidden: Boolean(image.closest('[aria-hidden="true"]')) })));
  expect(images.length).toBeGreaterThan(0);
  expect(new Set(images.map(({ src }) => src).filter(Boolean)).size).toBe(3);
  for (const image of images) {
    if (!image.hidden) expect(image.alt?.trim(), `missing alt for ${image.src}`).toBeTruthy();
    if (!image.src) continue;
    const response = await request.get(new URL(image.src, page.url()).toString());
    expect(response.status(), image.src).toBe(200);
  }
});

test('contact identity and social preview metadata are consistent and fetchable', async ({ page, request }) => {
  await page.goto('/');
  const email = 'amansharma.i5@gmail.com';
  await expect(page.locator(`a[href="mailto:${email}"]`)).toHaveCount(3);
  await expect(page.locator('a[href="https://www.linkedin.com/in/amansharmanm/"]')).toHaveCount(2);
  const person = await page.locator('script[type="application/ld+json"]').textContent();
  expect(JSON.parse(person).email).toBe(`mailto:${email}`);
  expect(JSON.parse(person).sameAs).toContain('https://www.linkedin.com/in/amansharmanm/');

  const image = page.locator('meta[property="og:image"]').getAttribute('content');
  await expect(page.locator('meta[property="og:image:type"]')).toHaveAttribute('content', 'image/jpeg');
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200');
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630');
  const socialCardUrl = await image;
  expect(socialCardUrl).toContain('/assets/images/social-card.jpg');
  const response = await request.get(new URL(new URL(socialCardUrl).pathname, page.url()).toString());
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('image/jpeg');
});

test('layout avoids horizontal overflow at required widths and on every case route', async ({ page }) => {
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
    const collision = await page.evaluate(() => {
      const title = document.querySelector('#hero-title')?.getBoundingClientRect();
      const surface = document.querySelector('.hero-surface--one')?.getBoundingClientRect();
      if (!title || !surface) return false;
      return Math.min(title.right, surface.right) > Math.max(title.left, surface.left)
        && Math.min(title.bottom, surface.bottom) > Math.max(title.top, surface.top);
    });
    expect(collision, `hero title overlaps its project surface at ${viewport.width}px`).toBe(false);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  for (const slug of projectSlugs) {
    await page.goto(`/projects/${slug}/`);
    const widths = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
    expect(widths.content, `horizontal overflow on ${slug} at 390px`).toBeLessThanOrEqual(widths.viewport + 1);
  }
});

test('reduced-motion and low-memory modes keep a complete static product fallback', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.cinematic-hero h1')).toBeVisible();
  await expect(page.locator('.cinematic-hero__three canvas')).toHaveCount(0);
  await expect(page.locator('.cinematic-hero__mark')).toBeVisible();
  await expect(page.locator('#highlights')).toBeVisible();
  const reducedShowroom = page.locator('.universe-showroom');
  await reducedShowroom.scrollIntoViewIfNeeded();
  await expect(reducedShowroom.locator('.scene-runtime--showroom canvas')).toHaveCount(0);
  await expect(reducedShowroom.locator('.universe-showroom__fallback')).toBeVisible();

  await page.addInitScript(() => Object.defineProperty(navigator, 'deviceMemory', { configurable: true, value: 2 }));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('.cinematic-hero__three canvas')).toHaveCount(0);
  await expect(page.locator('.cinematic-hero__mark')).toBeVisible();
  await expect(page.locator('.hero-surface--one img')).toBeVisible();
  const lowMemoryShowroom = page.locator('.universe-showroom');
  await lowMemoryShowroom.scrollIntoViewIfNeeded();
  await expect(lowMemoryShowroom.locator('.scene-runtime--showroom canvas')).toHaveCount(0);
  await expect(lowMemoryShowroom.locator('.universe-showroom__fallback')).toBeVisible();
});

test('desktop WebGL is interactive, on-demand and paused when its hero scrolls offscreen', async ({ page }) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.cinematic-hero__three canvas')).toHaveCount(0);
  await expect(page.locator('.cinematic-hero__mark')).toBeVisible();
  const initial3dRequests = await page.evaluate(() => performance.getEntriesByType('resource').filter((entry) => /ImmersiveScene/i.test(new URL(entry.name).pathname)).map((entry) => new URL(entry.name).pathname));
  expect(initial3dRequests, 'homepage 3D bundle must stay deferred until desktop interaction').toEqual([]);
  await page.mouse.move(400, 300);
  await page.waitForTimeout(200);
  await expect(page.locator('.cinematic-hero__three canvas')).toHaveCount(0);
  const afterPassivePointerMove = await page.evaluate(() => performance.getEntriesByType('resource').some((entry) => /ImmersiveScene/i.test(new URL(entry.name).pathname)));
  expect(afterPassivePointerMove, 'passive cursor movement must not download the 3D bundle').toBe(false);
  await page.evaluate(() => {
    const hero = document.querySelector('.cinematic-hero');
    if (!hero) throw new Error('Hero not found');
    const range = hero.offsetHeight - window.innerHeight;
    window.scrollTo({ top: hero.offsetTop + Math.round(range * 0.2), behavior: 'instant' });
  });
  await expect(page.locator('.cinematic-hero__three canvas')).toBeVisible({ timeout: 30_000 });
  await expect.poll(() => page.evaluate(() => performance.getEntriesByType('resource').some((entry) => /ImmersiveScene/i.test(new URL(entry.name).pathname)))).toBe(true);
  const scene = page.locator('.scene-runtime--hero');
  await expect(scene).toHaveAttribute('data-render-mode', 'on-demand');
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute('data-render-mode', 'paused-offscreen');
  const showroom = page.locator('.universe-showroom');
  await showroom.scrollIntoViewIfNeeded();
  const showroomScene = showroom.locator('.scene-runtime--showroom');
  await expect(showroomScene.locator('canvas')).toHaveCount(1, { timeout: 30_000 });
  await expect(showroomScene).toHaveAttribute('data-render-mode', 'on-demand');
  await expect(showroom.locator('.universe-showroom__active')).toContainText('CivicProof');
  await page.locator('.universe-projects').getByRole('button', { name: /DivyaDhun/ }).click();
  await expect(showroom.locator('.universe-showroom__active')).toContainText('DivyaDhun');
  await showroomScene.locator(':scope > div').click({ position: { x: 798, y: 205 } });
  await expect(showroom.locator('.universe-showroom__active')).toContainText('Watchroom');
});

test('first paint and mobile JavaScript stay within measured budgets', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.hero-surface--one img')).toBeVisible();
  await expect(page.locator('.cinematic-hero__three canvas')).toHaveCount(0);
  const metrics = await page.evaluate(() => {
    const resources = performance.getEntriesByType('resource');
    const scripts = resources.filter((entry) => new URL(entry.name).origin === location.origin && entry.name.endsWith('.js'));
    return {
      firstContentfulPaintMs: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0),
      sameOriginJavaScriptEncodedBytes: scripts.reduce((sum, entry) => sum + (entry.encodedBodySize || 0), 0),
      sameOriginImageEncodedBytes: resources.filter((entry) => new URL(entry.name).origin === location.origin && /\.(png|jpe?g|webp|avif|svg)(\?|$)/i.test(entry.name)).reduce((sum, entry) => sum + (entry.encodedBodySize || 0), 0),
      scripts: scripts.map((entry) => ({ path: new URL(entry.name).pathname, encodedBytes: entry.encodedBodySize || 0 }))
    };
  });
  await testInfo.attach('mobile-performance-budget.json', { body: Buffer.from(JSON.stringify(metrics, null, 2)), contentType: 'application/json' });
  expect(metrics.firstContentfulPaintMs).toBeGreaterThan(0);
  expect(metrics.firstContentfulPaintMs).toBeLessThan(4_000);
  expect(metrics.sameOriginJavaScriptEncodedBytes).toBeLessThan(550_000);
  expect(metrics.sameOriginImageEncodedBytes).toBeLessThan(170_000);
});

test('all generated routes have no uncaught browser errors and pass axe WCAG A/AA', async ({ page }) => {
  test.setTimeout(120_000);
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  for (const route of routeList) {
    await page.setViewportSize({ width: 1440, height: 900 });
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator('main')).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(results.violations.map(({ id, impact, nodes }) => ({ id, impact, count: nodes.length })), route).toEqual([]);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Sections' }).click();
  const mobileMenu = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(mobileMenu.violations.map(({ id, impact, nodes }) => ({ id, impact, count: nodes.length })), 'mobile menu').toEqual([]);
  expect(pageErrors).toEqual([]);
});

test('new-tab links are marked safe and verified public deployments are reachable', async ({ page, request }) => {
  await page.goto('/');
  const newTabLinks = await page.locator('a[target="_blank"]').evaluateAll((links) => links.map((link) => ({ href: link.href, rel: link.rel })));
  for (const link of newTabLinks) expect(link.rel.split(/\s+/)).toContain('noreferrer');

  for (const url of [
    'https://instafetch.pages.dev',
    'https://resume-fit-checker.pages.dev',
    'https://frost-and-flowers-store.amansharma-it5.workers.dev'
  ]) {
    const response = await request.get(url, { timeout: 45_000 });
    expect(response.status(), url).toBe(200);
  }
});
