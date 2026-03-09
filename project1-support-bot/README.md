# AI-Powered Discord + Telegram Support Bot

> A production-ready, dual-platform support bot that runs on both **Telegram** and **Discord**. Powered by **Claude AI (claude-sonnet-4-6)**, it answers user questions from a custom FAQ knowledge base, enforces per-user rate limiting, blocks prompt injection attacks, and automatically escalates unresolvable issues to a human moderator.

![Python](https://img.shields.io/badge/Python-3.12-blue) ![aiogram](https://img.shields.io/badge/aiogram-3.26.0-green) ![discord.py](https://img.shields.io/badge/discord.py-2.7.1-7289da) ![anthropic](https://img.shields.io/badge/anthropic-0.80.0-orange)

---

## What This Bot Does

When a user sends a message on either Telegram or Discord:

1. **Rate limit check** — If the user has sent more than 5 messages in the last 60 seconds, they receive a cooldown message with how many seconds remain.
2. **Input sanitization** — The message is scanned for 8 known prompt injection phrases (e.g. `ignore previous instructions`, `reveal your system prompt`). Detected attacks are silently blocked and replaced with a harmless fallback, logged as a warning.
3. **AI response** — The clean message + conversation history (last 10 turns) is sent to Claude AI with your FAQ as the system prompt. Claude answers only from the FAQ.
4. **Escalation** — If Claude cannot answer (returns `ESCALATE`) or an API error occurs, the bot notifies your human moderator and tells the user a human will follow up shortly.

---

## Features

| Feature | Details |
|---------|---------|
| Dual-platform | Telegram (aiogram 3.26) + Discord (discord.py 2.7) from one codebase |
| Claude AI answers | Uses `claude-sonnet-4-6` with your custom `faq_data.json` |
| Prompt injection guard | Detects 8 injection patterns; blocks before reaching AI |
| Per-user rate limiting | 5 messages / 60 seconds sliding window (in-memory) |
| Conversation history | Keeps last 10 turns per user for multi-turn support chats |
| Human escalation | Forwards unresolvable tickets to a moderator automatically |
| Singleton AI client | One `anthropic.Anthropic()` for the entire process — no reconnect overhead |
| Graceful shutdown | Handles `SIGTERM`/`SIGINT` cleanly; no dropped messages on restart |
| Structured logging | All events logged via `loguru` with level, timestamp, and context |

---

## How It Works

```
User Message (Telegram or Discord)
        │
        ▼
┌───────────────────────────┐
│  Rate Limiter             │  5 msg / 60s per user (sliding window)
│  rate_limiter.py          │  Returns: allowed or cooldown seconds
└──────────┬────────────────┘
           │ allowed
           ▼
┌───────────────────────────┐
│  Input Sanitizer          │  Scans for 8 injection phrases
│  ai_engine.sanitize_input │  Caps at 1,000 characters
└──────────┬────────────────┘
           │ clean text
           ▼
┌───────────────────────────┐
│  Claude AI                │  system = FAQ knowledge base + safety rules
│  claude-sonnet-4-6        │  messages = last 10 turns + current message
└──────────┬────────────────┘
           │
    ┌──────┴─────┐
    │ Has answer  │ Cannot answer / error
    ▼             ▼
Send reply    ESCALATE
              → Notify human moderator
              → Tell user "human will follow up"
```

### Rate Limiter (rate_limiter.py)

Uses a **sliding window** algorithm:
- Each user has a list of message timestamps stored in memory
- On each new message, timestamps older than 60 seconds are discarded
- If 5 or more timestamps remain → block and tell the user how long to wait
- Lightweight, no external dependencies, resets on restart

### AI Engine (ai_engine.py)

- **Singleton client**: `anthropic.Anthropic()` is created once at module load, shared across all users and all messages
- **System prompt**: Built dynamically from `faq_data.json` — Claude is instructed to answer ONLY from the FAQ, and to return exactly `ESCALATE` if it cannot answer
- **History trimming**: Only the last 10 conversation turns are sent — prevents token overflow on long conversations
- **Error handling**: `RateLimitError` → friendly retry message. `APIStatusError` → `ESCALATE`. All other exceptions → `ESCALATE`. Raw errors are never shown to users.

---

## File Structure

```
project1-support-bot/
├── main.py            Entry point — selects platform from CLI argument
├── config.py          Loads all env vars from .env file
├── ai_engine.py       Claude AI client, FAQ loader, sanitizer, response logic
├── rate_limiter.py    Per-user sliding-window rate limiter (in-memory)
├── telegram_bot.py    aiogram 3.x handlers: /start, /help, message handler
├── discord_bot.py     discord.py 2.x client + on_message handler
├── faq_data.json      Your FAQ knowledge base (JSON array, fully editable)
├── requirements.txt   All pinned dependencies
├── .env.example       Template — copy to .env and fill in credentials
├── .gitignore         Excludes .env, venv/, __pycache__/
└── .python-version    Pins Python 3.12 for pyenv / Railway
```

---

## Tech Stack

| Library | Version | Purpose |
|---------|---------|---------|
| aiogram | 3.26.0 | Async Telegram bot framework |
| discord.py | 2.7.1 | Async Discord bot framework |
| anthropic | 0.80.0 | Official Claude AI Python SDK |
| aiohttp | 3.11.0 | Async HTTP client (aiogram dependency) |
| python-dotenv | 1.0.1 | Load `.env` into `os.environ` |
| loguru | 0.7.2 | Structured logging with colors |

**AI Model:** `claude-sonnet-4-6`
**Python:** 3.12

---

## Installation

### Step 1 — Get credentials

| Credential | Where to get it |
|-----------|----------------|
| Telegram bot token | Message [@BotFather](https://t.me/BotFather) on Telegram → `/newbot` |
| Discord bot token | [discord.com/developers](https://discord.com/developers/applications) → New Application → Bot → Reset Token |
| Anthropic API key | [console.anthropic.com](https://console.anthropic.com) → API Keys |

> **Discord note:** In Developer Portal → Bot → enable **Message Content Intent** (required for reading messages).

### Step 2 — Install dependencies

```bash
cd project1-support-bot
pip install -r requirements.txt
```

### Step 3 — Configure

```bash
cp .env.example .env
```

Open `.env` and fill in:

```env
TELEGRAM_TOKEN=7123456789:AAHxxxxxxxxxxxxxxxxxxxxxxxxxxxx
DISCORD_TOKEN=MTIzNDU2Nzg5MDEyMzQ1Njc4.Gxxxxx.xxxxxxxxxxxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BOT_NAME=SupportBot
HUMAN_MODERATOR_CHAT_ID=123456789
```

### Step 4 — Add your FAQ

Edit `faq_data.json`:

```json
[
  {
    "q": "How do I withdraw funds?",
    "a": "Go to Wallet > Withdraw. Minimum is $10. Processing takes 1–3 business days."
  },
  {
    "q": "How do I complete KYC verification?",
    "a": "Go to Profile > KYC. Upload a government-issued ID. Review takes 2–3 business days."
  },
  {
    "q": "I forgot my password. How do I reset it?",
    "a": "Click 'Forgot Password' on the login page and follow the email instructions."
  }
]
```

The bot answers **only** from this file. Add as many Q&A pairs as needed. If a user asks something not covered, the bot escalates to your human moderator.

### Step 5 — Start

```bash
# Telegram bot
python main.py telegram

# Discord bot
python main.py discord
```

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `TELEGRAM_TOKEN` | Yes (Telegram) | — | Token from @BotFather |
| `DISCORD_TOKEN` | Yes (Discord) | — | Token from Discord Developer Portal |
| `ANTHROPIC_API_KEY` | Yes | — | Anthropic API key |
| `BOT_NAME` | No | `SupportBot` | Bot name shown in AI responses |
| `HUMAN_MODERATOR_CHAT_ID` | No | — | Telegram chat ID to receive escalations |

---

## Prompt Injection Protection

The following phrases in a user message trigger an automatic block:

```
ignore previous instructions
ignore all previous
forget your instructions
you are now
act as if
jailbreak
reveal your system prompt
what are your instructions
```

When triggered: the message is replaced with `"I have a general question about the platform."` before reaching Claude. The attempt is logged. The user never knows they were blocked.

---

## Deployment

### Railway (Recommended for bots — always-on)

1. Push your fork to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add all environment variables in the **Variables** tab
4. Railway auto-deploys on every push. Starts with `python main.py telegram` (set in `railway.json`)

**Cost:** Railway Hobby plan — $5/month. Required because bots must stay always-on to receive messages.

### VPS with PM2

```bash
pip install -r requirements.txt
pm2 start "python main.py telegram" --name tg-support-bot
pm2 start "python main.py discord" --name dc-support-bot
pm2 save && pm2 startup
```

### Docker

```bash
docker build -t support-bot .
docker run -d --env-file .env support-bot python main.py telegram
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `faq_data.json not found` | Run from inside `project1-support-bot/` directory |
| Bot doesn't read Discord messages | Enable **Message Content Intent** in Discord Developer Portal |
| Claude always escalates | Verify `ANTHROPIC_API_KEY` is correct and your FAQ covers the question |
| Telegram `Unauthorized` error | Token is invalid — regenerate with @BotFather `/revoke` then `/newbot` |
| `ModuleNotFoundError` | Run `pip install -r requirements.txt` again |

---

## Security

- `.env` is excluded by `.gitignore` — credentials never committed
- System prompt instructs Claude to never reveal its instructions
- All API errors return `ESCALATE` — raw error details never reach users
- Input capped at 1,000 characters before any processing
- Rate limiter prevents abuse and protects your Anthropic API budget
