# Overnight quality pass — pull request evidence

## Release boundary

- Baseline: `origin/main` at `28d08b2f935c6f92b85881b2339aa1d56145563b`.
- Branch: `feat/overnight-autonomous-quality-pass`.
- Production was not modified. Merge is intentionally required before any deployment.

## Implemented

- Updated first-party GitHub Actions to verified Node 24-compatible releases and pinned each action to a commit SHA.
- Added static smoke-test and deterministic performance-budget stages to the Pages workflow.
- Generated `/sitemap.xml` from the project inventory used by case-study routes, preventing route drift.
- Added a 320px/2560px responsive regression test and responsive-direction transition coverage.
- Added the research, artifact-hygiene and privacy-boundary records in `docs/`.

## Evidence

- Baseline browser suite: 54 passed across Chromium, Firefox and WebKit.
- Final browser suite: 57 passed across Chromium, Firefox and WebKit.
- Final checks: 0 errors, 0 warnings, 0 hints across 25 Astro files.
- Final static smoke test: 11 HTML routes and 17 required outputs verified.
- Final deterministic performance budget: mobile FCP 84 ms, LCP 212 ms, CLS 0; desktop FCP/LCP 492 ms, CLS 0. Mobile same-origin JavaScript remained 0 bytes.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- Final QA capture: 54 screenshots in the ignored local folder `artifacts/qa/overnight-final/`.

## Browser and accessibility coverage

The existing suite retains its axe accessibility checks, semantic navigation checks, reduced-motion fallback, low-memory fallback, WebGL-on-demand behavior, offscreen deferral, project links, case-study routes and privacy assertions. The new responsive test adds 320px and 2560px overflow checks plus mobile/desktop header behavior.

## Review notes

- LinkedIn returned HTTP 999 to automated `curl`, consistent with LinkedIn anti-automation behavior; the canonical link remains unchanged and is covered in rendered markup tests.
- The build retains one intentional lazy 3D chunk warning from Vite. It is deferred from the static/mobile path and is not a new regression.
- Existing tracked legacy root files were left untouched because they are outside the current Astro `dist` publishing path and removing them would expand scope without evidence of benefit.

## Required before release

The PR workflow must pass on GitHub. After review, Aman can merge the PR; only then should the existing main-only Pages deploy run. No private Android screenshots or private repository information were added.
