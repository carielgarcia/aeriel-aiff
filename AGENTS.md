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
  - **Intentional exception — Sound Pads**: In `games/techno-variants/`, the performance pads, active step pads and voice dots carry a per-voice colour so each voice stays distinguishable. Everything else in the game follows the monochrome palette, zero radius, white borders, uppercase monospace labels and binary hover rules.
  - **Intentional exception — Genre Mode Easter Eggs**: The `disco-mode`, `trance-mode`, and `house-mode` themes (`html.*-mode` rules in `style.css`, including their accent colors, backgrounds, and glow `box-shadow`s) are deliberate homages to the visual identity of those genres. They are approved, must not be flagged or "fixed" in audits, and must not be removed. All other UI remains strictly monochromatic.
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

---

## 7. SoundCloud Drawer Track Update Protocol
Whenever the user provides a SoundCloud set embed (iframe/link) and specifies a genre (Techno, Trance, House, Italo Disco):

1. **Genre Mapping**:
   - `Techno` -> `data-genre="default"`
   - `Trance` -> `data-genre="trance"`
   - `House` -> `data-genre="house"`
   - `Italo Disco` / `Disco` -> `data-genre="disco"`

2. **Panel Update (`.sc-track-panel`)**:
   - Update `data-title` with the set title (e.g. `PRÆCTICE 003`).
   - Update `iframe`: set `title="SoundCloud Player - [TITLE] [GENRE]"`, preserve `loading="lazy"`, `width="100%"`, `height="166"`, `scrolling="no"`, `frameborder="no"`, `allow="autoplay; encrypted-media"`.
   - Update `.sc-credit-bar`: update links and titles using standard markup (`rel="noopener noreferrer"` and `target="_blank"`).

3. **Git Hygiene**:
   - Verify with `git diff`.
   - Commit (`feat(soundcloud): update [genre] genre panel in drawer to [TITLE]`).
   - Push to `origin/main`.

---

## 8. Interactive Web Audio, Games & Synthesizer Engines Protocol
Whenever designing, developing, or modifying interactive audio tools, games, or synthesizers (such as `games/techno-variants/` or future sub-apps):

### 1. Web Audio Gesture & Context Synchronization
- **Synchronous Resume Invariant**: In macOS/iOS Safari and WebKit, user gesture activation tokens expire across microtask ticks. Any call to `audioCtx.resume()` (e.g. `TVEngine.resume()`) **MUST be executed synchronously** at the very entry of user click/pointer/touch/keydown handlers. Never place an `await` before context resumption.
- **Global Unlock Listeners**: Attach non-blocking passive synchronous resume listeners across `pointerdown`, `touchstart`, `click`, and `keydown`.

### 2. Architecture & Transport Clocking
- **Raw Web Audio, framework-free**: `games/techno-variants/` is split into `engine.js` (synthesis, FX, sequencer), `tracks.js` (data), `app.js` (UI + i18n), `techno.css`, and `clock-worker.js`. No Tone.js or other audio libraries.
- **Look-ahead scheduler**: every event is placed at an explicit `AudioContext` time (look-ahead ≥ 150 ms). The tick runs in a Worker (`clock-worker.js`) so background-tab timer throttling cannot starve it; fall back to `setInterval` only if Workers are unavailable. Modulo stepping `step = (step + 1) % 16`; pause resumes, stop rewinds.
- **Visual sync**: queue step highlights with the scheduled audio time and release them at `ctx.currentTime - outputLatency` so the playhead matches what is heard.
- **Tempo-synced FX**: delay times derive from BPM (`delayTime = stepSeconds × division`); never hard-code millisecond delays.
- **Band-limited oscillators only**: use native `OscillatorNode` types or `PeriodicWave`; never hand-roll naive `sign(sin)` square/saw buffers (aliasing). Use seeded noise so offline renders are repeatable.
- **Keep per-hit node counts minimal.** A hit may create only its sources and an envelope gain. Filters, shapers, panners and FX sends are persistent shared chains (see `chainFor()` in `engine.js`). Heavy one-off synthesis (e.g. the pre-rendered metallic hat buffer) happens at init, never inside the scheduler. Budget: profile with an offline render and report cost per audio second before and after.
- **Scheduler resilience.** After a main-thread stall the scheduler must skip missed steps (never replay them at once), drop notes that are already late, cap steps per tick, and fall back to a reduced-effects mode under sustained overload. A watchdog detects a suspended/stalled `AudioContext`, pauses the UI with a message, or rebuilds the context once. Never forward the `running` state as a fault.
- **Gain staging**: master peaks ≤ −1 dBFS with a real limiter and ceiling; no whole-mix saturation. Verify changes with an offline render (`OfflineAudioContext`) and report peak, RMS, crest factor and clipped-sample share before and after.

### 3. Spatial Density & Expandable Drawer Architecture
- **Zero Wasted Space Invariant**: Interactive audio tools must maximize space efficiency. Avoid large static parameter blocks or tall static tables below the matrix.
- **Per-Track Inline Drawers**: Sound shaping controls (tuning, filters, envelope decay, panning, level, pitch selectors) must live inside expandable drawers toggled by a compact button on each track row (e.g. `[NOTE ▾]`, `[TUNE ▾]`).
- **Collapsible Reference Data**: Auxiliary educational guides or subgenre comparative tables must default to collapsed `<details>` accordions to preserve viewport focus.

### 4. Dynamic Iframe Height & Zero-Gap Containment
- **Height Calculation**: Embedded apps must never enforce rigid `100vh` or `min-h-screen` classes that artificially inflate iframe heights.
- **Dynamic PostMessage Contract**: Dispatch `{ type: 'resize-games-iframe', height: scrollHeight }` (to the same origin) on window load, resize, `ResizeObserver`, drawer toggle, and `<details>` toggle. The host validates `origin` and `source` and clamps the height.
- **Host Containment**: The host assigns the iframe `src` from `data-src` when the Games view opens (no hidden audio engine on other views), uses minimal top/bottom section padding, and updates the iframe height dynamically with zero dead gap.

### 5. Reference Data Integrity (`tracks.js`)
- **Never invent records.** Every reference track must be an entry from a named specialist list (Resident Advisor, Bandcamp Daily, Mixmag, Electronic Beats, etc.) and carry a `source` key pointing to `TV_SOURCES` with the list's URL. Title, artist, label and year come from the list or the release listing; `bpm` is the listed tempo or `null`.
- **No unsourced descriptions.** Do not write descriptive claims about a specific record that the source does not make.
- **Grooves are style templates**, not transcriptions of the referenced records, and the UI must say so.
- Keep at most 5 tracks per subgenre. When a list cannot be read in full, include only entries confirmed from it.

### 6. Trilingual UI
- All game UI text, aria-labels and toasts live in the `I18N` dictionary in `app.js` (EN/ES/PT). The game follows the host language (`?lang=`, `localStorage['preferred-lang']`, live `storage` event).

---

## 9. Mobile Native-Feel Invariants (≤600px)
- **Navigation lives at the thumb**: the fixed `#tab-bar` (ÆRIEL, Æ000.X ↗, ESSAYS ↗, MESSAGE ↗ — destinations only, never on-page anchors) replaces the hamburger. New top-level destinations need a tab entry in EN/ES/PT, an active-state mapping in `syncTabBar()`, and a label short enough for a 4-column grid at 380px (verify `MENSAGEM ↗`). Tapping the active tab scrolls to top (or closes an open essay).
- **Device framing**: keep `viewport-fit=cover`, `theme-color`, the manifest and `env(safe-area-inset-*)` padding on every fixed element. Use `dvh`, never bare `vh`, for heights tied to the visible viewport.
- **Reader**: progress hairline (`#reader-progress`), index scroll restoration on close/back (`indexScrollY`), and the chronological newer/older pager (`#reader-pager`, built from `#articles-index` order — never recommendations). View swaps scroll with `behavior: 'instant'`.
- **Sticky offsets** come from `--header-h` (measured), never a hard-coded pixel value (the ON THIS PAGE rail uses it too).
- **Sharing**: the native share sheet button is injected where `navigator.share` exists; platform links remain the fallback.
- **Offline**: `sw.js` is network-first with a cache fallback. Never make it cache-first for HTML/CSS, and keep audio, video and `/games/` out of the cache. Bump `CACHE` only when the strategy changes.
- **Forms**: placeholders are trilingual via `data-placeholder-{en,es,pt}`; keep `autocomplete`, `inputmode` and `enterkeyhint` hints.
- **No soft effects**: no `backdrop-filter` blur, gradients or shadows for edge cues — clipped chips and hard borders only.

---

## 10. Navigation Architecture (Destinations vs. On-Page)
- **Top bar = destinations only**, identical on every page: ÆRIEL wordmark → `/`, `Æ000.X ↗` → `/ae000x`, `ESSAYS ↗` (ES `ENSAYOS`, PT `ENSAIOS`) → `/writing` (`/ensayos`), `MESSAGE ↗` → `/message` (`/mensaje`). No scroll anchors in the top bar; the active sub-site carries `aria-current="page"`. The footer menu mirrors it. `GAMES` stays hidden (never in menu, rail or sitemap).
- **`#page-rail` = "ON THIS PAGE"**: built by `initPageRail()` from `PAGE_RAIL_CONFIG` (landing: Stream, Archives, Intent; `/ae000x`: Residents, Variants, FAQ, Past Flyers, Registration). Hidden when a view has fewer than 3 items; maximum 5. Link text is read from the section's own heading. Anchors are absolute (`/#archives`). Sticky left rail ≥1100px, "ON THIS PAGE ▼" bar below that.
- **Sub-sites** (`#ae000x-subsite`, `#writing-subsite`, `#message-subsite`) show a breadcrumb (`ÆRIEL / <SUB-SITE>`) in `.subsite-header-bar` and end with a `← BACK TO ÆRIEL` link. The sub-site distinction is monochrome only (sub-panel background, 10px white left block, `[ SUB-SITE ↗ ]` tag).
- **Shared contact form**: markup lives once in `<template id="contact-form-tpl">` and is stamped into every `[data-contact-form-mount]` (landing `#contact` and `/message`) by `mountContactForms()`. Never duplicate the form markup or its handler.
- **Static stubs** exist for `/message` and `/mensaje` (same pattern as `/writing`/`/ensayos`). The `/mensaje` stub passes `?lang=es`.
- **Mobile (≤600px)**: the top-bar destinations live in the fixed 4-cell `#tab-bar` (ÆRIEL, Æ000.X ↗, ESSAYS ↗, MESSAGE ↗). There is no hamburger and no mobile dropdown; the footer menu is hidden because the tab bar replaces it. The tab bar slides away while scrolling down and returns on any upward scroll, at the top, at the bottom and on focus. On sub-sites the header carries the breadcrumb chip (`ÆRIEL / ESSAYS`, `#header-crumb`) and the desktop breadcrumb strip (`.subsite-crumb-bar`) is hidden. The "ON THIS PAGE" bar shows the current section (`#page-rail-current`) and is the only dropdown.
- Any new destination needs: a top-bar link, a tab-bar cell, a footer link, a breadcrumb label, EN/ES/PT labels and a static stub (+ Spanish route).
