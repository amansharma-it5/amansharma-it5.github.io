# Media inventory and loading policy

## Public media

The three screenshots are authentic captures of verified public websites. Each has a JPEG fallback/master and three responsive WebP variants (480 × 300, 768 × 480 and 1440 × 900).

| Project | JPEG master (1440 × 900) | WebP 480 × 300 | WebP 768 × 480 | WebP 1440 × 900 | Provenance |
| --- | ---: | ---: | ---: | ---: | --- |
| InstaFetch | 94,092 B | 10,770 B | 20,372 B | 45,882 B | Real capture of [instafetch.pages.dev](https://instafetch.pages.dev) |
| RecruitOS AI | 76,136 B | 8,466 B | 16,922 B | 41,430 B | Real capture of [resume-fit-checker.pages.dev](https://resume-fit-checker.pages.dev) |
| Frost & Flowers | 97,049 B | 12,380 B | 23,228 B | 53,662 B | Real capture of the verified public storefront |

The nine WebP variants total **233,112 bytes**. Their 1440 × 900 JPEG masters total 267,277 bytes; the original PNG captures were 1,016,118 bytes. `social-card.jpg` is a locally rendered 1200 × 630 Open Graph image (56,334 B); the legacy SVG social card is 1,697 B. `public/assets/icons/favicon.svg` is a 64 × 64 viewBox site mark (406 B).

The hero uses responsive `<picture>` sources and retains JPEG fallback. It requests the 480-pixel InstaFetch WebP on the 390-pixel initial viewport (10,770 B) and the 768-pixel variant at 1440px (20,372 B); it does not download all screenshot variants. The first hero visual is eager/high-priority. Later project screenshots are attached as their story chapters approach; other screenshots remain lazy. Existing image dimensions reserve layout space before decode. The heavy WebGL scene is gated behind user intent; a semantic monogram fallback is immediate.

Measured against the local production preview on 21 September 2026, the initial same-origin image transfer was **10,770 B mobile** and **20,372 B desktop**. Total same-origin transfer was 92,274 B mobile and 101,876 B desktop; browser-measured FCP/LCP were 180/528 ms mobile and 424/720 ms desktop. The WebGL bundle is not requested on either initial view. See the final quality audit for Lighthouse lab results and the emulation caveat.

`npm run capture:media` collects fresh public captures and records their source data; `npm run media:optimize` creates the responsive WebP variants using FFmpeg/libwebp, quality 84, compression level 6 and Lanczos scaling. The public JPEG masters are retained as fallbacks. Current image paths and verified live URLs are recorded in `src/data/projects.ts`.

## Private app media boundary

No private-project screenshot is included in the public inventory or website build. Six CivicProof screenshots with synthetic demo content remain in a local-only review folder with a separate approval manifest and sanitized thumbnails. They stay excluded from Git and deployment until Aman approves each exact asset. No DivyaDhun or Watchroom screenshots were available in the accessible repositories, and Android build/emulator tooling was unavailable during this pass. Those surfaces use explicitly labelled documented-flow diagrams, not simulated app screens.

## Loading and interaction

- Use authentic public deployment captures for website visuals; retain JPEG fallback and WebP `srcset`/`sizes` for responsive selection.
- Keep later chapter images lazy and only attach sources when their story approaches; retain fixed dimensions to prevent layout shift.
- Render project-derived diagrams as diagrams, never as implied screenshots. Keep their content sourced from verified project documentation.
- The product viewer opens public captures in an accessible dialog with Escape, a visible close button, backdrop dismissal and focus return.
- Dynamically load the WebGL monogram after pointer, scroll, wheel, touch or keyboard intent on capable motion-enabled desktop/tablet viewports. It renders on demand, pauses offscreen and is omitted for reduced motion, data saver, low-memory and narrow-mobile contexts.
- Keep fonts non-blocking and self-hosting is not required; no video, paid image host or third-party media service is used.

## Future media guardrails

- Record source URL or exact private approval, capture date, intended use, dimensions, file size and sensitivity notes before adding media.
- Keep private-source captures out of the public tree until the owner approves the exact files.
- Preserve screenshot aspect ratio and avoid implying a view that was not captured.
- Keep encoded JavaScript under 550 KB and initial same-origin image bytes under 170 KB in browser QA budgets. Any future image sequence needs an authentic static keyframe and an explicit transfer/decode budget.
