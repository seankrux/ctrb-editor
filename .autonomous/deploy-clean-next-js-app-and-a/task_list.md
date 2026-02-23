# Task List: deploy-clean-next-js-app-and-a

## Meta
- Created: 2026-02-19 19:23
- Task Directory: .autonomous/deploy-clean-next-js-app-and-a
- Total Tasks: 30
- Completed: 11/30 (37%)

## Progress Notes
<!-- Updated after each session -->

## Tasks

### Phase 1: Foundation
- [x] Task 1: Read the task brief and extract acceptance criteria, constraints, and explicit success metrics for a clean Next.js deployment and post-change verification.
- [x] Task 2: Capture and store baseline project context: repository branch, latest commit hash, and uncommitted changes before cleanup.
- [x] Task 3: Inventory existing Next.js application entry points (`nextjs-migration/`) and confirm the intended app directory and route structure for deployment.
- [x] Task 4: Audit current Node.js and package-manager settings (`package.json`, `package-lock.json`, lockfile type) and lock down the tooling version in docs or config if needed.
- [x] Task 5: Validate existing deployment-related files and settings (`vercel.json`, `.env*`, CI config) and list required changes.
- [x] Task 6: Audit static/export/runtime modes in Next.js config and define the target output behavior (SSR vs SSG vs static) before code changes.
- [x] Task 7: Create a clean working task context file in `.autonomous/deploy-clean-next-js-app-and-a/` if additional notes are needed for handoff.

### Phase 2: Core Implementation (Clean Next.js App)
- [x] Task 8: Run a dependency audit and remove unused, outdated, or insecure packages in the Next.js app package manifest.
- [x] Task 9: Normalize scripts (`dev`, `build`, `start`, `lint`, `test`) and ensure they are consistent and deterministic.
- [x] Task 10: Standardize TypeScript, ESLint, and Next.js config files; remove duplicate or conflicting options.
- [x] Task 11: Clean route-level implementation issues by fixing broken pages/components and removing dead imports/unused files identified by static checks.
- [x] Task 12: Validate and simplify environment variable usage so only production-required variables remain in deployment/runtime configs.
- [x] Task 13: Implement defensive configuration for API base URLs, secrets, and base path behavior to avoid build-time and runtime failures.
- [x] Task 14: Validate middleware, headers, redirects, and rewrites for correctness and security (`X-Frame-Options`, HSTS, CSP-compatible defaults).
- [x] Task 15: Prune temporary/demo content and legacy assets from the app bundle to ensure a clean deployment footprint.
- [x] Task 16: Add/adjust `robots.txt` and `sitemap` (if app uses SEO-critical pages) for deployment readiness.
- [x] Task 17: Confirm image/domain optimization settings are valid for all remote image sources used by the app.
- [x] Task 18: Ensure production error pages (`404`, `500`, `global-error`) behave correctly and do not depend on missing client-only data.
- [x] Task 19: Add lightweight API/test fixtures or stubs to avoid deployment failures due to missing backend dependency in preview environments.
- [x] Task 20: Finalize app structure and run local `next build` smoke validation.

### Phase 3: Integration & Verification
- [x] Task 21: Build a clean local environment (delete caches/build artifacts, reinstall dependencies, and run `npm ci`).
- [ ] Task 22: Capture baseline build artifacts and size metrics before deployment for post-change comparison.
- [ ] Task 23: Configure or update Vercel project settings for production and preview deployments from the current branch strategy.
- [ ] Task 24: Deploy a preview build to Vercel and record preview URL, deployment ID, and commit hash.
- [ ] Task 25: Execute post-change functional verification on the preview URL (home route, key routes, API paths, redirects, and error paths).
- [ ] Task 26: Execute performance and stability checks on preview (`build`, `lighthouse`, basic load route checks) and capture evidence.
- [ ] Task 27: Validate secure deployment headers/CORS behavior and confirm no obvious data leakage or mixed content issues.
- [ ] Task 28: Promote to production only after preview checks pass and document rollback condition in `.autonomous/deploy-clean-next-js-app-and-a/task_list.md` notes.
- [ ] Task 29: Verify production URL after promotion and run end-to-end smoke tests with production environment variables.

### Phase 4: Polish & Documentation
- [ ] Task 30: Produce a final post-change verification report, including before/after diff summary, known risks, deployment URL(s), and next-step recommendations for monitoring.
