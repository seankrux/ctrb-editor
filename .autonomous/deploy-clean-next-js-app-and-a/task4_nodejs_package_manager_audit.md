# Task 4: Node.js and package-manager audit

## Scope
- Target app: `nextjs-migration/`
- Files reviewed: `nextjs-migration/package.json`, `nextjs-migration/package-lock.json`

## Findings
1. `nextjs-migration/package.json` already defines deterministic package-manager metadata:
   - `packageManager`: `npm@10.9.4`
   - `engines`: `node >=18.17.0`, `npm >=10.0.0`
2. `nextjs-migration/package-lock.json` exists and uses `lockfileVersion: 3`.
3. `package-lock` currently encodes matching root metadata (`engines` in the top-level package section).
4. No alternate lockfiles (`pnpm-lock.yaml`, `yarn.lock`) exist under `nextjs-migration`.
5. There was no app-local Node version file (`.nvmrc`) or npm strictness config before this change, which made reproducible local setup less deterministic even though package metadata was present.

## Applied hardening
1. Added `nextjs-migration/.nvmrc` with:
   - `18.17.0`
2. Added `nextjs-migration/.npmrc` with:
   - `engine-strict=true`

## Validation notes
- Post-change validation remains consistent with existing app constraints from Task 3 baseline:
  - Node/NPM engine constraints are explicit in `package.json`.
  - Lockfile is present and at v3.
- Additional verification was performed by executing a local build after toolchain changes to ensure no runtime/tooling regression.

## Risk / follow-up
- Keeping `engines` as a minimum constraint preserves compatibility across supported Node 18+ runtimes while `.nvmrc` provides a concrete local baseline for contributors.
- Optional follow-up for future hardening: document Node/NPM baselines in deployment-specific docs (`DEPLOYMENT.md`) and align CI images to the same versions.
