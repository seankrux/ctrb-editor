# Task 5: Deployment-Related Files and Settings Audit

## Scope
Validated deployment-relevant configuration in the repository root and `nextjs-migration/` for clean Next.js deployment readiness.

## Files inspected
- `vercel.json`
- `.env*` search across repository root (maxdepth 3)
- `.github` directory (workflow discovery)
- `nextjs-migration/.nvmrc`
- `nextjs-migration/.npmrc`
- `nextjs-migration` deployment docs:
  - `nextjs-migration/DEPLOYMENT.md`
  - `nextjs-migration/README.md`

## Findings
- `vercel.json` exists and points to `nextjs-migration` as the build root:
  - `buildCommand`: `cd nextjs-migration && npm run build`
  - `installCommand`: `cd nextjs-migration && npm ci`
  - `devCommand`: `cd nextjs-migration && npm run dev`
  - `outputDirectory`: `nextjs-migration/.next`
- No `.env`, `.env.local`, or other `.env*` files are present in the repository at this stage.
- `.gitignore` already excludes root `.env` and `.env.local`.
- No `.github` CI workflows currently exist.
- `nextjs-migration/.nvmrc` and `nextjs-migration/.npmrc` are present and reinforce Node/npm constraints.

## Required changes identified
1. `vercel.json` should use deterministic install behavior (`npm ci`).
   - Applied in `vercel.json` to avoid non-reproducible lockfile drift from `npm install`.
2. No repo-level `.env*` should be committed; keep environment variables injected through Vercel project settings.
   - Current state is already compliant, but deploy runbooks should be checked during rollout to avoid local `.env` leakage.
3. Add CI automation (`.github/workflows/ci.yml`) in a later task to run build/lint in PR/merge flows.
   - Not implemented in this task; documented for subsequent hardening phases.

## Verification
- `cd nextjs-migration && npm run build` passes after the `npm ci` workflow tweak.
