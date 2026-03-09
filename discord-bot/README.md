# Discord Management Bot

Advanced Discord management bot with full MEE6 feature parity, built with **discord.js v14** and TypeScript.

## Features

- **Moderation** (16 commands) — ban, kick, mute, warn, purge, lockdown, timeout, and more
- **Leveling System** (12 commands) — XP tracking, rank cards, leaderboards, level roles
- **Custom Commands** (5 commands) — Create, edit, remove, and manage custom commands
- **Reaction Roles** (4 commands) — Assign roles via reactions
- **Engagement** (7 commands) — Polls, giveaways, reminders, timers, birthdays
- **Social Integrations** (4 commands) — Twitch, YouTube, Twitter, Reddit notifications
- **AI Chat** (1 command) — AI-powered chat via OpenRouter/Ollama
- **Utility** (7 commands) — Ping, help, server/user/role info, avatar, member count

**Total: 55 slash commands**

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js 18+ |
| Language | TypeScript 5.3 |
| Framework | discord.js 14 |
| Database | PostgreSQL |
| Cache | Redis |
| Logging | Winston |
| Testing | Jest |

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Discord Bot Token ([Discord Developer Portal](https://discord.com/developers/applications))

### Setup

1. **Install dependencies**
   ```bash
   cd discord-bot
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Start in development mode**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Project Structure

```
discord-bot/
├── src/
│   ├── index.ts                # Main entry point
│   ├── commands/               # 55 slash commands
│   │   ├── moderation/         # 16 moderation commands
│   │   ├── leveling/           # 12 leveling commands
│   │   ├── custom/             # 5 custom command management
│   │   ├── reactionroles/      # 4 reaction role commands
│   │   ├── engagement/         # 7 engagement commands
│   │   ├── social/             # 4 social integration commands
│   │   ├── ai/                 # 1 AI chat command
│   │   └── utility/            # 7 utility commands
│   ├── events/                 # Discord event handlers
│   ├── core/                   # Database, Redis, Logger
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Helper functions
│   └── handlers/               # Event processors
├── tests/                      # Jest test suites
├── package.json
├── tsconfig.json
└── Dockerfile
```

## Commands Reference

### Moderation
| Command | Description |
|---------|-------------|
| `/ban` | Ban a user from the server |
| `/kick` | Kick a user from the server |
| `/mute` | Mute/timeout a user |
| `/unmute` | Remove timeout from a user |
| `/warn` | Issue a warning to a user |
| `/warnings` | View user warnings |
| `/clearwarnings` | Clear all warnings for a user |
| `/clear` | Clear messages in a channel |
| `/purge` | Bulk delete messages |
| `/slowmode` | Set channel slowmode |
| `/timeout` | Timeout a user |
| `/unban` | Unban a user |
| `/lockdown` | Lock a channel |
| `/unlock` | Unlock a channel |
| `/reason` | Update a moderation reason |
| `/modlogs` | View moderation logs |

### Leveling
| Command | Description |
|---------|-------------|
| `/rank` | Show your rank card |
| `/leaderboard` | Server XP leaderboard |
| `/setlevel` | Set a user's level |
| `/setxp` | Set a user's XP |
| `/addxp` | Add XP to a user |
| `/removexp` | Remove XP from a user |
| `/levelroles` | Configure level role rewards |
| `/levelconfig` | Configure leveling system |
| `/levelchannel` | Set level-up announcement channel |
| `/levelmessage` | Customize level-up message |
| `/xpmultiplier` | Set XP multiplier |
| `/resetlevels` | Reset all levels |

### Engagement
| Command | Description |
|---------|-------------|
| `/poll` | Create a poll |
| `/giveaway` | Start a giveaway |
| `/endgiveaway` | End a giveaway early |
| `/reroll` | Reroll giveaway winner |
| `/reminder` | Set a reminder |
| `/timer` | Start a countdown timer |
| `/birthday` | Birthday tracking |

### Utility
| Command | Description |
|---------|-------------|
| `/ping` | Check bot latency |
| `/help` | Display help information |
| `/serverinfo` | Show server information |
| `/userinfo` | Show user information |
| `/roleinfo` | Show role information |
| `/avatar` | Display user avatar |
| `/membercount` | Show member statistics |

## Scripts

```bash
npm run dev          # Start with hot-reload (tsx watch)
npm run build        # Compile TypeScript
npm start            # Run compiled JS
npm test             # Run tests with coverage
npm run lint         # Lint source files
npm run lint:fix     # Auto-fix lint issues
npm run format       # Format with Prettier
```

## Environment Variables

See `.env.example` for all available configuration options including:
- `BOT_TOKEN` — Discord bot token
- `CLIENT_ID` — Discord application client ID
- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_URL` — Redis connection string

## License

MIT — see [LICENSE](../LICENSE)
