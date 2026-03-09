# Telegram Management Bot

Advanced Telegram group management bot with comprehensive moderation, anti-spam, federation support, and AI integration. Built with **grammY** and TypeScript.

## Features

- **Moderation** (22 commands) — Ban, kick, mute, warn, purge, pin, slowmode, admin list, zombie detection
- **Admin** (11 commands) — Promote, demote, set title, group settings, invite links
- **Anti-Spam** (17 commands) — Lock/unlock, flood control, blacklist, CAPTCHA, anti-raid
- **Greetings** (10 commands) — Welcome/goodbye messages, clean service messages, welcome mute
- **Content** (13 commands) — Notes, filters, rules system
- **Federation** (15 commands) — Cross-group ban federation system
- **Utility** (11 commands) — Start, help, info, IDs, ping, stats, settings, connections
- **Fun** (5 commands) — Roll dice, slap, pat, hug, random run messages
- **AI Chat** (1 command) — AI-powered chat via OpenRouter/Ollama

**Total: 104 commands**

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js 18+ |
| Language | TypeScript 5.3 |
| Framework | grammY |
| Database | PostgreSQL |
| Cache | Redis |
| Logging | Winston |
| i18n | @grammyjs/i18n |
| Testing | Jest |

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Telegram Bot Token ([@BotFather](https://t.me/BotFather))

### Setup

1. **Install dependencies**
   ```bash
   cd telegram-bot
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
telegram-bot/
├── src/
│   ├── index.ts                # Main entry point
│   ├── commands/               # 104 bot commands
│   │   ├── moderation/         # 22 moderation commands
│   │   ├── admin/              # 11 admin commands
│   │   ├── antispam/           # 17 anti-spam commands
│   │   ├── greetings/          # 10 greeting commands
│   │   ├── content/            # 13 content commands
│   │   ├── federation/         # 15 federation commands
│   │   ├── utility/            # 11 utility commands
│   │   ├── fun/                # 5 fun commands
│   │   └── ai/                 # 1 AI chat command
│   ├── handlers/               # Message processing
│   ├── middlewares/            # Auth, rate limit, logging, error handling
│   ├── core/                   # Database, Redis, Logger
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Helper functions
│   └── locales/                # i18n translations
├── tests/                      # Jest test suites
├── package.json
├── tsconfig.json
└── Dockerfile
```

## Commands Reference

### Moderation (22)
`/ban` · `/unban` · `/kick` · `/mute` · `/unmute` · `/warn` · `/unwarn` · `/warns` · `/resetwarns` · `/setwarnlimit` · `/setwarnmode` · `/purge` · `/spurge` · `/purgefrom` · `/slowmode` · `/pin` · `/unpin` · `/unpinall` · `/pinned` · `/adminlist` · `/zombies` · `/report`

### Admin (11)
`/promote` · `/demote` · `/title` · `/setlog` · `/unsetlog` · `/setdesc` · `/setgtitle` · `/setgpic` · `/setsticker` · `/delsticker` · `/invitelink`

### Anti-Spam (17)
`/lock` · `/unlock` · `/locks` · `/locktypes` · `/setflood` · `/flood` · `/setfloodmode` · `/blacklist` · `/addblacklist` · `/unblacklist` · `/blacklistmode` · `/setcaptcha` · `/captchamode` · `/captchatext` · `/captchakick` · `/antiraid` · `/setantiraid`

### Greetings (10)
`/welcome` · `/setwelcome` · `/resetwelcome` · `/goodbye` · `/setgoodbye` · `/resetgoodbye` · `/cleanwelcome` · `/cleanservice` · `/welcomemute` · `/welcomemutehelp`

### Content (13)
`/save` · `/get` · `/clear` · `/clearall` · `/notes` · `/filter` · `/filters` · `/stop` · `/stopall` · `/rules` · `/setrules` · `/clearrules` · `/privaterules`

### Federation (15)
`/newfed` · `/delfed` · `/fedinfo` · `/joinfed` · `/leavefed` · `/fban` · `/unfban` · `/fednotif` · `/chatfed` · `/myfeds` · `/fedadmins` · `/fedpromote` · `/feddemote` · `/frename` · `/fedbanlist`

### Utility (11)
`/start` · `/help` · `/info` · `/id` · `/ping` · `/stats` · `/settings` · `/connect` · `/disconnect` · `/connection` · `/allowconnect`

### Fun (5)
`/roll` · `/slap` · `/pat` · `/hug` · `/runs`

## Middleware Pipeline

1. **Logging** — Request/response timing
2. **Authentication** — Admin permission checks
3. **Rate Limiting** — 30 messages/minute per user (Redis-backed)
4. **Error Handler** — Graceful error handling with logging

## Scripts

```bash
npm run dev          # Start with hot-reload (tsx watch)
npm run build        # Compile TypeScript
npm start            # Run compiled JS
npm test             # Run tests with coverage
npm run lint         # Lint source files
npm run format       # Format with Prettier
```

## Environment Variables

See `.env.example` for all available configuration options including:
- `BOT_TOKEN` — Telegram bot token from @BotFather
- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_URL` — Redis connection string

## License

MIT — see [LICENSE](../LICENSE)
