# Day 3 Evidence: Agent Skills

## Goal

Day 3 is represented by three portable skills that turn repeatable game
production work into explicit, reviewable agent procedures.

## Skills Included

| Skill | Path | Purpose |
| --- | --- | --- |
| Quest Authoring | `skills/quest-authoring/SKILL.md` | Draft or revise station challenges without breaking the Taiwan landmark structure. |
| Travel Fact Check | `skills/travel-fact-check/SKILL.md` | Check cultural, geographic, and historical claims before content enters the game. |
| Bilingual Localization | `skills/bilingual-localization/SKILL.md` | Keep Traditional Chinese and English text aligned without resetting state IDs. |

## Why This Counts

The skills are not decorative prompts. Each one defines:

- when to use the skill;
- when not to use it;
- required inputs;
- production constraints;
- output format;
- acceptance checks.

They preserve the course idea of reusable agent skills while respecting this
project's free-to-play public runtime (Gemini Free Tier, no billing).

## Demo Moment

Open the `skills/` directory in Antigravity or GitHub and show how each skill
maps to a repeatable production task:

1. author a route;
2. check cultural correctness;
3. localize without breaking stable IDs.

## Acceptance Criteria

- Skills are stored in the repository.
- Skills reference project constraints from `AGENTS.md` and `specs/`.
- Skills do not instruct an agent to deploy paid resources.
- Skills require human review before generated content enters `src/content/`.
