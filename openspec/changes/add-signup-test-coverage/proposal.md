## Why

Sign-up is the entry point to TestPortal (`POST /api/v2/auth/signup`, `TestPortal-client`'s `/signup` page) but has zero automated coverage today — `playwright-ts/tests/{api,ui,mocking}` are all empty aside from a seed test. Sign-up also has non-trivial, easy-to-regress business rules split across two layers (client-side zod schema in `authSchemas.ts` and server-side checks in `userService.signup`/`authProviderService.signup`, including the `@ventionteams.com` domain restriction and duplicate-email handling), which makes it a good first real feature to test and a template for how future features get covered across the pyramid.

## What Changes

- Add API-level tests (`playwright-ts/tests/api`) hitting `POST /api/v2/auth/signup` directly: valid signup, missing fields, invalid email format, weak/short password, non-`@ventionteams.com` domain rejection, duplicate email rejection, response shape (`201` + safe user, no password hash leaked).
- Add mocked UI tests (`playwright-ts/tests/mocking`) that render the Signup page against a mocked/stubbed API to exercise client-side zod validation (name/email/password/confirm-password rules, inline error messages, disabled/loading button state) and success/error UI branches without a live backend.
- Add a small number of E2E UI tests (`playwright-ts/tests/ui`) that drive the real signup flow end-to-end against a running TestPortal-backend + client: one happy-path signup → redirect to login with success message, and one representative failure path (e.g. duplicate email) surfaced in the UI. Kept minimal per the testing pyramid — API and mocked-UI tests carry the bulk of validation coverage.
- Use the existing `playwright-test-planner` agent to explore the live sign-up flow (client pages/hooks, backend routes/services) and produce the scenario/validation matrix per level (API / mocked UI / E2E) before any test code is written.
- Use the existing `playwright-test-generator` agent to generate the actual spec files from the planned scenarios, and the `playwright-test-healer` agent to fix any tests that fail on first run (selector drift, timing, environment issues).
- No changes to application code — this is test-authoring only.

## Capabilities

### New Capabilities
- `playwright-ts/signup-testing`: Automated test coverage for the sign-up feature across API, mocked-UI, and E2E levels, following the testing pyramid and produced via the planner → generator → healer agent workflow.

### Modified Capabilities
(none — `playwright-ts` scaffold and `playwright-test-authoring-agents` specs already anticipate this usage; no requirement changes needed there)

## Impact

- **New files**: test specs under `playwright-ts/tests/api/`, `playwright-ts/tests/mocking/`, `playwright-ts/tests/ui/`, plus any shared fixtures/helpers (e.g. signup payload builders, unique-email generation to avoid cross-run collisions).
- **Systems under test**: `TestPortal-backend` (`POST /api/v2/auth/signup`, `userService.signup`, `authProviderService.signup`), `TestPortal-client` (`/signup` page, `useSignup` hook, `authSchemas.ts` zod schema).
- **Test data / environment**: API and E2E tests need a reachable TestPortal-backend instance (local dev stack per root `CLAUDE.md`) and email addresses ending in `@ventionteams.com` to pass server-side domain validation; needs a strategy for unique emails per run and cleanup/isolation so repeated runs don't collide on duplicate-email checks.
- **No production code changes** — scoped entirely to `playwright-ts/`.
