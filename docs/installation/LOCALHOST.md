# 📍 Localhost Installation Guide

Complete guide for running the bot system on your local machine for development and testing.

## Prerequisites

### Required Software
- **Node.js** 18.0.0 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 14.0 or higher ([Download](https://www.postgresql.org/download/))
- **Redis** 6.0 or higher ([Download](https://redis.io/download))
- **Git** (for cloning the repository)

### Optional but Recommended
- **pnpm** (faster than npm): `npm install -g pnpm`
- **Docker** & **Docker Compose** (alternative method)

## Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/upgraded-bot-system.git
cd upgraded-bot-system
```

### 2. Install PostgreSQL

#### Windows
1. Download installer from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run installer and follow wizard
3. Remember the password you set for `postgres` user
4. Add PostgreSQL to PATH: `C:\Program Files\PostgreSQL\16\bin`

#### macOS
```bash
# Using Homebrew
brew install postgresql@14
brew services start postgresql@14
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 3. Install Redis

#### Windows
1. Download Redis from [GitHub releases](https://github.com/microsoftarchive/redis/releases)
2. Extract and run `redis-server.exe`

Or use Windows Subsystem for Linux (WSL):
```bash
wsl --install
# Then follow Linux instructions inside WSL
```

#### macOS
```bash
brew install redis
brew services start redis
```

#### Linux
```bash
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### 4. Setup Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE bot_system;
CREATE USER botuser WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE bot_system TO botuser;
\q

# Run initialization script
psql -U botuser -d bot_system -f scripts/init-db.sql

# Run migrations
cd shared/database/migrations
psql -U botuser -d bot_system -f 001_initial_schema.sql
psql -U botuser -d bot_system -f 002_indexes.sql
```

### 5. Configure Environment Variables

#### Telegram Bot
```bash
cd telegram-bot
cp .env.example .env
```

Edit `.env` file:
```env
# Bot Configuration
BOT_TOKEN=your_telegram_bot_token_from_botfather
BOT_USERNAME=your_bot_username

# Database
DATABASE_URL=postgresql://botuser:your_secure_password@localhost:5432/bot_system

# Redis
REDIS_URL=redis://localhost:6379

# Admin Configuration
ADMIN_IDS=123456789,987654321  # Your Telegram user ID(s)
OWNER_ID=123456789  # Primary owner ID

# Logging
LOG_LEVEL=debug  # debug, info, warn, error
LOG_FILE=./logs/bot.log

# Features
ENABLE_WEB_PREVIEW=false
MAX_FILE_SIZE=52428800  # 50MB in bytes
RATE_LIMIT_MESSAGES=30  # messages per minute per user
RATE_LIMIT_WINDOW=60000  # 1 minute in ms

# Optional: Federation
FEDERATION_BROADCAST=true
FEDERATION_LOG_CHANNEL=-1001234567890

# Optional: External APIs
WEATHER_API_KEY=your_api_key_optional
TRANSLATION_API_KEY=your_api_key_optional
```

#### Discord Bot
```bash
cd ../discord-bot
cp .env.example .env
```

Edit `.env` file:
```env
# Bot Configuration
BOT_TOKEN=your_discord_bot_token
CLIENT_ID=your_application_client_id
GUILD_ID=your_test_server_id_optional

# Database
DATABASE_URL=postgresql://botuser:your_secure_password@localhost:5432/bot_system

# Redis
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=debug
LOG_FILE=./logs/bot.log

# Features
ENABLE_LEVELING=true
XP_PER_MESSAGE=10
XP_COOLDOWN=60  # seconds
LEVEL_UP_CHANNEL=general  # or channel ID

# Moderation
MUTE_ROLE_NAME=Muted
LOG_CHANNEL_NAME=mod-logs

# Optional: Social Media
TWITCH_CLIENT_ID=your_client_id
TWITCH_CLIENT_SECRET=your_secret
YOUTUBE_API_KEY=your_api_key
TWITTER_BEARER_TOKEN=your_token
```

### 6. Get Bot Tokens

#### Telegram Bot
1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow instructions to create your bot
4. Copy the token (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
5. Send `/setprivacy` to BotFather, select your bot, choose `Disable` (bot needs to read all messages)
6. Send `/setjoingroups` and choose `Enable`
7. Send `/setcommands` and paste:
```
start - Start the bot
help - Show help menu
settings - View chat settings
ping - Check bot latency
```

**Get Your User ID:**
1. Search [@userinfobot](https://t.me/userinfobot)
2. Start the bot - it will show your ID
3. Use this ID in `ADMIN_IDS` and `OWNER_ID`

#### Discord Bot
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give it a name and click "Create"
4. Go to "Bot" tab
5. Click "Add Bot"
6. Under "TOKEN", click "Reset Token" and copy it
7. Enable these Privileged Gateway Intents:
   - ✅ Presence Intent
   - ✅ Server Members Intent  
   - ✅ Message Content Intent
8. Go to "OAuth2" > "URL Generator"
9. Select scopes: `bot`, `applications.commands`
10. Select permissions:
    - Administrator (or specific permissions you need)
11. Copy the generated URL and open it to invite the bot

**Get Client ID:**
- In Developer Portal, go to "OAuth2" tab
- Copy "CLIENT ID"

### 7. Install Dependencies

#### Telegram Bot
```bash
cd telegram-bot

# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

#### Discord Bot
```bash
cd ../discord-bot

pnpm install
# or npm install
```

### 8. Build and Start

#### Telegram Bot
```bash
cd telegram-bot

# Development mode (with hot reload)
pnpm run dev

# Production mode
pnpm run build
pnpm start
```

#### Discord Bot
```bash
cd discord-bot

# Deploy slash commands first (one-time or when commands change)
pnpm run deploy

# Development mode
pnpm run dev

# Production mode
pnpm run build
pnpm start
```

### 9. Verify Installation

#### Telegram Bot
1. Open Telegram
2. Search for your bot (@your_bot_username)
3. Send `/start` command
4. Bot should respond with a welcome message
5. Add bot to a test group
6. Make bot admin
7. Try `/help` to see all commands

#### Discord Bot
1. Bot should appear online in your server
2. Type `/help` to see all commands
3. Try `/ping` to test responsiveness
4. Give bot necessary permissions in Server Settings

## Troubleshooting

### Database Connection Issues

**Problem**: `ECONNREFUSED` or `could not connect to server`

**Solution**:
```bash
# Check PostgreSQL is running
# Windows
services.msc  # Look for "postgresql" service

# macOS
brew services list

# Linux
sudo systemctl status postgresql

# Test connection
psql -U botuser -d bot_system -c "SELECT 1;"
```

### Redis Connection Issues

**Problem**: `Redis connection to localhost:6379 failed`

**Solution**:
```bash
# Check Redis is running
redis-cli ping  # Should return "PONG"

# Start Redis if not running
# macOS
brew services start redis

# Linux
sudo systemctl start redis-server

# Windows
# Run redis-server.exe
```

### Bot Token Invalid

**Problem**: `401 Unauthorized` or `Invalid token`

**Solution**:
- Double-check token in `.env` file
- Ensure no spaces or extra characters
- For Telegram: Get new token from @BotFather using `/token`
- For Discord: Reset token in Developer Portal

### Permission Errors

**Problem**: Bot can't execute commands

**Solution**:
- **Telegram**: Make sure bot is admin in the group
- **Discord**: Check bot has necessary permissions in Server Settings > Roles
- Verify role hierarchy (bot's role must be above members' roles)

### Module Not Found

**Problem**: `Cannot find module 'xyz'`

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
pnpm install

# Or
npm ci
```

### Port Already in Use

**Problem**: `EADDRINUSE`

**Solution**:
```bash
# Find and kill process using the port
# Linux/macOS
lsof -ti:6379 | xargs kill -9

# Windows
netstat -ano | findstr :6379
taskkill /PID <PID> /F
```

## Next Steps

- 📖 Read [Configuration Guide](../CONFIGURATION.md)
- 📝 See [Commands Reference](../COMMANDS.md)
- 🧪 Run tests: `pnpm test`
- 🚀 Deploy to production: See [VPS Guide](VPS.md)

## Development Tips

### Viewing Logs
```bash
# Telegram bot logs
tail -f telegram-bot/logs/bot.log

# Discord bot logs
tail -f discord-bot/logs/bot.log

# Database logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### Database Management
```bash
# Connect to database
psql -U botuser -d bot_system

# View tables
\dt

# View table structure
\d users

# View recent logs
SELECT * FROM moderation_logs ORDER BY created_at DESC LIMIT 10;
```

### Redis Inspection
```bash
redis-cli

# List all keys
KEYS *

# Get value
GET key_name

# Monitor commands in real-time
MONITOR
```

### Debugging
```typescript
// Set LOG_LEVEL=debug in .env for verbose output

// Add breakpoints in code
debugger;

// Or use logging
import { logger } from './core/logger';
logger.debug('Variable value:', variable);
```

## Performance Optimization

### Development
- Use `pnpm` instead of `npm` (3x faster)
- Enable `ts-node` caching
- Use `tsx watch` for faster rebuilds

### Database
```sql
-- Create indexes for frequently queried fields
CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_warnings_user_id ON warnings(user_id);
```

### Redis Caching
```typescript
// Cache frequently accessed data
await redis.set(`user:${userId}`, JSON.stringify(userData), 'EX', 3600);
```

## Security Best Practices

1. **Never commit `.env` files**
2. **Use strong database passwords**
3. **Restrict PostgreSQL to localhost**:
```bash
# In pg_hba.conf
local   all    all    md5
host    all    all    127.0.0.1/32    md5
```
4. **Enable Redis password**:
```bash
# In redis.conf
requirepass your_strong_password
```
5. **Keep dependencies updated**:
```bash
pnpm update
pnpm audit
```

## Support

Need help? 
- 📧 Email: support@example.com
- 💬 Discord: [Join our server](https://discord.gg/example)
- 🐛 Report issues: [GitHub Issues](https://github.com/example/issues)

---

✅ Installation complete! Your bots should now be running on localhost.
