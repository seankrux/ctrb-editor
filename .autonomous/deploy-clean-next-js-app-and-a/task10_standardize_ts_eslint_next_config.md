# Task 10: Standardize TypeScript, ESLint, and Next.js config files

## Scope
- Audit active TypeScript, ESLint, and Next.js configuration files in `nextjs-migration/`.
- Remove stale/duplicate config artifacts.
- Validate that lint/build tooling resolves consistently.

## Changes made
- Replaced `nextjs-migration/.eslintrc.json` content with a Next-native preset to standardize linting and remove the custom parser override path that produced inconsistent rule/plugin resolution.
  - Updated extends to:
    - `next`
    - `next/core-web-vitals`
- Removed stale duplicate Next config backups:
  - `nextjs-migration/next.config.mjs.bak`
  - `nextjs-migration/next.config.mjs.bak.20260219-190247`
  - `nextjs-migration/next.config.mjs.previous-local-copy`

## Why
- ESLint configuration previously triggered missing plugin/rule behavior and interactive setup friction.
- Duplicate `.mjs` backups are non-deterministic artifacts and create ambiguity about the real runtime config source.
- Standardizing this config surface reduces deployment and local-tooling drift.

## Verification
- `cd nextjs-migration && npm run -s lint`
- `cd nextjs-migration && npm run -s build`

Both commands pass after the config updates.
