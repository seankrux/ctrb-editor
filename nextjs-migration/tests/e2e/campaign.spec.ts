import { expect, test } from '@playwright/test';

test.describe('Next.js Shell Smoke', () => {
  test('renders deployment-ready shell', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'CTRBooster Nebula' })).toBeVisible();
    await expect(page.getByText('Next.js Deployment Ready')).toBeVisible();
  });

  test('toggles theme mode', async ({ page }) => {
    await page.goto('/');

    const root = page.locator('html');
    const before = await root.evaluate((node) => node.classList.contains('dark'));

    await page.getByRole('button', { name: /dark mode|light mode/i }).click();

    const after = await root.evaluate((node) => node.classList.contains('dark'));
    expect(after).toBe(!before);
  });

  test('shows normalized API base URL', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('API base URL:')).toBeVisible();
    await expect(page.getByText('/api')).toBeVisible();
  });

  test('renders 404 fallback page', async ({ page }) => {
    await page.goto('/missing-route-for-smoke-check');
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  });

  test('returns health API payload', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.ok()).toBe(true);

    const payload = (await response.json()) as { ok: boolean; service: string };
    expect(payload.ok).toBe(true);
    expect(payload.service).toBe('ctrbooster-nebula-shell');
  });

  test('returns preview stub campaign payload', async ({ request }) => {
    const response = await request.get('/api/campaigns');
    expect(response.ok()).toBe(true);

    const payload = (await response.json()) as {
      source: string;
      campaigns: Array<{ id: string }>;
    };
    expect(payload.source).toBe('preview-stub');
    expect(payload.campaigns.length).toBeGreaterThan(0);
  });
});
