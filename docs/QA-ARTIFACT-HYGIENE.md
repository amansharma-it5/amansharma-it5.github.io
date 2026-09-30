# QA artifact hygiene

The repository keeps a curated set of visual evidence and machine-readable reports for release review. Repeated local captures should not grow the repository indefinitely.

## Keep in Git

- `artifacts/qa/reports/` — the current curated smoke, Playwright and deterministic performance reports used to explain a release.
- `artifacts/qa/future-civilization-optimized/` — the approved before/after visual evidence for the current release direction.
- `artifacts/qa/final-premium-release-2026-09-21/` — the prior release evidence retained for visual comparison.

## Generate locally or in CI

- `artifacts/qa/overnight-*/` — baseline and iteration screenshots from a maintenance session.
- `artifacts/qa/runs/` — future run-specific evidence.
- `test-results/` and `playwright-report/` — already ignored and should remain CI artifacts rather than source files.

The generated overnight folders are ignored in `.gitignore`; they remain available locally for review during a session and can be uploaded to a PR as temporary artifacts when needed.

## Privacy boundary

Never place private Android screenshots, private repository URLs, credentials, personal documents or machine-local paths in a committed QA artifact. For private projects, the approved documentation-derived diagrams remain the only public visual evidence unless Aman explicitly approves a screenshot.
