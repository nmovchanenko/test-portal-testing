## Why

`repo-scaffolding` establishes that every framework+language combination gets its own self-contained top-level directory, but only `playwright-ts/` exists so far. Adding a second framework directory now — Cypress + TypeScript — exercises that convention with a real second data point (does the documented process actually produce a consistent, self-contained directory?) and gives the team hands-on practice with another widely-used UI testing tool. Unlike the original `playwright-ts` scaffold (which shipped with zero test cases), this scaffold ships with one runnable example test so the setup is verified end-to-end and gives contributors a concrete pattern to copy when adding their own Cypress tests.

## What Changes

- Scaffold a new top-level `cypress-ts/` directory: Node.js/TypeScript project setup (`package.json`, `tsconfig.json`, `cypress.config.ts`) following the `<framework>-<language>` convention from `repo-scaffolding`.
- Configure Cypress for E2E testing against TestPortal-client, with the target base URL configurable via environment variable (not hardcoded), mirroring how `playwright-ts` externalizes its TestPortal target.
- Add one example E2E test: a happy-path login scenario driving the TestPortal-client UI (navigate to login, submit valid credentials, land on the authenticated app).
- Add `cypress-ts/README.md` documenting framework/language, install, how to run tests, and testing approaches currently covered (UI only, via this one example).
- Update the root `README.md` framework directory table to add a row for `cypress-ts` (Scaffolded), per `repo-scaffolding`'s documented process for adding a new framework directory.
- Scope note: this change is scaffolding plus a single example test only — no broader login test coverage (validation errors, API-level checks, mocking), no TestPortal report upload/integration, and no CI wiring. Those follow in later changes if pursued.

## Capabilities

### New Capabilities
- `cypress-ts`: The Cypress + TypeScript workspace scaffold — project setup, E2E config with a configurable TestPortal-client target, and one example test demonstrating a happy-path UI login flow.

### Modified Capabilities
<!-- none: repo-scaffolding's existing requirements already cover adding a second framework directory; only its README content (not a requirement) changes -->

## Impact

- Affected paths: repo root `README.md` (new table row), new `cypress-ts/` directory and its config/test files.
- No existing code, APIs, or systems are touched — `playwright-ts/` and the rest of the repo are untouched.
- Dependencies introduced: Cypress + TypeScript tooling inside `cypress-ts/` (exact packages decided in design.md).
- Out of scope for this change: broader login test coverage beyond the one happy-path example, TestPortal report upload/integration, CI wiring, and any framework directory beyond `cypress-ts`.
