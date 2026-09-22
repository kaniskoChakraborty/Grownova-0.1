# GrowNova Backend

Backend API for **GrowNova OS** — an AI-first, vernacular, one-tap business OS designed for Indian MSMEs.

---

## Current Phase

**Current Phase: Phase 0 — Project Foundation**

> [!NOTE]
> This phase establishes a clean, minimal NestJS and TypeScript foundation with environment configuration and health verification. Database integration, authentication, authorization, and business domain modules (CRM, Inventory, Accounting/GST, HR/Payroll, etc.) are explicitly deferred to later phases according to the GrowNova PDR.

---

## Prerequisites

- **Node.js**: `v20+` or `v22+` (LTS recommended)
- **npm**: `v10+`

---

## Installation

Install project dependencies:

```bash
npm install
```

---

## Environment Setup

Copy the example environment configuration file:

```bash
cp .env.example .env
```

Default variables configured for Phase 0:

| Variable   | Description               | Default       |
|------------|---------------------------|---------------|
| `NODE_ENV` | Application environment   | `development` |
| `PORT`     | HTTP port for API server  | `3000`        |

---

## Development Command

Start the development server with file watching:

```bash
npm run start:dev
```

Or start without watch mode:

```bash
npm run start
```

---

## Build Command

Compile the TypeScript application to the `dist/` directory:

```bash
npm run build
```

---

## Production Start Command

Start the compiled production server:

```bash
npm run start:prod
```

---

## Health Endpoint

Verify that the application is running properly:

- **Method**: `GET`
- **Path**: `/health`
- **Expected Status**: `200 OK`
- **Response**:

```json
{
  "status": "ok",
  "service": "grownova-api"
}
```

Example verification using curl:

```bash
curl -i http://localhost:3000/health
```

---

## Project Structure

```
backend/
├── .env
├── .env.example
├── .gitignore
├── nest-cli.json
├── package.json
├── README.md
├── tsconfig.build.json
├── tsconfig.json
└── src/
    ├── main.ts
    ├── app.module.ts
    ├── config/
    │   └── configuration.ts
    ├── common/
    │   └── index.ts
    └── health/
        ├── health.controller.ts
        ├── health.module.ts
        └── health.service.ts
```
