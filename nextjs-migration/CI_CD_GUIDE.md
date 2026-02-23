# 🔄 CI/CD Guide - Automated Testing

## Overview

Automated testing pipeline for CTRBooster Nebula Next.js application.

### 🎯 What Gets Tested

| Workflow | Triggers | Tests |
|----------|----------|-------|
| **CI** | Push/PR to main/develop | Lint, Type Check, Build |
| **E2E Tests** | Push/PR to main/develop | Full Playwright suite (5 browsers) |
| **Smoke Tests** | Deployment success | Critical paths on production |

---

## 📁 Workflow Files

### `.github/workflows/ci.yml`
**Purpose:** Code quality and build validation

**Triggers:**
- Push to `main` or `develop`
- Pull requests to `main` or `develop`
- Only for changes in `nextjs-migration/`

**Jobs:**
1. **Lint** - ESLint validation
2. **Type Check** - TypeScript compilation
3. **Build** - Next.js production build

### `.github/workflows/e2e-tests.yml`
**Purpose:** End-to-end testing with Playwright

**Triggers:**
- Push to `main` or `develop`
- Pull requests to `main` or `develop`
- Manual trigger via GitHub Actions UI

**Jobs:**
1. **E2E Tests** - Full test suite on 5 browsers
   - Chromium (Desktop)
   - Firefox (Desktop)
   - WebKit (Desktop Safari)
   - Mobile Chrome (Pixel 5)
   - Mobile Safari (iPhone 12)

### `.github/workflows/smoke-tests.yml`
**Purpose:** Production deployment verification

**Triggers:**
- Vercel deployment success
- Manual trigger with environment selection

**Jobs:**
1. **Smoke Tests** - Critical paths on deployed URL

---

## 🚀 How It Works

### On Every Code Push

```
1. Code pushed to GitHub
        ↓
2. GitHub Actions triggered
        ↓
3. CI Workflow runs:
   ├── Lint (ESLint)
   ├── Type Check (TypeScript)
   └── Build (Next.js)
        ↓
4. E2E Workflow runs:
   ├── Install dependencies
   ├── Install Playwright browsers
   ├── Build app
   └── Run tests (5 browsers)
        ↓
5. Results posted to PR/Commit
```

### On Vercel Deployment

```
1. Vercel deployment completes
        ↓
2. deployment_status webhook fires
        ↓
3. Smoke Tests workflow runs
        ↓
4. Tests run against production URL
        ↓
5. Results uploaded as artifacts
```

---

## 📊 Test Results

### Where to Find Results

**GitHub Actions Tab:**
```
https://github.com/seankrux/CTRB-editor/actions
```

**Artifacts:**
- `playwright-report/` - HTML test report (30 days)
- `test-results/` - Failure screenshots/videos (30 days)
- `nextjs-build/` - Build artifacts (7 days)

### Test Report Format

After tests complete:
1. Go to workflow run
2. Download `playwright-report` artifact
3. Extract and open `index.html`
4. View detailed results with screenshots

---

## 🏷️ Test Tags

Tests are tagged for selective execution:

| Tag | Purpose | When Runs |
|-----|---------|-----------|
| `@smoke` | Critical paths | Production deployments |
| `@critical` | Must-pass tests | All CI runs |
| (no tag) | Full suite | Local/PR testing |

### Example Tagged Test

```typescript
test('@smoke @critical home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/CTRBooster/);
});
```

---

## 🔧 Manual Triggers

### Run E2E Tests Manually

1. Go to **Actions** tab
2. Select **E2E Tests - Playwright**
3. Click **Run workflow**
4. Select branch
5. Click **Run workflow**

### Run Smoke Tests Manually

1. Go to **Actions** tab
2. Select **Smoke Tests - Production**
3. Click **Run workflow**
4. Select environment (production/preview)
5. Click **Run workflow**

---

## 📈 Status Badges

Add to README.md:

```markdown
## CI/CD Status

[![CI](https://github.com/seankrux/CTRB-editor/actions/workflows/ci.yml/badge.svg)](https://github.com/seankrux/CTRB-editor/actions/workflows/ci.yml)
[![E2E Tests](https://github.com/seankrux/CTRB-editor/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/seankrux/CTRB-editor/actions/workflows/e2e-tests.yml)
[![Smoke Tests](https://github.com/seankrux/CTRB-editor/actions/workflows/smoke-tests.yml/badge.svg)](https://github.com/seankrux/CTRB-editor/actions/workflows/smoke-tests.yml)
```

---

## 🐛 Troubleshooting

### Tests Failing on CI

**Check:**
1. Test artifacts for screenshots/videos
2. Console logs in workflow run
3. Playwright report HTML

**Common Issues:**
- **Timeout:** Increase timeout in playwright.config.ts
- **Element not found:** Check selectors, add waits
- **Build fails:** Check package-lock.json sync

### Flaky Tests

**Fix:**
```typescript
// Add retry logic
test('flaky test', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  // Add explicit waits
  await expect(page.locator('body')).toBeVisible({ timeout: 5000 });
});
```

### Browser Installation Fails

**Fix:**
```bash
# Install with system dependencies
npx playwright install --with-deps
```

---

## 🎯 Best Practices

### Writing Tests

✅ **Do:**
- Use `@smoke` tag for critical paths
- Add explicit waits for dynamic content
- Use data-testid for stable selectors
- Keep tests independent and isolated

❌ **Don't:**
- Rely on test execution order
- Share state between tests
- Use brittle CSS selectors
- Skip error handling

### CI Configuration

✅ **Do:**
- Cache dependencies (npm, Playwright)
- Use concurrency to cancel duplicates
- Upload artifacts for debugging
- Set appropriate timeouts

❌ **Don't:**
- Run tests in parallel on CI (use workers: 1)
- Skip browser installation step
- Forget to set CI environment variable

---

## 📊 Performance Metrics

### Expected CI Run Times

| Workflow | Duration | Frequency |
|----------|----------|-----------|
| CI (Lint+Build) | 2-3 min | Every push/PR |
| E2E Tests | 5-10 min | Every push/PR |
| Smoke Tests | 2-3 min | After deployment |

### Optimization Tips

1. **Cache Dependencies:**
   ```yaml
   - uses: actions/setup-node@v4
     with:
       cache: 'npm'
   ```

2. **Parallel Jobs:**
   ```yaml
   strategy:
     matrix:
       browser: [chromium, firefox, webkit]
   ```

3. **Selective Testing:**
   ```yaml
   paths:
     - 'nextjs-migration/**'
   ```

---

## 🔗 Integration with Vercel

### Automatic Deployment Status

Vercel automatically reports deployment status to GitHub:

1. **deployment_start** - Build starting
2. **deployment_success** - Build complete
3. **deployment_failure** - Build failed

Smoke tests trigger on `deployment_success`.

### GitHub Status Checks

After PR or push, you'll see:
- ✅ CI - Lint, Build & Test
- ✅ E2E Tests - Playwright
- ✅ Smoke Tests - Production (after deploy)

---

## 📝 Configuration Files

### playwright.config.ts

```typescript
export default defineConfig({
  testDir: './tests/e2e',
  retries: process.env.CI ? 2 : 0,  // Retry on CI
  workers: process.env.CI ? 1 : undefined,  // Single worker on CI
  reporter: [['html', { outputFolder: 'playwright-report' }]],
  use: {
    baseURL: productionUrl || 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
```

### ci.yml

```yaml
name: CI - Lint, Build & Test
on:
  push:
    branches: [main, develop]
    paths:
      - 'nextjs-migration/**'
```

---

## 🎉 Success Criteria

### CI Pipeline Passes When:
- [ ] ESLint: No errors
- [ ] TypeScript: No type errors
- [ ] Build: Completes successfully

### E2E Pipeline Passes When:
- [ ] All 30 tests pass on all 5 browsers
- [ ] No flaky failures
- [ ] Performance within limits

### Smoke Tests Pass When:
- [ ] Critical paths work on production
- [ ] No regressions detected
- [ ] API endpoints respond

---

## 📞 Support

**Documentation:**
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Playwright Docs](https://playwright.dev)
- [Vercel Deployments](https://vercel.com/docs/deployments)

**Workflow Logs:**
```
https://github.com/seankrux/CTRB-editor/actions
```

---

**Last Updated:** 2026-02-24  
**Status:** ✅ Active and Running
