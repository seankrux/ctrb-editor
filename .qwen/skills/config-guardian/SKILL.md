---
name: config-guardian
description: Protect global config changes. Require user approval before modifying ~/.qwen/ files. Track all changes with rollback capability. Trigger when config changes are needed or user asks about config.
---

# 🛡️ Config Guardian - Configuration Protection

## When to Activate

**Auto-trigger when:**
- Any `~/.qwen/` file modification is needed
- User says: "config", "settings", "preferences"
- User asks: "what changed?", "show config"
- Skill installation/update is requested

**NEVER modify without approval:**
- `~/.qwen/preferences.json`
- `~/.qwen/skills/*/SKILL.md`
- Any `.qwen/` config files

---

## What To Do

### 1. Before Any Config Change

```
┌─────────────────────────────────────────────────────────┐
│  📝 PROPOSED CONFIG CHANGES                             │
├─────────────────────────────────────────────────────────┤
│  Reason: [why changes are needed]                       │
│  Impact: [what this will affect]                        │
│                                                          │
│  CHANGES:                                                │
│  1. File: ~/.qwen/preferences.json                       │
│     Change: [what changes]                               │
│     Before: [old value]                                  │
│     After: [new value]                                   │
│     Why: [reason]                                        │
│                                                          │
│  BACKUP:                                                 │
│  • Created: ~/.qwen/backups/[timestamp]/                │
│  • Rollback: "rollback [id]"                            │
│                                                          │
│  Apply these changes? (y/n)                             │
└─────────────────────────────────────────────────────────┘
```

### 2. Track Every Change

Log with:
- Timestamp (ISO 8601)
- Change type (update/create/delete/rollback)
- Files modified
- Reason for change
- User approval status
- Rollback available (yes/no)

### 3. Provide Rollback

Every change must be reversible:
- Backup before change
- Store backup with version tag
- Provide rollback command
- Track rollback chain

---

## User Commands

| Command | Action |
|---------|--------|
| "config status" | Show current config state |
| "config history" | List all changes (chronological) |
| "config show [id]" | Show details of specific change |
| "rollback [id]" | Revert to previous version |
| "rollback list" | Show all rollback-able changes |
| "config diff [id]" | Show before/after for change |

---

## Change Log Format

```json
{
  "id": "config-2026-02-17-003",
  "timestamp": "2026-02-17T14:30:00Z",
  "type": "update",
  "reason": "Added Python stack preference",
  "impact": "quick-gen now supports FastAPI templates",
  "files_modified": [
    "~/.qwen/preferences.json",
    "~/.qwen/skills/quick-gen/SKILL.md"
  ],
  "backup_location": "~/.qwen/backups/2026-02-17T14-30-00/",
  "rollback_available": true,
  "rollback_command": "rollback config-2026-02-17-003",
  "user_approved": true
}
```

---

## Approval Levels

**Level 1: Minor Changes** (single file, no behavior change)
→ Show proposal, wait for "y"

**Level 2: Major Changes** (multiple files, behavior change)
→ Show proposal + impact analysis, wait for "y"

**Level 3: Destructive Changes** (delete files, remove features)
→ Show proposal + warning + rollback info
→ Require explicit: "Type 'confirm' to proceed"

---

## Examples

**User:** "I want to use Vue instead of React"
**You:** [Shows proposal with backup info] "Apply these changes? (y/n)"

**User:** "config history"
**You:** [Shows chronological list of all changes with rollback commands]

**User:** "rollback config-2026-02-17-003"
**You:** [Shows what will be undone] "Continue? (y/n)"

---

## Integration with V4 Editor

V4 Editor config changes:
- Campaign persistence settings
- Template library updates
- Validation rule changes

Always backup before modifying V4-related config.
