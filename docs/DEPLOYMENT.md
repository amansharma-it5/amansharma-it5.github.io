# Deployment and maintenance

The repository is configured for GitHub Pages from `main` / root. There is no build step, package manager or backend.

## Local preview

From the repository root:

```powershell
python -m http.server 4173
```

Open `http://127.0.0.1:4173/` and check the homepage, project archive, filters, search, mobile menu and case-study links.

## GitHub Pages

The owner-site URL is `https://amansharma-it5.github.io`. The Pages site can be checked with:

```powershell
gh api repos/amansharma-it5/amansharma-it5.github.io/pages
Invoke-WebRequest -Uri https://amansharma-it5.github.io/ -UseBasicParsing
```

If Pages is not enabled by the API, open the repository on GitHub and choose **Settings → Pages → Deploy from a branch → main → /(root) → Save**.

## Quality checks

The portfolio uses no third-party runtime dependencies. Validate HTML structure with an available browser or HTML checker, run the static link scan, and use a browser at 375px, 768px, 1024px and 1440px widths. Performance and Lighthouse results should only be reported after measuring them.
