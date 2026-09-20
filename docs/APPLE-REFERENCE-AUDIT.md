# Apple iPhone 18 Pro reference audit

Reference reviewed: [Apple iPhone 18 Pro (India)](https://www.apple.com/in/iphone-18-pro/)

This is an experience audit, not a source-code or asset reproduction. Apple’s page is a long-form product story: it establishes a product, earns attention with a highlights rail, then progressively explains design, camera, video, battery, performance and comparison. The portfolio translates those principles into Aman’s verified projects and keeps every meaningful statement in semantic HTML.

## Global navigation and local navigation

**Reference behaviour** → A compact global header is followed by a product-specific local navigation with Overview, Highlights, Design, Cameras, Performance, shared features, accessories and technical specifications.

**Why it works** → The visitor always knows where they are in a long page and can jump between narrative chapters without losing the product context.

**Aman translation** → Keep Aman’s identity in the global header and add a sticky local portfolio nav: Overview, Highlights, Projects, Apps, Web, AI / Automation, About and Contact.

**Implementation approach** → `LocalNav.tsx` uses semantic links, an `IntersectionObserver` for `aria-current`, and a mobile disclosure. It does not hijack native scrolling.

**Mobile approach** → The local nav becomes a compact horizontal scroller with a visible current item; the global menu remains a normal keyboard-operable disclosure.

**Accessibility fallback** → All destinations remain ordinary anchors. If JavaScript is unavailable, links and section headings still work.

## Hero and product narrative

**Reference behaviour** → The page opens with a restrained product title and a near-black presentation stage, then introduces the “Get the highlights” section before moving into deeper chapters.

**Why it works** → The first viewport creates product focus instead of presenting a dashboard of links. Motion has a clear narrative arc and is tied to scroll progress.

**Aman translation** → The hero presents Aman’s work as the product: typography first, then genuine project surfaces and premium device/browser compositions.

**Implementation approach** → `CinematicHero.tsx` owns a 320vh narrative wrapper and a sticky 100vh stage. Scroll progress is normalized to 0–1 and mapped deterministically to surface opacity, scale, position and stage colour through one `requestAnimationFrame` loop.

**Mobile approach** → The sequence shortens to a flowing hero with a smaller stage; it does not create a blank 300vh pin or download a desktop frame sequence.

**Accessibility fallback** → The same project names, descriptions and links are rendered as visible HTML. Reduced motion disables scrubbing and shows the final composed state.

## Highlights rail

**Reference behaviour** → “Get the highlights” presents several large, media-dominant feature moments rather than a dense grid of equal cards.

**Why it works** → Visitors understand the product’s strongest benefits before reading technical detail. The visual is the primary object and copy is deliberately short.

**Aman translation** → A 6-project highlight rail covers DivyaDhun, CivicProof, Watchroom, InstaFetch, RecruitOS AI and Frost & Flowers.

**Implementation approach** → `Highlights.tsx` provides previous/next controls, pagination, keyboard support, touch-friendly scroll snap and one active visual at a time. Public screenshots are reused; private projects use original CSS device surfaces rather than fabricated screenshots.

**Mobile approach** → Horizontal snap cards become the primary interaction, with controls retained for keyboard and assistive technology users.

**Accessibility fallback** → Each slide has a labelled region, status text, link and visible focus state. No information depends on the transition.

## Product viewer and selectors

**Reference behaviour** → Apple uses colour selectors, size selectors and comparison controls to let visitors change the product configuration without a layout jump.

**Why it works** → The visitor becomes an active participant while the page keeps one stable visual stage.

**Aman translation** → “The Product Universe” switches between Apps, Web, AI and Experiments and updates the featured project, visual, summary and CTA.

**Implementation approach** → `ProductUniverse.tsx` uses a small React island and crossfades only the active visual. WebGL remains optional and is not the only presentation of the project.

**Mobile approach** → Category controls become a horizontal scroll list and the active project visual flows above its supporting details.

**Accessibility fallback** → Buttons expose `aria-pressed`; all project metadata remains in the DOM and the viewer has a static initial state.

## Feature chapters and sticky media

**Reference behaviour** → Design, camera, video, battery and performance chapters pair short editorial copy with large media and changing supporting details.

**Why it works** → One visual stage can explain several related ideas without repeating a card grid. The scroll position supplies context.

**Aman translation** → Case studies use a reusable `ScrollStory` with a sticky visual and verified feature beats: CivicProof evidence timeline, DivyaDhun discovery/playback, Watchroom room/sync foundations, InstaFetch preview-first utility, RecruitOS local analysis and Frost & Flowers catalogue boundary.

**Implementation approach** → `ScrollStory.tsx` observes beats and updates one active index. CSS handles the crossfade and `position: sticky` handles the stage; no independent animation loop runs while the user is idle.

**Mobile approach** → Sticky media is removed or shortened. Each beat becomes a normal block with its visual directly adjacent so the page never feels pinned or empty.

**Accessibility fallback** → Beat text and feature labels are always present; the sticky media is decorative/augmentative and does not carry the only meaning.

## Comparison and lower-page architecture

**Reference behaviour** → Comparison and technical-spec sections appear after the main emotional story, using large facts and structured rows.

**Why it works** → Visitors can move from inspiration to decision-making without forcing a table into the opening experience.

**Aman translation** → Keep the searchable archive as the “Explore all projects” comparison surface and place verified facts, build principles, GitHub and contact after the highlights.

**Implementation approach** → Existing project data remains the source of truth. Filters, search and status labels stay semantic and responsive.

**Mobile approach** → Use stacked comparison rows and filter chips, never a wide table that requires accidental horizontal scrolling.

**Accessibility fallback** → Search and filter controls expose live result counts; project links remain indexable static routes.

## Motion, performance and reduced motion

**Reference behaviour** → Product presentation uses large media stages, controlled scroll-linked transforms, progressive loading and long pauses between moments of emphasis.

**Why it works** → The motion feels expensive because it is sparse, reversible and attached to meaning.

**Aman translation** → Motion tokens live in `src/motion/tokens.ts`; native scroll remains authoritative; `requestAnimationFrame` is used only for the hero scrub loop.

**Implementation approach** → Prefer CSS transitions and `IntersectionObserver`; no Lenis, no autoplay audio, no decorative infinite loops. The frame-sequence contract is documented for future deterministic media without shipping a heavy sequence now.

**Mobile approach** → Reduce stage heights, DPR and surface count. Do not load desktop-only media when a static project visual is enough.

**Accessibility fallback** → `prefers-reduced-motion: reduce` disables scrubbing, transforms and non-essential transitions while preserving hierarchy and content.

## Asset and legal boundary

Only repository-owned assets under `assets/images/` are used. No Apple fonts, trademarks, product renders, videos, logos, CSS or JavaScript are copied. Private projects remain described at a high level without private repository URLs.

## Reference source notes

The live page identifies the principal chapters as Highlights, Design, Pro camera system, Pro video, Battery life, Performance and comparison. It also exposes product colour/size selectors and a local product navigation. These observations are based on the current page structure and copy visible in the official page source, checked on 20 September 2026.
