# 🚀 CTRBooster Nebula - Deployment Guide

## Quick Deploy to Vercel

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/ctrbooster-nebula)

### Option 2: Manual Deploy

#### 1. Push to GitHub

```bash
# Navigate to project
cd ctrbooster-nebula

# Initialize git
git init
git add .
git commit -m "Initial commit - CTRBooster Nebula v5.0"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/ctrbooster-nebula.git
git branch -M main
git push -u origin main
```

#### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
5. Click **"Deploy"**

#### 3. Add Environment Variables (Optional)

In Vercel Dashboard → Settings → Environment Variables:

| Name | Value | Environment |
|------|-------|-------------|
| `OPENAI_API_KEY` | `sk-...` | Production |

---

## Pre-Deployment Checklist

### ✅ Code Quality

```bash
# Run linter
npm run lint

# Run type check
npx tsc --noEmit

# Run tests
npm test
```

### ✅ Build Test

```bash
# Test production build locally
npm run build
npm run start
```

### ✅ Performance Check

```bash
# Run Lighthouse
npm install -g lighthouse
lighthouse http://localhost:3000 --view
```

Expected scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

---

## Post-Deployment Verification

### 1. Check Live Site

- [ ] Site loads correctly
- [ ] Theme toggle works
- [ ] Nebula animations render
- [ ] Campaign CRUD works
- [ ] AI chat connects (if configured)

### 2. Test Core Features

- [ ] Create campaign
- [ ] Edit campaign
- [ ] Delete campaign
- [ ] Undo delete (Ctrl+Z)
- [ ] Filter campaigns
- [ ] Search campaigns
- [ ] Export campaigns
- [ ] Import campaigns
- [ ] AI chat (if configured)

### 3. Mobile Testing

- [ ] Mobile viewport works
- [ ] Touch interactions work
- [ ] Responsive layout adapts

### 4. Browser Testing

Test on:
- [ ] Chrome (Desktop)
- [ ] Firefox (Desktop)
- [ ] Safari (Desktop)
- [ ] Chrome (Mobile)
- [ ] Safari (Mobile)

---

## Custom Domain

### 1. Add Domain in Vercel

1. Go to Project Settings → Domains
2. Add your domain: `ctrbooster.yourdomain.com`
3. Follow DNS configuration instructions

### 2. Configure DNS

**For apex domain:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## Performance Optimization

### Enable Edge Functions (Optional)

```javascript
// next.config.mjs
module.exports = {
  experimental: {
    runtime: 'edge',
  },
}
```

### Image Optimization

```tsx
import Image from 'next/image';

// Use Next.js Image component
<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority
/>
```

### Code Splitting

```tsx
// Lazy load heavy components
import dynamic from 'next/dynamic';

const AIChat = dynamic(() => import('@/components/AIChat'), {
  ssr: false,
  loading: () => <p>Loading...</p>
});
```

---

## Monitoring

### Vercel Analytics

1. Enable in Vercel Dashboard → Analytics
2. Add to layout:

```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Error Tracking

Install Sentry:

```bash
npm install @sentry/nextjs
```

Configure in `sentry.client.config.js`:

```javascript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

---

## Rollback

If deployment fails:

1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click **"Promote to Production"**

Or via CLI:

```bash
vercel rollback
```

---

## Cost Optimization

### Free Tier Limits

- **Bandwidth:** 100 GB/month
- **Build Minutes:** 6,000 minutes/month
- **Serverless Function Executions:** 100 GB-hours

### Tips

1. Enable ISR (Incremental Static Regeneration)
2. Use Edge Functions for simple routes
3. Optimize images (WebP format)
4. Enable compression

---

## Security

### Environment Variables

Never commit `.env` files:

```bash
# .env.local
OPENAI_API_KEY=sk-...
```

```gitignore
# .gitignore
.env
.env.local
.env.production
```

### Rate Limiting

Add API rate limiting in `app/api/`:

```typescript
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});
```

---

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Review build errors
3. Test locally first
4. Check environment variables

---

**Deployed with ❤️ using Vercel**
