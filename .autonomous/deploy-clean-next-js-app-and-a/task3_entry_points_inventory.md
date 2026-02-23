# Task 3: Next.js Entry Points & Route Structure Inventory

## Scope
- Target app under review: `nextjs-migration/`
- Focus: confirm entry points, router mode, and route-level structure before cleanup/deployment.

## Findings

### 1) Canonical app directory and route mode
- Active router mode: **Next.js App Router**.
- Entry root is `nextjs-migration/src/app`.
- No legacy `pages/` directory exists.
- No `app/` directory at repository root; only `nextjs-migration/src/app`.

### 2) Root route files confirmed
- `nextjs-migration/src/app/layout.tsx`
  - Defines root layout and global metadata.
  - Wraps children in `<ClientThemeSync>` and sets `<html lang="en">`.
- `nextjs-migration/src/app/page.tsx`
  - Defines the homepage (`/`) route.

### 3) Additional App Router files
- `nextjs-migration/src/app/globals.css`
- `nextjs-migration/src/app/ClientThemeSync.tsx`

These are shared layout/page collaborators, not standalone routes.

### 4) Route surface from build output
- `next build` in `nextjs-migration` currently produces route graph with:
  - `/` (static home page)
  - `/_not-found` (framework-provided fallback route marker)
- No explicit custom `api` route files were found.

### 5) Alias and compile configuration relevant to routing
- `nextjs-migration/tsconfig.json` confirms path alias `@/* -> ./src/*`, matching `src/app` imports.
- `nextjs-migration/next.config.mjs` has no explicit custom `srcDir`/`pagesDir` override.

## Conclusion
- Intended deployment entrypoint for this task is the **App Router root at** `nextjs-migration/src/app`.
- Minimal route structure is currently a single production route (`/`) with standard App Router fallback behavior.
