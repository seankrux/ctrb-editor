# 🌍 Environment Manager Skill

## Purpose
**FIXES:** No .env handling, secrets management, config validation

Manage environment variables, .env files, secrets, and configuration across environments.

---

## 🎯 When to Activate

### Auto-Activate Triggers
```
User says:
- "add environment variables" / "setup .env"
- "add API keys" / "configure secrets"
- "deploy needs env"

Context triggers:
- quick-gen creates app with API calls
- github-wizard sets up repo (add .env to .gitignore)
- deploy-master needs env vars
```

---

## 📋 .env File Generation

### Template Generation
```
Input: Stack + Features

Output: .env.example
```

### Next.js + Supabase Template
```bash
# .env.example

# Application
NEXT_PUBLIC_APP_NAME="My App"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJxxx"
SUPABASE_SERVICE_ROLE_KEY="eyJxxx"

# Auth (NextAuth)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# OAuth Providers
GITHUB_CLIENT_ID="xxx"
GITHUB_CLIENT_SECRET="xxx"
GOOGLE_CLIENT_ID="xxx"
GOOGLE_CLIENT_SECRET="xxx"

# Email (Resend)
RESEND_API_KEY="re_xxx"

# Analytics (Optional)
NEXT_PUBLIC_GA_ID="G-xxx"
```

### .gitignore Rules
```gitignore
# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# But keep example
!.env.example
```

---

## 🔐 Secret Generation

### Generate NEXTAUTH_SECRET
```bash
# Command to show user
openssl rand -base64 32
```

### Generate Database URL
```bash
# PostgreSQL
postgresql://user:password@localhost:5432/dbname

# Supabase (from dashboard)
https://xxx.supabase.co
```

---

## 🎮 User Commands

| Command | Action |
|---------|--------|
| `"setup .env"` | Generate .env.example |
| `"add secret [name]"` | Add new env var |
| `"validate env"` | Check all required vars present |
| `"sync env"` | Copy .env.example to .env.local |

---

## ✅ Success Criteria

Env management successful when:
- [ ] .env.example created with all required vars
- [ ] .env added to .gitignore
- [ ] User knows how to get each secret
- [ ] .env.local works for local dev
- [ ] Production secrets configured in deploy target
