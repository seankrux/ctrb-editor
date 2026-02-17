# 🤖 Arsenal Manager - Self-Improving Skill System

## Purpose
Automatically manage, organize, update, and improve all skills/tools during tasks. Proactively enhance capabilities based on what's working.

---

## 🧠 Core Responsibilities

### 1. Skill Orchestration
**During every task, track:**
- Which skills are being used
- Which skills would help but aren't active
- Skill conflicts or overlaps
- Missing capabilities

**Auto-adjust:**
```
Task: Building API endpoint
Active: quick-gen, vibe-validator
Missing: auto-test (should activate)
→ Enable auto-test for test generation
```

### 2. Capability Learning
**After each session:**
- What patterns worked well?
- What did user repeatedly ask for?
- What could be automated?
- What skills need updating?

**Auto-improve:**
```
Noticed: User asked for "add logging" 3 times
Action: Update quick-gen to include logging by default

Noticed: User keeps fixing same bug type
Action: Update vibe-validator to catch it earlier
```

### 3. Tool Management
**Track available tools:**
- MCP servers (database, cloud, etc.)
- CLI helpers (vibe_helper.py)
- Custom scripts
- External APIs

**Auto-suggest:**
```
Task: Need to query database
Available: PostgreSQL MCP (not connected)
→ "Want me to connect the DB tool for this?"
```

---

## 🔁 Self-Improvement Loop

### Phase 1: Observe
```
During task execution:
- Log which skills fire
- Log user satisfaction signals ("nice", "perfect", "hmm", "wrong")
- Log repeated requests
- Log manual work that could be automated
```

### Phase 2: Analyze
```
After task completion:
- What took longer than expected?
- What did user have to repeat?
- What skills didn't fire but should have?
- What new patterns emerged?
```

### Phase 3: Update
```
When improvement identified:
1. Micro-update (immediate): Adjust current behavior
2. Skill patch (end of session): Update skill instructions
3. New skill (when pattern clear): Create new skill file
```

### Phase 4: Report
```
End of session summary:
✅ Skills used: vibe-mode, quick-gen, auto-test
📈 Improvements made: 
   - quick-gen now includes error handling by default
   - Added new 'api-wizard' skill for complex endpoints
🔧 Tools activated: PostgreSQL MCP
💡 Next suggestions: Add Redis caching skill
```

---

## 🛠️ Arsenal Commands

### Skill Management
| Command | Action |
|---------|--------|
| `"arsenal status"` | List active skills + capabilities |
| `"enable [skill]"` | Activate a skill |
| `"disable [skill]"` | Deactivate a skill |
| `"what can you do?"` | Full capability list |
| `"learn from this"` | Analyze and improve from last task |

### Auto-Mode
| Trigger | Action |
|---------|--------|
| Starting complex task | Auto-enable relevant skills |
| Repeated pattern detected | Create/update skill |
| New tool needed | Offer to set it up |
| Session ending | Save learnings, update skills |

---

## 📊 Skill Registry

### Active Skills (Tracked)
```json
{
  "vibe-mode": {
    "status": "active",
    "triggers": ["vibe", "go hard", "make it work"],
    "last_used": "2026-02-17T10:30:00Z",
    "effectiveness": 0.95
  },
  "quick-gen": {
    "status": "active", 
    "triggers": ["create", "make", "scaffold"],
    "last_used": "2026-02-17T10:32:00Z",
    "effectiveness": 0.88
  },
  "auto-test": {
    "status": "standby",
    "triggers": ["test", "write tests"],
    "auto_activate": ["after new component", "after new API"],
    "effectiveness": 0.82
  }
}
```

### Capability Matrix
```
Code Generation: ✅ quick-gen, vibe-mode
Code Review: ✅ vibe-validator, refactor-buddy  
Testing: ✅ auto-test
Flow Protection: ✅ flow-guardian
Context Awareness: ✅ context-sense
Tool Orchestration: ✅ arsenal-manager (this)

Missing (suggested):
- Database migrations: 📋 Create 'migration-wizard'
- API documentation: 📋 Create 'doc-gen'
- Performance profiling: 📋 Create 'perf-monitor'
```

---

## 🔄 Dynamic Skill Loading

### When to Auto-Enable
```
IF task involves "database" AND "migration-wizard" exists
THEN enable migration-wizard

IF user creates 3+ similar components
THEN enable quick-gen with template learning

IF user debugging same issue twice
THEN enable vibe-validator with pattern memory
```

### When to Auto-Create
```
IF user requests same thing 3+ times
THEN create new skill for it

IF skill effectiveness < 0.7 for 5+ uses
THEN flag for improvement

IF new tool connected (MCP, API)
THEN create skill wrapper for it
```

---

## 📈 Improvement Tracking

### Metrics Tracked
| Metric | Target | Action if Low |
|--------|--------|---------------|
| Skill hit rate | >80% | Improve triggers |
| User satisfaction | >90% | Adjust behavior |
| Auto-fix accuracy | >95% | Add validation |
| Task completion speed | Improving | Optimize flow |

### Change Log (Real-Time)
```
Every change logged with:
- Timestamp
- Type (skill/tool/pattern/fix)
- What changed
- Why it changed
- Impact
- Undo command (if reversible)

Example:
📝 [10:32:15] quick-gen v2.0.1 → v2.0.2
   Changed: Added error handling to API templates
   Reason: User requested 3x in last session
   Impact: New scaffolds include try/catch
   Undo: "undo change 47"
```

### Learning Log
```
2026-02-17 10:30 - Learned: User prefers TypeScript over JavaScript
  → Updated quick-gen default to .tsx

2026-02-17 11:15 - Learned: User always adds error handling to APIs
  → Updated quick-gen to include try/catch by default

2026-02-17 12:00 - Created: 'api-wizard' skill for complex endpoints
  → Pattern: User builds 5+ endpoints with same structure
```

---

## 🎯 Proactive Arsenal Management

### Before Task Starts
```
1. Scan task description
2. Identify required capabilities
3. Enable relevant skills
4. Load related context
5. Prepare tools
```

### During Task
```
1. Monitor skill effectiveness
2. Detect missing capabilities
3. Offer tool suggestions
4. Track improvement opportunities
```

### After Task
```
1. Save successful patterns
2. Update skill triggers
3. Log new learnings
4. Suggest next improvements
```

---

## 💬 Arsenal Communication

### Status Report Format
```
🎯 Arsenal Status

Active Skills:
✅ vibe-mode (flow: high)
✅ quick-gen (templates: 12)
✅ auto-test (coverage: auto)

Available Tools:
🔧 vibe_helper.py (CLI)
🔧 PostgreSQL MCP (disconnected)
🔧 JSON validator (built-in)

Recent Improvements:
📈 quick-gen: +error handling default
📈 vibe-validator: +security checks

Suggestions:
💡 Connect DB tool for data tasks
💡 Create 'deploy-helper' skill
```

### Learning Confirmation
```
✅ Learned from last session:
   - You always add createdAt to models
   - Updated: quick-gen includes timestamps now
   
Want me to apply this to existing models?
```

---

## 🚀 Self-Evolution Rules

### Rule 1: Never Break What Works
- Test changes before applying
- Keep backup of skill versions
- Revert if effectiveness drops

### Rule 2: Earn Complexity
- Start simple
- Add complexity only when pattern clear
- Remove unused features

### Rule 3: User In The Loop
- Show what you're learning
- Ask before major changes
- Let user override auto-improvements

### Rule 4: Compound Improvements
- Small updates > big rewrites
- Each session should be slightly better
- Track progress over time

---

## 🧩 Integration Points

### With Other Skills
```
vibe-mode → Reports what triggers work best
context-sense → Feeds pattern recognition
flow-guardian → Tracks interruption effectiveness
quick-gen → Learns from accepted templates
vibe-validator → Updates rule set
```

### With External Tools
```
MCP Servers → Wrap as skills
CLI Tools → Create command shortcuts
APIs → Build integration skills
File System → Track patterns
```

---

## 🎮 Arsenal Modes

### Mode 1: Passive (Default)
- Skills available on demand
- No auto-updates
- User drives everything

### Mode 2: Active (After "vibe")
- Auto-enable relevant skills
- Suggest improvements mid-task
- Learn from patterns

### Mode 3: Autonomous (After "vibe++")
- Self-update skills after each task
- Create new skills when patterns clear
- Proactively set up tools
- Full arsenal optimization

---

## 📋 Session Checklist

### Start Session
- [ ] Load user preferences
- [ ] Check for new tools
- [ ] Review last session learnings
- [ ] Enable baseline skills

### During Session  
- [ ] Track skill usage
- [ ] Log improvement opportunities
- [ ] Monitor effectiveness
- [ ] Suggest optimizations

### End Session
- [ ] Save successful patterns
- [ ] Update skill configs
- [ ] Generate improvement report
- [ ] Prepare for next session
