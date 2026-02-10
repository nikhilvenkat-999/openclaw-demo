#!/bin/bash

# OpenClaw Demo - Setup Script

echo "🦞 OpenClaw Demo Setup"
echo "======================"
echo ""

# Check Node.js version
echo "📦 Checking Node.js..."
NODE_VERSION=$(node --version 2>/dev/null | cut -d'v' -f2 | cut -d'.' -f1)
if [ -z "$NODE_VERSION" ]; then
    echo "❌ Node.js not found!"
    echo "   Please install Node.js 22+"
    exit 1
elif [ "$NODE_VERSION" -lt 22 ]; then
    echo "⚠️  Node.js version $NODE_VERSION found, need 22+"
    echo "   Attempting to use nvm..."
    if command -v nvm &> /dev/null; then
        nvm install 22
        nvm use 22
    else
        echo "❌ Please install Node.js 22+"
        exit 1
    fi
else
    echo "✅ Node.js v$NODE_VERSION found"
fi

# Install Ollama (open source LLM server)
echo ""
echo "📦 Installing Ollama..."
if command -v ollama &> /dev/null; then
    echo "✅ Ollama already installed"
else
    echo "   Downloading Ollama..."
    curl -fsSL https://ollama.com/install.sh | sh
    echo "✅ Ollama installed"
fi

# Start Ollama
echo ""
echo "🚀 Starting Ollama service..."
pkill ollama 2>/dev/null  # Kill any existing instance
ollama serve &
sleep 3

# Pull model
echo ""
echo "📥 Pulling AI model (llama3.2)..."
echo "   This may take a few minutes on first run..."
ollama pull llama3.2

# Install npm dependencies
echo ""
echo "📦 Installing Node.js dependencies..."
npm install

# Check for .env file
echo ""
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Edit .env file and add your Discord bot token!"
    echo "   Open .env and replace 'your_discord_bot_token_here' with your actual token"
    echo ""
    echo "   To get a Discord bot token, see: docs/DISCORD_SETUP.md"
else
    echo "✅ .env file exists"
fi

# Summary
echo ""
echo "=================================="
echo "🎉 Setup Complete!"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Edit .env file and add your DISCORD_BOT_TOKEN"
echo "2. Create a Discord bot (see docs/DISCORD_SETUP.md)"
echo "3. Run: npm run start"
echo ""
echo "For demo script, see: docs/CEO_PRESENTATION.md"
echo ""
