# 🌟 GrowNova — One Operating System

<div align="center">

<!-- Animated Typing SVG Header Banner -->
<a href="https://github.com/kaniskoChakraborty/Grownova-0.1">
  <img src="https://readme-typing-svg.demolab.com?font=Playfair+Display&weight=700&size=30&duration=3000&pause=1000&color=C2831E&center=true&vCenter=true&width=820&lines=Your+business.+One+operating+system.;Built+for+Indian+Enterprises+%26+MSMEs;Next-Gen+Apple+visionOS+Liquid+Glass+UI;Sales+%E2%80%A2+CRM+%E2%80%A2+Accounting+%E2%80%A2+HR+%E2%80%A2+Reports;Experience+GrowNova+in+One+Click+%E2%86%92" alt="GrowNova Typing Banner" />
</a>

<p align="center">
  <b>An AI-first, vernacular, one-tap business OS engineered for Indian enterprises, MSMEs, and entrepreneurs.</b>
  <br />
  <i>Unified sales, finance, inventory, CRM, HR, compliance, and everyday business intelligence.</i>
</p>

<!-- Technology Badges -->
<p align="center">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/NestJS_11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/Prisma_7-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma 7" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Design-visionOS_Liquid_Glass-C2831E?style=for-the-badge&logo=apple&logoColor=white" alt="Apple visionOS Glass" />
</p>

<p align="center">
  <a href="#-quick-start-for-anyone-non-tech-friendly">⚡ Quick Start</a> •
  <a href="#-current-phase--roadmap">📌 Status & Roadmap</a> •
  <a href="#-what-all-we-have-built-till-now">✨ What We Built</a> •
  <a href="#-visual-previews">📸 Visual Previews</a> •
  <a href="#-backend-api-architecture">⚙️ Backend Architecture</a> •
  <a href="#-project-structure">📂 Project Structure</a> •
  <a href="#-faq--troubleshooting-for-non-tech-users">❓ FAQ</a>
</p>

---

</div>

<br />

## 📌 Current Phase & Roadmap

**Current Progress: Phase 8 — CRM Leads, WhatsApp Webhook & GrowAI Enrichment (Completed)**

| Phase | Scope | Status |
|-------|-------|--------|
| **Phase 0** | NestJS 11 foundation, environment config, health check endpoint | ✅ Done |
| **Phase 1** | Prisma + PostgreSQL, Redis, initial schema migration, module skeletons | ✅ Done |
| **Phase 2** | Shared Zod API contracts, global `ValidationPipe`, JWT authentication, businesses API | ✅ Done |
| **Phase 3** | Refresh tokens (Redis-backed session management), session revocation / logout | ✅ Done |
| **Phase 4** | Role-based access control (`RolesGuard`), tenant-scoped business API, business update/deactivate/delete | ✅ Done |
| **Phase 5** | Audit logging with SHA-256 cryptographic hash chaining, tamper detection, global exception filter, rate limiting (`ThrottlerGuard`), database seeding (`prisma/seed.ts`) | ✅ Done |
| **Phase 6** | Owner onboarding flow with industry UI presets, DigiLocker consent/KYC mock adapter, WhatsApp conversational intake contract | ✅ Done |
| **Phase 7** | Legacy data migration engine for Indian MSMEs: Excel (`.xlsx`, `.xls`) and Tally XML (`.xml`) parsers with normalized schema extraction | ✅ Done |
| **Phase 8** | WhatsApp inbound webhook to CRM leads, GrowAI lead enrichment & scoring, CRM leads CRUD & contracts | ✅ Done |
| **Phase 9** | Full domain module logic (Inventory catalog sync, POS billing, GST invoicing) | ⏳ In Progress |
| **Phase 10** | Live third-party integrations (Official WhatsApp Business API, Sandbox GSTN e-Invoice/e-Way, Sandbox ONDC Beckn protocol) | 📋 Planned |

---

## ⚡ Quick Start for Anyone (Non-Tech Friendly)

You do **NOT** need to be a programmer or terminal expert to run GrowNova. Follow whichever option is easiest for you:

### 🚀 Option 1: The One-Click Way (Windows & Mac)

<details open>
<summary><b>Click to expand One-Click Instructions</b></summary>
<br />

1. **Prerequisite**: Make sure **Node.js** is installed on your computer. If not, download it once from [nodejs.org](https://nodejs.org/) (click the big green **LTS** button and install).
2. **On Windows**:
   - Double-click the file named **`run.bat`** in this project folder.
   - It will automatically verify packages, launch your browser, and open GrowNova at `http://localhost:5173`!
3. **On Mac or Linux**:
   - Double-click or run `./run.sh` in your terminal.
   - That's it! GrowNova opens immediately in your web browser.

</details>

---

### 💻 Option 2: Frontend Development (React 19 + Vite)

If you are running or developing the frontend UI in your terminal:

```bash
# Step 1: Clone this repository and enter the directory
git clone https://github.com/kaniskoChakraborty/Grownova-0.1.git
cd Grownova-0.1

# Step 2: Switch to your branch
git checkout devansh

# Step 3: Run the frontend application
cd frontend
npm install
npm run dev
```

Now open your web browser and visit:
👉 **[http://localhost:5173](http://localhost:5173)**

---

### 🛠️ Option 3: Backend API (NestJS 11 + Prisma 7 + Redis)

If you are running the backend API services:

#### Prerequisites
- **Node.js**: `v20+` or `v22+` (LTS recommended)
- **npm**: `v10+`
- **PostgreSQL**: A reachable database instance (local, Docker, or managed)
- **Redis**: A running instance (default `127.0.0.1:6379`)

#### Start PostgreSQL & Redis via Docker:
```bash
# PostgreSQL 16
docker run -d --name grownova-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=grownova \
  -p 5432:5432 postgres:16

# Redis 7
docker run -d --name grownova-redis \
  -p 6379:6379 redis:7
```

#### Install dependencies & configure environment:
```bash
# In the root project directory:
npm install
cp .env.example .env
```

#### Database Setup & Migrations:
```bash
# 1. Generate the Prisma client
npx prisma generate

# 2. Apply database migrations
npx prisma migrate dev

# 3. Seed demo data (Business, all 4 user roles, modules, initial audit logs)
npx prisma db seed
```

#### Start the Backend Server:
```bash
# Development mode with hot-reload
npm run start:dev

# Or production build and run
npm run build
npm run start:prod
```

---

### 🌐 Quick Navigation URLs

| Screen / Feature | Web URL | Description |
| :--- | :--- | :--- |
| 🏠 **Main Landing Page** | [`http://localhost:5173/`](http://localhost:5173/) | Hero presentation with 3D liquid glass visionOS dashboard |
| 🔐 **Dedicated Auth Page** | [`http://localhost:5173/auth`](http://localhost:5173/auth) | Dual glass slabs for instant Sign In & Sign Up transitions |
| 🩺 **Backend Health API** | [`http://localhost:3000/health`](http://localhost:3000/health) | NestJS system status and health verification probe |
| 📚 **Swagger OpenAPI Docs** | [`http://localhost:3000/docs`](http://localhost:3000/docs) | Interactive API documentation with JWT & file upload testing |

<br />

---

## 📸 Visual Previews

### 1. Main Landing Page & Apple visionOS Liquid Glass Dashboard
*Featuring authentic frosted translucency, 3D specular rim reflections, and interactive spatial mouse tilt over the sunlit Indian heritage scene:*

<div align="center">
  <img src="docs/screenshots/landing-preview.png" alt="GrowNova Landing Page and visionOS Glass Dashboard" width="95%" style="border-radius: 18px; box-shadow: 0 20px 40px rgba(0,0,0,0.15);" />
</div>

<br />

### 2. Dedicated Authentication Experience (`/auth`)
*Dual liquid glass slab architecture with live Sign In / Sign Up tab switching, high-resolution vector mini-dashboard, and enterprise Single Sign-On:*

<div align="center">
  <img src="docs/screenshots/auth-preview.png" alt="GrowNova Dedicated Auth Page" width="95%" style="border-radius: 18px; box-shadow: 0 20px 40px rgba(0,0,0,0.15);" />
</div>

<br />

---

## ✨ What All We Have Built Till Now

Here is a comprehensive breakdown of everything built into the GrowNova platform across frontend and backend:

### 💎 1. Apple visionOS Liquid Glassmorphism System
- **100% Vector Precision**: Completely eliminated low-resolution raster artifacts. All text uses true scalable web fonts (`Playfair Display` serif & `Plus Jakarta Sans`), and all icons are razor-sharp vector SVGs.
- **Authentic Glass Physics**: Engineered using multi-layer CSS:
  - Frosted liquid backdrop blur: `backdrop-filter: blur(28px) saturate(175%)`
  - 3D Bevel Highlights: Inset multi-angle specular gleams (`inset 0 2px 3px rgba(255,255,255,0.95)` and bottom base reflections).
  - Ambient Golden Rim Glow: Soft radial ambient lighting matching the golden hour sunset.
- **Spatial Mouse Parallax (Gyroscopic Tilt)**: Real-time 3D rotation (`perspective(1200px)` with subtle `rotateX` and `rotateY` response) as the user navigates their cursor across the viewport.

---

### 📊 2. Executive Command Dashboard (`VisionDashboard.tsx`)
- **Top Header Bar**:
  - Official GrowNova brand logo with interlocking gear-node icon.
  - Active navigation pill capsule: `Home` (amber active state), `CRM`, `Accounting`, `HR`, and `Reports`.
  - Global Search pill with keyboard shortcut badge: `Search or ask... ⌘ K`.
  - Notification bell with red status badge.
  - User Profile chip featuring executive portrait avatar (Ravi, Owner) and quick dropdown chevron.
- **Greeting & Live Telemetry KPIs**:
  - Editorial date stamp: `Mon, 5 September 2025`.
  - Elegant serif greeting: `Good morning, Ravi` with warm amber underline bar and subtitle `Your business. In better hands.`
  - **4 KPI Stat Cards** with customized smooth bezier sparklines:
    1. 📈 **Total Sales**: `₹ 12,48,000` (`↑ 12% vs last month` + emerald green curve)
    2. 🛒 **Total Orders**: `246` (`↑ 8% vs last month` + warm amber curve)
    3. 💳 **Outstanding**: `₹ 3,42,000` (`↑ 5% vs last month` + red alert curve)
    4. 👥 **Active Customers**: `186` (`↑ 14% vs last month` + emerald green curve)
- **Sales Overview Interactive Chart**:
  - Timeframe selector dropdown (`This Month ∨`, `Last Month`, `Q3 FY25`, `This Year`) + expand button.
  - Large metric display: `₹ 12.48L` with growth banner `Steady growth. Stronger tomorrow.`
  - Mathematical SVG area chart with sapphire wave curve and soft gradient fill.
  - Interactive glowing node at **15 Sep** with floating dark navy tooltip: `₹ 2,48,000`.
- **2×2 Quick Actions Grid**:
  - 📄 **Create Invoice**: Amber frosted card with gold document icon.
  - 👤+ **Add Customer**: Sky blue frosted card with user-plus icon.
  - 🧾 **Record Expense**: Soft lavender frosted card with receipt icon.
  - 📅 **Approve Leave**: Mint green frosted card with calendar icon.
- **Things to Do Workflow Checklist**:
  - Dynamic completion states: Click any task to toggle between completed (solid blue square with white checkmark) and pending.
  - Urgency indicators: `Today` (coral/red), `Tomorrow` (amber), `In 2 days` (gray), `In 3 days` (gray).
  - Quick action forward button `(→)`.

---

### 🔐 3. Dedicated Authentication Suite (`/auth`)
- **Direct Route**: `http://localhost:5173/auth` is completely isolated from the landing page.
- **Dual Slab Composition**: Matches the visual reference, rendering two vertical glass slabs standing on the mahogany executive desk.
- **Instant Client-Side Tab Switching**:
  - Seamlessly toggle between **Sign In** and **Sign Up** inside the right glass panel without page reloads.
- **Sign In View**:
  - Frosted email input with mail icon.
  - Frosted password input with lock icon and interactive `Eye` / `EyeOff` visibility toggle.
  - "Keep me signed in" checkbox + interactive "Forgot password?" reset toast notification.
  - Golden amber CTA button: `Sign in →`.
  - Enterprise Single Sign-On: Google (`Continue with Google`) and Microsoft (`Continue with Microsoft`) vector branded cards.
- **Sign Up View**:
  - Full Name, Business / Company Name, Email, Password, and Confirm Password fields.
  - Full client validation with matching password checks.
  - Golden amber CTA button: `Create account →`.
- **Left Panel Mini Dashboard Preview (`GrowNovaPreview.tsx`)**:
  - A perfectly scaled, razor-sharp vector miniature of the visionOS glass dashboard embedded directly inside the left glass slab.

---

### 👑 4. Hero Section & Typography Alignment (`HeroLeft.tsx`)
- **Flush Left Margin Alignment**: Cleanly aligned uppercase eyebrow `AN OPERATING SYSTEM FOR INDIAN BUSINESSES`, large dual-tone headline `Your business. One operating system.`, and body paragraph.
- **Call-to-Action Buttons**:
  - `Start with GrowNova →` (warm golden gradient with glowing hover effect, routes to `/auth?mode=signup`).
  - `Explore the OS ▶` (frosted glass button with play icon).
- **Value Proposition Badges**:
  - 📊 `All-in-one business platform`
  - ⚡ `AI-powered decisions (Axiom)`
  - 🛡️ `Built for India compliance ready`

---

## ⚙️ Backend API Architecture

Built with **NestJS 11**, **TypeScript 5**, **Prisma 7** (PostgreSQL), **Redis**, and **JWT** authentication.

### Core Backend Capabilities

1. **Authentication & Session Security (`/auth`)**:
   - Dual-token architecture: short-lived Access Token (15m) + Redis-stored Refresh Token (7d).
   - Redis token revocation on logout.
   - Role-Based Access Control (`OWNER`, `ACCOUNTANT`, `OPS`, `EMPLOYEE`) guarded via `@Roles()` decorator and `RolesGuard`.
2. **Multi-Tenant Business Management (`/businesses`)**:
   - Strict tenant isolation enforced at database and middleware level.
   - Soft-deactivation (`isActive = false`) and full business profiles.
3. **Cryptographic Audit Ledger (`/audit`)**:
   - SHA-256 hash-chained immutable audit log.
   - Every mutation records actor, entity, payload, IP, user-agent, and previous hash.
   - Runtime integrity verification endpoint (`GET /audit/integrity`) to instantly detect data tampering.
4. **Owner Onboarding & Dynamic UI Presets (`/onboarding`)**:
   - Seamless onboarding flow automatically computing UI presets (`retail`, `manufacturing`, `services`, `general`).
5. **DigiLocker KYC Mock Integration (`/integrations/digilocker`)**:
   - Consent generation and automated verification for `GSTIN`, `PAN`, and `AADHAAR`.
6. **WhatsApp Conversational Intake & Inbound Webhooks (`/integrations/whatsapp`)**:
   - Inbound webhook capturing conversation messages and automatically creating CRM leads.
7. **CRM Leads & GrowAI Lead Enrichment (`/crm/leads`, `/growai`)**:
   - Rules-based parser extracting customer details, urgency, and purchase intent.
   - GrowAI intelligent lead scoring and automated sales insights.
8. **Universal Data Migration Engine (`/migration`)**:
   - Multi-format legacy file ingestion for Indian MSMEs: Excel (`.xlsx`, `.xls`) and Tally ERP 9 / Tally Prime XML (`.xml`).
   - Normalizes data into typed records ready for system sync.

---

### Seed Accounts (`npx prisma db seed`)

All seeded demo accounts share the password: `TestPassword123`

- **Owner**: `taksh.demo@grownova.in`
- **Accountant**: `accountant@grownova.local`
- **Operations**: `ops@grownova.local`
- **Employee**: `test@grownova.local`

---

### Shared API Contracts (Zod)

Shared request/response contracts reside in `src/common/contracts` and `src/migration/contracts`:

- `src/common/contracts/auth/auth.contract.ts` — `SignupRequest`, `SignupResponse`, `LoginRequest`, `LoginResponse`
- `src/common/contracts/business.contract.ts` — `CreateBusinessRequest`, `CreateBusinessResponse`, `UpdateBusinessRequest`
- `src/common/contracts/onboarding.contract.ts` — `OnboardingRequest`, `OnboardingResponse`, `WhatsAppIntakeRequest`, `INDUSTRY_UI_PRESET`
- `src/common/contracts/digilocker.contract.ts` — `DigilockerConsentRequest`, `DigilockerConsentResponse`, `DigilockerKycRequest`, `DigilockerKycResponse`
- `src/migration/contracts/migration.contract.ts` — `MigrationSource`, `NormalizedMigrationRecord`, `NormalizedMigrationResult`

---

## 📂 Project Structure

```text
Grownova-0.1/
├── run.bat                          # ⚡ 1-Click Windows Launcher (Frontend + Browser)
├── run.sh                           # ⚡ 1-Click Mac/Linux Launcher
├── README.md                        # 📖 Complete Project Documentation
├── package.json                     # Backend configuration (NestJS)
├── nest-cli.json                    # NestJS CLI configuration
├── prisma7.config.ts                # Prisma 7 CLI configuration
├── prisma/                          # Database schema, seed script & SQL migrations
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── test-data/                       # Sample test datasets (Excel & Tally XML)
│   ├── products.xlsx
│   ├── tally-sample.xml
│   └── invalid.txt
├── src/                             # Backend source code (NestJS)
│   ├── main.ts                      # Application bootstrap & Swagger setup
│   ├── app.module.ts                # Root application module
│   ├── config/                      # Typed environment configuration
│   ├── common/                      # Shared Zod contracts, filters & interceptors
│   ├── health/                      # GET /health system liveness module
│   ├── prisma/                      # PrismaService (PostgreSQL adapter)
│   ├── redis/                       # RedisService (ioredis client)
│   ├── auth/                        # JWT authentication & RolesGuard
│   ├── businesses/                  # Multi-tenant business management
│   ├── audit/                       # SHA-256 hash-chained audit logging
│   ├── onboarding/                  # Owner onboarding & UI presets
│   ├── integrations/                # DigiLocker KYC & WhatsApp intake/webhook
│   ├── crm/                         # CRM leads, parsing & scoring
│   ├── growai/                      # AI rules & enrichment engine
│   └── migration/                   # Excel & Tally XML migration parsers
│
└── frontend/                        # Frontend React Application (Vite + Tailwind)
    ├── package.json                 # Frontend dependencies & scripts
    ├── vite.config.ts               # Vite configuration
    ├── index.html                   # HTML entry point with Google Fonts
    ├── public/                      # Static assets & photography
    │   ├── hero-bg.jpg              # Cinematic sunlit Indian heritage desk scene
    │   ├── ravi_avatar_hq.jpg       # High-resolution executive portrait
    │   └── reference.jpg            # Original visual source of truth
    └── src/
        ├── App.tsx                  # Client-side router (/ and /auth)
        ├── pages/
        │   ├── LandingPage.tsx      # Main landing experience
        │   └── AuthPage.tsx         # Dedicated /auth authentication route
        └── components/
            ├── VisionDashboard.tsx  # 100% Vector visionOS Liquid Glass Dashboard
            ├── HeroLeft.tsx         # Aligned marketing copy & CTAs
            ├── GrowNovaLogo.tsx     # Official vector GrowNova brand logo
            ├── ReferenceCompare.tsx # QA reference comparison slider
            ├── navigation/
            │   └── LandingNav.tsx   # Top navigation bar
            └── auth/
                ├── AuthShell.tsx        # Dual liquid glass slab container
                ├── AuthTabs.tsx         # Sign In / Sign Up tab switcher
                ├── AuthForm.tsx         # Interactive login & registration forms
                ├── SocialLogin.tsx      # Google & Microsoft SSO tiles
                └── GrowNovaPreview.tsx  # Vector miniature preview tablet
```

---

## 🛠️ Technology Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 (TypeScript) | Reactive, component-driven user interface |
| **Build & Dev Tooling**| Vite 8 | Instant Hot Module Replacement (HMR) & rapid bundling |
| **Styling & CSS** | Tailwind CSS + Custom CSS | Glassmorphism tokens, backdrop filters, custom animations |
| **Iconography** | Lucide React | Clean, scalable vector SVG icons |
| **Typography** | Playfair Display & Plus Jakarta Sans | High-contrast luxury editorial serif + clean modern sans-serif |
| **Routing** | React Router v7 | Seamless client-side route navigation (`/` and `/auth`) |
| **Backend Framework** | NestJS 11 + Express | Enterprise-grade modular TypeScript API server |
| **Database & ORM** | PostgreSQL + Prisma 7 | Primary relational multi-tenant database |
| **Caching & Tokens** | Redis (ioredis) | Refresh token session store & rapid cache |
| **API Validation** | Zod + class-validator | Strict runtime payload and contract validation |
| **Audit Ledger** | SHA-256 Cryptographic Chain | Tamper-evident ledger of all business mutations |

---

## ❓ FAQ & Troubleshooting for Non-Tech Users

<details>
<summary><b>1. How do I stop the app when I'm done?</b></summary>
<br />
Click into the command prompt or terminal window where GrowNova is running and press <b>Ctrl + C</b> on your keyboard. Type <code>y</code> if asked to terminate the batch job.
</details>

<details>
<summary><b>2. It says "Node.js is not recognized" when I double-click run.bat</b></summary>
<br />
This means Node.js is not yet installed on your computer. Download the free, official installer from <a href="https://nodejs.org/">nodejs.org</a> (choose the LTS version). Run the installer, accept default settings, and double-click <code>run.bat</code> again.
</details>

<details>
<summary><b>3. The browser didn't open automatically</b></summary>
<br />
Simply open Google Chrome, Safari, Edge, or Firefox and manually type or click: <a href="http://localhost:5173">http://localhost:5173</a>.
</details>

<details>
<summary><b>4. How do I get the latest updates from GitHub?</b></summary>
<br />
Open terminal in the project folder and run:
<pre><code>git checkout devansh
git pull origin devansh</code></pre>
Then run <code>run.bat</code> or <code>npm run dev</code> (inside the <code>frontend</code> folder).
</details>

<br />

---

<div align="center">

<b>GrowNova Business Operating System</b> • Built with precision for Indian enterprises.

<br />

<sub>© 2026 GrowNova Inc. All rights reserved.</sub>

</div>
