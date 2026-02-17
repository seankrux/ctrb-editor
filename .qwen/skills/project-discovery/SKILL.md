---
name: project-discovery
description: Ask critical questions BEFORE creating new projects. Auto-detect new vs existing projects. 10 questions for new projects, 3 questions + context scan for existing projects. Trigger when user says "create", "build", "new project", or "start".
---

# 📋 Project Discovery Skill

## Purpose
**FIXES:** No requirements gathering, too many assumptions

Ask the right questions BEFORE coding to understand what user actually wants.

---

## 🎯 When to Activate

### Auto-Activate Triggers
```
User says:
- "create" / "build" / "make" / "scaffold"
- "new project" / "new app" / "start"
- "I need a..." / "want to build..."
- Vague requests like "modern app", "website", "dashboard"

DO NOT activate for:
- Small tasks ("add a button", "fix this bug")
- Continuing existing work → existing-project-context activates instead
- Clear, specific requests
```

### Manual Triggers
```
User says:
- "let me think about this"
- "what do I need?"
- "help me plan"
```

---

## 📝 Discovery Questionnaire

### Level 1: Quick (3 questions) - Default
```
📋 Quick Discovery (30 seconds)

1. What are we building?
   □ Web app  □ Mobile app  □ Desktop app  □ API/Backend
   □ Landing page  □ Dashboard  □ E-commerce  □ Other: ___

2. Who will use it?
   □ Just you  □ Team  □ Public users  □ Customers

3. Any must-have tech?
   □ React/Next.js  □ Vue/Nuxt  □ Python  □ Node.js
   □ Mobile (iOS/Android)  □ No preference, you choose

Or say "full discovery" for more detailed questions.
```

### Level 2: Full (8 questions) - When user says "full" or complex project
```
📋 Project Discovery

1. APP TYPE
   What are we building?
   □ Landing page (marketing site)
   □ Web app (interactive, users log in)
   □ Mobile app (iOS/Android)
   □ Desktop app (Mac/Windows/Linux)
   □ API/Backend (serves data)
   □ E-commerce (selling products)
   □ Dashboard (data visualization)
   □ SaaS product
   □ Other: _____

2. USERS
   Who will use this?
   □ Just you (personal project)
   □ Small team (< 10)
   □ Company internal (10-100)
   □ Public users (100+)
   □ Enterprise customers

3. AUTHENTICATION
   Do users need to log in?
   □ No auth needed
   □ Simple (email/password)
   □ OAuth (Google, GitHub, etc.)
   □ SSO (company login)
   □ WebAuthn (passkeys)
   □ Not sure yet

4. DATA & STORAGE
   What data are you storing?
   □ No data (static/frontend only)
   □ User profiles
   □ Content (posts, articles)
   □ Files/uploads
   □ Real-time data (chat, live updates)
   □ Analytics/tracking
   □ Payments/transactions

   Database preference?
   □ PostgreSQL  □ MongoDB  □ SQLite  □ Firebase/Supabase
   □ No preference  □ Don't need database

5. STYLING
   How should it look?
   □ Tailwind CSS (utility-first)
   □ Styled Components (CSS-in-JS)
   □ CSS Modules (scoped CSS)
   □ Material UI / Chakra (component library)
   □ Custom design system
   □ No preference

6. DEPLOYMENT
   Where should this live?
   □ Vercel (easiest for Next.js)
   □ Netlify (great for static)
   □ AWS (full control)
   □ Google Cloud
   □ My own server
   □ Docker container
   □ Not sure, you recommend

7. GITHUB
   Repository details?
   Organization: _____ (or personal)
   Repository name: _____
   Visibility: □ Public  □ Private
   Add CI/CD? □ Yes  □ No  □ Not sure

8. CONSTRAINTS
   Any limitations?
   Timeline: □ ASAP (prototype)  □ This week  □ This month  □ No rush
   Budget: □ Free tier only  □ Some budget  □ No limits
   Team: □ Solo  □ Pair  □ Small team  □ Large team

Or say "you choose" for sensible defaults.
Or say "skip" to start coding immediately.
```

### Level 3: Context-Aware (Auto-fill from history)
```
📋 Based on your history...

I see you usually work with:
- Frontend: Next.js + TypeScript
- Styling: Tailwind CSS
- Package manager: Bun
- Deploy: Vercel

Same stack for this project? (y/n)

If no, what's different this time?
```

---

## 🧠 Smart Defaults

### When User Says "You Choose"
```
Project Brief (Auto-generated):

Type: Web App
Stack: Next.js 14 + TypeScript + Tailwind CSS
Package: Bun (fastest)
Database: None (can add later)
Auth: None (can add later)
Deploy: Vercel (one-click)
GitHub: Private repo, your org

This is a solid starting point. We can add complexity as needed.

Ready to scaffold? (y/n)
```

### When User Says "Skip" / "Just start"
```
⚠️ Starting with minimal info. I'll make assumptions:

- Web app (Next.js + TypeScript + Tailwind)
- No backend (can add later)
- No auth (can add later)
- Deploy to Vercel

If any of these are wrong, say "stop" and I'll adjust.

Starting now...
```

---

## 📄 Output: Project Brief

### Generated Document
```
┌─────────────────────────────────────────────────────────┐
│  📄 PROJECT BRIEF                                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Name: modern-app-v1                                    │
│  Type: Web Application                                  │
│  Description: Modern web app for v1 release             │
│                                                          │
│  STACK:                                                 │
│  • Frontend: Next.js 14                                 │
│  • Language: TypeScript                                 │
│  • Styling: Tailwind CSS                                │
│  • Package Manager: Bun                                 │
│                                                          │
│  FEATURES:                                              │
│  • Authentication: None (phase 2)                       │
│  • Database: None (phase 2)                             │
│  • Real-time: No                                        │
│                                                          │
│  DEPLOYMENT:                                            │
│  • Target: Vercel                                       │
│  • Domain: TBD                                          │
│  • CI/CD: GitHub Actions                                │
│                                                          │
│  GITHUB:                                                │
│  • Repo: your-org/modern-app-v1                         │
│  • Visibility: Private                                  │
│  • Branch: main                                         │
│                                                          │
│  CONSTRAINTS:                                           │
│  • Timeline: ASAP (prototype first)                     │
│  • Budget: Free tier                                    │
│  • Team: Solo                                           │
│                                                          │
│  PHASES:                                                │
│  1. Scaffold + basic pages (today)                      │
│  2. Add authentication (next)                           │
│  3. Add database (later)                                │
│  4. Deploy to production (final)                        │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  ✅ Brief saved to: .qwen/projects/modern-app-v1.md     │
│  💡 Say "start" to begin scaffolding                    │
└─────────────────────────────────────────────────────────┘
```

---

## 💾 Preference Learning

### Save User Choices
```
After discovery, update ~/.qwen/preferences.json:

{
  "last_project": {
    "name": "modern-app-v1",
    "date": "2026-02-17",
    "stack": {
      "frontend": "nextjs",
      "language": "typescript",
      "styling": "tailwind",
      "package_manager": "bun"
    }
  },
  "patterns": {
    "preferred_stack": "nextjs+ts+tailwind",
    "auth_preference": "oauth",
    "deploy_preference": "vercel"
  },
  "defaults": {
    "repo_visibility": "private",
    "ci_cd": true,
    "ask_level": "quick"
  }
}
```

### Auto-Fill Future Discoveries
```
Next time user starts project:

📋 Based on your last project...

You used: Next.js + TypeScript + Tailwind + Vercel
Same stack? (y/n/change)

Last repo: your-org/modern-app-v1
Same org? (y/n/change)
```

---

## 🔗 Integration with Other Skills

### With existing-project-context
```
IF git repo exists AND recent modifications:
  → existing-project-context activates (3 questions)
ELSE:
  → project-discovery activates (10 questions)

Handoff:
- existing-project-context detects codebase
- project-discovery fills gaps for new features
```

### With quick-gen
```
project-discovery outputs → quick-gen inputs

Project Brief → Selects correct template
Stack choices → Configures template
Features → Adds/removes components
```

### With stack-advisor
```
User unsure → stack-advisor recommends
User has requirements → stack-advisor validates
```

### With github-wizard
```
Project Brief → GitHub repo details
Repo name, org, visibility → Passed to github-wizard
```

### With orchestrator
```
Discovery complete → Signal orchestrator
Orchestrator → Activates relevant skills
```

---

## 🎮 User Commands

| Command | Action |
|---------|--------|
| `"discover"` | Start discovery process |
| `"quick discovery"` | 3-question version |
| `"full discovery"` | 8-question version |
| `"you choose"` | Auto-fill with smart defaults |
| `"skip"` | Skip discovery, start coding |
| `"change [option]"` | Modify a choice |
| `"show brief"` | Display project brief |
| `"save brief"` | Save to file |

---

## 📊 Discovery Quality Metrics

### Track
```
- Time spent in discovery
- Questions answered vs skipped
- Changes made after discovery
- User satisfaction with outcome
```

### Improve
```
IF user changes stack after discovery:
  → Add clarification question for next time

IF user skips discovery often:
  → Make discovery faster/more optional

IF user satisfied with outcome:
  → Discovery worked, keep questions
```

---

## 🚨 Edge Cases

### User Is Impatient
```
User: "just start already"

Response:
"Starting with defaults (Next.js + TS + Tailwind).
Say 'stop' if you want different stack."
```

### User Doesn't Know Tech
```
User: "I don't know what those mean"

Response:
"No worries! Here's what I recommend:

For your use case (landing page for small business):
- Next.js (easy to deploy, fast)
- Tailwind (looks good, easy to customize)
- Vercel (free, one-click deploy)

Sound good? (y/n)"
```

### User Changes Mind Mid-Process
```
User: "actually, can we use Vue instead?"

Response:
"📝 [CHANGE] Stack updated: Next.js → Vue

No problem! Vue is great for this.
- Nuxt.js (Vue equivalent of Next.js)
- Same Tailwind styling
- Same Vercel deploy

Everything else the same? (y/n)"
```

---

## ✅ Success Criteria

Discovery is successful when:
- [ ] User confirms understanding of stack
- [ ] All critical questions answered (type, users, deploy)
- [ ] Project brief generated and saved
- [ ] User says "yes" or "start" or "looks good"
- [ ] No surprises during development

---

## 🔄 Example Flow

```
User: "I want to create a modern app"

project-discovery activates:

📋 Quick Discovery (30 seconds)

1. What are we building?
   □ Web app  □ Mobile app  □ API  □ Other

2. Who will use it?
   □ Just you  □ Team  □ Public  □ Customers

3. Any must-have tech?
   □ React  □ Vue  □ Python  □ No preference

User: "web app, just me, no preference"

📄 Generating Project Brief...

┌─────────────────────────────────────────────────────────┐
│  📄 PROJECT BRIEF                                       │
├─────────────────────────────────────────────────────────┤
│  Type: Web App (Personal)                               │
│  Stack: Next.js 14 + TypeScript + Tailwind              │
│  Deploy: Vercel                                         │
│  GitHub: Private repo                                   │
│                                                          │
│  Ready to scaffold? (y/n)                               │
└─────────────────────────────────────────────────────────┘

User: "y"

→ Signal orchestrator: discovery complete
→ Activate quick-gen with project brief
→ Start scaffolding
```
