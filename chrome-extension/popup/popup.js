// CTRBooster AI Popup

// Check AI config status
chrome.storage.local.get(['ctrb_ai_config'], (result) => {
  const config = result.ctrb_ai_config;
  const statusDot = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');

  if (config && config.apiKey) {
    statusDot.classList.remove('inactive');
    statusText.textContent = `Connected • ${config.model}`;
  } else {
    statusDot.classList.add('inactive');
    statusText.textContent = 'Not configured';
  }
});

// Open DevTools panel (instructions)
document.getElementById('open-devtools').addEventListener('click', () => {
  alert('To open DevTools Panel:\n\n1. Press F12 or Cmd+Option+J (Mac) / Ctrl+Shift+J (Win)\n2. Click the ">>" icon in DevTools\n3. Select "CTRBooster AI"');
});

// Open campaign editor
document.getElementById('open-editor').addEventListener('click', () => {
  chrome.tabs.query({ url: '*ctrb_web_editor_v4.html*' }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.update(tabs[0].id, { active: true });
    } else {
      chrome.tabs.create({ url: chrome.runtime.getURL('../ctrb_web_editor_v4.html') });
    }
  });
});

// Configure AI
document.getElementById('configure-ai').addEventListener('click', () => {
  chrome.tabs.query({ url: '*ctrb_web_editor_v4.html*' }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.update(tabs[0].id, { active: true });
      setTimeout(() => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'OPEN_AI_SETTINGS' });
      }, 500);
    } else {
      alert('Please open the CTRBooster editor first, then click this button again.');
    }
  });
});
