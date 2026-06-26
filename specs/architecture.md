# Technical Architecture

## Stack

- Vite
- React
- TypeScript
- CSS with project tokens and responsive layouts
- Vitest for game-engine tests
- Playwright for browser flows and visual verification
- Static assets in WebP or PNG

The project may use small established libraries when they remove meaningful
complexity. Avoid a heavy state framework unless the implementation proves it
necessary.

## Runtime Boundary

```text
Typed content data
        |
        v
Game engine (pure TypeScript)
        |
        +----> React view state
        |
        +----> versioned localStorage save
```

The public runtime has no server. The Conductor Agent calls Gemini 2.5 Flash
via project-provided Free Tier API keys (no billing enabled) and falls back
to a local rule-based engine when quota is exhausted.

## Suggested Layout

```text
src/
  app/
  components/
  content/
    regions/
    characters/
    events/
    locales/
  engine/
  hooks/
  styles/
  test/
public/
  images/
specs/
skills/
  quest-authoring/
  travel-fact-check/
  bilingual-localization/
evals/
docs/
  evidence/
```

## Core Domain Types

- `GameState`
- `Region`
- `Challenge`
- `Choice`
- `ResourceDelta`
- `Passenger`
- `Clue`
- `Ending`
- `LocaleDictionary`
- `SaveEnvelope`

## Game Engine Requirements

The engine should expose pure functions for:

- starting a game with a deterministic seed;
- selecting a region event;
- applying a choice and clamping resources;
- rewarding stamps and memory fragments;
- recording passenger help;
- determining available endings;
- checking true-ending eligibility;
- serializing and migrating save data.

Random content selection must be seedable so tests and demos are repeatable.

## Persistence

Use a versioned envelope:

```ts
type SaveEnvelope = {
  version: number;
  updatedAt: string;
  state: GameState;
};
```

Invalid or future-version saves must fail safely and offer a fresh start
without deleting the original value automatically.

## Localization

- Stable content IDs shared by all languages.
- Separate Traditional Chinese and English dictionaries.
- Language switching must not change game state.
- Missing keys should fall back to Traditional Chinese and emit a development
  warning.

## Accessibility

- Semantic controls and landmarks.
- Keyboard-operable scene objects and choices.
- Visible focus states.
- Text alternatives for inspectable scene items.
- Do not rely on color alone.
- Honor `prefers-reduced-motion`.
- Minimum comfortable touch targets on mobile.

## Security

- Gemini Free Tier API keys are bundled in the frontend JS. All three Google
  Cloud projects have no billing enabled, so exposed keys cannot incur charges.
  Quota is capped at 20 requests/day/project by Google's Free Tier.
- Treat content strings as untrusted; do not inject raw HTML.
- Restrictive Content Security Policy compatible with static hosting.
- Dependency and secret scanning in CI.
- External links use safe attributes.

## Free Deployment

Build to static files and deploy through GitHub Pages. Gemini API usage is
covered by Free Tier (no billing). Day 5 Google Cloud codelabs are optional
and intentionally excluded.
