# Day 4 Evidence: Security And Evaluation

## Security Boundary

The public release is intentionally static:

- no runtime Gemini or LLM calls;
- No API keys in browser code;
- no accounts, analytics, geolocation, or personal data collection;
- no backend server;
- no billable Google Cloud resources;
- progress is stored only in browser `localStorage`.

## Threat Model

| Risk | Mitigation |
| --- | --- |
| API key leakage | No runtime API keys are used or bundled. |
| Billing surprise | Public game has no model calls and deploys as static assets. |
| Prompt injection through content | Content is typed data and rendered as React text, not raw HTML. |
| Agent spoils answers | Conductor Agent tests assert that hint replies do not copy choice text. |
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
- pretend to call a model;
- request personal data;
- instruct the player to use paid services;
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

The in-game Conductor Agent is deterministic and local, not a hosted Gemini or
ADK agent. This is a deliberate cost and privacy tradeoff. The submission
should explain that AI agent concepts are demonstrated through local agent
logic, agentic development workflow, skills, security evaluation, and
deployability rather than runtime model billing.
