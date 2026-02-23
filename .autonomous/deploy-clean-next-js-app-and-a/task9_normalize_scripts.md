# Task 9: Normalize scripts (`dev`, `build`, `start`, `lint`, `test`)

Date: 2026-02-19

## Scope
- Normalize the root Next.js package scripts in `nextjs-migration/package.json`.
- Remove ambiguity and make command behavior explicit and consistent for deployment and local operations.

## Changes made
- Updated `nextjs-migration/package.json` scripts to:
  - `dev`: `next dev --hostname 0.0.0.0 --port 3000`
  - `build`: `next build`
  - `start`: `next start --hostname 0.0.0.0 --port 3000`
  - `lint`: `next lint --max-warnings=0`
  - `test`: `CI=1 playwright test --reporter=list --workers=1`
  - `test:ui`: retained as `playwright test --ui`

## Why
- Host/port are explicitly bound in both dev and start for consistent local container/server behavior.
- Lint now fails on warnings in CI-like runs to prevent warning regression drift.
- Test script is explicitly CI-gated and deterministic (`list` reporter + single worker).

## Verification
- `cd nextjs-migration && npm run -s build` (passes; existing known `registry.npmjs.org` DNS limitation still surfaces `⚠ Found lockfile missing swc dependencies` warnings from `next` lockfile patcher, but build succeeds).
- `cd nextjs-migration && npm run -s test -- --help` (script parses and prints Playwright usage successfully).

## Notes
- `npm run -s lint` currently triggers Next.js ESLint interactive setup prompt because no ESLint config exists yet (tracked in Step 10 as a follow-up in Task 10).
