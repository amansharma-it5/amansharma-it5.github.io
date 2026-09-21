# Production quality audit

Audit date: 2026-09-20
Repository: `amansharma-it5/amansharma-it5.github.io`
Production: <https://amansharma-it5.github.io/>
Baseline commit: `04fc82ec0babe29d5be805054adceb95734089eb`
Release branch: `feat/production-quality-release`

## Scope and evidence

The baseline was inspected from the clean production commit before release work began. The deployed site was captured at four required viewport sizes and at the hero, highlights, product-universe, archive, contact and case-study checkpoints. Baseline evidence is retained in `artifacts/qa/baseline/` and the capture manifest is `artifacts/qa/baseline/manifest.json`.

The baseline contained eight evidence-backed project records and eleven generated HTML routes. The public project records were linked to three verified deployments: InstaFetch, RecruitOS AI and Frost & Flowers. The remaining Android projects are private repositories and did not include approved screenshot media in this workspace.

## Findings before remediation

| Priority | Finding | Reproduction | Expected result |
| --- | --- | --- | --- |
| P0 | Global header links pointed to `/#work` and `/#labs`, but the home page exposes `#highlights`, `#projects`, `#apps`, `#web`, `#ai`, `#about` and `#contact`. | Open any page, activate Work or Archive. | The link lands on an existing section. |
| P0 | `Highlights` installed a window-level ArrowLeft/ArrowRight listener. | Focus a form field or any unrelated control, press an arrow key. | Only the focused carousel should respond; text fields and unrelated controls must keep their native behavior. |
| P1 | The hero sculpture was a generic icosahedron/torus composition with no project-specific visual language. | Open the hero at desktop width. | The object should have a deliberate product/portfolio concept and a non-WebGL fallback. |
| P1 | Private Android surfaces used synthetic UI-like decoration without explicitly saying that approved screenshots were unavailable. | Open CivicProof, DivyaDhun or Watchroom visuals. | Decorative visuals must be labelled as decorative/private-source material, never as authentic screenshots. |
| P1 | Case-study beats repeated the same engineering paragraph for every beat. | Open any `/projects/*/` route and scroll the story. | Each beat should have a project-specific title, explanation and visual treatment. |
| P1 | The frame-sequence component had no approved sequence asset and was not used. | Inspect the production bundle and public assets. | Do not ship a heavy sequence until source frames and a performance budget exist. |
| P1 | Automated coverage only checked generated files and the HTML title. | Run `npm test`. | Browser behavior, responsive layout, keyboard scope, links and accessibility need executable coverage. |
| P1 | No persistent baseline/final viewport evidence existed in the repository. | Inspect the repository before this audit. | Required viewports and checkpoints should be retained under a QA directory or CI artifact. |
| P1 | Mobile homepage showed both the global navigation and the sticky section navigation, duplicating brand/menu controls. | Open the home page at 390×844. | Show one persistent menu, with access to all sections and the full archive. |
| P1 | Professional organization details for Agilocity Staffing and Vanshara were not present in the verified project sources. | Search the project data and public repository material. | Do not invent employment/client facts; document the missing verification instead. |

## Remediation plan

1. Correct header anchors and add scroll offsets for the sticky header.
2. Scope carousel keyboard handling to the carousel root and ignore inputs, editable content and nested controls.
3. Replace the generic hero geometry with a restrained product-constellation sculpture that maps to the portfolio's verified product categories.
4. Capture only public deployment screenshots from the three verified live URLs. Keep private Android projects on clearly labelled decorative maps until approved screenshots are supplied.
5. Add project-specific story beats to the evidence model and render them as unique case-study content.
6. Keep frame-sequence code out of the runtime path until real approved frames are available and measured.
7. Add Playwright browser, responsive, navigation, keyboard, reduced-motion, image and external-link checks, plus axe accessibility checks.
8. Re-capture the same four viewports after remediation and retain the final manifest alongside the baseline.
9. Collapse the mobile homepage to one sticky section menu and preserve a direct link to the full project archive.

## Content and privacy boundary

All portfolio claims must remain within the verified public repository/deployment material and the existing project records. Private repository names, source code, credentials, API keys and confidential screenshots are not exposed. Agilocity Staffing and Vanshara are intentionally not described as employers, clients or projects until the user provides a verifiable public source.

## Release gate

The replacement is not considered ready for `main` or production until `npm ci`, `npm run check`, `npm run build`, the smoke test, the Playwright suite, accessibility checks, responsive screenshots and live deployment verification all pass on the release candidate.

## Remediation and verification results

Verified on the release branch against the generated static preview:

- Navigation now targets existing home sections; sticky-section offsets are applied.
- Carousel arrow handling is local to its focusable region; interactive controls and search fields retain native arrow behavior. Product-category tabs support roving focus and Left/Right/Home/End keys.
- The hero geometry is now an original architectural product monolith with restrained orbit facets. It remains lazy-loaded and has a reduced-motion/low-resource fallback.
- Public browser surfaces use viewport captures taken from the three verified live deployments (all returned HTTP 200 at capture time). Private Android surfaces carry explicit “decorative map / private source” provenance and do not imply authentic screenshots.
- Case-study stories are modeled per project, have distinct titles/descriptions, and show a changing story-focus visual; the observer is scoped to the story component.
- The unused frame-sequence component remains out of the runtime path because no approved sequence frames exist.
- Header links, mobile navigation, filters, search, all eight case-study routes, reduced motion, image paths, external deployments, and responsive widths are covered by Playwright.
- At widths through 900px, the homepage now uses a single persistent section menu; its expanded menu includes every home section plus a direct Full archive route. The browser test waits for React hydration before exercising the control.
- `npm ci` completed; `npm run check` reported 0 errors, 0 warnings, and 0 hints across 21 files; `npm run build` generated 11 static routes; `npm test` verified 11 HTML routes and 16 required outputs; `npm audit --audit-level=high` found 0 vulnerabilities.
- Playwright production-preview suite: 11/11 passed after the final mobile navigation change. Axe WCAG 2.1 A/AA: 0 violations on desktop home, mobile home and CivicProof case study. Chromium mounted a WebGL canvas and also exercised the reduced-motion fallback.
- Production-preview first contentful paint was 212 ms at 390×844 and 276 ms at 1440×900. Same-origin JavaScript encoded transfer was 299,863 bytes (under the 550,000-byte budget); total same-origin transfer was 631,962 bytes. Full measurements are in `artifacts/qa/reports/performance.json`.
- Baseline and final screenshot manifests are retained under `artifacts/qa/baseline/` and `artifacts/qa/final/` (36 captures each at the four requested viewport sizes). Final capture used the local production preview, not the development server.

The build continues to report one minified WebGL chunk above its 500 kB raw-size advisory threshold (852,749 bytes on disk). It is dynamically loaded, not in the initial HTML, and measured at 224,070 encoded bytes in Chromium; the enforced JavaScript transfer budget passes. Keep monitoring this chunk if more 3D features are added.

Production has not been replaced during this audit. The remaining release actions are branch review/merge and then verifying that GitHub Pages serves the new release. Organization-specific Agilocity Staffing/Vanshara facts remain excluded until verifiable source material is available.
