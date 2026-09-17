# Univers Elementor Implementation Blueprint
**Target Stack:** WordPress 6.x + Elementor Pro 4.2+ (Hello Elementor Child Theme)  
**Author:** AI Web Strategy & Engineering Pair  
**Design System Origin:** [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)  
**Aesthetic Profile:** Neo-Industrial Precision / High-Tech Governed Autonomy  

---

## 1. Global Site Settings & Tokens (Elementor Theme Builder)

Configure these values under **Elementor > Site Settings > Design System**:

### Color Palette Tokens
| Token Name | Hex Code | Purpose in UI |
|---|---|---|
| `Primary Deep Dark` | `#07090E` | Page background, canvas base |
| `Surface Dark` | `#0D121D` | Navigation background, secondary panels |
| `Card Glass Background` | `rgba(16, 23, 37, 0.75)` | Interactive cards with backdrop filter |
| `Electric Emerald` | `#00E599` | Primary CTA, active states, energy indicators |
| `Cyber Cyan` | `#00D2FF` | Secondary accents, AI telemetry, links |
| `Muted Border` | `rgba(255, 255, 255, 0.08)` | Subtle container dividers |
| `Text Primary` | `#FFFFFF` | Headings, high-contrast values |
| `Text Secondary` | `#94A3B8` | Body copy, subtitles |
| `Text Muted` | `#64748B` | Footnotes, captions, timestamps |

### Typography Scale
| Element | Font Family | Weight | Size (Desktop) | Size (Tablet) | Size (Mobile) |
|---|---|---|---|---|---|
| **H1 Display** | Space Grotesk | 700 | 56px / 1.08 | 44px / 1.12 | 34px / 1.15 |
| **H2 Section Title** | Space Grotesk | 700 | 44px / 1.15 | 36px / 1.2 | 28px / 1.25 |
| **H3 Card Title** | Space Grotesk | 600 | 24px / 1.25 | 22px / 1.3 | 20px / 1.3 |
| **Body Text** | Inter | 400 | 16px / 1.6 | 15px / 1.6 | 15px / 1.6 |
| **Telemetry / Data** | JetBrains Mono | 500 / 700 | Tabular Figures (`tnum`) | Responsive | Responsive |

---

## 2. Container Hierarchy & Widget Mapping (Act-by-Act)

### Act 1: High-Stakes Hero Section
- **Master Container**: `e-con: Flexbox Row (Boxed, 1280px max-width)`
  - Padding: `clamp(60px, 8vw, 100px) 24px`
  - Gap: `48px`
- **Left Column Container**: `e-con: Flexbox Column (Width 58%)`
  - **Widget 1 (Eyebrow)**: Elementor *Heading* or *HTML* with class `.eyebrow` (Green pulse badge).
  - **Widget 2 (H1 Headline)**: Elementor *Heading*, Space Grotesk 700 with CSS Gradient on `Univers runs it`.
  - **Widget 3 (Lead Text)**: Elementor *Text Editor*, Inter 400, color `#94A3B8`.
  - **Widget 4 (CTA Group)**: Inner Container (Flexbox Row, Wrap).
    - Button 1: *Button Pro* (Primary green, link to `#engine`).
    - Button 2: *Button Pro* (Secondary outline, link to `#calculator`).
  - **Widget 5 (Trust Bar)**: Inner Container (Flexbox Row, 3 Icon Boxes: IEC 62443, Sub-second Edge, Gartner Leader).
- **Right Column Container**: `e-con: Flexbox Column (Width 42%)`
  - **Widget (Live Telemetry Console)**: Elementor *Custom HTML* or *Nested Container Card* with class `.telemetry-console`.
    - Inner 2x2 Grid of *Counter / Metric widgets*.
    - Stream element `#hero-log-stream` for live autonomous decision logs.

---

### Act 2: Institutional Authority Strip
- **Master Container**: `e-con: Full Width (Background #090D15, Border Y 1px)`
  - Inner Container: `e-con: Boxed (1280px)`, Grid layout `repeat(4, 1fr)`.
  - **Widgets**: 4x *Counter / Stat Box* (1,070 GW+, 450M+ Sensors, 800+ Clients, Gartner Leader).
- **Client Marquee**:
  - Elementor *Loop Carousel* or *Custom HTML Marquee* with client marks: PSA International, Harmony Energy, Nordic Group, SBR Winner 2026, UN Global Compact.
  - Accessibility requirement: Pause on hover/focus, static display for `prefers-reduced-motion`.

---

### Act 3: The Industrial Shift (Comparison Section)
- **Master Container**: `e-con: Boxed (1280px, Padding Y 96px)`
  - Header Container: Centered Eyebrow + H2 + Subtitle.
  - Comparison Grid Container: `e-con: CSS Grid (2 Columns, 1fr 1fr, Gap 32px)`
    - **Card 1 (Legacy IoT)**:
      - Custom Class: `.compare-card.compare-legacy`
      - Background: `rgba(26, 16, 20, 0.4)`, Red top border `var(--univ-red)`
      - Icon List: Cross icons, highlighting Alarm Fatigue, 20-180m Latency, Siloed data.
    - **Card 2 (Univers Physical AI)**:
      - Custom Class: `.compare-card.compare-autonomous`
      - Background: `rgba(10, 28, 24, 0.4)`, Emerald top border `var(--univ-emerald)`
      - Icon List: Checkmark icons, highlighting Machine Speed, Closed-Loop Control, Governed Autonomy, Compounding Moat.

---

### Act 4: The Physical AI Engine (Perceive -> Understand -> Orchestrate)
- **Master Container**: `e-con: Boxed (1280px)`
  - Two-Column Flexbox / Grid:
    - **Left Column**: Elementor Pro *Nested Tabs* widget or 3 custom toggle buttons (`.engine-step-tab`).
      - Step 1: Perceive the World (450M+ connected assets, telemetry mesh).
      - Step 2: Understand the Physics (5-D Knowledge graph: time-series, spatial, relational, vector, graph).
      - Step 3: Orchestrate the Action (Domain AI agents with closed-loop execution).
    - **Right Column**: Visual Canvas Box (`.engine-screen`).
      - Flow nodes container showing Ingest $\rightarrow$ Ontology $\rightarrow$ Governed Act.
      - Simulated terminal showing live protocol stream (`BACnet, Modbus, IEC 61850, OPC-UA`).
      - Action button: "Simulate Event" triggering live anomaly pre-emption.

---

### Act 5: Critical Infrastructure Sector Explorer
- **Master Container**: `e-con: Boxed (1280px)`
  - Header: Eyebrow + H2 ("Industries that cannot afford to stop").
  - Navigation: Elementor *Nested Tabs* Tab Titles or Flexbox Pill Row (`.sector-pill`).
    - Pill 1: Energy & Utilities
    - Pill 2: Built Environment
    - Pill 3: Transportation & Ports
    - Pill 4: Industrial Manufacturing
  - Tab Content Card: 2-Column Container (`1.1fr 0.9fr`):
    - Left Column: Sector narrative + 3-column KPI boxes (e.g. 85M TEUs, 9.8% energy drop, 40% downtime reduction).
    - Right Column: Executive Quote Card with client photo/avatar, quote text, title, and organization (PSA, Harmony Energy, Starburst/Nordic).

---

### Act 6: The Compounding Flywheel & AMD Edge Hardware
- **Master Container**: `e-con: Boxed (1280px)`
  - 4-Column Grid: Flywheel steps (Value ID $\rightarrow$ 5-D Graph $\rightarrow$ Agent Deployment $\rightarrow$ Compounding Moat).
  - Hardware Banner Container: 2-Column Flexbox (`1.2fr 0.8fr`)
    - Custom Class: `.hardware-banner`
    - Content: EnOS™ AI Box debut with AMD at CES 2026, embedded NPU, DIN-rail fanless enclosure, &lt;10ms local edge latency.

---

### Act 7: Mission-Critical Security & Compliance Vault
- **Master Container**: `e-con: Boxed (1280px)`
  - 3-Column Grid:
    - Column 1: Industrial OT/IT Security (IEC 62443 4-1/4-2, ISO 27001, ISO 27701, SOC 2/3, MLPS Level 3).
    - Column 2: Global Regulations (EU NIS2, NERC CIP, NIST CSF 2.0, EU Cyber Resilience Act, GDPR).
    - Column 3: Sovereign Architecture (Singapore Cyber Trust, Air-Gap, Multi-region data residency).

---

### Act 8: Portfolio Value Calculator & High-Intent Conversion
- **Master Container**: `e-con: Boxed (1280px)`
  - Calculator Card: 2-Column Container
    - Left Column: Form Controls (Sector dropdown, Asset Volume range slider, Annual Spend slider).
    - Right Column: Dynamic Results Display (Estimated Net Savings, Projected Payback Period, CO2e Abatement, "Request Tailored Architecture Audit" CTA).

---

## 3. Elementor Custom CSS Snippets

Add to **Elementor > Site Settings > Custom CSS**:

```css
/* Glassmorphism card standard */
.univ-card-glass {
  background: rgba(16, 23, 37, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

.univ-card-glass:hover {
  border-color: rgba(255, 255, 255, 0.18);
  transform: translateY(-3px);
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.6);
}

/* Tabular figures for real-time telemetry metrics */
.univ-mono-metric {
  font-family: 'JetBrains Mono', monospace;
  font-feature-settings: "tnum" 1, "zero" 1;
}

/* Green Pulsing Indicator */
.univ-pulse-dot {
  width: 6px;
  height: 6px;
  background-color: #00E599;
  border-radius: 50%;
  box-shadow: 0 0 8px #00E599;
  animation: univ-pulse 2s infinite;
}

@keyframes univ-pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 229, 153, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(0, 229, 153, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 229, 153, 0); }
}
```

---

## 4. Performance & Elementor Optimization Checklist
- [x] **Container Flexbox/Grid enabled**: Zero nested legacy inner-sections.
- [x] **Font Display Swap**: Google Fonts Space Grotesk, Inter, and JetBrains Mono loaded with `&display=swap`.
- [x] **Optimized SVG assets**: All icons implemented as inline clean SVG instead of bulky icon font libraries (FontAwesome).
- [x] **DOM Depth minimization**: Container levels strictly limited to $\le 3$ tiers.
- [x] **Accessibility compliance**: All interactive controls have visible focus rings, ARIA role labels (`tablist`, `tab`, `tabpanel`), and respect `prefers-reduced-motion`.
