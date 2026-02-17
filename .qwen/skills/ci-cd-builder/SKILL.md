# ⚙️ CI/CD Builder Skill

## Purpose
**FIXES:** No automated testing/deployment workflows

Generate GitHub Actions workflows for lint, test, build, and deploy automation.

---

## 🎯 When to Activate

### Auto-Activate Triggers
```
User says:
- "add CI/CD" / "set up GitHub Actions"
- "auto-deploy" / "deploy on push"
- "run tests on PR"

Context triggers:
- After github-wizard creates repo
- User mentions "production" or "deployment"
- Project ready for automation
```

---

## 📋 Workflow Templates

### Standard CI Workflow
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      - run: bun install
      - run: bun run lint

  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run test --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        if: success()

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: .next/
```

### Deploy to Vercel
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy-preview:
    name: Deploy Preview
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    environment: Preview
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--preview'

  deploy-production:
    name: Deploy Production
    if: github.event_name == 'push'
    runs-on: ubuntu-latest
    environment: Production
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🎮 User Commands

| Command | Action |
|---------|--------|
| `"add CI/CD"` | Generate standard workflows |
| `"add deploy"` | Add deployment workflow |
| `"add tests"` | Add test workflow only |
| `"configure secrets"` | Guide through secret setup |
| `"show workflows"` | Display current workflows |

---

## ✅ Success Criteria

CI/CD successful when:
- [ ] Workflows created in .github/workflows/
- [ ] Required secrets documented
- [ ] First workflow run successful
- [ ] PR shows status checks
- [ ] Deploy happens on merge
