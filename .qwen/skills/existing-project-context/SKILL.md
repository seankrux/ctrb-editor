---
name: existing-project-context
description: Scan existing codebases, detect context, ask 3 targeted questions (not 10), then run 99% autonomously. Trigger when user says "continue", "pick up", "work on this", or opens existing project.
---

# 🔍 Existing Project Context Skill

## Purpose
**FOR EXISTING PROJECTS:** Scan codebase, detect context, ask 3 targeted questions (not 10), then run 99% autonomously.

---

## 🎯 When to Activate

### Auto-Activate Triggers
```
User says:
- "continue" / "pick up where I left off"
- "work on this" / "keep going"
- "finish X" (X is existing feature)
- "what was I doing?"

Context triggers:
- Git repo detected (not empty)
- package.json/requirements.txt exists
- Recent file modifications (< 7 days)
- User opens existing project folder
```

### DO NOT Activate For
```
- Fresh directory (no git, no config files)
- User explicitly says "new project"
- Empty folder
```

---

## 🔍 Context Scan (5 sec auto-scan)

### What Gets Scanned

```
📁 Project Structure
├─ package.json / requirements.txt → Stack detection
├─ .git/log → Last 5 commits (recent work)
├─ Modified files (< 7 days) → Active files
├─ TODO/FIXME comments → Pending work
├─ Test output → Failing tests
└─ Deploy configs → CI/CD status

📊 Patterns Detected
├─ Coding style (quotes, indentation, naming)
├─ Component structure
├─ API patterns (REST/GraphQL)
├─ Test framework (jest/pytest/etc.)
└─ Deploy workflow (Vercel/GitHub Actions)
```

### Scan Output Format

```json
{
  "project_name": "CTRB Json Editor",
  "stack": {
    "frontend": "html/js",
    "backend": "python",
    "detected_from": ["package.json", "requirements.txt"]
  },
  "active_files": [
    {
      "path": "ctrb_web_editor_v3.html",
      "last_modified": "2026-02-15T14:30:00Z",
      "status": "in_progress"
    },
    {
      "path": "ctrb_campaign_manager.py",
      "last_modified": "2026-02-14T10:00:00Z",
      "status": "recent"
    }
  ],
  "last_commits": [
    {
      "hash": "abc123",
      "message": "Add campaign form validation",
      "date": "2026-02-15T14:00:00Z"
    }
  ],
  "todos": [
    {
      "file": "ctrb_web_editor_v3.html",
      "line": 234,
      "text": "TODO: Add error handling for form submit"
    },
    {
      "file": "ctrb_web_editor_v3.html",
      "line": 456,
      "text": "FIXME: Campaign list not updating"
    }
  ],
  "failing_tests": [
    {
      "file": "test_campaigns.py",
      "test": "test_campaign_validation",
      "error": "AssertionError: expected 200, got 400"
    }
  ],
  "deploy_status": {
    "target": "vercel",
    "last_deploy": "2026-02-13T09:00:00Z",
    "status": "behind"
  }
}
```

---

## 📋 Targeted Discovery (3 Questions)

### Question Format

```
📋 CONTINUE DISCOVERY (30 sec)
─────────────────────────────────────────────────────────

Based on my scan:

1. CURRENT FOCUS
   You were editing: ctrb_web_editor_v3.html
   Last commit: "Add campaign form validation"
   
   Continue from here?
   → Yes / No, working on something else

2. NEXT STEP
   I found:
   □ Unfinished feature (campaign form validation)
   □ TODO comments (2 in code)
   □ Failing tests (1 test)
   □ New feature request
   
   What's the priority?

3. DEPLOY CHECK
   Last deploy: 2 days ago (Vercel)
   Auto-deploy after this session?
   → Yes (recommended) / No / Ask me

─────────────────────────────────────────────────────────
💡 Skip any = I'll auto-decide based on context
💡 Say "you decide" to auto-fill all
```

---

## 🧠 Smart Default Logic (For Existing Projects)

### Auto-Decide Rules

```
IF question skipped → Auto-decide based on:
─────────────────────────────────────────────────────────

1. CURRENT FOCUS (unknown)
   → Default: Most recently modified file
   → Why: Likely what user was working on

2. NEXT STEP (unknown)
   → Priority order:
     a. Fix failing tests (highest - blocks everything)
     b. Complete in-progress feature (from last commit)
     c. Address TODOs (technical debt)
     d. New feature (lowest - explicit request needed)
   → Why: Unblock → Finish → Cleanup → Expand

3. DEPLOY (unknown)
   → IF tests were passing last deploy → Auto-deploy
   → IF tests failing → No deploy (fix first)
   → IF first session → Ask user
   → Why: Match user's deploy pattern

4. FILES TO TOUCH (unknown)
   → Default: Active file + dependencies
   → Why: Minimize scope, stay focused
```

---

## 📄 Project Brief (Existing Projects)

### Output Format

```
┌─────────────────────────────────────────────────────────┐
│  📄 CONTINUE BRIEF - [project-name]                     │
├─────────────────────────────────────────────────────────┤
│  CONTEXT:                                                │
│  • Last work: ctrb_web_editor_v3.html (2h ago)          │
│  • Last commit: "Add campaign form validation"          │
│  • Active TODOs: 2                                       │
│  • Failing tests: 1                                      │
│                                                          │
│  TASK: Complete campaign form validation                 │
│  FILES: ctrb_web_editor_v3.html                          │
│  DEPLOY: Vercel (auto-deploy after session)              │
│                                                          │
│  AUTO-DECIDED (from context):                            │
│  • Focus → Most recent file (you edited 2h ago)         │
│  • Task → Finish last commit's feature                  │
│  • Deploy → Yes (matches your pattern)                  │
│                                                          │
│  PHASES:                                                 │
│  1. ✅ Fix failing test (blocks deploy)                 │
│  2. ⏳ Complete validation (in progress)                │
│  3. ⏳ Address TODOs (if time permits)                  │
│  4. ⏳ Deploy to Vercel (after tests pass)              │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  ✅ Context saved: .qwen/sessions/[timestamp].md        │
│  💡 Say "start" to begin OR "change X" to modify        │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Autonomous Execution Flow

### After User Says "start"

```
🌊 EXECUTION PHASE (99% autonomous)

Step 1: Fix Blockers
├─ Fix failing tests
├─ Run test suite
└─ ✅ Tests passing

Step 2: Complete Feature
├─ Finish in-progress work
├─ Address related TODOs
├─ Run validation
└─ ✅ Feature complete

Step 3: Validate
├─ Lint check
├─ Type check (if applicable)
├─ Test run
└─ ✅ Ready to commit

Step 4: Commit
├─ Stage changes
├─ Generate commit message
├─ Commit
└─ ✅ Changes committed

Step 5: Deploy (if approved)
├─ Trigger CI/CD
├─ Wait for deploy
└─ ✅ Live

Step 6: Wrap-up
├─ Session summary
├─ Update context for next session
└─ ✅ Done!

TOTAL TIME: 3-5 minutes (mostly waiting)
USER INTERACTIONS: 2 (discovery + "start")
```

---

## 🎮 User Commands

| Command | Action |
|---------|--------|
| `"vibe, continue"` | Scan + 3-question discovery |
| `"vibe, what was I doing?"` | Show last session context |
| `"vibe, finish X"` | Complete specific task |
| `"vibe, fix tests"` | Fix failing tests only |
| `"vibe, deploy"` | Deploy current state |
| `"vibe, show todos"` | List all TODOs in codebase |
| `"vibe, what's broken?"` | Show errors/failures |
| `"vibe, show context"` | Display full context scan |

---

## 🔄 Session Persistence

### Save Session Context

```json
{
  "session_id": "2026-02-17T15-30-00",
  "project": "CTRB Json Editor",
  "focus_file": "ctrb_web_editor_v3.html",
  "task": "Complete campaign form validation",
  "status": "in_progress",
  "changes_made": [
    "Fixed test_campaign_validation",
    "Added form error handling"
  ],
  "pending_work": [
    "TODO: Add loading states",
    "FIXME: Campaign list not updating"
  ],
  "next_session_hint": "User was completing campaign validation. 2 TODOs remain."
}
```

### Next Session Auto-Load

```
📋 WELCOME BACK!
─────────────────────────────────────────────────────────
Last session (2 days ago):
• You were: Completing campaign validation
• Status: In progress (80% done)
• Pending: 2 TODOs remaining

Continue where you left off? (y/n)
```

---

## 🚨 Edge Cases

### Multiple Active Files

```
📋 You have 3 active files:
   1. ctrb_web_editor_v3.html (edited 2h ago)
   2. ctrb_campaign_manager.py (edited 1d ago)
   3. testtemp.json (edited 3d ago)
   
   Which one to continue?
   → Say "1", "2", "3", or "all"
```

### No Recent Activity

```
📋 Last edit: 5 days ago
   Last commit: "Initial setup"
   
   Starting fresh or continue?
   → "fresh" (new feature)
   → "continue" (pick up where left off)
```

### Conflicting Context

```
⚠️ Mixed signals detected:
   • TODO says "add tests"
   • But tests are passing
   • And you edited HTML file
   
   What's the actual task?
   → "tests" (add more coverage)
   → "html" (continue editing)
   → "something else" (tell me)
```

### Large Codebase

```
📋 Large project detected (500+ files)
   
   Focus area?
   → "recent" (files edited < 7 days)
   → "active" (currently open files)
   → "specific" (tell me which folder)
```

---

## 🔗 Integration with Other Skills

### With project-discovery
```
IF new project → project-discovery (10 questions)
IF existing project → existing-project-context (3 questions)
```

### With quick-gen
```
Existing project → quick-gen uses existing templates/patterns
Detects: Component structure, naming conventions, style
```

### With code-validator
```
Existing project → code-validator checks against existing patterns
Not: Generic best practices
But: Project-specific conventions
```

### With github-wizard
```
Existing project → github-wizard uses existing repo
Detects: Remote URL, branch, last commit
```

### With config-guardian
```
Any config changes → config-guardian requires approval
Same rules as new projects
```

---

## ✅ Success Criteria

Existing project flow successful when:
- [ ] Context scan completes in < 5 sec
- [ ] Only 3 questions asked (not 10)
- [ ] Auto-decisions match user intent ≥90%
- [ ] No interruptions during execution
- [ ] Session context saved for next time
- [ ] User can say "continue" and pick up seamlessly

---

## 🔄 Example Flows

### Flow 1: Continue After Break

```
User: "vibe, continue"

🔍 CONTEXT SCAN (5 sec)
─────────────────────────────────────────────────────────
Detected:
• Project: CTRB Json Editor
• Last work: ctrb_web_editor_v3.html (2h ago)
• Task: Campaign form validation (in progress)
• Status: 80% complete, 1 failing test

📋 QUICK DISCOVERY (30 sec)
─────────────────────────────────────────────────────────
1. Continue campaign form? (y/n)
   → You were 80% done

2. Priority:
   □ Fix failing test (blocks deploy)
   □ Finish validation (almost done)
   
   Which first?

3. Auto-deploy after? (y/n)

User: "y, test first, y"

🚀 EXECUTION (3 min)
─────────────────────────────────────────────────────────
📝 [TEST] Fixing failing test...
📝 [FEATURE] Completing validation...
📝 [VALIDATE] Running lint...
📝 [COMMIT] "Finish campaign validation"...
📝 [DEPLOY] Deploying to Vercel...

✅ DONE
─────────────────────────────────────────────────────────
Test: Passing
Validation: Complete
Deployed: https://ctrb-editor.vercel.app

Session saved. Say "vibe" to continue!
```

### Flow 2: What Was I Doing

```
User: "vibe, what was I doing?"

📋 LAST SESSION CONTEXT
─────────────────────────────────────────────────────────
Date: 2026-02-15 (2 days ago)
Project: CTRB Json Editor
File: ctrb_web_editor_v3.html

You were:
• Adding campaign form validation
• 80% complete when session ended

Pending:
• Fix test_campaign_validation (failing)
• Add error handling (TODO)
• Deploy to Vercel (not deployed)

Continue from here? (y/n)
```

### Flow 3: Multiple Active Files

```
User: "vibe, continue"

🔍 CONTEXT SCAN
─────────────────────────────────────────────────────────
Found 3 active files:
1. ctrb_web_editor_v3.html (2h ago) - Campaign form
2. ctrb_campaign_manager.py (1d ago) - API routes
3. testtemp.json (3d ago) - Test data

📋 Which to continue?
   → Say "1", "2", "3", or file name

User: "1"

→ Continues with ctrb_web_editor_v3.html
```

---

## 💾 Implementation Notes

### Context Cache
```
Location: ~/.qwen/context/[project-hash].json
Update: On every session end
Expire: After 30 days of inactivity
```

### Project Hash
```
Hash based on:
- Git remote URL (if exists)
- Or: Project name + root path

Ensures same project = same context file
```

### Session History
```
Location: ~/.qwen/sessions/[project-hash]/
Format: Chronological JSON files
Keep: Last 50 sessions
```
