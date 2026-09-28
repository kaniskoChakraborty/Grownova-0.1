# GrowNova Backend

Backend API for **GrowNova OS**, an AI-first, vernacular, one-tap business OS for Indian MSMEs.

Built with **NestJS 11**, **TypeScript**, **Prisma 7** (PostgreSQL), **Redis** and **JWT** authentication.

---

## Current Phase

**Current Phase: Phase 4 — RBAC & Multi-Tenancy (completed)**

| Phase | Scope | Status |
|-------|-------|--------|
| Phase 0 | NestJS foundation, env config, health endpoint | ✅ Done |
| Phase 1 | Prisma + PostgreSQL, Redis, initial migration, module skeletons | ✅ Done |
| Phase 2 | API contracts (Zod), request validation, JWT auth, businesses API | ✅ Done |
| Phase 3 | Refresh tokens (Redis-backed), logout | ✅ Done |
| Phase 4 | Role-based access control (`RolesGuard`), tenant-scoped business API, business update/deactivate/delete | ✅ Done |

> [!NOTE]
> Business domain modules (CRM, Inventory, POS, Accounting, GST, HR, Payroll, etc.) and third-party integrations (WhatsApp, UPI, GSTN, ONDC, Tally, DigiLocker, Translation) are registered as **empty module skeletons**. Their logic will be built in later phases according to the GrowNova PDR.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | NestJS 11 (Express) |
| Language | TypeScript 5 |
| Database | PostgreSQL via Prisma 7 (`@prisma/adapter-pg`) |
| Cache | Redis via `ioredis` |
| Auth | Passport JWT (access + refresh tokens), `bcrypt` password hashing, role-based guards |
| Validation | `class-validator` (global `ValidationPipe`) |
| API contracts | Zod schemas in `src/common/contracts` |
| API docs | Swagger (`@nestjs/swagger`) at `/docs` |

---

## Prerequisites

- **Node.js**: `v20+` or `v22+` (LTS recommended)
- **npm**: `v10+`
- **PostgreSQL**: a reachable database (local, Docker, or Prisma Postgres)
- **Redis**: a running instance (default `127.0.0.1:6379`)

Quick start for PostgreSQL and Redis with Docker:

```bash
docker run -d --name grownova-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=grownova -p 5432:5432 postgres:16
docker run -d --name grownova-redis -p 6379:6379 redis:7
```

---

## Installation

```bash
npm install
```

---

## Environment Setup

Copy the example environment file and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `development` |
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
JWT_ACCESS_SECRET=change-me
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=change-me-too
JWT_REFRESH_EXPIRES_IN=7d
```

> [!IMPORTANT]
> Always set `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` explicitly. Never commit `.env` files containing real credentials.

---

## Database Setup (Prisma)

Prisma is configured through `prisma7.config.ts`, which reads `DATABASE_URL` from `.env`. The Prisma client is generated into `generated/prisma` (git-ignored).

```bash
# Generate the Prisma client
npx prisma generate

# Apply migrations to your database
npx prisma migrate dev          # development
npx prisma migrate deploy       # production / CI

# Optional: browse data
npx prisma studio
```

> If the CLI does not pick up the config automatically, pass it explicitly: `npx prisma generate --config prisma7.config.ts`.

### Data Model

| Model | Purpose |
|-------|---------|
| `Business` | A tenant (MSME) — name, industry, contact, location, country (default `India`), `isActive` flag (default `true`) |
| `User` | Belongs to a business; unique email, bcrypt password hash, role, active flag |
| `Module` | Per-business feature toggle, unique on `(businessId, key)` |

`UserRole` enum: `OWNER`, `ACCOUNTANT`, `OPS`, `EMPLOYEE` (default).

---

## Running the App

```bash
npm run start:dev     # development with file watching
npm run start         # without watch mode
npm run start:debug   # debug + watch
```

Build and run in production:

```bash
npm run build         # compiles to dist/
npm run start:prod
```

On startup the app connects to PostgreSQL and pings Redis, so both must be reachable.

---

## API Documentation

Interactive Swagger docs (with Bearer auth support) are available at:

```
http://localhost:3000/docs
```

---

## API Endpoints

All request bodies are validated with a global `ValidationPipe` (`whitelist`, `transform`, `forbidNonWhitelisted`) — unknown fields are rejected with `400 Bad Request`.

### Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/health` | — | Liveness check |

```bash
curl -i http://localhost:3000/health
# {"status":"ok","service":"grownova-api"}
```

### Businesses

All business endpoints require a **Bearer JWT** and are **scoped to the caller's tenant**: a user can only see and modify the business matching the `businessId` in their token. Requests for any other business ID return `404 Not Found`.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/businesses` | Bearer JWT | Create a business |
| `GET` | `/businesses` | Bearer JWT | List businesses (returns only the caller's business) |
| `GET` | `/businesses/:id` | Bearer JWT | Get the caller's business by ID |
| `PATCH` | `/businesses/:id` | Bearer JWT | Update the caller's business (partial) |
| `PATCH` | `/businesses/:id/deactivate` | Bearer JWT | Soft-deactivate the caller's business (`isActive = false`) |
| `DELETE` | `/businesses/:id` | Bearer JWT | Permanently delete the caller's business |

```bash
curl -X POST http://localhost:3000/businesses \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Sharma Textiles","industry":"Textiles","city":"Surat","state":"Gujarat"}'
```

```bash
curl -X PATCH http://localhost:3000/businesses/<business-uuid> \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{"phone":"+91 98765 43210"}'
```

Fields: `name` (required on create), `industry`, `phone`, `email`, `address`, `city`, `state`, `country` (optional). All fields are optional on update.

> [!NOTE]
> Because `POST /businesses` now requires a JWT and signup requires an existing `businessId`, the first business and owner must currently be seeded directly in the database (e.g. via `npx prisma studio`). A public onboarding flow is planned.

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/auth/signup` | — | Register a user under an existing business |
| `POST` | `/auth/login` | — | Log in and receive an access token and a refresh token |
| `POST` | `/auth/refresh` | — | Exchange a valid refresh token for a new access token |
| `POST` | `/auth/logout` | Bearer JWT | Revoke the user's refresh token |
| `GET` | `/auth/me` | Bearer JWT | Return the authenticated user |
| `GET` | `/auth/rbac-owner-test` | Bearer JWT, role `OWNER` | Test endpoint to verify RBAC |

**Sign up** — `businessId` must be the UUID of an existing business; password must be at least 8 characters.

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@example.com","password":"password123","name":"Asha","businessId":"<business-uuid>"}'
```

**Log in**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@example.com","password":"password123"}'
```

```json
{
  "accessToken": "<jwt>",
  "refreshToken": "<refresh-jwt>",
  "user": {
    "id": "…",
    "email": "owner@example.com",
    "name": "Asha",
    "role": "EMPLOYEE",
    "businessId": "…"
  }
}
```

**Current user**

```bash
curl http://localhost:3000/auth/me -H "Authorization: Bearer <jwt>"
```

The JWT payload contains `sub` (user ID), `email`, `role` and `businessId`.

**Refresh access token**

```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refresh-jwt>"}'
# {"accessToken":"<new-jwt>"}
```

**Log out**

```bash
curl -X POST http://localhost:3000/auth/logout -H "Authorization: Bearer <jwt>"
# {"message":"Logged out successfully"}
```

#### Token lifecycle

- Access tokens are signed with `JWT_ACCESS_SECRET` and expire after `JWT_ACCESS_EXPIRES_IN` (default `15m`).
- Refresh tokens are signed with `JWT_REFRESH_SECRET` and expire after `JWT_REFRESH_EXPIRES_IN` (default `7d`).
- On login, the refresh token is stored in Redis under `refresh_token:<userId>`. Only the most recent token is valid, so logging in again invalidates the previous refresh token.
- `/auth/refresh` accepts a token only if it verifies **and** matches the one stored in Redis.
- `/auth/logout` deletes the stored refresh token. Already issued access tokens stay valid until they expire.

---

## Role-Based Access Control

Roles come from the `UserRole` enum (`OWNER`, `ACCOUNTANT`, `OPS`, `EMPLOYEE`) and are embedded in the JWT. To restrict a route, combine `JwtAuthGuard`, `RolesGuard` and the `@Roles()` decorator:

```ts
@Get('owner-only')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.OWNER)
ownerOnly(@Request() req) { ... }
```

- Routes without `@Roles()` allow any authenticated user.
- A user whose role is not listed gets `403 Forbidden` (`Insufficient permissions`).
- `GET /auth/rbac-owner-test` is a ready-made endpoint for checking that RBAC works.

> [!NOTE]
> New users sign up with the `EMPLOYEE` role by default. To test owner-only routes, update the user's role to `OWNER` in the database.

## Multi-Tenancy

Each `Business` is a tenant. Every authenticated request carries the user's `businessId` in the JWT, and services filter data by it. For businesses, the requested `:id` must equal the caller's `businessId`, otherwise the API returns `404 Not Found`. That way the response doesn't reveal whether another tenant exists.

---

## API Contracts

Shared request/response shapes live in `src/common/contracts` as **Zod** schemas with inferred TypeScript types, so the frontend and backend agree on payloads:

- `auth/auth.contract.ts` — `SignupRequest`, `SignupResponse`, `LoginRequest`, `LoginResponse`
- `business.contract.ts` — `CreateBusinessRequest`, `CreateBusinessResponse`, …

An `ApiResponseInterceptor` (`src/common/interceptors`) is available to wrap responses as `{ success, data, timestamp }`; it is not yet registered globally.

---

## Project Structure

```
backend/
├── .env.example
├── nest-cli.json
├── package.json
├── prisma7.config.ts          # Prisma CLI config (schema, migrations, DATABASE_URL)
├── prisma/
│   ├── schema.prisma          # Business, User, Module models + UserRole enum
│   └── migrations/
├── generated/prisma/          # Generated Prisma client (git-ignored)
└── src/
    ├── main.ts                # Bootstrap, ValidationPipe, Swagger
    ├── app.module.ts          # Root module
    ├── config/
    │   └── configuration.ts   # Typed env config (port, redis, jwt)
    ├── common/
    │   ├── contracts/         # Zod API contracts
    │   └── interceptors/      # ApiResponseInterceptor
    ├── health/                # GET /health
    ├── prisma/                # PrismaService (pg adapter)
    ├── redis/                 # RedisService (ioredis)
    ├── auth/                  # Signup, login, refresh, logout, JWT strategy/guard, RolesGuard, @Roles()
    ├── businesses/            # Tenant-scoped businesses CRUD + deactivate
    ├── users/                 # (skeleton)
    ├── onboarding/            # (skeleton)
    ├── crm/  inventory/  pos/  accounting/  gst/
    ├── hr/  payroll/  production/  marketing/  support/
    ├── dashboard/  collaboration/  growai/
    ├── audit/  notifications/  jobs/          # (skeletons)
    └── integerations/         # (skeletons)
        ├── whatsapp/  upi/  gstn/  ondc/
        └── tally/  digilocker/  translation/
```

---

## Roadmap

- Public onboarding flow (create business + owner in one step)
- Apply `@Roles()` restrictions to business mutations (e.g. owner-only delete/deactivate)
- Refresh token rotation and TTL on Redis keys
- Register `ApiResponseInterceptor` globally and add a global exception filter
- Implement onboarding and domain modules (CRM, Inventory, POS, Accounting/GST, HR/Payroll, …)
- Integrations: WhatsApp, UPI, GSTN, ONDC, Tally, DigiLocker, Translation
- Test setup (Jest) and CI
