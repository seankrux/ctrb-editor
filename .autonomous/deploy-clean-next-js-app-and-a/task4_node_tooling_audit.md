# Task 4: Node.js and package-manager settings audit

## Scope
- `package.json` and package-manager settings for the Next.js deployment target in `nextjs-migration/`
- `package-lock.json` behavior and lockfile version expectations
- Environment pinning strategy for reproducible installs

## Findings
- `nextjs-migration/package.json` did not include explicit runtime/tooling constraints.
- The app directory did not have a tracked `package-lock.json` in this session, so dependency behavior was effectively non-deterministic until we validated lock generation.
- A lockfile generation attempt for `nextjs-migration` produced `package-lock.json` with npm lockfile version 3, but this file was intentionally left uncommitted and removed from the working tree for this task to avoid introducing partial lockfile regeneration artifacts.
- `nextjs-migration/.nvmrc` is present and set to `18.17.0`, which is aligned with Next.js 14.x minimum support and avoids unsupported Node majors.
- `package-lock.json` at repository root (for non-app tooling) is lockfileVersion 3 and indicates npm7+ provenance.

## Changes made
- Updated `nextjs-migration/package.json` with:
  - `engines.node: ">=18.17.0"`
  - `engines.npm: ">=10.0.0"`
  - `packageManager: "npm@10.9.4"`

## Validation
- Ran `cd nextjs-migration && npm run -s build` after updates; build and static route generation passed.

## Open notes
- Consider creating and keeping a tracked `nextjs-migration/package-lock.json` in a follow-up task (with network-enabled install) to fully lock dependency trees for CI/CI parity.
