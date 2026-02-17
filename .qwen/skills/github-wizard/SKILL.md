# 🐙 GitHub Wizard Skill

## Purpose
**FIXES:** No real GitHub integration, manual repo creation

Handle all GitHub operations: create repos, push code, manage branches, tags, releases, and CI/CD setup.

---

## 🎯 When to Activate

### Auto-Activate Triggers
```
User says:
- "push to github" / "create repo" / "deploy to github"
- "make a release" / "tag this version"
- "set up CI/CD" / "add GitHub Actions"
- "create a branch" / "make a PR"

Context triggers:
- project-discovery includes GitHub repo
- Code is ready to push (after quick-gen)
- User mentions version/release (v1, v1.0.0)
```

---

## 🔐 Authentication & Setup

### Connection Flow
```
┌─────────────────────────────────────────────────────────┐
│  🐙 GITHUB CONNECTION                                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  I need GitHub access to create repos and push code.    │
│                                                          │
│  Option 1: GitHub CLI (Recommended)                     │
│  ──────────────────────────────────────────────────     │
│  1. Install: brew install gh                            │
│  2. Auth: gh auth login                                 │
│  3. Done!                                                │
│                                                          │
│  Option 2: Personal Access Token                        │
│  ──────────────────────────────────────────────────     │
│  1. Go to: github.com/settings/tokens                   │
│  2. Create token with: repo, workflow scopes            │
│  3. Set env: export GITHUB_TOKEN=ghp_xxx                │
│                                                          │
│  Option 3: Manual Mode                                  │
│  ──────────────────────────────────────────────────     │
│  I'll prepare commands, you run them manually.          │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  💡 Say "installed" when ready, or "manual" for commands│
└─────────────────────────────────────────────────────────┘
```

### Status Check
```
🐙 GitHub Status:
├─ CLI installed: ✅ (gh version 2.40.1)
├─ Authenticated: ✅ (sean-ctrb)
├─ Token valid: N/A (using CLI)
└─ Rate limit: 4999/5000 remaining

Ready to create repos and push code!
```

---

## 📦 Repository Operations

### Create Repository
```
Input:
{
  "name": "modern-app-v1",
  "org": "my-org" (optional),
  "description": "Modern web app v1",
  "private": true,
  "add_readme": true,
  "add_gitignore": true,
  "add_license": "MIT"
}

Output:
┌─────────────────────────────────────────────────────────┐
│  🐙 REPOSITORY CREATED                                  │
├─────────────────────────────────────────────────────────┤
│  Name: my-org/modern-app-v1                             │
│  URL: https://github.com/my-org/modern-app-v1           │
│  Visibility: Private                                    │
│                                                          │
│  ✅ Repository created on GitHub                        │
│  ✅ Local git initialized                               │
│  ✅ Remote added (origin)                               │
│  ✅ README.md added                                     │
│  ✅ .gitignore added (Node.js)                          │
│  ✅ LICENSE added (MIT)                                 │
│                                                          │
│  Next: git add . && git commit -m "Initial commit"      │
└─────────────────────────────────────────────────────────┘
```

### Push Code
```
Input:
{
  "branch": "main",
  "commit_message": "Initial commit: scaffold app",
  "push": true,
  "set_upstream": true
}

Process:
1. git add .
2. git commit -m "Initial commit: scaffold app"
3. git branch -M main
4. git remote add origin git@github.com:org/repo.git
5. git push -u origin main

Output:
📝 [GIT] Committed: "Initial commit: scaffold app"
📝 [GIT] Pushed to: origin/main
📝 [GITHUB] Repo: https://github.com/org/modern-app-v1

✅ Code pushed successfully!
```

### Create Branch
```
Input:
{
  "name": "feature/auth",
  "from": "main",
  "push": true
}

Output:
📝 [GIT] Created branch: feature/auth (from main)
📝 [GIT] Pushed to: origin/feature/auth

✅ Branch ready for development!
```

---

## 🏷️ Version & Release Management

### Create Tag
```
Input:
{
  "version": "v1.0.0",
  "message": "Initial release",
  "annotated": true,
  "push": true
}

Process:
1. git tag -a v1.0.0 -m "Initial release"
2. git push origin --tags

Output:
📝 [GIT] Created tag: v1.0.0 (annotated)
📝 [GIT] Pushed tags to origin

✅ Version v1.0.0 tagged and pushed!
```

### Create Release
```
Input:
{
  "tag": "v1.0.0",
  "name": "Version 1.0.0",
  "body": "## What's New\n\n- Initial release\n- Features: X, Y, Z",
  "draft": false,
  "prerelease": false
}

Process:
1. gh release create v1.0.0 \
   --title "Version 1.0.0" \
   --notes "## What's New..." \
   --generate-notes (optional)

Output:
┌─────────────────────────────────────────────────────────┐
│  🎉 RELEASE PUBLISHED                                   │
├─────────────────────────────────────────────────────────┤
│  Tag: v1.0.0                                            │
│  Name: Version 1.0.0                                    │
│  URL: https://github.com/org/repo/releases/tag/v1.0.0   │
│                                                          │
│  ✅ Release created on GitHub                           │
│  ✅ Auto-generated release notes                        │
│  ✅ Ready to share!                                     │
└─────────────────────────────────────────────────────────┘
```

---

## ⚙️ CI/CD Setup

### GitHub Actions Workflows

#### Default Workflow (Auto-generated)
```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run test

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run build
```

#### Deploy to Vercel Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Setup CI/CD Command
```
Input:
{
  "add_lint": true,
  "add_test": true,
  "add_build": true,
  "add_deploy": true,
  "deploy_target": "vercel"
}

Output:
📝 [CI/CD] Created: .github/workflows/ci.yml
📝 [CI/CD] Created: .github/workflows/deploy.yml
📝 [GIT] Committed: "Add CI/CD workflows"

✅ CI/CD configured!

Workflows:
• CI: Lint + Test + Build on PR
• Deploy: Auto-deploy to Vercel on main

⚠️ Required secrets:
• VERCEL_TOKEN
• VERCEL_ORG_ID
• VERCEL_PROJECT_ID

Say "add secrets" to configure.
```

---

## 🔗 Integration with Other Skills

### With project-discovery
```
project-discovery output:
{
  "github": {
    "org": "my-org",
    "name": "modern-app-v1",
    "private": true,
    "ci_cd": true
  }
}

→ github-wizard creates repo with these settings
```

### With quick-gen
```
quick-gen completes scaffolding
→ Signal github-wizard
→ github-wizard: init git, create repo, push code
```

### With orchestrator
```
orchestrator manages flow:
1. project-discovery → get requirements
2. quick-gen → scaffold code
3. github-wizard → push to GitHub
4. ci-cd-builder → add workflows
```

---

## 🛠️ Tool Implementation

### GitHub CLI Wrapper
```python
#!/usr/bin/env python3
"""
github_wizard.py - GitHub operations via gh CLI
"""

import subprocess
import json
from pathlib import Path

class GitHubWizard:
    def __init__(self):
        self.check_installed()
    
    def check_installed(self):
        """Check if gh CLI is installed"""
        try:
            result = subprocess.run(['gh', '--version'], 
                                  capture_output=True, text=True)
            if result.returncode != 0:
                raise Exception("GitHub CLI not installed")
            self.version = result.stdout.split('\n')[0]
        except FileNotFoundError:
            raise Exception("Install gh: brew install gh")
    
    def check_auth(self):
        """Check if authenticated"""
        result = subprocess.run(['gh', 'auth', 'status'],
                              capture_output=True, text=True)
        return result.returncode == 0
    
    def create_repo(self, name, org=None, private=True, 
                    description="", add_readme=True):
        """Create GitHub repository"""
        cmd = ['gh', 'repo', 'create']
        
        if org:
            cmd.append(f"{org}/{name}")
        else:
            cmd.append(name)
        
        if private:
            cmd.append('--private')
        else:
            cmd.append('--public')
        
        if description:
            cmd.extend(['--description', description])
        
        if add_readme:
            cmd.append('--add-readme')
        
        cmd.append('--confirm')
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            return {"success": True, "url": self.get_repo_url(name, org)}
        else:
            return {"success": False, "error": result.stderr}
    
    def init_git(self):
        """Initialize git repo"""
        subprocess.run(['git', 'init'], check=True)
    
    def add_remote(self, url):
        """Add git remote"""
        subprocess.run(['git', 'remote', 'add', 'origin', url], 
                      check=True)
    
    def commit(self, message):
        """Commit changes"""
        subprocess.run(['git', 'add', '.'], check=True)
        subprocess.run(['git', 'commit', '-m', message], check=True)
    
    def push(self, branch='main', set_upstream=True):
        """Push to remote"""
        cmd = ['git', 'push']
        if set_upstream:
            cmd.extend(['-u', 'origin', branch])
        else:
            cmd.extend(['origin', branch])
        
        subprocess.run(cmd, check=True)
    
    def create_tag(self, version, message):
        """Create annotated tag"""
        subprocess.run(['git', 'tag', '-a', version, '-m', message],
                      check=True)
        subprocess.run(['git', 'push', 'origin', '--tags'],
                      check=True)
    
    def create_release(self, tag, title, notes, draft=False):
        """Create GitHub release"""
        cmd = ['gh', 'release', 'create', tag]
        
        cmd.extend(['--title', title])
        cmd.extend(['--notes', notes])
        
        if draft:
            cmd.append('--draft')
        
        subprocess.run(cmd, check=True)
    
    def setup_actions(self, workflows_dir):
        """Enable GitHub Actions"""
        # Workflows are YAML files in .github/workflows/
        pass
    
    def get_repo_url(self, name, org=None):
        """Get repository URL"""
        if org:
            return f"https://github.com/{org}/{name}"
        else:
            return f"https://github.com/{self.get_username()}/{name}"
    
    def get_username(self):
        """Get GitHub username"""
        result = subprocess.run(['gh', 'api', 'user', '--jq', '.login'],
                              capture_output=True, text=True, check=True)
        return result.stdout.strip()
```

---

## 🎮 User Commands

| Command | Action |
|---------|--------|
| `"create repo [name]"` | Create new repository |
| `"push to github"` | Initialize git and push |
| `"tag v1.0.0"` | Create and push version tag |
| `"release v1.0.0"` | Create GitHub release |
| `"add CI/CD"` | Set up GitHub Actions |
| `"create branch [name]"` | Create and push branch |
| `"github status"` | Check connection status |
| `"connect github"` | Guide through auth |

---

## 📋 Example Flows

### Flow 1: Create + Push (Full)
```
User: "Create a repo and push this code"

github-wizard activates:

🐙 Checking GitHub connection...
✅ GitHub CLI installed (v2.40.1)
✅ Authenticated as: sean-ctrb

📋 Repository details:
   Name: modern-app-v1
   Org: (personal)
   Visibility: Private
   Add README: Yes
   Add .gitignore: Yes (Node.js)
   Add License: MIT

Create this repo? (y/n)

User: "y"

📝 [GITHUB] Creating repository...
📝 [GIT] Initializing git...
📝 [GIT] Adding remote...
📝 [GIT] Committing changes...
📝 [GIT] Pushing to GitHub...

┌─────────────────────────────────────────────────────────┐
│  ✅ REPOSITORY READY                                    │
├─────────────────────────────────────────────────────────┤
│  URL: https://github.com/sean-ctrb/modern-app-v1        │
│  Branch: main                                           │
│  Status: Pushed (1 commit)                              │
│                                                          │
│  Next steps:                                            │
│  • Add CI/CD? (say "add CI/CD")                         │
│  • Create release? (say "release v1.0.0")               │
│  • Deploy to Vercel? (say "deploy")                     │
└─────────────────────────────────────────────────────────┘
```

### Flow 2: Version + Release
```
User: "Tag this as v1.0.0 and create a release"

🐙 GitHub Wizard:

📝 [GIT] Creating tag: v1.0.0
📝 [GIT] Pushing tags to origin...

📝 [GITHUB] Creating release...
   Title: Version 1.0.0
   Notes: Auto-generated from commits

┌─────────────────────────────────────────────────────────┐
│  🎉 RELEASE PUBLISHED                                   │
├─────────────────────────────────────────────────────────┤
│  Tag: v1.0.0                                            │
│  URL: https://github.com/sean-ctrb/modern-app-v1        │
│       /releases/tag/v1.0.0                              │
│                                                          │
│  Release notes:                                         │
│  ## What's Changed                                      │
│  - Initial commit: scaffold app                         │
│  - Add CI/CD workflows                                  │
│  - Add README with setup instructions                   │
└─────────────────────────────────────────────────────────┘

✅ v1.0.0 released! Share the URL!
```

### Flow 3: CI/CD Setup
```
User: "Add GitHub Actions for CI/CD"

🐙 GitHub Wizard:

📋 CI/CD Configuration:
   □ Lint on PR
   □ Test on PR
   □ Build on PR
   □ Deploy to Vercel on main

   Workflows to create:
   • .github/workflows/ci.yml
   • .github/workflows/deploy.yml

Create these? (y/n)

User: "y"

📝 [CI/CD] Created: ci.yml (lint + test + build)
📝 [CI/CD] Created: deploy.yml (Vercel production)
📝 [GIT] Committed: "Add CI/CD workflows"

✅ CI/CD configured!

⚠️ Required GitHub Secrets:
   VERCEL_TOKEN: Get from vercel.com/account/tokens
   VERCEL_ORG_ID: From Vercel team settings
   VERCEL_PROJECT_ID: From project settings

Say "add secrets" to configure, or add manually in 
GitHub repo settings.
```

---

## 🚨 Error Handling

### Common Errors & Fixes

```
Error: "Repository already exists"
Fix: "That repo name is taken. Want to:
      1. Use different name?
      2. Push to existing repo?
      3. Delete and recreate?"

Error: "Not authenticated"
Fix: "Run: gh auth login
      Or say 'manual' for token-based auth"

Error: "Rate limit exceeded"
Fix: "Waiting 5 minutes for rate limit reset...
      Or authenticate for higher limits"

Error: "Permission denied"
Fix: "Check SSH keys: gh ssh-key add
      Or use HTTPS instead"
```

---

## ✅ Success Criteria

GitHub operations successful when:
- [ ] Repository created/accessible on GitHub
- [ ] Code pushed and visible on GitHub
- [ ] Tags/releases created correctly
- [ ] CI/CD workflows running
- [ ] User can access the repo URL

---

## 🔐 Security Notes

```
NEVER:
- Commit .env files with secrets
- Hardcode tokens in code
- Push credentials to GitHub

ALWAYS:
- Use .gitignore for sensitive files
- Use GitHub Secrets for tokens
- Use environment variables

github-wizard automatically:
- Adds .env to .gitignore
- Warns before committing sensitive patterns
- Suggests secrets for required tokens
```
