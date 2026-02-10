/**
 * Message Processor - The "brain" of OpenClaw Demo
 *
 * This determines what to do with user messages:
 * 1. Detect intent (which skill need to use)
 * 2. Execute the appropriate skill
 * 3. Format and return the response
 */

// System prompt for the AI
const SYSTEM_PROMPT = `You are OpenClaw, a helpful AI assistant for data engineering tasks.

You can help with:
1. PIPELINE MONITORING - Check status of data pipelines, report failures, suggest fixes
2. SQL QUERIES - Convert natural language questions to SQL and explain results
3. REPORT GENERATION - Create summaries and reports from data

Always be concise and format responses clearly using markdown.
When showing data, use tables or bullet points.
If you don't know something, say so honestly.`;

/**
 * Detect which skill should handle this message
 */
function detectIntent(content) {
  const lowerContent = content.toLowerCase();

  // Pipeline monitoring keywords
  const pipelineKeywords = ['pipeline', 'etl', 'job', 'data factory', 'airflow', 'failed', 'running', 'status'];
  if (pipelineKeywords.some(kw => lowerContent.includes(kw))) {
    return 'pipeline-monitor';
  }

  // SQL/Query keywords
  const sqlKeywords = ['how many', 'count', 'show me', 'query', 'select', 'customers', 'orders', 'sales', 'data'];
  if (sqlKeywords.some(kw => lowerContent.includes(kw))) {
    return 'sql-agent';
  }

  // Report keywords
  const reportKeywords = ['report', 'summary', 'summarize', 'daily', 'weekly', 'generate report'];
  if (reportKeywords.some(kw => lowerContent.includes(kw))) {
    return 'report-generator';
  }

  // Default to general conversation
  return 'general';
}

/**
 * Process a message and generate a response
 */
export async function processMessage({ content, history, skills, ollama, model, userId, userName }) {
  // Detect intent
  const intent = detectIntent(content);
  console.log(`[Agent] Intent detected: ${intent}`);

  // Build context from conversation history
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.slice(-10), // Last 5 exchanges
    { role: 'user', content },
  ];

  // If we have a matching skill, get additional context
  let skillContext = '';
  if (skills[intent]) {
    try {
      const skillResult = await skills[intent].execute(content);
      skillContext = `\n\n[Skill Data - ${intent}]:\n${skillResult}`;
      messages[0].content += skillContext;
    } catch (error) {
      console.error(`[Agent] Skill ${intent} error:`, error.message);
    }
  }

  // Call Ollama
  try {
    console.log(`[Agent] Calling Ollama with model: ${model}`);
    const response = await ollama.chat({
      model,
      messages,
      options: {
        temperature: 0.7,
        num_predict: 1024,
      },
    });

    return response.message.content;
  } catch (error) {
    console.error('[Agent] Ollama error:', error);
    throw new Error(`AI model error: ${error.message}`);
  }
}
