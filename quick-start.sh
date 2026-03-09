#!/bin/bash
# Super Bot v3.0 — Quick Start Script
# Gets you up and running in minutes

set -e

echo "🤖 Super Bot v3.0 — Quick Start"
echo "=================================="
echo ""

# ── Node.js check ──────────────────────────────────────────────────────────────
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi
echo "✅ Node.js $(node --version) detected"

# ── Bot selection ──────────────────────────────────────────────────────────────
echo ""
echo "Which bot would you like to set up?"
echo "  1) Discord Bot"
echo "  2) Telegram Bot"
echo "  3) Both (recommended)"
read -p "Enter choice [1-3]: " bot_choice

setup_shared() {
    echo ""
    echo "📦 Building shared library (required by both bots)..."
    cd shared
    npm install --silent
    npm run build
    echo "✅ Shared library built"
    cd ..
}

setup_discord() {
    echo ""
    echo "📀 Setting up Discord Bot..."
    cd discord-bot
    npm install --silent
    [ ! -f .env ] && cp .env.example .env && echo "⚙️  Created discord-bot/.env — edit it with your credentials"
    mkdir -p logs
    echo "✅ Discord bot ready"
    echo ""
    echo "   Next steps:"
    echo "   1. Edit discord-bot/.env — add DISCORD_BOT_TOKEN, ANTHROPIC_API_KEY, DATABASE_URL"
    echo "   2. Deploy slash commands: cd discord-bot && npm run deploy"
    echo "   3. Start: cd discord-bot && npm run dev"
    cd ..
}

setup_telegram() {
    echo ""
    echo "📱 Setting up Telegram Bot..."
    cd telegram-bot
    npm install --silent
    [ ! -f .env ] && cp .env.example .env && echo "⚙️  Created telegram-bot/.env — edit it with your credentials"
    mkdir -p logs
    echo "✅ Telegram bot ready"
    echo ""
    echo "   Next steps:"
    echo "   1. Edit telegram-bot/.env — add BOT_TOKEN, ANTHROPIC_API_KEY, DATABASE_URL"
    echo "   2. Start: cd telegram-bot && npm run dev"
    cd ..
}

case $bot_choice in
    1) setup_shared; setup_discord ;;
    2) setup_shared; setup_telegram ;;
    3) setup_shared; setup_discord; setup_telegram ;;
    *) echo "Invalid choice"; exit 1 ;;
esac

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Don't forget:"
echo "   • Add ANTHROPIC_API_KEY to your .env (https://console.anthropic.com/)"
echo "   • Edit faq_data.json with your community Q&A pairs"
echo "   • Run database migrations: psql -U postgres -f scripts/init-db.sql"
echo ""
echo "📖 Full documentation: README.md"
echo "🐳 Docker deployment:  docker-compose up -d"
