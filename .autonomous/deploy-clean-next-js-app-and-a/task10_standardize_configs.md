# Task 10: TypeScript / ESLint / Next.js Config Standardization

Date: 2026-02-19

## Completed
- Standardized TypeScript config for app source clarity and build determinism:
  - Kept strict/noEmit/isolatedModules and cleaned includes/excludes in `nextjs-migration/tsconfig.json`.
- Standardized Next.js config:
  - Removed deprecated/conflicting `swcMinify` option from `nextjs-migration/next.config.mjs`.
  - Preserved explicit runtime mode comment indicating server-capable default output (non-exported output).
- Added deterministic ESLint configuration:
  - Added `nextjs-migration/.eslintrc.json` with explicit parser/env/rules and repository ignores.
- Resolved ESLint configuration breakage observed during build/lint checks:
  - Updated `nextjs-migration/src/app/ClientThemeSync.tsx` to use `ReactNode` import.
  - Removed TypeScript-plugin-specific inline disable from `src/store/index.ts`.

## Validation
- `cd nextjs-migration && npm run -s lint` passes in this environment.
- `cd nextjs-migration && rm -rf .next && npm run -s build` compiles successfully in this environment.

## Environment constraints noted
- Registry DNS is restricted (`ENOTFOUND registry.npmjs.org`), so Next still reports lockfile SWC patch warnings during install/build.
- Attempt to remove stale backup `next.config.mjs*` files was blocked by sandbox policy, so they remain for the next session.
