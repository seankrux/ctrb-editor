# Task 19 - Preview API stubs and fixtures

## Scope
Add lightweight API fixtures/stubs so preview deployments remain functional even when backend services are unavailable.

## Changes Applied
- Added fixture module:
  - `nextjs-migration/src/lib/api-fixtures.ts`
  - Contains stable campaign fixture payload and environment-aware stub gating logic.
- Added API routes:
  - `nextjs-migration/src/app/api/health/route.ts`
    - Returns deterministic health payload.
  - `nextjs-migration/src/app/api/campaigns/route.ts`
    - Returns fixture campaigns in preview/dev by default.
    - Returns 503 with explicit message if stubs are disabled and no backend exists.
- Updated env contract:
  - `nextjs-migration/.env.example` includes `PREVIEW_API_STUBS` toggle.
- Expanded smoke tests:
  - `nextjs-migration/tests/e2e/campaign.spec.ts` adds API assertions for `/api/health` and `/api/campaigns`.

## Stub Behavior
- `PREVIEW_API_STUBS=1`: force stubs on.
- `PREVIEW_API_STUBS=0`: force stubs off.
- unset: stubs enabled in `preview`/`development` (and local fallback), disabled in production.

## Verification
Commands run:
- `cd nextjs-migration && npm run -s lint`
- `cd nextjs-migration && npm run -s build`
- `cd nextjs-migration && npm run -s test -- --list`

Results:
- Lint: pass
- Build: pass
- Test discovery: pass (`30 tests in 1 file`)
- Build output includes API routes:
  - `/api/health`
  - `/api/campaigns`

## Outcome
Preview environments now have deterministic API fallback behavior, reducing risk of deployment-time route failures when external backends are unavailable.
