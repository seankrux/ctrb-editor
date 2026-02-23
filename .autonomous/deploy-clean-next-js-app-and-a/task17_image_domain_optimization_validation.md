# Task 17 - Image/domain optimization validation

## Scope
Confirm image optimization settings are valid for all remote image sources used by the app and harden config to avoid accidental remote-image expansion.

## Audit Findings
- No `next/image` usage was found in active source routes/components.
- No remote image URLs are currently rendered by app UI components.
- Existing app route content includes only a standard external link (`https://github.com/...`), not image fetch/render paths.

## Changes Applied
Updated `nextjs-migration/next.config.mjs` with explicit image policy:
- `images.remotePatterns: []` (no remote hosts allowed)
- `images.formats: ['image/avif', 'image/webp']`
- `images.dangerouslyAllowSVG: false`
- `images.contentDispositionType: 'attachment'`
- `images.contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"`

## Verification
Commands run:
- `cd nextjs-migration && npm run -s lint`
- `cd nextjs-migration && npm run -s build`
- `cd nextjs-migration && npm run -s test -- --list`

Results:
- Lint: pass
- Build: pass (routes include `/`, `/_not-found`, `/robots.txt`, `/sitemap.xml`)
- Test discovery: pass (`15 tests in 1 file`)

## Outcome
Image/domain optimization behavior is now explicit and locked down for current app scope. Any future remote image dependency will require intentional config changes.
