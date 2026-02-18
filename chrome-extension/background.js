// CTRBooster AI - Background Service Worker

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('CTRBooster AI installed:', details.reason);
  
  // Initialize storage
  chrome.storage.local.set({
    ctrb_ai_config: {
      apiKey: '',
      model: 'gpt-4o-mini',
      useLocalAI: false,
      localEndpoint: 'http://localhost:11434/v1/chat/completions',
      localModel: 'llama3.1'
    }
  });
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_CONFIG') {
    chrome.storage.local.get(['ctrb_ai_config'], (result) => {
      sendResponse({ config: result.ctrb_ai_config });
    });
    return true; // Keep channel open for async response
  }
  
  if (message.type === 'SAVE_CONFIG') {
    chrome.storage.local.set({ ctrb_ai_config: message.config }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (message.type === 'CAMPAIGN_DATA') {
    // Forward campaign data to DevTools panel
    chrome.runtime.sendMessage({
      type: 'CAMPAIGN_UPDATE',
      data: message.data
    }).catch(() => {
      // Panel might not be open
    });
    sendResponse({ received: true });
    return true;
  }

  sendResponse({});
});

// Context menu for quick actions
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'ctrb-analyze',
    title: 'Analyze with CTRBooster AI',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'ctrb-analyze') {
    chrome.tabs.sendMessage(tab.id, {
      type: 'ANALYZE_SELECTION',
      selection: info.selectionText
    });
  }
});
