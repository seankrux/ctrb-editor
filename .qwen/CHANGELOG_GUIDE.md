# 📋 Change Log Reference

## Boot Summary (Every Session Start)

```
┌─────────────────────────────────────────────────────────┐
│  🌊 VIBE CODER ARSENAL - Session #YYYY-MM-DD-NNN       │
├─────────────────────────────────────────────────────────┤
│  Mode: PROACTIVE  │  Skills: 10  │  Tools: 3           │
├─────────────────────────────────────────────────────────┤
│  ✅ ACTIVE SKILLS: (list)                               │
│  🔧 CONNECTED TOOLS: (list)                             │
│  📈 LAST SESSION: (stats)                               │
└─────────────────────────────────────────────────────────┘
```

---

## Real-Time Change Notifications

### Skill Update
```
📝 [SKILL UPDATE] quick-gen v2.0.1 → v2.0.2
   Changed: Added error handling to all API templates
   Reason: User requested 3x in last session
   Impact: New scaffolds include try/catch by default
   Undo: Not reversible
```

### Pattern Learned
```
📝 [PATTERN LEARNED] User prefers double quotes in JSON
   Applied to: quick-gen, json-validator, formatter
   Files affected: 4 templates updated
   Undo: Say "undo learning"
```

### Tool Connected
```
📝 [TOOL CONNECTED] PostgreSQL MCP
   Connection: env:DATABASE_URL
   Available commands: query, migrate, backup
   Auto-activate: When task mentions "database"
   Undo: Say "disconnect postgresql"
```

### Auto-Fix Applied
```
📝 [AUTO-FIX] Added missing import in ctrb_manager.py
   Issue: `useState` used but not imported
   Fix: Added `import { useState } from 'react'`
   Location: Line 3
   Undo: Say "undo last fix"
```

### Skill Created
```
📝 [SKILL CREATED] campaign-builder v1.0.0
   Trigger: User builds campaign components
   Pattern: Detected 5+ similar structures
   Capabilities: Scaffold campaign CRUD, validation
   Config: ~/.qwen/skills/campaign-builder/SKILL.md
   Undo: Say "delete skill campaign-builder"
```

### Mode Changed
```
📝 [MODE CHANGE] Standard → Proactive
   Trigger: User said "vibe"
   Permission level: Auto-fix obvious issues
   Auto-skills: vibe-mode, context-sense, quick-gen
   Undo: Say "mode standard"
```

---

## Session Summary (End of Session)

```
┌─────────────────────────────────────────────────────────┐
│  📈 SESSION SUMMARY - YYYY-MM-DD                        │
├─────────────────────────────────────────────────────────┤
│  Duration: Xh Ym  │  Tasks: N  │  Files: M              │
├─────────────────────────────────────────────────────────┤
│  ✅ COMPLETED: (task breakdown)                         │
├─────────────────────────────────────────────────────────┤
│  📝 CHANGES MADE: (skill/pattern updates)               │
├─────────────────────────────────────────────────────────┤
│  🔧 TOOLS USED: (usage stats)                           │
├─────────────────────────────────────────────────────────┤
│  💡 NEXT SESSION: (suggestions)                         │
└─────────────────────────────────────────────────────────┘
```

---

## Change Log Commands

| Command | Shows |
|---------|-------|
| `/changelog` | All changes this session |
| `/changelog skills` | Only skill changes |
| `/changelog tools` | Only tool changes |
| `/changelog patterns` | Only learned patterns |
| `/changelog undo <n>` | Revert change #n |
| `/changelog export` | Save to file |

---

## Notification Levels

| Level | When | Example |
|-------|------|---------|
| **Silent** | Internal metrics | No notification |
| **Log** | Minor config tweaks | In changelog only |
| **Inline** | Auto-fixes, skill updates | Shows immediately |
| **Confirm** | Major changes | Asks first |

---

## Example Session Flow

```
[SESSION START]
↓
📊 BOOT SUMMARY DISPLAYED
↓
[User works...]
↓
📝 [AUTO-FIX] Fixed missing import
↓
[User works...]
↓
📝 [SKILL UPDATE] quick-gen improved
↓
[User works...]
↓
📝 [PATTERN LEARNED] New preference detected
↓
[User says "done"]
↓
📊 SESSION SUMMARY DISPLAYED
```
