---
title: CI/CD Workflow Specification - E2E Tests Playwright
version: 1.0
date_created: 2026-08-23
last_updated: 2026-08-23
owner: seankrux
tags: [process, cicd, github-actions, ctrb-editor, playwright]
---

## Workflow Overview

**Purpose**: Build the Next.js migration app and run Playwright.
**Trigger Events**: Push/PR to main/develop on `nextjs-migration/**`; manual dispatch.

## Jobs & Dependencies

| Job Name | Purpose | Dependencies | Execution Context |
|---|---|---|---|
| test | Build + Playwright | none | ubuntu-latest, Node 18 |

## Requirements Matrix

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| REQ-001 | Browsers installed with OS deps | High | playwright install --with-deps |
| REQ-002 | Reports on always / logs on failure | Medium | artifacts retained 30 days |

## Known gap

Depends on `nextjs-migration/`, which is absent on `main`.

## Change Management

| Version | Date | Changes | Author |
|---|---|---|---|
| 1.0 | 2026-08-23 | Initial specification | fleet audit |
