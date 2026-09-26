# GrowNova Backend

Backend API for **GrowNova OS**, an AI-first, vernacular, one-tap business OS for Indian MSMEs.

Built with **NestJS 11**, **TypeScript**, **Prisma 7** (PostgreSQL), **Redis** and **JWT** authentication.

---

## Current Phase

**Current Phase: Phase 2 — API Contracts & Authentication**

| Phase | Scope | Status |
|-------|-------|--------|
| Phase 0 | NestJS foundation, env config, health endpoint | ✅ Done |
| Phase 1 | Prisma + PostgreSQL, Redis, initial migration, module skeletons | ✅ Done |
| Phase 2 | API contracts (Zod), request validation, JWT auth, businesses API | 🚧 In progress |

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
| Auth | Passport JWT, `bcrypt` password hashing |
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
| `JWT_REFRESH_SECRET` | Secret for refresh tokens (reserved) | dev fallback |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime (reserved) | `7d` |

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
> Always set `JWT_ACCESS_SECRET` explicitly. Never commit `.env` files containing real credentials.

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
| `Business` | A tenant (MSME) — name, industry, contact, location, country (default `India`) |
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

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/businesses` | — | Create a business |
| `GET` | `/businesses` | — | List businesses (newest first) |
| `GET` | `/businesses/:id` | — | Get a business by ID |

```bash
curl -X POST http://localhost:3000/businesses \
  -H "Content-Type: application/json" \
  -d '{"name":"Sharma Textiles","industry":"Textiles","city":"Surat","state":"Gujarat"}'
```

Fields: `name` (required), `industry`, `phone`, `email`, `address`, `city`, `state`, `country` (optional).

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/auth/signup` | — | Register a user under an existing business |
| `POST` | `/auth/login` | — | Log in and receive a JWT access token |
| `GET` | `/auth/me` | Bearer JWT | Return the authenticated user |

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
    ├── auth/                  # Signup, login, JWT strategy/guard, roles decorator
    ├── businesses/            # Businesses CRUD
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

- Refresh tokens and logout (Redis-backed)
- Role-based access guard using the `@Roles()` decorator
- Protect business endpoints and scope data per `businessId`
- Register `ApiResponseInterceptor` globally and add a global exception filter
- Implement onboarding and domain modules (CRM, Inventory, POS, Accounting/GST, HR/Payroll, …)
- Integrations: WhatsApp, UPI, GSTN, ONDC, Tally, DigiLocker, Translation
- Test setup (Jest) and CI
