# The Last Impossible Round-Island Train

An interactive, bilingual Taiwan travel adventure built as a capstone for
Kaggle x Google: 5-Day AI Agents Intensive Vibe Coding Course 2026.

**Play online:** https://anthea1003-bit.github.io/last-train-taiwan/

## Project Goals

- Deliver a complete 15-minute browser game with six Taiwan regions and a
  hidden seventh station in Penghu.
- Keep the public game free to play using Gemini Free Tier, private, and free to host.
- Use Codex collaboration plus Antigravity refinement, MCP-style research,
  Agent Skills, evaluations, and spec-driven development as the production
  workflow.
- Preserve evidence for the Kaggle capstone writeup, demo video, and code
  submission.

## Capstone Positioning

Recommended Kaggle track: **Freestyle**.

The current game was primarily implemented through Codex collaboration.
Antigravity is used as a course-aligned agentic coding surface for repository
inspection, refinement, and video evidence. The submission should describe that
honestly rather than claiming Antigravity was the sole developer.

Capstone evidence:

- Submission pack: `docs/capstone-submission.md`
- Day2-Day5 map: `docs/day2-day5-evidence.md`
- Agent Skills: `skills/quest-authoring/`, `skills/travel-fact-check/`,
  `skills/bilingual-localization/`
- Security and evaluation: `docs/evidence/day4-security-evaluation.md`
- Production release: `docs/evidence/day5-production-release.md`

## Source Of Truth

- Product specification: `specs/product-spec.md`
- Technical architecture: `specs/architecture.md`
- Acceptance scenarios: `specs/acceptance.feature`
- Course mapping: `docs/day2-day5-evidence.md`
- Design decisions: `docs/decision-log.md`

## Cost Boundary

The Conductor Agent uses a 2-tier architecture: Gemini 2.5 Flash via
project-provided Free Tier API keys (three keys across separate Google Cloud
projects, all with no billing enabled) → local rule-based engine (automatic
fallback when quota is exhausted). No cost is charged to the project. Player
progress is stored locally in the browser.

## Deployment

Every push to `main` runs tests, type-checking, and a production build before
deploying the static game to GitHub Pages.

## Current Playable Features

- Eight original watercolor scenes: title train, six Taiwan regions, and
  hidden Penghu.
- Full-screen landmark stages with layered depth, pointer parallax, mist, and
  reduced-motion support.
- Cinematic station transitions that preview the next landmark.
- A bilingual 2-tier Conductor Agent: Gemini 2.5 Flash (Free Tier) → local
  rule-based fallback.
- Seeded event selection, seeded choice order, and changing decision
  priorities so the best route is not fixed across journeys.
- Versioned local saves, recoverable mistakes, three normal endings, and one
  hidden true ending.

## Run Locally

```bash
npm install
npm run dev
```

Verification:

```bash
npm test
npm run typecheck
npm run build
npm run capstone:check
```
