/**
 * Pipeline Monitor Skill
 *
 * Monitors data pipelines and provides status reports.
 * For demo purposes, i used mock data simulating Azure Data Factory.
 *
 * In production, you would connect to:
 * - Azure Data Factory REST API
 * - Apache Airflow API
 * - AWS Step Functions
 * - etc.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Mock pipeline data (simulates Azure Data Factory)
const mockPipelines = [
  {
    name: "Sales-ETL-Daily",
    status: "Succeeded",
    lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    duration: "12 minutes",
    recordsProcessed: 45230,
    dataSource: "Azure SQL",
    dataTarget: "Synapse Analytics"
  },
  {
    name: "Customer-Data-Sync",
    status: "Failed",
    lastRun: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
    duration: "3 minutes",
    error: "Connection timeout to source database",
    errorCode: "DF-ADF-001",
    retryCount: 2
  },
  {
    name: "Inventory-Update",
    status: "Running",
    startTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // Started 5 min ago
    progress: "67%",
    currentStep: "Transforming data",
    estimatedCompletion: "8 minutes"
  },
  {
    name: "Marketing-Analytics",
    status: "Succeeded",
    lastRun: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    duration: "25 minutes",
    recordsProcessed: 128450,
    dataSource: "Google Analytics API",
    dataTarget: "PowerBI Dataset"
  },
  {
    name: "Financial-Reconciliation",
    status: "Queued",
    scheduledTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // In 30 min
    priority: "High",
    dependencies: ["Sales-ETL-Daily"]
  },
  {
    name: "User-Activity-Log",
    status: "Succeeded",
    lastRun: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min ago
    duration: "8 minutes",
    recordsProcessed: 892100,
    dataSource: "Event Hub",
    dataTarget: "Data Lake"
  }
];

/**
 * Get status emoji
 */
function getStatusEmoji(status) {
  const emojis = {
    'Succeeded': '✅',
    'Failed': '❌',
    'Running': '🔄',
    'Queued': '⏳',
    'Cancelled': '🚫'
  };
  return emojis[status] || '❓';
}

/**
 * Format pipeline status for display
 */
function formatPipelineStatus(pipelines) {
  let output = '## 📊 Pipeline Status Report\n\n';
  output += `**Generated**: ${new Date().toLocaleString()}\n\n`;

  // Summary
  const succeeded = pipelines.filter(p => p.status === 'Succeeded').length;
  const failed = pipelines.filter(p => p.status === 'Failed').length;
  const running = pipelines.filter(p => p.status === 'Running').length;
  const queued = pipelines.filter(p => p.status === 'Queued').length;

  output += `### Summary\n`;
  output += `| Status | Count |\n|--------|-------|\n`;
  output += `| ✅ Succeeded | ${succeeded} |\n`;
  output += `| ❌ Failed | ${failed} |\n`;
  output += `| 🔄 Running | ${running} |\n`;
  output += `| ⏳ Queued | ${queued} |\n\n`;

  // Details
  output += `### Pipeline Details\n\n`;

  for (const pipeline of pipelines) {
    output += `**${getStatusEmoji(pipeline.status)} ${pipeline.name}**\n`;
    output += `- Status: ${pipeline.status}\n`;

    if (pipeline.lastRun) {
      const lastRun = new Date(pipeline.lastRun);
      output += `- Last Run: ${lastRun.toLocaleString()}\n`;
    }
    if (pipeline.duration) {
      output += `- Duration: ${pipeline.duration}\n`;
    }
    if (pipeline.recordsProcessed) {
      output += `- Records: ${pipeline.recordsProcessed.toLocaleString()}\n`;
    }
    if (pipeline.error) {
      output += `- ⚠️ Error: ${pipeline.error}\n`;
    }
    if (pipeline.progress) {
      output += `- Progress: ${pipeline.progress}\n`;
    }
    output += '\n';
  }

  // Recommendations for failed pipelines
  if (failed > 0) {
    output += `### 🚨 Action Required\n\n`;
    const failedPipelines = pipelines.filter(p => p.status === 'Failed');
    for (const p of failedPipelines) {
      output += `**${p.name}**: ${p.error}\n`;
      output += `- Suggestion: Check database connectivity and retry\n`;
      output += `- Retry count: ${p.retryCount || 0}\n\n`;
    }
  }

  return output;
}

/**
 * Pipeline Monitor Skill
 */
export const pipelineMonitor = {
  name: 'pipeline-monitor',
  description: 'Monitor data pipelines and report status',

  /**
   * Initialize the skill
   */
  async init() {
    // In production: validate API connections
    console.log('   Pipeline monitor initialized with mock data');
  },

  /**
   * Execute the skill
   */
  async execute(query) {
    const lowerQuery = query.toLowerCase();

    // Check for specific pipeline
    for (const pipeline of mockPipelines) {
      if (lowerQuery.includes(pipeline.name.toLowerCase())) {
        return formatPipelineStatus([pipeline]);
      }
    }

    // Check for status filter
    if (lowerQuery.includes('failed') || lowerQuery.includes('error')) {
      const failed = mockPipelines.filter(p => p.status === 'Failed');
      if (failed.length === 0) {
        return '✅ No failed pipelines. All systems operational!';
      }
      return formatPipelineStatus(failed);
    }

    if (lowerQuery.includes('running') || lowerQuery.includes('active')) {
      const running = mockPipelines.filter(p => p.status === 'Running');
      if (running.length === 0) {
        return '📭 No pipelines currently running.';
      }
      return formatPipelineStatus(running);
    }

    // Default: show all
    return formatPipelineStatus(mockPipelines);
  }
};
