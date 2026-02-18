// CTRBooster Chrome Extension Tests
// Run: node test_chrome_extension.js

const fs = require('fs');
const path = require('path');

console.log('🧪 Starting Chrome Extension Tests...\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    failed++;
  }
}

const extPath = path.join(__dirname, 'chrome-extension');

// ===== TEST 1: Manifest =====
console.log('📋 Test 1: Manifest');

test('manifest.json exists', () => {
  if (!fs.existsSync(path.join(extPath, 'manifest.json'))) {
    throw new Error('manifest.json not found');
  }
});

test('manifest.json is valid JSON', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(extPath, 'manifest.json'), 'utf8'));
  if (!manifest.manifest_version) {
    throw new Error('Invalid manifest');
  }
});

test('manifest_version is 3', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(extPath, 'manifest.json'), 'utf8'));
  if (manifest.manifest_version !== 3) {
    throw new Error(`Expected manifest_version 3, got ${manifest.manifest_version}`);
  }
});

test('name is correct', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(extPath, 'manifest.json'), 'utf8'));
  if (manifest.name !== 'CTRBooster AI Assistant') {
    throw new Error(`Expected name 'CTRBooster AI Assistant', got '${manifest.name}'`);
  }
});

test('devtools_page is defined', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(extPath, 'manifest.json'), 'utf8'));
  if (!manifest.devtools_page) {
    throw new Error('devtools_page not defined');
  }
});

test('background service_worker is defined', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(extPath, 'manifest.json'), 'utf8'));
  if (!manifest.background?.service_worker) {
    throw new Error('background service_worker not defined');
  }
});

test('permissions include storage', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(extPath, 'manifest.json'), 'utf8'));
  if (!manifest.permissions?.includes('storage')) {
    throw new Error('storage permission not found');
  }
});

test('permissions include scripting', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(extPath, 'manifest.json'), 'utf8'));
  if (!manifest.permissions?.includes('scripting')) {
    throw new Error('scripting permission not found');
  }
});

test('action popup is defined', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(extPath, 'manifest.json'), 'utf8'));
  if (!manifest.action?.default_popup) {
    throw new Error('action popup not defined');
  }
});

// ===== TEST 2: DevTools Files =====
console.log('\n🔧 Test 2: DevTools Files');

test('devtools.html exists', () => {
  if (!fs.existsSync(path.join(extPath, 'devtools', 'devtools.html'))) {
    throw new Error('devtools.html not found');
  }
});

test('devtools.js exists', () => {
  if (!fs.existsSync(path.join(extPath, 'devtools', 'devtools.js'))) {
    throw new Error('devtools.js not found');
  }
});

test('devtools.html contains chat UI', () => {
  const html = fs.readFileSync(path.join(extPath, 'devtools', 'devtools.html'), 'utf8');
  if (!html.includes('chat-messages')) {
    throw new Error('chat-messages not found in devtools.html');
  }
});

test('devtools.js contains AI API call', () => {
  const js = fs.readFileSync(path.join(extPath, 'devtools', 'devtools.js'), 'utf8');
  if (!js.includes('api.openai.com')) {
    throw new Error('OpenAI API call not found in devtools.js');
  }
});

test('devtools.js has campaign data loading', () => {
  const js = fs.readFileSync(path.join(extPath, 'devtools', 'devtools.js'), 'utf8');
  if (!js.includes('loadCampaignData')) {
    throw new Error('loadCampaignData function not found');
  }
});

// ===== TEST 3: Popup Files =====
console.log('\n🎈 Test 3: Popup Files');

test('popup.html exists', () => {
  if (!fs.existsSync(path.join(extPath, 'popup', 'popup.html'))) {
    throw new Error('popup.html not found');
  }
});

test('popup.js exists', () => {
  if (!fs.existsSync(path.join(extPath, 'popup', 'popup.js'))) {
    throw new Error('popup.js not found');
  }
});

test('popup.html has open-devtools button', () => {
  const html = fs.readFileSync(path.join(extPath, 'popup', 'popup.html'), 'utf8');
  if (!html.includes('open-devtools')) {
    throw new Error('open-devtools button not found');
  }
});

test('popup.js handles AI config', () => {
  const js = fs.readFileSync(path.join(extPath, 'popup', 'popup.js'), 'utf8');
  if (!js.includes('ctrb_ai_config')) {
    throw new Error('AI config handling not found');
  }
});

// ===== TEST 4: Background Script =====
console.log('\n📡 Test 4: Background Script');

test('background.js exists', () => {
  if (!fs.existsSync(path.join(extPath, 'background.js'))) {
    throw new Error('background.js not found');
  }
});

test('background.js has onInstalled listener', () => {
  const js = fs.readFileSync(path.join(extPath, 'background.js'), 'utf8');
  if (!js.includes('onInstalled')) {
    throw new Error('onInstalled listener not found');
  }
});

test('background.js has message listener', () => {
  const js = fs.readFileSync(path.join(extPath, 'background.js'), 'utf8');
  if (!js.includes('onMessage')) {
    throw new Error('onMessage listener not found');
  }
});

test('background.js handles GET_CONFIG', () => {
  const js = fs.readFileSync(path.join(extPath, 'background.js'), 'utf8');
  if (!js.includes('GET_CONFIG')) {
    throw new Error('GET_CONFIG message handler not found');
  }
});

test('background.js handles SAVE_CONFIG', () => {
  const js = fs.readFileSync(path.join(extPath, 'background.js'), 'utf8');
  if (!js.includes('SAVE_CONFIG')) {
    throw new Error('SAVE_CONFIG message handler not found');
  }
});

// ===== TEST 5: Integration =====
console.log('\n🔗 Test 5: Integration');

test('devtools references background messaging', () => {
  const js = fs.readFileSync(path.join(extPath, 'devtools', 'devtools.js'), 'utf8');
  if (!js.includes('chrome.runtime.onMessage')) {
    throw new Error('DevTools doesn\'t listen for background messages');
  }
});

test('popup references chrome.storage', () => {
  const js = fs.readFileSync(path.join(extPath, 'popup', 'popup.js'), 'utf8');
  if (!js.includes('chrome.storage.local')) {
    throw new Error('Popup doesn\'t use chrome.storage');
  }
});

test('All files use consistent config key', () => {
  const files = [
    path.join(extPath, 'devtools', 'devtools.js'),
    path.join(extPath, 'popup', 'popup.js'),
    path.join(extPath, 'background.js')
  ];
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    if (!content.includes('ctrb_ai_config')) {
      throw new Error(`${path.basename(file)} doesn\'t use ctrb_ai_config`);
    }
  }
});

// ===== TEST 6: Security =====
console.log('\n🔒 Test 6: Security');

test('manifest has host_permissions', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(extPath, 'manifest.json'), 'utf8'));
  if (!manifest.host_permissions || manifest.host_permissions.length === 0) {
    throw new Error('host_permissions not defined');
  }
});

test('OpenAI API uses https', () => {
  const js = fs.readFileSync(path.join(extPath, 'devtools', 'devtools.js'), 'utf8');
  if (!js.includes('https://api.openai.com')) {
    throw new Error('OpenAI API should use HTTPS');
  }
});

test('No eval() in extension code', () => {
  const files = [
    path.join(extPath, 'devtools', 'devtools.js'),
    path.join(extPath, 'popup', 'popup.js'),
    path.join(extPath, 'background.js')
  ];
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.match(/\beval\s*\(/)) {
      throw new Error(`${path.basename(file)} contains eval()`);
    }
  }
});

// ===== Summary =====
console.log('\n' + '='.repeat(50));
console.log(`📊 Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

if (failed === 0) {
  console.log('\n✅ All Chrome Extension tests passed!\n');
  console.log('📦 To install:');
  console.log('   1. Open chrome://extensions/');
  console.log('   2. Enable "Developer mode"');
  console.log('   3. Click "Load unpacked"');
  console.log(`   4. Select: ${extPath}\n`);
} else {
  console.log(`\n⚠️  ${failed} issue(s) found.\n`);
}

process.exit(failed > 0 ? 1 : 0);
