#!/bin/bash
# Super Bot v3.0 — Database Migration Script
set -e

DB_URL="${DATABASE_URL:-postgresql://botuser:strongpassword@localhost:5432/bot_system}"

echo "Running Super Bot database migrations..."
echo "Target: $DB_URL"

echo "Step 1/2 — Initialising core schema..."
psql "$DB_URL" -f "$(dirname "$0")/../init-db.sql"
echo "✓ Core schema applied"

echo "Step 2/2 — Applying AI schema (Anthropic Claude)..."
psql "$DB_URL" -f "$(dirname "$0")/../ai-schema.sql"
echo "✓ AI schema applied"

echo ""
echo "✓ All migrations completed successfully!"
