# Day 2 Evidence: Tools, Interoperability, And MCP-Style Research

## Scope

The public game calls Gemini 2.5 Flash via Free Tier API keys for the
Conductor Agent. Tooling and interoperability are demonstrated as
development-time workflow. The player experience is free (no billing) and
private (no personal data collected).

## Evidence Boundary

- Antigravity participates in the course-aligned agentic coding workflow.
- Codex collaboration is also part of the actual development history.
- MCP-style research is used to ground content and documentation; any external
  source text is treated as untrusted input and converted into reviewed,
  static game content before release.

## Development-Time Tool Chain

- Antigravity / Agy workflow for repository inspection and refinement.
- GitHub repository for source review and deployment history.
- Vite, TypeScript, React, and Vitest for local build and tests.
- GitHub Pages for static deployability evidence.

## Interoperability Design

The game separates three layers:

1. **Content data** in `src/content/regions.ts` and `src/content/locales.ts`.
2. **Pure game rules** in `src/engine/game.ts`.
3. **Runtime UI** in React components under `src/components/`.

This separation makes the project compatible with agentic authoring tools:
new quest drafts can be generated, fact-checked, localized, evaluated, and only
then merged into static content.

## Cost-Safe MCP Pattern

The capstone uses the MCP idea as a development boundary:

- retrieve or inspect source material during development;
- never let raw retrieved content directly control runtime behavior;
- record the decision in evidence docs;
- ship only reviewed static data.

This avoids exposing players to network failures, prompt injection, billing
surprises, or source poisoning during gameplay.

## Demo Moment

For the submission video, show the repository evidence files and explain:

> MCP and external research are used before release. The public game uses
> Gemini Free Tier for the Conductor Agent and remains free to play.
