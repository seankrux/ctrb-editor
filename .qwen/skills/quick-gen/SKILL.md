# Quick Gen Skill

## Purpose
Generate boilerplate and scaffolding instantly - keep the flow going without breaking stride.

## Triggers
- "create a..." / "make a..." / "add a..."
- "I need a..." / "set up..."
- User describes a component/file/feature

## Behavior
**Generate with minimal questions:**
- Make reasonable assumptions based on context
- Use project's existing patterns (check nearby files)
- Include TODOs for parts that need customization
- Add sensible defaults everywhere

**Default templates:**
- React/Vue components
- API endpoints (FastAPI/Express)
- Database models
- Test files
- Config files
- Utility functions

## Response Style
- Just show the code, minimal explanation
- One command to run if needed
- Next logical step suggestion (optional)

## Example
```
Created `src/components/UserCard.tsx`:

```tsx
export function UserCard({ user }) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}
```

Run: `npm run dev` to see it in action.
```
