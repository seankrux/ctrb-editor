# Task 18 - Production error pages validation

## Scope
Ensure production error surfaces are explicitly implemented and do not rely on missing client-only runtime data.

## Changes Applied
- Added `nextjs-migration/src/app/not-found.tsx`
  - Deterministic 404 page for missing routes.
- Added `nextjs-migration/src/app/error.tsx`
  - Route-segment runtime error boundary for 500-class failures.
  - Includes retry action via `reset()`.
- Added `nextjs-migration/src/app/global-error.tsx`
  - Root-level global fallback for critical rendering failures.
  - Includes retry action via `reset()`.
- Updated smoke tests:
  - `nextjs-migration/tests/e2e/campaign.spec.ts` now includes explicit 404 route assertion.

## Build Stability Issue + Resolution
During implementation, adding an explicit App Router `/500` route (`src/app/500/page.tsx`) caused a Next.js build failure:
- Error: `ENOENT ... rename ... .next/export/500.html -> .next/server/pages/500.html`

Resolution:
- Removed direct `/500` App Router route.
- Kept stable Next.js-native error handling via `error.tsx` and `global-error.tsx`, which covers production 500-class rendering failures without conflicting with Next.js internal 500 generation behavior.

## Verification
Commands run:
- `cd nextjs-migration && npm run -s lint`
- `cd nextjs-migration && npm run -s build`
- `cd nextjs-migration && npm run -s test -- --list`

Results:
- Lint: pass
- Build: pass
- Test discovery: pass (`20 tests in 1 file`)
- Build routes confirm static error/metadata surfaces are present and stable:
  - `/`
  - `/_not-found`
  - `/robots.txt`
  - `/sitemap.xml`

## Outcome
Production error handling is now explicit, stable, and independent of app-specific client data stores.
