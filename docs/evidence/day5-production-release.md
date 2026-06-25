# Day 5 Evidence: Spec-Driven Production Release

## Production Strategy

The Day 5 cloud deployment codelabs may require billing, so this project uses a
free public release path:

- Vite production build;
- static assets only;
- GitHub Pages deployment;
- no runtime Google Cloud resources.

This keeps the capstone playable by anyone without requiring API keys, accounts,
or paid infrastructure.

## Spec Sources

- Product specification: `specs/product-spec.md`
- Technical architecture: `specs/architecture.md`
- Acceptance scenarios: `specs/acceptance.feature`
- Course mapping: `docs/day2-day5-evidence.md`
- Submission pack: `docs/capstone-submission.md`

## Production Controls

- Data-driven regions and choices.
- Deterministic seeded runs for repeatable demos.
- Versioned `localStorage` saves.
- Bilingual strings behind stable keys.
- CI-friendly commands: `npm test`, `npm run typecheck`, `npm run build`.
- Capstone completeness check: `npm run capstone:check`.

## Demo Evidence

The live demo should show:

1. title screen and Capstone Ticket panel;
2. one station challenge;
3. local Conductor Agent response;
4. reward animation and ticket state;
5. GitHub repo evidence files;
6. Antigravity refinement workflow.

## Release Boundary

The public release is not a Google Cloud deployment. That is intentional. The
project prioritizes a free, zero-token capstone demo, while documenting how
agentic authoring and evaluation were used during development.
