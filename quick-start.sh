#!/bin/bash

# Quick Start Script for Bot System
# This script helps you get started quickly

set -e

echo "🤖 Bot System Quick Start"
echo "=========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check if pnpm is installed, if not use npm
if command -v pnpm &> /dev/null; then
    PKG_MANAGER="pnpm"
    echo "✅ pnpm detected"
else
    PKG_MANAGER="npm"
    echo "⚠️  pnpm not found, using npm"
fi

# Ask user which bot to setup
echo ""
echo "Which bot would you like to setup?"
echo "1) Discord Bot"
echo "2) Telegram Bot"
echo "3) Both"
read -p "Enter choice [1-3]: " bot_choice

setup_discord() {
    echo ""
    echo "📀 Setting up Discord Bot..."
    cd discord-bot
    
    # Install dependencies
    echo "Installing dependencies..."
    $PKG_MANAGER install
    
    # Setup environment
    if [ ! -f .env ]; then
        cp .env.example .env
        echo "⚙️  Created .env file - Please edit it with your bot token!"
    fi
    
    # Create logs directory
    mkdir -p logs
    
    echo "✅ Discord bot setup complete!"
    echo "   Next steps:"
    echo "   1. Edit discord-bot/.env with your bot token"
    echo "   2. Setup database (see INSTALLATION_GUIDE.md)"
    echo "   3. Run: cd discord-bot && $PKG_MANAGER run dev"
    cd ..
}

setup_telegram() {
    echo ""
    echo "📱 Setting up Telegram Bot..."
    cd telegram-bot
    
    # Install dependencies
    echo "Installing dependencies..."
    $PKG_MANAGER install
    
    # Setup environment
    if [ ! -f .env ]; then
        cp .env.example .env
        echo "⚙️  Created .env file - Please edit it with your bot token!"
    fi
    
    # Create logs directory
    mkdir -p logs
    
    echo "✅ Telegram bot setup complete!"
    echo "   Next steps:"
    echo "   1. Edit telegram-bot/.env with your bot token"
    echo "   2. Setup database (see INSTALLATION_GUIDE.md)"
    echo "   3. Run: cd telegram-bot && $PKG_MANAGER run dev"
    cd ..
}

case $bot_choice in
    1)
        setup_discord
        ;;
    2)
        setup_telegram
        ;;
    3)
        setup_discord
        setup_telegram
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🎉 Setup complete!"
echo "📖 Read INSTALLATION_GUIDE.md for detailed setup instructions"
echo "🧪 Read TESTING_GUIDE.md for testing instructions"
