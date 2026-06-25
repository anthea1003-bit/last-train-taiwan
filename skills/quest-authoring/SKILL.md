# Quest Authoring Skill

Use this skill when creating or revising a station challenge, passenger
dialogue, anomaly, choice, clue, memory reward, or hidden-route condition for
`最後一班不存在的環島列車`.

Do not use this skill for unrelated UI styling, deployment, dependency
installation, or changing the public cost boundary.

## Inputs Required

- Target region ID.
- Landmark or cultural focus.
- Challenge type: anomaly, dialogue, or decision.
- Desired emotional tone.
- Whether the route can award a memory fragment.
- Whether the route can affect the secret-ticket or Penghu path.

## Production Constraints

- Preserve the seven-station structure in `specs/product-spec.md`.
- Public gameplay must remain zero-token and backend-free.
- The player is always human.
- Wrong choices must be recoverable and gently explained.
- Choices should be plausible, not obviously foolish.
- Content must support Traditional Chinese and English through stable keys.
- Human review is required before writing generated content into `src/content/`.

## Workflow

1. Read `AGENTS.md`, `specs/product-spec.md`, and `specs/architecture.md`.
2. Identify the current data shape in `src/content/regions.ts`.
3. Draft the challenge as structured data, not prose embedded in UI code.
4. Define resource deltas, stamp/memory rewards, and clue IDs explicitly.
5. Confirm that the challenge is playable in 15 minutes.
6. Hand off to `travel-fact-check` before implementation.
7. Hand off to `bilingual-localization` before final merge.

## Output Format

```markdown
## Quest Draft

- Region:
- Landmark:
- Challenge type:
- Scenario premise:
- Correct or accepted route:
- Alternate route:
- Resource effects:
- Rewards:
- Clue IDs:
- Memory conditions:
- Safety notes:
- Localization keys to add:
```

## Acceptance Checks

- No new backend or runtime model call is required.
- The route does not leak the hidden Penghu unlock too early.
- The Conductor Agent can hint at the logic without naming the answer.
- Both languages can be added without changing existing stable IDs.
