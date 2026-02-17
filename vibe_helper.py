#!/usr/bin/env python3
"""
Vibe Coder Helper - Quick CLI for common tasks
Usage: python vibe_helper.py <command> [args]
"""

import sys
import json
import os
from pathlib import Path

def scaffold_component(name, comp_type="function"):
    """Create a React component skeleton"""
    content = f'''export function {name}({{ children }}) {{
  return (
    <div className="{name.lower()}">
      {{children}}
    </div>
  );
}}
'''
    Path(f"src/components/{name}.tsx").write_text(content)
    print(f"✅ Created src/components/{name}.tsx")

def scaffold_api_endpoint(name, method="get"):
    """Create a FastAPI endpoint skeleton"""
    content = f'''from fastapi import APIRouter

router = APIRouter()

@router.{method.lower()}("/{name}")
async def {name.replace("-", "_")}():
    """TODO: Implement {name}"""
    return {{"status": "ok"}}
'''
    Path(f"api/routes/{name}.py").write_text(content)
    print(f"✅ Created api/routes/{name}.py")

def quick_test(target):
    """Generate a basic test file"""
    test_name = f"test_{target.replace('.py', '')}"
    content = f'''import pytest

def test_{target.replace(".py", "")}_exists():
    """TODO: Implement test"""
    assert True
'''
    Path(f"tests/{test_name}.py").write_text(content)
    print(f"✅ Created tests/{test_name}.py")

def list_json_keys(filepath):
    """Quick view of JSON structure"""
    with open(filepath) as f:
        data = json.load(f)
    if isinstance(data, dict):
        print(f"Keys: {list(data.keys())}")
    elif isinstance(data, list):
        print(f"Array with {len(data)} items")
        if data:
            print(f"First item keys: {list(data[0].keys()) if isinstance(data[0], dict) else type(data[0])}")

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        print("\nCommands:")
        print("  component <name>  - Create React component")
        print("  endpoint <name>   - Create API endpoint")
        print("  test <file>       - Generate test file")
        print("  json-keys <file>  - View JSON structure")
        sys.exit(1)
    
    cmd = sys.argv[1]
    
    if cmd == "component" and len(sys.argv) > 2:
        scaffold_component(sys.argv[2])
    elif cmd == "endpoint" and len(sys.argv) > 2:
        scaffold_api_endpoint(sys.argv[2])
    elif cmd == "test" and len(sys.argv) > 2:
        quick_test(sys.argv[2])
    elif cmd == "json-keys" and len(sys.argv) > 2:
        list_json_keys(sys.argv[2])
    else:
        print(f"❌ Unknown command or missing args: {cmd}")
        sys.exit(1)

if __name__ == "__main__":
    main()
