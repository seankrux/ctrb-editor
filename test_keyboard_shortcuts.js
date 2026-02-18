// CTRBooster V4 - Keyboard Shortcut Tests
const { webkit } = require('playwright');

(async () => {
    console.log('🧪 V4 Keyboard Shortcut Tests\n');
    
    const browser = await webkit.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    
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
    
    // Start server
    const { spawn } = require('child_process');
    const server = spawn('python3', ['-m', 'http.server', '8080'], {
        cwd: __dirname,
        detached: true,
        stdio: 'ignore'
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
        // Load V4 editor
        await page.goto('http://localhost:8080/ctrb_web_editor_v4.html');
        await page.waitForLoadState('networkidle');
        
        // Create test campaigns
        console.log('📦 Creating test campaigns...\n');
        for (let i = 0; i < 5; i++) {
            await page.click('text=+ New Campaign');
            await page.waitForTimeout(500);
            await page.fill('#e-ProjectName', `Test Campaign ${i + 1}`);
            await page.click('text=Save Changes');
            await page.waitForTimeout(300);
        }
        
        // ===== TEST 1: ESC clears selection =====
        console.log('⌨️  Test 1: ESC Key');
        await test('Select campaign with checkbox', async () => {
            await page.click('table tbody tr:first-child input[type="checkbox"]');
            await page.waitForTimeout(200);
            const selected = await page.$$('input[type="checkbox"]:checked');
            if (selected.length !== 1) throw new Error(`Expected 1 selected, got ${selected.length}`);
        });
        
        await test('ESC clears all selections', async () => {
            await page.keyboard.press('Escape');
            await page.waitForTimeout(200);
            const selected = await page.$$('input[type="checkbox"]:checked');
            if (selected.length !== 0) throw new Error(`Expected 0 selected, got ${selected.length}`);
        });
        
        // ===== TEST 2: Shift+Click range selection =====
        console.log('\n⌨️  Test 2: Shift+Click');
        await test('Click first campaign', async () => {
            await page.click('table tbody tr:nth-child(1) input[type="checkbox"]');
            await page.waitForTimeout(200);
        });
        
        await test('Shift+Click fifth campaign selects range', async () => {
            await page.keyboard.down('Shift');
            await page.click('table tbody tr:nth-child(5) input[type="checkbox"]');
            await page.keyboard.up('Shift');
            await page.waitForTimeout(200);
            const selected = await page.$$('input[type="checkbox"]:checked');
            if (selected.length !== 5) throw new Error(`Expected 5 selected, got ${selected.length}`);
        });
        
        await test('Shift+Click third campaign toggles range', async () => {
            await page.keyboard.down('Shift');
            await page.click('table tbody tr:nth-child(3) input[type="checkbox"]');
            await page.keyboard.up('Shift');
            await page.waitForTimeout(200);
            const selected = await page.$$('input[type="checkbox"]:checked');
            // Should now have 0 (all toggled off)
            if (selected.length !== 0) throw new Error(`Expected 0 selected after toggle, got ${selected.length}`);
        });
        
        // ===== TEST 3: Filter + Selection =====
        console.log('\n🔍 Test 3: Filter + Selection');
        await test('Filter campaigns', async () => {
            await page.fill('input[placeholder="Search by name or ID..."]', 'Test Campaign 1');
            await page.waitForTimeout(500);
            const rows = await page.locator('#table-body tr').count();
            if (rows < 1) throw new Error('No filtered results');
        });
        
        await test('Select filtered campaign', async () => {
            await page.click('table tbody tr:first-child input[type="checkbox"]');
            await page.waitForTimeout(200);
            const selectedCount = await page.locator('#selected-count').textContent();
            if (!selectedCount.includes('1')) throw new Error(`Expected "1" in count, got "${selectedCount}"`);
        });
        
        await test('Clear filter keeps selection', async () => {
            await page.fill('input[placeholder="Search by name or ID..."]', '');
            await page.waitForTimeout(500);
            const selected = await page.$$('input[type="checkbox"]:checked');
            if (selected.length !== 1) throw new Error(`Selection lost after filter clear`);
        });
        
        // ===== TEST 4: Bulk Operations =====
        console.log('\n📦 Test 4: Bulk Operations');
        await test('Select multiple campaigns', async () => {
            await page.click('table tbody tr:nth-child(1) input[type="checkbox"]');
            await page.click('table tbody tr:nth-child(2) input[type="checkbox"]');
            await page.click('table tbody tr:nth-child(3) input[type="checkbox"]');
            await page.waitForTimeout(200);
            const selectedCount = await page.locator('#selected-count').textContent();
            if (!selectedCount.includes('3')) throw new Error(`Expected "3" in count, got "${selectedCount}"`);
        });
        
        await test('Bulk toolbar appears', async () => {
            const toolbar = await page.$('#bulk-tools:not(.hidden)');
            if (!toolbar) throw new Error('Bulk toolbar not visible');
        });
        
        await test('Bulk Edit button exists', async () => {
            const btn = await page.$('button:has-text("Bulk Edit")');
            if (!btn) throw new Error('Bulk Edit button not found');
        });
        
        await test('Export Selected button exists', async () => {
            const btn = await page.$('button:has-text("Export Selected")');
            if (!btn) throw new Error('Export Selected button not found');
        });
        
        await test('Compare button exists', async () => {
            const btn = await page.$('button:has-text("Compare")');
            if (!btn) throw new Error('Compare button not found');
        });
        
        // ===== TEST 5: Import Sanitization =====
        console.log('\n🔒 Test 5: Import Sanitization');
        await test('Import with XSS payload is sanitized', async () => {
            const maliciousJson = JSON.stringify([{
                id: "123",
                ProjectName: "<script>alert('XSS')</script>",
                Type: "GSearch",
                numberOfVisits: "100",
                DailyLimit: "10",
                doneVisits: "0 of 100",
                doneDailyVisits: "0 of 10",
                CreateTime: new Date().toLocaleString('en-US'),
                Filename: "test",
                lstCustomGeolocations: [],
                lstKeywords: [],
                lstSites: [],
                Keywords: [],
                UsedKeywords: [],
                lstInternalIgnoreLinks: []
            }]);
            
            await page.click('text=Import / Export');
            await page.waitForTimeout(300);
            await page.fill('#json-editor', maliciousJson);
            await page.click('text=Parse Textarea');
            await page.waitForTimeout(500);
            
            // Check that script tags are escaped
            const campaignName = await page.locator('#table-body tr:first-child .font-bold').textContent();
            if (campaignName.includes('<script>')) {
                throw new Error(`XSS not sanitized: ${campaignName}`);
            }
            if (!campaignName.includes('&lt;script&gt;')) {
                throw new Error(`Expected escaped HTML, got: ${campaignName}`);
            }
        });
        
    } catch (error) {
        console.log(`\n❌ Suite error: ${error.message}`);
    } finally {
        await browser.close();
        try { process.kill(-server.pid); } catch(e) {}
        
        // Summary
        console.log('\n' + '='.repeat(60));
        console.log(`📊 KEYBOARD SHORTCUT TEST RESULTS`);
        console.log('='.repeat(60));
        console.log(`Passed: ${passed}`);
        console.log(`Failed: ${failed}`);
        console.log(`Total:  ${passed + failed}`);
        
        if (failed === 0) {
            console.log('\n✅ ALL KEYBOARD SHORTCUT TESTS PASSED!\n');
        } else {
            console.log(`\n⚠️  ${failed} test(s) failed.\n`);
        }
        
        process.exit(failed > 0 ? 1 : 0);
    }
})();
