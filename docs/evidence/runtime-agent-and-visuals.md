# Runtime Agent And Visual Evidence

## Zero-Token Conductor Agent

The public game contains an interactive Conductor Agent implemented as a
deterministic local TypeScript module. It reads:

- current region and challenge type;
- remaining time and fare;
- stamps, memories, helped passengers, and secret-ticket state;
- the seeded scenario modifier for the current journey;
- conversation turn index, so follow-up answers add a different reasoning
  angle instead of repeating the same response.

The Agent does not make network or model calls. It is safe to share publicly
without billing, API keys, or runtime token usage.

Evaluation coverage:

- resource questions include the live resource values;
- direct requests for the answer receive a hint without copying choice text;
- location questions use the active bilingual region name;
- the UI prompt "What should I notice at this station?" is recognized;
- repeated station questions produce different responses.

## Dynamic Challenge Behavior

The game engine uses the journey seed, step index, and challenge ID to
deterministically derive:

- event variant;
- option order;
- one of four decision priorities: time pressure, fare pressure, memory
  resonance, or compassion.

This keeps demo runs reproducible while preventing every journey from having
the same obvious best choice. Factual anomaly challenges still have a
grounded solution, but distractors are written as plausible hypotheses rather
than deliberately foolish actions.

## Original Visual Assets

Original watercolor source PNG files are preserved under `artwork/source/`.
Compressed WebP runtime assets are under `public/images/`.

Scenes:

1. Night train title scene.
2. Jiufen and the Pingxi Line.
3. Neiwan railway and Hakka mountain town.
4. Sun Moon Lake.
5. Anping and Chihkan Tower.
6. Pier-2 and Cijin.
7. Taroko Gorge.
8. Hidden Penghu seventh station.

The game uses the landmark illustration as the full-screen stage. CSS depth
layers provide pointer parallax on desktop and a subtle automatic camera move
on touch devices. Station changes use the next landmark image in a cinematic
arrival transition with carriage framing, mist layers, station title, and the
previous result.

Reduced-motion mode disables camera motion, parallax, fog movement, and
transition animation.

## Verification Snapshot

On June 19, 2026:

- `npm test`: 17 tests passed.
- `npm run typecheck`: passed.
- `npm run build`: passed with Vite 8.0.16.
- Desktop Playwright journey: local Agent follow-up, correct choice, and
  next-station transition verified.
- Mobile Playwright viewport: 390 x 844, no primary-control clipping or
  horizontal overflow.
- Browser console: React development info only; no runtime errors.
