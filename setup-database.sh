#!/bin/bash
# Quick setup script for Project Aura database

echo "🚀 Project Aura - Database Setup"
echo "=================================="
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists. Backing up to .env.backup"
    cp .env .env.backup
fi

# Copy example
cp .env.example .env

echo "✅ Created .env file from template"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Choose a database provider (all have free tiers):"
echo ""
echo "   🟢 OPTION A: Vercel Postgres (Recommended - Auto-configures)"
echo "   ┌─────────────────────────────────────────────────────────┐"
echo "   │ 1. Go to: https://vercel.com/webecodin/settings/stores │"
echo "   │ 2. Click 'Create Database' → Choose 'Postgres'          │"
echo "   │ 3. Vercel auto-adds DATABASE_URL to your project        │"
echo "   │ 4. Copy .env.local from Vercel dashboard to local .env  │"
echo "   └─────────────────────────────────────────────────────────┘"
echo ""
echo "   🟣 OPTION B: Supabase (Free forever tier)"
echo "   ┌─────────────────────────────────────────────────────────┐"
echo "   │ 1. Go to: https://supabase.com/dashboard/projects      │"
echo "   │ 2. Click 'New Project'                                  │"
echo "   │ 3. Settings → Database → Connection String              │"
echo "   │ 4. Copy the 'Transaction' mode connection string        │"
echo "   └─────────────────────────────────────────────────────────┘"
echo ""
echo "   🔵 OPTION C: Neon (Generous free tier)"
echo "   ┌─────────────────────────────────────────────────────────┐"
echo "   │ 1. Go to: https://console.neon.tech/app/projects       │"
echo "   │ 2. Click 'New Project'                                  │"
echo "   │ 3. Copy connection string from dashboard                │"
echo "   └─────────────────────────────────────────────────────────┘"
echo ""
echo "2. Update DATABASE_URL in .env file:"
echo "   nano .env"
echo "   # or"
echo "   code .env"
echo ""
echo "3. Run database migrations:"
echo "   npm run prisma:migrate"
echo ""
echo "4. (Optional) Seed with sample data:"
echo "   npm run prisma:seed"
echo ""
echo "5. Start the dev server:"
echo "   npm run dev"
echo ""
echo "=================================="
