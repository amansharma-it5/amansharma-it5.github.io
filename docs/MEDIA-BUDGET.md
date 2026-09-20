# Media budget and loading policy

## Scope

This rebuild is intentionally media-light. The cinematic language comes from original CSS surfaces, existing verified screenshots, and the existing Three.js scene rather than a large bundle of copied video or image-sequence assets.

## Current inventory

| Asset | Approx. size | Role | Loading policy |
| --- | ---: | --- | --- |
| `assets/images/frost-flowers.jpg` | 213 KB | Verified catalogue project visual | Lazy in project cards; decoded by the browser when selected |
| `assets/images/instafetch-preview.png` | 254 KB | Verified browser project visual | Lazy in project cards; reused in project surfaces |
| `assets/images/resume-fit-preview.png` | 68 KB | Verified RecruitOS AI visual | Lazy in project cards; reused in project surfaces |
| `assets/icons/favicon.svg` | <1 KB | Site chrome | Immediate |
| CSS-created product surfaces | 0 additional bytes | Hero, private-project and device treatments | Rendered locally in CSS/DOM |

The tracked raster inventory is roughly **535 KB before compression and transfer encoding**. No remote image, video, or font dependency is required by the new narrative layer.

## Sequence policy

`src/components/FrameSequence.tsx` provides a DPR-aware, lazy frame-sequence primitive for future verified media. It loads the first, last, midpoint and quarter frames first, then schedules the remaining frames during idle time. No unverified sequence is shipped in this release, so the current hero cannot fail because a heavy media sequence is missing.

## Performance guardrails

- Keep the initial hero useful with JavaScript disabled and with reduced motion enabled.
- Keep project imagery local and reuse the same verified assets rather than generating duplicates.
- Prefer `width`/`height`, `decoding="async"` and `loading="lazy"` for future raster additions.
- Add a media asset only when it documents a real project surface and its license/source is recorded in `docs/PROJECT-INVENTORY.md`.
- If a future frame sequence exceeds 2 MB compressed or 6 MB decoded, gate it behind a user-visible chapter and provide a static keyframe fallback.
- Treat the first route as a static GitHub Pages document: no API, video CDN, or runtime data request is required.

## QA evidence to record

Before release, collect browser measurements for navigation timing, resource transfer size and console errors. The release report should distinguish measured browser values from estimates; this file is policy, not a claim that a Lighthouse audit has been run.
