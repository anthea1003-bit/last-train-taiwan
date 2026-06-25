# Day 4 Evidence: Security And Evaluation

## Security Boundary

The public release uses a 3-tier Conductor Agent with progressive AI access:

- **Tier 1 (Gemini Nano)**: Chrome built-in on-device AI — zero network calls, zero cost;
- **Tier 2 (Gemini Cloud API)**: opt-in by the player pasting their own API key — no project-bundled keys;
- **Tier 3 (Local fallback)**: deterministic rule-based engine — always available offline;
- no project-owned API keys shipped in the bundle or environment;
- no accounts, analytics, geolocation, or personal data collection;
- no backend server;
- no billable Google Cloud resources charged to the project;
- progress and optional user API key stored only in browser `localStorage`.

## Threat Model

| Risk | Mitigation |
| --- | --- |
| API key leakage | No project-owned keys are bundled. User-supplied keys are stored in `localStorage` with a `type="password"` input and never sent to any server other than Google's `generativelanguage.googleapis.com`. |
| Billing surprise | Default tier is Gemini Nano (free, on-device) or local fallback. Cloud API only activates when the player explicitly opts in with their own key. |
| Prompt injection via user input | The system prompt is hard-coded; user input is passed only as the user message, not interpolated into instructions. Gemini's own safety filters apply. |
| Prompt injection through content | Content is typed data and rendered as React text, not raw HTML. |
| Agent spoils answers | System prompt strictly forbids revealing or copying choice text. Local fallback also enforces non-spoiler rules via tests. |
| Broken or future save data | Versioned save migration fails safely and offers a fresh start. |
| Hidden ending state drift | Regression tests cover secret ticket, six stamps, six memories, and Penghu routing repair. |
| Localization mismatch | Integrity tests require referenced keys to exist in both languages. |

## Evaluation Matrix

| Area | Evidence |
| --- | --- |
| Game rules | `src/engine/game.test.ts` |
| Agent behavior | `src/agent/conductor.test.ts` |
| Content schema and localization | `src/content/integrity.test.ts` |
| Build integrity | `npm run typecheck` and `npm run build` |
| Runtime affordability | static GitHub Pages deployment, no backend |
| Accessibility and motion | keyboard-friendly controls and reduced-motion CSS |

## Non-Spoiler Agent Evaluation

The Conductor Agent is allowed to:

- identify the player's current station;
- explain time, fare, stamp, memory, and secret-ticket status;
- describe the active hidden rule;
- give a reasoning direction.

The Conductor Agent must not:

- copy the exact correct choice text;
- request personal data;
- change game state outside the approved UI flow.

## Current Verification Command Set

Run before final submission:

```bash
npm test
npm run typecheck
npm run build
npm run capstone:check
```

## Residual Risk

- **Gemini Nano availability**: Chrome built-in AI is still rolling out and may
  not be available in all browsers. The local fallback guarantees the game is
  always playable.
- **User API key in localStorage**: not encrypted. This is standard browser
  practice for client-side keys but the settings panel makes the tradeoff
  visible to the player.
- **System prompt bypass**: a determined player could inspect the bundled JS
  and read the system prompt. This is acceptable since the game is
  single-player and the prompt contains no secrets beyond game hints.
