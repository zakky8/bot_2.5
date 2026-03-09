# AI Support Ticket Classifier

> Automatically classifies incoming customer support tickets into **8 categories** and assigns a **priority level** using machine learning. Built with sentence-transformers for semantic understanding and scikit-learn for classification. Features an interactive **Streamlit dashboard** for real-time ticket analysis with suggested responses.

![Python](https://img.shields.io/badge/Python-3.12-blue) ![Streamlit](https://img.shields.io/badge/Streamlit-1.55.0-red) ![scikit-learn](https://img.shields.io/badge/scikit--learn-1.8.0-orange) ![sentence-transformers](https://img.shields.io/badge/sentence--transformers-5.2.3-green)

---

## What This Does

A support agent or automated pipeline pastes a ticket into the dashboard. The classifier:

1. **Encodes the ticket** into a 384-dimensional semantic vector using `multi-qa-MiniLM-L6-cos-v1` — a sentence-transformer fine-tuned for question-answering similarity tasks
2. **Classifies the vector** using a RandomForestClassifier into one of 8 support categories
3. **Scores priority** by scanning the original ticket for urgency keywords
4. **Shows confidence** — results below 55% trigger a human-review warning
5. **Suggests a response** — pre-written reply template specific to the predicted category

All inference runs locally after model training. Zero external API calls at classification time.

---

## Ticket Categories

| Category | Description | Example |
|----------|-------------|---------|
| `account_access` | Login failures, locked accounts, password resets | "I cannot log in — my account shows locked" |
| `withdrawal_issue` | Failed withdrawals, stuck transfers, balance errors | "My $500 withdrawal has been pending for 3 days" |
| `deposit_issue` | Missing deposits, wrong amount credited | "I sent 0.1 ETH two hours ago but it never arrived" |
| `kyc_verification` | KYC rejections, document resubmission | "My government ID was rejected but it is valid" |
| `trading_problem` | Order errors, chart issues, execution failures | "My limit order did not fill at the correct price" |
| `wallet_connection` | MetaMask / Web3 connection failures | "MetaMask keeps disconnecting when I try to trade" |
| `scam_report` | Fraud, phishing, stolen funds | "Someone posing as support took my ETH" |
| `general_inquiry` | Everything else | "What are your trading fees?" |

---

## Priority Scoring

After classification, priority is assigned by scanning the original ticket text for keywords:

| Priority | Trigger keywords | Expected response |
|----------|-----------------|-------------------|
| `urgent` | stolen, hacked, fraud, lost funds, unauthorized, scam | Immediately |
| `high` | cannot withdraw, account locked, cannot login, funds missing | Within 4 hours |
| `medium` | Classifier confidence below 55% | Within 8 hours |
| `low` | All other tickets | Within 24 hours |

---

## How It Works

```
Ticket text (raw string)
        |
        v
+------------------------------------------+
|  SentenceTransformer Encoder             |
|  multi-qa-MiniLM-L6-cos-v1              |
|  encode(ticket, convert_to_numpy=True)   |
|  Output: 384-dimensional float32 vector  |
+------------------------------------------+
        |
        v
+------------------------------------------+
|  RandomForestClassifier (200 trees)      |
|  clf.predict(embedding)     -> category  |
|  clf.predict_proba(embedding) -> float   |
|  class_weight=balanced (no bias)         |
+------------------------------------------+
        |
        v
+------------------------------------------+
|  Priority Scorer                         |
|  Keyword scan on original ticket text    |
|  urgent > high > medium > low            |
+------------------------------------------+
        |
        v
+------------------------------------------+
|  Streamlit Dashboard (app.py)            |
|  Category + confidence % + priority      |
|  Suggested response template             |
+------------------------------------------+
```

### Model Details

| Property | Value |
|----------|-------|
| Encoder | `multi-qa-MiniLM-L6-cos-v1` |
| Encoder size | 22 million parameters |
| Embedding dimension | 384 |
| Classifier | RandomForestClassifier |
| Trees | 200 (`n_estimators=200`) |
| Class weighting | `class_weight="balanced"` |
| Training split | 80% train / 20% test (stratified) |
| Inference speed | 10–50ms per ticket |
| Saved model size | ~5 MB |

---

## File Structure

```
project4-ticket-classifier/
├── app.py                   Streamlit dashboard — UI, examples, result display
├── classifier.py            Inference logic — loads models, classify_ticket()
├── train_model.py           Training script — encode, fit, evaluate, save
├── setup.py                 One-time NLTK data download (punkt_tab, stopwords)
├── data/
│   └── sample_tickets.csv   Labeled training data (500+ tickets, 8 categories)
├── models/                  Auto-created by train_model.py (gitignored)
│   ├── ticket_classifier.pkl    Trained RandomForest
│   └── sentence_encoder.pkl     Cached SentenceTransformer
├── requirements.txt         Pinned dependencies
├── .gitignore               Excludes models/ and .env
└── .python-version          Pins Python 3.12
```

> `models/` is excluded from git. Run `python train_model.py` after cloning to generate it locally.

---

## Tech Stack

| Library | Version | Purpose |
|---------|---------|---------|
| sentence-transformers | 5.2.3 | Semantic ticket encoding |
| scikit-learn | 1.8.0 | RandomForestClassifier |
| torch | 2.5.1 | sentence-transformers backend |
| pandas | 2.2.3 | CSV loading and data preparation |
| numpy | 2.0.0 | Embedding array operations |
| streamlit | 1.55.0 | Interactive web dashboard |
| joblib | 1.4.2 | Save and load trained models |
| nltk | 3.9.1 | Text tokenization utilities |
| loguru | 0.7.2 | Training progress and error logging |

**Python:** 3.12 (minimum 3.10 — scikit-learn 1.7+ requirement)

---

## Installation

### Step 1 — Install dependencies

```bash
cd project4-ticket-classifier
pip install -r requirements.txt
```

> First install downloads PyTorch (~800 MB) and the sentence-transformer model (~90 MB). Subsequent runs use the local cache.

### Step 2 — Download NLTK data (once)

```bash
python setup.py
```

Downloads `punkt_tab` and `stopwords`. NLTK 3.9+ uses `punkt_tab` — older tutorials that say `punkt` will cause errors with this version.

### Step 3 — Train the model (once)

```bash
python train_model.py
```

Sample output:

```
INFO     Loaded 520 valid tickets
INFO     Category counts:
         general_inquiry     98
         account_access      78
         withdrawal_issue    72
         ...
INFO     Loading encoder model (cached after first download)...
INFO     Encoding 520 tickets...
100%|════════════════| 520/520 [00:08]
INFO     Model evaluation:
                      precision  recall  f1-score
  account_access          0.89    0.91      0.90
  withdrawal_issue        0.92    0.88      0.90
  scam_report             0.94    0.89      0.91
SUCCESS  Models saved. Run: streamlit run app.py
```

### Step 4 — Launch the dashboard

```bash
streamlit run app.py
```

Opens at `http://localhost:8501`

---

## Using the Dashboard

1. **Load an example** — expand the dropdown, pick a sample ticket, click "Use this example"
2. **Or paste your own** — type any support ticket text into the input area
3. **Click Classify** — results appear in the right panel instantly
4. **Review the output:**
   - **Category** — predicted ticket type (e.g. `withdrawal_issue`)
   - **Confidence** — how certain the model is (above 80% = reliable; below 55% = human review recommended)
   - **Priority** — color-coded urgency level with icon
   - **Suggested Response** — pre-written reply template for the predicted category

### Built-in Example Tickets

| Example | Expected result |
|---------|----------------|
| "I cannot withdraw my funds — shows insufficient balance" | `withdrawal_issue` / high |
| "Someone claiming to be from support DMed me and stole my ETH" | `scam_report` / urgent |
| "My KYC was rejected but my documents are valid" | `kyc_verification` / medium |
| "How do I change the email on my account?" | `account_access` / low |
| "MetaMask keeps timing out when I try to connect" | `wallet_connection` / low |

---

## Training on Your Own Data

Replace `data/sample_tickets.csv` with your own labeled data. Required columns:

| Column | Type | Example |
|--------|------|---------|
| `description` | string | "I cannot withdraw, shows insufficient balance" |
| `category` | string | `withdrawal_issue` |

Category strings must exactly match the 8 keys defined in `classifier.py`'s `RESPONSES` dict, or edit that dict to define your own categories.

After updating the CSV:

```bash
python train_model.py   # retrain with new data
streamlit run app.py    # restart dashboard
```

---

## Deployment — Streamlit Cloud (Free)

1. Push your fork to GitHub (`models/` is gitignored — Streamlit Cloud will retrain)
2. Go to [share.streamlit.io](https://share.streamlit.io) and sign in with GitHub
3. Click **New app** → select your repository
4. Set main file to: `app.py` (or `project4-ticket-classifier/app.py` from the super-bot repo)
5. Click **Deploy** — free for all public repositories

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `Models not found. Run python train_model.py first.` | Run `python train_model.py` before launching the app |
| NLTK `punkt` not found | Run `python setup.py` — downloads `punkt_tab` for NLTK 3.9+ |
| Slow first training | Normal — PyTorch + encoder model = ~900 MB download on first run |
| All tickets classified as `general_inquiry` | Each category needs at least 20 examples in the training CSV |
| `convert_to_numpy` TypeError | Ensure `sentence-transformers==5.2.3` is installed (API changed in v5.x) |
| Low accuracy on your data | Add more examples — aim for 50+ per category |

---

## Security

- All processing is fully local — no ticket text sent to any external service
- `models/` excluded from git — no large binary files committed
- Confidence threshold prevents over-confident misclassifications from bypassing human review
