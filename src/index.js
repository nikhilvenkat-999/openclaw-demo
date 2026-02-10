/**
 * OpenClaw Demo - Main Entry Point
 *
 * This demo shows how OpenClaw works with:
 * - Ollama (FREE local LLM - no API keys needed)
 * - Discord as the messaging channel
 * - Custom skills for data engineering tasks
 */

import 'dotenv/config';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { Ollama } from 'ollama';
import { loadSkills } from './skills/loader.js';
import { processMessage } from './agent/processor.js';

// Configuration
const config = {
  discord: {
    token: process.env.DISCORD_BOT_TOKEN,
  },
  ollama: {
    host: process.env.OLLAMA_HOST || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'llama3.2',
  },
  prefix: process.env.BOT_PREFIX || '!claw',
};

// Initialize Ollama client
const ollama = new Ollama({ host: config.ollama.host });

// Initialize Discord client
const discord = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

// Store conversation history per channel
const conversationHistory = new Map();

// Skills registry
let skills = {};

/**
 * Main message handler
 */
async function handleMessage(message) {
  // Ignore bot messages
  if (message.author.bot) return;

  // Check if message is for us (mention or prefix)
  const isMention = message.mentions.has(discord.user);
  const hasPrefix = message.content.startsWith(config.prefix);

  if (!isMention && !hasPrefix) return;

  // Extract the actual message content
  let content = message.content;
  if (isMention) {
    content = content.replace(/<@!?\d+>/g, '').trim();
  } else if (hasPrefix) {
    content = content.slice(config.prefix.length).trim();
  }

  if (!content) {
    await message.reply("Hello! How can I help you? Try asking me to check pipelines, query data, or generate a report.");
    return;
  }

  // Show typing indicator
  await message.channel.sendTyping();

  try {
    // Get or create conversation history
    const channelId = message.channel.id;
    if (!conversationHistory.has(channelId)) {
      conversationHistory.set(channelId, []);
    }
    const history = conversationHistory.get(channelId);

    // Process the message with our agent
    const response = await processMessage({
      content,
      history,
      skills,
      ollama,
      model: config.ollama.model,
      userId: message.author.id,
      userName: message.author.username,
    });

    // Update history
    history.push({ role: 'user', content });
    history.push({ role: 'assistant', content: response });

    // Keep history manageable (last 10 exchanges)
    if (history.length > 20) {
      history.splice(0, 2);
    }

    // Send response (split if too long)
    if (response.length > 2000) {
      const chunks = response.match(/[\s\S]{1,1990}/g) || [];
      for (const chunk of chunks) {
        await message.reply(chunk);
      }
    } else {
      await message.reply(response);
    }

  } catch (error) {
    console.error('Error processing message:', error);
    await message.reply(`Sorry, I encountered an error: ${error.message}`);
  }
}

/**
 * Startup sequence
 */
async function start() {
  console.log('🦞 OpenClaw Demo Starting...\n');

  // Check Discord token
  if (!config.discord.token) {
    console.error('❌ DISCORD_BOT_TOKEN not set!');
    console.error('   Copy .env.example to .env and add your token');
    process.exit(1);
  }

  // Test Ollama connection
  console.log('📡 Connecting to Ollama...');
  try {
    const models = await ollama.list();
    console.log(`✅ Ollama connected. Available models:`);
    models.models.forEach(m => console.log(`   - ${m.name}`));

    // Check if our model is available
    const hasModel = models.models.some(m => m.name.startsWith(config.ollama.model));
    if (!hasModel) {
      console.log(`\n⚠️  Model '${config.ollama.model}' not found.`);
      console.log(`   Run: ollama pull ${config.ollama.model}`);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Cannot connect to Ollama!');
    console.error('   Make sure Ollama is running: ollama serve');
    process.exit(1);
  }

  // Load skills
  console.log('\n📦 Loading skills...');
  skills = await loadSkills();
  console.log(`✅ Loaded ${Object.keys(skills).length} skills:`);
  Object.keys(skills).forEach(s => console.log(`   - ${s}`));

  // Connect to Discord
  console.log('\n🎮 Connecting to Discord...');

  discord.once('ready', () => {
    console.log(`✅ Discord connected as: ${discord.user.tag}`);
    console.log(`\n${'='.repeat(50)}`);
    console.log('🚀 OpenClaw Demo is ready!');
    console.log(`${'='.repeat(50)}`);
    console.log(`\nMention me or use ${config.prefix} to chat`);
    console.log('Example: @OpenClaw check pipeline status\n');
  });

  discord.on('messageCreate', handleMessage);

  await discord.login(config.discord.token);
}

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

// Start the bot
start().catch(console.error);
