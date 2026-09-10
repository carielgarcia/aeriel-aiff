# ÆRIEL Project Website — Operational Rules & Essay Publishing Guidelines

Whenever the user submits a new essay, updates an existing article, or modifies the writing platform, adhere to the following strict operational protocol:

---

## 1. Editorial & Formatting Protocol
- Act like a dedicated editorial engine for ÆRIEL.
- Confirm article structure and typography before publishing.
- **Shortform Teasers / Intros**:
  - Write concise, assertive, and politically grounded intros for the preview boxes.
  - Avoid tired formulaic starters (e.g., *"An inquiry into..."*, *"An examination of..."*).
  - Avoid *"not X but Y"* constructions. Make assertive statements (e.g., *"The material conditions of nightlife are inescapable. Free admission is a community cross-subsidy that demands collective economic responsibility."*).
- **Tags**: Propose 3 curated tags per essay and confirm with the user.
- **Languages**: Every essay must be maintained in **all three languages** (English, Spanish, Portuguese).
- **Chronology**: All essays in the homepage WRITING grid and the subsite `#articles-index` must always be ordered chronologically from **latest to oldest**.

---

## 2. Mandatory Open Graph & Link Preview Metadata
Every essay must produce a rich, informative preview when its link is pasted into WhatsApp, Instagram, Telegram, iMessage, Twitter/X, Facebook, etc.

The preview must:
1. **Identify the link as an essay by ÆRIEL** in the title (`[ESSAY TITLE] — Essay by ÆRIEL` / `[TÍTULO] — Ensayo por ÆRIEL`).
2. **Contain the exact short intro from the main site box** in the description (`og:description` and `twitter:description`).
3. **Include the brand social image**: `https://aeriel.net/og-image.jpg` (1024x1024 JPEG).

### Static Permalink Structure
For every essay, create or update standalone static files in both language routes:
- `writing/[YYYYMMDD]-[slug]/index.html` (English / Global)
- `ensayos/[YYYYMMDD]-[slug]/index.html` (Spanish)

### Required `<head>` Structure for Essay Permalinks:
```html
<!DOCTYPE html>
<html lang="en"> <!-- or "es" -->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[ESSAY TITLE] — Essay by ÆRIEL</title>
  <meta name="description" content="[EXACT SHORT INTRO FROM MAIN SITE BOX]">
  <meta name="author" content="ÆRIEL">

  <!-- Open Graph / WhatsApp / Facebook / Instagram -->
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="ÆRIEL">
  <meta property="og:title" content="[ESSAY TITLE] — Essay by ÆRIEL">
  <meta property="og:description" content="[EXACT SHORT INTRO FROM MAIN SITE BOX]">
  <meta property="og:url" content="https://aeriel.net/writing/[YYYYMMDD]-[slug]">
  <meta property="og:image" content="https://aeriel.net/og-image.jpg">
  <meta property="og:image:secure_url" content="https://aeriel.net/og-image.jpg">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1024">
  <meta property="og:image:height" content="1024">
  <meta property="og:locale" content="en_US"> <!-- or "es_LA" -->
  <meta property="article:author" content="ÆRIEL">
  <meta property="article:section" content="Nightlife Politics & Cultural Theory">

  <!-- Twitter / X Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="[ESSAY TITLE] — Essay by ÆRIEL">
  <meta name="twitter:description" content="[EXACT SHORT INTRO FROM MAIN SITE BOX]">
  <meta name="twitter:image" content="https://aeriel.net/og-image.jpg">

  <!-- Canonical -->
  <link rel="canonical" href="https://aeriel.net/writing/[YYYYMMDD]-[slug]">
  <link rel="image_src" href="https://aeriel.net/og-image.jpg">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%230A0A0A'/><text y='70' x='50' font-size='65' text-anchor='middle' fill='%23FFFFFF' font-family='monospace' font-weight='bold'>Æ</text></svg>">

  <!-- Instant Client-Side SPA Reader Navigation -->
  <script>
    window.location.replace('/#writing-subsite?essay=[essay-id]');
  </script>
  <noscript>
    <meta http-equiv="refresh" content="0; url=/#writing-subsite?essay=[essay-id]">
  </noscript>
</head>
<body style="margin:0;padding:2rem;background:#0A0A0A;color:#FFFFFF;font-family:monospace;">
  <main style="max-width:640px;margin:2rem auto;border:2px solid #FFFFFF;padding:1.5rem;">
    <p style="font-size:0.8rem;letter-spacing:1px;margin-bottom:0.5rem;color:#888;">[ ESSAY // CRITICAL THEORY ]</p>
    <h1 style="font-size:1.4rem;line-height:1.2;margin:0 0 1rem 0;">[ESSAY TITLE]</h1>
    <p style="font-size:0.9rem;color:#AAA;margin-bottom:1rem;">BY ÆRIEL</p>
    <p style="font-size:1rem;line-height:1.6;margin-bottom:1.5rem;">[EXACT SHORT INTRO FROM MAIN SITE BOX]</p>
    <p><a href="/#writing-subsite?essay=[essay-id]" style="color:#FFF;font-weight:bold;text-decoration:underline;">[ OPEN FULL ESSAY IN READER ]</a></p>
  </main>
</body>
</html>
```

---

## 3. Codebase Synchronization Checklist for Every Addition
1. **`index.html` (SPA Router & Storage)**:
   - Add slug to `ESSAY_SLUGS` and `SLUG_TO_ESSAY_ID`.
   - Add short intro in EN, ES, PT to `ESSAY_TEASERS`.
   - Update `updatePageTitle()` so browser in-app navigation updates `<title>` and `og:*` tags.
   - Update `shareEssay()` to share `${titleText} — ${essayLabel}`.
   - Insert new teaser card into `#writing .dj-grid` (latest-to-oldest).
   - Insert new card into `#articles-index` (latest-to-oldest).
   - Insert full article content into `#article-reader-container` across `<div lang="en">`, `<div lang="es">`, `<div lang="pt">`.
2. **`_redirects`**:
   - **Never** add HTTP 302 redirects to `#` hash routes for essay permalinks. Web scrapers strip fragments and drop back to the homepage. Allow Netlify/hosting to serve the static `index.html` files with status 200 OK.
3. **Version Control**:
   - Verify with `git diff`, commit with conventional commit format, and push to `origin/main`.

---

## 4. Website Architectural Invariants & Brutalist Design Rules
Any modifications to HTML, CSS, or JavaScript must strictly adhere to the following aesthetic and technical constraints:

- **Monochromatic Color Palette**:
  - Structural Black: `#0A0A0A` (primary canvas)
  - Sub-Panel Dark: `#121212` (containers, cards, inactive blocks)
  - Sharp White: `#FFFFFF` (borders, primary text, active states)
  - Industrial Gray: `#7F7F7F` (metadata, secondary labels, timestamps)
  - *Never introduce unapproved accent colors, gradients, or soft drop shadows.*
- **Zero Border-Radius Invariant**:
  - Every UI element (buttons, inputs, cards, dialogs, modals, containers) must have sharp 90-degree corners: `border-radius: 0 !important;`.
- **Exposed Structural Grids**:
  - Layout structures must be visibly delineated with crisp `1px solid #FFFFFF` or `2px solid #FFFFFF` borders.
- **Monospace Typography & Case**:
  - Font Stack: `Consolas, Menlo, Monaco, "Courier New", Courier, monospace`.
  - UI labels, navigation anchors, section headers, and metadata badges are transformed to uppercase (`text-transform: uppercase; letter-spacing: 1px`).
- **Binary Hover Transitions**:
  - Interactive elements (buttons, nav links, grid cards, form controls) invert colors instantly on hover/focus (`background: #FFFFFF; color: #0A0A0A;`) with **zero transition easing** (`transition: none;` or `0s`).
- **Framework-Free Native Web Standards**:
  - No React, Vue, Tailwind, or Bootstrap. Keep the platform ultra-fast, lightweight, accessible, and self-contained with pure semantic HTML5, CSS Grid/Flexbox, and vanilla ES6+ JavaScript.

---

## 5. Instruction Execution & Site Management Protocol
Whenever receiving instructions or user requests for any part of the website:

1. **Pre-Flight Architecture & Regression Check**:
   - Inspect existing routing logic in `index.html` (hash router `#writing-subsite`, `#party`, `#article-reader`, `#archive`).
   - Ensure changes do not break SPA state, scroll restoration, or audio player embeds.
2. **Trilingual Parity (EN, ES, PT)**:
   - Any added or modified UI text, error messages, buttons, or content must be implemented synchronously across English (`lang="en"`), Spanish (`lang="es"`), and Portuguese (`lang="pt"`).
3. **Form Handling & Backend Security**:
   - Form transmissions (RSVP, transmissions, message portal) must maintain spam defenses (honeypot fields), client-side input sanitization, and graceful state feedback matching the brutalist styling.
   - Changes impacting Google Apps Script endpoints (`Code.gs`) must preserve CORS compatibility and payload schemas.
4. **Static Permalinks & Redirect Hygiene**:
   - Keep standalone static crawler files in `writing/` and `ensayos/` synchronized with any article changes.
   - Never add HTTP 302 redirects to hash anchors in `_redirects`.
5. **Atomic Verification & Git Hygiene**:
   - Always run `git status` and `git diff` before finalizing changes.
   - Commit using Conventional Commits (`feat:`, `fix:`, `style:`, `refactor:`, `docs:`).

---

## 6. Media Ingestion, Optimization & Assets Protocol
Whenever the user uploads, references, or updates media assets (posters, press photography, artwork, audio clips, video loops), execute the following protocol:

### Repository Directory Routing
- **Event Posters & Flyers**: `public/images/posters/` (e.g. `poster_ae000_5.jpg`)
- **Press & Artist Photography**: `public/images/press/`
- **Release & Mix Artwork**: `public/images/releases/`
- **Audio Clips & Soundscapes**: `public/audio/`
- **Video Backgrounds & Loops**: `public/video/`
- **Social / Open Graph Cards**: Root `og-image.jpg` or `public/og-*.jpg`

### Accessibility (a11y) Invariants
- **Trilingual Alt Text**: Every image element must provide explicit, descriptive `alt` text translated across English, Spanish, and Portuguese.
- **Semantic Trigger Elements**: Media lightboxes and modal openers must use semantic `<button type="button">` with clear `aria-label` descriptors and visible focus states.
- **Screen Reader Announcements**: Carousels and slide containers must include `aria-roledescription="slide"`, current slide indexes, and progress indicators.

### Mobile Experience & Usability
- **Cumulative Layout Shift (CLS) Prevention**: Hardcode explicit aspect ratios or structural wrapper dimensions so images do not cause layout jumps while loading.
- **Performance Loading**: Default to `loading="lazy"` and `decoding="async"` on non-hero imagery.
- **Touch Targets**: All interactive media triggers (poster cards, audio buttons) must satisfy minimum 44×44px touch targets.
- **Brutalist Structural Containment**: Zero border-radius (`border-radius: 0 !important;`), exposed monochromatic borders (`1px solid #FFFFFF`), and instant color inversions on hover/tap.

### Problem Detection & Proactive Remediation
- **Oversized Assets (> 400KB image, uncompressed video/audio)**:
  - Immediately warn the user of potential mobile LCP degradation and bandwidth overhead.
  - Propose/execute local optimization using native macOS `/usr/bin/sips` (resizing, JPEG quality adjustment) or `/opt/homebrew/bin/ffmpeg` (WebP conversion, fast-start MP4 with H.264/AAC, WebM).
- **Aspect Ratio Mismatch**:
  - Flag images that diverge from the established carousel/grid aspect ratios.
  - Propose non-destructive structural containment (`object-fit: cover` within standard borders) or proportional crops.
- **Codec & Autoplay Restrictions**:
  - Ensure video loops are muted, inline (`playsinline`), and loopable to pass mobile browser autoplay policies.

### Codebase Integration & Git Hygiene
- Update all associated structures in `index.html` (carousel slides, lightbox arrays, counter bars, schema metadata).
- Verify with `git status` and `git diff` prior to committing.
- Commit atomically using conventional commit syntax (e.g., `feat(media): add poster ae000.5 and update gallery`).
