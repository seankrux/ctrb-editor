# 🚀 CTRBooster Nebula - Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Project Setup
- [ ] Next.js project created
- [ ] Dependencies installed
- [ ] Migration files copied
- [ ] Build successful

### 2. Code Quality
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] Tests pass (`npm test`)

### 3. Feature Testing
- [ ] Theme toggle works
- [ ] Nebula background renders
- [ ] Campaign CRUD works
- [ ] AI chat connects (if configured)
- [ ] Mobile responsive

### 4. Git Setup
- [ ] Repository created on GitHub
- [ ] Code committed
- [ ] Pushed to main branch

### 5. Vercel Deployment
- [ ] Vercel account created
- [ ] Project imported
- [ ] Deployed successfully
- [ ] Custom domain (optional)

---

## 📋 Quick Deploy Commands

### Step 1: Complete Setup
```bash
cd "/Users/sean/Documents/Git/Sean M/CTR/ctrbooster-nebula"

# Install remaining deps
npm install framer-motion lucide-react zustand clsx tailwind-merge
npm install -D @playwright/test

# Copy migration files
mkdir -p src/store src/components src/lib
cp -r "../1. CTRB Json Editor/nextjs-migration/src/store/"* src/store/
cp -r "../1. CTRB Json Editor/nextjs-migration/src/components/"* src/components/
cp -r "../1. CTRB Json Editor/nextjs-migration/src/lib/"* src/lib/
cp "../1. CTRB Json Editor/nextjs-migration/tailwind.config.js" ./
```

### Step 2: Test Locally
```bash
# Build and test
npm run build
npm run dev

# Open http://localhost:3000
# Verify theme toggle and animations work
```

### Step 3: Push to GitHub
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "feat: CTRBooster Nebula v5.0 - AI-powered campaign editor

- ✨ Nebula theme with light/dark mode
- 🤖 AI chat assistant
- 🎨 Framer Motion animations
- 🧪 Playwright E2E tests
- 🚀 Vercel ready"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/ctrbooster-nebula.git
git branch -M main
git push -u origin main
```

### Step 4: Deploy to Vercel

**Option A: Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel
```

**Option B: Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import `ctrbooster-nebula` repository
4. Click **"Deploy"**
5. Wait for deployment to complete

### Step 5: Verify Deployment
- [ ] Site loads at `https://ctrbooster-nebula.vercel.app`
- [ ] Theme toggle works
- [ ] Animations render smoothly
- [ ] No console errors

---

## 🎨 Post-Deployment Customization

### Add Your Logo
```tsx
// src/components/Header.tsx
<Image src="/logo.png" alt="Logo" width={150} height={50} />
```

### Configure AI
Add environment variable in Vercel:
- Name: `OPENAI_API_KEY`
- Value: `sk-your-key-here`

### Custom Domain
1. Vercel Dashboard → Settings → Domains
2. Add your domain
3. Configure DNS as instructed

---

## 📊 Performance Checklist

### Lighthouse Targets
- [ ] Performance: 90+
- [ ] Accessibility: 95+
- [ ] Best Practices: 95+
- [ ] SEO: 90+

### Run Lighthouse
```bash
npm install -g lighthouse
lighthouse http://localhost:3000 --view
```

---

## 🔒 Security Checklist

- [ ] No API keys in code
- [ ] `.env` files in `.gitignore`
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Security headers configured

---

## 📱 Mobile Testing

Test on real devices or use Chrome DevTools:
- [ ] iPhone 12/13/14
- [ ] Pixel 5/6
- [ ] iPad
- [ ] Touch interactions work
- [ ] No horizontal scroll

---

## 🌐 Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari
- [ ] Mobile Chrome

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Check for lint errors
npm run lint
```

### Animations Janky
- Reduce animation complexity
- Check browser performance
- Disable in production if needed

### Theme Not Persisting
- Check localStorage in DevTools
- Verify Zustand persistence config
- Clear cache and retry

---

## 📞 Support Resources

- **Docs:** `README.md`, `DEPLOYMENT.md`
- **Tests:** `tests/e2e/campaign.spec.ts`
- **Vercel:** [vercel.com/docs](https://vercel.com/docs)
- **Next.js:** [nextjs.org/docs](https://nextjs.org/docs)

---

## ✅ Deployment Complete!

When all checkboxes are checked:
- ✅ Code is production-ready
- ✅ Deployed to Vercel
- ✅ All features working
- ✅ Performance optimized
- ✅ Mobile responsive
- ✅ Tests passing

**🎉 Congratulations! Your CTRBooster Nebula is live!**

---

**Estimated Total Time:** 30-45 minutes
**Difficulty:** ⭐⭐☆☆☆ (Easy)
