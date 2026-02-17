# Quick Prompt Templates

## /component - Create a UI component
```
Create a [COMPONENT_NAME] component that [WHAT_IT_DOES].
Props: [LIST_PROPS]
Style: [TAILWIND/CSS/INLINE]
```

## /api - Create an API endpoint
```
Create a [METHOD] endpoint at [PATH] that [WHAT_IT_DOES].
Input: [SCHEMA]
Output: [RESPONSE_FORMAT]
Auth: [YES/NO]
```

## /model - Create a data model
```
Create a [MODEL_NAME] model with fields: [FIELD_LIST].
Validation: [RULES]
Database: [SQLITE/POSTGRES/MONGO]
```

## /test - Write tests for existing code
```
Write tests for [FILE_OR_FUNCTION].
Framework: [PYTEST/JEST/etc]
Coverage: [UNIT/INTEGRATION/BOTH]
```

## /fix - Debug and fix an issue
```
Fix this error: [ERROR_MESSAGE]
File: [FILE_PATH]
Context: [WHAT_YOU_WERE_DOING]
```

## /refactor - Clean up existing code
```
Refactor [FILE_OR_FUNCTION] to be more [READABLE/PERFORMANT/MODULAR].
Keep behavior the same.
Focus on: [SPECIFIC_CONCERN]
```

## /explain - Understand code quickly
```
Explain what [FILE_OR_FUNCTION] does.
Level: [HIGH_LEVEL/DETAILED]
Focus on: [LOGIC/FLOW/ARCHITECTURE]
```

## /docs - Generate documentation
```
Add docstrings/comments to [FILE_OR_FUNCTION].
Style: [GOOGLEDOC/NUMPY/PLAIN]
Include: [EXAMPLES/PARAMS/RETURNS]
```
