# Task 23: Vercel Project Settings Configuration

**Completed:** 2026-02-24  
**Status:** ✅ Complete

---

## 🚀 Vercel Configuration

### vercel.json Created
Location: `nextjs-migration/vercel.json`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "installCommand": "npm ci",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "outputDirectory": ".next",
  "regions": ["iad1"],
  "headers": [...],
  "git": {
    "deploymentEnabled": {
      "main": true,
      "develop": true
    }
  }
}
```

---

## ⚙️ Project Settings

### Build Settings
| Setting | Value |
|---------|-------|
| **Framework** | Next.js 14.2.3 |
| **Install Command** | `npm ci` |
| **Build Command** | `npm run build` |
| **Dev Command** | `npm run dev` |
| **Output Directory** | `.next` |
| **Node.js Version** | 18.x (via `.nvmrc`) |

### Deployment Settings
| Setting | Value |
|---------|-------|
| **Primary Region** | iad1 (US East - N. Virginia) |
| **Branch Deployments** | main, develop |
| **Preview Deployments** | Enabled for all PRs |
| **Auto Expose** | Enabled |

### Security Headers
| Header | Value |
|--------|-------|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |

**Note:** Additional headers configured in `next.config.mjs`:
- Strict-Transport-Security (HSTS)
- Content-Security-Policy
- Permissions-Policy
- Cross-Origin headers

---

## 🌐 Environment Variables

### Required (None for current deployment)
The application shell does not require any environment variables for basic deployment.

### Optional (For future features)
| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_BASE_PATH` | Base path for subdirectory deployments | `''` |
| `AI_API_KEY` | OpenAI API key for AI chat feature | (not set) |
| `AI_MODEL` | AI model to use | `'gpt-4o-mini'` |

### How to Add in Vercel
1. Go to Vercel Dashboard
2. Select project → Settings → Environment Variables
3. Add variables for Production/Preview/Development
4. Redeploy for changes to take effect

---

## 🔗 Git Integration

### Connected Repository
- **Provider:** GitHub
- **Repo:** `seankrux/CTRB-editor`
- **Branch:** `main`
- **Root Directory:** `1. CTRB Json Editor/nextjs-migration`

### Deployment Triggers
| Event | Action |
|-------|--------|
| Push to `main` | Production deployment |
| Push to `develop` | Preview deployment |
| Pull Request | Preview deployment |

---

## 📊 Domain Configuration

### Default Domain
- **URL:** `https://ctrbooster-nebula.vercel.app` (or auto-generated)

### Custom Domain (Optional)
To add a custom domain:
1. Vercel Dashboard → Project → Settings → Domains
2. Add domain: `yourdomain.com`
3. Configure DNS:
   - **Type:** A or CNAME
   - **Value:** Provided by Vercel
4. SSL certificate auto-provisioned

---

## 🎯 Deployment Modes

### Production
- Triggered by: Push to `main`
- Optimizations: Full minification, tree-shaking
- CDN: Global edge network
- Analytics: Enabled

### Preview
- Triggered by: PR or push to feature branches
- Unique URL per deployment
- Comments on GitHub PR
- Auto-removed after PR merge

### Development
- Local: `npm run dev`
- Vercel CLI: `vercel dev`

---

## ✅ Pre-Deployment Checklist

- [x] `vercel.json` created
- [x] Build settings configured
- [x] Security headers set
- [x] Environment variables documented
- [x] Git integration ready
- [x] Branch protection rules understood

---

## 🚀 Deploy Commands

### One-Click Deploy URL
```
https://vercel.com/new/clone?repository-url=https://github.com/seankrux/CTRB-editor&project-name=ctrbooster-nebula&repository-name=ctrbooster-nebula&root-directory=1.%20CTRB%20Json%20Editor/nextjs-migration
```

### Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## 📈 Post-Deployment Verification

After deployment, verify:
- [ ] Site loads at deployment URL
- [ ] Theme toggle works
- [ ] Nebula background renders
- [ ] No console errors
- [ ] Security headers present
- [ ] Build completed without errors

---

## ✅ Task Completion

**Vercel settings configured and documented.** Ready for deployment.

**Next Step:** Task 24 - Deploy preview build to Vercel
