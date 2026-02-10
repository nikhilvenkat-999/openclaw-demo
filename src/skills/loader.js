/**
 * Skills Loader
 *
 * Loads all available skills for the OpenClaw demo
 */

import { pipelineMonitor } from './pipeline-monitor.js';
import { sqlAgent } from './sql-agent.js';
import { reportGenerator } from './report-generator.js';

/**
 * Load all skills and return a registry
 */
export async function loadSkills() {
  const skills = {
    'pipeline-monitor': pipelineMonitor,
    'sql-agent': sqlAgent,
    'report-generator': reportGenerator,
  };

  // Initialize each skill
  for (const [name, skill] of Object.entries(skills)) {
    if (skill.init) {
      try {
        await skill.init();
        console.log(`   ✓ ${name} initialized`);
      } catch (error) {
        console.error(`   ✗ ${name} failed to initialize:`, error.message);
      }
    }
  }

  return skills;
}
