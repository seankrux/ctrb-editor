# Task 5: Deployment settings validation and required changes

## Scope
- Reviewed deployment-related artifacts before making changes:
  - `vercel.json`
  - environment file presence and ignore policy (`.env*`, `.gitignore`)
  - CI/workflow configuration (`.github/workflows`)
  - next app deployment-adjacent config (`nextjs-migration/next.config.mjs` and backups)
- Ran a verification build (`cd nextjs-migration && npm run -s build`) to ensure baseline health before deciding changes.

## Findings

### 1) `vercel.json` (root)
- File exists and is valid JSON.
- Current settings:
  - `buildCommand`: `cd nextjs-migration && npm run build`
  - `installCommand`: `cd nextjs-migration && npm ci`
  - `devCommand`: `cd nextjs-migration && npm run dev`
  - `outputDirectory`: `nextjs-migration/.next`
- This configuration is operational for the current monorepo layout where Next app is nested in `nextjs-migration/`.

### 2) Environment files (`.env*`)
- No `.env` files are currently present in the repository (including hidden scan).
- `.gitignore` includes:
  - `.env`
  - `.env.local`
  - `*.local`
- This is safe and prevents accidental secret leakage.

### 3) CI / deployment automation config
- No `.github/workflows` directory exists at repo root.
- No CI pipeline exists yet for build/typecheck/lint/test gates prior to Vercel deploy.
- This is currently an execution-risk gap for clean production deploy discipline.

### 4) App deployment config hygiene
- `nextjs-migration/next.config.mjs` contains active security headers and no syntax issues.
- Multiple stale backup files are present in repo:
  - `nextjs-migration/next.config.mjs.bak`
  - `nextjs-migration/next.config.mjs.bak.20260219-190247`
  - `nextjs-migration/next.config.mjs.previous-local-copy`
- Keeping these in source can create ambiguity for future audits and should be cleaned up before further hardening tasks.

### 5) Baseline build validation
- Next.js production build succeeds in the current state after the existing Task 4 tooling hardening.
- Build output includes static generation for `/` and `/_not-found` and no build blockers.

## Required changes identified
- **Required (High priority):** add deployment CI workflow(s) under `.github/workflows` for deterministic pre-deploy checks (`build`, `lint`, and `test` where applicable).
- **Required (Cleanup):** remove stale `next.config.mjs` backup artifacts from source control.
- **Recommended:** add `.env.example` (and/or deployment-specific env documentation) to make production/preview variables explicit for operators.
- **Recommended:** include a concise Vercel deployment README section that maps current `vercel.json` behavior and any branch/deploy strategy expectations.
