export type ProjectStatus = 'Live' | 'MVP / pre-release' | 'In development' | 'Paused';
export type ProjectKind = 'phone' | 'browser' | 'code' | 'catalogue';

export interface ProjectStoryBeat {
  label: string;
  title: string;
  description: string;
}

export interface Project {
  slug: string;
  name: string;
  eyebrow: string;
  category: string;
  filters: string[];
  status: ProjectStatus;
  statusTone: 'live' | 'build' | 'amber' | 'paused';
  summary: string;
  problem: string;
  audience: string;
  features: string[];
  stack: string[];
  engineering: string;
  journey: string;
  story: ProjectStoryBeat[];
  source: string;
  confidence: string;
  featured?: boolean;
  kind: ProjectKind;
  image?: string;
  imageAlt?: string;
  repo?: string;
  live?: string;
  privateRepo?: boolean;
  accent: string;
}

export const filters = [
  { id: 'all', label: 'All work' },
  { id: 'android', label: 'Android' },
  { id: 'websites', label: 'Web' },
  { id: 'ai', label: 'AI / automation' },
  { id: 'business', label: 'Business' },
  { id: 'experiments', label: 'Experiments' }
];

export const projects: Project[] = [
  {
    slug: 'civicproof',
    name: 'CivicProof',
    eyebrow: 'CIVIC EVIDENCE / ANDROID',
    category: 'Android app',
    filters: ['android'],
    status: 'MVP / pre-release',
    statusTone: 'amber',
    summary: 'An offline-first Android app for documenting civic issues with timestamped evidence, follow-ups, status tracking and shareable PDF reports.',
    problem: 'Civic issues often need organized, dated evidence rather than scattered photos and messages. CivicProof keeps a case, its location, notes, photos, follow-ups and resolution history together on the device.',
    audience: 'People who need a clear local record of a civic issue without depending on a cloud account.',
    features: ['Create and classify civic cases', 'Photo evidence with optional GPS coordinates', 'Chronological follow-up timeline', 'Open / Resolved status and days unresolved', 'Local PDF evidence reports with secure sharing'],
    stack: ['Kotlin', 'Jetpack Compose', 'Room', 'Navigation Compose', 'Android PdfDocument'],
    engineering: 'Room → Repository → ViewModel → Compose UI, with a separate report assembler → PDF generator → secure sharer pipeline.',
    journey: 'The repository describes this as an MVP suitable for local APK testing and demonstrations. It is not published to the Play Store.',
    story: [
      { label: 'Case model', title: 'Build a case, not a feed', description: 'The product keeps a civic issue, its location, notes, photos and status together so the record can be revisited as one dated case.' },
      { label: 'Evidence flow', title: 'Evidence needs a timeline', description: 'Optional coordinates, timestamped photos and chronological follow-ups make the progression of a case legible without relying on a cloud account.' },
      { label: 'Report boundary', title: 'Reports are part of the product', description: 'A local report assembler hands structured evidence to Android PdfDocument, then passes the result to a secure sharing step.' },
      { label: 'Honest state', title: 'The honest state is MVP', description: 'The repository positions CivicProof for local APK testing and demonstrations; its Play Store status is intentionally not implied.' }
    ],
    source: 'Private repository; facts summarized from the project README.',
    confidence: 'High — README and source structure reviewed',
    featured: true,
    kind: 'phone',
    privateRepo: true,
    accent: '#7de8ff'
  },
  {
    slug: 'divyadhun',
    name: 'DivyaDhun',
    eyebrow: 'DEVOTIONAL LISTENING / ANDROID',
    category: 'Android app',
    filters: ['android', 'experiments'],
    status: 'In development',
    statusTone: 'build',
    summary: 'An Android-first devotional listening experience with localized discovery, playback, mantra practice and a rights-gated content pipeline.',
    problem: 'The product explores a calmer, more intentional way to discover devotional audio, while keeping playback availability, rights and offline behavior explicit.',
    audience: 'Listeners who want a focused devotional routine with English / Hindi support and honest content availability.',
    features: ['English and Hindi discovery flows', 'Favorites, recent history and a full player', 'Daily Bhakti routines and mantra counting', 'Aarti mode with lyrics and keep-awake control', 'Remote-catalog seam with local offline fallback'],
    stack: ['Kotlin', 'Jetpack Compose', 'Media3', 'DataStore', 'Navigation Compose'],
    engineering: 'Domain models, repositories, feature ViewModels and playback ownership are separated. Remote catalog loading remains behind an HTTPS configuration boundary.',
    journey: 'The latest repository notes describe Phase 21 catalog expansion, an unsigned release artifact and remaining physical-device / production-content verification.',
    story: [
      { label: 'Discovery', title: 'Discovery with a language switch', description: 'English and Hindi discovery flows are treated as part of the product model, not as a cosmetic translation layer.' },
      { label: 'Playback', title: 'Playback owns the routine', description: 'Favorites, recent history, a full player, Daily Bhakti and mantra counting give the listening journey distinct states.' },
      { label: 'Aarti mode', title: 'Aarti mode has boundaries', description: 'Lyrics and keep-awake control are explicit playback tools, keeping the mode understandable instead of hiding behavior behind a generic player.' },
      { label: 'Availability', title: 'Catalog availability is explicit', description: 'The remote catalog seam stays behind HTTPS configuration while local fallback behavior and remaining content verification remain visible.' }
    ],
    source: 'Private repository; facts summarized from the project README and checked-in documentation.',
    confidence: 'High — README and source structure reviewed',
    featured: true,
    kind: 'phone',
    privateRepo: true,
    accent: '#b494ff'
  },
  {
    slug: 'watchroom',
    name: 'Watchroom',
    eyebrow: 'SOCIAL PLAYBACK / EXPO',
    category: 'Product foundation',
    filters: ['android', 'experiments'],
    status: 'In development',
    statusTone: 'build',
    summary: 'A native-ready Expo / React Native foundation for watch parties, with private rooms, synchronized playback boundaries and social surfaces.',
    problem: 'A watch-together product needs more than a player: room lifecycle, membership, queue authority, sync recovery, moderation and clear runtime boundaries all have to agree.',
    audience: 'Small groups who want a structured shared viewing room with chat, reactions and an explicit provider boundary.',
    features: ['Home, Discover, Create, Activity and Profile tabs', 'Private room lifecycle, invites and lobby preflight', 'Chat, participants, reactions and local queue preview', 'Provider-neutral media adapter and sync engine', 'Supabase policies, realtime transport and safety foundations'],
    stack: ['Expo', 'React Native', 'TypeScript', 'Supabase', 'Expo Router'],
    engineering: 'Authoritative room commands, bounded clock-offset estimation, optimistic queue versions, private realtime broadcast / presence and explicit unconfigured states are documented boundaries.',
    journey: 'The repository describes locally validated foundations through Android release readiness. Hosted credentials, real provider playback and production signing remain unconfigured.',
    story: [
      { label: 'Room lifecycle', title: 'A room has a lifecycle', description: 'Home, discovery, create, activity and profile surfaces lead into a private room flow with invites and a lobby preflight.' },
      { label: 'Queue authority', title: 'Queue authority must be explicit', description: 'The foundation separates authoritative room commands from local queue preview so participants can understand what is shared.' },
      { label: 'Sync recovery', title: 'Sync is a recovery problem', description: 'Bounded clock-offset estimation, optimistic queue versions and a provider-neutral adapter are documented as runtime boundaries.' },
      { label: 'Hosted state', title: 'Hosted state is still a boundary', description: 'Supabase policies, realtime transport and safety foundations are described, while hosted credentials and real provider playback remain unconfigured.' }
    ],
    source: 'Private repository; facts summarized from the project README and checked-in documentation.',
    confidence: 'High — README and source structure reviewed',
    featured: true,
    kind: 'phone',
    privateRepo: true,
    accent: '#ffba78'
  },
  {
    slug: 'instafetch',
    name: 'InstaFetch',
    eyebrow: 'MEDIA UTILITY / WEB',
    category: 'Website',
    filters: ['websites'],
    status: 'Live',
    statusTone: 'live',
    summary: 'A public Instagram media utility focused on anonymous, public Reel resolution with preview-first UX and short-lived download links.',
    problem: 'Media utilities often overpromise format support or ask for credentials. InstaFetch keeps the promise narrow: public links only, a real preview when available, and clear failure states.',
    audience: 'People who need to preview or download media from a public Instagram link without sharing a password, cookie or browser profile.',
    features: ['React / Vite frontend with router pages', 'Express API with bounded temporary media storage', 'Public URL validation and signed media tokens', 'Preview-first flow with conditional format support', 'Privacy, terms, disclaimer and contact pages'],
    stack: ['React', 'Vite', 'TypeScript', 'Express', 'yt-dlp / gallery-dl'],
    engineering: 'The documented API validates canonical Instagram routes, blocks arbitrary proxying, rate-limits work and keeps upstream media addresses server-side. Production verification is Reel-first.',
    journey: 'The repository README lists the production frontend at instafetch.pages.dev and documents a free-compatible Cloudflare Pages / Render deployment path.',
    story: [
      { label: 'Promise', title: 'A narrow promise', description: 'The public surface centers anonymous public-link resolution and makes Reel-first availability clearer than a broad download claim.' },
      { label: 'Preview', title: 'Preview before transfer', description: 'The documented flow keeps a real preview and conditional format support ahead of a short-lived download link.' },
      { label: 'Boundary', title: 'Upstream stays server-side', description: 'Canonical URL validation, bounded work, rate limits and server-side upstream addresses keep the public utility from becoming arbitrary proxying.' },
      { label: 'Launch', title: 'Deployment is part of trust', description: 'The public README and live Pages URL are the source of truth for the shipped surface and its narrow production promise.' }
    ],
    source: 'Public repository and public deployment verified.',
    confidence: 'High — public README and live URL returned HTTP 200',
    kind: 'browser',
    image: '/assets/images/instafetch-live.png',
    imageAlt: 'Authentic viewport capture of the public InstaFetch deployment.',
    live: 'https://instafetch.pages.dev',
    repo: 'https://github.com/amansharma-it5/instafetch',
    accent: '#7f88ff'
  },
  {
    slug: 'resume-fit-checker',
    name: 'RecruitOS AI',
    eyebrow: 'RESUME INTELLIGENCE / WEB',
    category: 'AI & automation',
    filters: ['ai', 'websites', 'business'],
    status: 'Live',
    statusTone: 'live',
    summary: 'A privacy-first resume tailoring workspace combining deterministic ATS analysis, local file parsing, structured editing and consent-gated AI assistance.',
    problem: 'Resume tooling should help people improve their materials without silently inventing evidence or uploading sensitive documents. RecruitOS AI makes analysis explainable and reviewable.',
    audience: 'Job seekers and recruiting workflows that need local-first resume analysis, structured editing and safer AI-assisted rewriting.',
    features: ['Local PDF, DOCX, TXT, Markdown and RTF analysis', 'Nine-category deterministic ATS scoring', 'Evidence matrix and conservative requirement matching', 'Structured resume editor with versions and export', 'Consent-gated Copilot with diff, review and validation'],
    stack: ['React', 'Vite', 'TypeScript', 'IndexedDB', 'Supabase / Netlify'],
    engineering: 'The project separates local analysis from optional provider calls, keeps source text out of analysis history and revalidates AI suggestions before acceptance.',
    journey: 'The public repository documents guest mode, account flows, local export and the live Pages deployment. The score is presented as a rule-based signal, not a hiring prediction.',
    story: [
      { label: 'Signal', title: 'Analysis stays explainable', description: 'The public workspace presents deterministic ATS signals and local parsing as understandable inputs rather than an opaque hiring prediction.' },
      { label: 'Evidence', title: 'Evidence before rewriting', description: 'The evidence matrix and conservative requirement matching keep resume changes tied to the material being reviewed.' },
      { label: 'Privacy', title: 'Local-first by default', description: 'Guest analysis, local file parsing and local export keep the first path useful without silently uploading sensitive documents.' },
      { label: 'Copilot', title: 'Copilot is reviewable', description: 'Optional AI suggestions pass through consent, diff, review and validation before a user can accept a change.' }
    ],
    source: 'Public repository and public deployment verified.',
    confidence: 'High — public README and live URL returned HTTP 200',
    kind: 'browser',
    image: '/assets/images/recruitos-ai-live.png',
    imageAlt: 'Authentic viewport capture of the public RecruitOS AI deployment.',
    live: 'https://resume-fit-checker.pages.dev',
    repo: 'https://github.com/amansharma-it5/resume-fit-checker',
    accent: '#9d8bff'
  },
  {
    slug: 'frost-and-flowers',
    name: 'Frost & Flowers',
    eyebrow: 'COMMERCE / WEB',
    category: 'Business project',
    filters: ['websites', 'business'],
    status: 'Live',
    statusTone: 'live',
    summary: 'A production-minded storefront foundation with a verified product catalogue, customer-facing ordering controls and a payment-safe commerce boundary.',
    problem: 'A commerce site needs strong boundaries around catalogue truth, inventory, payments and operational readiness before accepting orders.',
    audience: 'A small product business presenting a curated catalogue while keeping transactional features disabled until the required services are configured.',
    features: ['Mobile-first Next.js App Router storefront', 'Verified catalogue and locally stored product photography', 'Supabase-backed order and inventory boundary', 'Razorpay payment verification and reconciliation flow', 'Explicit demo / disabled-ordering state'],
    stack: ['Next.js', 'Supabase', 'Razorpay', 'Cloudflare Workers', 'PostgreSQL'],
    engineering: 'The documented payment flow reserves inventory transactionally, verifies callbacks and treats late payments and duplicate callbacks as explicit states.',
    journey: 'The repository includes 39 catalogue products and 179 product photographs from an owner-provided catalogue. Ordering remains disabled until the documented service configuration is complete.',
    story: [
      { label: 'Catalogue', title: 'Catalogue before checkout', description: 'The public storefront leads with a verified catalogue and product photography before the transactional boundary is enabled.' },
      { label: 'Payments', title: 'Payments need reconciliation', description: 'The documented flow reserves inventory transactionally, verifies callbacks and keeps late or duplicate payments explicit.' },
      { label: 'State', title: 'Disabled is a valid state', description: 'Ordering stays disabled until the documented services are configured; the interface does not imply that a demo is accepting orders.' },
      { label: 'Photography', title: 'Photography is product data', description: 'The repository records 39 catalogue products and 179 owner-provided photographs as part of the commerce surface.' }
    ],
    source: 'Public repository and public deployment verified.',
    confidence: 'High — public README and live URL returned HTTP 200',
    kind: 'catalogue',
    image: '/assets/images/frost-flowers-live.png',
    imageAlt: 'Authentic viewport capture of the public Frost & Flowers deployment.',
    live: 'https://frost-and-flowers-store.amansharma-it5.workers.dev',
    repo: 'https://github.com/amansharma-it5/frost-and-flowers-store',
    accent: '#ff8eb3'
  },
  {
    slug: 'cpp-practice',
    name: 'C++ practice',
    eyebrow: 'LEARNING ARCHIVE / CODE',
    category: 'Experiment',
    filters: ['experiments'],
    status: 'Paused',
    statusTone: 'paused',
    summary: 'A small public learning archive of C++ exercises and solutions.',
    problem: 'A compact code archive is useful as a record of fundamentals, even when it is not positioned as a product.',
    audience: 'Anyone looking for a lightweight snapshot of programming practice work.',
    features: ['Public GitHub repository', 'Small, focused exercise files', 'Simple history that makes the scope clear'],
    stack: ['C++'],
    engineering: 'No product documentation or deployment surface was found; the portfolio keeps the description intentionally narrow.',
    journey: 'The repository history shows a November 2024 main-branch snapshot.',
    story: [
      { label: 'Archive', title: 'A small public archive', description: 'The repository is presented as a compact record of C++ practice, not as a shipped product.' },
      { label: 'Scope', title: 'Small files, clear scope', description: 'The visible exercise files are kept intentionally narrow because no broader product documentation was found.' },
      { label: 'History', title: 'History is the evidence', description: 'The November 2024 main-branch snapshot is the reliable boundary for what this archive represents.' }
    ],
    source: 'Public repository; sparse documentation.',
    confidence: 'Medium — public repository with sparse documentation',
    kind: 'code',
    repo: 'https://github.com/amansharma-it5/C-',
    accent: '#7de8ff'
  },
  {
    slug: 'leetcode-probs',
    name: 'LeetCode problems',
    eyebrow: 'PROBLEM SOLVING / CODE',
    category: 'Experiment',
    filters: ['experiments'],
    status: 'Paused',
    statusTone: 'paused',
    summary: 'A public archive containing small algorithm practice solutions, including named problem files.',
    problem: 'Keeping solutions in a public archive creates a visible trail of deliberate practice without overstating it as a shipped product.',
    audience: 'Readers interested in a simple code-learning archive.',
    features: ['Public GitHub repository', 'Named solution files', 'Minimal, inspectable scope'],
    stack: ['C++'],
    engineering: 'The repository contains a small number of named solution files and no README or deployment surface, so the portfolio does not infer more than that.',
    journey: 'The repository history shows a November 2024 main-branch snapshot.',
    story: [
      { label: 'Practice', title: 'Problem solving as a trail', description: 'Named solution files create a visible trail of deliberate algorithm practice without turning the archive into a product claim.' },
      { label: 'Inspectability', title: 'Minimal is inspectable', description: 'The repository has a small number of public files and no README or deployment surface, so the story stays close to the evidence.' },
      { label: 'History', title: 'A dated learning snapshot', description: 'The November 2024 main-branch history is the boundary used for this archive entry.' }
    ],
    source: 'Public repository; sparse documentation.',
    confidence: 'Medium — public repository with sparse documentation',
    kind: 'code',
    repo: 'https://github.com/amansharma-it5/LeetCode-Probs',
    accent: '#ffba78'
  }
];

export const projectMap = new Map(projects.map((project) => [project.slug, project]));
export const featuredProjects = projects.filter((project) => project.featured);
