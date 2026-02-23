# Task 3: Next.js Application Inventory

## Scope
Inventory of deployment entrypoints for `nextjs-migration/` and confirmation of intended route/app directory.

## 1) Application root & execution entry
- App project directory: `nextjs-migration/`
- Package scripts indicate standard Next.js execution model:
  - `dev`: `next dev`
  - `build`: `next build`
  - `start`: `next start`
  - `lint`: `next lint`
- No nested `appDir` override is needed in config, so Vercel/project should treat `nextjs-migration` as a standalone Next.js app root.

## 2) Route root strategy (App Router)
- Routing mode is App Router (via `src/app` directory, `layout.tsx`, `page.tsx`, and import alias `@/*` in `tsconfig.json`).
- Confirmed files under `src/app`:
  - `src/app/layout.tsx` (root layout)
  - `src/app/page.tsx` (home route `/`)
  - `src/app/globals.css`
  - `src/app/ClientThemeSync.tsx`
- `src/app/page.tsx` is currently the only route-level page. It maps directly to `/` (home route).
- No route groups (`(group)`), no nested folders, and no dynamic routes were found.

## 3) Confirmed missing route directories (important)
- No `pages/` directory exists in the app.
- No App Router API directory (`src/app/api/`) exists.
- No `middleware.ts`/`middleware.js` at app root.
- No dedicated error routes (`error.tsx`, `global-error.tsx`, `not-found.tsx`, `loading.tsx`) present.

## 4) Supporting route-adjacent assets and aliases
- Source alias: `@/*` → `./src/*` (set in `tsconfig.json`), confirming intended source boundary under `src`.
- Global styles are loaded from `src/app/globals.css` in layout, making `src/app` the intended entry surface for style and metadata.

## 5) Non-source artifacts in this directory
- `nextjs-migration/.next/`, `playwright-report/`, and `test-results/` exist and are build/test outputs, not route entrypoints.
- These should be treated as non-deployment artifacts and reviewed in later cleanup tasks.
