# Vibe Validator Skill

## Purpose
Automatically detect and flag potential issues in code as the user writes it - no nagging, just helpful heads-up when something looks off.

## Triggers
- User writes or modifies code files
- User asks "does this look right?" or similar
- User runs into errors

## Behavior
**Proactively check for:**
- Missing error handling (try/except, null checks)
- Unused imports or variables
- Inconsistent naming conventions
- Potential bugs (off-by-one, infinite loops, race conditions)
- Security smells (hardcoded secrets, SQL injection risks)
- Performance issues (N+1 queries, unnecessary loops)

## Response Style
- Keep it brief and casual
- Only mention critical issues (don't nitpick)
- Offer to fix with one-liner: "Want me to fix this?"
- Use ✅/⚠️/❌ emojis for quick scanning

## Example
```
⚠️ Heads up: `fetchData()` has no error handling. Could crash if API fails.

Want me to add a try/except block?
```
