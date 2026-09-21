# Automotive-style motion and story audit

Reference reviewed: [Mahindra](https://www.mahindra.com/)

This is an interaction and pacing study, not a visual or code reproduction. The portfolio takes the restrained product-reveal approach the owner asked for—strong opening frame, deliberate scroll progression, crisp type and transitions that reveal the next idea—then expresses it through Aman’s own monogram, verified projects and dark architectural visual language. No Mahindra logo, vehicle imagery, copy, fonts or source code are used.

## Translation into the portfolio

- **Hero:** A bespoke extruded AS sculpture is the signature object. Scroll progress moves between genuine captures from the three public websites; it does not use fabricated screens or an autoplay video. The 3D scene is WebGL and loads only on capable, motion-enabled desktop/tablet contexts.
- **Product universe:** Category tabs, project selectors and story-step controls change a stable visual stage rather than adding decorative movement. Website projects use verified captures with a full-size accessible viewer. Desktop adds selectable, model-only 3D phone/monitor objects; their screens stay blank and their restrained lift/turn communicates selection. App work uses documented flow diagrams that explicitly say they are not screenshots.
- **Case studies:** A single sticky visual follows project-specific story beats. Selecting a beat or scrolling backward updates the same stage; motion is tied to the case-study narrative.
- **Navigation:** A persistent local navigation tracks the section crossing a consistent reading line. Links remain native anchors, and the mobile disclosure is keyboard-operable with focus restoration.
- **Fallbacks:** Reduced-motion, low-memory, data-saver and narrow-mobile contexts retain a complete static/HTML experience. WebGL pauses when outside the viewport and renders on demand.

## Motion constraints

The design intentionally avoids a constant parallax layer, floating particles, autoplay media and motion that does not explain a product. The sequence is reversible by scrolling, has a visible static monogram fallback, and respects `prefers-reduced-motion`. Public screenshots are progressively requested as their hero chapter approaches; unopened chapters do not download their image.

## Verification

The final preview was captured at 390×844, 768×1024, 1440×900 and 1728×1117: 54 screenshots cover hero start/middle/end, highlights, product universe, the large-screen 3D showroom, discipline sections, archive, contact and all three flagship case-study openings. Playwright exercises keyboard and touch input, tab state, modal behavior, search, filters, reverse story scrolling, responsive overflow, reduced motion, WebGL lifecycle and external links. Axe runs on every generated route and the expanded mobile menu.

Measured in Chromium against the production build preview on 21 September 2026 after responsive-image and intent-gated WebGL changes: mobile (390×844) FCP/LCP 180/528 ms, CLS 0, 65,934 encoded JavaScript bytes, 10,770 image bytes and 92,274 total same-origin bytes; desktop (1440×900) FCP/LCP 424/720 ms, CLS 0, 65,934 encoded JavaScript bytes, 20,372 image bytes and 101,876 total same-origin bytes. Neither initial profile requests the WebGL bundle; pointer/scroll/touch/keyboard intent enables the real on-demand scene on capable desktop/tablet devices. Lighthouse 13 simulated lab scores are mobile Performance 91 and desktop Performance 97; Accessibility, Best Practices and SEO scored 100 in both. Full values and the Windows post-report `EPERM` cleanup caveat are in [`docs/PRODUCTION-QUALITY-AUDIT.md`](PRODUCTION-QUALITY-AUDIT.md#final-premium-upgrade--release-candidate-verification). Raw Chromium transfer report: `artifacts/qa/reports/performance.json`.

## Private media boundary

The six local CivicProof review images remain outside the repository and deployment until Aman approves the exact files. Until then, CivicProof, DivyaDhun and Watchroom use clearly labelled, story-derived diagrams rather than mock app screens. No private repository links, source code or confidential material are published.
