# 🧠 Stack Advisor Skill

## Purpose
**FIXES:** Wrong tech assumptions, no validation of tech choices

Recommend the right technology stack based on project requirements, constraints, and best practices.

---

## 🎯 When to Activate

### Auto-Activate Triggers
```
User says:
- "what stack should I use?"
- "recommend a..."
- "best way to build..."
- "should I use X or Y?"
- After project-discovery if user said "you choose"

Context triggers:
- project-discovery completed with "no preference"
- User seems unsure about tech choices
- Project requirements don't match assumed stack
```

### Manual Triggers
```
User says:
- "stack advisor"
- "tech recommendations"
- "what's best for..."
```

---

## 🧐 Requirements Analysis

### Input: Project Requirements
```
From user or project-discovery:

App Type: □ Web  □ Mobile  □ Desktop  □ API  □ Full-stack
Users: □ Personal  □ Team  □ Public  □ Enterprise
Auth: □ None  □ Simple  □ OAuth  □ SSO
Data: □ None  □ CRUD  □ Real-time  □ Files  □ Analytics
Deploy: □ Vercel  □ AWS  □ Self-host  □ Docker
Timeline: □ ASAP  □ This week  □ This month  □ No rush
Budget: □ Free  □ Some  □ Unlimited
Team: □ Solo  □ Small  □ Large
Scale: □ Prototype  □ MVP  □ Production
```

### Analysis Matrix
```
IF App Type = Web + Users = Public + Data = CRUD
THEN Recommend: Next.js + PostgreSQL + Auth

IF App Type = Mobile + Users = Public
THEN Recommend: React Native OR Flutter

IF App Type = API + Data = Real-time
THEN Recommend: Node.js + Socket.io OR Go + WebSocket

IF Timeline = ASAP + Budget = Free
THEN Recommend: Vercel + Supabase (free tiers)

IF Scale = Enterprise + Team = Large
THEN Recommend: Proven stack + strong typing + CI/CD
```

---

## 📚 Stack Recommendations

### Recommendation Format
```
┌─────────────────────────────────────────────────────────┐
│  🧠 STACK RECOMMENDATION                                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  For: [Project Name/Type]                               │
│                                                          │
│  PRIMARY RECOMMENDATION:                                │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Frontend: Next.js 14                           │   │
│  │  Language: TypeScript                           │   │
│  │  Styling: Tailwind CSS                          │   │
│  │  Backend: Next.js API Routes                    │   │
│  │  Database: PostgreSQL (via Supabase)            │   │
│  │  Auth: NextAuth.js (OAuth + Email)              │   │
│  │  Deploy: Vercel                                 │   │
│  │  Package: Bun                                   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  WHY THIS STACK:                                        │
│  ✅ Fast development (Next.js + Tailwind)               │
│  ✅ Type safety (TypeScript)                            │
│  ✅ Free tier available (Vercel + Supabase)             │
│  ✅ Easy deployment (one-click)                         │
│  ✅ Scales well (PostgreSQL)                            │
│  ✅ Great documentation                                 │
│                                                          │
│  ALTERNATIVES:                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Option B: Vue Stack                            │   │
│  │  Frontend: Nuxt.js 3 + Vue 3                    │   │
│  │  Same backend/deploy options                    │   │
│  │  Choose if: You prefer Vue over React           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Option C: Python Stack                         │   │
│  │  Frontend: React (Vite)                         │   │
│  │  Backend: FastAPI                               │   │
│  │  Database: PostgreSQL                           │   │
│  │  Choose if: You prefer Python                   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ⚠️ AVOID FOR THIS PROJECT:                             │
│  • Heavy frameworks (too complex for MVP)               │
│  • Self-hosted databases (ops overhead)                 │
│  • Microservices (premature optimization)               │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  💡 Say "go with primary" or "tell me more about X"     │
└─────────────────────────────────────────────────────────┘
```

---

## 🔍 Stack Decision Matrix

### By Project Type

#### Landing Page / Marketing Site
```
Primary: Next.js + Tailwind + Vercel
Why: Fast, SEO-friendly, easy updates
Alternative: Astro (even faster, less JS)
Avoid: Heavy SPAs, complex backends
```

#### SaaS Web App
```
Primary: Next.js + TypeScript + Supabase + Stripe
Why: Full-featured, scales well, payment ready
Alternative: Nuxt + Firebase + Stripe
Avoid: Static sites, no-backend solutions
```

#### Dashboard / Admin Panel
```
Primary: Next.js + TypeScript + Tailwind + shadcn/ui
Why: Component-rich, type-safe, looks professional
Alternative: React + Material UI + Recharts
Avoid: Plain CSS, no component library
```

#### E-commerce
```
Primary: Next.js + Shopify Storefront API + Stripe
Why: Best of both worlds (custom + managed)
Alternative: Medusa.js (open-source Shopify)
Avoid: Building cart/payments from scratch
```

#### Mobile App
```
Primary: React Native + Expo + Supabase
Why: Cross-platform, fast dev, backend included
Alternative: Flutter + Firebase
Avoid: Native-only (unless specific needs)
```

#### API / Backend Only
```
Primary: FastAPI (Python) OR Hono (Node.js)
Why: Fast, typed, great DX
Alternative: Go + Gin (performance)
Avoid: Heavy frameworks for simple APIs
```

#### Real-time App (Chat, Live)
```
Primary: Next.js + Socket.io + Redis
Why: Real-time ready, scales well
Alternative: Supabase Realtime
Avoid: Polling-based solutions
```

---

## ⚖️ Trade-off Analysis

### Always Present Trade-offs
```
For each recommendation, explain:

SPEED vs CONTROL
- Next.js/Vercel: Fast dev, less control
- Self-hosted: More control, more ops

TYPE SAFETY vs FLEXIBILITY
- TypeScript: Catches bugs, more verbose
- JavaScript: Flexible, runtime errors

MANAGED vs SELF-HOSTED
- Supabase/Firebase: Easy, vendor lock-in
- Self-hosted DB: Control, more work

COMPONENT LIBRARY vs CUSTOM
- shadcn/MUI: Fast, less unique
- Custom CSS: Unique, more work
```

### Example Trade-off Display
```
┌─────────────────────────────────────────────────────────┐
│  ⚖️ TRADE-OFFS FOR YOUR PROJECT                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  NEXT.JS vs VUE                                         │
│  ┌──────────────────┬──────────────────┐               │
│  │ Next.js (React)  │ Vue/Nuxt         │               │
│  ├──────────────────┼──────────────────┤               │
│  │ Larger ecosystem │ Simpler learning │               │
│  │ More jobs        │ Faster rendering │               │
│  │ Better types     │ Easier migration │               │
│  │                  │                  │               │
│  │ → Choose if:     │ → Choose if:     │               │
│  │ You want jobs    │ You want simple  │               │
│  └──────────────────┴──────────────────┘               │
│                                                          │
│  MANAGED DB vs SELF-HOSTED                              │
│  ┌──────────────────┬──────────────────┐               │
│  │ Supabase         │ Self-hosted PG   │               │
│  ├──────────────────┼──────────────────┤               │
│  │ Free tier        │ Full control     │               │
│  │ Auto-scaling     │ Cost at scale    │               │
│  │ Built-in auth    │ More setup       │               │
│  │                  │                  │               │
│  │ → Choose if:     │ → Choose if:     │               │
│  │ MVP/Startup      │ Enterprise       │               │
│  └──────────────────┴──────────────────┘               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Constraint-Based Recommendations

### Budget Constraints
```
IF Budget = Free:
  → Vercel (free tier)
  → Supabase (free 500MB)
  → GitHub Actions (free 2000 min)
  → Cloudflare (free CDN)

IF Budget = Some ($50-200/mo):
  → Vercel Pro ($20)
  → Supabase Pro ($25)
  → Sentry ($26)
  → Domain + Email ($10)

IF Budget = Unlimited:
  → AWS/GCP (full services)
  → Dedicated databases
  → Premium tools (Datadog, etc.)
```

### Timeline Constraints
```
IF Timeline = ASAP (days):
  → Use templates/starters
  → Managed services only
  → Skip custom code where possible
  → Deploy day 1

IF Timeline = Weeks:
  → Can build custom components
  → Can self-host some services
  → Can iterate on design

IF Timeline = Months:
  → Can evaluate multiple options
  → Can build complex architecture
  → Can optimize for scale
```

### Team Constraints
```
IF Team = Solo:
  → Maximize managed services
  → Minimize ops work
  → Choose popular stacks (easy hiring later)

IF Team = Small (2-5):
  → Can handle some complexity
  → Can split frontend/backend
  → Can maintain CI/CD

IF Team = Large (10+):
  → Need strong typing
  → Need code standards
  → Need monorepo tools
  → Need documentation
```

---

## 📊 Stack Comparison Tables

### Frontend Frameworks
```
┌─────────────┬──────────┬──────────┬──────────┬──────────┐
│             │ React    │ Vue      │ Svelte   │ Solid    │
├─────────────┼──────────┼──────────┼──────────┼──────────┤
│ Learning    │ Medium   │ Easy     │ Easy     │ Medium   │
│ Performance │ Good     │ Good     │ Best     │ Best     │
│ Ecosystem   │ Largest  │ Large    │ Growing  │ Small    │
│ Jobs        │ Most     │ Some     │ Few      │ Few      │
│ TypeScript  │ Excellent│ Good     │ Good     │ Excellent│
│ Best For    │ Everything│ Simple  │ Small    │ Fast     │
│             │          │ apps     │ projects │ apps     │
└─────────────┴──────────┴──────────┴──────────┴──────────┘
```

### Backend Options
```
┌─────────────┬──────────┬──────────┬──────────┬──────────┐
│             │ Node.js  │ Python   │ Go       │ Rust     │
├─────────────┼──────────┼──────────┼──────────┼──────────┤
│ Speed       │ Fast     │ Slow     │ Fastest  │ Fastest  │
│ Ease        │ Easy     │ Easiest  │ Medium   │ Hard     │
│ Type Safety │ TS: Good │ Good     │ Good     │ Best     │
│ Ecosystem   │ Largest  │ Large    │ Growing  │ Small    │
│ Best For    │ Web APIs │ Data/ML  │ Systems  │ Systems  │
└─────────────┴──────────┴──────────┴──────────┴──────────┘
```

### Database Options
```
┌─────────────┬──────────┬──────────┬──────────┬──────────┐
│             │ Postgres │ MySQL    │ MongoDB  │ SQLite   │
├─────────────┼──────────┼──────────┼──────────┼──────────┤
│ Type        │ Relational│Relational│ Document │Relational│
│ Complexity  │ Medium   │ Medium   │ Easy     │ Easiest  │
│ Scale       │ Excellent│ Good     │ Good     │ Poor     │
│ Best For    │ Everything│ Web apps │ Flexible │ Local    │
│ Managed     │ Supabase │ PlanetScale│MongoDB Atlas│Turso│
└─────────────┴──────────┴──────────┴──────────┴──────────┘
```

---

## 🔗 Integration with Other Skills

### With project-discovery
```
project-discovery → gathers requirements
stack-advisor → recommends based on requirements
user selects → pass to quick-gen
```

### With quick-gen
```
stack-advisor output → quick-gen template selection

{
  "stack": "nextjs",
  "language": "typescript",
  "styling": "tailwind",
  "database": "supabase"
}
→ Selects: templates/nextjs-supabase/
```

### With vibe-validator
```
stack-advisor → defines what "correct" looks like
vibe-validator → checks code matches stack conventions
```

### With tool-manager
```
stack-advisor → identifies needed tools
tool-manager → connects those tools

Example:
Stack includes Supabase → tool-manager connects Supabase MCP
```

---

## 💾 Learning from Choices

### Track User Selections
```
When user chooses stack:

{
  "date": "2026-02-17",
  "project": "modern-app-v1",
  "recommended": "nextjs+ts+tailwind+supabase",
  "chosen": "nextjs+ts+tailwind+supabase",
  "match": true
}

IF user frequently chooses differently:
  → Adjust future recommendations
  → Ask why they chose differently
```

### Improve Recommendations
```
IF user rejects recommendation 3+ times:
  → Ask: "What didn't you like about my suggestions?"
  → Update recommendation logic

IF user always chooses X over Y:
  → Prioritize X in future recommendations
```

---

## 🎮 User Commands

| Command | Action |
|---------|--------|
| `"recommend a stack"` | Full recommendation |
| `"X vs Y"` | Compare two technologies |
| `"best for [use case]"` | Use-case specific advice |
| `"what about X?"` | Evaluate specific technology |
| `"change stack"` | Reconsider with new constraints |
| `"why X?"` | Explain reasoning behind recommendation |

---

## 📋 Example Flows

### Flow 1: User Asks for Recommendation
```
User: "What stack should I use for a SaaS dashboard?"

stack-advisor activates:

🧠 Analyzing requirements...

┌─────────────────────────────────────────────────────────┐
│  🧠 STACK RECOMMENDATION                                │
├─────────────────────────────────────────────────────────┤
│  For: SaaS Dashboard                                    │
│                                                          │
│  PRIMARY: Next.js 14 + TypeScript + Tailwind            │
│           + shadcn/ui + Supabase                        │
│                                                          │
│  WHY:                                                    │
│  ✅ Dashboard-friendly components (shadcn/ui)           │
│  ✅ Type-safe (TypeScript)                              │
│  ✅ Fast iteration (Next.js + Tailwind)                 │
│  ✅ Backend included (Supabase)                         │
│  ✅ Easy deploy (Vercel)                                │
│                                                          │
│  ALTERNATIVE: Vue 3 + Nuxt + Element Plus               │
│  Choose if: You prefer Vue ecosystem                    │
│                                                          │
│  Say "go with primary" or "tell me more"                │
└─────────────────────────────────────────────────────────┘
```

### Flow 2: User Comparing Options
```
User: "Next.js vs Nuxt?"

🧠 Comparison:

┌─────────────────┬─────────────────┐
│ Next.js (React) │ Nuxt (Vue)      │
├─────────────────┼─────────────────┤
│ Larger ecosystem│ Simpler API     │
│ More jobs       │ Faster learning │
│ Better types    │ Good enough types│
│ Industry standard│ Growing         │
│                 │                 │
│ → Choose Next.js if:              │
│ You want jobs, ecosystem, types   │
│                                   │
│ → Choose Nuxt if:                 │
│ You want simpler, faster, Vue     │
└─────────────────┴─────────────────┘

For your SaaS dashboard: Next.js (more component libraries)
```

### Flow 3: User Has Specific Constraint
```
User: "I need to use Python for the backend"

🧠 Python-first recommendation:

┌─────────────────────────────────────────────────────────┐
│  🐍 PYTHON STACK RECOMMENDATION                         │
├─────────────────────────────────────────────────────────┤
│  Frontend: React (Vite) or Next.js                     │
│  Backend: FastAPI (modern, fast, typed)                │
│  Database: PostgreSQL + SQLAlchemy                     │
│  Deploy: Railway or Render (Python-friendly)           │
│                                                          │
│  WHY FASTAPI:                                           │
│  ✅ Modern Python (3.10+)                               │
│  ✅ Automatic OpenAPI docs                              │
│  ✅ Type validation (Pydantic)                          │
│  ✅ Async support                                       │
│  ✅ Easy testing                                        │
│                                                          │
│  ALTERNATIVES:                                          │
│  • Django: More batteries, heavier                      │
│  • Flask: Simpler, less structure                       │
│  • FastAPI: Best balance for APIs                       │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Success Criteria

Stack recommendation is successful when:
- [ ] User understands WHY this stack was recommended
- [ ] User sees alternatives and trade-offs
- [ ] Recommendation matches project constraints
- [ ] User can make informed decision
- [ ] User says "got it" or "makes sense" or "let's go"

---

## 🚨 Edge Cases

### User Insists on Wrong Technology
```
User: "I want to use MongoDB for everything"

Response:
"⚠️ Heads up: MongoDB might not be ideal for your use case.

Your project needs:
- Complex relationships (users → orders → products)
- Transactions (payments)
- Joins (reporting)

MongoDB is better for:
- Document storage (content, logs)
- Flexible schemas
- Horizontal scaling

PostgreSQL would be better here because:
- Relational data fits your model
- ACID transactions for payments
- Better for complex queries

Still want MongoDB? I can make it work, just want you to know.
```

### User Has No Preference and No Knowledge
```
User: "I don't know any of this, just pick something good"

Response:
"No problem! Here's my safest recommendation:

🏆 DEFAULT STACK (can't go wrong):
- Next.js (most popular, great docs)
- TypeScript (catches bugs early)
- Tailwind (looks good fast)
- Supabase (free, easy backend)
- Vercel (one-click deploy)

This stack is used by thousands of companies.
Great documentation. Easy to hire for.

Want me to start with this? (y/n)
```

### Requirements Change Mid-Project
```
User: "Actually, we need mobile apps too"

Response:
"📝 [STACK CHANGE] Adding mobile to requirements

Options:

1. React Native (best with your current stack)
   - Share code with Next.js
   - Same React patterns
   - Expo for easy dev

2. Keep web only for now
   - Make responsive design
   - Add mobile app later

3. Flutter (if you want native feel)
   - Separate codebase
   - Better native integration

Recommendation: Option 1 (React Native)
- Reuse your React knowledge
- Share types/logic
- Fast to market

Want to add React Native? (y/n/later)
```
