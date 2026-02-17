# 🔌 MCP & Tool Manager

## Purpose
Dynamically manage, connect, and orchestrate all tools (MCP servers, CLI helpers, APIs) - automatically wiring up capabilities as needed.

---

## 🧰 Tool Registry

### Built-in Tools
```python
TOOLS = {
    "vibe_helper.py": {
        "type": "cli",
        "commands": ["component", "endpoint", "test", "json-keys"],
        "status": "available",
        "auto_use": True
    },
    "json_validator": {
        "type": "builtin",
        "functions": ["validate", "format", "diff"],
        "status": "active",
        "auto_use": True
    },
    "file_system": {
        "type": "builtin",
        "functions": ["read", "write", "search", "list"],
        "status": "active",
        "auto_use": True
    }
}
```

### MCP Servers (Connectable)
```python
MCP_SERVERS = {
    "postgresql": {
        "type": "database",
        "commands": ["query", "migrate", "backup"],
        "status": "disconnected",
        "setup": "pip install psycopg2 + connection string"
    },
    "docker": {
        "type": "devops", 
        "commands": ["build", "run", "logs", "exec"],
        "status": "disconnected",
        "setup": "docker SDK + socket access"
    },
    "aws": {
        "type": "cloud",
        "commands": ["s3", "lambda", "dynamodb", "cloudwatch"],
        "status": "disconnected",
        "setup": "boto3 + credentials"
    },
    "notion": {
        "type": "productivity",
        "commands": ["query", "create", "update"],
        "status": "disconnected",
        "setup": "notion-client + API key"
    }
}
```

---

## 🔗 Auto-Connection Logic

### When to Suggest Tools
```
Task mentions "database" 
→ Suggest: PostgreSQL MCP

Task mentions "deploy" or "container"
→ Suggest: Docker MCP

Task mentions "S3" or "upload files"
→ Suggest: AWS MCP

Task mentions "docs" or "notes"
→ Suggest: Notion MCP

Task involves JSON editing (current project!)
→ Auto-enable: JSON validator + formatter
```

### Connection Flow
```
1. Detect task needs
2. Check available tools
3. If tool disconnected:
   → "I can use [Tool] for this. Connect it?"
4. If user agrees:
   → Guide setup OR auto-connect if configured
5. Once connected:
   → Use tool transparently
```

---

## 🛠️ Tool Wrappers

### CLI Tool Wrapper
```python
def run_cli_tool(tool, command, *args):
    """Run CLI tool and return result"""
    cmd = f"python {tool}.py {command} {' '.join(args)}"
    result = subprocess.run(cmd, shell=True, capture_output=True)
    return {
        "success": result.returncode == 0,
        "output": result.stdout.decode(),
        "error": result.stderr.decode()
    }

# Auto-use example:
def scaffold_component(name):
    result = run_cli_tool("vibe_helper", "component", name)
    if result["success"]:
        return f"✅ Created component: {name}"
    else:
        return f"❌ Failed: {result['error']}"
```

### MCP Tool Wrapper
```python
class MCPWrapper:
    def __init__(self, server_name):
        self.server = connect_mcp(server_name)
    
    def query(self, sql):
        """Auto-execute SQL via MCP"""
        return self.server.database.query(sql)
    
    def auto_retry(self, func, *args):
        """Retry with better error handling"""
        try:
            return func(*args)
        except Exception as e:
            log_error(e)
            suggest_fix(e)
            raise
```

---

## 🔄 Dynamic Tool Loading

### Load on Demand
```
User: "Query the users table"
Check: PostgreSQL MCP connected?
No → "Need to connect DB first. Here's how..."
Yes → Execute query transparently
```

### Cache Connections
```
Once connected → Keep alive for session
Track: last_used, connection_count
Cleanup: Disconnect after 30min idle
```

### Tool Discovery
```
On startup:
1. Scan .qwen/tools/ for custom tools
2. Check system for installed MCP servers
3. Load available CLI commands
4. Build capability index
```

---

## 📊 Tool Usage Tracking

### Metrics
| Metric | Purpose |
|--------|---------|
| Use count | Identify valuable tools |
| Error rate | Flag problematic tools |
| Setup time | Optimize onboarding |
| User satisfaction | Prioritize improvements |

### Auto-Optimization
```
IF tool error_rate > 0.3
THEN suggest alternative OR improve wrapper

IF tool use_count > 10 per session
THEN create shortcut command

IF tool never used (5+ sessions)
THEN suggest removing or hide from menu
```

---

## 🎯 Tool Orchestration

### Multi-Tool Tasks
```
Task: "Deploy the API"

Tools needed:
1. file_system → Gather files
2. docker → Build container
3. aws → Deploy to ECS
4. notion → Update deployment log

Orchestration:
[ ] Build Docker image
[ ] Push to ECR
[ ] Update ECS service
[ ] Log deployment
✅ Done!
```

### Tool Chaining
```
Chain: "Process and store data"

1. json_validator → Validate input
2. file_system → Read file
3. postgresql → Store records
4. auto-test → Generate tests

Auto-chain when user says:
"Process this JSON and store it"
```

---

## 💬 Tool Communication

### Tool Status Display
```
🔌 Connected Tools

✅ file_system (built-in)
✅ json_validator (built-in)
✅ vibe_helper.py (CLI)
🔌 postgresql (connected)
❌ docker (not installed)
❌ aws (not configured)

Commands:
  /tools connect <name>  - Connect a tool
  /tools status          - Show all tools
  /tools run <cmd>       - Run tool command
```

### Setup Guidance
```
To connect PostgreSQL:

1. Install: pip install psycopg2-binary
2. Set env: export DATABASE_URL="postgresql://..."
3. Test: /tools run postgresql "SELECT 1"

Want me to guide you through this?
```

---

## 🚀 Auto-Tool Features

### Smart Tool Selection
```
Task detected: "Resize images"

Available options:
- PIL (Python, installed)
- sharp (Node, not installed)
- imagemagick (CLI, not installed)

Auto-select: PIL (already available)
```

### Fallback Chains
```
Primary: docker (for containerization)
Fallback: podman (if docker fails)
Fallback: local python (if both unavailable)

Auto-fallback without bothering user
```

### Tool Recommendations
```
Based on your work:

📦 You edit JSON a lot
→ Install: jq (CLI JSON processor)
   Setup: brew install jq

📦 You test APIs manually
→ Install: httpie (better curl)
   Setup: brew install httpie

Want me to set these up?
```

---

## 🧩 MCP Integration

### What is MCP?
Model Context Protocol - standard for connecting AI to tools

### Supported MCP Servers
```
| Server | Purpose | Setup |
|--------|---------|-------|
| postgresql | Database | Connection string |
| filesystem | File access | Directory config |
| git | Version control | Repo path |
| fetch | Web requests | None |
| memory | Persistent storage | Auto |
```

### MCP Auto-Setup
```python
async def setup_mcp(server_name):
    """Auto-configure MCP server"""
    config = MCP_CONFIG.get(server_name)
    if not config:
        return generate_setup_guide(server_name)
    
    try:
        server = await connect_mcp(server_name, config)
        register_tool(server)
        return f"✅ {server_name} connected!"
    except Exception as e:
        return f"❌ Connection failed: {e}"
```

---

## 📁 Tool Configuration

### Config File: `.qwen/tools.json`
```json
{
  "auto_connect": ["file_system", "json_validator"],
  "prefer_cli": true,
  "mcp_servers": {
    "postgresql": {
      "enabled": true,
      "connection": "env:DATABASE_URL"
    }
  },
  "cli_tools": {
    "vibe_helper.py": {
      "enabled": true,
      "auto_suggest": true
    }
  },
  "shortcuts": {
    "/db": "postgresql query",
    "/run": "vibe_helper run",
    "/test": "pytest"
  }
}
```

---

## 🎮 Tool Commands

### User Commands
| Command | Action |
|---------|--------|
| `/tools` | List all tools |
| `/tools connect <name>` | Connect a tool |
| `/tools disconnect <name>` | Disconnect |
| `/tools run <cmd>` | Run tool command |
| `/tools status` | Show health/status |
| `/tools suggest` | Get recommendations |

### Auto Commands (Internal)
| Trigger | Action |
|---------|--------|
| Task needs tool | Auto-suggest connection |
| Tool error | Auto-retry with fallback |
| New tool available | Auto-discover and register |
| Session end | Auto-save tool state |

---

## 🔐 Security & Permissions

### Permission Levels
```
Level 1: Read-only (default)
- Read files, query databases
- No modifications

Level 2: Write (after confirmation)
- Create/modify files
- Insert/update records

Level 3: Execute (explicit approval)
- Run commands
- Deploy code
- Delete data
```

### Safety Checks
```
Before executing:
[ ] Command is whitelisted
[ ] Path is within allowed directories
[ ] No destructive operations without confirm
[ ] Rate limits respected
```

---

## 📈 Tool Improvement Loop

### Feedback Collection
```
After tool use:
- Track success/failure
- Note user overrides
- Measure completion time
- Log error messages
```

### Auto-Improvement
```
Weekly review:
1. Which tools used most?
2. Which tools cause errors?
3. What manual work could be tool-ified?
4. What new tools available?

Actions:
- Update tool wrappers
- Create new tools
- Deprecate unused tools
- Improve error messages
```
