## Why

Playwright's MCP-backed agentic test-authoring tools (a planner, generator, and healer subagent driving a real browser through Claude Code) were added directly to `playwright-ts/` without going through OpenSpec, even though this repo's second goal is to practice spec-driven development on every meaningful change. This proposal retroactively specs that addition, so the pattern's shape — why these three agents, what the MCP server exposes, where test plans and seed files live — is documented for teammates and for future framework directories that might adopt the same pattern, rather than left implicit in a handful of `.claude/agents/*.md` files.

## What Changes

- Register a `playwright-test` MCP server in `playwright-ts/.mcp.json` (launched via `npx playwright run-test-mcp-server`), exposing browser-automation and planner/generator/healer tools to Claude Code.
- Add three Claude Code subagents scoped to `playwright-ts/.claude/agents/`:
  - `playwright-test-planner` — explores the running app and writes a test plan.
  - `playwright-test-generator` — turns one test-plan item into a runnable spec file, using a seed file for shared starting state.
  - `playwright-test-healer` — runs the suite and repairs failing tests.
- Add `playwright-ts/specs/` as the location for test-plan documents the planner agent produces — distinct from `playwright-ts/tests/`, which holds actual Playwright spec files.
- Add `playwright-ts/tests/api/seed.spec.ts` as the seed file the generator uses to establish shared starting page state for generated `api` tests.
- Update the `playwright-ts` capability's "runnable scaffold, zero test cases" requirement: the `api` project now contains a seed test, so it's no longer literally empty, while `ui` and `mocking` remain at zero tests until agents generate more.
- Retroactive change: the files already exist in the working tree from manual setup. This proposal formalizes and documents what's there; `tasks.md` covers verification and any gaps (e.g. real content for `specs/README.md`), not net-new implementation.

## Capabilities

### New Capabilities
- `playwright-test-authoring-agents`: Agent-assisted test planning → generation → healing workflow for `playwright-ts`, backed by Playwright's MCP test server and three dedicated Claude Code subagents, with test plans stored under `playwright-ts/specs/` and a seed file establishing shared starting state for generated tests.

### Modified Capabilities
- `playwright-ts`: the "Runnable scaffold with zero test cases" requirement's scenario is updated to reflect that the `api` project now has a seed test (added for the authoring-agent workflow), while `ui` and `mocking` remain at zero tests.

## Impact

- Affected paths: `playwright-ts/.mcp.json`, `playwright-ts/.claude/agents/*.md`, `playwright-ts/specs/`, `playwright-ts/tests/api/seed.spec.ts`.
- New dependency: Playwright's bundled `run-test-mcp-server` command (ships with `@playwright/test`, no extra package to install).
- No changes to root-level `repo-scaffolding` conventions or to any other framework directory.
- Out of scope: generating real test plans or real generated tests via the agents — this change specs the workflow and its scaffolding, not its first real output.
