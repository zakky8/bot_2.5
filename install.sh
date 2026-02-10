#!/bin/bash
# Quick Installation Script for Bot System v2.5
# This script automates the installation process

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Bot System v2.5 - Quick Installation Script          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    print_error "Please do not run as root"
    exit 1
fi

# Check Node.js version
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

# Check PostgreSQL
print_info "Checking PostgreSQL..."
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL is not installed. Please install PostgreSQL 14+ first."
    exit 1
fi
print_success "PostgreSQL found"

# Check Redis
print_info "Checking Redis..."
if ! command -v redis-cli &> /dev/null; then
    print_error "Redis is not installed. Please install Redis 6+ first."
    exit 1
fi

# Test Redis connection
if ! redis-cli ping &> /dev/null; then
    print_error "Redis is not running. Please start Redis first: redis-server"
    exit 1
fi
print_success "Redis is running"

# Ask for installation type
echo ""
echo "Select installation type:"
echo "1) Clean install (recommended)"
echo "2) Upgrade from v2.0"
echo ""
read -p "Enter choice [1-2]: " INSTALL_TYPE

case $INSTALL_TYPE in
    1)
        echo ""
        print_info "Starting clean installation..."
        
        # Discord Bot
        print_info "Installing Discord bot dependencies..."
        cd discord-bot
        npm install --silent
        print_success "Discord bot dependencies installed"
        
        # Copy environment file
        if [ ! -f .env ]; then
            cp .env.example .env
            print_info "Created .env file. Please edit discord-bot/.env with your configuration"
        fi
        cd ..
        
        # Telegram Bot
        print_info "Installing Telegram bot dependencies..."
        cd telegram-bot
        npm install --silent
        print_success "Telegram bot dependencies installed"
        
        # Copy environment file
        if [ ! -f .env ]; then
            cp .env.example .env
            print_info "Created .env file. Please edit telegram-bot/.env with your configuration"
        fi
        cd ..
        
        # Database setup
        echo ""
        print_info "Database setup required. Please run:"
        echo "  psql -U postgres -f scripts/init-db.sql"
        echo "  psql -U postgres -d botdb -f scripts/ai-schema.sql"
        ;;
        
    2)
        echo ""
        print_info "Starting upgrade from v2.0..."
        
        # Backup reminder
        print_info "Make sure you have backed up your database and .env files!"
        read -p "Have you backed up? (yes/no): " BACKUP_DONE
        
        if [ "$BACKUP_DONE" != "yes" ]; then
            print_error "Please backup first!"
            exit 1
        fi
        
        # Install dependencies
        cd discord-bot && npm install --silent && cd ..
        cd telegram-bot && npm install --silent && cd ..
        
        print_success "Dependencies updated"
        
        # Migration reminder
        echo ""
        print_info "Run database migrations:"
        echo "  psql -U postgres -d botdb -f scripts/ai-schema.sql"
        ;;
        
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

# Check for Ollama (optional)
echo ""
print_info "Checking for Ollama (optional)..."
if command -v ollama &> /dev/null; then
    print_success "Ollama found"
    print_info "Recommended: Pull a model with 'ollama pull llama3.2:3b'"
else
    print_info "Ollama not found (optional). Install from https://ollama.com/"
fi

# Final instructions
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                Installation Complete!                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
print_success "Installation completed successfully!"
echo ""
echo "Next steps:"
echo "1. Configure your .env files:"
echo "   - discord-bot/.env"
echo "   - telegram-bot/.env"
echo ""
echo "2. Add your API keys:"
echo "   - Discord/Telegram bot tokens"
echo "   - OpenRouter API key (get from https://openrouter.ai/keys)"
echo "   - Database credentials"
echo ""
echo "3. Run database migrations (if not done):"
echo "   psql -U postgres -f scripts/init-db.sql"
echo "   psql -U postgres -d botdb -f scripts/ai-schema.sql"
echo ""
echo "4. Start the bots:"
echo "   cd discord-bot && npm run dev"
echo "   cd telegram-bot && npm run dev"
echo ""
echo "5. Test AI features:"
echo "   Discord: /ai Hello!"
echo "   Telegram: /ai Hello!"
echo ""
echo "For detailed instructions, see DELIVERY_SUMMARY.md"
echo ""
print_success "Happy botting! 🤖"
