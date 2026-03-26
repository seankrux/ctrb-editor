# Patch for Gemini CLI VirtualizedList Infinite Loop

The error `Maximum update depth exceeded` in `VirtualizedList.js` is caused by a re-render loop between the `ResizeObserver` callback and the component's state updates.

## Proposed Changes in `packages/cli/src/ui/components/shared/VirtualizedList.tsx`

### 1. Decouple `setHeights` from the Observer callback

Use `requestAnimationFrame` to ensure the state update happens outside the current layout/render cycle.

```typescript
// Around line 140
  const itemsObserver = useMemo(
    () =>
      new ResizeObserver((entries) => {
        // Use requestAnimationFrame to avoid "Maximum update depth exceeded"
        requestAnimationFrame(() => {
          setHeights((prev) => {
            let next: Record<string, number> | null = null;
            for (const entry of entries) {
              const key = nodeToKeyRef.current.get(entry.target);
              if (key !== undefined) {
                const height = Math.round(entry.contentRect.height);
                if (prev[key] !== height) {
                  if (!next) {
                    next = { ...prev };
                  }
                  next[key] = height;
                }
              }
            }
            return next ?? prev;
          });
        });
      }),
    [],
  );
```

### 2. Add dependencies to the observation effect

The effect starting around line 316 currently runs on every render because it lacks a dependency array. Adding the relevant dependencies will prevent unnecessary re-observation calls.

```typescript
// Around line 336
    observedNodes.current = currentNodes;
  }, [startIndex, endIndex, data, keyExtractor, itemsObserver]); // Add dependency array
```

## Why this happens
When an item's height is updated, it triggers a re-render. If that re-render causes the list to shift (e.g. scrollbar appearing/disappearing), it might trigger another `ResizeObserver` event immediately. In some environments (like Ink), calling `observe()` on a new node might also trigger the callback synchronously if the layout is already dirty, leading to a synchronous recursion that React detects as a "Maximum update depth exceeded" error.
