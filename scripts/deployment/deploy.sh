#!/bin/bash
# Super Bot v3.0 — Deployment Script
set -e

echo "Super Bot v3.0 — Deployment"
echo "============================"

# Build shared library first (project references)
echo "Building shared library..."
cd "$(dirname "$0")/../../shared"
npm ci
npm run build
echo "✓ Shared library built"

# Build Discord bot
echo "Building Discord bot..."
cd ../discord-bot
npm ci
npm run build
echo "✓ Discord bot built"

# Build Telegram bot
echo "Building Telegram bot..."
cd ../telegram-bot
npm ci
npm run build
echo "✓ Telegram bot built"

cd ..

echo ""
echo "Starting with PM2..."
pm2 start ecosystem.config.js
pm2 save

echo ""
echo "✓ Deployment complete!"
echo "Monitor with: pm2 status"
echo "Logs with:    pm2 logs"
