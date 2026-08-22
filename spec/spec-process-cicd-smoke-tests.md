---
title: CI/CD Workflow Specification - Smoke Tests Production
version: 1.0
date_created: 2026-08-23
last_updated: 2026-08-23
owner: seankrux
tags: [process, cicd, github-actions, ctrb-editor, smoke]
---

## Workflow Overview

**Purpose**: Run `@smoke` Playwright tests against a live deployment URL.
**Trigger Events**: Successful `deployment_status`; manual dispatch with production/preview choice.
**Target Environments**: Live Vercel URL or dispatch-selected environment.

## Jobs & Dependencies

| Job Name | Purpose | Dependencies | Execution Context |
|---|---|---|---|
| smoke-test | Playwright @smoke vs live URL | deployment success or dispatch | ubuntu-latest |

## Requirements Matrix

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| REQ-001 | Skip failed deployments | High | `deployment_status.state == success` |
| REQ-002 | Default production URL fallback | Medium | hardcoded Vercel fallback if event URL missing |

## Known gap

Working directory is `./nextjs-migration`, which is absent on `main`.

## Input/Output Contracts

```yaml
PRODUCTION_URL: string  # deployment environment_url or fallback
```

## Change Management

| Version | Date | Changes | Author |
|---|---|---|---|
| 1.0 | 2026-08-23 | Initial specification | fleet audit |
