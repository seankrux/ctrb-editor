# CTRBooster Nebula - Next.js Migration Package

## 🌌 Overview

This is a complete Next.js 14 migration of the CTRBooster Campaign Editor with:

- ✨ **Nebula Theme** - Modern, sophisticated design with cosmic animations
- 🌓 **Light/Dark Mode** - Smooth transitions between themes
- ⚛️ **React 18** - Full TypeScript support
- 🎨 **Tailwind CSS** - Custom nebula theme configuration
- 🤖 **AI Assistant** - Integrated chat with OpenAI/Ollama support
- 🧪 **Playwright Tests** - Comprehensive test suite
- 🚀 **Vercel Ready** - One-click deployment

---

## 📦 Installation

### 1. Create Next.js Project

```bash
cd /Users/sean/Documents/Git/Sean\ M/CTR
npx create-next-app@latest ctrbooster-nebula --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

### 2. Install Dependencies

```bash
cd ctrbooster-nebula
npm install framer-motion lucide-react zustand clsx tailwind-merge
npm install -D @playwright/test
```

### 3. Copy Migration Files

Copy files from `nextjs-migration/` to your new project:

```bash
# Copy store
cp -r nextjs-migration/src/store src/

# Copy components
cp -r nextjs-migration/src/components src/

# Copy lib
cp -r nextjs-migration/src/lib src/

# Copy config files
cp nextjs-migration/tailwind.config.js ./
cp nextjs-migration/next.config.mjs ./
```

### 4. Update Global CSS

Replace `src/app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 222 47% 11%;
    --foreground: 210 40% 98%;
  }

  .light {
    --background: 255 100% 99%;
    --foreground: 222 47% 11%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
```

---

## 🎨 Nebula Theme Features

### Dark Mode (Default)
- Deep space background (#0f172a)
- Animated stars with twinkle effect
- Cosmic grid pattern
- Floating nebula clouds (purple, pink, cyan)
- Glassmorphism cards

### Light Mode
- Clean white/purple gradient
- Subtle cosmic patterns
- Soft shadows
- Maintains brand colors

### Toggle Animation
- Smooth icon rotation (Sun ↔ Moon)
- Scale animations on hover
- Sparkle effect on interaction

---

## 🧪 Running Tests

### Install Playwright Browsers

```bash
npx playwright install
```

### Run Test Suite

```bash
npm test
```

### Test with UI

```bash
npm run test:ui
```

### Test Coverage

The test suite includes:
- ✅ Campaign CRUD operations
- ✅ Theme toggle functionality
- ✅ AI chat integration
- ✅ Filter and search
- ✅ Bulk operations
- ✅ Export/Import
- ✅ Keyboard shortcuts
- ✅ Responsive design

---

## 🚀 Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - CTRBooster Nebula"
git branch -M main
git remote add origin https://github.com/yourusername/ctrbooster-nebula.git
git push -u origin main
```

### 2. Deploy to Vercel

**Option A: Vercel CLI**
```bash
npm i -g vercel
vercel
```

**Option B: Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Click "Deploy"

### 3. Environment Variables

No production environment variables are required for the current deployment target.

Use `nextjs-migration/.env.example` as the source of truth for optional local/test
variables.

---

## 📁 Project Structure

```
ctrbooster-nebula/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout with theme provider
│   │   ├── page.tsx         # Main campaign editor
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── NebulaBackground.tsx  # Animated background
│   │   ├── ThemeToggle.tsx       # Light/dark toggle
│   │   ├── CampaignList.tsx      # Campaign table
│   │   ├── CampaignCard.tsx      # Individual campaign
│   │   ├── AIChat.tsx            # AI assistant
│   │   └── ...
│   ├── store/
│   │   └── index.ts         # Zustand stores
│   └── lib/
│       └── utils.ts         # Utility functions
├── tests/
│   └── e2e/
│       └── campaign.spec.ts # Playwright tests
├── tailwind.config.js       # Theme configuration
├── next.config.mjs          # Next.js config
└── package.json
```

---

## 🎯 Key Components

### ThemeToggle
```tsx
import ThemeToggle from '@/components/ThemeToggle';

// Usage
<ThemeToggle />
```

### NebulaBackground
```tsx
import NebulaBackground from '@/components/NebulaBackground';

// Usage - Add to layout
<NebulaBackground />
```

### Store Usage
```tsx
import { useThemeStore, useCampaignStore } from '@/store';

// Theme
const { isDark, toggleTheme } = useThemeStore();

// Campaigns
const { campaigns, addCampaign, deleteCampaign } = useCampaignStore();
```

---

## 🤖 AI Integration

The AI assistant supports:
- OpenAI (GPT-4o, GPT-4o-mini, o1, etc.)
- Ollama (local models)
- Campaign-aware responses
- Action execution (create, edit, delete campaigns)

### Configuration
```tsx
import { useAIStore } from '@/store';

const { config, setConfig, isConfigured } = useAIStore();
```

---

## 🎨 Customization

### Change Nebula Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Change these for different nebula colors
    500: '#8b5cf6',  // Main purple
    600: '#7c3aed',
  },
  accent: {
    purple: '#a855f7',  // Cloud color 1
    pink: '#ec4899',    // Cloud color 2
    cyan: '#06b6d4',    // Cloud color 3
  },
}
```

### Adjust Animation Speed

```javascript
animation: {
  'float': 'float 6s ease-in-out infinite',  // Change 6s
  'twinkle': 'twinkle 3s ease-in-out infinite',  // Change 3s
}
```

---

## 📊 Performance Optimizations

- ✅ Code splitting with Next.js App Router
- ✅ Lazy loading for heavy components
- ✅ Optimized animations with Framer Motion
- ✅ Efficient state management with Zustand
- ✅ Memoized selectors and computations

---

## 🔒 Security

- API keys stored in localStorage (client-side only)
- No server-side key exposure
- Input sanitization on all user inputs
- XSS protection with proper escaping

---

## 📝 Migration Checklist

- [ ] Install Next.js project
- [ ] Copy migration files
- [ ] Install dependencies
- [ ] Update globals.css
- [ ] Configure tailwind.config.js
- [ ] Test theme toggle
- [ ] Test campaign CRUD
- [ ] Configure AI (optional)
- [ ] Run test suite
- [ ] Push to GitHub
- [ ] Deploy to Vercel

---

## 🐛 Troubleshooting

### Theme not switching
- Check if `dark` class is being toggled on `<html>`
- Verify Zustand persistence is working

### Animations janky
- Reduce animation complexity
- Check browser performance
- Disable animations in dev if needed

### Tests failing
- Ensure Playwright browsers installed
- Check port 8080 is available
- Verify test selectors match

---

## 📞 Support

For issues or questions:
1. Check this README
2. Review test files for examples
3. Check browser console for errors

---

**Version:** 5.0.0  
**License:** MIT  
**Built with:** Next.js 14, React 18, Tailwind CSS, Framer Motion
