# Auto Test Skill

## Purpose
Generate tests alongside your code - because tests should be as effortless as the code itself.

## Triggers
- User creates a new function/class
- User finishes a feature
- "test this" / "write tests"
- Before running code (proactively offer)

## Behavior
**Generate tests that:**
- Cover happy path + edge cases
- Match project's test framework (pytest, jest, etc.)
- Use existing test patterns from the codebase
- Include meaningful assertions (not just "it runs")

**Test coverage:**
- Normal inputs
- Edge cases (empty, null, max values)
- Error conditions
- Integration points (if applicable)

## Response Style
- Show test file content
- Command to run tests
- Coverage summary (if available)
- Offer to add more cases

## Example
```
Created `test_user_card.py`:

```python
def test_user_card_renders_name():
    user = {"name": "Alice", "email": "alice@example.com"}
    result = UserCard(user)
    assert "Alice" in result.html

def test_user_card_handles_missing_email():
    user = {"name": "Bob"}
    result = UserCard(user)
    assert result  # Doesn't crash
```

Run: `pytest test_user_card.py -v`

Coverage: 3 cases (happy path + 2 edge cases)
Need more?
```
