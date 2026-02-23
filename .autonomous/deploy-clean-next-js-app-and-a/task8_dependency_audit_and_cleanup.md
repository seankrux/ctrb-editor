# Task 8: Dependency Audit and Manifest Cleanup

## Scope
Evaluate `nextjs-migration/package.json` and `nextjs-migration/package-lock.json` to remove unused/outdated/insecure dependencies before moving to deeper app hardening.

## Audit execution
- Static usage scan performed with `rg` against `src`, `tests`, and `playwright.config.ts`.
- Outdated package lookup (`npm outdated --json`) attempted but blocked in this environment and terminated by registry DNS resolution issues.
- Security audit (`npm audit --audit-level=high --json`) attempted and blocked by DNS (`registry.npmjs.org`).

## Dependency usage findings
Top-level dependencies and runtime usage:
- `next` — required by framework and build pipeline
- `react`, `react-dom` — required by Next.js App Router pages/components
- `framer-motion` — imported in `src/components/ThemeToggle.tsx` and `src/components/NebulaBackground.tsx`
- `lucide-react` — imported in `src/components/ThemeToggle.tsx`
- `zustand`/`zustand/middleware` — imported in `src/store/index.ts`
- `clsx` — imported in `src/lib/utils.ts`
- `tailwind-merge` — imported in `src/lib/utils.ts`

Top-level dev dependencies and usage:
- `@types/node`, `@types/react`, `@types/react-dom` — TypeScript compiler/tooling requirements
- `@playwright/test` — used in `playwright.config.ts` and `tests/e2e/campaign.spec.ts`
- `autoprefixer`, `postcss`, `tailwindcss` — used in CSS pipeline config files
- `eslint`, `eslint-config-next` — required for lint checks in build gate
- `typescript` — required for compilation

No unused manifest dependencies were identified from source-level imports and config references.

## Lockfile cleanup
- Generated app-local lockfile to support deterministic CI (`npm ci`) with:
  - `cd nextjs-migration && npm install --package-lock-only --ignore-scripts`
- This produced `nextjs-migration/package-lock.json`.

## Known residual risk / environment note
- `nextjs-migration` build still logs transient `Found lockfile missing swc dependencies` warnings in this environment due registry DNS block when patching incorrect lock details.
- This is already tracked in prior execution notes as environment/registry-dependent behavior, not a source file regression.

## Action taken
- Created/updated:
  - `nextjs-migration/package-lock.json`

