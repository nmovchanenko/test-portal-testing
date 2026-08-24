# playwright-ts

Playwright + TypeScript testing playground for TestPortal.

New test code in this workspace follows [`coding-guide.md`](./coding-guide.md). It's auto-loaded via `CLAUDE.md` for direct edits, and referenced explicitly by the authoring agents below.

## Install

```sh
npm install
```

## Configure

Copy `.env.example` to `.env` and set `TESTPORTAL_BASE_URL` to the TestPortal instance you want to target (defaults to `http://localhost:3001` for local dev, matching TestPortal-backend's default port):

```sh
cp .env.example .env
```

## Run tests

```sh
npm test              # run every project
npm run test:api      # run only the api project
npm run test:ui       # run only the ui project
npm run test:mocking  # run only the mocking project
npm run report         # open the last HTML report
```

## Agent-assisted test authoring

This workspace includes Playwright's Test Agents (`npx playwright init-agents --loop claude`): three Claude Code subagents backed by an MCP server (`.mcp.json`) that drive a real browser.

| Agent | Role |
|---|---|
| `playwright-test-planner` | Explores the running app and writes a test plan to `specs/` |
| `playwright-test-generator` | Turns one plan scenario + a seed file into a runnable spec under `tests/` |
| `playwright-test-healer` | Runs the suite and fixes failing tests |

See `specs/README.md` for how a plan becomes a generated test. The `api` project's seed file, `tests/api/seed.spec.ts`, currently establishes no shared state yet (empty placeholder) — fill it in once the first real test plan needs one.

## What this covers today

| Approach | Location | Status |
|---|---|---|
| API | `tests/api/` | Scaffolded, runnable; has a seed test (`seed.spec.ts`) for the authoring-agent workflow, no other test cases yet |
| UI | `tests/ui/` | Scaffolded, runnable, no test cases yet |
| Mocking | `tests/mocking/` | Scaffolded, runnable, no test cases yet |
| Component | `tests/component/` | Reserved — not yet wired to a runnable command (see `tests/component/README.md`) |

This is scaffolding only: the workspace installs and runs cleanly (`ui`/`mocking` report zero tests found, `api`'s seed test passes) but doesn't yet contain real test cases or TestPortal report upload integration. Those come in later changes.
