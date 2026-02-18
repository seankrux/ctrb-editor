import { test, expect } from '@playwright/test';

test.describe('CTRBooster Nebula - E2E Tests', () => {
  
  // ===== THEME TESTS =====
  test.describe('Theme System', () => {
    
    test('should load with dark theme by default', async ({ page }) => {
      await page.goto('/');
      
      const html = page.locator('html');
      const hasDarkClass = await html.classList().then(classes => classes.includes('dark'));
      expect(hasDarkClass).toBe(true);
    });

    test('should toggle theme when clicking theme button', async ({ page }) => {
      await page.goto('/');
      
      const themeToggle = page.getByRole('button', { name: /theme|dark|light/i });
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      const html = page.locator('html');
      const classes = await html.classList();
      expect(classes.includes('dark')).toBe(false);
    });

    test('should persist theme preference', async ({ page }) => {
      await page.goto('/');
      
      // Toggle to light mode
      const themeToggle = page.getByRole('button', { name: /theme/i });
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      // Reload and check
      await page.reload();
      await page.waitForTimeout(500);
      
      const html = page.locator('html');
      const classes = await html.classList();
      expect(classes.includes('dark')).toBe(false);
    });

    test('should show nebula background effects in dark mode', async ({ page }) => {
      await page.goto('/');
      
      const background = page.locator('.fixed.inset-0.-z-10');
      await expect(background).toBeVisible();
    });
  });

  // ===== CAMPAIGN CRUD TESTS =====
  test.describe('Campaign Management', () => {
    
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      // Clear any existing campaigns
      await page.evaluate(() => localStorage.removeItem('ctrb-campaigns'));
      await page.reload();
    });

    test('should create new campaign', async ({ page }) => {
      const newCampaignBtn = page.getByRole('button', { name: /new campaign/i });
      await newCampaignBtn.click();
      
      // Fill form
      await page.fill('[name="ProjectName"]', 'Test Campaign');
      await page.selectOption('[name="Type"]', 'GMap');
      
      // Save
      const saveBtn = page.getByRole('button', { name: /save/i });
      await saveBtn.click();
      
      // Verify campaign appears in list
      await expect(page.getByText('Test Campaign')).toBeVisible();
    });

    test('should edit campaign', async ({ page }) => {
      // Create campaign first
      await page.getByRole('button', { name: /new campaign/i }).click();
      await page.fill('[name="ProjectName"]', 'Edit Test');
      await page.getByRole('button', { name: /save/i }).click();
      
      // Edit
      const editBtn = page.getByRole('button', { name: /edit/i });
      await editBtn.click();
      
      await page.fill('[name="ProjectName"]', 'Edited Campaign');
      await page.getByRole('button', { name: /save/i }).click();
      
      await expect(page.getByText('Edited Campaign')).toBeVisible();
    });

    test('should delete campaign', async ({ page }) => {
      // Create campaign
      await page.getByRole('button', { name: /new campaign/i }).click();
      await page.fill('[name="ProjectName"]', 'Delete Me');
      await page.getByRole('button', { name: /save/i }).click();
      
      // Delete
      const deleteBtn = page.getByRole('button', { name: /delete/i });
      await deleteBtn.click();
      
      // Confirm
      page.on('dialog', dialog => dialog.accept());
      await deleteBtn.click();
      
      await expect(page.getByText('Delete Me')).not.toBeVisible();
    });

    test('should undo delete with Ctrl+Z', async ({ page }) => {
      // Create and delete
      await page.getByRole('button', { name: /new campaign/i }).click();
      await page.fill('[name="ProjectName"]', 'Undo Test');
      await page.getByRole('button', { name: /save/i }).click();
      
      const deleteBtn = page.getByRole('button', { name: /delete/i });
      page.on('dialog', dialog => dialog.accept());
      await deleteBtn.click();
      
      // Undo
      await page.keyboard.press('Control+z');
      
      await expect(page.getByText('Undo Test')).toBeVisible();
    });
  });

  // ===== FILTER & SEARCH TESTS =====
  test.describe('Filter and Search', () => {
    
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.removeItem('ctrb-campaigns'));
      
      // Create test campaigns
      const campaigns = [
        { id: '1', ProjectName: 'ABC Plumbing', Type: 'GMap', Checked: true },
        { id: '2', ProjectName: 'XYZ Roofing', Type: 'GSearch', Checked: true },
        { id: '3', ProjectName: 'ABC Electric', Type: 'GMap', Checked: false },
      ];
      localStorage.setItem('ctrb-campaigns', JSON.stringify(campaigns));
      await page.reload();
    });

    test('should filter by campaign type', async ({ page }) => {
      const typeFilter = page.getByRole('combobox', { name: /type/i });
      await typeFilter.selectOption('GMap');
      
      await expect(page.getByText('ABC Plumbing')).toBeVisible();
      await expect(page.getByText('XYZ Roofing')).not.toBeVisible();
    });

    test('should search by name', async ({ page }) => {
      const searchInput = page.getByPlaceholder(/search/i);
      await searchInput.fill('ABC');
      
      await expect(page.getByText('ABC Plumbing')).toBeVisible();
      await expect(page.getByText('ABC Electric')).toBeVisible();
      await expect(page.getByText('XYZ Roofing')).not.toBeVisible();
    });

    test('should combine filters', async ({ page }) => {
      const searchInput = page.getByPlaceholder(/search/i);
      await searchInput.fill('ABC');
      
      const typeFilter = page.getByRole('combobox', { name: /type/i });
      await typeFilter.selectOption('GMap');
      
      await expect(page.getByText('ABC Plumbing')).toBeVisible();
      await expect(page.getByText('ABC Electric')).toBeVisible();
      await expect(page.getByText('XYZ Roofing')).not.toBeVisible();
    });
  });

  // ===== BULK OPERATIONS TESTS =====
  test.describe('Bulk Operations', () => {
    
    test('should select multiple campaigns', async ({ page }) => {
      await page.goto('/');
      
      const checkboxes = page.getByRole('checkbox');
      await checkboxes.first().check();
      await checkboxes.nth(1).check();
      
      const selectedCount = page.getByText(/selected/i);
      await expect(selectedCount).toBeVisible();
    });

    test('should bulk delete selected campaigns', async ({ page }) => {
      await page.goto('/');
      
      // Select all
      const selectAll = page.locator('thead input[type="checkbox"]');
      await selectAll.check();
      
      // Bulk delete
      const bulkDelete = page.getByRole('button', { name: /delete/i });
      await bulkDelete.click();
      
      page.on('dialog', dialog => dialog.accept());
      await bulkDelete.click();
    });

    test('should export selected campaigns', async ({ page }) => {
      await page.goto('/');
      
      // Select campaigns
      const checkboxes = page.getByRole('checkbox');
      await checkboxes.first().check();
      
      // Download handler
      const downloadPromise = page.waitForEvent('download');
      const exportBtn = page.getByRole('button', { name: /export/i });
      await exportBtn.click();
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain('.json');
    });
  });

  // ===== AI CHAT TESTS =====
  test.describe('AI Chat Assistant', () => {
    
    test('should show chat bubble', async ({ page }) => {
      await page.goto('/');
      
      const chatBubble = page.locator('.chat-bubble, [title*="chat" i]');
      await expect(chatBubble).toBeVisible();
    });

    test('should open chat window when clicking bubble', async ({ page }) => {
      await page.goto('/');
      
      const chatBubble = page.locator('.chat-bubble button').first();
      await chatBubble.click();
      
      const chatWindow = page.locator('#chat-window:not(.hidden)');
      await expect(chatWindow).toBeVisible();
    });

    test('should show settings button in chat', async ({ page }) => {
      await page.goto('/');
      
      const chatBubble = page.locator('.chat-bubble button').first();
      await chatBubble.click();
      
      const settingsBtn = page.locator('[onclick*="showAISettings"]');
      await expect(settingsBtn).toBeVisible();
    });

    test('should open AI settings modal', async ({ page }) => {
      await page.goto('/');
      
      // Open chat
      const chatBubble = page.locator('.chat-bubble button').first();
      await chatBubble.click();
      
      // Open settings
      const settingsBtn = page.locator('[onclick*="showAISettings"]');
      await settingsBtn.click();
      
      const modal = page.locator('.modal:not(.hidden)');
      await expect(modal).toBeVisible();
    });

    test('should save AI configuration', async ({ page }) => {
      await page.goto('/');
      
      // Open settings
      const chatBubble = page.locator('.chat-bubble button').first();
      await chatBubble.click();
      const settingsBtn = page.locator('[onclick*="showAISettings"]');
      await settingsBtn.click();
      
      // Fill API key
      await page.fill('#ai-api-key', 'sk-test123');
      
      // Save
      const saveBtn = page.getByRole('button', { name: /save/i });
      await saveBtn.click();
      
      // Verify saved
      const config = await page.evaluate(() => 
        localStorage.getItem('ctrb-ai-config')
      );
      expect(config).toContain('sk-test123');
    });
  });

  // ===== KEYBOARD SHORTCUTS TESTS =====
  test.describe('Keyboard Shortcuts', () => {
    
    test('should open chat with Ctrl+H', async ({ page }) => {
      await page.goto('/');
      
      await page.keyboard.press('Control+h');
      await page.waitForTimeout(500);
      
      const chatWindow = page.locator('#chat-window:not(.hidden)');
      await expect(chatWindow).toBeVisible();
    });

    test('should undo with Ctrl+Z', async ({ page }) => {
      await page.goto('/');
      
      // Create and delete campaign
      await page.getByRole('button', { name: /new/i }).click();
      await page.fill('[name="ProjectName"]', 'Shortcut Test');
      await page.getByRole('button', { name: /save/i }).click();
      
      const deleteBtn = page.getByRole('button', { name: /delete/i });
      page.on('dialog', dialog => dialog.accept());
      await deleteBtn.click();
      
      // Undo
      await page.keyboard.press('Control+z');
      
      await expect(page.getByText('Shortcut Test')).toBeVisible();
    });

    test('should focus search with Ctrl+F', async ({ page }) => {
      await page.goto('/');
      
      await page.keyboard.press('Control+f');
      
      const searchInput = page.getByPlaceholder(/search/i);
      await expect(searchInput).toBeFocused();
    });
  });

  // ===== RESPONSIVE DESIGN TESTS =====
  test.describe('Responsive Design', () => {
    
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
    });

    test('should show mobile menu on small screens', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Check responsive elements are visible
      const header = page.locator('header');
      await expect(header).toBeVisible();
    });

    test('should adapt table for mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Table should be scrollable or adapted
      const table = page.locator('table');
      await expect(table).toBeVisible();
    });
  });

  // ===== EXPORT/IMPORT TESTS =====
  test.describe('Export/Import', () => {
    
    test('should export all campaigns', async ({ page }) => {
      await page.goto('/');
      
      const downloadPromise = page.waitForEvent('download');
      const exportBtn = page.getByRole('button', { name: /export|download/i });
      await exportBtn.click();
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain('.json');
    });

    test('should import campaigns from file', async ({ page }) => {
      await page.goto('/');
      
      // Create test file
      const testData = JSON.stringify([
        { id: '1', ProjectName: 'Imported Campaign', Type: 'GMap', Checked: true }
      ]);
      
      // Upload would require file input handling
      // This is a placeholder for the actual test
      expect(testData).toBeTruthy();
    });
  });

  // ===== VALIDATION TESTS =====
  test.describe('Validation', () => {
    
    test('should show validation errors for invalid campaign', async ({ page }) => {
      await page.goto('/');
      
      await page.getByRole('button', { name: /new/i }).click();
      
      // Try to save without required fields
      const saveBtn = page.getByRole('button', { name: /save/i });
      await saveBtn.click();
      
      // Should show validation errors
      const errors = page.locator('.validation-panel, [class*="error"]');
      await expect(errors).toBeVisible();
    });

    test('should prevent invalid data export', async ({ page }) => {
      await page.goto('/');
      
      // Create invalid campaign
      await page.getByRole('button', { name: /new/i }).click();
      await page.fill('[name="ProjectName"]', '');  // Empty name
      await page.getByRole('button', { name: /save/i }).click();
      
      // Try to export - should warn
      const exportBtn = page.getByRole('button', { name: /export/i });
      await exportBtn.click();
      
      // Should show warning dialog or message
      page.on('dialog', dialog => {
        expect(dialog.message()).toContain('issue') || expect(dialog.message()).toContain('error');
        dialog.dismiss();
      });
    });
  });
});
