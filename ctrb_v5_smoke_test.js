// CTRBooster V5 - Spreadsheet View Smoke Tests
// Run: node ctrb_v5_smoke_test.js

const { webkit } = require('playwright');

(async () => {
  console.log('🧪 Starting CTRBooster V5 Spreadsheet Smoke Tests...\n');

  const browser = await webkit.launch({ headless: true });
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${name}`);
      console.log(`   Error: ${error.message.split('\n')[0]}`);
      failed++;
    }
  }

  // Start local server
  const { spawn } = require('child_process');
  const server = spawn('python3', ['-m', 'http.server', '8080'], {
    cwd: process.cwd(),
    detached: true,
    stdio: 'ignore'
  });
  await new Promise(resolve => setTimeout(resolve, 1500));

  try {
    // ===== TEST 1: V5 Page Load =====
    console.log('📄 Test 1: V5 Page Load');
    let page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v5.html');
    await page.waitForLoadState('networkidle');

    await test('Page title contains V5', async () => {
      const title = await page.title();
      if (!title.includes('V5')) throw new Error('Title missing V5');
    });

    await test('Spreadsheet tab active', async () => {
      const activeTab = await page.$('.tab-btn.active:has-text("Spreadsheet")');
      if (!activeTab) throw new Error('Spreadsheet tab not active');
    });

    await test('Spreadsheet table exists', async () => {
      const table = await page.$('#spreadsheet-table');
      if (!table) throw new Error('Spreadsheet table missing');
    });

    await page.close();

    // ===== TEST 2: Bulk Create Tab =====
    console.log('\n🚀 Test 2: Bulk Create');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v5.html');
    await page.waitForLoadState('networkidle');

    await page.click('text=Bulk Create');
    await page.waitForTimeout(500);

    await test('Bulk Create view visible', async () => {
      const view = await page.$('#view-bulk-create.active');
      if (!view) throw new Error('Bulk Create view not active');
    });

    await test('URL textarea exists', async () => {
      const textarea = await page.$('#bulk-urls');
      if (!textarea) throw new Error('URL textarea missing');
    });

    await test('Daily Limit input exists', async () => {
      const input = await page.$('#bulk-daily-limit');
      if (!input) throw new Error('Daily Limit input missing');
    });

    await test('Total Visits input exists', async () => {
      const input = await page.$('#bulk-total-visits');
      if (!input) throw new Error('Total Visits input missing');
    });

    await test('Campaign Type dropdown exists', async () => {
      const select = await page.$('#bulk-campaign-type');
      if (!select) throw new Error('Campaign Type select missing');
    });

    await test('Generate button exists', async () => {
      const btn = await page.$('button:has-text("Generate Campaigns")');
      if (!btn) throw new Error('Generate button missing');
    });

    await page.close();

    // ===== TEST 3: Bulk Create Functionality =====
    console.log('\n➕ Test 3: Bulk Create Functionality');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v5.html');
    await page.waitForLoadState('networkidle');

    await page.click('text=Bulk Create');
    await page.waitForTimeout(300);

    // Enter test URLs
    await page.fill('#bulk-urls', 'https://test1.com\nhttps://test2.com\nhttps://test3.com');
    await page.waitForTimeout(200);

    await test('URLs entered correctly', async () => {
      const value = await page.$eval('#bulk-urls', el => el.value);
      if (!value.includes('https://test1.com')) throw new Error('URLs not entered');
    });

    // Click generate
    await page.click('text=Generate Campaigns');
    await page.waitForTimeout(800);

    await test('Success toast appears', async () => {
      const toast = await page.$('.toast-success');
      if (!toast) throw new Error('Success toast missing');
    });

    await test('Preview panel shows 3 campaigns', async () => {
      const preview = await page.$('#bulk-create-preview:not([style*="display: none"])');
      if (!preview) throw new Error('Preview panel not visible');
      const count = await page.$eval('#preview-count', el => el.textContent);
      if (count !== '3') throw new Error(`Expected 3, got ${count}`);
    });

    await page.close();

    // ===== TEST 4: Spreadsheet View After Create =====
    console.log('\n📊 Test 4: Spreadsheet After Bulk Create');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v5.html');
    await page.waitForLoadState('networkidle');

    // Create campaigns first
    await page.click('text=Bulk Create');
    await page.waitForTimeout(300);
    await page.fill('#bulk-urls', 'https://spreadsheet-test.com');
    await page.click('text=Generate Campaigns');
    await page.waitForTimeout(500);

    // Switch to spreadsheet
    await page.click('text=Spreadsheet');
    await page.waitForTimeout(500);

    await test('Campaigns visible in table', async () => {
      const rows = await page.$$eval('#table-body tr', rows => rows.length);
      if (rows < 1) throw new Error('No campaign rows');
    });

    await test('TargetUrl column visible', async () => {
      const header = await page.$('th[data-col="TargetUrl"]');
      if (!header) throw new Error('TargetUrl column missing');
    });

    await page.close();

    // ===== TEST 5: Inline Cell Editing =====
    console.log('\n✏️ Test 5: Inline Cell Editing');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v5.html');
    await page.waitForLoadState('networkidle');

    // Create a campaign
    await page.click('text=Bulk Create');
    await page.waitForTimeout(300);
    await page.fill('#bulk-urls', 'https://edit-test.com');
    await page.click('text=Generate Campaigns');
    await page.waitForTimeout(500);
    await page.click('text=Spreadsheet');
    await page.waitForTimeout(500);

    await test('Editable cells exist', async () => {
      const cells = await page.$$('.editable-cell input');
      if (cells.length < 1) throw new Error('No editable cells');
    });

    await test('Can edit DailyLimit cell', async () => {
      const input = await page.$('td[data-col="DailyLimit"] input, .editable-cell input');
      if (!input) throw new Error('DailyLimit input not found');
    });

    await page.close();

    // ===== TEST 6: Bulk Edit Panel =====
    console.log('\n📦 Test 6: Bulk Edit Panel');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v5.html');
    await page.waitForLoadState('networkidle');

    await test('Bulk Edit button exists', async () => {
      const btn = await page.$('button:has-text("Bulk Edit")');
      if (!btn) throw new Error('Bulk Edit button missing');
    });

    await page.click('text=Bulk Edit');
    await page.waitForTimeout(500);

    await test('Bulk Edit panel opens', async () => {
      const panel = await page.$('#bulk-edit-panel:not(.hidden)');
      if (!panel) throw new Error('Bulk Edit panel not visible');
    });

    await test('Field groups visible', async () => {
      const groups = await page.$$eval('.bulk-edit-grid', grids => grids.length);
      if (groups < 1) throw new Error('No field groups');
    });

    await page.close();

    // ===== TEST 7: Column Picker =====
    console.log('\n📑 Test 7: Column Picker');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v5.html');
    await page.waitForLoadState('networkidle');

    await test('Columns button exists', async () => {
      const btn = await page.$('button:has-text("Columns")');
      if (!btn) throw new Error('Columns button missing');
    });

    await page.click('text=Columns');
    await page.waitForTimeout(300);

    await test('Column dropdown opens', async () => {
      const dropdown = await page.$('#column-dropdown.show');
      if (!dropdown) throw new Error('Column dropdown not visible');
    });

    await test('Field groups in dropdown', async () => {
      const groups = await page.$$eval('.column-group', groups => groups.length);
      if (groups < 1) throw new Error('No column groups');
    });

    await page.close();

    // ===== TEST 8: Keyboard Shortcuts =====
    console.log('\n⌨️ Test 8: Keyboard Shortcuts');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v5.html');
    await page.waitForLoadState('networkidle');

    await test('Ctrl+S saves', async () => {
      await page.keyboard.press('Control+s');
      await page.waitForTimeout(300);
      const toast = await page.$('.toast-success');
      if (!toast) throw new Error('Save toast not shown');
    });

    await page.close();

    // ===== TEST 9: Import/Export =====
    console.log('\n💾 Test 9: Import/Export');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v5.html');
    await page.waitForLoadState('networkidle');

    await page.click('text=Import/Export');
    await page.waitForTimeout(300);

    await test('Import section visible', async () => {
      const section = await page.$('text=Import JSON');
      if (!section) throw new Error('Import section missing');
    });

    await test('Export button exists', async () => {
      const btn = await page.$('text=Download Backup JSON');
      if (!btn) throw new Error('Export button missing');
    });

    await page.close();

    // ===== TEST 10: Status Bar =====
    console.log('\n📊 Test 10: Status Bar');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v5.html');
    await page.waitForLoadState('networkidle');

    await test('Status bar exists', async () => {
      const statusBar = await page.$('.status-bar');
      if (!statusBar) throw new Error('Status bar missing');
    });

    await test('Campaign count shown', async () => {
      const status = await page.$eval('#status-left', el => el.textContent);
      if (!status.includes('Campaigns')) throw new Error('Campaign count missing');
    });

    await page.close();

  } catch (error) {
    console.log(`\n❌ Suite error: ${error.message}`);
  } finally {
    try { process.kill(-server.pid); } catch(e) {}

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log(`📊 Results: ${passed} passed, ${failed} failed`);
    console.log('='.repeat(50));

    if (failed === 0) {
      console.log('\n✅ All V5 features working!\n');
    } else {
      console.log(`\n⚠️  ${failed} issue(s) found. Check V5 editor.\n`);
    }

    process.exit(failed > 0 ? 1 : 0);
  }
})();
