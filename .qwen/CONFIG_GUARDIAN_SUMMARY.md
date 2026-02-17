# 🛡️ Config Guardian - Summary

## What It Does

```
BEFORE any config change:
1. ✅ Shows you proposed changes
2. ✅ Explains WHY each change is needed
3. ✅ Shows IMPACT (what it affects)
4. ✅ Creates backup automatically
5. ✅ Asks for explicit approval: "Apply? (y/n)"

NEVER modifies config without permission.
```

---

## Commands

| Command | What It Shows |
|---------|---------------|
| `"config status"` | Current config state + recent changes |
| `"config history"` | Full changelog (chronological) |
| `"config show [id]"` | Details of specific change |
| `"rollback [id]"` | Revert to previous version |
| `"rollback list"` | All available rollbacks |
| `"config diff [id]"` | Before/after comparison |
| `"config backup"` | Manual backup |

---

## Example: Config Change Proposal

```
┌─────────────────────────────────────────────────────────┐
│  📝 PROPOSED CONFIG CHANGES                             │
├─────────────────────────────────────────────────────────┤
│  Reason: User prefers Vue over React                    │
│  Impact: All new projects use Vue by default            │
│                                                          │
│  CHANGES:                                                │
│  1. preferences.json                                     │
│     Before: "frontend": "nextjs"                         │
│     After:  "frontend": "nuxt"                           │
│                                                          │
│  2. stack-advisor/SKILL.md                               │
│     Before: Recommends Next.js                           │
│     After:  Recommends Nuxt.js                           │
│                                                          │
│  BACKUP:                                                 │
│  • Created: ~/.qwen/backups/2026-02-17T15-00-00/        │
│  • Rollback: "rollback config-2026-02-17-004"           │
│                                                          │
│  Apply these changes? (y/n)                             │
└─────────────────────────────────────────────────────────┘
```

---

## Example: Config History

```
┌─────────────────────────────────────────────────────────┐
│  📊 CONFIG CHANGE HISTORY                               │
├─────────────────────────────────────────────────────────┤
│  [004] 2026-02-17 15:00 - Updated                       │
│         Changed React → Vue preference                  │
│         Rollback: "rollback config-2026-02-17-004"      │
│                                                          │
│  [003] 2026-02-17 14:30 - Updated                       │
│         Added Python stack preference                   │
│         Rollback: "rollback config-2026-02-17-003"      │
│                                                          │
│  [002] 2026-02-17 11:15 - Created                       │
│         Added github-wizard skill                       │
│         Rollback: "rollback config-2026-02-17-002"      │
│                                                          │
│  [001] 2026-02-17 09:00 - Initialized                   │
│         Initial vibe coder setup                        │
│         Rollback: Not available                         │
└─────────────────────────────────────────────────────────┘
```

---

## Backup System

```
~/.qwen/backups/
├── 2026-02-17T15-00-00/    ← Before Vue change
│   ├── manifest.json
│   ├── preferences.json
│   └── skills/quick-gen/SKILL.md
├── 2026-02-17T14-30-00/    ← Before Python change
└── 2026-02-17T11-15-00/    ← Before github-wizard
```

Every backup includes:
- All modified files
- Manifest with checksums
- Rollback command

---

## Rollback Example

```
User: "rollback config-2026-02-17-003"

🔄 ROLLBACK: config-2026-02-17-003
─────────────────────────────────────────────────────────
This will undo:
• Python stack preference
• FastAPI template support

Continue? (y/n)

User: "y"

✅ Rollback complete!
```

---

## Key Guarantees

```
✅ NEVER changes config without approval
✅ ALWAYS creates backup before changes
✅ EVERY change is rollback-able
✅ FULL changelog (chronological, with descriptions)
✅ User can restore ANY previous state
✅ User always knows current config state
```

---

## Files

- `~/.qwen/skills/config-guardian/SKILL.md` - Full spec
- `~/.qwen/changelog.json` - Change history
- `~/.qwen/backups/` - All backups

---

**TL;DR:** You control all config changes. I ask first, backup always, rollback anytime. 🛡️
