# GrowNova OS Mobile App - Design System Specification
**Project ID:** `6027635227182408661`  
**Theme:** Merchant Operating System (Warm Tactile Minimalism & Luxury Merchant Utility)  
**Target Device:** Mobile (390 x 844 viewport, high-density touch UI)

---
name: Merchant Operating System
colors:
  surface: '#fcf9f5'
  surface-dim: '#dcdad6'
  surface-bright: '#fcf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ef'
  surface-container: '#f0ede9'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e5e2de'
  on-surface: '#1c1c1a'
  on-surface-variant: '#44474e'
  inverse-surface: '#31302e'
  inverse-on-surface: '#f3f0ec'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#475f85'
  primary: '#001633'
  on-primary: '#ffffff'
  primary-container: '#102b4e'
  on-primary-container: '#7b93bc'
  inverse-primary: '#afc7f3'
  secondary: '#7c5800'
  on-secondary: '#ffffff'
  secondary-container: '#fecd70'
  on-secondary-container: '#785500'
  tertiary: '#001c03'
  on-tertiary: '#ffffff'
  tertiary-container: '#003307'
  on-tertiary-container: '#54a353'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#afc7f3'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#2f476c'
  secondary-fixed: '#ffdea6'
  secondary-fixed-dim: '#efbf64'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5e4200'
  tertiary-fixed: '#a3f69c'
  tertiary-fixed-dim: '#88d982'
  on-tertiary-fixed: '#002204'
  on-tertiary-fixed-variant: '#005312'
  background: '#fcf9f5'
  on-background: '#1c1c1a'
  surface-variant: '#e5e2de'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  currency-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.03em
  currency-headline:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  margin: 1rem
  margin-lg: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes a dignified, serene, and dependable operational atmosphere tailored specifically for local shopkeepers, traditional distributors, and emerging retail merchants across India. Rather than overwhelming proprietors with dense, industrial ERP spreadsheets or aggressive commercial neon, the design language treats commerce management with the quiet poise of a bespoke ledger book crossed with a modern luxury utility.

The aesthetic philosophy fuses warm tactile minimalism with subtle, translucent glass layers. The canvas avoids cold, clinical screens in favor of warm, ivory-tinged surfaces reminiscent of handmade ledger parchment, paired with an authoritative deep navy and understated royal brass gold accents. Every visual choice communicates financial prestige, enduring reliability, and operational mastery.

The user experience prioritizes cognitive relief:
- **Calm Authority:** Muted, natural palettes prevent eye fatigue during 12-hour retail shifts.
- **Immediate Legibility:** Hierarchy emphasizes immediate cash numbers, pending dues, and batch movements with unmistakable clarity.
- **Cultural Familiarity & Modern Pride:** Traditional mercantile trust translated through razor-sharp contemporary typography and respectful warmth.

## Colors

The palette rests upon high-trust foundations: Deep Navy represents institutional security, Warm Gold signifies prosperity and selective focus, Sage Green conveys positive balance, and Warm Ivory ensures a glare-free canvas.

### Core Swatches
- **Primary (`#102B4E` - Deep Navy):** Used for primary high-intent action buttons, title bars, and core numerical summaries.
- **Primary Dark (`#0B2340`):** Used for pressed states, bottom bar structural framing, and modal scrims.
- **Secondary (`#C69A43` - Muted Brass Gold):** Accents, active indicators, premium tiers, invoice watermarks, and quick-action icons.
- **Secondary Highlight (`#D5AD66` - Warm Gold):** Subtly applied to badge borders, active chips, and highlighted ledger summaries.
- **Neutral Canvas (`#F8F5F1` - Warm Ivory):** The global page background. Replaces default stark white to eliminate screen glare.
- **Surface Elevation (`rgba(255, 255, 255, 0.88)`): Frosted white card backgrounds providing clean separation against the ivory canvas.
- **Subdued Text / Slate (`#65758B`):** Metadata, tax labels, secondary timestamps, and placeholder copy.

### Semantic Tones
- **Positive Ledger (`#2E7D32` with `#E8F5E9` background):** Settled payments, positive cash flow, and inbound inventory confirmations.
- **Alert / Overdue (`#C62828` with `#FFEBEE` background):** Outstanding credit (Udhaar), overdue payments, zero stock warnings, and transaction errors.
- **Sync Neutral (`#455A64` with `#ECEFF1` background):** Offline state notices and local queue status badges.

## Typography

The typography couples an authoritative editorial serif for prestigious touchpoints with a geometric, high-legibility sans-serif for operational throughput.

### Font Hierarchy & Roles
- **Playfair Display (Headings & Hero Summaries):** Used selectively for store greetings, high-level business identity, report headers, and total revenue showcase banners. It introduces traditional mercantile trust and financial gravitas.
- **Plus Jakarta Sans (Body, Touch Targets & Numerical Data):** Deployed for all operational tables, lists, inputs, dialogs, buttons, and Indian Rupee (₹) amounts. Its open counters and clean geometry ensure clarity on budget mobile displays operating under bright daylight.

### Numerical & Currency Formatting Guidelines
- Numerical values must employ tabular numbers (`font-variant-numeric: tabular-nums`) to preserve column alignment across multi-row bills and ledgers.
- The Rupee symbol (`₹`) must inherit the exact font weight and color of its accompanying numeric value, preceded or succeeded by standard Indian numbering groupings (e.g., `₹12,45,800.00`).
