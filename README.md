# Univers Physical AI — Concept Redesign

> **The Platform for Physical AI**
> Physical AI that runs the world's critical operations. 1,070 GW+ managed | 450M+ connected devices | Gartner Magic Quadrant Leader 2025.

> ⚠️ **Unofficial concept project.** This is a design & front-end exercise inspired by [univers.com](https://univers.com/). It is **not affiliated with, endorsed by, or representing Univers**. Company names, statistics, and customer quotes are sourced from Univers' public website and customer stories; see the footer disclosure on the live page for details. The page is served with `noindex, nofollow` so it is not indexed by search engines.

---

## Overview

This repository is a single-page, dependency-free static site (`index.html`, `index.css`, `app.js`) built as a UI/UX concept redesign of Univers' public marketing homepage. It's a fully deployable static site — no build step, no framework, no backend.

Sections cover: hero + live telemetry simulator, institutional scale & real customer/award recognition, the industrial market shift, an interactive "Perceive → Understand → Orchestrate" architecture simulator, a four-sector outcomes explorer (Energy, Built Environment, Transportation & Ports, Manufacturing) with a verified customer testimonial (ORIX) and case studies, the EnOS™ AI Box hardware banner, a security & compliance overview linking to Univers' official Trust Center, and an illustrative ROI calculator.

## Local development

```bash
python3 -m http.server 8088
open http://localhost:8088
```

No build step is required — edit `index.html` / `index.css` / `app.js` directly and refresh.

## Deployment

This is a zero-config static site. `vercel.json` sets clean URLs and long-lived caching for CSS/JS/SVG assets.

```bash
npm i -g vercel   # if not already installed
vercel deploy --prod
```

Or connect the repo in the Vercel dashboard — it will auto-detect a static site (no framework, no build command needed).

## Design system

- **Logo:** the real Univers wordmark (orbit-ring mark + "univers" logotype), extracted as vector paths from the brand's own master deck template rather than redrawn — see `favicon.svg` and the inline `.brand-logo-mark` SVG in `index.html`
- **Typography:** Inter for both display and body, matching Univers' real brand system (every Latin run set in one face — Aptos Display in the deck template — rather than a separate heading/body pairing). Aptos Display has no web-embeddable distribution, so Inter is the closest freely-licensed substitute. Fraunces Italic remains a deliberate editorial accent for pull quotes; JetBrains Mono for telemetry/data labels — via Google Fonts
- **Palette:** Neo-Industrial Deep Dark (`#07090E`), Electric Emerald (`#00E599`), Cyber Cyan (`#00D2FF`) — WCAG AA-verified text contrast
- **Icons:** hand-authored inline SVG, stroke-based, consistent with the Feather/Tabler style referenced in [bradtraversy/design-resources-for-developers](https://github.com/bradtraversy/design-resources-for-developers)
- Accessible mobile navigation (offcanvas drawer), scroll-reveal micro-interactions that respect `prefers-reduced-motion`, and sticky-header-aware anchor scrolling

Originally built using design system intelligence from [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill).

## Content sourcing

Copy, statistics, customer names, and the one attributed testimonial in this build are sourced from univers.com's homepage, about page, and published customer stories (ORIX, PSA, Indorama). Where no verified named quote existed for a sector, the site uses factual, unattributed case-study framing instead of inventing a person — see `app.js` → `sectorData` for the `quoteType` distinction between `testimonial` (verified, attributed) and `caseStudy` (factual, unattributed).

## License

Personal concept/portfolio project. Not an official Univers property.
