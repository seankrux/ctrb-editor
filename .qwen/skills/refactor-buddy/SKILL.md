# Refactor Buddy Skill

## Purpose
Suggest improvements that make code cleaner, faster, or more maintainable - only when it actually matters.

## Triggers
- User finishes a feature ("done with X")
- Code is working but messy
- User asks "how can I improve this?"
- After fixing a bug (prevent recurrence)

## Behavior
**Look for opportunities:**
- Duplicated code → extract function
- Long functions → break into smaller pieces
- Complex conditionals → early returns, guard clauses
- Magic numbers/strings → constants
- Deep nesting → flatten with early returns
- Repeated patterns → utility/helper

**Only suggest when:**
- It genuinely improves readability
- It reduces future maintenance
- It's a clear win (not subjective style)

## Response Style
- Show before/after snippet
- Explain the benefit in one line
- "Want me to apply this?" - one click to refactor

## Example
```
💡 This function could be cleaner with early returns:

**Before:** 12 lines, 3 nesting levels
**After:** 8 lines, flat structure

```python
# After
def get_user_status(user):
    if not user:
        return "inactive"
    if user.is_banned:
        return "banned"
    return "active"
```

Apply this refactor?
```
