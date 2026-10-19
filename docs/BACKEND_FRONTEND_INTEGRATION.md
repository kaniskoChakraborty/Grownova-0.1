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
