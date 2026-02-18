// CTRBooster AI DevTools Panel

let chatHistory = [];
let aiConfig = null;

// Initialize
chrome.storage.local.get(['ctrb_ai_config'], (result) => {
  aiConfig = result.ctrb_ai_config;
  if (!aiConfig || !aiConfig.apiKey) {
    document.getElementById('config-notice').style.display = 'block';
  } else {
    addMessage('system', '🤖 CTRBooster AI connected! Ask me anything about your campaigns.');
  }
});

// Load campaign data from main page
async function loadCampaignData() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const app = window.app;
        if (!app) return null;
        return {
          campaigns: app.campaigns?.map(c => ({
            id: c.id,
            name: c.ProjectName,
            type: c.Type,
            status: c.Checked ? 'Active' : 'Paused',
            visits: c.numberOfVisits,
            daily: c.DailyLimit,
            done: c.doneVisits
          })) || [],
          selectedCount: app.selectedIds?.size || 0,
          totalCampaigns: app.campaigns?.length || 0
        };
      }
    });
    return results[0]?.result;
  } catch (error) {
    console.error('Failed to load campaign data:', error);
    return null;
  }
}

// Add message to chat
function addMessage(type, content) {
  const messages = document.getElementById('chat-messages');
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${type}`;

  const avatar = type === 'user'
    ? '<div class="avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>'
    : '<div class="avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/><path d="M9 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/><path d="M15 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg></div>';

  msgDiv.innerHTML = `
    ${type === 'user' ? '' : avatar}
    <div class="bubble">${escapeHtml(content)}</div>
    ${type === 'user' ? avatar : ''}
  `;

  messages.appendChild(msgDiv);
  messages.scrollTop = messages.scrollHeight;
}

// Escape HTML
function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Show typing indicator
function showTyping() {
  const messages = document.getElementById('chat-messages');
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message system';
  typingDiv.id = 'typing-indicator';
  typingDiv.innerHTML = `
    <div class="avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/></svg></div>
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  messages.appendChild(typingDiv);
  messages.scrollTop = messages.scrollHeight;
}

// Hide typing indicator
function hideTyping() {
  const typing = document.getElementById('typing-indicator');
  if (typing) typing.remove();
}

// Send message
async function sendMessage() {
  const input = document.getElementById('chat-input');
  const message = input.value.trim();
  if (!message) return;

  if (!aiConfig || !aiConfig.apiKey) {
    addMessage('system', '⚠️ Please configure your API key in the main editor first.');
    return;
  }

  addMessage('user', message);
  input.value = '';
  showTyping();

  try {
    // Load campaign data
    const campaignData = await loadCampaignData();

    // Build system prompt
    const systemPrompt = `You are a CTRBooster Campaign AI Assistant integrated in Chrome DevTools. You help users manage CTRBooster campaigns.

${campaignData ? `
CURRENT CAMPAIGNS (${campaignData.totalCampaigns} total):
${JSON.stringify(campaignData.campaigns.slice(0, 20), null, 2)}

${campaignData.selectedCount > 0 ? `SELECTED: ${campaignData.selectedCount} campaigns` : ''}
` : 'No campaign data available. The user may not be on the CTRBooster editor page.'}

CAMPAIGN TYPES:
- GSearch: Google Search traffic
- GMap: Google Maps engagement
- RefDVisit: Referral direct visit
- GSearchRef: Search + Referral
- DirectVisit: Direct website traffic

Provide concise, helpful responses. Use markdown formatting.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
      ...chatHistory.slice(-5)
    ];

    // Determine model parameters
    const model = aiConfig.model || 'gpt-4o-mini';
    const requestBody = {
      model: model,
      messages: messages
    };

    if (model.startsWith('o1') || model.includes('gpt-4o') || model.includes('gpt-4.5')) {
      requestBody.max_completion_tokens = 1000;
      if (!model.startsWith('o1')) {
        requestBody.temperature = 0.7;
        requestBody.stream = false;
      }
    } else {
      requestBody.temperature = 0.7;
      requestBody.max_tokens = 1000;
      requestBody.stream = false;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${aiConfig.apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'No response from AI';

    chatHistory.push({ role: 'user', content: message });
    chatHistory.push({ role: 'assistant', content: aiResponse });

    hideTyping();
    addMessage('system', aiResponse);

  } catch (error) {
    hideTyping();
    addMessage('system', `❌ Error: ${error.message}`);
  }
}

// Quick action
function sendQuickAction(action) {
  document.getElementById('chat-input').value = action;
  sendMessage();
}

// Handle Enter key
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

// Open main editor
function openMainEditor() {
  chrome.tabs.query({ url: '*ctrb_web_editor_v4.html*' }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.update(tabs[0].id, { active: true });
    } else {
      chrome.tabs.create({ url: chrome.runtime.getURL('../ctrb_web_editor_v4.html') });
    }
  });
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CAMPAIGN_UPDATE') {
    // Refresh campaign data when main page changes
    console.log('Campaign data updated');
  }
  sendResponse({});
});
