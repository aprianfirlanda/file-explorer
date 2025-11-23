# Backend (Elysia + Bun + Prisma)

A lightweight backend API for a file explorer application, built with:

- Bun — ultrafast runtime & testing
- Elysia — modern, typed web framework
- Prisma — database ORM
- Hexagonal Architecture — clean separation between core logic, infrastructure, and HTTP
- Unit & HTTP Tests using Bun’s built-in test runner

---

## Tech Stack

- Runtime: Bun
- Framework: Elysia
- DB ORM: Prisma (PostgreSQL)
- Architecture: Hexagonal (Ports & Adapters)
- Testing: Bun test runner
- Typescript: Strict typing across layers

---

## Project Structure
```text
src/
app.ts                # composition root
index.ts              # application entrypoint

core/                 # hexagon: domain + application logic
    folder/
        folder.entity.ts
        folder.types.ts
        folder.port.ts
        folder.service.ts
    file/
        file.entity.ts
        file.port.ts
    search/
        search.types.ts
        search.service.ts

infra/                # adapters for Prisma, DB access
    db/
        prismaClient.ts
    folder/
        prismaFolder.repository.ts
    file/
        prismaFile.repository.ts

interface/            # HTTP delivery layer
    http/
        elysia/
            folder.router.v1.ts
            search.router.v1.ts

tests/
    _doubles/             # in-memory repositories (mock infrastructure)
    unit/                 # core service tests (no I/O)
    http/                 # API-level tests via Elysia
```

---

## Getting Started

### 1. Install dependencies
Special for this command, should run from the root project(monorepo)
```shell
bun install
```

### 2. Setup environment

note: there is docker compose with postgresql on the root project that can used. It will automatically match with this env example.

Create .env:

```text
DATABASE_URL="postgresql://fe_user:fe_pass@localhost:5432/file_explorer?schema=public"
```

### 3. Run database migrations

```shell
bun run prisma:migrate --name init
```

### 4. Generate Prisma client:

```shell
bun run prisma:generate
```

### 5. Seed database:

```shell
bun run prisma:seed
```

(Optional) Reset database:
```shell
bun run prisma:reset
```

---

## Run the application

Development mode:

```shell
bun run dev
```

Production run:

```shell
bun start
```

The server will start at:

http://localhost:3000

---

## API Endpoints

### Folders
| Method | Endpoint                     | Description                          |
|--------|------------------------------|--------------------------------------|
| GET    | /api/v1/folders/tree         | Get full folder tree (left panel)    |
| GET    | /api/v1/folders/:id/contents | Get subfolders + files (right panel) |

### Search
| Method | Endpoint          | Description                    |
|--------|-------------------|--------------------------------|
| GET    | /api/v1/search?q= | Search folders & files by name |

---

## Hexagonal Architecture Overview

| core/           | pure business logic               |
|-----------------|-----------------------------------|
| infra/          | Prisma repository implementations |
| interface/http/ | Elysia routers                    |
| app.ts          | wires dependencies (buildApp)     |
| index.ts        | starts server                     |

This architecture makes testing and future replacement of Prisma/Elysia extremely easy.

---

## Running Tests

All tests use Bun’s built-in test runner:
```shell
bun test
```

### Test types

| tests/unit     | core services using in-memory repos  |
|----------------|--------------------------------------|
| tests/http     | HTTP tests using app.handle(Request) |
| tests/_doubles | mock repos replacing Prisma          |

### Example test commands

Run only unit tests:
```shell
bun test tests/unit
```

Run only HTTP tests:
```shell
bun test tests/http
```

---

## Scripts

From package.json:

| command                 | description            |
|-------------------------|------------------------|
| bun run dev             | Run app in development |  
| bun start               | Run app normally       |  
| bun test                | Run all tests          |  
| bun run prisma:migrate  | Apply migrations       |  
| bun run prisma:reset    | Reset DB               |  
| bun run prisma:generate | Generate Prisma client |  
| bun run prisma:seed     | Seed DB                |

---

