// CTRBooster V5 - Full Test Suite
// Run: node ctrb_v5_full_test.js

const { webkit } = require('playwright');
const fs = require('fs');
const path = require('path');

const BACKUP_PATH = path.join(__dirname, 'CTRB Json backup files/campaign backups/CTR BOOSTER BACKUP - Febuary 17, 2025/CTR campaigns(1725).json');

(async () => {
  console.log('🧪 CTRBooster V5 Full Test Suite\n');

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
    // ===== TEST 1: V5 Page Load & Initial State =====
    console.log('📄 Test 1: V5 Page Load');
    let page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v5.html');
    await page.waitForLoadState('networkidle');

    await test('Page title contains V5', async () => {
      const title = await page.title();
      if (!title.includes('V5')) throw new Error('Title missing V5');
    });

    await test('Spreadsheet tab is active', async () => {
      const activeTab = await page.$('.tab-btn.active:has-text("Spreadsheet")');
      if (!activeTab) throw new Error('Spreadsheet tab not active');
    });

    await test('Status bar shows 0 campaigns', async () => {
      const status = await page.$eval('#status-left', el => el.textContent);
      if (!status.includes('0')) throw new Error(`Expected 0, got ${status}`);
    });

    await page.close();

    // ===== TEST 2: Import Campaigns =====
    console.log('\n📥 Test 2: Import Campaigns');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v5.html');
    await page.waitForLoadState('networkidle');

    await page.click('text=Import/Export');
    await page.waitForTimeout(300);

    const fileInput = await page.$('#file-input');
    await fileInput.setInputFiles(BACKUP_PATH);
    await page.waitForTimeout(1000);

    await test('Import 1725 campaigns', async () => {
      const status = await page.$eval('#status-left', el => el.textContent);
      if (!status.includes('1725')) throw new Error(`Expected 1725, got ${status}`);
    });

    await page.click('text=Spreadsheet');
    await page.waitForTimeout(500);

    await test('Table shows campaigns after import', async () => {
      const rows = await page.$$eval('#table-body tr', rows => rows.length);
      if (rows < 1) throw new Error('No rows rendered');
    });

    await page.close();

    // ===== TEST 3: Column Sorting =====
    console.log('\n📊 Test 3: Column Sorting');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v5.html');
    await page.waitForLoadState('networkidle');
    
    // Clear localStorage for fresh state
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });

    // Create small test dataset instead of importing 1725
    await page.click('text=Bulk Create');
    await page.waitForTimeout(300);
    await page.fill('#bulk-urls', 'https://sort1.com\nhttps://sort2.com\nhttps://sort3.com\nhttps://sort4.com\nhttps://sort5.com');
    await page.click('text=Generate Campaigns');
    await page.waitForTimeout(500);
    await page.click('text=Spreadsheet');
    await page.waitForTimeout(500);

    await test('Click DailyLimit header sorts', async () => {
      await page.click('th[data-col="DailyLimit"]');
      await page.waitForTimeout(300);
      const status = await page.$eval('#status-right', el => el.textContent);
      if (!status.includes('DailyLimit')) throw new Error('Sort not triggered');
    });

    await test('Sort direction toggles', async () => {
      await page.click('th[data-col="DailyLimit"]');
      await page.waitForTimeout(300);
      const header = await page.$('th[data-col="DailyLimit"]');
      const text = await header.textContent();
      if (!text.includes('↓')) throw new Error('Sort indicator not showing');
    });

    await page.close();

    // ===== TEST 4: Bulk Create with Defaults =====
    console.log('\n🚀 Test 4: Bulk Create Defaults');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v5.html');
    await page.waitForLoadState('networkidle');

    await page.click('text=Bulk Create');
    await page.waitForTimeout(300);

    await test('Daily Limit defaults to 3', async () => {
      const value = await page.$eval('#bulk-daily-limit', el => el.value);
      if (value !== '3') throw new Error(`Expected 3, got ${value}`);
    });

    await test('Total Visits defaults to 7890', async () => {
      const value = await page.$eval('#bulk-total-visits', el => el.value);
      if (value !== '7890') throw new Error(`Expected 7890, got ${value}`);
    });

    await test('Start Time defaults to 6:30 AM', async () => {
      const value = await page.$eval('#bulk-start-time', el => el.value);
      if (value !== '6:30 AM') throw new Error(`Expected 6:30 AM, got ${value}`);
    });

    await test('End Time defaults to 11:55 PM', async () => {
      const value = await page.$eval('#bulk-end-time', el => el.value);
      if (value !== '11:55 PM') throw new Error(`Expected 11:55 PM, got ${value}`);
    });

    await test('Device Type defaults to Desktop', async () => {
      const value = await page.$eval('#bulk-device-type', el => el.value);
      if (value !== 'Desktop') throw new Error(`Expected Desktop, got ${value}`);
    });

    await page.close();

    // ===== TEST 5: Bulk Create Functionality =====
    console.log('\n➕ Test 5: Bulk Create Functionality');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v5.html');
    await page.waitForLoadState('networkidle');

    await page.click('text=Bulk Create');
    await page.waitForTimeout(300);
    await page.fill('#bulk-urls', 'https://test1.com\nhttps://test2.com');
    await page.fill('#bulk-keywords', 'keyword1\nkeyword2');
    await page.click('text=Generate Campaigns');
    await page.waitForTimeout(800);

    await test('Creates 2 campaigns', async () => {
      const status = await page.$eval('#status-left', el => el.textContent);
      if (!status.includes('2')) throw new Error(`Expected 2, got ${status}`);
    });

    await test('Keywords are set', async () => {
      await page.click('text=Spreadsheet');
      await page.waitForTimeout(500);
      const cells = await page.$$eval('.editable-cell textarea', els => 
        els.map(el => el.value).filter(v => v.includes('keyword1'))
      );
      if (cells.length < 1) throw new Error('Keywords not set');
    });

    await page.close();

    // ===== TEST 6: Row Selection =====
    console.log('\n✓ Test 6: Row Selection');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v5.html');
    await page.waitForLoadState('networkidle');
    
    // Clear localStorage for fresh state
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });

    // Create small test dataset
    await page.click('text=Bulk Create');
    await page.waitForTimeout(300);
    await page.fill('#bulk-urls', 'https://select1.com\nhttps://select2.com\nhttps://select3.com');
    await page.click('text=Generate Campaigns');
    await page.waitForTimeout(500);
    await page.click('text=Spreadsheet');
    await page.waitForTimeout(500);

    await test('Click row selects campaign', async () => {
      await page.click('#table-body tr:first-child td:first-child');
      await page.waitForTimeout(200);
      const selected = await page.$('#table-body tr.selected');
      if (!selected) throw new Error('Row not selected');
    });

    await test('Shift+click selects range', async () => {
      await page.click('#table-body tr:first-child td:first-child');
      await page.keyboard.down('Shift');
      await page.click('#table-body tr:last-child td:first-child');
      await page.keyboard.up('Shift');
      await page.waitForTimeout(200);
      const selected = await page.$$eval('#table-body tr.selected', rows => rows.length);
      if (selected < 2) throw new Error(`Expected >=2 selected, got ${selected}`);
    });

    await test('ESC clears selection', async () => {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);
      const selected = await page.$$eval('#table-body tr.selected', rows => rows.length);
      if (selected !== 0) throw new Error(`Expected 0 selected, got ${selected}`);
    });

    await page.close();

    // ===== TEST 7: Bulk Edit Panel =====
    console.log('\n✏️ Test 7: Bulk Edit Panel');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v5.html');
    await page.waitForLoadState('networkidle');
    
    // Clear localStorage for fresh state
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });

    // Create small test dataset
    await page.click('text=Bulk Create');
    await page.waitForTimeout(300);
    await page.fill('#bulk-urls', 'https://edit1.com\nhttps://edit2.com');
    await page.click('text=Generate Campaigns');
    await page.waitForTimeout(500);
    await page.click('text=Spreadsheet');
    await page.waitForTimeout(500);

    // Select all using shift+click on first cell
    await page.click('#table-body tr:first-child td:first-child');
    await page.keyboard.down('Shift');
    await page.click('#table-body tr:last-child td:first-child');
    await page.keyboard.up('Shift');
    await page.waitForTimeout(200);

    await page.click('text=Bulk Edit');
    await page.waitForTimeout(500);

    await test('Bulk Edit panel opens', async () => {
      const panel = await page.$('#bulk-edit-panel:not(.hidden)');
      if (!panel) throw new Error('Panel not visible');
    });

    await test('Keywords field is textarea', async () => {
      const textarea = await page.$('#bulk-Keywords');
      if (!textarea) throw new Error('Keywords textarea missing');
    });

    await test('Referral (lstSites) field exists', async () => {
      const textarea = await page.$('#bulk-lstSites');
      if (!textarea) throw new Error('Referral textarea missing');
    });

    await page.close();

    // ===== TEST 8: Column Resize =====
    console.log('\n↔️ Test 8: Column Resize');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v5.html');
    await page.waitForLoadState('networkidle');

    await test('Resize handle exists', async () => {
      const handle = await page.$('.resize-handle');
      if (!handle) throw new Error('Resize handle missing');
    });

    await test('Can drag resize handle', async () => {
      const th = await page.$('th[data-col="ProjectName"]');
      const initialWidth = await th.boundingBox().then(b => b.width);
      
      const handle = await page.$('th[data-col="ProjectName"] .resize-handle');
      const box = await handle.boundingBox();
      
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 100, box.y);
      await page.mouse.up();
      await page.waitForTimeout(200);
      
      const newWidth = await th.boundingBox().then(b => b.width);
      if (newWidth <= initialWidth) throw new Error('Column did not resize');
    });

    await page.close();

    // ===== TEST 9: Export =====
    console.log('\n📤 Test 9: Export');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v5.html');
    await page.waitForLoadState('networkidle');

    // Create test data
    await page.click('text=Bulk Create');
    await page.waitForTimeout(300);
    await page.fill('#bulk-urls', 'https://export-test.com');
    await page.click('text=Generate Campaigns');
    await page.waitForTimeout(500);

    await page.click('text=Import/Export');
    await page.waitForTimeout(300);

    // Set up download listener
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('text=Download Backup JSON')
    ]);

    await test('Export download triggered', async () => {
      if (!download) throw new Error('Download not triggered');
    });

    await page.close();

    // ===== TEST 10: Keyboard Shortcuts =====
    console.log('\n⌨️ Test 10: Keyboard Shortcuts');
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

  } catch (error) {
    console.log(`\n❌ Suite error: ${error.message}`);
  } finally {
    try { process.kill(-server.pid); } catch(e) {}

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log(`📊 V5 Full Test Results: ${passed} passed, ${failed} failed`);
    console.log('='.repeat(60));

    if (failed === 0) {
      console.log('\n✅ ALL V5 TESTS PASSED!\n');
    } else {
      console.log(`\n⚠️  ${failed} test(s) failed. Review errors above.\n`);
    }

    process.exit(failed > 0 ? 1 : 0);
  }
})();
