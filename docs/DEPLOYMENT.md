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
```

## GitHub Pages

The owner-site URL is `https://amansharma-it5.github.io`. The Pages site can be checked with:

```powershell
gh api repos/amansharma-it5/amansharma-it5.github.io/pages
Invoke-WebRequest -Uri https://amansharma-it5.github.io/ -UseBasicParsing
```

If the workflow cannot deploy, open the repository on GitHub and choose **Settings → Pages**, then set the build and deployment source to **GitHub Actions**. The workflow needs `pages: write` and `id-token: write` permissions.

## Quality checks

The portfolio uses a deferred WebGL island with a reduced-motion / low-memory DOM fallback. Use a browser at mobile and desktop widths, verify the archive search and filters, and inspect the browser console for errors. Performance and Lighthouse results should only be reported after measuring them.
