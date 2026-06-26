# Day 2-Day 5 Capstone Evidence Map

This map keeps the game concept and watercolor travel design intact while
making the Kaggle x Google capstone evidence easy to review.

## Evidence Boundary

- The public game uses Gemini Free Tier for the Conductor Agent, is backend-free, and hosted as static files.
- Codex was the primary implementation collaborator for the current game.
- Antigravity participates in the course-aligned refinement, inspection, and
  demo workflow.
- Do not claim that Antigravity was the sole or primary developer.

## Day 2: Agent Tools And Interoperability

Course concepts:

- agentic coding workflow;
- tool use;
- MCP-style research and interoperability;
- static public deployment boundary.

Project evidence:

- `docs/evidence/day2-agy-build.md`
- `docs/evidence/day2-mcp-research.md`
- shell-based local verification through `npm test`, `npm run typecheck`, and
  `npm run build`;
- GitHub Pages public deployment.

Demo moment:

- Show Antigravity opening or inspecting the repository.
- Show that the public game calls Gemini 2.5 Flash via Free Tier keys and requires no backend.

## Day 3: Agent Skills

Course concepts:

- reusable skills;
- task routing;
- focused production workflows.

Project evidence:

- `skills/quest-authoring/SKILL.md`
- `skills/travel-fact-check/SKILL.md`
- `skills/bilingual-localization/SKILL.md`
- `docs/evidence/day3-agent-skills.md`

Demo moment:

- Open the `skills/` folder and explain how a new station would move through
  authoring, fact-checking, and bilingual localization before entering the game.

## Day 4: Security And Evaluation

Course concepts:

- security boundaries;
- human review;
- automated tests;
- no-spoiler agent behavior;
- cost and privacy safety.

Project evidence:

- `docs/evidence/day4-security-evaluation.md`
- `src/agent/conductor.test.ts`
- `src/engine/game.test.ts`
- `src/content/integrity.test.ts`

Demo moment:

- Ask the Conductor Agent for an answer and show that it gives reasoning
  guidance without copying the exact choice.
- Show the tests or security/evaluation evidence document.

## Day 5: Spec-Driven Production Release

Course concepts:

- specs as source of truth;
- production-grade constraints;
- deployability;
- release evidence.

Project evidence:

- `specs/product-spec.md`
- `specs/architecture.md`
- `specs/acceptance.feature`
- `docs/evidence/day5-production-release.md`
- `docs/capstone-submission.md`
- live GitHub Pages URL.

Demo moment:

- Click the in-game `Capstone Ticket`.
- Show the live game, repository, and submission checklist.

## Submission Priority

For Kaggle Capstone, prioritize:

1. a public playable game link;
2. a public GitHub repository;
3. a short video that shows the game, Conductor Agent, Capstone Ticket panel,
   and Antigravity participation;
4. a writeup that honestly describes Codex + Antigravity collaboration and
   maps the project to at least three course concepts.
