# Task 6: Next.js Static/Export/Runtime Mode Audit

## Objective
- Confirm Next.js runtime/render target before additional cleanup.
- Decide whether deployment should be SSR-capable, full static export, or mixed static/SSR.
- Prevent mixed-mode ambiguity that could break server features on Vercel.

## Evidence Collected
- Active config file: `nextjs-migration/next.config.mjs`.
- Route tree: `nextjs-migration/src/app` contains only:
  - `layout.tsx`
  - `page.tsx`
  - shared component file `ClientThemeSync.tsx`
- No `pages/` router directory exists.
- No `src/app/api/` route handlers or middleware in active tree.
- Build report after `cd nextjs-migration && npm run -s build` shows:
  - `/` route as static route
  - `/_not-found` route as static fallback
- Build behavior indicates App Router default static optimization is applied per-route.

## Current Config Behavior
- `next.config.mjs` does not define `output` (default mode).
- `output: 'export'` is not active.
- Active config sets `headers()` security defaults, while runtime semantics remain default.

## Target Decision
- Deployment target is:
  - **Server-capable Next.js app with static-first prerendering**
  - Default output mode (not forced static export).
  - Routes are pre-rendered where static, while retaining server runtime compatibility for future API/middleware/security expansions.

## Actions Taken
- Added explicit configuration intent comment in `next.config.mjs`:
  - Confirmed default runtime is intentional.
  - Documented why static export is not enabled.
- Recorded this as the canonical output strategy before downstream config/code changes.

## Backward-compatibility Considerations
- `next export` behavior is intentionally not adopted for now:
  - avoids losing server-side extension flexibility
  - avoids breaking any future deployment paths that depend on runtime behavior.
