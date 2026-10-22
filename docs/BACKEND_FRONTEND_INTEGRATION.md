# GrowNova OS — Backend & Frontend Integration Audit

This document provides a comprehensive audit of backend APIs, frontend data contracts, authentication integration, and role permissions for GrowNova OS.

---

## 1. System Architecture Overview

GrowNova OS is designed as an AI-first Business Operating System for Indian MSMEs:
- **Backend**: NestJS 11 + TypeScript + Prisma ORM + PostgreSQL + Redis (running on port 3000, Swagger at `/docs`).
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS (running on port 5173).
- **Canonical Design System**: Warm Ivory (`#F8F5F1`), Deep Navy (`#102B4E`, `#0B2340`), Muted Gold (`#C69A43`), Floating White Glass (`rgba(255, 255, 255, 0.78)`), Editorial Serif headings (`Playfair Display` / `Instrument Serif`).

---

## 2. API Endpoints Status & Verification Matrix

| Endpoint | Method | Backend Status | Auth Required | Frontend Integration | Notes |
|---|---|---|---|---|---|
| `/health` | GET | **Implemented** | No | Live verified | Returns `{ status: 'ok', service: 'grownova-api' }`. Used by `SystemStatus` indicator. |
| `/auth/signup` | POST | **Implemented** | No | Ready / Connected | Validates `SignupDto` with business name, owner email, password. |
| `/auth/login` | POST | **Implemented** | No | Ready / Connected | Validates `LoginDto` (`email`, `password`), returns JWT `accessToken`, `refreshToken`. |
| `/auth/refresh` | POST | **Implemented** | No | Ready | Generates new session token using refresh token. |
| `/auth/logout` | POST | **Implemented** | Yes (`JwtAuthGuard`) | Connected | Revokes active session. |
| `/auth/me` | GET | **Implemented** | Yes (`JwtAuthGuard`) | Connected | Returns current user profile, role, and business ID. |
| `/auth/rbac-owner-test` | GET | **Implemented** | Yes (`Roles(OWNER)`) | Ready | RBAC verification endpoint for Owner role. |
| `/leads` | GET / POST | **Implemented** | Yes | Connected in CRM | CRUD operations for CRM leads via `LeadsController`. |
| `/dashboard/summary` | GET | **Stub / Not Implemented** | Planned | Demo Mode / Seeded | Backend `dashboard.module.ts` is currently an empty module stub. Frontend displays clearly marked demo telemetry. |
| `/inventory/*` | ANY | **Stub / Not Implemented** | Planned | Demo Mode / Placeholder | Backend `inventory.module.ts` is a stub. |
| `/accounting/*` | ANY | **Stub / Not Implemented** | Planned | Demo Mode / Placeholder | Backend `accounting.module.ts` is a stub. |
| `/hr/*` | ANY | **Stub / Not Implemented** | Planned | Demo Mode / Placeholder | Backend `hr.module.ts` is a stub. |
| `/calendar/events` | GET | **Not Implemented** | Planned | Interactive Local Demo | Dynamic client-side calendar calculations with realistic MSME agenda. |

---

## 3. Comprehensive Route Inventory

| Route | View Component | Status | Data Mode |
|---|---|---|---|
| `/` | `LandingPage` | **Active / Canonical** | Static & Marketing Content |
| `/product` | `ProductPage` | **Active / Canonical** | Interactive OS layers & Axiom chat demo |
| `/solutions` | `SolutionsPage` | **Active / Canonical** | Persona use cases (Owner, Manager, Staff) |
| `/resources` | `ResourcesPage` | **Active / Canonical** | Guides, Academy & Market intelligence |
| `/pricing` | `PricingPage` | **Active / Canonical** | Dedicated "Coming Soon" with early-access modal |
| `/auth` | `AuthPage` | **Active / Canonical** | Live REST `/auth/*` + 1-Click Role Personas |
| `/auth/forgot-password` | `ForgotPasswordPage` | **Active / Canonical** | Password reset recovery flow |
| `/dashboard` | `DashboardPage` (Owner) | **Active / Canonical** | Canonical 3-panel layout (`dashboard-reference.png`) |
| `/dashboard/manager` | `ManagerDashboardPage` | **Active / Canonical** | Team operations, sprints & shift oversight |
| `/dashboard/employee` | `EmployeeDashboardPage` | **Active / Canonical** | Personal agenda, timesheets & assigned tickets |
| `/dashboard/crm` | `CrmModuleView` | **Active / Canonical** | Live `/leads` integration + WhatsApp simulation |
| `/dashboard/accounting` | `AccountingModuleView` | **Active / Canonical** | Double-entry ledger, Tally XML import & GSTR-1 |
| `/dashboard/inventory` | `InventoryModuleView` | **Active / Canonical** | Multi-godown stock, reorder levels & HSN lookup |
| `/dashboard/hr` | `HrModuleView` | **Active / Canonical** | Attendance register, salary disbursements & leaves |
| `/dashboard/reports` | `ReportsModuleView` | **Active / Canonical** | Cryptographic audit trail & compliance verifier |
| `/dashboard/calendar` | `CalendarModuleView` | **Active / Canonical** | Interactive month grid, daily agenda & scheduler |
| `/dashboard/people` | `PeopleModuleView` | **Active / Canonical** | Organization directory & RBAC access matrix |
| `/dashboard/projects` | `ProjectsModuleView` | **Active / Canonical** | Production orders, batch stages & milestones |
| `/dashboard/documents` | `DocumentsModuleView` | **Active / Canonical** | GST certificates, MSME Udyam & bank mandates |
| `/dashboard/compliance`| `ComplianceModuleView` | **Active / Canonical** | Indian statutory deadlines, GSTR-3B & TDS status |
| `/dashboard/settings` | `SettingsModuleView` | **Active / Canonical** | Legal entity name, GSTIN, PAN & WhatsApp gateway |

---

## 4. Authentication & Role-Based Access Control (RBAC)

Prisma schema defines 4 primary user roles:
```prisma
enum UserRole {
  OWNER
  ACCOUNTANT
  OPS       // Mapped to Manager in GrowNova OS
  EMPLOYEE
}
```

### Role Mapping in GrowNova OS:
1. **Business Owner (`OWNER`)**:
   - Access: Complete operational & financial overview (`/dashboard`).
   - KPIs: B2B Turnover, Working Capital Runway, Team Tasks Done, Executive Agenda.
   - Modules: All 10 workspace apps (People, Projects, Finance, Sales & CRM, Inventory, HR & Payroll, Documents, Reports, Compliance, Settings).
2. **Manager (`OPS`)**:
   - Access: Team operations, sprint management, approvals (`/dashboard/manager`).
   - KPIs: Active Members, Team Tasks Done, Pending Approvals, Sprints Active.
   - Restricted: High-level proprietary financial ledgers unless explicitly delegated.
3. **Employee (`EMPLOYEE`)**:
   - Access: Personal day planner, assigned work, attendance, meetings (`/dashboard/employee`).
   - KPIs: My Tasks, Hours Logged, Leave Balance, Upcoming Meetings.

### Demo Mode Protocol:
When operating in Demo Mode or when the backend database is unreachable, GrowNova OS provides explicit 1-click personas with clear `DEMO MODE` badge attribution. Mock data is isolated in separate state containers and is never misrepresented as persisted live production data.

---

## 5. Design System Tokens Lock

| Token Name | Hex / RGBA Value | Usage |
|---|---|---|
| `bg-ivory` | `#F8F5F1` | Primary canvas background |
| `primary-navy` | `#102B4E` | Main branding, primary text, dark buttons |
| `deep-navy` | `#0B2340` | Heading titles, selected date indicators |
| `muted-gold` | `#C69A43` | Accent lines (`—`), gold buttons, active highlights |
| `warm-gold` | `#D5AD66` | Secondary accent highlights, subtle glows |
| `glass-surface` | `rgba(255, 255, 255, 0.78)` | Floating panels, search bar, app tiles |
| `glass-border` | `rgba(255, 255, 255, 0.92)` | Border highlights for visionOS floating panels |
| `text-secondary` | `#65758B` | Labels, time slots, subtitles, secondary metadata |
| `positive-green` | `#15803D` | Positive trends (`↑ 18%`), System Online indicator |
| `negative-red` | `#DC2626` | Negative trends (`↓ 6%`), critical alerts |

---

## 6. Batch 2: API Integration & Local Development Infrastructure

### 6.1 Local Development Infrastructure Setup
- **Docker Compose File**: `docker-compose.yml` provides containerized services for:
  - **PostgreSQL 16**: Port `5432`, named volume `postgres_data` (persistent), healthcheck `pg_isready -U postgres -d grownova`, loads environment from `.env`.
  - **Redis 7**: Port `6379`, named volume `redis_data` (persistent), healthcheck `redis-cli ping`, loads environment from `.env`.
- **Infrastructure Management Commands**:
  - `npm run docker:up` -> `docker compose up -d` (starts PostgreSQL & Redis in background)
  - `npm run docker:down` -> `docker compose down` (safely stops services preserving all volume data)
  - `npm run docker:logs` -> `docker compose logs -f` (tails container logs)
  - `npm run docker:reset` -> `docker compose down -v` (CAUTION: destroys persistent volumes; only for full factory reset)
  - `npm run db:migrate` -> `prisma migrate dev` (runs database migrations)
  - `npm run db:seed` -> `tsx prisma/seed.ts` (seeds canonical test businesses, accounts, and modules)
- **Local Host Docker Status & Blocker**:
  - Verification test `docker --version` and `wsl -l -v` confirmed Docker CLI is not installed / not on the host Windows `PATH`, and WSL is uninstalled.
  - Precise Blocker: Containers cannot be spawned until Docker Desktop for Windows (or an external PostgreSQL 16 & Redis 7 instance) is started on the developer host.
  - Architecture Integrity: Redis is strictly maintained as required in `redis.service.ts` and configuration; no artificial disabling was introduced.

### 6.2 Seeded Test Accounts (`prisma/seed.ts`)
| Account Email | Role | Password | Description |
|---|---|---|---|
| `taksh.demo@grownova.in` | `OWNER` | `TestPassword123` | Canonical Business Owner account (full permissions) |
| `accountant@grownova.local` | `ACCOUNTANT` | `TestPassword123` | Financial, taxation & general ledger access |
| `ops@grownova.local` | `OPS` | `TestPassword123` | Operations / Manager dashboard access |
| `test@grownova.local` | `EMPLOYEE` | `TestPassword123` | Employee task, timesheet & shift access |

### 6.3 API Calls Migrated to Shared `apiClient`
All direct backend calls are routed through `web/src/services/apiClient.ts` which proxies `/api/*` to the backend:
1. `EditorialMessages.tsx`: Replaced raw `fetch('/api/health')` with `apiClient.get('/health', { skipAuth: true })`.
2. `BackendFeaturesConsole.tsx`:
   - Tab 2 (Migration): Replaced mock simulation with real `apiClient.upload<NormalizedMigrationResult>('/migration/upload', formData)` supporting `.xml, .xlsx, .xls`.
   - Tab 3 (Audit Integrity): Verified `apiClient.get('/audit/integrity')` with localized retry and warning states.
   - Tab 4 (WhatsApp): Replaced static mock with real `apiClient.post('/integrations/whatsapp/webhook', ...)` intake caller.
3. `ReportsModuleView.tsx`:
   - `apiClient.get('/audit/integrity')` for cryptographic ledger verification with localized retry button.
   - `apiClient.post('/audit/test')` for generating new hashed ledger blocks with in-progress loading state.
4. `ExtendedModuleViews.tsx` (`DocumentsModuleView`):
   - `apiClient.post('/integrations/digilocker/consent', { documentType: 'AADHAAR' })` for national KYC consent.
   - `apiClient.post('/integrations/digilocker/kyc', { consentId })` for verifying and displaying masked credential proofs.
5. `AccountingModuleView.tsx`:
   - `apiClient.upload('/migration/upload', formData)` with localized file extension validation, loading spinner, and retry button.

### 6.4 Hardcoded URL Audit
- Codebase grep confirmed: **Zero hardcoded `http://localhost:3000` instances** in any frontend component or view.
- The only reference is in `web/vite.config.ts`, where `backendTarget = env.VITE_BACKEND_URL || 'http://localhost:3000'` serves as the default proxy forwarding target.

### 6.5 Module Error Handling Enhancements
- Localized error banners with actionable "Retry" buttons across all 4 modules.
- Non-crashing isolation: an unavailable backend displays clear, user-friendly service notices without unmounting the dashboard shell.
- Empty states implemented in tabular views (Audit Log, Accounting Vouchers) when search filters yield zero results.
- No false success states: errors from API calls are displayed cleanly without optimistic completion messages.
- Privacy & security: sensitive payloads and raw stack traces are stripped; friendly diagnostics are logged safely.

