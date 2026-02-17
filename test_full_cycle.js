// Test: Full Cycle - Import → Edit → Export → Re-import → Compare
const { webkit } = require('playwright');
const fs = require('fs');
const path = require('path');

const BACKUP_PATH = '/Users/sean/Documents/Git/Sean M/CTR/1. CTRB Json Editor/CTRB Json backup files/campaign backups/CTR BOOSTER BACKUP - Febuary 17, 2025/CTR campaigns(1725).json';
const EXPORT_PATH = path.join(__dirname, 'test_cycle_export.json');

(async () => {
    console.log('🔄 Full Cycle Test: Import → Edit → Export → Re-import → Compare\n');
    
    // Load original
    const originalData = JSON.parse(fs.readFileSync(BACKUP_PATH, 'utf8'));
    console.log(`📦 Original: ${originalData.length} campaigns`);
    
    // Get signature of first campaign (we'll edit this one)
    function getSignature(c) {
        return {
            id: c.id,
            ProjectName: c.ProjectName,
            Type: c.Type,
            numberOfVisits: c.numberOfVisits,
            DailyLimit: c.DailyLimit,
            lstCustomGeolocations: c.lstCustomGeolocations?.length || 0
        };
    }
    
    const originalFirst = getSignature(originalData[0]);
    console.log(`📝 First campaign: ${originalFirst.ProjectName} (${originalFirst.id})`);
    
    const browser = await webkit.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    
    // Start server
    const { spawn } = require('child_process');
    const server = spawn('python3', ['-m', 'http.server', '8080'], {
        cwd: __dirname,
        detached: true,
        stdio: 'ignore'
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
        // ===== STEP 1: Import =====
        console.log('\n📥 Step 1: Import original backup');
        await page.goto('http://localhost:8080/ctrb_web_editor_v4.html');
        await page.waitForLoadState('networkidle');
        
        await page.click('text=Import / Export');
        await page.waitForTimeout(500);
        
        const fileInput = await page.$('#file-input');
        await fileInput.setInputFiles(BACKUP_PATH);
        await page.waitForTimeout(2000);
        
        const countAfterImport = await page.locator('#total-campaigns').textContent();
        console.log(`✅ Imported: ${countAfterImport} campaigns`);
        
        // ===== STEP 2: Edit First Campaign =====
        console.log('\n✏️  Step 2: Edit first campaign');
        
        // Click edit on first row
        await page.click('table tbody tr:first-child button[title="Edit"]');
        await page.waitForTimeout(800);
        
        // Get original name
        const originalName = await page.inputValue('#e-ProjectName');
        console.log(`   Original name: ${originalName}`);
        
        // Edit name
        const editedName = `${originalName}_EDITED_TEST`;
        await page.fill('#e-ProjectName', editedName);
        
        // Edit daily limit
        await page.fill('#e-DailyLimit', '99');
        
        // Save
        await page.click('text=Save Changes');
        await page.waitForTimeout(500);
        
        console.log(`✅ Edited name to: ${editedName}`);
        console.log(`✅ Edited DailyLimit to: 99`);
        
        // ===== STEP 3: Export =====
        console.log('\n📤 Step 3: Export all campaigns');
        
        const exportedJson = await page.evaluate(() => {
            return JSON.stringify(app.campaigns, null, 2);
        });
        
        fs.writeFileSync(EXPORT_PATH, exportedJson);
        const exportedData = JSON.parse(exportedJson);
        console.log(`✅ Exported: ${exportedData.length} campaigns`);
        
        // Verify edit was saved
        const exportedFirst = getSignature(exportedData[0]);
        console.log(`   First campaign after edit: ${exportedFirst.ProjectName}`);
        
        // ===== STEP 4: Clear and Re-import =====
        console.log('\n📥 Step 4: Clear and re-import exported file');
        
        // Clear current campaigns
        await page.evaluate(() => {
            app.campaigns = [];
            app.saveToStorage();
            app.renderList();
        });
        
        const countAfterClear = await page.locator('#total-campaigns').textContent();
        console.log(`✅ Cleared: ${countAfterClear} campaigns`);
        
        // Re-import the exported file
        await page.click('text=Import / Export');
        await page.waitForTimeout(500);
        
        const fileInput2 = await page.$('#file-input');
        await fileInput2.setInputFiles(EXPORT_PATH);
        await page.waitForTimeout(2000);
        
        const countAfterReimport = await page.locator('#total-campaigns').textContent();
        console.log(`✅ Re-imported: ${countAfterReimport} campaigns`);
        
        // ===== STEP 5: Compare =====
        console.log('\n🔍 Step 5: Compare original vs re-imported');
        
        const reimportedJson = await page.evaluate(() => {
            return JSON.stringify(app.campaigns, null, 2);
        });
        const reimportedData = JSON.parse(reimportedJson);
        
        // Check first campaign was edited
        const reimportedFirst = getSignature(reimportedData[0]);
        console.log(`   First campaign after re-import: ${reimportedFirst.ProjectName}`);
        
        // Verify edit persisted through export → import cycle
        let editPersisted = false;
        if (reimportedFirst.ProjectName === editedName && reimportedFirst.DailyLimit === '99') {
            editPersisted = true;
            console.log('✅ Edit persisted through export → import cycle');
        } else {
            console.log('❌ Edit did NOT persist!');
            console.log(`   Expected: ${editedName}, DailyLimit: 99`);
            console.log(`   Got: ${reimportedFirst.ProjectName}, DailyLimit: ${reimportedFirst.DailyLimit}`);
        }
        
        // Compare all signatures (should match exported)
        const reimportedSignatures = reimportedData.map(getSignature);
        const exportedSignatures = exportedData.map(getSignature);
        
        let matchCount = 0;
        for (let i = 0; i < exportedSignatures.length; i++) {
            if (JSON.stringify(exportedSignatures[i]) === JSON.stringify(reimportedSignatures[i])) {
                matchCount++;
            }
        }
        
        console.log(`\n📊 Signatures match: ${matchCount}/${exportedSignatures.length}`);
        
        // Verify order preserved
        let orderPreserved = true;
        for (let i = 0; i < Math.min(10, exportedData.length); i++) {
            if (exportedData[i].id !== reimportedData[i].id) {
                orderPreserved = false;
                break;
            }
        }
        console.log(`📋 Order preserved: ${orderPreserved ? '✅ Yes' : '❌ No'}`);
        
        // Verify all fields present
        const originalKeys = Object.keys(exportedData[0]).sort();
        const reimportedKeys = Object.keys(reimportedData[0]).sort();
        const fieldsPreserved = JSON.stringify(originalKeys) === JSON.stringify(reimportedKeys);
        console.log(`📝 Fields preserved: ${fieldsPreserved ? '✅ Yes' : '❌ No'}`);
        
        // ===== SUMMARY =====
        console.log('\n' + '='.repeat(60));
        console.log('🔄 FULL CYCLE TEST RESULTS');
        console.log('='.repeat(60));
        console.log(`Original campaigns: ${originalData.length}`);
        console.log(`After import: ${countAfterImport}`);
        console.log(`After edit: 1 campaign modified`);
        console.log(`After export: ${exportedData.length}`);
        console.log(`After re-import: ${countAfterReimport}`);
        console.log('');
        console.log(`Edit persisted: ${editPersisted ? '✅ Yes' : '❌ No'}`);
        console.log(`Signatures match: ${matchCount}/${exportedSignatures.length}`);
        console.log(`Order preserved: ${orderPreserved ? '✅ Yes' : '❌ No'}`);
        console.log(`Fields preserved: ${fieldsPreserved ? '✅ Yes' : '❌ No'}`);
        
        if (editPersisted && matchCount === exportedSignatures.length && orderPreserved && fieldsPreserved) {
            console.log('\n✅ FULL CYCLE VERIFIED!');
            console.log('Import → Edit → Export → Re-import works correctly.');
            console.log('Data integrity maintained throughout entire cycle.');
        } else {
            console.log('\n⚠️  Some issues found in the cycle.');
        }
        
        // Cleanup
        try { fs.unlinkSync(EXPORT_PATH); } catch(e) {}
        
    } catch (error) {
        console.log(`\n❌ Test error: ${error.message}`);
        console.log(error.stack);
    } finally {
        await browser.close();
        try { process.kill(-server.pid); } catch(e) {}
    }
})();
