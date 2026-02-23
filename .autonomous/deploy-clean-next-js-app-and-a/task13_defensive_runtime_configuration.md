# Task 13 - Defensive Runtime Configuration (API/Base Path/Secrets)

## Objective
Implement defensive configuration for API base URLs, secrets, and base path behavior to prevent build-time/runtime failures.

## Changes Implemented

1. Hardened Next.js base path handling in `nextjs-migration/next.config.mjs`:
   - Added normalization for `NEXTJS_BASE_PATH`.
   - Rejects/neutralizes invalid absolute URL values.
   - Normalizes leading/trailing/double slashes.
   - Applies normalized value to `basePath`.
   - Exposes normalized `NEXT_PUBLIC_BASE_PATH` to runtime code via `nextConfig.env`.

2. Added runtime-safe API/base-path resolver in `nextjs-migration/src/lib/runtime-config.ts`:
   - Computes safe `runtimeConfig.basePath` from `NEXT_PUBLIC_BASE_PATH`.
   - Computes safe `runtimeConfig.apiBaseUrl` from `NEXT_PUBLIC_API_BASE_URL` with fallback to `${basePath}/api`.
   - Handles malformed inputs and slash normalization.

3. Added server-only secret utility in `nextjs-migration/src/lib/server-secrets.ts`:
   - Uses `server-only` guard to prevent accidental client inclusion.
   - Provides `getServerSecret`, `requireServerSecret`, `hasAnyServerSecret`.
   - Supports optional secret keys: `API_SERVICE_TOKEN`, `OPENAI_API_KEY`.

4. Wired runtime config usage into UI shell (`nextjs-migration/src/app/page.tsx`):
   - Displays resolved API base URL, proving config path is active.

5. Updated env contract docs (`nextjs-migration/.env.example`):
   - Added optional runtime knobs for base path/API/secrets.

## Verification
- `cd nextjs-migration && npm run -s lint` -> pass.
- `cd nextjs-migration && npm run -s build` -> pass.
- `cd nextjs-migration && npm run -s test -- --list` -> pass (test discovery).
- Defensive env smoke: `NEXTJS_BASE_PATH='https://example.com/bad/' NEXT_PUBLIC_API_BASE_URL=' //api//v1/ ' npm run -s build` -> pass.

## Resulting Behavior
- Invalid base-path inputs no longer risk build failure from malformed config.
- API base URL now has deterministic fallback and normalization behavior.
- Secret access is centralized and intentionally server-only.
