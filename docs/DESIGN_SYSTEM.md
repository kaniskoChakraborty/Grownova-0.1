# GrowNova OS — Canonical Design System Specification

## 1. Executive Summary & Design Philosophy

**GrowNova OS** is an AI-first, browser-based Business Operating System designed specifically for small businesses, manufacturers, traders, and shopkeepers across India.

Rather than resembling a generic enterprise ERP or an overcomplicated SaaS admin template, GrowNova OS delivers the feeling of a **calm, spatial, premium operating environment that happens to run inside a browser**.

### Canonical Visual Reference
The sole source of truth for all visual design across the entire product is the canonical dashboard design:
- **Canonical Atmospheric Artwork**: `web/public/dashboard-bg.jpg`

Every public landing page, authentication screen, executive dashboard, and vertical module view must adhere strictly to these principles.

---

## 2. Centralized Color Palette & Design Tokens

| Token Variable | Hex / RGBA Value | Semantic Usage |
|---|---|---|
| `--gn-bg-ivory` | `#F8F5F1` | Canonical warm ivory canvas background |
| `--gn-primary-navy` | `#102B4E` | Primary brand navy, primary action buttons, dark text |
| `--gn-dark-navy` | `#0B2340` | Deepest contrast navy, active date rings, button hover |
| `--gn-muted-gold` | `#C69A43` | Signature GrowNova gold, accent divider lines, active tab indicators |
| `--gn-warm-gold` | `#D5AD66` | Luminous gold highlight for button gradients and badges |
| `--gn-glass-surface` | `rgba(255, 255, 255, 0.78)` | Translucent floating panel backgrounds |
| `--gn-glass-border` | `rgba(255, 255, 255, 0.92)` | Subtle specular edge border highlight |
| `--gn-secondary-text` | `#65758B` | Secondary labels, metrics captions, timestamps, table headers |
| `--gn-soft-surface` | `rgba(255, 255, 255, 0.55)` | Inner sub-cards, inactive filters, neutral badges |
| `--gn-status-positive`| `#15803D` (emerald-700) | Positive growth indicators (`+18.4%`), System Online status |
| `--gn-status-negative`| `#DC2626` (red-600) | Alerts, overdue invoices, critical stock levels |

---

## 3. Typography Hierarchy

GrowNova OS pairs an **editorial serif** with an ultra-legible **modern sans-serif** to balance warmth, prestige, and small-business clarity.

### Typography Roles:
1. **Editorial Serif (`Playfair Display` / `Instrument Serif`)**:
   - Executive dashboard greetings (`"Good morning, Ravi"`, `"Welcome, Taksh"`)
   - Marketing headlines and value propositions
   - Major application module titles (`"GST & Double-Entry Accounting"`, `"Executive Calendar & Agenda"`)
   - Primary metric numbers in hero KPI panels
   - Editorial philosophy statements (`"Quiet clarity for the modern Indian enterprise"`)
2. **Interface Sans-Serif (`Plus Jakarta Sans` / `Inter`)**:
   - Navigation links and top menu items
   - Interactive buttons, form inputs, and dropdown selectors
   - Data tables, ledger rows, and inventory listings
   - Status badges, tooltips, tags, and secondary descriptions
   - Time slots, addresses, and phone numbers

> **Rule:** Never render all headings in bold sans-serif. Always preserve the editorial serif for major titles to maintain the calm, high-end operating system atmosphere.

---

## 4. Glass Surfaces & Elevation Hierarchy

GrowNova OS utilizes layered glassmorphism inspired by Apple visionOS, ensuring panels feel weightless yet readable.

### Standardized CSS Classes:

1. **`.os-nav-island`**:
   - Floating pill navigation bar at top center.
   - Background: `rgba(255, 255, 255, 0.78)` with `backdrop-filter: blur(16px)`.
   - Border: `1px solid rgba(255, 255, 255, 0.92)`.
   - Shadow: `0 8px 32px 0 rgba(16, 43, 78, 0.08)`.

2. **`.gn-panel`**:
   - Standard container for business panels, KPI cards, and modals.
   - Background: `rgba(255, 255, 255, 0.78)` with `backdrop-filter: blur(14px)`.
   - Border: `1px solid rgba(255, 255, 255, 0.92)`.
   - Corner radius: `rounded-3xl` (`24px`).
   - Inner highlight: `inset 0 1px 1px rgba(255, 255, 255, 0.9)`.

3. **`.gn-panel-dense`**:
   - Optimized for data-dense tables (General Ledger, Invoicing, Inventory).
   - Slightly higher opacity (`rgba(255, 255, 255, 0.88)`) to ensure complete contrast over background terrain.

4. **`.gn-app-tile`**:
   - Rounded-square squircle tile for the 10 canonical workspace applications.
   - Subtle hover elevation (`translate-y-[-2px]`), border highlight, and soft gold drop shadow.

5. **Buttons**:
   - **`.gold-glow-btn`**: Primary action button (`linear-gradient(135deg, #D5AD66 0%, #C69A43 100%)` with gold ambient glow).
   - **`.navy-btn`**: Executive dark button (`#102B4E` with gold border accent and white text).
   - **Secondary Glass Button**: White translucent glass (`bg-white/80 hover:bg-white`) with thin border.

---

## 5. Background Atmosphere & Environmental Modes

The misty mountain environment with morning golden sunlight is the signature visual backdrop of GrowNova OS.

### Environmental Rules:
1. **Scenic Mode (Executive Dashboards & Landing Hero)**:
   - Full mountain scenery visible behind the floating glass panels.
   - Gradient overlay: `from-[#F8F5F1]/85 via-transparent to-[#F8F5F1]/40` allowing the horizon to breathe.
2. **Restrained Data Mode (Dense Business Modules)**:
   - When entering dense data screens (Accounting, CRM, Inventory, Reports), the OS automatically engages a restrained backdrop wash:
     `bg-gradient-to-b from-[#F8F5F1]/94 via-[#F8F5F1]/90 to-[#F8F5F1]/94 backdrop-blur-[1px]`.
   - This prevents background terrain ridges from conflicting with table grids, numbers, or form controls.
3. **No Random Assets**:
   - Unrelated stock photos, office desks, or uncalibrated gradients are strictly banned.
   - All pages use `public/dashboard-bg.jpg` as the single shared atmospheric canvas.

---

## 6. OS Shell & Navigation Architecture

GrowNova OS is architected as an integrated browser desktop:
- **No Permanent Left Sidebar**: To maximize screen real estate for wide Indian financial ledgers and GST tables, navigation is strictly floating at the top.
- **Top Navigation Island**:
  - Left: GrowNova Compass Logo (`8-pointed faceted star + GrowNova OS`).
  - Center: Module links (Home, CRM, Inventory, Accounting, HR, Reports) + `More` dropdown (Calendar, People, Projects, Documents, Compliance, Settings).
  - Right: Quick Search (`⌘K`), Notifications bell with unread badge, and User Avatar with role switcher.
- **Unified Modals**:
  - Global Search modal (`⌘K`)
  - Tax Invoice Quick Modal
  - Expense Quick Modal
  - Customer Quick Modal
  - Leave Ticket Quick Modal

---

## 7. Role-Specific Perspectives

GrowNova OS adapts its presentation according to the user's role without changing the underlying OS shell:
- **Owner (`OWNER`)**: Full operational & financial overview, B2B turnover, GST liability, quick invoice dispatch.
- **Manager (`OPS`)**: Shift execution, stock movements, team sprint progress, voucher authorizations.
- **Employee (`EMPLOYEE`)**: Personal day planner, attendance punch-in, assigned orders, leave balances.

---

## 8. Screen Scale & Viewport Standards

GrowNova OS is engineered to fit comfortably within standard desktop viewports (such as 1600×900) without awkward middle clutter, while smoothly reflowing into responsive mobile and tablet layouts.
