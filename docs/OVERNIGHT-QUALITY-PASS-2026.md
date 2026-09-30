# Overnight quality pass — baseline

## Protected production baseline

- Production SHA: `28d08b2f935c6f92b85881b2339aa1d56145563b`
- Branch: `feat/overnight-autonomous-quality-pass`
- Production remains unchanged until Aman reviews and merges the PR.

## Baseline measurements

Captured from the branch before changes on 2026-09-30:

- `npm ci`: passed after stopping the stale local Astro preview process that held the Windows native compiler binary open.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- `npm run check`: 0 errors, 0 warnings, 0 hints across 24 files.
- `npm run build`: 11 static pages generated. Vite reported one large lazy 3D chunk (`ImmersiveScene`, intentionally deferred to the showroom/desktop path).
- `npm test`: passed — 11 HTML routes and 17 required outputs.
- `npm run test:browser -- --workers=1`: passed — 54 tests across Chromium, Firefox and WebKit.
- `npm run perf`: passed — mobile FCP 80ms, LCP 204ms, CLS 0, 0 same-origin JS bytes; desktop FCP/LCP 432ms, CLS 0, 64,355 encoded JS bytes.
- Baseline screenshots: 54 captures in the local ignored `artifacts/qa/overnight-baseline/` folder.

## Public-link audit

The homepage, GitHub profile, public project repositories and three public deployments returned HTTP 200 during this pass. LinkedIn returned HTTP 999 to the automated request, which is a LinkedIn anti-automation response rather than evidence that the profile is missing; the canonical URL is preserved and is covered in rendered markup tests.

## Scope of the implementation

This pass focuses on operational quality with no redesign of the approved Aman Archive composition:

1. Upgrade and SHA-pin first-party GitHub Actions to the researched Node 24-compatible releases.
2. Run the static smoke test and deterministic performance budget in CI before artifacts are uploaded.
3. Generate `sitemap.xml` from the same project data used to generate case-study routes.
4. Add a deterministic 320px/2560px and responsive-transition browser regression test.
5. Document research, evidence policy and privacy boundaries.

## Remaining review gate

The branch must pass the remote PR workflow before it is considered ready. The PR must state `Production unchanged — merge required.` No merge or deployment is authorized by this pass.
