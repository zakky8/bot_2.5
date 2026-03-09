# Crypto Sentiment Tracker

> A live, interactive dashboard that tracks **public sentiment** toward cryptocurrencies by scraping Reddit posts in real time and correlating with **live price data** from CoinGecko. Built with Streamlit, PRAW, VADER, TextBlob, and Plotly.

![Python](https://img.shields.io/badge/Python-3.12-blue) ![Streamlit](https://img.shields.io/badge/Streamlit-1.55.0-red) ![PRAW](https://img.shields.io/badge/PRAW-7.7.1-orange) ![Plotly](https://img.shields.io/badge/Plotly-5.24.1-purple)

---

## What This Does

The dashboard performs four things every time it loads:

1. **Scrapes Reddit** — fetches the newest posts from 6 major crypto subreddits using the PRAW API, filtered to posts mentioning the coins you selected
2. **Analyzes sentiment** — runs each post through VADER for a compound score. For near-neutral posts (-0.1 to +0.1), TextBlob is used as a weighted tiebreaker
3. **Fetches live prices** — queries CoinGecko free API for current USD price and 24-hour percentage change
4. **Visualizes everything** — renders a sentiment pie chart, hourly trend line, live price metrics, and a sortable post table

All data is cached for 1 hour so the dashboard refreshes without hitting Reddit or CoinGecko rate limits.

---

## Features

| Feature | Details |
|---------|---------|
| Live Reddit scraping | 6 subreddits, up to 100 posts each, sorted by newest |
| VADER sentiment | Primary analyzer — fast, offline, handles crypto slang well |
| TextBlob tiebreaker | Only runs for near-neutral VADER scores (~10% of all posts) |
| CoinGecko live prices | USD price + 24h change for up to 5 coins simultaneously |
| 429 retry logic | Rate limit triggers exponential backoff: 60s → 120s → 180s |
| 1-hour Streamlit cache | `@st.cache_data(ttl=3600)` prevents duplicate API calls |
| Per-subreddit isolation | One failed subreddit never stops the rest |
| Coin selector sidebar | Multiselect: BTC, ETH, ADA, SOL, BNB |
| Post limit slider | 10 to 100 posts per subreddit |
| Force refresh button | Clears cache for immediate fresh data |
| Sentiment pie chart | Positive / Neutral / Negative with percentages (Plotly) |
| Hourly trend line | Average sentiment per hour with threshold reference lines |
| Post table | Source, title, label, score, upvotes for top 25 posts |

---

## How It Works

```
User selects coins + post limit in sidebar
        |
        v
+-----------------------------------------------+
|  Reddit Scraper (PRAW 7.7.1)                  |
|  reddit_scraper.fetch_posts()                 |
|  - Fetch newest posts from 6 subreddits       |
|  - Filter: post title contains coin keyword   |
|  - Per-subreddit try/except isolation         |
+-----------------------------------------------+
        |  DataFrame: title, text, upvotes, source, created_at
        v
+-----------------------------------------------+
|  Sentiment Analyzer                           |
|  sentiment_analyzer.analyze_dataframe()       |
|  - VADER compound score per post              |
|  - If -0.1 < score < 0.1:                    |
|      combined = VADER*0.6 + TextBlob*0.4     |
|  - Label: positive / neutral / negative       |
+-----------------------------------------------+
        |  df + sentiment_score + sentiment_label
        v
+-----------------------------------------------+
|  Price Fetcher (CoinGecko free API)           |
|  price_fetcher.get_prices()                   |
|  - GET /simple/price for selected coins       |
|  - Retry on HTTP 429 with exponential backoff |
+-----------------------------------------------+
        |  prices dict: {coin_id: {usd, usd_24h_change}}
        v
+-----------------------------------------------+
|  Streamlit Dashboard (dashboard.py)           |
|  - Price metric row (one card per coin)       |
|  - Sentiment pie chart (Plotly)               |
|  - Hourly sentiment trend line (Plotly)       |
|  - Recent posts table (top 25)                |
+-----------------------------------------------+
```

### Sentiment Scoring Explained

VADER outputs a compound score from -1.0 (most negative) to +1.0 (most positive):

| Score range | Label | Meaning |
|-------------|-------|---------|
| >= 0.05 | positive | Bullish community sentiment |
| -0.05 to 0.05 | neutral | Mixed or factual content |
| <= -0.05 | negative | Bearish or fearful sentiment |

TextBlob only activates when VADER returns a score in the ambiguous zone (-0.1 to +0.1). The combined score formula:

```
combined = (VADER_compound * 0.6) + (TextBlob_polarity * 0.4)
```

**Why this hybrid approach?**

- VADER is optimized for social media and understands crypto slang: "moon", "rekt", "ape in", "hodl", "to the moon"
- TextBlob handles formal, analytical language better: "bearish outlook", "market correction expected"
- Combining them where VADER is uncertain gives better accuracy at nearly zero extra compute cost — TextBlob is skipped for ~90% of posts that are clearly positive or negative

---

## File Structure

```
project5-sentiment-tracker/
├── dashboard.py          Main Streamlit app — layout, caching, charts
├── reddit_scraper.py     PRAW client + fetch_posts() with per-subreddit isolation
├── sentiment_analyzer.py VADER primary + TextBlob tiebreaker; analyze_dataframe()
├── price_fetcher.py      CoinGecko API wrapper with 429 retry and backoff
├── config.py             Subreddit list, coin ID map, environment var loader
├── setup.py              One-time NLTK punkt_tab download
├── requirements.txt      All pinned dependencies
├── .env.example          Reddit API credentials template
├── .gitignore            Excludes .env and venv/
└── .python-version       Pins Python 3.12
```

---

## Tech Stack

| Library | Version | Purpose |
|---------|---------|---------|
| praw | 7.7.1 | Reddit API — Python Reddit API Wrapper |
| vaderSentiment | 3.3.2 | Primary sentiment scoring |
| textblob | 0.18.0 | Secondary sentiment (near-neutral tiebreaker) |
| streamlit | 1.55.0 | Interactive web dashboard |
| plotly | 5.24.1 | Pie chart and time series visualization |
| pandas | 2.2.3 | DataFrame operations and hourly grouping |
| requests | 2.32.3 | CoinGecko HTTP requests |
| python-dotenv | 1.0.1 | Load .env credentials |
| nltk | 3.9.1 | Text tokenization (TextBlob dependency) |
| loguru | 0.7.2 | Structured logging |

**Python:** 3.12

---

## Installation

### Step 1 — Create a Reddit API application

1. Log in to [reddit.com](https://reddit.com)
2. Go to [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps)
3. Click **create another app**
4. Fill in:
   - **Name:** CryptoSentimentTracker
   - **Type:** script
   - **Redirect URI:** `http://localhost:8080`
5. Click **Create app**
6. Copy the `client_id` (displayed below the app name) and `client_secret`

### Step 2 — Install dependencies

```bash
cd project5-sentiment-tracker
pip install -r requirements.txt
```

### Step 3 — Download NLTK data (once)

```bash
python setup.py
```

Downloads `punkt_tab` and `stopwords`. NLTK 3.9+ requires `punkt_tab` — tutorials that use `nltk.download("punkt")` will cause a `LookupError` with this version.

### Step 4 — Configure credentials

```bash
cp .env.example .env
```

Edit `.env`:

```env
REDDIT_CLIENT_ID=your_client_id_here
REDDIT_CLIENT_SECRET=your_client_secret_here
REDDIT_USER_AGENT=CryptoSentimentTracker/1.0
```

CoinGecko free API requires no key or account registration.

### Step 5 — Launch

```bash
streamlit run dashboard.py
```

Opens at `http://localhost:8501`

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REDDIT_CLIENT_ID` | Yes | — | App client ID from reddit.com/prefs/apps |
| `REDDIT_CLIENT_SECRET` | Yes | — | App client secret |
| `REDDIT_USER_AGENT` | No | `CryptoSentimentTracker/1.0` | Identifies your app to Reddit's servers |

---

## Tracked Subreddits

| Subreddit | Community focus |
|-----------|----------------|
| r/CryptoCurrency | General crypto news and discussion |
| r/bitcoin | Bitcoin-specific posts |
| r/ethereum | Ethereum-specific posts |
| r/CryptoMarkets | Price action and trading |
| r/defi | Decentralized finance |
| r/altcoin | Alternative cryptocurrencies |

To add more subreddits, edit `CRYPTO_SUBREDDITS` in `config.py`.

---

## Tracked Coins

| Symbol | CoinGecko ID |
|--------|-------------|
| BTC | bitcoin |
| ETH | ethereum |
| ADA | cardano |
| SOL | solana |
| BNB | binancecoin |

To add more coins, add entries to `COIN_IDS` in `config.py`. Find CoinGecko IDs at `api.coingecko.com/api/v3/coins/list`.

---

## API Rate Limits

| API | Free limit | How we handle it |
|-----|-----------|-----------------|
| Reddit (PRAW) | 100 requests/minute | 1 request per subreddit per session; 1-hour cache |
| CoinGecko | 30 requests/minute | 1-hour cache + 3 retries with 60/120/180s backoff on 429 |

The **Force Refresh** button in the sidebar clears the cache and triggers fresh API calls. Use sparingly to avoid rate limits.

---

## Deployment — Streamlit Cloud (Free)

1. Push your fork to GitHub (`.env` is gitignored — never commit it)
2. Go to [share.streamlit.io](https://share.streamlit.io)
3. Click **New app** → connect your GitHub repo
4. Set main file to: `project5-sentiment-tracker/dashboard.py`
5. In **App settings → Secrets**, add:

```toml
REDDIT_CLIENT_ID = "your_client_id"
REDDIT_CLIENT_SECRET = "your_client_secret"
REDDIT_USER_AGENT = "CryptoSentimentTracker/1.0"
```

6. Deploy — free for all public repos

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `prawcore 401 Unauthorized` | Reddit credentials are wrong — re-check client_id and client_secret |
| No posts found for any coin | Coin keyword may not appear in recent titles — try BTC or ETH |
| CoinGecko prices show N/A | Rate limited — wait 60 seconds then click Force Refresh |
| `LookupError: punkt_tab not found` | Run `python setup.py` to download NLTK 3.9+ data |
| Dashboard slow on first load | First run fetches all posts and runs sentiment analysis — normal |
| All sentiment shows neutral | VADER may not recognize posts in non-English or highly abbreviated language |

---

## Security

- Reddit credentials stored in `.env` only — never committed to git
- No user data collected — all data is public Reddit posts
- CoinGecko free tier requires no auth — no credentials exposed
- Streamlit Cloud secrets are encrypted at rest and injected as environment variables at runtime
