# ⚡ STORMBREAKERS — Official Web Experience

> **"Break Limits — Create Legends"**

Welcome to the official web showcase for **STORMBREAKERS** — an elite collective engineered to shatter limits, pioneer uncharted frontiers, and build legendary solutions.

---

## 🌌 Overview & Design Philosophy

The STORMBREAKERS web platform is constructed around a modern, high-octane dark cyber aesthetic featuring:
- **Palette**: Deep void black (`#05060b`) punctuated by **Electric Blue** (`#00f0ff`), **Cyber Purple** (`#a855f7`), and **Electric Magenta** (`#d946ef`).
- **Typography**: Futuristic headers powered by Google Fonts `Orbitron` & `Syne`, paired with ultra-clean modern typography in `Plus Jakarta Sans`.
- **Dynamic Physics & Effects**:
  - **Ambient Lightning & Particle Canvas**: High-performance interactive background simulating kinetic electric nodes and localized lightning discharge arcs on mouse click.
  - **3D Card Perspective Tilt**: Interactive gyroscopic tilt that reflects cursor position across squad and pillar cards.
  - **Synthesized Sci-Fi Audio FX**: Web Audio API sound generator producing interactive hover frequencies, electric discharge clicks, and mission feedback chimes with zero external audio file dependencies.
  - **Glassmorphism & Neon Emblems**: Multi-layered backdrop blurs, glowing vector emblems, and subtle holographic rings.

---

## 🚀 Sections Included

1. **Hero Section**:
   - Status badge indicator (`STATUS: ACTIVE • MISSION READY`).
   - Impactful title with electric gradient glow.
   - Distinctive motto showcase: *"Break Limits — Create Legends"*.
   - Live power metrics (Power Pillars, 100% Dedication, $\infty$ Creative Horizon, Unified Purpose).
   - Direct CTA links to Explore Squad & Ethos.
2. **Infinite Cyber Marquee**:
   - Continuous animated ticker reinforcing core battle-cries: *Break Limits • Create Legends • Relentless Innovation • Radical Creativity • Unconquerable Unity • Pure Determination*.
3. **Identity & Ethos (About)**:
   - Deep narrative on who the Stormbreakers are and why we thrive in chaos.
   - Interactive Holographic Core Emblem with rotating orbital rings and glowing storm sigil.
4. **Core Pillars (The Four Forces)**:
   - **Teamwork**: Unstoppable synergy, radical trust, and collective momentum.
   - **Creativity**: Defiant imagination, unboxed thinking, and bold design.
   - **Innovation**: Frontier engineering, rapid prototyping, and future tech.
   - **Determination**: Unyielding resolve, grit, tenacity, and zero excuses.
5. **The Squad (Team Roster)**:
   - Interactive role filters: *All Breakers, Leadership, Engineering, Creative & UX*.
   - Stylized cybernetic avatar representations with glowing power rings.
   - Member cards with callsigns, specialties, signature quotes, and skill chips.
   - **Interactive Dossier Modal**: Clicking *"View Dossier"* opens an expanded tactical profile with full operational history, tactical attributes, and signature doctrine.
   - Open position invitation card: *"Next Stormbreaker — Future Legend"*.
6. **Tactical Arsenal (Capabilities)**:
   - Immersive Web Experiences, Full-Spectrum Engineering, Radical Product Design, and Strategic Velocity.
7. **Stormbreaker Manifesto**:
   - High-impact quote banner etched with electric cyan-violet lighting.
8. **Mission Transmission (Contact)**:
   - Coordinates, encrypted contact frequency, and interactive signal transmission form with live input feedback states.
9. **Footer**:
   - Brand crest, navigational links, live system status, and back-to-top quick trigger.

---

## 💻 How to View & Run

No build step or dependencies required!

### Option 1: Double-Click
Simply double-click `index.html` in your file explorer to open it in Google Chrome, Microsoft Edge, Mozilla Firefox, Brave, or Safari.

### Option 2: Local HTTP Server (Optional)
If you prefer running via a local server:
- **Python**: `python -m http.server 8080` (then open `http://localhost:8080`)
- **VS Code**: Install "Live Server" extension and click "Go Live"
- **Node/npx**: `npx serve .`

---

## 🛠 Customization Guide

### Changing Team Members
Open `index.html` and search for `<div class="squad-grid" id="squad-grid">`. You can edit:
- **Name**: `<h3 class="member-name">...</h3>`
- **Role**: `<p class="member-role">...</p>`
- **Callsign**: `<span class="callsign">CALLSIGN: ...</span>`
- **Quote**: `<p class="member-quote">&ldquo;...&rdquo;</p>`
- **Skills**: Add or modify `<span class="skill-chip">...</span>` tags.

To update the extended modal popup data, open `script.js` and locate `const memberDossiers = { ... }`.

### Adjusting Colors & Accents
Open `styles.css` and modify the CSS variables under `:root`:
```css
--electric-blue: #00f0ff;      /* Primary electric cyan */
--cyber-purple: #a855f7;       /* Primary cyber purple */
--electric-magenta: #d946ef;    /* Secondary neon accent */
--bg-deep: #080a14;            /* Dark space backdrop */
```

---

## ⚡ Built For Legends
*STORMBREAKERS — Break Limits, Create Legends.*

