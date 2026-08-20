## Context

See `proposal.md` (Why) for motivation and `specs/playwright-ts/signup-testing/spec.md` for the requirements this design implements.

One constraint from the existing `playwright-ts` scaffold shapes this design:

- **The three Playwright projects (`api`, `ui`, `mocking`) share one `playwright.config.ts` `use.baseURL`, currently wired only to `TESTPORTAL_BASE_URL` (the backend, `http://localhost:3001`)**. `api` tests want that. `ui`/`mocking` tests need to navigate pages served by `TestPortal-client` (`http://localhost:5173`), which today has no configuration point.

`playwright-ts` also has an existing `playwright-test-planner`/`generator`/`healer` agent pipeline (`playwright-ts/.claude/agents/`, capability at `openspec/specs/playwright-test-authoring-agents`) for browser-driven, exploration-first test authoring. This change doesn't use it — see Decision 1.

## Goals / Non-Goals

**Goals:**
- Decide how each of the three requirement groups in specs (API validation, mocked-UI, E2E) actually gets authored.
- Wire Playwright config so `ui`/`mocking` tests can reach the live client app without hardcoding URLs.
- Define the test-data strategy for the unique-email requirement.
- Set file/naming conventions under `tests/api`, `tests/mocking`, `tests/ui`.

**Non-Goals:**
- Fixing the app-level issues the exploration surfaced (client discarding backend error/success text) — out of scope for a test-only change; worth flagging to the product team separately.
- Covering the `/v2/users/signup` compatibility alias route — proposal scopes this suite to the primary `/v2/auth/signup` route.
- Testing the `cognito` auth provider path, or the admin approve/suspend/restore endpoints beyond the single "pending account can't log in" assertion the spec requires.
- Adding user cleanup/deletion tooling.

## Decisions

### 1. Tests are hand-authored directly, not agent-generated
All three layers (`tests/api`, `tests/mocking`, `tests/ui`) are written directly against this change's own validated artifacts — `specs/playwright-ts/signup-testing/spec.md` for scenarios, this `design.md` for implementation approach — using `playwright-cli` for live verification against the running app during authoring, the same way this change's own exploration findings were confirmed. `playwright-ts` has an existing `playwright-test-planner`/`generator`/`healer` agent pipeline (`openspec/specs/playwright-test-authoring-agents`) built for browser-driven, exploration-first authoring; it isn't used here since this change's scenarios were already discovered and validated through OpenSpec artifacts rather than needing live (re-)discovery, though a dedicated test-generation skill fitted to this OpenSpec-driven flow may be built later.

### 2. Add a second base-URL config point for the client origin
Add `TESTPORTAL_CLIENT_URL` (default `http://localhost:5173`) alongside the existing `TESTPORTAL_BASE_URL`, and give the `ui` and `mocking` projects their own `use: { baseURL: TESTPORTAL_CLIENT_URL }` override in `playwright.config.ts`; `api` keeps `TESTPORTAL_BASE_URL`. This is additive to the `playwright-ts` scaffold's existing "configurable TestPortal target" requirement, not a change to it — it introduces a second, analogous configuration point rather than altering the first.

*Alternative considered*: hardcode `http://localhost:5173` in each UI/mocking test's `page.goto()`. Rejected — reintroduces exactly the hardcoded-live-instance problem the scaffold's spec already forbids.

### 3. Unique-email fixture, no cleanup
A small shared helper (e.g. `tests/api/fixtures/signup.ts`, reused by `tests/ui`) generates unique `@ventionteams.com` emails per test (timestamp + worker index + random suffix), following the pattern used during live exploration (`qa.explore.<timestamp>@ventionteams.com`). Created accounts are left as `pending` in the dev database indefinitely — no teardown is implemented.

*Alternative considered*: delete created users after each test via an authenticated admin call. Rejected for now — signup tests are deliberately unauthenticated, and bootstrapping an approved admin session purely for cleanup adds real setup complexity for a local/dev database that doesn't need long-term hygiene. Revisit if this suite ever runs against a shared, longer-lived environment.

### 4. Mocked-UI tests assert outcome shape, never backend-specific wording
Per the spec's "Mocked UI submission outcome states" requirement, mocked tests assert only the generic success/failure UI branch and page state (navigated vs. stayed), never a specific backend error string — matching the confirmed reality that the client discards per-cause backend text. This keeps mocked tests resilient to backend message wording changes and correctly scopes wording assertions to the API-level tests, which do assert exact backend strings.

### 5. One spec file per scenario group
`tests/api/signup-success.spec.ts`, `tests/api/signup-validation-errors.spec.ts` (missing fields / bad email / weak password / wrong domain / duplicate, grouped or split further during authoring), `tests/api/signup-pending-account-login-blocked.spec.ts`, `tests/mocking/signup-field-validation.spec.ts`, `tests/mocking/signup-submission-outcomes.spec.ts`, `tests/ui/signup-happy-path.spec.ts`, `tests/ui/signup-duplicate-email.spec.ts` — one file per requirement group in specs, named for what it covers.

## Risks / Trade-offs

- [Risk] No cleanup means the dev database accumulates `pending` users indefinitely across suite runs → [Mitigation] Acceptable for a local/dev database; revisit with a cleanup fixture if the suite targets a shared/persistent environment.
- [Risk] Hand-authored tests skip the live-verified capture the generator agent would otherwise provide, so selectors/assertions rely on manual `playwright-cli` verification during authoring instead → [Mitigation] Author against the confirmed selectors and response shapes already recorded in specs/proposal from this change's own live exploration, and re-verify live with `playwright-cli` while writing each test rather than trusting recall.
- [Risk] `TESTPORTAL_CLIENT_URL` is a new configuration surface on the `playwright-ts` scaffold without an accompanying spec delta on that capability → [Mitigation] It's additive within the scaffold's existing "configurable target, no hardcoded instance" requirement; no existing requirement text changes.

## Resolved Questions

- **Alias route**: `tests/api` covers only the primary `POST /v2/auth/signup` route. The `/v2/users/signup` compatibility alias hits the same handler and is not covered separately.
- **Provider guard**: No guard/skip against a `cognito`-configured backend is added. The suite assumes the local dev default (`AUTH_PROVIDER=local`, confirmed live via `GET /api/v2/auth/config`); running against a `cognito` environment would fail loudly rather than skip silently.
