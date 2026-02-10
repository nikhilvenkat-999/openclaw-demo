# Discord Bot Setup Guide

This guide walks you through creating a Discord bot for the OpenClaw demo.

**Time Required**: ~5 minutes
**Cost**: FREE

--

## Step 1: Create Discord Application

1. Go to **Discord Developer Portal**:
   ```
   https://discord.com/developers/applications
   ```

2. Click **"New Application"** (top right)

3. Enter name: `OpenClaw-Demo`

4. Click **"Create"**

---

## Step 2: Create Bot User

1. In left sidebar, click **"Bot"**

2. Click **"Add Bot"**

3. Click **"Yes, do it!"** to confirm

4. You now have a bot! You'll see:
   - Bot username
   - Bot avatar (optional to change)
   - Token section

---

## Step 3: Get Bot Token

1. Under **"Token"** section, click **"Reset Token"**

2. Click **"Yes, do it!"** to confirm

3. **COPY THE TOKEN** - you won't see it again!

4. Save it somewhere safe (you'll need it for .env file)

   Token looks like: `MTIzNDU2Nzg5MDEyMzQ1Njc4.GhZCCy.AbCdEf...`

> ⚠️ **NEVER share your token publicly!** It's like a password.

---

## Step 4: Enable Required Intents

Still on the **"Bot"** page, scroll down to **"Privileged Gateway Intents"**:

Enable these (toggle ON):
- ✅ **MESSAGE CONTENT INTENT** (Required!)
- ✅ **SERVER MEMBERS INTENT** (Optional but recommended)
- ✅ **PRESENCE INTENT** (Optional)

Click **"Save Changes"** at the bottom.

---

## Step 5: Generate Invite URL

1. In left sidebar, click **"OAuth2"** → **"URL Generator"**

2. Under **"Scopes"**, select:
   - ✅ `bot`
   - ✅ `applications.commands`

3. Under **"Bot Permissions"**, select:
   - ✅ Send Messages
   - ✅ Send Messages in Threads
   - ✅ Read Message History
   - ✅ Embed Links
   - ✅ Attach Files
   - ✅ Add Reactions
   - ✅ Use Slash Commands

4. Copy the **"Generated URL"** at the bottom

---

## Step 6: Add Bot to Your Server

1. Open the generated URL in your browser

2. Select your Discord server from dropdown

3. Click **"Authorize"**

4. Complete the CAPTCHA if prompted

5. Bot is now in your server! (It will appear offline until you run the code)

---

## Step 7: Configure Your Project

1. Copy the .env.example file:
   ```bash
   cp .env.example .env
   ```

2. Edit .env and add your token:
   ```
   DISCORD_BOT_TOKEN=your_token_here
   ```

3. Save the file

---

## Step 8: Test the Bot

1. Start the bot:
   ```bash
   npm run start
   ```

2. In Discord, send a message:
   ```
   @OpenClaw-Demo Hello!
   ```

3. The bot should respond!

---

## Troubleshooting

### Bot not responding?

1. **Check token**: Make sure token in .env is correct
2. **Check intents**: MESSAGE CONTENT INTENT must be enabled
3. **Check permissions**: Bot needs "Read Messages" and "Send Messages"
4. **Check logs**: Look at terminal output for errors

### "Used disallowed intents" error?

You need to enable MESSAGE CONTENT INTENT in Discord Developer Portal:
- Go to your application → Bot → Privileged Gateway Intents
- Enable "MESSAGE CONTENT INTENT"
- Save changes

### Bot is offline?

- Make sure `npm run start` is running
- Check for errors in terminal
- Verify token is correct

---

## Security Tips

1. **Never commit .env file** - it's in .gitignore
2. **Regenerate token if exposed** - Discord Developer Portal → Bot → Reset Token
3. **Use minimal permissions** - only enable what you need

---

## Next Steps

Once bot is working:
1. Test basic commands
2. Try pipeline monitoring
3. Run SQL queries
4. Generate reports

See [CEO_PRESENTATION.md](CEO_PRESENTATION.md) for demo script.
