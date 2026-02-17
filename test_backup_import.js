// Test: Import Feb 17 2025 Backup into V4
const fs = require('fs');
const path = require('path');

const BACKUP_PATH = '/Users/sean/Documents/Git/Sean M/CTR/1. CTRB Json Editor/CTRB Json backup files/campaign backups/CTR BOOSTER BACKUP - Febuary 17, 2025/CTR campaigns(1725).json';

console.log('🧪 Testing Backup Import for V4 Editor\n');
console.log('📁 File:', BACKUP_PATH);
console.log('');

// Test 1: File exists
console.log('Test 1: File exists');
if (!fs.existsSync(BACKUP_PATH)) {
    console.log('❌ File not found!');
    process.exit(1);
}
console.log('✅ File exists\n');

// Test 2: Valid JSON
console.log('Test 2: Valid JSON');
let campaigns;
try {
    const content = fs.readFileSync(BACKUP_PATH, 'utf8');
    campaigns = JSON.parse(content);
    console.log('✅ Valid JSON\n');
} catch (e) {
    console.log('❌ Invalid JSON:', e.message);
    process.exit(1);
}

// Test 3: Is array
console.log('Test 3: Is array');
if (!Array.isArray(campaigns)) {
    console.log('❌ Not an array!');
    process.exit(1);
}
console.log('✅ Is array\n');

// Test 4: Campaign count
console.log('Test 4: Campaign count');
console.log(`📦 Total campaigns: ${campaigns.length}\n`);

// Test 5: Campaign structure
console.log('Test 5: Campaign structure validation');
const requiredFields = ['id', 'ProjectName', 'Type', 'numberOfVisits', 'DailyLimit'];
let validCount = 0;
let invalidCampaigns = [];

campaigns.forEach((c, idx) => {
    const missing = requiredFields.filter(f => !c[f]);
    if (missing.length === 0) {
        validCount++;
    } else {
        invalidCampaigns.push({ idx, name: c.ProjectName || 'unnamed', missing });
    }
});

console.log(`✅ Valid campaigns: ${validCount}/${campaigns.length}`);
if (invalidCampaigns.length > 0) {
    console.log(`⚠️  Invalid campaigns: ${invalidCampaigns.length}`);
    invalidCampaigns.slice(0, 5).forEach(c => {
        console.log(`   - ${c.name}: missing ${c.missing.join(', ')}`);
    });
}
console.log('');

// Test 6: Campaign types
console.log('Test 6: Campaign types');
const types = {};
campaigns.forEach(c => {
    types[c.Type] = (types[c.Type] || 0) + 1;
});
Object.entries(types).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
});
console.log('');

// Test 7: V4 Validation check
console.log('Test 7: V4 Export Validation Check');
let exportReady = 0;
let needsFix = 0;

campaigns.forEach(c => {
    const issues = [];
    if (!c.ProjectName || c.ProjectName.trim() === '') issues.push('No name');
    if (!c.Type) issues.push('No type');
    if (c.UseGeolocation && (!c.lstCustomGeolocations || c.lstCustomGeolocations.length === 0)) {
        issues.push('Geo enabled but empty');
    }
    
    if (issues.length === 0) {
        exportReady++;
    } else {
        needsFix++;
    }
});

console.log(`✅ Export ready: ${exportReady}/${campaigns.length}`);
console.log(`⚠️  Needs fixes: ${needsFix}/${campaigns.length}`);
console.log('');

// Test 8: File size
console.log('Test 8: File size');
const stats = fs.statSync(BACKUP_PATH);
const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
console.log(`📊 File size: ${sizeMB} MB`);
console.log('');

// Summary
console.log('='.repeat(50));
console.log('📊 SUMMARY');
console.log('='.repeat(50));
console.log(`Total campaigns: ${campaigns.length}`);
console.log(`Valid structure: ${validCount} (${(validCount/campaigns.length*100).toFixed(1)}%)`);
console.log(`Export ready: ${exportReady} (${(exportReady/campaigns.length*100).toFixed(1)}%)`);
console.log(`File size: ${sizeMB} MB`);
console.log('');

if (exportReady === campaigns.length) {
    console.log('✅ Backup is 100% ready for V4 import!');
    console.log('\n📥 To import:');
    console.log('1. Open ctrb_web_editor_v4.html');
    console.log('2. Go to "Import / Export" tab');
    console.log('3. Click "📂 Load File"');
    console.log('4. Select: CTR campaigns(1725).json');
    console.log('5. Choose "Replace All" or "Merge"');
    console.log('6. Campaigns will auto-save to localStorage!');
} else {
    console.log('⚠️  Some campaigns need fixes before export');
    console.log('V4 editor will warn you when exporting.');
}
