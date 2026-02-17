# 🔍 Code Validator Skill

## Purpose
**FIXES:** No actual validation of generated code, fake "ESLint passing" claims

Run real validation: lint, type-check, test, and security scans on generated code.

---

## 🎯 When to Activate

### Auto-Activate Triggers
```
User says:
- "validate this" / "check for errors"
- "run lint" / "run tests"
- "is this correct?"

Context triggers:
- After quick-gen creates code
- Before github-wizard pushes
- Before deploy-master deploys
```

---

## 🔍 Validation Checks

### 1. Lint Check
```bash
# Run ESLint
bun run lint

# Parse output for errors
IF errors > 0:
  → Show errors with line numbers
  → Offer to auto-fix
  → Block push until fixed
```

### 2. Type Check
```bash
# Run TypeScript
bun run type-check

# Parse output for errors
IF errors > 0:
  → Show type errors
  → Explain what's wrong
  → Offer fixes
```

### 3. Test Run
```bash
# Run tests
bun run test --coverage

# Parse output
IF failures > 0:
  → Show failing tests
  → Show stack traces
  → Offer to fix
```

### 4. Build Check
```bash
# Run build
bun run build

# Parse output
IF build fails:
  → Show build errors
  → Check for common issues
  → Offer fixes
```

---

## 📋 Validation Report

### Output Format
```
┌─────────────────────────────────────────────────────────┐
│  🔍 CODE VALIDATION REPORT                              │
├─────────────────────────────────────────────────────────┤
│  Project: modern-app-v1                                 │
│  Files checked: 24                                      │
│  Time: 3.2s                                             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ✅ ESLint: PASSING (0 errors, 2 warnings)              │
│  ✅ TypeScript: PASSING (0 errors)                      │
│  ✅ Tests: PASSING (16/16 tests)                        │
│  ✅ Build: PASSING (optimized successfully)             │
│                                                          │
│  ⚠️ Warnings:                                           │
│  • src/components/Button.tsx:4 - Unused import          │
│  • src/app/page.tsx:12 - Missing key prop               │
│                                                          │
│  💡 Suggestions:                                        │
│  • Add error boundary to app layout                     │
│  • Consider adding more test coverage (currently 78%)   │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  ✅ Code is ready to push!                              │
│  ⚠️ Fix warnings before production? (y/n)               │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Auto-Fix Capabilities

### ESLint Auto-Fix
```bash
bun run lint --fix

# Track what was fixed
📝 [AUTO-FIX] Fixed 3 linting issues:
   • Added missing key props
   • Removed unused imports
   • Fixed indentation
```

### Import Organizer
```bash
# Sort imports
bunx sort-package-json

📝 [AUTO-FIX] Organized imports in 5 files
```

### Format Code
```bash
# Run Prettier
bunx prettier --write .

📝 [AUTO-FIX] Formatted 24 files
```

---

## 🎮 User Commands

| Command | Action |
|---------|--------|
| `"validate"` | Run all checks |
| `"run lint"` | ESLint only |
| `"run tests"` | Tests only |
| `"check types"` | TypeScript only |
| `"fix all"` | Auto-fix everything |
| `"show errors"` | Display current errors |

---

## ✅ Success Criteria

Validation successful when:
- [ ] All checks run (lint, types, tests, build)
- [ ] Errors clearly displayed
- [ ] Auto-fix offered and working
- [ ] Pass/fail status unambiguous
- [ ] Ready to push/deploy confirmed
