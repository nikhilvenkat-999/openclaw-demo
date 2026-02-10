# OpenClaw Demo Project

**A complete demonstration of OpenClaw AI Agent using FREE local LLM (Ollama)**

No API keys required! Everything runs locally for free.

--

## What This Demo Shows

| Demo | Description |
|------|-------------|
| **Pipeline Monitor** | AI monitors data pipelines, reports status via Discord |
| **SQL Query Agent** | Ask questions in English, get SQL results |
| **Report Generator** | Automated report generation |

---

## Prerequisites

- GitHub Codespaces (free tier works)
- Discord account (free)
- ~10 minutes setup time

---

## Quick Start

### Step 1: Open in GitHub Codespaces

1. Fork this repo to your GitHub account
2. Click **Code** → **Codespaces** → **Create codespace on main**
3. Wait for environment to load

### Step 2: Install Ollama (FREE Local LLM)

```bash
# In Codespace terminal
curl -fsSL https://ollama.com/install.sh | sh

# Start Ollama service
ollama serve &

# Pull a model (llama3.2 is small and fast)
ollama pull llama3.2
```

### Step 3: Create Discord Bot

See [docs/DISCORD_SETUP.md](docs/DISCORD_SETUP.md) for detailed steps.

Quick version:
1. Go to https://discord.com/developers/applications
2. Create New Application → Name it "OpenClaw-Demo"
3. Go to Bot → Add Bot → Copy Token
4. Enable "Message Content Intent"
5. Generate invite URL with bot permissions
6. Add bot to your server

### Step 4: Configure Environment

```bash
# Copy example config
cp .env.example .env

# Edit with your Discord token
nano .env
# Set: DISCORD_BOT_TOKEN=your_token_here
```

### Step 5: Install & Run

```bash
# Install dependencies
npm install

# Start OpenClaw with Ollama
npm run start
```

### Step 6: Test in Discord

Send message to your bot:
```
@OpenClaw-Demo Hello! What can you do?
```

---

## Project Structure

```
openclaw-demo/
├── README.md                 # This file
├── package.json              # Node.js dependencies
├── .env.example              # Environment template
├── config/
│   ├── openclaw.yaml         # Main configuration
│   └── ollama.yaml           # Ollama model settings
├── src/
│   ├── index.js              # Main entry point
│   ├── agent/
│   │   └── processor.js      # Message processing logic
│   └── skills/
│       ├── loader.js             # Skills loader
│       ├── pipeline-monitor.js   # Data pipeline monitoring
│       ├── sql-agent.js          # Natural language to SQL
│       └── report-generator.js   # Automated reports
├── docs/
│   ├── DISCORD_SETUP.md      # Discord bot setup guide
│   ├── OLLAMA_GUIDE.md       # Ollama installation guide
│   ├── WHAT_IS_OPENCLAW.md   # OpenClaw explanation
│   └── CEO_PRESENTATION.md   # Demo script for CEO
└── scripts/
    └── setup.sh              # Auto setup script
```

---

## Demo Commands

Once running, try these in Discord:

```
# Basic test
@bot Hello, are you working?

# Pipeline monitoring
@bot Check pipeline status
@bot Are there any failed pipelines?

# SQL queries
@bot How many customers do we have?
@bot Show sales from last week
@bot What's our top selling product?

# Reports
@bot Generate daily report
@bot Summarize today's operations
```

---

## Why Ollama? (Free Local LLM)

| Feature | Ollama | Cloud APIs |
|---------|--------|------------|
| **Cost** | FREE | Pay per token |
| **API Key** | Not needed | Required |
| **Privacy** | Data stays local | Sent to cloud |
| **Speed** | Depends on hardware | Fast |
| **Offline** | Works offline | Needs internet |

---

## Recommended Ollama Models

| Model | Size | Best For |
|-------|------|----------|
| `llama3.2` | 2GB | Quick demos, fast responses |
| `llama3.2:3b` | 3GB | Better quality, still fast |
| `mistral` | 4GB | Good balance |
| `codellama` | 4GB | Code-related tasks |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Ollama not starting | Run `ollama serve` manually |
| Bot not responding | Check Discord token, verify Message Content Intent |
| Slow responses | Use smaller model like `llama3.2` |
| Out of memory | Use `llama3.2` (smallest model) |

---

## Next Steps

After successful demo:
1. Connect real Azure Data Factory API
2. Add Slack/Teams channels
3. Deploy to cloud server
4. Create custom skills

---

## Resources

- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
- [Ollama](https://ollama.com/)
- [Discord Developer Portal](https://discord.com/developers)

---

## License

MIT License - Demo purposes
