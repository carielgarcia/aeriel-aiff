# ÆRIEL | Brutalist DJ Portfolio Web App

This is a premium, raw, structural single-page electronic music artist portfolio for **ÆRIEL** (Hypnotic Techno & Hardgroove). The application is built using **pure semantic HTML5** and **vanilla, native CSS3** with a uncompromising monochromatic brutalist design philosophy.

## 🎛️ Design Specifications & Branding

- **Palette**: Absolute Monochromatic Dark Mode
  - Background: `#0A0A0A` (deep structural black)
  - Secondary Panel Background: `#121212` (dark slate gray)
  - Typography/Accents: `#FFFFFF` (crisp white)
  - Secondary/Metadata: `#7F7F7F` (industrial mid-gray)
- **Angularity**: Strict sharp 90-degree corners (`border-radius: 0 !important`) across all elements to enforce industrial weight.
- **Exposed Structural Grids**: Visually exposed borders (`1px solid #FFFFFF` and `2px solid #FFFFFF`) showcase the underlying layout structure.
- **Monospace Typography**: Strict monospace system font stack (`Consolas`, `Menlo`, `Courier`, system monospace) with all uppercase transformations.
- **Binary Hover Inversion**: Interacting with active elements (links, grid cells, form inputs, buttons) triggers immediate high-contrast color inversions (Background `#FFFFFF` / Text `#0A0A0A`) with zero transition easing for raw responsiveness.

## 📂 Project Structure

```text
ProjectWebsite/
├── index.html       # Portfolio layout with structured semantic sections
├── style.css        # Monochromatic, blocky style sheet (no framework)
└── README.md        # Technical guide (this file)
```

## 🗺️ Layout & Sections (`<main>`)

1. **SYSTEM ENTRY (HERO)**: Massive, raw uppercase display block establishing `ÆRIEL` brand identity, sonic markers, and booking CTA anchors.
2. **DIGITAL ARCHIVES**: Highly visible, solid-border CSS grid mapping recorded mixes and sets portals (Soundcloud, Bandcamp, YouTube, Instagram).
3. **ARTIST INTENT**: Left-aligned, raw text container representing ÆRIEL's philosophy of sweat, friction, heat, and collective underground sanctuaries.
4. **Æ000.X CONCEPT**: A detailed overview of the trust-based, community-driven event brand balancing emerging research and established selection nodes.
5. **MESSAGE PORTAL**: A stark, simplified input box capturing name, email coordinates, and transmission data.

## 🛠️ Access & Execution

### Direct Execution
You can view the portfolio instantly:
1. Locate `index.html` in your file browser.
2. Double-click to open in any modern web browser.

### Local Dev Server
To run exactly like a production environment:

1. Open your terminal.
2. Navigate to the project directory:
   ```bash
   cd "/Users/camilo/Documents/006 Coding/Antigravity/ProjectWebsite"
   ```
3. Initialize Python's lightweight web server:
   ```bash
   python3 -m http.server 8080
   ```
4. Access the web app at:
   [http://localhost:8080](http://localhost:8080)
5. Exit by hitting `Ctrl + C` in the shell window.
