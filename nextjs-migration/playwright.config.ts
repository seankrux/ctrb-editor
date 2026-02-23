// Playwright Test Configuration
import { defineConfig, devices } from '@playwright/test';

const isCI = process.env.CI === 'true';
const productionUrl = process.env.PRODUCTION_URL;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: !isCI,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'playwright-report' }]],
  outputDir: 'test-results',
  use: {
    baseURL: productionUrl || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Smoke tests run on production deployments
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      grep: productionUrl ? /@smoke|@critical/ : /.*/,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      grep: productionUrl ? /@smoke|@critical/ : /.*/,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      grep: productionUrl ? /@smoke|@critical/ : /.*/,
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
      grep: productionUrl ? /@smoke|@critical/ : /.*/,
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
      grep: productionUrl ? /@smoke|@critical/ : /.*/,
    },
  ],

  // Only start dev server for local/CI testing, not production tests
  webServer: productionUrl ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !isCI,
  },
});
