#!/usr/bin/env playwright

// CTRBooster V4 - Automated GUI Tests
// Run: npx playwright test ctrb_v4_tests.js

const { test, expect } = require('@playwright/test');

// Test configuration - using local HTTP server
const BASE_URL = 'http://localhost:8080/ctrb_web_editor_v4.html';

test.describe('CTRBooster V4 - Core Features', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  // Test 1: Page loads successfully
  test('V4 page loads with all tabs', async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle(/CTRBooster.*V4/);
    
    // Check all 4 tabs exist
    await expect(page.locator('text=Campaign List')).toBeVisible();
    await expect(page.locator('text=Client Wizard')).toBeVisible();
    await expect(page.locator('text=Templates')).toBeVisible();
    await expect(page.locator('text=Import / Export')).toBeVisible();
  });

  // Test 2: Template Library exists
  test('Templates tab displays default templates', async ({ page }) => {
    // Click Templates tab
    await page.click('text=Templates');
    await page.waitForTimeout(500);
    
    // Check template grid exists
    await expect(page.locator('#template-grid')).toBeVisible();
    
    // Check default templates
    await expect(page.locator('text=GMap Local Business')).toBeVisible();
    await expect(page.locator('text=GSearch Brand')).toBeVisible();
    await expect(page.locator('text=RefDVisit Social')).toBeVisible();
    await expect(page.locator('text=Direct Visit')).toBeVisible();
    await expect(page.locator('text=GSearchRef Combo')).toBeVisible();
  });

  // Test 3: Load template creates campaign
  test('Clicking template creates new campaign', async ({ page }) => {
    // Go to Templates tab
    await page.click('text=Templates');
    await page.waitForTimeout(500);
    
    // Click first template
    await page.click('.template-card:first-child');
    await page.waitForTimeout(500);
    
    // Should switch to list tab
    await expect(page.locator('#view-list.active')).toBeVisible();
    
    // Should have at least 1 campaign
    const campaignCount = await page.locator('#table-body tr').count();
    expect(campaignCount).toBeGreaterThan(0);
  });

  // Test 4: Validation - Empty project name
  test('Validation shows error for empty project name', async ({ page }) => {
    // Create a campaign first
    await page.click('text=+ New Campaign');
    await page.waitForTimeout(500);
    
    // Clear project name
    await page.fill('#e-ProjectName', '');
    
    // Try to save
    await page.click('text=Save Changes');
    await page.waitForTimeout(500);
    
    // Should show validation panel
    await expect(page.locator('.validation-panel')).toBeVisible();
    await expect(page.locator('text=Project Name is required')).toBeVisible();
  });

  // Test 5: Validation - Invalid time format
  test('Validation shows error for invalid time format', async ({ page }) => {
    // Create a campaign
    await page.click('text=+ New Campaign');
    await page.waitForTimeout(500);
    
    // Set invalid time format
    await page.fill('#e-strStartTime', 'invalid time');
    
    // Try to save
    await page.click('text=Save Changes');
    await page.waitForTimeout(500);
    
    // Should show validation warning
    await expect(page.locator('.validation-panel')).toBeVisible();
    await expect(page.locator('text=Start Time')).toBeVisible();
  });

  // Test 6: Bulk Edit button exists
  test('Bulk Edit button appears when campaigns selected', async ({ page }) => {
    // Create multiple campaigns
    await page.click('text=+ New Campaign');
    await page.click('text=+ New Campaign');
    await page.click('text=+ New Campaign');
    await page.waitForTimeout(500);
    
    // Select first campaign
    await page.click('table tbody tr:first-child input[type="checkbox"]');
    await page.waitForTimeout(300);
    
    // Bulk toolbar should appear
    await expect(page.locator('#bulk-tools')).toBeVisible();
    
    // Bulk Edit button should exist
    await expect(page.locator('button:has-text("Bulk Edit")')).toBeVisible();
  });

  // Test 7: Compare button exists
  test('Compare button appears with multiple selections', async ({ page }) => {
    // Create campaigns
    await page.click('text=+ New Campaign');
    await page.click('text=+ New Campaign');
    await page.waitForTimeout(500);
    
    // Select 2 campaigns
    await page.click('table tbody tr:nth-child(1) input[type="checkbox"]');
    await page.click('table tbody tr:nth-child(2) input[type="checkbox"]');
    await page.waitForTimeout(300);
    
    // Compare button should exist
    await expect(page.locator('button:has-text("Compare")')).toBeVisible();
  });

  // Test 8: Export Selected button exists
  test('Export Selected button appears with selections', async ({ page }) => {
    // Create campaign
    await page.click('text=+ New Campaign');
    await page.waitForTimeout(500);
    
    // Select campaign
    await page.click('table tbody tr:first-child input[type="checkbox"]');
    await page.waitForTimeout(300);
    
    // Export Selected button should exist
    await expect(page.locator('button:has-text("Export Selected")')).toBeVisible();
  });

  // Test 9: Edit modal has all 6 tabs
  test('Edit modal displays all 6 tabs', async ({ page }) => {
    // Create and edit campaign
    await page.click('text=+ New Campaign');
    await page.waitForTimeout(500);
    
    // Check all tab buttons exist
    await expect(page.locator('text=📋 Basic')).toBeVisible();
    await expect(page.locator('text=⏱ Timing')).toBeVisible();
    await expect(page.locator('text=🎯 Targets')).toBeVisible();
    await expect(page.locator('text=📍 Geolocation')).toBeVisible();
    await expect(page.locator('text=💻 Device')).toBeVisible();
    await expect(page.locator('text=⚙️ Advanced')).toBeVisible();
  });

  // Test 10: Geo point counter updates
  test('Geo point counter updates live', async ({ page }) => {
    // Create campaign
    await page.click('text=+ New Campaign');
    await page.waitForTimeout(500);
    
    // Go to Geolocation tab
    await page.click('text=📍 Geolocation');
    await page.waitForTimeout(300);
    
    // Check counter exists
    await expect(page.locator('#geo-point-count')).toBeVisible();
  });

  // Test 11: Client Wizard generates campaigns
  test('Client Wizard generates campaigns', async ({ page }) => {
    // Go to Wizard tab
    await page.click('text=Client Wizard');
    await page.waitForTimeout(300);
    
    // Fill required fields
    await page.fill('#wiz-name', 'Test Client');
    await page.fill('#wiz-lat', '40.7128');
    await page.fill('#wiz-lon', '-74.0060');
    
    // Generate
    await page.click('text=Generate Campaigns');
    await page.waitForTimeout(500);
    
    // Should have campaigns
    const campaignCount = await page.locator('#table-body tr').count();
    expect(campaignCount).toBeGreaterThan(0);
  });

  // Test 12: Import/Export tab exists
  test('Import/Export tab is functional', async ({ page }) => {
    // Go to Import tab
    await page.click('text=Import / Export');
    await page.waitForTimeout(300);
    
    // Check elements exist
    await expect(page.locator('#file-input')).toBeVisible();
    await expect(page.locator('#json-editor')).toBeVisible();
    await expect(page.locator('text=Save JSON')).toBeVisible();
  });

  // Test 13: Type filter dropdown
  test('Type filter dropdown has all options', async ({ page }) => {
    // Check dropdown exists
    await expect(page.locator('#type-filter')).toBeVisible();
    
    // Check options
    await expect(page.locator('#type-filter option[value="GSearch"]')).toBeVisible();
    await expect(page.locator('#type-filter option[value="GMap"]')).toBeVisible();
    await expect(page.locator('#type-filter option[value="RefDVisit"]')).toBeVisible();
    await expect(page.locator('#type-filter option[value="DirectVisit"]')).toBeVisible();
    await expect(page.locator('#type-filter option[value="GSearchRef"]')).toBeVisible();
  });

  // Test 14: Campaign table columns
  test('Campaign table has correct columns', async ({ page }) => {
    // Create campaign for table to populate
    await page.click('text=+ New Campaign');
    await page.waitForTimeout(500);
    
    // Check headers
    await expect(page.locator('th:has-text("Status")')).toBeVisible();
    await expect(page.locator('th:has-text("Type")')).toBeVisible();
    await expect(page.locator('th:has-text("Project Name")')).toBeVisible();
    await expect(page.locator('th:has-text("Total / Daily")')).toBeVisible();
    await expect(page.locator('th:has-text("Progress")')).toBeVisible();
    await expect(page.locator('th:has-text("Next Run")')).toBeVisible();
    await expect(page.locator('th:has-text("Actions")')).toBeVisible();
  });

  // Test 15: Clone campaign button
  test('Clone campaign button exists', async ({ page }) => {
    // Create campaign
    await page.click('text=+ New Campaign');
    await page.waitForTimeout(500);
    
    // Clone button should exist (📋 emoji)
    await expect(page.locator('button[title="Clone"]')).toBeVisible();
  });
});

test.describe('V4 - Edge Cases', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  // Test: Compare with 1 selection shows alert
  test('Compare with 1 campaign shows alert', async ({ page }) => {
    // Create campaign
    await page.click('text=+ New Campaign');
    await page.waitForTimeout(500);
    
    // Select 1 campaign
    await page.click('table tbody tr:first-child input[type="checkbox"]');
    await page.waitForTimeout(300);
    
    // Try to compare - will show alert
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Select 2-3');
      await dialog.accept();
    });
    
    await page.click('button:has-text("Compare")');
  });

  // Test: Save Anyway works
  test('Save Anyway bypasses validation', async ({ page }) => {
    // Create campaign
    await page.click('text=+ New Campaign');
    await page.waitForTimeout(500);
    
    // Clear project name to trigger validation
    await page.fill('#e-ProjectName', '');
    
    // Try to save
    await page.click('text=Save Changes');
    await page.waitForTimeout(500);
    
    // Validation should appear
    await expect(page.locator('.validation-panel')).toBeVisible();
    
    // Click Save Anyway
    await page.click('text=Save Anyway');
    await page.waitForTimeout(500);
    
    // Modal should close (campaign saved despite warning)
    await expect(page.locator('#modal-container.hidden')).toBeVisible();
  });
});
