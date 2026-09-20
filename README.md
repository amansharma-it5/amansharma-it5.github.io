# Aman Sharma — personal portfolio

Static GitHub Pages portfolio for `amansharma-it5`, built with plain HTML, CSS and lightweight JavaScript. The site is intentionally dependency-free so it can be hosted from the `main` branch at the repository root.

## Structure

- `index.html` — home, selected work, about, expertise, timeline, Aman Labs and contact.
- `projects/index.html` — searchable and filterable project archive.
- `projects/<slug>/index.html` — dedicated case-study shells for each project.
- `assets/js/data.js` — the single project inventory used by the homepage, gallery and case studies.
- `assets/js/app.js` — rendering, navigation, filtering, search and reveal behavior.
- `docs/PROJECT-INVENTORY.md` — provenance and confidence notes.
- `docs/DEPLOYMENT.md` — deployment and maintenance notes.

## Add another project

1. Add one object to `assets/js/data.js` with a unique `slug`, evidence-backed description, status, stack and links.
2. Create `projects/<slug>/index.html` using an existing case-study shell and set `data-project="<slug>"`.
3. Add the canonical URL to `sitemap.xml`.
4. Run the local checks in `docs/DEPLOYMENT.md`, then commit and push to `main`.

Private repositories should remain described without publishing private URLs or source files. Only include a live demo or GitHub button when the destination is verified.
