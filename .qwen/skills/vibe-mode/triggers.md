# vibe-mode Trigger Phrases

## Primary Triggers (Always Activate)

| Phrase | Context | Response |
|--------|---------|----------|
| "vibe" | Any | 🌊 Vibe mode on |
| "vibing" | Any | 🌊 Locked in |
| "go" | Mid-task | Moving... |
| "go hard" | Any | 🚀 Maximum autonomy |
| "vibe++" | Any | 🚀 Ultra mode |

---

## Secondary Triggers (Context-Dependent)

### Continuation Phrases
| Phrase | Means | Action |
|--------|-------|--------|
| "continue" | Keep going | Resume last task |
| "keep going" | Don't stop | Continue flow |
| "next" | Move forward | Next logical step |
| "pick up" | Resume | Load context |

### Fix Requests
| Phrase | Means | Action |
|--------|-------|--------|
| "fix it" | Something broken | Debug + repair |
| "fix this" | Point to issue | Investigate + fix |
| "make it work" | Not functioning | Find + solve |
| "broken" | Error detected | Debug |

### Vague Commands
| Phrase | Means | Action |
|--------|-------|--------|
| "hmm" | Something off | Investigate |
| "weird" | Unexpected | Look for issues |
| "this looks wrong" | Visual issue | Check UI/code |
| "not right" | General problem | Ask + investigate |

### Completion Phrases
| Phrase | Means | Action |
|--------|-------|--------|
| "done" | Finished | Offer tests/docs |
| "ship it" | Ready to deploy | Final polish |
| "that works" | Satisfied | Wrap up |
| "nice" | Happy with result | Celebrate + next |

---

## Context Triggers (Auto-Detect)

### Code Patterns
| Pattern | Likely Need | Auto-Suggest |
|---------|-------------|--------------|
| fetch without await | Error handling | Add try/catch |
| function with no return | Missing logic | Check implementation |
| TODO comment | Incomplete work | Offer to finish |
| console.log | Debugging | Offer proper logging |
| repeated code | DRY violation | Offer to extract |

### User Behavior
| Behavior | Likely State | Response |
|----------|--------------|----------|
| Rapid edits | Flow state | Don't interrupt |
| Deleting/rewriting | Struggling | Offer help |
| Running same command | Stuck | Debug together |
| Long pause | Thinking | Wait, then check in |

---

## Negative Triggers (Don't Activate)

| Phrase | Why Not | Better Response |
|--------|---------|-----------------|
| "explain X" | Learning request | Teach, don't do |
| "what is X" | Question | Answer directly |
| "show me options" | Wants choices | List alternatives |
| "should I X" | Wants advice | Give pros/cons |

---

## Trigger Confidence Levels

### High Confidence (Auto-Activate)
```
- Exact matches: "vibe", "go", "continue"
- Clear intent: "fix this bug", "make it work"
- Context + command: "this code is broken, fix it"
```

### Medium Confidence (Verify)
```
- Vague: "hmm", "weird"
- Ambiguous: "add one" (add what?)
- Multi-meaning: "do the thing" (which thing?)
```

### Low Confidence (Ask First)
```
- Questions: "should I...?", "what do you think?"
- Requests for advice: "best way to...?"
- Learning: "how does X work?"
```

---

## Trigger Combinations

### Compound Triggers
| Input | Skills Activated |
|-------|------------------|
| "vibe, create a campaign" | vibe-mode + project-discovery |
| "vibe, fix this" | vibe-mode + vibe-validator |
| "continue, add tests" | existing-project-context + auto-test |

### Trigger Chains
```
User: "vibe"
→ vibe-mode activates

User: "create a user component"
→ project-discovery activates (within vibe context)

User: "actually, use Vue"
→ stack-advisor activates (Vue recommendation)

User: "go"
→ quick-gen activates (scaffold with Vue)
```

---

## Testing Triggers

### Test Script
```bash
# Test each trigger phrase
for phrase in "vibe" "go" "continue" "fix it" "hmm"; do
    echo "Testing: $phrase"
    # Verify activation
done
```

### Expected Activation Rate
| Trigger Type | Target Accuracy |
|--------------|-----------------|
| Primary | 100% |
| Secondary | >90% |
| Context | >80% |
| Negative | 0% (don't activate) |

---

## Updating Triggers

When adding new triggers:
1. Add to appropriate category
2. Test with real usage
3. Update confidence level based on accuracy
4. Document false positives

---

**Last Updated:** February 17, 2026
**Version:** 1.0
