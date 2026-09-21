# Deployment and maintenance

The repository builds as a static Astro site and deploys through `.github/workflows/deploy.yml` using the GitHub Pages artifact workflow. GitHub Pages remains the only hosting provider.

## Local preview

From the repository root:

```powershell
npm install
npm run dev
```

Open `http://127.0.0.1:4321/` and check the homepage, project archive, filters, search, mobile menu, case-study links and WebGL fallback.

The production checks are:

```powershell
npm run check
npm run build
npm test
npm run test:browser
npm audit --audit-level=high
```

For measured browser vitals and transfer budgets, build first and serve the static output on port 4323. In PowerShell, set `$env:BASE_URL='http://127.0.0.1:4323'`, then run `npm run perf`. The script records FCP, LCP, CLS, encoded JavaScript/image bytes and WebGL fallback/render mode to `artifacts/qa/reports/performance.json`.

For Lighthouse lab checks against the same production preview, run the mobile and desktop profiles separately to avoid CPU contention. Lighthouse 13 is installed on demand and the JSON reports belong in the local QA evidence folder:

```powershell
npx --yes lighthouse $env:BASE_URL --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=artifacts/qa/reports/lighthouse-mobile.json
npx --yes lighthouse $env:BASE_URL --preset=desktop --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=artifacts/qa/reports/lighthouse-desktop.json
```

Record the CLI exit status as well as whether a JSON report was written. On Windows, Chrome Launcher may report an `EPERM` while deleting its temporary profile after the completed report is written; do not describe that command as a clean exit.

Capture the responsive release set with `npm run capture:qa`; set `$env:BASE_URL` to the production preview and `$env:QA_OUTPUT` to a new evidence folder. Do not overwrite older baseline/final captures.

## GitHub Pages

The owner-site URL is `https://amansharma-it5.github.io`. The Pages site can be checked with:

```powershell
gh api repos/amansharma-it5/amansharma-it5.github.io/pages
Invoke-WebRequest -Uri https://amansharma-it5.github.io/ -UseBasicParsing
```

If the workflow cannot deploy, open the repository on GitHub and choose **Settings → Pages**, then set the build and deployment source to **GitHub Actions**. The workflow needs `pages: write` and `id-token: write` permissions.

## Quality checks

The portfolio uses deferred hero and showroom WebGL islands with reduced-motion, low-memory, data-saver and mobile fallbacks. The browser suite checks axe WCAG A/AA against every generated route and the expanded mobile menu. For release-level lab checks, run Google Lighthouse against the static preview in mobile and desktop mode and retain the JSON reports under the local QA reports folder; do not publish a score that has not been measured.
