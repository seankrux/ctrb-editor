# Task 12 - Environment Variable Validation and Simplification

## Objective
Validate and simplify environment variable usage so only production-required variables remain in deployment/runtime guidance and config.

## Audit Scope
- Runtime app source under `nextjs-migration/src`
- Deployment config: `vercel.json`, `nextjs-migration/next.config.mjs`
- Project docs that define env requirements:
  - `nextjs-migration/README.md`
  - `nextjs-migration/DEPLOYMENT.md`
  - `nextjs-migration/DEPLOY_CHECKLIST.md`
- Repository ignore rules: `.gitignore`

## Findings
1. No production runtime env vars are referenced by the current app shell (`nextjs-migration/src`).
2. Deployment config files do not require runtime env vars.
3. Legacy docs still referenced `OPENAI_API_KEY`, which is not required by the current app.
4. Root `.gitignore` did not fully cover all `.env.*` variants.

## Changes Applied
1. Added explicit env contract file:
   - `nextjs-migration/.env.example`
   - Declares: no required production env vars; optional local/test knobs only.
2. Hardened ignore policy for env files:
   - Updated `.gitignore` to include `.env.*` and allowlist example files (`!.env.example`, `!*.env.example`).
3. Removed outdated deployment env requirements from docs:
   - Updated `nextjs-migration/README.md` env section.
   - Updated `nextjs-migration/DEPLOYMENT.md` env sections.
   - Updated `nextjs-migration/DEPLOY_CHECKLIST.md` env guidance.

## Current Environment Contract
- Required in production: none.
- Optional for local/test workflows:
  - `CI`
  - `PORT`
  - `HOSTNAME`

## Verification
- `cd nextjs-migration && npm run -s lint` -> pass.
- `cd nextjs-migration && npm run -s build` -> pass.
- `cd nextjs-migration && npm run -s test -- --list` -> pass (test discovery).

## Notes
- Playwright execution is sandbox-limited in this environment for live server startup (`EPERM` binding to `0.0.0.0:3000`). This does not affect production runtime env contract validation.
