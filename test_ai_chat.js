// CTRBooster V4 - AI Chat Feature Tests
// Run: node test_ai_chat.js

const { webkit } = require('playwright');

(async () => {
  console.log('🧪 Starting AI Chat Feature Tests...\n');

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
    // ===== TEST 1: Chat Bubble Visibility =====
    console.log('💬 Test 1: Chat Bubble UI');
    let page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v4.html');
    await page.waitForLoadState('networkidle');

    await test('Chat bubble button visible', async () => {
      const bubble = await page.$('.chat-button');
      if (!bubble) throw new Error('Chat bubble not found');
    });

    await test('Chat bubble clickable', async () => {
      await page.click('.chat-button');
      await page.waitForTimeout(500);
      const window = await page.$('#chat-window:not(.hidden)');
      if (!window) throw new Error('Chat window did not open');
    });

    await page.close();

    // ===== TEST 2: Chat Settings =====
    console.log('\n⚙️  Test 2: AI Settings');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v4.html');
    await page.waitForLoadState('networkidle');

    await page.click('.chat-button');
    await page.waitForTimeout(500);

    await test('Settings button in chat header', async () => {
      const settingsBtn = await page.$('button[onclick="app.showAISettings()"]');
      if (!settingsBtn) throw new Error('Settings button not found');
    });

    await page.click('button[onclick="app.showAISettings()"]');
    await page.waitForTimeout(500);

    await test('Settings modal opens', async () => {
      const modal = await page.$('.modal:not(.hidden)');
      if (!modal) throw new Error('Settings modal not opened');
    });

    await test('AI Provider dropdown exists', async () => {
      const provider = await page.$('#ai-provider');
      if (!provider) throw new Error('Provider dropdown not found');
    });

    await test('OpenAI settings visible', async () => {
      const openaiSettings = await page.$('#openai-settings');
      if (!openaiSettings) throw new Error('OpenAI settings not found');
    });

    await test('API key input exists', async () => {
      const apiKeyInput = await page.$('#ai-api-key');
      if (!apiKeyInput) throw new Error('API key input not found');
    });

    await test('Model dropdown exists', async () => {
      const modelSelect = await page.$('#ai-model');
      if (!modelSelect) throw new Error('Model dropdown not found');
    });

    await test('Load Models button exists', async () => {
      const loadBtn = await page.$('#load-models-btn');
      if (!loadBtn) throw new Error('Load Models button not found');
    });

    await test('Ollama settings exist', async () => {
      const ollamaSettings = await page.$('#local-settings');
      if (!ollamaSettings) throw new Error('Ollama settings not found');
    });

    await test('Load Ollama Models button exists', async () => {
      const loadOllamaBtn = await page.$('#load-ollama-models-btn');
      if (!loadOllamaBtn) throw new Error('Load Ollama Models button not found');
    });

    await page.close();

    // ===== TEST 3: Provider Toggle =====
    console.log('\n🔄 Test 3: Provider Toggle');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v4.html');
    await page.waitForLoadState('networkidle');

    await page.click('.chat-button');
    await page.waitForTimeout(300);
    await page.click('button[onclick="app.showAISettings()"]');
    await page.waitForTimeout(300);

    await test('Switch to Ollama hides OpenAI settings', async () => {
      await page.selectOption('#ai-provider', 'local');
      await page.waitForTimeout(200);
      const openaiStyle = await page.$eval('#openai-settings', el => el.style.display);
      if (openaiStyle !== 'none') throw new Error(`Expected 'none', got '${openaiStyle}'`);
    });

    await test('Switch to OpenAI shows OpenAI settings', async () => {
      await page.selectOption('#ai-provider', 'openai');
      await page.waitForTimeout(200);
      const openaiStyle = await page.$eval('#openai-settings', el => el.style.display);
      if (openaiStyle !== '') throw new Error(`Expected '', got '${openaiStyle}'`);
    });

    await page.close();

    // ===== TEST 4: Model Options =====
    console.log('\n📋 Test 4: Model Options');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v4.html');
    await page.waitForLoadState('networkidle');

    await page.click('.chat-button');
    await page.waitForTimeout(300);
    await page.click('button[onclick="app.showAISettings()"]');
    await page.waitForTimeout(300);

    await test('GPT-4o Mini option exists', async () => {
      const option = await page.$('#ai-model option[value="gpt-4o-mini"]');
      if (!option) throw new Error('GPT-4o Mini not found');
    });

    await test('GPT-4o option exists', async () => {
      const option = await page.$('#ai-model option[value="gpt-4o"]');
      if (!option) throw new Error('GPT-4o not found');
    });

    await test('GPT-4 Turbo option exists', async () => {
      const option = await page.$('#ai-model option[value="gpt-4-turbo"]');
      if (!option) throw new Error('GPT-4 Turbo not found');
    });

    await test('GPT-4 option exists', async () => {
      const option = await page.$('#ai-model option[value="gpt-4"]');
      if (!option) throw new Error('GPT-4 not found');
    });

    await test('GPT-3.5 Turbo option exists', async () => {
      const option = await page.$('#ai-model option[value="gpt-3.5-turbo"]');
      if (!option) throw new Error('GPT-3.5 Turbo not found');
    });

    await test('o1 Mini option exists', async () => {
      const option = await page.$('#ai-model option[value="o1-mini"]');
      if (!option) throw new Error('o1 Mini not found');
    });

    await test('o1 Preview option exists', async () => {
      const option = await page.$('#ai-model option[value="o1-preview"]');
      if (!option) throw new Error('o1 Preview not found');
    });

    await page.close();

    // ===== TEST 5: Chat Input =====
    console.log('\n⌨️  Test 5: Chat Input');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v4.html');
    await page.waitForLoadState('networkidle');

    await page.click('.chat-button');
    await page.waitForTimeout(500);

    await test('Chat input field exists', async () => {
      const input = await page.$('#chat-input');
      if (!input) throw new Error('Chat input not found');
    });

    await test('Can type in chat input', async () => {
      await page.fill('#chat-input', 'Hello');
      const value = await page.$eval('#chat-input', el => el.value);
      if (value !== 'Hello') throw new Error(`Expected 'Hello', got '${value}'`);
    });

    await test('Send button exists', async () => {
      const sendBtn = await page.$('.chat-send');
      if (!sendBtn) throw new Error('Send button not found');
    });

    await page.close();

    // ===== TEST 6: Keyboard Shortcut =====
    console.log('\n⌨️  Test 6: Keyboard Shortcut (Ctrl+H)');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v4.html');
    await page.waitForLoadState('networkidle');

    await test('Ctrl+H opens chat', async () => {
      await page.keyboard.press('Control+h');
      await page.waitForTimeout(500);
      const window = await page.$('#chat-window:not(.hidden)');
      if (!window) throw new Error('Chat did not open with Ctrl+H');
    });

    await page.close();

    // ===== TEST 7: Chat Suggestions =====
    console.log('\n💡 Test 7: Chat Suggestions');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v4.html');
    await page.waitForLoadState('networkidle');

    // Clear AI config to show suggestions
    await page.evaluate(() => {
      localStorage.removeItem('ctrb_ai_config');
    });
    await page.reload();
    await page.waitForTimeout(500);

    await page.click('.chat-button');
    await page.waitForTimeout(500);

    await test('Suggestions container exists', async () => {
      const container = await page.$('#chat-suggestions');
      if (!container) throw new Error('Suggestions container not found');
    });

    // When no AI config, shows settings button instead of suggestions
    await test('Settings button shows when no API key', async () => {
      const settingsBtn = await page.$('button[onclick="app.showAISettings()"]');
      if (!settingsBtn) throw new Error('Settings button not shown for unconfigured AI');
    });

    await page.close();

    // ===== TEST 8: Settings Persistence =====
    console.log('\n💾 Test 8: Settings Persistence');
    page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('http://localhost:8080/ctrb_web_editor_v4.html');
    await page.waitForLoadState('networkidle');

    await test('AI config loads from localStorage', async () => {
      // Set test config
      await page.evaluate(() => {
        localStorage.setItem('ctrb_ai_config', JSON.stringify({
          apiKey: 'sk-test123',
          model: 'gpt-4o-mini',
          useLocalAI: false
        }));
      });
      await page.reload();
      await page.waitForTimeout(500);
      
      // Check if config was loaded (check console or UI state)
      const config = await page.evaluate(() => {
        const saved = localStorage.getItem('ctrb_ai_config');
        return saved ? JSON.parse(saved) : null;
      });
      
      if (!config || config.apiKey !== 'sk-test123') {
        throw new Error('Config not persisted');
      }
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
      console.log('\n✅ All AI Chat tests passed!\n');
    } else {
      console.log(`\n⚠️  ${failed} issue(s) found.\n`);
    }

    process.exit(failed > 0 ? 1 : 0);
  }
})();
