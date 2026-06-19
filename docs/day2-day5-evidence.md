# Day 2-Day 5 Capstone Evidence Plan

## Day 2: Agent Tools And Interoperability

Course evidence:

- Build the project through Antigravity CLI.
- Use implementation-plan and task artifacts.
- Use shell tools to install, test, build, and inspect the app.
- Configure and use Google Developer Knowledge MCP for official documentation.
- Create a local read-only Taiwan travel knowledge MCP or equivalent fixture.
- Record sources and tool decisions in `docs/evidence/day2-mcp-research.md`.

Capstone value:

- Demonstrates tool use, MCP reach, structured content ingestion, and a
  multi-file application built through Agy.

## Day 3: Agent Skills

Create and evaluate three project skills:

1. `quest-authoring`
2. `travel-fact-check`
3. `bilingual-localization`

Each skill needs:

- focused `SKILL.md`;
- positive and negative triggers;
- deterministic scripts where useful;
- references loaded only on demand;
- golden test cases;
- evidence of successful invocation and non-invocation.

Capstone value:

- Converts repeatable content-production procedures into portable skills.

## Day 4: Security And Evaluation

Security evidence:

- human approval before generated quests enter production content;
- threat model and security checklist;
- no-secret check;
- dependency audit;
- XSS-safe rendering;
- prompt-injection and poisoned-source red-team cases.

Evaluation evidence:

- unit tests for game rules;
- local Conductor Agent intent and repetition regression tests;
- deterministic variation tests for choice order and changing priorities;
- schema and localization checks;
- Playwright desktop and mobile journeys;
- all endings tested;
- accessibility checks;
- reduced-motion checks for parallax, mist, and arrival transitions;
- evaluation rubric covering factuality, cultural respect, puzzle clarity,
  visual behavior, and cost.

Outputs:

- `docs/evidence/day4-security-report.md`
- `docs/evidence/day4-evaluation-report.md`

## Day 5: Spec-Driven Production-Grade Development

Production evidence:

- specifications under `specs/`;
- Gherkin acceptance scenarios;
- code treated as generated output of versioned specifications;
- CI tests, build, security checks, and Pages deployment;
- release summary, architecture diagram, and risk report;
- public zero-token frontend connected to pre-approved static content.

The Google Cloud agent deployment codelabs are optional and may require
billing. This project uses the free static deployment path while documenting
how a cloud-hosted authoring agent could be added later.

Outputs:

- public GitHub Pages URL;
- repository URL;
- 3-5 minute demo video;
- Kaggle writeup with rationale, architecture, evidence, and code link.
