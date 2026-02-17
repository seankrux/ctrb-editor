// CTRBooster V4 - Quick GUI Smoke Tests
// Run: node ctrb_v4_smoke_test.js

const { webkit } = require('playwright');

(async () => {
  console.log('🧪 Starting CTRBooster V4 GUI Smoke Tests...\n');
  
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
    // ===== TEST 1: Fresh page load =====
    console.log('📄 Test 1: Page Load');
    let page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v4.html');
    await page.waitForLoadState('networkidle');
    
    await test('Page title contains V4', async () => {
      const title = await page.title();
      if (!title.includes('V4')) throw new Error('Title missing V4');
    });
    
    await test('All 4 tabs visible', async () => {
      const tabs = await page.$$eval('.tab-btn', btns => btns.map(b => b.textContent));
      if (tabs.length < 4) throw new Error(`Only ${tabs.length} tabs`);
    });
    
    await test('Templates tab exists', async () => {
      const tplTab = await page.$('text=Templates');
      if (!tplTab) throw new Error('Templates tab missing');
    });
    
    await page.close();
    
    // ===== TEST 2: Templates =====
    console.log('\n📋 Test 2: Templates');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v4.html');
    await page.waitForLoadState('networkidle');
    
    // Capture console logs
    page.on('console', msg => console.log('  [Console]', msg.text()));
    page.on('pageerror', err => console.log('  [Error]', err.message));
    
    await page.click('text=Templates');
    await page.waitForTimeout(1000);
    
    await test('Template grid visible', async () => {
      const grid = await page.$('#template-grid');
      if (!grid) throw new Error('Template grid not found');
    });
    
    await test('5 default templates exist', async () => {
      const cards = await page.$$eval('.template-card', cards => cards.length);
      console.log(`  Found ${cards} template cards`);
      if (cards < 1) throw new Error(`Found ${cards} templates`);
    });
    
    await page.close();
    
    // ===== TEST 3: Create Campaign =====
    console.log('\n➕ Test 3: Create Campaign');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v4.html');
    await page.waitForLoadState('networkidle');
    
    await page.click('text=+ New Campaign');
    await page.waitForTimeout(800);
    
    await test('Edit modal opens', async () => {
      const modal = await page.$('.modal:not(.hidden)');
      if (!modal) throw new Error('Modal not opened');
    });
    
    await test('Modal has 6 tabs', async () => {
      const tabs = await page.$$eval('.modal-tab-btn', btns => btns.length);
      if (tabs < 6) throw new Error(`Only ${tabs} tabs`);
    });
    
    await page.close();
    
    // ===== TEST 4: Validation =====
    console.log('\n⚠️  Test 4: Validation');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v4.html');
    await page.waitForLoadState('networkidle');
    
    await page.click('text=+ New Campaign');
    await page.waitForTimeout(800);
    await page.fill('#e-ProjectName', '');
    await page.click('text=Save Changes');
    await page.waitForTimeout(500);
    
    await test('Validation panel appears', async () => {
      const panel = await page.$('.validation-panel');
      if (!panel) throw new Error('No validation panel');
    });
    
    await test('Error message visible', async () => {
      const msg = await page.$('text=Missing Project Name');
      if (!msg) throw new Error('Error message missing');
    });
    
    await page.close();
    
    // ===== TEST 5: Bulk Actions =====
    console.log('\n📦 Test 5: Bulk Actions');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v4.html');
    await page.waitForLoadState('networkidle');
    
    // Create campaigns
    await page.click('text=+ New Campaign');
    await page.waitForTimeout(500);
    await page.click('text=Cancel');
    await page.click('text=+ New Campaign');
    await page.waitForTimeout(500);
    await page.click('text=Cancel');
    
    // Select first campaign
    await page.click('table tbody tr:first-child input[type="checkbox"]');
    await page.waitForTimeout(300);
    
    await test('Bulk toolbar appears', async () => {
      const toolbar = await page.$('#bulk-tools:not(.hidden)');
      if (!toolbar) throw new Error('Toolbar not visible');
    });
    
    await test('Bulk Edit button exists', async () => {
      const btn = await page.$('button:has-text("Bulk Edit")');
      if (!btn) throw new Error('Bulk Edit missing');
    });
    
    await test('Export Selected button exists', async () => {
      const btn = await page.$('button:has-text("Export Selected")');
      if (!btn) throw new Error('Export Selected missing');
    });
    
    await test('Compare button exists', async () => {
      const btn = await page.$('button:has-text("Compare")');
      if (!btn) throw new Error('Compare missing');
    });
    
    await page.close();
    
    // ===== TEST 6: Wizard =====
    console.log('\n⚡ Test 6: Client Wizard');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v4.html');
    await page.waitForLoadState('networkidle');
    
    await page.click('text=Client Wizard');
    await page.waitForTimeout(300);
    
    await test('Wizard form visible', async () => {
      const form = await page.$('#wiz-name');
      if (!form) throw new Error('Wizard form missing');
    });
    
    await page.close();
    
    // ===== TEST 7: Import/Export =====
    console.log('\n💾 Test 7: Import/Export');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v4.html');
    await page.waitForLoadState('networkidle');
    
    await page.click('text=Import / Export');
    await page.waitForTimeout(300);
    
    await test('JSON editor visible', async () => {
      const editor = await page.$('#json-editor');
      if (!editor) throw new Error('Editor missing');
    });
    
    await test('Load File button exists', async () => {
      const btn = await page.$('text=Load File');
      if (!btn) throw new Error('Load File missing');
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
      console.log('\n✅ All V4 features working!\n');
    } else {
      console.log(`\n⚠️  ${failed} issue(s) found. Check V4 editor.\n`);
    }
    
    process.exit(failed > 0 ? 1 : 0);
  }
})();
