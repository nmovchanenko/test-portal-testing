# cypress-ts

Cypress + TypeScript testing playground for TestPortal.

## Install

```sh
npm install
```

## Configure

Copy `.env.example` to `.env` and fill in real local values:

```sh
cp .env.example .env
```

- `CYPRESS_BASE_URL` — the TestPortal-client instance to test against (defaults to `http://localhost:5173` for local dev, matching TestPortal-client's Vite dev server port).
- `CYPRESS_LOGIN_EMAIL` / `CYPRESS_LOGIN_PASSWORD` — credentials for an **existing, already-approved** TestPortal-client user account. Signup alone leaves an account `pending`, which cannot log in — create/approve an account first (e.g. via TestPortal-backend's `npm run bootstrap:admin`, or by having an admin approve a signup).

## Prerequisites for running tests

1. TestPortal-client is running and reachable at `CYPRESS_BASE_URL` (`yarn dev` in `TestPortal-client/`, from a separate terminal — Cypress does not start it for you).
2. The account referenced by `CYPRESS_LOGIN_EMAIL` / `CYPRESS_LOGIN_PASSWORD` exists and is approved.
3. `.env` is set from `.env.example` (see Configure above).

## Run tests

```sh
npm test          # headless run (cypress run)
npm run cy:open   # interactive runner
npm run test:json # headless run, writes a JSON report to .tmp/results.json
```

`test:json` uses Cypress's built-in Mocha `json` reporter with `--quiet` (only reporter output goes to stdout — `allowCypressEnv: false` in `cypress.config.ts` keeps Cypress's own deprecation warning out of the way too) and redirects it to a file. `.tmp/` is gitignored, matching `playwright-ts`'s convention for local report output.

## What this covers today

| Approach | Location | Status |
|---|---|---|
| UI | `cypress/e2e/login-happy-path.cy.ts` | One example test: happy-path login |

This is scaffolding plus a single example test: `cypress-ts` installs and runs cleanly, and the login happy-path test passes given the prerequisites above. It doesn't yet cover broader login scenarios (validation errors, etc.), API-level testing, mocking, or TestPortal report upload integration. Those come in later changes if pursued.
