# 🌊 VIBE FLOW - Autonomous Mode

## Core Principle
> Ask ALL critical questions ONCE at the start. Fill gaps with smart defaults. Run 99% autonomously.

---

## 📋 Pre-Flight Discovery (All Questions Upfront)

### When User Says "vibe" + Task

```
🌊 Vibe mode activated

📋 DISCOVERY PHASE (answer all at once, takes 60 sec)

CRITICAL QUESTIONS:
─────────────────────────────────────────────────────────
1. PROJECT TYPE
   What are we building?
   → Web app / Mobile app / API / Dashboard / Other
   
2. USERS
   Who will use this?
   → Just you / Team / Public / Customers
   
3. STACK PREFERENCE
   Any tech preferences?
   → Next.js / Vue / Python / No preference (auto-choose)
   
4. DEPLOY TARGET
   Where should it live?
   → Vercel / Netlify / Railway / AWS / Local only
   
5. GITHUB ORG
   GitHub org/username?
   → [auto-fill from last project if exists]
   
6. REPO VISIBILITY
   Public or private repo?
   → Public / Private
   
7. DATABASE NEEDED?
   Need to store data?
   → Yes (I'll suggest) / No / Not sure
   
8. AUTH NEEDED?
   Need user login?
   → Yes (I'll suggest) / No / Not sure
   
9. CI/CD?
   Auto-deploy on push?
   → Yes (recommended) / No
   
10. TIMELINE
    How fast do you need this?
    → ASAP (prototype) / This week / No rush
─────────────────────────────────────────────────────────

💡 Tip: Answer all at once. Skip any = I'll auto-decide.
💡 Say "you decide" to auto-fill everything.
```

---

## 🧠 Smart Default Logic (For Unanswered Questions)

### Auto-Decide Rules

```
IF question skipped → Auto-decide based on:
─────────────────────────────────────────────────────────

1. PROJECT TYPE (unknown)
   → Default: "Web app"
   → Why: Most common, easiest to deploy

2. USERS (unknown)
   → Default: "Just you"
   → Why: Safest, no auth/permissions needed

3. STACK (unknown)
   → Check ~/.qwen/preferences.json for last used
   → IF no history: Next.js 14 + TypeScript + Tailwind + Bun
   → Why: Best ecosystem, fastest iteration

4. DEPLOY (unknown)
   → IF Next.js → Vercel
   → IF Vue → Netlify
   → IF Python → Railway
   → Why: Best fit for each stack

5. GITHUB ORG (unknown)
   → Check last project in preferences.json
   → IF none: Use GitHub CLI to get current user
   → IF not authenticated: Ask once, then remember

6. VISIBILITY (unknown)
   → Default: Private
   → Why: Safer, can always make public later

7. DATABASE (unknown)
   → IF "dashboard" or "app" → Supabase (free, easy)
   → IF "landing page" → No database
   → Why: Match complexity to use case

8. AUTH (unknown)
   → IF "customers" or "public" → NextAuth
   → IF "just you" or "team" → Skip (add later)
   → Why: Don't over-engineer

9. CI/CD (unknown)
   → Default: Yes
   → Why: Zero effort, huge benefit

10. TIMELINE (unknown)
    → Default: ASAP (prototype first)
    → Why: Ship fast, iterate
```

---

## 📄 Project Brief (Generated After Discovery)

### Output Format

```
┌─────────────────────────────────────────────────────────┐
│  📄 PROJECT BRIEF - [project-name]                      │
├─────────────────────────────────────────────────────────┤
│  TYPE: Web App (Personal)                               │
│  STACK: Next.js 14 + TypeScript + Tailwind + Bun        │
│  DEPLOY: Vercel (auto-deploy on main)                   │
│  GITHUB: sean-ctrb/modern-app-v1 (private)              │
│  DATABASE: Supabase (free tier)                         │
│  AUTH: None (can add later)                             │
│  CI/CD: GitHub Actions (lint + test + deploy)           │
│                                                          │
│  AUTO-DECIDED (you didn't specify):                     │
│  • Database → Supabase (best for MVP)                   │
│  • Auth → None (add when needed)                        │
│  • Visibility → Private (safer default)                 │
│                                                          │
│  PHASES:                                                 │
│  1. ✅ Scaffold app (now)                               │
│  2. ⏳ Push to GitHub (after review)                    │
│  3. ⏳ Deploy to Vercel (after push)                    │
│  4. ⏳ Add database (when needed)                       │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  ✅ Brief saved: .qwen/projects/modern-app-v1.md        │
│  💡 Say "start" to begin OR "change X" to modify        │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Autonomous Execution Flow

### After User Says "start"

```
🌊 EXECUTION PHASE (99% autonomous)

Step 1: Scaffold
├─ quick-gen creates app from template
├─ code-validator runs lint + types
├─ auto-test generates tests
└─ ✅ Done (30-60 sec)

Step 2: Validate
├─ code-validator checks all files
├─ Shows validation report
├─ Auto-fixes obvious issues
└─ ✅ Ready to push

Step 3: GitHub
├─ github-wizard creates repo
├─ Initializes git
├─ Commits code
├─ Pushes to GitHub
└─ ✅ Live on GitHub

Step 4: Deploy
├─ ci-cd-builder adds workflows
├─ env-manager creates .env.example
├─ deploy-master triggers Vercel
└─ ✅ Live on vercel.app

Step 5: Wrap-up
├─ boot-summary shows session report
├─ arsenal-manager saves learnings
├─ preferences.json updated
└─ ✅ Done!

TOTAL TIME: 3-5 minutes (mostly waiting for builds)
USER INTERACTIONS: 2 (discovery + "start")
```

---

## 💬 Minimal Interruption Rules

### When to Interrupt (Critical Only)

```
✅ INTERRUPT for:
─────────────────────────────────────────────────────────
• GitHub auth required (can't proceed without)
• Deploy needs secrets (VERCEL_TOKEN, etc.)
• Validation fails with critical errors
• User explicitly said "ask me before X"

❌ DON'T INTERRUPT for:
─────────────────────────────────────────────────────────
• Stack choices (already decided in discovery)
• Minor lint warnings (auto-fix or log)
• File creation (logged, not blocked)
• Tool suggestions (show in wrap-up)
• Alternative approaches (log in brief)
```

### Interruption Format

```
🛑 PAUSE - Action Required
─────────────────────────────────────────────────────────
Issue: GitHub CLI not authenticated
Required: Must auth to create repo

Options:
1. Run: gh auth login (I'll guide you)
2. Skip GitHub (push later manually)
3. Use different repo name

Say 1, 2, or 3 (or ask "what's X?")
─────────────────────────────────────────────────────────
```

---

## 📊 Options Display (Visible Throughout)

### Always Show Available Choices

```
At any point, user can see:
─────────────────────────────────────────────────────────

Current Phase: [discovery | scaffold | validate | push | deploy]

Available Commands:
• "change [option]" - Modify discovery answer
• "skip" - Skip current step
• "stop" - Pause execution
• "status" - Show progress
• "what's next?" - Show remaining steps
• "why X?" - Explain current choice

Auto-Decisions Made:
• Database → Supabase (say "change database" to modify)
• Auth → None (say "add auth" to enable)
• Visibility → Private (say "make public" to change)
```

---

## 🧠 Learning & Adaptation

### After Each Session

```
📈 SESSION REPORT
─────────────────────────────────────────────────────────
Completed: modern-app-v1 scaffold + push + deploy

Auto-Decisions (you didn't specify):
✅ Database → Supabase (worked well)
✅ Auth → None (correct, not needed)
⚠️ Visibility → Private (you made public after)

Learnings:
• User prefers public repos (updating default)
• User likes Supabase (remembering preference)
• Discovery took 45 sec (good pace)

Next time:
• Will default to public repos
• Will suggest Supabase for similar projects
• Discovery will be 3 questions (you knew what you wanted)
```

---

## 🎯 Success Metrics

### 99% Autonomous Means

```
✅ User interactions per project: ≤3
   1. Discovery answers (60 sec)
   2. "start" command
   3. Optional: "deploy" confirmation

✅ Uninterrupted flow: ≥95%
   - Only critical blockers pause execution
   - All other info logged, not blocked

✅ Smart defaults accuracy: ≥90%
   - Tracked via user changes after auto-decide
   - Improves with each session

✅ Time to deployed app: ≤5 min
   - Discovery: 1 min
   - Scaffold: 1 min
   - Validate: 30 sec
   - Push: 30 sec
   - Deploy: 2 min (mostly waiting)
```

---

## 🔄 Example Full Flow

```
User: "vibe, create a modern app and push to github for v1"

🌊 Vibe mode activated

📋 DISCOVERY (60 sec - answer all at once)
─────────────────────────────────────────────────────────
10 questions displayed. User answers:

"web app, customers, no preference, vercel, 
 sean-ctrb, private, yes, yes, yes, ASAP"

OR user says: "you decide" → All auto-filled

📄 PROJECT BRIEF GENERATED
─────────────────────────────────────────────────────────
All choices shown. Auto-decisions highlighted.
User says: "start"

🚀 EXECUTION (3-5 min - no interruptions)
─────────────────────────────────────────────────────────
[Progress displayed, no blocking]

📝 [SCAFFOLD] Creating Next.js app...
📝 [VALIDATE] Running lint + types...
📝 [TESTS] Generating 16 tests...
📝 [GIT] Creating repo: sean-ctrb/modern-app-v1...
📝 [PUSH] Pushing to GitHub...
📝 [DEPLOY] Deploying to Vercel...

✅ COMPLETE (4 min 23 sec)

📈 SESSION REPORT
─────────────────────────────────────────────────────────
App live at: https://modern-app-v1.vercel.app
Repo: https://github.com/sean-ctrb/modern-app-v1

Auto-decisions: 3 (all correct)
Interruptions: 0
User interactions: 2 (discovery + "start")

Say "vibe" to continue building!
```

---

## 🎮 The Vibe Promise

```
You focus on the vision.
I'll handle everything else.

One discovery phase (all questions upfront).
Smart defaults for what you don't know.
Zero interruptions during execution.
Full visibility into all decisions.

99% autonomous. 100% transparent.
```

---

## 🌊 Existing Projects Flow

### Core Principle
> **New projects:** 10 questions (know nothing)
> **Existing projects:** Scan context + 3 questions (know most from code)

---

### Phase 1: Auto-Scan (5 sec)

```
User: "vibe, continue working on this"

🔍 CONTEXT SCAN (automatic):
├─ Read package.json / requirements.txt
├─ Check .git history (last commits)
├─ Scan recent files (what you were editing)
├─ Detect stack (React/Vue/Python/etc.)
├─ Find TODOs (pending work)
├─ Check for errors (lint/test failures)
└─ Detect deploy config (Vercel, GitHub Actions)
```

---

### Phase 2: Targeted Discovery (3 questions, not 10)

```
📋 QUICK DISCOVERY (30 sec)
─────────────────────────────────────────────────────────
Based on my scan:

1. CURRENT FOCUS
   You were editing: ctrb_web_editor_v3.html
   Last commit: "Added campaign form"
   
   Continue from here? 
   → Yes / No, working on something else

2. NEXT STEP
   I found:
   □ Unfinished feature (campaign form validation)
   □ TODO comments (3 in code)
   □ Failing tests (2 tests)
   □ New feature request
   
   What's the priority?

3. DEPLOY CHECK
   Last deploy: 2 days ago (Vercel)
   Auto-deploy after this session?
   → Yes / No / Ask me
─────────────────────────────────────────────────────────

💡 Skip any = I'll auto-decide based on context
💡 Say "you decide" to auto-fill everything
```

---

### Phase 3: Smart Defaults (Auto-Decided from Context)

```
AUTO-FILLED (from scanning your code):
─────────────────────────────────────────────────────────
• Stack: Detected HTML/JS (no changes needed)
• Files: ctrb_web_editor_v3.html (active file)
• Task: Complete campaign form validation (from TODO)
• Tests: Fix 2 failing tests (from test output)
• Deploy: Yes (matches your pattern)

Say "change X" if anything is wrong
```

---

### Phase 4: Execution (99% autonomous - same as new projects)

```
🚀 EXECUTION (no interruptions):
├─ Complete the feature
├─ Fix failing tests
├─ Run validation
├─ Commit changes
└─ Deploy (if approved)

Progress shown, no blocking
```

---

### Comparison: New vs Existing

| Aspect | New Project | Existing Project |
|--------|-------------|------------------|
| **Discovery** | 10 questions | 3 questions |
| **Context** | None (ask everything) | Auto-scanned (5 sec) |
| **Defaults** | Best practices | Existing code patterns |
| **Stack** | User specifies / auto-decide | Detected from codebase |
| **Files** | Create from templates | Edit existing files |
| **Tests** | Generate new | Fix failing + add coverage |
| **Deploy** | Setup CI/CD | Trigger existing pipeline |
| **Time** | 60 sec discovery | 30 sec discovery |

---

### Example: Existing Project Flow

```
User: "vibe, continue this"

🔍 CONTEXT SCAN (5 sec)
─────────────────────────────────────────────────────────
Detected:
• Project: CTRB Json Editor
• Stack: HTML/JS (no framework)
• Active file: ctrb_web_editor_v3.html
• Last edit: Campaign form component
• TODOs: 3 (validation, error handling, tests)
• Tests: 2 failing
• Last deploy: 2 days ago

📋 QUICK DISCOVERY (30 sec)
─────────────────────────────────────────────────────────
1. Continue campaign form? (y/n)
   → You were adding validation

2. Priority:
   □ Finish validation (in progress)
   □ Fix failing tests (2 tests)
   □ Add error handling (TODO)
   
   User: "tests first"

3. Auto-deploy after? (y/n)
   → User: "y"

🚀 EXECUTION (3 min, 99% autonomous)
─────────────────────────────────────────────────────────
📝 [TESTS] Fixing 2 failing tests...
📝 [FEATURE] Adding campaign validation...
📝 [VALIDATE] Running lint...
📝 [COMMIT] "Fix tests + add validation"...
📝 [DEPLOY] Deploying to Vercel...

✅ DONE (3 min)
─────────────────────────────────────────────────────────
Tests: 2/2 passing
Validation: Complete
Deployed: https://ctrb-editor.vercel.app

Session saved. Say "vibe" to continue!
```

---

### Commands for Existing Projects

| Command | Action |
|---------|--------|
| `"vibe, continue"` | Scan + 3-question discovery |
| `"vibe, what was I doing?"` | Show last session context |
| `"vibe, finish X"` | Complete specific task |
| `"vibe, fix tests"` | Fix failing tests only |
| `"vibe, deploy"` | Deploy current state |
| `"vibe, show todos"` | List all TODOs in codebase |
| `"vibe, what's broken?"` | Show errors/failures |
