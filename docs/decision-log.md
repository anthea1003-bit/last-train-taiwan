# Decision Log

## Product

- Build one capstone across Days 2-5 instead of unrelated exercises.
- Use a fixed six-region narrative with small randomized events.
- Use a mysterious night train and displaced parallel Taiwan as the story.
- Keep the player human: a traveler recovering identity and memories.
- Use Penghu as the impossible seventh station.
- Include three normal endings and one hidden true ending.

## Experience

- Target a 15-minute first play.
- Support Traditional Chinese and English.
- Use scene puzzles, passenger dialogue, travel decisions, and carriage
  deduction.
- Avoid hard failure states to preserve a healing tone.
- Use Japanese animated-film composition, vintage Taiwan rail motifs, and
  hand-painted watercolor texture.
- Support mobile and desktop.

## Architecture

- Public runtime is static with Gemini Free Tier API keys (no billing).
- Development-time agents may research, author, fact-check, localize, test,
  and review content.
- Save progress only in versioned localStorage.
- Keep content data-driven.
- Use GitHub Pages rather than billable Google Cloud deployment.

## Course Strategy

- Day 2 proves CLI, tools, and MCP integration.
- Day 3 packages production workflows as Agent Skills.
- Day 4 adds HITL, security testing, and evaluations.
- Day 5 treats specifications and BDD as the source of truth and publishes a
  production-quality static release.
- Prioritize a valid Kaggle Capstone submission while retaining the already
  earned Google Developers event badge.
