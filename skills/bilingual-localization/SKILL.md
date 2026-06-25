# Bilingual Localization Skill

Use this skill when adding or revising Traditional Chinese and English copy for
the game UI, regions, choices, consequences, clues, endings, or evidence
surfaces.

Do not use this skill to reset game progress, rename stable IDs casually, or
rewrite the story voice into generic instructional text.

## Inputs Required

- Stable localization key.
- Traditional Chinese source or English source.
- Gameplay context.
- Tone: mysterious, healing, factual, hint, warning, or evidence.
- Whether text appears in player-facing gameplay or capstone evidence.

## Voice Rules

- Traditional Chinese is the primary story voice.
- English should preserve meaning and mood, not translate word-for-word.
- Keep the player addressed as a human traveler.
- Hints should guide reasoning without revealing exact answer text.
- Capstone evidence copy may be clear, but should still fit the ticket/journal
  visual language when shown inside the game.

## Workflow

1. Read nearby keys in `src/content/locales.ts`.
2. Preserve existing stable keys unless a migration is explicitly required.
3. Add both `zh-TW` and `en` values together.
4. Keep choice/consequence pairs semantically aligned.
5. Run content integrity tests after editing.

## Output Format

```markdown
## Localization Patch Plan

- Keys added:
- Keys changed:
- zh-TW tone notes:
- en tone notes:
- Gameplay state impact:
- Tests to run:
```

## Acceptance Checks

- Every referenced key exists in both languages.
- Language switching does not change `GameState`.
- Text fits mobile panels without excessive overflow.
- No raw HTML is required for formatting.
