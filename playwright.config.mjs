import { defineConfig } from '@playwright/test';

const port = process.env.PLAYWRIGHT_PORT ?? '4332';
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        launchOptions: {
          firefoxUserPrefs: {
            'webgl.disabled': false,
            'webgl.force-enabled': true,
            'webgl.disable-fail-if-major-performance-caveat': true
          }
        }
      }
    },
    { name: 'webkit', use: { browserName: 'webkit' } }
  ],
  reporter: [
    ['list'],
    ['json', { outputFile: 'artifacts/qa/reports/playwright.json' }]
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: `npm run preview -- --host 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: process.env.PLAYWRIGHT_REUSE_SERVER === 'true' && !process.env.CI,
    env: { ASTRO_PREVIEW_BACKGROUND: '0' },
    timeout: 120_000
  }
});
