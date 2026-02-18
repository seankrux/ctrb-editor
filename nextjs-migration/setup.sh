#!/bin/bash
# CTRBooster Nebula - Complete Setup Script
# Run this script to complete the Next.js setup

set -e

echo "🌌 CTRBooster Nebula - Setup Script"
echo "===================================="
echo ""

PROJECT_DIR="ctrbooster-nebula"
MIGRATION_DIR="1. CTRB Json Editor/nextjs-migration"

# Check if project exists
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Next.js project not found!"
    echo "Creating new project..."
    npx create-next-app@latest $PROJECT_DIR --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
fi

cd $PROJECT_DIR

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install framer-motion lucide-react zustand clsx tailwind-merge
npm install -D @playwright/test

# Copy migration files
echo ""
echo "📋 Copying migration files..."
mkdir -p src/store src/components src/lib

cp -r "../$MIGRATION_DIR/src/store/"* src/store/
cp -r "../$MIGRATION_DIR/src/components/"* src/components/
cp -r "../$MIGRATION_DIR/src/lib/"* src/lib/
cp "../$MIGRATION_DIR/tailwind.config.js" ./

# Install Playwright browsers
echo ""
echo "🎭 Installing Playwright browsers..."
npx playwright install

# Build project
echo ""
echo "🔨 Building project..."
npm run build

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Next steps:"
echo "   1. cd $PROJECT_DIR"
echo "   2. npm run dev"
echo "   3. Open http://localhost:3000"
echo ""
echo "📦 To deploy to Vercel:"
echo "   git init"
echo "   git add ."
echo "   git commit -m 'Initial commit - CTRBooster Nebula'"
echo "   git remote add origin YOUR_REPO_URL"
echo "   git push -u origin main"
echo "   Then deploy at vercel.com"
