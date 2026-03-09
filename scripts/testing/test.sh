#!/bin/bash
# Super Bot v3.0 — Test Runner
set -e

echo "Super Bot v3.0 — Running All Tests"
echo "==================================="

ROOT="$(cd "$(dirname "$0")/../../" && pwd)"

# 1. Build shared
echo ""
echo "[1/3] Building shared library..."
cd "$ROOT/shared"
npm ci --silent
npm run build
echo "✓ Shared built"

# 2. Run unit tests (shared/tests/AIService.test.ts)
echo ""
echo "[2/3] Running unit tests (shared)..."
npm test
echo "✓ Unit tests passed"

# 3. Type-check both bots
echo ""
echo "[3/3] Type-checking telegram-bot and discord-bot..."
cd "$ROOT/telegram-bot"
npm ci --silent
npx tsc --noEmit
echo "✓ telegram-bot: no type errors"

cd "$ROOT/discord-bot"
npm ci --silent
npx tsc --noEmit
echo "✓ discord-bot: no type errors"

echo ""
echo "✓ All tests and type-checks passed!"
