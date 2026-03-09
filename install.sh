#!/bin/bash
# Super Bot v3.0 — Installation Script
# Automates setup for the Telegram + Discord bot system with Anthropic Claude AI

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════╗"
echo "║       Super Bot v3.0 - Installation Script                ║"
echo "║       Telegram + Discord + Anthropic Claude AI            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# ── Colour helpers ─────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_error()   { echo -e "${RED}✗${NC} $1"; }
print_info()    { echo -e "${YELLOW}ℹ${NC} $1"; }

# ── Prerequisite checks ────────────────────────────────────────────────────────
if [ "$EUID" -eq 0 ]; then
    print_error "Please do not run as root"
    exit 1
fi

print_info "Checking Node.js version..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi
print_success "Node.js $(node -v) found"

print_info "Checking PostgreSQL..."
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL is not installed. Please install PostgreSQL 14+ first."
    exit 1
fi
print_success "PostgreSQL found"

print_info "Checking Redis..."
if ! command -v redis-cli &> /dev/null; then
    print_error "Redis is not installed. Please install Redis 6+ first."
    exit 1
fi
if ! redis-cli ping &> /dev/null; then
    print_error "Redis is not running. Please start Redis: redis-server"
    exit 1
fi
print_success "Redis is running"

# ── Installation type ──────────────────────────────────────────────────────────
echo ""
echo "Select installation type:"
echo "  1) Clean install (recommended)"
echo "  2) Upgrade from v2.x"
echo ""
read -p "Enter choice [1-2]: " INSTALL_TYPE

case $INSTALL_TYPE in
    1)
        echo ""
        print_info "Starting clean installation..."

        # shared (must be built first — both bots reference it via project references)
        print_info "Building shared library..."
        cd shared
        npm install --silent
        npm run build
        print_success "Shared library built"
        cd ..

        # Discord bot
        print_info "Installing Discord bot dependencies..."
        cd discord-bot
        npm install --silent
        print_success "Discord bot dependencies installed"
        [ ! -f .env ] && cp .env.example .env && print_info "Created discord-bot/.env — please edit with your credentials"
        cd ..

        # Telegram bot
        print_info "Installing Telegram bot dependencies..."
        cd telegram-bot
        npm install --silent
        print_success "Telegram bot dependencies installed"
        [ ! -f .env ] && cp .env.example .env && print_info "Created telegram-bot/.env — please edit with your credentials"
        cd ..

        # Database
        echo ""
        print_info "Database setup — run these commands when ready:"
        echo "  psql -U postgres -f scripts/init-db.sql"
        echo "  psql -U postgres -d bot_system -f scripts/ai-schema.sql"
        ;;

    2)
        echo ""
        print_info "Starting upgrade from v2.x..."
        print_info "Make sure you have backed up your database and .env files!"
        read -p "Have you backed up? (yes/no): " BACKUP_DONE
        [ "$BACKUP_DONE" != "yes" ] && print_error "Please backup first!" && exit 1

        cd shared && npm install --silent && npm run build && cd ..
        cd discord-bot && npm install --silent && cd ..
        cd telegram-bot && npm install --silent && cd ..

        print_success "All dependencies updated"
        echo ""
        print_info "Run any pending database migrations:"
        echo "  psql -U postgres -d bot_system -f scripts/ai-schema.sql"
        ;;

    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

# ── Ollama check (optional) ────────────────────────────────────────────────────
echo ""
print_info "Checking for Ollama (optional AI fallback)..."
if command -v ollama &> /dev/null; then
    print_success "Ollama found"
    print_info "Tip: pull a fallback model with: ollama pull llama3.2:3b"
else
    print_info "Ollama not found (optional). Install from https://ollama.com/"
fi

# ── Done ───────────────────────────────────────────────────────────────────────
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                   Installation Complete!                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
print_success "Installation completed successfully!"
echo ""
echo "Next steps:"
echo ""
echo "  1. Configure your .env files:"
echo "       discord-bot/.env"
echo "       telegram-bot/.env"
echo ""
echo "  2. Add your required credentials:"
echo "       DISCORD_BOT_TOKEN / TELEGRAM_BOT_TOKEN"
echo "       ANTHROPIC_API_KEY  (get from https://console.anthropic.com/)"
echo "       DATABASE_URL       (PostgreSQL connection string)"
echo ""
echo "  3. Edit faq_data.json with your community Q&A pairs"
echo ""
echo "  4. (Discord only) Deploy slash commands:"
echo "       cd discord-bot && npm run deploy"
echo ""
echo "  5. Start the bots:"
echo "       cd discord-bot  && npm run dev"
echo "       cd telegram-bot && npm run dev"
echo ""
echo "  6. Test AI features:"
echo "       Discord:  /chat message:Hello!"
echo "       Telegram: /chat Hello!"
echo ""
echo "  See README.md for full documentation."
echo ""
print_success "Happy botting! 🤖"
