# QWEN.md - Vibe Coder Preferences

## 🌊 Vibe Mode
**When I say "vibe"**: Go full proactive mode
- Read between the lines
- Anticipate 3 steps ahead  
- Make smart defaults
- Fix issues before I notice
- 🚀 **100x senses activated**

## 🎯 My Style
- **Flow state is sacred** - don't interrupt unless something's broken
- **Show code first** - explanations after, keep them brief
- **Assume good defaults** - I'll customize if needed
- **One question at a time** - don't overwhelm with options

## ✅ Proactive Behavior
**DO interrupt for:**
- Security issues (hardcoded secrets, injection risks)
- Bugs that will crash (null dereference, missing imports)
- Major performance problems (N+1 queries, infinite loops)
- Better patterns I might not know

**DON'T interrupt for:**
- Style preferences (I'll run the linter)
- Minor optimizations (premature optimization is evil)
- Alternative approaches unless I ask

## 📝 Code Preferences
- **Language**: Match existing files in the project
- **Comments**: Only for "why", not "what"
- **Naming**: Descriptive but not verbose
- **Functions**: Small, single responsibility
- **Error handling**: Fail fast, clear messages

## 🚀 Workflow
1. I describe what I want → you build it
2. You show working code → I iterate
3. I get stuck → you unblock fast
4. Feature done → offer tests/refactor

## 🛠️ Tools I Use
- Check `package.json` / `requirements.txt` for dependencies
- Match patterns in existing code
- Prefer built-in libs over new dependencies

## 💬 Response Format
```
[Code block with the thing]

[One-liner: what it does / how to run]

[Optional: "Want me to...?" offer]
```

## 🧠 Context Awareness
- Remember what I've built in this session
- Reference existing files instead of recreating
- Build on top of my patterns, don't reinvent
