# File Explorer Frontend (Vue 3 + Vite)

A simple and fast frontend application for a file explorer UI, built with:

- Vue 3 (Composition API)
- Vue Router
- Vite
- TypeScript
- Lucide icons
- Bun (monorepo + package manager)

---

## Tech Stack

- Framework: Vue 3
- Bundler / Dev Server: Vite
- Type Checking: vue-tsc
- Router: vue-router
- Icons: lucide-vue-next
- Language: TypeScript
- Package Manager / Runtime: Bun

---

## Project Structure (Typical)

```text
src/
    assets/             # static assets  
    components/         # shared UI components  
    views/              # pages  
    router/             # vue-router setup  
    composables/        # reusable logic  
    styles/             # global styles  
    main.ts             # entrypoint
```

---

## Getting Started

### 1. Install dependencies (monorepo root)

```shell
bun install
```

### 2. Run the development server

```shell
bun run dev
```

The app will run at:

http://localhost:5173

---

## Build for Production

```shell
bun run build
```

Output will be in:

`dist/`

---

## Preview Production Build

```shell
bun run preview
```

---

## Scripts (from package.json)

| Command | Description                          |
|---------|--------------------------------------|
| dev     | Start Vite dev server                |
| build   | Type-check & build production bundle |
| preview | Preview built app locally            |

---

## Features

- Dynamic folder tree
- File preview UI
- Search integration
- Clean component architecture
- Compatible with the Elysia backend API

---

## Requirements

- Bun (required)
- Modern browser

