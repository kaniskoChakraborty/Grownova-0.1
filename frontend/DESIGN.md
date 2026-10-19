---
name: GrowNova OS Structural Architecture
colors:
  surface: '#F8F5F1'
  surface-dim: '#EAE5DC'
  surface-bright: '#FFFFFF'
  surface-container-lowest: '#FFFFFF'
  surface-container-low: '#F3EFE8'
  surface-container: '#ECE7DD'
  surface-container-high: '#E2DCD1'
  surface-container-highest: '#D6CFC1'
  on-surface: '#102B4E'
  on-surface-variant: '#55677D'
  inverse-surface: '#0B2340'
  inverse-on-surface: '#F8F5F1'
  outline: 'rgba(16, 43, 78, 0.12)'
  outline-variant: 'rgba(16, 43, 78, 0.06)'
  surface-tint: '#C69A43'
  primary: '#102B4E'
  on-primary: '#FFFFFF'
  primary-container: '#1E3E66'
  on-primary-container: '#F7EEDA'
  inverse-primary: '#C69A43'
  secondary: '#C69A43'
  on-secondary: '#102B4E'
  secondary-container: '#F7EEDA'
  on-secondary-container: '#8C6718'
  tertiary: '#15803D'
  on-tertiary: '#FFFFFF'
  tertiary-container: '#DCFCE7'
  on-tertiary-container: '#166534'
  error: '#DC2626'
  on-error: '#FFFFFF'
  error-container: '#FEE2E2'
  on-error-container: '#991B1B'
  background: '#F8F5F1'
  on-background: '#102B4E'
  surface-variant: '#EFEBE3'
typography:
  display-editorial:
    fontFamily: Instrument Serif
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  display-editorial-mobile:
    fontFamily: Instrument Serif
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-os:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  body-ui:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  mono-numeral:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.02em
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.5rem
  DEFAULT: 0.75rem
  md: 1rem
  lg: 1.5rem
  xl: 1.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1540px
  gutter: 24px
  margin-edge: 32px
  section-gap: 32px
---

# GrowNova OS — Structural Architecture & Visual Operating System

## 1. Visual Theme & Atmosphere
GrowNova OS is a spatial, tactile Business Operating System designed specifically for modern Indian small business owners and mid-market enterprise operators. The environment pairs a peaceful, sun-washed Himalayan dawn landscape with high-precision VisionOS-grade glassmorphic panels. 

The aesthetic is grounded, authoritative, and tranquil:
- **Atmosphere:** Sunlit Warm Minimalist Cockpit (Density: 7, Variance: 6, Motion: 6).
- **Spatial Elevation:** Frosted white glass containers (`rgba(255, 255, 255, 0.82)` to `0.95`) float effortlessly over warm natural terrain with diffused ambient shadows (`rgba(16, 43, 78, 0.08)` blur 32px).
- **Physicality:** Tactile buttons, crisp hairlines (`rgba(16, 43, 78, 0.08)`), subtle micro-reflections, and rounded glass pills that feel like physical objects on a frosted glass desk.

## 2. Color Palette & Functional Roles
- **Canvas Cream (#F8F5F1):** The overarching light canvas, inspired by warm handmade paper and clean morning daylight.
- **Deep Midnight Navy (#102B4E):** Primary brand authority. Used for prominent typography, primary command buttons, and strong visual anchors.
- **Imperial Gold Ochre (#C69A43):** Restrained accent for executive gold dashes (`—`), active status rings, and milestone notifications. Maximum 1 accent. Saturation capped below 75%.
- **Pale Gold Silk (#F7EEDA):** Ambient fill for active tabs, icon badges, and highlight containers.
- **Muted Steel Slate (#55677D):** Secondary text, descriptions, table column headers, and breadcrumbs.
- **Forest Cash-Flow Green (#15803D):** Statutory compliance, verified GST badges, and positive month-over-month growth indicators.
- **Whisper Border (rgba(16, 43, 78, 0.08)):** 1px hairline perimeter borders for cards, modals, and split viewports.

## 3. Typographic Architecture & Strict Rules
- **Editorial Voice (Instrument Serif):** Exclusively reserved for warm executive greetings (`"Good morning, owner"`) and philosophical quotes (`"Same vision. A bigger tomorrow."`).
- **Operating System Grotesk (Plus Jakarta Sans):** The workhorse typeface for administrative modules, CRM pipelines, inventory tracking, calendar agendas, and modals. Tracked tight (`-0.02em`) with weight-driven hierarchy.
- **Financial Monospace (JetBrains Mono / Tabular Numeral):** Mandatory for all turnover metrics, GSTIN codes, invoice balances, and stock inventory counts (`tabular-nums font-bold tracking-tight`).
- **Typography Anti-Patterns:** Generic serif (`Times New Roman`, `Georgia`, `Garamond`) is strictly BANNED. Serif is strictly BANNED on numbers, buttons, table cells, form labels, and administrative cards. `Inter` is BANNED to avoid commoditized AI slop.

## 4. Component Stylings & Interaction Specifications
- **Floating Island Navigation:** Centered frosted capsule (`backdrop-blur-xl bg-white/80 border border-white/95 rounded-full`) housing active module tabs with smooth pill indicators.
- **High-Density Bento Cards:** Generously radiused (`rounded-[24px]` or `rounded-[28px]`), pure white or 90% frosted translucent fills, 1px hairline border, diffused ambient depth.
- **Metric Tiles:** Clean sans-serif title (`text-xs uppercase font-bold tracking-wider text-[#55677D]`), followed directly by bold tabular metric (`text-2xl sm:text-3xl font-bold tracking-tight text-[#102B4E]`).
- **Command Buttons:** Tactile push feedback (`active:scale-[0.98]`). Primary buttons in solid Deep Navy (`#102B4E`) with subtle gold border highlights. Ghost buttons in frosted glass.
- **Quick Action Modals:** Full-screen soft backdrop blur (`bg-[#102B4E]/30 backdrop-blur-md`), centered rounded sheet (`rounded-[28px]`), clear inputs with focus rings in Gold Ochre (`#C69A43/40`).

## 5. Structural Architecture & Layout Seams
1. **Global Spatial Canvas (`fixed inset-0`):** Photographic environmental mountain backdrop with warm golden-hour light blooms and gradient masks ensuring high typographic contrast.
2. **Top Navigation Layer:**
   - Left: GrowNova Compass Logo with dual-ring brass compass star.
   - Center: Floating Island App Switcher (Home, CRM, Inventory, Accounting, HR, Reports, More).
   - Right: Global Omnibox (`⌘K`), Notification Bell with live badge, Executive Profile Pill.
3. **Executive Dashboard Hero Split:**
   - Left Editorial Anchor (Col 1-4): Gold dash, warm executive greeting, contextual micro-summary.
   - Right Operational Cockpit (Col 5-12):
     - Card A: **Business at a Glance** — 4 core telemetry pillars (Revenue, Expenses, Tasks, Meetings).
     - Card B: **Workspace Grid** — 10 modular OS application launchers (People, Projects, Finance, CRM, Inventory, HR, Documents, Reports, Compliance, Settings).
     - Card C: **Interactive Calendar & Schedule** — Split month matrix and chronological day agenda.
4. **Bottom Telemetry Dock:** System Health Indicator (`● System Online`), Demo Mode tag, Carousel Nav, and Brand Anchor.

## 6. Motion & Hardware-Accelerated Physics
- **Spring Physics:** Easing calibrated to `stiffness: 140, damping: 22` for realistic, weighted physical response.
- **Hardware Acceleration:** Animations restricted exclusively to `transform` and `opacity` with CSS `will-change`.
- **Perpetual Micro-Interactions:** Subtle live pulses on connected webhooks, gentle hover lifts (`-2px`), and soft page crossfades.

## 7. Anti-Patterns & Banned AI Slop
- **NO Mechanical Underlines:** BANNED stamping arbitrary gold bars or colored lines underneath every KPI card.
- **NO AI Purple / Neon Glows:** No purple button glows, cyan drop shadows, or futuristic cyberpunk gradients.
- **NO Sparkles on Routine Tasks:** No `<Sparkles />` icons on statutory tax calculations, accounting ledgers, or employee punch cards.
- **NO Cluttered KPI Rows on Dedicated Tools:** Dedicated tool views (e.g. Calendar) must heroize their primary interface rather than repeating boilerplate 4-card metric blocks.
- **NO Pure Black (#000000):** Deepest tone is Deep Midnight Navy (`#102B4E`) or Dark Charcoal (`#0B2340`).
- **NO Broken Placeholder Assets:** Verified high-resolution imagery and vector SVG icons only.
