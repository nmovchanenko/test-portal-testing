# playwright-ts

Playwright + TypeScript testing playground for TestPortal.

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

## What this covers today

| Approach | Location | Status |
|---|---|---|
| API | `tests/api/` | Scaffolded, runnable, no test cases yet |
| UI | `tests/ui/` | Scaffolded, runnable, no test cases yet |
| Mocking | `tests/mocking/` | Scaffolded, runnable, no test cases yet |
| Component | `tests/component/` | Reserved — not yet wired to a runnable command (see `tests/component/README.md`) |

This is scaffolding only: the workspace installs and runs cleanly (reporting zero tests found) but doesn't yet contain test cases or TestPortal report upload integration. Those come in later changes.
