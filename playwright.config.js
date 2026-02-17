// Playwright config for CTRBooster V4 tests
module.exports = {
  testDir: './',
  testMatch: 'ctrb_v4_tests.js',
  
  // Use WebKit browser (Safari engine)
  projects: [
    {
      name: 'webkit',
      use: {
        browserName: 'webkit',
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
  
  // Reporter options
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  
  // Timeout per test
  timeout: 15000,
  
  // Retry failed tests
  retries: 1,
  
  // Run tests in parallel
  workers: 1, // Single worker for local file tests
  
  // Output directory for screenshots/videos
  outputDir: 'test-results',
  
  // Use local HTTP server
  use: {
    baseURL: 'http://localhost:8080/',
  },
};
