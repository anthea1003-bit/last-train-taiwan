import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

const requiredFiles = [
  'README.md',
  'docs/capstone-submission.md',
  'docs/day2-day5-evidence.md',
  'docs/evidence/day2-agy-build.md',
  'docs/evidence/day2-mcp-research.md',
  'docs/evidence/day3-agent-skills.md',
  'docs/evidence/day4-security-evaluation.md',
  'docs/evidence/day5-production-release.md',
  'skills/quest-authoring/SKILL.md',
  'skills/travel-fact-check/SKILL.md',
  'skills/bilingual-localization/SKILL.md',
  'src/components/CapstonePanel.tsx',
  'src/agent/conductor.test.ts',
  'src/engine/game.test.ts',
  'src/content/integrity.test.ts'
];

const requiredText = [
  {
    file: 'README.md',
    snippets: ['Freestyle', 'Codex collaboration', 'Antigravity']
  },
  {
    file: 'docs/capstone-submission.md',
    snippets: ['Recommended track', 'Honest Tooling Statement', 'Do not claim']
  },
  {
    file: 'docs/evidence/day4-security-evaluation.md',
    snippets: ['no runtime Gemini or LLM calls', 'No API keys', 'Non-Spoiler Agent Evaluation']
  },
  {
    file: 'docs/day2-day5-evidence.md',
    snippets: ['Day 2', 'Day 3', 'Day 4', 'Day 5']
  }
];

const failures = [];

for (const file of requiredFiles) {
  try {
    const stats = statSync(join(root, file));
    if (!stats.isFile() || stats.size === 0) {
      failures.push(`${file} exists but is empty or not a file`);
    }
  } catch {
    failures.push(`${file} is missing`);
  }
}

for (const check of requiredText) {
  let content = '';
  try {
    content = readFileSync(join(root, check.file), 'utf8');
  } catch {
    continue;
  }

  for (const snippet of check.snippets) {
    if (!content.includes(snippet)) {
      failures.push(`${check.file} is missing required text: ${snippet}`);
    }
  }
}

if (failures.length > 0) {
  console.error('Capstone evidence check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Capstone evidence check passed: ${requiredFiles.length} files verified.`);
