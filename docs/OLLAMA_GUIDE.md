# Ollama Setup Guide:

Ollama lets you run AI models locally - completely FREE, no API keys needed!

---

## What is Ollama?

Ollama is a tool that runs large language models (LLMs) on your own machine:
- **FREE** - No API costs
- **Private** - Data never leaves your machine
- **Offline** - Works without internet (after initial download)
- **Fast** - Direct local execution

---

## Installation

### In GitHub Codespaces (Recommended)

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Start Ollama service in background
ollama serve &

# Wait a few seconds for it to start
sleep 5

# Pull a model (llama3.2 is small and fast)
ollama pull llama3.2
```

### On macOS

```bash
# Using Homebrew
brew install ollama

# Or download from ollama.com
```

### On Linux

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### On Windows

Download from: https://ollama.com/download/windows

---

## Available Models

| Model | Size | Speed | Quality | Best For |
|-------|------|-------|---------|----------|
| `llama3.2` | 2GB | ⚡⚡⚡ | ⭐⭐⭐ | Quick demos |
| `llama3.2:3b` | 3GB | ⚡⚡ | ⭐⭐⭐⭐ | Better quality |
| `mistral` | 4GB | ⚡⚡ | ⭐⭐⭐⭐ | Good balance |
| `phi3` | 2GB | ⚡⚡⚡ | ⭐⭐⭐ | Microsoft's model |
| `codellama` | 4GB | ⚡⚡ | ⭐⭐⭐⭐ | Code tasks |
| `llama3.1:8b` | 5GB | ⚡ | ⭐⭐⭐⭐⭐ | High quality |

### Pull a Model

```bash
# Pull default model for demo
ollama pull llama3.2

# Pull other models
ollama pull mistral
ollama pull codellama
```

---

## Basic Usage

### Start Ollama Server

```bash
# Start in foreground
ollama serve

# Start in background
ollama serve &
```

### Test with CLI

```bash
# Simple test
ollama run llama3.2 "Hello, how are you?"

# Interactive chat
ollama run llama3.2
```

### Check Available Models

```bash
ollama list
```

### Check Running Status

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags
```

---

## Codespace-Specific Setup

GitHub Codespaces have limited resources. Use these settings:

```bash
# Use smaller model
ollama pull llama3.2  # 2GB, fast

# Don't use large models in Codespaces
# ollama pull llama3.1:70b  # TOO BIG - will fail
```

### Memory Tips

- Close unused browser tabs
- Use `llama3.2` (smallest)
- If slow, restart Codespace

---

## Configuration

### Environment Variables

```bash
# Set in .env file
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

### Custom Model Path

```bash
# Store models in specific location
export OLLAMA_MODELS=/path/to/models
```

---

## Troubleshooting

### "Connection refused" Error

Ollama server isn't running:
```bash
# Start Ollama
ollama serve &

# Wait and retry
sleep 5
```

### "Model not found" Error

Need to pull the model first:
```bash
ollama pull llama3.2
```

### Slow Responses

- Use smaller model (`llama3.2`)
- Close other applications
- Check available memory: `free -h`

### Out of Memory

```bash
# Use smallest model
ollama pull llama3.2

# Remove unused models
ollama rm mistral
```

---

## API Reference

### Chat Endpoint

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "llama3.2",
  "messages": [
    {"role": "user", "content": "Hello!"}
  ]
}'
```

### Generate Endpoint

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "Why is the sky blue?"
}'
```

### List Models

```bash
curl http://localhost:11434/api/tags
```

---

## Why Ollama for This Demo?

| Feature | Ollama | Cloud APIs |
|---------|--------|------------|
| Cost | **FREE** | $5-50/month |
| API Key | **Not needed** | Required |
| Setup | Simple | Account + billing |
| Privacy | **Local** | Sent to cloud |
| Offline | **Works** | Needs internet |

---

## Next Steps

1. Install Ollama
2. Pull `llama3.2` model
3. Start the server
4. Run the demo!

See [README.md](../README.md) for full setup instructions.
