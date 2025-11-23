# File Explorer — Bun Monorepo

This repository contains a full-stack File Explorer application built entirely with Bun, consisting of:

- Backend — Elysia + Prisma + PostgreSQL (Hexagonal Architecture)
- Frontend — Vue 3 + Vite
- Workspaces managed with Bun

Both apps live under the "apps" directory.

---

## Monorepo Structure

```text
apps/
    backend/        # Elysia backend API
    frontend/       # Vue 3 frontend
package.json        # Bun workspace config
bun.lockb
docker-compose.yml  # PostgreSQL (optional)**
```

---

## Getting Started

### 1. Install all dependencies (run from monorepo root)

```shell
bun install   
```

### 2. Start backend only

```shell
bun run dev:backend
```

Backend runs at:
http://localhost:3000

### 3. Start frontend only

```shell
bun run dev:frontend
```

Frontend runs at:
http://localhost:5173

### 4. Start both at once

```shell
bun run dev:all
```

---

## Workspace Scripts (root package.json)
| Command      | Description                       |
|--------------|-----------------------------------|
| dev:backend  | Start backend in dev mode         |  
| dev:frontend | Start frontend in dev mode        |  
| dev:all      | Run backend and frontend together |

---

## Database (Optional)

A PostgreSQL instance is provided via docker-compose.yml.

Start it:

```shell
docker compose up -d
```

Backend .env should contain:

```text
DATABASE_URL="postgresql://fe_user:fe_pass@localhost:5432/file_explorer?schema=public"
```

---

## Apps Documentation

### Backend

Located at: apps/backend  
Includes:
- Hexagonal architecture (core, infra, interface)
- Prisma migrations
- Bun tests (unit + HTTP)
- Folder tree + search API

More details: see apps/backend/README.md

### Frontend

Located at: apps/frontend  
Includes:
- Vue 3 Composition API
- Folder tree UI
- File viewer UI
- Search integration
- Bun dev server + build

More details: see apps/frontend/README.md

---

## Requirements

- Bun (required)
- Docker (optional for PostgreSQL)
- Modern browser

---

## Notes

- Always run "bun install" at the monorepo root.
- Backend and frontend each have their own README files.
- Services run independently but share the same Bun workspace.
