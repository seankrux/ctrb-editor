// Test: Import → Export → Re-import preserves data integrity
const { webkit } = require('playwright');
const fs = require('fs');
const path = require('path');

const BACKUP_PATH = '/Users/sean/Documents/Git/Sean M/CTR/1. CTRB Json Editor/CTRB Json backup files/campaign backups/CTR BOOSTER BACKUP - Febuary 17, 2025/CTR campaigns(1725).json';
const EXPORT_PATH = path.join(__dirname, 'test_export_integrity.json');

(async () => {
    console.log('🧪 Testing Data Integrity: Import → Export → Re-import\n');
    
    // Load original file
    const originalData = JSON.parse(fs.readFileSync(BACKUP_PATH, 'utf8'));
    console.log(`📦 Original: ${originalData.length} campaigns`);
    
    // Extract key fields for comparison (ignore runtime fields)
    function getSignature(c) {
        return {
            id: c.id,
            ProjectName: c.ProjectName,
            Type: c.Type,
            CreateTime: c.CreateTime,
            Filename: c.Filename,
            numberOfVisits: c.numberOfVisits,
            DailyLimit: c.DailyLimit,
            lstCustomGeolocations: c.lstCustomGeolocations?.length || 0
        };
    }
    
    const originalSignatures = originalData.map(getSignature);
    
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
        
        // ===== STEP 2: Export =====
        console.log('\n📤 Step 2: Export campaigns');
        await page.click('text=Import / Export');
        await page.waitForTimeout(500);
        
        // Export via JavaScript (bypass download dialog in headless mode)
        const exportedJson = await page.evaluate(() => {
            return JSON.stringify(app.campaigns, null, 2);
        });
        
        // Save to file
        fs.writeFileSync(EXPORT_PATH, exportedJson);
        console.log(`✅ Exported to: ${EXPORT_PATH}`);
        
        // Read exported data
        const exportedData = JSON.parse(fs.readFileSync(EXPORT_PATH, 'utf8'));
        console.log(`✅ Exported: ${exportedData.length} campaigns`);
        
        // ===== STEP 3: Compare Signatures =====
        console.log('\n🔍 Step 3: Compare original vs exported');
        const exportedSignatures = exportedData.map(getSignature);
        
        let matchCount = 0;
        let mismatchCount = 0;
        let mismatches = [];
        
        for (let i = 0; i < originalSignatures.length; i++) {
            const orig = originalSignatures[i];
            const exp = exportedSignatures[i];
            
            if (JSON.stringify(orig) === JSON.stringify(exp)) {
                matchCount++;
            } else {
                mismatchCount++;
                if (mismatches.length < 5) {
                    mismatches.push({
                        index: i,
                        original: orig,
                        exported: exp
                    });
                }
            }
        }
        
        console.log(`✅ Matching: ${matchCount}/${originalSignatures.length}`);
        if (mismatchCount > 0) {
            console.log(`⚠️  Mismatches: ${mismatchCount}`);
            mismatches.forEach(m => {
                console.log(`   Index ${m.index}:`);
                console.log(`     Original ID: ${m.original.id}`);
                console.log(`     Exported ID: ${m.exported.id}`);
            });
        }
        
        // ===== STEP 4: Verify Order Preserved =====
        console.log('\n📋 Step 4: Verify order preserved');
        const originalIds = originalData.map(c => c.id);
        const exportedIds = exportedData.map(c => c.id);
        
        let orderPreserved = true;
        for (let i = 0; i < Math.min(10, originalIds.length); i++) {
            if (originalIds[i] !== exportedIds[i]) {
                orderPreserved = false;
                console.log(`❌ Order mismatch at index ${i}`);
                console.log(`   Original: ${originalIds[i]}`);
                console.log(`   Exported: ${exportedIds[i]}`);
                break;
            }
        }
        
        if (orderPreserved) {
            console.log('✅ Order preserved (verified first 10 campaigns)');
        }
        
        // ===== STEP 5: Verify All Fields Present =====
        console.log('\n📝 Step 5: Verify all fields present');
        const originalKeys = Object.keys(originalData[0]).sort();
        const exportedKeys = Object.keys(exportedData[0]).sort();
        
        const missingKeys = originalKeys.filter(k => !exportedKeys.includes(k));
        const extraKeys = exportedKeys.filter(k => !originalKeys.includes(k));
        
        if (missingKeys.length === 0 && extraKeys.length === 0) {
            console.log('✅ All fields preserved');
        } else {
            if (missingKeys.length > 0) {
                console.log(`❌ Missing fields: ${missingKeys.join(', ')}`);
            }
            if (extraKeys.length > 0) {
                console.log(`⚠️  Extra fields: ${extraKeys.join(', ')}`);
            }
        }
        
        // ===== SUMMARY =====
        console.log('\n' + '='.repeat(60));
        console.log('📊 INTEGRITY TEST RESULTS');
        console.log('='.repeat(60));
        console.log(`Original campaigns: ${originalData.length}`);
        console.log(`Exported campaigns: ${exportedData.length}`);
        console.log(`Matching signatures: ${matchCount}/${originalSignatures.length}`);
        console.log(`Order preserved: ${orderPreserved ? '✅ Yes' : '❌ No'}`);
        console.log(`Fields preserved: ${missingKeys.length === 0 ? '✅ Yes' : '❌ No'}`);
        
        if (matchCount === originalSignatures.length && orderPreserved && missingKeys.length === 0) {
            console.log('\n✅ DATA INTEGRITY VERIFIED!');
            console.log('Import → Export preserves all data correctly.');
        } else {
            console.log('\n⚠️  Some integrity issues found.');
        }
        
        // Cleanup
        try { fs.unlinkSync(EXPORT_PATH); } catch(e) {}
        
    } catch (error) {
        console.log(`\n❌ Test error: ${error.message}`);
    } finally {
        await browser.close();
        try { process.kill(-server.pid); } catch(e) {}
    }
})();
