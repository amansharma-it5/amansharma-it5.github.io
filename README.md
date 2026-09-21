# Aman Sharma — personal portfolio

Immersive Astro portfolio for `amansharma-it5`, built with TypeScript, React, React Three Fiber and Three.js. GitHub Actions builds the static output and deploys it to GitHub Pages at [amansharma-it5.github.io](https://amansharma-it5.github.io). The CI runtime is Node.js 24.

## Structure

- `src/pages/index.astro` — immersive home, cinematic 3D hero, project showroom, practice and contact.
- `src/pages/projects/index.astro` — searchable and filterable project archive.
- `src/pages/projects/[slug].astro` — generated case-study pages for each verified project.
- `src/data/projects.ts` — the evidence-backed project inventory used by the site.
- `src/components/ImmersiveScene.tsx` — original Aman Sharma monogram sculpture, scroll/pointer response and on-demand WebGL lifecycle.
- `src/components/ProjectVisual.tsx` — authentic public website captures, documented app-flow diagrams and accessible full-size image dialog.
- `src/components/ProjectExplorer.tsx` — filter, search and project-card interactions.
- `src/styles/global.css` — responsive visual system and non-3D fallback styling.
- `.github/workflows/deploy.yml` — type check, build and GitHub Pages deployment.
- `docs/PROJECT-INVENTORY.md` — provenance and confidence notes.
- `docs/AUTOMOTIVE-STORY-AUDIT.md` — original motion direction based on the owner's Mahindra reference.
- `docs/MEDIA-BUDGET.md` — screenshot provenance, loading rules and measured transfer budgets.
- `docs/PROFESSIONAL-IDENTITY-RESEARCH.md` — verified LinkedIn facts and source limitations.
- `docs/DEPLOYMENT.md` — deployment and maintenance notes.
- `docs/PRODUCTION-QUALITY-AUDIT.md` — release audit, remediations and verification results.
- `artifacts/qa/final-premium-release-2026-09-21/` — four-viewport release captures, including hero, product sections, the desktop 3D showroom and all three flagship case studies.

## Add another project

1. Add one object to `src/data/projects.ts` with a unique `slug`, evidence-backed description, status, stack and links.
2. Add the slug to `public/sitemap.xml`.
3. Run `npm ci`, `npm run check`, `npm run build`, `npm test`, `npm run test:browser` and `npm audit --audit-level=high`.
4. Push `main`; GitHub Actions publishes `dist/` through the Pages artifact deployment.

Private repositories should remain described without publishing private URLs or source files. Only include a live demo or GitHub button when the destination is verified.

Public website visuals are authentic captures of the live deployments. Private Android concepts use documentation-derived flow diagrams until exact app screenshots are approved. To refresh production media, run `npm run capture:media` followed by `npm run media:optimize` (FFmpeg with libwebp is required for responsive variants); to capture a QA set, build the site and run `npm run capture:qa` with `BASE_URL` set to a local production preview or the verified production URL. Render the original JPG social card with `npm run social:render`.

## Contact

- LinkedIn: https://www.linkedin.com/in/amansharmanm/
- Email: amansharma.i5@gmail.com
