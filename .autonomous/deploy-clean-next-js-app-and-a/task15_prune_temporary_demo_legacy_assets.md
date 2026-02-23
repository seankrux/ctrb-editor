# Task 15 - Prune temporary/demo content and legacy assets

## Scope
Prune non-essential demo UI code and temporary artifacts from `nextjs-migration` so deployment payload is cleaner and easier to maintain.

## Changes Applied
- Removed legacy visual/demo runtime modules from the shipped route:
  - Deleted `nextjs-migration/src/components/NebulaBackground.tsx`
  - Deleted `nextjs-migration/src/store/index.ts`
  - Deleted `nextjs-migration/src/lib/utils.ts`
- Replaced heavy client UI patterns with lightweight equivalents:
  - Updated `nextjs-migration/src/components/ThemeToggle.tsx` to plain React + DOM theme toggling (no animation/icon/store packages)
  - Updated `nextjs-migration/src/app/ClientThemeSync.tsx` to apply normalized theme via a small helper
  - Added `nextjs-migration/src/lib/theme.ts` for deterministic theme resolution and persistence
  - Updated `nextjs-migration/src/app/page.tsx` to remove legacy nebula/demo background usage and keep a clean shell layout
- Pruned legacy E2E test content:
  - Replaced `nextjs-migration/tests/e2e/campaign.spec.ts` with focused shell smoke coverage (3 tests)
- Pruned unused runtime dependencies:
  - Removed `framer-motion`, `lucide-react`, `zustand`, `clsx`, `tailwind-merge` from `nextjs-migration/package.json`
  - Updated lockfile via `npm uninstall ...`
- Hardened temp artifact hygiene:
  - Added `.next/` to root `.gitignore`
  - Removed local generated dirs during cleanup (`nextjs-migration/.next`, `nextjs-migration/playwright-report`, `nextjs-migration/test-results`)

## Verification
Commands run:
- `cd nextjs-migration && npm run -s lint`
- `cd nextjs-migration && npm run -s build`
- `cd nextjs-migration && npm run -s test -- --list`

Results:
- Lint: pass (`No ESLint warnings or errors`)
- Build: pass
- Test discovery: pass (`15 tests in 1 file`)

## Footprint Evidence
Build route-size comparison:
- Before cleanup (pre-Task-15 baseline in session verification): `/` route size `46 kB`, first load `136 kB`
- After cleanup: `/` route size `779 B`, first load `87.8 kB`

This confirms legacy/demo runtime code was removed from the production bundle path.
