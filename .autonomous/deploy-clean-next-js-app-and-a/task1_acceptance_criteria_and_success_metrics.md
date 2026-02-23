# Task 1 — Extracted Acceptance Criteria, Constraints, and Success Metrics

## Source documents used
- `.autonomous/deploy-clean-next-js-app-and-a/task_list.md`
- `nextjs-migration/README.md`
- `nextjs-migration/DEPLOYMENT.md`
- `nextjs-migration/DEPLOY_CHECKLIST.md`
- `nextjs-migration/MIGRATION_SUMMARY.md`

## A) Acceptance criteria for “clean” Next.js deployment
1. Codebase is deployment-ready for the `nextjs-migration/` app package and can be deployed consistently through Vercel.
2. The app builds successfully using standard Next.js production flow (`npm run build`) and serves successfully as a Vercel deployment (`.next` output expected by Vercel integration docs).
3. Environment setup excludes hard-coded secrets and relies on deployment-time configuration for required runtime values.
4. Core app features remain functional after cleanup (campaign CRUD, theme toggle, nebula visuals, AI assistant path when configured, responsive behavior, and route-level behavior).
5. Production behavior is secure and operational (HTTPS, security headers, and no obvious client-side secret leakage).
6. Deployment includes rollback path and documented operational checks before promoting to production.

## B) Constraints to honor
1. Deployment target is Vercel.
2. Repository and app workflow are aligned to Next.js project conventions used in migration docs (App Router flow).
3. Build/lint/test commands are expected at repo level in `nextjs-migration`:
   - `npm run lint`
   - `npm run build`
   - `npm test`
4. Environment variable model is minimal and deployment-scoped; docs explicitly call out `OPENAI_API_KEY` as optional/incremental, not required for all code paths.
5. Deployment target expects production-grade output and Vercel dashboard checks (no custom external deployment stack implied).
6. Scope includes post-change verification before production promotion (not a blind deploy).

## C) Explicit success metrics (pre- and post-change)
### 1) Build/quality gates (must pass)
- `npm run lint` passes
- `npm run build` passes
- `npm test` passes (Playwright test suite expectations in docs/reference files)
- Type/quality checks remain stable (`npx tsc --noEmit` where referenced in deployment docs)

### 2) Functional smoke verification
- Homepage/primary routes load successfully
- Theme toggle and nebula render/animation paths load without console-breaking issues
- Campaign workflow basics operational (create/edit/delete/export/import/filter/search)
- AI path works when API key is configured
- Mobile and desktop interaction sanity checks pass

### 3) Deployment and availability checks
- Deployment completes in Vercel
- No runtime startup errors on first load
- Site reachable at target Vercel URL
- No blocking console errors in initial navigation
- Rollback path available and documented

### 4) Performance targets (documented in package docs)
- Lighthouse performance target baseline appears in docs as:
  - Performance: `90+` (deployment guide) or `95+` (summary/Checklist variants; use current task-specific threshold)
  - Accessibility: `95+` to `100`
  - Best Practices: `95+` to `100`
  - SEO: `90+` to `100`
- Expected FCP/TTI not explicitly hard-coded in task docs beyond “fast, production-grade” guidance.

### 5) Security checklist expectations
- No API keys committed to source
- HTTPS enforced via Vercel
- Security headers/csp posture validated post-deploy
- No obvious mixed-content exposure

## D) Verification scope implied by the task brief
- This extraction is the “contract” for Phase 1.
- Subsequent tasks should keep these gates explicit and add evidence artifacts (URLs, logs, checks, and results) to task tracking.
