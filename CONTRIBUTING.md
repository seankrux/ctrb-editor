# Contributing to CTRB-Editor

Thank you for contributing to CTRB-Editor! This guide helps you get started.

---

## 🚀 Quick Start

### Development Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/seankrux/CTRB-editor.git
   cd CTRB-editor
   ```

2. **Open in browser**
   ```bash
   open ctrb_web_editor_v4.html
   ```

3. **Make changes** - Edit `ctrb_web_editor_v4.html`

4. **Run tests**
   ```bash
   node ctrb_v4_smoke_test.js
   node test_full_cycle.js
   ```

---

## 📝 Code Style

### JavaScript

```javascript
// ✅ DO: Use const/let
const campaigns = [];
let selectedIds = new Set();

// ❌ DON'T: Use var
var campaigns = []; // Avoid

// ✅ DO: Use template literals
const msg = `Loaded ${count} campaigns`;

// ✅ DO: Escape HTML for user data
const safeName = this.escHtml(campaign.ProjectName);

// ✅ DO: Single app object
const app = {
    campaigns: [],
    init() {...},
    renderList() {...}
};
```

### Naming Conventions

```javascript
// Edit modal fields: e- prefix
<input id="e-ProjectName">
<input id="e-DailyLimit">

// Wizard fields: wiz- prefix
<input id="wiz-name">
<input id="wiz-url">

// Template IDs: tpl- prefix
id: "tpl-gmap-local"

// CSS classes: descriptive
.campaign-table-container
.btn-primary
.modal-overlay
```

### Line Length

```javascript
// ✅ DO: Break long lines
const errorMsg = `⚠️ ${errors.length} issue(s):\n\n` +
    `${errors.slice(0, 5).join('\n')}\n\n` +
    `Export anyway?`;

// ❌ DON'T: Single long line (>120 chars)
const errorMsg = `⚠️ ${errors.length} issue(s):\n\n${errors.slice(0, 5).join('\n')}\n\nExport anyway?`;
```

---

## 🧪 Testing

### Run All Tests

```bash
# Quick smoke tests (16 tests)
node ctrb_v4_smoke_test.js

# Full cycle test (import→edit→export→reimport)
node test_full_cycle.js

# Data integrity test
node test_data_integrity.js

# All tests
node ctrb_v4_smoke_test.js && node test_full_cycle.js && node test_data_integrity.js
```

### Add New Tests

Add to `ctrb_v4_smoke_test.js`:

```javascript
await test('Your test name', async () => {
    // Test code
    const result = await page.$('#element');
    if (!result) throw new Error('Element not found');
});
```

### Test Coverage

Ensure tests cover:
- [ ] Page load
- [ ] Create/Edit/Delete campaigns
- [ ] Import/Export
- [ ] Validation
- [ ] Bulk operations
- [ ] Keyboard shortcuts (ESC, Shift+click)
- [ ] Filter/Search
- [ ] Persistence (localStorage)

---

## 🐛 Bug Fixes

### Before Submitting

1. **Reproduce the bug**
2. **Identify root cause**
3. **Fix the issue**
4. **Add test case**
5. **Run all tests**

### Bug Fix Template

```javascript
// V4.X FIX: Describe what was fixed
// Issue: Description of the bug
// Fix: Description of the solution
bulkDelete() {
    // Get filtered view first
    const filter = searchInput.value.toLowerCase();
    let displayList = this.campaigns.filter(...);
    
    // Delete only selected in filtered view
    const selectedInFilter = displayList.filter(c => this.selectedIds.has(c.id));
    // ...rest of fix
}
```

---

## 📁 File Structure

```
CTRB-editor/
├── ctrb_web_editor_v4.html    # Main application
├── .qwen/                      # Qwen skills config
│   └── skills/
├── archive/                    # Historical versions
│   └── old-versions/
├── *.js                        # Test files
├── *.md                        # Documentation
└── package.json                # Dependencies
```

---

## 🔒 Security

### Required Practices

```javascript
// ✅ ALWAYS: Escape HTML for user data
const safeName = this.escHtml(campaign.ProjectName);

// ✅ ALWAYS: Sanitize on import
const sanitized = json.map(c => this.sanitizeCampaign(c));

// ✅ ALWAYS: Validate before export
const errors = this.validateCampaign(campaign);
if (errors.length > 0) { /* handle */ }

// ❌ NEVER: Use eval()
eval(userInput); // Security risk!

// ❌ NEVER: Direct innerHTML with user data
element.innerHTML = userInput; // XSS risk!
```

---

## 📤 Pull Request Process

### Before PR

- [ ] All tests passing
- [ ] No console errors
- [ ] Code follows style guide
- [ ] Documentation updated
- [ ] Bug fixes have test cases

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactor

## Testing
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guide
- [ ] No security issues
- [ ] Documentation updated
```

---

## 📚 Resources

- **Main App:** `ctrb_web_editor_v4.html`
- **Code Review:** `CODE_REVIEW_FINAL.md`
- **Bug Fixes:** `BUGFIXES_V4.1.md`
- **Tests:** `ctrb_v4_smoke_test.js`, `test_full_cycle.js`

---

## 🎯 Areas Needing Contribution

### High Priority
- [ ] Virtual scrolling for >5000 campaigns
- [ ] Campaign templates UI
- [ ] Advanced search filters

### Medium Priority
- [ ] Keyboard shortcuts documentation
- [ ] Performance optimization
- [ ] Browser compatibility tests

### Low Priority
- [ ] Dark/light theme toggle
- [ ] Export to CSV
- [ ] Campaign analytics dashboard

---

## 💬 Questions?

Open an issue on GitHub or contact the maintainer.

---

**Thank you for contributing!** 🎉
