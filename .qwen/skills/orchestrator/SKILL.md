---
name: orchestrator
description: Coordinate all skills and tools as a unified system. Self-aware, self-improving, proactively optimizes the entire arsenal during task execution. Auto-enables relevant skills based on task type.
---

# 🧠 ORCHESTRATOR - Meta-Skill Controller

## Purpose
Coordinate all skills and tools as a unified system. Self-aware, self-improving, and proactively optimizes the entire arsenal during task execution.

---

## 🎯 Core Functions

### 1. Skill Activation Matrix
```
Task Type → Auto-Enable Skills
─────────────────────────────────────────────────────────────
Coding      → vibe-mode, quick-gen, vibe-validator, auto-test, code-validator
Debugging   → context-sense, vibe-validator, flow-guardian, code-validator
Refactoring → refactor-buddy, context-sense, auto-test, code-validator
Building    → vibe-mode, quick-gen, tool-manager, arsenal-manager, project-discovery, stack-advisor
New Project → project-discovery → stack-advisor → quick-gen → code-validator → github-wizard → ci-cd-builder
Deploying   → code-validator → github-wizard → deploy-master, ci-cd-builder
Learning    → context-sense, flow-guardian, stack-advisor
Config      → config-guardian (ALWAYS before any config modification)
```

### 2. Dynamic Capability Graph
```
                    ┌─────────────────┐
                    │   ORCHESTRATOR  │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼────┐        ┌────▼────┐        ┌────▼────┐
    │ Skills  │        │  Tools  │        │ Context │
    └────┬────┘        └────┬────┘        └────┬────┘
         │                   │                   │
    ┌────┴────┐        ┌────┴────┐        ┌────┴────┐
    │vibe-mode│        │  MCP    │        │ Session │
    │quick-gen│        │  CLI    │        │ History │
    │validator│        │  API    │        │ Patterns│
    └─────────┘        └─────────┘        └─────────┘
```

### 3. Self-Improvement Engine
```
┌──────────────────────────────────────────────────────┐
│                  IMPROVEMENT LOOP                    │
│                                                      │
│  Observe → Analyze → Update → Report → Repeat       │
│     │          │         │         │                 │
│     │          │         │         └─→ User visible │
│     │          │         └─→ Skill configs          │
│     │          └─→ Pattern detection                │
│     └─→ Raw telemetry                               │
└──────────────────────────────────────────────────────┘
```

---

## 🔄 Execution Flow

### Phase 1: Task Intake
```
Input: User request (any form)
       ↓
[Parse intent]
       ↓
[Identify task type]
       ↓
[Check context: files, session, history]
       ↓
Output: Task profile
```

### Phase 2: Arsenal Setup
```
Task profile
       ↓
[Query skill registry]
       ↓
[Enable required skills]
       ↓
[Check tool availability]
       ↓
[Connect needed tools]
       ↓
Output: Ready arsenal
```

### Phase 3: Execution Monitoring
```
During task:
├─ Track skill effectiveness
├─ Detect missing capabilities
├─ Monitor user satisfaction signals
├─ Log patterns and anomalies
└─ Adjust in real-time
```

### Phase 4: Post-Task Learning
```
Task complete
       ↓
[Analyze what worked]
       ↓
[Identify improvements]
       ↓
[Update skill configs]
       ↓
[Save patterns]
       ↓
[Report to user]
```

---

## 📊 State Management

### Global State
```javascript
ORCHESTRATOR_STATE = {
  session: {
    id: "2026-02-17-001",
    start: "2026-02-17T09:00:00Z",
    tasks_completed: 12,
    vibe_mode: true
  },
  
  skills: {
    active: ["vibe-mode", "quick-gen", "auto-test"],
    standby: ["refactor-buddy"],
    disabled: [],
    effectiveness: {
      "vibe-mode": 0.95,
      "quick-gen": 0.88,
      "auto-test": 0.82
    }
  },
  
  tools: {
    connected: ["file_system", "json_validator"],
    available: ["vibe_helper.py"],
    disconnected: ["postgresql", "docker"]
  },
  
  context: {
    current_file: "ctrb_campaign_manager.py",
    recent_files: ["testtemp.json", "CAMPAIGN_EXAMPLES.json"],
    open_tasks: [],
    patterns_detected: ["json_editing", "campaign_validation"]
  },
  
  learnings: [
    {
      timestamp: "2026-02-17T10:30:00Z",
      type: "pattern",
      description: "User always adds createdAt to models",
      action: "Updated quick-gen default template"
    }
  ]
}
```

---

## 🎯 Proactive Intelligence

### Pattern Detection
```python
def detect_patterns(session_log):
    """Find recurring patterns to automate"""
    patterns = {
        "repeated_requests": [],
        "common_fixes": [],
        "missing_automation": [],
        "skill_gaps": []
    }
    
    # Analyze request frequency
    request_counts = Counter(session_log.requests)
    for req, count in request_counts.items():
        if count >= 3:
            patterns["repeated_requests"].append(req)
    
    # Analyze fix patterns
    for fix in session_log.fixes:
        if fix.type in ["missing_import", "null_check", "error_handling"]:
            patterns["common_fixes"].append(fix)
    
    # Detect automation opportunities
    for task in session_log.manual_tasks:
        if task.repetitive and task.rule_based:
            patterns["missing_automation"].append(task)
    
    return patterns
```

### Auto-Improvement Triggers
```
IF pattern.repeated_requests >= 5
THEN create_skill(pattern.name)

IF skill.effectiveness < 0.7 for 5 uses
THEN flag_for_improvement(skill)

IF tool.error_rate > 0.3
THEN suggest_alternative(tool)

IF user.satisfaction dropping
THEN adjust_approach()
```

---

## 🧩 Skill Coordination

### Conflict Resolution
```
Conflict: Two skills want to act
Example: vibe-validator flags issue, flow-guardian says don't interrupt

Resolution:
1. Check severity (vibe-validator)
2. Check flow state (flow-guardian)
3. If critical → Flag immediately
4. If minor → Queue for natural pause
5. Log conflict for learning
```

### Skill Chaining
```
Chain: "Build a feature"

1. quick-gen → Scaffold component
2. vibe-validator → Check for issues
3. auto-test → Generate tests
4. refactor-buddy → Suggest improvements
5. flow-guardian → Ensure smooth experience

Orchestrator manages handoffs between skills
```

### Skill Priority
```
Priority 1 (Critical): vibe-validator (security/bugs)
Priority 2 (Active): vibe-mode, quick-gen (core tasks)
Priority 3 (Support): auto-test, refactor-buddy (enhancement)
Priority 4 (Background): context-sense, arsenal-manager (meta)
```

---

## 💬 User Communication

### Status Commands
| Command | Response |
|---------|----------|
| `"status"` | Active skills + tools |
| `"what can you do?"` | Full capability list |
| `"how's it going?"` | Session progress + learnings |
| `"what did you learn?"` | Recent improvements |
| `"optimize"` | Run optimization pass |

### Proactive Updates
```
📈 Session Update (after 5 tasks)

Completed: 5 tasks
Skills used: vibe-mode (5x), quick-gen (4x), auto-test (3x)
Effectiveness: 94%

New learnings:
✅ quick-gen now includes your naming convention
✅ Added error handling to API templates

Suggestions:
💡 Connect PostgreSQL for data tasks
💡 Create 'campaign-builder' skill for your JSON work
```

### Learning Confirmations
```
✅ Just learned: You prefer double quotes in JSON

Applied to:
- quick-gen templates
- json-validator rules
- formatter settings

Want me to update existing files?
```

---

## 🔧 Self-Configuration

### Auto-Tuning
```python
def auto_tune():
    """Adjust skill parameters based on usage"""
    
    # Tune vibe-validator sensitivity
    if validator.false_positives > 5:
        validator.sensitivity -= 0.1
    
    # Tune quick-gen assumptions
    if quick-gen.revisions > 3:
        quick-gen.ask_more_questions = True
    
    # Tune flow-guardian interruption threshold
    if user.seems_frustrated:
        flow-guardian.interruption_threshold = "critical_only"
```

### Skill Versioning
```
Skills are versioned:
- vibe-mode v1.2.3
- quick-gen v2.0.1

Changes tracked:
- v1.2.3: +Improved trigger detection
- v1.2.2: +Better error messages
- v1.2.1: -Removed annoying suggestions

Rollback supported if issues detected
```

---

## 📈 Metrics Dashboard

### Real-time Metrics
```
┌────────────────────────────────────────┐
│         ORCHESTRATOR METRICS           │
├────────────────────────────────────────┤
│ Session Duration: 2h 34m               │
│ Tasks Completed: 12                    │
│ Skills Active: 7                       │
│ Tools Connected: 3                     │
├────────────────────────────────────────┤
│ Effectiveness: 94% ⬆️ 3%               │
│ Satisfaction: 96% ⬆️ 1%                │
│ Automation Rate: 78% ⬆️ 5%             │
├────────────────────────────────────────┤
│ Learnings Saved: 8                     │
│ Skills Updated: 3                      │
│ New Patterns: 2                        │
└────────────────────────────────────────┘
```

### Improvement Tracking
```
Week Over Week:
├─ Task completion time: -15%
├─ User corrections: -23%
├─ Auto-fix accuracy: +8%
└─ Skills created: +4
```

---

## 🚀 Advanced Features

### Predictive Loading
```
Based on time of day + recent patterns:

Morning → Load "planning" skills
Afternoon → Load "coding" skills  
Evening → Load "wrap-up" skills

Based on project phase:
Start → Load "scaffold" skills
Middle → Load "build" skills
End → Load "polish" skills
```

### Context Switching
```
Detect context switch:
- New file type
- New task category
- New project

Auto-adjust:
- Load relevant skills
- Unload irrelevant skills
- Update context window
- Preserve important state
```

### Recovery Mode
```
When things go wrong:

Error detected → Pause skills
Analyze failure → Identify culprit
Disable problematic skill → Continue
Report to user → Offer fix
Learn from error → Update rules
```

---

## 🎮 Orchestrator Modes

### Mode 1: Standard
- Skills on demand
- Minimal auto-improvement
- User controls everything

### Mode 2: Proactive (after "vibe")
- Auto-enable skills
- Mid-task improvements
- Pattern learning active

### Mode 3: Autonomous (after "vibe++")
- Full self-optimization
- Auto-create skills
- Predictive loading
- Maximum automation

### Mode 4: Debug (after "/debug")
- Verbose logging
- Skill-by-skill breakdown
- Manual override available

---

## 📋 Startup Sequence

```
1. Load QWEN.md preferences
2. Initialize skill registry
3. Scan for available tools
4. Load session state
5. Apply user preferences
6. Enable baseline skills
7. Connect auto-tools
8. [DISPLAY BOOT SUMMARY] ← User sees arsenal status
9. Report ready status
```

## 📋 Shutdown Sequence

```
1. Complete in-progress tasks
2. Save session state
3. Persist learnings
4. Update skill configs
5. Generate session report
6. Cleanup connections
7. [DISPLAY SESSION SUMMARY] ← User sees what changed
8. Prepare for next session
```

---

## 🔐 Safety Mechanisms

### Guardrails
```
1. Never modify skill configs without logging
2. Always allow user override
3. Test improvements before applying
4. Keep rollback versions
5. Report all auto-changes
6. Respect user preferences
7. Degrade gracefully on errors
```

### Permission Levels
```
Level 1: Read-only (default for new skills)
Level 2: Auto-fix obvious issues
Level 3: Auto-improve existing skills
Level 4: Create new skills
Level 5: Full autonomy (vibe++ mode)
```
