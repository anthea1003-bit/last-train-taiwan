# The Last Impossible Round-Island Train

An interactive, bilingual Taiwan travel adventure built as a capstone for
Kaggle x Google: 5-Day AI Agents Intensive Vibe Coding Course 2026.

**Play online:** https://anthea1003-bit.github.io/last-train-taiwan/

## Project Goals

- Deliver a complete 15-minute browser game with six Taiwan regions and a
  hidden seventh station in Penghu.
- Keep the public game zero-token, private, and free to host.
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

The public game must not call Gemini or any paid API at runtime. AI and MCP
are development-time tools only. Player progress is stored locally in the
browser.

## Deployment

Every push to `main` runs tests, type-checking, and a production build before
deploying the static game to GitHub Pages.

## Current Playable Features

- Eight original watercolor scenes: title train, six Taiwan regions, and
  hidden Penghu.
- Full-screen landmark stages with layered depth, pointer parallax, mist, and
  reduced-motion support.
- Cinematic station transitions that preview the next landmark.
- A bilingual local Conductor Agent that reads journey context and answers
  questions without network or model calls.
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
