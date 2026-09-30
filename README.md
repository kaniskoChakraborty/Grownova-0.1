# GrowNova Backend

Backend API for **GrowNova OS**, an AI-first, vernacular, one-tap business OS for Indian MSMEs.

Built with **NestJS 11**, **TypeScript 5**, **Prisma 7** (PostgreSQL), **Redis**, and **JWT** authentication.

---

## Current Phase

**Current Phase: Phase 7 — Data Migration (completed)**

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

> [!NOTE]
> Future phases will expand domain logic (CRM, Inventory, POS, Accounting, GST, HR, Payroll, etc.) and connect external production APIs (live DigiLocker, WhatsApp Business API, GSTN, UPI, ONDC) according to the GrowNova Product Requirements.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | NestJS 11 (Express) | Modular backend architecture |
| **Language** | TypeScript 5 | Type-safe enterprise development |
| **Database & ORM** | PostgreSQL via Prisma 7 (`@prisma/adapter-pg`) | Primary relational data store |
| **Cache & Sessions** | Redis via `ioredis` | Refresh token store & fast caching |
| **Auth & Security** | Passport JWT, `bcrypt`, custom `@Roles()` decorator & `RolesGuard` | Dual-token authentication & tenant RBAC |
| **Audit Ledger** | SHA-256 Cryptographic Hash Chaining | Tamper-evident, immutable audit trail for tenant actions |
| **Rate Limiting** | `@nestjs/throttler` (`ThrottlerGuard`) | API flood protection (default 60 req/min) |
| **Data Migration** | `xlsx`, `fast-xml-parser`, `multer` | Multi-format ingestion of legacy Excel & Tally ERP data |
| **Validation** | `class-validator`, `class-transformer` | Global request payload validation |
| **API Contracts** | Zod schemas in `src/common/contracts` | Shared contract definitions between frontend & backend |
| **API Documentation** | Swagger (`@nestjs/swagger`) | Interactive OpenAPI docs with JWT & file upload support |

---

## Prerequisites

- **Node.js**: `v20+` or `v22+` (LTS recommended)
- **npm**: `v10+`
- **PostgreSQL**: a reachable database instance (local, Docker, or managed)
- **Redis**: a running instance (default `127.0.0.1:6379`)

### Quick Start with Docker

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

---

## Installation

```bash
npm install
```

---

## Environment Setup

Copy `.env.example` to `.env` and configure your credentials:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Application environment (`development`, `production`, `test`) | `development` |
| `PORT` | HTTP port for the API server | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | — (required) |
| `REDIS_HOST` | Redis host | `127.0.0.1` |
| `REDIS_PORT` | Redis port | `6379` |
| `JWT_ACCESS_SECRET` | Secret used to sign/verify access tokens | dev fallback (set this!) |
| `JWT_ACCESS_EXPIRES_IN` | Access token lifetime | `15m` |
| `JWT_REFRESH_SECRET` | Secret used to sign/verify refresh tokens | dev fallback (set this!) |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime | `7d` |

Example `.env`:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/grownova?schema=public"
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
JWT_ACCESS_SECRET=your-secure-access-secret-key-min-32-chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-secure-refresh-secret-key-min-32-chars
JWT_REFRESH_EXPIRES_IN=7d
```

> [!IMPORTANT]
> Always set `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` explicitly in staging and production. Never commit `.env` files to git.

---

## Database Setup & Migrations

Prisma is configured via `prisma7.config.ts`, which reads `DATABASE_URL` from `.env`. The generated Prisma client resides in `generated/prisma` (git-ignored).

```bash
# 1. Generate the Prisma client
npx prisma generate

# 2. Apply database migrations
npx prisma migrate dev          # Development
npx prisma migrate deploy       # Production / CI

# 3. Seed demo data (Business, all 4 user roles, modules, initial audit logs)
npx prisma db seed

# 4. (Optional) Open Prisma Studio UI to inspect tables
npx prisma studio
```

### Data Model

| Model | Purpose |
|-------|---------|
| `Business` | Tenant (MSME) — name, industry, contact phone, email, address, city, state, country (default `India`), `isActive` status flag |
| `User` | Belongs to a tenant business; unique email, bcrypt-hashed password, role (`UserRole`), `isActive` status flag |
| `Module` | Per-business enabled feature toggle flags, unique on `(businessId, key)` |
| `AuditLog` | Cryptographic SHA-256 chained audit records — tracks tenant action, actor, entity, entity ID, request metadata, IP, user-agent, `previousHash`, and `hash` |

#### User Roles (`UserRole` Enum)

- `OWNER` — Full administrative control over the MSME tenant and onboarding
- `ACCOUNTANT` — Access to accounting, invoices, tax, and GST reporting
- `OPS` — Operations, warehouse, inventory, and order fulfillment
- `EMPLOYEE` — Default user role for standard POS, retail billing, and basic tasks

#### Seed Accounts (`npx prisma db seed`)

All seeded demo accounts share the password: `TestPassword123`

- **Owner**: `taksh.demo@grownova.in`
- **Accountant**: `accountant@grownova.local`
- **Operations**: `ops@grownova.local`
- **Employee**: `test@grownova.local`

---

## Running the App

```bash
# Development mode with hot-reload
npm run start:dev

# Standard run
npm run start

# Debug mode
npm run start:debug

# Production build and run
npm run build
npm run start:prod
```

---

## API Documentation

Interactive Swagger OpenAPI docs (with Bearer authentication and binary file upload support) are available at:

```
http://localhost:3000/docs
```

---

## API Endpoints

All requests are validated by a global `ValidationPipe` (`whitelist`, `transform`, `forbidNonWhitelisted`). Rate limiting is enforced globally at **60 requests per minute** per IP via `ThrottlerGuard`.

### 1. Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/health` | None | API liveness & health check |

```bash
curl -i http://localhost:3000/health
# {"status":"ok","service":"grownova-api"}
```

---

### 2. Authentication (`/auth`)

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| `POST` | `/auth/signup` | None | — | Register a user under an existing business |
| `POST` | `/auth/login` | None | — | Authenticate with email/password; returns access token & refresh token |
| `POST` | `/auth/refresh` | None | — | Exchange a valid refresh token for a new access token |
| `POST` | `/auth/logout` | Bearer JWT | Any | Invalidate the refresh token in Redis |
| `GET` | `/auth/me` | Bearer JWT | Any | Fetch profile of currently authenticated user |
| `GET` | `/auth/rbac-owner-test` | Bearer JWT | `OWNER` | Verify role-based access control guard |

#### Sign Up

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "StrongPassword123",
    "name": "Taksh",
    "businessId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

#### Log In

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "taksh.demo@grownova.in",
    "password": "TestPassword123"
  }'
```

Response:

```json
{
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi...",
  "user": {
    "id": "...",
    "email": "taksh.demo@grownova.in",
    "name": "Taksh Demo",
    "role": "OWNER",
    "businessId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

#### Refresh Access Token

```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refresh-jwt>"}'
# {"accessToken":"<new-jwt>"}
```

#### Log Out

```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer <jwt>"
# {"message":"Logged out successfully"}
```

---

### 3. Businesses (`/businesses`)

All business endpoints require a Bearer JWT and enforce strict multi-tenant isolation: requests can only view or modify the business matching the caller's JWT `businessId`. Any cross-tenant access returns `404 Not Found`.

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| `POST` | `/businesses` | Bearer JWT | Any | Create a new business profile |
| `GET` | `/businesses` | Bearer JWT | Any | List business profile for the caller's tenant |
| `GET` | `/businesses/:id` | Bearer JWT | Any | Get tenant business details by ID |
| `PATCH` | `/businesses/:id` | Bearer JWT | Any | Partially update tenant business details |
| `PATCH` | `/businesses/:id/deactivate` | Bearer JWT | Any | Soft-deactivate the business (`isActive = false`) |
| `DELETE` | `/businesses/:id` | Bearer JWT | Any | Permanently delete the tenant business |

```bash
curl -X PATCH http://localhost:3000/businesses/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{"phone":"+91-9876543210","city":"Surat","state":"Gujarat"}'
```

---

### 4. Audit & Reliability (`/audit`)

Phase 5 introduced an immutable, tamper-evident audit ledger using SHA-256 hash chaining. Write operations (`POST`, `PATCH`, `DELETE`) on tenant resources are automatically intercepted by `AuditInterceptor`.

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| `POST` | `/audit/test` | Bearer JWT | Any | Append a manual test audit record for the tenant |
| `GET` | `/audit/integrity` | Bearer JWT | Any | Cryptographically verify the SHA-256 hash chain |

#### Hash Chain Verification

Each log entry hashes its own payload together with the `previousHash` from the prior record. If any past database record is modified, inserted, or deleted, the hash sequence breaks:

```bash
curl http://localhost:3000/audit/integrity \
  -H "Authorization: Bearer <jwt>"
```

Response (Valid chain):

```json
{
  "valid": true,
  "checked": 12,
  "brokenAt": null,
  "reason": null
}
```

Response (Tampered database record detected):

```json
{
  "valid": false,
  "checked": 12,
  "brokenAt": "e0b96879-...",
  "reason": "Hash mismatch"
}
```

#### Global Error Envelope (`HttpExceptionFilter`)

Uncaught exceptions or validation errors are formatted uniformly:

```json
{
  "success": false,
  "error": {
    "statusCode": 400,
    "message": ["industry must be one of the following values: retail, manufacturing, services, food_beverage, wholesale, other"],
    "error": "Bad Request"
  },
  "timestamp": "2026-10-01T02:30:00.000Z",
  "path": "/onboarding"
}
```

---

### 5. Onboarding (`/onboarding`)

Phase 6 introduced the owner-guided onboarding flow. When an MSME owner completes profile setup, the system automatically computes and assigns the appropriate industry-specific UI preset:

| Industry | Assigned UI Preset |
|----------|-------------------|
| `retail`, `wholesale`, `food_beverage` | `retail` |
| `manufacturing` | `manufacturing` |
| `services` | `services` |
| `other` | `general` |

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| `POST` | `/onboarding` | Bearer JWT | `OWNER` | Complete onboarding & configure tenant UI preset |

```bash
curl -X POST http://localhost:3000/onboarding \
  -H "Authorization: Bearer <owner-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Shree Ganesh Textiles",
    "industry": "retail",
    "phone": "+91-9876543210",
    "email": "ganesh@textiles.in",
    "address": "Ring Road Market",
    "city": "Surat",
    "state": "Gujarat",
    "country": "India"
  }'
```

Response:

```json
{
  "onboardingCompleted": true,
  "channel": "web",
  "uiPreset": "retail",
  "business": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Shree Ganesh Textiles",
    "industry": "retail",
    "phone": "+91-9876543210",
    "email": "ganesh@textiles.in",
    "address": "Ring Road Market",
    "city": "Surat",
    "state": "Gujarat",
    "country": "India"
  }
}
```

---

### 6. Integrations (`/integrations`)

#### DigiLocker KYC & Consent (`/integrations/digilocker`)

Provides mock consent and verification flows for Indian identity documents (`AADHAAR`, `PAN`, `GSTIN`).

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| `POST` | `/integrations/digilocker/consent` | Bearer JWT | `OWNER` | Generate a mock DigiLocker consent ticket |
| `POST` | `/integrations/digilocker/kyc` | Bearer JWT | `OWNER` | Verify consent ID and retrieve verified KYC profile |

**Request Consent**:

```bash
curl -X POST http://localhost:3000/integrations/digilocker/consent \
  -H "Authorization: Bearer <owner-jwt>" \
  -H "Content-Type: application/json" \
  -d '{"documentType":"GSTIN"}'
```

Response:

```json
{
  "consentId": "a910f9bd-3f3c-4cf2-831e-4581f21db597",
  "status": "GRANTED",
  "documentType": "GSTIN",
  "provider": "digilocker-mock",
  "expiresAt": "2026-10-01T03:30:00.000Z"
}
```

**Verify KYC**:

```bash
curl -X POST http://localhost:3000/integrations/digilocker/kyc \
  -H "Authorization: Bearer <owner-jwt>" \
  -H "Content-Type: application/json" \
  -d '{"consentId":"a910f9bd-3f3c-4cf2-831e-4581f21db597"}'
```

Response:

```json
{
  "consentId": "a910f9bd-3f3c-4cf2-831e-4581f21db597",
  "verified": true,
  "documentType": "GSTIN",
  "maskedDocumentNumber": "27AAAAA0000A1Z5",
  "kyc": {
    "name": "Verified MSME Business",
    "address": "Verified Business Address, India",
    "pan": "ABCDE1234F"
  },
  "provider": "digilocker-mock",
  "verifiedAt": "2026-10-01T02:30:00.000Z"
}
```

#### WhatsApp Conversational Intake (`/integrations/whatsapp`)

Captures incoming MSME business leads and conversational onboarding details through WhatsApp.

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| `POST` | `/integrations/whatsapp/intake` | Bearer JWT | `OWNER` | Intake and map incoming WhatsApp business details |

```bash
curl -X POST http://localhost:3000/integrations/whatsapp/intake \
  -H "Authorization: Bearer <owner-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+919876543210",
    "businessName": "Balaji Electronics",
    "senderName": "Ramesh Patel",
    "industry": "retail",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "message": "Interested in setting up POS and inventory sync"
  }'
```

---

### 7. Data Migration Engine (`/migration`)

Phase 7 delivered a universal legacy migration engine tailored for Indian MSMEs transitioning from spreadsheets or desktop accounting software (Tally ERP 9 / Tally Prime) to GrowNova OS.

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| `POST` | `/migration/upload` | Bearer JWT | Any | Upload `.xlsx`, `.xls`, or `.xml` file to parse into normalized records |

#### Supported Formats & Parsers

1. **Excel Spreadsheets (`.xlsx`, `.xls`)**:
   - Parses multi-sheet workbooks using `xlsx`
   - Maps each sheet to an entity category (e.g. Products, Customers, Vendors)
   - Preserves typed rows, column keys, and empty cell defaults
2. **Tally XML Exports (`.xml`)**:
   - Parses complex, nested Tally XML hierarchies using `fast-xml-parser`
   - Flattens master records, ledgers, vouchers, and inventory items into normalized entity dictionaries
   - Handles XML attributes, numeric conversion, and whitespace trimming

#### Sample Upload Request

```bash
curl -X POST http://localhost:3000/migration/upload \
  -H "Authorization: Bearer <jwt>" \
  -F "file=@test-data/products.xlsx"
```

Response:

```json
{
  "source": "excel",
  "totalRecords": 25,
  "records": [
    {
      "source": "excel",
      "entity": "Sheet1",
      "data": {
        "Product Name": "Cotton Kurti Blue",
        "SKU": "CK-BLU-M",
        "Price": 899,
        "Stock": 45,
        "GST Rate": "5%"
      }
    }
  ]
}
```

Tally XML Upload:

```bash
curl -X POST http://localhost:3000/migration/upload \
  -H "Authorization: Bearer <jwt>" \
  -F "file=@test-data/tally-sample.xml"
```

Response:

```json
{
  "source": "tally_xml",
  "totalRecords": 3,
  "records": [
    {
      "source": "tally_xml",
      "entity": "LEDGER",
      "data": {
        "NAME": "Cash Account",
        "PARENT": "Cash-in-Hand",
        "OPENINGBALANCE": 15000
      }
    }
  ]
}
```

Ready-to-use sample files are available under `test-data/`:
- `test-data/products.xlsx` — Multi-row product catalog
- `test-data/tally-sample.xml` — Tally ERP XML master export
- `test-data/invalid.txt` — Negative test fixture for file type validation

---

## API Contracts (Zod)

Shared request/response contracts reside in `src/common/contracts` and `src/migration/contracts`. They export Zod schemas and inferred TypeScript types:

- `src/common/contracts/auth/auth.contract.ts` — `SignupRequest`, `SignupResponse`, `LoginRequest`, `LoginResponse`
- `src/common/contracts/business.contract.ts` — `CreateBusinessRequest`, `CreateBusinessResponse`, `UpdateBusinessRequest`
- `src/common/contracts/onboarding.contract.ts` — `OnboardingRequest`, `OnboardingResponse`, `WhatsAppIntakeRequest`, `INDUSTRY_UI_PRESET`
- `src/common/contracts/digilocker.contract.ts` — `DigilockerConsentRequest`, `DigilockerConsentResponse`, `DigilockerKycRequest`, `DigilockerKycResponse`
- `src/migration/contracts/migration.contract.ts` — `MigrationSource`, `NormalizedMigrationRecord`, `NormalizedMigrationResult`

---

## Project Structure

```
backend/
├── .env.example
├── nest-cli.json
├── package.json
├── prisma7.config.ts                  # Prisma CLI config (migrations, seed config, DATABASE_URL)
├── prisma/
│   ├── schema.prisma                  # Business, User, Module, AuditLog models + UserRole enum
│   ├── seed.ts                        # Database seeding script (demo business, users, roles)
│   └── migrations/
├── generated/prisma/                  # Generated Prisma client (git-ignored)
├── test-data/                         # Sample datasets for migration testing
│   ├── products.xlsx                  # Sample Excel inventory file
│   ├── tally-sample.xml               # Sample Tally XML export
│   └── invalid.txt                    # Invalid file test fixture
└── src/
    ├── main.ts                        # Application bootstrap, Swagger, global pipes & filters
    ├── app.module.ts                  # Root application module with Throttler & Interceptors
    ├── config/
    │   └── configuration.ts           # Typed environment configuration
    ├── common/
    │   ├── contracts/                 # Shared Zod API contracts
    │   ├── filters/
    │   │   └── http-exception.filter.ts # Unified global error response filter
    │   └── interceptors/
    │       └── api-response.interceptor.ts # API response envelope interceptor
    ├── health/                        # GET /health liveness check
    ├── prisma/                        # PrismaService (PostgreSQL adapter)
    ├── redis/                         # RedisService (ioredis client)
    ├── auth/                          # Signup, login, refresh, logout, JWT strategy & RolesGuard
    ├── businesses/                    # Tenant-scoped business CRUD & deactivation
    ├── audit/                         # SHA-256 hash-chained audit logging & integrity verification
    ├── onboarding/                    # Owner onboarding & industry UI preset assignment
    ├── integrations/                  # External service adapters & intake
    │   ├── digilocker/                # DigiLocker consent & mock KYC verification
    │   └── whatsapp/                  # WhatsApp conversational intake & messaging
    ├── migration/                     # Data migration engine (Excel & Tally XML parsers)
    │   ├── contracts/                 # Migration contract types
    │   └── parsers/                   # ExcelParser & TallyParser implementations
    ├── users/                         # User management (skeleton)
    ├── crm/  inventory/  pos/         # MSME domain modules (skeletons)
    ├── accounting/  gst/
    ├── hr/  payroll/  production/
    ├── marketing/  support/
    ├── dashboard/  collaboration/  growai/
    ├── notifications/  jobs/
    └── integerations/                 # Secondary third-party adapter stubs (UPI, GSTN, ONDC, Tally)
```

---

## Roadmap

- [x] **Phase 0**: NestJS foundation & health endpoint
- [x] **Phase 1**: Prisma 7, PostgreSQL, Redis, initial migrations
- [x] **Phase 2**: Zod API contracts, global validation, JWT auth, business API
- [x] **Phase 3**: Redis-backed refresh token rotation & session revocation
- [x] **Phase 4**: Role-Based Access Control (`OWNER`, `ACCOUNTANT`, `OPS`, `EMPLOYEE`) & multi-tenancy
- [x] **Phase 5**: Cryptographic SHA-256 audit ledger, tamper verification, rate limiting, DB seeding
- [x] **Phase 6**: MSME onboarding flow, DigiLocker KYC mock adapter, WhatsApp intake
- [x] **Phase 7**: Legacy data migration engine for Excel (`.xlsx`) and Tally XML (`.xml`)
- [ ] **Phase 8**: Next.js 15 Web Frontend integration with dynamic UI presets (`retail`, `manufacturing`, `services`)
- [ ] **Phase 9**: Full domain module logic (Inventory catalog sync, POS billing, GST invoicing)
- [ ] **Phase 10**: Live third-party integrations (Official WhatsApp Business API, Sandbox GSTN e-Invoice/e-Way, Sandbox ONDC Beckn protocol)
