# Super Bot — Advanced Multi-Platform Bot System

> A production-ready, multi-language bot system combining a **Node.js/TypeScript** community management suite (Telegram + Discord) with a **Python AI upgrade** powered by Claude AI. The Node.js system handles 159 commands for moderation, leveling, and engagement. The Python AI module adds intelligent support automation.

![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Python](https://img.shields.io/badge/Python-3.12-blue) ![Claude AI](https://img.shields.io/badge/Claude-claude--sonnet--4--6-orange)

---

## What's in This Repo

| Component | Language | Description |
|-----------|----------|-------------|
| `telegram-bot/` | TypeScript | 104-command Telegram bot (MissRose feature parity) |
| `discord-bot/` | TypeScript | 55-command Discord bot (MEE6 feature parity) |
| `shared/` | TypeScript | Shared DB schema, models, AI service |
| `project1-support-bot/` | Python 3.12 | AI-powered support bot upgrade (Claude AI) |

---

## Node.js Bot System

### Telegram Bot — 104 Commands

Built with **Grammy** framework. Full MissRose feature parity.

| Module | Commands | What it does |
|--------|----------|--------------|
| Moderation | 22 | Ban, kick, mute, warn, purge — with silent and timed variants |
| Admin Management | 11 | Promote, demote, group config, log channel |
| Anti-Spam | 17 | Locks, flood protection, blacklist, CAPTCHA, anti-raid |
| Greetings | 10 | Welcome/goodbye with custom messages and verification |
| Content Management | 13 | Notes, filters, rules with media support |
| Federation System | 15 | Multi-group ban management |
| Utilities | 11 | Info, stats, connections |
| Fun | 5 | hug, pat, slap, roll, runs |

### Discord Bot — 55 Commands

Built with **Discord.js**. Full MEE6 feature parity.

| Module | Commands | What it does |
|--------|----------|--------------|
| Moderation | 16 | Ban, kick, mute, timeout, warn, purge with logging |
| Leveling System | 12 | XP, ranks, leaderboards, role rewards, multipliers |
| Custom Commands | 5 | User-defined commands with variable substitution |
| Reaction Roles | 4 | Self-assignable roles via emoji reactions |
| Engagement | 7 | Polls, giveaways, reminders, birthdays |
| Social Integration | 4 | Twitch, YouTube, Twitter, Reddit notifications |
| Utilities | 7 | Server info, user info, avatar, ping, role info |

### Node.js Quick Start

**Prerequisites:** Node.js 18+, PostgreSQL 14+, Redis 6+, pnpm

```bash
# Install dependencies
cd telegram-bot && pnpm install
cd ../discord-bot && pnpm install

# Configure
cp telegram-bot/.env.example telegram-bot/.env
cp discord-bot/.env.example discord-bot/.env

# Setup database
psql -U postgres -f scripts/init-db.sql

# Start (development)
cd telegram-bot && pnpm run dev
cd discord-bot && pnpm run dev
```

See `docs/installation/` for VPS and Docker deployment guides.

---

## Python AI Upgrade — Project 1

`project1-support-bot/` is a production-ready **AI-powered support bot** built in Python that adds intelligent FAQ answering, prompt injection protection, and human escalation on top of the existing bot system. It runs on both **Telegram** and **Discord** from a single codebase.

### What Project 1 Does

When a user sends a support message:

1. **Rate limit** — 5 messages per 60 seconds per user (sliding window, in-memory)
2. **Sanitize** — 8 prompt injection patterns blocked before reaching Claude AI
3. **AI answer** — Claude reads your `faq_data.json` and answers from it
4. **Escalate** — if Claude cannot answer, it notifies your human moderator

### Project 1 Quick Start

**Prerequisites:** Python 3.12, Anthropic API key, Telegram and/or Discord bot token

```bash
cd project1-support-bot
pip install -r requirements.txt
cp .env.example .env
# Fill in: TELEGRAM_TOKEN, DISCORD_TOKEN, ANTHROPIC_API_KEY
python main.py telegram    # or: python main.py discord
```

### Project 1 Features

| Feature | Details |
|---------|---------|
| Dual-platform | Telegram (aiogram 3.26) + Discord (discord.py 2.7) — one codebase |
| Claude AI answers | `claude-sonnet-4-6` answers from your custom `faq_data.json` |
| Prompt injection guard | Detects and blocks 8 known injection phrases |
| Per-user rate limiting | 5 messages / 60 seconds sliding window |
| Conversation history | Last 10 turns kept per user |
| Human escalation | Unresolvable tickets forwarded to moderator automatically |
| Singleton AI client | One `anthropic.Anthropic()` for the entire process |
| Graceful shutdown | SIGTERM/SIGINT handled cleanly — Railway compatible |

### Project 1 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TELEGRAM_TOKEN` | For Telegram | Token from @BotFather |
| `DISCORD_TOKEN` | For Discord | Token from Discord Developer Portal |
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key |
| `BOT_NAME` | No (default: SupportBot) | Name used in AI responses |
| `HUMAN_MODERATOR_CHAT_ID` | No | Telegram chat ID for escalations |

See `project1-support-bot/README.md` for full documentation.

---

## Node.js Configuration

### Telegram Bot

```env
BOT_TOKEN=your_telegram_bot_token
DATABASE_URL=postgresql://botuser:password@localhost:5432/bot_system
REDIS_URL=redis://:password@localhost:6379
LOG_LEVEL=info
ADMIN_IDS=123456789,987654321
OPENROUTER_API_KEY=sk_your_key        # optional AI chat
OPENROUTER_MODEL=anthropic/claude-3-haiku
```

### Discord Bot

```env
BOT_TOKEN=your_discord_bot_token
CLIENT_ID=your_client_id
DATABASE_URL=postgresql://botuser:password@localhost:5432/bot_system
REDIS_URL=redis://:password@localhost:6379
LOG_LEVEL=info
OPENROUTER_API_KEY=sk_your_key        # optional AI chat
OPENROUTER_MODEL=anthropic/claude-3-haiku
```

---

## Architecture

```
super-bot/
├── telegram-bot/          TypeScript Telegram bot (Grammy)
│   ├── src/commands/      104 commands across 8 modules
│   ├── src/handlers/      Message and event handlers
│   ├── src/middlewares/   Auth, rate limiting, logging
│   └── src/core/          Database, Redis, AI service
├── discord-bot/           TypeScript Discord bot (Discord.js)
│   ├── src/commands/      55 slash commands across 7 modules
│   ├── src/events/        Discord gateway event listeners
│   └── src/core/          Bot core and database
├── shared/                Shared TypeScript resources
│   ├── database/          PostgreSQL schema + migrations
│   └── services/ai/       OpenRouter AI service
├── project1-support-bot/  Python AI support bot (Claude AI)
│   ├── telegram_bot.py    aiogram 3.x handlers
│   ├── discord_bot.py     discord.py 2.x handlers
│   ├── ai_engine.py       Claude AI + FAQ + sanitizer
│   └── rate_limiter.py    Per-user sliding window
├── docs/                  Installation guides
├── scripts/               DB init, migrations, deploy scripts
└── docker-compose.yml     Full stack Docker setup
```

---

## Deployment

| Component | Platform | Cost |
|-----------|----------|------|
| Node.js bots | Railway / VPS / Docker | $5/month (Railway Hobby) |
| Python AI bot | Railway / VPS / Docker | $5/month (Railway Hobby) |
| Database | PostgreSQL on Railway or self-hosted | Included or $0 self-hosted |
| Cache | Redis on Railway or self-hosted | Included or $0 self-hosted |

### Docker (full stack)

```bash
cp .env.example .env      # fill in all credentials
docker-compose up -d      # starts telegram, discord, postgres, redis
docker-compose logs -f    # tail all logs
```

### VPS with PM2

```bash
# Node.js bots
pm2 start ecosystem.config.js
pm2 save && pm2 startup

# Python AI bot
cd project1-support-bot
pm2 start "python main.py telegram" --name ai-support-telegram
pm2 start "python main.py discord" --name ai-support-discord
pm2 save
```

---

## Security

- Input validation and sanitization on all commands
- Rate limiting: 100 req/min per user (Node.js), 5 msg/60s per user (Python AI bot)
- Permission-based access control — admin commands check role before executing
- SQL injection prevention via parameterized queries
- Prompt injection detection and blocking (Python AI bot)
- All AI failure paths return ESCALATE — raw errors never shown to users
- No secrets committed — `.env.example` provided for every component
- Audit logging for all moderation actions

---

## Related Repositories

| Repo | Contents |
|------|----------|
| [zakky8/Auto-Moderation](https://github.com/zakky8/Auto-Moderation) | Standalone scam detection bot for Discord |
| [zakky8/Support-Ticket-Classifier](https://github.com/zakky8/Support-Ticket-Classifier) | Streamlit ML ticket classifier |
| [zakky8/Crypto-Sentiment-Tracker](https://github.com/zakky8/Crypto-Sentiment-Tracker) | Live Reddit sentiment + CoinGecko dashboard |

---

## License

MIT License
