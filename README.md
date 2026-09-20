# Aman Sharma — personal portfolio

Immersive Astro portfolio for `amansharma-it5`, built with TypeScript, React, React Three Fiber, Three.js, Drei and GSAP. GitHub Actions builds the static output and deploys it to GitHub Pages at [amansharma-it5.github.io](https://amansharma-it5.github.io).

## Structure

- `src/pages/index.astro` — immersive home, 3D hero, showroom, practice and contact.
- `src/pages/projects/index.astro` — searchable and filterable project archive.
- `src/pages/projects/[slug].astro` — generated case-study pages for each verified project.
- `src/data/projects.ts` — the evidence-backed project inventory used by the site.
- `src/components/ImmersiveScene.tsx` — procedural Three.js sculpture and showroom modules.
- `src/components/ProjectExplorer.tsx` — filter, search and project-card interactions.
- `src/styles/global.css` — responsive visual system and non-3D fallback styling.
- `.github/workflows/deploy.yml` — type check, build and GitHub Pages deployment.
- `docs/PROJECT-INVENTORY.md` — provenance and confidence notes.
- `docs/DEPLOYMENT.md` — deployment and maintenance notes.

## Add another project

1. Add one object to `src/data/projects.ts` with a unique `slug`, evidence-backed description, status, stack and links.
2. Add the slug to `public/sitemap.xml`.
3. Run `npm run check`, `npm run build` and `npm test`.
4. Push `main`; GitHub Actions publishes `dist/` through the Pages artifact deployment.

Private repositories should remain described without publishing private URLs or source files. Only include a live demo or GitHub button when the destination is verified.

## Contact

- LinkedIn: https://www.linkedin.com/in/amansharmanm/
- Email: amansharma.i5@gmail.com
