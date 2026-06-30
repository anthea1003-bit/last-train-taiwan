# Day 4 Evidence: Security And Evaluation

## Security Boundary

The public release uses a 2-tier Conductor Agent:

- **Tier 1 (Gemini 2.5 Flash)**: secure connection through a Cloudflare Worker API proxy. The Worker securely stores three Free Tier API keys in its backend environment variables and randomly rotates them (45 RPM cap). Front-end client communicates only with the Worker URL, ensuring zero exposure of API keys;
- **Tier 2 (Local fallback)**: deterministic rule-based engine — activates automatically when the Worker responds with an error, when free tier quota is exhausted, or when no internet connection is present;
- no billing enabled on any Google Cloud project — zero financial risk;
- no accounts, analytics, geolocation, or personal data collection;
- zero-exposure of credentials in frontend;
- progress stored only in browser `localStorage`.

*Note on architectural evolution*: The initial phase carried no runtime AI calls. We then added Gemini Nano and player opt-in Cloud API, but later simplified to project-provided Free Tier keys for a better player experience — every player gets Gemini AI out of the box with no setup required.


## Threat Model

| Risk | Mitigation |
| --- | --- |
| API key exposure | API keys are securely stored in the Cloudflare Worker environment secrets. They are never exposed to the frontend JS bundle. |
| Billing surprise | All three Google Cloud projects have billing disabled, and keys are hidden in the Worker. Even if the Worker URL is invoked directly, CORS validation blocks unauthorized domains, and Google's Free Tier caps quota to 20 requests/day/project. |
| Prompt injection via user input | The system prompt is hard-coded; user input is passed only as the user message, not interpolated into instructions. Gemini's own safety filters apply. |
| Prompt injection through content | Content is typed data and rendered as React text, not raw HTML. |
| Agent spoils answers | System prompt strictly forbids revealing or copying choice text. Local fallback also enforces non-spoiler rules via tests. |
| Tool abuse / Function injection | Agent tools (`check_resources`, `get_travel_progress`) are read-only and consume no arguments. Front-end code intercepts functionCall names and maps them strictly to hardcoded GameState queries, preventing any injection or state manipulation. |
| Broken or future save data | Versioned save migration fails safely and offers a fresh start. |
| Hidden ending state drift | Regression tests cover secret ticket, six stamps, six memories, and Penghu routing repair. |
| Localization mismatch | Integrity tests require referenced keys to exist in both languages. |

## Evaluation Matrix

| Area | Evidence |
| --- | --- |
| Game rules | `src/engine/game.test.ts` |
| Agent behavior | `src/agent/conductor.test.ts` |
| Agent tool use (Function Calling) | `src/agent/conductor.ts` (callCloudGeminiAPI implements tool definitions and a sandboxed execution loop) |
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

- **Worker endpoint exposure**: The Cloudflare Worker URL is visible in the frontend. To prevent abuse, the Worker implements a dynamic CORS validation policy that rejects requests whose origin is not the project's official GitHub Pages deployment domain (`https://anthea1003-bit.github.io`) or local development environment (`localhost` / `127.0.0.1`).
- **Free Tier quota exhaustion**: If quota runs out or the Worker fails, the local rule-based fallback activates automatically. The game remains fully playable.
- **System prompt bypass**: a determined player could inspect the bundled JS
  and read the system prompt. This is acceptable since the game is
  single-player and the prompt contains no secrets beyond game hints.
