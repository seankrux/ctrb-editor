# Task 11: Route-level implementation cleanup

## Scope
- Remove dead implementation state and unused exports in route-adjacent shared modules to reduce app surface area and improve deployment cleanliness.

## Changes
- `nextjs-migration/src/store/index.ts`
  - Removed legacy campaign and AI store state implementations that were not referenced by active routes/components.
  - Kept only `ThemeState` and `useThemeStore` used by current deployment shell components.
- `nextjs-migration/src/lib/utils.ts`
  - Removed campaign utility/constants payload and unrelated helpers.
  - Kept only `cn(...inputs: ClassValue[])` used by `ThemeToggle` class composition.

## Why this is clean-up
- Current App Router entry points (`src/app`) only consume theme-related behavior.
- Static usage checks (`rg` for `@/store` and `@/lib/utils`) confirmed the additional legacy exports had no runtime consumers in source code after route audit.
- The change lowers maintenance risk for deployment verification by reducing stale, non-obvious code paths.

## Verification
- `cd nextjs-migration && npm run -s lint` passes with no warnings.
- `cd nextjs-migration && npm run -s build` passes successfully.
