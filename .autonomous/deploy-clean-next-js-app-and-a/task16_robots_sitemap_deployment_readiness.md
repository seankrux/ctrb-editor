# Task 16 - robots/sitemap deployment readiness

## Scope
Add deployment-ready crawler metadata routes for the App Router shell so preview/production URLs expose `robots.txt` and `sitemap.xml` with base-path-safe URL generation.

## Changes Applied
- Added `nextjs-migration/src/app/robots.ts`.
  - Returns crawler rules for all agents.
  - Allows the app root.
  - Disallows API route prefix (`/api/`, base-path aware).
  - Publishes sitemap URL.
- Added `nextjs-migration/src/app/sitemap.ts`.
  - Generates sitemap entries for active public routes (currently home route only).
  - Includes `lastModified`, `changeFrequency`, and `priority` metadata.
- Added `nextjs-migration/src/lib/site-url.ts`.
  - Normalizes canonical origin from environment variables:
    - `NEXT_PUBLIC_SITE_URL`
    - `VERCEL_PROJECT_PRODUCTION_URL`
    - `VERCEL_URL`
    - fallback: `http://localhost:3000`
  - Adds `withBasePath(...)` helper to keep `robots`/`sitemap` paths correct when `NEXTJS_BASE_PATH` is configured.
- Updated `nextjs-migration/.env.example`:
  - Added optional `NEXT_PUBLIC_SITE_URL` contract entry.

## Verification
Commands run:
- `cd nextjs-migration && npm run -s lint`
- `cd nextjs-migration && npm run -s build`
- `cd nextjs-migration && npm run -s test -- --list`

Build output confirms metadata routes:
- `○ /robots.txt`
- `○ /sitemap.xml`

All verification commands completed successfully.
