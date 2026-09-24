# Univers — All Connected (Concept Redesign)

Hey! 👋 Welcome to my concept redesign of the [Univers](https://univers.com/) website.

I built this project as a front-end and design exploration into how a modern, enterprise-grade deep-tech brand can look and feel. Univers operates at the intersection of heavy operational technology (energy grids, automated ports, industrial manufacturing, smart buildings) and cloud intelligence. I wanted to design an experience that reflects that scale: high-precision, clean, tactile, and genuinely fun to interact with.

👉 **Live Demo:** [https://univers-homepage-revamp.vercel.app/](https://univers-homepage-revamp.vercel.app/)

---

## ✨ Fun & Interactive Stuff to Try

I wanted the page to feel alive rather than just a wall of static marketing text. Here are a few interactive details built right into the site:

- **Interactive Background Mesh:** Fullscreen WebGL (Three.js) scene simulating connected OT endpoints and energy grids, with real depth, per-node glow, and camera parallax. Nodes drift with organic physics, draw live vector connections, and gently repel away from your cursor with spring-mass dampening.
- **Electric Drag Trail & Particle Sparks:** Click and drag your mouse anywhere on the page! It generates an electric neon ribbon path with glowing spark micro-particles that shoot outward with real-time physics velocity and decay.
- **Mechanical Number Tally (Odometer Animation):** As you scroll down the page, statistics and KPI counters don't just jump into place — each individual digit reel scrolls vertically downward like a precision slot machine or mechanical ticker. You can also hover over or click any number to re-roll it!
- **3D Card Tilt & Specular Flashlight:** Cards across the page react to your mouse position with smooth 3D perspective rotation, casting a soft radial spotlight flare across their surfaces.
- **The "Interactive Lab" Cyber HUD:** Check out the floating button in the bottom-right corner! Opening it reveals:
  - ⚡ **Grid Stress Test (Cascade Simulator):** Triggers a high-voltage surge across the site — telemetry numbers spike, background nodes surge, and the anomaly is logged and resolved in 11ms as the real-time data stream re-syncs across all connected devices.
  - 🔊 **Procedural Sci-Fi Audio Synthesizer:** Built completely from scratch using the browser's native **Web Audio API** (zero external mp3 files). Generates procedural chimes on hover, crisp clicks on buttons, harmonic sweeps on radar pings, and electric hums when dragging.
  - 🎛️ **Background & Cursor Mode Switchers:** Switch between OT Mesh, Grid Matrix (orthogonal circuit paths), and Solar Drift.

---

## 🛠️ Built with Vanilla Web Tech (Plus One Library)

No React, no Next.js, no Tailwind, and no build step or `node_modules` to install.

- **HTML5:** Semantic, accessible markup structured logically from hero down to footer.
- **Vanilla CSS:** Custom design tokens, glassmorphism, responsive grid & flexbox layouts, and hardware-accelerated transforms.
- **Vanilla JavaScript:** Clean modules driving physics interpolation, custom cursor tracking, and the Web Audio engine.
- **Three.js (loaded via CDN, no bundler):** The kinetic background is real WebGL, not a flat 2D canvas, a shader-driven particle field with genuine depth, per-particle glow sprites, and camera parallax. Everything that already made the background feel alive (scroll-stage cluster physics, cursor wake, drag sparks, radar pings) is unchanged; only the renderer is new.

### Why (Mostly) Vanilla?
Frameworks are great, but keeping this build-step-free means:
- Instantaneous initial paint (< 50ms)
- Zero build steps required to run or deploy
- The one exception, Three.js, is a single dynamic `import()` from a CDN inside `app.js`, not a dependency you install; drop the import and the site still runs, just with no kinetic background.

---

## 🎨 Design & Brand Identity

This redesign is grounded in Univers' actual brand assets:
- **Brand Colors:** The real Univers brand purple, UN-Nebula (`#7A42EA`), straight from the Brand Guidelines' primary color palette, plus deep industrial navy (`#14142B`) for product UI surfaces and crisp light editorial canvas backgrounds (`#F5F5F7`).
- **Typography:** Set in Inter for both display and body text with tabular figures (`tnum`) for rock-solid metric alignment, plus JetBrains Mono for telemetry tags.
- **Global Headquarters:** Sourced directly from Univers' real Singapore headquarters at **1 Harbourfront Avenue, #17-01 Keppel Bay Tower, Singapore 098632**.

---

## 💻 Running Locally

You don't need `npm install` or any build toolchain. All you need is a basic static file server:

```bash
# Clone the repository
git clone https://github.com/evanyap7/univers-homepage-revamp.git
cd univers-homepage-revamp

# Start a local server (Python 3)
python3 -m http.server 8080

# Or using Node
npx serve .
```

Then open `http://localhost:8080` in your browser and you're good to go!

---

## 🚀 Deployment

The site is configured for zero-config static hosting on [Vercel](https://vercel.com/):
- Pushes to `main` automatically trigger builds and instant cache invalidation.
- `vercel.json` configures clean URLs and asset caching headers.

---

## ⚠️ Disclaimer

This is an **unofficial concept and portfolio redesign** inspired by [univers.com](https://univers.com/) and Univers' publicly available brand guidelines. It is not affiliated with, endorsed by, or officially representing Univers. All trademarks, logos, and company names belong to their respective owners.

---

## 👤 Author

Developed with care by **Evan Yap**.

- 💼 **LinkedIn:** [linkedin.com/in/evanyapzhikai](https://www.linkedin.com/in/evanyapzhikai/)
- 🌐 **Project Live URL:** [univers-homepage-revamp.vercel.app](https://univers-homepage-revamp.vercel.app/)

Feel free to reach out if you'd like to chat about front-end engineering, creative web design, or interactive UI!
