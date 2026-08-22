---
title: CI/CD Workflow Specification - Deploy to GitHub Pages
version: 1.0
date_created: 2026-08-23
last_updated: 2026-08-23
owner: seankrux
tags: [process, cicd, github-actions, ctrb-editor, pages]
---

## Workflow Overview

**Purpose**: Publish the v5 static editor HTML as the GitHub Pages site.
**Trigger Events**: Push to `main`; manual dispatch.
**Target Environments**: github-pages.

## Execution Flow Diagram

```mermaid
graph TD
    A[Push main / dispatch] --> B[Copy v5 HTML to _site/index.html]
    B --> C[Upload Pages artifact]
    C --> D[Deploy Pages]
    style A fill:#e1f5fe
    style D fill:#e8f5e8
```

## Jobs & Dependencies

| Job Name | Purpose | Dependencies | Execution Context |
|---|---|---|---|
| deploy | Static Pages publish | none | ubuntu-latest, environment github-pages |

## Requirements Matrix

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| REQ-001 | Least privilege | High | contents:read, pages:write, id-token:write |
| REQ-002 | Source files | High | `ctrb_web_editor_v5.html` and `CAMPAIGN_EXAMPLES.json` |
| REQ-003 | One deploy at a time | High | concurrency group `pages` |

## Secrets & Variables

OIDC via `id-token: write`. No extra secrets.

## Validation Criteria

- VLD-001: Site index is the v5 HTML
- VLD-002: Campaign examples are published beside it

## Change Management

| Version | Date | Changes | Author |
|---|---|---|---|
| 1.0 | 2026-08-23 | Initial specification | fleet audit |
